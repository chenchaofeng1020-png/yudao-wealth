<template>
  <div class="landing-page">
    <!-- 1. Top Navbar -->
    <header class="landing-header">
      <div class="header-inner">
        <div class="brand-wrap">
          <div class="logo-emblem">
            <span class="emblem-char">财</span>
          </div>
          <div class="brand-text">
            <span class="brand-title">财不外露</span>
            <span class="brand-subtitle">财经私享知识星球</span>
          </div>
        </div>

        <nav class="nav-links">
          <a href="#about" class="nav-link">星球理念</a>
          <a href="#pillars" class="nav-link">核心特权</a>
          <a href="#preview" class="nav-link">内容抢先看</a>
          <a href="#mentors" class="nav-link">专家团队</a>
          <a href="#plans" class="nav-link">会员方案</a>
          <a href="#faq" class="nav-link">常见问题</a>
        </nav>

        <div class="nav-actions">
          <button class="btn-login-ghost" @click="actions.openAuth('login')">登录</button>
          <button class="btn-join-primary" @click="actions.openAuth('register')">立即加入</button>
          <button class="btn-skip-link" @click="actions.skipToCommunity" title="直接进入系统（开发者/评审演示通道）">
            跳过演示进入星球 →
          </button>
        </div>
      </div>
    </header>

    <!-- 2. Hero Section -->
    <section class="hero-section" id="about">
      <div class="hero-container">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>财经与全球资产配置私享成长基地</span>
        </div>

        <h1 class="hero-headline">
          静水流深 · 恪守安全边际
        </h1>

        <p class="hero-subheadline">
          由一群深耕二级市场与资管多年的实战老兵打造。我们不堆砌晦涩概念与虚妄噪音，只输出穿越牛熊的实战框架与底仓逻辑。专注全天候大类资产配置、公募基金优选、家庭现金流健康与海外宽基配置。
        </p>

        <div class="hero-cta-row">
          <button class="btn-hero-primary" @click="actions.openAuth('register')">
            <span>🚀 开启私享之旅（注册并开通会员）</span>
          </button>
          <a href="#plans" class="btn-hero-secondary">
            <span>查看会员方案与特权</span>
          </a>
        </div>

        <!-- Real-time Stats Grid -->
        <div class="hero-stats-grid">
          <div class="stat-card">
            <span class="stat-num num-tabular">512</span>
            <span class="stat-lbl">稳健运营天数</span>
          </div>
          <div class="stat-card">
            <span class="stat-num num-tabular">14,280+</span>
            <span class="stat-lbl">高净值星球好友</span>
          </div>
          <div class="stat-card">
            <span class="stat-num num-tabular">300+</span>
            <span class="stat-lbl">深度策略与专栏长文</span>
          </div>
          <div class="stat-card">
            <span class="stat-num num-tabular">9 位</span>
            <span class="stat-lbl">特邀资深合伙人与嘉宾</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Sneak Peek Teaser Section (Locked View of Community) -->
    <section class="preview-section" id="preview">
      <div class="preview-container">
        <div class="section-header-center">
          <span class="section-tag">COMMUNITY PREVIEW</span>
          <h2 class="section-title">内部星球实景预览</h2>
          <p class="section-subtitle">严肃理财、严谨交流，在这里告别投机杂音，与真正的高手同行</p>
        </div>

        <div class="mockup-window-wrap">
          <div class="mockup-mac-header">
            <div class="mac-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="mac-url-bar">https://wealth-circle.internal/feed</div>
            <div class="mac-placeholder"></div>
          </div>

          <!-- Mockup Feed Area -->
          <div class="mockup-body">
            <div class="mockup-sidebar-snippet">
              <div class="m-item active">资讯</div>
              <div class="m-item">专栏</div>
              <div class="m-item">直播</div>
              <div class="m-item">课程</div>
            </div>

            <div class="mockup-content-snippet">
              <!-- Filter Tabs Mock -->
              <div class="m-tabs-row">
                <span class="m-tab active">最新</span>
                <span class="m-tab">交易追踪</span>
                <span class="m-tab">市场资讯</span>
                <span class="m-tab">理财资讯</span>
                <span class="m-tab">精选研报</span>
              </div>

              <!-- Pinned Card Mock -->
              <div class="m-pinned-card">
                <span class="m-pin-tag">置顶</span>
                <span class="m-pin-text">【📣9.17会员直播｜加息如期兑现，AI放缓如期放鸽】本期市况深度分析与大类资产应对...</span>
              </div>

              <!-- Post 1 Mock -->
              <div class="m-post-card">
                <div class="m-post-author-row">
                  <div class="m-avatar"></div>
                  <div>
                    <div class="m-author-name">老林说宏观 <span class="badge badge-founder">星主</span></div>
                    <div class="m-post-time">刚刚 · 资深对冲基金经理</div>
                  </div>
                </div>
                <div class="m-post-title">#市场资讯 #机构观点 施罗德：信用利差接近 25 年低位，但低利差可能维持更久</div>
                <div class="m-post-desc">
                  当前美欧信用债绝对收益率仍有吸引力，但相对于美债的额外风险补偿已经明显下降。我们拉长至1919年后可以发现，当前利差并没有贵到史无前例...
                </div>
                <div class="m-post-chart-placeholder">
                  <span class="chart-tag">📊 核心资产自由现金流估值监控模型.xlsx</span>
                </div>
              </div>
            </div>

            <!-- Lock Overlay -->
            <div class="preview-lock-overlay">
              <div class="lock-card animate-fade-in">
                <div class="lock-icon-circle">🔒</div>
                <h3 class="lock-title">会员专属闭门内容</h3>
                <p class="lock-desc">
                  当前为公共展示视图，动态广场、全部研报专栏及每周直播均属会员专享。<br />
                  仅需注册登录并开通会员，即可完整解锁。
                </p>
                <div class="lock-cta-btn" @click="actions.openAuth('register')">
                  立即注册登录并开通会员 →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Four Core Pillars -->
    <section class="pillars-section" id="pillars">
      <div class="pillars-container">
        <div class="section-header-center">
          <span class="section-tag">CORE PRIVILEGES</span>
          <h2 class="section-title">四大核心私享特权</h2>
          <p class="section-subtitle">一套完整的认知提升与资产稳健复利体系</p>
        </div>

        <div class="pillars-grid">
          <div class="pillar-card">
            <div class="pillar-icon-box">🌐</div>
            <h3 class="pillar-title">全天候大类资产配置底仓</h3>
            <p class="pillar-desc">
              不盲目押注单一市场与周期。依据宏观流动性与风险溢价，构建股票、债券、黄金与海外宽基的动态再平衡模型，守住家庭财富底线。
            </p>
            <ul class="pillar-list">
              <li>季度跟踪12家具备自由现金流定价权的底仓</li>
              <li>红利低波与高股息策略深度复盘</li>
              <li>全球主权风险与抗通胀配置方案</li>
            </ul>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon-box">📑</div>
            <h3 class="pillar-title">深度财经专栏与实战研报</h3>
            <p class="pillar-desc">
              独家原创《严肃理财》《财报透视》等专栏长文。拒绝快餐碎片化信息，拆解真伪护城河与财务粉饰，打造经得起检验的研投工具箱。
            </p>
            <ul class="pillar-list">
              <li>300+ 篇深度策略研报库全量畅读</li>
              <li>定期披露星主组合调仓逻辑与风险备忘录</li>
              <li>提供配套 Excel 测算模型与估值底稿</li>
            </ul>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon-box">🎙️</div>
            <h3 class="pillar-title">每周私密互动直播与复盘</h3>
            <p class="pillar-desc">
              每周二晚8点举行会员闭门直播。前瞻全球宏观变量，深度点评重大财经事件与盘面异动，支持星友现场开麦与实时文字连线。
            </p>
            <ul class="pillar-list">
              <li>全年 52 期实战直播无缝直通</li>
              <li>高清录播与文字精华纪要永久回看</li>
              <li>针对热点事件与政策落地的不定期突发加餐</li>
            </ul>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon-box">🩺</div>
            <h3 class="pillar-title">1对1 资产负债表体检与问答</h3>
            <p class="pillar-desc">
              投资不仅是买卖代码，更是家庭负债、现金流与生命周期的匹配。享有向星主老林及 9 位合伙人专家一对一发起定向问答的尊享权益。
            </p>
            <ul class="pillar-list">
              <li>家庭资产负债表结构诊断与风险排查</li>
              <li>针对房产、固收、公募优选的一对一解惑</li>
              <li>严格保护星友个人隐私与资金保密</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Experts Team -->
    <section class="mentors-section" id="mentors">
      <div class="mentors-container">
        <div class="section-header-center">
          <span class="section-tag">EXPERT PARTNERS</span>
          <h2 class="section-title">智囊团：与行业老兵同行</h2>
          <p class="section-subtitle">一线基金经理、资管高管与财富规划顾问全程陪伴</p>
        </div>

        <div class="mentors-grid">
          <div class="mentor-card">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" class="mentor-avatar" alt="老林说宏观" />
            <h3 class="mentor-name">老林说宏观</h3>
            <div class="mentor-role">星主 / 资深宏观对冲基金经理</div>
            <p class="mentor-bio">
              20年二级市场投研老兵，管理规模逾数十亿。历经三轮牛熊转换，恪守“不熟不做、现金流第一”原则。
            </p>
          </div>

          <div class="mentor-card">
            <img src="@/assets/avatar_rich.png" class="mentor-avatar" alt="Rich" />
            <h3 class="mentor-name">Rich</h3>
            <div class="mentor-role">合伙人 / 某金融公司资深高管</div>
            <p class="mentor-bio">
              深耕资管机构10余年，专注大类资产配置与企业流动性管理。擅长将复杂宏观数据降维为可执行策略。
            </p>
          </div>

          <div class="mentor-card">
            <img src="@/assets/avatar_john.png" class="mentor-avatar" alt="John" />
            <h3 class="mentor-name">John</h3>
            <div class="mentor-role">特邀嘉宾 / 国际证券特约员</div>
            <p class="mentor-bio">
              专注全球成熟市场配置与海外ETF研究，覆盖美股、日股与新兴市场宽基，把握全球流动性脉搏。
            </p>
          </div>

          <div class="mentor-card">
            <img src="@/assets/avatar_jerry.png" class="mentor-avatar" alt="Jerry" />
            <h3 class="mentor-name">Jerry</h3>
            <div class="mentor-role">导师 / 资深理财规划顾问</div>
            <p class="mentor-bio">
              家庭理财与资产隔离顾问，深谙固收、信托与税务架构规划，帮助数百个家庭建立抗风险防火墙。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Pricing & Plans Section -->
    <section class="plans-section" id="plans">
      <div class="plans-container">
        <div class="section-header-center">
          <span class="section-tag">MEMBERSHIP TIERS</span>
          <h2 class="section-title">选择加入「财不外露」</h2>
          <p class="section-subtitle">低调蓄力，稳健复利；注册登录后即可一键开通</p>
        </div>

        <div class="pricing-cards-grid">
          <!-- Tier 1: Annual -->
          <div class="pricing-card featured">
            <div class="pricing-badge hot">最受推荐 · 92% 星友选择</div>
            <div class="p-header">
              <h3 class="p-title">年度白金 VIP 会员</h3>
              <p class="p-sub">适合希望建立系统底仓框架、紧跟实盘动态的投资者</p>
            </div>

            <div class="p-price-row">
              <span class="currency">¥</span>
              <span class="amount num-tabular">899</span>
              <span class="period">/ 365天</span>
              <span class="origin-price num-tabular">¥1,699</span>
            </div>
            <div class="daily-calc">折合每日仅需 2.46 元，不到一杯咖啡钱</div>

            <ul class="p-features">
              <li>✓ 全年 52 期实盘复盘私密直播与回看</li>
              <li>✓ 畅读全站 300+ 篇《严肃理财》深度专栏</li>
              <li>✓ 季度动态更新的核心底仓安全边际名单</li>
              <li>✓ 星球内问答专区向星主及专家定向提问</li>
              <li>✓ 高净值星友纯净互动交流群</li>
              <li>✓ 7 天不满意无条件全额退款保障</li>
            </ul>

            <button class="btn-tier-cta primary" @click="actions.openAuth('register')">
              立即注册并开通年度 VIP
            </button>
          </div>

          <!-- Tier 2: Lifetime -->
          <div class="pricing-card">
            <div class="pricing-badge founder">终身尊享 · 限量合伙</div>
            <div class="p-header">
              <h3 class="p-title">终身创始合伙人</h3>
              <p class="p-sub">适合全方位资产配置、企业现金流管理与私董社交的高净值家庭</p>
            </div>

            <div class="p-price-row">
              <span class="currency">¥</span>
              <span class="amount num-tabular">2,999</span>
              <span class="period">/ 终身有效</span>
              <span class="origin-price num-tabular">¥5,999</span>
            </div>
            <div class="daily-calc">一次开通终身受用，享未来全系课程策略更新</div>

            <ul class="p-features">
              <li>✓ 包含年度 VIP 全部权益，永久不过期</li>
              <li>✓ 赠送星主老林 1 对 1 家庭资产负债表深度诊断</li>
              <li>✓ 闭门合伙人微信私享群与线下闭门私董会</li>
              <li>✓ 专属黑金合伙人身份勋章与特权通道</li>
              <li>✓ 未来推出的全新衍生课与高阶研报永久免付费</li>
              <li>✓ 优先对接行业顶尖机构资源</li>
            </ul>

            <button class="btn-tier-cta secondary" @click="actions.openAuth('register')">
              立即加入终身创始合伙人
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. FAQ Section -->
    <section class="faq-section" id="faq">
      <div class="faq-container">
        <div class="section-header-center">
          <span class="section-tag">FREQUENTLY ASKED QUESTIONS</span>
          <h2 class="section-title">常见问题解答</h2>
        </div>

        <div class="faq-list">
          <div class="faq-item">
            <div class="faq-q">Q: 为什么星球需要注册登录并开通会员才能查看内容？</div>
            <div class="faq-a">
              A: 「财不外露」定位为严肃、真实、高净值的闭门投研星球。为了保证沉淀内容的深度与纯度，屏蔽网络杂音与恶意搬运，我们采用会员制门槛，确保每一位星友都是认真对待家庭财富与长期复利的同行者。
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-q">Q: 加入后我不懂复杂的金融知识，能看懂吗？</div>
            <div class="faq-a">
              A: 完全可以。我们坚决摒弃晦涩的学术公式，坚持用大白话和底层商业逻辑拆解投资标的。无论您是投资小白还是成熟老手，都能在体系化专栏与直播中找到清晰可落地的操作线索。
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-q">Q: 开通后支持退款吗？</div>
            <div class="faq-a">
              A: 支持。我们对星球内沉淀的策略深度充满信心。若您开通后 7 天内觉得内容不符合您的预期，可联系助手无理由申请全额退款。
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Footer -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="f-logo">财</div>
          <div>
            <div class="f-name">财不外露</div>
            <div class="f-desc">财经私享知识星球 · 专注全球资产配置与家庭理财实践</div>
          </div>
        </div>

        <div class="footer-note">
          免责声明：本星球所有讨论、专栏及直播内容仅作投资逻辑探讨与财商学习交流，不构成任何具体的投资建议与收益承诺。市场有风险，投资需谨慎。
        </div>

        <div class="footer-copyright">
          © 2024-2026 财不外露 (Wealth Circle). All Rights Reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { actions } from '@/stores/community';
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background-color: #ffffff;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

