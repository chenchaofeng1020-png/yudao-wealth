<template>
  <view class="share-modal-backdrop" @tap.self="close">
    <view class="share-modal-sheet animate-slide-up" @tap.stop>
      <!-- 头部：标题与关闭按钮 -->
      <view class="share-sheet-head">
        <text class="sheet-main-title">分享这条动态</text>
        <view class="btn-sheet-close" @tap="close" aria-label="关闭">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.4" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </view>
      </view>

      <!-- 主体：动态分享海报（长按保存 / 点击预览） -->
      <view class="share-poster-section">
        <view class="poster-frame-box">
          <image
            v-if="posterDataUrl"
            :src="posterDataUrl"
            class="poster-render-img"
            mode="widthFix"
            :show-menu-by-longpress="true"
            @longpress="previewPoster"
            @tap="previewPoster"
          />
          <view v-else class="poster-fallback-card">
            <image src="/static/brand_logo.jpg" class="fallback-logo-img" mode="aspectFit" />
            <text class="loading-txt">分享海报生成中...</text>
          </view>
        </view>

        <view class="poster-tip-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <text class="poster-tip-text">长按海报可直接保存至手机相册</text>
        </view>
      </view>

      <!-- 底部：分享文案 + 链接，一键复制 -->
      <view class="share-link-footer">
        <view class="copy-card">
          <text class="copy-preview">{{ shareText }}</text>
          <button class="btn-copy-action" :class="{ 'is-copied': isCopied }" @tap="handleCopyShare">
            <svg v-if="!isCopied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <text class="btn-copy-txt">{{ isCopied ? '已复制 ✓' : '复制文案与链接' }}</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const posterDataUrl = ref('');
const isCopied = ref(false);

// 分享文案 + 帖子直达链接，复制时一并写入剪贴板
const postLink = computed(() => `https://wealthplanet.app/#/pages/feed/detail?id=${props.post.id}`);
const shareText = computed(() => {
  const p = props.post;
  const title = p.title || (p.content || '').split('\n')[0] || '值得一看的投研动态';
  return `${p.author.name}：${title}\n${postLink.value}`;
});

const close = () => emit('close');

const previewPoster = () => {
  if (posterDataUrl.value) {
    uni.previewImage({ urls: [posterDataUrl.value], current: posterDataUrl.value });
  }
};

const handleCopyShare = () => {
  uni.setClipboardData({
    data: shareText.value,
    showToast: false,
    success: () => {
      isCopied.value = true;
      uni.showToast({ title: '文案与链接已复制', icon: 'success' });
      setTimeout(() => {
        isCopied.value = false;
      }, 2500);
    },
    fail: () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(shareText.value).then(() => {
          isCopied.value = true;
          uni.showToast({ title: '文案与链接已复制', icon: 'success' });
          setTimeout(() => {
            isCopied.value = false;
          }, 2500);
        });
      }
    }
  });
};

