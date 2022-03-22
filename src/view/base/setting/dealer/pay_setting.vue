<template>
  <div class="zyk_pay_steeing">
    <el-form
      v-if="processed == '未填'"
      ref="ruleForm"
      :model="form"
      class="demo-ruleForm"
      label-width="130px"
      :rules="rules"
    >
      <el-card
        class="box-card"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>支付渠道信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="费率类型"
              prop="fee_type"
            >
              <el-select
                v-model="form.fee_type"
                style="width: 100%"
              >
                <el-option
                  v-for="value in fee_type_options"
                  :key="value.code"
                  :label="value.name"
                  :value="value.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-if="form.fee_type"
            :span="12"
          >
            <el-form-item
              label="经营类目"
              prop="wx_category"
            >
              <el-select
                v-model="form.wx_category"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="value in category_options"
                  :key="value.id"
                  :label="value.merchant_type_name"
                  :value="value.merchant_type_name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-if="form.wx_category"
            :span="12"
          >
            <el-form-item
              label="商户种类"
              prop="mer_type"
            >
              <el-select
                v-model="form.mer_type"
                placeholder="请选择活动区域"
                style="width: 100%"
              >
                <el-option
                  v-for="value in mer_type_options"
                  :key="value.code"
                  :label="value.name"
                  :value="value.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="入驻模式"
              prop="model_type"
            >
              <el-select
                v-model="form.model_type"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="value in model_type_options"
                  :key="value.code"
                  :label="value.name"
                  :value="value.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="地区"
              prop="select_regions_value"
            >
              <el-cascader
                v-model="form.select_regions_value"
                style="width: 100%"
                placeholder="请选择省市区"
                :options="area"
                @change="regionChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="微信小程序appid"
              prop="authorizer_appid"
            >
              <el-input
                v-model="form.authorizer_appid"
                placeholder=""
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="手续费扣费方式"
              prop="adapay_fee_mode"
            >
              <el-select
                v-model="form.adapay_fee_mode"
                style="width: 100%"
              >
                <el-option
                  label="内扣"
                  value="I"
                />
                <el-option
                  label="外扣"
                  value="O"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      
      <el-form-item style="text-align: center; margin: 50px 0; margin-right: 130px">
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交审核
        </el-button> 
      </el-form-item>
    </el-form>
    <Result-cpn
      v-if="processed == '已填'"
      :current-status="currentStatus"
      @nextPage="nextPage"
      @processedHandle="processedHandle"
    />
    <check-box
      :visible="checkBoxConfig.visible"
      :message="checkBoxConfig.message"
      @checkBoxConfirmHandle="checkBoxConfirmHandle"
      @checkBoxVisibleHandle="checkBoxVisibleHandle"
    />
  </div>
</template>

