<template>
  <div>
    <div>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="发票配置" name="first">
          <fapiaoTemplates :get-status="fapiaoTemplates" ref="fapiaoTemplates"></fapiaoTemplates>
        </el-tab-pane>
        <el-tab-pane label="航信配置" name="second">
          <hangxinemplates :get-status="hangxinemplates" ref="hangxinemplates"></hangxinemplates>
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import hangxinemplates from './hangxin'
import fapiaoTemplates from './fapiaoset'

export default {
  components: {
    hangxinemplates,
    fapiaoTemplates
  },
  data() {
    return {
      loading: false,
      hangxinemplates: false,
      fapiaoTemplates: false,
      activeName: 'first',
      list: []
    }
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.hangxinemplates = true
      } else if (this.activeName === 'second') {
        this.fapiaoTemplates = true
      }
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
