<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    class="store-dialog"
    width="900px"
    :title="$t('8e248734.43d1e2')"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
    :destroy-on-close="true"
    append-to-body
    @open="onOpen"
  >
    <div v-if="params.item_type === 'normal'" style="margin-bottom: 15px">
      <StoreFilter
        v-if="!filter"
        class="store"
        :data="store"
        :lock="lockStore"
        :is-change-store="isChangeStore"
        @change="handleStoreChange"
      />
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            v-model="params.keywords"
            :placeholder="$t('8e248734.c205b4')"
            clearable
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchByKey" />
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="params.approve_status"
            :placeholder="$t('8e248734.599c08')"
            clearable
            :disabled="setSearch"
            @change="searchByKey"
          >
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="$t(item.title)"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col v-if="!setSearch" :span="5">
          <el-select
            v-model="params.templates_id"
            clearable
            :placeholder="$t('8e248734.6912d8')"
            @change="searchByKey"
          >
            <el-option
              v-for="item in templatesList"
              :key="item.template_id"
              :label="item.name"
              :value="item.template_id"
            />
          </el-select>
        </el-col>
        <span v-if="setSearch" class="search-tips">{{ $t('8e248734.e9b60d') }}</span>
        <el-col :span="6">
          <el-select
            v-model="select_branch_value"
            :placeholder="$t('8e248734.41b90f')"
            remote
            filterable
            :remote-method="getGoodsBranchList"
            clearable
            @change="searchByKey"
          >
            <el-option
              v-for="item in goodsBranchList"
              :key="item.attribute_id"
              :label="item.attribute_name"
              :value="item.attribute_id"
            />
          </el-select>
        </el-col>
        <el-col :span="6" class="last-col">
          <el-cascader
            v-model="select_category_value"
            :placeholder="$t('8e248734.8a805a')"
            :options="categoryList"
            :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
            clearable
            @change="searchByKey"
          />
        </el-col>
        <el-col :span="6" class="last-col">
          <el-input
            v-model="params.goods_bn"
            :placeholder="$t('8e248734.18ea2a')"
            clearable
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchByKey" />
          </el-input>
        </el-col>
        <el-col :span="6" class="last-col">
          <el-input
            v-model="params.supplier_name"
            :placeholder="$t('8e248734.40b1be')"
            clearable
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchByKey" />
          </el-input>
        </el-col>
        <el-col :span="5" class="last-col">
          <el-select
            v-model="params.item_holder"
            :placeholder="$t('8e248734.2af133')"
            clearable
            :disabled="setSearch"
            @change="searchByKey"
          >
            <el-option
              v-for="item in categoryOption"
              :key="item.value"
              :label="$t(item.title)"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="5" class="last-col">
          <el-select
            v-model="params.is_gift"
            :placeholder="$t('8e248734.674022')"
            clearable
            :disabled="gift ? setSearch : gift"
            @change="searchByKey"
          >
            <el-option :value="true" :label="$t('8e248734.0a60ac')" />
            <el-option :value="false" :label="$t('8e248734.c9744f')" />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-if="singleData"
      ref="multipleTable"
      v-loading="loading"
      :data="itemsData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column :label="$t('8e248734.153fa6')" width="70">
        <template slot-scope="scope">
          <el-radio
            v-model="templateRadio"
            :label="scope.row.itemId"
            @change.native="getTemplateRow(scope.$index, scope.row)"
          >
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="itemId" :label="$t('8e248734.858526')" width="70" />
      <el-table-column prop="itemName" :label="$t('8e248734.1fd1d5')" />
      <el-table-column prop="item_spec_desc" :label="$t('8e248734.ea887b')" />
      <el-table-column prop="goods_bn" :label="$t('8e248734.18ea2a')" />
      <el-table-column :label="$t('8e248734.792518')">
        <template slot-scope="scope">
          {{ scope.row.is_gift == '1' ? $t('8e248734.0a60ac') : $t('8e248734.c9744f') }}
        </template>
      </el-table-column>
      <el-table-column prop="supplier_name" :label="$t('8e248734.40b1be')" />
      <el-table-column :label="$t('8e248734.2af133')">
        <template slot-scope="scope">
          {{ itemSourceMap[scope.row.item_holder] }}
        </template>
      </el-table-column>
      <el-table-column prop="market_price" show-overflow-tooltip :label="$t('8e248734.818fc4')">
        <template slot-scope="scope"> ¥{{ scope.row.market_price / 100 }} </template>
      </el-table-column>
      <el-table-column
        prop="price"
        :label="$t('8e248734.e29575')"
        width="80"
        :formatter="priceformatter"
        show-overflow-tooltip
      />
      <el-table-column
        prop="cost_price"
        :label="$t('8e248734.2e2ce2')"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope"> ¥{{ scope.row.cost_price / 100 }} </template>
      </el-table-column>
      <el-table-column
        prop="store"
        :label="$t('8e248734.0eac88')"
        width="80"
        show-overflow-tooltip
      />
    </el-table>
    <el-table
      v-else
      ref="multipleTable"
      v-loading="loading"
      :data="itemsData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="getRowKeys"
      @select="handleSelectChange"
      @select-all="handleSelectAll"
    >
      <el-table-column
        type="selection"
        :selectable="disabledItem"
        :reserve-selection="true"
        width="50"
      />
      <el-table-column prop="itemId" :label="$t('8e248734.858526')" width="70" />
      <el-table-column prop="itemName" :label="$t('8e248734.1fd1d5')" />
      <el-table-column prop="item_spec_desc" :label="$t('8e248734.ea887b')" />
      <el-table-column prop="goods_bn" :label="$t('8e248734.18ea2a')" />
      <el-table-column :label="$t('8e248734.792518')">
        <template slot-scope="scope">
          {{ scope.row.is_gift == '1' ? $t('8e248734.0a60ac') : $t('8e248734.c9744f') }}
        </template>
      </el-table-column>
      <el-table-column prop="supplier_name" :label="$t('8e248734.40b1be')" width="120" />
      <el-table-column :label="$t('8e248734.2af133')">
        <template slot-scope="scope">
          {{ itemSourceMap[scope.row.item_holder] }}
        </template>
      </el-table-column>
      <el-table-column prop="market_price" show-overflow-tooltip :label="$t('8e248734.818fc4')">
        <template slot-scope="scope"> ¥{{ scope.row.market_price / 100 }} </template>
      </el-table-column>
      <el-table-column
        prop="price"
        :label="$t('8e248734.e29575')"
        width="80"
        :formatter="priceformatter"
        show-overflow-tooltip
      />
      <el-table-column
        prop="cost_price"
        :label="$t('8e248734.2e2ce2')"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope"> ¥{{ scope.row.cost_price / 100 }} </template>
      </el-table-column>
      <el-table-column
        prop="store"
        :label="$t('8e248734.0eac88')"
        width="80"
        show-overflow-tooltip
      />
    </el-table>
    <div v-if="total_count > params.pageSize" class="pager">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 30, 50]"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAction">{{ $t('8e248734.c08ab9') }}</el-button>
      <el-button type="primary" @click="saveStoreAction">{{ $t('8e248734.aa7527') }}</el-button>
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
import { GOOD_CATEGORY_MAP } from '../../consts'

