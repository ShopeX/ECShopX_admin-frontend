<template>
  <div>
    <template>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <frontendTemplates ref="frontendTemplates" :get-status="frontendTemplates" />
        </el-tab-pane>
      </el-tabs>
    </template>
    <router-view />
  </div>
</template>

<script>
import frontendTemplates from './frontend'
import backendTemplates from './backend'

export default {
  components: {
    frontendTemplates,
    backendTemplates
  },
  data() {
    return {
      loading: false,
      frontendTemplates: false,
      backendTemplates: false,
      activeName: 'first',
      list: [],
      tabList: [{ name: '客服配置', activeName: 'first' }]
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.frontendTemplates = true
      } else if (this.activeName === 'second') {
        this.backendTemplates = true
      }
    }
  }
}
</script>

<style scoped></style>
