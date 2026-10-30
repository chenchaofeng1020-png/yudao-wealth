<template>
  <view class="feed-page-root">
    <!-- 0. 顶部固定吸顶导航栏 (Apple 原生 Large Title -> Inline Title 压缩固定) -->
    <view class="pinned-top-nav-bar" :class="{ 'is-scrolled': isScrolled }">
      <view class="top-nav-safe-inset"></view>
      <view class="top-nav-content-row">
        <!-- 靠左对齐收缩标题：财不外露 + 官方认证金标 (用户指定靠左对齐规范) -->
        <view class="top-nav-left-group" :style="pinnedTitleStyle" @tap="handleScrollToTop">
          <text class="pinned-brand-title">财不外露</text>
          <!-- 官方认证金星徽章微型版 -->
          <svg class="pinned-starburst-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="12.0,2.0 14.23,3.69 17.0,3.34 18.08,5.92 20.66,7.0 20.31,9.77 22.0,12.0 20.31,14.23 20.66,17.0 18.08,18.08 17.0,20.66 14.23,20.31 12.0,22.0 9.77,20.31 7.0,20.66 5.92,18.08 3.34,17.0 3.69,14.23 2.0,12.0 3.69,9.77 3.34,7.0 5.92,5.92 7.0,3.34 9.77,3.69" fill="#f59e0b"/>
            <path d="M8 12.2l2.6 2.6 5.4-5.4" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>

        <view class="top-nav-right-slot">
          <view class="top-nav-search-btn" :style="pinnedSearchStyle" @tap="handleSearchClick">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </view>
        </view>
      </view>
    </view>

    <!-- 1. 顶部深海蓝黑沉浸头图 (微星轨发丝暗纹、真实专家头像组、黑金微质感) -->
    <view class="hero-header-section">
      <!-- 精密天体星轨微质感发丝暗纹 (替代粗暴的175px大字水印) -->
      <view class="hero-orbital-backdrop">
        <svg class="orbital-svg" viewBox="0 0 390 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="280" cy="50" rx="190" ry="85" stroke="rgba(255,255,255,0.04)" stroke-width="1.2" stroke-dasharray="4 6"/>
          <ellipse cx="280" cy="50" rx="140" ry="60" stroke="rgba(217,119,6,0.06)" stroke-width="1"/>
          <circle cx="340" cy="22" r="2" fill="rgba(245,158,11,0.3)"/>
        </svg>
      </view>

      <!-- 第一行：品牌、Logo、搜索与消息 -->
      <view class="brand-header-row">
        <view class="brand-left-group" @tap="handlePlanetInfo">
          <!-- 官方品牌 Logo (财不外露 Fortune in Reserve) -->
          <view class="brand-logo-box">
            <image src="/static/brand_logo.jpg" class="brand-logo-img" mode="aspectFill" />
          </view>

          <!-- 品牌标题与副标 -->
          <view class="brand-text-col" :style="heroBrandColStyle">
            <view class="title-verified-wrap">
              <text class="brand-name-text">财不外露</text>
              <!-- 官方认证金星徽章 (Apple 风格 12 角高精微标) -->
              <svg class="verified-starburst-svg" width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="12.0,2.0 14.23,3.69 17.0,3.34 18.08,5.92 20.66,7.0 20.31,9.77 22.0,12.0 20.31,14.23 20.66,17.0 18.08,18.08 17.0,20.66 14.23,20.31 12.0,22.0 9.77,20.31 7.0,20.66 5.92,18.08 3.34,17.0 3.69,14.23 2.0,12.0 3.69,9.77 3.34,7.0 5.92,5.92 7.0,3.34 9.77,3.69" fill="#f59e0b"/>
                <path d="M8 12.2l2.6 2.6 5.4-5.4" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
            <text class="brand-slogan-text">财富成长星球</text>
          </view>
        </view>

        <!-- 右侧毛玻璃圆形搜索按键 -->
        <view class="header-actions-group" :style="{ opacity: (1 - Math.min(1, Math.max(0, (scrollTop - 10) / 35))).toFixed(2) }">
          <view class="btn-glass-icon" @tap="handleSearchClick">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </view>
        </view>
      </view>

      <!-- 第二行：成员叠层 + 立即加入金钮 -->
      <view class="members-join-row">
        <!-- 左侧成员叠层 (真实头像替换生硬字母圆圈，去除原型味) -->
        <view class="members-info-left" @tap="actions.openMembersModal">
          <view class="avatar-stack-bubbles">
            <image src="/static/avatar_mark.png" class="stack-avatar-item" mode="aspectFill" />
            <image src="/static/avatar_rich.png" class="stack-avatar-item" mode="aspectFill" />
            <image src="/static/avatar_john.png" class="stack-avatar-item" mode="aspectFill" />
            <view class="stack-avatar-item stack-more-badge"><view class="stack-more-dot"></view><view class="stack-more-dot"></view><view class="stack-more-dot"></view></view>
          </view>
          <text class="members-joined-label">12,840 位星友</text>
        </view>

        <!-- 右侧身份特权/加入金钮 (香槟浅金微光质感) -->
        <view class="btn-golden-join" @tap="handleHeroAction">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#271700" class="crown-icon-svg">
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z"/>
          </svg>
          <text class="join-label">{{ heroJoinLabel }}</text>
        </view>
      </view>
    </view>

    <!-- 身份特权卡弹窗（星主/合伙人/嘉宾） -->
    <RolePrivilegeModal
      :visible="rolePrivilegeVisible"
      :role="appState.user.role"
      @close="rolePrivilegeVisible = false"
    />

    <!-- 2. 胶囊式分类 Tabs 栏 (单行整齐排列 + 触控反馈 + 筛选菜单钮) -->
    <view class="category-capsules-bar">
      <view class="capsules-scroll-wrapper">
        <scroll-view class="capsules-scroll-view" :scroll-x="true" :show-scrollbar="false">
          <view class="capsules-flex-wrap">
            <view 
              v-for="tab in categoryTabs" 
              :key="tab.key"
              class="capsule-item"
              :class="{ active: appState.activeFeedFilter === tab.key }"
              @tap="actions.setFeedFilter(tab.key)"
            >
              <text class="capsule-text">{{ tab.label }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="capsules-fade-mask"></view>
      </view>

      <!-- 最右侧三道杠菜单筛选按钮 -->
      <view class="btn-menu-filter" @tap="handleFilterMenuClick">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </view>
    </view>

    <!-- 3. 白底置顶条 (tab 菜单下方，极简 Apple Inset Grouped 规范) -->
    <view class="floating-pinned-card">
      <view 
        v-for="item in pinnedNoticesList" 
        :key="item.id"
        class="pinned-notice-item"
        @tap="handlePinnedItemClick(item)"
      >
        <view class="pinned-tag-badge">
          <text class="pinned-tag-text">置顶</text>
        </view>
        <text class="pinned-content-text ellipsis-1">{{ item.content }}</text>
        <svg class="pinned-arrow-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </view>
    </view>

    <!-- 4. 帖子信息流列表 (无阴影扁平卡片) -->
    <view class="feed-posts-stream">
      <PostCard 
        v-for="post in displayedPosts" 
        :key="post.id" 
        :post="post" 
      />

      <!-- 空状态 -->
      <view v-if="displayedPosts.length === 0" class="empty-feed-card">
        <text class="empty-icon-text">📭</text>
        <text class="empty-main-hint">当前分类下暂无动态</text>
        <text class="empty-sub-hint">尝试切换其他分类或分享你的第一篇投资思考！</text>
        <button class="btn-empty-reset" @tap="actions.setFeedFilter('latest')">
          返回全部动态
        </button>
      </view>
    </view>

    <!-- 5. 右下角发表悬浮按钮 (FAB - 自动规避 TabBar 遮挡) -->
    <view class="fab-publish-btn" @tap="handleFabPublish">
      <svg class="fab-pen-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    </view>

    <!-- 筛选底部抽屉 -->
    <view v-if="filterSheetVisible" class="publish-drawer-mask" @tap="filterSheetVisible = false">
      <view class="publish-drawer-panel" @tap.stop>
        <view class="publish-drawer-handle"></view>
        <view class="publish-drawer-title">选择分类</view>
        <view
          v-for="tab in categoryTabs"
          :key="tab.key"
          class="filter-drawer-item"
          @tap="handleFilterSelect(tab.key)"
        >
          <text class="filter-drawer-label">{{ tab.label }}</text>
          <svg v-if="appState.activeFeedFilter === tab.key" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </view>
        <view class="publish-drawer-cancel" @tap="filterSheetVisible = false">取消</view>
      </view>
    </view>

    <!-- 星友名录与向TA提问抽屉 -->
    <CommunityMembersModal />

    <!-- VIP 开通/续费半屏抽屉 -->
    <VipJoinModal />

    <!-- 动态发布/向嘉宾提问弹窗 -->
    <PublishModal />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onPullDownRefresh, onPageScroll } from '@dcloudio/uni-app';
