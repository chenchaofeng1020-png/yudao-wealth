import { reactive, computed, ref, watch } from 'vue';
import { User, Post, PostAttachment, Column, Course, CourseLesson, LiveSession, MemberRecord, UserRole, TencentMeetingRecord } from '../types';
import { currentUserMock, demoVipUserMock, demoGuestUserMock, initialPostsMock, columnsMock, coursesMock, liveSessionsMock, membersMock, tencentMeetingsMock, liveCategoriesMock } from '../mock/data';

export type AppView = 'feed' | 'column' | 'course' | 'live' | 'user' | 'tag' | 'profile';

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
  // 标签二级页：当前查看的标签
  activeTag: '' as string,
  // 用户主页二级页：当前查看的用户名
  activeProfileName: '' as string,
  // 全站搜索关键词（侧边栏回车触发；非空时搜索结果弹窗展示命中内容）
  searchKeyword: '' as string,
  // 搜索输入框文本（侧边栏与搜索弹窗输入框双向同步）
  searchInput: '' as string,
  // 搜索结果弹窗
  isSearchModalOpen: false as boolean,
  
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
  
  // 专栏长文阅读与管理状态
  selectedColumnId: 'col-us-stock' as string,
  selectedArticleId: 'art-mg-1' as string,
  // 后台抽屉嵌入预览模式（URL 带 admin=1 时开启：评论区显示删除按钮，跳过登录墙）
  previewAdmin: false as boolean,
  // 后台嵌入模式（URL 带 embed=1 时开启：隐藏全局侧边菜单，仅呈现文章阅读区）
  previewEmbed: false as boolean,
  bookmarkedArticleIds: [] as string[],
  isColumnAdminModalOpen: false as boolean,

  // 弹窗状态
  isPublishModalOpen: false,
  isVipJoinModalOpen: false,
  isMembersModalOpen: false,
  isPostDetailModalOpen: false,
  detailPostId: null as string | null,
  readingChapter: null as { columnTitle: string; chapterTitle: string; summary: string } | null,
  activeVideoLesson: null as { courseTitle: string; lessonTitle: string } | null,
  toastMessage: '' as string,
  // 个人中心弹窗（个人资料 + 会员信息）
  isUserCenterModalOpen: false,
  // 提问弹窗（向指定星友/专家提问）
  isAskModalOpen: false,
  askTargetName: '' as string,
  askTargetAvatar: '' as string,
});

// ===== 会话持久化：登录/退出状态在刷新后保持 =====
// 场景：退出登录回到介绍页后，刷新页面应停留在介绍页，而不是"自动登录"回到星球
const SESSION_STORAGE_KEY = 'wealth-circle-session';

try {
  const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (savedSession) {
    const saved = JSON.parse(savedSession) as Partial<{
      appFlowState: AppFlowState;
      isLoggedIn: boolean;
      isVipMember: boolean;
      currentPerspective: 'founder' | 'vip' | 'guest';
      user: User;
    }>;
    if (saved.appFlowState) appState.appFlowState = saved.appFlowState;
    if (typeof saved.isLoggedIn === 'boolean') appState.isLoggedIn = saved.isLoggedIn;
    if (typeof saved.isVipMember === 'boolean') appState.isVipMember = saved.isVipMember;
    if (saved.currentPerspective) appState.currentPerspective = saved.currentPerspective;
    if (saved.user) Object.assign(appState.user, saved.user);
  }
} catch {
  // 本地存档损坏时忽略，走默认流程
}

watch(
  () => ({
    appFlowState: appState.appFlowState,
    isLoggedIn: appState.isLoggedIn,
    isVipMember: appState.isVipMember,
    currentPerspective: appState.currentPerspective,
    user: appState.user,
  }),
  snapshot => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
  },
  { deep: true },
);

// 页面切换时同步 URL 参数 ?view=xxx，刷新后恢复到当前页面（不回到资讯首页）
watch(
  () => appState.currentView,
  view => {
    if (view === 'user') return; // 'user' 非实际页面视图，不记录
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.replaceState(null, '', url.toString());
    } catch {
      // URL 更新失败时忽略，不影响页面切换
    }
  },
);

