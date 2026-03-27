<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="$t('2ce1b5ba.a8b0c2')" name="first">
        <teamList :view="0" />
      </el-tab-pane>
      <el-tab-pane :label="$t('2ce1b5ba.8d3e8a')" name="second">
        <teamList :view="1" />
      </el-tab-pane>
      <el-tab-pane :label="$t('2ce1b5ba.1e792a')" name="third">
        <teamList :view="2" />
      </el-tab-pane>
      <el-tab-pane :label="$t('2ce1b5ba.11afd7')" name="fourth">
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
