<template>
  <view class="profile-page">
    <!-- 顶部导航栏与右侧快捷操作（对齐截图：极简白底、右上角分享与设置） -->
    <view class="top-nav-bar">
      <view class="top-nav-left"></view>
      <view class="top-nav-right">
        <!-- 分享星球 -->
        <view class="nav-icon-btn" @tap="handleSharePlanet">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f2329" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </view>
        <!-- 系统设置（标准完整 360 度全齿轮矢量路径） -->
        <view class="nav-icon-btn" @tap="handleSettings">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f2329" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </view>
      </view>
    </view>

    <!-- 用户名片区（对齐截图：大圆头像 + 昵称 + 统计指标 + 编辑胶囊 + 简介） -->
    <view class="user-header-section">
      <view class="user-info-row">
        <!-- 大圆头像 (68px) -->
        <view class="user-avatar-wrap" @tap="openEditProfile">
          <image :src="userAvatarUrl" class="user-avatar" mode="aspectFill" />
        </view>

        <!-- 姓名与数据 -->
        <view class="user-meta-block">
          <view class="user-name-line">
            <text class="user-nickname">{{ appState.user.name }}</text>
            <!-- 编辑胶囊按钮（移入姓名行，与姓名绝对齐平） -->
            <view class="edit-pill-btn" @tap="openEditProfile">
              <svg class="edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1f2329" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <text class="edit-pill-text">编辑</text>
            </view>
          </view>
          <view class="user-stats-row">
            <text class="stats-item">NO. 1769</text>
            <text class="stats-divider">|</text>
            <text class="stats-item">{{ memberDaysText }}</text>
          </view>
        </view>
      </view>

      <!-- 简介文案 -->
      <view class="user-bio-text">
        {{ appState.user.bio || '在流动性周期与产业基本面中寻找确定性增长。' }}
      </view>
    </view>

    <!-- 中间会员卡片（随演示视角切换内容：星主/合伙人/嘉宾特权、年度会员权益、星友引导开通） -->
    <view class="vip-member-card" @tap="handleVipAction">
      <view class="vip-card-header">
        <view class="vip-title-wrap">
          <svg class="vip-crown-svg" width="16" height="16" viewBox="0 0 24 24" fill="#b45309">
            <path d="M2 13h20v2.5H2V13zm1.2-9l4.3 5.2L12 4l4.5 5.2 4.3-5.2.7 7.5H2.5L3.2 4z"/>
          </svg>
          <text class="vip-title-text">{{ vipCard.title }}</text>
        </view>
        <view class="vip-badge-btn" :class="{ 'is-renew': vipCard.isRenew }">
          <text class="vip-badge-text">{{ vipCard.badge }}</text>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <view class="vip-card-divider"></view>

      <view class="vip-card-footer">
        <view class="vip-benefits-row">
          <text v-for="b in vipCard.benefits" :key="b" class="benefit-item">{{ b }}</text>
        </view>
        <text class="vip-expire-hint" :class="{ 'is-expiring': vipCard.isExpiring }">{{ vipCard.expireHint }}</text>
      </view>
    </view>

    <!-- 列表卡片组（对齐截图：纯白圆角卡片、单色线框图标、内嵌发丝分割线） -->
    <view class="list-cards-wrapper">
      <!-- 独立单卡：深度专栏（对齐截图「已购订单」独立卡位） -->
      <view class="card-group single-cell-group" @tap="goColumnPage">
        <view class="cell-left">
          <svg class="cell-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2329" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <text class="cell-title">深度专栏</text>
        </view>
        <view class="cell-right">
          <svg class="cell-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4c9d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 组合卡片 1（活动中心、会员提问、理财资讯） -->
      <view class="card-group multi-cell-group">
        <!-- 活动中心 -->
        <view class="cell-item" @tap="goActivities">
          <view class="cell-left">
            <svg class="cell-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2329" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <text class="cell-title">活动中心</text>
          </view>
          <view class="cell-right">
            <view class="activity-status-tag">1场进行中</view>
            <svg class="cell-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4c9d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>

        <view class="cell-divider"></view>

        <!-- 会员提问 -->
        <view class="cell-item" @tap="showQuestionsToast">
          <view class="cell-left">
            <svg class="cell-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2329" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <text class="cell-title">会员提问</text>
          </view>
          <view class="cell-right">
            <svg class="cell-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4c9d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>

        <view class="cell-divider"></view>

        <!-- 理财资讯 -->
        <view class="cell-item" @tap="goFeedPage">
          <view class="cell-left">
            <svg class="cell-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2329" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <text class="cell-title">理财资讯</text>
          </view>
          <view class="cell-right">
            <svg class="cell-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c4c9d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>
      </view>



      <!-- 体验演示视角切换（验收控制台） -->
      <view class="card-group console-card-group">
        <view class="console-title">体验演示视角切换（验收控制台）</view>
        <view class="ps-segmented-grid">
          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.currentPerspective === 'founder' }"
            @tap="actions.switchPerspective('founder')"
          >
            <text class="ps-item-name">星主</text>
          </view>

          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.currentPerspective === 'partner' }"
            @tap="actions.switchPerspective('partner')"
          >
            <text class="ps-item-name">合伙人</text>
          </view>

          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.currentPerspective === 'guest_expert' }"
            @tap="actions.switchPerspective('guest_expert')"
          >
            <text class="ps-item-name">嘉宾</text>
          </view>

          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.currentPerspective === 'assistant' }"
            @tap="actions.switchPerspective('assistant')"
          >
            <text class="ps-item-name">小助理</text>
          </view>

          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.currentPerspective === 'vip' }"
            @tap="actions.switchPerspective('vip')"
          >
            <text class="ps-item-name">年度会员</text>
          </view>

          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.currentPerspective === 'vip_expiring' }"
            @tap="actions.switchPerspective('vip_expiring')"
          >
            <text class="ps-item-name">会员·临期</text>
          </view>

          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.currentPerspective === 'guest' }"
            @tap="actions.switchPerspective('guest')"
          >
            <text class="ps-item-name">星友</text>
          </view>
        </view>

        <!-- 支付渠道模拟（iOS 内购验收） -->
        <view class="console-title pay-console-title">支付渠道模拟（iOS 内购验收）</view>
        <view class="ps-segmented-grid">
          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.payChannelSim === 'auto' }"
            @tap="appState.payChannelSim = 'auto'"
          >
            <text class="ps-item-name">自动检测</text>
          </view>

          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.payChannelSim === 'h5' }"
            @tap="appState.payChannelSim = 'h5'"
          >
            <text class="ps-item-name">H5 支付</text>
          </view>

          <view
            class="ps-seg-item"
            :class="{ 'is-active': appState.payChannelSim === 'ios' }"
            @tap="appState.payChannelSim = 'ios'"
          >
            <text class="ps-item-name">iOS 内购</text>
          </view>
        </view>
      </view>

      <!-- 底部合规备案落款 -->
      <view class="profile-footnote">
        <view class="footnote-brand-row">
          <view class="footnote-logo-box">
            <image src="/static/brand_logo.jpg" class="footnote-logo-img" mode="aspectFill" />
          </view>
          <text class="footnote-txt">财不外露</text>
        </view>
        <text class="footnote-sub">市场有风险，投资需谨慎 · 本内容不构成直接投资建议</text>
      </view>
    </view>

    <!-- 编辑个人资料抽屉 -->
    <view v-if="isEditProfileVisible" class="edit-overlay" @tap="closeEditProfile">
      <view class="edit-sheet" @tap.stop>
        <view class="edit-sheet-handle"></view>
        <view class="edit-sheet-header">
          <text class="edit-sheet-title">编辑个人名片</text>
          <view class="edit-sheet-close" @tap="closeEditProfile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>

        <scroll-view scroll-y class="edit-sheet-body">
          <view class="edit-field">
            <text class="edit-label">头像</text>
            <view class="edit-avatar-row">
              <image :src="editForm.avatar" class="edit-avatar-preview" mode="aspectFill" />
              <view class="edit-avatar-list">
                <view
                  v-for="a in presetAvatars"
                  :key="a"
                  class="edit-avatar-item"
                  :class="{ on: editForm.avatar === a }"
                  @tap="editForm.avatar = a"
                >
                  <image :src="a" mode="aspectFill" class="edit-avatar-thumb" />
                </view>
              </view>
            </view>
          </view>

          <view class="edit-field">
            <text class="edit-label">星友昵称</text>
            <input
              v-model="editForm.name"
              class="edit-input"
              :maxlength="20"
              placeholder="请输入 2~20 个字符"
              placeholder-class="edit-placeholder"
            />
          </view>

          <view class="edit-field">
            <view class="edit-label-row">
              <text class="edit-label">自我介绍 / 投资格言</text>
              <text class="edit-count">{{ (editForm.bio || '').length }}/120</text>
            </view>
            <textarea
              v-model="editForm.bio"
              class="edit-textarea"
              :maxlength="120"
              placeholder="一句话介绍自己的投资方向或背景"
              placeholder-class="edit-placeholder"
            />
          </view>
        </scroll-view>

        <view class="edit-sheet-footer">
          <view class="edit-btn-cancel" @tap="closeEditProfile">
            <text class="edit-btn-cancel-text">取消</text>
          </view>
          <view class="edit-btn-save" @tap="saveProfile">
            <text class="edit-btn-save-text">保存修改</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 会员开通弹窗抽屉 -->
    <VipJoinModal />

    <!-- 身份特权弹窗（星主/合伙人/嘉宾） -->
    <RolePrivilegeModal
      :visible="isRolePrivilegeVisible"
      :role="rolePrivilegeRole"
      @close="isRolePrivilegeVisible = false"
    />

    <!-- 分享星球弹窗抽屉 -->
    <SharePlanetModal />
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { appState, actions, isVipOrAbove } from '../../store/community.js';
import VipJoinModal from '../../components/VipJoinModal.vue';
import SharePlanetModal from '../../components/SharePlanetModal.vue';
import RolePrivilegeModal from '../../components/RolePrivilegeModal.vue';

