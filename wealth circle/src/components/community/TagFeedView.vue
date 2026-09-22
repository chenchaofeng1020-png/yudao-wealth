<template>
  <div class="tag-view-wrap">
    <!-- Page Header: back + tag title -->
    <div class="tag-view-header">
      <button class="btn-back" @click="goBack">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        返回
      </button>
      <div class="tag-title-block">
        <h2 class="tag-title">#{{ appState.activeTag }}</h2>
        <span class="tag-count">{{ posts.length }} 条资讯</span>
      </div>
    </div>

    <!-- Posts Stream -->
    <div v-if="posts.length" class="posts-stream">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>

    <div v-else class="empty-feed-card">
      <div class="empty-icon">📭</div>
      <div class="empty-title">该标签下暂无资讯</div>
      <p class="empty-desc">去看看其他标签的内容吧！</p>
      <button class="btn-primary" @click="goBack">返回资讯流</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appState, actions, tagFilteredPosts } from '@/stores/community';
import PostCard from './PostCard.vue';

const posts = tagFilteredPosts;

const goBack = () => {
  actions.setCurrentView('feed');
};
</script>

<style scoped>
.tag-view-wrap {
  width: 100%;
}

/* Page Header */
.tag-view-header {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #eaedf1;
  border-radius: var(--radius-card);
  padding: 14px 18px;
  margin-bottom: 12px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f4f5f7;
  color: #334155;
  border: none;
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.btn-back:hover {
  background: #e9ecf0;
  color: #0f172a;
}

.tag-title-block {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.tag-title {
  margin: 0;
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

/* Posts Stream */
.posts-stream {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Empty Card */
.empty-feed-card {
  background: #ffffff;
  border: 1px solid #eaedf1;
  border-radius: var(--radius-card);
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.empty-desc {
  font-size: 13px;
  color: #64748b;
  margin: 6px 0 16px 0;
}

.btn-primary {
  background: #0ea5e9;
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0284c7;
}
</style>
