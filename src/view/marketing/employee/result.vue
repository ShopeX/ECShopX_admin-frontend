<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
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
