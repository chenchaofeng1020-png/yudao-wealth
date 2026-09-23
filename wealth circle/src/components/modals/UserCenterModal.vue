<template>
  <transition name="modal-fade">
    <div
      v-if="appState.isUserCenterModalOpen"
      class="modal-backdrop"
      @click.self="actions.closeUserCenterModal"
    >
      <div class="user-center-dialog animate-fade-in">
        <!-- 装饰暖金光晕 -->
        <div class="header-glow"></div>

        <!-- 关闭按钮 -->
        <button class="btn-close-modal" @click="actions.closeUserCenterModal" title="关闭" aria-label="关闭">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- 顶部固定区域 (个人档案横卡 + VIP 会员状态卡) -->
        <div class="uc-fixed-head">
          <!-- 个人档案横卡 -->
          <div class="uc-profile-card">
            <div class="avatar-wrap">
              <img :src="appState.user.avatar" class="uc-avatar" alt="用户头像" />
              <!-- VIP 皇冠挂件徽章 (非星友时展示) -->
              <span v-if="!isStarFriend" class="avatar-vip-badge" title="尊贵会员">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M4 18H20L18.5 10L14 14L12 6L10 14L5.5 10L4 18Z" fill="#fef08a" stroke="#d97706" stroke-width="1.2" stroke-linejoin="round"/>
                  <circle cx="12" cy="5" r="1.5" fill="#fde68a" stroke="#d97706" stroke-width="1"/>
                  <rect x="4" y="19" width="16" height="2" rx="1" fill="#d97706"/>
                </svg>
              </span>
            </div>

            <div class="profile-info-block">
              <div class="profile-name-row">
                <span class="user-nickname">{{ appState.user.name }}</span>
              </div>
              <div class="profile-meta-row">
                <span class="phone-chip">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                  <span>{{ maskedPhone }}</span>
                </span>
              </div>
            </div>

            <!-- 编辑资料按钮 -->
            <button class="btn-edit-profile" @click="openEdit">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>编辑资料</span>
            </button>
          </div>

          <!-- 会员状态黑金卡片 -->
          <div class="vip-status-card" :class="{ 'card-star-friend': isStarFriend }">
            <div class="vs-watermark">VIP</div>
            <div class="vs-left">
              <div class="vs-header-tag">
                <span class="vs-indicator-dot"></span>
                <span>会员状态</span>
              </div>
              <div class="vs-plan-row">
                <template v-if="isStarFriend">
                  <span class="vs-plan not-vip">未开通会员</span>
                  <span class="vs-sub-hint">开通私享会员，解锁全站 6 大核心特权</span>
                </template>
                <template v-else>
                  <span class="vs-plan">年度私享会员</span>
                  <span v-if="expireText" class="vs-expire-date">· 有效期至 {{ expireText }}</span>
                </template>
              </div>
              <div v-if="expireDays !== null && expireDays <= 30 && !isStarFriend" class="vs-expire-warn">
                ⚠️ 您的会员将于 {{ expireDays }} 天后到期
              </div>
            </div>

            <button class="btn-vip-action" @click="openVipJoin">
              <span>{{ isStarFriend ? '开通会员' : '续费' }}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- 中间可滚动区域 (我的权益，支持鼠标移入显现、移出隐藏滚动条) -->
        <div class="uc-scroll-body">
          <div class="uc-benefits-header">
            <div class="uc-b-title-wrap">
              <span class="uc-b-title">我的权益</span>
              <span class="uc-b-count">{{ isStarFriend ? '0/6 已解锁' : '6/6 全部解锁' }}</span>
            </div>
            <span v-if="isStarFriend" class="benefit-guide-tip" @click="openVipJoin">开通会员解锁全部特权 &gt;</span>
          </div>

          <div :class="['benefit-list-wrap', { greyed: isStarFriend }]">
            <div
              v-for="b in membershipBenefits"
              :key="b.name"
              class="benefit-item-card"
              @click="onBenefitClick"
            >
              <div class="b-card-inner">
                <div class="b-icon-box" :class="getBenefitTheme(b.name)">
                  <!-- 专属图标，与 VipJoinModal 风格统一 -->
                  <svg v-if="b.name === '交易追踪'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                  <svg v-else-if="b.name === '市场资讯'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <svg v-else-if="b.name === '理财资讯'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  <svg v-else-if="b.name === '话题研究'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                  </svg>
                  <svg v-else-if="b.name === '会员直播'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>

                <div class="b-main-content">
                  <div class="b-head-line">
                    <span class="b-title">{{ b.name }}</span>
                    <span v-if="!isStarFriend" class="b-status-badge unlocked">
                      ✓ 已解锁
                    </span>
                    <span v-else class="b-status-badge locked">
                      🔒 未解锁
                    </span>
                  </div>
                  <div class="b-desc-text">{{ b.desc }}</div>
                  <div v-if="b.tags && b.tags.length" class="b-tags-wrap">
                    <span v-for="t in b.tags" :key="t" class="b-tag-item">#{{ t }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 编辑资料弹窗 -->
  <transition name="modal-fade">
    <div v-if="isEditing" class="edit-backdrop" @click.self="isEditing = false">
      <div class="modal-card edit-card animate-fade-in">
        <button class="btn-close-modal" @click="isEditing = false" title="关闭" aria-label="关闭">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h3 class="edit-modal-title">编辑个人资料</h3>

        <div class="edit-avatar-row">
          <div class="edit-avatar-preview">
            <img :src="avatarInput" class="avatar-preview-img" alt="头像预览" />
          </div>
          <div class="edit-avatar-actions">
            <label class="btn-upload">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>更换头像</span>
              <input type="file" accept="image/jpeg,image/png" @change="onAvatarChange" />
            </label>
            <div class="upload-hint">支持 jpg / png 格式，单张不超过 5MB</div>
          </div>
        </div>

        <div class="edit-field-group">
          <label class="edit-label">用户昵称</label>
          <input
            v-model="nicknameInput"
            type="text"
            class="edit-input"
            maxlength="20"
            placeholder="2~20 个字符，不可与已有成员重名"
          />
        </div>
        <p class="edit-note">注：本期暂不支持修改注册手机号</p>

        <div class="edit-actions">
          <button class="btn-cancel" @click="isEditing = false">取消</button>
          <button class="btn-save" @click="saveProfile">保存修改</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { appState, actions } from '@/stores/community';
