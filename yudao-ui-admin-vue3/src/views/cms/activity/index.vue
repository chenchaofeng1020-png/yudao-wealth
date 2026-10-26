<template>
  <ContentWrap v-if="viewMode === 'list'">
    <!-- 搜索工作栏 -->
    <el-form :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
      <el-form-item label="活动名称" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          class="!w-240px"
          clearable
          placeholder="请输入活动名称关键词"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-160px" clearable placeholder="全部">
          <el-option label="报名中" value="recruiting" />
          <el-option label="已结束" value="ended" />
          <el-option label="已下架" value="off" />
        </el-select>
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
        <el-button plain type="primary" @click="openCreate">
          <Icon class="mr-5px" icon="ep:plus" />
          新建活动
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap v-if="viewMode === 'list'">
    <el-table :data="pagedList" :stripe="true">
      <el-table-column label="活动名称" min-width="220px">
        <template #default="scope">
          <div class="name-cell">
            <span class="name-text" :title="scope.row.name">{{ scope.row.name }}</span>
            <span class="name-sub" :title="scope.row.location">{{ scope.row.location }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="报名费" width="110px">
        <template #default="scope">
          <span class="price-text">{{ fmtPriceCell(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名额进度" width="150px">
        <template #default="scope">
          <span class="quota-text" :class="{ 'is-full': isFull(scope.row) }">
            {{ validCount(scope.row) }}/{{ totalQuotaOf(scope.row) }}
          </span>
          <el-tag v-if="isFull(scope.row)" class="ml-5px" size="small" type="warning"
            >已满员</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90px">
        <template #default="scope">
          <el-tag :type="STATUS_META[scope.row.status].tag" size="small">
            {{ STATUS_META[scope.row.status].label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="170px">
        <template #default="scope">
          <div class="time-line">{{ scope.row.startTime }}</div>
          <div class="time-line time-end">~ {{ scope.row.endTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="报名截止时间" prop="signupDeadline" width="150px" />
      <el-table-column fixed="right" label="操作" width="230px">
        <template #default="scope">
          <div class="flex items-center gap-5px">
            <el-button link type="primary" @click="openDetail(scope.row)">详情</el-button>
            <el-button
              v-if="scope.row.status === 'recruiting'"
              link
              type="primary"
              @click="openShare(scope.row)"
            >
              分享
            </el-button>
            <el-button link type="primary" @click="openEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status === 'recruiting'"
              link
              type="warning"
              @click="handleOffline(scope.row)"
            >
              下架
            </el-button>
            <el-tooltip
              v-if="scope.row.status === 'off'"
              content="报名截止时间已过，无法上架"
              :disabled="!isDeadlinePassed(scope.row)"
              placement="top"
            >
              <span>
                <el-button
                  link
                  type="primary"
                  :disabled="isDeadlinePassed(scope.row)"
                  @click="handleOnline(scope.row)"
                >
                  上架
                </el-button>
              </span>
            </el-tooltip>
            <el-button
              v-if="canDelete(scope.row)"
              link
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-if="total > 0"
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
    />
  </ContentWrap>

  <!-- ==================== 活动详情视图 ==================== -->
  <template v-if="viewMode === 'detail' && detailActivity">
    <ContentWrap>
      <el-button @click="backToList">
        <Icon class="mr-5px" icon="ep:arrow-left" />
        返回列表
      </el-button>
    </ContentWrap>

    <!-- 活动信息卡片 -->
    <ContentWrap>
      <div class="detail-head">
        <img :alt="detailActivity.name" :src="detailActivity.cover" class="detail-cover" />
        <div class="detail-info">
          <div class="detail-name-row">
            <span class="detail-name">{{ detailActivity.name }}</span>
            <el-tag :type="STATUS_META[detailActivity.status].tag" size="small">
              {{ STATUS_META[detailActivity.status].label }}
            </el-tag>
          </div>
          <div class="detail-meta">
            活动时间：{{ detailActivity.startTime }} 至 {{ detailActivity.endTime }}
          </div>
          <div class="detail-meta">活动地点：{{ detailActivity.location }}</div>
          <div class="detail-meta">
            报名费：<span class="detail-price">{{ fmtPriceCell(detailActivity) }}</span>
          </div>
          <div class="detail-meta">
            名额进度：
            <span class="quota-text" :class="{ 'is-full': isFull(detailActivity) }">
              {{ validCount(detailActivity) }}/{{ totalQuotaOf(detailActivity) }}
            </span>
            <el-tag v-if="isFull(detailActivity)" class="ml-5px" size="small" type="warning">
              已满员
            </el-tag>
          </div>
        </div>
        <div class="detail-actions">
          <el-button @click="openEdit(detailActivity)">编辑</el-button>
          <el-button
            plain
            type="primary"
            :disabled="detailActivity.status !== 'recruiting'"
            @click="openShare(detailActivity)"
          >
            分享
          </el-button>
        </div>
      </div>
    </ContentWrap>

    <!-- 报名名单 -->
    <ContentWrap>
      <div class="signup-toolbar">
        <el-tabs v-model="detailTab" class="signup-tabs">
          <el-tab-pane :label="`全部(${detailCounts.all})`" name="all" />
          <el-tab-pane :label="`已报名(${detailCounts.registered})`" name="registered" />
          <el-tab-pane :label="`已取消(${detailCounts.cancelled})`" name="cancelled" />
        </el-tabs>
        <el-button class="signup-export-btn" plain type="primary" @click="exportSignupsExcel">
          <Icon class="mr-5px" icon="ep:download" />
          导出 Excel
        </el-button>
      </div>
      <el-table :data="detailRecords" :stripe="true">
        <el-table-column label="报名用户" prop="name" width="100px" />
        <el-table-column label="会员手机号" prop="phone" width="130px" />
        <el-table-column label="票种" prop="ticket" width="100px" />
        <el-table-column label="报名时间" prop="payTime" width="150px" />
        <el-table-column label="价格" width="90px">
          <template #default="scope">
            <span class="price-text">{{ fmtMoney(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120px">
          <template #default="scope">
            <span
              class="signup-status"
              :class="scope.row.status === 'registered' ? 'is-ok' : 'is-cancel'"
            >
              <span class="signup-status-dot"></span>
              {{ scope.row.status === 'registered' ? '已报名' : '已取消' }}
            </span>
            <span v-if="scope.row.refunded" class="refund-mark">已退款</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="orderNo" min-width="180px" />
        <!-- 报名信息：按当前活动配置的报名组件动态生成列，列名即组件名称；理财师属于报名信息，紧跟手机号之后 -->
        <template v-for="f in detailActivity?.regFields ?? []" :key="f.id">
          <el-table-column :label="f.label" min-width="120px">
            <template #default="scope">
              {{ formValueOf(scope.row, f) }}
            </template>
          </el-table-column>
          <el-table-column v-if="f.type === 'phone'" label="理财师" prop="advisor" width="90px" />
        </template>
        <el-table-column v-if="!hasPhoneField" label="理财师" prop="advisor" width="90px" />
        <el-table-column fixed="right" label="操作" width="110px">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'registered'"
              link
              type="danger"
              @click="cancelSignup(scope.row)"
            >
              取消报名
            </el-button>
            <span v-else class="op-dash">-</span>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </template>

  <!-- ==================== 新建/编辑活动（二级页面） ==================== -->
  <template v-if="viewMode === 'form'">
    <ContentWrap>
      <div class="form-toolbar">
        <div class="form-toolbar-left">
          <el-button @click="backToList">
            <Icon class="mr-5px" icon="ep:arrow-left" />
            返回列表
          </el-button>
          <span class="form-title">{{ editingId ? '编辑活动' : '新建活动' }}</span>
        </div>
        <div class="form-toolbar-actions">
          <el-button type="primary" @click="saveActivity()">
            {{ editingId ? '保存修改' : '保存并发布' }}
          </el-button>
        </div>
      </div>
    </ContentWrap>
    <ContentWrap>
      <el-form ref="formRef" :model="activityForm" :rules="formRules" label-width="120px">
        <!-- ==================== 基本信息 ==================== -->
        <div class="form-section-title">基本信息</div>
        <el-form-item label="活动名称" prop="name">
          <el-input
            v-model="activityForm.name"
            :disabled="isEditingEnded"
            maxlength="50"
            placeholder="请输入活动名称（最多 50 字）"
            class="w-80!"
          />
        </el-form-item>
        <el-form-item label="活动地点" prop="location">
          <el-input
            v-model="activityForm.location"
            :disabled="isEditingEnded"
            maxlength="100"
            placeholder="请输入活动地点（最多 100 字），将展示于 C 端介绍页"
            class="w-80!"
          />
        </el-form-item>
        <el-form-item label="活动时间" prop="startTime">
          <el-date-picker
            v-model="activityForm.startTime"
            :disabled="isEditingEnded"
            format="YYYY-MM-DD HH:mm"
            placeholder="开始时间"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm"
          />
          <span class="time-sep">~</span>
          <el-date-picker
            v-model="activityForm.endTime"
            :disabled="isEditingEnded"
            format="YYYY-MM-DD HH:mm"
            placeholder="结束时间"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
        <el-form-item label="报名截止时间" prop="signupDeadline">
          <el-date-picker
            v-model="activityForm.signupDeadline"
            :disabled="isEditingEnded"
            format="YYYY-MM-DD HH:mm"
            placeholder="选择报名截止时间"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm"
          />
          <div class="field-hint">须早于活动结束时间，截止后 C 端自动关闭报名入口</div>
        </el-form-item>
        <el-form-item label="活动海报" prop="cover">
          <el-upload
            accept="image/jpeg,image/png"
            :auto-upload="false"
            class="cover-uploader"
            :disabled="isEditingEnded"
            list-type="picture-card"
            :on-change="handleCoverChange"
            :show-file-list="false"
          >
            <img
              v-if="activityForm.cover"
              :src="activityForm.cover"
              alt="活动海报"
              class="cover-preview"
            />
            <Icon v-else class="cover-plus" icon="ep:plus" />
          </el-upload>
          <div class="field-hint">建议尺寸 750×560，支持 jpg/png，C 端介绍页与详情页展示</div>
        </el-form-item>
        <el-form-item label="活动详情" prop="detailHtml">
          <Editor
            v-model="activityForm.detailHtml"
            editor-id="cms-activity-detail-editor"
            height="300px"
          />
        </el-form-item>

        <!-- ==================== 票务设置 ==================== -->
        <div class="form-section-title">票务设置</div>
        <div v-if="isPriceLocked" class="field-hint section-hint">{{ PRICE_LOCK_TIP }}</div>
        <div v-for="(t, i) in activityForm.tickets" :key="t.id" class="ticket-card">
          <el-row :gutter="16">
            <el-col :span="10">
              <el-form-item
                label="票种名称"
                label-width="90px"
                :prop="`tickets.${i}.name`"
                :rules="ticketRules.name"
              >
                <el-input
                  v-model="t.name"
                  :disabled="isEditingEnded"
                  maxlength="20"
                  placeholder="如：早鸟票、标准票"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="价格（元）"
                label-width="90px"
                :prop="`tickets.${i}.price`"
                :rules="ticketRules.price"
              >
                <el-input-number
                  v-model="t.price"
                  controls-position="right"
                  :disabled="isEditingEnded || isPriceLocked"
                  :min="0.01"
                  placeholder="0.00"
                  :precision="2"
                  :step="1"
                  class="!w-100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="票数"
                label-width="90px"
                :prop="`tickets.${i}.count`"
                :rules="ticketRules.count"
              >
                <el-input-number
                  v-model="t.count"
                  controls-position="right"
                  :disabled="isEditingEnded"
                  :min="1"
                  :precision="0"
                  :step="1"
                  class="!w-100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="票种说明" label-width="90px">
            <el-input
              v-model="t.desc"
              :disabled="isEditingEnded"
              maxlength="200"
              :rows="2"
              type="textarea"
              placeholder="选填，介绍票种权益，如：含前排就座与答疑环节"
            />
          </el-form-item>
          <div class="ticket-actions">
            <el-button link type="danger" :disabled="isEditingEnded" @click="removeTicket(i)">
              删除
            </el-button>
          </div>
        </div>
        <el-form-item>
          <el-button :disabled="isEditingEnded" plain @click="addTicket">
            <Icon class="mr-5px" icon="ep:plus" />
            添加票种
          </el-button>
          <span class="field-hint inline-hint">报名时客户需先选择票种，再填写报名信息并支付</span>
        </el-form-item>

        <!-- ==================== 报名信息设置 ==================== -->
        <div class="form-section-title">报名信息设置</div>
        <div class="field-hint section-hint">
          设置报名时客户需填写的信息，每张票需填写一份，购买多张票需填写多份；默认提供姓名、手机号组件，可添加自定义组件。
        </div>
        <div
          v-for="f in activityForm.regFields"
          :key="f.id"
          class="reg-field-row"
          :class="{ 'is-column': isChoiceField(f) }"
        >
          <el-tag class="reg-field-tag" size="small" type="info">
            {{ REG_FIELD_LABEL[f.type] }}
          </el-tag>
          <el-input
            v-model="f.label"
            class="reg-field-label"
            :disabled="f.fixed || isEditingEnded"
            maxlength="20"
            placeholder="组件名称"
          />
          <el-checkbox v-model="f.required" :disabled="isEditingEnded">必填</el-checkbox>
          <el-button link type="danger" :disabled="isEditingEnded" @click="removeRegField(f.id)">
            删除
          </el-button>
          <!-- 选项类组件：逐项添加选项 -->
          <div v-if="isChoiceField(f)" class="reg-options-box">
            <div v-for="(opt, oi) in f.options" :key="oi" class="reg-option-row">
              <span class="reg-option-index">{{ oi + 1 }}.</span>
              <el-input
                v-model="f.options[oi]"
                class="reg-option-input"
                :disabled="isEditingEnded"
                maxlength="30"
                placeholder="选项内容"
              />
              <el-button
                link
                type="danger"
                :disabled="isEditingEnded || f.options.length <= 1"
                @click="removeRegOption(f, oi)"
              >
                删除
              </el-button>
            </div>
            <el-button
              class="reg-option-add"
              size="small"
              plain
              :disabled="isEditingEnded"
              @click="addRegOption(f)"
            >
              <Icon class="mr-5px" icon="ep:plus" />
              添加选项
            </el-button>
          </div>
        </div>
        <el-form-item>
          <el-dropdown :disabled="isEditingEnded" trigger="click" @command="addRegField">
            <el-button :disabled="isEditingEnded" plain type="primary">
              <Icon class="mr-5px" icon="ep:plus" />
              添加组件
              <Icon class="ml-5px" icon="ep:arrow-down" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="text">单行文本</el-dropdown-item>
                <el-dropdown-item command="textarea">多行文本</el-dropdown-item>
                <el-dropdown-item command="radio">单项选择</el-dropdown-item>
                <el-dropdown-item command="checkbox">多项选择</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </ContentWrap>
  </template>

  <!-- 分享活动弹窗 -->
  <el-dialog
    v-model="shareVisible"
    :title="`分享活动 · ${shareActivity?.name ?? ''}`"
    width="440px"
  >
    <el-form label-width="90px">
      <el-form-item label="活动链接">
        <div class="flex w-full items-center gap-8px">
          <el-input :model-value="shareActivity?.shareUrl" readonly />
          <el-button type="primary" @click="copyShareLink">复制</el-button>
        </div>
      </el-form-item>
      <el-form-item label="活动二维码">
        <div class="qr-box">
          <img v-if="shareQrDataUrl" :src="shareQrDataUrl" alt="活动二维码" class="qr-img" />
          <span v-else class="qr-loading">二维码生成中…</span>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="shareVisible = false">关闭</el-button>
      <el-button type="primary" @click="downloadQr">下载二维码</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import QRCode from 'qrcode'
import * as XLSX from 'xlsx'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { useMessage } from '@/hooks/web/useMessage'

defineOptions({ name: 'CmsActivity' })

const message = useMessage()

// ==================== 类型与常量 ====================
type ActivityStatus = 'recruiting' | 'ended' | 'off'
type SignupStatus = 'registered' | 'cancelled'
type RegFieldType = 'name' | 'phone' | 'text' | 'textarea' | 'radio' | 'checkbox'

// 票种
interface TicketType {
  id: string
  name: string // 票种名称
  price?: number // 价格（元）
  count?: number // 票数
  desc: string // 票种说明
}

// 报名信息组件
interface RegField {
  id: string
  type: RegFieldType
  label: string // 组件名称（姓名/手机号为固定标签）
  required: boolean // 是否必填
  options: string[] // 选项内容（仅单选/多选），逐项添加
  fixed?: boolean // 默认组件（姓名/手机号），名称不可编辑
}

interface ActivityItem {
  id: string
  name: string
  cover: string
  startTime: string // YYYY-MM-DD HH:mm
  endTime: string
  location: string
  tickets: TicketType[]
  regFields: RegField[]
  signupDeadline: string
  detailHtml: string
  status: ActivityStatus
  createdAt: string
  shareUrl: string
}

const REG_FIELD_LABEL: Record<RegFieldType, string> = {
  name: '姓名',
  phone: '手机号',
  text: '单行文本',
  textarea: '多行文本',
  radio: '单项选择',
  checkbox: '多项选择'
}

const isChoiceField = (f: RegField) => f.type === 'radio' || f.type === 'checkbox'

interface SignupRecord {
  id: string
  activityId: string
  name: string
  phone: string
  advisor: string
  ticket: string // 票种名称（一份票对应一份报名记录）
  status: SignupStatus
  amount: number // 该份票实付价格
  payTime: string
  orderNo: string
  refunded?: boolean // 已取消后原路退款标记
  formInfo: { label: string; value: string }[] // 该份票填写的报名表单信息
}

const STATUS_META: Record<
  ActivityStatus,
  { label: string; tag: 'info' | 'success' | 'warning' | 'danger' }
> = {
  recruiting: { label: '报名中', tag: 'success' },
  ended: { label: '已结束', tag: 'warning' },
  off: { label: '已下架', tag: 'danger' }
}

const SHARE_URL_PREFIX = 'https://h5.wealth-circle.com/activity?id='
const PRICE_LOCK_TIP = '报名中不可修改票种价格，如需调价请先下架'

// ==================== 工具函数 ====================
const pad = (n: number) => String(n).padStart(2, '0')

const nowText = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const todayText = () => nowText().slice(0, 10)

const parseTime = (s: string) => new Date(s.replace(' ', 'T') + ':00').getTime()

const fmtMoney = (n: number) => `¥${Number(n || 0).toLocaleString('zh-CN')}`

let idSeq = 0
const uid = (prefix: string) => `${prefix}-${Date.now()}-${++idSeq}`

const plainText = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // 走降级方案
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}

// ==================== Mock 数据 ====================
const detailImg =
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80'

const detailOf = (agenda: string, guest: string) => `
<h2>一、活动议程</h2>
<p>${agenda}</p>
<p><img src="${detailImg}" alt="活动现场示意图" /></p>
<h2>二、嘉宾介绍</h2>
<p>${guest}</p>
<h2>三、报名须知</h2>
<p>报名成功后请提前 15 分钟到场签到；活动开始前 24 小时内不支持退款，退款成功后名额自动释放。</p>
`

// 报名信息默认组件：姓名、手机号（默认必填）
const defaultRegFields = (): RegField[] => [
  { id: uid('f'), type: 'name', label: '姓名', required: true, options: [], fixed: true },
  { id: uid('f'), type: 'phone', label: '手机号', required: true, options: [], fixed: true }
]

const mkTicket = (name: string, price: number, count: number, desc = ''): TicketType => ({
  id: uid('t'),
  name,
  price,
  count,
  desc
})

const activitiesMockRaw: ActivityItem[] = [
  {
    id: 'act-off-01',
    name: '十二月年度策略报告会',
    cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=750&h=480&fit=crop',
    startTime: '2026-12-18 14:00',
    endTime: '2026-12-18 17:00',
    location: '上海市浦东新区陆家嘴环路 1000 号 恒生银行大厦 3F',
    tickets: [mkTicket('标准票', 399, 120)],
    regFields: defaultRegFields(),
    signupDeadline: '2026-12-17 18:00',
    detailHtml: detailOf(
      '13:30 签到入场；14:00 2027 年大类资产展望与配置主线；15:10 权益、固收与黄金的组合再平衡实操；16:20 圆桌问答与一对一交流。',
      '主讲人：老林说宏观，20 年二级市场投研老兵，专注全天候大类资产配置。'
    ),
    status: 'off',
    createdAt: '2026-10-14 10:26',
    shareUrl: ''
  },
  {
    id: 'act-full-01',
    name: '十一月宏观策略闭门会·北京站',
    cover: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=750&h=480&fit=crop',
    startTime: '2026-11-08 13:30',
    endTime: '2026-11-08 17:00',
    location: '北京市朝阳区建国门外大街 1 号 国贸大酒店 群贤厅',
    tickets: [mkTicket('标准票', 199, 30)],
    regFields: defaultRegFields(),
    signupDeadline: '2026-11-07 12:00',
    detailHtml: detailOf(
      '13:30 签到入场；14:00 四季度宏观主线与政策信号解读；15:00 闭门研讨：机构资金四季度调仓方向；16:30 自由交流。',
      '主讲人：Mark，资深策略分析师，长期跟踪北向资金与机构仓位变化。'
    ),
    status: 'recruiting',
    createdAt: '2026-10-11 15:40',
    shareUrl: 'https://h5.wealth-circle.com/activity?id=act-full-01'
  },
  {
    id: 'act-1',
    name: '十月投资沙龙·上海站',
    cover: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=750&h=480&fit=crop',
    startTime: '2026-10-28 14:00',
    endTime: '2026-10-28 17:00',
    location: '上海市浦东新区世纪大道 88 号 金茂大厦 2F 宴会厅',
    tickets: [
      mkTicket('标准票', 299, 60, '含全程议程与活动资料'),
      mkTicket('嘉宾票', 499, 20, '含前排就座、闭门交流与主讲人一对一答疑')
    ],
    regFields: [
      ...defaultRegFields(),
      {
        id: uid('f'),
        type: 'radio',
        label: '从事行业',
        required: true,
        options: ['银行/证券', '保险', '基金/资管', '其他']
      }
    ],
    signupDeadline: '2026-10-27 18:00',
    detailHtml: detailOf(
      '14:00 签到与茶歇；14:30 十月行情复盘与十一月配置策略；15:40 固收+ 实战分享；16:30 理财师现场答疑。',
      '主讲人：老林说宏观；特邀嘉宾：稳健老张，20 年固收投资经验。'
    ),
    status: 'recruiting',
    createdAt: '2026-10-09 11:05',
    shareUrl: 'https://h5.wealth-circle.com/activity?id=act-1'
  },
  {
    id: 'act-off-open-01',
    name: '十一月价值投资读书会',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=750&h=480&fit=crop',
    startTime: '2026-11-12 19:00',
    endTime: '2026-11-12 21:00',
    location: '杭州市西湖区文三路 90 号 东软大厦 5F 路演厅',
    tickets: [mkTicket('标准票', 9.9, 50)],
    regFields: defaultRegFields(),
    signupDeadline: '2026-11-11 18:00',
    detailHtml: detailOf(
      '19:00 签到；19:15《聪明的投资者》第八章领读；20:00 会员案例讨论：如何给周期股估值；20:45 自由交流。',
      '领读人：远山求道，实体创业者，长期价值定投践行者。'
    ),
    status: 'off',
    createdAt: '2026-09-28 09:12',
    shareUrl: 'https://h5.wealth-circle.com/activity?id=act-off-open-01'
  },
  {
    id: 'act-ended-01',
    name: '九月行业分享会',
    cover: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=750&h=480&fit=crop',
    startTime: '2026-09-20 14:00',
    endTime: '2026-09-20 17:00',
    location: '深圳市南山区科技园 深圳湾创业广场 B 座 12F',
    tickets: [mkTicket('标准票', 199, 30)],
    regFields: defaultRegFields(),
    signupDeadline: '2026-09-19 18:00',
    detailHtml: detailOf(
      '14:00 签到；14:30 新能源产业链四季度景气度跟踪；15:30 半导体设备国产化进展交流；16:30 圆桌问答。',
      '主讲人：Mark，资深策略分析师；特邀嘉宾：沈明远，一级市场半导体方向投资人。'
    ),
    status: 'ended',
    createdAt: '2026-08-30 14:22',
    shareUrl: 'https://h5.wealth-circle.com/activity?id=act-ended-01'
  },
  {
    id: 'act-off-closed-01',
    name: '七月宏观策略闭门会·线上专场',
    cover: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=750&h=480&fit=crop',
    startTime: '2026-07-16 15:00',
    endTime: '2026-07-16 17:00',
    location: '线上直播（腾讯会议）',
    tickets: [mkTicket('标准票', 99, 40)],
    regFields: defaultRegFields(),
    signupDeadline: '2026-07-15 12:00',
    detailHtml: detailOf(
      '15:00 开场；15:10 下半年通胀与利率路径推演；16:00 问答环节。',
      '主讲人：老林说宏观。'
    ),
    status: 'off',
    createdAt: '2026-06-28 16:48',
    shareUrl: 'https://h5.wealth-circle.com/activity?id=act-off-closed-01'
  }
]

// 种子：n 姓名 / p 手机号 / a 理财师 / s 状态 / t 票种名称（缺省取活动第一个票种）/ price 该份票价格 / g 订单分组（同组共享一笔订单，即一次购买多张票）
type SignupSeed = {
  n: string
  p: string
  a: string
  s?: SignupStatus
  t?: string
  price?: number
  g?: number
}

// 演示数据：种子中的脱敏手机号还原为明文（中段用后四位倒序填充，保持 11 位号码形态）
const plainPhone = (masked: string) =>
  masked.replace('****', masked.slice(-4).split('').reverse().join(''))

// 表单信息：按活动报名组件逐项生成该份票填写的内容（选项类按记录序号轮换，制造填写差异）
const buildFormInfo = (regFields: RegField[], seed: SignupSeed, i: number) =>
  regFields.map((f) => {
    const options = f.options.map((o) => o.trim()).filter(Boolean)
    let value = ''
    if (f.type === 'name') value = seed.n
    else if (f.type === 'phone') value = seed.p
    else if (f.type === 'radio') value = options[i % options.length] ?? ''
    else if (f.type === 'checkbox') value = options.slice(0, (i % 2) + 1).join('、')
    else value = '—'
    return { label: f.label, value }
  })

// 报名记录生成：一份票对应一份报名记录；g 相同的种子属于同一笔订单（共享订单号与支付时间）
// 支付时间自首笔起每 6 分钟一笔，订单号取支付时间数字 + 序号，保持名单数据的真实感
const buildSignups = (
  activityId: string,
  defaultAmount: number,
  firstPayTime: string,
  seeds: SignupSeed[]
): SignupRecord[] => {
  const act = activitiesMockRaw.find((a) => a.id === activityId)
  const regFields = act?.regFields ?? defaultRegFields()
  const defaultTicket = act?.tickets[0]?.name ?? '标准票'
  const base = parseTime(firstPayTime)

  // 按订单分组（未标 g 的种子各自成单）
  const groups = new Map<string, SignupSeed[]>()
  seeds.forEach((seed, i) => {
    const key = seed.g !== undefined ? `g${seed.g}` : `s${i}`
    const arr = groups.get(key) ?? []
    arr.push(seed)
    groups.set(key, arr)
  })

  let seq = 0
  let i = 0 // 记录序号，用于表单选项轮换
  return Array.from(groups.values()).flatMap((group, gIdx) => {
    const t = new Date(base + gIdx * 6 * 60 * 1000)
    const payTime = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}`
    const orderNo = payTime.replace(/[- :]/g, '') + String(1000 + gIdx * 3).padStart(4, '0')
    return group.map((seed) => {
      const status = seed.s || 'registered'
      const phone = plainPhone(seed.p)
      const record: SignupRecord = {
        id: `sg-${activityId}-${++seq}`,
        activityId,
        name: seed.n,
        phone,
        advisor: seed.a,
        ticket: seed.t ?? defaultTicket,
        status,
        amount: seed.price ?? defaultAmount,
        payTime,
        orderNo,
        // 取消由后台直接操作：历史已取消记录均视为已原路退款
        refunded: status === 'cancelled',
        formInfo: buildFormInfo(regFields, { ...seed, p: phone }, i++)
      }
      return record
    })
  })
}

const signupRecords = ref<SignupRecord[]>([
  // 十月投资沙龙·上海站：主活动 20 条记录（17 已报名 + 3 已取消·已退款）→ 17/80
  // 演示：张启航一笔订单购买 2 张标准票（本人 + 同事赵一鸣，其中 1 张已取消）；王雅琴/周敬之/林晚晴购买嘉宾票
  ...buildSignups('act-1', 299, '2026-10-09 18:32', [
    { n: '张启航', p: '138****1234', a: '李四', g: 1 },
    { n: '赵一鸣', p: '135****7890', a: '李四', s: 'cancelled', g: 1 },
    { n: '王雅琴', p: '139****5678', a: '王芳', t: '嘉宾票', price: 499 },
    { n: '陈默', p: '136****9012', a: '陈国栋' },
    { n: '刘思远', p: '137****3456', a: '刘敏' },
    { n: '孙晓梅', p: '188****2345', a: '李四' },
    { n: '周敬之', p: '186****3456', a: '王芳', t: '嘉宾票', price: 499 },
    { n: '吴桐', p: '158****4567', a: '陈国栋' },
    { n: '郑楚仪', p: '159****5678', a: '刘敏' },
    { n: '冯婧', p: '150****6789', a: '张启明' },
    { n: '蒋一帆', p: '155****7890', a: '李四' },
    { n: '沈星河', p: '170****8901', a: '王芳', s: 'cancelled' },
    { n: '韩雪松', p: '133****0123', a: '陈国栋' },
    { n: '杨知远', p: '130****4567', a: '刘敏' },
    { n: '朱静怡', p: '131****5678', a: '张启明' },
    { n: '胡明轩', p: '132****6789', a: '李四' },
    { n: '林晚晴', p: '133****7890', a: '王芳', t: '嘉宾票', price: 499 },
    { n: '何俊杰', p: '135****8901', a: '陈国栋', s: 'cancelled' },
    { n: '高子涵', p: '136****9012', a: '刘敏' },
    { n: '罗世坚', p: '137****0123', a: '张启明' }
  ]),
  // 十一月宏观策略闭门会·北京站：30 条全部已报名 → 30/30 满员
  ...buildSignups('act-full-01', 199, '2026-10-12 09:15', [
    { n: '许安然', p: '151****1024', a: '王芳' },
    { n: '沈从戎', p: '152****2048', a: '李四' },
    { n: '曹雨欣', p: '153****3072', a: '陈国栋' },
    { n: '谢东升', p: '155****4096', a: '刘敏' },
    { n: '邹文静', p: '156****5120', a: '张启明' },
    { n: '石浩宇', p: '157****6144', a: '李四' },
    { n: '孟繁星', p: '158****7168', a: '王芳' },
    { n: '秦子墨', p: '159****8192', a: '陈国栋' },
    { n: '侯梦瑶', p: '166****0102', a: '刘敏' },
    { n: '傅明远', p: '177****0204', a: '张启明' },
    { n: '尹晓东', p: '178****0306', a: '李四' },
    { n: '薛凯文', p: '179****0408', a: '王芳' },
    { n: '闫丽娜', p: '181****0510', a: '陈国栋' },
    { n: '蔡静怡', p: '182****0612', a: '刘敏' },
    { n: '潘志强', p: '183****0714', a: '张启明' },
    { n: '杜若飞', p: '184****0816', a: '李四' },
    { n: '夏语冰', p: '185****0918', a: '王芳' },
    { n: '姚一鸣', p: '187****1020', a: '陈国栋' },
    { n: '汪静之', p: '188****1122', a: '刘敏' },
    { n: '田子航', p: '189****1224', a: '张启明' },
    { n: '戴薇', p: '133****1326', a: '李四' },
    { n: '范晓峰', p: '135****1428', a: '王芳' },
    { n: '方鸿儒', p: '136****1530', a: '陈国栋' },
    { n: '金立成', p: '137****1632', a: '刘敏' },
    { n: '马啸天', p: '138****1734', a: '张启明' },
    { n: '邱雅琪', p: '139****1836', a: '李四' },
    { n: '窦明轩', p: '150****1938', a: '王芳' },
    { n: '白若溪', p: '151****2040', a: '陈国栋' },
    { n: '任晓雯', p: '152****2142', a: '刘敏' },
    { n: '柳青', p: '153****2244', a: '张启明' }
  ]),
  // 九月行业分享会（已结束）：12 条记录（10 已报名 + 2 已取消）→ 10/30
  ...buildSignups('act-ended-01', 199, '2026-09-01 10:00', [
    { n: '唐雨薇', p: '138****3311', a: '李四' },
    { n: '陆之遥', p: '139****4422', a: '王芳' },
    { n: '邓立群', p: '136****5533', a: '陈国栋' },
    { n: '曹志远', p: '137****6644', a: '刘敏' },
    { n: '彭飞', p: '135****7755', a: '张启明' },
    { n: '曾静怡', p: '188****8866', a: '李四', s: 'cancelled' },
    { n: '潘岳', p: '186****9977', a: '王芳' },
    { n: '项楠', p: '158****1188', a: '陈国栋' },
    { n: '董雨欣', p: '159****2299', a: '刘敏', s: 'cancelled' },
    { n: '余思思', p: '150****3310', a: '张启明' },
    { n: '苏峻', p: '155****4421', a: '李四' },
    { n: '叶知秋', p: '166****5532', a: '王芳' }
  ]),
  // 七月宏观策略闭门会·线上专场（已下架）：8 条记录（7 已报名 + 1 已取消）→ 7/40
  ...buildSignups('act-off-closed-01', 99, '2026-07-02 14:00', [
    { n: '丁一鸣', p: '138****7755', a: '李四' },
    { n: '施雨', p: '139****8866', a: '王芳' },
    { n: '张伟诚', p: '136****9977', a: '陈国栋' },
    { n: '孔明远', p: '137****1088', a: '刘敏' },
    { n: '郎静怡', p: '135****2199', a: '张启明' },
    { n: '冯振宇', p: '188****3210', a: '李四', s: 'cancelled' },
    { n: '蒋宜珊', p: '186****4321', a: '王芳' },
    { n: '韦东来', p: '158****5432', a: '陈国栋' }
  ])
])

const activities = ref<ActivityItem[]>(JSON.parse(JSON.stringify(activitiesMockRaw)))

// ==================== 行级工具 ====================
// 有效报名数：已报名（取消由后台直接操作，取消后立即释放席位）
const validCountOf = (a: ActivityItem) =>
  signupRecords.value.filter((r) => r.activityId === a.id && r.status === 'registered').length

// 票种汇总：最低价 / 票数之和
const minPriceOf = (a: ActivityItem) =>
  a.tickets.length ? Math.min(...a.tickets.map((t) => Number(t.price) || 0)) : 0
const totalQuotaOf = (a: ActivityItem) =>
  a.tickets.reduce((sum, t) => sum + (Number(t.count) || 0), 0)
// 报名费展示：单一票种显示价格，多票种显示最低价起
const fmtPriceCell = (a: ActivityItem) =>
  a.tickets.length > 1 ? `${fmtMoney(minPriceOf(a))} 起` : fmtMoney(minPriceOf(a))

const validCount = (a: ActivityItem) => validCountOf(a)
const isFull = (a: ActivityItem) => validCountOf(a) >= totalQuotaOf(a)
const isDeadlinePassed = (a: ActivityItem) => parseTime(a.signupDeadline) < Date.now()
const hasSignupRecords = (a: ActivityItem) => signupRecords.value.some((r) => r.activityId === a.id)
// 凡产生过报名记录（含已取消）的活动不允许删除
const canDelete = (a: ActivityItem) => a.status === 'off' && !hasSignupRecords(a)

// ==================== 查询与筛选 ====================
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  keyword: '',
  status: '' as '' | ActivityStatus
})

watch([() => queryParams.status, () => queryParams.keyword], () => {
  queryParams.pageNo = 1
})

const handleQuery = () => {
  queryParams.pageNo = 1
}

const resetQuery = () => {
  queryParams.keyword = ''
  queryParams.status = ''
  handleQuery()
}

const total = computed(
  () =>
    activities.value
      .filter((a) => !queryParams.status || a.status === queryParams.status)
      .filter(
        (a) =>
          !queryParams.keyword.trim() ||
          a.name.toLowerCase().includes(queryParams.keyword.trim().toLowerCase())
      ).length
)

const pagedList = computed(() =>
  activities.value
    .filter((a) => !queryParams.status || a.status === queryParams.status)
    .filter(
      (a) =>
        !queryParams.keyword.trim() ||
        a.name.toLowerCase().includes(queryParams.keyword.trim().toLowerCase())
    )
    .sort((x, y) => y.createdAt.localeCompare(x.createdAt))
    .slice(
      (queryParams.pageNo - 1) * queryParams.pageSize,
      queryParams.pageNo * queryParams.pageSize
    )
)

// ==================== 新建 / 编辑活动 ====================
const formRef = ref<FormInstance>()
const editingId = ref<string | null>(null)
const editingStatus = ref<ActivityStatus>('recruiting')

const isEditingRecruiting = computed(
  () => editingId.value !== null && editingStatus.value === 'recruiting'
)
const isEditingEnded = computed(() => editingId.value !== null && editingStatus.value === 'ended')
const isPriceLocked = isEditingRecruiting

const activityForm = reactive({
  name: '',
  cover: '',
  startTime: '',
  endTime: '',
  location: '',
  tickets: [] as TicketType[],
  regFields: [] as RegField[],
  signupDeadline: '',
  detailHtml: ''
})

// 票种字段校验（用于票种卡片内的独立 form-item）
const ticketRules: FormRules = {
  name: [
    { required: true, message: '请填写票种名称', trigger: 'blur' },
    { max: 20, message: '票种名称不能超过 20 字', trigger: 'blur' }
  ],
  price: [
    {
      validator: (_rule, value, callback) => {
        Number(value) > 0 ? callback() : callback(new Error('需大于 0'))
      },
      trigger: 'blur'
    }
  ],
  count: [
    {
      validator: (_rule, value, callback) => {
        Number.isInteger(Number(value)) && Number(value) > 0
          ? callback()
          : callback(new Error('需为大于 0 的整数'))
      },
      trigger: 'blur'
    }
  ]
}

const formRules = computed<FormRules>(() => {
  const rules: FormRules = {
    name: [
      { required: true, message: '请填写活动名称', trigger: 'blur' },
      { max: 50, message: '活动名称不能超过 50 字', trigger: 'blur' }
    ],
    cover: [{ required: true, message: '请上传活动海报', trigger: 'change' }],
    startTime: [
      {
        required: true,
        validator: (_rule, _value, callback) => {
          if (!activityForm.startTime) callback(new Error('请选择活动开始时间'))
          else if (!activityForm.endTime) callback(new Error('请选择活动结束时间'))
          else if (activityForm.endTime <= activityForm.startTime)
            callback(new Error('活动结束时间必须晚于开始时间'))
          else callback()
        },
        trigger: 'change'
      }
    ],
    location: [
      { required: true, message: '请填写活动地点', trigger: 'blur' },
      { max: 100, message: '活动地点不能超过 100 字', trigger: 'blur' }
    ],
    signupDeadline: [
      { required: true, message: '请选择报名截止时间', trigger: 'change' },
      {
        validator: (_rule, _value, callback) => {
          if (
            activityForm.endTime &&
            activityForm.signupDeadline &&
            activityForm.signupDeadline >= activityForm.endTime
          ) {
            callback(new Error('报名截止时间必须早于活动结束时间'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ],
    detailHtml: [
      {
        validator: (_rule, _value, callback) => {
          if (!plainText(activityForm.detailHtml)) callback(new Error('请填写活动详情'))
          else callback()
        },
        trigger: 'blur'
      }
    ]
  }
  // 编辑「已结束」活动仅活动详情可改
  if (isEditingEnded.value) return { detailHtml: rules.detailHtml }
  return rules
})

// 结束时间变化后重新校验活动时间，让行内错误提示即时消失
watch(
  () => activityForm.endTime,
  () => {
    if (activityForm.startTime && activityForm.endTime) {
      formRef.value?.validateField('startTime')
    }
  }
)

// 活动封面：本地预览（纯前端原型，不实际上传）
const handleCoverChange = (file: UploadFile) => {
  if (isEditingEnded.value) return
  const raw = file.raw
  if (!raw) return
  if (!['image/jpeg', 'image/png'].includes(raw.type)) {
    message.warning('仅支持 jpg / png 格式图片')
    return
  }
  activityForm.cover = URL.createObjectURL(raw)
}

// ==================== 票种 / 报名组件操作 ====================
const blankTicket = (): TicketType => ({
  id: uid('t'),
  name: '',
  price: undefined,
  count: undefined,
  desc: ''
})

const addTicket = () => {
  activityForm.tickets.push(blankTicket())
}

const removeTicket = (index: number) => {
  activityForm.tickets.splice(index, 1)
}

const addRegField = (type: RegFieldType) => {
  activityForm.regFields.push({
    id: uid('f'),
    type,
    label: '',
    required: true,
    options: []
  })
}

const removeRegField = (id: string) => {
  activityForm.regFields = activityForm.regFields.filter((f) => f.id !== id)
}

const addRegOption = (f: RegField) => {
  f.options.push('')
}

const removeRegOption = (f: RegField, index: number) => {
  f.options.splice(index, 1)
}

const openCreate = () => {
  editingId.value = null
  editingStatus.value = 'recruiting'
  activityForm.name = ''
  activityForm.cover = ''
  activityForm.startTime = ''
  activityForm.endTime = ''
  activityForm.location = ''
  activityForm.tickets = [blankTicket()]
  activityForm.regFields = defaultRegFields()
  activityForm.signupDeadline = ''
  activityForm.detailHtml = ''
  viewMode.value = 'form'
  nextTick(() => formRef.value?.clearValidate())
}

const openEdit = (a: ActivityItem) => {
  editingId.value = a.id
  editingStatus.value = a.status
  activityForm.name = a.name
  activityForm.cover = a.cover
  activityForm.startTime = a.startTime
  activityForm.endTime = a.endTime
  activityForm.location = a.location
  activityForm.tickets = JSON.parse(JSON.stringify(a.tickets))
  activityForm.regFields = JSON.parse(JSON.stringify(a.regFields))
  activityForm.signupDeadline = a.signupDeadline
  activityForm.detailHtml = a.detailHtml
  viewMode.value = 'form'
  nextTick(() => formRef.value?.clearValidate())
}

// 票种与报名组件的业务校验（编辑「已结束」仅改详情，不校验）
const validateTicketsAndFields = (): boolean => {
  if (!activityForm.tickets.length) {
    message.warning('请至少添加一个票种')
    return false
  }
  if (
    activityForm.tickets.some(
      (t) => !t.name.trim() || !(Number(t.price) > 0) || !(Number(t.count) > 0)
    )
  ) {
    message.warning('请完善票种信息（票种名称、价格、票数）')
    return false
  }
  const badChoice = activityForm.regFields.find(
    (f) => isChoiceField(f) && f.options.map((o) => o.trim()).filter(Boolean).length < 2
  )
  if (badChoice) {
    message.warning(`「${badChoice.label || REG_FIELD_LABEL[badChoice.type]}」的选项至少需要 2 项`)
    return false
  }
  if (activityForm.regFields.some((f) => !f.label.trim())) {
    message.warning('请填写报名组件的名称')
    return false
  }
  return true
}

const saveActivity = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    // 新建：保存即发布
    if (!editingId.value && parseTime(activityForm.signupDeadline) <= Date.now()) {
      message.warning('报名截止时间已过，无法发布，请先调整报名截止时间')
      return
    }

    // 编辑「已结束」：仅活动详情可修改
    if (editingId.value && isEditingEnded.value) {
      const target = activities.value.find((a) => a.id === editingId.value)
      if (target) target.detailHtml = activityForm.detailHtml
      viewMode.value = 'list'
      message.success('活动详情已保存，C 端介绍页实时同步')
      return
    }

    if (!validateTicketsAndFields()) return

    const payload = {
      name: activityForm.name.trim(),
      cover: activityForm.cover,
      startTime: activityForm.startTime,
      endTime: activityForm.endTime,
      location: activityForm.location.trim(),
      tickets: activityForm.tickets.map((t) => ({
        id: t.id,
        name: t.name.trim(),
        price: Number(t.price),
        count: Number(t.count),
        desc: t.desc.trim()
      })),
      regFields: activityForm.regFields.map((f) => ({
        id: f.id,
        type: f.type,
        label: f.label.trim(),
        required: f.required,
        options: [...f.options],
        fixed: f.fixed
      })),
      signupDeadline: activityForm.signupDeadline,
      detailHtml: activityForm.detailHtml
    }

    // 编辑「报名中」：保存后仍为报名中（票种价格在表单中锁定，保持原值）
    if (editingId.value && isEditingRecruiting.value) {
      const target = activities.value.find((a) => a.id === editingId.value)
      if (target) Object.assign(target, payload)
      viewMode.value = 'list'
      message.success('修改已保存，C 端实时同步')
      return
    }

    // 编辑「已下架」：全部字段可改，保存后保持已下架
    if (editingId.value) {
      const target = activities.value.find((a) => a.id === editingId.value)
      if (!target) return
      Object.assign(target, payload)
      viewMode.value = 'list'
      message.success('修改已保存，重新上架后对 C 端生效')
      return
    }

    // 新建：保存即发布，生成分享链接
    const newId = 'act-' + Date.now()
    activities.value.unshift({
      id: newId,
      ...payload,
      status: 'recruiting',
      createdAt: nowText(),
      shareUrl: SHARE_URL_PREFIX + newId
    })
    viewMode.value = 'list'
    message.success('活动已发布，报名通道已开启，分享链接已生成')
  })
}

// ==================== 列表状态操作 ====================
// 下架免确认
const handleOffline = (a: ActivityItem) => {
  a.status = 'off'
  message.success(`活动《${a.name}》已下架，分享链接已关闭`)
}

const handleOnline = (a: ActivityItem) => {
  if (isDeadlinePassed(a)) {
    message.warning('报名截止时间已过，无法上架')
    return
  }
  a.status = 'recruiting'
  message.success(`活动《${a.name}》已重新上架，报名通道恢复`)
}

// 删除：二次确认
const handleDelete = (a: ActivityItem) => {
  message
    .confirm('删除后活动不可恢复，确认删除？', '删除确认')
    .then(() => {
      activities.value = activities.value.filter((item) => item.id !== a.id)
      signupRecords.value = signupRecords.value.filter((r) => r.activityId !== a.id)
      message.success(`已删除活动：${a.name}`)
    })
    .catch(() => {})
}

// ==================== 分享弹窗 ====================
const shareVisible = ref(false)
const shareActivityId = ref('')
const shareQrDataUrl = ref('')
const shareActivity = computed(
  () => activities.value.find((a) => a.id === shareActivityId.value) || null
)

const openShare = (a: ActivityItem) => {
  if (a.status !== 'recruiting') {
    message.warning('仅「报名中」的活动可以分享')
    return
  }
  shareActivityId.value = a.id
  shareQrDataUrl.value = ''
  shareVisible.value = true
  QRCode.toDataURL(a.shareUrl, { width: 240, margin: 1 }).then((url) => {
    shareQrDataUrl.value = url
  })
}

const copyShareLink = async () => {
  const a = shareActivity.value
  if (!a) return
  const ok = await copyText(a.shareUrl)
  ok ? message.success('分享链接已复制') : message.error('复制失败，请手动复制')
}

const downloadQr = () => {
  const a = shareActivity.value
  if (!a || !shareQrDataUrl.value) return
  const link = document.createElement('a')
  link.href = shareQrDataUrl.value
  link.download = `${a.name}-活动二维码.png`
  link.click()
  message.success('二维码已下载')
}

// ==================== 视图切换（列表 ↔ 详情） ====================
const viewMode = ref<'list' | 'detail' | 'form'>('list')
const detailActivityId = ref('')
const detailTab = ref<'all' | SignupStatus>('all')

const detailActivity = computed(
  () => activities.value.find((a) => a.id === detailActivityId.value) || null
)

const openDetail = (a: ActivityItem) => {
  detailActivityId.value = a.id
  detailTab.value = 'all'
  viewMode.value = 'detail'
}

const backToList = () => {
  viewMode.value = 'list'
}

// ==================== 详情视图 · 报名名单 ====================
const detailRecords = computed(() => {
  return signupRecords.value
    .filter((r) => r.activityId === detailActivityId.value)
    .filter((r) => detailTab.value === 'all' || r.status === detailTab.value)
    .sort((x, y) => y.payTime.localeCompare(x.payTime))
})

const detailCounts = computed(() => {
  const list = signupRecords.value.filter((r) => r.activityId === detailActivityId.value)
  return {
    all: list.length,
    registered: list.filter((r) => r.status === 'registered').length,
    cancelled: list.filter((r) => r.status === 'cancelled').length
  }
})

// 该份票在指定报名组件下填写的内容（与导出 Excel 取值逻辑一致，按组件名称匹配）
const formValueOf = (r: SignupRecord, f: RegField) =>
  r.formInfo.find((x) => x.label === f.label)?.value ?? ''

// 当前活动是否配置了手机号组件（决定理财师列的位置：有则紧跟手机号，无则排在报名信息末尾）
const hasPhoneField = computed(
  () => !!detailActivity.value?.regFields.some((f) => f.type === 'phone')
)

// ==================== 取消报名（后台直接操作） ====================
// 取消后席位立即释放，实付费用原路退回
const cancelSignup = (r: SignupRecord) => {
  message
    .confirm(
      `取消「${r.name}」的「${r.ticket}」报名后，席位立即释放，实付 ${fmtMoney(r.amount)} 将原路退回。确认取消？`,
      '取消报名'
    )
    .then(() => {
      r.status = 'cancelled'
      r.refunded = true
      message.success('已取消报名，费用将原路退回')
    })
    .catch(() => {})
}

// 前端原型导出：生成 xlsx，表头与报名名单列表完全一致（固定信息列在前，报名组件动态列在后）
const exportSignupsExcel = () => {
  const a = detailActivity.value
  if (!a) return
  const hasPhone = a.regFields.some((f) => f.type === 'phone')
  // 表头与报名名单列表一致：固定列在前，报名信息动态列在后；理财师紧跟手机号组件后，无手机号组件则排末尾
  const dynamicLabels: string[] = []
  a.regFields.forEach((f) => {
    dynamicLabels.push(f.label)
    if (f.type === 'phone') dynamicLabels.push('理财师')
  })
  if (!hasPhone) dynamicLabels.push('理财师')
  const header = ['报名用户', '会员手机号', '票种', '报名时间', '价格', '状态', '订单号', ...dynamicLabels]
  const rows = detailRecords.value.map((r) => {
    const dynamicCells: string[] = []
    a.regFields.forEach((f) => {
      dynamicCells.push(r.formInfo.find((x) => x.label === f.label)?.value ?? '')
      if (f.type === 'phone') dynamicCells.push(r.advisor)
    })
    if (!hasPhone) dynamicCells.push(r.advisor)
    return [
      r.name,
      r.phone,
      r.ticket,
      r.payTime,
      String(r.amount),
      r.status === 'registered' ? '已报名' : r.refunded ? '已取消（已退款）' : '已取消',
      r.orderNo,
      ...dynamicCells
    ]
  })
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
  ws['!cols'] = header.map((h) => ({ wch: Math.max(10, String(h).length * 2 + 4) }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '报名名单')
  XLSX.writeFile(wb, `${a.name}-报名名单-${todayText()}.xlsx`)
}
</script>

<style scoped>
/* 活动名称列：名称 + 地点副行 */
.name-cell {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
}

.name-text {
  font-weight: 600;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-text {
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-variant-numeric: tabular-nums;
}

.quota-text {
  font-weight: 600;
  color: var(--el-text-color-regular);
  font-variant-numeric: tabular-nums;
}

.quota-text.is-full {
  color: var(--el-color-warning);
}

.time-line {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  font-variant-numeric: tabular-nums;
}

.time-end {
  color: var(--el-text-color-placeholder);
}

/* 表单弹窗：字段灰字提示 */
.field-hint {
  width: 100%;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
  margin-top: 2px;
}

/* 新建/编辑表单页：顶部工具栏（返回 + 标题 + 操作按钮） */
.form-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.form-toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

/* 表单分组标题 */
.form-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  padding-bottom: 12px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.form-section-title:not(:first-child) {
  margin-top: 32px;
}

.section-hint {
  margin: -8px 0 16px;
}

.inline-hint {
  margin-left: 12px;
}

/* 活动时间：开始 ~ 结束 */
.time-sep {
  padding: 0 8px;
  color: var(--el-text-color-secondary);
}

/* 票种卡片 */
.ticket-card {
  position: relative;
  max-width: 860px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 24px 24px 0;
  margin-bottom: 12px;
}

.ticket-actions {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 12px;
}

/* 卡片内校验错误提示不换行，避免被下方内容遮挡 */
.ticket-card :deep(.el-form-item__error) {
  white-space: nowrap;
}

/* 报名信息组件行 */
.reg-field-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.reg-field-tag {
  flex-shrink: 0;
  width: 68px;
  justify-content: center;
}

.reg-field-label {
  flex-shrink: 0;
  width: 220px;
}

/* 选项类组件：选项逐项添加 */
.reg-field-row.is-column {
  flex-wrap: wrap;
}

.reg-options-box {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  margin-left: 78px;
  padding: 10px 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
}

.reg-option-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reg-option-index {
  flex-shrink: 0;
  width: 20px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.reg-option-input {
  max-width: 360px;
}

.reg-option-add {
  align-self: flex-start;
}

/* 分享弹窗二维码 */
.qr-box {
  display: flex;
  width: 240px;
  height: 240px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.qr-img {
  display: block;
  width: 220px;
  height: 220px;
}

.qr-loading {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

/* ==================== 活动详情视图 ==================== */
.detail-head {
  display: flex;
  gap: 20px;
}

.detail-cover {
  width: 168px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--el-fill-color-light);
}

.detail-info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

.detail-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.detail-meta {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.detail-price {
  font-weight: 700;
  color: var(--el-color-danger);
  font-variant-numeric: tabular-nums;
}

.detail-actions {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

/* 报名名单：计数页签 + 导出 */
.signup-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.signup-tabs {
  flex: 1;
}

.signup-tabs :deep(.el-tabs__header) {
  margin-bottom: 12px;
}

/* 导出按钮与 tabs 文字行居中对齐，整体位于 tabs 分割线上方 */
.signup-export-btn {
  margin-top: 4px;
}

/* 报名状态：色点 + 文字 */
.signup-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.signup-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.signup-status.is-ok {
  color: var(--el-text-color-regular);
}

.signup-status.is-ok .signup-status-dot {
  background: var(--el-color-success);
}

.signup-status.is-cancel {
  color: var(--el-text-color-secondary);
}

.signup-status.is-cancel .signup-status-dot {
  background: var(--el-color-disabled);
}

.refund-mark {
  display: inline-block;
  margin-left: 6px;
  padding: 0 6px;
  border-radius: 3px;
  font-size: 11px;
  line-height: 18px;
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.op-dash {
  color: var(--el-text-color-placeholder);
}

/* 封面上传：750×480 比例单图卡片 */
.cover-uploader :deep(.el-upload--picture-card) {
  width: 148px;
  height: 95px;
}

.cover-uploader :deep(.el-upload.is-disabled) {
  cursor: not-allowed;
  opacity: 0.6;
}

.cover-preview {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
}

.cover-plus {
  font-size: 20px;
  color: var(--el-text-color-secondary);
}
</style>
