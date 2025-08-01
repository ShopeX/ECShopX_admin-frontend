<template lang="html">
  <div>
    <el-tabs
      v-if="$route.path.indexOf('editor') === -1"
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="基础物料" name="first">
        <service :get-status="service" />
      </el-tab-pane>
      <el-tab-pane label="商品" name="second">
        <goods ref="goods" :get-status="goods" />
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>

<script>
import goods from './items/list.vue'
import service from './servicelabels/list.vue'

export default {
  provide() {
    return {
      refresh: this.getGoodsList
    }
  },
  components: {
    goods,
    service
  },
  data() {
    return {
      activeName: 'first',
      service: false,
      goods: false
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'first') {
      this.service = true
    } else if (this.activeName === 'second') {
      this.goods = true
    }
  },
  methods: {
    //充值送钱
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.service = true
      } else if (this.activeName === 'second') {
        this.goods = true
      }
    },
    getGoodsList() {
      this.$refs.getGoodsList
    }
  }
}
</script>

<style scoped lang="scss"></style>
