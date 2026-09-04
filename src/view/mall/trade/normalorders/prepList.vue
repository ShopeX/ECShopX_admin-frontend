<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <!-- <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('process') === -1"> -->
  <SpRouterView>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="mobile" :label="$t('6648bb92.ce2bf3')">
        <el-input v-model="params.mobile" :placeholder="$t('6648bb92.c746c6')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('6648bb92.070dce')">
        <el-input v-model="params.order_id" :placeholder="$t('6648bb92.e9e836')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('6648bb92.6519a2')">
        <el-input v-model="params.order_id" :placeholder="$t('6648bb92.07c935')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('6648bb92.5d7781')">
        <el-input v-model="params.order_id" :placeholder="$t('6648bb92.408c78')" />
      </SpFilterFormItem>
      <!-- <SpFilterFormItem
        v-if="login_type != 'merchant' && !VERSION_B2C() && !VERSION_IN_PURCHASE()"
        prop="salesman_mobile"
:label="$t('6648bb92.7c0d05')"
        >
        <el-input v-model="params.salesman_mobile" :placeholder="$t('6648bb92.d0c425')" />
      </SpFilterFormItem> -->
      <SpFilterFormItem v-if="!isMicorMall" prop="receipt_type" :label="$t('6648bb92.b6ae11')">
        <el-select v-model="params.receipt_type" clearable :placeholder="$t('6648bb92.708c9d')">
          <el-option
            v-for="item in distributionType"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem v-if="!VERSION_IN_PURCHASE()" prop="source" :label="$t('6648bb92.b36ea7')">
        <el-select v-model="params.source" clearable :placeholder="$t('6648bb92.708c9d')">
          <el-option
            v-for="item in orderSourceList"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="VERSION_STANDARD() || IS_ADMIN()"
        prop="supplier_name"
        :label="$t('6648bb92.a54fd2')"
      >
        <el-input v-model="params.supplier_name" :placeholder="$t('6648bb92.55c61d')" />
      </SpFilterFormItem>
      <!-- <SpFilterFormItem v-if="!VERSION_IN_PURCHASE()" prop="order_class" label="订单类型:">
        <el-select v-model="params.order_class" clearable placeholder="请选择">
          <el-option
            v-for="item in orderType"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem> -->
      <SpFilterFormItem prop="order_id" :label="$t('6648bb92.f2103d')">
        <el-input v-model="params.order_id" :placeholder="$t('6648bb92.2313fc')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('6648bb92.d9e80e')">
        <el-input v-model="params.order_id" :placeholder="$t('6648bb92.3722de')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('6648bb92.4465a6')">
        <el-input v-model="params.order_id" :placeholder="$t('6648bb92.43d6ec')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('6648bb92.f642c2')">
        <el-input v-model="params.order_id" :placeholder="$t('6648bb92.842e5e')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="delivery_staff_id" :label="$t('6648bb92.28833e')">
        <el-select
          v-model="params.delivery_staff_id"
          clearable
          :placeholder="$t('6648bb92.708c9d')"
        >
          <el-option
            v-for="item in deliveryPersonnel"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>

      <SpFilterFormItem
        v-if="!VERSION_IN_PURCHASE()"
        prop="delivery_staff_id"
        :label="$t('6648bb92.7f6b70')"
      >
        <el-select
          v-model="params.delivery_staff_id"
          clearable
          :placeholder="$t('6648bb92.708c9d')"
        >
          <el-option
            v-for="item in deliveryPersonnel"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="salespersonname" :label="$t('6648bb92.eda5c9')">
        <el-input v-model="params.salespersonname" :placeholder="$t('6648bb92.322e74')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="role" :label="$t('6648bb92.e1f833')">
        <el-select v-model="params.role" :placeholder="$t('6648bb92.708c9d')" clearable>
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" :label="$t('6648bb92.43c297')" size="max">
        <el-date-picker
          v-model="params.create_time"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :range-separator="$t('6648bb92.981cbe')"
          :start-placeholder="$t('6648bb92.b44c0f')"
          :end-placeholder="$t('6648bb92.1d468b')"
          prefix-icon="null"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="!isMicorMall && !VERSION_IN_PURCHASE()"
        prop="is_invoiced"
        :label="$t('6648bb92.dfc420')"
      >
        <el-select v-model="params.is_invoiced" clearable :placeholder="$t('6648bb92.708c9d')">
          <el-option
            v-for="item in invoiceStatus"
            :key="item.value"
            size="mini"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="delivery_time" :label="$t('6648bb92.21524c')" size="max">
        <el-date-picker
          v-model="params.delivery_time"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :range-separator="$t('6648bb92.981cbe')"
          :start-placeholder="$t('6648bb92.b44c0f')"
          :end-placeholder="$t('6648bb92.1d468b')"
          prefix-icon="null"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_holder" :label="$t('6648bb92.e56a5e')">
        <el-select v-model="params.order_holder" clearable :placeholder="$t('6648bb92.708c9d')">
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
        v-if="
          (!isMicorMall || login_type != 'distributor') && !VERSION_B2C() && !VERSION_IN_PURCHASE()
        "
        prop="distributor_id"
        :label="$t('6648bb92.16f2bc')"
      >
        <SpSelectShop
          v-model="params.distributor_id"
          clearable
          :placeholder="$t('6648bb92.708c9d')"
        />
      </SpFilterFormItem>
      <SpFilterFormItem
        v-if="!VERSION_IN_PURCHASE()"
        prop="subDistrict"
        :label="$t('6648bb92.d3063b')"
      >
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
      <SpFilterFormItem prop="self_delivery_status" :label="$t('6648bb92.ae9d1f')">
        <el-select
          v-model="params.self_delivery_status"
          clearable
          :placeholder="$t('6648bb92.708c9d')"
        >
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
      <el-dropdown trigger="click" @command="handleExport">
        <el-button type="primary" plain>
          {{ $t('6648bb92.55405e') }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="exportInvoice">{{ $t('6648bb92.019aea') }}</el-dropdown-item>
          <el-dropdown-item command="exportDataMaster">
            {{ $t('6648bb92.d4d21f') }}
          </el-dropdown-item>
          <el-dropdown-item command="exportDataNormal">
            {{ $t('6648bb92.a19dd9') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip
        v-if="IS_SUPPLIER()"
        effect="light"
        :content="$t('6648bb92.29119c')"
        placement="top-start"
      >
        <el-upload
          action=""
          class="btn-upload"
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button type="primary" plain>{{ $t('6648bb92.425991') }}</el-button>
        </el-upload>
      </el-tooltip>
      <el-upload
        action=""
        class="btn-upload"
        :on-change="uploadHandlePatchCancel"
        :auto-upload="false"
        :show-file-list="false"
      >
        <el-button type="primary" plain>{{ $t('6648bb92.321129') }}</el-button>
      </el-upload>
      <!-- v-if="IS_DISTRIBUTOR() || IS_MERCHANT()" -->
      <el-button type="primary" plain @click="assignPersonnel(true)">
        {{ $t('6648bb92.531827') }}
      </el-button>
      <!-- <el-upload
        action=""
        class="btn-upload"
        :on-change="uploadHandlePatchCancel"
        :auto-upload="false"
        :show-file-list="false"
      > -->
      <!-- v-if="IS_DISTRIBUTOR() || IS_ADMIN()" -->
      <el-button type="primary" plain @click="assignPersonnel(false)">
        {{ $t('6648bb92.204fe4') }}
      </el-button>
      <!-- </el-upload> -->
    </div>

    <el-tabs v-model="params.order_status" type="card" @tab-click="onSearch">
      <el-tab-pane
        v-for="item in orderStatus"
        :key="item.value"
        :label="item.title"
        :name="item.value"
      />
      <el-table
        v-loading="loading"
        border
        :data="tableList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="180" prop="order_id" :label="$t('6648bb92.1e8dc2')">
          <template slot-scope="scope">
            <div class="order-num">
              {{ scope.row.order_id }}
              <el-tooltip effect="dark" :content="$t('6648bb92.79d3ab')" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.order_id"
                  v-clipboard:success="onCopySuccess"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div class="order-store">
              <el-tooltip effect="dark" :content="$t('6648bb92.53cc55')" placement="top-start">
                <i class="el-icon-office-building" />
              </el-tooltip>
              {{ scope.row.distributor_name }}
            </div>
            <div class="order-time">
              <el-tooltip effect="dark" :content="$t('6648bb92.2240cc')" placement="top-start">
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
          :label="$t('6648bb92.350fd3')"
          header-align="center"
          prop="order_holder"
        >
          <template slot-scope="scope">
            {{ getOrderCategoryName(scope.row.order_holder) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="total_fee"
          width="120"
          :label="$t('6648bb92.d194d2')"
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
          :label="$t('6648bb92.d443a9')"
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
          :label="$t('6648bb92.17b4aa')"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ (scope.row.cost_fee / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          :label="$t('6648bb92.4dd437')"
          align="right"
          header-align="center"
        >
          <template slot-scope="scope">
            {{ (scope.row.freight_fee || 0) / 100 }}
          </template>
        </el-table-column>

        <el-table-column prop="mobile" :label="$t('6648bb92.808d6c')">
          <template slot-scope="scope">
            <div class="order-num">
              {{ scope.row.salesman_mobile }}
              <el-tooltip
                v-if="datapass_block == 0"
                effect="dark"
                :content="$t('6648bb92.79d3ab')"
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
                :content="$t('6648bb92.79d3ab')"
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
        <el-table-column prop="mobile" :label="$t('6648bb92.a32da1')">
          <template slot-scope="scope">
            <template v-if="!scope.row.user_delete && login_type !== 'merchant'">
              <router-link
                v-if="login_type != 'distributor' && login_type != 'supplier'"
                target="_blank"
                :to="{
                  path: `${
                    login_type != 'distributor'
                      ? '/member/member/memberlist/detail'
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
                :content="$t('6648bb92.79d3ab')"
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
                :content="$t('6648bb92.79d3ab')"
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
        <el-table-column prop="distributor_name" :label="$t('6648bb92.53cc55')" />
        <!-- <el-table-column prop="supplier_name" v-if="VERSION_STANDARD() || IS_ADMIN()" label="来源供应商" >
      </el-table-column> -->
        <!-- <el-table-column prop="receiver_name" label="收货人" /> -->
        <template v-if="login_type != 'merchant'">
          <el-table-column v-if="!isMicorMall" :label="$t('6648bb92.5cd56b')">
            <template slot-scope="scope">
              {{ getOrderType(scope.row) }}
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="order_status" :label="$t('6648bb92.86f6cf')">
          <template slot-scope="scope">
            {{ scope.row.order_status_msg }}
          </template>
        </el-table-column>
        <el-table-column prop="order_status" :label="$t('6648bb92.529711')" />
        <el-table-column prop="order_status" :label="$t('6648bb92.186acb')" />
        <el-table-column prop="order_status" :label="$t('6648bb92.01a1fd')">
          <template slot-scope="scope">
            {{ scope.row.order_status_msg }}
          </template>
        </el-table-column>
        <el-table-column prop="order_status" :label="$t('6648bb92.ce19e6')" />

        <!-- <el-table-column prop="salespersonname " label="业务员"></el-table-column> -->
        <el-table-column :label="$t('6648bb92.edfe4c')">
          <template slot-scope="scope">
            {{ getDistributionType(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('6648bb92.553e84')">
          <template slot-scope="scope">
            {{ getDistributionStatus(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('6648bb92.b7765e')">
          <template slot-scope="scope">
            {{ scope.row.self_delivery_operator_name }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('6648bb92.1138a9')">
          <template slot-scope="scope">
            {{
              scope.row.self_delivery_operator_name &&
              scope.row.self_delivery_fee / 100 + $t('6648bb92.c16655')
            }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('6648bb92.f3fa72')">
          <template slot-scope="scope">
            {{ scope.row.self_delivery_operator_mobile }}
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" fixed="left" />
        <!-- <el-table-column prop="source_name" label="来源"></el-table-column> -->
        <el-table-column :label="$t('6648bb92.2b6bc0')" fixed="left">
          <template slot-scope="scope">
            <el-button type="text" style="margin-right: 8px">
              <router-link
                :to="`${$route.path}/detail?orderId=${scope.row.order_id}&resource=${$route.path}`"
              >
                {{ $t('6648bb92.f26225') }}
              </router-link>
            </el-button>
            <el-popover placement="right" trigger="hover">
              <div class="operating-icons">
                <el-button type="text">
                  <router-link
                    :to="`${$route.path}/process?orderId=${scope.row.order_id}&resource=${$route.path}`"
                  >
                    {{ $t('6648bb92.456d29') }}
                  </router-link>
                </el-button>
                <template v-for="(btn, index) in scope.row.actionBtns">
                  <el-button
                    :key="`btn-item__${index}`"
                    type="text"
                    @click="handleAction(scope.row, btn)"
                  >
                    {{ btn.nameKey ? $t(btn.nameKey) : btn.name }}
                  </el-button>
                </template>
              </div>
              <el-button slot="reference" type="text">
                {{ $t('6648bb92.0ec9ea') }}<i class="el-icon-d-arrow-right" />
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
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
      :title="$t('6648bb92.ad9f9a', { orderId: remarkForm.orderId })"
      :form="remarkForm"
      :form-list="remarkFormList"
      @onSubmit="onRemarkSubmit"
    />

    <!-- 取消订单 -->
    <SpDialog
      ref="cancelOrderDialogRef"
      v-model="cancelOrderDialog"
      class="dialog-cancelorder"
      :title="$t('6648bb92.20d620', { orderId: cancelOrderForm.order_id })"
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
      :title="$t('6648bb92.ff1901', { orderId: deliverGoodsForm.order_id })"
      :form="deliverGoodsForm"
      :form-list="deliverGoodsFormList"
      @onSubmit="deliverGoodsSubmit"
    />

    <!-- 更新发货 -->
    <SpDialog
      ref="updateDeliverGoodsDialogRef"
      v-model="updateDeliverGoodsDialog"
      width="1000px"
      :title="$t('6648bb92.bda57d', { orderId: updateDeliverGoodsForm.order_id })"
      :form="updateDeliverGoodsForm"
      :form-list="updateDeliverGoodsFormList"
      @onSubmit="updateDeliverGoodsSubmit"
    />

    <!-- 核销 -->
    <SpDialog
      ref="writeOffDialogRef"
      v-model="writeOffDialog"
      :title="$t('6648bb92.f309ed', { orderId: writeOffForm.order_id })"
      :form="writeOffForm"
      :form-list="writeOffFormList"
      @onSubmit="writeOffSubmit"
    />

    <!-- 退款审核 -->
    <SpDialog
      ref="refundRef"
      v-model="refundDialog"
      :title="$t('6648bb92.eaf4b8', { orderId: refundForm.order_id })"
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
      :title="$t('6648bb92.2558af', { orderId: changePriceForm.order_id })"
      :form="changePriceForm"
      :form-list="changePriceFormList"
      @onSubmit="changePriceSubmit"
    />

    <!-- 发货 -->
    <SpDialog
      ref="personnel"
      v-model="personnelDialog"
      :title="statusPersonnel ? $t('6648bb92.531827') : $t('6648bb92.204fe4')"
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
  ROLE_LIST,
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
        salespersonname: '',
        role: ''
      },
      deliveryPersonnel: [], //配送员信息
      datapass_block: 1, // 是否为数据脱敏
      subDistrictList: [],
      roleList: ROLE_LIST,
      distributionType: DISTRIBUTION_TYPE,
      distributionStatus: DISTRIBUTION_STATUS,
      orderStatus: VERSION_B2C()
        ? ORDER_B2C_STATUS
        : VERSION_IN_PURCHASE()
        ? IN_PURCHASE_STATUS
        : ORDER_STATUS,
      orderType: ORDER_TYPE,
      invoiceStatus: INVOICE_STATUS,
      orderCategory: this.VERSION_STANDARD()
        ? ORDER_CATEGORY.filter((item) => item.value != 'distributor')
        : ORDER_CATEGORY,
      pickerOptions: PICKER_DATE_OPTIONS,
      orderSourceList: [],
      remarkDialog: false,
      remarkFormList: [
        {
          label: this.$t('6648bb92.703f63'),
          key: 'remark',
          type: 'textarea',
          maxlength: 150,
          placeholder: this.$t('6648bb92.bd36b6'),
          required: true,
          message: this.$t('6648bb92.281bad')
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
          component: () => <div class='tip-bar'>{this.$t('6648bb92.ef5069')}</div>
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
          label: this.$t('6648bb92.27910a'),
          key: 'cancel_reason',
          placeholder: this.$t('6648bb92.bc4a11'),
          type: 'select',
          options: [
            { title: this.$t('6648bb92.8f038a'), value: 1 },
            { title: this.$t('6648bb92.5e58ba'), value: 2 },
            { title: this.$t('6648bb92.151111'), value: 3 },
            { title: this.$t('6648bb92.baa450'), value: 4 },
            { title: this.$t('6648bb92.3013ee'), value: 5 },
            { title: this.$t('6648bb92.e7197e'), value: 6 },
            { title: this.$t('6648bb92.74c00b'), value: 7 },
            { title: this.$t('6648bb92.16264a'), value: 8 },
            { title: this.$t('6648bb92.13bea0'), value: 9 },
            { title: this.$t('6648bb92.0e6c86'), value: 10 },
            { title: this.$t('6648bb92.e21052'), value: 11 },
            { title: this.$t('6648bb92.94490e'), value: 12 }
          ],
          required: true,
          message: this.$t('6648bb92.281bad'),
          onChange: (e) => {
            if (e == 12) {
              this.cancelOrderFormList[3].isShow = true
            } else {
              this.cancelOrderFormList[3].isShow = false
            }
          }
        },
        {
          label: this.$t('6648bb92.748ea8'),
          key: 'other_reason',
          type: 'input',
          placeholder: this.$t('6648bb92.c6af7d'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.cancelOrderForm.cancel_reason == 12 && !value) {
              callback(new Error(this.$t('6648bb92.281bad')))
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
          label: this.$t('6648bb92.084920'),
          key: 'delivery_way',
          type: 'radio',
          disabled: true,
          options: [
            { label: '1', name: this.$t('6648bb92.705d54') },
            { label: '2', name: this.$t('6648bb92.0e903e') }
          ],
          onChange: (e) => {
            if (e == '1') {
              this.deliverGoodsFormList[1].options = [
                { label: 'batch', name: this.$t('6648bb92.afb426') },
                { label: 'sep', name: this.$t('6648bb92.95d243') }
              ]
              this.deliverGoodsFormList[3].options = this.logisticsList.filter(
                (item) => item.value != 'SELF_DELIVERY'
              )
              this.deliverGoodsForm.delivery_corp = ''
            } else {
              this.deliverGoodsFormList[1].options = [
                { label: 'batch', name: this.$t('6648bb92.afb426') }
              ]
              this.deliverGoodsForm.delivery_type = 'batch'
              this.deliverGoodsFormList[3].options = this.logisticsList.filter(
                (item) => item.value == 'SELF_DELIVERY'
              )
              this.deliverGoodsForm.delivery_corp = 'SELF_DELIVERY'
            }
          }
        },
        {
          label: this.$t('6648bb92.b01994'),
          key: 'delivery_type',
          type: 'radio',
          disabled: false,
          options: [
            { label: 'batch', name: this.$t('6648bb92.afb426') },
            { label: 'sep', name: this.$t('6648bb92.95d243') }
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
            { title: this.$t('6648bb92.de5472'), key: 'item_name' },
            {
              title: this.$t('6648bb92.2af133'),
              key: 'item_holder',
              render: (row, column, cell) => {
                return this.goodCategoryMap[row.item_holder]
              }
            },
            {
              title: this.$t('6648bb92.55c61d'),
              key: 'supplier_name',
              width: 100,
              isShow: ({ key }, value) => {
                return this.VERSION_STANDARD() || this.IS_ADMIN()
              }
            },
            { title: this.$t('6648bb92.0bf60b'), key: 'num', width: 60 },
            { title: this.$t('6648bb92.745165'), key: 'delivery_item_num', width: 100 },
            { title: this.$t('6648bb92.e95382'), key: 'price', width: 120 },
            {
              title: this.$t('6648bb92.066804'),
              key: 'cost_price',
              width: 100,
              render: (row, column, cell) => {
                return row.cost_price / 100
              }
            },
            {
              title: this.$t('6648bb92.4f5a46'),
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
          label: this.$t('6648bb92.f3af96'),
          key: 'delivery_corp',
          placeholder: this.$t('6648bb92.8367e8'),
          type: 'select',
          options: [],
          required: true,
          message: this.$t('6648bb92.281bad')
        },
        {
          label: this.$t('6648bb92.0bb075'),
          key: 'delivery_code',
          type: 'input',
          placeholder: this.$t('6648bb92.0e9f1e'),
          required: true,
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '1'
          },
          message: this.$t('6648bb92.281bad')
        },
        {
          label: this.$t('6648bb92.b7765e'),
          key: 'self_delivery_operator_id',
          placeholder: this.$t('6648bb92.531b32'),
          type: 'select',
          options: [],
          required: true,
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          },
          message: this.$t('6648bb92.281bad'),
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
          label: this.$t('6648bb92.ec9c94'),
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
          label: this.$t('6648bb92.fb92e9'),
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
          label: this.$t('6648bb92.553e84'),
          key: 'self_delivery_status',
          placeholder: this.$t('6648bb92.99ad85'),
          type: 'select',
          options: [{ title: this.$t('6648bb92.739c91'), value: 'DELIVERING' }],
          required: true,
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          },
          message: this.$t('6648bb92.281bad')
        },
        {
          label: this.$t('6648bb92.6d9262'),
          key: 'delivery_remark',
          type: 'input',
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          }
        },
        {
          label: this.$t('6648bb92.b34dc8'),
          key: 'delivery_pics',
          isShow: ({ key }, value) => {
            return value['delivery_way'] == '2'
          },
          component: ({ key }, value) => <SpImagePicker v-model={value[key]} drag max={9} />,
          tip: this.$t('6648bb92.6a7999')
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
            { title: this.$t('6648bb92.de5472'), key: 'item_name' },
            { title: this.$t('6648bb92.0bf60b'), key: 'num', width: 60 },
            { title: this.$t('6648bb92.745165'), key: 'delivery_item_num', width: 100 },
            { title: this.$t('6648bb92.e95382'), key: 'price', width: 120 }
          ]
        }
      ],
      writeOffForm: {
        order_id: '',
        pickupcode: '',
        items: []
      },
      goodCategoryMap: GOOD_CATEGORY_MAP,
      refundDialog: false,
      refundFormList: [
        {
          label: this.$t('6648bb92.60d99e'),
          key: 'source',
          type: 'text'
        },
        {
          label: this.$t('6648bb92.5ba072'),
          key: 'applyTime',
          type: 'text'
        },
        {
          label: this.$t('6648bb92.db7c80'),
          key: 'refundStatus',
          type: 'text'
        },
        {
          label: this.$t('6648bb92.93b365'),
          key: 'process',
          type: 'text'
        },
        {
          label: this.$t('6648bb92.a0cd4c'),
          key: 'refundPrice',
          type: 'text'
        },
        {
          label: this.$t('6648bb92.84a92e'),
          key: 'freight_fee',
          type: 'text',
          component: ({ key }, value) => {
            return (
              <div>{value[key] > 0 ? this.$t('6648bb92.0a60ac') : this.$t('6648bb92.c9744f')}</div>
            )
          }
        },
        {
          label: this.$t('6648bb92.406376'),
          key: 'freight_fee',
          type: 'text',
          component: ({ key }, value) => {
            return <div>{value[key] > 0 ? value[key] / 100 : 0}</div>
          }
        },
        {
          label: this.$t('6648bb92.0c9d2b'),
          key: 'payType',
          type: 'text'
        },
        {
          label: this.$t('6648bb92.4a3df6'),
          key: 'reason',
          type: 'text'
        },
        {
          label: this.$t('6648bb92.9eb71d'),
          key: 'check_cancel',
          type: 'radio',
          options: [
            { label: '0', name: this.$t('6648bb92.1bf19c') },
            { label: '1', name: this.$t('6648bb92.e61f2c') }
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
          label: this.$t('6648bb92.f48f94'),
          key: 'shop_reject_reason',
          type: 'input',
          placeholder: this.$t('6648bb92.fc955a'),
          isShow: () => {
            return this.refundForm.check_cancel == '0'
          },
          validator: (rule, value, callback) => {
            if (this.refundFormList.check_cancel == '0' && !value) {
              callback(new Error(this.$t('6648bb92.281bad')))
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
          component: () => <div class='tip-bar'>{this.$t('6648bb92.596d85')}</div>
        },
        {
          component: () => (
            <div class='receive-info'>
              <div class='receive-item'>
                <label class='item-label'>{this.$t('6648bb92.60db2a')}</label>
                {`${this.changePriceForm.buy_member} | ${this.changePriceForm.buy_mobile}`}
              </div>
              <div class='receive-item'>
                <label class='item-label'>
                  {this.changePriceForm.isZiti
                    ? this.$t('6648bb92.6b1044')
                    : this.$t('6648bb92.02ddb4')}
                </label>
                {`${this.changePriceForm.receive_name} | ${this.changePriceForm.receive_mobile}`}
              </div>
              <div class='receive-item'>
                <label class='item-label'>
                  {this.changePriceForm.isZiti
                    ? this.$t('6648bb92.d87411')
                    : this.$t('6648bb92.e512d6')}
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
          label: this.$t('6648bb92.1e8dc2'),
          key: 'order_id',
          placeholder: this.$t('6648bb92.e9e836'),
          type: 'input',
          disabled: true,
          required: true,
          message: this.$t('6648bb92.4dcdc1')
        },
        {
          label: this.$t('6648bb92.b7765e'),
          key: 'self_delivery_operator_id',
          type: 'select',
          options: [],
          required: true,
          message: this.$t('6648bb92.545c2c'),
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
          label: this.$t('6648bb92.f3af96'),
          key: 'delivery_corp',
          placeholder: this.$t('6648bb92.8367e8'),
          type: 'select',
          options: [],
          disabled: true
        },
        {
          label: this.$t('6648bb92.d8438a'),
          key: 'orders_delivery_id',
          type: 'input',
          placeholder: ' ',
          disabled: true
        },
        {
          label: this.$t('6648bb92.b7765e'),
          key: 'self_delivery_operator_id',
          placeholder: this.$t('6648bb92.531b32'),
          type: 'select',
          display: 'inline',
          disabled: true,
          options: [],
          required: true,
          message: this.$t('6648bb92.281bad'),
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
          label: this.$t('6648bb92.ec9c94'),
          key: 'self_delivery_operator_mobile',
          type: 'input',
          display: 'inline',
          placeholder: ' ',
          disabled: true
        },
        {
          label: this.$t('6648bb92.553e84'),
          key: 'self_delivery_status',
          placeholder: this.$t('6648bb92.99ad85'),
          type: 'select',
          options: [],
          required: true,
          message: this.$t('6648bb92.281bad')
        },
        {
          label: this.$t('6648bb92.6d9262'),
          key: 'delivery_remark',
          type: 'input'
        },
        {
          label: this.$t('6648bb92.b34dc8'),
          key: 'delivery_pics',
          component: ({ key }, value) => <SpImagePicker v-model={value[key]} drag max={9} />,
          tip: this.$t('6648bb92.6a7999')
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
          { label: 'batch', name: this.$t('6648bb92.afb426') },
          { label: 'sep', name: this.$t('6648bb92.95d243') }
        ]
        this.deliverGoodsFormList[3].options = this.logisticsList.filter(
          (item) => item.value != 'SELF_DELIVERY'
        )
        this.deliverGoodsForm.delivery_corp = ''
        this.deliverGoodsFormList[5].required = false
        this.deliverGoodsFormList[8].required = false
        this.deliverGoodsFormList[4].required = true
      } else {
        this.deliverGoodsFormList[1].options = [
          { label: 'batch', nameKey: '6648bb92.afb426', name: this.$t('6648bb92.afb426') }
        ]
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
        ;(ele.value = ele.operator_id), (ele.title = ele.username)
      })
      this.personnelFormList[1].options = res.list
      this.deliverGoodsFormList[5].options = res.list
      this.updateDeliverGoodsFormList[2].options = res.list
    },
    // 分配配送员
    assignPersonnel(val) {
      if (this.selectList.length != 1) {
        return this.$message.error(this.$t('6648bb92.8e1023'))
      }

      const { order_id, self_delivery_status, distributor_id, self_delivery_operator_id } =
        this.selectList[0]

      if (!val) {
        // 已接单，配送中才能取消配送
        this.personnelFormList[1].required = false
        if (!['RECEIVEORDER', 'DELIVERING'].includes(self_delivery_status)) {
          return this.$message.error(this.$t('6648bb92.6220dd'))
        }
      } else {
        // if (!['CONFIRMING', 'PACKAGED'].includes(self_delivery_status)) {
        //   return this.$message.error('该订单无法分配配送员！')
        // }
        if (self_delivery_operator_id != 0) {
          return this.$message.error(this.$t('6648bb92.dedc31'))
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
          message: this.$t('6648bb92.f54845'),
          type: 'success'
        })
        this.personnelDialog = false
      } else {
        await this.$api.trade.orderCancelDeliverystaff({ order_id: this.personnelForm.order_id })
        this.$message({
          message: this.$t('6648bb92.285f58'),
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
        ;(ele.value = ele.operator_id), (ele.title = ele.username)
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

        if (
          receipt_type == 'ziti' ||
          ((VERSION_STANDARD() || distributor_id == 0) && order_holder != 'supplier') ||
          this.login_type == 'distributor'
        ) {
          if (
            !isDada &&
            cancel_status == 'NO_APPLY_CANCEL' &&
            ['NOTPAY', 'PAYED'].includes(order_status) &&
            ziti_status != 'DONE'
          ) {
            // 非同城配的取消订单按钮
            if (!isDada || (isDada && ['0', '1'].includes(dada.data_status))) {
              if (receipt_type == 'ziti') {
                //如果是自提，商家订单店铺端才可以取消
                if (
                  (order_holder == 'distributor' && IS_DISTRIBUTOR()) ||
                  (IS_ADMIN() && order_holder != 'distributor')
                ) {
                  actionBtns.push({ nameKey: '6648bb92.b21b5e', key: 'cancel' })
                }
              } else {
                actionBtns.push({ nameKey: '6648bb92.b21b5e', key: 'cancel' })
              }
            }
          }
          //待自提
          if (order_status == 'PAYED' && receipt_type == 'ziti' && ziti_status == 'PENDING') {
            //商家自提订单只有在店铺端（暂时与后端商量是去除这个判断，后续有问题在看具体怎么处理）
            // if((order_holder == 'distributor' && IS_DISTRIBUTOR()) || (IS_ADMIN() && order_holder != 'distributor')){
            actionBtns.push({ nameKey: '6648bb92.e7d31e', key: 'writeOff' })
            // }
          }

          if (
            isDada &&
            ['NO_APPLY_CANCEL', 'FAILS'].includes(cancel_status) &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            dada.dada_status == '0'
          ) {
            actionBtns.push({ nameKey: '6648bb92.7d4577', key: 'takeOrder' })
          }

          if (isDada && pay_status == 'PAYED' && dada.dada_status == '9') {
            actionBtns.push({ nameKey: '6648bb92.f1557d', key: 'orderSendBack' })
          }

          if (
            (isLogistics || is_logistics || isSelfDelivery) &&
            !isDada &&
            order_status == 'PAYED' &&
            delivery_status != 'DONE' &&
            receipt_type != 'ziti' &&
            cancel_status != 'WAIT_PROCESS' //待退款不展示发货按钮
            // && this.login_type == 'supplier'
          ) {
            actionBtns.push({ nameKey: '6648bb92.045315', key: 'deliverGoods' })
          }

          if (cancel_status == 'WAIT_PROCESS' && order_status == 'PAYED') {
            actionBtns.push({ nameKey: '6648bb92.44c198', key: 'refund' })
          }

          if (is_invoiced == '0' && invoice) {
            actionBtns.push({ nameKey: '6648bb92.963609', key: 'waitInvoice' })
          }

          if (
            receipt_type == 'merchant' &&
            order_status == 'WAIT_BUYER_CONFIRM' &&
            self_delivery_status != 'DONE'
          ) {
            actionBtns.push({ nameKey: '6648bb92.59d9e1', key: 'updatedelivery' })
          }

          if (
            receipt_type == 'merchant' &&
            ['CONFIRMING', 'RECEIVEORDER'].includes(self_delivery_status) &&
            order_status === 'PAYED'
          ) {
            actionBtns.push({ nameKey: '6648bb92.891cb5', key: 'confirmpackag' })
          }

          actionBtns.push({ nameKey: '6648bb92.2432b5', key: 'remark' })
        } else if (order_holder == 'supplier') {
          //供应商订单有取消和备注
          if (
            !isDada &&
            cancel_status == 'NO_APPLY_CANCEL' &&
            ['NOTPAY', 'PAYED'].includes(order_status) &&
            ziti_status != 'DONE'
          ) {
            // 非同城配的取消订单按钮
            if (!isDada || (isDada && ['0', '1'].includes(dada.data_status))) {
              actionBtns.push({ nameKey: '6648bb92.b21b5e', key: 'cancel' })
            }
          }

          actionBtns.push({ nameKey: '6648bb92.2432b5', key: 'remark' })
        }

        if (order_status == 'NOTPAY') {
          if (VERSION_PLATFORM()) {
            if ((this.IS_ADMIN() && distributor_id == 0) || this.IS_DISTRIBUTOR()) {
              actionBtns.push({ nameKey: '6648bb92.bb6d2b', key: 'changePrice' })
            }
          } else if (!VERSION_IN_PURCHASE()) {
            actionBtns.push({ nameKey: '6648bb92.bb6d2b', key: 'changePrice' })
          }
        }
        if (can_apply_aftersales == 1) {
          if (VERSION_PLATFORM()) {
            if ((this.IS_ADMIN() && distributor_id == 0) || this.IS_DISTRIBUTOR()) {
              actionBtns.push({ nameKey: '6648bb92.45eb0c', key: 'salesAfter' })
            }
          } else if (!VERSION_IN_PURCHASE()) {
            actionBtns.push({ nameKey: '6648bb92.45eb0c', key: 'salesAfter' })
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
    getOrderCategoryName(order_holder) {
      return this.orderCategory.find((item) => item.value == order_holder)?.title ?? ''
    },
    getOrderType({ order_class, type }) {
      if (order_class == 'normal') {
        return type == '1' ? this.$t('d41d8cd9.e9f0g1') : this.$t('d41d8cd9.h2i3j4')
      }
      const fd = ORDER_TYPE.find((item) => item.value == order_class)
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
      this.logisticsList.push({ title: this.$t('d41d8cd9.k5l6m7'), value: 'SELF_DELIVERY' })
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
        // 已对接 OMS 时仅供应商端可发货，其余端不可操作
        if (this.isBindOMS && !IS_SUPPLIER()) {
          return this.$message.warning(this.$t('d41d8cd9.n8o9p0'))
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
        this.$confirm(this.$t('6648bb92.f3e80d'), this.$t('6648bb92.c1b226'), {
          confirmButtonText: this.$t('08fc23a1.38cf16'),
          cancelButtonText: this.$t('08fc23a1.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.doBusinessReceipt(order_id)
          this.$message.success(this.$t('6648bb92.740ca1'))
        })
      } else if (key == 'orderSendBack') {
        this.$confirm(this.$t('6648bb92.f1557d'), this.$t('6648bb92.df2e45'), {
          confirmButtonText: this.$t('08fc23a1.38cf16'),
          cancelButtonText: this.$t('08fc23a1.625fb2'),
          type: 'warning'
        }).then(async () => {
          await this.$api.trade.confirmBack(order_id)
          this.$message.success(this.$t('6648bb92.2ab3ab'))
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
          source: cancel_from == 'buyer' ? this.$t('c95ea121.a54c66') : this.$t('c95ea121.ca6dd8'),
          applyTime: moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          refundStatus: REFUND_STATUS[refund_status],
          process: REFUND_PROCESS[progress],
          refundPrice: `${fee_symbol}${total_fee / 100}`,
          payType: pay_channel ? PAY_TYPE[pay_channel] : PAY_TYPE[pay_type],
          reason: cancel_reason
        }
      } else if (key == 'waitInvoice') {
        this.$confirm(this.$t('6648bb92.23d4a7'), this.$t('e8e4e935.02d981'), {
          cancelButtonText: this.$t('08fc23a1.625fb2'),
          confirmButtonText: this.$t('08fc23a1.38cf16'),
          type: 'warning'
        }).then(async () => {
          const { success } = await this.$api.trade.isInvoiced({
            order_id: order_id,
            status: 1
          })
          this.fetchList()
          if (success) {
            this.$message.success(this.$t('6648bb92.ee73ff'))
          } else {
            this.$message.error(this.$t('6648bb92.34b438'))
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
          this.updateDeliverGoodsFormList[4].options = [
            { title: this.$t('c95ea121.739c91'), value: 'DELIVERING' }
          ]
          this.updateDeliverGoodsFormList[2].disabled = false
        } else {
          this.updateDeliverGoodsFormList[2].disabled = true
          this.updateDeliverGoodsFormList[4].options = [
            { title: this.$t('c95ea121.f87f48'), value: 'DONE' },
            { title: this.$t('c95ea121.2111cc'), value: 'CONFIRMING' }
          ]
        }
      } else if (key == 'confirmpackag') {
        this.$confirm(this.$t('6648bb92.607845'), this.$t('6648bb92.de6f83'), {
          confirmButtonText: this.$t('08fc23a1.38cf16'),
          cancelButtonText: this.$t('08fc23a1.625fb2')
        }).then(async () => {
          await this.$api.trade.confirmpackag({ order_id })
          this.$message.success(this.$t('6648bb92.9a94fc'))
          this.fetchList()
        })
      }
    },
    onLoadCancelOrderRef() {
      this.cancelOrderForm.loading = false
    },
    async onRemarkSubmit() {
      await this.$api.order.remarks(this.remarkForm)
      this.$message.success(this.$t('6648bb92.c75e91'))
      this.remarkDialog = false
      this.fetchList()
    },
    async onCancelOrderSubmit() {
      const { order_id } = this.cancelOrderForm
      console.log(this.cancelOrderForm)
      await this.$api.trade.cancelOrderConfirm(order_id, this.cancelOrderForm)
      this.cancelOrderDialog = false
      this.$message.success(this.$t('6648bb92.c771bd'))
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
      this.$message.success(this.$t('6648bb92.a3869d'))
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
        this.$message.success(this.$t('6648bb92.de3b52'))
      } else {
        this.$message.error(this.$t('6648bb92.2249c1'))
      }
    },
    async writeOffSubmit() {
      const { order_id } = this.writeOffForm
      const { ziti_status } = await this.$api.trade.doWriteoff(order_id, this.writeOffForm)
      if (ziti_status == 'DONE') {
        this.$message.success(this.$t('6648bb92.b8ba0a'))
      } else {
        this.$message.error(this.$t('6648bb92.47c5ff'))
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
        this.$message.success(this.$t('6648bb92.a41119'))
      } else if (refund_status == 'SHOP_CHECK_FAILS') {
        this.$message.success(this.$t('6648bb92.ff3161'))
      } else {
        this.$message.error(this.$t('6648bb92.f74090'))
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
          this.$message.success(this.$t('6648bb92.3e1ddd'))
          this.$export_open('invoice')
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error(this.$t('6648bb92.c849e4'))
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

    async handleExport(command) {
      if (command === 'exportInvoice') {
        this.exportInvoice()
      } else if (command === 'exportDataMaster') {
        this.exportDataMaster()
      } else if (command === 'exportDataNormal') {
        this.exportDataNormal()
      }
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
          this.$message.success(this.$t('6648bb92.3e1ddd'))
          this.$export_open(type)
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error(this.$t('6648bb92.c849e4'))
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
      this.$message.success(this.$t('6648bb92.7bbfaa'))
      this.fetchList()
    },
    async uploadHandlePatchCancel(file) {
      const params = {
        isUploadFile: true,
        file_type: 'normal_orders_cancel',
        file: file.raw
      }
      await this.$api.common.handleUploadFile(params)
      this.$message.success(this.$t('6648bb92.7bbfaa'))
      this.fetchList()
    },
    async getPickupcodeSetting() {
      const { pickupcode_status } = await this.$api.company.getPickupcodeSetting()
      if (!pickupcode_status) return
      this.writeOffFormList.push({
        label: this.$t('6648bb92.a5a7dd'),
        key: 'pickupcode',
        type: 'input',
        placeholder: this.$t('6648bb92.ba231e'),
        required: true,
        message: this.$t('6648bb92.281bad')
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
