<template>
  <div class="editor-box-card">
    <!-- Top Input Box (Light gray box matching screenshot) -->
    <div 
      class="editor-input-box" 
      :class="{ expanded: isExpanded }"
      @click="expandEditor"
    >
      <img :src="appState.user.avatar" class="editor-avatar" alt="Avatar" />
      
      <!-- Collapsed placeholder -->
      <div v-if="!isExpanded" class="placeholder-text">
        点击发表主题...
      </div>

      <!-- Expanded editing area -->
      <div v-else class="expanded-form" @click.stop>
        <div class="content-textarea-wrap">
          <!-- 高亮层：#标签 显示为蓝色 -->
          <div ref="highlightRef" class="content-highlight" aria-hidden="true"><template v-for="(seg, i) in highlightSegments" :key="i"><span v-if="seg.tag" class="hl-tag">{{ seg.text }}</span><template v-else>{{ seg.text }}</template></template></div>
          <textarea
            v-model="content"
            :placeholder="askPlaceholder"
            rows="3"
            class="content-textarea"
            ref="textareaRef"
            @scroll="syncHighlightScroll"
          ></textarea>
        </div>

        <!-- Attached Image Preview -->
        <div v-if="attachedImage" class="attachments-row">
          <span class="img-chip" @click.stop="attachedImage = ''">
            🖼️ 已附图片 ×
          </span>
        </div>
      </div>
    </div>

    <!-- Bottom Toolbar -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <!-- Emoji Button -->
        <button class="tool-icon-btn" title="插入表情" @click="handleToolClick('emoji')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </button>

        <!-- Picture Button -->
        <button class="tool-icon-btn" title="插入图片" @click="handleToolClick('image')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>

        <!-- Document Button -->
        <button class="tool-icon-btn" title="添加文档附件" @click="handleToolClick('doc')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </button>

        <!-- Bold Button -->
        <button class="tool-icon-btn bold-btn" title="加粗文本" @click="handleToolClick('bold')">
          <span class="bold-text-icon">B</span>
        </button>

        <!-- Hash Tag Button：点击弹出分类选择菜单 -->
        <div class="hash-menu-wrap">
          <button class="tool-icon-btn hash-btn" :class="{ 'is-active': showTagMenu }" title="添加标签" @click.stop="toggleTagMenu">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="20" y2="15"></line>
              <line x1="10" y1="3" x2="8" y2="21"></line>
              <line x1="16" y1="3" x2="14" y2="21"></line>
            </svg>
          </button>

          <!-- 分类选择菜单（数据与后台「分类设置」一致） -->
          <div v-if="showTagMenu" class="tag-menu" @click.stop>
            <div v-for="cat in CATEGORIES" :key="cat.name" class="tag-menu-group">
              <div class="tag-menu-parent">{{ cat.name }}</div>
              <div class="tag-menu-children">
                <button
                  v-for="child in cat.children"
                  :key="child"
                  class="tag-menu-item"
                  :class="{ active: selectedTags.includes(child) }"
                  @click="pickTag(child)"
                >
                  # {{ child }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Action Controls (Visible when expanded) -->
      <div v-if="isExpanded" class="toolbar-right">
        <button class="btn-cancel" @click="cancelEdit">
          取消
        </button>
        <button 
          class="btn-publish" 
          :disabled="!content.trim()"
          @click="handlePublish"
        >
          发布
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { appState, actions } from '@/stores/community';
import { CATEGORIES } from '@/mock/data';
import feedChart from '@/assets/feed_chart.png';

// askTarget 传入时进入"提问模式"：作为向指定成员提问的编辑器复用
const props = defineProps<{ askTarget?: string }>();
const isAskMode = computed(() => !!props.askTarget);
const askPlaceholder = computed(() =>
  isAskMode.value ? '请输入提问内容' : '分享你的宏观洞察、研报思考或投资见解... 支持 #标签 和 Markdown **加粗**'
);

