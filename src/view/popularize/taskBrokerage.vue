<template>
  <SpPage>
    <SpFilterForm :model="params" @onSearch="handleClick" @onReset="onReset">
      <SpFilterFormItem prop="order_id" label="订单号">
        <el-input v-model="params.order_id" size="mini" placeholder="订单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="promoter_mobile" label="推广员">
        <el-input v-model="params.promoter_mobile" size="mini" placeholder="推广员" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="item_name" label="商品">
        <el-input v-model="params.item_name" size="mini" placeholder="商品" />
      </SpFilterFormItem>
      <SpFilterFormItem label="日期" prop="search_time">
        <el-date-picker
          v-model="search_time"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </SpFilterFormItem>
    </SpFilterForm>
    <el-tabs v-model="params.status" type="border-card" @tab-click="handleClick">
      <el-tab-pane name="wait" label="待统计" />
      <el-tab-pane name="finish" label="已统计" />
      <el-tab-pane name="close" label="关闭" />
      <el-table
        v-loading="loading"
        :data="list"
        style="width: 100%"
        :height="wheight - 170"
        element-loading-text="数据加载中"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
        <el-table-column prop="order_id" label="订单号" />
        <el-table-column prop="promoter_mobile" label="推广员" />
        <el-table-column prop="buy_mobile" label="购买用户" />
        <el-table-column prop="item_name" label="商品">
          <template slot-scope="scope">
            {{ scope.row.item_name
            }}<el-tag v-if="scope.row.item_spec_desc" size="mini" effect="plain">
              {{ scope.row.item_spec_desc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="销售总额" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.price / 100 }}元【数量{{ scope.row.num }}】
          </template>
        </el-table-column>
        <el-table-column prop="plan_date" min-width="80" label="账期" />
        <el-table-column label="状态" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 'finish'" type="success"> 已完成 </el-tag>
            <el-tag v-if="scope.row.status == 'close'" type="info"> 关闭 </el-tag>
            <el-tag v-if="scope.row.status == 'wait'" type="warning"> 待统计 </el-tag>
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
      getTaskBrokerageLog(this.params).then(res => {
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
