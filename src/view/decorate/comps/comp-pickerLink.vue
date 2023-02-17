<style lang="scss">
.comp-picker-link {
  .linktype-radio {
    margin-bottom: 6px;
    .el-radio {
      margin-right: 12px;
    }
    .el-radio__label {
      padding-left: 2px;
    }
  }
  .btn-linkpath {
    padding: 8px;
    color: var(--themeColor);
    border: 1px solid var(--themeColor);
    background-color: #fff;
    font-size: 12px;
    border-radius: 3px;
    line-height: initial;
    max-width: 200px;
    @include text-overflow();
  }
}
</style>
<template>
  <div class="comp-picker-link">
    <el-radio-group v-model="localValue.linkType" class="linktype-radio" @change="onChangeLinkType">
      <el-radio :label="0"> 选择路径 </el-radio>
      <el-radio v-if="isShowH5Link" :label="1"> 自定义链接 </el-radio>
    </el-radio-group>
    <div v-if="localValue.linkType == 0" class="btn-linkpath" @click="onPickerPath">
      {{ getLabelName() }}
    </div>
    <div v-else>
      <el-input
        v-model="localValue.linkUrl"
        type="text"
        placeholder="请填写自定义链接"
        @change="onChangeLinkUrl"
      />
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
      type: Object,
      default: {}
    },
    isShowH5Link: { // 不展示自定义链接label true：展示
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
  },
  // created() {
  //   this.localValue = this.value
  // },
  methods: {
    async onPickerPath() {
      const { linkPage, id } = this.localValue
      const res = await this.$picker.path({
        data: id,
        tab: linkPage,
        multiple: false
      })
      this.$emit('change', res)
    },
    onChangeLinkType() {
      this.$emit('change', this.localValue)
    },
    onChangeLinkUrl() {
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
