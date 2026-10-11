<template>
  <!-- 一级页面：专栏管理列表 -->
  <div v-if="!showEditorPage" class="column-manage-layout animate-fade-in">
    <!-- Main Two-Column Container -->
    <div class="cms-main-container">
      <!-- 1. Left Aside: Column Directory Tree -->
      <aside class="column-tree-aside">
        <div class="tree-header-card">
          <div class="tree-title-text">
            <span class="tree-main-title">专栏目录</span>
            <button class="btn-new-column" @click="openAddColumnModal" title="新建专栏">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>新建专栏</span>
            </button>
          </div>

          <div class="tree-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="columnKeyword"
              type="text"
              placeholder="搜索专栏"
              class="tree-search-input"
            />
          </div>
        </div>

        <!-- Column Nodes -->
        <div class="tree-scroll-container">
          <div
            v-for="(col, index) in filteredColumns"
            :key="col.id"
            :draggable="!columnKeyword.trim()"
            :class="['column-list-item', {
              active: selectedColumnId === col.id,
              dimmed: col.status === 'archived',
              dragging: draggingColumnId === col.id,
              'drag-over-top': isDragIndicator(index, 'top'),
              'drag-over-bottom': isDragIndicator(index, 'bottom')
            }]"
            title="拖动可调整顺序"
            @click="selectColumn(col)"
            @dragstart="onColumnDragStart(col, $event)"
            @dragover="onColumnDragOver(index, $event)"
            @drop.prevent="onColumnDrop"
            @dragend="resetColumnDragState"
          >
            <span class="column-item-title" :title="col.title">{{ col.title }}</span>
            <span class="column-count-chip">({{ col.chapters.length }})</span>
          </div>
          <div v-if="!filteredColumns.length" class="tree-empty-text">未找到相关专栏</div>
        </div>
      </aside>

      <!-- 2. Right Content Area -->
      <main class="column-workbench-main" v-if="selectedColumn">
        <!-- Column Header: title + status + actions -->
        <section class="column-meta-section">
          <div class="col-header-top-row">
            <div class="col-title-group">
              <h2 class="col-main-title">{{ selectedColumn.title }}</h2>
              <span :class="['status-badge', selectedColumn.status === 'published' ? 'badge-published' : 'badge-archived']">
                {{ selectedColumn.status === 'published' ? '已上架' : '已下架' }}
              </span>
            </div>

            <div class="col-action-btns">
              <button class="btn-primary-add" @click="openAddArticle">写文章</button>
              <button class="btn-plain" @click="openEditColumnModal">编辑</button>
              <div class="more-menu-wrap" @click.stop>
                <button class="btn-plain" @click="isColumnMenuOpen = !isColumnMenuOpen">更多 ▾</button>
                <div v-if="isColumnMenuOpen" class="more-dropdown">
                  <button
                    class="more-item"
                    @click="handleToggleColumnStatus(); isColumnMenuOpen = false"
                  >{{ selectedColumn.status === 'published' ? '下架' : '上架' }}</button>
                  <button
                    class="more-item danger"
                    @click="handleDeleteColumn(selectedColumn); isColumnMenuOpen = false"
                  >删除</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Stats Row -->
          <div class="col-meta-summary-bar" v-if="columnStats">
            <div class="meta-item"><span class="meta-label">文章</span><span class="meta-val font-semibold">{{ columnStats.chapterCount }}</span></div>
            <span class="meta-divider">·</span>
            <div class="meta-item"><span class="meta-label">阅读次数</span><span class="meta-val">{{ formatCount(columnStats.read) }}</span></div>
            <span class="meta-divider">·</span>
            <div class="meta-item"><span class="meta-label">阅读人数</span><span class="meta-val">{{ formatCount(columnStats.readers) }}</span></div>
            <span class="meta-divider">·</span>
            <div class="meta-item"><span class="meta-label">点赞</span><span class="meta-val">{{ formatCount(columnStats.likes) }}</span></div>
            <span class="meta-divider">·</span>
            <div class="meta-item"><span class="meta-label">评论</span><span class="meta-val">{{ formatCount(columnStats.comments) }}</span></div>
          </div>
        </section>

        <!-- Standard Table: zebra rows, right-aligned actions -->
        <div class="table-wrap" v-if="chapterList.length">
          <table class="chapter-table">
            <thead>
              <tr>
                <th class="th-title">标题</th>
                <th class="th-status">状态</th>
                <th class="th-time">发布时间</th>
                <th class="th-data">阅读次数</th>
                <th class="th-data">阅读人数</th>
                <th class="th-data">点赞</th>
                <th class="th-data">评论</th>
                <th class="th-ops">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="art in pagedChapterList" :key="art.id">
                <td class="td-title">
                  <span class="title-text" :title="art.title" @click="openReadModal(selectedColumn!, art)">{{ art.title }}</span>
                </td>
                <td class="td-status">
                  <span :class="['status-tag', statusMeta[statusOf(art)].cls]">{{ statusMeta[statusOf(art)].label }}</span>
                </td>
                <td class="td-time">{{ statusOf(art) === 'published' ? (art.createdAt || '-') : '-' }}</td>
                <td class="td-data">
                  <template v-if="statusOf(art) !== 'draft'">{{ formatCount(art.readCount) }}</template>
                  <template v-else>-</template>
                </td>
                <td class="td-data">
                  <template v-if="statusOf(art) !== 'draft'">{{ formatCount(art.readerCount || 0) }}</template>
                  <template v-else>-</template>
                </td>
                <td class="td-data">
                  <template v-if="statusOf(art) !== 'draft'">{{ formatCount(art.likesCount || 0) }}</template>
                  <template v-else>-</template>
                </td>
                <td class="td-data">
                  <template v-if="statusOf(art) !== 'draft'">{{ formatCount(art.comments?.length || 0) }}</template>
                  <template v-else>-</template>
                </td>
                <td class="td-ops">
                  <button class="op-btn" @click="openReadModal(selectedColumn!, art)">详情</button>
                  <button class="op-btn" @click="openEditArticle(selectedColumn!, art)">编辑</button>
                  <button
                    v-if="statusOf(art) === 'published'"
                    class="op-btn"
                    @click="handleArchiveChapter(art)"
                  >下架</button>
                  <button
                    v-else
                    class="op-btn"
                    @click="handlePublishChapter(art)"
                  >上架</button>
                  <button class="op-btn danger" @click="handleDeleteChapter(selectedColumn, art)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-row" v-if="chapterList.length > 0">
          <el-pagination
            v-model:current-page="chapterCurrentPage"
            :page-size="chapterPageSize"
            :total="chapterList.length"
            layout="total, prev, pager, next"
            background
          />
        </div>

        <!-- Empty States -->
        <div v-else class="empty-state-card">
          <h4 class="empty-heading">该专栏下暂无长文</h4>
          <p class="empty-text">点击下方按钮立即撰写新的投研长文</p>
          <button class="btn-primary-add mt-3" @click="openAddArticle">写文章</button>
        </div>
      </main>
    </div>

    <!-- Drawer: 长文详情（右侧抽屉，嵌入 C 端专栏阅读页复用，含评论治理） -->
    <transition name="drawer-slide">
      <div v-if="readModal.show" class="cms-drawer-backdrop" @click.self="closeReadModal">
        <div class="cms-drawer-panel">
          <div class="cms-drawer-header">
            <h3 class="drawer-h3">文章详情 · {{ readChapter?.title || '' }}</h3>
            <button class="modal-close-x" @click="closeReadModal">✕</button>
          </div>
          <iframe
            :key="readDrawerIframeSrc"
            :src="readDrawerIframeSrc"
            class="drawer-iframe"
            frameborder="0"
          ></iframe>
        </div>
      </div>
    </transition>

    <!-- Modal 3: 新建/编辑专栏 -->
    <transition name="modal-fade">
      <div v-if="showColumnModal" class="cms-modal-backdrop" @click.self="showColumnModal = false">
        <div class="cms-modal-card animate-slide-up">
          <div class="cms-modal-header">
            <h3 class="modal-h3">{{ isEditingColumn ? '编辑专栏' : '新建专栏' }}</h3>
            <button class="modal-close-x" @click="showColumnModal = false">✕</button>
          </div>

          <div class="cms-modal-body">
            <div class="form-row">
              <label class="form-label">专栏名称 <span class="required-star">*</span></label>
              <input
                type="text"
                v-model="columnForm.title"
                maxlength="20"
                placeholder="请输入专栏名称（最多 20 字）"
                class="cms-input"
              />
              <p v-if="columnNameError" class="field-error">{{ columnNameError }}</p>
            </div>

            <div class="form-row">
              <label class="form-label">专栏简介</label>
              <input
                type="text"
                v-model="columnForm.subtitle"
                maxlength="60"
                placeholder="选填，最多 60 字"
                class="cms-input"
              />
            </div>
          </div>

          <div class="cms-modal-footer">
            <button class="btn-cancel" @click="showColumnModal = false">取消</button>
            <button class="btn-confirm-blue" @click="saveColumnModal">保存</button>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <!-- 二级页面：长文编辑器 -->
  <div v-else class="article-editor-page">
    <header class="editor-topbar">
      <button class="btn-editor-back" @click="goBackFromEditor">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>返回</span>
      </button>
      <span class="editor-topbar-title">{{ isEditingArticle ? '编辑长文' : '写文章' }}</span>
      <div class="editor-topbar-actions">
        <button
          v-if="isEditingArticle && editingStatus === 'published'"
          class="btn-confirm-blue"
          @click="saveArticle('publish')"
        >保存修改</button>
        <template v-else>
          <button class="btn-plain" @click="saveArticle('draft')">存草稿</button>
          <button class="btn-confirm-blue" @click="saveArticle('publish')">保存并上架</button>
        </template>
      </div>
    </header>

    <div class="editor-scroll-area">
      <div class="editor-canvas">
        <input
          ref="editorTitleRef"
          v-model="articleForm.title"
          type="text"
          maxlength="50"
          placeholder="请输入标题（最多 50 字）"
          class="editor-title-input"
        />

        <div class="editor-meta-row">
          <label class="meta-field">
            <span class="meta-field-label">所属专栏</span>
            <select v-model="articleForm.columnId" class="meta-field-input">
              <option v-for="col in selectableColumns" :key="col.id" :value="col.id">{{ col.title }}</option>
            </select>
          </label>
          <label class="meta-field author-field">
            <span class="meta-field-label">主笔作者</span>
            <div class="author-select">
              <input
                type="text"
                class="meta-field-input"
                :value="authorDropdownOpen ? authorKeyword : articleForm.author"
                placeholder="选择星球成员（可搜索）"
                @focus="openAuthorDropdown"
                @input="authorKeyword = ($event.target as HTMLInputElement).value"
                @blur="authorDropdownOpen = false"
              />
              <button
                v-if="!authorDropdownOpen && articleForm.author"
                type="button"
                class="author-clear"
                title="清空主笔作者"
                @mousedown.prevent
                @click="articleForm.author = ''"
              >×</button>
              <span v-else class="author-arrow">▾</span>
            </div>
            <div v-if="authorDropdownOpen" class="author-dropdown">
              <div
                v-for="m in filteredAuthorOptions"
                :key="m.id"
                class="author-option"
                @mousedown.prevent="selectAuthor(m)"
              >
                <span class="author-option-name">{{ m.name }}</span>
                <span class="author-option-role">{{ ROLE_LABELS[m.role] }}</span>
              </div>
              <div v-if="!filteredAuthorOptions.length" class="author-empty">无匹配成员</div>
            </div>
          </label>
          <label class="meta-field">
            <span class="meta-field-label">排序</span>
            <input
              type="number"
              v-model.number="articleForm.sortNo"
              min="0"
              placeholder="数字越小越靠前"
              class="meta-field-input"
            />
          </label>
        </div>

        <div class="editor-toolbar">
          <button type="button" title="撤销" @mousedown.prevent="execCmd('undo')">↺</button>
          <button type="button" title="重做" @mousedown.prevent="execCmd('redo')">↻</button>
          <span class="tb-divider"></span>
          <button type="button" title="加粗" @mousedown.prevent="execCmd('bold')"><strong>B</strong></button>
          <button type="button" title="斜体" @mousedown.prevent="execCmd('italic')"><em>I</em></button>
          <button type="button" title="下划线" @mousedown.prevent="execCmd('underline')"><u>U</u></button>
          <button type="button" title="删除线" @mousedown.prevent="execCmd('strikeThrough')"><s>S</s></button>
          <span class="tb-divider"></span>
          <button type="button" title="章节标题" @mousedown.prevent="execCmd('formatBlock', 'h2')">H2</button>
          <button type="button" title="小节标题" @mousedown.prevent="execCmd('formatBlock', 'h3')">H3</button>
          <button type="button" title="正文段落" @mousedown.prevent="execCmd('formatBlock', 'p')">正文</button>
          <span class="tb-divider"></span>
          <button type="button" title="无序列表" @mousedown.prevent="execCmd('insertUnorderedList')">• 列表</button>
          <button type="button" title="有序列表" @mousedown.prevent="execCmd('insertOrderedList')">1. 列表</button>
          <button type="button" title="引用" @mousedown.prevent="execCmd('formatBlock', 'blockquote')">引用</button>
          <button type="button" title="代码块" @mousedown.prevent="execCmd('formatBlock', 'pre')">代码</button>
          <span class="tb-divider"></span>
          <button type="button" title="左对齐" @mousedown.prevent="execCmd('justifyLeft')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="15" y2="12"></line><line x1="3" y1="18" x2="18" y2="18"></line>
            </svg>
          </button>
          <button type="button" title="居中对齐" @mousedown.prevent="execCmd('justifyCenter')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <button type="button" title="右对齐" @mousedown.prevent="execCmd('justifyRight')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line><line x1="9" y1="12" x2="21" y2="12"></line><line x1="6" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <span class="tb-divider"></span>
          <button type="button" title="插入链接" @mousedown.prevent="insertLink">链接</button>
          <button type="button" title="插入图片" @mousedown.prevent="handleImageButton">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </button>
          <button type="button" title="插入分割线" @mousedown.prevent="execCmd('insertHorizontalRule')">分割线</button>
          <div class="color-menu-wrap" @click.stop>
            <button type="button" title="文字颜色" @mousedown.prevent="isColorMenuOpen = !isColorMenuOpen">文字颜色 ▾</button>
            <div v-if="isColorMenuOpen" class="color-palette">
              <span
                v-for="c in paletteColors"
                :key="c"
                class="color-dot"
                :style="{ background: c }"
                @mousedown.prevent="execCmd('foreColor', c); isColorMenuOpen = false"
              ></span>
            </div>
          </div>
          <span class="tb-divider"></span>
          <button type="button" title="清除格式" @mousedown.prevent="execCmd('removeFormat')">清除格式</button>
        </div>

        <input
          ref="imageInputRef"
          type="file"
          accept="image/*"
          multiple
          style="display: none"
          @change="handleImageFilesChange"
        />

        <div
          ref="editorRef"
          class="rich-editor"
          contenteditable="true"
          data-placeholder="从此处开始撰写正文…"
          @input="syncEditorInput"
          @paste="handleEditorPaste"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { appState, actions } from '../store';
