import { reactive, computed } from 'vue';

// 预设演示用户
export const currentUserMock = {
  id: 'u-founder',
  name: '老林说宏观',
  avatar: '/static/avatar_mark.png',
  role: 'founder',
  roleTitle: '星主',
  bio: '20年二级市场投研老兵，专注全天候大类资产配置与高安全边际投资。财不外露，静水流深。',
  joinedAt: '2024-01-01',
  vipExpireAt: '2099-12-31',
  phone: '13901390139',
  followingCount: 18,
  followersCount: 14280,
  points: 8640,
};

export const demoVipUserMock = {
  id: 'u-vip-01',
  name: '远山求道',
  avatar: '/static/avatar_john.png',
  role: 'vip',
  roleTitle: '年度会员',
  bio: '实体创业者，长期价值定投践行者，在不确定性中寻找确定性复利。',
  joinedAt: '2024-03-15',
  vipExpireAt: '2027-03-15',
  phone: '13812345678',
  followingCount: 35,
  followersCount: 129,
  points: 1250,
};

export const demoGuestUserMock = {
  id: 'u-guest-01',
  name: '新晋星友_8888',
  avatar: '/static/avatar_jerry.png',
  role: 'guest',
  roleTitle: '已注册 (未开通VIP)',
  bio: '新加入「财不外露」星球，正在开启资产配置进阶之旅。',
  joinedAt: '2026-09-20',
  vipExpireAt: '未开通',
  phone: '15966667777',
  followingCount: 0,
  followersCount: 0,
  points: 50,
};

// 星球成员名录（对应 PC 端 Rightbar 与 CommunityMembersModal）
export const membersMock = [
  {
    id: 'm-founder',
    name: '老林说宏观',
    avatar: '/static/avatar_mark.png',
    role: 'founder',
    roleTitle: '星主 · 资深对冲基金经理',
    bio: '20年二级市场投研老兵，专注全天候大类资产配置与高安全边际底仓实践。',
    joinedDays: '1,020 天'
  },
  {
    id: 'm-rich',
    name: 'Rich',
    avatar: '/static/avatar_rich.png',
    role: 'partner',
    roleTitle: '核心合伙人 · 美股资深分析师',
    bio: '10年全球对冲基金投资经验，深耕大宗商品衍生品与跨市场套利交易。',
    joinedDays: '980 天'
  },
  {
    id: 'm-john',
    name: 'John',
    avatar: '/static/avatar_john.png',
    role: 'guest',
    roleTitle: '特邀专家 · 国际证券特约员',
    bio: '专注海外宽基指数、QDII套利模型与美欧跨境资本流动监测。',
    joinedDays: '860 天'
  },
  {
    id: 'm-jerry',
    name: 'Jerry',
    avatar: '/static/avatar_jerry.png',
    role: 'guest',
    roleTitle: '特邀专家 · 理财规划导师',
    bio: '专注家庭资产稳健增值、固定收益策略与现金流管理。',
    joinedDays: '750 天'
  },
  {
    id: 'm-ruoqi',
    name: '若琪',
    avatar: '/static/avatar_jerry.png',
    role: 'guest',
    roleTitle: '特邀专家 · 硬件与芯片分析师',
    bio: '深耕硬科技产业，聚焦先进封装、AI产业链与商业模式研究。',
    joinedDays: '690 天'
  },
  {
    id: 'm-vip-01',
    name: '远山求道',
    avatar: '/static/avatar_john.png',
    role: 'vip',
    roleTitle: '年度会员',
    bio: '实体创业者，长期价值定投践行者，在不确定性中寻找确定性复利。',
    joinedDays: '540 天'
  }
];

// 置顶通知
export const pinnedNoticesMock = [
  {
    id: 'pin-1',
    title: '9.17会员直播｜加息如期兑现，AI放缓如期放鸽',
    tag: '直播',
    summary: '本期直播将为大家带来近期市况深度点评与宏观流动性推演。'
  },
  {
    id: 'pin-2',
    title: '新人必看｜「财富星球」全景介绍与新手使用指南',
    tag: '指引',
    summary: '点击查看星球六大核心特权使用全流程与知识库入口。'
  },
  {
    id: 'pin-3',
    title: '组合策略｜「财不外露」全天候大类资产配置组合全拆解',
    tag: '策略',
    summary: '低波红利+核心资产实盘跟踪说明与调仓纪律。'
  }
];

// 六大核心权益
export const membershipBenefits = [
  {
    name: '交易追踪',
    desc: '聚焦港美股重点个股，跟踪基本面、预期与资金风向，辅助识别阶段性机会。',
    tags: ['个股资讯', '公司财报', '机构持仓'],
    icon: '📈'
  },
  {
    name: '市场资讯',
    desc: '聚焦宏观环境、政策变化、机构观点与市场主线，理解资产价格核心逻辑。',
    tags: ['机构观点', '宏观市场', '宏观周报'],
    icon: '🌐'
  },
  {
    name: '理财资讯',
    desc: '围绕基金、债券、港股打新、结构化产品等资产，拆解收益来源与风险边界。',
    tags: ['港股打新', '基金组合', '债券优选'],
    icon: '💰'
  },
  {
    name: '话题研究',
    desc: '每周深度解析财经热点、产业周期、宏观趋势、金融产品与投资方法论。',
    tags: ['宏观策略', '大类资产配置', '红利低波'],
    icon: '💡'
  },
  {
    name: '会员直播',
    desc: '每双周闭门腾讯会议直播，星主与合伙人复盘行情，在线解答星友持仓疑问。',
    tags: ['闭门复盘', '在线答疑', '录播回放'],
    icon: '🎥'
  },
  {
    name: '专栏深度长文',
    desc: '深度投研长文成体系连载，穿透宏观大盘指标、产业链剖析与行业周期。',
    tags: ['美股指标', 'AI产业', '宏观量化'],
    icon: '📚'
  }
];

