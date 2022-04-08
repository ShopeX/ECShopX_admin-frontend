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
    <div
      style="margin-bottom: 15px"
      class="promotionSearch"
    >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            v-model="params.keywords"
            placeholder="输入商品名称"
            clearable
            class="input-with-select"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="params.item_bn"
            placeholder="输入商品编码"
            clearable
            class="input-with-select"
          />
        </el-col>
        <el-col :span="2">
          <el-button
            class="fl"
            type="primary"
            @click="searchByKey"
          >
            搜索
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="itemsData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="getRowKeys"
      :select-on-indeterminate="false"
      @select="handleSelectChange"
      @select-all="handleSelectAll"
    >
      <el-table-column
        type="selection"
        :selectable="disabledItem"
        :reserve-selection="true"
        width="80"
      />
      <el-table-column
        prop="itemId"
        label="商品ID"
      />
      <el-table-column
        prop="itemName"
        label="商品名称"
      />
      <el-table-column
        prop="itemBn"
        label="商品编码"
      />
      <el-table-column
        prop="price"
        label="价格"
        width="80"
        :formatter="priceformatter"
        show-overflow-tooltip
      />
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="pager"
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
        @click="saveGoodsAction"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getSelectItemsList } from '@/api/goods'
import { getDefaultCurrency } from '@/api/company'

export default {
  props: {
    itemsVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      itemsData: [],
      selectRows: [],
      total_count: '',
      params: {
        page: 1,
        pageSize: 10,
        keywords: '',
        item_bn: ''
      },
      hiddenItem: [],
      cursymbol: '￥'
    }
  },
  computed: {
    showDialog () {
      return this.itemsVisible
    }
  },
  watch: {
    async itemsVisible (val) {
      if (val) {
        this.getNewsList()
      }
    }
  },
  mounted () {
    this.getCurrencyInfo()
  },
  methods: {
    disabledItem (row, index) {
      if (this.hiddenItem.indexOf(row.itemId) > -1) {
        return false
      } else {
        return true
      }
    },
    getRowKeys (row) {
      return row.itemId
    },
    getCurrencyInfo () {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    handleCurrentChange (page_num) {
      this.$refs.multipleTable.clearSelection()
      this.params.page = page_num
      this.getNewsList()
    },
    searchByKey () {
      this.params.page = 1
      this.getNewsList()
    },
    handleSelectAll (val) {
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
    handleSelectChange (val, row) {
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
          this.$message({ message: `最多选择${this.limitNum}件商品`, type: 'warning' })
          this.$refs.multipleTable.clearSelection()
          this.selectRows.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })
          return
        }
        this.selectRows.push(row)
      }
    },
    cancelAction () {
      this.selectRows = []
      this.$emit('closeGoodsDialog')
    },
    saveGoodsAction () {
      this.$emit('chooseGoods', this.selectRows)
    },
    async getNewsList () {
      this.loading = true
      let param = JSON.parse(JSON.stringify(this.params))
      try {
        const res = await getSelectItemsList(param)
        // console.log('res=======', res)
        const list = res.data.data.list
        this.itemsData = list
        this.total_count = res.data.data.total_count
      } catch (error) {
        console.log()
      }
      this.loading = false
    },
    priceformatter (row, column) {
      return this.cursymbol + row.price / 100
    }
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
</style>
<style lang="scss">
.promotionSearch {
  .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
}
</style>
