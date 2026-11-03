<template>
  <view class="post-card-container">
    <!-- 1. 作者信息行 -->
    <view class="author-header-row">
      <view class="author-left-wrap" @tap.stop="handleAuthorClick">
        <view class="avatar-box">
          <image :src="post.author.avatar" class="author-avatar" mode="aspectFill" />
        </view>

        <view class="author-text-meta">
          <view class="name-line">
            <text class="author-name">{{ post.author.name }}</text>
            <text v-if="post.author.role && showRoleBadge(post.author.role)" class="c-role-badge" :class="isExpertRole(post.author.role) ? 'is-expert' : 'is-member'">{{ getRoleLabel(post.author.role) }}</text>
          </view>
          <text class="post-time-text">{{ post.createdAt }}</text>
        </view>
      </view>

      <!-- 右侧更多操作（···） -->
      <view class="more-menu-btn" @tap.stop="moreMenuVisible = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#94a3b8">
          <circle cx="5" cy="12" r="2"></circle>
          <circle cx="12" cy="12" r="2"></circle>
          <circle cx="19" cy="12" r="2"></circle>
        </svg>
      </view>
    </view>

    <!-- 2. 提问帖高光横条 (向嘉宾提问样式) -->
    <view v-if="post.questionTarget" class="question-callout-box">
      <view class="q-badge">问答</view>
      <text class="q-lead">向 <text class="q-target-name">@{{ post.questionTarget }}</text> 提问：</text>
    </view>

    <!-- 3. 话题标签（正文一部分：天蓝色文字流，与 PC 端一致） -->
    <!-- 4. 正文排版与段落展示 -->
    <view class="post-body-container" @tap="handleCardClick">
      <view v-if="post.tags && post.tags.length" class="post-tags-inline">
        <text
          v-for="tag in post.tags"
          :key="tag"
          class="tag-inline-text"
          @tap.stop="handleTagClick(tag)"
        >#{{ tag }} </text>
      </view>
      <view
        class="content-paragraphs-wrap"
        :class="{ 'is-clamped': !isExpanded && isContentLong }"
      >
        <view 
          v-for="(p, idx) in formattedParagraphs" 
          :key="idx" 
          class="paragraph-item"
        >
          <view class="rich-paragraph" v-html="formatMarkdown(p)"></view>
        </view>
      </view>

      <!-- 全文 / 收起 展开按钮 (知识星球经典绿色文字) -->
      <view v-if="isContentLong" class="expand-action-row" @tap.stop="isExpanded = !isExpanded">
        <text class="expand-btn-text">{{ isExpanded ? '收起' : '查看全文' }}</text>
      </view>
    </view>

    <!-- 5. 图片与研报图表展示（3 列缩略图宫格，点击进入大图左右切换） -->
    <view v-if="post.images && post.images.length" class="post-media-area">
      <view class="grid-images-wrap">
        <image 
          v-for="(img, idx) in post.images" 
          :key="idx" 
          :src="img" 
          class="grid-img-item" 
          mode="aspectFill"
          @tap.stop="handlePreviewImage(post.images, idx)"
        />
      </view>
    </view>

    <!-- 6. 研报文档附件卡片 -->
    <view v-if="post.attachments && post.attachments.length" class="post-files-area">
      <view 
        v-for="(att, idx) in post.attachments" 
        :key="idx" 
        class="file-attachment-card"
        @tap.stop="handleOpenAttachment(att)"
      >
        <FileTypeIcon :name="att.name" :size="28" />
        <view class="file-meta-col">
          <text class="file-title-text ellipsis-1">{{ att.name }}</text>
          <text class="file-size-text">{{ formatFileSize(att.size) }}</text>
        </view>
      </view>
    </view>

    <!-- 7. 点赞人条（扁平样式，对齐详情页；全部名字可点，超 6 行折叠可展开） -->
    <view v-if="post.likers && post.likers.length" class="social-feedback-strip" @tap.stop="handleCardClick">
      <view class="feedback-body">
        <view class="likers-names-wrap collapsed">
          <svg class="thumb-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="#0284c7" stroke="#0284c7" stroke-width="1.5">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>
          <text
            v-for="(liker, idx) in post.likers"
            :key="liker"
            class="liker-name"
            @tap.stop="goMemberProfile(liker)"
          >{{ liker }}{{ idx < post.likers.length - 1 ? '、' : '' }}</text>
          <text class="liker-suffix"> 等 {{ post.likersCount || post.likes }}人觉得很赞</text>
        </view>
      </view>
    </view>

    <!-- 8. 精选热门评论预览 (知识星球经典直接露出1~2条高价值讨论) -->
    <view v-if="post.comments && post.comments.length" class="featured-comments-box" @tap.stop="handleCardClick">
      <view v-for="c in post.comments.slice(0, 2)" :key="c.id" class="featured-comment-line">
        <text class="c-author-name" :class="isExpertRole(c.author.role) ? 'is-expert' : 'is-member'" @tap.stop="goMemberProfile(c.author.name)">{{ c.author.name }}</text>
        <text class="c-content-text">：{{ c.content }}</text>
      </view>
      <view v-if="post.comments.length > 2" class="view-more-comments-link">
        <text class="vm-text">查看全部 {{ post.commentsCount || post.comments.length }} 条讨论 ›</text>
      </view>
    </view>

    <!-- 9. 底部操作栏 (精美矢量 SVG 图标) -->
    <view class="post-bottom-actions-row">
      <!-- 点赞按钮 -->
      <view 
        class="action-item-wrap" 
        :class="{ active: post.isLiked }"
        @tap.stop="handleLikeToggle"
      >
        <svg class="action-svg" width="16" height="16" viewBox="0 0 24 24" :fill="post.isLiked ? '#d97706' : 'none'" :stroke="post.isLiked ? '#d97706' : '#64748b'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
        <text class="action-counter" :class="{ active: post.isLiked }">
          {{ post.likes > 0 ? post.likes : '赞' }}
        </text>
      </view>

      <!-- 讨论按钮 -->
      <view class="action-item-wrap" @tap.stop="handleCommentClick">
        <svg class="action-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        <text class="action-counter">
          {{ post.commentsCount > 0 ? post.commentsCount : '讨论' }}
        </text>
      </view>

      <!-- 分享按钮 -->
      <view class="action-item-wrap" @tap.stop="handleShareClick">
        <svg class="action-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <text class="action-counter">分享</text>
      </view>

      <!-- 查看详情链接 -->
      <view class="detail-jump-wrap" @tap.stop="handleCardClick">
        <text class="detail-jump-text">详情</text>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </view>
    </view>

    <!-- 更多操作底部抽屉（按身份展示操作项） -->
    <view v-if="moreMenuVisible" class="more-drawer-mask" @tap="moreMenuVisible = false">
      <view class="more-drawer-panel" @tap.stop>
        <view class="drawer-handle"></view>
        <view class="drawer-title">更多操作</view>
        <view class="drawer-item" @tap="handleCopyLink">复制链接</view>
        <view v-if="canEditDelete" class="drawer-item" @tap="handleEditPost">编辑</view>
        <view v-if="canEditDelete" class="drawer-item drawer-item-danger" @tap="handleDeletePost">删除</view>
        <view class="drawer-item drawer-cancel" @tap="moreMenuVisible = false">取消</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appState, actions } from '../store/community.js';