// 计算属性：当前用户是否具备管理权限（星主或合伙人）
export const isManager = computed(() => {
  return appState.user.role === 'founder' || appState.user.role === 'partner';
});

// 计算属性：当前用户是否为会员及以上身份（VIP会员 / 合伙人 / 星主）
export const isVipOrAbove = computed(() => {
  return appState.isVipMember || ['founder', 'partner', 'vip'].includes(appState.user.role);
});

// 当前选中的专栏
export const activeColumn = computed(() => {
  return appState.columns.find(c => c.id === appState.selectedColumnId) || appState.columns[0];
});

// 当前选中的长文
export const activeArticle = computed(() => {
  for (const col of appState.columns) {
    const art = col.chapters.find(ch => ch.id === appState.selectedArticleId);
    if (art) return art;
  }
  return appState.columns[0]?.chapters[0] || null;
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

// 标签二级页：包含当前标签的全部资讯
export const tagFilteredPosts = computed(() => {
  if (!appState.activeTag) return [];
  return appState.posts.filter(p => p.tags && p.tags.includes(appState.activeTag));
});

// 用户主页二级页：该用户发布的全部资讯
export const userProfilePosts = computed(() => {
  if (!appState.activeProfileName) return [];
  return appState.posts.filter(p => p.author.name === appState.activeProfileName);
});

// 角色中文标签
export const roleLabelMap: Record<UserRole, string> = {
  founder: '星主',
  partner: '合伙人',
  vip: '会员',
  member: '星友',
  guest: '嘉宾',
};

// 用户主页：按姓名解析用户资料（依次从当前用户、帖子作者、评论者、成员名录中查找）
export const activeProfileUser = computed(() => {
  const name = appState.activeProfileName;
  if (!name) return null;
  // 1. 当前登录用户
  if (appState.user.name === name) {
    return {
      name: appState.user.name,
      avatar: appState.user.avatar,
      role: appState.user.role as UserRole,
      roleTitle: appState.user.roleTitle,
      bio: appState.user.bio,
    };
  }
  // 2. 帖子作者
  for (const p of appState.posts) {
    if (p.author.name === name) {
      return { name, avatar: p.author.avatar, role: p.author.role, roleTitle: p.author.roleTitle || '', bio: '' };
    }
  }
  // 3. 评论者 / 精选评论者
  for (const p of appState.posts) {
    const c = p.comments.find(c => c.author.name === name) || (p.featuredComment?.author.name === name ? p.featuredComment : undefined);
    if (c) {
      return { name, avatar: c.author.avatar || '', role: c.author.role, roleTitle: '', bio: '' };
    }
  }
  // 4. 成员名录
  const m = appState.members.find(m => m.name === name);
  if (m) {
    return { name: m.name, avatar: m.avatar, role: m.role, roleTitle: m.roleTitle || '', bio: m.bio || '' };
  }
  // 5. 兜底
  return { name, avatar: '', role: 'member' as UserRole, roleTitle: '', bio: '' };
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
      appState.isVipMember = true;
      actions.showToast('已切换至：年度VIP会员视角');
    } else {
      Object.assign(appState.user, demoGuestUserMock);
      appState.isVipMember = false;
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

  // 个人中心弹窗
  openUserCenterModal() {
    appState.isUserCenterModalOpen = true;
  },

  closeUserCenterModal() {
    appState.isUserCenterModalOpen = false;
  },

  // 打开标签二级页：展示包含该标签的全部资讯
  openTagView(tag: string) {
    appState.activeTag = tag;
    appState.currentView = 'tag';
    window.scrollTo({ top: 0 });
  },

  // 打开用户主页二级页：展示该用户发布的全部资讯
  openUserProfile(name: string) {
    appState.activeProfileName = name;
    appState.currentView = 'profile';
    window.scrollTo({ top: 0 });
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
      role: 'member',
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
    Object.assign(appState.user, demoVipUserMock);
    actions.showToast('已安全退出登录，返回「财不外露」官方介绍页');
  },

  // 直接退出登录（不再弹确认框）
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
  publishPost(payload: { title: string; content: string; tags: string[]; stocks?: string[]; isVipOnly: boolean; images?: string[]; attachments?: PostAttachment[] }) {
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
      images: payload.images?.length ? payload.images : undefined,
      attachments: payload.attachments?.length ? payload.attachments : undefined,
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: '刚刚',
      comments: [],
    };
    appState.posts.unshift(newPost);
    appState.isPublishModalOpen = false;
    actions.showToast('资讯发布成功！已同步至星球信息流');
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
      actions.showToast(`已将 ${m.name} 的角色调整为：${newRole === 'partner' ? '合伙人' : newRole === 'vip' ? '会员' : newRole === 'guest' ? '嘉宾' : newRole === 'member' ? '星友' : '星主'}`);
    }
  },

  // 提问弹窗：向指定成员提问（复用发布编辑器）
  openAskModal(targetName: string, targetAvatar?: string) {
    appState.askTargetName = targetName;
    appState.askTargetAvatar = targetAvatar || '';
    appState.isAskModalOpen = true;
  },

  closeAskModal() {
    appState.isAskModalOpen = false;
  },

  submitAskQuestion(targetName: string, question: string) {
    // 提问以「提问帖」形式公开进入信息流，卡片上带提问标识（见 3.7）
    const newPost: Post = {
      id: `post-ask-${Date.now()}`,
      author: {
        id: appState.user.id,
        name: appState.user.name,
        avatar: appState.user.avatar,
        role: appState.user.role,
        roleTitle: appState.user.roleTitle,
      },
      isPinned: false,
      isVipOnly: false,
      questionTarget: targetName,
      content: question,
      tags: [],
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: '刚刚',
      comments: [],
    };
    appState.posts.unshift(newPost);
    appState.isAskModalOpen = false;
    actions.showToast(`已向 ${targetName} 提交提问，TA 将在星球内尽快回复`);
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

  // 专栏长文阅读交互
  selectArticle(columnId: string, articleId: string) {
    appState.selectedColumnId = columnId;
    appState.selectedArticleId = articleId;
  },

  toggleLikeArticle(articleId: string) {
    for (const col of appState.columns) {
      const art = col.chapters.find(ch => ch.id === articleId);
      if (art) {
        if (!art.likers) art.likers = [];
        if (art.isLiked) {
          art.likes = Math.max(0, (art.likes || 1) - 1);
          art.isLiked = false;
          art.likers = art.likers.filter(u => u.name !== appState.user.name);
          actions.showToast('已取消点赞');
        } else {
          art.likes = (art.likes || 0) + 1;
          art.isLiked = true;
          if (!art.likers.some(u => u.name === appState.user.name)) {
            art.likers.unshift({ name: appState.user.name, avatar: appState.user.avatar });
          }
          actions.showToast('❤️ 觉得很赞！已同步点赞动态');
        }
        return;
      }
    }
  },

  toggleBookmarkArticle(articleId: string) {
    const idx = appState.bookmarkedArticleIds.indexOf(articleId);
    if (idx !== -1) {
      appState.bookmarkedArticleIds.splice(idx, 1);
      actions.showToast('已取消收藏该专栏长文');
    } else {
      appState.bookmarkedArticleIds.push(articleId);
      actions.showToast('⭐ 已成功收藏该专栏长文');
    }
  },

  addArticleComment(articleId: string, text: string) {
    if (!text.trim()) return;
    for (const col of appState.columns) {
      const art = col.chapters.find(ch => ch.id === articleId);
      if (art) {
        if (!art.comments) art.comments = [];
        art.comments.push({
          id: 'cm-' + Date.now(),
          author: {
            name: appState.user.name,
            avatar: appState.user.avatar,
            role: appState.user.role
          },
          content: text.trim(),
          createdAt: '刚刚',
          likes: 0
        });
        actions.showToast('评论发表成功！');
        return;
      }
    }
  },

  // 后台预览模式：删除长文评论（评论治理）
  deleteArticleComment(articleId: string, commentId: string) {
    for (const col of appState.columns) {
      const art = col.chapters.find(ch => ch.id === articleId);
      if (art && art.comments) {
        art.comments = art.comments.filter(c => c.id !== commentId);
        actions.showToast('评论已删除');
        return;
      }
    }
  },

  openColumnAdminModal() {
    appState.isColumnAdminModalOpen = true;
  },

  closeColumnAdminModal() {
    appState.isColumnAdminModalOpen = false;
  },

  // 内容中心-专栏模块：保存专栏
  saveColumn(col: Partial<Column>) {
    if (col.id) {
      const existing = appState.columns.find(c => c.id === col.id);
      if (existing) {
        Object.assign(existing, col);
        actions.showToast(`专栏《${existing.title}》已更新`);
        return;
      }
    }
    const newCol: Column = {
      id: 'col-' + Date.now(),
      title: col.title || '「新专栏」深度探索',
      subtitle: col.subtitle || '前沿主题长文系列',
      cover: col.cover || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
      author: col.author || appState.user.name,
      authorTitle: col.authorTitle || appState.user.roleTitle,
      price: col.price || 299,
      originPrice: (col.price || 299) * 2,
      subscriberCount: 0,
      chapterCount: 0,
      tags: col.tags || ['专栏精选'],
      status: col.status || 'published',
      chapters: []
    };
    appState.columns.push(newCol);
    actions.showToast(`专栏《${newCol.title}》已创建并在目录上线`);
  },

  // 内容中心-专栏模块：删除专栏
  deleteColumn(colId: string) {
    const idx = appState.columns.findIndex(c => c.id === colId);
    if (idx !== -1) {
      const title = appState.columns[idx].title;
      appState.columns.splice(idx, 1);
      if (appState.selectedColumnId === colId && appState.columns.length > 0) {
        appState.selectedColumnId = appState.columns[0].id;
        appState.selectedArticleId = appState.columns[0].chapters[0]?.id || '';
      }
      actions.showToast(`专栏《${title}》已删除`);
    }
  },

  // 内容中心-专栏模块：保存长文（新增/编辑）
  saveArticle(article: Partial<ColumnChapter>, targetColumnId?: string) {
    const colId = targetColumnId || article.columnId || appState.selectedColumnId;
    const col = appState.columns.find(c => c.id === colId) || appState.columns[0];
    if (!col) return;

    if (article.id) {
      for (const c of appState.columns) {
        const artIdx = c.chapters.findIndex(ch => ch.id === article.id);
        if (artIdx !== -1) {
          if (c.id === colId) {
            Object.assign(c.chapters[artIdx], article);
            actions.showToast(`长文《${article.title}》已更新`);
            return;
          } else {
            const [removed] = c.chapters.splice(artIdx, 1);
            c.chapterCount = c.chapters.length;
            const updated = { ...removed, ...article, columnId: colId };
            col.chapters.unshift(updated);
            col.chapterCount = col.chapters.length;
            actions.showToast(`长文已转移至专栏《${col.title}》`);
            return;
          }
        }
      }
    }

    const newArt: ColumnChapter = {
      id: 'art-' + Date.now(),
      columnId: col.id,
      title: article.title || '【深度洞察】未命名长文',
      author: article.author || appState.user.name,
      authorAvatar: article.authorAvatar || appState.user.avatar,
      authorRoleTitle: article.authorRoleTitle || appState.user.roleTitle,
      createdAt: '刚刚',
      updatedAt: '刚刚',
      duration: article.duration || '20分钟',
      wordCount: article.content ? article.content.length : 3200,
      readCount: 1,
      isFreeTrial: article.isFreeTrial ?? true,
      isPinned: !!article.isPinned,
      isEssence: !!article.isEssence,
      tags: article.tags && article.tags.length ? article.tags : ['话题研究'],
      linkCard: article.linkCard || { title: article.title || '', url: '#' },
      summary: article.summary || (article.content ? article.content.slice(0, 120) + '...' : '暂无摘要'),
      content: article.content || '正文内容撰写中...',
      likes: 1,
      isLiked: true,
      likers: [{ name: appState.user.name, avatar: appState.user.avatar }],
      comments: []
    };
    col.chapters.unshift(newArt);
    col.chapterCount = col.chapters.length;
    appState.selectedColumnId = col.id;
    appState.selectedArticleId = newArt.id;
    actions.showToast(`长文《${newArt.title}》已发布`);
  },

  // 内容中心-专栏模块：删除长文
  deleteArticle(articleId: string) {
    for (const col of appState.columns) {
      const idx = col.chapters.findIndex(ch => ch.id === articleId);
      if (idx !== -1) {
        const title = col.chapters[idx].title;
        col.chapters.splice(idx, 1);
        col.chapterCount = col.chapters.length;
        if (appState.selectedArticleId === articleId) {
          appState.selectedArticleId = col.chapters[0]?.id || '';
        }
        actions.showToast(`长文《${title}》已删除`);
        return;
      }
    }
  },

  // 内容中心-专栏模块：切换精华
  toggleEssenceArticle(articleId: string) {
    for (const col of appState.columns) {
      const art = col.chapters.find(ch => ch.id === articleId);
      if (art) {
        art.isEssence = !art.isEssence;
        actions.showToast(art.isEssence ? '已将该长文标记为「精华」印章！' : '已取消该长文的「精华」印章');
        return;
      }
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

  // 单独购买某门课程（所有用户均需按课程定价购买后方可解锁观看）
  purchaseCourse(courseId: string) {
    const c = appState.courses.find(item => item.id === courseId);
    if (c) {
      c.isPurchased = true;
      c.studentsCount = (c.studentsCount || 0) + 1;
      actions.showToast(`🎉 支付成功！已为您永久解锁《${c.title}》全部 ${c.lessons.length} 节视频课程`);
    }
  },

  // 标记/切换课程小节完成状态
  toggleCourseLessonComplete(courseId: string, lessonId: string) {
    const c = appState.courses.find(item => item.id === courseId);
    if (c) {
      const lesson = c.lessons.find(l => l.id === lessonId);
      if (lesson) {
        lesson.completed = !lesson.completed;
        c.completedLessons = c.lessons.filter(l => l.completed).length;
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

  // 搜索结果弹窗
  openSearchModal() {
    appState.isSearchModalOpen = true;
  },
  closeSearchModal() {
    appState.isSearchModalOpen = false;
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

  // 单独购买某场腾讯会议录播
  purchaseMeetingReplay(meetingId: string) {
    const meeting = appState.tencentMeetings.find(m => m.id === meetingId);
    if (meeting) {
      meeting.isPurchased = true;
      meeting.purchasedCount = (meeting.purchasedCount || 0) + 1;
      actions.showToast(`🎉 支付成功！已为您永久解锁《${meeting.title.slice(0, 18)}...》完整录播与 AI 纪要`);
    }
  }
};

// ===== URL 参数定位（供管理后台抽屉 iframe 嵌入复用） =====
// 用法：http://localhost:3000/?view=column&column=<colId>&article=<artId>&admin=1
// - admin=1   进入后台预览模式：跳过登录墙直达专栏页，评论区显示删除按钮
// - column=   指定选中的专栏；article= 指定选中的长文（ID 不存在时忽略，走默认）
try {
  const qs = new URLSearchParams(window.location.search);
  const colParam = qs.get('column');
  const artParam = qs.get('article');

  if (qs.get('admin') === '1' || qs.get('embed') === '1' || colParam || artParam) {
    appState.previewAdmin = qs.get('admin') === '1';
    appState.previewEmbed = qs.get('embed') === '1';
    appState.appFlowState = 'community';
    appState.isLoggedIn = true;
    appState.currentView = 'column';
    // 后台预览固定星主身份：全文可见，不出现会员付费墙
    appState.currentPerspective = 'founder';
    appState.user = { ...currentUserMock };
    appState.isVipMember = true;
  }

  if (colParam && appState.columns.some(c => c.id === colParam)) {
    appState.selectedColumnId = colParam;
  }
  if (artParam) {
    for (const col of appState.columns) {
      if (col.chapters.some(ch => ch.id === artParam)) {
        appState.selectedColumnId = col.id;
        appState.selectedArticleId = artParam;
        break;
      }
    }
  }

  // 刷新恢复：普通浏览场景（非后台嵌入/深链定位）下，按 URL 的 view 参数恢复到当前页面
  if (!(qs.get('admin') === '1' || qs.get('embed') === '1' || colParam || artParam)) {
    const viewParam = qs.get('view');
    const validViews: AppView[] = ['feed', 'column', 'course', 'live', 'tag', 'profile'];
    if (viewParam && validViews.includes(viewParam as AppView)) {
      appState.currentView = viewParam as AppView;
    }
  }
} catch {
  // URL 解析失败时忽略，走默认流程
}
