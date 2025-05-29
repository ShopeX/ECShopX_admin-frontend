<template>
  <div v-loading="loading" class="menu_content send">
    <div class="msg_sender">
      <div class="msg_tab">
        <div class="tab_navs_panel">
          <ul class="tab_navs">
            <li class="tab_nav tab_appmsg width6">
              <a :class="{ 'cur': currentName === 'news' }" @click="msgTypeAction('news')"
                ><span class="msg_tab_title tab_appmsg"
                  ><i class="icon_msg_sender" />图文消息</span
                ></a
              >
            </li>
            <li class="tab_nav tab_appmsg width6">
              <a :class="{ 'cur': currentName === 'text' }" @click="msgTypeAction('text')"
                ><span class="msg_tab_title tab_text"><i class="icon_msg_sender" />文字</span></a
              >
            </li>
            <li class="tab_nav tab_appmsg width6">
              <a :class="{ 'cur': currentName === 'image' }" @click="msgTypeAction('image')"
                ><span class="msg_tab_title tab_img"><i class="icon_msg_sender" />图片</span></a
              >
            </li>
          </ul>
        </div>
        <div ref="msg" class="tab_panel">
          <div v-if="currentName === 'news'" class="tab_content">
            <div class="inner">
              <div v-if="!data.news" class="tab_cont_cover">
                <div class="media_cover">
                  <span class="create_access">
                    <a href="javascript:;" class="add_gray_wrap" @click="newsShowDialog">
                      <i class="el-icon-plus" />
                      <strong>从素材库中选择</strong>
                    </a>
                  </span>
                </div>
                <div class="media_cover">
                  <span class="create_access tw-box">
                    <router-link
                      :to="{ path: matchInternalRoute('brandmaterial_editor') }"
                      class="add_gray_wrap"
                    >
                      <i class="el-icon-edit" />
                      <strong>自建图文</strong>
                    </router-link>
                  </span>
                </div>
              </div>
              <div v-else class="msgSender_media_1">
                <div class="msgSender_content">
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
                        <a
                          :href="data.news.content.news_item[0].url"
                          class="edit-mask preview-mask"
                        >
                          <div class="edit-mask-content">预览文章</div>
                        </a>
                        <p v-if="data.news.content.news_item.length === 1" class="msg-desc">
                          {{ data.news.content.news_item[0].digest }}
                        </p>
                      </div>
                      <div
                        v-for="(item, index) in data.news.content.news_item"
                        v-if="index !== 0"
                        :key="index"
                      >
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
                <a class="link" @click.prevent="removeMsg(currentName)">删除</a>
              </div>
            </div>
          </div>

          <div v-if="currentName === 'text'" class="tab_content">
            <div class="emotion_editor">
              <el-input
                v-model="data.text"
                type="textarea"
                :maxlength="600"
                :rows="8"
                resize="none"
                class="edit_area"
                @change="wordChange"
              />
              <div class="editor_toolbar tr">
                <span class="frm-tips">{{ data.text.length }}/600</span>
              </div>
            </div>
          </div>

          <div v-if="currentName === 'image'" class="tab_content">
            <div class="inner">
              <div v-if="!data.image" class="tab_cont_cover">
                <div class="media_cover">
                  <span class="create_access">
                    <a href="javascript:;" class="add_gray_wrap" @click="imgShowDialog">
                      <i class="el-icon-plus" />
                      <strong>从素材库中选择</strong>
                    </a>
                  </span>
                </div>
                <!-- <div class="media_cover">
                  <span class="create_access">
                    <a href="javascript:;" class="add_gray_wrap">
                      <el-upload action="" :show-file-list="false" :auto-upload="false" :on-change="uploadImage">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        <strong>上传图片</strong>
                      </el-upload>
                    </a>
                  </span>
                </div> -->
              </div>
              <div v-else class="msgSender_content_2">
                <div class="appmsgSendedItem simple_img">
                  <a class="title_wrp" href="" target="_blank">
                    <span
                      class="js_media_img icon cover"
                      :style="{ backgroundImage: 'url(' + wximageurl + data.image.url + ')' }"
                    />
                  </a>
                </div>
                <a class="link" @click.prevent="removeMsg(currentName)">删除</a>
              </div>
            </div>
          </div>

          <div v-if="currentName === 'card'" class="tab_content">
            <div v-if="!data.card" class="tab_cont_cover">
              <div class="media_cover">
                <span class="create_access">
                  <a href="javascript:;" class="add_gray_wrap" @click="cardShowDialog">
                    <i class="el-icon-plus" />
                    <strong>从素材库中选择</strong>
                  </a>
                </span>
              </div>
            </div>
            <div v-else class="cardmsgArea inner">
              <div class="msg_card">
                <div class="card_content clearfix">
                  <img class="logo f_l" :src="wximageurl + data.card.logo_url">
                  <div class="card_info">
                    <h4 class="card_title">
                      {{ data.card.title }}
                    </h4>
                  </div>
                  <div class="deco" />
                </div>
                <p class="store">
                  {{ data.card.brand_name }}
                </p>
              </div>
              <a class="link" @click.prevent="removeMsg(currentName)">删除</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SCSelect
      :sc-visible="newsVisible"
      :sc-status="isGetNews"
      @chooseSC="newsPicker"
      @closeSCDialog="newsHideDialog"
    />
    <ImgSelect
      :dialog-visible="imgVisible"
      :sc-status="isGetImage"
      @chooseImg="imgPicker"
      @closeImgDialog="imgHideDialog"
    />
  </div>
