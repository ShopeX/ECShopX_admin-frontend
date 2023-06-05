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
  <div class="page-goods-maincategory">
    <div v-if="!IS_DISTRIBUTOR" class="action-container">
      <el-button type="primary" plain @click="addCategory"> 添加管理分类 </el-button>
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
      <el-table-column label="分类名称" width="480">
        <template slot-scope="scope">
          <span
            v-if="!scope.row.hasChildren && scope.row.category_level == '1'"
            style="display: inline-block; width: 24px"
          />
          <span>{{ scope.row.category_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="分类排序" width="140">
        <template slot-scope="scope">
          <div>{{ scope.row.sort }}</div>
        </template>
      </el-table-column>
      <el-table-column label="分类图片" width="200">
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link
              :to="{
                path: '/entity/goods/goodsphysical',
                query: { main_cat_id: scope.row.category_id }
              }"
            >
              查看商品
            </router-link>
          </el-button>
          <el-button
            v-if="scope.row.category_level == 3"
            type="text"
            @click="onLinkGoodsParams(scope.row)"
          >
            关联参数
          </el-button>
          <el-button
            v-if="scope.row.category_level == 3"
            type="text"
            @click="onLinkGoodsSku(scope.row)"
          >
            关联规格
          </el-button>
          <el-button
            v-if="scope.row.category_level == 3"
            type="text"
            @click="handleProfitPrice(scope.row)"
          >
            分润配置
          </el-button>
          <el-button
            v-if="scope.row.category_level < 3"
            type="text"
            @click="appendChildren(scope.row)"
          >
            新增子类
          </el-button>
          <el-button type="text" @click="editCategory(scope.row)"> 编辑 </el-button>
          <el-button type="text" @click.native.prevent="deleteCategory(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加分组 -->
    <SpDialog
      ref="categoryDialogRef"
      v-model="categoryDialog"
      :title="categoryForm.category_id > 0 ? '编辑分类' : '添加分类'"
      :modal="false"
      :form="categoryForm"
      :form-list="categoryFormList"
      @onSubmit="onCategoryFormSubmit"
    />

    <!-- 分润配置 -->
    <SpDialog
      ref="profitDialogRef"
      v-model="profitDialog"
      :title="`分润配置`"
      :modal="false"
      :form="profitForm"
      :form-list="profitFormList"
      @onSubmit="onProfitFormSubmit"
    />
  </div>
</template>
<script>
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
      categoryForm: {
        category_id: '',
        category_name: '',
        sort: 0,
        parent_id: 0,
        parent_name: '',
        image_url: ''
      },
      categoryFormList: [
        {
          label: '分类名称',
          key: 'category_name',
          type: 'input',
          placeholder: '请输入分类名称',
          required: true,
          message: '不能为空'
        },
        {
          label: '分类排序',
          key: 'sort',
          type: 'number'
        },
        {
          label: '父级分类',
          key: 'parent_name',
          type: 'text',
          isShow: ({ key }, value) =>
            this.categoryForm.parent_id > 0 && !this.categoryForm.category_id
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
              <div style='margin-left: 8px; line-height: initial;'>导购分润计算方式: </div>
              <div class='form-item-tip'>
                【按比例分佣】商品最终金额 ×
                百分比（其中商品最终金额为【支付金额-运费-商品优惠金额】）
              </div>
              <div class='form-item-tip'>【按金额分佣】固定金额分佣</div>
            </div>
          )
        },
        {
          label: '分类名称',
          key: 'category_name',
          type: 'text'
        },
        {
          label: '推广分润',
          key: 'profit_conf_profit',
          component: ({ key }, value) => <SpInput v-model={value[key]} suffix={'%'} />
        },
        {
          label: '拉新分润',
          key: 'profit_conf_popularize_profit',
          component: ({ key }, value) => <SpInput v-model={value[key]} suffix={'%'} />
        }
      ]
    }
  },
  created() {
    this.mapData = new Map()
  },
  mounted() {
    this.init()
  },
  methods: {
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
        image_url: ''
      }
      this.categoryDialog = true
    },
    // 编辑分类
    editCategory({ parent_id, category_id, category_name, sort, image_url }) {
      this.categoryForm = {
        category_id,
        category_name,
        sort,
        parent_id,
        image_url
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
        image_url: ''
      }
      this.categoryDialog = true
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
      this.$message.success('保存成功')
      this.profitDialog = false
      const { resolve } = this.mapData.get(parent_id)
      const list = await this.getCategory(parent_id)
      resolve(list)
    },
    async onLinkGoodsParams({ parent_id, category_id, goods_params = [] }) {
      const { data } = await this.$picker.goodsParams({
        dialogTitle: '关联参数',
        data: JSON.parse(goods_params),
        queryParams: {
          attribute_type: 'item_params'
        },
        num: 5
      })
      await this.$api.goods.updateCategory(category_id, {
        goods_params: JSON.stringify(data.map((item) => item.attribute_id))
      })
      this.refreshNode(parent_id)
    },
    async onLinkGoodsSku({ parent_id, category_id, goods_spec = [] }) {
      const { data } = await this.$picker.goodsParams({
        dialogTitle: '关联规格',
        data: JSON.parse(goods_spec),
        queryParams: {
          attribute_type: 'item_spec'
        },
        num: 3,
        islimitImgType:true
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
        return {
          ...item,
          image_url: item.image_url || '',
          hasChildren: item.has_children == '1'
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
      const { category_name, sort, image_url, parent_id, category_id } = this.categoryForm
      if (category_id) {
        await this.$api.goods.editCategory({
          category_name,
          sort,
          image_url,
          category_id
        })
        this.$message.success('编辑成功')
      } else {
        await this.$api.goods.addCategory({
          category_name,
          sort,
          is_main_category: 1,
          parent_id: parent_id != '0' ? parent_id : undefined
        })
        this.$message.success('添加成功')
      }
      this.refreshNode(parent_id)
      this.categoryDialog = false
    },
    async deleteCategory({ parent_id, category_id }) {
      await this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await this.$api.goods.deleteCategory(category_id)
      this.$message.success('删除分类成功')
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
