<template>
  <view class="act-list-page">
    <!-- 1. 顶部自定义固定导航栏 (含状态栏安全区) -->
    <view class="custom-nav-bar" :class="{ 'is-scrolled': isScrolled }">
      <view class="nav-safe-inset"></view>
      <view class="nav-content-row">
        <view class="nav-back-btn" @tap="handleGoBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </view>
        <view class="nav-title-group">
          <text class="nav-title-text">活动中心</text>
        </view>
        <view class="nav-right-slot"></view>
      </view>
    </view>

    <!-- 导航栏占位 -->
    <view class="nav-placeholder"></view>

    <!-- 3. 分类筛选胶囊 Tabs -->
    <view class="filter-sticky-bar">
      <view class="filter-tabs-wrapper">
        <view
          v-for="tab in filterTabs"
          :key="tab.key"
          class="filter-pill-item"
          :class="{ active: activeFilter === tab.key }"
          @tap="activeFilter = tab.key"
        >
          <text class="filter-pill-text">{{ tab.label }}</text>
          <text v-if="tab.count > 0" class="filter-count-badge">{{ tab.count }}</text>
        </view>
      </view>
    </view>

    <!-- 4. 活动卡片列表 -->
    <view class="list-wrap">
      <view
        v-for="a in displayedList"
        :key="a.id"
        class="act-card"
        @tap="goDetail(a)"
      >
        <!-- 卡片海报区域 -->
        <view class="poster-wrap">
          <image :src="a.poster" mode="aspectFill" class="poster-img" />
          <view class="poster-gradient-mask"></view>

          <!-- 顶部状态胶囊 -->
          <view class="poster-header-tags">
            <!-- 状态角标 -->
            <view v-if="isEnded(a)" class="glass-badge ended">
              <span class="badge-dot ended-dot"></span>
              <text class="badge-text">已结束</text>
            </view>
            <view v-else class="glass-badge recruiting">
              <span class="badge-dot live-dot"></span>
              <text class="badge-text">报名中</text>
            </view>
          </view>
        </view>

        <!-- 卡片内容区域 -->
        <view class="act-body">
          <view class="act-name-row">
            <text class="act-name">{{ a.name }}</text>
          </view>

          <!-- 结构化元数据块（替代原型时代的粗糙单行） -->
          <view class="meta-dossier-box">
            <!-- 时间行 -->
            <view class="meta-dossier-row">
              <view class="meta-icon-box">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </view>
              <text class="meta-dossier-text">{{ formatTimeRange(a.startTime, a.endTime) }}</text>
            </view>

            <!-- 地点行 -->
            <view class="meta-dossier-row">
              <view class="meta-icon-box">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </view>
              <text class="meta-dossier-text ellipsis-1">{{ a.location }}</text>
            </view>
          </view>

          <!-- 价格与行动呼应栏 -->
          <view class="card-footer-row">
            <view class="price-container">
              <text class="price-symbol">¥</text>
              <text class="price-num">{{ getMinPrice(a) }}</text>
              <text class="price-unit">/位 起</text>
            </view>

            <view class="action-btn-wrapper">
              <view
                class="act-cta-button"
                :class="{
                  'cta-registered': a.registered,
                  'cta-ended': isEnded(a),
                  'cta-recruiting': !a.registered && !isEnded(a)
                }"
              >
                <text class="cta-btn-text">
                  {{ a.registered ? '查看报名结果' : isEnded(a) ? '查看往期内容' : '立即报名' }}
                </text>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 优雅空状态展示 -->
      <view v-if="!displayedList.length" class="empty-state-card">
        <view class="empty-icon-circle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="9" y1="14" x2="15" y2="14"></line>
          </svg>
        </view>
        <text class="empty-main-text">暂无符合条件的线下活动</text>
        <text class="empty-sub-text">星主正在筹划下期闭门沙龙，敬请关注星球公告</text>
        <view class="btn-reset-filter" @tap="activeFilter = 'all'">
          <text class="btn-reset-text">查看全部活动</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onShow, onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app';
import { activitiesMock } from '../../store/community.js';

const list = ref([...activitiesMock]);
const activeFilter = ref('all');
const scrollTop = ref(0);

const isScrolled = computed(() => scrollTop.value > 15);

onPageScroll((e) => {
  scrollTop.value = Math.max(0, e.scrollTop || 0);
});

onShow(() => {
  list.value = [...activitiesMock];
});

onPullDownRefresh(() => {
  setTimeout(() => {
    list.value = [...activitiesMock];
    uni.stopPullDownRefresh();
    uni.showToast({ title: '已同步最新活动', icon: 'none' });
  }, 400);
});

const isEnded = (a) => a.status === 'ended';

const filterTabs = computed(() => {
  const allCount = list.value.length;
  const recruitingCount = list.value.filter((a) => !isEnded(a)).length;
  const registeredCount = list.value.filter((a) => a.registered).length;
  const endedCount = list.value.filter((a) => isEnded(a)).length;

  return [
    { key: 'all', label: '全部', count: allCount },
    { key: 'recruiting', label: '报名中', count: recruitingCount },
    { key: 'registered', label: '已报名', count: registeredCount },
    { key: 'ended', label: '往期回顾', count: endedCount }
  ];
});

