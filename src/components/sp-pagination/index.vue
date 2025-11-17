<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div v-loading="loading" class="sp-pagination">
    <div class="sp-pagination__head" />
    <div class="sp-pagination__body">
      <slot />
      <div v-if="page.total === 0 && !loading" class="sp-pagination__body-empty">
        <el-empty description="暂无数据" />
      </div>
    </div>
    <div class="sp-pagination__footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { usePagination } from '@/composables'
export default {
  name: 'SpPagination',
  props: {
    autoFetch: {
      type: Boolean,
      default: false
    },
    fetch: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  async mounted() {
    this.pagination = usePagination(this.fetch, {
      defaultParams: {},
      onBeforeFetch: () => {
        this.loading = true
      },
      onFetchFinally: state => {
        this.page.pageIndex = state.page
        this.page.pageSize = state.pageSize
        this.page.total = state.total
        this.loading = false
      }
    })
    if (this.autoFetch) {
      await this.pagination.fetchData()
    }
  },
  methods: {
    onCurrentChange(page) {
      this.pagination.onPageChange(page)
    },
    onSizeChange(size) {
      this.pagination.onPageSizeChange(size)
    },
    async refresh(boolean) {
      if (boolean) {
        this.pagination.reset()
      } else {
        // 先获取数据
        await this.pagination.fetchData()
        // 如果当前页没有数据且不是第一页,自动跳转到前一页
        if (this.pagination.state.data.length === 0 && this.pagination.state.page > 1) {
          this.pagination.state.page = this.pagination.state.page - 1
          await this.pagination.fetchData()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-pagination {
  &__body {
    min-height: 300px;
  }
  &__footer {
    text-align: right;
    padding: 10px 0;
  }
}
</style>
