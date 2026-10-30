<template>
  <view v-if="visible" class="rp-mask" @tap="emit('close')">
    <view class="rp-card" @tap.stop>
      <view class="rp-card-frame">
        <!-- 标题行 -->
        <view class="rp-title-row">
          <view class="rp-title-line"></view>
          <text class="rp-title-star">✦</text>
          <text class="rp-title-text">{{ title }}</text>
          <text class="rp-title-star">✦</text>
          <view class="rp-title-line"></view>
        </view>

        <!-- 特权列表（超长时内部滚动） -->
        <scroll-view scroll-y class="rp-privilege-scroll">
          <view class="rp-privilege-list">
            <text class="rp-privilege-item">可被成员提问</text>
            <text class="rp-privilege-item">星球内外荣誉身份标识</text>
            <text class="rp-privilege-item">发布主题自动推送全员</text>
            <text class="rp-privilege-item rp-privilege-free">永久免费</text>
          </view>
        </scroll-view>
      </view>

      <!-- 关闭按钮 -->
      <view class="rp-btn" @tap="emit('close')">我知道了</view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  // founder: 星主 | partner: 合伙人 | guest_expert: 嘉宾
  role: { type: String, default: 'founder' }
});

const emit = defineEmits(['close']);

const title = computed(() => {
  if (props.role === 'partner') return '合伙人特权';
  if (props.role === 'guest_expert') return '嘉宾特权';
  return '星主特权';
});
</script>

<style scoped>
.rp-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rp-fade-in 0.2s ease;
}

@keyframes rp-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.rp-card {
  width: 78%;
  max-width: 340px;
  max-height: 70vh;
  background: #fffdf6;
  border: 1px solid #e7d9b8;
  border-radius: 8px;
  padding: 5px;
  box-shadow: 0 18px 48px rgba(80, 60, 10, 0.28);
  animation: rp-pop-in 0.22s ease;
  display: flex;
  flex-direction: column;
}

@keyframes rp-pop-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

/* 内层金细边框（双层描边卡片质感） */
.rp-card-frame {
  border: 1px solid #f0e4c6;
  border-radius: 6px;
  padding: 22px 16px 20px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.rp-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.rp-title-line {
  width: 34px;
  height: 1px;
  background: #dcc793;
}

.rp-title-star {
  font-size: 11px;
  color: #c9a24b;
  margin: 0 7px;
}

.rp-title-text {
  font-size: 17px;
  font-weight: 700;
  color: #a16207;
  letter-spacing: 2px;
  margin: 0 2px;
}

.rp-privilege-scroll {
  flex: 1;
  min-height: 0;
  max-height: 40vh;
}

.rp-privilege-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rp-privilege-item {
  font-size: 14px;
  color: #c2703d;
  line-height: 1.6;
  padding: 7px 0;
}

.rp-privilege-free {
  color: #b45309;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.rp-btn {
  margin-top: 16px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8c274, #d4a13e);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #271700;
}
</style>
