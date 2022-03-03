<template>
  <section
    v-if="name === 'showcase'"
    class="section"
  >
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch
            v-model="base.padded"
            active-color="#27cc6a"
            inactive-color="#efefef"
          />
        </el-form-item>
        <el-form-item label="橱窗样式">
          <el-radio-group v-model="config.style">
            <el-radio :label="1">
              样式一
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展示图">
          <div
            v-for="(item, index) in data"
            :key="index"
            class="setting-item slider"
          >
            <img
              v-if="item.imgUrl"
              :src="wximageurl + item.imgUrl"
              class="banner-uploader"
              @click="handleImgChange(index)"
            >
            <div
              v-else
              class="banner-uploader"
              @click="handleImgChange(index)"
            >
              <div class="content-center">
                <i class="iconfont icon-camera" /><br>
                上传图片
              </div>
            </div>
            <div class="uploader-setting">
              <div
                class="goods-select"
                @click="handleGoodsChange(index)"
              >
                <div
                  v-if="item.id"
                  class="link-content"
                >
                  <template v-if="item.linkPage === 'goods'">
                    商品：
                  </template>
                  <template v-if="item.linkPage === 'category'">
                    分类：
                  </template>
                  <template v-if="item.linkPage === 'article'">
                    文章：
                  </template>
                  <template v-if="item.linkPage === 'planting'">
                    软文：
                  </template>
                  <template v-if="item.linkPage === 'link'">
                    页面：
                  </template>
                  <template v-if="item.linkPage === 'marketing'">
                    营销：
                  </template>
                  {{ item.title }}
                </div>
                <div
                  v-else
                  class="content-center"
                >
                  <i
                    class="iconfont icon-link"
                    @click="handleGoodsChange(index)"
                  />设置路径
                </div>
              </div>
            </div>
          </div>
          <div class="frm-tips">
            * 只能上传jpg/png文件，且不超过2M （建议尺寸：左：200px * 310px，右上：200px *
            170px，右下：200px * 130px）
          </div>
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
  data () {
    return {
      name: '',
      base: {},
      config: {},
      data: []
    }
  },
  watch: {
    res: {
      deep: true,
      handler (value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted () {
    this.setData(this.res)
  },
  methods: {
    setData (val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    handleImgChange (index) {
      this.$emit('bindImgs', index)
    },
    handleGoodsChange (index) {
      this.$emit('bindLinks', index)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-box {
  height: 100px;
  width: 100px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    width: 100%;
  }
}
</style>
