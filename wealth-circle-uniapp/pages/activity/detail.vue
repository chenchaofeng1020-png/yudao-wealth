<template>
  <view class="act-page">
    <!-- 顶部海报 -->
    <view class="poster-wrap">
      <image :src="activity.poster" mode="aspectFill" class="poster-img" />
      <view v-if="isEnded" class="poster-badge">已结束</view>
      <view v-else class="poster-badge recruiting">报名中</view>
    </view>

    <!-- 基本信息 -->
    <view class="info-card">
      <view class="title-row">
        <text class="act-title">{{ activity.name }}</text>
      </view>
      <view class="meta-row">
        <text class="meta-icon">🕓</text>
        <text class="meta-text">{{ activity.startTime }} 至 {{ activity.endTime }}</text>
      </view>
      <view class="meta-row">
        <text class="meta-icon">📍</text>
        <text class="meta-text">{{ activity.location }}</text>
      </view>
      <view v-if="!isEnded" class="meta-row deadline">
        <text class="meta-icon">⏳</text>
        <text class="meta-text strong">报名截止：{{ activity.signupDeadline }}</text>
      </view>
    </view>

    <!-- 票种选择 -->
    <view class="section-card">
      <view class="section-head">
        <text class="section-title">选择票种</text>
      </view>
      <text class="section-tip">报名时需先选择票种，每张票需填写一份报名信息</text>
      <view
        v-for="t in activity.tickets"
        :key="t.id"
        class="ticket-item"
        :class="{
          selected: selectedTicketId === t.id,
          disabled: isEnded || isSoldOut(t)
        }"
        @tap="selectTicket(t)"
      >
        <view class="t-check" :class="{ on: selectedTicketId === t.id }">
          <text v-if="selectedTicketId === t.id">✓</text>
        </view>
        <view class="t-info">
          <view class="t-name-row">
            <text class="t-name">{{ t.name }}</text>
            <text class="t-remain" :class="{ warn: remainOf(t) <= 10 && !isSoldOut(t) }">
              {{ isSoldOut(t) ? '已售罄' : remainOf(t) <= 10 ? `仅剩 ${remainOf(t)} 张` : '余量充足' }}
            </text>
          </view>
          <text v-if="t.desc" class="t-desc">{{ t.desc }}</text>
        </view>
        <view class="t-price">
          <text class="t-price-num">¥{{ t.price }}</text>
          <text class="t-price-unit">/张</text>
        </view>
      </view>
    </view>

    <!-- 活动详情 -->
    <view class="section-card">
      <view class="section-head">
        <text class="section-title">活动详情</text>
      </view>
      <view class="act-rich">
        <rich-text :nodes="activity.detailHtml"></rich-text>
      </view>
    </view>

    <view class="bottom-space"></view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="price-block">
        <text class="price-label">{{ isEnded ? '报名费' : registered ? '报名费' : '需支付' }}</text>
        <view class="price-line">
          <text class="price-num">{{ minPriceText }}</text>
        </view>
      </view>
      <button class="btn-main" :class="{ disabled: isEnded || registered }" @tap="onMainAction">
        <text class="btn-main-text">{{ mainBtnText }}</text>
      </button>
    </view>

    <!-- ==================== 报名弹层 ==================== -->
    <view v-if="showSignup" class="overlay" @tap="closeSignup">
      <view class="sheet" @tap.stop>
        <view class="sheet-header">
          <text class="sheet-title">活动报名</text>
          <text class="sheet-close" @tap="closeSignup">✕</text>
        </view>

        <scroll-view scroll-y class="sheet-body">
          <!-- 票种确认 -->
          <view class="f-group">
            <view class="f-group-title">报名票种</view>
            <view
              v-for="t in selectableTickets"
              :key="t.id"
              class="mini-ticket"
              :class="{ on: selectedTicketId === t.id }"
              @tap="selectedTicketId = t.id"
            >
              <text class="mt-name">{{ t.name }}</text>
              <text class="mt-price">¥{{ t.price }}</text>
            </view>
          </view>

          <!-- 报名信息（按后台「报名信息设置」动态渲染） -->
          <view class="f-group">
            <view class="f-group-title">报名信息</view>
            <text class="f-group-tip">每张票需填写一份报名信息</text>
            <view v-for="f in activity.regFields" :key="f.id" class="form-item">
              <view class="f-label-row">
                <text class="f-label">{{ f.label }}</text>
                <text v-if="f.required" class="f-req">*</text>
              </view>

              <input
                v-if="f.type === 'name' || f.type === 'phone' || f.type === 'text'"
                v-model="formModel[f.id]"
                class="f-input"
                :type="f.type === 'phone' ? 'number' : 'text'"
                :maxlength="f.type === 'phone' ? 11 : 50"
                :placeholder="'请输入' + f.label"
                placeholder-class="f-placeholder"
              />

              <textarea
                v-else-if="f.type === 'textarea'"
                v-model="formModel[f.id]"
                class="f-textarea"
                :maxlength="200"
                :placeholder="'请输入' + f.label + '（选填）'"
                placeholder-class="f-placeholder"
              />

              <view v-else-if="f.type === 'radio'" class="f-options">
                <view
                  v-for="opt in optionsOf(f)"
                  :key="opt"
                  class="opt-item"
                  :class="{ on: formModel[f.id] === opt }"
                  @tap="formModel[f.id] = opt"
                >
                  <text class="opt-text">{{ opt }}</text>
                </view>
              </view>

              <view v-else-if="f.type === 'checkbox'" class="f-options">
                <view
                  v-for="opt in optionsOf(f)"
                  :key="opt"
                  class="opt-item"
                  :class="{ on: (formModel[f.id] || []).includes(opt) }"
                  @tap="toggleCheckbox(f, opt)"
                >
                  <text class="opt-text">{{ opt }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="sheet-footer">
          <view class="submit-price">
            <text class="sp-label">合计</text>
            <text class="sp-num">¥{{ selectedTicket ? selectedTicket.price : 0 }}</text>
          </view>
          <button class="btn-submit" @tap="submitSignup">
            <text class="btn-submit-text">提交报名</text>
          </button>
        </view>
      </view>
    </view>

    <!-- ==================== 模拟收银台 ==================== -->
    <view v-if="showPay" class="overlay pay-overlay">
      <view class="pay-sheet">
        <view class="pay-header">
          <text class="pay-title">收银台</text>
        </view>
        <view class="pay-merchant-row">
          <text class="pay-merchant">财不外露 · 财富星球</text>
        </view>
        <view class="pay-goods-row">
          <text class="pay-goods-label">活动报名</text>
          <text class="pay-goods-value">
            {{ activity.name }} · {{ selectedTicket ? selectedTicket.name : '' }}
          </text>
        </view>
        <view class="pay-amount-row">
          <text class="pay-amount-label">支付金额</text>
          <text class="pay-amount">¥{{ selectedTicket ? selectedTicket.price : 0 }}</text>
        </view>
        <button class="btn-pay" :disabled="paying" @tap="confirmPay">
          <text class="btn-pay-text">{{ paying ? '支付中…' : '确认支付' }}</text>
        </button>
        <text class="pay-cancel" @tap="showPay = false">取消支付</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { activitiesMock } from '../../store/community.js';

const activity = ref({});
const selectedTicketId = ref('');
const showSignup = ref(false);
const showPay = ref(false);
const paying = ref(false);
const formModel = reactive({});

onLoad((query) => {
  const found = activitiesMock.find((a) => a.id === query.id);
  activity.value = found || activitiesMock[0];
  if (!isEnded.value && activity.value.tickets.length) {
    selectedTicketId.value = activity.value.tickets[0].id;
  }
});

const isEnded = computed(() => activity.value.status === 'ended');
const registered = computed(() => !!activity.value.registered);

const selectableTickets = computed(() =>
  activity.value.tickets.filter((t) => !isSoldOut(t))
);

const selectedTicket = computed(() =>
  activity.value.tickets.find((t) => t.id === selectedTicketId.value)
);

const remainOf = (t) => (t.count || 0) - (t.sold || 0);
const isSoldOut = (t) => remainOf(t) <= 0;

const minPriceText = computed(() => {
  const list = activity.value.tickets || [];
  if (!list.length) return '免费';
  const min = Math.min(...list.map((t) => t.price));
  return list.length > 1 ? `¥${min} 起` : `¥${min}`;
});

const mainBtnText = computed(() => {
  if (isEnded.value) return '活动已结束';
  if (registered.value) return '已报名 ✓';
  return '立即报名';
});

const selectTicket = (t) => {
  if (isEnded.value || isSoldOut(t)) return;
  selectedTicketId.value = t.id;
};

const optionsOf = (f) =>
  (f.optionsText || '')
    .split(/[,，、]/)
    .map((s) => s.trim())
    .filter(Boolean);

const toggleCheckbox = (f, opt) => {
  const arr = formModel[f.id] || [];
  const idx = arr.indexOf(opt);
  if (idx >= 0) arr.splice(idx, 1);
  else arr.push(opt);
  formModel[f.id] = arr;
};

const onMainAction = () => {
  if (isEnded.value) {
    uni.showToast({ title: '本场活动已结束', icon: 'none' });
    return;
  }
  if (registered.value) {
    uni.showToast({ title: '你已报名成功，无需重复报名', icon: 'none' });
    return;
  }
  showSignup.value = true;
};

const closeSignup = () => {
  showSignup.value = false;
};

// 提交校验：必填 + 手机号格式
const submitSignup = () => {
  if (!selectedTicket.value) {
    uni.showToast({ title: '请先选择票种', icon: 'none' });
    return;
  }
  for (const f of activity.value.regFields) {
    const val = formModel[f.id];
    const empty = Array.isArray(val) ? val.length === 0 : !val || !String(val).trim();
    if (f.required && empty) {
      uni.showToast({ title: `请填写「${f.label}」`, icon: 'none' });
      return;
    }
    if (f.type === 'phone' && !empty && !/^1[3-9]\d{9}$/.test(String(val))) {
      uni.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    if (f.type === 'radio' && !empty && !optionsOf(f).includes(val)) {
      uni.showToast({ title: `请选择「${f.label}」`, icon: 'none' });
      return;
    }
  }
  showPay.value = true;
};

// 模拟支付成功
const confirmPay = () => {
  paying.value = true;
  uni.showLoading({ title: '支付中…' });
  setTimeout(() => {
    uni.hideLoading();
    paying.value = false;
    showPay.value = false;
    showSignup.value = false;
    activity.value.registered = true;
    const t = selectedTicket.value;
    if (t) t.sold = (t.sold || 0) + 1;
    uni.showToast({ title: '报名成功', icon: 'success' });
  }, 900);
};
</script>

<style lang="scss" scoped>
.act-page {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 海报 */
.poster-wrap {
  position: relative;
  width: 100%;
  height: 230px;
}

.poster-img {
  width: 100%;
  height: 100%;
}

.poster-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 99px;
  background: rgba(71, 85, 105, 0.88);
  color: #ffffff;

  &.recruiting {
    background: rgba(16, 185, 129, 0.92);
  }
}

/* 基本信息 */
.info-card {
  background: #ffffff;
  margin: -24px 14px 0;
  position: relative;
  border-radius: 14px;
  border: 1px solid #edf2f7;
  padding: 14px;
}

.title-row {
  margin-bottom: 10px;
}

.act-title {
  font-size: 17px;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.4;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
}

.meta-icon {
  font-size: 13px;
  line-height: 1.5;
}

.meta-text {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.5;

  &.strong {
    color: #b45309;
    font-weight: 700;
  }
}

.deadline .meta-text {
  color: #b45309;
  font-weight: 700;
}

/* 分区卡片 */
.section-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #edf2f7;
  padding: 14px;
  margin: 12px 14px 0;
}

.section-head {
  margin-bottom: 4px;
}

.section-title {
  font-size: 14.5px;
  font-weight: 800;
  color: #0f172a;
}

.section-tip {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 10px;
}

/* 票种 */
.ticket-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  margin-top: 10px;
  transition: all 0.15s;

  &.selected {
    border-color: #10b981;
    background: #f0fdf4;
  }

  &.disabled {
    opacity: 0.55;
  }
}

