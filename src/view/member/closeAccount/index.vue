<template>
  <div class="closeAccount">
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        label="注销配置"
        name="first"
      >
        <el-form
          ref="form"
          class="form"
          :model="form"
          :rules="rules"
          label-width="320px"
        >
          <el-form-item
            prop="title"
            label-width="350px"
            label="请配置有未完成的订单用户点击注销会员的弹窗内容"
          >
            <div class="title" />
            <el-input
              v-model="form.title"
              style="width: 500px"
              type="textarea"
              placeholder="请输入内容"
              maxlength="50"
              :autosize="{ minRows: 3 }"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            label="用户注销会员后重新注册是否享受新人权益："
            prop="new_rights"
          >
            <div class="title" />
            <el-select
              v-model="form.new_rights"
              placeholder="请选择"
            >
              <el-option
                label="是"
                value="1"
              >
                是
              </el-option>
              <el-option
                label="否"
                value="0"
              >
                否
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            style="margin-top: 100px; text-align: center"
            label-width="0px"
          >
            <!-- <el-button type="primary" @click="issuehandle('form', 'member_logout_config', 'draft')"
              >保存</el-button
            > -->
            <el-button
              type="primary"
              @click="issuehandle('form', 'member_logout_config', '')"
            >
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="注销协议"
        name="second"
      >
        <div class="mainSecond">
          <el-form
            ref="privacyForm"
            :model="privacyForm"
            :rules="rules"
            label-width="100px"
          >
            <div class="">
              <el-card
                class="box-card"
                shadow="never"
              >
                <p class="tips">
                  注销协议内容修改后，提交后对线上客户生效；注销协议在客户注销账号时须同意才可继续注销。
                </p>
                <div
                  class="text item"
                  style="margin-top: 30px"
                >
                  <el-form-item
                    label="更新日期"
                    prop="update_date"
                  >
                    <el-date-picker
                      v-model="privacyForm.update_date"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </el-form-item>
                  <el-form-item
                    label="生效日期"
                    prop="take_effect_date"
                  >
                    <el-date-picker
                      v-model="privacyForm.take_effect_date"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期"
                    />
                  </el-form-item>

                  <el-form-item
                    label="内容"
                    prop="content"
                  >
                    <vue-html5-editor
                      style="width: 90%"
                      :content="privacyForm.content"
                      :height="360"
                      @change="updateContent"
                    />
                  </el-form-item>
                </div>
              </el-card>
              <el-form-item style="margin-top: 40px; text-align: center; margin-right: 200px">
                <el-button
                  type="primary"
                  @click="issuehandle('privacyForm', 'member_logout')"
                >
                  提交
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
export default {
  data () {
    return {
      activeName: 'first',
      form: {
        title: '订单完成之前，无法注销会员。如有疑问，请联系客服',
        new_rights: '0' // 是否享受信任权益
      },
      privacyForm: {
        update_date: '',
        take_effect_date: '',
        content: ''
      },
      rules: {
        title: requiredRules('弹窗内容', 'change'),
        new_rights: requiredRules(''),
        update_date: [requiredRules('更新日期', 'change')],
        take_effect_date: requiredRules('生效日期', 'change')
      }
    }
  },
  mounted () {
    this.gitCurrentDate()
    this.getConfig()
    this.getConfig2()
  },
  methods: {
    async getConfig () {
      const { member_logout_config } = await this.$api.closeAccount.getInfo({
        type: 'member_logout_config'
      })
      const { title, new_rights } = member_logout_config

      // member_logout_config  注销配置。 member_resgiter  注销协议
      if (title) {
        this.form.title = title
        this.form.new_rights = new_rights || '0'
      }
    },
    async getConfig2 () {
      const { member_logout } = await this.$api.closeAccount.getInfo({
        type: 'member_logout'
      })
      const { content, update_date, take_effect_date } = member_logout
      // member_logout_config  注销配置。 member_resgiter  注销协议
      if (content) {
        this.privacyForm.update_date = update_date
        this.privacyForm.take_effect_date = take_effect_date
        this.privacyForm.content = content
      }
    },
    issuehandle (formName, type) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let obj
          if (type == 'member_logout_config') {
            obj = { type, ...this.form }
          } else {
            if (this.privacyForm.content.length == 0) {
              return this.$message.error('请填写内容')
            }
            obj = { type, ...this.privacyForm }
          }

          let a = {
            data: [obj]
          }
          const result = await this.$api.closeAccount.saveInfo(a)
          this.$message.success('提交成功')
          console.log(result)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateContent (val) {
      this.privacyForm.content = val
    },
    gitCurrentDate () {
      const date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }
      this.privacyForm.update_date = `${y + '-' + m + '-' + d}`
      this.privacyForm.take_effect_date = `${y + '-' + m + '-' + d}`
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding: 20px;
}
.tips {
  background: #999;
  font-size: 10px;
}
</style>

<style lang="scss">
.closeAccount {
  .el-card__body {
    padding: 0;
  }
  .tips {
    background: #f5f5f5;
    font-size: 10px;
    line-height: 3;
    padding: 0 10px;
  }
}
</style>
