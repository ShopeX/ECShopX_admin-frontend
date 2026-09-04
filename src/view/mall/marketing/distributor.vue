<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.store-name {
  padding-bottom: 5px;
  font-size: 16px;
}
.store-contact {
  color: #888;
  span {
    margin-right: 10px;
  }
}
.store-address {
  color: #888;
}
.sp-filter-form {
  margin-bottom: 16px;
}
.tips {
  font-size: 12px;
  color: #777;
  line-height: initial;
}
.distributor-btn {
  display: flex;
}
.action-container {
  margin-right: 8px;
}
.el-button {
  &--success {
    &.is-plain {
      color: #67c23a;
      background: #f0f9eb;
      border-color: #c2e7b0;
      &:hover,
      &:focus {
        background-color: inherit;
        border-color: inherit;
        color: inherit;
      }
    }
  }
  &--danger {
    &.is-plain {
      color: #f56c6c;
      background: #fef0f0;
      border-color: #fbc4c4;
      &:hover,
      &:focus {
        background-color: inherit;
        border-color: inherit;
        color: inherit;
      }
    }
  }

  &--info {
    &.is-plain {
      color: #909399;
      background: #f4f4f5;
      border-color: #d3d4d6;
      &:hover,
      &:focus {
        background-color: inherit;
        border-color: inherit;
        color: inherit;
      }
    }
  }

  .more {
    margin-left: 10px;
  }
}
</style>

