<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="sms_signatures_edit">
    <h4>{{ $t('16099248.5f0d17') }}</h4>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="demo-ruleForm">
      <el-form-item :label="$t('16099248.b2b399')" prop="template_type">
        <el-radio-group v-model="form.template_type" :disabled="disabled">
          <el-radio label="0">{{ $t('16099248.a58fc5') }}</el-radio>
          <el-radio label="1">{{ $t('16099248.8958ab') }}</el-radio>
          <el-radio v-if="!VERSION_IN_PURCHASE()" label="2">{{ $t('16099248.79b50f') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.template_type" :label="$t('16099248.bc50bf')" prop="scene_id">
        <el-select
          v-model="form.scene_id"
          :placeholder="$t('16099248.708c9d')"
          style="width: 400px"
          :disabled="disabled"
        >
          <el-option
            v-for="item in template_type_options"
            :key="item.id"
            :label="item.scene_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('16099248.a5d1c5')" prop="template_name">
        <el-input
          v-model="form.template_name"
          :disabled="disabled"
          minlength="1"
          maxlength="30"
          show-word-limit
          :placeholder="$t('16099248.837447')"
        />
      </el-form-item>

      <el-form-item :label="$t('16099248.7a46c0')" prop="related_sign_name">
        <el-select
          v-model="form.related_sign_name"
          :placeholder="$t('16099248.708c9d')"
          style="width: 400px"
          :disabled="disabled"
        >
          <el-option
            v-for="item in signNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('16099248.03ae79')" prop="template_content">
        <nav>
          <span
            v-for="item in variables"
            :key="item.var_name"
            :class="['key', { detail: $route.query.type == 'detail' }]"
            @click="fnKey(item)"
            >${ {{ item.var_title }} }</span
          >
        </nav>
        <el-input
          v-model="form.template_content"
          :disabled="disabled"
          type="textarea"
          :rows="8"
          maxlength="500"
          show-word-limit
          :placeholder="$t('16099248.c6ec65')"
        />
        <ul class="tips">
          <li>{{ $t('16099248.16c220') }}</li>
          <li>
            {{ $t('16099248.4c0843') }}
            <a
              target="_blank"
              href="https://help.aliyun.com/document_detail/108253.htm?spm=a2c4g.11186623.0.0.7c8e2918ZCtnlV"
              >{{ $t('16099248.3cb36d') }}</a
            >
          </li>
        </ul>
      </el-form-item>
      <el-form-item :label="$t('16099248.9206ad')" prop="remark">
        <el-input
          v-model="form.remark"
          :disabled="disabled"
          type="textarea"
          :rows="4"
          maxlength="100"
          show-word-limit
          :placeholder="$t('16099248.20a3f2')"
        />
      </el-form-item>
      <el-form-item v-if="$route.query.type !== 'detail'">
        <!-- <el-button type="primary" @click="submitForm('form')">确定</el-button> -->
        <loadingBtn ref="loadingBtn" @clickHandle="submitForm('form')" />
        <el-button @click="fnBack">{{ $t('16099248.625fb2') }}</el-button>
        <ul class="tips">
          <li>{{ $t('16099248.aafa64') }}</li>
          <li>{{ $t('16099248.f8f3cd') }}</li>
        </ul>
      </el-form-item>
    </el-form>
    <!-- 图片选择 -->
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />

    <!-- result -->
    <el-dialog :visible="resultVisible" class="result" :show-close="false">
      <el-result icon="success" :title="$t('16099248.23b62e')" :sub-title="$t('16099248.240e49')">
        <template slot="subTitle">
          <h5>{{ $t('16099248.e3c145') }}</h5>
          <ul class="tips">
            <li>{{ $t('16099248.aafa64') }}</li>
            <li>{{ $t('16099248.f8f3cd') }}</li>
          </ul>
        </template>
        <template slot="extra">
          <el-button type="primary" size="medium" @click="fnBack">
            {{ $t('16099248.adcd1d') }}
          </el-button>
          <el-button v-if="!$route.query.type" size="medium" @click="fnAgain">
            {{ $t('16099248.dcd9bd') }}
          </el-button>
        </template>
      </el-result>
    </el-dialog>
  </div>
</template>

<script>
import { requiredRules, MaxRules, MinRules } from '@/utils/validate'
import imgPicker from '@/components/imageselect'
import loadingBtn from '@/components/loading-btn'
import {
  getTemplateSeleteList,
  getTemplateContentLabel,
  addSmsTemplate,
  SmsTemplateDetail,
  editSmsTemplate
} from '@/api/sms'

export default {
  components: {
    imgPicker,
    loadingBtn
  },
  data() {
    return {
      // 页面状态
      disabled: false,
      // 图片选择
      imgDialog: false,
      isGetImage: false,
      pickerImgType: '',
      // result
      resultVisible: false,
      signNameList: [],
      //
      form: {
        template_type: '',
        scene_id: '',
        template_name: '',
        related_sign_name: '',
        template_content: '',
        remark: ''
      },
      rules: {
        template_type: [requiredRules(this.$t('16099248.b2b399'), 'change')],
        scene_id: [requiredRules(this.$t('16099248.bc50bf'), 'change')],
        related_sign_name: [requiredRules(this.$t('16099248.7a46c0'), 'change')],
        template_name: [requiredRules(this.$t('16099248.a5d1c5'))],
        template_content: [requiredRules(this.$t('16099248.03ae79')), MaxRules(500), MinRules(1)],
        remark: [requiredRules(this.$t('16099248.9206ad')), MaxRules(200)]
      },
      template_type_options: [],
      variables: [], //可用的模板变量

      // 页面 edit 状态下 判断是否是首页加载 首次加载不用清空关联项
      isEditFirst: true
    }
  },
  watch: {
    async 'form.template_type'(template_type) {
      const result = await getTemplateSeleteList({ template_type })
      let new_arr = result.data.data.list.filter((el) => el.scene_name != '订单提货码')
      this.template_type_options = new_arr
      // 如是创建状态  把关联状态都清空
      const { type } = this.$route.query
      if (type == 'detail' || (type == 'edit' && this.isEditFirst)) {
        return (this.isEditFirst = false)
      }
      this.form.scene_id = ''
      this.form.template_content = ''
      this.variables = []
    },
    async 'form.scene_id'(id) {
      console.log(id, `============`)
      if (!id) return
      const result = await getTemplateContentLabel({ id })
      this.variables = result.data.data.variables
      if (this.$route.query.type == 'edit' || this.$route.query.type == 'detail') {
        return
      }
      this.form.template_content = result.data.data.default_template
      // console.log(result);
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const { type, id } = this.$route.query
      console.log(type, id)

      const { list, total_count } = await this.$api.sms.getSmsSignatureList({
        status: '1',
        page: 1,
        pageSize: 500
      })
      this.signNameList = list.map((item) => ({ label: item.sign_name, value: item.sign_name }))

      if (type) {
        const result = await SmsTemplateDetail({ id })
        this.resultHandler(result)
        if (type == 'detail') {
          this.disabled = true
        }
      }
    },
    resultHandler(result) {
      console.log(result)
      const {
        template_type,
        scene_id,
        template_name,
        template_content,
        remark,
        related_sign_name
      } = result.data.data
      console.log(template_content)
      this.form = {
        template_type,
        scene_id: scene_id + '',
        template_name,
        template_content,
        remark,
        related_sign_name
      }

      console.log(this.form)
    },
    submitForm(formName) {
      const { type, id } = this.$route.query
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            if (type == 'edit') {
              const result = await editSmsTemplate({ id, ...this.form })
              this.submitFormResult(result)
            } else {
              // 增加
              const result = await addSmsTemplate(this.form)

              this.submitFormResult(result)
            }
          } catch (error) {
            this.$refs['loadingBtn'].closeLoading()
          }
        } else {
          console.log('error submit!!')
          this.$refs['loadingBtn'].closeLoading()
          return false
        }
      })
    },
    submitFormResult(result) {
      if (result.data.data.status) {
        this.resultVisible = true
      }
      this.$refs['loadingBtn'].closeLoading()
    },
    fnBack() {
      this.$router.push({
        path: `/setting/system-config/sms-service/sms_template`
      })
    },
    fnAgain() {
      this.resultVisible = false
      this.$refs['form'].resetFields()
    },
    /* -------------------------图片选择------------------------- */
    pickImg({ url }) {
      if (url && this.pickerImgType) {
        const that = this.form
        that[this.pickerImgType] = url
        this.imgDialog = false
      }
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    handleImgPicker(pickerImgType) {
      if (!this.disabled) {
        this.pickerImgType = pickerImgType
        this.imgDialog = true
        this.isGetImage = true
      }
    },
    /* -------------------------图片选择------------------------- */

    fnKey(item) {
      const { type } = this.$route.query
      if (type == 'detail') return
      console.log(item)
      this.form.template_content = this.form.template_content + ' ${' + item.var_title + '}' + ' '
    }
  }
}
</script>

