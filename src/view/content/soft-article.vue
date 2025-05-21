<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}

.ai-tag {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: var(--themeColor);
  font-size: 12px;
  width: 24px;
  text-align: center;
  color: #fff;
}

.ai-publish {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 999;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ff0000;
}
</style>

<template>
  <SpRouterView>
    <SpPlatformTip h5 app alipay />

    <SpFilterForm :model="searchForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="title" label="软文标题:">
        <el-input v-model="searchForm.title" placeholder="请输入软文标题" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button icon="plus" @click="handleCreateArticle"> 添加软文 </el-button>
      <el-button icon="plus" @click="createArticleByAI"> AI创作 </el-button>
    </div>

    <SpPagination ref="paginationRef" auto-fetch :fetch="fetchList">
      <div class="grid grid-cols-5 gap-4">
        <SpContentCard
          v-for="(item, index) in articleList"
          :key="index"
          :data="item"
          @onDelete="handleDeleteArticle"
          @onChange="handlePublishOrWithdraw"
          @onSort="handleSort"
          @onClick="handleClick"
        >
          <template slot="head-slot">
            <div class="flex justify-between">
              <div v-if="item.is_ai" class="ai-tag">AI</div>
              <div v-if="item.is_ai && !item.release_status" class="ai-publish" />
            </div>
          </template>
        </SpContentCard>
      </div>
    </SpPagination>

    <!-- AI创作 -->
    <SpDrawer
      v-model="drawerShow"
      :title="'AI创作'"
      :width="650"
      @confirm="
        () => {
          $refs['aiArticleForm'].handleSubmit()
        }
      "
    >
      <SpForm
        ref="aiArticleForm"
        v-model="aiArticleForm"
        label-width="120px"
        :form-list="aiArticleFormList"
        :submit="false"
        @onSubmit="onSubmitCreateArticle"
      />
    </SpDrawer>
  </SpRouterView>
</template>

