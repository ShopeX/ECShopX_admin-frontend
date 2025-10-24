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
  <section v-if="name === 'heading'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="加粗">
          <el-switch v-model="config.bold" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="config.color" />
        </el-form-item>
        <el-form-item label="布局">
          <el-radio-group v-model="config.align">
            <el-radio label="left"> 居左 </el-radio>
            <el-radio label="center"> 居中 </el-radio>
            <el-radio label="right"> 居右 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字号">
          <el-select v-model="config.size" placeholder="请选择">
            <el-option v-for="item in options" :key="item" :label="item + '号'" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="斜体">
          <el-switch v-model="config.italic" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="data[0].content" type="text" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: [],
      options: ['24', '18', '16', '14']
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss"></style>
