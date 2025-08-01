<template>
  <section v-if="name === 'navigation'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="导航项">
          <div v-for="(item, index) in data" class="setting-item">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="iconfont icon-trash-alt" />
            </div>

            <img
              v-if="item.imgUrl"
              :src="wximageurl + item.imgUrl"
              class="banner-uploader square"
              @click="handleImgChange(index)"
            >
            <div v-else class="banner-uploader square" @click="handleImgChange(index)">
              <div class="content-center">
                <i class="iconfont icon-camera" /><br>
                上传图片
              </div>
            </div>
            <div class="uploader-setting">
              <el-input v-model="item.content" placeholder="导航名称" />
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
            </div>
          </div>
          <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）</div>
          <el-button
            :disabled="data.length >= 5"
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            @click="addItem"
          >
            添加项目
          </el-button>
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
      default: () => {
        return {}
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
      this.config = val.config
      this.data = val.data
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    addItem() {
      if (!this.data) {
        this.data = []
      }
      let item = {
        imgUrl: '',
        linkPage: '',
        content: '',
        id: ''
      }
      if (this.data.length > 4) {
        this.$message({
          message: '轮播图最多添加5个图片',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.data.push(item)
      }
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    },
    handleGoodsChange(index) {
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
  margin-bottom: 10px;
  img {
    width: 100%;
  }
}
</style>
