<template>
  <section v-if="name === 'imgHotzone'" class="section">
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
        <el-form-item label="展示图">
          <div class="setting-item slider">
            <div class="upload-box" v-if="config.imgUrl">
              <img
                :src="wximageurl + config.imgUrl"
                class="banner-uploader"
                @click="handleImgChange"
              />
            </div>
            <div class="banner-uploader" v-else @click="handleImgChange">
              <i class="iconfont icon-camera"></i>上传图片
            </div>
          </div>
        </el-form-item>
        <!-- res: {{res.data}} -->
        <el-form-item label="热区">
          <!-- {{data}} -->
          <hotzone
            class="hotzone"
            :image="config.imgUrl"
            :zonesInit="data"
            @add="handleAdd"
            @change="handleChange"
            @remove="handleRemove"
          ></hotzone>
          <div class="setting-item slider" v-for="(item, index) in data">
            <div class="uploader-setting">
              <div class="goods-select" @click="handleGoodsChange(index)">
                <div class="link-content" v-if="item.id">
                  <template v-if="item.linkPage === 'goods'">商品：</template>
                  <template v-if="item.linkPage === 'category'">分类：</template>
                  <template v-if="item.linkPage === 'article'">文章：</template>
                  <template v-if="item.linkPage === 'planting'">软文：</template>
                  <template v-if="item.linkPage === 'link'">页面：</template>
                  <template v-if="item.linkPage === 'marketing'">营销：</template>
                  <template v-if="item.linkPage === 'custom_page'">自定义页面：</template>
                  {{ item.title }}
                </div>
                <div v-else class="content-center">
                  <i class="iconfont icon-link" @click="handleGoodsChange(index)"></i>设置路径
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import hotzone from 'vue-hotzone'

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
        console.log('img hotzone watch...')
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  components: {
    hotzone: hotzone
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: [],
      zones: []
    }
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    },
    handleGoodsChange(index) {
      this.$emit('bindLinks', index)
    },
    handleAdd(item) {
      console.log('handle add:',item)
      this.data.push({
        ...item,
        linkPage: '',
        title: '',
        id: ''
      })
    },
    handleChange(zone) {
      console.log('handle change, ', zone)
      // setTimeout(() => {
        zone.forEach((item, index) => {
          if (item.leftPer && this.data[index] && typeof this.data[index].id != 'undefined') {
            // let obj = {
            //   heightPer: item.heightPer,
            //   leftPer: item.leftPer,
            //   topPer: item.topPer,
            //   widthPer: item.widthPer
            // }
            // Object.assign(this.data[index], obj)
            this.data[index] = {
              ...this.data[index],
              heightPer: item.heightPer,
              leftPer: item.leftPer,
              topPer: item.topPer,
              widthPer: item.widthPer
            }
            console.log('new:', this.data[index])
          }
        })
      // }, 500)
    },
    handleRemove(index) {
      this.data.splice(index, 1)
    }
  },
  mounted() { 
    this.setData(this.res);
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
.hotzone {
  max-width: 500px;
  margin-bottom: 10px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}
.uploader-setting {
  padding: 0;
}
</style>
