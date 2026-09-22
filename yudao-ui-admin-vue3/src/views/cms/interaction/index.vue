<template>
  <div class="live-manage-layout animate-fade-in">
    <!-- Top Header Bar: Clean title on left, action buttons on right -->
    <header class="cms-header-bar">
      <h1 class="header-title">直播管理</h1>

      <div class="header-actions">
        <button class="btn-sync-wemeet" @click="actions.syncTencentMeetings" title="从腾讯会议开放平台拉取最新云录制与纪要">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>同步腾讯会议</span>
        </button>

        <button class="btn-new-meeting" @click="openCreateMeetingModal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>发起直播会议</span>
        </button>
      </div>
    </header>

    <!-- Main Content Container: Pure White Background -->
    <main class="live-main-container">

      <!-- 2. Controls & Filters Toolbar -->
      <div class="filters-toolbar-row">
        <div class="filter-dropdown-group">
          <!-- Filter 1: Creator -->
          <div class="select-wrapper">
            <select v-model="filterCreator" class="filter-select">
              <option value="">全部创建人</option>
              <option value="志诚">志诚</option>
              <option value="若琪">若琪</option>
              <option value="老林说宏观">老林说宏观</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>

          <!-- Filter 2: Meeting Status -->
          <div class="select-wrapper">
            <select v-model="filterStatus" class="filter-select">
              <option value="">选择会议状态</option>
              <option value="upcoming">待开始</option>
              <option value="live">进行中</option>
              <option value="finished">已结束 (含录播)</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>

          <!-- Filter 3: Column Tag -->
          <div class="select-wrapper">
            <select v-model="filterColumn" class="filter-select">
              <option value="">选择关联专栏</option>
              <option v-for="col in appState.columns" :key="col.id" :value="col.title">
                {{ col.title }}
              </option>
            </select>
            <span class="select-arrow">▾</span>
          </div>

          <!-- Search Input -->
          <div class="search-input-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              v-model="searchKeyword" 
              type="text" 
              placeholder="搜索会议主题 / 会议号..." 
              class="search-text-input"
            />
            <span v-if="searchKeyword" class="clear-search-btn" @click="searchKeyword = ''">✕</span>
          </div>
        </div>

        <button class="btn-more-filters" @click="resetFilters">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span>重置筛选</span>
        </button>
      </div>

      <!-- 3. Tencent Meeting Records Table -->
      <div class="table-card-wrapper">
        <table class="meeting-records-table">
          <thead>
            <tr>
              <th style="min-width: 150px;">会议号</th>
              <th style="min-width: 380px;">会议主题</th>
              <th style="min-width: 100px;">创建人</th>
              <th style="min-width: 110px;">会议状态</th>
              <th style="min-width: 170px;">预计开始时间</th>
              <th style="min-width: 170px;">实际开始时间</th>
              <th style="min-width: 150px; text-align: right;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="meeting in paginatedMeetings" :key="meeting.id" class="table-data-row">
              <!-- 会议号 -->
              <td>
                <div class="meeting-code-cell" @click="copyText(meeting.meetingCode.replace(/\s+/g, ''))" title="点击复制完整会议号">
                  <span class="code-digits">{{ meeting.meetingCode }}</span>
                  <button class="btn-copy-code" title="复制会议号">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </td>

              <!-- 会议主题 -->
              <td>
                <div class="meeting-topic-cell">
                  <span class="topic-title-text" :title="meeting.title">{{ meeting.title }}</span>
                </div>
              </td>

              <!-- 创建人 -->
              <td>
                <span class="creator-name">{{ meeting.creator }}</span>
              </td>

              <!-- 会议状态 -->
              <td>
                <div class="status-indicator-cell">
                  <span :class="['status-dot', 'dot-' + meeting.status]"></span>
                  <span :class="['status-text', 'text-' + meeting.status]">
                    {{ getStatusLabel(meeting.status) }}
                  </span>
                </div>
              </td>

              <!-- 预计开始时间 -->
              <td>
                <span class="time-cell-text">{{ meeting.scheduledStartTime }}</span>
              </td>

              <!-- 实际开始时间 -->
              <td>
                <span class="time-cell-text">{{ meeting.actualStartTime || '——' }}</span>
              </td>

              <!-- 操作 -->
              <td style="text-align: right;">
                <div class="action-links-row">
                  <!-- 待开始 -->
                  <template v-if="meeting.status === 'upcoming'">
                    <a 
                      :href="meeting.joinUrl" 
                      target="_blank" 
                      class="op-link-btn enter-btn" 
                      @click="handleEnterMeeting(meeting)"
                    >
                      进入会议
                    </a>
                    <button class="op-link-btn danger-btn" @click="handleDelete(meeting)">
                      删除
                    </button>
                  </template>

                  <!-- 进行中 -->
                  <template v-else-if="meeting.status === 'live'">
                    <a 
                      :href="meeting.joinUrl" 
                      target="_blank" 
                      class="op-link-btn live-btn" 
                      @click="handleEnterMeeting(meeting)"
                    >
                      进入会议
                    </a>
                    <button class="op-link-btn danger-btn" @click="handleDelete(meeting)">
                      删除
                    </button>
                  </template>

                  <!-- 已结束 (获取会议记录，拿到录播) -->
                  <template v-else>
                    <button class="op-link-btn replay-btn" @click="openRecordingModal(meeting)" title="查看并播放腾讯会议云录制视频">
                      查看录屏
                    </button>
                    <button 
                      v-if="!meeting.isSettledToColumn" 
                      class="op-link-btn settle-btn" 
                      @click="settleToColumn(meeting)"
                      title="将录播与 AI 纪要沉淀至关联专栏"
                    >
                      沉淀
                    </button>
                    <button class="op-link-btn danger-btn" @click="handleDelete(meeting)">
                      删除
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty Filter Results -->
        <div v-if="filteredMeetings.length === 0" class="empty-table-state">
          <p class="empty-msg">暂无匹配的会议与云录制记录</p>
          <button class="btn-clear-filters" @click="resetFilters">清空过滤条件</button>
        </div>

        <!-- Table Pagination Bar -->
        <div class="table-pagination-bar" v-if="filteredMeetings.length > 0">
          <div class="pagination-left-info">
            <span class="total-text">共 <strong class="num-highlight">{{ totalCount }}</strong> 条</span>
            <div class="page-size-selector">
              <select v-model.number="pageSize" class="page-size-select">
                <option :value="10">10 条/页</option>
                <option :value="20">20 条/页</option>
                <option :value="50">50 条/页</option>
                <option :value="100">100 条/页</option>
              </select>
              <span class="select-arrow-mini">▾</span>
            </div>
          </div>

          <div class="pagination-right-controls" v-if="totalPages > 1">
            <button 
              class="page-nav-btn prev-btn" 
              :disabled="currentPage <= 1"
              @click="prevPage"
            >
              上一页
            </button>

            <div class="page-number-chips">
              <button 
                v-for="(p, idx) in visiblePages" 
                :key="idx"
                :class="['page-chip-btn', { active: p === currentPage, ellipsis: p === '...' }]"
                :disabled="p === '...'"
                @click="typeof p === 'number' && goToPage(p)"
              >
                {{ p }}
              </button>
            </div>

            <button 
              class="page-nav-btn next-btn" 
              :disabled="currentPage >= totalPages"
              @click="nextPage"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal 1: 发起直播会议 (对接腾讯会议) -->
    <transition name="modal-fade">
      <div v-if="showCreateModal" class="modal-backdrop" @click.self="showCreateModal = false">
        <div class="modal-dialog-box animate-slide-up">
          <div class="modal-header">
            <h3 class="modal-title">发起直播会议 (对接腾讯会议)</h3>
            <button class="modal-close-btn" @click="showCreateModal = false">✕</button>
          </div>

          <div class="modal-body-scroll">
            <div class="wemeet-notice-pill">
              <span class="notice-icon">ℹ️</span>
              <span>创建后将自动在腾讯会议开放平台生成会议室，并开启云录制与 AI 纪要。</span>
            </div>

            <div class="form-group">
              <label class="form-label required">会议主题</label>
              <input 
                v-model="createForm.title" 
                type="text" 
                class="form-input" 
                placeholder="例如：【AI产业】剖析: 大模型产业落地与商业闭环研讨"
              />
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label required">关联专栏</label>
                <select v-model="createForm.columnId" class="form-select">
                  <option v-for="col in appState.columns" :key="col.id" :value="col.id">
                    {{ col.title }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">创建人 / 主持人</label>
                <select v-model="createForm.creator" class="form-select">
                  <option value="志诚">志诚 (资深分析师)</option>
                  <option value="若琪">若琪 (前沿产业顾问)</option>
                  <option value="老林说宏观">老林说宏观 (星主)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">预计开始时间</label>
              <input 
                v-model="createForm.scheduledStartTime" 
                type="text" 
                class="form-input" 
                placeholder="例如：2026-09-28 14:00"
              />
            </div>

            <div class="wemeet-features-box">
              <div class="feature-item">
                <label class="feature-label">
                  <input type="checkbox" checked disabled class="feature-checkbox" />
                  <span>自动开启腾讯会议云端高清录制 (1080P)</span>
                </label>
                <span class="feature-sub">会议结束后自动抓取 MP4 视频切片</span>
              </div>

              <div class="feature-item">
                <label class="feature-label">
                  <input type="checkbox" checked disabled class="feature-checkbox" />
                  <span>自动生成 AI 智能会议纪要与逐字稿</span>
                </label>
                <span class="feature-sub">智能提取核心观点并支持一键沉淀到专栏长文</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showCreateModal = false">取消</button>
            <button class="btn-submit" @click="submitCreateMeeting">生成会议室并排期</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal 2: 腾讯会议云录播播放与 AI 纪要详情 (获取会议记录，拿到录播) -->
    <transition name="modal-fade">
      <div v-if="showDetailModal && activeDetailMeeting" class="modal-backdrop" @click.self="showDetailModal = false">
        <div class="modal-dialog-box modal-xl animate-slide-up">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <h3 class="modal-title">{{ activeDetailMeeting.title }}</h3>
              <span class="modal-code-chip">会议号: {{ activeDetailMeeting.meetingCode }}</span>
            </div>
            <button class="modal-close-btn" @click="showDetailModal = false">✕</button>
          </div>

          <div class="modal-body-scroll">
            <!-- Simulated Tencent Cloud Recording Video Player -->
            <div class="video-player-container">
              <div class="player-aspect-box">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80" 
                  class="player-poster" 
                  alt="Video Recording Poster" 
                />
                <div class="player-overlay-center">
                  <button class="btn-play-trigger" @click="playInGlobalPlayer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                  <span class="play-label">腾讯会议云录制切片播放</span>
                </div>

                <div class="player-bottom-bar">
                  <span class="badge-rec">REC 腾讯云录制</span>
                  <span class="rec-meta">时长: {{ activeDetailMeeting.recordDuration || '1小时38分钟' }} | 大小: {{ activeDetailMeeting.recordSize || '1.42 GB' }} | 格式: 1080P MP4</span>
                </div>
              </div>
            </div>

            <!-- AI Meeting Minutes & Summary -->
            <div class="minutes-content-box">
              <div class="minutes-header">
                <div class="minutes-title-row">
                  <span class="ai-spark-icon">✨</span>
                  <h4 class="minutes-heading">AI 智能会议纪要与核心讨论要点</h4>
                </div>

                <button 
                  v-if="!activeDetailMeeting.isSettledToColumn" 
                  class="btn-settle-action" 
                  @click="settleToColumn(activeDetailMeeting)"
                >
                  📥 一键将本期录播与纪要沉淀入专栏
                </button>
                <span v-else class="settled-status-tag">✓ 已沉淀至专栏长文</span>
              </div>

              <!-- Executive Summary -->
              <div class="summary-highlight-card">
                <strong class="summary-lead">会议总结概览：</strong>
                <p class="summary-paragraph">{{ activeDetailMeeting.summary }}</p>
              </div>

              <!-- Key Discussion Points -->
              <div class="minutes-keypoints-list" v-if="activeDetailMeeting.aiMinutes && activeDetailMeeting.aiMinutes.length">
                <h5 class="section-subheading">核心研讨切片与纪要清单：</h5>
                <div 
                  v-for="(point, idx) in activeDetailMeeting.aiMinutes" 
                  :key="idx" 
                  class="minute-point-row"
                >
                  <div class="point-bullet">{{ idx + 1 }}</div>
                  <p class="point-text">{{ point }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="copyText(activeDetailMeeting.recordUrl || 'https://cdn.wealth-circle.com/tencent-meeting/rec.mp4')">
              复制录播直链
            </button>
            <button class="btn-cancel" @click="showDetailModal = false">关闭</button>
            <button class="btn-submit" @click="playInGlobalPlayer">立即观看录播</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { appState, actions } from '../store';
import type { TencentMeetingRecord } from '../types';
import '../client.css';

defineOptions({ name: 'CmsLive' })

// Filter states
const filterCreator = ref('');
const filterStatus = ref('');
const filterColumn = ref('');
const searchKeyword = ref('');

// Filtered Tencent Meetings
const filteredMeetings = computed(() => {
  return appState.tencentMeetings.filter(m => {
    if (filterCreator.value && m.creator !== filterCreator.value) {
      return false;
    }
    if (filterStatus.value && m.status !== filterStatus.value) {
      return false;
    }
    if (filterColumn.value && m.columnTag !== filterColumn.value) {
      return false;
    }
    if (searchKeyword.value.trim()) {
      const q = searchKeyword.value.trim().toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchCode = m.meetingCode.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''));
      const matchCreator = m.creator.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchCreator) {
        return false;
      }
    }
    return true;
  });
});

