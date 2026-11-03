<template>
  <view v-if="appState.isShareModalVisible" class="share-modal-backdrop" @tap.self="close">
    <view class="share-modal-sheet animate-slide-up" @tap.stop>
      <!-- 顶部拖拽装饰把手 -->
      <view class="share-sheet-drag-handle"></view>

      <!-- 头部：白色背景、深色极简标题与关闭按钮 -->
      <view class="share-sheet-head">
        <text class="sheet-main-title">分享</text>
        <view class="btn-sheet-close" @tap="close" aria-label="关闭">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.6" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </view>
      </view>

      <!-- 风格切换：经典白卡 vs 暖橙礼券（对齐知识星球海报双形态） -->
      <view class="theme-switch-container">
        <view class="theme-switch-bar">
          <view 
            class="theme-tab-item" 
            :class="{ 'is-active': activeTheme === 'white' }"
            @tap="switchTheme('white')"
          >
            <view class="theme-color-dot dot-white"></view>
            <text class="theme-tab-text">经典白卡</text>
          </view>
          <view 
            class="theme-tab-item" 
            :class="{ 'is-active': activeTheme === 'card' }"
            @tap="switchTheme('card')"
          >
            <view class="theme-color-dot dot-card"></view>
            <text class="theme-tab-text">典雅礼券</text>
          </view>
        </view>
      </view>

      <!-- 海报展示区：淡灰底衬托出纯白海报卡片 -->
      <view class="share-poster-section">
        <!-- 风格一：知识星球经典白卡 (图1 参考) -->
        <view 
          v-if="activeTheme === 'white'"
          class="poster-zsxq-white" 
          @tap="openPreviewModal"
        >
          <!-- 上半部分：星球信息与核心数据 -->
          <view class="zsxq-card-top">
            <!-- 头部：左侧星球名与星主，右侧星球圆角图标 -->
            <view class="zsxq-header-row">
              <view class="zsxq-title-col">
                <text class="zsxq-planet-name">财不外露</text>
                <text class="zsxq-owner-name">星主：{{ ownerName }}</text>
              </view>
              <image src="/static/brand_logo.jpg" class="zsxq-planet-icon" mode="aspectFit" />
            </view>

            <!-- 介绍文案 -->
            <view class="zsxq-desc-box">
              <text class="zsxq-desc-text">这里是专注全球资产配置与买方投研实践的成长基地，由一群深耕资管多年的老伙计打造。我们不堆概念，只给做法，把全球资产配置做成可执行清单...</text>
            </view>

            <!-- 发丝细分割线 -->
            <view class="zsxq-divider"></view>

            <!-- 三列核心指标数据 -->
            <view class="zsxq-metrics-row">
              <view class="metric-item">
                <text class="metric-num">1600+</text>
                <text class="metric-label">成员数量</text>
              </view>
              <view class="metric-item">
                <text class="metric-num">2300+</text>
                <text class="metric-label">内容数量</text>
              </view>
              <view class="metric-item">
                <text class="metric-num">550+</text>
                <text class="metric-label">运营天数</text>
              </view>
            </view>
          </view>

          <!-- 下半部分：邀请人与真实二维码 -->
          <view class="zsxq-card-bottom">
            <view class="zsxq-inviter-col">
              <image :src="userAvatarUrl" class="zsxq-avatar" mode="aspectFill" />
              <text class="zsxq-inviter-name">{{ inviterName }}</text>
              <text class="zsxq-invite-hint">邀你到星球一起学习</text>
            </view>
            <view class="zsxq-qr-col">
              <view class="zsxq-qr-box">
                <view v-if="qrSvgContent" class="zsxq-qr-svg" v-html="qrSvgContent"></view>
              </view>
              <text class="zsxq-qr-label">微信扫一扫</text>
            </view>
          </view>
        </view>

        <!-- 风格二：知识星球典雅礼券 (图2 参考) -->
        <view 
          v-else
          class="poster-zsxq-ticket" 
          @tap="openPreviewModal"
        >
          <!-- 顶部暖红拱形底纹与邀请人头像徽章 -->
          <view class="ticket-header-arch">
            <view class="ticket-avatar-wrap">
              <image :src="userAvatarUrl" class="ticket-avatar" mode="aspectFill" />
              <view class="ticket-name-tag">{{ inviterName }}</view>
            </view>
            <text class="ticket-arch-text">我加入了这个星球，邀你一起学习</text>
          </view>

          <!-- 礼券主体卡片 -->
          <view class="ticket-body">
            <!-- 星球基本信息 -->
            <view class="ticket-info-row">
              <image src="/static/brand_logo.jpg" class="ticket-logo" mode="aspectFit" />
              <view class="ticket-meta">
                <text class="ticket-title">财不外露</text>
                <text class="ticket-owner">星主：{{ ownerName }}</text>
              </view>
            </view>

            <!-- 三大指标 -->
            <view class="ticket-stats-grid">
              <view class="tstat-col">
                <text class="tstat-num">1600+</text>
                <text class="tstat-label">成员数量</text>
              </view>
              <view class="tstat-divider"></view>
              <view class="tstat-col">
                <text class="tstat-num">2300+</text>
                <text class="tstat-label">内容数量</text>
              </view>
              <view class="tstat-divider"></view>
              <view class="tstat-col">
                <text class="tstat-num">559</text>
                <text class="tstat-label">运营天数</text>
              </view>
            </view>

            <!-- 介绍文案 -->
            <text class="ticket-desc-text">这里是专注全球资产配置与家庭理财实践的成长基地，由一群深耕资管多年的老伙计打造。我们不堆概念，只给做法，把全球资产配置做成可执行清单，把认知变收益...</text>

            <!-- 票券虚线齿孔分割 -->
            <view class="ticket-perforated-line">
              <view class="punch-hole hole-left"></view>
              <view class="dashed-line"></view>
              <view class="punch-hole hole-right"></view>
            </view>

            <!-- 底部价格/扫码区 -->
            <view class="ticket-footer-row">
              <view class="ticket-price-col">
                <view class="price-line">
                  <text class="price-label">现价：</text>
                  <text class="price-val">¥499</text>
                </view>
                <text class="price-sub">微信扫码加入星球</text>
              </view>
              <view class="ticket-qr-col">
                <view v-if="qrSvgContent" class="ticket-qr-svg" v-html="qrSvgContent"></view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部纯净操作栏：左侧复制链接，右侧主按钮保存海报 -->
      <view class="share-actions-footer">
        <button class="btn-action-secondary" :class="{ 'is-copied': isCopied }" @tap="handleCopyLink">
          <svg v-if="!isCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <text v-if="!isCopied" class="btn-secondary-text">复制链接</text>
          <text v-else class="btn-secondary-text">已复制 ✓</text>
        </button>

        <button class="btn-action-primary" @tap="openPreviewModal">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <text class="btn-primary-text">保存海报</text>
        </button>
      </view>
    </view>

    <!-- 全屏超清大图查看器 -->
    <view v-if="isPreviewOpen" class="fullscreen-preview-mask" @tap.self="closePreviewModal">
      <view class="preview-container animate-fade-in" @tap.stop>
        <view class="preview-top-toolbar">
          <text class="preview-title-hint">长按或点击下方保存至相册</text>
          <view class="btn-preview-close" @tap="closePreviewModal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </view>
        </view>

        <view class="preview-image-box">
          <image 
            v-if="highResPosterUrl" 
            :src="highResPosterUrl" 
            class="high-res-poster-img" 
            mode="widthFix"
            :show-menu-by-longpress="true"
          />
          <view v-else class="preview-loading-card">
            <text class="preview-loading-txt">高清海报渲染中...</text>
          </view>
        </view>

        <view class="preview-bottom-actions">
          <button class="btn-download-highres" @tap="handleDownloadImage">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <text class="btn-download-text">保存至手机相册</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { appState, actions } from '../store/community.js';
