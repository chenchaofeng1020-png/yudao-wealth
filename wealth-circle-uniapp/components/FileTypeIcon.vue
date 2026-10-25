<template>
  <!-- 文档类型图标：彩色纸张 + 折角 + 类型缩写（与 PC 端 FileTypeIcon 一致） -->
  <svg :width="size" :height="size" viewBox="0 0 24 24" class="file-type-icon" aria-hidden="true">
    <path d="M7 1h8l6 6v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" :fill="badge.color" />
    <path d="M15 1l6 6h-4.5A1.5 1.5 0 0 1 15 5.5V1z" fill="#ffffff" opacity="0.4" />
    <text
      x="12.2"
      y="16"
      text-anchor="middle"
      :font-size="textSize"
      font-weight="700"
      fill="#ffffff"
      font-family="Arial, Helvetica, sans-serif"
    >{{ badge.label }}</text>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

// 常见文档类型徽标：PDF 红 / DOC 蓝 / XLS 绿 / PPT 橙 / TXT 灰 / MD 紫，未知类型灰色 FILE
const BADGE_MAP = {
  PDF: { label: 'PDF', color: '#e2574c' },
  DOC: { label: 'DOC', color: '#2f6fe4' },
  DOCX: { label: 'DOC', color: '#2f6fe4' },
  XLS: { label: 'XLS', color: '#1f9d55' },
  XLSX: { label: 'XLS', color: '#1f9d55' },
  CSV: { label: 'CSV', color: '#1f9d55' },
  PPT: { label: 'PPT', color: '#f0731f' },
  PPTX: { label: 'PPT', color: '#f0731f' },
  TXT: { label: 'TXT', color: '#64748b' },
  MD: { label: 'MD', color: '#8b5cf6' },
};

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: Number, default: 28 }
});

const badge = computed(() => {
  const ext = ((props.name || '').split('.').pop() || '').toUpperCase();
  return BADGE_MAP[ext] || { label: 'FILE', color: '#64748b' };
});

// 三字缩写（PDF/DOC/XLS/PPT）用小字号，一到两字用大字号
const textSize = computed(() => (badge.value.label.length >= 3 ? 6.4 : 8.5));
</script>

<style scoped>
.file-type-icon {
  flex-shrink: 0;
}
</style>
