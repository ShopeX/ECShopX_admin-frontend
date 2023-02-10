<style lang="scss">
.comp-img-list {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 12px;
  .img-content{
    flex: 1;
    .img-title{
    display: flex;
    }
    .btn-linkpath {
    padding: 3px;
    color: var(--themeColor);
    border: 1px solid var(--themeColor);
    background-color: #fff;
    border-radius: 3px;
    line-height: initial;
    }
  }
}
</style>
<template>
  <div class="comp-img-list">
    <div class="img-content">
      <div class="img-title">
        <span>标题:</span>
        <el-input
          v-model="localValue.ImgTitle"
          type="text"
          placeholder="请填写图片标题"
          @change="onChangeLinkUrl"
        />
      </div>
      <div class="btn-linkpath" @click="onPickerPath">
        {{ getLabelName() }}
      </div>
    </div>

    <div><i class="iconfont icon-trash-alt1" @click="deleteCouponItem(localValue)" /></div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { LINK_PATH } from '@/consts'
export default {
  name: 'CompImgList',
  props: ['value'],
  data() {
    return {
      localValue: {
        ImgTitle: '',
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
      const res = await this.$picker.path({
        data: [],
        multiple: false
      })
      this.$emit('change', res)
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
    },
    deleteCouponItem(localValue) {
      this.$emit('change', {localValue,content:'delete'})
    }
  }
}
</script>
