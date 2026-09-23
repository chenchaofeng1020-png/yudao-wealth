<template>
  <aside class="sidebar-container">
    <!-- Brand Header (moved from top header) -->
    <div class="brand-header" @click="goHome" title="返回资讯流">
      <div class="logo-emblem"><span class="emblem-char">财</span></div>
      <div class="brand-text-block">
        <div class="brand-title">财不外露</div>
        <div class="brand-subtitle">财富成长星球</div>
      </div>
    </div>

    <!-- Main Navigation List -->
    <nav class="nav-section">
      <ul class="nav-list">
        <!-- Search: 直接显示输入框 -->
        <li class="nav-item search-expanded">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            class="search-inline-input"
            type="text"
            placeholder="搜索主题、专栏..."
            @keyup.enter="handleSearch"
          />
        </li>

        <li
          :class="['nav-item', { active: appState.currentView === 'feed' || appState.currentView === 'tag' }]"
          @click="actions.setCurrentView('feed')"
        >
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span class="nav-label">资讯</span>
        </li>

        <li
          :class="['nav-item', { active: appState.currentView === 'column' }]"
          @click="actions.setCurrentView('column')"
        >
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span class="nav-label">专栏</span>
        </li>

        <li
          :class="['nav-item', { active: appState.currentView === 'live' }]"
          @click="actions.setCurrentView('live')"
        >
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
          </svg>
          <span class="nav-label">直播</span>
        </li>

        <li
          :class="['nav-item', { active: appState.currentView === 'course' }]"
          @click="actions.setCurrentView('course')"
        >
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <span class="nav-label">课程</span>
        </li>
      </ul>
    </nav>

    <!-- VIP Entry (non-founder perspectives) -->
    <button
      v-if="appState.currentPerspective !== 'founder'"
      class="btn-sidebar-vip"
      @click="openVipModal"
    >
      {{ appState.currentPerspective === 'guest' ? '开通会员' : '会员权益' }}
    </button>

    <!-- User Entry with Upward Popover Menu (moved from top header) -->
    <div class="user-entry-section">
      <transition name="popover-fade">
        <div v-if="isMenuOpen" class="user-popover-menu">
          <div class="popover-user-card" @click="goToUserCenter">
            <img :src="appState.user.avatar" class="popover-avatar" alt="Avatar" />
            <div class="popover-meta">
              <div class="popover-name-row">
                <span class="popover-name">{{ appState.user.name }}</span>
                <span v-if="appState.user.role !== 'guest'" :class="['badge', appState.user.role === 'founder' ? 'badge-founder' : 'badge-vip']">
                  {{ appState.user.role === 'founder' ? '星主' : 'VIP' }}
                </span>
              </div>
            </div>
            <svg class="popover-entry-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
          </div>

          <div class="popover-divider"></div>

          <div class="popover-menu-list">
            <div v-if="appState.currentPerspective !== 'vip'" class="popover-menu-item" @click="handleSwitchPerspective('vip')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>切换至VIP会员视角</span>
            </div>

            <div v-if="appState.currentPerspective !== 'guest'" class="popover-menu-item" @click="handleSwitchPerspective('guest')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>切换至注册用户（未开通会员）视角</span>
            </div>
          </div>

          <div class="popover-divider"></div>

          <div class="popover-menu-item logout-item" @click="handleLogout">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>退出登录</span>
          </div>
        </div>
      </transition>

      <div
        :class="['user-entry-card', { active: isMenuOpen }]"
        @click="toggleMenu"
        title="点击展开个人账号菜单"
      >
        <img :src="appState.user.avatar" class="user-avatar" alt="Avatar" />
        <div class="user-name-box">
          <span class="user-name" :title="appState.user.name">{{ appState.user.name }}</span>
          <span v-if="appState.user.role !== 'guest'" :class="['badge', appState.user.role === 'founder' ? 'badge-founder' : 'badge-vip']">
            {{ appState.user.role === 'founder' ? '星主' : 'VIP' }}
          </span>
        </div>
        <svg
          :class="['entry-chevron-icon', { 'rotate-down': isMenuOpen }]"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { appState, actions } from '@/stores/community';

// 搜索输入框：常驻显示，回车触发搜索
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    actions.showToast(`已搜索关键词: "${searchQuery.value.trim()}"`);
  }
};

// 品牌 + 用户菜单逻辑（自顶栏迁移）
const goHome = () => actions.setCurrentView('feed');
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const goToUserCenter = () => {
  isMenuOpen.value = false;
  actions.openUserCenterModal();
};

