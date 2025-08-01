<template>
  <section v-if="name === 'tabs'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <!--<el-form-item label="背景色">
          <el-color-picker v-model="config.backgroundColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="默认颜色">
          <el-color-picker v-model="config.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="选中颜色">
          <el-color-picker v-model="config.selectedColor"></el-color-picker>
        </el-form-item>-->
        <el-form-item label="设置tabBar">
          <div v-for="(item, index) in data" class="setting-item">
            <div v-if="index > 1" class="setting-remove" @click="removeItem(index)">
              <i class="iconfont icon-trash-alt" />
            </div>
            <!--
            <img v-if="item.iconPath" :src="item.iconPath" class="icon-setter" @click="handleIconChange(index)"/>
            <div class="icon-setter" v-else @click="handleIconChange(index)">
              <i class="iconfont icon-image muted"></i>
            </div>
            <img v-if="item.selectedIconPath" :src="item.selectedIconPath" class="icon-setter" @click="handleSelectedIconChange(index)"/>
            <div class="icon-setter" v-else @click="handleSelectedIconChange(index)">
              <i class="iconfont icon-image muted"></i>
            </div>-->
            <div class="uploader-setting">
              <el-input v-model="item.text" placeholder="tab名称" maxlength="" />
            </div>
            <div class="uploader-setting">
              <el-select
                v-model="item.pagePath"
                placeholder="设置tab路径"
                @focus="handleClick(index)"
                @change="handleChange"
              >
                <el-option
                  v-for="item in pathOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <!--<div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）</div>-->
          <el-button
            :disabled="data.length >= 5"
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            @click="addItem"
          >
            添加菜单项
          </el-button>
          <div class="goods-select" @click="handleGoodsChange">
            <div v-if="base.title" class="link-content">
              <template v-if="base.linkPage === 'goods'"> 商品： </template>
              <template v-if="base.linkPage === 'category'"> 分类： </template>
              <template v-if="base.linkPage === 'article'"> 文章： </template>
              <template v-if="base.linkPage === 'planting'"> 软文： </template>
              <template v-if="base.linkPage === 'link'"> 页面： </template>
              <template v-if="base.linkPage === 'marketing'"> 营销： </template>
              <template v-if="base.linkPage === 'custom_page'"> 自定义页面： </template>
              {{ base.title }}
            </div>
            <div v-else class="content-center">
              <i class="iconfont icon-link" @click="handleGoodsChange" />服务页面设置路径
            </div>
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
  data() {
    return {
      name: '',
      config: {},
      current: '',
      data: [],
      base: {},
      current_index: '',
      iconColor: '',
      selectedIconColor: '',
      pathOptions: [
        {
          value: '/pages/index',
          name: 'home',
          label: '首页'
        },
        {
          value: '/pages/cart/espier-index',
          name: 'cart',
          label: '购物车'
        },
        {
          value: '/pages/category/index',
          name: 'category',
          label: '分类'
        },
        {
          value: '/pages/member/index',
          name: 'member',
          label: '我的'
        },
        {
          value: '/pages/custom/custom-page',
          name: 'service',
          label: '服务'
        }
      ]
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
      this.config = val.config
      this.data = val.data
      this.base = val.base && val.base.length > 0 ? val.base[0] : []
      this.editItem()
    },
    addItem() {
      if (!this.data) {
        this.data = []
      }
      let item = {
        pagePath: '',
        text: '',
        name: '',
        iconPath: '',
        selectedIconPath: ''
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
    editItem() {
      if (this.base && this.base.linkPage && this.base.linkPage === 'custom_page') {
        this.data.map(item => {
          if (item.name === 'service') {
            item.id = this.base.id
          }
        })
      }
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    handleClick(index) {
      this.current = index
    },
    handleChange(value) {
      let n = this.pathOptions.find(item => item.value === value)
      if (n) {
        this.data[this.current].name = n.name
      }
    },
    handleIconChange(index) {
      this.$emit('bindImgs', index, 'default')
    },
    handleSelectedIconChange(index) {
      this.$emit('bindImgs', index, 'selected')
    },
    handleGoodsChange() {
      this.$emit('bindLinks')
    }
  }
}
</script>

<style scoped lang="scss"></style>
