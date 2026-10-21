<template>
  <view class="column-page">
    <!-- 1. 顶部安全区固定导航条 (一级页面，无返回键) -->
    <view class="nav-top-bar">
      <view class="nav-left">
        <text class="nav-title">专栏</text>
      </view>

      <view class="nav-right" @tap="handleShareGroup">
        <view class="nav-share-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </view>
      </view>
    </view>

    <!-- 2. 差异化顶部案卷身份卡 (The Differentiated Vault Dossier Header) -->
    <view class="vault-hero-section">
      <view class="vault-dossier-card">
        <!-- 头部主信息行 -->
        <view class="vault-main-row">
          <!-- 立体多层案卷徽标 (纯矢量 3D Layer Stack SVG) -->
          <view class="vault-emblem-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <!-- 底层 -->
              <path d="M12 21L2 15.5L12 10L22 15.5L12 21Z" fill="#1e293b" stroke="#334155" stroke-width="1.2" stroke-linejoin="round"/>
              <!-- 中层 -->
              <path d="M12 17L2 11.5L12 6L22 11.5L12 17Z" fill="#0f766e" stroke="#10b981" stroke-width="1.2" stroke-linejoin="round"/>
              <!-- 顶层 -->
              <path d="M12 13L2 7.5L12 2L22 7.5L12 13Z" fill="#10b981" stroke="#34d399" stroke-width="1.2" stroke-linejoin="round"/>
            </svg>
          </view>

          <!-- 专栏合集标题与数据规模 -->
          <view class="vault-info-col">
            <view class="vault-title-line">
              <text class="vault-title-text">认知提升：投资理财必备</text>
            </view>
            <view class="vault-meta-line">
              <text class="vault-meta-text">共 9 个专栏 · 60 篇深度研报 · 26.8万字沉淀</text>
            </view>
          </view>
        </view>

        <!-- 差异化专属功能 1：全站研读进度罗盘 -->
        <view class="vault-progress-block">
          <view class="vault-progress-labels">
            <view class="progress-left-label">
              <view class="pulse-emerald-dot"></view>
              <text class="progress-txt">研读进度 {{ overallProgress.percentage }}%</text>
            </view>
            <text class="progress-right-txt">已完成 {{ overallProgress.readCount }}/{{ overallProgress.totalCount }} 篇</text>
          </view>
          <view class="vault-progress-track">
            <view class="vault-progress-fill" :style="{ width: overallProgress.percentage + '%' }"></view>
          </view>
        </view>

        <!-- 差异化专属功能 2：一键直达「上次读至」快捷书签 -->
        <view v-if="lastReadArticle" class="vault-bookmark-strip" @tap="handleResumeReading">
          <view class="bookmark-left">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <text class="bookmark-label">上次读至：</text>
            <text class="bookmark-title">{{ lastReadArticle.title }}</text>
          </view>
          <view class="bookmark-right-cta">
            <text class="resume-text">继续精读</text>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>
      </view>
    </view>

    <!-- 3. 筛选与排序控制条 (Sticky Bar) -->
    <view class="controls-sticky-bar">
      <view class="controls-inner-row">
        <!-- 分类下拉选择器 -->
        <view class="dropdown-trigger-btn" @tap="isDropdownOpen = !isDropdownOpen">
          <text class="dropdown-label">{{ selectedCategoryName }}</text>
          <svg class="dropdown-caret" :class="{ 'is-flipped': isDropdownOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </view>

        <!-- 排序方式切换 -->
        <view class="sort-trigger-btn" @tap="isSortMenuOpen = !isSortMenuOpen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="3" y2="18"></line>
          </svg>
          <text class="sort-label">{{ currentSortLabel }}</text>
        </view>
      </view>

      <!-- 下拉分类弹出菜单 (8px 圆角) -->
      <view v-if="isDropdownOpen" class="dropdown-popover-menu">
        <view 
          v-for="cat in categoryOptions" 
          :key="cat.key"
          class="dropdown-option-item"
          :class="{ 'is-selected': selectedCategoryKey === cat.key }"
          @tap="selectCategory(cat)"
        >
          <text class="cat-option-name">{{ cat.label }}</text>
          <text class="cat-option-count">({{ cat.count }})</text>
          <svg v-if="selectedCategoryKey === cat.key" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </view>
      </view>

      <!-- 排序弹出菜单 (8px 圆角) -->
      <view v-if="isSortMenuOpen" class="sort-popover-menu">
        <view 
          v-for="st in sortOptions" 
          :key="st.key"
          class="sort-option-item"
          :class="{ 'is-selected': selectedSortKey === st.key }"
          @tap="selectSort(st)"
        >
          <text class="sort-option-name">{{ st.label }}</text>
          <svg v-if="selectedSortKey === st.key" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </view>
      </view>
    </view>

    <!-- 遮罩层 (点击收起下拉框) -->
    <view v-if="isDropdownOpen || isSortMenuOpen" class="backdrop-mask" @tap="closePopovers"></view>

    <!-- 4. 专栏目录树手风琴折叠列表 (Accordion Column Tree - 1:1 精准还原用户参考图) -->
    <view class="column-tree-container">
      <view 
        v-for="col in displayedColumns" 
        :key="col.id" 
        class="column-accordion-group"
      >
        <!-- 专栏手风琴标题横栏 -->
        <view class="column-group-header" @tap="toggleColumnFold(col.id)">
          <view class="header-left-info">
            <!-- 专栏叠层小图标 (纯矢量 SVG) -->
            <svg class="col-stack-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>

            <!-- 专栏标题 -->
            <text class="column-title-text">{{ col.title }}</text>

            <!-- 状态图标 (纯矢量 SVG：沙漏或已完结标，绝不使用系统 emoji) -->
            <view class="col-status-indicator">
              <svg v-if="col.statusType === 'updating'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 22h14"></path>
                <path d="M5 2h14"></path>
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
              </svg>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </view>

            <!-- 篇章总数 -->
            <text class="col-count-text">({{ col.chapters.length }})</text>
          </view>

          <!-- 右侧：分享胶囊按钮 + 折叠箭头 -->
          <view class="header-right-actions">
            <view v-if="isColumnExpanded(col.id)" class="col-share-pill" @tap.stop="handleShareColumn(col)">
              <text class="col-share-label">分享</text>
            </view>
            <view class="col-caret-icon" :class="{ 'is-expanded': isColumnExpanded(col.id) }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </view>
          </view>
        </view>

        <!-- 展开后的篇章章节列表 (精准对齐参考截图排版) -->
        <view v-if="isColumnExpanded(col.id)" class="column-chapters-list">
          <view 
            v-for="(chapter, idx) in col.chapters" 
            :key="chapter.id"
            class="chapter-row-item"
            :class="{ 'is-last': idx === col.chapters.length - 1 }"
            @tap="handleOpenChapter(col.id, chapter.id)"
          >
            <!-- 左侧圆点 Bullet -->
            <view class="chapter-bullet-box">
              <view class="bullet-dot" :class="{ 'is-read-bullet': isArticleRead(chapter.id) }"></view>
            </view>

            <!-- 篇章主标题与主题标签 -->
            <view class="chapter-title-col">
              <text 
                class="chapter-title-text"
                :class="{ 'is-read': isArticleRead(chapter.id), 'is-unread': !isArticleRead(chapter.id) }"
              >
                {{ chapter.title }}
              </text>
            </view>

            <!-- 右侧「新」橙色微标 (仅在未读且为新篇章时显示) -->
            <view v-if="!isArticleRead(chapter.id) && chapter.isNew !== false" class="badge-new-box">
              <text class="badge-new-text">新</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="displayedColumns.length === 0" class="empty-state-card">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <text class="empty-hint">当前筛选条件下暂无专栏</text>
        <button class="btn-reset-filters" @tap="resetAllFilters">重置全部筛选</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appState, actions } from '@/store/community.js';

