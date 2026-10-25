<template>
  <view class="legal-page">
    <!-- 顶部：状态栏占位 + 固定遮挡层 + 导航 -->
    <view class="status-bar-spacer"></view>
    <view class="status-bar-cover"></view>
    <view class="legal-nav">
      <view class="nav-back-btn" @tap="goBack">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </view>
      <text class="nav-title">{{ doc.title }}</text>
      <view class="nav-right-slot"></view>
    </view>

    <scroll-view scroll-y class="legal-body">
      <view class="doc-card">
        <text class="doc-update-date">{{ doc.updateDate }}</text>
        <view v-for="(sec, i) in doc.sections" :key="i" class="doc-section">
          <text class="sec-heading">{{ sec.heading }}</text>
          <text v-for="(p, j) in sec.paras" :key="j" class="sec-para">{{ p }}</text>
        </view>
      </view>
      <view class="body-bottom-safe"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { legalDocs } from '../../common/legal.js';

const doc = ref(legalDocs.terms);

onLoad((options) => {
  doc.value = options && options.type === 'privacy' ? legalDocs.privacy : legalDocs.terms;
  uni.setNavigationBarTitle({ title: doc.value.title });
});

const goBack = () => uni.navigateBack();
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: #ffffff;
}

.status-bar-spacer {
  background: #ffffff;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

/* 固定遮挡层：盖住状态栏区域，滚动时内容不透出 */
.status-bar-cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top);
  height: constant(safe-area-inset-top);
  background: #ffffff;
  z-index: 120;
}

.legal-nav {
  display: flex;
  align-items: center;
  height: 48px;
  background: #ffffff;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-back-btn {
  width: 44px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1c1c1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: -44px;
}

.nav-right-slot {
  width: 44px;
  flex-shrink: 0;
}

.legal-body {
  height: calc(100vh - 48px - env(safe-area-inset-top));
  height: calc(100vh - 48px - constant(safe-area-inset-top));
}

.doc-card {
  padding: 16px 18px 8px 18px;
}

.doc-update-date {
  display: block;
  font-size: 11.5px;
  color: #8e8e93;
  margin-bottom: 14px;
}

.doc-section {
  margin-bottom: 16px;
}

.sec-heading {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 7px;
}

.sec-para {
  display: block;
  font-size: 13px;
  color: #3c3c43;
  line-height: 1.75;
  margin-bottom: 7px;
}

.body-bottom-safe {
  height: calc(24px + env(safe-area-inset-bottom));
  height: calc(24px + constant(safe-area-inset-bottom));
}
</style>
