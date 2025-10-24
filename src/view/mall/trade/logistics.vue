<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div>
    <el-table v-loading="loading" :data="logisticsList" :height="wheight - 160">
      <el-table-column prop="corp_name" label="物流公司简称" />
      <el-table-column prop="is_default" label="是否启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_enable" @change="setEnable(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
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
import { Message } from 'element-ui'
import {
  getLogisticsLists,
  createCompanyLogistics,
  deleteCompanyLogistics
} from '../../../api/logistics'
export default {
  data() {
    return {
      logisticsList: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getLogisticsListData()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getLogisticsListData()
    },
    dataSearch() {
      this.params.page = 1
      this.getLogisticsListData()
    },
    getLogisticsListData() {
      this.loading = true
      getLogisticsLists(this.params).then(response => {
        this.logisticsList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    setEnable(row) {
      if (row.is_enable) {
        createCompanyLogistics(row).then(response => {
          this.getLogisticsListData()
        })
      } else {
        deleteCompanyLogistics(row.corp_id).then(response => {
          this.getLogisticsListData()
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}
.new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.button-new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  height: 40px;
  line-height: 40px;
  width: 138px;
  vertical-align: bottom;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
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
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
