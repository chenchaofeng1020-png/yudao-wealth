<template>
  <!-- 文档类型图标：彩色纸张 + 折角 + 类型缩写（PDF/DOC/XLS/PPT/TXT/MD） -->
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

<script setup lang="ts">
import { computed } from 'vue';
import { fileTypeBadge } from '@/utils/fileType';

const props = withDefaults(defineProps<{
  name: string;
  size?: number;
}>(), { size: 18 });

const badge = computed(() => fileTypeBadge(props.name));
// 三字缩写（PDF/DOC/XLS/PPT）用小字号，一到两字用大字号
const textSize = computed(() => (badge.value.label.length >= 3 ? 6.4 : 8.5));
</script>
