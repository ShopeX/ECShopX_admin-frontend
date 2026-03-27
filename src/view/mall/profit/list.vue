<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <el-select v-model="params.profitType" :placeholder="$t('5d9b8e78.708c9d')">
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
          :placeholder="$t('5d9b8e78.7f83ce')"
        />
        <el-input
          v-if="1 == params.profitType"
          v-model="params.salesperson"
          class="input-m"
          :placeholder="$t('5d9b8e78.0d0256')"
        >
          <el-button slot="append" icon="el-icon-search" @click="listSearch" />
        </el-input>
        <el-input
          v-if="2 == params.profitType"
          v-model="params.distributor"
          class="input-m"
          :placeholder="$t('5d9b8e78.fe1411')"
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
            {{ $t('5d9b8e78.37f9be') }}
          </el-button>
          <el-button type="primary" @click="exportData('profit_distributor')">
            {{ $t('5d9b8e78.0371e2') }}
          </el-button>
          <!-- <el-button  type="primary" @click="exportData('profit_agent')">导出经销商分润</el-button> -->
        </el-button-group>
      </el-col>
    </el-row>

    <el-card>
      <el-table v-loading="loading" :data="list">
        <el-table-column prop="name" :label="$t('5d9b8e78.d14da4')" min-width="240" />
        <el-table-column prop="withdrawals_fee" :label="$t('5d9b8e78.2210bb')" min-width="240" />
        <el-table-column prop="date" :label="$t('5d9b8e78.3aba61')" min-width="240" />
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
import { i18n } from '@/i18n'
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
          label: i18n.t('5d9b8e78.c60b43')
        },
        {
          value: 2,
          label: i18n.t('5d9b8e78.295713')
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
      getProfitStatistics(this.params).then((response) => {
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
      profitExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('5d9b8e78.3e1ddd')
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
            message: this.$t('5d9b8e78.89ae53')
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
