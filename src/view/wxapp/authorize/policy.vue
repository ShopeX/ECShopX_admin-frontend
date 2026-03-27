<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.page-wxapp-policy {
  h3,
  h4 {
    color: #333;
    font-weight: bold;
  }
  .hd {
    font-size: 18px;
    color: #333;
    background: #f5f5f5;
    padding: 10px 20px;
  }
  .bd {
    margin-top: 20px;
    padding: 0 20px;
  }
  .ft {
    padding: 30px;
    text-align: center;
  }
  .upload-block {
    margin-top: 20px;
  }
  .mtp-10 {
    margin-top: 10px;
  }
  .policy-item {
    margin-bottom: 10px;
  }
  .el-select .el-input {
    width: 100px;
  }
}
</style>
<template>
  <div class="page-wxapp-policy">
    <div class="hd">{{ $t('a6e63cec.d8c536') }}</div>
    <div class="bd">
      <h3>《{{ weappName }}{{ $t('a6e63cec.c3907b') }}》</h3>
      <p>{{ $t('a6e63cec.b7a241') }}{{ weappName }}{{ $t('a6e63cec.dee550') }}</p>
      <br>
      <h4>{{ $t('a6e63cec.497acc') }}</h4>
      <p>{{ $t('a6e63cec.583ee9') }}</p>
      <div class="policy-container mtp-10">
        <!-- {{policyObject}} -->
        <div v-for="(key, index) in privacyList" :key="`policy-item__${index}`" class="policy-item">
          {{ $t('a6e63cec.665751') }}
          <el-input
            v-model="policyObject[key]"
            size="small"
            :placeholder="$t('a6e63cec.a11cc7')"
            style="width: 480px"
            maxlength="30"
            show-word-limit
          />{{ $t('a6e63cec.9afc01') }}{{ getPrivacyDesc(key) }}
        </div>
      </div>
      <br>
      <h4>{{ $t('a6e63cec.8c5689') }}</h4>
      <p>{{ weappName }}{{ $t('a6e63cec.ac8f57') }}</p>
      <br>
      <h4>{{ $t('a6e63cec.f83a44') }}</h4>
      <p>
        {{ $t('a6e63cec.2f584d') }}
      </p>
      <p>{{ $t('a6e63cec.394a97') }}</p>
      <p>{{ $t('a6e63cec.1d39c9') }}</p>
      <div class="mtp-10">
        <el-input
          v-model="contactValue"
          size="small"
          :placeholder="$t('a6e63cec.02cc4f') + contactOptionsLabel[contact]"
          class="input-with-select"
          style="width: 300px"
        >
          <el-select slot="prepend" v-model="contact" :placeholder="$t('a6e63cec.708c9d')">
            <el-option
              v-for="key in contactKeys"
              :key="`option-item__${key}`"
              :label="$t('a6e63cec.' + contactKeyToI18n[key])"
              :value="key"
            />
          </el-select>
        </el-input>
      </div>
      <br>
      <h4>{{ $t('a6e63cec.128a33') }}</h4>
      <!-- <p>{{weappName}}小程序由商派软件有限公司代为开发，开发者保证，商派软件有限公司将在本指引规定范围内处理你的个人信息。</p> -->
      <div class="mtp-10">
        <div>
          <el-radio v-model="storeType" label="1">{{ $t('a6e63cec.3a8eca') }}</el-radio>
          <el-date-picker
            v-model="ownerSetting.store_expire_timestamp"
            type="date"
            size="small"
            :placeholder="$t('a6e63cec.2bebdd')"
          />
        </div>
        <div class="mtp-10">
          <el-radio v-model="storeType" label="2">
            {{ $t('a6e63cec.d16688') }}
          </el-radio>
        </div>
      </div>
      <br>
      <h4>{{ $t('a6e63cec.ed8480') }}</h4>
      <p>{{ $t('a6e63cec.022caa') }}</p>
      <p>{{ $t('a6e63cec.a5da2e') }}</p>
      <div class="mtp-10">
        <el-input
          v-model="ownerSetting.notice_method"
          :placeholder="$t('a6e63cec.948dd7')"
          size="small"
          style="width: 300px"
        />
        {{ $t('a6e63cec.96941c') }}
      </div>
      <br>
      <h4>{{ $t('a6e63cec.5008f6') }}</h4>
      <p>{{ $t('a6e63cec.e6ab60') }}</p>
      <p>{{ $t('a6e63cec.e6a9a6') }}</p>
      <br>
      <h4>{{ $t('a6e63cec.7064ac') }}</h4>
      <p>{{ $t('a6e63cec.399604') }}</p>
      <div class="upload-block">
        <el-upload
          action=""
          :on-change="onChangeUpload"
          :auto-upload="false"
          :show-file-list="false"
          style="display: inline-block; margin-right: 20px"
        >
          <el-button type="primary">{{ $t('a6e63cec.2c808b') }}</el-button>
        </el-upload>
        <span>{{ fileName }}</span>
      </div>
    </div>
    <div class="ft">
      <el-button type="primary" @click="savePolicyConfig">{{ $t('a6e63cec.ddb83a') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: '',
  data() {
    return {
      wxapp_id: '',
      weappName: '',
      privacyList: [],
      privacyDescList: [],
      settingList: [],
      policyObject: {},
      contact: 'contact_phone',
      contactValue: '',
      storeType: '1',
      fileName: '',
      contactOptions: {
        contact_phone: '手机号',
        contact_email: '邮箱',
        contact_qq: 'QQ号',
        contact_weixin: '微信号'
      },
      ownerSetting: {
        contact_phone: '',
        contact_email: '',
        contact_qq: '',
        contact_weixin: '',
        store_expire_timestamp: '',
        ext_file_media_id: '',
        notice_method: ''
      }
    }
  },
  computed: {
    contactKeys() {
      return ['contact_phone', 'contact_email', 'contact_qq', 'contact_weixin']
    },
    contactKeyToI18n() {
      return {
        contact_phone: '8098e2',
        contact_email: '3bc5e6',
        contact_qq: 'adc249',
        contact_weixin: 'bcaaee'
      }
    },
    contactOptionsLabel() {
      return {
        contact_phone: this.$t('a6e63cec.8098e2'),
        contact_email: this.$t('a6e63cec.3bc5e6'),
        contact_qq: this.$t('a6e63cec.adc249'),
        contact_weixin: this.$t('a6e63cec.bcaaee')
      }
    }
  },
  created() {
    if (this.$route.query && this.$route.query.app_id) {
      this.wxapp_id = this.$route.query.app_id
    }
    if (this.$route.query && this.$route.query.nick_name) {
      this.weappName = this.$route.query.nick_name
    }
    this.getPolicyConfig()
  },
  mounted() {
    if (this.$route.query && this.$route.query.app_id) {
      this.wxapp_id = this.$route.query.app_id
    }
    if (this.$route.query && this.$route.query.nick_name) {
      this.weappName = this.$route.query.nick_name
    }
  },
  methods: {
    async getPolicyConfig() {
      const { privacy_desc, setting_list, owner_setting, privacy_list } =
        await this.$api.policy.getPolicyConfig({
          wxaAppId: this.wxapp_id
        })
      this.privacyDescList = privacy_desc.privacy_desc_list
      this.settingList = setting_list
      this.ownerSetting = owner_setting
      // this.privacyList = privacy_list

      if (this.ownerSetting.store_expire_timestamp) {
        this.storeType = '1'
      } else {
        this.storeType = '2'
      }
      if (this.ownerSetting.contact_email) {
        this.contact = 'contact_email'
        this.contactValue = this.ownerSetting.contact_email
      }

      if (this.ownerSetting.contact_phone) {
        this.contact = 'contact_phone'
        this.contactValue = this.ownerSetting.contact_phone
      }

      if (this.ownerSetting.contact_qq) {
        this.contact = 'contact_qq'
        this.contactValue = this.ownerSetting.contact_qq
      }

      if (this.ownerSetting.contact_weixin) {
        this.contact = 'contact_weixin'
        this.contactValue = this.ownerSetting.contact_weixin
      }

      // demo
      // this.privacyList = [
      //   "UserInfo",
      //   "Location",
      //   "Address",
      //   "Invoice",
      //   "RunData",
      //   "Record",
      //   "Album",
      //   "Camera",
      //   "Contact",
      //   "AlbumWriteOnly",
      //   "BlueTooth",
      //   "CalendarWriteOnly",
      //   "MessageFile"
      // ]
      this.privacyList = [
        'UserInfo',
        'Location',
        'Address',
        'Invoice',
        'Album',
        'PhoneNumber',
        'AlbumWriteOnly',
        'MessageFile',
        'ChooseLocation',
        'Clipboard'
      ]
      this.privacyList.forEach((key) => {
        const fd = this.settingList.find((item) => item.privacy_key == key)
        this.$set(this.policyObject, key, fd ? fd.privacy_text : '')
      })
    },
    async onChangeUpload(file) {
      const { ext_file_media_id } = await this.$api.policy.uploadPolicyFile({
        wxaAppId: this.wxapp_id,
        isUploadFile: true,
        file: file.raw
      })
      this.fileName = file.name
      this.$message.success(this.$t('a6e63cec.679c4b'))
      this.ownerSetting.ext_file_media_id = ext_file_media_id
    },
    async savePolicyConfig() {
      if (this.storeType == '2') {
        this.ownerSetting.store_expire_timestamp = ''
      }
      if (this.contact == 'contact_phone') {
        this.ownerSetting = {
          ...this.ownerSetting,
          contact_phone: this.contactValue,
          contact_email: '',
          contact_qq: '',
          contact_weixin: ''
        }
      }
      if (this.contact == 'contact_email') {
        this.ownerSetting = {
          ...this.ownerSetting,
          contact_phone: '',
          contact_email: this.contactValue,
          contact_qq: '',
          contact_weixin: ''
        }
      }
      if (this.contact == 'contact_qq') {
        this.ownerSetting = {
          ...this.ownerSetting,
          contact_phone: '',
          contact_email: '',
          contact_qq: this.contactValue,
          contact_weixin: ''
        }
      }
      if (this.contact == 'contact_weixin') {
        this.ownerSetting = {
          ...this.ownerSetting,
          contact_phone: '',
          contact_email: '',
          contact_qq: '',
          contact_weixin: this.contact_weixin
        }
      }
      let settingList = []
      Object.keys(this.policyObject).forEach((key) => {
        settingList.push({
          privacy_key: key,
          privacy_text: this.policyObject[key]
        })
      })

      const fd = settingList.find((item) => item.privacy_text == '')
      if (fd) {
        this.$message.error(
          this.$t('a6e63cec.bbb73f') +
            this.getPrivacyDesc(fd.privacy_key) +
            this.$t('a6e63cec.fd46bb')
        )
        return
      }
      if (!this.ownerSetting.notice_method) {
        this.$message.error(this.$t('a6e63cec.948dd7'))
        return
      }

      await this.$api.policy.savePolicyConfig({
        wxaAppId: this.wxapp_id,
        owner_setting: JSON.stringify(this.ownerSetting),
        setting_list: JSON.stringify(settingList)
      })
      this.$message.success(this.$t('a6e63cec.3b1083'))
      this.$router.go(-1)
    },
    getPrivacyDesc(key) {
      const fd = this.privacyDescList.find((item) => item.privacy_key == key)
      return fd ? fd.privacy_desc : ''
    }
  }
}
</script>
