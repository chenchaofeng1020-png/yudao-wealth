-- 由实体类自动生成（yudao 业务模块建表语句）
-- 生成时间：见文件修改时间；数据来源：各模块 dal/dataobject 下的 *DO
-- 注意：默认无业务索引、无演示数据，仅保证实体读写不报错


-- ==================== AI模块 ====================
-- AiWriteDO
DROP TABLE IF EXISTS `ai_write`;
CREATE TABLE `ai_write` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `type` int COMMENT '写作类型',
    `platform` varchar(255) COMMENT '平台',
    `model_id` bigint COMMENT '模型编号',
    `model` varchar(255) COMMENT '模型',
    `prompt` varchar(255) COMMENT '生成内容提示',
    `generated_content` longtext COMMENT '生成的内容',
    `original_content` longtext COMMENT '原文',
    `length` int COMMENT '长度提示词',
    `format` int COMMENT '格式提示词',
    `tone` int COMMENT '语气提示词',
    `language` int COMMENT '语言提示词',
    `error_message` text COMMENT '错误信息',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiWrite';
-- AiMusicDO
DROP TABLE IF EXISTS `ai_music`;
CREATE TABLE `ai_music` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `title` varchar(255) COMMENT '音乐名称',
    `lyric` varchar(255) COMMENT '歌词',
    `image_url` text COMMENT '图片地址',
    `audio_url` text COMMENT '音频地址',
    `video_url` text COMMENT '视频地址',
    `status` int COMMENT '音乐状态',
    `generate_mode` int COMMENT '生成模式',
    `description` longtext COMMENT '描述词',
    `platform` varchar(255) COMMENT '平台',
    `model` varchar(255) COMMENT '模型',
    `tags` json COMMENT '音乐风格标签',
    `duration` double COMMENT '音乐时长',
    `public_status` bit(1) COMMENT '是否公开',
    `task_id` varchar(255) COMMENT '任务编号',
    `error_message` text COMMENT '错误信息',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiMusic';
-- AiChatConversationDO
DROP TABLE IF EXISTS `ai_chat_conversation`;
CREATE TABLE `ai_chat_conversation` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT 'ID 编号，自增' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `title` varchar(255) COMMENT '对话标题',
    `pinned` bit(1) COMMENT '是否置顶',
    `pinned_time` datetime COMMENT '置顶时间',
    `role_id` bigint COMMENT '角色编号',
    `model_id` bigint COMMENT '模型编号',
    `model` varchar(255) COMMENT '模型标志',
    `system_message` text COMMENT '角色设定',
    `temperature` double COMMENT '温度参数',
    `max_tokens` int COMMENT '单条回复的最大 Token 数量',
    `max_contexts` int COMMENT '上下文的最大 Message 数量',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiChatConversation';
-- AiChatMessageDO
DROP TABLE IF EXISTS `ai_chat_message`;
CREATE TABLE `ai_chat_message` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号，作为每条聊天记录的唯一标识符' NOT NULL AUTO_INCREMENT,
    `conversation_id` bigint COMMENT '对话编号',
    `reply_id` bigint COMMENT '回复消息编号',
    `type` varchar(255) COMMENT '消息类型',
    `user_id` bigint COMMENT '用户编号',
    `role_id` bigint COMMENT '角色编号',
    `model` varchar(255) COMMENT '模型标志',
    `model_id` bigint COMMENT '模型编号',
    `content` longtext COMMENT '聊天内容',
    `reasoning_content` longtext COMMENT '推理内容',
    `use_context` bit(1) COMMENT '是否携带上下文',
    `segment_ids` varchar(500) COMMENT '知识库段落编号数组',
    `web_search_pages` json COMMENT '联网搜索的网页内容数组',
    `attachment_urls` varchar(1000) COMMENT '附件 URL 数组',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiChatMessage';
-- AiImageDO
DROP TABLE IF EXISTS `ai_image`;
CREATE TABLE `ai_image` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `prompt` varchar(255) COMMENT '提示词',
    `platform` varchar(255) COMMENT '平台',
    `model_id` bigint COMMENT '模型编号',
    `model` varchar(255) COMMENT '模型标识',
    `width` int COMMENT '图片宽度',
    `height` int COMMENT '图片高度',
    `status` int COMMENT '生成状态',
    `finish_time` datetime COMMENT '完成时间',
    `error_message` text COMMENT '绘画错误信息',
    `pic_url` text COMMENT '图片地址',
    `public_status` bit(1) COMMENT '是否公开',
    `options` json COMMENT '绘制参数，不同 platform 的不同参数',
    `buttons` json COMMENT 'mj buttons 按钮',
    `task_id` varchar(255) COMMENT '任务编号',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiImage';
