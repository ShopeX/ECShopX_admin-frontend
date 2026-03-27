<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t('4c921f2e.de4753') }}</span>
      </div>
      <div class="text item">
        <el-form ref="form_content" :model="form_content" :rles="rules" label-width="80px">
          <el-form-item :label="$t('4c921f2e.de4753')" prop="content">
            <SpRichText v-model="form_content.content" />
            <span class="tpl_item img" style="" @click="addImgPreview">
              <i class="el-icon-picture" />{{ $t('4c921f2e.20def7') }}
            </span>
          </el-form-item>
          <div class="section-footer with-border content-center">
            <el-button type="primary" @click="saveContent">{{ $t('4c921f2e.be5fbb') }}</el-button>
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
      thumbDialog: false,
      isGetThumb: false
    }
  },
  computed: {
    rules() {
      return {
        content: [{ required: true, message: this.$t('4c921f2e.63c899'), trigger: 'blur' }]
      }
    }
  },
  mounted() {
    getMemberanalysisrightsContent().then((response) => {
      this.form_content.content = response.data.data.content
    })
  },
  methods: {
    updateContent: function (data) {
      this.form_content.content = data
    },
    saveContent() {
      this.$refs['form_content'].validate((valid) => {
        if (valid) {
          setMemberanalysisrightsContent(this.form_content).then((response) => {
            this.$message({
              message: this.$t('4c921f2e.3b1083'),
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
        arr.forEach((data) => {
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