import { Column, ColumnChapter } from '../types';
import '../client.css';

defineOptions({ name: 'CmsContent' })

type ChapterStatus = 'draft' | 'published' | 'archived';

const selectedColumnId = ref<string>('col-ai-1');

const selectedColumn = computed(() => {
  return appState.columns.find(c => c.id === selectedColumnId.value) || appState.columns[0];
});

const selectColumn = (col: Column) => {
  selectedColumnId.value = col.id;
};

// ---------- 状态与文案 ----------
const statusOf = (ch: ColumnChapter): ChapterStatus => ch.status || 'published';

const statusMeta: Record<ChapterStatus, { label: string; cls: string }> = {
  draft: { label: '草稿', cls: 'st-draft' },
  published: { label: '已上架', cls: 'st-published' },
  archived: { label: '已下架', cls: 'st-archived' }
};

const formatCount = (n: number) => {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
};

const nowText = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

// ---------- 专栏汇总数据 ----------
const columnStats = computed(() => {
  const col = selectedColumn.value;
  if (!col) return null;
  return {
    chapterCount: col.chapters.length,
    read: col.chapters.reduce((s, c) => s + (c.readCount || 0), 0),
    readers: col.chapters.reduce((s, c) => s + (c.readerCount || 0), 0),
    likes: col.chapters.reduce((s, c) => s + (c.likesCount || 0), 0),
    comments: col.chapters.reduce((s, c) => s + (c.comments?.length || 0), 0)
  };
});

