<style lang="scss" scoped>
.merchant-store ::v-deep .el-input-number {
  line-height: 34px !important;
  margin: 0 10px;
}
.merchant-store {
  .el-form-item {
    width: 360px;
  }
  .el-form-item__content {
    min-width: 260px;
  }
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
    .el-button {
      float: right;
      margin-top: 10px;
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
<template>
  <div class="merchant-store">
    <SpForm
      ref="form"
      v-model="form"
      show-message
      label-width="100px"
      :form-list="formList"
      :submit="false"
    />

    <div class="footer-container">
      <el-button @click.native="handleCancel"> 取消</el-button>
      <el-button
        v-if="!VERSION_STANDARD || (!IS_DISTRIBUTOR() && VERSION_STANDARD)"
        type="primary"
        :loading="submitLoading"
        @click="onFormSubmit"
      >
        {{ submitLoading ? '提交中' : '保存' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { isObject, isArray, isEmpty, getRegionNameById } from '@/utils'
import Pages from '@/utils/pages'
import district from '@/common/district.json'
import fetchJsonp from '@/utils/axiosJsonp'
import { axios } from '@/utils/fetch'
import DaoDianZiti from './components/DaoDianZiti'
import RefundGoodsAddress from './components/RefundGoodsAddress'
import RefundGoodsStore from './components/RefundGoodsStore'
export default {
  data() {
    let distributionTypeOptions = [
      {
        title: '自营',
        value: 0
      }
    ]
    if (!this.VERSION_STANDARD) {
      distributionTypeOptions.push({
        title: '加盟',
        value: 1
      })
    }
    return {
      form: {
        distribution_type: 0, // 店铺类型： 0=自营；1=加盟
        merchant_id: '',
        shop_code: '',
        name: '',
        contact: '',
        mobile: '',
        contract_phone: '',
        startTime: '',
        endTime: '',
        is_delivery: false,
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
        is_refund_freight:false,
        introduce: ''
      },
      offline_freight_status:false,
      formList: [
        {
          label: '店铺类型',
          type: 'group',
          isShow: ({ key }, value) => this.IS_ADMIN() && this.distributor_self == 0
        },
        {
          label: '店铺类型',
          key: 'distribution_type',
          type: 'select',
          clearable: false,
          options: distributionTypeOptions,
          isShow: ({ key }, value) => this.IS_ADMIN() && this.distributor_self == 0
        },
        {
          label: '所属商户',
          key: 'merchant_id',
          type: 'select',
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
                placeholder='输入商户名称搜索'
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
              callback(new Error('请选择商户'))
            } else {
              callback()
            }
          }
        },
        {
          label: '基础信息',
          type: 'group'
        },
        {
          label: '店铺号',
          key: 'shop_code',
          type: 'input',
          display: 'inline',
          placeholder: '请输入店铺号(字母、数字)',
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('店铺号不能为空'))
            } else if (!/^[A-Za-z0-9\-]+$/.test(value)) {
              callback(new Error('请输入字母、数字'))
            } else {
              callback()
            }
          }
        },
        {
          label: '店铺名称',
          key: 'name',
          type: 'input',
          display: 'inline',
          placeholder: '请输入店铺名称',
          required: true,
          message: '店铺名称不能为空'
        },
        {
          label: '联系人姓名',
          key: 'contact',
          type: 'input',
          display: 'inline',
          disabled: () => this.datapass_block == 1,
          placeholder: '请输入联系人姓名',
          required: true,
          message: '联系人不能为空'
        },
        {
          label: '联系方式',
          key: 'mobile',
          type: 'input',
          display: 'inline',
          disabled: () => this.datapass_block == 1,
          placeholder: '请输入联系人手机号',
          required: true,
          message: '联系方式不能为空'
        },
        {
          label: '固定座机',
          key: 'contract_phone',
          type: 'input',
          display: 'inline',
          placeholder: '请输入联系人座机号'
        },
        {
          label: '经营时间',
          // key: 'contract_phone',
          display: 'inline',
          component: ({ key }, value) => {
            return (
              <div>
                <el-time-select
                  v-model={value['startTime']}
                  class='start-time'
                  placeholder='起始时间'
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
                  placeholder='结束时间'
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
          label: '是否快递',
          key: 'is_delivery',
          type: 'switch',
          display: 'inline'
        },
        {
          label: '审核商品',
          key: 'is_audit_goods',
          type: 'switch',
          display: 'inline',
          width: '360px',
          tip: '开启后，店铺添加的自有商品，需要平台审核通过后才可以上架',
          isShow: ({ key }, value) => !this.VERSION_STANDARD && value.distribution_type == 0
        },
        {
          label: '同步商品',
          key: 'auto_sync_goods',
          type: 'switch',
          display: 'inline',
          tip: '自动同步商品至店铺',
          isShow: ({ key }, value) =>
            this.VERSION_STANDARD && !this.IS_DISTRIBUTOR() && this.distributor_self == 0
        },
        {
          label: '街道居委',
          key: 'is_require_subdistrict',
          type: 'switch',
          display: 'inline',
          tip: '下单是否需要选择街道居委'
        },
        {
          label: '楼号房号',
          key: 'is_require_building',
          type: 'switch',
          display: 'inline',
          tip: '下单是否需要填写楼号房号'
        },
        {
          label: '店铺图片',
          type: 'group',
          tip: '（只能上传jpg/png文件，且不超过2M）'
        },
        {
          label: '店铺Logo',
          key: 'logo',
          display: 'inline',
          component: ({ key }, value) => {
            return <SpImagePicker v-model={value[key]} />
          }
        },
        {
          label: '店铺背景',
          key: 'banner',
          display: 'inline',
          component: ({ key }, value) => {
            return <SpImagePicker v-model={value[key]} />
          }
        },
        {
          label: '店铺位置',
          type: 'group',
          tip: '（店铺定位后保存店铺经纬度，才可以开启自提，否则店铺不支持自提功能）'
        },
        {
          label: '店铺经纬度',
          component: ({ key }, value) => {
            return (
              <div class='lng-lat-block'>
                <el-input v-model={value.lng} readonly placeholder='经度' />
                <span class='separator'>-</span>
                <el-input v-model={value.lat} readonly placeholder='纬度' />
              </div>
            )
          }
        },
        {
          label: '地理位置',
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
                  placeholder='请输入详细地址（去除省市县）'
                />
                <el-input v-model={value['house_number']} placeholder='门牌号' />
                <el-button type='primary' on-click={this.searchKeyword}>
                  搜索定位
                </el-button>
              </div>
            )
          },
          validator: (rule, value, callback) => {
            if (!this.form.address) {
              callback(new Error('详细地址不能为空'))
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
          label: '送货上门',
          type: 'group',
          tip: '（需先选择店铺地理位置，系统根据店铺位置判断该地区是否支持送货上门）',
          isShow: this.dadaEnable
        },
        {
          label: '送货上门',
          key: 'is_dada',
          type: 'switch',
          width: 'auto',
          tip: '开启后有店铺订单时需要改店铺人员手动接单，接单后系统会自动在达达/闪送平台下单',
          isShow: this.dadaEnable
        },
        {
          label: '送货方式',
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
              <el-radio v-model={value[key]} label={true}>商家自配送</el-radio>
              <el-radio v-model={value[key]} label={false} disabled={!this.dadaEnable}>达达同城配</el-radio>
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
                立即配送，预计
                <el-input-number v-model={value[key]} placeholder='请输入内容' step={1} min={1} />
                小时后送达（下单时间往后延多少小时）
              </div>
            )
          }
        },
        {
          label: '业务类型',
          key: 'business',
          type: 'select',
          options: [],
          isShow: ({ key }, value) => !value.is_self_delivery && value.is_dada,
          validator: (rule, value, callback) => {
            console.log('value:', value)
            if (!this.form.is_self_delivery && value.is_dada) {
              if (!value) {
                callback(new Error('业务类型必填'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        },
        {
          label: '到店自提',
          type: 'group'
        },
        {
          label: '到店自提',
          key: 'is_ziti',
          type: 'switch',
          width: 'auto',
          tip: '启用到店自提功能后，买家下单时可选择下方地址自提，下单后你需要尽快将商品配送至指定自提点；下方自提地址共享该店铺库存。'
        },
        {
          label: '',
          width: '1000px',
          component: ({ key }, value) => <DaoDianZiti ref='daoDianZiti' />,
          isShow: ({ key }, value) => value.is_ziti
        },
        {
          label: '到店退货',
          type: 'group'
        },
        {
          label: '本店订单',
          key: 'offline_aftersales',
          type: 'switch',
          width: 'auto',
          tip: '启用后本店订单买家发起退货退款申请时可选择到店退货，关闭时本店订单仅可使用快递退货；商家发起的售后订单不受此规则限制。'
        },
        {
          label: '本店退货点',
          width: 'auto',
          component: ({ key }, value) => (
            <RefundGoodsAddress v-model={value['offline_aftersales_address']} />
          )
        },
        {
          label: '可退货店铺',
          width: '1000px',
          component: ({ key }, value) => (
            <RefundGoodsStore
              v-model={value['offline_aftersales_address']}
              ref='refundGoodsStore'
            />
          )
        },
        {
          label: '其他店铺订单',
          key: 'offline_aftersales_other',
          type: 'switch',
          width: 'auto',
          tip: '启用后其他店铺在设置可退货店铺时可选择本店（即本店可接收其他店铺订单到店退货）；商家发起的售后订单不受此规则限制。'
        },
        //平台开了才能操作，否则置灰
        {
          label: '消费者退货退款时可退运费',
          key: 'is_refund_freight',
          type: 'switch',
          disabled: () => this.offline_freight_status,
          width: 'auto',
          tip: '启用后本店订单买家发起退货退款时可退运费。'
        },
        {
          label: '店铺介绍',
          type: 'group'
        },
        {
          label: '店铺介绍',
          key: 'introduce',
          type: 'textarea',
          placeholder: '',
          width: '1000px'
        }
      ],
      merchantList: [],
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
    const { distributor_type } = this.$route.query
    this.pageQuery = new Pages({
      pageSize: 10,
      fetch: this.getMerchantList
    })
    this.distributor_self = distributor_type === 'distributor_self' ? 1 : 0
    console.log(process.env.VUE_APP_LOCAL_DELIVERY_DIRVER)
    if (process.env.VUE_APP_LOCAL_DELIVERY_DIRVER == 'shansong') {
      this.getShansongInfo()
    } else {
      this.getDadaInfo()
    }
    this.getStoreInfo()
    this.getOrderSetting()
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
        this.$message.error('请选择地区')
        return
      }
      if (!address) {
        this.$message.error('请输入具体位置')
        return
      }
      const [province, city, country] = getRegionNameById(regions_id, district)

      const { location } = await fetchJsonp({
        method: 'get',
        url: `https://apis.map.qq.com/ws/geocoder/v1?address=${province}${city}${country}${address}&key=${process.env.VUE_APP_MAP_KEY}&output=jsonp`
      })
      this.form.lng = location.lng
      this.form.lat = location.lat
      const latlng = new qq.maps.LatLng(location.lat, location.lng)
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
    async getStoreInfo() {
      const { distributor_id } = this.$route.query
      if (distributor_id || this.IS_DISTRIBUTOR()) {
        const res = await this.$api.marketing.getDistributorInfo({ distributor_id })
        const [startTime, endTime] = res.hour.split('-')

        // 退货点区号、手机号
        // 退货点营业时间段
        let offline_startTime = '',
          offline_endTime = '',
          offline_areaCode = '',
          offline_mobile = ''
        if (isObject(res.offline_aftersales_address)) {
          const { hours, mobile } = res.offline_aftersales_address
          let [t1, t2] = hours.split('-')
          offline_startTime = t1
          offline_endTime = t2
          if (mobile.indexOf('-') > -1) {
            let [code, m] = res.offline_aftersales_address.mobile.split('-')
            offline_areaCode = code
            offline_mobile = m
          } else {
            offline_mobile = mobile
          }
        }
        this.datapass_block = res.datapass_block
        this.form = {
          distribution_type: res.distribution_type,
          merchant_id: res.merchant_id,
          shop_code: res.shop_code,
          name: res.name,
          contact: res.contact,
          mobile: res.mobile,
          contract_phone: res.contract_phone,
          startTime,
          endTime,
          is_delivery: res.is_delivery,
          is_audit_goods: res.is_audit_goods,
          auto_sync_goods: res.auto_sync_goods,
          is_require_subdistrict: res.is_require_subdistrict,
          is_require_building: res.is_require_building,
          logo: res.logo,
          banner: res.banner,
          lng: res.lng,
          lat: res.lat,
          regions_id: res.regions_id,
          address: res.address,
          house_number: res.house_number,
          is_dada: res.is_dada == 1 || res.is_self_delivery,
          is_self_delivery: res.is_self_delivery,
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
          introduce: res.introduce
        }
        if (res.merchant_name) {
          this.pageQuery.reset(res.merchant_name)
        }
      }
      this.$nextTick(() => {
        this.qqmapinit()
      })
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
        is_refund_freight:this.form.is_refund_freight ? 1:0,
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
          this.$message.success('修改店铺成功')
        } else {
          const ids = this.$refs['daoDianZiti'].finderData.map((item) => item.id)
          await this.$api.marketing.saveDistributorInfo({
            ...params,
            pickup_location: ids
          })
          this.submitLoading = false
          this.$message.success('保存店铺成功')
        }
        if (!this.IS_DISTRIBUTOR()) {
          this.$router.go(-1)
        }
      } catch (e) {
        this.submitLoading = false
      }
    }
  }
}
</script>