const openVipModal = () => {
  isMenuOpen.value = false;
  appState.isVipJoinModalOpen = true;
};

const handleSwitchPerspective = (target: 'founder' | 'vip' | 'guest') => {
  isMenuOpen.value = false;
  actions.switchPerspective(target);
};

const handleLogout = () => {
  isMenuOpen.value = false;
  actions.confirmLogout();
};

const handleOutsideInteraction = (e: Event) => {
  const target = e.target as HTMLElement | null;
  if (target && target.closest && !target.closest('.user-entry-section')) {
    isMenuOpen.value = false;
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideInteraction, true);
  document.addEventListener('pointerdown', handleOutsideInteraction, true);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideInteraction, true);
  document.removeEventListener('pointerdown', handleOutsideInteraction, true);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.sidebar-container {
  width: 220px;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  min-height: 0;
  user-select: none;
  z-index: 20;
  flex-shrink: 0;
}

.nav-section {
  flex: 1;
  overflow-y: auto;
  padding: 2px 12px;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.nav-item:not(.search-expanded):hover {
  background: var(--bg-sidebar-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--bg-sidebar-hover);
  color: var(--brand-green);
  font-weight: 600;
}

.nav-item.active::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-green);
  margin-left: auto;
  flex-shrink: 0;
}

.nav-item.active .nav-icon {
  color: var(--brand-green);
}

.nav-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 99px;
  background: #e2e8f0;
  color: var(--text-secondary);
}

.nav-badge.hot {
  background: var(--vip-gold-light);
  color: var(--vip-gold);
}

.nav-dot-live {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--danger-red);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

/* ===== 以下样式自顶栏迁移 ===== */
/* Brand Header */
.brand-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 14px 14px 14px;
  cursor: pointer;
}

.logo-emblem {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 158, 11, 0.35);
  flex-shrink: 0;
}

.emblem-char {
  color: #f59e0b;
  font-size: 19px;
  font-weight: 800;
  font-family: 'PingFang SC', sans-serif;
  letter-spacing: -1px;
}

.brand-text-block {
  overflow: hidden;
}

.brand-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--primary-navy);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 1px;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

/* 搜索输入框：常驻显示，聚焦时绿色描边 */
.search-expanded {
  background: var(--bg-subtle);
  border: 1px solid #eef2f7;
  border-radius: 8px;
  padding: 0 11px;
  cursor: text;
  transition: all var(--transition-fast);
}

.search-expanded:focus-within {
  background: #ffffff;
  border-color: var(--brand-green);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}

.search-inline-input {
  border: none;
  background: transparent;
  width: 100%;
  min-width: 0;
  font-size: 13.5px;
  color: var(--text-primary);
  outline: none;
  padding: 0;
  box-shadow: none;
}

/* VIP Entry Button */
.btn-sidebar-vip {
  margin: 8px 12px;
  background: var(--vip-gold-gradient);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.25);
}

/* User Entry (bottom of sidebar) */
.user-entry-section {
  position: relative;
  user-select: none;
  margin: 0 12px;
  padding: 10px 0 14px;
  border-top: 1px solid #e2e8f0;
}

.user-entry-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.user-entry-card:hover,
.user-entry-card.active {
  background: var(--bg-sidebar-hover);
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

.user-name-box {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  flex: 1;
}

.user-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--primary-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
  line-height: 1.3;
}

.entry-chevron-icon {
  color: #94a3b8;
  transition: transform var(--transition-fast), color var(--transition-fast);
  flex-shrink: 0;
}

.entry-chevron-icon.rotate-down {
  transform: rotate(180deg);
  color: var(--primary-navy);
}

/* Upward Popover Menu */
.user-popover-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  width: 236px;
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  z-index: 100;
  padding: 8px 0;
  overflow: hidden;
}

.popover-user-card {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.popover-user-card:hover {
  background: var(--bg-subtle);
}

.popover-entry-arrow {
  color: #94a3b8;
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.popover-user-card:hover .popover-entry-arrow {
  transform: translateX(2px);
  color: #475569;
}

.popover-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #cbd5e1;
  flex-shrink: 0;
}

.popover-meta {
  flex: 1;
  min-width: 0;
}

.popover-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.popover-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popover-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 4px 0;
}

.popover-menu-list {
  display: flex;
  flex-direction: column;
}

.popover-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.popover-menu-item:hover {
  background: var(--bg-subtle);
  color: var(--primary-navy);
}

.popover-menu-item.logout-item {
  color: #ef4444;
}

.popover-menu-item.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Popover Animation (slide up) */
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
