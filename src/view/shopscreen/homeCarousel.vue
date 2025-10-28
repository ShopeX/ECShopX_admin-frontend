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
  <section class="section">
    <div class="section-body">
      <el-form label-width="100px">
        <template>
          <!-- <el-form-item label="店铺">
            <el-select v-model="distributor_id" @change="distributorSelectHandle" placeholder="请选择店铺" style="width: 100%">
              <el-option v-for="(item, index) in distributorList" :key="index" :label="item.name" :value="item.distributor_id"> </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="标题" placeholder="请输入标题">
            <el-input v-model="base.title" />
          </el-form-item>
          <el-form-item label="副标题" placeholder="请输入副标题">
            <el-input v-model="base.subtitle" />
          </el-form-item>
          <el-form-item label="组件间距">
            <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="圆角图片">
            <el-switch v-model="config.rounded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="图片间隔">
            <el-switch v-model="config.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="指示点样式">
            <el-switch
              v-model="config.dot"
              active-text="点"
              inactive-text="数字"
              active-color="#27cc6a"
              inactive-color="#ffa100"
            />
          </el-form-item>
          <el-form-item label="指示点覆盖">
            <el-switch v-model="config.dotCover" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="指示点位置">
            <el-radio-group v-model="config.dotLocation">
              <el-radio label="left"> 居左 </el-radio>
              <el-radio label="center"> 居中 </el-radio>
              <el-radio label="right"> 居右 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="指示点形状">
            <el-radio-group v-model="config.shape">
              <el-radio label="circle"> 圆形 </el-radio>
              <el-radio label="rectangle"> 长方型 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="指示点颜色">
            <el-radio-group v-model="config.dotColor">
              <el-radio label="dark"> 深色 </el-radio>
              <el-radio label="light"> 亮色 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="轮播项间距">
            <el-switch v-model="config.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item label="开启图片描述">
            <el-switch v-model="config.content" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
        </template>

        <el-form-item label="轮播项">
          <div v-for="(item, index) in data" class="setting-item slider">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="iconfont icon-trash-alt" />
            </div>

            <template>
              <img
                v-if="item.url"
                :src="item.url"
                class="banner-uploader"
                @click="handleImgChange(index)"
              >
              <div v-else class="banner-uploader" @click="handleImgChange(index)">
                <i class="iconfont icon-camera" />
                上传图片
              </div>
              <div class="uploader-setting">
                <el-input
                  v-if="config.content"
                  v-model="item.desc"
                  type="textarea"
                  placeholder="文字描述"
                />
                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div v-if="item.title" class="link-content">商品：{{ item.title }}</div>
                  <div v-else class="content-center">
                    <i class="iconfont icon-link" @click="handleGoodsChange(index)" />设置路径
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="content-center">
        <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）</div>
        <el-button
          :disabled="data.length >= 5"
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          添加轮播图
        </el-button>
      </div>
    </div>
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="
        () => {
          imgsVisible = false
        }
      "
    />
    <linkSetter
      :visible="linksVisible"
      :rel-store="curStore"
      :links="links"
      @setLink="setLink"
      @closeDialog="
        () => {
          linksVisible = false
        }
      "
    />
    <div class="section-footer with-border content-center" style="width: 100%">
      <el-button type="primary" @click="sumbit"> 保存 </el-button>
    </div>
  </section>
</template>

<script>
import linkSetter from '@/components/template_links'
import imgPicker from '@/components/imageselect'
import { getShopScreenSlider, postShopScreenSlider } from '@/api/shopScreen'
import { getDistributorList } from '@/api/marketing'

export default {
  components: {
    // 其他组件
    imgPicker,
    linkSetter
  },
  // props: {
  //   res: {
  //     type: Object,
  //     default: {}
  //   },
  //   type: {
  //     type: String, // pc 传'pc'即可
  //     default: 'wxapp'
  //   }
  // },
  // watch: {
  //   res (value) {
  //     if (value) {
  //       this.setData(value)
  //     }
  //   }
  // },
  data() {
    return {
      distributor_id: 0,
      distributorList: [],
      curStore: {},
      base: {
        title: '',
        subtitle: '',
        padded: true
      },
      links: ['goods'],
      config: {
        current: 0,
        interval: 3000,
        spacing: 0,
        dot: 'true', // 是否显示导航
        dotLocation: 'right', // 导航位置
        dotColor: 'dark', // 导航颜色
        shape: 'circle', // 导航形状 circle rectangle dot-size-switch
        numNavShape: 'rect', // 'circle' 'rectangle' 数字导航的形状
        dotCover: true, // 导航是否覆盖轮播
        rounded: false, // 轮播是否有圆角
        padded: false, // 轮播的内间距
        content: true
      },
      data: [
        {
          url: '',
          desc: '',
          id: ''
        }
      ],
      // 图片选择器
      isGetImage: false,
      imgsVisible: false,
      // 路径设置组件
      linksVisible: false,
      editorDataIndex: ''
    }
  },
  mounted() {
    this.getDistributor()
    this.getDefaultSlider()
  },
  methods: {
    getDistributor() {
      var params = { page: 1, pageSize: 500 }
      getDistributorList(params).then(response => {
        if (response.data.data.list) {
          this.distributorList = response.data.data.list
        }
      })
    },
    distributorSelectHandle(val) {
      this.curStore = this.distributorList.find(item => item.distributor_id == val)
      getShopScreenSlider({ distributor_id: this.distributor_id }).then(res => {
        let { data } = res.data
        this.config = data.style_params || {}
        this.base.title = data.title || ''
        this.base.subtitle = data.sub_title || ''
        this.config.content = data.desc_status
        this.data = data.image_list
      })
    },
    getDefaultSlider() {
      getShopScreenSlider({ distributor_id: 0 }).then(res => {
        let { data } = res.data
        this.config = data.style_params
        this.base.title = data.title
        this.base.subtitle = data.sub_title
        this.config.content = data.desc_status
        this.data = data.image_list
      })
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    addItem() {
      if (!this.data) {
        this.data = []
      }
      let item = {
        url: '',
        desc: '',
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
      // 图片选择器绑定事件
      this.imgsVisible = true
      this.isGetImage = true
      if (typeof index !== undefined) {
        this.editorDataIndex = index
      }
    },
    pickImg(data) {
      this.data[this.editorDataIndex].url = data.url
      this.imgsVisible = false
    },
    setLink(data, type) {
      if (this.editorDataIndex !== null) {
        this.data[this.editorDataIndex].id = data.id
        this.data[this.editorDataIndex].title = data.title
        this.linksVisible = false
      }
      // 处理完 恢复
      this.editorDataIndex = null
    },

    handleGoodsChange(index) {
      this.linksVisible = true
      this.editorDataIndex = index
    },
    sumbit() {
      // if(!this.distributor_id){this.$message({
      //   message: '请选择店铺',
      //   type: 'error',
      // })
      // return false}
      let obj = {
        distributor_id: this.distributor_id,
        title: this.base.title,
        sub_title: this.base.subtitle,
        style_params: this.config,
        image_list: this.data,
        desc_status: this.config.content
      }
      postShopScreenSlider(obj).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.slider {
  width: 80%;
}
.banner-uploader {
  width: 300px;
}
</style>
