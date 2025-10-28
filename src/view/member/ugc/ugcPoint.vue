<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage title="评论设置">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" @click="confirmHandle"> 确认 </el-button>
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
          <div class="p-title">全局积分设置</div>
        </el-col>
      </el-row>

      <el-card shadow="never">
        <el-row>
          <el-col>
            <el-form-item label="开启全局积分" prop="enable" label-width="110px">
              <el-switch v-model="ruleForm.enable" active-color="#13ce66" />
              <div class="tips unit">
                开启后用户可通过特定行为获得积分，<br>下方所有设置将生效。
              </div>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item
              label="每位会员每日最多可获得"
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
              <span class="unit">积分。</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-row class="row-mar">
        <el-col :span="5">
          <div class="p-title">社区积分设置</div>
        </el-col>
        <el-col :span="19">
          <div class="tips">用户在社区内产生行为所能获得积分的设置</div>
        </el-col>
      </el-row>

      <el-card shadow="never">
        <el-row>
          <el-col :span="14">
            <el-form-item label="点赞笔记每次可获得" prop="like_get_once">
              <el-input
                v-model="ruleForm.like_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">积分,</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="最多" prop="like_get_max_times_day" label-width="60px">
              <el-input
                v-model.number="ruleForm.like_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">次。</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="评论笔记每次可获得" prop="comment_get_once">
              <el-input
                v-model="ruleForm.comment_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">积分,</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="最多" prop="comment_get_max_times_day" label-width="60px">
              <el-input
                v-model.number="ruleForm.comment_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">次。</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="分享笔记每次可获得" prop="share_get_once">
              <el-input
                v-model="ruleForm.share_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">积分,</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="最多" prop="share_get_max_times_day" label-width="60px">
              <el-input
                v-model.number="ruleForm.share_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">次。</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="收藏笔记每次可获得" prop="favorite_get_once">
              <el-input
                v-model="ruleForm.favorite_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">积分,</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="最多" prop="favorite_get_max_times_day" label-width="60px">
              <el-input
                v-model.number="ruleForm.favorite_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">次。</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="发布笔记每次可获得" prop="create_get_once">
              <el-input
                v-model="ruleForm.create_get_once"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">积分,</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="最多" prop="create_get_max_times_day" label-width="60px">
              <el-input
                v-model.number="ruleForm.create_get_max_times_day"
                :disabled="!ruleForm.enable"
                type="number"
                class="mipt"
                size="small"
                max="10"
              />
              <span class="unit">次。</span>
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
    const valNumer = (rule, value, callback) => {
      var { ruleForm } = this.$data
      var isfloat = parseInt(value, 10) != value
      //console.log('valNumer',value,rule)
      if (!ruleForm.enable) {
        callback()
      } else if (value == null || value == '') {
        return callback(new Error(rule.msg))
      } else if (value < 0) {
        return callback(new Error('不能小于0'))
      } else if (isfloat) {
        return callback(new Error('必须是整数'))
      } else {
        callback()
      }
    }
    const valEnableNumer = (rule, value, callback) => {
      var { ruleForm } = this.$data
      var num = [
        ruleForm.like_get_once,
        ruleForm.comment_get_once,
        ruleForm.share_get_once,
        ruleForm.favorite_get_once,
        ruleForm.create_get_once
      ]
      num = num.sort((a, b) => parseInt(b) - parseInt(a))
      //console.log('valNumer farr',num,value<num[0],value,num[0])
      if (value < parseInt(num[0])) {
        return callback(new Error(rule.msg))
      } else {
        callback()
      }
    }
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
      rules: {
        max_day: [
          { validator: valNumer, msg: '请填写积分', trigger: 'blur' },
          {
            validator: valEnableNumer,
            msg: '每日积分不可小于任一行为所获得的积分值',
            trigger: 'blur'
          }
        ],
        like_get_once: [{ validator: valNumer, msg: '请填写积分', trigger: 'blur' }],
        like_get_max_times_day: [{ validator: valNumer, msg: '请填写次数', trigger: 'blur' }],
        comment_get_once: [{ validator: valNumer, msg: '请填写积分', trigger: 'blur' }],
        comment_get_max_times_day: [{ validator: valNumer, msg: '请填写次数', trigger: 'blur' }],
        share_get_once: [{ validator: valNumer, msg: '请填写积分', trigger: 'blur' }],
        share_get_max_times_day: [{ validator: valNumer, msg: '请填写次数', trigger: 'blur' }],
        favorite_get_once: [{ validator: valNumer, msg: '请填写积分', trigger: 'blur' }],
        favorite_get_max_times_day: [{ validator: valNumer, msg: '请填写次数', trigger: 'blur' }],
        create_get_once: [{ validator: valNumer, msg: '请填写积分', trigger: 'blur' }],
        create_get_max_times_day: [{ validator: valNumer, msg: '请填写次数', trigger: 'blur' }]
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
        res => {
          // console.log('res',res.data.data)
          this.transForm(res.data.data)
          this.$data.formLoad = false
        },
        err => {
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          //console.log('confirmHandle submit!!',ruleForm);
          var params = that.formTrans()
          //console.log('confirmHandle params',params);
          // return false;
          setUGCSetting(params).then(res => {
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
