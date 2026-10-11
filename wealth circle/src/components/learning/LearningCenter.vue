<template>
  <div class="course-page-root" ref="pageRootRef">
    <!-- ==================== 视图 A：标准课程详情页（深度对标中国大学MOOC：上首屏「左封面+右报名卡」+ 下分栏「课程介绍海报 / 课程目录 / 课程评价」+ 右侧出品保障与关联推荐） ==================== -->
    <div v-if="activeCourse" class="mooc-course-detail-view animate-fade-in">
      <!-- 1. 顶部面包屑与演示状态切换栏 -->
      <header class="mooc-bread-bar">
        <div class="bread-left">
          <button class="btn-back-catalog" @click="closeCourseClassroom">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>返回课程列表</span>
          </button>
          <span class="bread-sep">/</span>
          <span class="bread-cat">{{ activeCourse.categoryLabel || '体系课程' }}</span>
          <span class="bread-sep">/</span>
          <span class="bread-current">{{ activeCourse.title }}</span>
        </div>

        <div class="bread-right num-tabular">
          <div class="demo-scene-switcher" title="切换预览未购/已购状态下的课程详情页">
            <span class="scene-dot"></span>
            <span class="scene-label">状态预览</span>
            <div class="scene-select-wrap">
              <select v-model="demoPurchaseMode" class="scene-select">
                <option value="default_locked">未购初始态</option>
                <option value="sample_unlocked">已购2门含进度</option>
                <option value="all_unlocked">全部已购解锁</option>
              </select>
              <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. 首屏核心信息卡（对标 icourse163 .course-head-container：左 16:9 封面与播放入口 + 右标题/规格/价格/立即购买） -->
      <section class="mooc-hero-section">
        <div class="mooc-hero-card">
          <!-- 左侧：课程高清封面 + 悬浮视频播放/目录预览胶囊 -->
          <div class="mooc-face-img" @click="handleHeroVideoAction">
            <img :src="activeCourse.cover" :alt="activeCourse.title" class="mooc-cover-pic" />
            <div class="mooc-face-overlay"></div>

            <!-- 居中悬浮圆角胶囊按钮（对标 .course-try-play） -->
            <button class="mooc-try-play-btn">
              <span class="play-triangle-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 4 20 12 6 20 6 4"></polygon>
                </svg>
              </span>
              <span class="try-play-text">
                {{ isCourseUnlocked(activeCourse) ? '立即观看课程视频' : '查看课程视频目录' }}
              </span>
            </button>

            <div class="mooc-face-bottom-meta num-tabular">
              <span>1080P 高清视频课</span>
              <span>·</span>
              <span>共 {{ activeCourse.lessons.length }} 节（{{ activeCourse.totalDuration }}）</span>
            </div>
          </div>

          <!-- 右侧：标题、模块标签、课时规格、价格框与主转化按钮（对标 .c-right） -->
          <div class="mooc-c-right">
            <div class="mooc-title-row">
              <span class="mooc-level-badge">{{ activeCourse.level }}</span>
              <h1 class="mooc-course-title">{{ activeCourse.title }}</h1>
            </div>

            <p class="mooc-course-subdesc">
              {{ activeCourse.description }}
            </p>

            <!-- 课程规格与模块说明框（对标 #j-course-term） -->
            <div class="mooc-term-panel num-tabular">
              <div class="term-row">
                <span class="term-label">核心模块</span>
                <div class="term-modules-wrap">
                  <span
                    v-for="mod in activeCourse.modules"
                    :key="mod"
                    class="term-mod-pill"
                  >
                    {{ mod }}
                  </span>
                </div>
              </div>
              <div class="term-row">
                <span class="term-label">课程课时</span>
                <span class="term-val">
                  共 {{ activeCourse.lessons.length }} 节系统视频课 · 总时长 {{ activeCourse.totalDuration }} · 购买后永久无限回看
                </span>
              </div>
            </div>

            <!-- 价格与立即参加/购买转化区（对标 .price-join） -->
            <div class="mooc-price-join-bar num-tabular">
              <template v-if="isCourseUnlocked(activeCourse)">
                <div class="unlocked-hero-state">
                  <div class="unlocked-left-info">
                    <span class="unlocked-check-pill">✓ 已购买本门课程</span>
                    <span class="unlocked-progress-text">
                      当前已学 {{ getCompletedCount(activeCourse) }} / {{ activeCourse.lessons.length }} 节（{{ getProgressPercent(activeCourse) }}%）
                    </span>
                  </div>

                  <div class="hero-cta-row">
                    <button class="btn-mooc-primary is-green" @click="openVideoPlayerModal(activeLesson || activeCourse.lessons[0])">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4"></polygon>
                      </svg>
                      <span>立即开始学习</span>
                    </button>
                    <span class="join-num-text">已有 {{ activeCourse.studentsCount }} 人参加</span>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="locked-hero-state">
                  <div class="mooc-price-box">
                    <span class="price-curr">¥</span>
                    <span class="price-main">{{ activeCourse.price }}</span>
                    <span v-if="activeCourse.originPrice" class="price-old">¥{{ activeCourse.originPrice }}</span>
                    <span class="price-rule-pill">单门课程独立付费 · 永久有效</span>
                  </div>

                  <div class="hero-cta-row">
                    <button class="btn-mooc-primary" @click="openPurchaseModal(activeCourse)">
                      立即购买本课程
                    </button>
                    <button class="btn-mooc-outline" @click="switchToCatalogTab">
                      查看课程目录 ({{ activeCourse.lessons.length }}节)
                    </button>
                    <span class="join-num-text">已有 {{ activeCourse.studentsCount }} 人参加</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. 下方详情主体双栏区（对标 icourse163 .intro：左侧白底 Tab 大卡 + 右侧白底出品与推荐侧栏） -->
      <section class="mooc-intro-section" ref="introSectionRef">
        <div class="mooc-intro-grid">
          <!-- 左侧主容器（.u-intro-container） -->
          <div class="mooc-main-container">
            <!-- 经典下划线 Tab 导航栏（对标 .u-tab-heder：课程介绍 | 课程目录 | 课程评价） -->
            <div class="mooc-tab-header">
              <button
                :class="['mooc-tab-item', { cur: moocDetailTab === 'intro' }]"
                @click="moocDetailTab = 'intro'"
              >
                <span>课程介绍</span>
              </button>

              <button
                :class="['mooc-tab-item', { cur: moocDetailTab === 'catalog' }]"
                @click="moocDetailTab = 'catalog'"
              >
                <span>课程目录</span>
                <span class="try-see-tip num-tabular">共{{ activeCourse.lessons.length }}节</span>
              </button>

              <button
                :class="['mooc-tab-item', { cur: moocDetailTab === 'reviews' }]"
                @click="moocDetailTab = 'reviews'"
              >
                <span>课程评价</span>
                <span class="comment-count num-tabular">({{ currentCourseReviews.length }})</span>
              </button>
            </div>

            <!-- ==================== Tab 1：课程介绍（纯正富文本展示，对应后台富文本编辑器内容，无多余嵌套卡片） ==================== -->
            <div v-if="moocDetailTab === 'intro'" class="mooc-richtext-content animate-fade-in">
              <blockquote>
                <p>
                  <strong>课程导读：</strong>{{ activeCourse.description }}本课程共包含 <strong>{{ (activeCourse.modules || []).length }} 大核心知识模块</strong>、<strong>{{ activeCourse.lessons.length }} 节高清系统视频课</strong>（总时长 {{ activeCourse.totalDuration }}），帮助投资者从底层逻辑到实操风控建立完整的决策体系。
                </p>
              </blockquote>

              <h3>一、课程背景与学习目标</h3>
              <p>
                在真实的金融市场与资产配置实践中，许多投资者往往依赖碎片化的资讯或单一指标做决策，缺乏对交易制度、估值逻辑与风险敞口的系统认知。《{{ activeCourse.title }}》专为希望建立标准化投研框架的学员打造，围绕<strong>「{{ (activeCourse.modules || []).join('、') }}」</strong>展开循序渐进的深度拆解。
              </p>
              <p>
                通过本课程的系统学习，您将彻底厘清核心规则与定价机制，掌握可量化、可复用的分析工具，并在实战交易与资产配置中建立起严密的风险防守纪律。
              </p>

              <figure class="richtext-figure">
                <img :src="activeCourse.cover" :alt="activeCourse.title" />
                <figcaption>图：《{{ activeCourse.title }}》课程实操框架与核心模块示意</figcaption>
              </figure>

              <h3>二、核心知识模块大纲</h3>
              <p>本门课程按照从基础认知到实战应用的逻辑递进，涵盖以下核心模块内容：</p>
              <ul>
                <li v-for="modCard in visualModuleCards" :key="modCard.name">
                  <strong>模块 0{{ modCard.index }} · {{ modCard.name }}：</strong>重点讲解 {{ modCard.keywords }}（对应视频课时约 {{ modCard.duration }}）。
                </li>
              </ul>

              <h3>三、适合学习人群</h3>
              <ul>
                <li>希望系统掌握《{{ activeCourse.title }}》底层规则、告别碎片化盲目摸索的投资者；</li>
                <li>缺乏清晰量化评估标准，需要在实操中规避隐性交易成本与风险敞口的进阶学员；</li>
                <li>追求长期稳健复利、注重科学资产配置与组合风险管理的财富学习者。</li>
              </ul>

              <h3>四、购课与学习须知</h3>
              <p>
                1. <strong>单门课程独立付费：</strong>平台所有课程均支持按需单独购买，本课定价 <strong>¥{{ activeCourse.price }}</strong>，无任何捆绑消费。<br />
                2. <strong>永久无限次复看：</strong>课程购买后即与您的个人账号永久绑定，全套 {{ activeCourse.lessons.length }} 节高清视频支持随时回看与多倍速播放。<br />
                3. <strong>如何开始观看：</strong>购课完成后，点击上方「立即开始学习」按钮或切换至顶部<strong>「课程目录」</strong>标签页，即可按小节顺序点播学习。
              </p>
            </div>

            <!-- ==================== Tab 2：课程目录（全页唯一的视频小节列表，对标 icourse163 .chapter-box） ==================== -->
            <div v-else-if="moocDetailTab === 'catalog'" class="mooc-chapter-box animate-fade-in">
              <div class="chapter-summary-bar num-tabular">
                <div class="chapter-summary-left">
                  <span class="chapter-main-label">《{{ activeCourse.title }}》完整视频课表</span>
                  <span class="chapter-sub-count">共 {{ activeCourse.lessons.length }} 节高清视频 · 总时长 {{ activeCourse.totalDuration }}</span>
                </div>
                <span v-if="isCourseUnlocked(activeCourse)" class="chapter-unlock-status is-open">
                  ✓ 已解锁全部章节 · 点击任意小节即可播放
                </span>
                <span v-else class="chapter-unlock-status is-locked">
                  🔒 购买本课（¥{{ activeCourse.price }}）后解锁全部视频播放
                </span>
              </div>

              <div class="chapter-lessons-list">
                <div
                  v-for="(ls, idx) in activeCourse.lessons"
                  :key="ls.id"
                  :class="[
                    'chapter-lesson-row',
                    {
                      active: activeLesson?.id === ls.id,
                      completed: isLessonCompleted(activeCourse, ls)
                    }
                  ]"
                  @click="handleCatalogLessonClick(ls)"
                >
                  <div class="chapter-row-left">
                    <span class="chapter-ls-num num-tabular">{{ String(idx + 1).padStart(2, '0') }}</span>
                    <span class="chapter-video-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4"></polygon>
                      </svg>
                    </span>
                    <div class="chapter-ls-texts">
                      <div class="chapter-ls-title-line">
                        <span class="chapter-ls-title">{{ ls.title }}</span>
                        <span v-if="ls.moduleTag" class="chapter-mod-tag">{{ ls.moduleTag }}</span>
                      </div>
                      <p v-if="ls.summary" class="chapter-ls-desc">{{ ls.summary }}</p>
                    </div>
                  </div>

                  <div class="chapter-row-right num-tabular">
                    <span class="chapter-ls-duration">{{ ls.duration }}</span>
                    <button
                      v-if="isCourseUnlocked(activeCourse)"
                      class="btn-chapter-play is-unlocked"
                    >
                      <template v-if="isLessonCompleted(activeCourse, ls)">✓ 已学 · 重新播放</template>
                      <template v-else>▶ 立即播放</template>
                    </button>
                    <button
                      v-else
                      class="btn-chapter-play is-locked"
                    >
                      🔒 购课观看
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ==================== Tab 3：课程评价（对标 icourse163 .comment-box） ==================== -->
            <div v-else-if="moocDetailTab === 'reviews'" class="mooc-comment-box animate-fade-in">
              <div class="rating-overview-banner num-tabular">
                <div class="rating-score-left">
                  <span class="big-score">4.9</span>
                  <div class="stars-and-label">
                    <span class="gold-stars">★★★★★</span>
                    <span class="rating-sub">课程综合评分 · 99% 好评率</span>
                  </div>
                </div>
                <div class="rating-tags-right">
                  <span class="rating-tag-pill">框架清晰 ({{ Math.round(activeCourse.studentsCount * 0.42) }})</span>
                  <span class="rating-tag-pill">实操性强 ({{ Math.round(activeCourse.studentsCount * 0.31) }})</span>
                  <span class="rating-tag-pill">风控到位 ({{ Math.round(activeCourse.studentsCount * 0.19) }})</span>
                </div>
              </div>

              <div class="reviews-list-stack">
                <div
                  v-for="rev in currentCourseReviews"
                  :key="rev.id"
                  class="review-card-item"
                >
                  <div class="review-item-top">
                    <div class="reviewer-info">
                      <span class="reviewer-avatar">{{ rev.user.slice(0, 1) }}</span>
                      <span class="reviewer-name">{{ rev.user }}</span>
                      <span class="reviewer-badge">已购学员</span>
                    </div>
                    <div class="review-meta num-tabular">
                      <span class="review-stars">★★★★★</span>
                      <span class="review-date">{{ rev.date }}</span>
                    </div>
                  </div>
                  <p class="review-content">{{ rev.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧辅助栏（对标 icourse163 右侧栏：课程出品保障 + 同系列相关推荐课程，绝不重复放小节列表！） -->
          <aside class="mooc-side-col">
            <!-- 侧栏卡片 1：讲师介绍（对标中国大学MOOC右侧授课老师卡片） -->
            <div class="mooc-side-card">
              <h3 class="mooc-side-title">讲师介绍</h3>
              <div class="instructor-profile-box">
                <img
                  :src="currentCourseInstructor.avatar"
                  :alt="currentCourseInstructor.name"
                  class="instructor-avatar"
                />
                <div class="instructor-meta">
                  <div class="instructor-name-row">
                    <span class="instructor-name">{{ currentCourseInstructor.name }}</span>
                    <span class="instructor-role-pill">{{ currentCourseInstructor.badge }}</span>
                  </div>
                  <div class="instructor-title">{{ currentCourseInstructor.title }}</div>
                </div>
              </div>
              <p class="instructor-bio">
                {{ currentCourseInstructor.bio }}
              </p>
              <div class="instructor-tags">
                <span v-for="tag in currentCourseInstructor.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>

            <!-- 侧栏卡片 2：相关推荐课程 -->
            <div class="mooc-side-card">
              <h3 class="mooc-side-title">相关体系课程推荐</h3>
              <div class="related-courses-list">
                <div
                  v-for="rel in relatedCourses"
                  :key="rel.id"
                  class="related-course-item"
                  @click="openCourseClassroom(rel)"
                >
                  <img :src="rel.cover" :alt="rel.title" class="related-thumb" />
                  <div class="related-info">
                    <h4 class="related-title">{{ rel.title }}</h4>
                    <div class="related-meta num-tabular">
                      <span class="related-lessons">{{ rel.lessons.length }} 节视频</span>
                      <span class="related-price">¥{{ rel.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- ==================== 沉浸式视频播放剧场弹窗（点击“立即开始学习”或“课程目录”中的小节时弹出） ==================== -->
      <transition name="fade">
        <div
          v-if="playerModalOpen && activeLesson"
          class="player-theater-backdrop"
          @click.self="playerModalOpen = false"
        >
          <div class="player-theater-dialog">
            <header class="theater-top-bar">
              <div class="theater-top-left">
                <span class="theater-course-badge">{{ activeCourse.title }}</span>
                <span class="theater-lesson-name">{{ activeLesson.title }}</span>
              </div>
              <button class="btn-close-theater" @click="playerModalOpen = false">
                ✕ 关闭播放器
              </button>
            </header>

            <div class="theater-body-grid">
              <!-- 左侧 16:9 高清播放器 -->
              <div class="theater-video-col">
                <div class="video-stage-box" style="margin-bottom: 0;">
                  <div class="player-canvas">
                    <img
                      :src="activeCourse.cover"
                      :alt="activeCourse.title"
                      class="player-backdrop-img"
                      :class="{ 'is-playing': isVideoPlaying }"
                    />

                    <div class="player-top-strip">
                      <div class="playing-lesson-pill">
                        <span class="wave-bars" :class="{ paused: !isVideoPlaying }">
                          <i></i><i></i><i></i>
                        </span>
                        <span>正在播放 · {{ activeLesson.title }}</span>
                      </div>
                      <span class="brand-watermark">财不外露 · 1080P 高清课堂</span>
                    </div>

                    <div class="player-center-stage" @click="toggleVideoPlay">
                      <button class="btn-circle-play">
                        <svg v-if="!isVideoPlaying" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6 4 20 12 6 20 6 4"></polygon>
                        </svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                        </svg>
                      </button>
                    </div>

                    <div class="player-control-bar">
                      <button class="ctrl-icon-btn" @click="toggleVideoPlay">
                        <svg v-if="!isVideoPlaying" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      </button>

                      <span class="ctrl-timecode num-tabular">
                        {{ simulatedTime }} / {{ activeLesson.duration }}
                      </span>

                      <div class="ctrl-timeline" @click="seekProgress($event)">
                        <div class="ctrl-timeline-fill" :style="{ width: videoProgress + '%' }"></div>
                      </div>

                      <div class="ctrl-speed-group">
                        <button
                          v-for="sp in [1.0, 1.25, 1.5, 2.0]"
                          :key="sp"
                          :class="['speed-btn', { active: playbackSpeed === sp }]"
                          @click="playbackSpeed = sp"
                        >
                          {{ sp }}x
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="theater-bottom-actions num-tabular">
                  <div class="theater-summary-text">
                    {{ activeLesson.summary }}
                  </div>
                  <div class="theater-btns-right">
                    <button
                      class="btn-theater-step"
                      :disabled="!hasPrevLesson"
                      @click="playPrevLesson"
                    >
                      ← 上一节
                    </button>
                    <button
                      class="btn-theater-step"
                      :disabled="!hasNextLesson"
                      @click="playNextLesson"
                    >
                      下一节 →
                    </button>
                    <button
                      :class="['btn-mark-complete', { completed: isLessonCompleted(activeCourse, activeLesson) }]"
                      @click="handleToggleLessonComplete(activeCourse, activeLesson)"
                    >
                      ✓ {{ isLessonCompleted(activeCourse, activeLesson) ? '已学完本节' : '标记已学完' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 右侧选集抽屉 -->
              <div class="theater-playlist-col">
                <div class="theater-playlist-title num-tabular">
                  <span>视频选集</span>
                  <span>{{ activeLessonIndex + 1 }} / {{ activeCourse.lessons.length }}</span>
                </div>
                <div class="theater-playlist-scroll">
                  <div
                    v-for="(ls, idx) in activeCourse.lessons"
                    :key="ls.id"
                    :class="['theater-pl-item', { active: activeLesson?.id === ls.id }]"
                    @click="selectLesson(ls)"
                  >
                    <span class="tpl-num num-tabular">{{ String(idx + 1).padStart(2, '0') }}</span>
                    <div class="tpl-main">
                      <div class="tpl-title">{{ cleanLessonShortTitle(ls.title) }}</div>
                      <div class="tpl-meta num-tabular">
                        <span>{{ ls.moduleTag }}</span>
                        <span>{{ ls.duration }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- ==================== 视图 B：系统化课程主画廊 ==================== -->
    <div v-else class="course-catalog-view">
      <!-- 1. 顶部栏：与直播页家族化设计语言对齐 -->
      <header class="course-top-bar">
        <div class="top-bar-left">
          <h1 class="course-page-title">课程</h1>
          <span class="top-bar-divider"></span>
          <span class="course-page-subtitle">系统化理财与投资分析视频课</span>
          <span class="course-rule-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <span>单门课程独立付费 · 购买后永久无限回看</span>
          </span>
        </div>

        <div class="top-bar-right">
          <div class="demo-scene-switcher" title="切换预览不同购课状态下的页面交互效果">
            <span class="scene-dot"></span>
            <span class="scene-label">购课状态预览</span>
            <div class="scene-select-wrap">
              <select v-model="demoPurchaseMode" class="scene-select">
                <option value="default_locked">真实初始态（均需单独购买）</option>
                <option value="sample_unlocked">演示：已购 2 门（含学习进度）</option>
                <option value="all_unlocked">演示：已购全部 10 门课程</option>
              </select>
              <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div class="course-content-body">
        <!-- ==================== 1. 首屏精选课程大 Banner（左沉浸式主视觉画布 + 右侧推荐课程切换栏） ==================== -->
        <section
          v-if="currentBannerSlide"
          class="featured-banner-section"
          @mouseenter="pauseBannerAutoPlay"
          @mouseleave="resumeBannerAutoPlay"
        >
          <div class="mooc-poster-banner">
            <!-- 左侧主视觉画布（全画幅背景图渐变融合 + 清晰克制的课程核心信息） -->
            <div class="poster-stage-left" @click="openCourseClassroom(currentBannerSlide.course)">
              <!-- 右侧底层课程高清封面图 + 左侧多层平滑暗色渐变遮罩 -->
              <div class="poster-backdrop-media">
                <img
                  :src="currentBannerSlide.course.cover"
                  :alt="currentBannerSlide.course.title"
                  class="poster-backdrop-img"
                />
                <div class="poster-backdrop-gradient"></div>
              </div>

              <!-- 左侧前景主内容区 -->
              <div class="poster-editorial-content">
                <div class="poster-top-area">
                  <div class="poster-eyebrow-row num-tabular">
                    <span class="poster-featured-tag">
                      <span class="featured-dot"></span>
                      精选推荐
                    </span>
                    <span class="poster-eyebrow-meta">
                      {{ currentBannerSlide.course.categoryLabel }} · {{ currentBannerSlide.course.level }} · 共 {{ currentBannerSlide.course.lessons.length }} 节 ({{ currentBannerSlide.course.totalDuration }})
                    </span>
                  </div>

                  <h2 class="poster-main-title">{{ currentBannerSlide.course.title }}</h2>

                  <p class="poster-subtitle">
                    {{ currentBannerSlide.course.description }}
                  </p>

                  <!-- 核心知识模块胶囊 -->
                  <div v-if="currentBannerSlide.course.modules && currentBannerSlide.course.modules.length" class="poster-modules-row">
                    <span
                      v-for="mod in currentBannerSlide.course.modules.slice(0, 5)"
                      :key="mod"
                      class="poster-mod-pill"
                    >
                      {{ mod }}
                    </span>
                  </div>
                </div>

                <!-- 底部行动按钮与价格说明 -->
                <div class="poster-bottom-bar num-tabular">
                  <button class="btn-poster-primary" @click.stop="openCourseClassroom(currentBannerSlide.course)">
                    <span>{{ isCourseUnlocked(currentBannerSlide.course) ? '继续学习课程' : '立即查看详情' }}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  <div class="poster-price-meta">
                    <template v-if="isCourseUnlocked(currentBannerSlide.course)">
                      <span class="poster-unlocked-badge">已解锁全套课程</span>
                    </template>
                    <template v-else>
                      <span class="poster-price-now">¥{{ currentBannerSlide.course.price }}</span>
                      <span v-if="currentBannerSlide.course.originPrice" class="poster-price-old">
                        ¥{{ currentBannerSlide.course.originPrice }}
                      </span>
                      <span class="poster-trial-badge">第 1 节免费试看</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：深色推荐课程切换栏（顶部标题栏 + 序号/激活态/课时标签） -->
            <div class="poster-nav-right">
              <div class="poster-nav-box">
                <div class="poster-nav-header num-tabular">
                  <span class="nav-header-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.4">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>精选课程推荐</span>
                  </span>
                  <span class="nav-header-counter">
                    <b class="counter-active">{{ String(bannerIndex + 1).padStart(2, '0') }}</b>
                    <span class="counter-slash">/</span>
                    <span>{{ String(featuredBannerSlides.length).padStart(2, '0') }}</span>
                  </span>
                </div>

                <div class="poster-nav-list">
                  <button
                    v-for="(slide, idx) in featuredBannerSlides"
                    :key="slide.course.id"
                    :class="['poster-nav-item', { active: bannerIndex === idx }]"
                    @mouseenter="goToBannerSlide(idx)"
                    @click="openCourseClassroom(slide.course)"
                  >
                    <span class="nav-item-left">
                      <span class="nav-item-idx num-tabular">
                        <template v-if="bannerIndex === idx">◀</template>
                        <template v-else>{{ String(idx + 1).padStart(2, '0') }}</template>
                      </span>
                      <span class="nav-item-text">{{ slide.navLabel }}</span>
                    </span>
                    <span class="nav-item-meta num-tabular">
                      {{ bannerIndex === idx ? '详情 →' : `${slide.course.lessons.length}节` }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== 2. 课程体系画廊（一体式分段槽 + 3列视频课程精装卡） ==================== -->
        <section class="course-gallery-section">
          <div class="gallery-toolbar-bar">
            <div class="gallery-toolbar-left">
              <div class="clean-select-wrap">
                <select v-model="activeCategory" class="clean-select">
                  <option value="all">全部课程（{{ publishedCourses.length }}）</option>
                  <option value="foundation">基础与工具（{{ foundationCount }}）</option>
                  <option value="market">市场与产业（{{ marketCount }}）</option>
                  <option value="strategy">组合与风控（{{ strategyCount }}）</option>
                  <option value="purchased">已购课程（{{ purchasedCount }}）</option>
                </select>
                <svg class="clean-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div class="gallery-toolbar-right">
              <div class="clean-search-wrap">
                <svg class="search-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="clean-search-input"
                  placeholder="搜索课程名或知识模块..."
                />
                <button v-if="searchQuery" class="btn-clear-q" @click="searchQuery = ''">✕</button>
              </div>
            </div>
          </div>

          <!-- 3列精装课程卡片网格 -->
          <div v-if="filteredCourses.length > 0" class="course-catalog-grid">
            <article
              v-for="course in filteredCourses"
              :key="course.id"
              class="editorial-course-card"
              @click="openCourseClassroom(course)"
            >
              <!-- 16:9 视频课程封面画框 -->
              <div class="course-thumb-box">
                <img :src="course.cover" :alt="course.title" class="cover-img-fill" />
                <div class="cover-scrim-overlay"></div>

                <!-- 左上角黑曜石磨砂状态/定价胶囊 -->
                <span v-if="isCourseUnlocked(course)" class="thumb-frosted-badge num-tabular">
                  <span class="badge-dot dot-emerald"></span>
                  <span>已购解锁 · 已学 {{ getCompletedCount(course) }}/{{ course.lessons.length }} 节</span>
                </span>
                <span v-else class="thumb-frosted-badge num-tabular">
                  <span class="badge-dot dot-amber"></span>
                  <span>{{ course.priceNote ? course.priceNote : `¥${course.price}` }}</span>
                </span>

                <!-- 右上角体系分类微签 -->
                <span class="thumb-stage-tag">
                  {{ course.categoryLabel || course.level }}
                </span>

                <!-- 右下角视频小节数与总时长 -->
                <span class="thumb-duration-pill num-tabular">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4"></polygon>
                  </svg>
                  <span>{{ course.lessons.length }} 节视频 · {{ course.totalDuration }}</span>
                </span>

                <!-- 悬浮磨砂播放按钮 -->
                <div class="thumb-play-hover">
                  <div class="play-glass-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4"></polygon>
                    </svg>
                  </div>
                </div>

                <!-- 已购课程底部内嵌极细学习进度条 -->
                <div v-if="isCourseUnlocked(course)" class="thumb-bottom-progress">
                  <div class="thumb-progress-bar" :style="{ width: getProgressPercent(course) + '%' }"></div>
                </div>
              </div>

              <!-- 卡片内容区（无负责人姓名，聚焦课程体系模块与分节视频预览） -->
              <div class="course-card-body">
                <div class="course-body-top">
                  <h3 class="course-card-title" :title="course.title">
                    「{{ course.title }}」
                  </h3>

                  <!-- 脑图核心知识模块标签矩阵（单行展示，溢出省略） -->
                  <div v-if="course.modules && course.modules.length" class="course-modules-row">
                    <span
                      v-for="mod in course.modules"
                      :key="mod"
                      class="module-tag-pill"
                    >
                      {{ mod }}
                    </span>
                    <span class="module-more-ellipsis" title="更多模块">…</span>
                  </div>

                  <!-- 视频小节微目录预览（前 2 节 + 总节数提示） -->
                  <div class="mini-lessons-box">
                    <div
                      v-for="(ls, lIdx) in course.lessons.slice(0, 2)"
                      :key="ls.id"
                      class="mini-lesson-row"
                      @click.stop="openCourseClassroom(course, ls)"
                    >
                      <span class="mini-ls-num num-tabular">0{{ lIdx + 1 }}</span>
                      <span class="mini-ls-title">{{ cleanLessonShortTitle(ls.title) }}</span>
                      <span class="mini-ls-dur num-tabular">{{ ls.duration }}</span>
                    </div>
                    <div class="mini-lessons-more num-tabular">
                      <span>含全部 {{ course.lessons.length }} 个系统视频小节</span>
                      <span>查看目录 →</span>
                    </div>
                  </div>
                </div>

                <!-- 卡片底部栏：左价格/学习状态 + 右操作微胶囊 -->
                <div class="course-card-footer num-tabular">
                  <div class="footer-left-price">
                    <template v-if="isCourseUnlocked(course)">
                      <span class="unlocked-text-badge">
                        ✓ 已购买 · 永久有效
                      </span>
                    </template>
                    <template v-else>
                      <span class="price-symbol">¥</span>
                      <span class="price-number">{{ course.price }}</span>
                      <span v-if="course.originPrice" class="price-origin">¥{{ course.originPrice }}</span>
                      <span class="learners-count">· {{ course.studentsCount }}人已学</span>
                    </template>
                  </div>

                  <div class="footer-right-action">
                    <span v-if="isCourseUnlocked(course)" class="card-action-pill is-free">
                      <span>进入学习</span>
                      <span class="pill-arrow">→</span>
                    </span>
                    <button
                      v-else
                      class="card-action-pill is-buy num-tabular"
                      @click.stop="openPurchaseModal(course)"
                    >
                      <span>¥{{ course.price }} 购买</span>
                      <span class="pill-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="clean-empty-state">
            <p class="empty-text">未找到符合筛选条件的体系课程</p>
            <button class="btn-reset-filter" @click="resetCourseFilters">重置筛选条件</button>
          </div>
        </section>
      </div>
    </div>

    <!-- ==================== 单门课程独立购买收银台弹窗 ==================== -->
    <transition name="fade">
      <div
        v-if="purchasingCourse"
        class="checkout-backdrop"
        @click.self="purchasingCourse = null"
      >
        <div class="checkout-dialog">
          <div class="checkout-top">
            <h3 class="checkout-heading">购买系统化视频课程</h3>
            <button class="btn-close-dialog" @click="purchasingCourse = null">✕</button>
          </div>

          <div class="checkout-content">
            <div class="checkout-summary-box">
              <div class="checkout-item-title">「{{ purchasingCourse.title }}」</div>
              <div class="checkout-item-sub num-tabular">
                <span>{{ purchasingCourse.categoryLabel || purchasingCourse.level }}</span>
                <span>·</span>
                <span>共 {{ purchasingCourse.lessons.length }} 节高清视频课</span>
                <span>·</span>
                <span>总时长 {{ purchasingCourse.totalDuration }}</span>
              </div>
              <div v-if="purchasingCourse.modules && purchasingCourse.modules.length" class="checkout-modules-list">
                <span v-for="m in purchasingCourse.modules" :key="m" class="checkout-mod-chip">{{ m }}</span>
              </div>
            </div>

            <div class="checkout-price-row">
              <span class="price-label">课程单独购买价格</span>
              <div class="price-numbers num-tabular">
                <span v-if="purchasingCourse.originPrice" class="orig-strike">
                  ¥{{ purchasingCourse.originPrice }}
                </span>
                <span class="final-amount">¥{{ purchasingCourse.price }}</span>
              </div>
            </div>

            <p class="checkout-rule-tip">
              课程板块内每一门课程均为独立精品体系课，需按后台配置价格单独购买。支付完成后立即解锁本课全部 {{ purchasingCourse.lessons.length }} 个视频小节，账号永久有效、支持无限次复看。
            </p>

            <div class="payment-Channel-row">
              <button
                :class="['channel-option', { selected: payMethod === 'wechat' }]"
                @click="payMethod = 'wechat'"
              >
                <span class="channel-dot"></span>
                <span>微信支付</span>
              </button>
              <button
                :class="['channel-option', { selected: payMethod === 'alipay' }]"
                @click="payMethod = 'alipay'"
              >
                <span class="channel-dot"></span>
                <span>支付宝</span>
              </button>
            </div>
          </div>

          <div class="checkout-actions">
            <button class="btn-dialog-cancel" @click="purchasingCourse = null">取消</button>
            <button class="btn-dialog-confirm num-tabular" @click="confirmPurchaseCourse">
              确认支付 ¥{{ purchasingCourse.price }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { appState, actions } from '@/stores/community';
import type { Course, CourseLesson } from '@/types';
import avatarMark from '@/assets/avatar_mark.png';
import avatarRich from '@/assets/avatar_rich.png';
import avatarJohn from '@/assets/avatar_john.png';
import avatarJerry from '@/assets/avatar_jerry.png';

defineProps<{
  initialTab?: 'column' | 'course' | 'live';
}>();

const pageRootRef = ref<HTMLElement | null>(null);

// 顶部演示状态切换：支持预览「真实初始未购态」、「演示已购2门含进度」、「演示全部已购」
const demoPurchaseMode = ref<'default_locked' | 'sample_unlocked' | 'all_unlocked'>('default_locked');

// 演示模式下模拟已购的课程 ID 集合
const sampleUnlockedIds = ['course-hk-ipo', 'course-option-beginner'];

// 判断课程是否已解锁（结合真实购买状态与顶部演示预览切换器）
const isCourseUnlocked = (course: Course): boolean => {
  if (course.isPurchased) return true;
  if (demoPurchaseMode.value === 'all_unlocked') return true;
  if (demoPurchaseMode.value === 'sample_unlocked' && sampleUnlockedIds.includes(course.id)) {
    return true;
  }
  return false;
};

// 判断小节是否已完成
const isLessonCompleted = (course: Course, lesson: CourseLesson): boolean => {
  if (lesson.completed) return true;
  if (demoPurchaseMode.value === 'sample_unlocked' && sampleUnlockedIds.includes(course.id)) {
    const idx = course.lessons.findIndex(l => l.id === lesson.id);
    return idx >= 0 && idx < 2;
  }
  return false;
};

const getCompletedCount = (course: Course): number => {
  return course.lessons.filter(l => isLessonCompleted(course, l)).length;
};

const getProgressPercent = (course: Course): number => {
  if (!course.lessons.length) return 0;
  const done = getCompletedCount(course);
  return Math.max(8, Math.round((done / course.lessons.length) * 100));
};

// 已上架课程列表
const publishedCourses = computed(() =>
  appState.courses.filter(c => c.status === 'published')
);

// 首屏「好课早知道」海报级大 Banner 轮播配置（左侧高冲击力海报 + 右侧 7 门推荐课程切换列表）
interface BannerSlideItem {
  course: Course;
  navLabel: string;
  headlineLine1: string;
  headlineLine2: string;
  slogan: string;
  accentColor: string;
  neonColor: string;
  navBgColor: string;
}

const featuredBannerSlides = computed<BannerSlideItem[]>(() => {
  const presets: Array<{
    id: string;
    navLabel: string;
    headlineLine1: string;
    headlineLine2: string;
    slogan: string;
    accentColor: string;
    neonColor: string;
    navBgColor: string;
  }> = [
    {
      id: 'course-ai-industry',
      navLabel: 'AI 产业链深度研究课',
      headlineLine1: '算力、芯片与大模型',
      headlineLine2: '全栈拆解 AI 产业链',
      slogan: '看懂算力基建与商业化落地 · 锁定核心受益标的',
      accentColor: '#10b981',
      neonColor: '#a3e635',
      navBgColor: '#2d3839'
    },
    {
      id: 'course-hk-ipo',
      navLabel: '从0开启港股打新全流程',
      headlineLine1: '招股书、基石与暗盘',
      headlineLine2: '港股打新套利实战指南',
      slogan: '系统掌握新股申购底层规则 · 规避破发陷阱',
      accentColor: '#059669',
      neonColor: '#bef264',
      navBgColor: '#283635'
    },
    {
      id: 'course-us-fundamental',
      navLabel: '美股财报与基本面估值',
      headlineLine1: '穿透三大财务报表',
      headlineLine2: '美股核心资产估值实战',
      slogan: '拆解科技巨头盈利驱动力 · 掌握机构级 DCF 与倍数定价',
      accentColor: '#2563eb',
      neonColor: '#67e8f9',
      navBgColor: '#273142'
    },
    {
      id: 'course-option-advanced',
      navLabel: '期权定价与尾部风险对冲',
      headlineLine1: '玩转 Greeks 与波动率',
      headlineLine2: '期权收租与尾部风控体系',
      slogan: '把期权变成投资组合的安全气囊与现金流增强引擎',
      accentColor: '#7c3aed',
      neonColor: '#d8b4fe',
      navBgColor: '#2f293e'
    },
    {
      id: 'course-macro',
      navLabel: '全球宏观与美联储周期',
      headlineLine1: '通胀、利率与美元流动性',
      headlineLine2: '全球大类资产宏观罗盘',
      slogan: '读懂美联储政策转向信号 · 提前布局跨市场周期拐点',
      accentColor: '#0284c7',
      neonColor: '#7dd3fc',
      navBgColor: '#263440'
    },
    {
      id: 'course-us-technical',
      navLabel: '美股技术面与量价结构',
      headlineLine1: '趋势结构、关键均线与量价',
      headlineLine2: '精准捕捉右侧交易击球区',
      slogan: '告别主观臆测 · 建立可量化、可复现的买卖点交易纪律',
      accentColor: '#0d9488',
      neonColor: '#6ee7b7',
      navBgColor: '#273837'
    },
    {
      id: 'course-portfolio-risk',
      navLabel: '全球资产配置与回撤控制',
      headlineLine1: '相关性矩阵与仓位管理',
      headlineLine2: '构建全天候抗脆弱投资组合',
      slogan: '科学控制极端行情最大回撤 · 实现长期复利稳健增长',
      accentColor: '#4f46e5',
      neonColor: '#a5b4fc',
      navBgColor: '#292c3e'
    }
  ];

  const result: BannerSlideItem[] = [];
  for (const item of presets) {
    const found = publishedCourses.value.find(c => c.id === item.id);
    if (found) {
      result.push({
        course: found,
        navLabel: item.navLabel,
        headlineLine1: item.headlineLine1,
        headlineLine2: item.headlineLine2,
        slogan: item.slogan,
        accentColor: item.accentColor,
        neonColor: item.neonColor,
        navBgColor: item.navBgColor
      });
    }
  }
  return result;
});

const bannerIndex = ref(0);
let bannerTimer: ReturnType<typeof setInterval> | null = null;

const currentBannerSlide = computed<BannerSlideItem | null>(() => {
  const list = featuredBannerSlides.value;
  if (!list.length) return null;
  const safeIdx = bannerIndex.value % list.length;
  return list[safeIdx] || list[0] || null;
});

const nextBannerSlide = () => {
  const total = featuredBannerSlides.value.length;
  if (!total) return;
  bannerIndex.value = (bannerIndex.value + 1) % total;
};

const prevBannerSlide = () => {
  const total = featuredBannerSlides.value.length;
  if (!total) return;
  bannerIndex.value = (bannerIndex.value - 1 + total) % total;
};

const goToBannerSlide = (idx: number) => {
  bannerIndex.value = idx;
};

const startBannerAutoPlay = () => {
  stopBannerAutoPlay();
  bannerTimer = setInterval(() => {
    if (!activeCourse.value && featuredBannerSlides.value.length > 1) {
      nextBannerSlide();
    }
  }, 5000);
};

const stopBannerAutoPlay = () => {
  if (bannerTimer) {
    clearInterval(bannerTimer);
    bannerTimer = null;
  }
};

const pauseBannerAutoPlay = () => {
  stopBannerAutoPlay();
};

const resumeBannerAutoPlay = () => {
  startBannerAutoPlay();
};

// 课程卡片模块标签单行省略：放不下时隐藏尾部标签，以「…」胶囊作为最后一个可见项
const refreshModuleEllipsis = () => {
  nextTick(() => {
    const rows = pageRootRef.value?.querySelectorAll<HTMLElement>('.course-modules-row');
    if (!rows) return;
    rows.forEach((row) => {
      const ellipsis = row.querySelector<HTMLElement>('.module-more-ellipsis');
      const pills = Array.from(row.querySelectorAll<HTMLElement>('.module-tag-pill'));
      pills.forEach((p) => { p.style.display = ''; });
      if (ellipsis) ellipsis.style.display = 'none';
      if (row.scrollWidth <= row.clientWidth) return; // 一行放得下，全部显示
      // 从尾部逐个隐藏，直到连同「…」胶囊能在一行内放下
      while (pills.length && row.scrollWidth > row.clientWidth) {
        pills.pop()!.style.display = 'none';
        if (ellipsis) ellipsis.style.display = '';
      }
    });
  });
};

const onWindowResize = () => {
  refreshModuleEllipsis();
};

onMounted(() => {
  startBannerAutoPlay();
  refreshModuleEllipsis();
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  stopBannerAutoPlay();
  window.removeEventListener('resize', onWindowResize);
});

// 分类计数
const foundationCount = computed(() => publishedCourses.value.filter(c => c.category === 'foundation').length);
const marketCount = computed(() => publishedCourses.value.filter(c => c.category === 'market').length);
const strategyCount = computed(() => publishedCourses.value.filter(c => c.category === 'strategy').length);
const purchasedCount = computed(() => publishedCourses.value.filter(c => isCourseUnlocked(c)).length);

// 筛选与搜索状态
const activeCategory = ref<'all' | 'foundation' | 'market' | 'strategy' | 'purchased'>('all');
const searchQuery = ref('');

const filteredCourses = computed(() => {
  const list = publishedCourses.value.filter(c => {
    if (activeCategory.value === 'foundation' && c.category !== 'foundation') return false;
    if (activeCategory.value === 'market' && c.category !== 'market') return false;
    if (activeCategory.value === 'strategy' && c.category !== 'strategy') return false;
    if (activeCategory.value === 'purchased' && !isCourseUnlocked(c)) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchMods = (c.modules || []).some(m => m.toLowerCase().includes(q));
      const matchLessons = c.lessons.some(l => l.title.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchMods && !matchLessons) return false;
    }
    return true;
  });

  return list;
});

const resetCourseFilters = () => {
  activeCategory.value = 'all';
  searchQuery.value = '';
};

const cleanLessonShortTitle = (raw: string) => {
  return raw.replace(/^第\d+[节课]：/, '');
};

// ==================== 内页：课程详情页（对标中国大学MOOC）与独立视频播放弹窗 ====================
const activeCourse = ref<Course | null>(null);

// 列表筛选或详情页切换后，重新测量模块标签省略态
watch(filteredCourses, () => {
  refreshModuleEllipsis();
});

watch(activeCourse, () => {
  refreshModuleEllipsis();
});

const activeLesson = ref<CourseLesson | null>(null);
const moocDetailTab = ref<'intro' | 'catalog' | 'reviews'>('intro');
const introSectionRef = ref<HTMLElement | null>(null);
const playerModalOpen = ref(false);

const isVideoPlaying = ref(true);
const playbackSpeed = ref(1.0);
const videoProgress = ref(28);
const simulatedTime = ref('07:45');

const activeLessonIndex = computed(() => {
  if (!activeCourse.value || !activeLesson.value) return 0;
  const idx = activeCourse.value.lessons.findIndex(l => l.id === activeLesson.value?.id);
  return idx >= 0 ? idx : 0;
});

const hasPrevLesson = computed(() => {
  if (!activeCourse.value) return false;
  return activeLessonIndex.value > 0;
});

const hasNextLesson = computed(() => {
  if (!activeCourse.value) return false;
  return activeLessonIndex.value < activeCourse.value.lessons.length - 1;
});

const prevLessonObj = computed<CourseLesson | null>(() => {
  if (!activeCourse.value || !hasPrevLesson.value) return null;
  return activeCourse.value.lessons[activeLessonIndex.value - 1] || null;
});

const nextLessonObj = computed<CourseLesson | null>(() => {
  if (!activeCourse.value || !hasNextLesson.value) return null;
  return activeCourse.value.lessons[activeLessonIndex.value + 1] || null;
});

const openCourseClassroom = (course: Course, targetLesson?: CourseLesson) => {
  activeCourse.value = course;
  activeLesson.value = targetLesson || course.lessons[0] || null;
  moocDetailTab.value = 'intro';
  playerModalOpen.value = false;
  isVideoPlaying.value = true;
  videoProgress.value = 28;
  simulatedTime.value = '07:45';
  if (pageRootRef.value) {
    pageRootRef.value.scrollTop = 0;
  }
};

const closeCourseClassroom = () => {
  playerModalOpen.value = false;
  activeCourse.value = null;
  activeLesson.value = null;
};

const switchToCatalogTab = () => {
  moocDetailTab.value = 'catalog';
  if (introSectionRef.value) {
    introSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const openVideoPlayerModal = (lesson?: CourseLesson) => {
  if (!activeCourse.value) return;
  if (!isCourseUnlocked(activeCourse.value)) {
    openPurchaseModal(activeCourse.value);
    return;
  }
  activeLesson.value = lesson || activeLesson.value || activeCourse.value.lessons[0] || null;
  isVideoPlaying.value = true;
  playerModalOpen.value = true;
};

const handleHeroVideoAction = () => {
  if (!activeCourse.value) return;
  if (isCourseUnlocked(activeCourse.value)) {
    openVideoPlayerModal(activeLesson.value || activeCourse.value.lessons[0]);
  } else {
    switchToCatalogTab();
  }
};

const handleCatalogLessonClick = (lesson: CourseLesson) => {
  if (!activeCourse.value) return;
  activeLesson.value = lesson;
  if (isCourseUnlocked(activeCourse.value)) {
    openVideoPlayerModal(lesson);
  } else {
    openPurchaseModal(activeCourse.value);
  }
};

const selectLesson = (lesson: CourseLesson) => {
  activeLesson.value = lesson;
  isVideoPlaying.value = true;
  videoProgress.value = 15;
  simulatedTime.value = '04:12';
};

const playPrevLesson = () => {
  if (prevLessonObj.value) {
    selectLesson(prevLessonObj.value);
  }
};

const playNextLesson = () => {
  if (nextLessonObj.value) {
    selectLesson(nextLessonObj.value);
  }
};

const toggleVideoPlay = () => {
  isVideoPlaying.value = !isVideoPlaying.value;
};

const seekProgress = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const pct = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
  videoProgress.value = pct;
  const totalMins = parseInt(activeLesson.value?.duration.split(':')[0] || '28', 10);
  const mins = Math.floor((pct / 100) * totalMins);
  const secs = Math.floor(((pct / 100) * totalMins * 60) % 60);
  simulatedTime.value = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const handleToggleLessonComplete = (course: Course, lesson: CourseLesson) => {
  actions.toggleCourseLessonComplete(course.id, lesson.id);
};

// 提取精炼的模块关键词（去除冗余长句，呈现清爽的视觉卡片副标题）
const extractModuleKeywords = (lessonTitle: string, modName: string): string => {
  const cleaned = cleanLessonShortTitle(lessonTitle);
  const bracketMatch = cleaned.match(/（([^）]+)）/);
  if (bracketMatch && bracketMatch[1]) {
    return bracketMatch[1].replace(/[、，]/g, ' · ');
  }
  return cleaned.replace(modName, '').replace(/^[：:·\s]+/, '');
};

// 脑图核心模块可视化卡片数据
const visualModuleCards = computed(() => {
  const course = activeCourse.value;
  if (!course) return [];
  const mods = course.modules || [];
  return mods.map((mName, idx) => {
    const matched = course.lessons.find(l => l.moduleTag === mName) || course.lessons[idx] || course.lessons[0];
    return {
      index: idx + 1,
      name: mName,
      duration: matched ? matched.duration : '25:00',
      keywords: matched ? extractModuleKeywords(matched.title, mName) : mName
    };
  });
});

const jumpToModuleLesson = (moduleName: string) => {
  if (!activeCourse.value) return;
  const target = activeCourse.value.lessons.find(l => l.moduleTag === moduleName) || activeCourse.value.lessons[0];
  if (target) {
    activeLesson.value = target;
  }
  switchToCatalogTab();
};

// 课程评价列表（根据当前课程动态生成真实学员评价）
const currentCourseReviews = computed(() => {
  const c = activeCourse.value;
  if (!c) return [];
  const firstMod = c.modules?.[0] || '核心框架';
  const secondMod = c.modules?.[1] || '实战拆解';
  const totalCount = c.lessons.length;
  return [
    {
      id: `${c.id}_rev1`,
      user: '林*远 · 家族资产配置者',
      author: '林*远 · 家族资产配置者',
      initial: '林',
      avatarBg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      tag: '已购全套课',
      date: '2026-09-24',
      completedCount: totalCount,
      content: `把《${c.title}》完整刷了两遍，尤其是「${firstMod}」与「${secondMod}」这两章，直接帮我把过去零散的投资碎片串成了完整的决策闭环，非常值得单独入手。`
    },
    {
      id: `${c.id}_rev2`,
      user: '陈*宇 · 港美股资深交易员',
      author: '陈*宇 · 港美股资深交易员',
      initial: '陈',
      avatarBg: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      tag: '体系课老学员',
      date: '2026-09-18',
      completedCount: totalCount,
      content: '没有废话和注水内容，每一小节都控制在二十多分钟的高密度精讲，图表和案例拆解极其清晰，做完复盘后再看盘面心态稳了很多。'
    },
    {
      id: `${c.id}_rev3`,
      user: '苏*宁 · 跨境理财进阶学员',
      author: '苏*宁 · 跨境理财进阶学员',
      initial: '苏',
      avatarBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      tag: '完成全部小节',
      date: '2026-09-11',
      completedCount: Math.max(1, totalCount - 1),
      content: `课程目录结构太清晰了！原本担心自己基础不够听不懂，结果从底层逻辑一路讲到实操风控，完全可以按小节循序渐进掌握。`
    }
  ];
});

// 右侧相关体系课程推荐（优先同阶段课程，补足3门）
const relatedCourses = computed(() => {
  const cur = activeCourse.value;
  if (!cur) return [];
  const sameCat = publishedCourses.value.filter(c => c.id !== cur.id && c.category === cur.category);
  const others = publishedCourses.value.filter(c => c.id !== cur.id && c.category !== cur.category);
  return [...sameCat, ...others].slice(0, 3);
});

// 右侧讲师介绍卡片数据（根据课程方向匹配主讲导师）
const currentCourseInstructor = computed(() => {
  const cur = activeCourse.value;
  if (!cur) {
    return {
      name: 'Mark',
      badge: '主讲导师',
      title: '资深宏观与策略分析师 · 12年二级市场投研经验',
      avatar: avatarMark,
      bio: '曾任头部买方机构海外策略负责人，深耕港美股一级半与二级市场规则，擅长将复杂的金融定价逻辑转化为可落地的实操框架。',
      tags: ['港美股实操', '体系化投研', '风险控制']
    };
  }
  if (cur.id.includes('option') || cur.title.includes('期权')) {
    return {
      name: 'Jerry',
      badge: '衍生品主讲',
      title: '资深美股期权交易员 · 10年量化与衍生品实战经验',
      avatar: avatarJerry,
      bio: '长期专注于美股期权定价、希腊字母风险敞口管理与波动率交易策略，擅长用直观盈亏图谱带零基础学员构建稳健衍生品工具箱。',
      tags: ['美股期权', '波动率策略', '希腊字母风控']
    };
  }
  if (cur.category === 'market') {
    return {
      name: 'Mark',
      badge: '主讲导师',
      title: '资深宏观与策略分析师 · 12年港美股投研经验',
      avatar: avatarMark,
      bio: '曾任海外对冲基金高级策略研究员，专注宏观流动性周期、美股财报建模与硬科技产业链跟踪，授课强调数据归因与预期差推演。',
      tags: ['宏观周期', '美股财报建模', '产业链研究']
    };
  }
  if (cur.category === 'strategy') {
    return {
      name: 'Rich',
      badge: '资产配置导师',
      title: '家族办公室投资总监 · 15年全球多资产配置经验',
      avatar: avatarRich,
      bio: '深耕全天候大类资产组合构建、尾部风险压力测试与跨境家庭财富架构设计，致力于帮助高净值家庭实现跨周期稳健复利。',
      tags: ['全天候组合', '尾部风险管理', '跨境财富规划']
    };
  }
  return {
    name: 'John',
    badge: '主讲导师',
    title: '资深港美股交易导师 · 11年跨境多资产实战经验',
    avatar: avatarJohn,
    bio: '熟悉港美股交易制度、打新套利机制与常见金融产品底层结构，擅长拆解各类金融工具的真实收益来源与隐性风险边界。',
    tags: ['港股打新实操', '金融产品拆解', '交易制度解析']
  };
});

// ==================== 单门课程独立购买收银台 ====================
const purchasingCourse = ref<Course | null>(null);
const payMethod = ref<'wechat' | 'alipay'>('wechat');

const openPurchaseModal = (course: Course) => {
  purchasingCourse.value = course;
};

const confirmPurchaseCourse = () => {
  if (!purchasingCourse.value) return;
  const target = purchasingCourse.value;
  actions.purchaseCourse(target.id);
  purchasingCourse.value = null;
  activeCourse.value = target;
  activeLesson.value = activeLesson.value || target.lessons[0] || null;
};
</script>

<style scoped>
/* 整体容器：隐藏右侧滚动条占位槽，避免在浅灰详情页右侧露出白色滚动条底槽 */
.course-page-root {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.course-page-root:has(.mooc-course-detail-view) {
  background: #f5f7fa;
}

.course-page-root::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* ==================== 1. 顶部栏（清爽通透 + 独立付费规则微胶囊） ==================== */
.course-top-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px 36px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid #f1f5f9;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.course-page-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.3px;
}

.top-bar-divider {
  width: 1px;
  height: 13px;
  background: #cbd5e1;
}

.course-page-subtitle {
  font-size: 12.5px;
  color: #64748b;
  font-weight: 400;
}

.course-rule-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2.5px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #92400e;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1px;
  box-shadow: 0 1px 2px rgba(217, 119, 6, 0.06);
}

.course-rule-badge svg {
  color: #d97706;
  flex-shrink: 0;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-scene-switcher {
  display: inline-flex;
  align-items: center;
  height: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 8px 0 11px;
  background: #f8fafc;
  box-shadow: inset 0 1px 0 #ffffff, 0 1px 2px rgba(15, 23, 42, 0.03);
  transition: border-color 0.15s ease, background 0.15s ease;
}

.demo-scene-switcher:hover {
  border-color: #cbd5e1;
  background: #ffffff;
}

.scene-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  margin-right: 7px;
  flex-shrink: 0;
}

.scene-label {
  font-size: 11.5px;
  font-weight: 500;
  color: #64748b;
  margin-right: 6px;
  padding-right: 6px;
  border-right: 1px solid #e2e8f0;
}

.scene-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.scene-select {
  appearance: none;
  -webkit-appearance: none;
  border: none;
  background: transparent;
  color: #0f172a;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 18px 2px 2px;
  cursor: pointer;
}

.scene-select:focus {
  box-shadow: none;
}

.select-chevron {
  position: absolute;
  right: 2px;
  pointer-events: none;
  color: #64748b;
}

/* ==================== 主体内容容器 ==================== */
.course-content-body {
  padding: 26px 36px 56px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ==================== 首屏：精选课程大 Banner（左沉浸式主视觉画布 + 右侧推荐课程切换栏） ==================== */
.featured-banner-section {
  width: 100%;
}

.mooc-poster-banner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 306px;
  gap: 16px;
  align-items: stretch;
  min-height: 312px;
}

/* 左侧：全画幅沉浸式主视觉画布（克制、干净、有层次） */
.poster-stage-left {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: stretch;
  cursor: pointer;
}

/* 右半侧高清课程封面底层 + 多段平滑暗色渐变融合遮罩 */
.poster-backdrop-media {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.poster-backdrop-img {
  position: absolute;
  top: 0;
  right: 0;
  width: 64%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.poster-stage-left:hover .poster-backdrop-img {
  transform: scale(1.03);
}

.poster-backdrop-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 18%, rgba(16, 185, 129, 0.15), transparent 48%),
    linear-gradient(
      90deg,
      #0f172a 0%,
      #0f172a 38%,
      rgba(15, 23, 42, 0.92) 54%,
      rgba(15, 23, 42, 0.56) 76%,
      rgba(15, 23, 42, 0.24) 100%
    );
}

/* 左侧前景主内容区 */
.poster-editorial-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 560px;
  padding: 28px 34px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.poster-top-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.poster-eyebrow-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.poster-featured-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-size: 11.5px;
  font-weight: 700;
}

.featured-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.poster-eyebrow-meta {
  font-size: 12.5px;
  color: #94a3b8;
  font-weight: 500;
}

.poster-main-title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.28;
  letter-spacing: -0.3px;
}

.poster-subtitle {
  margin: 0;
  font-size: 13.5px;
  color: #cbd5e1;
  line-height: 1.62;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poster-modules-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 2px;
}

.poster-mod-pill {
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

/* 底部行动栏 */
.poster-bottom-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-top: 6px;
  flex-wrap: wrap;
}

.btn-poster-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 20px;
  border-radius: 8px;
  border: none;
  background: #10b981;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
}

.poster-stage-left:hover .btn-poster-primary,
.btn-poster-primary:hover {
  background: #059669;
  transform: translateY(-1px);
}

.poster-price-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.poster-price-now {
  font-size: 21px;
  font-weight: 800;
  color: #ffffff;
}

.poster-price-old {
  font-size: 12.5px;
  color: #64748b;
  text-decoration: line-through;
}

.poster-trial-badge {
  font-size: 11.5px;
  font-weight: 600;
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.28);
  padding: 2px 8px;
  border-radius: 5px;
  transform: translateY(-2px);
}

.poster-unlocked-badge {
  font-size: 12px;
  font-weight: 600;
  color: #34d399;
}

/* 右侧：深色悬浮推荐课程列表切换栏 */
.poster-nav-right {
  display: flex;
  align-items: stretch;
}

.poster-nav-box {
  width: 100%;
  border-radius: 14px;
  background:
    radial-gradient(circle at 92% 8%, rgba(16, 185, 129, 0.14), transparent 52%),
    linear-gradient(165deg, #172133 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 13px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 顶部标题与进度计数栏 */
.poster-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 9px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
}

.nav-header-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 0.3px;
}

.nav-header-counter {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  font-size: 11.5px;
  color: #64748b;
  font-weight: 600;
}

.counter-active {
  color: #34d399;
  font-weight: 800;
}

.counter-slash {
  opacity: 0.5;
  margin: 0 1px;
}

/* 推荐课程列表容器 */
.poster-nav-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2px;
}

.poster-nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: rgba(226, 232, 240, 0.72);
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.18s ease;
}

.poster-nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-item-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.nav-item-idx {
  width: 18px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(148, 163, 184, 0.52);
  text-align: center;
  flex-shrink: 0;
  transition: color 0.18s ease;
}

.nav-item-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.nav-item-meta {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.5);
  transition: all 0.18s ease;
}

/* 激活态：左侧翠绿光条 + 磨砂微光底色 + 右侧胶囊提示 */
.poster-nav-item.active {
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  background: linear-gradient(
    90deg,
    rgba(16, 185, 129, 0.2) 0%,
    rgba(16, 185, 129, 0.05) 100%
  );
  border-color: rgba(16, 185, 129, 0.32);
}

.poster-nav-item.active::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  border-radius: 99px;
  background: #10b981;
}

.poster-nav-item.active .nav-item-idx {
  color: #34d399;
  font-size: 10px;
}

.poster-nav-item.active .nav-item-meta {
  color: #34d399;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.28);
  padding: 1px 7px;
  border-radius: 999px;
}

@media (max-width: 960px) {
  .mooc-poster-banner {
    grid-template-columns: 1fr;
  }
}


/* ==================== 课程画廊工具栏（一体式分段槽 + 筛选搜索） ==================== */
.course-gallery-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 26px;
}

