<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
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
  <SpPage>
    <SpRouterView>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <SpFilterForm :model="searchForm" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="title" label="软文标题:">
          <el-input v-model="searchForm.title" placeholder="请输入软文标题" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button icon="plus" type="primary" @click="handleCreateArticle"> 添加软文 </el-button>
        <el-button icon="plus" type="primary" @click="createArticleByAI"> AI创作 </el-button>
      </div>

      <el-tabs v-model="activeTab" type="card" @tab-click="onTabChange">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待发布" name="wait" />
        <el-tab-pane label="已发布" name="published" />
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
  </SpPage>
</template>

<script>
import { INDUSTRY } from './consts'
export default {
  provide() {
    return {
      refresh: () => this.$refs['paginationRef'].refresh()
    }
  },
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
          label: '选择软文频道',
          key: 'channel',
          type: 'select',
          required: true,
          placeholder: '请选择软文频道',
          options: []
        },
        {
          label: '行业',
          key: 'industry',
          type: 'select',
          required: true,
          placeholder: '请选择软文频道',
          options: [
            { title: '运动服饰', value: '运动服饰' },
            { title: '护肤', value: '护肤' }
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
                <SpGoodsGroup v-model={form[key]} style="margin-top: 10px;" />
              </div>
            )
          },
          tip: '最多添加3个商品'
        },
        {
          label: '作者人设',
          key: 'author_type',
          type: 'select',
          options: [
            { title: '运动达人', value: '运动达人' },
            { title: '潮流小主', value: '潮流小主' },
            { title: '自定义', value: '自定义' }
          ]
        },
        {
          label: '',
          key: 'author_type_customer',
          type: 'input',
          placeholder: '请输入',
          isShow: ({ key }, form) => form.author_type === '自定义'
        },
        {
          label: '创作主题描述',
          key: 'topic_type',
          type: 'select',
          options: [
            { title: '产品测评', value: '产品测评' },
            { title: '季节性推荐', value: '季节性推荐' },
            { title: '自定义', value: '自定义' }
          ]
        },
        {
          label: '',
          key: 'topic_type_customer',
          type: 'textarea',
          placeholder: '请输入',
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
    this.$activated = (to, from) => {
      if (from.meta.name == 'edit') {
        this.$refs['paginationRef'].refresh()
      } else if (from.meta.name == 'create') {
        this.$refs['paginationRef'].refresh(true)
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
      this.channelOptions = res.map(item => {
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
        item => !this.aiArticleForm.goods.find(m => m.item_id === item.item_id)
      )
      if (this.aiArticleForm.goods.concat(filterData).length > 3) {
        this.$message.error('最多添加3个商品')
        return
      }
      this.aiArticleForm.goods = this.aiArticleForm.goods.concat(filterData)
    },
    async onSubmitCreateArticle() {
      const params = {
        product: this.aiArticleForm.goods.map(item => {
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
      this.$message.success('提交成功，AI生成软文预计需要3分钟，请稍后在待发布中查看。')
      this.$refs['paginationRef'].refresh(true)
    }
  }
}
</script>

<style scoped lang="scss"></style>
