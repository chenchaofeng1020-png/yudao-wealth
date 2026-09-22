<template>
  <div class="feed-view-wrap">
    <!-- Inline Publisher Box -->
    <PostEditor />

    <!-- 3. Filter Tabs Bar -->
    <div class="feed-tabs-bar">
      <button 
        :class="['tab-pill', { active: appState.feedFilter === 'latest' }]"
        @click="actions.setFeedFilter('latest')"
      >
        最新
      </button>
      <button 
        :class="['tab-pill', { active: appState.feedFilter === 'trade_track' }]"
        @click="actions.setFeedFilter('trade_track')"
      >
        交易追踪
      </button>
      <button 
        :class="['tab-pill', { active: appState.feedFilter === 'market_news' }]"
        @click="actions.setFeedFilter('market_news')"
      >
        市场资讯
      </button>
      <button 
        :class="['tab-pill', { active: appState.feedFilter === 'wealth_news' }]"
        @click="actions.setFeedFilter('wealth_news')"
      >
        理财资讯
        <span class="tab-badge-dot"></span>
      </button>
      <button 
        :class="['tab-pill', { active: appState.feedFilter === 'topic_research' }]"
        @click="actions.setFeedFilter('topic_research')"
      >
        话题研究
      </button>
    </div>

    <!-- 4. Pinned Notices Card -->
    <div class="pinned-notices-card">
      <!-- Notice 1 -->
      <div class="notice-row" @click="actions.showToast('正在打开9.17会员直播复盘...')">
        <span class="pin-tag">置顶</span>
        <span class="notice-text">
          【📣9.17会员直播｜加息如期兑现，AI放缓如期放鸽】本期直播将为大家带来：• 近期市况点评与分析 • 宏...
        </span>
      </div>

      <!-- Notice 2 -->
      <div class="notice-row">
        <span class="pin-tag">置顶</span>
        <div class="notice-text">
          「图片」【🧧新人必看】点击链接了解→
          <a class="notice-blue-link" href="javascript:;" @click.stop="actions.showToast('正在打开【财不外露】知识星球全景介绍...')">
            🔗【财不外露】知识星球全景介绍
          </a>
          <span class="link-arrow"> → </span>
          <a class="notice-blue-link" href="javascript:;" @click.stop="actions.showToast('正在打开【财不外露】星球新手使...')">
            🔗【财不外露】星球新手使...
          </a>
        </div>
      </div>

      <!-- Notice 3 -->
      <div class="notice-row">
        <span class="pin-tag">置顶</span>
        <div class="notice-text">
          「图片」【🌟财不外露星球组合】 📌 组合完整介绍：点击查看→
          <a class="notice-blue-link" href="javascript:;" @click.stop="actions.showToast('正在打开【星球组合】财不外露星球组合全拆解...')">
            🔗【星球组合】财不外露星球组合全拆解...
          </a>
        </div>
      </div>
    </div>

    <!-- 5. Posts Feed Stream -->
    <div v-if="displayedPosts.length" class="posts-stream">
      <PostCard 
        v-for="post in displayedPosts" 
        :key="post.id" 
        :post="post" 
      />
    </div>

    <div v-else class="empty-feed-card">
      <div class="empty-icon">📭</div>
      <div class="empty-title">当前分类下暂无动态</div>
      <p class="empty-desc">尝试切换其他分类或发布你的第一篇理财思考！</p>
      <button class="btn-primary" @click="actions.setFeedFilter('latest'); searchQuery = ''">
        返回全部动态
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appState, actions, filteredPosts } from '@/stores/community';
import PostEditor from './PostEditor.vue';
import PostCard from './PostCard.vue';

const displayedPosts = filteredPosts;
</script>

<style scoped>
.feed-view-wrap {
  width: 100%;
}

/* 3. Filter Tabs Bar */
.feed-tabs-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border-radius: var(--radius-card);
  padding: 0;
  margin-bottom: 12px;
  box-shadow: none;
  flex-wrap: wrap;
}

.tab-pill {
  position: relative;
  background: #f4f5f7;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease;
}

.tab-pill:hover {
  background: #e9ecf0;
  color: #0f172a;
}

.tab-pill.active {
  background: #2c323f;
  color: #ffffff;
  font-weight: 600;
}

.tab-badge-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  background-color: #ef4444;
  border-radius: 50%;
}

.diamond-icon {
  font-size: 11px;
}

/* 4. Pinned Notices Card */
.pinned-notices-card {
  background: #ffffff;
  border: 1px solid #eaedf1;
  border-radius: var(--radius-card);
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notice-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  line-height: 1.5;
  cursor: pointer;
}

.pin-tag {
  color: #10b981;
  border: 1px solid #10b981;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  padding: 1px 5px;
  line-height: 1.2;
  flex-shrink: 0;
}

.notice-text {
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-row:hover .notice-text {
  color: #0f172a;
}

.notice-blue-link {
  color: #0284c7;
  text-decoration: none;
  cursor: pointer;
}

.notice-blue-link:hover {
  text-decoration: underline;
}

.link-arrow {
  color: #64748b;
  margin: 0 2px;
}

/* 5. Posts Feed Stream */
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
  box-shadow: none;
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