import { membershipBenefits } from '@/mock/data';

// ===== 状态 =====
const isEditing = ref(false);
const nicknameInput = ref('');
const avatarInput = ref('');

// 星友：未开通会员的注册用户
const isStarFriend = computed(
  () => !appState.isVipMember && ['member', 'guest'].includes(appState.user.role),
);

// 手机号脱敏展示：138****5678
const maskedPhone = computed(() => {
  const p = appState.user.phone || '';
  return p.length === 11 ? `${p.slice(0, 3)}****${p.slice(7)}` : p || '—';
});

// 有效期（仅识别 yyyy-MM-dd 格式）
const expireText = computed(() => {
  const v = appState.user.vipExpireAt || '';
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '';
});

const expireDays = computed(() => {
  if (!expireText.value) return null;
  const diff = Math.ceil((new Date(expireText.value).getTime() - Date.now()) / 86400000);
  return diff > 0 ? diff : null;
});

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

// ===== 交互 =====
const openVipJoin = () => {
  actions.closeUserCenterModal();
  appState.isVipJoinModalOpen = true;
};

// 会员及以上：点击权益跳转介绍页会员权益区查看详细说明
const goBenefitDoc = () => {
  actions.closeUserCenterModal();
  appState.appFlowState = 'landing';
};

const onBenefitClick = () => {
  if (isStarFriend.value) {
    openVipJoin();
  } else {
    goBenefitDoc();
  }
};

// ===== 编辑资料 =====
const openEdit = () => {
  nicknameInput.value = appState.user.name;
  avatarInput.value = appState.user.avatar;
  isEditing.value = true;
};

const onAvatarChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    actions.showToast('仅支持 jpg / png 格式图片');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    actions.showToast('头像图片不能超过 5MB');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    avatarInput.value = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const saveProfile = () => {
  const name = nicknameInput.value.trim();
  if (name.length < 2 || name.length > 20) {
    actions.showToast('昵称需为 2~20 个字符');
    return;
  }
  appState.user.name = name;
  appState.user.avatar = avatarInput.value;
  isEditing.value = false;
  actions.showToast('资料已更新');
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 29, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.user-center-dialog {
  width: 560px;
  max-height: min(88vh, 730px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 64px -12px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(245, 158, 11, 0.2);
  position: relative;
  overflow: hidden;
  padding: 22px 24px 20px 24px;
  margin: auto;
}

/* 顶部微金光晕 */
.header-glow {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 160px;
  background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.btn-close-modal {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid rgba(226, 232, 240, 0.8);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
  z-index: 10;
}

.btn-close-modal:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: rotate(90deg);
}

/* 顶部固定区域 */
.uc-fixed-head {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  margin-bottom: 12px;
}

/* 个人档案横卡 */
.uc-profile-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 36px 12px 2px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 12px;
}

.avatar-wrap {
  position: relative;
  width: 58px;
  height: 58px;
  flex-shrink: 0;
}

.uc-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.avatar-vip-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #111827;
  border: 1.5px solid #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info-block {
  flex: 1;
  min-width: 0;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.user-nickname {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.user-role-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 1.5px 8px;
  border-radius: 99px;
  letter-spacing: 0.3px;
}

.badge-vip {
  background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.25);
}

.badge-founder {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  color: #ffffff;
}

.badge-friend {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.profile-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.phone-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 2px 8px;
  border-radius: 6px;
  font-variant-numeric: tabular-nums;
}

