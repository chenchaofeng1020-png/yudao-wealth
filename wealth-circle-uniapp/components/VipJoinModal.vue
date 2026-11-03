<template>
  <view v-if="appState.isVipModalVisible" class="vip-modal-backdrop" @tap="close">
    <view class="vip-modal-sheet animate-slide-up" @tap.stop>
      <view class="modal-scroll-body">
        <!-- 深色 Hero 头区 -->
        <view class="vip-hero">
          <view class="hero-glow"></view>
          <!-- 关闭按钮 -->
          <view class="vip-modal-close" @tap="close">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>

          <view class="crown-orbit">
            <view class="crown-ring"></view>
            <view class="crown-core">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 18H20L18.5 10L14 14L12 6L10 14L5.5 10L4 18Z" fill="url(#crown-grad-m)" stroke="#d97706" stroke-width="1.2" stroke-linejoin="round"/>
                <circle cx="12" cy="5" r="1.5" fill="#fde68a" stroke="#d97706" stroke-width="1"/>
                <circle cx="5.5" cy="9" r="1.2" fill="#fde68a" stroke="#d97706" stroke-width="1"/>
                <circle cx="18.5" cy="9" r="1.2" fill="#fde68a" stroke="#d97706" stroke-width="1"/>
                <rect x="4" y="19" width="16" height="2" rx="1" fill="#d97706"/>
                <defs>
                  <linearGradient id="crown-grad-m" x1="4" y1="6" x2="20" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#fef08a" />
                    <stop offset="0.5" stop-color="#f59e0b" />
                    <stop offset="1" stop-color="#b45309" />
                  </linearGradient>
                </defs>
              </svg>
            </view>
          </view>

          <text class="vip-modal-title">{{ isMember ? '续费「财不外露」年度会员' : '开通「财不外露」年度会员' }}</text>
          <text class="vip-modal-subtitle">资深宏观对冲视角 · 深度个股产业跟踪 · 建立系统投资框架</text>
        </view>

        <view class="sheet-body">
          <!-- 悬浮价格卡（压住 Hero 下缘） -->
          <view class="vip-pass-card">
            <view class="card-left">
              <text class="pass-title">年度会员</text>
              <text class="pass-duration">365 天有效期</text>
            </view>
            <view class="card-divider"></view>
            <view class="card-right">
              <view class="price-row">
                <text class="currency">¥</text>
                <text class="price-val">599</text>
                <text class="price-unit">/ 年</text>
              </view>
              <view class="price-compare-row">
                <text class="price-origin">折合仅需 ¥1.64/天</text>
              </view>
            </view>
          </view>

          <!-- 核心权益网格区 -->
          <view class="benefits-section">
            <view class="b-header-row">
              <text class="b-header-title">尊享 6 大核心特权</text>
              <view class="b-header-line"></view>
            </view>

            <view class="benefit-grid">
              <view v-for="b in membershipBenefits" :key="b.name" class="benefit-card">
                <view class="b-card-top">
                  <view class="b-icon-wrapper" :class="getBenefitTheme(b.name)">
                    <!-- 交易追踪 -->
                    <svg v-if="b.name === '交易追踪'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                    <!-- 市场资讯 -->
                    <svg v-else-if="b.name === '市场资讯'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <!-- 理财资讯 -->
                    <svg v-else-if="b.name === '理财资讯'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    <!-- 话题研究 -->
                    <svg v-else-if="b.name === '话题研究'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 18h6"></path>
                      <path d="M10 22h4"></path>
                      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                    </svg>
                    <!-- 会员直播 -->
                    <svg v-else-if="b.name === '会员直播'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <!-- 星球专栏 -->
                    <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </view>
                  <text class="b-name">{{ b.name }}</text>
                </view>
                <text class="b-desc">{{ b.desc }}</text>
                <view v-if="b.tags && b.tags.length" class="b-tags">
                  <text v-for="t in b.tags" :key="t" class="b-tag">#{{ t }}</text>
                </view>
              </view>
            </view>

            <!-- 功能类附加特权横幅 -->
            <view class="all-access-strip">
              <view class="strip-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <text>另享功能特权</text>
              </view>
              <view class="strip-items">
                <view class="strip-item">
                  <text class="check-icon">✓</text>
                  <text>全部帖子详情与评论查看</text>
                </view>
                <view class="strip-item">
                  <text class="check-icon">✓</text>
                  <text>向星主/合伙人/嘉宾提问</text>
                </view>
                <view class="strip-item">
                  <text class="check-icon">✓</text>
                  <text>成员专属交流圈</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 支付方式与操作区（固定底部）：iOS App 走 Apple 内购，H5 走微信支付 -->
      <view class="checkout-footer">
        <!-- iOS App：Apple 内购分支（审核合规：价格周期明示 + 自动续订条款 + 恢复购买） -->
        <template v-if="payChannel === 'ios'">
          <view class="pay-selector-row">
            <text class="pay-label">支付方式</text>
            <view class="pay-card iap-pay active">
              <view class="iap-apple-logo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1f2329">
                  <path d="M17.05 12.54c-.03-2.89 2.36-4.27 2.47-4.34-1.35-1.97-3.44-2.24-4.18-2.27-1.78-.18-3.47 1.05-4.37 1.05-.9 0-2.29-1.02-3.77-1-1.94.03-3.72 1.13-4.72 2.86-2.01 3.49-.51 8.66 1.45 11.49.96 1.39 2.1 2.94 3.6 2.88 1.44-.06 1.99-.93 3.73-.93s2.23.93 3.76.9c1.56-.03 2.54-1.41 3.49-2.8 1.1-1.61 1.55-3.17 1.58-3.25-.04-.02-3.02-1.16-3.04-4.59zM14.17 4.06c.79-.96 1.33-2.29 1.18-3.62-1.14.05-2.53.76-3.35 1.72-.73.85-1.38 2.21-1.21 3.51 1.28.1 2.58-.65 3.38-1.61z"/>
                </svg>
              </view>
              <text class="pay-card-name iap-name">Apple ID 内购</text>
              <view class="pay-radio-check iap-radio-check">
                <view class="radio-inner iap-radio-inner"></view>
              </view>
            </view>
          </view>

          <view class="btn-vip-checkout" @tap="handleConfirmPay">
            <text class="btn-text">{{ isMember ? '通过 App Store 续费 · ¥599/年' : '通过 App Store 订阅 · ¥599/年' }}</text>
            <svg class="btn-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>

          <view class="iap-terms-block">
            <text class="iap-terms-text">确认购买后将通过您的 Apple ID 账户扣款。订阅按年（365 天）自动续期，如需取消请在「设置 → Apple ID → 订阅」中关闭，至少提前 24 小时操作。</text>
            <view class="iap-terms-links">
              <text class="iap-link">用户协议</text>
              <text class="iap-link-divider">·</text>
              <text class="iap-link">隐私政策</text>
              <text class="iap-link-divider">·</text>
              <text class="iap-link iap-restore" @tap="handleRestorePurchase">恢复购买</text>
            </view>
          </view>
        </template>

        <!-- H5：微信支付分支（现有流程） -->
        <template v-else>
          <view class="pay-selector-row">
            <text class="pay-label">支付方式</text>
            <view class="pay-card wechat-pay active">
              <view class="wechat-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#07c160">
                  <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.94.97 3.69 2.5 4.88L2.7 16.2c-.08.26.17.49.42.39l3.52-1.4c.59.19 1.21.31 1.86.31h.5c-.17-.64-.26-1.31-.26-2 0-4.14 3.81-7.5 8.5-7.5.34 0 .67.02 1 .06C17.06 3.69 13.09 2 8.5 2zm-2.25 5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm5.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
                  <path d="M16 9c-3.87 0-7 2.69-7 6s3.13 6 7 6c.55 0 1.09-.06 1.6-.18l2.94 1.17c.21.08.42-.11.35-.33l-.68-2.33c1.07-.99 1.79-2.4 1.79-3.95 0-3.31-3.13-6-7-6zm-2.5 4.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </view>
              <text class="pay-card-name">微信支付</text>
              <view class="pay-radio-check">
                <view class="radio-inner"></view>
              </view>
            </view>
          </view>

          <!-- 立即支付大按钮 -->
          <view class="btn-vip-checkout" @tap="handleConfirmPay">
            <view class="btn-shine"></view>
            <text class="btn-text">{{ isMember ? '立即续费 ¥599' : '立即支付 ¥599 · 解锁全站私享特权' }}</text>
            <svg class="btn-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>

          <!-- 安全背书与有效期提示 -->
          <view class="pay-trust-row">
            <view class="trust-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <text>安全合规支付</text>
            </view>
            <text class="trust-divider">·</text>
            <view class="trust-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              <text>支付成功即开通 365 天会员权益</text>
            </view>
            <text class="trust-divider">·</text>
            <view class="trust-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <text>官方权益保障</text>
            </view>
          </view>
        </template>
      </view>
    </view>

    <!-- App Store 收银台确认弹层（iOS 内购沙盒演示：真实环境由 StoreKit 系统弹层接管） -->
    <view v-if="isIAPSheetVisible" class="iap-sheet-backdrop" @tap="!isIAPPaying && (isIAPSheetVisible = false)">
      <view class="iap-sheet" @tap.stop>
        <text class="iap-sheet-title">确认订阅</text>
        <view class="iap-sheet-app-row">
          <image src="/static/brand_logo.jpg" class="iap-sheet-app-icon" mode="aspectFill" />
          <view class="iap-sheet-app-meta">
            <text class="iap-sheet-app-name">财不外露</text>
            <text class="iap-sheet-app-sub">App 内购买</text>
          </view>
        </view>
        <view class="iap-sheet-plan-row">
          <view class="iap-sheet-plan-meta">
            <text class="iap-sheet-plan-name">年度会员（自动续期）</text>
            <text class="iap-sheet-plan-sub">按年计费 · 365 天有效期</text>
          </view>
          <text class="iap-sheet-plan-price">¥599.00/年</text>
        </view>
        <view class="iap-sheet-confirm-btn" :class="{ 'is-paying': isIAPPaying }" @tap="confirmIAPPurchase">
          <text>{{ isIAPPaying ? '正在处理…' : '订阅' }}</text>
        </view>
        <text class="iap-sheet-account-hint">Apple ID：demo@icloud.com（沙盒测试账号）</text>
        <view class="iap-sheet-cancel" @tap="isIAPSheetVisible = false">
          <text>取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appState, actions } from '../store/community.js';