.t-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #ffffff;

  &.on {
    background: #10b981;
    border-color: #10b981;
  }
}

.t-info {
  flex: 1;
  min-width: 0;
}

.t-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.t-name {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.t-remain {
  font-size: 10.5px;
  color: #10b981;
  font-weight: 700;

  &.warn {
    color: #dc2626;
  }
}

.t-desc {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 3px;
  line-height: 1.45;
}

.t-price {
  flex-shrink: 0;
  text-align: right;
}

.t-price-num {
  font-size: 16px;
  font-weight: 900;
  color: #dc2626;
}

.t-price-unit {
  font-size: 10px;
  color: #94a3b8;
}

/* 富文本详情（rich-text 内节点样式需非 scoped 生效，见文件底部全局样式） */
.act-rich {
  margin-top: 6px;
}

/* 底部操作栏 */
.bottom-space {
  height: 84px;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #edf2f7;
  padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.price-block {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 10.5px;
  color: #94a3b8;
}

.price-num {
  font-size: 20px;
  font-weight: 900;
  color: #dc2626;
  line-height: 1.2;
}

.btn-main {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 10px;
  padding: 11px 26px;
  border: none;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);

  &.disabled {
    background: #cbd5e1;
    box-shadow: none;
  }
}

.btn-main-text {
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 800;
}

/* 弹层通用 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.sheet {
  width: 100%;
  max-height: 82vh;
  background: #ffffff;
  border-radius: 18px 18px 0 0;
  display: flex;
  flex-direction: column;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.sheet-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.sheet-close {
  font-size: 16px;
  color: #94a3b8;
  padding: 4px;
}

.sheet-body {
  flex: 1;
  padding: 14px 16px;
  box-sizing: border-box;
  max-height: 56vh;
}

.f-group {
  margin-bottom: 16px;
}

.f-group-title {
  font-size: 13px;
  font-weight: 800;
  color: #334155;
  margin-bottom: 8px;
}

.f-group-tip {
  display: block;
  font-size: 10.5px;
  color: #94a3b8;
  margin: -6px 0 8px;
}

/* 弹层内票种 */
.mini-ticket {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 12px;
  margin-bottom: 8px;

  &.on {
    border-color: #10b981;
    background: #f0fdf4;
  }
}

.mt-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.mt-price {
  font-size: 13px;
  font-weight: 900;
  color: #dc2626;
}

/* 动态表单 */
.form-item {
  margin-bottom: 12px;
}

.f-label-row {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 6px;
}

.f-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #475569;
}