// 专栏及长文数据
export const columnsMock = [
  {
    id: 'col-us-stock',
    title: '「美股指标」解析',
    subtitle: '穿透宏观大盘、市场广度与流动性定价底层指标',
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    author: 'Rich',
    authorTitle: '美股宏观对冲资深合伙人',
    authorAvatar: '/static/avatar_rich.png',
    price: 399,
    originPrice: 799,
    subscriberCount: 1860,
    chapterCount: 7,
    category: 'macro',
    categoryName: '宏观美股',
    statusText: '更新中',
    statusType: 'updating',
    isCompleted: false,
    chapters: [
      {
        id: 'art-mg-1',
        columnId: 'col-us-stock',
        title: '【价格反馈】趋势、量价与风险，观察市场如何定价企业价值',
        author: 'Rich',
        authorAvatar: '/static/avatar_rich.png',
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-28 10:20',
        duration: '20分钟',
        wordCount: 4500,
        readCount: 3820,
        isFreeTrial: true,
        isNew: true,
        tags: ['价格反馈', '趋势量价'],
        summary: '剖析股价走势背后的量价异动与风险溢价，解读机构大资金定价核心逻辑。',
        likes: 42,
        isLiked: false,
        likers: ['Rich', '远山求道', 'Mark', 'Jerry'],
        comments: [
          {
            id: 'c-art-1',
            author: { name: '远山求道', avatar: '/static/avatar_john.png', role: 'vip' },
            content: '这篇文章对量价背离与波动率异常的阐述非常深刻，实盘中作为风控信号非常有效！',
            createdAt: '昨天 15:30',
            likes: 8
          },
          {
            id: 'c-art-2',
            author: { name: 'Jerry', avatar: '/static/avatar_jerry.png', role: 'guest' },
            content: '请教星主，如果在宏观流动性收紧阶段，如何权衡估值分位数与防御仓位？',
            createdAt: '前天 18:20',
            likes: 5
          }
        ],
        content: `市场价格不仅是交易结果，更是所有市场参与者预期的综合贴现反馈。通过追踪量价背离与波动率异常，我们可以提前洞察大资金的调仓轨迹……`
      },
      {
        id: 'art-mg-2',
        columnId: 'col-us-stock',
        title: '【个股研究】质量、成长与估值，看清企业价值',
        author: 'Rich',
        authorAvatar: '/static/avatar_rich.png',
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-26 14:15',
        duration: '22分钟',
        wordCount: 4800,
        readCount: 3410,
        isFreeTrial: false,
        isNew: true,
        tags: ['个股研究', '估值模型'],
        summary: '拆解美股科技与消费龙头的 ROE、自由现金流与估值敏感性测试。',
        content: `选股的本质是挑资产。如何用三张表穿透商业壁垒，计算具备安全边际的合理买点……`
      },
      {
        id: 'art-mg-3',
        columnId: 'col-us-stock',
        title: '【市场主线】风格、行业与主题，看清美股行情逻辑',
        author: 'Rich',
        authorAvatar: '/static/avatar_rich.png',
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-25 16:40',
        duration: '18分钟',
        wordCount: 3900,
        readCount: 3120,
        isFreeTrial: false,
        isNew: true,
        tags: ['市场主线', '风格轮动'],
        summary: '成长 vs 价值、大盘 vs 小盘风格轮动的宏观推手与行业动量捕捉。',
        content: `主线行情往往伴随着利率周期与产业叙事的共振。把握美股风格切换的关键驱动因子……`
      },
      {
        id: 'art-mg-4',
        columnId: 'col-us-stock',
        title: '【市场状态】广度、风险与仓位，看清美股行情质量',
        author: 'Rich',
        authorAvatar: '/static/avatar_rich.png',
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-24 17:17',
        duration: '22分钟',
        wordCount: 4860,
        readCount: 3580,
        isFreeTrial: true,
        isNew: true,
        tags: ['市场状态', '市场广度'],
        summary: '从创新高股票占比与站上200日线比例，穿透指数虚高背后的真实广度。',
        content: `当我们观察标普500指数时，很多时候会被市值的加权方式所迷惑。少数科技巨头上涨足以掩盖多数中小成分股的疲软，看透市场广度才能穿透流动性假象……`
      },
      {
        id: 'art-mg-5',
        columnId: 'col-us-stock',
        title: '【大盘定价】盈利与估值，看清美股上涨逻辑',
        author: 'Rich',
        authorAvatar: '/static/avatar_rich.png',
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-20 14:30',
        duration: '18分钟',
        wordCount: 3920,
        readCount: 2940,
        isFreeTrial: false,
        isNew: false,
        tags: ['美股指标', '估值模型'],
        summary: '剖析席勒市盈率（CAPE）与股权风险溢价（ERP），洞悉大盘估值历史分位数。',
        content: `大盘定价核心公式：P = EPS × PE。从一致预期利润增速出发，量化分析当前大盘透支的宽松预期……`
      },
      {
        id: 'art-mg-6',
        columnId: 'col-us-stock',
        title: '【金融条件】利率、信用与流动性，判断美股资金环境',
        author: 'Rich',
        authorAvatar: '/static/avatar_rich.png',
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-15 11:20',
        duration: '25分钟',
        wordCount: 5200,
        readCount: 2420,
        isFreeTrial: false,
        isNew: false,
        tags: ['流动性', '利率周期'],
        summary: '逆回购（RRP）、准备金余额与美联储资产负债表缩表进程穿透。',
        content: `探究美联储货币政策框架下，银行准备金体系的流动性阈值与资产价格传导路径……`
      },
      {
        id: 'art-mg-7',
        columnId: 'col-us-stock',
        title: '【宏观周期】增长、就业与通胀，看清美国经济状态',
        author: 'Rich',
        authorAvatar: '/static/avatar_rich.png',
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-10 09:15',
        duration: '15分钟',
        wordCount: 3100,
        readCount: 3110,
        isFreeTrial: false,
        isNew: false,
        tags: ['经济周期', '宏观数据'],
        summary: '非农就业、核心PCE与萨姆规则（Sahm Rule）衰退信号的动态推演。',
        content: `通过高频指标观察劳动力市场供需平衡变化，建立客观量化的经济周期时钟……`
      }
    ]
  },
  {
    id: 'col-ai-industry',
    title: '「AI产业」剖析',
    subtitle: '理清全球AI产业链结构与核心投资脉络',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=80',
    author: '志诚 / 若琪',
    authorTitle: '硬科技投研团队',
    authorAvatar: '/static/avatar_john.png',
    price: 499,
    originPrice: 999,
    subscriberCount: 2430,
    chapterCount: 8,
    category: 'tech',
    categoryName: 'AI科技',
    statusText: '已完结',
    statusType: 'completed',
    isCompleted: true,
    chapters: [
      { id: 'ch-ai-1-1', columnId: 'col-ai-industry', title: '【算力底座】全球 AI 算力基础设施与芯片产业链全景深度剖析', isNew: true, duration: '30分钟', wordCount: 6200, isFreeTrial: true, summary: '全景解析 GPU、ASIC 定制芯片及算力中心架构升级路径。' },
      { id: 'ch-ai-1-2', columnId: 'col-ai-industry', title: '【商业模式】大模型 Infra 与云厂商 AI 原生重构的商业化路径', isNew: true, duration: '20分钟', wordCount: 4100, isFreeTrial: false, summary: '资本开支转化率与企业端 AI 原生应用的商业闭环。' },
      { id: 'ch-ai-1-3', columnId: 'col-ai-industry', title: '【先进封装】CoWoS 产能扩张与 HBM 存储演进趋势', isNew: true, duration: '24分钟', wordCount: 4900, isFreeTrial: false, summary: '台积电与存储大厂资本开支聚焦的先进制程瓶颈。' },
      { id: 'ch-ai-1-4', columnId: 'col-ai-industry', title: '【光互联】800G/1.6T 光模块与 CPO 硅光技术路线博弈', isNew: true, duration: '21分钟', wordCount: 4300, isFreeTrial: false, summary: '数据中心内部带宽瓶颈与光模块出货量爆发推演。' },
      { id: 'ch-ai-1-5', columnId: 'col-ai-industry', title: '【电力与算力】数据中心能源瓶颈与核能/绿电机遇', isNew: false, duration: '26分钟', wordCount: 5100, isFreeTrial: false, summary: '算力的尽头是电力：北美独立电力生产商价值重估。' },
      { id: 'ch-ai-1-6', columnId: 'col-ai-industry', title: '【网络架构】InfiniBand vs 以太网 ROCEv2 路线博弈', isNew: false, duration: '19分钟', wordCount: 3800, isFreeTrial: false, summary: '超大规模 AI 集群下的网络时延与吞吐性价比权衡。' },
      { id: 'ch-ai-1-7', columnId: 'col-ai-industry', title: '【半导体周期】存储与晶圆代工供需拐点推演', isNew: false, duration: '23分钟', wordCount: 4600, isFreeTrial: false, summary: '传统消费电子见底与 AI 增量驱动的超级周期共振。' },
      { id: 'ch-ai-1-8', columnId: 'col-ai-industry', title: '【投资图谱】全球核心 AI 产业链标的估值横向对比', isNew: false, duration: '28分钟', wordCount: 5600, isFreeTrial: false, summary: '从 PEG、PS 到自由现金流倍数，量化核心标的安全边际。' }
    ]
  },
  {
    id: 'col-ai-trend',
    title: '「AI趋势」解析',
    subtitle: '前沿大模型范式演进与下一代杀手级应用落地',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    author: '若琪',
    authorTitle: '软件与前沿技术首席',
    authorAvatar: '/static/avatar_jerry.png',
    price: 399,
    originPrice: 799,
    subscriberCount: 1950,
    chapterCount: 12,
    category: 'tech',
    categoryName: 'AI科技',
    statusText: '连载中',
    statusType: 'updating',
    isCompleted: false,
    chapters: [
      { id: 'ch-ait-1', columnId: 'col-ai-trend', title: '【前沿模型】GPT-5 预期与 Reasoning 模型演进', isNew: true, duration: '20分钟', isFreeTrial: true },
      { id: 'ch-ait-2', columnId: 'col-ai-trend', title: '【开源生态】Llama 3 与开源大模型商用落地边界', isNew: true, duration: '18分钟', isFreeTrial: false },
      { id: 'ch-ait-3', columnId: 'col-ai-trend', title: '【具身智能】人形机器人与端到端运动控制落地进展', isNew: true, duration: '25分钟', isFreeTrial: false },
      { id: 'ch-ait-4', columnId: 'col-ai-trend', title: '【自动驾驶】端到端大模型量产落地与算力竞赛', isNew: false, duration: '22分钟', isFreeTrial: false },
      { id: 'ch-ait-5', columnId: 'col-ai-trend', title: '【端侧AI】AI PC、AI 手机出货渗透率预测', isNew: false, duration: '17分钟', isFreeTrial: false },
      { id: 'ch-ait-6', columnId: 'col-ai-trend', title: '【企业级Agent】Multi-Agent 协作架构开发实践', isNew: false, duration: '24分钟', isFreeTrial: false },
      { id: 'ch-ait-7', columnId: 'col-ai-trend', title: '【数据资产】高质量合成数据与版权博弈', isNew: false, duration: '16分钟', isFreeTrial: false },
      { id: 'ch-ait-8', columnId: 'col-ai-trend', title: '【安全合规】AI 伦理、幻觉抑制与监管红线', isNew: false, duration: '19分钟', isFreeTrial: false },
      { id: 'ch-ait-9', columnId: 'col-ai-trend', title: '【视频生成】Sora 级文生视频架构与算力消耗', isNew: false, duration: '21分钟', isFreeTrial: false },
      { id: 'ch-ait-10', columnId: 'col-ai-trend', title: '【长文本推理】百万上下文窗口的极限与成本考量', isNew: false, duration: '15分钟', isFreeTrial: false },
      { id: 'ch-ait-11', columnId: 'col-ai-trend', title: '【多模态融合】全双工实时语音与多模态交互革命', isNew: false, duration: '23分钟', isFreeTrial: false },
      { id: 'ch-ait-12', columnId: 'col-ai-trend', title: '【未来展望】AGI 临界点投资机会与潜在冲击', isNew: false, duration: '30分钟', isFreeTrial: false }
    ]
  },
  {
    id: 'col-macro-asset',
    title: '「全球大类资产配置」方法论',
    subtitle: '穿透经济周期，构建跨市场全天候稳健收益底仓',
    cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80',
    author: '老林说宏观',
    authorTitle: '星主',
    authorAvatar: '/static/avatar_mark.png',
    price: 499,
    originPrice: 899,
    subscriberCount: 2680,
    chapterCount: 6,
    category: 'asset',
    categoryName: '大类资产',
    statusText: '已完结',
    statusType: 'completed',
    isCompleted: true,
    chapters: [
      { id: 'ch-ma-1', columnId: 'col-macro-asset', title: '【全天候框架】桥水全天候策略的现代化改良实践', isNew: true, duration: '25分钟', isFreeTrial: true },
      { id: 'ch-ma-2', columnId: 'col-macro-asset', title: '【美债收益率】从降息周期到期限溢价重构', isNew: true, duration: '20分钟', isFreeTrial: false },
      { id: 'ch-ma-3', columnId: 'col-macro-asset', title: '【大宗商品】黄金、原油与逆全球化避险资产锚', isNew: false, duration: '22分钟', isFreeTrial: false },
      { id: 'ch-ma-4', columnId: 'col-macro-asset', title: '【汇率波动】美元指数与全球离岸流动性再平衡', isNew: false, duration: '18分钟', isFreeTrial: false },
      { id: 'ch-ma-5', columnId: 'col-macro-asset', title: '【抗通胀资产】抗通胀债券 TIPS 与高息公用事业股', isNew: false, duration: '19分钟', isFreeTrial: false },
      { id: 'ch-ma-6', columnId: 'col-macro-asset', title: '【资产再平衡】动态风险预算与仓位回撤控制纪律', isNew: false, duration: '27分钟', isFreeTrial: false }
    ]
  },
  {
    id: 'col-dividend-defense',
    title: '「红利低波与防御底仓」实战',
    subtitle: '静水流深，以确定性真实股息现金流筑牢组合安全垫',
    cover: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=80',
    author: '老林说宏观',
    authorTitle: '星主',
    authorAvatar: '/static/avatar_mark.png',
    price: 299,
    originPrice: 599,
    subscriberCount: 3120,
    chapterCount: 5,
    category: 'asset',
    categoryName: '大类资产',
    statusText: '更新中',
    statusType: 'updating',
    isCompleted: false,
    chapters: [
      { id: 'ch-div-1', columnId: 'col-dividend-defense', title: '【现金流护城河】自由现金流收益率与持续分红能力', isNew: true, duration: '22分钟', isFreeTrial: true },
      { id: 'ch-div-2', columnId: 'col-dividend-defense', title: '【估值安全边际】股息率利差模型与买入时钟', isNew: true, duration: '19分钟', isFreeTrial: false },
      { id: 'ch-div-3', columnId: 'col-dividend-defense', title: '【中特估重塑】央国企市值管理与分红预期指引', isNew: false, duration: '21分钟', isFreeTrial: false },
      { id: 'ch-div-4', columnId: 'col-dividend-defense', title: '【公用事业与电力】长周期低波动的防御逻辑', isNew: false, duration: '18分钟', isFreeTrial: false },
      { id: 'ch-div-5', columnId: 'col-dividend-defense', title: '【组合攻守道】高股息底仓 + 成长进攻的哑铃配置', isNew: false, duration: '25分钟', isFreeTrial: false }
    ]
  },
  {
    id: 'col-trade-discipline',
    title: '「买方交易纪律与风控」手册',
    subtitle: '顶级交易员心法：如何在高不确定性市场中长期立于不败之地',
    cover: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=500&auto=format&fit=crop&q=80',
    author: 'Rich',
    authorTitle: '美股宏观对冲资深合伙人',
    authorAvatar: '/static/avatar_rich.png',
    price: 399,
    originPrice: 799,
    subscriberCount: 2210,
    chapterCount: 6,
    category: 'strategy',
    categoryName: '交易实战',
    statusText: '已完结',
    statusType: 'completed',
    isCompleted: true,
    chapters: [
      { id: 'ch-td-1', columnId: 'col-trade-discipline', title: '【止损与仓位】第一原则：在市场中长期活下去', isNew: true, duration: '24分钟', isFreeTrial: true },
      { id: 'ch-td-2', columnId: 'col-trade-discipline', title: '【预期差捕捉】寻找市场一致预期背后的盲点', isNew: true, duration: '20分钟', isFreeTrial: false },
      { id: 'ch-td-3', columnId: 'col-trade-discipline', title: '【左侧与右侧】左侧分批建仓与右侧顺势突破实操', isNew: false, duration: '22分钟', isFreeTrial: false },
      { id: 'ch-td-4', columnId: 'col-trade-discipline', title: '【情绪量化】市场极度恐慌与贪婪的逆向交易法则', isNew: false, duration: '18分钟', isFreeTrial: false },
      { id: 'ch-td-5', columnId: 'col-trade-discipline', title: '【复盘日记】顶级买方对冲基金经理的日常复盘模板', isNew: false, duration: '26分钟', isFreeTrial: false },
      { id: 'ch-td-6', columnId: 'col-trade-discipline', title: '【心性修炼】克服 FOMO 焦虑与执行纪律的哲学', isNew: false, duration: '30分钟', isFreeTrial: false }
    ]
  },
  {
    id: 'col-liquidity-deriv',
    title: '「港美股流动性与衍生品」穿透',
    subtitle: '看懂期权波动率、做市商伽马暴击与离岸做空生态',
    cover: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=500&auto=format&fit=crop&q=80',
    author: 'Rich',
    authorTitle: '美股宏观对冲资深合伙人',
    authorAvatar: '/static/avatar_rich.png',
    price: 499,
    originPrice: 999,
    subscriberCount: 1780,
    chapterCount: 8,
    category: 'strategy',
    categoryName: '交易实战',
    statusText: '更新中',
    statusType: 'updating',
    isCompleted: false,
    chapters: [
      { id: 'ch-ld-1', columnId: 'col-liquidity-deriv', title: '【期权基础】看涨/看跌期权买方与卖方非对称收益', isNew: true, duration: '23分钟', isFreeTrial: true },
      { id: 'ch-ld-2', columnId: 'col-liquidity-deriv', title: '【波动率交易】VIX 恐慌指数与隐含波动率套利', isNew: true, duration: '25分钟', isFreeTrial: false },
      { id: 'ch-ld-3', columnId: 'col-liquidity-deriv', title: '【对冲策略】领口策略（Collar）保护现货底仓', isNew: false, duration: '20分钟', isFreeTrial: false },
      { id: 'ch-ld-4', columnId: 'col-liquidity-deriv', title: '【备兑开仓】Covered Call 增强长期持仓收益', isNew: false, duration: '19分钟', isFreeTrial: false },
      { id: 'ch-ld-5', columnId: 'col-liquidity-deriv', title: '【末日轮风险】0DTE 零日到期期权对大盘日内波动的放大效应', isNew: false, duration: '22分钟', isFreeTrial: false },
      { id: 'ch-ld-6', columnId: 'col-liquidity-deriv', title: '【港股打新】暗盘机制、基石投资者与破发防范', isNew: false, duration: '18分钟', isFreeTrial: false },
      { id: 'ch-ld-7', columnId: 'col-liquidity-deriv', title: '【南向资金】港股通南向资金净流入与定价权转移', isNew: false, duration: '21分钟', isFreeTrial: false },
      { id: 'ch-ld-8', columnId: 'col-liquidity-deriv', title: '【融资融券】杠杆成本计算与强平风险防范红线', isNew: false, duration: '24分钟', isFreeTrial: false }
    ]
  },
  {
    id: 'col-financial-audit',
    title: '「财报粉饰识别与排雷」指南',
    subtitle: '穿透财务魔术：现金流造假、存货异常与商誉减值黑天鹅识别',
    cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80',
    author: '老林说宏观',
    authorTitle: '星主',
    authorAvatar: '/static/avatar_mark.png',
    price: 399,
    originPrice: 699,
    subscriberCount: 2040,
    chapterCount: 4,
    category: 'strategy',
    categoryName: '交易实战',
    statusText: '已完结',
    statusType: 'completed',
    isCompleted: true,
    chapters: [
      { id: 'ch-fa-1', columnId: 'col-financial-audit', title: '【收入真实性】应收账款周转率与存货暴增异常预警', isNew: true, duration: '22分钟', isFreeTrial: true },
      { id: 'ch-fa-2', columnId: 'col-financial-audit', title: '【现金流核查】经营性现金流与净利润背离排雷法', isNew: false, duration: '20分钟', isFreeTrial: false },
      { id: 'ch-fa-3', columnId: 'col-financial-audit', title: '【商誉减值】高溢价并购隐患与大额减值时间窗口', isNew: false, duration: '18分钟', isFreeTrial: false },
      { id: 'ch-fa-4', columnId: 'col-financial-audit', title: '【关联交易】隐藏负债、表外实体与资金占用穿透', isNew: false, duration: '24分钟', isFreeTrial: false }
    ]
  },
  {
    id: 'col-business-cycle',
    title: '「商业周期与估值锚」复盘',
    subtitle: '以史为鉴：从康波周期、朱格拉周期到终局估值体系的建立',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    author: '老林说宏观',
    authorTitle: '星主',
    authorAvatar: '/static/avatar_mark.png',
    price: 399,
    originPrice: 799,
    subscriberCount: 1890,
    chapterCount: 4,
    category: 'macro',
    categoryName: '宏观美股',
    statusText: '已完结',
    statusType: 'completed',
    isCompleted: true,
    chapters: [
      { id: 'ch-bc-1', columnId: 'col-business-cycle', title: '【朱格拉周期】设备投资更新周期的宏观规律', isNew: true, duration: '21分钟', isFreeTrial: true },
      { id: 'ch-bc-2', columnId: 'col-business-cycle', title: '【基钦库存周期】主动补库与被动去库的拐点量化', isNew: false, duration: '19分钟', isFreeTrial: false },
      { id: 'ch-bc-3', columnId: 'col-business-cycle', title: '【康波长波】技术革命驱动的半世纪经济长周期', isNew: false, duration: '25分钟', isFreeTrial: false },
      { id: 'ch-bc-4', columnId: 'col-business-cycle', title: '【终局估值锚】逆周期买入与顺周期兑现的艺术', isNew: false, duration: '28分钟', isFreeTrial: false }
    ]
  }
];

