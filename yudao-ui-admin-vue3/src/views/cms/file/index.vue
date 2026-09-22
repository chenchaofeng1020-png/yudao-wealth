<template>
  <div class="course-manage-layout animate-fade-in">
    <!-- Top Header Bar: Title matching menu name -->
    <header class="cms-header-bar">
      <h1 class="header-title">课程管理</h1>
    </header>

    <!-- Two-Column Workbench Body -->
    <div class="cms-main-container">
      <!-- 1. Left Course List Aside -->
      <aside class="course-tree-aside">
        <div class="tree-header-card">
          <div class="tree-title-group">
            <div class="tree-icon-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div class="tree-title-texts">
              <h4 class="tree-title">课程体系</h4>
              <span class="tree-subtitle">共 {{ appState.courses.length }} 门进阶课程</span>
            </div>
          </div>

          <div class="tree-toolbar-row">
            <button class="btn-add-course" @click="openCreateCourseModal">
              + 新建课程
            </button>
          </div>
        </div>

        <!-- Course List Items -->
        <div class="course-scroll-container">
          <div 
            v-for="course in appState.courses" 
            :key="course.id" 
            :class="['course-nav-card', { active: selectedCourseId === course.id }]"
            @click="selectCourse(course)"
          >
            <img :src="course.cover" class="course-nav-thumb" :alt="course.title" />
            <div class="course-nav-meta">
              <h5 class="course-nav-title" :title="course.title">{{ course.title }}</h5>
              <div class="course-nav-sub">
                <span :class="['level-chip', getLevelClass(course.level)]">{{ course.level }}</span>
                <span class="lessons-count">{{ course.lessons.length }} 讲</span>
                <span class="status-pill" :class="course.status === 'published' ? 'published' : 'draft'">
                  {{ course.status === 'published' ? '已上架' : '草稿' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 2. Right Main Panel: Course Workbench -->
      <main class="workbench-main-panel" v-if="selectedCourse">
        <!-- Course Header Info Card -->
        <div class="course-banner-card">
          <div class="banner-top-row">
            <img :src="selectedCourse.cover" class="banner-cover" alt="Course Cover" />
            <div class="banner-meta-col">
              <div class="banner-tags-row">
                <span :class="['level-chip-large', getLevelClass(selectedCourse.level)]">
                  {{ selectedCourse.level }}
                </span>
                <span class="status-chip-large" :class="selectedCourse.status === 'published' ? 'published' : 'draft'">
                  ● {{ selectedCourse.status === 'published' ? '在线销售中' : '未发布草稿' }}
                </span>
                <span class="price-chip-large">
                  ¥{{ selectedCourse.price }} <small class="vip-free">VIP会员专享免费</small>
                </span>
              </div>

              <h2 class="banner-title">{{ selectedCourse.title }}</h2>
              <p class="banner-desc">{{ selectedCourse.description }}</p>

              <div class="instructor-row">
                <span class="instructor-label">授课导师：</span>
                <span class="instructor-name">{{ selectedCourse.instructor }}</span>
                <span class="instructor-title">({{ selectedCourse.instructorTitle }})</span>
                <span class="duration-tag">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  总时长约 {{ selectedCourse.totalDuration }}
                </span>
              </div>
            </div>

            <!-- Header Action Tools -->
            <div class="banner-action-col">
              <button class="btn-primary-action" @click="openAddLessonModal">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                新增课时
              </button>

              <button class="btn-outline-action" @click="openEditCourseModal(selectedCourse)">
                编辑课程资料
              </button>

              <button 
                class="btn-outline-action" 
                @click="actions.toggleCourseStatus(selectedCourse.id)"
              >
                {{ selectedCourse.status === 'published' ? '下架为草稿' : '发布上架' }}
              </button>

              <button class="btn-text-danger" @click="handleDeleteCourse(selectedCourse)">
                删除本课程
              </button>
            </div>
          </div>

          <!-- Course Stat Metrics Bar -->
          <div class="metrics-bar">
            <div class="metric-item">
              <span class="metric-val">{{ selectedCourse.lessons.length }}</span>
              <span class="metric-lab">已编排课时 (讲)</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val">{{ selectedCourse.studentsCount }}</span>
              <span class="metric-lab">累计学员人次</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val">{{ trialLessonsCount }}</span>
              <span class="metric-lab">免费试听讲数</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val">89.4%</span>
              <span class="metric-lab">全课完播好评率</span>
            </div>
          </div>
        </div>

        <!-- Course Curriculum Section -->
        <div class="curriculum-workbench-card">
          <div class="curriculum-header">
            <div class="curriculum-title-side">
              <h3 class="curriculum-title">课时大纲与内容排期</h3>
              <span class="curriculum-sub">拖拽或通过右侧操作可调整课时顺序及试听权限</span>
            </div>

            <button class="btn-small-add" @click="openAddLessonModal">
              + 添加单个课时
            </button>
          </div>

          <div v-if="selectedCourse.lessons.length === 0" class="empty-curriculum">
            <p>该课程暂无课时，请点击上方「新增课时」添加视频或文字大纲</p>
          </div>

          <div v-else class="lessons-table-container">
            <table class="lessons-table">
              <thead>
                <tr>
                  <th style="width: 70px;">序号</th>
                  <th>课时名称</th>
                  <th style="width: 110px;">预计时长</th>
                  <th style="width: 120px;">试看权限</th>
                  <th style="width: 140px;">课件资料</th>
                  <th style="width: 160px; text-align: right;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(lesson, idx) in selectedCourse.lessons" :key="lesson.id">
                  <td>
                    <span class="index-badge">第 {{ idx + 1 < 10 ? '0' + (idx + 1) : (idx + 1) }} 讲</span>
                  </td>
                  <td>
                    <div class="lesson-title-cell">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                      <span class="lesson-name-text">{{ lesson.title }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="duration-cell">{{ lesson.duration }}</span>
                  </td>
                  <td>
                    <span 
                      :class="['trial-switch-badge', lesson.isFreeTrial ? 'is-trial' : 'is-vip']"
                      @click="toggleTrial(lesson)"
                      :title="'点击切换为' + (lesson.isFreeTrial ? 'VIP专享' : '免费试听')"
                    >
                      {{ lesson.isFreeTrial ? '免费试听' : 'VIP专享' }}
                    </span>
                  </td>
                  <td>
                    <span class="doc-attachment-badge" @click="actions.showToast('课件资料包已就绪 (PDF/思维导图)')">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      实战讲义.pdf
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div class="table-actions-row">
                      <button class="tb-btn primary" @click="playLessonPreview(selectedCourse.title, lesson.title)">
                        试看
                      </button>
                      <button class="tb-btn" @click="openEditLessonModal(lesson)">
                        编辑
                      </button>
                      <button class="tb-btn danger" @click="handleDeleteLesson(lesson.id)">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal 1: 新建 / 编辑课程体系 -->
    <transition name="modal-fade">
      <div v-if="isCourseModalOpen" class="modal-backdrop" @click.self="isCourseModalOpen = false">
        <div class="modal-dialog-box animate-slide-up">
          <div class="modal-header">
            <h3 class="modal-title">{{ editingCourseId ? '编辑课程资料' : '新建课程体系' }}</h3>
            <button class="modal-close-btn" @click="isCourseModalOpen = false">✕</button>
          </div>

          <div class="modal-body-scroll">
            <div class="form-group">
              <label class="form-label required">课程名称</label>
              <input 
                v-model="courseForm.title" 
                type="text" 
                class="form-input" 
                placeholder="例如：可转债与固收+低回撤策略全解析"
              />
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label required">授课导师</label>
                <input 
                  v-model="courseForm.instructor" 
                  type="text" 
                  class="form-input" 
                  placeholder="例如：老林说宏观"
                />
              </div>

              <div class="form-group">
                <label class="form-label">导师头衔/资质</label>
                <input 
                  v-model="courseForm.instructorTitle" 
                  type="text" 
                  class="form-input" 
                  placeholder="例如：前公募投资总监"
                />
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">难度等级</label>
                <select v-model="courseForm.level" class="form-select">
                  <option value="初级入门">初级入门</option>
                  <option value="进阶实战">进阶实战</option>
                  <option value="高阶策略">高阶策略</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">课程单买定价 (元)</label>
                <input 
                  v-model.number="courseForm.price" 
                  type="number" 
                  class="form-input" 
                  placeholder="399"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">课程封面图 URL</label>
              <input 
                v-model="courseForm.cover" 
                type="text" 
                class="form-input" 
                placeholder="https://..."
              />
              <div class="preset-covers-row">
                <span class="preset-tip">快速预设：</span>
                <button 
                  v-for="(p, idx) in presetCourseCovers" 
                  :key="idx" 
                  type="button" 
                  class="preset-btn"
                  @click="courseForm.cover = p.url"
                >
                  {{ p.name }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">课程介绍与大纲摘要</label>
              <textarea 
                v-model="courseForm.description" 
                rows="3" 
                class="form-textarea" 
                placeholder="详细说明本课程所能帮助学员解决的核心痛点、适用的投资阶段以及核心框架模型..."
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="isCourseModalOpen = false">取消</button>
            <button class="btn-submit" @click="submitCourseForm">
              {{ editingCourseId ? '保存修改' : '确认创建并上架' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal 2: 新增 / 编辑单个课时 -->
    <transition name="modal-fade">
      <div v-if="isLessonModalOpen" class="modal-backdrop" @click.self="isLessonModalOpen = false">
        <div class="modal-dialog-box animate-slide-up">
          <div class="modal-header">
            <h3 class="modal-title">{{ editingLessonId ? '编辑课时' : '新增课时章节' }}</h3>
            <button class="modal-close-btn" @click="isLessonModalOpen = false">✕</button>
          </div>

          <div class="modal-body-scroll">
            <div class="form-group">
              <label class="form-label required">课时名称</label>
              <input 
                v-model="lessonForm.title" 
                type="text" 
                class="form-input" 
                placeholder="例如：第01课：认识可转债——散户能碰的最好防守反击武器"
              />
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label required">视频时长</label>
                <input 
                  v-model="lessonForm.duration" 
                  type="text" 
                  class="form-input" 
                  placeholder="如：28:45"
                />
              </div>

              <div class="form-group">
                <label class="form-label">试看权限</label>
                <select v-model="lessonForm.isFreeTrial" class="form-select">
                  <option :value="true">免费试听 (全员可看)</option>
                  <option :value="false">VIP专属 (需会员权限)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">视频源文件 (MP4 / HLS / 直播切片 URL)</label>
              <input 
                type="text" 
                class="form-input code-font" 
                placeholder="https://cdn.wealth-circle.com/courses/video_chapter_01.m3u8"
              />
            </div>

            <div class="form-group">
              <label class="form-label">课件附件与讲义 (PDF / PPT / 脑图)</label>
              <div class="upload-drop-placeholder" @click="actions.showToast('已模拟上传讲义《核心估值模型.xlsx》')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>点击上传配套课件资料 (支持 PDF, PPTX, XLSX)</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="isLessonModalOpen = false">取消</button>
            <button class="btn-submit" @click="submitLessonForm">
              {{ editingLessonId ? '保存课时修改' : '确认添加课时' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { appState, actions } from '../store';
import type { Course, CourseLesson } from '../types';
import '../client.css';

defineOptions({ name: 'CmsCourse' })

const selectedCourseId = ref<string>(appState.courses[0]?.id || '');

const selectedCourse = computed(() => {
  return appState.courses.find(c => c.id === selectedCourseId.value) || appState.courses[0];
});

const trialLessonsCount = computed(() => {
  if (!selectedCourse.value) return 0;
  return selectedCourse.value.lessons.filter(l => l.isFreeTrial).length;
});

const selectCourse = (c: Course) => {
  selectedCourseId.value = c.id;
};

const getLevelClass = (level: string) => {
  if (level === '初级入门') return 'level-easy';
  if (level === '进阶实战') return 'level-medium';
  return 'level-hard';
};

// Course Modal state
const isCourseModalOpen = ref(false);
const editingCourseId = ref<string | null>(null);

const presetCourseCovers = [
  { name: '基金组合研报', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80' },
  { name: '策略模型推演', url: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=500&auto=format&fit=crop&q=80' },
  { name: '大类资产防守', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80' }
];

const courseForm = ref({
  title: '',
  description: '',
  cover: presetCourseCovers[0].url,
  instructor: appState.user.name,
  instructorTitle: appState.user.roleTitle,
  level: '初级入门' as '初级入门' | '进阶实战' | '高阶策略',
  price: 399
});

const openCreateCourseModal = () => {
  editingCourseId.value = null;
  courseForm.value = {
    title: '',
    description: '',
    cover: presetCourseCovers[0].url,
    instructor: appState.user.name,
    instructorTitle: appState.user.roleTitle,
    level: '初级入门',
    price: 399
  };
  isCourseModalOpen.value = true;
};

const openEditCourseModal = (course: Course) => {
  editingCourseId.value = course.id;
  courseForm.value = {
    title: course.title,
    description: course.description,
    cover: course.cover,
    instructor: course.instructor,
    instructorTitle: course.instructorTitle,
    level: course.level,
    price: course.price
  };
  isCourseModalOpen.value = true;
};

const submitCourseForm = () => {
  if (!courseForm.value.title.trim()) {
    actions.showToast('请输入课程标题');
    return;
  }

  if (editingCourseId.value) {
    const c = appState.courses.find(x => x.id === editingCourseId.value);
    if (c) {
      c.title = courseForm.value.title;
      c.description = courseForm.value.description;
      c.cover = courseForm.value.cover;
      c.instructor = courseForm.value.instructor;
      c.instructorTitle = courseForm.value.instructorTitle;
      c.level = courseForm.value.level;
      c.price = courseForm.value.price;
      actions.showToast('课程资料已更新');
    }
  } else {
    actions.createCourse({
      title: courseForm.value.title,
      description: courseForm.value.description,
      cover: courseForm.value.cover,
      instructor: courseForm.value.instructor,
      instructorTitle: courseForm.value.instructorTitle,
      level: courseForm.value.level,
      price: courseForm.value.price
    });
    if (appState.courses[0]) {
      selectedCourseId.value = appState.courses[0].id;
    }
  }

  isCourseModalOpen.value = false;
};

const handleDeleteCourse = (course: Course) => {
  if (confirm(`确定要删除课程体系《${course.title}》吗？`)) {
    actions.deleteCourse(course.id);
    if (appState.courses.length > 0) {
      selectedCourseId.value = appState.courses[0].id;
    }
  }
};

// Lesson Modal state
const isLessonModalOpen = ref(false);
const editingLessonId = ref<string | null>(null);

const lessonForm = ref({
  title: '',
  duration: '25:00',
  isFreeTrial: false
});

const openAddLessonModal = () => {
  editingLessonId.value = null;
  const nextNum = (selectedCourse.value?.lessons.length || 0) + 1;
  const pad = nextNum < 10 ? '0' + nextNum : nextNum;
  lessonForm.value = {
    title: `第${pad}课：`,
    duration: '25:00',
    isFreeTrial: false
  };
  isLessonModalOpen.value = true;
};

const openEditLessonModal = (lesson: CourseLesson) => {
  editingLessonId.value = lesson.id;
  lessonForm.value = {
    title: lesson.title,
    duration: lesson.duration,
    isFreeTrial: lesson.isFreeTrial
  };
  isLessonModalOpen.value = true;
};

const submitLessonForm = () => {
  if (!lessonForm.value.title.trim()) {
    actions.showToast('请输入课时名称');
    return;
  }
  if (!selectedCourse.value) return;

  if (editingLessonId.value) {
    const l = selectedCourse.value.lessons.find(x => x.id === editingLessonId.value);
    if (l) {
      l.title = lessonForm.value.title;
      l.duration = lessonForm.value.duration;
      l.isFreeTrial = lessonForm.value.isFreeTrial;
      actions.showToast('课时信息已更新');
    }
  } else {
    actions.addCourseLesson(selectedCourse.value.id, {
      title: lessonForm.value.title,
      duration: lessonForm.value.duration,
      isFreeTrial: lessonForm.value.isFreeTrial
    });
  }

  isLessonModalOpen.value = false;
};

const toggleTrial = (lesson: CourseLesson) => {
  lesson.isFreeTrial = !lesson.isFreeTrial;
  actions.showToast(`已将该课时权限调整为：${lesson.isFreeTrial ? '免费试听' : 'VIP专享'}`);
};

const handleDeleteLesson = (lessonId: string) => {
  if (!selectedCourse.value) return;
  if (confirm('确定要删除该课时吗？')) {
    actions.deleteCourseLesson(selectedCourse.value.id, lessonId);
  }
};

const playLessonPreview = (courseTitle: string, lessonTitle: string) => {
  actions.playLesson(courseTitle, lessonTitle);
};
</script>

<style scoped>
.course-manage-layout {
  min-height: 100%;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* Top Breadcrumb Header */
.cms-header-bar {
  height: 52px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.breadcrumb-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.crumb-parent {
  color: #64748b;
  font-weight: 500;
}

.crumb-sep {
  color: #cbd5e1;
}

.crumb-current {
  color: #0f172a;
  font-weight: 700;
}

.header-right-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tool-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.role-switch-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  transition: all 0.15s ease;
}

.role-switch-pill:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.role-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
}

.user-pill-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 99px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.user-pill-badge:hover {
  background: #f1f5f9;
}

.user-pill-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.user-pill-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

/* Two-Column Layout */
.cms-main-container {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 52px);
}

/* 1. Left Course Tree Aside */
.course-tree-aside {
  width: 320px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.tree-header-card {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tree-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tree-icon-badge {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tree-title-texts {
  display: flex;
  flex-direction: column;
}

.tree-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.tree-subtitle {
  font-size: 12px;
  color: #64748b;
}

.tree-toolbar-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.btn-add-course {
  width: 100%;
  padding: 8px 12px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-add-course:hover {
  background: #1d4ed8;
}

.course-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.course-nav-card {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
  transition: all 0.15s ease;
  background: #ffffff;
}

.course-nav-card:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.course-nav-card.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.course-nav-thumb {
  width: 60px;
  height: 44px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.course-nav-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.course-nav-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-nav-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.level-chip {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.level-easy {
  background: #ecfdf5;
  color: #059669;
}
.level-medium {
  background: #eff6ff;
  color: #2563eb;
}
.level-hard {
  background: #fdf2f8;
  color: #db2777;
}

.lessons-count {
  color: #64748b;
}

.status-pill {
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 10px;
}
.status-pill.published {
  background: #e2e8f0;
  color: #334155;
}
.status-pill.draft {
  background: #fef3c7;
  color: #b45309;
}

/* 2. Right Workbench Main Panel */
.workbench-main-panel {
  flex: 1;
  padding: 24px 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Banner Card */
.course-banner-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.banner-top-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.banner-cover {
  width: 170px;
  height: 108px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.banner-meta-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.banner-tags-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-chip-large {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.status-chip-large {
  font-size: 12px;
  font-weight: 600;
}
.status-chip-large.published {
  color: #16a34a;
}
.status-chip-large.draft {
  color: #d97706;
}

.price-chip-large {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}
.vip-free {
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

.banner-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.banner-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.45;
}

.instructor-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
  margin-top: 4px;
}

.instructor-name {
  font-weight: 700;
  color: #0f172a;
}

.duration-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  margin-left: 10px;
}

.banner-action-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 130px;
  flex-shrink: 0;
}

.btn-primary-action {
  padding: 8px 14px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}
.btn-primary-action:hover {
  background: #1d4ed8;
}

.btn-outline-action {
  padding: 7px 12px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}
.btn-outline-action:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn-text-danger {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px;
}
.btn-text-danger:hover {
  text-decoration: underline;
  color: #dc2626;
}

/* Metrics Bar */
.metrics-bar {
  display: flex;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-val {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.metric-lab {
  font-size: 12px;
  color: #64748b;
}

.metric-divider {
  width: 1px;
  height: 28px;
  background: #e2e8f0;
  margin: 0 16px;
}

/* Curriculum Workbench */
.curriculum-workbench-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.curriculum-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.curriculum-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.curriculum-sub {
  font-size: 12px;
  color: #94a3b8;
  margin-left: 8px;
}

.btn-small-add {
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}
.btn-small-add:hover {
  background: #e2e8f0;
}

.empty-curriculum {
  padding: 36px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

.lessons-table-container {
  overflow-x: auto;
}

.lessons-table {
  width: 100%;
  border-collapse: collapse;
}

.lessons-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.lessons-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
  color: #1e293b;
}

.lessons-table tr:hover td {
  background: #f8fafc;
}

.index-badge {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
}

.lesson-title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lesson-name-text {
  font-weight: 600;
  color: #0f172a;
}

.duration-cell {
  color: #64748b;
  font-size: 12px;
  font-family: ui-monospace, monospace;
}

.trial-switch-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
}

.trial-switch-badge.is-trial {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.trial-switch-badge.is-vip {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.doc-attachment-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #475569;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.doc-attachment-badge:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.table-actions-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.tb-btn {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  transition: all 0.15s ease;
}
.tb-btn:hover {
  background: #f1f5f9;
}

.tb-btn.primary {
  background: #2563eb;
  color: #ffffff;
  border: none;
}
.tb-btn.primary:hover {
  background: #1d4ed8;
}

.tb-btn.danger {
  color: #ef4444;
  border-color: #fecaca;
  background: #fef2f2;
}
.tb-btn.danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-dialog-box {
  background: #ffffff;
  border-radius: 10px;
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  color: #94a3b8;
  cursor: pointer;
}
.modal-close-btn:hover {
  color: #0f172a;
}

.modal-body-scroll {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  color: #0f172a;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #2563eb;
}

.code-font {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  background: #f8fafc;
}

.preset-covers-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.preset-tip {
  font-size: 11px;
  color: #64748b;
}

.preset-btn {
  font-size: 11px;
  padding: 2px 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #2563eb;
  cursor: pointer;
}
.preset-btn:hover {
  background: #e0e7ff;
}

.upload-drop-placeholder {
  border: 2px dashed #cbd5e1;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: border-color 0.15s ease;
  font-size: 12px;
  color: #64748b;
}
.upload-drop-placeholder:hover {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.modal-footer {
  padding: 14px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #f8fafc;
}

.btn-submit {
  padding: 8px 18px;
  background: #2563eb;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
}
.btn-submit:hover {
  background: #1d4ed8;
}

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
