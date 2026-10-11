<template>
  <div class="column-page-root" :class="{ 'is-zen-mode': isZenMode }">
    <!-- Left: Column Tree Navigation (1:1 with Screenshot 1, collapsible) -->
    <aside
      class="column-tree-sidebar"
      :class="{
        'tree-collapsed': isZenMode || appState.previewEmbed,
        'zen-hidden': isZenMode
      }"
    >
      <!-- Header Info Block -->
      <div class="tree-header-card">
        <!-- Title + Sort Row + Collapse Button -->
        <div class="sort-action-row">
          <div class="title-with-collapse">
            <h2 class="column-page-title">专栏</h2>
          </div>

          <div class="header-filter-group">
            <input
              v-model="articleSearchKeyword"
              class="tree-search-input"
              type="text"
              placeholder="搜索文章名称"
            />
          </div>
        </div>
      </div>

      <div class="tree-divider"></div>

      <!-- Accordion Column List -->
      <div class="column-tree-scroll">
        <div 
          v-for="col in searchedColumns" 
          :key="col.id" 
          class="column-tree-node"
        >
          <!-- Column Folder Title Header -->
          <div 
            class="column-folder-header"
            :class="{ expanded: expandedColumnIds.includes(col.id) }"
            @click="toggleColumn(col.id)"
          >
            <!-- Triangle indicator (down when expanded, right when collapsed) -->
            <svg 
              class="arrow-triangle-icon" 
              :class="{ 'rotate-down': expandedColumnIds.includes(col.id) }"
              viewBox="0 0 12 12"
            >
              <path d="M4 2.5L8.5 6L4 9.5V2.5Z" fill="currentColor"/>
            </svg>
            <span class="column-name-text">{{ col.title }}</span>
            <span class="column-count-num">({{ col.chapters.length }})</span>
          </div>

          <!-- Nested Articles List（搜索时自动展开） -->
          <div 
            v-if="isSearching || expandedColumnIds.includes(col.id)" 
            class="article-leaves-container"
          >
            <div 
              v-for="art in col.chapters" 
              :key="art.id"
              class="article-leaf-item"
              :class="{ active: appState.selectedArticleId === art.id }"
              @click="handleSelectArticle(col.id, art.id)"
            >
              <!-- Selected state has a green dot -->
              <span v-if="appState.selectedArticleId === art.id" class="green-active-dot"></span>
              <!-- Unread articles show a blue dot -->
              <span v-else-if="!isArticleRead(art.id)" class="unread-dot"></span>
              <span v-else class="indent-placeholder"></span>
              
              <span class="leaf-article-title" :class="{ 'is-read': isArticleRead(art.id) }" :title="art.title">
                {{ art.title }}
              </span>
            </div>

            <!-- Empty chapter hint -->
            <div v-if="col.chapters.length === 0" class="leaf-empty-hint">
              暂无收录长文
            </div>
          </div>
        </div>

        <!-- No search results -->
        <div v-if="isSearching && searchedColumns.length === 0" class="leaf-empty-hint">
          未找到相关文章
        </div>
      </div>
    </aside>

    <!-- Right: Article Detail & Interactive Reading Viewport -->
    <main class="article-reader-viewport" ref="readerViewportRef">
      <!-- Center Article Container Inner (Spacious, airy typography) -->
      <div v-if="currentArticle" class="article-container-inner" ref="articleContainerRef">
        <!-- 1. Top Header: Author + Meta + Reading stats + Perspective toggle + Zen button + More menu -->
        <header class="article-meta-header">
          <div class="author-profile-block">
            <img
              v-if="currentArticle.author"
              :src="currentArticle.authorAvatar || avatarRich"
              class="author-avatar-img"
              :alt="currentArticle.author"
            />
            <div class="author-name-time">
              <div v-if="currentArticle.author" class="author-row-top">
                <span class="author-display-name">{{ currentArticle.author }}</span>
              </div>
              <div class="author-row-bottom">
                <span class="publish-time-stamp">{{ currentArticle.createdAt || '2026-09-24 17:17' }}</span>
              </div>
            </div>
          </div>

          <div class="header-right-badges">
            <!-- Zen Mode Focus Toggle Button -->
            <button 
              class="btn-header-action btn-zen-toggle" 
              :class="{ active: isZenMode }"
              @click="toggleZenMode" 
              :title="isZenMode ? '退出沉浸专注阅读 (Esc)' : '开启沉浸专注阅读模式'"
            >
              <svg v-if="!isZenMode" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M10 4v6m0 0H4m6 0L3 3m10 7h6m-6 0V4m0 6l7-7"></path>
              </svg>
            </button>
          </div>
        </header>

        <!-- 2. Main Article Title -->
        <h1 class="article-headline-title">{{ currentArticle.title }}</h1>

        <!-- 3. Body Content with Markdown Render -->
        <article class="article-formatted-body">
          <div class="markdown-body" v-html="articleRenderInfo.html"></div>
        </article>

        <!-- 4. Clean Editorial Paywall Card (Restrained, high-end, non-AI) -->
        <div v-if="articleRenderInfo.isTruncated" class="paywall-cutoff-container">
          <div class="paywall-fade-mask"></div>

          <div class="paywall-editorial-card">
            <div class="paywall-lock-symbol">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <h3 class="paywall-card-title">本文余下内容为会员专享</h3>
            <p class="paywall-card-desc">
              开通「年度星球会员」，畅读本专栏全部连载与深度投研长文
            </p>

            <div class="paywall-action-group">
              <button class="btn-join-vip-cta" @click="handleOpenVipModal">
                <span>开通会员解锁全文</span>
                <span class="btn-cta-divider">·</span>
                <span class="btn-price-text">¥1,299 / 年</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 8. Previous & Next Article Navigation Cards (hidden in admin embed mode) -->
        <div class="chapter-nav-grid" v-if="!appState.previewEmbed">
          <div 
            v-if="prevArticle" 
            class="chapter-nav-card prev-card" 
            @click="handleSelectArticle(activeColumn.id, prevArticle.id)"
          >
            <div class="nav-direction-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <span>上一篇</span>
            </div>
            <div class="nav-chapter-title" :title="prevArticle.title">{{ prevArticle.title }}</div>
          </div>
          <div v-else class="chapter-nav-card empty-card">
            <div class="nav-direction-label">
              <span class="dot-disabled"></span>
              <span>第一篇</span>
            </div>
            <div class="nav-empty-title">已是专栏起始篇章</div>
          </div>

          <div 
            v-if="nextArticle" 
            class="chapter-nav-card next-card" 
            @click="handleSelectArticle(activeColumn.id, nextArticle.id)"
          >
            <div class="nav-direction-label">
              <span>下一篇</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="nav-chapter-title" :title="nextArticle.title">{{ nextArticle.title }}</div>
          </div>
          <div v-else class="chapter-nav-card empty-card">
            <div class="nav-direction-label">
              <span>最新篇</span>
              <span class="dot-disabled"></span>
            </div>
            <div class="nav-empty-title">专栏已读至最新章节</div>
          </div>
        </div>

        <!-- 9. Action Bar（与资讯模块一致：赞 / 讨论 / 分享） -->
        <div class="post-action-bar">
          <div class="action-bar-left">
            <button
              :class="['action-btn', { active: currentArticle.isLiked }]"
              title="赞"
              @click="handleLike"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" :fill="currentArticle.isLiked ? '#d97706' : 'none'" :stroke="currentArticle.isLiked ? '#d97706' : 'currentColor'" stroke-width="1.8">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
            </button>

            <button class="action-btn" title="讨论" @click="toggleCommentInput">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </button>

            <button class="action-btn" title="分享" @click="handleShare">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- 10. Likers Text Row（与资讯模块一致） -->
        <div v-if="activeLikers.length" class="post-feedback-box">
          <div class="likers-row">
            <span class="likers-list">
              <template v-for="(liker, idx) in activeLikers" :key="liker.name">
                <span class="liker-name">{{ liker.name }}</span>
                <span v-if="idx < activeLikers.length - 1" class="liker-sep">、</span>
              </template>
            </span>
            <span class="likers-count-suffix"> 等 {{ currentArticle.likes || activeLikers.length }}人觉得很赞</span>
          </div>
        </div>

        <!-- 11. Comment Drawer（与资讯模块一致：输入框默认收起，评论列表默认展示） -->
        <div class="comment-drawer" ref="commentsSectionRef">
          <!-- Input Row（默认收起，点击"讨论"展开） -->
          <div v-show="isCommentInputVisible" class="comment-input-row">
            <input
              ref="commentInputRef"
              v-model="newCommentText"
              type="text"
              placeholder="发表你的评论"
              @keyup.enter="submitComment"
            />
            <button
              class="btn-comment-send"
              :disabled="!newCommentText.trim()"
              @click="submitComment"
            >
              发送
            </button>
          </div>

          <!-- Comments List（固定高度，超出隐藏） -->
          <div
            v-if="activeComments.length"
            ref="commentsListRef"
            :class="['comments-list', { collapsed: !commentsExpanded }]"
          >
            <div v-for="cmt in activeComments" :key="cmt.id" class="comment-item">
              <img
                :src="cmt.author.avatar || avatarRich"
                class="comment-avatar"
                :alt="cmt.author.name"
              />
              <div class="comment-body">
                <div class="comment-header">
                  <span class="comment-name">{{ cmt.author.name }}</span>
                  <span class="comment-time">{{ cmt.createdAt }}</span>
                </div>
                <p class="comment-text">{{ cmt.content }}</p>
              </div>
              <button
                v-if="appState.previewAdmin || cmt.author.name === appState.user.name"
                class="btn-comment-delete-icon"
                title="删除评论"
                @click="handleDeleteCommentClick(cmt)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
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
      </div>

      <!-- Empty state if no article is selected -->
      <div v-else class="article-empty-viewport">
        <div class="empty-icon">📖</div>
        <div class="empty-title">请在左侧选择要阅读的专栏长文</div>
      </div>
    </main>

    <!-- Content Center Column & Article Management Modal -->
    <ColumnManagerModal />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { appState, actions, activeArticle, activeColumn, isManager } from '@/stores/community';
