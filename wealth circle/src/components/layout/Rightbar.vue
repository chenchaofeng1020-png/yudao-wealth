<template>
  <aside class="rightbar-container" ref="rightbarRef">
    <!-- Card 1: Circle Profile Card (from Screenshot 2) -->
    <div class="widget-card circle-profile-card">
      <div class="circle-banner-container">
        <img :src="circleBanner" class="circle-banner-img" alt="财不外露" />
        <div class="circle-avatar-wrapper">
          <img :src="avatarRich" class="circle-profile-avatar" alt="Rich" />
        </div>
      </div>

      <div class="circle-card-content">
        <h3 class="circle-brand-name">财不外露</h3>
        <p class="circle-intro-text">
          这里是专注全球资产配置与家庭理财实践的成长基地，由一群深耕资管多年的老伙计打造。我们不堆{{ isIntroExpanded ? '砌晦涩概念，只输出穿越周期的实战框架与底仓逻辑。提供全方位大类资产配置、公募基金优选、固收与海外宽基配置方案，陪伴每一位星友稳健成长。' : '...' }}
        </p>
        <button class="btn-expand-intro" @click="isIntroExpanded = !isIntroExpanded">
          {{ isIntroExpanded ? '收起' : '展开' }}
        </button>

        <!-- Community Members Entrance (查看星球成员入口) -->
        <div 
          class="circle-members-entry" 
          @click="actions.openMembersModal" 
          title="点击查看星球全部成员名录"
        >
          <div class="members-entry-left">
            <div class="avatar-stack">
              <img :src="avatarRich" class="stack-avatar" alt="Rich" />
              <img :src="avatarJohn" class="stack-avatar" alt="John" />
              <img :src="avatarJerry" class="stack-avatar" alt="Jerry" />
              <img :src="avatarMark" class="stack-avatar" alt="Mark" />
            </div>
          </div>
          <div class="members-entry-right">
            <div class="members-count-desc">
              <span class="count-bold">14,280</span>
              <span class="count-unit">位星友</span>
            </div>
            <svg class="entry-arrow-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 2: Ask Them Q&A Card (from Screenshot 2) -->
    <div class="widget-card ask-experts-card">
      <div class="ask-header">
        <div class="ask-title">向他们提问</div>
        <div class="ask-subtitle">星主&合伙人 7 位，嘉宾 2 位</div>
      </div>
      <div class="ask-divider"></div>

      <div class="experts-list">
        <!-- Expert 1: Rich -->
        <div class="expert-item">
          <img :src="avatarRich" class="expert-avatar" alt="Rich" />
          <div class="expert-info">
            <div class="expert-name">Rich</div>
            <div class="expert-desc">金融公司高管，10 ...</div>
          </div>
          <button class="btn-ask-circle" title="向 Rich 提问" @click="handleAsk('Rich', avatarRich)">
            问
          </button>
        </div>

        <!-- Expert 2: John -->
        <div class="expert-item">
          <img :src="avatarJohn" class="expert-avatar" alt="John" />
          <div class="expert-info">
            <div class="expert-name">John</div>
            <div class="expert-desc">国际证券特约员、...</div>
          </div>
          <button class="btn-ask-circle" title="向 John 提问" @click="handleAsk('John', avatarJohn)">
            问
          </button>
        </div>

        <!-- Expert 3: Jerry -->
        <div class="expert-item">
          <img :src="avatarJerry" class="expert-avatar" alt="Jerry" />
          <div class="expert-info">
            <div class="expert-name">Jerry</div>
            <div class="expert-desc">理财规划导师、投...</div>
          </div>
          <button class="btn-ask-circle" title="向 Jerry 提问" @click="handleAsk('Jerry', avatarJerry)">
            问
          </button>
        </div>
      </div>

      <div class="ask-footer">
        <button class="btn-more-experts" @click="actions.showToast('已展示全部 9 位合伙人与特邀嘉宾')">
          查看更多 &gt;
        </button>
      </div>
    </div>

    <!-- Featured Columns Titles Card -->
    <div class="widget-card featured-columns-widget">
      <div class="widget-title-row">
        <h4 class="widget-title">精选专栏</h4>
        <span class="widget-action" @click="actions.switchView('column')">查看更多</span>
      </div>
      <div class="columns-header-divider"></div>

      <div class="column-title-list">
        <template v-for="(col, index) in appState.columns.slice(0, 10)" :key="col.id">
          <div 
            class="column-title-item"
            @click="handleColumnClick(col)"
            :title="`前往专栏：${col.title}`"
          >
            <span :class="['col-index-tag', `rank-${index + 1}`]">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="col-title-text">{{ col.title }}</div>
            <svg class="col-arrow-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-if="index < appState.columns.length - 1" class="column-item-divider"></div>
        </template>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { appState, actions } from '@/stores/community';
