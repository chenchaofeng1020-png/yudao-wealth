<template>
  <div class="paywall-page">
    <!-- Header -->
    <header class="paywall-header">
      <div class="header-inner">
        <div class="brand-block" @click="actions.resetFlow">
          <div class="logo-emblem">
            <span class="emblem-char">财</span>
          </div>
          <div class="brand-text">
            <span class="brand-title">财不外露</span>
            <span class="brand-sub">财经私享知识星球</span>
          </div>
        </div>

        <div class="header-nav-right">
          <div class="logged-user-pill">
            <img :src="appState.user.avatar" class="user-pill-avatar" alt="Avatar" />
            <span class="user-pill-name">{{ appState.user.name }}</span>
            <span class="badge badge-guest">未开通VIP</span>
          </div>
          <button class="btn-logout" @click="actions.confirmLogout">退出登录</button>
          <button class="btn-skip-demo" @click="actions.skipToCommunity">跳过演示直接进入</button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="paywall-main">
      <div class="paywall-content-box animate-fade-in">
        <!-- Steps Progress Bar -->
        <div class="steps-flow-bar">
          <div class="step-node completed">
            <div class="node-circle">✓</div>
            <span class="node-label">1. 注册账号 (已完成)</span>
          </div>
          <div class="step-line active"></div>
          <div class="step-node current">
            <div class="node-circle">2</div>
            <span class="node-label">2. 开通会员特权 (进行中)</span>
          </div>
          <div class="step-line"></div>
          <div class="step-node pending">
            <div class="node-circle">3</div>
            <span class="node-label">3. 开启私享星球内容</span>
          </div>
        </div>

        <!-- Greeting Notice -->
        <div class="welcome-notice-card">
          <div class="notice-avatar-wrap">
            <img :src="appState.user.avatar" class="notice-avatar" alt="User" />
            <span class="status-dot"></span>
          </div>
          <div class="notice-info">
            <h3 class="notice-title">您好，{{ appState.user.name }}！账号已就绪</h3>
            <p class="notice-desc">
              「财不外露」为严肃实战型闭门投研星球。为了维持高质量交流生态，星球内所有<strong>动态广场、深度专栏、实盘直播与专家答疑</strong>仅对正式会员开放。请选择适合您的方案完成开通：
            </p>
          </div>
        </div>

        <!-- Plan Selection -->
        <div class="plan-selection-section">
          <h4 class="section-title">选择您的私享会员方案</h4>
          <div class="plans-grid">
            <!-- Plan 1: Annual -->
            <div 
              :class="['plan-card', { active: selectedTier === 'annual' }]" 
              @click="selectedTier = 'annual'"
            >
              <div class="plan-ribbon hot">最受欢迎 · 92% 星友首选</div>
              <div class="plan-top-info">
                <div class="plan-title-row">
                  <span class="plan-name">年度白金 VIP 会员</span>
                  <span class="plan-duration">365 天</span>
                </div>
                <p class="plan-brief">适合系统构建大类资产配置与实盘跟踪的投资者</p>
              </div>

              <div class="plan-price-block">
                <div class="price-main">
                  <span class="currency">¥</span>
                  <span class="amount num-tabular">899</span>
                  <span class="unit">/ 年</span>
                </div>
                <div class="price-origin num-tabular">原价 ¥1,699</div>
              </div>
              <div class="daily-hint">平均每日仅需 2.46 元，享受全年投研成果</div>

              <ul class="plan-key-points">
                <li>✓ 全年 52 期实盘复盘直播与高清回放</li>
                <li>✓ 《严肃理财》及所有专栏长文无限制畅读</li>
                <li>✓ 季度更新的核心底仓安全边际资产跟踪池</li>
                <li>✓ 星球内专家合伙人优先问答特权</li>
              </ul>

              <div class="plan-select-radio">
                <div class="radio-circle"></div>
                <span>{{ selectedTier === 'annual' ? '已选择此方案' : '点击选择此方案' }}</span>
              </div>
            </div>

            <!-- Plan 2: Lifetime -->
            <div 
              :class="['plan-card', { active: selectedTier === 'lifetime' }]" 
              @click="selectedTier = 'lifetime'"
            >
              <div class="plan-ribbon founder">限量尊享 · 终身合伙</div>
              <div class="plan-top-info">
                <div class="plan-title-row">
                  <span class="plan-name">终身创始合伙人</span>
                  <span class="plan-duration">永久有效</span>
                </div>
                <p class="plan-brief">适合高净值家庭全周期资产配置与深度私董交流</p>
              </div>

              <div class="plan-price-block">
                <div class="price-main">
                  <span class="currency">¥</span>
                  <span class="amount num-tabular">2,999</span>
                  <span class="unit">/ 终身</span>
                </div>
                <div class="price-origin num-tabular">原价 ¥5,999</div>
              </div>
              <div class="daily-hint">一次买断，享受未来所有衍生策略与课程更新</div>

              <ul class="plan-key-points">
                <li>✓ 包含年度 VIP 全部权益，永久终身有效</li>
                <li>✓ 赠送星主老林 1 对 1 家庭资产负债表体检诊断</li>
                <li>✓ 闭门私享合伙人微信直通群与闭门研讨会</li>
                <li>✓ 专属终身黑金合伙人尊贵徽章标识</li>
              </ul>

              <div class="plan-select-radio">
                <div class="radio-circle"></div>
                <span>{{ selectedTier === 'lifetime' ? '已选择此方案' : '点击选择此方案' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Privileges Grid -->
        <div class="privileges-checklist-card">
          <h4 class="privileges-heading">开通后您将立即获得的特权清单：</h4>
          <div class="privileges-grid">
            <div class="privilege-col">
              <div class="priv-icon">📈</div>
              <div>
                <div class="priv-title">实时实盘与异动追踪</div>
                <div class="priv-desc">红利低波、海外宽基、估值水位与宏观流动性指标即时更新</div>
              </div>
            </div>

            <div class="privilege-col">
              <div class="priv-icon">📚</div>
              <div>
                <div class="priv-title">全量专业专栏研报</div>
                <div class="priv-desc">畅读《严肃理财》《财报透视》《资产全天候》，沉淀真正底仓逻辑</div>
              </div>
            </div>

            <div class="privilege-col">
              <div class="priv-icon">🎙️</div>
              <div>
                <div class="priv-title">每周私密互动直播</div>
                <div class="priv-desc">每周二晚8点深度市况复盘，支持文字与语音直面星主提问</div>
              </div>
            </div>

            <div class="privilege-col">
              <div class="priv-icon">🤝</div>
              <div>
                <div class="priv-title">1对1 专家咨询通道</div>
                <div class="priv-desc">可直接向星主老林、合伙人 Rich、John 等 9 位专家一对一提问</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="payment-method-box">
          <div class="payment-method-title">选择支付方式</div>
          <div class="payment-options">
            <label 
              :class="['pay-option', { active: paymentMethod === 'wechat' }]" 
              @click="paymentMethod = 'wechat'"
            >
              <input type="radio" value="wechat" v-model="paymentMethod" class="pay-radio" />
              <div class="pay-logo wechat">微</div>
              <div class="pay-info">
                <span class="pay-name">微信支付</span>
                <span class="pay-desc">支持微信零钱、储蓄卡与信用卡快捷支付</span>
              </div>
            </label>

            <label 
              :class="['pay-option', { active: paymentMethod === 'alipay' }]" 
              @click="paymentMethod = 'alipay'"
            >
              <input type="radio" value="alipay" v-model="paymentMethod" class="pay-radio" />
              <div class="pay-logo alipay">支</div>
              <div class="pay-info">
                <span class="pay-name">支付宝</span>
                <span class="pay-desc">支持支付宝快捷支付、花呗分期</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Checkout Bottom Action Bar -->
        <div class="checkout-footer-bar">
          <div class="guarantee-text">
            <span>🔒 银联级安全风控结算 · 7天内不满意无理由退款保障</span>
          </div>

          <div class="action-submit-row">
            <div class="payable-info">
              <span class="label">应付金额：</span>
              <span class="amount num-tabular">¥{{ selectedTier === 'annual' ? '899' : '2,999' }}</span>
            </div>

            <button 
              class="btn-pay-now" 
              :disabled="isPaying" 
              @click="handleStartPayment"
            >
              <span v-if="isPaying" class="spinner"></span>
              <span>{{ isPaying ? '安全支付处理中...' : `立即支付 ¥${selectedTier === 'annual' ? '899' : '2,999'} 并进入星球` }}</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Payment Success Modal -->
    <div v-if="showSuccessModal" class="success-backdrop">
      <div class="success-dialog animate-fade-in">
        <div class="success-icon-wrap">🎉</div>
        <h3 class="success-title">会员开通成功！</h3>
        <p class="success-sub">您已成功升级为「财不外露」{{ selectedTier === 'lifetime' ? '终身创始合伙人' : '年度白金VIP会员' }}</p>
        
        <div class="success-benefits-summary">
          <div class="b-item">✓ 星球动态广场已全面解锁</div>
          <div class="b-item">✓ 深度专栏与直播权限已激活</div>
          <div class="b-item">✓ 专家问答与底仓清单已开启</div>
        </div>

        <button class="btn-enter-community" @click="handleEnterCommunity">
          立即开启「财不外露」私享之旅
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { appState, actions } from '@/stores/community';

const selectedTier = ref<'annual' | 'lifetime'>('annual');
const paymentMethod = ref<'wechat' | 'alipay'>('wechat');
const isPaying = ref(false);
const showSuccessModal = ref(false);

const handleStartPayment = () => {
  isPaying.value = true;
  // 模拟支付处理延迟
  setTimeout(() => {
    isPaying.value = false;
    showSuccessModal.value = true;
  }, 1000);
};

const handleEnterCommunity = () => {
  showSuccessModal.value = false;
  actions.completePayment(selectedTier.value);
};
</script>

<style scoped>
.paywall-page {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* Header */
.paywall-header {
  background: #ffffff;
  border-bottom: 1px solid var(--border-light);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-inner {
  max-width: 1060px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-emblem {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emblem-char {
  color: #f59e0b;
  font-size: 20px;
  font-weight: 800;
}

.brand-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
  display: block;
  line-height: 1.2;
}

.brand-sub {
  font-size: 11px;
  color: var(--text-muted);
}

.header-nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logged-user-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  padding: 3px 10px 3px 4px;
}

.user-pill-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}

.user-pill-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-navy);
}

.btn-logout {
  background: transparent;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--radius-card);
}
.btn-logout:hover {
  color: var(--danger-red);
  background: #fef2f2;
}

