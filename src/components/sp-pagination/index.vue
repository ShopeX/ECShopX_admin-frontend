<template>
  <div class="sp-pagination">
    <div class="sp-pagination__head" />
    <div class="sp-pagination__body">
      <slot />
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
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    console.log('usePagination', usePagination)
    this.pagination = usePagination(this.fetch)
    if (this.autoFetch) {
      // this.onFetch()

      this.pagination.fetchData()
    }
  },
  methods: {
    async onFetch() {
      const { total } = await this.fetch(this.page)
      debugger
      this.page.total = total
    },
    onCurrentChange(page) {
      this.pagination.onPageChange(page)
    },
    onSizeChange(size) {
      this.$emit('size-change', size)
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-pagination {
  // display: flex;
  // flex-direction: column;
  // height: 100%;
  &__body {
    min-height: 300px;
  }
  &__footer {
    text-align: right;
    padding: 10px 0;
  }
}
</style>