const displayedList = computed(() => {
  if (activeFilter.value === 'recruiting') {
    return list.value.filter((a) => !isEnded(a));
  }
  if (activeFilter.value === 'registered') {
    return list.value.filter((a) => a.registered);
  }
  if (activeFilter.value === 'ended') {
    return list.value.filter((a) => isEnded(a));
  }
  return list.value;
});

const formatTimeRange = (start, end) => {
  if (!start) return '';
  if (!end) return start;
  // 格式化输出：2026-10-28 14:00 ~ 17:00
  const endPart = end.length > 11 ? end.slice(11) : end;
  return `${start} ~ ${endPart}`;
};

const getMinPrice = (a) => {
  if (!a.tickets || !a.tickets.length) return '0';
  const min = Math.min(...a.tickets.map((t) => t.price));
  return String(min);
};

const goDetail = (a) => {
  uni.navigateTo({ url: `/pages/activity/detail?id=${a.id}` });
};

const handleGoBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 });
  } else {
    uni.switchTab({ url: '/pages/profile/index' });
  }
};
</script>

<style lang="scss" scoped>
.act-list-page {
  background: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  padding-bottom: 50px;
}

/* 1. 顶部自定义固定导航栏 */
.custom-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.1);
  transition: all 0.22s ease;

  &.is-scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
  }
}

.nav-safe-inset {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}

.nav-content-row {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
}

.nav-back-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.92);
  }
}

.nav-title-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.nav-title-text {
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
  line-height: 1.2;
}

.nav-right-slot {
  width: 34px;
}

.nav-placeholder {
  height: calc(48px + constant(safe-area-inset-top));
  height: calc(48px + env(safe-area-inset-top));
}

/* 3. 分类筛选胶囊 Tabs */
.filter-sticky-bar {
  position: sticky;
  top: calc(48px + constant(safe-area-inset-top));
  top: calc(48px + env(safe-area-inset-top));
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 10px 14px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.06);
}

.filter-tabs-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-pill-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 0.5px solid rgba(60, 60, 67, 0.1);
  border-radius: 99px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.18s ease;

  &.active {
    background: #4e4e4e;
    border-color: #4e4e4e;

    .filter-pill-text {
      color: #ffffff;
      font-weight: 700;
    }

    .filter-count-badge {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
  }

  &:active {
    transform: scale(0.96);
  }
}

.filter-pill-text {
  font-size: 12.5px;
  color: #475569;
  font-weight: 500;
}

.filter-count-badge {
  font-size: 10.5px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 99px;
  padding: 1px 6px;
  line-height: 1.2;
}

/* 4. 活动卡片列表 */
.list-wrap {
  padding: 12px 14px 30px;
}

.act-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  border: 0.5px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 4px 18px -4px rgba(15, 23, 42, 0.06);
  transition: transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:active {
    transform: scale(0.985);
  }
}

/* 海报区域 */
.poster-wrap {
  position: relative;
  width: 100%;
  height: 180px;
  background: #0f172a;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 100%;
  display: block;
}

.poster-gradient-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.6) 100%);
  pointer-events: none;
}

.poster-header-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
}

.glass-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &.recruiting {
    background: rgba(16, 185, 129, 0.9);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35);
  }

  &.ended {
    background: rgba(15, 23, 42, 0.75);
    color: #cbd5e1;
  }
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;

  &.live-dot {
    background: #ffffff;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.9);
  }

  &.ended-dot {
    background: #94a3b8;
  }
}

.badge-text {
  line-height: 1;
}

/* 卡片内容区 */
.act-body {
  padding: 16px 16px 14px;
}

.act-name-row {
  margin-bottom: 10px;
}

.act-name {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
  letter-spacing: -0.25px;
}

.meta-dossier-box {
  background: #f8fafc;
  border: 0.5px solid rgba(60, 60, 67, 0.06);
  border-radius: 10px;
  padding: 9px 12px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-dossier-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.meta-icon-box {
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.meta-dossier-text {
  font-size: 12.5px;
  color: #475569;
  line-height: 1.4;
  font-weight: 500;
}

.ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.card-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 0.5px solid rgba(60, 60, 67, 0.08);
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 1px;
}

.price-symbol {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.price-num {
  font-size: 21px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  font-variant-numeric: tabular-nums;
}

.price-unit {
  font-size: 11.5px;
  color: #94a3b8;
  margin-left: 2px;
  font-weight: 500;
}

.action-btn-wrapper {
  display: flex;
  align-items: center;
}

.act-cta-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 99px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &.cta-recruiting {
    background: #10b981;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

    &:active {
      transform: scale(0.95);
      background: #059669;
    }
  }

  &.cta-registered {
    background: #10b981;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

    &:active {
      transform: scale(0.95);
      background: #059669;
    }
  }

  &.cta-ended {
    background: #f1f5f9;
    color: #64748b;
    border: 0.5px solid rgba(60, 60, 67, 0.08);

    &:active {
      background: #e2e8f0;
    }
  }
}

.cta-btn-text {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1;
}

/* 空状态 */
.empty-state-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  border: 0.5px solid rgba(15, 23, 42, 0.06);
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: #f8fafc;
  border: 0.5px solid rgba(60, 60, 67, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.empty-main-text {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.empty-sub-text {
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 20px;
}

.btn-reset-filter {
  background: #f1f5f9;
  border-radius: 99px;
  padding: 8px 20px;
  cursor: pointer;

  &:active {
    background: #e2e8f0;
  }
}

.btn-reset-text {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}
</style>
