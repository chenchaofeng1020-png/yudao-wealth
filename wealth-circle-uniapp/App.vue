<script>
import { actions } from './store/community.js';

export default {
  onLaunch: function () {
    console.log('财富星球移动端 App Launch');
    // 注册路由跳转拦截器：未登录或携带 share=1 打开时先跳转登录页
    const navMethods = ['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'];
    navMethods.forEach((method) => {
      uni.addInterceptor(method, {
        invoke(args) {
          if (!args || !args.url) return true;
          if (args.url.startsWith('/pages/auth/index')) return true;
          return actions.enforceAuthGuard(args.url);
        }
      });
    });

    // H5 端监听地址栏 Hash 变更（如直接粘贴分享链接打开）
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => {
        actions.enforceAuthGuard();
      });
    }

    setTimeout(() => {
      actions.enforceAuthGuard();
    }, 0);
  },
  onShow: function () {
    console.log('财富星球移动端 App Show');
    actions.enforceAuthGuard();
  },
  onHide: function () {
    console.log('财富星球移动端 App Hide');
  }
}
</script>

<style lang="scss">
/* 全局页面样式重置 (Apple iOS HIG 原生规范) */
page {
  background-color: #f6f6f6;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'PingFang SC', sans-serif;
  color: #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
}

view, text, image, input, textarea, scroll-view {
  box-sizing: border-box;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

/* 全局彻底隐藏所有滚动条，保证在 Safari/Chrome/微信 WebView 中平滑横滑无滚动条 */
::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none !important;
  background: transparent !important;
  color: transparent !important;
}

uni-scroll-view,
uni-scroll-view .uni-scroll-view {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

uni-scroll-view ::-webkit-scrollbar,
uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

/* #ifdef H5 */
/* 移动端真机屏幕：100% 满屏全宽铺满，彻底去除任何两边黑条/边距 */
html, body {
  width: 100%;
  max-width: 100vw;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f6f6f6;
  -webkit-overflow-scrolling: touch;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  overflow-x: clip;
}

uni-app, #app {
  width: 100%;
  max-width: 100vw;
  min-height: 100%;
  background-color: #f6f6f6;
  margin: 0;
  padding: 0;
  overflow-x: clip;
}

/* 确保移动端底部 TabBar 正常固定吸底显示（非 TabBar 页隐藏时保持隐藏） */
uni-tabbar {
  display: block;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 998;
}

uni-tabbar[style*="display: none"],
uni-tabbar[hidden],
uni-tabbar .uni-tabbar[style*="display: none"],
uni-tabbar .uni-tabbar[hidden] {
  display: none !important;
}

/* Apple iOS 经典毛玻璃半透明 TabBar */
uni-tabbar .uni-tabbar {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-around !important;
  background: rgba(255, 255, 255, 0.88) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border-top: 0.5px solid rgba(60, 60, 67, 0.15) !important;
  box-sizing: border-box !important;
  box-shadow: none !important;
}

uni-tabbar .uni-tabbar-border {
  display: none !important;
}

uni-tabbar .uni-tabbar__item {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  -webkit-tap-highlight-color: transparent !important;
  transition: transform 0.15s cubic-bezier(0.25, 1, 0.5, 1) !important;

  &:active {
    transform: scale(0.92);
  }
}

uni-tabbar .uni-tabbar__icon {
  width: 26px !important;
  height: 26px !important;
}

uni-tabbar .uni-tabbar__icon img {
  width: 26px !important;
  height: 26px !important;
  object-fit: contain !important;
}

/* 资讯菜单图标专属调大微调 (消除高窄比例带来的偏窄感) */
uni-tabbar .uni-tabbar__item:first-child .uni-tabbar__icon {
  width: 28px !important;
  height: 28px !important;
}

uni-tabbar .uni-tabbar__item:first-child .uni-tabbar__icon img {
  width: 28px !important;
  height: 28px !important;
}

uni-tabbar .uni-tabbar__label {
  font-weight: 500 !important;
  letter-spacing: -0.1px !important;
}

/* 仅在电脑端超大屏幕 (屏宽 > 640px) 时做居中容器模拟手机视图，手机访问绝对不生效 */
@media screen and (min-width: 641px) {
  body {
    background-color: #94a3b8 !important;
    display: flex;
    justify-content: center;
  }
  uni-app, #app {
    max-width: 420px !important;
    margin: 0 auto !important;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.25);
    position: relative;
    overflow-x: hidden;
  }
  uni-tabbar {
    max-width: 420px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
}
/* #endif */

.ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
