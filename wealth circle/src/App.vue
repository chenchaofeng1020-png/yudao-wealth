<template>
  <div class="app-root">
    <!-- 1. Landing Introduction View (Default on initial load) -->
    <LandingView v-if="appState.appFlowState === 'landing'" />

    <!-- 2. Paywall Membership Activation View -->
    <PaywallView v-else-if="appState.appFlowState === 'paywall'" />

    <!-- 3. Authenticated Community Platform -->
    <div v-else class="community-shell">
      <!-- Body Row: Sidebar (brand + search + user) + Main Viewport -->
      <div class="app-layout">
        <!-- Left Navigation Sidebar -->
        <Sidebar />

        <!-- Main Scrollable Viewport: center content + independent right column -->
        <div class="main-viewport">
          <main class="page-content-wrapper">
            <!-- Center Content Column (independent) -->
            <div class="center-column">
              <div class="center-main-stage">
                <PostFeed v-if="appState.currentView === 'feed'" />
                <TagFeedView
                  v-else-if="appState.currentView === 'tag'"
                />
                <LearningCenter
                  v-else-if="appState.currentView === 'column'"
                  initialTab="column"
                />
                <LearningCenter
                  v-else-if="appState.currentView === 'live'"
                  initialTab="live"
                />
                <LearningCenter
                  v-else-if="appState.currentView === 'course'"
                  initialTab="course"
                />
                <UserProfileView v-else-if="appState.currentView === 'profile'" />
              </div>
            </div>
          </main>

          <!-- Right Information Widgets (independent column, outside main) -->
          <Rightbar />
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
import PublishModal from './components/modals/PublishModal.vue';
import VipJoinModal from './components/modals/VipJoinModal.vue';
import ChapterReaderModal from './components/modals/ChapterReaderModal.vue';
import VideoPlayerModal from './components/modals/VideoPlayerModal.vue';
import UserCenterModal from './components/modals/UserCenterModal.vue';
import CommunityMembersModal from './components/modals/CommunityMembersModal.vue';
import AskQuestionModal from './components/modals/AskQuestionModal.vue';
import PostDetailModal from './components/modals/PostDetailModal.vue';
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
  margin: 12px 6px 0 6px;
  padding: 20px 10px 0 10px;
  background-color: #ffffff;
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
  max-width: 820px;
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
