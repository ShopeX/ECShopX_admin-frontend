<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
          <el-form-item :label="$t('7a67bff9.32c65d')">
            <el-input v-model="base.title" :placeholder="$t('7a67bff9.96641a')" />
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.72cf37')">
            <el-input v-model="base.subtitle" :placeholder="$t('7a67bff9.031313')" />
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.4707ba')">
            <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.2e70e6')">
            <el-switch v-model="config.rounded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.822ac9')">
            <el-switch v-model="config.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.9a9056')">
            <el-switch
              v-model="config.dot"
              :active-text="$t('7a67bff9.be604f')"
              :inactive-text="$t('7a67bff9.55d479')"
              active-color="#27cc6a"
              inactive-color="#ffa100"
            />
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.175553')">
            <el-switch v-model="config.dotCover" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.a8a94d')">
            <el-radio-group v-model="config.dotLocation">
              <el-radio label="left"> {{ $t('7a67bff9.316a63') }} </el-radio>
              <el-radio label="center"> {{ $t('7a67bff9.0bbc2e') }} </el-radio>
              <el-radio label="right"> {{ $t('7a67bff9.e2aaec') }} </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.11333d')">
            <el-radio-group v-model="config.shape">
              <el-radio label="circle"> {{ $t('7a67bff9.2db0fc') }} </el-radio>
              <el-radio label="rectangle"> {{ $t('7a67bff9.2fce58') }} </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.14db62')">
            <el-radio-group v-model="config.dotColor">
              <el-radio label="dark"> {{ $t('7a67bff9.41e8e8') }} </el-radio>
              <el-radio label="light"> {{ $t('7a67bff9.a32b3b') }} </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.817dc9')">
            <el-switch v-model="config.padded" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
          <el-form-item :label="$t('7a67bff9.774334')">
            <el-switch v-model="config.content" active-color="#27cc6a" inactive-color="#efefef" />
          </el-form-item>
        </template>

        <el-form-item :label="$t('7a67bff9.3db933')">
          <div v-for="(item, index) in data" class="setting-item slider">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>

            <template>
              <img
                v-if="item.url"
                :src="item.url"
                class="banner-uploader"
                @click="handleImgChange(index)"
              />
              <div v-else class="banner-uploader" @click="handleImgChange(index)">
                <i class="el-icon-camera" />
                {{ $t('7a67bff9.ce6855') }}
              </div>
              <div class="uploader-setting">
                <el-input
                  v-if="config.content"
                  v-model="item.desc"
                  type="textarea"
                  :placeholder="$t('7a67bff9.191be5')"
                />
                <div class="goods-select" @click="handleGoodsChange(index)">
                  <div v-if="item.title" class="link-content">
                    {{ $t('7a67bff9.10fe9c') }}{{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="el-icon-link" @click="handleGoodsChange(index)" />{{
                      $t('7a67bff9.4f2c29')
                    }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="content-center">
        <div class="frm-tips">{{ $t('7a67bff9.d5a0d5') }}</div>
        <el-button
          :disabled="data.length >= 5"
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        >
          {{ $t('7a67bff9.22134f') }}
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
      <el-button type="primary" @click="sumbit"> {{ $t('7a67bff9.be5fbb') }} </el-button>
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
      getDistributorList(params).then((response) => {
        if (response.data.data.list) {
          this.distributorList = response.data.data.list
        }
      })
    },
    distributorSelectHandle(val) {
      this.curStore = this.distributorList.find((item) => item.distributor_id == val)
      getShopScreenSlider({ distributor_id: this.distributor_id }).then((res) => {
        let { data } = res.data
        this.config = data.style_params || {}
        this.base.title = data.title || ''
        this.base.subtitle = data.sub_title || ''
        this.config.content = data.desc_status
        this.data = data.image_list
      })
    },
    getDefaultSlider() {
      getShopScreenSlider({ distributor_id: 0 }).then((res) => {
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
          message: this.$t('7a67bff9.1d1897'),
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
      postShopScreenSlider(obj).then((res) => {
        this.$message({
          message: this.$t('7a67bff9.3b1083'),
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
