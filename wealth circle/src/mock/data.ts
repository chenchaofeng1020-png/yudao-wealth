import { User, Post, Column, Course, LiveSession, MemberRecord, TencentMeetingRecord } from '../types';
import avatarMark from '@/assets/avatar_mark.png';
import avatarRich from '@/assets/avatar_rich.png';
import avatarJohn from '@/assets/avatar_john.png';
import avatarJerry from '@/assets/avatar_jerry.png';
import feedChart from '@/assets/feed_chart.png';

// ===== 分类数据（与管理端「分类设置」同一数据源：一级 + 二级） =====
export interface CategoryNode {
  name: string;
  children: string[];
}

export const CATEGORIES: CategoryNode[] = [
  { name: '交易追踪', children: ['VIP专属', '底仓标的', '自由现金流'] },
  { name: '市场资讯', children: ['市场资讯', '宏观市场', '机构观点'] },
  { name: '理财资讯', children: ['财报分析', '干货教学', '现金流'] },
  { name: '话题研究', children: ['宏观策略', '大类资产配置', '红利低波'] }
];

export const pinnedNoticesMock = [
  {
    id: 'pin-1',
    text: '【📣9.17会员直播｜加息如期兑现，AI放缓如期放鸽】本期直播将为大家带来：• 近期市况点评与分析 • 宏...'
  },
  {
    id: 'pin-2',
    text: '「图片」【🧧新人必看】点击链接了解→ 🔗【财不外露】知识星球全景介绍 → 🔗【财不外露】星球新手使...'
  },
  {
    id: 'pin-3',
    text: '「图片」【🌟财不外露星球组合】 📌 组合完整介绍：点击查看→ 🔗【星球组合】财不外露星球组合全拆解...'
  }
];

export const currentUserMock: User = {
  id: 'u-founder',
  name: '老林说宏观',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'founder',
  roleTitle: '星主 / 资深宏观对冲基金经理',
  bio: '20年二级市场投研老兵，专注全天候大类资产配置与高安全边际投资。财不外露，静水流深。',
  joinedAt: '2024-01-01',
  vipExpireAt: '2099-12-31',
  phone: '13901390139',
  followingCount: 18,
  followersCount: 14280,
  points: 8640,
};

export const demoVipUserMock: User = {
  id: 'u-vip-01',
  name: '远山求道',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  role: 'vip',
  roleTitle: '年度白金会员',
  bio: '实体创业者，长期价值定投践行者，在不确定性中寻找确定性复利。',
  joinedAt: '2024-03-15',
  vipExpireAt: '2027-03-15',
  phone: '13812345678',
  followingCount: 35,
  followersCount: 129,
  points: 1250,
};

