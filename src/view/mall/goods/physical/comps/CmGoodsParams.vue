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
<style lang="scss">
.form-block-head {
  .block-head-hd {
    font-weight: bold;
    color: #333;
    height: 40px;
    line-height: 40px;
  }
  border-bottom: 1px solid #efefef;
}
.width-full {
  width: 100%;
}
.form-block-body {
  padding: 20px;
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
<template>
  <div class="comp-goodsparams">
    <div class="form-block-head clearfix">
      <div class="block-head-hd">商品参数</div>
    </div>
    <div class="form-block-body">
      <el-row :gutter="20">
        <el-col v-for="(item, index) in value" :key="`params-data__${index}`" :span="8">
          <el-form label-position="right" label-width="80px">
            <el-form-item :label="item.label">
              <el-select
                v-if="item.children.length > 0"
                v-model="item.attribute_value_id"
                class="width-full"
                clearable
                placeholder="请选择"
                @change="
                  e => {
                    paramsChange(e, item)
                  }
                "
              >
                <el-option
                  v-for="child in item.children"
                  :key="child.value"
                  :label="child.label"
                  :value="child.value"
                />
              </el-select>
              <el-input v-else v-model="item.value" :maxlength="60" placeholder="" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CmGoodsParams',
  props: ['value'],
  data() {
    return {}
  },
  created() {},
  methods: {
    paramsChange(e, item) {
      if (e) {
        const fd = item.children.find(k => k.value == e)
        item.attribute_value_name = fd.label
        this.$emit('input', this.value)
      } else {
        item.attribute_value_name = ''
      }
    }
  }
}
</script>
