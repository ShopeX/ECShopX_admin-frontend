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
<style lang="scss"></style>
<template>
  <div>
    {{ value }}
    <el-select
      v-model="localValue"
      v-scroll="() => this.pageQuery.nextPage()"
      class="sp-select-remote"
      clearable
      filterable
      :loading="remoteLoading"
      remote
      :remote-method="onRemote"
      placeholder="输入商户名称搜索"
    >
      <el-option
        v-for="(item, index) in options"
        :key="`option-item__${index}`"
        :label="item[valueLabel]"
        :value="item[valueKey]"
      />
    </el-select>
  </div>
</template>

<script>
import Pages from '@/utils/pages'
export default {
  name: 'SpSelectRemote',
  props: {
    value: {
      type: [Number, String]
    },
    remote: {
      type: Function
    },
    data: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    valueLabel: {
      type: String,
      default: 'title'
    }
  },
  data() {
    return {
      remoteLoading: false,
      localValue: null,
      options: []
    }
  },
  // watch: {
  //   data: function (nVal, oVal) {
  //     debugger
  //   }
  // },
  created() {
    this.localValue = this.value
    this.pageQuery = new Pages({
      pageSize: 10,
      fetch: this.localRemoteFn
    })
    // this.localRemoteFn = this.remote

    this.$nextTick(() => {
      this.pageQuery.nextPage()
    })
  },
  methods: {
    async localRemoteFn({ page, pageSize }, keywords) {
      if (page == 1) {
        this.remoteLoading = true
      }
      const { list, total } = await this.remote({ page, pageSize }, keywords)
      if (page == 1) {
        this.remoteLoading = false
      }
      this.options = this.options.concat(list)
      this.pageQuery.setTotal(total)
    },
    onRemote(e) {
      console.log('this.value', this.value)
      // if (!this.value) {
      this.options = []
      this.pageQuery.reset(e)
      // }
    }
  }
}
</script>
