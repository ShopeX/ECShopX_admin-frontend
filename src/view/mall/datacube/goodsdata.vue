<template>
  <div>
    <div class="action-container">
      <el-button type="primary"> 导出 </el-button>
    </div>

    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="datetime" label="查询日期:" size="max">
        <el-date-picker
          v-model="queryForm.datetime"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-form label-width="100px">
      <el-form-item label="选择日期范围">
        <el-col :span="12">
          <el-date-picker
            v-model="vdate"
            type="daterange"
            alue-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="dateChange"
          />
        </el-col>
        <el-col :span="12">
          <export-tip @exportHandle="exportData">
            <el-button v-loading="exportloading" type="primary"> 导出 </el-button>
          </export-tip>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
      </el-form-item>
    </el-form>

    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :row-actions-align="'left'"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/datacube/goodsdata"
    />

    <!-- <el-tabs
      v-if="$route.path.indexOf('editor') === -1"
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-loading="loading"
        label="商品统计"
        name="goods_count"
      >
        <template>
          <el-table
            :data="allListData"
            stripe
            border
            style="width: 100%"
            :height="wheight - 230"
          >
            <el-table-column
              prop="no"
              label="No"
            />
            <el-table-column
              prop="sap_code"
              label="商品编号"
            />
            <el-table-column
              prop="top_level"
              label="分类"
            />
            <el-table-column
              prop="product"
              label="商品名称"
            />
            <el-table-column
              prop="quantity"
              label="销量"
            />
            <el-table-column
              prop="fix_price"
              label="销售额"
            />
            <el-table-column
              prop="settle_price"
              label="实付额"
            />
          </el-table>
        </template>
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import json2csv from 'json2csv'
import { PICKER_DATE_OPTIONS } from '@/consts'
import { getGoodsData } from '../../../api/datacube'
import { createSetting } from '@shopex/finder'
export default {
  data() {
    return {
      vdate: '',
      loading: true,
      exportloading: false,
      activeName: 'goods_count',
      params: {
        start: '',
        end: ''
      },
      queryForm: {
        datetime: []
      },
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      allListData: [],
      setting: createSetting({
        columns: [
          { name: 'No', key: 'no' },
          {
            name: '商品编号',
            key: 'sap_code'
          },
          {
            name: '分类',
            key: 'top_level'
          },
          {
            name: '商品名称',
            key: 'product'
          },
          {
            name: '销量',
            key: 'quantity'
          },
          {
            name: '销售额',
            key: 'fix_price'
          },
          {
            name: '实付额',
            key: 'settle_price'
          }
        ]
      })
    }
  },
  mounted() {
    var start = new Date()
    var end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    this.vdate = [start, end]
    this.getGoodsDataList()
  },
  methods: {
    beforeSearch(params) {
      const {
        name,
        datetime: [display_time_begin, display_time_end],
        enterprise_id,
        activityState
      } = this.queryForm
      params = {
        ...params,
        display_time_begin,
        display_time_end,
        enterprise_id,
        name
      }
      if (activityState != 'all') {
        params = {
          ...params,
          status: activityState
        }
      }
      return params
    },
    exportData() {
      this.exportloading = true
      this.params.export = 1
      getGoodsData(this.params)
        .then((res) => {
          this.exportloading = false
          if (res.data.data.status) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
            this.$export_open('goods_data')
            return
          } else if (res.data.data.url) {
            this.downloadUrl = res.data.data.url
            this.downloadName = res.data.data.filename
            this.downloadView = true
          } else {
            this.$message({
              type: 'error',
              message: '无内容可导出 或 执行失败，请检查重试'
            })
            return
          }
        })
        .catch((error) => {
          this.exportloading = false
        })
    },
    handleClick(tab, event) {},
    getGoodsDataList() {
      this.loading = true
      getGoodsData(this.params)
        .then((res) => {
          this.allListData = res.data.data.list
          this.loading = false
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: '获取统计信息出错'
          })
        })
    }
  }
}
</script>
