<template>
  <div>
    <section class="section section-white content-padded view-flex view-flex-middle">
      <div class="view-flex view-flex-middle view-flex-item">
        <div>主题：</div>
        <div>
          <div class="theme-item">
            <div style="background: #fc7900" />
            <div style="background: #242526" />
          </div>
        </div>
      </div>
      <div class="content-right">
        <el-button type="primary" @click="save"> 保存 </el-button>
      </div>
    </section>
    <section class="section-white view-warp">
      <div class="pages-view">
        <div class="page active">
          <img alt="" src="@/assets/img/wxapp_member_sport.jpg" height="569" width="320">
        </div>
      </div>
      <div class="template-view">
        <div class="template" :style="'background:' + theme.bodyColor">
          <div
            class="template-header"
            :style="
              'background:' +
              theme.bgColor +
              ' url(' +
              headerBg +
              ') no-repeat 0 4px; background-size: 100% auto;'
            "
          >
            <div class="template-title" :style="'color:' + theme.fontColor">标题</div>
          </div>
          <el-carousel height="160px" :autoplay="false">
            <el-carousel-item
              v-for="(item, index) in form.bannerPicList"
              v-if="item.url"
              :key="index"
              :style="
                'background: url(' +
                wximageurl +
                item.url +
                ') no-repeat center; background-size: cover'
              "
            />
          </el-carousel>
          <div class="view-flex view-flex-middle nav">
            <div class="view-flex-item content-center nav-item left-nav">我要买课</div>
            <div class="view-flex-item content-center nav-item right-nav">我要预约</div>
          </div>
          <div class="hot">
            <div class="hot-title">
              <text class="title-txt"> 热门课程 </text>
            </div>
            <div class="view-flex">
              <div class="hot-item-01">
                <div
                  class="hot-img"
                  :style="
                    'background:' +
                    theme.bgColor +
                    ' url(' +
                    wximageurl +
                    form.hotGoods[0].url +
                    ') center / cover no-repeat;'
                  "
                />
                <div class="hot-item-name">
                  {{ form.hotGoods[0].item_name }}
                </div>
              </div>
              <div class="view-flex view-flex-vertical view-flex-item">
                <div class="view-flex-item hot-item-02">
                  <div
                    class="hot-img"
                    :style="
                      'background:' +
                      theme.bgColor +
                      ' url(' +
                      wximageurl +
                      form.hotGoods[1].url +
                      ') center / cover no-repeat;'
                    "
                  />
                  <div class="hot-item-name">
                    {{ form.hotGoods[1].item_name }}
                  </div>
                </div>
                <div class="hot-more">
                  更多 <img class="hot-more-img" src="@/assets/img/arrow.png">
                </div>
              </div>
            </div>
          </div>
          <div class="store">
            <div class="store-more store-label">全部门店</div>
            <div class="content-center">
              <div class="store-name">桂林路店</div>
              <div class="store-desc">上海市徐汇区桂林路396号2号楼</div>
            </div>
            <div class="view-flex view-flex-center store-contact">
              <div class="store-contact-item">
                <img class="store-icon" src="@/assets/img/store_location.png">
                <div>1220 km</div>
              </div>
              <div class="store-contact-item">
                <img class="store-icon" src="@/assets/img/store_phone.png">
                <div>咨询</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-view">
        <div class="section">
          <div class="section-header with-border with-bg">轮播图配置</div>
          <div class="section-body">
            <div v-for="(item, index) in form.bannerPicList" class="setting-item slider">
              <div class="setting-remove" @click="handleDelBanner(index)">
                <i class="iconfont icon-trash-alt1" />
              </div>
              <div>
                <img
                  v-if="item.url"
                  :src="wximageurl + item.url"
                  class="banner-uploader"
                  @click="handleImgChange(index, 'banner')"
                >
                <div v-else class="banner-uploader" @click="handleImgChange(index, 'banner')">
                  <div class="content-center">
                    <i class="iconfont icon-camera" /><br>
                    上传图片
                  </div>
                </div>
              </div>
              <div class="goods-select" @click="handleGoodsChange(index, 'banner')">
                <div v-if="item.item_id">
                  {{ item.type === 'goods' ? '商品' : '活动' }}：{{ item.item_name }}
                </div>
                <div v-else class="content-center">
                  <i
                    class="iconfont icon-link"
                    @click="handleGoodsChange(index, 'banner')"
                  />绑定商品
                </div>
              </div>
            </div>
            <div class="content-center">
              <div class="frm-tips">
                只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）
              </div>
              <el-button
                type="primary"
                class="el-icon-plus banner-button-uploader"
                @click="handleAddBanner"
              >
                添加轮播图
              </el-button>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-header with-border with-bg">热门商品配置</div>
          <div class="section-body">
            <div v-for="(item, index) in form.hotGoods" class="setting-item hot">
              <div class="view-flex">
                <div class="content-right-margin">
                  <img
                    v-if="item.url"
                    :src="wximageurl + item.url"
                    class="banner-uploader"
                    @click="handleImgChange(index, 'hotGoods')"
                  >
                  <div v-else class="banner-uploader" @click="handleImgChange(index, 'hotGoods')">
                    <div class="content-center">
                      <i class="iconfont icon-camera" /><br>
                      上传图片
                    </div>
                  </div>
                </div>
                <div>
                  <div class="layout-tip">
                    <div class="layout-left" :style="index === 0 ? 'background:#fff' : ''" />
                    <div class="layout-item">
                      <div
                        class="layout-item layout-top"
                        :style="index === 1 ? 'background:#fff' : ''"
                      />
                      <div class="layout-item" />
                    </div>
                  </div>
                  <div class="frm-tips">
                    只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px）
                  </div>
                </div>
              </div>
              <div class="goods-select" @click="handleGoodsChange(index, 'hotGoods')">
                <div v-if="item.item_id">
                  {{ item.type === 'goods' ? '商品' : '活动' }}：{{ item.item_name }}
                </div>
                <div v-else class="content-center"><i class="iconfont icon-link" />绑定商品</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <el-dialog
      title="选择商品"
      width="820px"
      class="select-goods-box"
      :visible.sync="selectGoodsVisible"
    >
      <template>
        <el-form label-width="70px">
          <el-form-item label="选择路径">
            <el-radio-group v-model="type" @change="switchType">
              <el-radio :label="'goods'"> 商品 </el-radio>
              <el-radio :label="'marketing'"> 营销 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="type === 'goods'" label="配置数据">
            <el-transfer
              v-model="selectGoods"
              :titles="['商品列表', '已选中']"
              :button-texts="['移除选择', '添加选择']"
              :data="goodsList"
              @change="handleSelectChange"
            >
              <div slot="left-footer" class="transfer-footer">
                <el-pagination
                  v-if="total_count > params.pageSize"
                  small
                  layout="prev, pager, next"
                  :total="total_count"
                  :page-size="params.pageSize"
                  @current-change="handleSelectGoodsChange"
                />
              </div>
            </el-transfer>
          </el-form-item>
          <el-form-item v-if="type === 'marketing'" label="配置数据">
            <el-select v-model="selectedMarketing" placeholder="请选择">
              <el-option
                v-for="(item, index) in marketingList"
                :key="index"
                :label="item.title"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="section-footer with-border content-center" style="width: 100%">
          <el-button type="primary" @click="handleGoodsDialog"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
