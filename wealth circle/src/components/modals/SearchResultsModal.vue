<template>
  <div v-if="appState.isSearchModalOpen" class="search-modal-backdrop" @click.self="closeModal">
    <div class="search-modal-card animate-fade-in" role="dialog" aria-modal="true">
      <!-- Header: 搜索框 + 关闭 -->
      <div class="search-modal-header">
        <div class="search-field">
          <svg class="search-field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref="searchFieldInputRef"
            v-model="keywordInput"
            class="search-field-input"
            type="text"
            placeholder="搜索资讯、话题、专栏、直播、课程..."
            @keyup.enter="doSearch"
          />
          <svg
            v-if="keywordInput"
            class="search-field-clear"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            title="清空搜索"
            @click="clearInput"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <button class="modal-close-btn" @click="closeModal" title="关闭弹窗 (Esc)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Body: 搜索结果 -->
      <div class="search-modal-body">
        <div v-if="!appState.searchKeyword" class="search-idle">输入关键词后回车，进行全站搜索</div>

        <template v-else>
          <div class="search-summary">共 {{ totalResultCount }} 条与「{{ appState.searchKeyword }}」相关的内容</div>

          <!-- 主题：资讯卡片完整展示 -->
          <div v-if="matchedPosts.length" class="result-section">
            <div class="section-title">
              资讯
              <span class="section-count">{{ matchedPosts.length }}</span>
            </div>
            <div class="posts-stream">
              <PostCard v-for="p in matchedPosts" :key="p.id" :post="p" />
            </div>
          </div>

          <!-- 话题 / 专栏 / 直播 / 课程：紧凑列表 -->
          <div v-for="group in compactGroups" :key="group.label" class="result-section">
            <div class="section-title">
              {{ group.label }}
              <span class="section-count">{{ group.items.length }}</span>
            </div>
            <div class="compact-list">
              <div v-for="(item, i) in group.items" :key="group.label + '-' + i" class="compact-item" @click="item.onClick">
                <span class="compact-main">{{ item.main }}</span>
                <span class="compact-sub">{{ item.sub }}</span>
                <svg class="compact-arrow" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div v-if="totalResultCount === 0" class="search-empty">未找到相关内容，换个关键词试试</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { appState, actions } from '@/stores/community';
import PostCard from '../community/PostCard.vue';

// 弹窗打开时自动聚焦搜索框（点击侧边栏搜索框即开弹窗，直接输入即可）
const searchFieldInputRef = ref<HTMLInputElement | null>(null);

watch(
  () => appState.isSearchModalOpen,
  open => {
    if (open) {
      nextTick(() => searchFieldInputRef.value?.focus());
    }
  },
);

// 弹窗内搜索框与侧边栏输入框共用同一份文本
const keywordInput = computed({
  get: () => appState.searchInput,
  set: (val: string) => {
    appState.searchInput = val;
  },
});

const doSearch = () => {
  appState.searchKeyword = keywordInput.value.trim();
};

const clearInput = () => {
  appState.searchInput = '';
  appState.searchKeyword = '';
};

const closeModal = () => actions.closeSearchModal();

const liveStatusTextMap: Record<string, string> = { live: '直播中', upcoming: '预告中', replay: '回放' };

interface CompactItem {
  main: string;
  sub: string;
  onClick: () => void;
}
interface CompactGroup {
  label: string;
  items: CompactItem[];
}

// 主题命中：匹配标题、正文、话题标签
const matchedPosts = computed(() => {
  const kw = appState.searchKeyword.trim().toLowerCase();
  if (!kw) return [];
  return appState.posts.filter(
    p =>
      (p.title || '').toLowerCase().includes(kw) ||
      p.content.toLowerCase().includes(kw) ||
      (p.tags || []).some(t => t.toLowerCase().includes(kw)),
  );
});

