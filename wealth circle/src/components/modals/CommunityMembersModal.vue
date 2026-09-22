<template>
  <div v-if="appState.isMembersModalOpen" class="members-modal-backdrop" @click.self="actions.closeMembersModal">
    <div class="members-modal-card animate-scale-up" role="dialog" aria-modal="true">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-left">
          <div class="header-title-group">
            <div class="title-row">
              <h3 class="modal-title">星球成员</h3>
            </div>
          </div>
        </div>

        <button class="modal-close-btn" @click="actions.closeMembersModal" title="关闭弹窗 (Esc)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Search & Category Filters（随列表滚动） -->
      <div class="members-scroll-body">
        <div class="modal-toolbar">
          <div class="role-tabs">
            <button
              v-for="tab in filterTabs"
              :key="tab.key"
              :class="['role-tab-btn', { active: currentTab === tab.key }]"
              @click="currentTab = tab.key"
            >
              {{ tab.label }}
              <span class="tab-count">{{ tab.count }}</span>
            </button>
          </div>
        </div>

        <div v-if="filteredMembers.length" class="members-grid">
          <div 
            v-for="m in filteredMembers" 
            :key="m.id" 
            class="member-item-card"
          >
            <!-- Avatar -->
            <div class="item-avatar-wrap">
              <img :src="m.avatar" class="member-avatar" :alt="m.name" />
            </div>

            <!-- Member Main Brief Info -->
            <div class="item-info">
              <div class="info-top-row">
                <span class="member-name">{{ m.name }}</span>
                <span :class="['role-badge', `badge-${m.role}`]">
                  {{ getRoleLabel(m.role) }}
                </span>
              </div>

              <div v-if="['founder', 'partner', 'guest'].includes(m.role)" class="member-headline" :title="m.roleTitle || m.notes || ''">
                {{ m.roleTitle || m.notes || '专注稳健资产配置' }}
              </div>

              <div v-if="['founder', 'partner', 'guest'].includes(m.role)" class="member-bio-text" :title="m.bio || ''">
                {{ m.bio || '坚持长钱长投，与优秀企业与时间做朋友。' }}
              </div>
            </div>

            <!-- Action Button -->
            <div class="item-action-wrap">
              <span class="joined-days-text">已加入星球 {{ getJoinedDays(m.joinedAt) }}</span>
              <button
                v-if="m.role === 'founder' || m.role === 'partner' || m.role === 'guest'"
                class="btn-action-primary"
                @click="handleAskMember(m)"
              >
                向TA提问
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-search-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">未找到匹配的星球成员</div>
          <p class="empty-desc">当前分类下暂无成员，可切换上方筛选标签查看</p>
          <button class="btn-reset-search" @click="resetFilters">查看全部星友</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { appState, actions } from '@/stores/community';
import { MemberRecord, UserRole } from '@/types';

const currentTab = ref<'all' | 'founder' | 'partner' | 'guest' | 'vip' | 'member'>('all');

const filterTabs = computed(() => {
  const members = appState.members;
  return [
    { key: 'all' as const, label: '全部星友', count: members.length },
    { key: 'founder' as const, label: '星主', count: members.filter(m => m.role === 'founder').length },
    { key: 'partner' as const, label: '合伙人', count: members.filter(m => m.role === 'partner').length },
    { key: 'guest' as const, label: '嘉宾', count: members.filter(m => m.role === 'guest').length },
    { key: 'vip' as const, label: '会员', count: members.filter(m => m.role === 'vip').length },
    { key: 'member' as const, label: '星友', count: members.filter(m => m.role === 'member').length },
  ];
});

const filteredMembers = computed(() => {
  let list = appState.members;

  // Filter by role tab
  if (currentTab.value !== 'all') {
    list = list.filter(m => m.role === currentTab.value);
  }

  // 排序：星主 > 合伙人 > 嘉宾 优先，其余按加入时间倒序
  const roleOrder: Record<string, number> = { founder: 0, partner: 1, guest: 2 };
  return [...list].sort((a, b) => {
    const ra = roleOrder[a.role] ?? 3;
    const rb = roleOrder[b.role] ?? 3;
    if (ra !== rb) return ra - rb;
    return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
  });
});

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case 'founder': return '星主';
    case 'partner': return '合伙人';
    case 'guest': return '嘉宾';
    case 'vip': return '会员';
    default: return '星友';
  }
};

const getJoinedDays = (joinedAt: string) => {
  if (!joinedAt) return '1 天';
  const start = new Date(joinedAt).getTime();
  const now = new Date('2024-09-18').getTime();
  const diffDays = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  return `${diffDays} 天`;
};

const handleAskMember = (m: MemberRecord) => {
  actions.openAskModal(m.name, m.avatar);
};

const resetFilters = () => {
  currentTab.value = 'all';
};

// Handle ESC key to close modal
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && appState.isMembersModalOpen) {
    actions.closeMembersModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<style scoped>
.members-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.members-modal-card {
  width: 100%;
  max-width: 780px;
  background: #ffffff;
  border-radius: var(--radius-card);
  border: 1px solid var(--border-light);
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
}

/* Header */
.modal-header {
  padding: 20px 24px 16px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-title-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary-navy);
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: #f1f5f9;
  color: var(--primary-navy);
}

/* Toolbar */
.modal-toolbar {
  padding: 14px 24px 6px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.role-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.role-tab-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 12.5px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.15s;
}

.role-tab-btn:hover {
  background: #f1f5f9;
  color: var(--primary-navy);
}

.role-tab-btn.active {
  background: var(--primary-navy);
  border-color: var(--primary-navy);
  color: #ffffff;
}

.role-tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.tab-count {
  font-size: 11px;
  font-weight: 700;
  background: #f1f5f9;
  color: #64748b;
  padding: 1px 6px;
  border-radius: 10px;
}

/* Scroll Body */
.members-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 16px;
}

.members-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 24px 0;
}

.member-item-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border: 1px solid #eaedf1;
  border-radius: var(--radius-md);
  background: #ffffff;
  transition: all 0.15s;
}

.member-item-card:hover {
  border-color: #cbd5e1;
  background: #fafbfc;
}

/* Avatar Wrap */
.item-avatar-wrap {
  position: relative;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
}

.member-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #e2e8f0;
}

/* Member Info */
.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-navy);
}

.role-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
}

.badge-founder {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.badge-assistant {
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.badge-vip {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.badge-guest {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.joined-days-text {
  font-size: 11.5px;
  color: #94a3b8;
  white-space: nowrap;
}

.member-headline {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-bio-text {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Actions */
.item-action-wrap {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
}

.btn-action-primary {
  background: var(--brand-green);
  color: #ffffff;
  border: none;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-action-primary:hover {
  background: var(--brand-green-hover);
}

/* Empty State */
.empty-search-state {
  padding: 48px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--primary-navy);
}

.empty-desc {
  font-size: 12.5px;
  color: #64748b;
  margin: 6px 0 16px 0;
}

.btn-reset-search {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-size: 12.5px;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
