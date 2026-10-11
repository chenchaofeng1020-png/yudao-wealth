<template>
  <div class="live-page-root" ref="pageRootRef">
    <!-- ==================== 视图 A：回放详情与 AI 纪要内页 ==================== -->
    <div v-if="activeReplay" class="replay-detail-view animate-fade-in">
      <header class="detail-nav-bar">
        <button class="btn-back-list" @click="closeReplayDetail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>返回直播</span>
        </button>
      </header>

      <div class="detail-main-grid">
        <div class="detail-primary-col">
          <!-- 16:9 播放器或付费墙容器 -->
          <div ref="videoStageRef" class="video-stage-box">
            <div v-if="canWatchReplay(activeReplay)" class="player-canvas">
              <img
                :src="activeReplay.cover"
                :alt="activeReplay.title"
                class="player-backdrop-img"
                :class="{ 'is-playing': isVideoPlaying }"
              />

              <div class="player-center-stage" @click="toggleVideoPlay">
                <button class="btn-circle-play" :title="isVideoPlaying ? '暂停' : '播放'">
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
                  {{ simulatedTime }} / {{ activeReplay.recordDuration || '01:38:00' }}
                </span>
                <div class="ctrl-timeline" @click="seekProgress($event)">
                  <div class="ctrl-timeline-fill" :style="{ width: videoProgress + '%' }"></div>
                </div>
                <div class="ctrl-speed-wrap">
                  <button class="speed-toggle-btn" @click="isSpeedMenuOpen = !isSpeedMenuOpen">
                    {{ playbackSpeed === 1 ? '倍速' : playbackSpeed + 'x' }}
                  </button>
                  <div v-if="isSpeedMenuOpen" class="speed-menu-pop">
                    <button
                      v-for="sp in [1.0, 1.25, 1.5, 2.0]"
                      :key="sp"
                      :class="['speed-menu-item', { active: playbackSpeed === sp }]"
                      @click="playbackSpeed = sp; isSpeedMenuOpen = false"
                    >
                      {{ sp }}x
                    </button>
                  </div>
                </div>
                <button class="ctrl-icon-btn" title="全屏观看" @click="toggleFullscreen">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                    <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 未解锁：克制的居中付费引导 -->
            <div v-else class="locked-stage-canvas">
              <img :src="activeReplay.cover" :alt="activeReplay.title" class="locked-backdrop-img" />
              <div class="locked-editorial-box">
                <div class="locked-icon-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h4 class="locked-title">
                  {{
                    isWithin7Days(activeReplay)
                      ? '本场回放处于上架 7 天内，VIP 会员免费观看'
                      : '本场回放上架已超 7 天，需单独购买解锁'
                  }}
                </h4>
                <p class="locked-desc">
                  {{
                    isWithin7Days(activeReplay)
                      ? '开通星球会员即可免费畅享每周实时直播与 7 天内新上架回放，或按单场价格直接购买。'
                      : '直播回放上架 7 天内会员免费，超过 7 天后支持单场购买，解锁后可永久回看视频与完整纪要。'
                  }}
                </p>
                <div class="locked-btn-group">
                  <button
                    v-if="isWithin7Days(activeReplay) && !hasMemberPrivilege"
                    class="btn-solid-green"
                    @click="actions.requireVip('开通会员即可免费观看 7 天内上架的直播回放')"
                  >
                    开通会员免费看
                  </button>
                  <button
                    :class="isWithin7Days(activeReplay) && !hasMemberPrivilege ? 'btn-ghost-light' : 'btn-solid-green'"
                    @click="openPurchaseModal(activeReplay)"
                  >
                    ¥{{ activeReplay.replayPrice || 49 }} 单独购买本场
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 标题与主讲人信息 -->
          <div class="detail-article-header">
            <h1 class="detail-headline">{{ cleanTitle(activeReplay.title) }}</h1>
            <div class="detail-author-row">
              <img :src="activeReplay.creatorAvatar" :alt="activeReplay.creator" class="detail-avatar" />
              <div class="detail-author-meta">
                <div class="detail-author-name">{{ activeReplay.creator }}</div>
                <div class="detail-author-sub num-tabular">
                  <span>{{ activeReplay.creatorTitle }}</span>
                  <span class="dot-sep">·</span>
                  <span>录制于 {{ activeReplay.scheduledStartTime }}</span>
                  <span class="dot-sep">·</span>
                  <span>时长 {{ activeReplay.recordDuration || '1小时38分钟' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 会议纪要（Markdown 富文本） -->
          <div class="detail-minutes-section">
            <div class="minutes-section-head">
              <h3 class="minutes-section-title">会议纪要</h3>
            </div>

            <blockquote class="minutes-summary-quote">
              {{ activeReplay.summary }}
            </blockquote>

            <div
              v-if="activeReplay.minutesMarkdown"
              class="minutes-doc-body"
              :class="{ 'is-locked-blur': !canWatchReplay(activeReplay) }"
              v-html="renderMinutes(activeReplay.minutesMarkdown)"
            ></div>

            <div v-if="!canWatchReplay(activeReplay)" class="minutes-paywall-card">
              <div class="paywall-card-inner">
                <div class="paywall-card-title">解锁本场完整回放与全部投研纪要</div>
                <p class="paywall-card-sub">
                  包含 {{ activeReplay.recordDuration || '1小时38分钟' }} 高清实盘推演录播及完整会议纪要，购买后永久有效
                </p>
                <div class="paywall-card-btns">
                  <button
                    v-if="isWithin7Days(activeReplay) && !hasMemberPrivilege"
                    class="btn-primary-action"
                    @click="actions.requireVip('开通会员即可免费观看 7 天内上架的直播回放')"
                  >
                    开通会员免费看
                  </button>
                  <button class="btn-dark-action" @click="openPurchaseModal(activeReplay)">
                    <span>单独购买本场</span>
                    <span class="btn-sep">|</span>
                    <span class="num-tabular">¥{{ activeReplay.replayPrice || 49 }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧信息与同栏回放列表 -->
        <aside class="detail-side-col">
          <div class="side-card">
            <div class="side-card-label">场次权益说明</div>

            <template v-if="activeReplay.isPurchased">
              <div class="access-state-title is-free">已购买 · 永久有效</div>
              <p class="access-state-desc">您已单独解锁本场回放，支持不限次数观看视频与查阅纪要。</p>
            </template>

            <template v-else-if="isWithin7Days(activeReplay)">
              <div class="access-state-title is-free">
                上架第 {{ activeReplay.daysSinceShelf || 1 }} 天 · 会员限免
              </div>
              <p class="access-state-desc">
                距离 7 天免费期结束还剩 {{ 7 - (activeReplay.daysSinceShelf || 1) }} 天。会员期内可免费观看，超期后恢复单场购买（¥{{ activeReplay.replayPrice || 49 }}）。
              </p>
              <button
                v-if="!hasMemberPrivilege"
                class="btn-side-full btn-solid-green"
                @click="actions.requireVip('开通会员即可免费观看 7 天内上架的直播回放')"
              >
                开通会员免费看
              </button>
            </template>

            <template v-else>
              <div class="access-price-display num-tabular">
                <span class="curr">¥</span>
                <span class="val">{{ activeReplay.replayPrice || 49 }}</span>
                <span v-if="activeReplay.originPrice" class="orig">¥{{ activeReplay.originPrice }}</span>
              </div>
              <p class="access-state-desc">
                本场回放已上架 {{ activeReplay.daysSinceShelf }} 天（已过 7 天会员免费期），需单独购买解锁。
              </p>
              <button class="btn-side-full btn-dark-solid" @click="openPurchaseModal(activeReplay)">
                立即购买解锁
              </button>
            </template>

            <div class="side-meta-list num-tabular">
              <div class="side-meta-row">
                <span>上架时间</span>
                <span>{{ activeReplay.shelfTime || activeReplay.scheduledStartTime }}</span>
              </div>
              <div class="side-meta-row">
                <span>参会人次</span>
                <span>{{ activeReplay.participantsCount || 980 }} 人</span>
              </div>
              <div class="side-meta-row">
                <span>已解锁人数</span>
                <span>{{ activeReplay.purchasedCount || 420 }} 人</span>
              </div>
            </div>
          </div>

          <div class="side-card">
            <div class="side-card-label">更多往期回放</div>
            <div class="related-list">
              <div
                v-for="item in shelfReplays.filter(r => r.id !== activeReplay?.id).slice(0, 5)"
                :key="item.id"
                class="related-item"
                @click="selectReplayDetail(item)"
              >
                <div class="related-item-title">{{ cleanTitle(item.title) }}</div>
                <div class="related-item-meta num-tabular">
                  <span>{{ item.creator }}</span>
                  <span>·</span>
                  <span>{{ item.actualStartTime || item.scheduledStartTime }}</span>
                  <span>·</span>
                  <span>{{ isWithin7Days(item) ? '会员限免' : item.isPurchased ? '已解锁' : `¥${item.replayPrice}` }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- ==================== 视图 A2：直播预告详情内页 ==================== -->
    <div v-else-if="activeUpcoming" class="replay-detail-view animate-fade-in">
      <header class="detail-nav-bar">
        <button class="btn-back-list" @click="closeUpcomingDetail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>返回直播</span>
        </button>
      </header>

      <div class="detail-main-grid">
        <div class="detail-primary-col">
          <!-- 16:9 预告舞台（未开播，无播放器） -->
          <div class="video-stage-box">
            <div class="upcoming-stage-canvas">
              <img :src="activeUpcoming.cover" :alt="activeUpcoming.title" class="locked-backdrop-img" />
              <div class="upcoming-stage-center">
                <span v-if="activeUpcoming.status === 'live'" class="upcoming-live-pill is-live"><span class="live-dot"></span>正在直播</span>
                <span v-else class="upcoming-live-pill">即将开播</span>
                <div class="upcoming-stage-time num-tabular">{{ activeUpcoming.scheduledStartTime }}</div>
                <div class="upcoming-stage-host">
                  <img v-if="activeUpcoming.creatorAvatar" :src="activeUpcoming.creatorAvatar" :alt="activeUpcoming.creator" />
                  <span>{{ activeUpcoming.creator }} · {{ activeUpcoming.creatorTitle }}</span>
                </div>
                <button v-if="activeUpcoming.status === 'live'" class="btn-solid-green" @click="handleJoinLive(activeUpcoming)">
                  进入直播间
                </button>
                <span v-else class="upcoming-wait-hint">开播后可进入直播间参会</span>
              </div>
            </div>
          </div>

          <!-- 标题与主讲人信息 -->
          <div class="detail-article-header">
            <h1 class="detail-headline">{{ cleanTitle(activeUpcoming.title) }}</h1>
            <div class="detail-author-row">
              <img :src="activeUpcoming.creatorAvatar" :alt="activeUpcoming.creator" class="detail-avatar" />
              <div class="detail-author-meta">
                <div class="detail-author-name">{{ activeUpcoming.creator }}</div>
                <div class="detail-author-sub num-tabular">
                  <span>{{ activeUpcoming.creatorTitle }}</span>
                  <span class="dot-sep">·</span>
                  <span>开播于 {{ activeUpcoming.scheduledStartTime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 直播简介 -->
          <div class="detail-minutes-section">
            <div class="minutes-section-head">
              <h3 class="minutes-section-title">直播简介</h3>
            </div>
            <blockquote class="minutes-summary-quote">
              {{ activeUpcoming.summary || '本场直播内容简介将在开播前更新，敬请期待。' }}
            </blockquote>
          </div>
        </div>

        <!-- 右侧参会权益与更多预告 -->
        <aside class="detail-side-col">
          <div class="side-card">
            <div class="side-card-label">参会权益说明</div>

            <template v-if="hasMemberPrivilege">
              <div class="access-state-title is-free">VIP 会员 · 免费参会</div>
              <p class="access-state-desc">会员期内可免费参加全部实时直播，开播后从直播间一键进入腾讯会议。</p>
              <button v-if="activeUpcoming.status === 'live'" class="btn-side-full btn-solid-green" @click="handleJoinLive(activeUpcoming)">
                进入直播间
              </button>
              <div v-else class="side-meta-list num-tabular">
                <div class="side-meta-row">
                  <span>会议号</span>
                  <span>{{ activeUpcoming.meetingCode }}</span>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="access-state-title">仅限会员参会</div>
              <p class="access-state-desc">实时直播为会员专属权益，开通星球会员后即可免费参加全部直播，并回看 7 天内上架的录播。</p>
              <button class="btn-side-full btn-solid-green" @click="actions.requireVip('实时直播为会员专属权益，开通会员后即可参加')">
                开通会员参会
              </button>
            </template>

            <div class="side-meta-list num-tabular">
              <div class="side-meta-row">
                <span>开播时间</span>
                <span>{{ activeUpcoming.scheduledStartTime }}</span>
              </div>
            </div>
          </div>

          <div class="side-card">
            <div class="side-card-label">更多直播预告</div>
            <div class="related-list">
              <div
                v-for="item in timelineUpcomingItems.filter(u => u.id !== activeUpcoming?.id).slice(0, 5)"
                :key="item.id"
                class="related-item"
                @click="openUpcomingDetail(item)"
              >
                <div class="related-item-title">{{ cleanTitle(item.title) }}</div>
                <div class="related-item-meta num-tabular">
                  <span>{{ item.creator }}</span>
                  <span>·</span>
                  <span>{{ formatShortDateTime(item.scheduledStartTime) }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- ==================== 视图 B：直播与回放主画廊 ==================== -->
    <div v-else class="live-list-view">
      <!-- 顶部栏：做减法，仅保留标题、权益副标与排期状态预览 -->
      <header class="live-top-bar">
        <div class="top-bar-left">
          <h1 class="live-page-title">直播</h1>
          <span class="top-bar-divider"></span>
          <span class="live-page-subtitle">实时闭门路演与投研复盘</span>
        </div>
      </header>

      <div class="live-content-body">
        <!-- ==================== 1. 首屏视觉重心：左跨2列暗色演播室监视器控制台 + 右跨1列同色系暗金排期看板 ==================== -->
        <section class="adaptive-spotlight-section">
          <!-- 状态 1 & 2：左演播室主控制台 (占2列宽) + 右同色系暗金排期表 (占1列宽) -->
          <div
            v-if="spotlightMode === 'dual_stage' && primaryStageItem"
            class="spotlight-grid-layout"
          >
            <!-- 左主舞台（跨2列：内嵌左侧 16:9 实时监视器画框 + 右侧宽敞路演参会席） -->
            <div
              class="stage-main-card"
              :class="{ 'is-live-card': primaryStageItem.status === 'live' }"
            >
              <!-- 左侧：16:9 演播室实时画面监视器窗口 -->
              <div
                class="stage-monitor-screen"
                @click="primaryStageItem.status === 'live' && handleJoinLive(primaryStageItem)"
              >
                <img :src="primaryStageItem.cover" :alt="primaryStageItem.title" class="cover-img-fill" />
                <div class="monitor-vignette-scrim"></div>

                <!-- 左上角磨砂黑曜石信号胶囊 -->
                <div
                  class="monitor-live-hud num-tabular"
                  :class="primaryStageItem.status === 'live' ? 'is-live' : 'is-upcoming'"
                >
                  <span :class="primaryStageItem.status === 'live' ? 'hud-live-dot' : 'badge-dot dot-emerald'"></span>
                  <span>{{ primaryStageItem.status === 'live' ? '正在直播' : '即将开播' }}</span>
                  <span class="hud-sep">·</span>
                  <span>
                    {{
                      primaryStageItem.status === 'live'
                        ? `${primaryStageItem.participantsCount || 685}人在线`
                        : `${primaryStageItem.participantsCount || 320}人已报名`
                    }}
                  </span>
                </div>

                <!-- 左下角：未开播时展示开播时间 -->
                <div v-if="primaryStageItem.status !== 'live'" class="monitor-bottom-hud num-tabular">
                  <span>开播时间：{{ formatShortDateTime(primaryStageItem.scheduledStartTime) }}</span>
                </div>

                <!-- 悬浮进入/播放触发器 -->
                <div class="thumb-play-hover">
                  <div class="play-glass-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4"></polygon>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 右侧：闭门路演议题与腾讯会议参会凭证区（疏朗留白，单行主讲人） -->
              <div class="stage-console-info">
                <div class="console-info-top">
                  <!-- 顶部：直播分类标签 + 腾讯会议参会号凭证 -->
                  <div class="console-ticket-bar num-tabular">
                    <span class="console-topic-tag">
                      {{ primaryStageItem.columnTag || '实时闭门路演' }}
                    </span>
                  </div>

                  <!-- 路演主标题与导读 -->
                  <h2
                    class="stage-main-title"
                    @click="primaryStageItem.status === 'live' && handleJoinLive(primaryStageItem)"
                  >
                    {{ cleanTitle(primaryStageItem.title) }}
                  </h2>

                  <p class="stage-main-summary">{{ primaryStageItem.summary }}</p>
                </div>

                <!-- 底部：单行水平主讲人铭牌 + 右侧参会主按钮 -->
                <div class="console-footer-bar">
                  <div class="stage-speaker-clean">
                    <img :src="primaryStageItem.creatorAvatar" :alt="primaryStageItem.creator" class="stage-avatar-sm" />
                    <span class="stage-speaker-name">{{ primaryStageItem.creator }}</span>
                  </div>

                  <button
                    v-if="primaryStageItem.status === 'live'"
                    class="btn-stage-cta"
                    @click="handleJoinLive(primaryStageItem)"
                  >
                    <span>进入直播间</span>
                    <svg class="cta-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 右侧：同色系暗金演播室排期看板（与左卡视觉浑然一体，双行宽幅排期卡展示完整标题） -->
            <div class="stage-schedule-col">
              <div class="schedule-col-head">
                <div class="schedule-head-left">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span class="schedule-col-title">后续直播排期</span>
                </div>
              </div>

              <div class="schedule-calendar-list">
                <div
                  v-for="(item, idx) in timelineUpcomingItems"
                  :key="item.id"
                  class="schedule-calendar-card"
                  :class="{ 'is-first-item': idx === 0 }"
                  @click="openUpcomingDetail(item)"
                >
                  <!-- 左侧：专属双层磨砂日历徽章（上日期、下时间） -->
                  <div class="cal-date-box num-tabular">
                    <span class="cal-date-md">{{ getScheduleDatePart(item.scheduledStartTime) }}</span>
                    <span class="cal-date-hm">{{ getScheduleTimePart(item.scheduledStartTime) }}</span>
                  </div>

                  <!-- 右侧：路演议题、主讲人及查看预告交互 -->
                  <div class="cal-event-body">
                    <h4 class="cal-event-title" :title="item.title">
                      {{ cleanTitle(item.title) }}
                    </h4>

                    <div class="cal-event-meta">
                      <div class="cal-speaker-chip">
                        <img v-if="item.creatorAvatar" :src="item.creatorAvatar" :alt="item.creator" class="cal-host-avatar" />
                        <span class="cal-host-name">{{ item.creator }}</span>
                        <span v-if="item.columnTag" class="cal-tag-pill">· {{ item.columnTag }}</span>
                      </div>

                      <div class="cal-action-hint">
                        <span>预告</span>
                        <svg class="action-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 状态 3 & 4：单场预告或无排期空窗期（通栏暗色演播室主控制台） -->
          <div
            v-else-if="spotlightBannerItem"
            class="stage-main-card is-full-span"
            @click="
              spotlightMode === 'featured_replay'
                ? selectReplayDetail(spotlightBannerItem)
                : spotlightBannerItem.status === 'live'
                  ? handleJoinLive(spotlightBannerItem)
                  : openUpcomingDetail(spotlightBannerItem)
            "
          >
            <div class="stage-monitor-screen">
              <img :src="spotlightBannerItem.cover" :alt="spotlightBannerItem.title" class="cover-img-fill" />
              <div class="monitor-vignette-scrim"></div>
              <div
                class="monitor-live-hud num-tabular"
                :class="spotlightBannerItem.status === 'live' ? 'is-live' : 'is-upcoming'"
              >
                <span :class="spotlightBannerItem.status === 'live' ? 'hud-live-dot' : 'badge-dot dot-emerald'"></span>
                <span v-if="spotlightMode === 'featured_replay'">
                  最新上架回放 · 会员限免剩 {{ 7 - (spotlightBannerItem.daysSinceShelf || 1) }} 天
                </span>
                <span v-else>
                  即将开播 · {{ formatShortDateTime(spotlightBannerItem.scheduledStartTime) }}
                </span>
              </div>
              <div class="monitor-bottom-hud num-tabular">
                <span>{{ spotlightMode === 'featured_replay' ? `高清云录制 · ${spotlightBannerItem.recordDuration || '01:38:00'}` : '腾讯会议闭门路演' }}</span>
              </div>
              <div class="thumb-play-hover">
                <div class="play-glass-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4"></polygon>
                  </svg>
                </div>
              </div>
            </div>

            <div class="stage-console-info">
              <div class="console-info-top">
                <div class="console-ticket-bar num-tabular">
                  <span class="console-topic-tag">
                    {{ spotlightBannerItem.columnTag || '实时闭门路演' }}
                  </span>
                </div>

                <h2 class="stage-main-title">{{ cleanTitle(spotlightBannerItem.title) }}</h2>
                <p class="stage-main-summary">{{ spotlightBannerItem.summary }}</p>
              </div>

              <div class="console-footer-bar">
                <div class="stage-speaker-clean">
                  <img :src="spotlightBannerItem.creatorAvatar" :alt="spotlightBannerItem.creator" class="stage-avatar-sm" />
                  <span class="stage-speaker-name">{{ spotlightBannerItem.creator }}</span>
                </div>

                <button v-if="spotlightMode === 'featured_replay'" class="btn-stage-cta">
                  <span>观看回放与纪要</span>
                  <svg class="cta-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ==================== 2. 往期回放画廊（3 列 16:9 封面卡片，与上方严丝合缝对齐） ==================== -->
        <section class="replay-gallery-section">
          <!-- 归位后的回放专属工具栏：标题 + 一体化分段槽 + 分类筛选 + 搜索 -->
          <div class="gallery-toolbar-bar">
            <div class="gallery-toolbar-left">
              <div class="gallery-title-wrap">
                <h2 class="gallery-title">往期回放</h2>
              </div>
              <nav class="view-segment-nav">
                <button
                  :class="['seg-btn', { active: activeTab === 'all' }]"
                  @click="activeTab = 'all'"
                >
                  <span>全部</span>
                  <span class="seg-count num-tabular">{{ shelfReplays.length }}</span>
                </button>
                <button
                  :class="['seg-btn', { active: activeTab === 'free7d' }]"
                  @click="activeTab = 'free7d'"
                >
                  <span>7天内限免</span>
                  <span class="seg-count num-tabular">{{ free7dCount }}</span>
                </button>
                <button
                  :class="['seg-btn', { active: activeTab === 'paid' }]"
                  @click="activeTab = 'paid'"
                >
                  <span>往期单购</span>
                  <span class="seg-count num-tabular">{{ paidAfter7dCount }}</span>
                </button>
                <button
                  :class="['seg-btn', { active: activeTab === 'unlocked' }]"
                  @click="activeTab = 'unlocked'"
                >
                  <span>我可观看</span>
                  <span class="seg-count num-tabular">{{ unlockedCount }}</span>
                </button>
              </nav>
            </div>

            <div class="gallery-toolbar-right">
              <div class="clean-select-wrap">
                <select v-model="selectedColumnTag" class="clean-select">
                  <option value="">全部分类</option>
                  <option v-for="cat in appState.liveCategories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
                <svg class="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              <div class="clean-search-wrap">
                <svg class="search-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="clean-search-input"
                  placeholder="搜索议题或主讲人"
                />
                <button v-if="searchQuery" class="btn-clear-q" @click="searchQuery = ''">✕</button>
              </div>
            </div>
          </div>

          <div v-if="galleryReplays.length > 0" class="borderless-replay-grid">
            <article
              v-for="rep in galleryReplays"
              :key="rep.id"
              class="editorial-replay-item"
              @click="selectReplayDetail(rep)"
            >
              <!-- 16:9 纯净画框封面图（暗角层次 + 1px内高光描边 + 黑曜石磨砂胶囊） -->
              <div class="replay-thumb-box">
                <img :src="rep.cover" :alt="rep.title" class="cover-img-fill" />
                <div class="cover-scrim-overlay"></div>

                <!-- 统一黑曜石半透明毛玻璃角标（仅靠发光圆点区分状态，不与封面色彩打架） -->
                <span v-if="rep.isPurchased" class="thumb-frosted-badge">
                  <span class="badge-dot dot-slate"></span>
                  <span>已解锁</span>
                </span>
                <span v-else-if="isWithin7Days(rep)" class="thumb-frosted-badge num-tabular">
                  <span class="badge-dot dot-emerald"></span>
                  <span>会员限免 · 剩 {{ 7 - (rep.daysSinceShelf || 1) }} 天</span>
                </span>
                <span v-else class="thumb-frosted-badge num-tabular">
                  <span class="badge-dot dot-amber"></span>
                  <span>¥{{ rep.replayPrice || 49 }}</span>
                </span>

                <!-- 右下角精炼时长胶囊 -->
                <span class="thumb-duration-pill num-tabular">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4"></polygon>
                  </svg>
                  <span>{{ rep.recordDuration || '1小时38分钟' }}</span>
                </span>

                <!-- 悬浮磨砂播放按钮 -->
                <div class="thumb-play-hover">
                  <div class="play-glass-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4"></polygon>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 封面下方信息区（固定双行标题高度，确保底部主讲人与微胶囊操作项严格水平基线对齐） -->
              <div class="editorial-item-body">
                <h3 class="editorial-item-title" :title="rep.title">
                  {{ cleanTitle(rep.title) }}
                </h3>

                <div class="editorial-item-meta num-tabular">
                  <div class="meta-speaker-left">
                    <img :src="rep.creatorAvatar" :alt="rep.creator" class="meta-avatar-xs" />
                    <span class="meta-speaker-name">{{ rep.creator }}</span>
                    <span class="meta-dot">·</span>
                    <span class="meta-date">{{ rep.scheduledStartTime.split(' ')[0].slice(5) }}</span>
                  </div>

                  <div class="meta-right">
                    <span v-if="rep.isPurchased" class="card-action-pill is-unlocked">
                      <span>已解锁</span>
                      <span class="pill-arrow">→</span>
                    </span>
                    <template v-else-if="isWithin7Days(rep)">
                      <span v-if="hasMemberPrivilege" class="card-action-pill is-free">
                        <span>免费观看</span>
                        <span class="pill-arrow">→</span>
                      </span>
                      <span
                        v-else
                        class="card-action-pill is-free"
                        @click.stop="actions.requireVip('开通会员免费看 7 天内回放')"
                      >
                        <span>会员限免</span>
                        <span class="pill-arrow">→</span>
                      </span>
                    </template>
                    <button
                      v-else
                      class="card-action-pill is-buy num-tabular"
                      @click.stop="openPurchaseModal(rep)"
                    >
                      <span>¥{{ rep.replayPrice || 49 }} 解锁</span>
                      <span class="pill-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="clean-empty-state">
            <p class="empty-text">未找到符合筛选条件的直播回放</p>
            <button class="btn-reset-filter" @click="resetReplayFilters">重置筛选</button>
          </div>
        </section>
      </div>
    </div>

    <!-- ==================== 单场回放购买弹窗 ==================== -->
    <transition name="fade">
      <div
        v-if="purchasingReplay"
        class="checkout-backdrop"
        @click.self="purchasingReplay = null"
      >
        <div class="checkout-dialog">
          <div class="checkout-top">
            <h3 class="checkout-heading">解锁单场直播回放</h3>
            <button class="btn-close-dialog" @click="purchasingReplay = null">✕</button>
          </div>

          <div class="checkout-content">
            <div class="checkout-summary-box">
              <div class="checkout-item-title">{{ cleanTitle(purchasingReplay.title) }}</div>
              <div class="checkout-item-sub num-tabular">
                <span>主讲人：{{ purchasingReplay.creator }}</span>
                <span>·</span>
                <span>时长：{{ purchasingReplay.recordDuration || '1小时45分钟' }}</span>
              </div>
            </div>

            <div class="checkout-price-row">
              <span class="price-label">单场解锁价格</span>
              <div class="price-numbers num-tabular">
                <span v-if="purchasingReplay.originPrice" class="orig-strike">
                  ¥{{ purchasingReplay.originPrice }}
                </span>
                <span class="final-amount">¥{{ purchasingReplay.replayPrice || 49 }}</span>
              </div>
            </div>

            <p class="checkout-rule-tip">
              本场回放上架已满 {{ purchasingReplay.daysSinceShelf }} 天（超过 7 天会员免费期），单场购买后账号永久有效，包含完整高清回放与核心会议纪要。
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
            <button class="btn-dialog-cancel" @click="purchasingReplay = null">取消</button>
            <button class="btn-dialog-confirm num-tabular" @click="confirmPurchaseReplay">
              确认支付 ¥{{ purchasingReplay.replayPrice || 49 }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { appState, actions } from '@/stores/community';
import { renderMarkdown } from '@/utils/markdown';
import type { TencentMeetingRecord } from '@/types';

// 纪要渲染：后台富文本保存的内容为 HTML（以标签开头），直接展示；纯 Markdown 文本走解析器
const renderMinutes = (src?: string): string => {
  if (!src) return '';
  return src.trimStart().startsWith('<') ? src : renderMarkdown(src);
};

const pageRootRef = ref<HTMLElement | null>(null);

// 当前视角是否具备会员权益（与左下角角色切换联动）
const hasMemberPrivilege = computed(() => {
  if (appState.currentPerspective === 'guest') {
    return false;
  }
  return (
    appState.isVipMember ||
    appState.user.role === 'founder' ||
    appState.user.role === 'vip' ||
    appState.user.role === 'partner'
  );
});

// 正在直播与预告数据
const effectiveLiveList = computed(() =>
  appState.tencentMeetings.filter(m => m.status === 'live')
);
const effectiveUpcomingList = computed(() =>
  appState.tencentMeetings.filter(m => m.status === 'upcoming')
);

// 自适应焦点模式判定
const spotlightMode = computed<'dual_stage' | 'single_stage' | 'featured_replay'>(() => {
  const totalSchedule = effectiveLiveList.value.length + effectiveUpcomingList.value.length;
  if (totalSchedule >= 2) return 'dual_stage';
  if (totalSchedule === 1) return 'single_stage';
  return 'featured_replay';
});

// 左主舞台焦点场次（优先正在直播，否则取最近一场预告）
const primaryStageItem = computed<TencentMeetingRecord | null>(() => {
  if (effectiveLiveList.value.length > 0) {
    return effectiveLiveList.value[0];
  }
  if (effectiveUpcomingList.value.length > 0) {
    return effectiveUpcomingList.value[0];
  }
  return null;
});

// 右侧排期列表
const timelineUpcomingItems = computed<TencentMeetingRecord[]>(() => {
  if (!primaryStageItem.value) return [];
  const allScheduled = [...effectiveLiveList.value, ...effectiveUpcomingList.value];
  return allScheduled.filter(item => item.id !== primaryStageItem.value?.id).slice(0, 3);
});

// 已上架回放列表（后台下架后 C 端不再展示）
const shelfReplays = computed(() =>
  appState.tencentMeetings.filter(m => m.status === 'finished' && m.isOnShelf === true)
);

// 单场预告或无排期空窗期的通栏焦点对象
const spotlightBannerItem = computed<TencentMeetingRecord | null>(() => {
  if (spotlightMode.value === 'single_stage') return primaryStageItem.value;
  if (spotlightMode.value === 'featured_replay') return shelfReplays.value[0] || null;
  return null;
});

const isWithin7Days = (m: TencentMeetingRecord) => (m.daysSinceShelf ?? 1) <= 7;

const canWatchReplay = (m: TencentMeetingRecord) => {
  if (m.isPurchased) return true;
  if (isWithin7Days(m) && hasMemberPrivilege.value) return true;
  return false;
};

// 分类计数
const free7dCount = computed(() => shelfReplays.value.filter(m => isWithin7Days(m)).length);
const paidAfter7dCount = computed(() => shelfReplays.value.filter(m => !isWithin7Days(m)).length);
const unlockedCount = computed(() => shelfReplays.value.filter(m => canWatchReplay(m)).length);

// 顶部筛选与搜索
const activeTab = ref<'all' | 'free7d' | 'paid' | 'unlocked'>('all');
const selectedColumnTag = ref('');
const searchQuery = ref('');

const filteredReplays = computed(() => {
  return shelfReplays.value.filter(m => {
    if (activeTab.value === 'free7d' && !isWithin7Days(m)) return false;
    if (activeTab.value === 'paid' && isWithin7Days(m)) return false;
    if (activeTab.value === 'unlocked' && !canWatchReplay(m)) return false;

    if (selectedColumnTag.value && m.columnTag !== selectedColumnTag.value) {
      return false;
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchCreator = m.creator.toLowerCase().includes(q);
      const matchSummary = (m.summary || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCreator && !matchSummary) return false;
    }
    return true;
  });
});

const galleryReplays = computed(() => {
  if (spotlightMode.value === 'featured_replay' && spotlightBannerItem.value && activeTab.value === 'all' && !selectedColumnTag.value && !searchQuery.value.trim()) {
    return filteredReplays.value.filter(r => r.id !== spotlightBannerItem.value?.id);
  }
  return filteredReplays.value;
});

const resetReplayFilters = () => {
  activeTab.value = 'all';
  selectedColumnTag.value = '';
  searchQuery.value = '';
};

const cleanTitle = (rawTitle: string) => {
  return rawTitle
    .replace(/^【.*?】\s*/, '')
    .replace(/^(剖析|解析|洞察|实战):\s*/, '');
};

const formatShortDateTime = (dt: string) => {
  if (!dt) return '';
  const match = dt.match(/(?:(\d{4})-)?0?(\d{1,2})-0?(\d{1,2})\s+(\d{1,2}:\d{2})/);
  if (match) {
    const [, , m, d, time] = match;
    return `${m}月${d}日 ${time}`;
  }
  return dt.replace(/^\d{4}-/, '');
};

const getScheduleDatePart = (dt: string) => {
  if (!dt) return '';
  const match = dt.match(/(?:(\d{4})-)?0?(\d{1,2})-0?(\d{1,2})/);
  if (match) {
    const [, , m, d] = match;
    return `${m}月${d}日`;
  }
  return dt.split(' ')[0] || '';
};

const getScheduleTimePart = (dt: string) => {
  return dt.split(' ')[1] || '20:00';
};

// 进入直播间：会员点击后复制会议号并跳转腾讯会议入会链接
const handleJoinLive = (m: TencentMeetingRecord) => {
  if (!hasMemberPrivilege.value) {
    actions.requireVip('实时直播为会员权益，开通后即可进入腾讯会议参会');
    return;
  }
  const cleanCode = m.meetingCode.replace(/\s+/g, '');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(cleanCode);
  }
  actions.showToast(`会议号 ${m.meetingCode} 已复制，正在跳转腾讯会议...`);
  if (m.joinUrl) {
    window.open(m.joinUrl, '_blank');
  }
};

// 内页回放详情状态
const activeReplay = ref<TencentMeetingRecord | null>(null);
const isVideoPlaying = ref(true);
const playbackSpeed = ref(1.0);
const isSpeedMenuOpen = ref(false);
const videoStageRef = ref<HTMLElement | null>(null);

// 全屏观看：对播放器容器切换浏览器全屏
const toggleFullscreen = () => {
  const el = videoStageRef.value;
  if (!el) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (el.requestFullscreen) {
    el.requestFullscreen();
  }
};
const videoProgress = ref(24);
const simulatedTime = ref('22:40');

const selectReplayDetail = (rep: TencentMeetingRecord) => {
  activeReplay.value = rep;
  isVideoPlaying.value = true;
  if (pageRootRef.value) {
    pageRootRef.value.scrollTop = 0;
  }
};

const closeReplayDetail = () => {
  activeReplay.value = null;
};

// 内页直播预告详情状态
const activeUpcoming = ref<TencentMeetingRecord | null>(null);

const openUpcomingDetail = (m: TencentMeetingRecord) => {
  activeUpcoming.value = m;
  if (pageRootRef.value) {
    pageRootRef.value.scrollTop = 0;
  }
};

const closeUpcomingDetail = () => {
  activeUpcoming.value = null;
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
  const mins = Math.floor((pct / 100) * 98);
  const secs = Math.floor(((pct / 100) * 98 * 60) % 60);
  simulatedTime.value = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// 单场购买收银台
const purchasingReplay = ref<TencentMeetingRecord | null>(null);
const payMethod = ref<'wechat' | 'alipay'>('wechat');

const openPurchaseModal = (rep: TencentMeetingRecord) => {
  purchasingReplay.value = rep;
};

const confirmPurchaseReplay = () => {
  if (!purchasingReplay.value) return;
  const target = purchasingReplay.value;
  actions.purchaseMeetingReplay(target.id);
  purchasingReplay.value = null;
  activeReplay.value = target;
  isVideoPlaying.value = true;
};
</script>

<style scoped>
/* 整体容器：统一纯白画布 */
.live-page-root {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

/* ==================== 1. 顶部栏（做减法，清爽通透 + 权益微章） ==================== */
.live-top-bar {
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

.live-page-title {
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

.live-page-subtitle {
  font-size: 12.5px;
  color: #64748b;
  font-weight: 400;
}


.select-chevron {
  position: absolute;
  right: 2px;
  pointer-events: none;
  color: #64748b;
  transition: transform 0.15s ease, color 0.15s ease;
}

/* ==================== 主体内容容器 ==================== */
.live-content-body {
  padding: 26px 36px 56px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* ==================== 顶部主次舞台（左跨2列暗金演播室监视器控制台 + 右跨1列同色系暗金排期看板） ==================== */
.spotlight-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  align-items: stretch;
  min-height: 278px;
}

/* 左侧占 2 列的主导播台：左 280px 实况监视器窗 + 右 1fr 宽敞参会席（避免百分比+gap溢出挤压） */
.stage-main-card {
  grid-column: span 2;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background:
    radial-gradient(circle at 88% 12%, rgba(16, 185, 129, 0.1), transparent 48%),
    linear-gradient(145deg, #0f172a 0%, #162032 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  padding: 20px 24px;
  gap: 24px;
  align-items: stretch;
  min-height: 278px;
  cursor: pointer;
}

.stage-main-card.is-full-span,
.stage-main-card.full-span {
  grid-column: 1 / -1;
  grid-template-columns: 320px minmax(0, 1fr);
}

/* 左侧：16:9 演播室实况监视器画面窗 */
.stage-monitor-screen {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 236px;
}

.stage-backdrop-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.stage-main-card:hover .stage-backdrop-img {
  transform: scale(1.04);
}

.monitor-vignette-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(2, 6, 23, 0.46) 0%, rgba(2, 6, 23, 0.06) 45%, rgba(2, 6, 23, 0.72) 100%);
  pointer-events: none;
}

/* 监视器左上角磨砂黑曜石信号 HUD（克制高级，仅用呼吸红点提示直播状态） */
.monitor-live-hud {
  position: absolute;
  top: 11px;
  left: 11px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #f8fafc;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.monitor-live-hud.is-upcoming {
  border-color: rgba(52, 211, 153, 0.35);
  color: #34d399;
}

.hud-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f43f5e;
  box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.3);
  animation: livePulse 1.5s infinite;
  flex-shrink: 0;
}

.hud-sep {
  opacity: 0.45;
}

@keyframes livePulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.18);
  }
}

/* 监视器左下角音轨波形与画质角标 */
.monitor-bottom-hud {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(248, 250, 252, 0.9);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

/* 右侧宽敞路演议题与参会凭证区 */
.stage-console-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 0;
  gap: 16px;
  min-width: 0;
}

.console-info-top {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.console-ticket-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.console-topic-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.28);
  color: #34d399;
  font-size: 11.5px;
  font-weight: 600;
}

.stage-main-title {
  font-size: 19px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.4;
  letter-spacing: -0.2px;
  margin: 2px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stage-main-summary {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.68;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 底部：单行水平主讲人铭牌 + 右侧参会主按钮（不再垂直堆叠） */
.console-footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.stage-speaker-clean {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.stage-avatar-sm {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.24);
  flex-shrink: 0;
}

.stage-speaker-name {
  font-size: 13px;
  font-weight: 600;
  color: #f8fafc;
  white-space: nowrap;
}

.btn-stage-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 18px;
  border-radius: 8px;
  border: none;
  background: #10b981;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  flex-shrink: 0;
}

.btn-stage-cta .cta-arrow {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-stage-cta:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-stage-cta:hover .cta-arrow {
  transform: translateX(2.5px);
}

/* ==================== 右侧占 1 列：同色系暗金演播室排期看板（与左侧主舞台色调质感浑然一体） ==================== */
.stage-schedule-col {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 15px;
  border-radius: 14px;
  background:
    radial-gradient(circle at 92% 8%, rgba(16, 185, 129, 0.12), transparent 52%),
    linear-gradient(155deg, #162032 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.schedule-col-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 11px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.schedule-head-left {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.schedule-col-title {
  font-size: 13px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: 0.2px;
}

.schedule-col-sub {
  font-size: 11px;
  font-weight: 600;
  color: #34d399;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.28);
  padding: 2px 8.5px;
  border-radius: 999px;
}

.schedule-calendar-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  gap: 8px;
}

/* 单张高定日历票根卡片：左侧专属日期时间块 + 右侧路演议题与主讲人 */
.schedule-calendar-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.schedule-calendar-card:hover {
  background: rgba(255, 255, 255, 0.065);
  border-color: rgba(52, 211, 153, 0.35);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.28);
}

/* 左侧：专属双层磨砂日历徽章（上月日，下时间） */
.cal-date-box {
  width: 58px;
  height: 48px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.cal-date-md {
  font-size: 11.5px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.2;
  white-space: nowrap;
  letter-spacing: 0.1px;
}

.cal-date-hm {
  font-size: 11px;
  font-weight: 600;
  color: #34d399;
  line-height: 1.2;
  margin-top: 2px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.2px;
}

/* 首场高亮状态 */
.schedule-calendar-card.is-first-item .cal-date-box {
  background: rgba(16, 185, 129, 0.09);
  border-color: rgba(52, 211, 153, 0.28);
}

.schedule-calendar-card:hover .cal-date-box {
  background: rgba(16, 185, 129, 0.16);
  border-color: rgba(52, 211, 153, 0.45);
}

.schedule-calendar-card:hover .cal-date-md {
  color: #ffffff;
}

/* 右侧内容区 */
.cal-event-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cal-event-title {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.38;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.1px;
  transition: color 0.15s ease;
}

.schedule-calendar-card:hover .cal-event-title {
  color: #ffffff;
}

/* 底部元信息栏：主讲人 + 专栏标签 + 查看预告箭头 */
.cal-event-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.cal-speaker-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}

.cal-host-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.cal-host-name {
  font-size: 11.5px;
  font-weight: 500;
  color: #cbd5e1;
  white-space: nowrap;
}

.cal-tag-pill {
  font-size: 10.5px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cal-action-hint {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  flex-shrink: 0;
  transition: color 0.18s ease;
}

.cal-action-hint .action-arrow {
  color: #94a3b8;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), color 0.18s ease;
}

.schedule-calendar-card:hover .cal-action-hint {
  color: #34d399;
}

.schedule-calendar-card:hover .cal-action-hint .action-arrow {
  transform: translateX(2.5px);
  color: #34d399;
}

/* ==================== 预告详情内页：16:9 预告舞台 ==================== */
.upcoming-stage-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}

.upcoming-stage-center {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0.72) 100%);
}

.upcoming-live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 12px;
  border-radius: 999px;
  border: 1px solid rgba(52, 211, 153, 0.5);
  background: rgba(16, 185, 129, 0.14);
  color: #34d399;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.upcoming-live-pill.is-live {
  border-color: rgba(248, 113, 113, 0.55);
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
}

.upcoming-live-pill .live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.upcoming-stage-time {
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.upcoming-stage-host {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-size: 13px;
}

.upcoming-stage-host img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.upcoming-wait-hint {
  font-size: 12.5px;
  color: rgba(226, 232, 240, 0.75);
}

/* ==================== 往期回放画廊（一体式分段槽 + 画框封面 + 水平基线对齐） ==================== */
.replay-gallery-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 28px;
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

.gallery-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gallery-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.2px;
}

/* 高定一体式分段控制器轨道槽 */
.view-segment-nav {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 9px;
  background: #f1f5f9;
  border: 1px solid rgba(226, 232, 240, 0.7);
}

.seg-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6.5px;
  background: transparent;
  color: #64748b;
  font-size: 12.5px;
  font-weight: 500;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.seg-btn:hover {
  color: #0f172a;
}

.seg-btn.active {
  color: #0f172a;
  font-weight: 600;
  background: #ffffff;
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.08),
    0 1px 1px rgba(15, 23, 42, 0.04);
}

.seg-count {
  font-size: 11px;
  line-height: 1.4;
  padding: 0.5px 5.5px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  color: #64748b;
  transition: all 0.18s ease;
}

.seg-btn.active .seg-count {
  background: #f1f5f9;
  color: #0f172a;
  font-weight: 600;
}

.gallery-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
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
  padding: 0 28px 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #334155;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.clean-select:hover {
  background: #ffffff;
  border-color: #cbd5e1;
}

