<template>
  <view class="column-page">
    <!-- 1. 顶部状态栏透明占位（App 端 WebView 全屏需避让状态栏/灵动岛） -->
    <view class="status-bar-spacer"></view>

    <!-- 2. 学习中心顶部旗舰 Tab 导航栏 (Sticky Bar) -->
    <view class="learning-top-nav-bar">
      <view class="nav-tabs-track">
        <!-- 专栏 Tab -->
        <view 
          class="editorial-tab-item" 
          :class="{ 'is-active': activeTab === 'column' }"
          @tap="switchLearningTab('column')"
        >
          <view class="tab-title-wrap">
            <text class="tab-title-text">专栏</text>
          </view>
          <view v-if="activeTab === 'column'" class="tab-active-indicator"></view>
        </view>

        <!-- 课程 Tab -->
        <view 
          class="editorial-tab-item" 
          :class="{ 'is-active': activeTab === 'course' }"
          @tap="showComingSoon"
        >
          <view class="tab-title-wrap">
            <text class="tab-title-text">课程</text>
          </view>
          <view v-if="activeTab === 'course'" class="tab-active-indicator"></view>
        </view>

        <!-- 直播 Tab -->
        <view 
          class="editorial-tab-item" 
          :class="{ 'is-active': activeTab === 'live' }"
          @tap="showComingSoon"
        >
          <view class="tab-title-wrap">
            <text class="tab-title-text">直播</text>
          </view>
          <view v-if="activeTab === 'live'" class="tab-active-indicator"></view>
        </view>
      </view>

      <!-- 右侧优雅电脑端快捷入口 -->
      <view class="nav-pc-entry-chip" @tap="openPcGuideModal('nav')">
        <svg class="pc-chip-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        <text class="pc-chip-label">电脑端</text>
      </view>
    </view>

    <!-- ==================== 视图 1：专栏 TAB (完整保留原有高质感阅读体系) ==================== -->
    <view v-if="activeTab === 'column'" class="tab-pane-column">
      <!-- 最近阅读视觉中心大卡 (左文右画黄金构图 + 双行大字标题 + 立体书卷星轨插画) -->
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
              <view class="col-share-pill" @tap.stop="handleShareColumn(col)">
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

    <!-- ==================== 视图 2：课程 TAB (体系视频课预览与预约大纲) ==================== -->
    <view v-else-if="activeTab === 'course'" class="tab-pane-course">
      <!-- 预热通知横幅：对齐 PC 端体系视频课能力，打通移动端期待 -->
      <view class="teaser-notice-card" @tap="openPcGuideModal('course')">
        <view class="teaser-notice-left">
          <view class="teaser-icon-glow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </view>
          <view class="teaser-notice-texts">
            <text class="notice-title">移动端视频课堂正在加速研发中</text>
            <text class="notice-desc">支持抢先查阅全套大纲；高清视频课现已在电脑端上线</text>
          </view>
        </view>
        <view class="teaser-notice-action">
          <text class="teaser-go-pc">去电脑端</text>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 课程卡片列表（参考 PC 端 coursesMock） -->
      <view class="course-cards-container">
        <view 
          v-for="course in coursesList" 
          :key="course.id"
          class="course-card-item"
        >
          <!-- 封面图 (16:9) + 难度标签 + 课时时长底栏 -->
          <view class="course-cover-wrap" @tap="openCourseDrawer(course)">
            <image :src="course.cover" class="course-cover-img" mode="aspectFill" />
            <view class="course-cover-scrim"></view>

            <!-- 难度等级角标 -->
            <view class="course-level-badge">
              <text class="level-badge-text">{{ course.level }}</text>
            </view>

            <!-- 底部课时规格 HUD -->
            <view class="course-cover-meta-hud">
              <text class="hud-text">共 {{ course.lessonsCount }} 节 · {{ course.totalDuration }} · 1080P高清</text>
            </view>
          </view>

          <!-- 课程核心文字信息 -->
          <view class="course-info-body">
            <view class="course-title-row" @tap="openCourseDrawer(course)">
              <text class="course-title-text">{{ course.title }}</text>
            </view>

            <text class="course-desc-text" @tap="openCourseDrawer(course)">
              {{ course.description }}
            </text>

            <!-- 核心模块胶囊 -->
            <view class="course-modules-row">
              <view 
                v-for="mod in course.modules" 
                :key="mod" 
                class="course-mod-pill"
              >
                <text class="mod-pill-text">{{ mod }}</text>
              </view>
            </view>

            <!-- 底部行动栏：讲师 / 在学与预约统计 + 两个高价值操作按钮 -->
            <view class="course-card-footer">
              <view class="course-meta-stats">
                <text class="meta-instructor">{{ course.instructor }}</text>
                <text class="meta-dot">·</text>
                <text class="meta-students">{{ course.studentsCount }} 人在学</text>
              </view>

              <view class="course-actions-row">
                <!-- 课表大纲按钮 -->
                <view class="btn-course-outline" @tap="openCourseDrawer(course)">
                  <text class="btn-outline-text">课表大纲 ({{ course.lessonsCount }})</text>
                </view>

                <!-- 预约提醒按钮 (带交互状态) -->
                <view 
                  class="btn-course-reserve" 
                  :class="{ 'is-reserved': isCourseReserved(course.id) }"
                  @tap="toggleCourseReserve(course)"
                >
                  <svg v-if="!isCourseReserved(course.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <text class="btn-reserve-text">{{ isCourseReserved(course.id) ? '已预约' : '预约上线' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 电脑端大屏观看指引卡片 -->
      <view class="pc-guidance-card" @tap="openPcGuideModal('course_card')">
        <view class="pc-guide-left">
          <view class="pc-monitor-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </view>
          <view class="pc-guide-texts">
            <text class="pc-guide-head">在电脑端畅享 1080P 高清视频课</text>
            <text class="pc-guide-sub">支持倍速播放、章节跳选与全套投研课件下载</text>
          </view>
        </view>
        <view class="btn-pc-copy-link" @tap.stop="copyPcUrl">
          <text class="pc-copy-label">复制网址</text>
        </view>
      </view>
    </view>

    <!-- ==================== 视图 3：直播 TAB (闭门路演排期与腾讯会议参会) ==================== -->
    <view v-else-if="activeTab === 'live'" class="tab-pane-live">
      <!-- 1. 当前高光路演大卡 (Studio 演播室画质) -->
      <view v-if="liveSpotlight" class="live-spotlight-card">
        <view class="spotlight-media-box">
          <image :src="liveSpotlight.cover" class="spotlight-cover-img" mode="aspectFill" />
          <view class="spotlight-scrim"></view>

          <!-- 状态药丸胶囊 (微呼吸动效) -->
          <view class="spotlight-live-hud">
            <view class="live-dot-pulse"></view>
            <text class="live-hud-text">即将开播 · {{ liveSpotlight.participantsCount }}人已报名</text>
          </view>

          <!-- 开播时间提醒 -->
          <view class="spotlight-time-bar">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <text class="time-text">{{ liveSpotlight.scheduledStartTime }}</text>
          </view>
        </view>

        <!-- 议题标题与主讲人 -->
        <view class="spotlight-body">
          <view class="spotlight-category-chip">
            <text class="category-chip-text">{{ liveSpotlight.columnTag }}</text>
          </view>

          <text class="spotlight-title-text">{{ liveSpotlight.title }}</text>
          <text class="spotlight-summary-text">{{ liveSpotlight.summary }}</text>

          <!-- 主讲人名片与参会凭证 -->
          <view class="spotlight-speaker-row">
            <image :src="liveSpotlight.creatorAvatar" class="speaker-avatar-img" mode="aspectFill" />
            <view class="speaker-meta-col">
              <text class="speaker-name-text">{{ liveSpotlight.creator }}</text>
              <text class="speaker-title-text">{{ liveSpotlight.creatorTitle }}</text>
            </view>
          </view>

          <!-- 腾讯会议门票行动栏 -->
          <view class="meeting-ticket-action-row">
            <view class="meeting-code-pill" @tap="copyMeetingCode(liveSpotlight.meetingCode)">
              <text class="code-label">腾讯会议号:</text>
              <text class="code-val">{{ formatMeetingCode(liveSpotlight.meetingCode) }}</text>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </view>

            <view 
              class="btn-live-reserve"
              :class="{ 'is-reserved': isLiveReserved(liveSpotlight.id) }"
              @tap="toggleLiveReserve(liveSpotlight)"
            >
              <text class="live-reserve-label">{{ isLiveReserved(liveSpotlight.id) ? '已约开播' : '预约开播' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 2. 后续闭门排期清单 -->
      <view class="section-title-wrap">
        <text class="section-heading">后续闭门路演排期</text>
        <text class="section-subheading">星友尊享 · 腾讯会议实时互动提问</text>
      </view>

      <view class="upcoming-calendar-list">
        <view 
          v-for="item in liveUpcomingList" 
          :key="item.id"
          class="upcoming-calendar-card"
        >
          <!-- 左侧：专属日历日期块 -->
          <view class="calendar-date-badge">
            <text class="cal-month-day">{{ item.dateBadge }}</text>
            <text class="cal-time-hour">{{ item.timeBadge }}</text>
          </view>

          <!-- 中部：路演议题与主讲人 -->
          <view class="calendar-content-col">
            <view class="cal-title-row">
              <text class="cal-tag-label">{{ item.columnTag }}</text>
              <text class="cal-topic-title">{{ item.title }}</text>
            </view>

            <text class="cal-summary-brief">{{ item.summary }}</text>

            <view class="cal-speaker-chip">
              <image :src="item.creatorAvatar" class="cal-host-avatar" mode="aspectFill" />
              <text class="cal-host-name">{{ item.creator }} · {{ item.creatorTitle }}</text>
            </view>
          </view>

          <!-- 右侧：一键复制会议号 -->
          <view class="calendar-action-col" @tap="copyMeetingCode(item.meetingCode)">
            <view class="btn-copy-code-sm">
              <text class="code-sm-text">复制会议号</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 3. 往期精选录播（电脑端支持回看） -->
      <view class="section-title-wrap">
        <text class="section-heading">往期精选路演录播</text>
        <text class="section-subheading">电脑端现已支持 7 天内限免回看与 AI 纪要</text>
      </view>

      <view class="replay-records-grid">
        <view 
          v-for="rep in liveReplayList" 
          :key="rep.id"
          class="replay-record-card"
          @tap="openPcGuideModal('replay')"
        >
          <view class="replay-thumb-wrap">
            <image :src="rep.cover" class="replay-thumb-img" mode="aspectFill" />
            <view class="replay-duration-pill">
              <text class="duration-pill-text">{{ rep.duration }}</text>
            </view>
          </view>

          <view class="replay-info-col">
            <text class="replay-title-text">{{ rep.title }}</text>
            <view class="replay-meta-line">
              <text class="replay-speaker">{{ rep.creator }}</text>
              <text class="meta-dot">·</text>
              <text class="replay-views">{{ rep.viewsCount }} 人已回看</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 4. 参会权益与常见问题指引 -->
      <view class="live-privilege-card">
        <view class="privilege-header">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <text class="privilege-title">闭门路演参会指引</text>
        </view>
        <view class="privilege-list">
          <view class="privilege-item">
            <text class="item-num">1.</text>
            <text class="item-txt">星球星友享有全部闭门路演免费参会权益；</text>
          </view>
          <view class="privilege-item">
            <text class="item-num">2.</text>
            <text class="item-txt">点击复制会议号后，打开手机「腾讯会议」App 即可一键入会连麦；</text>
          </view>
          <view class="privilege-item">
            <text class="item-num">3.</text>
            <text class="item-txt">完整录播与 AI 纪要已同步上线 PC 网页端，支持大屏倍速复盘。</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ==================== 弹窗 A：课程章节课表半屏抽屉 (Outline Drawer) ==================== -->
    <view v-if="drawerCourse" class="outline-drawer-mask" @tap="closeCourseDrawer">
      <view class="outline-drawer-sheet" @tap.stop>
        <!-- 顶部拖拽手柄 -->
        <view class="drawer-drag-handle"></view>

        <!-- 头部课程信息 -->
        <view class="drawer-header-row">
          <view class="drawer-title-col">
            <view class="drawer-tag-row">
              <text class="drawer-level-pill">{{ drawerCourse.level }}</text>
              <text class="drawer-cat-text">{{ drawerCourse.categoryLabel }}</text>
            </view>
            <text class="drawer-course-title">{{ drawerCourse.title }}</text>
          </view>
          <view class="drawer-close-btn" @tap="closeCourseDrawer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>

        <view class="drawer-subhead-banner">
          <text class="drawer-subhead-text">共 {{ drawerCourse.lessons.length }} 节视频课 · 总时长 {{ drawerCourse.totalDuration }} · 电脑端已上线播放</text>
        </view>

        <!-- 滚动课时列表 -->
        <scroll-view class="drawer-lessons-scroll" scroll-y="true">
          <view 
            v-for="ls in drawerCourse.lessons" 
            :key="ls.id"
            class="drawer-lesson-item"
          >
            <view class="lesson-num-badge">
              <text class="num-badge-text">{{ ls.index }}</text>
            </view>

            <view class="lesson-info-col">
              <view class="lesson-title-meta-line">
                <text class="lesson-title-text">{{ ls.title }}</text>
              </view>
              <view class="lesson-tags-line">
                <text class="lesson-duration-pill">{{ ls.duration }}</text>
                <text v-if="ls.moduleTag" class="lesson-module-tag">模块: {{ ls.moduleTag }}</text>
              </view>
              <text class="lesson-summary-box">{{ ls.summary }}</text>
            </view>
          </view>
        </scroll-view>

        <!-- 抽屉底部操作栏 -->
        <view class="drawer-footer-actions">
          <view 
            class="drawer-btn-reserve" 
            :class="{ 'is-reserved': isCourseReserved(drawerCourse.id) }"
            @tap="toggleCourseReserve(drawerCourse)"
          >
            <text class="drawer-reserve-text">{{ isCourseReserved(drawerCourse.id) ? '✓ 已预约移动端上线提醒' : '🔔 预约移动端上线提醒' }}</text>
          </view>
          <view class="drawer-btn-pc" @tap="copyPcUrl">
            <text class="drawer-pc-text">复制电脑端网址</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ==================== 专栏分组分享海报抽屉 ==================== -->
    <ColumnShareModal />

    <!-- ==================== 弹窗 B：电脑端访问指引弹窗 (PC Guidance Modal) ==================== -->
    <view v-if="isPcGuideModalVisible" class="pc-guide-mask" @tap="isPcGuideModalVisible = false">
      <view class="pc-guide-modal-dialog" @tap.stop>
        <view class="modal-top-bar">
          <text class="modal-title">电脑端大屏观看</text>
          <view class="modal-close-icon" @tap="isPcGuideModalVisible = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>

        <view class="modal-body-content">
          <text class="modal-intro">
            在电脑浏览器打开下方网址并登录同一账号，即可大屏观看：
          </text>

          <!-- 网址展示与复制 -->
          <view class="pc-url-display-box" @tap="copyPcUrl">
            <text class="pc-url-text">{{ pcWebUrl }}</text>
          </view>
        </view>

        <view class="modal-footer-row">
          <view class="btn-modal-primary" @tap="copyPcUrl">
            <text class="btn-modal-label">复制网址</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appState, actions } from '@/store/community.js';
import { learningCoursesMock, learningLiveMeetingsMock } from '@/common/learningMock.js';
import ColumnShareModal from '@/components/ColumnShareModal.vue';

// 当前处于哪个子 Tab ('column' | 'course' | 'live')
const activeTab = ref('column');

const switchLearningTab = (tabKey) => {
  activeTab.value = tabKey;
  // 切换时关闭所有可能打开的下拉框
  closePopovers();
};

// ---------------- 课程与直播 Mock 数据 ----------------
const coursesList = ref(learningCoursesMock);
const liveSpotlight = ref(learningLiveMeetingsMock.spotlight);
const liveUpcomingList = ref(learningLiveMeetingsMock.upcomingList);
const liveReplayList = ref(learningLiveMeetingsMock.replayList);

// 预约状态管理 (响应式集合)
const reservedCourseIds = ref(['course-macro']);
const reservedLiveIds = ref(['tm-live-0']);

const isCourseReserved = (courseId) => {
  return reservedCourseIds.value.includes(courseId);
};

const showComingSoon = () => {
  uni.showToast({
    title: '敬请期待',
    icon: 'none'
  });
};

const toggleCourseReserve = (course) => {
  const idx = reservedCourseIds.value.indexOf(course.id);
  if (idx > -1) {
    reservedCourseIds.value.splice(idx, 1);
    uni.showToast({
      title: '已取消预约',
      icon: 'none'
    });
  } else {
    reservedCourseIds.value.push(course.id);
    uni.showToast({
      title: `预约成功！《${course.title}》移动端上线将第一时间通知您`,
      icon: 'none'
    });
  }
};

const isLiveReserved = (liveId) => {
  return reservedLiveIds.value.includes(liveId);
};

const toggleLiveReserve = (live) => {
  const idx = reservedLiveIds.value.indexOf(live.id);
  if (idx > -1) {
    reservedLiveIds.value.splice(idx, 1);
    uni.showToast({
      title: '已取消直播提醒',
      icon: 'none'
    });
  } else {
    reservedLiveIds.value.push(live.id);
    uni.showToast({
      title: '已设置开播提醒！开播前 15 分钟将向您推送通知',
      icon: 'none'
    });
  }
};

// ---------------- 课表抽屉弹窗 ----------------
const drawerCourse = ref(null);

const openCourseDrawer = (course) => {
  drawerCourse.value = course;
};

const closeCourseDrawer = () => {
  drawerCourse.value = null;
};

// ---------------- 电脑端访问指引与复制 ----------------
const isPcGuideModalVisible = ref(false);
const pcWebUrl = ref('https://wealth.planet.com/#/learning');

const openPcGuideModal = (source = '') => {
  isPcGuideModalVisible.value = true;
};

const copyPcUrl = () => {
  uni.setClipboardData({
    data: pcWebUrl.value,
    success: () => {
      uni.showToast({
        title: '电脑端网址已复制到剪贴板',
        icon: 'success'
      });
      isPcGuideModalVisible.value = false;
    }
  });
};

const copyMeetingCode = (rawCode) => {
  const cleanCode = String(rawCode).replace(/\s+/g, '');
  uni.setClipboardData({
    data: cleanCode,
    success: () => {
      uni.showToast({
        title: `会议号 ${cleanCode} 已复制，打开腾讯会议即可进入`,
        icon: 'none'
      });
    }
  });
};

const formatMeetingCode = (code) => {
  const str = String(code).replace(/\s+/g, '');
  if (str.length === 9) {
    return `${str.slice(0, 3)} ${str.slice(3, 6)} ${str.slice(6)}`;
  }
  return str;
};

// ==================== 专栏原有状态与逻辑（100% 保持完全兼容） ====================
// 展开的专栏 ID（默认展开第一专栏）
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

// 「新」标规则：未读 且 发布时间在 7 天内
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

const handleShareColumn = (col) => {
  actions.openColumnShareModal(col);
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
  background-color: #f8fafc !important;
}
</style>

<style lang="scss" scoped>
:deep(page) {
  background-color: #f8fafc !important;
}

.column-page {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-bottom: 80px;
  background-color: #f8fafc;
  min-height: 100vh;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

/* 1. 顶部状态栏固定遮罩 */
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

/* 2. 学习中心顶部旗舰 Tab 导航栏 (Sticky Bar) */
.learning-top-nav-bar {
  /* 固定 48px 高度，与下方筛选排序条的 sticky 偏移 (+48px) 精确对齐，吸顶时无缝贴合 */
  height: 48px;
  box-sizing: border-box;
  position: sticky;
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
  z-index: 55;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 6px 16px 0px 18px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
}

.nav-tabs-track {
  display: flex;
  align-items: center;
  gap: 28px;
}

.editorial-tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0 10px 0;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:active {
    opacity: 0.75;
  }
}

.tab-title-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tab-title-text {
  font-size: 15.5px;
  font-weight: 500;
  color: #64748b;
  line-height: 1.25;
  transition: all 0.18s ease;

  .is-active & {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.2px;
  }
}

/* 右上角悬浮羽量微徽标 */
.tab-floating-badge {
  position: absolute;
  top: -6px;
  right: -24px;
  padding: 1px 4.5px;
  border-radius: 99px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  &.is-course {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border: 0.5px solid rgba(16, 185, 129, 0.35);

    .badge-txt {
      color: #047857;
    }
  }

  &.is-live {
    background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
    border: 0.5px solid rgba(234, 88, 12, 0.3);

    .badge-txt {
      color: #ea580c;
    }
  }
}

.badge-txt {
  font-size: 8.5px;
  font-weight: 700;
  line-height: 1;
  display: block;
  transform: scale(0.92);
}

/* 底部动效指示器胶囊条 */
.tab-active-indicator {
  position: absolute;
  bottom: 0;
  width: 18px;
  height: 3px;
  border-radius: 99px;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  box-shadow: 0 2px 5px rgba(16, 185, 129, 0.38);
  animation: indicatorIn 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes indicatorIn {
  from {
    opacity: 0;
    transform: scaleX(0.4);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

/* 右侧优雅电脑端快捷入口 */
.nav-pc-entry-chip {
  align-self: center;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  background: #f8fafc;
  border: 0.5px solid #e2e8f0;
  border-radius: 99px;
  color: #64748b;
  transition: all 0.16s ease;

  &:active {
    background: #ecfdf5;
    border-color: rgba(16, 185, 129, 0.3);
    color: #059669;
  }
}

.pc-chip-svg {
  flex-shrink: 0;
}

.pc-chip-label {
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

/* ==================== 视图 1：专栏 TAB 样式 ==================== */
.tab-pane-column {
  background-color: #ffffff;
}

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

.recent-hero-illust {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 0;
  opacity: 0.72;
}

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

/* 筛选与排序 Sticky Bar */
.controls-sticky-bar {
  position: sticky;
  top: calc(constant(safe-area-inset-top) + 48px);
  top: calc(env(safe-area-inset-top) + 48px);
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
  background: #f6f6f6;
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

.column-tree-container {
  padding: 6px 0 20px 0;
  background-color: #ffffff;
}

.column-accordion-group {
  background-color: #ffffff;
  border-bottom: 0.5px solid #f1f5f9;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  padding: 0 8px;
  box-sizing: border-box;
  background: #ecfdf5;
  border-radius: 4px;
  border: 0.5px solid rgba(16, 185, 129, 0.3);
}

.col-share-label {
  font-size: 11px;
  line-height: 1;
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
    background-color: #f6f6f6;
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

/* ==================== 视图 2：课程 TAB 样式 ==================== */
.tab-pane-course {
  padding: 12px 14px 24px 14px;
  background-color: #f8fafc;
}

/* 预热横幅 */
.teaser-notice-card {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 0.5px solid rgba(16, 185, 129, 0.25);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.05);

  &:active {
    opacity: 0.9;
  }
}

.teaser-notice-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.teaser-icon-glow {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.12);
}

.teaser-notice-texts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.notice-title {
  font-size: 13px;
  font-weight: 700;
  color: #065f46;
  line-height: 1.25;
}

.notice-desc {
  font-size: 11px;
  color: #047857;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teaser-notice-action {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.teaser-go-pc {
  font-size: 11.5px;
  font-weight: 600;
  color: #059669;
}

/* 课程卡片 */
.course-cards-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.course-card-item {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 3px 12px -3px rgba(15, 23, 42, 0.06);
}

.course-cover-wrap {
  position: relative;
  width: 100%;
  height: 160px;
  background: #e2e8f0;
  overflow: hidden;
}

.course-cover-img {
  width: 100%;
  height: 100%;
}

.course-cover-scrim {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, transparent 40%, rgba(0, 0, 0, 0.72) 100%);
}

.course-level-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(4px);
}

.level-badge-text {
  font-size: 10.5px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

.course-cover-meta-hud {
  position: absolute;
  left: 12px;
  bottom: 10px;
  right: 12px;
}

.hud-text {
  font-size: 11.5px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.course-info-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.course-title-row {
  margin-bottom: 6px;
}

.course-title-text {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}

.course-desc-text {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}

.course-modules-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.course-mod-pill {
  padding: 2.5px 7px;
  background: #f1f5f9;
  border-radius: 4px;
}

.mod-pill-text {
  font-size: 11px;
  color: #475569;
  font-weight: 500;
}

.course-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 0.5px solid #f1f5f9;
  gap: 8px;
}

.course-meta-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.meta-instructor,
.meta-students {
  font-size: 11.5px;
  color: #64748b;
  white-space: nowrap;
}

.meta-dot {
  font-size: 11px;
  color: #cbd5e1;
}

.course-actions-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.btn-course-outline {
  padding: 6px 10px;
  background: #f8fafc;
  border: 0.5px solid #cbd5e1;
  border-radius: 8px;

  &:active {
    background: #f1f5f9;
  }
}

.btn-outline-text {
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
  line-height: 1;
}

.btn-course-reserve {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);

  &.is-reserved {
    background: #ecfdf5;
    border: 0.5px solid rgba(16, 185, 129, 0.4);
    box-shadow: none;

    .btn-reserve-text {
      color: #059669;
      font-weight: 600;
    }
  }

  &:active {
    opacity: 0.88;
  }
}

.btn-reserve-text {
  font-size: 11.5px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

/* 电脑端指引卡片 */
.pc-guidance-card {
  margin-top: 16px;
  background: #ffffff;
  border-radius: 12px;
  border: 0.5px solid #e2e8f0;
  padding: 13px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.pc-guide-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.pc-monitor-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pc-guide-texts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pc-guide-head {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.pc-guide-sub {
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-pc-copy-link {
  padding: 5px 10px;
  background: #ecfdf5;
  border: 0.5px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  flex-shrink: 0;

  &:active {
    background: #d1fae5;
  }
}

.pc-copy-label {
  font-size: 11px;
  font-weight: 600;
  color: #059669;
}

/* ==================== 视图 3：直播 TAB 样式 ==================== */
.tab-pane-live {
  padding: 12px 14px 24px 14px;
  background-color: #f8fafc;
}

.live-spotlight-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 16px -4px rgba(15, 23, 42, 0.08);
  margin-bottom: 20px;
}

.spotlight-media-box {
  position: relative;
  width: 100%;
  height: 160px;
  background: #0f172a;
}

.spotlight-cover-img {
  width: 100%;
  height: 100%;
}

.spotlight-scrim {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 40%, rgba(0, 0, 0, 0.78) 100%);
}

.spotlight-live-hud {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3.5px 8px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 99px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
}

.live-dot-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
}

.live-hud-text {
  font-size: 10.5px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

.spotlight-time-bar {
  position: absolute;
  left: 12px;
  bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.time-text {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.spotlight-body {
  padding: 14px;
}

.spotlight-category-chip {
  display: inline-block;
  padding: 2px 7px;
  background: #ecfdf5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.category-chip-text {
  font-size: 11px;
  color: #059669;
  font-weight: 600;
}

.spotlight-title-text {
  font-size: 16.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  margin-bottom: 6px;
  display: block;
}

.spotlight-summary-text {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
  display: block;
}

.spotlight-speaker-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 12px;
  border-bottom: 0.5px solid #f1f5f9;
  margin-bottom: 12px;
}

.speaker-avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
}

.speaker-meta-col {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.speaker-name-text {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.speaker-title-text {
  font-size: 11px;
  color: #64748b;
}

.meeting-ticket-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.meeting-code-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 11px;
  background: #f8fafc;
  border: 0.5px solid #cbd5e1;
  border-radius: 8px;
  flex: 1;

  &:active {
    background: #f1f5f9;
  }
}

.code-label {
  font-size: 11.5px;
  color: #64748b;
}

.code-val {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.5px;
}

.btn-live-reserve {
  padding: 8px 14px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
  flex-shrink: 0;

  &.is-reserved {
    background: #ecfdf5;
    border: 0.5px solid rgba(16, 185, 129, 0.4);
    box-shadow: none;

    .live-reserve-label {
      color: #059669;
    }
  }

  &:active {
    opacity: 0.88;
  }
}

.live-reserve-label {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

/* 分区标题 */
.section-title-wrap {
  margin: 18px 0 10px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-heading {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
}

.section-subheading {
  font-size: 11.5px;
  color: #64748b;
}

/* 后续排期日历卡片 */
.upcoming-calendar-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.upcoming-calendar-card {
  background: #ffffff;
  border-radius: 12px;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: #f0fdf4;
  border: 0.5px solid rgba(16, 185, 129, 0.3);
  border-radius: 10px;
  flex-shrink: 0;
}

.cal-month-day {
  font-size: 14px;
  font-weight: 800;
  color: #059669;
  line-height: 1;
  margin-bottom: 3px;
}

.cal-time-hour {
  font-size: 10.5px;
  font-weight: 600;
  color: #047857;
  line-height: 1;
}

.calendar-content-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cal-title-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.cal-tag-label {
  font-size: 10px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 1px 4px;
  border-radius: 3px;
  flex-shrink: 0;
}

.cal-topic-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cal-summary-brief {
  font-size: 11.5px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cal-speaker-chip {
  display: flex;
  align-items: center;
  gap: 5px;
}

.cal-host-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cal-host-name {
  font-size: 11px;
  color: #475569;
}

.calendar-action-col {
  flex-shrink: 0;
}

.btn-copy-code-sm {
  padding: 6px 9px;
  background: #f8fafc;
  border: 0.5px solid #cbd5e1;
  border-radius: 6px;

  &:active {
    background: #f1f5f9;
  }
}

.code-sm-text {
  font-size: 11px;
  color: #334155;
  font-weight: 600;
}

/* 往期录播 */
.replay-records-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.replay-record-card {
  background: #ffffff;
  border-radius: 12px;
  border: 0.5px solid rgba(0, 0, 0, 0.06);
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;

  &:active {
    background: #fbfbfe;
  }
}

.replay-thumb-wrap {
  position: relative;
  width: 96px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #0f172a;
}

.replay-thumb-img {
  width: 100%;
  height: 100%;
}

.replay-duration-pill {
  position: absolute;
  right: 4px;
  bottom: 4px;
  padding: 1.5px 4px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
}

.duration-pill-text {
  font-size: 9.5px;
  color: #ffffff;
  font-weight: 600;
}

.replay-info-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.replay-title-text {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.replay-meta-line {
  display: flex;
  align-items: center;
  gap: 5px;
}

.replay-speaker,
.replay-views {
  font-size: 11px;
  color: #64748b;
}

/* 参会指引 */
.live-privilege-card {
  background: #ffffff;
  border-radius: 12px;
  border: 0.5px solid #e2e8f0;
  padding: 14px;
}

.privilege-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.privilege-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.privilege-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.privilege-item {
  display: flex;
  align-items: flex-start;
  gap: 5px;
}

.item-num {
  font-size: 11.5px;
  font-weight: 700;
  color: #10b981;
  line-height: 1.45;
}

.item-txt {
  font-size: 11.5px;
  color: #475569;
  line-height: 1.45;
}

/* ==================== 弹窗 A：课表半屏抽屉 (Outline Drawer) ==================== */
.outline-drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.outline-drawer-sheet {
  background: #ffffff;
  border-radius: 18px 18px 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 10px 16px 24px 16px;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.drawer-drag-handle {
  width: 38px;
  height: 4px;
  background: #cbd5e1;
  border-radius: 99px;
  align-self: center;
  margin-bottom: 12px;
}

.drawer-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.drawer-title-col {
  flex: 1;
  min-width: 0;
}

.drawer-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.drawer-level-pill {
  font-size: 10.5px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 1.5px 6px;
  border-radius: 4px;
}

.drawer-cat-text {
  font-size: 11.5px;
  color: #64748b;
}

.drawer-course-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.drawer-close-btn {
  padding: 4px;
  flex-shrink: 0;

  &:active {
    opacity: 0.7;
  }
}

.drawer-subhead-banner {
  padding: 7px 10px;
  background: #f8fafc;
  border-radius: 6px;
  margin-bottom: 12px;
}

.drawer-subhead-text {
  font-size: 11.5px;
  color: #64748b;
}

.drawer-lessons-scroll {
  max-height: 46vh;
  margin-bottom: 14px;
}

.drawer-lesson-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 0.5px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
}

.lesson-num-badge {
  width: 26px;
  height: 26px;
  background: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.num-badge-text {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.lesson-info-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lesson-title-meta-line {
  display: flex;
  align-items: center;
}

.lesson-title-text {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.lesson-tags-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lesson-duration-pill {
  font-size: 10.5px;
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 1px 5px;
  border-radius: 3px;
}

.lesson-module-tag {
  font-size: 10.5px;
  color: #64748b;
}

.lesson-summary-box {
  font-size: 12px;
  color: #64748b;
  line-height: 1.45;
  background: #f8fafc;
  padding: 6px 8px;
  border-radius: 6px;
  margin-top: 2px;
}

.drawer-footer-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
}

.drawer-btn-reserve {
  flex: 1.4;
  padding: 11px 0;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.is-reserved {
    background: #ecfdf5;
    border: 0.5px solid rgba(16, 185, 129, 0.4);
    .drawer-reserve-text {
      color: #059669;
    }
  }

  &:active {
    opacity: 0.9;
  }
}

.drawer-reserve-text {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
}

.drawer-btn-pc {
  flex: 1;
  padding: 11px 0;
  background: #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    background: #e2e8f0;
  }
}

.drawer-pc-text {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

/* ==================== 弹窗 B：电脑端指引弹窗 (PC Guidance Modal) ==================== */
.pc-guide-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 95;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.pc-guide-modal-dialog {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 330px;
  padding: 18px 18px 20px 18px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}

.modal-close-icon {
  padding: 2px;
}

.modal-body-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.modal-intro {
  font-size: 12.5px;
  color: #475569;
  line-height: 1.5;
}

.step-guide-box {
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-step-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.step-circle {
  width: 18px;
  height: 18px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.step-num {
  font-size: 10.5px;
  font-weight: 700;
  color: #ffffff;
}

.step-detail {
  font-size: 12px;
  color: #1e293b;
  line-height: 1.4;
}

.pc-url-display-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 12px;
  background: #ecfdf5;
  border: 0.5px solid rgba(16, 185, 129, 0.35);
  border-radius: 8px;

  &:active {
    background: #d1fae5;
  }
}

.pc-url-text {
  font-size: 12px;
  font-weight: 600;
  color: #065f46;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 8px;
}

.copy-badge-pill {
  padding: 2.5px 7px;
  background: #10b981;
  border-radius: 4px;
  flex-shrink: 0;
}

.copy-badge-text {
  font-size: 10.5px;
  font-weight: 600;
  color: #ffffff;
}

.modal-footer-row {
  display: flex;
}

.btn-modal-primary {
  width: 100%;
  padding: 11px 0;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.9;
  }
}

.btn-modal-label {
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
}
</style>
