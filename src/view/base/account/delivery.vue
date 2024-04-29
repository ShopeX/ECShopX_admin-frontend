<template>
  <div>
    <el-button type="primary" @click="addDeliveryman">添加配送员</el-button>

    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="username" label="配送员姓名:">
        <el-input v-model="params.username" placeholder="请输入配送员姓名" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="配送员手机号:">
        <el-input v-model="params.mobile" placeholder="请输入配送员手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="payment_method" label="配送结算方式:">
        <el-select v-model="params.payment_method" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <SpFinder
      ref="finder"
      url="/roles/management"
      :fixed-row-action="false"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />

    <SpDialog
      ref="addDialogRef"
      v-model="deliveryman"
      :title="editTitle"
      :form="addForm"
      :form-list="addFormList"
      @onSubmit="onAddSubmit"
    />

    <DistributorSelect
      :store-visible="DistributorVisible"
      :is-valid="isValid"
      :get-status="DistributorStatus"
      :rel-data-ids="relDistributors"
      :old-data="oldData"
      :is-single="isSingle"
      :distribution_type="distributionType"
      @chooseStore="DistributorChooseAction"
      @closeStoreDialog="closeDialogAction"
    />
  </div>
</template>
<script>
import DistributorSelect from '@/components/function/distributorSelect'

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
      operator_id:'',
      editTitle:'添加配送员',
      params: {
        operator_type: 'self_delivery_staff',
        username: '',
        mobile: '',
        payment_method: ''
      },
      options: [
        {
          value: 'order',
          label: '按单笔订单'
        },
        {
          value: 'amount',
          label: '按订单金额比例'
        }
      ],
      setting: {
        columns: [
          { name: '业务员姓名', key: 'username' },
          { name: '配送员编号', key: 'staff_no' },
          { name: '配送员手机号', key: 'mobile' },
          { name: '配送员属性', key: 'staff_attribute' },
          { name: '配送结算方式', key: 'payment_method' },
          { name: '结算费用（¥/单）', key: 'payment_fee' },
          {
            name: '所属店铺',
            key: 'permission_tree',
            render: (h, { row }) => {
              //permission_tree    distributor_ids
              row.permission_tree.map((item) => {
                return (
                  <el-tag key='item.distributor_id' size='mini'>
                    {item.name}
                  </el-tag>
                )
              })
            }
          },
          {
            name: '禁用',
            key: 'is_disable',
            render: (h, { row }) => {
              return (
                <el-switch v-model={row.is_disable} active-color='#ff4949' inactive-color='#ccc' />
              )
            }
          }
        ],
        actions: [
          {
            name: '编辑',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.editTitle = '编辑配送员'
                this.addForm= {
                operator_type: row.operator_type,
                distributor_name: row.distributor_name,
                staff_type: row.staff_type,
                staff_no: row.staff_no,
                staff_attribute: row.staff_attribute,
                payment_method: row.payment_method,
                payment_fee: row.payment_fee,
                mobile: row.mobile,
                password: row.password,
                distributor_ids:[]
      },
                console.log(row, 'src/view/base/account/delivery.vue-第78行')
              }
            }
          },
          {
            name: '删除',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认删除？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                await this.$api.pickuplocation.deleteZitiLocation(row.id)
                this.$refs['finder'].refresh()
              }
            }
          }
        ]
      },

      addForm: {
        operator_type: 'self_delivery_staff',
        distributor_name: '',
        staff_type: 'platform',
        staff_no: '',
        staff_attribute: 'part_time',
        payment_method: 'order',
        payment_fee: 0.01,
        mobile: '',
        password: '',
        distributor_ids:[]
      },
      addFormList: [
        {
          label: '配送员类型',
          key: 'staff_type',
          type: 'radio',
          options: [
            {
              label: 'platform',
              name: '平台配送员'
            },
            {
              label: 'shop',
              name: '商家配送员'
            },
            {
              label: 'distributor',
              name: '店铺配送员'
            }
          ]
        },
        {
          label: '配送员编码',
          key: 'staff_no',
          placeholder: '请输入配送员编码',
          type: 'input'
        },
        {
          label: '配送员属性',
          key: 'staff_attribute',
          type: 'radio',
          options: [
            {
              label: 'part_time',
              name: '兼职'
            },
            {
              label: 'full_time',
              name: '全职'
            }
          ]
        },
        {
          label: '配送结算方式',
          key: 'payment_method',
          type: 'radio',
          options: [
            {
              label: 'order',
              name: '按单笔订单'
            },
            {
              label: 'amount',
              name: '按订单金额比例'
            }
          ]
        },
        {
          label: '结算费用',
          key: 'payment_fee',
          type: 'number',
          precision: 2,
          setp: 0.1,
          tip:'元，每单',
          validator: (rule, value, callback) => {
            const { payment_fee } = this.addForm
            if (!payment_fee) {
              callback(new Error('不能为空'))
            } else {
                let res = /^(0|[1-9]\d*)(.\d{1,2})?$/.test(payment_fee)
                if (!res) {
                  callback(new Error('结算费用格式错误'))
                } else {
                    callback()
                }
            }
          },
        },
        {
          label: '配送员手机号',
          key: 'mobile',
          type: 'input',
          placeholder: '请输入配送员手机号',
          validator: (rule, value, callback) => {
            const { mobile } = this.addForm
            if (!mobile) {
              callback(new Error('不能为空'))
            } else {
                let res = /^1[3-9]\d{9}$/.test(mobile)
                if (!res) {
                  callback(new Error('手机号格式错误'))
                } else {
                    callback()
                }
            }
          },
        },
        {
          label: '配送员姓名',
          key: 'username',
          placeholder: '请输入配送员姓名',
          type: 'input'
        },
        {
          label: '登录密码',
          key: 'password',
          type: 'input',
          validator: (rule, value, callback) => {
            const { password } = this.addForm
            if (!password) {
              callback(new Error('不能为空'))
            } else {
                let res = /^(?=.*[a-zA-Z0-9!@#$%^&*()-_+=])[a-zA-Z0-9!@#$%^&*()-_+=]{6,20}$/.test(password)
                if (!res) {
                  callback(new Error('密码不能是文字并且至少6位'))
                } else {
                    callback()
                }
            }
          },
        },
        {
          label: '所属店铺',
          key: 'distributor_name',
          component: ({ key }, value) => {
            return (
              <div>
                {this.relDistributors.map((item, index) => {
                  return (
                    <el-tag
                      key={item.distributor_id}
                      class='new-tag'
                      closable
                      disable-transitions={false}
                      onClose={this.DistributoreHandleClose.bind(this, index)}
                    >
                      {item.name}
                    </el-tag>
                  )
                })}
                <el-button
                  size='medium'
                  class='button-new-tag'
                  onClick={this.addDistributoreAction.bind(this)}
                >
                  + 点击搜索店铺
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    onSearch() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
      console.log(params, 'src/view/base/account/delivery.vue-第115行')
      const _params = {
        ...params,
        ...this.params
      }
      return _params
    },
    addDeliveryman() {
      this.deliveryman = true
      this.editTitle = '添加配送员'
      this.addForm = {
        operator_type: 'self_delivery_staff',
        distributor_name: '',
        staff_type: 'platform',
        staff_no: '',
        staff_attribute: 'part_time',
        payment_method: 'order',
        payment_fee: 0.01,
        mobile: '',
        password: '',
        distributor_ids:[]
      },
      this.relDistributors = []
    },
    onAddCancel() {
      this.deliveryman = false
    },

    async onAddSubmit() {
        if (this.relDistributors.length > 0) {
        this.relDistributors.forEach((distributor) => {
          this.addForm.distributor_ids.push({
            name: distributor.name,
            distributor_id: distributor.distributor_id
          })
        })
      } else {
        this.$message({ type: 'error', message: '必须关联店铺' })
        return false
      }
      if (this.operator_id) {
        await this.$api.company.updateAccountInfo(this.operator_id, this.addForm)
          this.$message.success('保存成功')
          this.deliveryman = false
          this.onSearch()
      } else {
        await this.$api.company.createAccount(this.addForm)
          this.$message.success('保存成功')
          this.deliveryman = false
          this.onSearch()
      }
      console.log(this.addForm, 'src/view/base/account/delivery.vue-第234行')
    },
    addDistributoreAction() {
      this.DistributorStatus = true
      this.DistributorVisible = true
    },
    DistributorChooseAction(data) {
      console.log(data)
      this.DistributorVisible = false
      if (data === null || data.length <= 0) return
      this.relDistributors = data
      this.oldData = data
    },
    closeDialogAction() {
      this.DistributorVisible = false
      this.relDistributors = this.oldData
      this.DistributorStatus = false
    },
    DistributoreHandleClose(index) {
      this.DistributorVisible = false
      this.relDistributors.splice(index, 1)
    }
  }
}
</script>
<style lang="" scoped></style>
