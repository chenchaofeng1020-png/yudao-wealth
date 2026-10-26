<template>
  <view v-if="appState.isShareModalVisible" class="share-modal-backdrop" @tap.self="close">
    <view class="share-modal-sheet animate-slide-up" @tap.stop>
      <!-- 头部：极简标题与关闭按钮 -->
      <view class="share-sheet-head">
        <text class="sheet-main-title">分享星球邀请函</text>
        <view class="btn-sheet-close" @tap="close" aria-label="关闭">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.4" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </view>
      </view>

      <!-- 主体：居中展示设计感邀请函海报 -->
      <view class="share-poster-section">
        <view class="poster-frame-box">
          <!-- 生成的真实高清海报图片（长按原生保存到相册） -->
          <image 
            v-if="posterDataUrl" 
            :src="posterDataUrl" 
            class="poster-render-img" 
            mode="widthFix" 
            :show-menu-by-longpress="true"
            @longpress="handleLongPressSave"
            @tap="previewPoster"
          />
          <!-- 生成中的占位卡片 -->
          <view v-else class="poster-fallback-card">
            <image src="/static/brand_logo.jpg" class="fallback-logo-img" mode="aspectFit" />
            <text class="loading-txt">邀请海报生成中...</text>
          </view>
        </view>

        <!-- 长按保存提示 -->
        <view class="poster-tip-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <text class="poster-tip-text">长按海报可直接保存至手机相册</text>
        </view>
      </view>

      <!-- 底部：注册链接展示与一键复制 -->
      <view class="share-link-footer">
        <view class="link-bar-container">
          <view class="link-url-col">
            <text class="link-label">注册直达链接</text>
            <text class="link-text">{{ registerUrl }}</text>
          </view>
          <button class="btn-copy-action" :class="{ 'is-copied': isCopied }" @tap="handleCopyLink">
            <svg v-if="!isCopied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <text v-if="!isCopied" class="btn-copy-txt">复制链接</text>
            <text v-else class="btn-copy-txt">已复制 ✓</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { appState, actions } from '../store/community.js';

// 扫码或点击链接直达移动端注册页面，彻底去除邀请码概念
const registerUrl = 'https://wealthplanet.app/#/pages/auth/index?mode=register';

const posterDataUrl = ref('');
const isCopied = ref(false);

const close = () => {
  actions.closeShareModal();
};

// 复制注册链接
const handleCopyLink = () => {
  uni.setClipboardData({
    data: registerUrl,
    showToast: false,
    success: () => {
      isCopied.value = true;
      uni.showToast({ title: '注册链接已复制', icon: 'success' });
      setTimeout(() => {
        isCopied.value = false;
      }, 2500);
    },
    fail: () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(registerUrl).then(() => {
          isCopied.value = true;
          uni.showToast({ title: '注册链接已复制', icon: 'success' });
          setTimeout(() => {
            isCopied.value = false;
          }, 2500);
        });
      }
    }
  });
};

// 长按或点击预览海报
const handleLongPressSave = () => {
  if (posterDataUrl.value) {
    uni.previewImage({
      urls: [posterDataUrl.value],
      current: posterDataUrl.value
    });
  }
};

const previewPoster = () => {
  if (posterDataUrl.value) {
    uni.previewImage({
      urls: [posterDataUrl.value],
      current: posterDataUrl.value
    });
  }
};

