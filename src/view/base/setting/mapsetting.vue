<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="map-setting">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="$t(item.name)"
        :name="item.activeName"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <div class="head-tips">
            {{ $t('815b208f.f5ec99') }}
            <el-link
              href="https://developer.amap.com/?ref=http%3A%2F%2Flbs.gaode.com%2Fdev%2F"
              target="_blank"
              type="primary"
            >
              {{ $t('815b208f.e07e1a') }}
            </el-link>
            ，进入 「我的应用」-「 创建新应用 」-「 添加新Key 」。
          </div>

          <el-form-item label="Key" prop="app_key" style="margin-bottom: 10px">
            <el-input v-model="form.app_key" style="width: 60%" type="textarea" :rows="6" />
          </el-form-item>
          <el-form-item label="">
            <div class="row-tip">{{ $t('815b208f.79421a') }}</div>
          </el-form-item>

          <el-form-item :label="$t('815b208f.cdb81c')" prop="app_secret" class="passwords">
            <el-input v-model="form.app_secret" style="width: 60%" :type="pass_type" :rows="6" />
            <i
              v-if="pass_type == 'textarea'"
              :title="$t('815b208f.dd909a')"
              class="iconfont icon-eye1 icons-class"
              @click="onChangePassIcon('password')"
            />
            <i
              v-else
              :title="$t('815b208f.dd909a')"
              class="iconfont icon-eye-slash1 icons-class"
              @click="onChangePassIcon('textarea')"
            />
          </el-form-item>

          <div class="section-footer with-border content-center">
            <el-button v-loading="loading" type="primary" @click="onSubmitChange">
{{
              $t('815b208f.be5fbb')
            }}
</el-button>
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
      tabList: [{ name: '815b208f.89d5c0', activeName: 'first' }]
    }
  },
  computed: {
    rules() {
      return {
        app_key: { required: true, message: this.$t('815b208f.02cc4f'), trigger: 'blur' },
        app_secret: { required: false, message: this.$t('815b208f.02cc4f'), trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.onGetConfig()
  },
  methods: {
    onGetConfig() {
      getMapSetting().then((response) => {
        this.form = response.data.data.list[0]
      })
    },
    onSubmitChange() {
      this.loading = true
      let query = {
        app_key: this.form.app_key,
        app_secret: this.form.app_secret,
        map_type: 'amap',
        is_default: 1
      }
      setMapSetting(query)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('815b208f.3b1083')
          })
          this.pass_type = 'password'
          this.onGetConfig()
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    onChangePassIcon(type) {
      this.pass_type = type
    }
  }
}
</script>
<style lang="scss">
.map-setting {
  .icons-class {
    position: absolute;
    top: 35%;
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
