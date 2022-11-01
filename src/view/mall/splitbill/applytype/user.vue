<template>
  <div>
    <el-alert
      v-if="form_user.status == 4"
      title="审核失败"
      type="error"
      show-icon
      center
      :description="form_user.resp_desc"
      :closable="false"
    />
    <el-divider v-if="form_user.status == 4" />
    <div class="formClass">
      <el-form
        ref="form_user"
        :model="form_user"
        label-width="150px"
        :rules="solo_rules"
      >
        <el-form-item label="账号认证类型">
          <el-button
            type="success"
            round
            size="mini"
          >
            个人
          </el-button>
        </el-form-item>
        <el-form-item
          label="用户姓名"
          prop="user_name"
        >
          <el-input
            v-model="form_user.user_name"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="user_mobile"
        >
          <el-input
            v-model="form_user.user_mobile"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="证件类型"
          prop="id_card_type"
        >
          <el-select
            v-model="form_user.id_card_type"
            placeholder="选择证件类型"
            :disabled="disabled"
            @visible-change="(bool) => (isEdit = bool)"
          >
            <el-option
              v-for="item in cardType"
              :key="item.card_type"
              :label="item.label"
              :value="item.card_type"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="身份证号码"
          prop="id_card"
        >
          <el-input
            v-model="form_user.id_card"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="结算银行卡号"
          prop="bank_acct_num"
        >
          <el-input
            v-model="form_user.bank_acct_num"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="!disabled"
            type="primary"
            @click="onUserSubmit"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { saveHffile, getHffile } from '@/api/fenzhang'
import { vaildateIdCard, isMobile, validEmail } from '@/utils/validate'
export default {
  data () {
    let vaildMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('请填写正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      disabled: false,
      isEdit: false,
      cardType: [
        {
          'card_type': '10',
          'label': '身份证'
        }
      ],
      form_user: {
        apply_type: '3',
        user_name: '',
        user_mobile: '',
        id_card_type: '',
        id_card: '',
        bank_acct_num: ''
      },
      solo_rules: {
        apply_type: [{ required: true, message: '账号认证类型', trigger: 'blur' }],
        user_name: [{ required: true, message: '请填写用户姓名', trigger: 'blur' }],
        user_mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { validator: vaildMobile, trigger: 'blur' }
        ],
        id_card_type: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
        id_card: [{ required: true, message: '请填写证件号码', trigger: 'blur' }],
        bank_acct_num: [{ required: true, message: '请填写结算银行卡号', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    let { id, type } = this.$route.query
    this.form_user.distributor_id = id
    let disabled = type == 0 ? true : false
    this.disabled = disabled
    this.$forceUpdate()
    this.getUserData()
  },
  methods: {
    async getUserData () {
      let distributor_id = this.form_user.distributor_id
      let apply_type = this.form_user.apply_type
      let res = await getHffile({ distributor_id, apply_type })
      let { data } = res
      data = data.data
      console.log(data)
      delete data.user_id
      delete data.user_cust_id
      delete data.acct_id
      delete data.created_at
      delete data.updated_at
      this.form_user = {
        ...this.form_user,
        bank_acct_num: data.bank_acct_num,
        user_name: typeof data.user_name != 'undefined' ? data.user_name : '',
        user_mobile: typeof data.user_mobile != 'undefined' ? data.user_mobile : '',
        id_card_type: typeof data.id_card_type != 'undefined' ? data.id_card_type : '',
        id_card: typeof data.id_card != 'undefined' ? data.id_card : ''
      }
      console.log(this.form_user)
    },
    onUserSubmit () {
      this.$refs.form_user.validate((valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form_user))
          console.log(obj)
          saveHffile(obj).then((res) => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(-1)
            }, 500)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.formClass {
  width: 600px;
  margin: 0 auto;
}
.el-row {
  margin-bottom: 0px !important;
}

.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  &:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
