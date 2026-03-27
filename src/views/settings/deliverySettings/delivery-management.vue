<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      v-model="params"
      form-type="searchForm"
      :form-items="formItems"
      @submit="onSearch"
      @reset="onSearch"
      :inline="true"
    />

    <div class="action-container mt-5">
      <el-button type="primary" @click="addDeliveryman">{{ $t('dcd2f270.193fed') }}</el-button>
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
      :title="editTitleI18n"
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
      editMode: 'add', // 'add' | 'edit', use editTitleI18n for display
      params: {
        operator_type: 'self_delivery_staff',
        username: '',
        mobile: '',
        payment_method: ''
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
      }
    }
  },
  computed: {
    editTitleI18n() {
      return this.editMode === 'add' ? this.$t('dcd2f270.193fed') : this.$t('dcd2f270.eee2bb')
    },
    formItems() {
      return [
        {
          fieldName: 'username',
          label: this.$t('dcd2f270.9b3489'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('dcd2f270.c6c579'),
            size: 'default'
          }
        },
        {
          fieldName: 'payment_method',
          label: this.$t('dcd2f270.737477'),
          component: 'select',
          componentProps: {
            placeholder: this.$t('dcd2f270.708c9d'),
            size: 'small',
            options: [
              { value: 'order', label: this.$t('dcd2f270.ed776f') },
              { value: 'amount', label: this.$t('dcd2f270.705abf') }
            ]
          }
        },
        {
          fieldName: 'mobile',
          label: this.$t('dcd2f270.ec9c94'),
          component: 'input',
          cellWidth: 2,
          componentProps: {
            placeholder: this.$t('dcd2f270.f0a58a'),
            size: 'default'
          }
        }
      ]
    },
    setting() {
      return {
        columns: [
          { name: this.$t('dcd2f270.511948'), key: 'username', width: 110 },
          { name: this.$t('dcd2f270.fb92e9'), key: 'staff_no', width: 110 },
          { name: this.$t('dcd2f270.ec9c94'), key: 'mobile', width: 150 },
          {
            name: this.$t('dcd2f270.95a141'),
            width: 110,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return (
                <span>
                  {row.staff_attribute === 'full_time'
                    ? this.$t('dcd2f270.63f85b')
                    : this.$t('dcd2f270.7c4f46')}
                </span>
              )
            }
          },
          {
            name: this.$t('dcd2f270.737477'),
            width: 150,
            key: 'payment_method',
            render: (h, { row }) => {
              return (
                <span>
                  {row.payment_method === 'order'
                    ? this.$t('dcd2f270.ed776f')
                    : this.$t('dcd2f270.705abf')}
                </span>
              )
            }
          },
          {
            name: this.$t('dcd2f270.60a4ae'),
            key: 'payment_fee',
            width: 150,
            render: (h, { row }) => {
              return (
                <span>
                  {' '}
                  {row.payment_fee / 100} （
                  {row.payment_method == 'order' ? this.$t('dcd2f270.c16655') : '%'}/
                  {this.$t('dcd2f270.83958d')}）{' '}
                </span>
              )
            }
          },
          {
            name: this.$t('dcd2f270.baad7e'),
            key: 'distributor_ids',
            width: 300,
            render: (h, { row }) => {
              return (
                <div>
                  {row?.distributor_ids?.map((item) => {
                    return (
                      <el-tag key={item.distributor_ids} size='mini'>
                        {item.name}
                      </el-tag>
                    )
                  })}
                </div>
              )
            }
          },
          {
            name: this.$t('dcd2f270.710ad0'),
            key: 'is_disable',
            render: (h, { row }) => {
              return (
                <el-switch
                  onChange={this.acitonDisabled.bind(this, row)}
                  v-model={row.is_disable}
                  active-color='#ff4949'
                  inactive-color='#ccc'
                />
              )
            }
          }
        ],
        actions: [
          {
            name: this.$t('dcd2f270.95b351'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.operator_id = row.operator_id
                this.relDistributors = []
                this.editMode = 'edit'
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
        ]
      }
    },
    addFormList() {
      const staffTypeOptions =
        IS_DISTRIBUTOR() || IS_MERCHANT()
          ? [{ label: 'distributor', name: this.$t('dcd2f270.f2440f') }]
          : [
              { label: 'platform', name: this.$t('dcd2f270.8e24f3') },
              { label: 'distributor', name: this.$t('dcd2f270.f2440f') }
            ]
      return [
        {
          label: this.$t('dcd2f270.04dbf8'),
          key: 'staff_type',
          type: 'radio',
          options: staffTypeOptions
        },
        {
          label: this.$t('dcd2f270.530880'),
          key: 'staff_no',
          placeholder: this.$t('dcd2f270.0f86ab'),
          type: 'input'
        },
        {
          label: this.$t('dcd2f270.95a141'),
          key: 'staff_attribute',
          type: 'radio',
          options: [
            { label: 'part_time', name: this.$t('dcd2f270.7c4f46') },
            { label: 'full_time', name: this.$t('dcd2f270.63f85b') }
          ]
        },
        {
          label: this.$t('dcd2f270.737477'),
          key: 'payment_method',
          type: 'radio',
          options: [
            { label: 'order', name: this.$t('dcd2f270.ed776f') },
            { label: 'amount', name: this.$t('dcd2f270.705abf') }
          ]
        },
        {
          label: this.$t('dcd2f270.60a4ae'),
          key: 'payment_fee',
          isShow: () => this.addForm.payment_method == 'order',
          component: ({ key }, value) => (
            <div class='flex-box'>
              <el-input-number
                v-model={value[key]}
                controls-position='right'
                precision='3'
                step='0.001'
              />{' '}
              <span>{this.$t('dcd2f270.aa0269')}</span>
            </div>
          ),
          validator: (rule, value, callback) => {
            const { payment_fee } = this.addForm
            if (!payment_fee) {
              callback(new Error(this.$t('dcd2f270.281bad')))
            } else {
              const res = /^(0|[1-9]\d*)(.\d{1,3})?$/.test(payment_fee)
              if (!res) {
                callback(new Error(this.$t('dcd2f270.c2b50f')))
              } else {
                callback()
              }
            }
          }
        },
        {
          label: this.$t('dcd2f270.60a4ae'),
          key: 'payment_fee1',
          isShow: () => this.addForm.payment_method == 'amount',
          component: ({ key }, value) => (
            <div class='flex-box'>
              <el-input-number
                v-model={value[key]}
                controls-position='right'
                precision='3'
                step='0.001'
              />{' '}
              <span>{this.$t('dcd2f270.fe3878')}</span>
            </div>
          ),
          validator: (rule, value, callback) => {
            const { payment_fee1 } = this.addForm
            if (!payment_fee1) {
              callback(new Error(this.$t('dcd2f270.281bad')))
            } else {
              const res = /^(0|[1-9]\d*)(.\d{1,3})?$/.test(payment_fee1)
              if (!res) {
                callback(new Error(this.$t('dcd2f270.c2b50f')))
              } else {
                callback()
              }
            }
          }
        },
        {
          label: this.$t('dcd2f270.ec9c94'),
          key: 'mobile',
          type: 'input',
          placeholder: this.$t('dcd2f270.f0a58a'),
          validator: (rule, value, callback) => {
            const { mobile } = this.addForm
            if (!mobile) {
              callback(new Error(this.$t('dcd2f270.281bad')))
            } else {
              const res = /^1[3-9]\d{9}$/.test(mobile)
              if (!res) {
                callback(new Error(this.$t('dcd2f270.dc6732')))
              } else {
                callback()
              }
            }
          }
        },
        {
          label: this.$t('dcd2f270.9b3489'),
          key: 'username',
          placeholder: this.$t('dcd2f270.c6c579'),
          type: 'input',
          required: true,
          message: this.$t('dcd2f270.dd5bc5')
        },
        {
          label: this.$t('dcd2f270.2646b8'),
          key: 'password',
          type: 'input'
        },
        {
          label: this.$t('dcd2f270.baad7e'),
          key: 'distributor_name',
          isShow: () => this.addForm.staff_type == 'distributor',
          component: ({ key }, value) => (
            <div>
              {this.relDistributors.map((item, index) => (
                <el-tag
                  key={item.distributor_id}
                  class='new-tag'
                  closable
                  disable-transitions={false}
                  onClose={this.DistributoreHandleClose.bind(this, index)}
                >
                  {item.name}
                </el-tag>
              ))}
              <el-button
                size='medium'
                class='button-new-tag'
                onClick={this.addDistributoreAction.bind(this)}
              >
                {this.$t('dcd2f270.a5d26b')}
              </el-button>
            </div>
          )
        }
      ]
    }
  },
  mounted() {
    if (IS_DISTRIBUTOR() || IS_MERCHANT()) {
      this.addForm.staff_type = 'distributor'
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
      this.editMode = 'add'
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
            this.$message({ type: 'error', message: this.$t('dcd2f270.5bcd4a') })
            return
          }
        }
      } else {
        if (this.addForm.password) {
          if (!res) {
            this.$message({ type: 'error', message: this.$t('dcd2f270.5bcd4a') })
            return
          }
        } else {
          this.$message({ type: 'error', message: this.$t('dcd2f270.e39ffe') })
          return
        }
      }

      if (this.addForm.staff_type == 'distributor' && this.relDistributors.length == 0) {
        this.$message({ type: 'error', message: this.$t('dcd2f270.991f3d') })
        return false
      }

      if (this.relDistributors.length > 0) {
        this.addForm.distributor_ids = []
        this.relDistributors.forEach((distributor) => {
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
        this.$message.success(this.$t('dcd2f270.3bb47b'))
        this.deliveryman = false
        this.onSearch()
      } else {
        await this.$api.company.createAccount(this.addForm)
        this.$message.success(this.$t('dcd2f270.3b1083'))
        this.deliveryman = false
        this.onSearch()
      }
    },
    async addDistributoreAction() {
      const { data } = await this.$picker.shop({
        queryParams: {
          is_valid: true
        }
      })
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
        await this.$confirm(this.$t('dcd2f270.f0ebaa'), this.$t('dcd2f270.02d981'), {
          confirmButtonText: this.$t('dcd2f270.38cf16'),
          cancelButtonText: this.$t('dcd2f270.625fb2'),
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
              message: this.$t('dcd2f270.8e0047')
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
          message: this.$t('dcd2f270.4d5ac8')
        })
      }
    }
  }
}
</script>
