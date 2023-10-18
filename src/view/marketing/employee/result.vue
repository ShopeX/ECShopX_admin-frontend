<style lang="scss"></style>
<template>
  <el-result icon="success" title="创建成功" sub-title="活动创建成功，请继续为活动添加商品">
    <template slot="extra">
      <el-button type="primary" size="medium" @click="addGoods">添加商品</el-button>
      <el-button plain size="medium" @click="goActivityList">返回活动列表</el-button>
    </template>
  </el-result>
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
      this.$router.push({ path: `/marketing/employee/purchase/goods/${id}` })
    },
    goActivityList() {
      this.$router.go(-1)
    }
  }
}
</script>
