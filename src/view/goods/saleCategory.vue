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
  <div class="page-goods-salecategory">
    <div class="refund-address" style="margin-bottom: 10px">
      <el-select
        v-model="search.regionauth_id"
        placeholder="请选择"
        clearable
        @change="handleRegionChange"
      >
        <el-option v-for="(el, index) in areas" :key="index" :label="el.label" :value="el.value" />
      </el-select>
      <SpSelectShop
        v-if="IS_DISTRIBUTOR()"
        v-model="search.distributor_id"
        clearable
        placeholder="请选择店铺"
        @change="handleRegionChange"
      />
    </div>
    <div class="action-container">
      <el-button type="primary" plain @click="addCategory"> 添加销售分类 </el-button>
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
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link
              :to="{
                path: IS_DISTRIBUTOR()
                  ? '/shopadmin/entity/goodsphysical'
                  : '/entity/goods/goodsphysical',
                query: { category: scope.row.path }
              }"
            >
              查看商品
            </router-link>
          </el-button>
          <el-button
            v-if="scope.row.category_level < 3"
            type="text"
            @click="appendChildren(scope.row)"
          >
            新增子类
          </el-button>
          <el-button type="text" @click="editCategory(scope.row)"> 编辑 </el-button>
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
                  下载码
                </el-button>
                <el-button v-clipboard:copy="curPageUrl" type="primary" plain size="mini">
                  复制链接
                </el-button>
              </div>
            </div>
            <el-button
              slot="reference"
              style="width: 45px"
              type="text"
              @click="handleClick(scope.row.id)"
            >
              投放
            </el-button>
          </el-popover>
          <el-button type="text" @click.native.prevent="deleteCategory(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="销售分类名称" width="480">
        <template slot-scope="scope">
          <span
            v-if="!scope.row.hasChildren && scope.row.category_level == '1'"
            style="display: inline-block; width: 24px"
          />
          <span>{{ scope.row.category_name }}</span>
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
      <el-table-column prop="sort" label="分类排序优先级" width="140" />
      <el-table-column prop="main_category_name" label="关联管理分类" />
      <el-table-column prop="distributor_names" label="关联店铺" />
      <el-table-column prop="regionauth_name" label="所属区域" />
      <!-- <el-table-column label="一级分类模版" width="200" prop="customize_page_name" /> -->
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
  </div>
</template>
<script>
import api from '@/api'

import { categoryFormList, defaultFormValue } from './saleCategorySchema.js'

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
      categoryForm: defaultFormValue(),
      search: {
        regionauth_id: '',
        distributor_id: ''
      },
      areas: [],
      manageCategory: []
    }
  },
  computed: {
    categoryFormList() {
      return categoryFormList(this)
    }
  },
  created() {
    this.mapData = new Map()
  },
  mounted() {
    api.regionauth.getRegionauth().then((res) => {
      this.areas = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name
      }))
    })
    this.init()
    this.fetchWechatList()
    this.classification()
    this.fetchManageCategory()
  },

  methods: {
    handleRegionChange() {
      this.init()
    },
    async classification() {
      let params = {
        page: 1,
        pageSize: 10,
        page_type: 'category',
        template_name: 'yykweishop'
      }
      let { list } = await this.$api.wxa.getCustomPageList(params)
      list.forEach((element) => {
        element.title = element.page_name
        element.value = element.id
      })
      // this.categoryFormList[4].options = list
    },
    async init() {
      const list = await this.getCategory()
      this.categoryList = list
    },
    async fetchManageCategory() {
      const list = await this.$api.goods.getCategory({ is_main_category: true })

      // 遍历list 新增value和label属性和children属性,记录原有的children属性, 并递归children,children会有多层,需要递归处理,最后维护树结构
      // 增加parent属性,记录父节点
      this.manageCategoryPaths = [] // Array to store all category paths
      const handleChildren = (children, currentPath = []) => {
        const childrenList = []
        if (!children || children.length === 0) {
          return childrenList
        }

        children.forEach((item) => {
          const nodePath = [...currentPath, item.category_id]
          this.manageCategoryPaths.push(nodePath)

          const now = {
            value: item.category_id,
            label: item.category_name,
            parent: item.parent_id
          }
          if (item.children?.length) {
            now.children = handleChildren(item.children, nodePath)
          }
          childrenList.push(now)
        })
        return childrenList
      }
      this.manageCategory = handleChildren(list)
    },
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      const { authorizer = {} } = list.find((item) => item.name == 'yykweishop') || {}
      const { authorizer_appid } = authorizer
      this.appID = authorizer_appid
    },
    addCategory() {
      this.categoryForm = defaultFormValue()
      this.categoryDialog = true
    },
    // 编辑分类
    editCategory({
      parent_id,
      category_id,
      category_name,
      sort,
      image_url,
      regionauth_id,
      main_category_ids,
      distributor_ids,
      category_level
    }) {
      const _res = []
      // 递归这个数组,找到main_category_ids中的相同id的元素
      const _main_category_ids = []
      main_category_ids?.forEach((id) => {
        const path = this.manageCategoryPaths.find((path) => path.includes(id))
        if (path) {
          _main_category_ids.push(path)
        }
      })
      this.categoryForm = {
        category_id,
        category_name,
        sort,
        parent_id,
        image_url,
        regionauth_id,
        main_category_ids: _main_category_ids,
        distributor_ids,
        category_level
      }
      this.categoryDialog = true
    },
    // 添加子分类
    appendChildren(row) {
      const { category_id, category_name, category_level, regionauth_id } = row
      this.cacheRowData = row
      this.categoryForm = {
        ...defaultFormValue(),
        parent_id: category_id,
        parent_name: category_name,
        category_level,
        regionauth_id
      }
      this.categoryDialog = true
    },

    async handleClick(cat_id) {
      const page = 'pages/item/list'
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
        parent_id: pid,
        regionauth_id: this.search.regionauth_id
      })
      const list = res.map((item) => {
        return {
          ...item,
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
      const {
        regionauth_id,
        category_name,
        sort,
        image_url,
        category_id,
        parent_id,
        main_category_ids,
        distributor_ids
      } = this.categoryForm
      const _distributor_ids =
        typeof distributor_ids === 'string' ? distributor_ids.split(',') : distributor_ids
      const _main_category_ids = main_category_ids?.map((el) => el[el?.length - 1])
      if (category_id) {
        await this.$api.goods.editCategory({
          category_id,
          category_name,
          sort,
          image_url,
          regionauth_id,
          main_category_ids: _main_category_ids,
          distributor_ids: _distributor_ids
        })
        this.$message.success('编辑成功')
      } else {
        await this.$api.goods.addCategory({
          category_name,
          sort,
          image_url,
          regionauth_id,
          main_category_ids: _main_category_ids,
          distributor_ids: _distributor_ids,
          parent_id: parent_id != '0' ? parent_id : undefined
        })
        this.$message.success('添加成功')
      }
      this.refreshNode(parent_id ? parent_id : '0')
      this.categoryDialog = false
    },
    async deleteCategory(row) {
      await this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      const { parent_id, category_id } = row
      this.cacheRowData = row
      await this.$api.goods.deleteCategory(category_id)
      this.$message.success('删除分类成功')
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
        if (this.cacheRowData) {
          this.cacheRowData['hasChildren'] = true
        }
        this.$nextTick(() => {
          store.loadOrToggle(this.cacheRowData)
        })
      }
    }
  }
}
</script>
