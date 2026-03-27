<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('42850919.ff3d97')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" @click="confirmHandle">{{ $t('42850919.e83a25') }}</el-button>
      </div>
    </template>

    <el-form
      ref="dataForm"
      v-loading="formLoad"
      :model="ruleForm"
      :rules="rules"
      class="point-form"
      label-width="150px"
    >
      <el-row>
        <el-col :span="5">
          <div class="p-title">{{ $t('42850919.2940bd') }}</div>
        </el-col>
      </el-row>

      <el-card shadow="never">
        <el-row>
          <el-col>
            <el-form-item :label="$t('42850919.15864b')" prop="enable" label-width="110px">
              <el-switch v-model="ruleForm.enable" active-color="#13ce66" />
              <div class="tips unit" v-html="$t('42850919.63b444')" />
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item
              :label="$t('42850919.462203')"
              prop="max_day"
              class="last-ipt"
              label-width="180px"
            >
              <el-input
                v-model="ruleForm.max_day"
                :disabled="!ruleForm.enable"
                class="mipt"
                type="number"
                size="small"
                min="0"
                max="10"
              />
              <span class="unit">{{ $t('42850919.ee490f') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-row class="row-mar">
        <el-col :span="5">
          <div class="p-title">{{ $t('42850919.26e77a') }}</div>
        </el-col>
        <el-col :span="19">
          <div class="tips">{{ $t('42850919.715932') }}</div>
        </el-col>
      </el-row>

      <el-card shadow="never">
        <el-row>
          <el-col :span="14">
            <el-form-item :label="$t('42850919.6acaba')" prop="like_get_once">
              <el-input
                v-model="ruleForm.like_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.cc0c75') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              :label="$t('42850919.758ec9')"
              prop="like_get_max_times_day"
              label-width="60px"
            >
              <el-input
                v-model.number="ruleForm.like_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.249acf') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item :label="$t('42850919.bb8eab')" prop="comment_get_once">
              <el-input
                v-model="ruleForm.comment_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.cc0c75') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              :label="$t('42850919.758ec9')"
              prop="comment_get_max_times_day"
              label-width="60px"
            >
              <el-input
                v-model.number="ruleForm.comment_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.249acf') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item :label="$t('42850919.5e5365')" prop="share_get_once">
              <el-input
                v-model="ruleForm.share_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.cc0c75') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              :label="$t('42850919.758ec9')"
              prop="share_get_max_times_day"
              label-width="60px"
            >
              <el-input
                v-model.number="ruleForm.share_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.249acf') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item :label="$t('42850919.6bde47')" prop="favorite_get_once">
              <el-input
                v-model="ruleForm.favorite_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.cc0c75') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              :label="$t('42850919.758ec9')"
              prop="favorite_get_max_times_day"
              label-width="60px"
            >
              <el-input
                v-model.number="ruleForm.favorite_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.249acf') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item :label="$t('42850919.6b55fe')" prop="create_get_once">
              <el-input
                v-model="ruleForm.create_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.cc0c75') }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              :label="$t('42850919.758ec9')"
              prop="create_get_max_times_day"
              label-width="60px"
            >
              <el-input
                v-model.number="ruleForm.create_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">{{ $t('42850919.249acf') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </SpPage>
</template>
<script>
import { Message } from 'element-ui'
import { getUGCSetting, setUGCSetting } from '@/api/ugc'

export default {
  provide() {
    return {
      refresh: this.getFetch
    }
  },
  components: {},
  data() {
    return {
      formLoad: false,
      ruleForm: {
        enable: false,
        max_day: null,
        like_get_once: null,
        like_get_max_times_day: null,
        comment_get_once: null,
        comment_get_max_times_day: null,
        share_get_once: null,
        share_get_max_times_day: null,
        favorite_get_once: null,
        favorite_get_max_times_day: null,
        create_get_once: null,
        create_get_max_times_day: null
      },
      rules: {}
    }
  },
  computed: {
    rules() {
      const that = this
      const valNumer = (rule, value, callback) => {
        const { ruleForm } = that.$data
        const isfloat = parseInt(value, 10) != value
        if (!ruleForm.enable) {
          callback()
        } else if (value == null || value === '') {
          return callback(new Error(rule.msg))
        } else if (value < 0) {
          return callback(new Error(that.$t('42850919.9eb26f')))
        } else if (isfloat) {
          return callback(new Error(that.$t('42850919.e38515')))
        } else {
          callback()
        }
      }
      const valEnableNumer = (rule, value, callback) => {
        const { ruleForm } = that.$data
        const num = [
          ruleForm.like_get_once,
          ruleForm.comment_get_once,
          ruleForm.share_get_once,
          ruleForm.favorite_get_once,
          ruleForm.create_get_once
        ].sort((a, b) => parseInt(b) - parseInt(a))
        if (value < parseInt(num[0])) {
          return callback(new Error(rule.msg))
        }
        callback()
      }
      return {
        max_day: [
          { validator: valNumer, msg: that.$t('42850919.908bf7'), trigger: 'blur' },
          { validator: valEnableNumer, msg: that.$t('42850919.345f28'), trigger: 'blur' }
        ],
        like_get_once: [{ validator: valNumer, msg: that.$t('42850919.908bf7'), trigger: 'blur' }],
        like_get_max_times_day: [
          { validator: valNumer, msg: that.$t('42850919.3b47e1'), trigger: 'blur' }
        ],
        comment_get_once: [
          { validator: valNumer, msg: that.$t('42850919.908bf7'), trigger: 'blur' }
        ],
        comment_get_max_times_day: [
          { validator: valNumer, msg: that.$t('42850919.3b47e1'), trigger: 'blur' }
        ],
        share_get_once: [{ validator: valNumer, msg: that.$t('42850919.908bf7'), trigger: 'blur' }],
        share_get_max_times_day: [
          { validator: valNumer, msg: that.$t('42850919.3b47e1'), trigger: 'blur' }
        ],
        favorite_get_once: [
          { validator: valNumer, msg: that.$t('42850919.908bf7'), trigger: 'blur' }
        ],
        favorite_get_max_times_day: [
          { validator: valNumer, msg: that.$t('42850919.3b47e1'), trigger: 'blur' }
        ],
        create_get_once: [
          { validator: valNumer, msg: that.$t('42850919.908bf7'), trigger: 'blur' }
        ],
        create_get_max_times_day: [
          { validator: valNumer, msg: that.$t('42850919.3b47e1'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getFetch()
  },
  methods: {
    getFetch() {
      this.$data.formLoad = true
      getUGCSetting({ type: 'point' }).then(
        (res) => {
          // console.log('res',res.data.data)
          this.transForm(res.data.data)
          this.$data.formLoad = false
        },
        (err) => {
          this.$data.formLoad = false
        }
      )
    },
    transForm(data) {
      // console.log('data',data)
      var ruleForm = {
        enable: data['point_enable'] == '1',
        max_day: data['point_max_day'],
        like_get_once: data['point_post_like_get_once'],
        like_get_max_times_day: data['point_post_like_get_max_times_day'],
        share_get_once: data['point_post_share_get_once'],
        share_get_max_times_day: data['point_post_share_get_max_times_day'],
        comment_get_once: data['point_post_comment_get_once'],
        comment_get_max_times_day: data['point_post_comment_get_max_times_day'],
        favorite_get_once: data['point_post_favorite_get_once'],
        favorite_get_max_times_day: data['point_post_favorite_get_max_times_day'],
        create_get_once: data['point_post_create_get_once'],
        create_get_max_times_day: data['point_post_create_get_max_times_day']
      }
      //console.log('ruleForm',ruleForm)
      this.$data.ruleForm = ruleForm
    },
    formTrans() {
      const { ruleForm } = this.$data
      var params = { type: 'point', setting: null }
      var formtext = {
        point_enable: ruleForm.enable ? '1' : '0',
        point_max_day: ruleForm.max_day,
        point_post_like_get_once: ruleForm.like_get_once,
        point_post_like_get_max_times_day: ruleForm.like_get_max_times_day,
        point_post_share_get_once: ruleForm.share_get_once,
        point_post_share_get_max_times_day: ruleForm.share_get_max_times_day,
        point_post_comment_get_once: ruleForm.comment_get_once,
        point_post_comment_get_max_times_day: ruleForm.comment_get_max_times_day,
        point_post_favorite_get_once: ruleForm.favorite_get_once,
        point_post_favorite_get_max_times_day: ruleForm.favorite_get_max_times_day,
        point_post_create_get_once: ruleForm.create_get_once,
        point_post_create_get_max_times_day: ruleForm.create_get_max_times_day
      }
      params.setting = JSON.stringify(formtext)
      //console.log('formTrans',params);
      return params
    },
    confirmHandle() {
      const that = this
      const { ruleForm } = this.$data
      //console.log('ruleForm',ruleForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //console.log('confirmHandle submit!!',ruleForm);
          var params = that.formTrans()
          //console.log('confirmHandle params',params);
          // return false;
          setUGCSetting(params).then((res) => {
            var { message } = res.data.data
            this.$message({
              type: 'success',
              message
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped lang="css">
.point-form {
  width: 500px;
}
.p-title {
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}
.mipt {
  width: 60px;
}
.unit {
  margin-left: 10px;
}
.tips {
  display: inline-block;
  vertical-align: middle;
  line-height: 1.5;
  color: #999;
  font-size: 12px;
}
.row-mar {
  margin-top: 40px;
}
.last-ipt {
  margin-bottom: 0;
}
.el-form-item {
  margin-bottom: 10px;
}
.btn-bar {
  margin-top: 20px;
}
.point-form /deep/ .mipt input[type='number']::-webkit-inner-spin-button {
  appearance: none;
}
.point-form /deep/ .el-form-item {
  margin-bottom: 0px;
}
.point-form /deep/ .el-form-item__error {
  padding-top: 0;
}
</style>
