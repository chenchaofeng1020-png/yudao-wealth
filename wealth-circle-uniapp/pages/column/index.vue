<template>
  <view class="column-page">
    <!-- 1. 顶部状态栏透明占位（App 端 WebView 全屏需避让状态栏/灵动岛） -->
    <view class="status-bar-spacer"></view>

    <!-- 2. 最近阅读视觉中心大卡 (左文右画黄金构图 + 双行大字标题 + 立体书卷星轨插画) -->
    <view v-if="lastReadArticle" class="recent-read-section">
      <view class="recent-card-wrapper" @tap="handleResumeReading">
        <view class="recent-paper-card">
          <!-- 右侧主视觉装饰插画：微立体展开书卷 + 星轨光环 + 垂挂书签（浅雅水印级质感） -->
          <svg class="recent-hero-illust" width="148" height="136" viewBox="0 0 148 136" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bookPageLeft" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#ecfdf5" stop-opacity="0.7"/>
              </linearGradient>
              <linearGradient id="bookPageRight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f0fdf4" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#d1fae5" stop-opacity="0.55"/>
              </linearGradient>
              <linearGradient id="bookCoverGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.14"/>
                <stop offset="100%" stop-color="#059669" stop-opacity="0.06"/>
              </linearGradient>
            </defs>

            <!-- 背景大号星轨虚线环与实线环 -->
            <ellipse cx="102" cy="68" rx="68" ry="44" transform="rotate(-18 102 68)" stroke="rgba(16, 185, 129, 0.10)" stroke-width="1" stroke-dasharray="3 4"/>
            <ellipse cx="104" cy="68" rx="48" ry="29" transform="rotate(-18 104 68)" stroke="rgba(16, 185, 129, 0.07)" stroke-width="1"/>

            <!-- 悬浮立体书卷主图形 -->
            <g transform="translate(52, 34) rotate(-8)">
              <!-- 底层精装硬壳书封阴影与衬底 -->
              <path d="M34 11C21 11 9 15.5 2 22V66C9 59.5 21 55 34 55C47 55 59 59.5 66 66V22C59 15.5 47 11 34 11Z" fill="url(#bookCoverGrad)" stroke="rgba(16, 185, 129, 0.16)" stroke-width="1.1" stroke-linejoin="round"/>
              <!-- 左半页书页 -->
              <path d="M34 8C22 8 11 12.5 5 18.5V60C11 54 22 49.5 34 49.5V8Z" fill="url(#bookPageLeft)" stroke="rgba(16, 185, 129, 0.20)" stroke-width="1.1" stroke-linejoin="round"/>
              <!-- 右半页书页 -->
              <path d="M34 8C46 8 57 12.5 63 18.5V60C57 54 46 49.5 34 49.5V8Z" fill="url(#bookPageRight)" stroke="rgba(16, 185, 129, 0.22)" stroke-width="1.1" stroke-linejoin="round"/>
              <!-- 左页内文装饰线 -->
              <line x1="12" y1="23" x2="27" y2="19.5" stroke="rgba(16, 185, 129, 0.20)" stroke-width="1.3" stroke-linecap="round"/>
              <line x1="12" y1="30" x2="27" y2="26.5" stroke="rgba(16, 185, 129, 0.14)" stroke-width="1.2" stroke-linecap="round"/>
              <line x1="12" y1="37" x2="23" y2="34.5" stroke="rgba(16, 185, 129, 0.12)" stroke-width="1.2" stroke-linecap="round"/>
              <!-- 右页内文装饰线 -->
              <line x1="41" y1="19.5" x2="56" y2="23" stroke="rgba(5, 150, 105, 0.20)" stroke-width="1.3" stroke-linecap="round"/>
              <line x1="41" y1="26.5" x2="56" y2="30" stroke="rgba(5, 150, 105, 0.14)" stroke-width="1.2" stroke-linecap="round"/>
              <line x1="41" y1="34" x2="52" y2="36.5" stroke="rgba(5, 150, 105, 0.12)" stroke-width="1.2" stroke-linecap="round"/>
              <!-- 书缝夹着的浅金微书签丝带 -->
              <path d="M32 49.5H36.5V65L34.25 62L32 65V49.5Z" fill="rgba(245, 158, 11, 0.42)"/>
            </g>

            <!-- 星芒与轨道微粒点缀 -->
            <path d="M46 22L47.8 27.2L53 29L47.8 30.8L46 36L44.2 30.8L39 29L44.2 27.2L46 22Z" fill="rgba(16, 185, 129, 0.15)"/>
            <path d="M122 18L123.1 21.4L126.5 22.5L123.1 23.6L122 27L120.9 23.6L117.5 22.5L120.9 21.4L122 18Z" fill="rgba(245, 158, 11, 0.24)"/>
            <circle cx="34" cy="54" r="2" fill="rgba(16, 185, 129, 0.12)"/>
            <circle cx="130" cy="48" r="2.2" fill="rgba(16, 185, 129, 0.14)"/>
          </svg>

          <!-- 左侧内容纵列：眉题专栏 -> 双行大标题 -> 底部实体胶囊按钮 -->
          <view class="recent-content-col">
            <!-- 1. 顶部眉题：书签标 + 最近阅读 · 所属专栏 -->
            <view class="recent-eyebrow-row">
              <view class="recent-badge-tag">
                <svg class="recent-bookmark-svg" width="11" height="11" viewBox="0 0 24 24" fill="#059669" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <text class="kicker-text">最近阅读</text>
              </view>
              <text class="recent-col-title">{{ lastReadColumn ? lastReadColumn.title : '' }}</text>
            </view>

            <!-- 2. 中部核心：大字号双行文章主标题（成为页面视觉中心） -->
            <view class="recent-main-row">
              <text class="recent-headline-hero">{{ lastReadArticle.title }}</text>
            </view>

            <!-- 3. 底部行动栏：实体翠绿胶囊按钮 -->
            <view class="recent-footer-row">
              <view class="recent-cta-btn">
                <text class="recent-cta-label">继续阅读</text>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部微露的第二层书页叠边 -->
        <view class="recent-paper-underlay"></view>
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
            <view v-if="isNewBadge(chapter)" class="badge-new-box">
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

