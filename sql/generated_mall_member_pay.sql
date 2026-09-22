-- 由实体类自动生成（yudao 业务模块建表语句）
-- 生成时间：见文件修改时间；数据来源：各模块 dal/dataobject 下的 *DO
-- 注意：默认无业务索引、无演示数据，仅保证实体读写不报错


-- ==================== 会员模块 ====================
-- MemberConfigDO
DROP TABLE IF EXISTS `member_config`;
CREATE TABLE `member_config` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '自增主键' NOT NULL AUTO_INCREMENT,
    `point_trade_deduct_enable` bit(1) COMMENT '积分抵扣开关',
    `point_trade_deduct_unit_price` int COMMENT '积分抵扣，单位：分',
    `point_trade_deduct_max_price` int COMMENT '积分抵扣最大值',
    `point_trade_give_point` int COMMENT '1 元赠送多少分',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberConfig';
-- MemberGroupDO
DROP TABLE IF EXISTS `member_group`;
CREATE TABLE `member_group` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '名称',
    `remark` text COMMENT '备注',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberGroup';
-- MemberPointRecordDO
DROP TABLE IF EXISTS `member_point_record`;
CREATE TABLE `member_point_record` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '自增主键' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `biz_id` varchar(255) COMMENT '业务编码',
    `biz_type` int COMMENT '业务类型',
    `title` varchar(255) COMMENT '积分标题',
    `description` longtext COMMENT '积分描述',
    `point` int COMMENT '变动积分',
    `total_point` int COMMENT '变动后的积分',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberPointRecord';
-- MemberUserDO
DROP TABLE IF EXISTS `member_user`;
CREATE TABLE `member_user` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '用户ID' NOT NULL AUTO_INCREMENT,
    `mobile` varchar(255) COMMENT '手机',
    `email` varchar(255) COMMENT '邮箱',
    `password` varchar(255) COMMENT '加密后的密码',
    `status` int COMMENT '帐号状态',
    `register_ip` varchar(255) COMMENT '注册 IP',
    `register_terminal` int COMMENT '注册终端',
    `login_ip` longtext COMMENT '最后登录IP',
    `login_date` datetime COMMENT '最后登录时间',
    `nickname` varchar(255) COMMENT '用户昵称',
    `avatar` varchar(255) COMMENT '用户头像',
    `name` varchar(255) COMMENT '真实名字',
    `sex` int COMMENT '性别',
    `birthday` datetime COMMENT '出生日期',
    `area_id` int COMMENT '所在地',
    `mark` varchar(255) COMMENT '用户备注',
    `point` int COMMENT '积分',
    `tag_ids` varchar(500) COMMENT '会员标签列表，以逗号分隔',
    `level_id` bigint COMMENT '会员级别编号',
    `experience` int COMMENT '会员经验',
    `group_id` bigint COMMENT '用户分组编号',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberUser';
-- MemberSignInRecordDO
DROP TABLE IF EXISTS `member_sign_in_record`;
CREATE TABLE `member_sign_in_record` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '签到用户',
    `day` int COMMENT '第几天签到',
    `point` int COMMENT '签到的积分',
    `experience` int COMMENT '签到的经验',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberSignInRecord';
-- MemberSignInConfigDO
DROP TABLE IF EXISTS `member_sign_in_config`;
CREATE TABLE `member_sign_in_config` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '规则自增主键' NOT NULL AUTO_INCREMENT,
    `day` int COMMENT '签到第 x 天',
    `point` int COMMENT '奖励积分',
    `experience` int COMMENT '奖励经验',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberSignInConfig';
-- MemberAddressDO
DROP TABLE IF EXISTS `member_address`;
CREATE TABLE `member_address` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `name` varchar(255) COMMENT '收件人名称',
    `mobile` varchar(255) COMMENT '手机号',
    `area_id` bigint COMMENT '地区编号',
    `detail_address` text COMMENT '收件详细地址',
    `default_status` bit(1) COMMENT '是否默认',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberAddress';
-- MemberLevelDO
DROP TABLE IF EXISTS `member_level`;
CREATE TABLE `member_level` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '等级名称',
    `level` int COMMENT '等级',
    `experience` int COMMENT '升级经验',
    `discount_percent` int COMMENT '享受折扣',
    `icon` varchar(255) COMMENT '等级图标',
    `background_url` text COMMENT '等级背景图',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberLevel';
-- MemberLevelRecordDO
DROP TABLE IF EXISTS `member_level_record`;
CREATE TABLE `member_level_record` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `level_id` bigint COMMENT '等级编号',
    `level` int COMMENT '会员等级',
    `discount_percent` int COMMENT '享受折扣',
    `experience` int COMMENT '升级经验',
    `user_experience` int COMMENT '会员此时的经验',
    `remark` text COMMENT '备注',
    `description` longtext COMMENT '描述',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberLevelRecord';
-- MemberExperienceRecordDO
DROP TABLE IF EXISTS `member_experience_record`;
CREATE TABLE `member_experience_record` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `biz_type` int COMMENT '业务类型',
    `biz_id` varchar(255) COMMENT '业务编号',
    `title` varchar(255) COMMENT '标题',
    `description` longtext COMMENT '描述',
    `experience` int COMMENT '经验',
    `total_experience` int COMMENT '变更后的经验',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberExperienceRecord';
-- MemberTagDO
DROP TABLE IF EXISTS `member_tag`;
CREATE TABLE `member_tag` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '标签名称',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MemberTag';

-- ==================== 支付模块 ====================
-- PayDemoWithdrawDO
DROP TABLE IF EXISTS `pay_demo_withdraw`;
CREATE TABLE `pay_demo_withdraw` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '提现单编号，自增' NOT NULL AUTO_INCREMENT,
    `subject` varchar(255) COMMENT '提现标题',
    `price` int COMMENT '提现金额，单位：分',
    `user_account` varchar(255) COMMENT '收款人账号',
    `user_name` varchar(255) COMMENT '收款人姓名',
    `type` int COMMENT '提现方式',
    `status` int COMMENT '提现状态',
    `pay_transfer_id` bigint COMMENT '转账单编号',
    `transfer_channel_code` varchar(255) COMMENT '转账渠道',
    `transfer_time` datetime COMMENT '转账成功时间',
    `transfer_error_msg` varchar(255) COMMENT '转账错误提示',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayDemoWithdraw';
-- PayDemoOrderDO
DROP TABLE IF EXISTS `pay_demo_order`;
CREATE TABLE `pay_demo_order` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '订单编号，自增' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `spu_id` bigint COMMENT '商品编号',
    `spu_name` varchar(255) COMMENT '商品名称',
    `price` int COMMENT '价格，单位：分',
    `pay_status` bit(1) COMMENT '是否支付',
    `pay_order_id` bigint COMMENT '支付订单编号',
    `pay_time` datetime COMMENT '付款时间',
    `pay_channel_code` varchar(255) COMMENT '支付渠道',
    `pay_refund_id` bigint COMMENT '支付退款单号',
    `refund_price` int COMMENT '退款金额，单位：分',
    `refund_time` datetime COMMENT '退款完成时间',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayDemoOrder';
