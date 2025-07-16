<style lang="scss" scoped>
.sp-form {
  margin-top: 24px;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<template>
  <SpPage>
    <el-tabs type="card">
      <el-tab-pane label="结算周期配置">
        <SpForm v-model="form" :form-list="formList" @onSubmit="onSaveConfig" />
      </el-tab-pane>
      <el-tab-pane label="店铺结算周期">
        <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
          <SpFilterFormItem prop="distributor_id" label="店铺:">
            <SpSelectShop v-model="formQuery.distributor_id" clearable placeholder="请选择" />
          </SpFilterFormItem>
          <!-- <SpFilterFormItem prop="mobile" label="联系手机:">
            <el-input v-model="formQuery.mobile" placeholder="请输入联系人手机号" />
          </SpFilterFormItem> -->
          <SpFilterFormItem prop="merchant_id" label="所属商家:">
            <SpSelectMerchant v-model="formQuery.merchant_id" clearable placeholder="请选择" />
          </SpFilterFormItem>
        </SpFilterForm>
        <SpFinder
          ref="finder"
          no-selection
          :setting="setting"
          :hooks="{
            beforeSearch: beforeSearch
          }"
          url="/statement/period/distributor/setting"
        />
      </el-tab-pane>
    </el-tabs>

    <SpDialog
      ref="addDialogRef"
      v-model="addDialog"
      :title="`${this.addForm.id ? '店铺编辑' : '添加店铺配置'}`"
      :form="addForm"
      :form-list="addFormList"
      @onSubmit="onAddSubmit"
    />
  </SpPage>
</template>

<script>
import SettlementCycle from './components/SettlementCycle.vue'
import { createSetting } from '@shopex/finder'
export default {
  name: '',
  data() {
    return {
      form: {
        cycleData: {
          cycle: '',
          unit: ''
        }
      },
      formList: [
        {
          label: '结算周期',
          key: 'cycleData',
          component: () => <SettlementCycle v-model={this.form.cycleData} />,
          validator: (rule, value, callback) => {
            const { cycle, unit } = this.form.cycleData
            if (!cycle || !unit) {
              callback(new Error('结算周期不能为空'))
            } else {
              callback()
            }
          },
          tip: '结算说明：结算周期的T+1天生成结算单'
        }
      ],
      formQuery: {
        distributor_id: '',
        merchant_id: ''
      },
      setting: createSetting({
        actions: [
          {
            name: '添加店铺配置',
            key: 'add',
            type: 'button',
            slot: 'header',
            buttonType: 'primary is-plain',
            action: {
              handler: async val => {
                this.addForm.id = ''
                this.addForm.distributor_id = ''
                this.addForm.cycleData = {
                  cycle: '',
                  unit: ''
                }
                this.addFormList[0].isShow = true
                this.addFormList[1].isShow = false
                this.addDialog = true
              }
            }
          },
          {
            name: '设置',
            key: 'config',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.addForm.id = row.id
                this.addForm.distributor_id = row.distributor_id
                this.addForm.cycleData = {
                  cycle: row.period[0],
                  unit: row.period[1]
                }
                this.addForm.distributor_name = row.distributor_name
                this.addFormList[0].isShow = false
                this.addFormList[1].isShow = true
                this.addDialog = true
              }
            }
          }
        ],
        columns: [
          { name: '商家', key: 'merchant_name' },
          {
            name: '店铺',
            key: 'distributor_name'
          },
          {
            name: '结算周期',
            key: 'period',
            render: (h, { row }) => h('span', {}, this.getCycle(row.period))
          }
        ]
      }),
      addDialog: false,
      addForm: {
        id: '',
        distributor_id: '',
        distributor_name: '',
        cycleData: {
          cycle: '',
          unit: ''
        }
      },
      addFormList: [
        {
          label: '店铺',
          key: 'distributor_id',
          component: () => (
            <SpSelectShop v-model={this.addForm.distributor_id} clearable placeholder="请选择" />
          ),
          // required: true,
          validator: (rule, value, callback) => {
            const { id, distributor_id } = this.addForm
            if (!id && !distributor_id) {
              callback(new Error('不能为空'))
            } else {
              callback()
            }
          },
          isShow: true
        },
        {
          label: '店铺',
          key: 'distributor_name',
          type: 'text',
          isShow: false
        },
        {
          label: '结算周期:',
          key: 'cycleData',
          component: () => <SettlementCycle v-model={this.addForm.cycleData} />,
          validator: (rule, value, callback) => {
            const { cycle, unit } = this.addForm.cycleData
            if (!cycle || !unit) {
              callback(new Error('结算周期不能为空'))
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { period } = await this.$api.financial.getDefaultSetting()
      if (period.length == 2) {
        this.form.cycleData = {
          cycle: period[0],
          unit: period[1]
        }
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      return { ...params, ...this.formQuery }
    },
    async onSaveConfig() {
      const { cycle, unit } = this.form.cycleData
      await this.$api.financial.savePeriodSetting({
        period: [cycle, unit]
      })
      this.$message.success('保存成功')
    },
    async onAddSubmit() {
      const { id, distributor_id, cycleData } = this.addForm
      const { cycle, unit } = cycleData
      await this.$api.financial.savePeriodSetting({
        id,
        distributor_id,
        period: [cycle, unit]
      })
      this.$message.success(id ? '保存成功' : '添加成功')
      this.addDialog = false
      this.$refs.finder.refresh(true)
    },
    getCycle(period) {
      const [cycle, unit] = period
      const units = {
        day: '天',
        week: '周',
        month: '月'
      }
      return `${cycle}${units[unit]}`
    }
  }
}
</script>
