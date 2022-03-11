<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="never">
          <el-form
            ref="form"
            :model="form"
            label-position="top"
            label-width="80px"
          >
            <el-form-item label="标题">
              <el-input
                v-model="form.title"
                placeholder="请输入标题"
              />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input
                v-model="form.summary"
                placeholder="请输入副标题"
              />
            </el-form-item>
            <el-form-item label="作者名称">
              <el-input
                v-model="form.author"
                type="text"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="作者头像">
              <imgBox
                :img-url="form.head_portrait"
                inline
                @click="handleImgChange"
              />
              <imgPicker
                :dialog-visible="imgDialog"
                :sc-status="isGetImage"
                @chooseImg="pickImg"
                @closeImgDialog="closeImgDialog"
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
            <el-form-item
              v-if="renderable"
              label="地区选择"
            >
              <region-select
                :default-address="defaultAddress"
                @change="changeRegion"
              />
              <span
                style="cursor: pointer"
                @click="handleSynchronous()"
              >点击地区同步到标题</span>
            </el-form-item>
            <el-form-item label="发布样式编辑">
              <div>封面小图片 <span class="form-text-tip">建议尺寸：200像素 * 200像素</span></div>
              <el-button @click="addThumbPreview">
                从图片库选择
              </el-button>
              <imgBox
                v-if="form.image_url"
                :img-url="wximageurl + form.image_url"
              />
            </el-form-item>
            <el-form-item label="分享图片">
              <div>分享图片 <span class="form-text-tip">建议尺寸：200像素 * 200像素</span></div>
              <el-button @click="addSharePreview">
                从图片库选择
              </el-button>
              <imgBox
                v-if="form.share_image_url"
                :img-url="wximageurl + form.share_image_url"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="never">
          <div :style="'height:' + (wheight - 195) + 'px;'">
            <richText
              :control="['film', 'goods', 'slider', 'heading', 'writing']"
              :data="form.content"
              @change="handleRichTextChange"
            />
          </div>
        </el-card>
      </el-col>
      <imgPicker
        :dialog-visible="thumbDialog"
        :sc-status="isGetThumb"
        @chooseImg="pickThumb"
        @closeImgDialog="closeThumbDialog"
      />
      <imgPicker
        :dialog-visible="shareDialog"
        :sc-status="isGetShare"
        @chooseImg="pickShare"
        @closeImgDialog="closeShareDialog"
      />
    </el-row>
    <div class="content-center">
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
import { mapGetters } from 'vuex'
import { createArticle, getArticleCategoryList, getArticleInfo, updateArticle } from '@/api/article'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'
import richText from '@/components/function/richTextEditor'
import regionSelect from '@/components/regionSelect'

export default {
  inject: ['refresh'],
  components: {
    imgPicker,
    imgBox,
    richText,
    regionSelect
  },
  data () {
    return {
      imgDialog: false,
      thumbDialog: false,
      shareDialog: false,
      isGetImage: false,
      isGetThumb: false,
      isGetShare: false,
      synchronous: false,
      article_id: '',
      categoryList: [],
      form: {
        title: '',
        summary: '',
        article_type: 'bring',
        content: [],
        image_url: '',
        author: '',
        head_portrait: '',
        article: '',
        category_id: '',
        share_image_url: ''
      },
      renderable: true,
      address_title: '',
      defaultAddress: []
      // defaultAddress: ['150000', '150400', '150404'] // 默认要显示的地址id
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    if (this.$route.query.id) {
      this.renderable = false
      this.article_id = this.$route.query.id
      getArticleInfo(this.$route.query.id).then((res) => {
        if (res.data.data) {
          this.form.title = res.data.data.title
          this.form.summary = res.data.data.summary
          this.form.content = res.data.data.content
          this.form.image_url = res.data.data.image_url
          this.form.share_image_url = res.data.data.share_image_url
          this.form.author = res.data.data.author
          this.form.category_id = res.data.data.category_id
          this.form.head_portrait = res.data.data.head_portrait
          this.defaultAddress = res.data.data.regions_id
          this.$nextTick((_) => {
            this.renderable = true
          })
        }
      })
    }
    this.getArticleCategory()
  },
  methods: {
    handleSynchronous () {
      if (this.address_title) {
        let title = this.form.title.replace(/^\[(.+?)\]/g, '')
        this.form.title = '[' + this.address_title + ']' + title
      }
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
    addSharePreview () {
      this.shareDialog = true
      this.isGetShare = true
    },
    pickShare (data) {
      if (data && data.url !== '') {
        this.shareDialog = false
        this.form.share_image_url = data.url
      }
    },
    closeShareDialog () {
      this.shareDialog = false
    },
    handleRichTextChange (data) {
      this.form.content = data
    },
    onSubmit () {
      let param = {}
      if (this.article_id) {
        updateArticle(this.article_id, this.form).then((response) => {
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
        createArticle(this.form).then((res) => {
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
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.head_portrait = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    },
    changeRegion (values) {
      this.address_title = [values.city + values.area]
      this.form = Object.assign({}, this.form, values)
    },
    getArticleCategory () {
      this.loading = true
      let params = {
        category_type: 'bring'
      }
      getArticleCategoryList(params).then((response) => {
        this.categoryList = response.data.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
