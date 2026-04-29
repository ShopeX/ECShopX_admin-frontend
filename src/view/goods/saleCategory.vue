<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.page-goods-salecategory {
  .el-table__cell {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .img-container {
    width: 48px;
    height: 48px;
  }
}
</style>

<template>
  <SpPage>
    <div class="page-goods-salecategory">
      <div class="action-container flex items-center gap-4">
        <el-button type="primary" @click="addCategory"> {{ $t('0e7dabe2.c171b3') }} </el-button>
        <div v-if="!VERSION_PLATFORM()" class="flex items-center gap-2">
          <span>{{ $t('0e7dabe2.63cd0e') }}</span>
          <el-switch
            v-model="saleableEnabled"
            :active-value="true"
            :inactive-value="false"
            @change="handleSaleableChange"
          />
        </div>
      </div>

      <el-table
        ref="tableTree"
        :data="categoryList"
        row-key="category_id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :load="load"
        width="100%"
      >
        <el-table-column label="" width="60" />
        <el-table-column :label="$t('0e7dabe2.2b6bc0')" width="450">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  path: IS_DISTRIBUTOR()
                    ? '/shopadmin/entity/goodsphysical'
                    : '/products/product-manage/self-products',
                  query: { category: scope.row.path }
                }"
              >
                {{ $t('0e7dabe2.f13684') }}
              </router-link>
            </el-button>
            <el-button
              v-if="scope.row.category_level < 3"
              type="text"
              @click="appendChildren(scope.row)"
            >
              {{ $t('0e7dabe2.82537d') }}
            </el-button>
            <el-button type="text" @click="editCategory(scope.row)">
              {{ $t('0e7dabe2.95b351') }}
            </el-button>
            <el-popover v-if="appID" placement="top" width="200" trigger="click">
              <div>
                <img class="page-code" :src="appCodeUrl" />
                <div class="page-btns">
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleDownload(scope.row.category_name)"
                  >
                    {{ $t('0e7dabe2.99e985') }}
                  </el-button>
                  <el-button v-clipboard:copy="curPageUrl" type="primary" plain size="mini">
                    {{ $t('0e7dabe2.879058') }}
                  </el-button>
                </div>
              </div>
              <el-button
                slot="reference"
                style="min-width: 65px"
                type="text"
                @click="handleClick(scope.row.category_id)"
              >
                {{ $t('0e7dabe2.536ff1') }}
              </el-button>
            </el-popover>
            <el-button type="text" @click.native.prevent="deleteCategory(scope.row)">
              {{ $t('0e7dabe2.2f4aad') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('0e7dabe2.04d7d8')" prop="category_name" width="280">
          <template slot-scope="scope">
            <div class="whitespace-nowrap">
              {{ scope.row.category_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" :label="$t('0e7dabe2.53eb44')" width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.sort }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('0e7dabe2.e8f9a1')" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.is_show_front"
              active-value="1"
              inactive-value="0"
              @change="(val) => onIsShowFrontChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('0e7dabe2.b34dc8')" width="200">
          <template slot-scope="scope">
            <div class="img-container">
              <SpImage
                v-if="scope.row.image_url"
                :src="scope.row.image_url"
                :width="48"
                :height="48"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加分组 -->
      <SpDialog
        ref="categoryDialogRef"
        v-model="categoryDialog"
        :title="categoryForm.category_id > 0 ? $t('0e7dabe2.55d793') : $t('0e7dabe2.9811be')"
        :modal="false"
        :form="categoryForm"
        :form-list="categoryFormList"
        @onSubmit="onCategoryFormSubmit"
      />
    </div>
  </SpPage>
</template>
<script>
import Vue from 'vue'
export default {
  data() {
    return {
      loading: false,
      categoryList: [],
      appID: '',
      appCodeUrl: '',
      curPageUrl: '',
      mapData: null,
      cacheRowData: null,
      categoryDialog: false,
      saleableEnabled: true,
      categoryForm: {
        category_id: '',
        category_name: '',
        sort: 0,
        parent_id: 0,
        parent_name: '',
        image_url: '',
        customize_page_id: '',
        is_show_front: '1'
      }
    }
  },
  computed: {
    categoryFormList() {
      return [
        {
          label: this.$t('0e7dabe2.04d7d8'),
          key: 'category_name',
          type: 'input',
          placeholder: this.$t('0e7dabe2.68363f'),
          required: true,
          message: this.$t('0e7dabe2.281bad')
        },
        {
          label: this.$t('0e7dabe2.53eb44'),
          key: 'sort',
          type: 'number'
        },
        {
          label: this.$t('0e7dabe2.e8f9a1'),
          key: 'is_show_front',
          component: ({ key }, value) => (
            <el-switch v-model={value[key]} active-value='1' inactive-value='0' />
          )
        },
        {
          label: this.$t('0e7dabe2.dc1eed'),
          key: 'parent_name',
          type: 'text',
          isShow: ({ key }, value) =>
            this.categoryForm.parent_id > 0 && !this.categoryForm.category_id
        },
        {
          label: this.$t('0e7dabe2.b34dc8'),
          key: 'image_url',
          component: ({ key }, value) => <SpImagePicker v-model={value[key]} />
        }
      ]
    }
  },
  created() {
    this.mapData = new Map()
  },
  mounted() {
    this.init()
    this.fetchWechatList()
    if (!this.VERSION_PLATFORM()) {
      this.fetchSaleableFilter()
    }
    // this.classification()
  },
  methods: {
    async classification() {
      let params = {
        page: 1,
        pageSize: 10,
        page_type: 'category',
        template_name: 'yykweishop'
      }
      let { list } = await this.$api.wxa.getCustomPageList(params)
      console.log(list, 'src/view/goods/saleCategory.vue-第197行')
      list.forEach((element) => {
        ;(element.title = element.page_name), (element.value = element.id)
      })
      this.categoryFormList[4].options = list
    },
    async init() {
      const list = await this.getCategory()
      this.categoryList = list
    },
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      const { authorizer = {} } = list.find((item) => item.key_name == 'yykweishop') || {}
      const { authorizer_appid } = authorizer
      this.appID = authorizer_appid
    },
    async fetchSaleableFilter() {
      try {
        const res = await this.$api.goods.getSaleableFilter()
        this.saleableEnabled = res.enabled ?? true
      } catch (e) {
        console.error(this.$t('0e7dabe2.976500'), e)
      }
    },
    async handleSaleableChange(value) {
      try {
        await this.$api.goods.setSaleableFilter({ enabled: value })
        this.$message.success(value ? this.$t('0e7dabe2.164ac5') : this.$t('0e7dabe2.819f29'))
      } catch (e) {
        // 如果失败，恢复原值
        this.saleableEnabled = !value
        this.$message.error(this.$t('0e7dabe2.9f9603'))
      }
    },
    addCategory() {
      this.categoryForm = {
        category_id: '',
        category_name: '',
        sort: 0,
        parent_id: 0,
        parent_name: '',
        image_url: '',
        customize_page_id: '',
        is_show_front: '1'
      }
      this.categoryDialog = true
    },
    // 编辑分类（与列表「前台是否显示」开关保持一致：统一为 '1'/'0'）
    editCategory({
      parent_id,
      category_id,
      category_name,
      sort,
      image_url,
      customize_page_id,
      is_show_front
    }) {
      const showFront = is_show_front === 1 || is_show_front === '1' || is_show_front === true
      this.categoryForm = {
        category_id,
        category_name,
        sort,
        parent_id,
        image_url,
        customize_page_id: customize_page_id == 0 ? '' : customize_page_id,
        is_show_front: showFront ? '1' : '0'
      }
      this.categoryDialog = true
    },
    // 添加子分类
    appendChildren(row) {
      const { category_id, category_name } = row
      this.cacheRowData = row
      this.categoryForm = {
        category_id: '',
        category_name: '',
        sort: 0,
        parent_id: category_id,
        parent_name: category_name,
        image_url: '',
        customize_page_id: '',
        is_show_front: '1'
      }
      this.categoryDialog = true
    },
    async onIsShowFrontChange(row, val) {
      try {
        await this.$api.goods.editCategory({
          category_id: row.category_id,
          is_show_front: val
        })
        this.$set(row, 'is_show_front', val)
        this.$message.success(this.$t('0e7dabe2.3bb47b'))
      } catch (e) {
        this.$message.error(e?.message || this.$t('0e7dabe2.02d981'))
      }
    },

    async handleClick(cat_id) {
      const page = 'subpages/item/list'
      this.curPageUrl = `${page}?cat_id=${cat_id}`
      let params = {
        wxaAppId: this.appID,
        page,
        cat_id
      }
      const { base64Image } = await this.$api.marketing.getPageCode(params)
      this.appCodeUrl = base64Image
    },
    handleDownload(name) {
      var a = document.createElement('a')
      var temp = name
      if (this.appCodeUrl) {
        a.href = this.appCodeUrl
        a.download = temp + '.png'
        a.click()
      }
    },
    async getCategory(pid = 0) {
      const res = await this.$api.goods.getCategory({
        parent_id: pid
      })
      const list = res.map((item) => {
        const showFront =
          item.is_show_front === 1 || item.is_show_front === '1' || item.is_show_front === true
        return {
          ...item,
          hasChildren: item.has_children == '1',
          is_show_front: showFront ? '1' : '0'
        }
      })
      return list
    },
    async load(tree, treeNode, resolve) {
      const { category_id } = tree
      this.mapData.set(category_id, { tree, treeNode, resolve })
      const list = await this.getCategory(category_id, treeNode)
      resolve(list)
    },
    async onCategoryFormSubmit() {
      const {
        category_name,
        sort,
        image_url,
        customize_page_id,
        parent_id,
        category_id,
        is_show_front
      } = this.categoryForm
      if (category_id) {
        await this.$api.goods.editCategory({
          category_name,
          sort,
          image_url,
          category_id,
          customize_page_id,
          is_show_front
        })
        this.$message.success(this.$t('0e7dabe2.3bb47b'))
      } else {
        await this.$api.goods.addCategory({
          category_name,
          sort,
          image_url,
          customize_page_id,
          is_show_front,
          parent_id: parent_id != '0' ? parent_id : undefined
        })
        this.$message.success(this.$t('0e7dabe2.3fdaea'))
      }
      this.refreshNode(parent_id)
      this.categoryDialog = false
    },
    async deleteCategory(row) {
      await this.$confirm(this.$t('0e7dabe2.442ecc'), this.$t('0e7dabe2.02d981'), {
        confirmButtonText: this.$t('0e7dabe2.38cf16'),
        cancelButtonText: this.$t('0e7dabe2.625fb2')
      })
      const { parent_id, category_id } = row
      this.cacheRowData = row
      await this.$api.goods.deleteCategory(category_id)
      this.$message.success(this.$t('0e7dabe2.1fe03c'))
      this.refreshNode(parent_id)
      // const store = this.$refs.tableTree.store
      // let parentRow, index
      // if (parent_id != '0') {
      //   parentRow = store.states.lazyTreeNodeMap[parent_id]
      //   index = parentRow.findIndex((child) => child.category_id == category_id)
      //   parentRow.splice(index, 1)
      // } else {
      //   parentRow = store.states.data
      //   index = parentRow.findIndex((child) => child.category_id == category_id)
      //   parentRow.splice(index, 1)
      // }
    },
    async refreshNode(parent_id) {
      if (parent_id == '0') {
        this.init()
        return
      }
      const list = await this.getCategory(parent_id)
      const { resolve } = this.mapData.get(parent_id) || {}
      if (resolve) {
        if (list.length > 0) {
          resolve(list)
        } else {
          const { lazyTreeNodeMap } = this.$refs.tableTree.store.states
          this.$set(lazyTreeNodeMap, parent_id, [])
        }
      } else {
        const store = this.$refs.tableTree.store
        this.cacheRowData['hasChildren'] = true
        this.$nextTick(() => {
          store.loadOrToggle(this.cacheRowData)
        })
      }
    }
  }
}
</script>
