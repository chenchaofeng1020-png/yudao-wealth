<template>
  <div v-if="appState.isVipJoinModalOpen" class="modal-backdrop" @click.self="appState.isVipJoinModalOpen = false">
    <div class="vip-modal-dialog animate-fade-in">
      <!-- 装饰背景光斑 -->
      <div class="header-glow"></div>

      <!-- 关闭按钮 -->
      <button class="vip-modal-close" @click="appState.isVipJoinModalOpen = false" aria-label="关闭弹窗">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- 头部：VIP 徽章与标题 (固定不压缩) -->
      <div class="vip-modal-header">
        <div class="vip-badge-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <!-- 皇冠主体 -->
            <path d="M4 18H20L18.5 10L14 14L12 6L10 14L5.5 10L4 18Z" fill="url(#crown-grad)" stroke="#d97706" stroke-width="1.2" stroke-linejoin="round"/>
            <circle cx="12" cy="5" r="1.5" fill="#fde68a" stroke="#d97706" stroke-width="1"/>
            <circle cx="5.5" cy="9" r="1.2" fill="#fde68a" stroke="#d97706" stroke-width="1"/>
            <circle cx="18.5" cy="9" r="1.2" fill="#fde68a" stroke="#d97706" stroke-width="1"/>
            <rect x="4" y="19" width="16" height="2" rx="1" fill="#d97706"/>
            <defs>
              <linearGradient id="crown-grad" x1="4" y1="6" x2="20" y2="19" gradientUnits="userSpaceOnUse">
                <stop stop-color="#fef08a" />
                <stop offset="0.5" stop-color="#f59e0b" />
                <stop offset="1" stop-color="#b45309" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="vip-header-text">
          <h2 class="vip-modal-title">
            {{ isMember ? '续费「财不外露」年度私享会员' : '开通「财不外露」年度私享会员' }}
          </h2>
          <p class="vip-modal-subtitle">资深宏观对冲视角 · 深度个股产业跟踪 · 建立系统投资框架</p>
        </div>
      </div>

      <!-- 中间可滚动区域 (包含 VIP通行证卡片、6大核心特权、功能特权条) -->
      <div class="modal-scroll-body">
        <!-- VIP 通行证价格卡片 -->
        <div class="vip-pass-card">
          <div class="card-watermark">VIP</div>
          <div class="card-left">
            <div class="pass-tag-row">
              <span class="pass-chip">年度私享会籍</span>
              <span class="pass-duration">365 天有效期</span>
            </div>
            <div class="pass-title">全站核心特权畅读畅享</div>
            <div class="pass-sub">资深分析师及合伙人专属圈子与答疑</div>
          </div>

          <div class="card-right">
            <div class="pass-discount-badge">
              <span class="discount-sparkle">✦</span> 限时特惠 · 立省 ¥400
            </div>
            <div class="price-row">
              <span class="currency">¥</span>
              <span class="price-val num-tabular">599</span>
              <span class="price-unit">/ 年</span>
            </div>
            <div class="price-compare-row">
              <span class="price-origin num-tabular">原价 ¥999</span>
              <span class="price-daily">折合仅需 ¥1.64/天</span>
            </div>
          </div>
        </div>

        <!-- 核心权益网格区 -->
        <div class="benefits-section">
          <div class="benefits-header">
            <span class="b-header-title">尊享 6 大核心特权</span>
          </div>

          <div class="benefit-grid">
            <div v-for="b in membershipBenefits" :key="b.name" class="benefit-card">
              <div class="b-card-top">
                <div class="b-icon-wrapper" :class="getBenefitTheme(b.name)">
                  <!-- 交易追踪 -->
                  <svg v-if="b.name === '交易追踪'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                  <!-- 市场资讯 -->
                  <svg v-else-if="b.name === '市场资讯'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <!-- 理财资讯 -->
                  <svg v-else-if="b.name === '理财资讯'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  <!-- 话题研究 -->
                  <svg v-else-if="b.name === '话题研究'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                  </svg>
                  <!-- 会员直播 -->
                  <svg v-else-if="b.name === '会员直播'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  <!-- 星球专栏 -->
                  <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div class="b-name">{{ b.name }}</div>
              </div>

              <div class="b-desc">{{ b.desc }}</div>

              <div v-if="b.tags && b.tags.length" class="b-tags">
                <span v-for="t in b.tags" :key="t" class="b-tag">#{{ t }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 功能类附加特权横幅 -->
        <div class="all-access-strip">
          <div class="strip-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>另享功能特权</span>
          </div>
          <div class="strip-items">
            <div class="strip-item">
              <span class="check-icon">✓</span>
              <span>全部帖子详情与评论查看</span>
            </div>
            <div class="strip-item">
              <span class="check-icon">✓</span>
              <span>向星主/合伙人/嘉宾提问</span>
            </div>
            <div class="strip-item">
              <span class="check-icon">✓</span>
              <span>成员专属交流圈</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 支付方式与操作区 (固定底部不压缩) -->
      <div class="checkout-footer">
        <div class="pay-selector-row">
          <span class="pay-label">支付方式：</span>
          <div class="pay-card wechat-pay active">
            <div class="wechat-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#07c160">
                <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.94.97 3.69 2.5 4.88L2.7 16.2c-.08.26.17.49.42.39l3.52-1.4c.59.19 1.21.31 1.86.31h.5c-.17-.64-.26-1.31-.26-2 0-4.14 3.81-7.5 8.5-7.5.34 0 .67.02 1 .06C17.06 3.69 13.09 2 8.5 2zm-2.25 5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm5.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
                <path d="M16 9c-3.87 0-7 2.69-7 6s3.13 6 7 6c.55 0 1.09-.06 1.6-.18l2.94 1.17c.21.08.42-.11.35-.33l-.68-2.33c1.07-.99 1.79-2.4 1.79-3.95 0-3.31-3.13-6-7-6zm-2.5 4.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <span class="pay-card-name">微信支付</span>
            <div class="pay-radio-check">
              <span class="radio-inner"></span>
            </div>
          </div>
        </div>

        <!-- 立即支付大按钮 -->
        <button class="btn-vip-checkout" @click="actions.joinVip">
          <span class="btn-text">
            {{ isMember ? '立即续费 ¥599' : '立即支付 ¥599 · 解锁全站私享特权' }}
          </span>
          <svg class="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- 安全背书与有效期提示 -->
        <div class="pay-trust-row">
          <div class="trust-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>安全合规支付</span>
          </div>
          <span class="trust-divider">·</span>
          <div class="trust-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <span>支付成功即开通 365 天会员权益</span>
          </div>
          <span class="trust-divider">·</span>
          <div class="trust-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>官方权益保障</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { appState, actions } from '@/stores/community';
