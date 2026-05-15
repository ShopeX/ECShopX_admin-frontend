<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('3cdfcea1.168447')">
    <template slot="page-footer">
      <div v-if="btnActions.length > 0" class="text-center">
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
    </template>
    <div v-loading="loading" class="page-order-index">
      <el-card class="el-card--normal">
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
        <div slot="header">{{ $t('3cdfcea1.ba9c75') }}</div>
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
        <div slot="header">{{ $t('3cdfcea1.9bf857') }}</div>
        <div class="card-panel">
          <span class="card-panel__value">{{ memberRemark || $t('3cdfcea1.101e5b') }}</span>
        </div>
      </el-card>

      <el-card class="el-card--normal">
        <div slot="header">{{ $t('3cdfcea1.1971f2') }}</div>
        <div class="card-panel">
          <span class="card-panel__value">{{ merchantRemark || $t('3cdfcea1.2a450f') }}</span>
        </div>
      </el-card>

      <el-card class="el-card--normal">
        <div slot="header">{{ $t('3cdfcea1.08ea4e') }}</div>
        <div class="card-panel">
          <el-table v-if="orderInfo" border :data="orderInfo.items">
            <el-table-column prop="item_id" :label="$t('3cdfcea1.858526')" width="80" />
            <el-table-column prop="pic" :label="$t('3cdfcea1.9b94b1')" width="120">
              <template slot-scope="scope">
                <el-image class="item-image" fit="fill" :src="`${wximageurl}${scope.row.pic}`" />
              </template>
            </el-table-column>
            <el-table-column prop="item_name" :label="$t('3cdfcea1.1fd1d5')" width="180">
              <template slot-scope="scope">
                <div class="ell3">
                  <el-tag
                    v-if="scope.row.is_prescription == 1"
                    type="primary"
                    size="mini"
                    style="background-color: #fff"
                  >
                    {{ $t('3cdfcea1.e8b7e1') }}
                  </el-tag>
                  {{ scope.row.item_name }}
                </div>
                <el-tag v-if="scope.row.order_item_type == 'gift'" size="mini" type="success">
                  {{ $t('3cdfcea1.d017cc') }}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column v-if="orderInfo.prescription_status" prop="instructions" label="处方用量" width="160" /> -->
            <el-table-column prop="item_holder" :label="$t('3cdfcea1.2af133')" width="100">
              <template slot-scope="scope">
                <div class="ell3">
                  {{ $t(goodCategoryMap[scope.row.item_holder]) }}
                </div>
              </template>
            </el-table-column>

            <!--          <el-table-column prop="item_spec_desc" label="SPU编码">-->
            <!--            <template slot-scope="scope">-->
            <!--              {{ scope.row.goods_bn }}-->
            <!--            </template>-->
            <!--          </el-table-column>-->
            <el-table-column prop="item_spec_desc" :label="$t('3cdfcea1.b54bd0')">
              <template slot-scope="scope">
                {{ scope.row.item_bn }}
              </template>
            </el-table-column>
            <el-table-column prop="item_spec_desc" :label="$t('3cdfcea1.ea887b')">
              <template slot-scope="scope">
                {{ scope.row.item_spec_desc ? scope.row.item_spec_desc : $t('3cdfcea1.048df4') }}
              </template>
            </el-table-column>

            <el-table-column
              v-if="orderInfo.prescription_status"
              prop="medicine_symptom_set"
              :label="$t('3cdfcea1.0b00b0')"
              width="160"
            >
              <template slot-scope="scope">
                <div v-for="item in scope.row.medicine_symptom_set" :key="item.id">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="supplier_name" :label="$t('3cdfcea1.55c61d')" width="120">
              <template slot-scope="scope">
                {{ scope.row.supplier_name ? scope.row.supplier_name : $t('3cdfcea1.491c0c') }}
              </template>
            </el-table-column>
            <el-table-column prop="price" :label="$t('3cdfcea1.6bf871')" width="100">
              <template slot-scope="scope">
                {{ (scope.row.price / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="cost_price" :label="$t('3cdfcea1.17b4aa')" width="100">
              <template slot-scope="scope">
                {{ (scope.row.cost_price / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="cost_price" :label="$t('3cdfcea1.066804')" width="100">
              <template slot-scope="scope">
                {{ (scope.row.cost_price / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="num" :label="$t('3cdfcea1.0bf60b')" width="80" />
            <el-table-column
              v-if="orderInfo.type == '1'"
              prop="price"
              :label="$t('3cdfcea1.ecd6be')"
              width="120"
            >
              <template slot-scope="scope">
                <span>{{ (scope.row.taxable_fee / 100).toFixed(2) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('3cdfcea1.5746e7')" width="120">
              <template slot-scope="scope">
                {{ (scope.row.item_fee / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('3cdfcea1.95f245')" width="120">
              <template slot-scope="scope">
                {{ (scope.row.cost_fee / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('3cdfcea1.1f1eac')" width="120">
              <template slot-scope="scope">
                {{ (scope.row.cost_fee / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="!VERSION_IN_PURCHASE()"
              :label="$t('3cdfcea1.5c7afc')"
              width="120"
            >
              <template slot-scope="scope">
                {{ (scope.row.member_discount / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('3cdfcea1.2ecbc8')" width="120">
              <template slot-scope="scope">
                {{ (scope.row.point_fee / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('3cdfcea1.e95382')" width="120">
              <template slot-scope="scope">
                {{ (scope.row.total_fee / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('3cdfcea1.aae045')" width="100">
              <template slot-scope="scope">
                {{ (scope.row.discount_fee / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="!VERSION_IN_PURCHASE() && !VERSION_STANDARD()"
              :label="$t('3cdfcea1.f8d735')"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.fee_rate }}</span>
              </template>
            </el-table-column>
            <template v-if="orderInfo.delivery_status == 'DONE' && orderInfo.delivery_corp">
              <el-table-column :label="$t('3cdfcea1.c3c7a1')">
                <template slot-scope="scope">
                  <span>{{ $t('3cdfcea1.355409') }}</span>
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
                  {{ $t('3cdfcea1.49e56c') }}
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
        <div slot="header">{{ $t('3cdfcea1.a58517') }}</div>
        <el-row class="card-panel">
          <el-col
            v-for="(item, index) in payList"
            v-if="item.is_show"
            :key="`pay-grid__${index}`"
            class="card-panel-item"
            :span="6"
          >
            <span class="card-panel__label">{{ item.label }}</span>
            <span class="card-panel__value">{{ getFiledValue(item.field) }}</span>
          </el-col>
        </el-row>
        <div class="pay-voucher-full-row">
          <el-row class="card-panel pay-voucher-full-row__row">
            <el-col :span="24" class="card-panel-item pay-voucher-full-row__inner">
              <span class="card-panel__label">{{ $t('3cdfcea1.80930a') }}</span>
              <span class="card-panel__value pay-voucher-full-row__value">
                <el-image
                  v-if="getFiledValue('pos_payment_voucher_url')"
                  :src="getFiledValue('pos_payment_voucher_url')"
                  class="img-item pay-voucher-thumb"
                  fit="cover"
                  :preview-src-list="[getFiledValue('pos_payment_voucher_url')]"
                />
                <span v-else>-</span>
              </span>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <el-card v-if="!VERSION_IN_PURCHASE()" class="el-card--normal">
        <el-card v-if="invoice" class="el-card--normal">
          <div slot="header">{{ $t('3cdfcea1.714483') }}</div>
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
        <div slot="header">{{ $t('3cdfcea1.954493') }}</div>
        <div class="card-panel">
          <el-table
            v-if="orderInfo"
            border
            show-summary
            :sum-text="$t('3cdfcea1.ffbc0f')"
            :data="orderInfo.discount_info"
            style="max-width: 1000px"
          >
            <el-table-column prop="info" :label="$t('3cdfcea1.72606e')" />
            <el-table-column prop="discount_fee" :label="$t('3cdfcea1.e2c7b4')" />
            <el-table-column prop="rule" :label="$t('3cdfcea1.028f5b')" />
          </el-table>
        </div>
      </el-card>

      <!-- 处方药 -->
      <template v-if="orderInfo.prescription_status">
        <el-card
          v-if="orderInfo.diagnosis_data && Object.keys(orderInfo.diagnosis_data).length"
          class="el-card--normal"
        >
          <div slot="header">{{ $t('3cdfcea1.4cf941') }}</div>
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

        <el-card
          class="el-card--normal"
          v-if="orderInfo.prescription_data && Object.keys(orderInfo.prescription_data).length"
        >
          <div slot="header">{{ $t('3cdfcea1.bf3412') }}</div>
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
                <div v-if="item.type == 'cycle'">
                  <div
                    class="card-panel__value"
                    v-for="(item1, index1) in orderInfo.prescription_data[item.field]"
                    :key="index1"
                  >
                    <div>{{ item1.drugCommonName }}</div>
                    <div>{{ $t('3cdfcea1.6c9ae3') }}{{ item1.instructions }}</div>
                  </div>
                </div>
                <span v-if="!item.special" class="card-panel__value">{{
                  getFiledValue(item.field)
                }}</span>
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
        <div slot="header">{{ $t('3cdfcea1.24bc07') }}</div>
        <div v-if="orderInfo" class="card-panel">
          <div class="card-panel-item">
            <span class="card-panel__label">{{
              `${orderInfo.receipt_type == 'ziti' ? $t('3cdfcea1.818380') : $t('3cdfcea1.aec344')}:`
            }}</span>
            <span class="card-panel__value">{{ addressInfo }}</span>
          </div>

          <div
            v-if="orderInfo.receipt_type == 'ziti' && orderInfo.ziti_info"
            class="card-panel-item"
          >
            <span class="card-panel__label">{{ $t('3cdfcea1.6f1246') }}</span>
            <span class="card-panel__value">{{ orderInfo.receiver_name }}</span>
          </div>
          <div
            v-if="orderInfo.receipt_type == 'ziti' && orderInfo.ziti_info"
            class="card-panel-item"
          >
            <span class="card-panel__label">{{ $t('3cdfcea1.a7e362') }}</span>
            <span class="card-panel__value">{{
              `${orderInfo.ziti_info.pickup_date} ${orderInfo.ziti_info.pickup_time.join('~')}`
            }}</span>
          </div>
          <div
            v-if="orderInfo.receipt_type == 'ziti' && orderInfo.ziti_info"
            class="card-panel-item"
          >
            <span class="card-panel__label">{{ $t('3cdfcea1.733e3f') }}</span>
            <span class="card-panel__value">{{ orderInfo.receiver_mobile }}</span>
          </div>

          <div v-if="orderInfo.subdistrict_parent" class="card-panel-item">
            <span class="card-panel__label">{{ $t('3cdfcea1.093af0') }}</span>
            <span class="card-panel__value">{{ orderInfo.subdistrict_parent }}</span>
          </div>

          <div v-if="orderInfo.subdistrict" class="card-panel-item">
            <span class="card-panel__label">{{ $t('3cdfcea1.2431ae') }}</span>
            <span class="card-panel__value">{{ orderInfo.subdistrict }}</span>
          </div>

          <el-table border :data="deliveryData">
            <el-table-column prop="delivery_time" :label="$t('3cdfcea1.bfd255')" />
            <el-table-column prop="delivery_code" :label="$t('3cdfcea1.0bb075')" />
            <el-table-column prop="delivery_corp_name" :label="$t('3cdfcea1.f3af96')" />
            <el-table-column prop="supplier_name" :label="$t('3cdfcea1.55c61d')" />
            <el-table-column prop="delivery_corp" :label="$t('3cdfcea1.28acd4')" />
            <el-table-column :label="$t('3cdfcea1.2b6bc0')">
              <template slot-scope="scope">
                <template v-if="(IS_ADMIN() && scope.row.supplier_id == '0') || !IS_ADMIN()">
                  <el-button
                    v-if="
                      orderInfo.receipt_type === 'logistics' && orderInfo.order_status !== 'DONE'
                    "
                    type="text"
                    @click="modifyExpress(scope.row)"
                  >
                    {{ $t('3cdfcea1.95b351') }}
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <el-card class="el-card--normal">
        <div slot="header">{{ $t('3cdfcea1.15c09f') }}</div>
        <div v-if="orderInfo?.self_delivery_operator_name" class="card-panel">
          <div class="card-panel-item">
            <span
              >{{ $t('3cdfcea1.0bf1a7') }}{{ orderInfo.self_delivery_operator_name || '-' }}</span
            >
            <span class="ml-16"
              >{{ $t('3cdfcea1.ad1a76') }}{{ orderInfo.self_delivery_operator_mobile || '-' }}</span
            >
            <span class="ml-16"
              >{{ $t('3cdfcea1.ad365e') }}{{ orderInfo.self_delivery_fee / 100
              }}{{ $t('3cdfcea1.c16655') }}</span
            >
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
                <p>{{ $t('3cdfcea1.a7b805') }}{{ key.msg }}</p>
                <p v-if="key.delivery_remark">
                  {{ $t('3cdfcea1.82ad15') }}{{ key.delivery_remark }}
                </p>
                <div v-if="key.pics?.length">
                  {{ $t('3cdfcea1.6a1136') }}
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

      <!-- <el-card v-if="!VERSION_IN_PURCHASE && !VERSION_PLATFORM()" class="el-card--normal">
        <div slot="header">{{ $t('3cdfcea1.ee6cce') }}</div>
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
        :title="$t('3cdfcea1.92ca2e')"
        :form="expressForm"
        :form-list="expressFormList"
        @onSubmit="expressSubmit"
      />

      <!-- 发货 -->
      <SpDialog
        ref="deliverGoodsDialogRef"
        v-model="deliverGoodsDialog"
        width="1000px"
        :title="$t('3cdfcea1.cfcc1e') + deliverGoodsForm.order_id + '】'"
        :form="deliverGoodsForm"
        :form-list="deliverGoodsFormList"
        @onSubmit="deliverGoodsSubmit"
      />
    </div>
  </SpPage>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  ORDER_TYPE,
  DISTRIBUTION_TYPE,
  PROFIT_TYPE,
  PAY_TYPE,
  PAY_STATUS,
  GOOD_CATEGORY_MAP,
  OPEN_STATUS_ARR
} from '@/consts'
import { VERSION_STANDARD, VERSION_IN_PURCHASE, IS_SUPPLIER } from '@/utils'
import moment from 'moment'

export default {
  data() {
    return {
      infoList: [
        { label: this.$t('3cdfcea1.43c297'), field: 'create_time', is_show: true },
        { label: this.$t('3cdfcea1.90d17e'), field: 'order_id', is_show: true },
        { label: this.$t('3cdfcea1.0e83be'), field: 'order_class', is_show: true },
        { label: this.$t('3cdfcea1.7816f5'), field: 'order_status_msg', is_show: true },
        {
          label: this.$t('3cdfcea1.dfc420'),
          field: 'invoice_status',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        { label: this.$t('3cdfcea1.e9d70f'), field: 'receiptTypeTxt', is_show: true },
        { label: this.$t('3cdfcea1.f1a471'), field: 'username', is_show: true },
        { label: this.$t('3cdfcea1.468c2b'), field: 'mobile', is_show: true },
        { label: this.$t('3cdfcea1.3b387e'), field: 'memberGrade', is_show: true },
        {
          label: this.$t('3cdfcea1.287fa3'),
          field: 'memberDiscount',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        { label: this.$t('3cdfcea1.e48a1d'), field: 'fee_type', is_show: true },
        {
          label: this.$t('3cdfcea1.da46b5'),
          field: 'bonus_points',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        {
          label: this.$t('3cdfcea1.2f0613'),
          field: 'get_points',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        {
          label: this.$t('3cdfcea1.30c38a'),
          field: 'extra_points',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        {
          label: this.$t('3cdfcea1.87c5d5'),
          field: 'point_use',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        { label: this.$t('3cdfcea1.1583ee'), field: 'purchaseRole', is_show: true },
        { label: this.$t('3cdfcea1.1e1a6f'), field: 'sale_salesman_distributor_id', is_show: true },
        { label: this.$t('3cdfcea1.860510'), field: 'salesman_mobile', is_show: true },
        { label: this.$t('3cdfcea1.75d152'), field: 'employee_name', is_show: true },
        { label: this.$t('3cdfcea1.9030e8'), field: 'enterprise_name', is_show: true },
        { label: this.$t('3cdfcea1.16f2bc'), field: 'distributor_name', is_show: true }
      ],
      payList: [
        { label: this.$t('3cdfcea1.e850e7'), field: 'tradeId', is_show: true },
        { label: this.$t('3cdfcea1.35b3c2'), field: 'transactionId', is_show: true },
        { label: this.$t('3cdfcea1.6eb0c2'), field: 'goodsPrice', is_show: true },
        { label: this.$t('3cdfcea1.b4a1ba'), field: 'freightFee', is_show: true },
        {
          label: this.$t('3cdfcea1.a34d7d'),
          field: 'memberDiscountPrice',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        {
          label: this.$t('3cdfcea1.a1fed5'),
          field: 'couponDiscount',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        {
          label: this.$t('3cdfcea1.0b4786'),
          field: 'totalDiscount',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        {
          label: this.$t('3cdfcea1.30020a'),
          field: 'pointFee',
          is_show: !this.VERSION_IN_PURCHASE()
        },
        { label: this.$t('3cdfcea1.32613e'), field: 'totalPrice', is_show: true },
        { label: this.$t('3cdfcea1.e98e07'), field: 'realPrice', is_show: true },
        { label: this.$t('3cdfcea1.292de2'), field: 'payTypeTxt', is_show: true },
        { label: this.$t('3cdfcea1.011e95'), field: 'tradeStateTxt', is_show: true },
        { label: this.$t('3cdfcea1.2def40'), field: 'timeStart', is_show: true },
        { label: this.$t('3cdfcea1.ed916e'), field: 'timeExpire', is_show: true }
      ],
      profitList: [
        { label: this.$t('3cdfcea1.c1947d'), field: 'profit_type' },
        { label: this.$t('3cdfcea1.783a35'), field: 'profit_totalPrice' }
      ],
      communityInfoList: [
        { label: this.$t('3cdfcea1.1cadc0'), field: 'community_activity_name', is_show: true },
        { label: this.$t('3cdfcea1.a89d19'), field: 'community_chief_name', is_show: true },
        { label: this.$t('3cdfcea1.e5dd91'), field: 'community_activity_trade_no', is_show: true }
      ],
      interrogationInfoList: [
        { label: this.$t('3cdfcea1.6290d8'), field: 'user_family_name', is_show: true },
        { label: this.$t('3cdfcea1.5d7781'), field: 'user_family_id_card', is_show: true },
        { label: this.$t('3cdfcea1.ce2bf3'), field: 'user_family_phone', is_show: true },
        { label: this.$t('3cdfcea1.df3258'), field: 'user_family_age', is_show: true },
        { label: this.$t('3cdfcea1.53047c'), field: 'user_family_gender', is_show: true },
        { label: this.$t('3cdfcea1.d651d6'), field: 'relationship', is_show: true },
        { label: this.$t('3cdfcea1.312e3d'), field: 'is_pregnant_woman', is_show: true },
        { label: this.$t('3cdfcea1.043fb3'), field: 'is_lactation', is_show: true },
        {
          label: this.$t('3cdfcea1.572906'),
          field: 'before_ai_result_used_medicine',
          is_show: true
        },
        {
          label: this.$t('3cdfcea1.a5ebb2'),
          field: 'is_before_ai_result_allergy_history',
          is_show: true
        },
        {
          label: this.$t('3cdfcea1.a0439b'),
          field: 'before_ai_result_allergy_history',
          is_show: true
        },
        {
          label: this.$t('3cdfcea1.72c335'),
          field: 'before_ai_result_body_abnormal',
          is_show: true
        }
      ],
      prescriptionInfoList: [
        { label: this.$t('3cdfcea1.77de9b'), field: 'prescription_id', is_show: true },
        { label: this.$t('3cdfcea1.11767f'), field: 'hospital_name', is_show: true },
        { label: this.$t('3cdfcea1.a02158'), field: 'kuaizhen_store_id', is_show: true },
        { label: this.$t('3cdfcea1.ea3467'), field: 'kuaizhen_store_name', is_show: true },
        { label: this.$t('3cdfcea1.4465a6'), field: 'serial_no', is_show: true },
        { label: this.$t('3cdfcea1.aac8bc'), field: 'doctor_sign_time', is_show: true },
        { label: this.$t('3cdfcea1.a20bcf'), field: 'doctor_office', is_show: true },
        { label: this.$t('3cdfcea1.11df6b'), field: 'doctor_id', is_show: true },
        { label: this.$t('3cdfcea1.d9e80e'), field: 'doctor_name', is_show: true },
        { label: this.$t('3cdfcea1.dda854'), field: 'tags', is_show: true },
        { label: this.$t('3cdfcea1.cd43f7'), field: 'prescription_in_status', is_show: true },
        // { label: '通用名:', field: 'community_activity_name', is_show: false },
        { label: this.$t('3cdfcea1.e2a03f'), field: 'prescription_created', is_show: true },
        { label: this.$t('3cdfcea1.ebcac9'), field: 'prescription_updated', is_show: true },
        { label: this.$t('3cdfcea1.55bea7'), field: 'prescription_memo', is_show: true },
        { label: this.$t('3cdfcea1.54b8e3'), field: 'prescription_remarks', is_show: true },
        // { label: '药品用量说明:', field: 'drug_rsp_list', is_show: true },
        { label: this.$t('3cdfcea1.28833e'), field: 'audit_status', is_show: true },
        { label: this.$t('3cdfcea1.274c72'), field: 'audit_time', is_show: true },
        { label: this.$t('3cdfcea1.9b44a9'), field: 'audit_reason', is_show: true },
        { label: this.$t('3cdfcea1.fbd545'), field: 'audit_apothecary_name', is_show: true },
        { label: this.$t('3cdfcea1.3e5297'), field: 'diagnosis_id', is_show: true },
        {
          label: this.$t('3cdfcea1.d8a21b'),
          field: 'drug_rsp_list',
          type: 'cycle',
          special: true,
          is_show: true
        },
        { label: this.$t('3cdfcea1.5d35e6'), field: 'dst_file_path', is_show: true, special: true }
      ],

      memberRemark: '',
      merchantRemark: '',
      loading: false,
      addressInfo: '',
      orderInfo: null,
      is_community: false,
      communityExtra: [],
      deliveryData: [],
      expressDialog: false,
      expressFormList: [
        {
          label: this.$t('3cdfcea1.f3af96'),
          key: 'delivery_corp',
          placeholder: this.$t('3cdfcea1.8367e8'),
          type: 'select',
          options: [],
          required: true,
          message: this.$t('3cdfcea1.281bad')
        },
        {
          label: this.$t('3cdfcea1.0bb075'),
          key: 'delivery_code',
          type: 'input',
          placeholder: this.$t('3cdfcea1.0e9f1e'),
          required: true,
          message: this.$t('3cdfcea1.281bad')
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
          label: this.$t('3cdfcea1.b01994'),
          key: 'delivery_type',
          type: 'radio',
          disabled: false,
          options: [
            { label: 'batch', name: this.$t('3cdfcea1.afb426') },
            { label: 'sep', name: this.$t('3cdfcea1.95d243') }
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
            { title: this.$t('3cdfcea1.de5472'), key: 'item_name' },
            { title: this.$t('3cdfcea1.0bf60b'), key: 'num', width: 60 },
            { title: this.$t('3cdfcea1.745165'), key: 'delivery_item_num', width: 100 },
            { title: this.$t('3cdfcea1.e95382'), key: 'price', width: 120 },
            {
              title: this.$t('3cdfcea1.4f5a46'),
              key: 'item_num',
              width: 160,
              render: (row, column, cell) => {
                if (row.num - row.delivery_item_num == 0) {
                  return this.$t('3cdfcea1.fad522')
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
          label: this.$t('3cdfcea1.f3af96'),
          key: 'delivery_corp',
          placeholder: this.$t('3cdfcea1.8367e8'),
          type: 'select',
          options: [],
          required: true,
          message: this.$t('3cdfcea1.281bad')
        },
        {
          label: this.$t('3cdfcea1.0bb075'),
          key: 'delivery_code',
          type: 'input',
          placeholder: this.$t('3cdfcea1.0e9f1e'),
          required: true,
          message: this.$t('3cdfcea1.281bad')
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
        { label: this.$t('3cdfcea1.436358'), field: 'invoiceType', is_show: true },
        { label: this.$t('3cdfcea1.dfc420'), field: 'invoice_status', is_show: true },
        { label: this.$t('3cdfcea1.5f4907'), field: 'invoiceContent', is_show: true }
      ],
      // 发票信息公司
      invoiceListUnit: [
        { label: this.$t('3cdfcea1.436358'), field: 'invoiceType', is_show: true },
        { label: this.$t('3cdfcea1.dfc420'), field: 'invoice_status', is_show: true },
        { label: this.$t('3cdfcea1.6c4365'), field: 'invoicedCompanyName', is_show: true },
        { label: this.$t('3cdfcea1.da0b0a'), field: 'invoiceRegistrationNumber', is_show: true },
        { label: this.$t('3cdfcea1.db7b04'), field: 'invoicedCompanyPhone', is_show: true },
        { label: this.$t('3cdfcea1.dcc037'), field: 'invoicedBankName', is_show: true },
        { label: this.$t('3cdfcea1.9488d5'), field: 'invoicedBankAccount', is_show: true },
        { label: this.$t('3cdfcea1.eb4c89'), field: 'invoiceCompanyAddress', is_show: true }
      ],
      isBindOMS: false,
      deliveryLog: [],
      relationshipMap: {
        1: this.$t('3cdfcea1.6c6d18'),
        2: this.$t('3cdfcea1.b23382'),
        3: this.$t('3cdfcea1.61d549'),
        4: this.$t('3cdfcea1.84e10d'),
        5: this.$t('3cdfcea1.0d98c7')
      },
      auditStatusMap: {
        1: this.$t('3cdfcea1.97a81d'),
        2: this.$t('3cdfcea1.871a30'),
        3: this.$t('3cdfcea1.abad33'),
        4: this.$t('3cdfcea1.4878c1')
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
      if (response?.is_open) {
        this.infoList = this.infoList.map((el) => {
          if (el.field == 'get_points') {
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
    invoiceFilter(item) {
      return OPEN_STATUS_ARR.find((el) => el.value === item)?.title || ''
    },
    getFiledValue(key) {
      const { orderInfo } = this
      if (!orderInfo) return ''
      const v = orderInfo[key]
      const i18nFields = ['payTypeTxt', 'tradeStateTxt', 'invoice_status', 'profit_type']
      if (i18nFields.includes(key) && v) return this.$t(v)
      return v
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
        prescription_data = {}, //处方单信息
        diagnosis_data = {} //问诊单信息
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
      const fd = ORDER_TYPE.find((k) => k.value == order_class)

      let crossOrderTxt = ''
      if (order_class == 'normal' && orderInfo.type == '1') {
        crossOrderTxt = this.$t('3cdfcea1.d89979')
      }

      const fdReceiptType = DISTRIBUTION_TYPE.find((k) => k.value == receipt_type)
      let receiptTypeTxt = this.$t('3cdfcea1.249bfe')
      if (fdReceiptType) {
        receiptTypeTxt = fdReceiptType.title
      }

      // 会员等级
      let memberGrade = ''
      if (vipgrade && vipgrade.is_vip) {
        memberGrade = vipgrade.grade_name
      } else {
        memberGrade = gradeInfo ? gradeInfo.grade_name : this.$t('3cdfcea1.d81bb2')
      }

      let memberDiscount = ''
      if (gradeInfo && gradeInfo.privileges) {
        memberDiscount = `${100 - gradeInfo.privileges.discount}%`
      }

      this.orderInfo = {
        ...orderInfo,
        create_time: create_time ? moment(create_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '',
        order_class: `${fd ? this.$t(fd.title) : this.$t('3cdfcea1.7a83f9')}${crossOrderTxt}`,
        _order_class: orderInfo.order_class,
        invoice_status:
          OPEN_STATUS_ARR.find((el) => el.value === orderInfo.invoice_status)?.title || '',
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
        freightFee:
          orderInfo.freight_fee || orderInfo.freight_point_fee
            ? `¥${(
                ((orderInfo.freight_fee || 0) + (orderInfo.freight_point_fee || 0)) /
                100
              ).toFixed(2)}`
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
        invoiceType:
          invoiceType == 'individual' ? this.$t('3cdfcea1.6a0e04') : this.$t('3cdfcea1.04c9e3'),
        invoiceContent,
        invoicedCompanyName,
        invoiceRegistrationNumber,
        invoiceCompanyAddress,
        invoicedCompanyPhone,
        invoicedBankName,
        invoicedBankAccount,
        purchaseRole: orders_purchase_info
          ? orders_purchase_info.type == 'employee'
            ? this.$t('3cdfcea1.2ed392')
            : this.$t('3cdfcea1.4eca5b')
          : '',
        employee_name: orders_purchase_info ? orders_purchase_info.employee_name : '',
        enterprise_name: orders_purchase_info ? orders_purchase_info.enterprise_name : '',
        //处方药
        user_family_name: diagnosis_data.user_family_name,
        user_family_id_card: diagnosis_data.user_family_id_card,
        user_family_phone: diagnosis_data.user_family_phone,
        user_family_age: diagnosis_data.user_family_age,
        user_family_gender:
          diagnosis_data.user_family_gender == 1
            ? this.$t('3cdfcea1.36a490')
            : this.$t('3cdfcea1.87c835'),
        relationship: this.relationshipMap[diagnosis_data.relationship],
        is_pregnant_woman:
          diagnosis_data.is_pregnant_woman == 1
            ? this.$t('3cdfcea1.0a60ac')
            : this.$t('3cdfcea1.c9744f'),
        is_lactation:
          diagnosis_data.is_lactation == 1
            ? this.$t('3cdfcea1.0a60ac')
            : this.$t('3cdfcea1.c9744f'),
        before_ai_result_used_medicine:
          diagnosis_data?.before_ai_data_list?.before_ai_result_used_medicine == 1
            ? this.$t('3cdfcea1.0a60ac')
            : this.$t('3cdfcea1.c9744f'),
        is_before_ai_result_allergy_history: diagnosis_data?.before_ai_data_list
          ?.before_ai_result_allergy_history
          ? this.$t('3cdfcea1.0a60ac')
          : this.$t('3cdfcea1.c9744f'),
        before_ai_result_allergy_history:
          diagnosis_data?.before_ai_data_list?.before_ai_result_allergy_history,
        before_ai_result_body_abnormal:
          diagnosis_data?.before_ai_data_list?.before_ai_result_body_abnormal == 1
            ? this.$t('3cdfcea1.0a60ac')
            : this.$t('3cdfcea1.c9744f'),

        prescription_id: prescription_data.id,
        hospital_name: prescription_data.hospital_name,
        kuaizhen_store_id: prescription_data.kuaizhen_store_id,
        kuaizhen_store_name: prescription_data.kuaizhen_store_name,
        doctor_sign_time: prescription_data.doctor_sign_time
          ? moment(prescription_data.doctor_sign_time * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        doctor_office: prescription_data.doctor_office,
        doctor_id: prescription_data.doctor_id,
        doctor_name: prescription_data.doctor_name,
        tags: prescription_data.tags,
        prescription_in_status:
          prescription_data.status == 1 ? this.$t('3cdfcea1.fd6e80') : this.$t('3cdfcea1.0044f6'),
        prescription_created: prescription_data.created
          ? moment(prescription_data.created * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        prescription_updated: prescription_data.updated
          ? moment(prescription_data.updated * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        prescription_remarks: prescription_data.remarks,
        drug_rsp_list: prescription_data.drug_rsp_list, //
        audit_status: this.auditStatusMap[prescription_data.audit_status],
        audit_reason: prescription_data.audit_reason,
        audit_apothecary_name: prescription_data.audit_apothecary_name,
        diagnosis_id: prescription_data.diagnosis_id,
        serial_no: prescription_data.serial_no,
        audit_time: prescription_data.audit_time
          ? moment(prescription_data.audit_time * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '',
        dst_file_path: prescription_data.dst_file_path,
        sale_salesman_distributor_id: orderInfo?.sale_salesman_distributor_info?.name,
        salesman_mobile: orderInfo?.salespersonInfo?.work_userid
      }

      this.deliveryLog = this.orderInfo?.app_info?.delivery_log
      this.memberRemark = orderInfo.remark || this.$t('3cdfcea1.101e5b')
      this.merchantRemark = orderInfo.distributor_remark || this.$t('3cdfcea1.2a450f')
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
      if (VERSION_STANDARD() || distributor_id == 0 || this.login_type == 'distributor') {
        if (
          isLogistics &&
          !isDada &&
          order_status == 'PAYED' &&
          delivery_status != 'DONE' &&
          receipt_type != 'ziti' &&
          this.login_type == 'supplier'
        ) {
          btnActions.push({ name: this.$t('3cdfcea1.045315'), key: 'deliverGoods' })
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
      this.$message.success(this.$t('3cdfcea1.69be67'))
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
        // 已对接 OMS 时仅供应商端可发货，其余端不可操作
        if (this.isBindOMS && !IS_SUPPLIER()) {
          return this.$message.warning(this.$t('3cdfcea1.72b354'))
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
        this.$message.success(this.$t('3cdfcea1.de3b52'))
      } else {
        this.$message.error(this.$t('3cdfcea1.2249c1'))
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
.pay-voucher-thumb {
  width: 100px;
  height: 100px;
}
.pay-voucher-full-row {
  display: block;
  width: 100%;
  margin-top: 12px;
  clear: both;
}
.pay-voucher-full-row__row {
  width: 100%;
}
.pay-voucher-full-row__inner {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.pay-voucher-full-row__value {
  display: inline-flex;
  align-items: center;
}
.pay-voucher-full-row__value ::v-deep .el-image {
  display: inline-block;
  vertical-align: middle;
}
.pay-voucher-full-row__value .img-item.pay-voucher-thumb {
  margin: 0 0 0 8px;
}
.ml-16 {
  margin-left: 16px;
}
</style>