/* 1. Header */
.landing-header {
  position: sticky;
  top: 0;
  background: #ffffff;
  border-bottom: 1px solid var(--border-light);
  height: 64px;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-emblem {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emblem-char {
  color: #f59e0b;
  font-size: 20px;
  font-weight: 800;
}

.brand-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary-navy);
  line-height: 1.2;
  display: block;
}

.brand-subtitle {
  font-size: 11px;
  color: var(--text-muted);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}
.nav-link:hover {
  color: var(--primary-navy);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-login-ghost {
  background: transparent;
  color: var(--primary-navy);
  font-size: 13.5px;
  font-weight: 700;
  padding: 7px 16px;
  border-radius: var(--radius-card);
}
.btn-login-ghost:hover {
  background: var(--bg-subtle);
}

.btn-join-primary {
  background: var(--brand-green);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: var(--radius-card);
  transition: all 0.15s ease;
}
.btn-join-primary:hover {
  background: var(--brand-green-hover);
}

.btn-skip-link {
  background: transparent;
  color: #64748b;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: var(--radius-card);
  cursor: pointer;
  text-decoration: underline;
}
.btn-skip-link:hover {
  color: var(--primary-navy);
}

/* 2. Hero */
.hero-section {
  padding: 70px 24px 50px 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  text-align: center;
}

.hero-container {
  max-width: 920px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid var(--border-light);
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 24px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-green);
}