-- AiKnowledgeDO
DROP TABLE IF EXISTS `ai_knowledge`;
CREATE TABLE `ai_knowledge` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '知识库名称',
    `description` longtext COMMENT '知识库描述',
    `embedding_model_id` bigint COMMENT '向量模型编号',
    `embedding_model` varchar(255) COMMENT '模型标识',
    `top_k` int COMMENT 'topK',
    `similarity_threshold` double COMMENT '相似度阈值',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiKnowledge';
-- AiKnowledgeDocumentDO
DROP TABLE IF EXISTS `ai_knowledge_document`;
CREATE TABLE `ai_knowledge_document` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `knowledge_id` bigint COMMENT '知识库编号',
    `name` varchar(255) COMMENT '文档名称',
    `url` text COMMENT '文件 URL',
    `content` longtext COMMENT '内容',
    `content_length` int COMMENT '文档长度',
    `tokens` int COMMENT '文档 token 数量',
    `segment_max_tokens` int COMMENT '分片最大 Token 数',
    `retrieval_count` int COMMENT '召回次数',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiKnowledgeDocument';
-- AiKnowledgeSegmentDO
DROP TABLE IF EXISTS `ai_knowledge_segment`;
CREATE TABLE `ai_knowledge_segment` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `knowledge_id` bigint COMMENT '知识库编号',
    `document_id` bigint COMMENT '文档编号',
    `content` longtext COMMENT '切片内容',
    `content_length` int COMMENT '切片内容长度',
    `vector_id` varchar(255) COMMENT '向量库的编号',
    `tokens` int COMMENT 'token 数量',
    `retrieval_count` int COMMENT '召回次数',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiKnowledgeSegment';
-- AiWorkflowDO
DROP TABLE IF EXISTS `ai_workflow`;
CREATE TABLE `ai_workflow` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '工作流名称',
    `code` varchar(255) COMMENT '工作流标识',
    `graph` varchar(255) COMMENT '工作流模型 JSON 数据',
    `remark` text COMMENT '备注',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiWorkflow';
-- AiModelDO
DROP TABLE IF EXISTS `ai_model`;
CREATE TABLE `ai_model` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `key_id` bigint COMMENT 'API 秘钥编号',
    `name` varchar(255) COMMENT '模型名称',
    `model` varchar(255) COMMENT '模型标志',
    `platform` varchar(255) COMMENT '平台',
    `type` int COMMENT '类型',
    `sort` int COMMENT '排序值',
    `status` int COMMENT '状态',
    `temperature` double COMMENT '温度参数',
    `max_tokens` int COMMENT '单条回复的最大 Token 数量',
    `max_contexts` int COMMENT '上下文的最大 Message 数量',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiModel';
-- AiToolDO
DROP TABLE IF EXISTS `ai_tool`;
CREATE TABLE `ai_tool` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '工具编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '工具名称',
    `description` longtext COMMENT '工具描述',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiTool';
-- AiChatRoleDO
DROP TABLE IF EXISTS `ai_chat_role`;
CREATE TABLE `ai_chat_role` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '角色名称',
    `avatar` varchar(255) COMMENT '角色头像',
    `category` varchar(255) COMMENT '角色分类',
    `description` longtext COMMENT '角色描述',
    `system_message` text COMMENT '角色设定',
    `user_id` bigint COMMENT '用户编号',
    `model_id` bigint COMMENT '模型编号',
    `knowledge_ids` varchar(500) COMMENT '引用的知识库编号列表',
    `tool_ids` varchar(500) COMMENT '引用的工具编号列表',
    `mcp_client_names` varchar(1000) COMMENT '引用的 MCP Client 名字列表',
    `public_status` bit(1) COMMENT '是否公开',
    `sort` int COMMENT '排序值',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiChatRole';
-- AiApiKeyDO
DROP TABLE IF EXISTS `ai_api_key`;
CREATE TABLE `ai_api_key` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COMMENT '名称',
    `api_key` varchar(255) COMMENT '密钥',
    `platform` varchar(255) COMMENT '平台',
    `url` text COMMENT 'API 地址',
    `status` int COMMENT '状态',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiApiKey';
-- AiMindMapDO
DROP TABLE IF EXISTS `ai_mind_map`;
CREATE TABLE `ai_mind_map` (
    `tenant_id` bigint NOT NULL DEFAULT 0 COMMENT '租户编号',
    `id` bigint COMMENT '编号' NOT NULL AUTO_INCREMENT,
    `user_id` bigint COMMENT '用户编号',
    `platform` varchar(255) COMMENT '平台',
    `model_id` bigint COMMENT '模型编号',
    `model` varchar(255) COMMENT '模型',
    `prompt` varchar(255) COMMENT '生成内容提示',
    `generated_content` longtext COMMENT '生成的内容',
    `error_message` text COMMENT '错误信息',
    `creator` varchar(64) DEFAULT '' COMMENT '创建者',
    `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updater` varchar(64) DEFAULT '' COMMENT '更新者',
    `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AiMindMap';