export const demoGuestUserMock: User = {
  id: 'u-guest-01',
  name: '新晋星友_8888',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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

// 会员权益文案（与需求文档 3.1 权益文案表一致，供介绍页/开通弹窗/个人中心复用）
export const membershipBenefits = [
  {
    name: '交易追踪',
    desc: '聚焦港美股重点个股，跟踪基本面、预期与资金风向，辅助识别阶段性机会。',
    tags: ['个股资讯', '公司财报', '机构持仓'],
  },
  {
    name: '市场资讯',
    desc: '聚焦宏观环境、政策变化、机构观点与市场主线，理解资产价格核心逻辑。',
    tags: ['机构观点', '宏观市场', '宏观周报'],
  },
  {
    name: '理财资讯',
    desc: '围绕基金、债券、港股打新、结构化产品等资产，拆解收益来源与风险边界。',
    tags: ['港股打新', '基金组合', '债券优选'],
  },
  {
    name: '话题研究',
    desc: '每周深度解析财经热点、产业周期、宏观趋势、金融产品与投资方法论，形成系统投资认知。',
    tags: [],
  },
  {
    name: '会员直播',
    desc: '每周会员直播，复盘市场行情、解析宏观主线、板块机会、重点个股，分享配置思路与重点机会。',
    tags: [],
  },
  {
    name: '星球专栏',
    desc: '系统梳理经济、金融、投资、理财与资产配置知识，搭建从基础认知到实战应用的投资理财框架。',
    tags: [],
  },
];

export const initialPostsMock: Post[] = [
  {
    id: 'post-pin-1',
    author: {
      id: 'u-founder',
      name: '老林说宏观',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'founder',
      roleTitle: '星主',
    },
    isPinned: true,
    isVipOnly: false,
    title: '【📣9.17会员直播｜加息如期兑现，AI放缓如期放鸽】',
    content: `本期直播将为大家带来：\n• 近期市况点评与分析\n• 宏观主线推演与板块机会梳理\n• 会员问答环节\n\n加息如期兑现、AI行情放缓如期放鸽，本期直播深度复盘这两个关键判断对大类资产配置的影响。周二晚 8 点直播间见，会员可提前在“学习专区”提交问题。`,
    tags: ['宏观策略', '大类资产配置'],
    likes: 156,
    isLiked: false,
    commentsCount: 24,
    sharesCount: 11,
    createdAt: '2026-09-17 09:30',
    likers: ['远山求道', '稳健老张', '理财小周'],
    likersCount: 156,
    comments: [
      {
        id: 'c-pin-1',
        author: {
          name: '理财小周',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          role: 'member',
        },
        content: '已经设置好日历提醒了，周二晚上准时蹲直播！',
        createdAt: '2026-09-17 10:12',
        likes: 8,
      }
    ]
  },
  {
    id: 'post-pin-2',
    author: {
      id: 'u-founder',
      name: '老林说宏观',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'founder',
      roleTitle: '星主',
    },
    isPinned: true,
    isVipOnly: false,
    title: '【🧧新人必看】财不外露星球全景介绍与新手使用指南',
    content: `欢迎加入财不外露星球！本帖为你梳理：\n• 星球板块全景介绍：资讯、专栏、直播、课程四大板块怎么用\n• 新手三步上手指南：从关注话题到参与讨论\n• 常见问题解答\n\n延伸阅读：🔗【财不外露】知识星球全景介绍 → 🔗【财不外露】星球新手使用指南`,
    tags: ['干货教学'],
    likes: 208,
    isLiked: false,
    commentsCount: 31,
    sharesCount: 26,
    createdAt: '2026-09-10 10:00',
    likers: ['苏若曦', '林晨', '张启明'],
    likersCount: 208,
    comments: [
      {
        id: 'c-pin-2',
        author: {
          name: '资产配置小陈',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          role: 'member',
        },
        content: '新人报到，指南非常清晰，看完对星球结构一目了然。',
        createdAt: '2026-09-10 12:40',
        likes: 11,
      }
    ]
  },
  {
    id: 'post-pin-3',
    author: {
      id: 'u-founder',
      name: '老林说宏观',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'founder',
      roleTitle: '星主',
    },
    isPinned: true,
    isVipOnly: false,
    title: '【🌟财不外露星球组合】组合策略全拆解',
    content: `组合完整介绍：点击查看→ 🔗【星球组合】财不外露星球组合全拆解\n\n本文拆解星球组合的底层逻辑：持仓结构、调仓纪律与历史收益归因，帮助你理解每一个仓位背后的思考。组合以自由现金流资产为底仓、科技成长为弹性、海外宽基做分散，按 4:3:3 的框架动态再平衡。`,
    tags: ['大类资产配置', '红利低波'],
    likes: 187,
    isLiked: false,
    commentsCount: 22,
    sharesCount: 17,
    createdAt: '2026-09-08 15:30',
    likers: ['静水流深', '秋单', '盒儿云'],
    likersCount: 187,
    comments: [
      {
        id: 'c-pin-3',
        author: {
          name: '稳健老张',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          role: 'vip',
        },
        content: '组合拆解逻辑清晰，跟着框架做再平衡心里有底多了。',
        createdAt: '2026-09-08 18:05',
        likes: 9,
      }
    ]
  },
  {
    id: 'post-mark',
    author: {
      id: 'u-mark',
      name: 'Mark',
      avatar: avatarMark,
      role: 'vip',
      roleTitle: '资深策略分析师',
    },
    isPinned: false,
    isVipOnly: false,
    title: '美国消费大超预期，经济韧性十足',
    content: `美国8月零售销售环比增长 1.2%，明显高于市场预期的0.8%，7月则由下降0.6%修正为下降0.5%。更重要的是，用于 GDP核算的“控制组”零售销售环比增长 1.4%，创2024年9月以来最大增幅，远高于预期的0.4%。\n\n消费增长也较为广泛：线上销售增长2.6%，电子产品增长1.6%，餐饮消费增长1.2%。虽然汽油价格上涨推动加油站销售增长3.1%，但剔除汽油后，整体零售销售仍增长1.1%。`,
    tags: ['市场资讯', '宏观市场'],
    likes: 31,
    isLiked: false,
    commentsCount: 19,
    sharesCount: 8,
    createdAt: '2026-09-17 16:42',
    likers: ['SYY', '不要辣椒', '玉面飞龙', 'melody', 'Star', '一v莉', 'Abb', '秋单', '盒儿云', '彬彬'],
    likersCount: 31,
    featuredComment: {
      id: 'fc-mark',
      author: {
        name: 'Mark',
        role: 'vip',
      },
      content: '“控制组”零售销售，指的是剔除汽车、汽油、建材和餐饮后，美国居民更真实、更稳定的零售销售。',
      createdAt: '2026-09-17 17:28',
      likes: 5,
      isLiked: false,
    },
    comments: [
      {
        id: 'c-mark-1',
        author: {
          name: '稳健老张',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          role: 'vip',
        },
        content: '数据拉长到百年维度的视角太有启发了，不能刻舟求剑！',
        createdAt: '1小时前',
        likes: 14,
      }
    ]
  },
  {
    id: 'post-1',
    author: {
      id: 'u-founder',
      name: '老林说宏观',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'founder',
      roleTitle: '星主',
      badge: '主理人置顶',
    },
    isPinned: true,
    isVipOnly: false,
    title: '【老林深度】全球降息大周期启动：为什么防御性红利资产仍然是压舱石？',
    content: `随着海外宏观流动性拐点确立，国内市场资金对于“确定性股息现金流”的偏好没有发生根本逆转。\n\n很多星友在问：弹性成长股起来了，红利低波还要不要留？\n我的核心结论是：**任何时候都不要清空你的底仓压舱石**。进攻靠认知，防守靠纪律。建议按照 4:3:3 仓位模型分布（高股息类现金流资产 40%，出海及核心科技资产 30%，海外宽基与流动性储备 30%）。\n\n展开说说 4:3:3 模型的内在逻辑：40% 的高股息现金流资产是家庭资产负债表的“压舱石”，它的作用不是进攻，而是在市场剧烈波动时提供持续的现金流与心态稳定器；30% 的出海及核心科技资产负责捕捉结构性成长机会，这部分要敢于在恐慌中分批收集筹码；剩下 30% 的海外宽基与流动性储备，一方面对冲单一市场的系统性风险，另一方面保证机会来临时你手中有子弹。\n\n再强调一遍安全边际的三条纪律：第一，单一行业敞口不超过总仓位的 20%，再看好也不要破例；第二，任何一笔加仓都必须有书面的买入逻辑，逻辑消失就离场，不要和持仓谈恋爱；第三，每月做一次再平衡检查，偏离目标配置超过 5 个百分点就机械调整，不掺任何情绪。\n\n下周二晚我们将在直播间详细推演四季度资金流向与安全边际打分表。`,
    tags: ['宏观策略', '大类资产配置', '红利低波'],
    stocks: [
      { code: '000015', name: '红利低波ETF', price: '1.142', change: '+0.48%', isUp: true },
      { code: '600900', name: '长江电力', price: '30.15', change: '+1.12%', isUp: true },
      { code: '.IXIC', name: '纳斯达克', price: '18074.5', change: '+0.84%', isUp: true }
    ],
    likes: 342,
    isLiked: false,
    commentsCount: 58,
    sharesCount: 29,
    createdAt: '2小时前',
    likers: ['远山求道', '稳健老张', '理财小周', '资产配置小陈', '苏若曦', '林晨', '张启明', '静水流深'],
    likersCount: 42,
    featuredComment: {
      id: 'fc-1',
      author: {
        name: '老林说宏观',
        role: 'founder',
      },
      content: '补充说明：下周二直播间演示的资金流向表已上传至内部资料库，VIP会员可在“学习专区”直接下载。',
      createdAt: '1小时前',
      likes: 12,
      isLiked: false,
    },
    comments: [
      {
        id: 'c-1',
        author: {
          name: '稳健老张',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          role: 'vip',
        },
        content: '林总说得极对，牛市更需要纪律！去年追高科技股吃过大亏，今年靠长电和红利ETF吃到了稳稳的幸福。',
        createdAt: '1小时前',
        likes: 19,
      },
      {
        id: 'c-2',
        author: {
          name: '理财小周',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          role: 'member',
        },
        content: '期待周二晚上的直播，已经设置好日历提醒了！',
        createdAt: '30分钟前',
        likes: 6,
      }
    ]
  },
  {
    id: 'post-2',
    author: {
      id: 'u-founder',
      name: '老林说宏观',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'founder',
      roleTitle: '星主',
    },
    isPinned: false,
    isVipOnly: true,
    title: '【VIP专属研报】2026 Q4 极度精选：12家具备自由现金流定价优势的港股/A股底仓标的',
    content: `【本贴为财不外露·私享星球VIP专享】\n\n在估值体系重塑的大背景下，单纯依靠市盈率（PE）已不能有效度量下行风险。我们团队历时两周，通过剔除应收账款粉饰与过度资本开支，筛选出近5年自由现金流（FCF）复合收益率大于 8.5% 的核心底仓清单。\n\n清单包含：\n1. 高端装备与出海隐形冠军（3家）\n2. 具备定价垄断权的公用与资源品（4家）\n3. 平台型科技现金奶牛（5家）\n具体买入估值底及股息率安全阈值请查看内部附件表格。`,
    tags: ['VIP独享', '底仓标的', '自由现金流'],
    stocks: [
      { code: '00700.HK', name: '腾讯控股', price: '412.80', change: '+2.18%', isUp: true },
      { code: '601857', name: '中国石油', price: '8.45', change: '-0.35%', isUp: false }
    ],
    likes: 218,
    isLiked: true,
    commentsCount: 36,
    sharesCount: 15,
    createdAt: '昨天 15:30',
    comments: [
      {
        id: 'c-3',
        author: {
          name: '资产配置小陈',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          role: 'vip',
        },
        content: '附件已下载并认真阅读，清单里的估值锚点给得太精准了，省去了几十个小时看财报的繁琐工作！',
        createdAt: '昨天 18:20',
        likes: 12,
      }
    ]
  },
  {
    id: 'post-3',
    author: {
      id: 'u-assistant',
      name: '陈清（投研助教）',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'assistant',
      roleTitle: '内容助教 / 注册特许金融分析师',
    },
    isPinned: false,
    isVipOnly: false,
    title: '答星友问：如何看懂上市公司现金流量表里的“含金量”？',
    content: `今天在提问区有位同学问：为什么有些公司利润表净利润很高，但股价连跌三年？\n\n答案就在**“销售商品、提供劳务收到的现金 / 营业收入”**这个比率上。如果这个比率长期低于 90%，说明大量利润都是应收账款（白条），在产业链中没有议价权。\n\n真正的好生意，是像自来水厂或某些龙头消费品一样：一手交钱，一手交货，甚至可以预收经销商货款！这就是我们常说的“无息杠杆”。大家可以在专栏第三讲《财报透视》中查看详细案例分析。`,
    tags: ['财报分析', '干货教学', '现金流'],
    likes: 189,
    isLiked: false,
    commentsCount: 22,
    sharesCount: 18,
    createdAt: '前天 10:15',
    comments: []
  }
];

export const columnsMock: Column[] = [
  {
    id: 'col-us-stock',
    title: '「美股指标」解析',
    subtitle: '穿透宏观大盘、市场广度与流动性定价底层指标',
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    author: 'Rich',
    authorTitle: '美股宏观对冲资深合伙人',
    price: 399,
    originPrice: 799,
    subscriberCount: 1860,
    chapterCount: 4,
    tags: ['美股指标', '宏观量化', '市场广度'],
    status: 'published',
    isCompleted: true,
    leaders: ['Rich'],
    chapters: [
      {
        id: 'art-mg-1',
        columnId: 'col-us-stock',
        title: '【市场状态】广度、风险与仓位，看清美股行情质量',
        author: 'Rich',
        authorAvatar: avatarRich,
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-24 17:17',
        updatedAt: '2026-09-24 17:17',
        duration: '22分钟',
        wordCount: 4860,
        readCount: 3580,
        isFreeTrial: true,
        isPinned: true,
        isEssence: true,
        tags: ['话题研究'],
        riskWarning: '风险提示：市场有风险，投资需谨慎',
        linkCard: {
          title: '【市场状态】广度、风险与仓位，看清美股行情质量',
          url: '#'
        },
        summary: '上一篇，我们从盈利和估值出发，判断了美股上涨是否有基本面支撑。但指数有支撑，并不意味着市场内部健康。上涨究竟是多数股票共同推动，还是少数权重股在撑着指数？一旦市场回调，又该如何判断只是正常波动，还是风险正在扩散？这一篇，我们把视角进一步移向市场内部，看看当前美股究竟处在什么 ...',
        content: `上一篇，我们从盈利和估值出发，判断了美股上涨是否有基本面支撑。但指数有支撑，并不意味着市场内部健康。上涨究竟是多数股票共同推动，还是少数权重股在撑着指数？一旦市场回调，又该如何判断只是正常波动，还是风险正在扩散？这一篇，我们把视角进一步移向市场内部，看看当前美股究竟处在什么状态。

### 一、市场广度（Market Breadth）：涨势是百花齐放还是孤胆英雄？
看大盘指数（如标普500或纳斯达克100），容易被市值加权机制所“蒙蔽”。当科技巨头市值占比超过 30% 时，只要巨头微涨，指数就能粉饰太平。

真正衡量市场健康度的是**市场广度**：
1. **腾落线（Advance-Decline Line, A/D Line）**：
   - 累加每日上涨股票数减去下跌股票数。若指数创历史新高，而 A/D 线持续走平甚至下倾，表明参与上涨的个股数量正在衰减，进入“指数牛、个股熊”的危险背离期。
2. **标普 500 站上 200 日均线的个股比例（% Above 200-Day SMA）**：
   - 健康的牛市通常维持在 65% ~ 80% 区间。
   - 当指数继续冲高，但站上 200MA 的股票比例跌破 50% 时，意味着半数股票已经转入熊市通道。

### 二、风险溢价与金融条件：防范流动性骤紧
在降息周期博弈阶段，高收益债信用利差（HY Spread）与隐含波动率（VIX）是最好的两盏警示灯：
- **高收益利差（OAS）**：目前仍被压缩在历史低分位数（约 300-330 bps）。一旦利差无序走扩突破 400 bps，往往预示企业再融资链条受阻。
- **期权偏斜度（SKEW Index）**：机构针对极右侧黑天鹅尾部风险的对冲情绪持续攀升，说明深水区聪明钱已经在布局下行保护。

### 三、当前仓位管理的战术原则
1. **不盲目做空大盘**：流动性拐点未确立前，逆势空头成本高昂；
2. **结构性平衡（杠铃配置）**：核心仓位锚定具备深厚自由现金流的龙头底仓，卫星仓位配置逆周期国债 ETF 或高胜率防御性公用事业；
3. **设置硬性跟踪止损位**：动态审视持仓成本线与关键均线支撑。`,
        likes: 4,
        isLiked: false,
        likers: [
          { name: 'Rich', avatar: avatarRich },
          { name: 'Mark', avatar: avatarMark },
          { name: 'John', avatar: avatarJohn },
          { name: 'Jerry', avatar: avatarJerry }
        ],
        comments: [
          {
            id: 'c-mg-1',
            author: {
              name: 'Rich',
              avatar: avatarRich,
              role: 'founder'
            },
            content: '宏观大盘的指标分析已经完结，接下来会进行行业和企业端的指标拆解了！🌹',
            createdAt: '2026-09-24 18:30',
            likes: 12
          },
          {
            id: 'c-mg-2',
            author: {
              name: 'Emily (阿萝)',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
              role: 'member'
            },
            content: '券商行情软件有哪些？',
            createdAt: '2026-09-24 21:23',
            likes: 5
          }
        ]
      },
      {
        id: 'art-mg-2',
        columnId: 'col-us-stock',
        title: '【大盘定价】盈利与估值，看清美股上涨逻辑',
        author: 'Rich',
        authorAvatar: avatarRich,
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-20 10:15',
        updatedAt: '2026-09-20 10:15',
        duration: '18分钟',
        wordCount: 3600,
        readCount: 2840,
        isFreeTrial: true,
        isPinned: false,
        isEssence: false,
        tags: ['话题研究', '估值模型'],
        riskWarning: '风险提示：市场有风险，投资需谨慎',
        linkCard: {
          title: '【大盘定价】盈利与估值，看清美股上涨逻辑',
          url: '#'
        },
        summary: '剖析标普500远期市盈率（Forward P/E）与EPS预期修正周期的驱动机制。',
        content: `拆解驱动美股大盘的两个关键齿轮：估值乘数（PE Ratio）与每股盈利预期（EPS Revision）。历史复盘表明，估值扩张往往走在盈利修复前面。

### 一、美股大盘定价模型：戴维斯双击与双杀
股票价格的长期变化可以简化为两个维度的乘积：**P = EPS × PE**。
1. **盈利驱动期（EPS Drive）**：企业营收放量、净利润率扩张，基本面稳固；
2. **估值驱动期（Valuation Drive）**：降息宽松预期下，贴现率下降推升 PE 乘数；
3. **戴维斯双击（Davis Double Play）**：当宏观流动性宽松与产业周期上行共振，大盘进入最强主升浪。

### 二、远期市盈率（Forward P/E）的锚定区间
标普 500 指数的 10 年历史中枢水平在 18.5x 左右。
- **21x 以上**：属于估值极度饱满区间，对无风险利率抬升极其敏感；
- **16x ~ 18x**：合理估值中枢区间；
- **15x 以下**：通常出现在经济衰退或恐慌抛售尾声，具备极高赔率。

### 三、自上而下的财报季跟踪框架
跟踪 EPS Revision 趋势的关键是“超预期幅度”（Beat Rate）与“业绩指引”（Guidance）。如果业绩超预期但指引下调，往往诱发估值杀跌。`,
        likes: 18,
        isLiked: false,
        likers: [{ name: 'Mark', avatar: avatarMark }, { name: 'John', avatar: avatarJohn }],
        comments: []
      },
      {
        id: 'art-mg-3',
        columnId: 'col-us-stock',
        title: '【金融条件】利率、信用与流动性，判断美股转折点',
        author: 'Rich',
        authorAvatar: avatarRich,
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-14 15:30',
        updatedAt: '2026-09-14 15:30',
        duration: '25分钟',
        wordCount: 4200,
        readCount: 2410,
        isFreeTrial: false,
        isPinned: false,
        isEssence: false,
        tags: ['话题研究', '流动性'],
        riskWarning: '风险提示：市场有风险，投资需谨慎',
        linkCard: {
          title: '【金融条件】利率、信用与流动性，判断美股转折点',
          url: '#'
        },
        summary: '芝加哥联储全国金融状况指数（NFCI）与逆回购协议（RRP）余额对资产价格的先导作用。',
        content: `全球美元流动性的水闸如何通过商业银行准备金与隔夜逆回购传导至权益资产。当流动性充沛时，甚至劣质资产都会被推高；当流动性退潮时，只有坚固的基本面才能存活。

### 一、美联储资产负债表与净流动性公式
我们常用的美股净流动性监控指标公式为：
> **净流动性（Net Liquidity）= 美联储总资产（Fed Balance Sheet）- 财政部一般账户（TGA）- 隔夜逆回购（RRP）**

当 TGA 账户回补（发债吸金）且 RRP 耗尽时，银行体系准备金将被直接抽水，权益资产将面临估值重估考验。

### 二、信用利差：风险偏好的终极体温计
观察高收益债券（Junk Bond）相对美国国债的利差走势：
1. **利差收窄**：市场风险偏好旺盛，违约风险预期低；
2. **利差拐头走扩**：借贷成本攀升，企业再融资压力凸显，股市往往先见顶。

### 三、实战监控信号灯
建立每周流动性检视清单：SOFR 利率走势、美债收益率曲线倒挂修复斜率、以及彭博美国金融状况指数（BFCIUS）。`,
        likes: 15,
        isLiked: false,
        likers: [{ name: 'Jerry', avatar: avatarJerry }],
        comments: []
      },
      {
        id: 'art-mg-4',
        columnId: 'col-us-stock',
        title: '【美股指标】增长、就业与通胀，看清美国经济周期',
        author: 'Rich',
        authorAvatar: avatarRich,
        authorRoleTitle: '星主 / 资深宏观分析师',
        createdAt: '2026-09-08 09:40',
        updatedAt: '2026-09-08 09:40',
        duration: '20分钟',
        wordCount: 3900,
        readCount: 1980,
        isFreeTrial: false,
        isPinned: false,
        isEssence: false,
        tags: ['话题研究', '经济数据'],
        riskWarning: '风险提示：市场有风险，投资需谨慎',
        linkCard: {
          title: '【美股指标】增长、就业与通胀，看清美国经济周期',
          url: '#'
        },
        summary: '非农新增就业、萨姆规则衰退指标与核心PCE通胀粘性的多维度跟踪图谱。',
        content: `如何解读美国劳工统计局月度就业报告中的工资增速及劳动参与率对降息路径的制约。

### 一、劳动力市场的冷却信号
非农就业报告（NFP）是美联储双重使命（充分就业与物价稳定）的核心天平：
- **萨姆规则（Sahm Rule）**：当 3 个月平均失业率比前 12 个月的最低点高出 0.5 个百分点时，历史上 100% 对应美国经济衰退；
- **职位空缺与失业人数之比（V/U Ratio）**：从疫情后的 2.0 降回 1.1，标志劳动力供需恢复均衡。

### 二、通胀粘性：核心 PCE 的最后一公里
超级核心通胀（Supercore Inflation，扣除住房的核心服务通胀）与服务业工资增长深度绑定。只要该项稳步走低，降息通道就会保持畅通。

### 三、周期时钟定位与资产配置建议
在“软着陆”到“预防性降息”过渡期，长久期国债与优质大盘成长股具备最佳风险收益比。`,
        likes: 22,
        isLiked: false,
        likers: [{ name: 'Mark', avatar: avatarMark }],
        comments: []
      }
    ]
  },
  {
    id: 'col-ai-1',
    title: '「AI产业」剖析',
    subtitle: '理清AI产业链结构与投资脉络',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    author: '志诚 / 若琪',
    authorTitle: 'AI前沿科技投研组',
    price: 399,
    originPrice: 799,
    subscriberCount: 1520,
    chapterCount: 8,
    tags: ['AI产业', '算力底座', '商业模式'],
    status: 'published',
    isCompleted: true,
    leaders: ['若琪', '志诚'],
    chapters: [
      {
        id: 'ch-ai-1',
        columnId: 'col-ai-1',
        title: '【算力底座】全球 AI 算力基础设施与芯片产业链全景深度剖析',
        duration: '26分钟',
        wordCount: 3820,
        isFreeTrial: true,
        updatedAt: '2026-09-02 14:30',
        createdAt: '2026-09-02 14:30',
        readCount: 1520,
        isEssence: true,
        author: '志诚',
        authorAvatar: avatarRich,
        tags: ['算力底座', '半导体', '投资脉络'],
        riskWarning: '风险提示：行业技术迭代迅速，注意供应链资本开支周期波动风险。',
        linkCard: { title: '【算力底座】全球 AI 算力基础设施与芯片产业链全景深度剖析', url: '#' },
        summary: '从先进制程、高带宽内存(HBM)到先进封装(CoWoS)，深度拆解算力底座的供需结构、成本曲线与关键瓶颈点。',
        content: '从先进制程、高带宽内存(HBM)到先进封装(CoWoS)，深度拆解算力底座的供需结构、成本曲线与关键瓶颈点。',
        likes: 35,
        isLiked: false,
        likers: [{ name: 'Mark', avatar: avatarMark }],
        comments: []
      },
      {
        id: 'ch-ai-2',
        columnId: 'col-ai-1',
        title: '【商业模式】大模型 Infra 与云厂商 AI 原生重构的商业化路径',
        duration: '18分钟',
        wordCount: 2640,
        isFreeTrial: false,
        updatedAt: '2026-09-12 10:15',
        createdAt: '2026-09-12 10:15',
        readCount: 980,
        isEssence: false,
        author: '若琪',
        authorAvatar: avatarRich,
        tags: ['云厂商', 'MaaS', '商业模式'],
        summary: '探讨全球公有云巨头从传统 IaaS 向 AI PaaS/MaaS 转型的盈利模式。',
        content: '探讨全球公有云巨头从传统 IaaS 向 AI PaaS/MaaS 转型的盈利模式，以及私有化算力租赁市场的演变。',
        likes: 12,
        isLiked: false,
        likers: [],
        comments: []
      },
      { id: 'ch-ai-1-3', columnId: 'col-ai-1', title: '【网络互联】InfiniBand vs RoCE：大规模 GPU 集群架构演进', wordCount: 3100, isFreeTrial: false, updatedAt: '2026-09-14', readCount: 840, isEssence: false, author: '志诚', summary: 'GPU 网络吞吐量瓶颈与高速光模块产业链机会。', content: '大规模 GPU 集群在通信互联领域的演进图谱...', likes: 8, isLiked: false, comments: [] },
      { id: 'ch-ai-1-4', columnId: 'col-ai-1', title: '【先进制程】台积电 CoWoS 封装产能瓶颈与 HBM 供应链穿透', wordCount: 3400, isFreeTrial: false, updatedAt: '2026-09-16', readCount: 790, isEssence: false, author: '志诚', summary: '晶圆制造与先进封装关键设备商的市占率分析。', content: '深入剖析台积电先进封装产能扩张节奏...', likes: 11, isLiked: false, comments: [] },
      { id: 'ch-ai-1-5', columnId: 'col-ai-1', title: '【算力租赁】Neocloud 与私有化算力中心的成本收益测算', wordCount: 2800, isFreeTrial: false, updatedAt: '2026-09-18', readCount: 650, isEssence: false, author: '若琪', summary: '算力租赁企业的毛利率敏感度与折旧模型。', content: 'Neocloud 商业模式测算...', likes: 9, isLiked: false, comments: [] },
      { id: 'ch-ai-1-6', columnId: 'col-ai-1', title: '【数据中心】AI 能耗挑战：高密供电、液冷技术与绿电配额', wordCount: 3600, isFreeTrial: false, updatedAt: '2026-09-20', readCount: 920, isEssence: false, author: '志诚', summary: '电力瓶颈正在成为全球 AI 数据中心扩张的最大掣肘。', content: '高压供电与冷板式液冷产业链梳理...', likes: 14, isLiked: false, comments: [] },
      { id: 'ch-ai-1-7', columnId: 'col-ai-1', title: '【终端芯片】端侧 AI NPU 架构与消费电子换机周期推演', wordCount: 2900, isFreeTrial: false, updatedAt: '2026-09-22', readCount: 810, isEssence: false, author: '若琪', summary: '手机与 PC 端侧运行百亿参数大模型的软硬件协同。', content: '端侧算力部署与应用生态...', likes: 16, isLiked: false, comments: [] },
      { id: 'ch-ai-1-8', columnId: 'col-ai-1', title: '【生态护城河】CUDA 体系的软硬件壁垒与竞品突围破局点', wordCount: 4100, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 1100, isEssence: false, author: '志诚', summary: '开发者生态与算子库如何构筑最坚固的商业护城河。', content: '深度剖析 CUDA 开发者生态与生态壁垒...', likes: 21, isLiked: false, comments: [] }
    ]
  },
  {
    id: 'col-ai-2',
    title: '「AI趋势」解析',
    subtitle: '多模态演进与边缘AI终端爆发趋势',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=80',
    author: '若琪',
    authorTitle: '前沿科技研究员',
    price: 299,
    originPrice: 599,
    subscriberCount: 840,
    chapterCount: 12,
    tags: ['AI趋势', '边缘计算'],
    status: 'published',
    isCompleted: false,
    leaders: ['若琪'],
    chapters: [
      { id: 'ch-ai-2-1', columnId: 'col-ai-2', title: '【边缘侧】边缘侧大模型落地：手机、PC 与具身智能机器人的供应链机遇', duration: '20分钟', wordCount: 3100, isFreeTrial: true, updatedAt: '2026-09-15', readCount: 650, isEssence: true, author: '若琪', authorAvatar: avatarRich, tags: ['端侧AI', '消费电子'], riskWarning: '风险提示：注意消费电子出货不及预期风险。', linkCard: { title: '【边缘侧】边缘侧大模型落地供应链机遇', url: '#' }, summary: '端侧 NPU 算力提升带来的消费电子换机周期与核心零部件价值量拆解。', content: '端侧 NPU 算力提升带来的消费电子换机周期与核心零部件价值量拆解...', likes: 19, isLiked: false, likers: [{ name: 'Mark', avatar: avatarMark }], comments: [] },
      { id: 'ch-ai-2-2', columnId: 'col-ai-2', title: '【多模态】视觉大模型从识别走向生成：产业落地全景', wordCount: 2900, isFreeTrial: false, updatedAt: '2026-09-16', readCount: 520, author: '若琪', summary: '文本生成视频、3D建模资产生成在游戏与广告工业的重塑。', content: '多模态大模型的最新商业化进展...', likes: 7, isLiked: false, comments: [] },
      { id: 'ch-ai-2-3', columnId: 'col-ai-2', title: '【具身智能】从人形机器人关节模组看电机与传感器增量市场', wordCount: 3200, isFreeTrial: false, updatedAt: '2026-09-17', readCount: 740, author: '若琪', summary: '谐波减速器、行星滚柱丝杠与六维力传感器供应链梳理。', content: '机器人供应链核心元器件分析...', likes: 15, isLiked: false, comments: [] },
      { id: 'ch-ai-2-4', columnId: 'col-ai-2', title: '【智能驾驶】端到端大模型量产落地与算力需求重构', wordCount: 3500, isFreeTrial: false, updatedAt: '2026-09-18', readCount: 880, author: '若琪', summary: '从模块化感知规划到神经网络端到端架构的范式转移。', content: '智驾算力与传感器融合演进...', likes: 18, isLiked: false, comments: [] },
      { id: 'ch-ai-2-5', columnId: 'col-ai-2', title: '【Agent生态】AI Agent 从工作流编排到商业化变现的演进路径', wordCount: 2700, isFreeTrial: false, updatedAt: '2026-09-19', readCount: 630, author: '若琪', summary: '多智能体协同与企业级 RPA 深度融合的落地案例。', content: 'Agent 生态企业级实践...', likes: 9, isLiked: false, comments: [] },
      { id: 'ch-ai-2-6', columnId: 'col-ai-2', title: '【合成数据】预训练语料枯竭危机下的高质量合成数据生成', wordCount: 3000, isFreeTrial: false, updatedAt: '2026-09-20', readCount: 570, author: '若琪', summary: '利用强模型蒸馏与自我博弈生成高质量数学和代码训练集。', content: '合成数据对模型提升的定量研究...', likes: 8, isLiked: false, comments: [] },
      { id: 'ch-ai-2-7', columnId: 'col-ai-2', title: '【推理优化】MoE 架构与低比特量化对推理成本的阶跃式压缩', wordCount: 3300, isFreeTrial: false, updatedAt: '2026-09-21', readCount: 690, author: '若琪', summary: 'FP8、FP4 与稀疏激活技术的落地应用与性能平衡。', content: '大模型推理成本优化全景图...', likes: 12, isLiked: false, comments: [] },
      { id: 'ch-ai-2-8', columnId: 'col-ai-2', title: '【企业私有化】微调 vs RAG 架构选型与企业数据飞轮构建', wordCount: 3600, isFreeTrial: false, updatedAt: '2026-09-22', readCount: 820, author: '若琪', summary: '金融、医疗和制造行业部署企业内部私有大模型的经验集。', content: '企业私有化落地工程实践...', likes: 14, isLiked: false, comments: [] },
      { id: 'ch-ai-2-9', columnId: 'col-ai-2', title: '【安全对齐】RLHF 与宪法级 AI：大模型幻觉与价值观对齐', wordCount: 2800, isFreeTrial: false, updatedAt: '2026-09-23', readCount: 460, author: '若琪', summary: '对抗性测试与安全护栏构建的核心算法进展。', content: '大模型安全性与对齐技术研究...', likes: 6, isLiked: false, comments: [] },
      { id: 'ch-ai-2-10', columnId: 'col-ai-2', title: '【生物医药】AlphaFold3 时代的计算生物学与 AI 制药前沿', wordCount: 3400, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 710, author: '若琪', summary: '靶点发现、分子筛选与晶型预测中的深度学习应用。', content: 'AI 在小分子创新药研发中的降本增效...', likes: 11, isLiked: false, comments: [] },
      { id: 'ch-ai-2-11', columnId: 'col-ai-2', title: '【材料科学】深度势能与第一性原理计算在固态电池材料中的应用', wordCount: 3100, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 540, author: '若琪', summary: 'AI 辅助寻找高离子电导率电解质与正极包覆材料。', content: 'AI 赋能新材料发现的技术路径...', likes: 7, isLiked: false, comments: [] },
      { id: 'ch-ai-2-12', columnId: 'col-ai-2', title: '【长远展望】超智时代演进路线图：AGI 与超级对齐愿景', wordCount: 4200, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 950, author: '若琪', summary: '从弱人工智能走向通用人工智能的里程碑指标展望。', content: 'AGI 发展阶段与未来十年的产业机遇...', likes: 25, isLiked: false, comments: [] }
    ]
  },
  {
    id: 'col-ai-3',
    title: '「公司解构」洞察',
    subtitle: '全球科技巨头财报与商业模式穿透',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80',
    author: '志诚',
    authorTitle: '美股资深分析师',
    price: 399,
    originPrice: 799,
    subscriberCount: 720,
    chapterCount: 12,
    tags: ['公司解构', '科技巨头'],
    status: 'published',
    isCompleted: false,
    leaders: ['志诚'],
    chapters: [
      { id: 'ch-ai-3-1', columnId: 'col-ai-3', title: '【英伟达】英伟达 vs 谷歌自研 TPU：生态壁垒与护城河实战评估', duration: '25分钟', wordCount: 4200, isFreeTrial: true, updatedAt: '2026-09-10', readCount: 1120, isEssence: true, author: '志诚', authorAvatar: avatarRich, tags: ['英伟达', 'CUDA生态'], riskWarning: '风险提示：注意客户自研芯片对外部采购份额的分流风险。', linkCard: { title: '【英伟达】生态壁垒与护城河实战评估', url: '#' }, summary: 'CUDA 开发者生态如何构建起最坚固的算力护城河，自研芯片突围难在何处。', content: 'CUDA 开发者生态如何构建起最坚固的算力护城河...', likes: 28, isLiked: false, likers: [{ name: 'John', avatar: avatarJohn }], comments: [] },
      { id: 'ch-ai-3-2', columnId: 'col-ai-3', title: '【微软】Copilot 商业化转化率与 Azure 云业务增长飞轮', wordCount: 3800, isFreeTrial: false, updatedAt: '2026-09-12', readCount: 960, author: '志诚', summary: 'Office 365 订阅提价与智能助手的企业端留存率深度测算。', content: '微软财报深度拆解与未来增长动能...', likes: 16, isLiked: false, comments: [] },
      { id: 'ch-ai-3-3', columnId: 'col-ai-3', title: '【苹果】Apple Intelligence 与十亿活跃终端的生态闭环', wordCount: 3500, isFreeTrial: false, updatedAt: '2026-09-14', readCount: 890, author: '志诚', summary: '私有云计算与端侧芯片的极致权衡，换机大周期是否成立？', content: '苹果端侧生态的长期商业价值分析...', likes: 20, isLiked: false, comments: [] },
      { id: 'ch-ai-3-4', columnId: 'col-ai-3', title: '【谷歌】搜索广告防御战与 Gemini 全模态多业务线整合', wordCount: 3900, isFreeTrial: false, updatedAt: '2026-09-16', readCount: 810, author: '志诚', summary: '反垄断审查阴影下的核心搜索护城河与成本控制韧性。', content: 'Alphabet 最新季度经营报表与资本开支...', likes: 14, isLiked: false, comments: [] },
      { id: 'ch-ai-3-5', columnId: 'col-ai-3', title: '【亚马逊】AWS 云计算利润率拐点与电商仓储自动化降本', wordCount: 3400, isFreeTrial: false, updatedAt: '2026-09-18', readCount: 770, author: '志诚', summary: 'Bedrock 平台生态客户增长与零售履约端机器人部署进展。', content: '亚马逊自由现金流回流与再投资能力...', likes: 13, isLiked: false, comments: [] },
      { id: 'ch-ai-3-6', columnId: 'col-ai-3', title: '【Meta】开源 Llama 生态战与广告推荐算法的千亿级提升', wordCount: 3700, isFreeTrial: false, updatedAt: '2026-09-19', readCount: 850, author: '志诚', summary: '扎克伯格的算力资本开支推演与智能眼镜硬件未来。', content: 'Meta 广告转化率回升与开源策略商业闭环...', likes: 17, isLiked: false, comments: [] },
      { id: 'ch-ai-3-7', columnId: 'col-ai-3', title: '【特斯拉】FSD 纯视觉方案与 Robotaxi 运营经济学测算', wordCount: 4300, isFreeTrial: false, updatedAt: '2026-09-20', readCount: 1240, author: '志诚', summary: '端到端智驾突破、每英里运营成本与软件授权商业前景。', content: '特斯拉不仅是汽车制造商，更是 AI 算力与物理交互企业...', likes: 31, isLiked: false, comments: [] },
      { id: 'ch-ai-3-8', columnId: 'col-ai-3', title: '【台积电】全球晶圆代工垄断定价权与毛利率韧性穿透', wordCount: 3600, isFreeTrial: false, updatedAt: '2026-09-21', readCount: 910, author: '志诚', summary: 'N3、N2 制程良率与海外建厂资本折旧对盈利的影响。', content: 'TSMC 定价权与供应链议价能力深度剖析...', likes: 22, isLiked: false, comments: [] },
      { id: 'ch-ai-3-9', columnId: 'col-ai-3', title: '【阿斯麦】EUV 与 High-NA 光刻机订单周期与研发壁垒', wordCount: 3300, isFreeTrial: false, updatedAt: '2026-09-22', readCount: 830, author: '志诚', summary: '摩尔定律物理极限守护者，极紫外光刻技术的无代际追赶者。', content: 'ASML 积压订单与全球半导体周期相关性...', likes: 15, isLiked: false, comments: [] },
      { id: 'ch-ai-3-10', columnId: 'col-ai-3', title: '【博通】客制化 ASIC 芯片设计与以太网交换机统治地位', wordCount: 3500, isFreeTrial: false, updatedAt: '2026-09-23', readCount: 780, author: '志诚', summary: '收购 VMware 后的软件整合与超大规模客户专用芯片绑定。', content: 'Broadcom 资本运作与核心技术护城河...', likes: 18, isLiked: false, comments: [] },
      { id: 'ch-ai-3-11', columnId: 'col-ai-3', title: '【超微半导体】AMD MI300X 生态拓展与数据中心双寡头格局', wordCount: 3200, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 720, author: '志诚', summary: '苏姿丰的追赶策略：ROCm 软件栈升级与云厂商二供平衡。', content: 'AMD 芯片性价比与供应链争夺...', likes: 12, isLiked: false, comments: [] },
      { id: 'ch-ai-3-12', columnId: 'col-ai-3', title: '【甲骨文】Oracle 云数据库签约放量与 AI 训练集群爆发', wordCount: 3400, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 840, author: '志诚', summary: '传统软件巨头的第二次青春：RDMA 裸金属集群与多云部署。', content: 'OCI 算力租赁订单积压与估值重构...', likes: 19, isLiked: false, comments: [] }
    ]
  },
  {
    id: 'col-ai-4',
    title: '「投资策略」实战',
    subtitle: '科技股估值重构与波段配置模型',
    cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80',
    author: '若琪 / 志诚',
    authorTitle: '策略合伙人',
    price: 499,
    originPrice: 999,
    subscriberCount: 310,
    chapterCount: 8,
    tags: ['投资策略', '估值模型'],
    status: 'published',
    isCompleted: false,
    leaders: ['若琪', '志诚'],
    chapters: [
      { id: 'ch-ai-4-1', columnId: 'col-ai-4', title: '【杠铃策略】科技成长与高息红利的动态对冲构建', wordCount: 3800, isFreeTrial: true, updatedAt: '2026-09-18', readCount: 780, isEssence: true, author: '志诚', authorAvatar: avatarRich, summary: '如何利用不确定市场中的两极配置获取超额夏普比率。', content: '杠铃配置策略实操方法论...', likes: 21, isLiked: false, comments: [] },
      { id: 'ch-ai-4-2', columnId: 'col-ai-4', title: '【周期定投】在恐慌回撤期建立长期核心筹码的方法论', wordCount: 3200, isFreeTrial: false, updatedAt: '2026-09-19', readCount: 650, author: '若琪', summary: '网格交易与动态再平衡纪律执行。', content: '长期定投的心理与仓位管理...', likes: 15, isLiked: false, comments: [] },
      { id: 'ch-ai-4-3', columnId: 'col-ai-4', title: '【波动率对冲】利用 VIX 期权与保护性看跌期权防范暴跌', wordCount: 3600, isFreeTrial: false, updatedAt: '2026-09-20', readCount: 590, author: '志诚', summary: 'Tail Risk 防御性组合构建指南。', content: '期权对冲策略实操...', likes: 18, isLiked: false, comments: [] },
      { id: 'ch-ai-4-4', columnId: 'col-ai-4', title: '【动量因子】科技龙头趋势跟踪与突破进场时机识别', wordCount: 3100, isFreeTrial: false, updatedAt: '2026-09-21', readCount: 520, author: '志诚', summary: '量化动量评分系统与持仓轮动规则。', content: '动量因子实战回测...', likes: 11, isLiked: false, comments: [] },
      { id: 'ch-ai-4-5', columnId: 'col-ai-4', title: '【基本面量化】自由现金流收益率与 ROIC 选股模型', wordCount: 3400, isFreeTrial: false, updatedAt: '2026-09-22', readCount: 640, author: '若琪', summary: '穿透财报噪音，筛选高资本回报率印钞机企业。', content: 'ROIC 与资本配置效率...', likes: 14, isLiked: false, comments: [] },
      { id: 'ch-ai-4-6', columnId: 'col-ai-4', title: '【事件驱动】财报公布窗口期的跨式期权与盈余惊喜交易', wordCount: 2900, isFreeTrial: false, updatedAt: '2026-09-23', readCount: 480, author: '志诚', summary: '如何利用市场预期偏差与业绩指引获利。', content: '财报季期权策略构建...', likes: 10, isLiked: false, comments: [] },
      { id: 'ch-ai-4-7', columnId: 'col-ai-4', title: '【风险平价】All-Weather 桥水模型的本土化改造方案', wordCount: 4100, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 820, author: '志诚', summary: '平价波动率下的股债商品动态权重分配。', content: '全天候策略回测与资产组合...', likes: 23, isLiked: false, comments: [] },
      { id: 'ch-ai-4-8', columnId: 'col-ai-4', title: '【仓位管理】凯利公式与动态回撤控制红线机制', wordCount: 3500, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 710, author: '若琪', summary: '投资是一场活下来的概率游戏。', content: '资金管理与风控红线设计...', likes: 19, isLiked: false, comments: [] }
    ]
  },
  {
    id: 'col-ai-5',
    title: '「数据趋势」解析',
    subtitle: '全网开发者与模型调用量高频监测',
    cover: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&auto=format&fit=crop&q=80',
    author: '若琪',
    authorTitle: '量化数据工程师',
    price: 299,
    originPrice: 599,
    subscriberCount: 260,
    chapterCount: 20,
    tags: ['数据趋势', '高频数据'],
    status: 'published',
    isCompleted: false,
    leaders: ['若琪'],
    chapters: Array.from({ length: 20 }, (_, i) => ({
      id: `ch-ai-5-${i + 1}`,
      columnId: 'col-ai-5',
      title: `【数据追踪${String(i + 1).padStart(2, '0')}】全球开发者模型调用量与 API 吞吐高频监测周报`,
      wordCount: 2600 + i * 80,
      isFreeTrial: i === 0,
      updatedAt: `2026-09-${String(24 - Math.min(i, 20)).padStart(2, '0')}`,
      readCount: 450 + i * 20,
      isEssence: i === 0,
      author: '若琪',
      authorAvatar: avatarRich,
      summary: '高频监测全球主流开源与闭源大模型调用增速与定价走势。',
      content: `本期高频数据跟踪重点：大模型 Token 消耗量持续爬升，API 综合价格环比下降...`,
      likes: 8 + (i % 5),
      isLiked: false,
      comments: []
    }))
  },
  {
    id: 'col-ai-6',
    title: '「金融产品」分析',
    subtitle: '科技创新主题公募、ETF 与期权避险工具',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    author: '志诚',
    authorTitle: '特许金融分析师',
    price: 299,
    originPrice: 599,
    subscriberCount: 410,
    chapterCount: 16,
    tags: ['ETF', '期权避险'],
    status: 'published',
    isCompleted: false,
    leaders: ['志诚'],
    chapters: Array.from({ length: 16 }, (_, i) => ({
      id: `ch-ai-6-${i + 1}`,
      columnId: 'col-ai-6',
      title: `【工具透视${String(i + 1).padStart(2, '0')}】全球精选 ETF 费率跟踪与流动性深度拆解`,
      wordCount: 2800 + i * 60,
      isFreeTrial: i === 0,
      updatedAt: `2026-09-${String(24 - Math.min(i, 15)).padStart(2, '0')}`,
      readCount: 520 + i * 30,
      isEssence: i === 0,
      author: '志诚',
      authorAvatar: avatarRich,
      summary: '解析海外宽基与行业主题工具产品的跟踪误差与流动性成本。',
      content: `金融工具实操指南与组合配置策略...`,
      likes: 12 + (i % 6),
      isLiked: false,
      comments: []
    }))
  },
  {
    id: 'col-ai-7',
    title: '「底层资产」剖析',
    subtitle: '高确定性核心现金流与关键技术节点',
    cover: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=500&auto=format&fit=crop&q=80',
    author: '若琪',
    authorTitle: '前沿产业顾问',
    price: 399,
    originPrice: 799,
    subscriberCount: 520,
    chapterCount: 7,
    tags: ['底层资产', '高确定性'],
    status: 'published',
    isCompleted: true,
    leaders: ['若琪'],
    chapters: [
      { id: 'ch-ai-7-1', columnId: 'col-ai-7', title: '【现金流基石】穿越周期的核心商业模式与自由现金流定价法', wordCount: 3900, isFreeTrial: true, updatedAt: '2026-09-18', readCount: 890, isEssence: true, author: '若琪', authorAvatar: avatarRich, summary: '什么样的资产才算真正意义上的防守压舱石？', content: '核心底层资产甄别标准...', likes: 26, isLiked: false, comments: [] },
      { id: 'ch-ai-7-2', columnId: 'col-ai-7', title: '【特许权】公用事业与自然垄断资产的防御价值', wordCount: 3100, isFreeTrial: false, updatedAt: '2026-09-19', readCount: 620, author: '若琪', summary: '电网、自来水与长输管道的抗通胀属性。', content: '垄断型底层资产投资逻辑...', likes: 14, isLiked: false, comments: [] },
      { id: 'ch-ai-7-3', columnId: 'col-ai-7', title: '【关键节点】不可替代核心零部件的定价权分析', wordCount: 3400, isFreeTrial: false, updatedAt: '2026-09-20', readCount: 710, author: '若琪', summary: '隐形冠军企业的毛利保护屏障。', content: '高壁垒关键节点企业研究...', likes: 16, isLiked: false, comments: [] },
      { id: 'ch-ai-7-4', columnId: 'col-ai-7', title: '【无形资产】高转换成本与专利护城河的量化衡量', wordCount: 3200, isFreeTrial: false, updatedAt: '2026-09-21', readCount: 580, author: '若琪', summary: '软件粘性与企业级基础设施迁移阻力。', content: '无形资产壁垒分析...', likes: 11, isLiked: false, comments: [] },
      { id: 'ch-ai-7-5', columnId: 'col-ai-7', title: '【红利低波】高股息再投资复利模型的长期胜率测算', wordCount: 3700, isFreeTrial: false, updatedAt: '2026-09-22', readCount: 760, author: '若琪', summary: '股息率与回购收益率结合的股东回报率指标。', content: '红利策略历史长期回测...', likes: 22, isLiked: false, comments: [] },
      { id: 'ch-ai-7-6', columnId: 'col-ai-7', title: '【硬通货】黄金、工业金属与大宗商品的通胀避险角色', wordCount: 3500, isFreeTrial: false, updatedAt: '2026-09-23', readCount: 840, author: '若琪', summary: '法币信用扩张周期中的实物资产重估。', content: '黄金与大宗商品在资产配置中的作用...', likes: 19, isLiked: false, comments: [] },
      { id: 'ch-ai-7-7', columnId: 'col-ai-7', title: '【底层闭环】打造永续现金流防御盾牌的最终实操', wordCount: 4200, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 1020, author: '若琪', summary: '组合资产负债表健康度审计与安全边际。', content: '全天候底层资产配置总结篇...', likes: 31, isLiked: false, comments: [] }
    ]
  },
  {
    id: 'col-ai-8',
    title: '「宏观大势」研判',
    subtitle: '美联储利率路径、全球资金流向与经济周期转换',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    author: '老林说宏观',
    authorTitle: '星主',
    price: 399,
    originPrice: 799,
    subscriberCount: 880,
    chapterCount: 6,
    tags: ['宏观大势', '利率周期'],
    status: 'published',
    isCompleted: true,
    leaders: ['老林说宏观'],
    chapters: [
      { id: 'ch-ai-8-1', columnId: 'col-ai-8', title: '【降息大潮】全球央行降息周期全面开启，大类资产如何重新定价？', wordCount: 4200, isFreeTrial: true, updatedAt: '2026-09-18', readCount: 1450, isEssence: true, author: '老林说宏观', authorAvatar: avatarRich, summary: '美联储降息空间与流动性外溢对全球资本市场的深远影响。', content: '全球宏观流动性大周期研判...', likes: 45, isLiked: false, comments: [] },
      { id: 'ch-ai-8-2', columnId: 'col-ai-8', title: '【债务周期】主权债务扩张、赤字货币化与去金融化终局推演', wordCount: 3600, isFreeTrial: false, updatedAt: '2026-09-19', readCount: 920, author: '老林说宏观', summary: '达利欧长期债务周期模型在当今多极化世界的验证。', content: '长期债务周期的演进逻辑...', likes: 28, isLiked: false, comments: [] },
      { id: 'ch-ai-8-3', columnId: 'col-ai-8', title: '【汇率博弈】强美元周期触顶与非美货币资产配置机遇', wordCount: 3300, isFreeTrial: false, updatedAt: '2026-09-20', readCount: 860, author: '老林说宏观', summary: '日元套息交易平仓风险与新兴市场汇率弹性。', content: '全球汇率波动与避险策略...', likes: 22, isLiked: false, comments: [] },
      { id: 'ch-ai-8-4', columnId: 'col-ai-8', title: '【大宗周期】铜金比、油金比的宏观先导信号解读', wordCount: 3100, isFreeTrial: false, updatedAt: '2026-09-21', readCount: 780, author: '老林说宏观', summary: '工业属性与金融属性的拉扯如何折射全球制造业景气度。', content: '大宗商品比率指标与宏观拐点...', likes: 19, isLiked: false, comments: [] },
      { id: 'ch-ai-8-5', columnId: 'col-ai-8', title: '【再工业化】美国近岸外包与出海链制造企业的全球重构', wordCount: 3700, isFreeTrial: false, updatedAt: '2026-09-22', readCount: 950, author: '老林说宏观', summary: '贸易壁垒时代的跨国资本流动与供应链新版图。', content: '全球供应链重组与投资机会...', likes: 25, isLiked: false, comments: [] },
      { id: 'ch-ai-8-6', columnId: 'col-ai-8', title: '【百年变局】地缘政治格局重塑下高净值家庭资产安全避风港', wordCount: 4600, isFreeTrial: false, updatedAt: '2026-09-24', readCount: 1680, isEssence: true, author: '老林说宏观', authorAvatar: avatarRich, summary: '离岸信托、跨币种防御与实物资产布局之道。', content: '财富传承与资产安全隔离终极指南...', likes: 58, isLiked: false, comments: [] }
    ]
  }
];

export const coursesMock: Course[] = [
  {
    id: 'course-hk-ipo',
    title: '港股打新公开课',
    description: '系统掌握港股新股申购底层规则、现金与孖展实操流程、综合交易成本核算、破发风险评估及甲乙组中签与回拨机制。',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    totalDuration: '2小时33分钟',
    lessonsCount: 6,
    completedLessons: 0,
    level: '初级入门',
    category: 'foundation',
    categoryLabel: '基础与工具',
    modules: ['规则', '流程', '费用', '风险', '中签与回拨机制'],
    price: 69,
    originPrice: 129,
    priceNote: '免费试看 / ¥69',
    isPurchased: false,
    studentsCount: 1840,
    status: 'published',
    lessons: [
      {
        id: 'hk-1',
        title: '第01节：港股打新底层规则与一级半市场生态全景',
        duration: '22:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '规则',
        summary: '拆解港交所主板上市标准、绿鞋机制（超额配售权）、基石投资者锁定期与红鞋分配原则。'
      },
      {
        id: 'hk-2',
        title: '第02节：新股认购全流程实操（招股书、现金申购与孖展融资）',
        duration: '26:40',
        isFreeTrial: false,
        completed: false,
        moduleTag: '流程',
        summary: '从招股启动、截止认购、公布配售结果到富途/辉立暗盘交易与首日挂牌的完整时间轴演练。'
      },
      {
        id: 'hk-3',
        title: '第03节：打新综合费用精算（入场费、手续费、融资利息与中签费）',
        duration: '19:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '费用',
        summary: '量化对比现金一手与高倍银行融资的打新盈亏平衡点，规避高频申购隐性摩擦成本。'
      },
      {
        id: 'hk-4',
        title: '第04节：打新核心风险识别与高估值破发防守纪律',
        duration: '25:10',
        isFreeTrial: false,
        completed: false,
        moduleTag: '风险',
        summary: '如何通过保荐人历史护盘胜率、Pre-IPO轮折溢价与孖展冷热程度避开破发重灾区。'
      },
      {
        id: 'hk-5',
        title: '第05节：一手中签率测算模型与公开发售甲乙组分配机制',
        duration: '28:50',
        isFreeTrial: false,
        completed: false,
        moduleTag: '中签与回拨机制',
        summary: '详解 500 万港币分界线下的甲组（散户）与乙组（大额）货源切分与多户申购配比策略。'
      },
      {
        id: 'hk-6',
        title: '第06节：公开发售回拨机制（常规回拨 vs 套路回拨）与卖出纪律',
        duration: '31:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '中签与回拨机制',
        summary: '深入解析 15倍/50倍/100倍超额认购触发的回拨阶梯，以及国配不足额引发的“套路回拨”应对法则。'
      }
    ]
  },
  {
    id: 'course-macro',
    title: '宏观市场分析课',
    description: '搭建从宏观经济增长、通胀演进、央行利率路径、汇率博弈、全球流动性监测到政策与大类资产价格传导的完整投研框架。',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时48分钟',
    lessonsCount: 7,
    completedLessons: 0,
    level: '进阶实战',
    category: 'market',
    categoryLabel: '市场与产业',
    modules: ['增长', '通胀', '利率', '汇率', '流动性', '政策与资产传导'],
    price: 299,
    originPrice: 499,
    isPurchased: false,
    studentsCount: 1420,
    status: 'published',
    lessons: [
      {
        id: 'macro-1',
        title: '第01节：经济增长核心观测指标（GDP结构、PMI领先指标与产出缺口）',
        duration: '28:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '增长',
        summary: '通过库存周期、制造业/服务业 PMI 分项与高频消费数据，精准定位当前所处的经济周期象限。'
      },
      {
        id: 'macro-2',
        title: '第02节：通胀形成机制与 CPI / 核心 PCE 粘性拆解',
        duration: '32:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '通胀',
        summary: '剖析能源商品、房租项（OER）与核心服务薪资螺旋对通胀预期及实际购买力的深层影响。'
      },
      {
        id: 'macro-3',
        title: '第03节：全球资产定价之锚：基准利率、点阵图与美债收益率曲线',
        duration: '35:40',
        isFreeTrial: false,
        completed: false,
        moduleTag: '利率',
        summary: '读懂短端政策利率预期与长端期限溢价（Term Premium），解读收益率曲线倒挂与陡峭化的交易信号。'
      },
      {
        id: 'macro-4',
        title: '第04节：汇率决定框架：美元指数周期、利差平价与跨境套息交易',
        duration: '30:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '汇率',
        summary: '分析美欧日利差变动、日元 Carry Trade 平仓机制及人民币汇率弹性对港A股估值的影响。'
      },
      {
        id: 'macro-5',
        title: '第05节：宏观流动性全景监测（央行资产负债表、TGA账户与逆回购）',
        duration: '34:10',
        isFreeTrial: false,
        completed: false,
        moduleTag: '流动性',
        summary: '区分“狭义银行间流动性”与“广义信用扩张”，跟踪准备金余额与全球净流动性指标拐点。'
      },
      {
        id: 'macro-6',
        title: '第06节：财政与货币政策协同机制及市场预期差博弈',
        duration: '29:45',
        isFreeTrial: false,
        completed: false,
        moduleTag: '政策与资产传导',
        summary: '理解赤字率、特别国债与降准降息工具箱的发力节奏，区分政策出台与基本面见底的时滞。'
      },
      {
        id: 'macro-7',
        title: '第07节：从宏观变量到股、债、汇、商大类资产传导的实战沙盘',
        duration: '38:00',
        isFreeTrial: false,
        completed: false,
        moduleTag: '政策与资产传导',
        summary: '复盘典型降息周期与再通胀周期中，股票、美债、黄金及工业金属的轮动次序与配置权重。'
      }
    ]
  },
  {
    id: 'course-us-fundamental',
    title: '美股基本面与财报分析课',
    description: '深度拆解美股核心资产商业模式、SEC三张财务报表精读、管理层业绩指引追踪、多元估值锚定及财报季预期差实战案例。',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时46分钟',
    lessonsCount: 6,
    completedLessons: 0,
    level: '高阶策略',
    category: 'market',
    categoryLabel: '市场与产业',
    modules: ['商业模式', '三张表', '指引', '估值', '预期差与案例'],
    price: 599,
    originPrice: 899,
    isPurchased: false,
    studentsCount: 1160,
    status: 'published',
    lessons: [
      {
        id: 'usf-1',
        title: '第01节：美股长牛商业模式解构（网络效应、高转换成本与定价权）',
        duration: '33:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '商业模式',
        summary: '剖析 SaaS 订阅制、消费平台与硬科技垄断企业的单位经济模型（Unit Economics）与 ROIC 持续性。'
      },
      {
        id: 'usf-2',
        title: '第02节：10-K / 10-Q 三张表精读（GAAP vs Non-GAAP、SBC与自由现金流）',
        duration: '42:10',
        isFreeTrial: false,
        completed: false,
        moduleTag: '三张表',
        summary: '还原股权激励费用（SBC）对真实利润的稀释，掌握自由现金流（FCF）转化率与资产负债表排雷技巧。'
      },
      {
        id: 'usf-3',
        title: '第03节：管理层业绩指引（Guidance）、RPO 剩余履约义务与电话会信号',
        duration: '31:45',
        isFreeTrial: false,
        completed: false,
        moduleTag: '指引',
        summary: '为什么过去季度的财报数字只是后视镜？学会从管理层下季及全年指引调整中捕捉基本面二阶导拐点。'
      },
      {
        id: 'usf-4',
        title: '第04节：美股多维估值体系（PE、EV/EBITDA、EV/Sales、PEG 与 DCF）',
        duration: '38:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '估值',
        summary: '不同生命周期企业如何匹配恰当的估值尺子，测算无风险利率变动对成长股估值中枢的弹性。'
      },
      {
        id: 'usf-5',
        title: '第05节：买方一致预期（Whisper Number）与财报季预期差博弈机制',
        duration: '35:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '预期差与案例',
        summary: '详解 Beat & Raise（双超预期且上调指引）与 Priced-in（利好出尽）背后的机构持仓拥挤度逻辑。'
      },
      {
        id: 'usf-6',
        title: '第06节：实战案例复盘：北美核心科技龙头财报拐点与戴维斯双击实录',
        duration: '45:00',
        isFreeTrial: false,
        completed: false,
        moduleTag: '预期差与案例',
        summary: '完整复盘英伟达、微软与 Meta 在资本开支周期与利润率释放期的财报数据跟踪与买点确认。'
      }
    ]
  },
  {
    id: 'course-us-technical',
    title: '美股技术面分析课',
    description: '摒弃玄学指标，从趋势定义、价格结构、箱体区间、左右侧交易纪律、量价配合到波动率控仓与形态失效逃生，建立高胜率客观交易体系。',
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时37分钟',
    lessonsCount: 7,
    completedLessons: 0,
    level: '进阶实战',
    category: 'market',
    categoryLabel: '市场与产业',
    modules: ['趋势', '结构', '区间', '左右侧', '量价', '波动与失效'],
    price: 499,
    originPrice: 699,
    isPurchased: false,
    studentsCount: 950,
    status: 'published',
    lessons: [
      {
        id: 'ust-1',
        title: '第01节：多周期趋势定义与均线系统（EMA20/MA50/MA200）机构锚点',
        duration: '27:40',
        isFreeTrial: false,
        completed: false,
        moduleTag: '趋势',
        summary: '理解美股机构资金以 50 日与 200 日均线为核心的趋势配置法则，识别主升浪与均值回归阶段。'
      },
      {
        id: 'ust-2',
        title: '第02节：市场价格结构演进（高低点序列、关键枢轴点与结构破坏）',
        duration: '32:50',
        isFreeTrial: false,
        completed: false,
        moduleTag: '结构',
        summary: '通过 Higher Highs / Higher Lows 序列判定趋势强度，识别趋势末端的动量衰竭与结构反转。'
      },
      {
        id: 'ust-3',
        title: '第03节：震荡区间划分、筹码密集峰（Volume Profile）与支撑阻力互换',
        duration: '29:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '区间',
        summary: '利用成交量分布图寻找机构真实换手成本区，掌握箱体上下沿的突破与假突破判别。'
      },
      {
        id: 'ust-4',
        title: '第04节：左侧赔率伏击与右侧胜率跟随的适用场景及仓位切换',
        duration: '34:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '左右侧',
        summary: '在极度恐慌超跌时如何分批左侧试仓，在跳空突破关键颈线时如何右侧顺势加码。'
      },
      {
        id: 'ust-5',
        title: '第05节：量价关系核心精髓（缩量整固、放量突破、恐慌抛售与天量滞涨）',
        duration: '31:10',
        isFreeTrial: false,
        completed: false,
        moduleTag: '量价',
        summary: '结合 VCP（波动率收缩形态）与财报跳空缺口成交量特征，洞察主力资金吸筹与派发轨迹。'
      },
      {
        id: 'ust-6',
        title: '第06节：波动率（ATR / VIX）在动态止损、移动止盈与头寸规模中的应用',
        duration: '28:35',
        isFreeTrial: false,
        completed: false,
        moduleTag: '波动与失效',
        summary: '避免固定百分比止损被正常噪音洗出，用 ATR（真实波幅）科学计算单笔最大风险敞口。'
      },
      {
        id: 'ust-7',
        title: '第07节：技术信号失效识别、牛熊陷阱应对与无条件风控纪律',
        duration: '33:45',
        isFreeTrial: false,
        completed: false,
        moduleTag: '波动与失效',
        summary: '当突破后迅速跌回区间内部（Failed Breakout）时如何第一时间止损反手，守住账户本金底线。'
      }
    ]
  },
  {
    id: 'course-option-beginner',
    title: '期权小白课',
    description: '零基础入门期权世界，用通俗直观的案例讲透期权合约要素、买卖双方权利义务、四大基础方向到期盈亏图、常见新手误区与核心用途。',
    cover: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    totalDuration: '2小时08分钟',
    lessonsCount: 5,
    completedLessons: 0,
    level: '初级入门',
    category: 'foundation',
    categoryLabel: '基础与工具',
    modules: ['合约', '权利义务', '盈亏图', '常见风险与用途'],
    price: 99,
    originPrice: 199,
    isPurchased: false,
    studentsCount: 1620,
    status: 'published',
    lessons: [
      {
        id: 'optb-1',
        title: '第01节：一堂课读懂期权合约五大要素（标的、行权价、到期日、方向、权利金）',
        duration: '21:10',
        isFreeTrial: false,
        completed: false,
        moduleTag: '合约',
        summary: '用“购房定金合约”与“车险保单”类比，彻底搞懂实值（ITM）、平值（ATM）与虚值（OTM）期权。'
      },
      {
        id: 'optb-2',
        title: '第02节：看涨（Call）与看跌（Put）买卖双方的权利、义务与保证金机制',
        duration: '25:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '权利义务',
        summary: '厘清买方（付出权利金、收益非线性）与卖方（收取权利金、承担履约义务）的本质差异。'
      },
      {
        id: 'optb-3',
        title: '第03节：四个基本交易方向（Long/Short Call & Put）到期盈亏图推演',
        duration: '27:45',
        isFreeTrial: false,
        completed: false,
        moduleTag: '盈亏图',
        summary: '手把手绘制四大基础头寸的到期损益折线图，直观计算最大亏损边界、最大盈利空间与盈亏平衡点。'
      },
      {
        id: 'optb-4',
        title: '第04节：期权新手四大致命踩坑风险（末日轮归零、流动性价差、裸卖空与提前指派）',
        duration: '24:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '常见风险与用途',
        summary: '为什么买对正股方向买期权却亏钱？剖析时间价值衰减与买卖盘口滑点对账户的隐形侵蚀。'
      },
      {
        id: 'optb-5',
        title: '第05节：期权在实战中的四大正确用途（打折抄底、持股收租、锁定浮盈、黑天鹅保险）',
        duration: '29:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '常见风险与用途',
        summary: '将期权作为正股投资组合的“增效器”与“安全带”，告别赌博式投机思维。'
      }
    ]
  },
  {
    id: 'course-option-advanced',
    title: '期权基础与风险管理',
    description: '进阶掌握期权五大希腊字母（Greeks）、隐含波动率（IV）曲面与财报季 IV Crush、备兑与价差组合策略、仓位风控及真实爆仓案例复盘。',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时51分钟',
    lessonsCount: 6,
    completedLessons: 0,
    level: '高阶策略',
    category: 'strategy',
    categoryLabel: '组合与风控',
    modules: ['希腊字母', '波动率', '基础策略', '仓位与风险案例'],
    price: 599,
    originPrice: 899,
    isPurchased: false,
    studentsCount: 840,
    status: 'published',
    lessons: [
      {
        id: 'opta-1',
        title: '第01节：期权定价内核与五大希腊字母（Delta/Gamma/Theta/Vega/Rho）三维拆解',
        duration: '38:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '希腊字母',
        summary: '理解方向敏感度 Delta、加速度 Gamma、时间损耗 Theta 与波动率弹性 Vega 之间的动态制衡。'
      },
      {
        id: 'opta-2',
        title: '第02节：历史波动率（HV）与隐含波动率（IV）百分位、微笑曲线及财报 IV Crush',
        duration: '41:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '波动率',
        summary: '如何判断当前期权是“贵”还是“便宜”？掌握 IV Rank / IV Percentile 在买卖方策略选择中的决定性作用。'
      },
      {
        id: 'opta-3',
        title: '第03节：现金流增强策略实操：现金担保看跌（CSP）与备兑开仓（Covered Call）',
        duration: '36:40',
        isFreeTrial: false,
        completed: false,
        moduleTag: '基础策略',
        summary: '著名的“期权飞轮策略（The Wheel）”全流程详解：行权价 Delta 选择、到期展期（Roll）技巧与年化增厚测算。'
      },
      {
        id: 'opta-4',
        title: '第04节：风险封顶组合策略：垂直价差（Vertical Spread）、领口（Collar）与跨式组合',
        duration: '39:50',
        isFreeTrial: false,
        completed: false,
        moduleTag: '基础策略',
        summary: '通过牛市价差、熊市价差与保护性领口策略，在锁定最大亏损上限的前提下优化资金使用效率。'
      },
      {
        id: 'opta-5',
        title: '第05节：期权组合仓位管理法则：名义本金敞口控制、组合 Beta-Delta 对冲与保证金安全垫',
        duration: '33:10',
        isFreeTrial: false,
        completed: false,
        moduleTag: '仓位与风险案例',
        summary: '严控卖方名义杠杆倍数（Notional Leverage），建立防止极端单边行情强平的三道风控防火墙。'
      },
      {
        id: 'opta-6',
        title: '第06节：期权真实风险案例深度剖析（高倍裸卖 Put 爆仓、Gamma 逼空与跨市场对冲实录）',
        duration: '42:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '仓位与风险案例',
        summary: '复盘典型黑天鹅事件中期权链流动性枯竭与保证金追缴过程，提炼长期存活的交易铁律。'
      }
    ]
  },
  {
    id: 'course-financial-products',
    title: '常见金融产品/资产分析课',
    description: '全景式拆解黄金、房产、国债与美债、主动基金与ETF、储蓄与保障型保险、FCN/雪球等主流金融资产的底层收益机制与风险适用边界。',
    cover: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时12分钟',
    lessonsCount: 6,
    completedLessons: 0,
    level: '初级入门',
    category: 'foundation',
    categoryLabel: '基础与工具',
    modules: ['黄金', '房产', '债券', '基金', '保险', 'FCN 等机制与边界'],
    price: 299,
    originPrice: 499,
    isPurchased: false,
    studentsCount: 1530,
    status: 'published',
    lessons: [
      {
        id: 'fp-1',
        title: '第01节：黄金资产深度透视（货币信用属性、实际利率定价锚与实物/ETF/矿企工具对比）',
        duration: '28:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '黄金',
        summary: '为什么央行购金与主权债务扩张重塑了黄金定价模型？对比黄金 ETF、纸黄金与金矿股的风险收益特征。'
      },
      {
        id: 'fp-2',
        title: '第02节：不动产与房产配置评估（租金现金流回报率、人口周期、杠杆成本与REITs替代）',
        duration: '31:40',
        isFreeTrial: false,
        completed: false,
        moduleTag: '房产',
        summary: '用金融资产定价视角审视房产：对比净租金收益率与按揭利率差，识别核心城市优质资产与流动性折价。'
      },
      {
        id: 'fp-3',
        title: '第03节：债券固收资产机制（利率债、美债、信用债久期弹性、票息复利与违约风险边界）',
        duration: '34:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '债券',
        summary: '搞懂久期（Duration）与到期收益率（YTM），掌握短债现金管理与长端国债波段交易的适用场景。'
      },
      {
        id: 'fp-4',
        title: '第04节：公私募基金与场内 ETF 筛选（管理费率损耗、跟踪误差、溢价率陷阱与策略容量）',
        duration: '29:50',
        isFreeTrial: false,
        completed: false,
        moduleTag: '基金',
        summary: '穿透基金包装看底层资产：为什么长期来看低费率宽基与红利 ETF 能够跑赢绝大多数主动管理产品。'
      },
      {
        id: 'fp-5',
        title: '第05节：保障型与储蓄型保险精算拆解（重疾医疗杠杆、年金险/增额寿 IRR 测算与锁定利率）',
        duration: '32:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '保险',
        summary: '剥离营销话术，用 Excel 内部收益率（IRR）还原储蓄险真实回报，区分“风险转移工具”与“长期现金流工具”。'
      },
      {
        id: 'fp-6',
        title: '第06节：FCN（固定票息票据）、雪球与结构化理财产品的敲入敲出机制及尾部风险边界',
        duration: '36:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: 'FCN 等机制与边界',
        summary: '拆解 FCN 背后的“看跌期权卖方（Short Worst-of Put）”本质，看清高票息背后的极端行情接盘风险。'
      }
    ]
  },
  {
    id: 'course-portfolio-risk',
    title: '组合构建与风险管理课',
    description: '从投资收益与回撤目标量化出发，系统学习家庭资产负债表梳理、低相关性跨资产分散、动态再平衡纪律及极端行情压力测试。',
    cover: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop&q=80',
    totalDuration: '2小时26分钟',
    lessonsCount: 5,
    completedLessons: 0,
    level: '进阶实战',
    category: 'strategy',
    categoryLabel: '组合与风控',
    modules: ['目标', '资产负债表', '分散', '再平衡', '压力测试'],
    price: 199,
    originPrice: 329,
    isPurchased: false,
    studentsCount: 1380,
    status: 'published',
    lessons: [
      {
        id: 'pr-1',
        title: '第01节：投资目标量化设定（必要收益率、最大心理与资金回撤阈值、期间现金流需求）',
        duration: '24:50',
        isFreeTrial: false,
        completed: false,
        moduleTag: '目标',
        summary: '拒绝“既要高收益又要零回撤”的不可能三角，根据资金使用期限制定可执行的组合夏普比率目标。'
      },
      {
        id: 'pr-2',
        title: '第02节：家庭与个人投资资产负债表全景诊断（资产流动性分级与负债久期匹配）',
        duration: '29:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '资产负债表',
        summary: '建立“日常现金池、稳健底仓池、进取权益池、风险隔离池”四笔钱架构，杜绝短钱长投导致的被动割肉。'
      },
      {
        id: 'pr-3',
        title: '第03节：真正的分散配置：跨资产类别、跨经济体与跨币种的相关性矩阵构建',
        duration: '33:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '分散',
        summary: '为什么买 10 只同行业股票不叫分散？利用股、债、金、海外宽基的负相关/低相关性实现“免费的午餐”。'
      },
      {
        id: 'pr-4',
        title: '第04节：动态再平衡（Rebalancing）实操：日历定期法与偏离度阈值触发法',
        duration: '27:40',
        isFreeTrial: false,
        completed: false,
        moduleTag: '再平衡',
        summary: '通过制度化的“高抛低吸”克服人性贪婪与恐惧，详解半年度再平衡与 ±5% 偏离度触发的回测超额收益。'
      },
      {
        id: 'pr-5',
        title: '第05节：组合极端情境压力测试（2008金融危机、2022股债双杀与汇率大幅波动模拟）',
        duration: '31:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '压力测试',
        summary: '把组合放进历史级黑天鹅熔炉中检验最大回撤与恢复周期，提前补齐脆弱敞口。'
      }
    ]
  },
  {
    id: 'course-ai-industry',
    title: 'AI 产业链研究课',
    description: '硬核拆解全球人工智能产业全链条：从底层智算算力、GPU/ASIC芯片、半导体设备与光互连、北美电力与电网基建、AIDC数据中心到模型与商业应用。',
    cover: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时45分钟',
    lessonsCount: 6,
    completedLessons: 0,
    level: '高阶策略',
    category: 'market',
    categoryLabel: '市场与产业',
    modules: ['算力', '芯片', '设备', '电力', '数据中心', '模型与应用'],
    price: 699,
    originPrice: 999,
    isPurchased: false,
    studentsCount: 1290,
    status: 'published',
    lessons: [
      {
        id: 'ai-1',
        title: '第01节：AI 算力经济学：预训练、后训练与推理侧 Scaling Law 算力消耗测算模型',
        duration: '36:45',
        isFreeTrial: false,
        completed: false,
        moduleTag: '算力',
        summary: '量化推演全球 CSP 云巨头资本开支（Capex）向 Token 推理收入转化的斜率与持续周期。'
      },
      {
        id: 'ai-2',
        title: '第02节：AI 芯片核心壁垒：通用 GPU 架构迭代、云厂自研 ASIC 与 HBM 高带宽存储',
        duration: '42:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: '芯片',
        summary: '深入对比 CUDA 生态护城河与 TPU/Trainium 自研芯片的 TCO 成本边界，梳理 HBM 供应链格局。'
      },
      {
        id: 'ai-3',
        title: '第03节：先进制造与光互连设备：CoWoS 先进封装、光刻/刻蚀设备与 800G/1.6T 光模块',
        duration: '38:10',
        isFreeTrial: false,
        completed: false,
        moduleTag: '设备',
        summary: '剖析算力集群通信瓶颈下 NVLink、InfiniBand、超以太网及硅光（SiPh）方案的技术演进与订单弹性。'
      },
      {
        id: 'ai-4',
        title: '第04节：算力的尽头是电力：北美电网负荷缺口、核电重启（SMR）、燃气轮机与变压器出海',
        duration: '34:55',
        isFreeTrial: false,
        completed: false,
        moduleTag: '电力',
        summary: '为什么电力基础设施成为 AI 数据中心扩建的最大物理瓶颈？梳理绿电 PPA 协议与电网设备长周期景气度。'
      },
      {
        id: 'ai-5',
        title: '第05节：新一代 AIDC 智算数据中心：高功率机柜、全液冷散热（CDU/冷板）与供电架构',
        duration: '33:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '数据中心',
        summary: '从单机柜 15kW 到 120kW+ 的物理重构：解析液冷渗透率跃升、BBU 备电与超级电容增量环节。'
      },
      {
        id: 'ai-6',
        title: '第06节：大模型商业化闭环：MaaS 云服务、企业级 Agent 工作流、端侧 AI 与垂直应用估值',
        duration: '40:15',
        isFreeTrial: false,
        completed: false,
        moduleTag: '模型与应用',
        summary: '跟踪 AI 编程、多模态生成、企业软件 Copilot 与自动驾驶的真实付费转化率（ARR）与选股标准。'
      }
    ]
  },
  {
    id: 'course-crossborder-wealth',
    title: '跨境家庭财富基础课',
    description: '面向全球化资产配置需求，系统梳理跨境家庭财富目标、多币种账户体系、税务居民身份判定、CRS信息交换规则、海外保险架构与专业机构协作基础。',
    cover: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时14分钟',
    lessonsCount: 6,
    completedLessons: 0,
    level: '进阶实战',
    category: 'strategy',
    categoryLabel: '组合与风控',
    modules: ['家庭目标', '账户', '身份', 'CRS', '保险与专业协作基础'],
    price: 399,
    originPrice: 599,
    isPurchased: false,
    studentsCount: 910,
    status: 'published',
    lessons: [
      {
        id: 'cb-1',
        title: '第01节：跨境家庭财富顶层设计（币种分散、司法管辖区风险隔离、子女教育与代际传承）',
        duration: '27:30',
        isFreeTrial: false,
        completed: false,
        moduleTag: '家庭目标',
        summary: '明确家庭跨境资产配置的三大核心诉求，避免盲目跟风开户与高佣金产品错配。'
      },
      {
        id: 'cb-2',
        title: '第02节：境外多币种账户体系搭建（香港/新加坡银行账户、离岸券商账户与合规资金流转）',
        duration: '31:45',
        isFreeTrial: false,
        completed: false,
        moduleTag: '账户',
        summary: '详解境外银行账户激活维护、联名账户优劣势、港美股券商资产托管安全机制与换汇合规红线。'
      },
      {
        id: 'cb-3',
        title: '第03节：全球身份规划与税务居民身份（Tax Residency）判定核心准则',
        duration: '35:10',
        isFreeTrial: false,
        completed: false,
        moduleTag: '身份',
        summary: '区分“永居绿卡/国籍身份”与“税收居民身份”，详解 183 天居住规则、永久性住所及全球征税边界。'
      },
      {
        id: 'cb-4',
        title: '第04节：CRS（共同申报准则）信息交换机制运作全景与金融账户合规梳理',
        duration: '33:20',
        isFreeTrial: false,
        completed: false,
        moduleTag: 'CRS',
        summary: '穿透解析 CRS 申报范围（存款、托管、现金价值保单、消极非金融机构）与信息交换实操流程。'
      },
      {
        id: 'cb-5',
        title: '第05节：境外多元货币储蓄险、大额人寿保单与家族信托架构的功能边界',
        duration: '36:40',
        isFreeTrial: false,
        completed: false,
        moduleTag: '保险与专业协作基础',
        summary: '客观评估港险多元货币转换、保单拆分、受保人变更机制，以及“保单+信托”在婚姻与债务隔离中的真实效力。'
      },
      {
        id: 'cb-6',
        title: '第06节：跨境财富专业协作指南：如何甄别与协同跨境税务师、家族律师与私行顾问',
        duration: '29:50',
        isFreeTrial: false,
        completed: false,
        moduleTag: '保险与专业协作基础',
        summary: '识别买方独立顾问（Fee-Only）与卖方销售中介的利益冲突，掌握跨境架构年审与合规维护清单。'
      }
    ]
  }
];

export const liveSessionsMock: LiveSession[] = [
  {
    id: 'live-1',
    title: '【今晚 20:00 直播】全球议息会议推演与四季度持仓复盘',
    host: '老林说宏观',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hostTitle: '星主',
    scheduledTime: '今晚 20:00 开始（开播倒计时 01:25:30）',
    status: 'live',
    viewersCount: 685,
    description: '聚焦汇率走势、美联储降息路径及国内增量政策对A股与港股的核心映射，实时连线解答星友提问。',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'live-2',
    title: '【回放】手把手教你搭建家庭资产防守网与年金保险配置',
    host: '陈清（助教）',
    hostAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    hostTitle: '内容助教',
    scheduledTime: '2024-09-12 已结束',
    status: 'replay',
    viewersCount: 1540,
    description: '家庭顶梁柱的保障计划、重疾与医疗杠杆、年金锁定终身利率的实操误区拆解。',
    cover: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80',
    replayDuration: '1小时42分钟',
  }
];

// 直播分类（后台「分类设置」维护，后台筛选与 C 端共用）
export const liveCategoriesMock: string[] = ['市场行情', '板块机会', '重点个股', '配置思考'];

export const tencentMeetingsMock: TencentMeetingRecord[] = [
  {
    id: 'tm-live-0',
    meetingCode: '826491305',
    title: '【今晚 20:00 直播】全球议息会议推演与四季度核心持仓复盘',
    columnTag: '市场行情',
    columnId: 'col-ai-8',
    summary: '聚焦汇率走势、美联储降息路径及国内增量政策对A股与港股的核心映射，腾讯会议实时连麦解答星友提问。',
    creator: '老林说宏观',
    creatorTitle: '星主 · 资深宏观对冲基金经理',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'live',
    scheduledStartTime: '2026-09-28 20:00',
    actualStartTime: '2026-09-28 19:56',
    joinUrl: 'https://meeting.tencent.com/dm/826491305',
    participantsCount: 685,
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tm-2',
    meetingCode: '673134016',
    title: '【AI趋势】解析: 2026 自主智能体 Agent 产业落地与推理算力架构',
    columnTag: '板块机会',
    columnId: 'col-ai-2',
    summary: '拆解多模态 Agent 在企业级工作流中的商业闭环，测算推理侧算力消耗斜率与核心受益环节。',
    creator: '若琪',
    creatorTitle: '前沿产业顾问',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'upcoming',
    scheduledStartTime: '2026-09-29 20:00',
    actualStartTime: '——',
    joinUrl: 'https://meeting.tencent.com/dm/673134016',
    participantsCount: 412,
    cover: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tm-1',
    meetingCode: '215342596',
    title: '【AI产业】剖析: 全球AI算力基础设施与芯片产业链全景深度剖析',
    columnTag: '板块机会',
    columnId: 'col-ai-1',
    summary: '梳理光模块、HBM存储与先进封装最新排产追踪，评估四季度北美云厂商 Capex 资本开支指引。',
    creator: '志诚',
    creatorTitle: '核心合伙人 · 资深分析师',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'upcoming',
    scheduledStartTime: '2026-10-02 19:30',
    actualStartTime: '——',
    joinUrl: 'https://meeting.tencent.com/dm/215342596',
    participantsCount: 356,
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tm-3',
    meetingCode: '108909847',
    title: '【公司解构】洞察: 英伟达 (NVIDIA) 护城河与自研 ASIC 芯片竞争博弈',
    columnTag: '重点个股',
    columnId: 'col-ai-3',
    summary: '深度对比通用 GPU 与云大厂自研 ASIC 芯片的 TCO 总拥有成本，推演 2027 市场份额格局。',
    creator: '志诚',
    creatorTitle: '核心合伙人 · 资深分析师',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'upcoming',
    scheduledStartTime: '2026-10-05 20:00',
    actualStartTime: '——',
    joinUrl: 'https://meeting.tencent.com/dm/108909847',
    participantsCount: 289,
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tm-4',
    meetingCode: '701480417',
    title: '【投资策略】实战: 科技成长股估值重构与波段止盈防守模型',
    columnTag: '配置思考',
    columnId: 'col-ai-4',
    summary: '结合波动率分位指标与自由现金流收益率，建立震荡行情下科技仓位的动态止盈纪律。',
    creator: '若琪',
    creatorTitle: '前沿产业顾问',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'upcoming',
    scheduledStartTime: '2026-10-08 20:00',
    actualStartTime: '——',
    joinUrl: 'https://meeting.tencent.com/dm/701480417',
    participantsCount: 245,
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tm-8',
    meetingCode: '870625953',
    title: '【AI产业圆桌】大模型云服务 MaaS 商业化与私有化算力租赁模式演变',
    columnTag: '板块机会',
    columnId: 'col-ai-1',
    summary: '系统分析了 Token 经济学与推理成本下行曲线，研讨了企业私有化部署和算力调优的最新实操案例，总结了 4 条核心选股与产业验证逻辑。',
    creator: '志诚',
    creatorTitle: '核心合伙人 · 资深分析师',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-09-26 20:00',
    actualStartTime: '2026-09-26 19:58',
    recordDuration: '1小时38分钟',
    recordSize: '1.42 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_870625953.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/870625953',
    isOnShelf: true,
    shelfTime: '2026-09-26 22:30',
    daysSinceShelf: 2,
    replayPrice: 49,
    originPrice: 99,
    isPurchased: false,
    purchasedCount: 842,
    participantsCount: 1260,
    cover: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. Token 经济学模型与推理算力成本测算：单次推理成本在未来 18 个月预计下降 70%，推动边缘计算爆发。\n2. 云厂商 MaaS 转型路径：自研芯片替代率正从 15% 提升至 35%，混合云私有化部署成为大客户刚需。\n3. 产业链验证：梳理了光模块、液冷与先进封装核心供应商的三季报预期与确定性订单能见度。\n4. 星友连线答疑：重点解答了关于英伟达芯片量产交付周期与二阶导标的估值溢价问题。"
  },
  {
    id: 'tm-9',
    meetingCode: '790735112',
    title: '【专栏闭门会】科技成长股三季报复盘与大类资产防守策略推演',
    columnTag: '配置思考',
    columnId: 'col-ai-4',
    summary: '全面复盘了科技成长股三季度业绩波动，对比了算力端与应用端的现金流表现，深入拆解了红利与固收+防守仓位的动态再平衡模型。',
    creator: '若琪',
    creatorTitle: '前沿产业顾问',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-09-24 20:00',
    actualStartTime: '2026-09-24 19:58',
    recordDuration: '2小时05分钟',
    recordSize: '1.85 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_790735112.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/790735112',
    isOnShelf: true,
    shelfTime: '2026-09-24 22:40',
    daysSinceShelf: 4,
    replayPrice: 59,
    originPrice: 119,
    isPurchased: false,
    purchasedCount: 935,
    participantsCount: 1420,
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. 宏观流动性环境对科技成长股估值中枢的压制与释放关键节点分析。\n2. 现金流与估值双轮驱动：挑选具备真实内生现金流支撑、自由现金流收益率 > 5% 的低估值龙头。\n3. 组合实操指引：在震荡市中维持 30% 红利低波底层仓位，以增强组合防守韧性。"
  },
  {
    id: 'tm-10',
    meetingCode: '452891033',
    title: '【宏观对冲】美联储降息周期下美元指数与全球流动性再平衡',
    columnTag: '市场行情',
    columnId: 'col-ai-8',
    summary: '深度剖析美联储降息节奏对新兴市场汇率及资产价格重估的传导机制，推演黄金、美债与港股高弹性品种的配置窗口。',
    creator: '老林说宏观',
    creatorTitle: '星主 · 资深宏观对冲基金经理',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-09-22 20:30',
    actualStartTime: '2026-09-22 20:28',
    recordDuration: '1小时45分钟',
    recordSize: '1.55 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_452891033.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/452891033',
    isOnShelf: true,
    shelfTime: '2026-09-22 22:30',
    daysSinceShelf: 6,
    replayPrice: 39,
    originPrice: 79,
    isPurchased: false,
    purchasedCount: 1180,
    participantsCount: 1650,
    cover: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. 美联储点阵图与中性利率重估：长端美债收益率下行通道中的波段配置节奏。\n2. 离岸人民币汇率弹性恢复背景下，港股互联网龙头与高股息央企的估值修复空间。\n3. 跨市场避险组合构建：黄金与短久期美债在降息初期的仓位配比建议。"
  },
  {
    id: 'tm-11',
    meetingCode: '891230445',
    title: '【衍生品实操】期权隐波高企时刻的跨式套利与尾部风险对冲',
    columnTag: '配置思考',
    columnId: 'col-ai-6',
    summary: '围绕财报季期权隐波微笑曲线，详细演示了买入跨式与卖出勒式的对冲平衡点及保证金风控纪律。',
    creator: '张启明',
    creatorTitle: '特邀衍生品策略师',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-09-16 19:30',
    actualStartTime: '2026-09-16 19:32',
    recordDuration: '2小时12分钟',
    recordSize: '1.92 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_891230445.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/891230445',
    isOnShelf: true,
    shelfTime: '2026-09-16 22:10',
    daysSinceShelf: 12,
    replayPrice: 49,
    originPrice: 99,
    isPurchased: false,
    purchasedCount: 426,
    participantsCount: 980,
    cover: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. 隐含波动率 (IV) 百分位定价法：如何识别财报前夕期权权利金高估陷阱。\n2. 备兑开仓 (Covered Call) 增厚底仓收益的月度行权价选择实操。\n3. 极端行情下利用虚值认沽期权进行低成本尾部风险保护的测算模型。"
  },
  {
    id: 'tm-12',
    meetingCode: '612783901',
    title: '【大宗商品】铜铝库存周期与新能源电网投资景气度交叉验证',
    columnTag: '重点个股',
    columnId: 'col-ai-7',
    summary: '结合全球主要交易所库存及电网招标高频数据，推演工业金属中长期供需缺口与资源股自由现金流弹性。',
    creator: '苏若曦',
    creatorTitle: '特邀智囊 · 大宗消费投研总监',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-09-12 15:00',
    actualStartTime: '2026-09-12 14:58',
    recordDuration: '1小时28分钟',
    recordSize: '1.30 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_612783901.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/612783901',
    isOnShelf: true,
    shelfTime: '2026-09-12 18:00',
    daysSinceShelf: 16,
    replayPrice: 39,
    originPrice: 69,
    isPurchased: false,
    purchasedCount: 318,
    participantsCount: 860,
    cover: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=600&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. 全球铜矿资本开支周期滞后效应：未来 3 年新增产能投放节奏梳理。\n2. AI 数据中心电力配套与特高压电网建设对铜铝需求的边际拉动测算。\n3. 上游资源龙头企业的分红率提升趋势与安全边际评估。"
  },
  {
    id: 'tm-13',
    meetingCode: '319827604',
    title: '【量化策略】多因子选股模型在震荡行情中的换手衰减与交易成本优化',
    columnTag: '配置思考',
    columnId: 'col-ai-4',
    summary: '针对近期量化阿尔法波动，分享了降低双边印花与滑点损耗的自适应执行算法及指增组合配置建议。',
    creator: '林晨',
    creatorTitle: '量化成长合伙人',
    creatorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-09-08 20:00',
    actualStartTime: '2026-09-08 20:01',
    recordDuration: '1小时50分钟',
    recordSize: '1.62 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_319827604.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/319827604',
    isOnShelf: true,
    shelfTime: '2026-09-08 22:30',
    daysSinceShelf: 20,
    replayPrice: 59,
    originPrice: 99,
    isPurchased: false,
    purchasedCount: 389,
    participantsCount: 920,
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. 量价因子拥挤度监测：如何规避微盘股流动性虹吸引发的回撤风险。\n2. 基本面量化融合：将自由现金流与分析师预期修正纳入中频选股模型。\n3. 个人投资者如何借鉴量化仓位管理法则实现分批建仓与网格降本。"
  },
  {
    id: 'tm-15',
    meetingCode: '582301947',
    title: '【闭门私享】高净值星友资产配置架构与境外多币种现金管理实操',
    columnTag: '配置思考',
    columnId: 'col-ai-4',
    summary: '系统探讨了家族信托底层结构、美元美债配置工具及多币种账户合规汇兑指引，搭建家庭资产防守网。',
    creator: '老林说宏观',
    creatorTitle: '星主 · 资深宏观对冲基金经理',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-08-30 19:30',
    actualStartTime: '2026-08-30 19:29',
    recordDuration: '2小时18分钟',
    recordSize: '2.05 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_582301947.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/582301947',
    isOnShelf: true,
    shelfTime: '2026-08-30 22:30',
    daysSinceShelf: 29,
    replayPrice: 68,
    originPrice: 128,
    isPurchased: true,
    purchasedCount: 615,
    participantsCount: 1540,
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. 家庭资产四笔钱架构：日常现金池、稳健固收底仓、权益进取仓与保险隔离仓的黄金比例。\n2. 跨境多币种现金管理工具对比：美元货币基金、短久期国债 ETF 与香港储蓄分红险实测。\n3. 常见配置误区排雷：如何避免高费率结构化产品侵蚀长期复利收益。"
  },
  {
    id: 'tm-14',
    meetingCode: '908142573',
    title: '【实盘推演】半导体周期底部确认与存储芯片景气反转交易线索',
    columnTag: '板块机会',
    columnId: 'col-ai-1',
    summary: '对比了 DRAM / NAND 现货合约价上行曲线，系统梳理了产业链封测与模组核心标的。',
    creator: '志诚',
    creatorTitle: '核心合伙人 · 资深分析师',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-09-27 20:30',
    actualStartTime: '2026-09-27 20:30',
    recordDuration: '2小时00分钟',
    recordSize: '1.75 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_908142573.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/908142573',
    isOnShelf: false,
    shelfTime: '——',
    daysSinceShelf: 0,
    replayPrice: 49,
    originPrice: 99,
    isPurchased: false,
    purchasedCount: 0,
    participantsCount: 890,
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. HBM3e 与 DDR5 产能切换对传统存储芯片供给侧的挤压效应。\n2. 模组厂低价库存重估逻辑与三季报毛利率拐点预判。"
  },
  {
    id: 'tm-16',
    meetingCode: '741902385',
    title: '【AI产业】光通信 800G/1.6T 光模块供应链全球扩产与硅光方案渗透',
    columnTag: '板块机会',
    columnId: 'col-ai-1',
    summary: '针对北美四大云厂商最新资本开支展望，推演了高端光模块出货量与竞争格局。',
    creator: '若琪',
    creatorTitle: '前沿产业顾问',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'finished',
    scheduledStartTime: '2026-09-27 15:00',
    actualStartTime: '2026-09-27 15:02',
    recordDuration: '1小时35分钟',
    recordSize: '1.40 GB',
    recordUrl: 'https://cdn.wealth-circle.com/tencent-meeting/rec_741902385.mp4',
    joinUrl: 'https://meeting.tencent.com/dm/741902385',
    isOnShelf: false,
    shelfTime: '——',
    daysSinceShelf: 0,
    replayPrice: 39,
    originPrice: 79,
    isPurchased: false,
    purchasedCount: 0,
    participantsCount: 740,
    cover: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    minutesMarkdown: "1. 1.6T 光模块送样验证进度与明年一季度量产爬坡节奏。\n2. 硅光方案 (SiPh) 渗透率提升对上游 CW 光源芯片需求的影响。"
  }
];

export const membersMock: MemberRecord[] = [
  {
    id: 'm-1',
    name: '老林说宏观',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '13800008888',
    role: 'founder',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-01-01',
    lastActive: '刚刚',
    roleTitle: '星主 / 资深宏观对冲基金经理',
    bio: '20年二级市场投研老兵，专注全天候大类资产配置与高安全边际底仓实践。',
    notes: '星球创始人、主理人',
  },
  {
    id: 'm-rich',
    name: 'Rich',
    avatar: avatarRich,
    phone: '13800001688',
    role: 'partner',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-01-02',
    lastActive: '10分钟前',
    roleTitle: '核心合伙人 / 金融资管高管',
    bio: '10年全球对冲基金投资经验，深耕大宗商品衍生品与跨市场套利交易。',
    notes: '星球合伙人',
  },
  {
    id: 'm-john',
    name: 'John',
    avatar: avatarJohn,
    phone: '13900007766',
    role: 'guest',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-01-08',
    lastActive: '15分钟前',
    roleTitle: '特邀专家 / 国际证券特约研究员',
    bio: '专注海外宽基指数、QDII套利模型与美欧跨境资本流动监测。',
    notes: '特邀海外投研专家',
  },
  {
    id: 'm-jerry',
    name: 'Jerry',
    avatar: avatarJerry,
    phone: '13600005544',
    role: 'guest',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-01-12',
    lastActive: '25分钟前',
    roleTitle: '实战导师 / 资产规划导师',
    bio: '注册理财规划师（CFP），累计辅导300+中产家庭梳理资产负债表与现金流。',
    notes: '家庭理财规划导师',
  },
  {
    id: 'm-mark',
    name: 'Mark',
    avatar: avatarMark,
    phone: '13700009922',
    role: 'vip',
    status: 'active',
    spendTotal: 2999,
    joinedAt: '2024-01-15',
    lastActive: '3分钟前',
    membershipStatus: 'active',
    membershipStart: '2024-01-15',
    membershipEnd: '长期有效',
    roleTitle: '资深策略分析师 / 核心贡献者',
    bio: '擅长宏观流动性推演、信用利差跟踪与美国零售消费零售周期解码。',
    notes: '终身合伙人会员，高频优质内容创作者',
  },
  {
    id: 'm-2',
    name: '陈清（投研助教）',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '13900001234',
    role: 'guest',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-01-10',
    lastActive: '5分钟前',
    roleTitle: '内容助教 / 特许金融分析师 (CFA)',
    bio: '专注专栏案例答疑、上市公司财报排雷与现金流量表含金量校验。',
    notes: '特邀投研助教，拥有专栏发布权限',
  },
  {
    id: 'm-3',
    name: '远山求道',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '13700005678',
    role: 'vip',
    status: 'active',
    spendTotal: 1299,
    joinedAt: '2024-03-15',
    lastActive: '12分钟前',
    roleTitle: '年度VIP白金会员 / 实体创业者',
    bio: '实体创业者，长期价值定投践行者，在不确定性中寻找确定性复利。',
    notes: '年度VIP付费会员，活跃提问者',
  },
  {
    id: 'm-4',
    name: '稳健老张',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    phone: '13500009988',
    role: 'vip',
    status: 'active',
    spendTotal: 899,
    joinedAt: '2024-04-02',
    lastActive: '1小时前',
    roleTitle: '年度VIP会员 / 退休工程师',
    bio: '严守投资纪律，专注长江电力等高股息公用资产与红利低波定投。',
    notes: '红利资产深度实践者',
  },
  {
    id: 'm-7',
    name: '资产配置小陈',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    phone: '13600002233',
    role: 'vip',
    status: 'active',
    spendTotal: 899,
    joinedAt: '2024-04-18',
    lastActive: '2小时前',
    roleTitle: '年度VIP会员 / 资深精算师',
    bio: '坚持 4:3:3 资产配置框架，专注于安全边际与长周期底仓压舱石建设。',
    notes: '深度研报精读会员',
  },
  {
    id: 'm-8',
    name: '苏若曦',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '13800003344',
    role: 'guest',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-02-01',
    lastActive: '30分钟前',
    roleTitle: '特邀智囊 / 大宗消费投研总监',
    bio: '前券商新财富分析师，专注全球商品牛熊周期与消费龙头护城河评估。',
    notes: '星球智囊团核心成员',
  },
  {
    id: 'm-9',
    name: '林晨',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '13900005566',
    role: 'partner',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-02-15',
    lastActive: '45分钟前',
    roleTitle: '特邀智囊 / 量化成长合伙人',
    bio: '清华计算机本硕，前量化私募投资经理，擅长跨品种动量与CTA趋势模型。',
    notes: '量化模型特邀导师',
  },
  {
    id: 'm-10',
    name: 'SYY',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    phone: '18800007890',
    role: 'vip',
    status: 'active',
    spendTotal: 899,
    joinedAt: '2024-05-10',
    lastActive: '10分钟前',
    roleTitle: '年度VIP会员 / 互联网大厂技术中层',
    bio: '践行被动宽基定投，通过资产配置平滑职业周期波动。',
    notes: '星球高赞活跃星友',
  },
  {
    id: 'm-11',
    name: '玉面飞龙',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    phone: '13100004455',
    role: 'vip',
    status: 'active',
    spendTotal: 899,
    joinedAt: '2024-05-22',
    lastActive: '18分钟前',
    roleTitle: '年度VIP会员 / 私募研究员',
    bio: '聚焦港股低估高分红央企，深度跟踪腾讯与港股科技折价机会。',
    notes: '实盘跟踪高手',
  },
  {
    id: 'm-12',
    name: 'Star',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
    phone: '17700006611',
    role: 'vip',
    status: 'active',
    spendTotal: 899,
    joinedAt: '2024-06-01',
    lastActive: '22分钟前',
    membershipStatus: 'expired',
    membershipStart: '2024-06-01',
    membershipEnd: '2025-06-01',
    roleTitle: '年度VIP会员 / 医药分析师',
    bio: '严选高ROE与充沛自由现金流资产，陪伴优秀企业穿越周期。',
    notes: '研报互动先锋',
  },
  {
    id: 'm-5',
    name: '理财小周',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    phone: '18600003421',
    role: 'member',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-09-01',
    lastActive: '30分钟前',
    roleTitle: '新晋星友 / 95后职场新人',
    bio: '跟着各位老前辈从零学习，正在逐步建立自己的第一个十万理财账户。',
    notes: '积极求教的年轻星友',
  },
  {
    id: 'm-13',
    name: 'melody',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&auto=format&fit=crop&q=80',
    phone: '15800009900',
    role: 'member',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-09-08',
    lastActive: '40分钟前',
    roleTitle: '新晋星友 / 独立设计师',
    bio: '关注货币基金、短债与低回撤固收理财，先学会不亏钱。',
    notes: '稳健保守型新手',
  },
  {
    id: 'm-14',
    name: '盒儿云',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    phone: '13300007722',
    role: 'vip',
    status: 'active',
    spendTotal: 899,
    joinedAt: '2024-06-15',
    lastActive: '1小时前',
    roleTitle: '年度VIP会员 / 财务总监',
    bio: '精细化推演家庭现金流断裂点，搭建抗通胀抗风险的大类资产组合。',
    notes: '高质量财务讨论者',
  },
  {
    id: 'm-15',
    name: '彬彬',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    phone: '18500001122',
    role: 'member',
    status: 'active',
    spendTotal: 0,
    joinedAt: '2024-09-12',
    lastActive: '3小时前',
    roleTitle: '新晋星友 / 软件工程师',
    bio: '利用空余时间系统学习宏观周期规律，力求做到投资不盲从。',
    notes: '热心星友',
  }
];
