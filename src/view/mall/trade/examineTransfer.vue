<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage>
    <SpRouterView>
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="bank_account_name" label="收款账户名:">
          <el-input v-model="params.bank_account_name" placeholder="请输入收款账户名" />
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="user_mobile" label="手机号:">
          <el-input v-model="params.user_mobile" placeholder="请输入手机号" />
        </SpFilterFormItem> -->
        <SpFilterFormItem prop="order_id" label="订单号:">
          <el-input v-model="params.order_id" placeholder="请输入订单号" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="check_status" label="状态:">
          <el-select v-model="params.check_status">
            <el-option
              v-for="item in checkStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="bank_name" label="收款银行:">
          <el-select v-model="params.bank_name">
            <el-option
              v-for="item in bankList"
              :key="item.bank_name"
              :label="item.label"
              :value="item.bank_name"
            />
          </el-select>
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="pay_account_bank" label="付款账户名:">
          <el-input v-model="params.pay_account_bank" placeholder="请输入付款账户名" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="pay_account_no" label="付款卡号:">
          <el-input v-model="params.pay_account_no" placeholder="请输入付款卡号" />
        </SpFilterFormItem> -->
        <SpFilterFormItem prop="create_time" label="日期范围:">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" plain @click="exportData"> 导出 </el-button>
      </div>

      <SpFinder
        ref="finder"
        url="/order/offline_payment/get_list"
        :fixed-row-action="true"
        no-selection
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch
        }"
      />

      <SpDialog
        ref="addDialogRef"
        v-model="deliveryman"
        width="900px"
        :is-show-footer="!isLook"
        :confirm-status="confirmStatus"
        :title="editTitle"
        :form="addForm"
        :form-list="addFormList"
        @onSubmit="onAddSubmit"
      />

      <el-dialog title="交易单下载" :visible.sync="downloadView" :close-on-click-modal="false">
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>
    </SpRouterView>
  </SpPage>
</template>
<script>
import moment from 'moment'
import { PAY_STATUS } from '@/consts'