// Pagination states
const currentPage = ref(1);
const pageSize = ref(20); // 默认每页 20 条

// Reset to page 1 whenever filters or page size change
watch([filterCreator, filterStatus, filterColumn, searchKeyword, pageSize], () => {
  currentPage.value = 1;
});

const totalCount = computed(() => filteredMeetings.value.length);
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value) || 1);

const paginatedMeetings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredMeetings.value.slice(start, start + pageSize.value);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Visible page numbers array with ellipsis
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
});

const getStatusLabel = (status: 'upcoming' | 'live' | 'finished') => {
  if (status === 'upcoming') return '待开始';
  if (status === 'live') return '进行中';
  return '已结束';
};

const copyText = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
  actions.showToast(`已复制：${text}`);
};

const resetFilters = () => {
  filterCreator.value = '';
  filterStatus.value = '';
  filterColumn.value = '';
  searchKeyword.value = '';
};

// Modal 1: Create Meeting
const showCreateModal = ref(false);
const createForm = ref({
  title: '',
  columnId: appState.columns[0]?.id || 'col-ai-1',
  creator: '志诚',
  scheduledStartTime: '2026-09-28 14:00'
});

const openCreateMeetingModal = () => {
  createForm.value = {
    title: '',
    columnId: appState.columns[0]?.id || 'col-ai-1',
    creator: '志诚',
    scheduledStartTime: '2026-09-28 14:00'
  };
  showCreateModal.value = true;
};

