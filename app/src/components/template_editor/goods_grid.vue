<template>
  <section v-if="name === 'goodsGrid'" class="section">
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-width="100px" :label-position="usage == 'mobile' ? 'left' : 'top'">
        <el-form-item label="标题">
          <el-input v-model="base.title" type="text"  maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="副标题" v-if="show_subtitle">
          <el-input v-model="base.subtitle" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="组件间距" v-if="show_space">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef">
          </el-switch>
        </el-form-item>
        <el-form-item label="组件间距" v-if="usage == 'pc'">
          <el-input type="number" v-model="base.padded"></el-input>
        </el-form-item>
        <el-form-item label="样式" v-if="show_style">
          <el-radio-group v-model="config.style" @change="styleChange">
            <el-radio :label="'grid'">一行两个</el-radio>
            <el-radio :label="'grids'">一行三个</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示价格" v-if="show_price">
          <el-switch v-model="config.showPrice" active-color="#27cc6a" inactive-color="#efefef">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="config.style !== 'grids' && show_brand" label="显示品牌">
          <el-switch v-model="config.brand" active-color="#27cc6a" inactive-color="#efefef">
          </el-switch>
          <span class="muted content-padded">显示品牌需配置商品品牌logo</span>
        </el-form-item>
        <el-form-item label="选择商品">
          <el-button type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setGoods"
            v-if="!limit_num || items.length < limit_num"> 编辑商品</el-button>
          <span v-if="!limit_num || items.length < limit_num" style="font-size:12px;margin-left:20px">最多可选择100件商品；左侧实时预览内仅展示前50件；下方商品拖动以排序。</span>
          <el-row :gutter="20" v-if="items.length > 0"   class="content-bottom-padded" style="margin-left: 0px;">
            <draggable
              v-if="items.length > 0"
              v-model="items"
              :options="dragItemsOptions"
              @end="onEnd"
            >
                <!-- <div class="setting-item item-selected" v-for="(item, index) in items" :key="index"> -->
                <el-col @mouseover.native="mouseoverHandle(index)" @mouseleave.native="mouseleaveHandle()" :span="6" class="setting-item item-selected" v-for="(item, index) in items" :key="index">
                  <img class="thumbnail" :src="wximageurl + item.imgUrl" alt="" /> 
                  <div class="title">{{ item.title }}</div>
                  <div :class="[{active:index == activeIndex},' settingRemove']" @click="removeItem(index)">
                    <i class="iconfont el-icon-error"></i>
                  </div>
                </el-col>
            </draggable>
          </el-row>

          <span v-if="limit_num"> * 最多上传{{ limit_num }}个商品</span>
        </el-form-item>
        <el-form-item v-if="config.moreLink" label="设置更多链接">
          <div class="goods-select" @click="handleMoreLink">
            <div class="link-content" v-if="config.moreLink.title">
              <template v-if="config.moreLink.linkPage === 'goods'">商品：</template>
              <template v-if="config.moreLink.linkPage === 'category'">分类：</template>
              <template v-if="config.moreLink.linkPage === 'article'">文章：</template>
              <template v-if="config.moreLink.linkPage === 'planting'">软文：</template>
              <template v-if="config.moreLink.linkPage === 'link'">页面：</template>
              <template v-if="config.moreLink.linkPage === 'marketing'">营销：</template>
              <template v-if="config.moreLink.linkPage === 'custom_page'">自定义页面：</template>
              {{ config.moreLink.title }}
            </div>
            <div v-else class="content-center"><i class="iconfont icon-link"></i>设置路径</div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    show_space: {
      type: Boolean,
      default: true
    },
    show_style: {
      type: Boolean,
      default: true
    },
    show_brand: {
      type: Boolean,
      default: true
    },
    show_subtitle: {
      type: Boolean,
      default: true
    },
    show_price: {
      type: Boolean,
      default: true
    },
    limit_num: {
      // 限制上传商品的数量
      type: Number,
      default: 0
    },
    usage: {
      type: String,
      default: 'mobile'
    }
  },
  components: {
    draggable
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
      data: [],

      items: [],
      temp: '',
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      activeIndex:null,
    }
  },
  methods: {
    mouseoverHandle(index){
      this.activeIndex = index
    },
    mouseleaveHandle(){
      this.activeIndex = null
    },
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
      this.items = val.data
    },

    removeItem(index) {
      this.data.splice(index, 1)
    },
    setGoods() {
      this.$emit('bindGoods')
    },
    styleChange(val) {
      if (val === 'grids') {
        this.config.brand = false
      }
    },
    onEnd(evt) {
      this.temp = this.data[evt.oldIndex]
      this.data.splice(evt.oldIndex, 1)
      this.data.splice(evt.newIndex, 0, this.temp)
    },
    handleMoreLink() {
      this.$emit('bindLinks')
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss">
.style-icon {
  font-size: 20px;
  color: #aeaeae;
  vertical-align: middle;
}
.tab-list {
  padding-right: 30px;
  display: flex;
  flex-direction: column;
}

.upload-boxs {
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
