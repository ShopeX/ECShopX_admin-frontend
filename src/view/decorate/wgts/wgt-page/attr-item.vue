<style scoped lang="scss">
.wgt-page-attr-item {
  display: flex;
  margin-top: 7px;
  .attr-title {
    display: block;
    margin-bottom: 10px;
  }
}
</style>

<template>
  <div style="display: flex;" class="wgt-page-attr-item">
    <div>
      <span class='attr-title'>背景颜色</span>
      <el-color-picker v-model="localValue.color" size='small' />
      <el-button
        class='button-reset'
        type='text'
        @click="onClickReset"
      >
        重置
      </el-button>
    </div>
    <div style="margin-left: 20px;">
      <span class='attr-title'>背景图片</span>
      <SpImagePicker v-model="localValue.image" size='small' />
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import CompPickerLink from '../../comps/comp-pickerLink'
export default {
  name: 'AttrItem',
  components: {
    CompPickerLink,
  },
  props: ['value'],
  data() {
    return {
      localValue: {
        color: '#333',
        image: ''
      }
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
    console.log('created', this.localValue, this.value)
  },
  watch: {
    localValue: function (nVal, oVal) {
      console.log('localValue', nVal, oVal)
      this.$emit('input', nVal)
    }
  },
  methods: {
    onClickReset () {
      this.localValue.color = '#333'
    },
    // onChangeLink(e, index) {
    //   const v = cloneDeep(this.value[index])
    //   Vue.set(this.value, index, {
    //     ...v,
    //     ...e
    //   })
    // }
  }
}
</script>
