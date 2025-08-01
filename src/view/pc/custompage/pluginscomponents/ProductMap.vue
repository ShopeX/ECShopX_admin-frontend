<template>
  <section class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form>
        <el-form-item label="展示图">
          <div v-for="(item, index) in t_data.data" class="setting-item slider">
            <div v-if="!num" class="setting-remove" @click="removeItem(index)">
              <i class="iconfont icon-trash-alt" />
            </div>
            <div @click="handleImgChange(index)">
              <img v-if="item.imgUrl" :src="item.imgUrl" class="banner-uploader">
              <div v-else class="banner-uploader">
                <i class="iconfont icon-camera" />
                上传图片
              </div>
            </div>
            <div v-if="show_goods" class="uploader-setting">
              <div class="goods-select" @click="handleGoodsChange(index)">
                <div v-if="item.goodsId" class="link-content">
                  <template>商品：</template>
                  {{ item.title }}
                </div>
                <div v-else class="content-center">
                  <i class="iconfont icon-link" @click="handleGoodsChange(index)" />设置路径
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <imgPicker
        :dialog-visible="imgsVisible"
        :sc-status="isGetImage"
        @chooseImg="pickImg"
        @closeImgDialog="closeimgsVisible"
      />
      <goodsPicker
        usage="pc"
        :visible="goodsVisible"
        @pickGoods="pickGoods"
        @closeDialog="closeDialog"
      />
    </div>
    <div v-if="!num || (num && t_data.data.length < 4)" class="content-center">
      <div class="frm-tips">只能上传jpg/png文件（建议尺寸：1220px * 500px）</div>
      <!-- <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）</div> -->
      <el-button
        :disabled="data.length >= 5"
        type="default"
        class="iconfont icon-plus-circle banner-button-uploader"
        @click="addItem"
      >
        {{ text }}
      </el-button>
    </div>
  </section>
</template>
<script>
import goodsPicker from '@/components/goods_picker'
import imgPicker from '@/components/imageselect'

export default {
  name: 'BannerStyle',
  components: {
    goodsPicker,
    imgPicker
  },
  props: {
    // binddata: {
    //   type: Object
    // }
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    num: {
      type: Number,
      default: 0
    },
    show_goods: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: '添加轮播图'
    }
  },
  data() {
    return {
      goodsVisible: false,
      t_data: this.data,
      isGetImage: false,
      imgsVisible: false,
      current_index: ''
    }
  },
  watch: {
    t_data: {
      handler(newVal, oldVal) {
        console.log('inner watch', newVal)
        this.$emit('update:data', newVal)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    removeItem(index) {
      this.t_data.data.splice(index, 1)
    },
    handleImgChange(index) {
      this.imgsVisible = true
      this.isGetImage = true
      if (typeof index !== undefined) {
        // this.editorDataIndex = index
        this.current_index = index
      }
    },
    handleGoodsChange(index) {
      this.current_index = index
      this.goodsVisible = true
    },
    pickImg(data) {
      console.log('pickImg', data)
      let tmp = [...this.t_data.data] // 利用索引直接修改数组值，vue无法监听数组变化的解决方案
      tmp[this.current_index].imgUrl = data.url
      this.t_data.data = tmp
      console.log('pickImg end', this.t_data.data[this.current_index])
      this.imgsVisible = false
    },
    closeimgsVisible() {
      this.imgsVisible = false
    },
    pickGoods(data) {
      data[0].imgUrl && delete data[0].imgUrl
      console.log('pickgoods', data)
      let tmp = [...this.t_data.data]
      tmp[this.current_index] = Object.assign({}, tmp[this.current_index], data[0])
      this.t_data.data = tmp
      this.goodsVisible = false
    },
    closeDialog() {
      this.goodsVisible = false
    },
    addItem() {
      if (!this.t_data.data) {
        this.t_data.data = []
      }
      let item = {
        imgUrl: '', // 用户上传的商品图片
        title: '',
        goodsId: '',
        brand: '',
        price: ''
      }

      if (this.t_data.data.length > 4) {
        this.$message({
          message: '轮播图最多添加5个图片',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.t_data.data.push(item)
      }
    }
  }
}
</script>