// ---------- 左侧专栏目录搜索 ----------
const columnKeyword = ref('');

const filteredColumns = computed(() => {
  // 目录顺序：按排序号降序（序号越大越靠前；未设置按 0，保持稳定顺序）
  const ordered = [...appState.columns].sort((a, b) => (b.sortNo ?? 0) - (a.sortNo ?? 0));
  const q = columnKeyword.value.trim().toLowerCase();
  if (!q) return ordered;
  return ordered.filter(c => c.title.toLowerCase().includes(q));
});

// ---------- 专栏目录拖动排序 ----------
const draggingColumnId = ref<string | null>(null);
const dragOverIndex = ref<number | null>(null);
const dragOverPos = ref<'top' | 'bottom'>('top');

const isDragIndicator = (index: number, pos: 'top' | 'bottom') =>
  draggingColumnId.value !== null &&
  dragOverIndex.value === index &&
  dragOverPos.value === pos &&
  filteredColumns.value[index]?.id !== draggingColumnId.value;

const onColumnDragStart = (col: Column, e: DragEvent) => {
  draggingColumnId.value = col.id;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', col.id);
  }
};

const onColumnDragOver = (index: number, e: DragEvent) => {
  if (!draggingColumnId.value) return;
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  dragOverIndex.value = index;
  dragOverPos.value = e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';
};

