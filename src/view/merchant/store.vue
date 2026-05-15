<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.merchant-store ::v-deep .el-input-number {
  line-height: 34px !important;
  margin: 0 10px;
}
.merchant-store ::v-deep .el-form-item {
  width: 360px;
}
.merchant-store ::v-deep .el-form-item__content {
  min-width: 260px;
}
.qqmap-infowin ::v-deep .el-button {
  float: right;
  margin-top: 10px;
}
.merchant-store {
  .start-time,
  .end-time {
    width: 120px;
  }
  .separator {
    margin: 0 7px;
  }
  .lng-lat-block {
    display: flex;
    align-items: center;
    .el-input {
      width: 120px;
    }
    .separator {
      margin: 0 7px;
    }
  }
  .address-block {
    display: flex;
    align-items: center;
    .regions {
      margin-right: 10px;
      width: 260px;
    }
    .address {
      width: 400px;
      max-width: inherit;
      margin-right: 10px;
    }
  }
  .qqmap-infowin {
    line-height: initial;
    .address-name {
      display: flex;
      align-items: center;
      font-weight: 600;
      color: #222;
      white-space: nowrap;
    }
    .address-detail {
      font-size: 13px;
      color: #999;
      white-space: nowrap;
    }
  }
  #qqmap_rslist {
    border-right: 1px solid #e7e7eb;
  }
  #qqmap_container {
    width: 800px;
    height: 400px;
  }
}
</style>
<style lang="scss">
// 营业时间下拉选项居中（只针对 merchant-store 页面的时间选择器）
.merchant-store-time-select {
  .time-select-item,
  .el-time-spinner__item {
    text-align: center !important;
  }
}
</style>
<template>
  <SpPage class="merchant-store">
    <SpForm
      ref="form"
      v-model="form"
      show-message
      label-width="130px"
      :form-list="formList"
      :submit="false"
    />

    <div class="footer-container">
      <el-button @click.native="handleCancel">{{ $t('027707af.625fb2') }}</el-button>
      <el-button
        v-if="!VERSION_STANDARD() || (!IS_DISTRIBUTOR() && VERSION_STANDARD())"
        type="primary"
        :loading="submitLoading"
        @click="onFormSubmit"
      >
        {{ submitLoading ? $t('027707af.7ef44a') : $t('027707af.be5fbb') }}
      </el-button>
    </div>

    <SpTranslatePopup
      ref="translatePopup"
      table-name="distribution_distributor"
      :data-id="translateContext.dataId"
      :fields="translateContext.fields"
      :values="translateContext.values"
      :source-language="translateContext.sourceLang"
      @done="onTranslateDone"
      @save-only="onTranslateSaveOnly"
      @cancel="onTranslateCancel"
    />
  </SpPage>
</template>