export default {
  components: {
    StoreFilter
  },
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
    },
    gift: {
      type: Boolean,
      default: true
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
        audit_status: 'approved',
        is_gift: '',
        supplier_name: '',
        item_holder: '',
        goods_bn: ''
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
      categoryOption: [
        { title: '8e248734.81a684', value: 'platform' },
        { title: '8e248734.b1c9d7', value: 'distributor' },
        { title: '8e248734.45a570', value: 'supplier' }
      ],
      statusOption: [
        { title: '8e248734.9b7481', value: 'onsale' },
        { title: '8e248734.2c50a0', value: 'offline_sale' },
        { title: '8e248734.acf86b', value: 'only_show' },
        { title: '8e248734.ae83a3', value: 'instock' }
      ],
      itemSourceMap: GOOD_CATEGORY_MAP,
      currency: {},
      cursymbol: '￥',
      templateRadio: ''
    }
  },
  mounted() {
    // if(!this.gift) this.params.is_gift = !this.gift
    if (!this.gift) this.onOpen()
  },

  methods: {
    async onOpen() {
      if (this.filter) {
        let filters = this.filter
        let params = this.params
        if (typeof filters === 'string') {
          filters = JSON.parse(filters)
        }
        Object.assign(params, filters)
        this.params = params
      }
      await this.getShippingTemplatesList()
      await this.getCurrencyInfo()
      await this.getGoodsBranchList()
      await this.getCategory()
      if (this.isChangeStore) {
        await this.getNewsList()
      }
    },
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
        this.$message({ message: this.$t('8e248734.4f180d'), type: 'warning' })
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
            message: this.$t('8e248734.a0672e') + this.limitNum + this.$t('8e248734.777ba9'),
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
        this.$message.error(
          this.$t('8e248734.111738') + this.limitCount + this.$t('8e248734.199f06')
        )
      } else {
        this.multipleSelection = this.selectRows
        this.$emit('chooseStore', this.selectRows, this.store)
      }
    },
    getNewsList() {
      if (this.getStatus) {
        this.loading = true
        let param = {
          ...this.params
        }
        if (this.unwantedGift) {
          delete param.is_gift
        }
        param.brand_id = this.select_branch_value
        const category = [...this.select_category_value]
        param.category = category.pop()

        //云店店铺走DistributorItem
        if (
          (this.VERSION_STANDARD() && this.IS_DISTRIBUTOR()) ||
          !(
            this.VERSION_PLATFORM() ||
            !this.params.distributor_id ||
            this.params.distributor_id == '0'
          )
        ) {
          getDistributorItems(param).then((response) => {
            this.itemsData = response.data.data.list

            this.total_count = parseInt(response.data.data.total_count)
            this.loading = false
          })
        } else {
          getItemsList(param).then((response) => {
            this.itemsData = response.data.data.list
            this.total_count = parseInt(response.data.data.total_count)
            this.loading = false
            // 回显

            this.toggleSelection(this.relItemsIds)
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
  computed: {
    showDialog() {
      return this.itemsVisible
    },
    singleData() {
      return this.single
    }
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
          if (this.VERSION_PLATFORM() || !param.distributor_id || param.distributor_id == '0') {
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
          if (this.VERSION_PLATFORM() || !param.distributor_id || param.distributor_id == '0') {
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
.last-col {
  margin-top: 8px;
}
</style>
