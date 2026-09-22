<template>
  <div v-if="appState.isPublishModalOpen" class="modal-backdrop" @click.self="appState.isPublishModalOpen = false">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">发布星球新主题</h3>
        <button class="modal-close-btn" @click="appState.isPublishModalOpen = false">×</button>
      </div>

      <div class="modal-body">
        <PostEditor />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appState } from '@/stores/community';
import PostEditor from '../community/PostEditor.vue';
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.modal-dialog {
  width: 640px;
  background: #ffffff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-navy);
}

.modal-close-btn {
  background: transparent;
  font-size: 20px;
  color: var(--text-muted);
}

.modal-body {
  padding: 20px;
}
</style>
