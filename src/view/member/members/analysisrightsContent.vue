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
  <div class="section-white content-padded">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>会员权益</span>
      </div>
      <div class="text item">
        <el-form ref="form_content" :model="form_content" :rles="rules" label-width="80px">
          <el-form-item label="会员权益" prop="content">
            <SpRichText v-model="form_content.content" />
            <span class="tpl_item img" style="" @click="addImgPreview">
              <i class="iconfont icon-image" />图片
            </span>
          </el-form-item>
          <div class="section-footer with-border content-center">
            <el-button type="primary" @click="saveContent"> 保存 </el-button>
          </div>
        </el-form>
      </div>
      <imgPicker
        :dialog-visible="thumbDialog"
        :sc-status="isGetThumb"
        :is-most="true"
        @chooseImg="pickThumb"
        @closeImgDialog="closeThumbDialog"
      />
    </el-card>
  </div>
</template>

<script>
import { setMemberanalysisrightsContent, getMemberanalysisrightsContent } from '@/api/member'
import imgPicker from '@/components/imageselect'
export default {
  components: {
    imgPicker
  },
  data() {
    return {
      form_content: {
        content: ''
      },
      rules: {
        content: [{ required: true, message: '请输入会员权益', trigger: 'blur' }]
      },
      thumbDialog: false,
      isGetThumb: false
    }
  },
  mounted() {
    getMemberanalysisrightsContent().then(response => {
      this.form_content.content = response.data.data.content
    })
  },
  methods: {
    updateContent: function (data) {
      this.form_content.content = data
    },
    saveContent() {
      this.$refs['form_content'].validate(valid => {
        if (valid) {
          setMemberanalysisrightsContent(this.form_content).then(response => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          })
        }
      })
    },
    // 详情中的上传图片
    addImgPreview: function () {
      this.thumbDialog = true
      this.isGetThumb = true
    },

    pickThumb: function (arr) {
      if (arr.length != 0) {
        arr.forEach(data => {
          if (data && data.url !== '') {
            this.thumbDialog = false
            var loc = this.$refs.editor
            var img = new Image()
            img.src = this.wximageurl + data.url
            if (loc.range) {
              loc.range.insertNode(img)
              var referenceNode = loc.range.endContainer
              if (referenceNode.className !== 'content') {
                loc.range.setStartAfter(referenceNode)
              } else {
                loc.range.setStart(loc.range.endContainer, loc.range.endOffset)
              }
            } else {
              loc.$refs.content.appendChild(img)
              loc.focus()
              loc.restoreSelection()
            }
            this.form_content.content = loc.$refs.content.innerHTML
          }
        })
      }
    },
    closeThumbDialog: function () {
      this.thumbDialog = false
    }
  }
}
</script>

<style type="text/css">
.box-card {
  min-width: 480px;
}

.tpl_item {
  display: inline-block;
  border: 1px solid #ddd;
  background-color: #fff;
  text-align: left;
  padding: 0 15px;
  line-height: 36px;
  cursor: pointer;
  border-radius: 3px;
}

.tpl_item .iconfont {
  margin-right: 5px;
}

.tpl_item .fa {
  width: 12px;
  height: 22px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 1em;
  font-size: 20px;
  text-align: center;
}
</style>
