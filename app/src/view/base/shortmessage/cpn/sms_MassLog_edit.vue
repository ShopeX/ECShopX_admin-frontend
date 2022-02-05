<template>
  <div class="sms_signatures_edit">
    <h4>群发短信</h4>
    <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-ruleForm">
      <el-form-item label="任务名称" prop="task_name">
        <el-input
          :disabled="disabled"
          v-model="form.task_name"
          minlength="1"
          maxlength="30"
          show-word-limit
          placeholder="长度限1-30个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="短信签名" prop="sign_id">
        <el-select
          v-model="form.sign_id"
          placeholder="请选择"
          style="width: 400px"
          :disabled="disabled"
        >
          <el-option
            v-for="item in sign_options"
            :key="item.id"
            :label="item.sign_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信模板" prop="template_id">
        <el-select
          v-model="form.template_id"
          placeholder="请选择"
          style="width: 400px"
          :disabled="disabled"
        >
          <el-option
            v-for="item in template_options"
            :key="item.id"
            :label="item.scene_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="定时发送">
        <el-switch v-model="form.timing" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="" prop="send_at" v-if="form.timing">
        <el-date-picker v-model="form.send_at" type="datetime" placeholder="选择日期时间"  value-format="yyyy-MM-dd HH:mm:ss" >
        </el-date-picker>
        <ul class="tips">
          <li>如需撤销，请在发送时间前5分钟操作</li>
        </ul>
      </el-form-item>
      <el-form-item v-if="$route.query.type !== 'detail'">
        <!-- <el-button type="primary" @click="submitForm('form')">确定</el-button> -->
        <loadingBtn @clickHandle="submitForm('form')" ref="loadingBtn" />
        <el-button @click="fnBack">取消</el-button>

      </el-form-item>
    </el-form>

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
  getSmsSignatureList,
  getSmsTemplateList,
  taskSmsDetail,
  getTemplateSeleteList,
  getTemplateContentLabel,
  addSmsTemplate,
  SmsTemplateDetail,
  editSmsTemplate
} from '@/api/sms'

export default {
  components: {
    loadingBtn
  },
  data() {
    return {
      // 页面状态
      disabled: false,
      // 图片选择
      // result
      resultVisible: false,

      form: {
        task_name: '',
        sign_id: '',
        template_id: '',
        timing: true,
        send_at: '',
        user_id:''
      },
      rules: {
        task_name: [requiredRules('任务名称')],
        sign_id: [requiredRules('短信签名'), 'change'],
        template_id: [requiredRules('短信模板','change')],
        send_at: [requiredRules('发送时间'),'change']
      },
      sign_options: [],
      template_options: []
    }
  },
  mounted() {
    this.init()
    this.getSmsList()
  },
  methods: {
    async init() {
      const { type, id } = this.$route.query
      console.log(type, id)

      if (type) {
        const result = await taskSmsDetail({ id })
        this.resultHandler(result)
        if (type == 'detail') {
          this.disabled = true
        }
      }
    },
    resultHandler(result) {
      console.log(result)
      const { task_name, sign_id, template_id, send_at,user_id } = result.data.data
      this.form = {
        task_name,
        sign_id: sign_id + '',
        template_id:template_id+'',
        send_at:send_at,
        user_id
      }

      console.log(this.form)
    },
    submitForm(formName) {
      const { type, id } = this.$route.query
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            if (type == 'edit') {
              const result = await editSmsTemplate({ id, ...this.form })
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
    // 获取短信签名下拉列表
    getSmsList() {
      getSmsSignatureList({ params: { status: '1' } }).then((res) => {
        this.sign_options = res.data.data.list
      })

      getSmsTemplateList({ params: { status: '1', template_type: '2' } }).then((res) => {
        this.template_options = res.data.data.list
      })
    },
    fnKey(item) {
      const { type } = this.$route.query
      if (type == 'detail') return
      console.log(item)
      this.form.template_content = this.form.template_content + ' ${' + item.var_title + '}' + ' '
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
  .key {
    padding: 4px 10px;
    margin-right: 10px;
    border-radius: 10px;
    border: 1px solid #409eff;
    cursor: pointer;
    &.detail {
      background: #e4e7ed;
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