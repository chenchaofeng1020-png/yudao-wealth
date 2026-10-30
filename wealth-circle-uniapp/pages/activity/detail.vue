<template>
  <view class="act-page">
    <!-- 0. 顶部浮动导航栏 (带滚动渐变与动态标题) -->
    <view class="fixed-nav-bar" :class="{ 'is-scrolled': isScrolled }">
      <view class="nav-safe-inset"></view>
      <view class="nav-content-row">
        <!-- 悬浮返回按钮 -->
        <view class="nav-icon-btn" @tap="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </view>

        <!-- 滚动浮现的中间标题 -->
        <view class="nav-center-title" :style="{ opacity: navTitleOpacity }">
          <text class="nav-title-text ellipsis-1">{{ activity.name || '活动详情' }}</text>
        </view>

        <!-- 右侧分享按钮 -->
        <view class="nav-icon-btn" @tap="handleShareActivity">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </view>
      </view>
    </view>

    <!-- 1. 顶部沉浸式海报（铺满含状态栏） -->
    <view class="poster-wrap">
      <image :src="activity.poster" mode="aspectFill" class="poster-img" />
      <view class="poster-mask"></view>

      <!-- 海报左下角状态徽标 -->
      <view class="poster-floating-badges">
        <view v-if="isEnded" class="poster-glass-badge ended">
          <span class="badge-dot ended-dot"></span>
          <text class="badge-text">本场已结束</text>
        </view>
      </view>
    </view>

    <!-- 2. 内容卡片（向上悬浮覆盖海报底部，案卷级质感） -->
    <view class="content-card">
      <!-- 顶部小拖拽指示条（Apple Sheet 经典视觉细节） -->
      <view class="card-pull-bar"></view>

      <!-- 活动名称与核心信息矩阵 -->
      <view class="sec-basic">
        <text class="act-title">{{ activity.name }}</text>

        <!-- 结构化元数据 Bento 盒子 (无 emoji，纯矢量高质量图标) -->
        <view class="meta-bento-card">
          <!-- 时间 -->
          <view class="bento-row">
            <view class="bento-icon-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </view>
            <view class="bento-text-col">
              <text class="bento-label">活动时间</text>
              <text class="bento-value">{{ activity.startTime }} 至 {{ activity.endTime }}</text>
            </view>
          </view>

          <view class="bento-divider"></view>

          <!-- 地点 -->
          <view class="bento-row">
            <view class="bento-icon-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </view>
            <view class="bento-text-col">
              <text class="bento-label">活动地点</text>
              <text class="bento-value">{{ activity.location }}</text>
            </view>
            <view class="bento-action-chip" @tap="handleCopyLocation">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <text class="action-chip-text">复制</text>
            </view>
          </view>

          <!-- 报名截止提示 (若未结束) -->
          <view v-if="!isEnded" class="bento-divider"></view>
          <view v-if="!isEnded" class="bento-row deadline-row">
            <view class="bento-icon-box alert-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </view>
            <view class="bento-text-col">
              <text class="bento-label alert-label">报名截止</text>
              <text class="bento-value alert-value">{{ activity.signupDeadline }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="sec-divider"></view>

      <!-- 3. 票种选择 (VIP 登机牌式高级卡片) -->
      <view class="sec-block">
        <view class="sec-head">
          <view class="sec-title-with-bar">
            <view class="section-gold-indicator"></view>
            <text class="sec-title">选择参会席位</text>
          </view>
          <text class="sec-tip">每张票需如实填写一份参会人信息</text>
        </view>

        <view class="tickets-container">
          <view
            v-for="t in activity.tickets"
            :key="t.id"
            class="ticket-pass-card"
            :class="{
              selected: selectedTicketId === t.id,
              disabled: isEnded || isSoldOut(t)
            }"
            @tap="selectTicket(t)"
          >
            <!-- 顶部信息行 -->
            <view class="t-pass-header">
              <view class="t-pass-left">
                <!-- 纯矢量单选选择标记 -->
                <view class="t-radio-dot" :class="{ on: selectedTicketId === t.id }">
                  <svg v-if="selectedTicketId === t.id" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </view>

                <view class="t-title-col">
                  <view class="t-name-row">
                    <text class="t-name">{{ t.name }}</text>
                    <view
                      class="t-remain-chip"
                      :class="{
                        warn: remainOf(t) <= 10 && !isSoldOut(t),
                        soldout: isSoldOut(t)
                      }"
                    >
                      <text class="remain-chip-text">
                        {{ isSoldOut(t) ? '席位已满' : remainOf(t) <= 10 ? `仅剩 ${remainOf(t)} 席` : '席位充足' }}
                      </text>
                    </view>
                  </view>
                  <text v-if="t.desc" class="t-desc">{{ t.desc }}</text>
                </view>
              </view>

              <!-- 价格 -->
              <view class="t-pass-price">
                <text class="t-currency">¥</text>
                <text class="t-price-num">{{ t.price }}</text>
                <text class="t-price-unit">/位</text>
              </view>
            </view>

            <!-- 选中后显示的精工步进器 (靠右下排列) -->
            <view v-if="selectedTicketId === t.id && !isEnded" class="t-pass-stepper-row" @tap.stop>
              <view class="stepper-label-group">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <text class="stepper-label">参会人数</text>
              </view>

              <view class="qty-stepper-luxury">
                <view
                  class="stepper-btn"
                  :class="{ disabled: quantity <= 1 }"
                  @tap.stop="changeQuantity(-1)"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </view>
                <text class="stepper-number">{{ quantity }}</text>
                <view
                  class="stepper-btn"
                  :class="{ disabled: quantity >= remainOf(t) }"
                  @tap.stop="changeQuantity(1)"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="sec-divider"></view>

      <!-- 5. 活动详细议程与介绍 -->
      <view class="sec-block">
        <view class="sec-head">
          <view class="sec-title-with-bar">
            <view class="section-gold-indicator"></view>
            <text class="sec-title">活动议程与说明</text>
          </view>
        </view>
        <view class="act-rich">
          <rich-text :nodes="activity.detailHtml"></rich-text>
        </view>
      </view>

      <view class="bottom-space"></view>
    </view>

    <!-- 6. 底部操作栏 (奢华吸底高质感) -->
    <view class="bottom-bar">
      <view class="bottom-bar-left">
        <view class="price-summary-col">
          <text class="price-status-label">{{ isEnded ? '本场已结束' : registered ? '已报名完成' : '需支付总额' }}</text>
          <view class="price-calc-line">
            <text class="price-sum-num">{{ bottomPriceText }}</text>
            <text v-if="!isEnded && !registered && selectedTicket && quantity > 1" class="price-qty-pill">
              共 {{ quantity }} 位
            </text>
          </view>
        </view>
      </view>

      <view class="bottom-bar-right">
        <button
          class="btn-cta-main"
          :class="{
            disabled: isEnded,
            registered: registered
          }"
          @tap="onMainAction"
        >
          <text class="btn-cta-text">{{ mainBtnText }}</text>
          <svg v-if="!isEnded && !registered" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </view>
    </view>

    <!-- ==================== 7. 报名信息填写抽屉 (高定底栏) ==================== -->
    <view v-if="showSignup" class="overlay" @tap="closeSignup">
      <view class="sheet" @tap.stop>
        <!-- 弹窗顶把手 -->
        <view class="sheet-drag-handle"></view>

        <view class="sheet-header">
          <view class="sheet-title-col">
            <text class="sheet-title">填写报名信息</text>
            <text class="sheet-subtitle">实名签到 · 报名信息仅用于现场核验</text>
          </view>
          <view class="sheet-close-btn" @tap="closeSignup">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>

        <scroll-view scroll-y class="sheet-body">
          <!-- 所选票种与数量摘要卡 -->
          <view class="signup-ticket-summary">
            <view class="st-info">
              <text class="st-name">{{ selectedTicket ? selectedTicket.name : '' }}</text>
              <text class="st-price">单价 ¥{{ selectedTicket ? selectedTicket.price : 0 }} / 位</text>
            </view>
            <view class="qty-stepper-luxury">
              <view
                class="stepper-btn"
                :class="{ disabled: quantity <= 1 }"
                @tap.stop="changeQuantity(-1)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </view>
              <text class="stepper-number">{{ quantity }}</text>
              <view
                class="stepper-btn"
                :class="{ disabled: selectedTicket && quantity >= remainOf(selectedTicket) }"
                @tap.stop="changeQuantity(1)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </view>
            </view>
          </view>

          <!-- 动态表单卡片列表 -->
          <view v-for="(item, idx) in formList" :key="idx" class="form-card">
            <view class="form-card-title-row">
              <view class="form-card-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <text class="badge-num">参会人 {{ idx + 1 }}</text>
              </view>
              <text class="form-card-ticket-name">{{ selectedTicket ? selectedTicket.name : '' }}</text>
            </view>

            <view v-for="f in activity.regFields" :key="f.id" class="form-item">
              <view class="f-label-row">
                <text class="f-label">{{ f.label }}</text>
                <text v-if="f.required" class="f-req">*</text>
              </view>

              <input
                v-if="f.type === 'name' || f.type === 'phone' || f.type === 'text'"
                v-model="item.values[f.id]"
                class="f-input"
                :type="f.type === 'phone' ? 'number' : 'text'"
                :maxlength="f.type === 'phone' ? 11 : 50"
                :placeholder="'请输入' + f.label"
                placeholder-class="f-placeholder"
              />

              <textarea
                v-else-if="f.type === 'textarea'"
                v-model="item.values[f.id]"
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
                  :class="{ on: item.values[f.id] === opt }"
                  @tap="item.values[f.id] = opt"
                >
                  <svg v-if="item.values[f.id] === opt" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <text class="opt-text">{{ opt }}</text>
                </view>
              </view>

              <view v-else-if="f.type === 'checkbox'" class="f-options">
                <view
                  v-for="opt in optionsOf(f)"
                  :key="opt"
                  class="opt-item"
                  :class="{ on: (item.values[f.id] || []).includes(opt) }"
                  @tap="toggleCheckbox(item, f, opt)"
                >
                  <svg v-if="(item.values[f.id] || []).includes(opt)" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <text class="opt-text">{{ opt }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>

        <!-- 提交底栏 -->
        <view class="sheet-footer">
          <view class="submit-price-col">
            <text class="sp-label">应付总额</text>
            <view class="sp-calc-row">
              <text class="sp-currency">¥</text>
              <text class="sp-num">{{ totalPrice }}</text>
            </view>
          </view>
          <button class="btn-submit-action" @tap="submitSignup">
            <text class="btn-submit-text">确认并前往支付</text>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </view>
      </view>
    </view>

    <!-- ==================== 8. 尊贵收银台弹窗 (极简 Apple Pay 质感) ==================== -->
    <view v-if="showPay" class="overlay pay-overlay">
      <view class="pay-sheet-luxury">
        <!-- 顶部安全图标 -->
        <view class="pay-secure-emblem">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </view>

        <view class="pay-header">
          <text class="pay-title">订单确认</text>
        </view>

        <!-- 订单详情卡片 -->
        <view class="pay-order-dossier">
          <view class="dossier-row">
            <text class="dossier-label">报名项目</text>
            <text class="dossier-val ellipsis-1">{{ activity.name }}</text>
          </view>
          <view class="dossier-row">
            <text class="dossier-label">席位明细</text>
            <text class="dossier-val">{{ selectedTicket ? selectedTicket.name : '' }} × {{ quantity }} 位</text>
          </view>
        </view>

        <!-- 支付金额大字呈现 -->
        <view class="pay-total-display">
          <text class="pay-total-label">支付金额</text>
          <view class="pay-num-row">
            <text class="pay-currency-mark">¥</text>
            <text class="pay-big-amount">{{ totalPrice }}</text>
          </view>
        </view>

        <!-- 支付方式预览条 -->
        <view class="pay-channel-bar">
          <view class="channel-left">
            <view class="channel-icon-wechat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#07c160">
                <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 2.05 1.13 3.88 2.89 5.07l-.73 2.19a.5.5 0 0 0 .65.62l2.67-1.14c.66.17 1.34.26 2.02.26.24 0 .47-.02.7-.04-.26-.64-.4-1.33-.4-2.06 0-3.31 3.13-6 7-6 .17 0 .33.01.5.02C15.42 5.05 12.28 2 8.5 2zm8.5 7.4c-3.31 0-6 2.24-6 5s2.69 5 6 5c.57 0 1.13-.07 1.66-.21l2.09.89a.4.4 0 0 0 .52-.49l-.58-1.74c1.38-.93 2.31-2.29 2.31-3.85 0-2.76-2.69-5-6-5z"/>
              </svg>
            </view>
            <text class="channel-name">微信支付</text>
          </view>
          <view class="channel-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </view>
        </view>

        <!-- 确认支付按钮 -->
        <button class="btn-confirm-pay" :disabled="paying" @tap="confirmPay">
          <text class="btn-pay-text">{{ paying ? '正在处理安全支付…' : '立即支付 ¥' + totalPrice }}</text>
        </button>

        <view class="pay-cancel-btn" @tap="showPay = false">
          <text class="cancel-text">取消支付</text>
        </view>
      </view>
    </view>

    <!-- ==================== 9. 报名结果抽屉 (查看报名结果 / 按报名人取消) ==================== -->
    <view v-if="showResult" class="overlay" @tap="closeResult">
      <view class="sheet" @tap.stop>
        <view class="sheet-drag-handle"></view>

        <view class="sheet-header">
          <view class="sheet-title-col">
            <text class="sheet-title">报名结果</text>
            <text class="sheet-subtitle">现场凭报名手机号核验签到入场</text>
          </view>
          <view class="sheet-close-btn" @tap="closeResult">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>

        <scroll-view scroll-y class="sheet-body">
          <!-- 订单信息卡 -->
          <view class="result-order-card">
            <view class="ro-row">
              <text class="ro-label">订单编号</text>
              <text class="ro-val">{{ registration.orderId || '-' }}</text>
            </view>
            <view class="ro-row">
              <text class="ro-label">支付时间</text>
              <text class="ro-val">{{ registration.payTime || '-' }}</text>
            </view>
            <view class="ro-row">
              <text class="ro-label">支付总额</text>
              <text class="ro-val ro-strong">¥{{ registration.amount || 0 }}</text>
            </view>
            <view v-if="(registration.refunded || 0) > 0" class="ro-row">
              <text class="ro-label">已退款</text>
              <text class="ro-val ro-refund">¥{{ registration.refunded }}</text>
            </view>
          </view>

          <!-- 报名人列表 -->
          <view
            v-for="(p, idx) in registration.attendees || []"
            :key="idx"
            class="result-person-card"
          >
            <view class="rp-top-row">
              <view class="rp-avatar">{{ (p.name || '').slice(0, 1) }}</view>
              <view class="rp-info">
                <view class="rp-name-row">
                  <text class="rp-name">{{ p.name }}</text>
                  <view class="rp-status" :class="'rp-st-' + p.status">
                    <text class="rp-st-text">{{ attendeeStatusText(p.status) }}</text>
                  </view>
                </view>
                <text class="rp-phone">{{ p.phone }}</text>
              </view>
              <view class="rp-ticket-col">
                <text class="rp-ticket-name">{{ p.ticket }}</text>
                <text class="rp-ticket-price">¥{{ p.price }}</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="sheet-footer result-footer">
          <button class="btn-result-close" @tap="closeResult">
            <text class="btn-result-close-text">关闭</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { activitiesMock, actions } from '../../store/community.js';

const activity = ref({});
const selectedTicketId = ref('');
const quantity = ref(1);
const showSignup = ref(false);
const showPay = ref(false);
const showResult = ref(false);
const paying = ref(false);
const formList = ref([]);
const scrollTop = ref(0);

onPageScroll((e) => {
  scrollTop.value = Math.max(0, e.scrollTop || 0);
});

const isScrolled = computed(() => scrollTop.value > 60);

const navTitleOpacity = computed(() => {
  const p = Math.min(1, Math.max(0, (scrollTop.value - 120) / 60));
  return p.toFixed(2);
});

onLoad((query) => {
  const found = activitiesMock.find((a) => a.id === query.id);
  activity.value = found || activitiesMock[0];
  if (!isEnded.value && activity.value.tickets && activity.value.tickets.length) {
    const firstAvailable = activity.value.tickets.find((t) => !isSoldOut(t));
    if (firstAvailable) {
      selectedTicketId.value = firstAvailable.id;
      resetFormList();
    }
  }
});

const isEnded = computed(() => activity.value.status === 'ended');
const registered = computed(() => !!activity.value.registered);

const selectedTicket = computed(() =>
  (activity.value.tickets || []).find((t) => t.id === selectedTicketId.value)
);

const remainOf = (t) => (t.count || 0) - (t.sold || 0);
const isSoldOut = (t) => remainOf(t) <= 0;

const totalPrice = computed(() =>
  selectedTicket.value ? selectedTicket.value.price * quantity.value : 0
);

const bottomPriceText = computed(() => {
  if (isEnded.value) return minPriceText.value;
  if (registered.value) return '已完成报名';
  return `¥${totalPrice.value}`;
});

const minPriceText = computed(() => {
  const list = activity.value.tickets || [];
  if (!list.length) return '免费';
  const min = Math.min(...list.map((t) => t.price));
  return list.length > 1 ? `¥${min} 起` : `¥${min}`;
});

const mainBtnText = computed(() => {
  if (isEnded.value) return '本场活动已结束';
  if (registered.value) return '已报名成功';
  return '立即报名';
});

const selectTicket = (t) => {
  if (isEnded.value || isSoldOut(t)) return;
  if (selectedTicketId.value === t.id) return;
  selectedTicketId.value = t.id;
  quantity.value = 1;
  resetFormList();
};

const changeQuantity = (delta) => {
  if (!selectedTicket.value) return;
  const max = remainOf(selectedTicket.value);
  const next = quantity.value + delta;
  if (next < 1) {
    uni.showToast({ title: '至少选择 1 位参会名额', icon: 'none' });
    return;
  }
  if (next > max) {
    uni.showToast({ title: `该票种仅余 ${max} 席`, icon: 'none' });
    return;
  }
  quantity.value = next;
  syncFormListLength();
};

const resetFormList = () => {
  formList.value = Array.from({ length: quantity.value }, () => ({ values: {} }));
};

const syncFormListLength = () => {
  const target = quantity.value;
  const cur = formList.value.length;
  if (cur < target) {
    for (let i = 0; i < target - cur; i++) {
      formList.value.push({ values: {} });
    }
  } else if (cur > target) {
    formList.value.splice(target);
  }
};

const optionsOf = (f) =>
  (f.optionsText || '')
    .split(/[,，、]/)
    .map((s) => s.trim())
    .filter(Boolean);

const toggleCheckbox = (item, f, opt) => {
  const arr = item.values[f.id] || [];
  const idx = arr.indexOf(opt);
  if (idx >= 0) arr.splice(idx, 1);
  else arr.push(opt);
  item.values[f.id] = arr;
};

const onMainAction = () => {
  if (isEnded.value) {
    uni.showToast({ title: '本场活动已圆满收官', icon: 'none' });
    return;
  }
  if (registered.value) {
    showResult.value = true;
    return;
  }
  if (!selectedTicket.value) {
    uni.showToast({ title: '请先选择参会席位', icon: 'none' });
    return;
  }
  syncFormListLength();
  showSignup.value = true;
};

// ==================== 报名结果查看 ====================
const registration = computed(() => activity.value.registration || {});

const attendeeStatusText = (s) => {
  if (s === 'cancelled') return '已取消 · 已退款';
  return '报名成功';
};

const closeResult = () => {
  showResult.value = false;
};

const closeSignup = () => {
  showSignup.value = false;
};

const submitSignup = () => {
  if (!selectedTicket.value) {
    uni.showToast({ title: '请先选择席位票种', icon: 'none' });
    return;
  }
  for (let i = 0; i < formList.value.length; i++) {
    const item = formList.value[i];
    for (const f of activity.value.regFields) {
      const val = item.values[f.id];
      const empty = Array.isArray(val) ? val.length === 0 : !val || !String(val).trim();
      if (f.required && empty) {
        uni.showToast({ title: `参会人 ${i + 1} 请填写「${f.label}」`, icon: 'none' });
        return;
      }
      if (f.type === 'phone' && !empty && !/^1[3-9]\d{9}$/.test(String(val))) {
        uni.showToast({ title: `参会人 ${i + 1} 手机号格式不正确`, icon: 'none' });
        return;
      }
      if (f.type === 'radio' && !empty && !optionsOf(f).includes(val)) {
        uni.showToast({ title: `参会人 ${i + 1} 请选择「${f.label}」`, icon: 'none' });
        return;
      }
    }
  }
  showPay.value = true;
};

const confirmPay = () => {
  paying.value = true;
  uni.showLoading({ title: '安全通道处理中…' });
  setTimeout(() => {
    uni.hideLoading();
    paying.value = false;
    showPay.value = false;
    showSignup.value = false;
    activity.value.registered = true;
    const t = selectedTicket.value;
    if (t) t.sold = (t.sold || 0) + quantity.value;
    // 生成本次报名记录，供「报名结果」查看与按报名人取消
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const payTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const valByType = (item, type) => {
      const f = (activity.value.regFields || []).find((x) => x.type === type);
      return f ? String(item.values[f.id] || '') : '';
    };
    activity.value.registration = {
      orderId: payTime.replace(/[- :]/g, '') + String(Math.floor(Math.random() * 9000) + 1000),
      payTime,
      amount: totalPrice.value,
      refunded: 0,
      attendees: formList.value.map((item) => ({
        name: valByType(item, 'name'),
        phone: valByType(item, 'phone'),
        ticket: t ? t.name : '',
        price: t ? t.price : 0,
        status: 'ok'
      }))
    };
    uni.showToast({ title: '席位确认成功', icon: 'success' });
  }, 850);
};

const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 });
  } else {
    uni.navigateTo({ url: '/pages/activity/index' });
  }
};

