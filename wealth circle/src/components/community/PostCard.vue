<template>
  <article class="post-card animate-fade-in">
    <!-- Author Meta Row -->
    <div class="post-author-row">
      <div class="author-left" title="查看TA的主页" @click.stop="actions.openUserProfile(post.author.name)">
        <img :src="post.author.avatar" class="author-avatar" alt="Avatar" />
        <div class="author-meta">
          <div class="name-row">
            <span :class="['author-name', { 'author-name-mark': post.author.name === 'Mark' }]">
              {{ post.author.name }}
            </span>
          </div>
          <span class="post-time">{{ post.createdAt }}</span>
        </div>
      </div>

      <!-- Right More Options (...) Dropdown -->
      <div class="author-right-menu">
        <button class="more-btn" title="更多操作" @click.stop="menuOpen = !menuOpen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.8"></circle>
            <circle cx="12" cy="12" r="1.8"></circle>
            <circle cx="19" cy="12" r="1.8"></circle>
          </svg>
        </button>
        <transition name="menu-fade">
          <div v-if="menuOpen" class="post-menu" @click.stop>
            <div class="menu-item" @click="handleCopyLink">复制链接</div>
            <div v-if="canEditDelete" class="menu-item" @click="handleEdit">编辑</div>
            <div v-if="canEditDelete" class="menu-item menu-item-danger" @click="handleDelete">删除</div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Post Title Row (Tags in sky blue + Title in bold text) -->
    <div v-if="post.title || (post.tags && post.tags.length)" class="post-title-row">
      <span 
        v-for="tag in post.tags" 
        :key="tag" 
        class="title-tag"
        @click.stop="actions.openTagView(tag)"
      >
        #{{ tag }}
      </span>
      <h3 v-if="post.title" class="post-title-text">
        {{ post.title }}
      </h3>
    </div>

    <!-- Post Content Container -->
    <div class="post-content-container">
      <div ref="postTextRef" :class="['post-text', { 'vip-locked-blur': isLockedForUser, 'text-collapsed': !isExpanded }]">
        <p
          v-for="(paragraph, idx) in formattedParagraphs"
          :key="idx"
          class="content-p"
          v-html="formatMarkdown(paragraph)"
        ></p>
      </div>

      <!-- Expand / Collapse Button（正文超过折叠行数时才显示） -->
      <div v-if="!hideExpand && contentOverflow" class="expand-action-row">
        <span class="expand-btn" @click="isExpanded = !isExpanded">
          {{ isExpanded ? '收起全部' : '展开全部' }}
        </span>
      </div>

      <!-- Bottom Topic Tags (Pill Badges) -->
      <div v-if="post.tags && post.tags.length" class="post-tags-pill-row">
        <span 
          v-for="tag in post.tags" 
          :key="tag" 
          class="tag-pill-badge"
          @click.stop="actions.openTagView(tag)"
        >
          {{ tag }}
        </span>
      </div>

      <!-- VIP Paywall Overlay if locked -->
      <div v-if="isLockedForUser" class="vip-lock-overlay">
        <div class="lock-icon-wrap">🔒</div>
        <div class="lock-title">本篇为「财不外露」私享会员独享研报</div>
        <p class="lock-tip">已包含深度安全边际估值模型与底仓清单</p>
        <button class="btn-vip" @click="appState.isVipJoinModalOpen = true">
          开通会员
        </button>
      </div>
    </div>

    <!-- Attached Images / Chart Preview -->
    <div v-if="post.images && post.images.length && !isLockedForUser" class="post-images-container">
      <div 
        v-for="(img, idx) in post.images" 
        :key="idx" 
        class="chart-img-wrap"
        @click="actions.showToast('点击查看高清大图')"
      >
        <img :src="img" class="feed-chart-img" alt="研究图表" />
      </div>
    </div>

    <!-- Action Bar (Likes, Comments, Favorite, Report, Share, Detail) -->
    <div class="post-action-bar">
      <div class="action-bar-left">
        <!-- Like Button -->
        <button 
          :class="['action-btn', { active: post.isLiked }]"
          title="赞"
          @click="actions.toggleLikePost(post.id)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" :fill="post.isLiked ? '#d97706' : 'none'" :stroke="post.isLiked ? '#d97706' : 'currentColor'" stroke-width="1.8">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>
        </button>

        <!-- Comment Button -->
        <button 
          class="action-btn" 
          title="讨论"
          @click="focusCommentInput"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </button>

        <!-- Share Button -->
        <button class="action-btn" title="分享" @click="actions.showToast('已生成分享卡片')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>

      <!-- Right: 查看详情 > -->
      <div v-if="showDetailLink" class="action-bar-right">
        <span class="detail-link" @click="handleDetailClick">
          查看详情
          <svg class="detail-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 6 15 12 9 18"></polyline>
          </svg>
        </span>
      </div>
    </div>

    <!-- Likers Area (as circled in red in screenshot) -->
    <div v-if="post.likers && post.likers.length" class="post-feedback-box">
      <!-- Likers Line -->
      <div v-if="post.likers && post.likers.length" class="likers-row">
        <span class="likers-list">
          <template v-for="(liker, idx) in post.likers" :key="liker">
            <span class="liker-name" @click="actions.openUserProfile(liker)">{{ liker }}</span>
            <span v-if="idx < post.likers.length - 1" class="liker-sep">、</span>
          </template>
        </span>
        <span class="likers-count-suffix"> 等 {{ post.likersCount || post.likes }}人觉得很赞</span>
      </div>
    </div>

    <!-- Inline Comment Drawer（评论列表默认展示，输入框默认收起） -->
    <div class="comment-drawer">
      <!-- Input Row（默认收起，点击"讨论"按钮展开） -->
      <div v-show="isCommentInputVisible" class="comment-input-row">
        <input 
          ref="commentInputRef"
          type="text" 
          v-model="commentText" 
          :placeholder="isGuestUser ? '开通会员后即可参与主题评论与讨论...' : '发表你的评论'"
          @keyup.enter="submitComment"
        />
        <button 
          class="btn-primary btn-comment-send" 
          :disabled="!commentText.trim()"
          @click="submitComment"
        >
          发送
        </button>
      </div>

      <!-- Comments List（固定高度，超出隐藏） -->
      <div 
        v-if="post.comments.length" 
        ref="commentsListRef"
        :class="['comments-list', { collapsed: !commentsExpanded }]"
      >
        <div v-for="c in post.comments" :key="c.id" class="comment-item">
          <img :src="c.author.avatar" class="comment-avatar" alt="Avatar" @click="actions.openUserProfile(c.author.name)" />
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-name" @click="actions.openUserProfile(c.author.name)">{{ c.author.name }}</span>
              <span class="comment-time">{{ c.createdAt }}</span>
            </div>
            <p class="comment-text">{{ c.content }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-comments">
        暂无讨论，发表你的第一条深度评论吧
      </div>

      <!-- 展开 / 收起（仅超出固定高度时出现） -->
      <div 
        v-if="commentsOverflow || commentsExpanded" 
        class="comments-toggle" 
        @click="commentsExpanded = !commentsExpanded"
      >
        {{ commentsExpanded ? '收起' : '展开' }}
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { Post, UserRole } from '@/types';
import { appState, actions } from '@/stores/community';

const props = withDefaults(defineProps<{
  post: Post;
  showDetailLink?: boolean;
  hideExpand?: boolean;
}>(), {
  showDetailLink: true,
  hideExpand: false,
});

const isExpanded = ref(props.hideExpand);
const commentText = ref('');
const commentInputRef = ref<HTMLInputElement>();
const commentsListRef = ref<HTMLElement>();
const commentsExpanded = ref(false);
const commentsOverflow = ref(false);
const postTextRef = ref<HTMLElement>();
const contentOverflow = ref(false);

// 帖子正文是否超过折叠行数（只在收起态测量一次，超出才显示展开按钮）
const checkContentOverflow = () => {
  if (contentOverflow.value || isExpanded.value) return;
  const el = postTextRef.value;
  contentOverflow.value = !!el && el.scrollHeight > el.clientHeight + 2;
};

// 评论列表是否超出固定高度（超出才显示 展开/收起）
const checkCommentsOverflow = () => {
  const el = commentsListRef.value;
  commentsOverflow.value = !!el && el.scrollHeight > el.clientHeight + 1;
};

watch([() => props.post.comments.length, commentsExpanded], () => nextTick(checkCommentsOverflow));

const focusCommentInput = () => {
  isCommentInputVisible.value = !isCommentInputVisible.value;
  if (isCommentInputVisible.value) {
    nextTick(() => commentInputRef.value?.focus());
  }
};

const formattedParagraphs = computed(() => {
  return props.post.content.split('\n').filter(p => p.trim());
});

const formatMarkdown = (text: string) => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const isLockedForUser = computed(() => {
  if (!props.post.isVipOnly) return false;
  if (appState.user.role === 'founder' || appState.user.role === 'partner' || appState.user.role === 'vip') {
    return false;
  }
  return true;
});

const isGuestUser = computed(() => appState.user.role === 'guest');

// 评论输入框默认收起，点击"讨论"按钮展开/收起
const isCommentInputVisible = ref(false);

// 查看详情：非会员视角引导开通会员，其余正常打开帖子详情
const handleDetailClick = () => {
  if (isGuestUser.value) {
    appState.isVipJoinModalOpen = true;
    return;
  }
  actions.openPostDetail(props.post.id);
};

// ---- 更多操作下拉菜单 ----
const menuOpen = ref(false);

// 是否当前帖子的创建人本人
const isCreator = computed(() => appState.user.id === props.post.author.id);
// 编辑 / 删除：星主 或 创建人本人 可见
const canEditDelete = computed(() => appState.user.role === 'founder' || isCreator.value);

// 点击页面其他区域时关闭菜单
const onDocClick = () => { menuOpen.value = false; };
onMounted(() => {
  document.addEventListener('click', onDocClick);
  nextTick(() => {
    checkCommentsOverflow();
    checkContentOverflow();
  });
});
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

const handleCopyLink = async () => {
  menuOpen.value = false;
  try {
    await navigator.clipboard.writeText(`${location.origin}/post/${props.post.id}`);
  } catch { /* 剪贴板不可用时忽略 */ }
  actions.showToast('已复制动态链接');
};
const handleEdit = () => {
  menuOpen.value = false;
  actions.showToast('编辑功能开发中，敬请期待');
};
const handleDelete = () => {
  menuOpen.value = false;
  actions.deletePost(props.post.id);
};

const submitComment = () => {
  if (!commentText.value.trim()) return;
  if (isGuestUser.value) {
    actions.requireVip('开通会员后即可参与主题评论与讨论');
    return;
  }
  actions.addComment(props.post.id, commentText.value.trim());
  commentText.value = '';
};
</script>

<style scoped>
.post-card {
  background: #ffffff;
  border: 1px solid #eaedf1;
  border-radius: var(--radius-card);
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: none;
}

.post-author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.author-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.author-left:hover .author-name {
  color: var(--brand-green);
}

/* 更多操作下拉菜单 */
.author-right-menu {
  position: relative;
  z-index: 5;
}

.more-btn {
  background: none;
  border: none;
  color: #94a3b8;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background-color 0.15s;
}

.more-btn:hover {
  color: #334155;
  background-color: #f1f5f9;
}

.post-menu {
  position: absolute;
  top: 28px;
  right: 0;
  min-width: 136px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.1);
  padding: 4px;
  z-index: 30;
}

