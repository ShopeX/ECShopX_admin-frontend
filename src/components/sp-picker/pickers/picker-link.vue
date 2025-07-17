<style lang="scss">
.picker-link {
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
  <div class="picker-link">
    <!-- <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入页面名称" />
      </SpFilterFormItem>
    </SpFilterForm> -->
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        height: 460
      }"
      :data="list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'id', width: 120 },
          { name: '页面名称', key: 'title' }
        ]
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
    title: '选择页面'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: ''
      },
      list: [
        { id: 'vipgrades', title: '会员开通' },
        { id: 'applyChief', title: '社区团长申请' },
        { id: 'recharge', title: '储值卡' },
        { id: 'purchase', title: '内购' },
        { id: 'pointShop', title: '积分商城' },
        { id: 'registActivity', title: '报名活动' },
        { id: 'customerService', title: '客服' },
        { id: 'search', title: '搜索' },
      ],
      multiple: this.value?.multiple ?? true
    }
  },
  created() {},
  mounted() {
    if (this.value.data) {
      const selectRows = this.list.filter((item) => this.value.data.includes(item.id))
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