// 格式化会员到期时间或状态
const vipExpireText = computed(() => {
  if (!isVipOrAbove.value) return '开通立即解锁';
  const val = appState.user.vipExpireAt || '2027-09-17';
  if (val.includes('2099') || val === '终身有效') return '终身有效';
  if (val.endsWith('到期')) return val;
  return `${val} 到期`;
});

// 星友同行天数计算与展示
const memberDaysText = computed(() => {
  return '同行 39 天';
});

// 会员卡片随演示视角联动的内容配置
const vipCard = computed(() => {
  const p = appState.currentPerspective;
  // 星主 / 合伙人 / 嘉宾 / 小助理：身份特权（免费会员），点击查看特权弹窗
  if (p === 'founder' || p === 'partner' || p === 'guest_expert' || p === 'assistant') {
    const titles = { founder: '星主特权', partner: '合伙人特权', guest_expert: '嘉宾特权', assistant: '小助理特权' };
    return {
      title: titles[p],
      badge: '查看特权',
      benefits: ['✦ 免费会员', '✦ 荣誉身份标识', '✦ 全员推送'],
      expireHint: '永久免费',
      isRenew: false,
      isExpiring: false,
      action: 'privilege'
    };
  }
  // 年度会员·临期：会员特权 + 续费引导
  if (p === 'vip_expiring') {
    return {
      title: '年度会员',
      badge: '续费',
      benefits: ['✦ 市场资讯', '✦ 深度专栏', '✦ 会员直播'],
      expireHint: '2026-11-28 到期',
      isRenew: true,
      isExpiring: true,
      action: 'renew'
    };
  }
  // 年度会员：正常有效期
  if (p === 'vip') {
    return {
      title: '年度会员',
      badge: '查看特权',
      benefits: ['✦ 市场资讯', '✦ 深度专栏', '✦ 会员直播'],
      expireHint: vipExpireText.value,
      isRenew: false,
      isExpiring: false,
      action: 'renew'
    };
  }
  // 星友（未开通）：引导开通会员
  return {
    title: '加入星球解锁专属特权',
    badge: '开通会员',
    benefits: ['✦ 专栏畅读', '✦ 活动回看', '✦ 星主提问'],
    expireHint: '开通立即解锁',
    isRenew: false,
    isExpiring: false,
    action: 'join'
  };
});

