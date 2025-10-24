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
  <section class="section nav-wrap">
    <div class="section-header with-border">基础设置</div>
    <div class="section-body">
      <el-form label-width="80px" label-position="top">
        <el-form-item label="分类样式">
          <el-radio-group v-model="config.category">
            <el-radio :label="'collapse'"> 收起 </el-radio>
            <el-radio :label="'expand'"> 展开 </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'SettingsStyle',
  props: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: []
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
<style lang="scss">
.nav-wrap {
  .setting-item {
    cursor: pointer;
  }
  .desc {
    line-height: 25px;
    margin-top: 10px;
  }
  .setting-remove {
    padding: 0 5px;
  }
  .goods-title {
    padding: 0 10px;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