// 展开的专栏 ID（默认展开第一专栏，与参考图完全一致）
const expandedColumnIds = ref(['col-us-stock']);

// 下拉弹窗与排序弹窗开关
const isDropdownOpen = ref(false);
const isSortMenuOpen = ref(false);

// 分类筛选
const selectedCategoryKey = ref('all');
const categoryOptions = [
  { key: 'all', label: '全部专栏', count: 9 },
  { key: 'macro', label: '宏观美股', count: 2 },
  { key: 'tech', label: 'AI科技产业', count: 2 },
  { key: 'asset', label: '大类资产配置', count: 2 },
  { key: 'strategy', label: '买方交易实战', count: 3 }
];

const selectedCategoryName = computed(() => {
  const opt = categoryOptions.find(o => o.key === selectedCategoryKey.value);
  return opt ? opt.label : '全部专栏';
});

// 排序方式 ('default' | 'updated' | 'count')
const selectedSortKey = ref('default');
const sortOptions = [
  { key: 'default', label: '默认排序' },
  { key: 'updated', label: '按更新时间' },
  { key: 'count', label: '按章节数量' }
];

const currentSortLabel = computed(() => {
  const st = sortOptions.find(s => s.key === selectedSortKey.value);
  return st ? st.label : '默认排序';
});

// 全站研读进度与统计
const overallProgress = computed(() => {
  const cols = appState.columns || [];
  let totalCount = 0;
  cols.forEach(c => {
    if (c.chapters) totalCount += c.chapters.length;
  });
  const readCount = appState.readArticleIds ? appState.readArticleIds.length : 0;
  const percentage = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;
  return { totalCount, readCount, percentage };
});