const resetColumnDragState = () => {
  draggingColumnId.value = null;
  dragOverIndex.value = null;
  dragOverPos.value = 'top';
};

const onColumnDrop = () => {
  if (!draggingColumnId.value || dragOverIndex.value === null) return resetColumnDragState();
  const arr = appState.columns;
  // 拖动仅在未搜索时可用，展示顺序即完整列表顺序
  const from = arr.findIndex(c => c.id === draggingColumnId.value);
  if (from === -1) return resetColumnDragState();
  let to = dragOverIndex.value + (dragOverPos.value === 'bottom' ? 1 : 0);
  if (to > from) to -= 1;
  if (to !== from) {
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    // 同步排序号：数字越大越靠前，C 端目录按相同顺序展示
    arr.forEach((c, i) => { c.sortNo = arr.length - 1 - i; });
    actions.showToast('专栏顺序已调整');
  }
  resetColumnDragState();
};

// ---------- 长文列表 ----------
const chapterList = computed(() => {
  const col = selectedColumn.value;
  if (!col) return [];
  // 排序号大的在前；未设置(0)的同组内按最近更新倒序
  return [...col.chapters].sort((a, b) => {
    const diff = (b.sortNo ?? 0) - (a.sortNo ?? 0);
    if (diff !== 0) return diff;
    return (b.updatedAt || '').localeCompare(a.updatedAt || '');
  });
});

// ---------- 长文分页 ----------
const chapterCurrentPage = ref(1);
const chapterPageSize = ref(10);

const pagedChapterList = computed(() => {
  const start = (chapterCurrentPage.value - 1) * chapterPageSize.value;
  return chapterList.value.slice(start, start + chapterPageSize.value);
});

// 切换专栏或列表变化时回到第一页
watch(
  [selectedColumnId, () => selectedColumn.value?.chapters.length],
  () => {
    chapterCurrentPage.value = 1;
  }
);

// ---------- 专栏操作「更多」菜单 ----------
const isColumnMenuOpen = ref(false);

const closeColumnMenu = () => {
  isColumnMenuOpen.value = false;
};

// ---------- 专栏 下架/上架/删除 ----------
const handleToggleColumnStatus = () => {
  if (selectedColumn.value) {
    actions.toggleColumnStatus(selectedColumn.value.id);
  }
};

const handleDeleteColumn = (col: Column) => {
  if (confirm(`删除专栏将同时删除其下全部长文，且不可恢复，确认删除？`)) {
    actions.deleteColumn(col.id);
    if (appState.columns.length > 0) {
      selectedColumnId.value = appState.columns[0].id;
    }
  }
};

// ---------- 专栏 新建/编辑弹窗 ----------
const showColumnModal = ref(false);
const isEditingColumn = ref(false);
const editingColumnId = ref<string | null>(null);
const columnNameError = ref('');

const columnForm = reactive({
  title: '',
  subtitle: ''
});

