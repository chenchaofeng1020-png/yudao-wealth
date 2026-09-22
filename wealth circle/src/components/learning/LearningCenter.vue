<template>
  <div class="learning-center-wrap">
    <!-- Learning Mode Tabs -->
    <div class="learning-nav-header">
      <div class="learning-tabs">
        <button 
          :class="['l-tab', { active: activeSubTab === 'column' }]"
          @click="activeSubTab = 'column'"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>专栏 ({{ appState.columns.length }})</span>
        </button>

        <button 
          :class="['l-tab', { active: activeSubTab === 'live' }]"
          @click="activeSubTab = 'live'"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
            <circle cx="12" cy="12" r="2"/>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
            <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
          </svg>
          <span>直播 ({{ appState.liveSessions.length }})</span>
        </button>

        <button 
          :class="['l-tab', { active: activeSubTab === 'course' }]"
          @click="activeSubTab = 'course'"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <span>课程 ({{ appState.courses.length }})</span>
        </button>
      </div>

      <div class="vip-free-hint" @click="appState.isVipJoinModalOpen = true">
        <span class="crown">👑</span> VIP 会员享专栏与直播免费畅享
      </div>
    </div>

    <!-- 1. COLUMN TAB -->
    <div v-if="activeSubTab === 'column'" class="columns-grid animate-fade-in">
      <div v-for="col in appState.columns" :key="col.id" class="column-card">
        <div class="col-cover-block">
          <img :src="col.cover" :alt="col.title" class="col-cover-img" />
          <span class="col-badge-count">{{ col.chapterCount }} 讲深度长文</span>
        </div>

        <div class="col-body">
          <div class="col-tags-row">
            <span v-for="t in col.tags" :key="t" class="col-tag">{{ t }}</span>
          </div>
          <h3 class="col-title">{{ col.title }}</h3>
          <p class="col-subtitle">{{ col.subtitle }}</p>

          <div class="col-author-row">
            <span class="author-name">{{ col.author }}</span>
            <span class="author-title">{{ col.authorTitle }}</span>
          </div>

          <!-- Chapters Accordion / List -->
          <div class="chapters-preview">
            <div class="ch-preview-title">专栏大纲试读：</div>
            <div 
              v-for="ch in col.chapters" 
              :key="ch.id" 
              class="chapter-row"
              @click="actions.openChapter(col.title, ch.title, ch.summary)"
            >
              <span class="ch-status-icon">
                {{ ch.isFreeTrial ? '🟢' : '🔒' }}
              </span>
              <span class="ch-title-text">{{ ch.title }}</span>
              <span v-if="ch.isFreeTrial" class="trial-tag">免费试读</span>
              <span class="ch-duration">{{ ch.duration }}</span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="col-footer">
            <div class="col-price-box">
              <span class="price-val num-tabular">¥{{ col.price }}</span>
              <span class="origin-val num-tabular">¥{{ col.originPrice }}</span>
              <span class="sub-count">{{ col.subscriberCount }} 人已加入研读</span>
            </div>
            <div class="col-action-btns">
              <button 
                class="btn-secondary"
                @click="actions.openChapter(col.title, col.chapters[0].title, col.chapters[0].summary)"
              >
                免费试读
              </button>
              <button 
                class="btn-primary"
                @click="appState.isVipJoinModalOpen = true"
              >
                VIP 免费开通
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. COURSE TAB -->
    <div v-if="activeSubTab === 'course'" class="courses-grid animate-fade-in">
      <div v-for="course in appState.courses" :key="course.id" class="course-card">
        <div class="course-cover-wrap">
          <img :src="course.cover" class="course-cover-img" :alt="course.title" />
          <div class="course-level-tag">{{ course.level }}</div>
          <div class="course-time-tag">总时长 {{ course.totalDuration }}</div>
        </div>

        <div class="course-content">
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-desc">{{ course.description }}</p>

          <div class="course-instructor">
            讲师：<strong>{{ course.instructor }}</strong> ({{ course.instructorTitle }})
          </div>

          <!-- Progress Bar -->
          <div class="course-progress-block">
            <div class="progress-labels">
              <span>已学 {{ course.completedLessons }} / {{ course.lessonsCount }} 讲</span>
              <span class="num-tabular font-bold">{{ Math.round((course.completedLessons / course.lessonsCount) * 100) }}%</span>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                :style="{ width: `${(course.completedLessons / course.lessonsCount) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Lessons List -->
          <div class="lessons-list">
            <div 
              v-for="ls in course.lessons" 
              :key="ls.id" 
              class="lesson-item"
              @click="actions.playLesson(course.title, ls.title)"
            >
              <div class="lesson-left">
                <span class="lesson-play-icon">▶</span>
                <span class="lesson-title">{{ ls.title }}</span>
              </div>
              <div class="lesson-right">
                <span v-if="ls.completed" class="badge badge-stock-up">已学完</span>
                <span v-else-if="ls.isFreeTrial" class="trial-tag">试看</span>
                <span class="lesson-duration num-tabular">{{ ls.duration }}</span>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div class="course-card-footer">
            <span class="students-meta">{{ course.studentsCount }} 位同伴在学</span>
            <button 
              class="btn-primary"
              @click="actions.playLesson(course.title, course.lessons[0].title)"
            >
              进入课堂学习
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. LIVE TAB -->
    <div v-if="activeSubTab === 'live'" class="live-grid animate-fade-in">
      <div v-for="live in appState.liveSessions" :key="live.id" class="live-card">
        <div class="live-media-box">
          <img :src="live.cover" class="live-cover-img" :alt="live.title" />
          <div :class="['live-status-badge', live.status]">
            <span v-if="live.status === 'live'" class="live-pulse-dot"></span>
            <span>{{ live.status === 'live' ? '正在直播中' : live.status === 'upcoming' ? '预约开播' : '直播回放' }}</span>
          </div>
          <div class="live-viewers-count num-tabular">
            👥 {{ live.viewersCount }} 人在线互动
          </div>
        </div>

        <div class="live-card-body">
          <div class="live-time-schedule">{{ live.scheduledTime }}</div>
          <h3 class="live-card-title">{{ live.title }}</h3>
          <p class="live-card-desc">{{ live.description }}</p>

          <div class="live-host-row">
            <img :src="live.hostAvatar" class="live-host-avatar" alt="Host" />
            <div class="live-host-info">
              <span class="host-name">{{ live.host }}</span>
              <span class="host-title">{{ live.hostTitle }}</span>
            </div>
          </div>

          <div class="live-btn-action">
            <button 
              :class="live.status === 'live' ? 'btn-primary' : 'btn-secondary'"
              style="width: 100%; justify-content: center;"
              @click="actions.playLesson(live.title, '现场互动中：老林答星友问')"
            >
              {{ live.status === 'live' ? '🔥 立即进入直播间连麦' : '观看完整实盘回放' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { appState, actions } from '@/stores/community';

const props = defineProps<{
  initialTab?: 'column' | 'course' | 'live';
}>();

const activeSubTab = ref<'column' | 'course' | 'live'>(props.initialTab || 'column');

watch(() => props.initialTab, (newVal) => {
  if (newVal) activeSubTab.value = newVal;
});
</script>

<style scoped>
.learning-center-wrap {
  width: 100%;
}

.learning-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 8px 16px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-card);
}

