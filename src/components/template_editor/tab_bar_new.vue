<template>
  <section v-if="name === 'tabs'" class="section">
    <div class="section-body">
      <el-row>
        <el-col :span="8" class="row-col">
          <span>背景色</span>
          <el-color-picker v-model="config.backgroundColor"></el-color-picker>
        </el-col>
        <el-col :span="8" class="row-col">
          <span>默认颜色</span>
          <el-color-picker v-model="config.color"></el-color-picker>
        </el-col>
        <el-col :span="8" class="row-col">
          <span>选中颜色</span>
          <el-color-picker v-model="config.selectedColor"></el-color-picker>
        </el-col>
      </el-row>
      <el-row>设置tabBar</el-row>
      <el-row>
        <div class="setting-item" v-for="(item, index) in data" :key="index">
          <div v-if="index > 1" class="setting-remove" @click="removeItem(index)">
            <i class="iconfont icon-trash-alt"></i>
          </div>
          <img
            v-if="item.iconPath"
            :src="item.iconPath"
            class="icon-setter"
            @click="handleIconChange(index)"
          />
          <div class="icon-setter" v-else @click="handleIconChange(index)">
            <i class="iconfont icon-image muted"></i>
          </div>
          <img
            v-if="item.selectedIconPath"
            :src="item.selectedIconPath"
            class="icon-setter"
            @click="handleSelectedIconChange(index)"
          />
          <div class="icon-setter" v-else @click="handleSelectedIconChange(index)">
            <i class="iconfont icon-image muted"></i>
          </div>
          <div class="uploader-setting">
            <el-input placeholder="tab名称" v-model="item.text" maxlength=""></el-input>
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
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：50px * 50px）</div>
        <el-button
          :disabled="data.length >= 5"
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          添加菜单项</el-button
        >
      </el-row>
      <el-row class="btn-row">
        <el-button type="primary" round @click="handleSave">保存</el-button>
      </el-row>
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
  methods: {
    setData(val) {
      this.name = val.name
      this.config = val.config
      this.data = val.data
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
    removeItem(index) {
      this.data.splice(index, 1)
    },
    handleClick(index) {
      this.current = index
    },
    handleChange(value) {
      let n = this.pathOptions.find((item) => item.value === value)
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
    handleSave() {
      this.$emit('saveTab')
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss">
.row-col {
  display: flex;
  align-items: center;
  span {
    margin-right: 10px;
  }
}
.btn-row {
  text-align: center;
  .el-button {
    width: 50%;
  }
}
</style>
