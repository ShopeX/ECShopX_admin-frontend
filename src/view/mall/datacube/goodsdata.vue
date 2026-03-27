<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="datetime" :label="$t('1f1701db.b18226')">
        <el-date-picker
          v-model="queryForm.datetime"
          type="daterange"
          format="yyyy-MM-dd"
          :clearable="false"
          :range-separator="$t('1f1701db.981cbe')"
          :start-placeholder="$t('1f1701db.b44c0f')"
          :end-placeholder="$t('1f1701db.1d468b')"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <!-- <SpFilterFormItem prop="activity_id" label="内购活动:">
        <el-select
          v-model="queryForm.activity_id"
          v-scroll="() => pagesQuery.nextPage()"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in purchaseActivityList"
            :key="`activity-item__${index}`"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </SpFilterFormItem> -->
    </SpFilterForm>

    <div class="action-container">
      <el-button v-loading="exportloading" type="primary" @click="exportData">
        {{ $t('1f1701db.55405e') }}
      </el-button>
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        :content="$t('1f1701db.676480')"
      >
        <i slot="reference" class="el-icon-question" />
      </el-popover>
    </div>
    <SpFinder
      ref="finder"
      no-selection
      :show-pager="false"
      :setting="setting"
      :row-actions-align="'left'"
      :data="tableData"
    />
  </SpPage>
</template>
<script>
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
import Pages from '@/utils/pages'
import { VERSION_IN_PURCHASE } from '@/utils'
import { i18n } from '@/i18n'

export default {
  data() {
    const defaultStartDate = moment().subtract(8, 'day')
    const defaultEndDate = moment().subtract(1, 'day')
    return {
      loading: true,
      exportloading: false,
      activeName: 'goods_count',
      queryForm: {
        datetime: [defaultStartDate, defaultEndDate],
        activity_id: ''
      },
      defaultTime: ['00:00:00', '23:59:59'],
      tableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: i18n.t('1f1701db.56ee10'),
            onClick(picker) {
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
              picker.$emit('pick', [start, defaultEndDate])
            }
          },
          {
            text: i18n.t('1f1701db.335dfc'),
            onClick(picker) {
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 31)
              picker.$emit('pick', [start, defaultEndDate])
            }
          },
          {
            text: i18n.t('1f1701db.d96eb4'),
            onClick(picker) {
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 91)
              picker.$emit('pick', [start, defaultEndDate])
            }
          }
        ],
        disabledDate: (time) => {
          return time.getTime() > defaultEndDate
        }
      },
      allListData: [],
      setting: createSetting({
        columns: [
          { name: 'No', key: 'no' },
          {
            name: i18n.t('1f1701db.b07bdf'),
            key: 'sap_code'
          },
          {
            name: i18n.t('1f1701db.d0771a'),
            key: 'top_level'
          },
          {
            name: i18n.t('1f1701db.1fd1d5'),
            key: 'product'
          },
          {
            name: i18n.t('1f1701db.44e7eb'),
            key: 'quantity'
          },
          {
            name: i18n.t('1f1701db.9ae444'),
            key: 'fix_price'
          },
          {
            name: i18n.t('1f1701db.e601a9'),
            key: 'settle_price'
          }
        ]
      }),
      purchaseActivityList: []
    }
  },
  created() {
    this.pagesQuery = new Pages({
      fetch: this.getPurchaseActivity
    }).nextPage()
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { datetime, activity_id } = this.queryForm || {}
      const [display_time_begin, display_time_end] = datetime || []
      const { list } = await this.$api.datacube.getGoodsData({
        start: moment(display_time_begin).format('YYYY-MM-DD'),
        end: moment(display_time_end).format('YYYY-MM-DD'),
        order_class: activity_id.length > 0 ? 'employee_purchase' : '',
        act_id: activity_id.length > 0 ? activity_id.toString() : ''
      })
      this.tableData = list
      this.$nextTick(() => {
        this.$refs.finder.refresh()
      })
    },
    onSearch() {
      this.fetch()
    },
    async exportData() {
      this.exportloading = true
      const { datetime, activity_id } = this.queryForm || {}
      const [display_time_begin, display_time_end] = datetime || []
      const { status, url } = await this.$api.datacube.getGoodsData({
        start: moment(display_time_begin).format('YYYY-MM-DD'),
        end: moment(display_time_end).format('YYYY-MM-DD'),
        order_class: activity_id.length > 0 ? 'employee_purchase' : '',
        act_id: activity_id.length > 0 ? activity_id.toString() : '',
        export: 1
      })
      this.exportloading = false
      if (status) {
        this.$message.success(this.$t('1f1701db.3e1ddd'))
        this.$export_open('goods_data')
      } else {
        this.$message.error(this.$t('1f1701db.89ae53'))
      }
    },
    async getPurchaseActivity({ page, pageSize }) {
      const { list, total_count } = await this.$api.marketing.getPurchaseActivity({
        page,
        pageSize
      })
      this.pagesQuery.setTotal(total_count)
      this.purchaseActivityList = this.purchaseActivityList.concat(list)
    }
  }
}
</script>
