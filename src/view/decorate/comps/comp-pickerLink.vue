<style lang="scss" scoped>
.linktype-radio {
  margin-bottom: 6px;
}
.btn-linkpath {
  padding: 8px 16px;
  color: var(--themeColor);
  border: 1px solid var(--themeColor);
  background-color: #fff;
  font-size: 12px;
  border-radius: 3px;
  line-height: initial;
}
</style>
<template>
  <div>
    <el-radio-group v-model="localValue.linkType" class="linktype-radio">
      <el-radio :label="0"> 选择路径 </el-radio>
      <el-radio :label="1"> 自定义链接 </el-radio>
    </el-radio-group>
    <div v-if="localValue.linkType == 0" class="btn-linkpath" @click="onPickerPath">
      {{ getLabelName() }}
    </div>
    <div v-else>
      <el-input v-model="localValue.linkUrl" type="text" placeholder="请填写自定义链接" />
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { LINK_PATH } from '@/consts'
export default {
  name: 'CompPickerLink',
  props: ['value'],
  data() {
    return {
      localValue: {
        linkType: 0,
        linkUrl: ''
      }
    }
  },
  watch: {
    value(nVal, oVal) {
      this.localValue = nVal
    }
  },
  // created() {
  //   this.localValue = this.value
  // },
  methods: {
    async onPickerPath() {
      const res = await this.$picker.path({
        data: [],
        multiple: false
      })
      this.$emit('change', res)
    },
    getLabelName() {
      const { linkPage, title } = this.localValue
      if (linkPage) {
        return `${LINK_PATH[linkPage]}:${title}`
      } else {
        return '选择路径'
      }
    }
  }
}
</script>
