<template>
  <div>
    <!-- 添加弹框 -->
    <el-dialog
      title="添加礼品"
      :visible.sync="switchOn"
      :close-on-click-modal="false"
      class="add-form"
      :before-close="closeDialog"
    >
      <template v-if="dialog_step == 1">
        <div class="gift-type">
          <div class="gift-type-flex">
            <div
              class="gift-type-item"
              @click="giftTypeChoose('coupon')"
            >
              <div class="gift-type-icon">
                <i class="iconfont icon-ticket-alt" />
              </div>
              <div class="gift-type-tips">
                优惠券
              </div>
            </div>
            <div
              class="gift-type-item"
              @click="giftTypeChoose('exchange')"
            >
              <div class="gift-type-icon">
                <i class="iconfont icon-receipt" />
              </div>
              <div class="gift-type-tips">
                兑换券
              </div>
            </div>
            <div
              class="gift-type-item"
              @click="giftTypeChoose('goods')"
            >
              <div class="gift-type-icon">
                <i class="iconfont icon-shopping-bag" />
              </div>
              <div class="gift-type-tips">
                商品
              </div>
            </div>
            <div
              class="gift-type-item"
              @click="giftTypeChoose('integral')"
            >
              <div class="gift-type-icon">
                <i class="iconfont icon-coins" />
              </div>
              <div class="gift-type-tips">
                积分
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="gift_type == 'coupon'">
          <el-form
            :ref="couponForm"
            v-model="couponForm"
            label-width="120px"
          >
            <el-form-item label="优惠券名称">
              <el-input
                v-model="couponForm.name"
                placeholder="请输入优惠券名称"
              />
            </el-form-item>
            <el-form-item label="发放数量">
              <el-input-number
                v-model="couponForm.num"
                :min="1"
              />
            </el-form-item>
            <el-form-item label="优惠金额">
              <el-radio-group v-model="couponForm.money">
                <div>
                  <el-radio
                    label="fixedMoney"
                  >
                    指定金额&nbsp;<el-input
                      v-model="fixedMoney"
                      placeholder="金额"
                    />&nbsp;元
                  </el-radio>
                </div>
                <div>
                  <el-radio
                    label="fixedDiscount"
                  >
                    指定折扣&nbsp;<el-input
                      v-model="fixedDiscount"
                      placeholder="折扣"
                    />&nbsp;折
                  </el-radio>
                </div>
                <div>
                  <el-radio
                    label="randomMoney"
                  >
                    随机&nbsp;<el-input
                      v-model="randomMoneyMin"
                      placeholder="最小金额"
                      style="width: 120px"
                    />&nbsp;~&nbsp;<el-input
                      v-model="randomMoneyMax"
                      placeholder="最大金额"
                      style="width: 120px"
                    />
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="使用条件">
              <el-radio-group v-model="couponForm.use_condition">
                <div>
                  <el-radio label="none">
                    无条件
                  </el-radio>
                </div>
                <div>
                  <el-radio
                    label="conditionMoney"
                  >
                    满&nbsp;<el-input
                      v-model="conditionMoney"
                      placeholder="指定金额"
                    />&nbsp;元使用
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="有效期">
              <el-radio-group v-model="couponForm.effective_day">
                <div>
                  <el-radio
                    label="containToday"
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;领取后&nbsp;&nbsp;&nbsp;&nbsp;<el-input
                      v-model="containToday"
                      placeholder="有效天数"
                      style="width: 120px"
                    />&nbsp;天内可用
                  </el-radio>
                </div>
                <div>
                  <el-radio
                    label="notContainToday"
                  >
                    领取次日后&nbsp;<el-input
                      v-model="notContainToday"
                      placeholder="有效天数"
                      style="width: 120px"
                    />&nbsp;天内可用
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="使用途径">
              <el-radio-group v-model="couponForm.use_channel">
                <el-radio label="online">
                  线上购买
                </el-radio>
                <el-radio label="offline">
                  线下购买
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="适用门店">
              <el-radio-group v-model="couponForm.store">
                <el-radio label="all">
                  全部门店
                </el-radio>
                <el-radio label="designate">
                  指定门店
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <template v-else-if="gift_type == 'exchange'">
          <el-form
            :ref="exchangeForm"
            v-model="exchangeForm"
            label-width="120px"
          >
            <el-form-item label="兑换券名称">
              <el-input
                v-model="exchangeForm.name"
                placeholder="请输入优惠券名称"
              />
            </el-form-item>
            <el-form-item label="发放数量">
              <el-input-number
                v-model="exchangeForm.num"
                :min="1"
              />
            </el-form-item>
            <el-form-item label="兑换内容">
              <el-input
                v-model="exchangeForm.content"
                type="textarea"
                :rows="3"
                placeholder="请输入兑换内容"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item label="有效期">
              <el-radio-group v-model="exchangeForm.effective_day">
                <div>
                  <el-radio
                    label="containToday"
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;领取后&nbsp;&nbsp;&nbsp;&nbsp;<el-input
                      v-model="containToday"
                      placeholder="有效天数"
                      style="width: 120px"
                    />&nbsp;天内可用
                  </el-radio>
                </div>
                <div>
                  <el-radio
                    label="notContainToday"
                  >
                    领取次日后&nbsp;<el-input
                      v-model="notContainToday"
                      placeholder="有效天数"
                      style="width: 120px"
                    />&nbsp;天内可用
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <template v-else-if="gift_type == 'goods'">
          <el-form
            :ref="goodsForm"
            v-model="goodsForm"
            label-width="120px"
          >
            <el-form-item label="礼品名称">
              <el-input
                v-model="goodsForm.name"
                placeholder="请输入优惠券名称"
              />
            </el-form-item>
            <el-form-item label="发放数量">
              <el-input-number
                v-model="goodsForm.num"
                :min="1"
              />
            </el-form-item>
            <el-form-item label="选择基础商品">
              <el-card class="box-card">
                <div
                  slot="header"
                  class="clearfix"
                >
                  <span style="line-height: 36px">商品列表</span>&nbsp;<span
                    class="setting-remind"
                  >(设置商品的可使用次数)</span>
                  <el-button
                    type="primary"
                    style="float: right"
                    @click="addGoods"
                  >
                    添加商品
                  </el-button>
                </div>
                <el-row
                  v-for="(item, index) in goodsForm.goods_list"
                  :key="index"
                >
                  <el-col :span="8">
                    {{ item.name }}
                  </el-col>
                  <el-col
                    :span="14"
                  >
                    <el-input
                      v-model="item.count"
                      style="width: 120px"
                      placeholder="可使用次数"
                    />&nbsp;次
                  </el-col>
                  <el-col
                    :span="2"
                  >
                    <el-button
                      type="text"
                      @click="removeGoods(item, index)"
                    >
                      删除
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-form-item>
            <el-form-item label="有效期">
              <el-radio-group v-model="goodsForm.effective_day">
                <div>
                  <el-radio
                    label="containToday"
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;领取后&nbsp;&nbsp;&nbsp;&nbsp;<el-input
                      v-model="containToday"
                      placeholder="有效天数"
                      style="width: 120px"
                    />&nbsp;天内可用
                  </el-radio>
                </div>
                <div>
                  <el-radio
                    label="notContainToday"
                  >
                    领取次日后&nbsp;<el-input
                      v-model="notContainToday"
                      placeholder="有效天数"
                      style="width: 120px"
                    />&nbsp;天内可用
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <div
          slot="footer"
          class="dialog-footer content-center"
        >
          <el-button @click="closeDialog">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="chooseGift"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      title="商品选择"
      :visible.sync="goodsSelectDialog"
      :close-on-click-modal="false"
      class="goods-list"
    >
      <div class="clearfix">
        <div class="f_l">
          <el-select v-model="goodsCategory">
            <el-option
              v-for="item in goodsCategoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="f_r">
          <el-pagination
            layout="prev, pager, next"
            :total="pagers.total"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="goodsList"
        style="width: 100%"
      >
        <el-table-column
          label="商品名称"
          class="goods-img"
        >
          <template slot-scope="scope">
            <img :src="scope.row.img_url"><span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格">
          <template slot-scope="scope">
            <span>¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="chooseGoods(scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['switchOn'],
  data () {
    return {
      couponForm: {
        name: '',
        num: '1',
        money: 'fixedMoney',
        use_condition: 'none',
        effective_day: 'containToday',
        use_channel: 'online',
        store: 'all'
      },
      exchangeForm: {
        name: '',
        num: '',
        content: '',
        effective_day: 'containToday'
      },
      goodsForm: {
        name: '',
        num: '',
        base_goods: [],
        effective_day: 'containToday',
        goods_list: [{ goods_id: '', name: '护肤', count: '' }]
      },
      dialogVisible: false,
      gift_type: 'goods',
      dialog_step: 1,
      fixedMoney: '',
      fixedDiscount: '',
      randomMoneyMin: '',
      randomMoneyMax: '',
      conditionMoney: '',
      containToday: '',
      notContainToday: '',
      goodsSelectDialog: false,
      goodsCategory: 'all',
      goodsCategoryList: [{ label: '所有分类', value: 'all' }],
      goodsList: [{ goods_id: '', name: 'text', img_url: '', price: '99' }],
      loading: false,
      pagers: {
        total: 0
      },
      pageSize: 20
    }
  },
  mounted () {
    this.dialog_step = 1
  },
  methods: {
    closeDialog () {
      // this.dialogVisible = false
      this.$emit('closeDialog')
      this.dialog_step = 1
    },
    chooseGift () {
      // this.dialogVisible = false
      this.$emit('closeDialog')
      this.dialog_step = 1
    },
    giftTypeChoose (type) {
      switch (type) {
        case 'coupon':
          this.gift_type = 'coupon'
          break
        case 'exchange':
          this.gift_type = 'exchange'
          break
        case 'goods':
          this.gift_type = 'goods'
          break
        case 'integral':
          this.gift_type = 'integral'
          break
      }
      this.dialog_step = 2
    },
    removeGoods (item, index) {
      this.goodsForm.goods_list.splice(index, 1)
    },
    addGoods () {
      this.goodsSelectDialog = true
    },
    chooseGoods (row) {
      this.goodsForm.goods_list.push({ goods_id: row.goods_id, name: row.name, count: '' })
      this.goodsSelectDialog = false
    },
    handleCurrentChange (val) {}
  }
}
</script>

