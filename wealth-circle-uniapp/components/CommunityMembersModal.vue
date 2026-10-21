<template>
  <view v-if="appState.isMembersModalVisible" class="members-modal-backdrop" @tap.self="close">
    <view class="members-sheet">
      <!-- 顶部标题 -->
      <view class="sheet-head">
        <view class="head-title-col">
          <text class="sheet-title">星球星友与嘉宾名录</text>
          <text class="sheet-sub">星主&合伙人 7 位 · 特邀嘉宾 2 位 · 1.4w 星友</text>
        </view>
        <view class="btn-sheet-close" @tap="close">✕</view>
      </view>

      <!-- 角色分类 Tab -->
      <view class="role-filter-row">
        <text 
          v-for="tab in filterTabs" 
          :key="tab.key" 
          class="role-filter-btn"
          :class="{ active: currentTab === tab.key }"
          @tap="currentTab = tab.key"
        >
          {{ tab.label }}
        </text>
      </view>

      <!-- 成员列表滚动区 -->
      <scroll-view class="members-scroll-list" scroll-y="true">
        <view 
          v-for="m in filteredList" 
          :key="m.id" 
          class="member-card-item"
        >
          <image :src="m.avatar" class="m-avatar" mode="aspectFill" />
          <view class="m-info-col">
            <view class="m-name-line">
              <text class="m-name">{{ m.name }}</text>
              <text class="m-role-chip" :class="'chip-' + m.role">
                {{ getRoleLabel(m.role) }}
              </text>
            </view>
            <text class="m-title-text">{{ m.roleTitle }}</text>
            <text class="m-bio-text ellipsis-1">{{ m.bio }}</text>
            <text class="m-days-text">已同行 {{ m.joinedDays }}</text>
          </view>

          <!-- 向TA提问按钮（星主、合伙人、嘉宾可见） -->
          <view 
            v-if="['founder', 'partner', 'guest'].includes(m.role)"
            class="btn-ask-member"
            @tap.stop="handleAsk(m)"
          >
            向TA提问
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appState, actions } from '../store/community.js';

const currentTab = ref('all');

const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'expert', label: '星主与合伙人' },
  { key: 'guest', label: '特邀嘉宾' },
  { key: 'vip', label: 'VIP会员' }
];

const close = () => {
  appState.isMembersModalVisible = false;
};

const filteredList = computed(() => {
  const list = appState.members;
  if (currentTab.value === 'expert') {
    return list.filter(m => m.role === 'founder' || m.role === 'partner');
  }
  if (currentTab.value === 'guest') {
    return list.filter(m => m.role === 'guest');
  }
  if (currentTab.value === 'vip') {
    return list.filter(m => m.role === 'vip');
  }
  return list;
});

const getRoleLabel = (role) => {
  const map = {
    founder: '星主',
    partner: '合伙人',
    guest: '嘉宾',
    vip: 'VIP会员',
    member: '星友'
  };
  return map[role] || '星友';
};

const handleAsk = (member) => {
  if (actions.checkVipPermission('向星友与专家提问为会员专享，开通会员立即向专家提问')) {
    appState.isMembersModalVisible = false;
    appState.publishModalMode = 'question';
    appState.publishTargetExpert = member.name;
    appState.isPublishModalVisible = true;
  }
};
</script>

<style lang="scss" scoped>
.members-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.members-sheet {
  background: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px 16px 24px 16px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.head-title-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sheet-title {
  font-size: 16.5px;
  font-weight: 800;
  color: #0f172a;
}

.sheet-sub {
  font-size: 11.5px;
  color: #94a3b8;
}

.btn-sheet-close {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 700;
}

.role-filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
}

.role-filter-btn {
  font-size: 12.5px;
  color: #64748b;
  padding: 4px 10px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;

  &.active {
    background: #fffbf0;
    color: #b45309;
    border-color: #f3e5c8;
    font-weight: 700;
  }
}

.members-scroll-list {
  flex: 1;
  overflow-y: auto;
  max-height: 52vh;
}

.member-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid #f8fafc;

  &:last-child {
    border-bottom: none;
  }
}

.m-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid #edf2f7;
  flex-shrink: 0;
}

.m-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.m-name-line {
  display: flex;
  align-items: center;
  gap: 6px;
}

.m-name {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.m-role-chip {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;

  &.chip-founder { background: #fee2e2; color: #dc2626; }
  &.chip-partner { background: #dbeafe; color: #2563eb; }
  &.chip-guest { background: #f3e8ff; color: #7e22ce; }
  &.chip-vip { background: #fef3c7; color: #b45309; }
  &.chip-member { background: #f1f5f9; color: #64748b; }
}

.m-title-text {
  font-size: 11.5px;
  color: #475569;
  font-weight: 500;
}

.m-bio-text {
  font-size: 11px;
  color: #94a3b8;
}

.m-days-text {
  font-size: 10px;
  color: #cbd5e1;
}

.btn-ask-member {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #b45309;
  font-size: 11.5px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 6px;
  flex-shrink: 0;
}
</style>
