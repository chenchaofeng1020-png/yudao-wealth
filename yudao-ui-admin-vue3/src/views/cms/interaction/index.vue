<template>
  <div class="live-manage-layout animate-fade-in">
    <!-- Top Header Bar: Clean title on left, action buttons on right -->
    <header class="cms-header-bar">
      <h1 class="header-title">直播管理</h1>

      <div class="header-actions">
        <button class="btn-sync-wemeet is-ghost" @click="openCategoryModal" title="维护直播分类，保存后 C 端同步生效">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          <span>分类设置</span>
        </button>

        <button class="btn-sync-wemeet" @click="actions.syncTencentMeetings" title="从腾讯会议开放平台拉取最新会议排期、云录制与纪要">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>同步腾讯会议</span>
        </button>
      </div>
    </header>

    <!-- Main Content Container: Pure White Background -->
    <main class="live-main-container">

      <!-- 2. Controls & Filters Toolbar -->
      <div class="filters-toolbar-row">
        <div class="filter-dropdown-group">
          <!-- Filter 1: 主讲人（从同步数据自动带出） -->
          <div class="select-wrapper">
            <select v-model="filterCreator" class="filter-select">
              <option value="">全部主讲人</option>
              <option v-for="name in creatorOptions" :key="name" :value="name">{{ name }}</option>
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

          <!-- Filter 3: 直播分类 -->
          <div class="select-wrapper">
            <select v-model="filterColumn" class="filter-select">
              <option value="">选择分类</option>
              <option v-for="cat in appState.liveCategories" :key="cat" :value="cat">
                {{ cat }}
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
              <th style="min-width: 130px;">会议号</th>
              <th style="min-width: 320px;">会议主题</th>
              <th style="min-width: 110px;">主讲人</th>
              <th style="min-width: 90px;">会议状态</th>
              <th style="min-width: 90px;">上架状态</th>
              <th style="min-width: 80px;">单购价</th>
              <th style="min-width: 90px;">已解锁</th>
              <th style="min-width: 150px;">预计开始时间</th>
              <th style="min-width: 150px;">实际开始时间</th>
              <th class="col-actions">操作</th>
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

              <!-- 主讲人 -->
              <td>
                <div class="creator-cell">
                  <img v-if="meeting.creatorAvatar" :src="meeting.creatorAvatar" :alt="meeting.creator" class="creator-avatar" />
                  <span class="creator-name">{{ meeting.creator }}</span>
                </div>
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

              <!-- 上架状态 -->
              <td>
                <span v-if="getShelfState(meeting)" :class="['shelf-state-tag', 'shelf-' + getShelfState(meeting)]">
                  {{ getShelfLabel(meeting) }}
                </span>
                <span v-else class="cell-empty-text">—</span>
              </td>

              <!-- 单购价 -->
              <td>
                <span v-if="meeting.isOnShelf === true && meeting.replayPrice" class="price-cell-text num-highlight">¥{{ meeting.replayPrice }}</span>
                <span v-else class="cell-empty-text">—</span>
              </td>

              <!-- 已解锁人数 -->
              <td>
                <span v-if="meeting.isOnShelf === true" class="num-cell-text num-highlight">{{ meeting.purchasedCount || 0 }}</span>
                <span v-else class="cell-empty-text">—</span>
              </td>

              <!-- 预计开始时间 -->
              <td>
                <span class="time-cell-text">{{ meeting.scheduledStartTime }}</span>
              </td>

              <!-- 实际开始时间 -->
              <td>
                <span class="time-cell-text">{{ meeting.actualStartTime || '——' }}</span>
              </td>

              <!-- 操作：设置 + 更多（更多内按状态收纳） -->
              <td class="col-actions" :class="{ 'menu-open': openMoreMenuId === meeting.id }">
                <div class="action-links-row">
                  <button class="op-link-btn replay-btn" @click="openRecordingModal(meeting)" title="编辑会议简介、定价与 AI 纪要">
                    设置
                  </button>
                  <div class="more-wrap">
                    <button class="op-link-btn more-btn" @click.stop="toggleMoreMenu(meeting.id)">
                      更多
                    </button>
                    <div v-if="openMoreMenuId === meeting.id" class="more-menu">
                      <button
                        v-if="meeting.status === 'finished'"
                        class="more-menu-item"
                        @click="menuAction('record', meeting)"
                      >
                        打开录屏
                      </button>
                      <button
                        v-if="meeting.status === 'finished' && getShelfState(meeting) === 'pending'"
                        class="more-menu-item"
                        @click="menuAction('shelf', meeting)"
                      >
                        上架录播
                      </button>
                      <button
                        v-if="meeting.status === 'finished' && getShelfState(meeting) === 'on'"
                        class="more-menu-item"
                        @click="menuAction('unshelf', meeting)"
                      >
                        下架录播
                      </button>
                      <button
                        v-if="meeting.status === 'finished' && getShelfState(meeting) === 'off'"
                        class="more-menu-item"
                        @click="menuAction('shelf', meeting)"
                      >
                        重新上架
                      </button>
                      <button class="more-menu-item is-danger" @click="menuAction('delete', meeting)">
                        删除
                      </button>
                    </div>
                  </div>
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

    <!-- Drawer: 录播设置（右侧抽屉：预览云录制 + 编辑分类/主讲人/封面/简介/纪要/定价/关联商品 + 订单数据） -->
    <Teleport to="body">
    <transition name="drawer-slide">
      <div v-if="showDetailModal && activeDetailMeeting" class="cms-drawer-backdrop" @click.self="showDetailModal = false">
        <div class="cms-drawer-panel">
          <div class="cms-drawer-header">
            <div class="modal-title-wrap">
              <h3 class="drawer-h3">{{ activeDetailMeeting.title }}</h3>
              <span class="modal-code-chip">会议号: {{ activeDetailMeeting.meetingCode }}</span>
              <span :class="['shelf-state-tag', 'shelf-' + getShelfState(activeDetailMeeting)]">
                {{ getShelfLabel(activeDetailMeeting) }}
              </span>
            </div>
            <button class="modal-close-btn" @click="showDetailModal = false">✕</button>
          </div>

          <div class="drawer-body">
            <!-- Simulated Tencent Cloud Recording Video Player -->
            <div class="video-player-container">
              <div class="player-aspect-box">
                <img
                  :src="activeDetailMeeting.cover"
                  class="player-poster"
                  alt="Video Recording Poster"
                />
                <div class="player-overlay-center">
                  <button class="btn-play-trigger" @click="previewRecording">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                  <span class="play-label">腾讯会议云录制切片预览</span>
                </div>

                <div class="player-bottom-bar">
                  <span class="badge-rec">REC 腾讯云录制</span>
                  <span class="rec-meta">时长: {{ activeDetailMeeting.recordDuration || '1小时38分钟' }} | 大小: {{ activeDetailMeeting.recordSize || '1.42 GB' }} | 格式: 1080P MP4</span>
                </div>
              </div>
            </div>

            <!-- 订单数据行（绑定商城虚拟商品后自动统计） -->
            <div class="detail-stats-row">
              <div class="detail-stat-item">
                <span class="detail-stat-label">参会人次</span>
                <span class="detail-stat-value num-highlight">{{ activeDetailMeeting.participantsCount || 0 }}</span>
              </div>
              <div class="detail-stat-item">
                <span class="detail-stat-label">已解锁人数</span>
                <span class="detail-stat-value num-highlight">{{ activeDetailMeeting.purchasedCount || 0 }}</span>
              </div>
              <div class="detail-stat-item">
                <span class="detail-stat-label">单购价</span>
                <span class="detail-stat-value num-highlight">{{ activeDetailMeeting.replayPrice ? `¥${activeDetailMeeting.replayPrice}` : '—' }}</span>
              </div>
              <div class="detail-stat-item">
                <span class="detail-stat-label">上架时间</span>
                <span class="detail-stat-value">{{ activeDetailMeeting.shelfTime || '—' }}</span>
              </div>
              <button class="btn-view-orders" @click="viewBoundOrders">查看商城订单</button>
            </div>

            <!-- 编辑：商品关联 / 定价 / 简介 / AI 纪要 -->
            <div class="minutes-content-box">
              <div class="minutes-header">
                <div class="minutes-title-row">
                  <span class="ai-spark-icon">✨</span>
                  <h4 class="minutes-heading">内容编辑（保存后 C 端同步更新）</h4>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">直播分类</label>
                  <select v-model="detailEditForm.columnTag" class="form-input product-select">
                    <option value="">未分类</option>
                    <option v-for="cat in appState.liveCategories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">主讲人</label>
                  <select v-model="detailEditForm.creator" class="form-input product-select">
                    <option value="">请选择星球成员</option>
                    <option v-for="mb in memberOptions" :key="mb.name" :value="mb.name">{{ mb.name }}</option>
                  </select>
                </div>
              </div>

              <!-- 封面图 -->
              <div class="form-group">
                <label class="form-label">封面图</label>
                <div class="cover-edit-row">
                  <img :src="detailEditForm.cover || activeDetailMeeting.cover" alt="封面预览" class="cover-preview-img" />
                  <div class="cover-edit-side">
                    <label class="btn-upload-cover">
                      更换封面
                      <input type="file" accept="image/*" class="cover-file-input" @change="handleCoverChange" />
                    </label>
                    <p class="cover-edit-tip">默认使用腾讯会议云录制切片截图</p>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">关联商城商品</label>
                <p class="form-label-sub">用户单场付费将按该商品下单生成订单；未选择时默认按单购价自动创建虚拟商品</p>
                <select v-model="detailEditForm.productId" class="form-input product-select">
                  <option value="">按单购价自动创建虚拟商品（默认）</option>
                  <option v-for="p in mallProductsMock" :key="p.id" :value="p.id">
                    {{ p.name }} · ¥{{ p.price }}
                  </option>
                </select>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">单购价（元）</label>
                  <input v-model.number="detailEditForm.replayPrice" type="number" min="0" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">划线原价（元）</label>
                  <input v-model.number="detailEditForm.originPrice" type="number" min="0" class="form-input" placeholder="选填" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">直播简介</label>
                <textarea v-model="detailEditForm.summary" class="form-textarea" rows="3"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">AI 会议纪要</label>

                <div class="rich-toolbar">
                  <button type="button" title="撤销" @mousedown.prevent="execRichCmd('undo')">↺</button>
                  <button type="button" title="重做" @mousedown.prevent="execRichCmd('redo')">↻</button>
                  <span class="rich-divider"></span>
                  <button type="button" title="加粗" @mousedown.prevent="execRichCmd('bold')"><strong>B</strong></button>
                  <button type="button" title="斜体" @mousedown.prevent="execRichCmd('italic')"><em>I</em></button>
                  <button type="button" title="下划线" @mousedown.prevent="execRichCmd('underline')"><u>U</u></button>
                  <button type="button" title="删除线" @mousedown.prevent="execRichCmd('strikeThrough')"><s>S</s></button>
                  <span class="rich-divider"></span>
                  <button type="button" title="章节标题" @mousedown.prevent="execRichCmd('formatBlock', 'h2')">H2</button>
                  <button type="button" title="小节标题" @mousedown.prevent="execRichCmd('formatBlock', 'h3')">H3</button>
                  <button type="button" title="正文段落" @mousedown.prevent="execRichCmd('formatBlock', 'p')">正文</button>
                  <span class="rich-divider"></span>
                  <button type="button" title="无序列表" @mousedown.prevent="execRichCmd('insertUnorderedList')">• 列表</button>
                  <button type="button" title="有序列表" @mousedown.prevent="execRichCmd('insertOrderedList')">1. 列表</button>
                  <button type="button" title="引用" @mousedown.prevent="execRichCmd('formatBlock', 'blockquote')">引用</button>
                  <button type="button" title="代码块" @mousedown.prevent="execRichCmd('formatBlock', 'pre')">代码</button>
                  <span class="rich-divider"></span>
                  <button type="button" title="左对齐" @mousedown.prevent="execRichCmd('justifyLeft')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="15" y2="12"></line><line x1="3" y1="18" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <button type="button" title="居中对齐" @mousedown.prevent="execRichCmd('justifyCenter')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <line x1="3" y1="6" x2="21" y2="6"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </button>
                  <button type="button" title="右对齐" @mousedown.prevent="execRichCmd('justifyRight')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <line x1="3" y1="6" x2="21" y2="6"></line><line x1="9" y1="12" x2="21" y2="12"></line><line x1="6" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </button>
                  <span class="rich-divider"></span>
                  <button type="button" title="插入链接" @mousedown.prevent="insertMinutesLink">链接</button>
                  <button type="button" title="插入图片" @mousedown.prevent="handleMinutesImageButton">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </button>
                  <button type="button" title="插入分割线" @mousedown.prevent="execRichCmd('insertHorizontalRule')">分割线</button>
                  <span class="rich-divider"></span>
                  <button type="button" title="清除格式" @mousedown.prevent="execRichCmd('removeFormat')">清除格式</button>
                </div>

                <input
                  ref="minutesImageInputRef"
                  type="file"
                  accept="image/*"
                  multiple
                  style="display: none"
                  @change="handleMinutesImageFilesChange"
                />

                <div
                  ref="richEditorRef"
                  class="rich-editor"
                  contenteditable="true"
                  data-placeholder="粘贴或输入会议纪要内容，支持截图直接粘贴..."
                  @input="onRichInput"
                  @paste="handleMinutesPaste"
                ></div>
              </div>
            </div>
          </div>

          <div class="drawer-footer">
            <button class="btn-cancel" @click="showDetailModal = false">关闭</button>
            <button class="btn-submit" @click="saveDetailEdit">保存修改</button>
          </div>
        </div>
      </div>
    </transition>
    </Teleport>

    <!-- Modal 3: 分类设置（保存后生效，后台筛选与 C 端共用） -->
    <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="showCategoryModal" class="modal-backdrop" @click.self="showCategoryModal = false">
        <div class="modal-dialog-box modal-md animate-slide-up">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <h3 class="modal-title">分类设置</h3>
            </div>
            <button class="modal-close-btn" @click="showCategoryModal = false">✕</button>
          </div>

          <div class="modal-body-scroll">
            <p class="form-label-sub" style="margin: 0 0 12px;">维护直播分类列表，保存后后台筛选与 C 端直播页的分类选项同步更新。</p>

            <div class="category-edit-list">
              <div v-for="(name, idx) in categoryDraft" :key="idx" class="category-edit-row">
                <input
                  v-model="categoryDraft[idx]"
                  type="text"
                  class="form-input"
                  placeholder="输入分类名称"
                  maxlength="10"
                />
                <button class="category-remove-btn" title="删除该分类" @click="removeCategoryRow(idx)">✕</button>
              </div>
            </div>

            <button class="category-add-btn" @click="addCategoryRow">＋ 新增分类</button>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showCategoryModal = false">取消</button>
            <button class="btn-submit" @click="saveCategories">保存</button>
          </div>
        </div>
      </div>
    </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { appState, actions } from '../store';
