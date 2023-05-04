<template>
  <div class="section section-white">
    <div class="section-header with-border">报名活动添加/更改</div>
    <div class="section-body">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item
          label="活动名称"
          prop="activity_name"
          :rules="[{ required: true, message: '请输入活动名称', trigger: 'blur' }]"
        >
          <el-col :span="15">
            <el-input
              v-model.trim="form.activity_name"
              :maxlength="30"
              placeholder="名称"
              @change="fieldItemChange"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="活动有效时间" prop="activity_time">
          <el-col :span="15">
            <el-date-picker
              v-model="activity_date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="生效时间"
              end-placeholder="过期时间"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="timestamp"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="选择报名问卷模板"
          prop="temp_id"
          :rules="[{ required: true, message: '请选择报名问卷模板', trigger: 'blur' }]"
        >
          <el-col :span="15">
            <el-select v-model="form.temp_id" placeholder="请选择" @change="selectTempId">
              <el-option
                v-for="item in temp_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          label="提交报名次数"
          prop="join_limit"
          :rules="[{ required: true, message: '请输入报名次数', trigger: 'blur' }]"
        >
          <el-col :span="15">
            <el-input
              v-model.trim="form.join_limit"
              type="number"
              placeholder="次数"
              @change="fieldItemChange"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="是否开启短信通知" prop="is_sms_notice">
          <el-col :span="15">
            <div class="clearfix">
              <el-switch
                v-model="form.is_sms_notice"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <el-card v-if="form.is_sms_notice" class="box-card">
                <div class="text item">
                  您参与的"活动名称"活动，已经"审核结果"(允许参与 或 已拒绝)
                </div>
              </el-card>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="是否开启小程序通知" prop="is_wxapp_notice">
          <el-col :span="15">
            <div class="clearfix">
              <el-switch
                v-model="form.is_wxapp_notice"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <el-card v-if="form.is_wxapp_notice" class="box-card">
                <div slot="header" class="clearfix">
                  <span>报名结果通知</span>
                </div>
                <div class="text item">活动名称：{{ form.activity_name }}</div>
                <div class="text item">报名结果：报名已通过(或 报名被拒绝)</div>
              </el-card>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="handleCancel"> 取消 </el-button>
          <el-button type="primary" @click="submitAction"> 保存 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  regActivityAdd,
  regActivityGet,
  regActivityUpdate,
  getTemplateList
} from '../../../api/selfhelpform'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'

export default {
  inject: ['refresh'],
  components: {
    imgPicker,
    imgBox
  },
  data() {
    return {
      pickerOptions: {},
      activity_date: [],
      form: {
        activity_name: '',
        activity_time: '',
        start_time: '',
        end_time: '',
        join_limit: ''
      },
      templateParams: {
        page: 1,
        pageSize: 10,
        tem_name: '',
        // tem_type: 'ask_answer_paper',
        is_valid: 1
      },
      temp_options: [],
      formText: false,
      formTextarea: false,
      formRadio: false,
      formCheckbox: false,
      formSelect: false,
      formLable: '',
      formName: '',
      imgDialog: false,
      isGetImage: false,
      imgIndex: 0
    }
  },
  mounted() {
    this.getTemplateList()
    if (this.$route.query.id) {
      let filter = { activity_id: this.$route.query.id }
      regActivityGet(filter).then((res) => {
        this.form = res.data.data
        this.activity_date = [this.form.start_time * 1000, this.form.end_time * 1000]
      })
    }
  },
  methods: {
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    selectTempId(e) {},
    fieldItemChange(val) {},
    submitAction() {
      const that = this
      if (that.activity_date.length > 0) {
        this.form.start_time = that.activity_date[0] / 1000
        this.form.end_time = that.activity_date[1] / 1000
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.activity_id) {
            regActivityUpdate(this.form).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          } else {
            regActivityAdd(this.form).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请录入正确的数据'
          })
          return false
        }
      })
    },
    handleCancel() {
      this.$router.go(-1)
    },
    getTemplateList() {
      this.loading = true
      getTemplateList(this.templateParams).then((response) => {
        response.data.data.list.map((item) => {
          this.temp_options.push({
            label: item.tem_name,
            value: item.id
          })
        })
        // this.temp_options = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 1px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 480px;
}
</style>
