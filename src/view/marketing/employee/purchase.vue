<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.marketing-employee-purchase {
  .activity-name,
  .activity-title {
    max-width: 480px;
  }

  .link-home {
    margin-right: 4px;
  }

  .company-list {
    width: 100%;
    max-width: 1200px;

    .el-input {
      max-width: 480px;
    }

    .el-select__tags {
      max-width: 100% !important;
    }
  }

  .el-range-separator {
    width: 30px;
  }

  .activity-pic-field {
    margin-top: 10px;

    .form-item-tip {
      margin-bottom: 4px;
    }
  }

  .company-list {
    .el-tag {
      margin-right: 8px;
    }
  }

  .preheat-time {
    .el-date-editor--datetime {
      margin: 0 8px;
    }
  }

  .activity-employee-field {
    .form-item-content {
      label {
        margin-right: 10px;
        white-space: nowrap;
      }

      &:not(:last-child) {
        margin-bottom: 6px;
      }
    }

    .form-item-tip {
      margin-top: 4px;
    }

    .content-item {
      display: flex;
      align-items: center;
    }
  }

  .purchase-inline-fade-enter-active,
  .purchase-inline-fade-leave-active {
    transition: opacity 0.36s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .purchase-inline-fade-enter,
  .purchase-inline-fade-leave-to {
    opacity: 0;
  }

  .activity-relatives-field {
    margin-top: 10px;

    .form-item-content {
      label {
        margin-right: 10px;
        white-space: nowrap;
      }

      &:not(:last-child) {
        margin-bottom: 6px;
      }
    }

    .form-item-tip {
      margin-left: 10px;
    }

    .content-item {
      display: flex;
    }

    .item-wrap {
      display: flex;
      align-items: center;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      .el-radio {
        margin-right: 0;
      }

      .el-radio__label {
        color: #666;
      }
    }
  }

  .activity-limit-field {
    margin-top: 10px;

    .content-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;

      label {
        margin-right: 10px;
      }

      .sp-input {
        flex: 1;
      }

      .item-wrap {
        display: flex;
        align-items: center;
      }
    }
  }

  .passphrase-enterprise-block {
    width: 100%;
    min-width: 880px;
    max-width: 1200px;

    .passphrase-enterprise-table {
      width: 100%;
    }

    .passphrase-quota-header {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px 8px;
      vertical-align: middle;
    }

    .passphrase-batch-fill-btn {
      padding: 0;
      font-size: 12px;
    }
  }
}

/* 批量填充 / 随机生成：Popover 内容 append 到 body，不能写在 .passphrase-enterprise-block 内 */
.passphrase-batch-fill-popover {
  padding: 4px 2px 2px;
  box-sizing: border-box;

  .passphrase-batch-fill-popover__field {
    display: block;
    margin-bottom: 20px;
  }

  .el-input {
    display: block;
    width: 100%;
  }

  .passphrase-batch-fill-popover__actions {
    margin-top: 4px;
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
    text-align: right;
  }

  .passphrase-batch-code-popover__tip {
    margin: 0 0 12px;
    font-size: 13px;
    color: #606266;
    line-height: 1.5;
  }
}

.purchase-store-home-picker-dialog {
  .purchase-store-home-picker__filter {
    margin-bottom: 12px;
  }

  .purchase-store-home-picker__shop {
    width: 280px;
  }
}
</style>
<template>
  <SpPage :title="$t('39e3acc2.34213d')">
    <template slot="page-footer">
      <ActionsButton class="text-center" :disabled="footerSaveDisabled" @save="onSubmitForm" />
    </template>
    <div class="marketing-employee-purchase">
      <el-card class="el-card--normal" :header="$t('39e3acc2.6ea1fe')">
        <SpForm
          ref="formBase"
          v-model="formBase"
          class="base-form"
          show-message
          :form-list="formBaseList"
          :submit="false"
        />
      </el-card>
      <el-card class="el-card--normal" :header="$t('39e3acc2.02a217')">
        <SpForm
          ref="activityRule"
          v-model="activityRule"
          class="base-form"
          show-message
          :form-list="activityRuleListComputed"
          :submit="false"
          item-transition
        />
      </el-card>
    </div>

    <el-dialog
      :title="$t('39e3acc2.c4750a')"
      :visible.sync="storeHomePickerVisible"
      width="800px"
      append-to-body
      custom-class="purchase-store-home-picker-dialog"
      @open="onStoreHomePickerOpen"
    >
      <div v-if="IS_ADMIN()" class="purchase-store-home-picker__filter">
        <SpSelectShop
          v-model="storeHomePickerFilterDistributorId"
          clearable
          :placeholder="$t('0255d436.708c9d')"
          class="purchase-store-home-picker__shop"
          @change="onStoreHomePickerFilterChange"
        />
      </div>
      <el-table
        v-loading="storeHomePickerLoading"
        border
        :data="storeHomeList"
        highlight-current-row
        max-height="360"
        @row-click="onStoreHomeTableRowClick"
      >
        <el-table-column width="52" align="center">
          <template slot-scope="scope">
            <el-radio v-model="storeHomePickerPickedId" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="id" :label="$t('0255d436.6872c7')" width="88" />
        <el-table-column prop="distributor_id" :label="$t('0255d436.f4e8d2')" width="100" />
        <el-table-column prop="page_name" :label="$t('0255d436.b78454')" min-width="160" />
        <el-table-column prop="template_name" :label="$t('0255d436.49bcb8')" min-width="120" />
      </el-table>
      <div class="mt-4 text-right">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="storeHomeParams.page"
          :total="storeHomeTotal"
          :page-size="storeHomeParams.pageSize"
          @current-change="handleStoreHomePickerPageChange"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="storeHomePickerVisible = false">{{ $t('bea3f44a.625fb2') }}</el-button>
        <el-button type="primary" @click="confirmStoreHomePicker">{{
          $t('d8d84692.be5fbb')
        }}</el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>