.btn-skip-demo {
  background: transparent;
  color: var(--brand-green);
  border: 1px solid var(--brand-green);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: var(--radius-card);
}
.btn-skip-demo:hover {
  background: var(--brand-green-light);
}

/* Main */
.paywall-main {
  flex: 1;
  max-width: 1060px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 24px 60px 24px;
}

.paywall-content-box {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 32px 36px;
  box-shadow: none;
}

/* Step Progress Bar */
.steps-flow-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
}

.step-node {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.node-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.step-node.completed .node-circle {
  background: #ecfdf5;
  color: var(--brand-green);
  border: 1px solid #a7f3d0;
}
.step-node.completed .node-label {
  color: var(--brand-green);
}

.step-node.current .node-circle {
  background: var(--primary-navy);
  color: #ffffff;
}
.step-node.current .node-label {
  color: var(--primary-navy);
  font-weight: 700;
}

.step-node.pending .node-circle {
  background: #f1f5f9;
  color: #94a3b8;
}
.step-node.pending .node-label {
  color: #94a3b8;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e2e8f0;
  margin: 0 16px;
}
.step-line.active {
  background: var(--brand-green);
}

/* Greeting */
.welcome-notice-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 18px 22px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}

.notice-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.notice-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--brand-green);
  border: 2px solid #ffffff;
}