</template>

<script>
import ImgSelect from '../../components/imageselect'
import SCSelect from '../../components/aterialanagementselect'
import { validatUploadImage } from '../../utils/validate'
import { uploadMaterial } from '../../api/wechat'

export default {
  name: 'MsgInput',
  components: {
    SCSelect,
    ImgSelect
  },
  props: {
    type: {
      type: String,
      default: null
    },
    value: {
      default: null
    }
  },
  data() {
    return {
      loading: false,
      currentName: '',
      data: {
        news: null,
        text: '',
        image: null,
        card: null
      },
      isGetCard: false,
      isGetNews: false,
      isGetImage: false,
      newsVisible: false,
      imgVisible: false,
      cardVisible: false
    }
  },
  watch: {
    type(value) {
      if (value) {
        this.setCurrentName(value)
      }
    },
    value(value) {
      if (value) {
        this.setCurrentValue(value)
      }
    }
  },
  mounted() {
    if (this.type) {
      this.setCurrentName(this.type)
    } else {
      this.setCurrentName('news')
    }
    this.setCurrentValue(this.value)
  },
  methods: {
    msgTypeAction(type) {
      this.currentName = type
    },
    newsShowDialog() {
      this.newsVisible = true
      this.isGetNews = true
    },
    imgShowDialog() {
      this.imgVisible = true
      this.isGetImage = true
    },
    cardShowDialog() {
      this.cardVisible = true
      this.isGetCard = true
    },
    newsHideDialog() {
      this.newsVisible = false
    },
    imgHideDialog() {
      this.imgVisible = false
    },
    cardHideDialog() {
      this.cardVisible = false
    },
    newsPicker(data) {
      this.newsVisible = false
      if (data.html !== '') {
        this.data.news = data.selectedItem
        this.$emit('change', data.selectedItem, this.currentName)
      }
    },
    imgPicker(data) {
      console.log(data.url)
      if (data && data.url !== '') {
        this.data.image = data
        this.$emit('change', data, this.currentName)
        this.imgVisible = false
      }
    },
    // uploadImage (file, filelist) {
    //   this.loading = true
    //   let check = validatUploadImage(file)
    //   if (check !== true) {
    //     this.$message({
    //       message: check,
    //       type: 'error',
    //       duration: 5 * 1000
    //     })
    //     return
    //     this.loading = false
    //   }
    //   let params = {isUploadFile: true, file: file.raw, type:"image"}
    //   uploadMaterial(params).then(res => {
    //     this.data.image = res.data.data
    //     this.$emit('change',res.data.data, this.currentName)
    //     this.loading = false
    //   })
    // },
    cardPicker(data) {
      this.cardVisible = false
      console.log(data)
      if (data) {
        this.data.card = data
        this.$emit('change', data, this.currentName)
      }
    },
    wordChange(val) {
      if (this.currentName === 'text') {
        this.data.text = val
        this.$emit('change', val, this.currentName)
      }
    },
    setCurrentName(val) {
      this.currentName = val
    },
    setCurrentValue(val) {
      if (this.type === 'news') {
        this.data.news = val
      }
      if (this.type === 'text') {
        this.data.text = val
      }
      if (this.type === 'image') {
        this.data.image = val
      }
      if (this.type === 'card') {
        this.data.card = val
      }
    },
    removeMsg(name) {
      if (name === 'text') {
        this.data[name] = ''
      } else {
        this.data[name] = null
      }
    }
  }
}
</script>

