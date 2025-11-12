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
    <!-- <div class="section-header">
      <div class="section-title">我的模版</div>
      <div class="section-more">更多</div>
    </div> -->
    <template v-if="$route.path.indexOf('aliapp_templ') === -1">
      <div v-for="(dataList, idx) in list" :key="idx" class="page">
        <div class="title">
          {{ idx ? '支付宝' : '微信' }}
        </div>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3">
            <div class="template-item add-btn" @click="chooseTemp(idx)">
              <div class="template-wrap items-center flex-col flex add-btn">
                <i :class="`iconfont ${idx ? 'icon-zhifubaologo' : 'icon-weixin'}`" />
                <div>添加小程序模板</div>
              </div>
            </div>
          </el-col>
          <el-col
            v-for="(item, index) in dataList"
            :key="item.index"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
            :xl="3"
          >
            <div class="template-item">
              <div v-if="item.is_weapp_grade" class="has-upgrade" />
              <div v-if="item.wxaCodeVisible" class="wxcode">
                <div class="iconfont icon-times" @click="closeWxcode(idx, index)" />
                <img :src="item.wxaCodeImage" alt="">
              </div>
              <div class="template-wrap items-center flex-col flex">
                <div class="template-img">
                  <img
                    v-if="item.template_name === 'yykmembership'"
                    src="@/assets/img/template_img.jpg"
                    alt=""
                  >
                  <img
                    v-if="item.template_name === 'yykmendian'"
                    src="@/assets/img/template_img_01.jpg"
                    alt=""
                  >
                  <img
                    v-if="item.template_name === 'yykcutdown'"
                    src="@/assets/img/template_img_02.jpg"
                    alt=""
                  >
                  <img
                    v-if="item.template_name === 'yykweishop'"
                    src="@/assets/img/template_img_04.jpg"
                    alt=""
                  >
                  <img
                    v-if="item.template_name === 'appleweishop'"
                    src="@/assets/img/template_img_09.jpg"
                    alt=""
                  >
                  <img
                    v-if="item.template_name === 'yykcommunity'"
                    src="@/assets/img/template_img_07.jpg"
                    alt=""
                  >
                  <img
                    v-if="item.template_name === 'yykcommunitypms'"
                    src="@/assets/img/template_img_06.jpg"
                    alt=""
                  >
                  <img
                    v-if="item.template_name === 'onexshop'"
                    src="@/assets/img/onexshop.png"
                    alt=""
                  >
                  <div
                    v-if="idx === 0 && item.is_bind"
                    v-loading="item.loading"
                    class="demo-qrcode"
                    @click="downloadWxaCode(idx, index, item.bindInfo, 'wechat')"
                  >
                    <img src="@/assets/img/code.png" height="34" width="35" alt="">
                  </div>
                  <div
                    v-if="item.bindInfo && idx === 1 && item.bindInfo.status === 5"
                    v-loading="item.loading"
                    class="demo-qrcode"
                    @click="downloadWxaCode(idx, index, item.bindInfo, 'alipay')"
                  >
                    <img src="@/assets/img/code.png" height="34" width="35" alt="">
                  </div>
                </div>
                <div class="template-caption">
                  {{ item.templateInfo.name }}
                </div>
                <div v-if="!idx" class="template-opend-btn" @click="linkTo(item, idx)">
                  <span v-if="item.is_bind">编辑模板</span><span v-else>未绑定</span>
                </div>
                <div v-else class="template-opend-btn" @click="linkTo(item, idx)">
                  <span v-if="item.is_bind">编辑模板</span><span v-else>授权支付宝小程序</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-dialog
      center
      top="30vh"
      width="20%"
      title="授权支付宝小程序"
      :show-close="!isClick"
      :visible.sync="isShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="content-center">
        {{
          !isClick
            ? '点击【继续】后将为你打开新网页进行授权务必在完成授权后手动回到本页面进行后续操作。'
            : '点击【我已完成授权】继续编辑小程序模板。'
        }}
      </div>
      <span v-if="!isClick" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="accredit">继续</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button @click="accredit">重新授权</el-button>
        <el-button type="primary" @click="doneAccredit">我已完成授权</el-button>
      </span>
    </el-dialog>
    <router-view />
  </section>
</template>

<script>
import { getCodeUnlimit } from '@/api/wxa'
import { getALiCodeUnlimit, getALiPreAuthUrl } from '@/api/ali'
import { getTemplateList, getALiTemplateList } from '@/api/template'

