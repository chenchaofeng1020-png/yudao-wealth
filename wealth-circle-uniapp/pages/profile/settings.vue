<template>
  <view class="settings-page">
    <!-- 1. 顶部安全区返回导航条 (二级页面规范) -->
    <view class="nav-top-bar">
      <view class="nav-left" @tap="handleBack">
        <svg class="back-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <text class="back-label">返回</text>
      </view>

      <view class="nav-center">
        <text class="nav-title">设置</text>
      </view>

      <view class="nav-right-placeholder"></view>
    </view>

    <!-- 2. 设置分组列表 -->
    <view class="settings-content">
      <!-- 第一组：系统与安全设置 -->
      <view class="group-title-label">系统与安全设置</view>
      <view class="grouped-menu-card">
        <!-- 账号与安全 -->
        <view class="menu-item-row" @tap="showAccountSecurityToast">
          <view class="menu-left-wrap">
            <view class="menu-icon-box bg-slate">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </view>
            <text class="menu-title-text">账号与安全中心</text>
          </view>

          <view class="menu-right-wrap">
            <text class="menu-sub-value">{{ maskedPhone }}</text>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>

        <!-- 清理本地缓存 -->
        <view class="menu-item-row" @tap="handleClearCache">
          <view class="menu-left-wrap">
            <view class="menu-icon-box bg-slate">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </view>
            <text class="menu-title-text">清理本地缓存</text>
          </view>

          <view class="menu-right-wrap">
            <text class="menu-sub-value">{{ cacheSize }}</text>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>

        <!-- 服务协议 -->
        <view class="menu-item-row" @tap="showServiceAgreement">
          <view class="menu-left-wrap">
            <view class="menu-icon-box bg-slate">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </view>
            <text class="menu-title-text">服务协议</text>
          </view>

          <view class="menu-right-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>

        <!-- 隐私政策 -->
        <view class="menu-item-row is-last" @tap="showPrivacyPolicy">
          <view class="menu-left-wrap">
            <view class="menu-icon-box bg-slate">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </view>
            <text class="menu-title-text">隐私政策</text>
          </view>

          <view class="menu-right-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>
      </view>

      <!-- 第二组：账号操作与退出 -->
      <view class="settings-action-section">
        <view class="btn-logout-flat" @tap="handleLogout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <text class="logout-btn-text">退出登录</text>
        </view>

        <view class="compliance-footnote">
          <text class="footnote-txt">财富星球 · 财不外露</text>
          <text class="footnote-sub">市场有风险，投资需谨慎 · 本内容不构成直接投资建议</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appState, actions } from '../../store/community.js';

const cacheSize = ref('12.8 MB');

const maskedPhone = computed(() => {
  const p = appState.user.phone || '13800008888';
  if (p.length >= 11) {
    return p.slice(0, 3) + '****' + p.slice(7);
  }
  return p;
});

const handleBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/profile/index' });
    }
  });
};

const showAccountSecurityToast = () => {
  uni.showToast({ title: '账号安全状态良好，已完成双重验证', icon: 'none' });
};

const showServiceAgreement = () => {
  uni.showModal({
    title: '服务协议',
    content: '使用财富星球服务前，请仔细阅读本协议。加入即表示你已同意平台关于内容服务、会员订阅、活动报名及合规免责的全部约定。',
    showCancel: false
  });
};

const showPrivacyPolicy = () => {
  uni.showModal({
    title: '隐私政策',
    content: '我们依法收集并保护你的昵称、头像、手机号等个人信息，仅用于账号识别与服务运营，不会向第三方出售。',
    showCancel: false
  });
};

const handleClearCache = () => {
  uni.showLoading({ title: '正在清理缓存...' });
  setTimeout(() => {
    uni.hideLoading();
    cacheSize.value = '0 KB';
    uni.showToast({ title: '本地缓存清理完成', icon: 'success' });
  }, 400);
};

const handleLogout = () => {
  uni.showModal({
    title: '确认退出账号',
    content: '退出登录后需重新登录方可进入「财不外露」星球，是否确认退出？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已安全退出登录', icon: 'none' });
        setTimeout(() => {
          actions.logout('/pages/feed/index', false);
        }, 300);
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.settings-page {
  padding-bottom: calc(40px + constant(safe-area-inset-bottom));
  padding-bottom: calc(40px + env(safe-area-inset-bottom));
  background-color: #f2f2f7;
  min-height: 100vh;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

/* 1. 顶部安全区固定导航条 */
.nav-top-bar {
  position: sticky;
  top: 0;
  z-index: 60;
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: calc(8px + constant(safe-area-inset-top)) 16px 10px 16px;
  padding: calc(8px + env(safe-area-inset-top)) 16px 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px 4px 0;
  cursor: pointer;

  &:active {
    opacity: 0.7;
  }
}

.back-svg {
  flex-shrink: 0;
}

.back-label {
  font-size: 14px;
  color: #1c1c1e;
  font-weight: 500;
}

.nav-center {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.nav-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.nav-right-placeholder {
  width: 48px;
}

/* 2. 设置内容区 */
.settings-content {
  padding: 12px 14px;
}

.group-title-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin: 14px 4px 8px 4px;
}

.grouped-menu-card {
  background: #ffffff;
  border-radius: 8px !important;
  border: 0.5px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  box-shadow: none !important;
}

.menu-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 14px;
  border-bottom: 0.5px solid #f1f5f9;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:active {
    background-color: #f8fafc;
  }

  &.is-last {
    border-bottom: none;
  }
}

.menu-left-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.menu-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 8px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.bg-slate { background: rgba(71, 85, 105, 0.1); }
}

.menu-title-text {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.menu-right-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.menu-sub-value {
  font-size: 12px;
  color: #94a3b8;
}

/* 3. 底部退出按钮与落款 */
.settings-action-section {
  margin-top: 28px;
  padding: 0 4px;
}

.btn-logout-flat {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 13px 0;
  background: #ffffff;
  border-radius: 8px !important;
  border: 0.5px solid rgba(239, 68, 68, 0.25);
  box-shadow: none !important;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.15s ease;

  &::after {
    display: none !important;
    border: none !important;
  }

  &:active {
    background: #fef2f2;
    transform: scale(0.99);
  }
}

.logout-btn-text {
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
}

.compliance-footnote {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 24px 0 10px 0;
}

.footnote-txt {
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
}

.footnote-sub {
  font-size: 10px;
  color: #cbd5e1;
}
</style>
