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
      .freight-point-discount {
        margin-left: 66px;
        font-size: 13px;
        color: #b0b0b0;
        position: relative;
        top: -10px;
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
      <el-table-column prop="discount_fee" label="优惠（¥）" width="100" />
      <el-table-column prop="point" label="积分抵扣（¥）" width="120" />
      <el-table-column prop="total_fee" label="总计（¥）" width="100" />
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
            @keyup.native="() => priceFormat(scope.row, scope.$index)"
            @change="() => onChangeItemPrice(scope.row)"
          />
          <el-input
            v-if="changeType == 'change_discount'"
            v-model="scope.row.change_discount"
            placeholder="按折扣改价"
            size="small"
            @keyup.native="() => discountFormat(scope.row, scope.$index)"
            @change="() => onChangeItemDiscount(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="total" label="商品应付金额（¥）" width="150" />
    </el-table>
    <div class="tableview-ft">
      <div class="ft-l">
        <div class="l-item">
          <label>一键改价：</label>
          <el-input
            v-model="globalChangePrice"
            class="price"
            size="small"
            @keyup.native="() => globalPriceFormat(globalChangePrice)"
            @change="handleChangePrice"
          />
          <el-button type="text" @click="handleChangePrice"> 确定 </el-button>
        </div>
        <div class="l-item">
          <label>运费：</label
          ><el-input
            v-model="globalFreightFee"
            size="small"
            :disabled="receiptType == 'dada'"
            @keyup.native="() => globalFreightFormat(globalFreightFee)"
            @change="onChangeFreightFee"
          /><el-button
            v-if="receiptType != 'dada'"
            type="text"
            @click="
              () => {
                // eslint-disable-next-line vue/this-in-template
                this.globalFreightFee = 0
                // eslint-disable-next-line vue/this-in-template
                this.onChangeFreightFee()
              }
            "
          >
            免运费
          </el-button>
        </div>
        <div v-if="pointFreightFee" class="l-item">
          <div class="freight-point-discount">
            积分抵扣运费：{{ `${pointFreightFee.toFixed(2)}` }}
          </div>
        </div>
      </div>
      <div class="ft-r">
        <div class="r-item">
          <label>商品应付金额：</label><span>{{ ` ¥${dItemTotalFee.toFixed(2)}` }}</span>
        </div>
        <div class="r-item">
          <label>总运费：</label><span>{{ ` ¥${dFreightFee.toFixed(2)}` }}</span>
        </div>
        <div class="r-item">
          <label>积分抵扣运费：</label><span>{{ `-¥${pointFreightFee.toFixed(2)}` }}</span>
        </div>
        <div class="r-item">
          <label>订单应付金额：</label><span>{{ ` ¥${dOrderFee.toFixed(2)}` }}</span>
        </div>
      </div>
    </div>
    <div class="dialog-tip">
      <p>订单应付金额 = 商品应付金额 + 运费；总运费 ＝ 运费 + 积分抵扣运费。</p>
      <p>
        一键改价后的金额为商品总价，该金额会按商品单价的金额比例分摊到每个商品，不会分摊到优惠和运费。
      </p>
      <p>订单应付金额不能小于等于0。</p>
    </div>
  </div>
</template>

<script>
import Big from 'big.js'
export default {
  name: 'CompTableView',
  props: {
    value: Array,
    itemTotalFee: [String, Number],
    freightFee: [String, Number],
    orderFee: [String, Number],
    orderId: String,
    // 配送类型
    receiptType: String,
    // 运费积分抵扣
    pointFreightFee: [String, Number]
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      globalChangePrice: '',
      globalFreightFee: '',
      changeType: 'change_price',
      dItemTotalFee: 0,
      dFreightFee: 0,
      dOrderFee: 0,
      // 改价方式：total=一键改价；items=单件商品改价
      downType: ''
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.tableData = newVal.map((item) => {
        return {
          item_id: item.item_id,
          item_name: item.item_name,
          item_spec_desc: item.item_spec_desc || '单规格',
          price: (item.price / 100).toFixed(2),
          item_fee: (item.item_fee / 100).toFixed(2),
          num: item.num,
          discount_fee: (0 - item.discount_fee / 100).toFixed(2),
          point: (0 - item.point).toFixed(2),
          total_fee: (item.total_fee / 100).toFixed(2),
          change_discount: item.change_discount,
          change_price: item.change_price,
          total: item.total.toFixed(2)
        }
      })
      this.dItemTotalFee = this.itemTotalFee
      this.dFreightFee = this.freightFee
      this.dOrderFee = this.orderFee
    }
  },
  created() {},
  methods: {
    globalPriceFormat() {
      const reg = new RegExp('((^[1-9]\\d*)|^0)(\\.\\d{0,2}){0,1}$')
      if (!reg.test(this.globalChangePrice)) {
        this.globalChangePrice = this.globalChangePrice.substring(
          0,
          this.globalChangePrice.length - 1
        )
      }
    },
    globalFreightFormat() {
      const reg = new RegExp('((^[1-9]\\d*)|^0)(\\.\\d{0,2}){0,1}$')
      if (!reg.test(this.globalFreightFee)) {
        this.globalFreightFee = this.globalFreightFee.substring(0, this.globalFreightFee.length - 1)
      }
    },
    priceFormat({ change_price }, index) {
      const reg = new RegExp('((^[1-9]\\d*)|^0)(\\.\\d{0,2}){0,1}$')
      if (!reg.test(change_price)) {
        this.tableData[index].change_price = change_price.substring(0, change_price.length - 1)
      }
    },
    discountFormat({ change_discount }, index) {
      // 1-100 正整数
      const reg = new RegExp('^([1-9]|[1-9]\\d|100)$')
      if (!reg.test(change_discount)) {
        this.tableData[index].change_discount = change_discount.substring(
          0,
          change_discount.length - 1
        )
      }
    },
    calcItemsFee() {
      return new Big(this.dOrderFee).minus(this.dFreightFee).toFixed(2)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const length = this.tableData.length
      if (columnIndex === 7) {
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
    // 按直接改价
    onChangeItemPrice({ change_price, total_fee }) {
      if (parseFloat(change_price) >= parseFloat(total_fee)) {
        this.$message.error('不能高于原订单金额')
        return
      }
      const items = this.tableData.map((item) => {
        return {
          item_id: item.item_id,
          total_fee: item.change_price ? item.change_price * 100 : item.total_fee * 100
        }
      })
      this.downType = 'items'
      this.calcOrder(items)
    },
    // 按折扣改价
    onChangeItemDiscount({ change_discount }) {
      const items = this.tableData.map((item) => {
        return {
          item_id: item.item_id,
          total_fee: item.change_discount
            ? item.total_fee * item.change_discount
            : item.total_fee * 100
        }
      })
      this.downType = 'items'
      this.calcOrder(items)
    },
    // 一键改价
    async handleChangePrice() {
      if (!isNaN(parseFloat(this.globalChangePrice))) {
        this.downType = 'total'
        this.calcOrder([])
      }
    },
    // 运费改价
    onChangeFreightFee() {
      const items = this.tableData.map((item) => {
        let total_fee
        if (this.changeType == 'change_price') {
          total_fee = item.change_price ? item.change_price * 100 : item.total_fee * 100
        } else {
          total_fee = item.change_discount
            ? item.total_fee * item.change_discount
            : item.total_fee * 100
        }
        return {
          item_id: item.item_id,
          total_fee
        }
      })
      this.downType = 'items'
      this.calcOrder(items)
    },
    async calcOrder(items) {
      this.tableLoading = true
      let params = {
        order_id: this.orderId
      }
      if (this.downType) {
        params['down_type'] = this.downType
      }
      if (this.globalChangePrice) {
        params['total_fee'] = this.globalChangePrice * 100
      }
      if (!isNaN(parseFloat(this.globalFreightFee))) {
        params['freight_fee'] = this.globalFreightFee * 100
      }

      if (items.length > 0) {
        params['items'] = items
      }
      try {
        const res = await this.$api.trade.changePrice(params)
        this.downType = ''
        this.tableLoading = false
        this.$emit('onChange', res)
      } catch (e) {
        this.tableLoading = false
      }
    }
  }
}
</script>