const handleCopyLocation = () => {
  if (!activity.value.location) return;
  uni.setClipboardData({
    data: activity.value.location,
    success: () => {
      uni.showToast({ title: '活动地点已复制', icon: 'none' });
    }
  });
};

const handleShareActivity = () => {
  uni.showModal({
    title: '邀请星友同行',
    content: `「${activity.value.name}」闭门研讨沙龙邀请卡已生成。\n时间：${activity.value.startTime}\n是否复制专属邀请链接？`,
    confirmText: '复制链接',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.setClipboardData({
          data: `https://wealthplanet.app/activity/${activity.value.id}`,
          success: () => {
            uni.showToast({ title: '邀请链接已复制', icon: 'success' });
          }
        });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.act-page {
  background: #f6f6f6;
  min-height: 100vh;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

/* 0. 顶部浮动导航栏 */
.fixed-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  transition: background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;

  &.is-scrolled {
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 0.5px solid rgba(60, 60, 67, 0.1);
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);

    .nav-icon-btn {
      background: rgba(15, 23, 42, 0.05);
      border-color: transparent;
    }
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

.nav-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 0.5px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.18s ease;

  &:active {
    transform: scale(0.92);
  }
}

.nav-center-title {
  flex: 1;
  text-align: center;
  padding: 0 12px;
  pointer-events: none;
}

.nav-title-text {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
}

/* 1. 沉浸式海报 */
.poster-wrap {
  position: relative;
  width: 100%;
  height: 290px;
  background: #0f172a;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 100%;
  display: block;
}

.poster-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(7, 21, 43, 0.45) 0%,
    rgba(7, 21, 43, 0.1) 40%,
    rgba(7, 21, 43, 0.55) 85%,
    rgba(7, 21, 43, 0.8) 100%
  );
  pointer-events: none;
}

.poster-floating-badges {
  position: absolute;
  bottom: 38px;
  left: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.poster-glass-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 99px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &.ended {
    background: rgba(15, 23, 42, 0.8);
    color: #cbd5e1;
  }
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;

  &.ended-dot {
    background: #94a3b8;
  }
}

/* 2. 内容卡片 */
.content-card {
  position: relative;
  margin-top: -24px;
  background: #ffffff;
  border-radius: 22px 22px 0 0;
  min-height: calc(100vh - 266px);
  padding: 12px 18px 0;
  box-sizing: border-box;
  z-index: 2;
  box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.08);
}