// 上次读至的书签（取已读列表中最新关联的章节，或首专栏待读章节）
const lastReadArticle = computed(() => {
  const col = appState.columns && appState.columns.find(c => c.id === 'col-us-stock');
  if (!col || !col.chapters) return null;
  // 返回第 4 篇章节作为高亮书签
  return col.chapters[3] || col.chapters[0];
});

// 过滤与排序后的专栏列表
const displayedColumns = computed(() => {
  let list = [...(appState.columns || [])];

  // 1. 分类筛选
  if (selectedCategoryKey.value !== 'all') {
    list = list.filter(c => c.category === selectedCategoryKey.value);
  }

  // 2. 排序
  if (selectedSortKey.value === 'count') {
    list.sort((a, b) => (b.chapters ? b.chapters.length : 0) - (a.chapters ? a.chapters.length : 0));
  }

  return list;
});

const isArticleRead = (articleId) => {
  return appState.readArticleIds.includes(articleId);
};

const isColumnExpanded = (colId) => {
  return expandedColumnIds.value.includes(colId);
};

const toggleColumnFold = (colId) => {
  const idx = expandedColumnIds.value.indexOf(colId);
  if (idx > -1) {
    expandedColumnIds.value.splice(idx, 1);
  } else {
    expandedColumnIds.value.push(colId);
  }
};

const handleOpenChapter = (colId, chapterId) => {
  appState.selectedColumnId = colId;
  appState.selectedArticleId = chapterId;
  actions.markArticleRead(chapterId);
  uni.navigateTo({
    url: `/pages/column/reader?id=${chapterId}&colId=${colId}`
  });
};

const handleResumeReading = () => {
  if (lastReadArticle.value) {
    handleOpenChapter('col-us-stock', lastReadArticle.value.id);
  }
};

const handleBackToFeed = () => {
  uni.switchTab({
    url: '/pages/feed/index'
  });
};

const handleShareGroup = () => {
  uni.showToast({
    title: '已复制专栏智库链接',
    icon: 'none'
  });
};

const handleShareColumn = (col) => {
  uni.showToast({
    title: `已复制「${col.title}」链接`,
    icon: 'none'
  });
};

const selectCategory = (cat) => {
  selectedCategoryKey.value = cat.key;
  isDropdownOpen.value = false;
};

const selectSort = (st) => {
  selectedSortKey.value = st.key;
  isSortMenuOpen.value = false;
};

const closePopovers = () => {
  isDropdownOpen.value = false;
  isSortMenuOpen.value = false;
};

const resetAllFilters = () => {
  selectedCategoryKey.value = 'all';
  selectedSortKey.value = 'default';
  closePopovers();
};
</script>

<style lang="scss">
page {
  background-color: #ffffff !important;
}
</style>

<style lang="scss" scoped>
:deep(page) {
  background-color: #ffffff !important;
}

