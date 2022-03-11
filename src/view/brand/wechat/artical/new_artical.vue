<template>
  <section class="section-white">
    <div class="appmsg_preview_area">
      <div class="appmsg_preview_container">
        <div id="submitContent" />
        <div class="appmsg_container_hd">
          <h4 class="appmsg_container_title">
            图文列表
          </h4>
        </div>
        <div class="appmsg_container_bd">
          <div class="appmsg multi has_first_cover editing">
            <div
              id="js_appmsg_preview"
              class="appmsg_content"
            >
              <template v-for="(item, index) in articals">
                <div
                  v-if="index === 0"
                  :key="index"
                  class="js_appmsg_item appmsg_item_wrp"
                  :class="id === index ? 'current' : ''"
                  @click="handleClick(index)"
                >
                  <div
                    class="first_appmsg_item"
                    title="第一篇图文"
                  >
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
                        <div
                          v-if="!item.thumb_url"
                          class="appmsg_thumb default"
                        >
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
                  :key="index"
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
                      <div
                        v-if="!item.thumb_url"
                        class="appmsg_thumb default"
                      >
                        <i class="icon_appmsg_thumb_small el-icon-picture" />
                      </div>
                    </div>
                    <h4 class="appmsg_title js_appmsg_title">
                      <template v-if="item.title != ''">
                        {{ item.title }}
                      </template>
                      <template v-else>
                        标题
                      </template>
                    </h4>
                    <div class="appmsg_edit_mask">
                      <a
                        class="icon20_common sort_up_white iconfont icon-arrow-up"
                        title="上移"
                        @click.prevent="sortup(index)"
                      />
                      <a
                        v-if="index !== articals.length - 1"
                        class="icon20_common sort_down_white icon icon-arrow-down"
                        title="下移"
                        @click.prevent="sortdown(index)"
                      />
                      <el-popover
                        v-model="item.popVisible"
                        placement="bottom"
                        width="220"
                        trigger="click"
                      >
                        <p
                          class="content-padded content-center"
                          style="font-size: 14px"
                        >
                          确定删除这篇图文？
                        </p>
                        <div class="content-center">
                          <el-button @click="item.popVisible = false">
                            取消
                          </el-button>
                          <el-button
                            type="primary"
                            @click="remove(index)"
                          >
                            确定
                          </el-button>
                        </div>
                        <a
                          v-if="!isEditting"
                          slot="reference"
                          class="icon20_common del_media_white el-icon-delete2"
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
      <template
        v-for="(item, index) in articals"
        v-if="id === index"
      >
        <el-form
          ref="item"
          :key="index"
          :model="item"
          label-position="top"
          label-width="80px"
        >
          <div class="content-padded">
            <el-form-item label="标题">
              <el-input
                v-model="item.title"
                placeholder="请输入标题"
              />
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="item.author" />
            </el-form-item>
            <el-form-item>
              <vue-html5-editor
                :id="index"
                ref="editor"
                :content="item.viewcontent"
                :height="360"
                @change="updateContent"
              />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="item.hasLink">
                原文链接
              </el-checkbox>
              <el-input
                v-if="item.hasLink"
                v-model="item.content_source_url"
                placeholder=""
              >
                <template slot="prepend">
                  Http://
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="content-padded appmsg_edit_highlight_area">
            <h3 class="header-title">
              发布样式编辑
            </h3>
            <div class="header_tips">
              封面小图片 <span class="form-text-tip">建议尺寸：200像素 * 200像素</span>
            </div>
            <el-form-item>
              <div>
                <el-button @click="addThumbPreview">
                  从图片库选择
                </el-button>
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
            <div class="header_tips">
              摘要 <span class="form-text-tip">选填，如果不填写会默认抓取正文前54个字</span>
            </div>
            <el-form-item>
              <el-input
                v-model="item.digest"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 8 }"
                resize="none"
                :maxlength="120"
              />
              <div class="content-num">
                {{ item.digest.length }}/120
              </div>
            </el-form-item>
          </div>
        </el-form>
      </template>
    </div>
    <div class="appmsg_tpl_area">
      <div class="appmsg_tpl_container">
        <div class="appmsg_container_hd">
          <h4 class="appmsg_container_title">
            多媒体
          </h4>
        </div>
        <div class="appmsg_container_bd">
          <ul
            id="js_media_list"
            class="tpl_list"
          >
            <li
              class="tpl_item img"
              style=""
              @click="addImgPreview"
            >
              <i class="iconfont icon-image" />图片
            </li>
            <!-- <li class="tpl_item video">
              <i class="fa fa-video-camera"></i>视频
            </li>
            <li id="audio_music_plugin_btn" class="tpl_item audio" style="">
              <i class="fa fa-microphone"></i>音频
            </li>
            <li class="tpl_item vote" id="js_editor_insertvote" style="">
              <i class="fa fa-bar-chart-o"></i>投票
            </li> -->
            <!-- <li class="tpl_item weapp" id="js_editor_insertweapp" style="">
              <i class="icon_media_choose"></i>小程序
            </li> -->
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
    <div class="tool_area_wrp">
      <div class="tool_area">
        <div class="tool_bar content-center">
          <el-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
          <el-button @click="onSubmit">
            预览
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import imgPicker from '../../../../components/imageselect'
import { getCouponHtml } from '../../../../api/cardticket'
import { createArtical, getArtical, updateArtical } from '../../../../api/wechat'

