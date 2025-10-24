<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <section v-if="name === 'tabs'" class="section">
    <div class="section-body">
      <el-row>
        <el-col :span="8" class="row-col">
          <span>背景色</span>
          <el-color-picker v-model="config.backgroundColor" />
        </el-col>
        <el-col :span="8" class="row-col">
          <span>默认颜色</span>
          <el-color-picker v-model="config.color" />
        </el-col>
        <el-col :span="8" class="row-col">
          <span>选中颜色</span>
          <el-color-picker v-model="config.selectedColor" />
        </el-col>
      </el-row>
      <el-row>设置tabBar</el-row>
      <el-row>
        <div v-for="(item, index) in data" :key="index" class="setting-item">
          <div v-if="index > 1" class="setting-remove" @click="removeItem(index)">
            <i class="iconfont icon-trash-alt" />
          </div>
          <img
            v-if="item.iconPath"
            :src="item.iconPath"
            class="icon-setter"
            @click="handleIconChange(index)"
          >
          <div v-else class="icon-setter" @click="handleIconChange(index)">
            <i class="iconfont icon-image muted" />
          </div>
          <img
            v-if="item.selectedIconPath"
            :src="item.selectedIconPath"
            class="icon-setter"
            @click="handleSelectedIconChange(index)"
          >
          <div v-else class="icon-setter" @click="handleSelectedIconChange(index)">
            <i class="iconfont icon-image muted" />
          </div>
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
          <div v-if="item.pagePath == 'customPage'" class="uploader-setting">
            <div class="btn-linkpath" @click="() => handleCustomPageSelect(item)">
              {{ getCustomPageName(item) }}
            </div>
          </div>
        </div>
        <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：50px * 50px）</div>
        <el-button
          :disabled="data.length >= 5"
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          添加菜单项
        </el-button>
      </el-row>
      <el-row class="btn-row">
        <el-button type="primary" round @click="handleSave"> 保存 </el-button>
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
        },
        {
          value: '/subpages/mdugc/index',
          name: 'ugc',
          label: '社区'
        },
        {
          value: 'customPage',
          name: 'customPage',
          label: '自定义页面'
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
      let n = this.pathOptions.find(item => item.value === value)
      if (n) {
        this.data[this.current].name = n.name
      }
      if (value != 'customPage' && this.data[this.current]?.customPage) {
        this.$delete(this.data[this.current], 'customPage')
      }
    },
    handleIconChange(index) {
      this.$emit('bindImgs', index, 'default')
    },
    handleSelectedIconChange(index) {
      this.$emit('bindImgs', index, 'selected')
    },
    handleSave() {
      const emptyIndex = this.data.findIndex(item => item.name == 'customPage' && !item.customPage)
      if (emptyIndex > -1) {
        return this.$message({
          message: '请选择自定义页面',
          type: 'error',
          duration: 5 * 1000
        })
      }
      this.$emit('saveTab')
    },
    async handleCustomPageSelect(item) {
      const { data } = await this.$picker.pages({
        multiple: false,
        data: [item?.customPage?.id]
      })
      this.$set(item, 'customPage', data[0])
    },
    getCustomPageName(item) {
      return item?.customPage?.page_name ?? '请选择自定义页面'
    }
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
.btn-linkpath {
  padding: 0 8px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  height: 36px;
  line-height: 36px;
  border-radius: 3px;
  max-width: 160px;
  @include text-overflow();
}
</style>