// 最近阅读的专栏与章节（关联当前选中或默认首专栏最近章节）
const lastReadColumn = computed(() => {
  const cols = appState.columns || [];
  return cols.find(c => c.id === (appState.selectedColumnId || 'col-us-stock')) || cols[0] || null;
});

const lastReadArticle = computed(() => {
  const col = lastReadColumn.value;
  if (!col || !col.chapters) return null;
  if (appState.selectedArticleId && appState.selectedArticleId !== 'art-mg-1') {
    const matched = col.chapters.find(ch => ch.id === appState.selectedArticleId);
    if (matched) return matched;
  }
  return col.chapters[3] || col.chapters[0];
});

// 拆分文章标题中的【模块前缀】与正文标题，赋予杂志级排版层次
const parsedLastArticle = computed(() => {
  const raw = lastReadArticle.value ? lastReadArticle.value.title : '';
  const match = raw.match(/^【([^】]+)】\s*(.*)$/);
  if (match) {
    return { prefix: match[1], body: match[2] };
  }
  return { prefix: '', body: raw };
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

// 「新」标规则：未读 且 发布时间在 7 天内（无发布时间的文章以 isNew 标记兜底，isNew=false 为运营手动关闭）
const isNewBadge = (chapter) => {
  if (isArticleRead(chapter.id) || chapter.isNew === false) return false;
  if (!chapter.createdAt) return chapter.isNew === true;
  const t = new Date(String(chapter.createdAt).replace(/-/g, '/')).getTime();
  return Date.now() - t <= 7 * 24 * 3600 * 1000;
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
  if (lastReadArticle.value && lastReadColumn.value) {
    handleOpenChapter(lastReadColumn.value.id, lastReadArticle.value.id);
  }
};

const handleBackToFeed = () => {
  uni.switchTab({
    url: '/pages/feed/index'
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
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-bottom: 75px;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

/* 1. 顶部状态栏固定遮罩（App 端滚动时盖住状态栏区域，避免内容透出） */
.status-bar-spacer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  background: #ffffff;
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}

/* 2. 最近阅读视觉中心大卡 (左文右画黄金构图 + 双行大字标题 + 立体书卷星轨插画) */
.recent-read-section {
  padding: 12px 14px 6px 14px;
  background: #ffffff;
}

.recent-card-wrapper {
  position: relative;
  transition: transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:active {
    transform: scale(0.985);
  }
}

.recent-paper-card {
  position: relative;
  z-index: 2;
  background:
    radial-gradient(110% 130% at 95% 20%, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.015) 48%, transparent 78%),
    linear-gradient(135deg, #f6fcfa 0%, #fbfefd 48%, #ffffff 100%);
  border-radius: 14px;
  border: 0.5px solid rgba(16, 185, 129, 0.16);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.98),
    0 6px 18px -8px rgba(15, 23, 42, 0.05),
    0 2px 5px -1px rgba(15, 23, 42, 0.025);
  padding: 16px 16px 15px 17px;
  overflow: hidden;

  /* 左侧内嵌翡翠书脊饰条（与按钮同色系，仅比按钮略浅半度） */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #22c58b 0%, #34d399 100%);
  }
}

/* 右侧立体书卷与星轨装饰插画 */
.recent-hero-illust {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 0;
  opacity: 0.72;
}

/* 底部微露叠纸层 */
.recent-paper-underlay {
  position: relative;
  z-index: 1;
  height: 5px;
  margin: 0 12px;
  background: linear-gradient(90deg, #f3fbf7 0%, #f8fafc 100%);
  border: 0.5px solid rgba(16, 185, 129, 0.11);
  border-top: none;
  border-radius: 0 0 10px 10px;
}

.recent-content-col {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding-right: 92px;
}

.recent-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
  min-width: 0;
}

.recent-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 3.5px;
  padding: 2px 7px;
  background: rgba(16, 185, 129, 0.12);
  border: 0.5px solid rgba(16, 185, 129, 0.24);
  border-radius: 5px;
  flex-shrink: 0;
}

.recent-bookmark-svg {
  flex-shrink: 0;
}

.kicker-text {
  font-size: 11px;
  font-weight: 600;
  color: #047857;
  line-height: 1.2;
}

.recent-col-title {
  margin-left: -3px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-main-row {
  margin-bottom: 13px;
}

.recent-headline-hero {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.42;
  letter-spacing: -0.25px;
  font-feature-settings: "halt" 1;
}

.recent-footer-row {
  display: flex;
  align-items: center;
}

.recent-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 5.5px 12px 5.5px 13px;
  background: linear-gradient(135deg, #16c486 0%, #10b981 100%);
  border-radius: 99px;
  box-shadow: 0 3px 10px -2px rgba(16, 185, 129, 0.28);
}

.recent-cta-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.1;
}

/* 3. 筛选与排序控制条 (Sticky Bar - 去除顶部生硬横线，与上方卡片紧凑衔接) */
.controls-sticky-bar {
  position: sticky;
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
  z-index: 50;
  background-color: #ffffff;
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