const isMember = computed(() => appState.isVipMember);

// 支付渠道：真实 iOS App（壳工程 userAgent 带 WealthPlanetApp 标记）走 Apple 内购；H5 走微信支付。
// payChannelSim 供验收控制台强制切换演示。
const isIOSAppRuntime = typeof navigator !== 'undefined' && /WealthPlanetApp/i.test(navigator.userAgent || '');
const payChannel = computed(() => {
  if (appState.payChannelSim === 'h5') return 'h5';
  if (appState.payChannelSim === 'ios') return 'ios';
  return isIOSAppRuntime ? 'ios' : 'h5';
});

// App Store 收银台模拟（真实环境由 StoreKit 系统弹层与后端凭证验证接管）
const isIAPSheetVisible = ref(false);
const isIAPPaying = ref(false);

const handleConfirmPay = () => {
  if (payChannel.value === 'ios') {
    isIAPSheetVisible.value = true;
    return;
  }
  actions.completeVipPayment();
};

const confirmIAPPurchase = () => {
  if (isIAPPaying.value) return;
  isIAPPaying.value = true;
  setTimeout(() => {
    isIAPPaying.value = false;
    isIAPSheetVisible.value = false;
    actions.completeVipPayment();
  }, 1200);
};

const handleRestorePurchase = () => {
  uni.showToast({ title: '沙盒演示：未找到可恢复的购买', icon: 'none' });
};

