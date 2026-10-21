<template>
  <view class="reader-page">
    <!-- 1. 顶部常驻毛玻璃控制栏 (Apple 原生毛玻璃 + 8px 控件) -->
    <view class="reader-top-bar">
      <view class="nav-left" @tap="handleBack">
        <svg class="back-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <text class="back-label">专栏</text>
      </view>

      <view class="nav-center ellipsis-1">
        <text class="nav-title">{{ currentColumn ? currentColumn.title : '专栏长文' }}</text>
      </view>

      <view class="nav-right">
        <!-- 字体大小缩放 (Aa 阶梯式步进) -->
        <view class="font-size-btn" @tap="toggleFontSize">
          <text class="font-label">Aa</text>
          <text class="font-level-text">{{ fontSizeLevel === 1 ? '标准' : (fontSizeLevel === 2 ? '大号' : '特大') }}</text>
        </view>
      </view>
    </view>

    <!-- 2. 长文主阅读区 -->
    <scroll-view 
      class="reader-scroll-viewport" 
      scroll-y="true" 
      :scroll-top="scrollTop"
    >
      <view v-if="currentArticle" class="article-body-wrap">
        <!-- 长文大标题 -->
        <text class="article-headline" :style="{ fontSize: headlineFontSize + 'px' }">
          {{ currentArticle.title }}
        </text>

        <!-- 作者与发布信息卡 (8px Inset 卡片) -->
        <view class="article-meta-card">
          <image :src="currentArticle.authorAvatar || '/static/avatar_rich.png'" class="author-avatar" mode="aspectFill" />
          <view class="author-meta-text">
            <view class="name-role-line">
              <text class="author-name">{{ currentArticle.author }}</text>
              <text class="author-role">{{ currentArticle.authorRoleTitle || '专栏主笔' }}</text>
              <!-- 官方认证金星徽标 -->
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <polygon points="12.0,2.0 14.23,3.69 17.0,3.34 18.08,5.92 20.66,7.0 20.31,9.77 22.0,12.0 20.31,14.23 20.66,17.0 18.08,18.08 17.0,20.66 14.23,20.31 12.0,22.0 9.77,20.31 7.0,20.66 5.92,18.08 3.34,17.0 3.69,14.23 2.0,12.0 3.69,9.77 3.34,7.0 5.92,5.92 7.0,3.34 9.77,3.69" fill="#f59e0b"/>
                <path d="M8 12.2l2.6 2.6 5.4-5.4" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
            <view class="sub-meta-line">
              <text class="meta-time">{{ currentArticle.createdAt }}</text>
              <text class="meta-dot">·</text>
              <text class="meta-stat">{{ currentArticle.wordCount }}字</text>
            </view>
          </view>
        </view>

        <!-- 风险提示横条 (极简矢量警示框，无 emoji) -->
        <view class="risk-warning-box">
          <svg class="risk-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <text class="risk-text">{{ currentArticle.riskWarning || '风险提示：市场有风险，投资需谨慎。本专栏仅供投研参考。' }}</text>
        </view>

        <!-- 核心导读提要框 -->
        <view v-if="currentArticle.summary" class="article-summary-box">
          <view class="summary-header">
            <text class="summary-lead">核心提要</text>
          </view>
          <text class="summary-text">{{ currentArticle.summary }}</text>
        </view>

        <!-- 正文渲染区 -->
        <view 
          class="article-content-markdown" 
          :style="{ fontSize: bodyFontSize + 'px' }"
        >
          <!-- 会员全文 或 免费试读展示 -->
          <view v-if="shouldShowFullContent">
            <text class="markdown-p">{{ currentArticle.content }}</text>
          </view>

          <!-- 星友未解锁时的截断试读 + Apple 风格书卷付费墙 -->
          <view v-else class="paywall-truncated-wrap">
            <text class="markdown-p">{{ truncatedContent }}</text>

            <!-- 渐变淡出遮罩 -->
            <view class="gradient-fade-mask"></view>

            <!-- Apple 风格书卷付费卡片 (白底微金边，无阴影，去原型黑卡) -->
            <view class="editorial-paywall-card">
              <!-- 微雕锁图标 (SVG) -->
              <view class="paywall-lock-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </view>

              <text class="paywall-title">本文余下内容为会员专享</text>
              <text class="paywall-desc">
                开通「年度星球会员」，畅读本专栏全部连载与深度投研长文
              </text>

              <!-- 主行动按钮：翡翠绿 (全站品牌一致 CTA) -->
              <button class="btn-unlock-emerald" @tap="handleOpenVipModal">
                开通会员解锁全文 · ¥1,299 / 年
              </button>

              <view class="paywall-benefits-row">
                <view class="benefit-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <text class="benefit-text">专栏长文全文</text>
                </view>
                <view class="benefit-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <text class="benefit-text">动态讨论特权</text>
                </view>
                <view class="benefit-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <text class="benefit-text">向星主提问</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 点赞与互动操作条 (对齐 PC 专栏规范) -->
        <view class="social-interactive-wrap">
          <view class="interactive-btn-group">
            <view 
              class="interactive-btn like-btn" 
              :class="{ 'is-active': currentArticle && currentArticle.isLiked }"
              @tap="handleToggleLike"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                :fill="currentArticle && currentArticle.isLiked ? '#d97706' : 'none'" 
                :stroke="currentArticle && currentArticle.isLiked ? '#d97706' : '#64748b'" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
              <text class="interactive-txt">{{ currentArticle && currentArticle.isLiked ? '已赞' : '点赞' }} ({{ articleLikes }})</text>
            </view>

            <view class="interactive-btn" @tap="handleShare">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <text class="interactive-txt">分享</text>
            </view>
          </view>

          <!-- 点赞人头像与文字条 (对齐 PC & feed/detail) -->
          <view v-if="articleLikers.length > 0" class="social-feedback-bar">
            <view class="feedback-left">
              <svg class="feedback-heart-icon" width="14" height="14" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" stroke-width="1.5">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
              </svg>
              <text class="feedback-count">{{ likersSummaryText }}</text>
            </view>
          </view>
        </view>

        <!-- 评论楼层区 (对齐 PC 专栏：输入框常驻底部，评论列表默认展示) -->
        <view class="comments-thread-card">
          <view class="thread-header">
            <text class="thread-title">全部评论</text>
            <text class="thread-count">共 {{ articleComments.length }} 条</text>
          </view>

          <view v-if="rootComments.length > 0" class="comments-list">
            <view v-for="c in rootComments" :key="c.id" class="comment-row-item">
              <image :src="c.author.avatar || '/static/avatar_john.png'" class="comment-author-avatar" mode="aspectFill" />
              <view class="comment-main-body">
                <view class="comment-head-line">
                  <text class="c-name">{{ c.author.name }}</text>
                  <text class="c-time">{{ c.createdAt }}</text>
                </view>
                <text class="c-content-body">{{ c.content }}</text>
                <view class="comment-action-row">
                  <text class="comment-reply-btn" @tap="handleStartReply(c, c.author.name)">回复</text>
                </view>

                <!-- 楼中楼：子回复列表 -->
                <view v-if="c.replies && c.replies.length" class="reply-list">
                  <view v-for="r in c.replies" :key="r.id" class="reply-item">
                    <image :src="r.author.avatar || '/static/avatar_john.png'" class="reply-avatar" mode="aspectFill" />
                    <view class="reply-body">
                      <view class="comment-head-line">
                        <text class="reply-name">{{ r.author.name }}</text>
                        <text class="c-time">{{ r.createdAt }}</text>
                      </view>
                      <text class="reply-content">
                        <text v-if="r.replyToName" class="reply-mention">回复 @{{ r.replyToName }}：</text>{{ r.content }}
                      </text>
                      <view v-if="r.images && r.images.length" class="reply-images-row">
                        <image
                          v-for="(img, i) in r.images"
                          :key="i"
                          :src="img"
                          class="reply-img-thumb"
                          mode="aspectFill"
                          @tap="previewReplyImage(r.images, i)"
                        />
                      </view>
                      <view class="comment-action-row">
                        <text class="comment-reply-btn" @tap="handleStartReply(c, r.author.name)">回复</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view v-else class="empty-thread-state">
            <text class="empty-hint">暂无讨论，发表你的第一条深度评论吧</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 3. 底部固定评论输入操作条 -->
    <view class="detail-bottom-fixed-bar safe-bottom">
      <view v-if="isVipOrAbove" class="reply-input-form">
        <input
          v-model="commentInput"
          class="reply-text-input"
          placeholder="发表你的评论"
          @confirm="handleSubmitComment"
        />
        <button
          class="btn-send-reply"
          :disabled="!commentInput.trim()"
          @tap="handleSubmitComment"
        >
          发送
        </button>
      </view>

      <view v-else class="vip-locked-bar" @tap="handleOpenVipModal">
        <view class="vlb-left">
          <text class="vlb-crown">👑</text>
          <text class="vlb-lead">开通会员解锁评论与提问交流特权</text>
        </view>
        <view class="btn-vlb-action">
          <text class="vlb-btn-text">立即开通</text>
          <text class="vlb-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 3.5 回复评论底部抽屉（参考截图：回复对象 + 大输入区 + 图片/表情工具栏） -->
    <view v-if="replyDrawerVisible" class="reply-drawer-backdrop" @tap="closeReplyDrawer">
      <view class="reply-drawer" @tap.stop>
        <view class="reply-drawer-target">回复 {{ replyTarget ? replyTarget.name : '' }}</view>

        <textarea
          v-model="replyText"
          class="reply-drawer-textarea"
          :focus="replyDrawerVisible"
          :maxlength="1000"
          placeholder="点赞太容易，评论显真情"
          auto-height
        />

        <!-- 已选图片预览 -->
        <view v-if="replyImages.length" class="reply-images-row">
          <view v-for="(img, i) in replyImages" :key="i" class="reply-image-box">
            <image :src="img" class="reply-image-thumb" mode="aspectFill" />
            <view class="reply-image-del" @tap="removeReplyImage(i)">×</view>
          </view>
        </view>

        <!-- 表情面板 -->
        <view v-if="isEmojiPanelVisible" class="emoji-panel">
          <text v-for="e in emojiList" :key="e" class="emoji-cell" @tap="appendEmoji(e)">{{ e }}</text>
        </view>

        <!-- 底部工具栏：仅支持图片和表情 -->
        <view class="reply-drawer-toolbar">
          <view class="toolbar-left">
            <view class="toolbar-icon-btn" @tap="chooseReplyImage">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
            </view>
            <view class="toolbar-icon-btn" @tap="isEmojiPanelVisible = !isEmojiPanelVisible">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </view>
          </view>
          <view class="toolbar-right">
            <text class="char-count">({{ replyText.length }}/1000)</text>
            <button class="btn-publish-reply" :disabled="!canPublishReply" @tap="publishReply">发布</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 4. 章节目录底部弹出抽屉 (Bottom Sheet) -->
    <view v-if="isDrawerOpen" class="drawer-backdrop" @tap.self="isDrawerOpen = false">
      <view class="drawer-sheet animate-slide-up" @tap.stop>
        <!-- 顶部拖拽条把手 -->
        <view class="drawer-drag-pill"></view>

        <view class="drawer-header">
          <view class="drawer-title-block">
            <text class="drawer-title">{{ currentColumn ? currentColumn.title : '专栏目录' }}</text>
            <text class="drawer-sub">全专栏共 {{ totalChaptersCount }} 篇长文</text>
          </view>
          <view class="drawer-close-btn" @tap="isDrawerOpen = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>

        <scroll-view class="drawer-scroll-list" scroll-y="true">
          <view 
            v-for="(chapter, idx) in columnChapters" 
            :key="chapter.id" 
            class="drawer-item"
            :class="{ active: currentArticle && currentArticle.id === chapter.id }"
            @tap="switchChapter(chapter.id)"
          >
            <!-- 状态圆点：在读翡翠绿 / 默认中性 -->
            <view class="item-status-dot">
              <view v-if="currentArticle && currentArticle.id === chapter.id" class="drawer-dot-active"></view>
              <view v-else class="drawer-dot-idle"></view>
            </view>

            <view class="item-text-wrap">
              <view class="item-title-row">
                <text class="item-title ellipsis-1">{{ idx + 1 }}. {{ chapter.title }}</text>
                <text v-if="!chapter.isFreeTrial" class="badge-vip">会员</text>
              </view>
              <text class="item-meta">{{ chapter.duration }} · {{ chapter.wordCount }}字</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 会员开通弹窗 -->
    <VipJoinModal />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appState, actions, isVipOrAbove } from '../../store/community.js';
