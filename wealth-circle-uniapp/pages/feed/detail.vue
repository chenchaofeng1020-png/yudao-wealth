<template>
  <view class="detail-page-root" v-if="currentPost">
    <!-- 帖子主体卡片 -->
    <view class="post-detail-card">
      <!-- 1. 作者信息行 -->
      <view class="detail-author-row">
        <view class="avatar-wrap">
          <image :src="currentPost.author.avatar" class="author-avatar" mode="aspectFill" />
        </view>

        <view class="author-meta-col">
          <view class="name-line">
            <text class="author-name">{{ currentPost.author.name }}</text>
          </view>
          <text class="post-time">{{ currentPost.createdAt }}</text>
        </view>

        <view class="share-icon-btn" @tap="handleShare">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </view>
      </view>

      <!-- 2. 提问贴高光横条 -->
      <view v-if="currentPost.questionTarget" class="question-callout-box">
        <text class="q-badge">问答</text>
        <text class="q-lead">向 <text class="q-target-name">@{{ currentPost.questionTarget }}</text> 提问：</text>
      </view>

      <!-- 3. 话题标签与大标题 -->
      <view v-if="currentPost.tags && currentPost.tags.length" class="tags-row">
        <text v-for="tag in currentPost.tags" :key="tag" class="tag-link-item">#{{ tag }}</text>
      </view>

      <text v-if="currentPost.title" class="detail-post-title">{{ currentPost.title }}</text>

      <!-- 4. 正文排版与 Markdown 解析 -->
      <view class="detail-content-paragraphs">
        <view 
          v-for="(p, idx) in formattedParagraphs" 
          :key="idx" 
          class="detail-paragraph-item"
        >
          <view class="rich-paragraph" v-html="formatMarkdown(p)"></view>
        </view>
      </view>

      <!-- 5. 研报大图预览 -->
      <view v-if="currentPost.images && currentPost.images.length" class="detail-images-wrap">
        <image 
          v-for="(img, idx) in currentPost.images" 
          :key="idx" 
          :src="img" 
          class="detail-post-img" 
          mode="widthFix"
          @tap="previewImage(currentPost.images, idx)"
        />
      </view>

      <!-- 6. 研报附件 -->
      <view v-if="currentPost.attachments && currentPost.attachments.length" class="detail-files-wrap">
        <view 
          v-for="(att, idx) in currentPost.attachments" 
          :key="idx" 
          class="file-attachment-card"
          @tap="handleOpenAttachment(att)"
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

      <!-- 7. 点赞与互动操作条 (对齐专栏详情页) -->
      <view class="social-interactive-wrap">
        <view class="interactive-btn-group">
          <view
            class="interactive-btn like-btn"
            :class="{ 'is-active': currentPost.isLiked }"
            @tap="handleToggleLike"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              :fill="currentPost.isLiked ? '#d97706' : 'none'"
              :stroke="currentPost.isLiked ? '#d97706' : '#64748b'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            <text class="interactive-txt">{{ currentPost.isLiked ? '已赞' : '点赞' }} ({{ postLikes }})</text>
          </view>

          <view class="interactive-btn" @tap="handleShare">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <text class="interactive-txt">分享</text>
          </view>
        </view>

        <!-- 点赞人文字条 (对齐专栏详情页) -->
        <view v-if="postLikers.length > 0" class="social-feedback-bar">
          <view class="feedback-left">
            <svg class="feedback-heart-icon" width="14" height="14" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" stroke-width="1.5">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            <text class="feedback-count">{{ likersSummaryText }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 讨论评论楼层区 -->
    <view class="comments-thread-card">
      <view class="thread-header">
        <text class="thread-title">全部评论</text>
        <text class="thread-count">共 {{ currentPost.comments.length }} 条</text>
      </view>

      <view v-if="rootComments.length > 0" class="comments-list">
        <view v-for="c in rootComments" :key="c.id" class="comment-row-item">
          <image :src="c.author.avatar || '/static/avatar_john.png'" class="comment-author-avatar" mode="aspectFill" />
          <view class="comment-main-body">
            <view class="comment-head-line">
              <view class="c-user-meta">
                <text class="c-name">{{ c.author.name }}</text>
              </view>
              <text class="c-time">{{ c.createdAt }}</text>
            </view>
            <text class="c-content-body">{{ c.content }}</text>
            <view class="comment-action-row">
              <text class="comment-reply-btn" @tap="handleStartReply(c, c.author.name)">回复</text>
            </view>

            <!-- 楼中楼：子回复列表 -->
            <view v-if="c.replies && c.replies.length" class="reply-list">
              <view v-for="r in c.replies" :key="r.id" class="reply-item">
                <image :src="r.author.avatar || '/static/avatar_john.png'" class="reply-avatar" mode="aspectFill" />
                <view class="reply-body">
                  <view class="comment-head-line">
                    <text class="reply-name">{{ r.author.name }}</text>
                    <text class="c-time">{{ r.createdAt }}</text>
                  </view>
                  <text class="reply-content">
                    <text v-if="r.replyToName" class="reply-mention">回复 @{{ r.replyToName }}：</text>{{ r.content }}
                  </text>
                  <view v-if="r.images && r.images.length" class="reply-images-row">
                    <image
                      v-for="(img, i) in r.images"
                      :key="i"
                      :src="img"
                      class="reply-img-thumb"
                      mode="aspectFill"
                      @tap="previewReplyImage(r.images, i)"
                    />
                  </view>
                  <view class="comment-action-row">
                    <text class="comment-reply-btn" @tap="handleStartReply(c, r.author.name)">回复</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-thread-state">
        <text class="empty-hint">暂无讨论，快来发表你的专业见解吧！</text>
      </view>
    </view>

    <!-- 底部固定吸底操作条（无阴影） -->
    <view class="detail-bottom-fixed-bar safe-bottom">
      <view v-if="isVipOrAbove" class="reply-input-form">
        <input
          v-model="commentInput"
          class="reply-text-input"
          placeholder="发表你的评论"
          @confirm="handleSubmitComment"
        />
        <button 
          class="btn-send-reply" 
          :disabled="!commentInput.trim()"
          @tap="handleSubmitComment"
        >
          发送
        </button>
      </view>

      <view v-else class="vip-locked-bar" @tap="handleOpenVipModal">
        <view class="vlb-left">
          <text class="vlb-crown">👑</text>
          <text class="vlb-lead">开通会员解锁评论与提问交流特权</text>
        </view>
        <view class="btn-vlb-action">
          <text class="vlb-btn-text">立即开通</text>
          <text class="vlb-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 回复评论底部抽屉（对齐专栏详情页：回复对象 + 输入区 + 图片/表情工具栏） -->
    <view v-if="replyDrawerVisible" class="reply-drawer-backdrop" @tap="closeReplyDrawer">
      <view class="reply-drawer" @tap.stop>
        <view class="reply-drawer-target">回复 {{ replyTarget ? replyTarget.name : '' }}</view>

        <textarea
          v-model="replyText"
          class="reply-drawer-textarea"
          :focus="replyDrawerVisible"
          :maxlength="1000"
          placeholder="点赞太容易，评论显真情"
          auto-height
        />

        <!-- 已选图片预览 -->
        <view v-if="replyImages.length" class="reply-images-row">
          <view v-for="(img, i) in replyImages" :key="i" class="reply-image-box">
            <image :src="img" class="reply-image-thumb" mode="aspectFill" />
            <view class="reply-image-del" @tap="removeReplyImage(i)">×</view>
          </view>
        </view>

        <!-- 表情面板 -->
        <view v-if="isEmojiPanelVisible" class="emoji-panel">
          <text v-for="e in emojiList" :key="e" class="emoji-cell" @tap="appendEmoji(e)">{{ e }}</text>
        </view>

        <!-- 底部工具栏：仅支持图片和表情 -->
        <view class="reply-drawer-toolbar">
          <view class="toolbar-left">
            <view class="toolbar-icon-btn" @tap="chooseReplyImage">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
            </view>
            <view class="toolbar-icon-btn" @tap="isEmojiPanelVisible = !isEmojiPanelVisible">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </view>
          </view>
          <view class="toolbar-right">
            <text class="char-count">({{ replyText.length }}/1000)</text>
            <button class="btn-publish-reply" :disabled="!canPublishReply" @tap="publishReply">发布</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 会员开通弹窗 -->
    <VipJoinModal />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appState, actions, isVipOrAbove } from '../../store/community.js';