import { renderMarkdown, getPreviewMarkdown } from '@/utils/markdown';
import ColumnManagerModal from '@/components/admin/ColumnManagerModal.vue';
import avatarRich from '@/assets/avatar_rich.png';
import avatarMark from '@/assets/avatar_mark.png';
import avatarJohn from '@/assets/avatar_john.png';
import avatarJerry from '@/assets/avatar_jerry.png';

// Viewport & Reader Refs
const readerViewportRef = ref<HTMLElement | null>(null);
const articleContainerRef = ref<HTMLElement | null>(null);

// 3. Zen Mode (沉浸模式)
const isZenMode = ref(false);
const toggleZenMode = () => {
  isZenMode.value = !isZenMode.value;
  if (isZenMode.value) {
    actions.showToast('已进入沉浸专注阅读模式（按 Esc 或点击顶部按钮可退出）');
  } else {
    actions.showToast('已退出沉浸模式');
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isZenMode.value) {
    isZenMode.value = false;
  }
};

// 4. 判断文章是否解锁（依据左下角切换的会员与星友身份）
const isArticleUnlocked = computed(() => {
  if (appState.currentPerspective === 'guest') {
    return false;
  }
  return appState.isVipMember || isManager.value || appState.user.role === 'founder' || appState.user.role === 'vip' || appState.user.role === 'partner';
});