-- PayOrderExtensionDO
DROP TABLE IF EXISTS `pay_order_extension`;
CREATE TABLE `pay_order_extension` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '订单拓展编号，数据库自增' NOT NULL AUTO_INCREMENT,
    `no` varchar(255) COMMENT '外部订单号，根据规则生成',
    `order_id` bigint COMMENT '订单号',
    `channel_id` bigint COMMENT '渠道编号',
    `channel_code` varchar(255) COMMENT '渠道编码',
    `user_ip` varchar(255) COMMENT '用户 IP',
    `status` int COMMENT '支付状态',
    `channel_extras` json COMMENT '支付渠道的额外参数',
    `channel_error_code` varchar(255) COMMENT '调用渠道的错误码',
    `channel_error_msg` varchar(255) COMMENT '调用渠道报错时，错误信息',
    `channel_notify_data` longtext COMMENT '支付渠道的同步/异步通知的内容',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayOrderExtension';
-- PayOrderDO
DROP TABLE IF EXISTS `pay_order`;
CREATE TABLE `pay_order` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '订单编号，数据库自增' NOT NULL AUTO_INCREMENT,
    `app_id` bigint COMMENT '应用编号',
    `channel_id` bigint COMMENT '渠道编号',
    `channel_code` varchar(255) COMMENT '渠道编码',
    `user_id` bigint COMMENT '用户编号',
    `user_type` int COMMENT '用户类型',
    `merchant_order_id` varchar(255) COMMENT '商户订单编号',
    `subject` varchar(255) COMMENT '商品标题',
    `body` longtext COMMENT '商品描述信息',
    `notify_url` text COMMENT '异步通知地址',
    `price` int COMMENT '支付金额，单位：分',
    `channel_fee_rate` double COMMENT '渠道手续费，单位：百分比',
    `channel_fee_price` int COMMENT '渠道手续金额，单位：分',
    `status` int COMMENT '支付状态',
    `user_ip` varchar(255) COMMENT '用户 IP',
    `expire_time` datetime COMMENT '订单失效时间',
    `success_time` datetime COMMENT '订单支付成功时间',
    `extension_id` bigint COMMENT '支付成功的订单拓展单编号',
    `no` varchar(255) COMMENT '支付成功的外部订单号',
    `refund_price` int COMMENT '退款总金额，单位：分',
    `channel_user_id` varchar(255) COMMENT '渠道用户编号',
    `channel_order_no` varchar(255) COMMENT '渠道订单号',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayOrder';
-- PayNotifyLogDO
DROP TABLE IF EXISTS `pay_notify_log`;
CREATE TABLE `pay_notify_log` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '日志编号，自增' NOT NULL AUTO_INCREMENT,
    `task_id` bigint COMMENT '通知任务编号',
    `notify_times` int COMMENT '第几次被通知',
    `response` longtext COMMENT 'HTTP 响应结果',
    `status` int COMMENT '支付通知状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayNotifyLog';
-- PayNotifyTaskDO
DROP TABLE IF EXISTS `pay_notify_task`;
CREATE TABLE `pay_notify_task` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，自增' NOT NULL AUTO_INCREMENT,
    `app_id` bigint COMMENT '应用编号',
    `type` int COMMENT '通知类型',
    `data_id` bigint COMMENT '数据编号，根据不同 type 进行关联：',
    `merchant_order_id` varchar(255) COMMENT '商户订单编号',
    `merchant_refund_id` varchar(255) COMMENT '商户退款编号',
    `merchant_transfer_id` varchar(255) COMMENT '商户转账编号',
    `status` int COMMENT '通知状态',
    `next_notify_time` datetime COMMENT '下一次通知时间',
    `last_execute_time` datetime COMMENT '最后一次执行时间',
    `notify_times` int COMMENT '当前通知次数',
    `max_notify_times` int COMMENT '最大可通知次数',
    `notify_url` text COMMENT '通知地址',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayNotifyTask';
-- PayAppDO
DROP TABLE IF EXISTS `pay_app`;
CREATE TABLE `pay_app` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '应用编号，数据库自增' NOT NULL AUTO_INCREMENT,
    `app_key` varchar(255) COMMENT '应用标识',
    `name` varchar(255) COMMENT '应用名',
    `status` int COMMENT '状态',
    `remark` text COMMENT '备注',
    `order_notify_url` text COMMENT '支付结果的回调地址',
    `refund_notify_url` text COMMENT '退款结果的回调地址',
    `transfer_notify_url` text COMMENT '转账结果的回调地址',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayApp';
-- PayTransferDO
DROP TABLE IF EXISTS `pay_transfer`;
CREATE TABLE `pay_transfer` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `no` varchar(255) COMMENT '转账单号',
    `app_id` bigint COMMENT '应用编号',
    `channel_id` bigint COMMENT '转账渠道编号',
    `channel_code` varchar(255) COMMENT '转账渠道编码',
    `user_id` bigint COMMENT '用户编号',
    `user_type` int COMMENT '用户类型',
    `merchant_transfer_id` varchar(255) COMMENT '商户转账单编号',
    `subject` varchar(255) COMMENT '转账标题',
    `price` int COMMENT '转账金额，单位：分',
    `user_account` varchar(255) COMMENT '收款人账号',
    `user_name` varchar(255) COMMENT '收款人姓名',
    `status` int COMMENT '转账状态',
    `success_time` datetime COMMENT '订单转账成功时间',
    `notify_url` text COMMENT '异步通知地址',
    `user_ip` varchar(255) COMMENT '用户 IP',
    `channel_extras` json COMMENT '渠道的额外参数',
    `channel_transfer_no` varchar(255) COMMENT '渠道转账单号',
    `channel_error_code` varchar(255) COMMENT '调用渠道的错误码',
    `channel_error_msg` varchar(255) COMMENT '调用渠道的错误提示',
    `channel_notify_data` longtext COMMENT '渠道的同步/异步通知的内容',
    `channel_package_info` varchar(255) COMMENT '渠道 package 信息',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayTransfer';
-- PayChannelDO
DROP TABLE IF EXISTS `pay_channel`;
CREATE TABLE `pay_channel` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '渠道编号，数据库自增' NOT NULL AUTO_INCREMENT,
    `code` varchar(255) COMMENT '渠道编码',
    `status` int COMMENT '状态',
    `fee_rate` double COMMENT '渠道费率，单位：百分比',
    `remark` text COMMENT '备注',
    `app_id` bigint COMMENT '应用编号',
    `config` json COMMENT '支付渠道配置',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayChannel';
