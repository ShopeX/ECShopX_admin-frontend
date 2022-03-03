<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="params.promoter_mobile"
          placeholder="推广员"
        />
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="params.item_name"
          placeholder="商品"
        />
      </el-col>
      <el-col :span="8">
        <el-date-picker
          v-model="search_time"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleClick"
        >
          搜索
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <el-button-group>
          <export-tip @exportHandle="exportData">
            <el-button type="primary">
              导出
            </el-button>
          </export-tip>
        </el-button-group>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      :height="wheight - 170"
      element-loading-text="数据加载中"
      :default-sort="{ prop: 'bind_date', order: 'descending' }"
    >
      <el-table-column
        prop="promoter_mobile"
        label="推广员"
      />
      <el-table-column
        prop="item_name"
        label="商品"
      >
        <template slot-scope="scope">
          {{ scope.row.item_name
          }}<el-tag
            v-if="scope.row.item_spec_desc"
            size="mini"
            effect="plain"
          >
            {{
              scope.row.item_spec_desc
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="rebate_type"
        label="任务制类型"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rebate_type == 'total_money'">按总金额</span>
          <span v-if="scope.row.rebate_type == 'total_num'">按总数量</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="total_fee"
        label="已完成金额"
        min-width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.total_fee / 100 }}元
        </template>
      </el-table-column>
      <el-table-column
        prop="finish_num"
        label="已完成数量"
        min-width="80"
      />
      <el-table-column
        prop="wait_num"
        label="待完成数量"
        min-width="80"
      />
      <el-table-column
        prop="close_num"
        label="退回数量"
        min-width="80"
      />
      <el-table-column
        prop="plan_date"
        min-width="80"
        label="账期"
      />
      <el-table-column
        prop="rebate_money"
        min-width="80"
        label="奖金"
      >
        <template slot-scope="scope">
          {{ scope.row.rebate_money / 100 }}元
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="60"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status"
            type="success"
          >
            已达标
          </el-tag>
          <span v-else>{{ scope.row.limit_desc }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="content-padded content-center">
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
    <a
      v-show="false"
      ref="download"
      :href="downloadUrl"
      :download="downloadfilename"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTaskBrokerageCountList, exportTaskBrokerageCount } from '../../api/promotions'
export default {
  data () {
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
  mounted () {
    this.getList()
  },
  methods: {
    search () {},
    getList () {
      if (this.search_time.length > 0) {
        this.params.time_start = this.search_time[0] / 1000
        this.params.time_end = this.search_time[1] / 1000
      }
      this.loading = true
      getTaskBrokerageCountList(this.params).then((res) => {
        this.loading = false
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
      })
    },
    handleClick () {
      this.params.page = 1
      this.getList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    exportData () {
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
