<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
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

    <SpPagination auto-fetch :fetch="fetchList">
      <div class="grid grid-cols-5 gap-4">
        <SpContentCard
          v-for="(item, index) in articleList"
          :key="index"
          :data="item"
          @onDelete="handleDeleteArticle"
          @onChange="handlePublishOrWithdraw"
          @onSort="handleSort"
          @onClick="handleClick"
        />
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
import DataPlaceholder from '@/components/element/dataPlaceholder'

export default {
  components: {
    dataPlaceholder: DataPlaceholder
  },
  data() {
    return {
      articleList: [],
      aiArticleForm: {
        channel: '',
        goods: [],
        author_type: '运动达人',
        sport_fanatic: '',
        fashion_trend: '',
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
        this.fetchList()
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
      this.fetchList()
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
        this.fetchList()
      } catch (error) {}
    },
    handleClick(item) {
      this.$router.push({ path: this.matchRoutePath('editor'), query: { id: item.article_id } })
    },
    async fetchList({ pageIndex, pageSize }) {
      const params = {
        page: pageIndex,
        pageSize,
        article_type: 'bring',
        title: this.searchForm.title
      }
      const { list, total_count } = await this.$api.article.getArticleList(params)
      this.articleList = this.articleList.concat(list)
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
            sales: item.sales
          }
        }),
        is_image: true,
        is_article: true,
        category_id: '',
        author_persona: this.aiArticleForm.author_type,
        industry_presets: {
          fabric: '',
          breathability: '',
          industry_presets: ''
        },
        subject_desc: this.aiArticleForm.topic_type,
        detial_desc:
          this.aiArticleForm.topic_type == '产品测评'
            ? this.aiArticleForm.product_review
            : this.aiArticleForm.seasonal_recommend
      }
      console.log(this.aiArticleForm)

      await this.$api.article.createArticleByAI(params)
    }
  }
}
</script>

<style scoped lang="scss"></style>