import { appState, actions, filteredPosts, isVipOrAbove } from '../../store/community.js';
import PostCard from '../../components/PostCard.vue';
import CommunityMembersModal from '../../components/CommunityMembersModal.vue';
import VipJoinModal from '../../components/VipJoinModal.vue';
import PublishModal from '../../components/PublishModal.vue';
import RolePrivilegeModal from '../../components/RolePrivilegeModal.vue';

// 页面滚动位置监听 (Apple 原生 Large Title 收缩机制)
const scrollTop = ref(0);
const isScrolled = computed(() => scrollTop.value > 25);

onPageScroll((e) => {
  scrollTop.value = Math.max(0, e.scrollTop || 0);
});

// 首屏大标题随滚动渐隐微缩小
const heroBrandColStyle = computed(() => {
  const p = Math.min(1, Math.max(0, (scrollTop.value - 10) / 45));
  return {
    opacity: (1 - p * 0.85).toFixed(2),
    transform: `scale(${(1 - p * 0.08).toFixed(3)})`,
    transformOrigin: 'left center'
  };
});

// 顶部固定小标题平滑浮现与升起 (靠左对齐，transformOrigin 靠左)
const pinnedTitleStyle = computed(() => {
  const p = Math.min(1, Math.max(0, (scrollTop.value - 20) / 45));
  return {
    opacity: p.toFixed(2),
    transform: `translateY(${(1 - p) * 6}px) scale(${(0.95 + p * 0.05).toFixed(3)})`,
    transformOrigin: 'left center',
    pointerEvents: p > 0.6 ? 'auto' : 'none'
  };
});

