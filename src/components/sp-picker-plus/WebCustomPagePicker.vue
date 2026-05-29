<template>
  <div class="sp-web-custom-page-picker bg-card text-foreground">
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      class="sp-web-custom-page-picker__search -mt-[12px] !bg-white !px-0"
      :form-items="searchFormItems"
      form-type="searchForm"
      label-position="top"
      @submit="onSearch"
      @reset="onReset"
    />

    <SpTable
      ref="table"
      url="/pctemplate/lists"
      class="sp-web-custom-page-picker__table bg-white"
      row-key="theme_pc_template_id"
      max-height="420"
      :columns="columns"
      :hooks="{ beforeSearch }"
      :params="searchParams"
      selection-mode="single"
      :selected-rows.sync="selectedRowsValue"
    />
  </div>
</template>

<script>
import SpFormPlus from '@/components/sp-form-plus'
import SpTable from '@/components/sp-table'

export default {
  name: 'WebCustomPagePicker',
  components: {
    SpFormPlus,
    SpTable
  },
  props: {
    initialSelected: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      searchParams: {
        template_title: ''
      },
      selectedRow: this.initialSelected ? { ...this.initialSelected } : null
    }
  },
  computed: {
    selectedRowsValue: {
      get() {
        return this.selectedRow ? [this.selectedRow] : []
      },
      set(rows) {
        this.selectedRow = rows?.[0] ? this.normalizeSelectedRow(rows[0]) : null
      }
    },
    searchFormItems() {
      return [
        {
          fieldName: 'template_title',
          label: '页面名称',
          component: 'input',
          componentProps: {
            placeholder: '请输入页面名称',
            clearable: true
          }
        }
      ]
    },
    columns() {
      return [
        { name: '页面名称', key: 'template_title', minWidth: 260 },
        {
          name: '页面描述',
          key: 'template_description',
          minWidth: 360,
          render: {
            functional: true,
            render: (h, { props }) =>
              h('span', { class: 'text-muted-foreground' }, props.row.template_description || '—')
          }
        }
      ]
    }
  },
  methods: {
    beforeSearch(query) {
      return { ...query, ...this.searchParams, page_type: 'custom' }
    },
    onSearch() {
      this.$refs.table.refresh(true)
    },
    onReset() {
      this.searchParams = { template_title: '' }
      this.$refs.table.refresh(true)
    },
    normalizeSelectedRow(row) {
      return {
        id: row.theme_pc_template_id ?? row.id,
        title: row.template_title ?? row.title
      }
    },
    submit() {
      if (!this.selectedRow) {
        this.$message.warning('请先选择一个自定义页面')
        return
      }
      this.$emit('close', this.selectedRow)
    }
  }
}
</script>

<style scoped lang="scss">
.sp-web-custom-page-picker ::v-deep {
  .sp-web-custom-page-picker__search.sp-form-plus--actions-bottom .sp-form-plus__wrapper {
    grid-template-columns: repeat(4, minmax(180px, 1fr));
  }
}
</style>