import { mallProductsMock } from '../data';
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

// 创建人筛选选项：从同步数据自动带出
const creatorOptions = computed(() =>
  Array.from(new Set(appState.tencentMeetings.map(m => m.creator).filter(Boolean)))
);

// 上架状态判定：已上架 / 已下架 / 待上架（已结束且录制已同步但未上架）
const getShelfState = (m: TencentMeetingRecord): 'on' | 'off' | 'pending' | null => {
  if (m.status !== 'finished') return null;
  if (m.isOnShelf === true) return 'on';
  if (m.isOnShelf === false) return 'off';
  return 'pending';
};

const getShelfLabel = (m: TencentMeetingRecord) => {
  const state = getShelfState(m);
  if (state === 'on') return '已上架';
  if (state === 'off') return '已下架';
  if (state === 'pending') return '待上架';
  return '—';
};

// 上架：简单动作 + 二次确认，展示内容统一在「设置」抽屉维护
const confirmShelf = (m: TencentMeetingRecord) => {
  const isReshelf = getShelfState(m) === 'off';
  const msg = isReshelf
    ? `确认重新上架《${m.title}》吗？\n沿用原上架时间（${m.shelfTime || '—'}）作为 7 天免费期起点，不重新计时。`
    : `确认上架《${m.title}》吗？\n上架后 C 端立即可见，会员 7 天免费期从本次上架时间开始计算。单购价等展示内容可在「设置」中维护。`;
  if (confirm(msg)) {
    actions.shelfMeetingReplay(m.id);
  }
};

