<template>
  <div>
    <div>
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="客服配置"
          name="first"
        >
          <frontendTemplates
            ref="frontendTemplates"
            :get-status="frontendTemplates"
          />
        </el-tab-pane>
        <!--                <el-tab-pane label="售后配置" name="second">-->
        <!--                    <backendTemplates :get-status="backendTemplates" ref="backendTemplates"></backendTemplates>-->
        <!--                </el-tab-pane>-->
      </el-tabs>
    </div>
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
  data () {
    return {
      loading: false,
      frontendTemplates: false,
      backendTemplates: false,
      activeName: 'first',
      list: []
    }
  },
  mounted () {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    handleClick (tab, event) {
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
