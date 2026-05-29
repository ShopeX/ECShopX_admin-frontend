<template>
  <div class="sp-web-nav-picker bg-card text-foreground">
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      class="sp-web-nav-picker__search -mt-[12px] !bg-white !px-0"
      :form-items="searchFormItems"
      form-type="searchForm"
      label-position="top"
      @submit="onSearch"
      @reset="onReset"
    />

    <SpTable
      ref="table"
      url="/web-menus"
      class="sp-web-nav-picker__table bg-white"
      row-key="id"
      max-height="420"
      :columns="columns"
      :hooks="{ beforeSearch, afterSearch }"
      :params="searchParams"
      :selection-mode="multiple ? 'multiple' : 'single'"
      :reserve-selection="multiple"
      :selected-rows.sync="selectedRowsValue"
    />

    <div
      v-if="selectedRows.length"
      class="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
    >
      <span>已选 {{ selectedRows.length }} 个导航菜单</span>
      <el-button type="text" class="!p-0 !text-muted-foreground" @click="clearSelectedRow">
        清空
      </el-button>
    </div>
  </div>
</template>

<script>
import SpFormPlus from '@/components/sp-form-plus'
import SpTable from '@/components/sp-table'

export default {
  name: 'WebNavPicker',
  components: {
    SpFormPlus,
    SpTable
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    initialSelected: {
      type: [Object, Array],
      default: null
    }
  },
  data() {
    return {
      searchParams: {
        name: ''
      },
      selectedRow:
        !this.multiple && this.initialSelected && !Array.isArray(this.initialSelected)
          ? { ...this.initialSelected }
          : null,
      selectedMap:
        this.multiple && Array.isArray(this.initialSelected)
          ? this.createSelectedMap(this.initialSelected)
          : {}
    }
  },
  computed: {
    selectedRowsValue: {
      get() {
        return this.multiple
          ? Object.values(this.selectedMap)
          : this.selectedRow
          ? [this.selectedRow]
          : []
      },
      set(rows) {
        if (this.multiple) {
          this.selectedMap = this.createSelectedMap(rows)
          return
        }
        this.selectedRow = rows?.[0] ? this.normalizeSelectedRow(rows[0]) : null
      }
    },
    selectedRows() {
      return this.multiple
        ? Object.values(this.selectedMap)
        : this.selectedRow
        ? [this.selectedRow]
        : []
    },
    searchFormItems() {
      return [
        {
          fieldName: 'name',
          label: '菜单名称',
          component: 'input',
          componentProps: {
            placeholder: '请输入菜单名称',
            clearable: true
          }
        }
      ]
    },
    columns() {
      return [
        { name: '导航菜单', key: 'name', minWidth: 260 },
        {
          name: '菜单项',
          key: 'top_level_item_names',
          minWidth: 420,
          render: {
            functional: true,
            render: (h, { props }) =>
              h(
                'span',
                {
                  class: 'text-muted-foreground',
                  attrs: {
                    title: this.getMenuItemText(props.row)
                  }
                },
                this.getMenuItemText(props.row)
              )
          }
        }
      ]
    }
  },
  methods: {
    beforeSearch(query) {
      const params = { ...query, ...this.searchParams }
      if (params.page_size == null && params.pageSize != null) {
        params.page_size = params.pageSize
      }
      return params
    },
    afterSearch(response) {
      const list = response?.data?.data?.list || response?.data?.list || response?.list || []
      this.syncSelectedRows(list)
      return response
    },
    onSearch() {
      this.$refs.table.refresh(true)
    },
    onReset() {
      this.searchParams = { name: '' }
      this.$refs.table.refresh(true)
    },
    clearSelectedRow() {
      this.selectedRow = null
      this.selectedMap = {}
    },
    syncSelectedRows(rows = []) {
      if (!this.selectedRows.length) return
      const matchedRows = rows.filter((row) =>
        this.selectedRows.some((selected) => this.isSameMenu(row, selected))
      )
      if (!matchedRows.length) return
      if (this.multiple) {
        this.selectedMap = this.createSelectedMap(matchedRows)
        return
      }
      this.selectedRow = this.normalizeSelectedRow(matchedRows[0])
    },
    normalizeSelectedRow(row) {
      return {
        id: row.id,
        name: row.name,
        key: row.key
      }
    },
    createSelectedMap(rows = []) {
      return rows.reduce((map, row) => {
        const item = this.normalizeSelectedRow(row)
        const key = this.getMenuIdentity(item)
        if (key) map[key] = item
        return map
      }, {})
    },
    getMenuIdentity(row = {}) {
      return String(row.id ?? row.key ?? row.name ?? '').trim()
    },
    isSameMenu(row = {}, selected = {}) {
      const rowId = String(row.id ?? '').trim()
      const selectedId = String(selected.id ?? '').trim()
      if (rowId && selectedId && rowId === selectedId) return true

      const rowKey = String(row.key ?? '').trim()
      const selectedKey = String(selected.key ?? '').trim()
      if (rowKey && selectedKey && rowKey === selectedKey) return true

      const rowName = String(row.name ?? '').trim()
      const selectedName = String(selected.name ?? '').trim()
      return Boolean(rowName && selectedName && rowName === selectedName)
    },
    getMenuItemText(row) {
      const text = row.top_level_item_names ?? row.menu_item_names ?? row.item_names ?? ''
      return String(text).trim() || '—'
    },
    submit() {
      if (!this.selectedRows.length) {
        this.$message.warning(this.multiple ? '请至少选择一个导航菜单' : '请先选择一个导航菜单')
        return
      }
      this.$emit('close', this.multiple ? this.selectedRows : this.selectedRows[0])
    }
  }
}
</script>

<style scoped lang="scss">
.sp-web-nav-picker ::v-deep {
  .sp-web-nav-picker__search.sp-form-plus--actions-bottom .sp-form-plus__wrapper {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
  }
}
</style>
