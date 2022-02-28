<template>
  <el-dialog
    class="store-dialog"
    width="900px"
    title="选择商品"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
    append-to-body
  > 
    <div v-if="params.item_type === 'normal'" style="margin-bottom: 15px">
      <StoreFilter
        v-if="!filter"
        class="store"
        :data="store"
        :lock="lockStore"
        :isChangeStore="isChangeStore"
        @change="handleStoreChange"
      />
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            placeholder="输入商品名称"
            v-model="params.keywords"
            clearable
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchByKey"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="params.approve_status"
            placeholder="选择状态"
            clearable
            @change="searchByKey"
            :disabled="setSearch"
          >
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col v-if="!setSearch" :span="5">
          <el-select
            v-model="params.templates_id"
            @change="searchByKey"
            clearable
            placeholder="选择运费模板"
          >
            <el-option
              v-for="item in templatesList"
              :key="item.template_id"
              :label="item.name"
              :value="item.template_id"
            ></el-option>
          </el-select>
        </el-col>
        <span class="search-tips" v-if="setSearch">选择商品数量不可超过200件</span>
        <el-col :span="6">
          <el-select
            placeholder="选择品牌"
            remote
            filterable
            :remote-method="getGoodsBranchList"
            clearable
            v-model="select_branch_value"
            @change="searchByKey"
          >
            <el-option
              v-for="item in goodsBranchList"
              :key="item.attribute_id"
              :label="item.attribute_name"
              :value="item.attribute_id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class='last-col'>
          <el-cascader
            placeholder="商品分类"
            :options="categoryList"
            :props="{ value: 'category_id', checkStrictly: true }"
            v-model="select_category_value"
            clearable
            @change="searchByKey"
          >
          </el-cascader>
        </el-col> 
      </el-row> 
    </div>
    <el-table
      ref="multipleTable"
      v-if="singleData"
      :height="wheight - 190"
      :data="itemsData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="选择" width="70">
        <template slot-scope="scope">
          <el-radio
            :label="scope.row.itemId"
            v-model="templateRadio"
            @change.native="getTemplateRow(scope.$index, scope.row)"
            >&nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="itemId" label="商品ID" width="70"></el-table-column>
      <el-table-column prop="itemName" label="商品名称"></el-table-column>
      <el-table-column prop="item_spec_desc" label="规格"></el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="80"
        :formatter="priceformatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="store" label="库存" width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-table
      ref="multipleTable"
      v-else
      :data="itemsData"
      tooltip-effect="dark"
      style="width: 100%"
      @select="handleSelectChange"
      @select-all="handleSelectAll"
      v-loading="loading"
      :row-key="getRowKeys" 
    >
      <el-table-column
        type="selection"
        :selectable="disabledItem"
        :reserve-selection="true"
        width="50"
      ></el-table-column>
      <el-table-column prop="itemId" label="商品ID" width="70"></el-table-column>
      <el-table-column prop="itemName" label="商品名称"></el-table-column>
      <el-table-column prop="item_spec_desc" label="规格"></el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="80"
        :formatter="priceformatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="store" label="库存" width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="pager">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 30, 50]"
        :total="total_count"
        :page-size="params.pageSize"
      >
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAction">取 消</el-button>
      <el-button type="primary" @click="saveStoreAction">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import StoreFilter from '@/components/function/storeFilter'
import { getItemsList, getCategory, getSkuList, getGoodsAttr } from '@/api/goods'
import { getShippingTemplatesList } from '@/api/shipping'
import { getDefaultCurrency } from '@/api/company'
import { getDistributorItems } from '@/api/marketing'

