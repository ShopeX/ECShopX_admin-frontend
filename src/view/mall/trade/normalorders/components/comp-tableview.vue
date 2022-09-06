<style lang="scss" scope>
.comp-tableview {
  .tableview-ft {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .ft-l {
    .l-item {
      display: flex;
      align-items: center;
      label {
        width: 66px;
        text-align: right;
        display: inline-block;
        font-size: 13px;
        color: #969696;
      }
      .el-input {
        width: 120px;
        margin-right: 10px;
      }
    }
  }
  .ft-r {
    line-height: 28px;
    .r-item {
      min-width: 180px;
      label {
        display: inline-block;
        width: 120px;
        text-align: right;
        font-size: 13px;
        color: #969696;
      }
    }
  }
  .dialog-tip {
    margin-top: 20px;
    p {
      line-height: 20px;
      color: #b0b0b0;
      font-size: 12px;
    }
  }
  .sku-text {
    background-color: #b0b0b0;
    font-size: 12px;
    display: inline-block;
    color: #fff;
    padding: 0 4px;
    line-height: 18px;
  }
}
</style>
<style lang="scss">
.change-price-dropdown-menu {
  .el-dropdown-menu__item {
    &.active {
      background-color: rgba(var(--themeColorRgb), 0.1);
      color: var(--themeColor);
    }
  }
}
</style>
<template>
  <div class="comp-tableview">
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      :span-method="objectSpanMethod"
      :height="280"
      border
    >
      <el-table-column prop="itemName" label="商品">
        <template slot-scope="scope">
          <div>{{ scope.row.item_name }}</div>
          <div class="sku-text">{{ scope.row.item_spec_desc }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价（¥）" width="100" />
      <el-table-column prop="num" label="数量" width="80" />
      <el-table-column prop="point" label="积分抵扣" width="100" />
      <el-table-column prop="item_fee" label="小计（¥）" width="100" />
      <el-table-column width="160">
        <template #header>
          <el-dropdown @command="toggleChangePriceType">
            <span class="el-dropdown-link">
              {{ changeType == 'change_price' ? '直接改价（¥）' : '按折扣改价（%）' }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown" class="change-price-dropdown-menu">
              <el-dropdown-item
                command="change_discount"
                :class="{ active: changeType == 'change_discount' }"
                >
按折扣改价
</el-dropdown-item>
              <el-dropdown-item
                command="change_price"
                :class="{ active: changeType == 'change_price' }"
                >
直接改价
</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <el-input
            v-if="changeType == 'change_price'"
            v-model="scope.row.change_price"
            placeholder="直接改价"
            size="small"
            @change="onChangeItemPrice"
          />
          <el-input
            v-if="changeType == 'change_discount'"
            v-model="scope.row.change_discount"
            placeholder="按折扣改价"
            size="small"
            @change="onChangeItemDiscount"
          />
        </template>
      </el-table-column>
      <el-table-column prop="total" label="商品应付金额（¥）" width="160" />
    </el-table>
    <div class="tableview-ft">
      <div class="ft-l">
        <div class="l-item">
          <label>一键改价：</label>
          <el-input v-model="globalChangePrice" class="price" size="small" />
          <el-button type="text" @click="handleChangePrice"> 确定 </el-button>
        </div>
        <div class="l-item">
          <label>运费：</label><el-input
            v-model="globalFreightFee"
            size="small"
            @change="onChangeFreightFee"
          /><el-button
            type="text"
            @click="
              () => {
                this.globalFreightFee = 0
                this.onChangeFreightFee()
              }
            "
            >
免运费
</el-button>
        </div>
      </div>
      <div class="ft-r">
        <div class="r-item">
          <label>商品应付金额：</label><span>{{ `¥${dItemFee}` }}</span>
        </div>
        <div class="r-item">
          <label>运费：</label><span>{{ `¥${dFreightFee}` }}</span>
        </div>
        <div class="r-item">
          <label>订单应付金额：</label><span>{{ `¥${dOrderFee}` }}</span>
        </div>
      </div>
    </div>
    <div class="dialog-tip">
      <p>订单应付金额 = 商品应付金额 + 运费。</p>
      <p>
        一键改价后的金额为商品总价，该金额会按商品单价的金额比例分摊到每个商品，不会分摊到优惠和运费。
      </p>
      <p>订单应付金额不能小于等于0。</p>
    </div>
  </div>
</template>

<script>
import Big from 'big.js'
import { isNumber, isFloat } from '@/utils/validate'
export default {
  name: 'CompTableView',
  props: {
    value: Array,
    itemFee: [String, Number],
    freightFee: [String, Number],
    orderFee: [String, Number]
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      globalChangePrice: '',
      globalFreightFee: '',
      changeType: 'change_price',
      dItemFee: 0,
      dFreightFee: 0,
      dOrderFee: 0
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.tableData = newVal.map((item) => {
        return {
          item_name: item.item_name,
          item_spec_desc: item.item_spec_desc || '单规格',
          price: item.price / 100,
          item_fee: item.item_fee / 100,
          num: item.num,
          point: item.point,
          total_fee: item.total_fee,
          change_discount: item.change_discount,
          change_price: item.change_price,
          total: item.total / 100
        }
      })
    },
    itemFee(newVal, oldVal) {
      this.dItemFee = newVal
    },
    freightFee(newVal, oldVal) {
      this.dFreightFee = newVal
    },
    orderFee(newVal, oldVal) {
      this.dOrderFee = newVal
    }
  },
  created() {},
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const length = this.tableData.length
      if (columnIndex === 6) {
        if (rowIndex % length === 0) {
          return {
            rowspan: length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    toggleChangePriceType(e) {
      this.changeType = e
    },
    onChangeItemPrice() {
      let _itemFee = new Big(0)
      this.tableData.forEach((item) => {
        if (item.change_price) {
          _itemFee = _itemFee.plus(item.change_price)
        } else {
          _itemFee = _itemFee.plus(item.item_fee)
        }
      })
      this.tableData.forEach((item) => (item.total = _itemFee.toFixed(2)))
      this.dItemFee = _itemFee.toFixed(2)
      this.calc()
    },
    onChangeItemDiscount() {
      let _itemFee = new Big(0)
      this.tableData.forEach((item) => {
        if (item.change_discount) {
          _itemFee = _itemFee.plus((item.item_fee * item.change_discount) / 100)
        } else {
          _itemFee = _itemFee.plus(item.item_fee)
        }
      })
      this.tableData.forEach((item) => (item.total = _itemFee.toFixed(2)))
      this.dItemFee = _itemFee.toFixed(2)
      this.calc()
    },
    async handleChangePrice() {
      if (isNumber(this.globalChangePrice) || isFloat(this.globalChangePrice)) {
        this.tableLoading = true
      } else {
        this.$message.error('输入正确的数字')
      }
    },
    calc() {
      const { dItemFee, dFreightFee, dOrderFee } = this
      this.dOrderFee = new Big(0).plus(dItemFee).plus(dFreightFee)
    },
    onChangeFreightFee() {
      this.dFreightFee = this.globalFreightFee
      this.calc()
    }
  }
}
</script>