.column-page {
  padding-bottom: 75px;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

/* 1. 顶部安全区固定导航条 */
.nav-top-bar {
  position: sticky;
  top: 0;
  z-index: 60;
  background-color: #ffffff;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: calc(8px + constant(safe-area-inset-top)) 16px 10px 16px;
  padding: calc(8px + env(safe-area-inset-top)) 16px 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-title {
  font-size: 19px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.nav-share-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.08);
}

/* 2. 差异化顶部案卷身份卡 (The Differentiated Vault Dossier Header) */
.vault-hero-section {
  padding: 12px 14px 10px 14px;
}

.vault-dossier-card {
  background: linear-gradient(135deg, #0b132b 0%, #152347 100%);
  border-radius: 8px !important;
  overflow: hidden;
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  padding: 15px 14px 13px 14px;
  box-shadow: none !important;
}

.vault-main-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.vault-emblem-box {
  width: 44px;
  height: 44px;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.07);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vault-info-col {
  flex: 1;
  min-width: 0;
}

.vault-title-line {
  margin-bottom: 4px;
}

.vault-title-text {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.2px;
}

.vault-meta-line {
  display: flex;
  align-items: center;
}

.vault-meta-text {
  font-size: 11px;
  color: #94a3b8;
}

/* 进度罗盘 */
.vault-progress-block {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px !important;
  padding: 8px 10px;
  margin-bottom: 10px;
  border: 0.5px solid rgba(255, 255, 255, 0.06);
}

.vault-progress-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.progress-left-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pulse-emerald-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.progress-txt {
  font-size: 11px;
  font-weight: 600;
  color: #10b981;
}

.progress-right-txt {
  font-size: 11px;
  color: #94a3b8;
}

.vault-progress-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.vault-progress-fill {
  height: 100%;
  background: #10b981;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* 上次读至快捷书签 */
.vault-bookmark-strip {
  background: rgba(245, 158, 11, 0.1);
  border: 0.5px solid rgba(245, 158, 11, 0.25);
  border-radius: 8px !important;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bookmark-left {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.bookmark-label {
  font-size: 11px;
  font-weight: 600;
  color: #f59e0b;
  flex-shrink: 0;
}

.bookmark-title {
  font-size: 11px;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bookmark-right-cta {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  margin-left: 8px;
}

.resume-text {
  font-size: 11px;
  font-weight: 600;
  color: #10b981;
}

/* 3. 筛选与排序控制条 (Sticky Bar) */
.controls-sticky-bar {
  position: sticky;
  top: calc(48px + constant(safe-area-inset-top));
  top: calc(48px + env(safe-area-inset-top));
  z-index: 50;
  background-color: #ffffff;
  border-top: 0.5px solid rgba(0, 0, 0, 0.04);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
}

.controls-inner-row {
  padding: 9px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dropdown-trigger-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px;
  background: #f1f5f9;
  border-radius: 8px !important;
}

.dropdown-label {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.dropdown-caret {
  transition: transform 0.2s ease;
  &.is-flipped {
    transform: rotate(180deg);
  }
}

.sort-trigger-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 6px;
  border-radius: 8px !important;
  flex-shrink: 0;
}

.sort-label {
  font-size: 12px;
  color: #64748b;
}

/* 下拉菜单 Popover */
.dropdown-popover-menu,
.sort-popover-menu {
  position: absolute;
  top: 100%;
  left: 14px;
  z-index: 70;
  background: #ffffff;
  border-radius: 8px !important;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
  min-width: 170px;
  padding: 4px 0;
}

.sort-popover-menu {
  left: auto;
  right: 14px;
  min-width: 130px;
}

.dropdown-option-item,
.sort-option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 0.5px solid #f8fafc;

  &:last-child {
    border-bottom: none;
  }

  &.is-selected {
    background: #f0fdf4;
    .cat-option-name,
    .sort-option-name {
      color: #10b981;
      font-weight: 600;
    }
  }
}

.cat-option-name,
.sort-option-name {
  font-size: 13px;
  color: #1e293b;
}

.cat-option-count {
  font-size: 12px;
  color: #94a3b8;
  margin-left: auto;
  margin-right: 8px;
}

.backdrop-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  background: rgba(0, 0, 0, 0.15);
}

/* 4. 专栏手风琴树列表 (1:1 高度还原参考截图) */
.column-tree-container {
  padding: 6px 0 20px 0;
  background-color: #ffffff;
}

.column-accordion-group {
  background-color: #ffffff;
  border-bottom: 0.5px solid #f1f5f9;
}

/* 专栏头部 */
.column-group-header {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.col-stack-svg {
  flex-shrink: 0;
}

.column-title-text {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-status-indicator {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.col-count-text {
  font-size: 14px;
  color: #64748b;
  flex-shrink: 0;
}

.header-right-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.col-share-pill {
  padding: 2px 8px;
  background: #ecfdf5;
  border-radius: 4px;
  border: 0.5px solid rgba(16, 185, 129, 0.3);
}

.col-share-label {
  font-size: 11px;
  font-weight: 500;
  color: #10b981;
}

.col-caret-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  &.is-expanded {
    transform: rotate(180deg);
  }
}

/* 篇章章节列表 */
.column-chapters-list {
  background-color: #ffffff;
}

.chapter-row-item {
  display: flex;
  align-items: center;
  padding: 12px 16px 12px 28px;
  border-bottom: 0.5px solid #f1f5f9;
  transition: background-color 0.15s ease;

  &:active {
    background-color: #f8fafc;
  }

  &.is-last {
    border-bottom: none;
  }
}

.chapter-bullet-box {
  width: 14px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.bullet-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #94a3b8;

  &.is-read-bullet {
    background: #cbd5e1;
  }
}

.chapter-title-col {
  flex: 1;
  min-width: 0;
  padding-right: 8px;
}

.chapter-title-text {
  font-size: 13.5px;
  line-height: 1.45;

  &.is-unread {
    color: #1e293b;
    font-weight: 500;
  }

  &.is-read {
    color: #94a3b8;
    font-weight: 400;
  }
}

/* 「新」小标签 */
.badge-new-box {
  flex-shrink: 0;
  padding: 1px 5px;
  background: #fff7ed;
  border: 0.5px solid #fed7aa;
  border-radius: 3px;
}

.badge-new-text {
  font-size: 10px;
  font-weight: 600;
  color: #ea580c;
  line-height: 1;
}

/* 空状态 */
.empty-state-card {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-hint {
  font-size: 13px;
  color: #94a3b8;
}

.btn-reset-filters {
  font-size: 12px;
  color: #10b981;
  background: #ecfdf5;
  border: 0.5px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px !important;
  padding: 4px 14px;
}
</style>
