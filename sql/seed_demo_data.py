# -*- coding: utf-8 -*-
"""芋道商城演示数据：品牌 + 分类 + 商品(SPU/SKU) + 首页装修。可重复执行（幂等）。"""
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = "http://localhost:48080/admin-api"
TOKEN = None


def call(method, path, body=None):
    url = BASE + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Content-Type", "application/json")
    req.add_header("tenant-id", "1")
    if TOKEN:
        req.add_header("Authorization", "Bearer " + TOKEN)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return {"code": e.code, "msg": e.read().decode("utf-8")}


def must(res, what):
    if res.get("code") != 0:
        raise RuntimeError("%s 失败: %s" % (what, json.dumps(res, ensure_ascii=False)))
    print("  OK  %s" % what)
    return res.get("data")


def img(prompt, size="square"):
    return ("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=%s&image_size=%s"
            % (urllib.parse.quote(prompt), size))


def ensure(find_path, find_key, name, create_path, payload):
    """先查后建，返回 id"""
    res = call("GET", "%s?%s=%s" % (find_path, find_key, urllib.parse.quote(name)))
    if res.get("code") == 0:
        for item in (res.get("data") or []):
            if item.get("name") == name:
                return item["id"]
    return must(call("POST", create_path, payload), "创建 %s" % name)


