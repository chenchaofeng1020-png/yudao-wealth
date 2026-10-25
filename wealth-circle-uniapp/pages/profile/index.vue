<template>
  <view class="profile-page">
    <!-- 1. 顶部状态栏透明占位（App 端 WebView 全屏需避让状态栏/灵动岛） -->
    <view class="status-bar-spacer"></view>

    <!-- 2. 星球环形轨道视觉核心 (围绕财富星球与星友圈圈层) -->
    <view class="orbit-wheel-wrap">
      <view class="orbit-wheel-box">
        <!-- 环心核心信息：社群名称、星球号与个人当前会籍 -->
        <view class="orbit-center-info">
          <text class="orbit-planet-name">财不外露</text>
          <text class="orbit-planet-id">星球号：97181206</text>
          <text class="orbit-expire-date">
            {{ isVipOrAbove ? `付费有效期至 ${appState.user.vipExpireAt || '2027/9/17'}` : '加入星球解锁专属特权' }}
          </text>
        </view>

        <!-- 12个环形轨道头像（星主在顶部12点钟位，当前用户在底部6点钟高亮位） -->
        <view
          v-for="m in orbitMembers"
          :key="m.id"
          class="orbit-node"
          :class="{ 'is-founder': m.isFounder, 'is-me': m.isMe }"
          :style="{ transform: `translate(${m.x}px, ${m.y}px)` }"
          @tap="onNodeTap(m)"
        >
          <!-- 星主金色皇冠 (12点钟) -->
          <view v-if="m.isFounder" class="founder-crown-wrap">
            <svg class="crown-svg" width="20" height="15" viewBox="0 0 24 16" fill="none">
              <path d="M2 13h20v3H2v-3zm1.2-9.5l4.3 5.5 4.5-5.5 4.5 5.5 4.3-5.5.7 8H2.5l.7-8z" fill="#d97706" stroke="#b45309" stroke-width="1.2"/>
            </svg>
          </view>

          <!-- 环形头像（当前用户带翠绿色光环） -->
          <image
            :src="m.avatar"
            class="orbit-avatar"
            :class="{ 'me-ring': m.isMe, 'founder-ring': m.isFounder }"
            mode="aspectFill"
          />

          <!-- 姓名标签 -->
          <text v-if="m.name" class="orbit-name" :class="{ 'me-name': m.isMe }">{{ m.name }}</text>
        </view>
      </view>

      <!-- 底部用户专属信息：成员编号与加入天数 -->
      <view class="orbit-member-meta">
        <text class="member-id-text">成员编号：1769</text>
        <text class="member-joined-text">2026 年 9 月 17 日加入星球 · 已加入 {{ appState.user.joinedDays || '540 天' }}</text>
      </view>

      <!-- 分享星球胶囊按钮 -->
      <view class="btn-share-planet" @tap="handleSharePlanet">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <text class="share-btn-text">分享星球</text>
      </view>
    </view>

    <!-- 3. 用户与会籍服务（基于自身业务深度设计） -->
    <view class="section-title">会籍与名片</view>
    <view class="planet-menu-section">
      <!-- 会员权益中心 -->
      <view class="menu-cell-row" @tap="handleVipAction">
        <text class="cell-label">会员权益中心</text>
        <view class="cell-right-wrap">
          <text v-if="isVipOrAbove" class="privilege-active-txt">6项特权已生效</text>
          <text v-else class="privilege-locked-txt">开通会员解锁</text>
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 我的星球名片 -->
      <view class="menu-cell-row is-last" @tap="openEditProfile">
        <text class="cell-label">我的星球名片</text>
        <view class="cell-right-wrap">
          <view class="user-chip-preview">
            <image :src="appState.user.avatar || '/static/avatar_user.jpg'" class="user-chip-avatar" mode="aspectFill" />
            <text class="user-chip-name">{{ appState.user.name }}</text>
          </view>
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>
    </view>

    <!-- 4. 核心投研业务 -->
    <view class="section-title">核心投研服务</view>
    <view class="planet-menu-section">
      <!-- 线下闭门活动 -->
      <view class="menu-cell-row" @tap="goActivities">
        <text class="cell-label">线下活动</text>
        <view class="cell-right-wrap">
          <view class="activity-chip">1场进行中</view>
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 深度专栏 -->
      <view class="menu-cell-row" @tap="goColumnPage">
        <text class="cell-label">深度专栏</text>
        <view class="cell-right-wrap">
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 会员提问 -->
      <view class="menu-cell-row" @tap="showQuestionsToast">
        <text class="cell-label">会员提问</text>
        <view class="cell-right-wrap">
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>

      <!-- 理财资讯 -->
      <view class="menu-cell-row" @tap="showNewsToast">
        <text class="cell-label">理财资讯</text>
        <view class="cell-right-wrap">
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>
    </view>

    <!-- 5. 设置入口（原顶部右上角齿轮移至此处，独立分组） -->
    <view class="planet-menu-section settings-standalone">
      <view class="menu-cell-row is-last" @tap="handleSettings">
        <text class="cell-label">设置</text>
        <view class="cell-right-wrap">
          <svg class="cell-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </view>
      </view>
    </view>

    <!-- 6. 验收控制台（体验演示视角切换） -->
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

    <!-- 7. 底部合规备案落款 -->
    <view class="profile-footer-section">
      <view class="compliance-footnote">
        <text class="footnote-txt">财富星球 · 财不外露 · 买方视角全球投研社群</text>
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

          <text class="edit-note">注：本期暂不支持修改注册手机号</text>
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
  </view>
