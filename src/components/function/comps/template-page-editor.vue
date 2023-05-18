<style lang="scss">
.pageheader-section {
  .el-input {
    width: 300px;
  }
  .el-textarea {
    width: 300px;
  }
  .btn-reset {
    margin-left: 10px;
    position: relative;
    top: -15px;
  }
}

.tab {
  background-color: #f9f9f9;
  padding: 0 10px 10px 10px;
  margin-bottom: 5px;
  color: #191919;
  .prompt {
    color: #666;
    font-size: 14px;
  }
  .wxtitle-content {
    display: flex;
    .btn-reset {
      top: 0px;
    }
  }
}
.mr {
  margin-right: 10px;
}
.color {
  margin: 0 5px 5px 0;
}
.alipay-color {
  display: flex;
  .alipay-color_content {
    width: 30px;
    height: 30px;
    background-color: #fff;
    display: inline-block;
  }
  .el-radio__input {
    display: none;
  }
  .el-radio.is-bordered {
    padding: 5px 8px 5px 0;
  }
}
</style>
<template>
  <div class="pageheader-section section">
    <div class="section-header with-border">页面设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <!-- <el-form-item label="页面名称">
          <el-input v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item label="页面说明">
          <el-input v-model="base.desc" type="textarea" />
        </el-form-item> -->
        <el-form-item label="顶部导航">
          <div>
            <el-radio-group v-model="base.navigateStyle">
              <el-radio label="1"> 颜色背景 </el-radio>
              <el-radio label="2"> 图片背景 </el-radio>
            </el-radio-group>
            <div>
              <div v-if="base.navigateStyle == '1'">
                <el-color-picker v-model="base.navigateBackgroundColor" />
                <el-button
                  class="btn-reset"
                  type="text"
                  @click="
                    () => {
                      this.base.navigateBackgroundColor = '#fff'
                    }
                  "
                >
                  重置
                </el-button>
              </div>
              <SpImagePicker v-else v-model="base.navigateBackgroundImage" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="页面标题">
          <div class="tab">
            <div>微信小程序商城/H5商城/APP商城</div>
            <el-radio-group v-model="base.titleStyle">
              <el-radio label="1"> 文字 </el-radio>
              <el-radio label="2"> 图片 </el-radio>
            </el-radio-group>
            <div>
              <div v-if="base.titleStyle == '1'">
                <div class="prompt">页面标题文字请在管理后台装修-商城信息中填写。</div>
                <div class="wxtitle-content">
                  <span class="mr">颜色</span>
                  <el-color-picker v-model="base.titleColor" />
                  <el-button
                    class="btn-reset"
                    type="text"
                    @click="
                      () => {
                        this.base.titleColor = '#1a1a1a'
                      }
                    "
                  >
                    重置
                  </el-button>
                </div>
              </div>

              <SpImagePicker v-else v-model="base.titleBackgroundImage" />
            </div>
            <div>
              <span class="mr">位置</span>
              <el-radio-group v-model="base.titlePosition">
                <el-radio label="center"> 居中 </el-radio>
                <el-radio label="left"> 居左 </el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- <div class="tab">
            <div>支付宝小程序</div>
            <div class="prompt">页面标题文字请在管理后台装修-商城信息中填写。</div>
            <div class="alipay-color">
              <div class="mr">标题颜色</div>
              <el-radio-group v-model="base.alipayTitleColor">
                <el-radio label="#ffffff" border>
                  <span class="alipay-color_content"></span>
                </el-radio>
                <el-radio label="#000000" border>
                  <span class="alipay-color_content" style="background-color: #000;"></span>
                </el-radio>
              </el-radio-group>
            </div>
          </div> -->
        </el-form-item>
        <!-- <el-form-item label="标题位置">
          <el-radio-group v-model="base.titlePosition">
            <el-radio label="left"> 居左 </el-radio>
            <el-radio label="center"> 居中 </el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="页面背景">
          <div>
            <el-radio-group v-model="base.pageBackgroundStyle">
              <el-radio label="1"> 颜色背景 </el-radio>
              <el-radio label="2"> 图片背景 </el-radio>
            </el-radio-group>
            <div>
              <div v-if="base.pageBackgroundStyle == '1'">
                <el-color-picker v-model="base.pageBackgroundColor" />
                <el-button
                  class="btn-reset"
                  type="text"
                  @click="
                    () => {
                      this.base.pageBackgroundColor = '#fafafa'
                    }
                  "
                >
                  重置
                </el-button>
              </div>
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
        // alipayTitleColor:'#ffffff'
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