.gallery-toolbar-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}

.gallery-toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.clean-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.clean-select {
  appearance: none;
  -webkit-appearance: none;
  height: 36px;
  padding: 0 30px 0 12px;
  border-radius: 7px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #334155;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
}

.clean-select:focus {
  border-color: #cbd5e1;
}

.clean-select-chevron {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: #64748b;
}

.gallery-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.clean-search-wrap {
  display: flex;
  align-items: center;
  width: 216px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 11px;
  background: #f8fafc;
  transition: all 0.15s ease;
}

.clean-search-wrap:hover {
  background: #ffffff;
  border-color: #cbd5e1;
}

.clean-search-wrap:focus-within {
  background: #ffffff;
  border-color: #0f172a;
  box-shadow: none;
}

.search-svg {
  color: #94a3b8;
  margin-right: 7px;
  flex-shrink: 0;
}

.clean-search-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 12.5px;
  color: #0f172a;
  padding: 0;
}

.clean-search-input:focus {
  box-shadow: none;
}

.clean-search-input::placeholder {
  color: #94a3b8;
}

.btn-clear-q {
  background: transparent;
  color: #94a3b8;
  font-size: 11px;
}

/* ==================== 3列精装课程卡片网格 ==================== */
.course-catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 24px;
  row-gap: 28px;
  align-items: stretch;
}

