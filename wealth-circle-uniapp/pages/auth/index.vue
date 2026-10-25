<template>
  <view class="auth-page">
    <view class="auth-stage">
      <!-- 1. 顶部品牌标识与标题（文案与 PC 端完全一致，星轨围绕「财」字徽标中心展开） -->
      <view class="auth-header">
        <!-- 围绕徽标展开的星轨与光晕装饰 -->
        <view class="header-orbit-backdrop" aria-hidden="true">
          <svg class="orbit-svg" viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="46%" r="45%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.16" />
                <stop offset="55%" stop-color="#10b981" stop-opacity="0.045" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
              </radialGradient>
              <linearGradient id="ringGrad" x1="30" y1="40" x2="330" y2="190" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.06" />
                <stop offset="50%" stop-color="#10b981" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.14" />
              </linearGradient>
            </defs>

            <!-- 核心柔和光晕（以徽标为中心 cx=180, cy=110，半径 96 完全在画布内不裁切） -->
            <circle cx="180" cy="110" r="96" fill="url(#coreGlow)" />

            <!-- 同心圆轨与倾角行星环 -->
            <circle cx="180" cy="110" r="48" stroke="#10b981" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="3 4" />
            <circle cx="180" cy="110" r="76" stroke="#10b981" stroke-opacity="0.1" stroke-width="0.8" />
            <ellipse cx="180" cy="110" rx="138" ry="44" transform="rotate(-13 180 110)" stroke="url(#ringGrad)" stroke-width="1.1" />
            <ellipse cx="180" cy="110" rx="118" ry="34" transform="rotate(15 180 110)" stroke="#0f172a" stroke-opacity="0.05" stroke-width="0.8" stroke-dasharray="4 6" />

            <!-- 轨道星球节点与微星芒 -->
            <circle cx="246" cy="82" r="2.8" fill="#f59e0b" fill-opacity="0.7" />
            <circle cx="246" cy="82" r="6.5" stroke="#f59e0b" stroke-opacity="0.24" stroke-width="0.9" />
            <circle cx="112" cy="130" r="2.4" fill="#10b981" fill-opacity="0.6" />
            <circle cx="288" cy="120" r="1.8" fill="#10b981" fill-opacity="0.4" />
            <path d="M76 80V86M73 83H79" stroke="#10b981" stroke-opacity="0.38" stroke-width="1.1" stroke-linecap="round" />
            <path d="M284 70V76M281 73H287" stroke="#d97706" stroke-opacity="0.35" stroke-width="1.1" stroke-linecap="round" />
          </svg>
        </view>

        <view class="logo-pedestal">
          <view class="logo-orbit-ring"></view>
          <view class="auth-logo-badge">
            <image src="/static/brand_logo.jpg" class="logo-img" mode="aspectFill" />
          </view>
        </view>

        <text class="auth-title">
          {{ authMode === 'register' ? '注册「财不外露」' : '登录「财不外露」' }}
        </text>
      </view>

      <!-- 2. 书卷质感主卡片容器 + 底部微露叠纸层 -->
      <view class="auth-card-wrapper">
        <view class="auth-dossier-card">
          <!-- 表单区（字段、标签、占位符与 PC 端完全一致） -->
          <view class="auth-form">
            <!-- 昵称（仅注册模式） -->
            <view v-if="authMode === 'register'" class="form-group">
              <text class="form-label">昵称</text>
              <view class="input-surface" :class="{ 'is-focused': focusedField === 'nickname' }">
                <input
                  v-model="nickname"
                  type="text"
                  maxlength="20"
                  placeholder="请输入您的称呼"
                  placeholder-class="input-placeholder"
                  class="form-input"
                  @focus="focusedField = 'nickname'"
                  @blur="focusedField = ''"
                />
              </view>
            </view>

            <!-- 手机号码 -->
            <view class="form-group">
              <text class="form-label">手机号码</text>
              <view class="phone-input-wrap" :class="{ 'is-focused': focusedField === 'phone' }">
                <view class="phone-prefix">
                  <text class="phone-prefix-txt">+86</text>
                </view>
                <input
                  v-model="phone"
                  type="number"
                  maxlength="11"
                  placeholder="请输入手机号码"
                  placeholder-class="input-placeholder"
                  class="form-input phone-input"
                  @focus="focusedField = 'phone'"
                  @blur="focusedField = ''"
                />
              </view>
            </view>

            <!-- 密码 -->
            <view class="form-group">
              <text class="form-label">密码</text>
              <view class="input-surface" :class="{ 'is-focused': focusedField === 'password' }">
                <input
                  v-model="password"
                  :password="true"
                  :placeholder="authMode === 'register' ? '请设置密码' : '请输入密码'"
                  placeholder-class="input-placeholder"
                  class="form-input"
                  @focus="focusedField = 'password'"
                  @blur="focusedField = ''"
                  @confirm="handleSubmit"
                />
              </view>
            </view>

            <!-- 确认密码（仅注册模式） -->
            <view v-if="authMode === 'register'" class="form-group">
              <text class="form-label">确认密码</text>
              <view class="input-surface" :class="{ 'is-focused': focusedField === 'confirmPassword' }">
                <input
                  v-model="confirmPassword"
                  :password="true"
                  placeholder="请再次输入密码"
                  placeholder-class="input-placeholder"
                  class="form-input"
                  @focus="focusedField = 'confirmPassword'"
                  @blur="focusedField = ''"
                  @confirm="handleSubmit"
                />
              </view>
            </view>
          </view>

          <!-- 协议勾选（文案与 PC 端完全一致） -->
          <view class="terms-row" @tap="agreeTerms = !agreeTerms">
            <view class="terms-checkbox" :class="{ checked: agreeTerms }">
              <svg v-if="agreeTerms" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </view>
            <view class="terms-text">
              <text>我已阅读并同意 </text>
              <text class="terms-link" @tap.stop="openLegal('terms')">《服务协议》</text>
              <text> 与 </text>
              <text class="terms-link" @tap.stop="openLegal('privacy')">《隐私政策》</text>
            </view>
          </view>

          <!-- 提交按钮与模式切换（文案与 PC 端完全一致） -->
          <view class="auth-action-area">
            <view
              class="btn-auth-submit"
              :class="{ disabled: isSubmitting }"
              @tap="handleSubmit"
            >
              <text class="btn-submit-text">
                {{ isSubmitting ? '正在验证账号...' : (authMode === 'register' ? '立即注册' : '立即登录') }}
              </text>
            </view>

            <view class="auth-mode-switch">
              <template v-if="authMode === 'register'">
                <text class="switch-txt">已有账号？</text>
                <text class="switch-link" @tap="switchMode('login')">立即登录</text>
              </template>
              <template v-else>
                <text class="switch-txt">没有账号？</text>
                <text class="switch-link" @tap="switchMode('register')">立即免费注册</text>
              </template>
            </view>
          </view>
        </view>

        <!-- 底部微露叠纸装饰层 -->
        <view class="auth-dossier-underlay"></view>
      </view>
    </view>

    <!-- 协议/隐私政策阅读弹层（不跳转页面，避免登录前路由拦截） -->
    <view v-if="legalDoc" class="legal-mask" @tap="closeLegal">
      <view class="legal-sheet" @tap.stop>
        <view class="legal-sheet-nav">
          <text class="legal-sheet-title">{{ legalDoc.title }}</text>
          <view class="legal-sheet-close" @tap="closeLegal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="2.4" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>
        <scroll-view scroll-y class="legal-sheet-body">
          <text class="legal-update">{{ legalDoc.updateDate }}</text>
          <view v-for="(sec, i) in legalDoc.sections" :key="i" class="legal-section">
            <text class="legal-heading">{{ sec.heading }}</text>
            <text v-for="(p, j) in sec.paras" :key="j" class="legal-para">{{ p }}</text>
          </view>
          <view class="legal-sheet-bottom-safe"></view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appState, actions } from '../../store/community.js';
