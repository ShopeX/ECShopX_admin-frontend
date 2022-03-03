<template>
  <section class="section">
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-position="top">
        <el-form-item label="标题">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-input
            v-model="base.padded"
            type="number"
          />
        </el-form-item>
        <el-form-item label="左偏移">
          <el-switch v-model="config.offset" />
        </el-form-item>
        <el-form-item label="全屏宽">
          <el-switch v-model="config.fullscreen" />
        </el-form-item>
        <el-form-item label="展示图">
          <div
            v-for="(item, index) in data"
            class="setting-item slider"
          >
            <div
              class="setting-remove"
              @click="removeItem(index)"
            >
              <i class="iconfont icon-trash-alt" />
            </div>
            <div @click="handleImgChange(index)">
              <img
                v-if="item.imgUrl"
                :src="item.imgUrl"
                class="banner-uploader"
              >
              <div
                v-else
                class="banner-uploader"
              >
                <i class="iconfont icon-camera" />
                上传图片
              </div>
            </div>
            <div
              v-if="show_goods"
              class="uploader-setting"
            >
              <div
                class="goods-select"
                @click="editLink(index)"
              >
                <div
                  v-if="item.id"
                  class="link-content"
                >
                  <template v-if="item.linkPage === 'goods'">
                    【商品】{{ item.title }}
                  </template>
                  <template v-if="item.linkPage === 'store'">
                    【店铺】{{ item.title }}
                  </template>
                  <template
                    v-if="item.linkPage === 'custom_page'"
                  >
                    【自定义页】{{ item.title }}
                  </template>
                  <template v-if="item.linkPage === 'category'">
                    【分类】{{ item.title }}
                  </template>
                  {{ item.title }}
                </div>
                <div
                  v-else
                  class="content-center"
                >
                  <i class="iconfont icon-link" />设置路径
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="content-center">
        <div class="frm-tips">
          支持图片格式：jpg/png
        </div>
        <!-- <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）</div> -->
        <el-button
          :disabled="data.length >= num"
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          {{ text }}
        </el-button>
      </div>
      <imgPicker
        :dialog-visible="imgsVisible"
        :sc-status="isGetImage"
        @chooseImg="pickImg"
        @closeImgDialog="closeimgsVisible"
      />
      <linkSetter
        :links="linksArr"
        usage="pc"
        :visible="linksVisible"
        :show_article="false"
        :show_planting="false"
        :show_page="false"
        :show_marketing="false"
        :show_category="true"
        :show_store="show_store"
        @setLink="setLink"
        @closeDialog="closeDialog"
      />
      <goodsPicker
        usage="pc"
        :visible="goodsVisible"
        @pickGoods="pickGoods"
        @closeDialog="closeDialog"
      />
    </div>
  </section>
</template>
<script>
import goodsPicker from '@/components/goods_picker'
import imgPicker from '@/components/imageselect'
import linkSetter from '@/components/template_links'

export default {
  name: 'BannerStyle',
  components: {
    goodsPicker,
    imgPicker,
    linkSetter
  },
  props: {
    // binddata: {
    //   type: Object
    // }
    respons: {
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
  data () {
    return {
      name: '',
      base: {},
      config: {},
      data: [],
      linksArr: ['goods', 'store', 'custom_page', 'category'],
      linksVisible: false,
      goodsVisible: false,
      isGetImage: false,
      imgsVisible: false,
      current_index: ''
    }
  },
  computed: {
    show_store () {
      return this.usage !== 'store'
    }
  },
  watch: {
    respons: {
      deep: true,
      handler (value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted () {
    this.setData(this.respons)
  },
  methods: {
    editLink (index) {
      this.linksVisible = true
      this.current_index = index
    },
    setData (val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    removeItem (index) {
      this.data.splice(index, 1)
    },
    handleImgChange (index) {
      this.imgsVisible = true
      this.isGetImage = true
      if (typeof index !== undefined) {
        // this.editorDataIndex = index
        this.current_index = index
      }
    },
    handleGoodsChange (index) {
      this.current_index = index
      this.goodsVisible = true
    },
    pickImg (data) {
      this.data[this.current_index].imgUrl = data.url
      this.imgsVisible = false
    },
    closeimgsVisible () {
      this.imgsVisible = false
    },
    setLink (data, type) {
      // 添加导航
      // 修改导航
      this.data[this.current_index] = Object.assign(
        this.data[this.current_index],
        { linkPage: type },
        data
      )
      this.linksVisible = false
    },
    pickGoods (data) {
      data[0].imgUrl && delete data[0].imgUrl
      console.log('pickgoods', data)
      let tmp = [...this.data]
      tmp[this.current_index] = Object.assign({}, tmp[this.current_index], data[0])
      this.data = tmp
      this.goodsVisible = false
    },
    closeDialog () {
      this.goodsVisible = false
      this.linksVisible = false
    },
    addItem () {
      if (!this.data) {
        this.data = []
      }
      let item = {
        imgUrl: '', // 用户上传的商品图片
        title: '',
        goodsId: '',
        id: '',
        linkPage: '',
        brand: '',
        price: ''
      }
      if (this.data.length > this.num) {
        this.$message({
          message: `最多添加${this.num}个图片`,
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.data.push(item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 120px;
  line-height: 1.3;
  color: #dadadd;
  border: 1px dashed #ddd;
  cursor: pointer;
  &.square {
    width: 90px;
    height: 90px;
  }
  i {
    font-size: 30px;
  }
}
.uploader-setting {
  flex: 1;
  padding-left: 10px;
  &:last-child {
    padding-right: 30px;
  }
}
</style>