// 身份特权弹窗（星主/合伙人/嘉宾）
const isRolePrivilegeVisible = ref(false);
const rolePrivilegeRole = ref('founder');

const handleVipAction = () => {
  if (vipCard.value.action === 'privilege') {
    rolePrivilegeRole.value = appState.currentPerspective;
    isRolePrivilegeVisible.value = true;
    return;
  }
  appState.isVipModalVisible = true;
};

// 分享星球弹窗抽屉
const handleSharePlanet = () => {
  actions.openShareModal();
};

// 消息入口（点击直达我的提问/互动）
const handleNotifications = () => {
  uni.navigateTo({ url: '/pages/feed/my-questions' });
};

// 用户头像计算属性（确保始终加载超清头像，防止缓存旧低清图）
const userAvatarUrl = computed(() => {
  const a = appState.user.avatar;
  if (!a || a.includes('avatar_mark') || a.includes('avatar_john') || a.includes('avatar_jerry')) {
    return '/static/avatar_user_hd.jpg';
  }
  return a;
});

// ===== 编辑个人资料抽屉 =====
const isEditProfileVisible = ref(false);
const presetAvatars = [
  '/static/avatar_user_hd.jpg',
  '/static/avatar_user.jpg',
  '/static/avatar_profile.jpg'
];
const editForm = reactive({ name: '', avatar: '', bio: '' });