const isExpanded = ref(isAskMode.value);
const content = ref('');
const selectedTags = ref<string[]>([]);
const attachedImage = ref('');
const isVipOnly = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const expandEditor = () => {
  if (!isAskMode.value && appState.user.role === 'guest') {
    actions.requireVip('开通会员后即可发布主题，与星友深度交流');
    return;
  }
  if (!isExpanded.value) {
    isExpanded.value = true;
    nextTick(() => {
      textareaRef.value?.focus();
    });
  }
};

const handleToolClick = (tool: 'emoji' | 'image' | 'doc' | 'bold' | 'hash') => {
  isExpanded.value = true;
  nextTick(() => {
    if (tool === 'emoji') {
      content.value += ' 😊 ';
      textareaRef.value?.focus();
    } else if (tool === 'image') {
      attachedImage.value = feedChart;
      actions.showToast('已添加示例图表附件');
      textareaRef.value?.focus();
    } else if (tool === 'doc') {
      actions.showToast('支持上传 PDF / Word 等研究文件');
    } else if (tool === 'bold') {
      content.value += ' **重点内容** ';
      textareaRef.value?.focus();
    }
  });
};

// ===== 分类选择菜单 =====
const showTagMenu = ref(false);

const toggleTagMenu = () => {
  isExpanded.value = true;
  showTagMenu.value = !showTagMenu.value;
  if (showTagMenu.value) {
    nextTick(() => textareaRef.value?.focus());
  }
};

// 将文本插入正文输入框光标处
const insertAtCursor = (text: string) => {
  const el = textareaRef.value;
  if (!el) {
    content.value += text;
    return;
  }
  const start = el.selectionStart ?? content.value.length;
  const end = el.selectionEnd ?? start;
  content.value = content.value.slice(0, start) + text + content.value.slice(end);
  nextTick(() => {
    el.focus();
    const pos = start + text.length;
    el.setSelectionRange(pos, pos);
  });
};

// 点选二级标签：插入正文光标处（与前文自动补空格）；再次点选则从正文移除
const pickTag = (tag: string) => {
  const idx = selectedTags.value.indexOf(tag);
  if (idx === -1) {
    selectedTags.value.push(tag);
    const el = textareaRef.value;
    const before = el ? content.value.slice(0, el.selectionStart ?? content.value.length) : content.value;
    const needsSpace = before.length > 0 && !/\s$/.test(before);
    insertAtCursor(`${needsSpace ? ' ' : ''}#${tag} `);
  } else {
    selectedTags.value.splice(idx, 1);
    content.value = content.value.replace(new RegExp(`\\s?#${tag}(\\s)?`), '');
  }
  textareaRef.value?.focus();
};

// #标签蓝色高亮层
const highlightRef = ref<HTMLDivElement | null>(null);
const highlightSegments = computed(() =>
  content.value
    .split(/(#[^\s#]+)/g)
    .filter(p => p !== '')
    .map(p => ({ text: p, tag: p.startsWith('#') }))
);
const syncHighlightScroll = () => {
  if (highlightRef.value && textareaRef.value) {
    highlightRef.value.scrollTop = textareaRef.value.scrollTop;
  }
};

const closeTagMenu = () => {
  showTagMenu.value = false;
};

const onDocClick = () => closeTagMenu();
const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeTagMenu();
};

onMounted(() => {
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onDocKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onDocKeydown);
});

const cancelEdit = () => {
  isExpanded.value = false;
  content.value = '';
  selectedTags.value = [];
  attachedImage.value = '';
  isVipOnly.value = false;
  showTagMenu.value = false;
};

const handlePublish = () => {
  const text = content.value.trim();
  if (!text) return;

  // 提问模式：提交给指定成员
  if (isAskMode.value) {
    actions.submitAskQuestion(props.askTarget!, text);
    cancelEdit();
    isExpanded.value = true;
    return;
  }

  if (appState.user.role === 'guest') {
    actions.requireVip('开通会员后即可发布主题，与星友深度交流');
    return;
  }

  const vipOnly = isVipOnly.value;
  actions.publishPost({
    title: '',
    content: content.value.trim(),
    tags: selectedTags.value.length ? [...selectedTags.value] : ['市场资讯'],
    stocks: [],
    isVipOnly: vipOnly,
  });

  cancelEdit();
  actions.showToast(vipOnly ? '主题发表成功！本主题已设为仅会员可见' : '主题发表成功！');
};
</script>

