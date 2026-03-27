<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :model="form" class="box-set" label-width="120px">
      <div class="section-header with-border">
        <div>{{ $t('d37687bd.6fd631') }}</div>
      </div>
      <div class="clearfix" style="min-width: 1222px">
        <div class="form-view clearfix">
          <section class="section section-white">
            <el-form-item :label="$t('d37687bd.8b1dc6')">
              <el-row :gutter="20">
                <el-col :span="20">
                  <p class="frm-tips" />
                  <div class="logo-box">
                    <div class="bran-img">
                      <div v-if="goods.pics" class="groups-addgoods">
                        <img :src="wximageurl + goods.pics[0]" class="groups-goodspic" />
                        <div class="gooups-goodsmsg">
                          <div>{{ goods.itemName }}</div>
                          <div>
                            {{ $t('d37687bd.80193b') }}{{ cursymbol }} {{ goods.price / 100 }}
                          </div>
                          <div v-if="goods.item_type == 'normal'">
                            {{ $t('d37687bd.b008bd') }}{{ goods.store }}
                          </div>
                        </div>
                      </div>
                      <div v-else tabindex="0" class="el-upload el-upload--picture-card">
                        <i class="el-icon-plus" />
                      </div>
                    </div>
                    <el-button size="small" type="primary" @click="changeItem">
                      {{ $t('d37687bd.43d1e2') }}
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </section>
        </div>
        <div class="form-wrapper clearfix">
          <el-form-item
            :label="$t('d37687bd.39834b')"
            prop="luckydraw_name"
            :rules="rules.luckydraw_name"
          >
            <el-col :span="9">
              <el-input
                v-model="form.luckydraw_name"
                :maxlength="30"
                :placeholder="$t('d37687bd.5c43b7')"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('d37687bd.c799f5')" prop="date" :rules="rules.date">
            <el-col :span="12">
              <el-date-picker
                v-model="form.date"
                type="datetimerange"
                :range-separator="$t('d37687bd.981cbe')"
                :start-placeholder="$t('d37687bd.fc92e9')"
                :end-placeholder="$t('d37687bd.1fa23f')"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            :label="$t('d37687bd.6bca26')"
            prop="luckydraw_payment"
            :rules="rules.luckydraw_payment"
          >
            <el-col :span="2">
              <el-select
                v-model="form.luckydraw_payment"
                :placeholder="$t('d37687bd.0c9d2b')"
                style="width: 100%"
                @change="changePayment"
              >
                <el-option
                  v-for="(item, index) in luckydrawPayments"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item
            v-if="form.luckydraw_payment == 'cash'"
            :label="$t('d37687bd.ad779b')"
            prop="luckydraw_price"
            :rules="rules.luckydraw_price"
          >
            <el-col :span="2">
              <el-input
                v-model="form.luckydraw_price"
                placeholder=""
                @change="paymentTotalChange"
              />
            </el-col>
            <el-col :span="1"> {{ $t('d37687bd.c16655') }} </el-col>
          </el-form-item>
          <el-form-item
            v-if="form.luckydraw_payment == 'point'"
            :label="$t('d37687bd.113352')"
            prop="luckydraw_point"
            :rules="rules.luckydraw_point"
          >
            <el-col :span="2">
              <el-input
                v-model="form.luckydraw_point"
                placeholder=""
                @change="paymentTotalChange"
              />
            </el-col>
            <el-col :span="1"> {{ $t('d37687bd.9f68a8') }} </el-col>
          </el-form-item>
          <el-form-item
            :label="$t('d37687bd.a73b1b')"
            prop="luckydraw_store"
            :rules="rules.luckydraw_store"
          >
            <el-col :span="2">
              <el-input
                v-model="form.luckydraw_store"
                type="number"
                min="1"
                max="9999999"
                placeholder=""
                @change="paymentTotalChange"
              />
            </el-col>
            <el-col :span="1"> {{ $t('d37687bd.f7edf5') }} </el-col>
          </el-form-item>
          <el-form-item :label="$t('d37687bd.26a438')" prop="payment_total">
            <el-col :span="2">
              <el-input v-model="form.payment_total" readonly placeholder="" />
            </el-col>
            <el-col v-if="form.luckydraw_payment == 'point'" :span="1">
              {{ $t('d37687bd.1a381b') }}
            </el-col>
            <el-col v-else-if="form.luckydraw_payment == 'cash'" :span="1">
              {{ $t('d37687bd.602771') }}
            </el-col>
            {{ $t('d37687bd.4ca103') }}
          </el-form-item>
          <el-form-item :label="$t('d37687bd.04cbda')" prop="limit_num" :rules="rules.limit_num">
            <el-col :span="4">
              <el-input-number v-model="form.limit_num" :min="0" placeholder="" />
            </el-col>
            <el-col :span="4"> {{ $t('d37687bd.ddabc2') }} </el-col>
          </el-form-item>
          <el-form-item :label="$t('d37687bd.b148a1')">
            <el-col :span="4">
              <el-select v-model="form.lucky_fixed_number" placeholder="" style="width: 100%">
                <el-option
                  v-for="(item, index) in fixed_numbers"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item
            :label="$t('d37687bd.3bdd08')"
            prop="description"
            :rules="rules.description"
          >
            <el-col :span="12">
              <el-input
                v-model="form.description"
                :maxlength="25"
                :placeholder="$t('d37687bd.acde7b')"
              />
            </el-col>
          </el-form-item>
          <el-form-item label=" ">
            <el-button @click.native="handleCancel"> {{ $t('d37687bd.5f4112') }} </el-button>
            <el-button v-if="true == show" type="primary" @click="submitItemsAction('form')">
              {{ $t('d37687bd.be5fbb') }}
            </el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog :title="$t('d37687bd.43d1e2')" :visible.sync="goodsDialogVisible" center>
      <!-- <el-button-group class="tab-group">
        <el-button class="tab-btn" @click="changeGoods('normal')" :class="goodsTypeTitle==='实体类商品' ? 'on' : ''" >实体类商品</el-button>
        <el-button class="tab-btn" @click="changeGoods('every')" :class="goodsTypeTitle==='服务类商品' ? 'on' : ''">服务类商品</el-button>
      </el-button-group> -->
      <el-row class="content-bottom-padded" :gutter="20">
        <el-col :span="12">
          <el-input v-model="itemsParams.keywords" :placeholder="$t('d37687bd.1fd1d5')">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-table v-loading="itemsLoading" :data="itemsList" style="width: 100%" border height="500">
        <el-table-column prop="itemName" :label="$t('d37687bd.1fd1d5')" />
        <el-table-column :label="$t('d37687bd.0f088d')">
          <template slot-scope="scope">
            <img width="20" :src="wximageurl + scope.row.pics[0]" />
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('d37687bd.e29575')" :formatter="priceformatter" />
        <el-table-column prop="itemName" :label="$t('d37687bd.3fea7c')">
          <template slot-scope="scope">
            <a v-if="form.item_Id != scope.row.itemId" href="#" @click="chooseItem(scope.row)">{{
              $t('d37687bd.153fa6')
            }}</a>
            <span v-else>{{ $t('d37687bd.f08afd') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="itemsTotalCount > itemsParams.pageSize" class="content-center content-top-padded">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="itemsParams.page"
          :total="itemsTotalCount"
          :page-size="itemsParams.pageSize"
          @current-change="goodsHandleCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{ $t('d37687bd.9d2578') }}</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">{{
          $t('d37687bd.aa7527')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getItemsList } from '../../../../api/goods'
import { getDefaultCurrency } from '../../../../api/company'
import {
  createLuckyDrawActivity,
  updateLuckyDrawActivity,
  getLuckyDrawInfo
} from '../../../../api/promotions'

export default {
  data() {
    return {
      luckydrawPayments: [],
      fixed_numbers: [{ name: '10000001', value: '10000001' }],
      show: true,
      itemsLoading: false,
      luckydraw_id: '',
      form: {
        item_id: '',
        luckydraw_name: '',
        date: '',
        luckydraw_payment: 'point',
        luckydraw_price: '',
        luckydraw_point: '10',
        luckydraw_store: '',
        limit_num: '',
        description: '',
        payment_total: '',
        lucky_fixed_number: '10000001'
      },
      goods: {},
      itemsList: [],
      itemsParams: {
        page: 1,
        pageSize: 20,
        item_type: 'normal',
        keywords: ''
      },
      itemsTotalCount: 0,
      dialogVisible: false,
      goodsDialogVisible: false,
      rules: {}
      },
      currency: {},
      cursymbol: '￥',
      goodsTypeTitle: ''
    }
  },
  computed: {
    rules() {
      return {
        luckydraw_name: [{ required: true, message: this.$t('d37687bd.9a270b') }],
        date: [{ required: true, message: this.$t('d37687bd.696416') }],
        luckydraw_price: [
          { required: true, message: this.$t('d37687bd.6f2838') },
          { pattern: /^(?=.*[1-9])\d+(\.\d{1,2})?$/, message: this.$t('d37687bd.9f03a0') }
        ],
        luckydraw_point: [
          { required: true, message: this.$t('d37687bd.190729') },
          { pattern: /^[0-9]*[1-9][0-9]*$/, message: this.$t('d37687bd.aafefb') }
        ],
        luckydraw_store: [
          { required: true, message: this.$t('d37687bd.d7cea5') },
          { pattern: /^[0-9]*[1-9][0-9]*$/, message: this.$t('d37687bd.06e3c0') }
        ],
        description: [{ required: true, message: this.$t('d37687bd.11956a') }]
      }
    },
    luckydrawPayments() {
      return [{ name: this.$t('d37687bd.9f68a8'), value: 'point' }]
    }
  },
  mounted() {
    if (this.$route.query.show) {
      this.show = false
    }
    if (this.$route.params.luckydraw_id) {
      this.luckydraw_id = this.$route.params.luckydraw_id
      this.getLuckyDrawInfo()
    }
    this.getCurrencyInfo()
  },
  methods: {
    submitItemsAction(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.item_id) {
            this.$message.error(this.$t('d37687bd.c5c5f2'))
            return false
          }
          if (this.luckydraw_id) {
            updateLuckyDrawActivity(this.luckydraw_id, this.form).then((res) => {
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: this.$t('d37687bd.918092')
                })
                this.$router.push({ path: '/member/marketing/luckydraw/index' })
              }
            })
          } else {
            createLuckyDrawActivity(this.form).then((res) => {
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: this.$t('d37687bd.13655e')
                })
                this.$router.push({ path: '/member/marketing/luckydraw/index' })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push({ path: '/member/marketing/luckydraw/index' })
    },
    changeItem() {
      this.goodsDialogVisible = true
      this.getGoodsList()
    },
    chooseItem(row) {
      this.goodsDialogVisible = false
      this.goods = row
      this.form.item_id = row.itemId
      this.form.luckydraw_store = Math.ceil(row.price / 100)
      this.paymentTotalChange()
    },
    goodsHandleCurrentChange(val) {
      this.itemsParams.page = val
      this.getGoodsList()
    },
    goodsSearch() {
      this.getGoodsList()
    },
    getGoodsList() {
      this.itemsLoading = true
      getItemsList(this.itemsParams)
        .then((response) => {
          this.itemsLoading = false
          this.itemsList = response.data.data.list
          this.itemsTotalCount = response.data.data.total_count
        })
        .catch((error) => {
          this.itemsLoading = false
          this.$message({
            type: 'error',
            message: this.$t('d37687bd.325305')
          })
        })
    },
    getLuckyDrawInfo() {
      getLuckyDrawInfo(this.luckydraw_id)
        .then((response) => {
          this.form = response.data.data
          this.form.luckydraw_price = this.form.luckydraw_price / 100
          this.paymentTotalChange()
          this.form.date = [
            new Date(response.data.data.start_time * 1000),
            new Date(response.data.data.end_time * 1000)
          ]
          this.goods = response.data.data.goods
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: this.$t('d37687bd.09fc42')
          })
        })
    },
    priceformatter(row, column) {
      return this.cursymbol + row.price / 100
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    changeGoods(type) {
      switch (type) {
        case 'every':
          this.$set(this.itemsParams, 'consume_type', 'every')
          this.$delete(this.itemsParams, 'item_type')
          this.goodsTypeTitle = this.$t('d37687bd.fcd4d7')
          break
        case 'normal':
          this.$set(this.itemsParams, 'item_type', 'normal')
          this.$delete(this.itemsParams, 'consume_type')
          this.goodsTypeTitle = this.$t('d37687bd.ddf672')
          break
      }
      this.getGoodsList()
    },
    changePayment(value) {
      this.luckydraw_payment = value
      this.paymentTotalChange()
    },
    paymentTotalChange() {
      if (this.form.luckydraw_payment == 'point') {
        this.form.payment_total = this.form.luckydraw_point * this.form.luckydraw_store
      } else if (this.form.luckydraw_payment == 'cash') {
        this.form.payment_total = this.form.luckydraw_price * this.form.luckydraw_store
      }
    }
  }
}
</script>

<style scoped lang="scss">
.groups-addgoods {
  display: flex;
  .groups-goodspic {
    float: left;
    width: 120px;
    height: 120px;
    border: 1px solid #ddd;
  }
  .gooups-goodsmsg {
    float: left;
    max-width: 670px;
    margin-left: 10px;
    margin-top: 15px;
    overflow: hidden;
  }
}
</style>
