import { reactive, computed } from 'vue';
import { User, Post, Column, Course, CourseLesson, LiveSession, MemberRecord, UserRole, TencentMeetingRecord } from './types';
import { currentUserMock, demoVipUserMock, demoGuestUserMock, initialPostsMock, columnsMock, coursesMock, liveSessionsMock, membersMock, tencentMeetingsMock, liveCategoriesMock, mallProductsMock } from './data';

export type AppView = 'feed' | 'column' | 'course' | 'live' | 'user' | 'admin_column' | 'admin_live' | 'admin_course' | 'admin_members' | 'admin_content';

export type FeedFilterType = 'latest' | 'trade_track' | 'market_news' | 'wealth_news' | 'topic_research' | 'essence' | 'all' | 'founder' | 'qa' | 'vip';

export type AppFlowState = 'landing' | 'paywall' | 'community';

// 全局响应式状态
export const appState = reactive({
  // 顶层流程状态：'landing' (介绍页) | 'paywall' (开通会员页) | 'community' (主星球)
  appFlowState: 'community' as AppFlowState,
  isAuthModalOpen: false,
  authModalMode: 'register' as 'login' | 'register',
  isLoggedIn: false,
  isVipMember: false,

  currentView: 'feed' as AppView,
  feedFilter: 'latest' as FeedFilterType,
  
  // 视角切换：'founder' (星主管理员视角) | 'vip' (普通会员视角) | 'guest' (注册未开通会员视角)
  currentPerspective: 'founder' as 'founder' | 'vip' | 'guest',
  
  // 当前登录用户
  user: { ...currentUserMock } as User,
  
  // 星球内容数据
  posts: [...initialPostsMock] as Post[],
  columns: [...columnsMock] as Column[],
  courses: [...coursesMock] as Course[],
  liveSessions: [...liveSessionsMock] as LiveSession[],
  members: [...membersMock] as MemberRecord[],
  tencentMeetings: [...tencentMeetingsMock] as TencentMeetingRecord[],
  // 直播分类（后台「分类设置」维护，后台筛选与 C 端直播页共用）
  liveCategories: [...liveCategoriesMock] as string[],
  
  // 弹窗状态
  isPublishModalOpen: false,
  isVipJoinModalOpen: false,
  isMembersModalOpen: false,
  isPostDetailModalOpen: false,
  detailPostId: null as string | null,
  readingChapter: null as { columnTitle: string; chapterTitle: string; summary: string } | null,
  activeVideoLesson: null as { courseTitle: string; lessonTitle: string } | null,
  toastMessage: '' as string,
  isLogoutModalOpen: false,
});

// 计算属性：当前用户是否具备管理权限（星主或合伙人）
export const isManager = computed(() => {
  return appState.user.role === 'founder' || appState.user.role === 'partner';
});

// 筛选后的帖子流
export const filteredPosts = computed(() => {
  if (appState.feedFilter === 'essence') {
    return appState.posts.filter(p => p.isPinned || p.likes > 200 || p.tags.includes('机构观点'));
  }
  if (appState.feedFilter === 'trade_track') {
    return appState.posts.filter(p => (p.stocks && p.stocks.length > 0) || p.tags.some(t => t.includes('策略') || t.includes('交易')));
  }
  if (appState.feedFilter === 'market_news') {
    return appState.posts.filter(p => p.tags.some(t => t.includes('市场') || t.includes('资讯') || t.includes('机构')));
  }
  if (appState.feedFilter === 'wealth_news') {
    return appState.posts.filter(p => p.tags.some(t => t.includes('红利') || t.includes('资产') || t.includes('理财')));
  }
  if (appState.feedFilter === 'topic_research') {
    return appState.posts.filter(p => p.tags.some(t => t.includes('研报') || t.includes('宏观') || t.includes('策略')));
  }
  if (appState.feedFilter === 'founder') {
    return appState.posts.filter(p => p.author.role === 'founder');
  }
  if (appState.feedFilter === 'vip') {
    return appState.posts.filter(p => p.isVipOnly);
  }
  if (appState.feedFilter === 'qa') {
    return appState.posts.filter(p => p.tags.includes('干货教学') || p.tags.includes('财报分析'));
  }
  return appState.posts;
});

