<template>
  <transition name="modal-fade">
    <div v-if="appState.isColumnAdminModalOpen" class="modal-overlay" @click.self="actions.closeColumnAdminModal">
      <div class="admin-modal-card">
        <!-- Modal Top Bar -->
        <div class="modal-top-bar">
          <div class="top-title-group">
            <div class="admin-badge-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="admin-modal-title">内容中心 · 专栏长文管理维护</h3>
              <p class="admin-modal-subtitle">专栏即长文系列，在此统一维护专栏分类目录与深度长文内容</p>
            </div>
          </div>
          <button class="btn-close-modal" @click="actions.closeColumnAdminModal" title="关闭">✕</button>
        </div>

        <!-- Admin Tabs (Articles List vs Categories) -->
        <div class="admin-tabs-row">
          <div class="tab-btn-group">
            <button 
              :class="['admin-tab', { active: currentTab === 'articles' }]"
              @click="currentTab = 'articles'"
            >
              <span>专栏长文库 ({{ totalArticlesCount }})</span>
            </button>
            <button 
              :class="['admin-tab', { active: currentTab === 'columns' }]"
              @click="currentTab = 'columns'"
            >
              <span>专栏分类目录 ({{ appState.columns.length }})</span>
            </button>
          </div>

          <button 
            v-if="currentTab === 'articles'"
            class="btn-primary-action"
            @click="openNewArticleDrawer"
          >
            + 发布新长文
          </button>
          <button 
            v-else
            class="btn-primary-action"
            @click="openNewColumnModal"
          >
            + 新建专栏分类
          </button>
        </div>

        <!-- TAB 1: ARTICLES LIST -->
        <div v-if="currentTab === 'articles'" class="admin-body-pane">
          <!-- Filter and Search Bar -->
          <div class="filter-search-toolbar">
            <div class="filter-select-group">
              <label class="filter-label">筛选专栏：</label>
              <select v-model="filterColumnId" class="admin-select-input">
                <option value="">全部专栏 ({{ appState.columns.length }}个)</option>
                <option v-for="col in appState.columns" :key="col.id" :value="col.id">
                  {{ col.title }} ({{ col.chapters.length }}篇)
                </option>
              </select>
            </div>

            <div class="search-input-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input v-model="searchKeyword" type="text" placeholder="搜索长文标题或作者..." class="admin-search-field" />
            </div>
          </div>

          <!-- Articles Table -->
          <div class="table-scroll-container">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th style="width: 32%;">长文标题</th>
                  <th style="width: 18%;">所属专栏</th>
                  <th style="width: 12%;">作者</th>
                  <th style="width: 10%;">状态</th>
                  <th style="width: 10%;">精华</th>
                  <th style="width: 18%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="art in filteredArticles" :key="art.id">
                  <td>
                    <div class="art-title-cell" :title="art.title">
                      <span class="cell-title-text">{{ art.title }}</span>
                      <span class="cell-word-count">{{ art.wordCount || 3200 }}字</span>
                    </div>
                  </td>
                  <td>
                    <span class="col-pill-badge">{{ getColumnTitle(art.columnId) }}</span>
                  </td>
                  <td>
                    <span class="author-tag-text">{{ art.author || 'Rich' }}</span>
                  </td>
                  <td>
                    <span class="status-published-tag">已发布</span>
                  </td>
                  <td>
                    <button 
                      :class="['btn-essence-toggle', { active: art.isEssence }]"
                      @click="toggleEssence(art.id)"
                      :title="art.isEssence ? '点击取消精华' : '点击加精（显示红色印章）'"
                    >
                      {{ art.isEssence ? '★ 精华印章' : '普通' }}
                    </button>
                  </td>
                  <td>
                    <div class="row-actions-group">
                      <button class="btn-action-text" @click="handlePreview(art)">阅读</button>
                      <button class="btn-action-text" @click="handleEditArticle(art)">编辑</button>
                      <button class="btn-action-text delete" @click="handleDeleteArticle(art.id)">删除</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredArticles.length === 0">
                  <td colspan="6" class="empty-table-cell">暂无符合条件的长文记录</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: COLUMNS LIST -->
        <div v-else class="admin-body-pane">
          <div class="table-scroll-container">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th style="width: 25%;">专栏名称</th>
                  <th style="width: 35%;">副标题/定位</th>
                  <th style="width: 12%;">长文篇数</th>
                  <th style="width: 12%;">负责人</th>
                  <th style="width: 16%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="col in appState.columns" :key="col.id">
                  <td>
                    <span class="font-bold text-navy">{{ col.title }}</span>
                  </td>
                  <td>
                    <span class="text-secondary text-sm">{{ col.subtitle }}</span>
                  </td>
                  <td>
                    <span class="badge-count">{{ col.chapters.length }} 篇长文</span>
                  </td>
                  <td>
                    <span class="text-sm font-medium">{{ col.author }}</span>
                  </td>
                  <td>
                    <div class="row-actions-group">
                      <button class="btn-action-text" @click="handleEditColumn(col)">编辑</button>
                      <button class="btn-action-text delete" @click="handleDeleteColumn(col.id)">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Edit/Create Article Drawer Modal -->
        <div v-if="isArticleFormOpen" class="sub-form-modal-overlay">
          <div class="sub-form-card">
            <div class="sub-form-header">
              <h4>{{ editingArticleId ? '编辑专栏长文' : '撰写并发布新长文' }}</h4>
              <button class="btn-close-sub" @click="isArticleFormOpen = false">✕</button>
            </div>
            
            <div class="sub-form-body">
              <div class="form-group">
                <label class="form-label">长文标题 <span class="req">*</span></label>
                <input v-model="formArticle.title" class="form-input" placeholder="例如：【市场状态】广度、风险与仓位，看清美股行情质量" />
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">归属专栏 <span class="req">*</span></label>
                  <select v-model="formArticle.columnId" class="form-input">
                    <option v-for="col in appState.columns" :key="col.id" :value="col.id">
                      {{ col.title }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">文章作者</label>
                  <input v-model="formArticle.author" class="form-input" placeholder="Rich / 老林说宏观" />
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">话题标签</label>
                  <input v-model="formArticleTagStr" class="form-input" placeholder="多个用逗号隔开，如：话题研究, 宏观策略" />
                </div>
                <div class="form-group switch-group">
                  <label class="form-label">精华印章</label>
                  <div class="switch-box" @click="formArticle.isEssence = !formArticle.isEssence">
                    <div :class="['custom-switch', { active: formArticle.isEssence }]">
                      <span class="switch-thumb"></span>
                    </div>
                    <span class="switch-hint">{{ formArticle.isEssence ? '已开启右上角「精华」红色水印印章' : '普通文章' }}</span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="content-header-tabs">
                  <label class="form-label">长文详细正文内容 <span class="req">*</span></label>
                  <div class="md-mode-switch">
                    <button 
                      type="button" 
                      :class="['mode-btn', { active: articleEditorMode === 'edit' }]" 
                      @click="articleEditorMode = 'edit'"
                    >
                      编辑 Markdown
                    </button>
                    <button 
                      type="button" 
                      :class="['mode-btn', { active: articleEditorMode === 'preview' }]" 
                      @click="articleEditorMode = 'preview'"
                    >
                      实时排版预览
                    </button>
                  </div>
                </div>

                <textarea 
                  v-if="articleEditorMode === 'edit'"
                  v-model="formArticle.content" 
                  class="form-textarea" 
                  rows="8" 
                  placeholder="在此输入或粘贴长文深度剖析内容，支持标准 Markdown 语法（标题、列表、粗体、引用、代码块等）..."
                ></textarea>

                <div 
                  v-else 
                  class="form-md-preview-box markdown-body" 
                  v-html="renderMarkdown(formArticle.content || '*(暂无正文内容，请切换到编辑模式输入)*')"
                ></div>
              </div>
            </div>

            <div class="sub-form-footer">
              <button class="btn-cancel" @click="isArticleFormOpen = false">取消</button>
              <button class="btn-submit" @click="submitArticleForm">保存并发布到专栏</button>
            </div>
          </div>
        </div>

        <!-- Edit/Create Column Modal -->
        <div v-if="isColumnFormOpen" class="sub-form-modal-overlay">
          <div class="sub-form-card" style="max-width: 520px;">
            <div class="sub-form-header">
              <h4>{{ editingColumnId ? '编辑专栏分类' : '新建专栏分类' }}</h4>
              <button class="btn-close-sub" @click="isColumnFormOpen = false">✕</button>
            </div>
            
            <div class="sub-form-body">
              <div class="form-group">
                <label class="form-label">专栏名称 <span class="req">*</span></label>
                <input v-model="formColumn.title" class="form-input" placeholder="例如：「美股指标」解析" />
              </div>
              <div class="form-group">
                <label class="form-label">副标题/简介</label>
                <input v-model="formColumn.subtitle" class="form-input" placeholder="例如：穿透宏观大盘与流动性定价指标" />
              </div>
              <div class="form-group">
                <label class="form-label">专栏负责人</label>
                <input v-model="formColumn.author" class="form-input" placeholder="例如：Rich" />
              </div>
            </div>

            <div class="sub-form-footer">
              <button class="btn-cancel" @click="isColumnFormOpen = false">取消</button>
              <button class="btn-submit" @click="submitColumnForm">保存专栏</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { appState, actions } from '@/stores/community';
import { Column, ColumnChapter } from '@/types';
import { renderMarkdown } from '@/utils/markdown';
import avatarRich from '@/assets/avatar_rich.png';

const currentTab = ref<'articles' | 'columns'>('articles');
const filterColumnId = ref<string>('');
const searchKeyword = ref<string>('');
const articleEditorMode = ref<'edit' | 'preview'>('edit');

// Total articles count across all columns
const totalArticlesCount = computed(() => {
  return appState.columns.reduce((sum, col) => sum + col.chapters.length, 0);
});

// All articles flattened with columnId
const allArticles = computed(() => {
  const list: (ColumnChapter & { columnId: string })[] = [];
  appState.columns.forEach(col => {
    col.chapters.forEach(art => {
      list.push({ ...art, columnId: col.id });
    });
  });
  return list;
});

// Filtered articles
const filteredArticles = computed(() => {
  return allArticles.value.filter(art => {
    const matchCol = !filterColumnId.value || art.columnId === filterColumnId.value;
    const matchKw = !searchKeyword.value.trim() || 
      art.title.toLowerCase().includes(searchKeyword.value.trim().toLowerCase()) ||
      (art.author && art.author.toLowerCase().includes(searchKeyword.value.trim().toLowerCase()));
    return matchCol && matchKw;
  });
});

const getColumnTitle = (colId?: string) => {
  if (!colId) return '默认专栏';
  const c = appState.columns.find(x => x.id === colId);
  return c ? c.title : '专栏';
};

const toggleEssence = (artId: string) => {
  actions.toggleEssenceArticle(artId);
};

const handlePreview = (art: ColumnChapter & { columnId: string }) => {
  actions.selectArticle(art.columnId, art.id);
  actions.closeColumnAdminModal();
};

const handleDeleteArticle = (artId: string) => {
  if (confirm('确定要删除这篇专栏长文吗？')) {
    actions.deleteArticle(artId);
  }
};

const handleDeleteColumn = (colId: string) => {
  if (confirm('确定要删除该专栏分类吗？其包含的长文将被一并移除。')) {
    actions.deleteColumn(colId);
  }
};

// Article Form Drawer
const isArticleFormOpen = ref(false);
const editingArticleId = ref<string | null>(null);
const formArticleTagStr = ref('');
const formArticle = reactive<Partial<ColumnChapter>>({
  title: '',
  columnId: '',
  author: 'Rich',
  content: '',
  isEssence: true
});

const openNewArticleDrawer = () => {
  editingArticleId.value = null;
  formArticle.title = '';
  formArticle.columnId = filterColumnId.value || appState.selectedColumnId || appState.columns[0]?.id;
  formArticle.author = 'Rich';
  formArticle.authorAvatar = avatarRich;
  formArticle.content = '';
  formArticle.isEssence = true;
  formArticleTagStr.value = '话题研究';
  isArticleFormOpen.value = true;
};

const handleEditArticle = (art: ColumnChapter & { columnId: string }) => {
  editingArticleId.value = art.id;
  formArticle.id = art.id;
  formArticle.title = art.title;
  formArticle.columnId = art.columnId;
  formArticle.author = art.author || 'Rich';
  formArticle.authorAvatar = art.authorAvatar || avatarRich;
  formArticle.content = art.content || art.summary;
  formArticle.isEssence = !!art.isEssence;
  formArticleTagStr.value = (art.tags || ['话题研究']).join(', ');
  isArticleFormOpen.value = true;
};

const submitArticleForm = () => {
  if (!formArticle.title?.trim()) {
    alert('请填写长文标题');
    return;
  }
  const tags = formArticleTagStr.value.split(/[,，]/).map(t => t.trim()).filter(Boolean);
  actions.saveArticle({
    ...formArticle,
    tags: tags.length ? tags : ['话题研究']
  }, formArticle.columnId);
  isArticleFormOpen.value = false;
};

// Column Form Modal
const isColumnFormOpen = ref(false);
const editingColumnId = ref<string | null>(null);
const formColumn = reactive<Partial<Column>>({
  title: '',
  subtitle: '',
  author: 'Rich'
});

const openNewColumnModal = () => {
  editingColumnId.value = null;
  formColumn.id = undefined;
  formColumn.title = '';
  formColumn.subtitle = '';
  formColumn.author = 'Rich';
  isColumnFormOpen.value = true;
};

const handleEditColumn = (col: Column) => {
  editingColumnId.value = col.id;
  formColumn.id = col.id;
  formColumn.title = col.title;
  formColumn.subtitle = col.subtitle;
  formColumn.author = col.author;
  isColumnFormOpen.value = true;
};

const submitColumnForm = () => {
  if (!formColumn.title?.trim()) {
    alert('请填写专栏名称');
    return;
  }
  actions.saveColumn({ ...formColumn });
  isColumnFormOpen.value = false;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.admin-modal-card {
  width: 900px;
  max-width: 95vw;
  height: 85vh;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.top-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-badge-icon {
  width: 38px;
  height: 38px;
  background: #ecfdf5;
  color: #059669;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-modal-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.admin-modal-subtitle {
  font-size: 12px;
  color: #64748b;
  margin: 2px 0 0 0;
}

.btn-close-modal {
  background: transparent;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-close-modal:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Tabs */
.admin-tabs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.tab-btn-group {
  display: flex;
  gap: 8px;
}

.admin-tab {
  background: transparent;
  border: none;
  font-size: 13.5px;
  font-weight: 600;
  color: #64748b;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.admin-tab:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.admin-tab.active {
  background: #0f172a;
  color: #ffffff;
}

.btn-primary-action {
  background: #10b981;
  color: #ffffff;
  border: none;
  font-size: 13px;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-primary-action:hover {
  background: #059669;
}

/* Body Pane */
.admin-body-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 16px 24px;
}

.filter-search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.filter-select-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: #64748b;
}

.admin-select-input {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  color: #1e293b;
  outline: none;
  background: #ffffff;
}

.search-input-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 12px;
  width: 240px;
  color: #64748b;
}

.admin-search-field {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  width: 100%;
}

/* Table */
.table-scroll-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
}

.admin-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}