import VipJoinModal from '../../components/VipJoinModal.vue';

const colId = ref('col-us-stock');
const articleId = ref('art-mg-1');
const isDrawerOpen = ref(false);
const fontSizeLevel = ref(1); // 1: 标准, 2: 大号, 3: 超大
const scrollTop = ref(0);
const commentInput = ref('');
const replyTarget = ref(null); // { parentId, name }
const replyDrawerVisible = ref(false);
const replyText = ref('');
const replyImages = ref([]);
const isEmojiPanelVisible = ref(false);
const emojiList = ['😀', '😁', '😂', '🤣', '😊', '😍', '🤔', '😎', '😭', '😅', '👍', '👏', '🙏', '💪', '🙌', '🔥', '💯', '🎉', '🚀', '💰', '📈', '📉', '🧠', '⚡'];

onLoad((options) => {
  if (options && options.id) {
    articleId.value = options.id;
  }
  if (options && options.colId) {
    colId.value = options.colId;
  }
  appState.selectedColumnId = colId.value;
  appState.selectedArticleId = articleId.value;
  actions.markArticleRead(articleId.value);
});

// 当前专栏
const currentColumn = computed(() => {
  return appState.columns.find(c => c.id === colId.value) || appState.columns[0];
});

// 当前专栏全部章节
const columnChapters = computed(() => {
  return currentColumn.value ? currentColumn.value.chapters : [];
});

