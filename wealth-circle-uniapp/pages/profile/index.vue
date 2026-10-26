<template>
  <view class="profile-page">
    <!-- 1. 顶部深海沉浸式深蓝头部背景（参考截图整体UI风格与层次结构） -->
    <view class="hero-navy-header">
      <!-- 顶部大气水印与微星芒暗纹 -->
      <view class="hero-bg-watermark" aria-hidden="true">
        <svg class="watermark-svg" viewBox="0 0 390 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="340" cy="80" rx="150" ry="150" stroke="rgba(255,255,255,0.03)" stroke-width="1.2" stroke-dasharray="4 6"/>
          <ellipse cx="340" cy="80" rx="100" ry="100" stroke="rgba(245,158,11,0.035)" stroke-width="1"/>
          <!-- 汉字「財」意向暗纹水印 (呼应截图右上角极淡暗纹) -->
          <text x="320" y="130" font-size="110" font-weight="900" fill="rgba(255,255,255,0.025)" text-anchor="middle" font-family="sans-serif">財</text>
          <circle cx="50" cy="50" r="1.5" fill="rgba(255,255,255,0.25)" />
          <circle cx="280" cy="30" r="1.8" fill="rgba(245,158,11,0.3)" />
          <circle cx="150" cy="90" r="1.2" fill="rgba(255,255,255,0.18)" />
        </svg>
      </view>

      <!-- 1.1 状态栏安全占位 -->
      <view class="status-bar-spacer"></view>

      <!-- 1.2 用户个人信息排版（头像微光圈、昵称、格言、编号+同行天数徽章） -->
      <view class="user-profile-row" @tap="openEditProfile">
        <!-- 头像区（带典雅琥珀金微光圈） -->
        <view class="avatar-box">
          <image :src="appState.user.avatar || '/static/avatar_user.jpg'" class="user-avatar-img" mode="aspectFill" />
        </view>

        <!-- 信息区 -->
        <view class="user-meta-col">
          <!-- 第一行：昵称 -->
          <view class="user-name-line">
            <text class="user-name-text">{{ appState.user.name }}</text>
          </view>

          <!-- 第二行：成员微胶囊（编号 + 同行天数，身份属性紧随姓名） -->
          <view class="user-badges-line">
            <view class="member-meta-pill">
              <text class="pill-no-txt">NO. 1769</text>
              <text class="pill-dot">·</text>
              <text class="pill-days-txt">{{ memberDaysText }}</text>
            </view>
          </view>

          <!-- 第三行：投资格言/个性简介 + 指示小箭头 -->
          <view class="user-bio-line">
            <text class="user-bio-text">{{ appState.user.bio || '在流动性周期与产业基本面中寻找确定性增长。' }}</text>
            <view class="bio-arrow-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </view>
          </view>
        </view>
      </view>

      <!-- 1.3 星球尊享会员黑金卡片 (参考截图黑金质感) -->
      <view class="vip-banner-card" @tap="handleVipAction">
        <!-- 卡片右侧微暗皇冠底纹 (极弱微透，不干扰文字阅读) -->
        <view class="vip-card-watermark" aria-hidden="true">
          <svg width="120" height="120" viewBox="0 0 24 16" fill="none">
            <path d="M2 13h20v3H2v-3zm1.2-9.5l4.3 5.5 4.5-5.5 4.5 5.5 4.3-5.5.7 8H2.5l.7-8z" fill="#f59e0b" fill-opacity="0.06"/>
          </svg>
        </view>

        <!-- 卡片头部：皇冠图标 + 会员名称 + 特权中心胶囊按钮 -->
        <view class="vip-card-top-row">
          <view class="vip-card-title-group">
            <svg class="vip-crown-icon" width="18" height="18" viewBox="0 0 24 16" fill="none">
              <path d="M2 13h20v3H2v-3zm1.2-9.5l4.3 5.5 4.5-5.5 4.5 5.5 4.3-5.5.7 8H2.5l.7-8z" fill="#fde68a" stroke="#d97706" stroke-width="1.3"/>
            </svg>
            <text class="vip-card-name">{{ isVipOrAbove ? '星球尊享年会员' : '加入星球解锁专属特权' }}</text>
          </view>

          <view class="vip-btn-pill">
            <text class="vip-btn-text">{{ isVipOrAbove ? '特权中心' : '开通会员' }}</text>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#78350f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </view>
        </view>

        <!-- 卡片底部：核心权益展示 + 有效期状态 (加大垂直高度与间距，内容更舒展通透) -->
        <view class="vip-card-bottom-row">
          <view class="vip-privilege-list">
            <view class="vip-privilege-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <text class="privilege-text">专栏畅读</text>
            </view>

            <view class="vip-privilege-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <text class="privilege-text">活动回看</text>
            </view>

            <view class="vip-privilege-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <text class="privilege-text">星主提问</text>
            </view>
          </view>

          <!-- 到期时间 -->
          <text class="vip-expire-date">{{ vipExpireText }}</text>
        </view>
      </view>
    </view>

    <!-- 2. 核心投研业务 -->
    <view class="section-title">核心投研服务</view>
    <view class="planet-menu-section">
      <!-- 活动中心 -->
      <view class="menu-cell-row" @tap="goActivities">
        <view class="cell-left-wrap">
          <view class="squircle-icon is-emerald">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </view>
          <text class="cell-label">活动中心</text>
        </view>
        <view class="cell-right-wrap">
          <view class="activity-chip">1场进行中</view>
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 深度专栏 -->
      <view class="menu-cell-row" @tap="goColumnPage">
        <view class="cell-left-wrap">
          <view class="squircle-icon is-sky">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </view>
          <text class="cell-label">深度专栏</text>
        </view>
        <view class="cell-right-wrap">
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 会员提问 -->
      <view class="menu-cell-row" @tap="showQuestionsToast">
        <view class="cell-left-wrap">
          <view class="squircle-icon is-purple">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </view>
          <text class="cell-label">会员提问</text>
        </view>
        <view class="cell-right-wrap">
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 理财资讯 -->
      <view class="menu-cell-row is-last" @tap="goFeedPage">
        <view class="cell-left-wrap">
          <view class="squircle-icon is-amber">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
          </view>
          <text class="cell-label">理财资讯</text>
        </view>
        <view class="cell-right-wrap">
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>
    </view>

    <!-- 3. 分享星球（独立卡片行，置于设置上方） -->
    <view class="planet-menu-section share-standalone">
      <view class="menu-cell-row is-last" @tap="handleSharePlanet">
        <view class="cell-left-wrap">
          <view class="squircle-icon is-emerald">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </view>
          <text class="cell-label">分享星球</text>
        </view>
        <view class="cell-right-wrap">
          <text class="share-hint-txt">邀请好友同频研学</text>
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>
    </view>

    <!-- 4. 设置入口（独立分组） -->
    <view class="planet-menu-section settings-standalone">
      <view class="menu-cell-row is-last" @tap="handleSettings">
        <view class="cell-left-wrap">
          <view class="squircle-icon is-slate">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </view>
          <text class="cell-label">设置</text>
        </view>
        <view class="cell-right-wrap">
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>
    </view>

    <!-- 4. 验收控制台（体验演示视角切换，参考截图黑金高级质感） -->
    <view class="section-title">体验演示视角切换（验收控制台）</view>
    <view class="demo-perspective-card">
      <view class="ps-segmented-grid">
        <view 
          class="ps-seg-item" 
          :class="{ 'is-active': appState.currentPerspective === 'founder' }"
          @tap="actions.switchPerspective('founder')"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <text class="ps-item-name">星主管理员</text>
        </view>

        <view 
          class="ps-seg-item" 
          :class="{ 'is-active': appState.currentPerspective === 'vip' }"
          @tap="actions.switchPerspective('vip')"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 3h12l4 6-10 13L2 9z"></path>
          </svg>
          <text class="ps-item-name">年度会员</text>
        </view>

        <view 
          class="ps-seg-item" 
          :class="{ 'is-active': appState.currentPerspective === 'guest' }"
          @tap="actions.switchPerspective('guest')"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <text class="ps-item-name">星友</text>
        </view>
      </view>
    </view>

    <!-- 5. 底部合规备案落款 -->
    <view class="profile-footer-section">
      <view class="compliance-footnote">
        <text class="footnote-txt">财富星球 · 财不外露</text>
        <text class="footnote-sub">市场有风险，投资需谨慎 · 本内容不构成直接投资建议</text>
      </view>
    </view>

    <!-- 编辑个人资料抽屉 -->
    <view v-if="isEditProfileVisible" class="edit-overlay" @tap="closeEditProfile">
      <view class="edit-sheet" @tap.stop>
        <view class="edit-sheet-header">
          <text class="edit-sheet-title">编辑个人名片</text>
          <text class="edit-sheet-close" @tap="closeEditProfile">✕</text>
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

    <!-- 分享星球弹窗抽屉（支持海报分享与复制链接分享） -->
    <SharePlanetModal />
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { appState, actions, isVipOrAbove } from '../../store/community.js';
import VipJoinModal from '../../components/VipJoinModal.vue';
import SharePlanetModal from '../../components/SharePlanetModal.vue';

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

