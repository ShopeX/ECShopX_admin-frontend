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
.comp-picker-link {
  .linktype-radio {
    margin-bottom: 6px;
    .el-radio {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
    .el-radio__label {
      padding-left: 2px;
      font-size: 13px;
    }
  }
  .btn-linkpath {
    padding: 0 8px;
    color: var(--primary);
    border: 1px solid var(--primary);
    background-color: #fff;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    border-radius: 3px;
    max-width: 160px;
    @include text-overflow();
  }
  input::-webkit-input-placeholder {
    font-size: 12px;
  }
  .el-input__inner {
    padding: 0 8px;
  }
}
</style>
<template>
  <div class="comp-picker-link">
    <!-- {{ localValue }} -->
    <el-radio-group v-model="localValue.linkType" class="linktype-radio" @change="onChangeLinkType">
      <el-radio :label="0"> 选择路径 </el-radio>
      <el-radio v-if="isShowH5Link" :label="1"> H5链接 </el-radio>
    </el-radio-group>
    <div v-if="localValue.linkType == 0" class="btn-linkpath" @click="onPickerPath">
      {{ getLabelName() }}
    </div>
    <el-input
      v-else
      v-model="localValue.linkUrl"
      class="h5-link"
      size="small"
      type="text"
      placeholder="请填写自定义链接"
      @change="onChangeLinkUrl"
    />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { LINK_PATH } from '@/consts'
export default {
  name: 'CompPickerLink',
  props: {
    value: {
      type: [Object, Array],
      default: () => {}
    },
    isShowH5Link: {
      // 不展示自定义链接label true：展示
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      localValue: {
        linkType: 0,
        linkUrl: '',
        linkPage: '',
        id: '',
        title: ''
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(nVal) {
        this.localValue = {
          ...this.localValue,
          ...nVal
        }
      }
    }
    // localValue: (nVal, oVal) => {
    //   this.$emit('input', nVal)
    // }
  },
  // created() {
  //   this.localValue = this.value
  // },
  methods: {
    async onPickerPath() {
      const { linkPage, id } = this.localValue
      const pathLink = ['/salespersonshelfindex', 'guide-assistant/home-template']
      const res = await this.$picker.path({
        data: id,
        tab: linkPage,
        multiple: false,
        guide:
          this.$route.path.indexOf(pathLink[0]) > -1 || this.$route.path.indexOf(pathLink[1]) > -1
            ? true
            : false // 为了兼容导购装修模板
      })
      this.$emit('input', res)
      this.$emit('change', res)
    },
    onChangeLinkType() {
      this.$emit('input', this.localValue)
      this.$emit('change', this.localValue)
    },
    onChangeLinkUrl() {
      this.$emit('input', this.localValue)
      this.$emit('change', this.localValue)
    },
    getLabelName() {
      const { linkPage, title } = this.localValue
      if (linkPage) {
        return `${LINK_PATH[linkPage]}：${title}`
      } else {
        return '选择路径'
      }
    }
  }
}
</script>