// 与 PC 端 membershipBenefits 保持一致
const membershipBenefits = [
  {
    name: '交易追踪',
    desc: '聚焦港美股重点个股，跟踪基本面、预期与资金风向，辅助识别阶段性机会。',
    tags: ['个股资讯', '公司财报', '机构持仓'],
  },
  {
    name: '市场资讯',
    desc: '聚焦宏观环境、政策变化、机构观点与市场主线，理解资产价格核心逻辑。',
    tags: ['机构观点', '宏观市场', '宏观周报'],
  },
  {
    name: '理财资讯',
    desc: '围绕基金、债券、港股打新、结构化产品等资产，拆解收益来源与风险边界。',
    tags: ['港股打新', '基金组合', '债券优选'],
  },
  {
    name: '话题研究',
    desc: '每周深度解析财经热点、产业周期、宏观趋势、金融产品与投资方法论，形成系统投资认知。',
    tags: [],
  },
  {
    name: '会员直播',
    desc: '每周会员直播，复盘市场行情、解析宏观主线、板块机会、重点个股，分享配置思路与重点机会。',
    tags: [],
  },
  {
    name: '星球专栏',
    desc: '系统梳理经济、金融、投资、理财与资产配置知识，搭建从基础认知到实战应用的投资理财框架。',
    tags: [],
  },
];

// 为不同权益项赋予专属色彩微调（与 PC 端一致）
const getBenefitTheme = (name) => {
  switch (name) {
    case '交易追踪': return 'theme-amber';
    case '市场资讯': return 'theme-blue';
    case '理财资讯': return 'theme-emerald';
    case '话题研究': return 'theme-purple';
    case '会员直播': return 'theme-rose';
    case '星球专栏': return 'theme-indigo';
    default: return 'theme-amber';
  }
};

