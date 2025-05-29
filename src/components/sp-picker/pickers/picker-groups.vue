<style lang="scss">
.picker-goods {
  .sp-filter-form {
    padding: 8px 8px 0 8px;
  }

  .sp-finder-hd {
    display: none;
  }

  .sp-finder-hd {
    display: none;
  }

  .item-info {
    display: flex;

    .item-image {
      width: 60px;
      margin-right: 8px;
    }

    .sp-image {
      margin-right: 10px;
    }

    .item-name {
      color: #333;
      margin-top: 4px;
    }
  }

  .el-table {
    td {
      padding: 0;
    }
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
  <div class="picker-goods">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="regionauth_id">
        <el-select v-model="formData.regionauth_id" placeholder="请选择活动区域" clearable disabled>
          <el-option
            v-for="item in regionauthList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" clearable placeholder="请输入活动名称" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      reserve-selection
      row-key="groups_activity_id"
      :other-config="{
        'max-height': 416,
        'header-cell-class-name': cellClass
      }"
      url="promotions/groups"
      :show-pager-text="`已选中：${localSelection.length}`"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: '活动ID', key: 'groups_activity_id', width: 80 },
          {
            name: '活动名称',
            key: 'act_name',
            render: (h, { row }) =>
              h('div', { class: 'item-info' }, [h('div', { class: 'item-name' }, row.act_name)])
          },
          {
            name: '活动时间',
            key: 'start_time',
            render: (h, { row }) =>
              h(
                'span',
                {},
                this.getCardValidate(row.begin_time, row.end_time)
              )
          },
          {
            name: '活动状态',
            key: 'status',
            width: 80,
            render: (h, { row }) => h('span', {}, this.getStatus(row.activity_status))
          }
        ]
      }"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      @select="onSelect"
      @select-all="handleSelectAll"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { cloneDeep } from 'lodash'
import BasePicker from './base'
import PageMixin from '../mixins/page'
import { getRegionauthId } from '@/utils'
export default {
  name: 'PickerGoods',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择拼团'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: '',
        regionauth_id: ''
      },
      list: [],
      multipleSelection: [],
      regionauthList: [],
      multiple: this.value?.multiple ?? true,
      localSelection: []
    }
  },
  created() {
    this.localSelection = cloneDeep(this.value.data) || []
    this.formData.regionauth_id = this.value?.params?.regionauth_id || getRegionauthId()
  },
  mounted() {
    this.getRegionauthList()
  },
  methods: {
    getCardValidate(beginDate, endDate) {
      return `${moment(beginDate * 1000).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(
        endDate * 1000
      ).format('YYYY-MM-DD HH:mm:ss')}`
    },
    getStatus(status) {
      if (status == 1) {
        return '未开始'
      } else if (status == 2) {
        return '进行中'
      } else {
        return '已结束'
      }
    },
    beforeSearch(params) {
      params = {
        ...params,
        ...this.formData,
        view: 2, //活动开始
        regionauth_id: getRegionauthId(),
        ...(this.value?.params || {})
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.localSelection.length > 0) {
        const { finderTable } = this.$refs.finder.$refs
        const ids = this.localSelection.map((m) => m.groups_activity_id)
        const selectRows = list.filter((item) => ids.includes(item.groups_activity_id))
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onReset() {
      this.$refs.finder.refresh(true)
    },
    onSearch() {
      this.$refs.finder.initData(true)
    },
    onSelect(selection, row) {
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        finderTable.clearSelection()
        this.localSelection = [row]
        this.$nextTick(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
        })
      } else {
        const isAdd = selection.includes(row)
        const idx = this.localSelection.findIndex((f) => f.groups_activity_id === row.groups_activity_id)

        if (isAdd && idx === -1) {
          this.localSelection.push(row)
        } else if (!isAdd && idx !== -1) {
          this.localSelection.splice(idx, 1)
        }
      }
      this.localSelection = this.localSelection.filter((item) => item.groups_activity_id)
      this.updateVal(this.localSelection)
    },
    /**
     * @description 全选只针对当前页 那么在状态改变的时候 应该不考虑未来的选中数据
     * @description 循环调用 onSelect 方法保存或删除当前页选中数据
     * @param list 当前页勾选数据 如果localSelection存在未来页数据 那么页码切换的时候 list中也会有
     */
    async handleSelectAll(list) {
      const { finderTable } = this.$refs.finder.$refs
      const currentPageData = finderTable.$refs.finderTable.list
      const currentPageDataIds = currentPageData.map((m) => m.groups_activity_id)

      // 获取当前页面已选中的数据
      const currentPageSelectList = list.filter((item) =>
        currentPageDataIds.includes(item.groups_activity_id)
      )

      // 先移除当前页的所有选中项
      this.localSelection = this.localSelection.filter(
        (item) => !currentPageDataIds.includes(item.groups_activity_id)
      )

      // 如果有选中项，则添加到 localSelection
      if (currentPageSelectList.length > 0) {
        this.localSelection.push(...currentPageData)
      }

      this.updateVal(this.localSelection)

      // 更新表格选中状态
      this.$nextTick(() => {
        if (currentPageSelectList.length > 0) {
          finderTable.$refs.finderTable.setSelection(currentPageData)
        } else {
          finderTable.$refs.finderTable.clearSelection()
        }
      })
    },
    isShowFormItem(key) {
      const { paramsFieldExclude = [] } = this.value
      return !paramsFieldExclude.includes(key)
    },
    async getRegionauthList() {
      const res = await this.$api.regionauth.getRegionauth()
      this.regionauthList = res.list.map((item) => ({
        label: item.regionauth_name,
        value: item.regionauth_id
      }))
    }
  }
}
</script>