.editorial-course-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.22s ease, transform 0.22s ease;
}

.editorial-course-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

/* 16:9 课程视频封面画框 */
.course-thumb-box {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #0f172a;
  flex-shrink: 0;
}

.cover-scrim-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.24) 0%,
    transparent 36%,
    transparent 58%,
    rgba(15, 23, 42, 0.62) 100%
  );
  pointer-events: none;
}

.cover-img-fill {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.editorial-course-card:hover .cover-img-fill {
  transform: scale(1.045);
}

/* 左上角黑曜石磨砂角标 */
.thumb-frosted-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #f8fafc;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

/* 右上角阶段微签 */
.thumb-stage-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  color: #0f172a;
  font-size: 10.5px;
  font-weight: 600;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-emerald {
  background: #34d399;
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.65);
}

.dot-amber {
  background: #fbbf24;
  box-shadow: 0 0 6px rgba(251, 191, 36, 0.5);
}

/* 右下角小节数与总时长胶囊 */
.thumb-duration-pill {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8.5px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
  color: #f8fafc;
  font-size: 11px;
  font-weight: 500;
}

.thumb-duration-pill svg {
  opacity: 0.9;
}

.thumb-play-hover {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: rgba(15, 23, 42, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.22s ease;
}

.editorial-course-card:hover .thumb-play-hover {
  opacity: 1;
}

.play-glass-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 2px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
  transform: scale(0.92);
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.editorial-course-card:hover .play-glass-btn {
  transform: scale(1);
}

.thumb-bottom-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.25);
  z-index: 4;
}

