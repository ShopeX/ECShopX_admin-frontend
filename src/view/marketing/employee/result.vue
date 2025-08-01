<style lang="scss"></style>
<template>
  <SpPage>
    <el-result icon="success" title="创建成功" sub-title="活动创建成功，请继续为活动添加商品">
      <template slot="extra">
        <el-button type="primary" size="medium" @click="addGoods">添加商品</el-button>
        <el-button plain size="medium" @click="goActivityList">返回活动列表</el-button>
      </template>
    </el-result>
  </SpPage>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  created() {},
  methods: {
    addGoods() {
      const { id } = this.$route.params
      const resUrl = this.$route.path.split('result')[0] + 'goods/' + id
      this.$router.push({ path: resUrl })
    },
    goActivityList() {
      this.$router.go(-1)
    }
  }
}
</script>
