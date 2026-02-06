<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.comp-picker-link-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
  flex: 1;

  .linktype-radio {
    width: 100%;

    .el-radio__label {
      padding-left: 2px;
      font-size: 13px;
    }
  }

  .btn-linkpath {
    color: var(--primary);
    border: 1px solid #DCDFE6;
    background-color: #fff;
    box-sizing: border-box;
    padding: 0 8px;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    border-radius: 3px;
    @include text-overflow();
    width: 100%;
  }

  input::-webkit-input-placeholder {
    font-size: 12px;
  }

  .el-input__inner {
    padding: 0 8px;
  }

  .tracking-params-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;

    .tracking-params-label {
      display: block;
      font-size: 12px;
      width: 80px;
      color: #333;
    }

    .tracking-params-input {
      width: 100%;
    }
  }
}
</style>
<template>
  <div class="comp-picker-link-wrapper">
    <!-- {{ localValue }} -->
    <div class="tracking-params-wrapper">
      <label class="tracking-params-label">模式</label>
      <el-radio-group v-model="localValue.linkType" class="linktype-radio" @change="onChangeLinkType" size="small">
        <el-radio-button :label="0"> 选择路径 </el-radio-button>
        <el-radio-button v-if="isShowH5Link" :label="1">H5链接</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="localValue.linkType == 0" class="tracking-params-wrapper" @click="onPickerPath">
      <label class="tracking-params-label">路径</label>
      <div class="btn-linkpath">{{ getLabelName() }}</div>
    </div>
    <div class="tracking-params-wrapper" v-else>
      <label class="tracking-params-label">H5链接</label>
      <el-input v-model="localValue.linkUrl" class="h5-link" size="small" type="text" placeholder="请填写自定义链接"
        @change="onChangeLinkUrl" />
    </div>
    <div class="tracking-params-wrapper">
      <label class="tracking-params-label">埋点参数</label>
      <el-input v-model="localValue.trackingParams" class="tracking-params-input" size="small" type="text"
        placeholder="请输入埋点参数" @change="onChangeTrackingParams" />
    </div>
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
      default: () => { }
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
        title: '',
        trackingParams: ''
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
    onChangeTrackingParams() {
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