const totalChaptersCount = computed(() => {
  return columnChapters.value.length;
});

// 当前章节
const currentArticle = computed(() => {
  if (!currentColumn.value) return null;
  return currentColumn.value.chapters.find(c => c.id === articleId.value) || currentColumn.value.chapters[0];
});

// 当前章节下标
const currentChapterIndex = computed(() => {
  if (!currentArticle.value) return 0;
  return columnChapters.value.findIndex(c => c.id === currentArticle.value.id);
});

const hasPrevChapter = computed(() => {
  return currentChapterIndex.value > 0;
});

const hasNextChapter = computed(() => {
  return currentChapterIndex.value < columnChapters.value.length - 1;
});

const prevChapterTitle = computed(() => {
  if (!hasPrevChapter.value) return '';
  return columnChapters.value[currentChapterIndex.value - 1]?.title || '';
});

const nextChapterTitle = computed(() => {
  if (!hasNextChapter.value) return '';
  return columnChapters.value[currentChapterIndex.value + 1]?.title || '';
});

// 是否展示全文：会员及以上身份，或者本章节支持免费试读
const shouldShowFullContent = computed(() => {
  if (isVipOrAbove.value) return true;
  return currentArticle.value ? currentArticle.value.isFreeTrial : false;
});

// 截断试读内容
const truncatedContent = computed(() => {
  if (!currentArticle.value || !currentArticle.value.content) return '';
  return currentArticle.value.content.slice(0, 320) + '……';
});

