<template>
  <view class="search-page">
    <!-- 顶部状态栏固定遮罩（App 端滚动时盖住状态栏区域） -->
    <view class="status-bar-cover"></view>

    <!-- 1. 搜索头部：返回 + 搜索输入框 -->
    <view class="search-header">
      <view class="search-back-btn" @tap="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </view>

      <view class="search-input-wrap">
        <svg class="search-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          class="search-input"
          type="text"
          v-model="keyword"
          :focus="autoFocus"
          confirm-type="search"
          placeholder="搜索资讯"
          placeholder-class="search-placeholder"
          @confirm="onConfirm"
        />
        <view v-if="keyword" class="search-clear-btn" @tap="clearKeyword">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </view>
      </view>

      <text class="search-cancel-text" @tap="goBack">取消</text>
    </view>

    <!-- 2. 内容区 -->
    <view class="search-body">
      <!-- 未输入关键词：引导态 -->
      <view v-if="!trimmedKeyword" class="search-idle">
        <view class="search-idle-icon-wrap">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </view>
        <text class="search-idle-title">搜索星球内的资讯</text>
        <text class="search-idle-sub">支持正文关键词与标签匹配</text>
      </view>

      <!-- 搜索结果列表 -->
      <template v-else>
        <view class="search-result-meta">
          <text class="result-meta-text">找到 {{ results.length }} 条与「{{ trimmedKeyword }}」相关的内容</text>
        </view>

        <view class="search-result-stream">
          <PostCard v-for="post in results" :key="post.id" :post="post" />

          <!-- 无结果空状态 -->
          <view v-if="results.length === 0" class="search-empty-card">
            <text class="empty-icon-text">🔍</text>
            <text class="empty-main-hint">没有找到相关内容</text>
            <text class="empty-sub-hint">换个关键词试试，或浏览全部动态</text>
            <button class="btn-empty-back" @tap="clearKeyword">清空搜索</button>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appState } from '../../store/community.js';
import PostCard from '../../components/PostCard.vue';

const keyword = ref('');
const autoFocus = ref(true);

const trimmedKeyword = computed(() => keyword.value.trim());

// 命中规则：正文包含关键词，或任一 #话题 标签包含关键词（不区分大小写）
const results = computed(() => {
  const kw = trimmedKeyword.value.toLowerCase();
  if (!kw) return [];
  return appState.posts.filter(
    (p) =>
      (p.content || '').toLowerCase().includes(kw) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(kw))
  );
});

const clearKeyword = () => {
  keyword.value = '';
  autoFocus.value = false;
  setTimeout(() => { autoFocus.value = true; }, 50);
};

const onConfirm = () => {
  if (!trimmedKeyword.value) return;
  // 实时搜索已生效，回车仅收起键盘
};

const goBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.search-page {
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

/* 1. 搜索头部 */
.search-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 10px 14px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
  background: #ffffff;
}

.search-back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search-input-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 10px;
  background: #f6f6f6;
  border-radius: 10px;
}

.search-input-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  font-size: 14px;
  color: #0f172a;
  background: transparent;
}

.search-placeholder {
  color: #94a3b8;
  font-size: 13.5px;
}

.search-clear-btn {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #c0c4cc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search-cancel-text {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #059669;
}

/* 2. 内容区 */
.search-body {
  padding: 0 0 20px 0;
}

/* 引导态 */
.search-idle {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 110px;
}

.search-idle-icon-wrap {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #f6f6f6;
  border: 0.5px solid rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.search-idle-title {
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 7px;
}

.search-idle-sub {
  font-size: 12.5px;
  color: #94a3b8;
}

/* 结果元信息 */
.search-result-meta {
  padding: 12px 16px 4px 16px;
}

.result-meta-text {
  font-size: 12px;
  color: #94a3b8;
}

.search-result-stream {
  padding-top: 2px;
}

/* 无结果空状态 */
.search-empty-card {
  margin: 14px 14px 0 14px;
  padding: 44px 20px;
  background: #f6f6f6;
  border-radius: 12px;
  border: 0.5px solid rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-text {
  font-size: 34px;
  margin-bottom: 12px;
}

.empty-main-hint {
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.empty-sub-hint {
  font-size: 12.5px;
  color: #94a3b8;
  margin-bottom: 18px;
}

.btn-empty-back {
  margin: 0;
  padding: 0 22px;
  height: 34px;
  line-height: 34px;
  background: #10b981;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 17px;
  border: none;

  &::after {
    border: none;
  }
}
</style>
