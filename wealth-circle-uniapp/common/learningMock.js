/**
 * 学习中心（课程与闭门直播）移动端轻量 Mock 数据源
 * 对标 PC 端体系化视频课 (coursesMock) 与闭门路演会议 (tencentMeetingsMock)
 */

export const learningCoursesMock = [
  {
    id: 'course-hk-ipo',
    title: '港股打新公开课',
    description: '系统掌握港股新股申购底层规则、现金与孖展实操流程、综合交易成本核算、破发风险评估及甲乙组中签与回拨机制。',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    totalDuration: '2小时33分钟',
    lessonsCount: 6,
    level: '初级入门',
    categoryLabel: '基础与工具',
    modules: ['规则', '流程', '费用', '风险', '中签与回拨'],
    price: 69,
    originPrice: 129,
    studentsCount: 1840,
    reservedCount: 1260,
    instructor: '老林说宏观 · 星主',
    lessons: [
      {
        id: 'hk-1',
        index: '01',
        title: '第01节：港股打新底层规则与一级半市场生态全景',
        duration: '22:15',
        moduleTag: '规则',
        summary: '拆解港交所主板上市标准、绿鞋机制（超额配售权）、基石投资者锁定期与红鞋分配原则。'
      },
      {
        id: 'hk-2',
        index: '02',
        title: '第02节：新股认购全流程实操（招股书、现金申购与孖展融资）',
        duration: '26:40',
        moduleTag: '流程',
        summary: '从招股启动、截止认购、公布配售结果到富途/辉立暗盘交易与首日挂牌的完整时间轴演练。'
      },
      {
        id: 'hk-3',
        index: '03',
        title: '第03节：打新综合费用精算（入场费、手续费、融资利息与中签费）',
        duration: '19:30',
        moduleTag: '费用',
        summary: '量化对比现金一手与高倍银行融资的打新盈亏平衡点，规避高频申购隐性摩擦成本。'
      },
      {
        id: 'hk-4',
        index: '04',
        title: '第04节：打新核心风险识别与高估值破发防守纪律',
        duration: '25:10',
        moduleTag: '风险',
        summary: '如何通过保荐人历史护盘胜率、Pre-IPO轮折溢价与孖展冷热程度避开破发重灾区。'
      },
      {
        id: 'hk-5',
        index: '05',
        title: '第05节：一手中签率测算模型与公开发售甲乙组分配机制',
        duration: '28:50',
        moduleTag: '中签与回拨',
        summary: '详解 500 万港币分界线下的甲组（散户）与乙组（大额）货源切分与多户申购配比策略。'
      },
      {
        id: 'hk-6',
        index: '06',
        title: '第06节：公开发售回拨机制（常规回拨 vs 套路回拨）与卖出纪律',
        duration: '31:20',
        moduleTag: '中签与回拨',
        summary: '深入解析 15倍/50倍/100倍超额认购触发的回拨阶梯，以及国配不足额引发的套路回拨应对法则。'
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
    level: '核心实战',
    categoryLabel: '市场与产业',
    modules: ['增长', '通胀', '利率', '汇率', '流动性', '资产传导'],
    price: 299,
    originPrice: 499,
    studentsCount: 1420,
    reservedCount: 980,
    instructor: '老林说宏观 · 星主',
    lessons: [
      {
        id: 'macro-1',
        index: '01',
        title: '第01节：经济增长核心观测指标（GDP结构、PMI与产出缺口）',
        duration: '28:30',
        moduleTag: '增长',
        summary: '通过库存周期、制造业/服务业 PMI 分项与高频消费数据，精准定位当前所处的经济周期象限。'
      },
      {
        id: 'macro-2',
        index: '02',
        title: '第02节：通胀形成机制与 CPI / 核心 PCE 粘性拆解',
        duration: '32:15',
        moduleTag: '通胀',
        summary: '剖析能源商品、房租项（OER）与核心服务薪资螺旋对通胀预期及实际购买力的深层影响。'
      },
      {
        id: 'macro-3',
        index: '03',
        title: '第03节：全球资产定价之锚：基准利率、点阵图与美债收益率曲线',
        duration: '35:40',
        moduleTag: '利率',
        summary: '解读美联储议息决议、长短端美债利差倒挂与期限溢价（Term Premium）的隐含衰退概率。'
      },
      {
        id: 'macro-4',
        index: '04',
        title: '第04节：汇率形成机制、利差驱动与美元指数（DXY）分析法',
        duration: '27:10',
        moduleTag: '汇率',
        summary: '解析购买力平价、利率平价与避险属性在不同宏观情景下的主导权切换。'
      },
      {
        id: 'macro-5',
        index: '05',
        title: '第05节：全球央行资产负债表与全球流动性监测框架',
        duration: '36:20',
        moduleTag: '流动性',
        summary: '区分狭义银行间流动性与广义信用扩张，跟踪准备金余额与全球净流动性指标拐点。'
      },
      {
        id: 'macro-6',
        index: '06',
        title: '第06节：财政与货币政策协同机制及市场预期差博弈',
        duration: '29:45',
        moduleTag: '资产传导',
        summary: '理解赤字率、特别国债与降准降息工具箱的发力节奏，区分政策出台与基本面见底的时滞。'
      },
      {
        id: 'macro-7',
        index: '07',
        title: '第07节：从宏观变量到股、债、汇、商大类资产传导的实战沙盘',
        duration: '38:00',
        moduleTag: '资产传导',
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
    level: '高阶策略',
    categoryLabel: '市场与产业',
    modules: ['商业模式', '三张表', '指引', '估值', '预期差与案例'],
    price: 599,
    originPrice: 899,
    studentsCount: 1160,
    reservedCount: 840,
    instructor: '志诚 · 核心合伙人',
    lessons: [
      {
        id: 'usf-1',
        index: '01',
        title: '第01节：美股长牛商业模式解构（网络效应、高转换成本与定价权）',
        duration: '33:20',
        moduleTag: '商业模式',
        summary: '剖析 SaaS 订阅制、消费平台与硬科技垄断企业的单位经济模型（Unit Economics）与 ROIC 持续性。'
      },
      {
        id: 'usf-2',
        index: '02',
        title: '第02节：10-K / 10-Q 三张表精读（GAAP vs Non-GAAP、SBC与自由现金流）',
        duration: '42:10',
        moduleTag: '三张表',
        summary: '还原股权激励费用（SBC）对真实利润的稀释，掌握自由现金流（FCF）转化率与资产负债表排雷技巧。'
      },
      {
        id: 'usf-3',
        index: '03',
        title: '第03节：管理层业绩指引（Guidance）、RPO 剩余履约义务与电话会信号',
        duration: '31:45',
        moduleTag: '指引',
        summary: '为什么过去季度的财报数字只是后视镜？学会从管理层下季及全年指引调整中捕捉基本面二阶导拐点。'
      },
      {
        id: 'usf-4',
        index: '04',
        title: '第04节：美股多维估值体系（PE、EV/EBITDA、EV/Sales、PEG 与 DCF）',
        duration: '38:30',
        moduleTag: '估值',
        summary: '不同生命周期企业如何匹配恰当的估值尺子，测算无风险利率变动对成长股估值中枢的弹性。'
      },
      {
        id: 'usf-5',
        index: '05',
        title: '第05节：买方一致预期（Whisper Number）与财报季预期差博弈机制',
        duration: '35:15',
        moduleTag: '预期差与案例',
        summary: '详解 Beat & Raise（双超预期且上调指引）与 Priced-in（利好出尽）背后的机构持仓拥挤度逻辑。'
      },
      {
        id: 'usf-6',
        index: '06',
        title: '第06节：实战案例复盘：北美核心科技龙头财报拐点与戴维斯双击实录',
        duration: '45:00',
        moduleTag: '预期差与案例',
        summary: '完整复盘英伟达、微软与 Meta 在资本开支周期与利润率释放期的财报数据跟踪与买点确认。'
      }
    ]
  },
  {
    id: 'course-ai-industry',
    title: 'AI 产业链研究课',
    description: '硬核拆解全球人工智能产业全链条：从底层智算算力、GPU/ASIC芯片、半导体设备与光互连、北美电力与电网基建、AIDC数据中心到模型与商业应用。',
    cover: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时50分钟',
    lessonsCount: 6,
    level: '前沿精选',
    categoryLabel: '市场与产业',
    modules: ['算力芯片', '光通信', '电网基建', 'AIDC数据中心', '应用闭环'],
    price: 699,
    originPrice: 999,
    studentsCount: 1680,
    reservedCount: 1120,
    instructor: '若琪 · 前沿产业顾问',
    lessons: [
      {
        id: 'ai-1',
        index: '01',
        title: '第01节：全球算力底座：GPU/TPU/ASIC 与先进封装（CoWoS）全景',
        duration: '36:15',
        moduleTag: '算力芯片',
        summary: '从晶圆代工制造到 CoWoS 产能供需瓶颈，梳理英伟达 Blackwell 架构与定制加速芯片演进。'
      },
      {
        id: 'ai-2',
        index: '02',
        title: '第02节：光互联革命：从 800G 到 1.6T 光模块、LPO 与 CPO 方案比选',
        duration: '34:20',
        moduleTag: '光通信',
        summary: '智算集群 Scale-up 与 Scale-out 网络拓扑演进，测算 GPU 与光模块数量配比的超额弹性。'
      },
      {
        id: 'ai-3',
        index: '03',
        title: '第03节：AI的终极瓶颈：北美电力供需、核能SMR与变压器供应链',
        duration: '41:10',
        moduleTag: '电网基建',
        summary: '为什么算力的尽头是电力？深度剖析 AIDC 功耗爆发给独立发电商、电网设备与核能带来的结构性红利。'
      },
      {
        id: 'ai-4',
        index: '04',
        title: '第04节：液冷温控、高密机架与 AIDC 基础设施选址与能效壁垒',
        duration: '29:50',
        moduleTag: 'AIDC数据中心',
        summary: '冷板式与浸没式液冷方案落地成本对比，追踪超大规模数据中心 PUE 指标与资本开支落地。'
      },
      {
        id: 'ai-5',
        index: '05',
        title: '第05节：企业级多模态 Agent 工作流与垂直行业商业变现拐点',
        duration: '38:40',
        moduleTag: '应用闭环',
        summary: '从代码编写、生物制药到买方投研，剖析各行业企业级自主智能体的 ROI 投资回报率测算。'
      },
      {
        id: 'ai-6',
        index: '06',
        title: '第06节：全球 AI 核心持仓组合构建与周期风险防守策略',
        duration: '42:00',
        moduleTag: '应用闭环',
        summary: '如何平衡高景气龙头与二线弹性品种？构建抗波动的核心+卫星仓位结构，防范 Capex 砍单风险。'
      }
    ]
  },
  {
    id: 'course-us-technical',
    title: '美股技术面分析课',
    description: '摒弃玄学指标，从趋势定义、价格结构、箱体区间、左右侧交易纪律、量价配合到波动率控仓与形态失效逃生，建立高胜率客观交易体系。',
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    totalDuration: '3小时37分钟',
    lessonsCount: 6,
    level: '进阶实战',
    categoryLabel: '市场与产业',
    modules: ['趋势', '结构', '区间', '量价', '仓位防守'],
    price: 499,
    originPrice: 799,
    studentsCount: 940,
    reservedCount: 710,
    instructor: '志诚 · 核心合伙人',
    lessons: [
      {
        id: 'ust-1',
        index: '01',
        title: '第01节：趋势判定基石：高低点结构、均线系统与道氏理论实战',
        duration: '31:20',
        moduleTag: '趋势',
        summary: '用最纯粹的高低点推演过滤市场噪音，定义不同时间周期的主趋势与次级折返。'
      },
      {
        id: 'ust-2',
        index: '02',
        title: '第02节：横盘箱体与筹码密集区：突破有效性验证与假突破应对',
        duration: '38:15',
        moduleTag: '结构',
        summary: '解析机构吸筹与派发区间的量价特征，掌握假突破后的快速止损反手策略。'
      },
      {
        id: 'ust-3',
        index: '03',
        title: '第03节：左右侧交易哲学：右侧顺势加仓 vs 左侧关键位试仓风控',
        duration: '29:40',
        moduleTag: '左右侧',
        summary: '明确两种交易体系的胜率与盈亏比数学期望，坚决杜绝左侧抄底被套转死扛的交易恶习。'
      },
      {
        id: 'ust-4',
        index: '04',
        title: '第04节：量价配合原理：放量滞涨、缩量回踩与成交量分布（Volume Profile）',
        duration: '36:30',
        moduleTag: '量价',
        summary: '用成交量验证价格运动的真实意图，定位机构大资金的真实防守底线。'
      },
      {
        id: 'ust-5',
        index: '05',
        title: '第05节：真实波动幅度（ATR）与波动率自适应仓位管理模型',
        duration: '32:50',
        moduleTag: '仓位防守',
        summary: '摒弃固定股数建仓，根据标的自身历史波动率动态调整单笔风险敞口，实现组合风险均衡。'
      },
      {
        id: 'ust-6',
        index: '06',
        title: '第06节：形态失效即逃生：黑天鹅防守纪律与系统性风控清单',
        duration: '35:00',
        moduleTag: '仓位防守',
        summary: '把止损视为经营商业成本，建立交易日志复盘闭环，杜绝情绪化报复性交易。'
      }
    ]
  }
];

export const learningLiveMeetingsMock = {
  // 当前高光推荐/近期主推路演
  spotlight: {
    id: 'tm-live-0',
    meetingCode: '826491305',
    title: '全球议息会议推演与四季度核心持仓复盘',
    columnTag: '市场行情',
    summary: '聚焦汇率走势、美联储降息路径及国内增量政策对A股与港股的核心映射，腾讯会议实时连麦解答星友提问。',
    creator: '老林说宏观',
    creatorTitle: '星主 · 资深宏观对冲基金经理',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'upcoming',
    scheduledStartTime: '每周四 20:00 - 21:30',
    joinUrl: 'https://meeting.tencent.com/dm/826491305',
    participantsCount: 685,
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    isSpotlight: true
  },
  // 后续闭门排期清单
  upcomingList: [
    {
      id: 'tm-2',
      meetingCode: '673134016',
      title: '2026 自主智能体 Agent 产业落地与推理算力架构',
      columnTag: '板块机会',
      dateBadge: '10-15',
      timeBadge: '20:00',
      summary: '拆解多模态 Agent 在企业级工作流中的商业闭环，测算推理侧算力消耗斜率与核心受益环节。',
      creator: '若琪',
      creatorTitle: '前沿产业顾问',
      creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      participantsCount: 412
    },
    {
      id: 'tm-1',
      meetingCode: '215342596',
      title: '全球AI算力基础设施与芯片产业链全景深度剖析',
      columnTag: '板块机会',
      dateBadge: '10-22',
      timeBadge: '19:30',
      summary: '梳理光模块、HBM存储与先进封装最新排产追踪，评估四季度北美云厂商 Capex 资本开支指引。',
      creator: '志诚',
      creatorTitle: '核心合伙人 · 资深分析师',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      participantsCount: 356
    },
    {
      id: 'tm-3',
      meetingCode: '108909847',
      title: '英伟达 (NVIDIA) 护城河与自研 ASIC 芯片竞争博弈',
      columnTag: '重点个股',
      dateBadge: '10-29',
      timeBadge: '20:00',
      summary: '深度对比通用 GPU 与云大厂自研 ASIC 芯片的 TCO 总拥有成本，推演 2027 市场份额格局。',
      creator: '志诚',
      creatorTitle: '核心合伙人 · 资深分析师',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      participantsCount: 289
    },
    {
      id: 'tm-4',
      meetingCode: '701480417',
      title: '科技成长股估值重构与波段止盈防守模型',
      columnTag: '配置思考',
      dateBadge: '11-05',
      timeBadge: '20:00',
      summary: '结合波动率分位指标与自由现金流收益率，建立震荡行情下科技仓位的动态止盈纪律。',
      creator: '若琪',
      creatorTitle: '前沿产业顾问',
      creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      participantsCount: 245
    }
  ],
  // 往期精选录播（电脑端已可完整回放）
  replayList: [
    {
      id: 'tm-8',
      title: '大模型云服务 MaaS 商业化与私有化算力租赁模式演变',
      columnTag: '板块机会',
      date: '往期录播',
      duration: '1小时48分钟',
      creator: '志诚',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      viewsCount: 1240,
      cover: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'tm-9',
      title: '美联储利率决议复盘与降息周期中的大宗商品投资机遇',
      columnTag: '市场行情',
      date: '往期录播',
      duration: '2小时05分钟',
      creator: '老林说宏观',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      viewsCount: 1580,
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80'
    }
  ]
};
