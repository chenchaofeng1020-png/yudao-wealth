<template>
  <div v-if="appState.isAuthModalOpen" class="auth-modal-backdrop" @click.self="actions.closeAuth()">
    <div class="auth-dialog animate-fade-in">
      <button class="btn-close" @click="actions.closeAuth()" title="关闭">×</button>

      <!-- Header -->
      <div class="auth-header">
        <div class="auth-logo-badge">
          <span>财</span>
        </div>
        <h2 class="auth-title">
          {{ appState.authModalMode === 'register' ? '注册并开启私享之旅' : '登录「财不外露」' }}
        </h2>
        <p class="auth-desc">专注全球资产配置与家庭财务实践 · 只讨论逻辑与安全边际</p>
      </div>

      <!-- Register Form -->
      <div class="auth-form">
        <div v-if="appState.authModalMode === 'register'" class="form-group">
          <label class="form-label">昵称</label>
          <input
            type="text"
            v-model="nickname"
            placeholder="请输入您的称呼"
            maxlength="20"
            class="form-input nickname-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">手机号码</label>
          <div class="phone-input-wrap">
            <span class="phone-prefix">+86</span>
            <input 
              type="tel" 
              v-model="phone" 
              placeholder="请输入手机号码" 
              maxlength="11" 
              class="form-input phone-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">短信验证码</label>
          <div class="code-input-wrap">
            <input 
              type="text" 
              v-model="code" 
              placeholder="请输入 4 位验证码" 
              maxlength="6" 
              class="form-input code-input"
            />
            <button 
              type="button" 
              class="btn-send-code" 
              :disabled="countdown > 0" 
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s 后重新获取` : '获取验证码' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Terms & Agreement Checkbox -->
      <div class="terms-row">
        <label class="terms-label">
          <input type="checkbox" v-model="agreeTerms" class="terms-checkbox" />
          <span>我已阅读并同意 <a href="javascript:void(0)" @click.stop="actions.showToast('已查看《财不外露星球用户协议》')">《服务协议》</a> 与 <a href="javascript:void(0)" @click.stop="actions.showToast('已查看《隐私保护指引》')">《隐私政策》</a></span>
        </label>
      </div>

      <!-- Action Button -->
      <div class="auth-action-area">
        <button 
          class="btn-auth-submit" 
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          {{ isSubmitting ? '正在验证账号...' : '立即注册' }}
        </button>

        <div class="auth-mode-switch">
          <span v-if="appState.authModalMode === 'register'">
            已有账号？<a href="javascript:void(0)" @click="appState.authModalMode = 'login'">立即登录</a>
          </span>
          <span v-else>
            没有账号？<a href="javascript:void(0)" @click="appState.authModalMode = 'register'">立即免费注册</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { appState, actions } from '@/stores/community';

const nickname = ref('');
const phone = ref('13800008888');
const code = ref('8888');
const agreeTerms = ref(true);
const countdown = ref(0);
const isSubmitting = ref(false);

const sendCode = () => {
  if (!phone.value || phone.value.length < 11) {
    actions.showToast('请输入正确的 11 位手机号');
    return;
  }
  countdown.value = 60;
  code.value = '8888';
  actions.showToast('【演示短信】验证码 8888 已发送至手机');
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleSubmit = () => {
  if (!agreeTerms.value) {
    actions.showToast('请先勾选同意《服务协议》与《隐私政策》');
    return;
  }
  if (appState.authModalMode === 'register' && !nickname.value.trim()) {
    actions.showToast('请输入您的昵称');
    return;
  }
  if (!phone.value.trim()) {
    actions.showToast('请输入手机号码');
    return;
  }

  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    actions.submitAuth(phone.value.trim(), nickname.value.trim());
  }, 600);
};
</script>

<style scoped>
.auth-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}

.auth-dialog {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  width: 100%;
  max-width: 440px;
  padding: 32px 30px 28px 30px;
  position: relative;
  box-shadow: none;
}

.btn-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  background: transparent;
  color: #64748b;
  font-size: 24px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}
.btn-close:hover {
  background: transparent;
  color: var(--primary-navy);
}

.auth-header {
  text-align: center;
  margin-bottom: 20px;
}

.auth-logo-badge {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px auto;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  font-size: 22px;
  font-weight: 800;
}

.auth-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 6px;
}

.auth-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

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
  color: var(--tertiary-navy);
}

.phone-input-wrap, .code-input-wrap {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: border-color 0.15s ease;
}
.phone-input-wrap:focus-within, .code-input-wrap:focus-within {
  border-color: var(--brand-green);
}

.phone-prefix {
  padding: 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  border-right: 1px solid var(--border-light);
  background: var(--bg-subtle);
  height: 40px;
  display: flex;
  align-items: center;
}

.form-input {
  flex: 1;
  border: none;
  padding: 10px 12px;
  font-size: 13.5px;
  color: var(--text-primary);
  outline: none;
}

.nickname-input {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  background: #ffffff;
  transition: border-color 0.15s ease;
}
.nickname-input:focus {
  border-color: var(--brand-green);
}

.code-input-wrap input {
  border: none;
}

.btn-send-code {
  background: transparent;
  color: var(--brand-green);
  font-size: 12px;
  font-weight: 700;
  padding: 0 12px;
  height: 40px;
  white-space: nowrap;
  border-left: 1px solid var(--border-light);
  cursor: pointer;
}
.btn-send-code:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

.terms-row {
  margin-bottom: 18px;
}

.terms-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  line-height: 1.5;
}

.terms-checkbox {
  margin-top: 3px;
  accent-color: var(--brand-green);
}

.terms-label a {
  color: #2563eb;
  text-decoration: none;
}
.terms-label a:hover {
  text-decoration: underline;
}

.btn-auth-submit {
  width: 100%;
  background: var(--brand-green);
  color: #ffffff;
  padding: 12px 16px;
  border-radius: var(--radius-card);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-auth-submit:hover:not(:disabled) {
  background: var(--brand-green-hover);
}
.btn-auth-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-mode-switch {
  margin-top: 14px;
  text-align: center;
  font-size: 12px;
  color: #64748b;
}
.auth-mode-switch a {
  color: var(--brand-green);
  font-weight: 700;
  text-decoration: none;
  margin: 0 4px;
}
.auth-mode-switch a:hover {
  text-decoration: underline;
}
</style>
