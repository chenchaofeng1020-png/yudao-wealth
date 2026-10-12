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
        点击发表资讯...
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
            @input="onContentInput"
          ></textarea>
        </div>

        <!-- 附件预览：按选择顺序展示（图片缩略图 / 文档行），最多 9 个 -->
        <div v-if="attachments.length" class="attachments-area">
          <template v-for="(a, i) in attachments" :key="a.url">
            <div v-if="a.type === 'image'" class="img-preview-item">
              <img :src="a.url" class="img-preview" alt="附件图片" />
              <span class="img-remove" title="移除图片" @click.stop="removeAttachment(i)">×</span>
            </div>
            <div v-else class="file-row">
              <FileTypeIcon :name="a.name" :size="18" />
              <span class="file-row-name">{{ a.name }}</span>
              <span class="file-row-size">{{ formatSize(a.size) }}</span>
              <span class="file-remove" title="移除附件" @click.stop="removeAttachment(i)">×</span>
            </div>
          </template>
        </div>

        <!-- 隐藏的文件选择入口：图片 / 文档附件 -->
        <input ref="imageInputRef" type="file" accept="image/*" multiple hidden @change="onImagesPicked" />
        <input ref="fileInputRef" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md" multiple hidden @change="onFilesPicked" />
      </div>
    </div>

    <!-- 提问模式公开提示 -->
    <p v-if="isAskMode" class="ask-public-hint">提交后问题将公开显示在星球内，TA 将在星球内回复。</p>

    <!-- Bottom Toolbar -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <!-- Emoji Button：弹出表情面板，点选插入光标处 -->
        <div class="emoji-menu-wrap">
          <button class="tool-icon-btn" :class="{ 'is-active': showEmojiPanel }" title="插入表情" @click.stop="toggleEmojiPanel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
          <!-- 表情面板 -->
          <div v-if="showEmojiPanel" class="emoji-panel" @click.stop>
            <button v-for="e in EMOJIS" :key="e" class="emoji-item" type="button" @click="insertEmoji(e)">{{ e }}</button>
          </div>
        </div>

        <!-- Picture Button：选择本地图片（可多选） -->
        <button class="tool-icon-btn" title="插入图片" @click="pickImages">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>

        <!-- Document Button：选择文档附件（pdf/doc/xls/ppt/txt 等） -->
        <button class="tool-icon-btn" title="添加文档附件" @click="pickFiles">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </button>

        <!-- Bold Button -->
        <button class="tool-icon-btn bold-btn" title="加粗文本" @click="handleBold">
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
import type { PostAttachment } from '@/types';
import FileTypeIcon from '@/components/common/FileTypeIcon.vue';

// askTarget 传入时进入"提问模式"：作为向指定成员提问的编辑器复用
const props = defineProps<{ askTarget?: string }>();
const isAskMode = computed(() => !!props.askTarget);
const askPlaceholder = computed(() =>
  isAskMode.value ? '请输入提问内容' : '点击发表资讯…'
);

const isExpanded = ref(isAskMode.value);
const content = ref('');
const selectedTags = ref<string[]>([]);
// 附件（图片/文档混合，按选择顺序排列），最多 9 个
const MAX_ATTACHMENTS = 9;
const attachments = ref<PostAttachment[]>([]);
const isVipOnly = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const imageInputRef = ref<HTMLInputElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const expandEditor = () => {
  if (!isAskMode.value && appState.user.role === 'guest') {
    actions.requireVip('开通会员后即可发布资讯，与星友深度交流');
    return;
  }
  if (!isExpanded.value) {
    isExpanded.value = true;
    nextTick(() => {
      textareaRef.value?.focus();
    });
  }
};

// ===== 工具栏功能：表情面板 / 图片上传 / 文档附件 / 加粗 =====

