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
  <div class="section section-white">
    <div class="section-header with-border">添加表单元素</div>
    <div class="section-body">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item
          label="标题"
          prop="field_title"
          :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
        >
          <el-col :span="15">
            <el-input
              v-model.trim="form.field_title"
              :maxlength="30"
              placeholder="身高(cm)"
              @change="fieldTitleChange"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="表单元素类型"
          prop="form_element"
          :rules="[{ required: true, message: '请选择表单元素', trigger: 'change' }]"
        >
          <el-col :span="15">
            <el-radio-group v-model="form.form_element" @change="ElementChange">
              <el-radio label="text"> 单文本框 </el-radio>
              <el-radio label="number"> 数字(纯数字) </el-radio>
              <el-radio label="checkbox"> 复选框 </el-radio>
              <el-radio label="select"> 下拉选择 </el-radio>
              <el-radio label="radio"> 单选按钮 </el-radio>
              <el-radio label="textarea"> 多文本域 </el-radio>
              <el-radio label="date"> 日期选择 </el-radio>
              <el-radio label="area"> 地区选择 </el-radio>
              <el-radio label="idcard"> 上传身份证 </el-radio>
              <el-radio label="otherfile"> 上传其他附件 </el-radio>
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
          :label="'选择项' + index"
          :prop="'options.' + index + '.value'"
          :rules="{
            required: true,
            message: '选择项不能为空',
            trigger: 'blur'
          }"
          :span="10"
        >
          <el-row>
            <el-col :span="15">
              <el-input v-model="domain.value" width="20" />
            </el-col>
            <el-col v-if="index > 1" :span="5">
              <el-button @click.prevent="removeDomain(domain)"> 删除 </el-button>
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
                只能上传jpg/png文件，且不超过2M （建议尺寸：400px * 450px）
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
            <el-button type="primary" circle @click="addOption"> 增 </el-button>
          </el-col>
        </el-form-item>
        <!-- field_name：{{form.field_name}} | defalutFileName:{{defalutFileName}} -->
        <el-form-item
          label="英文标识"
          :rules="[{ required: true, message: '请输入英文标识', trigger: 'blur' }]"
        >
          <el-col :span="15">
            <el-select
              v-model="defalutFileName"
              placeholder="请选择英文标识"
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
          <div style="line-height: 24px">英文标识填写说明：</div>
          <div style="line-height: 24px">
            需填写姓名请选择字符username、生日为birthday、
            身份证号码为idcard、手机号码为mobile、银行卡号为bankcard、地址为address、
            公司名称为Company name、统一社会信用代码为Unified Social Credit
            Code、出席人身份证号为Attendance IDCard、帐号为account number、
            类型为type、提示信息为Reminder information、上传附件为Attachment
            upload，若都不是，选其他。
          </div>
        </el-form-item>
        <el-form-item
          v-if="defalutFileName == 'other'"
          label="英文标识"
          prop="field_name"
          :rules="[{ required: true, message: '请输入英文标识', trigger: 'blur' }]"
        >
          <el-col :span="15">
            <el-input
              v-model.trim="form.field_name"
              placeholder="height 或者 shengao"
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
          label="证照名称"
          prop="pic_name"
          v-if="form.form_element == 'idcard' || form.form_element == 'otherfile'"
          :rules="[
            {
              required: form.form_element == 'idcard' || form.form_element == 'otherfile',
              message: '请输入证照名称',
              trigger: 'blur'
            }
          ]"
        >
          <el-col :span="15">
            <el-input v-model.trim="form.pic_name" :maxlength="30" placeholder="请输入证照名称" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="handleCancel"> 取消 </el-button>
          <el-button type="primary" @click="submitAction"> 保存 </el-button>
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
  mounted() {
    if (this.$route.query.id) {
      getSettingInfo(this.$route.query.id).then(res => {
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
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            updateSetting(this.form).then(res => {
              if (res.data.data) {
                this.$message({
                  message: '更新成功',
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
            saveSetting(this.form).then(res => {
              if (res.data.data) {
                this.$message({
                  message: '添加成功',
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
            message: '请录入正确的数据'
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
