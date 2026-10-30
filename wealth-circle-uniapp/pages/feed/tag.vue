<template>
  <view class="tag-page">
    <!-- 标签信息栏：#标签名 + 资讯数 -->
    <view class="tag-info-bar">
      <text class="tag-title">#{{ tagName }}</text>
      <text class="tag-count">{{ tagPosts.length }} 条资讯</text>
    </view>

    <!-- 该标签下的资讯流（复用信息流卡片） -->
    <view v-if="tagPosts.length" class="tag-posts-stream">
      <PostCard v-for="post in tagPosts" :key="post.id" :post="post" />
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-tag-card">
      <text class="empty-icon-text">📭</text>
      <text class="empty-main-hint">该标签下暂无资讯</text>
      <text class="empty-sub-hint">去看看其他标签的内容吧</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appState } from '../../store/community.js';
import PostCard from '../../components/PostCard.vue';

const tagName = ref('');

const tagPosts = computed(() =>
  appState.posts
    .filter(p => p.tags && p.tags.includes(tagName.value))
    .slice()
    .reverse()
);

onLoad((options) => {
  if (options && options.tag) {
    tagName.value = decodeURIComponent(options.tag);
  }
  uni.setNavigationBarTitle({ title: `#${tagName.value}` });
});
</script>

<style lang="scss" scoped>
.tag-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding: 12px;
  box-sizing: border-box;
}

.tag-info-bar {
  display: flex;
  align-items: baseline;
  gap: 10px;
  background: #ffffff;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 12px;
}

.tag-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-count {
  font-size: 12.5px;
  color: #64748b;
  flex-shrink: 0;
}

.tag-posts-stream {
  display: flex;
  flex-direction: column;
}

.empty-tag-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-text {
  font-size: 36px;
  margin-bottom: 8px;
}

.empty-main-hint {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.empty-sub-hint {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 6px;
}
</style>