const openAddColumnModal = () => {
  isEditingColumn.value = false;
  editingColumnId.value = null;
  columnForm.title = '';
  columnForm.subtitle = '';
  columnNameError.value = '';
  showColumnModal.value = true;
};

const openEditColumnModal = () => {
  const col = selectedColumn.value;
  if (!col) return;
  isEditingColumn.value = true;
  editingColumnId.value = col.id;
  columnForm.title = col.title;
  columnForm.subtitle = col.subtitle || '';
  columnNameError.value = '';
  showColumnModal.value = true;
};

const saveColumnModal = () => {
  const title = columnForm.title.trim();
  if (!title) {
    columnNameError.value = '请输入专栏名称';
    return;
  }
  const duplicated = appState.columns.some(
    c => c.title === title && c.id !== editingColumnId.value
  );
  if (duplicated) {
    columnNameError.value = '该专栏名称已存在';
    return;
  }

  if (isEditingColumn.value && editingColumnId.value) {
    const col = appState.columns.find(c => c.id === editingColumnId.value);
    if (col) {
      col.title = title;
      col.subtitle = columnForm.subtitle.trim();
      actions.showToast('专栏信息已保存');
    }
  } else {
    const newCol: Column = {
      id: 'col-custom-' + Date.now(),
      title,
      subtitle: columnForm.subtitle.trim(),
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
      author: appState.user.name,
      authorTitle: '核心投研智囊',
      price: 0,
      originPrice: 0,
      subscriberCount: 0,
      chapterCount: 0,
      tags: [],
      status: 'published',
      chapters: []
    };
    appState.columns.unshift(newCol);
    selectedColumnId.value = newCol.id;
    actions.showToast(`专栏「${title}」创建成功，默认已上架`);
  }
  showColumnModal.value = false;
};

// ---------- 长文 二级编辑页 ----------
const showEditorPage = ref(false);
const isEditingArticle = ref(false);
const editingArticleId = ref<string | null>(null);
const editingSourceColId = ref<string | null>(null);
const editingStatus = ref<ChapterStatus>('published');

const articleForm = reactive({
  title: '',
  columnId: '',
  author: '',
  sortNo: 0,
  content: ''
});

// 仅可选已上架的专栏
const selectableColumns = computed(() => appState.columns.filter(c => c.status === 'published'));

// 主笔作者：下拉选择星球成员（支持搜索，非必填）
const ROLE_LABELS: Record<string, string> = {
  founder: '星主',
  vip: '会员',
  partner: '合伙人',
  member: '普通成员',
  guest: '嘉宾'
};
const authorDropdownOpen = ref(false);
const authorKeyword = ref('');
const filteredAuthorOptions = computed(() => {
  const kw = authorKeyword.value.trim().toLowerCase();
  const list = appState.members.map(m => ({ id: m.id, name: m.name, role: m.role }));
  if (!kw) return list;
  return list.filter(m => m.name.toLowerCase().includes(kw));
});
const openAuthorDropdown = () => {
  authorKeyword.value = '';
  authorDropdownOpen.value = true;
};
const selectAuthor = (m: { name: string }) => {
  articleForm.author = m.name;
  authorDropdownOpen.value = false;
};

const editorRef = ref<HTMLElement | null>(null);
const editorTitleRef = ref<HTMLInputElement | null>(null);

// 打开页面后再写入富文本内容（contenteditable 不做双向绑定）
const setEditorHtml = (html: string) => {
  nextTick(() => {
    if (editorRef.value) editorRef.value.innerHTML = html || '';
  });
};

const openAddArticle = () => {
  const col = selectedColumn.value;
  isEditingArticle.value = false;
  editingArticleId.value = null;
  editingSourceColId.value = null;
  editingStatus.value = 'published';
  articleForm.title = '';
  articleForm.columnId = col && col.status === 'published' ? col.id : (selectableColumns.value[0]?.id || '');
  articleForm.author = appState.user.name;
  articleForm.sortNo = 0;
  articleForm.content = '';
  showEditorPage.value = true;
  setEditorHtml('');
  nextTick(() => editorTitleRef.value?.focus());
};

const openEditArticle = (col: Column, art: ColumnChapter) => {
  isEditingArticle.value = true;
  editingArticleId.value = art.id;
  editingSourceColId.value = col.id;
  editingStatus.value = statusOf(art);
  articleForm.title = art.title;
  articleForm.columnId = col.id;
  articleForm.author = art.author || '';
  articleForm.sortNo = art.sortNo ?? 0;
  articleForm.content = art.content || '';
  showEditorPage.value = true;
  setEditorHtml(art.content || '');
};

const goBackFromEditor = () => {
  showEditorPage.value = false;
};

const syncEditorInput = () => {
  if (editorRef.value) articleForm.content = editorRef.value.innerHTML;
};

// 富文本工具栏命令
const execCmd = (cmd: string, val?: string) => {
  document.execCommand(cmd, false, val);
  syncEditorInput();
};

const insertLink = () => {
  const url = prompt('请输入链接地址', 'https://');
  if (url) execCmd('createLink', url);
};

// ---------- 工具栏：文字颜色 ----------
const isColorMenuOpen = ref(false);
const paletteColors = ['#0f172a', '#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#64748b'];

const closeColorMenu = () => {
  isColorMenuOpen.value = false;
};
onMounted(() => {
  document.addEventListener('click', closeColorMenu);
  document.addEventListener('click', closeColumnMenu);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', closeColorMenu);
  document.removeEventListener('click', closeColumnMenu);
});

