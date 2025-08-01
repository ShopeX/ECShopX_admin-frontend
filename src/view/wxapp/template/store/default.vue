<template>
  <div>
    <section class="section section-white content-padded view-flex view-flex-middle">
      <div class="view-flex view-flex-middle view-flex-item">
        <div>主题：</div>
        <div>
          <div class="theme-item" style="background: #fff" />
        </div>
      </div>
      <div class="content-right">
        <el-switch
          v-model="settings.pay"
          class="content-right-margin"
          active-color="#ff5000"
          inactive-text="买单"
        />
        <el-switch
          v-model="settings.recharge"
          class="content-right-margin"
          active-color="#ff5000"
          inactive-text="储值"
        />
        <el-button type="primary" @click="onSubmit"> 保存 </el-button>
      </div>
    </section>
    <section class="section-white view-warp">
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
          <div class="member-header">
            <div
              class="view-flex view-flex-justify view-flex-vertical member-card"
              :style="'background: #efefef url(' + demoimg + '); background-size: cover'"
            >
              <div class="view-flex view-flex-center">
                <div class="member-card-avatar">
                  <img class="member-card-avatar-img" :src="logo">
                </div>
                <div class="view-flex view-flex-center view-flex-item view-flex-vertical">
                  <div class="store-name">源源客</div>
                  <div class="level-name">源源客会员卡</div>
                </div>
              </div>
              <div class="view-flex view-flex-right">
                <div class="member-card-level">
                  <div class="member-card-level-num" />
                  <div class="member-card-level-bar" />
                  <div class="member-card-level-tip">还差100元升级为白金会员</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section section-white member-coupon">
            <div class="view-flex view-flex-center view-flex-middle code-toggle">
              <img class="code-toggle-img" src="@/assets/img/qr_code.png">
              <img class="item-icon" src="@/assets/img/icon_down.png">
            </div>
            <div class="section-title content-center">我的资产</div>
            <div class="section-body">
              <div class="view-flex content-center member-coupon-wrapper">
                <div class="view-flex-item view-flex-vertical member-coupon-item">
                  <div>¥ 122.00</div>
                  <div><img class="member-coupon-icons" src="@/assets/img/icon_01.png"> 储值</div>
                </div>
                <div class="view-flex-item view-flex-vertical member-coupon-item">
                  <div>6 张</div>
                  <div>
                    <img class="member-coupon-icons" src="@/assets/img/icon_02.png"> 优惠券
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="section section-white nearly-store">
            <div class="section-header content-center">附近门店</div>
            <div class="section-body view-flex nearly-store-info">
              <div class="view-flex-item info-content">
                <div class="store-name">商派软件有限公司</div>
                <div class="store-address">上海市徐汇区田林路396号2号楼</div>
                <div class="store-open-time">营业时间：9:30 - 18:30</div>
              </div>
              <div class="view-flex view-flex-vertical view-flex-middle store-location">
                <img class="store-location-img" src="@/assets/img/icon_location.png">12km
              </div>
            </div>
            <div
              class="view-flex view-flex-middle view-flex-right section-footer with-border content-right"
            >
              全部门店 <img class="icon-to-all" src="@/assets/img/icon_to.png">
            </div>
          </div>
          <div class="appmsg">
            <div class="appmsg-header">
              <img class="appmsg-header-img" :src="wximageurl + articals[0].thumb_url">
              <div class="appmsg-header-caption">
                <template v-if="articals[0].title != ''">
                  {{ articals[0].title }}
                </template>
                <template v-else> 标题 </template>
              </div>
            </div>
            <div v-for="(item, index) in articals" v-if="index !== 0" class="appmsg-list">
              <div class="appmsg-list-item">
                <div class="appmsg-list-item-title">
                  <template v-if="item.title != ''">
                    {{ item.title }}
                  </template>
                  <template v-else> 标题 </template>
                </div>
                <div class="appmsg-list-item-thumb">
                  <img class="appmsg-list-item-thumb-img" :src="wximageurl + item.thumb_url">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-view">
        <div v-if="data.news" class="msgSender_content">
          <div
            class="msg msg-item has-first-cover"
            :class="data.news.content.news_item.length > 1 ? 'multi' : 'single'"
          >
            <div class="msg-content">
              <div class="msg-info">
                <span>更新于 {{ data.news.content.update_time | datetime }}</span>
              </div>
              <div
                class="sub-msg-item"
                :class="data.news.content.news_item.length > 1 ? 'coverMsgItem' : ''"
              >
                <h4 class="msg-title">
                  <a>{{ data.news.content.news_item[0].title }}</a>
                </h4>
                <div
                  class="msg-thumb-wrap"
                  :style="{
                    backgroundImage:
                      'url(' + wximageurl + data.news.content.news_item[0].thumb_url + ')'
                  }"
                />
                <a :href="data.news.content.news_item[0].url" class="edit-mask preview-mask">
                  <div class="edit-mask-content">预览文章</div>
                </a>
                <p v-if="data.news.content.news_item.length === 1" class="msg-desc">
                  {{ data.news.content.news_item[0].digest }}
                </p>
              </div>
              <div v-for="(item, index) in data.news.content.news_item" v-if="index !== 0" :key="">
                <div
                  v-if="data.news.content.news_item.length > 1"
                  class="article-msg-item has-cover clearfix"
                >
                  <div
                    class="msg-thumb-wrap"
                    :style="{ backgroundImage: 'url(' + wximageurl + item.thumb_url + ')' }"
                  />
                  <h4 class="msg-title">
                    <a>{{ item.title }}</a>
                  </h4>
                  <a :href="item.url" class="edit-mask preview-mask">
                    <div class="edit-mask-content">预览文章</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="">
          <div class="appmsg_preview_area">
            <div class="appmsg_preview_container">
              <div id="submitContent" />
              <div class="appmsg_container_hd">
                <h4 class="appmsg_container_title">小程序营销文章配置</h4>
              </div>
              <div class="appmsg_container_bd">
                <div class="appmsg multi has_first_cover editing">
                  <div id="js_appmsg_preview" class="appmsg_content">
                    <template v-for="(item, index) in articals">
                      <div
                        v-if="index === 0"
                        class="js_appmsg_item appmsg_item_wrp"
                        :class="id === index ? 'current' : ''"
                        @click="handleClick(index)"
                      >
                        <div class="first_appmsg_item" title="第一篇图文">
                          <div class="cover_appmsg_item">
                            <h4 class="appmsg_title">
                              <a
                                class="js_appmsg_title"
                                href="javascript:void(0);"
                                onclick="return false;"
                              >
                                <template v-if="articals[0].title != ''">
                                  {{ articals[0].title }}
                                </template>
                                <template v-else> 标题 </template>
                              </a>
                            </h4>
                            <div
                              class="appmsg_thumb_wrp"
                              :style="{
                                backgroundImage:
                                  'url(' + (item.thumb_url ? wximageurl + item.thumb_url : '') + ')'
                              }"
                            >
                              <div v-if="!item.thumb_url" class="appmsg_thumb default">
                                <i class="icon_appmsg_thumb el-icon-picture" />
                              </div>
                            </div>
                          </div>
                          <div class="appmsg_edit_mask">
                            <a
                              onclick="return false;"
                              class="icon20_common iconfont icon-arrow-down sort_down_white"
                              title="下移"
                              @click.prevent="sortdown(index)"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        v-else
                        class="js_appmsg_item appmsg_item_wrp"
                        :class="id === index ? 'current' : ''"
                        @click="handleClick(index)"
                      >
                        <div class="appmsg_item has_cover">
                          <div
                            class="appmsg_thumb_wrp"
                            :style="{
                              backgroundImage:
                                'url(' + (item.thumb_url ? wximageurl + item.thumb_url : '') + ')'
                            }"
                          >
                            <div v-if="!item.thumb_url" class="appmsg_thumb default">
                              <i class="icon_appmsg_thumb_small el-icon-picture" />
                            </div>
                          </div>
                          <h4 class="appmsg_title js_appmsg_title">
                            <template v-if="item.title != ''">
                              {{ item.title }}
                            </template>
                            <template v-else> 标题 </template>
                          </h4>
                          <div class="appmsg_edit_mask">
                            <a
                              class="icon20_common sort_up_white iconfont icon-arrow-up"
                              title="上移"
                              @click.prevent="sortup(index)"
                            />
                            <a
                              v-if="index !== articals.length - 1"
                              class="icon20_common sort_down_white iconfont icon-arrow-down"
                              title="下移"
                              @click.prevent="sortdown(index)"
                            />
                            <el-popover
                              v-model="item.popVisible"
                              placement="bottom"
                              width="220"
                              trigger="click"
                            >
                              <p class="content-padded content-center" style="font-size: 14px">
                                确定删除这篇文章？
                              </p>
                              <div class="content-center">
                                <el-button @click="item.popVisible = false"> 取消 </el-button>
                                <el-button type="primary" @click="remove(index)"> 确定 </el-button>
                              </div>
                              <a
                                v-if="!isEditting"
                                slot="reference"
                                class="icon20_common del_media_white el-icon-delete"
                                title="删除"
                              />
                            </el-popover>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div
                  v-if="!isEditting"
                  title="添加一篇图文"
                  class="create_access_primary appmsg_add"
                  @click="addmsg"
                >
                  <i class="icon35_common el-icon-plus" />
                </div>
              </div>
            </div>
          </div>
          <div class="appmsg_input_area">
            <template v-for="(item, index) in articals" v-if="id === index">
              <el-form ref="item" :model="item" label-position="top" label-width="80px">
                <div class="content-padded">
                  <el-form-item label="标题" style="height: 80px">
                    <el-input v-model="item.title" placeholder="请输入标题" />
                  </el-form-item>
                  <el-form-item style="height: 380px">
                    <SpRichText v-model="item.viewcontent" />
                  </el-form-item>
                </div>
                <div class="content-padded appmsg_edit_highlight_area" style="height: 420px">
                  <h3 class="header-title">发布样式编辑</h3>
                  <div class="header_tips">
                    封面小图片 <span class="form-text-tip">建议尺寸：200像素 * 200像素</span>
                  </div>
                  <el-form-item>
                    <div>
                      <el-button @click="addThumbPreview"> 从图片库选择 </el-button>
                    </div>
                    <div
                      v-if="item.thumb_url"
                      class="cover_preview"
                      :style="{
                        backgroundImage:
                          'url(' + (item.thumb_url ? wximageurl + item.thumb_url : '') + ')'
                      }"
                    />
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </div>
          <div class="appmsg_tpl_area">
            <div class="appmsg_tpl_container">
              <div class="appmsg_container_hd">
                <h4 class="appmsg_container_title">多媒体</h4>
              </div>
              <div class="appmsg_container_bd">
                <ul id="js_media_list" class="tpl_list">
                  <li class="tpl_item img" style="" @click="addImgPreview">
                    <i class="iconfont icon-image" />图片
                  </li>
                </ul>
                <imgPicker
                  :dialog-visible="thumbDialog"
                  :sc-status="isGetThumb"
                  @chooseImg="pickThumb"
                  @closeImgDialog="closeThumbDialog"
                />
                <imgPicker
                  :dialog-visible="imgDialog"
                  :sc-status="isGetImage"
                  @chooseImg="pickImg"
                  @closeImgDialog="closeImgDialog"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
