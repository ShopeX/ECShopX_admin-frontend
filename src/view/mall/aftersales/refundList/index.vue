<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <order v-if="activeName == 'order'" />
          <orderlog v-if="activeName == 'orderlog'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>
<script>
import order from './components/order'
import orderlog from './components/orderlog'
export default {
  components: {
    order,
    orderlog
  },
  data () {
    return {
      activeName: 'order',
      tabList: [
        { name: '退款单', activeName: 'order' },
        { name: '退款失败日志', activeName: 'orderlog' }
      ]
    }
  },
  mounted () {},
  methods: {
    handleTabClick: function () {}
  }
}
</script>
