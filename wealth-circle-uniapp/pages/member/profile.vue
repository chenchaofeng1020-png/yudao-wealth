<template>
  <view class="member-profile-page">
    <!-- 用户资料卡（对齐 PC 端 UserProfileView） -->
    <view class="profile-header-card">
      <view v-if="profile" class="profile-user-block">
        <image v-if="profile.avatar" :src="profile.avatar" mode="aspectFill" class="profile-avatar" />
        <view v-else class="profile-avatar profile-avatar-fallback">{{ (profile.name || '?').charAt(0) }}</view>
        <view class="profile-user-meta">
          <view class="profile-name-row">
            <text class="profile-name">{{ profile.name }}</text>
            <text :class="['profile-role-badge', `role-${profile.role}`]">{{ roleLabelMap[profile.role] || '星友' }}</text>
          </view>
          <text v-if="profile.roleTitle" class="profile-role-title">{{ profile.roleTitle }}</text>
          <text v-if="profile.bio" class="profile-bio">{{ profile.bio }}</text>
        </view>
        <view class="profile-post-count">
          <text class="count-num">{{ authorPosts.length }}</text>
          <text class="count-label">条资讯</text>
        </view>
      </view>
    </view>

    <!-- TA 发布的资讯流 -->
    <view v-if="authorPosts.length" class="posts-stream">
      <PostCard v-for="p in authorPosts" :key="p.id" :post="p" />
    </view>

    <view v-else class="empty-feed-card">
      <text class="empty-icon">📭</text>
      <text class="empty-title">TA 还没有发布过资讯</text>
      <text class="empty-desc">去资讯流看看其他星友的分享吧！</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appState } from '../../store/community.js';
import PostCard from '../../components/PostCard.vue';

const profileName = ref('');

const roleLabelMap = {
  founder: '星主',
  partner: '合伙人',
  vip: '会员',
  member: '星友',
  guest: '嘉宾'
};

// 按姓名解析用户：帖子作者 → 评论作者 → 成员名录 → 兜底（对齐 PC 端 activeProfileUser）
const profile = computed(() => {
  const name = profileName.value;
  if (!name) return null;
  const authorPost = appState.posts.find(p => p.author.name === name);
  if (authorPost) {
    return { name, avatar: authorPost.author.avatar || '', role: authorPost.author.role || 'member', roleTitle: authorPost.author.roleTitle || '', bio: authorPost.author.bio || '' };
  }
  for (const p of appState.posts) {
    const c = (p.comments || []).find(c => c.author && c.author.name === name);
    if (c) {
      return { name, avatar: c.author.avatar || '', role: c.author.role || 'member', roleTitle: '', bio: '' };
    }
  }
  const m = appState.members.find(m => m.name === name);
  if (m) {
    return { name: m.name, avatar: m.avatar, role: m.role, roleTitle: m.roleTitle || '', bio: m.bio || '' };
  }
  return { name, avatar: '', role: 'member', roleTitle: '', bio: '' };
});

const authorPosts = computed(() => {
  if (!profileName.value) return [];
  return appState.posts.filter(p => p.author.name === profileName.value);
});

onLoad((query) => {
  if (query && query.name) {
    profileName.value = decodeURIComponent(query.name);
  }
});
</script>

<style scoped>
.member-profile-page {
  min-height: 100vh;
  padding: 12px 14px 24px;
  box-sizing: border-box;
}

/* 用户资料卡 */
.profile-header-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
}

.profile-user-block {
  display: flex;
  align-items: center;
  gap: 13px;
}

.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #f1f5f9;
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
  gap: 7px;
  flex-wrap: wrap;
}

.profile-name {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
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
  display: block;
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.5;
  margin-top: 5px;
}

.profile-post-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding: 0 4px;
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

/* 资讯流 */
.posts-stream {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 空状态 */
.empty-feed-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.empty-desc {
  font-size: 12.5px;
  color: #64748b;
  margin-top: 6px;
}
</style>
