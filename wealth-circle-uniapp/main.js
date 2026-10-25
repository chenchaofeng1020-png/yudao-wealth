import { createSSRApp } from 'vue';
import App from './App.vue';
import { actions } from './store/community.js';

export function createApp() {
  const app = createSSRApp(App);

  // 全局页面守卫：进入星球任意页面或通过分享内容链接打开时，均需先完成登录
  app.mixin({
    onShow() {
      actions.enforceAuthGuard();
    }
  });

  return {
    app,
  };
}
