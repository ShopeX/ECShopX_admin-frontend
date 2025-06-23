<template>
  <SpPage>
    <div>
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="易联云配置"
          name="first"
        >
          <yilianyunTemplates
            ref="yilianyunTemplates"
            :get-status="yilianyunTemplates"
          />
        </el-tab-pane>
        <el-tab-pane
          label="门店配置"
          name="second"
        >
          <shopPosTemplates
            ref="shopPosTemplates"
            :get-status="shopPosTemplates"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </SpPage>
</template>

<script>
import yilianyunTemplates from './setting'
import shopPosTemplates from './shop'

export default {
  components: {
    yilianyunTemplates,
    shopPosTemplates
  },
  data () {
    return {
      loading: false,
      yilianyunTemplates: false,
      shopPosTemplates: false,
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
        this.yilianyunTemplates = true
      } else if (this.activeName === 'second') {
        this.shopPosTemplates = true
      }
    }
  }
}
</script>

<style scoped></style>
