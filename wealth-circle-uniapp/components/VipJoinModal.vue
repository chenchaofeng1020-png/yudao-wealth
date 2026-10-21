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

          <text class="vip-modal-title">{{ isMember ? '续费「财不外露」年度私享会员' : '开通「财不外露」年度私享会员' }}</text>
          <text class="vip-modal-subtitle">资深宏观对冲视角 · 深度个股产业跟踪 · 建立系统投资框架</text>
        </view>

        <view class="sheet-body">
          <!-- 悬浮价格卡（压住 Hero 下缘） -->
          <view class="vip-pass-card">
            <view class="card-left">
              <view class="pass-tag-row">
                <text class="pass-chip">年度私享会籍</text>
                <text class="pass-duration">365 天有效期</text>
              </view>
              <text class="pass-title">全站核心特权畅读畅享</text>
              <text class="pass-sub">资深分析师及合伙人专属圈子与答疑</text>
            </view>
            <view class="card-divider"></view>
            <view class="card-right">
              <view class="pass-discount-badge">
                <text class="discount-sparkle">✦</text>
                <text>限时特惠 · 立省 ¥400</text>
              </view>
              <view class="price-row">
                <text class="currency">¥</text>
                <text class="price-val">599</text>
                <text class="price-unit">/ 年</text>
              </view>
              <view class="price-compare-row">
                <text class="price-origin">原价 ¥999</text>
                <text class="price-daily">折合仅需 ¥1.64/天</text>
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

      <!-- 支付方式与操作区（固定底部） -->
      <view class="checkout-footer">
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
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { appState, actions } from '../store/community.js';

const isMember = computed(() => appState.isVipMember);

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

const handleConfirmPay = () => {
  actions.completeVipPayment();
};
</script>

<style lang="scss" scoped>
.vip-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(8, 12, 24, 0.78);
  backdrop-filter: blur(10px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.vip-modal-sheet {
  background: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-scroll-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

/* ============ 深色 Hero 头区 ============ */
.vip-hero {
  position: relative;
  background: linear-gradient(160deg, #101a33 0%, #0b1226 55%, #0d1527 100%);
  padding: 26px 20px 46px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -70px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 220px;
  background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.28) 0%, rgba(245, 158, 11, 0.06) 55%, transparent 100%);
  pointer-events: none;
}

.vip-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* 皇冠发光体 */
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
  border: 1px solid rgba(245, 158, 11, 0.45);
  box-shadow: 0 0 24px rgba(245, 158, 11, 0.35), inset 0 0 18px rgba(245, 158, 11, 0.12);
}

.crown-core {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid rgba(217, 119, 6, 0.5);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
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
  letter-spacing: 0.2px;
  text-align: center;
  line-height: 1.4;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.vip-modal-subtitle {
  position: relative;
  z-index: 1;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
  text-align: center;
}

/* ============ 白色主体区 ============ */
.sheet-body {
  padding: 0 16px 4px;
}

/* 悬浮价格卡：压住 Hero 下缘 */
.vip-pass-card {
  position: relative;
  z-index: 2;
  margin-top: -30px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 4px 14px -4px rgba(15, 23, 42, 0.1), 0 1px 4px rgba(245, 158, 11, 0.06);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.pass-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.pass-chip {
  background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 1.5px 7px;
  border-radius: 4px;
}

.pass-duration {
  font-size: 10px;
  color: #94a3b8;
}

.pass-title {
  color: #0f172a;
  font-size: 14px;
  font-weight: 800;
}

.pass-sub {
  color: #94a3b8;
  font-size: 10.5px;
}

.card-divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, transparent 0%, #f1f5f9 25%, #f1f5f9 75%, transparent 100%);
  flex-shrink: 0;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.pass-discount-badge {
  background: #fffbeb;
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #b45309;
  font-size: 9.5px;
  font-weight: 700;
  padding: 1.5px 7px;
  border-radius: 99px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.discount-sparkle {
  color: #f59e0b;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  font-size: 13px;
  font-weight: 800;
  color: #d97706;
}

.price-val {
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.price-unit {
  font-size: 10.5px;
  color: #94a3b8;
  font-weight: 600;
  margin-left: 2px;
}

.price-compare-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
}

.price-origin {
  font-size: 10px;
  color: #b0b7c3;
  text-decoration: line-through;
}

.price-daily {
  font-size: 10px;
  color: #d97706;
  font-weight: 600;
}

/* ============ 核心权益：双列网格 ============ */
.benefits-section {
  margin-top: 16px;
}

.b-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.b-header-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  flex-shrink: 0;
}

.b-header-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.4) 0%, rgba(241, 245, 249, 0) 100%);
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.benefit-card {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 12px;
  padding: 11px 12px;
  display: flex;
  flex-direction: column;
}

.b-card-top {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
}

.b-icon-wrapper {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.theme-amber { background: #fef3c7; color: #b45309; }
.theme-blue { background: #e0f2fe; color: #0369a1; }
.theme-emerald { background: #d1fae5; color: #047857; }
.theme-purple { background: #f3e8ff; color: #7e22ce; }
.theme-rose { background: #ffe4e6; color: #be123c; }
.theme-indigo { background: #e0e7ff; color: #4338ca; }

.b-name {
  font-size: 12.5px;
  font-weight: 800;
  color: #0f172a;
}

.b-desc {
  font-size: 10.5px;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 6px;
  flex: 1;
}

.b-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.b-tag {
  font-size: 9.5px;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 0.5px 5px;
  border-radius: 4px;
}

/* ============ 功能特权横幅 ============ */
.all-access-strip {
  background: linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  padding: 9px 12px;
  margin-top: 10px;
  margin-bottom: 12px;
}

.strip-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 800;
  color: #92400e;
  margin-bottom: 5px;
}

.strip-items {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.strip-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #78350f;
  font-weight: 600;
}

.check-icon {
  color: #d97706;
  font-weight: 900;
}

/* ============ 底部结算区 ============ */
.checkout-footer {
  flex-shrink: 0;
  background: #ffffff;
  border-top: 1px solid rgba(241, 245, 249, 0.9);
  padding: 10px 20px;
  padding-bottom: calc(12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.pay-selector-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.pay-label {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.pay-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.pay-card.active {
  background: #ffffff;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.12);
}

.wechat-icon {
  display: flex;
  align-items: center;
}

.pay-card-name {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.pay-radio-check {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-inner {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
}

/* 立即支付大按钮：金色渐变 + 扫光 */
.btn-vip-checkout {
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #fbbf24 0%, #d97706 55%, #b45309 100%);
  color: #ffffff;
  padding: 13px 16px;
  border-radius: 12px;
  font-size: 14.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 22px rgba(217, 119, 6, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  overflow: hidden;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -60%;
  width: 45%;
  height: 100%;
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.35) 50%, transparent 100%);
  transform: skewX(-20deg);
  animation: shine 2.8s ease-in-out infinite;
}

@keyframes shine {
  0%, 60% { left: -60%; }
  100% { left: 130%; }
}

.btn-text {
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(120, 53, 15, 0.3);
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
  margin-top: 9px;
  color: #a3adbb;
  font-size: 9.5px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.trust-divider {
  color: #d3d9e2;
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
