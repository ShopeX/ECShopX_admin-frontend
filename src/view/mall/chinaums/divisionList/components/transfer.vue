<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="page-body">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="create_time" :label="$t('65a0769c.8d3bf9')">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :placeholder="$t('65a0769c.5d92ab')"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="back_status" :label="$t('65a0769c.b08748')">
        <el-select v-model="params.back_status" :placeholder="$t('65a0769c.b8bdeb')">
          <el-option
            v-for="(item, index) in backStatusList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" plain @click="exportData"> {{ $t('65a0769c.55405e') }} </el-button>
    </div>

    <el-table v-loading="loading" border :data="tableList" :height="wheight - 150">
      <el-table-column prop="id" :label="$t('65a0769c.662bb7')" width="100" />
      <el-table-column prop="total_fee" :label="$t('65a0769c.b1862e')">
        <template slot-scope="scope"> ￥{{ scope.row.total_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="actual_fee" :label="$t('65a0769c.dff07e')">
        <template slot-scope="scope"> ￥{{ scope.row.actual_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="division_fee" :label="$t('65a0769c.1e61f1')">
        <template slot-scope="scope"> ￥{{ scope.row.division_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="backsucc_fee" :label="$t('65a0769c.096168')">
        <template slot-scope="scope"> ￥{{ scope.row.backsucc_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="rate_fee" :label="$t('65a0769c.b5de6a')">
        <template slot-scope="scope"> ￥{{ scope.row.rate_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="back_status" width="100" :label="$t('65a0769c.0c35e5')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.back_status == '0'" size="mini" type="info" effect="plain">
            {{ $t('65a0769c.2839c8') }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.back_status == '1'"
            size="mini"
            type="success"
            effect="plain"
          >
            {{ $t('65a0769c.5d459d') }}
          </el-tag>
          <el-tag v-else-if="scope.row.back_status == '2'" size="mini" type="success" effect="dark">
            {{ $t('65a0769c.330363') }}
          </el-tag>
          <el-tag v-else-if="scope.row.back_status == '3'" size="mini" type="danger" effect="dark">
            {{ $t('65a0769c.983b68') }}
          </el-tag>
          <el-tag v-else-if="scope.row.back_status == '4'" size="mini" type="info" effect="dark">
            {{ $t('65a0769c.acd5cb') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" :label="$t('65a0769c.eca37c')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import exportTip from '@/components/export_tips'
import mixin, { pageMixin } from '@/mixins'
import { i18n } from '@/i18n'

export default {
  components: {
    exportTip
  },
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      create_time: '',
      back_status: ''
    }
    return {
      initialParams,
      loading: false,
      params: {
        ...initialParams
      },
      backStatusList: [
        { name: i18n.t('65a0769c.a8b0c2'), value: '' },
        { name: i18n.t('65a0769c.2839c8'), value: '0' },
        { name: i18n.t('65a0769c.5d459d'), value: '1' },
        { name: i18n.t('65a0769c.330363'), value: '2' },
        { name: i18n.t('65a0769c.acd5cb'), value: '4' }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateTransfer(val) {
      let time_start_begin = undefined
      let time_start_end = undefined
      if (val) {
        time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      return {
        time_start_begin,
        time_start_end
      }
    },
    getParams() {
      let params = {
        ...this.dateTransfer(this.params.create_time),
        back_status: this.params.back_status || undefined
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.trade.chinaumsDivisionList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    async exportData() {
      const { status, url, filename } = await this.$api.trade.chinaumsDivisionExportData(
        this.getParams()
      )
      if (status) {
        this.$message({
          type: 'success',
          message: this.$t('65a0769c.3e1ddd')
        })
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      }
    }
  }
}
</script>