.notice-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 4px;
}

.notice-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Plan Selection */
.plan-selection-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 14px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.plan-card {
  border: 2px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 24px 22px;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}
.plan-card:hover {
  border-color: #cbd5e1;
}
.plan-card.active {
  border-color: #f59e0b;
  background: #fffdfa;
}

.plan-ribbon {
  position: absolute;
  top: -11px;
  right: 18px;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: var(--radius-full);
}
.plan-ribbon.hot {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}
.plan-ribbon.founder {
  background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
  color: #ffffff;
}

.plan-top-info {
  margin-bottom: 14px;
}

.plan-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.plan-name {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
}

.plan-duration {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
}

.plan-brief {
  font-size: 12px;
  color: var(--text-muted);
}

.plan-price-block {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.price-main {
  color: #d97706;
  font-weight: 900;
}
.price-main .currency {
  font-size: 18px;
}
.price-main .amount {
  font-size: 32px;
  letter-spacing: -0.5px;
}
.price-main .unit {
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
}

.price-origin {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
}

.daily-hint {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 16px;
}

.plan-key-points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  flex: 1;
}

.plan-key-points li {
  font-size: 12.5px;
  color: var(--tertiary-navy);
  line-height: 1.4;
}

.plan-select-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px dashed var(--border-light);
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
}
.plan-card.active .plan-select-radio {
  color: #d97706;
}