// 初始帖子列表
export const initialPostsMock = [
  {
    id: 'post-1',
    author: {
      id: 'u-founder',
      name: '老林说宏观',
      avatar: '/static/avatar_mark.png',
      role: 'founder',
      roleTitle: '星主'
    },
    isPinned: true,
    title: '全球降息大周期启动：为什么防御性红利资产仍然是压舱石？',
    content: `随着美联储与主要经济体进入货币政策转向窗口期，近期许多星友都在问：降息来了，是不是应该一把梭哈弹性最大的进攻品种？

我的建议依然是：财不外露，静水流深。

宏观周期的第一定律是“防守决定下限”。高股息红利标的具备两大核心护城河：
1. **稳定真实的自由现金流**：不是账面利润，而是能实打实每年给股东分红的硬通货；
2. **波动率低、回撤可控**：在外部地缘震荡与经济基本面修复拉锯中，提供丰厚的心态缓冲区。

真正的组合配置，永远不是押注单一方向，而是用红利现金流做底仓，用核心成长博取超额收益。`,
    tags: ['宏观策略', '大类资产配置', '红利低波'],
    images: ['/static/feed_chart.png'],
    attachments: [
      {
        type: 'file',
        name: '2026Q4全球宏观流动性与资产配置研报.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        size: 3420000
      }
    ],
    likes: 328,
    isLiked: false,
    commentsCount: 46,
    sharesCount: 15,
    createdAt: '10分钟前',
    likers: ['老林说宏观', 'Rich', '志诚', '远山求道'],
    likersCount: 328,
    comments: [
      {
        id: 'c-1',
        author: {
          name: 'Rich',
          avatar: '/static/avatar_rich.png',
          role: 'partner'
        },
        content: '非常赞同！防守端立于不败之地，进攻端才有底气拿住筹码。',
        createdAt: '8分钟前',
        likes: 12
      },
      {
        id: 'c-2',
        author: {
          name: '远山求道',
          avatar: '/static/avatar_john.png',
          role: 'vip'
        },
        content: '林总讲透了本质，红利资产就是投资组合里的压舱石！',
        createdAt: '5分钟前',
        likes: 6
      }
    ]
  },
  {
    id: 'post-2',
    author: {
      id: 'u-rich',
      name: 'Rich',
      avatar: '/static/avatar_rich.png',
      role: 'partner',
      roleTitle: '美股资深合伙人'
    },
    questionTarget: '若琪',
    title: '请教若琪：关于大模型端侧部署对芯片封装的长期影响',
    content: `看到你最新的研报中提到手机与PC端侧运行百亿参数模型，想请教一下：在能耗与散热受限的情况下，端侧 NPU 架构升级是否会倒逼先进封装方案加速向消费级渗透？`,
    tags: ['话题研究', 'AI产业'],
    images: [],
    likes: 45,
    isLiked: false,
    commentsCount: 8,
    sharesCount: 3,
    createdAt: '1小时前',
    likers: ['老林说宏观', '志诚'],
    likersCount: 45,
    comments: [
      {
        id: 'c-3',
        author: {
          name: '若琪',
          avatar: '/static/avatar_jerry.png',
          role: 'guest'
        },
        content: 'Rich 好！确实会加速！目前主流厂商正在测试更小尺寸的扇出型封装（Fan-Out），以兼顾散热和低成本。下周直播我重点拆解这部分。',
        createdAt: '40分钟前',
        likes: 15
      }
    ]
  },
  {
    id: 'post-3',
    author: {
      id: 'u-vip-01',
      name: '远山求道',
      avatar: '/static/avatar_john.png',
      role: 'vip',
      roleTitle: '年度会员'
    },
    title: '今日实盘交易追踪与建仓思考',
    content: `根据老林在周报中提示的估值性价比分位数，今天分批买入了港股某高分红公共事业龙头。股息率已经达到 7.2%，且现金流非常充沛，打算按三年周期长期持有吃息。`,
    tags: ['交易追踪', '自由现金流'],
    images: [],
    likes: 29,
    isLiked: false,
    commentsCount: 12,
    sharesCount: 2,
    createdAt: '3小时前',
    likers: ['老林说宏观'],
    likersCount: 29,
    comments: []
  },
  {
    id: 'post-4',
    author: {
      id: 'u-vip-01',
      name: '远山求道',
      avatar: '/static/avatar_john.png',
      role: 'vip',
      roleTitle: '年度会员'
    },
    questionTarget: '老林说宏观',
    title: '请教老林：高股息组合遇到利率上行期该如何应对',
    content: `林总好！我目前的持仓以红利资产为主，近期利率环境有上行迹象，想请教一下：若利率持续上行，高股息策略的相对吸引力会不会被债券分流？是否需要预留一部分仓位做再平衡？`,
    tags: ['配置思考'],
    images: [],
    likes: 18,
    isLiked: false,
    commentsCount: 2,
    sharesCount: 0,
    createdAt: '2小时前',
    likers: ['Rich'],
    likersCount: 18,
    comments: [
      {
        id: 'c-5',
        author: {
          name: '老林说宏观',
          avatar: '/static/avatar_mark.png',
          role: 'founder'
        },
        content: '问得好！利率上行初期红利资产确实会有估值压力，但保险与公用事业这类长久期配置盘反而会加仓。建议保留 8 成红利底仓，2 成做利率敏感行业的轮动，周报里我会展开讲。',
        createdAt: '1小时前',
        likes: 9
      }
    ]
  }
];

