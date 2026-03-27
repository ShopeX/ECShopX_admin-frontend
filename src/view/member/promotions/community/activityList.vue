<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="page-body">
    <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('process') === -1">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="activity_name" :label="$t('3306b52b.1cadc0')">
          <el-input v-model="params.activity_name" :placeholder="$t('3306b52b.7528b3')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" :label="$t('3306b52b.374856')" size="max">
          <el-date-picker
            v-model="params.create_time"
            clearable
            type="datetimerange"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            :range-separator="$t('3306b52b.981cbe')"
            :start-placeholder="$t('3306b52b.b44c0f')"
            :end-placeholder="$t('3306b52b.1d468b')"
            prefix-icon="null"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_success" :label="$t('3306b52b.68c9a6')">
          <el-select v-model="params.is_success" clearable :placeholder="$t('3306b52b.708c9d')">
            <el-option
              v-for="item in processArr"
              :key="item.value"
              size="mini"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container" />

      <el-tabs v-model="params.activity_status" type="card" @tab-click="onSearch">
        <el-tab-pane
          v-for="item in activity_status"
          :key="item.value"
          :label="item.title"
          :name="item.value"
        />
        <el-table v-loading="loading" border :data="tableList">
          <el-table-column width="100" prop="activity_id" label="ID" />

          <el-table-column width="220" prop="activity_name" :label="$t('3306b52b.39834b')" />
          <el-table-column prop="total_fee" width="120" :label="$t('3306b52b.622d65')">
            <template slot-scope="scope">
              {{ (scope.row.total_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="total_fee" min-width="150" :label="$t('3306b52b.bb114a')">
            <template slot-scope="scope">
              <div>{{ scope.row.start_time }}</div>
              <div>~</div>
              <div>{{ scope.row.end_time }}</div>
            </template>
          </el-table-column>

          <el-table-column width="220" prop="activity_process_msg" :label="$t('3306b52b.3fea7c')" />

          <el-table-column
            width="200"
            prop="activity_delivery_status_msg"
            :label="$t('3306b52b.c3c7a1')"
          />

          <!-- <el-table-column
              :label="$t('3306b52b.2b6bc0')"
              min-width="150"
            >
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button
                    v-if="scope.row.activity_status == 'success' &&  scope.row.delivery_status == 'PENDING'"
                    type="text"
                    @click="send(scope.row)"
                  >
                    {{ $t('3306b52b.045315') }}
                  </el-button>

                </div>
              </template>
            </el-table-column> -->
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="page.pageIndex"
            :page-sizes="[10, 20, 50]"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
          />
        </div>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import mixin from '@/mixins'
import { pageMixin } from '@/mixins'
import { VERSION_STANDARD, isArray, VERSION_B2C, VERSION_IN_PURCHASE } from '@/utils'
import { getCommunityActivity, communityDeliver } from '@/api/promotions'
import moment from 'moment'
import { DISTRIBUTION_TYPE, ORDER_STATUS, PICKER_DATE_OPTIONS } from '@/consts'

export default {
  mixins: [mixin, pageMixin],
  data() {
    return {
      loading: false,
      defaultTime: ['00:00:00', '23:59:59'],
      params: {
        activity_name: '',
        activity_status: '',
        time_start_begin: '', //
        time_start_end: ''
      },
      pickerOptions: PICKER_DATE_OPTIONS
    }
  },

  computed: {
    ...mapGetters(['wheight']),
    activity_status() {
      return [
        { title: this.$t('3306b52b.dd4e55'), value: 'waiting' },
        { title: this.$t('3306b52b.fb852f'), value: 'ongoing' },
        { title: this.$t('3306b52b.047fab'), value: 'end' }
      ]
    },
    processArr() {
      return [
        { title: this.$t('3306b52b.0a60ac'), value: 1 },
        { title: this.$t('3306b52b.c9744f'), value: 0 }
      ]
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    getParams() {
      const time = {}
      if (isArray(this.params.create_time) && this.params.create_time.length >= 2) {
        time.time_start_begin = moment(this.params.create_time[0]).unix()
        time.time_start_end = moment(this.params.create_time[1]).unix()
      }
      let params = {
        ...this.params,
        activity_status: this.params.activity_status == 0 ? undefined : this.params.activity_status,
        activity_name: this.params.activity_name,
        create_time: [],
        ...time
      }
      return params
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.onSearch()
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.promotions.getCommunityActivity(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },

    send(row) {
      const msg = this.$t('3306b52b.d56ebc')
      this.$confirm(msg, this.$t('3306b52b.02d981'), {
        cancelButtonText: this.$t('3306b52b.625fb2'),
        confirmButtonText: this.$t('3306b52b.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            communityDeliver({ activity_id: row.activity_id }).then((response) => {
              this.fetchList()
              this.$message({
                message: this.$t('3306b52b.2c8dba'),
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