-- PayWalletRechargeDO
DROP TABLE IF EXISTS `pay_wallet_recharge`;
CREATE TABLE `pay_wallet_recharge` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `wallet_id` bigint COMMENT '钱包编号',
    `total_price` int COMMENT '用户实际到账余额',
    `pay_price` int COMMENT '实际支付金额',
    `bonus_price` int COMMENT '钱包赠送金额',
    `package_id` bigint COMMENT '充值套餐编号',
    `pay_status` bit(1) COMMENT '是否已支付',
    `pay_order_id` bigint COMMENT '支付订单编号',
    `pay_channel_code` varchar(255) COMMENT '支付成功的支付渠道',
    `pay_time` datetime COMMENT '订单支付时间',
    `pay_refund_id` bigint COMMENT '支付退款单编号',
    `refund_total_price` int COMMENT '退款金额，包含赠送金额',
    `refund_pay_price` int COMMENT '退款支付金额',
    `refund_bonus_price` int COMMENT '退款钱包赠送金额',
    `refund_time` datetime COMMENT '退款时间',
    `refund_status` int COMMENT '退款状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayWalletRecharge';
-- PayWalletRechargePackageDO
DROP TABLE IF EXISTS `pay_wallet_recharge_package`;
CREATE TABLE `pay_wallet_recharge_package` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '套餐名',
    `pay_price` int COMMENT '支付金额',
    `bonus_price` int COMMENT '赠送金额',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayWalletRechargePackage';
-- PayWalletDO
DROP TABLE IF EXISTS `pay_wallet`;
CREATE TABLE `pay_wallet` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户 id',
    `user_type` int COMMENT '用户类型, 预留 多商户转帐可能需要用到',
    `balance` int COMMENT '余额，单位分',
    `freeze_price` int COMMENT '冻结金额，单位分',
    `total_expense` int COMMENT '累计支出，单位分',
    `total_recharge` int COMMENT '累计充值，单位分',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayWallet';
-- PayWalletTransactionDO
DROP TABLE IF EXISTS `pay_wallet_transaction`;
CREATE TABLE `pay_wallet_transaction` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `no` varchar(255) COMMENT '流水号',
    `wallet_id` bigint COMMENT '钱包编号',
    `biz_type` int COMMENT '关联业务分类',
    `biz_id` varchar(255) COMMENT '关联业务编号',
    `title` varchar(255) COMMENT '流水说明',
    `price` int COMMENT '交易金额，单位分',
    `balance` int COMMENT '交易后余额，单位分',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayWalletTransaction';
-- PayRefundDO
DROP TABLE IF EXISTS `pay_refund`;
CREATE TABLE `pay_refund` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '退款单编号，数据库自增' NOT NULL AUTO_INCREMENT,
    `no` varchar(255) COMMENT '外部退款号，根据规则生成',
    `app_id` bigint COMMENT '应用编号',
    `channel_id` bigint COMMENT '渠道编号',
    `channel_code` varchar(255) COMMENT '渠道编码',
    `order_id` bigint COMMENT '订单编号',
    `order_no` varchar(255) COMMENT '支付订单编号',
    `user_id` bigint COMMENT '用户编号',
    `user_type` int COMMENT '用户类型',
    `merchant_order_id` varchar(255) COMMENT '商户订单编号',
    `merchant_refund_id` varchar(255) COMMENT '商户退款订单号',
    `notify_url` text COMMENT '异步通知地址',
    `status` int COMMENT '退款状态',
    `pay_price` int COMMENT '支付金额，单位：分',
    `refund_price` int COMMENT '退款金额，单位：分',
    `reason` text COMMENT '退款原因',
    `user_ip` varchar(255) COMMENT '用户 IP',
    `channel_order_no` varchar(255) COMMENT '渠道订单号',
    `channel_refund_no` varchar(255) COMMENT '渠道退款单号',
    `success_time` datetime COMMENT '退款成功时间',
    `channel_error_code` varchar(255) COMMENT '调用渠道的错误码',
    `channel_error_msg` varchar(255) COMMENT '调用渠道的错误提示',
    `channel_notify_data` longtext COMMENT '支付渠道的同步/异步通知的内容',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PayRefund';

-- ==================== 商品模块 ====================
-- ProductCategoryDO
DROP TABLE IF EXISTS `product_category`;
CREATE TABLE `product_category` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '分类编号' NOT NULL AUTO_INCREMENT,
    `parent_id` bigint COMMENT '父分类编号',
    `name` varchar(255) COMMENT '分类名称',
    `pic_url` text COMMENT '移动端分类图',
    `sort` int COMMENT '分类排序',
    `status` int COMMENT '开启状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductCategory';
-- ProductPropertyDO
DROP TABLE IF EXISTS `product_property`;
CREATE TABLE `product_property` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '主键' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '名称',
    `remark` text COMMENT '备注',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductProperty';
-- ProductPropertyValueDO
DROP TABLE IF EXISTS `product_property_value`;
CREATE TABLE `product_property_value` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '主键' NOT NULL AUTO_INCREMENT,
    `property_id` bigint COMMENT '属性项的编号',
    `name` varchar(255) COMMENT '名称',
    `remark` text COMMENT '备注',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductPropertyValue';
-- ProductCommentDO
DROP TABLE IF EXISTS `product_comment`;
CREATE TABLE `product_comment` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '评论编号，主键自增' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '评价人的用户编号',
    `user_nickname` varchar(255) COMMENT '评价人名称',
    `user_avatar` varchar(255) COMMENT '评价人头像',
    `anonymous` bit(1) COMMENT '是否匿名',
    `order_id` bigint COMMENT '交易订单编号',
    `order_item_id` bigint COMMENT '交易订单项编号',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `spu_name` varchar(255) COMMENT '商品 SPU 名称',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `sku_pic_url` text COMMENT '商品 SKU 图片地址',
    `sku_properties` json COMMENT '属性数组，JSON 格式',
    `visible` bit(1) COMMENT '是否可见',
    `scores` int COMMENT '评分星级',
    `description_scores` int COMMENT '描述星级',
    `benefit_scores` int COMMENT '服务星级',
    `content` longtext COMMENT '评论内容',
    `pic_urls` json COMMENT '评论图片地址数组',
    `reply_status` bit(1) COMMENT '商家是否回复',
    `reply_user_id` bigint COMMENT '回复管理员编号',
    `reply_content` longtext COMMENT '商家回复内容',
    `reply_time` datetime COMMENT '商家回复时间',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductComment';
-- ProductBrandDO
DROP TABLE IF EXISTS `product_brand`;
CREATE TABLE `product_brand` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '品牌编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '品牌名称',
    `pic_url` text COMMENT '品牌图片',
    `sort` int COMMENT '品牌排序',
    `description` longtext COMMENT '品牌描述',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductBrand';