const openEditProfile = () => {
  editForm.name = appState.user.name;
  editForm.avatar = appState.user.avatar || '/static/avatar_user.jpg';
  editForm.bio = appState.user.bio || '';
  isEditProfileVisible.value = true;
};

const closeEditProfile = () => {
  isEditProfileVisible.value = false;
};

const saveProfile = () => {
  const name = (editForm.name || '').trim();
  if (name.length < 2) {
    uni.showToast({ title: '昵称需 2~20 个字符', icon: 'none' });
    return;
  }
  appState.user.name = name;
  appState.user.avatar = editForm.avatar;
  appState.user.bio = (editForm.bio || '').trim();
  isEditProfileVisible.value = false;
  uni.showToast({ title: '名片资料已更新', icon: 'success' });
};

const goActivities = () => {
  uni.navigateTo({ url: '/pages/activity/index' });
};

const goColumnPage = () => {
  uni.switchTab({ url: '/pages/column/index' });
};

const showQuestionsToast = () => {
  uni.navigateTo({ url: '/pages/feed/my-questions' });
};

const goFeedPage = () => {
  uni.switchTab({ url: '/pages/feed/index' });
};

const handleSettings = () => {
  uni.navigateTo({ url: '/pages/profile/settings' });
};
</script>

<style lang="scss" scoped>
.profile-page {
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
  background-color: #f6f7f9;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* ================= 1. 顶部操作栏（对齐截图：右上角通知铃铛 + 分享箭头） ================= */
.top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(10px + constant(safe-area-inset-top)) 20px 8px 20px;
  padding: calc(10px + env(safe-area-inset-top)) 20px 8px 20px;
  background-color: #f6f7f9;
}

.top-nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.nav-icon-btn {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: opacity 0.15s ease, background-color 0.15s ease;

  &:active {
    opacity: 0.65;
    background-color: rgba(0, 0, 0, 0.04);
  }
}

/* ================= 2. 用户个人名片区（对齐截图结构） ================= */
.user-header-section {
  padding: 6px 20px 16px 20px;
}

.user-info-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar-wrap {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  background-color: #f1f5f9;
  cursor: pointer;
  border: 2.5px solid #ffffff;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);

  &:active {
    opacity: 0.85;
  }
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.user-meta-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.user-name-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.user-nickname {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
  letter-spacing: -0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-stats-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 13px;
  color: #8a919f;
  line-height: 1;
}

.stats-divider {
  color: #d1d5db;
  font-size: 11px;
}

.stats-item {
  color: #64748b;
  font-weight: 500;
}

/* 编辑按钮（浅灰全圆角胶囊） */
.edit-pill-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background-color: #eeeff3;
  border-radius: 999px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:active {
    background-color: #e2e4ea;
    transform: scale(0.97);
  }
}

.edit-icon {
  flex-shrink: 0;
}

.edit-pill-text {
  font-size: 13px;
  font-weight: 500;
  color: #1f2329;
}

/* 简介文字（对齐截图副标） */
.user-bio-text {
  margin-top: 14px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  word-break: break-all;
}

/* ================= 3. 中间会员卡片（方案 A：暖象牙浅金缎面，温润高级、零突兀感，统一 8px 圆角） ================= */
.vip-member-card {
  margin: 0 16px 14px 16px;
  padding: 16px 18px;
  background: linear-gradient(135deg, #fdfaf3 0%, #f7f1e5 50%, #f1e6d0 100%);
  border: 1px solid rgba(217, 119, 6, 0.18);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 4px 16px -2px rgba(180, 83, 9, 0.06);
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.985);
    opacity: 0.94;
  }
}

.vip-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vip-title-wrap {
  display: flex;
  align-items: center;
  gap: 7px;
}

.vip-crown-svg {
  flex-shrink: 0;
}

.vip-title-text {
  font-size: 14.5px;
  font-weight: 700;
  color: #78350f;
  letter-spacing: 0.2px;
}

.vip-badge-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 11px;
  background-color: #854d0e;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(133, 77, 14, 0.2);
}

.vip-badge-text {
  line-height: 1;
}

.vip-card-divider {
  height: 0.5px;
  background-color: rgba(180, 83, 9, 0.12);
  margin: 12px 0 10px 0;
}

.vip-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vip-benefits-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.benefit-item {
  font-size: 11px;
  color: #854d0e;
  font-weight: 500;
}

