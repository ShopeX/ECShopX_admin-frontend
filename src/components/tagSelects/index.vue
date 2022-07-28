<template>
  <el-dialog
    class="store-dialog"
    width="60%"
    title="选择会员标签"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <el-input
        v-model="params.keywords"
        placeholder="输入标签名称"
        class="input-with-select"
        style="width: 50%"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchByKey"
        />
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="itemsData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="50"
      />
      <el-table-column
        prop="itemId"
        label="标签ID"
        width="70"
      />
      <el-table-column
        prop="itemName"
        label="标签名称"
      >
        <template slot-scope="scope">
          <el-tag
            :color="scope.row.tag_color"
            size="mini"
            style="color: #ffffff"
          >
            {{
              scope.row.tag_name
            }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="tr"
    >
      <el-pagination
        layout="prev, pager, next"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancelAction">取 消</el-button>
      <el-button
        type="primary"
        @click="saveStoreAction"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getItemsList, getCategory } from '../../api/goods'
import { getShippingTemplatesList } from '../../api/shipping'
import { getDefaultCurrency } from '../../api/company'

export default {
  props: ['itemsVisible', 'getStatus', 'relItemsIds', 'itemType'],
  data () {
    return {
      loading: false,
      itemsData: [],
      multipleSelection: [],
      total_count: '',
      params: {
        page: 1,
        pageSize: 10,
        keywords: '',
        item_type: 'normal',
        approve_status: 'onsale',
        templates_id: ''
      },
      templatesList: [],
      statusOption: [
        {
          title: '前台可销售',
          value: 'onsale'
        },
        {
          title: '前端不展示',
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
      cursymbol: '￥'
    }
  },
  computed: {
    showDialog () {
      return this.itemsVisible
    }
  },
  watch: {
    relItemsIds (newVal, oldVal) {
      if (newVal) {
        this.selectRows = newVal
      }
    },
    getStatus (newVal, oldVal) {
      if (newVal) {
        this.getNewsList()
      }
    },
    itemType (newVal, oldVal) {
      if (newVal) {
        this.params.item_type = newVal
      }
    }
  },
  mounted () {
    this.getShippingTemplatesList()
    //this.getCategory()
    this.getCurrencyInfo()
  },
  methods: {
    getRowKeys (row) {
      return row.itemId
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getNewsList()
    },
    searchByKey () {
      this.params.page = 1
      this.getNewsList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      val.forEach((item) => {
        let isInArr = this.selectRows.findIndex((n) => n.itemId == item.itemId)
        if (isInArr == -1) {
          this.selectRows.push(item)
        }
      })
    },
    cancelAction () {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction () {
      this.$emit('chooseStore', this.multipleSelection)
    },
    getNewsList () {
      if (this.getStatus) {
        this.loading = true
        getItemsList(this.params).then((response) => {
          this.itemsData = response.data.data.list
          this.total_count = parseInt(response.data.data.total_count)
          this.loading = false
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          this.selectRows.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })
        })
      }
    },
    getShippingTemplatesList () {
      this.loading = true
      getShippingTemplatesList(this.templatesParams).then((response) => {
        this.templatesList = response.data.data.list
      })
    },
    getCurrencyInfo () {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    getCategory () {
      getCategory([]).then((response) => {
        this.categoryList = response.data.data
      })
    },
    priceformatter (row, column) {
      return this.cursymbol + row.price / 100
    },
    changeGoods (type) {
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
    }
  }
}
</script>

<style scoped lang="scss">
.store-dialog .el-checkbox {
  display: inline;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
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
</style>