// ---------- 工具栏：图片插入（本地选择 / 截图粘贴） ----------
const imageInputRef = ref<HTMLInputElement | null>(null);
let savedRange: Range | null = null;

const handleImageButton = () => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && editorRef.value?.contains(sel.anchorNode)) {
    savedRange = sel.getRangeAt(0).cloneRange();
  }
  imageInputRef.value?.click();
};

const insertImageFiles = (files: File[]) => {
  const images = files.filter(f => f.type.startsWith('image/'));
  if (!images.length) return;
  Promise.all(images.map(f => new Promise<string>(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(f);
  }))).then(urls => {
    editorRef.value?.focus();
    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
      savedRange = null;
    }
    document.execCommand('insertHTML', false, urls.map(u => `<img src="${u}" alt="">`).join(''));
    syncEditorInput();
  });
};

const handleImageFilesChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  input.value = '';
  insertImageFiles(files);
};

// 粘贴净化：外部网页（如公众号）的富文本常夹带二维码、统计像素等隐藏图片，粘贴时统一剔除
const sanitizePastedHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('img, script, style, iframe, video, audio, link, meta').forEach(el => el.remove());
  return doc.body.innerHTML;
};

// 粘贴处理：截图等图片文件直接插入正文；网页富文本经净化后插入（剔除二维码等图片杂质）
const handleEditorPaste = (e: ClipboardEvent) => {
  const cd = e.clipboardData;
  if (!cd) return;
  const imageFiles = Array.from(cd.files || []).filter(f => f.type.startsWith('image/'));
  if (imageFiles.length) {
    e.preventDefault();
    insertImageFiles(imageFiles);
    return;
  }
  const html = cd.getData('text/html');
  if (!html) return;
  e.preventDefault();
  document.execCommand('insertHTML', false, sanitizePastedHtml(html));
  syncEditorInput();
};

// 去掉 HTML 标签后的纯文本（用于校验与字数统计）
const plainText = (html: string) => html
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .trim();

const saveArticle = (mode: 'draft' | 'publish') => {
  const title = articleForm.title.trim();
  if (!title) {
    actions.showToast('请填写长文标题');
    return;
  }
  if (!articleForm.columnId) {
    actions.showToast('请选择所属专栏');
    return;
  }
  if (mode === 'publish') {
    if (!plainText(articleForm.content)) {
      actions.showToast('请填写正文内容');
      return;
    }
  }

  const targetCol = appState.columns.find(c => c.id === articleForm.columnId);
  if (!targetCol) return;

  const wordCount = plainText(articleForm.content).replace(/\s/g, '').length;
  // 排序号：负数按 0 处理，空值按 0 处理
  const sortNo = Math.max(0, Math.floor(Number(articleForm.sortNo) || 0));

  if (isEditingArticle.value && editingArticleId.value && editingSourceColId.value) {
    const sourceCol = appState.columns.find(c => c.id === editingSourceColId.value);
    const target = sourceCol?.chapters.find(ch => ch.id === editingArticleId.value);
    if (!target || !sourceCol) return;

    target.title = title;
    target.author = articleForm.author.trim();
    target.content = articleForm.content;
    target.wordCount = wordCount;
    target.sortNo = sortNo;
    target.updatedAt = nowText();

    if (mode === 'publish') {
      if (statusOf(target) !== 'published') {
        target.status = 'published';
        if (!target.createdAt) target.createdAt = nowText();
      }
      actions.showToast('长文修改已保存，C 端实时同步');
    } else {
      target.status = 'draft';
      actions.showToast('已保存为草稿，C 端不可见');
    }

    // 转移专栏
    if (editingSourceColId.value !== targetCol.id) {
      const idx = sourceCol.chapters.findIndex(ch => ch.id === target.id);
      if (idx !== -1) sourceCol.chapters.splice(idx, 1);
      targetCol.chapters.push(target);
      actions.showToast(`长文已转移至专栏「${targetCol.title}」`);
    }
  } else {
    const newCh: ColumnChapter = {
      id: 'ch-new-' + Date.now(),
      title,
      author: articleForm.author.trim(),
      content: articleForm.content,
      wordCount,
      status: mode === 'publish' ? 'published' : 'draft',
      createdAt: mode === 'publish' ? nowText() : undefined,
      updatedAt: nowText(),
      sortNo,
      readCount: 0,
      readerCount: 0,
      likesCount: 0,
      comments: []
    };
    targetCol.chapters.push(newCh);
    actions.showToast(mode === 'publish'
      ? `长文《${title}》上架成功，C 端已可见`
      : `长文《${title}》已存为草稿`);
  }
  showEditorPage.value = false;
};

// ---------- 长文 上架/下架/删除 ----------
const handlePublishChapter = (art: ColumnChapter) => {
  art.status = 'published';
  if (!art.createdAt) art.createdAt = nowText();
  art.updatedAt = nowText();
  actions.showToast(`长文《${art.title}》已上架，C 端可见`);
};

const handleArchiveChapter = (art: ColumnChapter) => {
  if (confirm(`下架后 C 端将不可见，确认下架《${art.title}》？`)) {
    art.status = 'archived';
    art.updatedAt = nowText();
    actions.showToast(`长文《${art.title}》已下架`);
  }
};

