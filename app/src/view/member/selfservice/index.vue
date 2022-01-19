<template lang="html">
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="表单模板" name="first">
      <formTemplate :get-status="formTemplate" ref="formTemplate"></formTemplate>
    </el-tab-pane>
    <el-tab-pane label="表单配置项" name="second">
      <formSetting :get-status="formSetting"></formSetting>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import formTemplate from './formtemplatelist.vue'
import formSetting from './formsettinglist.vue'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  components: {
    formTemplate,
    formSetting
  },
  data() {
    return {
      activeName: 'first',
      formSetting: false,
      formTemplate: false
    }
  },
  methods: {
    //充值送钱
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.formSetting = true
      } else if (this.activeName === 'second') {
        this.formTemplate = true
      }
    },
    refresh() {
      this.$refs.getDataList
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'first') {
      this.formSetting = true
    } else if (this.activeName === 'second') {
      this.formTemplate = true
    }
  }
}
</script>

<style scoped lang="scss"></style>