.thumb-progress-bar {
  height: 100%;
  background: #10b981;
}

/* 卡片下半部主体 */
.course-card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 16px 18px 15px;
}

.course-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  margin: 0 0 10px 0;
  letter-spacing: -0.2px;
  transition: color 0.15s ease;
}

.editorial-course-card:hover .course-card-title {
  color: #059669;
}

/* 脑图核心模块胶囊矩阵（单行，溢出省略） */
.course-modules-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 5px;
  margin-bottom: 13px;
  overflow: hidden;
}

.module-tag-pill {
  font-size: 11px;
  font-weight: 500;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 2px 7.5px;
  border-radius: 5px;
  line-height: 1.4;
  flex-shrink: 0;
}

.module-more-ellipsis {
  font-size: 11px;
  font-weight: 500;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 2px 7.5px;
  border-radius: 5px;
  line-height: 1.4;
  flex-shrink: 0;
  display: none;
}

/* 卡片内嵌分节视频微预览 */
.mini-lessons-box {
  background: #f8fafc;
  border: 1px solid #eef2f6;
  border-radius: 9px;
  padding: 8px 11px;
  margin-bottom: 14px;
}

.mini-lesson-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 0;
  font-size: 12px;
  border-bottom: 1px dashed #e2e8f0;
}