// 下架：免二次确认，C 端立即隐藏
const handleUnshelf = (m: TencentMeetingRecord) => {
  actions.unshelfMeetingReplay(m.id);
};

// 设置抽屉：预览 + 编辑（所有状态可打开）
const showDetailModal = ref(false);
const activeDetailMeeting = ref<TencentMeetingRecord | null>(null);
const detailEditForm = ref({
  columnTag: '',
  creator: '',
  cover: '',
  replayPrice: undefined as number | undefined,
  originPrice: undefined as number | undefined,
  summary: '',
  minutesMarkdown: '',
  productId: ''
});

// 主讲人候选：星球成员名录
const memberOptions = computed(() => appState.members.map(mb => ({ name: mb.name, avatar: mb.avatar })));

// ===== 分类设置弹窗 =====
const showCategoryModal = ref(false);
// 编辑期间的本地副本，保存后才生效
const categoryDraft = ref<string[]>([]);

const openCategoryModal = () => {
  categoryDraft.value = [...appState.liveCategories];
  showCategoryModal.value = true;
};

const addCategoryRow = () => {
  categoryDraft.value.push('');
};

const removeCategoryRow = (idx: number) => {
  categoryDraft.value.splice(idx, 1);
};

const saveCategories = () => {
  actions.applyLiveCategories(categoryDraft.value);
  // 当前筛选分类被删除时重置筛选
  if (filterColumn.value && !appState.liveCategories.includes(filterColumn.value)) {
    filterColumn.value = '';
  }
  showCategoryModal.value = false;
};

