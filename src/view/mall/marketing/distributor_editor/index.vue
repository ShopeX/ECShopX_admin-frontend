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
  .ziti-form {
    .el-form-item__content {
      width: auto !important;
    }
  }
}
</style>

<template>
  <div class="distributor-form">
    <!-- baseForm: {{ baseForm }} -->
    <el-card v-if="is_normal" class="el-card--normal" header="店铺类型">
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

    <DadaForm ref="dadaFormRef" />

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
          <SpFinder
            ref="finder"
            no-selection
            url="/pickuplocation/list"
            :setting="setting"
            :hooks="{
              beforeSearch: beforeSearch,
              afterSearch: afterSearch
            }"
          />
        </el-form-item>
      </el-form>
    </el-card>

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

export default {
  components: {
    DadaForm,
    FashionForm,
    ImageForm,
    ShopForm,
    BaseForm,
    IntroduceForm
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
        introduce: ''
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
                await this.$api.pickuplocation.unbindZitiLocation({
                  id: row.id,
                  rel_distributor_id: this.distributor_id
                })
                this.$refs['finder'].refresh()
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
      zitiList: []
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
    async getShopInfo() {
      const { distributor_id } = this.$route.query
      if (distributor_id || IS_DISTRIBUTOR) {
        const res = await this.$api.marketing.getDistributorInfo({ distributor_id })
        const [startTime, endTime] = res.hour.split('-')
        this.baseForm = {
          ...this.baseForm,
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
          introduce: res.introduce
        }
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
      const ids = data.map((item) => item.id)
      await this.$api.pickuplocation.bindZitiLocation({
        id: ids,
        rel_distributor_id: this.distributor_id
      })
      this.$refs['finder'].refresh()
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
      await this.formValidate()
      await this.$refs['baseFormRef'].validate()
      await this.$refs['dadaFormRef'].validate()
      this.submitLoading = true
      const { distributor_id } = this.$route.query
      const params = {
        ...this.baseForm,
        regions: getRegionNameById(this.baseForm.regions_id, district),
        hour: `${this.baseForm.startTime}-${this.baseForm.endTime}`
      }
      if (this.baseForm.distribution_type == 0) {
        delete params.merchant_id
      } else {
        delete params.is_audit_goods
      }
      try {
        if (distributor_id) {
          await this.$api.marketing.updateDistributorInfo(distributor_id, params)
          this.submitLoading = false
          this.$message.success('修改店铺成功')
        } else {
          await this.$api.marketing.saveDistributorInfo(params)
          this.submitLoading = false
          this.$message.success('保存店铺成功')
        }
        if (!IS_DISTRIBUTOR) {
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
