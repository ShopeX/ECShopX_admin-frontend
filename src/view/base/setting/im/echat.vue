<template>
  <div>
    <div>
      <el-tabs
        v-model="activeName"
        type="border-card"
      >
        <el-tab-pane
          label="客服配置"
          name="first"
        >
          <template>
            <el-form
              ref="form"
              label-width="130px"
            >
              <el-form-item label="开启一洽客服">
                <el-switch
                  v-model="form.is_open"
                  active-value="true"
                  inactive-value="false"
                  inactive-color="#ccc"
                  active-text="开启"
                  inactive-text="关闭"
                  active-color="#13ce66"
                />
              </el-form-item>
              <el-form-item label="一洽客服链接地址">
                <el-input
                  v-model="form.echat_url"
                  style="width: 300px"
                  placeholder="请输入内容"
                />
              </el-form-item>

              <div class="section-footer with-border content-center">
                <el-button
                  type="primary"
                  @click="onSubmit"
                >
                  一洽客服保存
                </el-button>
              </div>
            </el-form>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getECahtSetting, saveEChatSetting } from '../../../../api/im'

export default {
  data () {
    return {
      loading: false,
      form: {
        is_open: '',
        echat_url: ''
      },
      activeName: 'first'
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      getECahtSetting().then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit () {
      saveEChatSetting(this.form)
        .then((response) => {
          this.$message({ message: '保存成功', type: 'success' })
          this.getInfo()
        })
        .catch()
    }
  }
}
</script>
<style lang="scss" scoped></style>
