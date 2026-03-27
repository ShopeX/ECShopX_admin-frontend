<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
          <el-button @click="updatePoint">{{ $t('39c803f6.5546a2') }}</el-button>
        </div>
      </template>
    </SpFinder>

    <!-- 储值添加 -->
    <SpDialog
      ref="pointDialogRef"
      v-model="pointDialog"
      :title="$t('39c803f6.5546a2')"
      :form="pointForm"
      :form-list="pointFormList"
      @onSubmit="onChuZhiFormSubmit"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
export default {
  data() {
    return {
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
  computed: {
    setting() {
      const vm = this
      return createSetting({
        columns: [
          {
            name: vm.$t('39c803f6.8a0f5e'),
            key: 'created',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: vm.$t('39c803f6.2e7c4d'),
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
            name: vm.$t('39c803f6.9f3b1a'),
            key: 'point_desc'
          },
          { name: vm.$t('39c803f6.4c8e6b'), key: 'order_id' }
        ]
      })
    }
  },
  created() {
    this.$api.third.getDmcrmSetting().then((response) => {
      this.dmcrmIsOpen = response.is_open
    })
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
