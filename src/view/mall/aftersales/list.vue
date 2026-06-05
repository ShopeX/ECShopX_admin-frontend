<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<template>
  <SpPage>
    <div class="page-body">
      <template v-if="$route.path.indexOf('detail') === -1">
        <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
          <SpFilterFormItem v-if="!VERSION_B2C()" prop="distributor" :label="$t('4d1aec94.4de1b7')">
            <el-autocomplete
              v-model="params.distributor.name"
              :fetch-suggestions="queryStoreSearch"
              :placeholder="$t('4d1aec94.867738')"
              @select="handleSelectStore"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="create_time" :label="$t('4d1aec94.8d3bf9')">
            <el-date-picker
              v-model="params.create_time"
              type="daterange"
              value-format="yyyy/MM/dd"
              :placeholder="$t('4d1aec94.4b8cb9')"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="order_id" :label="$t('4d1aec94.070dce')">
            <el-input v-model="params.order_id" :placeholder="$t('4d1aec94.1e8dc2')" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_bn" :label="$t('4d1aec94.cd1b26')">
            <el-input v-model="params.aftersales_bn" :placeholder="$t('4d1aec94.431df4')" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_name" :label="$t('4d1aec94.752597')">
            <el-input v-model="params.item_name" :placeholder="$t('4d1aec94.83919e')" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="mobile" :label="$t('4d1aec94.ce2bf3')">
            <el-input v-model="params.mobile" :placeholder="$t('4d1aec94.8098e2')" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_status" :label="$t('4d1aec94.aaddd7')">
            <el-select
              v-model="params.aftersales_status"
              clearable
              :placeholder="$t('4d1aec94.5101e8')"
            >
              <el-option
                v-for="(item, index) in aftersalesStatusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="aftersales_type" :label="$t('4d1aec94.0e993f')">
            <el-select v-model="params.aftersales_type" :placeholder="$t('4d1aec94.9d60ad')">
              <el-option
                v-for="(item, index) in $store.getters.login_type == 'merchant'
                  ? aftersalesTypeListOther
                  : aftersalesTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="item_bn" :label="$t('4d1aec94.233aa5')">
            <el-input v-model="params.item_bn" :placeholder="$t('4d1aec94.58cac1')" />
          </SpFilterFormItem>

          <SpFilterFormItem
            v-if="VERSION_STANDARD() || IS_ADMIN()"
            prop="supplier_name"
            :label="$t('4d1aec94.a54fd2')"
          >
            <el-input v-model="params.supplier_name" :placeholder="$t('4d1aec94.1542c0')" />
          </SpFilterFormItem>
          <SpFilterFormItem
            v-if="VERSION_STANDARD() || IS_ADMIN()"
            prop="order_holder"
            :label="$t('4d1aec94.e56a5e')"
          >
            <el-select v-model="params.order_holder" clearable :placeholder="$t('4d1aec94.708c9d')">
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
            v-if="IS_SUPPLIER()"
            prop="distributor_id"
            :label="$t('4d1aec94.16f2bc')"
          >
            <SpSelectShop
              v-model="params.distributor_id"
              clearable
              :placeholder="$t('4d1aec94.708c9d')"
            />
          </SpFilterFormItem>
          <SpFilterFormItem prop="order_class" :label="$t('4d1aec94.0e83be')">
            <el-select v-model="params.order_class" clearable :placeholder="$t('4d1aec94.708c9d')">
              <el-option
                v-for="item in orderType"
                :key="item.value"
                size="mini"
                :label="item.title"
                :value="item.value"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem
            v-if="is_pharma_industry"
            prop="is_prescription_order"
            :label="$t('4d1aec94.b7a604')"
          >
            <el-select
              v-model="params.is_prescription_order"
              clearable
              :placeholder="$t('4d1aec94.708c9d')"
            >
              <el-option :label="$t('4d1aec94.a8b0c2')" value="" />
              <el-option :label="$t('4d1aec94.0a60ac')" value="1" />
              <el-option :label="$t('4d1aec94.c9744f')" value="0" />
            </el-select>
          </SpFilterFormItem>
          <!-- <SpFilterFormItem v-if="is_pharma_industry" prop="user_family_name" label="用药人姓名:">
          <el-input v-model="params.user_family_name" placeholder="请输入用药人姓名" />
        </SpFilterFormItem> -->
        </SpFilterForm>
        <SpFinder
          ref="finder"
          url="/aftersales"
          :setting="finderSetting"
          :hooks="{
            beforeSearch: beforeSearch
          }"
          reserve-selection
          row-key="aftersales_bn"
          fixed-row-action
          @selection-change="handleSelectionChange"
        >
          <template slot="tableTop">
            <div class="action-container">
              <el-button @click="exportData" type="primary" plain>
                {{ $t('4d1aec94.55405e') }}
              </el-button>
              <el-button v-if="showAftersale" type="primary" plain @click="aftersalesRemindAction">
                {{ $t('4d1aec94.117b5a') }}
              </el-button>
              <el-button type="primary" plain @click="aftersalesAction('approved')">
                {{ $t('4d1aec94.9fface') }}
              </el-button>
              <el-button type="primary" plain @click="aftersalesAction('refund')">
                {{ $t('4d1aec94.b7d6de') }}
              </el-button>
            </div>
          </template>
        </SpFinder>

        <!-- 售后提醒内容 -开始 -->
        <el-dialog
          :title="aftersalesRemindTitle"
          :visible.sync="aftersalesRemindVisible"
          :before-close="handleCancel"
          width="65%"
        >
          <template>
            <el-form
              ref="aftersalesRemindForm"
              :model="aftersalesRemindForm"
              class="demo-ruleForm"
              label-width="100px"
            >
              <el-form-item :label="$t('4d1aec94.59c952')">
                <template>
                  <SpRichText v-model="aftersalesRemindForm.intro" />
                </template>
                <span class="frm-tips">{{ $t('4d1aec94.cdebf6') }}</span>
              </el-form-item>
              <el-form-item :label="$t('4d1aec94.53c3dd')">
                <el-switch
                  v-model="aftersalesRemindForm.is_open"
                  active-value="true"
                  inactive-value="false"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
                <br />
                <span class="frm-tips">{{ $t('4d1aec94.8f2914') }}</span>
              </el-form-item>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleCancel"> {{ $t('4d1aec94.625fb2') }} </el-button>
            <el-button type="primary" @click="submitAftersalesRemind">
              {{ $t('4d1aec94.38cf16') }}
            </el-button>
          </div>
        </el-dialog>
        <RemarkModal ref="modalRef" @onDone="handleRemarksDone" />

        <!-- 批量审核弹框 -->
        <SpDialog
          ref="batchReviewDialogRef"
          v-model="batchReviewDialog"
          :title="$t('4d1aec94.5f936e')"
          :form="batchReviewForm"
          :form-list="batchReviewFormList"
          @onSubmit="onBatchReviewSubmit"
        />
      </template>
      <router-view />
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import RemarkModal from '@/components/remarkModal'
import SpDialog from '@/components/sp-dialog'
import mixin, { pageMixin, remarkMixin } from '@/mixins'
import { VERSION_B2C, IS_SUPPLIER } from '@/utils'
import { ORDER_CATEGORY, ORDER_TYPE } from '@/consts'
import { i18n } from '@/i18n'
export default {
  components: {
    RemarkModal,
    SpDialog
  },
  mixins: [mixin, remarkMixin, pageMixin],
  data() {
    const initialParams = {
      distributor: {
        id: undefined,
        name: undefined
      },
      create_time: '',
      receiver_mobile: '',
      order_id: undefined,
      aftersales_bn: undefined,
      mobile: undefined,
      aftersales_status: undefined,
      aftersales_type: undefined,
      original_order_id: undefined,
      item_bn: undefined,
      supplier_name: undefined,
      order_holder: undefined,
      distributor_id: undefined,
      order_class: undefined,
      yyrname: undefined,
      is_prescription_order: undefined,
      user_family_name: undefined,
      item_name: undefined
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      is_pharma_industry: false,
      orderType: ORDER_TYPE,
      orderCategory: ORDER_CATEGORY,
      shopList: [],
      aftersalesStatusList: [
        { name: i18n.t('4d1aec94.047109'), value: '0' },
        { name: i18n.t('4d1aec94.5d459d'), value: '1' },
        { name: i18n.t('4d1aec94.5ad605'), value: '2' },
        { name: i18n.t('4d1aec94.dbf36d'), value: '3' }
      ],
      aftersalesTypeList: [
        { name: i18n.t('4d1aec94.6b8821'), value: 'ONLY_REFUND' },
        { name: i18n.t('4d1aec94.cc0193'), value: 'REFUND_GOODS' }
        // { name: '换货', value: 'EXCHANGING_GOODS' }
      ],
      aftersalesTypeListOther: [
        { name: i18n.t('4d1aec94.6b8821'), value: 'ONLY_REFUND' },
        { name: i18n.t('4d1aec94.cc0193'), value: 'REFUND_GOODS' }
      ],
      aftersalesRemindForm: {
        intro: '',
        is_open: 'false'
      },
      aftersalesRemindVisible: false,
      aftersalesRemindTitle: i18n.t('4d1aec94.117b5a'),
      orderType: ORDER_TYPE,
      multipleSelection: [],
      // 批量审核相关
      batchReviewType: 'approved',
      batchReviewDialog: false,
      batchReviewForm: {
        is_approved: '1', // 默认通过
        refuse_reason: ''
      },
      batchReviewFormList: [
        {
          label: i18n.t('4d1aec94.b6d0e9'),
          key: 'is_approved',
          type: 'radio',
          required: true,
          options: [
            { label: '1', name: i18n.t('4d1aec94.23c1f3') },
            { label: '0', name: i18n.t('4d1aec94.7173f8') }
          ]
        },
        {
          label: i18n.t('4d1aec94.f48f94'),
          key: 'refuse_reason',
          type: 'textarea',
          placeholder: i18n.t('4d1aec94.f48f94'),
          width: '100%',
          isShow: ({ key }, value) => {
            console.log(key, value, '--')
            return value.is_approved == '0'
          },
          validator: (rule, value, callback) => {
            if (value.is_approved == 0 && !value.refuse_reason) {
              callback(new Error(i18n.t('4d1aec94.0f9381')))
            } else {
              callback()
            }
          }
        }
      ],
      finderSetting: {
        columns: [
          {
            name: i18n.t('4d1aec94.d1b93f'),
            key: 'aftersales_bn',
            width: 200,
            render: (h, { row }) => {
              return h('div', [
                h('div', { class: 'order-num' }, [
                  h('span', {}, row.aftersales_bn),
                  h(
                    'el-tooltip',
                    {
                      props: {
                        effect: 'dark',
                        content: i18n.t('4d1aec94.79d3ab'),
                        placement: 'top-start'
                      }
                    },
                    [
                      h('i', {
                        class: 'el-icon-document-copy',
                        style: { cursor: 'pointer' },
                        on: {
                          click: () => this.copyToClipboard(row.aftersales_bn)
                        }
                      })
                    ]
                  )
                ]),
                row.distributor_id !== '0' &&
                  h('div', { class: 'order-store' }, [
                    h(
                      'el-tooltip',
                      {
                        props: {
                          effect: 'dark',
                          content: i18n.t('4d1aec94.8a0cc2'),
                          placement: 'top-start'
                        }
                      },
                      [h('i', { class: 'el-icon-office-building' })]
                    ),
                    row.distributor_info.name
                  ]),
                h('div', { class: 'order-time' }, [
                  h(
                    'el-tooltip',
                    {
                      props: {
                        effect: 'dark',
                        content: i18n.t('4d1aec94.5ba072'),
                        placement: 'top-start'
                      }
                    },
                    [h('i', { class: 'el-icon-time' })]
                  ),
                  this.$options.filters.datetime(row.create_time, 'YYYY-MM-DD HH:mm:ss')
                ])
              ])
            }
          },
          {
            name: i18n.t('4d1aec94.1e8dc2'),
            key: 'order_id',
            minWidth: 180,
            render: (h, { row }) => {
              return h('div', { class: 'order-num' }, [
                h('span', {}, row.order_id),
                h(
                  'el-tooltip',
                  {
                    props: {
                      effect: 'dark',
                      content: i18n.t('4d1aec94.79d3ab'),
                      placement: 'top-start'
                    }
                  },
                  [
                    h('i', {
                      class: 'el-icon-document-copy',
                      style: { cursor: 'pointer' },
                      on: {
                        click: () => this.copyToClipboard(row.order_id)
                      }
                    })
                  ]
                )
              ])
            }
          },
          {
            name: i18n.t('4d1aec94.db24c2'),
            key: 'sub_order_items',
            minWidth: 220,
            render: (h, { row }) => {
              if (row.detail && row.detail.length > 0) {
                return h(
                  'div',
                  row.detail.map((item) =>
                    h('div', { style: { marginBottom: '4px' } }, [
                      h('div', { style: {} }, item.item_name),
                      h('div', { style: {} }, `${i18n.t('4d1aec94.d1d3e6')} ${item.item_bn}`)
                    ])
                  )
                )
              }
              return h('span', {}, '-')
            }
          },
          {
            name: i18n.t('4d1aec94.6f42a9'),
            key: 'refund_fee',
            width: 160,
            align: 'center'
          },
          {
            name: i18n.t('4d1aec94.8686e0'),
            key: 'refund_point',
            width: 160,
            align: 'center'
          },
          {
            name: i18n.t('4d1aec94.3034f2'),
            key: 'freight',
            width: 150,
            align: 'center',
            render: (h, { row }) => {
              if (row.freight_type == 'point') return null
              return h('span', {}, (row.freight / 100).toFixed(2))
            }
          },
          {
            name: i18n.t('4d1aec94.ff5669'),
            key: 'freight',
            width: 160,
            align: 'center',
            render: (h, { row }) => {
              if (row.freight_type == 'cash') return null
              return h('span', {}, row.freight)
            }
          },
          {
            name: i18n.t('4d1aec94.b1d954'),
            key: 'refunded_fee',
            width: 150,
            align: 'center',
            render: (h, { row }) => {
              if (row.freight_type == 'point') return null
              const amount = row.refunded_fee || 0
              return h('span', {}, `${(amount / 100).toFixed(2)}`)
            }
          },
          {
            name: i18n.t('4d1aec94.761d19'),
            key: 'refunded_point',
            width: 120,
            align: 'center',
            render: (h, { row }) => {
              if (row.freight_type == 'cash') return null
              const points = row.refunded_point || 0
              return h('span', {}, `${points}`)
            }
          },
          // {
          //   name: '业务员',
          //   key: 'salesman_mobile',
          //   visible: !this.IS_SUPPLIER(),
          //   render: (h, { row }) => {
          //     return h('div', [
          //       row.salesman_mobile,
          //       this.datapass_block == 0 && h('el-tooltip', {
          //         props: { effect: 'dark', content: '复制', placement: 'top-start' }
          //       }, [
          //         h('i', {
          //           class: 'el-icon-document-copy',
          //           style: { cursor: 'pointer' },
          //           on: {
          //             click: () => this.copyToClipboard(row.salesman_mobile)
          //           }
          //         })
          //       ])
          //     ])
          //   }
          // },
          {
            name: i18n.t('4d1aec94.8098e2'),
            key: 'mobile',
            minWidth: 150,
            visible: !this.IS_SUPPLIER(),
            render: (h, { row }) => {
              if (!row.user_delete && this.$store.getters.login_type !== 'merchant') {
                const linkPath =
                  this.$store.getters.login_type != 'distributor'
                    ? '/member/member/memberlist/detail'
                    : '/shopadmin/member/member/memberlist/detail'

                return h('div', { class: 'order-num' }, [h('span', {}, row.mobile)])
              }
              return h('span', {}, row.mobile)
            }
          },
          {
            name: i18n.t('4d1aec94.c60b43'),
            key: 'salesman_name',
            visible: this.VERSION_STANDARD(),
            width: 100
          },
          {
            name: i18n.t('4d1aec94.350fd3'),
            key: 'order_holder',
            width: 120,
            render: (h, { row }) => h('span', {}, this.getOrderCategoryName(row.order_holder)),
            visible: this.VERSION_STANDARD() || this.IS_ADMIN()
          },
          {
            name: i18n.t('4d1aec94.55c61d'),
            key: 'supplier_name',
            minWidth: 100,
            visible: this.VERSION_STANDARD() || this.IS_ADMIN()
          },
          {
            name: i18n.t('4d1aec94.b7765e'),
            key: 'self_delivery_operator_name',
            visible: !this.IS_SUPPLIER()
          },
          {
            name: i18n.t('4d1aec94.60d045'),
            key: 'contact',
            minWidth: 100,
            visible: this.IS_SUPPLIER()
          },
          {
            name: i18n.t('4d1aec94.58cac1'),
            key: '',
            minWidth: 150,
            visible: this.IS_SUPPLIER(),
            render: (h, { row }) => h('span', {}, row.detail[0].item_bn)
          },
          {
            name: i18n.t('4d1aec94.1fd1d5'),
            key: '',
            minWidth: 100,
            visible: this.IS_SUPPLIER(),
            render: (h, { row }) => h('span', {}, row.detail[0].item_name)
          },
          {
            name: i18n.t('4d1aec94.88b8dc'),
            key: '',
            minWidth: 120,
            visible: this.IS_SUPPLIER(),
            render: (h, { row }) => h('span', {}, row.detail[0].num)
          },
          {
            name: i18n.t('4d1aec94.4cf24a'),
            key: 'detail.0.refund_fee',
            minWidth: 100,
            visible: this.IS_SUPPLIER(),
            render: (h, { row }) => h('span', {}, `${(row.detail[0].refund_fee / 100).toFixed(2)}`)
          },
          {
            name: i18n.t('4d1aec94.160adc'),
            key: 'reason',
            minWidth: 100,
            visible: this.IS_SUPPLIER()
          },
          {
            name: i18n.t('4d1aec94.1303e6'),
            key: 'update_time',
            minWidth: 100,
            visible: this.IS_SUPPLIER()
          },
          {
            name: i18n.t('4d1aec94.d4e4ff'),
            key: 'aftersales_type',
            width: 100,
            render: (h, { row }) => {
              const typeMap = {
                'ONLY_REFUND': { text: i18n.t('4d1aec94.6b8821'), type: 'info' },
                'REFUND_GOODS': { text: i18n.t('4d1aec94.cc0193'), type: 'warning' },
                'EXCHANGING_GOODS': { text: i18n.t('4d1aec94.bb9cd5'), type: 'danger' }
              }
              const type = typeMap[row.aftersales_type]
              return type
                ? h(
                    'el-tag',
                    {
                      props: { type: type.type, size: 'mini' }
                    },
                    type.text
                  )
                : h('span', {}, row.aftersales_type)
            }
          },
          {
            name: i18n.t('4d1aec94.5101e8'),
            key: 'aftersales_status',
            width: 100,
            render: (h, { row }) => {
              const statusMap = {
                '0': { text: i18n.t('4d1aec94.047109'), type: '' },
                '1': { text: i18n.t('4d1aec94.5d459d'), type: '' },
                '2': { text: i18n.t('4d1aec94.5ad605'), type: 'success' },
                '3': { text: i18n.t('4d1aec94.dbf36d'), type: 'success' },
                '4': { text: i18n.t('4d1aec94.9c5850'), type: 'success' }
              }
              const status = statusMap[row.aftersales_status]
              return status
                ? h(
                    'el-tag',
                    {
                      props: { type: status.type, size: 'mini' }
                    },
                    status.text
                  )
                : h('span', {}, row.aftersales_status)
            }
          },
          {
            name: i18n.t('4d1aec94.2b6bc0'),
            key: 'actions',
            width: 100,
            fixed: 'left',
            render: (h, { row }) => {
              return h('div', [
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: {
                      click: () => {
                        this.$router.push({
                          path: this.matchRoutePath('detail'),
                          query: { aftersales_bn: row.aftersales_bn, resource: this.$route.path }
                        })
                      }
                    }
                  },
                  i18n.t('4d1aec94.f26225')
                ),
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: {
                      click: () => this.clickShowRemark(row, 'afterList')
                    }
                  },
                  i18n.t('4d1aec94.2432b5')
                )
              ])
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    showAftersale() {
      return (
        this.$store.getters.login_type != 'merchant' &&
        this.$store.getters.login_type != 'distributor'
      )
    }
  },
  watch: {
    $route(to, from) {},
    'params.distributor': {
      handler: function (val) {
        if (!val.name && val.id) {
          this.params.distributor = {
            id: undefined,
            name: undefined
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.query.aftersales_status) {
      this.params.aftersales_status = this.$route.query.aftersales_status
    }
    this.getBaseSetting()
    //获取所有店铺
    this.getStoreList()
  },
  methods: {
    async getBaseSetting() {
      const res = await this.$api.company.getGlobalSetting()
      this.is_pharma_industry = res.medicine_setting.is_pharma_industry == '1'
    },
    handleSelectStore(storeItem) {
      this.params.distributor.id = storeItem.distributor_id
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateTransfer(val) {
      let time_start_begin = undefined
      let time_start_end = undefined
      if (val.length > 0) {
        time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      return {
        time_start_begin,
        time_start_end
      }
    },
    getParams() {
      let params = {
        ...this.dateTransfer(this.params.create_time),
        order_id: this.params.order_id || undefined,
        aftersales_bn: this.params.aftersales_bn || undefined,
        mobile: this.params.mobile || undefined,
        receiver_mobile: this.params.receiver_mobile || undefined,
        aftersales_status: this.params.aftersales_status || undefined,
        aftersales_type: this.params.aftersales_type || undefined,
        supplier_name: this.params.supplier_name || undefined,
        order_holder: this.params.order_holder || undefined,
        distributor_id: this.params.distributor_id || undefined,
        order_class: this.params.order_class || undefined,
        yyrname: this.params.yyrname || undefined,
        is_prescription_order: this.params.is_prescription_order || undefined,
        user_family_name: this.params.user_family_name || undefined
      }
      return params
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
      this.$refs.finder.refresh()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.$refs.finder.refresh()
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach((row) => {
          this.shopList.push({ 'value': row.name, 'distributor_id': row.distributor_id })
        })
      }
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    getOrderCategoryName(order_holder) {
      const item = this.orderCategory.find((item) => item.value == order_holder)
      return item ? item.title : ''
    },
    async exportData() {
      const { status, url, filename } = await this.$api.aftersales.exportList(this.getParams())
      if (status) {
        this.$message({
          type: 'success',
          message: this.$t('4d1aec94.3e1ddd')
        })
        this.$export_open('aftersale_record_count')
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('4d1aec94.bfd8d5')
        })
      }
    },
    normalizeAftersalesRemindIsOpen(value) {
      return value === 'true' || value === true || value === 1 || value === '1' ? 'true' : 'false'
    },
    async aftersalesRemindAction() {
      // 请求提醒数据
      const data = await this.$api.aftersales.getAftersalesRemind()
      if (data) {
        this.aftersalesRemindForm = {
          intro: data.intro || '',
          is_open: this.normalizeAftersalesRemindIsOpen(data.is_open)
        }
      }
      this.aftersalesRemindVisible = true
    },
    updateContent: function (data) {
      this.aftersalesRemindForm.intro = data
    },
    handleCancel() {
      this.aftersalesRemindVisible = false
      this.aftersalesRemindForm.intro = ''
      this.aftersalesRemindForm.is_open = 'false'
    },
    async submitAftersalesRemind() {
      let params = {
        intro: this.aftersalesRemindForm.intro,
        is_open: this.normalizeAftersalesRemindIsOpen(this.aftersalesRemindForm.is_open)
      }
      await this.$api.aftersales.setAftersalesRemind(params)
      this.$message({
        type: 'success',
        message: this.$t('4d1aec94.3b1083')
      })
      this.aftersalesRemindVisible = false
      this.$nextTick(() => {
        this.$refs.finder?.refresh()
      })
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange', val)
      if (val) {
        this.multipleSelection = val
      }
    },
    getRowKeys(val) {
      return val.aftersales_bn
    },
    beforeSearch(params) {
      const searchParams = {
        ...params,
        ...this.params,
        ...this.dateTransfer(this.params.create_time || [])
      }
      return searchParams
    },
    copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        // 使用现代 Clipboard API
        navigator.clipboard
          .writeText(text)
          .then(() => {
            this.$message.success(this.$t('4d1aec94.20a495'))
          })
          .catch(() => {
            this.fallbackCopyTextToClipboard(text)
          })
      } else {
        // 降级到传统方法
        this.fallbackCopyTextToClipboard(text)
      }
    },
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          this.$message.success(this.$t('4d1aec94.20a495'))
        } else {
          this.$message.error(this.$t('4d1aec94.5154ae'))
        }
      } catch (err) {
        this.$message.error(this.$t('4d1aec94.5154ae'))
      }
      document.body.removeChild(textArea)
    },
    async aftersalesAction(type) {
      this.batchReviewType = type
      const selection = this.$refs.finder.$refs.finderTable.getSelection()
      if (selection.length === 0) {
        return this.$message.error(this.$t('4d1aec94.8751cf'))
      }

      // 重置表单
      this.batchReviewForm = {
        is_approved: '1',
        refuse_reason: ''
      }
      // 打开弹框
      this.batchReviewDialog = true
    },
    async onBatchReviewSubmit() {
      try {
        const selection = this.$refs.finder.$refs.finderTable.getSelection()
        if (this.batchReviewForm.is_approved == 0 && !this.batchReviewForm.refuse_reason) {
          this.$message.error(this.$t('4d1aec94.0f9381'))
          return
        }

        const aftersalesBns = selection.map((row) => row.aftersales_bn)
        let params = {
          aftersales_bn: aftersalesBns
        }
        if (this.batchReviewType == 'refund') {
          params.check_refund = this.batchReviewForm.is_approved
          params.refunds_memo = this.batchReviewForm.refuse_reason
        } else {
          params.is_approved = this.batchReviewForm.is_approved
          params.refuse_reason = this.batchReviewForm.refuse_reason
        }
        console.log('Batch review params:', params)
        if (this.batchReviewType == 'refund') {
          await this.$api.aftersales.refundCheck(params)
        } else {
          await this.$api.aftersales.reviewAftersales(params)
        }
        this.$message.success(this.$t('4d1aec94.33130f'))
        this.batchReviewDialog = false
        this.$refs.finder.refresh()
      } catch (error) {
        console.error('Batch review failed:', error)
        this.$message.error(this.$t('4d1aec94.239a77'))
      }
    }
  }
}
</script>
