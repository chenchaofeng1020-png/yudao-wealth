<template>
  <view v-if="isVisible" class="share-modal-backdrop" @tap.self="close">
    <view class="share-modal-sheet animate-slide-up" @tap.stop>
      <!-- 顶部拖拽装饰把手 -->
      <view class="share-sheet-drag-handle"></view>

      <!-- 头部：标题与关闭按钮 -->
      <view class="share-sheet-head">
        <text class="sheet-main-title">分享专栏</text>
        <view class="btn-sheet-close" @tap="close" aria-label="关闭">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.6" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </view>
      </view>

      <!-- 风格切换：黑曜夜间 vs 经典纯白 -->
      <view class="theme-switch-container">
        <view class="theme-switch-bar">
          <view 
            class="theme-tab-item" 
            :class="{ 'is-active': activeTheme === 'dark' }"
            @tap="switchTheme('dark')"
          >
            <view class="theme-color-dot dot-dark"></view>
            <text class="theme-tab-text">黑曜夜间</text>
          </view>
          <view 
            class="theme-tab-item" 
            :class="{ 'is-active': activeTheme === 'light' }"
            @tap="switchTheme('light')"
          >
            <view class="theme-color-dot dot-light"></view>
            <text class="theme-tab-text">经典纯白</text>
          </view>
        </view>
      </view>

      <!-- 海报展示区：纯前端 DOM 高保真渲染，点击查看大图 -->
      <view class="share-poster-section">
        <!-- 风格一：黑曜夜间质感卡片 -->
        <view 
          v-if="activeTheme === 'dark'"
          class="poster-post-dark"
          @tap="openPreviewModal"
        >
          <!-- 作者信息行 -->
          <view class="dark-author-wrap">
            <image :src="colAuthorAvatar" class="dark-author-avatar" mode="aspectFill" />
            <text class="dark-author-name">{{ colAuthor }} 的专栏</text>
            <view class="dark-author-bio-line">
              <text class="dark-bio-text">{{ colAuthorBio }}</text>
            </view>
            <text class="dark-publish-time">{{ colMetaTag }}</text>
          </view>

          <!-- 专栏标题与章节大纲预览（渐隐截断） -->
          <view class="dark-body-wrap">
            <text class="dark-post-title">{{ colTitle }}</text>
            <view class="dark-excerpt-box">
              <view v-for="(ch, idx) in previewChapters" :key="ch.id" class="chapter-preview-row">
                <text class="chapter-idx-num">0{{ idx + 1 }}.</text>
                <text class="chapter-preview-title">{{ ch.title }}</text>
              </view>
              <view class="dark-fade-gradient"></view>
            </view>
            <!-- 扫码解锁完整专栏胶囊 -->
            <view class="dark-read-more-pill">
              <text class="dark-pill-text">—— 扫码解锁完整专栏 ——</text>
            </view>
          </view>

          <!-- 底部品牌与真实二维码 -->
          <view class="dark-footer-row">
            <view class="dark-brand-col">
              <view class="dark-brand-header">
                <image src="/static/logo_icon_transparent.png" class="dark-brand-logo" mode="aspectFit" />
                <text class="dark-brand-text">财不外露</text>
              </view>
              <text class="dark-brand-sub">微信扫码订阅专栏</text>
            </view>
            <view class="dark-qr-col">
              <view class="dark-qr-box">
                <view v-if="qrSvgContent" class="dark-qr-svg" v-html="qrSvgContent"></view>
              </view>
            </view>
          </view>
        </view>

        <!-- 风格二：经典纯白卡片 -->
        <view 
          v-else
          class="poster-post-light"
          @tap="openPreviewModal"
        >
          <!-- 顶部淡灰邀请人微条 -->
          <view class="light-top-strip">
            <image :src="userAvatarUrl" class="light-inviter-avatar" mode="aspectFill" />
            <text class="light-inviter-text">{{ inviterName }} 邀请你研读</text>
          </view>

          <!-- 卡片主体内容 -->
          <view class="light-card-body">
            <!-- 作者信息 -->
            <view class="light-author-header">
              <text class="light-author-name">{{ colAuthor }} 的专栏</text>
              <text class="light-author-sub">来自 财不外露 · {{ colCategoryName }}</text>
            </view>

            <!-- 发丝细分割线 -->
            <view class="light-hairline"></view>

            <!-- 专栏标题与章节大纲 -->
            <text class="light-post-title">{{ colTitle }}</text>
            <view class="light-excerpt-box">
              <view v-for="(ch, idx) in previewChapters" :key="ch.id" class="chapter-preview-row">
                <text class="chapter-idx-num is-light">0{{ idx + 1 }}.</text>
                <text class="chapter-preview-title is-light">{{ ch.title }}</text>
              </view>
              <view class="light-fade-gradient"></view>
            </view>

            <!-- 扫码解锁完整专栏胶囊 -->
            <view class="light-read-more-pill">
              <text class="light-pill-text">—— 扫码解锁完整专栏 ——</text>
            </view>

            <!-- 底部品牌与真实二维码 -->
            <view class="light-footer-row">
              <view class="light-brand-col">
                <view class="light-brand-header">
                  <image src="/static/logo_icon_transparent.png" class="light-brand-logo" mode="aspectFit" />
                  <text class="light-brand-text">财不外露</text>
                </view>
                <text class="light-brand-sub">微信扫码订阅专栏</text>
              </view>
              <view class="light-qr-col">
                <view class="light-qr-box">
                  <view v-if="qrSvgContent" class="light-qr-svg" v-html="qrSvgContent"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部纯净操作栏：左侧复制链接，右侧主按钮保存海报（主题绿） -->
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

