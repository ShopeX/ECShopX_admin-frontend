<template>
  <div class="setting-view">
    <div class="appmsg_input_area">
      <div id="submitContent" />
      <el-form
        ref="form"
        :model="form"
        label-position="top"
        label-width="80px"
      >
        <div class="content-padded">
          <el-form-item
            label="标题"
            style="height: 80px"
          >
            <el-input
              v-model="form.title"
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item label="文章类目选择">
            <el-select
              v-model="form.category_id"
              placeholder="请选择"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.category_id"
                :label="item.category_name"
                :value="item.category_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="height: 380px">
            <vue-html5-editor
              ref="editor"
              :content="form.viewcontent"
              :auto-height="false"
              :height="360"
              @change="updateContent"
            />
          </el-form-item>
        </div>
        <div
          class="content-padded appmsg_edit_highlight_area"
          style="height: 420px"
        >
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
              v-if="form.image_url"
              class="cover_preview"
              :style="{
                backgroundImage: 'url(' + (form.image_url ? wximageurl + form.image_url : '') + ')'
              }"
            />
          </el-form-item>
        </div>
      </el-form>
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
    <div class="setting-footer">
      <el-button
        type="primary"
        @click="onSubmit"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { getArticleInfo, createArticle, updateArticle, getArticleCategoryList } from '@/api/article'
import imgPicker from '@/components/imageselect'

export default {
  inject: ['refresh'],
  components: {
    imgPicker
  },
  data () {
    return {
      imgDialog: false,
      thumbDialog: false,
      isGetImage: false,
      isGetThumb: false,
      categoryList: [],
      form: {
        article_id: '',
        title: '',
        content: '',
        viewcontent: '',
        image_url: '',
        popVisible: false,
        category_id: ''
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.form.article_id = this.$route.query.id
      getArticleInfo(this.$route.query.id).then((res) => {
        if (res.data.data) {
          this.form.title = res.data.data.title
          this.form.content = res.data.data.content
          this.form.viewcontent = res.data.data.content.replace(
            /<img src="(.*?)/g,
            '<img src="' + this.wximageurl
          )
          this.form.image_url = res.data.data.image_url
          this.form.category_id = res.data.data.category_id
        }
      })
    }
    this.getArticleCategory()
  },
  methods: {
    addImgPreview () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      if (data && data.url !== '') {
        this.imgDialog = false
        var loc = this.$refs.editor
        var img = new Image()
        img.src = this.wximageurl + data.url
        if (loc.range) {
          loc.range.insertNode(img)
        } else {
          loc.$refs.content.appendChild(img)
          loc.focus()
          loc.restoreSelection()
        }
        this.form.viewcontent = loc.$refs.content.innerHTML
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
        this.form.image_url = data.url
      }
    },
    closeThumbDialog () {
      this.thumbDialog = false
    },
    updateContent (data) {
      this.form.viewcontent = data
    },
    onSubmit () {
      var reg = new RegExp(this.wximageurl, 'g')
      this.form.content = this.form.viewcontent.replace(reg, '')
      var submitContent = document.getElementById('submitContent')
      submitContent.innerHTML = this.form.content
      this.form.content = submitContent.innerHTML
      let param = {}
      if (this.form.article_id) {
        param = {
          title: this.form.title,
          content: this.form.content,
          image_url: this.form.image_url,
          category_id: this.form.category_id
        }
        updateArticle(this.form.article_id, param).then((response) => {
          const that = this
          this.$message({
            message: '修改文章成功',
            type: 'success',
            duration: 2 * 1000,
            onClose () {
              that.refresh()
              that.$router.go(-1)
            }
          })
        })
      } else {
        param = {
          title: this.form.title,
          content: this.form.content,
          image_url: this.form.image_url,
          category_id: this.form.category_id
        }
        createArticle(param).then((res) => {
          const that = this
          this.$message({
            message: '添加文章成功',
            type: 'success',
            duration: 2 * 1000,
            onClose () {
              that.refresh()
              that.$router.go(-1)
            }
          })
        })
      }
    },
    getArticleCategory () {
      this.loading = true
      let params = {
        category_type: 'general'
      }
      getArticleCategoryList(params).then((response) => {
        this.categoryList = response.data.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
// .content-padded{
//   /deep/ .vue-html5-editor{
//       /deep/ .content{
//         max-height:360px!important;
//       }
//   }
// }

.setting-view {
  position: relative;
  background: #fff;
}
.appmsg_input_area {
  height: 665px;
  overflow-y: auto;
  margin-right: 200px;
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
  width: 200px;
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
.setting-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 200px;
  padding: 10px;
  background: #ffffff;
  border-top: 1px solid #efefef;
}
</style>