const handleDeleteChapter = (col: Column, art: ColumnChapter) => {
  if (confirm(`删除后 C 端将不可见且不可恢复，确认删除《${art.title}》？`)) {
    const idx = col.chapters.findIndex(ch => ch.id === art.id);
    if (idx !== -1) col.chapters.splice(idx, 1);
    actions.showToast(`已删除长文：${art.title}`);
  }
};

// ---------- 长文详情抽屉（嵌入 C 端专栏阅读页复用，含评论治理） ----------
const readModal = reactive({ show: false, colId: '', chapterId: '' });

const readChapter = computed(() => {
  const col = appState.columns.find(c => c.id === readModal.colId);
  return col?.chapters.find(ch => ch.id === readModal.chapterId) || null;
});

// C 端地址：embed=1 仅呈现文章阅读区（隐藏侧边菜单与专栏目录）；admin=1 开启评论治理；参数定位到对应专栏/长文
const readDrawerIframeSrc = computed(() => {
  const base = 'http://localhost:3000/?embed=1&admin=1';
  if (!readModal.colId) return base;
  return `${base}&column=${encodeURIComponent(readModal.colId)}&article=${encodeURIComponent(readModal.chapterId)}`;
});

const openReadModal = (col: Column, art: ColumnChapter) => {
  readModal.colId = col.id;
  readModal.chapterId = art.id;
  readModal.show = true;
};

const closeReadModal = () => {
  readModal.show = false;
};
</script>

<style scoped>
.column-manage-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  overflow: hidden;
}

/* Two-Column Container */
.cms-main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #ffffff;
}

/* 1. Left Aside */
.column-tree-aside {
  width: 270px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.tree-header-card {
  padding: 16px 16px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tree-title-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tree-main-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.btn-new-column {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  color: #2563eb;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 5px;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-new-column:hover {
  background: #eff6ff;
}

.tree-search {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.tree-search:focus-within {
  border-color: #93c5fd;
  background: #ffffff;
}

.tree-search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12.5px;
  color: #0f172a;
}

.tree-search-input::placeholder {
  color: #94a3b8;
}

.tree-empty-text {
  font-size: 12.5px;
  color: #94a3b8;
  text-align: center;
  padding: 18px 0;
}

.tree-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 6px 16px;
}

.column-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #334155;
  transition: all 0.15s ease;
  margin-bottom: 2px;
}

.column-list-item[draggable='true'] {
  cursor: grab;
}

.column-list-item.dragging {
  opacity: 0.45;
}

.column-list-item.drag-over-top {
  box-shadow: inset 0 2px 0 #10b981;
}

.column-list-item.drag-over-bottom {
  box-shadow: inset 0 -2px 0 #10b981;
}

.column-list-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.column-list-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.column-list-item.dimmed .column-item-title {
  color: #94a3b8;
}

.column-item-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-count-chip {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  flex-shrink: 0;
}

/* 2. Right Main */
.column-workbench-main {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  padding: 24px 32px 56px 32px;
  display: flex;
  flex-direction: column;
}

