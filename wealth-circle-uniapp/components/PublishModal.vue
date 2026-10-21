<template>
  <view v-if="appState.isPublishModalVisible" class="publish-backdrop" @tap.self="close">
    <view class="publish-sheet">
      <!-- 顶栏操作 -->
      <view class="sheet-top-row">
        <view class="tab-switch">
          <text 
            class="tab-btn" 
            :class="{ active: mode === 'post' }"
            @tap="mode = 'post'"
          >
            发布动态
          </text>
          <text 
            class="tab-btn" 
            :class="{ active: mode === 'question' }"
            @tap="mode = 'question'"
          >
            向嘉宾提问
          </text>
        </view>
        <text class="btn-cancel" @tap="close">取消</text>
      </view>

      <!-- 提问目标选择 -->
      <view v-if="mode === 'question'" class="target-select-row">
        <text class="target-label">提问对象：</text>
        <view class="target-chips">
          <text 
            v-for="target in expertList" 
            :key="target"
            class="target-chip"
            :class="{ selected: selectedTarget === target }"
            @tap="selectedTarget = target"
          >
            {{ target }}
          </text>
        </view>
      </view>

      <!-- 标题输入框 -->
      <input 
        v-model="title" 
        class="input-title" 
        placeholder="输入精炼标题（可选）" 
        maxlength="60"
      />

      <!-- 正文多行输入 -->
      <textarea 
        v-model="content" 
        class="input-content" 
        :placeholder="mode === 'question' ? '详细描述你的持仓疑问或投研困惑，星主与合伙人将深度解答...' : '分享你今日的宏观思考、市场观察或交易复盘...'" 
        maxlength="2000"
      />

      <!-- 标签选择栏 -->
      <view class="tags-row">
        <text class="tags-title">选择话题：</text>
        <view class="tags-scroll">
          <text 
            v-for="tag in availableTags" 
            :key="tag" 
            class="tag-chip"
            :class="{ active: selectedTags.includes(tag) }"
            @tap="toggleTag(tag)"
          >
            #{{ tag }}
          </text>
        </view>
      </view>

      <!-- 底部发布按钮 -->
      <view class="publish-footer">
        <text class="char-count">{{ content.length }}/2000 字</text>
        <button 
          class="btn-submit" 
          :disabled="!content.trim()"
          @tap="handleSubmit"
        >
          确认发布
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { appState, actions } from '../store/community.js';

const mode = ref(appState.publishModalMode || 'post');
const title = ref('');
const content = ref('');
const selectedTarget = ref('老林说宏观');
const expertList = ['老林说宏观', 'Rich', '若琪', '志诚'];
const availableTags = ['宏观策略', '大类资产配置', '红利低波', '交易追踪', '话题研究', '美股指标'];
const selectedTags = ref(['话题研究']);

const close = () => {
  appState.isPublishModalVisible = false;
};

const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    if (selectedTags.value.length > 1) {
      selectedTags.value = selectedTags.value.filter(t => t !== tag);
    }
  } else {
    selectedTags.value.push(tag);
  }
};

const handleSubmit = () => {
  if (!content.value.trim()) return;
  const postData = {
    title: title.value.trim(),
    content: content.value.trim(),
    tags: selectedTags.value,
    questionTarget: mode.value === 'question' ? selectedTarget.value : ''
  };
  actions.publishPost(postData);
  title.value = '';
  content.value = '';
};
</script>

<style lang="scss" scoped>
.publish-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.publish-sheet {
  background-color: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px 20px 24px 20px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.sheet-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.tab-switch {
  display: flex;
  background: #f1f5f9;
  border-radius: 99px;
  padding: 3px;
}

.tab-btn {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  padding: 6px 14px;
  border-radius: 99px;

  &.active {
    background: #ffffff;
    color: #c59b27;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }
}

.btn-cancel {
  font-size: 13px;
  color: #94a3b8;
  padding: 6px;
}

.target-select-row {
  display: flex;
  align-items: center;
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
}

.target-label {
  font-size: 12px;
  font-weight: 700;
  color: #b45309;
}

.target-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.target-chip {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 99px;
  background: #ffffff;
  color: #64748b;
  border: 1px solid #cbd5e1;

  &.selected {
    background: #f59e0b;
    color: #ffffff;
    border-color: #f59e0b;
    font-weight: 700;
  }
}

.input-title {
  height: 40px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.input-content {
  width: 100%;
  height: 120px;
  font-size: 14px;
  line-height: 1.6;
  color: #1e293b;
  margin-bottom: 14px;
}

.tags-row {
  margin-bottom: 16px;
}

.tags-title {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
  display: block;
}

.tags-scroll {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-chip {
  font-size: 11.5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;

  &.active {
    background: #fffbf0;
    color: #b45309;
    font-weight: 700;
    border: 1px solid #f3e5c8;
  }
}

.publish-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}

.char-count {
  font-size: 11px;
  color: #94a3b8;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  padding: 8px 24px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

  &[disabled] {
    opacity: 0.5;
    box-shadow: none;
  }
}
</style>
