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
<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="全部" name="first">
        <teamList :view="0" />
      </el-tab-pane>
      <el-tab-pane label="拼团中" name="second">
        <teamList :view="1" />
      </el-tab-pane>
      <el-tab-pane label="拼团成功" name="third">
        <teamList :view="2" />
      </el-tab-pane>
      <el-tab-pane label="拼团失败" name="fourth">
        <teamList :view="3" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import teamList from './list/teamList'

export default {
  components: {
    teamList
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
  methods: {}
}
</script>

<style scoped></style>