.f-req {
  font-size: 12px;
  color: #dc2626;
  font-weight: 800;
}

.f-input {
  width: 100%;
  box-sizing: border-box;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  color: #0f172a;
}

.f-textarea {
  width: 100%;
  box-sizing: border-box;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  color: #0f172a;
  height: 72px;
}

.f-placeholder {
  color: #cbd5e1;
}

.f-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.opt-item {
  border: 1.5px solid #e2e8f0;
  border-radius: 99px;
  padding: 6px 14px;
  background: #ffffff;

  &.on {
    border-color: #10b981;
    background: #f0fdf4;

    .opt-text {
      color: #059669;
      font-weight: 700;
    }
  }
}

.opt-text {
  font-size: 12px;
  color: #475569;
}

/* 提交栏 */
.sheet-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid #f1f5f9;
}

.submit-price {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.sp-label {
  font-size: 11px;
  color: #94a3b8;
}

.sp-num {
  font-size: 19px;
  font-weight: 900;
  color: #dc2626;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 10px;
  padding: 10px 30px;
  border: none;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
}

.btn-submit-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
}

/* 收银台 */
.pay-overlay {
  align-items: center;
  justify-content: center;
}

.pay-sheet {
  width: 78%;
  background: #ffffff;
  border-radius: 14px;
  padding: 18px 18px 16px;
}

