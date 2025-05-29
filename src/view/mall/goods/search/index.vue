<template>
  <div class="ali-sms-page">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="底纹词" name="shadedWord" />
      <el-tab-pane label="热词" name="hotWord" />
      <el-tab-pane label="智能搜索" name="synonym" />
      <el-tab-pane label="无结果页配置" name="noResultPage" />
      <!-- <el-tab-pane label="榜单配置" name="searchList" /> -->
    </el-tabs>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'shadedWord'
    }
  },
  mounted() {
    const fullPath = this.$route.fullPath
    const pageNames = ['shadedWord', 'hotWord', 'synonym', 'noResultPage', 'searchList']
    let index = 0
    pageNames.some((el, id) => {
      if (fullPath.indexOf(el) > -1) {
        index = id
        return
      }
      return false
    })
    this.activeName = pageNames[index]
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
      if (tab.name == 'shadedWord') {
        this.$router.push({ path: `/entity/goodsbase/search` })
        return
      }
      this.$router.push({ path: `/entity/goodsbase/search/${tab.name}Management` })
    }
  }
}
</script>

<style scoped lang="scss">
.ali-sms-page {
  .btn {
    position: absolute;
    right: 20px;
    text-align: right;
    z-index: 999;
    .link {
      color: #999;
      font-size: 14px;
      line-height: 40px;
      &:hover {
        color: #1480e3;
      }
    }
  }
}
</style>