.mini-lesson-row:hover .mini-ls-title {
  color: #059669;
}

.mini-ls-num {
  font-size: 10.5px;
  font-weight: 700;
  color: #10b981;
  flex-shrink: 0;
}

.mini-ls-title {
  flex: 1;
  color: #334155;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
}

.mini-ls-dur {
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
}

.mini-lessons-more {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

/* 卡片底栏：独立定价与购买微胶囊 */
.course-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.footer-left-price {
  display: flex;
  align-items: baseline;
  gap: 3px;
  min-width: 0;
}

.price-symbol {
  font-size: 12.5px;
  font-weight: 700;
  color: #0f172a;
}

.price-number {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.price-origin {
  font-size: 11.5px;
  color: #94a3b8;
  text-decoration: line-through;
  margin-left: 3px;
}

.learners-count {
  font-size: 11.5px;
  color: #94a3b8;
  margin-left: 3px;
  white-space: nowrap;
}

.unlocked-text-badge {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
}

.card-action-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.18s ease;
  flex-shrink: 0;
}

.card-action-pill .pill-arrow {
  font-size: 11px;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.editorial-course-card:hover .card-action-pill .pill-arrow {
  transform: translateX(2px);
}

.card-action-pill.is-free {
  color: #059669;
  background: #ecfdf5;
  border: 1px solid rgba(16, 185, 129, 0.24);
}

.editorial-course-card:hover .card-action-pill.is-free {
  background: #d1fae5;
}

.card-action-pill.is-buy {
  color: #ffffff;
  background: #0f172a;
  border: 1px solid #0f172a;
  cursor: pointer;
}

.editorial-course-card:hover .card-action-pill.is-buy,
.card-action-pill.is-buy:hover {
  background: #059669;
  border-color: #059669;
}

.clean-empty-state {
  padding: 48px 20px;
  text-align: center;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  color: #94a3b8;
}

.empty-text {
  font-size: 13.5px;
  margin-bottom: 12px;
}

.btn-reset-filter {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  font-size: 12.5px;
  border-radius: 6px;
}

/* ==================== 内页：课程详情页（深度对标中国大学MOOC标准详情结构） ==================== */
.mooc-course-detail-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f5f7fa;
}

/* 1. 顶部面包屑导航栏 */
.mooc-bread-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 36px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #ebedf0;
}