const close = () => {
  appState.isVipModalVisible = false;
};
</script>

<style lang="scss" scoped>
.vip-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(9, 13, 24, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.vip-modal-sheet {
  background: #f8fafc;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 -16px 48px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.modal-scroll-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ============ 深色 Hero 头区 ============ */
.vip-hero {
  position: relative;
  background: linear-gradient(175deg, #090e1d 0%, #0d1527 60%, #111a30 100%);
  padding: 24px 20px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 200px;
  background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.03) 60%, transparent 80%);
  pointer-events: none;
}

.vip-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.16);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.15s ease;

  &:active {
    background: rgba(255, 255, 255, 0.16);
    transform: scale(0.95);
  }
}

/* 皇冠铸币徽标 */
.crown-orbit {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.crown-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 0.5px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 0 28px rgba(245, 158, 11, 0.22), inset 0 0 14px rgba(245, 158, 11, 0.08);
}

.crown-core {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fffbeb 0%, #fef3c7 45%, #fde68a 100%);
  border: 1px solid rgba(217, 119, 6, 0.45);
  box-shadow: 0 4px 14px rgba(180, 83, 9, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vip-modal-title {
  position: relative;
  z-index: 1;
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.2px;
  text-align: center;
  line-height: 1.38;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}

.vip-modal-subtitle {
  position: relative;
  z-index: 1;
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 5px;
  letter-spacing: 0.3px;
  text-align: center;
  line-height: 1.45;
}

/* ============ 主体内容区 ============ */
.sheet-body {
  padding: 0 16px 8px;
}

/* 悬浮价格卡：压住 Hero 下缘，高奢黑金卡片质感 */
.vip-pass-card {
  position: relative;
  z-index: 2;
  margin-top: -26px;
  background: #ffffff;
  border-radius: 16px;
  border: 0.5px solid rgba(217, 119, 6, 0.22);
  box-shadow: 0 10px 28px -6px rgba(15, 23, 42, 0.08), 0 2px 8px -2px rgba(217, 119, 6, 0.05);
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.card-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.pass-title {
  color: #0f172a;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.2px;
}

.pass-duration {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
}

.card-divider {
  width: 0.5px;
  align-self: stretch;
  background: #f1f5f9;
  flex-shrink: 0;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.pass-discount-badge {
  background: rgba(217, 119, 6, 0.07);
  border: 0.5px solid rgba(217, 119, 6, 0.28);
  color: #b45309;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 3px;
  line-height: 1;
}

.discount-sparkle {
  color: #d97706;
  font-size: 9px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 1px;
}

.currency {
  font-size: 14px;
  font-weight: 800;
  color: #b45309;
  margin-right: 1px;
}

.price-val {
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  color: #b45309;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
}

.price-unit {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  margin-left: 2px;
}

.price-compare-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.price-origin {
  font-size: 10.5px;
  color: #94a3b8;
}

.price-daily {
  font-size: 10.5px;
  color: #b45309;
  font-weight: 600;
}

/* ============ 核心权益：双列网格 ============ */
.benefits-section {
  margin-top: 18px;
}

.b-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.b-header-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  flex-shrink: 0;
  letter-spacing: 0.1px;
}

.b-header-line {
  flex: 1;
  height: 0.5px;
  background: linear-gradient(90deg, rgba(217, 119, 6, 0.35) 0%, rgba(226, 232, 240, 0.6) 60%, transparent 100%);
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.benefit-card {
  background: #ffffff;
  border: 0.5px solid #eef2f6;
  border-radius: 12px;
  padding: 12px 13px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px -2px rgba(15, 23, 42, 0.04);
}

.b-card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

/* 图标容器：采用现代高端微透色系（8% 极微透明度，告别粗糙色块） */
.b-icon-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.theme-amber { background: rgba(217, 119, 6, 0.08); color: #b45309; }
.theme-blue { background: rgba(37, 99, 235, 0.08); color: #1d4ed8; }
.theme-emerald { background: rgba(16, 185, 129, 0.08); color: #059669; }
.theme-purple { background: rgba(147, 51, 234, 0.08); color: #7e22ce; }
.theme-rose { background: rgba(225, 29, 72, 0.08); color: #be123c; }
.theme-indigo { background: rgba(79, 70, 229, 0.08); color: #4338ca; }

.b-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.b-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 8px;
  flex: 1;
}

.b-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.b-tag {
  font-size: 10px;
  color: #475569;
  background: #f8fafc;
  border: 0.5px solid #e2e8f0;
  padding: 1.5px 6px;
  border-radius: 4px;
  font-weight: 500;
  line-height: 1.25;
}

/* ============ 功能特权横幅 ============ */
.all-access-strip {
  background: linear-gradient(135deg, #fdfbf7 0%, #fefcf9 100%);
  border: 0.5px solid rgba(217, 119, 6, 0.22);
  border-radius: 12px;
  padding: 10px 14px;
  margin-top: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(217, 119, 6, 0.04);
}

.strip-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 6px;
}

.strip-items {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 14px;
}

.strip-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #57534e;
  font-weight: 500;
}

.check-icon {
  color: #d97706;
  font-weight: 800;
  font-size: 11px;
}

/* ============ 底部结算区 ============ */
.checkout-footer {
  flex-shrink: 0;
  background: #ffffff;
  border-top: 0.5px solid #f1f5f9;
  padding: 12px 18px;
  padding-bottom: calc(14px + constant(safe-area-inset-bottom));
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.03);
}

.pay-selector-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;
}

.pay-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.pay-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: 8px;
  background: #f8fafc;
  border: 0.5px solid #e2e8f0;
}

.pay-card.active {
  background: #f0fdf4;
  border-color: rgba(16, 185, 129, 0.4);
}

.wechat-icon {
  display: flex;
  align-items: center;
}

.pay-card-name {
  font-size: 12px;
  font-weight: 600;
  color: #065f46;
}

.pay-radio-check {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1.5px solid #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
}

.radio-inner {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
}

/* ============ iOS Apple 内购分支 ============ */
.pay-card.iap-pay.active {
  background: #f1f5f9;
  border-color: rgba(31, 35, 41, 0.28);
}

.iap-apple-logo {
  display: flex;
  align-items: center;
}

.pay-card-name.iap-name {
  color: #1f2329;
}

.pay-radio-check.iap-radio-check {
  border-color: #1f2329;
}

.radio-inner.iap-radio-inner {
  background: #1f2329;
}

/* 自动续订条款与协议/恢复购买（审核合规必备） */
.iap-terms-block {
  margin-top: 10px;
  text-align: center;
}

.iap-terms-text {
  display: block;
  font-size: 10px;
  color: #94a3b8;
  line-height: 1.55;
}

.iap-terms-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;
}

.iap-link {
  font-size: 10.5px;
  font-weight: 600;
  color: #0284c7;
}

.iap-link-divider {
  font-size: 10px;
  color: #cbd5e1;
}

/* ============ App Store 收银台模拟弹层 ============ */
.iap-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(9, 13, 24, 0.55);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 34px;
}

.iap-sheet {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 18px 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: iapPop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes iapPop {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.iap-sheet-title {
  font-size: 15px;
  font-weight: 800;
  color: #1f2329;
  text-align: center;
  margin-bottom: 14px;
}

.iap-sheet-app-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 0.5px solid #f1f5f9;
}

.iap-sheet-app-icon {
  width: 40px;
  height: 40px;
  border-radius: 9px;
  flex-shrink: 0;
}

.iap-sheet-app-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.iap-sheet-app-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

.iap-sheet-app-sub {
  font-size: 11px;
  color: #94a3b8;
}

.iap-sheet-plan-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 0.5px solid #f1f5f9;
}

.iap-sheet-plan-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.iap-sheet-plan-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.iap-sheet-plan-sub {
  font-size: 11px;
  color: #94a3b8;
}

.iap-sheet-plan-price {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
}

.iap-sheet-confirm-btn {
  margin-top: 14px;
  height: 40px;
  border-radius: 20px;
  background: #0a84ff;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;

  &.is-paying {
    opacity: 0.6;
  }
}

.iap-sheet-account-hint {
  margin-top: 9px;
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
}

.iap-sheet-cancel {
  margin-top: 10px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    font-size: 13px;
    font-weight: 600;
    color: #0a84ff;
  }
}

/* 立即支付大按钮：奢雅琥珀金渐变 + 沉稳阴影 */
.btn-vip-checkout {
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #d97706 0%, #b45309 60%, #92400e 100%);
  color: #ffffff;
  padding: 13.5px 18px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 6px 18px -2px rgba(180, 83, 9, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  transition: transform 0.12s ease, opacity 0.12s ease;

  &:active {
    transform: scale(0.985);
    opacity: 0.92;
  }
}

.btn-shine {
  display: none;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-arrow {
  position: relative;
  z-index: 1;
}

/* 信任背书行 */
.pay-trust-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3px 6px;
  margin-top: 10px;
  color: #94a3b8;
  font-size: 10px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.trust-divider {
  color: #cbd5e1;
}

.animate-slide-up {
  animation: slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
