<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <SpFormPlus
      v-model="form"
      :form-items="formItems"
      form-type="form"
      label-width="160px"
      :show-default-actions="false"
    />
  </SpPage>
</template>

<script>
import { mapGetters } from 'vuex'
import { VERSION_STANDARD, VERSION_IN_PURCHASE, IS_ADMIN, VERSION_PLATFORM } from '@/utils'
export default {
  name: '',
  data() {
    return {
      form: {
        rate_status: false,
        whitelist_status: false,
        pickupcode_status: false,
        minus_shop_gift_store: false,
        check_gift_store: false,
        ziti_send_oms: false,
        nostores_status: false,
        recharge_status: false,
        repeat_cancel: false,
        item_store_status: false,
        item_sales_status: false,
        invoice_status: false,
        distributor_param_status: false,
        dianwu_show_status: false,
        item_page: [0],
        cart_page: [0],
        order_page: [0],
        is_pharma_industry: false,
        use_third_party_system: false,
        use_third_party_system_value: 'kuaizhen580',
        clientId: '',
        clientSecret: '',
        storeId: '',
        stores_isolate: false,
        stores_isolate_template: '',
        stores_isolate_type: 1
      }
    }
  },
  computed: {
    ...mapGetters(['isMicorMall']),
    formItems() {
      return [
        {
          fieldName: '__group_title_1',
          component: 'group',
          label: this.$t('f8743baa.91a229')
        },
        {
          fieldName: 'distributor_param_status',
          label: this.$t('f8743baa.d67433'),
          component: 'switch',
          isShow: () => VERSION_STANDARD(),
          tip: () => {
            return this.$createElement('div', [
              this.$createElement('p', this.$t('f8743baa.5b9fd5')),
              this.$createElement('p', this.$t('f8743baa.8e3fd4')),
              this.$createElement('p', this.$t('f8743baa.fe4268')),
              this.$createElement('p', this.$t('f8743baa.933db8')),
              this.$createElement('p', this.$t('f8743baa.5e6881')),
              this.$createElement('p', this.$t('f8743baa.fe4268'))
            ])
          },
          componentProps: {
            onChange: async (e) => {
              const { distributor_param_status } = this.form
              await this.$api.system.saveShareParams({
                distributor_param_status
              })
            }
          }
        },
        {
          fieldName: 'rate_status',
          label: this.$t('f8743baa.ff3d97'),
          component: 'switch',
          componentProps: {
            onChange: async (e) => {
              const { rate_status } = this.form
              await this.$api.company.setRateSetting({
                rate_status
              })
            }
          }
        },
        {
          fieldName: 'pickupcode_status',
          label: this.$t('f8743baa.2c2951'),
          component: 'switch',
          isShow: () => !this.VERSION_SHUYUN() && !this.VERSION_B2C() && !this.isMicorMall,
          componentProps: {
            onChange: async (e) => {
              const { pickupcode_status } = this.form
              await this.$api.company.setPickupcodeSetting({
                pickupcode_status
              })
            }
          }
        },
        {
          fieldName: 'whitelist_status',
          label: this.$t('f8743baa.05a2d8'),
          component: 'switch',
          componentProps: {
            onChange: async (e) => {
              const { whitelist_status } = this.form
              await this.$api.company.setWhitelistSetting({
                whitelist_status
              })
            }
          }
        },
        {
          fieldName: 'check_gift_store',
          label: this.$t('f8743baa.47c0fd'),
          component: 'switch',
          tip: this.$t('f8743baa.c0d404'),
          isShow: () => !VERSION_IN_PURCHASE(),
          componentProps: {
            onChange: async (e) => {
              const { check_gift_store } = this.form
              await this.$api.company.setGiftSetting({
                check_gift_store
              })
            }
          }
        },
        {
          fieldName: 'ziti_send_oms',
          label: this.$t('f8743baa.f90709'),
          component: 'switch',
          tip: this.$t('f8743baa.aeb804'),
          isShow: () => !this.VERSION_SHUYUN() && !VERSION_IN_PURCHASE(),
          componentProps: {
            onChange: async (e) => {
              const { ziti_send_oms } = this.form
              await this.$api.company.setSendOmsSetting({
                ziti_send_oms
              })
            }
          }
        },
        // {
        //   label: '前端店铺展示',
        //   key: 'nostores_status',
        //   type: 'switch',
        //   tip: '用于开启前端店铺切换功能',
        //   isShow: VERSION_STANDARD(),
        //   onChange: async e => {
        //     const { nostores_status } = this.form
        //     await this.$api.company.setNoStores({
        //       nostores_status: !nostores_status
        //     })
        //   }
        // },
        // {
        //   label: '店铺隔离',
        //   key: 'stores_isolate',
        //   type: 'switch',
        //   tip: '开启后需添加店铺白名单方能访问店铺页面',
        //   isShow: VERSION_STANDARD() && IS_ADMIN,
        //   component: () => (
        //     <div class="isolate-contanier">
        //       <el-switch
        //         v-model={this.form.stores_isolate}
        //         onChange={() => {
        //           this.saveOpenDividedSetting()
        //         }}
        //       />
        //       {this.form.stores_isolate && (
        //         <div>
        //           <el-radio-group
        //             value={this.form.stores_isolate_type}
        //             onInput={(e) => {
        //               console.log(e)
        //               this.form.stores_isolate_type = e
        //               this.saveOpenDividedSetting()
        //             }}
        //           >
        //             <el-radio-button label='1'>
        //               <span>虚拟店铺</span>
        //             </el-radio-button>
        //             <el-radio-button label='2'>
        //               <span>引导页</span>
        //             </el-radio-button>
        //           </el-radio-group>
        //           {this.form.stores_isolate_type == '2' && (
        //             <div>
        //               <span
        //                 class='isolate-set'
        //                 onClick={() => {
        //                   this.onClickStoresIsolate()
        //                 }}
        //               >
        //                 {this.form?.stores_isolate_template ? '已设置引导页模版' : '设置引导页模版'}
        //               </span>
        //               {this.form?.stores_isolate_template && (
        //                 <el-button
        //                   class='isolate-clear'
        //                   onClick={() => {
        //                     this.onClickClear()
        //                   }}
        //                 >
        //                   清除
        //                 </el-button>
        //               )}
        //             </div>
        //           )}
        //         </div>
        //       )}
        //     </div>
        //   )
        // },
        {
          fieldName: 'repeat_cancel',
          label: this.$t('f8743baa.f45023'),
          component: 'switch',
          tip: this.$t('f8743baa.89e3a5'),
          componentProps: {
            onChange: async (e) => {
              const { repeat_cancel } = this.form
              await this.$api.company.setRepeatCancelSetting({
                repeat_cancel
              })
            }
          }
        },
        {
          fieldName: 'item_store_status',
          label: this.$t('f8743baa.24bc52'),
          component: 'switch',
          tip: this.$t('f8743baa.f590ae'),
          componentProps: {
            onChange: async (e) => {
              const { item_store_status } = this.form
              await this.$api.company.setItemStoreSetting({
                item_store_status
              })
            }
          }
        },
        {
          fieldName: 'item_sales_status',
          label: this.$t('f8743baa.a2a175'),
          component: 'switch',
          componentProps: {
            onChange: async (e) => {
              const { item_sales_status } = this.form
              await this.$api.company.setItemSalesSetting({
                item_sales_status
              })
            }
          }
        },
        {
          fieldName: 'invoice_status',
          label: this.$t('f8743baa.764f07'),
          component: 'switch',
          tip: this.$t('f8743baa.79ebf3'),
          isShow: () => !VERSION_IN_PURCHASE(),
          componentProps: {
            onChange: async (e) => {
              const { invoice_status } = this.form
              await this.$api.company.setInvoiceStatus({
                invoice_status
              })
            }
          }
        },
        {
          fieldName: 'dianwu_show_status',
          label: this.$t('f8743baa.7f450a'),
          component: 'switch',
          tip: this.$t('f8743baa.016f55'),
          componentProps: {
            onChange: async (e) => {
              const { dianwu_show_status } = this.form
              await this.$api.company.setDianwuShowStatus({
                dianwu_show_status
              })
            }
          }
        },
        {
          fieldName: 'is_pharma_industry',
          label: this.$t('f8743baa.a8ea51'),
          component: 'switch',
          tip: this.$t('f8743baa.073e31'),
          componentProps: {
            onChange: this.primarySetting
          }
        },
        {
          fieldName: 'use_third_party_system',
          label: this.$t('f8743baa.864ed6'),
          component: 'switch',
          isShow: () => this.form.is_pharma_industry,
          componentProps: {
            onChange: this.primarySetting
          }
        },
        {
          fieldName: 'use_third_party_system_value',
          label: '',
          component: 'radio',
          isShow: () => this.form.use_third_party_system && this.form.is_pharma_industry,
          componentProps: {
            options: [
              {
                label: this.$t('f8743baa.40b3e4'),
                value: 'kuaizhen580'
              }
            ],
            onChange: async (e) => {
              const { dianwu_show_status } = this.form
              await this.$api.company.setDianwuShowStatus({
                dianwu_show_status
              })
            }
          }
        },
        {
          fieldName: 'clientId',
          label: 'clientId',
          formItemClass: 'w-1/2',
          component: 'input',
          isShow: () => this.form.use_third_party_system && this.form.is_pharma_industry
        },
        {
          fieldName: 'clientSecret',
          label: 'clientSecret',
          formItemClass: 'w-1/2',
          component: 'input',
          isShow: () => this.form.use_third_party_system && this.form.is_pharma_industry
        },
        {
          fieldName: 'storeId',
          label: this.$t('f8743baa.0db798'),
          formItemClass: 'w-1/2',
          component: 'input',
          isShow: () => this.form.use_third_party_system && this.form.is_pharma_industry
        },
        {
          fieldName: '__button_save',
          label: '',
          component: ({ h }) => {
            return h(
              'el-button',
              {
                props: {
                  type: 'primary'
                },
                on: {
                  click: () => {
                    this.primarySetting('button')
                  }
                }
              },
              this.$t('f8743baa.be5fbb')
            )
          },
          isShow: () => this.form.use_third_party_system && this.form.is_pharma_industry
        },
        {
          fieldName: '__group_title_2',
          component: 'group',
          label: this.$t('f8743baa.ce0ab2')
        },
        {
          fieldName: 'item_page',
          label: this.$t('f8743baa.75f135'),
          component: 'checkbox',
          componentProps: {
            options: VERSION_IN_PURCHASE()
              ? [
                  { label: this.$t('f8743baa.e29575'), value: 0, disabled: true },
                  { label: this.$t('f8743baa.1afdfe'), value: 1 }
                ]
              : [
                  { label: this.$t('f8743baa.e29575'), value: 0, disabled: true },
                  { label: this.$t('f8743baa.1afdfe'), value: 1 },
                  { label: this.$t('f8743baa.c8c6a3'), value: 2 },
                  { label: this.$t('f8743baa.627908'), value: 3 }
                ],
            onChange: async (e) => {
              this.saveItemPriceSetting()
            }
          }
        },
        {
          fieldName: 'cart_page',
          label: this.$t('f8743baa.c017be'),
          component: 'checkbox',
          componentProps: {
            options: VERSION_IN_PURCHASE()
              ? [{ label: this.$t('f8743baa.1afdfe'), value: 1 }]
              : [
                  { label: this.$t('f8743baa.e79235'), value: 0, disabled: true },
                  { label: this.$t('f8743baa.1afdfe'), value: 1 }
                ],
            onChange: async (e) => {
              this.saveItemPriceSetting()
            }
          }
        },
        {
          fieldName: 'order_page',
          label: this.$t('f8743baa.8054f7'),
          component: 'checkbox',
          componentProps: {
            options: VERSION_IN_PURCHASE()
              ? [{ label: this.$t('f8743baa.1afdfe'), value: 1 }]
              : [
                  { label: this.$t('f8743baa.e79235'), value: 0, disabled: true },
                  { label: this.$t('f8743baa.1afdfe'), value: 1 }
                ],
            onChange: async (e) => {
              this.saveItemPriceSetting()
            }
          }
        }
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const res = await this.$api.company.getGlobalSetting()
      this.form = {
        ...this.form,
        rate_status: res.traderate_setting.rate_status,
        whitelist_status: res.whitelist_setting.whitelist_status,
        pickupcode_status: res.pickupcode_setting.pickupcode_status,
        minus_shop_gift_store: res.gift_setting.minus_shop_gift_store,
        check_gift_store: res.gift_setting.check_gift_store,
        ziti_send_oms: res.sendoms_setting.ziti_send_oms,
        nostores_status: !res.nostores_setting.nostores_status,
        recharge_status: res.recharge_setting.recharge_status,
        repeat_cancel: res.cancel_setting.repeat_cancel,
        item_store_status: res.item_store_setting.item_store_status,
        item_sales_status: res.item_sales_setting.item_sales_status,
        invoice_status: res.invoice_setting.invoice_status,
        distributor_param_status: res.share_parameters_setting.distributor_param_status,
        dianwu_show_status: res.dianwu_setting.dianwu_show_status,
        is_pharma_industry: res.medicine_setting.is_pharma_industry == '1',
        use_third_party_system: !!res.medicine_setting.use_third_party_system,
        clientId: res.medicine_setting.kuaizhen580_config?.client_id,
        clientSecret: res.medicine_setting.kuaizhen580_config?.client_secret,
        storeId: res.medicine_setting.kuaizhen580_config?.kuaizhen_store_id,
        stores_isolate: res.open_distributor_divided?.status || false, // 店铺隔离开关
        stores_isolate_template: res.open_distributor_divided?.template || '', // 店铺隔离模版
        stores_isolate_type: res.open_distributor_divided?.type || 1 // 店铺隔离类型
        // stores_isolate: res.open_distributor_divided?.status || false, // 店铺隔离开关
        // stores_isolate_template: res.open_distributor_divided?.template || '' // 店铺隔离模版
      }
      const { cart_page, order_page, item_page } = res.item_price_setting
      if (cart_page.market_price) {
        this.form.cart_page = [0, 1]
      }
      if (order_page.market_price) {
        this.form.order_page = [0, 1]
      }
      if (item_page.market_price) {
        this.form.item_page = [0, 1]
      }
      if (item_page.member_price) {
        this.form.item_page.push(2)
      }
      if (item_page.svip_price) {
        this.form.item_page.push(3)
      }
    },
    async saveItemPriceSetting() {
      const { cart_page, order_page, item_page } = this.form
      const params = {
        cart_page: {
          market_price: cart_page.indexOf(1) > -1
        },
        order_page: {
          market_price: order_page.indexOf(1) > -1
        },
        item_page: {
          market_price: item_page.indexOf(1) > -1,
          member_price: item_page.indexOf(2) > -1,
          svip_price: item_page.indexOf(3) > -1
        }
      }
      await this.$api.company.saveItemPriceSetting(params)
    },
    async primarySetting(isBtn) {
      const { is_pharma_industry, use_third_party_system, clientId, clientSecret, storeId } =
        this.form
      try {
        await this.$api.company.setPharmaIndustry({
          is_pharma_industry: is_pharma_industry ? '1' : '0',
          use_third_party_system: use_third_party_system ? 'kuaizhen580' : '',
          kuaizhen580_config: { clientId, clientSecret, storeId }
        })
        if (isBtn == 'button') {
          this.$message.success(this.$t('f8743baa.3b1083'))
        }
      } catch (error) {
        this.fetch()
      }
    },
    // 店铺隔离引导页模版
    async onClickStoresIsolate() {
      const { data } = await this.$picker.pages({
        multiple: false,
        data: [Number(this.form?.stores_isolate_template)]
      })

      data && (this.form.stores_isolate_template = data[0].id)
      this.saveOpenDividedSetting()
    },
    // 清除店铺隔离模版
    async onClickClear() {
      this.form.stores_isolate_template = ''
      this.saveOpenDividedSetting()
    },
    // 保存店铺隔离设置
    async saveOpenDividedSetting() {
      const { stores_isolate, stores_isolate_template, stores_isolate_type } = this.form
      const params = {
        open_distributor_divided: {
          status: stores_isolate,
          template: stores_isolate_template,
          type: stores_isolate ? stores_isolate_type : ''
        }
      }
      await this.$api.company.saveOpenDividedSetting(params)
    }
  }
}
</script>
