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
  isFreeTrial: boolean;
  updatedAt: string;
  readCount: number;
  summary: string;
  isPinned?: boolean;
  author?: string;
  tags?: string[];
  createdAt?: string;
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
  isCompleted?: boolean;
  leaders?: string[];
  collectedTopics?: CollectedTopic[];
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
  columnTag?: string; // e.g. "「AI产业」剖析"
  columnId?: string;
  summary?: string; // AI 会议总结
  aiMinutes?: string[]; // AI 会议详细要点
  creator: string; // e.g. "志诚", "若琪"
  creatorAvatar?: string;
  status: 'upcoming' | 'live' | 'finished'; // 待开始, 进行中, 已结束
  scheduledStartTime: string; // e.g. "2027-03-05 09:00"
  actualStartTime?: string; // e.g. "2026-09-17 21:01" or "——"
  recordDuration?: string; // e.g. "1小时35分钟"
  recordUrl?: string; // 录播回放地址
  recordSize?: string; // e.g. "1.2 GB"
  joinUrl?: string; // 腾讯会议入会链接
  isSettledToColumn?: boolean; // 是否已沉淀至专栏
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
