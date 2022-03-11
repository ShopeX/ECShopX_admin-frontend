<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
  >
    <el-tab-pane
      label="顺丰BSP"
      name="sfbsp"
    >
      <el-form
        ref="form"
        label-width="100px"
      >
        <el-form-item label="接入地址">
          <el-input
            v-model="sfbsp_form.config.url"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="接入编码">
          <el-input
            v-model="sfbsp_form.config.accesscode"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="Checkword">
          <el-input
            v-model="sfbsp_form.config.checkword"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="sfbsp_form.config.is_open"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button
            v-loading="loading"
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
        </div>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { getSfbspSetting, seSfbspSetting } from '../../../api/trade'
export default {
  data () {
    return {
      activeName: 'sfbsp',
      loading: false,
      sfbsp_form: {
        config: {
          url: '',
          accesscode: '',
          checkword: '',
          is_open: false
        }
      }
    }
  },
  mounted () {
    this.getConfig()
  },
  methods: {
    // handleClick () {
    //   this.getConfig()
    // },
    getConfig () {
      let query = {}
      if (this.activeName === 'sfbsp') {
        // query = {kuaidi_type: 'kdniao'}
        getSfbspSetting(query).then((response) => {
          const data = response.data.data
          if (!Array.isArray(data)) {
            if (data.is_open == 'true') {
              data.is_open = true
            } else {
              data.is_open = false
            }
            this.sfbsp_form.config = data
          }
        })
      }
    },
    onSubmit () {
      this.loading = true
      let query = {}
      if (this.activeName === 'sfbsp') {
        query = this.sfbsp_form
      } else {
        query = this.form
      }
      seSfbspSetting(query)
        .then((response) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