import FileTypeIcon from '../../components/FileTypeIcon.vue';
import VipJoinModal from '../../components/VipJoinModal.vue';

const postId = ref('post-1');
const commentInput = ref('');
const replyTarget = ref(null); // { parentId, name }
const replyDrawerVisible = ref(false);
const replyText = ref('');
const replyImages = ref([]);
const isEmojiPanelVisible = ref(false);
const emojiList = ['😀', '😁', '😂', '🤣', '😊', '😍', '🤔', '😎', '😭', '😅', '👍', '👏', '🙏', '💪', '🙌', '🔥', '💯', '🎉', '🚀', '💰', '📈', '📉', '🧠', '⚡'];

onLoad((options) => {
  if (options && options.id) {
    postId.value = options.id;
  }
});

const currentPost = computed(() => {
  return appState.posts.find(p => p.id === postId.value) || appState.posts[0];
});

const formattedParagraphs = computed(() => {
  if (!currentPost.value || !currentPost.value.content) return [];
  return currentPost.value.content.split(/\n+/).filter(Boolean);
});

const postLikes = computed(() => {
  return currentPost.value ? (currentPost.value.likes ?? 0) : 0;
});

const postLikers = computed(() => {
  return (currentPost.value && currentPost.value.likers) || ['Rich', '远山求道', 'Mark', 'Jerry'];
});