.bread-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.btn-back-catalog {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  margin-left: -8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-back-catalog:hover {
  color: #00a86b;
  background: #f0fdf7;
}

.bread-sep {
  color: #cbd5e1;
  font-size: 12px;
}

.bread-cat {
  color: #64748b;
}

.bread-current {
  color: #0f172a;
  font-weight: 600;
}

.bread-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 2. 首屏商品头图信息区（对标 icourse163 .course-head-container：左封面 + 右报名卡） */
.mooc-hero-section {
  background: #ffffff;
  border-bottom: 1px solid #ebedf0;
  padding: 28px 36px 32px;
}

.mooc-hero-card {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  gap: 32px;
}

/* 左侧 16:9 课程封面 + 悬浮视频播放胶囊 */
.mooc-face-img {
  width: 460px;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  background: #0f172a;
  cursor: pointer;
}

.mooc-cover-pic {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.mooc-face-img:hover .mooc-cover-pic {
  transform: scale(1.04);
}

.mooc-face-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.12) 0%,
    rgba(15, 23, 42, 0.26) 50%,
    rgba(15, 23, 42, 0.82) 100%
  );
  z-index: 1;
}

/* 居中半透明胶囊按钮（对标中国大学MOOC .course-try-play） */
.mooc-try-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 22px 0 9px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.74);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mooc-face-img:hover .mooc-try-play-btn {
  background: rgba(0, 168, 107, 0.92);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, calc(-50% - 2px));
}

