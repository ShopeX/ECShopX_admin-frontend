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
    color: var(--themeColor);
    border: 1px solid var(--themeColor);
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
  .el-input__suffix {
    line-height: 36px;
  }
  .clear-btn {
    color: var(--themeColor);
    cursor: pointer;
  }
}
</style>
<template>
  <div class="comp-picker-link">
    <template v-if="type == 1">
      <el-radio-group
        v-model="localValue.linkType"
        class="linktype-radio"
        :disabled="disabled"
        @change="onChangeLinkType"
      >
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
        :disabled="disabled"
        placeholder="请填写自定义链接"
        @change="onChangeLinkUrl"
      />
    </template>
    <template v-if="type == 2">
      <el-form :model="localValue" :rules="rules" label-width="100px">
        <el-form-item label="热区名称" prop="imageName">
          <el-input
            v-model="localValue.imageName"
            style="width: 200px"
            :disabled="disabled"
            @change="onChangeImageName"
          />
        </el-form-item>
        <el-input
          :value="getLabelName()"
          placeholder="请设置广告图热区及链接"
          style="width: 200px"
          :disabled="disabled"
          @focus="onPickerPath"
          class="link-input"
        >
          <span slot="suffix" class="clear-btn" @click.capture="clearInput">清除</span>
        </el-input>
      </el-form>
    </template>
  </div>
</template>

<script>
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
    },
    tabs: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
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
        imageName: ''
      },
      rules: {
        imageName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
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
  methods: {
    async onPickerPath() {
      if (this.disabled) return
      console.log(this.params)
      const { id } = this.localValue
      const res = await this.$picker.pathV2({
        data: id,
        tabs: this.tabs?.length ? this.tabs : '',
        multiple: this.multiple,
        params: this.params
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
    },
    clearInput() {
      this.$emit('input', '')
      this.$emit('change', '')
    },
    onChangeImageName() {
      this.$emit('input', this.localValue)
      this.$emit('change', this.localValue)
    }
  }
}
</script>
