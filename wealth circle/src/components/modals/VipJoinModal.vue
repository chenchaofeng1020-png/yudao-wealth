<template>
  <div v-if="appState.isVipJoinModalOpen" class="modal-backdrop" @click.self="appState.isVipJoinModalOpen = false">
    <div class="vip-modal-dialog animate-fade-in">
      <button class="vip-modal-close" @click="appState.isVipJoinModalOpen = false">×</button>

      <div class="vip-modal-header">
        <div class="vip-header-crown">👑</div>
        <h2 class="vip-header-title">加入「财不外露」私享星球</h2>
        <p class="vip-header-sub">低调蓄力，稳健复利；与真正的高手同行，穿透市场周期</p>
      </div>

      <div class="vip-plan-cards">
        <div 
          :class="['plan-card', { active: selectedTier === 'annual' }]"
          @click="selectedTier = 'annual'"
        >
          <div class="plan-badge hot">最受欢迎</div>
          <div class="plan-name">年度会员（365 天）</div>
          <div class="plan-price-row">
            <span class="currency">¥</span>
            <span class="price-val num-tabular">899</span>
            <span class="price-origin num-tabular">¥1,699</span>
          </div>
          <div class="plan-daily">折合每日仅需 2.46 元</div>
        </div>
      </div>

      <!-- Privileges Grid -->
      <div class="privileges-box">
        <div class="privilege-title">会员专享 6 大核心权益：</div>
        <div class="privilege-grid">
          <div class="p-item">
            <span class="p-icon">📚</span>
            <div>
              <div class="p-name">全站财经专栏畅读</div>
              <div class="p-desc">无限制阅读《严肃理财》《财报透视》等深度长文</div>
            </div>
          </div>

          <div class="p-item">
            <span class="p-icon">🎙️</span>
            <div>
              <div class="p-name">每周复盘直播直通</div>
              <div class="p-desc">盘面异动实战复盘，支持现场开麦向老林提问</div>
            </div>
          </div>

          <div class="p-item">
            <span class="p-icon">📊</span>
            <div>
              <div class="p-name">核心底仓安全边际清单</div>
              <div class="p-desc">季度跟踪12家具备自由现金流定价权的核心资产</div>
            </div>
          </div>

          <div class="p-item">
            <span class="p-icon">🩺</span>
            <div>
              <div class="p-name">家庭资产负债表体检</div>
              <div class="p-desc">由星主和特邀助教提供一对一结构诊断建议</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Checkout -->
      <div class="vip-modal-footer">
        <div class="security-guarantee">
          <span>🔒 7天内未满足预期可申请退款保障</span>
        </div>

        <button class="btn-vip-checkout" @click="actions.joinVip">
          <span>立即开通</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { appState, actions } from '@/stores/community';

const selectedTier = ref<'annual'>('annual');
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.vip-modal-dialog {
  width: 580px;
  background: #ffffff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.vip-modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  background: transparent;
  color: #94a3b8;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
}

.vip-modal-header {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 30px 24px 22px 24px;
  text-align: center;
  color: #ffffff;
}

.vip-header-crown {
  font-size: 32px;
  margin-bottom: 4px;
}

.vip-header-title {
  font-size: 22px;
  font-weight: 900;
  color: #fcd34d;
  letter-spacing: 0.5px;
}

.vip-header-sub {
  font-size: 13px;
  color: #cbd5e1;
  margin-top: 6px;
}

.vip-plan-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  padding: 20px 24px;
}

.plan-card {
  border: 2px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 16px;
  position: relative;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.plan-card.active {
  border-color: #f59e0b;
  background: #fffbeb;
  box-shadow: none;
}

.plan-badge {
  position: absolute;
  top: -10px;
  right: 12px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  background: #e2e8f0;
  color: #475569;
}

.plan-badge.hot {
  background: var(--vip-gold-gradient);
  color: #ffffff;
}

.plan-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--primary-navy);
}

.plan-price-row {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin: 8px 0 4px 0;
}

.currency {
  font-size: 14px;
  font-weight: 800;
  color: #b45309;
}

.price-val {
  font-size: 24px;
  font-weight: 900;
  color: #b45309;
}

.price-origin {
  font-size: 11px;
  color: var(--text-muted);
  text-decoration: line-through;
  margin-left: 4px;
}

.plan-daily {
  font-size: 11px;
  color: var(--text-muted);
}

.privileges-box {
  padding: 0 24px 16px 24px;
}

.privilege-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 10px;
}

.privilege-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.p-item {
  display: flex;
  gap: 10px;
  background: var(--bg-subtle);
  padding: 10px 12px;
  border-radius: var(--radius-md);
}

.p-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.p-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-navy);
}

.p-desc {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-top: 2px;
}

.vip-modal-footer {
  padding: 16px 24px 24px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.security-guarantee {
  text-align: center;
  font-size: 11px;
  color: var(--text-muted);
}

.btn-vip-checkout {
  background: var(--vip-gold-gradient);
  color: #ffffff;
  padding: 13px 20px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 800;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-vip-checkout:hover {
  filter: brightness(1.08);
}
</style>