// 动态字号计算
const headlineFontSize = computed(() => {
  if (fontSizeLevel.value === 1) return 21;
  if (fontSizeLevel.value === 2) return 23;
  return 25;
});

const bodyFontSize = computed(() => {
  if (fontSizeLevel.value === 1) return 16;
  if (fontSizeLevel.value === 2) return 18;
  return 20;
});

const toggleFontSize = () => {
  fontSizeLevel.value = fontSizeLevel.value >= 3 ? 1 : fontSizeLevel.value + 1;
};

const handleBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/column/index' });
    }
  });
};

const handleOpenVipModal = () => {
  appState.isVipModalVisible = true;
};

const switchChapter = (id) => {
  articleId.value = id;
  appState.selectedArticleId = id;
  actions.markArticleRead(id);
  isDrawerOpen.value = false;
  scrollTop.value = 0;
};

const handlePrevChapter = () => {
  if (!hasPrevChapter.value) return;
  const prev = columnChapters.value[currentChapterIndex.value - 1];
  if (prev) switchChapter(prev.id);
};

const handleNextChapter = () => {
  if (!hasNextChapter.value) return;
  const next = columnChapters.value[currentChapterIndex.value + 1];
  if (next) switchChapter(next.id);
};

const articleLikes = computed(() => {
  return currentArticle.value ? (currentArticle.value.likes ?? 42) : 0;
});