var img = require('@/assets/img/demo-img.jpg')
var logo = require('@/assets/img/logo_ico.svg')
var header = require('@/assets/img/topbar.png')

import imgPicker from '../../../../components/imageselect'
import { setPageParams, getParamByTempName, updateParamsById } from '../../../../api/wxa'

export default {
  components: {
    imgPicker
  },
  data() {
    return {
      demoimg: img,
      logo: logo,
      headerBg: header,
      theme: {
        bgColor: '#fff',
        fontColor: '#333',
        bodyColor: '#efefef'
      },
      data: {
        news: null
      },
      settings: {
        pay: true,
        recharge: true
      },
      isGetNews: false,
      newsVisible: false,
      imgDialog: false,
      thumbDialog: false,
      isGetImage: false,
      isGetThumb: false,
      pageSettingId: 0,
      commonSettingId: 0,
      id: 0,
      isEditting: false,
      articals: [
        {
          title: '',
          content: '',
          viewcontent: '',
          thumb_url: '',
          popVisible: false
        }
      ]
    }
  },
  mounted() {
    let filter = { template_name: 'yykmembership', name: 'marketing_articles', page_name: 'index' }
    getParamByTempName(filter).then(response => {
      if (response.data.data.length > 0) {
        var data = response.data.data[0].params
        for (var i = 0; i < data.length; i++) {
          if (data[i].popVisible === 'false') {
            data[i].popVisible = false
          }
        }
        this.articals = data
        this.pageSettingId = response.data.data[0].id
        this.articals[this.id].viewcontent = this.articals[this.id].content.replace(
          /<img data-src="(.*?)/g,
          '<img src="' + process.env.WXIMG_URL + '"'
        )
      }
    })
    let settingFilter = {
      template_name: 'yykmembership',
      name: 'common_setting',
      page_name: 'index'
    }
    getParamByTempName(settingFilter).then(response => {
      if (response.data.data.length > 0) {
        var data = response.data.data[0].params
        this.settings.recharge = data.recharge === 'true'
        this.settings.pay = data.pay === 'true'
        this.commonSettingId = response.data.data[0].id
      }
    })
  },
  methods: {
    addImgPreview() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      if (data && data.url !== '') {
        this.imgDialog = false
        var index = this.$refs.editor[0].$el.id
        var loc = this.$refs.editor[0]
        var img = new Image()
        img.src = this.wximageurl + data.url
        if (loc.range) {
          loc.range.insertNode(img)
        } else {
          loc.$refs.content.appendChild(img)
          loc.focus()
          loc.restoreSelection()
        }
        this.articals[index].viewcontent = loc.$refs.content.innerHTML
      }
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    addThumbPreview() {
      this.thumbDialog = true
      this.isGetThumb = true
    },
    pickThumb(data) {
      if (data && data.url !== '') {
        this.thumbDialog = false
        this.articals[this.id].thumb_url = data.url
      }
    },
    closeThumbDialog() {
      this.thumbDialog = false
    },
    handleClick(index) {
      this.id = +index
      if (this.isEditting) {
        this.articals[this.id].viewcontent = this.articals[this.id].content.replace(
          /<img data-src="(.*?)/g,
          '<img src="' + process.env.WXIMG_URL + '"'
        )
        var loc = this.$refs.editor[0].$refs.content
      }
    },
    addmsg() {
      if (this.articals.length > 3) {
        this.$message({ message: '最多添加4条文章', type: 'error' })
        return
      }
      let baseMsgData = {
        title: '',
        content: '',
        viewcontent: '',
        thumb_url: '',
        popVisible: false
      }
      this.articals.push(baseMsgData)
    },
    sortup(index) {
      this.articals[index - 1] = this.articals.splice(index, 1, this.articals[index - 1])[0]
    },
    sortdown(index) {
      this.articals[index + 1] = this.articals.splice(index, 1, this.articals[index + 1])[0]
    },
    remove(index) {
      this.id = +(index - 1)
      this.articals.splice(index, 1)
      this.popVisible = false
    },
    updateContent(data) {
      let index = this.$refs.editor[0].$el.id
      this.articals[index].viewcontent = data
    },
    onSubmit() {
      var reg = new RegExp(this.wximageurl, 'g')
      for (var i = 0; i < this.articals.length; i++) {
        this.articals[i].content = this.articals[i].viewcontent.replace(reg, '')
        var submitContent = document.getElementById('submitContent')
        submitContent.innerHTML = this.articals[i].content
        this.articals[i].content = submitContent.innerHTML
      }
      var that = this
      let param = {}
      if (that.pageSettingId) {
        param = { params: that.articals, name: 'marketing_articles', id: that.pageSettingId }
        updateParamsById(param).then(response => {
          this.$message({
            message: '修改文章成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      } else {
        param = {
          params: that.articals,
          template_name: 'yykmembership',
          name: 'marketing_articles',
          page_name: 'index'
        }
        setPageParams(param).then(response => {
          this.$message({
            message: '添加文章成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      }

      let settingParam = {}
      if (that.commonSettingId) {
        settingParam = { params: that.settings, name: 'common_setting', id: that.commonSettingId }
        updateParamsById(settingParam).then(response => {
          this.$message({
            message: '修改配置成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      } else {
        settingParam = {
          params: that.settings,
          template_name: 'yykmembership',
          name: 'common_setting',
          page_name: 'index'
        }
        setPageParams(settingParam).then(response => {
          this.$message({
            message: '添加配置成功',
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
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: #efefef;
    content: '';
  }
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
  float: left;
  width: 350px;
  padding: 30px 0;
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
  position: relative;
  margin-left: 350px;
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
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 1px;
    background: #efefef;
    content: '';
  }
}

/* template */
.member-header {
  height: 190px;
  overflow: hidden;
}
.member-card {
  position: relative;
  height: 170px;
  border-radius: 5px;
  background: #fff;
  margin: 10px;
  padding: 15px;
  color: #fff;
  overflow: hidden;
  .store-name {
    font-size: 16px;
  }
  .level-name {
    font-size: 13px;
  }
  &-avatar {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    background: rgba(255, 255, 255, 0.5);
    &-img {
      width: 100%;
      height: 100%;
    }
  }
  &-level {
    text-align: right;
    &-num {
      font-size: 14px;
    }
    &-bar {
      width: 100%;
      margin-bottom: 8px;
    }
    &-tip {
      font-size: 12px;
    }
  }
  &::after {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    content: ' ';
  }
  .view-flex {
    position: relative;
    z-index: 5;
  }
  .card-handle {
    position: relative;
    z-index: 5;
    button[type='default'][plain] {
      color: #fff;
      border-color: #fff;
    }
  }
}
.member-coupon {
  position: relative;
  padding-top: 50px;
  .code-toggle {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 50%;
    top: -15px;
    margin-left: -20px;
    width: 40px;
    height: 60px;
    border-radius: 20px;
    background: #fff;
    &-img {
      display: block;
      width: 18px;
      height: 18px;
    }
    .item-icon {
      width: 16px;
      height: 16px;
      margin-top: 3px;
    }
  }
  &-icons {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
  .member-coupon-item {
    display: flex;
    justify-content: center;
    height: 60px;
  }
  .member-coupon-wrapper {
    position: relative;
  }
  .member-coupon-wrapper:after {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 0.5px;
    content: ' ';
    background: #eaeaea;
  }
}
.pay-code {
  padding: 10px 0 40px 0;
  .code-num,
  .code-tip {
    font-size: 14px;
  }
  &-bar {
    width: 250px;
    height: 50px;
    margin-bottom: 10px;
  }
  &-qr {
    width: 140px;
    height: 140px;
    margin-bottom: 10px;
  }
  &-btn {
    margin-top: 10px;
    display: inline-block;
  }
}
.nearly-store {
  &-info {
    align-items: center;
    .info-content {
      padding-right: 10px;
    }
  }
  .store-name {
    margin-bottom: 5px;
    font-size: 16px;
  }
  .store-address {
    font-size: 13px;
    color: #999;
  }
  .store-open-time {
    font-size: 13px;
    color: #999;
  }
  .store-location {
    color: #999;
  }
  .store-location-img {
    width: 21px;
    height: 21px;
    margin-bottom: 5px;
  }
  .icon-to-all {
    width: 14px;
    height: 14px;
  }
}
.msgSender_content {
  width: 320px;
  margin: 0 auto;
}
.msg-item {
  width: 320px;
}

.appmsg_input_area {
  margin: 0 140px 0 251px;
  position: relative;
}

.appmsg_preview_area {
  position: absolute;
  left: 0;
  height: 100%;
}
.appmsg_preview_container {
  width: 250px;
  padding: 20px 0;
  border-right: 1px solid #e7e7eb;
  background-color: #f8f8f8;
  height: 100%;
}
.appmsg {
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid #e7e7eb;
  background-color: #fff;
  color: #666;
}
.appmsg_content {
  position: relative;
}
.appmsg_preview_container .appmsg {
  overflow: visible;
  margin-bottom: 0;
  padding: 0;
}
.appmsg_preview_container .appmsg_content {
  min-height: 134px;
  margin-top: -1px;
}
.multi .appmsg_content {
  padding: 0;
}
.appmsg_preview_container .appmsg_item_wrp {
  cursor: pointer;
}
.appmsg_preview_container .appmsg_item_wrp.current {
  position: relative;
  z-index: 1;
  margin-left: -1px;
  margin-right: -1px;
  margin-bottom: -1px;
}
.appmsg_preview_container .appmsg_item,
.appmsg_preview_container .first_appmsg_item {
  padding: 10px;
}
.appmsg_preview_container .first_appmsg_item {
  border-top: 1px solid #e7e7eb;
  position: relative;
}
.appmsg_preview_container .appmsg_item_wrp.current .first_appmsg_item,
.appmsg_preview_container .appmsg_item_wrp.current .appmsg_item {
  border-top-width: 0;
  padding: 9px 9px;
  border: 2px solid #43b548;
}
.cover_appmsg_item {
  position: relative;
  margin: 12px 14px;
}
.has_first_cover .cover_appmsg_item {
  margin: 12px 14px 12px;
}
.appmsg_preview_container .first_appmsg_item .cover_appmsg_item {
  margin: 0;
}
.appmsg_title {
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 1.6;
  max-height: 88px;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  color: #222;
}
.appmsg_preview_container .cover_appmsg_item .appmsg_title {
  max-height: 28px;
}
.appmsg_preview_container .first_appmsg_item .appmsg_title {
  color: #fff;
  padding: 0 8px;
}
.has_first_cover .cover_appmsg_item .appmsg_title {
  font-size: 14px;
  padding-top: 0;
  line-height: 28px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6) !important;
  filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#99000000',endcolorstr = '#99000000');
}
.appmsg_title a {
  display: block;
  color: #222;
}
.has_first_cover .cover_appmsg_item .appmsg_title a {
  padding: 0 8px;
  color: #fff;
}
.appmsg_thumb_wrp {
  height: 160px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.appmsg_preview_container .appmsg_thumb_wrp {
  height: 120px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.appmsg_thumb {
  width: 100%;
}
.appmsg_thumb.default {
  display: none;
  color: #c0c0c0;
  text-align: center;
  line-height: 160px;
  font-weight: 400;
  font-style: normal;
  background-color: #ececec;
  font-size: 14px;
}
.appmsg_preview_container .appmsg_thumb.default {
  line-height: 120px;
}
.editing .appmsg_thumb.default {
  display: block;
}
.icon_appmsg_thumb {
  width: 44px;
  height: 34px;
  vertical-align: middle;
  display: inline-block;
  overflow: hidden;
  font-size: 35px;
}
.appmsg_edit_mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(229, 229, 229, 0.85) !important;
  filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#d9e5e5e5',endcolorstr = '#d9e5e5e5');
  text-align: center;
}
.appmsg_preview_container div.appmsg_edit_mask {
  top: auto;
  bottom: 0;
  height: 40px;
  line-height: 40px;
  background: rgba(0, 0, 0, 0.5) !important;
  filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#80000000',endcolorstr = '#80000000');
  text-align: right;
}
.appmsg_preview_container .first_appmsg_item .appmsg_edit_mask {
  line-height: 188px;
}
.appmsg_preview_container .first_appmsg_item:hover .appmsg_edit_mask {
  display: block;
}
.appmsg_preview_container .appmsg_item_wrp.current .appmsg_edit_mask {
  bottom: -1px;
}
.editing .cover_appmsg_item:hover .appmsg_edit_mask,
.editing .appmsg_item:hover .appmsg_edit_mask {
  display: block;
}
.icon20_common {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  display: inline-block;
  overflow: hidden;
  line-height: 1.5;
  color: #fff;
}
.appmsg_edit_mask a {
  margin-left: 8px;
  margin-right: 8px;
}
.appmsg_preview_container div.appmsg_edit_mask .sort_up_white,
.appmsg_preview_container div.appmsg_edit_mask .sort_down_white {
  float: left;
  margin-top: 10px;
}

.appmsg_item {
  position: relative;
  padding: 12px 14px;
}
.appmsg_preview_container .appmsg_item,
.appmsg_preview_container .first_appmsg_item {
  padding: 10px;
}
.multi .appmsg_item {
  border-top: 1px solid #e7e7eb;
}
.multi .appmsg_item:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
}
.multi .appmsg_item .appmsg_thumb_wrp {
  float: right;
  width: 78px;
  height: 78px;
  margin-left: 14px;
}
.appmsg_preview_container .appmsg_item .appmsg_thumb {
  width: 78px;
  height: 78px;
}
.appmsg_item .appmsg_thumb.default {
  line-height: 78px;
  font-size: 24px;
}
.appmsg_preview_container .appmsg_item .appmsg_thumb.default {
  line-height: 78px;
}
.create_access_primary {
  display: block;
  border: 2px dotted #d9dadc;
  line-height: 60px;
  text-align: center;
  margin-bottom: 20px;
}
.appmsg_add {
  margin: 20px 14px;
}
.appmsg_preview_container .appmsg_add {
  margin: 0;
  border-top-width: 0;
  line-height: 90px;
}
.icon35_common {
  width: 35px;
  height: 35px;
  vertical-align: middle;
  display: inline-block;
  font-size: 35px;
  color: #ccc;
}
.create_access_primary i {
  cursor: pointer;
  overflow: hidden;
}

.appmsg_tpl_area {
  position: absolute;
  top: 0;
  right: 0;
  width: 140px;
  height: 100%;
}
.appmsg_tpl_container {
  padding: 20px 0;
  border-left: 1px solid #e7e7eb;
  background-color: #fff;
  height: 100%;
}
.appmsg_container_hd {
  padding: 10px 20px 0;
}
.appmsg_container_title {
  font-weight: 400;
}
.appmsg_container_bd {
  padding: 15px;
  position: relative;
}
.appmsg_tpl_area .tpl_list {
  border: 1px solid #e7e7eb;
  border-top-width: 0;
}
.appmsg_tpl_area .tpl_item {
  border-top: 1px solid #e7e7eb;
  background-color: #fff;
  text-align: left;
  padding-left: 20px;
  line-height: 50px;
  cursor: pointer;
}
.appmsg_tpl_area .tpl_item .fa {
  width: 22px;
  height: 22px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 1em;
  font-size: 20px;
  text-align: center;
}

.appmsg_edit_highlight_area {
  padding-bottom: 80px;
  background-color: #fcfcfc;
  .header-title {
    margin-bottom: 20px;
  }
  .header_tips {
    margin-bottom: 10px;
  }
  .content-num {
    color: #999;
    text-align: right;
  }
}
.appmsg_input_area .cover_preview {
  float: left;
  position: relative;
  text-align: center;
  color: #fff;
  margin-top: 10px;
  width: 120px;
  height: 120px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.appmsg_input_area .cover_preview.first_appmsg_cover {
  width: 188px;
}

.tool_area_wrp {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background-color: #fff;
  border-top: 1px solid #d9dadc;
}
.tool_area_wrp .tool_area {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.tool_area_wrp .tool_area .tool_bar {
  padding: 11px 210px 11px 250px;
}
#submitContent {
  height: 0;
  overflow: hidden;
}
</style>
