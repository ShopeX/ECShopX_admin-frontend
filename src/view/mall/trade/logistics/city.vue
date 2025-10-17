<template>
  <el-card header="配置">
    <el-row class="flex-center">
      <el-col :span="3"> 达达同城配 </el-col>
      <el-col :span="6">
        <el-radio-group v-model="form.status" @change="statusChange">
          <el-radio label="0"> 未开通过 </el-radio>
          <el-radio label="1"> 已开通过 </el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="12">
        <div class="frm-tips">
          <el-alert type="info" :closable="false">
            <div slot="title">是否用该企业在新达达平台注册过账户，如果注册过请选择已开通过</div>
          </el-alert>
        </div>
      </el-col>
    </el-row>

    <el-form
      ref="form"
      :model="form"
      :label-position="labelPosition"
      label-width="80px"
      :rules="rules"
    >
      <el-row :gutter="20">
        <el-col v-if="form.status === '1'" :span="8">
          <el-form-item label="达达商户ID" prop="source_id">
            <el-input v-model="form.source_id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业全称" prop="enterprise_name">
            <el-input v-model="form.enterprise_name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业地址" prop="enterprise_address">
            <el-input v-model="form.enterprise_address" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mobile">
            <div class="cunstom_required padding-bottom">
              商户手机号<span class="frm-tips" style="display: inne-block; margin-left: 20px"
                >注册商户手机号,用于登录商户后台</span
              >
            </div>
            <el-input v-model="form.mobile" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item prop="city_name">
            <div class="cunstom_required padding-bottom">
              商户城市名称<span class="frm-tips" style="display: inne-block; margin-left: 20px"
                >商户城市名称(如,上海)</span
              >
            </div>
            <el-select v-model="form.city_name" filterable placeholder="请选择">
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人姓名" prop="contact_name">
            <el-input v-model="form.contact_name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人电话" prop="contact_phone">
            <el-input v-model="form.contact_phone" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="freight_type">
            <div class="padding-bottom">
              运费承担方<span class="frm-tips" style="display: inne-block; margin-left: 20px"
                >买家承担请保证商品规格数据准确性</span
              >
            </div>
            <el-radio-group v-model="form.freight_type">
              <el-radio label="0"> 商家承担 </el-radio>
              <el-radio label="1"> 买家承担 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="is_open">
            <div class="padding-bottom">
              是否开启<span class="frm-tips" style="display: inne-block; margin-left: 20px"
                >买家承担请保证商品规格数据准确性</span
              >
            </div>
            <el-switch
              v-model="form.is_open"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="form.status === '1'" :span="16">
          <el-alert type="info" :closable="false">
            <div slot="title">
              <div>1. 请输入您再新达达平台申请的商户信息，达达商户ID请务必保证填写正确；</div>
              <div>2. 提交后请您到新达达商户后台关注开发者绑定申请；</div>
              <div>
                3. 收到“商派软件有限公司”开发者绑定通知后，请您审核通过，通过完成后即可使用。
              </div>
            </div>
          </el-alert>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer-container">
      <el-button type="primary" @click="save"> 保存配置 </el-button>
    </div>
  </el-card>
</template>

<script>
import GlobalFooter from '@/components/global_footer'
import { getCityLogisticsInfo, saveCityLogisticsInfo } from '@/api/logistics'

export default {
  components: {
    GlobalFooter
  },
  data() {
    return {
      labelPosition: 'top',
      form: {
        //是否开通同城配
        status: '0',
        is_open: 0,
        enterprise_name: '',
        enterprise_address: '',
        mobile: '',
        source_id: '',
        freight_type: ''
      },
      rules: {
        source_id: [{ required: true, message: '请输入达达商户ID' }],
        enterprise_name: [{ required: true, message: '请输入企业全称' }],
        enterprise_address: [{ required: true, message: '请输入企业地址' }],
        mobile: [{ required: true, message: '请输入商户手机号' }],
        city_name: [{ required: true, message: '请输入商户城市名称' }],
        contact_name: [{ required: true, message: '请输入联系人姓名' }],
        contact_phone: [{ required: true, message: '请输入联系人电话' }],
        email: [
          {
            required: true,
            message: '请输入正确的邮箱',
            pattern:
              /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
          }
        ]
      },
      cityList: []
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    statusChange: function (value) {
      console.log('statusChange', value)
      if (value === '0') {
        //this.form.source_id = "";
      }
    },
    save: function () {
      saveCityLogisticsInfo({
        ...this.form,
        city_list: undefined,
        business_list: undefined,
        source_id: this.form.status === '0' ? undefined : this.form.source_id
      }).then(res => {
        console.log('saveCityLogisticsInfo', res)
        if (res.status === 200) {
          this.$message.success('同城配设置成功！')
          return
        }
      })
    },
    getDetail: function () {
      getCityLogisticsInfo().then(res => {
        const {
          data: { data }
        } = res
        //因为有数据重复所以需要进行处理
        this.cityList = data.city_list.map(item => ({
          label: item.cityName,
          value: item.cityName
        }))
        if (data.contact_name) {
          this.form = data
        }

        // this.cityList=city_list.reduce((total,current,index)=>{
        //   let obj={value:current.cityCode,label:current.cityName}
        //   let totalValue=total.map(item=>item.value);
        //   if(totalValue.indexOf(obj.value)>-1){
        //     return total
        //   }else{
        //     return total.concat(obj)
        //   }
        // },[])
      })
    }
  }
}
</script>

<style scoped lang="scss">
.cunstom_required {
  &:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.padding-bottom {
  padding-bottom: 10px;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>