// 顶部导航栏右侧搜索微按钮浮现
const pinnedSearchStyle = computed(() => {
  const p = Math.min(1, Math.max(0, (scrollTop.value - 25) / 38));
  return {
    opacity: p.toFixed(2),
    pointerEvents: p > 0.6 ? 'auto' : 'none'
  };
});

// 点击顶部居中小标题平滑回到顶部 (iOS 原生 HIG 规范交互)
const handleScrollToTop = () => {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 280
  });
};

// 胶囊分类列表（完全对齐参考图：全部、交易追踪、机构观点、宏观市场、话题研究）
const categoryTabs = [
  { key: 'latest', label: '全部' },
  { key: 'trade_track', label: '交易追踪' },
  { key: 'market_news', label: '机构观点' },
  { key: 'wealth_news', label: '宏观市场' },
  { key: 'topic_research', label: '话题研究' }
];

// 置顶动态公告（简约单行内容展示，无图标无副标）
const pinnedNoticesList = [
  {
    id: 'post-1',
    content: '新人必看 · 核心价值框架与投研认知底层逻辑指南'
  },
  {
    id: 'post-pin-2',
    content: '星球全景 · 投研体系分布与全站六大专栏内容导航'
  },
  {
    id: 'post-pin-3',
    content: '「AI产业」全景剖析：理清算力、芯片与大模型应用机会'
  }
];

const displayedPosts = filteredPosts;

const perspectiveLabel = computed(() => {
  if (appState.currentPerspective === 'founder') return '星主';
  if (appState.currentPerspective === 'vip') return 'VIP会员';
  return '普通星友';
});