import { legalDocs } from '../../common/legal.js';

const authMode = ref('login'); // 'login' | 'register'
const nickname = ref('');
const phone = ref('13800008888');
const password = ref('');
const confirmPassword = ref('');
const agreeTerms = ref(true);
const isSubmitting = ref(false);
const focusedField = ref('');
const redirectUrl = ref('');

onLoad((options) => {
  if (options && (options.mode === 'register' || options.mode === 'login')) {
    authMode.value = options.mode;
  }
  if (options && options.redirect) {
    try {
      redirectUrl.value = decodeURIComponent(options.redirect);
    } catch {
      redirectUrl.value = options.redirect;
    }
    appState.pendingRedirectUrl = redirectUrl.value;
  } else if (appState.pendingRedirectUrl) {
    redirectUrl.value = appState.pendingRedirectUrl;
  }
});

const switchMode = (mode) => {
  authMode.value = mode;
  appState.authMode = mode;
  password.value = '';
  confirmPassword.value = '';
};

const showToast = (msg) => {
  uni.showToast({ title: msg, icon: 'none' });
};

// 协议/隐私政策阅读弹层（内容与 PC 端一致，页面内直接展示不跳转）
const legalDoc = ref(null);
const openLegal = (type) => {
  legalDoc.value = legalDocs[type] || legalDocs.terms;
};
const closeLegal = () => {
  legalDoc.value = null;
};