const likersSummaryText = computed(() => {
  const likers = postLikers.value;
  if (!likers || likers.length === 0) return '暂无点赞';
  return `${likers.join('、')} 等 ${postLikes.value}人觉得很赞`;
});

const rootComments = computed(() => {
  if (!currentPost.value || !currentPost.value.comments) return [];
  return currentPost.value.comments.filter(c => !c.parentId);
});

const formatMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0f172a; font-weight: 700;">$1</strong>')
    .replace(/(https?:\/\/[^\s]+)/g, '<span style="color: #0284c7;">$1</span>');
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const handleShare = () => {
  uni.showToast({ title: '已生成长图分享卡片', icon: 'none' });
};

const previewImage = (images, current) => {
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

const handleSubmitComment = () => {
  if (!commentInput.value.trim()) return;
  const success = actions.addComment(currentPost.value.id, commentInput.value);
  if (success) {
    commentInput.value = '';
  }
};

const handleToggleLike = () => {
  actions.toggleLikePost(currentPost.value.id);
};

const handleStartReply = (parentComment, name) => {
  replyTarget.value = { parentId: parentComment.id, name };
  replyText.value = '';
  replyImages.value = [];
  isEmojiPanelVisible.value = false;
  replyDrawerVisible.value = true;
};

const closeReplyDrawer = () => {
  replyDrawerVisible.value = false;
  replyTarget.value = null;
  replyText.value = '';
  replyImages.value = [];
  isEmojiPanelVisible.value = false;
};

const canPublishReply = computed(() => {
  return !!(replyText.value.trim() || replyImages.value.length);
});

const publishReply = () => {
  if (!canPublishReply.value || !replyTarget.value) return;
  const success = actions.addComment(
    currentPost.value.id,
    replyText.value || '[图片]',
    replyTarget.value,
    replyImages.value
  );
  if (success) {
    closeReplyDrawer();
  }
};

const chooseReplyImage = () => {
  uni.chooseImage({
    count: 3,
    success: (res) => {
      replyImages.value = replyImages.value.concat(res.tempFilePaths || []);
    }
  });
};

const removeReplyImage = (index) => {
  replyImages.value.splice(index, 1);
};

const appendEmoji = (emoji) => {
  replyText.value += emoji;
};

const previewReplyImage = (images, index) => {
  uni.previewImage({ urls: images, current: index });
};

const handleOpenVipModal = () => {
  appState.isVipModalVisible = true;
};
</script>

<style lang="scss" scoped>
.detail-page-root {
  min-height: 100vh;
  background-color: #f4f6f8;
  padding-bottom: 80px;
}

.post-detail-card {
  background: #ffffff;
  padding: 16px 16px 14px 16px;
  margin-bottom: 0;
  border-bottom: none;
  box-shadow: none !important;
}

/* 1. 作者行 */
.detail-author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.avatar-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  margin-right: 10px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #edf2f7;
}

.author-meta-col {
  flex: 1;
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
  font-weight: 800;
  color: #0f172a;
}

.author-role-chip {
  font-size: 10.5px;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
}

.post-time {
  font-size: 11.5px;
  color: #94a3b8;
}

.share-icon-btn {
  padding: 6px;
}

/* 2. 问答横条 */
.question-callout-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  border-radius: 0 6px 6px 0;
  padding: 7px 10px;
  margin-bottom: 10px;
}

.q-badge {
  font-size: 10px;
  font-weight: 800;
  background: #f59e0b;
  color: #ffffff;
  padding: 1px 5px;
  border-radius: 3px;
}

.q-lead {
  font-size: 12.5px;
  color: #78350f;
}

.q-target-name {
  font-weight: 800;
  color: #b45309;
}

/* 3. 话题与标题 */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.tag-link-item {
  font-size: 13px;
  font-weight: 600;
  color: #0284c7;
}

.detail-post-title {
  font-size: 17px;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.45;
  margin-bottom: 12px;
  display: block;
}

/* 4. 正文段落排版 */
.detail-content-paragraphs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}

.detail-paragraph-item {
  line-height: 1.7;
}

.rich-paragraph {
  font-size: 15px;
  color: #1e293b;
  word-break: break-word;
}

/* 5. 大图 */
.detail-images-wrap {
  margin-bottom: 14px;
}

.detail-post-img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
}

/* 6. 文档卡片 */
.detail-files-wrap {
  margin-bottom: 14px;
}

.file-attachment-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
}

