<template>
  <div>
    <section class="section">
      <div class="section-header with-border">
        设置
      </div>
      <div class="section-body">
        <el-form label-width="100px">
          <el-form-item label="标题">
            <el-input v-model="t_data.base.title" />
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="t_data.base.subtitle" />
          </el-form-item>
          <el-form-item label="展示图">
            <div class="setting-item slider">
              <img
                v-if="t_data.config.imgUrl"
                :src="wximageurl + t_data.config.imgUrl"
                class="banner-uploader"
                @click="handleImgChange"
              >
              <div
                v-else
                class="banner-uploader"
                @click="handleImgChange"
              >
                <i class="iconfont icon-camera" />上传图片
              </div>
            </div>
          </el-form-item>
          <el-form-item label="热区">
            <hotzone
              class="hotzone"
              :image="t_data.config.imgUrl"
              :zones-init="zonesList"
              @add="handleAdd"
              @change="handleChange"
              @remove="handleRemove"
            />
            <div
              v-for="(item, index) in t_data.data"
              class="setting-item slider"
            >
              <div class="uploader-setting">
                <div
                  class="goods-select"
                  @click="handleGoodsChange(index)"
                >
                  <div
                    v-if="item.id"
                    class="link-content"
                  >
                    <template v-if="item.linkPage === 'goods'">
                      商品：
                    </template>
                    <template v-if="item.linkPage === 'category'">
                      分类：
                    </template>
                    <template v-if="item.linkPage === 'article'">
                      文章：
                    </template>
                    <!--template v-if="item.linkPage === 'planting'">种草：</template-->
                    <template v-if="item.linkPage === 'link'">
                      页面：
                    </template>
                    <template v-if="item.linkPage === 'marketing'">
                      营销：
                    </template>
                    {{ item.title }}
                  </div>
                  <div
                    v-else
                    class="content-center"
                  >
                    <i
                      class="iconfont icon-link"
                      @click="handleGoodsChange(index)"
                    />设置路径
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeimgsVisible"
    />
    <linkSetter
      :visible="linksVisible"
      :show_article="false"
      :show_planting="false"
      :show_page="false"
      :show_marketing="false"
      :show_store="false"
      @setLink="setLink"
      @closeDialog="closeDialog"
    />
  </div>
</template>
<script>
import hotzone from 'vue-hotzone'
import imgPicker from '@/components/imageselect'
import linkSetter from '@/components/template_links'
import { setTimeout } from 'timers'
export default {
  name: 'ImgHotzoneStyle',
  components: {
    hotzone,
    imgPicker,
    linkSetter
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      t_data: this.data,
      isGetImage: false,
      imgsVisible: false,
      linksVisible: false, // 路径设置组件
      cur_index: null,
      zonesList: JSON.parse(JSON.stringify(this.data.data))
    }
  },
  watch: {
    zonesList: {
      handler (newVal, oldVal) {
        console.log('zonesList watch-->', newVal)
        this.t_data.data = newVal
      },
      deep: true
    }
  },
  methods: {
    handleAdd (zone) {
      console.log('2handleAdd', zone)
      let item = {
        linkPage: '',
        title: '',
        id: ''
      }
      this.zonesList[this.zonesList.length] = item
      // this.zonesList.push(item)
      // this.t_data.data.push(item)
    },
    handleChange (zone) {
      console.log('1handleChange', zone)
      setTimeout(() => {
        zone.forEach((item, index) => {
          if (item.leftPer && item.heightPer) {
            let obj = {
              heightPer: item.heightPer,
              leftPer: item.leftPer,
              topPer: item.topPer,
              widthPer: item.widthPer
            }
            let tmp = [...this.zonesList] // 利用索引直接修改数组值，vue无法监听数组变化的解决方案
            tmp[index] = Object.assign({}, tmp[index], obj)
            this.zonesList = tmp
          }
        })
      }, 1000)
      //   console.log('handleChange', this.t_data.data)
    },
    handleRemove (index) {
      this.t_data.data.splice(index, 1)
    },
    // 图片选择器绑定事件
    handleImgChange (index) {
      this.imgsVisible = true
      this.isGetImage = true
      //   if (typeof index !== undefined) {
      //     this.cur_index = index
      //   }
    },
    handleGoodsChange (index) {
      this.linksVisible = true
      this.cur_index = index
    },
    setLink (data, type) {
      let tmp = [...this.t_data.data] // 利用索引直接修改数组值，vue无法监听数组变化的解决方案
      tmp[this.cur_index] = Object.assign({}, tmp[this.cur_index], { 'linkPage': type }, data)
      this.t_data.data = tmp
    },
    pickImg (data) {
      this.t_data.config.imgUrl = data.url
      this.imgsVisible = false
    },
    closeimgsVisible () {
      this.imgsVisible = false
    },
    closeDialog () {
      this.linksVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.hotzone {
  max-width: 500px;
  margin-bottom: 10px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}
.uploader-setting {
  padding: 0;
}
</style>