.admin-data-table th {
  background: #f8fafc;
  padding: 10px 14px;
  color: #64748b;
  font-weight: 700;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 10;
}

.admin-data-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #f8fafc;
  color: #334155;
}

.admin-data-table tr:hover td {
  background: #fcfdfe;
}

.art-title-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cell-title-text {
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

.cell-word-count {
  font-size: 11px;
  color: #94a3b8;
}

.col-pill-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 500;
}

.status-published-tag {
  color: #059669;
  background: #ecfdf5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
}

.btn-essence-toggle {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #94a3b8;
  font-size: 11.5px;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-essence-toggle.active {
  background: #fef2f2;
  border-color: #fecaca;
  color: #ef4444;
  font-weight: 700;
}

.row-actions-group {
  display: flex;
  gap: 10px;
}

.btn-action-text {
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.btn-action-text:hover {
  text-decoration: underline;
}

.btn-action-text.delete {
  color: #ef4444;
}

.empty-table-cell {
  text-align: center;
  padding: 40px !important;
  color: #94a3b8;
}

/* Sub-form Modal (Article / Column) */
.sub-form-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.sub-form-card {
  width: 680px;
  max-width: 90vw;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sub-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.sub-form-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.btn-close-sub {
  background: transparent;
  border: none;
  font-size: 16px;
  color: #94a3b8;
  cursor: pointer;
}

.sub-form-body {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #334155;
}

.req {
  color: #ef4444;
}

.form-input {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13.5px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-input:focus {
  border-color: #10b981;
}

.form-textarea {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13.5px;
  color: #1e293b;
  outline: none;
  resize: vertical;
  line-height: 1.6;
  font-family: inherit;
}

.form-textarea:focus {
  border-color: #10b981;
}

/* Content Header Tabs & Preview Switch */
.content-header-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.md-mode-switch {
  display: flex;
  background: #e2e8f0;
  padding: 2px;
  border-radius: 6px;
  gap: 2px;
}

.mode-btn {
  background: transparent;
  border: none;
  font-size: 11.5px;
  color: #64748b;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;
}

.mode-btn.active {
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.form-md-preview-box {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 14px 16px;
  min-height: 180px;
  max-height: 320px;
  overflow-y: auto;
  background: #f8fafc;
  line-height: 1.8;
  font-size: 14px;
  color: #334155;
}

.form-md-preview-box :deep(h1),
.form-md-preview-box :deep(h2),
.form-md-preview-box :deep(h3) {
  color: #0f172a;
  font-weight: 800;
  margin: 16px 0 8px;
}

.form-md-preview-box :deep(h3) {
  font-size: 15px;
  border-left: 3px solid #10b981;
  padding-left: 8px;
}

.form-md-preview-box :deep(ol),
.form-md-preview-box :deep(ul) {
  margin: 6px 0 10px 18px;
  padding: 0;
}

.form-md-preview-box :deep(li) {
  margin-bottom: 4px;
  line-height: 1.6;
}

.form-md-preview-box :deep(strong) {
  color: #0f172a;
  font-weight: 700;
}

/* Custom Switch */
.switch-group {
  justify-content: space-between;
}

.switch-box {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 4px;
}

.custom-switch {
  width: 36px;
  height: 20px;
  background: #cbd5e1;
  border-radius: 99px;
  position: relative;
  transition: background 0.2s ease;
}

.custom-switch.active {
  background: #ef4444;
}

.switch-thumb {
  width: 16px;
  height: 16px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
}

.custom-switch.active .switch-thumb {
  transform: translateX(16px);
}

.switch-hint {
  font-size: 12px;
  color: #64748b;
}

.sub-form-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit {
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 7px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-submit:hover {
  background: #059669;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
