<template>
  <view class="publisher-bar-card" @tap="handleOpenPublish('post')">
    <image :src="appState.user.avatar" class="user-avatar" mode="aspectFill" />
    <view class="placeholder-input-box">
      <text class="placeholder-text">分享你的投资思考、交易复盘或提问...</text>
    </view>
    <view class="tool-icons-wrap">
      <!-- 图片图标 -->
      <view class="tool-btn" @tap.stop="handleOpenPublish('post')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </view>
      <!-- 提问图标 -->
      <view class="tool-btn" @tap.stop="handleOpenPublish('question')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </view>
    </view>
  </view>
</template>

<script setup>
import { appState, actions } from '../store/community.js';

const handleOpenPublish = (mode = 'post') => {
  if (actions.checkVipPermission(mode === 'question' ? '提问功能为会员专享，开通会员即可向嘉宾提问' : '发帖为会员专享，开通会员立即与星友交流')) {
    appState.publishModalMode = mode;
    appState.isPublishModalVisible = true;
  }
};
</script>

<style lang="scss" scoped>
.publisher-bar-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 14px;
  margin: 10px 12px;
  border: 1px solid #edf2f7;
  box-shadow: none !important;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #edf2f7;
  flex-shrink: 0;
}

.placeholder-input-box {
  flex: 1;
  background: #f8fafc;
  height: 34px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border: 1px solid #f1f5f9;
}

.placeholder-text {
  font-size: 12.5px;
  color: #94a3b8;
}

.tool-icons-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tool-btn {
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
