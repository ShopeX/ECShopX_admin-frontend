<template>
  <div class="sms_signatures_edit">
    <h4>添加短信签名</h4>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="签名名称" prop="sign_name">
        <el-input
          v-model="form.sign_name"
          minlength="2"
          maxlength="12"
          show-word-limit
          placeholder="长度限2-12个字符，建议为用户真是应用名/网站名/公司名"
        ></el-input>
      </el-form-item>
      <el-form-item label="签名来源" prop="sign_source">
        <el-radio-group v-model="form.sign_source">
          <el-radio label="企事业单位的全称或简称"></el-radio>
          <el-radio label="工信部备案网站的全称或简称"></el-radio>
          <el-radio label="App 应用的全称或简称"></el-radio>
          <el-radio label="公众号或小程序的全称或简称"></el-radio>
          <el-radio label="电商平台店铺名的全称或简称"></el-radio>
          <el-radio label="商标名的全称或简称"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="申请说明" prop="remark">
        <el-input
          type="textarea"
          :rows="8"
          v-model="form.remark"
          maxlength="200"
          show-word-limit
          placeholder="详细描述您的业务使用场景或签名用途，可填写企业官网链接，工信部备案网站域名，已上线应用在任一应用商店展示页链接，公众号或小程序全称，任一电商店铺展示页链接，已注册商标名等，可有效提升通过率，长度不超过 200 个字符。"
        ></el-input>
      </el-form-item>
      <el-form-item label="证明文件">
        <div class="upload-box" @click="handleImgPicker('legal_certid_front_url')">
          <img
            class="avatar"
            v-if="form.legal_certid_front_url"
            :src="form.legal_certid_front_url"
          />
          <i v-else slot="default" class="el-icon-plus"></i>
        </div>
        <span>签名归属方的三证合一</span>
        <ul class="tips">
          <li>
            说明：个别场景下，申请签名需要上传证明文件。详细说明，请参见 <a>短信签名规范。</a>
          </li>
          <li>支持 JPG、PNG、GIF 或 JPEG 格式的图片，图片不超过 2 MB。</li>
        </ul>
      </el-form-item>
      <el-form-item label="委托授权书">
        <div class="upload-box" @click="handleImgPicker('legal_certid_front_url')">
          <img
            class="avatar"
            v-if="form.legal_certid_front_url"
            :src="form.legal_certid_front_url"
          />
          <i v-else slot="default" class="el-icon-plus"></i>
        </div>

        <ul class="tips">
          <li>
            说明：
            如果签名用途为他用或个人认证用户的自用签名来源为企事业单位名时，还需上传证明文件和委托授权书，详情请参见
            <a>证明文件</a>和 <a>授权委托书</a>。
          </li>
          <li>支持 JPG、PNG、GIF 或 JPEG 格式的图片，图片不超过 2 MB。</li>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <ul class="tips">
          <li>预计两小时完成审核，政企签名预计在 48 小时工作时间内审核</li>
          <li>审核工作时间：周一至周日 9:00-23:00（法定节日顺延）</li>
        </ul>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { requiredRules, MaxRules, MinRules } from '@/utils/validate'
export default {
  data() {
    return {
      form: {
        sign_name: '', //签名名称
        sign_source: '',
        remark: '',
        sign_file_list: '',
        status: '',
        reason: ''
      },
      rules: {
          sign_name:[requiredRules('签名名称'),MaxRules(12),MinRules(2)],
          sign_source:[requiredRules('签名来源','change')],
          remark:[requiredRules('申请说明'),MaxRules(200)],
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sms_signatures_edit {
  h4 {
    color: #222;
    position: relative;
    margin-left: 10px;
    &::before {
      position: absolute;
      content: '';
      width: 5px;
      top: 4px;
      bottom: 4px;
      left: -8px;
      background: #1480e3;
    }
  }
  .demo-ruleForm {
    max-width: 960px;
    padding: 20px;
  }
}
</style>
<style lang="scss">
.sms_signatures_edit {
  padding-bottom: 50px;
  .el-radio-group {
    margin-top: 10px;
    .el-radio {
      width: 100%;
      margin-bottom: 15px;
    }
  }
  .upload-box {
    width: 150px;
    height: 150px;
    align-items: center;
    display: flex;
    border: 2px dashed #ccc;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    i {
      font-size: 40px;
      color: #999;
    }
    img {
      max-width: 100%;
      max-height: 140px;
    }
    &:hover {
      border-color: #409eff;
    }
  }
  .tips {
    margin-top: 10px;
    li {
      color: #999;
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>