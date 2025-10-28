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
  <div>
    <el-dialog
      title="官方号设置"
      :before-close="handleCancelLabelsDialog"
      :visible.sync="dialogIsShow"
      width="30%"
    >
      <div class="tips">所有官方笔记都将改下设置的账户名称及头像进行展示。</div>
      <el-form
        ref="dataForm"
        v-loading="formLoad"
        :model="ruleForm"
        :rules="rules"
        class="official-form"
        label-width="100px"
      >
        <el-row>
          <el-col>
            <el-form-item label="账户名称" prop="nickname" class="last-ipt">
              <el-input
                v-model="ruleForm.nickname"
                maxlength="20"
                :show-word-limit="true"
                class="mipt"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="账户头像" prop="avatar" class="last-ipt">
              <div :class="['img-wrap', ruleForm.avatar ? 'mask' : null]">
                <el-image
                  v-if="ruleForm.avatar"
                  style="width: 100%; height: 100%"
                  :src="ruleForm.avatar"
                />
                <div v-if="ruleForm.avatar" class="goodspic-mask" @click="removePicsImg">
                  <div class="iconfont icon-trash-alt" />
                </div>
                <div v-else class="goodspic-mask" @click="handlePicsChange">
                  <div class="iconfont iconfont icon-camera" />
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="confirmHandle"> 确认 </el-button>
        <el-button @click="handleCancelLabelsDialog"> 取消 </el-button>
      </div>
    </el-dialog>
    <imgPicker
      :dialog-visible="picsDialog"
      :sc-status="isGetPics"
      @chooseImg="pickPics"
      @closeImgDialog="closePicsDialog"
    />
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getUGCSetting, setUGCSetting } from '@/api/ugc'
import imgPicker from '@/components/imageselect'
export default {
  components: {
    imgPicker
  },
  props: {
    dialogIsShow: Boolean
  },
  data() {
    return {
      formLoad: false,
      ruleForm: {
        nickname: null,
        avatar: null
      },
      rules: {
        nickname: [{ required: true, message: '请填写账户名称', trigger: 'blur' }],
        avatar: [{ required: true, message: '请选择账户头像', trigger: 'blur' }]
      },
      picsDialog: false,
      isGetPics: false,
      multiple: false
    }
  },
  mounted() {
    this.getFetch()
  },
  methods: {
    getFetch() {
      getUGCSetting({ type: 'official' }).then(res => {
        var { data } = res.data
        var ruleForm = {
          nickname: data['official.nickname'],
          avatar: data['official.headerimgurl']
        }
        this.$data.ruleForm = ruleForm
      })
    },
    pickPics(data) {
      //console.log('d',data)
      this.ruleForm.avatar = data.url
      this.picsDialog = false
    },
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
      this.multiple = true
      this.$data.picdanger = false
    },
    closePicsDialog() {
      this.picsDialog = false
    },
    removePicsImg() {
      this.ruleForm.avatar = null
    },
    confirmHandle() {
      const that = this
      const { ruleForm } = this.$data

      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          //console.log('confirmHandle submit!!',ruleForm);
          const { video_enable } = this.$data
          var params = {
            type: 'official',
            setting: {
              'official.nickname': ruleForm.nickname,
              'official.headerimgurl': ruleForm.avatar
            }
          }
          params.setting = JSON.stringify(params.setting)
          setUGCSetting(params).then(res => {
            var { message } = res.data.data
            this.$message({
              type: 'success',
              message,
              duration: 1500,
              onClose() {
                that.handleCancelLabelsDialog()
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancelLabelsDialog() {
      this.$emit('cancelLabelsDialog', false)
    }
  }
}
</script>
<style scoped lang="css">
.tips {
  display: inline-block;
  margin-bottom: 20px;
  line-height: 1.5;
  color: #999;
}
.official-form .img-wrap {
  position: relative;
  width: 86px;
  height: 86px;
  line-height: 86px;
  border: 1px dashed #ddd;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
}
.official-form .img-wrap .iconfont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  color: #ccc;
}
.official-form .img-wrap.mask .goodspic-mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.official-form .img-wrap.mask .goodspic-mask .iconfont {
  color: #fff;
  font-size: 20px;
}
.official-form .img-wrap.mask:hover .goodspic-mask {
  display: block;
}
.official-form /deep/ .el-form-item__label {
  text-align: left;
}
</style>
