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
<style type="text/css" lang="scss">
.right-dialog {
  .el-transfer-panel {
    width: 240px;
  }
  .el-transfer-panel__footer {
    height: 38px;
    clear: both;
  }
}
.transfer-footer {
  padding: 6px 5px;
}
.alert-txt {
  padding: 15px 0;
}
.delay-dialog {
  .el-textarea {
    width: 80%;
    vertical-align: middle;
  }
  .option-box {
    padding: 15px 0;
    .el-date-editor {
      width: 70%;
    }
  }
}
</style>

<template>
  <div>
    <el-table v-loading="loading" :data="list" :height="wheight - 150">
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.log_type }}
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="信息" min-width="90" />
      <el-table-column label="日志时间">
        <template slot-scope="scope">
          {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="mt-4 text-right">
      <el-pagination
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getWorkWechatRelLogsList } from '@/api/wechat'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      activeName: 'salespersonlogs',
      total_count: 0,
      list: [],
      user_id: 0,
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
    this.user_id = this.$route.query.user_id
    this.getWorkWechatRelLogsList()
  },
  methods: {
    handleCurrentChange() {
      this.getWorkWechatRelLogsList()
    },
    getWorkWechatRelLogsList() {
      this.loading = true
      getWorkWechatRelLogsList(this.user_id, this.params).then(res => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    }
  }
}
</script>