<script>
import district from '@/common/district.json'
import ResultCpn from './cpn/result.vue'
import loadingBtn from '@/components/loading-btn'
import { MaxRules, requiredRules } from './tools'
import checkBox from './cpn/checkBox.vue'
export default {
  components: {
    ResultCpn,
    loadingBtn,
    checkBox
  },
  data () {
    return {
      allPro: '',
      allCity: [],
      allCountry: [],
      area: district,
      fee_type_options: [],
      mer_type_options: [],
      model_type_options: [],
      category_options: [],
      processed: '',
      currentStatus: {
        resultStatus: '',
        time: '',
        info: '',
        title: ''
      },
      checkBoxConfig: {
        visible: false,
        message: '请确认信息无误！'
      },
      form: {
        fee_type: '', //费率类型
        wx_category: '', // 经营类目
        mer_type: '', // 商户种类
        model_type: '', // 入驻模式
        province_code: '', //省份编码
        city_code: '', //城市编码
        district_code: '', //区县编码
        authorizer_appid: '', //微信小程序appid
        select_regions_value: '',
        adapay_fee_mode: '' //小程序扣费方式
      },
      rules: {
        fee_type: requiredRules('费率类型', 'change'),
        model_type: requiredRules('入驻模式', 'change'),
        mer_type: requiredRules('商户种类', 'change'),
        select_regions_value: requiredRules('地区', 'change'),
        // city_code:{ required: true, message: '请选择', trigger: 'change' },
        // district_code:{ required: true, message: '请选择', trigger: 'change' },
        wx_category: requiredRules('经营类目', 'change'),
        authorizer_appid: [requiredRules('微信小程序appid'), MaxRules(40)],
        adapay_fee_mode: requiredRules('手续费扣费方式', 'change')
      },
      isEcho: false // 是否回显
    }
  },
  watch: {
    'form.fee_type' (val) {
      this.getCategoryOptions({
        fee_type: val
      })
      if (this.isEcho && this.form.wx_category) {
        return
      }
      this.form.wx_category = ''
      this.form.mer_type = ''
    },
    'form.wx_category' (val) {
      this.getMerTypeOptions({
        merchant_type_name: val
      })
      if (this.isEcho && this.form.mer_type) {
        this.isEcho = false
        return
      }
      this.form.mer_type = ''
    }
  },
  mounted () {
    this.getOptions()
    this.getStepHandle()
  },
  methods: {
    // 查询开户步骤
    async getStepHandle () {
      const { info } = await this.$api.adapay.getStep()
      const { MerchantResident } = info
      if (MerchantResident.length <= 0) {
        this.processed = '未填'
      } else {
        this.processed = '已填'
        this.currentStatus = {
          resultStatus: MerchantResident.status,
          time: MerchantResident.update_time,
          info: MerchantResident.wx_stat_msg,
          type: 'photo',
          title: '入驻'
        }
      }
    },
    nextPage () {
      this.$router.push('/setting/adapay_merchant/picture')
    },
    // 获取options
    async getOptions () {
      const { fee_type, mer_type, model_type } = await this.$api.adapay.pay_options()
      this.fee_type_options = fee_type
      this.mer_type_options = mer_type
      this.model_type_options = model_type
    },
    // 获取经营类目options
    async getCategoryOptions (obj) {
      const { list } = await this.$api.adapay.getCategoryList(obj)
      this.category_options = list
    },
    // 获取商户种类options
    async getMerTypeOptions (obj) {
      const { mer_type } = await this.$api.adapay.getMerTypeOption(obj)
      this.mer_type_options = mer_type
    },
    submitForm () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.checkBoxVisibleHandle()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    regionChange (val) {
      console.log(val)
      this.form.province_code = val[0]
      this.form.city_code = val[1]
      this.form.district_code = val[2]
    },
    // 重新填写
    async processedHandle () {
      const { info } = await this.$api.adapay.getStep()
      const { MerchantResident } = info
      this.isEcho = true
      this.form = { ...this.form, ...MerchantResident }
      this.form.select_regions_value = [
        this.form.province_code,
        this.form.city_code,
        this.form.district_code
      ]
      this.form.wx_category = MerchantResident.wx_category_name

      console.log(this.form)
      this.processed = '未填'
    },
    /* ----------------------------------checkBox start----------------------------------- */
    async checkBoxConfirmHandle () {
      try {
        const { status } = await this.$api.adapay.submitPay(this.form)
        if (status) {
          this.processed = '已填'
          this.currentStatus = {
            resultStatus: 'pending',
            time: '',
            info: '',
            title: '入驻'
          }
        }
        this.checkBoxVisibleHandle()
      } catch (error) {
        // this.$refs['loadingBtn'].closeLoading()
        this.checkBoxVisibleHandle()
      }
    },
    checkBoxVisibleHandle () {
      this.checkBoxConfig.visible = !this.checkBoxConfig.visible
      // if (this.checkBoxConfig.visible) {
      //   this.$refs['loadingBtn'].closeLoading()
      // }
    }
    /* ----------------------------------checkBox  end ----------------------------------- */
  }
}
</script>

<style lang="scss" scoped>
.zyk_pay_steeing {
  .flex {
    display: flex;
    align-items: center;
    i {
      margin-left: 10px;
      font-size: 18px;
    }
  }
  .tips {
    font-size: 12px;
    color: #888;
  }
}
</style>

<style lang="scss">
.zyk_pay_steeing {
  .clearfix span {
    font-weight: 700;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  input {
    height: 30px;
    line-height: 30px;
  }
  .el-row {
    margin-bottom: 0px;
  }
}
</style>