.hero-headline {
  font-size: 44px;
  font-weight: 900;
  color: var(--primary-navy);
  letter-spacing: -1px;
  line-height: 1.25;
  margin-bottom: 20px;
}

.hero-subheadline {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 780px;
  margin: 0 auto 36px auto;
}

.hero-cta-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 50px;
}

.btn-hero-primary {
  background: var(--brand-green);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  padding: 13px 30px;
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-hero-primary:hover {
  background: var(--brand-green-hover);
  transform: translateY(-1px);
}

.btn-hero-secondary {
  background: #ffffff;
  color: var(--primary-navy);
  border: 1px solid var(--border-light);
  font-size: 14.5px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: var(--radius-card);
  text-decoration: none;
  transition: all 0.15s ease;
}
.btn-hero-secondary:hover {
  background: var(--bg-subtle);
  border-color: #cbd5e1;
}

/* Stats */
.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 24px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-card:not(:last-child) {
  border-right: 1px solid var(--border-light);
}

.stat-num {
  font-size: 28px;
  font-weight: 900;
  color: var(--primary-navy);
  line-height: 1.1;
  margin-bottom: 4px;
}

.stat-lbl {
  font-size: 12px;
  color: var(--text-muted);
}

/* Section Shared Headers */
.section-header-center {
  text-align: center;
  margin-bottom: 42px;
}

.section-tag {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--brand-green);
  background: var(--brand-green-light);
  border: 1px solid var(--brand-green-border);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  display: inline-block;
  margin-bottom: 10px;
}

