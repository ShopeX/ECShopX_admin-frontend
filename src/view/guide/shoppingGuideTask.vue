<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div
      v-if="$route.path.indexOf('editor') === -1 && $route.path.indexOf('statistics') === -1"
      class="shoppingguidenotification"
    >
      <el-row>
        <el-col>
          <el-select v-model="params.status" :placeholder="$t('73ceba4e.708c9d')">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="$t(item.labelKey)"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="params.title" class="input-b" :placeholder="$t('73ceba4e.64615c')">
            <el-button slot="append" icon="el-icon-search" @click="handelClickSearch" />
          </el-input>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handelClickAdd">
            {{ $t('73ceba4e.3c6fb7') }}
          </el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-card>
        <el-table v-loading="loadingTable" :data="list" style="width: 100%">
          <el-table-column prop="task_name" :label="$t('73ceba4e.78caf7')" />
          <el-table-column prop="created" :label="$t('73ceba4e.b341f9')">
            <template slot-scope="scope">
              {{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss') }}～{{
                scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss')
              }}
            </template>
          </el-table-column>
          <el-table-column prop="withdraw" :label="$t('73ceba4e.bc7e74')">
            <template slot-scope="scope">
              {{ sendingStateLabel(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column fixed="left" :label="$t('73ceba4e.2b6bc0')" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="() => $router.push({ path: matchRoutePath('editor/' + scope.row.task_id) })"
              >
                {{ $t('73ceba4e.95b351') }}
              </el-button>
              <el-button type="text" @click="cancleSalesperosnTaskAction(scope.row)">
                {{ $t('73ceba4e.ff6c6a') }}
              </el-button>
              <el-button type="text" @click="salesperosnTaskStatisticsAction(scope.row)">
                {{ $t('73ceba4e.d7656a') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            :current-page="params.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="params.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_count"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import { getSalesperosnTask, cancleSalesperosnTask } from '@/api/shop'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  data() {
    return {
      loadingTable: false,
      stateOptions: [
        { value: 'all', labelKey: '73ceba4e.a8b0c2' },
        { value: 'waiting', labelKey: '73ceba4e.dd4e55' },
        { value: 'ongoing', labelKey: '73ceba4e.fb852f' },
        { value: 'end', labelKey: '73ceba4e.047fab' },
        { value: 'close', labelKey: '73ceba4e.255412' }
      ],
      list: [],
      total_count: 0,
      params: {
        //分页
        page: 1,
        page_size: 10
      },
      showSeeModule: false //查看
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loadingTable = true
      getSalesperosnTask(this.params).then((response) => {
        this.list = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loadingTable = false
      })
    },
    handelClickSearch() {
      this.getList()
    },
    handleSizeChange(val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.paging.page = val
      this.getList()
    },
    handelClickAdd() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    cancleSalesperosnTaskAction(row) {
      this.$confirm(this.$t('73ceba4e.00a590'), this.$t('60e84c78.02d981'), {
        confirmButtonText: this.$t('73ceba4e.38cf16'),
        cancelButtonText: this.$t('73ceba4e.625fb2'),
        type: 'warning'
      }).then(() => {
        cancleSalesperosnTask(row.task_id)
          .then((response) => {
            this.$message({
              type: 'success',
              message: this.$t('73ceba4e.b06ade')
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('73ceba4e.da3938')
            })
          })
      })
    },
    sendingStateLabel(v) {
      if (v === 'waiting') return this.$t('73ceba4e.dd4e55')
      if (v === 'ongoing') return this.$t('73ceba4e.fb852f')
      if (v === 'end') return this.$t('73ceba4e.047fab')
      return this.$t('73ceba4e.255412')
    },
    salesperosnTaskStatisticsAction(row) {
      this.$router.push({
        path: this.matchRoutePath('statistics'),
        query: { task_id: row.task_id }
      })
    },
    refresh() {
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.shoppingguidenotification {
  .flex {
    display: flex;
  }
  &-header {
    height: 73px;
  }
  .label {
    width: 105px;
  }
  .ma-t {
    margin-top: 30px;
  }
  .ma-r {
    margin-right: 20px;
  }
}
</style>
