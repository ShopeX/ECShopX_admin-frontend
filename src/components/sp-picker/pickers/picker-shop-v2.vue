<style lang="scss">
.picker-shop {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .disableheadselection {
    > .cell .el-checkbox__inner {
      display: none;
    }
  }
  .el-pagination {
    margin: 0;
    padding: 10px;
  }
}
</style>
<template>
  <div class="picker-shop">
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/distributors"
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerShop',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择店铺'
  },
  props: ['value'],
  data() {
    return {
      regionArea: [],
      loading: false,
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    setting() {
      return {
        search: [
          { key: 'distributor_id', name: '', placeholder: '请输入店铺编号' },
          { key: 'name', name: '', placeholder: '请输入店铺名称' }
        ],
        columns: [
          {
            name: '店铺ID',
            key: 'shop_code'
          },
          {
            name: '所属区域',
            key: 'regionauth_name'
          },
          {
            name: '店铺名称',
            key: 'name'
          },
          {
            name: '店铺地址',
            key: 'store_address'
          },
          {
            name: '店铺分类',
            key: 'shop_cate'
          },
          {
            name: '是否展示',
            key: 'isshow'
          },
          {
            name: '状态',
            key: 'audit_status'
          }
        ]
      }
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        distribution_type: this.value?.distribution_type,
        regionauth_id: this.value?.regionauth_id,
        ...(this.value?.params || {})
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const selectRows = list?.filter((item) => this.value?.data?.includes(item.distributor_id))
        const { finderTable } = this.$refs.finder.$refs
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onSelect(selection, row) {
      if (this.multiple) {
        // this.updateVal(selection)
      } else {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
          // this.updateVal([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