const handleOpenVipModal = () => {
  appState.isVipJoinModalOpen = true;
};

// 已读标记：点开且当前视角可解锁全文时记为已读，仅存本机（localStorage）
const READ_STORAGE_KEY = 'wealth_column_read_articles';
const readArticleIds = ref<string[]>([]);

const loadReadIds = () => {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    readArticleIds.value = raw ? JSON.parse(raw) : [];
  } catch {
    readArticleIds.value = [];
  }
};

const isArticleRead = (id: string) => readArticleIds.value.includes(id);

const markArticleRead = (id: string) => {
  if (!id || readArticleIds.value.includes(id)) return;
  readArticleIds.value = [...readArticleIds.value, id];
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(readArticleIds.value));
  } catch {
    /* 存储不可用时静默降级 */
  }
};

watch(
  () => [appState.selectedArticleId, isArticleUnlocked.value] as const,
  () => {
    // 后台预览嵌入不写入本地已读，避免污染浏览记录
    if (appState.previewEmbed) return;
    // 非会员/星友仅看到付费截断内容，不计已读
    if (!isArticleUnlocked.value) return;
    if (appState.selectedArticleId) {
      markArticleRead(appState.selectedArticleId);
    }
  },
  { immediate: true }
);

// 5. Expanded columns state
const expandedColumnIds = ref<string[]>(['col-us-stock']);

