<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <div class="section-header with-border">{{ $t('c831a478.006ba3') }}</div>
    <div class="section-body">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('c831a478.32c65d')" prop="field_title" :rules="fieldTitleRules">
          <el-col :span="15">
            <el-input
              v-model.trim="form.field_title"
              :maxlength="30"
              :placeholder="$t('c831a478.8d92ea')"
              @change="fieldTitleChange"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('c831a478.08437e')" prop="form_element" :rules="formElementRules">
          <el-col :span="15">
            <el-radio-group v-model="form.form_element" @change="ElementChange">
              <el-radio label="text">{{ $t('c831a478.e00ed1') }}</el-radio>
              <el-radio label="number">{{ $t('c831a478.52d2a3') }}</el-radio>
              <el-radio label="checkbox">{{ $t('8da83775.db98f8') }}</el-radio>
              <el-radio label="select">{{ $t('c831a478.2a2aa7') }}</el-radio>
              <el-radio label="radio">{{ $t('c831a478.f96dab') }}</el-radio>
              <el-radio label="textarea">{{ $t('c831a478.136bf1') }}</el-radio>
              <el-radio label="date">{{ $t('c831a478.de1a35') }}</el-radio>
              <el-radio label="area">{{ $t('c831a478.9b711a') }}</el-radio>
              <el-radio label="idcard">{{ $t('c831a478.820ef5') }}</el-radio>
              <el-radio label="otherfile">{{ $t('c831a478.607b17') }}</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in form.options"
          v-if="
            form.form_element == 'radio' ||
            form.form_element == 'checkbox' ||
            form.form_element == 'select'
          "
          :key="domain.key"
          :label="$t('c831a478.6775bb') + index"
          :prop="'options.' + index + '.value'"
          :rules="optionItemRules"
          :span="10"
        >
          <el-row>
            <el-col :span="15">
              <el-input v-model="domain.value" width="20" />
            </el-col>
            <el-col v-if="index > 1" :span="5">
              <el-button @click.prevent="removeDomain(domain)">
                {{ $t('8da83775.2f4aad') }}
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <div>
                <imgBox
                  :img-url="wximageurl + domain.image_url"
                  inline
                  @click="handleImgChange(index)"
                />
              </div>
              <div class="frm-tips">
                {{ $t('c831a478.6113fc') }}
              </div>
              <imgPicker
                :dialog-visible="imgDialog"
                :sc-status="isGetImage"
                @chooseImg="pickImg"
                @closeImgDialog="closeImgDialog"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-if="
            form.form_element == 'radio' ||
            form.form_element == 'checkbox' ||
            form.form_element == 'select'
          "
        >
          <el-col :span="15">
            <el-button type="primary" circle @click="addOption">
              {{ $t('c831a478.c0a0f2') }}
            </el-button>
          </el-col>
        </el-form-item>
        <!-- field_name：{{form.field_name}} | defalutFileName:{{defalutFileName}} -->
        <el-form-item :label="$t('c831a478.7843a0')" :rules="englishIdRules">
          <el-col :span="15">
            <el-select
              v-model="defalutFileName"
              :placeholder="$t('c831a478.69eb9f')"
              style="width: 90%"
              @change="handleOnChageCtrlFields"
            >
              <el-option
                v-for="(data, index) in ctrlFields"
                :key="index"
                :label="data.name"
                :value="data.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <div style="line-height: 24px">{{ $t('c831a478.839543') }}</div>
          <div style="line-height: 24px">
            {{ $t('c831a478.eee5b3') }}
          </div>
        </el-form-item>
        <el-form-item
          v-if="defalutFileName == 'other'"
          :label="$t('c831a478.7843a0')"
          prop="field_name"
          :rules="englishIdRules"
        >
          <el-col :span="15">
            <el-input
              v-model.trim="form.field_name"
              :placeholder="$t('c831a478.8a499b')"
              @blur="fieldNameChange"
            />
          </el-col>
        </el-form-item>
        <!-- <el-form-item
          label="图片"
          prop="image_url"
        >
          <el-col :span="15">
            <div>
              <imgBox
                :img-url="wximageurl + form.image_url"
                inline
                @click="handleImgBChange"
              />
            </div>
            <div class="frm-tips">
              只能上传jpg/png文件，且不超过2M （建议尺寸：400px * 450px）
            </div>
            <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            />
          </el-col>
        </el-form-item> -->
        <el-form-item
          :label="$t('c831a478.b889b5')"
          prop="pic_name"
          v-if="form.form_element == 'idcard' || form.form_element == 'otherfile'"
          :rules="picNameRules"
        >
          <el-col :span="15">
            <el-input
              v-model.trim="form.pic_name"
              :maxlength="30"
              :placeholder="$t('c831a478.9c05b1')"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="handleCancel">{{ $t('8da83775.625fb2') }}</el-button>
          <el-button type="primary" @click="submitAction">{{ $t('8da83775.be5fbb') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { saveSetting, getSettingInfo, updateSetting } from '../../../api/selfhelpform'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'

export default {
  inject: ['refresh'],
  components: {
    imgPicker,
    imgBox
  },
  data() {
    return {
      form: {
        id: '',
        form_element: 'text',
        field_title: '',
        field_name: 'username',
        options: [
          { value: '', image_url: '' },
          { value: '', image_url: '' }
        ],
        image_url: '',
        pic_name: ''
      },
      formText: false,
      formTextarea: false,
      formRadio: false,
      formCheckbox: false,
      formSelect: false,
      formLable: '',
      formName: '',
      imgDialog: false,
      isGetImage: false,
      imgIndex: 0,
      ctrlFields: [
        { name: 'username', value: 'username' },
        { name: 'birthday', value: 'birthday' },
        { name: 'idcard', value: 'idcard' },
        { name: 'mobile', value: 'mobile' },
        { name: 'bankcard', value: 'bankcard' },
        { name: 'address', value: 'address' },
        { name: 'other', value: 'other' },
        { name: 'type', value: 'type' },
        { name: 'account number', value: 'account number' },
        { name: 'Attendance IDCard', value: 'Attendance IDCard' },
        { name: 'Company name', value: 'Company name' },
        { name: 'Unified Social Credit Code', value: 'Unified Social Credit Code' },
        { name: 'Attachment upload', value: 'Attachment upload' }
      ],
      defalutFileName: 'username'
    }
  },
  computed: {
    fieldTitleRules() {
      return [{ required: true, message: this.$t('8da83775.b91aba'), trigger: 'blur' }]
    },
    formElementRules() {
      return [{ required: true, message: this.$t('c831a478.c2dba8'), trigger: 'change' }]
    },
    optionItemRules() {
      return { required: true, message: this.$t('c831a478.975e58'), trigger: 'blur' }
    },
    englishIdRules() {
      return [{ required: true, message: this.$t('c831a478.dc34dd'), trigger: 'blur' }]
    },
    picNameRules() {
      return [
        {
          required: this.form.form_element === 'idcard' || this.form.form_element === 'otherfile',
          message: this.$t('c831a478.9c05b1'),
          trigger: 'blur'
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.id) {
      getSettingInfo(this.$route.query.id).then((res) => {
        this.form = res.data.data
        this.defalutFileName = res.data.data.field_name
        if (!this.form.options) {
          this.form.options = [
            { value: '', image_url: '' },
            { value: '', image_url: '' }
          ]
        }
      })
    }
  },
  methods: {
    handleOnChageCtrlFields(v) {
      this.form.field_name = v
    },
    ElementChange(value) {
      if (value == 'text' || value == 'textarea') {
        this.form.options = [
          { value: '', image_url: '' },
          { value: '', image_url: '' }
        ]
      }
    },
    fieldTitleChange(value) {
      this.formLable = value
    },
    fieldNameChange(value) {
      this.formName = value
    },
    addOption() {
      let cope = {
        value: '',
        key: Date.now()
      }
      this.form.options.push(cope)
    },
    removeDomain(item) {
      var index = this.form.options.indexOf(item)
      if (index !== -1) {
        this.form.options.splice(index, 1)
      }
    },
    submitAction() {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            updateSetting(this.form).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: this.$t('c831a478.55aa63'),
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          } else {
            saveSetting(this.form).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: this.$t('c831a478.3fdaea'),
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: this.$t('c831a478.3737df')
          })
          return false
        }
      })
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleImgChange(index) {
      this.imgIndex = index
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      if (this.imgIndex == 'all') {
        this.form.image_url = data.url
      } else {
        this.form.options[this.imgIndex].image_url = data.url
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    handleImgBChange() {
      this.imgIndex = 'all'
      this.imgDialog = true
      this.isGetImage = true
    }
  }
}
</script>
<style scoped lang="scss"></style>