def main():
    global TOKEN
    # ---------- 1. 登录 ----------
    data = must(call("POST", "/system/auth/login",
                     {"username": "admin", "password": "admin123"}), "管理员登录")
    TOKEN = data["accessToken"]

    # ---------- 2. 品牌 ----------
    brand_id = ensure("/product/brand/list", "name", "芋道自营", "/product/brand/create",
                      {"name": "芋道自营", "picUrl": img("brand logo, minimal, red"), "sort": 1,
                       "status": 0, "description": "芋道商城自营品牌"})

    # ---------- 3. 分类（一级 + 二级） ----------
    tree = [
        ("手机数码", [("智能手机", "smartphone product photo, clean white background"),
                  ("智能穿戴", "smart watch product photo, clean white background")]),
        ("服饰鞋包", [("男装T恤", "plain cotton t-shirt product photo, white background"),
                  ("运动鞋", "running shoes product photo, white background")]),
        ("食品饮料", [("休闲零食", "mixed nuts snack pack product photo"),
                  ("咖啡茶饮", "drip coffee bag product photo")]),
        ("家居日用", [("收纳整理", "desk storage box product photo")]),
    ]
    level2 = {}
    for l1_name, children in tree:
        l1_id = ensure("/product/category/list", "name", l1_name, "/product/category/create",
                       {"parentId": 0, "name": l1_name, "picUrl": img(l1_name + " category icon"),
                        "sort": 1, "status": 0, "description": l1_name})
        for l2_name, prompt in children:
            l2_id = ensure("/product/category/list", "name", l2_name, "/product/category/create",
                           {"parentId": l1_id, "name": l2_name, "picUrl": img(prompt),
                            "sort": 1, "status": 0, "description": l2_name})
            level2[l2_name] = l2_id

    # ---------- 4. 运费模板（包邮） ----------
    tpl_res = call("GET", "/trade/delivery/express-template/list?pageSize=100")
    tpl_id = None
    if tpl_res.get("code") == 0:
        for t in (tpl_res.get("data") or []):
            if t.get("name") == "全国包邮":
                tpl_id = t["id"]
    if tpl_id is None:
        tpl_id = must(call("POST", "/trade/delivery/express-template/create",
                           {"name": "全国包邮", "chargeMode": 1, "sort": 1,
                            "charges": [{"areaIds": [0], "startCount": 1.0, "startPrice": 0,
                                         "extraCount": 1.0, "extraPrice": 0}],
                            "frees": []}), "创建运费模板")
    print("  运费模板 id=%s" % tpl_id)

    # ---------- 5. 商品 ----------
    products = [
        ("iPhone 15 Pro 全网通 5G 手机", "智能手机", "全新 A17 Pro 芯片，钛金属机身，专业级三摄系统",
         "旗舰级 5G 智能手机，搭载 A17 Pro 芯片，支持 ProMotion 自适应刷新率，钛金属中框。", 699900, 200,
         "iPhone 15 Pro smartphone product photo, white background"),
        ("智能运动手表 心率血氧监测", "智能穿戴", "全天候心率监测，50 米防水，14 天超长续航",
         "支持心率、血氧、睡眠监测，内置 100+ 运动模式，50 米防水。", 89900, 500,
         "smart sports watch product photo, white background"),
        ("纯棉短袖T恤 男士夏季新款", "男装T恤", "新疆长绒棉，亲肤透气，多色可选",
         "100% 新疆长绒棉，克重 220g，不易变形起球，夏季百搭。", 12900, 1000,
         "plain cotton t-shirt product photo, white background"),
        ("轻量跑步鞋 缓震透气", "运动鞋", "超轻网面，回弹缓震，日常通勤跑鞋",
         "单只仅重 235g，全掌回弹中底，透气网面鞋身。", 49900, 800,
         "lightweight running shoes product photo, white background"),
        ("每日坚果混合装 750g", "休闲零食", "6 种坚果 + 3 种果干，独立小包装",
         "每日一包，科学配比，独立小包装锁鲜。", 8990, 1500,
         "mixed nuts snack pack product photo, white background"),
        ("精品挂耳咖啡 10 片装", "咖啡茶饮", "阿拉比卡豆现磨，冷萃风味，3 秒手冲",
         "精选云南 + 埃塞俄比亚阿拉比卡豆，中深烘焙，10 片独立包装。", 6900, 1200,
         "drip coffee bag product photo, white background"),
        ("桌面收纳盒 大容量多格", "收纳整理", "环保 PP 材质，多格分区，桌面整洁利器",
         "环保 PP 材质，可自由组合分隔，承重 5kg。", 3990, 2000,
         "desk storage organizer box product photo, white background"),
    ]

    spu_ids = []
    for name, cat_name, keyword, desc, price, stock, prompt in products:
        existing = call("GET", "/product/spu/list?name=%s&pageSize=10" % urllib.parse.quote(name))
        found = None
        if existing.get("code") == 0:
            for s in ((existing.get("data") or {}).get("list") or []):
                if s.get("name") == name:
                    found = s["id"]
                    break
        if found:
            spu_ids.append(found)
            print("  跳过已存在商品 %s (id=%s)" % (name, found))
            continue
        pic = img(prompt)
        spu_id = must(call("POST", "/product/spu/create", {
            "name": name,
            "keyword": keyword,
            "introduction": keyword,
            "description": desc,
            "categoryId": level2[cat_name],
            "brandId": brand_id,
            "picUrl": pic,
            "sliderPicUrls": [pic, img(prompt + ", side view"), img(prompt + ", detail view")],
            "sort": 1,
            "specType": False,
            "deliveryTypes": [1],
            "deliveryTemplateId": tpl_id,
            "giveIntegral": 0,
            "subCommissionType": False,
            "virtualSalesCount": 100,
            "skus": [{"name": name, "price": price, "picUrl": pic, "stock": stock}],
        }), "创建商品 %s" % name)
        spu_ids.append(spu_id)

    print("\n商品编号：%s" % spu_ids)

    # ---------- 6. 首页装修 ----------
    pages = must(call("GET", "/promotion/diy-page/list?ids=1,2"), "查询装修页面")
    home_page = next((p for p in pages if p["name"] == "首页"), None)
    if home_page is None:
        raise RuntimeError("未找到「首页」装修页面")

    banner1 = img("e-commerce summer sale banner, smartphone and headphones, "
                  "orange gradient background, modern", "landscape_4_3")
    banner2 = img("e-commerce new arrival banner, sneakers and t-shirt, "
                  "blue gradient background, modern", "landscape_4_3")

    home_property = {
        "page": {"description": "", "backgroundColor": "#f5f5f5", "backgroundImage": ""},
        "navigationBar": {
            "bgType": "color", "bgColor": "#ffffff", "bgImg": "", "styleType": "normal",
            "showType": "always", "alwaysShow": True,
            "mpCells": [{"type": "text", "textColor": "#111111"}],
            "otherCells": [{"type": "text", "textColor": "#111111"}],
            "_local": {"previewMp": True, "previewOther": False},
        },
        "components": [
            {"id": "SearchBar", "property": {
                "height": 28, "showScan": False, "borderRadius": 999, "placeholder": "搜索商品",
                "placeholderPosition": "left", "backgroundColor": "rgb(238, 238, 238)",
                "textColor": "rgb(150, 151, 153)", "hotKeywords": [],
                "style": {"bgType": "color", "bgColor": "#fff", "marginBottom": 8,
                          "paddingTop": 8, "paddingRight": 8, "paddingBottom": 8, "paddingLeft": 8}}},
            {"id": "Carousel", "property": {
                "type": "default", "indicator": "dot", "autoplay": True, "interval": 3,
                "height": 174,
                "items": [{"type": "img", "imgUrl": banner1, "videoUrl": "", "url": ""},
                          {"type": "img", "imgUrl": banner2, "videoUrl": "", "url": ""}],
                "style": {"bgType": "color", "bgColor": "#fff", "marginBottom": 8}}},
            {"id": "TitleBar", "property": {
                "title": "热门推荐", "description": "为你精选", "bgImgUrl": "", "marginLeft": 0,
                "textAlign": "left", "titleSize": 16, "descriptionSize": 12, "titleWeight": 600,
                "descriptionWeight": 200, "titleColor": "rgba(50, 50, 51, 10)",
                "descriptionColor": "rgba(150, 151, 153, 10)", "height": 40,
                "more": {"show": False, "type": "icon", "text": "查看更多", "url": ""},
                "style": {"bgType": "color", "bgColor": "#fff", "marginBottom": 8}}},
            {"id": "ProductList", "property": {
                "layoutType": "twoCol",
                "fields": {"name": {"show": True, "color": "#000"},
                           "price": {"show": True, "color": "#ff3000"}},
                "badge": {"show": False, "imgUrl": ""},
                "borderRadiusTop": 8, "borderRadiusBottom": 8, "space": 8,
                "spuIds": spu_ids,
                "style": {"bgType": "color", "bgColor": "", "marginLeft": 8,
                          "marginRight": 8, "marginBottom": 8}}},
        ],
    }

    must(call("PUT", "/promotion/diy-page/update-property",
              {"id": home_page["id"], "property": json.dumps(home_property, ensure_ascii=False)}),
         "装修首页")

    # ---------- 7. 校验 ----------
    used = call("GET", "/app-api/promotion/diy-template/used")
    print("\nC 端装修模板返回：%s" % json.dumps(used, ensure_ascii=False)[:200])
    print("\n全部完成。")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("\n出错：%s" % e)
        sys.exit(1)