const handlePlanetInfo = () => {
  uni.showToast({ title: '财不外露 · 财富成长星球', icon: 'none' });
};

const handlePinnedItemClick = (item) => {
  uni.navigateTo({
    url: `/pages/feed/detail?id=post-1`
  });
};

const handleSearchClick = () => {
  uni.navigateTo({
    url: '/pages/feed/search'
  });
};

// 分类筛选底部抽屉
const filterSheetVisible = ref(false);

const handleFilterMenuClick = () => {
  filterSheetVisible.value = true;
};

const handleFilterSelect = (key) => {
  actions.setFeedFilter(key);
  filterSheetVisible.value = false;
};

// 顶部金钮文案：星主/合伙人/嘉宾显示身份特权，年度会员显示我的特权，星友显示立即加入
const heroJoinLabel = computed(() => {
  const role = appState.user.role;
  if (role === 'founder') return '星主特权';
  if (role === 'partner') return '合伙人特权';
  if (role === 'guest_expert') return '嘉宾特权';
  if (isVipOrAbove.value) return '我的特权';
  return '立即加入';
});

// 身份特权卡弹窗（星主/合伙人/嘉宾免费享会员特权）
const rolePrivilegeVisible = ref(false);

const handleHeroAction = () => {
  const role = appState.user.role;
  if (role === 'founder' || role === 'partner' || role === 'guest_expert') {
    rolePrivilegeVisible.value = true;
  } else {
    appState.isVipModalVisible = true;
  }
};

// 右下角发表悬浮按钮：直接打开发布资讯弹窗（提问入口仅在星友名单）
const handleFabPublish = () => {
  if (!actions.checkVipPermission('发帖为会员专享，开通会员立即与星友交流')) return;
  appState.publishModalMode = 'post';
  appState.publishTargetExpert = '';
  appState.isPublishModalVisible = true;
};

onPullDownRefresh(() => {
  setTimeout(() => {
    uni.stopPullDownRefresh();
    uni.showToast({ title: '已刷新最新动态', icon: 'none' });
  }, 600);
});
</script>

<style lang="scss" scoped>
.feed-page-root {
  min-height: 100vh;
  background-color: #ffffff;
  padding-bottom: 75px;
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 0. 顶部固定吸顶导航栏 (Large Title 缩小固定在顶部) */
.pinned-top-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  z-index: 100;
  pointer-events: none;
  background: rgba(18, 38, 70, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  border-bottom: 0.5px solid transparent;
  transition: background-color 0.22s ease, border-color 0.22s ease, backdrop-filter 0.22s ease, -webkit-backdrop-filter 0.22s ease, box-shadow 0.22s ease;

  &.is-scrolled {
    pointer-events: auto;
    /* 标题缩小后标题栏背景色更浅更通透 (符合用户要求浅一点) */
    background: rgba(26, 48, 86, 0.78);
    backdrop-filter: blur(25px) saturate(190%);
    -webkit-backdrop-filter: blur(25px) saturate(190%);
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  }
}

@media screen and (min-width: 641px) {
  .pinned-top-nav-bar {
    max-width: 420px;
    left: calc(50% - 210px) !important;
    right: calc(50% - 210px) !important;
  }
}

.top-nav-safe-inset {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}

.top-nav-content-row {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 7px 16px;
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* 缩小的标题靠左对齐 (移除居中绝对定位) */
.top-nav-left-group {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.75;
  }
}

.pinned-brand-title {
  font-size: 16.5px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.2px;
  line-height: 1;
}

.pinned-starburst-svg {
  flex-shrink: 0;
}

.top-nav-right-slot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}

.top-nav-search-btn {
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.16);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.92);
  }
}

