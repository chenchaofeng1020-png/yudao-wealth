<template>
  <div v-if="appState.readingChapter" class="modal-backdrop" @click.self="actions.closeChapter">
    <div class="reader-dialog animate-fade-in">
      <div class="reader-header">
        <div class="reader-meta">
          <span class="column-name">{{ appState.readingChapter.columnTitle }}</span>
          <h2 class="chapter-name">{{ appState.readingChapter.chapterTitle }}</h2>
        </div>
        <button class="modal-close-btn" @click="actions.closeChapter">×</button>
      </div>

      <div class="reader-body">
        <div class="reader-toolbar-top">
          <span class="read-duration">⏱ 预计阅读 15 分钟</span>
          <span class="read-count">👁 3,820 次研读</span>
          <button class="btn-audio-listen" @click="actions.showToast('已开启语音伴读播放')">
            🎧 听文章 (AI原声)
          </button>
        </div>

        <div class="article-text-body">
          <p class="lead-quote">
            “古人云：君子藏器于身，待时而动。在波诡云谲的金融市场中，真正的赢家往往是最沉默、最敬畏周期与安全边际的人。”
          </p>

          <h3>一、理财的第一定律：防守优于进攻</h3>
          <p>
            大多数进入市场的朋友，最先学习的往往是“如何选牛股”、“如何抓涨停”。然而统计过去半个世纪的全球大类资产表现，决定投资组合最终净值走势的，80% 以上并非来自于短期的择时或个股暴涨，而是来自于底层的<strong>资产配置框架</strong>与<strong>回撤控制</strong>。
          </p>
          <p>
            当你在牛市赚到 100% 的时候，一次 50% 的断崖式回撤就会让你回到原点；而如果再次发生 50% 的亏损，你需要上涨 100% 才能回本。这就是数学上的“几何级数陷阱”。
          </p>

          <h3>二、什么是真正的“全天候资产负债表”？</h3>
          <p>
            一套稳健的资产负债表，必须能够抵御以下四种宏观经济象限：
          </p>
          <ul>
            <li><strong>通胀上升期：</strong> 黄金、高股息现金流上游资源资产是最好的对冲工具。</li>
            <li><strong>通胀下降期：</strong> 长期国债与高信用等级固收+基金表现卓越。</li>
            <li><strong>经济扩张期：</strong> 核心权益资产（具备全球定价权的科技与高端制造）负责贡献超额阿尔法。</li>
            <li><strong>经济收缩期：</strong> 高确定性的现金等价物（短债、货币工具、逆回购）是维持生存与逆向捡筹码的子弹。</li>
          </ul>

          <div class="summary-highlight-card">
            <div class="hl-title">💡 本讲核心实操清单</div>
            <p>{{ appState.readingChapter.summary }}</p>
          </div>
        </div>
      </div>

      <div class="reader-footer">
        <button class="btn-secondary" @click="actions.closeChapter">关闭阅读</button>
        <button class="btn-primary" @click="actions.showToast('已加入我的精读笔记与书签')">标记为已读并记笔记</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appState, actions } from '@/stores/community';
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.reader-dialog {
  width: 720px;
  max-height: 85vh;
  background: #ffffff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.reader-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.column-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-green-hover);
}

.chapter-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-top: 2px;
}

.modal-close-btn {
  background: transparent;
  font-size: 24px;
  color: var(--text-muted);
}

.reader-body {
  padding: 24px 32px;
  overflow-y: auto;
  flex: 1;
}

.reader-toolbar-top {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: var(--text-muted);
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 20px;
}

.btn-audio-listen {
  margin-left: auto;
  background: var(--bg-subtle);
  color: var(--primary-navy);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.article-text-body {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-primary);
}

.lead-quote {
  font-style: italic;
  background: var(--bg-subtle);
  border-left: 4px solid var(--brand-green);
  padding: 12px 16px;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.article-text-body h3 {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
  margin: 20px 0 10px 0;
}

.article-text-body p {
  margin-bottom: 14px;
}

.article-text-body ul {
  padding-left: 20px;
  margin-bottom: 16px;
}

.article-text-body li {
  margin-bottom: 8px;
}

.summary-highlight-card {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: var(--radius-md);
  padding: 14px 18px;
  margin-top: 20px;
}

.hl-title {
  font-size: 13px;
  font-weight: 800;
  color: #065f46;
  margin-bottom: 6px;
}

.reader-footer {
  padding: 14px 24px;
  background: var(--bg-subtle);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
