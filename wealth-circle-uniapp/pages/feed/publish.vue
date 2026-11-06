<template>
  <view class="publish-page">
    <!-- 顶部状态栏固定遮罩 -->
    <view class="status-bar-cover"></view>

    <!-- 1. 顶部标题栏：取消 | 标题 | 发布 -->
    <view class="page-header">
      <view class="header-cancel-btn" @tap="handleCancel">
        <text class="header-cancel-text">取消</text>
      </view>
      <text class="header-title">{{ mode === 'question' ? '向TA提问' : '发动态' }}</text>
      <button class="btn-header-publish" :disabled="!content.trim()" @tap="handleSubmit">发布</button>
    </view>

    <!-- 2. 内容编辑区 -->
    <view class="publish-body">
      <!-- 提问对象：仅显示被提问人 -->
      <view v-if="mode === 'question'" class="target-select-row">
        <text class="target-label">提问对象：</text>
        <text class="target-chip selected">{{ selectedTarget }}</text>
      </view>

      <!-- 编辑区（灰底圆角容器） -->
      <view class="editor-box">
        <image :src="appState.user.avatar" class="editor-avatar" mode="aspectFill" />
        <view class="editor-form">
          <view class="content-textarea-wrap">
            <!-- 高亮层：#有效标签 显示为蓝色 -->
            <view ref="highlightRef" class="content-highlight" aria-hidden="true">
              <template v-for="(seg, i) in highlightSegments" :key="i">
                <text v-if="seg.tag" class="hl-tag">{{ seg.text }}</text>
                <template v-else>{{ seg.text }}</template>
              </template>
            </view>
            <textarea
              ref="textareaRef"
              v-model="content"
              class="content-textarea"
              :placeholder="mode === 'question' ? '请输入提问内容' : '点击发表主题…'"
              :maxlength="2000"
              @input="onContentInput"
              @scroll="syncHighlightScroll"
            />
          </view>

          <!-- 附件预览：按选择顺序展示（图片缩略图 / 文档行），最多 9 个 -->
          <view v-if="attachments.length" class="attachments-area">
            <template v-for="(a, i) in attachments" :key="a.url">
              <view v-if="a.type === 'image'" class="img-preview-item">
                <image :src="a.url" class="img-preview" mode="aspectFill" />
                <text class="img-remove" @tap.stop="removeAttachment(i)">×</text>
              </view>
              <view v-else class="file-row">
                <FileTypeIcon :name="a.name" :size="18" />
                <text class="file-row-name">{{ a.name }}</text>
                <text class="file-row-size">{{ formatSize(a.size) }}</text>
                <text class="file-remove" @tap.stop="removeAttachment(i)">×</text>
              </view>
            </template>
          </view>
        </view>
      </view>

      <!-- 提问模式公开提示 -->
      <text v-if="mode === 'question'" class="ask-public-hint">提交后问题将公开显示在星球内，TA 将在星球内回复。</text>
    </view>

    <!-- 表情面板（固定于工具栏上方） -->
    <scroll-view v-if="showEmojiPanel" class="emoji-panel" :scroll-y="true">
      <view class="emoji-grid">
        <text v-for="e in EMOJIS" :key="e" class="emoji-item" @tap="insertEmoji(e)">{{ e }}</text>
      </view>
    </scroll-view>

    <!-- #标签选择菜单（固定于工具栏上方，数据与后台分类一致） -->
    <scroll-view v-if="showTagMenu" class="tag-menu" :scroll-y="true">
      <view v-for="cat in CATEGORIES" :key="cat.name" class="tag-menu-group">
        <view class="tag-menu-parent">{{ cat.name }}</view>
        <view class="tag-menu-children">
          <text
            v-for="child in cat.children"
            :key="child"
            class="tag-menu-item"
            :class="{ active: selectedTags.includes(child) }"
            @tap="pickTag(child)"
          >
            # {{ child }}
          </text>
        </view>
      </view>
    </scroll-view>

    <!-- 3. 底部工具栏：表情 / 图片 / 文档 / 加粗 / #话题 -->
    <view class="editor-toolbar">
      <view class="toolbar-left">
        <view class="tool-icon-btn" :class="{ 'is-active': showEmojiPanel }" @tap="toggleEmojiPanel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </view>
        <view class="tool-icon-btn" @tap="pickImages">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </view>
        <view class="tool-icon-btn" @tap="pickFiles">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </view>
        <view class="tool-icon-btn" @tap="handleBold">
          <text class="bold-text-icon">B</text>
        </view>
        <view class="tool-icon-btn" :class="{ 'is-active': showTagMenu }" @tap="toggleTagMenu">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="9" x2="20" y2="9"></line>
            <line x1="4" y1="15" x2="20" y2="15"></line>
            <line x1="10" y1="3" x2="8" y2="21"></line>
            <line x1="16" y1="3" x2="14" y2="21"></line>
          </svg>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appState, actions } from '../../store/community.js';