// 常用表情（参考微信风格：表情 + 手势 + 常用物品）
const EMOJIS = [
  '😀','😁','😂','🤣','😊','😍','😘','😜','🤪','😝','😅','😆','😉','😋','😎','🤩',
  '🥳','😏','😌','🤗','🤔','🤨','😐','😑','🙄','😴','🤤','😪','😵','🤯','🥱','😔',
  '😥','😰','😭','😱','😤','😡','🤬','🥺','😢','🤒','🤕','🤑','🤠','😈','🤡','💀',
  '👍','👎','👌','✌️','🤝','🙏','💪','👏','🫶','🤙','👋','🫡','❤️','💔','💕','💖',
  '💯','🔥','⭐','✨','⚡','🎉','🎁','🌹','🥀','🍻','☕','🎂','🍎','🍉','🧧','💰',
  '📈','📉','💎','🚀','⏰','📝','📌','💡','🔔','🍀','🐯','🐷','🦊','🐼','🐧','🦅',
];

const showEmojiPanel = ref(false);

const toggleEmojiPanel = () => {
  isExpanded.value = true;
  showEmojiPanel.value = !showEmojiPanel.value;
  if (showEmojiPanel.value) showTagMenu.value = false;
};

// 点选表情：插入正文光标处并收起面板
const insertEmoji = (e: string) => {
  insertAtCursor(e);
  showEmojiPanel.value = false;
  textareaRef.value?.focus();
};

// 图片上传：多选，生成预览缩略图
const pickImages = () => {
  if (attachments.value.length >= MAX_ATTACHMENTS) {
    actions.showToast(`最多上传 ${MAX_ATTACHMENTS} 个附件（含图片和文档）`);
    return;
  }
  isExpanded.value = true;
  imageInputRef.value?.click();
};

const onImagesPicked = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  addAttachments(files.map(f => ({ type: 'image' as const, name: f.name, url: URL.createObjectURL(f), size: f.size })));
  input.value = '';
};

// 文档附件上传：pdf / doc / xls / ppt / txt 等常见格式
const pickFiles = () => {
  if (attachments.value.length >= MAX_ATTACHMENTS) {
    actions.showToast(`最多上传 ${MAX_ATTACHMENTS} 个附件（含图片和文档）`);
    return;
  }
  isExpanded.value = true;
  fileInputRef.value?.click();
};

const onFilesPicked = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  addAttachments(files.map(f => ({ type: 'file' as const, name: f.name, url: URL.createObjectURL(f), size: f.size })));
  input.value = '';
};

// 追加附件：超出上限时截断并提示
const addAttachments = (items: PostAttachment[]) => {
  const remaining = MAX_ATTACHMENTS - attachments.value.length;
  if (remaining <= 0) {
    items.forEach(a => URL.revokeObjectURL(a.url));
    actions.showToast(`最多上传 ${MAX_ATTACHMENTS} 个附件（含图片和文档）`);
    return;
  }
  if (items.length > remaining) {
    items.slice(remaining).forEach(a => URL.revokeObjectURL(a.url));
    actions.showToast(`最多上传 ${MAX_ATTACHMENTS} 个附件，已保留前 ${MAX_ATTACHMENTS} 个`);
  }
  attachments.value.push(...items.slice(0, remaining));
};

const removeAttachment = (idx: number) => {
  URL.revokeObjectURL(attachments.value[idx].url);
  attachments.value.splice(idx, 1);
};

// 附件大小格式化
const formatSize = (size: number) =>
  size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;

// 加粗：在光标处插入 Markdown 加粗示例
const handleBold = () => {
  isExpanded.value = true;
  nextTick(() => {
    insertAtCursor(' **重点内容** ');
    textareaRef.value?.focus();
  });
};

// 输入 # 时自动展开标签选择菜单
const onContentInput = () => {
  const el = textareaRef.value;
  if (!el) return;
  const pos = el.selectionStart ?? 0;
  if (pos > 0 && content.value[pos - 1] === '#') {
    showTagMenu.value = true;
    showEmojiPanel.value = false;
  }
};

// ===== 分类选择菜单 =====
const showTagMenu = ref(false);

