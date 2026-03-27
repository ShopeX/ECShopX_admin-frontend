<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
      <el-tab-pane :label="$t('556ebaf8.1c0860')">
        <SpForm v-model="form" :form-list="formList" @onSubmit="onSaveConfig" />
      </el-tab-pane>
      <el-tab-pane :label="$t('556ebaf8.897f80')">
        <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
          <SpFilterFormItem prop="distributor_id" :label="$t('556ebaf8.efa91f')">
            <SpSelectShop
              v-model="formQuery.distributor_id"
              clearable
              :placeholder="$t('556ebaf8.708c9d')"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="merchant_id" :label="$t('556ebaf8.980296')">
            <SpSelectMerchant
              v-model="formQuery.merchant_id"
              clearable
              :placeholder="$t('556ebaf8.708c9d')"
            />
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
      :title="addDialogTitle"
      :form="addForm"
      :form-list="addFormList"
      @onSubmit="onAddSubmit"
    />
  </SpPage>
</template>

<script>
import SettlementCycle from './components/SettlementCycle.vue'
import { createSetting } from '@shopex-ui/finder'
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
          label: this.$t('556ebaf8.71412a'),
          key: 'cycleData',
          component: () => <SettlementCycle v-model={this.form.cycleData} />,
          validator: (rule, value, callback) => {
            const { cycle, unit } = this.form.cycleData
            if (!cycle || !unit) {
              callback(new Error(this.$t('556ebaf8.5c5280')))
            } else {
              callback()
            }
          },
          tip: this.$t('556ebaf8.9c6659')
        }
      ],
      formQuery: {
        distributor_id: '',
        merchant_id: ''
      },
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
          label: this.$t('556ebaf8.efa91f').replace(':', ''),
          key: 'distributor_id',
          component: () => (
            <SpSelectShop
              v-model={this.addForm.distributor_id}
              clearable
              placeholder={this.$t('556ebaf8.708c9d')}
            />
          ),
          validator: (rule, value, callback) => {
            const { id, distributor_id } = this.addForm
            if (!id && !distributor_id) {
              callback(new Error(this.$t('556ebaf8.281bad')))
            } else {
              callback()
            }
          },
          isShow: true
        },
        {
          label: this.$t('556ebaf8.efa91f').replace(':', ''),
          key: 'distributor_name',
          type: 'text',
          isShow: false
        },
        {
          label: this.$t('556ebaf8.78f74e'),
          key: 'cycleData',
          component: () => <SettlementCycle v-model={this.addForm.cycleData} />,
          validator: (rule, value, callback) => {
            const { cycle, unit } = this.addForm.cycleData
            if (!cycle || !unit) {
              callback(new Error(this.$t('556ebaf8.5c5280')))
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  computed: {
    addDialogTitle() {
      return this.addForm.id ? this.$t('556ebaf8.fc25e0') : this.$t('556ebaf8.711b5d')
    },
    setting() {
      return createSetting({
        actions: [
          {
            name: this.$t('556ebaf8.711b5d'),
            key: 'add',
            type: 'button',
            slot: 'header',
            buttonType: 'primary is-plain',
            action: {
              handler: async () => {
                this.addForm.id = ''
                this.addForm.distributor_id = ''
                this.addForm.cycleData = { cycle: '', unit: '' }
                this.addFormList[0].isShow = true
                this.addFormList[1].isShow = false
                this.addDialog = true
              }
            }
          },
          {
            name: this.$t('556ebaf8.e366cc'),
            key: 'config',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.addForm.id = row.id
                this.addForm.distributor_id = row.distributor_id
                this.addForm.cycleData = { cycle: row.period[0], unit: row.period[1] }
                this.addForm.distributor_name = row.distributor_name
                this.addFormList[0].isShow = false
                this.addFormList[1].isShow = true
                this.addDialog = true
              }
            }
          }
        ],
        columns: [
          { name: this.$t('556ebaf8.0f09a8'), key: 'merchant_name' },
          { name: this.$t('556ebaf8.295713'), key: 'distributor_name' },
          {
            name: this.$t('556ebaf8.71412a'),
            key: 'period',
            render: (h, { row }) => h('span', {}, this.getCycle(row.period))
          }
        ]
      })
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
      this.$message.success(this.$t('556ebaf8.3b1083'))
    },
    async onAddSubmit() {
      const { id, distributor_id, cycleData } = this.addForm
      const { cycle, unit } = cycleData
      await this.$api.financial.savePeriodSetting({
        id,
        distributor_id,
        period: [cycle, unit]
      })
      this.$message.success(id ? this.$t('556ebaf8.3b1083') : this.$t('556ebaf8.3fdaea'))
      this.addDialog = false
      this.$refs.finder.refresh(true)
    },
    getCycle(period) {
      const [cycle, unit] = period
      const unitKeys = { day: '556ebaf8.249aba', week: '556ebaf8.a657f4', month: '556ebaf8.e42b99' }
      return unit ? `${cycle}${this.$t(unitKeys[unit])}` : ''
    }
  }
}
</script>