const toggleColumn = (colId: string) => {
  const idx = expandedColumnIds.value.indexOf(colId);
  if (idx !== -1) {
    expandedColumnIds.value.splice(idx, 1);
  } else {
    expandedColumnIds.value.push(colId);
  }
};

// Search in the left tree
const articleSearchKeyword = ref('');
const isSearching = computed(() => articleSearchKeyword.value.trim().length > 0);

const searchedColumns = computed(() => {
  // 专栏顺序：按后台配置的排序号降序，序号越大越靠前（未设置按 0，保持原有稳定顺序）
  const list = [...appState.columns].sort((a, b) => (b.sortNo ?? 0) - (a.sortNo ?? 0));
  const kw = articleSearchKeyword.value.trim().toLowerCase();
  if (!kw) {
    // 目录内文章顺序：按排序号降序（未设置按 0）
    return list.map(col => ({
      ...col,
      chapters: [...col.chapters].sort((a, b) => (b.sortNo ?? 0) - (a.sortNo ?? 0))
    }));
  }

  return list
    .map(col => ({
      ...col,
      chapters: col.chapters
        .filter(art => art.title.toLowerCase().includes(kw))
        .sort((a, b) => (b.sortNo ?? 0) - (a.sortNo ?? 0))
    }))
    .filter(col => col.chapters.length > 0);
});

// Current selected article
const currentArticle = computed(() => activeArticle.value);

// Current chapter index in column
const currentChapterIndex = computed(() => {
  if (!activeColumn.value || !currentArticle.value) return 1;
  const idx = activeColumn.value.chapters.findIndex(c => c.id === currentArticle.value?.id);
  return idx !== -1 ? idx + 1 : 1;
});

// Previous and Next Article in current column
const prevArticle = computed(() => {
  if (!activeColumn.value || !currentArticle.value) return null;
  const chapters = activeColumn.value.chapters;
  const idx = chapters.findIndex(c => c.id === currentArticle.value?.id);
  return idx > 0 ? chapters[idx - 1] : null;
});

const nextArticle = computed(() => {
  if (!activeColumn.value || !currentArticle.value) return null;
  const chapters = activeColumn.value.chapters;
  const idx = chapters.findIndex(c => c.id === currentArticle.value?.id);
  return idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null;
});

// Render markdown to HTML with paywall cutoff if locked
const articleRenderInfo = computed(() => {
  const raw = currentArticle.value?.content || currentArticle.value?.summary || '';
  if (isArticleUnlocked.value) {
    return {
      html: renderMarkdown(raw),
      isTruncated: false
    };
  }
  const res = getPreviewMarkdown(raw);
  return {
    html: renderMarkdown(res.preview),
    isTruncated: res.isCut
  };
});

// Likers list with fallback
const activeLikers = computed(() => {
  if (currentArticle.value?.likers && currentArticle.value.likers.length > 0) {
    return currentArticle.value.likers;
  }
  return [
    { name: 'Rich', avatar: avatarRich },
    { name: 'Mark', avatar: avatarMark },
    { name: 'John', avatar: avatarJohn },
    { name: 'Jerry', avatar: avatarJerry }
  ];
});

// Comments list with fallback
const activeComments = computed(() => {
  if (currentArticle.value?.comments && currentArticle.value.comments.length > 0) {
    return currentArticle.value.comments;
  }
  return [];
});