const submitCreateMeeting = () => {
  if (!createForm.value.title.trim()) {
    actions.showToast('请输入会议主题');
    return;
  }
  const col = appState.columns.find(c => c.id === createForm.value.columnId);
  actions.createTencentMeeting({
    title: createForm.value.title.trim(),
    columnId: createForm.value.columnId,
    columnTag: col ? col.title : '「AI产业」剖析',
    creator: createForm.value.creator,
    scheduledStartTime: createForm.value.scheduledStartTime
  });
  showCreateModal.value = false;
};

// Modal 2: Meeting Detail (Recording & AI Minutes)
const showDetailModal = ref(false);
const activeDetailMeeting = ref<TencentMeetingRecord | null>(null);

const openRecordingModal = (m: TencentMeetingRecord) => {
  activeDetailMeeting.value = m;
  showDetailModal.value = true;
};

const openMinutesDetail = (m: TencentMeetingRecord) => {
  activeDetailMeeting.value = m;
  showDetailModal.value = true;
};

const playInGlobalPlayer = () => {
  if (activeDetailMeeting.value) {
    actions.playLesson(activeDetailMeeting.value.columnTag || '腾讯会议云录播', activeDetailMeeting.value.title);
  }
};

const handleEnterMeeting = (m: TencentMeetingRecord) => {
  actions.showToast(`正在跳转腾讯会议，会议号：${m.meetingCode}`);
};

