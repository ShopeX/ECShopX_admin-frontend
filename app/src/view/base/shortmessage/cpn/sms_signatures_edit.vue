<template>
  <div class="sms_signatures_edit">
    <h4>添加短信签名</h4>
    <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-ruleForm">
      <el-form-item label="签名名称" prop="sign_name">
        <el-input
          :disabled="disabled || disabled_edit"
          v-model="form.sign_name"
          minlength="2"
          maxlength="12"
          show-word-limit
          placeholder="长度限2-12个字符，建议为用户真是应用名/网站名/公司名"
        ></el-input>
      </el-form-item>
      <el-form-item label="签名来源" prop="sign_source">
        <el-radio-group v-model="form.sign_source" :disabled="disabled">
          <el-radio label="0">企事业单位的全称或简称</el-radio>
          <el-radio label="1">工信部备案网站的全称或简称</el-radio>
          <el-radio label="2">App 应用的全称或简称</el-radio>
          <el-radio label="3">公众号或小程序的全称或简称</el-radio>
          <el-radio label="4">电商平台店铺名的全称或简称</el-radio>
          <el-radio label="5">商标名的全称或简称</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="申请说明" prop="remark">
        <el-input
          :disabled="disabled"
          type="textarea"
          :rows="8"
          v-model="form.remark"
          maxlength="200"
          show-word-limit
          placeholder="详细描述您的业务使用场景或签名用途，可填写企业官网链接，工信部备案网站域名，已上线应用在任一应用商店展示页链接，公众号或小程序全称，任一电商店铺展示页链接，已注册商标名等，可有效提升通过率，长度不超过 200 个字符。"
        ></el-input>
      </el-form-item>
      <el-form-item label="证明文件">
        <div class="upload-box" @click="handleImgPicker('sign_file')">
          <template v-if="form.sign_file">
            <img class="avatar" v-if="form.sign_file" :src="form.sign_file" />
            <i class="el-icon-error close" @click.stop="deleteUrl('sign_file')"></i>
          </template>
          <i v-else slot="default" class="el-icon-plus"></i>
        </div>
        <span>签名归属方的三证合一</span>
        <ul class="tips">
          <li>
            说明：个别场景下，申请签名需要上传证明文件。详细说明，请参见 <a target="_blank" href="https://help.aliyun.com/document_detail/108076.htm?spm=a2c4g.11186623.0.0.236c3d26hyj4yl">短信签名规范。</a>
          </li>
          <li>支持 JPG、PNG、GIF 或 JPEG 格式的图片，图片不超过 2 MB。</li>
        </ul>
      </el-form-item>
      <el-form-item label="委托授权书">
        <div class="upload-box" @click="handleImgPicker('delegate_file')">
          <template v-if="form.delegate_file">
            <img class="avatar"  :src="form.delegate_file" />
            <i class="el-icon-error close" @click.stop="deleteUrl('delegate_file')"></i>
          </template>
          <i v-else slot="default" class="el-icon-plus"></i>
          
        </div>

        <ul class="tips">
          <li>
            说明：
            如果签名用途为他用或个人认证用户的自用签名来源为企事业单位名时，还需上传证明文件和委托授权书，详情请参见
            <a target="_blank" href="https://help.aliyun.com/document_detail/108076.htm?spm=a2c4g.11186623.0.0.236c25a11W2iBL"> 证明文件 </a>和 <a target="_blank" href="https://help.aliyun.com/document_detail/56741.htm?spm=a2c4g.11186623.0.0.236c25a1zODsEU">授权委托书</a>。
          </li>
          <li>支持 JPG、PNG、GIF 或 JPEG 格式的图片，图片不超过 2 MB。</li>
        </ul>
      </el-form-item>
      <el-form-item v-if="$route.query.type !== 'detail'">
        <loadingBtn @clickHandle="submitForm('form')" ref="loadingBtn" />
        <el-button @click="fnBack">取消</el-button>
        <ul class="tips">
          <li>预计两小时完成审核，政企签名预计在 48 小时工作时间内审核</li>
          <li>审核工作时间：周一至周日 9:00-23:00（法定节日顺延）</li>
        </ul>
      </el-form-item>
    </el-form>
    <!-- 图片选择 -->
      <imgPicker
        :dialog-visible="imgDialog"
        :sc-status="isGetImage"
        @chooseImg="pickImg"
        @closeImgDialog="closeImgDialog"
      ></imgPicker>

    <!-- result -->
    <el-dialog :visible="resultVisible" class="result" :show-close="false">
      <el-result icon="success" title="提交成功" subTitle="请根据提示进行操作">
        <template slot="subTitle">
          <h5>签名已提交审核，审核结果可在签名列表中查看。</h5>
          <ul class="tips">
            <li>预计两小时完成审核，政企签名预计在 48 小时工作时间内审核</li>
            <li>审核工作时间：周一至周日 9:00-23:00（法定节日顺延）</li>
          </ul>
        </template>
        <template slot="extra">
          <el-button type="primary" @click="fnBack" size="medium">返回列表</el-button>
          <el-button v-if="!$route.query.type" size="medium" @click="resultVisible = false"
            >再添加一个签名</el-button
          >
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script>
import { requiredRules, MaxRules, MinRules } from '@/utils/validate'
import imgPicker from '@/components/imageselect'
import loadingBtn from '@/components/loading-btn'
import {
  setTheNewSignature,
  getTheSignature,
  editTheSignature,
} from '@/api/sms'

