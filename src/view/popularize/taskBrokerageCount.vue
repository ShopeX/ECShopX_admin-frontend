<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm :model="params" @onSearch="handleClick" @onReset="onReset">
      <SpFilterFormItem prop="promoter_mobile" :label="$t('434cdeb7.018377')">
        <el-input
          v-model="params.promoter_mobile"
          size="mini"
          :placeholder="$t('434cdeb7.018377')"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_name" :label="$t('434cdeb7.9897d8')">
        <el-input v-model="params.item_name" size="mini" :placeholder="$t('434cdeb7.9897d8')" />
      </SpFilterFormItem>
      <SpFilterFormItem :label="$t('434cdeb7.4ff1e7')" prop="search_time">
        <el-date-picker
          v-model="search_time"
          type="daterange"
          value-format="timestamp"
          :range-separator="$t('434cdeb7.981cbe')"
          :start-placeholder="$t('434cdeb7.b44c0f')"
          :end-placeholder="$t('434cdeb7.1d468b')"
        />
      </SpFilterFormItem>
    </SpFilterForm>
    <div class="action-container">
      <el-button type="primary" size="mini" @click="exportData">
        {{ $t('434cdeb7.066ffd') }}
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      :height="wheight - 170"
      :element-loading-text="$t('434cdeb7.f09b12')"
      :default-sort="{ prop: 'bind_date', order: 'descending' }"
    >
      <el-table-column prop="promoter_mobile" :label="$t('434cdeb7.018377')" />
      <el-table-column prop="item_name" :label="$t('434cdeb7.9897d8')">
        <template slot-scope="scope">
          {{ scope.row.item_name
          }}<el-tag v-if="scope.row.item_spec_desc" size="mini" effect="plain">
            {{ scope.row.item_spec_desc }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="rebate_type" :label="$t('434cdeb7.d07d88')">
        <template slot-scope="scope">
          <span v-if="scope.row.rebate_type == 'total_money'">{{ $t('434cdeb7.fed67e') }}</span>
          <span v-if="scope.row.rebate_type == 'total_num'">{{ $t('434cdeb7.5f414e') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total_fee" :label="$t('434cdeb7.18f625')" min-width="80">
        <template slot-scope="scope">
          {{ scope.row.total_fee / 100 }}{{ $t('1c4551e3.c16655') }}
        </template>
      </el-table-column>
      <el-table-column prop="finish_num" :label="$t('434cdeb7.be4db6')" min-width="80" />
      <el-table-column prop="wait_num" :label="$t('434cdeb7.bebb1e')" min-width="80" />
      <el-table-column prop="close_num" :label="$t('434cdeb7.f6fb04')" min-width="80" />
      <el-table-column prop="plan_date" min-width="80" :label="$t('434cdeb7.99b7dc')" />
      <el-table-column prop="rebate_money" min-width="80" :label="$t('434cdeb7.f41af7')">
        <template slot-scope="scope">
          {{ scope.row.rebate_money / 100 }}{{ $t('1c4551e3.c16655') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('434cdeb7.3fea7c')" min-width="60">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="success">{{ $t('434cdeb7.f4b045') }}</el-tag>
          <span v-else>{{ scope.row.limit_desc }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="params.page"
        :page-sizes="[15, 20, 50]"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <a v-show="false" ref="download" :href="downloadUrl" :download="downloadfilename" />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTaskBrokerageCountList, exportTaskBrokerageCount } from '../../api/promotions'
export default {
  data() {
    return {
      params: {
        page: 1,
        pageSize: 15,
        status: 'wait'
      },
      search_time: [],
      list: [],
      downloadfilename: '',
      downloadUrl: '',
      loading: false,
      total_count: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    search() {},
    onReset() {
      this.search_time = []
      this.params.page = 1
      this.params.status = 'wait'
      this.getList()
    },
    getList() {
      if (this.search_time.length > 0) {
        this.params.time_start = this.search_time[0] / 1000
        this.params.time_end = this.search_time[1] / 1000
      } else {
        this.params.time_start = ''
        this.params.time_end = ''
      }
      this.loading = true
      getTaskBrokerageCountList(this.params).then((res) => {
        this.loading = false
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
      })
    },
    handleClick() {
      this.params.page = 1
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    exportData() {
      this.params.page = 1
      exportTaskBrokerageCount(this.params).then((response) => {
        this.downloadUrl = response.data.data.url
        this.downloadfilename = response.data.data.filename
        setTimeout(() => {
          console.log(this.downloadUrl)
          this.$refs.download.click()
        }, 200)
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.grade-setting-col {
  line-height: 40px;
}
.btn-gap {
  margin-left: 10px;
}
</style>