.file-meta-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-title-text {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.file-size-text {
  font-size: 11px;
  color: #94a3b8;
}

/* 7. 点赞与互动操作条 (对齐专栏详情页) */
.social-interactive-wrap {
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.interactive-btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.interactive-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  background: #f1f5f9;
  border: 0.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s ease;

  &:active {
    transform: scale(0.96);
  }

  &.like-btn.is-active {
    background: #fef3c7;
    border-color: rgba(217, 119, 6, 0.3);

    .interactive-txt {
      color: #d97706;
      font-weight: 700;
    }
  }
}

.interactive-txt {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

/* 点赞人文字条 */
.social-feedback-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid #edf2f7;
  gap: 8px;
}

.feedback-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.feedback-heart-icon {
  flex-shrink: 0;
}

.feedback-count {
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
  line-height: 1.4;
  word-break: break-word;
}

/* 评论讨论楼层 */
.comments-thread-card {
  background: #ffffff;
  padding: 16px;
  box-shadow: none !important;
}

.thread-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.thread-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.thread-count {
  font-size: 12px;
  color: #94a3b8;
}

.comments-list {
  display: flex;
  flex-direction: column;
}

.comment-row-item {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f8fafc;

  &:last-child {
    border-bottom: none;
  }
}

.comment-author-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-main-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.comment-head-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.c-user-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.c-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.c-time {
  font-size: 11px;
  color: #94a3b8;
}

.c-content-body {
  font-size: 13.5px;
  color: #334155;
  line-height: 1.5;
}

/* 回复按钮行与楼中楼 */
.comment-action-row {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.comment-reply-btn {
  font-size: 12px;
  color: #94a3b8;
  padding: 2px 0;
}

.reply-list {
  margin-top: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply-item {
  display: flex;
  gap: 8px;
}

.reply-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.reply-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reply-name {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.reply-content {
  font-size: 12.5px;
  color: #334155;
  line-height: 1.5;
}

.reply-mention {
  color: #2563eb;
}

.reply-img-thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
}

.empty-thread-state {
  padding: 30px 0;
  text-align: center;
}

.empty-hint {
  font-size: 12.5px;
  color: #94a3b8;
}

/* 吸底操作条 */
.detail-bottom-fixed-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #edf2f7;
  padding: 8px 14px;
  padding-bottom: calc(10px + constant(safe-area-inset-bottom));
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  z-index: 50;
  box-shadow: none !important;
  box-sizing: border-box;
}

.reply-input-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reply-text-input {
  flex: 1;
  height: 38px;
  background: #f1f5f9;
  border-radius: 19px;
  padding: 0 14px;
  font-size: 13px;
  color: #0f172a;
}

.btn-send-reply {
  background: linear-gradient(135deg, #dfb76c 0%, #c59b27 100%);
  color: #121214;
  font-size: 12.5px;
  font-weight: 800;
  padding: 0 16px;
  height: 38px;
  line-height: 38px;
  border-radius: 19px;
  border: none;

  &[disabled] { opacity: 0.5; }
}

.vip-locked-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 10px;
  padding: 10px 14px;
}

.vlb-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vlb-crown {
  font-size: 16px;
}

.vlb-lead {
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
}

.btn-vlb-action {
  display: flex;
  align-items: center;
  gap: 2px;
}

.vlb-btn-text {
  font-size: 12px;
  font-weight: 800;
  color: #f59e0b;
}

.vlb-arrow {
  font-size: 14px;
  font-weight: 900;
  color: #f59e0b;
}

/* ===== 回复评论底部抽屉（对齐专栏详情页） ===== */
.reply-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.reply-drawer {
  width: 100%;
  background: #ffffff;
  border-radius: 8px 8px 0 0;
  padding: 14px 20px;
  padding-bottom: calc(14px + constant(safe-area-inset-bottom));
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.reply-drawer-target {
  font-size: 12px;
  color: #94a3b8;
  margin: 8px 0 10px;
}

.reply-drawer-textarea {
  width: 100%;
  min-height: 96px;
  font-size: 15px;
  line-height: 1.6;
  color: #0f172a;
  box-sizing: border-box;
}

/* 抽屉内已选图片预览行 */
.reply-images-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
}

.reply-image-box {
  position: relative;
  width: 56px;
  height: 56px;
}

.reply-image-thumb {
  width: 56px;
  height: 56px;
  border-radius: 8px;
}

.reply-image-del {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.7);
  color: #ffffff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

/* 表情面板 */
.emoji-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
}

.emoji-cell {
  width: calc(100% / 8 - 6px);
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

/* 抽屉底部工具栏：仅支持图片和表情 */
.reply-drawer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 22px;
}

.toolbar-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.char-count {
  font-size: 11px;
  color: #94a3b8;
}

.btn-publish-reply {
  background: #10b981;
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  padding: 0 14px;
  height: 32px;
  line-height: 32px;
  border-radius: 16px;
  border: none;

  &[disabled] { opacity: 0.5; }
}
</style>