import QRCode from '../common/qrcode.esm.js';

// 注册直达链接
const registerUrl = 'https://wealthplanet.app/#/pages/auth/index?mode=register';

// 当前海报风格：'white' (知识星球经典白卡) | 'card' (典雅礼券)
const activeTheme = ref('white');

const qrSvgContent = ref('');
const highResPosterUrl = ref('');
const isCopied = ref(false);
const isPreviewOpen = ref(false);

const inviterName = computed(() => {
  return appState.user?.name || 'Abb';
});

const ownerName = computed(() => {
  return 'Rich';
});

const userAvatarUrl = computed(() => {
  return appState.user?.avatar || '/static/avatar_user_hd.jpg';
});

const close = () => {
  actions.closeShareModal();
};

const switchTheme = (theme) => {
  if (activeTheme.value === theme) return;
  activeTheme.value = theme;
  generateHighResPoster();
};

// 生成真实纯矢量二维码
const generateRealQrSvg = async () => {
  try {
    const svgStr = await QRCode.toString(registerUrl, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
    qrSvgContent.value = svgStr;
  } catch (err) {
    console.error('二维码生成异常:', err);
  }
};

const handleCopyLink = () => {
  uni.setClipboardData({
    data: registerUrl,
    showToast: false,
    success: () => {
      isCopied.value = true;
      uni.showToast({ title: '邀请链接已复制', icon: 'success' });
      setTimeout(() => {
        isCopied.value = false;
      }, 2500);
    },
    fail: () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(registerUrl).then(() => {
          isCopied.value = true;
          uni.showToast({ title: '邀请链接已复制', icon: 'success' });
          setTimeout(() => {
            isCopied.value = false;
          }, 2500);
        });
      }
    }
  });
};

