<template>
  <SpPage>
    <SpFilterForm :model="params" size="small" @onSearch="onSearch" @onReset="onSearch">
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

    <div class="action-container">
      <el-button type="primary" @click="addDeliveryman">添加配送员</el-button>
    </div>

    <SpFinder
      ref="finder"
      url="/account/management"
      no-selection
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
  </SpPage>
</template>
<script>
import DistributorSelect from '@/components/function/distributorSelect'
import { IS_DISTRIBUTOR, IS_MERCHANT } from '@/utils'

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
      editTitle: '添加配送员',
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
          { name: '业务员姓名', key: 'username', width: 110 },
          { name: '配送员编号', key: 'staff_no', width: 110 },
          { name: '配送员手机号', key: 'mobile', width: 150 },
          {
            name: '配送员属性',
            width: 110,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return <span>{row.staff_attribute === 'full_time' ? '全职' : '兼职'}</span>
            }
          },
          {
            name: '配送结算方式',
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return <span>{row.payment_method === 'order' ? '按单笔订单' : '按订单金额比例'}</span>
            }
          },
          {
            name: '结算费用',
            key: 'payment_fee',
            width: 150,
            render: (h, { row }) => {
              return (
                <span>
                  {' '}
                  {row.payment_fee / 100} （{row.payment_method == 'order' ? '元' : '%'}/单）{' '}
                </span>
              )
            }
          },
          {
            name: '所属店铺',
            key: 'distributor_ids',
            width: 300,
            render: (h, { row }) => {
              return (
                <div>
                  {row?.distributor_ids?.map(item => {
                    return (
                      <el-tag key={item.distributor_ids} size="mini">
                        {item.name}
                      </el-tag>
                    )
                  })}
                </div>
              )
            }
          },
          {
            name: '禁用',
            key: 'is_disable',
            render: (h, { row }) => {
              return (
                <el-switch
                  onChange={this.acitonDisabled.bind(this, row)}
                  v-model={row.is_disable}
                  active-color="#ff4949"
                  inactive-color="#ccc"
                />
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
                this.operator_id = row.operator_id
                this.relDistributors = []
                this.editTitle = '编辑配送员'
                this.deliveryman = true
                this.addForm = {
                  username: row.username,
                  operator_type: row.operator_type,
                  distributor_name: row.distributor_name,
                  staff_type: row.staff_type,
                  staff_no: row.staff_no,
                  staff_attribute: row.staff_attribute,
                  payment_method: row.payment_method,
                  payment_fee: row.payment_method == 'order' ? Number(row.payment_fee) / 100 : 0.01,
                  payment_fee1: row.payment_method == 'order' ? 1 : Number(row.payment_fee) / 100,
                  mobile: row.mobile,
                  distributor_ids: [],
                  password: ''
                }
                this.relDistributors = row.staff_type == 'distributor' ? row.distributor_ids : []
              }
            }
          }
          // {
          //   name: '删除',
          //   key: 'apply',
          //   type: 'button',
          //   buttonType: 'text',
          //   action: {
          //     handler: async ([row]) => {
          //       await this.$confirm(`确认删除？`, '提示', {
          //         confirmButtonText: '确定',
          //         cancelButtonText: '取消'
          //       })
          //       await this.$api.pickuplocation.deleteZitiLocation(row.operator_id)
          //       this.$refs['finder'].refresh()
          //     }
          //   }
          // }
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
        payment_fee1: 1,
        mobile: '',
        password: '',
        distributor_ids: []
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
          // type: 'number',
          // precision: 2,
          // setp: 0.1,
          // tip: '元，每单',
          isShow: () => {
            return this.addForm.payment_method == 'order'
          },
          component: ({ key }, value) => {
            return (
              <div class="flex-box">
                <el-input-number
                  v-model={value[key]}
                  controls-position="right"
                  precision="3"
                  step="0.001"
                />{' '}
                <span>元，每单（费用包含运费）</span>
              </div>
            )
          },
          validator: (rule, value, callback) => {
            const { payment_fee } = this.addForm
            if (!payment_fee) {
              callback(new Error('不能为空'))
            } else {
              let res = /^(0|[1-9]\d*)(.\d{1,3})?$/.test(payment_fee)
              if (!res) {
                callback(new Error('结算费用格式错误'))
              } else {
                callback()
              }
            }
          }
        },
        {
          label: '结算费用',
          key: 'payment_fee1',
          // type: 'number',
          // tip: '%,每单',
          isShow: () => {
            return this.addForm.payment_method == 'amount'
          },
          component: ({ key }, value) => {
            return (
              <div class="flex-box">
                <el-input-number
                  v-model={value[key]}
                  controls-position="right"
                  precision="3"
                  step="0.001"
                />{' '}
                <span>%，每单（费用包含运费）</span>
              </div>
            )
          },
          validator: (rule, value, callback) => {
            const { payment_fee1 } = this.addForm
            if (!payment_fee1) {
              callback(new Error('不能为空'))
            } else {
              let res = /^(0|[1-9]\d*)(.\d{1,3})?$/.test(payment_fee1)
              if (!res) {
                callback(new Error('结算费用格式错误'))
              } else {
                callback()
              }
            }
          }
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
          }
        },
        {
          label: '配送员姓名',
          key: 'username',
          placeholder: '请输入配送员姓名',
          type: 'input',
          required: true,
          message: '配送员姓名不能为空'
        },
        {
          label: '登录密码',
          key: 'password',
          type: 'input'
          // validator: (rule, value, callback) => {
          //   const { password } = this.addForm
          //   if (!password) {
          //     callback(new Error('不能为空'))
          //   } else {
          //     let res = /^(?=.*[a-zA-Z0-9!@#$%^&*()-_+=])[a-zA-Z0-9!@#$%^&*()-_+=]{6,20}$/.test(
          //       password
          //     )
          //     if (!res) {
          //       callback(new Error('密码不能是文字并且至少6位'))
          //     } else {
          //       callback()
          //     }
          //   }
          // }
        },
        {
          label: '所属店铺',
          key: 'distributor_name',
          isShow: () => {
            return this.addForm.staff_type == 'distributor'
          },
          component: ({ key }, value) => {
            return (
              <div>
                {this.relDistributors.map((item, index) => {
                  return (
                    <el-tag
                      key={item.distributor_id}
                      class="new-tag"
                      closable
                      disable-transitions={false}
                      onClose={this.DistributoreHandleClose.bind(this, index)}
                    >
                      {item.name}
                    </el-tag>
                  )
                })}
                <el-button
                  size="medium"
                  class="button-new-tag"
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
  mounted() {
    if (IS_DISTRIBUTOR() || IS_MERCHANT()) {
      this.addForm.staff_type = 'distributor'
      this.addFormList[0].options = [
        {
          label: 'distributor',
          name: '店铺配送员'
        }
      ]
    }
  },
  methods: {
    onSearch() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
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
        staff_type: IS_DISTRIBUTOR() || IS_MERCHANT() ? 'distributor' : 'platform',
        staff_no: '',
        staff_attribute: 'part_time',
        payment_method: 'order',
        payment_fee: 0.001,
        payment_fee1: 0.001,
        mobile: '',
        password: '',
        distributor_ids: []
      }
      this.operator_id = ''
      this.relDistributors = []
    },
    onAddCancel() {
      this.deliveryman = false
    },

    async onAddSubmit() {
      let res = /^(?=.*[a-zA-Z0-9!@#$%^&*()-_+=])[a-zA-Z0-9!@#$%^&*()-_+=]{6,20}$/.test(
        this.addForm.password
      )
      if (this.operator_id) {
        if (this.addForm.password) {
          if (!res) {
            this.$message({ type: 'error', message: '密码不能是文字并且至少6位' })
            return
          }
        }
      } else {
        if (this.addForm.password) {
          if (!res) {
            this.$message({ type: 'error', message: '密码不能是文字并且至少6位' })
            return
          }
        } else {
          this.$message({ type: 'error', message: '请输入密码' })
          return
        }
      }

      if (this.addForm.staff_type == 'distributor' && this.relDistributors.length == 0) {
        this.$message({ type: 'error', message: '店铺配送员必须关联店铺' })
        return false
      }

      if (this.relDistributors.length > 0) {
        this.addForm.distributor_ids = []
        this.relDistributors.forEach(distributor => {
          this.addForm.distributor_ids.push({
            name: distributor.name,
            distributor_id: distributor.distributor_id
          })
        })
      }

      if (this.addForm.staff_type == 'platform') {
        //平台的后端自己给数据
        this.addForm.distributor_ids = []
      }

      let params = {
        ...this.addForm,
        payment_fee:
          this.addForm.payment_method == 'order'
            ? this.addForm.payment_fee
            : this.addForm.payment_fee1
      }

      if (this.operator_id) {
        await this.$api.company.updateAccountInfo(this.operator_id, params)
        this.$message.success('编辑成功')
        this.deliveryman = false
        this.onSearch()
      } else {
        await this.$api.company.createAccount(this.addForm)
        this.$message.success('保存成功')
        this.deliveryman = false
        this.onSearch()
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
    },
    async acitonDisabled(row) {
      if (row.is_disable) {
        await this.$confirm('此操作将开启禁用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            // 点击确定的逻辑代码
            let params = {
              operator_id: row.operator_id,
              is_disable: row.is_disable ? 1 : 0
            }
            await this.$api.login.changeOperatorStatus(params)
            this.onSearch()
            this.$message({
              type: 'success',
              message: '开启成功!'
            })
          })
          .catch(() => {
            // 点击取消或关闭（规定要加上这个）
            row.is_disable = !row.is_disable
          })
      } else {
        let params = {
          operator_id: row.operator_id,
          is_disable: row.is_disable ? 1 : 0
        }
        await this.$api.login.changeOperatorStatus(params)
        this.onSearch()
        this.$message({
          type: 'success',
          message: '关闭成功!'
        })
      }
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
</style>
<style lang="scss">
.form-item__label {
  width: 100px;
  font-size: 14px;
  color: #333;
}
</style>