const articleLikers = computed(() => {
  return (currentArticle.value && currentArticle.value.likers) || ['Rich', '远山求道', 'Mark', 'Jerry'];
});

const likersSummaryText = computed(() => {
  const likers = articleLikers.value;
  if (!likers || likers.length === 0) return '暂无点赞';
  return `${likers.join('、')} 等 ${articleLikes.value}人觉得很赞`;
});

const articleComments = computed(() => {
  if (!currentArticle.value) return [];
  if (!currentArticle.value.comments) {
    currentArticle.value.comments = [
      {
        id: 'c-default-1',
        author: { name: '远山求道', avatar: '/static/avatar_john.png', role: 'vip' },
        content: '实盘量化信号穿透非常清晰，对宏观调仓很有启发！',
        createdAt: '昨天 15:30',
        likes: 6
      },
      {
        id: 'c-default-2',
        author: { name: 'Jerry', avatar: '/static/avatar_jerry.png', role: 'guest' },
        content: '请教星主，在宏观流动性阶段性收紧时，如何把握买入窗口？',
        createdAt: '前天 18:20',
        likes: 3
      }
    ];
  }
  return currentArticle.value.comments;
});

const rootComments = computed(() => {
  return articleComments.value.filter(c => !c.parentId);
});

const handleSubmitComment = () => {
  if (!commentInput.value.trim()) return;
  if (!currentArticle.value) return;
  const success = actions.addArticleComment(currentArticle.value.id, commentInput.value);
  if (success) {
    commentInput.value = '';
  }
};

const handleStartReply = (parentComment, name) => {
  replyTarget.value = { parentId: parentComment.id, name };
  replyText.value = '';
  replyImages.value = [];
  isEmojiPanelVisible.value = false;
  replyDrawerVisible.value = true;
};

const closeReplyDrawer = () => {
  replyDrawerVisible.value = false;
  replyTarget.value = null;
  replyText.value = '';
  replyImages.value = [];
  isEmojiPanelVisible.value = false;
};

const canPublishReply = computed(() => {
  return !!(replyText.value.trim() || replyImages.value.length);
});

const publishReply = () => {
  if (!canPublishReply.value || !currentArticle.value || !replyTarget.value) return;
  const success = actions.addArticleComment(
    currentArticle.value.id,
    replyText.value || '[图片]',
    replyTarget.value,
    replyImages.value
  );
  if (success) {
    closeReplyDrawer();
  }
};

const chooseReplyImage = () => {
  uni.chooseImage({
    count: 3,
    success: (res) => {
      replyImages.value = replyImages.value.concat(res.tempFilePaths || []);
    }
  });
};

const removeReplyImage = (index) => {
  replyImages.value.splice(index, 1);
};

const appendEmoji = (emoji) => {
  replyText.value += emoji;
};

const previewReplyImage = (images, index) => {
  uni.previewImage({ urls: images, current: index });
};