import FileTypeIcon from './FileTypeIcon.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['share']);

const isExpanded = ref(false);

// 判断正文是否较长需要折叠
const isContentLong = computed(() => {
  return props.post.content && (props.post.content.length > 120 || props.post.content.split('\n').length > 4);
});

// 身份配色与角色标签：星主/合伙人/嘉宾/小助理名字橙色，其余（年度会员/星友）蓝色
const isExpertRole = (role) => ['founder', 'partner', 'guest', 'assistant'].includes(role);

// 名字后的角色徽章仅星主/合伙人/嘉宾/小助理展示，其余身份不显示
const showRoleBadge = isExpertRole;

const getRoleLabel = (role) => ({
  founder: '星主',
  partner: '合伙人',
  guest: '嘉宾',
  assistant: '小助理',
  vip: '会员',
  member: '星友'
}[role] || '星友');

// 段落拆解
const formattedParagraphs = computed(() => {
  if (!props.post.content) return [];
  return props.post.content.split(/\n+/).filter(Boolean);
});

// 轻量级 Markdown 语法转换（加粗、超链接）
const formatMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0f172a; font-weight: 600;">$1</strong>')
    .replace(/(https?:\/\/[^\s]+)/g, '<span style="color: #059669; text-decoration: underline;">$1</span>');
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const handleAuthorClick = () => {
  uni.navigateTo({ url: `/pages/member/profile?name=${encodeURIComponent(props.post.author.name)}` });
};

const goMemberProfile = (name) => {
  uni.navigateTo({ url: `/pages/member/profile?name=${encodeURIComponent(name)}` });
};

const handleTagClick = (tag) => {
  uni.navigateTo({
    url: `/pages/feed/tag?tag=${encodeURIComponent(tag)}`
  });
};

const handleCardClick = () => {
  uni.navigateTo({
    url: `/pages/feed/detail?id=${props.post.id}`
  });
};

const handleLikeToggle = () => {
  actions.toggleLikePost(props.post.id);
};

