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
    <div class="hd">用户隐私保护指引</div>
    <div class="bd">
      <h3>《{{ weappName }}小程序隐私保护指引》</h3>
      <p>
        本指引是{{
          weappName
        }}小程序开发者商派软件有限公司（以下简称“开发者”）为处理你的个人信息而制定。
      </p>
      <br>
      <h4>1. 开发者处理的信息</h4>
      <p>根据法律规定，开发者仅处理实现小程序功能所必要的信息。</p>
      <div class="policy-container mtp-10">
        <!-- {{policyObject}} -->
        <div v-for="(key, index) in privacyList" :key="`policy-item__${index}`" class="policy-item">
          为了
          <el-input
            v-model="policyObject[key]"
            size="small"
            placeholder="请输入内容"
            style="width: 480px"
            maxlength="30"
            show-word-limit
          />，开发者将在获取你的明示同意后，收集你的{{ getPrivacyDesc(key) }}
        </div>
      </div>
      <br>
      <h4>2. 第三方服务商信息</h4>
      <p>
        {{
          weappName
        }}小程序由商派软件有限公司代为开发，开发者保证，商派软件有限公司将在本指引规定范围内处理你的个人信息。
      </p>
      <br>
      <h4>3. 你的权益</h4>
      <p>
        3.1
        关于收集你的位置信息，你可以通过以下路径：小程序主页右上角..."-”设置”-点击特定信息-点击"不允许”，撤回对开发者的授权。
      </p>
      <p>
        3.2 关于收集你的微信昵称、头像、收集你的地址，你可以通过以下路径:小程序主页右上角..."
        -“设置"一“小程序已获取的信息"-点击特定信息-点击“通知开发者删除"，开发者承诺收到通知后将删除信息。
      </p>
      <p>
        3.3 关于你的个人信息，
        你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。
      </p>
      <div class="mtp-10">
        <el-input
          v-model="contactValue"
          size="small"
          :placeholder="`请输入${contactOptions[contact]}`"
          class="input-with-select"
          style="width: 300px"
        >
          <el-select slot="prepend" v-model="contact" placeholder="请选择">
            <el-option
              v-for="(value, key) in contactOptions"
              :key="`option-item__${key}`"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-input>
      </div>
      <br>
      <h4>4. 开发者对信息的存储</h4>
      <!-- <p>{{weappName}}小程序由商派软件有限公司代为开发，开发者保证，商派软件有限公司将在本指引规定范围内处理你的个人信息。</p> -->
      <div class="mtp-10">
        <div>
          <el-radio v-model="storeType" label="1"> 固定存储期限 </el-radio>
          <el-date-picker
            v-model="ownerSetting.store_expire_timestamp"
            type="date"
            size="small"
            placeholder="选择日期"
          />
        </div>
        <div class="mtp-10">
          <el-radio v-model="storeType" label="2">
            开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。
          </el-radio>
        </div>
      </div>
      <br>
      <h4>5. 信息的使用规则</h4>
      <p>5.1 开发者将会在本指引所明示的用途内使用收集的信息</p>
      <p>
        5.2 如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以
      </p>
      <div class="mtp-10">
        <el-input
          v-model="ownerSetting.notice_method"
          placeholder="请填写通知方式"
          size="small"
          style="width: 300px"
        />
        方式告知并征得你的明示同意。
      </div>
      <br>
      <h4>6. 信息对外提供</h4>
      <p>
        6.1
        开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。
      </p>
      <p>
        6.2
        开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
      </p>
      <br>
      <h4>7. 补充文档</h4>
      <p>了解更多个人信息处理规则可查看补充文档，稳定格式只支持.txt，大小不超过100kb</p>
      <div class="upload-block">
        <el-upload
          action=""
          :on-change="onChangeUpload"
          :auto-upload="false"
          :show-file-list="false"
          style="display: inline-block; margin-right: 20px"
        >
          <el-button type="primary"> 点击上传 </el-button>
        </el-upload>
        <span>{{ fileName }}</span>
      </div>
    </div>
    <div class="ft">
      <el-button type="primary" @click="savePolicyConfig"> 确定并生成协议 </el-button>
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
      this.privacyList.forEach(key => {
        const fd = this.settingList.find(item => item.privacy_key == key)
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
      this.$message.success('文件上传成功')
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
      Object.keys(this.policyObject).forEach(key => {
        settingList.push({
          privacy_key: key,
          privacy_text: this.policyObject[key]
        })
      })

      const fd = settingList.find(item => item.privacy_text == '')
      if (fd) {
        this.$message.error(`请填写收集${this.getPrivacyDesc(fd.privacy_key)}的原因`)
        return
      }
      if (!this.ownerSetting.notice_method) {
        this.$message.error('请填写通知方式')
        return
      }

      await this.$api.policy.savePolicyConfig({
        wxaAppId: this.wxapp_id,
        owner_setting: JSON.stringify(this.ownerSetting),
        setting_list: JSON.stringify(settingList)
      })
      this.$message.success('保存成功')
      this.$router.go(-1)
    },
    getPrivacyDesc(key) {
      const fd = this.privacyDescList.find(item => item.privacy_key == key)
      return fd ? fd.privacy_desc : ''
    }
  }
}
</script>