import { membershipBenefits } from '@/mock/data';

const isMember = computed(() => appState.isVipMember);

// 为不同权益项赋予专属色彩微调
const getBenefitTheme = (name: string) => {
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
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 29, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
  overflow-y: auto;
}

.vip-modal-dialog {
  width: 680px;
  max-height: min(92vh, 760px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 64px -12px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(245, 158, 11, 0.22);
  position: relative;
  overflow: hidden;
  padding: 22px 26px 18px 26px;
  margin: auto;
}

/* 顶部柔和暖金光晕背景 */
.header-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 440px;
  height: 180px;
  background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.14) 0%, rgba(245, 158, 11, 0.03) 65%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}

/* 优雅关闭按钮 */
.vip-modal-close {
  position: absolute;
  top: 16px;
  right: 18px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.18s ease;
}

.vip-modal-close:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: rotate(90deg);
}

/* 头部设计 */
.vip-modal-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
  padding-right: 40px;
  flex-shrink: 0;
}

.vip-badge-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid rgba(245, 158, 11, 0.4);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vip-header-text {
  flex: 1;
}

.vip-modal-title {
  font-size: 18.5px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.2px;
  line-height: 1.3;
}

.vip-modal-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  letter-spacing: 0.1px;
}

/* VIP 通行证卡片 */
.vip-pass-card {
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #0d1527 0%, #152037 45%, #0f172a 100%);
  border-radius: 14px;
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.card-watermark {
  position: absolute;
  right: 180px;
  top: -15px;
  font-size: 80px;
  font-weight: 900;
  font-style: italic;
  color: rgba(255, 255, 255, 0.03);
  pointer-events: none;
  user-select: none;
}

.card-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pass-tag-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pass-chip {
  background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  padding: 1px 7px;
  border-radius: 4px;
  letter-spacing: 0.3px;
}

.pass-duration {
  font-size: 11px;
  color: #94a3b8;
}

.pass-title {
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.pass-sub {
  color: #94a3b8;
  font-size: 11px;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.pass-discount-badge {
  background: rgba(245, 158, 11, 0.18);
  border: 1px solid rgba(245, 158, 11, 0.45);
  color: #fbbf24;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 99px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.discount-sparkle {
  color: #f59e0b;
  font-size: 10px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  font-size: 15px;
  font-weight: 800;
  color: #fbbf24;
}

.price-val {
  font-size: 30px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
}

.price-unit {
  font-size: 11.5px;
  color: #cbd5e1;
  font-weight: 600;
  margin-left: 2px;
}

.price-compare-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.price-origin {
  font-size: 11px;
  color: #64748b;
  text-decoration: line-through;
}

.price-daily {
  font-size: 11px;
  color: #fbbf24;
  font-weight: 600;
}

/* 中间滚动容器 */
.modal-scroll-body {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  margin-bottom: 10px;
  overscroll-behavior: contain;
}

/* 滚动条美化：默认隐藏，鼠标移入显示，移除隐藏 */
.modal-scroll-body::-webkit-scrollbar {
  width: 5px;
}
.modal-scroll-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}
.modal-scroll-body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
  transition: background 0.25s ease;
}

.modal-scroll-body:hover::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.modal-scroll-body:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
.modal-scroll-body::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}

