<template>
  <el-dialog
    title="新增经销商"
    :visible.sync="visible"
    width='35%'
    :close-on-click-modal='false'
    :show-close="false"
    class="cus-dialog-css"
  >
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="企业名称" prop='username'>
        <el-input class="input-m" placeholder="请输入" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop='contact'>
        <el-input class="input-m" placeholder="请输入" v-model="form.contact"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop='mobile'>
        <el-input class="input-m" :maxlength='11' placeholder="请输入" v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop='login_name'>
        <el-input class="input-m" placeholder="请输入" v-model="form.login_name"></el-input>
      </el-form-item>
      <el-form-item label="默认密码" prop='password'>
        <el-input class="input-m" placeholder="请输入" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleModalConfirm(true)" type="primary">确认</el-button>
        <el-button @click="handleModalConfirm(false)" type="primary" plain>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addDealer } from '@/api/marketing'
export default {
  props: ['handleClose', 'visible'],
  data() {
    return {
      form: {
        username: '',
        contact: '',
        mobile: '',
        login_name: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入', trigger: "change" }],
        contact: [{ required: true, message: '请输入', trigger: "change" }],
        mobile: [{ required: true, message: '请输入', trigger: "change" }],
        login_name: [{ required: true, message: '请输入', trigger: "change" }],
        password: [{ required: true, message: '请输入', trigger: "change", validator: this.validateNumber }]
      },
    }
  },
  methods: {
    handleModalConfirm (visible) {
      if (visible) {
        this.$refs['form'].validate(async vaild => {
          if (vaild) {
            const { form } = this
            addDealer({...form, operator_type: 'dealer'}).then(() => {
              this.$message.success('新增成功')
              this.$emit('handleClose', false)
            }).catch(() => {
              this.$message.error('新增失败')
            })
          }
        })
      } else {
        this.$emit('handleClose', false)
      }
    },
    validateNumber (rule, value, callback) {
      if (value.length < 6 || value.length > 12) {
        callback(new Error('请输入6-12位密码'))
      } else {
        callback()
      }
    },
  },
}
</script>
<style lang="scss">
  .cus-dialog-css {
    .el-dialog__body {
      display: flex;
      justify-content: center
    }
  }
</style>
