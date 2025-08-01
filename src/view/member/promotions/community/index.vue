<template lang="html">
  <div>
    <el-tabs
      v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1"
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="社区列表" name="first">
        <alllist ref="alllist" :get-status="alllist" />
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>

<script>
import alllist from './list.vue'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  components: {
    alllist
  },
  data() {
    return {
      activeName: 'first',
      alllist: true
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'first') {
      this.alllist = true
    }
  },
  methods: {
    //充值送钱
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.alllist = true
      }
    },
    refresh() {
      this.$refs.getCommunitysList
    }
  }
}
</script>

<style scoped lang="scss"></style>