const handleToggleLike = () => {
  if (currentArticle.value) {
    actions.toggleLikeArticle(currentArticle.value.id);
  }
};

const handleShare = () => {
  uni.showToast({ title: '长文链接已成功复制', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.reader-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

/* 1. 顶部操作控制栏 (Apple 原生毛玻璃吸顶) */
.reader-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(10px + constant(safe-area-inset-top)) 16px 10px 16px;
  padding: calc(10px + env(safe-area-inset-top)) 16px 10px 16px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.045);
  flex-shrink: 0;
  z-index: 30;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 6px 4px 0;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.7;
  }
}

.back-svg {
  flex-shrink: 0;
}

.back-label {
  font-size: 14px;
  color: #1c1c1e;
  font-weight: 500;
}

.nav-center {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.nav-title {
  font-size: 14px;
  font-weight: 600;
  color: #1c1c1e;
  letter-spacing: -0.15px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.font-size-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  background: #f2f2f7;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:active {
    background: #e5e5ea;
  }
}

.font-label {
  font-size: 12px;
  font-weight: 700;
  color: #1c1c1e;
}

.font-level-text {
  font-size: 10.5px;
  color: #8e8e93;
}

.drawer-trigger-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.08);
  border: 0.5px solid rgba(16, 185, 129, 0.2);
  padding: 4px 9px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:active {
    transform: scale(0.95);
  }
}

.drawer-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #047857;
}

/* 2. 长文主滚动区 */
.reader-scroll-viewport {
  flex: 1;
  overflow-y: auto;
  padding: 20px 18px calc(80px + constant(safe-area-inset-bottom)) 18px;
  padding: 20px 18px calc(80px + env(safe-area-inset-bottom)) 18px;
  box-sizing: border-box;
}

.article-body-wrap {
  max-width: 100%;
}

.article-headline {
  font-weight: 800;
  color: #1c1c1e;
  line-height: 1.4;
  margin-bottom: 14px;
  display: block;
  letter-spacing: -0.3px;
}

/* 作者与发布信息 */
.article-meta-card {
  display: flex;
  align-items: center;
  gap: 11px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 14px;
  border: 0.5px solid rgba(0, 0, 0, 0.045);
}

.author-avatar {
  width: 38px;
  height: 38px;
  border-radius: 19px;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.author-meta-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.name-role-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-size: 14px;
  font-weight: 700;
  color: #1c1c1e;
}

.author-role {
  font-size: 10px;
  font-weight: 600;
  color: #b45309;
  background: rgba(245, 158, 11, 0.08);
  border: 0.5px solid rgba(245, 158, 11, 0.2);
  padding: 1px 5px;
  border-radius: 4px;
  line-height: 1.2;
}