// ==================== 线下活动 Mock（与管理后台活动模块字段一致） ====================
// status: 'recruiting' 报名中 | 'ended' 已结束；tickets 票种；regFields 报名信息组件
const actDetailHtml = `
<h2>一、活动议程</h2>
<p>14:00 签到与茶歇；14:30 十月行情复盘与十一月配置策略；15:40 固收+ 实战分享；16:30 理财师现场答疑。</p>
<p><img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=750&h=420&fit=crop" /></p>
<h2>二、嘉宾介绍</h2>
<p>主讲人：老林说宏观，20 年二级市场投研老兵，专注全天候大类资产配置。</p>
<p>特邀嘉宾：稳健老张，20 年固收投资经验，长期管理高净值客户组合。</p>
<h2>三、报名须知</h2>
<p>报名成功后请提前 15 分钟到场签到；活动开始前 24 小时内不支持退款，退款成功后名额自动释放。</p>
`;

const actEndedDetailHtml = `
<h2>一、活动议程</h2>
<p>14:00 签到；14:30 新能源产业链四季度景气度跟踪；15:30 半导体设备国产化进展交流；16:30 圆桌问答。</p>
<h2>二、嘉宾介绍</h2>
<p>主讲人：Mark，资深策略分析师；特邀嘉宾：沈明远，一级市场半导体方向投资人。</p>
<h2>三、报名须知</h2>
<p>本场活动已结束，感谢大家的参与，后续场次请关注星球内公告。</p>
`;

