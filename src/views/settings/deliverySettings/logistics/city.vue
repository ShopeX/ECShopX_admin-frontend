<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card :header="$t('1a30494d.224e2c')">
    <el-row class="flex-center">
      <el-col :span="3">{{ $t('1a30494d.bcb155') }}</el-col>
      <el-col :span="6">
        <el-radio-group v-model="form.status" @change="statusChange">
          <el-radio label="0">{{ $t('1a30494d.653dd0') }}</el-radio>
          <el-radio label="1">{{ $t('1a30494d.762cd3') }}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="12">
        <div class="frm-tips">
          <el-alert type="info" :closable="false">
            <div slot="title">{{ $t('1a30494d.1fe9ff') }}</div>
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
          <el-form-item :label="$t('1a30494d.d3e5d7')" prop="source_id">
            <el-input v-model="form.source_id" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('1a30494d.0b66da')" prop="enterprise_name">
            <el-input v-model="form.enterprise_name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('1a30494d.400147')" prop="enterprise_address">
            <el-input v-model="form.enterprise_address" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mobile">
            <div class="cunstom_required padding-bottom">
              {{ $t('1a30494d.e6961a')
              }}<span class="frm-tips" style="display: inne-block; margin-left: 20px">{{
                $t('1a30494d.cfe546')
              }}</span>
            </div>
            <el-input v-model="form.mobile" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item prop="city_name">
            <div class="cunstom_required padding-bottom">
              {{ $t('1a30494d.1ea9c9')
              }}<span class="frm-tips" style="display: inne-block; margin-left: 20px">{{
                $t('1a30494d.ad13b9')
              }}</span>
            </div>
            <el-select v-model="form.city_name" filterable :placeholder="$t('1a30494d.708c9d')">
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
          <el-form-item :label="$t('1a30494d.986d36')" prop="contact_name">
            <el-input v-model="form.contact_name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('1a30494d.8ca6a4')" prop="contact_phone">
            <el-input v-model="form.contact_phone" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item :label="$t('1a30494d.6ab78f')" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="freight_type">
            <div class="padding-bottom">
              {{ $t('1a30494d.8b3191')
              }}<span class="frm-tips" style="display: inne-block; margin-left: 20px">{{
                $t('1a30494d.d70b38')
              }}</span>
            </div>
            <el-radio-group v-model="form.freight_type">
              <el-radio label="0">{{ $t('1a30494d.ec1ffa') }}</el-radio>
              <el-radio label="1">{{ $t('1a30494d.3f3e01') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="is_open">
            <div class="padding-bottom">
              {{ $t('1a30494d.780afe')
              }}<span class="frm-tips" style="display: inne-block; margin-left: 20px">{{
                $t('1a30494d.d70b38')
              }}</span>
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
              <div>{{ $t('1a30494d.e4302e') }}</div>
              <div>{{ $t('1a30494d.e07421') }}</div>
              <div>{{ $t('1a30494d.023886') }}</div>
            </div>
          </el-alert>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer-container">
      <el-button type="primary" @click="save">{{ $t('1a30494d.ed7526') }}</el-button>
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
      cityList: []
    }
  },
  computed: {
    rules() {
      return {
        source_id: [{ required: true, message: this.$t('1a30494d.f05c2c') }],
        enterprise_name: [{ required: true, message: this.$t('1a30494d.f7baff') }],
        enterprise_address: [{ required: true, message: this.$t('1a30494d.e5c27a') }],
        mobile: [{ required: true, message: this.$t('1a30494d.61fd9d') }],
        city_name: [{ required: true, message: this.$t('1a30494d.4b6bbe') }],
        contact_name: [{ required: true, message: this.$t('1a30494d.e30625') }],
        contact_phone: [{ required: true, message: this.$t('1a30494d.0e606b') }],
        email: [
          {
            required: true,
            message: this.$t('1a30494d.97e3ac'),
            pattern:
              /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
          }
        ]
      }
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
      }).then((res) => {
        console.log('saveCityLogisticsInfo', res)
        if (res.status === 200) {
          this.$message.success(this.$t('1a30494d.84a218'))
          return
        }
      })
    },
    getDetail: function () {
      getCityLogisticsInfo().then((res) => {
        const {
          data: { data }
        } = res
        //因为有数据重复所以需要进行处理
        this.cityList = data.city_list.map((item) => ({
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