.play-triangle-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #00cc7e;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mooc-face-img:hover .play-triangle-icon {
  background: #ffffff;
  color: #00a86b;
}

.try-play-text {
  letter-spacing: 0.2px;
}

.mooc-face-bottom-meta {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

/* 右侧课程标题、灰底规格框、价格与报名转化区（对标 .c-right） */
.mooc-c-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mooc-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.mooc-level-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: #00a86b;
  background: #e6f9f1;
  border: 1px solid #b8f0d8;
  padding: 3px 10px;
  border-radius: 5px;
  flex-shrink: 0;
}

.mooc-course-title {
  font-size: 23px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.mooc-course-subdesc {
  font-size: 13.5px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 灰底课程规格与核心模块框（对标 #j-course-term） */
.mooc-term-panel {
  background: #f8f9fb;
  border: 1px solid #ebedf2;
  border-radius: 8px;
  padding: 13px 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.term-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12.5px;
  line-height: 1.5;
}

.term-label {
  color: #94a3b8;
  font-weight: 600;
  flex-shrink: 0;
}

.term-modules-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.term-mod-pill {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  background: #ffffff;
  border: 1px solid #dce2ec;
  padding: 2px 9px;
  border-radius: 4px;
}

.term-val {
  color: #475569;
  font-weight: 500;
}

/* 底部价格与立即参加/购买转化栏（对标 .price-join） */
.mooc-price-join-bar {
  margin-top: auto;
}

.locked-hero-state,
.unlocked-hero-state {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mooc-price-box {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.price-curr {
  font-size: 16px;
  font-weight: 800;
  color: #ff5226;
}

.price-main {
  font-size: 30px;
  font-weight: 800;
  color: #ff5226;
  line-height: 1;
  letter-spacing: -0.5px;
  margin-right: 4px;
}

.price-old {
  font-size: 13.5px;
  color: #94a3b8;
  text-decoration: line-through;
  margin-right: 8px;
}

.price-rule-pill {
  display: inline-flex;
  align-items: center;
  font-size: 11.5px;
  font-weight: 600;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  padding: 2.5px 9px;
  border-radius: 4px;
  transform: translateY(-3px);
}

.unlocked-left-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.unlocked-check-pill {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #00a86b;
  background: #e6f9f1;
  border: 1px solid #b8f0d8;
  padding: 3px 10px;
  border-radius: 6px;
}

.unlocked-progress-text {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.hero-cta-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-mooc-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 28px;
  border-radius: 22px;
  border: none;
  background: linear-gradient(90deg, #ff7a45 0%, #ff5226 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-mooc-primary:hover {
  transform: translateY(-1px);
}

.btn-mooc-primary.is-green {
  background: linear-gradient(90deg, #00cc7e 0%, #00a86b 100%);
}

.btn-mooc-primary.is-green:hover {
  opacity: 0.94;
}

.btn-mooc-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 20px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-mooc-outline:hover {
  border-color: #00a86b;
  color: #00a86b;
  background: #f0fdf7;
}

.join-num-text {
  font-size: 12.5px;
  color: #94a3b8;
  margin-left: 4px;
}

/* ==================== 3. 下方详情主体双栏区（左 Tab 白卡 + 右机构与关联推荐侧栏） ==================== */
.mooc-intro-section {
  padding: 24px 36px 56px;
}

.mooc-intro-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

/* 左侧主白卡（对标 .main-container） */
.mooc-main-container {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #ebedf0;
  padding: 0 32px 36px;
}

/* 经典绿标下划线 Tab 导航栏（课程介绍 | 课程目录 | 课程评价） */
.mooc-tab-header {
  display: flex;
  align-items: center;
  gap: 36px;
  border-bottom: 1px solid #ebedf0;
  margin-bottom: 28px;
}

.mooc-tab-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 20px 2px 16px;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: color 0.15s ease;
}

.mooc-tab-item:hover {
  color: #0f172a;
}

.mooc-tab-item.cur {
  color: #00a86b;
  font-weight: 700;
}

.mooc-tab-item.cur::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: #00cc7e;
  border-radius: 3px;
}

.try-see-tip {
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(90deg, #ff9a3c 0%, #ff6b2b 100%);
  padding: 1.5px 8px;
  border-radius: 10px 10px 10px 2px;
  line-height: 1.3;
}

.comment-count {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

/* -------------------- Tab 1：课程介绍（纯正富文本排版，无多余嵌套卡片） -------------------- */
.mooc-richtext-content {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  color: #334155;
  font-size: 14.5px;
  line-height: 1.85;
  word-break: break-word;
}

.mooc-richtext-content blockquote {
  margin: 0 0 24px 0;
  padding: 14px 18px;
  background: #f8fafc;
  border-left: 4px solid #00cc7e;
  border-radius: 0 8px 8px 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.75;
}

.mooc-richtext-content blockquote p {
  margin: 0;
}

.mooc-richtext-content h3 {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 26px 0 12px 0;
  line-height: 1.4;
}

.mooc-richtext-content p {
  margin: 0 0 14px 0;
  color: #334155;
}

.mooc-richtext-content strong {
  color: #0f172a;
  font-weight: 600;
}

.mooc-richtext-content ul {
  margin: 0 0 18px 0;
  padding-left: 20px;
}

.mooc-richtext-content li {
  margin-bottom: 8px;
  color: #334155;
  line-height: 1.75;
}

.mooc-richtext-content figure,
.mooc-richtext-content .richtext-figure {
  width: 100%;
  max-width: 100%;
  margin: 20px 0 24px 0;
  padding: 0;
  text-align: center;
  box-sizing: border-box;
}

.mooc-richtext-content img,
.mooc-richtext-content :deep(img),
.mooc-richtext-content .richtext-figure img {
  width: 100%;
  max-width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  box-sizing: border-box;
}

.mooc-richtext-content figcaption,
.mooc-richtext-content .richtext-figure figcaption {
  margin-top: 8px;
  font-size: 12.5px;
  color: #94a3b8;
}

/* -------------------- Tab 2：课程目录（全页唯一的视频小节列表） -------------------- */
.mooc-chapter-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chapter-summary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 18px;
  border-radius: 10px;
  background: #f8f9fb;
  border: 1px solid #ebedf0;
}

.chapter-summary-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.chapter-main-label {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
}

.chapter-sub-count {
  font-size: 12.5px;
  color: #64748b;
}

.chapter-unlock-status {
  font-size: 12.5px;
  font-weight: 600;
}

.chapter-unlock-status.is-open {
  color: #00a86b;
}

.chapter-unlock-status.is-locked {
  color: #b45309;
}

.chapter-lessons-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chapter-lesson-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #ebedf0;
  cursor: pointer;
  transition: all 0.18s ease;
}

.chapter-lesson-row:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateX(2px);
}

.chapter-lesson-row.active {
  background: #f0fdf7;
  border-color: #86efac;
}

.chapter-row-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.chapter-ls-num {
  font-size: 12.5px;
  font-weight: 800;
  color: #00a86b;
  background: #e6f9f1;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-top: 2px;
}

.chapter-video-icon {
  color: #64748b;
  margin-top: 5px;
  flex-shrink: 0;
}

.chapter-ls-texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.chapter-ls-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chapter-ls-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
}

.chapter-mod-tag {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
}

.chapter-ls-desc {
  font-size: 12.5px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-row-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.chapter-ls-duration {
  font-size: 12.5px;
  color: #94a3b8;
}

.btn-chapter-play {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-chapter-play.is-unlocked {
  background: #e6f9f1;
  color: #00a86b;
}

.chapter-lesson-row:hover .btn-chapter-play.is-unlocked {
  background: #00a86b;
  color: #ffffff;
}

.btn-chapter-play.is-locked {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #b45309;
}

/* -------------------- Tab 3：课程评价 -------------------- */
.mooc-comment-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rating-overview-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding: 20px 24px;
  border-radius: 12px;
  background: #f8f9fb;
  border: 1px solid #ebedf0;
}

.rating-score-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.big-score {
  font-size: 36px;
  font-weight: 800;
  color: #ff7a00;
  line-height: 1;
}

.stars-and-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gold-stars {
  color: #ff9a00;
  font-size: 14px;
  letter-spacing: 2px;
}

.rating-sub {
  font-size: 12px;
  color: #64748b;
}

.rating-tags-right {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.rating-tag-pill {
  font-size: 12.5px;
  color: #334155;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 5px 12px;
  border-radius: 999px;
}

.reviews-list-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.review-card-item {
  padding: 18px 20px;
  border-radius: 10px;
  border: 1px solid #ebedf0;
  background: #ffffff;
}

.review-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviewer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00cc7e 0%, #059669 100%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reviewer-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

.reviewer-badge {
  font-size: 11px;
  font-weight: 600;
  color: #00a86b;
  background: #e6f9f1;
  padding: 2px 7px;
  border-radius: 4px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-stars {
  color: #ff9a00;
  font-size: 12px;
  letter-spacing: 1px;
}

.review-date {
  font-size: 12px;
  color: #94a3b8;
}

.review-content {
  font-size: 13.5px;
  color: #334155;
  line-height: 1.65;
  margin: 0;
}

/* ==================== 右侧常驻侧边栏（机构出品 + 相关体系课推荐） ==================== */
.mooc-side-col {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 64px;
}

.mooc-side-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #ebedf0;
  padding: 20px;
}

.mooc-side-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
  padding-left: 10px;
  border-left: 3px solid #00cc7e;
  line-height: 1.2;
}

/* 讲师介绍卡片 */
.instructor-profile-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.instructor-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e6f9f1;
  flex-shrink: 0;
}

.instructor-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.instructor-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.instructor-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.instructor-role-pill {
  font-size: 11px;
  font-weight: 600;
  color: #00a86b;
  background: #e6f9f1;
  padding: 1.5px 7px;
  border-radius: 4px;
}

.instructor-title {
  font-size: 12px;
  color: #64748b;
  line-height: 1.35;
}

.instructor-bio {
  font-size: 12.5px;
  color: #475569;
  line-height: 1.65;
  margin: 0 0 14px 0;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.instructor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.instructor-tags span {
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 3px 9px;
  border-radius: 6px;
}

/* 相关课程推荐列表 */
.related-courses-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.related-course-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding: 6px;
  margin: -6px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.related-course-item:hover {
  background: #f8fafc;
}

.related-thumb {
  width: 104px;
  height: 62px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.related-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.related-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
}

.related-price {
  color: #ff5226;
  font-weight: 700;
}

/* ==================== 沉浸式视频播放剧场弹窗 ==================== */
.player-theater-backdrop {
  position: fixed;
  inset: 0;
  z-index: 140;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.player-theater-dialog {
  width: 1080px;
  max-width: 96vw;
  background: #0f172a;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.theater-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #1e293b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.theater-top-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.theater-course-badge {
  font-size: 11.5px;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.16);
  padding: 3px 9px;
  border-radius: 4px;
}

.theater-lesson-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #f8fafc;
}

.btn-close-theater {
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e2e8f0;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.btn-close-theater:hover {
  background: rgba(255, 255, 255, 0.2);
}

.theater-body-grid {
  display: flex;
  height: 520px;
}

.theater-video-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #090d16;
}

.video-stage-box {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #090d16;
}

.player-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.player-backdrop-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.38;
  transition: opacity 0.3s ease;
}

.player-backdrop-img.is-playing {
  opacity: 0.26;
}

.player-top-strip {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
}

.playing-lesson-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 4px 12px;
  border-radius: 999px;
}