export const activitiesMock = [
  {
    id: 'act-open-01',
    name: '十月投资沙龙·上海站',
    poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=750&h=560&fit=crop',
    startTime: '2026-10-28 14:00',
    endTime: '2026-10-28 17:00',
    location: '上海市浦东新区世纪大道 88 号 金茂大厦 2F 宴会厅',
    signupDeadline: '2026-10-27 18:00',
    status: 'recruiting',
    registered: true,
    registration: {
      orderId: '20261020173500123456',
      payTime: '2026-10-20 17:35',
      amount: 1396,
      refunded: 299,
      attendees: [
        { name: '陈朝峰', phone: '138****6688', ticket: '标准票', price: 299, status: 'ok' },
        { name: '林晓', phone: '139****8899', ticket: '标准票', price: 299, status: 'ok' },
        { name: '周颖', phone: '136****2233', ticket: '嘉宾票', price: 499, status: 'ok' },
        { name: '张同', phone: '158****5511', ticket: '标准票', price: 299, status: 'cancelled' }
      ]
    },
    tickets: [
      { id: 't-std', name: '标准票', price: 299, count: 60, sold: 41, desc: '含全程议程与活动资料' },
      { id: 't-vip', name: '嘉宾票', price: 499, count: 20, sold: 12, desc: '含前排就座、闭门交流与主讲人一对一答疑' }
    ],
    regFields: [
      { id: 'f-name', type: 'name', label: '姓名', required: true, optionsText: '', fixed: true },
      { id: 'f-phone', type: 'phone', label: '手机号', required: true, optionsText: '', fixed: true },
      { id: 'f-industry', type: 'radio', label: '从事行业', required: true, optionsText: '银行/证券,保险,基金/资管,其他' },
      { id: 'f-question', type: 'textarea', label: '想向嘉宾提的问题', required: false, optionsText: '' }
    ],
    detailHtml: actDetailHtml
  },
  {
    id: 'act-open-02',
    name: '十一月宏观策略闭门会·北京站',
    poster: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=750&h=560&fit=crop',
    startTime: '2026-11-15 14:00',
    endTime: '2026-11-15 17:30',
    location: '北京市朝阳区建国门外大街 1 号 国贸大酒店 3F 会议厅',
    signupDeadline: '2026-11-14 18:00',
    status: 'recruiting',
    registered: false,
    tickets: [{ id: 't-std-3', name: '标准票', price: 199, count: 30, sold: 18, desc: '含全程议程与活动资料' }],
    regFields: [
      { id: 'f-name-3', type: 'name', label: '姓名', required: true, optionsText: '', fixed: true },
      { id: 'f-phone-3', type: 'phone', label: '手机号', required: true, optionsText: '', fixed: true }
    ],
    detailHtml: actDetailHtml
  },
  {
    id: 'act-ended-01',
    name: '九月行业分享会·深圳站',
    poster: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=750&h=560&fit=crop',
    startTime: '2026-09-20 14:00',
    endTime: '2026-09-20 17:00',
    location: '深圳市南山区科技园 深圳湾创业广场 B 座 12F',
    signupDeadline: '2026-09-19 18:00',
    status: 'ended',
    registered: false,
    tickets: [{ id: 't-std-2', name: '标准票', price: 199, count: 30, sold: 30, desc: '含全程议程与活动资料' }],
    regFields: [
      { id: 'f-name-2', type: 'name', label: '姓名', required: true, optionsText: '', fixed: true },
      { id: 'f-phone-2', type: 'phone', label: '手机号', required: true, optionsText: '', fixed: true }
    ],
    detailHtml: actEndedDetailHtml
  }
];