.card-pull-bar {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  margin: 0 auto 16px;
}

.act-title {
  display: block;
  font-size: 21px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.32;
  letter-spacing: -0.35px;
  margin-bottom: 16px;
}

/* 结构化元数据 Bento 盒子 */
.meta-bento-card {
  background: #f6f6f6;
  border: 0.5px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 14px;
}

.bento-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 4px 0;
}

.bento-icon-box {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #ffffff;
  border: 0.5px solid rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.alert-box {
    background: rgba(245, 158, 11, 0.1);
    border-color: rgba(245, 158, 11, 0.2);
  }
}

.bento-text-col {
  flex: 1;
  min-width: 0;
}

.bento-label {
  display: block;
  font-size: 10.5px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 2px;

  &.alert-label {
    color: #b45309;
  }
}

.bento-value {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.45;

  &.alert-value {
    color: #b45309;
  }
}

.bento-divider {
  height: 0.5px;
  background: rgba(60, 60, 67, 0.06);
  margin: 6px 0;
}

.bento-action-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: #ffffff;
  border: 0.5px solid rgba(60, 60, 67, 0.12);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  align-self: center;

  &:active {
    background: #f6f6f6;
  }
}

.action-chip-text {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
}

/* 分隔线 */
.sec-divider {
  height: 0.5px;
  background: rgba(60, 60, 67, 0.08);
  margin: 18px -18px 0;
}

