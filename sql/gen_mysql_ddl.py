#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 yudao 后端实体类（dal/dataobject 下的 *DO）解析生成 MySQL 建表语句。
仅覆盖未包含在 ruoyi-vue-pro.sql 里的业务模块：member / pay / mall(product、promotion、trade、statistics)。
"""
import os
import re
import sys

ROOT = "/Users/code/yudao/ruoyi-vue-pro"
OUT = "/Users/code/yudao/sql/generated_mall_member_pay.sql"

MODULES = [
    ("会员", "yudao-module-member"),
    ("支付", "yudao-module-pay"),
    ("商品", "yudao-module-mall/yudao-module-product"),
    ("营销", "yudao-module-mall/yudao-module-promotion"),
    ("交易", "yudao-module-mall/yudao-module-trade"),
    ("统计", "yudao-module-mall/yudao-module-statistics"),
]

# Java 类型 -> MySQL 类型
TYPE_MAP = {
    "Long": "bigint", "long": "bigint",
    "Integer": "int", "int": "int",
    "Short": "smallint", "short": "smallint",
    "Byte": "tinyint", "byte": "tinyint",
    "Boolean": "bit(1)", "boolean": "bit(1)",
    "String": "varchar(255)",
    "BigDecimal": "decimal(10,2)",
    "Double": "double", "double": "double",
    "Float": "float", "float": "float",
    "LocalDateTime": "datetime",
    "LocalDate": "date",
    "LocalTime": "time",
    "byte[]": "varbinary(255)",
}
# 集合 / Map / 自定义对象，落库为 json
JSON_TYPES = {"List", "Set", "Map", "ArrayList", "JSONArray", "JSONObject", "Area"}
# 列表类 TypeHandler：逗号分隔存储
LIST_HANDLER = {
    "LongListTypeHandler": "varchar(500)",
    "IntegerListTypeHandler": "varchar(500)",
    "StringListTypeHandler": "varchar(1000)",
    "JacksonTypeHandler": "json",
    "PayClientConfigTypeHandler": "json",
}
# 字段名包含以下关键词时，使用 longtext（JSON 结构化内容，可能很大）
LONGTEXT_KEYWORDS = ("property", "content", "snapshot", "json", "config", "data", "params",
                     "body", "response", "request", "html", "template", "script", "log")
# 字段名包含以下关键词时，使用 text，避免内容超长截断
TEXT_KEYWORDS = ("detail", "description", "remark", "memo", "reason", "message", "result",
                 "url", "urls", "pic", "image", "images", "token")

AUDIT_COLUMNS = [
    ("creator", "varchar(64)"),
    ("create_time", "datetime"),
    ("updater", "varchar(64)"),
    ("update_time", "datetime"),
    ("deleted", "bit(1)"),
]


def strip_comments(text):
    """去掉注释，同时把 Javadoc 首行保留为 DOC: 标记，用于生成列注释"""
    def repl(m):
        first = ""
        for line in m.group(0).splitlines():
            line = line.strip().lstrip("/*").strip()
            if line and not line.startswith("@"):
                first = line
                break
        # 去掉花括号，避免干扰结构解析
        return "\nDOC:%s\n" % first.replace("{", "(").replace("}", ")")

    text = re.sub(r"/\*\*[\s\S]*?\*/", repl, text)
    text = re.sub(r"/\*[\s\S]*?\*/", lambda m: "\n", text)
    text = re.sub(r"//[^\n]*", "", text)
    return text


def camel_to_snake(name):
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", name)
    s = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1_\2", s)
    return s.lower()


def collect_fields(body):
    """按分号切分类体顶层的语句块，返回字段块列表"""
    chunks, buf, depth = [], [], 1
    for ch in body:
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
        if depth == 1 and ch == ";":
            chunks.append("".join(buf))
            buf = []
        elif depth == 1:
            buf.append(ch)
        else:
            buf = []  # 方法体 / 内部类内部忽略
    return [c for c in chunks if "private" in c and "{" not in c]


def parse_do(path):
    raw = open(path, encoding="utf-8").read()
    text = strip_comments(raw)

    m = re.search(r'@TableName\(\s*(?:value\s*=\s*)?"([^"]+)"', text)
    if not m:
        return None
    table = m.group(1)

    m = re.search(r"public\s+(?:abstract\s+)?class\s+(\w+)\s+extends\s+([\w\.]+)", text)
    if not m:
        return None
    cls, base = m.group(1), m.group(2).split(".")[-1]

    start = text.index("{", m.end())
    body = text[start + 1:]

    fields, pk, unknown, skipped = [], None, [], []
    for chunk in collect_fields(body):
        if "serialVersionUID" in chunk:
            continue
        fm = re.search(r"private\s+(?:static\s+)?([A-Za-z_][\w\.\[\]<>,\s]*?)\s+([a-z_]\w*)\s*$", chunk, re.S)
        if not fm:
            skipped.append(" ".join(chunk.split())[:80])
            continue
        java_type = fm.group(1).strip()
        name = fm.group(2)

        tf = re.search(r"@TableField\(([^)]*)\)", chunk)
        if tf and "exist = false" in tf.group(1):
            continue
        column = None
        if tf:
            vm = re.search(r'(?:value\s*=\s*)?"([^"]+)"', tf.group(1))
            if vm:
                column = vm.group(1)
        column = column or camel_to_snake(name)

        handler = None
        if tf:
            hm = re.search(r"typeHandler\s*=\s*(\w+)", tf.group(1))
            if hm:
                handler = hm.group(1)

        sql_type = mysql_type(java_type, name, handler)
        if sql_type is None:
            unknown.append((table, name, java_type))

        if "@TableId" in chunk:
            pk = (column, java_type)
        docs = re.findall(r"DOC:\s*([^\n]*)", chunk)
        comment = docs[-1].strip().replace("'", "")[:60] if docs else ""
        fields.append({
            "java_type": java_type, "name": name, "column": column,
            "sql": sql_type or "varchar(255)",
            "comment": comment,
        })
    return {"class": cls, "table": table, "base": base, "fields": fields, "pk": pk,
            "unknown": unknown, "skipped": skipped,
            "tenant": "@TenantIgnore" not in raw}


def mysql_type(java_type, name, handler):
    if handler and handler in LIST_HANDLER:
        return LIST_HANDLER[handler]
    base = java_type.split("<")[0].strip()
    if base.endswith("[]"):
        return TYPE_MAP.get(base, "varbinary(255)")
    if base in JSON_TYPES or java_type != base:
        return "json"
    if base in TYPE_MAP:
        t = TYPE_MAP[base]
        if t == "varchar(255)":
            low = name.lower()
            if any(k in low for k in LONGTEXT_KEYWORDS):
                return "longtext"
            if any(k in low for k in TEXT_KEYWORDS):
                return "text"
        return t
    return None


def render(do):
    cols = []
    for f in do["fields"]:
        line = "    `%s` %s" % (f["column"], f["sql"])
        if f["comment"]:
            line += " COMMENT '%s'" % f["comment"]
        cols.append(line)
    if do["tenant"]:
        cols.insert(0, "    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号'")
    cols.append("    `creator` varchar(64) DEFAULT '' COMMENT '创建者'")
    cols.append("    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'")
    cols.append("    `updater` varchar(64) DEFAULT '' COMMENT '更新者'")
    cols.append("    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'")
    cols.append("    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除'")

    pk_col, pk_type = do["pk"] or ("id", "Long")
    pk_sql = "    PRIMARY KEY (`%s`)" % pk_col
    for i, c in enumerate(cols):
        if c.strip().startswith("`%s`" % pk_col):
            auto = " AUTO_INCREMENT" if pk_type in ("Long", "long", "Integer", "int") else ""
            cols[i] = c + (" NOT NULL" if "NOT NULL" not in c else "") + auto
            break

    return "-- %s\nDROP TABLE IF EXISTS `%s`;\nCREATE TABLE `%s` (\n%s,\n%s\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='%s';\n" % (
        do["class"], do["table"], do["table"], ",\n".join(cols), pk_sql, do["class"].replace("DO", ""),
    )


def main(modules=None, out=None):
    modules = modules or MODULES
    out = out or OUT
    dos, unknown, seen, skipped = [], [], set(), []
    for label, rel in modules:
        base = os.path.join(ROOT, rel)
        for dirpath, _, filenames in os.walk(base):
            if "/dal/dataobject" not in dirpath.replace("\\", "/"):
                continue
            for fn in filenames:
                if not fn.endswith(".java"):
                    continue
                do = parse_do(os.path.join(dirpath, fn))
                if not do:
                    continue
                if do["table"] in seen:
                    print("!! 表名重复：%s (%s)" % (do["table"], fn), file=sys.stderr)
                seen.add(do["table"])
                dos.append((label, rel, do))
                unknown.extend(do["unknown"])
                skipped.extend([(do["table"], s) for s in do["skipped"]])

    groups = {}
    for label, rel, do in dos:
        groups.setdefault(label, []).append(render(do))

    with open(out, "w", encoding="utf-8") as f:
        f.write("-- 由实体类自动生成（yudao 业务模块建表语句）\n")
        f.write("-- 生成时间：见文件修改时间；数据来源：各模块 dal/dataobject 下的 *DO\n")
        f.write("-- 注意：默认无业务索引、无演示数据，仅保证实体读写不报错\n\n")
        for label, rel, _ in [(l, r, None) for l, r in modules]:
            if label not in groups:
                continue
            f.write("\n-- ==================== %s模块 ====================\n" % label)
            f.write("".join(groups[label]))

    print("生成表数：%d（文件：%s）" % (len(dos), out))
    for label, rel, _ in [(l, r, None) for l, r in modules]:
        if label in groups:
            print("  %s模块：%d 张" % (label, len(groups[label])))
    if unknown:
        print("\n未识别类型（已兜底为 varchar(255)，需人工确认）：")
        for t, n, jt in unknown:
            print("  %s.%s : %s" % (t, n, jt))
    else:
        print("\n未识别类型：无")
    if skipped:
        print("\n未解析的字段段落（需人工确认，共 %d 处）：" % len(skipped))
        for t, s in skipped[:20]:
            print("  %s : %s" % (t, s))
    else:
        print("未解析字段：无")


if __name__ == "__main__":
    # 用法：python3 gen_mysql_ddl.py [输出文件] [标签=模块相对路径 ...]
    # 不传参数时，使用文件顶部的默认配置（member / pay / 商城各模块）
    argv = sys.argv[1:]
    main(out=argv[0] if argv else None,
         modules=[tuple(a.split("=", 1)) for a in argv[1:]] or None)