<style lang="scss" scoped>
.sms_signatures_edit {
  h4 {
    color: #222;
    position: relative;
    margin-left: 10px;
    &::before {
      position: absolute;
      content: '';
      width: 5px;
      top: 4px;
      bottom: 4px;
      left: -8px;
      background: #1480e3;
    }
  }
  .demo-ruleForm {
    max-width: 960px;
    padding: 20px;
  }
}
</style>
<style lang="scss">
.sms_signatures_edit {
  .key {
    padding: 4px 10px;
    margin-right: 10px;
    border-radius: 10px;
    border: 1px solid #409eff;
    cursor: pointer;
    &.detail {
      background: #e4e7ed;
    }
  }
  padding-bottom: 50px;
  .el-radio-group {
    margin-top: 10px;
    .el-radio {
      width: 100%;
      margin-bottom: 15px;
    }
  }
  .upload-box {
    width: 150px;
    height: 150px;
    align-items: center;
    display: flex;
    border: 2px dashed #ccc;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    i {
      font-size: 40px;
      color: #999;
    }
    img {
      max-width: 100%;
      max-height: 140px;
    }
    &:hover {
      border-color: #409eff;
    }
  }
  .tips {
    margin-top: 10px;
    li {
      color: #999;
      font-size: 12px;
      line-height: 16px;
    }
  }
  .el-dialog {
    max-width: 600px;
    .el-dialog__header {
      padding: 0;
      /* padding: 20px 20px 10px; */
    }
    .el-dialog__body {
      padding: 30px 20px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
    }
    .el-result__subtitle p {
      font-weight: 700;
      font-size: 23px;
    }
    .el-result__subtitle {
      .tips {
        margin-top: 20px;
        li {
          color: #999;
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
