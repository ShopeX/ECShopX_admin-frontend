<template>
  <div>
    <div
      v-if="$route.path.indexOf('editor') === -1 && $route.path.indexOf('statistics') === -1"
      class="shoppingguidenotification"
    >
      <el-row>
        <el-col>
          <el-select
            v-model="params.status"
            placeholder="请选择"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="params.title"
            class="input-b"
            placeholder="请输入任务名称"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handelClickSearch"
            />
          </el-input>
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handelClickAdd"
          >
            新增任务
          </el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-card>
        <el-table
          v-loading="loadingTable"
          :data="list"
          style="width: 100%"
        >
          <el-table-column
            prop="task_name"
            label="任务名称"
          />
          <el-table-column
            prop="created"
            label="任务时间"
          >
            <template
              slot-scope="scope"
            >
              {{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss') }}～{{
                scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss')
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="withdraw"
            label="任务状态"
          >
            <template slot-scope="scope">
              {{ scope.row.status | sendingState }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="() => $router.push({ path: matchHidePage('editor/' + scope.row.task_id) })"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                @click="cancleSalesperosnTaskAction(scope.row)"
              >
                终止
              </el-button>
              <el-button
                type="text"
                @click="salesperosnTaskStatisticsAction(scope.row)"
              >
                统计
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="content-padded content-center"
          background
          :current-page="params.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="params.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import { getSalesperosnTask, cancleSalesperosnTask } from '@/api/shop'

export default {
  provide () {
    return {
      refresh: this.refresh
    }
  },
  filters: {
    sendingState (v) {
      if (v == 'waiting') {
        return '未开始'
      }
      if (v == 'ongoing') {
        return '进行中'
      }
      if (v == 'end') {
        return '已结束'
      }
      return '已终止'
    }
  },
  data () {
    return {
      loadingTable: false,
      stateOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'waiting',
          label: '未开始'
        },
        {
          value: 'ongoing',
          label: '进行中'
        },
        {
          value: 'end',
          label: '已结束'
        },
        {
          value: 'close',
          label: '已终止'
        }
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
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.loadingTable = true
      getSalesperosnTask(this.params).then((response) => {
        this.list = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loadingTable = false
      })
    },
    handelClickSearch () {
      this.getList()
    },
    handleSizeChange (val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.paging.page = val
      this.getList()
    },
    handelClickAdd () {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    cancleSalesperosnTaskAction (row) {
      this.$confirm('此操作将终止该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancleSalesperosnTask(row.task_id)
          .then((response) => {
            this.$message({
              type: 'success',
              message: '终止任务成功'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消终止任务'
            })
          })
      })
    },
    salesperosnTaskStatisticsAction (row) {
      this.$router.push({ path: this.matchHidePage('statistics'), query: { task_id: row.task_id } })
    },
    refresh () {
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
