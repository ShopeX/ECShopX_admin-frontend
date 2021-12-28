<template>
  <div class="MerchantsEditor">
    <h5>选择商家类型</h5>
    <el-divider></el-divider>
    <el-select v-model="form.settled_type" placeholder="请选择" :disabled="disabled || editDisabled" >
      <el-option label="企业" value="enterprise"></el-option>
      <el-option label="个体户" value="soletrader"></el-option>
    </el-select>
    <el-divider></el-divider>
    <el-form :model="form" :rules="rules" ref="form" label-width="130px" v-if="form.settled_type">
      <!-- 企业信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">企业信息</span>
        </div>
        <section>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="企业全称" prop='merchant_name'>
                <el-input :disabled="disabled || editDisabled" v-model="form.merchant_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="统一社会信用代码" prop='social_credit_code_id'>
                <el-input :disabled="disabled || editDisabled" v-model="form.social_credit_code_id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在省市区" prop="regions_id">
                <el-cascader style="width: 100%" v-model="form.regions_id" :options="AreaJson" clearable
                  :props="{ value: 'value',label: 'label',children: 'children'}" @change="regionChange" :disabled="disabled">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址" prop='address'>
                <el-input v-model="form.address" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法人姓名" prop='legal_name'>
                <el-input v-model="form.legal_name" :disabled="disabled || editDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法人身份证号" prop='legal_cert_id'>
                <el-input v-model="form.legal_cert_id" :disabled="disabled || editDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法人手机号" prop='legal_mobile'>
                <el-input v-model="form.legal_mobile" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系邮箱" prop='email'>
                <el-input v-model="form.email" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </section>
      </el-card>
      <!-- 结算信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">结算账户信息 </span>
          <span style="fons-size:10px;color:#999"> （结算银行卡姓名要与法人姓名一致）</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="结算银行账户类型" prop="bank_acct_type">
              <el-radio-group v-model="form.bank_acct_type" :disabled="disabled || editDisabled">
                <el-radio label="1">对公</el-radio>
                <el-radio label="2">对私</el-radio>
              </el-radio-group>
              <el-tooltip
                :style="{ 'margin-left': 30 + 'px' }"
                content="提现到账银行卡账户类型"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.bank_acct_type =='2'">
            <el-form-item label="银行预留手机号" prop="bank_mobile" :disabled="disabled || editDisabled">
              <el-input v-model="form.bank_mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-else>
            <el-form-item label="结算银行卡所属银行" prop="bank_name">
              <div class="flex">
                <el-autocomplete
                  :disabled="disabled || editDisabled"
                  style="width: 100%"
                  prefix-icon="el-icon-search"
                  class="inline-input"
                  v-model="form.bank_name"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入选择内容"
                  @select="handleSelectBank"
                ></el-autocomplete>
              </div>
            </el-form-item>
          </el-col>


          <el-col :span="8">
            <el-form-item label="结算银行卡号" prop="card_id_mask">
              <el-input v-model="form.card_id_mask" :disabled="disabled || editDisabled"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-card>
      <!-- 入驻信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">入驻信息 </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
              <el-form-item label="商户类型" prop='merchant_type'>
                <el-select v-model="form.merchant_type" placeholder="请选择" style="width:100%" :disabled="disabled" @change="merchantType_change">
                    <el-option
                      v-for="item in MerchantsType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.merchant_type">
              <el-form-item label="经营范围" prop='merchant_type_id'>
                <el-select v-model="form.merchant_type_id" placeholder="请选择" style="width:100%" :disabled="disabled">
                    <el-option
                      v-for="item in WorkingGroupList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item label="审核商品" prop='audit_goods'>
                <el-select v-model="form.audit_goods" placeholder="请选择" :disabled="disabled">
                    <el-option label="是" value="true"></el-option>
                    <el-option label="否" value="false"></el-option>
                </el-select>
                <el-tooltip
                    :style="{ 'margin-left': 30 + 'px' }"
                    content="商户上架商品是否通过平台审核"
                    placement="top-end"
                    effect="light">
                    <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </el-form-item>
          </el-col>

        </el-row>
      </el-card>
      <!-- 证照信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">证照信息 </span>
        </div>
        <div class="wrap">
          <el-form-item prop="license_url" label-width='30px'>
            <div class="upload-box" @click="handleImgPicker('license_url')">
              <img  class="avatar" v-if="form.license_url" :src="form.license_url" />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p><span style='color:red'>*</span> 营业执照</p>
          </el-form-item>
          <el-form-item prop="legal_certid_front_url" label-width='30px'>
            <div class="upload-box" @click="handleImgPicker('legal_certid_front_url')">
              <img  class="avatar" v-if="form.legal_certid_front_url" :src="form.legal_certid_front_url" />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p><span style='color:red'>*</span> 法人手持身份证正面</p>
          </el-form-item>
          <el-form-item prop="legal_cert_id_back_url" label-width='30px'>
            <div class="upload-box" @click="handleImgPicker('legal_cert_id_back_url')">
              <img  class="avatar" v-if="form.legal_cert_id_back_url" :src="form.legal_cert_id_back_url" />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p><span style='color:red'>*</span> 法人手持身份证反面</p>
          </el-form-item>
          <el-form-item prop="bank_card_front_url" label-width='30px'>
            <div class="upload-box" @click="handleImgPicker('bank_card_front_url')">
              <img  class="avatar" v-if="form.bank_card_front_url" :src="form.bank_card_front_url" />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p><span style='color:red'>*</span> 结算银行卡正面照</p>
          </el-form-item>
          <el-form-item prop="contract_url" label-width='30px'>
            <div class="upload-box" @click="handleImgPicker('contract_url')">
              <img  class="avatar" v-if="form.contract_url" :src="form.contract_url" />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p>合同</p>
          </el-form-item>
        </div>
      </el-card>
      <!-- 账号信息 -->
      <el-card class="box-card" shadow="never" v-if="!$route.query.type">
        <div slot="header" class="clearfix">
          <span class="theme">账号信息 </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="生成账号" prop="createAccount">
              <el-tooltip
                :style="{ 'margin-right': 30 + 'px' }"
                content="商户网址、账号密码、店铺网址将发送至此手机号上，且商户账号为此号码"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <el-radio-group v-model="form.createAccount" :disabled="disabled">
                <el-radio label="1">法人手机号</el-radio>
                <el-radio label="2">其他</el-radio>
              </el-radio-group>
              <template v-if="form.createAccount =='2'" >
                <el-form-item prop="mobile">
                  <el-input placeholder="请填写手机号" v-model="form.mobile" :disabled="disabled"></el-input>
                </el-form-item>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="短信发送时间" prop="settled_succ_sendsms">
              <el-radio-group v-model="form.settled_succ_sendsms" :disabled="disabled">
                <el-radio label="1">立即发送</el-radio>
                <el-radio label="2">商家H5确认入驻协议后</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>
      </el-card>
      <template v-if="$route.query.type!='detail'">
        <el-form-item label-width='0px' style="text-align: center;margin-top:60px">
          <el-button type="primary" style="padding:10px 50px" @click="submitFn('form')">保存</el-button>
        </el-form-item>
      </template>
    </el-form>
    <!-- 图片选择 -->
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    ></imgPicker>
  </div>
