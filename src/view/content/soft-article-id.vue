<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <SpPageHeader :title="pageTitle" />
    <div class="flex gap-5">
      <div class="px-5">
        <SpIphone>
          <SpDecorate
            ref="decorateRef"
            v-model="content"
            scene="1005"
            :title="$t('5815f596.cb118f')"
          />
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
  inject: ['refresh'],
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
          label: this.$t('5815f596.32c65d'),
          key: 'title',
          type: 'input'
        },
        {
          label: this.$t('5815f596.72cf37'),
          key: 'summary',
          type: 'input'
        },
        {
          label: this.$t('5815f596.ad0c76'),
          key: 'author',
          type: 'input'
        },
        {
          label: this.$t('5815f596.c08f0c'),
          key: 'head_portrait',
          component: ({ key }, form) => {
            return <SpImagePicker v-model={form[key]} />
          }
        },
        {
          label: this.$t('5815f596.c7a058'),
          key: 'category_id',
          type: 'select',
          options: []
        },
        {
          label: this.$t('5815f596.9b711a'),
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
                  {this.$t('5815f596.0abc91')}
                </el-button>
              </div>
            )
          }
        },
        {
          label: this.$t('5815f596.9cbbc8'),
          key: 'image_url',
          component: ({ key }, form) => {
            return <SpImagePicker v-model={form[key]} />
          },
          tip: this.$t('5815f596.9f9b2a')
        },
        {
          label: this.$t('5815f596.106d52'),
          key: 'share_image_url',
          component: ({ key }, form) => {
            return <SpImagePicker v-model={form[key]} />
          },
          tip: this.$t('5815f596.9f9b2a')
        }
      ],
      content: []
    }
  },
  computed: {
    pageTitle() {
      return this.$route.query.id ? this.$t('5815f596.f48bbd') : this.$t('5815f596.13e8aa')
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
        this.$message.success(this.$t('5815f596.6d2221'))
        this.refresh()
        this.$router.go(-1)
      } else {
        await this.$api.article.createArticle(params)
        this.$message.success(this.$t('5815f596.e04b36'))
        this.refresh()
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