<script>
/**
 * 内购活动口令：is_passphrase_enabled、passphrase_enterprises（JSON，每行含 passphrase_limitfee 分）；
 * 见 ecshopx-api/docs/employeepurchase-passphrase-frontend.md
 */
import { isEmpty } from '@/utils'
import moment from 'moment'
import { i18n } from '@/i18n'
import { getStoreHomePageList, getStoreHomePageInfo } from '@/api/marketing'

const ActionsButton = {
  name: 'ActionsButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCancel() {
      this.$router.go(-1)
    }
  },
  render() {
    return (
      <div>
        <el-button onClick={this.onCancel}>{this.$t('bea3f44a.625fb2')}</el-button>
        <el-button
          type='primary'
          disabled={this.disabled}
          onClick={() => {
            this.$emit('save')
          }}
        >
          {this.$t('d8d84692.be5fbb')}
        </el-button>
      </div>
    )
  }
}

export default {
  components: {
    ActionsButton
  },
  data() {
    return {
      formBase: {
        name: '',
        title: '',
        linkHome: null,
        share_pic: '',
        pic: ''
      },
      formBaseList: [],
      activityRule: {
        companyList: [],
        preheatTime: '',
        employee: {
          datetime: [],
          quota: ''
        },
        relatives: {
          join: false,
          num: '',
          datetime: [],
          type: '1',
          shareLimit: ''
        },
        orderMiniAmount: '',
        modifyReceiveAddress: '',
        items_page: ['sale_price', 'activity_price'],
        cart_page: ['sale_price', 'activity_price'],
        order_detail_page: ['sale_price', 'activity_price'],
        checkout_page: ['sale_price', 'activity_price'],
        is_discount_description_enabled: false,
        discount_description: '',
        is_passphrase_enabled: false,
        passphraseRows: []
      },

      /** 活动规则表单项列表，在 created 中赋值避免 render 阶段访问 $i18n */
      activityRuleList: [],
      /** 编辑时活动规则表单项的 disabled 覆盖，key 为索引 */
      activityRuleDisabledOverrides: {},
      activityStatus: '',
      /** 可参与名额 — 批量填充弹层 */
      passphraseBatchQuotaPopoverVisible: false,
      passphraseBatchQuotaDraft: '',
      passphraseBatchCodePopoverVisible: false,
      /** 随机生成口令 — 接口请求中 */
      passphraseBatchCodeGenerating: false,

      /** 活动首页 — 内购模版选择弹层 */
      storeHomePickerVisible: false,
      storeHomePickerLoading: false,
      storeHomeList: [],
      storeHomeTotal: 0,
      storeHomeParams: {
        page: 1,
        pageSize: 10
      },
      storeHomePickerFilterDistributorId: '',
      storeHomePickerPickedId: ''
    }
  },
  computed: {
    /** 活动规则列表合并 disabled 覆盖后传给表单 */
    activityRuleListComputed() {
      const list = this.activityRuleList
      const overrides = this.activityRuleDisabledOverrides
      if (!list.length || !Object.keys(overrides).length) return list
      const result = list.slice()
      Object.keys(overrides).forEach((i) => {
        const idx = parseInt(i, 10)
        if (result[idx]) result[idx] = { ...result[idx], disabled: overrides[i] }
      })
      return result
    },
    /** 进行中或已暂停（pending）：活动规则与口令配置强锁，与接口语义一致 */
    isActivityRuleEditLocked() {
      return this.activityStatus === 'ongoing' || this.activityStatus === 'pending'
    },
    /** 强锁且已开启口令：仅口令企业表的 participate_quota 允许编辑 */
    isPassphraseQuotaOnlyEditMode() {
      return this.isActivityRuleEditLocked && !!this.activityRule.is_passphrase_enabled
    },
    footerSaveDisabled() {
      if (this.activityStatus === 'cancel' || this.activityStatus === 'over') {
        return true
      }
      if (this.isActivityRuleEditLocked && !this.activityRule.is_passphrase_enabled) {
        return true
      }
      return false
    }
  },
  created() {
    this.formBaseList = this.buildFormBaseList()
    this.activityRuleList = this.buildActivityRuleList()
    const { id } = this.$route.params
    if (id) {
      this.getActivityItemDetail(id)
    }
  },
  methods: {
    buildFormBaseList() {
      const self = this
      const t = (key) => i18n.t(key)
      return [
        {
          label: t('39e3acc2.39834b'),
          className: 'activity-name',
          key: 'name',
          type: 'input',
          required: true,
          maxlength: 30,
          disabled: false,
          placeholder: t('39e3acc2.5d602a'),
          message: t('39e3acc2.19e116')
        },
        {
          label: t('39e3acc2.902a3d'),
          className: 'activity-title',
          key: 'title',
          type: 'input',
          required: true,
          maxlength: 16,
          disabled: false,
          placeholder: t('39e3acc2.3154a4'),
          message: t('39e3acc2.f1529d'),
          tip: t('39e3acc2.198849')
        },
        {
          label: t('39e3acc2.c4750a'),
          key: 'linkHome',
          component: ({ disabled }) => (
            <div>
              <span class='link-home'>
                {self.formBase?.linkHome && self.formBase.linkHome.template_title}
              </span>
              <el-button type='text' disabled={disabled} on-click={self.openStoreHomePicker}>
                {t('39e3acc2.dc38dd')}
              </el-button>
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (!self.formBase.linkHome) {
              callback(new Error(t('39e3acc2.747456')))
            } else {
              callback()
            }
          }
        },
        {
          label: t('39e3acc2.45394d'),
          key: 'share_pic',
          component: () => (
            <div class='activity-pic-field'>
              <div class='form-item-tip'>{t('39e3acc2.5925d6')}</div>
              <SpImagePicker v-model={self.formBase.share_pic} />
            </div>
          ),
          validator: (rule, value, callback) => {
            if (isEmpty(self.formBase.share_pic)) {
              callback(new Error(t('39e3acc2.9742f1')))
            } else {
              callback()
            }
          }
        },
        {
          label: t('39e3acc2.98fbb0'),
          key: 'pic',
          component: () => <SpImagePicker v-model={self.formBase.pic} />,
          tip: t('39e3acc2.818403'),
          validator: (rule, value, callback) => {
            if (isEmpty(self.formBase.pic)) {
              callback(new Error(t('39e3acc2.90a4b4')))
            } else {
              callback()
            }
          }
        }
      ]
    },
    buildActivityRuleList() {
      const self = this
      const t = (key) => i18n.t(key)
      const activePriceList = [
        { name: t('39e3acc2.e29575'), label: 'sale_price', disabled: true },
        { name: t('39e3acc2.08ee55'), label: 'activity_price' }
      ]
      return [
        {
          label: t('39e3acc2.e8b1a0'),
          key: 'is_passphrase_enabled',
          component: ({ disabled }) => (
            <el-switch
              v-model={self.activityRule.is_passphrase_enabled}
              disabled={disabled}
              on-change={self.onPassphraseEnabledChange}
            />
          ),
          disabled: false
        },
        {
          label: t('39e3acc2.ef7726'),
          key: 'companyList',
          type: 'input',
          component: ({ disabled }) => (
            <div class='company-list'>
              {self.activityRule.companyList.map((item, index) => (
                <el-tag
                  closable
                  disable-transitions
                  key={item.id}
                  type={item.id}
                  on-close={self.closeCompany.bind(self, index)}
                >
                  {item.name}
                </el-tag>
              ))}
              <el-button type='text' disabled={disabled} on-click={self.onPickerCompany}>
                {t('39e3acc2.0067d7')}
              </el-button>
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (self.activityRule.companyList.length == 0) {
              callback(new Error(t('39e3acc2.6004b3')))
              return
            }
            callback()
          }
        },
        {
          label: t('39e3acc2.e8b1a4'),
          key: 'passphraseRowsTable',
          isShow: (item, value) =>
            !!value.is_passphrase_enabled && (value.companyList || []).length > 0,
          component: ({ disabled }) => {
            const ruleLocked = self.isActivityRuleEditLocked
            const quotaOnly = self.isPassphraseQuotaOnlyEditMode
            const batchLocked = ruleLocked
            const quotaCellDisabled = quotaOnly ? false : disabled
            const codeCellDisabled = ruleLocked ? true : disabled
            const tableLimitfeeDisabled = ruleLocked ? true : disabled
            return (
              <div class='passphrase-enterprise-block'>
                <el-table
                  class='passphrase-enterprise-table'
                  data={self.activityRule.passphraseRows}
                  border
                  size='small'
                >
                  <el-table-column
                    label={t('39e3acc2.e8b1a5')}
                    prop='name'
                    min-width='180'
                    show-overflow-tooltip
                  />
                  <el-table-column
                    label={t('39e3acc2.e8b1a6')}
                    prop='enterprise_sn'
                    min-width='140'
                    show-overflow-tooltip
                  />
                  <el-table-column
                    min-width='200'
                    scopedSlots={{
                      header: () => (
                        <span class='passphrase-quota-header'>
                          <span>{t('39e3acc2.e8b1a7')}</span>
                          <el-popover
                            props={{
                              value: self.passphraseBatchQuotaPopoverVisible,
                              placement: 'top',
                              width: '280',
                              trigger: 'click'
                            }}
                            on={{
                              input: (v) => {
                                self.passphraseBatchQuotaPopoverVisible = v
                              }
                            }}
                          >
                            <div class='passphrase-batch-fill-popover'>
                              <div class='passphrase-batch-fill-popover__field'>
                                <el-input
                                  v-model={self.passphraseBatchQuotaDraft}
                                  size='small'
                                  placeholder={t('39e3acc2.e8b1ae')}
                                  nativeOn={{
                                    keyup: (e) => {
                                      if (e.key === 'Enter') {
                                        self.confirmPassphraseBatchParticipateQuota()
                                      }
                                    }
                                  }}
                                />
                              </div>
                              <div class='passphrase-batch-fill-popover__actions'>
                                <el-button
                                  type='text'
                                  size='mini'
                                  on-click={() => {
                                    self.passphraseBatchQuotaPopoverVisible = false
                                  }}
                                >
                                  {t('bea3f44a.625fb2')}
                                </el-button>
                                <el-button
                                  type='primary'
                                  size='mini'
                                  on-click={self.confirmPassphraseBatchParticipateQuota}
                                >
                                  {t('39e3acc2.e8b1b1')}
                                </el-button>
                              </div>
                            </div>
                            <el-button
                              slot='reference'
                              type='text'
                              class='passphrase-batch-fill-btn'
                              disabled={batchLocked || disabled}
                            >
                              {t('39e3acc2.e8b1ad')}
                            </el-button>
                          </el-popover>
                        </span>
                      ),
                      default: (scope) => (
                        <SpInput
                          v-model={scope.row.participate_quota}
                          width='120px'
                          disabled={quotaCellDisabled}
                          placeholder={t('39e3acc2.ea6c91')}
                        />
                      )
                    }}
                  />
                  <el-table-column
                    label={t('39e3acc2.e8b1a8')}
                    min-width='160'
                    scopedSlots={{
                      default: (scope) => (
                        <SpInput
                          v-model={scope.row.passphrase_limitfee}
                          width='120px'
                          disabled={tableLimitfeeDisabled}
                          placeholder={t('39e3acc2.ea6c91')}
                          suffix={t('39e3acc2.c16655')}
                        />
                      )
                    }}
                  />
                  <el-table-column
                    min-width='200'
                    scopedSlots={{
                      header: () => (
                        <span class='passphrase-quota-header'>
                          <span>{t('39e3acc2.e8b1a9')}</span>
                          <el-popover
                            props={{
                              value: self.passphraseBatchCodePopoverVisible,
                              placement: 'top',
                              width: '300',
                              trigger: 'click'
                            }}
                            on={{
                              input: (v) => {
                                self.passphraseBatchCodePopoverVisible = v
                              }
                            }}
                          >
                            <div class='passphrase-batch-fill-popover'>
                              <p class='passphrase-batch-code-popover__tip'>
                                {t('39e3acc2.e8b1b3')}
                              </p>
                              <div class='passphrase-batch-fill-popover__actions'>
                                <el-button
                                  type='text'
                                  size='mini'
                                  disabled={self.passphraseBatchCodeGenerating}
                                  on-click={() => {
                                    self.passphraseBatchCodePopoverVisible = false
                                  }}
                                >
                                  {t('bea3f44a.625fb2')}
                                </el-button>
                                <el-button
                                  type='primary'
                                  size='mini'
                                  loading={self.passphraseBatchCodeGenerating}
                                  on-click={self.confirmPassphraseBatchGenerateCodes}
                                >
                                  {t('39e3acc2.e8b1b1')}
                                </el-button>
                              </div>
                            </div>
                            <el-button
                              slot='reference'
                              type='text'
                              class='passphrase-batch-fill-btn'
                              disabled={batchLocked || disabled}
                              loading={self.passphraseBatchCodeGenerating}
                            >
                              {t('39e3acc2.e8b1b2')}
                            </el-button>
                          </el-popover>
                        </span>
                      ),
                      default: (scope) => (
                        <el-input
                          v-model={scope.row.passphrase_code}
                          disabled={codeCellDisabled}
                          maxlength={64}
                          placeholder={t('39e3acc2.e8b1a9')}
                          size='small'
                        />
                      )
                    }}
                  />
                </el-table>
              </div>
            )
          },
          disabled: false,
          validator: (rule, value, callback) => {
            if (!self.activityRule.is_passphrase_enabled) {
              callback()
              return
            }
            if (self.activityRule.companyList.length === 0) {
              callback()
              return
            }
            const rows = self.activityRule.passphraseRows || []
            for (let i = 0; i < rows.length; i++) {
              const r = rows[i]
              const pq = Number(r.participate_quota)
              if (!r.participate_quota || pq <= 0 || !Number.isFinite(pq)) {
                callback(new Error(t('39e3acc2.e8b1ab')))
                return
              }
              const pl = r.passphrase_limitfee
              if (pl === '' || pl === null || pl === undefined) {
                callback(new Error(t('39e3acc2.e8b1a3')))
                return
              }
              const pln = Number(pl)
              if (!Number.isFinite(pln) || pln < 0) {
                callback(new Error(t('39e3acc2.e8b1a3')))
                return
              }
              const plFen = Math.round(pln * 100)
              if (plFen < 1) {
                callback(new Error(t('39e3acc2.f1ee01')))
                return
              }
              if (!r.passphrase_code || !String(r.passphrase_code).trim()) {
                callback(new Error(t('39e3acc2.e8b1ab')))
                return
              }
            }
            callback()
          }
        },
        {
          label: t('39e3acc2.cdacb4'),
          key: 'preheatTime',
          component: ({ disabled }) => (
            <div class='preheat-time'>
              {t('39e3acc2.0cc05f')}
              <el-date-picker
                v-model={self.activityRule.preheatTime}
                disabled={disabled}
                type='datetime'
                placeholder={t('39e3acc2.a42ae4')}
              ></el-date-picker>
              {t('39e3acc2.dcc47f')}
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (self.activityRule.preheatTime.length == 0) {
              callback(new Error(t('39e3acc2.257e33')))
            } else {
              callback()
            }
          }
        },
        {
          label: t('39e3acc2.e8b1ac'),
          key: 'employee',
          component: ({ disabled: { datetime, quota } }) => (
            <div class='activity-employee-field'>
              <div class='form-item-content'>
                <div class='content-item'>
                  <el-date-picker
                    v-model={self.activityRule.employee.datetime}
                    disabled={datetime}
                    type='datetimerange'
                    format='yyyy-MM-dd HH:mm:ss'
                    defaultTime={['00:00:00', '23:59:59']}
                    range-separator={t('bea3f44a.981cbe')}
                    start-placeholder={t('39e3acc2.592c59')}
                    end-placeholder={t('39e3acc2.f78277')}
                  />
                </div>
                <div class='form-item-tip'>{t('39e3acc2.f5552d')}</div>
              </div>
              <transition name='purchase-inline-fade'>
                <div class='form-item-content' v-show={!self.activityRule.is_passphrase_enabled}>
                  <div class='content-item'>
                    <label>{t('39e3acc2.769491')}</label>
                    <SpInput
                      v-model={self.activityRule.employee.quota}
                      width='120px'
                      disabled={quota}
                      placeholder={t('39e3acc2.ea6c91')}
                      prefix={t('39e3acc2.4ef1d6')}
                      suffix={t('39e3acc2.c16655')}
                    />
                  </div>
                </div>
              </transition>
            </div>
          ),
          disabled: {
            datetime: false,
            quota: false
          },
          validator: (rule, value, callback) => {
            if (self.activityRule.employee.datetime.length == 0) {
              callback(new Error(t('39e3acc2.77a141')))
              return
            }
            if (self.activityRule.is_passphrase_enabled) {
              callback()
              return
            }
            const q = self.activityRule.employee.quota
            if (q === '' || q === null || q === undefined) {
              callback(new Error(t('39e3acc2.6a99d7')))
              return
            }
            const employeeFen = Math.round((Number(q) || 0) * 100)
            if (!Number.isFinite(employeeFen) || employeeFen < 1) {
              callback(new Error(t('39e3acc2.f1ee01')))
              return
            }
            callback()
          }
        },
        {
          label: t('39e3acc2.4eca5b'),
          key: 'relatives',
          isShow: (item, value) => !value.is_passphrase_enabled,
          component: ({ disabled: { join, num, datetime, type, shareLimit } }) => (
            <div class='activity-relatives-field'>
              <div class='form-item-content'>
                <div class='content-item'>
                  <el-switch v-model={self.activityRule.relatives.join} disabled={join} />
                  <span class='form-item-tip'>{t('39e3acc2.735d97')}</span>
                </div>
              </div>
              {self.activityRule.relatives.join ? (
                <div>
                  <div class='form-item-content'>
                    <div class='content-item'>
                      <label>{t('39e3acc2.ff47b7')}</label>
                      <SpInput
                        v-model={self.activityRule.relatives.num}
                        width='120px'
                        disabled={num}
                        placeholder={t('39e3acc2.ea6c91')}
                        prefix={t('39e3acc2.4a00d0')}
                        suffix={t('39e3acc2.cc2967')}
                      />
                    </div>
                  </div>
                  <div class='form-item-content'>
                    <div class='content-item'>
                      <label>{t('39e3acc2.059c1e')}</label>
                      <el-date-picker
                        v-model={self.activityRule.relatives.datetime}
                        disabled={datetime}
                        type='datetimerange'
                        format='yyyy-MM-dd HH:mm:ss'
                        defaultTime={['00:00:00', '23:59:59']}
                        range-separator={t('bea3f44a.981cbe')}
                        start-placeholder={t('39e3acc2.592c59')}
                        end-placeholder={t('39e3acc2.f78277')}
                      />
                    </div>
                  </div>
                  <div class='form-item-content'>
                    <div class='content-item'>
                      <label>{t('39e3acc2.769491')}</label>
                      <div class='content-item-field'>
                        <div class='item-wrap'>
                          <el-radio
                            v-model={self.activityRule.relatives.type}
                            disabled={type}
                            label='1'
                            onChange={self.onRadioChange}
                          >
                            <SpInput
                              v-model={self.activityRule.relatives.shareLimit}
                              width='120px'
                              disabled={shareLimit}
                              placeholder={t('39e3acc2.ea6c91')}
                              prefix={t('39e3acc2.4ef1d6')}
                              suffix={t('39e3acc2.c16655')}
                            />
                          </el-radio>
                        </div>
                        <div class='item-wrap'>
                          <el-radio
                            v-model={self.activityRule.relatives.type}
                            disabled={type}
                            label='2'
                            onChange={self.onRadioChange}
                          >
                            {t('39e3acc2.3fe064')}
                          </el-radio>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          ),
          disabled: {
            join: false,
            num: false,
            datetime: false,
            type: false,
            shareLimit: false
          },
          validator: (rule, value, callback) => {
            const rel = self.activityRule.relatives
            if (!rel.join) {
              callback()
              return
            }
            if (rel.type === '1') {
              const sl = rel.shareLimit
              if (sl === '' || sl === null || sl === undefined) {
                callback(new Error(t('39e3acc2.f1ee02')))
                return
              }
              const relFen = Math.round((Number(sl) || 0) * 100)
              if (!Number.isFinite(relFen) || relFen < 1) {
                callback(new Error(t('39e3acc2.f1ee02')))
                return
              }
            }
            callback()
          },
          message: t('39e3acc2.19e116')
        },
        {
          label: t('39e3acc2.ac0065'),
          key: 'orderMiniAmount',
          component: ({ disabled }) => (
            <SpInput
              v-model={self.activityRule.orderMiniAmount}
              disabled={disabled}
              width='120px'
              placeholder={t('39e3acc2.ea6c91')}
              prefix={t('39e3acc2.f780a9')}
              suffix={t('39e3acc2.c16655')}
            />
          ),
          disabled: false
        },
        {
          label: t('39e3acc2.95c4a4'),
          key: 'modifyReceiveAddress',
          component: ({ disabled }) => (
            <SpInput
              v-model={self.activityRule.modifyReceiveAddress}
              disabled={disabled}
              width='140px'
              placeholder={t('39e3acc2.977246')}
              prefix={t('39e3acc2.0ccd13')}
              suffix={t('39e3acc2.297908')}
            />
          ),
          disabled: false,
          tip: t('39e3acc2.28831c')
        },
        {
          label: t('39e3acc2.135b19'),
          type: 'group'
        },
        {
          label: t('39e3acc2.040c4d'),
          key: 'items_page',
          type: 'checkbox',
          options: activePriceList
        },
        {
          label: t('39e3acc2.c017be'),
          key: 'cart_page',
          type: 'checkbox',
          options: activePriceList
        },
        {
          label: t('39e3acc2.482b55'),
          key: 'checkout_page',
          type: 'checkbox',
          options: activePriceList
        },
        {
          label: t('39e3acc2.028f5b'),
          key: 'is_discount_description_enabled',
          type: 'switch',
          tip: t('39e3acc2.8e568f')
        },
        {
          label: t('39e3acc2.d0bea4'),
          key: 'discount_description',
          type: 'input',
          maxlength: 50,
          tip: t('39e3acc2.6a03e7')
        }
      ]
    },
    async getActivityItemDetail(id) {
      const res = await this.$api.marketing.getActivityItemDetail(id)
      let linkHome = null
      try {
        const infoRes = await getStoreHomePageInfo(res.pages_template_id)
        const row = infoRes.data?.data ?? infoRes.data
        if (row && row.id != null) {
          linkHome = {
            pages_template_id: row.id,
            template_title: row.page_name || row.template_name || ''
          }
        }
      } catch (e) {
        linkHome = null
      }
      this.formBase = {
        name: res.name,
        title: res.title,
        linkHome,
        share_pic: res.share_pic,
        pic: res.pic
      }

      // 索引：0 口令开关 1 参与企业 2 口令企业表 3 预热 4 员工 5 亲友 6 起订 7 改地址 8 分组 9–11 价格展示 12–13 折扣文案
      this.activityRuleDisabledOverrides = {}
      if (res.status === 'pending' || res.status === 'ongoing') {
        this.formBaseList[0].disabled = true
        this.formBaseList[1].disabled = true
        this.formBaseList[2].disabled = true
        this.$set(this.activityRuleDisabledOverrides, 0, true)
        this.$set(this.activityRuleDisabledOverrides, 1, true)
        this.$set(this.activityRuleDisabledOverrides, 3, true)
        this.$set(this.activityRuleDisabledOverrides, 4, {
          datetime: true,
          quota: true
        })
        this.$set(this.activityRuleDisabledOverrides, 5, {
          join: true,
          num: true,
          datetime: true,
          type: true,
          shareLimit: true
        })
        this.$set(this.activityRuleDisabledOverrides, 6, true)
        this.$set(this.activityRuleDisabledOverrides, 7, true)
        this.$set(this.activityRuleDisabledOverrides, 9, true)
        this.$set(this.activityRuleDisabledOverrides, 10, true)
        this.$set(this.activityRuleDisabledOverrides, 11, true)
        this.$set(this.activityRuleDisabledOverrides, 12, true)
        this.$set(this.activityRuleDisabledOverrides, 13, true)
      } else if (res.status == 'cancel' || res.status == 'over') {
        // 已取消、已结束
        this.formBaseList[0].disabled = true
        this.formBaseList[1].disabled = true
        this.formBaseList[2].disabled = true

        this.$set(this.activityRuleDisabledOverrides, 0, true)
        this.$set(this.activityRuleDisabledOverrides, 1, true)
        this.$set(this.activityRuleDisabledOverrides, 2, true)
        this.$set(this.activityRuleDisabledOverrides, 3, true)
        this.$set(this.activityRuleDisabledOverrides, 4, {
          datetime: true,
          quota: true
        })
        this.$set(this.activityRuleDisabledOverrides, 5, {
          join: true,
          num: true,
          datetime: true,
          type: true,
          shareLimit: true
        })
        this.$set(this.activityRuleDisabledOverrides, 6, true)
        this.$set(this.activityRuleDisabledOverrides, 7, true)
        this.$set(this.activityRuleDisabledOverrides, 9, true)
        this.$set(this.activityRuleDisabledOverrides, 10, true)
        this.$set(this.activityRuleDisabledOverrides, 11, true)
        this.$set(this.activityRuleDisabledOverrides, 12, true)
        this.$set(this.activityRuleDisabledOverrides, 13, true)
      }
      this.activityStatus = res.status

      const { list } = await this.$api.member.getPurchaseCompanyList({
        page: 1,
        pageSize: 100,
        enterprise_id: res.enterprise_id
      })

      // res.price_display_config = {"cart_page": {"sale_price": "true", "market_price": "false", "activity_price": "false"}, "items_page": {"sale_price": "true", "market_price": "true", "activity_price": "false"}, "checkout_page": {"sale_price": "true", "market_price": "false", "activity_price": "false"}, "order_detail_page": {"sale_price": "true", "market_price": "false", "activity_price": "true"}}
      //价格展示处理
      const priceData = this.priceShowData(res.price_display_config, 'detail')

      console.log('priceData', priceData)

      const phraseMap = {}
      ;(res.passphrase_enterprises || []).forEach((pe) => {
        const eid = pe.enterprise_id
        phraseMap[eid] = {
          participate_quota: pe.participate_quota,
          passphrase_code: pe.passphrase_code || '',
          passphrase_limitfee:
            pe.passphrase_limitfee != null && pe.passphrase_limitfee !== ''
              ? Number(pe.passphrase_limitfee) / 100
              : ''
        }
      })
      const passphraseRows = list.map((c) => {
        const pm = phraseMap[c.id]
        return {
          enterprise_id: c.id,
          name: c.name,
          enterprise_sn: c.enterprise_sn || '',
          participate_quota: pm ? pm.participate_quota : '',
          passphrase_code: pm ? pm.passphrase_code : '',
          passphrase_limitfee: pm ? pm.passphrase_limitfee : ''
        }
      })

      this.activityRule = {
        companyList: list,
        preheatTime: res.display_time * 1000,
        employee: {
          datetime: [res.employee_begin_time * 1000, res.employee_end_time * 1000],
          quota: res.employee_limitfee / 100
        },
        relatives: {
          join: res.if_relative_join == 1 ? true : false,
          num: res.invite_limit,
          datetime: [
            res.relative_begin_time ? res.relative_begin_time * 1000 : '',
            res.relative_end_time ? res.relative_end_time * 1000 : ''
          ],
          type: res.if_share_limitfee ? '2' : '1',
          shareLimit: res.relative_limitfee / 100
        },
        orderMiniAmount: res.minimum_amount / 100,
        modifyReceiveAddress: res.close_modify_hours_after_activity,
        ...priceData,
        is_discount_description_enabled: res.is_discount_description_enabled == 'true',
        discount_description: res.discount_description,
        is_passphrase_enabled:
          res.is_passphrase_enabled === 'true' || res.is_passphrase_enabled === true,
        passphraseRows
      }
      this.onRadioChange(res.if_share_limitfee ? '2' : '1')
    },
    openStoreHomePicker() {
      this.storeHomePickerVisible = true
    },
    onStoreHomePickerOpen() {
      this.storeHomePickerPickedId =
        this.formBase.linkHome?.pages_template_id != null
          ? this.formBase.linkHome.pages_template_id
          : ''
      this.storeHomeParams.page = 1
      this.fetchStoreHomePickerList()
    },
    onStoreHomePickerFilterChange() {
      this.storeHomeParams.page = 1
      this.fetchStoreHomePickerList()
    },
    onStoreHomeTableRowClick(row) {
      if (row && row.id != null) {
        this.storeHomePickerPickedId = row.id
      }
    },
    handleStoreHomePickerPageChange(page) {
      this.storeHomeParams.page = page
      this.fetchStoreHomePickerList()
    },
    async fetchStoreHomePickerList() {
      this.storeHomePickerLoading = true
      try {
        const q = { ...this.storeHomeParams }
        if (this.IS_ADMIN() && this.storeHomePickerFilterDistributorId) {
          q.distributor_id = this.storeHomePickerFilterDistributorId
        }
        const response = await getStoreHomePageList(q)
        const data = response.data?.data
        if (data && data.list) {
          this.storeHomeList = data.list
          this.storeHomeTotal = data.total_count
        } else {
          this.storeHomeList = []
          this.storeHomeTotal = 0
        }
      } finally {
        this.storeHomePickerLoading = false
      }
    },
    async confirmStoreHomePicker() {
      const id = this.storeHomePickerPickedId
      if (id === '' || id === null || id === undefined) {
        this.$message.warning(this.$t('39e3acc2.747456'))
        return
      }
      const nid = Number(id)
      let row = this.storeHomeList.find((r) => Number(r.id) === nid)
      if (!row) {
        try {
          const infoRes = await getStoreHomePageInfo(id)
          row = infoRes.data?.data ?? infoRes.data
        } catch (e) {
          row = null
        }
      }
      if (!row || row.id == null) {
        this.$message.warning(this.$t('39e3acc2.747456'))
        return
      }
      this.formBase.linkHome = {
        pages_template_id: row.id,
        template_title: row.page_name || row.template_name || ''
      }
      this.storeHomePickerVisible = false
    },
    async onPickerCompany() {
      // 传入完整企业行，便于选择器跨分页保留已选并在表格中正确勾选（仅传 id 时翻页会丢选中）
      const params = {
        type: 'pickerCompany',
        data: (this.activityRule.companyList || []).map((item) => ({ ...item }))
      }
      if (this.IS_ADMIN()) {
        params.distributor_id = 0
      }
      const { data } = await this.$picker.company(params)
      this.activityRule.companyList = data
      this.syncPassphraseEnterpriseRows()
    },
    closeCompany(index) {
      this.activityRule.companyList.splice(index, 1)
      this.syncPassphraseEnterpriseRows()
    },
    onPassphraseEnabledChange(enabled) {
      if (enabled) {
        this.syncPassphraseEnterpriseRows()
      }
    },
    syncPassphraseEnterpriseRows() {
      const companies = this.activityRule.companyList || []
      const prev = this.activityRule.passphraseRows || []
      const prevById = {}
      prev.forEach((r) => {
        prevById[r.enterprise_id] = r
      })
      this.activityRule.passphraseRows = companies.map((c) => {
        const id = c.id
        const old = prevById[id]
        return {
          enterprise_id: id,
          name: c.name,
          enterprise_sn: c.enterprise_sn || '',
          participate_quota: old ? old.participate_quota : '',
          passphrase_code: old ? old.passphrase_code : '',
          passphrase_limitfee:
            old && old.passphrase_limitfee !== undefined ? old.passphrase_limitfee : ''
        }
      })
    },
    confirmPassphraseBatchParticipateQuota() {
      const raw = String(this.passphraseBatchQuotaDraft || '').trim()
      const n = parseInt(raw, 10)
      if (!raw || !Number.isFinite(n) || n <= 0) {
        this.$message.warning(this.$t('39e3acc2.e8b1af'))
        return
      }
      const rows = this.activityRule.passphraseRows || []
      rows.forEach((row) => {
        this.$set(row, 'participate_quota', n)
      })
      this.passphraseBatchQuotaDraft = ''
      this.passphraseBatchQuotaPopoverVisible = false
    },
    async onGeneratePassphraseCodes() {
      const ids = this.activityRule.companyList.map((c) => c.id)
      if (!ids.length) {
        return
      }
      const { id: activityId } = this.$route.params
      const payload = { enterprise_ids: ids, count: 1 }
      try {
        const data = activityId
          ? await this.$api.marketing.generatePassphraseCodesByActivity(activityId, payload)
          : await this.$api.marketing.generatePassphraseCodes(payload)
        const list = data.list || []
        const byEnt = {}
        list.forEach((item) => {
          const codes = item.passphrase_codes || []
          if (codes[0]) {
            byEnt[item.enterprise_id] = codes[0]
          }
        })
        this.activityRule.passphraseRows.forEach((row) => {
          if (byEnt[row.enterprise_id]) {
            this.$set(row, 'passphrase_code', byEnt[row.enterprise_id])
          }
        })
      } catch (e) {
        console.error(e)
      }
    },
    async confirmPassphraseBatchGenerateCodes() {
      if (this.passphraseBatchCodeGenerating) {
        return
      }
      this.passphraseBatchCodeGenerating = true
      try {
        await this.onGeneratePassphraseCodes()
        this.passphraseBatchCodePopoverVisible = false
      } finally {
        this.passphraseBatchCodeGenerating = false
      }
    },
    priceShowData(form, isDetail) {
      //接口需要
      // cart_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // items_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // checkout_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // order_detail_page: {sale_price: "true", market_price: "false", activity_price: "false"}

      let keys = ['items_page', 'cart_page', 'order_detail_page', 'checkout_page']
      let prices = ['sale_price', 'market_price', 'activity_price']
      if (isDetail) {
        //编辑获取详情数据处理
        return keys.reduce((prev, cur) => {
          let _arr = []
          prices.forEach((item) => {
            _arr = Object.keys(form[cur]).filter((item2) => form[cur][item2] == 'true')
            console.log(Object.keys(form[cur]))
          })
          prev[cur] = _arr
          return prev
        }, {})
      }
      return keys.reduce((prev, cur) => {
        let _obj = {}
        prices.forEach((item) => {
          _obj[item] = form[cur].includes(item) + ''
        })
        prev[cur] = _obj
        return prev
      }, {})
    },
    async onSubmitForm() {
      await this.$refs['formBase'].handleSubmit()
      await this.$refs['activityRule'].handleSubmit()
      const {
        name,
        title,
        linkHome: { pages_template_id },
        share_pic,
        pic
      } = this.formBase
      const {
        companyList,
        preheatTime,
        employee: { datetime: employeeDateTime, quota },
        relatives: { join, num, datetime: relativesDateTime, type, shareLimit },
        orderMiniAmount,
        modifyReceiveAddress,
        is_discount_description_enabled,
        discount_description,
        is_passphrase_enabled,
        passphraseRows
      } = this.activityRule
      const usePassphrase = !!is_passphrase_enabled
      const preheatMoment = moment(preheatTime)
      const employeeBeginUnix = moment(employeeDateTime[0]).unix()
      const employeeEndUnix = moment(employeeDateTime[1]).unix()
      let employeeLimitfeeFen = Math.round((Number(quota) || 0) * 100)
      let ifRelativeJoin = join ? 1 : 0
      let inviteLimitVal = num
      let ifShareLimitfee = type == '2'
      let relativeLimitfeeFen = 0
      if (ifRelativeJoin && !ifShareLimitfee) {
        relativeLimitfeeFen = Math.round((Number(shareLimit) || 0) * 100)
      }
      if (usePassphrase) {
        ifRelativeJoin = 0
        inviteLimitVal = 0
        ifShareLimitfee = false
        relativeLimitfeeFen = 0
      }
      let params = {
        name,
        title,
        pages_template_id,
        share_pic: share_pic,
        pic: pic,
        enterprise_id: companyList.map((item) => item.id),
        display_time: preheatMoment.unix(),
        employee_begin_time: employeeBeginUnix,
        employee_end_time: employeeEndUnix,
        employee_limitfee: employeeLimitfeeFen,
        if_relative_join: ifRelativeJoin,
        invite_limit: inviteLimitVal,
        if_share_limitfee: ifShareLimitfee,
        relative_limitfee: relativeLimitfeeFen,
        minimum_amount: orderMiniAmount * 100,
        close_modify_hours_after_activity: modifyReceiveAddress,
        price_display_config: JSON.stringify(this.priceShowData(this.activityRule)),
        is_discount_description_enabled,
        discount_description,
        is_passphrase_enabled: usePassphrase ? 1 : 0
      }
      // 口令企业行结构见 ecshopx-api/docs/employeepurchase-passphrase-frontend.md §2.1（别名 quota/code 后端亦支持，此处用规范字段名）
      if (usePassphrase) {
        params.passphrase_enterprises = JSON.stringify(
          (passphraseRows || []).map((r) => ({
            enterprise_id: Number(r.enterprise_id),
            participate_quota: Number(r.participate_quota),
            passphrase_limitfee: Math.max(
              0,
              Math.round((Number(r.passphrase_limitfee) || 0) * 100)
            ),
            passphrase_code: String(r.passphrase_code || '').trim()
          }))
        )
      }
      if (!usePassphrase && ifRelativeJoin === 1) {
        if (relativesDateTime[0]) {
          params.relative_begin_time = moment(relativesDateTime[0]).unix()
        }
        if (relativesDateTime[1]) {
          params.relative_end_time = moment(relativesDateTime[1]).unix()
        }
      } else {
        params.relative_begin_time = 0
        params.relative_end_time = 0
      }
      const { id } = this.$route.params
      const resUrl = this.$route.path.split('create')[0] + 'result/'
      if (id) {
        await this.$api.marketing.updatePurchaseActivity(id, params)
        this.$router.replace({ path: resUrl + id })
      } else {
        const { id: _id } = await this.$api.marketing.createPurchaseActivity(params)
        this.$router.replace({ path: resUrl + _id })
      }
    },
    onRadioChange(e) {
      const prev = this.activityRuleDisabledOverrides[5] || {}
      if (e == '1') {
        this.$set(this.activityRuleDisabledOverrides, 5, { ...prev, shareLimit: false })
      } else {
        this.activityRule.relatives.shareLimit = 0
        this.$set(this.activityRuleDisabledOverrides, 5, { ...prev, shareLimit: true })
      }
    }
  }
}
</script>