-- ProductFavoriteDO
DROP TABLE IF EXISTS `product_favorite`;
CREATE TABLE `product_favorite` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，主键自增' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductFavorite';
-- ProductSpuDO
DROP TABLE IF EXISTS `product_spu`;
CREATE TABLE `product_spu` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '商品 SPU 编号，自增' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '商品名称',
    `keyword` varchar(255) COMMENT '关键字',
    `introduction` varchar(255) COMMENT '商品简介',
    `description` longtext COMMENT '商品详情',
    `category_id` bigint COMMENT '商品分类编号',
    `brand_id` bigint COMMENT '商品品牌编号',
    `pic_url` text COMMENT '商品封面图',
    `slider_pic_urls` json COMMENT '商品轮播图',
    `sort` int COMMENT '排序字段',
    `status` int COMMENT '商品状态',
    `spec_type` bit(1) COMMENT '规格类型',
    `price` int COMMENT '商品价格，单位使用：分',
    `market_price` int COMMENT '市场价，单位使用：分',
    `cost_price` int COMMENT '成本价，单位使用：分',
    `stock` int COMMENT '库存',
    `delivery_types` varchar(500) COMMENT '配送方式数组',
    `delivery_template_id` bigint COMMENT '物流配置模板编号',
    `give_integral` int COMMENT '赠送积分',
    `sub_commission_type` bit(1) COMMENT '分销类型',
    `sales_count` int COMMENT '商品销量',
    `virtual_sales_count` int COMMENT '虚拟销量',
    `browse_count` int COMMENT '浏览量',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductSpu';
-- ProductBrowseHistoryDO
DROP TABLE IF EXISTS `product_browse_history`;
CREATE TABLE `product_browse_history` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '记录编号' NOT NULL AUTO_INCREMENT,
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `user_id` bigint COMMENT '用户编号',
    `user_deleted` bit(1) COMMENT '用户是否删除',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductBrowseHistory';
-- ProductSkuDO
DROP TABLE IF EXISTS `product_sku`;
CREATE TABLE `product_sku` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '商品 SKU 编号，自增' NOT NULL AUTO_INCREMENT,
    `spu_id` bigint COMMENT 'SPU 编号',
    `properties` json COMMENT '属性数组，JSON 格式',
    `price` int COMMENT '商品价格，单位：分',
    `market_price` int COMMENT '市场价，单位：分',
    `cost_price` int COMMENT '成本价，单位：分',
    `bar_code` varchar(255) COMMENT '商品条码',
    `pic_url` text COMMENT '图片地址',
    `stock` int COMMENT '库存',
    `weight` double COMMENT '商品重量，单位：kg 千克',
    `volume` double COMMENT '商品体积，单位：m^3 平米',
    `first_brokerage_price` int COMMENT '一级分销的佣金，单位：分',
    `second_brokerage_price` int COMMENT '二级分销的佣金，单位：分',
    `sales_count` int COMMENT '商品销量',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductSku';

-- ==================== 营销模块 ====================
-- BargainActivityDO
DROP TABLE IF EXISTS `promotion_bargain_activity`;
CREATE TABLE `promotion_bargain_activity` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '砍价活动编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '砍价活动名称',
    `start_time` datetime COMMENT '活动开始时间',
    `end_time` datetime COMMENT '活动结束时间',
    `status` int COMMENT '活动状态',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `bargain_first_price` int COMMENT '砍价起始价格，单位：分',
    `bargain_min_price` int COMMENT '砍价底价，单位：分',
    `stock` int COMMENT '砍价库存(剩余库存砍价时扣减)',
    `total_stock` int COMMENT '砍价总库存',
    `help_max_count` int COMMENT '砍价人数',
    `bargain_count` int COMMENT '帮砍次数',
    `total_limit_count` int COMMENT '总限购数量',
    `random_min_price` int COMMENT '用户每次砍价的最小金额，单位：分',
    `random_max_price` int COMMENT '用户每次砍价的最大金额，单位：分',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='BargainActivity';
-- BargainRecordDO
DROP TABLE IF EXISTS `promotion_bargain_record`;
CREATE TABLE `promotion_bargain_record` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `activity_id` bigint COMMENT '砍价活动编号',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `bargain_first_price` int COMMENT '砍价起始价格，单位：分',
    `bargain_price` int COMMENT '当前砍价，单位：分',
    `status` int COMMENT '砍价状态',
    `end_time` datetime COMMENT '结束时间',
    `order_id` bigint COMMENT '订单编号',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='BargainRecord';
-- BargainHelpDO
DROP TABLE IF EXISTS `promotion_bargain_help`;
CREATE TABLE `promotion_bargain_help` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `activity_id` bigint COMMENT '砍价活动编号',
    `record_id` bigint COMMENT '砍价记录编号',
    `user_id` bigint COMMENT '用户编号',
    `reduce_price` int COMMENT '减少价格，单位：分',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='BargainHelp';
-- DiyPageDO
DROP TABLE IF EXISTS `promotion_diy_page`;
CREATE TABLE `promotion_diy_page` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '装修页面编号' NOT NULL AUTO_INCREMENT,
    `template_id` bigint COMMENT '装修模板编号',
    `name` varchar(255) COMMENT '页面名称',
    `remark` text COMMENT '备注',
    `preview_pic_urls` varchar(1000) COMMENT '预览图，多个逗号分隔',
    `property` longtext COMMENT '页面属性，JSON 格式',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DiyPage';
-- DiyTemplateDO
DROP TABLE IF EXISTS `promotion_diy_template`;
CREATE TABLE `promotion_diy_template` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '装修模板编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '模板名称',
    `used` bit(1) COMMENT '是否使用',
    `used_time` datetime COMMENT '使用时间',
    `remark` text COMMENT '备注',
    `preview_pic_urls` varchar(1000) COMMENT '预览图',
    `property` longtext COMMENT 'uni-app 底部导航属性，JSON 格式',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DiyTemplate';
-- CombinationProductDO
DROP TABLE IF EXISTS `promotion_combination_product`;
CREATE TABLE `promotion_combination_product` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `activity_id` bigint COMMENT '拼团活动编号',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `combination_price` int COMMENT '拼团价格，单位分',
    `activity_status` int COMMENT '拼团商品状态',
    `activity_start_time` datetime COMMENT '活动开始时间点',
    `activity_end_time` datetime COMMENT '活动结束时间点',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CombinationProduct';
-- CombinationActivityDO
DROP TABLE IF EXISTS `promotion_combination_activity`;
CREATE TABLE `promotion_combination_activity` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '活动编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '拼团名称',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `total_limit_count` int COMMENT '总限购数量',
    `single_limit_count` int COMMENT '单次限购数量',
    `start_time` datetime COMMENT '开始时间',
    `end_time` datetime COMMENT '结束时间',
    `user_size` int COMMENT '几人团',
    `virtual_group` bit(1) COMMENT '虚拟成团',
    `status` int COMMENT '活动状态',
    `limit_duration` int COMMENT '限制时长（小时）',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CombinationActivity';
