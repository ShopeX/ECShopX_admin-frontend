<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm :model="params" @onSearch="handleClick" @onReset="onReset">
      <SpFilterFormItem prop="order_id" :label="$t('1c4551e3.1e8dc2')">
        <el-input v-model="params.order_id" size="mini" :placeholder="$t('1c4551e3.1e8dc2')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="promoter_mobile" :label="$t('1c4551e3.018377')">
        <el-input
          v-model="params.promoter_mobile"
          size="mini"
          :placeholder="$t('1c4551e3.018377')"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_name" :label="$t('1c4551e3.9897d8')">
        <el-input v-model="params.item_name" size="mini" :placeholder="$t('1c4551e3.9897d8')" />
      </SpFilterFormItem>
      <SpFilterFormItem :label="$t('1c4551e3.4ff1e7')" prop="search_time">
        <el-date-picker
          v-model="search_time"
          type="daterange"
          value-format="timestamp"
          :range-separator="$t('1c4551e3.981cbe')"
          :start-placeholder="$t('1c4551e3.b44c0f')"
          :end-placeholder="$t('1c4551e3.1d468b')"
        />
      </SpFilterFormItem>
    </SpFilterForm>
    <el-tabs v-model="params.status" type="border-card" @tab-click="handleClick">
      <el-tab-pane name="wait" :label="$t('1c4551e3.fde8d3')" />
      <el-tab-pane name="finish" :label="$t('1c4551e3.8a60e7')" />
      <el-tab-pane name="close" :label="$t('1c4551e3.b15d91')" />
      <el-table
        v-loading="loading"
        :data="list"
        style="width: 100%"
        :height="wheight - 170"
        :element-loading-text="$t('1c4551e3.f09b12')"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
        <el-table-column prop="order_id" :label="$t('1c4551e3.1e8dc2')" />
        <el-table-column prop="promoter_mobile" :label="$t('1c4551e3.018377')" />
        <el-table-column prop="buy_mobile" :label="$t('1c4551e3.0e0d76')" />
        <el-table-column prop="item_name" :label="$t('1c4551e3.9897d8')">
          <template slot-scope="scope">
            {{ scope.row.item_name
            }}<el-tag v-if="scope.row.item_spec_desc" size="mini" effect="plain">
              {{ scope.row.item_spec_desc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('1c4551e3.36a6e0')" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.price / 100 }}{{ $t('1c4551e3.c16655') }}【{{ $t('1c4551e3.0bf60b')
            }}{{ scope.row.num }}】
          </template>
        </el-table-column>
        <el-table-column prop="plan_date" min-width="80" :label="$t('1c4551e3.99b7dc')" />
        <el-table-column :label="$t('1c4551e3.3fea7c')" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 'finish'" type="success">
              {{ $t('1c4551e3.fad522') }}
            </el-tag>
            <el-tag v-if="scope.row.status == 'close'" type="info">
              {{ $t('1c4551e3.b15d91') }}
            </el-tag>
            <el-tag v-if="scope.row.status == 'wait'" type="warning">
              {{ $t('1c4551e3.fde8d3') }}
            </el-tag>
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
    </el-tabs>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTaskBrokerageLog } from '../../api/promotions'
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
      loading: false,
      total_count: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    search() {},
    getList() {
      if (this.search_time.length > 0) {
        this.params.time_start = this.search_time[0] / 1000
        this.params.time_end = this.search_time[1] / 1000
      } else {
        this.params.time_start = ''
        this.params.time_end = ''
      }
      this.loading = true
      getTaskBrokerageLog(this.params).then((res) => {
        this.loading = false
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
      })
    },
    onReset() {
      this.search_time = []
      this.params.page = 1
      this.params.status = 'wait'
      this.getList()
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