/* 1. 顶部深海蓝黑沉浸头图 (Apple 风格平滑安全区与弹性拉伸) */
.hero-header-section {
  background: linear-gradient(180deg, #07152b 0%, #0a1e3d 50%, #0d2346 100%);
  padding: calc(14px + constant(safe-area-inset-top)) 16px 20px 16px;
  padding: calc(14px + env(safe-area-inset-top)) 16px 20px 16px;
  position: relative;
  overflow-x: clip; /* 解决页面左右滚动摇晃问题 */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  /* 解决 iOS 橡皮筋下拉时顶部露出灰缝的问题，向上无缝延伸深蓝天幕 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: -400px;
    height: 400px;
    background: #07152b;
    pointer-events: none;
  }

  /* 底部大气层地平线漫反射微光 (Atmospheric horizon scrim) */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40px;
    background: linear-gradient(180deg, transparent 0%, rgba(7, 21, 43, 0.45) 100%);
    pointer-events: none;
    z-index: 1;
  }
}

/* 精密天体星轨微质感发丝暗纹 */
.hero-orbital-backdrop {
  position: absolute;
  right: 0; /* 修复-20px导致撑开页面产生左右横滑的问题 */
  top: -10px;
  width: 280px;
  max-width: 100%;
  height: 160px;
  pointer-events: none;
  user-select: none;
  z-index: 1;
  overflow: hidden;

  .orbital-svg {
    width: 100%;
    height: 100%;
  }
}

/* 第一行：品牌行 */
.brand-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.brand-left-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

/* 官方品牌 Logo 容器 (财不外露 Fortune in Reserve) */
.brand-logo-box {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  overflow: hidden;
  background-color: #faf6ed;
  border: 1.5px solid rgba(217, 119, 6, 0.45);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.25, 1, 0.5, 1);

  &:active {
    transform: scale(0.95);
  }
}

.brand-logo-img {
  width: 100%;
  height: 100%;
  display: block;
}

.brand-text-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.title-verified-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand-name-text {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.2px;
  line-height: 1.2;
}

.verified-starburst-svg {
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}

.brand-slogan-text {
  font-size: 11.5px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.1px;
}

/* 右侧毛玻璃圆形按钮 */
.header-actions-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.btn-glass-icon {
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.18s cubic-bezier(0.25, 1, 0.5, 1);

  &:active {
    background: rgba(255, 255, 255, 0.22);
    transform: scale(0.94);
  }
}

/* 第二行：星友加入行 */
.members-join-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  position: relative;
  z-index: 2;
}

.members-info-left {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.82;
  }
}

.avatar-stack-bubbles {
  display: flex;
  align-items: center;
}

.stack-avatar-item {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  margin-left: -7px;
  display: block;
  background-color: #1e293b;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);

  &:first-child {
    margin-left: 0;
  }
}

.stack-more-badge {
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-color: rgba(245, 158, 11, 0.6);
}

.stack-more-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #f59e0b;
}

.members-joined-label {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.2px;
  font-variant-numeric: tabular-nums;
}

/* 立即加入金钮 (香槟浅金微光质感) */
.btn-golden-join {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #fde68a 0%, #f59e0b 45%, #d97706 100%);
  color: #271700;
  padding: 7px 18px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 3px 12px -2px rgba(217, 119, 6, 0.35);
  border: 0.5px solid rgba(253, 230, 138, 0.6);
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.25, 1, 0.5, 1);

  &:active {
    transform: scale(0.95);
  }
}

.crown-icon-svg {
  flex-shrink: 0;
}

.join-label {
  line-height: 1;
}

/* 3. 浅灰卡片置顶条 (不通栏，左右留缝、8px 圆角，背景与 tab 胶囊一致) */
.floating-pinned-card {
  margin: 8px 12px;
  box-sizing: border-box;
  width: auto;
  max-width: 100%;
  background: rgb(246, 246, 246);
  border-radius: 8px;
  padding: 2px 12px;
  border: none;
  box-shadow: none !important;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pinned-notice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.06);
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.65;
  }

  &:last-child {
    border-bottom: none;
  }
}

.pinned-tag-badge {
  background: rgba(16, 185, 129, 0.1);
  border: 0.5px solid rgba(16, 185, 129, 0.25);
  border-radius: 2px;
  padding: 2px 7.5px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pinned-tag-text {
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  line-height: 1.2;
}

.pinned-content-text {
  flex: 1;
  font-size: 13.5px;
  font-weight: 500;
  color: #1c1c1e;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.15px;
}

.pinned-arrow-svg {
  flex-shrink: 0;
  margin-left: 2px;
  opacity: 0.7;
}

/* 3. 胶囊式分类 Tabs 栏 (极简纯白磨砂与细腻胶囊) */
.category-capsules-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 10px 16px;
  position: sticky;
  top: calc(constant(safe-area-inset-top) + 50px);
  top: calc(env(safe-area-inset-top) + 50px);
  z-index: 40;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.08);
}

