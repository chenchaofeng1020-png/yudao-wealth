<template>
  <div class="column-manage-layout animate-fade-in">
    <!-- Top Header Bar: Only the view title matching sidebar menu name -->
    <header class="cms-header-bar">
      <h1 class="header-title">专栏管理</h1>
    </header>

    <!-- Main Two-Column Container -->
    <div class="cms-main-container">
      <!-- 1. Left Aside: Column Directory Tree -->
      <aside class="column-tree-aside">
        <!-- Tree Header -->
        <div class="tree-header-card">
          <div class="tree-header-top">
            <div class="tree-title-text">
              <span class="tree-main-title">专栏列表</span>
              <span class="tree-count-chip">{{ appState.columns.length }}</span>
            </div>

            <button class="btn-new-column" @click="openAddColumnModal" title="新建专栏">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>新建专栏</span>
            </button>
          </div>

          <!-- Tree Quick Search -->
          <div class="tree-search-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              v-model="treeSearchQuery" 
              type="text" 
              placeholder="搜索专栏分类..." 
              class="tree-search-input"
            />
            <span v-if="treeSearchQuery" class="clear-icon" @click="treeSearchQuery = ''">✕</span>
          </div>
        </div>

        <!-- Tree Nodes Scroll Area -->
        <!-- Column Names Scroll Area (Only column names, no article contents) -->
        <div class="tree-scroll-container">
          <div 
            v-for="col in filteredColumns" 
            :key="col.id" 
            :class="['column-list-item', { active: selectedColumnId === col.id }]"
            @click="selectColumn(col)"
          >
            <span class="column-item-title" :title="col.title">
              {{ col.title }}
            </span>

            <div class="column-item-trailing">
              <span class="column-count-chip">({{ col.chapters.length }})</span>
              <span v-if="col.isCompleted" class="column-done-check" title="专栏已结篇">✓</span>
            </div>
          </div>
        </div>

        <!-- Tree Bottom Footer -->
        <div class="tree-bottom-footer">
          <button class="btn-reset-tree" @click="resetToDefaultColumns">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>重置演示专栏</span>
          </button>
        </div>
      </aside>

      <!-- 2. Right Content Area: Pure White Background -->
      <main class="column-workbench-main" v-if="selectedColumn">
        <!-- Column Header Details -->
        <section class="column-meta-section">
          <div class="col-header-top-row">
            <div class="col-title-group">
              <h2 class="col-main-title">{{ selectedColumn.title }}</h2>
              <span :class="['status-badge', selectedColumn.isCompleted ? 'status-completed' : 'status-ongoing']">
                {{ selectedColumn.isCompleted ? '已结篇' : '连载更新中' }}
              </span>
            </div>

            <!-- Action Buttons Group -->
            <div class="col-action-btns">
              <button class="btn-primary-add" @click="openAddArticleModal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>添加长文</span>
              </button>

              <button class="btn-secondary-collect" @click="openCollectModal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>收录星球主题</span>
              </button>

              <button class="btn-text-danger" @click="handleDeleteColumn(selectedColumn)">
                删除专栏
              </button>
            </div>
          </div>

          <p class="col-subtitle-text">
            {{ selectedColumn.subtitle || '系统梳理核心逻辑与投研脉络，沉淀高确定性分析底座。' }}
          </p>

          <div class="col-meta-summary-bar">
            <div class="meta-item">
              <span class="meta-label">负责人:</span>
              <span class="meta-val">{{ (selectedColumn.leaders && selectedColumn.leaders.join('、')) || selectedColumn.author }}</span>
            </div>
            <span class="meta-divider">/</span>
            <div class="meta-item">
              <span class="meta-label">专栏长文:</span>
              <span class="meta-val font-semibold">{{ selectedColumn.chapters.length }} 篇</span>
            </div>
            <span class="meta-divider">/</span>
            <div class="meta-item">
              <span class="meta-label">收录主题:</span>
              <span class="meta-val font-semibold">{{ selectedColumn.collectedTopics?.length || 0 }} 个</span>
            </div>
            <span class="meta-divider">/</span>
            <div class="meta-item">
              <span class="meta-label">订阅人数:</span>
              <span class="meta-val">{{ selectedColumn.subscriberCount || 420 }} 人</span>
            </div>
          </div>
        </section>

        <!-- Tabs Bar: 专栏长文 vs 收录主题 -->
        <div class="workbench-tabs-nav">
          <div class="tabs-nav-left">
            <button 
              :class="['tab-nav-btn', { active: activeSubTab === 'articles' }]"
              @click="activeSubTab = 'articles'"
            >
              专栏长文
              <span class="tab-badge">{{ selectedColumn.chapters.length }}</span>
            </button>

            <button 
              :class="['tab-nav-btn', { active: activeSubTab === 'topics' }]"
              @click="activeSubTab = 'topics'"
            >
              收录主题
              <span class="tab-badge">{{ selectedColumn.collectedTopics?.length || 0 }}</span>
            </button>
          </div>

          <!-- In-column Search Input -->
          <div class="tabs-nav-right">
            <div class="in-column-search">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                v-model="articleSearchQuery" 
                type="text" 
                placeholder="搜索长文标题或标签..." 
                class="in-column-input"
              />
              <span v-if="articleSearchQuery" class="clear-icon" @click="articleSearchQuery = ''">✕</span>
            </div>
          </div>
        </div>

        <!-- Tab 1: 专栏长文列表 (Flat list on pure white background) -->
        <section v-if="activeSubTab === 'articles'" class="tab-content-section">
          <div v-if="filteredChapters.length" class="articles-flat-list">
            <article 
              v-for="(art, idx) in filteredChapters" 
              :key="art.id" 
              class="article-flat-item"
            >
              <div class="art-main-info">
                <!-- Title Row with Badges -->
                <div class="art-title-row">
                  <h3 class="art-title-text" @click="handlePreviewChapter(selectedColumn, art)">
                    {{ art.title }}
                  </h3>
                  <span v-if="art.isPinned || idx === 0" class="badge-pinned">置顶</span>
                  <span v-if="art.isFreeTrial" class="badge-trial">免费试读</span>
                </div>

                <!-- Excerpt Summary -->
                <p class="art-summary-text">
                  {{ art.summary || '暂无章节导读摘要，点击右侧编辑完善深度长文导读与逻辑纲要。' }}
                </p>

                <!-- Footer Meta & Tags -->
                <div class="art-footer-meta">
                  <span class="footer-author">作者: {{ art.author || selectedColumn.author }}</span>
                  <span class="dot-sep">·</span>
                  <span class="footer-date">{{ art.createdAt || art.updatedAt || '2026-09-18' }}</span>
                  <span class="dot-sep">·</span>
                  <span class="footer-count">字数 {{ art.wordCount || 2800 }}</span>
                  <span class="dot-sep">·</span>
                  <span class="footer-read">阅读 {{ art.readCount || 890 }} 次</span>

                  <div v-if="art.tags && art.tags.length" class="art-tags-row">
                    <span v-for="tag in art.tags" :key="tag" class="tag-pill">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right Actions Row -->
              <div class="art-operations-group">
                <button 
                  class="action-link-btn" 
                  @click="handlePreviewChapter(selectedColumn, art)"
                  title="在前台阅读器查看完整排版"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>阅读</span>
                </button>

                <button 
                  class="action-link-btn" 
                  @click="handleEditChapter(art)"
                  title="编辑文章属性与内容"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>编辑</span>
                </button>

                <button 
                  class="action-link-btn danger" 
                  @click="handleDeleteChapter(selectedColumn.id, art.id)"
                  title="从专栏中删除该篇长文"
                >
                  <span>删除</span>
                </button>
              </div>
            </article>
          </div>

          <!-- Empty State: Articles -->
          <div v-else class="empty-state-card">
            <div class="empty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h4 class="empty-heading">该专栏下暂无长文</h4>
            <p class="empty-text">点击下方按钮立即撰写并沉淀新的投研长文至本专栏</p>
            <button class="btn-primary-add mt-3" @click="openAddArticleModal">
              + 撰写并发布长文
            </button>
          </div>
        </section>

        <!-- Tab 2: 收录主题列表 (From Community Feed) -->
        <section v-if="activeSubTab === 'topics'" class="tab-content-section">
          <div v-if="selectedColumn.collectedTopics && selectedColumn.collectedTopics.length" class="articles-flat-list">
            <article 
              v-for="topic in selectedColumn.collectedTopics" 
              :key="topic.id" 
              class="article-flat-item"
            >
              <div class="art-main-info">
                <div class="art-title-row">
                  <h3 class="art-title-text" @click="goToTopicInFeed(topic)">
                    {{ topic.title }}
                  </h3>
                  <span class="badge-collected">星球收录</span>
                </div>

                <div class="collected-reason-box">
                  <span class="reason-tag">收录理由：</span>
                  <span class="reason-text">{{ topic.reason || '该主题具备长周期参考价值，经教研组审核收录入专栏沉淀库。' }}</span>
                </div>

                <div class="art-footer-meta">
                  <span class="footer-author">原发作者: {{ topic.author }}</span>
                  <span class="dot-sep">·</span>
                  <span class="footer-date">原发时间: {{ topic.createdAt }}</span>
                  <span class="dot-sep">·</span>
                  <span class="footer-read">获赞 {{ topic.likes }} · {{ topic.commentsCount }} 条深度讨论</span>

                  <div v-if="topic.tags && topic.tags.length" class="art-tags-row">
                    <span v-for="tag in topic.tags" :key="tag" class="tag-pill">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Topic Operations -->
              <div class="art-operations-group">
                <button 
                  class="action-link-btn" 
                  @click="goToTopicInFeed(topic)"
                  title="前往星球查看原讨论帖"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>查看原帖</span>
                </button>

                <button 
                  class="action-link-btn danger" 
                  @click="removeCollectedTopic(selectedColumn.id, topic.id)"
                  title="将该主题移出本专栏"
                >
                  <span>移出专栏</span>
                </button>
              </div>
            </article>
          </div>

          <!-- Empty State: Topics -->
          <div v-else class="empty-state-card">
            <div class="empty-icon-box">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h4 class="empty-heading">暂未收录星球主题</h4>
            <p class="empty-text">可从星球日常动态流中，精选高赞高互动的星友干货一键沉淀至本专栏</p>
            <button class="btn-secondary-collect mt-3" @click="openCollectModal">
              + 从星球收录主题
            </button>
          </div>
        </section>
      </main>
    </div>

    <!-- Modal 1: 添加/编辑专栏长文弹窗 -->
    <transition name="modal-fade">
      <div v-if="showArticleModal" class="cms-modal-backdrop" @click.self="showArticleModal = false">
        <div class="cms-modal-card animate-slide-up">
          <div class="cms-modal-header">
            <h3 class="modal-h3">{{ isEditingArticle ? '编辑专栏长文' : '撰写新长文' }}</h3>
            <button class="modal-close-x" @click="showArticleModal = false">✕</button>
          </div>

          <div class="cms-modal-body">
            <div class="form-row">
              <label class="form-label">长文标题 <span class="required-star">*</span></label>
              <input 
                type="text" 
                v-model="articleForm.title" 
                placeholder="例如：全球 AI 算力基础设施与芯片产业链全景深度剖析" 
                class="cms-input"
              />
            </div>

            <div class="form-grid-2">
              <div class="form-row">
                <label class="form-label">主笔作者</label>
                <input type="text" v-model="articleForm.author" placeholder="志诚" class="cms-input" />
              </div>
              <div class="form-row">
                <label class="form-label">预估字数</label>
                <input type="number" v-model.number="articleForm.wordCount" placeholder="3800" class="cms-input" />
              </div>
            </div>

            <div class="form-row">
              <label class="form-label">核心摘要 / 导读提要</label>
              <textarea 
                v-model="articleForm.summary" 
                placeholder="简要概述该篇长文的核心研究结论、论证框架与安全边际打分..." 
                rows="3" 
                class="cms-textarea"
              ></textarea>
            </div>

            <div class="form-row">
              <label class="form-label">关联标签（空格隔开）</label>
              <input 
                type="text" 
                v-model="articleForm.tagsText" 
                placeholder="算力底座 半导体 投资脉络" 
                class="cms-input"
              />
            </div>

            <div class="form-checkboxes">
              <label class="checkbox-item">
                <input type="checkbox" v-model="articleForm.isPinned" class="cms-checkbox" />
                <span>在此专栏中置顶展示</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="articleForm.isFreeTrial" class="cms-checkbox" />
                <span>开放试读（非会员可免费阅读前言导读）</span>
              </label>
            </div>
          </div>

          <div class="cms-modal-footer">
            <button class="btn-cancel" @click="showArticleModal = false">取消</button>
            <button class="btn-confirm-blue" @click="saveArticle">确认发布长文</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal 2: 收录主题弹窗 -->
    <transition name="modal-fade">
      <div v-if="showCollectModal" class="cms-modal-backdrop" @click.self="showCollectModal = false">
        <div class="cms-modal-card animate-slide-up">
          <div class="cms-modal-header">
            <h3 class="modal-h3">从星球主题流收录至「{{ selectedColumn?.title }}」</h3>
            <button class="modal-close-x" @click="showCollectModal = false">✕</button>
          </div>

          <div class="cms-modal-body">
            <p class="collect-tip">勾选以下星球精选主题帖，将其沉淀至当前专栏的“收录主题”知识树中：</p>
            <div class="collect-posts-list">
              <div 
                v-for="post in appState.posts" 
                :key="post.id" 
                :class="['collect-post-item', { selected: selectedPostIdsToCollect.has(post.id) }]"
                @click="toggleSelectPostToCollect(post.id)"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedPostIdsToCollect.has(post.id)" 
                  class="cms-checkbox"
                  @click.stop="toggleSelectPostToCollect(post.id)"
                />
                <div class="collect-post-info">
                  <div class="cpi-title">{{ post.title || post.content.slice(0, 36) + '...' }}</div>
                  <div class="cpi-meta">
                    <span>作者: {{ post.author.name }}</span>
                    <span>·</span>
                    <span>{{ post.createdAt }}</span>
                    <span>·</span>
                    <span>获赞 {{ post.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="cms-modal-footer">
            <button class="btn-cancel" @click="showCollectModal = false">取消</button>
            <button class="btn-confirm-blue" @click="confirmCollectPosts">
              确认收录 ({{ selectedPostIdsToCollect.size }})
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal 3: 添加专栏弹窗 -->
    <transition name="modal-fade">
      <div v-if="showAddColumnModal" class="cms-modal-backdrop" @click.self="showAddColumnModal = false">
        <div class="cms-modal-card animate-slide-up">
          <div class="cms-modal-header">
            <h3 class="modal-h3">创建全新专栏</h3>
            <button class="modal-close-x" @click="showAddColumnModal = false">✕</button>
          </div>

          <div class="cms-modal-body">
            <div class="form-row">
              <label class="form-label">专栏名称 <span class="required-star">*</span></label>
              <input type="text" v-model="newColumnForm.title" placeholder="例如：新质生产力深度拆解" class="cms-input" />
            </div>

            <div class="form-row">
              <label class="form-label">副标题 / 核心定位</label>
              <input type="text" v-model="newColumnForm.subtitle" placeholder="理清产业脉络与估值护城河" class="cms-input" />
            </div>

            <div class="form-grid-2">
              <div class="form-row">
                <label class="form-label">主导负责人</label>
                <input type="text" v-model="newColumnForm.leadersText" placeholder="若琪 志诚" class="cms-input" />
              </div>
              <div class="form-row">
                <label class="form-label">定价 (元)</label>
                <input type="number" v-model.number="newColumnForm.price" placeholder="299" class="cms-input" />
              </div>
            </div>
          </div>

          <div class="cms-modal-footer">
            <button class="btn-cancel" @click="showAddColumnModal = false">取消</button>
            <button class="btn-confirm-blue" @click="saveNewColumn">创建专栏</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { appState, actions } from '../store';
import { Column, ColumnChapter } from '../types';
import '../client.css';

defineOptions({ name: 'CmsContent' })

const selectedColumnId = ref<string>('col-ai-1');
const activeSubTab = ref<'articles' | 'topics'>('articles');
const treeSearchQuery = ref('');
const articleSearchQuery = ref('');

// Filtered column list for the tree
const filteredColumns = computed(() => {
  if (!treeSearchQuery.value.trim()) {
    return appState.columns;
  }
  const q = treeSearchQuery.value.trim().toLowerCase();
  return appState.columns.filter(c => c.title.toLowerCase().includes(q));
});

// Selected Column
const selectedColumn = computed(() => {
  return appState.columns.find(c => c.id === selectedColumnId.value) || appState.columns[0];
});

// Filtered chapters inside the selected column
const filteredChapters = computed(() => {
  if (!selectedColumn.value) return [];
  if (!articleSearchQuery.value.trim()) {
    return selectedColumn.value.chapters;
  }
  const q = articleSearchQuery.value.trim().toLowerCase();
  return selectedColumn.value.chapters.filter(ch => 
    ch.title.toLowerCase().includes(q) || 
    (ch.summary && ch.summary.toLowerCase().includes(q)) ||
    (ch.tags && ch.tags.some(t => t.toLowerCase().includes(q)))
  );
});

const selectColumn = (col: Column) => {
  selectedColumnId.value = col.id;
};

const resetToDefaultColumns = () => {
  actions.showToast('演示专栏已同步刷新至最新状态');
};

const handlePreviewChapter = (col: Column, ch: ColumnChapter) => {
  actions.openChapter(col.title, ch.title, ch.summary);
};

const handleDeleteChapter = (colId: string, chId: string) => {
  const col = appState.columns.find(c => c.id === colId);
  if (col) {
    const idx = col.chapters.findIndex(ch => ch.id === chId);
    if (idx !== -1) {
      const removed = col.chapters.splice(idx, 1);
      actions.showToast(`已删除长文：${removed[0]?.title}`);
    }
  }
};

const handleDeleteColumn = (col: Column) => {
  if (confirm(`确定要删除专栏《${col.title}》吗？`)) {
    actions.deleteColumn(col.id);
    if (appState.columns.length > 0) {
      selectedColumnId.value = appState.columns[0].id;
    }
  }
};

// Modal 1: Article Form
const showArticleModal = ref(false);
const isEditingArticle = ref(false);
const editingArticleId = ref<string | null>(null);

const articleForm = reactive({
  title: '',
  author: '志诚',
  wordCount: 3200,
  summary: '',
  tagsText: '前沿产业 算力底座',
  isPinned: false,
  isFreeTrial: true,
});

const openAddArticleModal = () => {
  isEditingArticle.value = false;
  editingArticleId.value = null;
  articleForm.title = '';
  articleForm.author = appState.user.name;
  articleForm.wordCount = 3500;
  articleForm.summary = '';
  articleForm.tagsText = '算力底座 投资脉络';
  articleForm.isPinned = false;
  articleForm.isFreeTrial = true;
  showArticleModal.value = true;
};

const handleEditChapter = (art: ColumnChapter) => {
  isEditingArticle.value = true;
  editingArticleId.value = art.id;
  articleForm.title = art.title;
  articleForm.author = art.author || selectedColumn.value?.author || '志诚';
  articleForm.wordCount = art.wordCount || 2800;
  articleForm.summary = art.summary;
  articleForm.tagsText = (art.tags || []).join(' ');
  articleForm.isPinned = !!art.isPinned;
  articleForm.isFreeTrial = art.isFreeTrial;
  showArticleModal.value = true;
};

const saveArticle = () => {
  if (!articleForm.title.trim()) {
    actions.showToast('请填写长文标题');
    return;
  }
  const col = selectedColumn.value;
  if (!col) return;

  const tags = articleForm.tagsText.split(/\s+/).filter(t => t.trim());

  if (isEditingArticle.value && editingArticleId.value) {
    const target = col.chapters.find(ch => ch.id === editingArticleId.value);
    if (target) {
      target.title = articleForm.title.trim();
      target.author = articleForm.author;
      target.wordCount = articleForm.wordCount;
      target.summary = articleForm.summary;
      target.tags = tags;
      target.isPinned = articleForm.isPinned;
      target.isFreeTrial = articleForm.isFreeTrial;
      target.updatedAt = '刚刚';
      actions.showToast('长文修改已保存！');
    }
  } else {
    const newCh: ColumnChapter = {
      id: 'ch-new-' + Date.now(),
      title: articleForm.title.trim(),
      author: articleForm.author,
      wordCount: articleForm.wordCount,
      summary: articleForm.summary || '深度研报解读与逻辑提炼。',
      isFreeTrial: articleForm.isFreeTrial,
      isPinned: articleForm.isPinned,
      tags: tags.length ? tags : ['核心研报'],
      createdAt: '刚刚',
      updatedAt: '刚刚',
      readCount: 1,
    };
    if (articleForm.isPinned) {
      col.chapters.unshift(newCh);
    } else {
      col.chapters.push(newCh);
    }
    actions.showToast(`长文《${newCh.title}》发布成功！已沉淀入专栏`);
  }
  showArticleModal.value = false;
};

// Modal 2: Collect Posts
const showCollectModal = ref(false);
const selectedPostIdsToCollect = ref<Set<string>>(new Set());

const openCollectModal = () => {
  selectedPostIdsToCollect.value.clear();
  showCollectModal.value = true;
};

const toggleSelectPostToCollect = (id: string) => {
  if (selectedPostIdsToCollect.value.has(id)) {
    selectedPostIdsToCollect.value.delete(id);
  } else {
    selectedPostIdsToCollect.value.add(id);
  }
};

const confirmCollectPosts = () => {
  if (!selectedPostIdsToCollect.value.size) {
    actions.showToast('请勾选要收录的主题');
    return;
  }
  const col = selectedColumn.value;
  if (!col) return;
  if (!col.collectedTopics) {
    col.collectedTopics = [];
  }

  for (const postId of selectedPostIdsToCollect.value) {
    const p = appState.posts.find(post => post.id === postId);
    if (p && !col.collectedTopics.some(t => t.id === p.id)) {
      col.collectedTopics.push({
        id: p.id,
        title: p.title || p.content.slice(0, 32),
        author: p.author.name,
        createdAt: p.createdAt,
        likes: p.likes,
        commentsCount: p.commentsCount,
        collectedAt: '刚刚',
        reason: '星球高价值干货，管理员精选收录入库',
        tags: p.tags,
      });
    }
  }
  actions.showToast(`成功将 ${selectedPostIdsToCollect.value.size} 个主题收录进《${col.title}》！`);
  showCollectModal.value = false;
};

const removeCollectedTopic = (colId: string, topicId: string) => {
  const col = appState.columns.find(c => c.id === colId);
  if (col && col.collectedTopics) {
    col.collectedTopics = col.collectedTopics.filter(t => t.id !== topicId);
    actions.showToast('已取消收录该主题');
  }
};

const goToTopicInFeed = (topic: any) => {
  actions.setCurrentView('feed');
  actions.showToast(`已跳转至主题原贴：${topic.title}`);
};

// Modal 3: Add Column Form
const showAddColumnModal = ref(false);
const newColumnForm = reactive({
  title: '',
  subtitle: '',
  leadersText: '若琪 志诚',
  price: 299,
});

const openAddColumnModal = () => {
  newColumnForm.title = '';
  newColumnForm.subtitle = '';
  newColumnForm.leadersText = '若琪 志诚';
  newColumnForm.price = 299;
  showAddColumnModal.value = true;
};

const saveNewColumn = () => {
  if (!newColumnForm.title.trim()) {
    actions.showToast('请输入专栏名称');
    return;
  }
  const leaders = newColumnForm.leadersText.split(/\s+/).filter(l => l.trim());
  const newCol: Column = {
    id: 'col-custom-' + Date.now(),
    title: newColumnForm.title.trim().startsWith('「') ? newColumnForm.title.trim() : `「${newColumnForm.title.trim()}」实战`,
    subtitle: newColumnForm.subtitle || '深度产业逻辑沉淀与研判',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    author: leaders.join(' / ') || appState.user.name,
    authorTitle: '核心投研智囊',
    price: newColumnForm.price || 299,
    originPrice: (newColumnForm.price || 299) * 2,
    subscriberCount: 1,
    chapterCount: 0,
    tags: ['产业深度', '投研实战'],
    status: 'published',
    isCompleted: false,
    leaders: leaders,
    collectedTopics: [],
    chapters: [],
  };

  appState.columns.unshift(newCol);
  selectedColumnId.value = newCol.id;
  expandedNodeIds.value.add(newCol.id);
  actions.showToast(`专栏《${newCol.title}》创建成功！已就绪`);
  showAddColumnModal.value = false;
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

/* Top Header Bar: Pure & Minimalist */
.cms-header-bar {
  height: 54px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
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

/* Two-Column Workbench Container */
.cms-main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #ffffff;
}

/* 1. Left Aside: Column Tree */
.column-tree-aside {
  width: 270px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.tree-header-card {
  padding: 16px 28px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tree-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tree-title-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tree-main-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.tree-count-chip {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 99px;
}

.btn-new-column {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.btn-new-column:hover {
  background: #eff6ff;
}

.tree-search-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 8px;
}

.tree-search-input {
  border: none;
  background: transparent;
  font-size: 12px;
  color: #0f172a;
  outline: none;
  width: 100%;
}

.clear-icon {
  font-size: 11px;
  color: #94a3b8;
  cursor: pointer;
}

.tree-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 28px;
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

.column-list-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.column-list-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.column-item-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-item-trailing {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.column-count-chip {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.column-list-item.active .column-count-chip {
  color: #2563eb;
}

.column-done-check {
  color: #10b981;
  font-size: 12px;
  font-weight: 700;
}

.tree-bottom-footer {
  padding: 12px 16px;
  border-top: 1px solid #f1f5f9;
}

.btn-reset-tree {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 6px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-reset-tree:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* 2. Right Main Workbench: Pure White Background */
.column-workbench-main {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  padding: 28px 36px 64px 36px;
  display: flex;
  flex-direction: column;
}

/* Column Header Meta Section */
.column-meta-section {
  padding-bottom: 20px;
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
  font-size: 22px;
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
}

.status-completed {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-ongoing {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.col-action-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-primary-add {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-primary-add:hover {
  background: #1d4ed8;
}

.btn-secondary-collect {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-secondary-collect:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

.btn-text-danger {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px;
}
.btn-text-danger:hover {
  text-decoration: underline;
  color: #dc2626;
}

.col-subtitle-text {
  font-size: 13.5px;
  color: #64748b;
  margin: 8px 0 12px 0;
  line-height: 1.5;
}

.col-meta-summary-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #64748b;
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
  font-weight: 600;
  color: #0f172a;
}

/* Tabs Navigation */
.workbench-tabs-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  margin-top: 14px;
}

.tabs-nav-left {
  display: flex;
  gap: 24px;
}

.tab-nav-btn {
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  padding: 12px 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  transition: color 0.15s ease;
}

.tab-nav-btn:hover {
  color: #0f172a;
}

.tab-nav-btn.active {
  color: #2563eb;
  font-weight: 700;
}

.tab-nav-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #2563eb;
  border-radius: 2px;
}

.tab-badge {
  font-size: 11px;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
  padding: 1px 6px;
  border-radius: 99px;
}

.tab-nav-btn.active .tab-badge {
  background: #eff6ff;
  color: #2563eb;
}

.tabs-nav-right {
  display: flex;
  align-items: center;
}

.in-column-search {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 10px;
  width: 200px;
}

.in-column-input {
  border: none;
  background: transparent;
  font-size: 12px;
  color: #0f172a;
  outline: none;
  width: 100%;
}

/* Tab Content Section */
.tab-content-section {
  padding-top: 8px;
}

/* Flat Articles List on White */
.articles-flat-list {
  display: flex;
  flex-direction: column;
}

.article-flat-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;
}

.article-flat-item:hover {
  background: #fcfcfd;
}

.art-main-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.art-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.art-title-text {
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  cursor: pointer;
  line-height: 1.4;
  transition: color 0.15s ease;
}

.art-title-text:hover {
  color: #2563eb;
}

.badge-pinned {
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.badge-trial {
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.badge-collected {
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: #f5f3ff;
  color: #7c3aed;
  border: 1px solid #ddd6fe;
}

.art-summary-text {
  font-size: 13px;
  color: #64748b;
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.collected-reason-box {
  background: #f8fafc;
  border-left: 3px solid #2563eb;
  padding: 6px 12px;
  border-radius: 0 4px 4px 0;
  font-size: 12.5px;
  margin: 2px 0;
}

.reason-tag {
  font-weight: 600;
  color: #334155;
}

.reason-text {
  color: #64748b;
}

.art-footer-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
  flex-wrap: wrap;
}

.footer-author {
  color: #475569;
}

.dot-sep {
  color: #cbd5e1;
}

.art-tags-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 6px;
}

.tag-pill {
  font-size: 11px;
  color: #2563eb;
  background: #eff6ff;
  padding: 1px 6px;
  border-radius: 4px;
}

/* Operations Group */
.art-operations-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  padding-top: 2px;
}

.action-link-btn {
  background: transparent;
  border: none;
  color: #475569;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.action-link-btn:hover {
  color: #2563eb;
  background: #f1f5f9;
}

.action-link-btn.danger {
  color: #94a3b8;
}

.action-link-btn.danger:hover {
  color: #ef4444;
  background: #fef2f2;
}

/* Empty State */
.empty-state-card {
  padding: 56px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
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
}

.modal-close-x {
  background: transparent;
  border: none;
  font-size: 16px;
  color: #94a3b8;
  cursor: pointer;
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

.form-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
}

.cms-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
}

.collect-tip {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.collect-posts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
}

.collect-post-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.collect-post-item:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.collect-post-item.selected {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.collect-post-info {
  flex: 1;
  min-width: 0;
}

.cpi-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.cpi-meta {
  display: flex;
  gap: 6px;
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 4px;
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

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