.wave-bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 10px;
}

.wave-bars i {
  display: block;
  width: 2px;
  background: #10b981;
  border-radius: 1px;
  animation: soundWave 1.1s ease-in-out infinite;
}

.wave-bars.paused i {
  animation-play-state: paused;
}

.wave-bars i:nth-child(1) { height: 5px; animation-delay: 0s; }
.wave-bars i:nth-child(2) { height: 10px; animation-delay: 0.2s; }
.wave-bars i:nth-child(3) { height: 7px; animation-delay: 0.4s; }

@keyframes soundWave {
  0%, 100% { transform: scaleY(0.45); }
  50% { transform: scaleY(1); }
}

.brand-watermark {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.42);
}

.player-center-stage {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-circle-play {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.player-control-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.94) 100%);
  color: #f8fafc;
}

.ctrl-icon-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ctrl-timecode {
  font-size: 12px;
  color: #cbd5e1;
}

.ctrl-timeline {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 99px;
  cursor: pointer;
  overflow: hidden;
}

.ctrl-timeline-fill {
  height: 100%;
  background: #00cc7e;
}

.ctrl-speed-group {
  display: flex;
  gap: 4px;
}

.speed-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 11.5px;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
}

.speed-btn.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.16);
  font-weight: 600;
}

.theater-bottom-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 18px;
  background: #162032;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.theater-summary-text {
  font-size: 12.5px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.theater-btns-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-theater-step {
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-theater-step:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-mark-complete {
  padding: 6px 14px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-mark-complete.completed {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #34d399;
}

.theater-playlist-col {
  width: 300px;
  background: #1e293b;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.theater-playlist-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-size: 13.5px;
  font-weight: 700;
  color: #f8fafc;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.theater-playlist-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.theater-pl-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  transition: background 0.15s ease;
}

.theater-pl-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.theater-pl-item.active {
  background: rgba(0, 204, 126, 0.16);
  color: #34d399;
}

.tpl-num {
  font-size: 12px;
  font-weight: 700;
  opacity: 0.8;
  margin-top: 1px;
}

.tpl-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tpl-title {
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tpl-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  opacity: 0.65;
}

/* ==================== 单门课程购买收银台弹窗 ==================== */
.checkout-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
  padding: 20px;
}

.checkout-dialog {
  width: 440px;
  max-width: 94vw;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 36px -8px rgba(15, 23, 42, 0.22);
  overflow: hidden;
}

.checkout-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.checkout-heading {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-close-dialog {
  background: transparent;
  color: #94a3b8;
  font-size: 14px;
}

.checkout-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkout-summary-box {
  padding: 13px 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.checkout-item-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  margin-bottom: 5px;
}

.checkout-item-sub {
  display: flex;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.checkout-modules-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.checkout-mod-chip {
  font-size: 11px;
  color: #475569;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 1.5px 7px;
  border-radius: 4px;
}

.checkout-price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.price-label {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.price-numbers {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.orig-strike {
  font-size: 12px;
  color: #94a3b8;
  text-decoration: line-through;
}

.final-amount {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}

.checkout-rule-tip {
  font-size: 12px;
  color: #64748b;
  line-height: 1.55;
  margin: 0;
}

.payment-Channel-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.channel-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  background: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
}

.channel-option.selected {
  border-color: #0f172a;
  color: #0f172a;
  font-weight: 600;
}

.channel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
}

.channel-option.selected .channel-dot {
  background: #10b981;
  border-color: #10b981;
}

.checkout-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
}

.btn-dialog-cancel {
  padding: 8px 16px;
  border-radius: 7px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 13px;
}

.btn-dialog-confirm {
  padding: 8px 18px;
  border-radius: 7px;
  background: #0f172a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
}

.btn-dialog-confirm:hover {
  background: #059669;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