/* 分区通用 */
.sec-block {
  padding-top: 18px;
}

.sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sec-title-with-bar {
  display: flex;
  align-items: center;
  gap: 7px;
}

.section-gold-indicator {
  width: 3.5px;
  height: 15px;
  border-radius: 2px;
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.sec-title {
  font-size: 16.5px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.sec-tip {
  font-size: 11.5px;
  color: #94a3b8;
}

/* 3. 票种卡片 */
.tickets-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ticket-pass-card {
  background: #ffffff;
  border: 1.5px solid rgba(60, 60, 67, 0.1);
  border-radius: 14px;
  padding: 14px;
  box-sizing: border-box;
  transition: all 0.18s ease;
  position: relative;

  &.selected {
    border-color: #0f172a;
    background: #f6f6f6;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
  }

  &.disabled {
    opacity: 0.45;
  }
}

.t-pass-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.t-pass-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.t-radio-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.15s ease;

  &.on {
    background: #0f172a;
    border-color: #0f172a;
  }
}

.t-title-col {
  flex: 1;
  min-width: 0;
}

.t-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.t-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.t-remain-chip {
  background: #ecfdf5;
  border-radius: 99px;
  padding: 2px 7px;

  .remain-chip-text {
    font-size: 10.5px;
    font-weight: 600;
    color: #059669;
  }

  &.warn {
    background: #fef2f2;
    .remain-chip-text {
      color: #dc2626;
    }
  }

  &.soldout {
    background: #f6f6f6;
    .remain-chip-text {
      color: #94a3b8;
    }
  }
}

.t-desc {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-top: 5px;
  line-height: 1.45;
}

.t-pass-price {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
}

.t-currency {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.t-price-num {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
  font-variant-numeric: tabular-nums;
}

.t-price-unit {
  font-size: 11px;
  color: #94a3b8;
  margin-left: 1px;
}

/* 步进器行 */
.t-pass-stepper-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 0.5px solid rgba(60, 60, 67, 0.08);
}

.stepper-label-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stepper-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.qty-stepper-luxury {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 0.5px solid rgba(60, 60, 67, 0.14);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.stepper-btn {
  width: 32px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  background: #f6f6f6;
  cursor: pointer;
  transition: background 0.15s ease;

  &.disabled {
    opacity: 0.35;
    pointer-events: none;
  }

  &:active {
    background: #e2e8f0;
  }
}

.stepper-number {
  min-width: 38px;
  text-align: center;
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  border-left: 0.5px solid rgba(60, 60, 67, 0.08);
  border-right: 0.5px solid rgba(60, 60, 67, 0.08);
  line-height: 30px;
  font-variant-numeric: tabular-nums;
}

/* 5. 富文本 */
.act-rich {
  padding-bottom: 10px;
}

.bottom-space {
  height: 110px;
}

/* 6. 底部固定操作栏 */
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 0.5px solid rgba(60, 60, 67, 0.1);
  padding: 10px 16px calc(10px + constant(safe-area-inset-bottom));
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  z-index: 50;
  box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.04);
}