<script>
import { isObject, isArray, isEmpty, getRegionNameById } from '@/utils'
import Pages from '@/utils/pages'
import { loadMap } from '@/utils/load-map'
import district from '@/common/district.json'
import DaoDianZiti from './components/DaoDianZiti'
import RefundGoodsAddress from './components/RefundGoodsAddress'
import RefundGoodsStore from './components/RefundGoodsStore'
import SpTranslatePopup from '@/components/sp-translate-popup'
import translateMixin from '@/mixins/translateMixin'
export default {
  components: { DaoDianZiti, RefundGoodsAddress, RefundGoodsStore, SpTranslatePopup },
  mixins: [translateMixin],
  data() {
    let distributionTypeOptions = [
      {
        title: this.$t('027707af.491c0c'),
        value: 0
      }
    ]
    if (!this.VERSION_STANDARD()) {
      distributionTypeOptions.push({
        title: this.$t('027707af.059670'),
        value: 1
      })
    }
    return {
      form: {
        distribution_type: 0, // 店铺类型： 0=自营；1=加盟
        distributor_category_id: '',
        merchant_id: '',
        shop_code: '',
        name: '',
        contact: '',
        mobile: '',
        contract_phone: '',
        startTime: '',
        endTime: '',
        is_delivery: false,
        show_mobile: 1,
        is_audit_goods: false,
        auto_sync_goods: false,
        is_require_subdistrict: false,
        is_require_building: false,
        logo: '',
        banner: '',
        lng: '121.418211',
        lat: '31.175317',
        regions_id: ['310000', '310100', '310104'],
        address: '',
        is_dada: false,
        is_self_delivery: true,
        is_valid: 'true',
        show_salesperson: 0,
        salesperson_type: 1,
        fixed_salesperson_qrcode_url: '',
        freight_time: 1,
        business: '',
        is_ziti: false,
        offline_aftersales: false,
        offline_aftersales_address: {
          name: '',
          regions_id: '',
          address: '',
          area_code: '',
          mobile: '',
          startTime: '',
          endTime: ''
        },
        offline_aftersales_other: false,
        is_refund_freight: false,
        wdt_shop_no: '',
        jst_shop_id: '',
        introduce: ''
      },
      offline_freight_status: false,
      formList: [
        {
          label: this.$t('027707af.1dbb0d'),
          type: 'group',
          isShow: ({ key }, value) => this.IS_ADMIN() && this.distributor_self == 0
        },
        {
          label: this.$t('027707af.1dbb0d'),
          key: 'distribution_type',
          type: 'select',
          display: 'inline',
          clearable: false,
          options: distributionTypeOptions,
          isShow: ({ key }, value) => this.IS_ADMIN() && this.distributor_self == 0
        },
        {
          label: this.$t('027707af.2419d0'),
          key: 'distributor_category_id',
          type: 'select',
          display: 'inline',
          clearable: true,
          options: [],
          placeholder: this.$t('027707af.459c3e'),
          isShow: ({ key }, value) => this.IS_ADMIN() && this.distributor_self == 0
        },
        {
          label: this.$t('027707af.1eaa17'),
          key: 'merchant_id',
          type: 'select',
          display: 'inline',
          component: ({ key }, value) => {
            return (
              <el-select
                v-model={value[key]}
                v-scroll={() => this.pageQuery.nextPage()}
                class={[
                  {
                    'is-error': !value[key]
                  }
                ]}
                clearable
                on-clear={() => this.onRemoteGetMerchant()}
                on-focus={() => this.onRemoteGetMerchant()}
                filterable
                loading={this.remoteLoading}
                remote
                remote-method={(e) => this.onRemoteGetMerchant(e)}
                placeholder={this.$t('027707af.84d4a2')}
              >
                {this.merchantList.map((item, index) => (
                  <el-option
                    key={`option-item__${index}`}
                    label={item.merchant_name}
                    value={item.id}
                  />
                ))}
              </el-select>
            )
          },
          isShow: ({ key }, value) => {
            return value.distribution_type == 1 && this.IS_ADMIN() && this.distributor_self == 0
          },
          validator: (rule, value, callback) => {
            if (this.form.distribution_type == 1 && !value) {
              callback(new Error(this.$t('027707af.24a64e')))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('027707af.6ea1fe'),
          type: 'group'
        },
        {
          label: this.$t('027707af.f6d738'),
          key: 'shop_code',
          type: 'input',
          display: 'inline',
          placeholder: this.$t('027707af.30c679'),
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error(this.$t('027707af.6acf55')))
            } else if (!/^[A-Za-z0-9\-]+$/.test(value)) {
              callback(new Error(this.$t('027707af.ec77cf')))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('027707af.0d4934'),
          key: 'name',
          type: 'input',
          display: 'inline',
          placeholder: this.$t('027707af.867738'),
          required: true,
          message: this.$t('027707af.097cc0')
        },
        {
          label: this.$t('027707af.986d36'),
          key: 'contact',
          type: 'input',
          display: 'inline',
          disabled: () => this.datapass_block == 1,
          placeholder: this.$t('027707af.e30625'),
          required: true,
          message: this.$t('027707af.bfc304')
        },
        {
          label: this.$t('027707af.b58943'),
          key: 'mobile',
          type: 'input',
          display: 'inline',
          disabled: () => this.datapass_block == 1,
          placeholder: this.$t('027707af.2b28a8'),
          required: true,
          message: this.$t('027707af.264639')
        },
        {
          label: this.$t('027707af.699886'),
          key: 'contract_phone',
          type: 'input',
          display: 'inline',
          placeholder: this.$t('027707af.cb842c')
        },
        {
          label: this.$t('027707af.a2bed2'),
          // key: 'contract_phone',
          display: 'inline',
          component: ({ key }, value) => {
            return (
              <div>
                <el-time-select
                  v-model={value['startTime']}
                  class='start-time'
                  popper-class='merchant-store-time-select'
                  placeholder={this.$t('027707af.26dac3')}
                  picker-options={{
                    start: '00:00',
                    step: '00:30',
                    end: '23:59'
                  }}
                />
                <span class='separator'>-</span>
                <el-time-select
                  v-model={value['endTime']}
                  class='end-time'
                  popper-class='merchant-store-time-select'
                  placeholder={this.$t('027707af.f78277')}
                  picker-options={{
                    start: '00:00',
                    step: '00:30',
                    end: '23:59',
                    minTime: value.startTime
                  }}
                />
              </div>
            )
          }
        },
        {
          label: this.$t('027707af.2e552e'),
          key: 'is_delivery',
          type: 'switch',
          display: 'inline'
        },
        {
          label: this.$t('027707af.371f30'),
          key: 'show_mobile',
          type: 'switch',
          display: 'inline',
          component: ({ key }, value) => {
            return <el-switch v-model={value[key]} active-value={1} inactive-value={0} />
          }
        },
        {
          label: this.$t('027707af.48f0ee'),
          key: 'is_audit_goods',
          type: 'switch',
          display: 'inline',
          width: '360px',
          tip: this.$t('027707af.c46414'),
          isShow: ({ key }, value) => !this.VERSION_STANDARD() && value.distribution_type == 0
        },
        {
          label: this.$t('027707af.5aa3a7'),
          key: 'auto_sync_goods',
          type: 'switch',
          display: 'inline',
          tip: this.$t('027707af.8d61d8'),
          isShow: ({ key }, value) =>
            this.VERSION_STANDARD() && !this.IS_DISTRIBUTOR() && this.distributor_self == 0
        },
        {
          label: this.$t('027707af.6e548b'),
          key: 'is_require_subdistrict',
          type: 'switch',
          display: 'inline',
          tip: this.$t('027707af.1ef2d0')
        },
        {
          label: this.$t('027707af.a4e97c'),
          key: 'is_require_building',
          type: 'switch',
          display: 'inline',
          tip: this.$t('027707af.e2f9a1')
        },
        {
          label: this.$t('027707af.0a151e'),
          type: 'group',
          tip: this.$t('027707af.1431d1')
        },
        {
          label: this.$t('027707af.332050'),
          key: 'logo',
          display: 'inline',
          component: ({ key }, value) => {
            return <SpImagePicker v-model={value[key]} />
          }
        },
        {
          label: this.$t('027707af.51de63'),
          key: 'banner',
          display: 'inline',
          component: ({ key }, value) => {
            return <SpImagePicker v-model={value[key]} />
          }
        },
        {
          label: this.$t('027707af.e243d4'),
          type: 'group',
          tip: this.$t('027707af.cdd17f')
        },
        {
          label: this.$t('027707af.db4b0d'),
          component: ({ key }, value) => {
            return (
              <div class='lng-lat-block'>
                <el-input v-model={value.lng} readonly placeholder={this.$t('027707af.3d18ca')} />
                <span class='separator'>-</span>
                <el-input v-model={value.lat} readonly placeholder={this.$t('027707af.6acaee')} />
              </div>
            )
          }
        },
        {
          label: this.$t('027707af.fc82aa'),
          key: 'address',
          width: '1000px',
          component: ({ key }, value) => {
            return (
              <div class='address-block'>
                <el-cascader v-model={value['regions_id']} class='regions' options={district} />
                <el-input
                  v-model={value['address']}
                  class={[
                    'address',
                    {
                      'is-error': !value['address']
                    }
                  ]}
                  placeholder={this.$t('027707af.f375e0')}
                />
                <el-input
                  v-model={value['house_number']}
                  placeholder={this.$t('027707af.7672fd')}
                />
                <el-button type='primary' on-click={this.searchKeyword}>
                  {this.$t('027707af.83546a')}
                </el-button>
              </div>
            )
          },
          validator: (rule, value, callback) => {
            if (!this.form.address) {
              callback(new Error(this.$t('027707af.a95544')))
            } else {
              callback()
            }
          }
        },
        {
          label: '',
          component: ({ key }, value) => <div id='qqmap_container' />
        },
        {
          label: this.$t('027707af.6d7cb8'),
          key: 'is_valid',
          type: 'radio',
          tip: this.$t('027707af.3c751e'),
          options: [
            { name: this.$t('027707af.7854b5'), label: 'true' },
            { name: this.$t('027707af.710ad0'), label: 'false' },
            { name: this.$t('027707af.0044f6'), label: 'delete' }
          ],
          isShow: () => this.distributor_self == 0
        },
        {
          label: this.$t('027707af.0581a1'),
          key: 'show_salesperson',
          type: 'switch',
          display: 'inline',
          component: ({ key }, value) => {
            return (
              <el-switch
                v-model={value[key]}
                active-value={1}
                inactive-value={0}
                on-change={(val) => {
                  if (val === 0) {
                    value.fixed_salesperson_qrcode_url = ''
                    value.salesperson_type = 1
                  }
                }}
              />
            )
          },
          tip: this.$t('027707af.9cbc57')
        },
        {
          label: this.$t('027707af.32d834'),
          key: 'salesperson_type',
          type: 'radio',
          display: 'inline',
          options: [
            { name: this.$t('027707af.9cfec5'), label: 1 },
            { name: this.$t('027707af.29189f'), label: 2 }
          ],
          isShow: ({ key }, value) => value.show_salesperson !== 0
        },
        {
          label: this.$t('027707af.80384a'),
          key: 'fixed_salesperson_qrcode_url',
          display: 'inline',
          component: ({ key }, value) => {
            return <SpImagePicker v-model={value[key]} />
          },
          validator: (rule, value, callback) => {
            if (this.form.show_salesperson === 1 && this.form.salesperson_type === 1) {
              if (!value) {
                callback(new Error(this.$t('027707af.e90339')))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          isShow: ({ key }, value) => value.show_salesperson === 1 && value.salesperson_type === 1
        },
        {
          label: this.$t('027707af.6a9e57'),
          type: 'group',
          tip: this.$t('027707af.408f9b'),
          isShow: () => this.dadaEnable
        },
        {
          label: this.$t('027707af.6a9e57'),
          key: 'is_dada',
          type: 'switch',
          width: 'auto',
          tip: this.$t('027707af.ed46b7'),
          isShow: () => this.dadaEnable
        },
        {
          label: this.$t('027707af.c3bf69'),
          key: 'is_self_delivery',
          // type: 'radio',
          // options: [
          // { name: '商家自配送', label: true },
          // { name: '达达同城配', label: false }
          // { name: '闪送', label: 6 }
          // ],
          isShow: ({ key }, value) => value.is_dada,
          component: ({ key }, value) => {
            return (
              <div style='margin-top: 14px;display:flex'>
                <el-radio v-model={value[key]} label={true}>
                  {this.$t('027707af.0e903e')}
                </el-radio>
                <el-radio v-model={value[key]} label={false} disabled={!this.dadaEnable}>
                  {this.$t('027707af.bcb155')}
                </el-radio>
              </div>
            )
          }
        },
        {
          key: 'freight_time',
          isShow: ({ key }, value) => value.is_self_delivery && value.is_dada,
          component: ({ key }, value) => {
            return (
              <div style='margin-left: 27px;display:flex'>
                {this.$t('027707af.c05ed6')}
                <el-input-number
                  v-model={value[key]}
                  placeholder={this.$t('027707af.a11cc7')}
                  step={1}
                  min={1}
                />
                {this.$t('027707af.eb7e64')}
              </div>
            )
          }
        },
        {
          label: this.$t('027707af.09ab42'),
          key: 'business',
          type: 'select',
          options: [],
          isShow: ({ key }, value) => !value.is_self_delivery && value.is_dada,
          validator: (rule, value, callback) => {
            console.log('value:', value)
            if (!this.form.is_self_delivery && value?.is_dada) {
              if (!value) {
                callback(new Error(this.$t('027707af.bf756d')))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('027707af.93ab28'),
          type: 'group',
          isShow: () => this.distributor_self == 0
        },
        {
          label: this.$t('027707af.93ab28'),
          key: 'is_ziti',
          type: 'switch',
          width: 'auto',
          tip: this.$t('027707af.c3a20c'),
          isShow: () => this.distributor_self == 0
        },
        {
          label: '',
          width: '1000px',
          component: ({ key }, value) => <DaoDianZiti ref='daoDianZiti' />,
          isShow: ({ key }, value) => this.distributor_self == 0 && value.is_ziti
        },
        {
          label: this.$t('027707af.11b600'),
          type: 'group'
        },
        {
          label: this.$t('027707af.6dc5f4'),
          key: 'offline_aftersales',
          type: 'switch',
          width: 'auto',
          tip: this.$t('027707af.53dbe3')
        },
        {
          label: this.$t('027707af.efdb86'),
          width: 'auto',
          component: ({ key }, value) => (
            <RefundGoodsAddress v-model={value['offline_aftersales_address']} />
          )
        },
        {
          label: this.$t('027707af.6105a8'),
          width: '1000px',
          component: ({ key }, value) => (
            <RefundGoodsStore
              v-model={value['offline_aftersales_address']}
              ref='refundGoodsStore'
            />
          )
        },
        {
          label: this.$t('027707af.7c8532'),
          key: 'offline_aftersales_other',
          type: 'switch',
          width: 'auto',
          tip: this.$t('027707af.2c41e6')
        },
        //平台开了才能操作，否则置灰
        {
          label: this.$t('027707af.32f43e'),
          key: 'is_refund_freight',
          type: 'switch',
          disabled: () => this.offline_freight_status,
          width: 'auto',
          tip: this.$t('027707af.434c77')
        },
        {
          label: this.$t('027707af.a891b2'),
          type: 'group'
        },
        {
          label: 'shopNo',
          key: 'wdt_shop_no',
          type: 'input',
          display: 'inline',
          placeholder: ''
        },
        {
          label: this.$t('027707af.318bb2'),
          type: 'group'
        },
        {
          label: this.$t('027707af.a3068b'),
          key: 'jst_shop_id',
          type: 'input',
          display: 'inline',
          placeholder: ''
        },
        {
          label: this.$t('027707af.fb0e24'),
          type: 'group'
        },
        {
          label: this.$t('027707af.fb0e24'),
          key: 'introduce',
          type: 'textarea',
          placeholder: '',
          width: '1000px'
        }
      ],
      merchantList: [],
      categoryList: [],
      remoteLoading: false,
      regions: district,
      submitLoading: false,
      searchService: null,
      map: null,
      mapMarker: null,
      datapass_block: 0,
      distributor_self: 0, // 总店=1
      dadaEnable: false
    }
  },
  created() {
    const { distributor_type, distributor_id } = this.$route.query
    this.pageQuery = new Pages({
      pageSize: 10,
      fetch: this.getMerchantList
    })
    this.distributor_self = distributor_type === 'distributor_self' ? 1 : 0
    if (distributor_type === 'distributor_self' && !distributor_id) {
      this.form.is_delivery = true
    }
    // 当distributor_self为1时，移除地理位置表单项的validator
    if (distributor_type === 'distributor_self') {
      const addressItem = this.formList.find((item) => item.key === 'address')
      if (addressItem && addressItem.validator) {
        delete addressItem.validator
      }
    }
    console.log(process.env.VUE_APP_LOCAL_DELIVERY_DIRVER)
    if (process.env.VUE_APP_LOCAL_DELIVERY_DIRVER == 'shansong') {
      this.getShansongInfo()
    } else {
      this.getDadaInfo()
    }
    this.getStoreInfo()
    this.getOrderSetting()
    this.getCategoryList()
  },
  mounted() {},
  methods: {
    async getOrderSetting() {
      const res = await this.$api.trade.getOrderSetting()
      this.offline_freight_status = res.is_refund_freight != 1
    },
    async getMerchantList({ page, pageSize }, keywords) {
      let params = {
        pageSize,
        page
      }
      if (!isEmpty(keywords)) {
        params = {
          ...params,
          merchant_name: keywords
        }
      }
      if (page == 1) {
        this.remoteLoading = true
      }
      const { list, total_count } = await this.$api.marketing.getMerchantsList(params)
      if (page == 1) {
        this.remoteLoading = false
      }
      this.pageQuery.setTotal(total_count)
      this.merchantList = this.merchantList.concat(list)
    },
    onRemoteGetMerchant(e) {
      if (!this.form.merchant_id) {
        this.merchantList = []
        this.pageQuery.reset(e)
      }
    },
    async searchKeyword() {
      //设置搜索的范围和关键字等属性
      const { regions_id, address } = this.form
      if (regions_id.length == 0) {
        this.$message.error(this.$t('027707af.ad1a24'))
        return
      }
      if (!address) {
        this.$message.error(this.$t('027707af.ef5ed8'))
        return
      }
      const [province, city, country] = getRegionNameById(regions_id, district)

      const locationRes = await this.$api.distributor.getAreaByAddress({
        address: `${province}${city}${country}${address}`
      })

      if (locationRes.status != 0) {
        this.$message.error(locationRes.message)
        return
      }

      this.form.lng = locationRes.result.location.lng
      this.form.lat = locationRes.result.location.lat
      const latlng = new qq.maps.LatLng(
        locationRes.result.location.lat,
        locationRes.result.location.lng
      )
      this.map.setCenter(latlng)
      this.mapMarker.setPosition(latlng)
    },
    async getDadaInfo() {
      const { business_list, is_open } = await this.$api.dada.getDadaInfo()
      const typeList = Object.keys(business_list).reduce((total, current, index) => {
        return total.concat({
          value: Number(current),
          title: business_list[current]
        })
      }, [])
      this.formList.forEach((item) => {
        if (item.key == 'business') {
          item.options = typeList
        }
      })
      this.dadaEnable = is_open === '1'
    },
    async getShansongInfo() {
      const { business_list, is_open } = await this.$api.dada.getShansongInfo()
      const typeList = Object.keys(business_list).reduce((total, current, index) => {
        return total.concat({
          value: Number(current),
          title: business_list[current]
        })
      }, [])
      this.formList.forEach((item) => {
        if (item.key == 'business') {
          item.options = typeList
        }
      })
      this.dadaEnable = is_open === '1'
    },
    async getCategoryList() {
      try {
        const res = await this.$api.store.getStoreCategoryList({
          page: 1,
          pageSize: 1000
        })
        this.categoryList = res.list || []
        // 更新 formList 中的选项
        this.formList.forEach((item) => {
          if (item.key === 'distributor_category_id') {
            item.options = this.categoryList.map((category) => ({
              value: category.category_id,
              title: category.category_name
            }))
          }
        })
      } catch (error) {
        console.error('获取门店分类列表失败:', error)
      }
    },
    async getStoreInfo() {
      const { distributor_id } = this.$route.query
      if (distributor_id || this.IS_DISTRIBUTOR()) {
        const res = await this.$api.marketing.getDistributorInfo({ distributor_id })
        const [startTime, endTime] = res.hour?.split('-') || []

        // 退货点区号、手机号
        // 退货点营业时间段
        let offline_startTime = '',
          offline_endTime = '',
          offline_areaCode = '',
          offline_mobile = ''
        if (isObject(res.offline_aftersales_address)) {
          const { hours, mobile } = res.offline_aftersales_address
          let [t1, t2] = hours?.split('-') || []
          offline_startTime = t1
          offline_endTime = t2
          if (mobile.indexOf('-') > -1) {
            let [code, m] = res.offline_aftersales_address.mobile?.split('-') || []
            offline_areaCode = code
            offline_mobile = m
          } else {
            offline_mobile = mobile
          }
        }
        this.datapass_block = res.datapass_block
        const showSalespersonApi = Number(res.show_salesperson)
        const showSalespersonOn = showSalespersonApi === 1 || showSalespersonApi === 2 ? 1 : 0
        const salespersonTypeFromApi = showSalespersonApi === 2 ? 2 : 1
        this.form = {
          distribution_type: res.distribution_type,
          distributor_category_id: res.distributor_category_id,
          merchant_id: res.merchant_id,
          shop_code: res.shop_code,
          name: res.name,
          contact: res.contact,
          mobile: res.mobile,
          contract_phone: res.contract_phone,
          startTime,
          endTime,
          is_delivery: res.is_delivery,
          show_mobile: res.show_mobile,
          is_audit_goods: res.is_audit_goods,
          auto_sync_goods: res.auto_sync_goods,
          is_require_subdistrict: res.is_require_subdistrict,
          is_require_building: res.is_require_building,
          logo: res.logo,
          banner: res.banner,
          lng: res.lng || 116.397128,
          lat: res.lat || 39.916527,
          regions_id: res.regions_id,
          address: res.address,
          house_number: res.house_number,
          is_dada: res.is_dada == 1 || res.is_self_delivery,
          is_self_delivery: res.is_self_delivery,
          is_valid: res.is_valid,
          // show_salesperson: 0=关闭, 1=固定码, 2=导购
          // 前端开关: 0=关闭, 1=开启（再按 salesperson_type 区分企微/导购）
          // salesperson_type: 1=上传企微码, 2=导购码
          // 接口未返回或为 null 时须默认关闭，避免「是否展示导购」被误判为开启（兼容字符串 "1"/"2"）
          show_salesperson: showSalespersonOn,
          salesperson_type: salespersonTypeFromApi,
          fixed_salesperson_qrcode_url: res.fixed_salesperson_qrcode_url || '',
          freight_time: res.freight_time,
          business: res.business,
          is_ziti: res.is_ziti,
          offline_aftersales: res.offline_aftersales === 1,
          offline_aftersales_other: res.offline_aftersales_other === 1,
          is_refund_freight: res.is_refund_freight == 1,
          offline_aftersales_address: {
            name: res.offline_aftersales_address.name,
            regions_id: res.offline_aftersales_address.regions_id,
            address: res.offline_aftersales_address.address,
            area_code: offline_areaCode,
            mobile: offline_mobile,
            startTime: offline_startTime,
            endTime: offline_endTime
          },
          wdt_shop_no: res.wdt_shop_no,
          jst_shop_id: res.jst_shop_id,
          introduce: res.introduce
        }
        if (res.merchant_name) {
          this.pageQuery.reset(res.merchant_name)
        }
      }
      await loadMap()
      this.qqmapinit()
    },
    async qqmapinit() {
      const { lat, lng } = this.form
      const center = new qq.maps.LatLng(lat, lng)
      this.map = new qq.maps.Map(document.getElementById('qqmap_container'), {
        center: center,
        zoom: 13
      })
      this.mapMarker = new qq.maps.Marker({
        position: center,
        map: this.map
      })
    },
    handleCancel() {
      this.$router.go(-1)
    },
    async onFormSubmit() {
      try {
        await this.$refs['form'].handleSubmit()
        this.onFormSave()
      } catch (err) {
        console.error(err)
      }
    },
    async onFormSave() {
      this.submitLoading = true
      const { distributor_id, distributor_type } = this.$route.query
      const { offline_aftersales_address } = this.form
      const { regions_id, startTime, endTime } = offline_aftersales_address
      const [province, city, area] = getRegionNameById(regions_id, district)

      const params = {
        ...this.form,
        is_refund_freight: this.form.is_refund_freight ? 1 : 0,
        distributor_self: this.distributor_self,
        regions: getRegionNameById(this.form.regions_id, district),
        hour: `${this.form.startTime}-${this.form.endTime}`,
        offline_aftersales_address: {
          ...offline_aftersales_address,
          regions: [province, city, area],
          hours: `${startTime}-${endTime}`,
          province,
          city,
          area
        },
        offline_aftersales_distributor_id: this.$refs['refundGoodsStore'].finderData.map(
          (item) => item.distributor_id
        )
      }
      if (this.form.distribution_type == 0) {
        delete params.merchant_id
      } else {
        delete params.is_audit_goods
      }
      if (!params.distributor_category_id) {
        delete params.distributor_category_id
      }
      if (this.distributor_self == 1) {
        params.is_valid = 'true'
      }

      // 处理 show_salesperson 的值
      if (this.form.show_salesperson === 0) {
        // 关闭时，show_salesperson 为 0
        params.show_salesperson = 0
        delete params.fixed_salesperson_qrcode_url
        delete params.salesperson_type
      } else if (this.form.show_salesperson === 1) {
        // 开启时，根据 salesperson_type 设置 show_salesperson
        if (this.form.salesperson_type === 1) {
          // 上传企微码
          params.show_salesperson = 1
        } else if (this.form.salesperson_type === 2) {
          // 导购码
          params.show_salesperson = 2
          delete params.fixed_salesperson_qrcode_url
        }
        delete params.salesperson_type
      }

      if (this.form.is_dada) {
        if (this.form.is_self_delivery) {
          params.is_dada = 0
          params.is_self_delivery = true
        } else {
          params.is_dada = 1
          params.is_self_delivery = false
        }
      } else {
        params.is_dada = 0
        params.is_self_delivery = false
      }

      try {
        if (distributor_id) {
          await this.$api.marketing.updateDistributorInfo(distributor_id, params)
          this.submitLoading = false
          this.$message.success(this.$t('027707af.c83614'))
          this.openTranslate(distributor_id, ['name', 'address', 'introduce'], [this.form.name || '', this.form.address || '', this.form.introduce || ''])
        } else {
          const ids = (this.$refs['daoDianZiti']?.finderData || []).map((item) => item.id)
          const res = await this.$api.marketing.saveDistributorInfo({
            ...params,
            pickup_location: ids
          })
          this.submitLoading = false
          this.$message.success(this.$t('027707af.931e30'))
          // 创建/编辑保持一致：拿到新店铺 id 弹「同步翻译」弹框；取不到 id 时退回原行为
          const newDistributorId = (res && res.data && res.data.data && (res.data.data.distributor_id || res.data.data.id)) || 0
          if (newDistributorId) {
            this.openTranslate(newDistributorId, ['name', 'address', 'introduce'], [this.form.name || '', this.form.address || '', this.form.introduce || ''])
          } else if (!this.IS_DISTRIBUTOR()) {
            this.$router.go(-1)
          }
        }
      } catch (e) {
        this.submitLoading = false
      }
    },
    onTranslateDone() {
      if (!this.IS_DISTRIBUTOR()) {
        this.$router.go(-1)
      }
    },
    goBackTranslateList() {
      if (!this.IS_DISTRIBUTOR()) {
        this.$router.go(-1)
      }
    }
  }
}
</script>
