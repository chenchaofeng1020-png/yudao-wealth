<template>
  <transition name="modal-fade">
    <div
      v-if="appState.isUserCenterModalOpen"
      class="modal-backdrop"
      @click.self="actions.closeUserCenterModal"
    >
      <div class="modal-card user-center-modal-card">
        <!-- Close button -->
        <button class="btn-close-modal" @click="actions.closeUserCenterModal" title="关闭">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h3 class="uc-modal-title">个人中心</h3>

        <!-- 个人资料 -->
        <div class="uc-section">
          <div class="uc-section-title">个人资料</div>
          <div class="uc-profile-row">
            <img :src="appState.user.avatar" class="uc-avatar" alt="Avatar" />
            <div class="uc-profile-meta">
              <div class="uc-name-row">
                <span class="uc-user-name">{{ appState.user.name }}</span>
                <span :class="['badge', appState.user.role === 'founder' ? 'badge-founder' : 'badge-vip']">
                  {{ appState.user.roleTitle }}
                </span>
              </div>
              <span class="uc-uid">UID: {{ appState.user.id }}</span>
            </div>
          </div>

          <div class="uc-nickname-row">
            <label class="uc-nickname-label">昵称</label>
            <input
              v-model="nicknameInput"
              type="text"
              class="uc-nickname-input"
              maxlength="20"
              placeholder="请输入昵称"
            />
            <button
              class="btn-primary uc-nickname-save"
              :disabled="!nicknameChanged"
              @click="saveNickname"
            >
              保存
            </button>
          </div>
        </div>

        <!-- 会员信息 -->
        <div class="uc-section">
          <div class="uc-section-title">会员信息</div>
          <div class="vip-metal-card">
            <div class="vip-metal-top">
              <div class="brand-vip-sign">
                <span class="vip-logo-char">财</span>
                <span class="vip-badge-text">财不外露 · 私享会员</span>
              </div>
              <div class="vip-validity">
                {{ appState.user.vipExpireAt ? `有效期至：${appState.user.vipExpireAt}` : '未开通' }}
              </div>
            </div>

            <div class="vip-rights-grid">
              <div class="right-pill">✓ 全站专栏免费研读</div>
              <div class="right-pill">✓ 每周实战复盘直播连麦</div>
              <div class="right-pill">✓ 核心底仓估值底清单下载</div>
              <div class="right-pill">✓ 星主1对1理财体检指导</div>
            </div>

            <div class="vip-metal-bottom">
              <div class="vip-price-indicator">
                <span class="num-tabular vip-price-digit">¥899</span>
                <span class="vip-unit">/ 年（折合每天不到 2.5 元）</span>
              </div>
              <button class="btn-vip-metal" @click="appState.isVipJoinModalOpen = true">
                {{ appState.user.role === 'vip' ? '立即续费 享老会员专属优惠' : '立即付费加入星球' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { appState, actions } from '@/stores/community';

const nicknameInput = ref(appState.user.name);

// 每次打开弹窗时同步最新昵称
watch(() => appState.isUserCenterModalOpen, (open) => {
  if (open) {
    nicknameInput.value = appState.user.name;
  }
});

const nicknameChanged = computed(() => {
  return nicknameInput.value.trim() !== appState.user.name && nicknameInput.value.trim().length > 0;
});

const saveNickname = () => {
  const name = nicknameInput.value.trim();
  if (!name || name === appState.user.name) return;
  appState.user.name = name;
  actions.showToast('昵称已更新');
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card.user-center-modal-card {
  width: 100%;
  max-width: 480px;
  max-height: 86vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: var(--radius-card);
  border: 1px solid var(--border-light);
  box-shadow: none;
  position: relative;
  padding: 24px;
}

.btn-close-modal {
  position: absolute;
  top: 14px;
  right: 14px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.btn-close-modal:hover {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.uc-modal-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 20px;
}

.uc-section {
  margin-bottom: 22px;
}

.uc-section:last-child {
  margin-bottom: 0;
}

.uc-section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

/* 个人资料 */
.uc-profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.uc-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #cbd5e1;
  flex-shrink: 0;
}

.uc-profile-meta {
  min-width: 0;
}

.uc-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.uc-user-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.uc-uid {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-subtle);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 4px;
}

.uc-nickname-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.uc-nickname-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
  flex-shrink: 0;
}

.uc-nickname-input {
  flex: 1;
  height: 38px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--transition-fast);
}

.uc-nickname-input:focus {
  border-color: var(--brand-green);
}

.uc-nickname-save {
  height: 38px;
  padding: 0 16px;
  font-size: 13px;
  flex-shrink: 0;
}

.uc-nickname-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 会员信息（沿用金属卡片样式） */
.vip-metal-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: var(--radius-card);
  padding: 18px 20px;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.vip-metal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.brand-vip-sign {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vip-logo-char {
  width: 28px;
  height: 28px;
  background: var(--vip-gold-gradient);
  border-radius: 6px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 15px;
}

.vip-badge-text {
  font-size: 15px;
  font-weight: 800;
  color: #fcd34d;
  letter-spacing: 0.5px;
}

.vip-validity {
  font-size: 12px;
  color: #94a3b8;
}

.vip-rights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.right-pill {
  font-size: 12px;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.06);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.vip-metal-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.vip-price-digit {
  font-size: 22px;
  font-weight: 900;
  color: #fcd34d;
}

.vip-unit {
  font-size: 11px;
  color: #94a3b8;
  margin-left: 4px;
}

.btn-vip-metal {
  background: var(--vip-gold-gradient);
  color: #ffffff;
  font-weight: 800;
  font-size: 12px;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
}

.btn-vip-metal:hover {
  filter: brightness(1.1);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
