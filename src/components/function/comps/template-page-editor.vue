<style lang="scss">
.pageheader-section {
  .el-input {
    width: 300px;
  }
  .el-textarea {
    width: 300px;
  }
}
</style>
<template>
  <div class="pageheader-section section">
    <div class="section-header with-border">页面设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="页面名称">
          <el-input v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item label="页面说明">
          <el-input v-model="base.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="顶部导航">
          <div>
            <el-radio-group v-model="base.navigateStyle">
              <el-radio label="1"> 颜色背景 </el-radio>
              <el-radio label="2"> 图片背景 </el-radio>
            </el-radio-group>
            <div>
              <el-color-picker
                v-if="base.navigateStyle == '1'"
                v-model="base.navigateBackgroundColor"
              />
              <SpImagePicker v-else v-model="base.navigateBackgroundImage" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="页面标题">
          <div>
            <el-radio-group v-model="base.titleStyle">
              <el-radio label="1"> 文字 </el-radio>
              <el-radio label="2"> 图片 </el-radio>
            </el-radio-group>
            <div>
              <el-color-picker v-if="base.titleStyle == '1'" v-model="base.titleColor" />
              <SpImagePicker v-else v-model="base.titleBackgroundImage" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="标题位置">
          <el-radio-group v-model="base.titlePosition">
            <el-radio label="left"> 居左 </el-radio>
            <el-radio label="center"> 居中 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="页面背景">
          <div>
            <el-radio-group v-model="base.pageBackgroundStyle">
              <el-radio label="1"> 颜色背景 </el-radio>
              <el-radio label="2"> 图片背景 </el-radio>
            </el-radio-group>
            <div>
              <el-color-picker v-if="base.pageBackgroundStyle == '1'" />
              <SpImagePicker v-else v-model="base.pageBackgroundImage" />
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplatePageEditor',
  props: ['value'],
  data() {
    return {
      name: 'page',
      base: {
        title: '',
        desc: '',
        navigateStyle: '1', // 1=颜色背景；2=图片背景
        navigateBackgroundColor: '#330',
        navigateBackgroundImage: '',
        titleStyle: '1', // 1=文字；2=图片
        titleColor: '#333',
        titleBackgroundImage: '',
        titlePosition: 'left', // left\center\right
        pageBackgroundStyle: '1', // 1=颜色背景；2=图片背景
        pageBackgroundColor: '#f5f5f5',
        pageBackgroundImage: ''
      }
    }
  },
  watch: {
    base: function (val) {
      this.$emit('input', {
        name: this.name,
        base: val
      })
    }
  },
  created() {
    const { name = 'page', base = {} } = this.value || {}
    this.name = name
    this.base = { ...this.base, ...base }
  },
  methods: {
    getData() {}
  }
}
</script>
