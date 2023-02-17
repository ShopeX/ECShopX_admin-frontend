<template>
  <div>
    <el-select
      v-model="selectValue"
      placeholder="请选择活动"
    >
      <el-option
        v-for="(item, index) in selectList"
        :key="index"
        :label="item.activity_name"
        :value="item.seckill_id"
      />
    </el-select>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { seckillActivityGetList } from '@/api/promotions'

export default {
  name: 'AttrSelect',
  data() {
    return {
      selectList: [],
      selectValue: ''
    }
  },
  props: ['value', 'type'],
  watch: {
    value: {
      handler(val) {
        this.selectValue = val
      },
      deep: true,
      immediate: true
    },
    type: {
      handler(nVal, oVal) {
        if (nVal === 'seckill') {
          this.getSeckillActivityList()
        } else if (nVal === 'limitTimeSale') {
          this.getLimitTimeSaleList()
        }
        if (oVal && nVal != oVal) {
          this.$emit('input', '')
        }
      },
      deep: true,
      immediate: true
    },
    selectValue: {
      handler (nVal) {
        this.$emit('input', nVal)
      }
    }
  },
  methods: {
    async getSeckillActivityList () {
      await seckillActivityGetList({
        page: 1,
        pageSize: 20,
        status: 'not_end'
      }).then((response) => {
        this.selectList = response.data.data.list || []
      })
    },
    async getLimitTimeSaleList () {
      await seckillActivityGetList({
        page: 1,
        pageSize: 20,
        status: 'valid',
        seckill_type: 'limited_time_sale'
      }).then((response) => {
        this.selectList = response.data.data.list || []
      })
    }
  }
}
</script>