import FileTypeIcon from '../../components/FileTypeIcon.vue';

const mode = ref('post');
const content = ref('');
const selectedTarget = ref('老林说宏观');

onLoad((options) => {
  if (options && options.mode === 'question') {
    mode.value = 'question';
  }
  if (options && options.target) {
    selectedTarget.value = decodeURIComponent(options.target);
  }
});

// 分类数据与 PC 端 PostEditor 一致（一级分类 + 二级标签）
const CATEGORIES = [
  { name: '交易追踪', children: ['VIP专属', '底仓标的', '自由现金流'] },
  { name: '市场资讯', children: ['市场资讯', '宏观市场', '机构观点'] },
  { name: '理财资讯', children: ['财报分析', '干货教学', '现金流'] },
  { name: '话题研究', children: ['宏观策略', '大类资产配置', '红利低波'] }
];
const VALID_TAGS = new Set(CATEGORIES.flatMap(cat => cat.children));
const selectedTags = ref([]);

// 附件（图片/文档混合，按选择顺序排列），最多 9 个
const MAX_ATTACHMENTS = 9;
const attachments = ref([]);

// ===== 表情面板 =====
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
  showEmojiPanel.value = !showEmojiPanel.value;
  if (showEmojiPanel.value) showTagMenu.value = false;
};

const insertEmoji = (e) => {
  insertAtCursor(e);
  showEmojiPanel.value = false;
  focusTextarea();
};

// ===== #标签菜单 =====
const showTagMenu = ref(false);

const toggleTagMenu = () => {
  showTagMenu.value = !showTagMenu.value;
  if (showTagMenu.value) showEmojiPanel.value = false;
  if (showTagMenu.value) focusTextarea();
};

// 输入 # 时自动展开标签菜单
const onContentInput = (e) => {
  const cursor = e.detail && typeof e.detail.cursor === 'number' ? e.detail.cursor : content.value.length;
  if (cursor > 0 && content.value[cursor - 1] === '#') {
    showTagMenu.value = true;
    showEmojiPanel.value = false;
  }
};

// ===== 正文光标插入（H5 下取原生 textarea） =====
const textareaRef = ref(null);
const highlightRef = ref(null);

const getNativeTextarea = () => {
  const comp = textareaRef.value;
  if (!comp) return null;
  if (comp.$el) return comp.$el.querySelector('textarea');
  return comp;
};

const focusTextarea = () => {
  nextTick(() => {
    const el = getNativeTextarea();
    if (el) el.focus();
  });
};

