<template>
  <div class="profile-view-wrap">
    <!-- Page Header: back + user info card -->
    <div class="profile-header-card">
      <div class="profile-header-top">
        <button class="btn-back" @click="goBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </button>
      </div>

      <div v-if="profile" class="profile-user-block">
        <img v-if="profile.avatar" :src="profile.avatar" class="profile-avatar" alt="Avatar" />
        <div v-else class="profile-avatar profile-avatar-fallback">{{ profile.name.charAt(0) }}</div>
        <div class="profile-user-meta">
          <div class="profile-name-row">
            <span class="profile-name">{{ profile.name }}</span>
            <span :class="['profile-role-badge', `role-${profile.role}`]">{{ roleLabelMap[profile.role] }}</span>
          </div>
          <span v-if="profile.roleTitle" class="profile-role-title">{{ profile.roleTitle }}</span>
          <p v-if="profile.bio" class="profile-bio">{{ profile.bio }}</p>
        </div>
        <div class="profile-post-count">
          <span class="count-num">{{ posts.length }}</span>
          <span class="count-label">条资讯</span>
        </div>
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
      <div class="empty-title">TA 还没有发布过资讯</div>
      <p class="empty-desc">去资讯流看看其他星友的分享吧！</p>
      <button class="btn-primary" @click="goBack">返回资讯流</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appState, actions, userProfilePosts, activeProfileUser, roleLabelMap } from '@/stores/community';
import PostCard from './PostCard.vue';

const posts = userProfilePosts;
const profile = activeProfileUser;

const goBack = () => {
  actions.setCurrentView('feed');
};
</script>

<style scoped>
.profile-view-wrap {
  width: 100%;
}

/* Header Card */
.profile-header-card {
  background: #ffffff;
  border: 1px solid #eaedf1;
  border-radius: var(--radius-card);
  padding: 14px 18px 18px;
  margin-bottom: 12px;
}

.profile-header-top {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
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

/* User Block */
.profile-user-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #eaedf1;
}

.profile-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f59e0b;
  font-size: 22px;
  font-weight: 700;
}

.profile-user-meta {
  flex: 1;
  min-width: 0;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-name {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-role-badge {
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.profile-role-badge.role-founder {
  background: #fef3c7;
  color: #b45309;
}

.profile-role-badge.role-partner {
  background: #ede9fe;
  color: #6d28d9;
}

.profile-role-badge.role-vip {
  background: #fef3c7;
  color: #92400e;
}

.profile-role-badge.role-member,
.profile-role-badge.role-guest {
  background: #f1f5f9;
  color: #64748b;
}

.profile-role-title {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
}

.profile-bio {
  margin: 5px 0 0;
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.profile-post-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding: 0 6px;
}

.count-num {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

.count-label {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
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
