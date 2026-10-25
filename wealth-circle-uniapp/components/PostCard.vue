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
          </view>
          <text class="post-time-text">{{ post.createdAt }}</text>
        </view>
      </view>

      <!-- 右侧更多操作（···） -->
      <view class="more-menu-btn" @tap.stop="handleMoreMenu">
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

    <!-- 3. 话题标签与大标题 -->
    <view v-if="post.tags && post.tags.length" class="post-tags-row">
      <text 
        v-for="tag in post.tags" 
        :key="tag" 
        class="tag-link-item"
        @tap.stop="handleTagClick(tag)"
      >
        #{{ tag }}
      </text>
    </view>

    <text v-if="post.title" class="post-headline" @tap="handleCardClick">
      {{ post.title }}
    </text>

    <!-- 4. 正文排版与段落展示 -->
    <view class="post-body-container" @tap="handleCardClick">
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
        <text class="expand-btn-text">{{ isExpanded ? '收起' : '全文' }}</text>
      </view>
    </view>

    <!-- 5. 图片与研报图表展示 -->
    <view v-if="post.images && post.images.length" class="post-media-area">
      <view 
        v-if="post.images.length === 1" 
        class="single-image-wrap" 
        @tap.stop="handlePreviewImage(post.images, 0)"
      >
        <image :src="post.images[0]" class="single-post-img" mode="widthFix" />
      </view>
      <view v-else class="grid-images-wrap">
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
        <view class="file-download-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c59b27" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </view>
      </view>
    </view>

    <!-- 7. 点赞人社交证明条 (知识星球标志性灰底条) -->
    <view v-if="post.likers && post.likers.length" class="social-feedback-strip" @tap.stop="handleCardClick">
      <svg class="heart-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" stroke-width="1.5">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
      <text class="likers-summary-text ellipsis-1">
        <text class="liker-strong">{{ post.likers.slice(0, 3).join('、') }}</text>
        <text v-if="post.likers.length > 3"> 等 {{ post.likersCount || post.likes }} 人觉得很赞</text>
        <text v-else> 觉得很赞</text>
      </text>
    </view>

    <!-- 8. 精选热门评论预览 (知识星球经典直接露出1~2条高价值讨论) -->
    <view v-if="post.comments && post.comments.length" class="featured-comments-box" @tap.stop="handleCardClick">
      <view v-for="c in post.comments.slice(0, 2)" :key="c.id" class="featured-comment-line">
        <text class="c-author-name">{{ c.author.name }}:</text>
        <text class="c-content-text">{{ c.content }}</text>
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
        <svg class="action-svg" width="18" height="18" viewBox="0 0 24 24" :fill="post.isLiked ? '#d97706' : 'none'" :stroke="post.isLiked ? '#d97706' : '#64748b'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
        <text class="action-counter" :class="{ active: post.isLiked }">
          {{ post.likes > 0 ? post.likes : '赞' }}
        </text>
      </view>

      <!-- 讨论按钮 -->
      <view class="action-item-wrap" @tap.stop="handleCommentClick">
        <svg class="action-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        <text class="action-counter">
          {{ post.commentsCount > 0 ? post.commentsCount : '讨论' }}
        </text>
      </view>

      <!-- 分享按钮 -->
      <view class="action-item-wrap" @tap.stop="handleShareClick">
        <svg class="action-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { actions } from '../store/community.js';
import FileTypeIcon from './FileTypeIcon.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const isExpanded = ref(false);

// 判断正文是否较长需要折叠
const isContentLong = computed(() => {
  return props.post.content && (props.post.content.length > 120 || props.post.content.split('\n').length > 4);
});

// 段落拆解
const formattedParagraphs = computed(() => {
  if (!props.post.content) return [];
  return props.post.content.split(/\n+/).filter(Boolean);
});

// 轻量级 Markdown 语法转换（加粗、超链接）
const formatMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1c1c1e; font-weight: 700;">$1</strong>')
    .replace(/(https?:\/\/[^\s]+)/g, '<span style="color: #059669; text-decoration: underline;">$1</span>');
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const handleAuthorClick = () => {
  uni.showToast({ title: `查看 ${props.post.author.name} 的主页`, icon: 'none' });
};

const handleTagClick = (tag) => {
  uni.showToast({ title: `筛选 #${tag} 相关资讯`, icon: 'none' });
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
  uni.showToast({ title: '已生成长图分享卡片', icon: 'none' });
};

const handleMoreMenu = () => {
  uni.showActionSheet({
    itemList: ['复制链接', '生成海报', '收藏该动态'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.setClipboardData({
          data: `https://planet.yudao.com/post/${props.post.id}`,
          success: () => uni.showToast({ title: '已复制链接', icon: 'none' })
        });
      } else {
        uni.showToast({ title: '操作完成', icon: 'none' });
      }
    }
  });
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
  padding: 16px 16px 14px 16px;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  box-shadow: none !important;
  border: none;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.08);
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease;

  &:active {
    background-color: #fafafc;
  }
}

/* 1. 作者行 */
.author-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;
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
  width: 40px;
  height: 40px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
}