</template>

<script>
import AreaJson from '@/common/district.json'
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
import { getMerchantsClassification,addTheBusinessman,getTheMerchant,updateTheMerchant } from '@/api/mall/marketing.js'
import imgPicker from '@/components/imageselect'

export default {
  data() {
    return {
      AreaJson: AreaJson,
      MerchantsType:[],
      WorkingGroupList:[],
      sort_order_by:'asc',
      pickerImgType:'',
      disabled:false,
      // 图片选择
      imgDialog: false,
      isGetImage: false,
      // form: {
      //   settled_type: 'enterprise',
      //   merchant_name:'张三的烧饼店',
      //   social_credit_code_id:'888898981209876543',
      //   regions_id:['140000','140100','140107'],
      //   regions:['山西省', '太原市', '杏花岭区'],
      //   address:'张村',
      //   legal_name:'张三',
      //   legal_cert_id:'343672981078223457',
      //   legal_mobile:'13909098888',
      //   email:'111@qq.com',
      //   // 结算信息
      //   bank_acct_type:'1',
      //   bank_name:'上海闵行上银村镇银行',
      //   bank_mobile:'13909098888',
      //   card_id_mask:'343672981078223457',
      //   // 入驻信息
      //   merchant_type:'贸易类x',
      //   merchant_type_id:'6',
      //   audit_goods:'true',
      //   // 证照信息
      //   license_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/b88a6bb01f3c5e34186f6e34ff120931kBaR0tsJbdL98htZIjoEfl3XJA6EPssU",
      //   legal_certid_front_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/b88a6bb01f3c5e34186f6e34ff1209315al9PCCnCwJvqhQteYPwZQ0fs6IYyB7g",
      //   legal_cert_id_back_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/b88a6bb01f3c5e34186f6e34ff12093158TnMCm9r4DdEOOaYOoyV7UvzQG1xr0t",
      //   bank_card_front_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/fb85f3523c2b1eecf9f1951348eb71aa8y1TKHdzE7AxmVrsFsopw2azEIicWVtP",
      //   contract_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/fb85f3523c2b1eecf9f1951348eb71aaUu6NzsGLwIGz0h1SuXfhgXI1jhQ0YV5g",
      //   // 账号信息
      //   createAccount:'1',
      //   mobile:'',
      //   settled_succ_sendsms:'2',// 1:立即 2:商家H5确认入驻协议后


      // },
      form: {
        settled_type: '',
        merchant_name:'',
        regions_id:[],
        regions:[],
        social_credit_code_id:'',
        address:'',
        legal_name:'',
        legal_cert_id:'',
        legal_mobile:'',
        email:'',
        // 结算信息
        bank_acct_type:'1',
        bank_name:'',
        bank_mobile:'',
        card_id_mask:'',
        // 入驻信息
        merchant_type:'',
        merchant_type_id:'',
        audit_goods:'',
        // 证照信息
        license_url:'',
        legal_certid_front_url:'',
        legal_cert_id_back_url:'',
        bank_card_front_url:'',
        contract_url:'',
        // 账号信息
        createAccount:'1',
        mobile:'',
        settled_succ_sendsms:'',// 1:立即 2:商家H5确认入驻协议后
      },
      rules: {
        merchant_name:[requiredRules('企业全称')],
        social_credit_code_id:[requiredRules('统一社会信用代码'),MaxRules(18)],
        regions_id:[requiredRules('所在省市区','change')],
        address:[requiredRules('详细地址')],
        legal_name:[requiredRules('法人姓名')],
        legal_cert_id:[requiredRules('法人身份证号'),MaxRules(18)],
        legal_mobile:[requiredRules('法人手机号'),MaxRules(11)],
        bank_acct_type:requiredRules('结算银行账户类型','change'),
        bank_name:requiredRules('结算银行卡所属银行','change'),
        bank_mobile:[requiredRules('银行预留手机号'),MaxRules('11')],
        card_id_mask:[requiredRules('结算银行卡号'),MaxRules('19')],
        merchant_type:[requiredRules('商户类型','change')],
        audit_goods:requiredRules('是否审核商品','change'),
        license_url:requiredRules('营业执照','change'),
        legal_certid_front_url:requiredRules('法人手持身份证正面','change'),
        legal_cert_id_back_url:requiredRules('法人手持身份证反面','change'),
        bank_card_front_url:requiredRules('结算银行卡正面照','change'),
        createAccount:requiredRules('生成账号','change'),
        mobile:requiredRules('手机号'),
        settled_succ_sendsms:requiredRules('短信发送时间','change')
      }
    }
  },
  watch:{
    'form.merchant_type':{
      immediate: true,
      handler(value){
        console.log(value);
        this.getWorkingGroupList(value)
        console.log(value);
      }

    },
    'form.legal_mobile'(value){
      if (value && this.form.createAccount=='1') {
        this.form.mobile = value;
      }else{
        this.form.mobile = '';
      }
    },
    'form.createAccount':{
      immediate: true,
      handler(val){
        if (val=='1' && this.form.legal_mobile) {
          this.form.mobile = this.form.legal_mobile;
        }else{
          this.form.mobile =''
        }
      }
    }
  },
  mounted(){
    this.getMerchantsTypeList();
    this.init();
  },
  methods:{
    merchantType_change(val){
      this.form.merchant_type = val;
      this.form.merchant_type_id = ''
      this.getWorkingGroupList(val)
      console.log(val);
    },
    async init(){
      console.log(this.$route);
      const { type,merchantId } = this.$route.query;
      if (type) {
        let action ='edit';
        if (type=='detail') {
          this.disabled = true;
          action = 'detail'
        }else{
          this.editDisabled = true
        }
        const result = await getTheMerchant({action},merchantId);
        this.form = result.data.data;
        this.form.regions_id = JSON.parse(this.form.regions_id);
        this.form.merchant_type = this.form.merchant_type_parent_name;
        this.form.audit_goods = JSON.stringify(this.form.audit_goods);
        this.form.regions = [this.form.province,this.form.city,this.form.area]
        console.log(result);
        
      }
      console.log(type);
    },
    submitFn(formName){
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { type,merchantId } = this.$route.query;
          const result = await addTheBusinessman(this.form,type=='editor'?merchantId:null); 
          if (result.data.data.status) {
            this.$message.success('保存成功');
            this.$router.go(-1)
          }
          console.log(result);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /* -------------------------图片选择------------------------- */
    pickImg({url}) {
      if (url && this.pickerImgType) { 
        const that = this.form;
        that[this.pickerImgType] = url;
        this.imgDialog = false
      }
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    handleImgPicker(pickerImgType) {
      if (!this.disabled) {
        this.pickerImgType = pickerImgType;
        this.imgDialog = true
        this.isGetImage = true
      }
    },
    /* -------------------------图片选择------------------------- */
    
    // 获取商户类型及经营范围
    async getMerchantsTypeList(){
      const result = await getMerchantsClassification({sort_order_by:this.sort_order_by});
      this.MerchantsType = result.data.data;
    },
    async getWorkingGroupList(name){
      const result = await getMerchantsClassification({sort_order_by:this.sort_order_by,name});
      this.WorkingGroupList = result.data.data[0].children;
    },
    // 结算所属银行
    async querySearch(queryString, cb) {
      const result = await this.$api.adapay.getBank({
        bank_name: this.form.bank_name
      })
      this.AllBank = result.data.data
      var restaurants = this.AllBank.map((item) => {
        return {
          value: item.bank_name,
          bank_code: item.bank_code,
          id: item.id
        }
      })
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      //调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelectBank(val) {
      console.log(val)
      this.form.bank_code = val.bank_code
      this.form.bank_name = val.value
    },
    regionChange(value){      
      console.log(value);
      var vals = this.getCascaderObj(value, AreaJson)
      if (vals.length > 0) {
        this.regions = [vals[0].label,vals[1].label,vals[2].label]
      } else {
        this.regions = []
      }
      console.log(this.regions);
    },
    getCascaderObj(val, opt) {
      return val.map(function (value) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
  },
  components:{
    imgPicker
  },
}
</script>

<style lang="scss" scoped>
.MerchantsEditor {
  .upload-box {
    width: 150px;
    height: 150px;
    align-items: center;
    display: flex;
    border: 2px dashed #ccc;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    i{
      font-size: 40px;
      color: #999;
    }
    img {
      width: 100%;
      max-height: 140px;
    }
    &:hover{
      border-color: #409EFF;
    }
  }
}
</style>

<style lang="scss">
.MerchantsEditor {
  padding-bottom: 50px;
  .theme {
    font-size: 15px;
    font-weight: 700;
  }
  .el-form-item__label {
    font-size: 12px;
    font-weight: 700;
  }
  .wrap {
    .el-form-item {
      float: left;
      margin-right: 30px;
      p {
        text-align: center;
        font-size: 12px;
      }
    }
    .row {
      text-align: center;
    }
  }
}
</style>