<style scoped lang="scss">
.el-table {
  margin-left: 70px;
  width: 90%;
  margin-top: 20px;
}
.gift-type {
  &-flex {
    display: flex;
  }
  &-item {
    flex: 1;
    text-align: center;
  }
  &-icon {
    width: 120px;
    height: 120px;
    color: #fff;
    border-radius: 10px;
    margin: 0 auto;
    display: table;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    }
    i {
      display: table-cell;
      vertical-align: middle;
      font-size: 55px;
    }
  }
  &-item:nth-child(1) &-icon {
    background-color: #89cffe;
  }
  &-item:nth-child(2) &-icon {
    background-color: #ff7e90;
  }
  &-item:nth-child(3) &-icon {
    background-color: #aab4fe;
  }
  &-item:nth-child(4) &-icon {
    background-color: #f3df00;
  }
  &-tips {
    margin-top: 10px;
  }
}
.el-radio-group {
  .el-radio {
    margin-bottom: 10px;
  }
}
.setting-remind {
  font-size: 12px;
  color: #ff4949;
}
.goods-img {
  img {
    width: 35px;
    max-height: 26px;
  }
}
.goods-list {
  .el-table {
    margin-left: 0;
  }
}
.el-card {
  .el-row {
    margin-bottom: 10px;
  }
}
.box-card {
  width: 80%;
}
</style>