const handleVipAction = () => {
  appState.isVipModalVisible = true;
};

// 分享星球弹窗抽屉（支持海报分享与复制链接分享）
const handleSharePlanet = () => {
  actions.openShareModal();
};

// 星球官方资料认证弹窗
const handlePlanetInfo = () => {
  uni.showModal({
    title: '财不外露 · 官方社群资料',
    content: '星球名称：财不外露\n星球号：97181206\n官方认证：企业认证专业投研社群\n定位：专注于全球大类资产配置、买方深度研报与实盘信号追踪。',
    showCancel: false,
    confirmText: '我知道了'
  });
};

// ===== 编辑个人资料抽屉 =====
const isEditProfileVisible = ref(false);
const presetAvatars = [
  '/static/avatar_user.jpg',
  '/static/avatar_profile.jpg',
  '/static/avatar_mark.png',
  '/static/avatar_rich.png',
  '/static/avatar_john.png',
  '/static/avatar_jerry.png'
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
  padding-bottom: 85px;
  background-color: #f2f4f8;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

/* ================= 1. 顶部深海沉浸头部 ================= */
.hero-navy-header {
  position: relative;
  background: linear-gradient(180deg, #07152b 0%, #0a1f3c 55%, #0e274a 100%);
  padding: 0 16px 20px 16px;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 24px rgba(7, 21, 43, 0.12);
  overflow: hidden;
  box-sizing: border-box;
}

.hero-bg-watermark {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 240px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.watermark-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* 状态栏安全边距占位：无大标题时给顶部柔和适中的留白 */
.status-bar-spacer {
  height: 14px;
  height: max(14px, constant(safe-area-inset-top));
  height: max(14px, env(safe-area-inset-top));
}

/* 用户信息卡片行 */
.user-profile-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0 16px 0;
  cursor: pointer;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.avatar-box {
  position: relative;
  width: 66px;
  height: 66px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-img {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  background-color: #f97316;
  border: 2px solid rgba(251, 191, 36, 0.45);
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.22), 0 4px 14px rgba(0, 0, 0, 0.38);
  object-fit: cover;
}

.user-meta-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.user-name-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  min-width: 0;
}

.user-name-text {
  font-size: 19px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.user-badges-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  min-width: 0;
}

.member-meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 158, 11, 0.12);
  border: 0.5px solid rgba(245, 158, 11, 0.38);
  border-radius: 6px;
  padding: 2px 8px;
  line-height: 1.35;
}

