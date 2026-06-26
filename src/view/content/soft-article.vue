<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}

.ai-tag {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: var(--primary);
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
    <SpPage>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <SpFilterForm :model="searchForm" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="title" :label="$t('5f65b998.fcaf13')">
          <el-input v-model="searchForm.title" :placeholder="$t('5f65b998.182ff4')" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button icon="plus" type="primary" @click="handleCreateArticle">
          {{ $t('5f65b998.7bc00e') }}
        </el-button>
        <el-button icon="plus" type="primary" @click="createArticleByAI">
          {{ $t('5f65b998.b956ea') }}
        </el-button>
      </div>

      <el-tabs v-model="activeTab" type="card" @tab-click="onTabChange">
        <el-tab-pane :label="$t('5f65b998.a8b0c2')" name="all" />
        <el-tab-pane :label="$t('5f65b998.0737ae')" name="wait" />
        <el-tab-pane :label="$t('5f65b998.dca0c1')" name="published" />
      </el-tabs>

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
        :title="$t('5f65b998.b956ea')"
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
    </SpPage>
  </SpRouterView>
</template>

<script>
import { INDUSTRY } from './consts'
export default {
  data() {
    return {
      activeTab: 'all',
      articleList: [],
      aiArticleForm: {
        channel: '',
        goods: [],
        author_type: '运动达人',
        author_type_customer: '',
        industry: '',
        industry_presets: '',
        topic_type: '产品测评',
        topic_type_customer: ''
      },
      aiArticleFormList: [
        {
          label: this.$t('5f65b998.d8d7c5'),
          key: 'channel',
          type: 'select',
          required: true,
          placeholder: this.$t('5f65b998.0b5eb8'),
          options: []
        },
        {
          label: this.$t('5f65b998.6adafe'),
          key: 'industry',
          type: 'select',
          required: true,
          placeholder: this.$t('5f65b998.0b5eb8'),
          options: [
            { title: this.$t('5f65b998.cef92e'), value: '运动服饰' },
            { title: this.$t('5f65b998.b4ef24'), value: '护肤' }
          ]
        },
        {
          label: this.$t('5f65b998.7f8121'),
          key: 'goods',
          component: ({ key }, form) => {
            return (
              <div>
                <el-button disabled={form[key].length >= 3} onClick={this.onSelectGoods}>
                  {this.$t('5f65b998.43d1e2')}
                </el-button>
                <SpGoodsGroup v-model={form[key]} style='margin-top: 10px;' />
              </div>
            )
          },
          tip: this.$t('5f65b998.014e2a')
        },
        {
          label: this.$t('5f65b998.6a26ff'),
          key: 'author_type',
          type: 'select',
          options: [
            { title: this.$t('5f65b998.a81daf'), value: '运动达人' },
            { title: this.$t('5f65b998.f7aa08'), value: '潮流小主' },
            { title: this.$t('5f65b998.f1d4ff'), value: '自定义' }
          ]
        },
        {
          label: '',
          key: 'author_type_customer',
          type: 'input',
          placeholder: this.$t('5f65b998.02cc4f'),
          isShow: ({ key }, form) => form.author_type === '自定义'
        },
        {
          label: this.$t('5f65b998.71348d'),
          key: 'topic_type',
          type: 'select',
          options: [
            { title: this.$t('5f65b998.e4386d'), value: '产品测评' },
            { title: this.$t('5f65b998.e34c93'), value: '季节性推荐' },
            { title: this.$t('5f65b998.f1d4ff'), value: '自定义' }
          ]
        },
        {
          label: '',
          key: 'topic_type_customer',
          type: 'textarea',
          placeholder: this.$t('5f65b998.02cc4f'),
          isShow: ({ key }, form) => form.topic_type === '自定义'
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
  watch: {
    $route(to, from) {
      if (from && from.path.includes('editor') && to && !to.path.includes('editor')) {
        this.$nextTick(() => {
          const ref = this.$refs.paginationRef
          if (ref) {
            ref.refresh(!from.query.id)
          }
        })
      }
    }
  },
  methods: {
    onSearch() {
      this.$refs['paginationRef'].refresh(true)
    },
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
        await this.$confirm(this.$t('5f65b998.da19c4'), this.$t('5f65b998.02d981'))
        await this.$api.article.deleteArticle(article_id)
        this.$message.success(this.$t('5f65b998.0007d1'))
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
          release_status ? this.$t('5f65b998.033518') : this.$t('5f65b998.af1f19'),
          this.$t('5f65b998.02d981')
        )
        await this.$api.article.updateArticleSortOrStatus({
          inputdata: [
            {
              article_id: article_id,
              release_status: !release_status
            }
          ]
        })
        this.$message.success(
          release_status ? this.$t('5f65b998.52bb3c') : this.$t('5f65b998.2fff07')
        )
        this.$refs['paginationRef'].refresh()
      } catch (error) {}
    },
    handleClick(item) {
      this.$router.push({ path: this.matchRoutePath('editor'), query: { id: item.article_id } })
    },
    onTabChange() {
      this.$refs['paginationRef'].refresh()
    },
    async fetchList({ page, pageSize }) {
      const releaseStatus = {
        all: '2',
        wait: '0',
        published: '1'
      }
      const params = {
        page,
        pageSize,
        article_type: 'bring',
        title: this.searchForm.title,
        release_status: releaseStatus[this.activeTab]
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
        this.$message.error(this.$t('5f65b998.014e2a'))
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
        author_persona:
          this.aiArticleForm.author_type == '自定义'
            ? this.aiArticleForm.author_type_customer
            : this.aiArticleForm.author_type,
        industry: this.aiArticleForm.industry,
        industry_presets: INDUSTRY[this.aiArticleForm.industry],
        subject_desc:
          this.aiArticleForm.topic_type == '自定义'
            ? this.aiArticleForm.topic_type_customer
            : this.aiArticleForm.topic_type
      }
      await this.$api.article.createArticleByAI(params)
      this.drawerShow = false
      this.$message.success(this.$t('5f65b998.432843'))
      this.$refs['paginationRef'].refresh(true)
    }
  }
}
</script>

<style scoped lang="scss"></style>