import circleBanner from '@/assets/circle_banner.png';
import avatarRich from '@/assets/avatar_rich.png';
import avatarJohn from '@/assets/avatar_john.png';
import avatarJerry from '@/assets/avatar_jerry.png';
import avatarMark from '@/assets/avatar_mark.png';

const rightbarRef = ref<HTMLElement | null>(null);
const isIntroExpanded = ref(false);

onMounted(() => {
  if (rightbarRef.value) {
    rightbarRef.value.scrollTop = 0;
  }
});

const handleAsk = (expertName: string, expertAvatar?: string) => {
  if (appState.user.role === 'guest') {
    actions.requireVip('开通会员后即可向合伙人/专享专家提问');
    return;
  }
  actions.openAskModal(expertName, expertAvatar);
};

const handleColumnClick = (col: any) => {
  actions.switchView('column');
  actions.showToast(`已进入专栏：${col.title}`);
};

const quickFilterTag = (tag: string) => {
  actions.setCurrentView('feed');
  actions.showToast(`已筛选相关标的/话题：${tag}`);
};
</script>

<style scoped>
.rightbar-container {
  width: 324px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  /* 独立灰色底：作为 main 外的独立列，灰面贴齐顶栏下缘与主体右缘 */
  background-color: #f1f5f9;
  padding: 12px 12px 32px 12px;
  user-select: none;
  flex-shrink: 0;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.2s ease;
}

.rightbar-container:hover {
  scrollbar-color: #cbd5e1 transparent;
}

.rightbar-container::-webkit-scrollbar {
  width: 6px;
}

.rightbar-container::-webkit-scrollbar-track {
  background: transparent;
}

.rightbar-container::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.rightbar-container:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}

.rightbar-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.widget-card {
  background: var(--bg-card);
  border: none;
  border-radius: 8px;
  padding: 18px;
  box-shadow: var(--shadow-card);
  flex-shrink: 0;
}

/* Card 1: Circle Profile Card (Screenshot 2) */
.circle-profile-card {
  padding: 0;
  overflow: hidden;
}

.circle-banner-container {
  position: relative;
  width: 100%;
  height: 180px;
}

.circle-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-avatar-wrapper {
  position: absolute;
  right: 18px;
  bottom: -22px;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  background: #ffffff;
  z-index: 2;
}

.circle-profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-card-content {
  padding: 16px 20px 18px 20px;
}

.circle-brand-name {
  font-size: 22px;
  font-weight: 900;
  color: var(--primary-navy);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.circle-intro-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 6px;
}

.btn-expand-intro {
  background: transparent;
  color: var(--brand-green);
  font-size: 13px;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
}
.btn-expand-intro:hover {
  text-decoration: underline;
}

/* Community Members Entrance */
.circle-members-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 8px 10px;
  background: #f8fafc;
  border: 1px solid #eaedf1;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.circle-members-entry:hover {
  background: #ffffff;
  border-color: var(--brand-green);
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.08);
}

.members-entry-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-stack {
  display: flex;
  align-items: center;
}

.stack-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid #ffffff;
  object-fit: cover;
  margin-left: -7px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.stack-avatar:first-child {
  margin-left: 0;
}