const handleDelete = (m: TencentMeetingRecord) => {
  if (confirm(`确定要删除会议《${m.title}》吗？`)) {
    actions.deleteTencentMeeting(m.id);
  }
};

const settleToColumn = (m: TencentMeetingRecord) => {
  actions.settleMeetingToColumn(m.id, m.columnId);
};
</script>

<style scoped>
.live-manage-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #ffffff;
  font-size: 14px;
}

/* Top Header Bar: Clean & Minimalist */
.cms-header-bar {
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
  z-index: 10;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-sync-wemeet {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #2563eb;
  color: #ffffff;
  border: 1px solid #2563eb;
  padding: 7px 15px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.1);
}

.btn-sync-wemeet:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-sync-wemeet:active {
  transform: translateY(1px);
}

.btn-new-meeting {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  padding: 7px 15px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-new-meeting:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

.btn-new-meeting:active {
  transform: translateY(1px);
}

/* Main Container: Pure White Canvas */
.live-main-container {
  flex: 1;
  background: #ffffff;
  padding: 24px 28px 64px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Filters Toolbar */
.filters-toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-dropdown-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.filter-select {
  appearance: none;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 7px 30px 7px 12px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
}

.filter-select:hover, .filter-select:focus {
  border-color: #cbd5e1;
}

.select-arrow {
  position: absolute;
  right: 10px;
  font-size: 10px;
  color: #94a3b8;
  pointer-events: none;
}

.search-input-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 12px;
  width: 250px;
}

.search-text-input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  width: 100%;
}

