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
    <el-row :gutter="20">
      <el-col>
        <el-select v-model="params.profitType" placeholder="请选择">
          <el-option
            v-for="item in profitType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="params.date"
          type="month"
          value-format="yyyyMM"
          placeholder="选择月"
        />
        <el-input
          v-if="1 == params.profitType"
          v-model="params.salesperson"
          class="input-m"
          placeholder="请输入导购"
        >
          <el-button slot="append" icon="el-icon-search" @click="listSearch" />
        </el-input>
        <el-input
          v-if="2 == params.profitType"
          v-model="params.distributor"
          class="input-m"
          placeholder="请输入店铺"
        >
          <el-button slot="append" icon="el-icon-search" @click="listSearch" />
        </el-input>
        <!-- <el-input v-if="3 == params.profitType" class="input-m" v-model="params.dealer" placeholder="请输入区域经销商">
          <el-button slot="append" icon="el-icon-search" @click="listSearch"></el-button>
        </el-input> -->
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button-group>
          <el-button type="primary" @click="exportData('profit_salesperson')">
            导出导购分润
          </el-button>
          <el-button type="primary" @click="exportData('profit_distributor')">
            导出门店分润
          </el-button>
          <!-- <el-button  type="primary" @click="exportData('profit_agent')">导出经销商分润</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>

    <el-card>
      <el-table v-loading="loading" :data="list">
        <el-table-column prop="name" label="分润对象名称" min-width="240" />
        <el-table-column prop="withdrawals_fee" label="分润金额" min-width="240" />
        <el-table-column prop="date" label="分润时间" min-width="240" />
      </el-table>
      <div class="mt-4 text-right">
        <el-pagination
          background
          :current-page="params.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import shopSelect from '@/components/shopSelect'
import { getProfitStatistics, profitExport } from '../../../api/shop'

export default {
  components: {
    shopSelect
  },
  data() {
    return {
      loading: false,
      profitType: [
        {
          value: 1,
          label: '导购'
        },
        {
          value: 2,
          label: '店铺'
        }
        // {
        //   "value": 3,
        //   "label": "区域经销商",
        // },
      ],
      currentShop: '',
      list: [],
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        profitType: 1,
        distributor: '',
        salesperson: '',
        dealer: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    listSearch() {
      this.params.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getProfitStatistics(this.params).then(response => {
        this.list = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    exportData(type) {
      this.params.type = type
      if ('profit_distributor' == type) {
        this.params.profit_user_type = 2
      } else if ('profit_salesperson' == type) {
        this.params.profit_user_type = 1
      } else if ('profit_agent' == type) {
        this.params.profit_user_type = 3
      }
      this.params.page = 1
      profitExport(this.params).then(response => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
          return
        } else {
          this.$message({
            type: 'error',
            message: '无内容可导出 或 执行失败，请检查重试'
          })
          return
        }
      })
    },
    handleSizeChange(val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getList()
    }
  }
}
</script>
<style scoped lang="scss">
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