const handleSelectArticle = (colId: string, artId: string) => {
  actions.selectArticle(colId, artId);
  nextTick(() => {
    if (readerViewportRef.value) {
      readerViewportRef.value.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
};

// Article interactions
const handleLike = () => {
  if (currentArticle.value) {
    actions.toggleLikeArticle(currentArticle.value.id);
  }
};

// 删除评论：后台预览模式可删任意评论；正常浏览仅可删自己发布的
const handleDeleteCommentClick = (cmt: { id: string; author: { name: string } }) => {
  if (!currentArticle.value) return;
  const isOwn = cmt.author.name === appState.user.name;
  const tip = appState.previewAdmin && !isOwn
    ? `确认删除「${cmt.author.name}」的这条评论？删除后不可恢复。`
    : '确认删除这条评论？';
  if (window.confirm(tip)) {
    actions.deleteArticleComment(currentArticle.value.id, cmt.id);
  }
};

const handleCopyLink = () => {
  const linkText = `${window.location.origin}/#column/${appState.selectedColumnId}/${appState.selectedArticleId}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(linkText).then(() => {
      actions.showToast('🔗 长文链接已成功复制到剪贴板！');
    });
  } else {
    actions.showToast('🔗 已生成长文分享链接');
  }
};

const handleShare = () => {
  handleCopyLink();
};

// Comment logic（与资讯模块一致：输入框默认收起，点击"讨论"展开）
const newCommentText = ref('');
const commentInputRef = ref<HTMLInputElement | null>(null);
const commentsSectionRef = ref<HTMLElement | null>(null);
const commentsListRef = ref<HTMLElement | null>(null);
const isCommentInputVisible = ref(false);
const commentsExpanded = ref(false);
const commentsOverflow = ref(false);

const checkCommentsOverflow = () => {
  const el = commentsListRef.value;
  commentsOverflow.value = !!el && el.scrollHeight > el.clientHeight + 1;
};

watch([() => activeComments.value.length, commentsExpanded], () => nextTick(checkCommentsOverflow));

const toggleCommentInput = () => {
  isCommentInputVisible.value = !isCommentInputVisible.value;
  if (isCommentInputVisible.value) {
    commentsSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
    nextTick(() => commentInputRef.value?.focus());
  }
};

const submitComment = () => {
  if (!newCommentText.value.trim() || !currentArticle.value) return;
  actions.addArticleComment(currentArticle.value.id, newCommentText.value);
  newCommentText.value = '';
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  loadReadIds();

  if (!appState.selectedColumnId) {
    appState.selectedColumnId = 'col-us-stock';
  }
  if (!appState.selectedArticleId) {
    appState.selectedArticleId = 'art-mg-1';
  }
  if (!expandedColumnIds.value.includes(appState.selectedColumnId)) {
    expandedColumnIds.value.push(appState.selectedColumnId);
  }

  nextTick(checkCommentsOverflow);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.column-page-root {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;
}

/* ============================================================
   LEFT: COLUMN TREE DIRECTORY (1:1 with Screenshot 1, Collapsible)
   ============================================================ */
.column-tree-sidebar {
  width: 260px;
  min-width: 240px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #f1f5f9;
  flex-shrink: 0;
  user-select: none;
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.28s ease, max-width 0.28s ease, opacity 0.2s ease, transform 0.28s ease;
  position: relative;
  z-index: 10;
}

.column-tree-sidebar.tree-collapsed {
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  border-right: none;
  transform: translateX(-15px);
}

.tree-header-card {
  padding: 16px 14px 12px;
}

.sort-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-with-collapse {
  display: flex;
  align-items: center;
  gap: 8px;
}

.column-page-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

/* Header Filter Group (search) */
.header-filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

/* Tree Search Input */
.tree-search-input {
  width: 118px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s ease, width 0.2s ease;
}

.tree-search-input:focus {
  border-color: #10b981;
  width: 150px;
  box-shadow: none;
}

.tree-search-input::placeholder {
  color: #94a3b8;
}

.tree-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 0 14px;
}

.column-tree-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 10px 8px 24px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.column-tree-scroll::-webkit-scrollbar {
  width: 4px;
}
.column-tree-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

/* Accordion Column Node */
.column-tree-node {
  margin-bottom: 2px;
}

.column-folder-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: #334155;
  font-size: 13.5px;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
}

.column-folder-header:hover {
  background: #f8fafc;
  color: #0f172a;
}

.arrow-triangle-icon {
  width: 14px;
  height: 14px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: transform 0.2s ease, color 0.2s ease;
}

.arrow-triangle-icon.rotate-down {
  transform: rotate(90deg);
  color: #64748b;
}

.column-name-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-count-num {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

/* Nested Articles List */
.article-leaves-container {
  display: flex;
  flex-direction: column;
  padding: 2px 0 6px 12px;
}

.article-leaf-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #334155;
  line-height: 1.4;
  transition: all 0.15s ease;
}

.article-leaf-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.article-leaf-item.active {
  color: #059669;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.06);
}

.green-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
  margin-right: 8px;
}

/* 未读文章：蓝色小圆点（与站内链接色一致） */
.unread-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(2, 132, 199);
  flex-shrink: 0;
  margin-right: 8px;
}

.indent-placeholder {
  width: 14px;
  flex-shrink: 0;
}

.leaf-article-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 已读文章标题弱化为浅灰，悬浮与选中时恢复正常 */
.leaf-article-title.is-read {
  color: #94a3b8;
}

.article-leaf-item:hover .leaf-article-title.is-read {
  color: #0f172a;
}

.article-leaf-item.active .leaf-article-title.is-read {
  color: #059669;
}

.leaf-empty-hint {
  padding: 6px 14px;
  font-size: 12px;
  color: #cbd5e1;
}

/* ============================================================
   RIGHT: ARTICLE DETAIL & READING VIEWPORT (Spacious 820px)
   ============================================================ */
.article-reader-viewport {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
  position: relative;
  scroll-behavior: smooth;
}

/* Spacious Article Container Inner */
.article-container-inner {
  width: 100%;
  max-width: 840px;
  margin: 0 auto;
  padding: 28px 40px 60px;
  min-width: 0;
}

/* Meta Header */
.article-meta-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
  gap: 12px;
  flex-wrap: wrap;
}

.author-profile-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #f1f5f9;
}

.author-name-time {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.author-row-top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-display-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
}

.author-row-bottom {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  flex-wrap: wrap;
}

.header-right-badges {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Zen Toggle Action Button */
.btn-header-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-header-action:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
}

.btn-header-action.active {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

/* Article Headline Title */
.article-headline-title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.45;
  margin: 0 0 22px 0;
  letter-spacing: -0.2px;
}

/* Article Body Content with Markdown Typography */
.article-formatted-body {
  margin-bottom: 26px;
}

.article-formatted-body :deep(.markdown-body) {
  font-size: 15.5px;
  line-height: 1.9;
  color: #334155;
  letter-spacing: 0.2px;
}

.article-formatted-body :deep(.markdown-body p) {
  margin: 0 0 18px 0;
  line-height: 1.9;
}

.article-formatted-body :deep(.markdown-body h1),
.article-formatted-body :deep(.markdown-body h2),
.article-formatted-body :deep(.markdown-body h3),
.article-formatted-body :deep(.markdown-body h4) {
  color: #0f172a;
  font-weight: 800;
  line-height: 1.45;
  scroll-margin-top: 40px;
}

.article-formatted-body :deep(.markdown-body h1) {
  font-size: 21px;
  margin: 32px 0 16px 0;
}

.article-formatted-body :deep(.markdown-body h2) {
  font-size: 19px;
  margin: 30px 0 14px 0;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}

.article-formatted-body :deep(.markdown-body h3) {
  font-size: 17px;
  margin: 26px 0 12px 0;
  padding-left: 10px;
  border-left: 3.5px solid #10b981;
}

.article-formatted-body :deep(.markdown-body h4) {
  font-size: 15.5px;
  margin: 22px 0 10px 0;
}

.article-formatted-body :deep(.markdown-body strong) {
  font-weight: 700;
  color: #0f172a;
}

.article-formatted-body :deep(.markdown-body em) {
  font-style: italic;
  color: #475569;
}

.article-formatted-body :deep(.markdown-body ol),
.article-formatted-body :deep(.markdown-body ul) {
  margin: 10px 0 18px 0;
  padding-left: 24px;
}

.article-formatted-body :deep(.markdown-body ol) {
  list-style-type: decimal;
}

.article-formatted-body :deep(.markdown-body ul) {
  list-style-type: disc;
}

.article-formatted-body :deep(.markdown-body li) {
  margin-bottom: 8px;
  line-height: 1.85;
  color: #334155;
}

.article-formatted-body :deep(.markdown-body li > ul),
.article-formatted-body :deep(.markdown-body li > ol) {
  margin: 6px 0 6px 0;
  padding-left: 18px;
}

.article-formatted-body :deep(.markdown-body blockquote) {
  margin: 20px 0;
  padding: 12px 20px;
  background: #f8fafc;
  border-left: 4px solid #10b981;
  border-radius: 0 6px 6px 0;
  color: #475569;
  font-size: 14.5px;
}

.article-formatted-body :deep(.markdown-body blockquote p:last-child) {
  margin-bottom: 0;
}

.article-formatted-body :deep(.markdown-body code) {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

.article-formatted-body :deep(.markdown-body pre) {
  background: #0f172a;
  color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 20px 0;
  font-size: 13px;
}

.article-formatted-body :deep(.markdown-body hr) {
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 24px 0;
}

.article-formatted-body :deep(.markdown-body table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 13.5px;
}

.article-formatted-body :deep(.markdown-body th) {
  background: #f8fafc;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  font-weight: 700;
  color: #0f172a;
  text-align: left;
}

.article-formatted-body :deep(.markdown-body td) {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  color: #334155;
}

/* ============================================================
   EDITORIAL PAYWALL CARD (Restrained, high-end, non-AI)
   ============================================================ */
.paywall-cutoff-container {
  position: relative;
  margin-top: -65px;
  margin-bottom: 24px;
}

.paywall-fade-mask {
  height: 50px;
  width: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.88) 55%, #ffffff 100%);
  pointer-events: none;
}

.paywall-editorial-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px 20px;
  box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}

.paywall-lock-symbol {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
}

.paywall-card-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -0.2px;
}

.paywall-card-desc {
  font-size: 13.5px;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.paywall-action-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-join-vip-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 11px 26px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
  transition: all 0.15s ease;
}

.btn-join-vip-cta:hover {
  background: #059669;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  transform: translateY(-1px);
}

.btn-cta-divider {
  opacity: 0.5;
  font-size: 12px;
}

.btn-price-text {
  font-size: 13px;
  font-weight: 500;
  opacity: 0.95;
}

/* ============================================================
   PREVIOUS & NEXT ARTICLE NAVIGATION CARDS
   ============================================================ */
.chapter-nav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 28px 0 24px 0;
}

.chapter-nav-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.2s ease;
  user-select: none;
}

.chapter-nav-card:hover:not(.empty-card) {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
  transform: translateY(-1px);
}

.chapter-nav-card.empty-card {
  background: #f8fafc;
  border-color: #f1f5f9;
  cursor: default;
  opacity: 0.7;
}

.nav-direction-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.next-card .nav-direction-label {
  justify-content: flex-end;
}

.next-card .nav-chapter-title {
  text-align: right;
}

.next-card .nav-empty-title {
  text-align: right;
}

.nav-chapter-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.nav-empty-title {
  font-size: 13px;
  color: #94a3b8;
}

.dot-disabled {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #cbd5e1;
}

/* Action Bar（与资讯模块 PostCard 一致） */
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

/* Likers Text Row（与资讯模块 PostCard 一致） */
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

/* Comment Drawer（与资讯模块 PostCard 一致） */
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

/* 评论删除图标：悬浮评论时显示 */
.btn-comment-delete-icon {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #94a3b8;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s ease;
}

.comment-item:hover .btn-comment-delete-icon {
  opacity: 1;
}

.btn-comment-delete-icon:hover {
  color: #dc2626;
  background: #fef2f2;
}

.empty-comments {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  padding: 12px 0;
}

/* Empty State */
.article-empty-viewport {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 12px;
}

.empty-icon {
  font-size: 40px;
}

.empty-title {
  font-size: 14px;
  font-weight: 600;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