.section-title {
  font-size: 30px;
  font-weight: 900;
  color: var(--primary-navy);
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 14.5px;
  color: var(--text-secondary);
}

/* 3. Preview Section */
.preview-section {
  padding: 60px 24px 80px 24px;
  background: #ffffff;
}

.preview-container {
  max-width: 1100px;
  margin: 0 auto;
}

.mockup-window-wrap {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  background: #ffffff;
  overflow: hidden;
  position: relative;
}

.mockup-mac-header {
  background: #f1f5f9;
  border-bottom: 1px solid var(--border-light);
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
}

.mac-dots {
  display: flex;
  gap: 6px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.mac-url-bar {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 2px 14px;
  font-size: 11px;
  color: #64748b;
  flex: 1;
  max-width: 320px;
  text-align: center;
}

.mockup-body {
  display: flex;
  height: 440px;
  position: relative;
  overflow: hidden;
}

.mockup-sidebar-snippet {
  width: 180px;
  background: #f8fafc;
  border-right: 1px solid var(--border-light);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.m-item {
  padding: 8px 12px;
  border-radius: var(--radius-card);
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}
.m-item.active {
  background: #ffffff;
  color: var(--primary-navy);
  font-weight: 700;
}

.mockup-content-snippet {
  flex: 1;
  padding: 18px 24px;
  background: #ffffff;
  filter: blur(2.5px);
  user-select: none;
}

.m-tabs-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.m-tab {
  background: #f1f5f9;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #64748b;
}
.m-tab.active {
  background: #2c323f;
  color: #ffffff;
}

.m-pinned-card {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 10px 14px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.m-pin-tag {
  color: var(--brand-green);
  border: 1px solid var(--brand-green);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
}
.m-pin-text {
  font-size: 12px;
  color: #334155;
}

.m-post-card {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 16px;
}
.m-post-author-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.m-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #cbd5e1;
}
.m-author-name {
  font-size: 13px;
  font-weight: 700;
}
.m-post-time {
  font-size: 11px;
  color: #94a3b8;
}
.m-post-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 8px;
}
.m-post-desc {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 10px;
}
.m-post-chart-placeholder {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  padding: 14px;
  font-size: 12px;
  color: #475569;
}

.preview-lock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lock-card {
  background: #ffffff;
  border-radius: var(--radius-card);
  border: 1px solid var(--border-light);
  padding: 32px 36px;
  text-align: center;
  max-width: 440px;
  width: 100%;
}

.lock-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fef3c7;
  color: #b45309;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px auto;
}

