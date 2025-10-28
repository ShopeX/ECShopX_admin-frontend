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
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" icon="plus" @click="handleNew"> 添加配置 </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="list" style="width: 100%" :height="wheight - 140">
        <el-table-column type="selection" width="55" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="stopFapiao(scope.row, scope.$index)"> 暂停 </el-button>
            <router-link
              :to="{
                path: matchRoutePath('detail'),
                query: { aftersales_bn: scope.row.aftersales_bn }
              }"
            >
              编辑
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="开票方名称" min-width="84" />
        <el-table-column prop="registration_number" label="开票方税号" />
        <el-table-column prop="company_address" label="开票方地址" />
        <el-table-column prop="company_phone" label="开票方电话" />
        <el-table-column prop="tax_rate" label="税率" />
        <el-table-column prop="bankname" label="开票银行" />
        <el-table-column prop="bankaccount" label="开票方银行账号" />
        <el-table-column prop="user_name" label="开票人" />
      </el-table>
      <div class="content-center content-padded">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page.sync="params.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getFapiaoset, tradeExport } from '@/api/fapiao'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  data() {
    return {
      activeName: 'all',
      loading: false,
      total_count: 0,
      status: '',
      create_time: '',
      mobile: '',
      date_begin: '',
      date_end: '',
      params: {
        page: 1,
        pageSize: 20
      },
      list: [],
      currentShop: '',
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList(this.params)
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    shopHandle(val) {
      val && val.shop_id
      this.currentShop = val.shop_id
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    numberSearch(e) {
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getParams()
      this.getList(this.params)
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getList(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.date_begin
      this.params.time_start_end = this.date_end
      this.params.mobile = this.mobile
      this.params.shop_id = this.currentShop
    },
    getList(filter) {
      this.loading = true
      getFapiaoset(filter).then(response => {
        console.warn(response)
        this.list = response.data.data.list
        this.total_count = response.data.total_count
        this.loading = false
      })
    },
    stopFapiao(item, index) {
      let params = { id: 0, delete: 1 }
      params.id = item.id
      this.$confirm('确定暂停吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteSettingData(params).then(response => {
            this.list.splice(index, 1)
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
          //删除操作
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleNew() {
      // 添加发票配置
      this.$router.push({ path: this.matchRoutePath('detail') })
    }
  }
}
</script>
<style scoped lang="scss"></style>
