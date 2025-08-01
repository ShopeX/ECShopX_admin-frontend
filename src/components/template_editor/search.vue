<template>
  <section v-if="name === 'search'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="钉在顶部">
          <el-switch v-model="config.fixTop" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <!-- <el-form-item label="开启扫码" v-if="pageType !== 'salesindex'">
          <el-switch
            v-model="config.scanCode"
            active-color="#27cc6a"
            inactive-color="#efefef">
          </el-switch>
        </el-form-item> -->
        <!-- <el-form-item label="热词搜索配置">
          <el-input type="input" v-model="config.hotword" placeholder="请输入内容"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    pageType: {
      // 页面类型：salesindex：导购货架首页
      type: String,
      default: ''
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      hotword: ''
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    // hotwordBlur(val) {
    //   //let a = val.split('\n')
    //   this.config.hotword = val
    // },
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      //&& this.config.hotword.length > 0
      // if (this.config.hotword) {
      //   this.hotword = this.config.hotword
      // }
    }
  }
}
</script>

<style scoped lang="scss"></style>
