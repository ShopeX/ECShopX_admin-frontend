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
                path: IS_DISTRIBUTOR
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
              <img class="page-code" :src="appCodeUrl">
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
        },
        {
          label: '分类图片',
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
  },
  methods: {
    async init() {
      const list = await this.getCategory()
      this.categoryList = list
    },
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      const { authorizer = {} } = list.find((item) => item.name == 'yykweishop') || {}
      const { authorizer_appid } = authorizer
      this.appID = authorizer_appid
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
        parent_id: pid
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
          image_url,
          parent_id: parent_id != '0' ? parent_id : undefined
        })
        this.$message.success('添加成功')
      }
      this.refreshNode(parent_id)
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
        this.cacheRowData['hasChildren'] = true
        this.$nextTick(() => {
          store.loadOrToggle(this.cacheRowData)
        })
      }
    }
  }
}
</script>
