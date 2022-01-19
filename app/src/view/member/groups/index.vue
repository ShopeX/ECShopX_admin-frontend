<template>
  <div>
    <div
      v-if="
        $route.path.indexOf('detail') === -1 &&
          $route.path.indexOf('editor') === -1 &&
          $route.path.indexOf('team') === -1"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" icon="plus" @click="addGroups">新增拼团活动</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="全部" name="first">
          <groupsList :view="0" ref="groupsList"></groupsList>
        </el-tab-pane>
        <el-tab-pane label="未开始" name="second">
          <groupsList :view="1"></groupsList>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="third">
          <groupsList :view="2"></groupsList>
        </el-tab-pane>
        <el-tab-pane label="已结束" name="fourth">
          <groupsList :view="3"></groupsList>
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view></router-view>
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
      list: []
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
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  }
}
</script>

<style scoped></style>
