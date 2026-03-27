<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" icon="plus" @click="handleNew">
{{
            $t('f559bf82.11e5e6')
          }}
</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="list" style="width: 100%" :height="wheight - 140">
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$t('f559bf82.2b6bc0')">
          <template slot-scope="scope">
            <el-button type="text" @click="stopFapiao(scope.row, scope.$index)">
{{
              $t('f559bf82.8d63ef')
            }}
</el-button>
            <router-link
              :to="{
                path: matchRoutePath('detail'),
                query: { aftersales_bn: scope.row.aftersales_bn }
              }"
            >
              {{ $t('f559bf82.95b351') }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="content" :label="$t('f559bf82.29b041')" min-width="84" />
        <el-table-column prop="registration_number" :label="$t('f559bf82.ca2be5')" />
        <el-table-column prop="company_address" :label="$t('f559bf82.210c86')" />
        <el-table-column prop="company_phone" :label="$t('f559bf82.eff7dc')" />
        <el-table-column prop="tax_rate" :label="$t('f559bf82.2a79a7')" />
        <el-table-column prop="bankname" :label="$t('f559bf82.509a9d')" />
        <el-table-column prop="bankaccount" :label="$t('f559bf82.0f7f38')" />
        <el-table-column prop="user_name" :label="$t('f559bf82.68346c')" />
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
      getFapiaoset(filter).then((response) => {
        console.warn(response)
        this.list = response.data.data.list
        this.total_count = response.data.total_count
        this.loading = false
      })
    },
    stopFapiao(item, index) {
      let params = { id: 0, delete: 1 }
      params.id = item.id
      this.$confirm(this.$t('f559bf82.ed951e'), this.$t('f559bf82.02d981'), {
        confirmButtonText: this.$t('f559bf82.38cf16'),
        cancelButtonText: this.$t('f559bf82.625fb2'),
        type: 'warning'
      })
        .then(() => {
          DeleteSettingData(params).then((response) => {
            this.list.splice(index, 1)
            this.$message({
              message: this.$t('f559bf82.33130f'),
              type: 'success',
              duration: 5 * 1000
            })
          })
          //删除操作
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('f559bf82.2111cc')
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
