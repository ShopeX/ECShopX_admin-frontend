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
      <!-- <el-table-column prop="title" label="优惠券名称" width="200"></el-table-column> -->
      <el-table-column prop="code" :label="$t('de5acab9.390c08')" width="120" />
      <el-table-column prop="username" :label="$t('de5acab9.5b95ee')" width="150" />
      <el-table-column prop="mobile" :label="$t('de5acab9.8098e2')" width="120" />
      <el-table-column prop="used_status" :label="$t('de5acab9.b63552')" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.used_status == 'callback'">
            {{ $t('de5acab9.c3cb48') }}
          </template>
          <template v-else> {{ $t('de5acab9.e7d31e') }} </template>
        </template>
      </el-table-column>
      <el-table-column prop="used_time" :label="$t('de5acab9.48188a')" width="170" />
      <el-table-column prop="shop_name" :label="$t('de5acab9.50cb5e')" />
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
        is_use: true,
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
            this.total_count = res.data.data.total_count
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
