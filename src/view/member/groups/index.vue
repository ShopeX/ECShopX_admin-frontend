<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <template
      v-if="
        $route.path.indexOf('detail') === -1 &&
        $route.path.indexOf('editor') === -1 &&
        $route.path.indexOf('team') === -1
      "
    >
      <SpPlatformTip v-if="!VERSION_SHUYUN()" />
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addGroups">
          {{ $t('7b2e18b1.2f73d2') }}
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
  </SpPage>
</template>

<script>
import groupsList from './list/groupsList'

export default {
  components: {
    groupsList
  },
  provide() {
    return {
      refresh: this.refresh
    }
  },
  data() {
    return {
      loading: false,
      view: 0,
      activeName: 'first'
    }
  },
  computed: {
    tabList() {
      return [
        { name: this.$t('7b2e18b1.a8b0c2'), activeName: 'first' },
        { name: this.$t('7b2e18b1.dd4e55'), activeName: 'second' },
        { name: this.$t('7b2e18b1.fb852f'), activeName: 'third' },
        { name: this.$t('7b2e18b1.047fab'), activeName: 'fourth' }
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
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    refresh() {
      this.$refs.getGroupsList
    }
  }
}
</script>

<style scoped></style>
