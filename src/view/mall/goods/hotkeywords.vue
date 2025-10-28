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
  <el-col class="section section-white" :span="24">
    <div class="section-header with-border">热门关键词配置</div>
    <div class="section-white content-padded">
      <el-tag
        v-for="tag in form_content"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
        + New Tag
      </el-button>
    </div>
    <div class="section-footer content-center">
      <el-button type="primary" @click="saveContent"> 保存 </el-button>
    </div>
    <br>
  </el-col>
</template>

<script>
import { setHotKeywords, getHotKeywords } from '../../../api/goods'
// 组件
import imgPicker from '@/components/imageselect'
export default {
  data() {
    return {
      form_content: [],
      form_content1: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  mounted() {
    this.getContent()
  },
  methods: {
    handleClose(tag) {
      this.form_content.splice(this.form_content.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.form_content.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    saveContent() {
      setHotKeywords({ content: this.form_content }).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    getContent() {
      getHotKeywords().then(res => {
        this.form_content = res.data.data.content || []
      })
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
