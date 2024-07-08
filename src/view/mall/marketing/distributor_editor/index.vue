<style lang="scss">
.distributor-form {
  .el-form-item__content {
    width: 220px;
    .el-select {
      width: 100%;
    }
  }
  .form-item-tip {
    font-size: 13px;
    color: #999;
    line-height: initial;
  }
  .line-height-40 {
    line-height: 40px;
  }
  .ziti-form {
    .el-form-item__content {
      width: auto !important;
    }
  }
}
</style>

<template>
  <div class="distributor-form">
    <!-- baseForm: {{ baseForm.distribution_type }} -->
    <el-card
      v-if="is_normal && baseForm.distributor_self == 0"
      class="el-card--normal"
      header="店铺类型"
    >
      <el-form ref="form" label-width="120px" :model="baseForm" :rules="rules">
        <el-form-item label="店铺类型" prop="distribution_type">
          <el-select v-model="baseForm.distribution_type" placeholder="请选择">
            <el-option
              v-for="item in distributionTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="baseForm.distribution_type === 1" label="所属商户" prop="merchant_id">
          <el-select
            v-model="baseForm.merchant_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商户名称"
            :remote-method="remoteMerchantList"
            :loading="merchantLoading"
          >
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <BaseForm ref="baseFormRef" />

    <ImageForm ref="imageFormRef" />

    <ShopForm ref="shopFormRef" />

    <DadaForm ref="dadaFormRef" @onChange="onChangeData" />

    <el-card class="el-card--normal" header="到店自提">
      <el-form class="ziti-form" label-width="120px">
        <el-form-item label="到店自提">
          <el-switch v-model="baseForm.is_ziti" />
          <div class="form-item-tip">
            启用到店自提功能后，买家下单时可选择下方地址自提，下单后你需要尽快将商品配送至指定自提点；下方自提地址共享该店铺库存。
          </div>
        </el-form-item>
        <el-form-item v-if="baseForm.is_ziti">
          <el-button type="text" @click="onSelectZiti">选择自提点</el-button>
          <!-- url="/pickuplocation/list" -->
          <!-- {{finderData}}, finderUrl: {{finderUrl}} -->
          <SpFinder
            ref="finder"
            no-selection
            :data="finderData"
            :url="finderUrl"
            :setting="setting"
            :hooks="{
              beforeSearch: beforeSearch,
              afterSearch: afterSearch
            }"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <ReturnGoodsForm ref="returnGoodsFormRef" />

    <IntroduceForm ref="introduceFormRef" />

    <div class="footer-container">
      <el-button size="large" @click="cancelSubmit"> 取消 </el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitItemsActionConfirm">
        {{ submitLoading ? '提交中' : '保存' }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { createSetting } from '@shopex/finder'
import { IS_DISTRIBUTOR, getRegionNameById } from '@/utils'
import district from '@/common/district.json'
import DadaForm from './components/DadaForm'
import FashionForm from './components/FashionForm'
import ImageForm from './components/ImageForm'
import ShopForm from './components/ShopForm'
import BaseForm from './components/BaseForm'
import IntroduceForm from './components/IntroduceForm.vue'
import ReturnGoodsForm from './components/ReturnGoodsForm.vue'

export default {
  components: {
    DadaForm,
    FashionForm,
    ImageForm,
    ShopForm,
    BaseForm,
    IntroduceForm,
    ReturnGoodsForm
  },
  provide() {
    return {
      content: this
    }
  },
  data() {
    return {
      submitLoading: false,
      disabled: false,
      dadaShow: false,
      baseForm: {
        merchant_id: '',
        // 店铺类型： 0=自营；1=加盟
        distribution_type: 0,
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
        datapass_block: 1,
        distributor_self: 0,
        logo: '',
        banner: '',
        lng: '',
        lat: '',
        regions_id: [],
        address: '',
        is_dada: false,
        business: '',
        is_ziti: false,
        introduce: '',
        offline_aftersales: false,
        offline_aftersales_distributor_id: [],
        offline_aftersales_other: false,
        offline_aftersales_address: {
          name: '',
          province: '',
          city: '',
          area: '',
          address: '',
          region: [],
          region_id: [],
          area_code: '',
          mobile: '',
          hours: ''
        }
      },
      setting: createSetting({
        actions: [
          {
            name: '移除',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                if (this.distributor_id) {
                  await this.$api.pickuplocation.unbindZitiLocation({
                    id: row.id,
                    rel_distributor_id: this.distributor_id
                  })
                  this.$refs['finder'].refresh()
                } else {
                  const index = this.finderData.findIndex((item) => item.id == row.id)
                  this.finderData.splice(index, 1)
                  this.zitiList = this.finderData
                  this.$nextTick(() => {
                    this.$refs['finder'].refresh()
                  })
                }
              }
            }
          }
        ],
        columns: [
          { name: '自提点名称', key: 'name' },
          {
            name: '地址',
            render: (h, { row }) =>
              h('span', {}, `${row.province}${row.city}${row.area}${row.address}`)
          },
          { name: '联系电话', key: 'contract_phone' }
        ]
      }),
      distributor_id: 0,
      rules: {
        merchant_id: [{ message: '请选择商户', required: true }]
      },
      distributionTypeList: [{ value: 0, label: '自营' }],
      merchantList: [],
      merchantLoading: false,
      zitiList: [],
      finderData: [],
      finderUrl: ''
    }
  },
  computed: {
    is_normal: function () {
      return (
        this.$store.getters.login_type === 'normal' || this.$store.getters.login_type === 'admin'
      )
    }
  },
  created() {
    const { distributor_id } = this.$route.query
    this.distributor_id = distributor_id
  },
  mounted() {
    if (!this.VERSION_STANDARD) {
      this.distributionTypeList.push({ value: 1, label: '加盟' })
    }

    this.getShopInfo()

    if (this.distributor_id) {
      this.finderUrl = '/pickuplocation/list'
      this.finderData = undefined
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        rel_distributor_id: this.distributor_id
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      this.zitiList = list
    },
    onChangeData(e) {
      this.dadaShow = e
    },
    async getShopInfo() {
      const { distributor_id } = this.$route.query
      if (distributor_id || IS_DISTRIBUTOR()) {
        const res = await this.$api.marketing.getDistributorInfo({ distributor_id })
        const [startTime, endTime] = res.hour.split('-')
        const [offline_startTime, offline_endTime] = res.offline_aftersales_address.hours
          ? res.offline_aftersales_address.hours.split('-')
          : ['', '']
        let area_code = ''
        let mobile = ''
        if (
          res.offline_aftersales_address.mobile &&
          res.offline_aftersales_address.mobile.indexOf('-') > -1
        ) {
          [area_code, mobile] = res.offline_aftersales_address.mobile
            ? res.offline_aftersales_address.mobile.split('-')
            : ['', '']
        } else {
          mobile = res.offline_aftersales_address.mobile
        }

        this.baseForm = {
          ...this.baseForm,
          distribution_type: res.distribution_type,
          // merchant_id: res.merchant_id,
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
          datapass_block: res.datapass_block,
          distributor_self: res.distributor_self,
          logo: res.logo,
          banner: res.banner,
          lng: res.lng,
          lat: res.lat,
          regions_id: res.regions_id,
          address: res.address,
          is_dada: res.is_dada,
          business: res.business,
          is_ziti: res.is_ziti,
          introduce: res.introduce,
          offline_aftersales_distributor_id: res.offline_aftersales_distributor_id,
          offline_aftersales: res.offline_aftersales === 1,
          offline_aftersales_other: res.offline_aftersales_other === 1,
          offline_aftersales_address: {
            name: res.offline_aftersales_address.name,
            province: res.offline_aftersales_address.province,
            city: res.offline_aftersales_address.city,
            area: res.offline_aftersales_address.area,
            address: res.offline_aftersales_address.address,
            regions: res.offline_aftersales_address.regions,
            regions_id: res.offline_aftersales_address.regions_id,
            area_code: area_code,
            mobile: mobile,
            hours: res.offline_aftersales_address.hours,
            startTime: offline_startTime,
            endTime: offline_endTime
          }
        }
        await this.remoteMerchantList(res.merchant_name)
        this.baseForm.merchant_id = res.merchant_id
      }

      if (!this.baseForm.lng) {
        this.$refs['shopFormRef'].qqmapinit(39.916527, 116.397128)
      } else {
        this.$refs['shopFormRef'].qqmapinit(this.baseForm.lat, this.baseForm.lng)
      }
    },
    async onSelectZiti() {
      const { data } = await this.$picker.zitilist({
        data: this.zitiList.map((item) => item.id)
      })

      console.log(this.zitiList.map((item) => item.id))
      console.log(data)

      if (this.distributor_id) {
        const ids = data.map((item) => item.id)
        await this.$api.pickuplocation.bindZitiLocation({
          id: ids,
          rel_distributor_id: this.distributor_id
        })
        this.$refs['finder'].refresh()
      } else {
        this.finderData = data
        this.zitiList = data
        this.$nextTick(() => {
          this.$refs['finder'].refresh()
        })
      }
    },
    cancelSubmit() {
      this.$router.go(-1)
    },
    formValidate() {
      return new Promise((resolve, reject) => {
        return this.$refs.form.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    async submitItemsActionConfirm() {
      try {
        if (this.is_normal && this.baseForm.distributor_self == 0) {
          await this.formValidate()
        }
        await this.$refs['baseFormRef'].validate()
        if (this.dadaShow) {
          await this.$refs['dadaFormRef'].validate()
        }
      } catch (e) {
        console.error(e)
        this.$message.error('店铺信息未填写完整')
        return
      }
      this.submitLoading = true
      const { distributor_id, distributor_type } = this.$route.query
      const aftersales = this.baseForm.offline_aftersales_address
      const aftersales_regions = getRegionNameById(aftersales.regions_id, district)
      const params = {
        ...this.baseForm,
        regions: getRegionNameById(this.baseForm.regions_id, district),
        hour: `${this.baseForm.startTime}-${this.baseForm.endTime}`,
        offline_aftersales_address: {
          ...aftersales,
          regions: aftersales_regions,
          hours: `${aftersales.startTime}-${aftersales.endTime}`,
          province: aftersales_regions[0],
          city: aftersales_regions[1],
          area: aftersales_regions[2]
        },
        offline_aftersales_distributor_id: this.$refs['returnGoodsFormRef'].finderData.map(
          (item) => item.distributor_id
        )
      }
      if (this.baseForm.distribution_type == 0) {
        delete params.merchant_id
      } else {
        delete params.is_audit_goods
      }
      // 总部自营自提点
      if (distributor_type == 'distributor_self') {
        params['distributor_self'] = 1
      }
      try {
        if (distributor_id) {
          await this.$api.marketing.updateDistributorInfo(distributor_id, params)
          this.submitLoading = false
          this.$message.success('修改店铺成功')
        } else {
          const ids = this.finderData.map((item) => item.id)
          await this.$api.marketing.saveDistributorInfo({
            ...params,
            pickup_location: ids
          })
          this.submitLoading = false
          this.$message.success('保存店铺成功')
        }
        if (!IS_DISTRIBUTOR()) {
          this.$router.go(-1)
        }
      } catch (e) {
        this.submitLoading = false
      }
    },
    async remoteMerchantList(name) {
      this.merchantLoading = true
      const { list } = await this.$api.marketing.getMerchantsList({
        pageSize: 10,
        page: 1,
        merchant_name: name
      })
      this.merchantList = list.map((item) => ({ value: item.id, label: item.merchant_name }))
      this.merchantLoading = false
    }
  }
}
</script>
