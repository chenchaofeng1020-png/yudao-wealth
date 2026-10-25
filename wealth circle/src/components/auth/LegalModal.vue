<template>
  <div v-if="appState.isLegalModalOpen && doc" class="legal-modal-backdrop" @click.self="close">
    <div class="legal-dialog animate-fade-in">
      <div class="legal-header">
        <h3 class="legal-title">{{ doc.title }}</h3>
        <button class="btn-close" @click="close" title="关闭">×</button>
      </div>
      <p class="legal-update-date">{{ doc.updateDate }}</p>
      <div class="legal-body">
        <section v-for="(sec, i) in doc.sections" :key="i" class="legal-section">
          <h4 class="section-heading">{{ sec.heading }}</h4>
          <p v-for="(p, j) in sec.paras" :key="j" class="section-para">{{ p }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { appState, actions } from '@/stores/community';
import { legalDocs } from '@/mock/legal';

const doc = computed(() => (appState.legalModalType ? legalDocs[appState.legalModalType] : null));

const close = () => actions.closeLegal();
</script>

<style scoped>
.legal-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.legal-dialog {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 640px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 16px 24px;
  position: relative;
}

.legal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.legal-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
}

.btn-close {
  width: 32px;
  height: 32px;
  background: transparent;
  color: #64748b;
  font-size: 24px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  flex-shrink: 0;
}
.btn-close:hover {
  background: transparent;
  color: var(--primary-navy);
}

.legal-update-date {
  font-size: 11.5px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.legal-body {
  overflow-y: auto;
  min-height: 0;
  padding-right: 6px;
}

.legal-section {
  margin-bottom: 16px;
}

.section-heading {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--primary-navy);
  margin-bottom: 6px;
}

.section-para {
  font-size: 12.5px;
  color: #3c4250;
  line-height: 1.75;
  margin-bottom: 6px;
}
</style>
