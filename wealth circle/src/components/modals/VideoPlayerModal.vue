<template>
  <div v-if="appState.activeVideoLesson" class="modal-backdrop" @click.self="actions.closeLesson">
    <div class="video-dialog animate-fade-in">
      <div class="video-header">
        <div class="video-titles">
          <span class="v-course">{{ appState.activeVideoLesson.courseTitle }}</span>
          <h3 class="v-lesson">{{ appState.activeVideoLesson.lessonTitle }}</h3>
        </div>
        <button class="modal-close-btn" @click="actions.closeLesson">×</button>
      </div>

      <div class="video-stage-container">
        <!-- Main Simulated Video Screen -->
        <div class="player-stage">
          <div class="video-mock-screen">
            <div class="video-watermark">财不外露 · 严肃财经</div>
            <div class="video-center-controls">
              <button class="center-play-btn" @click="togglePlay">
                {{ isPlaying ? '⏸' : '▶' }}
              </button>
            </div>
            <div class="video-bottom-control-bar">
              <span class="timecode num-tabular">{{ currentTime }} / 24:30</span>
              <div class="scrubber-bar">
                <div class="scrubber-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
              <div class="speed-selector">
                <span 
                  v-for="s in [1.0, 1.25, 1.5, 2.0]" 
                  :key="s" 
                  :class="['speed-chip', { active: playSpeed === s }]"
                  @click="playSpeed = s"
                >
                  {{ s }}x
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Interactive Chat / Notes -->
        <div class="video-interactive-drawer">
          <div class="drawer-tabs">
            <span class="active-tab">💬 课堂互动弹幕 (48)</span>
          </div>

          <div class="danmaku-feed">
            <div class="danmaku-msg">
              <strong>老张(红利稳健) :</strong> 这一段四象限法则讲得太透彻了！
            </div>
            <div class="danmaku-msg">
              <strong>小李定投 :</strong> 请问老师，QDII额度受限时怎么找平替？
            </div>
            <div class="danmaku-msg">
              <strong>助教陈清 :</strong> @小李定投 可以在场内寻找折溢价率低于 1.5% 的标的。
            </div>
            <div class="danmaku-msg">
              <strong>自由现金流 :</strong> 声音非常清晰，干货拉满！
            </div>
          </div>

          <div class="danmaku-input-box">
            <input 
              type="text" 
              placeholder="发条弹幕参与讨论..." 
              v-model="danmakuText"
              @keyup.enter="sendDanmaku"
            />
            <button class="btn-primary" style="padding: 6px 12px; font-size: 12px;" @click="sendDanmaku">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { appState, actions } from '@/stores/community';

const isPlaying = ref(true);
const playSpeed = ref(1.0);
const currentTime = ref('08:45');
const progressPercent = ref(35);
const danmakuText = ref('');

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  actions.showToast(isPlaying.value ? '播放已继续' : '播放已暂停');
};

const sendDanmaku = () => {
  if (!danmakuText.value.trim()) return;
  actions.showToast(`弹幕已发送: "${danmakuText.value.trim()}"`);
  danmakuText.value = '';
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.video-dialog {
  width: 960px;
  max-width: 95vw;
  background: #0f172a;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.video-header {
  padding: 14px 20px;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v-course {
  font-size: 11px;
  color: var(--brand-green);
  font-weight: 700;
}

.v-lesson {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  margin-top: 2px;
}

.modal-close-btn {
  background: transparent;
  color: #94a3b8;
  font-size: 22px;
}

.video-stage-container {
  display: flex;
  height: 480px;
}

.player-stage {
  flex: 1;
  background: #000000;
  position: relative;
}

.video-mock-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #090d16 0%, #151d2f 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  position: relative;
}

.video-watermark {
  color: rgba(255, 255, 255, 0.2);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.video-center-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-play-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.9);
  color: #ffffff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  transition: transform var(--transition-fast);
}
.center-play-btn:hover {
  transform: scale(1.08);
}

.video-bottom-control-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(15, 23, 42, 0.85);
  padding: 10px 16px;
  border-radius: var(--radius-md);
  color: #ffffff;
}

.timecode {
  font-size: 12px;
  color: #cbd5e1;
}

.scrubber-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 99px;
  position: relative;
  overflow: hidden;
}

.scrubber-fill {
  height: 100%;
  background: var(--brand-green);
  border-radius: 99px;
}

.speed-selector {
  display: flex;
  gap: 6px;
}

.speed-chip {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  color: #94a3b8;
}

.speed-chip.active {
  background: var(--brand-green);
  color: #ffffff;
  font-weight: 700;
}

.video-interactive-drawer {
  width: 280px;
  background: #1e293b;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.drawer-tabs {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.danmaku-feed {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.danmaku-msg {
  font-size: 12px;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 10px;
  border-radius: 6px;
  line-height: 1.4;
}

.danmaku-msg strong {
  color: #fcd34d;
}

.danmaku-input-box {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 6px;
}

.danmaku-input-box input {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 6px 10px;
  font-size: 12px;
}
</style>