// 打开腾讯会议云录制回放
const openRecordingUrl = (m: TencentMeetingRecord) => {
  if (m.recordUrl) {
    window.open(m.recordUrl, '_blank');
  } else {
    actions.showToast('该会议暂未同步到云录制回放链接');
  }
};

// ===== 操作列「更多」下拉菜单 =====
const openMoreMenuId = ref<string | null>(null);

const toggleMoreMenu = (id: string) => {
  openMoreMenuId.value = openMoreMenuId.value === id ? null : id;
};

const closeMoreMenu = () => {
  openMoreMenuId.value = null;
};

// 点击菜单外部时收起下拉
const onDocClick = () => closeMoreMenu();

onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

type MoreMenuAction = 'record' | 'shelf' | 'unshelf' | 'delete';

const menuAction = (type: MoreMenuAction, m: TencentMeetingRecord) => {
  closeMoreMenu();
  if (type === 'record') {
    openRecordingUrl(m);
  } else if (type === 'shelf') {
    confirmShelf(m);
  } else if (type === 'unshelf') {
    handleUnshelf(m);
  } else {
    handleDelete(m);
  }
};

const openRecordingModal = (m: TencentMeetingRecord) => {
  activeDetailMeeting.value = m;
  detailEditForm.value = {
    columnTag: m.columnTag || '',
    creator: m.creator || '',
    cover: '',
    replayPrice: m.replayPrice,
    originPrice: m.originPrice,
    summary: m.summary || '',
    minutesMarkdown: m.minutesMarkdown || '',
    productId: m.productId || ''
  };
  showDetailModal.value = true;
  // 抽屉渲染后把纪要内容灌入富文本编辑器
  nextTick(syncRichEditor);
};

