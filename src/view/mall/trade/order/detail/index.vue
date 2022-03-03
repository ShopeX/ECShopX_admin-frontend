<template>
  <div class="page-order-index" v-loading="loading">
    <el-card class="el-card--normal">
      <div slot="header">订单基本信息</div>
      <el-row class="card-panel">
        <el-col
          class="card-panel-item"
          :span="6"
          v-for="(item, index) in infoList"
          :key="`item__${index}`"
        >
          <span class="card-panel__label">{{ item.label }}</span>
          <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="el-card--normal">
      <div slot="header">客户留言</div>
      <div class="card-panel">
        <span class="card-panel__value">{{ memberRemark }}</span>
      </div>
    </el-card>

    <el-card class="el-card--normal">
      <div slot="header">商家备注</div>
      <div class="card-panel">
        <span class="card-panel__value">{{ merchantRemark }}</span>
      </div>
    </el-card>

    <el-card class="el-card--normal">
      <div slot="header">商品清单</div>
      <div class="card-panel">
        <el-table border :data="orderInfo.items" v-if="orderInfo">
          <el-table-column prop="item_id" label="商品ID" width="80" />
          <el-table-column prop="pic" label="商品图片" width="120">
            <template slot-scope="scope">
              <el-image class="item-image"
                fit="fill"
                :src="`${wximageurl}${scope.row.pic}`"
                ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="item_name" label="商品名称" width="180">
            <template slot-scope="scope">
              <div class="ell3">{{ scope.row.item_name }}</div>
              <el-tag size="mini" type="success" v-if="scope.row.order_item_type == 'gift'"
                >赠品</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="item_spec_desc" label="规格">
            <template slot-scope="scope">
              {{ scope.row.item_spec_desc ? scope.row.item_spec_desc : '单规格' }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价（¥）" width="100">
            <template slot-scope="scope">
              {{ (scope.row.price / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="80"> </el-table-column>
          <el-table-column v-if="orderInfo.type == '1'" prop="price" label="计税单价（¥）" width="120">
            <template slot-scope="scope">
              <span>{{ (scope.row.taxable_fee / 100).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="小计（¥）" width="120">
            <template slot-scope="scope">
              {{ (scope.row.item_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="会员优惠（¥）" width="120">
            <template slot-scope="scope">
              {{ (scope.row.member_discount / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="总支付价（¥）" width="120">
            <template slot-scope="scope">
              {{ (scope.row.total_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="总优惠（¥）" width="100">
            <template slot-scope="scope">
              {{ (scope.row.discount_fee / 100).toFixed(2) }}
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
            <el-table-column label="快递公司" width="150px">
              <template slot-scope="scope">
                <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                  <el-select v-model="scope.row.delivery_corp" placeholder="请选择快递公司">
                    <el-option
                      v-for="item in dlycorps"
                      :key="item.name"
                      :label="item.name"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </span>
                <span v-else>{{ scope.row.delivery_corp_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="快递单号" width="200px">
              <template slot-scope="scope">
                <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                  <el-input
                    v-model="scope.row.delivery_code"
                    :maxlength="20"
                    placeholder="物流公司单号"
                  ></el-input>
                </span>
                <span v-else>{{ scope.row.delivery_code }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="
                    update(scope.row.delivery_corp, scope.row.delivery_code, scope.row)
                  "
                  type="text"
                  size="small"
                >
                  确认修改
                </el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </el-card>

    <el-card class="el-card--normal">
      <div slot="header">支付清单</div>
      <el-row class="card-panel">
        <el-col
          class="card-panel-item"
          :span="6"
          v-for="(item, index) in payList"
          :key="`item__${index}`"
        >
          <span class="card-panel__label">{{ item.label }}</span>
          <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="el-card--normal">
      <div slot="header">优惠明细</div>
      <div class="card-panel">
        <el-table border show-summary sum-text="总计优惠" :data="orderInfo.discount_info" v-if="orderInfo" style="max-width: 1000px;">
          <el-table-column prop="info" label="优惠名称" />
          <el-table-column prop="discount_fee" label="优惠金额（¥）"  />
          <el-table-column prop="rule" label="优惠说明"  />
        </el-table>
      </div>
    </el-card>

    <el-card class="el-card--normal">
      <div slot="header">物流信息</div>
      <div class="card-panel" v-if="orderInfo">
        <div class="card-panel-item">
          <span class="card-panel__label">{{`${orderInfo.receipt_type == 'ziti' ? '自提地址' : '收货人信息'}:`}}</span>
          <span class="card-panel__value">{{addressInfo}}</span>
        </div>
        <el-table border :data="deliveryData">
          <el-table-column prop="delivery_time" label="发货时间" />
          <el-table-column prop="delivery_code" label="物流单号"  />
          <el-table-column prop="delivery_corp_name" label="快递公司"  />
          <el-table-column prop="delivery_corp" label="物流编码"  />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-if="orderInfo.receipt_type === 'logistics'" @click="modifyExpress(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card class="el-card--normal">
      <div slot="header">分润信息</div>
      <el-row class="card-panel">
        <el-col
          class="card-panel-item"
          :span="6"
          v-for="(item, index) in profitList"
          :key="`item__${index}`"
        >
          <span class="card-panel__label">{{ item.label }}</span>
          <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
        </el-col>
      </el-row>
    </el-card>

    <div class="footer-container" v-if="btnActions.length > 0">
      <el-button type="primary" plain v-for="(btn, index) in btnActions" :key="`btn-item__${index}`" @click="handleAction(btn)">{{btn.name}}</el-button>
    </div>

    <!-- 修改物流 -->
    <SpDialog
      ref="expressRef"
      title="修改物流信息"
      v-model="expressDialog"
      :form="expressForm"
      :formList="expressFormList"
      @onSubmit="expressSubmit"
    >
    </SpDialog>

    <!-- 发货 -->
    <SpDialog
      ref="deliverGoodsDialogRef"
      v-model="deliverGoodsDialog"
      :title="`发货【订单:${deliverGoodsForm.order_id}】`"
      :form="deliverGoodsForm"
      :formList="deliverGoodsFormList"
      @onSubmit="deliverGoodsSubmit"
    >
    </SpDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ORDER_TYPE, DISTRIBUTION_TYPE, PROFIT_TYPE, PAY_TYPE, PAY_STATUS } from '@/consts'
import { VERSION_STANDARD } from '@/utils'
import moment from 'moment'

export default {
  data() {
    return {
      infoList: [
        { label: '下单时间:', field: 'create_time' },
        { label: '订单编号:', field: 'order_id' },
        { label: '订单类型:', field: 'order_class' },
        { label: '订单状态:', field: 'order_status_msg' },
        { label: '开票状态:', field: 'is_invoiced' },
        { label: '配送类型:', field: 'receiptTypeTxt' },
        { label: '会员昵称:', field: 'username' },
        { label: '会员手机号:', field: 'mobile' },
        { label: '会员等级:', field: 'memberGrade' },
        { label: '会员折扣:', field: 'memberDiscount' },
        { label: '货币类型:', field: 'fee_type' },
        { label: '购物赠送积分:', field: 'bonus_points' },
        { label: '订单获取积分:', field: 'get_points' },
        { label: '额外获取积分:', field: 'extra_points' }
      ],
      payList: [
        { label: "交易单号:", field: "tradeId" },
        { label: "交易流水号:", field: "transactionId" },
        { label: "商品总额:", field: "goodsPrice" },
        { label: "运费:", field: "freightFee" },
        { label: "会员优惠:", field: "memberDiscountPrice" },
        { label: "优惠券减免:", field: "couponDiscount" },
        { label: "优惠总金额:", field: "totalDiscount" },
        { label: "应付总金额:", field: "totalPrice" },
        { label: "实付总金额:", field: "realPrice" },
        { label: "支付方式:", field: "payTypeTxt" },
        { label: "支付状态:", field: "tradeStateTxt" },
        { label: "交易时间:", field: "timeStart" },
        { label: "交易结束时间:", field: "timeExpire" }
      ],
      profitList: [
        { label: "分润门店类型:", field: "profit_type" },
        { label: "分润总金额:", field: "profit_totalPrice" },
      ],
      memberRemark: '暂无留言',
      merchantRemark: '暂无备注',
      loading: false,
      addressInfo: '',
      orderInfo: null,
      deliveryData: [],
      expressDialog: false,
      expressFormList: [
        {
          label: '快递公司:',
          key: 'delivery_corp',
          placeholder: '请选择快递公司',
          type: 'select',
          options: [],
          required: true,
          message: '不能为空'
        },
        {
          label: '物流单号:',
          key: 'delivery_code',
          type: 'input',
          placeholder: '物流公司单号',
          required: true,
          message: '不能为空'
        }
      ],
      expressForm: {
        orders_delivery_id: '',
        delivery_corp: '',
        delivery_code: ''
      },
      deliverGoodsDialog: false,
      deliverGoodsFormList: [
        {
          label: '发货类型:',
          key: 'delivery_type',
          type: 'radio',
          options: [
            { label: 'batch', name: '整单发货' },
            { label: 'sep', name: '拆分发货' }
          ]
        },
        {
          label: '',
          key: 'items',
          type: 'table',
          options: [
            { title: '商品名', key: 'item_name' },
            { title: '数量', key: 'num', width: 60 },
            { title: '已发货数量', key: 'delivery_item_num', width: 100 },
            { title: '总支付价（¥）', key: 'price', width: 120 }
          ]
        },
        {
          label: '快递公司:',
          key: 'delivery_corp',
          placeholder: '请选择快递公司',
          type: 'select',
          options: [],
          required: true,
          message: '不能为空'
        },
        {
          label: '物流单号:',
          key: 'delivery_code',
          type: 'input',
          placeholder: '物流公司单号',
          required: true,
          message: '不能为空'
        }
      ],
      deliverGoodsForm: {
        order_id: '',
        delivery_type: 'batch',
        delivery_corp: '',
        delivery_code: '',
        type: '',
        items: []
      },
      btnActions: []
    }
  },
  computed: {
    ...mapGetters(['login_type'])
  },
  methods: {
    getFiledValue(key) {
      const { orderInfo } = this
      if (orderInfo) {
        return orderInfo[key]
      }
    },
    async getDetail() {
      this.loading = true
      const { orderInfo, distributor, profit, tradeInfo } = await this.$api.trade.getOrderDetail(this.order_id)
      const { username, mobile, vipgrade, gradeInfo } = await this.$api.member.getMember({ user_id: orderInfo.user_id })
      const deliveryData = await this.$api.trade.getDeliveryLists({ order_id: this.order_id })


      const { create_time, order_class, discount_info, receiver_name, receiver_mobile, 
      receiver_state, receiver_city, receiver_district, receiver_address, receipt_type, 
      distributor_id, order_status, delivery_status } = orderInfo
      const fd = ORDER_TYPE.find(k => k.value == order_class)
      let crossOrderTxt = ''
      if(order_class == 'normal' && orderInfo.type == "1") {
        crossOrderTxt = `（跨境订单）`
      } 

      const fdReceiptType = DISTRIBUTION_TYPE.find(k => k.value == receipt_type)
      let receiptTypeTxt = '普通快递'
      if(fdReceiptType) {
        receiptTypeTxt = fdReceiptType.title
      }

      // 会员等级
      let memberGrade = ''
      if(vipgrade && vipgrade.is_vip) {
        memberGrade = vipgrade.grade_name
      } else {
        memberGrade = gradeInfo ? gradeInfo.grade_name : "无"
      }

      let memberDiscount = ''
      if (gradeInfo && gradeInfo.privileges) {
        memberDiscount = `${100 - gradeInfo.privileges.discount}%`
      }

      this.orderInfo = {
        ...orderInfo,
        create_time: moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        order_class: `${fd ? fd.title : '实体订单'}${crossOrderTxt}`,
        is_invoiced: orderInfo.is_invoiced ? '已开票' :'未开票',
        receiptTypeTxt,
        username,
        mobile,
        memberGrade,
        memberDiscount,
        discount_info: discount_info.filter(item => item.discount_fee > 0),
        profit_type: PROFIT_TYPE[profit.profit_type],
        profit_totalPrice: `¥${profit.total_fee / 100}`,
        ...tradeInfo,
        goodsPrice: orderInfo.order_type != "bargain" ? `¥${(orderInfo.item_fee / 100).toFixed(2)}` : `¥${(orderInfo.item_price / 100).toFixed(2)}`,
        freightFee: `¥${(orderInfo.freight_fee / 100).toFixed(2)}`,
        memberDiscountPrice: `-¥${(orderInfo.member_discount / 100).toFixed(2)}`,
        couponDiscount: `-¥${(orderInfo.coupon_discount / 100).toFixed(2)}`,
        totalDiscount: `-¥${(orderInfo.discount_fee / 100).toFixed(2)}`,
        totalPrice: `¥${(orderInfo.total_fee / 100).toFixed(2)}`,
        realPrice: (() => {
          let returnValue = "";
          if (tradeInfo.payType === "point") {
            returnValue = `￥0`;
          } else if (tradeInfo.tradeState === "NOTPAY") {
            returnValue = `￥0`;
          } else {
            returnValue = `¥${(orderInfo.total_fee / 100).toFixed(2)}`;
          }
          return returnValue;
        })(),
        payTypeTxt: PAY_TYPE[tradeInfo.payType],
        tradeStateTxt: PAY_STATUS[tradeInfo.tradeState],
        timeStart: moment(tradeInfo.timeStart * 1000).format('YYYY-MM-DD HH:mm:ss'),
        timeExpire: moment(tradeInfo.timeExpire * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      this.memberRemark = orderInfo.remark || '暂无留言'
      this.merchantRemark = orderInfo.distributor_remark || '暂无备注'
      this.addressInfo = receipt_type == 'ziti' ? `${distributor.store_name} ${distributor.store_address}` : `${receiver_name} ${receiver_mobile} ${receiver_state}${receiver_city}${receiver_district}${receiver_address}`
      this.deliveryData = deliveryData

      const isDada = receipt_type == 'dada'
      const isLogistics = receipt_type == 'logistics'
      let btnActions = []
      if (VERSION_STANDARD || distributor_id == 0 || this.login_type == 'distributor') {
        if (
          (isLogistics || is_logistics) &&
          !isDada &&
          order_status == 'PAYED' &&
          delivery_status != 'DONE' &&
          receipt_type != 'ziti'
        ) {
          btnActions.push({ name: '发货', key: 'deliverGoods' })
        }
      }
      this.btnActions = btnActions
      this.loading = false
    },
    modifyExpress({ orders_delivery_id }) {
      this.expressForm.orders_delivery_id = orders_delivery_id
      this.expressDialog = true
    },
    async expressSubmit() {
      const { orders_delivery_id, delivery_corp, delivery_code } = this.expressForm
      const params = {
        delivery_corp,
        delivery_code
      };
      await this.$api.trade.editLogisticsList(orders_delivery_id, params)
      this.expressDialog = false
      this.getDetail()
      this.$message.success('修改成功')
    },
    async getLogisticsList() {
      const { list } = await this.$api.trade.getLogisticsList()
      const options = list.map((item) => {
        return {
          title: item.name,
          value: item.value
        }
      })
      this.expressFormList[0].options = options
      this.deliverGoodsFormList[2].options = options
    },
    handleAction({ key }) {
      const { order_id, items, delivery_type } = this.orderInfo
      if(key == 'deliverGoods') {
        this.$refs['deliverGoodsDialogRef'].resetForm()
        this.deliverGoodsForm.order_id = order_id
        this.deliverGoodsForm.items = items.map((item) => {
          return {
            ...item,
            price: item.price / 100
          }
        })
        this.deliverGoodsForm.type = delivery_type
        this.deliverGoodsDialog = true
      }
    },
    async deliverGoodsSubmit() {
      const { order_id, delivery_type, delivery_corp, delivery_code, type } = this.deliverGoodsForm
      const params = {
        order_id,
        delivery_type,
        delivery_corp,
        delivery_code,
        type
      }
      const { delivery_status } = await this.$api.trade.delivery(params)
      this.deliverGoodsDialog = false
      this.getDetail()
      if (delivery_status && delivery_status != 'PENDING') {
        this.$message.success('发货成功!')
      } else {
        this.$message.error('发货失败!')
      }
    },
  },
  mounted() {
    const { orderId, resource, user_id } = this.$route.query
    if (orderId) {
      this.order_id = orderId
    }
    if (resource) {
      this.resource = resource
    }
    if (user_id) {
      this.user_id = user_id
    }
    this.getDetail()
    this.getLogisticsList()
  }
}
</script>

<style scoped lang="scss">

</style>
