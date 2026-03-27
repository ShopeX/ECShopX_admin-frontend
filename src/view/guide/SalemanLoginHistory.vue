<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row class="head">
      <shop-select distributors @update="storeChange" @init="initChange" />
      <el-input
        v-model="params.mobile"
        :placeholder="$t('1c209317.f1ba67')"
        class="input"
        clearable
        @clear="clearparams('mobile')"
      >
        <el-button slot="append" icon="el-icon-search" @click="resetSearch" />
      </el-input>
      <el-input
        v-model="params.name"
        :placeholder="$t('1c209317.b2614d')"
        class="input"
        clearable
        @clear="clearparams('name')"
      >
        <el-button slot="append" icon="el-icon-search" @click="resetSearch" />
      </el-input>
      <el-date-picker
        v-model="date"
        type="datetimerange"
        :placeholder="$t('1c209317.4b8cb9')"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="timestamp"
        @change="dateChange"
      />
    </el-row>
    <el-card>
      <el-table v-loading="loading" :data="list">
        <el-table-column
          prop="sign_type"
          :label="$t('1c209317.226b09')"
          :formatter="signTypeFormatter"
        />
        <el-table-column prop="name" :label="$t('1c209317.cf6d0a')" />
        <el-table-column prop="mobile" :label="$t('1c209317.d3ef8d')" />
        <el-table-column prop="shop_name" :label="$t('1c209317.a6cf26')" />
        <el-table-column prop="updated" :label="$t('1c209317.7e951d')" />
        <!-- <el-table-column label="备注"></el-table-column> -->
      </el-table>
    </el-card>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSalespersonLoginLog } from '@/api/shop'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  data() {
    return {
      list: [],
      total_count: 0,
      loading: false,
      salesman_id: '',
      date: [],
      params: {
        page: 1,
        pageSize: 20,
        mobile: '',
        name: '',
        distributor_id: '',
        time_start_begin: '',
        time_start_end: ''
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
    addSelectStoreChange(data) {
      this.form.distributor_id = data.shop_id
    },
    storeChange(params) {
      params && params.shop_id
      this.params.distributor_id = params.shop_id
      this.params.page = 1
      this.getList()
    },
    initChange() {
      this.shopId = ''
    },
    resetSearch() {
      this.params.page = 1
      this.getList()
    },
    clearparams(key) {
      this.params[key] = ''
      this.resetSearch()
    },
    dateChange() {
      if (this.date) {
        this.params.time_start_begin = this.date[0] / 1000
        this.params.time_start_end = this.date[1] / 1000
      } else {
        this.params.time_start_begin = ''
        this.params.time_start_end = ''
      }
      this.resetSearch()
    },
    signTypeFormatter(row, column, cellValue) {
      const keyMap = {
        signin: '1c209317.c9da9b',
        signout: '1c209317.61d1ef',
        forceout: '1c209317.aaeed4'
      }
      return this.$t(keyMap[cellValue] || '1c209317.485d34')
    },
    getList() {
      this.loading = true
      getSalespersonLoginLog(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = Number(response.data.data.total_count)
        }
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.head {
  .input {
    width: 260px;
  }
}
</style>