.column-meta-section {
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.col-header-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.col-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.col-main-title {
  font-size: 21px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.25;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.badge-published {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.badge-archived {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.col-action-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-plain {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-plain:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

/* Summary Stats Row */
.col-meta-summary-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  color: #64748b;
  margin-top: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-label {
  color: #94a3b8;
}

.meta-val {
  color: #334155;
}

.meta-divider {
  color: #e2e8f0;
}

.font-semibold {
  font-weight: 700;
  color: #0f172a;
}

/* 主操作按钮 */
.btn-primary-add {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
}

.btn-primary-add:hover {
  background: #1d4ed8;
}

/* 更多操作下拉 */
.more-menu-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.more-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 128px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
  padding: 5px;
  z-index: 30;
  display: flex;
  flex-direction: column;
}

.more-item {
  border: none;
  background: none;
  text-align: left;
  font-size: 13px;
  color: #334155;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.more-item:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.more-item.danger {
  color: #ef4444;
}

.more-item.danger:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Standard Table */
.table-wrap {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.pagination-row {
  display: flex;
  justify-content: flex-end;
  padding: 14px 2px 2px;
}

.pagination-row :deep(.el-pagination) {
  --el-color-primary: #2563eb;
  font-size: 12px;
}

.pagination-row :deep(.el-pagination .el-pagination__total) {
  color: #64748b;
}

.chapter-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.chapter-table thead tr {
  background: #f8fafc;
}

.chapter-table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.chapter-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.chapter-table tbody tr:nth-child(even) {
  background: #fafbfc;
}

.chapter-table tbody tr:last-child td {
  border-bottom: none;
}

.chapter-table tbody tr:hover {
  background: #f1f5f9;
}

.td-title {
  max-width: 340px;
}

.title-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
  line-height: 1.45;
}

.title-text:hover {
  color: #2563eb;
}

.th-status, .td-status { width: 80px; }
.th-time, .td-time { width: 150px; white-space: nowrap; }
.th-data, .td-data { width: 90px; white-space: nowrap; }

.th-ops {
  text-align: left;
  width: 240px;
}

.td-ops {
  text-align: left;
  white-space: nowrap;
}

.status-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.st-draft {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.st-published {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.st-archived {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.op-btn {
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.op-btn:hover {
  background: #eff6ff;
}

.op-btn.danger {
  color: #ef4444;
}

.op-btn.danger:hover {
  background: #fef2f2;
}

/* Empty State */
.empty-state-card {
  padding: 64px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-heading {
  font-size: 15px;
  font-weight: 700;
  color: #334155;
  margin: 0;
}

.empty-text {
  font-size: 13px;
  color: #94a3b8;
  margin: 6px 0 0 0;
}

.mt-3 {
  margin-top: 14px;
}

/* Modals */
.cms-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.cms-modal-card {
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

.modal-wide {
  max-width: 720px;
}

.cms-modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-h3 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-close-x {
  background: transparent;
  border: none;
  font-size: 16px;
  color: #94a3b8;
  cursor: pointer;
  flex-shrink: 0;
}
.modal-close-x:hover {
  color: #0f172a;
}

.cms-modal-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.required-star {
  color: #ef4444;
}

.field-error {
  font-size: 12px;
  color: #ef4444;
  margin: 0;
}

.cms-input, .cms-textarea {
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

.cms-input:focus, .cms-textarea:focus {
  border-color: #2563eb;
}

.cms-textarea {
  resize: vertical;
  line-height: 1.6;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
}

.cms-modal-footer {
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

.btn-confirm-blue {
  padding: 8px 18px;
  background: #2563eb;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}
.btn-confirm-blue:hover {
  background: #1d4ed8;
}

/* Markdown Editor Mode Tabs */
.content-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor-mode-tabs {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 2px;
}

.mode-tab {
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mode-tab.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* Read Drawer: 右侧抽屉（嵌 C 端专栏阅读页） */
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
  width: min(860px, 94vw);
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

.drawer-iframe {
  flex: 1;
  width: 100%;
  border: 0;
  background: #ffffff;
}

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* Drawer: 右侧滑入 */
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

/* ===== 二级页面：长文编辑器 ===== */
.article-editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
}

.editor-topbar {
  height: 54px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.btn-editor-back {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.btn-editor-back:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.editor-topbar-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.editor-topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-scroll-area {
  flex: 1;
  overflow-y: auto;
}

.editor-canvas {
  max-width: 860px;
  margin: 0 auto;
  padding: 36px 32px 90px;
  display: flex;
  flex-direction: column;
}

.editor-title-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  padding: 0 0 8px;
  letter-spacing: -0.3px;
}

.editor-title-input::placeholder {
  color: #cbd5e1;
}

.editor-meta-row {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
}

.meta-field {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 190px;
}

.meta-field-label {
  font-size: 12.5px;
  color: #94a3b8;
  white-space: nowrap;
}

.meta-field-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: #f8fafc;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 13px;
  color: #0f172a;
  transition: background 0.15s ease;
}

.meta-field-input:focus {
  background: #f1f5f9;
}

.author-field {
  position: relative;
}

.author-select {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.author-select .meta-field-input {
  padding-right: 26px;
}

.author-clear,
.author-arrow {
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
}

.author-clear:hover {
  color: #ef4444;
}

.author-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 30;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  max-height: 240px;
  overflow-y: auto;
  padding: 4px;
}

.author-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #0f172a;
}

.author-option:hover {
  background: #f1f5f9;
}

.author-option-role {
  flex-shrink: 0;
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 1px 6px;
}

.author-empty {
  padding: 10px;
  text-align: center;
  font-size: 12.5px;
  color: #94a3b8;
}

.editor-toolbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 8px 0;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
}

.editor-toolbar button {
  min-width: 30px;
  height: 30px;
  padding: 0 9px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.editor-toolbar button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.tb-divider {
  width: 1px;
  height: 16px;
  background: #e2e8f0;
  margin: 0 6px;
}

.color-menu-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.color-palette {
  position: absolute;
  top: 34px;
  left: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  z-index: 20;
}

.color-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid rgba(15, 23, 42, 0.1);
  transition: transform 0.12s ease;
}

.color-dot:hover {
  transform: scale(1.15);
}

.rich-editor {
  min-height: 58vh;
  font-size: 16px;
  line-height: 1.9;
  color: #1e293b;
  outline: none;
  padding-top: 14px;
  word-break: break-word;
}

.rich-editor:empty::before {
  content: attr(data-placeholder);
  color: #cbd5e1;
}

.rich-editor h2 {
  font-size: 21px;
  font-weight: 700;
  color: #0f172a;
  margin: 22px 0 10px;
}

.rich-editor h3 {
  font-size: 17.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 18px 0 8px;
}

.rich-editor p {
  margin: 0 0 12px;
}

.rich-editor ul,
.rich-editor ol {
  padding-left: 26px;
  margin: 0 0 12px;
}

.rich-editor li {
  margin: 4px 0;
}

.rich-editor blockquote {
  margin: 14px 0;
  padding: 8px 16px;
  border-left: 3px solid #e2e8f0;
  color: #64748b;
  background: #f8fafc;
  border-radius: 0 6px 6px 0;
}

.rich-editor a {
  color: rgb(2, 132, 199);
}

.rich-editor img {
  max-width: 100%;
  border-radius: 4px;
  margin: 6px 0;
}

.rich-editor hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 20px 0;
}

.rich-editor pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 0 0 12px;
}

.rich-editor strong {
  font-weight: 700;
  color: inherit;
}
</style>
