<template>
  <section v-if="name === 'floorImg' || name === 'banner'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <template v-if="type == 'wxapp'">
          <el-form-item label="标题">
            <el-input v-model="base.title" />
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="base.subtitle" />
          </el-form-item>
          <el-form-item label="组件间距">
            <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-color-picker v-model="base.WordColor" />
          </el-form-item>
          <el-form-item label="显示背景图">
            <el-switch v-model="base.openBackImg" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <template v-if="base.openBackImg">
            <el-form-item label="背景图片">
              <img
                v-if="base.backgroundImg"
                :src="wximageurl + base.backgroundImg"
                class="banner-uploader"
                @click="handleImgChange('backImg')"
              >
              <div v-else class="banner-uploader" @click="handleImgChange('backImg')">
                <i class="iconfont icon-camera" />
                上传图片
              </div>
            </el-form-item>
          </template>
        </template>
        <el-form-item label="图片列表">
          <div v-for="(item, index) in data" :key="index" class="setting-item slider">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="iconfont icon-trash-alt" />
            </div>
            <template v-if="type === 'wxapp'">
              <el-form-item label="">
                <img
                  v-if="item.imgUrl"
                  :src="wximageurl + item.imgUrl"
                  class="banner-uploader"
                  @click="handleImgChange(index)"
                >
                <div v-else class="banner-uploader" @click="handleImgChange(index)">
                  <i class="iconfont icon-camera" />
                  上传图片
                </div>
              </el-form-item>
              <el-form-item label="">
                <div class="uploader-setting">
                  <el-form-item label="图片标题">
                    <el-input v-model="item.ImgTitle" />
                  </el-form-item>
                  <!-- <el-form-item label="字体颜色">
                    <el-color-picker v-model="item.WordColor"></el-color-picker>
                  </el-form-item> -->
                </div>
              </el-form-item>
              <el-form-item label="">
                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div v-if="item.id" class="link-content">
                    <template v-if="item.linkPage === 'goods'"> 商品： </template>
                    <template v-if="item.linkPage === 'category'"> 分类： </template>
                    <template v-if="item.linkPage === 'article'"> 文章： </template>
                    <template v-if="item.linkPage === 'planting'"> 软文： </template>
                    <template v-if="item.linkPage === 'link'"> 页面： </template>
                    <template v-if="item.linkPage === 'marketing'"> 营销： </template>
                    {{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="iconfont icon-link" @click="handleGoodsChange(index)" />设置路径
                  </div>
                </div>
              </el-form-item>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="content-center">
        <div v-if="base.openBackImg" class="frm-tips">
          只能上传jpg/png文件，且不超过2M （建议尺寸：160px * 160px）
        </div>
        <div v-else class="frm-tips">
          只能上传jpg/png文件，且不超过2M （建议尺寸：160px * 230px）
        </div>
        <el-button
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          添加图片
        </el-button>
      </div>
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
      base: {},
      data: []
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
      this.data = val.data
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    },
    addItem() {
      let item = {
        imgUrl: '',
        title: '',
        id: ''
      }
      this.data.push(item)
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    handleGoodsChange(index) {
      this.$emit('bindLinks', index)
    }
  }
}
</script>