.members-count-desc {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.count-bold {
  font-size: 13px;
  font-weight: 800;
  color: var(--primary-navy);
}

.count-unit {
  font-size: 11px;
  color: #64748b;
}

.members-entry-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.entry-arrow-icon {
  width: 14px;
  height: 14px;
  color: var(--brand-green);
  transition: transform var(--transition-fast);
}

.circle-members-entry:hover .entry-arrow-icon {
  transform: translateX(2px);
}

/* Card 2: Ask Experts Card (Screenshot 2) */
.ask-experts-card {
  padding: 18px 20px;
}

.ask-header {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
}

.ask-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-navy);
}

.ask-subtitle {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.ask-divider {
  height: 1px;
  background: var(--border-light);
  margin-bottom: 8px;
}

.experts-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.expert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.expert-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.expert-info {
  flex: 1;
  min-width: 0;
}

.expert-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--primary-navy);
}

.expert-desc {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-ask-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid var(--brand-green);
  background: #ffffff;
  color: var(--brand-green);
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}
.btn-ask-circle:hover {
  background: var(--brand-green-light);
  border-color: var(--brand-green-hover);
  color: var(--brand-green-hover);
  transform: scale(1.08);
}

.ask-footer {
  margin-top: 10px;
  padding-top: 4px;
}

.btn-more-experts {
  background: transparent;
  color: var(--brand-green);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
.btn-more-experts:hover {
  text-decoration: underline;
}

.founder-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cert-check {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 18px;
  height: 18px;
  background: var(--brand-green);
  color: #ffffff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
}

.circle-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-navy);
}

.circle-tagline {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--border-light);
  background: #fcfdfe;
}

.stat-cell {
  padding: 12px 6px;
  text-align: center;
}

.stat-cell:not(:last-child) {
  border-right: 1px solid var(--border-light);
}

.stat-val {
  font-size: 15px;
  font-weight: 800;
  color: var(--primary-navy);
}

.stat-lbl {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* VIP Card */
.vip-privilege-card {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #ffffff;
  box-shadow: none;
}

.vip-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vip-gold-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 800;
  color: #fcd34d;
}

.gold-crown-icon {
  font-size: 16px;
}

.vip-chip {
  font-size: 10px;
  font-weight: 700;
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.4);
  padding: 1px 6px;
  border-radius: 4px;
}

.vip-desc {
  font-size: 12px;
  color: #cbd5e1;
  margin: 10px 0 12px 0;
  line-height: 1.5;
}

.vip-privilege-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 16px;
}

.vip-privilege-list li {
  font-size: 12px;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.check-icon {
  color: #f59e0b;
  font-size: 12px;
}

.vip-pricing-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.currency {
  font-size: 14px;
  color: #fcd34d;
  font-weight: 700;
}

.amount {
  font-size: 22px;
  font-weight: 900;
  color: #fcd34d;
}

.cycle {
  font-size: 11px;
  color: #94a3b8;
}

.original-price {
  font-size: 11px;
  color: #64748b;
  text-decoration: line-through;
  margin-left: 4px;
}

/* Featured Columns Titles */
.widget-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.columns-header-divider {
  height: 1px;
  background: var(--border-light);
  margin-bottom: 10px;
}

.column-item-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 3px 6px;
}

.widget-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--primary-navy);
}

.widget-action {
  font-size: 12px;
  color: var(--brand-green);
  cursor: pointer;
  font-weight: 600;
  transition: color var(--transition-fast);
}

.widget-action:hover {
  color: var(--brand-green-hover);
  text-decoration: underline;
}

.column-title-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.column-title-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.column-title-item:hover {
  background: var(--bg-subtle);
  border-color: #e2e8f0;
}

.column-title-item:hover .col-title-text {
  color: var(--brand-green-hover);
}

.column-title-item:hover .col-arrow-icon {
  color: var(--brand-green-hover);
  transform: translateX(2px);
}

.col-index-tag {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.col-index-tag.rank-1 {
  background: #ecfdf5;
  color: #059669;
}

.col-index-tag.rank-2 {
  background: #eff6ff;
  color: #2563eb;
}

.col-index-tag.rank-3 {
  background: #fef3c7;
  color: #d97706;
}

.col-title-text {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-navy);
  line-height: 1.4;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color var(--transition-fast);
}

.col-arrow-icon {
  width: 14px;
  height: 14px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}
</style>
