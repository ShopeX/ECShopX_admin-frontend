<template>
  <div v-loading="loading" class="page-order-index">
    <el-card class="el-card--normal">
      <div slot="header">订单基本信息</div>
      <el-row class="card-panel">
        <el-col
          v-for="(item, index) in infoList"
          v-if="item.is_show"
          :key="`item__${index}`"
          class="card-panel-item"
          :span="6"
        >
          <span class="card-panel__label">{{ item.label }}</span>
          <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
        </el-col>
      </el-row>
    </el-card>

    <el-card v-if="is_community" class="el-card--normal">
      <div slot="header">跟团信息</div>
      <el-row class="card-panel">
        <el-col
          v-for="(item, index) in communityInfoList"
          v-if="item.is_show"
          :key="`item__${index}`"
          class="card-panel-item"
          :span="6"
        >
          <span class="card-panel__label">{{ item.label }}</span>
          <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
        </el-col>
        <el-col
          v-for="(item, index) in communityExtra"
          :key="`item__${index}`"
          class="card-panel-item"
          :span="6"
        >
          <span class="card-panel__label">{{ index }}：</span>
          <span class="card-panel__value">{{ item }}</span>
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
        <el-table v-if="orderInfo" border :data="orderInfo.items">
          <el-table-column prop="item_id" label="商品ID" width="80" />
          <el-table-column prop="pic" label="商品图片" width="120">
            <template slot-scope="scope">
              <el-image class="item-image" fit="fill" :src="`${wximageurl}${scope.row.pic}`" />
            </template>
          </el-table-column>
          <el-table-column prop="item_name" label="商品名称" width="180">
            <template slot-scope="scope">
              <div class="ell3">
                <el-tag v-if="scope.row.is_prescription == 1" type="primary" size="mini" style="background-color: #fff;">处方药</el-tag>
                {{ scope.row.item_name }}
              </div>
              <el-tag v-if="scope.row.order_item_type == 'gift'" size="mini" type="success">
                赠品
              </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column v-if="orderInfo.prescription_status" prop="instructions" label="处方用量" width="160" /> -->
          <el-table-column prop="item_holder" label="商品类型" width="100">
            <template slot-scope="scope">
              <div class="ell3">
                {{ goodCategoryMap[scope.row.item_holder] }}
              </div>
            </template>
          </el-table-column>

          <!--          <el-table-column prop="item_spec_desc" label="SPU编码">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ scope.row.goods_bn }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column prop="item_spec_desc" label="SKU编码">
            <template slot-scope="scope">
              {{ scope.row.item_bn }}
            </template>
          </el-table-column>
          <el-table-column prop="item_spec_desc" label="规格">
            <template slot-scope="scope">
              {{ scope.row.item_spec_desc ? scope.row.item_spec_desc : '单规格' }}
            </template>
          </el-table-column>

          <el-table-column v-if="orderInfo?.prescription_status" prop="medicine_symptom_set" label="症状" width="160" >
            <template slot-scope="scope">
              <div v-for="item in scope.row.medicine_symptom_set" :key="item.id">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="supplier_name" label="来源供应商" width="120">
            <template slot-scope="scope">
              {{ scope.row.supplier_name ? scope.row.supplier_name : '自营' }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价（¥）" width="100">
            <template slot-scope="scope">
              {{ (scope.row.price / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="cost_price" label="结算价（¥）" width="100">
            <template slot-scope="scope">
              {{ (scope.row.cost_price / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="cost_price" label="成本价（¥）" width="100">
            <template slot-scope="scope">
              {{ (scope.row.cost_price / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="80" />
          <el-table-column
            v-if="orderInfo.type == '1'"
            prop="price"
            label="计税单价（¥）"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ (scope.row.taxable_fee / 100).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="小计（¥）" width="120">
            <template slot-scope="scope">
              {{ (scope.row.item_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="结算小计（¥）" width="120">
            <template slot-scope="scope">
              {{ (scope.row.cost_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="成本小计（¥）" width="120">
            <template slot-scope="scope">
              {{ (scope.row.cost_fee / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column v-if="!VERSION_IN_PURCHASE" label="会员优惠（¥）" width="120">
            <template slot-scope="scope">
              {{ (scope.row.member_discount / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="积分抵扣（¥）" width="120">
            <template slot-scope="scope">
              {{ (scope.row.point_fee / 100).toFixed(2) }}
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
          <el-table-column v-if="!VERSION_IN_PURCHASE && !VERSION_STANDARD" label="货币汇率">
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
            <!-- <el-table-column label="快递公司" width="150px">
              <template slot-scope="scope">
                <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                  <el-select v-model="scope.row.delivery_corp" placeholder="请选择快递公司">
                    <el-option
                      v-for="item in dlycorps"
                      :key="item.name"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </span>
                <span v-else>{{ scope.row.delivery_corp_name }}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="快递单号" width="200px">
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
            </el-table-column> -->
            <!-- <el-table-column v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click.native.prevent="
                    update(scope.row.delivery_corp, scope.row.delivery_code, scope.row)
                  "
                >
                  确认修改
                </el-button>
              </template>
            </el-table-column> -->
          </template>
        </el-table>
      </div>
    </el-card>
    <el-card
      v-if="orderInfo && orderInfo._order_class != 'excard' && !IS_SUPPLIER()"
      class="el-card--normal"
    >
      <div slot="header">支付清单</div>
      <el-row class="card-panel">
        <el-col
          v-for="(item, index) in payList"
          v-if="item.is_show"
          :key="`item__${index}`"
          class="card-panel-item"
          :span="6"
        >
          <span class="card-panel__label">{{ item.label }}</span>
          <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
        </el-col>
      </el-row>
    </el-card>

    <el-card v-if="!VERSION_IN_PURCHASE" class="el-card--normal">
      <el-card v-if="invoice" class="el-card--normal">
        <div slot="header">发票信息</div>
        <div v-if="invoice.title == 'individual'">
          <el-row class="card-panel">
            <el-col
              v-for="(item, index) in invoiceList"
              v-if="item.is_show"
              :key="`item__${index}`"
              class="card-panel-item"
              :span="6"
            >
              <span class="card-panel__label">{{ item.label }}</span>
              <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
            </el-col>
          </el-row>
        </div>
        <div v-if="invoice.title == 'unit'">
          <el-row class="card-panel">
            <el-col
              v-for="(item, index) in invoiceListUnit"
              v-if="item.is_show"
              :key="`item__${index}`"
              class="card-panel-item"
              :span="6"
            >
              <span class="card-panel__label">{{ item.label }}</span>
              <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <div v-if="!IS_SUPPLIER()" slot="header">优惠明细</div>
      <div v-if="!IS_SUPPLIER()" class="card-panel">
        <el-table
          v-if="orderInfo"
          border
          show-summary
          sum-text="总计优惠"
          :data="orderInfo.discount_info"
          style="max-width: 1000px"
        >
          <el-table-column prop="info" label="优惠名称" />
          <el-table-column prop="discount_fee" label="优惠金额（¥）" />
          <el-table-column prop="rule" label="优惠说明" />
        </el-table>
      </div>
    </el-card>

    <!-- 处方药 -->
    <template v-if="orderInfo?.prescription_status">
      <el-card v-if="orderInfo.diagnosis_data && Object.keys(orderInfo.diagnosis_data).length" class="el-card--normal">
        <div slot="header">问诊信息</div>
        <div class="card-panel">
          <el-row>
            <el-col
            v-for="(item, index) in interrogationInfoList"
            v-if="item.is_show"
            :key="`item__${index}`"
            class="card-panel-item"
            :span="6"
          >
            <span class="card-panel__label">{{ item.label }}</span>
            <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
          </el-col>
          </el-row>
        </div>
      </el-card>

      <el-card class="el-card--normal"  v-if="orderInfo.prescription_data && Object.keys(orderInfo.prescription_data).length">
        <div slot="header">处方信息</div>
        <div class="card-panel">
          <el-row>
            <el-col
            v-for="(item, index) in prescriptionInfoList"
            v-if="item.is_show"
            :key="`item__${index}`"
            class="card-panel-item"
            :span="6"
          >
            <span class="card-panel__label">{{ item.label }}</span>
            <div v-if="item.type == 'cycle' ">
              <div class="card-panel__value" v-for='(item1,index1) in orderInfo.prescription_data[item.field]' :key='index1'>
                <div>{{ item1.drugCommonName }}</div>
                <div>用法：{{ item1.instructions }}</div>
              </div>
            </div>
            <span v-if="!item.special" class="card-panel__value">{{ getFiledValue(item.field) }}</span>
            <span v-if="item.special" class="card-panel__value">
              <span v-if="item.field == 'dst_file_path'">
                <el-image
                :src="getFiledValue(item.field)"
                class="img-item"
                :preview-src-list="[getFiledValue(item.field)]"
              />
              </span>
            </span>
          </el-col>
          </el-row>
        </div>
      </el-card>
    </template>


    <el-card class="el-card--normal">
      <div slot="header">物流信息</div>
      <div v-if="orderInfo" class="card-panel">
        <div class="card-panel-item">
          <span class="card-panel__label">{{
            `${orderInfo.receipt_type == 'ziti' ? '自提地址' : '收货人信息'}:`
          }}</span>
          <span class="card-panel__value">{{ addressInfo }}</span>
        </div>

        <div v-if="orderInfo.receipt_type == 'ziti' && orderInfo.ziti_info" class="card-panel-item">
          <span class="card-panel__label">提货人:</span>
          <span class="card-panel__value">{{ orderInfo.receiver_name }}</span>
        </div>
        <div v-if="orderInfo.receipt_type == 'ziti' && orderInfo.ziti_info" class="card-panel-item">
          <span class="card-panel__label">提货时间:</span>
          <span class="card-panel__value">{{
            `${orderInfo.ziti_info.pickup_date} ${orderInfo.ziti_info.pickup_time.join('~')}`
          }}</span>
        </div>
        <div v-if="orderInfo.receipt_type == 'ziti' && orderInfo.ziti_info" class="card-panel-item">
          <span class="card-panel__label">联系电话:</span>
          <span class="card-panel__value">{{ orderInfo.receiver_mobile }}</span>
        </div>

        <div v-if="orderInfo.subdistrict_parent" class="card-panel-item">
          <span class="card-panel__label">街道:</span>
          <span class="card-panel__value">{{ orderInfo.subdistrict_parent }}</span>
        </div>

        <div v-if="orderInfo.subdistrict" class="card-panel-item">
          <span class="card-panel__label">社区:</span>
          <span class="card-panel__value">{{ orderInfo.subdistrict }}</span>
        </div>

        <el-table border :data="deliveryData">
          <el-table-column prop="delivery_time" label="发货时间" />
          <el-table-column prop="delivery_code" label="物流单号" />
          <el-table-column prop="delivery_corp_name" label="快递公司" />
          <el-table-column prop="supplier_name" label="来源供应商" />
          <el-table-column prop="delivery_corp" label="物流编码" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <template v-if="(IS_ADMIN() && scope.row.supplier_id == '0') || !IS_ADMIN()">
                <el-button
                v-if="orderInfo.receipt_type === 'logistics' && orderInfo.order_status !== 'DONE'"
                type="text"
                @click="modifyExpress(scope.row)"
              >
                编辑
              </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card class="el-card--normal">
      <div slot="header">订单追踪</div>
      <div v-if="orderInfo?.self_delivery_operator_name" class="card-panel">
        <div class="card-panel-item">
          <span>配送员姓名：{{ orderInfo.self_delivery_operator_name || '-' }}</span>
          <span class="ml-16"
            >配送员手机号：{{ orderInfo.self_delivery_operator_mobile || '-' }}</span
          >
          <span class="ml-16">配送费：{{ orderInfo.self_delivery_fee / 100 }}元</span>
        </div>
      </div>
      <div class="delivery-log">
        <el-timeline v-if="deliveryLog" :reverse="false">
          <el-timeline-item
            v-for="(key, index) in deliveryLog"
            :key="index"
            :timestamp="key.time | datetime('YYYY-MM-DD HH:mm:ss')"
            placement="top"
          >
            <el-card>
              <p>操作详情：{{ key.msg }}</p>
              <p v-if="key.delivery_remark">配送备注：{{ key.delivery_remark }}</p>
              <div v-if="key.pics?.length">
                配送照片：
                <div class="img-box">
                  <el-image
                    v-for="(item, idx) in key.pics"
                    :key="idx"
                    :src="item"
                    class="img-item"
                    :preview-src-list="key.pics"
                  />
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <!-- <el-card v-if="!VERSION_IN_PURCHASE && !VERSION_PLATFORM" class="el-card--normal">
      <div slot="header">分润信息</div>
      <el-row class="card-panel">
        <el-col
          v-for="(item, index) in profitList"
          :key="`item__${index}`"
          class="card-panel-item"
          :span="6"
        >
          <span class="card-panel__label">{{ item.label }}</span>
          <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
        </el-col>
      </el-row>
    </el-card> -->

    <div v-if="btnActions.length > 0" class="footer-container">
      <el-button
        v-for="(btn, index) in btnActions"
        :key="`btn-item__${index}`"
        type="primary"
        plain
        @click="handleAction(btn)"
      >
        {{ btn.name }}
      </el-button>
    </div>

    <!-- 修改物流 -->
    <SpDialog
      ref="expressRef"
      v-model="expressDialog"
      title="修改物流信息"
      :form="expressForm"
      :form-list="expressFormList"
      @onSubmit="expressSubmit"
    />

    <!-- 发货 -->
    <SpDialog
      ref="deliverGoodsDialogRef"
      v-model="deliverGoodsDialog"
      width="1000px"
      :title="`发货【订单:${deliverGoodsForm.order_id}】`"
      :form="deliverGoodsForm"
      :form-list="deliverGoodsFormList"
      @onSubmit="deliverGoodsSubmit"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ORDER_TYPE,
  ORDER_TYPE_STANDARD,
  DISTRIBUTION_TYPE,
  PROFIT_TYPE,
  PAY_TYPE,
  PAY_STATUS,
  GOOD_CATEGORY_MAP
} from '@/consts'
import { VERSION_STANDARD, VERSION_IN_PURCHASE, IS_SUPPLIER } from '@/utils'
import moment from 'moment'

export default {
  data() {
    return {
      infoList: [
        { label: '下单时间:', field: 'create_time', is_show: true },
        { label: '订单编号:', field: 'order_id', is_show: true },
        { label: '订单类型:', field: 'order_class', is_show: true },
        { label: '订单状态:', field: 'order_status_msg', is_show: true },
        { label: '开票状态:', field: 'is_invoiced', is_show: !this.VERSION_IN_PURCHASE },
        { label: '配送类型:', field: 'receiptTypeTxt', is_show: true },
        { label: '会员昵称:', field: 'username', is_show: true },
        { label: '会员手机号:', field: 'mobile', is_show: true },
        { label: '会员等级:', field: 'memberGrade', is_show: true },
        { label: '会员折扣:', field: 'memberDiscount', is_show: !this.VERSION_IN_PURCHASE },
        { label: '货币类型:', field: 'fee_type', is_show: true },
        { label: '购物赠送积分:', field: 'bonus_points', is_show: !this.VERSION_IN_PURCHASE },
        { label: '订单获取积分:', field: 'get_points', is_show: !this.VERSION_IN_PURCHASE },
        { label: '额外获取积分:', field: 'extra_points', is_show: !this.VERSION_IN_PURCHASE },
        { label: '积分抵扣:', field: 'point_use', is_show: !this.VERSION_IN_PURCHASE },
        { label: '用户身份:', field: 'purchaseRole', is_show: true },
        { label: '销售门店:', field: 'sale_salesman_distributor_id', is_show: true },
        { label: '销售导购:', field: 'salesman_mobile', is_show: true },
        { label: '姓名:', field: 'employee_name', is_show: true },
        { label: '所属企业:', field: 'enterprise_name', is_show: true },
        { label: '来源店铺:', field: 'distributor_name', is_show: true },
      ],
      payList: [
        { label: '交易单号:', field: 'tradeId', is_show: true },
        { label: '交易流水号:', field: 'transactionId', is_show: true },
        { label: '商品总额:', field: 'goodsPrice', is_show: true },
        { label: '运费:', field: 'freightFee', is_show: true },
        { label: '会员优惠:', field: 'memberDiscountPrice', is_show: !this.VERSION_IN_PURCHASE },
        { label: '优惠券减免:', field: 'couponDiscount', is_show: !this.VERSION_IN_PURCHASE },
        { label: '优惠总金额:', field: 'totalDiscount', is_show: !this.VERSION_IN_PURCHASE },
        { label: '积分抵扣金额:', field: 'pointFee', is_show: !this.VERSION_IN_PURCHASE },
        { label: '应付总金额:', field: 'totalPrice', is_show: true },
        { label: '实付总金额:', field: 'realPrice', is_show: true },
        { label: '支付方式:', field: 'payTypeTxt', is_show: true },
        { label: '支付状态:', field: 'tradeStateTxt', is_show: true },
        { label: '交易时间:', field: 'timeStart', is_show: true },
        { label: '交易结束时间:', field: 'timeExpire', is_show: true }
      ],
      profitList: [
        { label: '分润门店类型:', field: 'profit_type' },
        { label: '分润总金额:', field: 'profit_totalPrice' }
      ],
      communityInfoList: [
        { label: '活动名称:', field: 'community_activity_name', is_show: true },
        { label: '所属团长:', field: 'community_chief_name', is_show: true },
        { label: '跟团号:', field: 'community_activity_trade_no', is_show: true }
      ],
      interrogationInfoList: [
        { label: '用药人姓名:', field: 'user_family_name', is_show: true },
        { label: '身份证号:', field: 'user_family_id_card', is_show: true },
        { label: '手机号:', field: 'user_family_phone', is_show: true },
        { label: '用药人年龄:', field: 'user_family_age', is_show: true },
        { label: '用药人性别:', field: 'user_family_gender', is_show: true },
        { label: '与您关系:', field: 'relationship', is_show: true },
        { label: '用药人是否孕妇:', field: 'is_pregnant_woman', is_show: true },
        { label: '用药人是否哺乳期:', field: 'is_lactation', is_show: true },
        { label: '是否使用过此类药物:', field: 'before_ai_result_used_medicine', is_show: true },
        { label: '是否有药物过敏史:', field: 'is_before_ai_result_allergy_history', is_show: true },
        { label: '药物过敏说明:', field: 'before_ai_result_allergy_history', is_show: true },
        { label: '肝肾功能是否有异常:', field: 'before_ai_result_body_abnormal', is_show: true },
      ],
      prescriptionInfoList: [
        { label: '处方ID:', field: 'prescription_id', is_show: true },
        { label: '互联网医院名称:', field: 'hospital_name', is_show: true },
        { label: '580门店ID:', field: 'kuaizhen_store_id', is_show: true },
        { label: '580门店名称:', field: 'kuaizhen_store_name', is_show: true },
        { label: '处方编号:', field: 'serial_no', is_show: true },
        { label: '医生签署时间:', field: 'doctor_sign_time', is_show: true },
        { label: '医生科室:', field: 'doctor_office', is_show: true },
        { label: '医生ID:', field: 'doctor_id', is_show: true },
        { label: '开方医生:', field: 'doctor_name', is_show: true },
        { label: '诊断标签:', field: 'tags', is_show: true },
        { label: '处方状态:', field: 'prescription_in_status', is_show: true },
        // { label: '通用名:', field: 'community_activity_name', is_show: false },
        { label: '创建时间:', field: 'prescription_created', is_show: true },
        { label: '更改时间:', field: 'prescription_updated', is_show: true },
        { label: '备注:', field: 'prescription_memo', is_show: true },
        { label: '补充说明:', field: 'prescription_remarks', is_show: true },
        // { label: '药品用量说明:', field: 'drug_rsp_list', is_show: true },
        { label: '处方审核状态:', field: 'audit_status', is_show: true },
        { label: '审方时间:', field: 'audit_time', is_show: true },
        { label: '审核不通过理由:', field: 'audit_reason', is_show: true },
        { label: '审方药师名称:', field: 'audit_apothecary_name', is_show: true },
        { label: '问诊单ID:', field: 'diagnosis_id', is_show: true },
        { label: '药品用法用量说明:', field: 'drug_rsp_list',type:'cycle',special:true, is_show: true },
        { label: '电子处方单:', field: 'dst_file_path', is_show: true, special:true },
      ],

      memberRemark: '暂无留言',
      merchantRemark: '暂无备注',
      loading: false,
      addressInfo: '',
      orderInfo: null,
      is_community: false,
      communityExtra: [],
      deliveryData: [],
      expressDialog: false,
      expressFormList: [
        {
          label: '快递公司',
          key: 'delivery_corp',
          placeholder: '请选择快递公司',
          type: 'select',
          options: [],
          required: true,
          message: '不能为空'
        },
        {
          label: '物流单号',
          key: 'delivery_code',
          type: 'input',
          placeholder: '物流公司单号',
          required: true,
          message: '不能为空'
        }
      ],

      goodCategoryMap: GOOD_CATEGORY_MAP,
      expressForm: {
        orders_delivery_id: '',
        delivery_corp: '',
        delivery_code: ''
      },
      deliverGoodsDialog: false,
      deliverGoodsFormList: [
        {
          label: '发货类型',
          key: 'delivery_type',
          type: 'radio',
          disabled: false,
          options: [
            { label: 'batch', name: '整单发货' },
            { label: 'sep', name: '拆分发货' }
          ],
          onChange: (e) => {
            if (e == 'sep') {
              this.deliverGoodsFormList[1].options[4].isShow = true
            } else {
              this.deliverGoodsFormList[1].options[4].isShow = false
            }
          }
        },
        {
          label: '',
          key: 'items',
          type: 'table',
          options: [
            { title: '商品名', key: 'item_name' },
            { title: '数量', key: 'num', width: 60 },
            { title: '已发货数量', key: 'delivery_item_num', width: 100 },
            { title: '总支付价（¥）', key: 'price', width: 120 },
            {
              title: '发货数量',
              key: 'item_num',
              width: 160,
              render: (row, column, cell) => {
                if (row.num - row.delivery_item_num == 0) {
                  return '已完成'
                } else {
                  return (
                    <el-input-number
                      size='mini'
                      v-model={row.delivery_num}
                      min={1}
                      max={row.num - row.delivery_item_num}
                      class='cel-input-num'
                    ></el-input-number>
                  )
                }
              },
              isShow: false
            }
          ]
        },
        {
          label: '快递公司',
          key: 'delivery_corp',
          placeholder: '请选择快递公司',
          type: 'select',
          options: [],
          required: true,
          message: '不能为空'
        },
        {
          label: '物流单号',
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
      btnActions: [],
      invoice: null,
      // 发票信息个人
      invoiceList: [
        { label: '类型:', field: 'invoiceType', is_show: true },
        { label: '开票状态:', field: 'is_invoiced', is_show: true },
        { label: '发票抬头:', field: 'invoiceContent', is_show: true }
      ],
      // 发票信息公司
      invoiceListUnit: [
        { label: '类型:', field: 'invoiceType', is_show: true },
        { label: '开票状态:', field: 'is_invoiced', is_show: true },
        { label: '公司名称:', field: 'invoicedCompanyName', is_show: true },
        { label: '税号:', field: 'invoiceRegistrationNumber', is_show: true },
        { label: '电话号码:', field: 'invoicedCompanyPhone', is_show: true },
        { label: '开户银行:', field: 'invoicedBankName', is_show: true },
        { label: '银行账号:', field: 'invoicedBankAccount', is_show: true },
        { label: '公司地址:', field: 'invoiceCompanyAddress', is_show: true }
      ],
      isBindOMS: false,
      deliveryLog: [],
      relationshipMap:{
        1:'本人',
        2:'父母',
        3:'配偶',
        4:'子女',
        5:'其他'
      },
      auditStatusMap:{
        1:'未审核',2:'审核通过',3:'审核不通过',4:'不需要审方'
      }
    }
  },
  computed: {
    ...mapGetters(['login_type'])
  },
  async created() {
    const { result } = await this.$api.trade.isBindOMS()
    this.isBindOMS = result
  },
  mounted() {
    console.log(this.infoList)
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
    this.$api.third.getDmcrmSetting().then((response) => {
      if(response?.is_open){
        this.infoList = this.infoList.map(el =>{
          if(el.label == '订单获取积分'){ 
            el.is_show = false
          }
          return el
        })
      }
    })
    this.getDetail()
    this.getLogisticsList()
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
      const { orderInfo, distributor, profit, tradeInfo } = await this.$api.trade.getOrderDetail(
        this.order_id
      )
      const { username, vipgrade, gradeInfo } = await this.$api.member.getMember({
        user_id: orderInfo.user_id
      })
      const deliveryData = await this.$api.trade.getDeliveryLists({ order_id: this.order_id })

      const {
        create_time,
        order_class,
        discount_info,
        receiver_name,
        receiver_mobile,
        receiver_state,
        receiver_city,
        receiver_district,
        receiver_address,
        receipt_type,
        distributor_id,
        orders_purchase_info,
        order_status,
        delivery_status,
        community_info,
        invoice, // 发票信息对象
        is_invoiced,
        ziti_info,
        prescription_data = {},//处方单信息
        diagnosis_data = {}//问诊单信息
      } = orderInfo

      let invoiceType,
        invoiceContent,
        invoicedCompanyName,
        invoiceRegistrationNumber,
        invoiceCompanyAddress,
        invoicedCompanyPhone,
        invoicedBankName,
        invoicedBankAccount
      if (orderInfo.invoice != null) {
        this.invoice = orderInfo.invoice

        invoiceType = this.invoice.title
        invoiceContent = this.invoice.content
        invoicedCompanyName = this.invoice.content
        invoiceRegistrationNumber = this.invoice.registration_number
        invoiceCompanyAddress = this.invoice.company_address
        invoicedCompanyPhone = this.invoice.company_phone
        invoicedBankName = this.invoice.bankname
        invoicedBankAccount = this.invoice.bankaccount
      }
      let community_activity_name, community_chief_name, community_activity_trade_no
      if (community_info) {
        community_activity_name = community_info.activity_name
        community_chief_name = community_info.chief_name
        community_activity_trade_no = community_info.activity_trade_no
        if (community_info.extra_data) {
          this.communityExtra = JSON.parse(community_info.extra_data)
        }
        this.is_community = true
      }
      const _orderType = this.VERSION_STANDARD ? ORDER_TYPE_STANDARD : ORDER_TYPE
      let fd = _orderType.find((k) => k.value == order_class)

      let crossOrderTxt = ''
      if (order_class == 'normal' && orderInfo.type == '1') {
        crossOrderTxt = `（跨境订单）`
      }

      const fdReceiptType = DISTRIBUTION_TYPE.find((k) => k.value == receipt_type)
      let receiptTypeTxt = '普通快递'
      if (fdReceiptType) {
        receiptTypeTxt = fdReceiptType.title
      }

      // 会员等级
      let memberGrade = ''
      if (vipgrade && vipgrade.is_vip) {
        memberGrade = vipgrade.grade_name
      } else {
        memberGrade = gradeInfo ? gradeInfo.grade_name : '无'
      }

      let memberDiscount = ''
      if (gradeInfo && gradeInfo.privileges) {
        memberDiscount = `${100 - gradeInfo.privileges.discount}%`
      }

      this.orderInfo = {
        ...orderInfo,
        create_time: create_time ? moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '',
        order_class: `${fd ? fd.title : '实体订单'}${crossOrderTxt}`,
        _order_class: orderInfo.order_class,
        is_invoiced: orderInfo.is_invoiced ? '已开票' : '未开票',
        receiptTypeTxt,
        username,
        community_activity_name,
        community_chief_name,
        community_activity_trade_no,
        memberGrade,
        memberDiscount,
        discount_info: discount_info
          ? discount_info
              .filter((item) => item.discount_fee > 0)
              .map((item) => {
                return {
                  ...item,
                  discount_fee: item.discount_fee / 100
                }
              })
          : [],
        profit_type: PROFIT_TYPE[profit.profit_type],
        profit_totalPrice: profit.total_fee ? `¥${profit.total_fee / 100}` : '￥0.00',
        ...tradeInfo,
        mobile: orderInfo.mobile,
        goodsPrice:
          orderInfo.order_type != 'bargain'
            ? orderInfo.item_fee
              ? `¥${(orderInfo.item_fee / 100).toFixed(2)}`
              : '￥0.00'
            : orderInfo.item_price
            ? `¥${(orderInfo.item_price / 100).toFixed(2)}`
            : '￥0.00',
        freightFee: orderInfo.freight_fee || orderInfo.freight_point_fee
          ? `¥${(((orderInfo.freight_fee || 0) + (orderInfo.freight_point_fee || 0))/ 100).toFixed(2)}`
          : '￥0.00',
        memberDiscountPrice: orderInfo.member_discount
          ? `-¥${(orderInfo.member_discount / 100).toFixed(2)}`
          : '￥0.00',
        couponDiscount: orderInfo.coupon_discount
          ? `-¥${(orderInfo.coupon_discount / 100).toFixed(2)}`
          : '￥0.00',
        totalDiscount: orderInfo.discount_fee
          ? `-¥${(orderInfo.discount_fee / 100).toFixed(2)}`
          : '￥0.00',
        totalPrice: orderInfo.total_fee ? `¥${(orderInfo.total_fee / 100).toFixed(2)}` : '￥0.00',
        pointFee: orderInfo.point_fee ? `¥${(orderInfo.point_fee / 100).toFixed(2)}` : '￥0.00',
        realPrice: (() => {
          let returnValue = ''
          if (tradeInfo.payType === 'point') {
            returnValue = `￥0`
          } else if (tradeInfo.tradeState === 'NOTPAY') {
            returnValue = `￥0`
          } else {
            returnValue = orderInfo.total_fee
              ? `¥${(orderInfo.total_fee / 100).toFixed(2)}`
              : '￥0.00'
          }
          return returnValue
        })(),
        payTypeTxt: tradeInfo.payChannel
          ? PAY_TYPE[tradeInfo.payChannel]
          : PAY_TYPE[tradeInfo.payType],
        tradeStateTxt: PAY_STATUS[tradeInfo.tradeState],
        timeStart: tradeInfo.timeStart
          ? moment(tradeInfo.timeStart * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        timeExpire: tradeInfo.timeExpire
          ? moment(tradeInfo.timeExpire * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        invoiceType: invoiceType == 'individual' ? '个人' : '企业',
        invoiceContent,
        invoicedCompanyName,
        invoiceRegistrationNumber,
        invoiceCompanyAddress,
        invoicedCompanyPhone,
        invoicedBankName,
        invoicedBankAccount,
        purchaseRole:orders_purchase_info ? orders_purchase_info.type == 'employee' ? '员工' : '亲友' : '',
        employee_name: orders_purchase_info ? orders_purchase_info.employee_name  : '',
        enterprise_name: orders_purchase_info ? orders_purchase_info.enterprise_name  : '',
        //处方药
        user_family_name:diagnosis_data.user_family_name,
        user_family_id_card:diagnosis_data.user_family_id_card,
        user_family_phone:diagnosis_data.user_family_phone,
        user_family_age:diagnosis_data.user_family_age,
        user_family_gender:diagnosis_data.user_family_gender == 1 ? '男' : '女',
        relationship:this.relationshipMap[diagnosis_data.relationship],
        is_pregnant_woman:diagnosis_data.is_pregnant_woman == 1 ? '是' : '否',
        is_lactation:diagnosis_data.is_lactation == 1 ? '是' : '否',
        before_ai_result_used_medicine:diagnosis_data?.before_ai_data_list?.before_ai_result_used_medicine == 1 ? '是' : '否',
        is_before_ai_result_allergy_history:diagnosis_data?.before_ai_data_list?.before_ai_result_allergy_history ? '是' : '否',
        before_ai_result_allergy_history:diagnosis_data?.before_ai_data_list?.before_ai_result_allergy_history,
        before_ai_result_body_abnormal:diagnosis_data?.before_ai_data_list?.before_ai_result_body_abnormal == 1 ? '是' : '否',

        prescription_id:prescription_data.id,
        hospital_name:prescription_data.hospital_name,
        kuaizhen_store_id:prescription_data.kuaizhen_store_id,
        kuaizhen_store_name:prescription_data.kuaizhen_store_name,
        doctor_sign_time:prescription_data.doctor_sign_time
          ? moment(prescription_data.doctor_sign_time * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        doctor_office:prescription_data.doctor_office,
        doctor_id:prescription_data.doctor_id,
        doctor_name:prescription_data.doctor_name,
        tags:prescription_data.tags,
        prescription_in_status:prescription_data.status == 1 ? '正常' : '废弃',
        prescription_created:prescription_data.created
          ? moment(prescription_data.created * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        prescription_updated:prescription_data.updated
          ? moment(prescription_data.updated * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        prescription_remarks:prescription_data.remarks,
        drug_rsp_list:prescription_data.drug_rsp_list,//
        audit_status:this.auditStatusMap[prescription_data.audit_status],
        audit_reason:prescription_data.audit_reason,
        audit_apothecary_name:prescription_data.audit_apothecary_name,
        diagnosis_id:prescription_data.diagnosis_id,
        serial_no:prescription_data.serial_no,
        audit_time:prescription_data.audit_time ? moment(prescription_data.audit_time * 1000).format('YYYY-MM-DD HH:mm:ss')
        : '',
        dst_file_path:prescription_data.dst_file_path,
        sale_salesman_distributor_id:orderInfo?.sale_salesman_distributor_info?.name,
        salesman_mobile:orderInfo?.salespersonInfo?.work_userid,
      }



      this.deliveryLog = this.orderInfo?.app_info?.delivery_log
      this.memberRemark = orderInfo.remark || '暂无留言'
      this.merchantRemark = orderInfo.distributor_remark || '暂无备注'
      // debugger
      // this.addressInfo =
      //   receipt_type == 'ziti'
      //     ? `${distributor.store_name} ${distributor.store_address}`
      //     :

      if (orderInfo.order_class == 'excard') {
        // 兑换订单
        this.addressInfo = `${distributor.province}${distributor.city}${distributor.area}${distributor.address}`
      } else if (orderInfo.order_class == 'shopadmin') {
        // 门店订单
        this.addressInfo = `${distributor.store_address}（${distributor.store_name}）`
      } else {
        // 普通订单配送方式是自提时，展示自提点，非自提展示收货地址
        const { province, city, area, address, name: zitiName } = ziti_info || {}
        this.addressInfo =
          distributor.store_address && receipt_type == 'ziti'
            ? `${province}${city}${area}${address}（${zitiName}）`
            : receipt_type != 'ziti'
            ? `${receiver_name} ${receiver_mobile} ${receiver_state}${receiver_city}${receiver_district}${receiver_address}`
            : '-- --'
      }
      this.deliveryData = deliveryData

      const isDada = receipt_type == 'dada'
      const isLogistics = receipt_type == 'logistics'
      let btnActions = []
      if (VERSION_STANDARD || distributor_id == 0 || this.login_type == 'distributor') {
        if (
          isLogistics &&
          !isDada &&
          order_status == 'PAYED' &&
          delivery_status != 'DONE' &&
          receipt_type != 'ziti' &&
          this.login_type == 'supplier'
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
      }
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
      const { order_id, items, delivery_type, delivery_status } = this.orderInfo
      if (key == 'deliverGoods') {
        if (this.isBindOMS && this.IS_ADMIN()) {
          return this.$message.warning('请至OMS处理订单发货')
        }
        this.$refs['deliverGoodsDialogRef'].resetForm()
        this.deliverGoodsForm.order_id = order_id
        this.deliverGoodsForm.items = items.map((item) => {
          return {
            ...item,
            price: item.price / 100
          }
        })
        this.deliverGoodsForm.type = delivery_type
        // 部分发货
        if (delivery_status == 'PARTAIL') {
          this.deliverGoodsForm.delivery_type = 'sep'
          this.deliverGoodsFormList[0].disabled = true
          this.deliverGoodsFormList[1].options[4].isShow = true
        } else {
          this.deliverGoodsFormList[0].disabled = false
          this.deliverGoodsFormList[1].options[4].isShow = false
        }
        this.deliverGoodsDialog = true
      }
    },
    async deliverGoodsSubmit() {
      const { order_id, delivery_type, delivery_corp, delivery_code, type, items } =
        this.deliverGoodsForm
      const params = {
        order_id,
        delivery_type,
        delivery_corp,
        delivery_code,
        type
      }
      // 拆单发货
      if (delivery_type == 'sep') {
        params['sepInfo'] = JSON.stringify(items.filter((item) => item.delivery_num))
      }
      const { delivery_status } = await this.$api.trade.delivery(params)
      this.deliverGoodsDialog = false
      this.getDetail()
      if (delivery_status && delivery_status != 'PENDING') {
        this.$message.success('发货成功!')
      } else {
        this.$message.error('发货失败!')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.delivery-log {
  margin-top: 16px;
}
.img-box {
  display: flex;
  flex-wrap: wrap;
}
.img-item {
  width: 150px;
  height: 150px;
  margin: 0 20px 20px 0;
}
.ml-16 {
  margin-left: 16px;
}
</style>
