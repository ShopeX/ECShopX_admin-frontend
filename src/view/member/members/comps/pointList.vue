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
<style lang="scss"></style>

<template>
  <div>
    <SpFinder
      ref="finder"
      url="/point/member"
      :fixed-row-action="true"
      :setting="setting"
      no-selection
      :hooks="{
        beforeSearch: beforeSearch
      }"
    >
      <template slot="tableTop" v-if="!dmcrmIsOpen">
        <div class="action-container">
          <el-button @click="updatePoint">积分调整</el-button>
        </div>
      </template>
    </SpFinder>

    <!-- 储值添加 -->
    <SpDialog
      ref="pointDialogRef"
      v-model="pointDialog"
      title="积分调整"
      :form="pointForm"
      :form-list="pointFormList"
      @onSubmit="onChuZhiFormSubmit"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import moment from 'moment'
export default {
  data() {
    return {
      setting: createSetting({
        columns: [
          {
            name: '时间',
            key: 'created',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: '积分变动',
            key: 'curPayFee',
            render: (h, { row }) => {
              return h(
                'el-tag',
                {
                  props: {
                    type: row.income > 0 ? 'danger' : row.outcome > 0 ? 'success' : ''
                  }
                },
                row.income > 0 ? `+${row.income}` : row.outcome > 0 ? `-${row.outcome}` : 0
              )
            }
          },
          {
            name: '变动原因',
            key: 'point_desc'
          },
          { name: '订单号', key: 'order_id' }
        ]
      }),
      pointDialog: false,
      pointForm: {
        adjustment_type: 'plus',
        point: ''
      },
      dmcrmIsOpen: false,
      pointFormList: [
        {
          label: '调整方式',
          key: 'adjustment_type',
          type: 'select',
          options: [
            { title: '加', value: 'plus' },
            { title: '减', value: 'reduce' }
          ]
        },
        {
          label: '积分',
          key: 'point',
          min: 1,
          max: 9999999,
          type: 'number'
        }
      ]
    }
  },
  created() {
    // this.$api.third.getDmcrmSetting().then((response) => {
    //   this.dmcrmIsOpen = response.is_open
    // })
  },
  methods: {
    beforeSearch(params) {
      const { user_id } = this.$route.query
      params = {
        ...params,
        user_id,
        page: params.page,
        pageSize: params.pageSize
      }
      return params
    },
    updatePoint() {
      this.pointForm.money = 0
      this.pointDialog = true
    },
    async onChuZhiFormSubmit() {
      const { user_id } = this.$route.query
      await this.$api.point.adjustmentPoint({
        user_id,
        adjustment_type: this.pointForm.adjustment_type,
        point: this.pointForm.point
      })
      this.$message.success('积分调整成功')
      this.pointDialog = false
      this.$refs['finder'].refresh(true)
    }
  }
}
</script>
