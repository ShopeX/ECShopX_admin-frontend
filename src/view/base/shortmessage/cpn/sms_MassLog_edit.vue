<template>
  <el-dialog title="群发短信" :visible="visible" :before-close="handleClose">
    <tips v-if="exterior">
      <p>
        推广短信由 [签名+模板] 组成，当前场景仅支持「推广短信」类型的模板，如需添加模板：点这里。
      </p>
      <p>单次最多可向1000个手机号码发送同样内容的短信，会有一定延迟。</p>
      <p>发送结果可在「设置-短信服务-短信发送记录-推广短信」查看。</p>
    </tips>
    <div class="sms_signatures_edit">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="任务名称" prop="task_name">
          <el-input
            v-model="form.task_name"
            :disabled="disabled"
            minlength="1"
            maxlength="30"
            show-word-limit
            placeholder="长度限1-30个字符"
          />
        </el-form-item>
        <el-form-item label="短信签名" prop="sign_id">
          <el-select
            v-model="form.sign_id"
            placeholder="请选择签名"
            style="width: 400px"
            :disabled="disabled"
          >
            <el-option
              v-for="item in sign_options"
              :key="item.id"
              :label="item.sign_name"
              :value="item.id"
            />
          </el-select>
          <div class="subtitle">
            没有需要的签名，马上
            <router-link to="/setting/systemsetting/datamessage/ali_sms/sms_signatures/edit">
              添加签名
            </router-link>
          </div>
        </el-form-item>
        <el-form-item label="短信模板" prop="template_id">
          <el-select
            v-model="form.template_id"
            placeholder="请选择模板"
            style="width: 400px"
            :disabled="disabled"
          >
            <el-option
              v-for="item in template_options"
              :key="item.id"
              :label="item.template_name"
              :value="item.id"
            />
          </el-select>
          <div class="subtitle">
            没有需要的签名，马上
            <router-link to="/systemsetting/datamessage/ali_sms/sms_template/edit">
              添加模板
            </router-link>
            <p>仅支持推广短信类型</p>
          </div>
        </el-form-item>
        <el-form-item label="定时发送">
          <el-switch
            v-model="form.timing"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item v-if="form.timing" label="" prop="send_at">
          <el-date-picker
            v-model="form.send_at"
            :disabled="disabled"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            @change="dateTimeChange"
          />
          <ul class="tips">
            <li>如需撤销，请在发送时间前5分钟操作</li>
          </ul>
        </el-form-item>
      </el-form>
      <!-- result
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
      </el-dialog> -->
    </div>
    <span v-if="info.type !== 'detail'" slot="footer" class="dialog-footer">
      <loadingBtn ref="loadingBtn" @clickHandle="submitForm('form')" />
      <el-button @click="fnBack">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { requiredRules, MaxRules, MinRules } from '@/utils/validate'
import loadingBtn from '@/components/loading-btn'
import tips from '@/components/tips'
import {
  getSmsSignatureList,
  getSmsTemplateList,
  taskSmsDetail,
  editTaskSms,
  addTaskSms
} from '@/api/sms'

export default {
  components: {
    loadingBtn,
    tips
  },
  props: {
    visible: {
      type: Boolean
    },
    info: {},
    exterior: {
      default: false
    },
    user_id: {
      default: []
    }
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
        user_id: ''
      },
      rules: {
        task_name: [requiredRules('任务名称')],
        sign_id: [requiredRules('短信签名'), 'change'],
        template_id: [requiredRules('短信模板', 'change')],
        send_at: [requiredRules('发送时间'), 'change']
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
      const { type, id } = this.info
      console.log(type, id)

      if (type != 'add') {
        const result = await taskSmsDetail({ id })
        this.resultHandler(result)
        if (type == 'detail') {
          this.disabled = true
        }
      }
    },
    resultHandler(result) {
      console.log(result)
      const { task_name, sign_id, template_id, send_at, user_id } = result.data.data
      this.form = {
        task_name,
        sign_id: sign_id + '',
        template_id: template_id + '',
        send_at: send_at * 1000 + '' || '',
        user_id,
        timing: send_at ? true : false
      }

      console.log(this.form)
    },
    submitForm(formName) {
      const { type, id } = this.info
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            if (type == 'edit') {
              const result = await editTaskSms({ id, ...this.form })
              this.$emit('updateFinder')
              this.submitFormResult(result)
            } else {
              // 增加
              var message = '确定发送该短信给勾选会员？'
              if (this.user_id.length == 0) {
                message = '确定发送该短信给全部会员？'
              }
              this.$confirm(message, '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(async () => {
                  const result = await addTaskSms({ ...this.form, user_id: this.user_id })
                  this.$refs['loadingBtn'].closeLoading()
                  this.submitFormResult(result)
                })
                .catch(() => {
                  this.$refs['loadingBtn'].closeLoading()
                })
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
        this.$message.success('成功')
        this.handleClose()
      }
      this.$refs['loadingBtn'].closeLoading()
      console.log(result)
    },
    fnBack() {
      this.handleClose()
    },
    // 获取短信签名下拉列表
    getSmsList() {
      getSmsSignatureList({ params: { status: '1' } }).then(res => {
        this.sign_options = res.data.data.list
      })

      getSmsTemplateList({ params: { status: '1', template_type: '2' } }).then(res => {
        this.template_options = res.data.data.list
      })
    },
    dateTimeChange(val) {
      this.form.send_at = val + ''
    },

    /* 群发短信弹框 */
    handleClose() {
      this.$emit('smsMassLogEditHandler')
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
  .subtitle {
    color: #999;
    font-size: 12px;
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
