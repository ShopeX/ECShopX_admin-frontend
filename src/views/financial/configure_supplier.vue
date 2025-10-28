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
      <el-tab-pane label="结算周期配置">
        <SpForm v-model="form" :form-list="formList" @onSubmit="onSaveConfig" />
      </el-tab-pane>
      <el-tab-pane label="供应商结算周期">
        <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
          <!-- <SpFilterFormItem prop="mobile" label="供应商:">
            <el-input v-model="formQuery.supplier_name" placeholder="请输入供应商名称" />
          </SpFilterFormItem> -->
          <SpFilterFormItem prop="supplier_id" label="供应商:">
          <SpSelectSupplier v-model="formQuery.supplier_id" clearable placeholder="请选择" />
        </SpFilterFormItem>
        </SpFilterForm>
        <div class="action-container">
          <el-button type="primary" @click="addItems"> 添加供应商配置 </el-button>
          </div>
        <SpFinder
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
      :title="`${this.addForm.id ? '供应商编辑' : '添加供应商配置'}`"
      :form="addForm"
      :form-list="addFormList"
      @onSubmit="onAddSubmit"
    />
  </div>
   </SpPage>

</template>

<script>
import SettlementCycle from './components/SettlementCycle.vue'
import { createSetting } from '@shopex/finder'
import SpSelectSupplier from "../../components/sp-select-supplier/index";
export default {
  name: '',
  components: {SpSelectSupplier},
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
              callback(new Error('结算周期不能为空'))
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
        supplier_id:''
      },
      setting: createSetting({
        actions: [
          // {
          //   name: '添加供应商配置',
          //   key: 'add',
          //   type: 'button',
          //   slot: 'header',
          //   buttonType: 'primary',
          //   action: {
          //     handler: async (val) => {
          //       this.addForm.id = ''
          //       this.addForm.distributor_id = ''
          //       this.addForm.cycleData = {
          //         cycle: '',
          //         unit: ''
          //       }
          //       // this.addFormList[0].isShow = true
          //       // this.addFormList[1].isShow = false
          //       this.addDialog = true
          //     }
          //   }
          // },
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
                // this.addFormList[1].isShow = true
                this.addDialog = true
              }
            }
          }
        ],
        columns: [
          { name: '供应商名称', key: 'supplier_name' },
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
          label: '供应商',
          key: 'supplier_id',
          component: () => (
            <SpSelectSupplier v-model={this.addForm.supplier_id} clearable placeholder='请选择' />
          ),
          // required: true,
          validator: (rule, value, callback) => {
            const { id, supplier_id } = this.addForm
            if (!id && !supplier_id) {
              callback(new Error('不能为空'))
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
              callback(new Error('结算周期不能为空'))
            } else {
              callback()
            }
          }
        }
      ],
      
    }
  },
  created() {
    // const currentPath = this.$route.path;
    // this.is_supplier = (currentPath.indexOf('supplier') >= 0) ? true : false;
    // console.log('this.is_supplier => ', this.is_supplier);
    // this.fetch()
  },
  mounted() {
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
      const { period } = await this.$api.financial.getDefaultSetting({merchant_type: this.merchant_type});
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
      this.$message.success('保存成功')
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