.sub-meta-line {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-time, .meta-stat {
  font-size: 11px;
  color: #8e8e93;
}

.meta-dot {
  color: #cbd5e1;
  font-size: 10px;
}

/* 风险提示 */
.risk-warning-box {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  background: rgba(245, 158, 11, 0.06);
  border: 0.5px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  padding: 9px 11px;
  margin-bottom: 16px;
}

.risk-icon-svg {
  flex-shrink: 0;
  margin-top: 1.5px;
}

.risk-text {
  font-size: 11.5px;
  color: #b45309;
  line-height: 1.45;
  flex: 1;
}

/* 核心摘要 */
.article-summary-box {
  background: #fafafc;
  border: 0.5px solid rgba(217, 119, 6, 0.2);
  padding: 12px 14px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.summary-header {
  margin-bottom: 6px;
}

.summary-lead {
  font-size: 11.5px;
  font-weight: 700;
  color: #b45309;
  background: rgba(245, 158, 11, 0.08);
  padding: 2px 7px;
  border-radius: 4px;
  border: 0.5px solid rgba(245, 158, 11, 0.2);
  display: inline-block;
}

.summary-text {
  font-size: 13px;
  color: #475569;
  line-height: 1.65;
}

/* 正文渲染 */
.article-content-markdown {
  line-height: 1.8;
  color: #1c1c1e;
  letter-spacing: -0.1px;
}

.markdown-p {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.85;
}

/* 试读截断与 Apple 风格书卷付费墙 */
.paywall-truncated-wrap {
  position: relative;
}

.gradient-fade-mask {
  height: 90px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, #ffffff 100%);
  margin-top: -60px;
  position: relative;
  z-index: 5;
}

.editorial-paywall-card {
  background: #ffffff;
  border: 0.5px solid rgba(217, 119, 6, 0.25);
  border-radius: 8px;
  padding: 24px 18px 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: none !important;
  margin-top: 10px;
  position: relative;
  z-index: 10;
}

.paywall-lock-wrap {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: rgba(245, 158, 11, 0.08);
  border: 0.5px solid rgba(245, 158, 11, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.paywall-title {
  font-size: 16.5px;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 6px;
  letter-spacing: -0.2px;
}

.paywall-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 18px;
  padding: 0 10px;
}

.btn-unlock-emerald {
  width: 100%;
  background: #10b981;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  box-shadow: none !important;
  margin-bottom: 14px;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
}

.paywall-benefits-row {
  display: flex;
  gap: 14px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.benefit-text {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

/* 点赞与社交互动区 (参考 PC 端专栏) */
.social-interactive-wrap {
  margin: 10px 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.interactive-btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.interactive-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  background: #f1f5f9;
  border: 0.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s ease;

  &:active {
    transform: scale(0.96);
  }

  &.like-btn.is-active {
    background: #fef3c7;
    border-color: rgba(217, 119, 6, 0.3);

    .interactive-txt {
      color: #d97706;
      font-weight: 700;
    }
  }
}

.interactive-txt {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

/* 点赞人头像与文字条 */
.social-feedback-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid #edf2f7;
  gap: 8px;
}

.feedback-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.feedback-heart-icon {
  flex-shrink: 0;
}

.feedback-count {
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
  line-height: 1.4;
  word-break: break-word;
}

/* 评论讨论楼层 (参考资讯详情页) */
.comments-thread-card {
  background: #ffffff;
  padding: 16px 0 10px 0;
  box-shadow: none !important;
}

.thread-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.thread-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.thread-count {
  font-size: 12px;
  color: #94a3b8;
}

.comments-list {
  display: flex;
  flex-direction: column;
}

.comment-row-item {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f8fafc;

  &:last-child {
    border-bottom: none;
  }
}

.comment-author-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-main-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.comment-head-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.c-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.c-time {
  font-size: 11px;
  color: #94a3b8;
}

/* 回复按钮行与楼中楼 */
.comment-action-row {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.comment-reply-btn {
  font-size: 12px;
  color: #94a3b8;
  padding: 2px 0;
}

.reply-list {
  margin-top: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply-item {
  display: flex;
  gap: 8px;
}

.reply-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.reply-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reply-name {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.reply-content {
  font-size: 12.5px;
  color: #334155;
  line-height: 1.5;
}

.reply-mention {
  color: #2563eb;
}

.c-content-body {
  font-size: 13.5px;
  color: #334155;
  line-height: 1.5;
}

.empty-thread-state {
  padding: 30px 0;
  text-align: center;
}

.empty-hint {
  font-size: 12.5px;
  color: #94a3b8;
}

/* 3. 底部吸底操作条 (参考资讯详情页) */
.detail-bottom-fixed-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #edf2f7;
  padding: 8px 14px;
  padding-bottom: calc(10px + constant(safe-area-inset-bottom));
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  z-index: 50;
  box-shadow: none !important;
  box-sizing: border-box;
}

.reply-input-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reply-text-input {
  flex: 1;
  height: 38px;
  background: #f1f5f9;
  border-radius: 19px;
  padding: 0 14px;
  font-size: 13px;
  color: #0f172a;
}

.btn-send-reply {
  background: linear-gradient(135deg, #dfb76c 0%, #c59b27 100%);
  color: #121214;
  font-size: 12.5px;
  font-weight: 800;
  padding: 0 16px;
  height: 38px;
  line-height: 38px;
  border-radius: 19px;
  border: none;

  &[disabled] { opacity: 0.5; }
}

/* ===== 回复评论底部抽屉（参考截图） ===== */
.reply-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.reply-drawer {
  width: 100%;
  background: #ffffff;
  border-radius: 8px 8px 0 0;
  padding: 14px 20px;
  padding-bottom: calc(14px + constant(safe-area-inset-bottom));
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.reply-drawer-target {
  font-size: 12px;
  color: #94a3b8;
  margin: 8px 0 10px;
}

.reply-drawer-textarea {
  width: 100%;
  min-height: 96px;
  font-size: 15px;
  line-height: 1.6;
  color: #0f172a;
  box-sizing: border-box;
}

/* 图片预览（抽屉内已选图 + 楼中楼展示图共用行样式） */
.reply-images-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
}

.reply-image-box {
  position: relative;
  width: 56px;
  height: 56px;
}

.reply-image-thumb {
  width: 56px;
  height: 56px;
  border-radius: 8px;
}

.reply-image-del {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.7);
  color: #ffffff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

.reply-img-thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
}

/* 表情面板 */
.emoji-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
}

.emoji-cell {
  width: calc(100% / 8 - 6px);
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

/* 抽屉底部工具栏：仅支持图片和表情 */
.reply-drawer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 22px;
}

.toolbar-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.char-count {
  font-size: 11px;
  color: #94a3b8;
}

.btn-publish-reply {
  background: #10b981;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  border: none;

  &[disabled] { opacity: 0.4; }
}

.vip-locked-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 10px;
  padding: 10px 14px;
}

.vlb-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vlb-crown {
  font-size: 16px;
}

.vlb-lead {
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
}

.btn-vlb-action {
  display: flex;
  align-items: center;
  gap: 2px;
}

.vlb-btn-text {
  font-size: 12px;
  font-weight: 800;
  color: #f59e0b;
}

.vlb-arrow {
  font-size: 14px;
  font-weight: 900;
  color: #f59e0b;
}

/* 4. 章节目录底部弹出抽屉 (Bottom Sheet) */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.drawer-sheet {
  width: 100%;
  max-height: 72vh;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  padding-bottom: calc(12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.drawer-drag-pill {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background-color: #cbd5e1;
  margin: 10px auto 2px auto;
  flex-shrink: 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px 14px 18px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.08);
  flex-shrink: 0;
}

.drawer-title-block {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.drawer-title {
  font-size: 16px;
  font-weight: 700;
  color: #1c1c1e;
  line-height: 1.3;
}

.drawer-sub {
  font-size: 11.5px;
  color: #8e8e93;
}

.drawer-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f1f5f9;
  cursor: pointer;
  flex-shrink: 0;
}

.drawer-scroll-list {
  flex: 1;
  max-height: calc(72vh - 90px);
  overflow-y: auto;
  padding: 4px 0;
}

.drawer-item {
  display: flex;
  align-items: center;
  padding: 13px 18px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.05);
  cursor: pointer;
  transition: background 0.15s ease;

  &.active {
    background-color: rgba(16, 185, 129, 0.06);
    border-left: 3px solid #10b981;

    .item-title {
      color: #047857;
      font-weight: 700;
    }
  }

  &:active {
    background-color: #f8fafc;
  }
}

.item-status-dot {
  width: 14px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.drawer-dot-active {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
}

.drawer-dot-idle {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
}

.item-text-wrap {
  flex: 1;
  min-width: 0;
}

.item-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.item-title {
  font-size: 13.5px;
  color: #1c1c1e;
  flex: 1;
}

.badge-vip {
  font-size: 10px;
  font-weight: 600;
  color: #f59e0b;
  background: #1c1c1e;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
  line-height: 1.2;
}

.item-meta {
  font-size: 11px;
  color: #8e8e93;
  margin-top: 3px;
}

.animate-slide-up {
  animation: slideUp 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