.pay-header {
  text-align: center;
  margin-bottom: 14px;
}

.pay-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.pay-merchant-row {
  text-align: center;
  margin-bottom: 14px;
}

.pay-merchant {
  font-size: 12.5px;
  font-weight: 700;
  color: #334155;
}

.pay-goods-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 12px;
}

.pay-goods-label {
  font-size: 11.5px;
  color: #94a3b8;
  flex-shrink: 0;
}

.pay-goods-value {
  font-size: 11.5px;
  color: #475569;
  text-align: right;
  line-height: 1.45;
}

.pay-amount-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 2px;
}

.pay-amount-label {
  font-size: 12px;
  color: #64748b;
}

.pay-amount {
  font-size: 24px;
  font-weight: 900;
  color: #0f172a;
}

.btn-pay {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 10px;
  padding: 11px;
  border: none;

  &[disabled] {
    opacity: 0.6;
  }
}

.btn-pay-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
}

.pay-cancel {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 12px;
  padding: 4px;
}
</style>

<style>
/* 活动详情富文本样式（rich-text 渲染的节点需要全局样式） */
.act-rich h2 {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  margin: 14px 0 6px;
}
.act-rich p {
  font-size: 12.5px;
  color: #475569;
  line-height: 1.7;
  margin: 4px 0;
}
.act-rich img {
  width: 100%;
  border-radius: 8px;
  margin: 8px 0;
  display: block;
}
</style>
