<template>
  <div class="sp-table">
    <el-table
      ref="table"
      v-loading="loading"
      v-bind="tableAttrs"
      :data="tableData"
      :row-key="rowKey"
      :row-class-name="resolveRowClassName"
      border
      stripe
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-if="selectionMode !== 'none'"
        type="selection"
        align="center"
        width="55"
        :reserve-selection="reserveSelection"
      />
      <el-table-column
        v-for="column in columns"
        :key="column.key || column.prop"
        v-bind="getColumnProps(column)"
      >
        <template slot-scope="scope">
          <component
            :is="column.render"
            v-if="column.render"
            :row="scope.row"
            :column="scope.column"
            :index="scope.$index"
          />
          <span v-else>{{ formatCell(scope.row, column) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="showPager" class="sp-table__footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :page-sizes="pageSizes"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { requestClient } from '@/api/request'
import { getRowKey, isSameRow, toggleSingleSelection } from './selection.js'

function normalizeListResponse(response) {
  const payload = response?.data?.data || response?.data || response || {}
  const list = payload.list || payload.data?.list || []
  const total = payload.total_count ?? payload.count ?? payload.total ?? list.length
  return {
    list: Array.isArray(list) ? list : [],
    total: Number(total) || 0
  }
}

export default {
  name: 'SpTable',
  inheritAttrs: false,
  props: {
    url: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: null
    },
    columns: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    selectionMode: {
      type: String,
      default: 'none',
      validator: (value) => ['none', 'single', 'multiple'].includes(value)
    },
    reserveSelection: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    hooks: {
      type: Object,
      default: () => ({})
    },
    params: {
      type: Object,
      default: () => ({})
    },
    showPager: {
      type: Boolean,
      default: true
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50, 100]
    },
    pageSize: {
      type: Number,
      default: 10
    },
    rowClassName: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        page: 1,
        pageSize: this.pageSize,
        total: 0
      },
      syncingSelection: false
    }
  },
  computed: {
    tableAttrs() {
      return this.$attrs
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(value) {
        if (!Array.isArray(value)) return
        this.tableData = value
        this.pagination.total = value.length
        this.syncSelection()
      }
    },
    selectedRows: {
      deep: true,
      handler() {
        this.syncSelection()
      }
    }
  },
  mounted() {
    if (!Array.isArray(this.data)) {
      this.refresh(true)
    }
  },
  methods: {
    async refresh(force = false) {
      if (force) this.pagination.page = 1
      if (!this.url) return

      this.loading = true
      try {
        const params = this.resolveSearchParams()
        const response = await requestClient.instance.get(this.url, { params })
        const nextResponse = this.hooks.afterSearch
          ? this.hooks.afterSearch(response) || response
          : response
        const { list, total } = normalizeListResponse(nextResponse)
        this.tableData = list
        this.pagination.total = total
        this.syncSelection()
      } finally {
        this.loading = false
      }
    },
    resolveSearchParams() {
      const params = {
        ...this.params,
        page: this.pagination.page,
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize,
        page_size: this.pagination.pageSize
      }
      return this.hooks.beforeSearch ? this.hooks.beforeSearch(params) : params
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize
      this.refresh(true)
      this.$emit('size-change', pageSize)
    },
    handleCurrentChange(page) {
      this.pagination.page = page
      this.refresh()
      this.$emit('current-change', page)
    },
    handleRowClick(row, column, event) {
      if (this.selectionMode === 'single') {
        this.emitSingleSelection(toggleSingleSelection(this.selectedRows[0], row, this.rowKey))
      }
      this.$emit('row-click', row, column, event)
    },
    handleSelect(selection, row) {
      if (this.syncingSelection) return
      if (this.selectionMode === 'single') {
        const checked = selection.some((item) => isSameRow(item, row, this.rowKey))
        this.emitSingleSelection(checked ? row : null)
        return
      }
      this.$emit('update:selectedRows', selection)
      this.$emit('select', selection, row)
    },
    handleSelectAll(selection) {
      if (this.syncingSelection) return
      if (this.selectionMode === 'single') {
        this.emitSingleSelection(selection[selection.length - 1] || null)
        return
      }
      this.$emit('update:selectedRows', selection)
      this.$emit('select-all', selection)
    },
    handleSelectionChange(selection) {
      if (this.syncingSelection) return
      if (this.selectionMode !== 'multiple') return
      this.$emit('selection-change', selection)
    },
    emitSingleSelection(row) {
      const rows = row ? [row] : []
      this.$emit('update:selectedRows', rows)
      this.$emit('selection-change', rows)
      this.$nextTick(() => this.syncSelection(rows))
    },
    syncSelection(rows = this.selectedRows) {
      this.$nextTick(() => {
        const table = this.$refs.table
        if (!table) return
        this.syncingSelection = true
        table.clearSelection()
        rows.forEach((selected) => {
          const row = this.tableData.find((item) => isSameRow(item, selected, this.rowKey))
          if (row) table.toggleRowSelection(row, true)
        })
        this.$nextTick(() => {
          this.syncingSelection = false
        })
      })
    },
    clearSelection() {
      this.$emit('update:selectedRows', [])
      this.$nextTick(() => this.syncSelection([]))
    },
    getSelection() {
      return this.selectedRows
    },
    resolveRowClassName(scope) {
      const classes = []
      if (this.selectedRows.some((item) => isSameRow(item, scope.row, this.rowKey))) {
        classes.push('is-picker-selected')
      }
      if (this.rowClassName) {
        const customClass = this.rowClassName(scope)
        if (customClass) classes.push(customClass)
      }
      return classes.join(' ')
    },
    getColumnProps(column) {
      const { key, render, formatter, ...rest } = column
      return {
        prop: column.prop || key,
        label: column.label || column.name,
        ...rest
      }
    },
    formatCell(row, column) {
      if (column.formatter) return column.formatter(row[column.key], row, column)
      return row[column.key] ?? row[column.prop] ?? ''
    },
    getRowKey(row) {
      return getRowKey(row, this.rowKey)
    }
  }
}
</script>

<style scoped lang="scss">
.sp-table {
  ::v-deep {
    .el-table__row {
      cursor: pointer;
    }

    .el-table__body tr.is-picker-selected > td,
    .el-table__body tr:hover > td {
      background: hsl(var(--primary) / 0.08);
    }

    .el-table th {
      background: #f3f4f6;
      color: #606266;
      font-weight: 600;
    }
  }
}

.sp-table__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
