<template>
  <div>
    <div style="position: relative">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="区域" name="regionauth" />
        <el-tab-pane label="店铺" name="distributor" />
      </el-tabs>
      <span style="position: absolute; left: 160px; top: 8px"
        >满足指定条件，退货申请商家自动审批通过</span
      >
    </div>
    <SpFinder
      ref="finder"
      url="/order/aftersaleapproval/rule/list"
      fixed-row-action
      row-actions-width="200px"
      :setting="tableSchema"
      :hooks="{
        beforeSearch
      }"
      row-actions-fixed-align="left"
      @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:tableTop>
        <div class="action-container">
          <div style="height: 20px" />
          <el-button type="primary" plain @click="addHandle">新增</el-button>
        </div>
      </template>
    </SpFinder>

    <SpDialog
      ref="dialogRef"
      v-model="dialogShow"
      title="自动化售后配置"
      :modal="false"
      class="base-form"
      :form="form"
      :form-list="formList"
      @onSubmit="onSubmit"
    />
  </div>
</template>

<script>
import {
  autoApprovalSchema,
  autoApprovalFormListArea,
  autoApprovalFormListShop
} from './autoApprovalSchema'
import { generatorParams } from '@/utils/schemaHelper'

import api from '@/api'

export default {
  name: 'AutoApprovalSetting',
  data() {
    return {
      activeName: 'regionauth',
      selection: [],
      dialogShow: false,
      form: {
        ...generatorParams(autoApprovalFormListArea(this))
      },
      areas: [],
      distributor: null,
      reason_list: []
    }
  },
  computed: {
    tableSchema() {
      return autoApprovalSchema(this)
    },
    formList() {
      return this.activeName == 'regionauth'
        ? autoApprovalFormListArea(this)
        : autoApprovalFormListShop(this)
    }
  },
  mounted() {
    const proms = [api.aftersalesreason.getAftersalesReason([]), api.regionauth.getRegionauth()]
    Promise.all(proms).then(([reason_list, regionauth_list]) => {
      this.reason_list = reason_list?.map((el) => {
        return {
          value: el,
          title: el,
          label: el
        }
      })
      this.areas = regionauth_list?.list?.map((el) => {
        return {
          value: el.regionauth_id,
          title: el.regionauth_name,
          label: el.regionauth_name
        }
      })
    })
  },
  methods: {
    handleSelectionChange(selection) {
      this.selection = selection
    },
    refresh() {
      this.$refs.finder.refresh(true)
    },
    handleTabClick(tab) {
      this.refresh()
    },
    getParams(row) {
      return this.activeName == 'regionauth'
        ? generatorParams(autoApprovalFormListArea(this, row))
        : generatorParams(autoApprovalFormListShop(this, row))
    },
    // 筛选事件
    beforeSearch(params) {
      params = {
        ...params,
        rule_type: this.activeName
      }
      return params
    },
    editConfigHandle(row) {
      this.dialogShow = true
      this.editRow = row
      this.form = {
        ...this.getParams(row),
        regionauth_name: row.regionauth_name,
        distributor_name: row.distributor_name,
        rule_type: this.activeName,
        aftersale_reason: row.aftersale_reason?.split(','),
        refund_amount_limit: row.refund_amount_limit
      }
      this.distributor = {
        name: row.distributor_name,
        distributor_id: row.distributor_id
      }
    },
    deleteConfigHandle(row) {
      console.log('删除', row)
      this.$confirm('是否确认删除，删除后将无法恢复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.order
          .approvalRuleDelete(row.id, {
            ...this.getParams(row)
          })
          .then((res) => {
            this.refresh()
          })
      })
    },
    addHandle() {
      this.dialogShow = true
      this.editRow = null
      this.form = {
        ...this.getParams()
      }
      this.distributor = null
    },
    async onSubmit() {
      const params = {
        ...this.form,
        aftersale_reason: this.form.aftersale_reason?.join(','),
        regionauth_name: this.areas?.find((el) => el.value == this.form?.regionauth_id)?.label,
        refund_amount_limit: this.form?.refund_amount_limit / 100
      }
      if (!this.editRow) {
        await api.order.approvalRuleCreate(params)
      } else {
        await api.order.approvalRuleUpdate(this.editRow.id, params)
      }
      this.dialogShow = false
      this.refresh()
    },
    async handleClick() {
      const { data } = await this.$picker.shopV2({
        data: this.distributor?.distributor_id ? [this.distributor?.distributor_id] : [],
        multiple: false,
        regionauth_id: this.form?.regionauth_id
      })
      const [{ distributor_id, name }] = data
      this.form.distributor_id = distributor_id
      this.form.distributor_name = name
      this.distributor = data[0]
    },
    handleRegionChange() {
      this.form = {
        ...this.form,
        distributor_id: '',
        distributor_name: ''
      }
      this.distributor = null
    }
  }
}
</script>

<style scoped>
.base-form >>> .el-form-item:first-child .el-form-item__content {
  margin-left: 0 !important;
}
</style>
