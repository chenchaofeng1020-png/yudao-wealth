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
  title?: string;
  content: string;
  tags: string[];
  stocks?: StockMention[];
  images?: string[];
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
  duration?: string;
  wordCount: number;
  isFreeTrial?: boolean;
  updatedAt: string;
  readCount: number;
  readerCount?: number;
  summary?: string;
  isPinned?: boolean;
  author?: string;
  tags?: string[];
  createdAt?: string;
  // 长文状态流转：草稿 / 已上架 / 已下架（未填写时默认已上架）
  status?: 'draft' | 'published' | 'archived';
  // 展示排序：数字越小越靠前，未设置按 0 处理
  sortNo?: number;
  content?: string;
  likesCount?: number;
  comments?: Comment[];
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
  status: 'published' | 'archived';
  // 展示排序：数字越小越靠前（专栏目录拖动排序）
  sortNo?: number;
  isCompleted?: boolean;
  leaders?: string[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isFreeTrial: boolean;
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  cover: string;
  instructor: string;
  instructorTitle: string;
  totalDuration: string;
  lessonsCount: number;
  completedLessons: number;
  level: '初级入门' | '进阶实战' | '高阶策略';
  price: number;
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
  summary?: string; // AI 会议总结
  minutesMarkdown?: string; // 腾讯会议返回的 Markdown 纪要文档（后台可编辑，C 端富文本展示）
  creator: string; // e.g. "志诚", "若琪"
  creatorAvatar?: string;
  status: 'upcoming' | 'live' | 'finished'; // 待开始, 进行中, 已结束
  scheduledStartTime: string; // e.g. "2027-03-05 09:00"
  actualStartTime?: string; // e.g. "2026-09-17 21:01" or "——"
  recordDuration?: string; // e.g. "1小时35分钟"
  recordUrl?: string; // 录播回放地址
  recordSize?: string; // e.g. "1.2 GB"
  joinUrl?: string; // 腾讯会议入会链接
  // 录播上架与定价（上架后 7 天内会员免费，超 7 天所有人需单场购买）
  isOnShelf?: boolean; // true=已上架 false=已下架 未设置=待上架
  shelfTime?: string; // 上架时间（7 天免费期起算点）
  daysSinceShelf?: number; // 距上架天数
  replayPrice?: number; // 单场购买价（元），同时为绑定的商城商品价格
  originPrice?: number; // 划线原价（元）
  purchasedCount?: number; // 已解锁人数（绑定商城商品销量）
  productId?: string; // 关联的商城商品 ID；未设置=按单购价自动创建虚拟商品
  isPurchased?: boolean; // C 端当前用户是否已单场解锁（由商城订单状态决定）
  participantsCount?: number; // 参会人次（腾讯会议同步）
  cover?: string; // 封面图
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