// Actions
export const actions = {
  // 切换演示角色（方便体验星主管理与会员浏览体验）
  switchPerspective(role: 'founder' | 'vip' | 'guest') {
    appState.currentPerspective = role;
    if (role === 'founder') {
      Object.assign(appState.user, currentUserMock);
      actions.showToast('已切换至：星主/管理员视角（具备后台与发布特权）');
    } else if (role === 'vip') {
      Object.assign(appState.user, demoVipUserMock);
      if (appState.currentView.startsWith('admin_')) {
        appState.currentView = 'feed';
      }
      actions.showToast('已切换至：年度VIP会员视角');
    } else {
      Object.assign(appState.user, demoGuestUserMock);
      if (appState.currentView.startsWith('admin_')) {
        appState.currentView = 'feed';
      }
      actions.showToast('已切换至：注册用户视角（未开通会员，评论/提问/发布等操作将受限）');
    }
  },

  // 注册未开通会员用户触发受限操作时：提示 + 弹出开通会员弹窗
  requireVip(hint?: string) {
    if (hint) {
      actions.showToast(hint);
    }
    appState.isVipJoinModalOpen = true;
  },

  setCurrentView(view: AppView) {
    appState.currentView = view;
  },

  setFeedFilter(filter: FeedFilterType) {
    appState.feedFilter = filter;
  },

  showToast(msg: string) {
    appState.toastMessage = msg;
    setTimeout(() => {
      if (appState.toastMessage === msg) {
        appState.toastMessage = '';
      }
    }, 2800);
  },

  // 认证与会员开通流程管理
  openAuth(mode: 'login' | 'register' = 'register') {
    appState.authModalMode = mode;
    appState.isAuthModalOpen = true;
  },

  closeAuth() {
    appState.isAuthModalOpen = false;
  },

  submitAuth(phone: string = '13800008888', nickname?: string) {
    appState.isAuthModalOpen = false;
    appState.isLoggedIn = true;
    appState.user = {
      id: 'u-registered-' + Date.now().toString().slice(-4),
      name: nickname?.trim() || ('新晋星友_' + (phone.length >= 4 ? phone.slice(-4) : '8888')),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'guest',
      roleTitle: '已注册 (未开通VIP)',
      bio: '新加入「财不外露」星球，正在开启资产配置进阶之旅。',
      joinedAt: new Date().toISOString().split('T')[0],
      vipExpireAt: '未开通',
      followingCount: 0,
      followersCount: 0,
      points: 50,
    };
    // 注册成功后直接进入星球
    appState.appFlowState = 'community';
    appState.currentView = 'feed';
    actions.showToast('🎉 注册成功！欢迎加入「财不外露」私享星球');
  },

  completePayment(tier: 'annual' | 'lifetime' = 'annual') {
    appState.isVipMember = true;
    appState.user.role = 'vip';
    appState.user.roleTitle = tier === 'lifetime' ? '终身创始合伙人' : '年度白金VIP会员';
    appState.user.vipExpireAt = tier === 'lifetime' ? '终身有效' : '2027-09-18';
    appState.currentPerspective = 'vip';
    appState.appFlowState = 'community';
    appState.currentView = 'feed';
    actions.showToast('💎 恭喜成功开通！已为您解锁「财不外露」全部私享特权');
  },

  resetFlow() {
    appState.appFlowState = 'landing';
    appState.isLoggedIn = false;
    appState.isVipMember = false;
    appState.currentPerspective = 'vip';
    appState.isLogoutModalOpen = false;
    Object.assign(appState.user, demoVipUserMock);
    actions.showToast('已安全退出登录，返回「财不外露」官方介绍页');
  },

  openLogoutModal() {
    appState.isLogoutModalOpen = true;
  },

  closeLogoutModal() {
    appState.isLogoutModalOpen = false;
  },

  confirmLogout() {
    actions.resetFlow();
  },

  skipToCommunity() {
    appState.isLoggedIn = true;
    appState.isVipMember = true;
    appState.appFlowState = 'community';
    actions.showToast('已直接进入「财不外露」私享星球');
  },

  // 动态发布
  publishPost(payload: { title: string; content: string; tags: string[]; stocks?: string[]; isVipOnly: boolean }) {
    const newPost: Post = {
      id: 'post-' + Date.now(),
      author: {
        id: appState.user.id,
        name: appState.user.name,
        avatar: appState.user.avatar,
        role: appState.user.role,
        roleTitle: appState.user.roleTitle,
        badge: appState.user.role === 'founder' ? '星主动态' : 'VIP动态',
      },
      isPinned: false,
      isVipOnly: payload.isVipOnly,
      title: payload.title || undefined,
      content: payload.content,
      tags: payload.tags.length ? payload.tags : ['理财思考'],
      stocks: payload.stocks?.map(s => ({
        code: s,
        name: s.includes('00700') ? '腾讯控股' : s.includes('600900') ? '长江电力' : '重点跟踪标的',
        price: '实时跟踪中',
        change: '+0.00%',
        isUp: true
      })),
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: '刚刚',
      comments: [],
    };
    appState.posts.unshift(newPost);
    appState.isPublishModalOpen = false;
    actions.showToast('主题动态发布成功！已同步至星球信息流');
  },

  // 删除动态
  deletePost(postId: string) {
    const idx = appState.posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
      appState.posts.splice(idx, 1);
      actions.showToast('动态已删除');
    }
  },

  // 点赞动态
  toggleLikePost(postId: string) {
    const post = appState.posts.find(p => p.id === postId);
    if (post) {
      if (!post.likers) {
        post.likers = [];
      }
      if (post.isLiked) {
        post.likes -= 1;
        post.isLiked = false;
        post.likers = post.likers.filter(u => u !== appState.user.name);
        if (post.likersCount) post.likersCount -= 1;
      } else {
        post.likes += 1;
        post.isLiked = true;
        if (!post.likers.includes(appState.user.name)) {
          post.likers.unshift(appState.user.name);
        }
        if (post.likersCount !== undefined) {
          post.likersCount += 1;
        } else {
          post.likersCount = post.likes;
        }
      }
    }
  },

  // 添加评论
  addComment(postId: string, text: string) {
    const post = appState.posts.find(p => p.id === postId);
    if (post && text.trim()) {
      post.comments.push({
        id: 'c-' + Date.now(),
        author: {
          name: appState.user.name,
          avatar: appState.user.avatar,
          role: appState.user.role,
        },
        content: text.trim(),
        createdAt: '刚刚',
        likes: 0,
      });
      post.commentsCount += 1;
      actions.showToast('评论已发送');
    }
  },

  // 阅读专栏
  openChapter(columnTitle: string, chapterTitle: string, summary: string) {
    appState.readingChapter = { columnTitle, chapterTitle, summary };
  },

  closeChapter() {
    appState.readingChapter = null;
  },

  // 播放课程课时
  playLesson(courseTitle: string, lessonTitle: string) {
    appState.activeVideoLesson = { courseTitle, lessonTitle };
  },

  closeLesson() {
    appState.activeVideoLesson = null;
  },

  // 会员加入/续费
  joinVip() {
    appState.user.role = 'vip';
    appState.user.roleTitle = '年度白金VIP会员';
    appState.user.vipExpireAt = '2027-09-18';
    appState.isVipMember = true;
    if (appState.currentPerspective === 'guest') {
      appState.currentPerspective = 'vip';
    }
    appState.isVipJoinModalOpen = false;
    actions.showToast('恭喜！已成功开通「财不外露」年度私享会员，全站特权已解锁');
  },

  // 管理后台：更新成员角色
  updateMemberRole(memberId: string, newRole: UserRole) {
    const m = appState.members.find(x => x.id === memberId);
    if (m) {
      m.role = newRole;
      actions.showToast(`已将 ${m.name} 的角色调整为：${newRole === 'partner' ? '合伙人' : newRole === 'vip' ? '会员' : newRole === 'guest' ? '嘉宾' : newRole === 'member' ? '普通成员' : '星主'}`);
    }
  },

  // 管理后台：禁言/解禁成员
  toggleMuteMember(memberId: string) {
    const m = appState.members.find(x => x.id === memberId);
    if (m) {
      m.status = m.status === 'muted' ? 'active' : 'muted';
      actions.showToast(`已${m.status === 'muted' ? '禁言' : '解除禁言'}成员：${m.name}`);
    }
  },

  // 管理后台：移除成员
  removeMember(memberId: string) {
    const idx = appState.members.findIndex(x => x.id === memberId);
    if (idx !== -1) {
      const name = appState.members[idx].name;
      appState.members.splice(idx, 1);
      actions.showToast(`已将成员 ${name} 移出星球`);
    }
  },

  // 管理后台：更新成员基础信息
  updateMember(memberId: string, patch: Partial<MemberRecord>) {
    const m = appState.members.find(x => x.id === memberId);
    if (m) Object.assign(m, patch);
  },

  // 管理后台：新增专栏
  createColumn(col: Partial<Column>) {
    const newCol: Column = {
      id: 'col-' + Date.now(),
      title: col.title || '《新理财研究手记》',
      subtitle: col.subtitle || '深度推演大类资产配置',
      cover: col.cover || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
      author: appState.user.name,
      authorTitle: appState.user.roleTitle,
      price: col.price || 199,
      originPrice: (col.price || 199) * 2,
      subscriberCount: 1,
      chapterCount: 1,
      tags: ['实战专栏'],
      status: 'published',
      // 排序号越大越靠前：新专栏取当前最大值 +1，保证排在目录最前
      sortNo: Math.max(0, ...appState.columns.map(c => c.sortNo ?? 0)) + 1,
      chapters: [
        {
          id: 'ch-new-1',
          title: '发刊词：把握确定性',
          wordCount: 3200,
          status: 'published',
          updatedAt: '今天',
          readCount: 1,
          readerCount: 1,
          likesCount: 0,
          summary: '新专栏发刊词内容'
        }
      ]
    };
    appState.columns.unshift(newCol);
    actions.showToast('专栏创建成功！已在学习中心上架');
  },

  // 管理后台：下架专栏
  toggleColumnStatus(colId: string) {
    const col = appState.columns.find(c => c.id === colId);
    if (col) {
      col.status = col.status === 'published' ? 'archived' : 'published';
      actions.showToast(`专栏《${col.title}》已${col.status === 'published' ? '上架' : '下架'}`);
    }
  },

  // 管理后台：删除专栏
  deleteColumn(colId: string) {
    const idx = appState.columns.findIndex(c => c.id === colId);
    if (idx !== -1) {
      appState.columns.splice(idx, 1);
      actions.showToast('专栏已删除');
    }
  },

  // 管理后台：创建/排期新直播
  createLiveSession(live: Partial<LiveSession>) {
    const newLive: LiveSession = {
      id: 'live-' + Date.now(),
      title: live.title || '【私享直播】主题研讨与答疑',
      host: live.host || appState.user.name,
      hostAvatar: live.hostAvatar || appState.user.avatar,
      hostTitle: live.hostTitle || appState.user.roleTitle,
      scheduledTime: live.scheduledTime || '即将开播',
      status: live.status || 'upcoming',
      viewersCount: live.viewersCount || 0,
      description: live.description || '星球专属直播，聚焦大类资产与行业最新动态',
      cover: live.cover || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
      streamUrl: live.streamUrl || 'rtmp://live.wealth-circle.internal/stream/' + Date.now().toString().slice(-6),
      replayDuration: live.replayDuration
    };
    appState.liveSessions.unshift(newLive);
    actions.showToast('直播排期已创建成功！');
  },

  // 管理后台：更新直播状态
  updateLiveStatus(id: string, status: 'live' | 'upcoming' | 'replay') {
    const item = appState.liveSessions.find(l => l.id === id);
    if (item) {
      item.status = status;
      const statusLabels = { live: '正在直播', upcoming: '预告中', replay: '已转为回放' };
      actions.showToast(`直播状态已更新为：${statusLabels[status]}`);
    }
  },

  // 管理后台：删除直播
  deleteLiveSession(id: string) {
    const idx = appState.liveSessions.findIndex(l => l.id === id);
    if (idx !== -1) {
      appState.liveSessions.splice(idx, 1);
      actions.showToast('直播记录已删除');
    }
  },

  // 管理后台：新建课程
  createCourse(course: Partial<Course>) {
    const newCourse: Course = {
      id: 'course-' + Date.now(),
      title: course.title || '【实战体系】新课程体系',
      description: course.description || '系统化投资投研体系化训练课程',
      cover: course.cover || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80',
      instructor: course.instructor || appState.user.name,
      instructorTitle: course.instructorTitle || appState.user.roleTitle,
      totalDuration: course.totalDuration || '3小时30分钟',
      lessonsCount: course.lessons ? course.lessons.length : 1,
      completedLessons: 0,
      level: course.level || '初级入门',
      price: course.price || 399,
      studentsCount: 0,
      status: course.status || 'published',
      lessons: course.lessons || [
        { id: 'ls-' + Date.now(), title: '第01课：课程前言与学习导读', duration: '18:20', isFreeTrial: true, completed: false }
      ]
    };
    appState.courses.unshift(newCourse);
    actions.showToast('课程体系已创建上架！');
  },

  // 管理后台：下架/上架课程
  toggleCourseStatus(courseId: string) {
    const c = appState.courses.find(item => item.id === courseId);
    if (c) {
      c.status = c.status === 'published' ? 'draft' : 'published';
      actions.showToast(`课程《${c.title}》已${c.status === 'published' ? '上架' : '设为草稿'}`);
    }
  },

  // 管理后台：删除课程
  deleteCourse(courseId: string) {
    const idx = appState.courses.findIndex(c => c.id === courseId);
    if (idx !== -1) {
      appState.courses.splice(idx, 1);
      actions.showToast('课程已删除');
    }
  },

  // 管理后台：给课程添加课时
  addCourseLesson(courseId: string, lesson: Partial<CourseLesson>) {
    const c = appState.courses.find(item => item.id === courseId);
    if (c) {
      const newLesson: CourseLesson = {
        id: 'ls-' + Date.now(),
        title: lesson.title || `第0${c.lessons.length + 1}课：未命名课时`,
        duration: lesson.duration || '25:00',
        isFreeTrial: !!lesson.isFreeTrial,
        completed: false
      };
      c.lessons.push(newLesson);
      c.lessonsCount = c.lessons.length;
      actions.showToast('课时添加成功！');
    }
  },

  // 管理后台：删除课时
  deleteCourseLesson(courseId: string, lessonId: string) {
    const c = appState.courses.find(item => item.id === courseId);
    if (c) {
      const idx = c.lessons.findIndex(l => l.id === lessonId);
      if (idx !== -1) {
        c.lessons.splice(idx, 1);
        c.lessonsCount = c.lessons.length;
        actions.showToast('课时已删除');
      }
    }
  },

  // 星球成员弹窗
  openMembersModal() {
    appState.isMembersModalOpen = true;
  },
  closeMembersModal() {
    appState.isMembersModalOpen = false;
  },

  // 主题详情弹窗
  openPostDetail(postId: string) {
    appState.detailPostId = postId;
    appState.isPostDetailModalOpen = true;
  },
  closePostDetail() {
    appState.isPostDetailModalOpen = false;
    appState.detailPostId = null;
  },

  // 腾讯会议同步与录播管理
  syncTencentMeetings() {
    actions.showToast('正在从腾讯会议开放平台同步会议云录制与 AI 纪要...');
    setTimeout(() => {
      // 模拟将即将到期的最新一场已结束会议拉取到最新录制
      const item = appState.tencentMeetings.find(m => m.id === 'tm-7');
      if (item && item.status !== 'finished') {
        item.status = 'finished';
        item.actualStartTime = '2026-09-18 19:02';
        item.summary = '详细梳理了结构化固收+策略的核心配置逻辑，研讨了利用利率债与高分红红利低波资产进行风险避险的实际测算。';
        item.recordDuration = '1小时20分钟';
        item.recordSize = '1.18 GB';
        item.recordUrl = 'https://cdn.wealth-circle.com/tencent-meeting/rec_340592206.mp4';
        item.minutesMarkdown = '1. 结构化固收+工具特点与散户适用边界。\n2. 利率债与可转债底仓配置比例，如何动态平衡贝塔收益与下行回撤。\n3. 问答汇总：解答了关于中短债基金换手率及同业存单配置风险的提问。';
      }
      actions.showToast('✅ 腾讯会议同步完成！已成功拉取最新云录制切片与 AI 纪要');
    }, 900);
  },

  // 删除腾讯会议记录
  deleteTencentMeeting(id: string) {
    const idx = appState.tencentMeetings.findIndex(m => m.id === id);
    if (idx !== -1) {
      const title = appState.tencentMeetings[idx].title;
      appState.tencentMeetings.splice(idx, 1);
      actions.showToast(`已删除会议记录：${title.slice(0, 16)}...`);
    }
  },

  // 重置演示会议数据
  resetTencentMeetings() {
    appState.tencentMeetings = [...tencentMeetingsMock];
    actions.showToast('腾讯会议排期与录制数据已重置');
  },

  // 录播上架：简单动作，展示内容（价格/封面/简介/纪要等）由「设置」抽屉统一维护
  shelfMeetingReplay(meetingId: string) {
    const meeting = appState.tencentMeetings.find(m => m.id === meetingId);
    if (!meeting) return;

    const isFirstShelf = meeting.isOnShelf !== true; // 首次上架才起算免费期，重新上架沿用原绑定
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const shelfTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    meeting.isOnShelf = true;
    if (!meeting.replayPrice) meeting.replayPrice = 49; // 未配置价格时给默认单购价，可在设置中修改
    if (isFirstShelf) {
      meeting.shelfTime = shelfTime;
      meeting.daysSinceShelf = 0;
    }

    actions.showToast(isFirstShelf
      ? `✅ 录播已上架，单购价 ¥${meeting.replayPrice}，会员限免 7 天自即日起算`
      : `✅ 录播已重新上架，免费期沿用原上架时间（${meeting.shelfTime}）`);
  },

  // 录播下架：C 端回放画廊不再展示，历史配置保留
  unshelfMeetingReplay(meetingId: string) {
    const meeting = appState.tencentMeetings.find(m => m.id === meetingId);
    if (meeting) {
      meeting.isOnShelf = false;
      actions.showToast(`已下架录播：《${meeting.title.slice(0, 16)}...》`);
    }
  },

  // 保存录播的编辑内容（分类 / 主讲人 / 封面 / 简介 / AI 纪要 / 定价 / 关联商城商品）
  updateMeetingReplayConfig(meetingId: string, patch: {
    columnTag?: string;
    creator?: string;
    creatorAvatar?: string;
    replayPrice?: number;
    originPrice?: number;
    summary?: string;
    cover?: string;
    minutesMarkdown?: string;
    productId?: string;
  }) {
    const meeting = appState.tencentMeetings.find(m => m.id === meetingId);
    if (!meeting) return;
    if (patch.columnTag !== undefined) meeting.columnTag = patch.columnTag;
    if (patch.creator !== undefined) meeting.creator = patch.creator;
    if (patch.creatorAvatar !== undefined) meeting.creatorAvatar = patch.creatorAvatar || undefined;
    if (typeof patch.replayPrice === 'number') meeting.replayPrice = patch.replayPrice;
    if (patch.originPrice !== undefined) meeting.originPrice = patch.originPrice;
    if (patch.summary !== undefined) meeting.summary = patch.summary;
    if (patch.cover) meeting.cover = patch.cover;
    if (patch.minutesMarkdown !== undefined) meeting.minutesMarkdown = patch.minutesMarkdown;
    if (patch.productId !== undefined) meeting.productId = patch.productId;
    actions.showToast('已保存修改，C 端将同步更新');
  },

  // ===== 直播分类设置 =====
  // 保存分类列表（整体替换，去空去重）
  applyLiveCategories(list: string[]) {
    const cleaned = Array.from(new Set(list.map(s => s.trim()).filter(Boolean)));
    if (cleaned.length === 0) {
      actions.showToast('请至少保留一个分类');
      return;
    }
    appState.liveCategories = cleaned;
    actions.showToast('分类设置已保存');
  }
};
