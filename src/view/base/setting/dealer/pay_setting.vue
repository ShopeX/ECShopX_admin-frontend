<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('23a1f83f.4ddb11') }}</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('23a1f83f.4e6442')" prop="fee_type">
              <el-select v-model="form.fee_type" style="width: 100%">
                <el-option
                  v-for="value in fee_type_options"
                  :key="value.code"
                  :label="value.name"
                  :value="value.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.fee_type" :span="12">
            <el-form-item :label="$t('23a1f83f.ea4fcb')" prop="wx_category">
              <el-select
                v-model="form.wx_category"
                :placeholder="$t('23a1f83f.708c9d')"
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
          <el-col v-if="form.wx_category" :span="12">
            <el-form-item :label="$t('23a1f83f.71eb6f')" prop="mer_type">
              <el-select
                v-model="form.mer_type"
                :placeholder="$t('23a1f83f.00a0a7')"
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
            <el-form-item :label="$t('23a1f83f.48df0d')" prop="model_type">
              <el-select
                v-model="form.model_type"
                :placeholder="$t('23a1f83f.708c9d')"
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
            <el-form-item :label="$t('23a1f83f.2560b3')" prop="select_regions_value">
              <el-cascader
                v-model="form.select_regions_value"
                style="width: 100%"
                :placeholder="$t('23a1f83f.075488')"
                :options="regions"
                @change="regionChange"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item label="微信小程序appid" prop="authorizer_appid">
              <el-input v-model="form.authorizer_appid" placeholder="" style="width: 100%" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item :label="$t('23a1f83f.6e640f')" prop="adapay_fee_mode">
              <el-select v-model="form.adapay_fee_mode" style="width: 100%">
                <el-option :label="$t('23a1f83f.75d29a')" value="I" />
                <el-option :label="$t('23a1f83f.6c1506')" value="O" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('23a1f83f.13022b')">
              <el-checkbox-group v-model="channelList">
                <el-checkbox
                  v-for="channel in payChannel"
                  :key="channel.value"
                  :label="channel.value"
                >
                  {{ $t(channel.nameKey) }}
                </el-checkbox>
              </el-checkbox-group>
              <div class="tip-msg">
                <p>{{ $t('23a1f83f.ede45b') }}</p>
                <p>{{ $t('23a1f83f.5af74a') }}</p>
                <p>{{ $t('23a1f83f.a6b214') }}</p>
                <p>{{ $t('23a1f83f.02ddfb') }}</p>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('23a1f83f.9f051a')">
              <el-input
                v-model="wx_lite.appid"
                :placeholder="$t('23a1f83f.d3f275')"
                :disabled="channelList.indexOf('wx_lite') < 0"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('23a1f83f.2ae195')">
              <el-input
                v-model="wx_pub.appid"
                :placeholder="$t('23a1f83f.a40032')"
                :disabled="channelList.indexOf('wx_pub') < 0"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('23a1f83f.036692')">
              <el-input
                v-model="wx_pub.path"
                :placeholder="$t('23a1f83f.85a8aa')"
                :disabled="channelList.indexOf('wx_pub') < 0"
                style="width: 520px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-form-item style="text-align: center; margin: 50px 0; margin-right: 130px">
        <el-button type="primary" @click="submitForm">{{ $t('23a1f83f.646db0') }}</el-button>
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
      :message="$t('23a1f83f.8af517')"
      @checkBoxConfirmHandle="checkBoxConfirmHandle"
      @checkBoxVisibleHandle="checkBoxVisibleHandle"
    />
  </div>
</template>