// 预加载 Logo 并绘制高设计感典雅纸质邀请函海报
const generatePoster = () => {
  if (typeof document === 'undefined') return;

  const logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  logoImg.src = '/static/brand_logo.jpg';

  const logoIcon = new Image();
  logoIcon.crossOrigin = 'anonymous';
  logoIcon.src = '/static/logo_icon.png';

  const renderOnCanvas = () => {
    try {
      const canvas = document.createElement('canvas');
      // 2x Retina 分辨率 (600 x 860)，在手机端极其清晰
      canvas.width = 600;
      canvas.height = 860;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. 典雅暖象牙白底色 (精确契合品牌 Logo 背景 #fbf5e7)
      ctx.fillStyle = '#fbf5e7';
      ctx.fillRect(0, 0, 600, 860);

      // 2. 双金箔装饰细线与四角花饰 (藏书票/私享函风格)
      ctx.strokeStyle = '#cda869';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(22, 22, 556, 816);

      ctx.strokeStyle = '#e1c38c';
      ctx.lineWidth = 1;
      ctx.strokeRect(28, 28, 544, 804);

      // 四角微小十字标
      const drawCornerCross = (cx, cy) => {
        ctx.strokeStyle = '#b99150';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy);
        ctx.lineTo(cx + 5, cy);
        ctx.moveTo(cx, cy - 5);
        ctx.lineTo(cx, cy + 5);
        ctx.stroke();
      };
      drawCornerCross(25, 25);
      drawCornerCross(575, 25);
      drawCornerCross(25, 835);
      drawCornerCross(575, 835);

      // 3. 绘制品牌官方 Logo (居中放置，带 财不外露 / Fortune in Reserve)
      let logoH = 210;
      if (logoImg.width && logoImg.height) {
        const logoW = 220;
        logoH = Math.round(logoImg.height * (logoW / logoImg.width));
        ctx.drawImage(logoImg, (600 - logoW) / 2, 40, logoW, logoH);
      } else {
        // 兜底文字 Logo
        ctx.fillStyle = '#926b2b';
        ctx.font = 'bold 32px "Songti SC", serif';
        ctx.textAlign = 'center';
        ctx.fillText('财 不 外 露', 300, 100);
        ctx.font = '16px sans-serif';
        ctx.fillText('FORTUNE IN RESERVE', 300, 130);
      }

      // 4. 典雅金饰分割细线
      const yDiv = 40 + logoH + 10;
      ctx.strokeStyle = '#d7b987';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(210, yDiv);
      ctx.lineTo(390, yDiv);
      ctx.stroke();

      ctx.fillStyle = '#b99150';
      ctx.beginPath();
      ctx.arc(300, yDiv, 3, 0, Math.PI * 2);
      ctx.fill();

      // 5. 编排理念文案（人文雅致，坚决无 AI 亮星堆砌）
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 21px "Songti SC", "PingFang SC", "Microsoft YaHei", serif';
      ctx.fillText('在周期中沉淀理性 · 在噪声中把握信号', 300, yDiv + 34);

      ctx.fillStyle = '#8c6937';
      ctx.font = '15px "PingFang SC", sans-serif';
      ctx.fillText('全球宏观对冲 · 深度买方研报 · 产业实盘跟踪', 300, yDiv + 68);

      // 6. 邀请人署名饰带
      const yInv = yDiv + 102;
      ctx.fillStyle = '#f5eedc';
      ctx.fillRect(150, yInv, 300, 42);
      ctx.strokeStyle = '#e1c89b';
      ctx.lineWidth = 1;
      ctx.strokeRect(150, yInv, 300, 42);

      const inviterName = appState.user.name || '老林说宏观';
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16.5px "PingFang SC", sans-serif';
      ctx.fillText(`${inviterName} · 诚邀共同研学`, 300, yInv + 26);

      // 7. 二维码容器（直通注册页，中心嵌官方六边形徽标）
      const yQr = yInv + 68;
      const qrSize = 146;
      const qrX = (600 - qrSize) / 2;

      // 二维码白底托盘
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 8, yQr - 8, qrSize + 16, qrSize + 16);
      ctx.strokeStyle = '#e1c89b';
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX - 8, yQr - 8, qrSize + 16, qrSize + 16);

      // 绘制标准定位角
      ctx.fillStyle = '#1e293b';
      const drawFinder = (fx, fy) => {
        ctx.fillRect(fx, fy, 36, 36);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(fx + 6, fy + 6, 24, 24);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(fx + 11, fy + 11, 14, 14);
      };
      drawFinder(qrX + 6, yQr + 6);
      drawFinder(qrX + qrSize - 42, yQr + 6);
      drawFinder(qrX + 6, yQr + qrSize - 42);

      // 绘制点阵数据像素
      const dataBits = [
        [14, 50, 8, 8], [28, 50, 14, 8], [48, 50, 8, 8], [62, 50, 14, 8], [82, 50, 8, 8], [96, 50, 14, 8], [116, 50, 18, 8],
        [14, 64, 18, 8], [38, 64, 8, 8], [52, 64, 8, 14], [66, 64, 14, 8], [86, 64, 18, 8], [110, 64, 24, 8],
        [14, 78, 12, 8], [32, 78, 14, 8], [72, 78, 8, 14], [86, 78, 14, 8], [106, 78, 18, 8], [130, 78, 8, 8],
        [50, 98, 8, 14], [64, 98, 18, 8], [88, 98, 10, 8], [104, 98, 14, 8], [124, 98, 14, 8],
        [50, 118, 14, 8], [70, 118, 8, 8], [84, 118, 18, 8], [108, 118, 10, 14], [124, 118, 14, 8],
        [50, 132, 8, 8], [64, 132, 14, 8], [84, 132, 8, 8], [98, 132, 18, 8], [122, 132, 16, 8]
      ];
      ctx.fillStyle = '#1e293b';
      dataBits.forEach(([bx, by, bw, bh]) => {
        ctx.fillRect(qrX + bx, yQr + by, bw, bh);
      });

      // 二维码中心金色 Logo 徽标
      if (logoIcon.width && logoIcon.height) {
        const iconSize = 32;
        ctx.drawImage(logoIcon, 300 - iconSize / 2, yQr + qrSize / 2 - iconSize / 2, iconSize, iconSize);
      } else {
        ctx.fillStyle = '#d97706';
        ctx.fillRect(285, yQr + qrSize / 2 - 15, 30, 30);
      }

      // 8. 扫码说明（直接注册加入，彻底无邀请码）
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 15px "PingFang SC", sans-serif';
      ctx.fillText('长按识别二维码 · 直达移动端注册', 300, yQr + qrSize + 28);

      ctx.fillStyle = '#8c6937';
      ctx.font = '13px "PingFang SC", sans-serif';
      ctx.fillText('财不外露 · 专注于全球买方深度投研', 300, yQr + qrSize + 50);

      // 导出为 PNG Data URL
      posterDataUrl.value = canvas.toDataURL('image/png');
    } catch (e) {
      console.error('海报绘制异常:', e);
    }
  };

  if (logoImg.complete && logoIcon.complete) {
    renderOnCanvas();
  } else {
    let loaded = 0;
    const checkDone = () => {
      loaded += 1;
      if (loaded >= 2) renderOnCanvas();
    };
    logoImg.onload = checkDone;
    logoIcon.onload = checkDone;
    logoImg.onerror = renderOnCanvas;
    logoIcon.onerror = renderOnCanvas;
  }
};