const props = defineProps({
  column: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

// 当前激活主题：'dark' (黑曜夜间) | 'light' (经典纯白)
const activeTheme = ref('dark');

const qrSvgContent = ref('');
const highResPosterUrl = ref('');
const isCopied = ref(false);
const isPreviewOpen = ref(false);

const targetColumn = computed(() => {
  return props.column || appState.sharingColumn || appState.columns[0] || null;
});

const isVisible = computed(() => {
  return !!props.column || appState.isColumnShareModalVisible;
});

const colAuthor = computed(() => {
  return targetColumn.value?.author || 'Rich';
});

const colAuthorAvatar = computed(() => {
  return targetColumn.value?.authorAvatar || '/static/avatar_rich.png';
});

const colAuthorBio = computed(() => {
  const col = targetColumn.value;
  if (!col) return '专注全球资产配置与买方投研实践';
  const member = (appState.members || []).find(m => m.name === colAuthor.value);
  if (member && member.bio) {
    return member.bio;
  }
  if (col.authorTitle) {
    return `${col.authorTitle} · 财不外露专栏主笔`;
  }
  return '全球对冲基金宏观配置分析师，专注大类资产定价模型与实盘风控。';
});

const colTitle = computed(() => {
  return targetColumn.value?.title || '「美股指标」解析';
});

const colSubtitle = computed(() => {
  return targetColumn.value?.subtitle || '穿透宏观大盘、市场广度与流动性定价底层指标';
});

const colCategoryName = computed(() => {
  return targetColumn.value?.categoryName || '宏观美股';
});

const chapterList = computed(() => {
  return targetColumn.value?.chapters || [];
});

const previewChapters = computed(() => {
  const list = chapterList.value;
  if (!list || !list.length) {
    return [
      { id: '1', title: '【价格反馈】趋势、量价与风险定价核心逻辑' },
      { id: '2', title: '【广度指标】腾落线与新高新低比率的背离预警' },
      { id: '3', title: '【流动性锚】联邦基金利率与美债贴现曲线' }
    ];
  }
  return list.slice(0, 3);
});

const colMetaTag = computed(() => {
  const count = chapterList.value.length || targetColumn.value?.chapterCount || 7;
  const status = targetColumn.value?.statusText || '更新中';
  return `${colCategoryName.value} · 共 ${count} 篇 · ${status}`;
});

const inviterName = computed(() => {
  return appState.user?.name || 'Abb';
});

const userAvatarUrl = computed(() => {
  return appState.user?.avatar || '/static/avatar_user_hd.jpg';
});

const colLink = computed(() => {
  const id = targetColumn.value?.id || 'col-us-stock';
  return `https://wealthplanet.app/#/pages/column/index?colId=${id}`;
});

const shareCopyText = computed(() => {
  return `${colAuthor.value}的专栏：${colTitle.value}\n${colSubtitle.value}\n${colLink.value}`;
});

const close = () => {
  emit('close');
  actions.closeColumnShareModal();
};

const switchTheme = (theme) => {
  if (activeTheme.value === theme) return;
  activeTheme.value = theme;
  generateRealQrSvg();
  setTimeout(generateHighResPoster, 50);
};

const generateRealQrSvg = async () => {
  try {
    const isDark = activeTheme.value === 'dark';
    const svgStr = await QRCode.toString(colLink.value, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: isDark ? '#111827' : '#0f172a',
        light: '#ffffff'
      }
    });
    qrSvgContent.value = svgStr;
  } catch (e) {
    console.error('二维码渲染失败:', e);
  }
};