-- CombinationRecordDO
DROP TABLE IF EXISTS `promotion_combination_record`;
CREATE TABLE `promotion_combination_record` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，主键自增' NOT NULL AUTO_INCREMENT,
    `activity_id` bigint COMMENT '拼团活动编号',
    `combination_price` int COMMENT '拼团商品单价',
    `spu_id` bigint COMMENT 'SPU 编号',
    `spu_name` varchar(255) COMMENT '商品名字',
    `pic_url` text COMMENT '商品图片',
    `sku_id` bigint COMMENT 'SKU 编号',
    `count` int COMMENT '购买的商品数量',
    `user_id` bigint COMMENT '用户编号',
    `nickname` varchar(255) COMMENT '用户昵称',
    `avatar` varchar(255) COMMENT '用户头像',
    `head_id` bigint COMMENT '团长编号',
    `status` int COMMENT '开团状态',
    `order_id` bigint COMMENT '订单编号',
    `user_size` int COMMENT '开团需要人数',
    `user_count` int COMMENT '已加入拼团人数',
    `virtual_group` bit(1) COMMENT '是否虚拟成团',
    `expire_time` datetime COMMENT '过期时间',
    `start_time` datetime COMMENT '开始时间 (订单付款后开始的时间)',
    `end_time` datetime COMMENT '结束时间（成团时间/失败时间）',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CombinationRecord';
-- SeckillProductDO
DROP TABLE IF EXISTS `promotion_seckill_product`;
CREATE TABLE `promotion_seckill_product` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '秒杀参与商品编号' NOT NULL AUTO_INCREMENT,
    `activity_id` bigint COMMENT '秒杀活动 id',
    `config_ids` varchar(500) COMMENT '秒杀时段 id',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `seckill_price` int COMMENT '秒杀金额，单位：分',
    `stock` int COMMENT '秒杀库存',
    `activity_status` int COMMENT '秒杀商品状态',
    `activity_start_time` datetime COMMENT '活动开始时间点',
    `activity_end_time` datetime COMMENT '活动结束时间点',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SeckillProduct';
-- SeckillActivityDO
DROP TABLE IF EXISTS `promotion_seckill_activity`;
CREATE TABLE `promotion_seckill_activity` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '秒杀活动编号' NOT NULL AUTO_INCREMENT,
    `spu_id` bigint COMMENT '秒杀活动商品',
    `name` varchar(255) COMMENT '秒杀活动名称',
    `status` int COMMENT '活动状态',
    `remark` text COMMENT '备注',
    `start_time` datetime COMMENT '活动开始时间',
    `end_time` datetime COMMENT '活动结束时间',
    `sort` int COMMENT '排序',
    `config_ids` varchar(500) COMMENT '秒杀时段 id',
    `total_limit_count` int COMMENT '总限购数量',
    `single_limit_count` int COMMENT '单次限够数量',
    `stock` int COMMENT '秒杀库存(剩余库存秒杀时扣减)',
    `total_stock` int COMMENT '秒杀总库存',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SeckillActivity';
-- SeckillConfigDO
DROP TABLE IF EXISTS `promotion_seckill_config`;
CREATE TABLE `promotion_seckill_config` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '秒杀时段名称',
    `start_time` varchar(255) COMMENT '开始时间点',
    `end_time` varchar(255) COMMENT '结束时间点',
    `slider_pic_urls` json COMMENT '秒杀轮播图',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SeckillConfig';
-- PointActivityDO
DROP TABLE IF EXISTS `promotion_point_activity`;
CREATE TABLE `promotion_point_activity` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '积分商城活动编号' NOT NULL AUTO_INCREMENT,
    `spu_id` bigint COMMENT '积分商城活动商品',
    `status` int COMMENT '活动状态',
    `remark` text COMMENT '备注',
    `sort` int COMMENT '排序',
    `stock` int COMMENT '积分商城活动库存(剩余库存积分兑换时扣减)',
    `total_stock` int COMMENT '积分商城活动总库存',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PointActivity';
-- PointProductDO
DROP TABLE IF EXISTS `promotion_point_product`;
CREATE TABLE `promotion_point_product` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '积分商城商品编号' NOT NULL AUTO_INCREMENT,
    `activity_id` bigint COMMENT '积分商城活动 id',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `count` int COMMENT '可兑换次数',
    `point` int COMMENT '所需兑换积分',
    `price` int COMMENT '所需兑换金额，单位：分',
    `stock` int COMMENT '积分商城商品库存',
    `activity_status` int COMMENT '积分商城商品状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='PointProduct';
-- CouponDO
DROP TABLE IF EXISTS `promotion_coupon`;
CREATE TABLE `promotion_coupon` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '优惠劵编号' NOT NULL AUTO_INCREMENT,
    `template_id` bigint COMMENT '优惠劵模板编号',
    `name` varchar(255) COMMENT '优惠劵名',
    `status` int COMMENT '优惠码状态',
    `user_id` bigint COMMENT '用户编号',
    `take_type` int COMMENT '领取类型',
    `use_price` int COMMENT '是否设置满多少金额可用，单位：分',
    `valid_start_time` datetime COMMENT '生效开始时间',
    `valid_end_time` datetime COMMENT '生效结束时间',
    `product_scope` int COMMENT '商品范围',
    `product_scope_values` varchar(500) COMMENT '商品范围编号的数组',
    `discount_type` int COMMENT '折扣类型',
    `discount_percent` int COMMENT '折扣百分比',
    `discount_price` int COMMENT '优惠金额，单位：分',
    `discount_limit_price` int COMMENT '折扣上限，仅在 (@link #discountType) 等于 (@link PromotionDiscountTyp',
    `use_order_id` bigint COMMENT '使用订单号',
    `use_time` datetime COMMENT '使用时间',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Coupon';
-- CouponTemplateDO
DROP TABLE IF EXISTS `promotion_coupon_template`;
CREATE TABLE `promotion_coupon_template` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '模板编号，自增唯一' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '优惠劵名',
    `description` longtext COMMENT '优惠券说明',
    `status` int COMMENT '状态',
    `total_count` int COMMENT '发放数量',
    `take_limit_count` int COMMENT '每人限领个数',
    `take_type` int COMMENT '领取方式',
    `use_price` int COMMENT '是否设置满多少金额可用，单位：分',
    `product_scope` int COMMENT '商品范围',
    `product_scope_values` varchar(500) COMMENT '商品范围编号的数组',
    `validity_type` int COMMENT '生效日期类型',
    `valid_start_time` datetime COMMENT '固定日期 - 生效开始时间',
    `valid_end_time` datetime COMMENT '固定日期 - 生效结束时间',
    `fixed_start_term` int COMMENT '领取日期 - 开始天数',
    `fixed_end_term` int COMMENT '领取日期 - 结束天数',
    `discount_type` int COMMENT '折扣类型',
    `discount_percent` int COMMENT '折扣百分比',
    `discount_price` int COMMENT '优惠金额，单位：分',
    `discount_limit_price` int COMMENT '折扣上限，仅在 (@link #discountType) 等于 (@link PromotionDiscountTyp',
    `take_count` int COMMENT '领取优惠券的数量',
    `use_count` int COMMENT '使用优惠券的次数',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CouponTemplate';
-- DiscountActivityDO
DROP TABLE IF EXISTS `promotion_discount_activity`;
CREATE TABLE `promotion_discount_activity` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '活动编号，主键自增' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '活动标题',
    `status` int COMMENT '状态',
    `start_time` datetime COMMENT '开始时间',
    `end_time` datetime COMMENT '结束时间',
    `remark` text COMMENT '备注',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DiscountActivity';
