<template>
  <div class="sms_signatures_edit">
    <h4>添加短信模板</h4>
    <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-ruleForm">
      <el-form-item label="短信类型" prop="template_type">
        <el-radio-group v-model="form.template_type" :disabled="disabled">
          <el-radio label="0">验证码（0.045元 / 条）</el-radio>
          <el-radio label="1">短信通知（0.045元 / 条）</el-radio>
          <el-radio label="2">推广短信（0.055元 / 条）</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label='短信场景' prop='scene_id' v-if="form.template_type">
        <el-select v-model="form.scene_id" placeholder="请选择" style="width:400px" :disabled="disabled">
          <el-option
            v-for="item in template_type_options"
            :key="item.id"
            :label="item.scene_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" prop="template_name">
        <el-input
          :disabled="disabled"
          v-model="form.template_name"
          minlength="1"
          maxlength="30"
          show-word-limit
          placeholder="长度限1-30个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label='模板内容' prop='template_content'>
        <nav>
          <span :class="['key' , {'detail':$route.query.type=='detail'}]" @click="fnKey(item)" v-for="item in variables" :key="item.var_name">${ {{item.var_title}} }</span>
        </nav>
        <el-input
          :disabled="disabled"
          type="textarea"
          :rows="8"
          v-model="form.template_content"
          maxlength="500"
          show-word-limit
          placeholder="短信模板申请说明，请描述您的业务使用场景，长度为1-500个字符。"
        ></el-input>
        <ul class="tips">
          <li>短信字数含 " 签名 + 模版内容 + 变量内容”，短信 70 个字数含以内，按 1 条短信计费；超出 70 个字为长短信，按照 67 个字数记为 1 条短信费用。</li>
          <li>短信服务的模板都需要经过审核，审核通过后才可以使用该模板，请参见<a target="_blank" href="https://help.aliyun.com/document_detail/108253.htm?spm=a2c4g.11186623.0.0.7c8e2918ZCtnlV"></a>短信模板规范。</li>
        </ul>
      </el-form-item>
      <el-form-item label="申请说明" prop="remark">
        <el-input
          :disabled="disabled"
          type="textarea"
          :rows="4"
          v-model="form.remark"
          maxlength="100"
          show-word-limit
          placeholder="短信模板申请说明，请描述您的业务使用场景，长度为1-100个字符。"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="$route.query.type !== 'detail'">
        <!-- <el-button type="primary" @click="submitForm('form')">确定</el-button> -->
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
          <h5>模板已提交审核，审核结果可在模板列表中查看。</h5>
          <ul class="tips">
            <li>预计两小时完成审核，政企签名预计在 48 小时工作时间内审核</li>
            <li>审核工作时间：周一至周日 9:00-23:00（法定节日顺延）</li>
          </ul>
        </template>
        <template slot="extra">
          <el-button type="primary" @click="fnBack" size="medium">返回列表</el-button>
          <el-button v-if="!$route.query.type" size="medium" @click="fnAgain"
            >再添加一个模板</el-button
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
  getTemplateSeleteList,
  getTemplateContentLabel,
  addSmsTemplate,
  SmsTemplateDetail,
  editSmsTemplate,
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
      // 图片选择
      imgDialog: false,
      isGetImage: false,
      pickerImgType: '',
      // result
      resultVisible: false,

      // 
      form: {
        template_type: '',
        scene_id: '',
        template_name: '',
        template_content: '',
        remark: '' 
      },
      rules: {
        template_type: [requiredRules('短信类型', 'change')],
        scene_id: [requiredRules('短信场景'),'change'],
        template_name: [requiredRules('模板名称')],
        template_content:[requiredRules('模板内容'), MaxRules(500),MinRules(1)],
        remark: [requiredRules('申请说明'), MaxRules(200)]
      },
      template_type_options:[],
      variables:[] , //可用的模板变量

      // 页面 edit 状态下 判断是否是首页加载 首次加载不用清空关联项
      isEditFirst:true



    }
  },
  mounted() {
    this.init()
  },
  watch:{
    async 'form.template_type'(template_type){
      const result = await getTemplateSeleteList({template_type})
      this.template_type_options = result.data.data.list;
      // 如是创建状态  把关联状态都清空
      const { type } = this.$route.query
      if (type == 'detail' || type=='edit' && this.isEditFirst) {
        return this.isEditFirst = false
      }
      this.form.scene_id = '';
      this.form.template_content = '';
      this.variables = [];
    },
    async 'form.scene_id'(id){
      console.log(id,`============`);
      const result = await getTemplateContentLabel({id});
      this.variables = result.data.data.variables
      if (this.$route.query.type=='edit' || this.$route.query.type=='detail') {
        return
      }
      this.form.template_content = result.data.data.default_template
      // console.log(result);
    }
  },
  methods: {
    async init() {
      const { type, id } = this.$route.query
      console.log(type, id)

      if (type) {
        const result = await SmsTemplateDetail({ id })
        this.resultHandler(result)
        if (type == 'detail') {
          this.disabled = true
        }
      }
    },
    resultHandler(result) {
      console.log(result);
      const { template_type, scene_id, template_name, template_content, remark } = result.data.data
      console.log(template_content);
      this.form = {
        template_type,
        scene_id:scene_id+'',
        template_name,
        template_content,
        remark
      }
      
      console.log(this.form);
    },
    submitForm(formName) {
      const { type, id } = this.$route.query
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            if (type == 'edit') {
              const result = await editSmsTemplate({id,...this.form})
              this.submitFormResult(result)
            } else {
              // 增加
              const result = await addSmsTemplate(this.form)

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
        path: `/setting/datamessage/ali_sms/sms_template`
      })
    },
    fnAgain(){
      this.resultVisible = false;
      this.$refs['form'].resetFields();
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
    /* -------------------------图片选择------------------------- */

    fnKey(item){
      const { type } = this.$route.query;
      if (type=='detail') return
      console.log(item);
      this.form.template_content = this.form.template_content+' ${'+item.var_title+'}'+' '
      
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
  .key{
    padding: 4px 10px;
    margin-right: 10px;
    border-radius: 10px;
    border:1px solid #409EFF;
    cursor:pointer;
    &.detail{
      background: #E4E7ED;
    }
  }
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