<template>
  <section
    class="section section-white content-padded content-padded-bottom-80 distributorIndex"
    onload="init()"
  >
    <el-form
      ref="form"
      label-width="110px"
      :model="form"
      :rules="rules"
    >
      <el-card
        v-if="is_normal"
        header="店铺类型"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="店铺类型"
              prop="distribution_type"
            >
              <el-select
                v-model="form.distribution_type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in distributionTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              v-if="form.distribution_type === 1"
              label="所属商户"
              prop="merchant_id"
            >
              <el-select
                v-model="form.merchant_id"
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
          </el-col>
        </el-row>
      </el-card>
      <BaseForm
        ref="baseFormRef"
        :disabled="disabled"
        :distributor_type="distributor_type"
        :rules="rules"
        :external-form="form"
      />

      <ImageForm
        ref="imageFormRef"
        :external-form="form"
      />

      <ShopForm
        ref="shopFormRef"
        :external-form="form"
        @initForm="initForm"
        @onChangeData="handleChangeData"
      />

      <DadaForm
        ref="dadaFormRef"
        :rules="rules"
        :external-form="form"
        @onChangeData="handleChangeData"
      />
      <IntroduceForm
        ref="introduceFormRef"
        :external-form="form"
      />

      <!-- <FashionForm ref="fashionFormRef" :externalForm="form" /> -->

      <GlobalFooter>
        <div class="section-footer content-center">
          <el-button
            size="large"
            @click="cancelSubmit"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="submitItemsActionConfirm"
          >
            {{ submitLoading ? '提交中' : '保存' }}
          </el-button>
        </div>
      </GlobalFooter>
    </el-form>
  </section>
</template>
<script>
import { saveDistributor } from '@/api/marketing'
import { getMerchantsList } from '@/api/mall/marketing'
import DadaForm from './components/DadaForm'
import FashionForm from './components/FashionForm'
import ImageForm from './components/ImageForm'
import ShopForm from './components/ShopForm'
import BaseForm from './components/BaseForm'
import IntroduceForm from './components/IntroduceForm.vue'
import GlobalFooter from '@/components/global_footer'

export default {
  components: {
    GlobalFooter,
    DadaForm,
    FashionForm,
    ImageForm,
    ShopForm,
    BaseForm,
    IntroduceForm
  },
  data () {
    return {
      submitLoading: false,
      disabled: false,
      dadaShow: false,
      form2: {
        merchant_id: undefined,
        merchant_name: undefined
      },
      form: {
        lng: '',
        lat: '',
        distribution_type: 0,
        merchant_id: undefined
      },
      distributor_id: 0,
      distributor_type: '',
      rules: {
        shop_code: [
          {
            pattern: /^[A-Za-z0-9\-]+$/,
            message: '请输入正确格式的店铺号',
            required: true
          }
        ],
        name: [{ pattern: /^[*]*$/, message: '店铺名称必填', required: true }],
        contact: [{ message: '联系人必填', required: true }],
        mobile: [{ message: '手机必填', required: true }],
        dada_type: [{ message: '达达业务类型必填', required: true }]
      },
      distributionTypeList: [{ value: 0, label: '自营' }],
      merchantList: [],
      merchantLoading: false
    }
  },
  computed: {
    is_normal: function () {
      return (
        this.$store.getters.login_type === 'normal' || this.$store.getters.login_type === 'admin'
      )
    }
  },
  watch: {
    form: {
      handler: function (val) {
        if (val.merchant_id == 0) {
          this.form.merchant_id = undefined
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    if (!this.VERSION_STANDARD) {
      this.distributionTypeList.push({ value: 1, label: '加盟' })
    }
  },
  methods: {
    initForm (form) {
      console.log('===initForm===>', form)
      this.form2 = {
        merchant_id: form.merchant_id,
        merchant_name: form.merchant_name
      }
      this.form.merchant_id = form.merchant_name
    },
    handleChangeData (changeField, changeValue) {
      if (
        typeof changeValue === 'boolean' ||
        typeof changeValue === 'string' ||
        typeof changeValue === 'undefined'
      ) {
        this[changeField] = changeValue
      } else {
        this[changeField] = {
          ...this[changeField],
          ...changeValue
        }
      }
    },
    cancelSubmit () {
      this.$router.go(-1)
    },
    deleteParams (params, obj) {
      let result = obj
      for (let i = 0; i < params.length; i++) {
        delete result[params[i]]
      }
      return result
    },
    submitItemsActionConfirm () {
      console.log('=================1221=============')
      // debugger

      let nodada = {
        is_dada: undefined,
        business: undefined
      }

      console.log('submitItemsActionConfirm')
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          console.log('this.$refs.baseFormRef.form', this.$refs.baseFormRef.form)
          console.log('this.$refs.imageFormRef.form', this.$refs.imageFormRef.form)
          console.log('this.$refs.shopFormRef.form', this.$refs.shopFormRef.form)
          console.log('this.$refs.dadaFormRef.form', this.$refs.dadaFormRef.form)
          console.log('this.$refs.introduceFormRef.form', this.$refs.introduceFormRef.form)

          // console.log("this.$refs.fashionFormRef.form",this.$refs.fashionFormRef.form)

          const filterParams = {
            ...this.$refs.imageFormRef.form,
            ...this.deleteParams(
              [
                'name',
                'logo',
                'contact',
                'mobile',
                'contract_phone',
                'is_audit_goods',
                'is_ziti',
                'banner'
              ],
              this.$refs.shopFormRef.form
            ),
            ...this.$refs.dadaFormRef.form,
            // ...this.$refs.fashionFormRef.form,
            ...this.$refs.introduceFormRef.form,
            hour: this.$refs.baseFormRef.startTime + '-' + this.$refs.baseFormRef.endTime,
            distributor_id: this.distributor_id,
            distribution_type: this.form.distribution_type,
            merchant_id:
              this.form.merchant_id == this.form2.merchant_name
                ? this.form2.merchant_id
                : this.form.merchant_id,
            ...this.$refs.baseFormRef.form
          }

          if (filterParams.distribution_type == 1) {
            delete filterParams.is_audit_goods
          }

          console.log('filterParams=============', filterParams)
          if (this.dadaShow) {
            nodada = {
              is_dada: this.$refs.dadaFormRef.form.is_dada,
              business: this.$refs.dadaFormRef.form.business
            }
          }
          saveDistributor({
            ...filterParams,
            ...nodada
          })
            .then((res) => {
              this.submitLoading = false
              this.$message({ type: 'success', message: '保存店铺成功' })
              console.log('====', this.$store.getters.login_type)
              if (this.$store.getters.login_type != 'distributor') {
                this.$router.go(-1)
              }
            })
            .catch((error) => {
              this.submitLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getMerchantsList: async (merchant_name) => {
      const list = await getMerchantsList({
        pageSize: 10,
        page: 1,
        merchant_name
      })
      return list
    },
    remoteMerchantList: async function (name) {
      this.merchantLoading = true
      const {
        data: {
          data: { list }
        }
      } = await this.getMerchantsList(name)
      this.merchantList = list.map((item) => ({ value: item.id, label: item.merchant_name }))
      this.merchantLoading = false
    }
  }
}
</script>

<style lang="scss">
.distributorIndex {
  .el-card__header {
    // padding: 8px 20px;
  }
}
.bm-view {
  width: 100%;
  height: 300px;
}
#qqmap_rslist {
  border-right: 1px solid #e7e7eb;
}
#qqmap_container {
  float: left;
  width: 800px;
  height: 400px;
}
.section {
  &.content-padded-bottom-80 {
    padding-bottom: 80px;
  }
}
</style>
