<template>
  <div>
    <SpRouterView>
      <SpFilterForm :model="params" size="small" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="create_time" label="日期范围:">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" label="单号:">
          <el-input v-model="params.mobile" placeholder="手机号/交易单号" />
        </SpFilterFormItem>
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
      </SpFilterForm>

      <el-button type="primary" plain>导出</el-button>

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
        :isShowFooter="!isLook"
        :confirmStatus="confirmStatus"
        :title="editTitle"
        :form="addForm"
        :form-list="addFormList"
        @onSubmit="onAddSubmit"
      />

      <!-- <DistributorSelect
        :store-visible="DistributorVisible"
        :is-valid="isValid"
        :get-status="DistributorStatus"
        :rel-data-ids="relDistributors"
        :old-data="oldData"
        :is-single="isSingle"
        :distribution_type="distributionType"
        @chooseStore="DistributorChooseAction"
        @closeStoreDialog="closeDialogAction"
      /> -->
    </SpRouterView>
  </div>
</template>
<script>
import DistributorSelect from '@/components/function/distributorSelect'
import { IS_DISTRIBUTOR, IS_MERCHANT } from '@/utils'
import moment from 'moment'

export default {
  name: '',
  components: {
    DistributorSelect
  },
  mixins: [],
  props: {},
  data() {
    return {
      deliveryman: false,
      DistributorVisible: false,
      DistributorStatus: false,
      distributionType: '0',
      isSingle: false,
      isValid: true,
      oldData: [],
      relDistributors: [],
      operator_id: '',
      editTitle: '',
      isLook:false,
      confirmStatus:false,
      params: {
        create_time: [],
        mobile: '',
        order_id: '',
        check_status:''
      },
      itemInfo:{},
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
        },
      ],
      setting: {
        columns: [
          { name: '收款账户名', key: 'bank_account_name', width: 110 },
          { name: '收款银行名称', key: 'bank_name', width: 110 },
          { name: '收款银行账号', key: 'bank_account_no', width: 110 },
          {
            name: '订单支付金额',
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
            visible: (row) => {
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
            visible: (row) => {
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
                this.$router.push('/financial/examine/transfer/logs')
              }
            }
          }
        ]
      },

      addForm: {
        id:'',
        order_id:'',
        pay_fee:0,
        check_status: '1',
        remark: '',
      },
      addFormList: [
        {
          component: () => (
            <div>
              <el-descriptions title='用户信息'>
                <el-descriptions-item label='订单号'>{this.itemInfo?.order_info?.order_id}</el-descriptions-item>
                <el-descriptions-item label='订单金额'>{(this.itemInfo?.order_info?.total_fee / 100).toFixed(2)}</el-descriptions-item>
                <el-descriptions-item label='订单状态'>{this.itemInfo?.order_info?.order_status_msg}</el-descriptions-item>
                <el-descriptions-item label='运费'>{(this.itemInfo?.order_info?.freight_fee /100).toFixed(2)}</el-descriptions-item>
                <el-descriptions-item label='订单备注'>{this.itemInfo?.order_info?.remark}</el-descriptions-item>
                <el-descriptions-item label='收货人'>{this.itemInfo?.order_info?.receiver_name}</el-descriptions-item>
                <el-descriptions-item label='收货地址'>{this.itemInfo?.order_info?.receiver_state}{this.itemInfo?.order_info?.receiver_city}{this.itemInfo?.order_info?.receiver_district}{this.itemInfo?.order_info?.receiver_address}</el-descriptions-item>

              </el-descriptions>
              <el-descriptions title='收款账户信息' column={2}>
                <el-descriptions-item label='收款账户名'>{this.itemInfo?.bank_account_name}</el-descriptions-item>
                <el-descriptions-item label='收款银行名称'>{this.itemInfo?.bank_name}</el-descriptions-item>
                <el-descriptions-item label='收款银行账号'>{this.itemInfo?.bank_account_no}</el-descriptions-item>
                <el-descriptions-item label='收款银联号'>{this.itemInfo?.china_ums_no}</el-descriptions-item>
              </el-descriptions>
              <el-descriptions title='付款账户信息' column={2}>
                <el-descriptions-item label='付款银行'>{this.itemInfo?.pay_account_bank}</el-descriptions-item>
                <el-descriptions-item label='付款卡号'>{this.itemInfo?.pay_account_no}</el-descriptions-item>
                <el-descriptions-item label='付款账户名'>{this.itemInfo?.bank_name}</el-descriptions-item>
                <el-descriptions-item label='订单支付金额'>{(this.itemInfo?.pay_fee / 100).toFixed(2)}</el-descriptions-item>
                <el-descriptions-item label='凭证图片集合' span={3}>
                  {/* {
                    Array.isArray(this.itemInfo?.voucher_pic) && this.itemInfo?.voucher_pic.length > 0 && (
                      this.itemInfo?.voucher_pic.map(urlitem=>(
                        <SpImage
                          src={urlitem}
                          width="48"
                          height="48"
                        />
                      ))
                    )
                  } */}
                  <SpImage
                    src={this.itemInfo?.voucher_pic}
                    width="60"
                    height="60"
                  />
                </el-descriptions-item>
                <el-descriptions-item label='支付备注'>{this.itemInfo?.transfer_remark}</el-descriptions-item>
              </el-descriptions>
              <div class='modal-header el-descriptions__title'>订单信息</div>
            </div>
          )
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

        }
      ]
    }
  },
  computed: {},
  watch: {
    'addForm.check_status'(val){
      if (val == '1') {
        this.addFormList[2].required = false
      } else {
        this.addFormList[2].required = true
      }
    }
  },
  mounted() {},
  methods: {
    onSearch() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
      const _params = {
        ...params,
        ...this.params,
        // ...this.dateTransfer(this.params.create_time),
        begin_date:this.params.create_time[0],
        end_date:this.params.create_time[1]
      }
      return _params
    },
    onAddCancel() {
      this.deliveryman = false
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
    async getItemDetail({id}){
      const res = await this.$api.trade.getOffLineInfo({id})
      this.itemInfo = res
      this.addForm = {
        ...this.addForm,
        id,
        order_id:res?.order_info?.order_id,
        pay_fee:res?.pay_fee
      }
      if(this.isLook){
        this.addForm.check_status = res.check_status+''
        this.addForm.remark = res.remark
      }else{
        this.addForm.check_status = '1'
        this.addForm.remark = ''
      }
    },
    getCheckStatusLabel(status){
      return this.checkStatusOptions.find(item=>item.value == status)?.label
    },
    async onAddSubmit() {


      this.confirmStatus = true

      let params = {
        ...this.addForm
      }

      console.log('params',params)

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
    async addDistributoreAction() {
      const { data } = await this.$picker.shop()
      let arrObj = [...this.relDistributors, ...data]

      for (let i = 0; i < arrObj.length; i++) {
        for (let j = i + 1; j < arrObj.length; j++) {
          if (arrObj[i].distributor_id == arrObj[j].distributor_id) {
            arrObj.splice(j, 1)
            j--
          }
        }
      }
      console.log(arrObj, 'tttt')

      this.relDistributors = arrObj
      this.DistributorStatus = true
      this.DistributorVisible = true
    },
    // DistributorChooseAction(data) {
    //   console.log(data)
    //   this.DistributorVisible = false
    //   if (data === null || data.length <= 0) return
    //   this.relDistributors = data
    //   this.oldData = data
    // },
    // closeDialogAction() {
    //   this.DistributorVisible = false
    //   this.relDistributors = this.oldData
    //   this.DistributorStatus = false
    // },
    DistributoreHandleClose(index) {
      this.DistributorVisible = false
      this.relDistributors.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
}
.modal-header {
  width: 100%;
  background: #f3f3f3;
  padding-left: 16px;
  box-sizing: border-box;
  color: #000;
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