const handleCommentClick = () => {
  if (actions.checkVipPermission('评论功能为会员专享，开通会员立即参与讨论')) {
    uni.navigateTo({
      url: `/pages/feed/detail?id=${props.post.id}`
    });
  }
};

const handleShareClick = () => {
  emit('share', props.post);
  actions.openPostShareModal(props.post);
};

// 更多操作底部抽屉（对齐 PC 端：复制链接所有人可见；编辑/删除仅星主或作者本人可见）
const moreMenuVisible = ref(false);
const isCreator = computed(() => appState.user.id === props.post.author.id);
const canEditDelete = computed(() => appState.user.role === 'founder' || isCreator.value);

const handleCopyLink = () => {
  moreMenuVisible.value = false;
  uni.setClipboardData({
    data: `https://planet.yudao.com/post/${props.post.id}`,
    success: () => uni.showToast({ title: '已复制链接', icon: 'none' })
  });
};

const handleEditPost = () => {
  moreMenuVisible.value = false;
  uni.showToast({ title: '编辑功能开发中，敬请期待', icon: 'none' });
};

const handleDeletePost = () => {
  moreMenuVisible.value = false;
  actions.deletePost(props.post.id);
};

const handlePreviewImage = (images, current) => {
  uni.previewImage({
    urls: images,
    current
  });
};

// 文档附件：点击在线打开（App 内调用系统能力，H5 新窗口预览）
const handleOpenAttachment = (att) => {
  const url = att.url || '';
  if (!url) {
    uni.showToast({ title: '暂无可预览的文件', icon: 'none' });
    return;
  }
  // #ifdef H5
  const win = window.open(url, '_blank');
  if (!win) window.location.href = url;
  // #endif
  // #ifdef APP-PLUS
  if (window.plus && window.plus.runtime) {
    window.plus.runtime.openURL(url);
  }
  // #endif
};
</script>

<style lang="scss" scoped>
.post-card-container {
  background: #ffffff;
  border-radius: 0;
  padding: 14px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  box-shadow: none !important;
  border: none;
  border-bottom: 0.5px solid #f1f5f9;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease;

  &:active {
    background-color: #f8fafc;
  }
}

/* 1. 作者行 */
.author-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.author-left-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:active {
    opacity: 0.82;
  }
}

.avatar-box {
  position: relative;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 0.5px solid rgba(15, 23, 42, 0.08);
  display: block;
}

.avatar-badge {
  position: absolute;
  right: -2px;
  bottom: -2px;
  font-size: 9px;
  font-weight: 700;
  padding: 0 4px;
  height: 14px;
  line-height: 14px;
  border-radius: 4px;
  color: #ffffff;
  border: 1px solid #ffffff;

  &.badge-founder { background: #ef4444; }
  &.badge-partner { background: #2563eb; }
  &.badge-vip { background: #d97706; }
}

.author-text-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.name-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.25;
  letter-spacing: -0.1px;
}

.author-role-chip {
  font-size: 10px;
  color: #475569;
  background: #f1f5f9;
  border: 0.5px solid #e2e8f0;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.post-time-text {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.2;
}

.more-menu-btn {
  padding: 6px;
  margin-right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;

  &:active {
    background-color: #f8fafc;
  }
}

/* 更多操作底部抽屉 */
.more-drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  animation: drawerFadeIn 0.2s ease;
}

.more-drawer-panel {
  width: 100%;
  background: #ffffff;
  border-radius: 12px 12px 0 0;
  padding: 10px 16px calc(14px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  animation: drawerSlideUp 0.25s ease;
}

.drawer-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  margin: 0 auto 10px;
}

.drawer-title {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  padding-bottom: 6px;
}

.drawer-item {
  text-align: center;
  font-size: 14px;
  color: #0f172a;
  padding: 12px 0;
  border-radius: 8px;
  cursor: pointer;
}

.drawer-item:active {
  background: #f8fafc;
}

.drawer-item-danger {
  color: #dc2626;
  font-weight: 600;
}

.drawer-cancel {
  margin-top: 6px;
  border-top: 0.5px solid #f1f5f9;
  color: #64748b;
}

@keyframes drawerFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes drawerSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* 2. 问答卡片 (8px 圆角规范，紧凑微框) */
.question-callout-box {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 46px;
  background: rgba(245, 158, 11, 0.08);
  border: 0.5px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  padding: 7px 10px;
  margin-bottom: 8px;
}

.q-badge {
  font-size: 11px;
  font-weight: 600;
  background: rgba(245, 158, 11, 0.16);
  color: #b45309;
  border: 0.5px solid rgba(245, 158, 11, 0.28);
  padding: 1.5px 5px;
  border-radius: 4px;
  line-height: 1.2;
  flex-shrink: 0;
}

.q-lead {
  font-size: 14px;
  color: #78350f;
  line-height: 1.45;
}

.q-target-name {
  font-weight: 600;
  color: #b45309;
}

/* 3. 话题标签 */
.post-tags-inline {
  margin-bottom: 2px;
  line-height: 1.6;
}

/* 话题标签：正文文字流样式（天蓝色，与 PC 端 title-tag 一致） */
.tag-inline-text {
  font-size: 14px;
  font-weight: 500;
  color: #0284c7;
  line-height: 1.6;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.75;
  }
}