const handleCopyLink = () => {
  uni.setClipboardData({
    data: shareCopyText.value,
    showToast: false,
    success: () => {
      isCopied.value = true;
      uni.showToast({ title: '专栏链接已复制', icon: 'success' });
      setTimeout(() => {
        isCopied.value = false;
      }, 2500);
    },
    fail: () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(shareCopyText.value).then(() => {
          isCopied.value = true;
          uni.showToast({ title: '专栏链接已复制', icon: 'success' });
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
      isPreviewOpen.value = true;
    });
    return;
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
    a.download = `财不外露专栏分享-${colTitle.value.slice(0, 10)}.png`;
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

// Canvas 自动折行绘制辅助函数
const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 100) => {
  let line = '';
  let curY = y;
  let linesCount = 0;
  for (let i = 0; i < text.length; i++) {
    const testLine = line + text[i];
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      linesCount++;
      if (linesCount >= maxLines) {
        ctx.fillText(line.slice(0, -1) + '…', x, curY);
        return curY;
      }
      ctx.fillText(line, x, curY);
      line = text[i];
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, curY);
  }
  return curY;
};

// ==========================================
// 离屏渲染对齐原图的 3x 超清大图（750 x 1180）
// ==========================================
const generateHighResPoster = (onDone) => {
  if (typeof document === 'undefined') {
    if (onDone) onDone();
    return;
  }

  const logoImg = new Image();
  logoImg.crossOrigin = 'anonymous';
  logoImg.src = '/static/logo_icon_transparent.png';

  const avatarImg = new Image();
  avatarImg.crossOrigin = 'anonymous';
  avatarImg.src = activeTheme.value === 'dark' ? colAuthorAvatar.value : userAvatarUrl.value;

  const renderCanvas = () => {
    try {
      const W = 750;
      const H = 1180;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isDark = activeTheme.value === 'dark';

      if (isDark) {
        // --- 风格一：黑曜夜间卡片 ---
        ctx.fillStyle = '#1e2022';
        ctx.fillRect(0, 0, W, H);

        const padX = 52;
        let curY = 64;

        // 作者头像
        const avatarSize = 92;
        if (avatarImg.complete && avatarImg.naturalWidth) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(padX + avatarSize / 2, curY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(avatarImg, padX, curY, avatarSize, avatarSize);
          ctx.restore();
        } else {
          ctx.fillStyle = '#2e333d';
          ctx.beginPath();
          ctx.arc(padX + avatarSize / 2, curY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // 作者标题
        curY += avatarSize + 32;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "PingFang SC", sans-serif';
        ctx.fillText(`${colAuthor.value} 的专栏`, padX, curY);

        // 竖条 + 签名介绍
        curY += 24;
        const barX = padX;
        const textX = padX + 16;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '24px "PingFang SC", sans-serif';

        const bioStartY = curY + 20;
        const bioEndY = drawWrappedText(ctx, colAuthorBio.value, textX, bioStartY, W - textX - padX, 36, 2);

        ctx.strokeStyle = '#52525b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(barX, curY + 4);
        ctx.lineTo(barX, bioEndY + 6);
        ctx.stroke();

        // 专栏元数据标签
        curY = bioEndY + 36;
        ctx.fillStyle = '#71717a';
        ctx.font = '500 22px "PingFang SC", sans-serif';
        ctx.fillText(colMetaTag.value, padX, curY);

        // 专栏大标题
        curY += 56;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px "PingFang SC", sans-serif';
        const titleEndY = drawWrappedText(ctx, colTitle.value, padX, curY, W - padX * 2, 48, 2);

        // 篇章列表大纲 (3篇)
        curY = titleEndY + 36;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '24px "PingFang SC", sans-serif';
        previewChapters.value.forEach((ch, i) => {
          const itemText = `0${i + 1}. ${ch.title}`;
          drawWrappedText(ctx, itemText, padX, curY, W - padX * 2, 38, 1);
          curY += 38;
        });

        // 引导胶囊
        const pillY = curY + 40;
        const pillW = 440;
        const pillH = 64;
        const pillX = (W - pillW) / 2;

        ctx.fillStyle = '#262930';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 12);
        ctx.fill();

        ctx.strokeStyle = '#383d47';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 22px "PingFang SC", sans-serif';
        ctx.fillText('—— 扫码解锁完整专栏 ——', W / 2, pillY + 41);

        // 底部品牌与真实二维码
        const bottomY = H - 160;

        ctx.textAlign = 'left';
        if (logoImg.complete && logoImg.naturalWidth) {
          ctx.drawImage(logoImg, padX, bottomY - 6, 36, 36);
        }
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 30px "PingFang SC", sans-serif';
        ctx.fillText('财不外露', padX + 44, bottomY + 22);

        ctx.fillStyle = '#71717a';
        ctx.font = '22px "PingFang SC", sans-serif';
        ctx.fillText('微信扫码订阅专栏', padX, bottomY + 64);

        // 二维码右侧
        const qrSize = 110;
        const qrX = W - padX - qrSize;
        const qrY = bottomY - 14;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10);
        ctx.fill();

        try {
          const qr = QRCode.create(colLink.value, { errorCorrectionLevel: 'M' });
          const modCount = qr.modules.size;
          const cellSize = qrSize / modCount;

          ctx.fillStyle = '#111827';
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

      } else {
        // --- 风格二：经典纯白卡片 ---
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);

        const padX = 52;

        // 顶部淡灰条
        const topBarH = 88;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, W, topBarH);

        const inviterAvatarSize = 48;
        const inviterAvatarX = padX;
        const inviterAvatarY = (topBarH - inviterAvatarSize) / 2;
        if (avatarImg.complete && avatarImg.naturalWidth) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(inviterAvatarX + inviterAvatarSize / 2, inviterAvatarY + inviterAvatarSize / 2, inviterAvatarSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(avatarImg, inviterAvatarX, inviterAvatarY, inviterAvatarSize, inviterAvatarSize);
          ctx.restore();
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = '#475569';
        ctx.font = '500 24px "PingFang SC", sans-serif';
        ctx.fillText(`${inviterName.value} 邀请你研读`, inviterAvatarX + inviterAvatarSize + 16, inviterAvatarY + 33);

        ctx.strokeStyle = '#edf2f7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, topBarH);
        ctx.lineTo(W, topBarH);
        ctx.stroke();

        // 卡片作者
        let curY = topBarH + 68;
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 36px "PingFang SC", sans-serif';
        ctx.fillText(`${colAuthor.value} 的专栏`, padX, curY);

        curY += 34;
        ctx.fillStyle = '#64748b';
        ctx.font = '24px "PingFang SC", sans-serif';
        ctx.fillText(`来自 财不外露 · ${colCategoryName.value}`, padX, curY);

        // 分割发丝线
        curY += 36;
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(padX, curY);
        ctx.lineTo(W - padX, curY);
        ctx.stroke();

        // 专栏大标题
        curY += 56;
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 34px "PingFang SC", sans-serif';
        const titleEndY = drawWrappedText(ctx, colTitle.value, padX, curY, W - padX * 2, 48, 2);

        // 章节预览
        curY = titleEndY + 36;
        ctx.fillStyle = '#475569';
        ctx.font = '24px "PingFang SC", sans-serif';
        previewChapters.value.forEach((ch, i) => {
          const itemText = `0${i + 1}. ${ch.title}`;
          drawWrappedText(ctx, itemText, padX, curY, W - padX * 2, 38, 1);
          curY += 38;
        });

        // 引导胶囊
        const pillY = curY + 40;
        const pillW = 440;
        const pillH = 64;
        const pillX = (W - pillW) / 2;

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 12);
        ctx.fill();

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 22px "PingFang SC", sans-serif';
        ctx.fillText('—— 扫码解锁完整专栏 ——', W / 2, pillY + 41);

        // 底部品牌与真实二维码
        const bottomY = H - 160;

        ctx.textAlign = 'left';
        if (logoImg.complete && logoImg.naturalWidth) {
          ctx.drawImage(logoImg, padX, bottomY - 6, 36, 36);
        }
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 30px "PingFang SC", sans-serif';
        ctx.fillText('财不外露', padX + 44, bottomY + 22);

        ctx.fillStyle = '#64748b';
        ctx.font = '22px "PingFang SC", sans-serif';
        ctx.fillText('微信扫码订阅专栏', padX, bottomY + 64);

        // 二维码右侧
        const qrSize = 110;
        const qrX = W - padX - qrSize;
        const qrY = bottomY - 14;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10);
        ctx.fill();

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        try {
          const qr = QRCode.create(colLink.value, { errorCorrectionLevel: 'M' });
          const modCount = qr.modules.size;
          const cellSize = qrSize / modCount;

          ctx.fillStyle = '#0f172a';
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
      console.error('海报绘制异常:', e);
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
  () => isVisible.value,
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

watch(
  () => targetColumn.value?.id,
  () => {
    if (isVisible.value) {
      generateRealQrSvg();
      setTimeout(generateHighResPoster, 80);
    }
  }
);

onMounted(() => {
  if (isVisible.value) {
    generateRealQrSvg();
    generateHighResPoster();
  }
});
</script>

<style scoped>
/* 弹窗遮罩：半透明深色玻璃拟态 */
.share-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* 底部抽屉容器：纯白背景、自适应高度 */
.share-modal-sheet {
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -12px 40px rgba(15, 23, 42, 0.16);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.animate-slide-up {
  animation: slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 拖拽把手 */
.share-sheet-drag-handle {
  width: 36px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin: 10px auto 4px;
}

/* 头部：标题与关闭圆钮 */
.share-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 10px;
}

.sheet-main-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.btn-sheet-close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.btn-sheet-close:active {
  opacity: 0.7;
}

/* 风格切换分段器 */
.theme-switch-container {
  display: flex;
  justify-content: center;
  padding: 0 20px 10px;
}

.theme-switch-bar {
  display: inline-flex;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 20px;
  gap: 4px;
}

.theme-tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 16px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.theme-tab-item.is-active {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.theme-color-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.dot-dark {
  background: #1e2022;
}

.dot-light {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
}

.theme-tab-text {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
}

.theme-tab-item.is-active .theme-tab-text {
  color: #0f172a;
  font-weight: 600;
}

/* =========================================================
   海报展示区：适度微调底衬，撑托精致海报
   ========================================================= */
.share-poster-section {
  padding: 10px 20px;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* --- 风格一：黑曜深色卡片 --- */
.poster-post-dark {
  width: 100%;
  max-width: 320px;
  background: #1e2022;
  border-radius: 16px;
  padding: 18px 18px 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease;
  cursor: pointer;
}

.poster-post-dark:active {
  transform: scale(0.985);
}

.dark-author-wrap {
  display: flex;
  flex-direction: column;
}

.dark-author-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.16);
}

.dark-author-name {
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  margin-top: 10px;
  letter-spacing: -0.2px;
}

.dark-author-bio-line {
  border-left: 2px solid #52525b;
  padding-left: 8px;
  margin-top: 6px;
}

.dark-bio-text {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark-publish-time {
  font-size: 11px;
  color: #71717a;
  margin-top: 8px;
  font-variant-numeric: tabular-nums;
}

.dark-body-wrap {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
}

.dark-post-title {
  font-size: 15.5px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark-excerpt-box {
  position: relative;
  max-height: 64px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.chapter-preview-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chapter-idx-num {
  font-size: 11px;
  font-weight: 600;
  color: #10b981;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.chapter-preview-title {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-idx-num.is-light {
  color: #059669;
}

.chapter-preview-title.is-light {
  color: #475569;
}

.dark-fade-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 28px;
  background: linear-gradient(to bottom, rgba(30, 32, 34, 0) 0%, rgba(30, 32, 34, 0.98) 100%);
  pointer-events: none;
}

.dark-read-more-pill {
  background: #262930;
  border: 1px solid #383d47;
  border-radius: 8px;
  padding: 7px 12px;
  margin-top: 10px;
  text-align: center;
}

.dark-pill-text {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
  letter-spacing: 0.3px;
}

.dark-footer-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.dark-brand-col {
  display: flex;
  flex-direction: column;
}

.dark-brand-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dark-brand-logo {
  width: 17px;
  height: 17px;
}

.dark-brand-text {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.dark-brand-sub {
  font-size: 11px;
  color: #71717a;
  margin-top: 3px;
}

.dark-qr-col {
  flex-shrink: 0;
}

.dark-qr-box {
  width: 58px;
  height: 58px;
  background: #ffffff;
  border-radius: 6px;
  padding: 3px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-qr-svg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-qr-svg :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* --- 风格二：经典纯白卡片 --- */
.poster-post-light {
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #edf2f7;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.15s ease;
  cursor: pointer;
}

.poster-post-light:active {
  transform: scale(0.985);
}

.light-top-strip {
  background: #f8fafc;
  border-bottom: 1px solid #edf2f7;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.light-inviter-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
}

.light-inviter-text {
  font-size: 12px;
  font-weight: 500;
  color: #475569;
}

.light-card-body {
  padding: 14px 16px 14px;
  display: flex;
  flex-direction: column;
}

.light-author-header {
  display: flex;
  flex-direction: column;
}

.light-author-name {
  font-size: 16.5px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.light-author-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.light-hairline {
  height: 1px;
  background: #f1f5f9;
  margin: 10px 0 10px;
}

.light-post-title {
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.light-excerpt-box {
  position: relative;
  max-height: 64px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.light-fade-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 28px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.98) 100%);
  pointer-events: none;
}

.light-read-more-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 12px;
  margin-top: 10px;
  text-align: center;
}

.light-pill-text {
  font-size: 12px;
  font-weight: 600;
  color: #059669;
  letter-spacing: 0.3px;
}

.light-footer-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.light-brand-col {
  display: flex;
  flex-direction: column;
}

.light-brand-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.light-brand-logo {
  width: 17px;
  height: 17px;
}

.light-brand-text {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.light-brand-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 3px;
}

.light-qr-col {
  flex-shrink: 0;
}

.light-qr-box {
  width: 58px;
  height: 58px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light-qr-svg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light-qr-svg :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* =========================================================
   底部纯净操作栏：左侧复制链接，右侧主题绿主按钮
   ========================================================= */
.share-actions-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px 14px;
  background: #ffffff;
}

.btn-action-secondary {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  background: #f0fdf4;
  border: 1px solid rgba(16, 185, 129, 0.28);
  color: #059669;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-action-secondary:active {
  transform: scale(0.98);
  background: #dcfce7;
}

.btn-action-secondary.is-copied {
  background: #dcfce7;
  color: #047857;
  border-color: #10b981;
}

.btn-action-primary {
  flex: 1.25;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.32);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  padding: 0;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-action-primary:active {
  transform: scale(0.98);
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
  opacity: 0.95;
}

.btn-secondary-text,
.btn-primary-text {
  font-size: 14px;
  line-height: 1;
}

/* =========================================================
   全屏超清大图查看器
   ========================================================= */
.fullscreen-preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  box-sizing: border-box;
}

.preview-container {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.preview-top-toolbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.preview-title-hint {
  font-size: 13px;
  font-weight: 500;
  color: #e2e8f0;
}

.btn-preview-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-preview-close:active {
  background: rgba(255, 255, 255, 0.3);
}

.preview-image-box {
  width: 100%;
  display: flex;
  justify-content: center;
  max-height: 68vh;
  overflow-y: auto;
  border-radius: 14px;
}

.high-res-poster-img {
  width: 100%;
  max-height: 68vh;
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  display: block;
}

.preview-loading-card {
  width: 280px;
  height: 420px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-loading-txt {
  font-size: 14px;
  color: #94a3b8;
}

.preview-bottom-actions {
  width: 100%;
  margin-top: 4px;
}

.btn-download-highres {
  width: 100%;
  height: 46px;
  border-radius: 23px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.36);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
}

.btn-download-highres:active {
  transform: scale(0.98);
  opacity: 0.95;
}

.btn-download-text {
  font-size: 15px;
}
</style>