.vip-expire-hint {
  font-size: 11px;
  color: #a16207;
  opacity: 0.85;
  font-family: -apple-system, BlinkMacSystemFont, monospace;
}

/* 临期状态：到期提示警示色 */
.vip-expire-hint.is-expiring {
  color: #dc2626;
  opacity: 1;
  font-weight: 600;
}

/* 临期状态：续费按钮金色高亮 */
.vip-badge-btn.is-renew {
  background-color: #b45309;
}

/* ================= 4. 列表卡片组（对齐截图：纯白圆角、单色线框图标、内嵌分割线） ================= */
.list-cards-wrapper {
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-group {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.single-cell-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:active {
    background-color: #f9fafb;
  }
}

.cell-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:active {
    background-color: #f9fafb;
  }
}

.cell-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cell-icon {
  flex-shrink: 0;
}

.cell-title {
  font-size: 15px;
  font-weight: 500;
  color: #1f2329;
  letter-spacing: -0.1px;
}

.cell-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cell-subtext {
  font-size: 13px;
  color: #8a919f;
}

.cell-chevron {
  flex-shrink: 0;
}

.activity-status-tag {
  font-size: 11px;
  font-weight: 500;
  color: #059669;
  background-color: #ecfdf5;
  border-radius: 4px;
  padding: 2px 7px;
  line-height: 1.2;
}

.cell-divider {
  height: 0.5px;
  background-color: #f2f3f5;
  margin-left: 52px;
}

/* ================= 5. 体验演示视角切换（验收控制台） ================= */
.console-card-group {
  padding: 14px 16px;
}

.console-title {
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 10px;
}

.pay-console-title {
  margin-top: 14px;
}

.ps-segmented-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background-color: #f4f5f7;
  padding: 3.5px;
  border-radius: 6px;
}

.ps-seg-item {
  flex: 1 1 calc(25% - 6px);
  min-width: calc(25% - 6px);
  text-align: center;
  padding: 7px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;

  &.is-active {
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

    .ps-item-name {
      color: #111827;
      font-weight: 600;
    }
  }
}

.ps-item-name {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

/* ================= 6. 底部合规落款 ================= */
.profile-footnote {
  padding: 22px 0 32px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.footnote-brand-row {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.footnote-logo-box {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #faf6ed;
  border: 1px solid rgba(245, 158, 11, 0.32);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.footnote-logo-img {
  width: 100%;
  height: 100%;
  display: block;
}

.footnote-txt {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.footnote-sub {
  font-size: 10px;
  color: #94a3b8;
  letter-spacing: 0.2px;
}

/* ================= 7. 编辑个人资料抽屉 ================= */
.edit-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.2s ease;
}

.edit-sheet {
  width: 100%;
  max-height: 80vh;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 10px 18px calc(18px + constant(safe-area-inset-bottom)) 18px;
  padding: 10px 18px calc(18px + env(safe-area-inset-bottom)) 18px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.edit-sheet-handle {
  width: 36px;
  height: 4px;
  background-color: #cbd5e1;
  border-radius: 99px;
  margin: 0 auto 12px auto;
}

.edit-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 0.5px solid #f1f5f9;
}

.edit-sheet-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.edit-sheet-close {
  padding: 4px;
  cursor: pointer;
}

.edit-sheet-body {
  flex: 1;
  max-height: 50vh;
  padding: 14px 0;
}

.edit-field {
  margin-bottom: 16px;
}

.edit-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  display: block;
}

.edit-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.edit-count {
  font-size: 11px;
  color: #94a3b8;
}

.edit-avatar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.edit-avatar-preview {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
}

.edit-avatar-list {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0;
}

.edit-avatar-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  flex-shrink: 0;
  cursor: pointer;

  &.on {
    border-color: #059669;
  }
}

.edit-avatar-thumb {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.edit-input {
  height: 40px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13.5px;
  color: #0f172a;
  box-sizing: border-box;
}

.edit-textarea {
  width: 100%;
  height: 72px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: #0f172a;
  box-sizing: border-box;
}

.edit-placeholder {
  color: #94a3b8;
  font-size: 13px;
}

.edit-sheet-footer {
  display: flex;
  gap: 10px;
  padding-top: 10px;
}

.edit-btn-cancel {
  flex: 1;
  height: 42px;
  border-radius: 8px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.edit-btn-cancel-text {
  font-size: 13.5px;
  font-weight: 500;
  color: #475569;
}

.edit-btn-save {
  flex: 2;
  height: 42px;
  border-radius: 8px;
  background-color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.edit-btn-save-text {
  font-size: 13.5px;
  font-weight: 600;
  color: #ffffff;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
