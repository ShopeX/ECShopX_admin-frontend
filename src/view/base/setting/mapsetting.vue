<template>
  <div class="map-setting">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="高德地图配置" name="first">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <div class="head-tips">
            高德地图Key获取路径：
            <el-link
              href="https://developer.amap.com/?ref=http%3A%2F%2Flbs.gaode.com%2Fdev%2F"
              target="_blank"
              type="primary"
            >
              高德地图控制台
            </el-link>
            ，进入 「我的应用」-「 创建新应用 」-「 添加新Key 」。
          </div>

          <el-form-item label="Key" prop="app_key" style="margin-bottom: 10px">
            <el-input
              style="width:60%"
              type="textarea"
              v-model="form.app_key" 
              :rows="6"
            />
          </el-form-item>
          <el-form-item label="">
            <div class="row-tip">Key 不填写或填写错误将导致该功能无法使用，请确保填写正确。</div>
          </el-form-item>

          <el-form-item label="密钥" prop="app_secret" class="passwords">
            <el-input
              style="width:60%"
              v-model="form.app_secret"
              :type="pass_type"
              :rows="6"
            />
            <i
              v-if="pass_type == 'textarea'"
              title="隐藏密码"
              class="iconfont icon-eye1 icons-class"
              @click="onChangePassIcon('password')"
            />
            <i
              v-else
              title="隐藏密码"
              class="iconfont icon-eye-slash1 icons-class"
              @click="onChangePassIcon('textarea')"
            />
          </el-form-item>

          <div class="section-footer with-border content-center">
            <el-button type="primary" v-loading="loading" @click="onSubmitChange">保存</el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { setMapSetting, getMapSetting } from '@/api/third'
export default {
  data() {
    return {
      loading: false,
      activeName: 'first',
      pass_type: 'password',
      form: {
        app_key: '',
        app_secret: ''
      },
      rules: {
        app_key: { required: true, message: '请输入', trigger: 'blur' },
        app_secret: { required: false, message: '请输入', trigger: 'blur' }
      }
    }
  },
  methods: {
    onGetConfig () {
      getMapSetting().then(response => {
        this.form = response.data.data.list[0]
      })
    },
    onSubmitChange () {
      this.loading = true
      let query = {
        app_key: this.form.app_key,
        app_secret: this.form.app_secret,
        map_type: 'amap',
        is_default: 1
      }
      setMapSetting(query).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.pass_type = 'password'
        this.onGetConfig()
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    onChangePassIcon (type) {
      this.pass_type = type
    }
  },
  mounted() {
    this.onGetConfig()
  }
}
</script>
<style lang="scss">
.map-setting {
  .icons-class {
    position: absolute;
    top:35%;
    left: 63%;
    font-size: 16px;
    cursor: pointer;
  }
  .passwords {
    .el-input {
      width: 50%;
      position: relative;
      height: 138px;
    }
    .el-input__inner {
      height: 138px;
    }
  }
  .el-row {
    margin-bottom: 10px;
  }
  .head-tips {
    margin: 10px 20px 20px 20px;
    background: #eef8fd;
    padding: 10px 10px;
    font-size: 14px;
  }
  .row-tip {
    font-size: 12px;
    color: #999;
  }
}

</style>