.lock-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 8px;
}

.lock-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
}

.lock-cta-btn {
  background: var(--brand-green);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  padding: 11px 22px;
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-block;
}
.lock-cta-btn:hover {
  background: var(--brand-green-hover);
  transform: translateY(-1px);
}

/* 4. Pillars Section */
.pillars-section {
  padding: 80px 24px;
  background: #f8fafc;
}

.pillars-container {
  max-width: 1180px;
  margin: 0 auto;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.pillar-card {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
}

.pillar-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--brand-green-light);
  color: var(--brand-green);
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.pillar-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 8px;
}

.pillar-desc {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.pillar-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px dashed var(--border-light);
}

.pillar-list li {
  font-size: 12.5px;
  color: var(--tertiary-navy);
  position: relative;
  padding-left: 14px;
}
.pillar-list li::before {
  content: '•';
  color: var(--brand-green);
  position: absolute;
  left: 0;
  font-weight: bold;
}

/* 5. Mentors Section */
.mentors-section {
  padding: 80px 24px;
  background: #ffffff;
}

.mentors-container {
  max-width: 1180px;
  margin: 0 auto;
}

.mentors-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.mentor-card {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 24px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mentor-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
  margin-bottom: 14px;
}

.mentor-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 4px;
}

.mentor-role {
  font-size: 12px;
  font-weight: 600;
  color: var(--vip-gold);
  margin-bottom: 12px;
}

