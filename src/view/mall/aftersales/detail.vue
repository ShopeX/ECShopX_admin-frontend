<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('e67351f7.70536c')">
    <div class="section-header with-border flex">
      <h3>{{ $t('e67351f7.355eaf') }}</h3>
      <el-button
        type="text"
        size="large"
        style="
          margin-left: 10px;
          line-height: 1.5;
          color: #5e6d82;
          font-weight: 500;
          font-size: 16px;
          color: #459ae9;
        "
        @click="clickShowRemark(aftersalesInfo, 'afterDetail')"
      >
        {{ $t('e67351f7.2432b5') }}
      </el-button>
    </div>
    <div class="section-body">
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.cd1b26') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.aftersales_bn }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.070dce') }} </el-col>
        <el-col :span="20">
          <el-button type="text" @click="() => handleOrderClick(aftersalesInfo.order_id)">
            {{ aftersalesInfo.order_id }}
          </el-button>
          <el-tooltip effect="dark" :content="$t('e67351f7.79d3ab')" placement="top-start">
            <i
              v-clipboard:copy="aftersalesInfo.order_id"
              v-clipboard:success="onCopy"
              class="el-icon-document-copy"
            />
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.0e993f') }} </el-col>
        <el-col :span="20">
          <span v-if="aftersalesInfo.aftersales_type == 'ONLY_REFUND'"
            >{{ $t('e67351f7.6b8821') }}
          </span>
          <span v-if="aftersalesInfo.aftersales_type == 'REFUND_GOODS'"
            >{{ $t('e67351f7.cc0193') }}
          </span>
          <span v-if="aftersalesInfo.aftersales_type == 'EXCHANGING_GOODS'"
            >{{ $t('e67351f7.bb9cd5') }}
          </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.030517') }} </el-col>
        <el-col :span="20"> ￥{{ (aftersalesInfo.refund_fee / 100).toFixed(2) }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.886abd') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.refund_point || 0 }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.1ec73b') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.freight > 0 ? $t('e67351f7.0a60ac') : $t('e67351f7.c9744f') }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.85df68') }} </el-col>
        <el-col :span="20">
          {{
            aftersalesInfo.freight_type == 'cash' ? (aftersalesInfo.freight / 100).toFixed(2) : 0
          }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.e672db') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.freight_type == 'point' ? aftersalesInfo.freight : 0 }}
        </el-col>
      </el-row>
      <el-row v-if="IS_SUPPLIER()">
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.0c9fa7') }} </el-col>
        <el-col :span="20">
          {{ distributorInfo.name || '-' }}
        </el-col>
      </el-row>
      <el-row v-if="IS_SUPPLIER()">
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.93731e') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.contact || '-' }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.796c1b') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.aaddd7') }} </el-col>
        <el-col :span="20">
          <span v-if="aftersalesInfo.aftersales_status == '0'"> {{ $t('e67351f7.d89d86') }}</span>
          <span v-else-if="aftersalesInfo.aftersales_status == '1'">
            {{ $t('e67351f7.c217f8') }}</span
          >
          <span v-else-if="aftersalesInfo.aftersales_status == '2'">
            {{ $t('e67351f7.5ad605') }}</span
          >
          <span v-else-if="aftersalesInfo.aftersales_status == '3'">
            {{ $t('e67351f7.dbf36d') }}</span
          >
          <span v-else-if="aftersalesInfo.aftersales_status == '4'">
            {{ $t('e67351f7.50239f') }}</span
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.7f1328') }} </el-col>
        <el-col v-if="aftersalesInfo && aftersalesInfo.app_info" :span="20">
          {{ aftersalesInfo.app_info.progress_msg }}
          <!-- <span v-if="aftersalesInfo.progress == '0'"> 等待商家处理</span>
          <span v-else-if="aftersalesInfo.progress == '1'">商家接受申请，等待消费者回寄</span>
          <span v-else-if="aftersalesInfo.progress == '2'">消费者回寄，等待商家收货确认</span>
          <span v-else-if="aftersalesInfo.progress == '3'">售后已驳回</span>
          <span v-else-if="aftersalesInfo.progress == '4'">售后已处理</span>
          <span v-else-if="aftersalesInfo.progress == '5'">退款驳回</span>
          <span v-else-if="aftersalesInfo.progress == '6'">退款已处理</span>
          <span v-else-if="aftersalesInfo.progress == '7'">售后关闭</span>
          <span v-else-if="aftersalesInfo.progress == '8'">商家确认收货</span>
          <span v-else-if="aftersalesInfo.progress == '9'">退款处理中</span> -->
        </el-col>
      </el-row>
      <el-row v-if="aftersalesInfo.refuse_reason">
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.0d41e2') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.refuse_reason }}
        </el-col>
      </el-row>
    </div>
    <div class="remark_footer">
      <el-row style="width: 100%">
        <el-col :span="3" class="remark_footer_title col-3 content-right">
          {{ $t('e67351f7.00b7f4') }}
        </el-col>
        <el-col :span="20">
          <div class="remark_footer_content">
            {{ aftersalesInfo.distributor_remark }}
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="section-header with-border">
      <h3>{{ $t('e67351f7.336fac') }}</h3>
    </div>
    <div class="section-body">
      <el-row>
        <template>
          <el-table :data="aftersalesInfo.detail" style="width: 960px">
            <el-table-column
              class="goods-img"
              prop="pic"
              :label="$t('e67351f7.9b94b1')"
              width="180"
            >
              <template slot-scope="scope">
                <span><img :src="scope.row.item_pic" :alt="scope.row.item_name"></span>
              </template>
            </el-table-column>
            <el-table-column prop="item_name" :label="$t('e67351f7.1fd1d5')" width="180">
              <template slot-scope="scope">
                <div class="ell3">
                  <el-tag
                    v-if="scope.row.orderItem.is_prescription === 1"
                    type="primary"
                    size="mini"
                    style="background-color: #fff"
                  >
                    {{ $t('e67351f7.e8b7e1') }}
                  </el-tag>
                  {{ scope.row.item_name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="item_bn" :label="$t('e67351f7.0888fc')" width="150" />
            <el-table-column
              prop="orderItem.item_spec_desc"
              :label="$t('e67351f7.ea887b')"
              width="150"
            />
            <el-table-column prop="supplier_name" :label="$t('e67351f7.55c61d')" width="150">
              <template slot-scope="scope">
                {{ scope.row.supplier_name?.supplier_name }}
              </template>
            </el-table-column>
            <el-table-column prop="num" :label="$t('e67351f7.ce8389')" width="100" />
            <el-table-column :label="$t('e67351f7.08c9b1')" width="150">
              <template slot-scope="scope">
                <span>￥{{ scope.row.refund_fee / 100 }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('e67351f7.7606c5')" v-if="!IS_SUPPLIER()" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.refund_point }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('e67351f7.729935')" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.refunded_num }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('e67351f7.c0c79b')" width="120">
              <template slot-scope="scope">
                {{
                  scope.row.refund_info?.refunded_fee && scope.row.refund_info?.refunded_fee / 100
                }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('e67351f7.761d19')" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.refund_info?.refund_point }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cost_price" :label="$t('e67351f7.2e2ce2')">
              <template slot-scope="scope">
                {{ scope.row.cost_price && scope.row.cost_price / 100 }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-row>
    </div>

    <div class="section-header with-border">
      <h3>{{ $t('e67351f7.830fd1') }}</h3>
    </div>
    <div class="section-body">
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.2dd029') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.reason }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.248d46') }} </el-col>
        <el-col :span="20">
          {{ aftersalesInfo.description }}
        </el-col>
      </el-row>
      <el-row v-if="aftersalesInfo.evidence_pic">
        <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.85916c') }} </el-col>
        <el-col :span="20">
          <ul v-if="aftersalesInfo.evidence_pic[0]">
            <li
              v-for="(pic, index) in aftersalesInfo.evidence_pic"
              :key="index"
              class="artical-item"
            >
              <el-image
                style="width: 120px; height: 120px"
                fit="cover"
                :src="pic"
                :preview-src-list="aftersalesInfo.evidence_pic"
              />
            </li>
          </ul>
          <span v-else>{{ $t('e67351f7.c7606b') }}</span>
        </el-col>
      </el-row>
    </div>

    <!-- 退款信息展示 -->
    <template v-if="refundInfo.refund_fee">
      <div class="section-header with-border">
        <h3>{{ $t('e67351f7.217f23') }}</h3>
      </div>
      <div class="section-body">
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.b772c7') }} </el-col>
          <el-col :span="20">
            {{ refundInfo.refund_fee }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.a2f94f') }} </el-col>
          <el-col :span="20">
            <span v-if="refundInfo.refund_status == 'SUCCESS'"> {{ $t('e67351f7.d58cbd') }} </span>
            <span v-else-if="refundInfo.refund_status == 'REFUNDCLOSE'">
              {{ $t('e67351f7.c32482') }}
            </span>
            <span v-else-if="refundInfo.refund_status == 'PROCESSING'">
              {{ $t('e67351f7.73ce8f') }}
            </span>
            <span v-else-if="refundInfo.refund_status == 'CHANGE'">
              {{ $t('e67351f7.c59ead') }}
            </span>
          </el-col>
        </el-row>
        <el-row v-if="refundInfo.refunds_memo">
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.cb4b84') }} </el-col>
          <el-col :span="20">
            {{ refundInfo.refunds_memo }}
          </el-col>
        </el-row>
      </div>
    </template>

    <template
      v-if="
        !aftersalesInfo.sendback_data &&
        aftersalesInfo.aftersales_status == '1' &&
        aftersalesInfo.aftersales_type != 'ONLY_REFUND'
      "
    >
      <div class="section-header with-border">
        <h3>{{ $t('e67351f7.5db52b') }}</h3>
      </div>
      <div class="section-body">
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.8d274e') }} </el-col>
          <el-col :span="20">
            <el-select v-model="sendbackInfo.corp_code" :placeholder="$t('e67351f7.7ba15c')">
              <el-option
                v-for="(data, index) in logisticsList"
                :key="index"
                :label="data.corp_name"
                :value="data.corp_code"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.b75dd1') }} </el-col>
          <el-col :span="8">
            <el-input v-model="sendbackInfo.logi_no" :placeholder="$t('e67351f7.5cc10a')" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right">
            <el-button
              type="primary"
              plain
              :loading="submitSendbackLoading"
              @click="submitAftersalesInfo"
            >
              {{ $t('e67351f7.939d53') }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </template>

    <!-- 用户回寄物流信息 -->
    <template v-if="aftersalesInfo.sendback_data">
      <div class="section-header with-border">
        <h3>{{ $t('e67351f7.5db52b') }}</h3>
      </div>
      <div class="section-body">
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.8d274e') }} </el-col>
          <el-col :span="20">
            {{ dlycorpskn[aftersalesInfo.sendback_data.corp_code] }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.b75dd1') }} </el-col>
          <el-col :span="20">
            {{ aftersalesInfo.sendback_data.logi_no }}
          </el-col>
        </el-row>
      </div>
    </template>

    <!-- 商家发货物流信息 -->
    <template v-if="aftersalesInfo.sendconfirm_data">
      <div class="section-header with-border">
        <h3>{{ $t('e67351f7.f4472a') }}</h3>
      </div>
      <div class="section-body">
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.8d274e') }} </el-col>
          <el-col :span="20">
            {{ dlycorpskn[aftersalesInfo.sendconfirm_data.corp_code] }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.b75dd1') }} </el-col>
          <el-col :span="20">
            {{ aftersalesInfo.sendconfirm_data.logi_no }}
          </el-col>
        </el-row>
      </div>
    </template>

    <!-- 申请通过 -->
    <template
      v-if="aftersalesInfo.progress == '2' || (isJuishuitan && aftersalesInfo.progress == '8')"
    >
      <!-- 换货商家发货信息填写 -->
      <template v-if="aftersalesInfo.aftersales_type == 'EXCHANGING_GOODS'">
        <div class="section-header with-border">
          <h3>{{ $t('e67351f7.a1f329') }}</h3>
        </div>
        <div>
          <el-row class="agreen-info">
            <el-col :span="2" class="col-3 agreen-right"> {{ $t('e67351f7.8d274e') }} </el-col>
            <el-col :span="8">
              <el-input
                v-model="corp_code"
                type="text"
                :placeholder="$t('e67351f7.751ed9')"
                clearable
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="col-3 agreen-right"> {{ $t('e67351f7.b75dd1') }} </el-col>
            <el-col :span="8">
              <el-input
                v-model="logi_no"
                type="text"
                :placeholder="$t('e67351f7.5cc10a')"
                clearable
              />
            </el-col>
          </el-row>
        </div>
        <div class="section-footer with-border content-center">
          <el-button type="primary" @click="sendBackAction">
            {{ $t('e67351f7.d7c770') }}
          </el-button>
        </div>
      </template>

      <!-- 退货退款审核 -->
      <template
        v-else-if="
          (aftersalesInfo.aftersales_type == 'REFUND_GOODS' &&
            aftersalesInfo.distributor_id == '0' &&
            VERSION_PLATFORM()) ||
          (aftersalesInfo.aftersales_type == 'REFUND_GOODS' &&
            $store.getters.login_type == 'distributor' &&
            VERSION_PLATFORM()) ||
          (aftersalesInfo.aftersales_type == 'REFUND_GOODS' && !VERSION_PLATFORM())
        "
      >
        <div class="section-header with-border">
          <h3>{{ $t('e67351f7.02ea13') }}</h3>
        </div>
        <div class="section-body">
          <template>
            <el-row>
              <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.de455e') }} </el-col>
              <el-col :span="20">
                <!-- <template v-if="IsBind && login_type != 'distributor'">
                  <el-radio v-model="check_refund" label="0" disabled> {{ $t('e67351f7.1bf19c') }} </el-radio>
                  <el-radio v-model="check_refund" label="1" disabled> {{ $t('e67351f7.e61f2c') }} </el-radio>
                </template>
                <template v-else> -->
                <el-radio v-model="check_refund" label="0"> {{ $t('e67351f7.1bf19c') }} </el-radio>
                <el-radio v-model="check_refund" label="1"> {{ $t('e67351f7.e61f2c') }} </el-radio>
                <!-- </template> -->
              </el-col>
            </el-row>
            <template
              v-if="aftersalesInfo.aftersales_type != 'EXCHANGING_GOODS' && check_refund == '1'"
            >
              <!-- <el-row v-if="'point' != orderInfo.pay_type"> -->
              <el-row>
                <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.615455') }} </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="refund_fee"
                    class="input-m"
                    type="number"
                    min="0"
                    :max="orderInfo.total_fee / 100"
                    :disabled="aftersalesInfo.progress == 8"
                  />&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="aftersalesInfo.share_points > 0"
                    >{{ $t('e67351f7.71f871') }}{{ aftersalesInfo.share_points }}</span
                  >
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.2c8929') }} </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="refund_point"
                    type="number"
                    min="0"
                    :max="orderInfo.point"
                    :disabled="aftersalesInfo.progress == 8"
                  />
                </el-col>
              </el-row>
              <el-row v-if="aftersalesInfo.freight_type == 'cash'">
                <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.85df68') }} </el-col>
                <el-col :span="8">
                  <el-input
                    v-model="freight"
                    type="number"
                    min="0"
                    :max="orderInfo.freight_fee / 100"
                  />
                </el-col>
              </el-row>
              <el-row v-if="aftersalesInfo.freight_type == 'point'">
                <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.e672db') }} </el-col>
                <el-col :span="8">
                  <el-input v-model="freight" type="number" min="0" :max="aftersalesInfo.freight" />
                </el-col>
              </el-row>
            </template>
            <el-row v-if="check_refund == '0'">
              <el-col :span="2" class="col-3 agreen-right"> {{ $t('e67351f7.de77c5') }} </el-col>
              <el-col :span="12">
                <el-input
                  v-model="refuse_reason"
                  type="textarea"
                  :rows="3"
                  :placeholder="$t('e67351f7.fc955a')"
                />
              </el-col>
            </el-row>
            <div class="section-footer with-border content-center">
              <el-button type="primary" @click="refundAction">
                {{ $t('e67351f7.e83a25') }}
              </el-button>
            </div>
          </template>
        </div>
      </template>
    </template>
    <!-- 退货 -->
    <template
      v-if="
        (aftersalesInfo.distributor_id == '0' &&
          aftersalesInfo.progress == '0' &&
          VERSION_PLATFORM()) ||
        ($store.getters.login_type == 'distributor' &&
          aftersalesInfo.progress == '0' &&
          VERSION_PLATFORM()) ||
        (aftersalesInfo.progress == '0' && !VERSION_PLATFORM())
      "
    >
      <div class="section-header with-border">
        <h3>{{ $t('e67351f7.02ea13') }}</h3>
      </div>
      <div class="section-body">
        <template>
          <el-row>
            <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.de455e') }} </el-col>
            <el-col :span="20">
              <!-- <template v-if="IsBind && login_type != 'distributor'">
                <el-radio v-model="is_approved" label="0" disabled> {{ $t('e67351f7.1bf19c') }} </el-radio>
                <el-radio v-model="is_approved" label="1" disabled> {{ $t('e67351f7.e61f2c') }} </el-radio>
              </template> -->
              <!-- <template v-else> -->
              <el-radio v-model="is_approved" label="0"> {{ $t('e67351f7.1bf19c') }} </el-radio>
              <el-radio v-model="is_approved" label="1"> {{ $t('e67351f7.e61f2c') }} </el-radio>
              <!-- </template> -->
            </el-col>
          </el-row>
          <template v-if="aftersalesInfo.aftersales_type == 'ONLY_REFUND' && is_approved == '1'">
            <el-row>
              <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.b772c7') }} </el-col>
              <el-col :span="8">
                <el-input
                  v-model="refund_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  :max="aftersalesInfo.refund_fee / 100"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.27a09b') }} </el-col>
              <el-col :span="8">
                <el-input
                  v-model="refund_point"
                  type="number"
                  min="0"
                  :max="aftersalesInfo.refund_point"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.ceefe4') }} </el-col>
              <el-col :span="8">
                <el-input v-model="freight" type="number" min="0" :max="aftersalesInfo.freight" />
              </el-col>
            </el-row>
          </template>
          <el-row v-if="is_approved == '0'">
            <el-col :span="2" class="col-3 agreen-right"> {{ $t('e67351f7.de77c5') }} </el-col>
            <el-col :span="12">
              <el-input
                v-model="refuse_reason"
                type="textarea"
                :rows="3"
                :placeholder="$t('e67351f7.fc955a')"
              />
            </el-col>
          </el-row>
        </template>
      </div>
    </template>

    <template
      v-if="
        aftersalesInfo.aftersales_type == 'REFUND_GOODS' &&
        aftersalesInfo.progress == '0' &&
        aftersalesInfo.return_type == 'logistics' &&
        (this.check_refund == '1' || this.is_approved == '1')
      "
    >
      <div class="section-header with-border">
        <h3>{{ $t('e67351f7.6f3ace') }}</h3>
        <div class="section-body">
          <template>
            <el-row v-if="aftersalesInfo.progress == '0'">
              <el-col :span="2" class="col-3 agreen-right"> {{ $t('e67351f7.f64546') }} </el-col>
              <el-col :span="12">
                <el-button icon="el-icon-circle" @click="handleChangeAddress">
                  {{ $t('e67351f7.0cb2e3') }}
                </el-button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <el-button icon="el-icon-circle" @click="onAddAddress">
                  {{ $t('e67351f7.0a02f7') }}
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.eaa028') }} </el-col>
              <el-col :span="8">
                <el-input v-model="aftersales_contact" type="text" disabled />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.343c39') }} </el-col>
              <el-col :span="8">
                <el-input v-model="aftersales_mobile" type="text" disabled />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.ac35fb') }} </el-col>
              <el-col :span="8">
                <el-input v-model="aftersales_address" type="text" disabled />
              </el-col>
            </el-row>
          </template>
        </div>
      </div>
    </template>

    <div
      v-if="aftersalesInfo.return_type == 'offline' && isObject(aftersalesInfo.aftersales_address)"
      class="section-header with-border"
    >
      <h3>{{ $t('e67351f7.11b600') }}</h3>
      <div class="section-body">
        <template>
          <el-row>
            <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.50550f') }} </el-col>
            <el-col :span="8">
              {{
                `${
                  aftersalesInfo.return_type == 'offline'
                    ? $t('e67351f7.11b600')
                    : $t('e67351f7.ed91f2')
                }`
              }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.e655b8') }} </el-col>
            <el-col :span="8">
              <div>{{ aftersalesInfo.aftersales_address.aftersales_name }}</div>
              <div>{{ aftersalesInfo.aftersales_address.aftersales_address }}</div>
              <div>{{ aftersalesInfo.aftersales_address.aftersales_mobile }}</div>
              <div>
                {{
                  `${$t('e67351f7.5cf7ca')} ${aftersalesInfo.aftersales_address.aftersales_hours}`
                }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.eaa028') }} </el-col>
            <el-col :span="8"> {{ aftersalesInfo.contact }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="col-3 content-right"> {{ $t('e67351f7.733e3f') }} </el-col>
            <el-col :span="8">{{ aftersalesInfo.mobile }} </el-col>
          </el-row>
        </template>
      </div>
    </div>

    <div
      v-if="
        (aftersalesInfo.distributor_id == '0' &&
          aftersalesInfo.progress == '0' &&
          VERSION_PLATFORM()) ||
        ($store.getters.login_type == 'distributor' &&
          aftersalesInfo.progress == '0' &&
          VERSION_PLATFORM()) ||
        (aftersalesInfo.progress == '0' && !VERSION_PLATFORM())
      "
      class="section-footer with-border content-center"
    >
      <el-button type="primary" :disabled="submitDisabled" @click="reviewSubmit">
        {{ $t('e67351f7.646db0') }}
      </el-button>
    </div>

    <el-dialog
      :title="$t('e67351f7.b1649e')"
      :visible.sync="relShop.relShopVisible"
      :before-close="handleCancel"
      width="50%"
    >
      <template>
        <el-table v-loading="loading" :data="relShop.list" @row-click="handleRowClick">
          <el-table-column prop="address" :label="$t('e67351f7.c096c4')" width="300">
            <template slot-scope="scope">
              <i class="el-icon-place" />
              {{
                scope.row.province +
                ' ' +
                scope.row.city +
                ' ' +
                scope.row.area +
                ' ' +
                scope.row.address
              }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" :label="$t('e67351f7.52409d')">
            <template slot-scope="scope">
              <i class="el-icon-place" />
              {{ scope.row.contact + ' ' + scope.row.mobile }}
            </template>
          </el-table-column>
          <el-table-column prop="is_default" :label="$t('e67351f7.d1c357')">
            <template slot-scope="scope">
              {{ scope.row.is_default == 1 ? $t('e67351f7.0a60ac') : $t('e67351f7.c9744f') }}
            </template>
          </el-table-column>
          <el-table-column prop="address_id" :label="$t('e67351f7.153fa6')">
            <template slot-scope="scope">
              <el-radio v-model="aftersales_select" :label="scope.row.address_id" />
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="relShop.total_count > relShop.params.page_size"
          class="content-center content-top-padded"
        >
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="relShop.params.page"
            :total="relShop.total_count"
            :page-size="relShop.params.page_size"
            @current-change="handleCurrentChange"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">{{ $t('e67351f7.c08ab9') }}</el-button>
          <!-- <el-button @click="relShop.relShopVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="handleSelectAftersalesAddress()">{{
            $t('e67351f7.aa7527')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 新增售后地址 -->
    <el-dialog
      :title="$t('e67351f7.0a02f7')"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="45%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item :label="$t('e67351f7.295713')">
          <template>
            <span>{{ aftersalesInfo.distributor_id }}</span>
          </template>
        </el-form-item>
        <el-form-item :label="$t('e67351f7.c096c4')">
          <el-cascader
            v-model="form.regions_id"
            class="w-100"
            :options="regions"
            @change="handleRegionChange"
          />
        </el-form-item>
        <el-form-item :label="$t('e67351f7.61a0ec')">
          <el-input v-model="aftersales_address" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('e67351f7.52409d')">
          <el-input v-model="aftersales_contact" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('e67351f7.b58943')">
          <el-input v-model="aftersales_mobile" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('e67351f7.d1c357')">
          <el-select v-model="is_default" :placeholder="$t('e67351f7.708c9d')">
            <el-option :label="$t('e67351f7.0a60ac')" value="1" />
            <el-option :label="$t('e67351f7.c9744f')" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ $t('e67351f7.c08ab9') }}</el-button>
        <el-button type="primary" @click="createAddress">{{ $t('e67351f7.aa7527') }}</el-button>
      </span>
    </el-dialog>
    <RemarkModal ref="modalRef" @onDone="onRemarksDone" />
  </SpPage>
</template>
<style scoped lang="scss" type="text/css">
.flex {
  display: flex;
  align-items: center;
}

h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 150px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}
img {
  max-width: 100px;
  margin: 0 auto;
}
.agreen-info {
  margin-top: 20px;
}
.agreen-right {
  line-height: 40px;
  text-align: right;
}
.remark_footer {
  border-top: 1px solid #efefef;
  padding: 12.5px;
  display: flex;

  &_title {
    text-align: right;
  }
  &_content {
  }
}
.artical-item {
  display: inline-block;
  margin-right: 20px;
  width: 120px;
  height: 120px;
  object-fit: container;
}
</style>

<script>
import {
  getAftersalesDetail,
  reviewAftersales,
  refundCheck,
  sendConfirm,
  getAftersalesAddressList,
  createAftersalesAddress
} from '../../../api/aftersales'
import { isBind, updateAftersalesSendBack } from '../../../api/trade'
import hqbdlycorp_kname from '../../../common/hqbdlycorp_kname.json'
import district from '../../../common/district.json'
import RemarkModal from '@/components/remarkModal'
import remarkMixin from '@/mixins/remarkMixin'
import { isArray, isObject, IS_SUPPLIER, getUrlPathByLoginType } from '@/utils'
import { getLogisticsLists } from '@/api/logistics'

import { mapGetters } from 'vuex'

// 取选中地区的值
function getCascaderObj(val, opt) {
  return val.map(function (value, index, array) {
    for (var itm of opt) {
      if (itm.value === value) {
        opt = itm.children
        return itm
      }
    }
    return null
  })
}

export default {
  components: {
    RemarkModal
  },
  mixins: [remarkMixin],
  data() {
    return {
      aftersales_bn: '',
      aftersalesInfo: {},
      refundInfo: {},
      // orderInfo: {},
      distributorInfo: {},
      supplierInfo: {},
      radio: '1',
      agreen: false,
      loading: false,
      IsBind: false,
      order_id: '',
      // tradeInfo: {},
      resource: '',
      user_id: 0,
      memberInfo: {
        gradeInfo: {}
      },
      dlycorpskn: hqbdlycorp_kname,
      is_approved: '0',
      check_refund: '0',
      refuse_reason: '',
      refund_fee: 0,
      refund_point: 0,
      freight: 0,
      corp_code: '', // 物流公司
      logi_no: '', // 快递单号
      exchangeSendBack: {},
      submitDisabled: false,

      dialogVisible: false,
      relShop: {
        list: [],
        total_count: 0,
        params: {
          page: 1,
          page_size: 20
        },
        relShopVisible: false
      },
      distributor_id: 0,
      aftersales_address_id: '',
      aftersales_contact: '',
      aftersales_mobile: '',
      is_default: 2,
      aftersales_address: '',
      aftersales_select: null,
      regionList: [],
      form: {
        regions_id: []
      },
      regions: district,
      sendbackInfo: {
        corp_code: '',
        logi_no: ''
      },
      submitSendbackLoading: false,
      logisticsList: [],
      isJuishuitan: false
    }
  },
  computed: {
    ...mapGetters(['login_type'])
  },
  mounted() {
    if (this.$route.query.aftersales_bn) {
      this.aftersales_bn = this.$route.query.aftersales_bn
    }
    this.loading = true
    this.getStatus()
    this.aftersaleInfo()
    this.getLogisticsListData()
  },
  methods: {
    onCopy() {
      this.$notify.success({
        message: this.$t('e67351f7.20a495'),
        showClose: true
      })
    },
    isArray,
    isObject,
    getLogisticsListData() {
      getLogisticsLists({ status: 1 }).then((response) => {
        this.logisticsList = response.data.data.list
      })
    },
    aftersaleInfo() {
      getAftersalesDetail(this.aftersales_bn).then((response) => {
        let data = response.data.data
        this.aftersalesInfo = data
        this.orderInfo = data.order_info
        this.order_id = data.order_id
        this.distributorInfo = data.distributor_info || {}
        this.supplierInfo = data.supplier_info || {}
        // this.tradeInfo = data.tradeInfo
        this.refund_fee = data.refund_fee / 100
        this.refund_point = data.refund_point
        this.freight = data.freight_type == 'cash' ? data.freight / 100 : data.freight
        // this.refund_point = this.orderInfo.items[0].point
        // if(data.refundInfo) {
        //   this.refundInfo = data.refundInfo
        // }
        if (data.aftersales_address) {
          this.aftersales_address = data.aftersales_address.aftersales_address
          this.aftersales_contact = data.aftersales_address.aftersales_contact
          this.aftersales_mobile = data.aftersales_address.aftersales_mobile
          this.aftersales_address_id = data.aftersales_address.aftersales_address_id
          this.is_default = data.aftersales_address.is_default
        }
        if (data.sendback_data.length == 0) {
          this.aftersalesInfo.sendback_data = null
        }
        if (data.sendconfirm_data.length == 0) {
          this.aftersalesInfo.sendconfirm_data = null
        }
        this.distributor_id = data.distributor_id
        this.loading = false
        this.isJuishuitan = this.aftersalesInfo.is_jushuitan
      })
    },
    onRemarksDone(remark) {
      this.aftersalesInfo.distributor_remark = remark
    },
    submitAftersalesInfo() {
      if (!this.sendbackInfo.corp_code) {
        this.$message.error(this.$t('e67351f7.7ba15c'))
        return false
      }
      if (!this.sendbackInfo.logi_no || !this.sendbackInfo.logi_no.trim()) {
        this.$message.error(this.$t('e67351f7.5cc10a'))
        return false
      }
      this.sendbackInfo.logi_no = this.sendbackInfo.logi_no.trim()
      this.submitSendbackLoading = true
      this.sendbackInfo['aftersales_bn'] = this.aftersales_bn
      updateAftersalesSendBack(this.sendbackInfo)
        .then((response) => {
          this.$message.success(this.$t('e67351f7.e6d936'))
          let data = response.data.data
          this.aftersalesInfo = data
          this.orderInfo = data.order_info
          if (data.aftersales_address) {
            this.aftersales_address = data.aftersales_address.aftersales_address
            this.aftersales_contact = data.aftersales_address.aftersales_contact
            this.aftersales_mobile = data.aftersales_address.aftersales_mobile
            this.aftersales_address_id = data.aftersales_address.aftersales_address_id
            this.is_default = data.aftersales_address.is_default
          }
          if (data.sendback_data.length == 0) {
            this.aftersalesInfo.sendback_data = null
          }
          if (data.sendconfirm_data.length == 0) {
            this.aftersalesInfo.sendconfirm_data = null
          }
        })
        .catch(() => {
          this.$message.error(this.$t('e67351f7.adcf44'))
        })
        .finally(() => {
          this.submitSendbackLoading = false
        })
    },
    handleOrderClick(order_id) {
      window.open(
        `${getUrlPathByLoginType(`/order/order-manage/order-list/detail?orderId=${order_id}`)}`,
        '_blank'
      )
    },
    reviewSubmit() {
      let params = {
        aftersales_bn: this.aftersales_bn,
        is_approved: this.is_approved
      }
      if (this.is_approved == 1) {
        if (this.refund_fee < 0) {
          this.$message.error(this.$t('e67351f7.07f637'))
          return false
        } else if (this.refund_fee > this.aftersalesInfo.refund_fee) {
          this.$message.error(this.$t('e67351f7.e8c8af'))
          return false
        }
        params['refund_fee'] = accMul(this.refund_fee, 100)
        //parseInt(this.refund_fee * 100)
        params['refund_point'] = this.refund_point
        params['freight'] =
          this.aftersalesInfo.freight_type == 'cash' ? accMul(this.freight, 100) : this.freight
        //售后地址
        console.log(this.aftersalesInfo.aftersales_type)
        if (
          this.aftersalesInfo.aftersales_type == 'REFUND_GOODS' &&
          this.aftersales_address_id == '' &&
          this.aftersalesInfo.return_type != 'offline' &&
          (this.check_refund == 1 || this.is_approved == 1)
        ) {
          this.$message.error(this.$t('e67351f7.abed2e'))
          return false
        }
        params['aftersales_address_id'] = this.aftersales_address_id
      } else {
        if (this.refuse_reason) {
          params['refuse_reason'] = this.refuse_reason
        } else {
          this.$message.error(this.$t('e67351f7.23df70'))
          return false
        }
      }
      this.submitDisabled = true
      setTimeout(() => {
        this.submitDisabled = false
      }, 1000)
      reviewAftersales(params).then((response) => {
        if (response.data.data) {
          this.$message({
            message: this.$t('e67351f7.4c94e7'),
            type: 'success'
          })
          this.aftersaleInfo()
        } else {
          this.$message.error(this.$t('e67351f7.adcf44'))
          return false
        }
      })
    },
    sendBackAction() {
      this.exchangeSendBack.aftersales_bn = this.aftersales_bn
      this.exchangeSendBack.corp_code = this.corp_code
      this.exchangeSendBack.logi_no = this.logi_no
      sendConfirm(this.exchangeSendBack).then((response) => {
        if (response.data.data) {
          this.$message({
            message: this.$t('e67351f7.54e372'),
            type: 'success'
          })
          this.aftersaleInfo()
        } else {
          this.$message.error(this.$t('e67351f7.7485d9'))
          return false
        }
      })
    },
    refundAction() {
      const params = {
        aftersales_bn: this.aftersales_bn,
        check_refund: this.check_refund,
        refunds_memo: this.refuse_reason,
        refund_fee: accMul(this.refund_fee, 100),
        refund_point: this.refund_point,
        freight:
          this.aftersalesInfo.freight_type == 'cash' ? accMul(this.freight, 100) : this.freight
      }
      if (params.check_refund == '0' && !params.refunds_memo) {
        this.$message.error(this.$t('e67351f7.23df70'))
        return false
      }
      if (params.check_refund == '1' && isNaN(params.refund_fee)) {
        this.$message.error(this.$t('e67351f7.07f637'))
        return false
      }
      if (params.freight > this.aftersalesInfo.freight) {
        if (this.aftersalesInfo.freight_type == 'point') {
          this.$message.error(this.$t('e67351f7.ddf209'))
        } else {
          this.$message.error(this.$t('e67351f7.e1bc4f'))
        }
        return false
      }
      refundCheck(params).then((response) => {
        if (response.data.data) {
          this.$message({
            message: this.$t('e67351f7.3b6eb9'),
            type: 'success'
          })
          this.aftersaleInfo()
        } else {
          this.$message.error(this.$t('e67351f7.7c2544'))
          return false
        }
      })
    },

    getStatus() {
      isBind().then((response) => {
        this.IsBind = response.data.data.result
      })
    },

    handleChangeAddress(val) {
      this.aftersales_select = this.aftersales_address_id
      this.relShop.relShopVisible = true
      const queryData = {
        page: this.relShop.params.page,
        page_size: this.relShop.params.page_size,
        distributor_id: this.distributor_id
      }
      this.getAftersalesaddressList(queryData)
    },
    handleCurrentChange(val) {
      const queryData = {
        page: val,
        page_size: this.relShop.params.page_size,
        distributor_id: this.distributor_id
      }
      this.getAftersalesaddressList(queryData)
    },
    getAftersalesaddressList(queryData) {
      getAftersalesAddressList(queryData).then((response) => {
        if (response.data.data.list) {
          this.relShop.list = response.data.data.list
          this.relShop.total_count = response.data.data.total_count
        }
      })
    },
    handleCancel() {
      this.relShop.relShopVisible = false
    },
    handleSelectAftersalesAddress() {
      const fd = this.relShop.list.find((item) => item.address_id == this.aftersales_select)
      if (fd) {
        this.aftersales_address_id = fd.address_id
        this.aftersales_contact = fd.contact
        this.aftersales_mobile = fd.mobile
        this.aftersales_address = fd.province + fd.city + fd.area + fd.address
        this.is_default = fd.is_default
      }
      this.relShop.relShopVisible = false
    },
    handleRowClick(row, col, event) {
      this.aftersales_select = row.address_id
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleRegionChange: function (value) {
      var vals = getCascaderObj(value, this.regions)
      this.form.regions_id = []
      this.form.regions = []
      for (var i = 0; i < vals.length; i++) {
        this.form.regions_id[i] = vals[i].value
        this.form.regions[i] = vals[i].label
      }

      if (
        this.form.regions[0] == this.$t('e67351f7.a8e562') ||
        this.form.regions[0] == this.$t('e67351f7.727286') ||
        this.form.regions[0] == this.$t('e67351f7.b67334') ||
        this.form.regions[0] == this.$t('e67351f7.9bf8cb')
      ) {
        this.searchRegion = this.form.regions[0] + this.form.regions[2]
      } else {
        this.searchRegion = this.form.regions[0] + this.form.regions[1] + this.form.regions[2]
      }
    },
    createAddress() {
      const queryData = {}
      const ids = []
      if (this.aftersalesInfo.distributor_id) {
        ids.push(this.aftersalesInfo.distributor_id)
      }
      queryData['distributor_id'] = JSON.stringify(ids)
      queryData['regions_id'] = JSON.stringify(this.form.regions_id)
      queryData['regions'] = JSON.stringify(this.form.regions)
      queryData['province'] = this.form.regions[0]
      queryData['city'] = this.form.regions[1]
      queryData['area'] = this.form.regions[2]
      queryData['address'] = this.aftersales_address
      queryData['contact'] = this.aftersales_contact
      queryData['mobile'] = this.aftersales_mobile
      queryData['is_default'] = this.is_default
      createAftersalesAddress(queryData).then((response) => {
        if (response.data.data.status) {
          this.$message({
            message: this.$t('e67351f7.3fdaea'),
            type: 'success'
          })
          const fd = response.data.data.result
          // console.log(fd)
          this.aftersales_address_id = fd.address_id
          this.aftersales_contact = fd.contact
          this.aftersales_mobile = fd.mobile
          this.aftersales_address = fd.province + fd.city + fd.area + fd.address
          this.is_default = fd.is_default
        } else {
          this.$message({
            message: this.$t('e67351f7.6452a0'),
            type: 'error'
          })
        }
        this.dialogVisible = false
      })
    },
    onAddAddress() {
      this.dialogVisible = true
    }
  }
}

// 两个浮点数相乘
function accMul(num1, num2) {
  var m = 0,
    s1 = num1.toString(),
    s2 = num2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}
</script>