export default {
  props: {
    itemsVisible: {
      type: Boolean,
      default: false
    },
    getStatus: {
      type: Boolean,
      default: false
    },
    relStore: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isChangeStore: {
      type: Boolean,
      default: false
    },
    lockStore: {
      type: Boolean,
      default: false
    },
    relItemsIds: {
      type: Array,
      default: []
    },
    hiddenData: {
      type: Array,
      default: function () {
        return []
      }
    },
    itemType: {
      type: String,
      default: ''
    },
    filter: [String, Object],
    notSku: {
      type: Boolean,
      default: false
    },
    isSpec: {
      type: Boolean,
      default: false
    },
    limitNum: {
      type: Number,
      default: 0
    },
    single: {
      type: Boolean,
      default: false
    },
    isGift: {
      type: Boolean,
      default: false
    },
    unwantedGift: {
      type: Boolean,
      default: false
    },
    limitCount: {
      type: Number,
      default: 100
    },
    setSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      itemsData: [],
      multipleSelection: [],
      selectRows: [],
      total_count: '',
      activeType: 'first',
      store: {},
      currentStore: {},
      params: {
        page: 1,
        pageSize: 30,
        keywords: '',
        item_type: 'normal',
        special_type: ['normal', 'drug'],
        approve_status: 'onsale',
        templates_id: '',
        distributor_id: '',
        is_sku: false,
        audit_status: 'approved'
        // is_gift: false,
      },
      categoryList: [],
      select_category_value: [],
      select_branch_value: [],
      goodsBranchList: [],
      goodsBranchParams: {
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: ''
      },
      hiddenItem: [],
      storeSelect: '',
      store_value: '',
      templatesList: [],
      statusOption: [
        {
          title: '前台可销售',
          value: 'onsale'
        },
        {
          title: '可线下销售',
          value: 'offline_sale'
        },
        {
          title: '前台仅展示',
          value: 'only_show'
        },
        {
          title: '不可销售',
          value: 'instock'
        }
      ],
      currency: {},
      cursymbol: '￥',
      templateRadio: ''
    }
  },
  components: {
    StoreFilter
  },
  methods: {
    handleTabClick() {
      this.getNewsList()
    },
    handleStoreChange(val) {
      if (Object.keys(val).length == 0) {
        // 代表进行了关闭店铺 设置为总店的操作
        val.id = 0
      }
      console.log('==handleStoreChange==', val)
      this.store = val
      6
      // this.selectRows = []
      this.params.distributor_id = val.id
      this.params.templates_id = ''
      this.getShippingTemplatesList(val.id)
      this.getNewsList()
    },
    getTemplateRow(index, row) {
      this.selectRows = new Array(row)
    },
    disabledItem(row, index) {
      if (this.hiddenItem.indexOf(row.itemId) > -1) {
        return false
      } else {
        return true
      }
    },
    getRowKeys(row) {
      return row.itemId
    },
    handleCurrentChange(page_num) {
      this.$refs.multipleTable.clearSelection()
      this.params.page = page_num
      this.getNewsList()
    },
    handleSizeChange(pageSize) {
      this.$refs.multipleTable.clearSelection()
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getNewsList()
    },
    searchByKey() {
      this.params.page = 1
      this.getNewsList()
    },
    storeChangeSelect() {
      if (this.storeSelect == 'gt') {
        this.params.store_gt = this.store_value
        delete this.params.store_lt
      }
      if (this.storeSelect == 'lt') {
        this.params.store_lt = this.store_value
        delete this.params.store_gt
      }
      this.params.page = 1
      this.getNewsList()
    },
    handleSelectAll(val) {
      if (this.limitNum) {
        this.$message({ message: '当前组件不支持全选', type: 'warning' })
        this.$refs.multipleTable.clearSelection()
        this.itemsData.forEach((item) => {
          let checked = this.selectRows.find((n) => n.itemId === item.itemId)
          if (checked) {
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })
        return
      }
      if (val.length > 0) {
        val.forEach((item) => {
          let inChecked = this.selectRows.findIndex((n) => item.itemId === n.itemId)
          if (inChecked === -1) {
            this.selectRows.push(item)
          }
        })
      } else {
        this.itemsData.forEach((item, index) => {
          let inChecked = this.selectRows.findIndex((n) => item.itemId === n.itemId)
          if (inChecked !== -1) {
            this.selectRows.splice(inChecked, 1)
          }
        })
      }
    },
    handleSelectChange(val, row) {
      let inChecked = this.selectRows.findIndex((item) => row.itemId === item.itemId)
      if (inChecked !== -1) {
        this.selectRows.splice(inChecked, 1)
      } else {
        if (this.limitNum && this.limitNum == 1) {
          this.selectRows = []
          this.selectRows.push(row)
          this.$refs.multipleTable.clearSelection()
          this.selectRows.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })
          return
        } else if (this.limitNum && this.selectRows.length >= this.limitNum) {
          this.$message({
            message: `最多选择${this.limitNum}件商品`,
            type: 'warning'
          })
          this.$refs.multipleTable.clearSelection()
          this.selectRows.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })
          return
        }
        this.selectRows.push(row)
      }
    },
    cancelAction() {
      this.selectRows = []
      this.$emit('closeStoreDialog')
    },
    saveStoreAction() {
      if (this.selectRows.length > this.limitCount) {
        this.$message.error('最多支持选择' + this.limitCount + '件商品！')
      } else {
        this.multipleSelection=this.selectRows;
        this.$emit('chooseStore', this.selectRows, this.store)
      }
    },
    getNewsList() {
      if (this.getStatus) {
        this.loading = true
        let param = {
          ...this.params
        }
        param.brand_id = this.select_branch_value
        const category = [...this.select_category_value]
        param.category = category.pop()
        if (
          this.system_mode == 'platform' ||
          !this.params.distributor_id ||
          this.params.distributor_id == '0'
        ) {
          getItemsList(param).then((response) => {
            this.itemsData = response.data.data.list
            this.total_count = parseInt(response.data.data.total_count)
            this.loading = false
            // 回显
            this.toggleSelection(this.relItemsIds)
          })
        } else {
          getDistributorItems(param).then((response) => {
            this.itemsData = response.data.data.list
            this.total_count = parseInt(response.data.data.total_count)
            this.loading = false
          })
        }
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 获取  运费模板 options
    getShippingTemplatesList(distributor_id = 0) {
      this.loading = true
      getShippingTemplatesList({ distributor_id }).then((response) => {
        this.templatesList = response.data.data.list
      })
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    getCategory() {
      getCategory([]).then((response) => {
        this.categoryList = response.data.data
      })
    },
    priceformatter(row, column) {
      return this.cursymbol + row.price / 100
    },
    changeGoods(type) {
      switch (type) {
        case 'every':
          this.$set(this.params, 'consume_type', 'every')
          this.$delete(this.params, 'item_type')
          this.itemType = 'every'
          break
        case 'normal':
          this.$set(this.params, 'item_type', 'normal')
          this.$delete(this.params, 'consume_type')
          this.itemType = 'normal'
          break
      }
      this.getNewsList()
    },
    getGoodsBranchList(searchVal = '') {
      // this.loading = true
      // console.log(searchVal)
      this.goodsBranchParams.attribute_name = searchVal
      getGoodsAttr(this.goodsBranchParams).then((response) => {
        this.goodsBranchList = response.data.data.list
        // console.log(this.goodsBranchList)
      })
    }
  },
  mounted() {
    if (this.filter) {
      let filters = this.filter
      let params = this.params
      if (typeof filters === 'string') {
        filters = JSON.parse(filters)
      }
      Object.assign(params, filters)
      this.params = params
    }
    this.getShippingTemplatesList()
    this.getCurrencyInfo()
    this.getGoodsBranchList()
    this.getCategory()
  },
  computed: {
    showDialog() {
      return this.itemsVisible
    },
    singleData() {
      return this.single
    },
    ...mapGetters(['wheight'])
  },
  watch: {
    itemsVisible(val) {
      if (val) {
        if (this.relStore.id) {
          this.params.distributor_id = this.relStore.id
          this.store = this.relStore
        }
        this.params.keywords = ''
        if (this.isSpec) {
          this.params.is_sku = this.isSpec
        }
        if (this.isGift) {
          this.params.is_gift = true
        }
        if (this.notSku) {
          Object.assign(this.params, { nospec: true })
        }
        let ids = []
        this.loading = true
        this.multipleSelection.forEach((item) => {
          ids.push(item.item_id)
        })
        if (ids.length > 0) {
          let param = JSON.parse(JSON.stringify(this.params))
          param.page = 1
          param.pageSize = 999
          param.item_id = ids
          // this.selectRows = []
          if (
            this.system_mode == 'platform' ||
            !param.distributor_id ||
            param.distributor_id == '0'
          ) {
            getSkuList(param).then((res) => {
              const selectRows = res.data.data.list
              // console.log();

              this.selectRows = selectRows

              this.$refs.multipleTable.clearSelection()
              this.itemsData.forEach((item) => {
                let checked = this.selectRows.find((n) => n.itemId === item.itemId)
                if (checked) {
                  this.$refs.multipleTable.toggleRowSelection(item)
                }
              })
              console.log('sku------------' + this.selectRows)
              this.loading = false
            })
          } else {
            getDistributorItems(param).then((res) => {
              const selectRows = res.data.data.list
              this.selectRows = selectRows
              this.$refs.multipleTable.clearSelection()
              this.itemsData.forEach((item) => {
                let checked = selectRows.find((n) => n.itemId === item.itemId)
                if (checked) {
                  this.$refs.multipleTable.toggleRowSelection(item)
                }
              })
              this.loading = false
            })
          }
        } else {
          const that = this
          this.$nextTick(() => {
            that.$refs.multipleTable.clearSelection()
          })
          this.loading = false
        }
      }
    },
    relItemsIds(newVal, oldVal) {
      console.log('==================')
      if (newVal.length > 0) {
        this.multipleSelection = newVal
      }
    },
    relStore(newVal, oldVal) {
      if (newVal.id) {
        this.params.distributor_id = newVal.id
        this.store = newVal
        this.getNewsList()
      }
    },
    itemsData(val) {
      if (this.selectRows.length > 0) {
        this.itemsData.forEach((item) => {
          let checked = this.selectRows.find((n) => n.itemId === item.itemId)
          if (checked) {
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })
      }
    },
    itemType(newVal, oldVal) {
      if (newVal) {
        this.params.item_type = newVal
        if (this.unwantedGift == false) {
          if (this.isGift) {
            this.params.is_gift = true
          } else {
            this.params.is_gift = false
          }
        }
        if (this.notSku) {
          Object.assign(this.params, { nospec: true })
        }
        let ids = []
        this.loading = true
        this.multipleSelection.forEach((item) => {
          ids.push(item.item_id)
        })
        if (ids.length > 0) {
          let param = JSON.parse(JSON.stringify(this.params))
          param.page = 1
          param.pageSize = 999
          param.item_id = ids
          // this.selectRows = []
          if (
            this.system_mode == 'platform' ||
            !param.distributor_id ||
            param.distributor_id == '0'
          ) {
            getSkuList(param).then((res) => {
              const selectRows = res.data.data.list
              this.selectRows = selectRows
              this.$refs.multipleTable.clearSelection()
              this.itemsData.forEach((item) => {
                let checked = selectRows.find((n) => n.itemId === item.itemId)
                if (checked) {
                  this.$refs.multipleTable.toggleRowSelection(item)
                }
              })
              this.loading = false
            })
          } else {
            getDistributorItems(param).then((res) => {
              const selectRows = res.data.data.list
              this.selectRows = selectRows
              this.$refs.multipleTable.clearSelection()
              this.itemsData.forEach((item) => {
                let checked = selectRows.find((n) => n.itemId === item.itemId)
                if (checked) {
                  this.$refs.multipleTable.toggleRowSelection(item)
                }
              })
              this.loading = false
            })
          }
        } else {
          const that = this
          this.$nextTick(() => {
            that.$refs.multipleTable.clearSelection()
          })
          this.loading = false
        }
      }
    },
    relStore(newVal, oldVal) {
      if (newVal.id) {
        this.params.distributor_id = newVal.id
        this.store = newVal
        this.getNewsList()
      }
    },
    itemsData(val) {
      if (this.selectRows.length > 0) {
        this.itemsData.forEach((item) => {
          let checked = this.selectRows.find((n) => n.itemId === item.itemId)
          if (checked) {
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })
      }
    },
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.getNewsList()
      }
    },
    itemType(newVal, oldVal) {
      if (newVal) {
        this.params.item_type = newVal
      }
    },
    hiddenData(val) {
      this.hiddenItem = val
    },
    single(val) {
      this.singleData = val
    }
  },
  hiddenData(val) {
    this.hiddenItem = val
  },
  single(val) {
    this.singleData = val
  }
}
</script>

<style scoped lang="scss">
.store {
  margin-bottom: 10px;
}
.store-dialog .el-checkbox {
  display: inline;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-select .el-input {
  width: 130px;
}
.pager {
  margin-top: 20px;
}
.tab-group {
  .tab-btn {
    &.on {
      border-color: #e6a23c;
      background-color: #e6a23c;
      color: #fff;
    }
  }
}
.search-tips {
  line-height: 40px;
}
.last-col{
  margin-top:8px;
}
</style>