// 话题 / 专栏 / 直播 / 课程命中：紧凑分组列表
const compactGroups = computed<CompactGroup[]>(() => {
  const kw = appState.searchKeyword.trim().toLowerCase();
  if (!kw) return [];
  const groups: CompactGroup[] = [];

  // 话题
  const tagCount = new Map<string, number>();
  for (const p of appState.posts) {
    for (const t of p.tags || []) tagCount.set(t, (tagCount.get(t) || 0) + 1);
  }
  const tags = [...tagCount.entries()].filter(([t]) => t.toLowerCase().includes(kw));
  if (tags.length) {
    groups.push({
      label: '话题',
      items: tags.map(([tag, count]) => ({
        main: `#${tag}`,
        sub: `${count} 条相关资讯`,
        onClick: () => {
          closeModal();
          actions.openTagView(tag);
        },
      })),
    });
  }

  // 专栏
  const cols = appState.columns.filter(c => `${c.title}${c.subtitle || ''}`.toLowerCase().includes(kw));
  if (cols.length) {
    groups.push({
      label: '专栏',
      items: cols.map(c => ({
        main: c.title,
        sub: c.authorTitle ? `${c.author} · ${c.authorTitle}` : c.author,
        onClick: () => {
          appState.selectedColumnId = c.id;
          appState.selectedArticleId = c.chapters[0]?.id || appState.selectedArticleId;
          closeModal();
          actions.setCurrentView('column');
        },
      })),
    });
  }

  // 直播
  const lives = appState.liveSessions.filter(l => l.title.toLowerCase().includes(kw));
  if (lives.length) {
    groups.push({
      label: '直播',
      items: lives.map(l => ({
        main: l.title,
        sub: `${liveStatusTextMap[l.status] || l.status} · ${l.host}`,
        onClick: () => {
          closeModal();
          actions.setCurrentView('live');
        },
      })),
    });
  }

  // 课程
  const courses = appState.courses.filter(c => `${c.title}${c.description || ''}`.toLowerCase().includes(kw));
  if (courses.length) {
    groups.push({
      label: '课程',
      items: courses.map(c => ({
        main: c.title,
        sub: `${c.instructor} · ${c.totalDuration}`,
        onClick: () => {
          closeModal();
          actions.setCurrentView('course');
        },
      })),
    });
  }

  return groups;
});

const totalResultCount = computed(
  () => matchedPosts.value.length + compactGroups.value.reduce((sum, g) => sum + g.items.length, 0),
);

// Esc 关闭：帖子详情弹窗打开时不响应，避免把两层弹窗一起关掉
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && appState.isSearchModalOpen && !appState.isPostDetailModalOpen) {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<style scoped>
.search-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1040;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.search-modal-card {
  width: 100%;
  max-width: 760px;
  background: #ffffff;
  border-radius: var(--radius-card);
  border: 1px solid var(--border-light);
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
}

/* Header */
.search-modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.search-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.search-field:focus-within {
  background: #ffffff;
  border-color: var(--brand-green);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}

.search-field-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.search-field-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13.5px;
  color: var(--text-primary);
  padding: 0;
  box-shadow: none;
}

.search-field-clear {
  color: #94a3b8;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.search-field-clear:hover {
  color: #475569;
}

/* 关闭按钮：无背景纯线条图标 */
.modal-close-btn {
  background: transparent;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.modal-close-btn:hover {
  color: #0f172a;
}

/* Body */
.search-modal-body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  padding: 16px 18px 24px;
}

.search-idle {
  padding: 56px 0;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.search-summary {
  font-size: 12.5px;
  color: #94a3b8;
  margin-bottom: 14px;
}

.result-section {
  margin-bottom: 18px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 8px;
}

.section-count {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  background: #f1f5f9;
  border-radius: 99px;
  padding: 0 7px;
  line-height: 16px;
}

.posts-stream {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 紧凑列表（话题/专栏/直播/课程） */
.compact-list {
  display: flex;
  flex-direction: column;
  border: 1px solid #eaedf1;
  border-radius: 8px;
  overflow: hidden;
}

.compact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.compact-item + .compact-item {
  border-top: 1px solid #f1f5f9;
}

.compact-item:hover {
  background: var(--bg-subtle);
}

.compact-main {
  flex-shrink: 0;
  max-width: 55%;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
}

.compact-item:hover .compact-main {
  color: var(--brand-green-hover);
}

.compact-sub {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.compact-arrow {
  width: 14px;
  height: 14px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.compact-item:hover .compact-arrow {
  color: var(--brand-green-hover);
  transform: translateX(2px);
}

.search-empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}
</style>