<script>
export default {
  data() {
    return {
      articleList: [],
      aiArticleForm: {
        channel: '',
        goods: [],
        author_type: '运动达人',
        sport_fanatic: '',
        fashion_trend: '',
        industry_presets: '',
        topic_type: '产品测评',
        product_review: '',
        seasonal_recommend: ''
        // topic_content: ''
      },
      aiArticleFormList: [
        {
          label: '选择软文频道',
          key: 'channel',
          type: 'select',
          required: true,
          placeholder: '请选择软文频道',
          options: []
        },
        {
          label: '行业',
          key: 'industry_presets',
          type: 'select',
          required: true,
          placeholder: '请选择软文频道',
          options: [
            { title: '运动服饰', value: '面料、透气性、款式、舒适性' },
            { title: '护肤', value: '原料、质地、主要功能、解决肌肤问题、使用效果' }
          ]
        },
        {
          label: '推广商品',
          key: 'goods',
          component: ({ key }, form) => {
            // 这里用自定义商品选择组件
            return (
              <div>
                <el-button disabled={form[key].length >= 3} onClick={this.onSelectGoods}>
                  选择商品
                </el-button>
                <SpGoodsGroup v-model={form[key]} style='margin-top: 10px;' />
              </div>
            )
          },
          tip: '最多添加3个商品'
        },
        {
          label: '作者人设',
          key: 'author_type',
          type: 'radio',
          options: [
            { label: '运动达人', name: '运动达人' },
            { label: '潮流小主', name: '潮流小主' }
          ]
        },
        {
          label: '',
          key: 'sport_fanatic',
          type: 'input',
          placeholder: '请输入运动达人',
          isShow: ({ key }, form) => form.author_type === '运动达人'
        },
        {
          label: '',
          key: 'fashion_trend',
          type: 'input',
          placeholder: '请输入潮流小主',
          isShow: ({ key }, form) => form.author_type === '潮流小主'
        },
        {
          label: '创作主题描述',
          key: 'topic_type',
          type: 'radio',
          options: [
            { label: '产品测评', name: '产品测评' },
            { label: '季节性推荐', name: '季节性推荐' }
          ]
        },
        {
          label: '',
          key: 'product_review',
          type: 'textarea',
          placeholder: '请输入内容',
          isShow: ({ key }, form) => form.topic_type === '产品测评'
        },
        {
          label: '',
          key: 'seasonal_recommend',
          type: 'textarea',
          placeholder: '请输入内容',
          isShow: ({ key }, form) => form.topic_type === '季节性推荐'
        }
      ],
      channelOptions: [],
      drawerShow: false,
      searchForm: {
        title: ''
      }
    }
  },
  mounted() {
    this.getArticleCategory()
    this.$activated = (to, from) => {
      if (from.meta.name == 'edit') {
        this.$refs['paginationRef'].refresh()
      } else if (from.meta.name == 'create') {
        this.$refs['paginationRef'].refresh(true)
      }
    }
  },
  methods: {
    onSearch() {},
    async getArticleCategory() {
      const res = await this.$api.article.getArticleCategoryList({
        category_type: 'bring'
      })
      this.channelOptions = res.map((item) => {
        return {
          title: item.category_name,
          value: item.category_id
        }
      })
    },
    handleCreateArticle() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    async handleDeleteArticle({ article_id }) {
      try {
        await this.$confirm('确认删除当前软文吗？', '提示')
        await this.$api.article.deleteArticle(article_id)
        this.$message.success('删除成功')
        this.$refs['paginationRef'].refresh()
      } catch (error) {}
    },
    async handleSort({ article_id, sort }) {
      await this.$api.article.updateArticleSortOrStatus({
        inputdata: [
          {
            article_id,
            sort
          }
        ]
      })
      this.$refs['paginationRef'].refresh()
    },
    async handlePublishOrWithdraw({ article_id, release_status }) {
      try {
        await this.$confirm(
          release_status ? '确定撤回本篇软文吗？' : '确定发布本篇软文吗？',
          '提示'
        )
        await this.$api.article.updateArticleSortOrStatus({
          inputdata: [
            {
              article_id: article_id,
              release_status: !release_status
            }
          ]
        })
        this.$message.success(release_status ? '撤回成功' : '发布成功')
        this.$refs['paginationRef'].refresh()
      } catch (error) {}
    },
    handleClick(item) {
      this.$router.push({ path: this.matchRoutePath('editor'), query: { id: item.article_id } })
    },
    async fetchList({ page, pageSize }) {
      const params = {
        page,
        pageSize,
        article_type: 'bring',
        title: this.searchForm.title
      }
      const { list, total_count } = await this.$api.article.getArticleList(params)
      this.articleList = list
      return {
        total: total_count,
        list: this.articleList
      }
    },
    createArticleByAI() {
      this.drawerShow = true
      this.$nextTick(() => {
        this.$refs['aiArticleForm'].setField(this.aiArticleFormList, 'channel', {
          options: this.channelOptions
        })
      })
    },
    async onSelectGoods() {
      const { data } = await this.$picker.goodsitem()
      // 过滤掉已选商品
      const filterData = data.filter(
        (item) => !this.aiArticleForm.goods.find((m) => m.item_id === item.item_id)
      )
      if (this.aiArticleForm.goods.concat(filterData).length > 3) {
        this.$message.error('最多添加3个商品')
        return
      }
      this.aiArticleForm.goods = this.aiArticleForm.goods.concat(filterData)
    },
    async onSubmitCreateArticle() {
      const params = {
        product: this.aiArticleForm.goods.map((item) => {
          return {
            item_id: item.item_id,
            name: item.item_name,
            price: item.price / 100,
            category: item.itemCatName.toString(),
            item_image_url: item.pics?.[0],
            sales: item.sales
          }
        }),
        is_image: true,
        is_article: true,
        category_id: this.aiArticleForm.channel,
        author_persona: this.aiArticleForm.author_type,
        author_name:
          this.aiArticleForm.author_type == '运动达人'
            ? this.aiArticleForm.sport_fanatic
            : this.aiArticleForm.fashion_trend,
        industry_presets: this.aiArticleForm.industry_presets,
        subject_desc: this.aiArticleForm.topic_type,
        detial_desc:
          this.aiArticleForm.topic_type == '产品测评'
            ? this.aiArticleForm.product_review
            : this.aiArticleForm.seasonal_recommend
      }
      await this.$api.article.createArticleByAI(params)
      this.drawerShow = false
      this.$message.success('提交成功，AI生成软文预计需要3分钟，请稍后在待发布中查看。')
      this.$refs['paginationRef'].refresh(true)
    }
  }
}
</script>

<style scoped lang="scss"></style>