-- DiscountProductDO
DROP TABLE IF EXISTS `promotion_discount_product`;
CREATE TABLE `promotion_discount_product` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，主键自增' NOT NULL AUTO_INCREMENT,
    `activity_id` bigint COMMENT '限时折扣活动的编号',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `discount_type` int COMMENT '折扣类型',
    `discount_percent` int COMMENT '折扣百分比',
    `discount_price` int COMMENT '优惠金额，单位：分',
    `activity_name` varchar(255) COMMENT '活动标题',
    `activity_status` int COMMENT '活动状态',
    `activity_start_time` datetime COMMENT '活动开始时间点',
    `activity_end_time` datetime COMMENT '活动结束时间点',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DiscountProduct';
-- KeFuMessageDO
DROP TABLE IF EXISTS `promotion_kefu_message`;
CREATE TABLE `promotion_kefu_message` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `conversation_id` bigint COMMENT '会话编号',
    `sender_id` bigint COMMENT '发送人编号',
    `sender_type` int COMMENT '发送人类型',
    `receiver_id` bigint COMMENT '接收人编号',
    `receiver_type` int COMMENT '接收人类型',
    `content_type` int COMMENT '消息类型',
    `content` longtext COMMENT '消息',
    `read_status` bit(1) COMMENT '是/否已读',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='KeFuMessage';
-- KeFuConversationDO
DROP TABLE IF EXISTS `promotion_kefu_conversation`;
CREATE TABLE `promotion_kefu_conversation` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '会话所属用户',
    `last_message_time` datetime COMMENT '最后聊天时间',
    `last_message_content` longtext COMMENT '最后聊天内容',
    `last_message_content_type` int COMMENT '最后发送的消息类型',
    `admin_pinned` bit(1) COMMENT '管理端置顶',
    `user_deleted` bit(1) COMMENT '用户是否可见',
    `admin_deleted` bit(1) COMMENT '管理员是否可见',
    `admin_unread_message_count` int COMMENT '管理员未读消息数',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='KeFuConversation';
-- RewardActivityDO
DROP TABLE IF EXISTS `promotion_reward_activity`;
CREATE TABLE `promotion_reward_activity` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '活动编号，主键自增' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '活动标题',
    `status` int COMMENT '状态',
    `start_time` datetime COMMENT '开始时间',
    `end_time` datetime COMMENT '结束时间',
    `remark` text COMMENT '备注',
    `condition_type` int COMMENT '条件类型',
    `product_scope` int COMMENT '商品范围',
    `product_scope_values` varchar(500) COMMENT '商品 SPU 编号的数组',
    `rules` json COMMENT '优惠规则的数组',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='RewardActivity';
-- ArticleDO
DROP TABLE IF EXISTS `promotion_article`;
CREATE TABLE `promotion_article` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '文章管理编号' NOT NULL AUTO_INCREMENT,
    `category_id` bigint COMMENT '分类编号 ArticleCategoryDO#id',
    `spu_id` bigint COMMENT '关联商品编号 ProductSpuDO#id',
    `title` varchar(255) COMMENT '文章标题',
    `author` varchar(255) COMMENT '文章作者',
    `pic_url` text COMMENT '文章封面图片地址',
    `introduction` varchar(255) COMMENT '文章简介',
    `browse_count` int COMMENT '浏览次数',
    `sort` int COMMENT '排序',
    `status` int COMMENT '状态',
    `recommend_hot` bit(1) COMMENT '是否热门(小程序)',
    `recommend_banner` bit(1) COMMENT '是否轮播图(小程序)',
    `content` longtext COMMENT '文章内容',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Article';
-- ArticleCategoryDO
DROP TABLE IF EXISTS `promotion_article_category`;
CREATE TABLE `promotion_article_category` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '文章分类编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '文章分类名称',
    `pic_url` text COMMENT '图标地址',
    `status` int COMMENT '状态',
    `sort` int COMMENT '排序',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ArticleCategory';
-- BannerDO
DROP TABLE IF EXISTS `promotion_banner`;
CREATE TABLE `promotion_banner` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `title` varchar(255) COMMENT '标题',
    `url` text COMMENT '跳转链接',
    `pic_url` text COMMENT '图片链接',
    `sort` int COMMENT '排序',
    `status` int COMMENT '状态 (@link CommonStatusEnum)',
    `position` int COMMENT '定位 (@link BannerPositionEnum)',
    `memo` text COMMENT '备注',
    `browse_count` int COMMENT '点击次数',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner';

-- ==================== 交易模块 ====================
-- TradeOrderItemDO
DROP TABLE IF EXISTS `trade_order_item`;
CREATE TABLE `trade_order_item` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `order_id` bigint COMMENT '订单编号',
    `cart_id` bigint COMMENT '购物车项编号',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `spu_name` varchar(255) COMMENT '商品 SPU 名称',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `properties` json COMMENT '属性数组，JSON 格式',
    `pic_url` text COMMENT '商品图片',
    `count` int COMMENT '购买数量',
    `comment_status` bit(1) COMMENT '是否评价',
    `price` int COMMENT '商品原价（单），单位：分',
    `discount_price` int COMMENT '优惠金额（总），单位：分',
    `delivery_price` int COMMENT '运费金额（总），单位：分',
    `adjust_price` int COMMENT '订单调价（总），单位：分',
    `pay_price` int COMMENT '应付金额（总），单位：分',
    `coupon_price` int COMMENT '优惠劵减免金额，单位：分',
    `point_price` int COMMENT '积分抵扣的金额，单位：分',
    `use_point` int COMMENT '使用的积分',
    `give_point` int COMMENT '赠送的积分',
    `vip_price` int COMMENT 'VIP 减免金额，单位：分',
    `after_sale_id` bigint COMMENT '售后单编号',
    `after_sale_status` int COMMENT '售后状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TradeOrderItem';
-- TradeOrderLogDO
DROP TABLE IF EXISTS `trade_order_log`;
CREATE TABLE `trade_order_log` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `user_type` int COMMENT '用户类型',
    `order_id` bigint COMMENT '订单号',
    `before_status` int COMMENT '操作前状态',
    `after_status` int COMMENT '操作后状态',
    `operate_type` int COMMENT '操作类型',
    `content` longtext COMMENT '订单日志信息',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TradeOrderLog';
