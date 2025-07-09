<style lang="scss">
.picker-seckill {
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
  <div class="picker-seckill">
    <!-- <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="regionauth_id">
        <el-input v-model="formData.regionauth_id" placeholder="请选择选择区域" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="activity_id">
        <el-input v-model="formData.activity_id" placeholder="请输入活动id" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="activity_name">
        <el-input v-model="formData.activity_name" placeholder="请输入活动名称" />
      </SpFilterFormItem>
    </SpFilterForm> -->
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/promotions/getturntableList"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'id', width: '80' },
          { name: '活动名称', key: 'activity_name' }
          // {
          //   name: '活动区域',
          //   key: 'regionauth_name'
          // },
          // {
          //   name: '抽奖形式',
          //   key: 'activity_type',
          //   render(_, { row }) {
          //     const lotteryMap = {
          //       wheel: '大转盘',
          //       slotMachine: '老虎机',
          //       nineGrid: '九宫格'
          //     }
          //     return lotteryMap[row.activity_type]
          //   }
          // },
          // {
          //   name: '状态',
          //   key: 'status',
          //   render(_, { row }) {
          //     const status_map = {
          //       notstart: '未开始',
          //       expire: '已过期',
          //       online: '进行中'
          //     }
          //     return status_map[row.status]
          //   }
          // },
          // {
          //   name: '活动时间',
          //   key: 'begin_time',
          //   render(_, { row }) {
          //     return `${moment(row.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss')} - ${moment(
          //       row.end_time * 1000
          //     ).format('YYYY-MM-DD HH:mm:ss')}`
          //   }
          // }
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
import api from '@/api'
import moment from 'moment'

export default {
  name: 'PickerLottery',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择抽奖活动'
  },
  props: ['value'],
  data() {
    const { queryParams } = this.value
    const defaultParams = {
      regionauth_id: '',
      activity_id: '',
      activity_name: ''
    }
    const formData = Object.assign(defaultParams, queryParams)
    return {
      formData,
      multiple: this.value?.multiple ?? true,
      areas: []
    }
  },
  created() {
    this.getAreas()
  },
  methods: {
    moment,
    getAreas() {
      api.regionauth.getRegionauth().then(res => {
        this.areas = res?.list?.map(el => ({
          value: el.regionauth_id,
          label: el.regionauth_name
        }))
      })
    },
    beforeSearch(params) {
      params = {
        ...params,
        ...this.formData,
        ...(this.value?.params || {})
      }
      return params
    },
    afterSearch(response) {
      const { list = [] } = response.data.data
      const _data = this.value?.data || []
      if (_data?.length) {
        const selectRows = list.filter(item => _data?.includes(item.id))
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
    }
  }
}
</script>
