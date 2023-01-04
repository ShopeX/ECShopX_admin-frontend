<template>
  <div>
    <template
      v-if="
        $route.path.indexOf('detail') === -1 &&
        $route.path.indexOf('editor') === -1 &&
        $route.path.indexOf('team') === -1
      "
    >
      <SpPlatformTip />
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addGroups">
          新增拼团活动
        </el-button>
      </div>

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <groupsList v-if="activeName === 'first'" ref="groupsList" :view="0" />
          <groupsList v-if="activeName === 'second'" :view="1" />
          <groupsList v-if="activeName === 'third'" :view="2" />
          <groupsList v-if="activeName === 'fourth'" :view="3" />
        </el-tab-pane>
      </el-tabs>
    </template>
    <router-view />
  </div>
</template>

<script>
import groupsList from './list/groupsList'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  components: {
    groupsList
  },
  data() {
    return {
      loading: false,
      view: 0,
      activeName: 'first',
      tabList: [
        { name: '全部', activeName: 'first' },
        { name: '未开始', activeName: 'second' },
        { name: '进行中', activeName: 'third' },
        { name: '已结束', activeName: 'fourth' }
      ]
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    addGroups() {
      // 添加运费模板
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    refresh() {
      this.$refs.getGroupsList
    }
  }
}
</script>

<style scoped></style>
