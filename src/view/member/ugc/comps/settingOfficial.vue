<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-dialog
      :title="$t('2fc73439.c194c5')"
      :before-close="handleCancelLabelsDialog"
      :visible.sync="dialogIsShow"
      width="30%"
    >
      <div class="tips">{{ $t('2fc73439.680f8e') }}</div>
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
            <el-form-item :label="$t('2fc73439.fec615')" prop="nickname" class="last-ipt">
              <el-input
                v-model="ruleForm.nickname"
                maxlength="20"
                :show-word-limit="true"
                class="mipt"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('2fc73439.51357e')" prop="avatar" class="last-ipt">
              <div :class="['img-wrap', ruleForm.avatar ? 'mask' : null]">
                <el-image
                  v-if="ruleForm.avatar"
                  style="width: 100%; height: 100%"
                  :src="ruleForm.avatar"
                />
                <div v-if="ruleForm.avatar" class="goodspic-mask" @click="removePicsImg">
                  <SpIcon name="delete" />
                </div>
                <div v-else class="goodspic-mask" @click="handlePicsChange">
                  <SpIcon name="camera" />
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="confirmHandle">{{ $t('2fc73439.e83a25') }}</el-button>
        <el-button @click="handleCancelLabelsDialog">{{ $t('2fc73439.625fb2') }}</el-button>
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
      picsDialog: false,
      isGetPics: false,
      multiple: false
    }
  },
  computed: {
    rules() {
      return {
        nickname: [{ required: true, message: this.$t('2fc73439.5867c8'), trigger: 'blur' }],
        avatar: [{ required: true, message: this.$t('2fc73439.736179'), trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getFetch()
  },
  methods: {
    getFetch() {
      getUGCSetting({ type: 'official' }).then((res) => {
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

      this.$refs['dataForm'].validate((valid) => {
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
          setUGCSetting(params).then((res) => {
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
.official-form .img-wrap .i-icon {
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
.official-form .img-wrap.mask .goodspic-mask .i-icon {
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
