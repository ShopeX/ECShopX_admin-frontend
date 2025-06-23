<template>
  <SpPage class="">
    <el-table
      v-loading="loading"
      :data="logsList"
      style="width: 100%"
      border
      height="500"
    >
      <el-table-column
        prop="operator_name"
        label="操作内容"
        width="160"
      />
      <el-table-column
        prop="username"
        label="操作者"
        width="160"
      />
      <el-table-column
        prop="ip"
        label="IP"
        width="160"
      />
      <el-table-column
        prop="created"
        label="时间"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="content-left content-top-padded"
    >
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </SpPage>
</template>
<script>
import { Message } from 'element-ui'
import { getCompanysLogs } from '@/api/company'

export default {
  data () {
    return {
      logsList: [],
      companyList: [],
      companyTotal: 0,
      companyPageSize: 10,
      companyName: '',
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      renderable: true
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      getCompanysLogs(this.params).then((response) => {
        this.logsList = response.list
        this.total_count = response.total_count
        this.loading = false
      })
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 90%;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
  img {
    width: 90%;
  }
}
.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}
.service-label .el-checkbox:first-child {
  margin-left: 15px;
}
.service-label .el-input:first-child {
  margin-left: 15px;
}
.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.el-carousel {
  width: 375px;
}
</style>
<style>
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }
  img {
    width: 100%;
  }
}
.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
