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
            style="width:50%"
            type="textarea"
            :rows="5"
            v-model="form.app_key" 
          />
          </el-form-item>
          <el-form-item label="  ">
            <div class="row-tip">Key 不填写或填写错误将导致该功能无法使用，请确保填写正确。</div>
          </el-form-item>

          <el-form-item label="密钥" prop="app_secret" class="passwords">
            <el-input
              style="width:50%"
              v-model="form.app_secret"
              type="textarea"
              :rows="5"
            />
              <i
              title="隐藏密码"
              v-if="pass_type == 'eye'"
              class="iconfont icon-eye1 icons-class"
              @click="changePassIcon('hide')"
            />
              <i
              v-else
              title="隐藏密码"
              class="iconfont icon-eye-slash1 icons-class"
              @click="changePassIcon('eye')"
            />
          </el-form-item>

          <div class="section-footer with-border content-center">
            <el-button type="primary" v-loading="loading" @click="onSubmit">保存</el-button>
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
      form: {
        app_key: '',
        app_secret: ''
      },
      rules: {
        app_key: { required: true, message: '请输入', trigger: 'blur' },
        app_secret: { required: true, message: '请输入', trigger: 'blur' }
      },
      pass_type: 'eye'
    }
  },
  methods: {
    getConfig () {
      getMapSetting().then(response => {
        console.log(response)
        this.form = response.data.data.list[0]
      })
    },
    onSubmit () {
      this.loading = true
      let query = {
        ...this.form
      }
      setMapSetting(query).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.getConfig()
        this.loading = false
      })
      .catch(error => {
        this.loading = false
      })
    },
    changePassIcon (type) {
      console.log(type)
      this.pass_type = type
    }
  },
  mounted() {
    this.getConfig()
  }
}
</script>
<style scoped lang="scss">
.map-setting {
  .icons-class {
    position: absolute;
    top:35%;
    left: 53%;
    font-size: 18px;
    cursor: pointer;
  }
  .passwords {
    .el-input {
      width: 50%;
      position: relative;
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