const openPreviewModal = () => {
  if (!highResPosterUrl.value) {
    generateHighResPoster(() => {
      triggerPreview();
    });
  } else {
    triggerPreview();
  }
};

const triggerPreview = () => {
  if (highResPosterUrl.value) {
    uni.previewImage({
      urls: [highResPosterUrl.value],
      current: highResPosterUrl.value
    });
  }
  isPreviewOpen.value = true;
};

const closePreviewModal = () => {
  isPreviewOpen.value = false;
};

const handleDownloadImage = () => {
  if (!highResPosterUrl.value) return;

  // #ifdef H5
  if (typeof document !== 'undefined') {
    const a = document.createElement('a');
    a.href = highResPosterUrl.value;
    a.download = `财不外露星球邀请函-${inviterName.value}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    uni.showToast({ title: '已开始保存', icon: 'success' });
    return;
  }
  // #endif

  // #ifndef H5
  uni.saveImageToPhotosAlbum({
    filePath: highResPosterUrl.value,
    success: () => {
      uni.showToast({ title: '已保存至相册', icon: 'success' });
    },
    fail: () => {
      uni.previewImage({
        urls: [highResPosterUrl.value],
        current: highResPosterUrl.value
      });
    }
  });
  // #endif
};

// ==========================================
// 离屏渲染对齐知识星球原图的 3x 超清大图（800 x 1280）
// ==========================================
const generateHighResPoster = (onDone) => {
  if (typeof document === 'undefined') {
    if (onDone) onDone();
    return;
  }

  const logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  logoImg.src = '/static/brand_logo.jpg';

  const avatarImg = new Image();
  avatarImg.crossOrigin = 'anonymous';
  avatarImg.src = userAvatarUrl.value;

  const renderCanvas = () => {
    try {
      const W = 800;
      const H = 1280;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isWhite = activeTheme.value === 'white';

      if (isWhite) {
        // --- 风格一：知识星球经典白卡 ---
        // 1. 底衬：浅灰白自然色
        ctx.fillStyle = '#f4f6f5';
        ctx.fillRect(0, 0, W, H);

        // 2. 居中大白色卡片
        const cardX = 40;
        const cardY = 48;
        const cardW = W - 80;
        const cardH = H - 96;
        const cardR = 32;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
        ctx.fill();

        // 3. 星球名称与星主
        ctx.textAlign = 'left';
        ctx.fillStyle = '#1e2329';
        ctx.font = 'bold 44px "PingFang SC", sans-serif';
        ctx.fillText('财不外露', cardX + 48, cardY + 92);

        ctx.fillStyle = '#64748b';
        ctx.font = '500 24px "PingFang SC", sans-serif';
        ctx.fillText(`星主：${ownerName.value}`, cardX + 48, cardY + 144);

        // 4. 右上角 App 图标
        const iconSize = 110;
        const iconX = cardX + cardW - 48 - iconSize;
        const iconY = cardY + 52;
        if (logoImg.complete && logoImg.naturalWidth) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(iconX, iconY, iconSize, iconSize, 22);
          ctx.clip();
          ctx.drawImage(logoImg, iconX, iconY, iconSize, iconSize);
          ctx.restore();

          ctx.strokeStyle = '#f1e6cf';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(iconX, iconY, iconSize, iconSize, 22);
          ctx.stroke();
        }

        // 5. 介绍文案（自动折行）
        ctx.fillStyle = '#475569';
        ctx.font = '24px "PingFang SC", sans-serif';
        const descText = '这里是专注全球资产配置与家庭理财实践的成长基地，由一群深耕资管多年的老伙计打造。我们不堆概念，只给做法，把全球资产配置做成可执行清单，把认知变收益...';
        
        const maxWidth = cardW - 96;
        let line = '';
        let curY = cardY + 220;
        for (let i = 0; i < descText.length; i++) {
          const testLine = line + descText[i];
          if (ctx.measureText(testLine).width > maxWidth && i > 0) {
            ctx.fillText(line, cardX + 48, curY);
            line = descText[i];
            curY += 40;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, cardX + 48, curY);

        // 6. 分割发丝线
        const divY = curY + 54;
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cardX + 48, divY);
        ctx.lineTo(cardX + cardW - 48, divY);
        ctx.stroke();

        // 7. 三项核心数据
        const statY = divY + 68;
        const colW = (cardW - 96) / 3;
        const stats = [
          { num: '1600+', label: '成员数量' },
          { num: '2300+', label: '内容数量' },
          { num: '550+', label: '运营天数' }
        ];

        stats.forEach((st, idx) => {
          const cx = cardX + 48 + colW * idx + colW / 2;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 38px "PingFang SC", "Helvetica Neue", sans-serif';
          ctx.fillText(st.num, cx, statY);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '500 22px "PingFang SC", sans-serif';
          ctx.fillText(st.label, cx, statY + 42);
        });

        // 8. 底部微灰色背景托底（对齐知识星球下半部分）
        const bottomBoxY = cardY + cardH - 240;
        ctx.fillStyle = '#fafbfc';
        ctx.beginPath();
        ctx.roundRect(cardX, bottomBoxY, cardW, 240, [0, 0, cardR, cardR]);
        ctx.fill();

        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cardX, bottomBoxY);
        ctx.lineTo(cardX + cardW, bottomBoxY);
        ctx.stroke();

        // 9. 邀请人头像与名字
        const avSize = 68;
        const avX = cardX + 48;
        const avY = bottomBoxY + 44;
        if (avatarImg.complete && avatarImg.naturalWidth) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(avatarImg, avX, avY, avSize, avSize);
          ctx.restore();
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 28px "PingFang SC", sans-serif';
        ctx.fillText(inviterName.value, avX, avY + avSize + 40);

        ctx.fillStyle = '#64748b';
        ctx.font = '500 22px "PingFang SC", sans-serif';
        ctx.fillText('邀你到知识星球一起学习', avX, avY + avSize + 80);

        // 10. 二维码绘制
        const qrSize = 138;
        const qrX = cardX + cardW - 48 - qrSize;
        const qrY = bottomBoxY + 36;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);

        try {
          const qr = QRCode.create(registerUrl, { errorCorrectionLevel: 'M' });
          const modCount = qr.modules.size;
          const cellSize = qrSize / modCount;

          ctx.fillStyle = '#1e293b';
          for (let r = 0; r < modCount; r++) {
            for (let c = 0; c < modCount; c++) {
              if (qr.modules.get(r, c)) {
                ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize + 0.3, cellSize + 0.3);
              }
            }
          }
        } catch (e) {
          console.error(e);
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 18px "PingFang SC", sans-serif';
        ctx.fillText('微信扫一扫', qrX + qrSize / 2, qrY + qrSize + 32);

      } else {
        // --- 风格二：知识星球典雅礼券 ---
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, W, H);

        const cardX = 40;
        const cardY = 40;
        const cardW = W - 80;
        const cardH = H - 80;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 24);
        ctx.fill();

        // 顶部暖红拱门
        ctx.fillStyle = '#f26248';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, 160, [24, 24, 0, 0]);
        ctx.fill();

        // 头像
        const avSize = 72;
        const avX = W / 2 - avSize / 2;
        const avY = cardY + 28;
        if (avatarImg.complete && avatarImg.naturalWidth) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(avX + avSize / 2, avY + avSize / 2, avSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(avatarImg, avX, avY, avSize, avSize);
          ctx.restore();
        }

        // 头像下名字胶囊
        ctx.fillStyle = '#ffdfa8';
        const nw = ctx.measureText(inviterName.value).width + 30;
        ctx.beginPath();
        ctx.roundRect(W / 2 - nw / 2, avY + avSize + 6, nw, 28, 14);
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#7a4212';
        ctx.font = 'bold 18px "PingFang SC", sans-serif';
        ctx.fillText(inviterName.value, W / 2, avY + avSize + 26);

        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 26px "PingFang SC", sans-serif';
        ctx.fillText('我加入了这个星球，邀你一起学习', W / 2, cardY + 220);

        // Logo + 财不外露
        const logoSize = 90;
        const logoX = cardX + 48;
        const logoY = cardY + 280;
        if (logoImg.complete && logoImg.naturalWidth) {
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = '#1e2329';
        ctx.font = 'bold 36px "PingFang SC", sans-serif';
        ctx.fillText('财不外露', logoX + logoSize + 24, logoY + 44);

        ctx.fillStyle = '#64748b';
        ctx.font = '500 22px "PingFang SC", sans-serif';
        ctx.fillText(`星主：${ownerName.value}`, logoX + logoSize + 24, logoY + 84);

        // 三项数据
        const statY = logoY + logoSize + 64;
        const colW = (cardW - 96) / 3;
        [
          { num: '1600+', label: '成员数量' },
          { num: '2300+', label: '内容数量' },
          { num: '559', label: '运营天数' }
        ].forEach((st, idx) => {
          const cx = cardX + 48 + colW * idx + colW / 2;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 34px "PingFang SC", sans-serif';
          ctx.fillText(st.num, cx, statY);

          ctx.fillStyle = '#94a3b8';
          ctx.font = '500 20px "PingFang SC", sans-serif';
          ctx.fillText(st.label, cx, statY + 38);
        });

        // 介绍
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.font = '22px "PingFang SC", sans-serif';
        ctx.fillText('这里是专注全球资产配置与家庭理财实践的成长基地，由一群深耕资管多年的老伙计打造。', cardX + 48, statY + 110);
        ctx.fillText('我们不堆概念，只给做法，把全球资产配置做成可执行清单，把认知变收益...', cardX + 48, statY + 146);

        // 底部二维码与价格
        const bottomY = cardY + cardH - 210;
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 22px "PingFang SC", sans-serif';
        ctx.fillText('现价：', cardX + 48, bottomY + 54);

        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 36px "Helvetica Neue", sans-serif';
        ctx.fillText('¥499', cardX + 116, bottomY + 54);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '500 18px "PingFang SC", sans-serif';
        ctx.fillText('微信扫码加入星球', cardX + 48, bottomY + 98);

        // 二维码
        const qrSize = 130;
        const qrX = cardX + cardW - 48 - qrSize;
        const qrY = bottomY + 10;
        try {
          const qr = QRCode.create(registerUrl, { errorCorrectionLevel: 'M' });
          const modCount = qr.modules.size;
          const cellSize = qrSize / modCount;

          ctx.fillStyle = '#1e293b';
          for (let r = 0; r < modCount; r++) {
            for (let c = 0; c < modCount; c++) {
              if (qr.modules.get(r, c)) {
                ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize + 0.3, cellSize + 0.3);
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      highResPosterUrl.value = canvas.toDataURL('image/png');
      if (onDone) onDone();
    } catch (e) {
      console.error('海报 Canvas 绘制异常:', e);
      if (onDone) onDone();
    }
  };

  if (logoImg.complete && avatarImg.complete) {
    renderCanvas();
  } else {
    let count = 0;
    const check = () => {
      count += 1;
      if (count >= 2) renderCanvas();
    };
    logoImg.onload = check;
    avatarImg.onload = check;
    logoImg.onerror = renderCanvas;
    avatarImg.onerror = renderCanvas;
  }
};

watch(
  () => appState.isShareModalVisible,
  (val) => {
    if (val) {
      isCopied.value = false;
      generateRealQrSvg();
      setTimeout(generateHighResPoster, 80);
    } else {
      isPreviewOpen.value = false;
    }
  }
);

onMounted(() => {
  if (appState.isShareModalVisible) {
    generateRealQrSvg();
    generateHighResPoster();
  }
});
</script>

<style lang="scss" scoped>
/* ================= 1. 纯白抽屉面板与遮罩 ================= */
.share-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.share-modal-sheet {
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.16);
}

.animate-slide-up {
  animation: sheetSlideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes sheetSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.share-sheet-drag-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  margin: 10px auto 4px auto;
}

/* 头部：纯白底、深色字、轻盈关闭圆钮 */
.share-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 4px 20px;
}

.sheet-main-title {
  font-size: 16.5px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.2px;
}

.btn-sheet-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:active {
    background: #e2e8f0;
    transform: scale(0.92);
  }
}

/* 风格切换条 */
.theme-switch-container {
  display: flex;
  justify-content: center;
  padding: 4px 20px 8px 20px;
}

.theme-switch-bar {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 3px;
  gap: 4px;
}

.theme-tab-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.is-active {
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

    .theme-tab-text {
      color: #0f172a;
      font-weight: 700;
    }
  }
}

.theme-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.dot-white {
    background: #ffffff;
    border: 1px solid #cbd5e1;
  }

  &.dot-card {
    background: #f26248;
  }
}

.theme-tab-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

/* ================= 2. 海报展示区 ================= */
.share-poster-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 16px 12px 16px;
}

/* 经典白卡：紧凑自然排版，消除断层大片空白（1:1 对齐知识星球原图） */
.poster-zsxq-white {
  width: 100%;
  max-width: 300px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.985);
  }
}

.zsxq-card-top {
  padding: 18px 18px 12px 18px;
  background: #ffffff;
}

.zsxq-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}

.zsxq-title-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.zsxq-planet-name {
  font-size: 20px;
  font-weight: 800;
  color: #1e2329;
  letter-spacing: 0.3px;
}

.zsxq-owner-name {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.zsxq-planet-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.zsxq-desc-box {
  margin-bottom: 12px;
}

.zsxq-desc-text {
  font-size: 11.5px;
  line-height: 1.55;
  color: #475569;
  text-align: justify;
}

.zsxq-divider {
  height: 1px;
  background: #f1f5f9;
  margin-bottom: 12px;
}

.zsxq-metrics-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.metric-num {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.metric-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
}

/* 下半部分紧凑衔接，无多余大空白 */
.zsxq-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px 14px 18px;
  background: #fafbfc;
  border-top: 1px solid #f1f5f9;
}

.zsxq-inviter-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.zsxq-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-bottom: 1px;
}

.zsxq-inviter-name {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.zsxq-invite-hint {
  font-size: 10px;
  color: #64748b;
}

.zsxq-qr-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.zsxq-qr-box {
  width: 66px;
  height: 66px;
  background: #ffffff;
  padding: 2px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.zsxq-qr-svg {
  width: 100%;
  height: 100%;

  :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.zsxq-qr-label {
  font-size: 9px;
  color: #94a3b8;
  font-weight: 500;
}

/* ================= 风格二：知识星球典雅礼券 (图2 参考) ================= */
.poster-zsxq-ticket {
  width: 100%;
  max-width: 300px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.985);
  }
}

.ticket-header-arch {
  background: #f26248;
  padding: 14px 14px 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ticket-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.ticket-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.ticket-name-tag {
  background: #ffdfa8;
  color: #7a4212;
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 8px;
  margin-top: -5px;
  z-index: 2;
}

.ticket-arch-text {
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  margin-top: 1px;
}

.ticket-body {
  padding: 12px 16px 14px 16px;
}

.ticket-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.ticket-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.ticket-title {
  font-size: 15.5px;
  font-weight: 800;
  color: #1e2329;
}

.ticket-owner {
  font-size: 11px;
  color: #64748b;
}

.ticket-stats-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafbfc;
  padding: 6px 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.tstat-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  flex: 1;
}

.tstat-num {
  font-size: 13.5px;
  font-weight: 800;
  color: #0f172a;
}

.tstat-label {
  font-size: 9px;
  color: #94a3b8;
}

.tstat-divider {
  width: 1px;
  height: 18px;
  background: #e2e8f0;
}

.ticket-desc-text {
  font-size: 10.5px;
  color: #64748b;
  line-height: 1.5;
  display: block;
  margin-bottom: 10px;
}

.ticket-perforated-line {
  position: relative;
  height: 12px;
  display: flex;
  align-items: center;
  margin: 0 -16px 8px -16px;
}

.dashed-line {
  flex: 1;
  border-top: 1px dashed #cbd5e1;
}

.punch-hole {
  width: 10px;
  height: 12px;
  background: #f1f5f9;

  &.hole-left {
    border-radius: 0 6px 6px 0;
  }

  &.hole-right {
    border-radius: 6px 0 0 6px;
  }
}

.ticket-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ticket-price-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-line {
  display: flex;
  align-items: baseline;
}

.price-label {
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
}

.price-val {
  font-size: 17px;
  font-weight: 800;
  color: #ea580c;
}

.price-sub {
  font-size: 9px;
  color: #94a3b8;
}

.ticket-qr-svg {
  width: 58px;
  height: 58px;

  :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.ticket-header-arch {
  background: #f26248;
  padding: 16px 14px 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.ticket-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.ticket-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.ticket-name-tag {
  background: #ffdfa8;
  color: #7a4212;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 8px;
  margin-top: -6px;
  z-index: 2;
}

.ticket-arch-text {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  margin-top: 2px;
}

.ticket-body {
  padding: 14px 16px 16px 16px;
}

.ticket-info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.ticket-logo {
  width: 42px;
  height: 42px;
  border-radius: 10px;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ticket-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e2329;
}

.ticket-owner {
  font-size: 11.5px;
  color: #64748b;
}

.ticket-stats-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafbfc;
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.tstat-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.tstat-num {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.tstat-label {
  font-size: 9.5px;
  color: #94a3b8;
}

.tstat-divider {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
}

.ticket-desc-text {
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
  display: block;
  margin-bottom: 12px;
}

.ticket-perforated-line {
  position: relative;
  height: 14px;
  display: flex;
  align-items: center;
  margin: 0 -16px 10px -16px;
}

.dashed-line {
  flex: 1;
  border-top: 1px dashed #cbd5e1;
}

.punch-hole {
  width: 10px;
  height: 14px;
  background: #f1f5f9;

  &.hole-left {
    border-radius: 0 7px 7px 0;
  }

  &.hole-right {
    border-radius: 7px 0 0 7px;
  }
}

.ticket-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ticket-price-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.price-line {
  display: flex;
  align-items: baseline;
}

.price-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
}

.price-val {
  font-size: 18px;
  font-weight: 800;
  color: #ea580c;
}

.price-sub {
  font-size: 9.5px;
  color: #94a3b8;
}

.ticket-qr-svg {
  width: 62px;
  height: 62px;

  :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
}

/* ================= 3. 底部纯净行动操作栏 (无链接展示) ================= */
.share-actions-footer {
  flex-shrink: 0;
  padding: 10px 16px calc(14px + constant(safe-area-inset-bottom)) 16px;
  padding: 10px 16px calc(14px + env(safe-area-inset-bottom)) 16px;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

/* 保存海报主按钮：主题绿高质感渐变 */
.btn-action-primary {
  flex: 1;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.32);
  transition: all 0.2s ease;
  min-width: 0;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.btn-primary-text {
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
}

/* 复制链接次按钮：浅绿底衬、主题绿边框与文字 */
.btn-action-secondary {
  flex: 1;
  height: 44px;
  border-radius: 12px;
  background: #f0fdf4;
  border: 1px solid rgba(16, 185, 129, 0.28);
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 0;

  &:active {
    background: #dcfce7;
  }

  &.is-copied {
    background: #059669;
    border-color: #059669;
    color: #ffffff;
  }
}

.btn-secondary-text {
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
}

/* ================= 4. 全屏超清大图预览 ================= */
.fullscreen-preview-mask {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(3, 7, 18, 0.92);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.animate-fade-in {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.preview-container {
  width: 100%;
  max-width: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.preview-top-toolbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-title-hint {
  font-size: 12px;
  color: #cbd5e1;
  font-weight: 500;
}

.btn-preview-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    background: rgba(255, 255, 255, 0.25);
  }
}

.preview-image-box {
  width: 100%;
  max-height: 72vh;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.high-res-poster-img {
  width: 100%;
  height: auto;
  display: block;
  user-select: auto;
  -webkit-touch-callout: default;
}

.preview-loading-card {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-loading-txt {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.preview-bottom-actions {
  width: 100%;
}

.btn-download-highres {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);

  &:active {
    transform: scale(0.985);
    opacity: 0.9;
  }
}

.btn-download-text {
  font-size: 14px;
  font-weight: 700;
}
</style>