// 更换封面（保存后生效）
const handleCoverChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    detailEditForm.value.cover = URL.createObjectURL(file);
  }
  input.value = '';
};

// ===== AI 会议纪要富文本编辑器（原型：execCommand 实现，参考专栏写文章编辑器） =====
const richEditorRef = ref<HTMLDivElement | null>(null);

const syncRichEditor = () => {
  nextTick(() => {
    if (richEditorRef.value) {
      richEditorRef.value.innerHTML = detailEditForm.value.minutesMarkdown || '';
    }
  });
};

const execRichCmd = (cmd: string, val?: string) => {
  richEditorRef.value?.focus();
  document.execCommand(cmd, false, val);
  onRichInput();
};

const onRichInput = () => {
  if (richEditorRef.value) {
    detailEditForm.value.minutesMarkdown = richEditorRef.value.innerHTML;
  }
};

// ---------- 工具栏：图片插入（本地选择 / 截图粘贴），交互与专栏写文章一致 ----------
const minutesImageInputRef = ref<HTMLInputElement | null>(null);
let savedRange: Range | null = null;

const handleMinutesImageButton = () => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && richEditorRef.value?.contains(sel.anchorNode)) {
    savedRange = sel.getRangeAt(0).cloneRange();
  }
  minutesImageInputRef.value?.click();
};