.pill-no-txt {
  font-size: 11px;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 0.4px;
}

.pill-dot {
  font-size: 10px;
  color: rgba(251, 191, 36, 0.55);
}

.pill-days-txt {
  font-size: 11px;
  font-weight: 600;
  color: #fde68a;
  letter-spacing: 0.2px;
}

.user-bio-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.user-bio-text {
  flex: 1;
  min-width: 0;
  font-size: 11.5px;
  color: #94a3b8;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.bio-arrow-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px 0;
}

/* ================= 1.3 星球尊享会员黑金卡 ================= */
.vip-banner-card {
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #281f15 0%, #1c150e 55%, #140f0a 100%);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 18px;
  padding: 20px 18px 18px 18px;
  min-height: 104px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: inset 0 1px 0 rgba(254, 240, 138, 0.16), 0 4px 18px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.99);
  }
}

.vip-card-watermark {
  position: absolute;
  right: -10px;
  bottom: -15px;
  pointer-events: none;
  opacity: 0.35;
}

.vip-card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.vip-card-title-group {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.vip-crown-icon {
  flex-shrink: 0;
}

.vip-card-name {
  font-size: 16.5px;
  font-weight: 800;
  color: #fef3c7;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.vip-btn-pill {
  display: flex;
  align-items: center;
  gap: 3px;
  background: linear-gradient(135deg, #fde68a 0%, #f59e0b 100%);
  padding: 5px 13px;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.28);
  flex-shrink: 0;
}

.vip-btn-text {
  font-size: 12px;
  font-weight: 800;
  color: #78350f;
  white-space: nowrap;
}

.vip-card-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.vip-privilege-list {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
}

.vip-privilege-item {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.privilege-text {
  font-size: 11.5px;
  color: #fef3c7;
  font-weight: 500;
  opacity: 0.92;
  white-space: nowrap;
}

.vip-expire-date {
  font-size: 11.5px;
  color: #fbbf24;
  font-weight: 600;
  letter-spacing: 0.2px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ================= 2. 菜单列表区（参考截图纯白圆角卡片流与彩色微标） ================= */
.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.2px;
  padding: 16px 16px 8px 16px;
}

.planet-menu-section {
  background: #ffffff;
  border-radius: 16px;
  margin: 0 16px 12px 16px;
  /* 弱化卡片阴影，采用超轻边框 + 微投影，干净高级 */
  border: 0.5px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  box-sizing: border-box;
}

/* 独立单行卡片微调 */
.share-standalone,
.settings-standalone {
  margin-bottom: 12px;
}

.menu-cell-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:active {
    background-color: #f8fafc;
  }

  &.is-last {
    border-bottom: none;
  }
}

.cell-left-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

/* 左侧彩色圆角方块图标（参考截图蓝/金/绿彩色方标体系） */
.squircle-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.is-amber {
    background: #fef3c7;
  }

  &.is-sky {
    background: #e0f2fe;
  }

  &.is-emerald {
    background: #ecfdf5;
  }

  &.is-purple {
    background: #f5f3ff;
  }

  &.is-slate {
    background: #f1f5f9;
  }
}

