<template>
  <div>
    <SpPageHeader :title="pageTitle" />
    <div class="flex gap-5">
      <div class="px-5">
        <SpIphone>
          <SpDecorate ref="decorateRef" v-model="content" scene="1005" title="软文装修" />
        </SpIphone>
      </div>
      <div class="flex-1">
        <SpForm
          ref="articleForm"
          v-model="articleForm"
          submit
          label-width="120px"
          :form-list="articleFormList"
          @onSubmit="onSubmitTabList"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articleForm: {
        title: '',
        summary: '',
        author: '',
        head_portrait: '',
        category_id: '',
        region_id: [],
        region_name: [],
        image_url: '',
        share_image_url: ''
      },
      articleFormList: [
        {
          label: '标题',
          key: 'title',
          type: 'input'
        },
        {
          label: '副标题',
          key: 'summary',
          type: 'input'
        },
        {
          label: '作者名称',
          key: 'author',
          type: 'input'
        },
        {
          label: '作者头像',
          key: 'head_portrait',
          component: ({ key }, form) => {
            return <SpImagePicker v-model={form[key]} />
          }
        },
        {
          label: '文章类目选择',
          key: 'category_id',
          type: 'select',
          options: []
        },
        {
          label: '地区选择',
          key: 'region_id',
          component: ({ key }, form) => {
            return (
              <div class='flex gap-2'>
                <SpRegionSelect
                  v-model={form[key]}
                  onChange={this.handleRegionChange}
                  style='width: 260px;'
                />
                <el-button type='default' onClick={this.asyncToArticleTitle}>
                  点击同步到标题
                </el-button>
              </div>
            )
          }
        },
        {
          label: '封面图片',
          key: 'image_url',
          component: ({ key }, form) => {
            return <SpImagePicker v-model={form[key]} />
          },
          tip: '建议尺寸：200像素 * 200像素'
        },
        {
          label: '分享图片',
          key: 'share_image_url',
          component: ({ key }, form) => {
            return <SpImagePicker v-model={form[key]} />
          },
          tip: '建议尺寸：200像素 * 200像素'
        }
      ],
      content: []
    }
  },
  computed: {
    pageTitle() {
      return this.$route.query.id ? '编辑软文' : '创建软文'
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getArticle()
    }
    this.$route.meta.name = this.$route.query.id ? 'edit' : 'create'
    this.getArticleCategory()
  },
  methods: {
    async getArticle() {
      const res = await this.$api.article.getArticleInfo(this.$route.query.id)
      if (res) {
        this.articleForm = {
          title: res.title,
          summary: res.summary,
          author: res.author,
          head_portrait: res.head_portrait,
          category_id: res.category_id,
          region_id: res.regions_id,
          region_name: res.regions,
          image_url: res.image_url,
          share_image_url: res.share_image_url
        }
        this.content = res.content
      }
    },
    async getArticleCategory() {
      const res = await this.$api.article.getArticleCategoryList({
        category_type: 'bring'
      })
      const options = res.map((item) => {
        return {
          title: item.category_name,
          value: item.category_id
        }
      })
      this.$refs['articleForm'].setField(this.articleFormList, 'category_id', { options })
    },
    asyncToArticleTitle() {
      const title = this.articleForm.title.replace(/^\[(.+?)\]/g, '')
      this.articleForm.title = `[${this.articleForm.region_name.join('')}]${title}`
    },
    handleRegionChange({ region_name }) {
      this.articleForm.region_name = region_name
    },
    async onSubmitTabList() {
      const params = {
        ...this.articleForm,
        article_type: 'bring',
        content: this.content
      }
      if (this.$route.query.id) {
        await this.$api.article.updateArticle(this.$route.query.id, params)
        this.$message.success('修改文章成功')
        this.$parent.onActivated()
        this.$router.go(-1)
      } else {
        await this.$api.article.createArticle(params)
        this.$message.success('添加文章成功')
        this.$parent.onActivated()
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
