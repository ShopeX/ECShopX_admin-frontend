<template>
  <SpPage title="添加文章">
    <div class="appmsg_input_area">
      <div id="submitContent" />
      <el-form ref="form" :model="form" label-position="top" label-width="80px">
        <div class="content-padded">
          <el-form-item label="标题" style="height: 80px">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="文章类目选择">
            <el-select v-model="form.category_id" placeholder="请选择">
              <el-option
                v-for="item in categoryList"
                :key="item.category_id"
                :label="item.category_name"
                :value="item.category_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="height: 380px">
            <SpRichText v-model="form.viewcontent" />
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
    <div class="setting-footer">
      <el-button type="primary" @click="onSubmit"> 保存 </el-button>
    </div>
  </SpPage>
</template>

<script>
import { getArticleInfo, createArticle, updateArticle, getArticleCategoryList } from '@/api/article'
import imgPicker from '@/components/imageselect'

export default {
  components: {
    imgPicker
  },
  data() {
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
  mounted() {
    if (this.$route.query.id) {
      this.form.article_id = this.$route.query.id
      getArticleInfo(this.$route.query.id).then(res => {
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
    addImgPreview() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
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
        this.form.image_url = data.url
      }
    },
    closeThumbDialog() {
      this.thumbDialog = false
    },
    updateContent(data) {
      this.form.viewcontent = data
    },
    onSubmit() {
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
        updateArticle(this.form.article_id, param).then(response => {
          const that = this
          this.$message({
            message: '修改文章成功',
            type: 'success',
            duration: 2 * 1000,
            onClose() {
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
        createArticle(param).then(res => {
          const that = this
          this.$message({
            message: '添加文章成功',
            type: 'success',
            duration: 2 * 1000,
            onClose() {
              that.refresh()
              that.$router.go(-1)
            }
          })
        })
      }
    },
    getArticleCategory() {
      this.loading = true
      let params = {
        category_type: 'general'
      }
      getArticleCategoryList(params).then(response => {
        this.categoryList = response.data.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