.clear-search-btn {
  font-size: 12px;
  color: #94a3b8;
  cursor: pointer;
}

.btn-more-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  padding: 6px 10px;
  white-space: nowrap;
}

.btn-more-filters:hover {
  color: #0f172a;
}

/* 3. Table Wrapper */
.table-card-wrapper {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow-x: auto;
  width: 100%;
}

.meeting-records-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1100px;
}

.meeting-records-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.meeting-records-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  white-space: nowrap;
}

.table-data-row:hover td {
  background: #fcfcfd;
}

/* Column 1: 会议号 */
.meeting-code-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.code-digits {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}

.btn-copy-code {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
}

.meeting-code-cell:hover .btn-copy-code {
  color: #2563eb;
}

/* Column 2: 会议主题 */
.meeting-topic-cell {
  display: flex;
  align-items: center;
  white-space: nowrap;
  max-width: 520px;
}

.topic-title-text {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Column 4: 创建人 */
.creator-name {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
  white-space: nowrap;
}

/* Column 5: 会议状态 */
.status-indicator-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.dot-upcoming {
  background: #f59e0b;
}

.status-dot.dot-live {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
  animation: pulse-dot 1.5s infinite;
}

.status-dot.dot-finished {
  background: #94a3b8;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.status-text.text-upcoming {
  color: #d97706;
}

.status-text.text-live {
  color: #059669;
}

.status-text.text-finished {
  color: #64748b;
}

/* Column 6 & 7: 时间 */
.time-cell-text {
  font-size: 14px;
  color: #64748b;
  font-family: ui-monospace, monospace;
  white-space: nowrap;
}

/* Column 8: 操作链接 */
.action-links-row {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  white-space: nowrap;
}

.op-link-btn {
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  padding: 2px 4px;
  white-space: nowrap;
}

.op-link-btn.enter-btn {
  color: #16a34a;
}
.op-link-btn.enter-btn:hover {
  text-decoration: underline;
}

.op-link-btn.live-btn {
  color: #059669;
  font-weight: 700;
}

.op-link-btn.replay-btn {
  color: #2563eb;
}
.op-link-btn.replay-btn:hover {
  text-decoration: underline;
}

.op-link-btn.settle-btn {
  color: #059669;
}
.op-link-btn.settle-btn:hover {
  text-decoration: underline;
}

.op-link-btn.danger-btn {
  color: #ef4444;
}
.op-link-btn.danger-btn:hover {
  text-decoration: underline;
}

/* Empty State in Table */
.empty-table-state {
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-msg {
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
}

.btn-clear-filters {
  font-size: 12px;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
}

/* Table Pagination Bar */
.table-pagination-bar {
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  font-size: 14px;
  color: #64748b;
  gap: 16px;
  flex-wrap: wrap;
}

.pagination-left-info {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
}

.total-text {
  color: #64748b;
  font-size: 14px;
}

.num-highlight {
  color: #0f172a;
  font-weight: 600;
}

.page-size-selector {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.page-size-select {
  appearance: none;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 28px 5px 10px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}

.page-size-select:hover, .page-size-select:focus {
  border-color: #cbd5e1;
}

.select-arrow-mini {
  position: absolute;
  right: 9px;
  font-size: 10px;
  color: #94a3b8;
  pointer-events: none;
}

.pagination-right-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-nav-btn {
  font-size: 14px;
  padding: 5px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-nav-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

.page-nav-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background: #f8fafc;
}

.page-number-chips {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-chip-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-chip-btn:hover:not(.active):not(.ellipsis) {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

.page-chip-btn.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  font-weight: 600;
}

.page-chip-btn.ellipsis {
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: default;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-dialog-box {
  background: #ffffff;
  border-radius: 10px;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.modal-dialog-box.modal-xl {
  max-width: 720px;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.modal-code-chip {
  font-size: 11.5px;
  font-family: monospace;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  color: #94a3b8;
  cursor: pointer;
}

.modal-close-btn:hover {
  color: #0f172a;
}

.modal-body-scroll {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wemeet-notice-pill {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  font-size: 12.5px;
  padding: 8px 12px;
  border-radius: 6px;
  line-height: 1.4;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input, .form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  background: #ffffff;
  transition: border-color 0.15s ease;
}

.form-input:focus, .form-select:focus {
  border-color: #2563eb;
}

.wemeet-features-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.feature-checkbox {
  accent-color: #2563eb;
}

.feature-sub {
  font-size: 11.5px;
  color: #64748b;
  padding-left: 24px;
}

/* Video Player in Modal */
.video-player-container {
  border-radius: 8px;
  overflow: hidden;
  background: #0f172a;
}

.player-aspect-box {
  position: relative;
  width: 100%;
  height: 280px;
}

.player-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.player-overlay-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.btn-play-trigger {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.95);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}

.btn-play-trigger:hover {
  transform: scale(1.08);
  background: #1d4ed8;
}

.play-label {
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
}

.player-bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 14px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-rec {
  background: #ef4444;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.rec-meta {
  color: #e2e8f0;
  font-size: 11px;
}

/* Minutes Content Box */
.minutes-content-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.minutes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.minutes-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-spark-icon {
  font-size: 16px;
}

.minutes-heading {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-settle-action {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #059669;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-settle-action:hover {
  background: #d1fae5;
}

.settled-status-tag {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
}

.summary-highlight-card {
  background: #f8fafc;
  border-left: 3px solid #2563eb;
  padding: 10px 14px;
  border-radius: 0 6px 6px 0;
}

.summary-lead {
  font-size: 13px;
  color: #1e293b;
}

.summary-paragraph {
  font-size: 13px;
  color: #475569;
  line-height: 1.55;
  margin: 4px 0 0 0;
}

.section-subheading {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 8px 0;
}

.minutes-keypoints-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.minute-point-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
}

.point-bullet {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.point-text {
  margin: 0;
  flex: 1;
}

.modal-footer {
  padding: 14px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #f8fafc;
}

.btn-submit {
  padding: 8px 18px;
  background: #2563eb;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}
.btn-submit:hover {
  background: #1d4ed8;
}

/* Modal animation */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
