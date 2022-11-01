<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      :height="wheight - 140"
      element-loading-text="数据加载中"
    >
      <el-table-column
        prop="username"
        label="姓名"
      />
      <el-table-column
        prop="mobile"
        label="手机号"
      />
      <el-table-column
        prop="bind_date"
        label="加入时间"
      />
      <el-table-column label="已结算">
        <template
          slot-scope="scope"
        >
          ￥{{ (scope.row.rebateTotal - scope.row.noCloseRebate) / 100 }}
        </template>
      </el-table-column>
      <el-table-column label="未结算">
        <template slot-scope="scope">
          ￥{{ scope.row.noCloseRebate / 100 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="disabled"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.disabled == '0'"
            type="success"
            size="mini"
          >
            有效
          </el-tag>
          <el-tag
            v-else
            type="info"
            size="mini"
          >
            无效
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="content-padded content-center"
    >
      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-sizes="[params.pageSize]"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPopularizeChildren } from '../../api/promotions'
export default {
  data () {
    return {
      params: {
        page: 1,
        pageSize: 20,
        promoter_id: 0
      },
      list: [],
      loading: false,
      total_count: 0
    }
  },
  mounted () {
    if (this.$route.query.promoter_id) {
      this.params.promoter_id = this.$route.query.promoter_id
    }
    this.getPopularizeChildrenFun()
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getPopularizeChildrenFun()
    },
    getPopularizeChildrenFun () {
      getPopularizeChildren(this.params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