const insertMinutesImageFiles = (files: File[]) => {
  const images = files.filter(f => f.type.startsWith('image/'));
  if (!images.length) return;
  Promise.all(images.map(f => new Promise<string>(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(f);
  }))).then(urls => {
    richEditorRef.value?.focus();
    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
      savedRange = null;
    }
    document.execCommand('insertHTML', false, urls.map(u => `<img src="${u}" alt="">`).join(''));
    onRichInput();
  });
};

const handleMinutesImageFilesChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  input.value = '';
  insertMinutesImageFiles(files);
};

// 粘贴处理：截图等图片文件直接插入纪要；网页富文本剔除隐藏图片杂质后插入
const sanitizePastedHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, iframe, video, audio, link, meta').forEach(el => el.remove());
  doc.querySelectorAll('img').forEach(el => {
    const src = el.getAttribute('src') || '';
    if (src.startsWith('data:image/')) return; // 截图类内联图片保留
    el.remove();
  });
  return doc.body.innerHTML;
};

const handleMinutesPaste = (e: ClipboardEvent) => {
  const cd = e.clipboardData;
  if (!cd) return;
  const imageFiles = Array.from(cd.files || []).filter(f => f.type.startsWith('image/'));
  if (imageFiles.length) {
    e.preventDefault();
    insertMinutesImageFiles(imageFiles);
    return;
  }
  const html = cd.getData('text/html');
  if (!html) return;
  e.preventDefault();
  document.execCommand('insertHTML', false, sanitizePastedHtml(html));
  onRichInput();
};

const insertMinutesLink = () => {
  const url = prompt('请输入链接地址', 'https://');
  if (url) execRichCmd('createLink', url);
};

const previewRecording = () => {
  actions.showToast('云录制切片预览（原型演示）');
};

// 已解锁人数来自绑定商城商品的销量，订单明细直接跳转商城订单中心
const viewBoundOrders = () => {
  actions.showToast('正在跳转商城订单中心，已按本场回放绑定的商品过滤订单');
};

const saveDetailEdit = () => {
  const target = activeDetailMeeting.value;
  if (!target) return;
  // 主讲人：选中成员后带出头像一并保存
  const picked = memberOptions.value.find(mb => mb.name === detailEditForm.value.creator);
  actions.updateMeetingReplayConfig(target.id, {
    columnTag: detailEditForm.value.columnTag,
    creator: detailEditForm.value.creator,
    creatorAvatar: picked?.avatar || '',
    cover: detailEditForm.value.cover,
    replayPrice: detailEditForm.value.replayPrice,
    originPrice: detailEditForm.value.originPrice,
    summary: detailEditForm.value.summary.trim(),
    minutesMarkdown: detailEditForm.value.minutesMarkdown.trim(),
    productId: detailEditForm.value.productId
  });
  showDetailModal.value = false;
};

const handleDelete = (m: TencentMeetingRecord) => {
  if (confirm(`确定要删除会议《${m.title}》吗？`)) {
    actions.deleteTencentMeeting(m.id);
  }
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
  border-collapse: separate;
  border-spacing: 0;
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

/* 操作列固定右侧：横向滚动时始终可见 */
.meeting-records-table th.col-actions,
.meeting-records-table td.col-actions {
  position: sticky;
  right: 0;
  z-index: 1;
  text-align: left;
}

/* 展开更多菜单时提升层级，避免被下方行的固定列遮挡 */
.meeting-records-table td.col-actions.menu-open {
  z-index: 30;
}

.meeting-records-table th.col-actions {
  background: #f8fafc;
}

.meeting-records-table td.col-actions {
  background: #ffffff;
  box-shadow: -6px 0 8px -6px rgba(15, 23, 42, 0.18);
}

.table-data-row:hover td.col-actions {
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

/* Column 4: 主讲人 */
.creator-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.creator-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}
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

.op-link-btn.record-btn {
  color: #7c3aed;
}
.op-link-btn.record-btn:hover {
  text-decoration: underline;
}

.op-link-btn.more-btn {
  color: #475569;
}
.op-link-btn.more-btn:hover {
  text-decoration: underline;
}

/* 更多下拉菜单 */
.more-wrap {
  position: relative;
  display: inline-flex;
}

.more-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 30;
  min-width: 104px;
  padding: 4px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
}