/* 4. 正文排版 (14px 主字体规范) */
.post-body-container {
  margin-left: 46px;
  margin-bottom: 10px;
}

.content-paragraphs-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.is-clamped {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}

.paragraph-item {
  line-height: 1.65;
}

.rich-paragraph {
  font-size: 14px;
  color: #334155;
  word-break: break-word;
  letter-spacing: 0;
  -webkit-font-smoothing: antialiased;
  -webkit-user-select: text;
  user-select: text;
}

.expand-action-row {
  margin-top: 4px;
  cursor: pointer;
  display: inline-block;
}

.expand-btn-text {
  font-size: 14px;
  font-weight: 500;
  color: #0284c7;
}

/* 5. 图片媒体（3 列方形缩略图宫格，8px 圆角） */
.post-media-area {
  margin-left: 46px;
  margin-bottom: 10px;
}

.grid-images-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.grid-img-item {
  width: 82px;
  height: 82px;
  border-radius: 8px;
  background: #f8fafc;
  border: 0.5px solid rgba(15, 23, 42, 0.06);
}

/* 6. 文档附件 (8px 圆角规范) */
.post-files-area {
  margin-left: 46px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-attachment-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #edf2f7;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:active {
    background-color: #f8fafc;
    border-color: #e2e8f0;
  }
}

.file-meta-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-title-text {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.35;
}

.file-size-text {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.2;
}

/* 7. 点赞人条（扁平样式，14px 统一主字体规范） */
.social-feedback-strip {
  margin-left: 46px;
  padding: 2px 0 0;
  margin-bottom: 6px;
}

.thumb-icon-svg {
  display: inline-block;
  vertical-align: -2px;
  margin-right: 4px;
}

.likers-names-wrap {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  line-height: 1.55;
  word-break: break-word;
}

/* 折叠态：最多 6 行（6 × 21.7px） */
.likers-names-wrap.collapsed {
  max-height: 132px;
  overflow: hidden;
}

.feedback-body {
  flex: 1;
  min-width: 0;
}

.liker-name {
  color: #0284c7;
  font-weight: 500;
}

.liker-suffix {
  color: #64748b;
}

/* 8. 精选讨论预览 (扁平样式，14px 统一主字体规范) */
.featured-comments-box {
  margin-left: 46px;
  padding: 0;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.featured-comment-line {
  font-size: 14px;
  line-height: 1.55;
}

/* 名字颜色：星主/合伙人/嘉宾橙色，年度会员/星友蓝色 */
.c-author-name {
  font-weight: 600;

  &.is-expert { color: #ea580c; }
  &.is-member { color: #0284c7; }
}

/* 名字后的星球角色小徽章 */
.c-role-badge {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 4px;

  &.is-expert { background: #fff7ed; color: #ea580c; border: 0.5px solid #fdba74; }
  &.is-member { background: #eff6ff; color: #2563eb; border: 0.5px solid #93c5fd; }
}

.c-content-text {
  color: #334155;
}

.view-more-comments-link {
  margin-top: 1px;
  cursor: pointer;
}

.vm-text {
  font-size: 14px;
  color: #059669;
  font-weight: 500;
}

/* 9. 底部操作栏 (首尾负边距光学补偿，与正文左缘 46px、右缘 16px 严格对齐) */
.post-bottom-actions-row {
  margin-left: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2px;
}

.action-item-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(0.25, 1, 0.5, 1);

  &:first-child {
    margin-left: -6px;
  }

  &:active {
    transform: scale(0.92);
  }

  &.active {
    .action-counter {
      color: #d97706;
      font-weight: 600;
    }

    .action-svg {
      animation: heartPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  }
}

@keyframes heartPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.24); }
  100% { transform: scale(1); }
}

.action-svg {
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}

.action-counter {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  line-height: 1;
}

.detail-jump-wrap {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  margin-right: -6px;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.75;
  }
}

.detail-jump-text {
  font-size: 12px;
  font-weight: 500;
  color: #059669;
  line-height: 1;
}
</style>
