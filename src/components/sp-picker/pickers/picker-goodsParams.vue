<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-goods-params {
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
  .attribute-values-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    max-width: 100%;
    /* 隐藏滚动条 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 和 Edge */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }
}
</style>
<template>
  <div class="picker-goods-params">
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/goods/attributes"
      show-pager-text="已选中：${n}"
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      reserve-selection
      row-key="attribute_id"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
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
      loading: false,
      multiple: (this.value && this.value.multiple !== undefined) ? this.value.multiple : true
    }
  },
  computed: {
    setting() {
      return createSetting({
        columns: [
          {
            name: '名称',
            key: 'attribute_name',
            width: 160,
            render: (h, scope) => {
              const { attribute_type } = this.value.queryParams
              const { attribute_name, is_image } = scope.row
              return h('div', {}, [
                h('span', {}, attribute_name),
                attribute_type == 'item_spec' &&
                  is_image == 'true' &&
                  h(
                    'el-tag',
                    {
                      style: {
                        'margin-right': '10px'
                      },
                      props: {
                        size: 'mini'
                      }
                    },
                    '图片'
                  )
              ])
            }
          },
          {
            name: '属性值',
            key: 'attribute_values',
            render: (h, scope) => {
              const { list } = scope.row.attribute_values
              return h(
                'div',
                {
                  class: 'attribute-values-scroll'
                },
                list.map((item, index) => {
                  return h(
                    'el-tag',
                    {
                      style: {
                        'margin-right': '10px',
                        'flex-shrink': '0'
                      },
                      props: {
                        size: 'mini'
                      }
                    },
                    item.attribute_value
                  )
                })
              )
            }
          }
        ]
      })
    }
  },
  created() {
    // this.fetch()
  },
  methods: {
    beforeSearch(params) {
      const { queryParams } = this.value
      params = {
        ...params,
        ...queryParams
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        // 统一转换为字符串类型 不然incluses匹配不到
        let dataArrayString = this.value.data.map(item => String(item))
        
        const selectRows = list.filter(item => dataArrayString.includes(String(item.attribute_id)))
        const { finderTable } = this.$refs.finder.$refs
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
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
