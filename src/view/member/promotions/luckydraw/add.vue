<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="section section-white">
    <el-form ref="form" :model="form" class="box-set" label-width="120px">
      <div class="section-header with-border">
        <div>活动商品信息</div>
      </div>
      <div class="clearfix" style="min-width: 1222px">
        <div class="form-view clearfix">
          <section class="section section-white">
            <el-form-item label="抽奖商品">
              <el-row :gutter="20">
                <el-col :span="20">
                  <p class="frm-tips" />
                  <div class="logo-box">
                    <div class="bran-img">
                      <div v-if="goods.pics" class="groups-addgoods">
                        <img :src="wximageurl + goods.pics[0]" class="groups-goodspic">
                        <div class="gooups-goodsmsg">
                          <div>{{ goods.itemName }}</div>
                          <div>原价：{{ cursymbol }} {{ goods.price / 100 }}</div>
                          <div v-if="goods.item_type == 'normal'">库存：{{ goods.store }}</div>
                        </div>
                      </div>
                      <div v-else tabindex="0" class="el-upload el-upload--picture-card">
                        <i class="el-icon-plus" />
                      </div>
                    </div>
                    <el-button size="small" type="primary" @click="changeItem">
                      选择商品
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </section>
        </div>
        <div class="form-wrapper clearfix">
          <el-form-item label="活动名称" prop="luckydraw_name" :rules="rules.luckydraw_name">
            <el-col :span="9">
              <el-input v-model="form.luckydraw_name" :maxlength="30" placeholder="抽奖活动名称" />
            </el-col>
          </el-form-item>
          <el-form-item label="活动时间" prop="date" :rules="rules.date">
            <el-col :span="12">
              <el-date-picker
                v-model="form.date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="生效时间"
                end-placeholder="过期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="抽奖方式" prop="luckydraw_payment" :rules="rules.luckydraw_payment">
            <el-col :span="2">
              <el-select
                v-model="form.luckydraw_payment"
                placeholder="支付方式"
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
            label="抽奖单价(现金)"
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
            <el-col :span="1"> 元 </el-col>
          </el-form-item>
          <el-form-item
            v-if="form.luckydraw_payment == 'point'"
            label="单价(积分)"
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
            <el-col :span="1"> 积分 </el-col>
          </el-form-item>
          <el-form-item label="总需人次" prop="luckydraw_store" :rules="rules.luckydraw_store">
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
            <el-col :span="1"> 件 </el-col>
          </el-form-item>
          <el-form-item label="总投奖额" prop="payment_total">
            <el-col :span="2">
              <el-input v-model="form.payment_total" readonly placeholder="" />
            </el-col>
            <el-col v-if="form.luckydraw_payment == 'point'" :span="1"> 积分, </el-col>
            <el-col v-else-if="form.luckydraw_payment == 'cash'" :span="1"> 元, </el-col>
            自动计算
          </el-form-item>
          <el-form-item label="会员限购数" prop="limit_num" :rules="rules.limit_num">
            <el-col :span="4">
              <el-input-number v-model="form.limit_num" :min="0" placeholder="" />
            </el-col>
            <el-col :span="4"> 填 0 则代表不限购 </el-col>
          </el-form-item>
          <el-form-item label="开奖固定值">
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
          <el-form-item label="描述" prop="description" :rules="rules.description">
            <el-col :span="12">
              <el-input v-model="form.description" :maxlength="25" placeholder="请输入活动描述" />
            </el-col>
          </el-form-item>
          <el-form-item label=" ">
            <el-button @click.native="handleCancel"> 返回 </el-button>
            <el-button v-if="true == show" type="primary" @click="submitItemsAction('form')">
              保存
            </el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog title="选择商品" :visible.sync="goodsDialogVisible" center>
      <!-- <el-button-group class="tab-group">
        <el-button class="tab-btn" @click="changeGoods('normal')" :class="goodsTypeTitle==='实体类商品' ? 'on' : ''" >实体类商品</el-button>
        <el-button class="tab-btn" @click="changeGoods('every')" :class="goodsTypeTitle==='服务类商品' ? 'on' : ''">服务类商品</el-button>
      </el-button-group> -->
      <el-row class="content-bottom-padded" :gutter="20">
        <el-col :span="12">
          <el-input v-model="itemsParams.keywords" placeholder="商品名称">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-table v-loading="itemsLoading" :data="itemsList" style="width: 100%" border height="500">
        <el-table-column prop="itemName" label="商品名称" />
        <el-table-column label="缩略图">
          <template slot-scope="scope">
            <img width="20" :src="wximageurl + scope.row.pics[0]">
          </template>
        </el-table-column>
        <el-table-column prop="price" label="销售价" :formatter="priceformatter" />
        <el-table-column prop="itemName" label="状态">
          <template slot-scope="scope">
            <a v-if="form.item_Id != scope.row.itemId" href="#" @click="chooseItem(scope.row)"
              >选择</a
            >
            <span v-else>已选择</span>
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
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
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
      luckydrawPayments: [
        { name: '积分', value: 'point' }
        // {name: '现金', value: 'cash'}
      ],
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
      rules: {
        luckydraw_name: [{ required: true, message: '请输入抽奖活动名称' }],
        date: [{ required: true, message: '请输入活动时间' }],
        luckydraw_price: [
          { required: true, message: '请输入价格' },
          { pattern: /^(?=.*[1-9])\d+(\.\d{1,2})?$/, message: '现金价格最少0.01' }
        ],
        luckydraw_point: [
          { required: true, message: '请输入积分' },
          { pattern: /^[0-9]*[1-9][0-9]*$/, message: '最少1积分' }
        ],
        luckydraw_store: [
          { required: true, message: '请输入总需人次数' },
          { pattern: /^[0-9]*[1-9][0-9]*$/, message: '最少1个' }
        ],
        description: [{ required: true, message: '请输入描述' }]
      },
      currency: {},
      cursymbol: '￥',
      goodsTypeTitle: '实体类商品'
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.form.item_id) {
            this.$message.error('请选择商品')
            return false
          }
          if (this.luckydraw_id) {
            updateLuckyDrawActivity(this.luckydraw_id, this.form).then(res => {
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: '保存活动成功'
                })
                this.$router.push({ path: '/member/marketing/luckydraw/index' })
              }
            })
          } else {
            createLuckyDrawActivity(this.form).then(res => {
              if (res.data.data) {
                this.$message({
                  type: 'success',
                  message: '新增活动成功'
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
        .then(response => {
          this.itemsLoading = false
          this.itemsList = response.data.data.list
          this.itemsTotalCount = response.data.data.total_count
        })
        .catch(error => {
          this.itemsLoading = false
          this.$message({
            type: 'error',
            message: '获取商品列表列表信息出错'
          })
        })
    },
    getLuckyDrawInfo() {
      getLuckyDrawInfo(this.luckydraw_id)
        .then(response => {
          this.form = response.data.data
          this.form.luckydraw_price = this.form.luckydraw_price / 100
          this.paymentTotalChange()
          this.form.date = [
            new Date(response.data.data.start_time * 1000),
            new Date(response.data.data.end_time * 1000)
          ]
          this.goods = response.data.data.goods
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '获取活动详情失败'
          })
        })
    },
    priceformatter(row, column) {
      return this.cursymbol + row.price / 100
    },
    getCurrencyInfo() {
      getDefaultCurrency().then(res => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    changeGoods(type) {
      switch (type) {
        case 'every':
          this.$set(this.itemsParams, 'consume_type', 'every')
          this.$delete(this.itemsParams, 'item_type')
          this.goodsTypeTitle = '服务类商品'
          break
        case 'normal':
          this.$set(this.itemsParams, 'item_type', 'normal')
          this.$delete(this.itemsParams, 'consume_type')
          this.goodsTypeTitle = '实体类商品'
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