const handleSubmit = () => {
  if (isSubmitting.value) return;

  if (!agreeTerms.value) {
    showToast('请先勾选同意《服务协议》与《隐私政策》');
    return;
  }
  if (authMode.value === 'register' && !nickname.value.trim()) {
    showToast('请输入您的昵称');
    return;
  }
  if (!phone.value.trim()) {
    showToast('请输入手机号码');
    return;
  }
  if (!password.value) {
    showToast(authMode.value === 'register' ? '请设置密码' : '请输入密码');
    return;
  }
  if (authMode.value === 'register' && password.value !== confirmPassword.value) {
    showToast('两次输入的密码不一致，请重新输入');
    confirmPassword.value = '';
    return;
  }

  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    actions.submitAuth({
      mode: authMode.value,
      phone: phone.value.trim(),
      nickname: nickname.value.trim()
    });
    const target = redirectUrl.value || appState.pendingRedirectUrl || '/pages/feed/index';
    showToast(authMode.value === 'register' ? '🎉 注册成功！欢迎加入「财不外露」私享星球' : '登录成功');
    setTimeout(() => {
      actions.navigateAfterAuth(target);
    }, 200);
  }, 450);
};
</script>

<style lang="scss" scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, #eff9f5 0%, #f7fbf9 42%, #f8fafc 100%);
  padding: calc(28px + constant(safe-area-inset-top)) 20px calc(28px + constant(safe-area-inset-bottom)) 20px;
  padding: calc(28px + env(safe-area-inset-top)) 20px calc(28px + env(safe-area-inset-bottom)) 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.auth-stage {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
}

/* 1. 顶部品牌徽标与标题区 */
.auth-header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 24px;
  margin-bottom: 22px;
}

/* 围绕「财」字徽标展开的星轨装饰层 */
.header-orbit-backdrop {
  position: absolute;
  top: -52px;
  left: 50%;
  transform: translateX(-50%);
  width: 360px;
  height: 240px;
  pointer-events: none;
  z-index: 0;
}

.orbit-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.logo-pedestal {
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.logo-orbit-ring {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.78);
  border: 0.5px solid rgba(16, 185, 129, 0.24);
  box-shadow:
    0 8px 20px -6px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transform: rotate(6deg);
}