.more-menu-item {
  border: none;
  background: none;
  text-align: left;
  padding: 7px 10px;
  font-size: 13px;
  color: #334155;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.more-menu-item:hover {
  background: #f1f5f9;
}

.more-menu-item.is-danger {
  color: #dc2626;
}

.more-menu-item.is-danger:hover {
  background: #fef2f2;
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

.op-link-btn.offline-btn {
  color: #ea580c;
}
.op-link-btn.offline-btn:hover {
  text-decoration: underline;
}

/* 上架状态标签 */
.shelf-state-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.shelf-state-tag.shelf-on {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}
.shelf-state-tag.shelf-off {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}
.shelf-state-tag.shelf-pending {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.cell-empty-text {
  color: #cbd5e1;
  font-size: 13px;
}

.price-cell-text,
.num-cell-text {
  font-size: 13px;
  color: #0f172a;
}

/* 设置抽屉：封面编辑 */
.cover-edit-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.cover-preview-img {
  width: 160px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f1f5f9;
}
.cover-edit-side {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.btn-upload-cover {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}
.btn-upload-cover:hover {
  background: #f8fafc;
}
.cover-file-input {
  display: none;
}
.cover-edit-tip {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.form-textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
}
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.form-label-sub {
  font-size: 12px;
  color: #94a3b8;
  margin: 4px 0 8px;
}

/* 详情弹窗数据行 */
.detail-stats-row {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 14px 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin: 14px 0 18px;
  flex-wrap: wrap;
}
.detail-stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-stat-label {
  font-size: 12px;
  color: #94a3b8;
}
.detail-stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}
.btn-view-orders {
  margin-left: auto;
  padding: 7px 14px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}
.btn-view-orders:hover {
  background: #f8fafc;
  border-color: #94a3b8;
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

.modal-body-scroll {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

/* ===== 分类设置入口（次级按钮样式） ===== */
.btn-sync-wemeet.is-ghost {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
}
.btn-sync-wemeet.is-ghost:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

/* ===== 分类设置弹窗 ===== */
.category-edit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.category-edit-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-remove-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.category-remove-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

.category-add-btn {
  width: 100%;
  padding: 8px 0;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: transparent;
  color: #2563eb;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}
.category-add-btn:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

/* ===== 录播设置抽屉（右侧滑入，与长文详情抽屉同模式） ===== */
.cms-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 2100;
}

.cms-drawer-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(680px, 94vw);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(15, 23, 42, 0.18);
}

.cms-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 20px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.drawer-h3 {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 20px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.drawer-slide-enter-active, .drawer-slide-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-slide-enter-active .cms-drawer-panel, .drawer-slide-leave-active .cms-drawer-panel {
  transition: transform 0.28s ease;
}
.drawer-slide-enter-from, .drawer-slide-leave-to {
  opacity: 0;
}
.drawer-slide-enter-from .cms-drawer-panel, .drawer-slide-leave-to .cms-drawer-panel {
  transform: translateX(100%);
}

/* ===== AI 会议纪要富文本编辑器 ===== */
.rich-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: #f8fafc;
  flex-wrap: wrap;
}
.rich-toolbar button {
  border: none;
  background: transparent;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12.5px;
  color: #334155;
  cursor: pointer;
  min-width: 26px;
}
.rich-toolbar button:hover {
  background: #e2e8f0;
}
.rich-divider {
  width: 1px;
  height: 14px;
  background: #e2e8f0;
  margin: 0 4px;
}

.rich-editor {
  min-height: 440px;
  max-height: 640px;
  overflow-y: auto;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 0 0 8px 8px;
  font-size: 13.5px;
  line-height: 1.7;
  color: #1e293b;
  outline: none;
  background: #ffffff;
}
.rich-editor:focus {
  border-color: #93c5fd;
}
.rich-editor:empty::before {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
}
.rich-editor img {
  max-width: 100%;
  border-radius: 4px;
}

.product-select {
  cursor: pointer;
}
</style>
