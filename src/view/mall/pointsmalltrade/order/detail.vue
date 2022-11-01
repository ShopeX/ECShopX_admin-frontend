<template>
  <div class="section-white">
    <div
      v-loading="loading"
      class="detail-info"
    >
      <h3 class="title">
        订单详情
      </h3>
      <el-card shadow="never">
        <div
          slot="header"
          class="clearfix"
        >
          <h3>订单基本信息</h3>
        </div>
        <el-row>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>订单号：</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.order_id }}
          </el-col>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>订单类型：</h4>
          </el-col>
          <el-col :span="5">
            <!-- <span v-if="orderInfo.order_class=='groups'"> 拼团 </span>
          <span v-if="orderInfo.order_class=='bargain'"> 助力 </span>
          <span v-if="orderInfo.order_type=='normal'"> 实体订单<span v-if="orderInfo.type=='1'">-跨境订单</span></span>
          <span v-if="orderInfo.order_type=='service'"> 服务类订单 </span>
          <span v-if="orderInfo.order_type=='bargain'"> 助力订单 </span> -->
            <span> 积分订单 </span>
          </el-col>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>订单状态：</h4>
          </el-col>
          <el-col :span="5">
            <span v-if="orderInfo.order_class == 'drug'">
              <el-tag
                v-if="orderInfo.order_status_des == 'CANCEL'"
                type="danger"
                size="mini"
              >已取消</el-tag>
              <el-tag
                v-else-if="orderInfo.order_status_des == 'CLOSED'"
                type="info"
                size="mini"
              >已关闭</el-tag>
              <template v-if="orderInfo.order_status_des != 'CANCEL'">
                <!-- 发货状态 -->
                <el-tag
                  v-if="orderInfo.ziti_status == 'APPROVE'"
                  type="success"
                  size="mini"
                >审核通过</el-tag>
                <el-tag
                  v-else
                  type="primary"
                  size="mini"
                >待审核</el-tag>
              </template>
            </span>
            <span v-else-if="orderInfo.order_type == 'bargain'">
              <el-tag
                v-if="scope.row.order_status == 'DONE' || scope.row.order_status == 'PAYED'"
                type="success"
                size="mini"
              >已完成</el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'NOTPAY'"
                size="mini"
              >未支付</el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'CLOSED' || scope.row.order_status == 'CANCEL'"
                type="danger"
                size="mini"
              >已取消</el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'"
                type="warning"
                size="mini"
              >等待拼团成功</el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_PROCESS'"
                type="warning"
                size="mini"
              >退款处理中</el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_SUCCESS'"
                type="info"
                size="mini"
              >退款成功</el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_FAIL'"
                type="danger"
                size="mini"
              >退款失败</el-tag>
            </span>
            <el-tag v-else>
              {{ orderInfo.order_status_msg }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row v-if="memberInfo">
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>会员姓名：</h4>
          </el-col>
          <el-col :span="5">
            {{ memberInfo.username }}
          </el-col>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>会员手机：</h4>
          </el-col>
          <el-col :span="5">
            {{ memberInfo.mobile }}
          </el-col>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>会员等级：</h4>
          </el-col>
          <el-col
            v-if="memberInfo.vipgrade && memberInfo.vipgrade.is_vip"
            :span="5"
          >
            {{
              memberInfo.vipgrade.grade_name
            }}
          </el-col>
          <el-col
            v-else
            :span="5"
          >
            {{
              memberInfo.gradeInfo ? memberInfo.gradeInfo.grade_name : '无'
            }}
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>商品价格：</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.item_point }}积分
            <span
              v-if="orderInfo.item_fee > 0"
            >+{{ orderInfo.fee_symbol }}{{ orderInfo.item_fee / 100 }}</span>
          </el-col>
          <!-- <el-col :span="3" class="content-right"><h4>会员折扣：</h4></el-col>
          <el-col :span="5">- {{orderInfo.fee_symbol}}{{orderInfo.member_discount/100}}</el-col> -->
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>货币：</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.fee_type }}
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>运费：</h4>
          </el-col>
          <el-col
            v-if="orderInfo.freight_type == 'cash'"
            :span="5"
          >
            {{ orderInfo.fee_symbol }}{{ orderInfo.freight_fee / 100 }}
          </el-col>
          <el-col
            v-else
            :span="5"
          >
            {{ orderInfo.freight_fee }}积分
          </el-col>
          <!-- <el-col :span="3" class="content-right"><h4>优惠券减免：</h4></el-col>
          <el-col :span="5">- {{orderInfo.fee_symbol}}{{orderInfo.coupon_discount/100}}</el-col> -->
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>货币汇率：</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.fee_rate }}
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="3" class="content-right"><h4>优惠总金额：</h4></el-col>
          <el-col :span="13">-{{orderInfo.fee_symbol}}{{orderInfo.discount_fee ? orderInfo.discount_fee/100 : 0}}<span class="frm-tips">(包含优惠券，满折，满减等优惠金额)</span></el-col> -->
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>下单时间：</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>应付总金额：</h4>
          </el-col>
          <el-col
            :span="5"
          >
            {{ orderInfo.point }}积分<span v-if="orderInfo.total_fee > 0">
              + {{ orderInfo.fee_symbol }}{{ orderInfo.total_fee / 100 }}</span>
          </el-col>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>实付总金额：</h4>
          </el-col>
          <el-col
            v-if="orderInfo.pay_status == 'NOTPAY'"
            :span="5"
          >
            ￥0
          </el-col>
          <el-col
            v-else
            :span="5"
          >
            {{ orderInfo.point }}积分<span v-if="orderInfo.total_fee > 0">
              + {{ orderInfo.fee_symbol }}{{ orderInfo.total_fee / 100 }}</span>
          </el-col>
          <!-- <el-col :span="5" v-else>{{orderInfo.fee_symbol}}{{orderInfo.total_fee/100}}</el-col> -->
          <!-- <el-col :span="3" class="content-right" v-if="tradeInfo.payType =='point'"><h4>积分支付：</h4></el-col>
          <el-col :span="5" v-if="tradeInfo.payType =='point'">{{orderInfo.point}}</el-col> -->
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>更新时间：</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.update_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
        </el-row>
        <el-row v-if="orderInfo.order_type == 'service'">
          <el-col
            v-if="orderInfo.store_name"
            :span="3"
            class="content-right"
          >
            <h4>店铺名称：</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.store_name }}
          </el-col>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>订单来源：</h4>
          </el-col>
          <el-col :span="5">
            <span v-if="orderInfo.order_source == 'member'">自主下单</span>
            <span v-else-if="orderInfo.order_source == 'shop'">代客下单</span>
          </el-col>
          <div v-if="orderInfo.order_type == 'service' && orderInfo.operator_desc != ''">
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>操作员：</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.operator_desc }}
            </el-col>
          </div>
        </el-row>
        <el-row v-if="orderInfo.remark">
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>订单备注：</h4>
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
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>取消原因：</h4>
          </el-col>
          <el-col :span="12">
            未支付自动取消
          </el-col>
        </el-row>
        <el-row v-if="cancelData && cancelData.cancel_from == 'buyer' && cancelData.cancel_reason">
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>申请取消原因：</h4>
          </el-col>
          <el-col :span="12">
            {{ cancelData.cancel_reason }}
          </el-col>
        </el-row>
        <el-row v-if="cancelData && cancelData.cancel_from == 'shop' && cancelData.cancel_reason">
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>商家取消原因：</h4>
          </el-col>
          <el-col :span="12">
            {{ cancelData.cancel_reason }}
          </el-col>
        </el-row>
      </el-card>
      <el-card
        v-if="orderInfo.discount_info && orderInfo.discount_info.length > 0"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <h3>优惠明细</h3>
        </div>
        <el-row
          v-for="(item, index) in orderInfo.discount_info"
          :key="index"
        >
          <template v-if="item.discount_fee > 0">
            <!--
          <el-col :span="3" class="content-right">
            <h4>{{item.type === 'full_discount' ? '满折优惠：' : ''}}</h4>
            <h4>{{item.type === 'full_minus' ? '满减优惠：' : ''}}</h4>
            <h4>{{item.type === 'coupon_discount' ? '优惠券优惠：' : ''}}</h4>
          </el-col>
          -->
            <el-col
              :span="3"
              class="content-right"
            >
              {{ item.info }}：
            </el-col>
            <el-col
              v-if="item.discount_fee > 0"
              :span="20"
            >
              优惠{{ orderInfo.fee_symbol }}{{ item.discount_fee / 100 }} &nbsp;&nbsp;
              <span class="frm-tips">{{ item.rule }}</span>
            </el-col>
          </template>
        </el-row>
      </el-card>
      <el-card
        v-if="tradeInfo.tradeId && tradeInfo.tradeState != 'NOTPAY'"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <h3>支付信息</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>交易单号：</h4>
            </el-col>
            <el-col :span="5">
              {{ tradeInfo.tradeId }}
            </el-col>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>支付状态：</h4>
            </el-col>
            <el-col :span="5">
              <span v-if="tradeInfo.tradeState == 'SUCCESS'"> 支付成功</span>
              <span v-else-if="tradeInfo.tradeState == 'REFUND'">转入退款</span>
              <span v-else-if="tradeInfo.tradeState == 'CANCEL_CLOSED'">已取消</span>
              <span v-else-if="tradeInfo.tradeState == 'REFUND_SUCCESS'">退款成功</span>
              <span v-else-if="tradeInfo.tradeState == 'NOTPAY'">未支付</span>
              <span v-if="tradeInfo.tradeState == 'CLOSED'"> 已关闭</span>
              <span v-else-if="tradeInfo.tradeState == 'REVOKED'">已撤销</span>
              <span
                v-else-if="tradeInfo.tradeState == 'PAYERROR'"
              >支付失败(其他原因，如银行返回失败)</span>
            </el-col>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>交易流水号：</h4>
            </el-col>
            <el-col :span="5">
              {{ tradeInfo.transactionId }}
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>实付金额(RMB)：</h4>
            </el-col>
            <el-col
              v-if="tradeInfo.payType == 'point'"
              :span="5"
            >
              0
            </el-col>
            <el-col
              v-else
              :span="5"
            >
              ￥{{ tradeInfo.payFee / 100 }}
            </el-col>
            <div v-if="tradeInfo.payType == 'point'">
              <el-col
                :span="3"
                class="content-right"
              >
                <h4>支付积分：</h4>
              </el-col>
              <el-col :span="5">
                {{ tradeInfo.payFee }}
              </el-col>
            </div>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>支付类型：</h4>
            </el-col>
            <el-col :span="5">
              <span v-if="tradeInfo.payType == 'amorepay'"> 微信支付</span>
              <span v-if="tradeInfo.payType == 'wxpaypc'"> 微信PC支付</span>
              <span v-if="tradeInfo.payType == 'wxpay'"> 微信支付</span>
              <span v-if="tradeInfo.payType == 'wxpayh5'"> 微信H5支付</span>
              <span v-if="tradeInfo.payType == 'alipay'"> 支付宝支付</span>
              <span v-if="tradeInfo.payType == 'alipayh5'"> 支付宝H5支付</span>
              <span v-else-if="tradeInfo.payType == 'deposit'"> 余额支付</span>
              <span v-else-if="tradeInfo.payType == 'point'"> 积分支付</span>
              <span v-else-if="tradeInfo.payType == 'pos'"> POS银行卡支付</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              v-if="tradeInfo.couponFee > 0"
              :span="3"
              class="content-right"
            >
              <h4>微信卡包代金券：</h4>
            </el-col>
            <el-col
              v-if="tradeInfo.couponFee > 0"
              :span="5"
            >
              ¥{{ tradeInfo.couponFee / 100 }}
            </el-col>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>交易时间：</h4>
            </el-col>
            <el-col :span="5">
              {{ tradeInfo.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>交易结束时间：</h4>
            </el-col>
            <el-col :span="5">
              {{ tradeInfo.timeExpire | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card
        v-if="orderInfo.invoice"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <h3>发票信息</h3>
        </div>
        <div class="section-body">
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>发票抬头：</h4>
            </el-col>
            <el-col
              :span="5"
            >
              <span v-if="orderInfo.invoice.title == 'individual'"> 个人 </span><span v-else> 公司 </span>
            </el-col>
          </el-row>
          <el-row v-if="orderInfo.invoice.title != 'individual'">
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>发票类型：</h4>
            </el-col>
            <el-col
              :span="5"
            >
              <span v-if="orderInfo.invoice.type == 'normal'"> 普票 </span><span v-else> 专票 </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>抬头名称：</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.content }}
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>抬头税号：</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.registration_number }}
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>公司地址：</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.company_address }}
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>公司号码：</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.company_phone }}
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>银行名称：</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.bankname }}
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>银行账号：</h4>
            </el-col>
            <el-col :span="5">
              {{ orderInfo.invoice.bankaccount }}
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card shadow="never">
        <div
          slot="header"
          class="clearfix"
        >
          <h3>商品清单</h3>
        </div>
        <div v-if="orderInfo.order_type == 'service' || orderInfo.order_type == 'bargain'">
          <el-row>
            <el-col
              :span="3"
              class="content-right"
            >
              商品名称：
            </el-col>
            <el-col :span="5">
              {{ orderInfo.title }}
            </el-col>
            <el-col
              :span="3"
              class="content-right"
            >
              商品数量：
            </el-col>
            <el-col :span="5">
              {{ orderInfo.item_num }}
            </el-col>
          </el-row>
        </div>
        <div v-else-if="orderInfo.order_type == 'normal'">
          <el-table
            :data="orderInfo.items"
            style="width: 100%"
          >
            <el-table-column
              class="goods-img"
              prop="pic"
              label="商品图片"
              width="120"
            >
              <template slot-scope="scope">
                <span><img
                  class="item-image"
                  :src="wximageurl + scope.row.pic"
                  :alt="scope.row.item_name"
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="item_name"
              label="商品名称"
              width="180"
            >
              <template slot-scope="scope">
                {{ scope.row.item_name
                }}<el-tag
                  v-if="scope.row.order_item_type == 'gift'"
                  size="mini"
                  type="success"
                >
                  赠品
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="item_spec_desc"
              label="规格"
              width="180"
            >
              <template slot-scope="scope">
                {{ scope.row.item_spec_desc ? scope.row.item_spec_desc : '单规格' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价"
              width="180"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.item_point }}积分</span>
                <span v-if="scope.row.price > 0">
                  + {{ scope.row.fee_symbol }}{{ scope.row.price / 100 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="num"
              label="数量"
              width="180"
            />
            <!-- <el-table-column  label="总原价(元)">
              <template slot-scope="scope">
                <span>{{scope.row.fee_symbol}}{{scope.row.item_fee / 100}}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="总支付价">
              <template slot-scope="scope">
                <span>{{ scope.row.point }}积分</span>
                <span v-if="scope.row.total_fee > 0">
                  + {{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column  label="总优惠(元)">
              <template slot-scope="scope">
                <span>{{scope.row.fee_symbol}}{{scope.row.discount_fee / 100}}</span>
              </template>
            </el-table-column> -->

            <el-table-column label="货币">
              <template slot-scope="scope">
                <span>{{ scope.row.fee_type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="货币汇率">
              <template slot-scope="scope">
                <span>{{ scope.row.fee_rate }}</span>
              </template>
            </el-table-column>
            <template v-if="orderInfo.delivery_status == 'DONE' && orderInfo.delivery_corp">
              <el-table-column label="发货状态">
                <template slot-scope="scope">
                  <span>已发货</span>
                </template>
              </el-table-column>
              <el-table-column label="快递公司">
                <template slot-scope="scope">
                  <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                    <el-select
                      v-model="scope.row.delivery_corp"
                      filterable
                      placeholder="请选择快递公司，可搜索"
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
              <el-table-column label="快递单号">
                <template slot-scope="scope">
                  <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                    <el-input
                      v-model="scope.row.delivery_code"
                      :maxlength="20"
                      placeholder="物流公司单号"
                    />
                  </span>
                  <span v-else>{{ scope.row.delivery_code }}</span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </el-card>
      <el-card
        v-if="orderInfo.order_class == 'drug'"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <h3>用药人信息</h3>
        </div>
        <el-row>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>用药人身份证：</h4>
          </el-col>
          <el-col :span="5">
            {{
              orderInfo.third_params.drug_buyer_id_card
                ? orderInfo.third_params.drug_buyer_id_card
                : '未填写身份证信息'
            }}
          </el-col>
          <div v-if="orderInfo.ziti_status != 'APPROVE' && orderInfo.order_status != 'CANCEL'">
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>审核处理：</h4>
            </el-col>
            <el-col :span="10">
              <el-radio
                v-model="form.status"
                label="true"
              >
                审核通过
              </el-radio>
              <el-radio
                v-model="form.status"
                label="false"
              >
                审核拒绝
              </el-radio>
            </el-col>
          </div>
        </el-row>
        <el-row>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>用药人姓名：</h4>
          </el-col>
          <el-col :span="5">
            {{
              orderInfo.third_params.drug_buyer_name
                ? orderInfo.third_params.drug_buyer_name
                : '未填写用药人姓名'
            }}
          </el-col>
          <div v-if="orderInfo.ziti_status != 'APPROVE' && orderInfo.order_status != 'CANCEL'">
            <div v-if="form.status == 'false'">
              <el-col
                :span="3"
                class="content-right"
              >
                <h4>拒绝原因：</h4>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="form.reject_reason"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入审核拒绝原因"
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
                <el-col
                  :span="3"
                  class="content-right"
                >
                  <h4>自提门店：</h4>
                </el-col>
                <el-col :span="10">
                  <el-select
                    v-model="form.shop_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="门店名称关键字"
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
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>纸质处方单：</h4>
          </el-col>
          <el-col :span="20">
            <span v-for="(item, index) in orderInfo.third_params.drug_list_image">
              <img
                class="item-image"
                :src="item.url"
                @click="imagedetail(item.url)"
              >
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
&nbsp;
          </el-col>
          <div v-if="orderInfo.ziti_status != 'APPROVE' && orderInfo.order_status != 'CANCEL'">
            <el-col :span="10">
              <el-button
                type="primary"
                @click="process"
              >
                提交审核
              </el-button>
            </el-col>
          </div>
        </el-row>
      </el-card>
      <el-dialog
        v-if="orderInfo.order_class == 'drug'"
        title="纸质处方单"
        :visible.sync="dialogVisible"
        width="80%"
      >
        <img
          v-if="bigImageUrl"
          :src="bigImageUrl"
          style="width: 100%; max-width: 100%"
        >
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="dialogVisible = false"
          >关闭</el-button>
        </span>
      </el-dialog>
      <el-card
        v-if="orderInfo.receipt_type || orderInfo.order_type == 'bargain'"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <h3>物流信息</h3>
        </div>
        <el-row>
          <el-col
            v-if="orderInfo.receipt_type == 'ziti'"
            :span="3"
            class="content-right"
          >
            <h4>自提地址：</h4>
          </el-col>
          <el-col
            v-if="orderInfo.receipt_type == 'ziti'"
            :span="12"
          >
            {{ distributor.store_name }}
            <span class="frm-tips">{{ distributor.store_address }}</span>
          </el-col>
          <div v-if="orderInfo.receiver_address">
            <el-col
              :span="3"
              class="content-right"
            >
              <h4>收货人信息：</h4>
            </el-col>
            <el-col
              :span="12"
            >
              {{ orderInfo.receiver_name }} , {{ orderInfo.receiver_mobile }} ,
              {{ orderInfo.receiver_state }}{{ orderInfo.receiver_city
              }}{{ orderInfo.receiver_district }}{{ orderInfo.receiver_address }}
            </el-col>
          </div>
        </el-row>
        <el-row v-if="orderInfo.delivery_status == 'DONE' && orderInfo.delivery_code">
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>快递公司：</h4>
          </el-col>
          <el-col
            v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'"
            :span="3"
          >
            <el-select
              v-model="orderInfo.delivery_corp"
              filterable
              placeholder="请选择快递公司，可搜索"
            >
              <el-option
                v-for="item in dlycorps"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col
            v-else
            :span="3"
          >
            {{ dlycorpskn[orderInfo.delivery_corp] }}
            <el-button
              v-if="!orderInfo.delivery_corp == 'OTHER'"
              type="success"
              size="mini"
              @click="deliveryDesc"
            >
              查看物流详情
            </el-button>
          </el-col>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>快递单号：</h4>
          </el-col>
          <el-col
            v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'"
            :span="5"
          >
            <el-input
              v-model="orderInfo.delivery_code"
              :maxlength="20"
              placeholder="物流公司单号"
            />
          </el-col>
          <el-col
            v-else
            :span="5"
          >
            {{ orderInfo.delivery_code }}
          </el-col>
          <el-col
            :span="3"
            class="content-right"
          >
            <h4>发货时间：</h4>
          </el-col>
          <el-col :span="5">
            {{ orderInfo.delivery_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="content-center">
            <el-button
              v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'"
              @click="updateDeliveryAction"
            >
              修改物流信息
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-dialog
        title="物流详情"
        class="right-dialog"
        :visible.sync="dialog"
        :before-close="handleCancelLabelsDialog"
      >
        <div
          v-if="this.activities.length > 0"
          class="block"
        >
          <div class="radio">
            排序：
            <el-radio-group v-model="reverse">
              <el-radio :label="true">
                正序
              </el-radio>
              <el-radio :label="false">
                倒序
              </el-radio>
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
        <div
          v-else
          class="block"
        >
          暂无信息
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialog = false">关 闭</el-button>
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
        <el-button @click="retrunClick">
          返回
        </el-button>
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
} from '../../../../api/trade'
import { getMember } from '../../../../api/member'
import { getWxShopsList } from '@/api/shop'
import hqbdlycorp_kname from '../../../../common/hqbdlycorp_kname.json'
export default {
  data () {
    return {
      dialog: false,
      shopsList: [],
      dialogVisible: false,
      loading: false,
      order_id: '',
      orderInfo: {},
      distributor: {},
      tradeInfo: {},
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
  mounted () {
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
    retrunClick () {
      this.$router.go(-1)
    },
    handleCancelLabelsDialog () {
      this.dialog = false
    },
    getMemberInfo (filter) {
      getMember(filter).then((response) => {
        this.memberInfo = response.data.data
      })
    },
    deliveryDesc () {
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
    getMemberInfo (filter) {
      getMember(filter).then((response) => {
        this.memberInfo = response.data.data
      })
    },
    process () {
      processDrugOrders(this.order_id, this.form).then((res) => {
        this.$message({ type: 'success', message: '审核成功' })
        this.getDetail()
      })
    },
    remoteMethod (query) {
      getWxShopsList({
        page: 1,
        pageSize: 100,
        name: query,
        distributor_id: this.orderInfo.distributor_id
      }).then((res) => {
        this.shopsList = res.data.data.list
      })
    },
    getDetail () {
      this.loading = true
      getOrderDetail(this.order_id).then((response) => {
        this.orderInfo = response.data.data.orderInfo
        this.tradeInfo = response.data.data.tradeInfo
        this.distributor = response.data.data.distributor
        this.cancelData = response.data.data.cancelData
        this.profit = response.data.data.profit
        this.loading = false
        this.getMemberInfo({ 'user_id': this.orderInfo.user_id })
      })
    },
    imagedetail (imgurl) {
      this.dialogVisible = true
      this.bigImageUrl = imgurl
    },
    getLogisticsList () {
      getLogisticsList().then((res) => {
        this.dlycorps = res.data.data.list
      })
    },
    updateDeliveryAction () {
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
          this.$message.success('修改物流信息成功!')
          this.getDetail()
        } else {
          this.$message.error('修改物流信息失败!')
          return false
        }
      })
    }
  }
}
</script>