</template>

<script setup>
import { computed, ref, reactive } from 'vue';
import { appState, actions, isVipOrAbove } from '../../store/community.js';
import VipJoinModal from '../../components/VipJoinModal.vue';

// 12个环形轨道头像数据（基于数学三角函数精准计算，半径从 114 扩展至 126）
const orbitMembers = computed(() => {
  const R = 126; // 半径 px
  const list = [
    { id: 0, angle: -90, avatar: '/static/avatar_rich.png', name: 'Rich', isFounder: true },
    { id: 1, angle: -60, avatar: '/static/ziran.jpg' },
    { id: 2, angle: -30, avatar: '/static/qingxi.jpg' },
    { id: 3, angle: 0, avatar: '/static/avatar_mark.png' },
    { id: 4, angle: 30, avatar: '/static/dall2.jpg' },
    { id: 5, angle: 60, avatar: '/static/dall3.jpg' },
    { id: 6, angle: 90, avatar: appState.user.avatar || '/static/avatar_user.jpg', name: appState.user.name, isMe: true },
    { id: 7, angle: 120, avatar: '/static/avatar_profile.jpg' },
    { id: 8, angle: 150, avatar: '/static/avatar_jerry.png' },
    { id: 9, angle: 180, avatar: '/static/avatar_john.png' },
    { id: 10, angle: 210, avatar: '/static/circle_banner.png' },
    { id: 11, angle: 240, avatar: '/static/banner_thumb.png' },
  ];

  return list.map((item) => {
    const rad = (item.angle * Math.PI) / 180;
    const x = Math.round(R * Math.cos(rad));
    const y = Math.round(R * Math.sin(rad));
    return {
      ...item,
      x,
      y
    };
  });
});

const onNodeTap = (m) => {
  if (m.isMe) {
    openEditProfile();
  } else if (m.isFounder) {
    uni.showToast({ title: '星主：Rich（买方宏观首席）', icon: 'none' });
  } else {
    uni.showToast({ title: '财富星球活跃星友', icon: 'none' });
  }
};

const handleVipAction = () => {
  appState.isVipModalVisible = true;
};

// 分享星球弹窗
const handleSharePlanet = () => {
  uni.showModal({
    title: '分享「财不外露」星球',
    content: '专属邀请链接已生成：\nhttps://wealthplanet.app/invite?code=WP97181206\n\n是否立即复制链接？',
    confirmText: '复制链接',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: 'https://wealthplanet.app/invite?code=WP97181206',
          success: () => {
            uni.showToast({ title: '邀请链接已复制', icon: 'success' });
          }
        });
      }
    }
  });
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

// 分享海报
const handleSharePoster = () => {
  uni.showToast({ title: '正在生成星友专属邀请海报...', icon: 'none' });
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
  uni.showToast({ title: '已同步最新 3 条向星主提问记录', icon: 'none' });
};

const showNewsToast = () => {
  uni.showToast({ title: '理财资讯已同步至资讯频道', icon: 'none' });
};

const handleSettings = () => {
  uni.navigateTo({ url: '/pages/profile/settings' });
};
</script>