.clean-select:focus {
  background: #ffffff;
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
}

.clean-select-wrap .select-chevron {
  right: 10px;
}

.clean-search-wrap {
  display: flex;
  align-items: center;
  width: 210px;
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
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
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

.borderless-replay-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 24px;
  row-gap: 32px;
  align-items: stretch;
}

.editorial-replay-item {
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}

/* 16:9 纯净图片封面容器 + 暗角渐晕 + 1px 内高光画框 */
.replay-thumb-box {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 11px;
  overflow: hidden;
  background: #0f172a;
  margin-bottom: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.08);
  transition: box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.editorial-replay-item:hover .replay-thumb-box {
  box-shadow: 0 12px 24px -6px rgba(15, 23, 42, 0.15);
  transform: translateY(-2px);
}

/* 封面上下微暗角保护层（确保浅色封面下角标依然锐利清晰） */
.cover-scrim-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.18) 0%,
    transparent 32%,
    transparent 62%,
    rgba(15, 23, 42, 0.48) 100%
  );
  pointer-events: none;
}

.replay-thumb-box::after,
.stage-cover-frame::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.1);
  pointer-events: none;
  z-index: 4;
}

.cover-img-fill {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.editorial-replay-item:hover .cover-img-fill,
.stage-cover-frame:hover .cover-img-fill {
  transform: scale(1.045);
}

/* 统一黑曜石半透明毛玻璃角标（去彩色杂乱背景，仅靠发光圆点区分状态） */
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
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #f8fafc;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
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

.dot-slate {
  background: #94a3b8;
}

/* 封面右下角时长胶囊 */
.thumb-duration-pill {
  position: absolute;
  bottom: 9px;
  right: 9px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2.5px 8px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #f8fafc;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1px;
}

.thumb-duration-pill svg {
  opacity: 0.85;
}

/* 悬浮播放遮罩 */
.thumb-play-hover {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: rgba(15, 23, 42, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.22s ease;
}

.editorial-replay-item:hover .thumb-play-hover,
.stage-cover-frame:hover .thumb-play-hover {
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

.editorial-replay-item:hover .play-glass-btn,
.stage-cover-frame:hover .play-glass-btn {
  transform: scale(1);
}

/* 封面下方两行信息（固定双行标题高度 + 底部自动对齐同一水平基线） */
.editorial-item-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 0 2px;
}

.editorial-item-title {
  font-size: 14.5px;
  font-weight: 600;
  color: #0f172a;
  line-height: 21px;
  min-height: 42px;
  margin: 0 0 9px 0;
  letter-spacing: -0.1px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.15s ease;
}

.editorial-replay-item:hover .editorial-item-title {
  color: #059669;
}

.editorial-item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  font-size: 12px;
  color: #94a3b8;
}

.meta-speaker-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-avatar-xs {
  width: 21px;
  height: 21px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.meta-speaker-name {
  color: #475569;
  font-weight: 500;
}

.meta-dot {
  color: #cbd5e1;
}

/* 卡片右下角交互微胶囊（取代单调纯文本，强化精致感与点击诱因） */
.card-action-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2.5px 8.5px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.18s ease;
}

.card-action-pill .pill-arrow {
  font-size: 11px;
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.editorial-replay-item:hover .card-action-pill .pill-arrow {
  transform: translateX(2px);
}

.card-action-pill.is-free {
  color: #059669;
  background: #ecfdf5;
  border: 1px solid rgba(16, 185, 129, 0.22);
}

.editorial-replay-item:hover .card-action-pill.is-free {
  background: #d1fae5;
  border-color: rgba(16, 185, 129, 0.38);
}

.card-action-pill.is-buy {
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

.editorial-replay-item:hover .card-action-pill.is-buy,
.card-action-pill.is-buy:hover {
  color: #ffffff;
  background: #0f172a;
  border-color: #0f172a;
}

.card-action-pill.is-unlocked {
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid transparent;
  font-weight: 500;
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

/* ==================== 内页回放详情视图 ==================== */
.replay-detail-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.detail-nav-bar {
  position: sticky;
  top: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 36px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #f1f5f9;
}

.btn-back-list {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #334155;
  font-size: 13.5px;
  font-weight: 600;
}

.btn-back-list:hover {
  color: #0f172a;
}

.detail-main-grid {
  display: flex;
  gap: 36px;
  padding: 28px 36px 56px;
  align-items: flex-start;
}

.detail-primary-col {
  flex: 1;
  min-width: 0;
}

.video-stage-box {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;
  margin-bottom: 24px;
  position: relative;
}

.player-canvas,
.locked-stage-canvas {
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
  opacity: 0.45;
  transition: opacity 0.3s ease;
}

.player-backdrop-img.is-playing {
  opacity: 0.3;
}

.locked-backdrop-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(8px) brightness(0.35);
}

.player-center-stage {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-circle-play {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.btn-circle-play:hover {
  transform: scale(1.06);
}

.player-control-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.9) 100%);
  color: #f8fafc;
}

.ctrl-icon-btn {
  background: transparent;
  color: #ffffff;
  display: flex;
  align-items: center;
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
  background: #10b981;
}

.ctrl-speed-wrap {
  position: relative;
}

.speed-toggle-btn {
  background: transparent;
  color: #94a3b8;
  font-size: 11.5px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.speed-toggle-btn:hover {
  color: #ffffff;
}

.speed-menu-pop {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  min-width: 64px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.speed-menu-item {
  background: transparent;
  color: #94a3b8;
  font-size: 11.5px;
  padding: 4px 10px;
  border-radius: 4px;
  text-align: center;
  white-space: nowrap;
}

.speed-menu-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.speed-menu-item.active {
  color: #34d399;
  font-weight: 600;
}

.locked-editorial-box {
  position: relative;
  z-index: 2;
  margin: auto;
  max-width: 440px;
  text-align: center;
  padding: 24px;
  color: #ffffff;
}

.locked-icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.locked-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.locked-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.55;
  margin: 0 0 18px 0;
}

.locked-btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-solid-green {
  padding: 9px 20px;
  border-radius: 6px;
  background: #10b981;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
}

.btn-solid-green:hover {
  background: #059669;
}

.btn-ghost-light {
  padding: 9px 18px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 500;
}

/* 详情标题与作者行 */
.detail-article-header {
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.detail-headline {
  font-size: 21px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  margin: 0 0 14px 0;
}

.detail-author-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.detail-author-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.detail-author-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

/* 会议纪要与核心要点 */
.minutes-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.minutes-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.minutes-summary-quote {
  margin: 0 0 18px 0;
  padding: 12px 16px;
  background: #ffffff;
  border-left: 3px solid #0f172a;
  font-size: 14px;
  color: #334155;
  line-height: 1.7;
}

/* 纪要 Markdown 富文本正文（v-html 渲染，需 :deep 穿透） */
.minutes-doc-body {
  font-size: 14px;
  color: #1e293b;
  line-height: 1.8;
}

.minutes-doc-body :deep(p) {
  margin: 0 0 10px;
}

.minutes-doc-body :deep(ol),
.minutes-doc-body :deep(ul) {
  margin: 0 0 10px;
  padding-left: 22px;
}

.minutes-doc-body :deep(li) {
  margin-bottom: 6px;
}

.minutes-doc-body :deep(h1),
.minutes-doc-body :deep(h2),
.minutes-doc-body :deep(h3),
.minutes-doc-body :deep(h4) {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 16px 0 8px;
}

.minutes-doc-body :deep(blockquote) {
  margin: 10px 0;
  padding: 8px 14px;
  border-left: 3px solid #10b981;
  background: #f0fdf4;
  color: #065f46;
  border-radius: 0 6px 6px 0;
}

.minutes-doc-body :deep(code) {
  background: #f1f5f9;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 13px;
}

.minutes-doc-body :deep(pre) {
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px 14px;
  border-radius: 8px;
  overflow-x: auto;
}

.minutes-doc-body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.minutes-doc-body :deep(a) {
  color: rgb(2, 132, 199);
}

.minutes-doc-body :deep(table) {
  border-collapse: collapse;
  margin: 10px 0;
}

.minutes-doc-body :deep(th),
.minutes-doc-body :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 6px 10px;
  font-size: 13px;
}

.minutes-doc-body.is-locked-blur {
  filter: blur(5px);
  opacity: 0.55;
  user-select: none;
  pointer-events: none;
}

.minutes-paywall-card {
  margin-top: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  text-align: center;
}

.paywall-card-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.paywall-card-sub {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.paywall-card-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary-action {
  padding: 9px 20px;
  border-radius: 6px;
  background: #10b981;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
}

.btn-dark-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  border-radius: 6px;
  background: #0f172a;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
}

.btn-sep {
  opacity: 0.4;
}

.detail-side-col {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-card {
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
}

.side-card-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 10px;
}

.access-state-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.access-state-title.is-free {
  color: #059669;
}

.access-price-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 6px;
}

.access-price-display .curr {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.access-price-display .val {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.access-price-display .orig {
  font-size: 12.5px;
  color: #94a3b8;
  text-decoration: line-through;
  margin-left: 4px;
}

.access-state-desc {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.55;
  margin: 0 0 14px 0;
}

.btn-side-full {
  width: 100%;
  padding: 9px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 14px;
}

.btn-dark-solid {
  background: #0f172a;
  color: #ffffff;
}

.side-meta-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  font-size: 12px;
}

.side-meta-row {
  display: flex;
  justify-content: space-between;
  color: #64748b;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
}

.related-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.related-item-title {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 4px;
}

.related-item:hover .related-item-title {
  color: #059669;
}

.related-item-meta {
  display: flex;
  gap: 6px;
  font-size: 11.5px;
  color: #94a3b8;
}

/* ==================== 简洁单场购买收银台 ==================== */
.checkout-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
  padding: 20px;
}

.checkout-dialog {
  width: 420px;
  max-width: 94vw;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 36px -8px rgba(15, 23, 42, 0.2);
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
  padding: 12px 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.checkout-item-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
  margin-bottom: 4px;
}

.checkout-item-sub {
  display: flex;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.checkout-price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.price-label {
  font-size: 13px;
  color: #475569;
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
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.checkout-rule-tip {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
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
  border-radius: 6px;
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
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 13px;
}

.btn-dialog-confirm {
  padding: 8px 18px;
  border-radius: 6px;
  background: #0f172a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
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