.radio-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.plan-card.active .radio-circle {
  border-color: #f59e0b;
}
.plan-card.active .radio-circle::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
}

/* Privileges Checklist */
.privileges-checklist-card {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  background: #fbfcfe;
  padding: 20px 24px;
  margin-bottom: 28px;
}

.privileges-heading {
  font-size: 14px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 16px;
}

.privileges-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
}

.privilege-col {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.priv-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.priv-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-navy);
  margin-bottom: 2px;
}

.priv-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Payment Method */
.payment-method-box {
  margin-bottom: 28px;
}

.payment-method-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 12px;
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.pay-option {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 12px 18px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.pay-option:hover {
  border-color: #cbd5e1;
}
.pay-option.active {
  border-color: var(--brand-green);
  background: var(--brand-green-light);
}

.pay-radio {
  accent-color: var(--brand-green);
}

.pay-logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
}
.pay-logo.wechat {
  background: #07c160;
}
.pay-logo.alipay {
  background: #1677ff;
}

.pay-info {
  display: flex;
  flex-direction: column;
}

.pay-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-navy);
}

.pay-desc {
  font-size: 11px;
  color: var(--text-muted);
}

/* Footer Checkout */
.checkout-footer-bar {
  border-top: 1px solid var(--border-light);
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.guarantee-text {
  font-size: 12px;
  color: #64748b;
}

.action-submit-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.payable-info {
  display: flex;
  align-items: baseline;
}
.payable-info .label {
  font-size: 13px;
  color: var(--text-secondary);
}
.payable-info .amount {
  font-size: 28px;
  font-weight: 900;
  color: #d97706;
  margin-left: 4px;
}

.btn-pay-now {
  background: var(--vip-gold-gradient);
  color: #ffffff;
  padding: 12px 28px;
  border-radius: var(--radius-card);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: none;
  transition: all 0.15s ease;
}
.btn-pay-now:hover:not(:disabled) {
  filter: brightness(1.08);
}
.btn-pay-now:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Success Modal */
.success-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.success-dialog {
  background: #ffffff;
  border-radius: var(--radius-card);
  border: 1px solid var(--border-light);
  width: 100%;
  max-width: 460px;
  padding: 36px 32px 30px 32px;
  text-align: center;
  box-shadow: none;
}

.success-icon-wrap {
  font-size: 48px;
  margin-bottom: 12px;
}

.success-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 8px;
}

.success-sub {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.5;
}

.success-benefits-summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-card);
  padding: 16px 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.b-item {
  font-size: 13px;
  font-weight: 600;
  color: #065f46;
}

.btn-enter-community {
  width: 100%;
  background: var(--brand-green);
  color: #ffffff;
  padding: 13px 20px;
  border-radius: var(--radius-card);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-enter-community:hover {
  background: var(--brand-green-hover);
}
</style>
