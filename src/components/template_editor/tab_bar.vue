<template>
  <section
    v-if="name === 'tabs'"
    class="section"
  >
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="背景色">
          <el-color-picker v-model="config.backgroundColor" />
        </el-form-item>
        <el-form-item label="默认颜色">
          <el-color-picker v-model="config.color" />
        </el-form-item>
        <el-form-item label="选中颜色">
          <el-color-picker v-model="config.selectedColor" />
        </el-form-item>
        <el-form-item label="设置tabBar">
          <div
            v-for="(item, index) in data"
            class="setting-item"
          >
            <div
              v-if="index > 1"
              class="setting-remove"
              @click="removeItem(index)"
            >
              <i class="iconfont icon-trash-alt" />
            </div>
            <img
              v-if="item.iconPath"
              :src="item.iconPath"
              class="icon-setter"
              @click="handleIconChange(index)"
            >
            <div
              v-else
              class="icon-setter"
              @click="handleIconChange(index)"
            >
              <i class="iconfont icon-image muted" />
            </div>
            <img
              v-if="item.selectedIconPath"
              :src="item.selectedIconPath"
              class="icon-setter"
              @click="handleSelectedIconChange(index)"
            >
            <div
              v-else
              class="icon-setter"
              @click="handleSelectedIconChange(index)"
            >
              <i class="iconfont icon-image muted" />
            </div>
            <div class="uploader-setting">
              <el-input
                v-model="item.text"
                placeholder="tab名称"
                maxlength=""
              />
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
          <div class="frm-tips">
            只能上传jpg/png文件，且不超过2M （建议尺寸：50px * 50px）
          </div>
          <el-button
            :disabled="data.length >= 5"
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            @click="addItem"
          >
            添加菜单项
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
      default: {}
    }
  },
  data () {
    return {
      name: '',
      config: {},
      current: '',
      data: [],
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
          value: '/pages/recommend/list',
          name: 'article',
          label: '软文'
        },
        {
          value: '/pages/liveroom/index',
          name: 'liveroom',
          label: '直播'
        },
        {
          value: '/pages/item/list?isTabBar=true',
          name: 'allGoods',
          label: '全部商品'
        }
      ]
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
      this.config = val.config
      this.data = val.data
    },
    addItem () {
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
    removeItem (index) {
      this.data.splice(index, 1)
    },
    handleClick (index) {
      this.current = index
    },
    handleChange (value) {
      let n = this.pathOptions.find((item) => item.value === value)
      if (n) {
        this.data[this.current].name = n.name
      }
    },
    handleIconChange (index) {
      this.$emit('bindImgs', index, 'default')
    },
    handleSelectedIconChange (index) {
      this.$emit('bindImgs', index, 'selected')
    }
  }
}
</script>

<style scoped lang="scss"></style>
