<template>
  <view v-if="appState.isMembersModalVisible" class="members-modal-backdrop" @tap.self="close">
    <view class="members-sheet">
      <!-- 顶部标题 -->
      <view class="sheet-head">
        <text class="sheet-title">星球成员</text>
        <view class="btn-sheet-close" @tap="close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </view>
      </view>

      <!-- 角色分类筛选（随列表滚动） -->
      <scroll-view class="role-tabs-scroll" scroll-x="true" :show-scrollbar="false">
        <view class="role-tabs-row">
          <view
            v-for="tab in filterTabs"
            :key="tab.key"
            class="role-tab-btn"
            :class="{ active: currentTab === tab.key }"
            @tap="currentTab = tab.key"
          >
            <text>{{ tab.label }}</text>
            <text class="tab-count">{{ tab.count }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 成员列表滚动区 -->
      <scroll-view class="members-scroll-list" scroll-y="true">
        <view v-if="filteredList.length" class="members-grid">
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
              <text v-if="isExpert(m)" class="m-title-text">{{ m.roleTitle }}</text>
              <text v-if="isExpert(m)" class="m-bio-text">{{ m.bio }}</text>
            </view>
            <view class="m-action-col">
              <text class="m-days-text">已同行 {{ m.joinedDays }}</text>
              <view v-if="isExpert(m)" class="btn-ask-member" @tap.stop="handleAsk(m)">
                向TA提问
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-else class="empty-members-state">
          <text class="empty-icon-text">🔍</text>
          <text class="empty-main-hint">未找到匹配的星球成员</text>
          <text class="empty-sub-hint">当前分类下暂无成员，可切换上方筛选标签查看</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appState, actions } from '../store/community.js';

const currentTab = ref('all');

const filterTabs = computed(() => {
  const members = appState.members;
  return [
    { key: 'all', label: '全部星友', count: members.length },
    { key: 'founder', label: '星主', count: members.filter(m => m.role === 'founder').length },
    { key: 'partner', label: '合伙人', count: members.filter(m => m.role === 'partner').length },
    { key: 'guest', label: '嘉宾', count: members.filter(m => m.role === 'guest').length },
    { key: 'vip', label: '会员', count: members.filter(m => m.role === 'vip').length },
    { key: 'member', label: '星友', count: members.filter(m => m.role === 'member').length }
  ];
});

const isExpert = (m) => ['founder', 'partner', 'guest'].includes(m.role);

const filteredList = computed(() => {
  let list = appState.members;
  if (currentTab.value !== 'all') {
    list = list.filter(m => m.role === currentTab.value);
  }
  // 排序：星主 > 合伙人 > 嘉宾 优先，其余按同行天数倒序
  const roleOrder = { founder: 0, partner: 1, guest: 2 };
  return [...list].sort((a, b) => {
    const ra = roleOrder[a.role] ?? 3;
    const rb = roleOrder[b.role] ?? 3;
    if (ra !== rb) return ra - rb;
    return parseDays(b.joinedDays) - parseDays(a.joinedDays);
  });
});

const parseDays = (text) => parseInt(String(text || '').replace(/[^\d]/g, ''), 10) || 0;

const getRoleLabel = (role) => {
  const map = {
    founder: '星主',
    partner: '合伙人',
    guest: '嘉宾',
    vip: '会员',
    member: '星友'
  };
  return map[role] || '星友';
};

const close = () => {
  appState.isMembersModalVisible = false;
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
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.sheet-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}

.btn-sheet-close {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

/* 角色分类筛选 */
.role-tabs-scroll {
  flex-shrink: 0;
  white-space: nowrap;
  margin-bottom: 12px;
}

.role-tabs-row {
  display: flex;
  gap: 8px;
}

.role-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #ffffff;

  &.active {
    background: #10b981;
    border-color: #10b981;
    color: #ffffff;

    .tab-count {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
  }
}

.tab-count {
  font-size: 11px;
  font-weight: 700;
  background: #f1f5f9;
  color: #64748b;
  padding: 1px 6px;
  border-radius: 10px;
}

/* 成员列表 */
.members-scroll-list {
  flex: 1;
  overflow-y: auto;
  max-height: 58vh;
}

.members-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #eaedf1;
  border-radius: 8px;
  background: #ffffff;
}

.m-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  flex-shrink: 0;
}

.m-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.m-name-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.m-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.m-role-chip {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;

  &.chip-founder { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
  &.chip-partner { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
  &.chip-guest { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
  &.chip-vip { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
  &.chip-member { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
}

.m-title-text {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-bio-text {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右侧操作列：同行天数 + 向TA提问 */
.m-action-col {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
}

.m-days-text {
  font-size: 10.5px;
  color: #94a3b8;
  white-space: nowrap;
}

.btn-ask-member {
  background: #10b981;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
}

/* 空状态 */
.empty-members-state {
  padding: 48px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-text {
  font-size: 36px;
  margin-bottom: 8px;
}

.empty-main-hint {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.empty-sub-hint {
  font-size: 12.5px;
  color: #94a3b8;
  margin-top: 6px;
}
</style>