// 全局响应式状态
export const appState = reactive({
  // 登录与认证状态（进入星球及打开分享链接均需先登录）
  isLoggedIn: false,
  authMode: 'login', // 'login' | 'register'
  pendingRedirectUrl: '',
  pendingShareFrom: false,

  // 当前视角：'founder' (星主) | 'vip' (会员) | 'guest' (星友)
  currentPerspective: 'founder',
  user: { ...currentUserMock },
  isVipMember: true,
  posts: [...initialPostsMock],
  columns: [...columnsMock],
  members: [...membersMock],
  activeFeedFilter: 'latest', // 'latest' | 'trade_track' | 'market_news' | 'wealth_news' | 'topic_research'
  readArticleIds: ['art-mg-5', 'art-mg-6', 'art-mg-7', 'ch-ai-1-5', 'ch-ai-1-6', 'ch-ai-1-7', 'ch-ai-1-8', 'ch-ma-3', 'ch-ma-4', 'ch-div-3', 'ch-div-4', 'ch-td-3'],
  
  // 弹窗状态
  isVipModalVisible: false,
  isPublishModalVisible: false,
  isMembersModalVisible: false,
  publishModalMode: 'post', // 'post' | 'question'
  publishTargetExpert: '老林说宏观',
  selectedColumnId: 'col-us-stock',
  selectedArticleId: 'art-mg-1',
  
  // 微信/支付宝支付选择
  payChannel: 'wechat', // 'wechat' | 'alipay'
  selectedVipTier: 'annual' // 'annual' | 'lifetime'
});

const MOBILE_AUTH_STORAGE_KEY = 'wealth_circle_mobile_auth_v1';

export const saveAuthSession = () => {
  try {
    const payload = JSON.stringify({
      isLoggedIn: appState.isLoggedIn,
      currentPerspective: appState.currentPerspective,
      isVipMember: appState.isVipMember,
      user: appState.user
    });
    if (typeof uni !== 'undefined' && uni.setStorageSync) {
      uni.setStorageSync(MOBILE_AUTH_STORAGE_KEY, payload);
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MOBILE_AUTH_STORAGE_KEY, payload);
    }
  } catch (e) {
    // ignore storage errors
  }
};

export const restoreAuthSession = () => {
  try {
    let raw = '';
    if (typeof uni !== 'undefined' && uni.getStorageSync) {
      raw = uni.getStorageSync(MOBILE_AUTH_STORAGE_KEY);
    } else if (typeof localStorage !== 'undefined') {
      raw = localStorage.getItem(MOBILE_AUTH_STORAGE_KEY) || '';
    }
    if (raw) {
      const saved = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (typeof saved.isLoggedIn === 'boolean') appState.isLoggedIn = saved.isLoggedIn;
      if (saved.currentPerspective) appState.currentPerspective = saved.currentPerspective;
      if (typeof saved.isVipMember === 'boolean') appState.isVipMember = saved.isVipMember;
      if (saved.user) Object.assign(appState.user, saved.user);
    }
  } catch (e) {
    // ignore corrupted session
  }
};

restoreAuthSession();

// 解析 URL 查询参数工具函数
export const parseUrlPathAndQuery = (rawUrl = '') => {
  if (!rawUrl) return { path: '/pages/feed/index', query: {}, cleanUrl: '/pages/feed/index' };
  let normalized = String(rawUrl).trim();
  if (normalized.startsWith('#')) normalized = normalized.slice(1);
  if (!normalized.startsWith('/')) normalized = '/' + normalized;

  const qIdx = normalized.indexOf('?');
  const path = qIdx > -1 ? normalized.slice(0, qIdx) : normalized;
  const queryString = qIdx > -1 ? normalized.slice(qIdx + 1) : '';
  const query = {};
  if (queryString) {
    queryString.split('&').forEach((pair) => {
      if (!pair) return;
      const [k, v = ''] = pair.split('=');
      if (k) {
        try {
          query[decodeURIComponent(k)] = decodeURIComponent(v);
        } catch {
          query[k] = v;
        }
      }
    });
  }

  // 构建去除临时标记 share=1 后的干净目标地址，避免登录回跳再次触发分享拦截
  const cleanPairs = [];
  Object.keys(query).forEach((k) => {
    if (k !== 'share') {
      cleanPairs.push(`${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`);
    }
  });
  const cleanUrl = cleanPairs.length > 0 ? `${path}?${cleanPairs.join('&')}` : path;
  return { path, query, cleanUrl };
};

// 根据目标路径解析分享内容上下文（用于在登录页展示「来自星友分享」卡片）
export const resolveShareTargetInfo = (rawUrl = '') => {
  const target = rawUrl || appState.pendingRedirectUrl || '';
  if (!target) return null;
  const { path, query, cleanUrl } = parseUrlPathAndQuery(target);

  if (path === '/pages/column/reader') {
    const artId = query.id || query.articleId || appState.selectedArticleId;
    const colId = query.colId || query.columnId || appState.selectedColumnId;
    let foundCol = appState.columns.find((c) => c.id === colId);
    let foundArt = null;
    if (foundCol) {
      foundArt = foundCol.chapters.find((ch) => ch.id === artId);
    }
    if (!foundArt) {
      for (const c of appState.columns) {
        const ch = c.chapters.find((item) => item.id === artId);
        if (ch) {
          foundCol = c;
          foundArt = ch;
          break;
        }
      }
    }
    foundCol = foundCol || appState.columns[0];
    foundArt = foundArt || foundCol.chapters[0];
    return {
      isContentLink: true,
      typeLabel: '专栏深度长文',
      badge: `专栏 · ${foundCol.title}`,
      title: foundArt ? foundArt.title : '专栏核心研报长文',
      author: (foundArt && foundArt.author) || foundCol.author || 'Rich',
      cleanUrl
    };
  }

  if (path === '/pages/feed/detail') {
    const postId = query.id || 'post-1';
    const post = appState.posts.find((p) => p.id === postId) || appState.posts[0];
    return {
      isContentLink: true,
      typeLabel: '星球动态详情',
      badge: `星友动态 · ${post.author.name}`,
      title: post.title || post.content.slice(0, 44) + '...',
      author: post.author.name,
      cleanUrl
    };
  }

  if (path === '/pages/activity/detail') {
    const actId = query.id || 'act-open-01';
    const act = activitiesMock.find((a) => a.id === actId) || activitiesMock[0];
    return {
      isContentLink: true,
      typeLabel: '线下闭门活动',
      badge: `闭门沙龙 · ${act.startTime.split(' ')[0]}`,
      title: act.name,
      author: '老林说宏观 · 财富星球',
      cleanUrl
    };
  }

  if (path === '/pages/column/index' && (query.colId || query.columnId || appState.pendingShareFrom)) {
    const colId = query.colId || query.columnId || 'col-us-stock';
    const col = appState.columns.find((c) => c.id === colId) || appState.columns[0];
    return {
      isContentLink: true,
      typeLabel: '投研专栏合辑',
      badge: `专栏连载 · 共 ${col.chapterCount} 篇`,
      title: `${col.title}：${col.subtitle}`,
      author: col.author,
      cleanUrl
    };
  }

  if (query.invite || appState.pendingShareFrom) {
    return {
      isContentLink: true,
      typeLabel: '星友专属邀请',
      badge: `邀请码 · ${query.invite || 'WP97181206'}`,
      title: '邀请你加入「财不外露」买方视角全球投研星球',
      author: '老林说宏观 & 9位合伙人',
      cleanUrl
    };
  }

  return null;
};

