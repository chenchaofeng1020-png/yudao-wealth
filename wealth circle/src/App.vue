<template>
  <div class="app-root">
    <!-- 1. Landing Introduction View (Default on initial load) -->
    <LandingView v-if="appState.appFlowState === 'landing'" />

    <!-- 2. Paywall Membership Activation View -->
    <PaywallView v-else-if="appState.appFlowState === 'paywall'" />

    <!-- 3. Authenticated Community Platform -->
    <div v-else class="community-shell" :class="{ 'is-embed': appState.previewEmbed }">
      <!-- Body Row: Sidebar (brand + search + user) + Main Viewport -->
      <div class="app-layout">
        <!-- Left Navigation Sidebar (hidden in admin embed mode) -->
        <Sidebar v-if="!appState.previewEmbed" />

        <!-- Main Scrollable Viewport: center content + independent right column -->
        <div class="main-viewport" :class="{ 'is-column-layout': ['column', 'live', 'course'].includes(appState.currentView) }">
          <main 
            class="page-content-wrapper"
            :class="{ 'is-column-view': ['column', 'live', 'course'].includes(appState.currentView) }"
          >
            <!-- Center Content Column (independent) -->
            <div 
              class="center-column"
              :class="{ 'is-column-view': ['column', 'live', 'course'].includes(appState.currentView) }"
            >
              <div 
                class="center-main-stage"
                :class="{ 'is-column-view': ['column', 'live', 'course'].includes(appState.currentView) }"
              >
                <PostFeed v-if="appState.currentView === 'feed'" />
                <TagFeedView
                  v-else-if="appState.currentView === 'tag'"
                />
                <ColumnView
                  v-else-if="appState.currentView === 'column'"
                />
                <LiveView
                  v-else-if="appState.currentView === 'live'"
                />
                <LearningCenter
                  v-else-if="appState.currentView === 'course'"
                  initialTab="course"
                />
                <UserProfileView v-else-if="appState.currentView === 'profile'" />
              </div>
            </div>
          </main>

          <!-- Right Information Widgets (Hide when viewing column, live, or course) -->
          <Rightbar v-if="!['column', 'live', 'course'].includes(appState.currentView)" />
        </div>
      </div>
    </div>

    <!-- Auth Modal (Registration & Login) -->
    <AuthModal />

    <!-- Floating Global Modals -->
    <PublishModal />
    <VipJoinModal />
    <ChapterReaderModal />
    <VideoPlayerModal />
    <UserCenterModal />
    <CommunityMembersModal />
    <AskQuestionModal />
    <PostDetailModal />
    <SearchResultsModal />

    <!-- Toast Notice -->
    <transition name="toast-fade">
      <div v-if="appState.toastMessage" class="global-toast">
        <div class="toast-indicator"></div>
        <span>{{ appState.toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { appState } from '@/stores/community';
import LandingView from './components/landing/LandingView.vue';
import PaywallView from './components/landing/PaywallView.vue';
import AuthModal from './components/auth/AuthModal.vue';
import Sidebar from './components/layout/Sidebar.vue';
import Rightbar from './components/layout/Rightbar.vue';
import PostFeed from './components/community/PostFeed.vue';
import TagFeedView from './components/community/TagFeedView.vue';
import UserProfileView from './components/community/UserProfileView.vue';
import LearningCenter from './components/learning/LearningCenter.vue';
import ColumnView from './components/learning/ColumnView.vue';
import LiveView from './components/learning/LiveView.vue';
import PublishModal from './components/modals/PublishModal.vue';
import VipJoinModal from './components/modals/VipJoinModal.vue';
import ChapterReaderModal from './components/modals/ChapterReaderModal.vue';
import VideoPlayerModal from './components/modals/VideoPlayerModal.vue';
import UserCenterModal from './components/modals/UserCenterModal.vue';
import CommunityMembersModal from './components/modals/CommunityMembersModal.vue';
import AskQuestionModal from './components/modals/AskQuestionModal.vue';
import PostDetailModal from './components/modals/PostDetailModal.vue';
import SearchResultsModal from './components/modals/SearchResultsModal.vue';
</script>

<style scoped>
/* 整站留白底色：大屏时主体居中，两侧露出浅灰 */
/* 注意：介绍页/会员页是可滚动的长页面，固定视口只由 .community-shell 自己负责 */
.app-root {
  display: flex;
  flex-direction: column;
  background-color: #f1f5f9;
}

/* 顶部导航栏全屏：白底横跨整个窗口 */
.community-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶栏下方主体：固定最大宽度，大屏居中；背景与网页留白融为一体 */
.app-layout {
  flex: 1;
  display: flex;
  min-height: 0;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f1f5f9;
}

.main-viewport {
  flex: 1;
  display: flex;
  flex-direction: row;
  min-width: 0;
  overflow: hidden;
  /* 内容区下方露灰：main 白色区域下移，顶栏与内容之间露出灰色背景 */
  background-color: #f1f5f9;
}

.page-content-wrapper {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
  margin: 12px 0 0 0;
  padding: 0;
  /* 外壳透明露出灰底：各视图白色根容器/资讯流卡片成为独立卡片，四周露出灰色缝隙 */
  background-color: transparent;
  border-radius: 8px;
}

/* 中间内容列：独立于右栏，内部居中限宽 */
.center-column {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  height: 100%;
}

.center-main-stage {
  width: 100%;
  max-width: 888px;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  /* 隐藏滚动条避免占位把内容挤偏，保持左右留白对称 */
  scrollbar-width: none;
  overscroll-behavior-y: contain;
  padding-bottom: 32px;
}

.center-main-stage::-webkit-scrollbar {
  display: none;
}

/* 后台嵌入模式：去除留白与限宽，文章阅读区贴满容器 */
.community-shell.is-embed {
  background-color: #ffffff;
}

.community-shell.is-embed .app-layout {
  max-width: none;
  background-color: #ffffff;
}

.community-shell.is-embed .main-viewport {
  background-color: #ffffff;
}

.community-shell.is-embed .page-content-wrapper {
  margin: 0;
  padding: 0;
  border-radius: 0;
  background-color: #ffffff;
}

.community-shell.is-embed .page-content-wrapper.is-column-view {
  margin: 0;
}

.community-shell.is-embed .center-main-stage {
  max-width: none;
}

/* 专栏/直播页面专属：不需要右侧一栏，占满主视口宽度并保持统一白色背景 */
.page-content-wrapper.is-column-view {
  margin: 12px 12px 0 12px;
  padding: 0;
  background-color: #ffffff;
  border-radius: 8px;
}

.center-column.is-column-view {
  justify-content: stretch;
  width: 100%;
}

.center-main-stage.is-column-view {
  max-width: 100%;
  padding-bottom: 0;
}

/* Global Toast */
.global-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-navy);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  z-index: 9999;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.toast-indicator {
  width: 8px;
  height: 8px;
  background: var(--brand-green);
  border-radius: 50%;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 14px);
}
</style>
