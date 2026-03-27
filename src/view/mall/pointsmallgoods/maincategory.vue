<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row v-if="$store.getters.login_type != 'distributor'">
      <el-col>
        <el-button type="primary" :disabled="isDisable" @click="updateCategory">
          {{ $t('fbbf67c9.408d93') }}
        </el-button>
        <el-button type="primary" plain icon="el-icon-circle-plus" @click="appendTop(categoryList)">
          {{ $t('fbbf67c9.f4ff5a') }}
        </el-button>
      </el-col>
    </el-row>
    <el-card>
      <el-table
        v-loading="loading"
        :data="categoryList"
        row-key="id"
        default-expand-all
        :height="wheight - 180"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column :label="$t('fbbf67c9.04d7d8')" min-width="280">
          <template slot-scope="scope">
            <el-input
              v-if="$store.getters.login_type != 'distributor'"
              v-model="scope.row.category_name"
              class="input-b"
              size="mini"
            />
            <span v-else class="input-b" size="mini">{{ scope.row.category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" :label="$t('fbbf67c9.53eb44')" sortable width="150">
          <template slot-scope="scope">
            <el-input
              v-if="$store.getters.login_type != 'distributor'"
              v-model="scope.row.sort"
              class="input-s"
              size="mini"
            />
            <span v-else class="input-s" size="mini">{{ scope.row.sort }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="created" :label="$t('fbbf67c9.eca37c')" width="120">
          <template slot-scope="scope">
            {{ scope.row.created | datetime }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="created"
          label="跨境税率"
          width="120">
          <template slot-scope="scope">
            <span v-if =scope.row.crossborder_tax_rate> {{ scope.row.crossborder_tax_rate }}%</span>
            <span v-else>无</span>
          </template>
        </el-table-column> -->
        <el-table-column
          v-if="$store.getters.login_type != 'distributor'"
          width="340"
          :label="$t('642aeb32.2b6bc0')"
        >
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  path: '/pointsmall/pointsmallgoods/pointsmallphysical',
                  query: { main_cat_id: scope.row.category_id }
                }"
              >
                {{ $t('fbbf67c9.f13684') }}
              </router-link>
            </el-button>
            <el-button
              v-if="scope.row.category_level == 3"
              type="text"
              @click="handleDialogAttr(scope.row, 'item_params', scope.$index)"
            >
              {{ $t('fbbf67c9.804a1f') }}
            </el-button>
            <el-button
              v-if="scope.row.category_level == 3"
              type="text"
              @click="handleDialogAttr(scope.row, 'item_spec', scope.$index)"
            >
              {{ $t('fbbf67c9.ea4da6') }}
            </el-button>
            <!-- <el-button type="text" v-if="scope.row.category_level == 3" @click="handleProfitPrice(scope.row)">分润配置</el-button> -->
            <el-button v-if="scope.row.category_level < 3" type="text" @click="append(scope.row)">
              {{ $t('fbbf67c9.82537d') }}
            </el-button>
            <!-- <el-button type="text" @click="taxRateSet(scope.row)">跨境税率设置</el-button> -->
            <el-button type="text" @click="deleteCategory(scope.row)">
              {{ $t('fbbf67c9.2f4aad') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--修改跨境税率-->
    <sideBar :visible.sync="show_sideBar" :title="$t('fbbf67c9.2d0302')">
      <el-form>
        <el-form-item :label="$t('fbbf67c9.1556e0')">
          <el-input-number
            v-model="crossborder_tax_rate"
            controls-position="right"
            :controls="false"
            :precision="2"
            :step="0.1"
            :min="0"
            :max="100"
          />
          <span style="margin-left: 5px">%</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveTaxRate"> {{ $t('fbbf67c9.939d53') }} </el-button>
        </el-form-item>
      </el-form>
    </sideBar>

    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <el-dialog
      :title="currentAttrType == 'item_params' ? $t('fbbf67c9.804a1f') : $t('fbbf67c9.ea4da6')"
      :visible.sync="relAttrvisible"
      :before-close="handleCancel"
    >
      <el-alert
        :title="$t('fbbf67c9.9763f9')"
        type="info"
        :description="$t('fbbf67c9.307381')"
        show-icon
      />
      <el-row v-loading="dialogLoading" :gutter="10">
        <el-col :span="12">
          <el-table
            ref="multipleTable"
            :data="goodsAttr"
            style="width: 100%"
            tooltip-effect="dark"
            @select="handleSelectionChange"
            @select-all="selectAll"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column type="expand">
              <template slot-scope="props">
                <span
                  v-for="(item, index) in props.row.attribute_values.list"
                  :key="index"
                  class="sku-value"
                >
                  <el-tag type="info"> {{ item.attribute_value }}</el-tag></span
                >
              </template>
            </el-table-column>
            <el-table-column prop="attribute_name" :label="$t('fbbf67c9.a8b0c2')">
              <template slot-scope="props">
                <span v-if="props.row.attribute_memo"
                  >{{ props.row.attribute_name }}【{{ props.row.attribute_memo }}】</span
                >
                <span v-else>{{ props.row.attribute_name }}</span>
                <el-tag
                  v-if="currentAttrType == 'item_spec' && props.row.is_image == 'true'"
                  size="mini"
                  type="success"
                >
                  {{ $t('fbbf67c9.20def7') }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
              :current-page.sync="attrParams.page"
              :page-sizes="[10, 20, 50]"
              :total="this.goodsAttrTotal"
              :page-size="attrParams.pageSize"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <el-table :data="checkGoodsAttr" style="width: 100%">
            <el-table-column
              prop="attribute_name"
              :label="$t('fbbf67c9.17f5b7', { count: this.checkGoodsAttr.length })"
            >
              <template slot-scope="props">
                <span v-if="props.row.attribute_memo"
                  >{{ props.row.attribute_name }}【{{ props.row.attribute_memo }}】</span
                >
                <span v-else>{{ props.row.attribute_name }}</span>
                <el-tag
                  v-if="currentAttrType == 'item_spec' && props.row.is_image == 'true'"
                  size="mini"
                  type="success"
                >
                  {{ $t('fbbf67c9.20def7') }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">{{ $t('fbbf67c9.c08ab9') }}</el-button>
        <el-button type="primary" @click="saveCategoryAttr">{{ $t('fbbf67c9.aa7527') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getGoodsAttr,
  getCategory,
  saveCategory,
  deleteCategory,
  updateCategory,
  getCategoryInfo
} from '@/api/pointsmall'
import SideBar from '@/components/element/sideBar'
import imgPicker from '@/components/imageselect'

export default {
  components: {
    imgPicker,
    SideBar
  },
  data() {
    return {
      // 跨境税率设置
      category_id: 0,
      crossborder_tax_rate: '',
      show_sideBar: false,
      isDisable: false,
      loading: false,
      categoryLoading: false,
      submitLoading: false,
      spaceInput: false,
      categoryList: [],
      total_count: 0,
      params: {
        is_main_category: true
      },
      attrParams: {
        page: 1,
        pageSize: 20
      },
      imgDialog: false,
      dialogLoading: false,
      isGetImage: false,
      relAttrvisible: false,
      goodsAttr: [],
      checkGoodsAttr: [],
      current: {},
      currentNode: 0,
      currentAttrType: '',
      goodsAttrTotal: 0,
      currentCategory: [],
      profitSpecCategory: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },

  mounted() {
    this.getCategory()
  },
  methods: {
    taxRateSet(data) {
      console.log(data)
      this.show_sideBar = true
      this.category_id = data.category_id
      this.crossborder_tax_rate = data.crossborder_tax_rate
    },
    saveTaxRate() {
      updateCategory(this.category_id, { crossborder_tax_rate: this.crossborder_tax_rate }).then(
        (res) => {
          this.$message({ type: 'success', message: this.$t('fbbf67c9.3b1083') })
          this.show_sideBar = false
          this.category_id = 0
          this.crossborder_tax_rate = ''
          this.getCategory()
        }
      )
    },
    handleCurrentChange(page) {
      this.attrParams.page = page
      this.getGoodsAttr()
    },
    handleSizeChange(pageSize) {
      this.attrParams.page = 1
      this.attrParams.pageSize = pageSize
      this.getGoodsAttr()
    },
    handleDialogAttr(data, type, node) {
      this.dialogLoading = true
      this.relAttrvisible = true
      this.currentAttrType = type
      this.currentNode = node
      this.currentCategory = data
      this.attrParams.page = 1
      this.attrParams.pageSize = 20
      if (this.currentAttrType == 'item_spec') {
        var checkIds = this.currentCategory.goods_spec
      } else {
        var checkIds = this.currentCategory.goods_params
      }
      this.getGoodsAttr(checkIds)
    },
    selectAll(data) {
      this.$message({ type: 'error', message: this.$t('fbbf67c9.17430f') })
      this.toggleRowSelection()
    },
    toggleRowSelection() {
      this.$refs.multipleTable.clearSelection()

      var checkids = []
      this.checkGoodsAttr.forEach((item) => {
        checkids.push(item.attribute_id)
      })

      this.goodsAttr.forEach((item) => {
        if (checkids && checkids.indexOf(item.attribute_id) !== -1) {
          this.$refs.multipleTable.toggleRowSelection(item)
        }
      })
    },
    handleSelectionChange(val, row) {
      var findIndex = -1
      var visible = 1
      this.checkGoodsAttr.forEach((item, index) => {
        // 如果操作的数据在已选择中，则表示取消选择
        if (row.attribute_id == item.attribute_id) {
          findIndex = index
        } else {
          if (item.is_image === 'true' && row.is_image === 'true') {
            this.$message({ type: 'error', message: this.$t('fbbf67c9.be80e6') })
            this.toggleRowSelection()
            visible = 0
          }
        }
      })

      if (!visible) {
        this.toggleRowSelection()
        return false
      }

      if (this.currentAttrType == 'item_params') {
        if (this.checkGoodsAttr.length >= 20 && findIndex == -1) {
          this.toggleRowSelection()
          this.$message({ type: 'error', message: this.$t('fbbf67c9.06ae72') })
          return false
        }
      } else {
        if (this.checkGoodsAttr.length >= 3 && findIndex == -1) {
          this.toggleRowSelection()
          this.$message({ type: 'error', message: this.$t('fbbf67c9.96fc5c') })
          return false
        }
      }

      if (findIndex != -1) {
        this.checkGoodsAttr.splice(findIndex, 1)
      } else {
        this.checkGoodsAttr.push(row)
      }
    },
    async getGoodsAttr(checkids = []) {
      if (checkids.length === 0) {
        this.checkGoodsAttr.forEach((item) => {
          checkids.push(item.attribute_id)
        })
      }

      if (checkids.length > 0) {
        await getGoodsAttr({
          page: 1,
          pageSize: 100,
          attribute_type: this.currentAttrType,
          attribute_ids: checkids
        }).then((info) => {
          this.checkGoodsAttr = info.data.data.list
        })
      }

      await getGoodsAttr({
        page: this.attrParams.page,
        pageSize: this.attrParams.pageSize,
        attribute_type: this.currentAttrType
      }).then((res) => {
        this.goodsAttr = res.data.data.list
        this.goodsAttrTotal = res.data.data.total_count
      })

      this.goodsAttr.forEach((item) => {
        const isHave = Array.isArray(checkids)
          ? checkids.indexOf(item.attribute_id) !== -1
          : checkids === item.attribute_id
        if (checkids && isHave) {
          this.$refs.multipleTable.toggleRowSelection(item)
        }
      })
      this.dialogLoading = false
    },
    saveCategoryAttr() {
      var checkids = []
      this.checkGoodsAttr.forEach((item) => {
        checkids.push(item.attribute_id)
      })

      if (this.currentAttrType == 'item_spec') {
        this.currentCategory.goods_spec = checkids
        var selectionData = { goods_spec: JSON.stringify(checkids) }
      } else {
        var selectionData = { goods_params: JSON.stringify(checkids) }
        this.currentCategory.goods_params = checkids
      }

      if (this.currentCategory.category_id) {
        updateCategory(this.currentCategory.category_id, selectionData).then((res) => {
          this.$message({ type: 'success', message: this.$t('fbbf67c9.3b1083') })
          this.handleCancel()
          this.getCategory()
        })
      } else {
        this.handleCancel()
      }
    },
    handleCancel() {
      this.relAttrvisible = false
      this.dialogLoading = false
      this.attrParams.page = 1
      this.attrParams.pageSize = 20
      this.goodsAttr = []
      this.checkGoodsAttr = []
      this.currentAttrType = ''
      this.currentCategory = []
    },
    getCategory() {
      this.loading = true
      this.params.is_main_category = true
      getCategory(this.params).then((response) => {
        this.categoryList = response.data.data
        this.loading = false
        this.spaceInput = false
      })
    },
    updateCategory() {
      for (var i = 0; i < this.categoryList.length; i++) {
        for (var a = 0; a < this.categoryList.length - 1 - i; a++) {
          if (this.categoryList[a].category_name == this.categoryList[a + 1].category_name) {
            this.$message({
              type: 'error',
              message: this.$t('fbbf67c9.ecae17')
            })
            return false
          }
        }

        if (!this.catNameCheck(this.categoryList[i].category_name)) {
          return false
        }

        for (var j = 0; j < this.categoryList[i].children.length; j++) {
          for (var b = 0; b < this.categoryList[i].children.length - 1 - j; b++) {
            if (
              this.categoryList[i].children[b].category_name ==
              this.categoryList[i].children[b + 1].category_name
            ) {
              this.$message({
                type: 'error',
                message: this.$t('fbbf67c9.ecae17')
              })
              return false
            }
          }
          if (!this.catNameCheck(this.categoryList[i].children[j].category_name)) {
            return false
          }
        }
      }
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 1000)
      let form = JSON.stringify(this.categoryList)
      saveCategory({ form: form }).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('fbbf67c9.509818')
        })
        this.getCategory()
      })
    },
    deleteCategory(data) {
      this.$confirm(this.$t('fbbf67c9.763293'), this.$t('fbbf67c9.02d981'), {
        confirmButtonText: this.$t('fbbf67c9.38cf16'),
        cancelButtonText: this.$t('fbbf67c9.625fb2'),
        type: 'warning'
      })
        .then(() => {
          if (typeof data.category_id != 'undefined') {
            deleteCategory(data.category_id).then((response) => {
              this.$message({
                type: 'success',
                message: this.$t('fbbf67c9.c2329a')
              })
              this.getCategory()
            })
          } else {
            const { category_level, id, parent_id } = data
            let key = category_level === 1 ? id : parent_id
            const categoryList = this.categoryList
            const parentIndex = categoryList.findIndex((item) => item.id === key)
            const deleteList = function (children, delId) {
              if (!children) return
              for (let i = 0; i < children.length; i++) {
                if (children[i].id === delId) {
                  children.splice(i, 1)
                  return
                } else {
                  deleteList(children[i].children, delId)
                }
              }
            }
            if (key === id) {
              categoryList.splice(parentIndex, 1)
            } else {
              deleteList(categoryList[parentIndex].children, id)
            }
            this.categoryList = categoryList
          }
        })
        .catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: this.$t('fbbf67c9.2111cc')
          })
        })
    },
    append(row) {
      let { children: data, category_level = 1, id, parent_id = '' } = row
      let newParentId = category_level === 1 ? id : parent_id
      var new_category_level = category_level + 1
      const newChild = {
        id: Date.parse(new Date()) / 1000,
        category_name: '',
        sort: 0,
        category_level: new_category_level,
        children: [],
        created: -1,
        image_url: '',
        is_main_category: true,
        goods_params: [],
        goods_params: [],
        parent_id: newParentId
      }
      data.push(newChild)
      if (category_level == 1) {
        this.$nextTick(() => {
          let container = this.$el.querySelector('.el-table__body-wrapper')
          container.scrollTop = container.scrollHeight
        })
      }
    },
    appendTop(data) {
      const newChild = {
        id: Date.parse(new Date()) / 1000,
        category_name: '',
        sort: 0,
        category_level: 1,
        children: [],
        created: -1,
        image_url: '',
        is_main_category: true,
        goods_params: []
      }
      data.push(newChild)
      this.$nextTick(() => {
        let container = this.$el.querySelector('.el-table__body-wrapper')
        container.scrollTop = container.scrollHeight
      })
    },
    catNameCheck(catName) {
      let catNameLength = 0
      if (catName) {
        for (var i = 0; i < catName.length; i++) {
          if (catName.charCodeAt(i) > 255) {
            catNameLength += 2
          } else {
            catNameLength++
          }
        }
        if (catNameLength > 50) {
          this.$message({
            type: 'error',
            message: this.$t('fbbf67c9.2f5f1d')
          })
          return false
        }
        return true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('fbbf67c9.799c40')
        })
        return false
      }
    },
    handleImgChange(data) {
      this.imgDialog = true
      this.isGetImage = true
      this.current = data
    },
    pickImg(data) {
      if (!this.current.parent_id || this.current.parent_id == 0) {
        const index = this.categoryList.findIndex((d) => d.id === this.current.id)
        this.categoryList[index].image_url = data.url
      } else {
        const findex = this.categoryList.findIndex((d) => d.id === this.current.parent_id)
        const cindex = this.categoryList[findex].children.findIndex((d) => d.id === this.current.id)
        this.categoryList[findex].children[cindex].image_url = data.url
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    }
  }
}
</script>
