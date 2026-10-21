-- ============================================================
-- 【线下活动】管理后台菜单：「活动」
-- 位置：内容中心（parent_id=1637）下的独立一级菜单，与资讯/专栏/直播/课程平级
-- 组件：cms/activity/index（component_name: CmsActivity）
-- 写法参考：ruoyi-vue-pro/sql/mysql/ruoyi-vue-pro.sql 中 id=1708（表单管理）的 INSERT 格式
-- 注意1：id=12600 已被「友情链接」菜单占用，故用 12660；如冲突可自行调整，
--        也可通过 系统管理-菜单管理 手动添加
-- 注意2：不要挂到 1801（专栏）下面——专栏是页面菜单，挂子菜单会使其变成目录
--        导致专栏页面入口丢失；活动管理必须挂在 1637 下作为独立叶子菜单
-- ============================================================

INSERT INTO `system_menu` (`id`, `name`, `permission`, `type`, `sort`, `parent_id`, `path`, `icon`, `component`, `component_name`, `status`, `visible`, `keep_alive`, `always_show`, `creator`, `create_time`, `updater`, `update_time`, `deleted`) VALUES (12660, '活动', '', 2, 4, 1637, 'activity', 'ep:calendar', 'cms/activity/index', 'CmsActivity', 0, b'1', b'1', b'1', 'admin', '2026-10-16 10:00:00', 'admin', '2026-10-16 10:00:00', b'0');

-- 若此前错误挂载到 1801 下，执行以下修正（活动改为 1637 直接子菜单，配置/统计目录顺延）
-- UPDATE `system_menu` SET `parent_id` = 1637, `sort` = 4 WHERE `id` = 12660;
-- UPDATE `system_menu` SET `sort` = 6 WHERE `id` = 1804;
-- UPDATE `system_menu` SET `sort` = 7 WHERE `id` = 1808;
