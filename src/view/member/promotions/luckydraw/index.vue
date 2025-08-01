<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="primary" icon="plus" @click="addLuckyDraw"> 新增抽奖活动 </el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="plus" @click="addLuckyDrawShow">
          设置抽奖活动图片
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="plus" @click="addLuckyDrawRule"> 设置抽奖规则 </el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="全部" name="first">
        <groupsList :view="0" />
      </el-tab-pane>
      <el-tab-pane label="未开始" name="second">
        <groupsList :view="1" />
      </el-tab-pane>
      <el-tab-pane label="进行中" name="third">
        <groupsList :view="2" />
      </el-tab-pane>
      <el-tab-pane label="已结束" name="fourth">
        <groupsList :view="3" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import groupsList from './list/luckyDrawList'

export default {
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
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    addLuckyDraw() {
      // 添加运费模板
      this.$router.push({ path: '/member/marketing/luckydraw/add' })
    },
    addLuckyDrawShow() {
      this.$router.push({ path: '/member/marketing/luckydraw/show' })
    },
    addLuckyDrawRule() {
      this.$router.push({ path: '/member/marketing/luckydraw/rules' })
    }
  }
}
</script>

<style scoped></style>
