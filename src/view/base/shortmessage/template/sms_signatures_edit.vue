<template>
  <div class="sms_signatures_edit">
    <h4>添加短信签名</h4>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="demo-ruleForm">
      <el-form-item label="短信类型" prop="sign_type">
        <el-radio-group v-model="form.sign_type" :disabled="disabled">
          <el-radio label="153"> 验证码（0.045元 / 条） </el-radio>
          <el-radio label="49"> 短信通知（0.045元 / 条） </el-radio>
          <el-radio v-if="!VERSION_IN_PURCHASE" label="52"> 推广短信（0.055元 / 条） </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="签名名称" prop="sign_name">
        <el-input
          v-model="form.sign_name"
          :disabled="disabled || disabled_edit"
          minlength="2"
          maxlength="12"
          show-word-limit
          placeholder="长度限2-12个字符，建议为用户真是应用名/网站名/公司名"
        />
        <ul class="tips">
          <li>· 签名发送自带【】符号，无须添加【】、()、[] 符号，避免重复</li>
          <li>· 不支持如 “客户服务”、“友情提醒” 等过于宽泛内容、不支持 “测试” 字样的签名</li>
          <li>
            · 了解更多<a
              target="_blank"
              href="https://help.aliyun.com/document_detail/55324.html?spm=5176.12212999.0.0.4b2b1cbe7AQAyL"
              >签名 / 模板申请规范</a
            >
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="签名来源" prop="sign_source">
        <el-radio-group v-model="form.sign_source" :disabled="disabled">
          <el-radio label="0"> 企事业单位的全称或简称 </el-radio>
          <el-radio label="1"> 工信部备案网站的全称或简称 </el-radio>
          <el-radio label="2"> App 应用的全称或简称 </el-radio>
          <el-radio label="3"> 公众号或小程序的全称或简称 </el-radio>
          <el-radio label="4"> 电商平台店铺名的全称或简称 </el-radio>
          <el-radio label="5"> 商标名的全称或简称 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="申请说明" prop="remark">
        <el-input
          v-model="form.remark"
          :disabled="disabled"
          type="textarea"
          :rows="8"
          maxlength="200"
          show-word-limit
          placeholder="详细描述您的业务使用场景或签名用途，可填写企业官网链接，工信部备案网站域名，已上线应用在任一应用商店展示页链接，公众号或小程序全称，任一电商店铺展示页链接，已注册商标名等，可有效提升通过率，长度不超过 200 个字符。"
        />
      </el-form-item>

      <el-form-item label="是否上线" prop="is_online">
        <el-radio v-model="form.is_online" label="false">是</el-radio>
        <el-radio v-model="form.is_online" label="true">否</el-radio>
      </el-form-item>

      <el-form-item v-if="$route.query.type !== 'detail'">
        <loadingBtn ref="loadingBtn" @clickHandle="submitForm('form')" />
        <el-button @click="fnBack"> 取消 </el-button>
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
    />

    <!-- result -->
    <el-dialog :visible="resultVisible" class="result" :show-close="false">
      <el-result icon="success" title="提交成功" sub-title="请根据提示进行操作">
        <template slot="subTitle">
          <h5>签名已提交审核，审核结果可在签名列表中查看。</h5>
          <ul class="tips">
            <li>预计两小时完成审核，政企签名预计在 48 小时工作时间内审核</li>
            <li>审核工作时间：周一至周日 9:00-23:00（法定节日顺延）</li>
          </ul>
        </template>
        <template slot="extra">
          <el-button type="primary" size="medium" @click="fnBack"> 返回列表 </el-button>
          <el-button v-if="!$route.query.type" size="medium" @click="fnAgain">
            再添加一个签名
          </el-button>
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script>
import { requiredRules, MaxRules, MinRules } from '@/utils/validate'
import imgPicker from '@/components/imageselect'
import loadingBtn from '@/components/loading-btn'
import { setTheNewSignature, getTheSignature, editTheSignature } from '@/api/tempSms.js'

export default {
  components: {
    imgPicker,
    loadingBtn
  },
  data() {
    return {
      // 页面状态
      disabled: false,
      disabled_edit: false,
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
        delegate_file: '', //委托授权书
        sign_type: ''
      },
      rules: {
        sign_type: [requiredRules('短信类型', 'change')],
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

        if (type == 'edit') {
          this.disabled_edit = true
        }
      }
    },
    resultHandler(result) {
      const { sign_name, sign_source, remark, sign_file, delegate_file, sign_type, is_online } =
        result.data.data
      this.form = {
        sign_name,
        sign_source: sign_source + '',
        remark,
        sign_file,
        sign_type,
        delegate_file,
        is_online
      }
    },
    submitForm(formName) {
      const { type, id } = this.$route.query
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            if (type == 'edit') {
              const result = await editTheSignature({ id, ...this.form })
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
        path: `/setting/datamessage/tmp_sms/sms_signatures`
      })
    },
    fnAgain() {
      this.resultVisible = false
      this.$refs['form'].resetFields()
      this.form.sign_file = ''
      this.form.delegate_file = ''
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
    deleteUrl(url) {
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
    .close {
      position: absolute;
      top: 3px;
      right: 3px;
      font-size: 20px;
      color: #999;
      &:hover {
        color: #1480e3;
      }
    }
  }
  .form-tips {
    color: #999;
    font-size: 12px;
  }
  .tips {
    margin-top: 10px;
    li {
      color: #999;
      font-size: 12px;
      line-height: 16px;
      margin-bottom: 4px;
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