<template>
  <SpPage>
    <SpRouterView>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
      <!-- <div v-if="VERSION_STANDARD()" class="content-bottom-padded">
        <el-alert type="info" title="操作说明" show-icon>
          <div>
            自动同步：开启自动同步后，总部添加编辑商品会自动同步上架到到店铺，保留开启前的商品状态。关闭同步后将保留已同步的商品数据
          </div>
        </el-alert>
      </div> -->
      <div v-if="IS_MERCHANT()" style="margin-bottom: 10px">
        <el-alert type="info" title="" show-icon>
          <div>{{ $t('b2fe051e.f4347e', [origin + '/shopadmin/login']) }}</div>
        </el-alert>
      </div>

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="distributor_id" :label="$t('b2fe051e.efa91f')">
          <SpSelectShop
            v-model="params.distributor_id"
            clearable
            :placeholder="$t('b2fe051e.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_id" :label="$t('b2fe051e.002a31')">
          <el-input v-model="params.shop_code" :placeholder="$t('b2fe051e.f6d738')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_category_id" :label="$t('b2fe051e.9d2c44')">
          <el-select
            v-model="params.distributor_category_id"
            clearable
            :placeholder="$t('b2fe051e.459c3e')"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.category_id"
              :label="item.category_name"
              :value="item.category_id"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="open_divided"
          :label="$t('b2fe051e.92e8f8')"
          v-if="VERSION_STANDARD()"
        >
          <el-select v-model="params.open_divided" :placeholder="$t('b2fe051e.780afe')">
            <el-option
              v-for="(item, index) in isOpenList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem v-if="VERSION_PLATFORM()" prop="tag_id" :label="$t('b2fe051e.4d4b82')">
          <el-cascader
            v-model="params.tag_id"
            :placeholder="$t('b2fe051e.f9b05d')"
            :options="tag.list"
            :props="{ value: 'tag_id', label: 'tag_name' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" :label="$t('b2fe051e.2f0a34')">
          <el-input v-model="params.mobile" :placeholder="$t('b2fe051e.d9898e')" />
        </SpFilterFormItem>
        <SpFilterFormItem
          v-if="!VERSION_STANDARD()"
          prop="distribution_type"
          :label="$t('b2fe051e.213633')"
        >
          <el-select
            v-model="params.distribution_type"
            clearable
            :placeholder="$t('b2fe051e.677408')"
          >
            <el-option :label="$t('b2fe051e.059670')" value="1">
              {{ $t('b2fe051e.059670') }}
            </el-option>
            <el-option :label="$t('b2fe051e.491c0c')" value="0">
              {{ $t('b2fe051e.491c0c') }}
            </el-option>
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="payment_subject" :label="$t('b2fe051e.4cd089')">
          <el-select
            v-model="params.payment_subject"
            clearable
            :placeholder="$t('b2fe051e.6747b9')"
          >
            <el-option :label="$t('b2fe051e.295713')" value="1">
              {{ $t('b2fe051e.295713') }}
            </el-option>
            <el-option :label="$t('b2fe051e.498128')" value="0">
              {{ $t('b2fe051e.498128') }}
            </el-option>
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem
          v-if="!VERSION_STANDARD() && $store.getters.login_type == 'admin'"
          prop="merchant_name"
          :label="$t('b2fe051e.980296')"
        >
          <el-input v-model="params.merchant_name" :placeholder="$t('b2fe051e.6720e5')" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="distributor-btn">
        <div v-if="!IS_DISTRIBUTOR()" class="action-container">
          <el-button type="primary" icon="el-icon-circle-plus" @click="dialogOpen()">
            {{ $t('b2fe051e.97f5b6') }}
          </el-button>

          <el-button
            v-if="VERSION_STANDARD()"
            type="primary"
            icon="el-icon-circle-plus"
            @click="uploadHandleChange()"
          >
            {{ $t('b2fe051e.94f63e') }}
          </el-button>
        </div>

        <div>
          <!-- <el-button
          v-if="VERSION_PLATFORM() && !is_distributor && !IS_MERCHANT()"
          plain
          type="primary"
          @click="addDistributorTag"
        >
          打标签
        </el-button> -->
          <el-button
            v-if="VERSION_PLATFORM() && !is_distributor && !IS_MERCHANT()"
            type="primary"
            @click="addDistributorTag"
          >
            {{ $t('b2fe051e.fedbca') }}
          </el-button>
          <el-button
            v-if="IS_ADMIN() || IS_MERCHANT()"
            type="primary"
            @click="showSettingDistance('')"
          >
            {{ $t('b2fe051e.4079d2') }}
          </el-button>
          <el-button
            v-if="!IS_DISTRIBUTOR() && !distributor_self"
            type="primary"
            @click="addDistributorSelf()"
          >
            {{ $t('b2fe051e.1707af') }}
          </el-button>
          <template v-else>
            <el-button v-if="!IS_MERCHANT()" type="primary" @click="editDistributorSelf()">
              {{ $t('b2fe051e.f8f1ee') }}
            </el-button>
          </template>
        </div>
      </div>

      <el-tabs v-model="params.is_valid" type="card" @tab-click="onSearch">
        <el-tab-pane
          v-for="(item, index) in isValidList"
          :key="index"
          :label="item.name"
          :name="item.value"
        />
      </el-tabs>

      <el-table
        v-loading="loading"
        :data="tableList"
        border
        @selection-change="handleSelectionChange"
        width="100%"
      >
        <el-table-column
          v-if="VERSION_PLATFORM() && !is_distributor && $store.getters.login_type != 'merchant'"
          type="selection"
          align="center"
          :label="$t('b2fe051e.66eeac')"
        />
        <el-table-column width="50" prop="distributor_id" label="ID" />
        <el-table-column :label="$t('b2fe051e.295713')" min-width="180">
          <template slot-scope="scope">
            <div class="store-name">
              {{ scope.row.name }}
            </div>
            <div v-if="scope.row.store_address" class="store-address">
              <i class="el-icon-place" />
              {{ scope.row.store_address }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="distributor_category_name"
          :label="$t('b2fe051e.2419d0')"
        />
        <el-table-column width="100" prop="shop_code" :label="$t('b2fe051e.f6d738')" />
        <el-table-column
          v-if="VERSION_STANDARD()"
          width="200"
          :label="$t('b2fe051e.7f0ae1')"
          :render-header="renderHeader"
        >
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.auto_sync_goods"
              active-color="#13ce66"
              inactive-color="#cccccc"
              :disabled="scope.row.is_platform_store_buy"
              @change="switchChangeAutoSyncGoods(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="VERSION_STANDARD()" width="200" label="商品自动上架且总部发货">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.auto_sync_goods"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChangeAutoSyncGoods(scope.$index, scope.row)"
            />
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="审核商品">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.is_audit_goods"  active-color="#13ce66" inactive-color="#cccccc" @change="switchChangeAuditGoods(scope.$index, scope.row)"></el-switch>
            </template>
          </el-table-column>-->
        <el-table-column width="80" :label="$t('b2fe051e.b34b94')">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-tooltip
              v-if="!scope.row.lng && !scope.row.lat"
              effect="dark"
              :content="$t('b2fe051e.93ebae')"
              placement="top-start"
            >
              <el-switch
                v-model="scope.row.is_ziti"
                disabled
                active-color="#13ce66"
                inactive-color="#cccccc"
              />
            </el-tooltip>
            <el-switch
              v-else
              v-model="scope.row.is_ziti"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="80" :label="$t('b2fe051e.790974')">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.is_delivery"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>

        <!-- <el-table-column width="100" label="开启业务员">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.is_open_salesman"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column> -->
        <el-table-column width="150" :label="$t('b2fe051e.2e433b')">
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.is_platform_store_buy"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChangePlatformStoreBuy(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="100" :label="$t('b2fe051e.0e903e')">
          <template slot-scope="scope">
            {{ scope.row.is_self_delivery ? $t('b2fe051e.0a60ac') : $t('b2fe051e.c9744f') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="VERSION_STANDARD() && $store.getters.login_type == 'admin'"
          width="100"
          :label="$t('b2fe051e.1e85db')"
        >
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-switch
              v-model="scope.row.open_divided"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="switchChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column min-width="140" :label="$t('b2fe051e.3fea7c')">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.is_valid !== 'delete'"
              type="text"
              @click="editValid(scope.row)"
            >
              <span v-if="scope.row.is_valid == 'true'" class="green">
                <el-button type="success" size="mini" plain
                  >{{ storeStatusLabel('enable') }}<i class="el-icon-edit"
                /></el-button>
              </span>
              <span v-else-if="scope.row.is_valid == 'false'" class="red">
                <el-button type="danger" size="mini" plain
                  >{{ storeStatusLabel('disable') }}<i class="el-icon-edit"
                /></el-button>
              </span>
              <span v-else-if="scope.row.is_valid == 'closed'" class="muted">
                <el-button type="warning" size="mini" plain
                  >{{ $t('b2fe051e.d2b1c3') }}<i class="el-icon-edit"
                /></el-button>
              </span>
              <span v-else class="muted">
                <el-button type="info" size="mini" plain>{{ scope.row.is_valid || '-' }}</el-button>
              </span>
            </el-button>
            <span v-else class="muted">
              <el-button type="info" size="mini" plain>{{ $t('b2fe051e.0044f6') }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!VERSION_STANDARD() && $store.getters.login_type == 'admin'"
          :label="$t('b2fe051e.213633')"
          width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.distribution_type == '1'">{{ $t('b2fe051e.059670') }}</span>
            <span v-else-if="scope.row.distribution_type == '0'">{{ $t('b2fe051e.491c0c') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="$store.getters.login_type == 'admin'"
          width="80"
          :label="$t('b2fe051e.d1c357')"
        >
          <template v-if="scope.row.is_valid !== 'delete'" slot-scope="scope">
            <el-tooltip effect="dark" :content="$t('b2fe051e.f93b8b')" placement="top-start">
              <el-switch
                v-model="scope.row.is_default"
                active-color="#13ce66"
                inactive-color="#cccccc"
                :disabled="scope.row.is_valid != 'true' ? true : false"
                @change="defaultSwitchChange(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column :label="$t('b2fe051e.068acb')" width="100">
          <template slot-scope="scope">
            <span>{{
              scope.row.payment_subject == 1 ? $t('b2fe051e.295713') : $t('b2fe051e.498128')
            }}</span>
            <i
              v-if="IS_ADMIN() && (VERSION_STANDARD() || VERSION_PLATFORM())"
              class="el-icon-edit cursor-pointer"
              style="color: var(--primary)"
              @click="editPaymentSubject(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          v-if="VERSION_PLATFORM()"
          prop="tagList"
          :label="$t('b2fe051e.14d342')"
          class="tab"
        >
          <template slot-scope="scope">
            <el-tag
              v-for="taglist in scope.row.tagList"
              :key="taglist.index"
              closable
              :color="taglist.tag_color"
              size="mini"
              :style="'color:' + taglist.font_color"
              style="display: inline-block; margin-right: 3px"
              @close="handleClose(tag, scope.row, taglist)"
            >
              {{ taglist.tag_name }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!VERSION_STANDARD() && $store.getters.login_type != 'merchant'"
          :label="$t('b2fe051e.6720e5')"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.merchant_name || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('b2fe051e.2b6bc0')" width="180" fixed="left">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                v-if="scope.row.is_valid !== 'delete' && datapass_block == '0'"
                :to="{
                  path: matchRoutePath('editor'),
                  query: { distributor_id: scope.row.distributor_id }
                }"
              >
                {{ $t('b2fe051e.95b351') }}
              </router-link>
            </el-button>

            <el-button type="text" @click="linkTemplates(scope.row)">
              {{ $t('b2fe051e.eab3fc') }}
            </el-button>

            <el-popover placement="top-start" trigger="hover">
              <div>
                <el-button type="text" @click="showSettingMeiQia(scope.row.distributor_id)">
                  {{ $t('b2fe051e.e7dea7') }}
                </el-button>
                <el-button
                  v-if="VERSION_PLATFORM()"
                  type="text"
                  @click="downDistributor(scope.row, 'store')"
                >
                  {{ $t('b2fe051e.a0a85f') }}
                </el-button>
                <el-button v-else type="text" @click="downDistributor(scope.row, 'index')">
                  {{ $t('b2fe051e.a0a85f') }}
                </el-button>

                <el-button type="text">
                  <router-link
                    :to="{
                      path: matchRoutePath('details'),
                      query: { distributor_id: scope.row.distributor_id }
                    }"
                  >
                    {{ $t('b2fe051e.f26225') }}
                  </router-link>
                </el-button>

                <el-button
                  v-clipboard:copy="scope.row.link"
                  v-clipboard:success="onCopy"
                  class="copy-btn"
                  type="text"
                >
                  <!-- <input v-model="scope.row.link" class="copy-link" type="text"> -->
                  {{ $t('b2fe051e.bd057b') }}
                </el-button>
                <el-button
                  v-if="paymentSubjectStatus.wxpay"
                  type="text"
                  @click="linkWxpaysettting(scope.row)"
                >
                  {{ $t('b2fe051e.ccf3d2') }}
                </el-button>
                <el-button
                  v-if="paymentSubjectStatus.alipay"
                  type="text"
                  @click="linkAlipaysettting(scope.row)"
                >
                  {{ $t('b2fe051e.cf1fac') }}
                </el-button>
                <el-button
                  v-if="paymentSubjectStatus.chinaumspay"
                  type="text"
                  @click="showSettingChinaumspay(scope.row.distributor_id)"
                >
                  {{ $t('b2fe051e.13eff4') }}
                </el-button>
                <!-- <el-button v-if="scope.row.distribution_type == '0' || IS_DISTRIBUTOR()" type="text" @click="showSettingDistance(scope.row.distributor_id)">
              店铺范围配置
            </el-button> -->
                <el-button type="text" @click="showSettingDistance(scope.row.distributor_id)">
                  {{ $t('b2fe051e.c43b3c') }}
                </el-button>
              </div>
              <el-button slot="reference" type="text" class="!ml-1.5">
                {{ $t('b2fe051e.0ec9ea') }}<i class="el-icon-arrow-down" />
              </el-button>
            </el-popover>

            <!-- <router-link
              v-if="scope.row.is_valid !== 'delete' && datapass_block == '0'"
              :to="{
                path: matchRoutePath('wxpay'),
                query: { distributor_id: scope.row.distributor_id }
              }"
            >
              <span style="margin-right: 5px">微信支付配置</span>
            </router-link> -->
            <!--<el-button type="text" @click="downDistributor(scope.row, 'scancode')">扫码购页面码(微商城)</el-button>-->
            <!-- <router-link :to="{  path: matchInternalRoute('Storeshopitemanagement'), query: {distributor_id: scope.row.distributor_id}}">商品码</router-link> -->
            <!--router-link :to="{ path: matchRoutePath('detail'), query: { distributor_id: scope.row.distributor_id, distributor_name: scope.row.name,parentPath: '/mall/marketing/distributor'}}">商品码</router-link-->
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 text-right">
        <el-pagination
          background
          :current-page.sync="page.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
        />
      </div>

      <el-dialog
        :title="$t('b2fe051e.a0a85f')"
        :visible.sync="downDistributorVal"
        :close-on-click-modal="false"
      >
        <el-row>
          <el-col :span="8">
            <el-button type="text" @click="downDistributorCode(rowdata, 'yykweishop')">
              {{ $t('b2fe051e.75109c') }}
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <el-dialog
        :visible.sync="dialogVisible"
        width="80%"
        :title="$t('b2fe051e.d3edb3')"
        fullscreen
        lock-scroll
      >
        <shopDecoration :id="current" @saved="closeDialog" />
      </el-dialog>

      <el-dialog
        :visible.sync="pcDialogVisible"
        width="80%"
        :title="$t('b2fe051e.5778f6')"
        fullscreen
        lock-scroll
      >
        <pc-decoration v-if="pcDialogVisible" :id="current" usage="store" @saved="closeDialog" />
      </el-dialog>

      <el-dialog
        :title="$t('b2fe051e.fb0001')"
        class="right-dialog"
        :visible.sync="tag.dialog"
        :before-close="handleCancelLabelsDialog"
      >
        <div class="tag-users view-flex view-flex-middle">
          <i class="iconfont icon-user-circle1" />
          <div class="view-flex-item">
            <span v-for="item in tag.editItem" :key="item">{{ item }}，</span>
          </div>
        </div>

        <div class="selected-tags view-flex">
          <div class="label">{{ $t('b2fe051e.e98819') }}</div>
          <div class="view-flex-item">
            <el-tag
              v-for="(tag, index) in tag.currentTags"
              :key="index"
              closable
              size="small"
              :disable-transitions="false"
              @close="tagRemove(index)"
            >
              {{ tag.tag_name }}
            </el-tag>
          </div>
        </div>
        <hr />
        <div>
          <div class="label">{{ $t('b2fe051e.d0c49d') }}</div>
          <el-tag
            v-for="(tag, index) in tag.tags"
            :key="index"
            class="tag-item"
            size="medium"
            color="#ffffff"
            :disable-transitions="false"
            @click.native="tagAdd(tag, index)"
          >
            {{ tag.tag_name }}
          </el-tag>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tag.dialog = false">{{ $t('b2fe051e.c08ab9') }}</el-button>
          <el-button type="primary" @click="submitItemTag">{{ $t('b2fe051e.aa7527') }}</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="$t('b2fe051e.c2211d')"
        custom-class="distributor-edit-valid-dialog"
        width="420px"
        :visible.sync="editValidDialog"
        :before-close="handleCancelLabelsDialog"
      >
        <template>
          <el-radio-group
            class="distributor-edit-valid-radio-group"
            v-model="editValidData.is_valid"
            @change="editValidSubmit"
          >
            <el-radio label="true"> {{ storeStatusLabel('enable') }} </el-radio>
            <el-radio label="false"> {{ storeStatusLabel('disable') }} </el-radio>
            <el-radio label="closed"> {{ $t('b2fe051e.d2b1c3') }} </el-radio>
            <el-radio label="delete"> {{ $t('b2fe051e.0044f6') }} </el-radio>
          </el-radio-group>
        </template>
      </el-dialog>
      <!-- 编辑距离-开始 -->
      <!-- <el-dialog
        title="店铺范围配置"
        width="50%"
        :visible.sync="setDistanceVisible"
        :before-close="handleDistanceCancel"
      >
        <template>
          <el-form
            ref="distanceForm"
            :model="distanceForm"
            class="demo-ruleForm"
            label-width="90px"
          >
            <el-form-item label="距离">
              <el-input
                v-model.number="distanceForm.distance"
                min="1"
                type="number"
                oninput="value=value.replace(/[^\d.]/g,'')"
                placeholder="输入大于等于0的数字，为0则显示所有店铺"
                style="width: 30%"
              />&nbsp;km
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleDistanceCancel"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmitDistance"> 保存 </el-button>
        </div>
      </el-dialog> -->
      <el-dialog
        :title="$t('b2fe051e.c43b3c')"
        width="35%"
        :visible.sync="setDistanceVisible"
        :before-close="handleDistanceCancel"
      >
        <SpForm
          v-model="distanceForm"
          :form-list="formList"
          :submit="true"
          @resetForm="handleDistanceCancel"
          @onSubmit="handleSubmitDistance"
        />
      </el-dialog>
      <!-- 编辑距离-结束 -->

      <!-- 银联商务支付配置-开始 -->
      <!-- 银联商务支付配置 -->
      <SpDialog
        ref="chinaumspayDialogRef"
        width="40%"
        v-model="setChinaumspayVisible"
        :title="$t('b2fe051e.13eff4')"
        :form="chinaumspayForm"
        :form-list="chinaumspayFormList"
        @onSubmit="handleSubmitChinaumspay"
      />
      <!-- 银联商务支付配置-结束 -->

      <!-- 添加分组 -->
      <SpDialog
        ref="kfRef"
        v-model="keFuDialog"
        :title="$t('b2fe051e.c05ab1')"
        :modal="false"
        :form="keFuForm"
        :form-list="keFuFormList"
        @onSubmit="onKeFuFormSubmit"
      />

      <!-- 编辑收款主体 -->
      <SpDialog
        ref="paymentSubjectDialogRef"
        width="30%"
        v-model="paymentSubjectDialog"
        :title="`${$t('d41d8cd9.j8k9l0')}${paymentSubjectForm.name || ''}${$t('d41d8cd9.m1n2o3')}`"
        :form="paymentSubjectForm"
        :form-list="paymentSubjectFormList"
        @onSubmit="onPaymentSubjectSubmit"
      />
    </SpRouterView>
  </SpPage>
</template>
<script>
import districtOptions from '@/mixins/districtOptions'
import { mapGetters } from 'vuex'
import SpForm from '@/components/sp-form'
import {
  saveDistributor,
  getWxaDristributorCodeStream,
  setDefaultDistributor,
  saveOpen,
  NewdeleteTag
} from '@/api/marketing'
import { getTagList, distributorRelTags, getDistance, setDistance } from '@/api/marketing'
import { getDistributorMeiQia, setDistributorMeiQia } from '@/api/im'
import shopDecoration from '@/components/function/shopDecoration'
import pcDecoration from '@/view/pc/homePage/default'
import { getSetting } from '@/api/fenzhang'
import { setPaymentSetting, getPaymentSetting } from '@/api/trade'
import mixin, { pageMixin } from '@/mixins'
import { IS_ADMIN } from '@/utils'
import { handleUploadFile } from '../../../api/common'
import store from '@/store'
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
  components: { shopDecoration, pcDecoration },
  mixins: [mixin, pageMixin, districtOptions],
  data() {
    const initialParams = {
      is_valid: undefined,
      distributor_id: undefined,
      tag_id: [],
      shop_code: undefined,
      open_divided: undefined,
      payment_subject: undefined,
      distributor_category_id: undefined
    }

    const validateLink = (rule, value, callback) => {
      const { channel, wxapp, h5, app, aliapp, pc } = this.keFuForm
      if (channel == 'multi') {
        if (wxapp || h5 || app || aliapp || pc) {
          callback()
        } else {
          callback(new Error(this.$t('b2fe051e.d94839')))
        }
      } else {
        callback()
      }
    }
    return {
      formList: [
        {
          label: this.$t('b2fe051e.3ec2bb'),
          key: 'distance',
          component: () => (
            <div>
              <el-input
                placeholder={this.$t('b2fe051e.61b8fa')}
                width='60%'
                v-model={this.distanceForm.distance}
              />
              &nbsp;km
            </div>
          ),
          validator: (rule, value, callback) => {
            const { distance } = this.distanceForm
            const regex = /^\d+$/
            if (regex.test(distance)) {
              callback()
            } else {
              callback(new Error(this.$t('b2fe051e.de66a2')))
            }
          }
        }
      ],
      distributorIds: '',
      initialParams,
      params: {
        ...initialParams
      },
      origin: '',
      datapass_block: 1,
      is_distributor: false,
      dialogVisible: false,
      current: '', // 当前店铺id
      isOpenList: [
        { name: this.$t('b2fe051e.789372'), value: true },
        { name: this.$t('b2fe051e.70264a'), value: false }
      ],
      changeStatus: true,
      activeName: 'first',
      total_count: 0,
      distributor_self: '',
      detailDialog: false,
      pcDialogVisible: false,
      dialogTitle: '',
      loading: false,
      form: {
        distributor_id: null,
        mobile: '',
        address: '',
        name: '',
        is_valid: 'true',
        regions_id: [],
        regions: [],
        shop_id: 0,
        contact: '',
        is_distributor: 'true'
      },
      list: [],
      categoryList: [],
      regions: [],
      codetype: 'index',
      rowdata: {},
      downDistributorVal: false,
      distributor_id: [],
      tag: {
        dialog: false,
        editItem: [],
        list: [],
        form: {
          tag_ids: [],
          distributor_id: []
        },
        currentTags: [],
        tags: []
      },
      editValidDialog: false,
      editValidData: {
        distributor_id: '',
        is_valid: ''
      },
      editValidOriginStatus: '',
      setMeiQiaVisible: false,
      setMeiQiaDialog: false,
      meiqia_form: {
        distributor_id: '',
        meiqia_id: '',
        meiqia_token: ''
      },
      setDistanceVisible: false,
      setDistanceDialog: false,
      distanceForm: {
        distance: ''
      },
      setChinaumspayVisible: false,
      chinaumspayForm: {
        distributor_id: 0,
        mid: '',
        tid: '',
        enterpriseid: ''
      },
      chinaumspayFormList: [
        {
          label: this.$t('b2fe051e.f173b7'),
          key: 'mid',
          type: 'input',
          defaultValue: '',
          required: true,
          message: this.$t('b2fe051e.b9a935'),
          componentProps: {
            placeholder: this.$t('b2fe051e.b9a935')
          }
        },
        {
          label: this.$t('b2fe051e.e50499'),
          key: 'tid',
          type: 'input',
          defaultValue: '',
          required: true,
          message: this.$t('b2fe051e.7f0d4e'),
          componentProps: {
            placeholder: this.$t('b2fe051e.7f0d4e')
          }
        },
        {
          label: this.$t('b2fe051e.5edcc7'),
          key: 'enterpriseid',
          type: 'input',
          defaultValue: '',
          required: true,
          message: this.$t('b2fe051e.75dc2e'),
          componentProps: {
            placeholder: this.$t('b2fe051e.75dc2e')
          }
        }
      ],
      isOpen: false,
      keFuDialog: false,
      keFuForm: {
        distributor_id: '',
        channel: 'single', // single、multi
        common: '',
        wxapp: '',
        h5: '',
        app: '',
        aliapp: '',
        pc: ''
      },
      paymentSubjectDialog: false,
      paymentSubjectForm: {
        distributor_id: '',
        payment_subject: 0,
        name: ''
      },
      paymentSubjectFormList: [
        {
          label: this.$t('b2fe051e.068acb'),
          key: 'payment_subject',
          type: 'radio',
          defaultValue: 0,
          options: [
            { label: 0, name: this.$t('b2fe051e.498128') },
            { label: 1, name: this.$t('b2fe051e.295713') }
          ],
          required: true,
          message: this.$t('b2fe051e.590651')
        }
      ],
      paymentSubjectStatus: {
        wxpay: false,
        alipay: false,
        chinaumspay: false
      }, // 支付配置开关状态
      keFuFormList: [
        {
          label: this.$t('b2fe051e.3161fb'),
          key: 'channel',
          type: 'radio',
          options: [
            { label: 'single', name: this.$t('b2fe051e.892fef') },
            { label: 'multi', name: this.$t('b2fe051e.a45b0d') }
          ]
        },
        {
          label: this.$t('b2fe051e.c3c135'),
          key: 'common',
          component: () => (
            <div class='kf-link'>
              <el-input
                type='text'
                placeholder={this.$t('b2fe051e.c33409')}
                v-model={this.keFuForm.common}
              />
              <div class='tips'>{this.$t('d41d8cd9.p4q5r6')}</div>
            </div>
          ),
          validator: (rule, value, callback) => {
            const { channel, common } = this.keFuForm
            if (channel == 'single' && !common) {
              callback(new Error(this.$t('b2fe051e.96c134')))
            } else {
              callback()
            }
          },
          isShow: () => {
            return this.keFuForm.channel == 'single'
          }
        },
        {
          label: this.$t('b2fe051e.439845'),
          key: 'wxapp',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        },
        {
          label: this.$t('b2fe051e.715f06'),
          key: 'h5',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        },
        {
          label: this.$t('b2fe051e.df708d'),
          key: 'app',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        },
        {
          label: this.$t('b2fe051e.42d922'),
          key: 'aliapp',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        },
        {
          label: this.$t('b2fe051e.f0497f'),
          key: 'pc',
          type: 'input',
          validator: validateLink,
          isShow: () => {
            return this.keFuForm.channel == 'multi'
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    isLoginTypeNormal() {
      return (
        this.$store.getters.login_type === 'admin' || this.$store.getters.login_type === 'admin'
      )
    },
    isValidList() {
      return [
        { name: this.$t('b2fe051e.a8b0c2'), value: undefined },
        { name: this.storeStatusLabel('enable'), value: 'true' },
        { name: this.storeStatusLabel('disable'), value: 'false' },
        { name: this.$t('b2fe051e.d2b1c3'), value: 'closed' },
        { name: this.$t('b2fe051e.0044f6'), value: 'delete' }
      ]
    }
  },

  mounted() {
    this.origin = window.location.origin
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    this.fetchList()
    this.getAllTagList()
    this.getCategoryList()
    getSetting().then((res) => {
      let data = res.data.data
      this.isOpen = data.is_open == 'true'
    })
    // 获取支付配置开关状态
    this.getPaymentSubjectStatus()
  },
  methods: {
    storeStatusLabel(type) {
      const isCloudStore = this.VERSION_STANDARD()
      const keyMap = {
        enable: isCloudStore ? 'b2fe051e.c8f21a' : 'b2fe051e.7854b5',
        disable: isCloudStore ? 'b2fe051e.d9e32b' : 'b2fe051e.710ad0'
      }
      return this.$t(keyMap[type])
    },
    // 导入店铺
    uploadHandleChange(file, fileList) {
      this.$router.push({ path: this.matchRoutePath('storeupload') })
    },
    renderHeader(h, { column }) {
      return h('span', null, [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              placement: 'bottom',
              effect: 'dark'
            }
          },
          [
            h('i', {
              class: 'el-icon-warning-outline',
              style: 'margin-left: 4px; cursor: pointer;'
            }),
            h(
              'div',
              {
                slot: 'content'
              },
              [
                this.$t('d41d8cd9.s7t8u9'),
                h('br'),
                this.$t('d41d8cd9.v0w1x2'),
                h('br'),
                this.$t('d41d8cd9.y3z4a5')
              ]
            )
          ]
        )
      ])
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    getParams() {
      let params = {
        ...this.params
      }
      params.is_valid = this.params.is_valid === '0' ? undefined : this.params.is_valid
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count, distributor_self, datapass_block } =
        await this.$api.marketing.getDistributorList(params)
      this.tableList = list.map((item) => {
        if (this.VERSION_PLATFORM()) {
          item.link = `${process.env.VUE_APP_H5_HOST}/subpages/store/index?id=${item.distributor_id}`
        } else {
          item.link = `${process.env.VUE_APP_H5_HOST}/${item.link}`
        }
        return item
      })
      this.page.total = total_count
      this.distributor_self = distributor_self
      this.datapass_block = datapass_block
      this.loading = false
    },
    async handleClose(tag, { distributor_id }, { tag_id }) {
      const obj = {
        distributor_ids: [distributor_id],
        tag_ids: [tag_id]
      }

      const result = await NewdeleteTag(obj)
      this.$message.success(this.$t('b2fe051e.0007d1'))
      this.fetchList()
      console.log(result)
    },
    linkTemplates(distributor) {
      const { distributor_id, address, name, distribution_type } = distributor
      this.$store.dispatch('setTemplateName', 'yykweishop')
      this.$router.push({
        path: this.matchRoutePath('template'),
        query: { distributor_id, address, name, distribution_type }
      })
    },
    linkWxpaysettting(distributor) {
      const { distributor_id, name } = distributor
      this.$router.push({
        path: this.matchRoutePath('wxpaysetting'),
        query: { distributor_id, name }
      })
    },
    linkAlipaysettting(distributor) {
      const { distributor_id, name } = distributor
      this.$router.push({
        path: this.matchRoutePath('alipaysetting'),
        query: { distributor_id, name }
      })
    },
    dialogShow(id, type) {
      this.current = id
      type === 'pc' ? (this.pcDialogVisible = true) : (this.dialogVisible = true)
    },
    closeDialog() {
      this.dialogVisible = false
      this.pcDialogVisible = false
    },
    dialogOpen(detail = null) {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    handleDistance() {
      this.distanceForm.distance = ''
      // this.resetInfo();
      // this.operate = "create";
      // this.dialogVisible = true;
    },
    addDistributorSelf() {
      this.$router.push({
        path: this.matchRoutePath('editor'),
        query: { distributor_type: 'distributor_self' }
      })
    },
    editDistributorSelf() {
      this.$router.push({
        path: this.matchRoutePath('editor'),
        query: { distributor_type: 'distributor_self', distributor_id: this.distributor_self }
      })
    },

    downDistributorCode(row, template_name) {
      let params = { distributor_id: row.distributor_id, codetype: this.codetype }
      if (template_name) {
        params.template_name = template_name
      }
      getWxaDristributorCodeStream(params).then((response) => {
        var a = document.createElement('a')
        var temp = this.$t('d41d8cd9.b6c7d8')
        a.href = response.data.data.base64Image
        if (response.data.data.tempname) {
          temp = response.data.data.tempname
        }
        a.download = temp + row.name + '.png'
        a.click()
      })
    },
    storeSearch(val) {
      this.params.page = 1
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.fetchList()
    },

    RegionChangeSearch(value) {
      var vals = getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.params.province = vals[0].label
        this.params.city = ''
        this.params.area = ''
      } else if (vals.length == 2) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = ''
      } else if (vals.length == 3) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = vals[2].label
      }
      this.params.page = 1
    },
    downDistributor(row, codetype) {
      this.codetype = codetype
      this.rowdata = row
      this.downDistributorVal = true
    },
    defaultSwitchChange(row) {
      if (row.is_default) {
        var params = {
          distributor_id: row.distributor_id
        }
        setDefaultDistributor(params).then((response) => {
          if (response.data.data.status) {
            for (var i = this.list.length - 1; i >= 0; i--) {
              if (this.list[i].distributor_id != row.distributor_id) {
                this.list[i].is_default = false
              }
            }
          }
          this.onSearch()
        })
      } else {
        saveDistributor({
          distributor_id: row.distributor_id,
          is_default: false
        }).then(() => {
          this.onSearch()
        })
      }
    },
    switchChangeAuditGoods(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_audit_goods: row.is_audit_goods
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: this.$t('b2fe051e.3b1083')
        })
      })
    },
    switchChangeAutoSyncGoods(index, row) {
      if (row.is_platform_store_buy) {
        row.auto_sync_goods = false
        return
      }
      var params = {
        distributor_id: row.distributor_id,
        auto_sync_goods: row.auto_sync_goods
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: this.$t('b2fe051e.3b1083')
        })
      })
    },
    switchChangePlatformStoreBuy(index, row) {
      const params = {
        distributor_id: row.distributor_id,
        is_platform_store_buy: row.is_platform_store_buy
      }
      if (row.is_platform_store_buy) {
        row.auto_sync_goods = false
        params.auto_sync_goods = false
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: this.$t('b2fe051e.3b1083')
        })
      })
    },
    switchChangeOpen(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_open: row.is_open
      }
      saveOpen(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: this.$t('b2fe051e.3b1083')
        })
      })
    },
    switchChange(index, row) {
      var params = {
        distributor_id: row.distributor_id,
        is_ziti: row.is_ziti,
        is_delivery: row.is_delivery,
        is_open_salesman: row.is_open_salesman,
        is_platform_store_buy: row.is_platform_store_buy,
        open_divided: row.open_divided
      }
      saveDistributor(params).then((response) => {
        this.detailDialog = false
        this.fetchList()
        this.$message({
          type: 'success',
          message: this.$t('b2fe051e.3b1083')
        })
      })
    },
    handleSelectionChange(val) {
      let distributor_id = []
      for (let i in val) {
        distributor_id.push(val[i].distributor_id)
      }
      this.distributor_id = distributor_id
    },
    async getPaymentSubjectStatus() {
      try {
        const data = await this.$api.system.getPaymentSubjectStatus()
        console.log(data)
        this.paymentSubjectStatus = {
          wxpay: data.wxpay.is_open,
          alipay: data.alipay.is_open,
          chinaumspay: data.chinaumspay.is_open
        }
      } catch (error) {
        this.paymentSubjectStatus = {
          wxpay: false,
          alipay: false,
          chinaumspay: false
        }
        console.error('Get payment config failed:', error)
      }
    },
    getAllTagList() {
      let params = {
        page: 1,
        pageSize: 500
      }
      getTagList(params).then((response) => {
        this.tag.list = response.data.data.list
      })
    },
    async getCategoryList() {
      try {
        const res = await this.$api.store.getStoreCategoryList({
          page: 1,
          pageSize: 1000
        })
        this.categoryList = res.list || []
      } catch (error) {
        console.error('获取门店分类列表失败:', error)
      }
    },
    handleCancelLabelsDialog() {
      this.editValidDialog = false
      this.tag.dialog = false
      this.fetchList()
    },
    tagUpdate(row) {
      this.tag.editItem = [row.itemName]
      this.tag.currentTags = row.tagList || []
      this.tag.form.distributor_id = row.distributor_id
      this.showTags()
    },
    addDistributorTag() {
      this.tag.currentTags = []
      if (this.distributor_id.length) {
        let res = []
        this.tableList.forEach((item) => {
          this.distributor_id.forEach((n) => {
            if (item.distributor_id == n) {
              res = [...res, ...item.tagList]
            }
          })
        })
        res = Array.from(new Map(res.map((item) => [item.tag_id, item])).values())
        this.tag.currentTags = res
        this.showTags()
        this.tag.form.distributor_id = this.distributor_id
      } else {
        this.$message({
          type: 'error',
          message: this.$t('b2fe051e.272270')
        })
      }
    },
    showTags() {
      this.tag.tags = [...this.tag.list]
      this.tag.tags.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
        if (isInArr != -1) this.tag.tags.splice(index, 1)
      })
      this.tag.dialog = true
    },
    tagRemove(index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
    },
    tagAdd(item, index) {
      let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
    },
    submitItemTag() {
      this.tag.form.tag_ids = []
      this.tag.currentTags.forEach((item) => {
        this.tag.form.tag_ids.push(item.tag_id)
      })
      if (this.tag.form.tag_ids.length <= 0) {
        this.$message({
          type: 'error',
          message: this.$t('b2fe051e.d08484')
        })
        return false
      }
      this.tag.dialog = false
      distributorRelTags(this.tag.form).then((res) => {
        if (res.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('b2fe051e.e27f17')
          })
          this.fetchList()
        }
      })
    },
    tagSearchUserChange() {
      this.currentPage = 1
      this.getParams()
      this.getItemsList(this.params)
      this.loading = false
    },
    editValid(row) {
      this.editValidDialog = true
      this.editValidOriginStatus = row.is_valid
      this.editValidData = {
        distributor_id: row.distributor_id,
        is_valid: row.is_valid
      }
    },
    editValidSubmit(val) {
      let msg = ''
      if (val === 'true') {
        msg = this.$t(this.VERSION_STANDARD() ? 'b2fe051e.e0f43c' : 'b2fe051e.31ffeb')
      } else if (val === 'false') {
        msg = this.$t(this.VERSION_STANDARD() ? 'b2fe051e.f1a54d' : 'b2fe051e.3abe79')
      } else if (val === 'closed') {
        msg = this.$t('b2fe051e.c9d4e1')
      } else if (val === 'delete') {
        msg = this.$t('b2fe051e.b31c83')
      }
      this.$confirm(msg, this.$t('b2fe051e.02d981'), {
        confirmButtonText: this.$t('b2fe051e.38cf16'),
        cancelButtonText: this.$t('b2fe051e.625fb2'),
        type: 'warning'
      })
        .then(() => {
          let params = {
            distributor_id: this.editValidData.distributor_id,
            is_valid: this.editValidData.is_valid
          }
          saveDistributor(params).then((response) => {
            this.detailDialog = false
            this.fetchList()
            this.$message({
              type: 'success',
              message: this.$t('b2fe051e.2b689f')
            })
            this.editValidDialog = false
          })
        })
        .catch(() => {
          this.editValidData.is_valid = this.editValidOriginStatus
          this.$message({
            type: 'info',
            message: this.$t('b2fe051e.2111cc')
          })
        })
    },
    async showSettingMeiQia(distributor_id) {
      this.keFuForm.distributor_id = distributor_id
      this.keFuDialog = true
      const {
        channel,
        meiqia_url: { aliapp, app, common, h5, pc, wxapp }
      } = await this.$api.im.getDistributorMeiQia(distributor_id)

      this.keFuForm = {
        ...this.keFuForm,
        channel,
        common,
        wxapp,
        h5,
        app,
        aliapp,
        pc
      }
    },
    async onKeFuFormSubmit() {
      const { channel, common, wxapp, h5, app, aliapp, pc } = this.keFuForm
      const params = {
        channel,
        common,
        wxapp,
        h5,
        app,
        aliapp,
        pc
      }
      await this.$api.im.setDistributorMeiQia(this.keFuForm.distributor_id, params)
      this.keFuDialog = false
      this.$message.success(this.$t('b2fe051e.3b1083'))
    },
    editPaymentSubject(row) {
      // 打开编辑收款主体弹框
      this.paymentSubjectForm = {
        distributor_id: row.distributor_id,
        payment_subject: Number(row.payment_subject) || 0,
        name: row.name || ''
      }
      this.paymentSubjectDialog = true
    },
    async onPaymentSubjectSubmit() {
      try {
        const params = {
          payment_subject: this.paymentSubjectForm.payment_subject
        }
        await this.$api.shop.updatePaymentSubject(this.paymentSubjectForm.distributor_id, params)
        this.$message.success(this.$t('b2fe051e.3b1083'))
        this.paymentSubjectDialog = false
        // 刷新列表
        this.fetchList()
      } catch (error) {
        console.log(error)
      }
    },
    showSettingDistance(distributor_id) {
      // 设置距离参数
      this.setDistanceVisible = true
      let that = this
      that.distributorIds = distributor_id
      that.distanceForm.distance = 0
      if (distributor_id) {
        getDistance({ distributor_id }).then((response) => {
          that.distanceForm.distance = response.data.data.distance
        })
      }
    },
    handleDistanceCancel() {
      // 距离设置窗口关闭
      this.setDistanceVisible = false
      this.distanceForm.distance = ''
    },
    handleSubmitDistance() {
      // 提交距离配置
      let params = {
        distance: this.distanceForm.distance,
        distributor_id: this.distributorIds
      }
      setDistance(params).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('b2fe051e.23b62e')
        })
        this.handleDistanceCancel()
      })
    },
    showSettingChinaumspay(distributor_id) {
      // 设置银联商务支付配置
      this.setChinaumspayVisible = true
      let query = { pay_type: 'chinaumspay', distributor_id: distributor_id }
      getPaymentSetting(query).then((response) => {
        const data = response.data.data
        this.chinaumspayForm = {
          distributor_id: distributor_id,
          mid: data.mid || '',
          tid: data.tid || '',
          enterpriseid: data.enterpriseid || ''
        }
      })
    },
    handleChinaumspayCancel() {
      // 银联商务支付设置窗口关闭
      this.setChinaumspayVisible = false
      this.chinaumspayForm = {
        distributor_id: 0,
        mid: '',
        tid: '',
        enterpriseid: ''
      }
    },
    async handleSubmitChinaumspay() {
      try {
        await this.$refs.chinaumspayDialogRef.$refs.form.validate()
      } catch (error) {
        return
      }
      // 提交银联支付配置
      try {
        let params = {
          pay_type: 'chinaumspay',
          distributor_id: this.chinaumspayForm.distributor_id,
          mid: this.chinaumspayForm.mid,
          tid: this.chinaumspayForm.tid,
          enterpriseid: this.chinaumspayForm.enterpriseid
        }
        await setPaymentSetting(params)
        this.$message({
          type: 'success',
          message: this.$t('b2fe051e.23b62e')
        })
        this.handleChinaumspayCancel()
      } catch (error) {
        console.log(error)
      }
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.fetchList()
    },
    onCopy() {
      this.$notify.success({
        message: this.$t('b2fe051e.20a495'),
        showClose: true
      })
    },
    isShowEdit() {
      if (this.IS_ADMIN() && (this.VERSION_STANDARD() || this.VERSION_PLATFORM())) return true
      return false
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    if (to.path.indexOf('editor') === -1 && to.path.indexOf('details') === -1) {
      this.fetchList()
      this.getAllTagList()
    }
  }
}
</script>

<style lang="scss">
/* 修改状态弹窗：单选项纵向排列，避免窄宽度下横向挤压导致文案与边框被裁切 */
.distributor-edit-valid-dialog.el-dialog {
  min-width: 300px;
  max-width: 96vw;
}
.distributor-edit-valid-radio-group.el-radio-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.distributor-edit-valid-radio-group .el-radio {
  margin-right: 0;
  margin-bottom: 10px;
  white-space: normal;
  line-height: 1.5;
}
.distributor-edit-valid-radio-group .el-radio:last-child {
  margin-bottom: 0;
}
</style>
