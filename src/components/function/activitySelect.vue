<template>
  <div class="crowd-select">
    <el-button size="mini" :disabled="disabled" @click="handleSelect">关联活动</el-button>

    <SpFinder
      v-if="selectedActivity && selectedActivity.length > 0"
      ref="finder"
      :data="selectedActivity"
      :fixed-row-action="true"
      :no-selection="true"
      :show-pager="false"
      :setting="setting"
    />
  </div>
</template>

<script>
// 关联活动
import moment from 'moment'
import { createSetting } from '@shopex/finder'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hasArea: {
      type: Boolean,
      default: false
    },
    areaId:[String, Number]
  },
  data() {
    return {
      setting: createSetting({
        actions: [
          {
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                console.log(row)
                this.handleDelete(row)
              }
            }
          }
        ],
        columns: [
          { name: 'ID', key: 'seckill_id' },
          {
            name: '活动名称',
            key: 'activity_name'
          },
          {
            name: '活动时间',
            key: 'activity_start_date',
            formatter: (value, row, col) => {
              return `${row.activity_start_date} ~ ${row.activity_end_date}`
            }
          },
          { name: '创建时间', key: 'created_date' }
        ]
      })
    }
  },
  computed: {
    selectedActivity: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleDelete({seckill_id}) {
      const newValue = [...this.selectedActivity]
      const idx = newValue.findIndex(item=>item.seckill_id == seckill_id)
      if(idx == -1)return
      newValue.splice(idx, 1)
      this.selectedActivity = newValue
    },
    async handleSelect() {
      if (this.hasArea && !this.areaId) {
        this.$message.warning('请选择区域')
        return
      }
      const { data } = await this.$picker.activity({data:this.selectedActivity,regionauth_id: this.areaId})
      if (data) {
        this.selectedActivity = data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.crowd-select {
  .selected-crowds {
    margin-top: 10px;
    .el-tag {
      margin-right: 10px;
      margin-bottom: 5px;
      border: none !important;
    }
  }
}
</style>
