<template>
  <div v-if="appState.isAskModalOpen" class="ask-modal-backdrop" @click.self="actions.closeAskModal">
    <div class="ask-modal-card animate-scale-up" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="ask-modal-header">
        <div class="ask-header-info">
          <img v-if="appState.askTargetAvatar" :src="appState.askTargetAvatar" class="ask-user-avatar" :alt="appState.askTargetName" />
          <div class="ask-title-group">
            <h3 class="ask-modal-title">向 {{ appState.askTargetName }} 提问</h3>
          </div>
        </div>
        <button class="ask-close-btn" @click="actions.closeAskModal" title="关闭 (Esc)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Editor：复用发布编辑器（提问模式） -->
      <div class="ask-editor-area">
        <PostEditor :ask-target="appState.askTargetName" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { appState, actions } from '@/stores/community';
import PostEditor from '@/components/community/PostEditor.vue';

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && appState.isAskModalOpen) {
    actions.closeAskModal();
  }
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onBeforeUnmount(() => document.removeEventListener('keydown', onKeyDown));
</script>

<style scoped>
.ask-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.ask-modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  padding: 20px 22px;
  max-height: 85vh;
  overflow-y: auto;
}

.ask-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.ask-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ask-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #e2e8f0;
}

.ask-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ask-modal-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
  margin: 0;
}

.ask-close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ask-close-btn:hover {
  background: #f1f5f9;
  color: var(--primary-navy);
}

.ask-editor-area :deep(.editor-box-card) {
  border: none;
  box-shadow: none;
  padding: 0;
  background: transparent;
}
</style>
