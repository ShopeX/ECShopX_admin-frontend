<template>
  <SpPage>
    <el-form
      ref="dataForm"
      v-loading="formLoad"
      :model="ruleForm"
      :rules="rules"
      class="point-form"
      label-width="140px"
    >
      <el-row>
        <el-col :span="5">
          <div class="p-title">第三方审核对接设置</div>
        </el-col>
        <el-col :span="19">
          <div class="tips">请填写对接所需要的内容并点击保存</div>
        </el-col>
      </el-row>

      <el-card shadow="never">
        <el-row>
          <el-col>
            <el-form-item label="开启第三方审核" prop="enable" class="last-ipt">
              <el-switch v-model="ruleForm.enable" active-color="#13ce66" />
              <div class="tips unit">开启后用户的笔记首先会经过机审。</div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="API接入地址" prop="url" class="last-ipt">
              <el-input v-model="ruleForm.url" class="mipt" size="small" />
              <span class="tips unit">内容检测API配置管理服务</span>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="AccessKeyID" prop="appid" class="last-ipt">
              <el-input v-model="ruleForm.appid" class="mipt" size="small" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="AccessKeySecret" prop="appsecret" class="last-ipt">
              <el-input v-model="ruleForm.appsecret" class="mipt" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>

    <el-row class="btn-bar">
      <el-col>
        <el-button type="primary" @click="confirmHandle"> 确认 </el-button>
      </el-col>
    </el-row>
  </SpPage>
</template>
<script>
import { Message } from 'element-ui'
import { getUGCSetting, setUGCSetting } from '@/api/ugc'

export default {
  provide() {
    return {
      refresh: this.getFetch
    }
  },
  components: {},
  data() {
    return {
      formLoad: false,
      ruleForm: {
        enable: false,
        url: null,
        appid: null,
        appsecret: null
      },
      rules: {
        url: [{ required: true, message: '请填写接入地址', trigger: 'blur' }],
        appid: [{ required: true, message: '请填写AccessKeyID', trigger: 'blur' }],
        appsecret: [{ required: true, message: '请填写AccessKeySecret', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getFetch()
  },
  methods: {
    getFetch() {
      this.$data.formLoad = true
      getUGCSetting({ type: 'contentCheck' }).then(
        res => {
          // console.log('res',res.data.data)
          var { data } = res.data
          var ruleForm = {
            enable: data['contentCheck_enable'] == '1',
            url: data['contentCheck_url'],
            appid: data['contentCheck_appid'],
            appsecret: data['contentCheck_appsecret']
          }
          this.$data.ruleForm = ruleForm
          this.$data.formLoad = false
        },
        err => {
          this.$data.formLoad = false
        }
      )
    },
    formTrans() {
      const { ruleForm } = this.$data
      var params = { type: 'contentCheck', setting: null }
      var formtext = {
        contentCheck_enable: ruleForm.enable ? '1' : '0',
        contentCheck_url: ruleForm.url,
        contentCheck_appid: ruleForm.appid,
        contentCheck_appsecret: ruleForm.appsecret
      }
      params.setting = JSON.stringify(formtext)
      //console.log('formTrans',params);
      return params
    },
    confirmHandle() {
      const that = this
      const { ruleForm } = this.$data
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          //console.log('confirmHandle submit!!',ruleForm);
          //console.log('confirmHandle submit!!',ruleForm);
          var params = that.formTrans()
          //console.log('confirmHandle params',params);
          // return false;
          setUGCSetting(params).then(res => {
            var { message } = res.data.data
            this.$message({
              type: 'success',
              message
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang="css">
.point-form {
  width: 700px;
}
.p-title {
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}
.mipt {
  width: 300px;
}
.unit {
  margin-left: 10px;
}
.tips {
  display: inline-block;
  vertical-align: middle;
  line-height: 1.5;
  color: #999;
  font-size: 12px;
}
.el-form-item {
  margin-bottom: 10px;
}
.btn-bar {
  margin-top: 20px;
}
.point-form /deep/ .el-form-item__error {
  padding-top: 0;
}
</style>
