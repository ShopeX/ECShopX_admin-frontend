<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('8ab980b4.d5df93')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" @click="save"> {{ $t('8ab980b4.56df61') }} </el-button>
      </div>
    </template>
    <div class="section section-white">
      <el-form ref="form" :model="form" label-position="left" label-width="120px">
        <div class="section-body">
          <el-form-item :label="$t('8ab980b4.00e156')">
            <el-switch
              v-model="form.customer_switch"
              :width="50"
              active-value="true"
              inactive-value="false"
              :active-text="$t('8ab980b4.cc42dd')"
              :inactive-text="$t('8ab980b4.b15d91')"
              active-color="#13ce66"
            />
          </el-form-item>
          <el-form-item :label="$t('8ab980b4.d63ad0')">
            <el-switch
              v-model="form.withdraw_bank.alipay"
              :width="50"
              active-value="true"
              inactive-value="false"
              :active-text="$t('8ab980b4.cc42dd')"
              :inactive-text="$t('8ab980b4.b15d91')"
              active-color="#13ce66"
            />
          </el-form-item>
          <el-form-item :label="$t('8ab980b4.3db6fb')">
            <el-switch
              v-model="form.withdraw_bank.wechatpay"
              :width="50"
              active-value="true"
              inactive-value="false"
              :active-text="$t('8ab980b4.cc42dd')"
              :inactive-text="$t('8ab980b4.b15d91')"
              active-color="#13ce66"
            />
          </el-form-item>
          <el-form-item :label="$t('8ab980b4.50d97d')">
            <el-switch
              v-model="form.withdraw_bank.bankpay"
              :width="50"
              active-value="true"
              inactive-value="false"
              :active-text="$t('8ab980b4.cc42dd')"
              :inactive-text="$t('8ab980b4.b15d91')"
              active-color="#13ce66"
            />
          </el-form-item>
          <el-form-item :label="$t('8ab980b4.a49cea')">
            <el-input
              v-model="form.community_config.point_ratio"
              type="number"
              required
              min="1"
              placeholder=""
              style="width: 100px"
            />
            {{ $t('8ab980b4.5d0ee9') }}
          </el-form-item>
          <el-form-item :label="$t('8ab980b4.ea0d21')">
            <SpRichText v-model="form.community_config.point_desc" />
          </el-form-item>
          <el-form-item :label="$t('8ab980b4.72505d')">
            <SpRichText v-model="form.community_config.withdraw_desc" />
          </el-form-item>
          <el-form-item :label="$t('8ab980b4.e84643')">
            <el-input
              v-model="form.consumer_hotline"
              type="number"
              required
              min="1"
              placeholder=""
              style="width: 240px"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </SpPage>
</template>
<script>
import { setCompanySetting, getCompanySetting } from '../../../../api/company'
import imgPicker from '../../../../components/imageselect'
export default {
  data() {
    return {
      components: {
        imgPicker
      },
      form: {
        community_config: {
          point_ratio: '',
          point_desc: '',
          withdraw_desc: ''
        },
        withdraw_bank: {
          alipay: 'true',
          wechatpay: 'false',
          bankpay: 'false'
        },
        customer_switch: 'false',
        consumer_hotline: ''
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    updatePointDescContent(data) {
      this.form.community_config.point_desc = data
    },
    updateWithdrawDescContent(data) {
      this.form.community_config.withdraw_desc = data
    },
    save() {
      if (this.form.customer_switch == 'true') {
        this.form.customer_switch = 1
      } else {
        this.form.customer_switch = 0
      }
      setCompanySetting(this.form).then((res) => {
        this.$message({ message: this.$t('8ab980b4.33130f'), type: 'success' })
        this.getConfig()
      })
    },
    getConfig() {
      getCompanySetting().then((res) => {
        if (res.data.data.company_id) {
          this.form = res.data.data
          if (this.form.customer_switch) {
            this.form.customer_switch = 'true'
          } else {
            this.form.customer_switch = 'false'
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  display: inline-block;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  width: 148px;
  height: 148px;
  line-height: 145px;
  margin-top: 20px;
  text-align: center;

  .avatar-uploader-icon {
    font-size: 38px;
  }

  .pic {
    max-width: 148px;
    max-height: 148px;
    vertical-align: middle;
  }
}

.alert-text {
  padding: 0 20px;
  margin-bottom: 20px;
}

.gap-text {
  margin-top: 20px;
}

.tpl_item {
  display: inline-block;
  border: 1px solid #ddd;
  background-color: #fff;
  text-align: left;
  padding: 0 5px;
  line-height: 36px;
  cursor: pointer;
  border-radius: 5px;
}

.tpl_item .fa {
  width: 12px;
  height: 22px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 1em;
  font-size: 20px;
  text-align: center;
}

.vue-html5-editor {
  vertical-align: top;
  display: inline-block;
}

.demo-ruleForm {
  .vue-html5-editor {
    width: 80%;
  }
}
</style>