.avatar-badge {
  position: absolute;
  right: -2px;
  bottom: -2px;
  font-size: 8.5px;
  font-weight: 800;
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
  gap: 2px;
}

.name-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #1c1c1e;
  letter-spacing: -0.2px;
}

.author-role-chip {
  font-size: 10px;
  color: #8e8e93;
  background: #f2f2f7;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.post-time-text {
  font-size: 12px;
  color: #8e8e93;
}

.more-menu-btn {
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;

  &:active {
    background-color: #f2f2f7;
  }
}

/* 2. 问答卡片 (彻底斩除 3px 侧边条，改用 Apple 风格精致微框) */
.question-callout-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(245, 158, 11, 0.08);
  border: 0.5px solid rgba(245, 158, 11, 0.2);
  border-radius: 10px;
  padding: 9px 13px;
  margin-bottom: 11px;
}

.q-badge {
  font-size: 10px;
  font-weight: 700;
  background: rgba(245, 158, 11, 0.18);
  color: #b45309;
  border: 0.5px solid rgba(245, 158, 11, 0.3);
  padding: 1.5px 6px;
  border-radius: 4px;
  line-height: 1.3;
}

.q-lead {
  font-size: 12.5px;
  color: #78350f;
}

.q-target-name {
  font-weight: 700;
  color: #b45309;
}

/* 3. 话题与标题 */
.post-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.tag-link-item {
  font-size: 11.5px;
  font-weight: 500;
  color: #047857;
  background: rgba(16, 185, 129, 0.08);
  padding: 2.5px 9px;
  border-radius: 99px;
  line-height: 1.4;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.75;
  }
}

.post-headline {
  font-size: 16.5px;
  font-weight: 600;
  color: #1c1c1e;
  line-height: 1.4;
  margin-bottom: 8px;
  display: block;
  letter-spacing: -0.25px;
  cursor: pointer;
}

/* 4. 正文排版 */
.post-body-container {
  margin-bottom: 11px;
}

.content-paragraphs-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.is-clamped {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}

.paragraph-item {
  line-height: 1.68;
}

.rich-paragraph {
  font-size: 15px;
  color: #3a3a3c;
  word-break: break-word;
  letter-spacing: -0.1px;
  -webkit-font-smoothing: antialiased;
  -webkit-user-select: text;
  user-select: text;
}

.expand-action-row {
  margin-top: 5px;
  cursor: pointer;
  display: inline-block;
}

.expand-btn-text {
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
}

/* 5. 图片媒体 */
.post-media-area {
  margin-bottom: 11px;
}

.single-image-wrap {
  width: 100%;
  max-width: 320px;
}

.single-post-img {
  width: 100%;
  border-radius: 10px;
  border: 0.5px solid rgba(0, 0, 0, 0.05);
}

.grid-images-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.grid-img-item {
  width: calc(33.33% - 4px);
  height: 95px;
  border-radius: 8px;
  background: #f2f2f7;
}

/* 6. 文档附件 */
/* 6. 文档附件 (Sage 浅调中性面板与内敛红标) */
.post-files-area {
  margin-bottom: 11px;
}

.file-attachment-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f4f6f4;
  border: 0.5px solid rgba(40, 60, 45, 0.06);
  border-radius: 11px;
  padding: 9px 13px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.75;
  }
}

.file-meta-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-title-text {
  font-size: 13px;
  font-weight: 600;
  color: #1c1c1e;
}

.file-size-text {
  font-size: 11px;
  color: #8e8e93;
}

.file-download-btn {
  padding: 4px;
}

/* 7. 点赞人条 (Sage 浅面板) */
.social-feedback-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f4f6f4;
  border: 0.5px solid rgba(40, 60, 45, 0.04);
  border-radius: 10px;
  padding: 7px 11px;
  margin-bottom: 9px;
  cursor: pointer;
}

.heart-icon-svg {
  flex-shrink: 0;
}

.likers-summary-text {
  font-size: 11.5px;
  color: #8e8e93;
}

.liker-strong {
  font-weight: 600;
  color: #3a3a3c;
}

/* 8. 精选讨论预览 (Sage 浅面板) */
.featured-comments-box {
  background: #f4f6f4;
  border: 0.5px solid rgba(40, 60, 45, 0.04);
  border-radius: 11px;
  padding: 9px 13px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.featured-comment-line {
  font-size: 12.5px;
  line-height: 1.5;
}

.c-author-name {
  font-weight: 600;
  color: #1c1c1e;
  margin-right: 5px;
}

.c-content-text {
  color: #48484a;
}

.view-more-comments-link {
  margin-top: 2px;
  cursor: pointer;
}

.vm-text {
  font-size: 11.5px;
  color: #059669;
  font-weight: 600;
}

/* 9. 底部操作栏 */
.post-bottom-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
}

.action-item-wrap {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 6px;
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(0.25, 1, 0.5, 1);

  &:active {
    transform: scale(0.92);
  }

  &.active {
    .action-counter {
      color: #d97706;
      font-weight: 700;
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
  color: #8e8e93;
  font-weight: 500;
}

.detail-jump-wrap {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.75;
  }
}

.detail-jump-text {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
}
</style>
