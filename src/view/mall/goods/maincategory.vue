<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row v-if="$store.getters.login_type != 'distributor'">
      <el-col>
        <el-button type="primary" plain icon="el-icon-circle-plus" @click="appendTop(categoryList)">
          {{ $t('649bc56c.dd920c') }}
        </el-button>
        <!-- <el-button-group>
          <el-button type="primary" @click="updateCategory" :disabled="isDisable">保存管理分类</el-button> -->
        <!-- <el-button
          type="primary"
          @click="syncMainCategory"
        >
          同步管理分类
        </el-button> -->
        <!-- </el-button-group> -->
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
        size="small"
      >
        <el-table-column :label="$t('649bc56c.04d7d8')" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" :label="$t('649bc56c.53eb44')" sortable width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.sort }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="created" :label="$t('649bc56c.eca37c')" width="150">
          <template slot-scope="scope">
            {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="!VERSION_IN_PURCHASE()"
          prop="created"
          :label="$t('649bc56c.1556e0')"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.crossborder_tax_rate">
              {{ scope.row.crossborder_tax_rate }}%</span
            >
            <span v-else>{{ $t('649bc56c.d81bb2') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$store.getters.login_type != 'distributor'"
          :label="$t('649bc56c.2b6bc0')"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                path: '/entity/goods/goodsphysical',
                query: { main_cat_id: scope.row.category_id }
              }"
              style="margin-right: 5px"
            >
              <el-button type="text">{{ $t('649bc56c.f13684') }}</el-button>
            </router-link>
            <el-button
              v-if="scope.row.category_level == 3"
              type="text"
              @click="handleDialogAttr(scope.row, 'item_params', scope.$index)"
            >
              {{ $t('649bc56c.804a1f') }}
            </el-button>
            <el-button
              v-if="scope.row.category_level == 3"
              type="text"
              @click="handleDialogAttr(scope.row, 'item_spec', scope.$index)"
            >
              {{ $t('649bc56c.ea4da6') }}
            </el-button>
            <el-button
              v-if="scope.row.category_level == 3"
              type="text"
              @click="handleProfitPrice(scope.row)"
            >
              {{ $t('649bc56c.d2d71c') }}
            </el-button>
            <el-button v-if="scope.row.category_level < 3" type="text" @click="append(scope.row)">
              {{ $t('649bc56c.82537d') }}
            </el-button>
            <el-button type="text" @click="editCategory(scope.row)">
              {{ $t('649bc56c.95b351') }}
            </el-button>
            <!-- <el-button
              type="text"
              @click="taxRateSet(scope.row)"
            >
              跨境税率设置
            </el-button> -->
            <el-button type="text" @click="deleteCategory(scope.row)">
              {{ $t('649bc56c.2f4aad') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="dialog.type === 'add' ? $t('649bc56c.b6cb2b') : $t('649bc56c.55d793')"
      :visible.sync="dialog.visible"
      destroy-on-close
    >
      <el-form label-width="80px">
        <el-form-item :label="$t('649bc56c.04d7d8')">
          <el-input v-model="dialog.cat_name" />
        </el-form-item>

        <el-form-item :label="$t('649bc56c.53eb44')">
          <el-input-number v-model="dialog.sort" :label="$t('649bc56c.53eb44')" :min="0" />
        </el-form-item>

        <el-form-item v-if="dialog.is_hassuperior" :label="$t('649bc56c.dc1eed')">
          <el-input
            v-model="dialog.superior_cat_name"
            :label="$t('d41d8cd9.53eb44')"
            :disabled="true"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">{{ $t('649bc56c.c08ab9') }}</el-button>
        <el-button :loading="dialog.loading" type="primary" @click="handleSubmit">{{
          $t('649bc56c.aa7527')
        }}</el-button>
      </span>
    </el-dialog>

    <!--修改跨境税率-->
    <sideBar :visible.sync="show_sideBar" :title="$t('649bc56c.2d0302')">
      <el-form>
        <el-form-item :label="$t('649bc56c.1556e0')">
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
          <el-button type="primary" @click="saveTaxRate">{{ $t('649bc56c.939d53') }}</el-button>
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
      :title="currentAttrType == 'item_params' ? $t('649bc56c.804a1f') : $t('649bc56c.ea4da6')"
      :visible.sync="relAttrvisible"
      :before-close="handleCancel"
    >
      <el-alert
        :title="$t('649bc56c.9763f9')"
        type="info"
        :description="$t('649bc56c.307381')"
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
            <el-table-column prop="attribute_name" :label="$t('649bc56c.a8b0c2')">
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
                  {{ $t('649bc56c.20def7') }}
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
              :total="goodsAttrTotal"
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
              :label="$t('649bc56c.02c2b6', { n: checkGoodsAttr.length })"
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
                  {{ $t('649bc56c.20def7') }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">{{ $t('649bc56c.c08ab9') }}</el-button>
        <el-button type="primary" @click="saveCategoryAttr">{{ $t('649bc56c.aa7527') }}</el-button>
      </span>
    </el-dialog>
    <SideBar
      :visible.sync="show_profit_sideBar"
      name="show_profit_sideBar"
      :title="$t('649bc56c.e7f2ff')"
      width="60"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>
            <el-alert
              :title="$t('649bc56c.f6f338')"
              :description="$t('649bc56c.4b3c96')"
              type="info"
              close-text=" "
              class="alert-text"
              show-icon
            />
          </span>
          <span>
            <el-alert
              :title="$t('649bc56c.50953f')"
              :description="$t('649bc56c.d7e97f')"
              type="info"
              close-text=" "
              class="alert-text"
              show-icon
            />
          </span>
        </div>
        {{ $t('649bc56c.041e89') }}{{ current.category_name }}
        <el-table v-loading="categoryLoading" :data="profitSpecCategory" height="100%" size="small">
          <el-table-column :label="$t('649bc56c.04d7d8')" prop="category_name" min-width="120" />
          <el-table-column :label="$t('649bc56c.3d074c')">
            {{ $t('649bc56c.81522a') }}
          </el-table-column>
          <el-table-column :label="$t('649bc56c.a38cb4')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.profit_conf_profit" size="mini" type="number">
                <template slot="append"> % </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('649bc56c.a023cf')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.profit_conf_popularize_profit" size="mini" type="number">
                <template slot="append"> % </template>
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer">
        <el-button type="primary" :loading="submitLoading" @click="saveProfitConf">
          {{ $t('649bc56c.be5fbb') }}
        </el-button>
      </div>
    </SideBar>
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
  getCategoryInfo,
  saveCategoryProfitPrice,
  syncMainCategory,
  addCategory,
  editCategory
} from '@/api/goods'
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
      show_profit_sideBar: false,
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
      profitSpecCategory: [],
      dialog: {
        visible: false,
        cat_name: '',
        is_hassuperior: false,
        superior_cat_name: '',
        superior_cat_id: '',
        sort: 0,
        current_id: '',
        cat_img: '',
        loading: false,
        type: 'add'
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },

  mounted() {
    this.getCategory()
  },
  methods: {
    handleProfitPrice(data) {
      this.show_profit_sideBar = true
      this.current.category_name = data.category_name
      this.profitSpecCategory = [
        {
          category_id: data.category_id,
          category_name: data.category_name,
          profit_conf_profit: data.profit_conf_profit,
          profit_conf_popularize_profit: data.profit_conf_popularize_profit
        }
      ]
    },
    handleSubmit() {
      const _this = this
      const { sort, cat_name, cat_img, is_hassuperior, superior_cat_id, type, current_id } =
        this.dialog
      if ((!sort && sort !== 0) || !cat_name) {
        this.$message.error(this.$t('649bc56c.510bbc'))
        return
      } else {
        this.dialog.loading = true
        if (type === 'add') {
          //添加
          addCategory({
            category_name: cat_name,
            sort: sort,
            is_main_category: 1,
            parent_id: is_hassuperior ? superior_cat_id : undefined
          })
            .then((res) => {
              _this.dialog = {
                ..._this.dialog,
                loading: false,
                visible: false,
                cat_name: '',
                cat_img: '',
                sort: 0,
                is_hassuperior: false,
                superior_cat_id: '',
                superior_cat_name: ''
              }
              _this.getCategory()
            })
            .catch((err) => {
              if (err) {
                _this.dialog.loading = false
              }
            })
        } else {
          editCategory({
            category_name: cat_name,
            sort: sort,
            is_main_category: 1,
            category_id: current_id
          })
            .then((res) => {
              _this.dialog = {
                ..._this.dialog,
                loading: false,
                visible: false,
                cat_name: '',
                cat_img: '',
                sort: 0,
                is_hassuperior: false,
                superior_cat_id: '',
                superior_cat_name: ''
              }
              _this.getCategory()
            })
            .catch((err) => {
              if (err) {
                _this.dialog.loading = false
              }
            })
        }
      }
    },
    saveProfitConf() {
      let profitConf
      let category_id
      this.profitSpecCategory.forEach((item) => {
        var profit_conf = {}
        category_id = item.category_id
        profit_conf.profit_conf_profit = item.profit_conf_profit
        profit_conf.profit_conf_popularize_profit = item.profit_conf_popularize_profit
        profitConf = profit_conf
      })
      let params = {
        category_id: category_id,
        profit_conf: JSON.stringify(profitConf)
      }
      saveCategoryProfitPrice(params).then((res) => {
        this.$message({
          message: this.$t('649bc56c.3b1083'),
          type: 'success',
          duration: 2 * 1000
        })
      })
    },
    editCategory(row) {
      this.dialog = {
        ...this.dialog,
        visible: true,
        is_hassuperior: false,
        type: 'edit',
        current_id: row.category_id,
        cat_name: row.label,
        sort: row.sort
      }
    },
    taxRateSet(data) {
      console.log(data)
      this.show_sideBar = true
      this.category_id = data.category_id
      this.crossborder_tax_rate = data.crossborder_tax_rate
    },
    saveTaxRate() {
      console.log('Save tax rate')
      updateCategory(this.category_id, {
        crossborder_tax_rate: this.crossborder_tax_rate
      }).then((res) => {
        this.$message({ type: 'success', message: this.$t('649bc56c.3b1083') })
        this.show_sideBar = false
        this.category_id = 0
        this.crossborder_tax_rate = ''
        this.getCategory()
      })
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
      this.$message({ type: 'error', message: this.$t('649bc56c.17430f') })
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
            this.$message({
              type: 'error',
              message: this.$t('649bc56c.be80e6')
            })
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
          this.$message({ type: 'error', message: this.$t('649bc56c.06ae72') })
          return false
        }
      } else {
        if (this.checkGoodsAttr.length >= 3 && findIndex == -1) {
          this.toggleRowSelection()
          this.$message({ type: 'error', message: this.$t('649bc56c.96fc5c') })
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
          this.$message({ type: 'success', message: this.$t('649bc56c.3b1083') })
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
              message: this.$t('649bc56c.ecae17')
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
                message: this.$t('649bc56c.ecae17')
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
          message: this.$t('649bc56c.509818')
        })
        this.getCategory()
      })
    },
    deleteCategory(data) {
      this.$confirm(this.$t('649bc56c.763293'), this.$t('649bc56c.02d981'), {
        confirmButtonText: this.$t('649bc56c.38cf16'),
        cancelButtonText: this.$t('649bc56c.625fb2'),
        type: 'warning'
      })
        .then(() => {
          if (typeof data.category_id != 'undefined') {
            deleteCategory(data.category_id).then((response) => {
              this.$message({
                type: 'success',
                message: this.$t('649bc56c.c2329a')
              })
              this.getCategory()
            })
          } else {
            // const parent = node.parent
            // const children = parent.childNodes || parent.data
            // const index = children.findIndex(d => d.id === data.id)
            // children.splice(index, 1)
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
            message: this.$t('649bc56c.2111cc')
          })
        })
    },
    append(row) {
      // let { children: data, category_level = 1, id, parent_id = "" } = row;
      // let newParentId = category_level === 1 ? id : parent_id;
      // var new_category_level = category_level + 1;
      // const newChild = {
      //   id: Date.parse(new Date()) / 1000,
      //   category_name: "",
      //   sort: 0,
      //   category_level: new_category_level,
      //   children: [],
      //   created: -1,
      //   image_url: "",
      //   is_main_category: true,
      //   goods_params: [],
      //   goods_params: [],
      //   parent_id: newParentId,
      // };
      // data.push(newChild);
      // if (category_level == 1) {
      //   this.$nextTick(() => {
      //     let container = this.$el.querySelector(".el-table__body-wrapper");
      //     container.scrollTop = container.scrollHeight;
      //   });
      // }
      console.log(row)
      this.dialog = {
        ...this.dialog,
        visible: true,
        is_hassuperior: true,
        superior_cat_name: row.label,
        superior_cat_id: row.category_id,
        type: 'add',
        cat_name: ''
      }
    },
    appendTop(data) {
      // const newChild = {
      //   id: Date.parse(new Date()) / 1000,
      //   category_name: "",
      //   sort: 0,
      //   category_level: 1,
      //   children: [],
      //   created: -1,
      //   image_url: "",
      //   is_main_category: true,
      //   goods_params: [],
      // };
      // data.push(newChild);
      // this.$nextTick(() => {
      //   let container = this.$el.querySelector(".el-table__body-wrapper");
      //   container.scrollTop = container.scrollHeight;
      // });
      this.dialog = {
        ...this.dialog,
        visible: true,
        is_hassuperior: false,
        type: 'add',
        cat_name: '',
        sort: 0
      }
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
            message: this.$t('649bc56c.2f5f1d')
          })
          return false
        }
        return true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('649bc56c.799c40')
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
    },
    syncMainCategory() {
      syncMainCategory().then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('649bc56c.bbdee9')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('649bc56c.d61036')
          })
        }
      })
    }
  }
}
</script>
