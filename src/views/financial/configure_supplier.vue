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
    <div>
      <el-tabs type="card">
        <el-tab-pane :label="$t('4bac5508.1c0860')">
          <SpForm v-model="form" :form-list="formList" @onSubmit="onSaveConfig" />
        </el-tab-pane>
        <el-tab-pane :label="$t('4bac5508.cdd6bd')">
          <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
            <SpFilterFormItem prop="supplier_id" :label="$t('4bac5508.83bbcd')">
              <SpSelectSupplier
                v-model="formQuery.supplier_id"
                clearable
                :placeholder="$t('4bac5508.708c9d')"
              />
            </SpFilterFormItem>
          </SpFilterForm>
          <div class="action-container">
            <el-button type="primary" @click="addItems"> {{ $t('4bac5508.664bfb') }} </el-button>
          </div>
          <SpFinder
            v-if="setting"
            ref="finder"
            no-selection
            :setting="setting"
            :hooks="{
              beforeSearch: beforeSearch
            }"
            url="/statement/period/supplier/setting"
          />
        </el-tab-pane>
      </el-tabs>

      <SpDialog
        ref="addDialogRef"
        v-model="addDialog"
        :title="`${this.addForm.id ? this.$t('4bac5508.de3d8c') : this.$t('4bac5508.664bfb')}`"
        :form="addForm"
        :form-list="addFormList"
        @onSubmit="onAddSubmit"
      />
    </div>
  </SpPage>
</template>

<script>
import SettlementCycle from './components/SettlementCycle.vue'
import { createSetting } from '@shopex-ui/finder'
import SpSelectSupplier from '../../components/sp-select-supplier/index'
export default {
  name: '',
  components: { SpSelectSupplier },
  data() {
    return {
      merchant_type: 'supplier',
      form: {
        supplier_id: 0,
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
              callback(new Error(this.$t('4bac5508.5c5280')))
            } else {
              callback()
            }
          },
          tip: '结算说明：结算周期的T+1天生成结算单'
        }
      ],
      formQuery: {
        supplier_name: '',
        distributor_id: '',
        merchant_id: '',
        supplier_id: ''
      },
      setting: null,
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
          label: '供应商',
          key: 'supplier_id',
          component: () => (
            <SpSelectSupplier v-model={this.addForm.supplier_id} clearable placeholder='请选择' />
          ),
          // required: true,
          validator: (rule, value, callback) => {
            const { id, supplier_id } = this.addForm
            if (!id && !supplier_id) {
              callback(new Error(this.$t('4bac5508.281bad')))
            } else {
              callback()
            }
          },
          isShow: true
        },
        {
          label: '结算周期',
          key: 'cycleData',
          component: () => <SettlementCycle v-model={this.addForm.cycleData} />,
          validator: (rule, value, callback) => {
            const { cycle, unit } = this.addForm.cycleData
            if (!cycle || !unit) {
              callback(new Error(this.$t('4bac5508.5c5280')))
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  created() {
    this.formList[0].label = this.$t('4bac5508.71412a')
    this.formList[0].tip = this.$t('4bac5508.9c6659')
    this.addFormList[0].label = this.$t('4bac5508.bab268')
  },
  mounted() {
    const t = this.$t.bind(this)
    this.setting = createSetting({
      actions: [
        {
          name: t('4bac5508.e366cc'),
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
              this.addDialog = true
            }
          }
        }
      ],
      columns: [
        { name: t('4bac5508.9190cc'), key: 'supplier_name' },
        {
          name: t('4bac5508.71412a'),
          key: 'period',
          render: (h, { row }) => h('span', {}, this.getCycle(row.period))
        }
      ]
    })
    this.fetch()
  },
  methods: {
    addItems() {
      this.addForm.id = ''
      this.addForm.distributor_id = ''
      this.addForm.cycleData = {
        cycle: '',
        unit: ''
      }
      // this.addFormList[0].isShow = true
      // this.addFormList[1].isShow = false
      this.addDialog = true
    },
    async fetch() {
      const { period } = await this.$api.financial.getDefaultSetting({
        merchant_type: this.merchant_type
      })
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
        period: [cycle, unit],
        merchant_type: this.merchant_type
      })
      this.$message.success(this.$t('4bac5508.3b1083'))
    },
    async onAddSubmit() {
      const { id, supplier_id, cycleData } = this.addForm
      const { cycle, unit } = cycleData
      await this.$api.financial.savePeriodSetting({
        id,
        supplier_id,
        merchant_type: this.merchant_type,
        period: [cycle, unit]
      })
      this.$message.success(id ? this.$t('4bac5508.3b1083') : this.$t('4bac5508.3fdaea'))
      this.addDialog = false
      this.$refs.finder.refresh(true)
    },
    getCycle(period) {
      const [cycle, unit] = period
      const units = {
        day: this.$t('4bac5508.249aba'),
        week: this.$t('4bac5508.a657f4'),
        month: this.$t('4bac5508.e42b99')
      }
      return `${cycle}${units[unit]}`
    }
  }
}
</script>
