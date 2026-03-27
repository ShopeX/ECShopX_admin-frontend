<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white">
    <div v-loading="loading" class="detail-info">
      <h3 class="title">{{ $t('3a4ee48b.8054f7') }}</h3>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <h3>{{ $t('3a4ee48b.168447') }}</h3>
        </div>
        <el-row>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.a1e65c') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.order_id }}
          </el-col>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.0dc090') }}</h4>
          </el-col>
          <el-col :span="5">
            <!-- <span v-if="orderInfo.order_class=='groups'"> 拼团 </span>
          <span v-if="orderInfo.order_class=='bargain'"> 助力 </span>
          <span v-if="orderInfo.order_type=='normal'"> 实体订单<span v-if="orderInfo.type=='1'">-跨境订单</span></span>
          <span v-if="orderInfo.order_type=='service'"> 服务类订单 </span>
          <span v-if="orderInfo.order_type=='bargain'"> 助力订单 </span> -->
            <span> {{ $t('3a4ee48b.b2f2ee') }} </span>
          </el-col>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.5287da') }}</h4>
          </el-col>
          <el-col :span="5">
            <span v-if="orderInfo.order_class == 'drug'">
              <el-tag v-if="orderInfo.order_status_des == 'CANCEL'" type="danger" size="mini">{{
                $t('3a4ee48b.2111cc')
              }}</el-tag>
              <el-tag v-else-if="orderInfo.order_status_des == 'CLOSED'" type="info" size="mini">{{
                $t('3a4ee48b.9c5850')
              }}</el-tag>
              <template v-if="orderInfo.order_status_des != 'CANCEL'">
                <!-- 发货状态 -->
                <el-tag v-if="orderInfo.ziti_status == 'APPROVE'" type="success" size="mini">{{
                  $t('3a4ee48b.871a30')
                }}</el-tag>
                <el-tag v-else type="primary" size="mini">{{ $t('3a4ee48b.5cb424') }}</el-tag>
              </template>
            </span>
            <span v-else-if="orderInfo.order_type == 'bargain'">
              <el-tag
                v-if="scope.row.order_status == 'DONE' || scope.row.order_status == 'PAYED'"
                type="success"
                size="mini"
                >{{ $t('3a4ee48b.fad522') }}</el-tag
              >
              <el-tag v-else-if="scope.row.order_status == 'NOTPAY'" size="mini">{{
                $t('3a4ee48b.608afd')
              }}</el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'CLOSED' || scope.row.order_status == 'CANCEL'"
                type="danger"
                size="mini"
                >{{ $t('3a4ee48b.2111cc') }}</el-tag
              >
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'"
                type="warning"
                size="mini"
                >{{ $t('3a4ee48b.c2335d') }}</el-tag
              >
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_PROCESS'"
                type="warning"
                size="mini"
                >{{ $t('3a4ee48b.73ce8f') }}</el-tag
              >
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_SUCCESS'"
                type="info"
                size="mini"
                >{{ $t('3a4ee48b.d58cbd') }}</el-tag
              >
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_FAIL'"
                type="danger"
                size="mini"
                >{{ $t('3a4ee48b.7c2544') }}</el-tag
              >
            </span>
            <el-tag v-else>
              {{ orderInfo.order_status_msg }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row v-if="memberInfo">
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.a75b05') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ memberInfo.username }}
          </el-col>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.924f2c') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ memberInfo.mobile }}
          </el-col>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.3b9de0') }}</h4>
          </el-col>
          <el-col v-if="memberInfo.vipgrade && memberInfo.vipgrade.is_vip" :span="5">
            {{ memberInfo.vipgrade.grade_name }}
          </el-col>
          <el-col v-else :span="5">
            {{ memberInfo.gradeInfo ? memberInfo.gradeInfo.grade_name : $t('3a4ee48b.d81bb2') }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.fd57fd') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.item_point }}{{ $t('3a4ee48b.9f68a8') }}
            <span v-if="orderInfo.item_fee > 0"
              >+{{ orderInfo.fee_symbol }}{{ orderInfo.item_fee / 100 }}</span
            >
          </el-col>
          <!-- <el-col :span="3" class="content-right"><h4>会员折扣：</h4></el-col>
          <el-col :span="5">- {{orderInfo.fee_symbol}}{{orderInfo.member_discount/100}}</el-col> -->
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.c36d2b') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.fee_type }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.94a6a5') }}</h4>
          </el-col>
          <el-col v-if="orderInfo.freight_type == 'cash'" :span="5">
            {{ orderInfo.fee_symbol }}{{ orderInfo.freight_fee / 100 }}
          </el-col>
          <el-col v-else :span="5"> {{ orderInfo.freight_fee }}{{ $t('3a4ee48b.9f68a8') }} </el-col>
          <!-- <el-col :span="3" class="content-right"><h4>优惠券减免：</h4></el-col>
          <el-col :span="5">- {{orderInfo.fee_symbol}}{{orderInfo.coupon_discount/100}}</el-col> -->
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.c185fb') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.fee_rate }}
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="3" class="content-right"><h4>优惠总金额：</h4></el-col>
          <el-col :span="13">-{{orderInfo.fee_symbol}}{{orderInfo.discount_fee ? orderInfo.discount_fee/100 : 0}}<span class="frm-tips">(包含优惠券，满折，满减等优惠金额)</span></el-col> -->
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.15f438') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.8509c3') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.point }}{{ $t('3a4ee48b.9f68a8')
            }}<span v-if="orderInfo.total_fee > 0">
              + {{ orderInfo.fee_symbol }}{{ orderInfo.total_fee / 100 }}</span
            >
          </el-col>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.3259bb') }}</h4>
          </el-col>
          <el-col v-if="orderInfo.pay_status == 'NOTPAY'" :span="5"> ￥0 </el-col>
          <el-col v-else :span="5">
            {{ orderInfo.point }}{{ $t('3a4ee48b.9f68a8')
            }}<span v-if="orderInfo.total_fee > 0">
              + {{ orderInfo.fee_symbol }}{{ orderInfo.total_fee / 100 }}</span
            >
          </el-col>
          <!-- <el-col :span="5" v-else>{{orderInfo.fee_symbol}}{{orderInfo.total_fee/100}}</el-col> -->
          <!-- <el-col :span="3" class="content-right" v-if="tradeInfo.payType =='point'"><h4>积分支付：</h4></el-col>
          <el-col :span="5" v-if="tradeInfo.payType =='point'">{{orderInfo.point}}</el-col> -->
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.780fb9') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.update_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
        </el-row>
        <el-row v-if="orderInfo.order_type == 'service'">
          <el-col v-if="orderInfo.store_name" :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.260ff8') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.store_name }}
          </el-col>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.74885e') }}</h4>
          </el-col>
          <el-col :span="5">
            <span v-if="orderInfo.order_source == 'member'">{{ $t('3a4ee48b.28af8b') }}</span>
            <span v-else-if="orderInfo.order_source == 'shop'">{{ $t('3a4ee48b.d736b9') }}</span>
          </el-col>
          <div v-if="orderInfo.order_type == 'service' && orderInfo.operator_desc != ''">
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.956826') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.operator_desc }}
            </el-col>
          </div>
        </el-row>
        <el-row v-if="orderInfo.remark">
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.cf7f83') }}</h4>
          </el-col>
          <el-col :span="12">
            {{ orderInfo.remark }}
          </el-col>
        </el-row>
        <el-row
          v-if="
            cancelData &&
            orderInfo.order_status == 'CANCEL' &&
            orderInfo.cancel_status == 'NO_APPLY_CANCEL' &&
            orderInfo.delivery_status != 'DONE' &&
            orderInfo.ziti_status != 'DONE'
          "
        >
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.a6dbda') }}</h4>
          </el-col>
          <el-col :span="12"> {{ $t('3a4ee48b.fa0b1d') }} </el-col>
        </el-row>
        <el-row v-if="cancelData && cancelData.cancel_from == 'buyer' && cancelData.cancel_reason">
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.9934dc') }}</h4>
          </el-col>
          <el-col :span="12">
            {{ cancelData.cancel_reason }}
          </el-col>
        </el-row>
        <el-row v-if="cancelData && cancelData.cancel_from == 'shop' && cancelData.cancel_reason">
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.2683a3') }}</h4>
          </el-col>
          <el-col :span="12">
            {{ cancelData.cancel_reason }}
          </el-col>
        </el-row>
      </el-card>
      <el-card v-if="orderInfo.discount_info && orderInfo.discount_info.length > 0" shadow="never">
        <div slot="header" class="clearfix">
          <h3>{{ $t('3a4ee48b.954493') }}</h3>
        </div>
        <el-row v-for="(item, index) in orderInfo.discount_info" :key="index">
          <template v-if="item.discount_fee > 0">
            <!--
          <el-col :span="3" class="content-right">
            <h4>{{item.type === 'full_discount' ? '满折优惠：' : ''}}</h4>
            <h4>{{item.type === 'full_minus' ? '满减优惠：' : ''}}</h4>
            <h4>{{item.type === 'coupon_discount' ? '优惠券优惠：' : ''}}</h4>
          </el-col>
          -->
            <el-col :span="3" class="content-right"> {{ item.info }}： </el-col>
            <el-col v-if="item.discount_fee > 0" :span="20">
              {{ $t('3a4ee48b.f06ebf') }}{{ orderInfo.fee_symbol
              }}{{ item.discount_fee / 100 }} &nbsp;&nbsp;
              <span class="frm-tips">{{ item.rule }}</span>
            </el-col>
          </template>
        </el-row>
      </el-card>
      <!--      <el-card v-if="tradeInfo.tradeId && tradeInfo.tradeState != 'NOTPAY'" shadow="never">-->
      <!--        <div slot="header" class="clearfix">-->
      <!--          <h3>支付信息</h3>-->
      <!--        </div>-->
      <!--        <div class="section-body">-->
      <!--          <el-row>-->
      <!--            <el-col :span="3" class="content-right">-->
      <!--              <h4>交易单号：</h4>-->
      <!--            </el-col>-->
      <!--            <el-col :span="5">-->
      <!--              {{ tradeInfo.tradeId }}-->
      <!--            </el-col>-->
      <!--            <el-col :span="3" class="content-right">-->
      <!--              <h4>支付状态：</h4>-->
      <!--            </el-col>-->
      <!--            <el-col :span="5">-->
      <!--              <span v-if="tradeInfo.tradeState == 'SUCCESS'"> 支付成功</span>-->
      <!--              <span v-else-if="tradeInfo.tradeState == 'REFUND'">转入退款</span>-->
      <!--              <span v-else-if="tradeInfo.tradeState == 'CANCEL_CLOSED'">已取消</span>-->
      <!--              <span v-else-if="tradeInfo.tradeState == 'REFUND_SUCCESS'">退款成功</span>-->
      <!--              <span v-else-if="tradeInfo.tradeState == 'NOTPAY'">未支付</span>-->
      <!--              <span v-if="tradeInfo.tradeState == 'CLOSED'"> 已关闭</span>-->
      <!--              <span v-else-if="tradeInfo.tradeState == 'REVOKED'">已撤销</span>-->
      <!--              <span v-else-if="tradeInfo.tradeState == 'PAYERROR'"-->
      <!--                >支付失败(其他原因，如银行返回失败)</span-->
      <!--              >-->
      <!--            </el-col>-->
      <!--            <el-col :span="3" class="content-right">-->
      <!--              <h4>交易流水号：</h4>-->
      <!--            </el-col>-->
      <!--            <el-col :span="5">-->
      <!--              {{ tradeInfo.transactionId }}-->
      <!--            </el-col>-->
      <!--          </el-row>-->
      <!--          <el-row>-->
      <!--            <el-col :span="3" class="content-right">-->
      <!--              <h4>实付金额(RMB)：</h4>-->
      <!--            </el-col>-->
      <!--            <el-col v-if="tradeInfo.payType == 'point'" :span="5"> 0 </el-col>-->
      <!--            <el-col v-else :span="5"> ￥{{ tradeInfo.payFee / 100 }} </el-col>-->
      <!--            <div v-if="tradeInfo.payType == 'point'">-->
      <!--              <el-col :span="3" class="content-right">-->
      <!--                <h4>支付积分：</h4>-->
      <!--              </el-col>-->
      <!--              <el-col :span="5">-->
      <!--                {{ tradeInfo.payFee }}-->
      <!--              </el-col>-->
      <!--            </div>-->
      <!--            <el-col :span="3" class="content-right">-->
      <!--              <h4>支付类型：</h4>-->
      <!--            </el-col>-->
      <!--            <el-col :span="5">-->
      <!--              <span v-if="tradeInfo.payType == 'amorepay'"> 微信支付</span>-->
      <!--              <span v-if="tradeInfo.payType == 'wxpaypc'"> 微信PC支付</span>-->
      <!--              <span v-if="tradeInfo.payType == 'wxpay'"> 微信支付</span>-->
      <!--              <span v-if="tradeInfo.payType == 'wxpayh5'"> 微信H5支付</span>-->
      <!--              <span v-if="tradeInfo.payType == 'alipay'"> 支付宝支付</span>-->
      <!--              <span v-if="tradeInfo.payType == 'alipayh5'"> 支付宝H5支付</span>-->
      <!--              <span v-else-if="tradeInfo.payType == 'deposit'"> 余额支付</span>-->
      <!--              <span v-else-if="tradeInfo.payType == 'point'"> 积分支付</span>-->
      <!--              <span v-else-if="tradeInfo.payType == 'pos'"> POS银行卡支付</span>-->
      <!--            </el-col>-->
      <!--          </el-row>-->
      <!--          <el-row>-->
      <!--            <el-col v-if="tradeInfo.couponFee > 0" :span="3" class="content-right">-->
      <!--              <h4>微信卡包代金券：</h4>-->
      <!--            </el-col>-->
      <!--            <el-col v-if="tradeInfo.couponFee > 0" :span="5">-->
      <!--              ¥{{ tradeInfo.couponFee / 100 }}-->
      <!--            </el-col>-->
      <!--            <el-col :span="3" class="content-right">-->
      <!--              <h4>交易时间：</h4>-->
      <!--            </el-col>-->
      <!--            <el-col :span="5">-->
      <!--              {{ tradeInfo.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}-->
      <!--            </el-col>-->
      <!--            <el-col :span="3" class="content-right">-->
      <!--              <h4>交易结束时间：</h4>-->
      <!--            </el-col>-->
      <!--            <el-col :span="5">-->
      <!--              {{ tradeInfo.timeExpire | datetime('YYYY-MM-DD HH:mm:ss') }}-->
      <!--            </el-col>-->
      <!--          </el-row>-->
      <!--        </div>-->
      <!--      </el-card>-->

      <el-card v-if="tradeList.length > 0" shadow="never">
        <div slot="header" class="clearfix">
          <h3>{{ $t('3a4ee48b.02b157') }}</h3>
        </div>
        <div v-for="(item, index) in tradeList" :key="index" class="section-body">
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.84fd75') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ item.tradeId }}
            </el-col>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.97f903') }}</h4>
            </el-col>
            <el-col :span="5">
              <span v-if="item.tradeState == 'SUCCESS'"> {{ $t('3a4ee48b.eb5dc9') }}</span>
              <span v-else-if="item.tradeState == 'REFUND'">{{ $t('3a4ee48b.8e2b9d') }}</span>
              <span v-else-if="item.tradeState == 'CANCEL_CLOSED'">{{
                $t('3a4ee48b.2111cc')
              }}</span>
              <span v-else-if="item.tradeState == 'REFUND_SUCCESS'">{{
                $t('3a4ee48b.d58cbd')
              }}</span>
              <span v-else-if="item.tradeState == 'NOTPAY'">{{ $t('3a4ee48b.608afd') }}</span>
              <span v-if="item.tradeState == 'CLOSED'"> {{ $t('3a4ee48b.9c5850') }}</span>
              <span v-else-if="item.tradeState == 'REVOKED'">{{ $t('3a4ee48b.50239f') }}</span>
              <span v-else-if="item.tradeState == 'PAYERROR'">{{ $t('3a4ee48b.8e51b3') }}</span>
            </el-col>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.92b053') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ item.transactionId }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.277d4a') }}</h4>
            </el-col>
            <el-col v-if="item.payType == 'point'" :span="5"> 0 </el-col>
            <el-col v-else :span="5"> ￥{{ item.payFee / 100 }} </el-col>
            <div v-if="item.payType == 'point'">
              <el-col :span="3" class="content-right">
                <h4>{{ $t('3a4ee48b.dcb6f2') }}</h4>
              </el-col>
              <el-col :span="5">
                {{ item.payFee }}
              </el-col>
            </div>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.be82f5') }}</h4>
            </el-col>
            <el-col :span="5">
              <span v-if="item.payType == 'amorepay'"> {{ $t('3a4ee48b.bffe28') }}</span>
              <span v-if="item.payType == 'wxpaypc'"> {{ $t('3a4ee48b.67a318') }}</span>
              <span v-if="item.payType == 'wxpay'"> {{ $t('3a4ee48b.bffe28') }}</span>
              <span v-if="item.payType == 'wxpayh5'"> {{ $t('3a4ee48b.df7033') }}</span>
              <span v-if="item.payType == 'alipay'"> {{ $t('3a4ee48b.e3b206') }}</span>
              <span v-if="item.payType == 'alipayh5'"> {{ $t('3a4ee48b.5a3c52') }}</span>
              <span v-else-if="item.payType == 'deposit'"> {{ $t('3a4ee48b.89ac23') }}</span>
              <span v-else-if="item.payType == 'point'"> {{ $t('3a4ee48b.accd19') }}</span>
              <span v-else-if="item.payType == 'pos'"> {{ $t('3a4ee48b.d37dec') }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="item.couponFee > 0" :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.7b64af') }}</h4>
            </el-col>
            <el-col v-if="item.couponFee > 0" :span="5"> ¥{{ item.couponFee / 100 }} </el-col>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.3e65b0') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ item.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.256eb8') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ item.timeExpire | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card v-if="orderInfo.invoice" shadow="never">
        <div slot="header" class="clearfix">
          <h3>{{ $t('3a4ee48b.714483') }}</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.16090b') }}</h4>
            </el-col>
            <el-col :span="5">
              <span v-if="orderInfo.invoice.title == 'individual'">
                {{ $t('3a4ee48b.6a0e04') }} </span
              ><span v-else> {{ $t('3a4ee48b.41716f') }} </span>
            </el-col>
          </el-row>
          <el-row v-if="orderInfo.invoice.title != 'individual'">
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.782482') }}</h4>
            </el-col>
            <el-col :span="5">
              <span v-if="orderInfo.invoice.type == 'normal'"> {{ $t('3a4ee48b.56b771') }} </span
              ><span v-else> {{ $t('3a4ee48b.96d7f2') }} </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.6f36dd') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.content }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.426388') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.registration_number }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.727725') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.company_address }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.639baa') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.company_phone }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.60e8fe') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.bankname }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.24e797') }}</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.bankaccount }}
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <h3>{{ $t('3a4ee48b.08ea4e') }}</h3>
        </div>
        <div v-if="orderInfo.order_type == 'service' || orderInfo.order_type == 'bargain'">
          <el-row>
            <el-col :span="3" class="content-right"> {{ $t('3a4ee48b.90f08f') }} </el-col>
            <el-col :span="5">
              {{ orderInfo.title }}
            </el-col>
            <el-col :span="3" class="content-right"> {{ $t('3a4ee48b.65b739') }} </el-col>
            <el-col :span="5">
              {{ orderInfo.item_num }}
            </el-col>
          </el-row>
        </div>
        <div v-else-if="orderInfo.order_type == 'normal'">
          <el-table :data="orderInfo.items" style="width: 100%">
            <el-table-column
              class="goods-img"
              prop="pic"
              :label="$t('3a4ee48b.9b94b1')"
              width="120"
            >
              <template slot-scope="scope">
                <span
                  ><img
                    class="item-image"
                    :src="wximageurl + scope.row.pic"
                    :alt="scope.row.item_name"
                ></span>
              </template>
            </el-table-column>
            <el-table-column prop="item_name" :label="$t('3a4ee48b.90f08f')" width="180">
              <template slot-scope="scope">
                {{ scope.row.item_name
                }}<el-tag v-if="scope.row.order_item_type == 'gift'" size="mini" type="success">
                  {{ $t('3a4ee48b.d017cc') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="item_spec_desc" :label="$t('3a4ee48b.ea887b')" width="180">
              <template slot-scope="scope">
                {{ scope.row.item_spec_desc ? scope.row.item_spec_desc : $t('3a4ee48b.048df4') }}
              </template>
            </el-table-column>
            <el-table-column prop="price" :label="$t('3a4ee48b.da4abd')" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.item_point }}{{ $t('3a4ee48b.9f68a8') }}</span>
                <span v-if="scope.row.price > 0">
                  + {{ scope.row.fee_symbol }}{{ scope.row.price / 100 }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="num" :label="$t('3a4ee48b.0bf60b')" width="180" />
            <!-- <el-table-column  label="总原价(元)">
              <template slot-scope="scope">
                <span>{{scope.row.fee_symbol}}{{scope.row.item_fee / 100}}</span>
              </template>
            </el-table-column> -->
            <el-table-column :label="$t('3a4ee48b.fadbf7')">
              <template slot-scope="scope">
                <span>{{ scope.row.point }}{{ $t('3a4ee48b.9f68a8') }}</span>
                <span v-if="scope.row.total_fee > 0">
                  + {{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span
                >
              </template>
            </el-table-column>
            <!-- <el-table-column  label="总优惠(元)">
              <template slot-scope="scope">
                <span>{{scope.row.fee_symbol}}{{scope.row.discount_fee / 100}}</span>
              </template>
            </el-table-column> -->

            <el-table-column :label="$t('3a4ee48b.8392ba')">
              <template slot-scope="scope">
                <span>{{ scope.row.fee_type }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('3a4ee48b.f8d735')">
              <template slot-scope="scope">
                <span>{{ scope.row.fee_rate }}</span>
              </template>
            </el-table-column>
            <template v-if="orderInfo.delivery_status == 'DONE' && orderInfo.delivery_corp">
              <el-table-column :label="$t('3a4ee48b.c3c7a1')">
                <template slot-scope="scope">
                  <span>{{ $t('3a4ee48b.355409') }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('3a4ee48b.f3af96')">
                <template slot-scope="scope">
                  <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                    <el-select
                      v-model="scope.row.delivery_corp"
                      filterable
                      :placeholder="$t('3a4ee48b.32e586')"
                    >
                      <el-option
                        v-for="item in dlycorps"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </span>
                  <span v-else>{{ scope.row.delivery_corp_name }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('3a4ee48b.3c016d')">
                <template slot-scope="scope">
                  <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                    <el-input
                      v-model="scope.row.delivery_code"
                      :maxlength="20"
                      :placeholder="$t('3a4ee48b.0e9f1e')"
                    />
                  </span>
                  <span v-else>{{ scope.row.delivery_code }}</span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </el-card>
      <el-card v-if="orderInfo.order_class == 'drug'" shadow="never">
        <div slot="header" class="clearfix">
          <h3>{{ $t('3a4ee48b.e7914f') }}</h3>
        </div>
        <el-row>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.9a9bc7') }}</h4>
          </el-col>
          <el-col :span="5">
            {{
              orderInfo.third_params.drug_buyer_id_card
                ? orderInfo.third_params.drug_buyer_id_card
                : $t('3a4ee48b.80f60b')
            }}
          </el-col>
          <div v-if="orderInfo.ziti_status != 'APPROVE' && orderInfo.order_status != 'CANCEL'">
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.654d42') }}</h4>
            </el-col>
            <el-col :span="10">
              <el-radio v-model="form.status" label="true"> {{ $t('3a4ee48b.871a30') }} </el-radio>
              <el-radio v-model="form.status" label="false"> {{ $t('3a4ee48b.146bb2') }} </el-radio>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.aa1bbd') }}</h4>
          </el-col>
          <el-col :span="5">
            {{
              orderInfo.third_params.drug_buyer_name
                ? orderInfo.third_params.drug_buyer_name
                : $t('3a4ee48b.125171')
            }}
          </el-col>
          <div v-if="orderInfo.ziti_status != 'APPROVE' && orderInfo.order_status != 'CANCEL'">
            <div v-if="form.status == 'false'">
              <el-col :span="3" class="content-right">
                <h4>{{ $t('3a4ee48b.2624eb') }}</h4>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="form.reject_reason"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  :placeholder="$t('3a4ee48b.a6e70a')"
                />
              </el-col>
            </div>
            <div v-else>
              <div
                v-if="
                  orderInfo.ziti_status != 'APPROVE' &&
                  orderInfo.order_status != 'CANCEL' &&
                  form.receipt_type == 'ziti' &&
                  form.status == 'true'
                "
              >
                <el-col :span="3" class="content-right">
                  <h4>{{ $t('3a4ee48b.bda45f') }}</h4>
                </el-col>
                <el-col :span="10">
                  <el-select
                    v-model="form.shop_id"
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="$t('3a4ee48b.b69011')"
                    :remote-method="remoteMethod"
                  >
                    <el-option
                      v-for="item in shopsList"
                      :key="item.wxShopId"
                      :label="item.storeName"
                      :value="item.wxShopId"
                    >
                      <span style="float: left">{{ item.storeName }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{
                        item.address
                      }}</span>
                    </el-option>
                  </el-select>
                </el-col>
              </div>
              <!--
              <el-col :span="3" class="content-right"><h4>配送方式：</h4></el-col>
              <el-col :span="10">
                <el-radio v-model="form.receipt_type" label="ziti">门店自提</el-radio>
                <el-radio v-model="form.receipt_type" label="logistics">物流配送</el-radio>
              </el-col>
              -->
            </div>
          </div>
        </el-row>
        <el-row>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.372e0e') }}：</h4>
          </el-col>
          <el-col :span="20">
            <span v-for="(item, index) in orderInfo.third_params.drug_list_image">
              <img class="item-image" :src="item.url" @click="imagedetail(item.url)">
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11"> &nbsp; </el-col>
          <div v-if="orderInfo.ziti_status != 'APPROVE' && orderInfo.order_status != 'CANCEL'">
            <el-col :span="10">
              <el-button type="primary" @click="process"> {{ $t('3a4ee48b.646db0') }} </el-button>
            </el-col>
          </div>
        </el-row>
      </el-card>
      <el-dialog
        v-if="orderInfo.order_class == 'drug'"
        :title="$t('3a4ee48b.372e0e')"
        :visible.sync="dialogVisible"
        width="80%"
      >
        <img v-if="bigImageUrl" :src="bigImageUrl" style="width: 100%; max-width: 100%">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">{{
            $t('3a4ee48b.b15d91')
          }}</el-button>
        </span>
      </el-dialog>
      <el-card v-if="orderInfo.receipt_type || orderInfo.order_type == 'bargain'" shadow="never">
        <div slot="header" class="clearfix">
          <h3>{{ $t('3a4ee48b.24bc07') }}</h3>
        </div>
        <el-row>
          <el-col v-if="orderInfo.receipt_type == 'ziti'" :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.d87411') }}</h4>
          </el-col>
          <el-col v-if="orderInfo.receipt_type == 'ziti'" :span="12">
            {{ distributor.store_name }}
            <span class="frm-tips">{{ distributor.store_address }}</span>
          </el-col>
          <div v-if="orderInfo.receiver_address">
            <el-col :span="3" class="content-right">
              <h4>{{ $t('3a4ee48b.0dd68e') }}</h4>
            </el-col>
            <el-col :span="12">
              {{ orderInfo.receiver_name }} , {{ orderInfo.receiver_mobile }} ,
              {{ orderInfo.receiver_state }}{{ orderInfo.receiver_city
              }}{{ orderInfo.receiver_district }}{{ orderInfo.receiver_address }}
            </el-col>
          </div>
        </el-row>
        <el-row v-if="orderInfo.delivery_status == 'DONE' && orderInfo.delivery_code">
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.f3af96') }}：</h4>
          </el-col>
          <el-col v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'" :span="3">
            <el-select
              v-model="orderInfo.delivery_corp"
              filterable
              :placeholder="$t('3a4ee48b.32e586')"
            >
              <el-option
                v-for="item in dlycorps"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col v-else :span="3">
            {{ dlycorpskn[orderInfo.delivery_corp] }}
            <el-button
              v-if="!orderInfo.delivery_corp == 'OTHER'"
              type="success"
              size="mini"
              @click="deliveryDesc"
            >
              {{ $t('3a4ee48b.6298b4') }}
            </el-button>
          </el-col>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.3c016d') }}：</h4>
          </el-col>
          <el-col v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'" :span="5">
            <el-input
              v-model="orderInfo.delivery_code"
              :maxlength="20"
              :placeholder="$t('3a4ee48b.0e9f1e')"
            />
          </el-col>
          <el-col v-else :span="5">
            {{ orderInfo.delivery_code }}
          </el-col>
          <el-col :span="3" class="content-right">
            <h4>{{ $t('3a4ee48b.8fca68') }}</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.delivery_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col class="content-center">
            <el-button
              v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'"
              @click="updateDeliveryAction"
            >
              修改物流信息
            </el-button>
          </el-col>
        </el-row> -->
      </el-card>
      <el-dialog
        :title="$t('3a4ee48b.6298b4')"
        class="right-dialog"
        :visible.sync="dialog"
        :before-close="handleCancelLabelsDialog"
      >
        <div v-if="this.activities.length > 0" class="block">
          <div class="radio">
            {{ $t('3a4ee48b.899c0c') }}
            <el-radio-group v-model="reverse">
              <el-radio :label="true"> {{ $t('3a4ee48b.825f53') }} </el-radio>
              <el-radio :label="false"> {{ $t('3a4ee48b.58883c') }} </el-radio>
            </el-radio-group>
          </div>
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.AcceptTime"
            >
              {{ activity.AcceptStation }}
            </el-timeline-item>
          </el-timeline>
        </div>
        <div v-else class="block">{{ $t('3a4ee48b.5cc4af') }}</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">{{ $t('3a4ee48b.9d2578') }}</el-button>
        </span>
      </el-dialog>
      <!-- <el-card v-if="typeof(profit.order_id) != 'undefined'" shadow="never">
        <div slot="header" class="clearfix">
          <h3>分润信息</h3>
        </div>
        <el-row>
          <el-col :span="3" class="content-right"><h4>分润门店类型：</h4></el-col>
          <el-col :span="5">
            <span v-if="1 == profit.profit_type">总部分润</span>
            <span v-else-if="2 == profit.profit_type">自营门店分润</span>
            <span v-else-if="3 == profit.profit_type">加盟门店分润</span>
          </el-col>
          <el-col :span="3" class="content-right"><h4>分润总金额：</h4></el-col>
          <el-col :span="13">{{orderInfo.fee_symbol}}{{profit.total_fee / 100}}</el-col>
        </el-row>
        <el-row v-if="profit.seller_id != '0'">
          <el-col :span="3" class="content-right"><h4>拉新导购名称：</h4></el-col>
          <el-col :span="5">{{profit.seller_info.name}}</el-col>
          <el-col :span="3" class="content-right"><h4>拉新导购分润：</h4></el-col>
          <el-col :span="5">{{orderInfo.fee_symbol}}{{profit.seller / 100}}</el-col>
        </el-row>
        <el-row v-if="profit.distributor_id != '0'">
          <el-col :span="3" class="content-right"><h4>拉新店铺名称：</h4></el-col>
          <el-col :span="5">{{profit.distributor_info.name}}</el-col>
          <el-col :span="3" class="content-right"><h4>拉新店铺分润：</h4></el-col>
          <el-col :span="13">{{orderInfo.fee_symbol}}{{profit.distributor / 100}}</el-col>
        </el-row>
        <el-row v-if="profit.popularize_seller_id != '0'">
          <el-col :span="3" class="content-right"><h4>推广导购名称：</h4></el-col>
          <el-col :span="5">{{profit.popularize_seller_info.name}}</el-col>
          <el-col :span="3" class="content-right"><h4>推广导购分润：</h4></el-col>
          <el-col :span="5">{{orderInfo.fee_symbol}}{{profit.popularize_seller / 100}}</el-col>
        </el-row>
      </el-card> -->
      <div class="section-footer content-padded content-center with-border">
        <el-button @click="retrunClick"> {{ $t('3a4ee48b.5f4112') }} </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" type="text/css">
h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 120px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}
.item-image {
  max-width: 80px;
  margin: 0 auto;
}
img {
  max-width: 100px;
  margin: 0 auto;
}
.block {
  margin-left: 85px;
}
.radio {
  margin-bottom: 15px;
}
</style>
<script>
import {
  getOrderDetail,
  updateDelivery,
  processDrugOrders,
  getDeliveryDetail,
  getLogisticsList
} from '@/api/trade'
import { getMember } from '@/api/member'
import { getWxShopsList } from '@/api/shop'
import hqbdlycorp_kname from '@/common/hqbdlycorp_kname.json'
export default {
  data() {
    return {
      dialog: false,
      shopsList: [],
      dialogVisible: false,
      loading: false,
      order_id: '',
      orderInfo: {},
      distributor: {},
      tradeInfo: {},
      tradeList: [],
      cancelData: {},
      profit: {},
      resource: '',
      user_id: 0,
      memberInfo: {
        gradeInfo: {}
      },
      form: {
        status: 'true',
        receipt_type: 'ziti',
        reject_reason: ''
      },
      reverse: true,
      activities: [],
      dlycorpskn: hqbdlycorp_kname,
      bigImageUrl: '',
      dlycorps: [],
      deliveryForm: {
        delivery_type: 'batch',
        order_id: '',
        delivery_corp: '',
        delivery_code: '',
        sepInfo: {}
      }
    }
  },
  mounted() {
    if (this.$route.query.orderId) {
      this.order_id = this.$route.query.orderId
    }
    if (this.$route.query.resource) {
      this.resource = this.$route.query.resource
    }
    if (this.$route.query.user_id) {
      this.user_id = this.$route.query.user_id
    }
    this.getDetail()
    this.getLogisticsList()
  },
  methods: {
    retrunClick() {
      this.$router.go(-1)
    },
    handleCancelLabelsDialog() {
      this.dialog = false
    },
    getMemberInfo(filter) {
      getMember(filter).then((response) => {
        this.memberInfo = response.data.data
      })
    },
    deliveryDesc() {
      this.dialog = true
      let query = {
        delivery_corp: this.orderInfo.delivery_corp,
        delivery_code: this.orderInfo.delivery_code,
        delivery_corp_source: this.orderInfo.delivery_corp_source
      }
      getDeliveryDetail(query).then((response) => {
        this.activities = response.data.data
      })
    },
    getMemberInfo(filter) {
      getMember(filter).then((response) => {
        this.memberInfo = response.data.data
      })
    },
    process() {
      processDrugOrders(this.order_id, this.form).then((res) => {
        this.$message({ type: 'success', message: this.$t('3a4ee48b.94129a') })
        this.getDetail()
      })
    },
    remoteMethod(query) {
      getWxShopsList({
        page: 1,
        pageSize: 100,
        name: query,
        distributor_id: this.orderInfo.distributor_id
      }).then((res) => {
        this.shopsList = res.data.data.list
      })
    },
    getDetail() {
      this.loading = true
      getOrderDetail(this.order_id).then((response) => {
        this.orderInfo = response.data.data.orderInfo
        this.tradeInfo = response.data.data.tradeInfo
        this.tradeList = response.data.data.tradeList
        this.distributor = response.data.data.distributor
        this.cancelData = response.data.data.cancelData
        this.profit = response.data.data.profit
        this.loading = false
        this.getMemberInfo({ user_id: this.orderInfo.user_id })
      })
    },
    imagedetail(imgurl) {
      this.dialogVisible = true
      this.bigImageUrl = imgurl
    },
    getLogisticsList() {
      getLogisticsList().then((res) => {
        this.dlycorps = res.data.data.list
      })
    },
    updateDeliveryAction() {
      // 修改物流信息
      if (this.orderInfo.delivery_corp) {
        this.deliveryForm.delivery_corp = this.orderInfo.delivery_corp
        this.deliveryForm.delivery_code = this.orderInfo.delivery_code
        this.deliveryForm.sepInfo = {}
      } else {
        this.deliveryForm.delivery_type = 'sep'
        this.deliveryForm.sepInfo = JSON.stringify(this.orderInfo.items)
        this.deliveryForm.delivery_corp = ''
        this.deliveryForm.delivery_code = ''
      }
      updateDelivery(this.order_id, this.deliveryForm).then((response) => {
        var deliveryStatus = response.data.data.delivery_status
        if (deliveryStatus && deliveryStatus != 'PENDING') {
          this.$message.success(this.$t('3a4ee48b.687286'))
          this.getDetail()
        } else {
          this.$message.error(this.$t('3a4ee48b.c3691c'))
          return false
        }
      })
    }
  }
}
</script>
