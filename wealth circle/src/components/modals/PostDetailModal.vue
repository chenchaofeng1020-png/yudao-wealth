<template>
  <div v-if="appState.isPostDetailModalOpen && detailPost" class="post-detail-backdrop" @click.self="actions.closePostDetail">
    <div class="post-detail-card animate-scale-up" role="dialog" aria-modal="true">
      <!-- Modal Header -->
      <div class="detail-header">
        <h3 class="detail-title">主题详情</h3>
        <button class="modal-close-btn" @click="actions.closePostDetail" title="关闭弹窗 (Esc)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Post Full Content (reuse PostCard) -->
      <div class="detail-scroll-body">
        <PostCard :post="detailPost" :show-detail-link="false" :hide-expand="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { appState, actions } from '@/stores/community';
import PostCard from '../community/PostCard.vue';

const detailPost = computed(() => {
  if (!appState.detailPostId) return null;
  return appState.posts.find(p => p.id === appState.detailPostId) || null;
});

// Handle ESC key to close modal
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && appState.isPostDetailModalOpen) {
    actions.closePostDetail();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<style scoped>
.post-detail-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.post-detail-card {
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: var(--radius-card);
  border: 1px solid var(--border-light);
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
}

/* Header */
.detail-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.detail-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-navy);
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
  color: var(--primary-navy);
}

/* Scroll Body */
.detail-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.detail-scroll-body :deep(.post-card) {
  border: none;
  padding: 0;
  margin-bottom: 0;
}
</style>
