<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <!-- 添加弹框 -->
    <el-dialog
      :title="$t('88c304e0.874fa7')"
      :visible.sync="switchOn"
      :close-on-click-modal="false"
      class="add-form"
      :before-close="closeDialog"
    >
      <template v-if="dialog_step == 1">
        <div class="gift-type">
          <div class="gift-type-flex">
            <div class="gift-type-item" @click="giftTypeChoose('coupon')">
              <div class="gift-type-icon">
                <i class="iconfont icon-ticket-alt" />
              </div>
              <div class="gift-type-tips">{{ $t('88c304e0.2f3635') }}</div>
            </div>
            <div class="gift-type-item" @click="giftTypeChoose('exchange')">
              <div class="gift-type-icon">
                <i class="iconfont icon-receipt" />
              </div>
              <div class="gift-type-tips">{{ $t('88c304e0.8bc752') }}</div>
            </div>
            <div class="gift-type-item" @click="giftTypeChoose('goods')">
              <div class="gift-type-icon">
                <i class="iconfont icon-shopping-bag" />
              </div>
              <div class="gift-type-tips">{{ $t('88c304e0.9897d8') }}</div>
            </div>
            <div class="gift-type-item" @click="giftTypeChoose('integral')">
              <div class="gift-type-icon">
                <i class="iconfont icon-coins" />
              </div>
              <div class="gift-type-tips">{{ $t('88c304e0.9f68a8') }}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="gift_type == 'coupon'">
          <el-form :ref="couponForm" v-model="couponForm" label-width="120px">
            <el-form-item :label="$t('88c304e0.fbaebb')">
              <el-input v-model="couponForm.name" :placeholder="$t('88c304e0.1f9884')" />
            </el-form-item>
            <el-form-item :label="$t('88c304e0.c3c2e5')">
              <el-input-number v-model="couponForm.num" :min="1" />
            </el-form-item>
            <el-form-item :label="$t('88c304e0.5b921a')">
              <el-radio-group v-model="couponForm.money">
                <div>
                  <el-radio label="fixedMoney">
                    {{ $t('88c304e0.deb8fe') }}&nbsp;<el-input
                      v-model="fixedMoney"
                      :placeholder="$t('88c304e0.4cf24a')"
                    />&nbsp;元
                  </el-radio>
                </div>
                <div>
                  <el-radio label="fixedDiscount">
                    {{ $t('88c304e0.2502b1') }}&nbsp;<el-input
                      v-model="fixedDiscount"
                      :placeholder="$t('88c304e0.4091e2')"
                    />&nbsp;折
                  </el-radio>
                </div>
                <div>
                  <el-radio label="randomMoney">
                    {{ $t('88c304e0.3bde44') }}&nbsp;<el-input
                      v-model="randomMoneyMin"
                      :placeholder="$t('88c304e0.fbcd1d')"
                      style="width: 120px"
                    />&nbsp;~&nbsp;<el-input
                      v-model="randomMoneyMax"
                      :placeholder="$t('88c304e0.7ccbf2')"
                      style="width: 120px"
                    />
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('88c304e0.2f99a3')">
              <el-radio-group v-model="couponForm.use_condition">
                <div>
                  <el-radio label="none"> {{ $t('88c304e0.a26c25') }} </el-radio>
                </div>
                <div>
                  <el-radio label="conditionMoney">
                    {{ $t('88c304e0.73325c') }}&nbsp;<el-input
                      v-model="conditionMoney"
                      :placeholder="$t('88c304e0.deb8fe')"
                    />&nbsp;{{ $t('88c304e0.f82d59') }}
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('88c304e0.bb114a')">
              <el-radio-group v-model="couponForm.effective_day">
                <div>
                  <el-radio label="containToday">
                    &nbsp;&nbsp;&nbsp;&nbsp;{{
                      $t('88c304e0.ec5892')
                    }}&nbsp;&nbsp;&nbsp;&nbsp;<el-input
                      v-model="containToday"
                      :placeholder="$t('88c304e0.f81c3d')"
                      style="width: 120px"
                    />&nbsp;{{ $t('88c304e0.d66304') }}
                  </el-radio>
                </div>
                <div>
                  <el-radio label="notContainToday">
                    {{ $t('88c304e0.2d46e5') }}&nbsp;<el-input
                      v-model="notContainToday"
                      :placeholder="$t('88c304e0.f81c3d')"
                      style="width: 120px"
                    />&nbsp;{{ $t('88c304e0.d66304') }}
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('88c304e0.908daa')">
              <el-radio-group v-model="couponForm.use_channel">
                <el-radio label="online"> {{ $t('88c304e0.5605a4') }} </el-radio>
                <el-radio label="offline"> {{ $t('88c304e0.9ec3e5') }} </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('88c304e0.a874b0')">
              <el-radio-group v-model="couponForm.store">
                <el-radio label="all"> {{ $t('88c304e0.a48948') }} </el-radio>
                <el-radio label="designate"> {{ $t('88c304e0.f2448e') }} </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <template v-else-if="gift_type == 'exchange'">
          <el-form :ref="exchangeForm" v-model="exchangeForm" label-width="120px">
            <el-form-item :label="$t('88c304e0.9b47b8')">
              <el-input v-model="exchangeForm.name" :placeholder="$t('88c304e0.1f9884')" />
            </el-form-item>
            <el-form-item :label="$t('88c304e0.c3c2e5')">
              <el-input-number v-model="exchangeForm.num" :min="1" />
            </el-form-item>
            <el-form-item :label="$t('88c304e0.31ffed')">
              <el-input
                v-model="exchangeForm.content"
                type="textarea"
                :rows="3"
                :placeholder="$t('88c304e0.b64d46')"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item :label="$t('88c304e0.bb114a')">
              <el-radio-group v-model="exchangeForm.effective_day">
                <div>
                  <el-radio label="containToday">
                    &nbsp;&nbsp;&nbsp;&nbsp;{{
                      $t('88c304e0.ec5892')
                    }}&nbsp;&nbsp;&nbsp;&nbsp;<el-input
                      v-model="containToday"
                      :placeholder="$t('88c304e0.f81c3d')"
                      style="width: 120px"
                    />&nbsp;{{ $t('88c304e0.d66304') }}
                  </el-radio>
                </div>
                <div>
                  <el-radio label="notContainToday">
                    {{ $t('88c304e0.2d46e5') }}&nbsp;<el-input
                      v-model="notContainToday"
                      :placeholder="$t('88c304e0.f81c3d')"
                      style="width: 120px"
                    />&nbsp;{{ $t('88c304e0.d66304') }}
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <template v-else-if="gift_type == 'goods'">
          <el-form :ref="goodsForm" v-model="goodsForm" label-width="120px">
            <el-form-item :label="$t('88c304e0.e8d2de')">
              <el-input v-model="goodsForm.name" :placeholder="$t('88c304e0.1f9884')" />
            </el-form-item>
            <el-form-item :label="$t('88c304e0.c3c2e5')">
              <el-input-number v-model="goodsForm.num" :min="1" />
            </el-form-item>
            <el-form-item :label="$t('88c304e0.518e06')">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span style="line-height: 36px">{{ $t('88c304e0.437974') }}</span
                  >&nbsp;<span class="setting-remind">{{ $t('88c304e0.0beca9') }}</span>
                  <el-button type="primary" style="float: right" @click="addGoods">
                    {{ $t('88c304e0.fa3aee') }}
                  </el-button>
                </div>
                <el-row v-for="(item, index) in goodsForm.goods_list" :key="index">
                  <el-col :span="8">
                    {{ item.name }}
                  </el-col>
                  <el-col :span="14">
                    <el-input
                      v-model="item.count"
                      style="width: 120px"
                      :placeholder="$t('88c304e0.11d094')"
                    />&nbsp;次
                  </el-col>
                  <el-col :span="2">
                    <el-button type="text" @click="removeGoods(item, index)">
                      {{ $t('88c304e0.2f4aad') }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-form-item>
            <el-form-item :label="$t('88c304e0.bb114a')">
              <el-radio-group v-model="goodsForm.effective_day">
                <div>
                  <el-radio label="containToday">
                    &nbsp;&nbsp;&nbsp;&nbsp;{{
                      $t('88c304e0.ec5892')
                    }}&nbsp;&nbsp;&nbsp;&nbsp;<el-input
                      v-model="containToday"
                      :placeholder="$t('88c304e0.f81c3d')"
                      style="width: 120px"
                    />&nbsp;{{ $t('88c304e0.d66304') }}
                  </el-radio>
                </div>
                <div>
                  <el-radio label="notContainToday">
                    {{ $t('88c304e0.2d46e5') }}&nbsp;<el-input
                      v-model="notContainToday"
                      :placeholder="$t('88c304e0.f81c3d')"
                      style="width: 120px"
                    />&nbsp;{{ $t('88c304e0.d66304') }}
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer content-center">
          <el-button @click="closeDialog"> {{ $t('88c304e0.c08ab9') }} </el-button>
          <el-button type="primary" @click="chooseGift"> {{ $t('88c304e0.aa7527') }} </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :title="$t('88c304e0.af75f6')"
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
      <el-table v-loading="loading" :data="goodsList" style="width: 100%">
        <el-table-column :label="$t('88c304e0.1fd1d5')" class="goods-img">
          <template slot-scope="scope">
            <img :src="scope.row.img_url"><span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('88c304e0.0e9fd9')">
          <template slot-scope="scope">
            <span>¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('88c304e0.2b6bc0')" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="chooseGoods(scope.row)">
              {{ $t('88c304e0.153fa6') }}
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
  data() {
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
      goodsList: [{ goods_id: '', name: 'text', img_url: '', price: '99' }],
      loading: false,
      pagers: {
        total: 0
      },
      pageSize: 20
    }
  },
  computed: {
    goodsCategoryList() {
      return [{ label: this.$t('88c304e0.6d2ad3'), value: 'all' }]
    }
  },
  mounted() {
    this.dialog_step = 1
  },
  methods: {
    closeDialog() {
      // this.dialogVisible = false
      this.$emit('closeDialog')
      this.dialog_step = 1
    },
    chooseGift() {
      // this.dialogVisible = false
      this.$emit('closeDialog')
      this.dialog_step = 1
    },
    giftTypeChoose(type) {
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
    removeGoods(item, index) {
      this.goodsForm.goods_list.splice(index, 1)
    },
    addGoods() {
      this.goodsSelectDialog = true
    },
    chooseGoods(row) {
      this.goodsForm.goods_list.push({ goods_id: row.goods_id, name: row.name, count: '' })
      this.goodsSelectDialog = false
    },
    handleCurrentChange(val) {}
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