watch(
  () => appState.isShareModalVisible,
  (val) => {
    if (val) {
      isCopied.value = false;
      setTimeout(generatePoster, 60);
    }
  }
);

onMounted(() => {
  if (appState.isShareModalVisible) {
    generatePoster();
  }
});
</script>

<style lang="scss" scoped>
/* 遮罩背景 */
.share-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* 抽屉面板 */
.share-modal-sheet {
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 36px rgba(0, 0, 0, 0.28);
}

.animate-slide-up {
  animation: sheetSlideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes sheetSlideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 头部 */
.share-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 8px 20px;
}

.sheet-main-title {
  font-size: 16.5px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.2px;
}

.btn-sheet-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.7;
  }
}

/* ================= 1. 海报主展区 ================= */
.share-poster-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 24px 14px 24px;
}

.poster-frame-box {
  width: 272px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.22);
  background: #fbf5e7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-render-img {
  width: 100%;
  height: auto;
  display: block;
  user-select: auto;
  -webkit-touch-callout: default; // 允许移动端长按弹出系统保存图片菜单
}

.poster-fallback-card {
  width: 100%;
  height: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.fallback-logo-img {
  width: 140px;
  height: 140px;
}

.loading-txt {
  font-size: 13px;
  color: #8c6937;
  font-weight: 500;
}

.poster-tip-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}

.poster-tip-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

/* ================= 2. 底部链接与复制行 ================= */
.share-link-footer {
  padding: 10px 20px 24px 20px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.06);
  background: #f8fafc;
}

.link-bar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 8px 8px 14px;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.link-url-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.link-label {
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.2px;
}

.link-text {
  font-size: 12.5px;
  color: #1e293b;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-copy-action {
  height: 38px;
  padding: 0 14px;
  border-radius: 8px;
  background: #0f172a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:active {
    opacity: 0.85;
  }

  &.is-copied {
    background: #059669;
    color: #ffffff;
  }
}

.btn-copy-txt {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
</style>