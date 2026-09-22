<template>
  <header class="top-header">
    <!-- Left: Brand (星球名称) -->
    <div class="header-brand" @click="goHome" title="返回资讯流">
      <div class="logo-emblem">
        <span class="emblem-char">财</span>
      </div>
      <div class="brand-text-block">
        <div class="brand-title">财不外露</div>
        <div class="brand-subtitle">财经私享知识星球</div>
      </div>
    </div>

    <!-- Center: Global Search -->
    <div class="header-center">
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="搜索主题、专栏..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <span class="search-shortcut">⌘K</span>
      </div>
    </div>

    <!-- Right: VIP entry + Current User (avatar & name with popover menu) -->
    <div class="header-right">
      <button
        v-if="appState.currentPerspective !== 'founder'"
        class="btn-header-vip"
        @click="appState.isVipJoinModalOpen = true"
      >
        {{ appState.currentPerspective === 'guest' ? '开通会员' : '会员权益' }}
      </button>

      <!-- User Entry with Downward Popover Menu -->
      <div class="user-entry-section">
        <transition name="popover-fade">
          <div v-if="isMenuOpen" class="user-popover-menu">
            <!-- Popover Header: User Info -->
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
            </div>

            <div class="popover-divider"></div>

            <!-- Menu items -->
            <div class="popover-menu-list">
              <div class="popover-menu-item" @click="goToUserCenter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>个人中心与资产</span>
              </div>

              <div class="popover-menu-item" @click="openVipModal">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>会员特权与续费</span>
              </div>

              <div v-if="appState.currentPerspective !== 'founder'" class="popover-menu-item" @click="handleSwitchPerspective('founder')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <polyline points="17 8 20 5 23 8"></polyline>
                  <line x1="20" y1="5" x2="20" y2="15"></line>
                </svg>
                <span>切换至星主/管理员视角</span>
              </div>

              <div v-if="appState.currentPerspective !== 'vip'" class="popover-menu-item" @click="handleSwitchPerspective('vip')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>切换至VIP会员视角</span>
              </div>

              <div v-if="appState.currentPerspective !== 'guest'" class="popover-menu-item" @click="handleSwitchPerspective('guest')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>切换至注册用户（未开通会员）视角</span>
              </div>
            </div>

            <div class="popover-divider"></div>

            <!-- Logout item inside menu -->
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

        <!-- User Card Trigger (avatar + name) -->
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
            class="entry-chevron-icon"
            :class="{ 'rotate-up': isMenuOpen }"
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
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { appState, actions } from '@/stores/community';

const searchQuery = ref('');
const isMenuOpen = ref(false);

const goHome = () => {
  actions.setCurrentView('feed');
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    actions.showToast(`已搜索关键词: "${searchQuery.value.trim()}"`);
  }
};

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
  // capture 阶段监听：任何外部点击（含脚本触发）都最先经过 document capture
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
.top-header {
  height: 64px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 24px;
  z-index: 30;
  flex-shrink: 0;
}

/* Left: Brand */
.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-emblem {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.35);
  flex-shrink: 0;
}

.emblem-char {
  color: #f59e0b;
  font-size: 22px;
  font-weight: 800;
  font-family: 'PingFang SC', sans-serif;
  letter-spacing: -1px;
}

.brand-text-block {
  overflow: hidden;
}

.brand-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 1px;
  letter-spacing: 0.3px;
}

/* Center: Search */
.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 520px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 8px 16px;
  transition: all var(--transition-fast);
}

.search-box:focus-within {
  background: #ffffff;
  border-color: var(--brand-green);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}

.search-icon {
  color: var(--text-muted);
  margin-right: 8px;
  flex-shrink: 0;
}

.search-box input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 13px;
  color: var(--text-primary);
  box-shadow: none;
  padding: 0;
}

.search-shortcut {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  padding: 1px 5px;
  flex-shrink: 0;
}

/* Right: VIP + User */
.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.btn-header-vip {
  background: var(--vip-gold-gradient);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.25);
}

/* User Entry */
.user-entry-section {
  position: relative;
  user-select: none;
}

.user-entry-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-entry-card:hover {
  background: var(--bg-subtle);
}

.user-entry-card.active {
  background: var(--bg-subtle);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #cbd5e1;
  display: block;
  flex-shrink: 0;
}

.user-name-box {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
  line-height: 1.3;
}

.entry-chevron-icon {
  color: #94a3b8;
  transition: transform var(--transition-fast), color var(--transition-fast);
}

.entry-chevron-icon.rotate-up {
  transform: rotate(180deg);
  color: var(--primary-navy);
}

/* Downward Popover Menu */
.user-popover-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 250px;
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

/* Popover Animation (slide down) */
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
