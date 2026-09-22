<template>
  <transition name="cms-toast-fade">
    <div v-if="appState.toastMessage" class="cms-global-toast">
      <div class="cms-toast-indicator"></div>
      <span>{{ appState.toastMessage }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { appState } from './store'

defineOptions({ name: 'CmsClientToast' })
</script>

<style scoped>
/* CMS 演示模块全局操作提示（供专栏/直播/课程/资讯管理页共用） */
.cms-global-toast {
  position: fixed;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.25);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  z-index: 9999;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.cms-toast-indicator {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
}

.cms-toast-fade-enter-active,
.cms-toast-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.cms-toast-fade-enter-from,
.cms-toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 14px);
}
</style>