export default {
  data() {
    return {
      list: [],
      isShow: false,
      isClick: false,
      authorizerUrl: ''
    }
  },
  mounted() {
    getTemplateList().then(response => {
      var res = response.data.data.list
      for (var i = 0; i < res.length; i++) {
        res[i].loading = false
        res[i].wxaCodeImage = ''
        res[i].wxaCodeVisible = false
        res[i].type = 'wx'
      }
      this.list.unshift(res)
    })
    getALiTemplateList().then(response => {
      var res = response.data.data.list
      for (var i = 0; i < res.length; i++) {
        res[i].loading = false
        res[i].wxaCodeImage = ''
        res[i].wxaCodeVisible = false
        res[i].type = 'zfb'
      }
      this.list.push(res)
    })
  },
  methods: {
    linkTo(data) {
      console.log('🚀data', data)
      let link = ''
      let wid = ''
      if (data.bindInfo) {
        if (data.type == 'wx') {
          link = '/wxapp/manage/templateedit'
          wid = data.bindInfo.authorizer_appid
          this.$store.dispatch('setAppType', 'wechat')
          this.$store.dispatch('setWxappId', data.bindInfo.authorizer_appid)
          this.$store.dispatch('setTemplateName', data.bindInfo.template_name)
        } else {
          link = '/wxapp/aliapp/templateedit'
          wid = data.bindInfo.authorizer_appid
          this.$store.dispatch('setAppType', 'alipay')
          this.$store.dispatch('setALiTemplateName', data.bindInfo.template_name)
          this.$store.dispatch('setALiAppid', data.bindInfo.authorizer_appid)
        }
      } else {
        if (data.type == 'wx') {
          link = '/wxapp/manage/editauthorize'
          this.$store.dispatch('setAppType', 'wechat')
          this.$store.dispatch('setWxappId', '')
          this.$store.dispatch('setTemplateName', data.template_name)
        } else {
          let params = {
            template_name: data.templateInfo.key_name
          }
          getALiPreAuthUrl(params).then(response => {
            this.authorizerUrl = response.data.data.url
          })
          this.isShow = true
        }
      }
      console.log('跳转页面')
      console.log(link)
      let _query =
        data.type == 'wx'
          ? { templatename: data.template_name, wxappid: wid }
          : { templatename: data.template_name, aliappid: wid }
      this.$router.push({
        path: link,
        query: _query
      })
    },
    accredit() {
      this.isClick = true
      window.open(this.authorizerUrl)
    },
    doneAccredit() {
      this.isShow = false
      window.location.reload()
    },
    closeWxcode(idx, index) {
      this.list[idx][index].wxaCodeVisible = false
    },
    downloadWxaCode(idx, index, info, type) {
      if (!this.list[idx][index].wxaCodeImage) {
        if (type === 'wechat') {
          let params = { wxaAppId: info.authorizer_appid }
          this.list[idx][index].loading = true
          getCodeUnlimit(params).then(response => {
            this.list[idx][index].wxaCodeImage = response.data.data.base64Image
            this.list[idx][index].wxaCodeVisible = true
            this.list[idx][index].loading = false
          })
        } else {
          let params = {
            wxaAppId: info.authorizer_appid,
            template_name: info.template_name
          }
          this.list[idx][index].loading = true
          getALiCodeUnlimit(params).then(response => {
            this.list[idx][index].wxaCodeImage = response.data.data.qr_code_url
            this.list[idx][index].wxaCodeVisible = true
            this.list[idx][index].loading = false
          })
        }
      } else {
        this.list[idx][index].wxaCodeVisible = true
      }
    },
    chooseTemp(idx) {
      // this.$router.push({ path: this.matchInternalRoute('wxapp_templ') })
      idx
        ? this.$router.push({ path: '/wxapp/aliapp/template/aliapp_templ' })
        : this.$router.push({ path: '/wxapp/manage/wxapp/wxapp_templ' })
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  height: auto;
  padding: 10px 30px;
  border: 1px solid #f4f4f4;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #999999;
  margin-bottom: 30px;
}
.title {
  font-size: 20px;
  margin: 0 0 20px -15px;
  font-weight: 600;
}
.cur {
  font-size: 12px;
}
.template-item {
  position: relative;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.5s ease;
  &::after {
    display: flex;
    padding-top: 130%;
    content: '';
  }
  .has-upgrade {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 10px;
    height: 10px;
    background: #ff0000;
    border-radius: 50%;
    z-index: 998;
  }
  .wxcode {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 20px;
    top: 20px;
    right: 20px;
    bottom: 20px;
    background: #fff;
    z-index: 999;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    img {
      width: 70%;
      height: auto;
    }
    .iconfont {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .template-wrap {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    &.add-btn {
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: #999;
      i {
        font-size: 60px;
      }
      &:hover {
        color: #ccc;
      }
    }
  }
  &:hover {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.4);
  }
  .template-img {
    height: 60%;
    position: relative;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .demo-qrcode {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 60px;
      height: 60px;
      left: 50%;
      top: 50%;
      transition: all 0.3s ease;
      transform: translate(-50%, -50%) scale(1);
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      z-index: 30;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        transform: translate(-50%, -50%) scale(1.1);
      }
      img {
        display: block;
        width: 70%;
        height: 70%;
      }
    }
  }
  .template-title {
    font-size: 18px;
    margin-bottom: 15px;
  }
  .template-theme {
    display: flex;
    justify-content: center;
    .theme-item {
      display: flex;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      margin: 0 5px;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      vertical-align: middle;
      & > div {
        flex: 1;
        height: 24px;
        &:first-child {
          border-radius: 24px 0 0 24px;
        }
        &:last-child {
          border-radius: 0 24px 24px 0;
        }
      }
    }
  }
  .template-caption {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 15px;
  }
  .template-app {
    display: flex;
    padding-left: 10px;
    .app {
      color: #999;
      margin-right: 5px;
      i {
        display: block;
        font-size: 28px;
      }
    }
  }
  .template-status {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      color: #ff5000;
      display: block;
      font-size: 92px;
    }
  }
  .template-keywords {
    position: relative;
    padding-top: 10px;
    padding-left: 10px;
    color: #ccc;
    .tag {
      display: inline-block;
      font-size: 13px;
      color: #333;
      margin-right: 5px;
    }
  }
  .template-opend-btn {
    display: block;
    padding: 0 10px;
    line-height: 36px;
    text-align: center;
    background: #f8f8f8;
    color: #333;
    transition: all 0.3s ease;
    border: 1px solid #efefef;
    &:hover {
      border-color: #ff5000;
      background: #ff5000;
      color: #fff;
    }
  }
}
@media only screen and (max-width: 768px) {
}
@media only screen and (min-width: 768px) {
}
@media only screen and (min-width: 992px) {
}
@media only screen and (min-width: 1200px) {
}
@media only screen and (min-width: 1920px) {
}
</style>