const toggleTagMenu = () => {
  isExpanded.value = true;
  showTagMenu.value = !showTagMenu.value;
  if (showTagMenu.value) showEmojiPanel.value = false;
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

// #标签蓝色高亮层：仅当 # 后的内容能匹配到有效标签（与标签菜单可选项一致）才显示蓝色，否则按普通文本
const highlightRef = ref<HTMLDivElement | null>(null);
const VALID_TAGS = new Set(CATEGORIES.flatMap(cat => cat.children));
const highlightSegments = computed(() =>
  content.value
    .split(/(#[^\s#]+)/g)
    .filter(p => p !== '')
    .map(p => ({ text: p, tag: p.startsWith('#') && VALID_TAGS.has(p.slice(1)) }))
);
const syncHighlightScroll = () => {
  if (highlightRef.value && textareaRef.value) {
    highlightRef.value.scrollTop = textareaRef.value.scrollTop;
  }
};

const closeTagMenu = () => {
  showTagMenu.value = false;
};

const onDocClick = () => {
  closeTagMenu();
  showEmojiPanel.value = false;
};
const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeTagMenu();
    showEmojiPanel.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onDocKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onDocKeydown);
});

// 重置编辑器（不回收附件预览地址）：发布成功后使用，帖子仍引用这些 blob 地址
const resetEditor = () => {
  isExpanded.value = isAskMode.value;
  content.value = '';
  selectedTags.value = [];
  attachments.value = [];
  isVipOnly.value = false;
  showTagMenu.value = false;
  showEmojiPanel.value = false;
};

const cancelEdit = () => {
  // 取消/收起：附件不会被发布，回收预览地址
  attachments.value.forEach(a => URL.revokeObjectURL(a.url));
  resetEditor();
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
    actions.requireVip('开通会员后即可发布资讯，与星友深度交流');
    return;
  }

  const vipOnly = isVipOnly.value;
  actions.publishPost({
    title: '',
    content: content.value.trim(),
    tags: selectedTags.value.length ? [...selectedTags.value] : ['市场资讯'],
    stocks: [],
    isVipOnly: vipOnly,
    attachments: attachments.value.length ? attachments.value.map(a => ({ ...a })) : undefined,
  });

  // 发布成功：只重置编辑器，不回收附件地址（信息流帖子仍引用）
  resetEditor();
  actions.showToast(vipOnly ? '资讯发表成功！本条资讯已设为仅会员可见' : '资讯发表成功！');
};
</script>

<style scoped>
.editor-box-card {
  background: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 6px;
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
  min-height: 180px;
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
  resize: none;
  height: 200px;
  outline: none;
}

.content-textarea::placeholder {
  color: #94a3b8;
}

.content-textarea:focus {
  border: none;
  box-shadow: none;
}

/* ===== 附件预览：按选择顺序展示（图片缩略图 / 文档行） ===== */
.attachments-area {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
}

/* 文档行独占一行，flex-wrap 保证与图片按选择顺序上下排列 */
.attachments-area .file-row {
  flex: 1 1 100%;
}

.img-preview-item {
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.55);
  color: #fff;
  font-size: 13px;
  line-height: 17px;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s;
}

.img-remove:hover {
  background: rgba(15, 23, 42, 0.75);
}

.file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 7px 10px;
}

.file-row-name {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-row-size {
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
}

.file-remove {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;
}

.file-remove:hover {
  background: #f1f5f9;
  color: #ef4444;
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

/* 工具按钮激活态（表情面板/标签菜单展开时） */
.tool-icon-btn.is-active {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.08);
}

/* ===== 表情面板 ===== */
.emoji-menu-wrap {
  position: relative;
}

.emoji-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: -6px;
  z-index: 60;
  width: 328px;
  max-height: 240px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
}

.emoji-item {
  border: none;
  background: none;
  font-size: 20px;
  line-height: 1;
  padding: 5px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s;
}

.emoji-item:hover {
  background: #f1f5f9;
}

/* ===== 分类选择菜单 ===== */
.hash-menu-wrap {
  position: relative;
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

/* 提问模式公开提示 */
.ask-public-hint {
  margin: 0 2px 8px;
  font-size: 12px;
  color: #94a3b8;
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
