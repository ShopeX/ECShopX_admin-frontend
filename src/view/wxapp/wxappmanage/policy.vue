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
    <div class="hd">{{ $t('9b898f75.d8c536') }}</div>
    <div class="bd">
      <h3>《{{ weappName }}}{{ $t('9b898f75.c3907b') }}》</h3>
      <p>{{ $t('9b898f75.b7a241') }}{{ weappName }}{{ $t('9b898f75.dee550') }}</p>
      <br>
      <h4>1. {{ $t('9b898f75.e155b6') }}</h4>
      <p>{{ $t('9b898f75.583ee9') }}</p>
      <div class="policy-container mtp-10">
        <!-- {{policyObject}} -->
        <div v-for="(key, index) in privacyList" :key="`policy-item__${index}`" class="policy-item">
          {{ $t('9b898f75.665751') }}
          <el-input
            v-model="policyObject[key]"
            size="small"
            :placeholder="$t('9b898f75.a11cc7')"
            style="width: 480px"
            maxlength="30"
            show-word-limit
          />{{ $t('9b898f75.9afc01') }}{{ getPrivacyDesc(key) }}
        </div>
      </div>
      <br>
      <h4>2. {{ $t('9b898f75.20bac6') }}</h4>
      <p>{{ weappName }}{{ $t('9b898f75.ac8f57') }}</p>
      <br>
      <h4>3. {{ $t('9b898f75.8b8558') }}</h4>
      <p>3.1 {{ $t('9b898f75.b51d5e') }}{{ $t('9b898f75.c59c80') }}</p>
      <p>3.2 {{ $t('9b898f75.e1a763') }}</p>
      <p>3.3 {{ $t('9b898f75.fdb543') }}</p>
      <div class="mtp-10">
        <el-input
          v-model="contactValue"
          size="small"
          :placeholder="contactPlaceholder"
          class="input-with-select"
          style="width: 300px"
        >
          <el-select slot="prepend" v-model="contact" :placeholder="$t('9b898f75.708c9d')">
            <el-option
              v-for="(value, key) in contactOptions"
              :key="`option-item__${key}`"
              :label="$t(value)"
              :value="key"
            />
          </el-select>
        </el-input>
      </div>
      <br>
      <h4>4. {{ $t('9b898f75.f339ef') }}</h4>
      <!-- <p>{{weappName}}小程序由商派软件有限公司代为开发，开发者保证，商派软件有限公司将在本指引规定范围内处理你的个人信息。</p> -->
      <div class="mtp-10">
        <div>
          <el-radio v-model="storeType" label="1">{{ $t('9b898f75.3a8eca') }}</el-radio>
          <el-date-picker
            v-model="ownerSetting.store_expire_timestamp"
            type="date"
            size="small"
            :placeholder="$t('9b898f75.2bebdd')"
          />
        </div>
        <div class="mtp-10">
          <el-radio v-model="storeType" label="2">
            {{ $t('9b898f75.d16688') }}
          </el-radio>
        </div>
      </div>
      <br>
      <h4>5. {{ $t('9b898f75.03b799') }}</h4>
      <p>5.1 {{ $t('9b898f75.975f2d') }}</p>
      <p>5.2 {{ $t('9b898f75.506c4f') }}</p>
      <div class="mtp-10">
        <el-input
          v-model="ownerSetting.notice_method"
          :placeholder="$t('9b898f75.948dd7')"
          size="small"
          style="width: 300px"
        />
        {{ $t('9b898f75.96941c') }}
      </div>
      <br>
      <h4>6. {{ $t('9b898f75.ea657d') }}</h4>
      <p>6.1 {{ $t('9b898f75.f818c0') }}</p>
      <p>6.2 {{ $t('9b898f75.017801') }}</p>
      <br>
      <h4>7. {{ $t('9b898f75.816c4f') }}</h4>
      <p>{{ $t('9b898f75.399604') }}</p>
      <div class="upload-block">
        <el-upload
          action=""
          :on-change="onChangeUpload"
          :auto-upload="false"
          :show-file-list="false"
          style="display: inline-block; margin-right: 20px"
        >
          <el-button type="primary">{{ $t('9b898f75.2c808b') }}</el-button>
        </el-upload>
        <span>{{ fileName }}</span>
      </div>
    </div>
    <div class="ft">
      <el-button type="primary" @click="savePolicyConfig">{{ $t('9b898f75.ddb83a') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: '',
  props: ['wxappId', 'templateName', 'weappName', 'isLoad'],
  data() {
    return {
      applet_detail: false,
      privacyList: [],
      privacyDescList: [],
      settingList: [],
      policyObject: {},
      contact: 'contact_phone',
      contactValue: '',
      storeType: '1',
      fileName: '',
      contactOptions: {
        contact_phone: '9b898f75.8098e2',
        contact_email: '9b898f75.3bc5e6',
        contact_qq: '9b898f75.adc249',
        contact_weixin: '9b898f75.bcaaee'
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
    contactPlaceholder() {
      return this.$t('9b898f75.02cc4f') + this.$t(this.contactOptions[this.contact])
    }
  },
  created() {
    this.getPolicyConfig()
  },
  methods: {
    async getPolicyConfig() {
      const { privacy_desc, setting_list, owner_setting, privacy_list } =
        await this.$api.policy.getPolicyConfig({
          wxaAppId: this.wxappId
        })
      this.privacyDescList = privacy_desc.privacy_desc_list
      this.settingList = setting_list
      this.ownerSetting = owner_setting
      this.privacyList = privacy_list

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
      this.privacyList.forEach((key) => {
        const fd = this.settingList.find((item) => item.privacy_key == key)
        this.$set(this.policyObject, key, fd ? fd.privacy_text : '')
      })
    },
    async onChangeUpload(file) {
      const { ext_file_media_id } = await this.$api.policy.uploadPolicyFile({
        wxaAppId: this.wxappId,
        isUploadFile: true,
        file: file.raw
      })
      this.fileName = file.name
      this.$message.success(this.$t('9b898f75.679c4b'))
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
          this.$t('9b898f75.bbb73f') +
            this.getPrivacyDesc(fd.privacy_key) +
            this.$t('9b898f75.fd46bb')
        )
        return
      }
      if (!this.ownerSetting.notice_method) {
        this.$message.error(this.$t('9b898f75.948dd7'))
        return
      }

      await this.$api.policy.savePolicyConfig({
        wxaAppId: this.wxappId,
        owner_setting: JSON.stringify(this.ownerSetting),
        setting_list: JSON.stringify(settingList)
      })
      this.$message.success(this.$t('9b898f75.3b1083'))
      this.$router.go(-1)
    },
    getPrivacyDesc(key) {
      const fd = this.privacyDescList.find((item) => item.privacy_key == key)
      return fd ? fd.privacy_desc : ''
    }
  }
}
</script>
