<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="search-bar">
      <el-input
        v-model="params.mobile"
        clearable
        style="width: 240px"
        :placeholder="$t('ff557c54.6e4f4b')"
        @keyup.enter.native="onSearch"
        @clear="onSearch"
      />
      <el-button type="primary" @click="onSearch">{{ $t('223cc8af.e5f71f') }}</el-button>
    </div>
    <el-table v-loading="loading" :data="cardList" style="width: 100%" border height="600">
      <el-table-column prop="username" :label="$t('7c2974e3.5b95ee')" />
      <el-table-column prop="mobile" :label="$t('7c2974e3.8098e2')" />
      <el-table-column :label="$t('7c2974e3.22d47e')">
        <template slot-scope="scope">
          <span v-if="'0' != scope.row.get_date">{{
            scope.row.get_date | datetime('YYYY-MM-DD HH:mm:ss')
          }}</span>
          <span v-else>{{ $t('7c2974e3.4dd976') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="source_type" :label="$t('7c2974e3.a9c8c6')" />
    </el-table>
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
</template>

<script>
import { getCardUserList } from '../../../../api/cardticket'

export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      total_count: 0,
      cardList: [],
      params: {
        card_id: 0,
        mobile: '',
        page: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getCardUserList()
      }
    }
  },
  mounted() {
    if (this.$route.query.cardId) {
      this.params.card_id = this.$route.query.cardId
    }
  },
  methods: {
    onSearch() {
      this.params.page = 1
      this.getCardUserList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getCardUserList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getCardUserList()
    },
    getCardUserList() {
      this.loading = true
      getCardUserList(this.params)
        .then((res) => {
          if (res.data.data.list.length > 0) {
            this.cardList = res.data.data.list
            this.total_count = res.data.data.count
            this.loading = false
          } else {
            this.cardList = []
            this.loading = false
          }
        })
        .catch((error) => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
</style>