// Canvas 文本自动换行
const wrapText = (ctx, text, maxWidth) => {
  const lines = [];
  let line = '';
  for (const ch of text) {
    if (line && ctx.measureText(line + ch).width > maxWidth) {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return lines;
};

// 正文摘要：去除 Markdown 标记与链接，取首个非空段落
const buildExcerpt = () => {
  const raw = (props.post.content || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/https?:\/\/\S+/g, '');
  const firstPara = raw.split(/\n+/).map(s => s.trim()).filter(Boolean)[0] || '';
  return firstPara.length > 88 ? firstPara.slice(0, 88) + '…' : firstPara;
};

// 预加载 Logo 后绘制动态分享海报（2x Retina 600x860）
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
      canvas.width = 600;
      canvas.height = 860;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. 典雅暖象牙白底色 + 双金箔装饰细线
      ctx.fillStyle = '#fbf5e7';
      ctx.fillRect(0, 0, 600, 860);
      ctx.strokeStyle = '#cda869';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(22, 22, 556, 816);
      ctx.strokeStyle = '#e1c38c';
      ctx.lineWidth = 1;
      ctx.strokeRect(28, 28, 544, 804);

      // 2. 品牌官方 Logo
      let logoH = 96;
      const logoW = 200;
      if (logoImg.width && logoImg.height) {
        logoH = Math.min(Math.round(logoImg.height * (logoW / logoImg.width)), 110);
        ctx.drawImage(logoImg, (600 - logoW) / 2, 46, logoW, logoH);
      } else {
        ctx.fillStyle = '#926b2b';
        ctx.font = 'bold 30px "Songti SC", serif';
        ctx.textAlign = 'center';
        ctx.fillText('财 不 外 露', 300, 100);
        logoH = 70;
      }

      // 3. 金饰分割线
      const yDiv = 46 + logoH + 12;
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

      // 4. 作者署名
      const yAuthor = yDiv + 36;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#8c6937';
      ctx.font = 'bold 15px "PingFang SC", sans-serif';
      ctx.fillText(`${props.post.author.name} · ${props.post.author.roleTitle || '星友'}`, 62, yAuthor);

      // 5. 标题（最多 3 行）
      let rawTitle = props.post.title || '';
      if (rawTitle.length > 40) rawTitle = rawTitle.slice(0, 40) + '…';
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 25px "PingFang SC", "Microsoft YaHei", sans-serif';
      const titleLines = wrapText(ctx, rawTitle, 476).slice(0, 3);
      let yTitle = yAuthor + 44;
      titleLines.forEach((ln) => {
        ctx.fillText(ln, 62, yTitle);
        yTitle += 38;
      });

      // 6. 正文摘要（最多 3 行）
      const excerpt = buildExcerpt();
      let yExcerpt = yTitle + 8;
      if (excerpt) {
        ctx.fillStyle = '#64748b';
        ctx.font = '15px "PingFang SC", sans-serif';
        const exLines = wrapText(ctx, excerpt, 476).slice(0, 3);
        exLines.forEach((ln) => {
          ctx.fillText(ln, 62, yExcerpt);
          yExcerpt += 26;
        });
      }

      // 7. 二维码容器（中心嵌官方徽标）
      const yQr = 620;
      const qrSize = 146;
      const qrX = (600 - qrSize) / 2;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 8, yQr - 8, qrSize + 16, qrSize + 16);
      ctx.strokeStyle = '#e1c89b';
      ctx.lineWidth = 1;
      ctx.strokeRect(qrX - 8, yQr - 8, qrSize + 16, qrSize + 16);

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

      if (logoIcon.width && logoIcon.height) {
        const iconSize = 32;
        ctx.drawImage(logoIcon, 300 - iconSize / 2, yQr + qrSize / 2 - iconSize / 2, iconSize, iconSize);
      }

      // 8. 底部说明
      ctx.textAlign = 'center';
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 15px "PingFang SC", sans-serif';
      ctx.fillText('长按识别二维码 · 阅读全文', 300, yQr + qrSize + 28);

      ctx.fillStyle = '#8c6937';
      ctx.font = '13px "PingFang SC", sans-serif';
      ctx.fillText('财不外露 · 专注于全球买方深度投研', 300, yQr + qrSize + 50);

      posterDataUrl.value = canvas.toDataURL('image/png');
    } catch (e) {
      console.error('分享海报绘制异常:', e);
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

onMounted(() => {
  generatePoster();
});
</script>

<style lang="scss" scoped>
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
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

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
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:active {
    opacity: 0.7;
  }
}

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
  -webkit-touch-callout: default;
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

.share-link-footer {
  padding: 12px 20px 24px 20px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.06);
  background: #f6f6f6;
}

.copy-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 10px 10px 14px;
}

.copy-preview {
  flex: 1;
  min-width: 0;
  font-size: 12.5px;
  color: #1e293b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
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
