<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="">
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-date-picker
            v-model="create_time"
            type="daterange"
            :start-placeholder="$t('8906cb64.b44c0f')"
            :range-separator="$t('8906cb64.981cbe')"
            :end-placeholder="$t('8906cb64.1d468b')"
            value-format="yyyy/MM/dd"
            :placeholder="$t('8906cb64.4b8cb9')"
            @change="dateChange"
          />
          <el-select
            v-model="order_class"
            :placeholder="$t('8906cb64.249ee7')"
            @change="TypeHandle"
          >
            <el-option
              v-for="(item, index) in order_class_array"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="order_holder"
            clearable
            :placeholder="$t('8906cb64.edc8a9')"
            @change="TypeHandle"
          >
            <el-option
              v-for="item in orderCategory"
              :key="item.value"
              size="mini"
              :label="$t(item.title)"
              :value="item.value"
            />
          </el-select>
          <!-- <el-input v-model="supplier_name" clearable placeholder="来源供应商" >
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input> -->
          <el-autocomplete
            v-model="source_name"
            class="inline-input"
            :fetch-suggestions="querySearch"
            :placeholder="$t('8906cb64.4b525f')"
            @select="sourceSearch"
          />
          <el-input v-model="salesman_mobile" class="input-m" :placeholder="$t('8906cb64.f1ba67')">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
          <el-input v-model="identifier" class="input-m" :placeholder="$t('8906cb64.f4b2e7')">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
          <el-select
            v-model="source_from"
            :placeholder="$t('8906cb64.f46a3f')"
            clearable
            @change="TypeHandle"
          >
            <el-option
              v-for="(item, index) in sourceFromList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-button-group>
            <el-button type="primary" @click="exportData('normal_master_order')">
              {{ $t('8906cb64.538414') }}
            </el-button>
            <el-button type="primary" @click="exportData('normal_order')">
              {{ $t('8906cb64.82b914') }}
            </el-button>
          </el-button-group>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="$t('3fb52f77.676480')"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
      </el-row>
      <el-dialog
        :title="$t('8906cb64.2cf869')"
        :visible.sync="downloadView"
        :close-on-click-modal="false"
      >
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>

      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('8906cb64.a8b0c2')" name="all" />
        <el-tab-pane :label="$t('8906cb64.d8476e')" name="notship" />
        <el-tab-pane :label="$t('8906cb64.6b715b')" name="cancelapply" />
        <el-tab-pane :label="$t('8906cb64.4933ca')" name="shipping" />
        <el-tab-pane :label="$t('8906cb64.25d532')" name="ziti" />
        <el-tab-pane :label="$t('8906cb64.608afd')" name="notpay" />
        <el-tab-pane :label="$t('8906cb64.3e6db1')" name="cancel" />
        <el-tab-pane :label="$t('8906cb64.fad522')" name="done" />
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          :height="wheight - 190"
          :element-loading-text="$t('8906cb64.f09b12')"
        >
          <el-table-column :label="$t('8906cb64.2b6bc0')" fixed="left">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: { orderId: scope.row.order_id, resource: $route.path }
                }"
                style="margin-right: 5px"
              >
                {{ $t('8906cb64.f26225') }}
              </router-link>
              <el-button
                v-if="
                  scope.row.cancel_status == 'NO_APPLY_CANCEL' &&
                  (scope.row.order_status == 'NOTPAY' || scope.row.order_status == 'PAYED')
                "
                type="text"
                style="margin-right: 5px"
                @click="cancelOrderAction(scope.row.order_id)"
              >
                {{ $t('8906cb64.b21b5e') }}
              </el-button>
              <el-button
                v-if="
                  scope.row.receipt_type == 'logistics' &&
                  scope.row.order_status == 'PAYED' &&
                  scope.row.delivery_status != 'DONE'
                "
                type="text"
                style="margin-right: 5px"
                @click="deliveryAction(scope.row)"
              >
                {{ $t('8906cb64.045315') }}
              </el-button>
              <el-button
                v-if="
                  scope.row.receipt_type == 'ziti' &&
                  scope.row.ziti_status == 'PENDING' &&
                  scope.row.order_status == 'PAYED'
                "
                type="text"
                style="margin-right: 5px"
                @click="writeoffOrderAction(scope.row.order_id)"
              >
                {{ $t('8906cb64.e7d31e') }}
              </el-button>
              <el-button
                v-if="
                  scope.row.cancel_status == 'WAIT_PROCESS' && scope.row.order_status == 'PAYED'
                "
                type="text"
                style="margin-right: 5px"
                @click="confirmCancelOrderAction(scope.row.order_id)"
              >
                {{ $t('8906cb64.44c198') }}
              </el-button>
              <el-button type="text" @click="clickShowRemark(scope.row, 'normalList2')">
                {{ $t('8906cb64.2432b5') }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="order_id" width="150" :label="$t('8906cb64.1e8dc2')" fixed />
          <el-table-column prop="create_time" width="160" :label="$t('8906cb64.eca37c')">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column width="70" :label="$t('8906cb64.9a935b')">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.freight_fee / 100 }}
            </template>
          </el-table-column>
          <!--
          <el-table-column width="70" label="商品金额">
            <template slot-scope="scope">
              {{scope.row.fee_symbol}}{{scope.row.item_fee / 100}}
            </template>
          </el-table-column>
          -->
          <el-table-column prop="total_fee" width="70" :label="$t('8906cb64.4cf24a')">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="point_fee" width="120" :label="$t('8906cb64.d443a9')">
            <template slot-scope="scope">
              {{ scope.row.point_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" width="110" :label="$t('8906cb64.8098e2')" />
          <el-table-column width="90" :label="$t('8906cb64.5cd56b')">
            <template slot-scope="scope">
              <span v-if="scope.row.order_class == 'normal'">{{ $t('8906cb64.e7978e') }}</span>
              <span v-if="scope.row.order_class == 'groups'">{{ $t('8906cb64.9b251e') }}</span>
              <span v-if="scope.row.order_class == 'seckill'">{{ $t('8906cb64.ee8bc9') }}</span>
              <span v-if="scope.row.order_class == 'community'">{{ $t('8906cb64.1ad244') }}</span>
            </template>
          </el-table-column>
          <!--
          <el-table-column prop="is_distribution" label="是否分销">
            <template slot-scope="scope">
              <span v-if="scope.row.is_distribution == 1"> 是 </span>
              <span v-else> - </span>
            </template>
          </el-table-column>
          -->
          <el-table-column prop="order_status" :label="$t('8906cb64.86f6cf')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.order_status == 'PAYED'" type="success" size="mini">
                {{ $t('8906cb64.8d02a5') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'NOTPAY'" size="mini">
                {{ $t('8906cb64.608afd') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status_des == 'CANCEL'" type="danger" size="mini">
                {{ $t('8906cb64.2111cc') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status_des == 'CLOSED'" type="info" size="mini">
                {{ scope.row.order_status_msg }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_BUYER_CONFIRM'"
                type="danger"
                size="mini"
              >
                {{ $t('8906cb64.4933ca') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_SUCCESS'"
                type="warning"
                size="mini"
              >
                {{ $t('8906cb64.e85018') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'"
                type="warning"
                size="mini"
              >
                {{ $t('8906cb64.425a40') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'DONE'" type="success" size="mini">
                {{ $t('8906cb64.fad522') }}
              </el-tag>
              <template
                v-if="
                  scope.row.order_status != 'CANCEL' &&
                  scope.row.order_status != 'REFUND_SUCCESS' &&
                  scope.row.order_status != 'WAIT_GROUPS_SUCCESS'
                "
              >
                <!-- 发货状态 -->
                <el-tag v-if="scope.row.cancel_status == 'WAIT_PROCESS'" type="warning" size="mini">
                  {{ $t('8906cb64.57a640') }}
                </el-tag>
                <el-tag
                  v-else-if="scope.row.delivery_status == 'PARTAIL'"
                  type="danger"
                  size="mini"
                >
                  {{ $t('8906cb64.5296ac') }}
                </el-tag>
                <el-tag v-else-if="scope.row.ziti_status == 'PENDING'" type="danger" size="mini">
                  {{ $t('8906cb64.25d532') }}
                </el-tag>
                <el-tag v-else-if="scope.row.delivery_status == 'PENDING'" size="mini">
                  {{ $t('8906cb64.d8476e') }}
                </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="source_name" :label="$t('8906cb64.f4fcb6')" />
          <el-table-column prop="supplier_name" :label="$t('8906cb64.55c61d')" />

          <el-table-column :label="$t('8906cb64.350fd3')">
            <template slot-scope="scope">
              {{
                getOrderCategoryName(scope.row.order_holder)
                  ? $t(getOrderCategoryName(scope.row.order_holder))
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('8906cb64.edfe4c')">
            <template slot-scope="scope">
              {{ getDistributionType(scope.row) }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('8906cb64.553e84')">
            <template slot-scope="scope">
              {{ getDistributionStatus(scope.row) }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('8906cb64.b7765e')">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('8906cb64.1138a9')">
            <template slot-scope="scope">
              {{ scope.row.payment_fee }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('8906cb64.f3fa72')">
            <template slot-scope="scope">
              {{ scope.row.mobile }}
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-tabs>

      <!-- 发货-开始 -->
      <el-dialog
        :title="deliveryTitle"
        :visible.sync="deliveryVisible"
        :before-close="handleCancel"
        width="57%"
      >
        <template>
          <el-form
            ref="deliveryForm"
            :model="deliveryForm"
            class="demo-ruleForm"
            label-width="100px"
          >
            <el-form-item :label="$t('8906cb64.1e8dc2')">
              <el-col :span="20">
                {{ deliveryData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('8906cb64.b01994')">
              <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
                <el-radio label="batch">{{ $t('8906cb64.afb426') }}</el-radio>
                <el-radio label="sep">{{ $t('8906cb64.95d243') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('8906cb64.b433e6')">
              <el-col :span="30">
                <el-table :data="deliveryData.orderInfo.items" style="width: 100%">
                  <el-table-column prop="item_name" :label="$t('8906cb64.de5472')" width="180" />
                  <el-table-column prop="num" :label="$t('8906cb64.0bf60b')" width="180" />
                  <el-table-column :label="$t('8906cb64.232ca6')">
                    <template slot-scope="scope">
                      <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                    </template>
                  </el-table-column>
                  <template v-if="deliveryForm.delivery_type == 'sep'">
                    <el-table-column :label="$t('8906cb64.f3af96')" width="200">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.delivery_corp"
                          filterable
                          :placeholder="$t('8906cb64.32e586')"
                        >
                          <el-option
                            v-for="item in dlycorps"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                          />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('8906cb64.0bb075')" width="200">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.delivery_code"
                          :maxlength="20"
                          :placeholder="$t('8906cb64.0e9f1e')"
                        />
                      </template>
                    </el-table-column>
                  </template>
                </el-table>
              </el-col>
            </el-form-item>
            <template v-if="deliveryForm.delivery_type == 'batch'">
              <el-form-item :label="$t('8906cb64.f3af96')">
                <el-col>
                  <el-select
                    v-model="deliveryForm.delivery_corp"
                    filterable
                    :placeholder="$t('8906cb64.32e586')"
                  >
                    <el-option
                      v-for="item in dlycorps"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item :label="$t('8906cb64.0bb075')">
                <el-col :span="14">
                  <el-input
                    v-model="deliveryForm.delivery_code"
                    :maxlength="20"
                    :placeholder="$t('8906cb64.0e9f1e')"
                  />
                </el-col>
              </el-form-item>
            </template>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancel">{{ $t('8906cb64.625fb2') }}</el-button>
          <el-button type="primary" @click="submitDeliveryAction">
            {{ $t('8906cb64.38cf16') }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="deliveryTitle"
        :visible.sync="deliveryVisibleNew"
        :before-close="handleCancel"
        width="65%"
      >
        <template>
          <el-form
            ref="deliveryForm"
            :model="deliveryForm"
            class="demo-ruleForm"
            label-width="100px"
          >
            <el-form-item :label="$t('8906cb64.1e8dc2')">
              <el-col :span="20">
                {{ deliveryData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('8906cb64.b01994')">
              <el-radio-group v-model="deliveryForm.delivery_type" :disabled="IsDisabled">
                <el-radio label="batch">{{ $t('8906cb64.afb426') }}</el-radio>
                <el-radio v-if="deliveryForm.delivery_type != 'merchant'" label="sep">
                  {{ $t('8906cb64.95d243') }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('8906cb64.b433e6')">
              <el-table :data="deliveryData.orderInfo.items">
                <el-table-column prop="item_name" :label="$t('8906cb64.de5472')" width="180" />
                <el-table-column :label="$t('8906cb64.2af133')" width="120">
                  <template slot-scope="scope">
                    <span>{{ goodCategoryMap[scope.row.item_holder] }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="supplier_name" :label="$t('8906cb64.55c61d')" width="130" />
                <el-table-column prop="num" :label="$t('8906cb64.0bf60b')" width="100" />
                <el-table-column
                  prop="delivery_item_num"
                  :label="$t('8906cb64.745165')"
                  width="100"
                />
                <el-table-column :label="$t('8906cb64.6943ad')" width="130">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('8906cb64.cc1e68')" width="130">
                  <template slot-scope="scope">
                    <span>{{ scope.row.fee_symbol }}{{ scope.row.cost_price / 100 }}</span>
                  </template>
                </el-table-column>
                <template v-if="deliveryForm.delivery_type == 'sep'">
                  <el-table-column :label="$t('8906cb64.4f5a46')" width="200" fixed="left">
                    <template slot-scope="scope">
                      <el-input-number
                        v-if="scope.row.num - scope.row.delivery_item_num != 0"
                        v-model="scope.row.delivery_num"
                        :placeholder="$t('8906cb64.4f5a46')"
                        controls-position="right"
                        :min="0"
                        :max="scope.row.num - scope.row.delivery_item_num"
                        :disabled="IS_ADMIN() && scope.row.supplier_id > 0"
                      />
                      <span v-if="scope.row.num - scope.row.delivery_item_num == 0">{{
                        $t('8906cb64.82446c')
                      }}</span>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </el-form-item>

            <el-form-item :label="$t('8906cb64.f3af96')">
              <el-col>
                <el-select
                  v-model="deliveryForm.delivery_corp"
                  filterable
                  :placeholder="$t('8906cb64.32e586')"
                >
                  <el-option
                    v-for="item in dlycorps"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <template v-if="deliveryForm.delivery_type == 'merchant'">
              <el-form-item :label="$t('8906cb64.8ba3bf')" width="200">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.delivery_code"
                    :maxlength="20"
                    :placeholder="$t('8906cb64.e78bbb')"
                  />
                </template>
              </el-form-item>
              <el-form-item :label="$t('8906cb64.b7765e')" width="200">
                <el-select
                  v-model="deliveryForm.delivery_ersonnel"
                  clearable
                  :placeholder="$t('8906cb64.708c9d')"
                >
                  <el-option
                    v-for="item in deliveryPersonnel"
                    :key="item.value"
                    size="mini"
                    :label="item.title"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('8906cb64.553e84')" width="200">
                <el-select
                  v-model="deliveryForm.self_delivery_status"
                  clearable
                  :placeholder="$t('8906cb64.708c9d')"
                >
                  <el-option
                    v-for="item in DISTRIBUTION_STATUS"
                    :key="item.value"
                    size="mini"
                    :label="$t(item.title)"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('8906cb64.6bfb9b')">
                <template>
                  <div class="img-container">
                    <SpImagePicker :src="deliveryForm.delivery_pics" :width="48" :height="48" />
                  </div>
                </template>
              </el-form-item>
            </template>

            <el-form-item :label="$t('8906cb64.0bb075')">
              <el-col :span="14">
                <el-input
                  v-model="deliveryForm.delivery_code"
                  :maxlength="20"
                  :placeholder="$t('8906cb64.0e9f1e')"
                />
              </el-col>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancel">{{ $t('8906cb64.625fb2') }}</el-button>
          <el-button type="primary" @click="submitDeliveryAction">
            {{ $t('8906cb64.38cf16') }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="$t('8906cb64.763eea')"
        :visible.sync="cancelVisible"
        :before-close="handleCancelOrderCancel"
        width="57%"
      >
        <template>
          <el-row :gutter="100">
            <el-col :span="24">
              <span class="grid-content">{{ $t('8906cb64.070dce') }}{{ cancelData.order_id }}</span>
            </el-col>
            <el-col :span="24">
              <span v-if="cancelData.cancel_from == 'buyer'">{{ $t('8906cb64.497ac9') }}</span>
              <span v-else>{{ $t('8906cb64.f01ac7') }}</span>
            </el-col>
            <el-col :span="24">
              <span
                >{{ $t('8906cb64.796c1b')
                }}{{ cancelData.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span
              >
            </el-col>
            <el-col :span="24">
              <span>{{ $t('8906cb64.a2f94f') }}</span>
              <span v-if="cancelData.refund_status == 'READY'">{{ $t('8906cb64.5cb424') }}</span>
              <span v-if="cancelData.refund_status == 'AUDIT_SUCCESS'">{{
                $t('8906cb64.202a8b')
              }}</span>
              <span v-if="cancelData.refund_status == 'SUCCESS'">{{ $t('8906cb64.d58cbd') }}</span>
              <span v-if="cancelData.refund_status == 'SHOP_CHECK_FAILS'">{{
                $t('8906cb64.0e14e3')
              }}</span>
              <span v-if="cancelData.refund_status == 'CANCEL'">{{ $t('8906cb64.0a7dff') }}</span>
              <span v-if="cancelData.refund_status == 'PROCESSING'">{{
                $t('8906cb64.cd3291')
              }}</span>
              <span v-if="cancelData.refund_status == 'FAILS'">{{ $t('8906cb64.7c2544') }}</span>
            </el-col>
            <el-col :span="24">
              <span>{{ $t('8906cb64.7f1328') }}</span>
              <span v-if="cancelData.progress == '0'">{{ $t('8906cb64.047109') }}</span>
              <span v-if="cancelData.progress == '1'">{{ $t('8906cb64.2111cc') }}</span>
              <span v-if="cancelData.progress == '2'">{{ $t('8906cb64.07e608') }}</span>
              <span v-if="cancelData.progress == '3'">{{ $t('8906cb64.fad522') }}</span>
              <span v-if="cancelData.progress == '4'">{{ $t('8906cb64.dbf36d') }}</span>
            </el-col>
            <el-col :span="24">
              <span
                >{{ $t('8906cb64.b772c7') }}{{ cancelData.fee_symbol
                }}{{ cancelData.total_fee / 100 }}</span
              >
            </el-col>
            <el-col :span="24">
              <span v-if="cancelData.pay_type == 'wxpay'">{{ $t('8906cb64.f5041a') }}</span>
            </el-col>
            <el-col :span="24">
              <span>{{ $t('8906cb64.27910a') }}{{ cancelData.cancel_reason }}</span>
            </el-col>
          </el-row>
          <el-divider />
          <el-form ref="cancelForm" :model="cancelForm" class="" label-width="100px">
            <el-form-item :label="$t('8906cb64.de455e')">
              <el-row>
                <el-col :span="20">
                  <template>
                    <el-radio v-model="cancelForm.check_cancel" label="0">
                      {{ $t('8906cb64.1bf19c') }}
                    </el-radio>
                    <el-radio v-model="cancelForm.check_cancel" label="1">
                      {{ $t('8906cb64.e61f2c') }}
                    </el-radio>
                  </template>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="cancelForm.check_cancel == '0'" :label="$t('8906cb64.de77c5')">
              <el-row>
                <el-col :span="24">
                  <el-input
                    v-model="cancelForm.shop_reject_reason"
                    type="textarea"
                    :rows="3"
                    :placeholder="$t('8906cb64.fc955a')"
                  />
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancelOrderCancel">{{ $t('8906cb64.625fb2') }}</el-button>
          <el-button type="primary" @click="submitCancelConfirmAction">
            {{ $t('8906cb64.38cf16') }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="$t('8906cb64.b21b5e')"
        :visible.sync="cancelOrderVisible"
        :before-close="handleCancelOrder"
        width="57%"
      >
        <template>
          <el-form ref="cancelForm" :model="cancelOrderForm" class="" label-width="100px">
            <el-form-item :label="$t('8906cb64.070dce')">
              <el-col :span="20">
                {{ cancelOrderData.orderInfo.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('8906cb64.27910a')">
              <el-row>
                <el-col :span="20">
                  <template>
                    <el-select
                      v-model="cancel_order"
                      filterable
                      :placeholder="$t('8906cb64.bc4a11')"
                      @change="cancelReasonSelect"
                    >
                      <el-option
                        v-for="item in order_cancel_reason"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                    <el-input
                      v-show="cancelOrderInput"
                      v-model="cancelOrderForm.other_reason"
                      type="textarea"
                      :rows="3"
                      resize="none"
                      style="width: 200px; margin-top: 10px"
                      :placeholder="$t('8906cb64.c6af7d')"
                    />
                  </template>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancelOrder">{{ $t('8906cb64.625fb2') }}</el-button>
          <el-button type="primary" @click="submitCancelOrderConfirmAction">
            {{ $t('8906cb64.38cf16') }}
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        :title="$t('8906cb64.bdc4b9')"
        :visible.sync="writeoffOrderVisible"
        :before-close="handleWriteoffOrder"
        width="57%"
      >
        <template>
          <el-form ref="cancelForm" :model="writeoffOrderForm" class="" label-width="100px">
            <el-form-item :label="$t('8906cb64.070dce')">
              <el-col :span="20">
                {{ writeoffOrderData.order_id }}
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('8906cb64.2083dd')">
              <el-col v-for="item in writeoffOrderData.items" :key="item.item_id">
                {{ item.item_name }} {{ item.item_spec_desc }} × {{ item.num }}
              </el-col>
            </el-form-item>
            <el-form-item v-if="writeoffOrderData.pickupcode_status" :label="$t('8906cb64.a5a7dd')">
              <el-input
                v-model="writeoffOrderForm.pickupcode"
                :maxlength="6"
                type="text"
                :placeholder="$t('8906cb64.bb28da')"
                style="width: 180px"
              />
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleWriteoffOrder">{{ $t('8906cb64.625fb2') }}</el-button>
          <el-button type="primary" @click="submitWriteoffOrderConfirmAction">
            {{ $t('8906cb64.38cf16') }}
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="$t('8906cb64.ae62ca')"
        :visible.sync="writeoffOrderSuccVisible"
        :before-close="handleWriteoffOrderSucc"
        width="57%"
      >
        <template>
          <span>{{ writeoffOrderSucc.msg }}</span>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleWriteoffOrderSucc">{{ $t('8906cb64.ce2695') }}</el-button>
        </div>
      </el-dialog>
      <RemarkModal ref="modalRef" @onDone="handleRemarksDone" />
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getOrderList,
  getOrderDetail,
  delivery,
  orderExport,
  getCancelOrderInfo,
  cancelConfirm,
  getLogisticsList,
  cancelOrderConfirm,
  getWriteoff,
  doWriteoff,
  getPickupcode
} from '../../../../api/trade'
import { getSourcesList } from '../../../../api/datacube'
import { getSourceFromNameByValue } from '@/utils'
import shopSelect from '@/components/shopSelect'
import RemarkModal from '@/components/remarkModal'
import remarkMixin from '@/mixins/remarkMixin'
import {
  DISTRIBUTION_TYPE,
  DISTRIBUTION_STATUS,
  SELF_ORDER_CATEGORY,
  GOOD_CATEGORY_MAP
} from '@/consts'
import { IS_ADMIN } from '../../../../utils'

export default {
  components: {
    shopSelect,
    RemarkModal
  },
  mixins: [remarkMixin],
  data() {
    return {
      IsDisabled: false,
      activeName: 'all',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20,
        order_class_exclude: 'drug,pointsmall',
        distributor_id: 0,
        distributorIds: [],
        source_from: '',
        order_holder: 'self,self_supplier'
      },
      goodCategoryMap: GOOD_CATEGORY_MAP,
      deliveryPersonnel: [], //配送员
      order_class_array: [
        { name: this.$t('8906cb64.dbb4d8'), value: '' },
        { name: this.$t('8906cb64.9b251e'), value: 'groups' },
        { name: this.$t('8906cb64.ee8bc9'), value: 'seckill' },
        { name: this.$t('8906cb64.1ad244'), value: 'community' },
        { name: this.$t('8906cb64.7762db'), value: 'shopguide' }
      ],
      cancelOrderInput: false,
      order_cancel_reason: [
        { name: this.$t('8906cb64.8f038a'), value: 1 },
        { name: this.$t('8906cb64.5e58ba'), value: 2 },
        { name: this.$t('8906cb64.151111'), value: 3 },
        { name: this.$t('8906cb64.baa450'), value: 4 },
        { name: this.$t('8906cb64.3013ee'), value: 5 },
        { name: this.$t('8906cb64.e7197e'), value: 6 },
        { name: this.$t('8906cb64.74c00b'), value: 7 },
        { name: this.$t('8906cb64.16264a'), value: 8 },
        { name: this.$t('8906cb64.13bea0'), value: 9 },
        { name: this.$t('8906cb64.0e6c86'), value: 10 },
        { name: this.$t('8906cb64.e21052'), value: 11 },
        { name: this.$t('8906cb64.94490e'), value: 12 }
      ],
      order_status: '',
      time_start_begin: '',
      time_start_end: '',
      salesman_mobile: '',
      total_count: 0,
      order_type: 'normal',
      list: [],
      identifier: '',
      source_list: [],
      source_name: '',
      sourceFromList: [
        { name: 'pc', value: 'pc' },
        { name: 'h5', value: 'h5' },
        { name: this.$t('8906cb64.439845'), value: 'wxapp' },
        { name: this.$t('8906cb64.42d922'), value: 'aliapp' },
        { name: this.$t('8906cb64.1622dc'), value: 'unknow' },
        { name: this.$t('8906cb64.2a3e67'), value: 'dianwu' }
      ],
      source_id: '',
      order_class: '',
      order_holder: 'self,self_supplier',
      supplier_name: '',
      cancel_order: '',
      deliveryVisible: false,
      deliveryTitle: '',
      deliveryData: {
        orderInfo: {}
      },
      deliveryForm: {
        delivery_type: 'batch',
        order_id: '',
        delivery_corp: '',
        delivery_code: '',
        sepInfo: {},
        delivery_ersonnel: '',
        self_delivery_status: '',
        delivery_pics: []
      },
      dlycorps: [],
      cancelVisible: false,
      cancelData: {
        orderInfo: {}
      },
      cancelForm: {
        order_id: '',
        check_cancel: '1',
        shop_reject_reason: ''
      },
      cancelOrderVisible: false,
      cancelOrderData: {
        orderInfo: {}
      },
      cancelOrderForm: {
        order_id: '',
        cancel_reason: 0,
        other_reason: ''
      },
      downloadView: false,
      downloadUrl: '',
      downloadName: '',
      writeoffOrderVisible: false,
      writeoffOrderData: {
        items: {}
      },
      writeoffOrderForm: {
        order_id: '',
        pickupcode: ''
      },
      writeoffOrderSuccVisible: false,
      writeoffOrderSucc: {
        msg: ''
      },
      // 选择发货订单的类型，老订单还是新订单
      selectItemType: '',
      deliveryVisibleNew: false,
      orderCategory: SELF_ORDER_CATEGORY
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
      this.params.order_status = this.$route.query.tab
      this.params.page = 1
    }
    this.params.order_type = this.order_type
    this.getOrders(this.params)
    this.getAllSourcesList()
    this.delivery()
  },
  methods: {
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
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.order_status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    storeSearch(val) {
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    TypeHandle(val) {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    numberSearch(e) {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    dateChange(val) {
      if (val.length > 0) {
        this.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.time_start_begin = ''
        this.time_start_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    sourceSearch(item) {
      this.params.source_id = item.source_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    handleCurrentChange(page_num) {
      this.loading = false
      this.params.page = page_num
      this.getParams()
      this.getOrders(this.params)
    },
    handleSizeChange(pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getOrders(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.order_type = this.order_type
      this.params.order_class = this.order_class
      this.params.order_holder = this.order_holder
      this.params.supplier_name = this.supplier_name

      this.params.salesman_mobile = this.salesman_mobile
      this.params.source_from = this.source_from
      if (this.identifier.length == 11) {
        this.params.mobile = this.identifier
        this.params.order_id = ''
      } else {
        this.params.mobile = ''
        this.params.order_id = this.identifier
      }
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getOrders(filter) {
      this.loading = true
      getOrderList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.pager.count)
        this.loading = false
      })
    },
    getAllSourcesList() {
      let params = { page: 1, pageSize: 1000 }
      getSourcesList(params).then((response) => {
        if (response.data.data.list) {
          response.data.data.list.forEach((row) => {
            this.source_list.push({
              value: row.sourceName,
              source_id: row.sourceId
            })
          })
        }
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.source_list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    getOrderCategoryName(order_holder) {
      return this.orderCategory.find((item) => item.value == order_holder)?.title ?? ''
    },
    deliveryAction(data) {
      // 编辑物料弹框
      let order_id = data.order_id

      this.selectItemType = data.delivery_type
      // this.selectItemType = 'new'
      this.deliveryTitle = this.$t('8906cb64.045315')
      getLogisticsList().then((res) => {
        this.dlycorps = res.data.data.list
      })
      getOrderDetail(order_id).then((response) => {
        this.deliveryData = response.data.data
        if (this.deliveryData.orderInfo.cancel_status == 'WAIT_PROCESS') {
          this.$message.error(this.$t('8906cb64.e406db'))
          return false
        }

        if (this.selectItemType == 'old') {
          this.deliveryVisible = true
        } else {
          this.deliveryVisibleNew = true
        }
        //已经拆分发货的和供应商自营订单 都需要拆分发货
        if (
          (this.deliveryData && this.deliveryData.orderInfo.delivery_status == 'PARTAIL') ||
          this.deliveryData.orderInfo.order_holder == 'self_supplier'
        ) {
          this.IsDisabled = true
          this.deliveryForm.delivery_type = 'sep'
        } else {
          this.IsDisabled = false
          this.deliveryForm.delivery_type = 'batch'
        }
      })
      this.deliveryForm.order_id = order_id
    },
    writeoffOrderAction(order_id) {
      //自提订单核销
      getWriteoff(order_id).then((response) => {
        this.writeoffOrderData = response.data.data
        if (this.writeoffOrderData.ziti_status == 'DONE') {
          this.$message.error(this.$t('8906cb64.c9045d'))
          return false
        }
        this.writeoffOrderVisible = true
      })
      console.log(order_id, 111111)
      this.writeoffOrderForm.order_id = order_id
    },
    handleWriteoffOrder() {
      this.writeoffOrderVisible = false
      this.writeoffOrderForm.order_id = ''
      this.writeoffOrderForm.pickupcode = ''
      this.writeoffOrderInput = false
    },
    submitWriteoffOrderConfirmAction() {
      if (
        this.writeoffOrderData.pickupcode_status == 1 &&
        this.writeoffOrderForm.pickupcode == ''
      ) {
        this.$message.error(this.$t('8906cb64.080282'))
        return false
      }
      doWriteoff(this.writeoffOrderForm.order_id, this.writeoffOrderForm).then((response) => {
        var writeoffStatus = response.data.data.ziti_status
        var order_id = response.data.data.order_id
        if (writeoffStatus == 'DONE') {
          this.handleWriteoffOrder()
          this.writeoffOrderSuccVisible = true
          this.writeoffOrderSucc.msg = this.$t('8906cb64.101a8e', [order_id])
        } else {
          this.$message.success(this.$t('8906cb64.47c5ff'))
          return false
        }
      })
    },
    handleWriteoffOrderSucc() {
      this.writeoffOrderSuccVisible = false
      this.writeoffOrderSucc.msg = ''
      this.getOrders(this.params)
    },
    confirmCancelOrderAction(order_id) {
      // 已支付订单的取消订单审核
      let params = { order_type: 'normal' }
      getCancelOrderInfo(order_id, params).then((response) => {
        this.cancelData = response.data.data
        this.cancelVisible = true
        console.log(response)
      })
      this.cancelForm.order_id = order_id
    },
    handleCancelOrderCancel() {
      this.cancelVisible = false
      this.cancelForm.order_id = ''
      this.cancelForm.shop_reject_reason = ''
    },
    submitCancelConfirmAction() {
      // 提交取消订单审核结果
      cancelConfirm(this.cancelForm.order_id, this.cancelForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'AUDIT_SUCCESS') {
          this.handleCancelOrderCancel()
          this.$message.success(this.$t('8906cb64.388738'))
          this.getOrders(this.params)
        } else if (cancelOrderStatus == 'SHOP_CHECK_FAILS') {
          this.handleCancelOrderCancel()
          this.$message.success(this.$t('8906cb64.1cd415'))
          this.getOrders(this.params)
        } else {
          this.$message.error(this.$t('8906cb64.f74090'))
          this.getOrders(this.params)
          return false
        }
      })
    },
    handleCancel() {
      this.deliveryVisible = false
      this.deliveryForm.order_id = ''
      this.deliveryForm.delivery_corp = ''
      this.deliveryForm.delivery_code = ''
      this.deliveryVisibleNew = false
    },
    submitDeliveryAction() {
      // 提交物料
      this.deliveryForm.type = this.selectItemType
      if (this.deliveryForm.delivery_type == 'sep') {
        if (this.selectItemType == 'old') {
          this.deliveryForm.sepInfo = JSON.stringify(this.deliveryData.orderInfo.items)
          this.deliveryForm.delivery_corp = ''
          this.deliveryForm.delivery_code = ''
        } else {
          this.deliveryForm.sepInfo = JSON.stringify(
            JSON.parse(JSON.stringify(this.deliveryData.orderInfo.items)).filter(
              (item) => item.delivery_num && item.delivery_num != ''
            )
          )
        }
      } else {
        this.deliveryForm.sepInfo = {}
      }
      delivery(this.deliveryForm).then((response) => {
        var deliveryStatus = response.data.data.delivery_status
        if (deliveryStatus && deliveryStatus != 'PENDING') {
          this.handleCancel()
          this.$message.success(this.$t('8906cb64.de3b52'))
          this.getOrders(this.params)
        } else {
          this.$message.error(this.$t('8906cb64.2249c1'))
          return false
        }
      })
    },
    cancelOrderAction(order_id) {
      //取消订单
      let params = { order_type: 'normal' }
      getOrderDetail(order_id).then((response) => {
        this.cancelOrderData = response.data.data
        console.log(this.cancelOrderData)
        if (this.cancelOrderData.orderInfo.cancel_status == 'SUCCESS') {
          this.$message.error(this.$t('8906cb64.8f8a2c'))
          return false
        }
        this.cancelOrderVisible = true
      })
      this.cancelOrderForm.order_id = order_id
    },
    handleCancelOrder() {
      this.cancel_order = ''
      this.cancelOrderVisible = false
      this.cancelOrderForm.order_id = ''
      this.cancelOrderForm.other_reason = ''
      this.cancelOrderInput = false
    },
    cancelReasonSelect(val) {
      if (val == 12) {
        this.cancelOrderInput = true
      } else {
        this.cancelOrderForm.other_reason = ''
        this.cancelOrderInput = false
      }
      this.cancelOrderForm.cancel_reason = val
    },
    submitCancelOrderConfirmAction() {
      if (this.cancelOrderForm.cancel_reason == 0) {
        this.$message.error(this.$t('8906cb64.1be7fb'))
        return false
      }
      if (this.cancelOrderForm.cancel_reason == 12 && this.cancelOrderForm.other_reason == '') {
        this.$message.error(this.$t('8906cb64.d31b9c'))
        return false
      }
      cancelOrderConfirm(this.cancelOrderForm.order_id, this.cancelOrderForm).then((response) => {
        var cancelOrderStatus = response.data.data.refund_status
        if (cancelOrderStatus == 'WAIT_CHECK') {
          this.handleCancelOrder()
          this.$message.success(this.$t('8906cb64.86a02e'))
          this.getOrders(this.params)
        } else {
          this.$message.success(this.$t('8906cb64.dc8eed'))
          this.getOrders(this.params)
          return false
        }
      })
    },
    exportData(type) {
      this.getParams()
      if (type) {
        this.params.type = type
      }
      this.params.page = 1
      if (this.params.order_type != 'normal') {
        this.$message({
          type: 'error',
          message: this.$t('8906cb64.08bd5c')
        })
        return
      }
      orderExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('8906cb64.3e1ddd')
          })
          this.$export_open(type)
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('8906cb64.89ae53')
          })
          return
        }
      })
    },
    getSourceFrom({ source_from }) {
      return getSourceFromNameByValue(this.sourceFromList, source_from)
    }
  }
}
</script>
<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