export default {
  components: {
    imgPicker,
    loadingBtn
  },
  data() {
    return {
      // 页面状态
      disabled: false,
      disabled_edit:false,
      // 图片选择
      imgDialog: false,
      isGetImage: false,
      pickerImgType: '',
      // result
      resultVisible: false,
      form: {
        sign_name: '', //签名名称
        sign_source: '',
        remark: '',
        sign_file: '', // 证明文件
        delegate_file: '' //委托授权书
      },
      rules: {
        sign_name: [requiredRules('签名名称'), MaxRules(12), MinRules(2)],
        sign_source: [requiredRules('签名来源', 'change')],
        remark: [requiredRules('申请说明'), MaxRules(200)]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { type, id } = this.$route.query
      console.log(type, id)

      if (type) {
        const result = await getTheSignature({ id })
        this.resultHandler(result)
        if (type == 'detail') {
          this.disabled = true
        }

        if (type=='edit') {
          this.disabled_edit = true
        }
      }
    },
    resultHandler(result) {
      const { sign_name, sign_source, remark, sign_file, delegate_file } = result.data.data
      console.log(sign_name)
      this.form = {
        sign_name,
        sign_source: sign_source + '',
        remark,
        sign_file,
        delegate_file
      }
    },
    submitForm(formName) {
      const { type, id } = this.$route.query
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            if (type == 'edit') {
              const result = await editTheSignature({id,...this.form})
              this.submitFormResult(result)
            } else {
              const result = await setTheNewSignature(this.form)
              this.submitFormResult(result)
            }
          } catch (error) {
            this.$refs['loadingBtn'].closeLoading()
          }
        } else {
          console.log('error submit!!')
          this.$refs['loadingBtn'].closeLoading()
          return false
        }
      })
    },
    submitFormResult(result) {
      if (result.data.data.status) {
        this.resultVisible = true
      }
      this.$refs['loadingBtn'].closeLoading()
    },
    fnBack() {
      this.$router.push({
        path: `/setting/datamessage/ali_sms/sms_signatures`
      })
    },
    /* -------------------------图片选择------------------------- */
    pickImg({ url }) {
      if (url && this.pickerImgType) {
        const that = this.form
        that[this.pickerImgType] = url
        this.imgDialog = false
      }
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    handleImgPicker(pickerImgType) {
      if (!this.disabled) {
        this.pickerImgType = pickerImgType
        this.imgDialog = true
        this.isGetImage = true
      }
    },
    deleteUrl(url){
      this.form[url] = ''
    }
    /* -------------------------图片选择------------------------- */
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
    position: relative;
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
    .close{
      position: absolute;
      top:3px;
      right:3px;
      font-size: 20px;
      color: #999;
      &:hover{
        color: #1480e3;
      }
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
  .el-dialog {
    max-width: 600px;
    .el-dialog__header {
      padding: 0;
      /* padding: 20px 20px 10px; */
    }
    .el-dialog__body {
      padding: 30px 20px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
    }
    .el-result__subtitle p {
      font-weight: 700;
      font-size: 23px;
    }
    .el-result__subtitle {
      .tips {
        margin-top: 20px;
        li {
          color: #999;
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>