-- TradeOrderDO
DROP TABLE IF EXISTS `trade_order`;
CREATE TABLE `trade_order` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '订单编号，主键自增' NOT NULL AUTO_INCREMENT,
    `no` varchar(255) COMMENT '订单流水号',
    `type` int COMMENT '订单类型',
    `terminal` int COMMENT '订单来源',
    `user_id` bigint COMMENT '用户编号',
    `user_ip` varchar(255) COMMENT '用户 IP',
    `user_remark` text COMMENT '用户备注',
    `status` int COMMENT '订单状态',
    `product_count` int COMMENT '购买的商品数量',
    `finish_time` datetime COMMENT '订单完成时间',
    `cancel_time` datetime COMMENT '订单取消时间',
    `cancel_type` int COMMENT '取消类型',
    `remark` text COMMENT '商家备注',
    `comment_status` bit(1) COMMENT '是否评价',
    `brokerage_user_id` bigint COMMENT '推广人编号',
    `pay_order_id` bigint COMMENT '支付订单编号',
    `pay_status` bit(1) COMMENT '是否已支付',
    `pay_time` datetime COMMENT '付款时间',
    `pay_channel_code` varchar(255) COMMENT '支付渠道',
    `total_price` int COMMENT '商品原价，单位：分',
    `discount_price` int COMMENT '优惠金额，单位：分',
    `delivery_price` int COMMENT '运费金额，单位：分',
    `adjust_price` int COMMENT '订单调价，单位：分',
    `pay_price` int COMMENT '应付金额（总），单位：分',
    `delivery_type` int COMMENT '配送方式',
    `logistics_id` bigint COMMENT '发货物流公司编号',
    `logistics_no` longtext COMMENT '发货物流单号',
    `delivery_time` datetime COMMENT '发货时间',
    `receive_time` datetime COMMENT '收货时间',
    `receiver_name` varchar(255) COMMENT '收件人名称',
    `receiver_mobile` varchar(255) COMMENT '收件人手机',
    `receiver_area_id` int COMMENT '收件人地区编号',
    `receiver_detail_address` text COMMENT '收件人详细地址',
    `pick_up_store_id` bigint COMMENT '自提门店编号',
    `pick_up_verify_code` text COMMENT '自提核销码',
    `refund_status` int COMMENT '售后状态',
    `refund_price` int COMMENT '退款金额，单位：分',
    `coupon_id` bigint COMMENT '优惠劵编号',
    `coupon_price` int COMMENT '优惠劵减免金额，单位：分',
    `use_point` int COMMENT '使用的积分',
    `point_price` int COMMENT '积分抵扣的金额，单位：分',
    `give_point` int COMMENT '赠送的积分',
    `refund_point` int COMMENT '退还的使用的积分',
    `vip_price` int COMMENT 'VIP 减免金额，单位：分',
    `give_coupon_template_counts` json COMMENT '赠送的优惠劵',
    `give_coupon_ids` varchar(500) COMMENT '赠送的优惠劵编号',
    `seckill_activity_id` bigint COMMENT '秒杀活动编号',
    `bargain_activity_id` bigint COMMENT '砍价活动编号',
    `bargain_record_id` bigint COMMENT '砍价记录编号',
    `combination_activity_id` bigint COMMENT '拼团活动编号',
    `combination_head_id` bigint COMMENT '拼团团长编号',
    `combination_record_id` bigint COMMENT '拼团记录编号',
    `point_activity_id` bigint COMMENT '积分商城活动的编号',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TradeOrder';
-- BrokerageRecordDO
DROP TABLE IF EXISTS `trade_brokerage_record`;
CREATE TABLE `trade_brokerage_record` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `biz_id` varchar(255) COMMENT '业务编号',
    `biz_type` int COMMENT '业务类型',
    `title` varchar(255) COMMENT '标题',
    `description` longtext COMMENT '说明',
    `price` int COMMENT '金额',
    `total_price` int COMMENT '当前总佣金',
    `status` int COMMENT '状态',
    `frozen_days` int COMMENT '冻结时间（天）',
    `unfreeze_time` datetime COMMENT '解冻时间',
    `source_user_level` int COMMENT '来源用户等级',
    `source_user_id` bigint COMMENT '来源用户编号',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='BrokerageRecord';
-- BrokerageWithdrawDO
DROP TABLE IF EXISTS `trade_brokerage_withdraw`;
CREATE TABLE `trade_brokerage_withdraw` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `price` int COMMENT '提现金额，单位：分',
    `fee_price` int COMMENT '提现手续费，单位：分',
    `total_price` int COMMENT '当前总佣金，单位：分',
    `type` int COMMENT '提现类型',
    `user_name` varchar(255) COMMENT '提现姓名',
    `user_account` varchar(255) COMMENT '提现账号',
    `qr_code_url` text COMMENT '收款码',
    `bank_name` varchar(255) COMMENT '银行名称',
    `bank_address` varchar(255) COMMENT '开户地址',
    `status` int COMMENT '状态',
    `audit_reason` text COMMENT '审核驳回原因',
    `audit_time` datetime COMMENT '审核时间',
    `remark` text COMMENT '备注',
    `pay_transfer_id` bigint COMMENT '转账单编号',
    `transfer_channel_code` varchar(255) COMMENT '转账渠道',
    `transfer_time` datetime COMMENT '转账成功时间',
    `transfer_error_msg` varchar(255) COMMENT '转账错误提示',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='BrokerageWithdraw';
-- BrokerageUserDO
DROP TABLE IF EXISTS `trade_brokerage_user`;
CREATE TABLE `trade_brokerage_user` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '用户编号' NOT NULL AUTO_INCREMENT,
    `bind_user_id` bigint COMMENT '推广员编号',
    `bind_user_time` datetime COMMENT '推广员绑定时间',
    `brokerage_enabled` bit(1) COMMENT '是否有分销资格',
    `brokerage_time` datetime COMMENT '成为分销员时间',
    `brokerage_price` int COMMENT '可用佣金',
    `frozen_price` int COMMENT '冻结佣金',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='BrokerageUser';
-- TradeConfigDO
DROP TABLE IF EXISTS `trade_config`;
CREATE TABLE `trade_config` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '自增主键' NOT NULL AUTO_INCREMENT,
    `after_sale_refund_reasons` json COMMENT '售后的退款理由',
    `after_sale_return_reasons` json COMMENT '售后的退货理由',
    `delivery_express_free_enabled` bit(1) COMMENT '是否启用全场包邮',
    `delivery_express_free_price` int COMMENT '全场包邮的最小金额，单位：分',
    `delivery_pick_up_enabled` bit(1) COMMENT '是否开启自提',
    `brokerage_enabled` bit(1) COMMENT '是否启用分佣',
    `brokerage_enabled_condition` int COMMENT '分佣模式',
    `brokerage_bind_mode` int COMMENT '分销关系绑定模式',
    `brokerage_poster_urls` json COMMENT '分销海报图地址数组',
    `brokerage_first_percent` int COMMENT '一级返佣比例',
    `brokerage_second_percent` int COMMENT '二级返佣比例',
    `brokerage_withdraw_min_price` int COMMENT '用户提现最低金额',
    `brokerage_withdraw_fee_percent` int COMMENT '用户提现手续费百分比',
    `brokerage_frozen_days` int COMMENT '佣金冻结时间(天)',
    `brokerage_withdraw_types` varchar(500) COMMENT '提现方式',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TradeConfig';
-- AfterSaleLogDO
DROP TABLE IF EXISTS `trade_after_sale_log`;
CREATE TABLE `trade_after_sale_log` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `user_type` int COMMENT '用户类型',
    `after_sale_id` bigint COMMENT '售后编号',
    `before_status` int COMMENT '操作前状态',
    `after_status` int COMMENT '操作后状态',
    `operate_type` int COMMENT '操作类型',
    `content` longtext COMMENT '操作明细',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AfterSaleLog';