<script>
import districtOptions from '@/mixins/districtOptions'
import ResultCpn from './cpn/result.vue'
import loadingBtn from '@/components/loading-btn'
import { MaxRules, requiredRules } from './tools'
import checkBox from './cpn/checkBox.vue'
export default {
  mixins: [districtOptions],
  components: {
    ResultCpn,
    loadingBtn,
    checkBox
  },
  data() {
    return {
      allPro: '',
      allCity: [],
      allCountry: [],
      area: [],
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
        // authorizer_appid: '', //微信小程序appid
        select_regions_value: '',
        adapay_fee_mode: '', //小程序扣费方式
        add_value_list: {}
      },
      channelList: [],
      wx_lite: {
        appid: ''
      },
      wx_pub: {
        appid: '',
        path: ''
      },
      alipay: '',
      alipay_wap: '',
      alipay_qr: '',
      rules: {},
      payChannel: [
        { nameKey: '23a1f83f.439845', value: 'wx_lite' },
        { nameKey: '23a1f83f.44a38b', value: 'wx_pub' },
        { nameKey: '23a1f83f.0c5a62', value: 'alipay' },
        { nameKey: '23a1f83f.96d13c', value: 'alipay_wap' },
        { nameKey: '23a1f83f.6c03fb', value: 'alipay_qr' }
      ],
      isEcho: false // 是否回显
    }
  },
  computed: {
    rules() {
      const t = this.$t
      return {
        fee_type: requiredRules(t, '23a1f83f.4e6442', 'change', 'select'),
        model_type: requiredRules(t, '23a1f83f.48df0d', 'change', 'select'),
        mer_type: requiredRules(t, '23a1f83f.71eb6f', 'change', 'select'),
        select_regions_value: requiredRules(t, '23a1f83f.2560b3', 'change', 'select'),
        wx_category: requiredRules(t, '23a1f83f.ea4fcb', 'change', 'select'),
        adapay_fee_mode: requiredRules(t, '23a1f83f.6e640f', 'change', 'select')
      }
    }
  },
  watch: {
    'form.fee_type'(val) {
      this.getCategoryOptions({
        fee_type: val
      })
      if (this.isEcho && this.form.wx_category) {
        return
      }
      this.form.wx_category = ''
      this.form.mer_type = ''
    },
    'form.wx_category'(val) {
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
  mounted() {
    this.getOptions()
    this.getStepHandle()
  },
  methods: {
    // 查询开户步骤
    async getStepHandle() {
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
          title: this.$t('23a1f83f.bc049b')
        }
      }
    },
    nextPage() {
      this.$router.push('/applications/adapay/adapay_merchant/picture')
    },
    // 获取options
    async getOptions() {
      const { fee_type, mer_type, model_type } = await this.$api.adapay.pay_options()
      this.fee_type_options = fee_type
      this.mer_type_options = mer_type
      this.model_type_options = model_type
    },
    // 获取经营类目options
    async getCategoryOptions(obj) {
      const { list } = await this.$api.adapay.getCategoryList(obj)
      this.category_options = list
    },
    // 获取商户种类options
    async getMerTypeOptions(obj) {
      const { mer_type } = await this.$api.adapay.getMerTypeOption(obj)
      this.mer_type_options = mer_type
    },
    submitForm() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          if (this.channelList.indexOf('wx_lite') > -1 && this.wx_lite.appid == '') {
            return this.$message.error(this.$t('23a1f83f.e84ae6'))
          }
          if (this.channelList.indexOf('wx_pub') > -1) {
            if (this.wx_pub.appid == '') {
              return this.$message.error(this.$t('23a1f83f.d98d98'))
            } else if (this.wx_pub.path == '') {
              return this.$message.error(this.$t('23a1f83f.65dc9e'))
            }
          }
          this.checkBoxVisibleHandle()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    regionChange(val) {
      console.log(val)
      this.form.province_code = val[0]
      this.form.city_code = val[1]
      this.form.district_code = val[2]
    },
    // 重新填写
    async processedHandle() {
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
      const { wx_lite, wx_pub, alipay, alipay_wap, alipay_qr } = JSON.parse(
        MerchantResident.add_value_list
      )
      if (wx_lite) {
        this.wx_lite = wx_lite
        this.channelList.push('wx_lite')
      }
      if (wx_pub) {
        this.wx_pub = wx_pub
        this.channelList.push('wx_pub')
      }
      if (alipay) {
        this.alipay = alipay
        this.channelList.push('alipay')
      }
      if (alipay_wap) {
        this.alipay_wap = alipay_wap
        this.channelList.push('alipay_wap')
      }
      if (alipay_qr) {
        this.alipay_qr = alipay_qr
        this.channelList.push('alipay_qr')
      }

      console.log(this.form)
      this.processed = '未填'
    },
    /* ----------------------------------checkBox start----------------------------------- */
    async checkBoxConfirmHandle() {
      try {
        let add_value_list = {}
        if (this.channelList.indexOf('wx_lite') > -1) {
          add_value_list['wx_lite'] = this.wx_lite
        }
        if (this.channelList.indexOf('wx_pub') > -1) {
          add_value_list['wx_pub'] = this.wx_pub
        }
        if (this.channelList.indexOf('alipay') > -1) {
          add_value_list['alipay'] = 'alipay'
        }
        if (this.channelList.indexOf('alipay_wap') > -1) {
          add_value_list['alipay_wap'] = 'alipay_wap'
        }
        if (this.channelList.indexOf('alipay_qr') > -1) {
          add_value_list['alipay_qr'] = 'alipay_qr'
        }
        let params = {
          ...this.form,
          add_value_list: JSON.stringify(add_value_list)
        }
        console.log(params)
        const { status } = await this.$api.adapay.submitPay(params)
        if (status) {
          this.processed = '已填'
          this.currentStatus = {
            resultStatus: 'pending',
            time: '',
            info: '',
            title: this.$t('23a1f83f.bc049b')
          }
        }
        this.checkBoxVisibleHandle()
      } catch (error) {
        console.error(error)
        // this.$refs['loadingBtn'].closeLoading()
        this.checkBoxVisibleHandle()
      }
    },
    checkBoxVisibleHandle() {
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

<style lang="scss" scoped>
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
.tip-msg {
  font-size: 12px;
  color: #888;
  line-height: 20px;
}
</style>