export default {
  inject: ['refresh'],
  components: {
    imgPicker
  },
  data () {
    return {
      imgDialog: false,
      thumbDialog: false,
      couponDialog: false,
      isGetImage: false,
      isGetThumb: false,
      isGetCard: false,
      id: 0,
      isEditting: false,
      articals: [
        {
          title: '',
          author: '',
          content: '',
          viewcontent: '',
          content_source_url: '',
          digest: '',
          thumb_media_id: '',
          thumb_url: '',
          show_cover_pic: 0,
          hasLink: false,
          popVisible: false
        }
      ]
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.isEditting = true
      getArtical(this.$route.params.id)
        .then((response) => {
          // console.log(response.data.data)
          this.articals = response.data.data.news_item
          this.articals[this.id].viewcontent = this.articals[this.id].content.replace(
            /<img data-src="(.*?)/g,
            '<img src="' + process.env.WXIMG_URL + '"'
          )
          setTimeout(() => {
            var loc = this.$refs.editor[0].$refs.content
            var child = loc.querySelectorAll('.coupon-card')
            if (child.length != 0) {
              for (var i = 0; i < child.length; i++) {
                child[i].style.display = 'block'
                child[i].parentNode.setAttribute('contenteditable', false)
              }
              this.$refs.editor[0].focus()
              this.$refs.editor[0].restoreSelection()
            }
          }, 200)
        })
        .catch((error) => {
          console.log(error)
          this.$router.go(-1)
        })
    }
  },
  methods: {
    addImgPreview () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
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
    closeImgDialog () {
      this.imgDialog = false
    },
    addThumbPreview () {
      this.thumbDialog = true
      this.isGetThumb = true
    },
    pickThumb (data) {
      if (data && data.url !== '') {
        this.thumbDialog = false
        this.articals[this.id].thumb_url = data.url
        this.articals[this.id].thumb_media_id = data.media_id
      }
    },
    closeThumbDialog () {
      this.thumbDialog = false
    },
    addCouponPreview () {
      this.couponDialog = true
      this.isGetCard = true
    },
    closeCouponDialog () {
      this.couponDialog = false
    },
    pickCoupon (data) {
      this.couponDialog = false
      if (data) {
        var couponId = { 'card_id': data.card_id }
        getCouponHtml(couponId).then((response) => {
          var index = this.$refs.editor[0].$el.id
          var loc = this.$refs.editor[0]
          var coupon = response.data.data.html
          var div = document.createElement('div')
          var afterDiv = document.createElement('div')
          afterDiv.innerHTML = '&nbsp;'
          div.className = 'coupon-wrap'
          div.setAttribute('contenteditable', false)
          var couponHtml =
            coupon +
            '<div class="coupon-card"><div class="card_content" style="background-color: rgb(213, 64, 54);"><img class="logo" src="https://mmbiz.qlogo.cn/mmbiz_png/MUQsdY0GdK6oqaZpqxLBE6ReLkiaRv6ia3YTIzQHzr96iaiaWAXibGjRCicBdjoenWPzOcaERniajD1ZzhK6yetlXP1Ig/0?wx_fmt=png"><div class="card_info"><h4 class="card_title">' +
            data.title +
            '</h4></div><div class="deco"></div></div><div class="store group">&nbsp;</div></div>'
          div.innerHTML = couponHtml
          if (loc.range) {
            loc.range.insertNode(div)
            if (loc.range.endContainer == loc.$refs.content) {
              loc.$refs.content.appendChild(afterDiv)
              loc.focus()
            }
          } else {
            loc.$refs.content.appendChild(div)
            loc.$refs.content.appendChild(afterDiv)
            loc.focus()
            loc.restoreSelection()
          }
          this.articals[index].viewcontent = loc.$refs.content.innerHTML
        })
      }
    },
    handleClick (index) {
      this.id = +index
      if (this.isEditting) {
        this.articals[this.id].viewcontent = this.articals[this.id].content.replace(
          /<img data-src="(.*?)/g,
          '<img src="' + process.env.WXIMG_URL + '"'
        )
        var loc = this.$refs.editor[0].$refs.content
        setTimeout(() => {
          var child = loc.querySelectorAll('.coupon-card')
          for (var i = 0; i < child.length; i++) {
            child[i].style.display = 'block'
            child[i].parentNode.setAttribute('contenteditable', false)
          }
          this.$refs.editor[0].focus()
          this.$refs.editor[0].restoreSelection()
        }, 200)
      }
    },
    addmsg () {
      let baseMsgData = {
        title: '',
        author: '',
        content: '',
        viewcontent: '',
        content_source_url: '',
        digest: '',
        thumb_media_id: '',
        thumb_url: '',
        show_cover_pic: 0,
        hasLink: false,
        popVisible: false
      }
      this.articals.push(baseMsgData)
    },
    sortup (index) {
      this.articals[index - 1] = this.articals.splice(index, 1, this.articals[index - 1])[0]
    },
    sortdown (index) {
      this.articals[index + 1] = this.articals.splice(index, 1, this.articals[index + 1])[0]
    },
    remove (index) {
      this.id = +(index - 1)
      this.articals.splice(index, 1)
      this.popVisible = false
    },
    updateContent (data) {
      let index = this.$refs.editor[0].$el.id
      this.articals[index].viewcontent = data
      // console.log(this.$refs.editor[0].range)
    },
    onSubmit () {
      var reg = new RegExp(this.wximageurl, 'g')

      for (var i = 0; i < this.articals.length; i++) {
        this.articals[i].content = this.articals[i].viewcontent
          ? this.articals[i].viewcontent.replace(reg, '')
          : this.articals[i].content
        var submitContent = document.getElementById('submitContent')
        submitContent.innerHTML = this.articals[i].content
        var child = submitContent.querySelectorAll('.coupon-card')
        for (var j = 0; j < child.length; j++) {
          child[j].style.display = 'none'
        }
        this.articals[i].content = submitContent.innerHTML
      }

      const that = this
      let param = {}
      if (this.$route.params.id) {
        param = { body: that.articals, media_id: this.$route.params.id }
        updateArtical(param).then((response) => {
          this.$message({
            message: '修改图文成功',
            type: 'success',
            duration: 2 * 1000,
            onClose () {
              that.refresh()
              that.$router.go(-1)
            }
          })
        })
      } else {
        param = { body: that.articals }
        createArtical(param).then((response) => {
          this.$message({
            message: '添加图文成功',
            type: 'success',
            duration: 2 * 1000,
            onClose () {
              that.refresh()
              that.$router.go(-1)
            }
          })
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.section-white {
  position: relative;
}
.appmsg_input_area {
  margin: 0 211px 0 251px;
  position: relative;
}

.appmsg_preview_area {
  position: absolute;
  left: 0;
  height: 100%;
}
.appmsg_preview_container {
  width: 250px;
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
  max-height: 3.2;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  color: #222;
}
.appmsg_preview_container .appmsg_title {
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
  width: 210px;
  height: 100%;
}
.appmsg_tpl_container {
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
  padding: 20px;
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
<style lang="scss">
.coupon-wrap {
  display: inline-block;
  position: relative;
  height: 139px;
  overflow: hidden;
}
.coupon-card {
  position: absolute;
  left: 0;
  top: 0;
  width: 301px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border: 1px solid #e7e7eb;
  .card_content {
    position: relative;
    padding: 21px 13px 21px 84px;
    background-color: #3274bb;
    height: 102px;
    font-size: 18px;
    border-radius: 3px 3px 0 0;
    -moz-border-radius: 3px 3px 0 0;
    -webkit-border-radius: 3px 3px 0 0;
    color: #fff;
    font-weight: normal;
    .logo {
      position: absolute;
      top: 21px;
      left: 13px;
      display: block;
      width: 60px;
      height: 60px;
      border-radius: 30px;
      -moz-border-radius: 30px;
      -webkit-border-radius: 30px;
      padding-top: 0;
      margin-top: 0;
    }
    h4.card_title {
      font-weight: normal;
      font-size: 18px;
      color: #fff;
      line-height: 57px;
      font-weight: 800;
    }
    .deco {
      position: absolute;
      bottom: -1px;
      left: -1px;
      width: 297px;
      height: 5px;
      background: url(../../../../assets/img/card_tpl_deco.png) repeat-x center;
      border-left: 1px solid #e7e7eb;
      border-right: 1px solid #e7e7eb;
    }
  }
  .store {
    border-radius: 0 0 3px 3px;
    -moz-border-radius: 0 0 3px 3px;
    -webkit-border-radius: 0 0 3px 3px;
    padding: 7px 13px;
    color: #8d8d8d;
  }
}
</style>
