export type UserRole = 'founder' | 'vip' | 'partner' | 'member' | 'guest';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  roleTitle: string;
  bio: string;
  joinedAt: string;
  vipExpireAt?: string;
  phone?: string;
  followingCount: number;
  followersCount: number;
  points: number;
}

export interface StockMention {
  code: string;
  name: string;
  price: string;
  change: string; // e.g. "+3.45%" or "-1.20%"
  isUp: boolean;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: UserRole;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface FeaturedComment {
  id: string;
  author: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

// 帖子附件：图片或常见文档（pdf/doc/xls/ppt/txt 等），按选择顺序混合排列
export interface PostAttachment {
  type: 'image' | 'file';
  name: string;
  url: string;
  size: number;
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    roleTitle: string;
    badge?: string;
  };
  isPinned?: boolean;
  isVipOnly?: boolean;
  questionTarget?: string;
  title?: string;
  content: string;
  tags: string[];
  stocks?: StockMention[];
  images?: string[];
  attachments?: PostAttachment[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  comments: Comment[];
  likers?: string[];
  likersCount?: number;
  featuredComment?: FeaturedComment;
  featuredComments?: FeaturedComment[];
}

export interface ColumnChapter {
  id: string;
  title: string;
  columnId?: string;
  duration?: string;
  wordCount?: number;
  isFreeTrial?: boolean;
  updatedAt?: string;
  createdAt?: string;
  readCount?: number;
  summary?: string;
  content?: string;
  isPinned?: boolean;
  isEssence?: boolean;
  author?: string;
  authorAvatar?: string;
  authorRoleTitle?: string;
  tags?: string[];
  linkCard?: {
    title: string;
    url?: string;
  };
  riskWarning?: string;
  // 展示排序：数字越小越靠前，未设置按 0 处理
  sortNo?: number;
  likes?: number;
  isLiked?: boolean;
  likers?: { name: string; avatar: string }[];
  comments?: Comment[];
  status?: 'published' | 'draft';
  sortOrder?: number;
}

export interface CollectedTopic {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
  collectedAt: string;
  reason?: string;
  tags?: string[];
}

export interface Column {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  author: string;
  authorTitle: string;
  price: number;
  originPrice: number;
  subscriberCount: number;
  chapterCount: number;
  tags: string[];
  chapters: ColumnChapter[];
  status: 'published' | 'draft' | 'archived';
  // 展示排序：数字越小越靠前，未设置按 0 处理（与后台专栏目录拖动顺序同步）
  sortNo?: number;
  isCompleted?: boolean;
  leaders?: string[];
  collectedTopics?: CollectedTopic[];
  sortOrder?: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isFreeTrial: boolean;
  completed?: boolean;
  moduleTag?: string;
  summary?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  cover: string;
  instructor?: string;
  instructorTitle?: string;
  totalDuration: string;
  lessonsCount: number;
  completedLessons: number;
  level: '初级入门' | '进阶实战' | '高阶策略';
  category?: 'foundation' | 'market' | 'strategy';
  categoryLabel?: string;
  modules?: string[];
  price: number;
  originPrice?: number;
  priceNote?: string;
  isPurchased?: boolean;
  studentsCount: number;
  lessons: CourseLesson[];
  status: 'published' | 'draft';
}

export interface LiveSession {
  id: string;
  title: string;
  host: string;
  hostAvatar: string;
  hostTitle: string;
  scheduledTime: string;
  status: 'live' | 'upcoming' | 'replay';
  viewersCount: number;
  description: string;
  cover: string;
  streamUrl?: string;
  replayDuration?: string;
}

export interface TencentMeetingRecord {
  id: string;
  meetingCode: string; // e.g. "215 342 596"
  title: string;
  columnTag?: string; // 直播分类：市场行情 / 板块机会 / 重点个股 / 配置思考
  columnId?: string;
  summary?: string; // AI 会议总结 / 直播简介
  minutesMarkdown?: string; // 腾讯会议返回的 Markdown 纪要文档（后台可编辑）
  creator: string; // e.g. "志诚", "若琪"
  creatorAvatar?: string;
  creatorTitle?: string; // e.g. "星主 / 资深宏观对冲基金经理"
  status: 'upcoming' | 'live' | 'finished'; // 待开始, 进行中, 已结束
  scheduledStartTime: string; // e.g. "2026-09-28 20:00"
  actualStartTime?: string; // e.g. "2026-09-28 19:58" or "——"
  recordDuration?: string; // e.g. "1小时35分钟"
  recordUrl?: string; // 录播回放地址
  recordSize?: string; // e.g. "1.2 GB"
  joinUrl?: string; // 腾讯会议入会链接
  cover?: string; // 会议/录播封面
  participantsCount?: number; // 参会/观看人数
  // 录播上架与定价（7天内会员免费，7天后需单独购买）
  isOnShelf?: boolean; // 录播是否已上架
  shelfTime?: string; // 录播上架时间，如 "2026-09-25 14:00"
  daysSinceShelf?: number; // 距离上架天数（<= 7 天会员免费，> 7 天需单独购买）
  replayPrice?: number; // 后台上架设定的单独购买价格（元）
  originPrice?: number; // 划线原价（元）
  isPurchased?: boolean; // 当前用户是否已单独购买该场录播
  purchasedCount?: number; // 已购/解锁人数
}

export interface MemberRecord {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'muted' | 'expired';
  spendTotal: number;
  joinedAt: string;
  lastActive: string;
  notes?: string;
  roleTitle?: string;
  bio?: string;
  // 会员开通信息（前端展示用）
  membershipStatus?: 'active' | 'expired';
  membershipStart?: string;
  membershipEnd?: string;
}