export default {
  name: '',
  mixins: [],
  props: {},
  data() {
    return {
      deliveryman: false,
      editTitle: '',
      isLook: false,
      confirmStatus: false,
      params: {
        create_time: [],
        user_mobile: '',
        order_id: '',
        check_status: '',
        pay_account_no: '',
        pay_account_bank: '',
        bank_account_name: '',
        bank_name: ''
      },
      bankList: [],
      downloadView: false,
      downloadUrl: '',
      downloadName: '',
      itemInfo: {},
      payStatusMap: {
        SUCCESS: '支付成功',
        NOTPAY: '未支付',
        CLOSED: '已关闭',
        REVOKED: '已撤销',
        PAYERROR: '支付失败',
        REFUND_PROCESS: '退款处理中',
        REFUND_SUCCESS: '退款成功',
        REFUND_FAIL: '退款失败'
      },
      checkStatusOptions: [
        {
          value: '0',
          label: '待处理'
        },
        {
          value: '1',
          label: '已审核'
        },
        {
          value: '2',
          label: '已拒绝'
        },
        {
          value: '9',
          label: '已取消'
        }
      ],
      goodSetting: {
        columns: [
          { name: 'SKU编码', key: 'item_bn', width: 110 },
          { name: '商品名称', key: 'item_name', width: 110 },
          {
            name: '单价',
            key: 'price',
            width: 110,
            render: (h, { row }) => {
              return <span>¥{(row.price / 100).toFixed(2)}</span>
            }
          },
          { name: '数量', key: 'num', width: 100 },
          {
            name: '小计（¥）',
            width: 110,
            key: 'item_fee',
            render: (h, { row }) => {
              return <span>¥{(row.item_fee / 100).toFixed(2)}</span>
            }
          },
          {
            name: '积分抵扣（¥）',
            width: 110,
            key: 'point_fee',
            render: (h, { row }) => {
              return <span>¥{(row.point_fee / 100).toFixed(2)}</span>
            }
          },
          {
            name: '总支付金额（¥）',
            width: 110,
            key: 'total_fee',
            render: (h, { row }) => {
              return <span>¥{(row.total_fee / 100).toFixed(2)}</span>
            }
          },
          {
            name: '总优惠（¥）',
            width: 110,
            key: 'discount_fee',
            render: (h, { row }) => {
              return <span>¥{(row.discount_fee / 100).toFixed(2)}</span>
            }
          }
        ]
      },
      setting: {
        columns: [
          { name: '收款账户名', key: 'bank_account_name', width: 110 },
          { name: '收款银行名称', key: 'bank_name', width: 110 },
          { name: '收款银行账号', key: 'bank_account_no', width: 110 },
          {
            name: '订单总金额',
            width: 110,
            key: 'total_fee',
            render: (h, { row }) => {
              return <span>¥{(row.total_fee / 100).toFixed(2)}</span>
            }
          },
          { name: '订单编号', key: 'order_id', width: 150 },
          {
            name: '审核意见',
            width: 150,
            key: 'remark'
          },
          {
            name: '审批状态',
            width: 150,
            key: 'check_status',
            render: (h, { row }) => {
              return <span>{this.getCheckStatusLabel(row.check_status)}</span>
            }
          },
          {
            name: '创建时间',
            width: 150,
            key: 'create_time',
            render: (h, { row }) => {
              return <span>{moment(row.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
          },
          {
            name: '审核时间',
            width: 150,
            key: 'update_time',
            render: (h, { row }) => {
              return <span>{moment(row.update_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
          }
        ],
        actions: [
          {
            name: '转账确认',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            visible: row => {
              return row.check_status == '0'
            },
            action: {
              handler: ([row]) => {
                this.editTitle = '转账确认审核'
                this.getItemDetail(row)
                this.deliveryman = true
                this.isLook = false
              }
            }
          },
          {
            name: '详情',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            visible: row => {
              return row.check_status != '0'
            },
            action: {
              handler: ([row]) => {
                this.editTitle = '转账审核详情'
                this.getItemDetail(row)
                this.deliveryman = true
                this.isLook = true
              }
            }
          },
          {
            name: '操作日志',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.$router.push(
                  `/financial/offline-transfer/voucher-review/logs?orderId=${row.order_id}&resource=${this.$route.path}`
                )
              }
            }
          }
        ]
      },

      addForm: {
        id: '',
        order_id: '',
        pay_fee: 0,
        check_status: '1',
        remark: '',
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        china_ums_no: ''
      },
      addFormList: [
        {
          component: () => (
            <div>
              <el-descriptions title="用户信息" column={3}>
                <el-descriptions-item label="订单号">
                  {this.itemInfo?.order_info?.order_id}
                </el-descriptions-item>
                <el-descriptions-item label="下单时间">
                  {this.itemInfo?.create_time &&
                    moment(this.itemInfo?.order_info?.create_time * 1000).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                </el-descriptions-item>
                <el-descriptions-item label="会员手机号">
                  {this.itemInfo?.order_info?.mobile}
                </el-descriptions-item>
                <el-descriptions-item label="运费">
                  ¥
                  {this.itemInfo?.order_info?.freight_fee
                    ? (this.itemInfo?.order_info?.freight_fee / 100).toFixed(2)
                    : '0.00'}
                </el-descriptions-item>
                <el-descriptions-item label="订单金额">
                  {this.itemInfo?.order_info?.order_type != 'bargain'
                    ? this.itemInfo?.order_info?.item_fee
                      ? `¥${(this.itemInfo?.order_info?.item_fee / 100).toFixed(2)}`
                      : '￥0.00'
                    : this.itemInfo?.order_info?.item_price
                    ? `¥${(this.itemInfo?.order_info?.item_price / 100).toFixed(2)}`
                    : '￥0.00'}
                </el-descriptions-item>
                <el-descriptions-item label="会员优惠">
                  ￥
                  {this.itemInfo?.order_info?.member_discount
                    ? (this.itemInfo?.order_info?.member_discount / 100).toFixed(2)
                    : '0.00'}
                </el-descriptions-item>
                <el-descriptions-item label="优惠卷减免">
                  ￥
                  {this.itemInfo?.order_info?.coupon_discount
                    ? (this.itemInfo?.order_info?.coupon_discount / 100).toFixed(2)
                    : '0.00'}
                </el-descriptions-item>
                <el-descriptions-item label="优惠总金额">
                  ￥
                  {this.itemInfo?.order_info?.discount_fee
                    ? (this.itemInfo?.order_info?.discount_fee / 100).toFixed(2)
                    : '0.00'}
                </el-descriptions-item>
                <el-descriptions-item label="积分抵扣金额">
                  ￥
                  {this.itemInfo?.order_info?.point_fee
                    ? (this.itemInfo?.order_info?.point_fee / 100).toFixed(2)
                    : '0.00'}
                </el-descriptions-item>
                <el-descriptions-item label="应付总金额">
                  {this.itemInfo?.order_info?.total_fee
                    ? (this.itemInfo?.order_info?.total_fee / 100).toFixed(2)
                    : '0.00'}
                </el-descriptions-item>
                <el-descriptions-item label="实付总金额">
                  ￥
                  {this.itemInfo?.tradeInfo?.payType === 'point'
                    ? '0.00'
                    : this.itemInfo?.tradeInfo?.tradeState == 'NOTPAY'
                    ? '0.00'
                    : this.itemInfo?.order_info?.total_fee
                    ? (this.itemInfo?.order_info?.total_fee / 100).toFixed(2)
                    : '0.00'}
                </el-descriptions-item>
                <el-descriptions-item label="支付状态">
                  {PAY_STATUS[this.itemInfo?.tradeInfo?.tradeState]}
                </el-descriptions-item>
              </el-descriptions>

              <div class="good-info-title">商品信息</div>

              <SpFinder
                ref="goodfinder"
                class="goodfinder"
                setting={this.goodSetting}
                data={this.itemInfo?.order_info?.items}
                show-pager={false}
                no-selection
              />

              {/* <el-descriptions title='收款账户名' column={2}>
                <el-descriptions-item label='收款账户名'>
                  {this.itemInfo?.bank_account_name}
                </el-descriptions-item>
                <el-descriptions-item label='收款银行名称'>
                  {this.itemInfo?.bank_name}
                </el-descriptions-item>
                <el-descriptions-item label='收款银行账号'>
                  {this.itemInfo?.bank_account_no}
                </el-descriptions-item>
                <el-descriptions-item label='收款银联号'>
                  {this.itemInfo?.china_ums_no}
                </el-descriptions-item>
              </el-descriptions> */}
              <el-descriptions title="付款账户信息" column={2}>
                {/* <el-descriptions-item label='付款银行'>
                  {this.itemInfo?.pay_account_bank}
                </el-descriptions-item>
                <el-descriptions-item label='付款卡号'>
                  {this.itemInfo?.pay_account_no}
                </el-descriptions-item>
                <el-descriptions-item label='付款账户名'>
                  {this.itemInfo?.bank_name}
                </el-descriptions-item> */}
                <el-descriptions-item label="交易流水号">
                  {this.itemInfo?.pay_sn}
                </el-descriptions-item>
                <el-descriptions-item label="转账金额">
                  {(this.itemInfo?.pay_fee / 100).toFixed(2)}
                </el-descriptions-item>
                <el-descriptions-item label="支付备注" span={2}>
                  {this.itemInfo?.transfer_remark}
                </el-descriptions-item>
                <el-descriptions-item label="凭证图片集合" span={2}>
                  {Array.isArray(this.itemInfo?.voucher_pic) &&
                    this.itemInfo?.voucher_pic.length > 0 &&
                    this.itemInfo?.voucher_pic.map(urlitem => (
                      <ElImage
                        src={urlitem}
                        class="voucher-pic"
                        previewSrcList={this.itemInfo.voucher_pic}
                      />
                    ))}
                </el-descriptions-item>
              </el-descriptions>
              <div class="modal-header el-descriptions__title">订单信息</div>
            </div>
          )
        },
        {
          label: '收款账户名',
          key: 'bank_account_id',
          type: 'select',
          required: true,
          message: '收款账户名不能为空',
          options: [
            // { title: '可售', value: 1 },
            // { title: '不可售', value: 0 }
          ],
          onChange: e => {
            const targetItem = this.bankList.find(item => item.id == e)
            this.addForm.bank_account_no = targetItem?.bank_account_no
            this.addForm.bank_name = targetItem?.bank_name
            this.addForm.china_ums_no = targetItem?.china_ums_no
          }
        },
        {
          label: '收款银行名称',

          component: () => <span>{this.addForm.bank_name || '-'}</span>,
          display: 'inline'
        },
        {
          label: '收款银行账号',
          key: 'bank_name',
          component: () => <span>{this.addForm.bank_account_no || '-'}</span>,
          display: 'inline'
        },
        {
          label: '收款银联号',
          key: 'china_ums_no',
          component: () => <span>{this.addForm.china_ums_no || '-'}</span>,
          display: 'inline'
        },

        {
          label: '审核',
          key: 'check_status',
          type: 'radio',
          required: true,
          options: [
            {
              label: '1',
              name: '审核通过'
            },
            {
              label: '2',
              name: '审核拒绝'
            }
          ]
        },
        {
          label: '审核备注',
          key: 'remark',
          type: 'textarea',
          maxlength: 500,
          required: false,
          message: '审核备注不能为空'
        }
      ]
    }
  },
  computed: {},
  watch: {
    'addForm.check_status'(val) {
      if (val == '1') {
        this.addFormList[6].required = false
      } else {
        this.addFormList[6].required = true
      }
    }
  },
  mounted() {
    this.getBankList()
  },
  methods: {
    async getBankList() {
      const { list } = await this.$api.trade.getBankList({
        page: 1,
        pageSize: 999
      })
      const _list = list.map(item => ({
        ...item,
        //搜索银行选项label，bank_name
        label: `${item.bank_name}:${item.bank_account_no}`,
        //弹框下拉选项value，title
        value: item.id,
        title: item.bank_account_name
      }))
      this.bankList = _list
      this.addFormList[1].options = _list
    },
    onSearch() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
      const _params = {
        ...params,
        ...this.getParams()
      }
      return _params
    },
    getParams() {
      const _params = {
        ...this.params,
        ...this.dateTransfer(this.params.create_time)
      }
      delete _params.create_time
      return _params
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateTransfer(val) {
      let begin_date = undefined
      let end_date = undefined
      if (val.length > 0) {
        // begin_date = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        // end_date = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
        begin_date = val[0] + ' 00:00:00'
        end_date = val[1] + ' 23:59:59'
      }
      return {
        begin_date,
        end_date
      }
    },
    async getItemDetail({ id }) {
      const res = await this.$api.trade.getOffLineInfo({ id })
      this.itemInfo = res
      this.addForm = {
        ...this.addForm,
        id,
        order_id: res?.order_info?.order_id,
        pay_fee: res?.pay_fee
      }
      if (this.isLook) {
        this.addForm.check_status = res.check_status + ''
        this.addForm.remark = res.remark
      } else {
        this.addForm.check_status = '1'
        this.addForm.remark = ''
      }
      this.addForm.bank_account_id = res.bank_account_id
      this.addForm.bank_account_no = res.bank_account_no
      this.addForm.bank_name = res.bank_name
      this.addForm.china_ums_no = res.china_ums_no
    },
    getCheckStatusLabel(status) {
      return this.checkStatusOptions.find(item => item.value == status)?.label
    },
    async onAddSubmit() {
      this.confirmStatus = true

      let params = {
        ...this.addForm
      }

      console.log('params', params)

      // return
      try {
        await this.$api.trade.offlineCheck(params)
        this.$message.success('审核成功')
        this.deliveryman = false
        this.confirmStatus = false
        this.onSearch()
      } catch (error) {
        this.confirmStatus = false
      }
    },
    async exportData() {
      const { status, url, filename } = await this.$api.trade.exportOffline({
        ...this.getParams()
      })
      if (status) {
        this.$message({
          type: 'success',
          message: '已加入执行队列，请在设置-导出列表中下载'
        })
        this.$export_open('offline_payment')
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      } else {
        this.$message({
          type: 'error',
          message: '无内容可导出 或 执行失败，请检查重试'
        })
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .flex-box {
//   display: flex;
//   align-items: center;
//   span {
//     margin-left: 10px;
//   }
// }
.modal-header {
  width: 100%;
  background: #f3f3f3;
  padding-left: 16px;
  box-sizing: border-box;
  color: #000;
}
.export-box {
  margin-top: 16px;
}
.good-info-title {
  font-weight: 600;
}
.goodfinder {
  margin-bottom: 16px;
}
.voucher-pic {
  width: 90px;
  height: 90px;
  margin-right: 16px;
}
</style>
<style>
.el-descriptions__header {
  width: 100%;
  background: #f3f3f3;
  padding-left: 16px;
  box-sizing: border-box;
}
</style>