var img = require('@/assets/img/demo-img.jpg')
var logo = require('@/assets/img/logo_ico.svg')
var header = require('@/assets/img/topbar_white.png')

import imgPicker from '@/components/imageselect'
import { getItemsList } from '@/api/goods'
import { setPageParams, getParamByTempName, updateParamsById } from '@/api/wxa'

export default {
  components: {
    imgPicker
  },
  data() {
    return {
      demoimg: img,
      logo: logo,
      headerBg: header,
      type: 'goods',
      theme: {
        bgColor: '#242526',
        fontColor: '#fff',
        bodyColor: '#fff'
      },
      data: {
        hotImg: '@/assets/img/pro_img.jpg',
        hotImgSc: '@/assets/img/pro_img_01.jpg',
        sliderImgs: [
          {
            pic: '@/assets/img/pro_img.jpg',
            goodsId: ''
          },
          {
            pic: '@/assets/img/pro_img_01.jpg',
            goodsId: ''
          }
        ],
        news: null
      },
      form: {
        bannerPicList: [],
        hotGoods: [
          { url: '', item_id: '', item_name: '', type: '' },
          { url: '', item_id: '', item_name: '', type: '' }
        ]
      },
      selectGoods: [],
      selectItem: {
        item_id: 0,
        item_name: ''
      },
      goodsList: [],
      params: {
        page: 1,
        pageSize: 20
      },
      total_count: 0,
      isGetImage: false,
      imgDialog: false,
      selectGoodsVisible: false,
      currentType: 'banner',
      currentIndex: 0,
      bannerPicListSetId: 0,
      hotGoodsSetId: 0,
      marketingList: [
        {
          title: '限时团购',
          value: 'groups_list'
        }
      ],
      selectedMarketing: ''
    }
  },
  mounted() {
    let filter = { template_name: 'yykmendian', name: 'banner', page_name: 'index' }
    getParamByTempName(filter).then(res => {
      if (res.data.data) {
        this.form.bannerPicList = res.data.data[0].params
        this.bannerPicListSetId = res.data.data[0].id
      }
    })
    let hotGoodsFilter = { template_name: 'yykmendian', name: 'hotGoods', page_name: 'index' }
    getParamByTempName(hotGoodsFilter).then(res => {
      if (res.data.data) {
        this.form.hotGoods = res.data.data[0].params
        this.hotGoodsSetId = res.data.data[0].id
      }
    })
  },
  methods: {
    handleAddBanner() {
      if (!this.form.bannerPicList) {
        this.form.bannerPicList = []
      }
      let item = { url: '', item_id: 0, item_name: '' }
      if (this.form.bannerPicList.length > 4) {
        this.$message({
          message: '轮播图最多添加5个图片',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.form.bannerPicList.push(item)
      }
    },
    switchType() {
      if (this.type === 'goods' && this.goodsList.length == 0) {
        this.getGoodsList()
      }
    },
    handleGoodsChange(index, type_name) {
      this.currentIndex = index
      this.currentType = type_name
      this.selectGoodsVisible = true
      this.selectGoods = []
      if (this.currentType == 'banner') {
        let item = this.form.bannerPicList[this.currentIndex]
        this.type = item.type ? item.type : 'goods'
        if (item.type == 'goods') {
          if (item.item_id) {
            this.selectGoods = [item.item_id]
          }
          this.getGoodsList()
        } else {
          this.selectedMarketing = item.item_id
        }
      } else {
        let item = this.form.hotGoods[this.currentIndex]
        this.type = item.type ? item.type : 'goods'
        if (item.type == 'goods') {
          if (item.item_id) {
            this.selectGoods = [item.item_id]
          }
          this.getGoodsList()
        } else {
          this.selectedMarketing = item.item_id
        }
      }
    },
    handleDelBanner(index) {
      this.form.bannerPicList.splice(index, 1)
    },
    handleImgChange(index, type_name) {
      this.imgDialog = true
      this.isGetImage = true
      this.currentType = type_name
      this.currentIndex = index
    },
    pickImg(data) {
      if (this.currentType == 'hotGoods') {
        this.form.hotGoods[this.currentIndex].url = data.url
      } else {
        this.form.bannerPicList[this.currentIndex].url = data.url
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    //选择商品分页
    handleSelectGoodsChange(val) {
      this.params.page = val
      this.goodsList.forEach(row => {
        //如果选中
        let index = this.selectGoods.indexOf(row.key)
        if (index != -1) {
          if (this.currentType == 'banner') {
            this.form.bannerPicList[this.currentIndex].item_id = row.key
            this.form.bannerPicList[this.currentIndex].item_name = row.label
          } else {
            this.form.hotGoods[this.currentIndex].item_id = row.key
            this.form.hotGoods[this.currentIndex].item_name = row.label
          }
        }
      })
      this.getGoodsList()
    },
    //选择商品触发事件
    handleSelectChange(value, direction, movedKeys) {
      if (value.length > 1) {
        this.$message({
          message: '最多选择一个商品',
          type: 'error',
          duration: 5 * 1000
        })
      }
      this.selectGoods.splice(1)
    },
    //选择商品确认
    handleGoodsDialog() {
      this.selectGoodsVisible = false
      if (this.selectGoods.length > 0) {
        if (this.type == 'goods') {
          this.goodsList.forEach(row => {
            //如果选中
            let index = this.selectGoods.indexOf(row.key)
            if (index != -1) {
              if (this.currentType == 'banner') {
                this.form.bannerPicList[this.currentIndex].item_id = row.key
                this.form.bannerPicList[this.currentIndex].item_name = row.label
                this.form.bannerPicList[this.currentIndex].type = 'goods'
              } else {
                this.form.hotGoods[this.currentIndex].item_id = row.key
                this.form.hotGoods[this.currentIndex].item_name = row.label
                this.form.hotGoods[this.currentIndex].type = 'goods'
              }
            }
          })
        }
        if (this.type == 'marketing') {
          if (this.selectedMarketing) {
            let obj = {
              title: '',
              value: ''
            }
            this.marketingList.forEach(item => {
              if (this.selectedMarketing === item.value) {
                ;(obj.title = item.title), (obj.value = item.value)
              }
            })
            if (this.currentType == 'banner') {
              this.form.bannerPicList[this.currentIndex].item_id = obj.value
              this.form.bannerPicList[this.currentIndex].item_name = obj.title
              this.form.bannerPicList[this.currentIndex].type = 'marketing'
            } else {
              this.form.hotGoods[this.currentIndex].item_id = obj.value
              this.form.hotGoods[this.currentIndex].item_name = obj.title
              this.form.hotGoods[this.currentIndex].type = 'marketing'
            }
          } else {
            this.$message({
              message: '请选择营销活动',
              type: 'error'
            })
            return
          }
        }
      } else {
        if (this.currentType == 'banner') {
          this.form.bannerPicList[this.currentIndex].item_id = ''
          this.form.bannerPicList[this.currentIndex].item_name = ''
        } else {
          this.form.hotGoods[this.currentIndex].item_id = ''
          this.form.hotGoods[this.currentIndex].item_name = ''
        }
      }
      this.selectGoods = []
    },
    getGoodsList() {
      getItemsList(this.params).then(response => {
        this.goodsList = []
        response.data.data.list.forEach(row => {
          let itemid = ''
          if (this.currentType == 'banner') {
            itemid = this.form.bannerPicList[this.currentIndex].item_id
          } else {
            itemid = this.form.hotGoods[this.currentIndex].item_id
          }
          if (row.itemId != itemid) {
            this.goodsList.push({
              key: row.itemId,
              label: row.itemName
            })
          }
        })
        if (this.currentType == 'banner') {
          if (this.form.bannerPicList[this.currentIndex].item_id) {
            this.goodsList.push({
              key: this.form.bannerPicList[this.currentIndex].item_id,
              label: this.form.bannerPicList[this.currentIndex].item_name
            })
          }
        } else {
          if (this.form.hotGoods[this.currentIndex].item_id) {
            this.goodsList.push({
              key: this.form.hotGoods[this.currentIndex].item_id,
              label: this.form.hotGoods[this.currentIndex].item_name
            })
          }
        }
        this.total_count = response.data.data.total_count
      })
    },
    save() {
      if (this.bannerPicListSetId) {
        let bannerParams = {
          params: this.form.bannerPicList,
          template_name: 'yykmendian',
          name: 'banner',
          page_name: 'index',
          id: this.bannerPicListSetId
        }
        updateParamsById(bannerParams).then(response => {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      } else {
        let bannerParams = {
          params: this.form.bannerPicList,
          template_name: 'yykmendian',
          name: 'banner',
          page_name: 'index'
        }
        setPageParams(bannerParams).then(response => {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      }

      if (this.hotGoodsSetId) {
        let hotGoodsParams = {
          params: this.form.hotGoods,
          template_name: 'yykmendian',
          name: 'hotGoods',
          page_name: 'index',
          id: this.hotGoodsSetId
        }
        updateParamsById(hotGoodsParams).then(response => {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      } else {
        let hotGoodsParams = {
          params: this.form.hotGoods,
          template_name: 'yykmendian',
          name: 'hotGoods',
          page_name: 'index'
        }
        setPageParams(hotGoodsParams).then(response => {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.theme-item {
  float: left;
  display: flex;
  margin-left: 15px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  vertical-align: middle;
  & > div {
    flex: 1;
    height: 30px;
    &:first-child {
      border-radius: 30px 0 0 30px;
    }
    &:last-child {
      border-radius: 0 30px 30px 0;
    }
  }
}
.view-warp {
  position: relative;
  min-height: 600px;
}
.pages-view {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  padding: 30px 0;
  overflow-x: hidden;
  overflow-y: auto;
  border-right: 1px solid #efefef;
  .page {
    width: 150px;
    height: 150px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    &.active {
      box-shadow: 0 0 3px rgba(255, 29, 0, 1);
    }
    img {
      display: inline-block;
      width: auto;
      height: 100%;
    }
  }
}
.template-view {
  margin-left: 220px;
  margin-right: 420px;
  padding: 50px 0;
  .template {
    width: 320px;
    margin: 0 auto;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
    .template-header {
      height: 52px;
      padding-top: 15px;
    }
    .template-title {
      width: 100px;
      height: 36px;
      line-height: 36px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    .section {
      margin-bottom: 10px;
    }
  }
}
.setting-view {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  overflow-y: auto;
  overflow-x: hidden;
  border-left: 1px solid #efefef;
  .app-list {
    border-bottom: 1px solid #efefef;
    .app {
      width: 32px;
      height: 32px;
      line-height: 32px;
      margin-right: 5px;
      border-radius: 50%;
      background: #ff7000;
      color: #fff;
      text-align: center;
      font-size: 20px;
      &.nonactivated {
        background: #efefef;
        color: #cacaca;
      }
    }
  }
  .setting-item {
    display: block;
    position: relative;
    margin-bottom: 30px;
    .setting-remove {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      color: #ff5000;
    }
  }
  .banner-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 50px;
    }
    color: #8c939d;
    width: 350px;
    height: 175px;
    color: #dadadd;
    border: 1px dashed #ddd;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .goods-select {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 24px;
      margin-right: 10px;
      color: #dadadd;
    }
    color: #8c939d;
    width: 350px;
    height: 60px;
    padding: 10px;
    border: 1px dashed #ddd;
    cursor: pointer;
    .thumb {
      display: inline-block;
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .el-transfer {
    text-align: center;
    padding: 10px 0 20px;
  }
  .slider {
    .banner-uploader {
      width: 350px;
      height: 175px;
    }
    .goods-uploader {
      width: 350px;
      height: 60px;
    }
  }
  .hot {
    .banner-uploader {
      width: 150px;
      height: 175px;
    }
    .goods-uploader {
      height: 60px;
    }
  }
  .layout-tip {
    display: flex;
    width: 75px;
    height: 65px;
    border: 1px solid #dadadd;
    div {
      background: #efefef;
    }
    .layout-item {
      flex: 1;
    }
    .layout-left {
      width: 45px;
      border-right: 1px solid #dadadd;
    }
    .layout-right {
      display: flex;
      flex-direction: column;
    }
    .layout-top {
      height: 50px;
      border-bottom: 1px solid #dadadd;
    }
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 160px;
  margin: 0;
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.mark {
  font-size: 20px;
  color: #fc7900;
}
.notice {
  padding: 10px 15px;
  background: #fc7900;
  border-top: 1px dotted rgba(255, 255, 255, 0.3);
  .notice-icon {
    width: 20px;
    height: 20px;
  }
  .notice-desc {
    color: #fff;
    font-size: 14px;
  }
  .join-btn {
    padding: 0 10px;
    line-height: 25px;
    border: 1px solid #fff;
    border-radius: 5px;
    color: #fff;
    font-size: 12px;
  }
}
.nav {
  position: relative;
  height: 60px;
  border-radius: 30px;
  margin: 20px 8%;
  background: #ff6900;
  .nav-item {
    position: relative;
    font-size: 17px;
    color: #fff;
  }
  .nav-icon {
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }
  &::after {
    position: absolute;
    top: -5px;
    left: 50%;
    width: 1px;
    height: 70px;
    transform: rotate(30deg);
    background: #fff;
    content: '';
  }
  .left-nav::after,
  .right-nav::after {
    position: absolute;
    width: 1px;
    height: 30px;
    transform: rotate(30deg);
    background: #fff;
    content: '';
  }
  .left-nav::after {
    top: -25px;
    right: -9px;
    margin-left: -5px;
  }
  .right-nav::after {
    bottom: -25px;
    left: -8px;
    margin-right: -5px;
  }
}
.hot {
  margin: 0 15px;
  .hot-title {
    position: relative;
    font-size: 16px;
    color: #999;
    text-align: center;
    .title-txt {
      padding: 15px;
      display: inline-block;
      position: relative;
      background: #fff;
      z-index: 10;
    }
  }
  .hot-title::after,
  .hot-title::before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 190px;
    height: 1px;
    transform: translateX(-50%);
    background: #efefef;
    z-index: -1;
    content: '';
  }
  .hot-title::before {
    top: 46%;
  }
  .hot-title::after {
    bottom: 46%;
  }
  .hot-item-01 {
    position: relative;
    width: 60%;
    height: 250rpx;
    .hot-item-name {
      top: 0;
    }
    .hot-item-rate {
      bottom: 0;
    }
  }
  .hot-item-02 {
    position: relative;
    height: 200px;
    .hot-item-name {
      bottom: 0;
      right: 0;
    }
    .hot-item-rate {
      top: 0;
    }
  }
  .hot-item-name {
    position: absolute;
    left: 0;
    padding: 10px;
    font-size: 13px;
    background: #ff6900;
    color: #fff;
  }
  .hot-item-rate {
    position: absolute;
    left: 0;
    padding: 10px 13px;
    font-size: 24rpx;
    color: #ff6900;
    .rate-icon {
      width: 23px;
      height: 23px;
    }
  }
  .hot-img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .hot-more {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    height: 50px;
    background: #271f20;
    color: #ff6900;
    font-size: 13px;
  }
  .hot-more-img {
    width: 22px;
    height: 22px;
  }
}
.store {
  padding: 20px;
  .store-label {
    margin-bottom: 15px;
  }
  .store-name {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
  }
  .store-desc {
    font-size: 14px;
    color: #999;
  }
  .store-contact {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 15px;
    font-size: 13px;
    color: #ff4925;
    text-align: center;
    .store-contact-item {
      padding: 0 20px;
    }
  }
  .store-more {
    display: inline-block;
    padding: 0 10px;
    border-radius: 20px;
    border: 1px solid #ff6900;
    color: #ff6900;
    font-size: 13px;
    line-height: 21px;
  }
  .store-icon {
    width: 35px;
    height: 35px;
    margin-bottom: 5px;
  }
}
</style>

<style lang="scss">
.el-carousel__button {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.select-goods-box {
  .el-transfer-panel {
    text-align: left;
    width: 270px;
    .el-transfer-panel__body {
      height: 270px;
    }
  }
}
</style>
