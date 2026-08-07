<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.page-goods-maincategory {
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
    <div class="page-goods-maincategory">
      <div v-if="!IS_DISTRIBUTOR()" class="action-container">
        <el-button type="primary" @click="addCategory"> {{ $t('2dc17300.dd920c') }} </el-button>
      </div>

      <el-table
        ref="tableTree"
        :data="categoryList"
        row-key="category_id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :load="load"
      >
        <el-table-column :label="$t('2dc17300.2b6bc0')" width="450">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  path: '/products/product-manage/self-products',
                  query: { main_cat_id: scope.row.category_id }
                }"
              >
                {{ VERSION_PLATFORM() ? $t('2dc17300.77e29f') : $t('2dc17300.f13684') }}
              </router-link>
            </el-button>
            <el-button v-if="VERSION_PLATFORM()" type="text">
              <router-link
                :to="{
                  path: '/products/product-manage/merchant-products',
                  query: { main_cat_id: scope.row.category_id }
                }"
              >
                {{ $t('2dc17300.54d6cd') }}
              </router-link>
            </el-button>
            <el-button
              v-if="scope.row.category_level == 3"
              type="text"
              @click="onLinkGoodsParams(scope.row)"
            >
              {{ $t('2dc17300.804a1f') }}
            </el-button>
            <el-button
              v-if="scope.row.category_level == 3"
              type="text"
              @click="onLinkGoodsSku(scope.row)"
            >
              {{ $t('2dc17300.ea4da6') }}
            </el-button>
            <!-- <el-button
            v-if="scope.row.category_level == 3"
            type="text"
            @click="handleProfitPrice(scope.row)"
          >
            分润配置
          </el-button> -->
            <el-button
              v-if="scope.row.category_level < 3"
              type="text"
              @click="appendChildren(scope.row)"
            >
              {{ $t('2dc17300.82537d') }}
            </el-button>
            <el-button type="text" @click="editCategory(scope.row)">
              {{ $t('2dc17300.95b351') }}
            </el-button>
            <el-button type="text" @click.native.prevent="deleteCategory(scope.row)">
              {{ $t('2dc17300.2f4aad') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('2dc17300.04d7d8')" width="280">
          <template slot-scope="scope">
            <span
              v-if="!scope.row.hasChildren && scope.row.category_level == '1'"
              style="display: inline-block; width: 24px"
            />
            <span>{{ scope.row.category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('2dc17300.5ef9fc')" prop="category_id" width="120" />
        <el-table-column :label="$t('2dc17300.b34dc8')" width="200">
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
        <el-table-column
          v-if="showIsShowFront"
          :label="$t('2dc17300.6891b4')"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.is_show_front"
              active-value="1"
              inactive-value="0"
              @change="(val) => onIsShowFrontChange(scope.row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sort" :label="$t('2dc17300.53eb44')" width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.sort }}</div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加分组 -->
      <SpDialog
        ref="categoryDialogRef"
        v-model="categoryDialog"
        :title="categoryForm.category_id > 0 ? $t('2dc17300.55d793') : $t('2dc17300.9811be')"
        :modal="false"
        :form="categoryForm"
        :form-list="categoryFormList"
        @onSubmit="onCategoryFormSubmit"
      />

      <!-- 分润配置 -->
      <SpDialog
        ref="profitDialogRef"
        v-model="profitDialog"
        :title="$t('2dc17300.d2d71c')"
        :modal="false"
        :form="profitForm"
        :form-list="profitFormList"
        @onSubmit="onProfitFormSubmit"
      />
    </div>

    <SpTranslatePopup
      ref="translatePopup"
      table-name="items_category"
      :data-id="translateContext.dataId"
      :fields="translateContext.fields"
      :values="translateContext.values"
      :source-language="translateContext.sourceLang"
      @done="onTranslateDone"
      @save-only="onTranslateSaveOnly"
      @cancel="onTranslateCancel"
    />
  </SpPage>
</template>
<script>
import SpTranslatePopup from '@/components/sp-translate-popup'
import translateMixin from '@/mixins/translateMixin'
export default {
  components: { SpTranslatePopup },
  mixins: [translateMixin],
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
      categoryForm: {
        category_id: '',
        category_name: '',
        sort: 0,
        parent_id: 0,
        parent_name: '',
        image_url: '',
        is_show_front: '1'
      },
      categoryFormList: [
        {
          label: this.$t('2dc17300.04d7d8'),
          key: 'category_name',
          type: 'input',
          placeholder: this.$t('2dc17300.68363f'),
          required: true,
          message: this.$t('2dc17300.281bad')
        },
        {
          label: this.$t('2dc17300.dc1eed'),
          key: 'parent_name',
          type: 'text',
          isShow: ({ key }, value) =>
            this.categoryForm.parent_id > 0 && !this.categoryForm.category_id
        },
        {
          label: this.$t('2dc17300.b34dc8'),
          key: 'image_url',
          component: ({ key }, value) => <SpImagePicker v-model={value[key]} />
        },
        {
          label: this.$t('2dc17300.6891b4'),
          key: 'is_show_front',
          isShow: () => this.showIsShowFront,
          component: ({ key }, value) => (
            <el-switch v-model={value[key]} active-value='1' inactive-value='0' />
          )
        },
        {
          label: this.$t('2dc17300.53eb44'),
          key: 'sort',
          type: 'number'
        }
      ],
      profitDialog: false,
      profitForm: {
        parent_id: '',
        category_id: '',
        category_name: '',
        profit_conf_profit: '',
        profit_conf_popularize_profit: ''
      },
      profitFormList: [
        {
          component: () => (
            <div>
              <div style='margin-left: 8px; line-height: initial;'>
                {this.$t('2dc17300.9da956')}
              </div>
              <div class='form-item-tip'>{this.$t('2dc17300.acd13b')}</div>
              <div class='form-item-tip'>{this.$t('2dc17300.d72c97')}</div>
            </div>
          )
        },
        {
          label: this.$t('2dc17300.04d7d8'),
          key: 'category_name',
          type: 'text'
        },
        {
          label: this.$t('2dc17300.2602ac'),
          key: 'profit_conf_profit',
          component: ({ key }, value) => <SpInput v-model={value[key]} suffix={'%'} />
        },
        {
          label: this.$t('2dc17300.f309a2'),
          key: 'profit_conf_popularize_profit',
          component: ({ key }, value) => <SpInput v-model={value[key]} suffix={'%'} />
        }
      ]
    }
  },
  computed: {
    // 仅 B2B2C：bbc 构建 + platform 运行时展示「前台是否显示」
    showIsShowFront() {
      return process.env.VUE_APP_PLATFORM === 'bbc' && this.VERSION_PLATFORM()
    }
  },
  created() {
    this.mapData = new Map()
  },
  mounted() {
    this.init()
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
    addCategory() {
      this.categoryForm = {
        category_id: '',
        category_name: '',
        sort: 0,
        parent_id: 0,
        parent_name: '',
        image_url: '',
        is_show_front: '1'
      }
      this.categoryDialog = true
    },
    // 编辑分类（与列表「前台是否显示」开关保持一致：统一为 '1'/'0'）
    editCategory({ parent_id, category_id, category_name, sort, image_url, is_show_front }) {
      const showFront = is_show_front === 1 || is_show_front === '1' || is_show_front === true
      this.categoryForm = {
        category_id,
        category_name,
        sort,
        parent_id,
        image_url,
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
        this.$message.success(this.$t('2dc17300.3bb47b'))
      } catch (e) {
        this.$message.error(e?.message || this.$t('2dc17300.02d981'))
      }
    },
    // 分润配置
    handleProfitPrice({
      parent_id,
      category_id,
      category_name,
      profit_conf_profit,
      profit_conf_popularize_profit
    }) {
      this.profitForm = {
        parent_id,
        category_id,
        category_name,
        profit_conf_profit,
        profit_conf_popularize_profit
      }
      this.profitDialog = true
    },
    async onProfitFormSubmit() {
      const { parent_id, category_id, profit_conf_profit, profit_conf_popularize_profit } =
        this.profitForm
      const params = {
        category_id: category_id,
        profit_conf: JSON.stringify({
          profit_conf_profit,
          profit_conf_popularize_profit
        })
      }
      await this.$api.goods.saveCategoryProfitPrice(params)
      this.$message.success(this.$t('2dc17300.3b1083'))
      this.profitDialog = false
      const { resolve } = this.mapData.get(parent_id)
      const list = await this.getCategory(parent_id)
      resolve(list)
    },
    async onLinkGoodsParams({ parent_id, category_id, goods_params = [] }) {
      const { data } = await this.$picker.goodsParams({
        dialogTitle: this.$t('2dc17300.804a1f'),
        data: JSON.parse(goods_params),
        queryParams: {
          attribute_type: 'item_params'
        },
        num: 99
      })
      await this.$api.goods.updateCategory(category_id, {
        goods_params: JSON.stringify(data.map((item) => item.attribute_id))
      })
      this.refreshNode(parent_id)
    },
    async onLinkGoodsSku({ parent_id, category_id, goods_spec = [] }) {
      const { data } = await this.$picker.goodsParams({
        dialogTitle: this.$t('2dc17300.ea4da6'),
        data: JSON.parse(goods_spec),
        queryParams: {
          attribute_type: 'item_spec'
        },
        num: 3,
        islimitImgType: true
      })
      await this.$api.goods.updateCategory(category_id, {
        goods_spec: JSON.stringify(data.map((item) => item.attribute_id))
      })
      this.refreshNode(parent_id)
    },
    async getCategory(pid = 0) {
      const res = await this.$api.goods.getCategory({
        parent_id: pid,
        is_main_category: true
      })
      const list = res.map((item) => {
        const showFront =
          item.is_show_front === 1 || item.is_show_front === '1' || item.is_show_front === true
        return {
          ...item,
          image_url: item.image_url || '',
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
      const { category_name, sort, image_url, parent_id, category_id, is_show_front } =
        this.categoryForm
      const showFrontParams = this.showIsShowFront ? { is_show_front } : {}
      if (category_id) {
        await this.$api.goods.editCategory({
          category_name,
          sort,
          image_url,
          category_id,
          ...showFrontParams
        })
        this.$message.success(this.$t('2dc17300.3bb47b'))
        this.refreshNode(parent_id)
        this.categoryDialog = false
        this.openTranslate(category_id, ['category_name'], [category_name || ''])
      } else {
        const res = await this.$api.goods.addCategory({
          category_name,
          sort,
          is_main_category: 1,
          image_url,
          parent_id: parent_id != '0' ? parent_id : undefined,
          ...showFrontParams
        })
        this.$message.success(this.$t('2dc17300.3fdaea'))
        this.refreshNode(parent_id)
        this.categoryDialog = false
        // 创建/编辑保持一致：弹「同步翻译」弹框
        const newCategoryId =
          (res && res.data && res.data.data && (res.data.data.category_id || res.data.data.id)) || 0
        if (newCategoryId) {
          this.openTranslate(newCategoryId, ['category_name'], [category_name || ''])
        }
      }
    },
    onTranslateDone() {},
    // 列表页内嵌表单：仅保存/取消停留在当前列表页
    goBackTranslateList() {},
    async deleteCategory({ parent_id, category_id }) {
      await this.$confirm(this.$t('2dc17300.442ecc'), this.$t('2dc17300.02d981'), {
        confirmButtonText: this.$t('2dc17300.38cf16'),
        cancelButtonText: this.$t('2dc17300.625fb2')
      })
      await this.$api.goods.deleteCategory(category_id)
      this.$message.success(this.$t('2dc17300.1fe03c'))
      this.refreshNode(parent_id)
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
