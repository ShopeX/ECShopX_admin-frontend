<template>
  <!-- <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('process') === -1"> -->
  <SpRouterView>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" placeholder="请输入客户手机号码" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" label="订单号:">
        <el-input v-model="params.order_id" placeholder="请输入订单号" />
      </SpFilterFormItem>
      <!-- <SpFilterFormItem
        v-if="login_type != 'merchant' && !VERSION_B2C && !VERSION_IN_PURCHASE"
        prop="salesman_mobile"
        label="导购手机号:"
      >
        <el-input v-model="params.salesman_mobile" placeholder="请输入导购手机号码" />
      </SpFilterFormItem> -->
      <SpFilterFormItem v-if="!isMicorMall" prop="receipt_type" label="配送方式:">
        <el-select v-model="params.receipt_type" clearable placeholder="请选择">
          <el-option
            v-for="item in distributionType"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!VERSION_IN_PURCHASE" prop="source" label="订单来源:">
        <el-select v-model="params.source" clearable placeholder="请选择">
          <el-option
            v-for="item in orderSourceList"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="supplier_name"  v-if="VERSION_STANDARD || IS_ADMIN()" label="来源供应商:">
        <el-input v-model="params.supplier_name" placeholder="来源供应商" />
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!VERSION_IN_PURCHASE" prop="order_class" label="订单类型:">
        <el-select v-model="params.order_class" clearable placeholder="请选择">
          <el-option
            v-for="item in orderType"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!VERSION_IN_PURCHASE" prop="delivery_staff_id" label="配送员:">
        <el-select v-model="params.delivery_staff_id" clearable placeholder="请选择">
          <el-option
            v-for="item in deliveryPersonnel"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="salespersonname" label="业务员:">
        <el-input v-model="params.salespersonname" placeholder="请输入业务员" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" label="下单时间:" size="max">
        <el-date-picker
          v-model="params.create_time"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          prefix-icon="null"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="!isMicorMall && !VERSION_IN_PURCHASE"
        prop="is_invoiced"
        label="开票状态:"
      >
        <el-select v-model="params.is_invoiced" clearable placeholder="请选择">
          <el-option
            v-for="item in invoiceStatus"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="delivery_time" label="发货时间:" size="max">
        <el-date-picker
          v-model="params.delivery_time"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          prefix-icon="null"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <!-- v-if="!VERSION_STANDARD && !VERSION_IN_PURCHASE" -->
      <SpFilterFormItem
        prop="order_holder"
        label="订单分类:"
      >
        <el-select v-model="params.order_holder" clearable placeholder="请选择">
          <el-option
            v-for="item in orderCategory"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="(!isMicorMall || login_type != 'distributor') && !VERSION_B2C && !VERSION_IN_PURCHASE"
        prop="distributor_id"
        label="来源店铺:"
      >
        <SpSelectShop v-model="params.distributor_id" clearable placeholder="请选择" />
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!VERSION_IN_PURCHASE" prop="subDistrict" label="选择街道:">
        <el-cascader
          v-model="params.subDistrict"
          clearable
          :props="{
            value: 'id',
            checkStrictly: true
          }"
          :options="subDistrictList"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="self_delivery_status" label="配送状态:">
        <el-select v-model="params.self_delivery_status" clearable placeholder="请选择">
          <el-option
            v-for="item in distributionStatus"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>


    <div class="action-container">
      <el-dropdown>
        <el-button type="primary" plain>
          导出<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <export-tip @exportHandle="exportInvoice"> 未开票订单 </export-tip>
          </el-dropdown-item>
          <el-dropdown-item>
            <export-tip @exportHandle="exportDataMaster"> 主订单 </export-tip>
          </el-dropdown-item>
          <el-dropdown-item>
            <export-tip @exportHandle="exportDataNormal"> 子订单 </export-tip>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip
        v-if="IS_SUPPLIER()"
        effect="light"
        content="请将从订单列表导出的主订单文件，删除不想批量发货的订单号，修改物流公司，物流单号后上传即可。"
        placement="top-start"
      >
        <el-upload
          action=""
          class="btn-upload"
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button type="primary" plain> 批量发货 </el-button>
        </el-upload>
      </el-tooltip>
      <el-upload
        action=""
        class="btn-upload"
        :on-change="uploadHandlePatchCancel"
        :auto-upload="false"
        :show-file-list="false"
      >
        <el-button type="primary" plain> 批量取消 </el-button>
      </el-upload>
       <!-- v-if="IS_DISTRIBUTOR() || IS_MERCHANT()" -->
      <el-button type="primary" plain @click="assignPersonnel(true)"> 分配配送员 </el-button>
      <!-- <el-upload
        action=""
        class="btn-upload"
        :on-change="uploadHandlePatchCancel"
        :auto-upload="false"
        :show-file-list="false"
      > -->
      <!-- v-if="IS_DISTRIBUTOR || IS_ADMIN" -->
        <el-button  type="primary" plain @click="assignPersonnel(false)"> 取消配送 </el-button>
      <!-- </el-upload> -->
    </div>

    <el-tabs v-model="params.order_status" type="card" @tab-click="onSearch">
      <el-tab-pane
        v-for="item in orderStatus"
        :key="item.value"
        :label="item.title"
        :name="item.value"
      />
      <el-table v-loading="loading" border :data="tableList" @selection-change="handleSelectionChange">
        <el-table-column width="180" prop="order_id" label="订单号">
          <template slot-scope="scope">
            <div class="order-num">
              {{ scope.row.order_id }}
              <el-tooltip effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.order_id"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div class="order-store">
              <el-tooltip effect="dark" content="来源店铺" placement="top-start">
                <i class="el-icon-office-building" />
              </el-tooltip>
              {{ scope.row.distributor_name }}
            </div>
            <div class="order-time">
              <el-tooltip effect="dark" content="下单时间" placement="top-start">
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="original_order_id" width="160" label="原单号" align="right" header-align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.original_order_id ? scope.row.original_order_id : scope.row.order_id }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column width="160" label="所属供应商">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.supplier_info.username }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          width="120"
          label="订单分类"
          header-align="center"
          prop="order_holder"
        >
        <template slot-scope="scope">
            {{  getOrderCategoryName(scope.row.order_holder) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="total_fee"
          width="120"
          label="订单金额（¥）"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ (scope.row.total_fee / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="point_fee"
          width="120"
          label="积分抵扣"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ (scope.row.point_fee / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="cost_fee"
          width="120"
          label="结算价（¥）"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ (scope.row.cost_fee / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column width="100" label="运费（¥）" align="right" header-align="center">
          <template slot-scope="scope">
            {{ (scope.row.freight_fee || 0) / 100 }}
          </template>
        </el-table-column>

        <el-table-column prop="mobile" label="业务员">
          <template slot-scope="scope">
            <div class="order-num">

            {{ scope.row.salesman_mobile }}
            <el-tooltip
                v-if="datapass_block == 0"
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.salesman_mobile"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
            </el-tooltip>
          </div>
            <div class="order-num">
            {{ scope.row.salesman_name }}
            <el-tooltip
                v-if="datapass_block == 0"
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.salesman_name"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
            </el-tooltip>
          </div>
          </template>

        </el-table-column>
        <el-table-column prop="mobile" label="客户手机号">
          <template slot-scope="scope">
            <template v-if="!scope.row.user_delete && login_type !== 'merchant'">
              <router-link
                v-if="login_type != 'distributor' && login_type != 'supplier'"
                target="_blank"
                :to="{
                  path: `${
                    login_type != 'distributor'
                      ? '/member/member/detail'
                      : '/shopadmin/member/member/detail'
                  }`,
                  query: { user_id: scope.row.user_id }
                }"
              >
                {{ scope.row.receiver_mobile }}
              </router-link>
              <span v-else>
                {{ scope.row.receiver_mobile }}
              </span>
              <el-tooltip
                v-if="datapass_block == 0"
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.receiver_mobile"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
            <template v-else slot-scope="scope">
              <span>{{ scope.row.receiver_mobile }}</span>
              <el-tooltip
                v-if="datapass_block == 0"
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.receiver_mobile"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="distributor_name" label="来源店铺" >
      </el-table-column>
      <!-- <el-table-column prop="supplier_name" v-if="VERSION_STANDARD || IS_ADMIN()" label="来源供应商" >
      </el-table-column> -->
        <!-- <el-table-column prop="receiver_name" label="收货人" /> -->
        <template v-if="login_type != 'merchant'">
          <el-table-column v-if="!isMicorMall" label="订单类型">
            <template slot-scope="scope">
              {{ getOrderType(scope.row) }}
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="order_status" label="订单状态">
          <template slot-scope="scope">
            {{ scope.row.order_status_msg }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="salespersonname " label="业务员"></el-table-column> -->
        <el-table-column label="配送方式">
          <template slot-scope="scope">
            {{ getDistributionType(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column label="配送状态">
          <template slot-scope="scope">
            {{ getDistributionStatus(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column label="配送员">
          <template slot-scope="scope">
            {{ scope.row.self_delivery_operator_name }}
          </template>
        </el-table-column>

        <el-table-column label="配送费">
          <template slot-scope="scope">
            {{ scope.row.self_delivery_operator_name && scope.row.self_delivery_fee / 100 + '元' }}
          </template>
        </el-table-column>

        <el-table-column label="配送员电话">
          <template slot-scope="scope">
            {{ scope.row.self_delivery_operator_mobile }}
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" fixed="left" />
        <!-- <el-table-column prop="source_name" label="来源"></el-table-column> -->
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" style="margin-right: 8px">
              <router-link
                :to="`${$route.path}/detail?orderId=${scope.row.order_id}&resource=${$route.path}`"
              >
                详情
              </router-link>
            </el-button>
            <el-popover placement="right" trigger="hover">
              <div class="operating-icons">
                <el-button type="text">
                  <router-link
                    :to="`${$route.path}/process?orderId=${scope.row.order_id}&resource=${$route.path}`"
                  >
                    日志
                  </router-link>
                </el-button>
                <template v-for="(btn, index) in scope.row.actionBtns">
                  <el-button
                    :key="`btn-item__${index}`"
                    type="text"
                    @click="handleAction(scope.row, btn)"
                  >
                    {{ btn.name }}
                  </el-button>
                </template>
              </div>
              <el-button slot="reference" type="text">
                更多<i class="iconfont icon-angle-double-right" />
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="content-padded content-center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="page.pageIndex"
          :page-sizes="[10, 20, 50]"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
        />
      </div>
    </el-tabs>

    <!-- 备注 -->
    <SpDialog
      ref="remarkDialogRef"
      v-model="remarkDialog"
      :title="`修改备注【订单:${remarkForm.orderId}】`"
      :form="remarkForm"
      :form-list="remarkFormList"
      @onSubmit="onRemarkSubmit"
    />

    <!-- 取消订单 -->
    <SpDialog
      ref="cancelOrderDialogRef"
      v-model="cancelOrderDialog"
      class="dialog-cancelorder"
      :title="`取消订单【订单:${cancelOrderForm.order_id}】`"
      :loading="cancelOrderForm.loading"
      :form="cancelOrderForm"
      :form-list="cancelOrderFormList"
      @onSubmit="onCancelOrderSubmit"
    />

    <!-- 发货 -->
    <SpDialog
      ref="deliverGoodsDialogRef"
      v-model="deliverGoodsDialog"
      width="1000px"
      :confirm-status="confirmStatus"
      :title="`发货【订单:${deliverGoodsForm.order_id}】`"
      :form="deliverGoodsForm"
      :form-list="deliverGoodsFormList"
      @onSubmit="deliverGoodsSubmit"
    />

    <!-- 更新发货 -->
    <SpDialog
      ref="updateDeliverGoodsDialogRef"
      v-model="updateDeliverGoodsDialog"
      width="1000px"
      :title="`更新发货【订单:${updateDeliverGoodsForm.order_id}】`"
      :form="updateDeliverGoodsForm"
      :form-list="updateDeliverGoodsFormList"
      @onSubmit="updateDeliverGoodsSubmit"
    />

    <!-- 核销 -->
    <SpDialog
      ref="writeOffDialogRef"
      v-model="writeOffDialog"
      :title="`核销【订单:${writeOffForm.order_id}】`"
      :form="writeOffForm"
      :form-list="writeOffFormList"
      @onSubmit="writeOffSubmit"
    />

    <!-- 退款审核 -->
    <SpDialog
      ref="refundRef"
      v-model="refundDialog"
      :title="`退款【订单:${refundForm.order_id}】`"
      :form="refundForm"
      :form-list="refundFormList"
      @onSubmit="refundSubmit"
    />

    <!-- 订单改价 -->
    <SpDialog
      ref="changePriceRef"
      v-model="changePriceDialog"
      width="1000px"
      class="dialog-changeprice"
      :loading="changePriceForm.loading"
      :destroy-on-close="true"
      :title="`申请售后【订单:${changePriceForm.order_id}】`"
      :form="changePriceForm"
      :form-list="changePriceFormList"
      @onSubmit="changePriceSubmit"
    />

    <!-- 发货 -->
    <SpDialog
      ref="personnel"
      v-model="personnelDialog"
      :title="statusPersonnel ? '分配配送员' : '取消配送'"
      :form="personnelForm"
      :form-list="personnelFormList"
      @onSubmit="onPersonnelSubmit"
    />
  </SpRouterView>
</template>
<script>
import { mapGetters } from 'vuex'
import mixin from '@/mixins'
import { pageMixin } from '@/mixins'
import {
  VERSION_STANDARD,
  VERSION_PLATFORM,
  isArray,
  VERSION_B2C,
  VERSION_IN_PURCHASE,
  IS_ADMIN,
  IS_DISTRIBUTOR
} from '@/utils'
import { exportInvoice, orderExport } from '@/api/trade'
import CompTableView from './components/comp-tableview'
import CompReceiveInfo from './components/comp-receiveInfo'
import moment from 'moment'
import {
  DISTRIBUTION_TYPE,
  DISTRIBUTION_STATUS,
  ORDER_STATUS,
  ORDER_B2C_STATUS,
  IN_PURCHASE_STATUS,
  ORDER_TYPE,
  ORDER_TYPE_STANDARD,
  INVOICE_STATUS,
  ORDER_CATEGORY,
  PICKER_DATE_OPTIONS,
  REFUND_STATUS,
  REFUND_PROCESS,
  PAY_TYPE,
  GOOD_CATEGORY_MAP
} from '@/consts'
import { IS_MERCHANT, IS_SUPPLIER } from '../../../../utils'

export default {
  // components: { CompTableView },
  mixins: [mixin, pageMixin],
  data() {
    return {
      confirmStatus: false,
      personnelDialog: false,
      statusPersonnel: false,
      loading: false,
      defaultTime: ['00:00:00', '23:59:59'],
      params: {
        receiver_mobile: '',
        mobile: '',
        order_id: '',
        original_order_id: '',
        supplier_name: '',
        order_class_exclude: 'drug,pointsmall,community',
        salesman_mobile: '',
        receipt_type: '', // 配送类型
        self_delivery_status: '', //配送状态
        source: '', // 订单来源
        order_status: '', // 订单状态
        order_class: '', // 订单类型
        delivery_staff_id: '', //配送员
        is_invoiced: '', // 开票状态
        time_start_begin: '', //
        time_start_end: '',
        order_holder: '', // 订单分类
        distributor_id: '', // 店铺
        subDistrict: [],
        salespersonname:''
      },
      deliveryPersonnel: [], //配送员信息
      datapass_block: 1, // 是否为数据脱敏
      subDistrictList: [],
      distributionType: DISTRIBUTION_TYPE,
      distributionStatus: DISTRIBUTION_STATUS,
      orderStatus: VERSION_B2C
        ? ORDER_B2C_STATUS
        : VERSION_IN_PURCHASE
        ? IN_PURCHASE_STATUS
        : ORDER_STATUS,
      orderType: this.VERSION_STANDARD ? ORDER_TYPE_STANDARD : ORDER_TYPE,
      invoiceStatus: INVOICE_STATUS,
      orderCategory: this.VERSION_STANDARD ? ORDER_CATEGORY.filter(item=>item.value != 'distributor') :  ORDER_CATEGORY,
      pickerOptions: PICKER_DATE_OPTIONS,
      orderSourceList: [],
      remarkDialog: false,
      remarkFormList: [
        {
          label: '备注信息:',
          key: 'remark',
          type: 'textarea',
          maxlength: 150,
          placeholder: '请输入对此订单需要备注的内容',
          required: true,
          message: '不能为空'
        }
      ],
      remarkForm: {
        orderId: '',
        is_distribution: 1,
        remark: ''
      },
      cancelOrderDialog: false,
      cancelOrderFormList: [
        {
          component: () => (
            <div class='tip-bar'>
              订单取消后，消费者在商城中看到的订单状态将变更为已取消，无法对其进行支付操作。
            </div>
          )
        },
        {
          label: '',
          component: () => (
            <CompReceiveInfo
              orderId={this.cancelOrderForm.order_id}
              on-onLoad={this.onLoadCancelOrderRef}
            />
          )
        },
        {
          label: '取消原因:',
          key: 'cancel_reason',
          placeholder: '请选择取消订单原因',
          type: 'select',
          options: [
            { title: '客户现在不想购买', value: 1 },
            { title: '客户商品价格较贵', value: 2 },
            { title: '客户价格波动', value: 3 },
            { title: '客户商品缺货', value: 4 },
            { title: '客户重复下单', value: 5 },
            { title: '客户订单商品选择有误', value: 6 },
            { title: '客户支付方式选择有误', value: 7 },
            { title: '客户收货信息填写有误', value: 8 },
            { title: '客户发票信息填写有误', value: 9 },
            { title: '客户无法支付订单', value: 10 },
            { title: '客户长时间未付款', value: 11 },
            { title: '客户其他原因', value: 12 }
          ],
          required: true,
          message: '不能为空',
          onChange: (e) => {
            if (e == 12) {
              this.cancelOrderFormList[3].isShow = true
            } else {
              this.cancelOrderFormList[3].isShow = false
            }
          }
        },
        {
          label: '其他原因:',
          key: 'other_reason',
          type: 'input',
          placeholder: '请填写取消订单原因',
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.cancelOrderForm.cancel_reason == 12 && !value) {
              callback(new Error('不能为空'))
            } else {
              callback()
            }
          }
        }
      ],
      cancelOrderForm: {
        order_id: '',
        buy_member: '',
        buy_mobile: '',
        receive_name: '',
        receive_mobile: '',
        receive_address: '',
        loading: false,
        cancel_reason: '',
        other_reason: ''
      },
      deliverGoodsDialog: false,

      deliverGoodsFormList: [
        {
          label: '发货方式',
          key: 'delivery_way',
          type: 'radio',
          disabled: true,
          options: [
            { label: '1', name: '快递' },
            { label: '2', name: '商家自配送' }
          ],
          onChange: (e) => {
            if (e == '1') {
              this.deliverGoodsFormList[1].options = [
                { label: 'batch', name: '整单发货' },
                { label: 'sep', name: '拆分发货' }
              ]
              this.deliverGoodsFormList[3].options = this.logisticsList.filter(
                (item) => item.value != 'SELF_DELIVERY'
              )
              this.deliverGoodsForm.delivery_corp = ''
            } else {
              this.deliverGoodsFormList[1].options = [{ label: 'batch', name: '整单发货' }]
              this.deliverGoodsForm.delivery_type = 'batch'
              this.deliverGoodsFormList[3].options = this.logisticsList.filter(
                (item) => item.value == 'SELF_DELIVERY'
              )
              this.deliverGoodsForm.delivery_corp = 'SELF_DELIVERY'
            }
          }
        },
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
              this.deliverGoodsFormList[2].options[7].isShow = true
            } else {
              this.deliverGoodsFormList[2].options[7].isShow = false
            }
          }
        },
        {
          label: '',
          key: 'items',
          type: 'table',
          options: [
            { title: '商品名', key: 'item_name' },
            { title: '商品类型', key: 'item_holder',render: (row, column, cell) => {
                return this.goodCategoryMap[row.item_holder]
            } },
            { title: '来源供应商', key: 'supplier_name', width: 100,isShow: ({ key }, value) => {
            return this.VERSION_STANDARD || this.IS_ADMIN()
          }, },
            { title: '数量', key: 'num', width: 60 },
            { title: '已发货数量', key: 'delivery_item_num', width: 100 },
            { title: '总支付价（¥）', key: 'price', width: 120 },
            { title: '成本价（¥）', key: 'cost_price', width: 100,render: (row, column, cell) => {
              return row.cost_price / 100
            } },
            {
              title: '发货数量',
              key: 'item_num',
              width: 160,
              render: (row, column, cell) => {
                if (row.num - row.delivery_item_num == 0) {
                  return ''
                } else {
                  return (
                    <el-input-number
                      size='mini'
                      v-model={row.delivery_num}
                      min={1}
                      disabled={IS_ADMIN() && row.supplier_id > 0}
                      max={row.num - row.delivery_item_num}
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
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '1'
          },
          message: '不能为空'
        },
        {
          label: '配送员',
          key: 'self_delivery_operator_id',
          placeholder: '请选择配送员',
          type: 'select',
          options: [],
          required: true,
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          },
          message: '不能为空',
          onChange: (e) => {
            console.log(e)
            let targetItem =
              this.deliverGoodsFormList[5].options.find((item) => item.operator_id == e) || {}
            let { staff_no, mobile } = targetItem
            this.deliverGoodsForm.self_delivery_operator_mobile = mobile
            this.deliverGoodsForm.self_delivery_operator_staffno = staff_no
          }
        },
        {
          label: '配送员手机号',
          key: 'self_delivery_operator_mobile',
          type: 'input',
          display: 'inline',
          placeholder: ' ',
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          },
          disabled: true
        },
        {
          label: '配送员编号',
          key: 'self_delivery_operator_staffno',
          display: 'inline',
          type: 'input',
          placeholder: ' ',
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          },
          disabled: true
        },
        {
          label: '配送状态',
          key: 'self_delivery_status',
          placeholder: '请选择配送状态',
          type: 'select',
          options: [{ title: '配送中', value: 'DELIVERING' }],
          required: true,
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          },
          message: '不能为空'
        },
        {
          label: '配送备注',
          key: 'delivery_remark',
          type: 'input',
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          }
        },
        {
          label: '分类图片',
          key: 'delivery_pics',
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          },
          component: ({ key }, value) => <SpImagePicker v-model={value[key]} drag max={9} />,
          tip: `1. 最多可上传9张图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M（建议尺寸：500px * 500px）<br />2. 相册图朋友圈分享是否生成小程序码`
        }
      ],
      deliverGoodsForm: {
        order_id: '',
        receipt_type: '',
        delivery_way: null,
        delivery_type: 'batch',
        delivery_corp: '',
        delivery_code: '',
        type: '',
        items: [],
        self_delivery_operator_id: '',
        self_delivery_operator_mobile: '',
        self_delivery_operator_staffno: '',
        self_delivery_status: '',
        delivery_remark: '',
        delivery_pics: []
      },
      writeOffDialog: false,
      writeOffFormList: [
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
        }
      ],
      writeOffForm: {
        order_id: '',
        pickupcode: '',
        items: []
      },
      goodCategoryMap:GOOD_CATEGORY_MAP,
      refundDialog: false,
      refundFormList: [
        {
          label: '取消来源',
          key: 'source',
          type: 'text'
        },
        {
          label: '申请时间',
          key: 'applyTime',
          type: 'text'
        },
        {
          label: '退款状态',
          key: 'refundStatus',
          type: 'text'
        },
        {
          label: '处理进度',
          key: 'process',
          type: 'text'
        },
        {
          label: '退款金额',
          key: 'refundPrice',
          type: 'text'
        },
        {
          label: '是否退运费',
          key: 'freight_fee',
          type: 'text',
          component: ({ key }, value) =>{
            return (
            <div>{value[key] > 0 ? '是' : '否'}</div>
            )
          }
        },
        {
          label: '退运费金额',
          key: 'freight_fee',
          type: 'text',
          component: ({ key }, value) =>{
            return (
            <div>{value[key] >0? value[key] / 100 :0}</div>
            )
          }
        },
        {
          label: '支付方式',
          key: 'payType',
          type: 'text'
        },
        {
          label: '取消原因',
          key: 'reason',
          type: 'text'
        },
        {
          label: '处理结果',
          key: 'check_cancel',
          type: 'radio',
          options: [
            { label: '0', name: '不同意' },
            { label: '1', name: '同意' }
          ],
          onChange: (e) => {
            if (e == '0') {
              this.refundFormList[8].isShow = true
            } else {
              this.refundFormList[8].isShow = false
            }
          }
        },
        {
          label: '拒绝原因',
          key: 'shop_reject_reason',
          type: 'input',
          placeholder: '请输入拒绝原因',
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.refundFormList.check_cancel == '0' && !value) {
              callback(new Error('不能为空'))
            } else {
              callback()
            }
          }
        }
      ],
      refundForm: {
        order_id: '',
        source: '',
        applyTime: '',
        refundStatus: '',
        process: '',
        refundPrice: '',
        payType: '',
        reason: '',
        check_cancel: '1',
        shop_reject_reason: ''
      },
      changePriceDialog: false,
      changePriceFormList: [
        {
          component: () => (
            <div class='tip-bar'>
              仅未支付订单可修改价格，改价后请联系买家刷新订单并核实订单金额后再支付。
            </div>
          )
        },
        {
          component: () => (
            <div class='receive-info'>
              <div class='receive-item'>
                <label class='item-label'>买家：</label>
                {`${this.changePriceForm.buy_member} | ${this.changePriceForm.buy_mobile}`}
              </div>
              <div class='receive-item'>
                <label class='item-label'>{`${
                  this.changePriceForm.isZiti ? '提货人：' : '收货人：'
                }`}</label>
                {`${this.changePriceForm.receive_name} | ${this.changePriceForm.receive_mobile}`}
              </div>
              <div class='receive-item'>
                <label class='item-label'>
                  {`${this.changePriceForm.isZiti ? '自提地址：' : '收货地址：'}`}
                </label>
                {this.changePriceForm.receive_address}
              </div>
            </div>
          )
        },
        {
          component: () => (
            <CompTableView
              value={this.changePriceForm.items}
              orderId={this.changePriceForm.order_id}
              itemTotalFee={this.changePriceForm.itemTotalFee}
              pointFreightFee={this.changePriceForm.pointFreightFee}
              receiptType={this.changePriceForm.receipt_type}
              freightFee={this.changePriceForm.freightFee}
              orderFee={this.changePriceForm.orderFee}
              on-onChange={this.onChangeTableView}
            />
          )
        }
      ],
      changePriceForm: {
        order_id: '',
        buy_member: '',
        buy_mobile: '',
        receive_name: '',
        receive_mobile: '',
        receive_address: '',
        loading: false,
        isZiti: false,
        items: [],
        // 配送类型
        receipt_type: '',
        // 商品应付金额
        itemTotalFee: 0,
        // 邮费
        freightFee: 0,
        // 订单应付金额
        orderFee: 0,
        // 运费积分抵扣
        pointFreightFee: 0
      },
      origin: '',
      isBindOMS: false,
      personnelForm: {
        order_id: '',
        self_delivery_operator_id: ''
      },
      personnelFormList: [
        {
          label: '订单号',
          key: 'order_id',
          placeholder: '请输入订单号',
          type: 'input',
          disabled: true,
          required: true,
          message: '订单号不能为空'
        },
        {
          label: '配送员',
          key: 'self_delivery_operator_id',
          type: 'select',
          options: [],
          required: true,
          message: '配送员不能为空',
          isShow: () => {
            return this.statusPersonnel
          }
        }
      ],
      logisticsList: [],
      //更新发货
      updateDeliverGoodsDialog: false,
      updateDeliverGoodsForm: {
        order_id: '',
        self_delivery_operator_id: '',
        self_delivery_operator_mobile: '',
        orders_delivery_id: '',
        self_delivery_status: '',
        delivery_remark: '',
        delivery_pics: [],
        delivery_code: ''
      },
      updateDeliverGoodsFormList: [
        {
          label: '快递公司',
          key: 'delivery_corp',
          placeholder: '请选择快递公司',
          type: 'select',
          options: [],
          disabled: true
        },
        {
          label: '发货单号',
          key: 'orders_delivery_id',
          type: 'input',
          placeholder: ' ',
          disabled: true
        },
        {
          label: '配送员',
          key: 'self_delivery_operator_id',
          placeholder: '请选择配送员',
          type: 'select',
          display: 'inline',
          disabled: true,
          options: [],
          required: true,
          message: '不能为空',
          onChange: (e) => {
            console.log(e)
            let targetItem =
              this.updateDeliverGoodsFormList[2].options.find((item) => item.operator_id == e) || {}
            let { staff_no, mobile } = targetItem
            console.log(targetItem)

            this.updateDeliverGoodsForm.self_delivery_operator_mobile = mobile
          }
        },
        {
          label: '配送员手机号',
          key: 'self_delivery_operator_mobile',
          type: 'input',
          display: 'inline',
          placeholder: ' ',
          disabled: true
        },
        {
          label: '配送状态',
          key: 'self_delivery_status',
          placeholder: '请选择配送状态',
          type: 'select',
          options: [],
          required: true,
          message: '不能为空'
        },
        {
          label: '配送备注',
          key: 'delivery_remark',
          type: 'input'
        },
        {
          label: '分类图片',
          key: 'delivery_pics',
          component: ({ key }, value) => <SpImagePicker v-model={value[key]} drag max={9} />,
          tip: `1. 最多可上传9张图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M（建议尺寸：500px * 500px）<br />2. 相册图朋友圈分享是否生成小程序码`
        }
      ],
      selectList: []
    }
  },

  computed: {
    ...mapGetters(['login_type', 'isMicorMall'])
  },
  watch: {
    'deliverGoodsForm.delivery_way'(e) {
      if (e == '1') {
        this.deliverGoodsFormList[1].options = [
          { label: 'batch', name: '整单发货' },
          { label: 'sep', name: '拆分发货' }
        ]
        this.deliverGoodsFormList[3].options = this.logisticsList.filter(
          (item) => item.value != 'SELF_DELIVERY'
        )
        this.deliverGoodsForm.delivery_corp = ''
        this.deliverGoodsFormList[5].required = false
        this.deliverGoodsFormList[8].required = false
        this.deliverGoodsFormList[4].required = true
      } else {
        this.deliverGoodsFormList[1].options = [{ label: 'batch', name: '整单发货' }]
        this.deliverGoodsForm.delivery_type = 'batch'
        this.deliverGoodsFormList[3].options = this.logisticsList.filter(
          (item) => item.value == 'SELF_DELIVERY'
        )
        this.deliverGoodsForm.delivery_corp = 'SELF_DELIVERY'
        this.deliverGoodsFormList[5].required = true
        this.deliverGoodsFormList[8].required = true
        this.deliverGoodsFormList[4].required = false
      }
    }
  },
  async created() {
    const { result } = await this.$api.trade.isBindOMS()
    this.isBindOMS = result
  },
  mounted() {
    this.origin = window.location.origin
    const { tab } = this.$route.query
    if (tab) {
      this.params.order_status = tab
    }
    this.fetchList()
    this.getOrderSourceList()
    this.getLogisticsList()
    this.getSubDistrictList()
    this.getPickupcodeSetting()
    this.delivery()
    this.$EventBus.$on('event.tradelist.refresh', () => {
      this.fetchList()
    })
  },
  methods: {
    async accountManagement(distributor_id) {
      let params = {
        pageSize: 999,
        page: 1,
        finderId: 100,
        operator_type: 'self_delivery_staff',
        is_disable: 0
      }
      if (distributor_id == '0') {
        params.staff_type = 'platform'
      } else {
        params.distributor_id = distributor_id
      }

      let res = await this.$api.trade.accountManagement(params)
      res.list.forEach((ele) => {
        (ele.value = ele.operator_id), (ele.title = ele.username)
      })
      this.personnelFormList[1].options = res.list
      this.deliverGoodsFormList[5].options = res.list
      this.updateDeliverGoodsFormList[2].options = res.list
    },
    // 分配配送员
    assignPersonnel(val) {
      if (this.selectList.length != 1) {
        return this.$message.error('请选择一个订单！')
      }

      const { order_id, self_delivery_status, distributor_id,self_delivery_operator_id } = this.selectList[0]

      if (!val) {
        // 已接单，配送中才能取消配送
        this.personnelFormList[1].required = false
        if (!['RECEIVEORDER', 'DELIVERING'].includes(self_delivery_status)) {
          return this.$message.error('该订单无法取消配送！')
        }
      } else {
        // if (!['CONFIRMING', 'PACKAGED'].includes(self_delivery_status)) {
        //   return this.$message.error('该订单无法分配配送员！')
        // }
        if(self_delivery_operator_id != 0){
          return this.$message.error('该订单无法分配配送员！')
        }
      }

      if (val) {
        this.accountManagement(distributor_id)
      }

      this.personnelDialog = true
      this.statusPersonnel = val

      this.personnelForm = {
        order_id: order_id,
        self_delivery_operator_id: ''
      }
    },
    async onPersonnelSubmit() {
      if (this.statusPersonnel) {
        await this.$api.trade.orderDeliverystaffConfirm(this.personnelForm)
        this.$message({
          message: '分配成功',
          type: 'success'
        })
        this.personnelDialog = false
      } else {
        await this.$api.trade.orderCancelDeliverystaff({ order_id: this.personnelForm.order_id })
        this.$message({
          message: '取消成功',
          type: 'success'
        })
        this.personnelDialog = false
      }
      this.fetchList()
    },
    async delivery() {
      let params = {
        pageSize: 1000,
        page: 1,
        // finderId: 100,
        operator_type: 'self_delivery_staff'
      }
      let { list } = await this.$api.company.getAccountList(params)
      list.forEach((ele) => {
        (ele.value = ele.operator_id), (ele.title = ele.username)
      })
      this.deliveryPersonnel = list
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        order_type: 'normal',
        ...this.params,
        subdistrict_parent_id: this.params.subDistrict[0], // 街道id
        subdistrict_id: this.params.subDistrict[1] // 居委id
      }
      delete params.subDistrict

      if (isArray(this.params.create_time) && this.params.create_time.length >= 2) {
        params.time_start_begin = moment(this.params.create_time[0]).unix()
        params.time_start_end = moment(this.params.create_time[1]).unix()
      }

      if (isArray(this.params.delivery_time) && this.params.delivery_time.length >= 2) {
        params.delivery_time_begin = moment(this.params.delivery_time[0]).unix()
        params.delivery_time_end = moment(this.params.delivery_time[1]).unix()
      }

      delete params.create_time
      delete params.delivery_time

      const { list, pager, datapass_block } = await this.$api.trade.getOrderList(params)

      this.tableList = list.map((item) => {
        const actionBtns = []
        const {
          distributor_id,
          receipt_type,
          cancel_status,
          is_logistics,
          is_invoiced,
          invoice,
          order_status,
          order_status_des,
          ziti_status,
          dada,
          delivery_status,
          pay_status,
          can_apply_aftersales,
          self_delivery_status,
          order_holder
        } = item
        const isDada = receipt_type == 'dada'
        const isLogistics = receipt_type == 'logistics'
        const isSelfDelivery = receipt_type == 'merchant'

        if ( (receipt_type == 'ziti' || (VERSION_STANDARD || distributor_id == 0) && order_holder != 'supplier') || this.login_type == 'distributor') {
          if (
            !isDada &&
            cancel_status == 'NO_APPLY_CANCEL' &&
            ['NOTPAY', 'PAYED'].includes(order_status) &&
            ziti_status != 'DONE'
          ) {
            // 非同城配的取消订单按钮
            if (!isDada || (isDada && ['0', '1'].includes(dada.data_status)) ) {

              if(receipt_type == 'ziti'){
                //如果是自提，商家订单店铺端才可以取消
                if((order_holder == 'distributor' && IS_DISTRIBUTOR()) || (IS_ADMIN() && order_holder != 'distributor')){
                  actionBtns.push({ name: '取消订单', key: 'cancel' })
                }
              }else{

                actionBtns.push({ name: '取消订单', key: 'cancel' })
              }
            }
          }
          //待自提
          if (order_status == 'PAYED' && receipt_type == 'ziti' && ziti_status == 'PENDING' ) {
              //商家自提订单只有在店铺端
              if((order_holder == 'distributor' && IS_DISTRIBUTOR()) || (IS_ADMIN() && order_holder != 'distributor')){
                actionBtns.push({ name: '核销', key: 'writeOff' })
              }
          }

          if (
            isDada &&
            ['NO_APPLY_CANCEL', 'FAILS'].includes(cancel_status) &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            dada.dada_status == '0'
          ) {
            actionBtns.push({ name: '接单', key: 'takeOrder' })
          }

          if (isDada && pay_status == 'PAYED' && dada.dada_status == '9') {
            actionBtns.push({ name: '确认退回', key: 'orderSendBack' })
          }

          if (
            (isLogistics || is_logistics || isSelfDelivery) &&
            !isDada &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            receipt_type != 'ziti'
            && cancel_status != 'WAIT_PROCESS' //待退款不展示发货按钮
            // && this.login_type == 'supplier'
          ) {
            actionBtns.push({ name: '发货', key: 'deliverGoods' })
          }

          if (cancel_status == 'WAIT_PROCESS' && order_status == 'PAYED') {
            actionBtns.push({ name: '退款', key: 'refund' })
          }

          if (is_invoiced == '0' && invoice) {
            actionBtns.push({ name: '待开票', key: 'waitInvoice' })
          }

          if (
            receipt_type == 'merchant' &&
            order_status == 'WAIT_BUYER_CONFIRM' &&
            self_delivery_status != 'DONE'
          ) {
            actionBtns.push({ name: '更新发货', key: 'updatedelivery' })
          }

          if (
            receipt_type == 'merchant' &&
            ['CONFIRMING', 'RECEIVEORDER'].includes(self_delivery_status) &&
            order_status === 'PAYED'
          ) {
            actionBtns.push({ name: '已打包', key: 'confirmpackag' })
          }

          actionBtns.push({ name: '备注', key: 'remark' })
        }else if(order_holder == 'supplier'){
          //供应商订单有取消和备注
          if (
            !isDada &&
            cancel_status == 'NO_APPLY_CANCEL' &&
            ['NOTPAY', 'PAYED'].includes(order_status) &&
            ziti_status != 'DONE'
          ) {
            // 非同城配的取消订单按钮
            if (!isDada || (isDada && ['0', '1'].includes(dada.data_status))) {
              actionBtns.push({ name: '取消订单', key: 'cancel' })
            }
          }

          actionBtns.push({ name: '备注', key: 'remark' })
        }

        if (order_status == 'NOTPAY') {
          if (VERSION_PLATFORM) {
            if ((this.IS_ADMIN() && distributor_id == 0) || this.IS_DISTRIBUTOR()) {
              actionBtns.push({ name: '改价', key: 'changePrice' })
            }
          } else if (!VERSION_IN_PURCHASE) {
            actionBtns.push({ name: '改价', key: 'changePrice' })
          }
        }
        if (can_apply_aftersales == 1) {
          if (VERSION_PLATFORM) {
            if ((this.IS_ADMIN() && distributor_id == 0) || this.IS_DISTRIBUTOR()) {
              actionBtns.push({ name: '申请售后', key: 'salesAfter' })
            }
          } else if (!VERSION_IN_PURCHASE) {
            actionBtns.push({ name: '申请售后', key: 'salesAfter' })
          }
        }


        return {
          ...item,
          // cost_fee,
          actionBtns
        }
      })
      this.page.total = pager ? pager.count : 0
      this.datapass_block = datapass_block
      this.loading = false
    },
    async getSubDistrictList() {
      const res = await this.$api.subdistrict.getSubDistrictList()
      console.log(`getSubDistrictList:`, res)
      this.subDistrictList = res
    },
    getOrderCategoryName(order_holder){
      return this.orderCategory.find(item=>item.value == order_holder)?.title ?? ''
    },
    getOrderType({ order_class, type }) {
      if (order_class == 'normal') {
        return type == '1' ? '跨境订单' : '普通订单'
      }
      const _orderType = this.VERSION_STANDARD ? ORDER_TYPE_STANDARD : ORDER_TYPE
      const fd = _orderType.find((item) => item.value == order_class)
      if (fd) {
        return fd.title
      }
    },
    getDistributionType({ receipt_type }) {
      const fd = DISTRIBUTION_TYPE.find((item) => item.value == receipt_type)
      if (fd) {
        return fd.title
      }
    },

    getDistributionStatus({ self_delivery_status }) {
      const fd = DISTRIBUTION_STATUS.find((item) => item.value == self_delivery_status)
      if (fd) {
        return fd.title
      }
    },

    async getOrderSourceList() {
      const { list } = await this.$api.datacube.getSourcesList({
        page: 1,
        pageSize: 1000
      })

      this.orderSourceList = list.map(({ sourceName, sourceId }) => {
        return {
          title: sourceName,
          value: sourceId
        }
      })
    },
    async getLogisticsList() {
      const { list } = await this.$api.trade.getLogisticsList()
      this.logisticsList = list.map((item) => {
        return {
          title: item.name,
          value: item.value
        }
      })
      this.deliverGoodsFormList[3].options = this.logisticsList
      this.logisticsList.push({ title: '商家自配送', value: 'SELF_DELIVERY' })
      this.updateDeliverGoodsFormList[0].options = this.logisticsList
    },
    async handleAction(
      {
        order_id,
        order_status,
        distributor_remark,
        items,
        distributor_id,
        delivery_type,
        delivery_status,
        receipt_type,
        orders_delivery_id,
        self_delivery_operator_id,
        delivery_corp,
        self_delivery_operator_mobile,
        delivery_code,
        self_delivery_status,
        order_holder
      },
      { key }
    ) {
      if (key == 'remark') {
        this.$refs['remarkDialogRef'].resetForm()
        this.remarkForm.orderId = order_id
        this.remarkForm.remark = distributor_remark
        this.remarkDialog = true
      } else if (key == 'cancel') {
        this.$refs['cancelOrderDialogRef'].resetForm()
        if (order_status == 'PAYED') {
          this.cancelOrderFormList[0].isShow = false
        } else {
          this.cancelOrderFormList[0].isShow = true
        }
        this.cancelOrderForm.order_id = order_id
        this.cancelOrderForm.loading = true
        this.cancelOrderDialog = true
      } else if (key == 'deliverGoods') {
        if (this.isBindOMS && this.IS_ADMIN()) {
          return this.$message.warning('请至OMS处理订单发货')
        }

        await this.accountManagement(distributor_id)

        this.deliverGoodsForm.delivery_way = receipt_type == 'merchant' ? '2' : '1'
        //已经分配配送员数据回显示
        this.deliverGoodsForm.self_delivery_operator_id = ['PACKAGED', 'RECEIVEORDER'].includes(
          self_delivery_status
        )
          ? self_delivery_operator_id
          : ''
        this.deliverGoodsForm.self_delivery_operator_mobile = ['PACKAGED', 'RECEIVEORDER'].includes(
          self_delivery_status
        )
          ? self_delivery_operator_mobile
          : ''

        let self_delivery_operator_staffno =
          this.deliverGoodsFormList[5].options.find(
            (item) => item.operator_id == self_delivery_operator_id
          )?.staff_no ?? ''
        this.deliverGoodsForm.self_delivery_operator_staffno = [
          'PACKAGED',
          'RECEIVEORDER'
        ].includes(self_delivery_status)
          ? self_delivery_operator_staffno
          : ''
        this.deliverGoodsForm.delivery_remark = ''
        this.deliverGoodsForm.delivery_pics = []

        this.$refs['deliverGoodsDialogRef'].resetForm()
        this.deliverGoodsForm.order_id = order_id
        this.deliverGoodsForm.receipt_type = receipt_type
        this.deliverGoodsForm.items = items.map((item) => {
          return {
            ...item,
            price: item.price / 100
          }
        })
        this.deliverGoodsForm.type = delivery_type
        this.deliverGoodsForm.delivery_type = 'batch'
        this.deliverGoodsForm.delivery_corp = ''
        this.deliverGoodsForm.delivery_code = ''
        // 部分发货
        //如果自营+供应商订单，只能部分发货，并且只能发自营的商品
        if (delivery_status == 'PARTAIL' || order_holder == 'self_supplier') {
          this.deliverGoodsForm.delivery_type = 'sep'
          this.deliverGoodsFormList[1].disabled = true
          this.deliverGoodsFormList[2].options[7].isShow = true
        } else {
          this.deliverGoodsFormList[1].disabled = false
          this.deliverGoodsFormList[2].options[7].isShow = false
        }


        this.deliverGoodsDialog = true
      } else if (key == 'writeOff') {
        this.$refs['writeOffDialogRef'].resetForm()
        this.writeOffForm.order_id = order_id
        this.writeOffForm.items = items.map((item) => {
          return {
            ...item,
            price: item.price / 100
          }
        })
        this.writeOffDialog = true
      } else if (key == 'takeOrder') {
        this.$confirm('请在接单前确认商品当前库存', '接单提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.doBusinessReceipt(order_id)
          this.$message.success('接单成功')
        })
      } else if (key == 'orderSendBack') {
        this.$confirm('确认退回', '确认退回提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.confirmBack(order_id)
          this.$message.success('退回成功')
        })
      } else if (key == 'refund') {
        this.$refs['refundRef'].resetForm()
        this.refundDialog = true
        const {
          cancel_from,
          create_time,
          refund_status,
          progress,
          fee_symbol,
          total_fee,
          pay_type,
          pay_channel,
          cancel_reason
        } = await this.$api.trade.getCancelOrderInfo(order_id, { order_type: 'normal' })
        this.refundForm = {
          ...this.refundForm,
          order_id,
          source: cancel_from == 'buyer' ? '消费者申请' : '系统自动取消',
          applyTime: moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          refundStatus: REFUND_STATUS[refund_status],
          process: REFUND_PROCESS[progress],
          refundPrice: `${fee_symbol}${total_fee / 100}`,
          payType: pay_channel ? PAY_TYPE[pay_channel] : PAY_TYPE[pay_type],
          reason: cancel_reason
        }
      } else if (key == 'waitInvoice') {
        this.$confirm('确定更新该订单开票状态？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async () => {
          const { success } = await this.$api.trade.isInvoiced({
            order_id: order_id,
            status: 1
          })
          this.fetchList()
          if (success) {
            this.$message.success('已更新开票状态')
          } else {
            this.$message.error('更新开票状态失败')
          }
        })
      } else if (key == 'changePrice') {
        this.changePriceDialog = true
        this.changePriceForm.loading = true
        const { orderInfo, distributor, profit, tradeInfo } = await this.$api.trade.getOrderDetail(
          order_id
        )
        const { store_address, store_name } = distributor
        const {
          items = [],
          user_id,
          receiver_name,
          receiver_mobile,
          receiver_state,
          receiver_city,
          receiver_district,
          receiver_address,
          order_class,
          total_fee,
          freight_fee,
          item_fee_new,
          item_total_fee,
          receipt_type,
          point_freight_fee
        } = orderInfo
        const { username, mobile } = await this.$api.member.getMember({
          user_id: user_id
        })
        this.changePriceForm.loading = false
        this.changePriceForm.order_id = order_id
        this.changePriceForm.buy_member = username
        this.changePriceForm.buy_mobile = mobile
        if (
          order_class == 'excard' ||
          order_class == 'shopadmin' ||
          (order_class == 'normal' && receipt_type == 'ziti')
        ) {
          this.changePriceForm.receive_name = username
          this.changePriceForm.receive_mobile = mobile
          this.changePriceForm.receive_address = `${store_address}（${store_name}）`
          this.changePriceForm.isZiti = true
        } else {
          this.changePriceForm.receive_name = receiver_name
          this.changePriceForm.receive_mobile = receiver_mobile
          this.changePriceForm.receive_address = `${receiver_state}${receiver_city}${receiver_district}${receiver_address}`
          this.changePriceForm.isZiti = false
        }
        this.changePriceForm.receipt_type = receipt_type
        // this.changePriceForm.itemFee = item_fee_new / 100
        this.changePriceForm.freightFee = freight_fee / 100
        this.changePriceForm.orderFee = total_fee / 100
        this.changePriceForm.itemTotalFee = item_total_fee / 100
        // 运费积分抵扣
        this.changePriceForm.pointFreightFee = point_freight_fee / 100

        this.changePriceForm.items = items.map((item) => {
          return {
            ...item,
            change_discount: '',
            change_price: '',
            total: item_total_fee / 100
          }
        })
        console.log('this.changePriceForm:', this.changePriceForm)
      } else if (key == 'salesAfter') {
        if (IS_DISTRIBUTOR()) {
          this.$router.push({ path: `/shopadmin/order/tradenormalorders/after-sale/${order_id}` })
        } else if (this.$store.getters.login_type == 'supplier') {
          this.$router.push({ path: `/supplier/order/tradenormalorders/after-sale/${order_id}` })
        } else {
          this.$router.push({ path: `/order/entitytrade/tradenormalorders/after-sale/${order_id}` })
        }
      } else if (key == 'updatedelivery') {
        //更新发货
        this.$refs['updateDeliverGoodsDialogRef'].resetForm()
        this.updateDeliverGoodsForm.delivery_pics = []
        this.updateDeliverGoodsForm.delivery_remark = ''
        this.updateDeliverGoodsDialog = true
        this.updateDeliverGoodsForm.order_id = order_id
        this.updateDeliverGoodsForm.orders_delivery_id = orders_delivery_id
        this.updateDeliverGoodsForm.self_delivery_operator_id =
          self_delivery_operator_id == '0' || !self_delivery_operator_id
            ? ''
            : self_delivery_operator_id
        this.updateDeliverGoodsForm.delivery_corp = delivery_corp
        this.updateDeliverGoodsForm.self_delivery_operator_mobile = self_delivery_operator_mobile
        this.updateDeliverGoodsForm.delivery_code = delivery_code
        this.updateDeliverGoodsForm.self_delivery_status = ''
        if (self_delivery_status == 'CONFIRMING') {
          this.updateDeliverGoodsFormList[4].options = [{ title: '配送中', value: 'DELIVERING' }]
          this.updateDeliverGoodsFormList[2].disabled = false
        } else {
          this.updateDeliverGoodsFormList[2].disabled = true
          this.updateDeliverGoodsFormList[4].options = [
            { title: '已送达', value: 'DONE' },
            { title: '已取消', value: 'CONFIRMING' }
          ]
        }
      } else if (key == 'confirmpackag') {
        this.$confirm('是否确认打包', '商品打包', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async () => {
          await this.$api.trade.confirmpackag({ order_id })
          this.$message.success('打包成功')
          this.fetchList()
        })
      }
    },
    onLoadCancelOrderRef() {
      this.cancelOrderForm.loading = false
    },
    async onRemarkSubmit() {
      await this.$api.order.remarks(this.remarkForm)
      this.$message.success('订单备注修改成功!')
      this.remarkDialog = false
      this.fetchList()
    },
    async onCancelOrderSubmit() {
      const { order_id } = this.cancelOrderForm
      console.log(this.cancelOrderForm)
      await this.$api.trade.cancelOrderConfirm(order_id, this.cancelOrderForm)
      this.cancelOrderDialog = false
      this.$message.success('订单取消成功!')
      // await this.$confirm('订单已取消', '确认信息', {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // })
      this.fetchList()
    },
    async updateDeliverGoodsSubmit() {
      const {
        orders_delivery_id,
        delivery_corp,
        self_delivery_status,
        self_delivery_operator_id,
        delivery_code,
        delivery_remark,
        delivery_pics
      } = this.updateDeliverGoodsForm

      const params = {
        delivery_corp,
        self_delivery_status,
        self_delivery_operator_id,
        delivery_remark,
        delivery_pics,
        delivery_code
      }

      const res = await this.$api.trade.updateLogistics(orders_delivery_id, params)
      this.$message.success('更新成功!')
      this.updateDeliverGoodsDialog = false
      this.fetchList()
    },
    async deliverGoodsSubmit() {
      const {
        order_id,
        delivery_type,
        delivery_corp,
        delivery_code,
        type,
        items,
        receipt_type,
        delivery_way,
        self_delivery_operator_id,
        self_delivery_status,
        delivery_pics,
        delivery_remark
      } = this.deliverGoodsForm
      let params = {}

      if (delivery_way == '2') {
        params = {
          order_id,
          delivery_type,
          delivery_corp,
          type,
          self_delivery_operator_id,
          self_delivery_status,
          delivery_pics,
          delivery_remark
        }
      } else {
        params = {
          order_id,
          delivery_type,
          delivery_corp,
          delivery_code,
          type
        }
      }

      // 拆单发货
      if (delivery_type == 'sep') {
        params['sepInfo'] = JSON.stringify(items.filter((item) => item.delivery_num))
      }

      console.log(params)

      this.confirmStatus = true
      const { delivery_status } = await this.$api.trade.delivery(params)
      this.deliverGoodsDialog = false
      this.$nextTick(() => {
        this.confirmStatus = false
      })
      this.fetchList()
      if (delivery_status && delivery_status != 'PENDING') {
        this.$message.success('发货成功!')
      } else {
        this.$message.error('发货失败!')
      }
    },
    async writeOffSubmit() {
      const { order_id } = this.writeOffForm
      const { ziti_status } = await this.$api.trade.doWriteoff(order_id, this.writeOffForm)
      if (ziti_status == 'DONE') {
        this.$message.success('自提订单核销成功!')
      } else {
        this.$message.error('自提订单核销失败!')
      }
      this.writeOffDialog = false
    },
    async refundSubmit() {
      const { order_id, check_cancel, shop_reject_reason } = this.refundForm
      const { refund_status } = await this.$api.trade.cancelConfirm(order_id, {
        order_id,
        check_cancel,
        shop_reject_reason
      })
      if (refund_status == 'AUDIT_SUCCESS') {
        this.$message.success('审核通过!')
      } else if (refund_status == 'SHOP_CHECK_FAILS') {
        this.$message.success('审核已拒绝!')
      } else {
        this.$message.error('审核失败!')
      }
      this.refundDialog = false
    },
    async changePriceSubmit() {
      const { items, freightFee, order_id, pointFreightFee } = this.changePriceForm
      let params = {
        order_id,
        down_type: 'items'
      }
      if (freightFee >= 0) {
        params['freight_fee'] = (freightFee - pointFreightFee) * 100
      }
      if (items.length > 0) {
        params['items'] = items.map((item) => {
          return {
            item_id: item.item_id,
            total_fee: item.total_fee
          }
        })
      }
      await this.$api.trade.changePriceConfirm(params)
      this.changePriceDialog = false
      this.fetchList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectList = val
    },
    async salesAfterSubmit() {},
    exportInvoice() {
      let type = 'normal'
      this.$emit('onChangeData', 'params', { type })
      exportInvoice({
        ...this.params,
        type,
        order_type: 'normal'
      }).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message.success('已加入执行队列，请在设置-导出列表中下载')
          this.$export_open('invoice')
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error('无内容可导出或执行失败，请检查重试')
          return
        }
      })
    },
    exportDataNormal() {
      this.exportData('normal_order')
    },
    exportDataMaster() {
      this.exportData('normal_master_order')
    },
    exportData(type) {
      console.log('====exportData', type)
      let params = {
        ...this.params,
        order_type: 'normal',
        type,
        page: this.page.pageIndex
      }
      if (isArray(this.params.create_time) && this.params.create_time.length >= 2) {
        params.time_start_begin = moment(this.params.create_time[0]).unix()
        params.time_start_end = moment(this.params.create_time[1]).unix()
      }

      if (isArray(this.params.delivery_time) && this.params.delivery_time.length >= 2) {
        params.delivery_time_begin = moment(this.params.delivery_time[0]).unix()
        params.delivery_time_end = moment(this.params.delivery_time[1]).unix()
      }

      delete params.create_time
      delete params.delivery_time

      orderExport(params).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message.success('已加入执行队列，请在设置-导出列表中下载')
          this.$export_open(type)
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error('无内容可导出或执行失败，请检查重试')
          return
        }
      })
    },
    async uploadHandleChange(file) {
      const params = {
        isUploadFile: true,
        file_type: 'normal_orders',
        file: file.raw
      }
      await this.$api.common.handleUploadFile(params)
      this.$message.success('上传成功，等待处理')
      this.fetchList()
    },
    async uploadHandlePatchCancel(file) {
      const params = {
        isUploadFile: true,
        file_type: 'normal_orders_cancel',
        file: file.raw
      }
      await this.$api.common.handleUploadFile(params)
      this.$message.success('上传成功，等待处理')
      this.fetchList()
    },
    async getPickupcodeSetting() {
      const { pickupcode_status } = await this.$api.company.getPickupcodeSetting()
      if (!pickupcode_status) return
      this.writeOffFormList.push({
        label: '提货码:',
        key: 'pickupcode',
        type: 'input',
        placeholder: '请输入提货码',
        required: true,
        message: '不能为空'
      })
    },
    onChangeTableView({ items, item_fee_new, freight_fee, total_fee, item_total_fee }) {
      // this.changePriceForm.itemFee = item_fee_new / 100
      this.changePriceForm.freightFee = freight_fee / 100
      this.changePriceForm.orderFee = total_fee / 100
      this.changePriceForm.itemTotalFee = item_total_fee / 100
      this.changePriceForm.items = items.map((item) => {
        return {
          ...item,
          change_discount: '',
          change_price: '',
          total: item_total_fee / 100
        }
      })
    },
    async downloadtemplate() {
      const { name, file } = await this.$api.common.download()
      if (file) {
        var a = document.createElement('a')
        a.href = file
        a.download = name
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    }
  }
}
</script>
<style lang="scss" scope>
.sp-filter-form {
  margin-bottom: 16px;
}

.dialog-changeprice,
.dialog-cancelorder,
.dialog-salesafter {
  .el-form {
    margin-right: 0 !important;
  }
  .tip-bar {
    border: 1px solid #7db3f2;
    border-radius: 4px;
    background: #e6f0ff;
    padding: 0 10px;
    color: #4f77a8;
    height: 36px;
    line-height: 36px;
    font-size: 13px;
  }
  .receive-info {
    line-height: 22px;
  }
  .receive-item {
    color: #7d7d7d;
  }
  .receive-label {
    color: #b8b8b8;
  }
}
.dialog-cancelorder {
  .el-form-item {
    &:nth-child(1) {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
    &:nth-child(2) {
      .el-form-item__content {
        margin-left: 26px !important;
      }
    }
  }
}
.dialog-changeprice {
  .el-form-item {
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
.dialog-salesafter {
  .el-form-item {
    &:nth-child(1) {
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
