<style lang="scss">
.picker-wxapp {
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
  <div class="picker-wxapp">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="region">
        <el-select v-model="formData.approve_status" clearable placeholder="请选择小程序">
          <el-option
            v-for="item in wxappList"
            :key="item.value"
            :label="item.title"
            size="mini"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :class="[{ 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': 460
      }"
      url="/wxexternalconfig/list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: '小程序名称', key: 'app_name' },
          { name: 'appid', key: 'app_id' },
          { name: '页面名称', key: 'route_name' },
          { name: '页面路径', key: 'route_info' }
        ]
      }"
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
  name: 'PickerWxapp',
  extends: BasePicker,
  mixins: [PageMixin],
  data() {
    return {
      formData: {},
      wxappList: [],
      multiple: this.value?.multiple ?? true
    }
  },
  created() {
    this.getOtherWxapp()
  },
  methods: {
    beforeSearch() {},
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const selectRows = list.filter(item => this.value.data.includes(item.wx_external_routes_id))
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
          finderTable.$refs.finderTable.setSelection([row])
          // this.updateVal([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    },
    async getOtherWxapp() {
      const { list } = await this.$api.wxa.getWxLinkListSetting()
      this.wxappList = list.map(({ app_id, app_name }) => {
        return {
          title: app_name,
          value: app_id
        }
      })
    }
  }
}
</script>
