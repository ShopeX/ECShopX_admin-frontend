<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<template>
  <SpPage>
    <div class="page-body">
      <template v-if="$route.path.indexOf('detail') === -1">
        <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
          <SpFilterFormItem v-if="!VERSION_B2C()" prop="distributor" label="店铺名称:">
            <el-autocomplete
              v-model="params.distributor.name"
              :fetch-suggestions="queryStoreSearch"
              placeholder="请输入店铺名称"
              @select="handleSelectStore"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="create_time" label="日期范围:">
            <el-date-picker
              v-model="params.create_time"
              type="daterange"
              value-format="yyyy/MM/dd"
              placeholder="选择日期范围"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="order_id" label="订单号:">
            <el-input v-model="params.order_id" placeholder="订单号" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_bn" label="售后单号:">
            <el-input v-model="params.aftersales_bn" placeholder="请填写售后单号" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_name" label="商品名称:">
            <el-input v-model="params.item_name" placeholder="请填写商品名称" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="mobile" label="手机号:">
            <el-input v-model="params.mobile" placeholder="手机号" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_status" label="售后状态:">
            <el-select v-model="params.aftersales_status" clearable placeholder="售后状态">
              <el-option
                v-for="(item, index) in aftersalesStatusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_type" label="售后类型:">
            <el-select v-model="params.aftersales_type" placeholder="请选择售后类型">
              <el-option
                v-for="(item, index) in $store.getters.login_type == 'merchant'
                  ? aftersalesTypeListOther
                  : aftersalesTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_bn" label="SKU编号:">
            <el-input v-model="params.item_bn" placeholder="SKU编号" />
          </SpFilterFormItem>

          <SpFilterFormItem
            v-if="VERSION_STANDARD() || IS_ADMIN()"
            prop="supplier_name"
            label="来源供应商:"
          >
            <el-input v-model="params.supplier_name" placeholder="请输入来源供应商" />
          </SpFilterFormItem>
          <SpFilterFormItem
            v-if="VERSION_STANDARD() || IS_ADMIN()"
            prop="order_holder"
            label="订单分类:"
          >
            <el-select v-model="params.order_holder" clearable placeholder="请选择">
              <el-option
                v-for="item in orderCategory"
                :key="item.value"
                size="mini"
                :label="item.title"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem v-if="IS_SUPPLIER()" prop="distributor_id" label="来源店铺:">
            <SpSelectShop v-model="params.distributor_id" clearable placeholder="请选择" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="order_class" label="订单类型:">
            <el-select v-model="params.order_class" clearable placeholder="请选择">
              <el-option
                v-for="item in orderType"
                :key="item.value"
                size="mini"
                :label="item.title"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem
            v-if="is_pharma_industry"
            prop="is_prescription_order"
            label="是否处方药:"
          >
            <el-select v-model="params.is_prescription_order" clearable placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </SpFilterFormItem>
          <!-- <SpFilterFormItem v-if="is_pharma_industry" prop="user_family_name" label="用药人姓名:">
          <el-input v-model="params.user_family_name" placeholder="请输入用药人姓名" />
        </SpFilterFormItem> -->
        </SpFilterForm>
        <SpFinder
          ref="finder"
          url="/aftersales"
          :setting="finderSetting"
          :hooks="{
            beforeSearch: beforeSearch
          }"
          reserve-selection
          row-key="aftersales_bn"
          fixed-row-action
          @selection-change="handleSelectionChange"
        >
          <template slot="tableTop">
            <div class="action-container">
              <el-button @click="exportData" type="primary" plain> 导出 </el-button>
              <el-button v-if="showAftersale" type="primary" plain @click="aftersalesRemindAction">
                售后提醒内容
              </el-button>
              <el-button type="primary" plain @click="aftersalesAction('approved')">
                批量审核
              </el-button>
              <el-button type="primary" plain @click="aftersalesAction('refund')">
                批量退款
              </el-button>
            </div>
          </template>
        </SpFinder>

        <!-- 售后提醒内容 -开始 -->
        <el-dialog
          :title="aftersalesRemindTitle"
          :visible.sync="aftersalesRemindVisible"
          :before-close="handleCancel"
          width="65%"
        >
          <template>
            <el-form
              ref="aftersalesRemindForm"
              :model="aftersalesRemindForm"
              class="demo-ruleForm"
              label-width="100px"
            >
              <el-form-item label="提醒内容">
                <template>
                  <SpRichText v-model="aftersalesRemindForm.intro" />
                </template>
                <span class="frm-tips"
                  >例如：由于商品的特殊性，如涉及机油类产品需寄回，建议使用京东快递，快递公司联系电话955XX。</span
                >
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch
                  v-model="aftersalesRemindForm.is_open"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
                <br />
                <span class="frm-tips"
                  >如开启展示，则后台所输入内容将会展示在前端消费者提交售后申请的页面上，内容不超过200字</span
                >
              </el-form-item>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleCancel"> 取消 </el-button>
            <el-button type="primary" @click="submitAftersalesRemind"> 确定 </el-button>
          </div>
        </el-dialog>
        <RemarkModal ref="modalRef" @onDone="handleRemarksDone" />

        <!-- 批量审核弹框 -->
        <SpDialog
          ref="batchReviewDialogRef"
          v-model="batchReviewDialog"
          title="批量审核（售后申请）"
          :form="batchReviewForm"
          :form-list="batchReviewFormList"
          @onSubmit="onBatchReviewSubmit"
        />
      </template>
      <router-view />
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import RemarkModal from '@/components/remarkModal'
import SpDialog from '@/components/sp-dialog'
import mixin, { pageMixin, remarkMixin } from '@/mixins'
import { VERSION_B2C, IS_SUPPLIER } from '@/utils'
import { ORDER_CATEGORY, ORDER_TYPE } from '@/consts'
export default {
  components: {
    RemarkModal,
    SpDialog
  },
  mixins: [mixin, remarkMixin, pageMixin],
  data() {
    const initialParams = {
      distributor: {
        id: undefined,
        name: undefined
      },
      create_time: '',
      receiver_mobile: '',
      order_id: undefined,
      aftersales_bn: undefined,
      mobile: undefined,
      aftersales_status: undefined,
      aftersales_type: undefined,
      original_order_id: undefined,
      item_bn: undefined,
      supplier_name: undefined,
      order_holder: undefined,
      distributor_id: undefined,
      order_class: undefined,
      yyrname: undefined,
      is_prescription_order: undefined,
      user_family_name: undefined,
      item_name: undefined
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      is_pharma_industry: false,
      orderType: ORDER_TYPE,
      orderCategory: ORDER_CATEGORY,
      shopList: [],
      aftersalesStatusList: [
        { name: '待处理', value: '0' },
        { name: '处理中', value: '1' },
        { name: '已处理', value: '2' },
        { name: '已驳回', value: '3' }
      ],
      aftersalesTypeList: [
        { name: '仅退款', value: 'ONLY_REFUND' },
        { name: '退货退款', value: 'REFUND_GOODS' }
        // { name: '换货', value: 'EXCHANGING_GOODS' }
      ],
      aftersalesTypeListOther: [
        { name: '仅退款', value: 'ONLY_REFUND' },
        { name: '退货退款', value: 'REFUND_GOODS' }
      ],
      aftersalesRemindForm: {
        intro: '',
        is_open: false
      },
      aftersalesRemindVisible: false,
      aftersalesRemindTitle: '售后提醒内容',
      orderType: ORDER_TYPE,
      multipleSelection: [],
      // 批量审核相关
      batchReviewType: 'approved',
      batchReviewDialog: false,
      batchReviewForm: {
        is_approved: '1', // 默认通过
        refuse_reason: ''
      },
      batchReviewFormList: [
        {
          label: '审核状态',
          key: 'is_approved',
          type: 'radio',
          required: true,
          options: [
            { label: '1', name: '通过' },
            { label: '0', name: '拒绝' }
          ]
        },
        {
          label: '拒绝原因',
          key: 'refuse_reason',
          type: 'textarea',
          placeholder: '拒绝原因',
          width: '100%',
          isShow: ({ key }, value) => {
            console.log(key, value, '--')
            return value.is_approved == '0'
          },
          validator: (rule, value, callback) => {
            if (value.is_approved == 0 && !value.refuse_reason) {
              callback(new Error('请填写拒绝原因'))
            } else {
              callback()
            }
          }
        }
      ],
      finderSetting: {
        columns: [
          {
            name: '售后单',
            key: 'aftersales_bn',
            width: 200,
            render: (h, { row }) => {
              return h('div', [
                h('div', { class: 'order-num' }, [
                  h(
                    'span',
                    {},
                    row.aftersales_bn
                  ),
                  h(
                    'el-tooltip',
                    {
                      props: { effect: 'dark', content: '复制', placement: 'top-start' }
                    },
                    [
                      h('i', {
                        class: 'el-icon-document-copy',
                        style: { cursor: 'pointer' },
                        on: {
                          click: () => this.copyToClipboard(row.aftersales_bn)
                        }
                      })
                    ]
                  )
                ]),
                row.distributor_id !== '0' &&
                  h('div', { class: 'order-store' }, [
                    h(
                      'el-tooltip',
                      {
                        props: { effect: 'dark', content: '店铺名', placement: 'top-start' }
                      },
                      [h('i', { class: 'el-icon-office-building' })]
                    ),
                    row.distributor_info.name
                  ]),
                h('div', { class: 'order-time' }, [
                  h(
                    'el-tooltip',
                    {
                      props: { effect: 'dark', content: '申请时间', placement: 'top-start' }
                    },
                    [h('i', { class: 'el-icon-time' })]
                  ),
                  this.$options.filters.datetime(row.create_time, 'YYYY-MM-DD HH:mm:ss')
                ])
              ])
            }
          },
          {
            name: '订单号',
            key: 'order_id',
            minWidth: 180,
            render: (h, { row }) => {
              return h('div', { class: 'order-num' }, [
                h(
                  'span',
                  {},
                  row.order_id
                ),
                h(
                  'el-tooltip',
                  {
                    props: { effect: 'dark', content: '复制', placement: 'top-start' }
                  },
                  [
                    h('i', {
                      class: 'el-icon-document-copy',
                      style: { cursor: 'pointer' },
                      on: {
                        click: () => this.copyToClipboard(row.order_id)
                      }
                    })
                  ]
                )
              ])
            }
          },
          {
            name: '子单商品',
            key: 'sub_order_items',
            minWidth: 220,
            render: (h, { row }) => {
              if (row.detail && row.detail.length > 0) {
                return h(
                  'div',
                  row.detail.map((item) =>
                    h('div', { style: { marginBottom: '4px' } }, [
                      h('div', { style: {} }, item.item_name),
                      h('div', { style: {} }, `货号: ${item.item_bn}`)
                    ])
                  )
                )
              }
              return h('span', {}, '-')
            }
          },
          {
            name: '退款商品金额（¥）',
            key: 'refund_fee',
            width: 160,
            align: 'center'
          },
          {
            name: '退款抵扣积分',
            key: 'refund_point',
            width: 160,
            align: 'center'
          },
          {
            name: '退款运费金额（¥）',
            key: 'freight',
            width: 150,
            align: 'center',
            render: (h, { row }) => {
              if (row.freight_type == 'point') return null
              return h('span', {}, (row.freight / 100).toFixed(2))
            },
          },
          {
            name: '退款运费（积分）',
            key: 'freight',
            width: 160,
            align: 'center',
            render: (h, { row }) => {
              if (row.freight_type == 'cash') return null
              return h('span', {}, row.freight)
            },
          },
          {
            name: '实退金额（¥）',
            key: 'refunded_fee',
            width: 150,
            align: 'center',
            render: (h, { row }) => {
              if (row.freight_type == 'point') return null
              const amount = row.refunded_fee || 0
              return h('span', {}, `${(amount / 100).toFixed(2)}`)
            }
          },
          {
            name: '实退积分',
            key: 'refunded_point',
            width: 120,
            align: 'center',
            render: (h, { row }) => {
              if (row.freight_type == 'cash') return null
              const points = row.refunded_point || 0
              return h('span', {}, `${points}`)
            }
          },
          // {
          //   name: '业务员',
          //   key: 'salesman_mobile',
          //   visible: !this.IS_SUPPLIER(),
          //   render: (h, { row }) => {
          //     return h('div', [
          //       row.salesman_mobile,
          //       this.datapass_block == 0 && h('el-tooltip', {
          //         props: { effect: 'dark', content: '复制', placement: 'top-start' }
          //       }, [
          //         h('i', {
          //           class: 'el-icon-document-copy',
          //           style: { cursor: 'pointer' },
          //           on: {
          //             click: () => this.copyToClipboard(row.salesman_mobile)
          //           }
          //         })
          //       ])
          //     ])
          //   }
          // },
          {
            name: '手机号',
            key: 'mobile',
            minWidth: 150,
            visible: !this.IS_SUPPLIER(),
            render: (h, { row }) => {
              if (!row.user_delete && this.$store.getters.login_type !== 'merchant') {
                const linkPath =
                  this.$store.getters.login_type != 'distributor'
                    ? '/member/member/memberlist/detail'
                    : '/shopadmin/member/member/memberlist/detail'

                return h('div', { class: 'order-num' }, [
                  h('span', {}, row.mobile)
                ])
              }
              return h('span', {}, row.mobile)
            }
          },
          {
            name: '导购',
            key: 'salesman_name',
            width: 100
          },
          {
            name: '订单分类',
            key: 'order_holder',
            width: 120,
            render: (h, { row }) => h('span', {}, this.getOrderCategoryName(row.order_holder)),
            visible: this.VERSION_STANDARD() || this.IS_ADMIN()
          },
          {
            name: '来源供应商',
            key: 'supplier_name',
            minWidth: 100,
            visible: this.VERSION_STANDARD() || this.IS_ADMIN()
          },
          {
            name: '配送员',
            key: 'self_delivery_operator_name',
            visible: !this.IS_SUPPLIER()
          },
          {
            name: '姓名',
            key: 'contact',
            minWidth: 100,
            visible: this.IS_SUPPLIER()
          },
          {
            name: 'SKU编号',
            key: '',
            minWidth: 150,
            visible: this.IS_SUPPLIER(),
            render: (h, { row }) => h('span', {}, row.detail[0].item_bn)
          },
          {
            name: '商品名称',
            key: '',
            minWidth: 100,
            visible: this.IS_SUPPLIER(),
            render: (h, { row }) => h('span', {}, row.detail[0].item_name)
          },
          {
            name: '售后商品数量',
            key: '',
            minWidth: 120,
            visible: this.IS_SUPPLIER(),
            render: (h, { row }) => h('span', {}, row.detail[0].num)
          },
          {
            name: '金额',
            key: 'detail.0.refund_fee',
            minWidth: 100,
            visible: this.IS_SUPPLIER(),
            render: (h, { row }) => h('span', {}, `${(row.detail[0].refund_fee / 100).toFixed(2)}`)
          },
          {
            name: '售后原因',
            key: 'reason',
            minWidth: 100,
            visible: this.IS_SUPPLIER()
          },
          {
            name: '修改时间',
            key: 'update_time',
            minWidth: 100,
            visible: this.IS_SUPPLIER()
          },
          {
            name: '售后类型',
            key: 'aftersales_type',
            width: 100,
            render: (h, { row }) => {
              const typeMap = {
                'ONLY_REFUND': { text: '仅退款', type: 'info' },
                'REFUND_GOODS': { text: '退货退款', type: 'warning' },
                'EXCHANGING_GOODS': { text: '换货', type: 'danger' }
              }
              const type = typeMap[row.aftersales_type]
              return type
                ? h(
                    'el-tag',
                    {
                      props: { type: type.type, size: 'mini' }
                    },
                    type.text
                  )
                : h('span', {}, row.aftersales_type)
            }
          },
          {
            name: '售后状态',
            key: 'aftersales_status',
            width: 100,
            render: (h, { row }) => {
              const statusMap = {
                '0': { text: '待处理', type: '' },
                '1': { text: '处理中', type: '' },
                '2': { text: '已处理', type: 'success' },
                '3': { text: '已驳回', type: 'success' },
                '4': { text: '已关闭', type: 'success' }
              }
              const status = statusMap[row.aftersales_status]
              return status
                ? h(
                    'el-tag',
                    {
                      props: { type: status.type, size: 'mini' }
                    },
                    status.text
                  )
                : h('span', {}, row.aftersales_status)
            }
          },
          {
            name: '操作',
            key: 'actions',
            width: 100,
            fixed: 'left',
            render: (h, { row }) => {
              return h('div', [
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: {
                      click: () => {
                        this.$router.push({
                          path: this.matchRoutePath('detail'),
                          query: { aftersales_bn: row.aftersales_bn, resource: this.$route.path }
                        })
                      }
                    }
                  },
                  '详情'
                ),
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: {
                      click: () => this.clickShowRemark(row, 'afterList')
                    }
                  },
                  '备注'
                )
              ])
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    showAftersale() {
      return (
        this.$store.getters.login_type != 'merchant' &&
        this.$store.getters.login_type != 'distributor'
      )
    }
  },
  watch: {
    $route(to, from) {},
    'params.distributor': {
      handler: function (val) {
        if (!val.name && val.id) {
          this.params.distributor = {
            id: undefined,
            name: undefined
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.query.aftersales_status) {
      this.params.aftersales_status = this.$route.query.aftersales_status
    }
    this.getBaseSetting()
    //获取所有店铺
    this.getStoreList()
  },
  methods: {
    async getBaseSetting() {
      const res = await this.$api.company.getGlobalSetting()
      this.is_pharma_industry = res.medicine_setting.is_pharma_industry == '1'
    },
    handleSelectStore(storeItem) {
      this.params.distributor.id = storeItem.distributor_id
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateTransfer(val) {
      let time_start_begin = undefined
      let time_start_end = undefined
      if (val.length > 0) {
        time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      return {
        time_start_begin,
        time_start_end
      }
    },
    getParams() {
      let params = {
        ...this.dateTransfer(this.params.create_time),
        order_id: this.params.order_id || undefined,
        aftersales_bn: this.params.aftersales_bn || undefined,
        mobile: this.params.mobile || undefined,
        receiver_mobile: this.params.receiver_mobile || undefined,
        aftersales_status: this.params.aftersales_status || undefined,
        aftersales_type: this.params.aftersales_type || undefined,
        supplier_name: this.params.supplier_name || undefined,
        order_holder: this.params.order_holder || undefined,
        distributor_id: this.params.distributor_id || undefined,
        order_class: this.params.order_class || undefined,
        yyrname: this.params.yyrname || undefined,
        is_prescription_order: this.params.is_prescription_order || undefined,
        user_family_name: this.params.user_family_name || undefined
      }
      return params
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
      this.$refs.finder.refresh()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.$refs.finder.refresh()
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach((row) => {
          this.shopList.push({ 'value': row.name, 'distributor_id': row.distributor_id })
        })
      }
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    getOrderCategoryName(order_holder) {
      const item = this.orderCategory.find((item) => item.value == order_holder)
      return item ? item.title : ''
    },
    async exportData() {
      const { status, url, filename } = await this.$api.aftersales.exportList(this.getParams())
      if (status) {
        this.$message({
          type: 'success',
          message: '已加入执行队列，请在设置-导出列表中下载'
        })
        this.$export_open('aftersale_record_count')
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      } else {
        this.$message({
          type: 'error',
          message: '没有相关数据可导出'
        })
      }
    },
    async aftersalesRemindAction() {
      // 请求提醒数据
      const data = await this.$api.aftersales.getAftersalesRemind()
      if (data) {
        this.aftersalesRemindForm = data
      }
      this.aftersalesRemindVisible = true
    },
    updateContent: function (data) {
      this.aftersalesRemindForm.intro = data
    },
    handleCancel() {
      this.aftersalesRemindVisible = false
      this.aftersalesRemindForm.intro = ''
      this.aftersalesRemindForm.is_open = false
    },
    async submitAftersalesRemind() {
      let params = {
        intro: this.aftersalesRemindForm.intro,
        is_open: this.aftersalesRemindForm.is_open
      }
      await this.$api.aftersales.setAftersalesRemind(params)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.aftersalesRemindVisible = false
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange', val)
      if (val) {
        this.multipleSelection = val
      }
    },
    getRowKeys(val) {
      return val.aftersales_bn
    },
    beforeSearch(params) {
      const searchParams = {
        ...params,
        ...this.params,
        ...this.dateTransfer(this.params.create_time || [])
      }
      return searchParams
    },
    copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        // 使用现代 Clipboard API
        navigator.clipboard
          .writeText(text)
          .then(() => {
            this.$message.success('复制成功')
          })
          .catch(() => {
            this.fallbackCopyTextToClipboard(text)
          })
      } else {
        // 降级到传统方法
        this.fallbackCopyTextToClipboard(text)
      }
    },
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          this.$message.success('复制成功')
        } else {
          this.$message.error('复制失败')
        }
      } catch (err) {
        this.$message.error('复制失败')
      }
      document.body.removeChild(textArea)
    },
    async aftersalesAction(type) {
      this.batchReviewType = type
      const selection = this.$refs.finder.$refs.finderTable.getSelection()
      if (selection.length === 0) {
        return this.$message.error('请选择需要审核的数据')
      }

      // 重置表单
      this.batchReviewForm = {
        is_approved: '1',
        refuse_reason: ''
      }
      // 打开弹框
      this.batchReviewDialog = true
    },
    async onBatchReviewSubmit() {
      try {
        const selection = this.$refs.finder.$refs.finderTable.getSelection()
        if (this.batchReviewForm.is_approved == 0 && !this.batchReviewForm.refuse_reason) {
          this.$message.error('请填写拒绝原因')
          return
        }

        const aftersalesBns = selection.map((row) => row.aftersales_bn)
        let params = {
          aftersales_bn: aftersalesBns
        }
        if (this.batchReviewType == 'refund') {
          params.check_refund = this.batchReviewForm.is_approved
          params.refunds_memo = this.batchReviewForm.refuse_reason
        } else {
          params.is_approved = this.batchReviewForm.is_approved
          params.refuse_reason = this.batchReviewForm.refuse_reason
        }
        console.log('批量审核参数:', params)
        if (this.batchReviewType == 'refund') {
          await this.$api.aftersales.refundCheck(params)
        } else {
          await this.$api.aftersales.reviewAftersales(params)
        }
        this.$message.success(`操作成功`)
        this.batchReviewDialog = false
        this.$refs.finder.refresh()
      } catch (error) {
        console.error('批量审核失败:', error)
        this.$message.error('批量审核失败，请重试')
      }
    }
  }
}
</script>