.menu-item {
  padding: 8px 12px;
  font-size: 13px;
  color: #334155;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: background-color 0.12s, color 0.12s;
}

.menu-item:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.menu-item-danger {
  color: #dc2626;
}

.menu-item-danger:hover {
  background: #fef2f2;
  color: #b91c1c;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.15s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.author-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.author-meta {
  display: flex;
  flex-direction: column;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

/* Amber color for Mark matching screenshot */
.author-name-mark {
  color: #d97706;
}

.badge-founder {
  background: #fef3c7;
  color: #b45309;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.badge-vip {
  background: #ecfdf5;
  color: #059669;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.post-time {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.more-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}

.more-btn:hover {
  color: #475569;
}

/* Post Title & Tags matching screenshot: #市场资讯 #机构观点 Title */
.post-title-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.title-tag {
  color: #0284c7;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s;
}

.title-tag:hover {
  color: #0369a1;
  text-decoration: underline;
}

.post-title-text {
  display: inline;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.post-content-container {
  position: relative;
}

.post-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.68;
}

/* 收起状态：正文按宽度自适应折叠到固定行数，展开后显示全部 */
.post-text.text-collapsed {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  overflow: hidden;
}

.content-p {
  margin-bottom: 8px;
}

:deep(strong) {
  font-weight: 700;
  color: #0f172a;
}

/* Expand / Collapse link matching screenshot */
.expand-action-row {
  margin: 4px 0 10px 0;
}

.expand-btn {
  color: rgb(2, 132, 199);
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.expand-btn:hover {
  text-decoration: underline;
}

/* Post Attached Images / Chart */
.post-images-container {
  margin: 10px 0 14px 0;
}

.chart-img-wrap {
  display: inline-block;
  max-width: 520px;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  background: #ffffff;
}

.feed-chart-img {
  width: 100%;
  display: block;
  object-fit: cover;
}

/* Bottom Topic Tags Pill Row */
.post-tags-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 6px 0;
}

.tag-pill-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.tag-pill-badge:hover {
  background: #d1fae5;
  border-color: #6ee7b7;
}

/* Bottom Action Bar */
.post-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  margin-top: 10px;
}

.action-bar-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.action-bar-right {
  display: flex;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover {
  color: #475569;
}

.action-btn.active {
  color: #d97706;
}

.action-btn.active-gold {
  color: #f59e0b;
}

.detail-link {
  font-size: 13px;
  color: #94a3b8;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.detail-arrow {
  display: inline-block;
  vertical-align: middle;
}

.detail-link:hover {
  color: #475569;
  text-decoration: underline;
}

/* Likers & Featured Comment Feedback Box (Screenshot red area) */
.post-feedback-box {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.likers-row {
  font-size: 13.5px;
  line-height: 1.6;
  color: #475569;
  word-break: break-all;
}

.liker-name {
  color: #0284c7;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.15s;
}

.liker-name:hover {
  color: #0369a1;
  text-decoration: underline;
}

.liker-sep {
  color: #64748b;
}

.likers-count-suffix {
  color: #64748b;
  margin-left: 2px;
}

/* VIP Overlay */
.vip-locked-blur {
  filter: blur(5px);
  user-select: none;
  pointer-events: none;
  max-height: 80px;
  overflow: hidden;
}

.vip-lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
}

.lock-icon-wrap {
  font-size: 26px;
  margin-bottom: 4px;
}

.lock-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.lock-tip {
  font-size: 12px;
  color: #64748b;
  margin: 4px 0 12px 0;
}

.btn-vip {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  padding: 7px 18px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}

/* Comments Drawer */
.comment-drawer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;
}

.comment-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.comment-input-row input {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 13px;
  outline: none;
}

.comment-input-row input:focus {
  border-color: #10b981;
  /* 只保留 1px 边框线，去掉全局的绿色光晕扩散效果 */
  box-shadow: none;
}

.btn-comment-send {
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-comment-send:hover {
  background: #059669;
}

.btn-comment-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 评论列表固定高度：收起时最多约两条，超出隐藏 */
.comments-list {
  display: flex;
  flex-direction: column;
}

.comments-list.collapsed {
  max-height: 172px;
  overflow: hidden;
}

.comments-toggle {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgb(2, 132, 199);
  cursor: pointer;
  user-select: none;
}

.comments-toggle:hover {
  text-decoration: underline;
}

.comment-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 2px;
}

.comment-name {
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}

.comment-name:hover {
  color: var(--brand-green);
}

.comment-time {
  color: #94a3b8;
}

.comment-text {
  font-size: 13px;
  color: #334155;
  margin: 0;
}

.empty-comments {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  padding: 12px 0;
}
</style>