/* 核心权益区 */
.benefits-section {
  position: relative;
}

.benefits-header {
  margin-bottom: 8px;
}

.b-header-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 9px;
}

.benefit-card {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 11px;
  padding: 10px 12px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.benefit-card:hover {
  background: #ffffff;
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  transform: translateY(-1px);
}

.b-card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.b-icon-wrapper {
  width: 27px;
  height: 27px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 主题色彩微调 */
.theme-amber { background: #fef3c7; color: #b45309; }
.theme-blue { background: #e0f2fe; color: #0369a1; }
.theme-emerald { background: #d1fae5; color: #047857; }
.theme-purple { background: #f3e8ff; color: #7e22ce; }
.theme-rose { background: #ffe4e6; color: #be123c; }
.theme-indigo { background: #e0e7ff; color: #4338ca; }

.b-name {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.1px;
}

.b-desc {
  font-size: 12.5px;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 6px;
  flex: 1;
}

.b-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.b-tag {
  font-size: 11px;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 1.5px 6.5px;
  border-radius: 4px;
}

/* 全站功能特权横幅 */
.all-access-strip {
  position: relative;
  background: linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  padding: 9px 14px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.strip-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 800;
  color: #92400e;
  flex-shrink: 0;
}

.strip-items {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.strip-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #78350f;
  font-weight: 600;
}

.check-icon {
  color: #d97706;
  font-weight: 900;
  font-size: 12px;
}

/* 结算区域 (固定底部) */
.checkout-footer {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  border-top: 1px solid rgba(241, 245, 249, 0.9);
  padding-top: 10px;
}

.pay-selector-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 9px;
}

.pay-label {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.pay-card {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s ease;
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
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-inner {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

/* 立即支付大按钮 */
.btn-vip-checkout {
  width: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-vip-checkout::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transform: skewX(-20deg);
  transition: 0.6s ease;
}

.btn-vip-checkout:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.45);
  filter: brightness(1.05);
}

.btn-vip-checkout:hover::before {
  left: 140%;
}

.btn-vip-checkout:active {
  transform: translateY(0);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-arrow {
  position: relative;
  z-index: 1;
  transition: transform 0.15s ease;
}

.btn-vip-checkout:hover .btn-arrow {
  transform: translateX(3px);
}

/* 信任与安全背书 */
.pay-trust-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  color: #94a3b8;
  font-size: 11px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trust-divider {
  color: #cbd5e1;
}

@media (max-width: 680px) {
  .vip-modal-dialog {
    width: 95vw;
    padding: 18px 14px 14px 14px;
    border-radius: 16px;
    max-height: 94vh;
  }
  .vip-pass-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
  }
  .card-right {
    align-items: flex-start;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 8px;
  }
  .benefit-grid {
    grid-template-columns: 1fr;
  }
  .all-access-strip {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .strip-items {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .pay-trust-row {
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