<style lang="scss" scoped>
.profile-page {
  padding-bottom: 75px;
  background-color: #f2f2f7;
  min-height: 100vh;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

/* 1. 顶部状态栏透明占位（App 端 WebView 全屏需避让状态栏/灵动岛） */
.status-bar-spacer {
  background: #ffffff;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

/* 2. 星球环形轨道主视觉 */
.orbit-wheel-wrap {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 24px 0;
}

.orbit-wheel-box {
  width: 356px;
  height: 356px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit-center-info {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 170px;
  z-index: 10;
  pointer-events: none;
}

.orbit-planet-name {
  font-size: 19px;
  font-weight: 700;
  color: #1c1c1e;
  letter-spacing: -0.2px;
  margin-bottom: 5px;
}

.orbit-planet-id {
  font-size: 12px;
  color: #8e8e93;
  margin-bottom: 4px;
}

.orbit-expire-date {
  font-size: 11px;
  color: #8e8e93;
}

.orbit-node {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -23px;
  margin-top: -23px;
  width: 46px;
  height: 46px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  cursor: pointer;

  &.is-founder {
    margin-left: -29px;
    margin-top: -29px;
    width: 58px;
    height: 58px;
  }

  &.is-me {
    margin-left: -29px;
    margin-top: -29px;
    width: 58px;
    height: 58px;
  }
}

.founder-crown-wrap {
  position: absolute;
  top: -18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffffff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);

  &.founder-ring {
    width: 58px;
    height: 58px;
    border: 2.5px solid #f59e0b;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
  }

  &.me-ring {
    width: 58px;
    height: 58px;
    border: 3px solid #10b981;
    box-shadow: 0 0 16px rgba(16, 185, 129, 0.55);
  }
}

.orbit-name {
  position: absolute;
  bottom: -20px;
  font-size: 11.5px;
  color: #64748b;
  white-space: nowrap;
  font-weight: 500;

  &.me-name {
    bottom: -22px;
    font-size: 12px;
    color: #1e293b;
    font-weight: 700;
  }
}

.orbit-member-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 12px;
  gap: 3px;
}

.member-id-text {
  font-size: 12.5px;
  font-weight: 600;
  color: #f43f5e;
}

.member-joined-text {
  font-size: 11.5px;
  color: #8e8e93;
}

.btn-share-planet {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 22px;
  border-radius: 20px;
  border: 1px solid #10b981;
  background: #ffffff;
  cursor: pointer;
  margin-top: 14px;
  transition: transform 0.15s ease, background-color 0.15s ease;

  &:active {
    transform: scale(0.96);
    background: #f0fdf4;
  }
}

.share-btn-text {
  font-size: 13.5px;
  font-weight: 600;
  color: #10b981;
}

/* 3. 菜单列表区 */
.planet-menu-section {
  background: #ffffff;
  border-top: 0.5px solid rgba(60, 60, 67, 0.06);
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.06);
}

/* 设置入口独立分组：与上一组之间露出灰色间隔 */
.settings-standalone {
  margin-top: 10px;
  border-top: 0.5px solid rgba(60, 60, 67, 0.06);
}

.menu-cell-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.06);
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:active {
    background-color: #f8fafc;
  }

  &.is-last {
    border-bottom: none;
  }
}

.cell-label {
  font-size: 15px;
  font-weight: 500;
  color: #1c1c1e;
}

.cell-right-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-chip-preview {
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-chip-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
}

.user-chip-name {
  font-size: 14px;
  color: #8e8e93;
}

.auth-cert-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border: 0.5px solid #cbd5e1;
  border-radius: 4px;
  padding: 1px 4px;
}

.cert-icon-txt {
  font-size: 9px;
  color: #ffffff;
  background: #0284c7;
  border-radius: 2px;
  padding: 0 2px;
  line-height: 1.2;
}

.cert-lbl {
  font-size: 10px;
  color: #64748b;
  line-height: 1.2;
}

.poster-chip {
  background: #e0f2fe;
  color: #0284c7;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  line-height: 1.3;
}

.activity-chip {
  background: #ecfdf5;
  color: #059669;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  line-height: 1.3;
}

.cell-val-txt {
  font-size: 14px;
  color: #8e8e93;
}

.privilege-active-txt {
  font-size: 13px;
  color: #d97706;
  font-weight: 600;
}

.privilege-locked-txt {
  font-size: 13px;
  color: #64748b;
}

.cell-arrow {
  margin-left: 2px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 14px 18px 8px 18px;
  background: #f2f2f7;
}

/* 4. 验收控制台 */
.demo-perspective-card {
  margin: 0 16px;
  background: #ffffff;
  border-radius: 8px;
  padding: 10px;
  border: 0.5px solid rgba(0, 0, 0, 0.05);
}

.ps-segmented-grid {
  display: flex;
  gap: 8px;
}

.ps-seg-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 9px 0;
  background: #f8fafc;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;

  &.is-active {
    background: #1c1c1e;
    color: #f59e0b;
    font-weight: 700;
  }
}

.ps-item-name {
  font-size: 12px;
}

/* 5. 备案落款 */
.profile-footer-section {
  padding: 24px 16px 20px 16px;
}

.compliance-footnote {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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

/* 6. 编辑个人资料抽屉 */
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
  border-radius: 16px 16px 0 0;
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
  padding: 14px 18px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.08);
}

.edit-sheet-title {
  font-size: 16px;
  font-weight: 700;
  color: #1c1c1e;
}

.edit-sheet-close {
  font-size: 18px;
  color: #8e8e93;
  cursor: pointer;
  padding: 4px 8px;
}

.edit-sheet-body {
  padding: 16px 18px;
  overflow-y: auto;
}

.edit-field {
  margin-bottom: 16px;
}

.edit-label {
  font-size: 13px;
  font-weight: 600;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #10b981;
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
    border-color: #10b981;
  }
}

.edit-avatar-thumb {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.edit-input {
  width: 100%;
  height: 40px;
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

.edit-note {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-top: 6px;
}

.edit-sheet-footer {
  display: flex;
  gap: 10px;
  padding: 10px 18px;
  border-top: 0.5px solid rgba(60, 60, 67, 0.08);
}

.edit-btn-cancel {
  flex: 1;
  height: 42px;
  border-radius: 8px;
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
  height: 42px;
  border-radius: 8px;
  background: #10b981;
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