.auth-logo-badge {
  position: relative;
  z-index: 1;
  width: 50px;
  height: 50px;
  overflow: hidden;
  background-color: #faf6ed;
  border: 1.5px solid rgba(217, 119, 6, 0.45);
  border-radius: 14px;
  box-shadow:
    0 8px 18px -4px rgba(15, 23, 42, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 100%;
  height: 100%;
  display: block;
}

.auth-title {
  position: relative;
  z-index: 1;
  font-size: 21px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
  margin-bottom: 6px;
  line-height: 1.3;
}


/* 2. 书卷质感主卡片与叠纸底座 */
.auth-card-wrapper {
  position: relative;
}

.auth-dossier-card {
  position: relative;
  z-index: 2;
  background:
    radial-gradient(120% 100% at 100% 0%, rgba(16, 185, 129, 0.045) 0%, transparent 65%),
    #ffffff;
  border-radius: 18px;
  border: 0.5px solid rgba(16, 185, 129, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.98),
    0 12px 32px -12px rgba(15, 23, 42, 0.07),
    0 4px 12px -2px rgba(15, 23, 42, 0.025);
  padding: 24px 20px 22px 20px;
  overflow: hidden;
}

.auth-dossier-underlay {
  position: relative;
  z-index: 1;
  height: 6px;
  margin: 0 14px;
  background: linear-gradient(90deg, #f2fbf7 0%, #f8fafc 100%);
  border: 0.5px solid rgba(16, 185, 129, 0.12);
  border-top: none;
  border-radius: 0 0 12px 12px;
}

/* 3. 表单字段 */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.input-surface,
.phone-input-wrap {
  display: flex;
  align-items: center;
  height: 44px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.16s ease;

  &.is-focused {
    background: #ffffff;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
}

.phone-prefix {
  padding: 0 12px;
  height: 100%;
  background: #f1f5f9;
  border-right: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.phone-prefix-txt {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.form-input {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 0 13px;
  font-size: 14px;
  color: #0f172a;
  background: transparent;
  border: none;
  box-sizing: border-box;
}

:deep(.input-placeholder) {
  color: #94a3b8;
  font-size: 13.5px;
}

/* 4. 协议勾选行 */
.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 18px;
  cursor: pointer;
}

.terms-checkbox {
  width: 16px;
  height: 16px;
  margin-top: 1.5px;
  border-radius: 4.5px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &.checked {
    background: #10b981;
    border-color: #10b981;
  }
}

.terms-text {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

.terms-link {
  color: #2563eb;
}

/* 5. 提交按钮与模式切换 */
.auth-action-area {
  display: flex;
  flex-direction: column;
}

.btn-auth-submit {
  width: 100%;
  height: 45px;
  background: linear-gradient(135deg, #16c486 0%, #10b981 100%);
  border-radius: 10px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 6px 16px -4px rgba(16, 185, 129, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.985);
    opacity: 0.94;
  }

  &.disabled {
    opacity: 0.68;
    pointer-events: none;
  }
}

.btn-submit-text {
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.auth-mode-switch {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
}

.switch-txt {
  color: #64748b;
}

.switch-link {
  color: #10b981;
  font-weight: 700;
  margin-left: 4px;
  cursor: pointer;
}

/* ===== 协议/隐私政策阅读弹层 ===== */
.legal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
}

.legal-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 82vh;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.legal-sheet-nav {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.legal-sheet-title {
  font-size: 16px;
  font-weight: 600;
  color: #1c1c1e;
}

.legal-sheet-close {
  position: absolute;
  right: 6px;
  top: 0;
  width: 40px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.legal-sheet-body {
  flex: 1;
  height: 0;
  padding: 16px 18px 0 18px;
  box-sizing: border-box;
}

.legal-update {
  display: block;
  font-size: 11.5px;
  color: #8e8e93;
  margin-bottom: 14px;
}

.legal-section {
  margin-bottom: 16px;
}

.legal-heading {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 7px;
}

.legal-para {
  display: block;
  font-size: 13px;
  color: #3c3c43;
  line-height: 1.75;
  margin-bottom: 7px;
}

.legal-sheet-bottom-safe {
  height: calc(24px + env(safe-area-inset-bottom));
  height: calc(24px + constant(safe-area-inset-bottom));
}
</style>
