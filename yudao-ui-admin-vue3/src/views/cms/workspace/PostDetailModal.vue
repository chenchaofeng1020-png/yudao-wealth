<template>
  <div class="post-detail-backdrop" @click.self="$emit('close')">
    <div class="post-detail-card animate-detail-up" role="dialog" aria-modal="true">
      <!-- Modal Header（与 C 端帖子详情一致） -->
      <div class="detail-header">
        <h3 class="detail-title">内容详情</h3>
        <button class="modal-close-btn" title="关闭弹窗 (Esc)" @click="$emit('close')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 正文滚动区（C 端 PostCard 展示样式，仅浏览不可交互） -->
      <div class="detail-scroll-body">
        <article class="post-card-view">
          <!-- Author Meta Row -->
          <div class="post-author-row">
            <div class="author-left">
              <img :src="post.author.avatar" class="author-avatar" alt="Avatar" />
              <div class="author-meta">
                <div class="name-row">
                  <span class="author-name">{{ post.author.name }}</span>
                  <span v-if="post.author.role === 'founder'" class="badge-founder">星主</span>
                  <span v-if="post.isVipOnly" class="badge-vip">🔒 会员独享</span>
                  <span v-if="post.status === 'offline'" class="badge-offline">已下架</span>
                </div>
                <span class="post-time">{{ post.createdAt }}</span>
              </div>
            </div>
          </div>

          <!-- Post Title Row -->
          <div v-if="post.title || (post.tags && post.tags.length)" class="post-title-row">
            <span v-for="tag in post.tags" :key="tag" class="title-tag">#{{ tag }}</span>
            <h3 v-if="post.title" class="post-title-text">{{ post.title }}</h3>
          </div>

          <!-- Post Content -->
          <div class="post-text">
            <p
              v-for="(paragraph, idx) in formattedParagraphs"
              :key="idx"
              class="content-p"
              v-html="formatMarkdown(paragraph)"
            ></p>
          </div>

          <!-- Stock Cards -->
          <div v-if="post.stocks && post.stocks.length" class="post-stocks-row">
            <div v-for="s in post.stocks" :key="s.code + s.name" class="stock-mini-card">
              <div class="stock-name">{{ s.name }}</div>
              <div class="stock-code">{{ s.code }}</div>
              <div :class="['stock-price', s.isUp ? 'is-up' : 'is-down']">{{ s.price }}</div>
              <div :class="['stock-change', s.isUp ? 'is-up' : 'is-down']">{{ s.change }}</div>
            </div>
          </div>

          <!-- Attached Images -->
          <div v-if="post.images && post.images.length" class="post-images-container">
            <div v-for="(img, idx) in post.images" :key="idx" class="chart-img-wrap">
              <img :src="img" class="feed-chart-img" alt="研究图表" />
            </div>
          </div>

          <!-- Topic Tags -->
          <div v-if="post.tags && post.tags.length" class="post-tags-pill-row">
            <span v-for="tag in post.tags" :key="tag" class="tag-pill-badge">{{ tag }}</span>
          </div>

          <!-- Read-only Action Bar（展示互动数据，不可操作） -->
          <div class="post-action-bar">
            <div class="action-bar-left">
              <span class="action-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
                {{ post.likes }}
              </span>
              <span class="action-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                {{ post.commentsCount }}
              </span>
              <span class="action-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                {{ post.sharesCount }}
              </span>
            </div>
          </div>

          <!-- Likers & Featured Comment -->
          <div v-if="(post.likers && post.likers.length) || post.featuredComment" class="post-feedback-box">
            <div v-if="post.likers && post.likers.length" class="likers-row">
              <span class="likers-list">
                <template v-for="(liker, idx) in post.likers" :key="liker">
                  <span class="liker-name">{{ liker }}</span>
                  <span v-if="idx < post.likers.length - 1" class="liker-sep">、</span>
                </template>
              </span>
              <span class="likers-count-suffix"> 等 {{ post.likersCount || post.likes }}人觉得很赞</span>
            </div>

            <div v-if="post.featuredComment" class="featured-comment-box">
              <div class="fc-text-line">
                <span class="fc-author">{{ post.featuredComment.author.name }}</span>
                <span class="fc-colon">：</span>
                <span class="fc-body">{{ post.featuredComment.content }}</span>
              </div>
              <div class="fc-meta-row">
                <span class="fc-time">{{ post.featuredComment.createdAt }}</span>
                <span class="fc-time">👍 {{ post.featuredComment.likes ?? 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Comments List（只读，无评论输入） -->
          <div class="comment-drawer">
            <div v-if="post.comments.length" class="comments-list">
              <div v-for="c in post.comments" :key="c.id" class="comment-item">
                <img v-if="c.author.avatar" :src="c.author.avatar" class="comment-avatar" alt="Avatar" />
                <div v-else class="comment-avatar comment-avatar-fallback">{{ c.author.name.slice(0, 1) }}</div>
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-name">{{ c.author.name }}</span>
                    <span class="comment-time">{{ c.createdAt }}</span>
                  </div>
                  <p class="comment-text">{{ c.content }}</p>
                  <div class="comment-likes">👍 {{ c.likes ?? 0 }}</div>
                </div>
              </div>
            </div>
            <div v-else class="empty-comments">暂无讨论</div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { Post } from '../../types'

const props = defineProps<{ post: Post }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const formattedParagraphs = computed(() => {
  return props.post.content.split('\n').filter(p => p.trim())
})

const formatMarkdown = (text: string) => {
  if (!text) return ''
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
/* 弹窗容器：与 C 端 PostDetailModal 一致 */
.post-detail-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.post-detail-card {
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eaedf1;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
}

.animate-detail-up {
  animation: detail-up 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes detail-up {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.detail-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eaedf1;
  flex-shrink: 0;
}

.detail-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.detail-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

/* ===== 以下为 C 端 PostCard 展示样式（只读版） ===== */
.post-card-view {
  background: #ffffff;
}

.post-author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.author-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.author-meta {
  display: flex;
  flex-direction: column;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.badge-founder {
  background: #fef3c7;
  color: #b45309;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.badge-vip {
  background: #ecfdf5;
  color: #059669;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.badge-offline {
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.post-time {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.post-title-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
  line-height: 1.5;
}

.title-tag {
  color: #0284c7;
  font-size: 15px;
  font-weight: 500;
}

.post-title-text {
  display: inline;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.post-text {
  font-size: 14px;
  color: #334155;
  line-height: 1.68;
}

.content-p {
  margin-bottom: 8px;
}

.post-text :deep(strong) {
  font-weight: 700;
  color: #0f172a;
}

/* Stock Cards */
.post-stocks-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.stock-mini-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 124px;
  background: #ffffff;
}

.stock-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.stock-code {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 2px;
}

.stock-price {
  font-size: 14px;
  font-weight: 700;
}

.stock-change {
  font-size: 12px;
  font-weight: 600;
}

.stock-price.is-up,
.stock-change.is-up {
  color: #dc2626;
}

.stock-price.is-down,
.stock-change.is-down {
  color: #059669;
}

.post-images-container {
  margin: 10px 0 14px 0;
}

.chart-img-wrap {
  display: inline-block;
  max-width: 520px;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.feed-chart-img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.post-tags-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 6px 0;
}

.tag-pill-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 4px;
  padding: 2px 8px;
}

/* Read-only Action Bar */
.post-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px dashed #e2e8f0;
}

.action-bar-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.action-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #64748b;
}

/* Likers & Featured Comment */
.post-feedback-box {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.likers-row {
  font-size: 13.5px;
  line-height: 1.6;
  color: #475569;
  word-break: break-all;
}

.likers-list .liker-name {
  color: #0284c7;
  font-weight: 500;
}

.liker-sep {
  color: #64748b;
}

.likers-count-suffix {
  color: #64748b;
  margin-left: 2px;
}

.featured-comment-box {
  background: #f8fafc;
  border-radius: 6px;
  padding: 10px 14px;
  border: 1px solid #f1f5f9;
}

.fc-text-line {
  font-size: 13.5px;
  line-height: 1.65;
  color: #334155;
}

.fc-author {
  font-weight: 700;
  color: #d97706;
}

.fc-colon {
  color: #475569;
}

.fc-body {
  color: #334155;
}

.fc-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.fc-time {
  font-size: 12px;
  color: #94a3b8;
}

/* Comments（只读） */
.comment-drawer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;
}

.comment-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-avatar-fallback {
  background: #ecfdf5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 2px;
}

.comment-name {
  font-weight: 600;
  color: #1e293b;
}

.comment-time {
  color: #94a3b8;
}

.comment-text {
  font-size: 13px;
  color: #334155;
  margin: 0;
}

.comment-likes {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.empty-comments {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  padding: 12px 0;
}
</style>