-- AfterSaleDO
DROP TABLE IF EXISTS `trade_after_sale`;
CREATE TABLE `trade_after_sale` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '售后编号，主键自增' NOT NULL AUTO_INCREMENT,
    `no` varchar(255) COMMENT '售后单号',
    `status` int COMMENT '退款状态',
    `way` int COMMENT '售后方式',
    `type` int COMMENT '售后类型',
    `user_id` bigint COMMENT '用户编号',
    `apply_reason` text COMMENT '申请原因',
    `apply_description` longtext COMMENT '补充描述',
    `apply_pic_urls` json COMMENT '补充凭证图片',
    `order_id` bigint COMMENT '交易订单编号',
    `order_no` varchar(255) COMMENT '订单流水号',
    `order_item_id` bigint COMMENT '交易订单项编号',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `spu_name` varchar(255) COMMENT '商品 SPU 名称',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `properties` json COMMENT '属性数组，JSON 格式',
    `pic_url` text COMMENT '商品图片',
    `count` int COMMENT '退货商品数量',
    `audit_time` datetime COMMENT '审批时间',
    `audit_user_id` bigint COMMENT '审批人',
    `audit_reason` text COMMENT '审批备注',
    `refund_price` int COMMENT '退款金额，单位：分。',
    `pay_refund_id` bigint COMMENT '支付退款编号',
    `refund_time` datetime COMMENT '退款时间',
    `logistics_id` bigint COMMENT '退货物流公司编号',
    `logistics_no` longtext COMMENT '退货物流单号',
    `delivery_time` datetime COMMENT '退货时间',
    `receive_time` datetime COMMENT '收货时间',
    `receive_reason` text COMMENT '收货备注',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AfterSale';
-- CartDO
DROP TABLE IF EXISTS `trade_cart`;
CREATE TABLE `trade_cart` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，唯一自增' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `sku_id` bigint COMMENT '商品 SKU 编号',
    `count` int COMMENT '商品购买数量',
    `selected` bit(1) COMMENT '是否选中',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cart';
-- DeliveryExpressTemplateChargeDO
DROP TABLE IF EXISTS `trade_delivery_express_template_charge`;
CREATE TABLE `trade_delivery_express_template_charge` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，自增' NOT NULL AUTO_INCREMENT,
    `template_id` bigint COMMENT '配送模板编号',
    `area_ids` varchar(500) COMMENT '配送区域编号列表',
    `charge_mode` int COMMENT '配送计费方式',
    `start_count` double COMMENT '首件数量(件数,重量，或体积)',
    `start_price` int COMMENT '起步价，单位：分',
    `extra_count` double COMMENT '续件数量(件, 重量，或体积)',
    `extra_price` int COMMENT '额外价，单位：分',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DeliveryExpressTemplateCharge';
-- DeliveryExpressTemplateDO
DROP TABLE IF EXISTS `trade_delivery_express_template`;
CREATE TABLE `trade_delivery_express_template` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，自增' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '模板名称',
    `charge_mode` int COMMENT '配送计费方式',
    `sort` int COMMENT '排序',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DeliveryExpressTemplate';
-- DeliveryPickUpStoreDO
DROP TABLE IF EXISTS `trade_delivery_pick_up_store`;
CREATE TABLE `trade_delivery_pick_up_store` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '门店名称',
    `introduction` varchar(255) COMMENT '门店简介',
    `phone` varchar(255) COMMENT '门店手机',
    `area_id` int COMMENT '区域编号',
    `detail_address` text COMMENT '门店详细地址',
    `logo` longtext COMMENT '门店 logo',
    `opening_time` time COMMENT '营业开始时间',
    `closing_time` time COMMENT '营业结束时间',
    `latitude` double COMMENT '纬度',
    `longitude` double COMMENT '经度',
    `verify_user_ids` varchar(500) COMMENT '核销员工用户编号数组',
    `status` int COMMENT '门店状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DeliveryPickUpStore';
-- DeliveryExpressDO
DROP TABLE IF EXISTS `trade_delivery_express`;
CREATE TABLE `trade_delivery_express` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，自增' NOT NULL AUTO_INCREMENT,
    `code` varchar(255) COMMENT '快递公司 code',
    `name` varchar(255) COMMENT '快递公司名称',
    `logo` longtext COMMENT '快递公司 logo',
    `sort` int COMMENT '排序',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DeliveryExpress';
-- DeliveryExpressTemplateFreeDO
DROP TABLE IF EXISTS `trade_delivery_express_template_free`;
CREATE TABLE `trade_delivery_express_template_free` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `template_id` bigint COMMENT '配送模板编号',
    `area_ids` varchar(500) COMMENT '配送区域编号列表',
    `free_price` int COMMENT '包邮金额，单位：分',
    `free_count` int COMMENT '包邮件数',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='DeliveryExpressTemplateFree';

-- ==================== 统计模块 ====================
-- TradeStatisticsDO
DROP TABLE IF EXISTS `trade_statistics`;
CREATE TABLE `trade_statistics` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，主键自增' NOT NULL AUTO_INCREMENT,
    `time` datetime COMMENT '统计日期',
    `order_create_count` int COMMENT '创建订单数',
    `order_pay_count` int COMMENT '支付订单商品数',
    `order_pay_price` int COMMENT '总支付金额，单位：分',
    `after_sale_count` int COMMENT '退款订单数',
    `after_sale_refund_price` int COMMENT '总退款金额，单位：分',
    `brokerage_settlement_price` int COMMENT '佣金金额（已结算），单位：分',
    `wallet_pay_price` int COMMENT '总支付金额（余额），单位：分',
    `recharge_pay_count` int COMMENT '充值订单数',
    `recharge_pay_price` int COMMENT '充值金额，单位：分',
    `recharge_refund_count` int COMMENT '充值退款订单数',
    `recharge_refund_price` int COMMENT '充值退款金额，单位：分',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='TradeStatistics';
-- ProductStatisticsDO
DROP TABLE IF EXISTS `product_statistics`;
CREATE TABLE `product_statistics` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，主键自增' NOT NULL AUTO_INCREMENT,
    `time` date COMMENT '统计日期',
    `spu_id` bigint COMMENT '商品 SPU 编号',
    `browse_count` int COMMENT '浏览量',
    `browse_user_count` int COMMENT '访客量',
    `favorite_count` int COMMENT '收藏数量',
    `cart_count` int COMMENT '加购数量',
    `order_count` int COMMENT '下单件数',
    `order_pay_count` int COMMENT '支付件数',
    `order_pay_price` int COMMENT '支付金额，单位：分',
    `after_sale_count` int COMMENT '退款件数',
    `after_sale_refund_price` int COMMENT '退款金额，单位：分',
    `browse_convert_percent` int COMMENT '访客支付转化率（百分比）',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ProductStatistics';
