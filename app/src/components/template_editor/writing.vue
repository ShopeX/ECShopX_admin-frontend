<template>
  <section v-if="name === 'writing'" class="section">
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="base.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle"></el-input>
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef">
          </el-switch>
        </el-form-item>
        <el-form-item label="布局">
          <el-radio-group v-model="config.align">
            <el-radio label="left">居左</el-radio>
            <el-radio label="center">居中</el-radio>
            <el-radio label="right">居右</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文本内容">
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="data[0].content"
          ></el-input>
        </el-form-item>
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
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: []
    }
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss"></style>