// 计算属性：当前用户是否为 VIP 或 管理员
export const isVipOrAbove = computed(() => {
  return appState.currentPerspective === 'founder' || appState.currentPerspective === 'vip' || appState.isVipMember;
});

// 筛选后的帖子
export const filteredPosts = computed(() => {
  if (appState.activeFeedFilter === 'trade_track') {
    return appState.posts.filter(p => p.tags.some(t => t.includes('交易') || t.includes('现金流') || t.includes('实盘')));
  }
  if (appState.activeFeedFilter === 'market_news') {
    return appState.posts.filter(p => p.tags.some(t => t.includes('宏观') || t.includes('市场')));
  }
  if (appState.activeFeedFilter === 'wealth_news') {
    return appState.posts.filter(p => p.tags.some(t => t.includes('红利') || t.includes('资产') || t.includes('理财')));
  }
  if (appState.activeFeedFilter === 'topic_research') {
    return appState.posts.filter(p => p.tags.some(t => t.includes('话题研究') || t.includes('AI产业') || t.includes('研报')));
  }
  return appState.posts;
});

// 全局交互方法
export const actions = {
  // 切换演示角色
  switchPerspective(role) {
    appState.currentPerspective = role;
    if (role === 'founder') {
      Object.assign(appState.user, currentUserMock);
      appState.isVipMember = true;
      uni.showToast({ title: '已切换至：星主/管理员视角', icon: 'none' });
    } else if (role === 'vip') {
      Object.assign(appState.user, demoVipUserMock);
      appState.isVipMember = true;
      uni.showToast({ title: '已切换至：年度VIP会员视角', icon: 'none' });
    } else {
      Object.assign(appState.user, demoGuestUserMock);
      appState.isVipMember = false;
      uni.showToast({ title: '已切换至：星友视角(未开通会员)', icon: 'none' });
    }
    saveAuthSession();
  },

  // 移动端登录/注册提交（参考 PC 端 AuthModal.vue 逻辑）
  submitAuth({ mode = 'login', phone = '13800008888', nickname = '', role = '' } = {}) {
    const cleanPhone = String(phone || '13800008888').trim();
    appState.isLoggedIn = true;

    if (role === 'founder') {
      appState.currentPerspective = 'founder';
      Object.assign(appState.user, currentUserMock, { phone: cleanPhone || currentUserMock.phone });
      appState.isVipMember = true;
    } else if (role === 'vip') {
      appState.currentPerspective = 'vip';
      Object.assign(appState.user, demoVipUserMock, { phone: cleanPhone || demoVipUserMock.phone });
      appState.isVipMember = true;
    } else if (role === 'guest') {
      appState.currentPerspective = 'guest';
      Object.assign(appState.user, demoGuestUserMock, { phone: cleanPhone || demoGuestUserMock.phone });
      appState.isVipMember = false;
    } else if (mode === 'register') {
      // 新注册用户：初始化星友档案（对齐 PC 端 submitAuth）
      const tail = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : '8888';
      appState.currentPerspective = 'guest';
      appState.isVipMember = false;
      appState.user = {
        id: 'u-reg-' + Date.now().toString().slice(-4),
        name: (nickname && nickname.trim()) || `新晋星友_${tail}`,
        avatar: '/static/avatar_user.jpg',
        role: 'guest',
        roleTitle: '已注册 (未开通VIP)',
        bio: '新加入「财不外露」星球，正在开启资产配置进阶之旅。',
        joinedAt: new Date().toISOString().split('T')[0],
        joinedDays: '1 天',
        vipExpireAt: '未开通',
        phone: cleanPhone,
        followingCount: 0,
        followersCount: 0,
        points: 50
      };
    } else {
      // 登录模式：根据手机号智能匹配或保持星主/会员账号
      if (cleanPhone === '15966667777') {
        appState.currentPerspective = 'guest';
        Object.assign(appState.user, demoGuestUserMock, { phone: cleanPhone });
        appState.isVipMember = false;
      } else if (cleanPhone === '13812345678') {
        appState.currentPerspective = 'vip';
        Object.assign(appState.user, demoVipUserMock, { phone: cleanPhone });
        appState.isVipMember = true;
      } else {
        appState.currentPerspective = 'founder';
        Object.assign(appState.user, currentUserMock, { phone: cleanPhone });
        appState.isVipMember = true;
      }
    }

    saveAuthSession();
  },

  // 登录/注册成功后跳转到目标页面（支持回跳分享的内容详情页或星球主页）
  navigateAfterAuth(redirectOverride = '') {
    const rawTarget = redirectOverride || appState.pendingRedirectUrl || '/pages/feed/index';
    const { path, query, cleanUrl } = parseUrlPathAndQuery(rawTarget);

    appState.pendingRedirectUrl = '';
    appState.pendingShareFrom = false;

    const tabBarPaths = ['/pages/feed/index', '/pages/column/index', '/pages/profile/index'];
    if (tabBarPaths.includes(path)) {
      if (path === '/pages/column/index' && (query.colId || query.columnId)) {
        appState.selectedColumnId = query.colId || query.columnId;
      }
      uni.switchTab({
        url: path,
        fail: () => {
          uni.reLaunch({ url: path });
        }
      });
      return;
    }

    if (path === '/pages/auth/index') {
      uni.switchTab({ url: '/pages/feed/index' });
      return;
    }

    // 非 TabBar 页面（如分享的长文阅读页、动态详情页、活动详情页）
    uni.reLaunch({
      url: cleanUrl,
      fail: () => {
        uni.switchTab({ url: '/pages/feed/index' });
      }
    });
  },

  // 退出登录并跳转到移动端注册/登录页
  logout(redirectUrl = '/pages/feed/index', fromShare = false) {
    appState.isLoggedIn = false;
    appState.pendingRedirectUrl = redirectUrl || '/pages/feed/index';
    appState.pendingShareFrom = !!fromShare;
    saveAuthSession();
    const encoded = encodeURIComponent(appState.pendingRedirectUrl);
    const shareParam = fromShare ? '&from=share' : '';
    uni.reLaunch({
      url: `/pages/auth/index?redirect=${encoded}${shareParam}`
    });
  },

  // 模拟打开分享链接（触发未登录拦截 -> 登录页展示分享卡片 -> 登录后直达该分享内容）
  openShareLinkWithAuthGate(targetUrl) {
    const { cleanUrl } = parseUrlPathAndQuery(targetUrl);
    actions.logout(cleanUrl, true);
  },

  // 全局路由登录守卫：进入星球或通过分享链接打开均需先登录
  enforceAuthGuard(rawUrlHint = '') {
    let currentHashUrl = rawUrlHint;
    if (!currentHashUrl && typeof window !== 'undefined' && window.location) {
      const hash = window.location.hash || '';
      currentHashUrl = hash.startsWith('#') ? hash.slice(1) : hash;
    }
    if (!currentHashUrl || currentHashUrl === '/') {
      currentHashUrl = '/pages/feed/index';
    }

    const { path, query, cleanUrl } = parseUrlPathAndQuery(currentHashUrl);

    // 已经在登录页则放行
    if (path === '/pages/auth/index') {
      return true;
    }

    // 协议/隐私政策阅读页对未登录用户开放（登录页条款链接可直接查看）
    if (path === '/pages/agreement/index') {
      return true;
    }

    // 若 URL 带有 share=1 参数（表示从外部点击分享链接进入），要求先经过登录验证并在回跳地址中剥离 share=1
    const isExplicitShareLink = query.share === '1' || query.from === 'share';
    if (isExplicitShareLink) {
      appState.isLoggedIn = false;
      appState.pendingRedirectUrl = cleanUrl;
      appState.pendingShareFrom = true;
      saveAuthSession();
      uni.reLaunch({
        url: `/pages/auth/index?redirect=${encodeURIComponent(cleanUrl)}&from=share`
      });
      return false;
    }

    // 未登录状态下访问星球任何页面或分享深链，均拦截跳转至登录页
    if (!appState.isLoggedIn) {
      const isDeepContent =
        path === '/pages/column/reader' ||
        path === '/pages/feed/detail' ||
        path === '/pages/activity/detail' ||
        Boolean(query.colId || query.columnId || query.invite);
      appState.pendingRedirectUrl = cleanUrl;
      appState.pendingShareFrom = isDeepContent;
      const shareFlag = isDeepContent ? '&from=share' : '';
      uni.reLaunch({
        url: `/pages/auth/index?redirect=${encodeURIComponent(cleanUrl)}${shareFlag}`
      });
      return false;
    }

    return true;
  },

  // 检查 VIP 权限，未通过则弹窗
  checkVipPermission(hint = '该功能为会员专享，请开通会员后体验') {
    if (isVipOrAbove.value) {
      return true;
    }
    uni.showToast({ title: hint, icon: 'none' });
    appState.isVipModalVisible = true;
    return false;
  },

  setFeedFilter(filter) {
    appState.activeFeedFilter = filter;
  },

  openMembersModal() {
    appState.isMembersModalVisible = true;
  },

  closeMembersModal() {
    appState.isMembersModalVisible = false;
  },

  // 点赞/取消点赞
  toggleLikePost(postId) {
    const post = appState.posts.find(p => p.id === postId);
    if (!post) return;
    post.isLiked = !post.isLiked;
    if (post.isLiked) {
      post.likes += 1;
      if (!post.likers.includes(appState.user.name)) {
        post.likers.unshift(appState.user.name);
      }
      uni.showToast({ title: '点赞成功', icon: 'none' });
    } else {
      post.likes = Math.max(0, post.likes - 1);
      const idx = post.likers.indexOf(appState.user.name);
      if (idx > -1) post.likers.splice(idx, 1);
    }
  },

  // 新增评论（支持回复指定评论：挂到父评论的 replies 楼中楼列表）
  addComment(postId, content, replyTarget, images) {
    if (!actions.checkVipPermission('评论功能为会员专享，开通会员立即参与讨论')) return false;
    const post = appState.posts.find(p => p.id === postId);
    if (!post) return false;
    const newComment = {
      id: 'c-' + Date.now(),
      author: {
        name: appState.user.name,
        avatar: appState.user.avatar,
        role: appState.user.role
      },
      content: content.trim(),
      createdAt: '刚刚',
      likes: 0
    };

    // 回复评论：挂到父评论的 replies 楼中楼列表
    if (replyTarget && replyTarget.parentId) {
      const parent = post.comments.find(c => c.id === replyTarget.parentId);
      if (parent) {
        newComment.replyToName = replyTarget.name;
        if (images && images.length) newComment.images = [...images];
        if (!parent.replies) parent.replies = [];
        parent.replies.push(newComment);
        uni.showToast({ title: '回复已发表', icon: 'success' });
        return true;
      }
    }

    post.comments.unshift(newComment);
    post.commentsCount += 1;
    uni.showToast({ title: '评论已发表', icon: 'success' });
    return true;
  },

  // 发帖/提问
  publishPost(postData) {
    if (!actions.checkVipPermission('发帖/提问为会员专享，开通会员即可与星友互动')) return false;
    const newPost = {
      id: 'post-' + Date.now(),
      author: {
        id: appState.user.id,
        name: appState.user.name,
        avatar: appState.user.avatar,
        role: appState.user.role,
        roleTitle: appState.user.roleTitle
      },
      title: postData.title || '',
      questionTarget: postData.questionTarget || '',
      content: postData.content,
      tags: postData.tags || ['话题研究'],
      images: postData.images || [],
      attachments: [],
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: '刚刚',
      likers: [appState.user.name],
      likersCount: 1,
      comments: []
    };
    appState.posts.unshift(newPost);
    appState.isPublishModalVisible = false;
    uni.showToast({ title: '发布成功', icon: 'success' });
    return true;
  },

  // 专栏长文标记已读
  markArticleRead(articleId) {
    if (!appState.readArticleIds.includes(articleId)) {
      appState.readArticleIds.push(articleId);
    }
  },

  // 专栏长文点赞
  toggleLikeArticle(articleId) {
    for (const col of appState.columns) {
      const art = col.chapters.find(c => c.id === articleId);
      if (art) {
        art.isLiked = !art.isLiked;
        if (!art.likers) {
          art.likers = ['Rich', '远山求道', 'Mark'];
        }
        if (art.likes === undefined) {
          art.likes = 42;
        }
        if (art.isLiked) {
          art.likes += 1;
          if (!art.likers.includes(appState.user.name)) {
            art.likers.unshift(appState.user.name);
          }
          uni.showToast({ title: '点赞成功', icon: 'none' });
        } else {
          art.likes = Math.max(0, art.likes - 1);
          const idx = art.likers.indexOf(appState.user.name);
          if (idx > -1) art.likers.splice(idx, 1);
          uni.showToast({ title: '已取消点赞', icon: 'none' });
        }
        break;
      }
    }
  },

  // 专栏长文新增评论
  addArticleComment(articleId, content, replyTarget, images) {
    if (!actions.checkVipPermission('评论功能为会员专享，开通会员立即参与讨论')) return false;
    for (const col of appState.columns) {
      const art = col.chapters.find(c => c.id === articleId);
      if (art) {
        if (!art.comments) {
          art.comments = [
            {
              id: 'c-default-1',
              author: { name: '远山求道', avatar: '/static/avatar_john.png', role: 'vip' },
              content: '实盘量化信号穿透非常清晰，对宏观调仓很有启发！',
              createdAt: '昨天 15:30',
              likes: 6
            },
            {
              id: 'c-default-2',
              author: { name: 'Jerry', avatar: '/static/avatar_jerry.png', role: 'guest' },
              content: '请教星主，在宏观流动性阶段性收紧时，如何把握买入窗口？',
              createdAt: '前天 18:20',
              likes: 3
            }
          ];
        }
        const newComment = {
          id: 'c-art-' + Date.now(),
          author: {
            name: appState.user.name,
            avatar: appState.user.avatar,
            role: appState.user.role
          },
          content: content.trim(),
          createdAt: '刚刚',
          likes: 0
        };

        // 回复评论：挂到父评论的 replies 楼中楼列表
        if (replyTarget && replyTarget.parentId) {
          const parent = art.comments.find(c => c.id === replyTarget.parentId);
          if (parent) {
            newComment.replyToName = replyTarget.name;
            if (images && images.length) newComment.images = [...images];
            if (!parent.replies) parent.replies = [];
            parent.replies.push(newComment);
            uni.showToast({ title: '回复已发表', icon: 'success' });
            return true;
          }
        }

        art.comments.unshift(newComment);
        uni.showToast({ title: '评论已发表', icon: 'success' });
        return true;
      }
    }
    return false;
  },

  // 开通会员/支付
  completeVipPayment() {
    appState.isVipMember = true;
    appState.currentPerspective = 'vip';
    appState.user.role = 'vip';
    appState.user.roleTitle = appState.selectedVipTier === 'lifetime' ? '终身创始合伙人' : '年度会员';
    appState.user.vipExpireAt = appState.selectedVipTier === 'lifetime' ? '终身有效' : '2027-10-16';
    appState.isVipModalVisible = false;
    saveAuthSession();
    uni.showToast({ title: '🎉 恭喜开通成功！已解锁全站特权', icon: 'success' });
  }
};
