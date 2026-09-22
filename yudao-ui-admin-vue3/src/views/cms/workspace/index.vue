<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
      <el-form-item label="关键词" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          class="!w-240px"
          clearable
          placeholder="标题 / 正文 / 作者昵称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-160px" clearable placeholder="全部">
          <el-option label="已发布" value="published" />
          <el-option label="已下架" value="offline" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" class="!w-160px" clearable placeholder="全部">
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          <el-option label="综合讨论" value="general" />
        </el-select>
      </el-form-item>
      <el-form-item label="置顶" prop="pin">
        <el-select v-model="queryParams.pin" class="!w-160px" clearable placeholder="全部">
          <el-option label="已置顶" value="pinned" />
          <el-option label="未置顶" value="unpinned" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间" prop="dateRange">
        <el-date-picker
          v-model="queryParams.dateRange"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button plain type="primary" @click="openCategoryModal">
          <Icon class="mr-5px" icon="ep:setting" />
          分类设置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table :data="pagedList" :stripe="true">
      <el-table-column label="作者" width="130px">
        <template #default="scope">
          <div class="author-cell">
            <img :src="scope.row.author.avatar" class="author-cell-avatar" />
            <span>{{ scope.row.author.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="100px">
        <template #default="scope">
          <el-tag :type="ROLE_META[scope.row.author.role]?.type || 'info'" size="small">
            {{ ROLE_META[scope.row.author.role]?.label || '注册用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="300px" :show-overflow-tooltip="false">
        <template #default="scope">
          <div class="content-plain" @click="openDetail(scope.row)">{{ plainContent(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="150px">
        <template #default="scope">
          <div class="category-cell">
            <div v-for="pair in categoryPairs(scope.row)" :key="pair" class="category-line">
              {{ pair }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="点赞" prop="likes" width="70px" />
      <el-table-column label="评论" prop="commentsCount" width="70px" />
      <el-table-column label="分享" prop="sharesCount" width="70px" />
      <el-table-column label="置顶" width="70px">
        <template #default="scope">
          <span v-if="scope.row.isPinned">是</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90px">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'" size="small">
            {{ scope.row.status === 'published' ? '已上架' : '已下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="createdAt" width="160px" />
      <el-table-column fixed="right" label="操作" width="150px">
        <template #default="scope">
          <div class="flex items-center gap-5px">
            <el-button link type="primary" @click="openDetail(scope.row)">详情</el-button>
            <el-dropdown trigger="click" @command="(cmd: string) => handleMore(cmd, scope.row)">
              <el-button link type="primary">
                更多
                <Icon class="ml-2px" icon="ep:arrow-down" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="scope.row.status === 'published'" command="offline">下架</el-dropdown-item>
                  <el-dropdown-item v-else command="online">上架</el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 'published' && !scope.row.isPinned"
                    command="pin"
                  >
                    置顶
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-else-if="scope.row.status === 'published'"
                    command="unpin"
                  >
                    取消置顶
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
    />
  </ContentWrap>

  <!-- 内容详情弹窗（与 C 端帖子详情一致的展示样式，只读） -->
  <PostDetailModal v-if="detailPost" :post="detailPost" @close="detailPost = null" />

  <!-- 分类设置弹窗 -->
  <el-dialog v-model="categoryModalVisible" title="分类设置" width="640px">
    <div class="cat-tip">
      一级分类展示在客户端资讯页顶部分类栏；二级分类以话题形式展示在内容标题前和底部。
    </div>
    <div v-for="cat in draftCategories" :key="cat.id" class="cat-block">
      <div class="cat-head">
        <el-input v-model="cat.name" class="!w-160px" />
        <span class="cat-count">{{ cat.children.length }} 个二级分类</span>
        <el-button link type="danger" @click="removeCategory(cat)">删除</el-button>
      </div>
      <div class="cat-children">
        <el-tag
          v-for="child in cat.children"
          :key="child.id"
          class="cat-child-tag"
          closable
          effect="plain"
          @close="removeChild(cat, child)"
        >
          {{ child.name }}
        </el-tag>
        <div class="cat-add-child">
          <el-input
            v-model="newChildNames[cat.id]"
            class="!w-110px"
            placeholder="二级名称"
            size="small"
            @keyup.enter="addChild(cat)"
          />
          <el-button size="small" @click="addChild(cat)">添加</el-button>
        </div>
      </div>
    </div>
    <div class="cat-add-root">
      <el-input
        v-model="newCategoryName"
        class="!w-160px"
        placeholder="一级分类名称"
        @keyup.enter="addCategory"
      />
      <el-button plain type="primary" @click="addCategory">添加一级分类</el-button>
    </div>
    <template #footer>
      <el-button @click="categoryModalVisible = false">取消</el-button>
      <el-button type="primary" @click="saveCategories">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { initialPostsMock } from '../data'
import { Post, Comment, FeaturedComment } from '../types'
import { useMessage } from '@/hooks/web/useMessage'
import PostDetailModal from './PostDetailModal.vue'

defineOptions({ name: 'CmsWorkspace' })

const message = useMessage()

// ===== 数据：基于演示帖子构建管理列表，扩展 status 状态字段 =====
type PostStatus = 'published' | 'offline'
type AdminPost = Post & { status: PostStatus }

const posts = reactive<AdminPost[]>(
  initialPostsMock.map((p, i) => ({
    ...p,
    status: (i === initialPostsMock.length - 2 ? 'offline' : 'published') as PostStatus
  }))
)

// ===== 分类（一级=资讯页顶部分类栏；二级=内容标题前/底部话题标签） =====
type Category = { id: string; name: string; children: { id: string; name: string }[] }

const initialCategories: Category[] = [
  {
    id: 'c1',
    name: '交易追踪',
    children: [
      { id: 'c1-1', name: 'VIP专属' },
      { id: 'c1-2', name: '底仓标的' },
      { id: 'c1-3', name: '自由现金流' }
    ]
  },
  {
    id: 'c2',
    name: '市场资讯',
    children: [
      { id: 'c2-1', name: '市场资讯' },
      { id: 'c2-2', name: '宏观市场' },
      { id: 'c2-3', name: '机构观点' }
    ]
  },
  {
    id: 'c3',
    name: '理财资讯',
    children: [
      { id: 'c3-1', name: '财报分析' },
      { id: 'c3-2', name: '干货教学' },
      { id: 'c3-3', name: '现金流' }
    ]
  },
  {
    id: 'c4',
    name: '话题研究',
    children: [
      { id: 'c4-1', name: '宏观策略' },
      { id: 'c4-2', name: '大类资产配置' },
      { id: 'c4-3', name: '红利低波' }
    ]
  }
]

const categories = reactive<Category[]>(initialCategories.map(c => ({ ...c, children: [...c.children] })))

// 帖子归属：二级标签命中某个一级分类即归属，否则为综合讨论
const postInCategory = (p: Post, cat?: Category) =>
  !!cat && cat.children.some(ch => p.tags?.includes(ch.name))

// 分类列：一级-二级（多个二级分多行展示，未归类为综合讨论）
const categoryPairs = (p: Post): string[] => {
  const pairs: string[] = []
  categories.forEach(c => {
    c.children.forEach(ch => {
      if (p.tags?.includes(ch.name)) pairs.push(`${c.name}-${ch.name}`)
    })
  })
  return pairs.length ? pairs : ['综合讨论']
}

// 操作列"更多"下拉
const handleMore = (cmd: string, p: AdminPost) => {
  if (cmd === 'offline') offlinePost(p)
  else if (cmd === 'online') onlinePost(p)
  else if (cmd === 'pin' || cmd === 'unpin') togglePin(p)
  else if (cmd === 'delete') askDelete(p)
}

// ===== 角色标签（仅：星主、会员、合伙人、普通成员、嘉宾） =====
const ROLE_META: Record<
  string,
  { label: string; type: 'warning' | 'primary' | 'success' | 'info' | 'danger' }
> = {
  founder: { label: '星主', type: 'warning' },
  vip: { label: '会员', type: 'success' },
  partner: { label: '合伙人', type: 'danger' },
  member: { label: '普通成员', type: 'primary' },
  guest: { label: '嘉宾', type: 'info' }
}

// ===== 查询与筛选 =====
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: '',
  status: '' as '' | 'published' | 'offline',
  type: '' as '' | string,
  pin: '' as '' | 'pinned' | 'unpinned',
  dateRange: [] as string[]
})

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 演示数据中存在"2小时前"等相对时间，统一归为今天参与时间筛选
const postDate = (p: Post) => {
  if (/^\d{4}-\d{2}-\d{2}/.test(p.createdAt)) return p.createdAt.slice(0, 10)
  return today()
}

const handleQuery = () => {
  queryParams.pageNo = 1
}

const resetQuery = () => {
  queryParams.keyword = ''
  queryParams.status = ''
  queryParams.type = ''
  queryParams.pin = ''
  queryParams.dateRange = []
  handleQuery()
}

const filtered = computed(() => {
  const kw = queryParams.keyword.trim().toLowerCase()
  const [from, to] = queryParams.dateRange || []
  return posts.filter(p => {
    if (kw) {
      const hit =
        (p.title || '').toLowerCase().includes(kw) ||
        p.content.toLowerCase().includes(kw) ||
        p.author.name.toLowerCase().includes(kw)
      if (!hit) return false
    }
    if (queryParams.status && p.status !== queryParams.status) return false
    if (queryParams.type) {
      if (queryParams.type === 'general') {
        if (categories.some(c => postInCategory(p, c))) return false
      } else {
        const cat = categories.find(c => c.id === queryParams.type)
        if (!postInCategory(p, cat)) return false
      }
    }
    if (queryParams.pin === 'pinned' && !p.isPinned) return false
    if (queryParams.pin === 'unpinned' && p.isPinned) return false
    if (from && postDate(p) < from) return false
    if (to && postDate(p) > to) return false
    return true
  })
})

// 置顶内容优先展示
const sortedList = computed(() => [...filtered.value].sort((a, b) => Number(b.isPinned) - Number(a.isPinned)))
const total = computed(() => sortedList.value.length)
const pagedList = computed(() =>
  sortedList.value.slice((queryParams.pageNo - 1) * queryParams.pageSize, queryParams.pageNo * queryParams.pageSize)
)

// ===== 展示辅助 =====
const plainContent = (p: Post) => p.content.replace(/\*\*/g, '')

const allComments = (p: Post): (Comment | FeaturedComment)[] => {
  const list: (Comment | FeaturedComment)[] = []
  if (p.featuredComment) list.push(p.featuredComment)
  if (p.featuredComments?.length) list.push(...p.featuredComments)
  if (p.comments?.length) list.push(...p.comments)
  return list
}

// ===== 分类设置弹窗（弹窗内编辑草稿，保存后才生效） =====
const categoryModalVisible = ref(false)
const draftCategories = ref<Category[]>([])
const newCategoryName = ref('')
const newChildNames = reactive<Record<string, string>>({})

let categorySeed = 100
const nextCategoryId = () => `cat-${++categorySeed}`

const openCategoryModal = () => {
  draftCategories.value = categories.map(c => ({ ...c, children: c.children.map(ch => ({ ...ch })) }))
  newCategoryName.value = ''
  categoryModalVisible.value = true
}

const saveCategories = () => {
  const draft = draftCategories.value.map(c => ({ ...c, children: c.children.map(ch => ({ ...ch })) }))
  categories.splice(0, categories.length, ...draft)
  if (queryParams.type && queryParams.type !== 'general' && !categories.some(c => c.id === queryParams.type)) {
    queryParams.type = ''
  }
  message.success('分类设置已保存')
  categoryModalVisible.value = false
}

const addCategory = () => {
  const name = newCategoryName.value.trim()
  if (!name) {
    message.warning('请输入一级分类名称')
    return
  }
  if (draftCategories.value.some(c => c.name === name)) {
    message.warning('一级分类已存在')
    return
  }
  draftCategories.value.push({ id: nextCategoryId(), name, children: [] })
  newCategoryName.value = ''
  message.success(`已添加一级分类：${name}`)
}

const removeCategory = (cat: Category) => {
  message
    .confirm(`删除一级分类「${cat.name}」及其下 ${cat.children.length} 个二级分类？`, '删除确认')
    .then(() => {
      draftCategories.value = draftCategories.value.filter(c => c.id !== cat.id)
      message.success(`已删除一级分类：${cat.name}`)
    })
    .catch(() => {})
}

const addChild = (cat: Category) => {
  const name = (newChildNames[cat.id] || '').trim()
  if (!name) {
    message.warning('请输入二级分类名称')
    return
  }
  if (cat.children.some(ch => ch.name === name)) {
    message.warning('该二级分类已存在')
    return
  }
  cat.children.push({ id: nextCategoryId(), name })
  newChildNames[cat.id] = ''
  message.success(`已添加二级分类：${name}`)
}

const removeChild = (cat: Category, child: { id: string; name: string }) => {
  cat.children = cat.children.filter(ch => ch.id !== child.id)
  message.success(`已删除二级分类：${child.name}`)
}

// ===== 内容操作 =====
const offlinePost = (p: AdminPost) => {
  p.status = 'offline'
  p.isPinned = false
  message.success(`已下架：${p.title || '该内容'}，客户端将不再展示`)
}

const onlinePost = (p: AdminPost) => {
  p.status = 'published'
  message.success(`已上架：${p.title || '该内容'}`)
}

const togglePin = (p: AdminPost) => {
  p.isPinned = !p.isPinned
  message.success(p.isPinned ? `已置顶：${p.title || '该内容'}` : `已取消置顶：${p.title || '该内容'}`)
}

// ===== 删除（二次确认） =====
const removePost = (p: AdminPost) => {
  const idx = posts.findIndex(item => item.id === p.id)
  if (idx > -1) posts.splice(idx, 1)
  message.success('已删除该条内容')
}

const askDelete = (p: AdminPost) => {
  message
    .confirm(`是否确认删除内容「${p.title || '无标题'}」？删除后不可恢复`, '删除确认')
    .then(() => removePost(p))
    .catch(() => {})
}

// ===== 查看详情 =====
const detailPost = ref<AdminPost | null>(null)

const openDetail = (p: AdminPost) => {
  detailPost.value = p
}
</script>

<style scoped>
/* 作者列 */
.author-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.author-cell-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

/* 分类列：最多两行，超出省略 */
.category-cell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}

.category-line {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

/* 内容列：不分标题描述，纯内容最多两行 */
.content-plain {
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  cursor: pointer;
}

.content-plain:hover {
  color: var(--el-color-primary);
}

/* 分类设置弹窗 */
.cat-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}

.cat-block {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.cat-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cat-head .el-button {
  margin-left: auto;
}

.cat-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.cat-children {
  margin-top: 10px;
  padding: 10px 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.cat-add-child {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cat-add-root {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
