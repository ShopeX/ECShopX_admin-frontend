<template>
  <div class="merchantAccount">
    <SpFinder
      ref="finder"
      :split-count="2"
      :search-row-count="2"
      :fixed-row-action="true"
      :setting="setting"
      no-selection
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/merchant/operator"
    />
    <el-dialog
      title="编辑账号信息"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="form"
        label-width="60px"
      >
        <el-form-item label="登录账号">
          <span>{{ form.mobile }}</span>
          <!-- <el-input v-model="form.mobile" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="off"
            style="max-width: 160px"
          />
          <span style="color: #999"> 密码6-16位，支持字母、数字、下划线</span>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="handleClose"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="fnConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import setting_ from './setting'
import { setChangePassword, updateTheMerchantInfo } from '@/api/mall/marketing.js'
export default {
  data () {
    return {
      visible: false,
      form: {
        mobile: '',
        password: ''
      },
      currentUser: {
        id: ''
      }
    }
  },
  computed: {
    setting () {
      return setting_(this)
    }
  },
  methods: {
    fnChangePassword (row) {
      const message = `<p>请确认是否重置【商户名称】的密码<br/><span class='tips'>（新密码将以短信形式发送至其手机号上，<br/>短信费用将从短信余额中扣除）</span></p>`
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true,
        center: true
      }).then(async () => {
        const result = await setChangePassword(row.operator_id)
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
      })

      console.log(row)
    },
    beforeSearch (params) {
      return { ...params }
    },
    async fnConfirm () {
      const result = await updateTheMerchantInfo({
        operator_id: this.currentUser.id,
        password: this.form.password
      })
      if (result.data.data.status) {
        this.$message.success('修改成功')
        this.handleClose()
      }
    },
    editHandler (row) {
      console.log(row)
      this.visible = true
      this.form.mobile = row.mobile
      this.currentUser.id = row.operator_id
    },
    handleClose () {
      this.visible = false
      this.form.password = ''
      this.currentUser.id = ''
    }
  }
}
</script>

<style lang="scss">
.merchantAccount {
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
  .el-dialog__footer {
    border-top: 1px solid #ccc;
  }
  .yahh {
    color: #409eff;
  }
  .el-button--text {
    color: red;
  }
  .sp-finder-search .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .clearfix span {
    font-weight: 700;
  }
  .search-field {
    width: 500px !important;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  .el-row {
    margin-bottom: 0px;
  }
  .el-table th {
    background: #f5f5f5;
    color: #000;
  }
  .btn {
    border: none;
  }
}
</style>

<style lang="scss" scoped>
.merchantAccount {
  .group {
    margin: 30px 0;
    border: 1px solid #f5f5f5;
    .item {
      padding: 14px 0;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      .state {
        font-size: 14px;
        color: #000;
        font-weight: 300;
        margin-bottom: 20px;
      }
      .title {
        margin-bottom: 10px;
        border-right: 1px solid #000;
      }
    }
  }
  .tablelist {
    margin: 40px 0;
  }
  .pagination {
    margin: 20px 0;
    text-align: center;
  }
  .tips {
    .title {
      font-size: 15px;
    }
  }
}
</style>