.bottom-bar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.price-summary-col {
  display: flex;
  flex-direction: column;
}

.price-status-label {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
}

.price-calc-line {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price-sum-num {
  font-size: 21px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.price-qty-pill {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: #f6f6f6;
  border-radius: 99px;
  padding: 1px 7px;
}

.bottom-bar-right {
  display: flex;
  align-items: center;
}

.btn-cta-main {
  background: #10b981;
  border-radius: 99px;
  padding: 11px 26px;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  transition: transform 0.15s ease, background 0.15s ease;

  &:active {
    transform: scale(0.96);
    background: #059669;
  }

  &.registered {
    background: #10b981;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  }

  &.disabled {
    background: #cbd5e1;
    box-shadow: none;
    pointer-events: none;
  }
}

.btn-cta-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

/* 7. 弹层通用 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.sheet {
  background: #ffffff;
  border-radius: 22px 22px 0 0;
  max-height: 84vh;
  display: flex;
  flex-direction: column;
  animation: sheetSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.sheet-drag-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  margin: 10px auto 4px;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px 12px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.08);
  flex-shrink: 0;
}

.sheet-title-col {
  display: flex;
  flex-direction: column;
}

.sheet-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.sheet-subtitle {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.sheet-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    background: #e2e8f0;
  }
}

.sheet-body {
  flex: 1;
  padding: 14px 18px;
  box-sizing: border-box;
  max-height: 58vh;
}

.signup-ticket-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f6f6f6;
  border: 0.5px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 14px;
}

.st-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.st-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
}

.st-price {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 500;
}

.form-card {
  background: #ffffff;
  border: 0.5px solid rgba(15, 23, 42, 0.1);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);

  &:last-child {
    margin-bottom: 0;
  }
}

.form-card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.06);
}

.form-card-badge {
  display: flex;
  align-items: center;
  gap: 5px;
}

.badge-num {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

.form-card-ticket-name {
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
}

.form-item {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.f-label-row {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 6px;
}

.f-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
}

.f-req {
  font-size: 12px;
  color: #dc2626;
  font-weight: 700;
}

.f-input {
  width: 100%;
  box-sizing: border-box;
  height: 42px;
  background: #f6f6f6;
  border: 0.5px solid rgba(60, 60, 67, 0.12);
  border-radius: 9px;
  padding: 0 12px;
  font-size: 14px;
  color: #0f172a;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #0f172a;
    background: #ffffff;
  }
}

.f-textarea {
  width: 100%;
  box-sizing: border-box;
  background: #f6f6f6;
  border: 0.5px solid rgba(60, 60, 67, 0.12);
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 13px;
  color: #0f172a;
  height: 72px;

  &:focus {
    border-color: #0f172a;
    background: #ffffff;
  }
}

.f-placeholder {
  color: #94a3b8;
  font-size: 13px;
}

.f-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.opt-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0.5px solid rgba(60, 60, 67, 0.14);
  border-radius: 99px;
  padding: 6px 14px;
  background: #f6f6f6;
  transition: all 0.15s ease;

  &.on {
    border-color: #0f172a;
    background: #0f172a;

    .opt-text {
      color: #ffffff;
      font-weight: 600;
    }

    svg {
      stroke: #ffffff;
    }
  }
}

.opt-text {
  font-size: 12px;
  color: #475569;
}

.sheet-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px calc(12px + constant(safe-area-inset-bottom));
  padding: 12px 18px calc(12px + env(safe-area-inset-bottom));
  border-top: 0.5px solid rgba(60, 60, 67, 0.08);
  flex-shrink: 0;
  background: #ffffff;
}

.submit-price-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sp-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.sp-calc-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.sp-currency {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.sp-num {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.4px;
  font-variant-numeric: tabular-nums;
}

.btn-submit-action {
  background: #0f172a;
  border-radius: 99px;
  padding: 11px 26px;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);

  &:active {
    background: #1e293b;
    transform: scale(0.97);
  }
}

.btn-submit-text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}

/* 8. 收银台弹窗 */
.pay-overlay {
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.pay-sheet-luxury {
  width: 100%;
  max-width: 330px;
  background: #ffffff;
  border-radius: 20px;
  padding: 22px 20px 18px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: dialogScale 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.pay-secure-emblem {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ecfdf5;
  border: 1px solid rgba(16, 185, 129, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.pay-header {
  text-align: center;
  margin-bottom: 14px;
}

.pay-title {
  display: block;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}

.pay-subtitle {
  display: block;
  font-size: 11.5px;
  color: #64748b;
  margin-top: 2px;
}

.pay-order-dossier {
  width: 100%;
  background: #f6f6f6;
  border: 0.5px solid rgba(15, 23, 42, 0.06);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 14px;
}

.dossier-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 2px 0;
}

.dossier-label {
  font-size: 11.5px;
  color: #64748b;
  flex-shrink: 0;
}

.dossier-val {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  text-align: right;
}

.pay-total-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.pay-total-label {
  font-size: 11.5px;
  color: #64748b;
  margin-bottom: 4px;
}

.pay-num-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.pay-currency-mark {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.pay-big-amount {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.pay-channel-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.04);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 18px;
}

.channel-left {
  display: flex;
  align-items: center;
  gap: 7px;
}

.channel-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.btn-confirm-pay {
  width: 100%;
  background: #0f172a;
  border-radius: 99px;
  padding: 12px;
  border: none;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);

  &:active {
    background: #1e293b;
    transform: scale(0.98);
  }

  &[disabled] {
    opacity: 0.6;
    pointer-events: none;
  }
}

.btn-pay-text {
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 700;
}

.pay-cancel-btn {
  margin-top: 12px;
  padding: 4px 10px;
  cursor: pointer;

  &:active {
    opacity: 0.6;
  }
}

.cancel-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

/* ==================== 9. 报名结果抽屉 ==================== */
.result-order-card {
  background: #f6f6f6;
  border: 0.5px solid rgba(60, 60, 67, 0.06);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.ro-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.ro-label {
  font-size: 12px;
  color: #64748b;
}

.ro-val {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

.ro-strong {
  font-size: 13.5px;
  font-weight: 800;
}

.ro-refund {
  color: #10b981;
}

.result-person-card {
  background: #ffffff;
  border: 0.5px solid rgba(60, 60, 67, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
}

.rp-top-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rp-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rp-info {
  flex: 1;
  min-width: 0;
}

.rp-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.rp-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

.rp-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  padding: 1px 6px;

  &.rp-st-ok {
    background: rgba(16, 185, 129, 0.1);

    .rp-st-text {
      color: #059669;
    }
  }

  &.rp-st-cancelled {
    background: rgba(100, 116, 139, 0.12);

    .rp-st-text {
      color: #64748b;
    }
  }
}

.rp-st-text {
  font-size: 10.5px;
  font-weight: 600;
}

.rp-phone {
  font-size: 11.5px;
  color: #64748b;
}

.rp-ticket-col {
  text-align: right;
  flex-shrink: 0;
}

.rp-ticket-name {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1px;
}

.rp-ticket-price {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.result-footer {
  justify-content: center;
}

.btn-result-close {
  width: 100%;
  height: 42px;
  border-radius: 8px;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    opacity: 0.7;
  }
}

.btn-result-close-text {
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
}

@keyframes sheetSlideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes dialogScale {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<style>
/* 活动详情富文本样式 (高精微排版) */
.act-rich h2 {
  font-size: 15.5px;
  font-weight: 800;
  color: #0f172a;
  margin: 20px 0 10px;
  letter-spacing: -0.2px;
  position: relative;
  padding-left: 10px;
}
.act-rich h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 3px;
  border-radius: 1.5px;
  background: #f59e0b;
}
.act-rich p {
  font-size: 13.5px;
  color: #334155;
  line-height: 1.8;
  margin: 8px 0;
}
.act-rich img {
  width: 100%;
  border-radius: 12px;
  margin: 12px 0;
  display: block;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
}
</style>
