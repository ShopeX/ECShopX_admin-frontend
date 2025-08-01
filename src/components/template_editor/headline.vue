<template>
  <section v-if="name === 'headline' || name === 'banner'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <template v-if="type == 'wxapp'">
          <el-form-item label="标题">
            <el-input v-model="base.title" />
          </el-form-item>
          <el-form-item label="文字位置">
            <el-radio-group v-model="base.float">
              <el-radio label="center"> 居中 </el-radio>
              <el-radio label="left"> 居左 </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
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
    type: {
      type: String, // pc 传'pc'即可
      default: 'wxapp'
    }
  },
  data() {
    return {
      name: '',
      base: {}
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
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
    }
  }
}
</script>