const insertAtCursor = (text) => {
  const el = getNativeTextarea();
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
const pickTag = (tag) => {
  const idx = selectedTags.value.indexOf(tag);
  if (idx === -1) {
    selectedTags.value.push(tag);
    const el = getNativeTextarea();
    const before = el ? content.value.slice(0, el.selectionStart ?? content.value.length) : content.value;
    const needsSpace = before.length > 0 && !/\s$/.test(before);
    insertAtCursor(`${needsSpace ? ' ' : ''}#${tag} `);
  } else {
    selectedTags.value.splice(idx, 1);
    content.value = content.value.replace(new RegExp(`\\s?#${tag}(\\s)?`), '');
  }
  focusTextarea();
};

// 加粗：在光标处插入 Markdown 加粗示例
const handleBold = () => {
  insertAtCursor(' **重点内容** ');
  focusTextarea();
};

// ===== #标签蓝色高亮层：仅匹配有效标签时显示蓝色 =====
const highlightSegments = computed(() =>
  content.value
    .split(/(#[^\s#]+)/g)
    .filter(p => p !== '')
    .map(p => ({ text: p, tag: p.startsWith('#') && VALID_TAGS.has(p.slice(1)) }))
);

const syncHighlightScroll = (e) => {
  const top = e.detail ? e.detail.scrollTop : 0;
  if (highlightRef.value) highlightRef.value.scrollTop = top;
};

// ===== 附件上传 =====
const pickImages = () => {
  const remaining = MAX_ATTACHMENTS - attachments.value.length;
  if (remaining <= 0) {
    uni.showToast({ title: `最多上传 ${MAX_ATTACHMENTS} 个附件（含图片和文档）`, icon: 'none' });
    return;
  }
  uni.chooseImage({
    count: remaining,
    success: (res) => {
      const files = res.tempFiles || [];
      addAttachments(files.map(f => ({ type: 'image', name: f.name || '图片', url: f.path, size: f.size || 0 })));
    }
  });
};

const pickFiles = () => {
  const remaining = MAX_ATTACHMENTS - attachments.value.length;
  if (remaining <= 0) {
    uni.showToast({ title: `最多上传 ${MAX_ATTACHMENTS} 个附件（含图片和文档）`, icon: 'none' });
    return;
  }
  if (typeof uni.chooseFile !== 'function') {
    uni.showToast({ title: '当前环境不支持上传文档', icon: 'none' });
    return;
  }
  uni.chooseFile({
    count: remaining,
    extension: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.md'],
    success: (res) => {
      const files = res.tempFiles || [];
      addAttachments(files.map(f => ({ type: 'file', name: f.name, url: f.path, size: f.size || 0 })));
    }
  });
};

// 追加附件：超出上限时截断并提示
const addAttachments = (items) => {
  const remaining = MAX_ATTACHMENTS - attachments.value.length;
  if (remaining <= 0) {
    uni.showToast({ title: `最多上传 ${MAX_ATTACHMENTS} 个附件（含图片和文档）`, icon: 'none' });
    return;
  }
  if (items.length > remaining) {
    uni.showToast({ title: `最多上传 ${MAX_ATTACHMENTS} 个附件，已保留前 ${MAX_ATTACHMENTS} 个`, icon: 'none' });
  }
  attachments.value.push(...items.slice(0, remaining));
};

const removeAttachment = (idx) => {
  revokeIfBlob(attachments.value[idx].url);
  attachments.value.splice(idx, 1);
};

const revokeIfBlob = (url) => {
  // #ifdef H5
  if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
  // #endif
};

const formatSize = (size) =>
  size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;

// ===== 取消与发布 =====
const handleCancel = () => {
  // 取消：附件不会被发布，回收预览地址
  attachments.value.forEach(a => revokeIfBlob(a.url));
  uni.navigateBack();
};

const handleSubmit = () => {
  const text = content.value.trim();
  if (!text) return;

  let ok;
  if (mode.value === 'question') {
    ok = actions.publishPost({
      title: '',
      content: text,
      tags: selectedTags.value,
      questionTarget: selectedTarget.value
    });
  } else {
    const images = attachments.value.filter(a => a.type === 'image').map(a => ({ ...a }));
    const files = attachments.value.filter(a => a.type === 'file').map(a => ({ ...a }));
    ok = actions.publishPost({
      title: '',
      content: text,
      tags: selectedTags.value,
      images: images.map(a => a.url),
      attachments: files
    });
  }
  // 发布成功：返回上一页；附件地址不回收（信息流帖子仍引用）
  if (ok) uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.publish-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-sizing: border-box;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  -webkit-tap-highlight-color: transparent;
}

/* 顶部状态栏固定遮罩 */
.status-bar-cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  background: #ffffff;
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}

/* 1. 顶部标题栏 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 0.5px solid #f1f5f9;
  position: sticky;
  top: constant(safe-area-inset-top);
  top: env(safe-area-inset-top);
  background: #ffffff;
  z-index: 50;
}

.header-cancel-btn {
  padding: 4px 6px;
}

.header-cancel-text {
  font-size: 15px;
  color: #64748b;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.btn-header-publish {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 16px;
  border-radius: 4px;
  line-height: 1.4;
  margin: 0;

  &::after {
    border: none;
  }

  &[disabled] {
    opacity: 0.5;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
  }
}

/* 2. 内容编辑区：撑满屏幕剩余高度 */
.publish-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px 16px calc(58px + env(safe-area-inset-bottom));
}

.target-select-row {
  display: flex;
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
}

.target-label {
  font-size: 12px;
  font-weight: 700;
  color: #059669;
  flex-shrink: 0;
}

.target-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 99px;
  background: #ffffff;
  color: #64748b;
  border: 1px solid #cbd5e1;

  &.selected {
    background: #10b981;
    color: #ffffff;
    border-color: #10b981;
    font-weight: 700;
  }
}

