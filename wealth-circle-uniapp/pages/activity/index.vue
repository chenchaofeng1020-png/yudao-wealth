<template>
  <view class="act-list-page">
    <view
      v-for="a in list"
      :key="a.id"
      class="act-card"
      @tap="goDetail(a)"
    >
      <view class="poster-wrap">
        <image :src="a.poster" mode="aspectFill" class="poster-img" />
        <view v-if="isEnded(a)" class="poster-badge ended">已结束</view>
        <view v-else class="poster-badge recruiting">报名中</view>
        <view v-if="a.registered" class="registered-flag">已报名 ✓</view>
      </view>

      <view class="act-body">
        <text class="act-name">{{ a.name }}</text>
        <view class="meta-row">
          <text class="meta-icon">🕓</text>
          <text class="meta-text">{{ a.startTime }} ~ {{ a.endTime.slice(11) }}</text>
        </view>
        <view class="meta-row">
          <text class="meta-icon">📍</text>
          <text class="meta-text ellipsis-1">{{ a.location }}</text>
        </view>
        <view class="price-row">
          <text class="price-num">{{ priceText(a) }}</text>
          <text class="price-unit">/人 起</text>
          <view class="go-arrow">›</view>
        </view>
      </view>
    </view>

    <view v-if="!list.length" class="empty-tip">
      <text>暂无线下活动，敬请期待</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { activitiesMock } from '../../store/community.js';

const list = ref([...activitiesMock]);

// 返回本页时刷新已报名标记
onShow(() => {
  list.value = [...activitiesMock];
});

const isEnded = (a) => a.status === 'ended';

const priceText = (a) => {
  if (!a.tickets.length) return '免费';
  const min = Math.min(...a.tickets.map((t) => t.price));
  return `¥${min}`;
};

const goDetail = (a) => {
  uni.navigateTo({ url: `/pages/activity/detail?id=${a.id}` });
};
</script>

<style lang="scss" scoped>
.act-list-page {
  padding: 12px 14px 40px;
  background: #f8fafc;
  min-height: 100vh;
}

.act-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #edf2f7;
  overflow: hidden;
  margin-bottom: 14px;
}

.poster-wrap {
  position: relative;
  width: 100%;
  height: 158px;
}

.poster-img {
  width: 100%;
  height: 100%;
}

.poster-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 99px;

  &.recruiting {
    background: rgba(16, 185, 129, 0.92);
    color: #ffffff;
  }
  &.ended {
    background: rgba(71, 85, 105, 0.88);
    color: #ffffff;
  }
}

.registered-flag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 99px;
  background: rgba(245, 158, 11, 0.95);
  color: #ffffff;
}

.act-body {
  padding: 12px 14px 14px;
}

.act-name {
  display: block;
  font-size: 15.5px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.meta-icon {
  font-size: 12px;
}

.meta-text {
  font-size: 12px;
  color: #64748b;
}

.ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-row {
  display: flex;
  align-items: baseline;
  margin-top: 10px;
}

.price-num {
  font-size: 18px;
  font-weight: 900;
  color: #dc2626;
}

.price-unit {
  font-size: 10.5px;
  color: #94a3b8;
  margin-left: 2px;
}

.go-arrow {
  margin-left: auto;
  font-size: 20px;
  color: #cbd5e1;
  font-weight: 700;
}

.empty-tip {
  padding: 80px 0;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}
</style>