.btn-edit-profile {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 13px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.btn-edit-profile:hover {
  background: #ffffff;
  border-color: #f59e0b;
  color: #b45309;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

/* 会员状态黑金卡片 */
.vip-status-card {
  position: relative;
  background: linear-gradient(135deg, #0d1527 0%, #152037 45%, #0f172a 100%);
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 6px 20px -3px rgba(15, 23, 42, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.vip-status-card.card-star-friend {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-color: rgba(226, 232, 240, 0.3);
}

.vs-watermark {
  position: absolute;
  right: 100px;
  top: -15px;
  font-size: 70px;
  font-weight: 900;
  font-style: italic;
  color: rgba(255, 255, 255, 0.03);
  pointer-events: none;
  user-select: none;
}

.vs-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.vs-header-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

.vs-indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

.card-star-friend .vs-indicator-dot {
  background: #94a3b8;
  box-shadow: none;
}

.vs-plan-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.vs-plan {
  font-size: 14.5px;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 0.2px;
}

.vs-plan.not-vip {
  color: #ffffff;
}

.vs-sub-hint {
  font-size: 11px;
  color: #94a3b8;
}

.vs-expire-date {
  font-size: 11.5px;
  color: #cbd5e1;
  font-variant-numeric: tabular-nums;
}

.vs-expire-warn {
  font-size: 11px;
  color: #fca5a5;
  font-weight: 600;
  margin-top: 2px;
}

.btn-vip-action {
  background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
  color: #ffffff;
  font-weight: 800;
  font-size: 12.5px;
  padding: 8px 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.btn-vip-action:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

/* 中间滚动区域 */
.uc-scroll-body {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 5px;
  margin-bottom: 2px;
  overscroll-behavior: contain;
}

/* 鼠标移入显示滚动条，移出隐藏 */
.uc-scroll-body::-webkit-scrollbar {
  width: 5px;
}
.uc-scroll-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}
.uc-scroll-body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
  transition: background 0.25s ease;
}
.uc-scroll-body:hover::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.uc-scroll-body:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
.uc-scroll-body:hover::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}

.uc-benefits-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.uc-b-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.uc-b-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.uc-b-count {
  font-size: 11px;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 1px 7px;
  border-radius: 99px;
  font-weight: 700;
}

.benefit-guide-tip {
  font-size: 11.5px;
  color: #b45309;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.15s ease;
}

.benefit-guide-tip:hover {
  color: #d97706;
  text-decoration: underline;
}

/* 权益列表卡片 */
.benefit-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-item-card {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.benefit-item-card:hover {
  background: #ffffff;
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  transform: translateY(-1px);
}

.benefit-list-wrap.greyed .benefit-item-card {
  opacity: 0.65;
  filter: grayscale(0.5);
}

.b-card-inner {
  display: flex;
  gap: 10px;
}

.b-icon-box {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

/* 主题色彩 */
.theme-amber { background: #fef3c7; color: #b45309; }
.theme-blue { background: #e0f2fe; color: #0369a1; }
.theme-emerald { background: #d1fae5; color: #047857; }
.theme-purple { background: #f3e8ff; color: #7e22ce; }
.theme-rose { background: #ffe4e6; color: #be123c; }
.theme-indigo { background: #e0e7ff; color: #4338ca; }

.b-main-content {
  flex: 1;
  min-width: 0;
}

.b-head-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.b-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #0f172a;
}

.b-status-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 99px;
  flex-shrink: 0;
}

.b-status-badge.unlocked {
  color: #b45309;
  background: #fffbeb;
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.b-status-badge.locked {
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
}

.b-desc-text {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 5px;
}

.b-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.b-tag-item {
  font-size: 11px;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 1px 6px;
  border-radius: 4px;
}

/* 底部固定栏 */
.uc-fixed-footer {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-doc-btn {
  background: transparent;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.benefit-doc-btn:hover {
  color: #b45309;
  background: #fffbeb;
}

/* 编辑资料弹窗 */
.edit-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 29, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.edit-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 48px -10px rgba(15, 23, 42, 0.25);
  position: relative;
  padding: 22px 24px;
}

.edit-modal-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16px;
}

.edit-avatar-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.edit-avatar-preview {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
}

.avatar-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  width: fit-content;
}

.btn-upload:hover {
  background: #ffffff;
  border-color: #10b981;
  color: #059669;
}

.btn-upload input {
  display: none;
}

.upload-hint {
  font-size: 11px;
  color: #94a3b8;
}

.edit-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.edit-label {
  font-size: 12.5px;
  color: #334155;
  font-weight: 700;
}

.edit-input {
  width: 100%;
  height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  transition: all 0.15s ease;
}

.edit-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}

.edit-note {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.btn-cancel {
  font-size: 13px;
  padding: 7px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #64748b;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-save {
  font-size: 13px;
  font-weight: 700;
  padding: 7px 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.25);
  transition: all 0.15s ease;
}

.btn-save:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .user-center-dialog {
    width: 95vw;
    padding: 18px 16px 14px 16px;
    border-radius: 16px;
  }
  .uc-profile-card {
    flex-wrap: wrap;
    padding-right: 0;
  }
}
</style>