/* 编辑区：白色背景，撑满可用高度 */
.editor-box {
  flex: 1;
  background: #ffffff;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  gap: 10px;
}

.editor-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
}

.editor-form {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.content-textarea-wrap {
  position: relative;
  flex: 1;
  min-height: 160px;
}

/* 高亮层：与输入框同样式，#有效标签渲染为蓝色 */
.content-highlight {
  position: absolute;
  inset: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #1e293b;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  pointer-events: none;
}

.hl-tag {
  color: rgb(2, 132, 199);
}

.content-textarea {
  width: 100%;
  height: 100%;
}

/* 穿透 uni-textarea 内部结构 */
:deep(.uni-textarea-textarea) {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 160px;
  padding: 0;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: transparent;
  caret-color: #1e293b;
  background: transparent;
}

:deep(.uni-textarea-placeholder) {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}

/* 附件预览：按选择顺序展示 */
.attachments-area {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

.attachments-area .file-row {
  flex: 1 1 100%;
}

.img-preview-item {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.img-preview {
  width: 100%;
  height: 100%;
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
  color: #ffffff;
  font-size: 13px;
  line-height: 18px;
  text-align: center;
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
}

/* 提问模式公开提示 */
.ask-public-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 8px 2px 0;
}

/* 表情面板（固定于工具栏上方） */
.emoji-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(46px + env(safe-area-inset-bottom));
  z-index: 55;
  height: 220px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
}

.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
}

.emoji-item {
  width: 12.5%;
  font-size: 20px;
  line-height: 1;
  padding: 7px 0;
  text-align: center;
}

/* #标签选择菜单（固定于工具栏上方） */
.tag-menu {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(46px + env(safe-area-inset-bottom));
  z-index: 55;
  max-height: 260px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 12px 14px 4px;
  box-sizing: border-box;
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
  background: #10b981;
}

.tag-menu-children {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-menu-item {
  border: 1px solid #e2e8f0;
  background: #f6f6f6;
  color: #475569;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;

  &.active {
    background: rgba(16, 185, 129, 0.1);
    border-color: #10b981;
    color: #10b981;
    font-weight: 600;
  }
}

/* 3. 底部工具栏（固定页面底部） */
.editor-toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 56;
  height: calc(46px + env(safe-area-inset-bottom));
  padding: 0 12px env(safe-area-inset-bottom);
  box-sizing: border-box;
  background: #ffffff;
  border-top: 0.5px solid #f1f5f9;
  display: flex;
  align-items: center;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-icon-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  border-radius: 6px;

  &.is-active {
    color: #10b981;
    background: rgba(16, 185, 129, 0.08);
  }
}

.bold-text-icon {
  font-family: Georgia, serif;
  font-weight: 800;
  font-size: 17px;
  line-height: 1;
}
</style>