<style scoped lang="scss">
.menu_content {
  width: 560px;
  border: 1px solid #e7e7eb;
  padding: 16px 20px;
  &.send {
    padding: 0;
    border: 0;
  }
  .content_mar_l {
    margin-left: 10px;
  }
  .label {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .content_wrap {
    width: 410px;
  }
}
.msg_sender {
  border: 1px solid #e7e7eb;
  .tab_navs_panel {
    overflow: hidden;
    border-bottom: 1px solid #e7e7e7;
  }
  .tab_navs {
    height: 38px;
    line-height: 38px;
    white-space: nowrap;
    text-align: left;
    display: flex;
  }
  .tab_nav {
    flex: 1;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    a {
      display: block;
      color: #999;
      outline: 0;
      padding: 0 15px;
      &.cur {
        color: #333;
      }
      &.cur,
      &:hover {
        color: #333;
        .tab_appmsg {
          .icon_msg_sender {
            background-position: 0 -270px;
          }
        }
        .tab_text {
          .icon_msg_sender {
            background-position: 0 -30px;
          }
        }
        .tab_img {
          .icon_msg_sender {
            background-position: 0 -90px;
          }
        }
        .tab_cardmsg {
          .icon_msg_sender {
            background-position: 0 -270px;
          }
        }
        .tab_audio {
          .icon_msg_sender {
            background-position: 0 -210px;
          }
        }
        .tab_video {
          .icon_msg_sender {
            background-position: 0 -150px;
          }
        }
      }
    }
  }
  .msg_tab_title {
    .icon_msg_sender {
      display: inline-block;
      margin-right: 3px;
      margin-top: -2px;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      background: url('~@/assets/img/msg_tab.png') no-repeat 0 0;
    }
    &.tab_appmsg {
      .icon_msg_sender {
        background-position: 0 -240px;
      }
    }
    &.tab_text {
      .icon_msg_sender {
        background-position: 0 0;
      }
    }
    &.tab_img {
      .icon_msg_sender {
        background-position: 0 -60px;
      }
    }
    &.tab_cardmsg {
      .icon_msg_sender {
        background-position: 0 -240px;
      }
    }
    &.tab_audio {
      .icon_msg_sender {
        background-position: 0 -180px;
      }
    }
    &.tab_video {
      .icon_msg_sender {
        background-position: 0 -120px;
      }
    }
  }
  .tab_panel {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .tab_content {
    .inner {
      border-width: 0;
    }
    .msgSender_content {
      display: inline-block;
    }
  }
  .tab_cont_cover {
    padding: 20px;
    .create_access {
      padding: 42px 0;
      i:hover {
        color: #333;
      }
      .avatar-uploader-icon {
        height: auto;
        line-height: 28px;
      }
    }
    .tw-box {
      > a:first-child {
        display: inline-block;
      }
      > a:nth-child(2) {
        display: none;
      }
      > a:nth-child(3) {
        display: none;
      }
    }
  }
  .audio_msg,
  .appmsg,
  .richvideo,
  .msg_card {
    display: inline-block;
  }
  .appmsgSendedItem {
    padding-left: 0;
    display: inline-block;
  }
  .icon {
    &.cover {
      width: 186px;
      height: 186px;
    }
  }
  .msg_card {
    display: inline-block;
  }
}

.appmsgSendedItem {
  position: relative;
  padding-left: 90px;
  min-height: 80px;
  .title_wrp {
    display: inline-block;
    .icon {
      display: inline-block;
    }
    .cover {
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
  }
}
.tab_navs {
  text-align: center;
  line-height: 30px;
  border-bottom: 1px solid #e7e7e7;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
  -moz-box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
  -webkit-box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.5);
}
.tab_panel {
  min-height: 216px;
}
.tab_content {
  .inner {
    border: 1px solid #c6c6c6;
    border-radius: 3px;
    padding: 14px 20px;
  }
  .msg-item {
    width: 320px;
  }
}
.tab_cont_cover {
  overflow: hidden;
  display: flex;
  .media_cover {
    margin-right: 15px;
    text-align: center;
    margin-right: 15px;
    flex: 1;
  }
  .create_access {
    position: relative;
    padding: 82px 0;
    margin-bottom: 0;
    line-height: normal;
  }
}
.create_access {
  display: block;
  border: 2px dotted #d9dadc;
  line-height: 80px;
  text-decoration: center;
  margin-bottom: 20px;
  a {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    margin-right: 10px;
    color: #8d8d8d;
    font-size: 14px;
    line-height: normal;
    i {
      font-size: 28px;
    }
    strong {
      display: block;
      padding-top: 5px;
      font-weight: 300;
      font-style: normal;
    }
  }
}
.emotion_editor {
  .edit_area {
    padding: 14px 20px;
  }
}
.editor_toolbar {
  padding: 0 20px;
  line-height: 36px;
  border-top: 1px solid #e7e7eb;
}
.msg_card {
  width: 297px;
  border-radius: 5px;
  border: 1px solid #e7e7eb;
  .card_content {
    position: relative;
    padding: 20px 12px;
    height: 100px;
    line-height: 60px;
    background-color: #3274bb;
    font-size: 18px;
    border-radius: 3px 3px 0 0;
    color: #fff;
    font-weight: normal;
    .card_info {
      margin-left: 70px;
    }
    .card_title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .logo {
      display: block;
      width: 60px;
      height: 60px;
      border-radius: 30px;
      padding-top: 0;
      margin-top: 0;
      margin-right: 10px;
    }
    h4 {
      font-weight: normal;
      color: #fff;
      font-size: 18px;
      line-height: 57px;
    }
    .deco {
      position: absolute;
      bottom: -1px;
      left: -1px;
      width: 297px;
      height: 5px;
      background: url('~@/assets/img/card_tpl_deco.png') repeat-x center;
      border-left: 1px solid #e7e7eb;
      border-right: 1px solid #e7e7eb;
    }
  }
  .store {
    padding: 7px 12px;
    border-radius: 0 0 3px 3px;
    line-height: 1.5;
    color: #8d8d8d;
  }
}
.logo {
  float: left;
  padding-top: 10px;
  font-size: 24px;
}

.hidden {
  display: none;
}
</style>