<style scoped>
.editor-box-card {
  background: #ffffff;
  border: 1px solid #eaedf1;
  border-radius: var(--radius-card);
  padding: 12px 16px;
  margin-bottom: 12px;
  box-shadow: none;
}

/* Gray input container matching screenshot */
.editor-input-box {
  background: #f4f5f7;
  border-radius: 6px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  min-height: 52px;
  transition: background 0.15s ease, min-height 0.2s ease;
}

.editor-input-box:hover {
  background: #eff1f5;
}

.editor-input-box.expanded {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: default;
  align-items: stretch;
  min-height: 128px;
  padding-bottom: 3px;
}

.editor-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.placeholder-text {
  font-size: 14px;
  color: #8c939d;
  user-select: none;
}

/* Expanded editing form */
.expanded-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.content-textarea-wrap {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 高亮层：与输入框同样式，#标签渲染为蓝色 */
.content-highlight {
  position: absolute;
  inset: 0;
  padding: 4px 0;
  font-family: inherit;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  pointer-events: none;
}

.hl-tag {
  color: #0284c7;
}

.content-textarea {
  position: relative;
  width: 100%;
  border: none;
  background: transparent;
  padding: 4px 0;
  font-family: inherit;
  font-size: 14px;
  color: transparent;
  caret-color: #1e293b;
  line-height: 1.6;
  resize: vertical;
  min-height: 70px;
  flex: 1;
  outline: none;
}

.content-textarea::placeholder {
  color: #94a3b8;
}

.content-textarea:focus {
  border: none;
  box-shadow: none;
}

.attachments-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.img-chip {
  font-size: 12px;
  background: #f1f5f9;
  color: #475569;
  padding: 2px 8px;
  border-radius: 12px;
  cursor: pointer;
}

/* Bottom Toolbar */
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 2px 4px 0 4px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tool-icon-btn {
  background: none;
  border: none;
  color: #64748b;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s;
}

.tool-icon-btn:hover {
  color: #1e293b;
  background-color: #f1f5f9;
}

/* ===== 分类选择菜单 ===== */
.hash-menu-wrap {
  position: relative;
}

.hash-btn.is-active {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.08);
}

.tag-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: -8px;
  z-index: 60;
  width: 340px;
  max-height: 320px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  padding: 14px 16px 2px;
}

.tag-menu-group {
  margin-bottom: 10px;
}

.tag-menu-parent {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag-menu-parent::before {
  content: '';
  width: 3px;
  height: 12px;
  border-radius: 2px;
  background: #16a34a;
}

.tag-menu-children {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-menu-item {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s;
}

.tag-menu-item:hover {
  border-color: #16a34a;
  color: #16a34a;
}

.tag-menu-item.active {
  background: rgba(22, 163, 74, 0.1);
  border-color: #16a34a;
  color: #16a34a;
  font-weight: 600;
}

.bold-text-icon {
  font-family: Georgia, serif;
  font-weight: 800;
  font-size: 17px;
  line-height: 1;
  color: #64748b;
}

.tool-icon-btn:hover .bold-text-icon {
  color: #1e293b;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background: none;
  border: 1px solid #cbd5e1;
  color: #64748b;
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-vip-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid #fcd34d;
  color: #b45309;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-vip-toggle.active {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #78350f;
  font-weight: 700;
}

.btn-vip-toggle:hover {
  background: #fef3c7;
}

.btn-cancel:hover {
  background: #f8fafc;
  color: #334155;
}

.btn-publish {
  background: var(--brand-green);
  border: none;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-publish:hover:not(:disabled) {
  background: #059669;
}

.btn-publish:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