.learning-tabs {
  display: flex;
  gap: 8px;
}

.l-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--radius-md);
}

.l-tab:hover {
  background: var(--bg-subtle);
  color: var(--primary-navy);
}

.l-tab.active {
  background: var(--primary-navy);
  color: #ffffff;
}

.vip-free-hint {
  font-size: 12px;
  font-weight: 700;
  color: var(--vip-gold);
  background: var(--vip-gold-light);
  border: 1px solid var(--vip-gold-border);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Columns Grid */
.columns-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.column-card {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-card);
  display: flex;
  gap: 20px;
}

.col-cover-block {
  width: 220px;
  height: 240px;
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.col-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.col-badge-count {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(15, 23, 42, 0.85);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.col-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.col-tags-row {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.col-tag {
  font-size: 11px;
  background: var(--bg-subtle);
  color: var(--primary-navy);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.col-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 4px;
}

.col-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.col-author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.author-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-navy);
}

.author-title {
  font-size: 11px;
  color: var(--text-muted);
}

.chapters-preview {
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  margin-bottom: 14px;
}

.ch-preview-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.chapter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  font-size: 12px;
  cursor: pointer;
  border-bottom: 1px dashed rgba(226, 232, 240, 0.7);
}

.chapter-row:last-child {
  border-bottom: none;
}

.chapter-row:hover .ch-title-text {
  color: var(--brand-green-hover);
  font-weight: 600;
}

.ch-title-text {
  flex: 1;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trial-tag {
  font-size: 10px;
  background: #dcfce7;
  color: #166534;
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: 700;
}

.ch-duration {
  font-size: 11px;
  color: var(--text-muted);
}

.col-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.col-price-box {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price-val {
  font-size: 18px;
  font-weight: 800;
  color: var(--brand-green-hover);
}

.origin-val {
  font-size: 12px;
  color: var(--text-muted);
  text-decoration: line-through;
}

.sub-count {
  font-size: 12px;
  color: var(--text-muted);
  margin-left: 6px;
}

.col-action-btns {
  display: flex;
  gap: 8px;
}

/* Course Grid */
.courses-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.course-card {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 20px;
  display: flex;
  gap: 20px;
  box-shadow: var(--shadow-card);
}

.course-cover-wrap {
  width: 220px;
  height: 220px;
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.course-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-level-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(16, 185, 129, 0.9);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
}

.course-time-tag {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(15, 23, 42, 0.85);
  color: #ffffff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.course-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
}

.course-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 4px 0 10px 0;
}

.course-instructor {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.course-progress-block {
  margin-bottom: 12px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.progress-track {
  height: 6px;
  background: var(--bg-subtle);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--brand-green);
  border-radius: 99px;
  transition: width 0.3s ease;
}

.lessons-list {
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  margin-bottom: 12px;
}

.lesson-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 12px;
  cursor: pointer;
}

.lesson-item:hover .lesson-title {
  color: var(--brand-green);
}

.lesson-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lesson-play-icon {
  font-size: 10px;
  color: var(--brand-green);
}

.lesson-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lesson-duration {
  font-size: 11px;
  color: var(--text-muted);
}

.course-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.students-meta {
  font-size: 12px;
  color: var(--text-muted);
}

/* Live Grid */
.live-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.live-card {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
}

.live-media-box {
  height: 180px;
  position: relative;
}

.live-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-status-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.live-status-badge.live {
  background: var(--danger-red);
  color: #ffffff;
}

.live-status-badge.upcoming {
  background: var(--primary-navy);
  color: #ffffff;
}

.live-status-badge.replay {
  background: #475569;
  color: #ffffff;
}

.live-pulse-dot {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

.live-viewers-count {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(15, 23, 42, 0.85);
  color: #ffffff;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
}

.live-card-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.live-time-schedule {
  font-size: 12px;
  font-weight: 700;
  color: var(--vip-gold);
  margin-bottom: 6px;
}

.live-card-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 6px;
}

.live-card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.live-host-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.live-host-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.live-host-info {
  display: flex;
  flex-direction: column;
}

.host-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-navy);
}

.host-title {
  font-size: 10px;
  color: var(--text-muted);
}

.live-btn-action {
  margin-top: auto;
}
</style>