.cell-label {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-right-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.share-hint-txt {
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
}

.activity-chip {
  background: #ecfdf5;
  color: #059669;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  line-height: 1.3;
}

.cell-arrow {
  margin-left: 2px;
}

/* ================= 3. 验收控制台（轻量卡片） ================= */
.demo-perspective-card {
  margin: 0 16px 12px 16px;
  background: #ffffff;
  border-radius: 14px;
  padding: 8px;
  border: 0.5px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  box-sizing: border-box;
}

.ps-segmented-grid {
  display: flex;
  gap: 6px;
}

.ps-seg-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 0;
  background: #f8fafc;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;

  &.is-active {
    background: #1c1c1e;
    color: #f59e0b;
    font-weight: 700;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  }
}

.ps-item-name {
  font-size: 12px;
}

/* ================= 4. 备案落款 ================= */
.profile-footer-section {
  padding: 20px 16px 12px 16px;
}

.compliance-footnote {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.footnote-txt {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

.footnote-sub {
  font-size: 10px;
  color: #cbd5e1;
}

/* ================= 5. 编辑个人资料抽屉 ================= */
.edit-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.edit-sheet {
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  padding-bottom: calc(12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.edit-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.08);
}

.edit-sheet-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}

.edit-sheet-close {
  font-size: 18px;
  color: #8e8e93;
  cursor: pointer;
  padding: 4px 8px;
}

.edit-sheet-body {
  padding: 18px 20px;
  overflow-y: auto;
}

.edit-field {
  margin-bottom: 16px;
}

.edit-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
  display: block;
}

.edit-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.edit-count {
  font-size: 11px;
  color: #94a3b8;
}

.edit-avatar-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.edit-avatar-preview {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid #059669;
}

.edit-avatar-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.edit-avatar-item {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 2px;
  border: 1.5px solid transparent;
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
  width: 100%;
  height: 42px;
  background: #f8fafc;
  border: 0.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #1e293b;
}

.edit-textarea {
  width: 100%;
  height: 72px;
  background: #f8fafc;
  border: 0.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  color: #1e293b;
  box-sizing: border-box;
}

.edit-sheet-footer {
  display: flex;
  gap: 10px;
  padding: 12px 20px;
  border-top: 0.5px solid rgba(60, 60, 67, 0.08);
}

.edit-btn-cancel {
  flex: 1;
  height: 44px;
  border-radius: 10px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.edit-btn-cancel-text {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.edit-btn-save {
  flex: 1;
  height: 44px;
  border-radius: 10px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.edit-btn-save-text {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
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
