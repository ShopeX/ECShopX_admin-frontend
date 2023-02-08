<style lang="scss">
.picker-path {
  .el-tabs--left .el-tabs__header.is-left {
    margin-right: 0;
  }
  .sp-finder {
    margin-left: 1px;
  }
}
</style>
<template>
  <div class="picker-path">
    {{ value }}
    <el-tabs v-model="tabValue" :tab-position="'left'">
      <el-tab-pane label="商品" name="goods">
        <PickerGoods v-if="tabValue == 'goods'" ref="goods" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="店铺" name="store">
        <PickerShop v-if="tabValue == 'store'" ref="store" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="销售分类" name="salesCategory">角色管理</el-tab-pane>
      <el-tab-pane label="管理分类" name="category">角色管理</el-tab-pane>
      <el-tab-pane label="商品标签" name="tag">定时任务补偿</el-tab-pane>
      <el-tab-pane label="文章" name="article">定时任务补偿</el-tab-pane>
      <el-tab-pane label="软文">定时任务补偿</el-tab-pane>
      <el-tab-pane label="页面">定时任务补偿</el-tab-pane>
      <el-tab-pane label="营销">定时任务补偿</el-tab-pane>
      <el-tab-pane label="活动报名" name="regactivity">
        <PickerRegactivity v-if="tabValue == 'regactivity'" ref="regactivity" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="秒杀" name="seckill">
        <PickerSeckill v-if="tabValue == 'seckill'" ref="seckill" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="自定义页面" name="custom_page">
        <PickerPages v-if="tabValue == 'custom_page'" ref="custom_page" :value="value" />
      </el-tab-pane>
      <el-tab-pane label="直播">定时任务补偿</el-tab-pane>
      <el-tab-pane label="外部小程序" name="other_wxapp">
        <PickerWxApp v-if="tabValue == 'other_wxapp'" ref="other_wxapp" :value="value" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { pickBy } from '@/utils'
import BasePicker from './base'
import PickerGoods from './picker-goods'
import PickerShop from './picker-shop'
import PickerSeckill from './picker-seckill'
import PickerRegactivity from './picker-regactivity'
import PickerPages from './picker-pages'
import PickerWxApp from './picker-wxapp'
export default {
  name: 'PickerPath',
  components: {
    PickerGoods,
    PickerShop,
    PickerSeckill,
    PickerRegactivity,
    PickerPages,
    PickerWxApp
  },
  // extends: BasePicker,
  config: {
    title: '设置路径'
  },
  props: ['value'],
  data() {
    const { tab } = this.value
    return {
      pathValue: null,
      tabValue: tab || 'goods'
    }
  },
  created() {
    this.pathValue = this.value
  },
  methods: {
    getVal() {
      const { data } = this.$refs[this.tabValue].getVal()
      const [{ id, title }] = this.resolveData(data)
      return {
        linkPage: this.tabValue,
        title,
        id
      }
    },
    resolveData(data) {
      const doc = {
        goods: () => {
          return pickBy(data, {
            id: 'itemId',
            title: 'itemName'
          })
        },
        store: () => {
          return pickBy(data, {
            id: 'distributor_id',
            title: 'name'
          })
        },
        seckill: () => {
          return pickBy(data, {
            id: 'seckill_id',
            title: 'activity_name'
          })
        },
        custom_page: () => {
          return pickBy(data, {
            id: 'id',
            title: 'page_name'
          })
        },
        other_wxapp: () => {
          return pickBy(data, {
            id: 'wx_external_routes_id',
            title: 'route_info'
          })
        }
      }
      return doc[this.tabValue]()
    }
  }
}
</script>