.capsules-scroll-wrapper {
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
}

.capsules-fade-mask {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.95) 100%);
}

.capsules-scroll-view {
  width: 100%;
  white-space: nowrap !important;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;

  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none !important;
    background: transparent !important;
  }
}

.capsules-scroll-view ::v-deep {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;

  &::-webkit-scrollbar,
  *::-webkit-scrollbar,
  .uni-scroll-view::-webkit-scrollbar,
  .uni-scroll-view-content::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none !important;
    background: transparent !important;
    color: transparent !important;
  }

  .uni-scroll-view {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  .uni-scroll-view-content {
    display: inline-flex !important;
    white-space: nowrap !important;
    flex-wrap: nowrap !important;
  }
}

.capsules-flex-wrap {
  display: inline-flex !important;
  align-items: center;
  gap: 8px;
  padding-right: 12px;
  white-space: nowrap !important;
  flex-wrap: nowrap !important;
}

.capsule-item {
  height: 32px;
  padding: 0 14px !important;
  border-radius: 8px;
  background: rgb(246, 246, 246);
  border: none;
  box-shadow: none;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  flex-wrap: nowrap !important;
  word-break: keep-all !important;
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  -webkit-tap-highlight-color: transparent;

  .capsule-text {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    line-height: 1;
    white-space: nowrap !important;
    word-break: keep-all !important;
  }

  &:active {
    transform: scale(0.95);
    opacity: 0.85;
  }

  &.active {
    background: #4e4e4e;
    border-color: #4e4e4e;
    box-shadow: none;
    padding: 0 16px !important;

    .capsule-text {
      color: #ffffff;
      font-weight: 600;
    }
  }
}

.btn-menu-filter {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgb(246, 246, 246);
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.25, 1, 0.5, 1);
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.92);
  }
}

/* 4. 信息流列表 */
.feed-posts-stream {
  padding: 0 0 14px 0;
  background-color: #ffffff;
}

.empty-feed-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 0;
  margin: 0;
  border: none;
  box-shadow: none !important;
  overflow: hidden;
}

.empty-icon-text {
  font-size: 38px;
  margin-bottom: 10px;
}

.empty-main-hint {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.empty-sub-hint {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 16px;
}

.btn-empty-reset {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

/* 5. 右下角发表悬浮按钮 (用户要求保留绿色，与 PC 端统一，增加微发丝微光) */
.fab-publish-btn {
  position: fixed;
  right: 18px;
  bottom: calc(56px + constant(safe-area-inset-bottom) + 20px);
  bottom: calc(56px + env(safe-area-inset-bottom) + 20px);
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  border: 0.5px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.32, 0.86, 0.28, 1), box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.92);
  }
}

@media screen and (min-width: 641px) {
  .fab-publish-btn {
    right: calc(50% - 210px + 18px) !important;
  }
}

.fab-pen-svg {
  display: block;
}

/* 发布方式底部抽屉 */
.publish-drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  animation: publishDrawerFadeIn 0.2s ease;
}

.publish-drawer-panel {
  width: 100%;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 10px 16px calc(16px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  animation: publishDrawerSlideUp 0.25s ease;
}

.publish-drawer-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  margin: 0 auto 10px;
}

.publish-drawer-title {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  padding-bottom: 8px;
}

.filter-drawer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 12px;
  border-radius: 12px;
  cursor: pointer;
}

.filter-drawer-item:active {
  background: #f6f6f6;
}

.filter-drawer-label {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

.publish-drawer-cancel {
  margin-top: 8px;
  border-top: 0.5px solid #f1f5f9;
  text-align: center;
  font-size: 15px;
  color: #64748b;
  padding: 13px 0;
  cursor: pointer;
}

@keyframes publishDrawerFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes publishDrawerSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
