<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-marketing {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .sp-finder {
    &.no-multiple {
      .sp-finder-bd {
        .el-table__fixed-header-wrapper {
          table thead {
            tr {
              th {
                &:nth-child(1) {
                  .el-checkbox {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
      .el-table__fixed-body-wrapper {
        top: 38px !important;
      }
    }
  }
  .el-pagination {
    margin: 0;
    padding: 10px;
  }
}
</style>
<template>
  <div class="picker-marketing">
    <!-- <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入页面名称" />
      </SpFilterFormItem>
    </SpFilterForm> -->
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': 460
      }"
      :data="marketingList"
      :fixed-row-action="true"
      :setting="marketingSetting"
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
  name: 'PickerPages',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择营销活动'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: ''
      },
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    marketingList() {
      const t = this.$t.bind(this)
      return [
        { id: 'groups_list', title: t('9ef219f6.f38e72') },
        { id: 'coupon_list', title: t('9ef219f6.2f3635') }
      ]
    },
    marketingSetting() {
      const t = this.$t.bind(this)
      return {
        columns: [
          { name: 'ID', key: 'id', width: 120 },
          { name: t('9ef219f6.458296'), key: 'title' }
        ]
      }
    }
  },
  created() {
    this.$options.config.title = this.$t('9ef219f6.53376a')
  },
  mounted() {
    if (this.value.data) {
      const selectRows = this.marketingList.filter((item) => this.value.data.includes(item.id))
      const { finderTable } = this.$refs.finder.$refs
      setTimeout(() => {
        finderTable.$refs.finderTable.setSelection(selectRows)
      })
    }
  },
  methods: {
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
          finderTable.$refs.finderTable.setSelection([row])
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
