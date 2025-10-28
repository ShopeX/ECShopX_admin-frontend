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
    <el-table v-loading="loading" :data="buyerTemplatesList" border style="width: 100%">
      <el-table-column width="50" prop="template_id" label="ID" />
      <el-table-column prop="name" label="运费模板名称" />
      <el-table-column prop="area" label="配送地区">
        <template slot-scope="scope">
          {{ scope.row.area | formatCityData }}
        </template>
      </el-table-column>
      <el-table-column width="100" prop="fee" label="运费" />
      <el-table-column width="70" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == true">启用</span>
          <span v-else>关闭</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="最后修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | datetime('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div class="operating-icons">
            <el-button type="text" @click="editTemplatesAction(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteTemplatesAction(scope.$index, scope.row)">删除</el-button>
          </div>
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
import { getShippingTemplatesList, deleteShippingTemplates } from '../../../../../api/shipping'
export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      buyerTemplatesList: [],
      total_count: 0,
      params: {
        is_free: 1,
        page: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getShippingTemplatesList()
      }
    }
  },
  mounted() {
    this.getShippingTemplatesList()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
    },
    getShippingTemplatesList() {
      this.loading = true
      getShippingTemplatesList(this.params).then(response => {
        this.buyerTemplatesList = []
        for (var item in response.data.data.list) {
          this.buyerTemplatesList.push({
            template_id: response.data.data.list[item].template_id,
            name: response.data.data.list[item].name,
            area: '0',
            fee: '包邮',
            status: response.data.data.list[item].status,
            updated_at: response.data.data.list[item].update_time
          })
        }
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    editTemplatesAction(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.template_id })
    },
    deleteTemplatesAction(index, row) {
      this.$confirm('此操作将删除该运费模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteShippingTemplates(row.template_id).then(response => {
            this.buyerTemplatesList.splice(index, 1)
            this.$message({
              message: '删除运费模板成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>

<style scoped></style>