.mentor-bio {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 6. Pricing Section */
.plans-section {
  padding: 80px 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.plans-container {
  max-width: 980px;
  margin: 0 auto;
}

.pricing-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.pricing-card {
  background: #ffffff;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 36px 30px;
  position: relative;
  display: flex;
  flex-direction: column;
}
.pricing-card.featured {
  border-color: #f59e0b;
}

.pricing-badge {
  position: absolute;
  top: -12px;
  right: 24px;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 12px;
  border-radius: var(--radius-full);
}
.pricing-badge.hot {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}
.pricing-badge.founder {
  background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
  color: #ffffff;
}

.p-header {
  margin-bottom: 16px;
}

.p-title {
  font-size: 20px;
  font-weight: 900;
  color: var(--primary-navy);
  margin-bottom: 6px;
}

.p-sub {
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.4;
}

.p-price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
}

.p-price-row .currency {
  font-size: 20px;
  font-weight: 900;
  color: #d97706;
}
.p-price-row .amount {
  font-size: 38px;
  font-weight: 900;
  color: #d97706;
}
.p-price-row .period {
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
}
.p-price-row .origin-price {
  font-size: 15px;
  color: #94a3b8;
  text-decoration: line-through;
  margin-left: 6px;
}

.daily-calc {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 24px;
}

.p-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
  flex: 1;
}

.p-features li {
  font-size: 13px;
  color: var(--tertiary-navy);
}

.btn-tier-cta {
  width: 100%;
  padding: 13px 20px;
  border-radius: var(--radius-card);
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-tier-cta.primary {
  background: var(--vip-gold-gradient);
  color: #ffffff;
}
.btn-tier-cta.primary:hover {
  filter: brightness(1.08);
}
.btn-tier-cta.secondary {
  background: #0f172a;
  color: #ffffff;
}
.btn-tier-cta.secondary:hover {
  background: #1e293b;
}

/* 7. FAQ */
.faq-section {
  padding: 70px 24px;
  background: #ffffff;
}

.faq-container {
  max-width: 860px;
  margin: 0 auto;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  padding: 20px 24px;
  background: #ffffff;
}

.faq-q {
  font-size: 15px;
  font-weight: 800;
  color: var(--primary-navy);
  margin-bottom: 8px;
}

.faq-a {
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 8. Footer */
.landing-footer {
  background: #0f172a;
  color: #94a3b8;
  padding: 50px 24px 36px 24px;
  margin-top: auto;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.f-logo {
  width: 36px;
  height: 36px;
  background: #1e293b;
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  font-weight: 800;
  font-size: 18px;
}

.f-name {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
}
.f-desc {
  font-size: 12px;
  color: #64748b;
}

.footer-note {
  font-size: 12px;
  line-height: 1.6;
  color: #64748b;
  border-top: 1px solid #1e293b;
  padding-top: 16px;
}

.footer-copyright {
  font-size: 12px;
  color: #475569;
}
</style>
