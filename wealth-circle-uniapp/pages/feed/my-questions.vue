<template>
  <view class="my-questions-page">
    <!-- 顶部状态栏固定遮罩（App 端滚动时盖住状态栏区域） -->
    <view class="status-bar-cover"></view>

    <!-- 1. 顶部标题栏：返回 + 标题 -->
    <view class="page-header">
      <view class="header-back-btn" @tap="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </view>
      <text class="header-title">会员提问</text>
      <view class="header-right-placeholder"></view>
    </view>

    <!-- 2. 提问列表 -->
    <view class="questions-stream">
      <PostCard v-for="post in myQuestions" :key="post.id" :post="post" />

      <!-- 空状态 -->
      <view v-if="myQuestions.length === 0" class="empty-card">
        <view class="empty-icon-wrap">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </view>
        <text class="empty-main-hint">暂无提问记录</text>
        <text class="empty-sub-hint">开通会员后可在资讯页向星主与嘉宾提问</text>
        <button class="btn-empty-go" @tap="goFeed">去提问</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { appState } from '../../store/community.js';
import PostCard from '../../components/PostCard.vue';

// 当前用户发出的提问帖（questionTarget 非空即提问帖）
const myQuestions = computed(() =>
  appState.posts.filter((p) => p.questionTarget && p.author.id === appState.user.id)
);

const goBack = () => {
  uni.navigateBack();
};

const goFeed = () => {
  uni.switchTab({ url: '/pages/feed/index' });
};
</script>

<style lang="scss" scoped>
.my-questions-page {
  min-height: 100vh;
  background-color: #ffffff;
  box-sizing: border-box;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-bottom: 40px;
  -webkit-tap-highlight-color: transparent;
}

/* 顶部状态栏固定遮罩 */
.status-bar-cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  background: #ffffff;
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}

/* 1. 顶部标题栏 */
.page-header {
  display: flex;
  align-items: center;
  padding: 8px 14px 10px 14px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
  background: #ffffff;
}

.header-back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1c1c1e;
}

.header-right-placeholder {
  width: 32px;
  flex-shrink: 0;
}

/* 2. 提问列表 */
.questions-stream {
  padding: 4px 0 20px 0;
}

/* 空状态 */
.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 110px 16px 0 16px;
  padding: 36px 20px;
  background: #f8fafc;
  border: 0.5px solid rgba(15, 23, 42, 0.06);
  border-radius: 8px;
}

.empty-icon-wrap {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #ffffff;
  border: 0.5px solid rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-main-hint {
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 7px;
}

.empty-sub-hint {
  font-size: 12.5px;
  color: #94a3b8;
  margin-bottom: 20px;
}

.btn-empty-go {
  width: 132px;
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: #059669;
  border-radius: 19px;
  padding: 0;

  &::after {
    border: none;
  }
}
</style>
