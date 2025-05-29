<template>
  <div class="picker-hot-zone">
    <div>
      <el-button type="primary" size="small" plain @click="onSelectImage"> 选择图片 </el-button>
      <span style="font-size: 12px; color: #888; margin-left: 4px">建议尺寸:（宽度640px，高度自适应）</span>
    </div>

    <div class="hot-content" v-if="localValue?.imgUrl">
      <el-row :gutter="20">
        <el-col :span="12">
          <hotzone class="hotzone" :image="localValue.imgUrl" :zones-init="localValue.data" @change="handleChange"
            @remove="handleRemove" />
        </el-col>
        <el-col :span="12">
          <div v-for="(item, index) in localValue.data" :key="`zone-item__${index}`" class="zone-item">
            <CompPickerLink :value="item" :tabs="value?.useTabs" :type="value.linkType" :multiple="value?.linkMultiple"
              @change="(e) => onChangeLink(e, index)" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import hotzone from 'vue-hotzone'
import { cloneDeep } from 'lodash-es'

import CompPickerLink from '@/components/compPickerLink/index.vue'

import BasePicker from './base'

export default {
  name: 'PickerHotzone',
  components: {
    CompPickerLink,
    hotzone
  },
  extends: BasePicker,
  config: {
    title: '设置热区'
  },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      localValue: {
        imgUrl: '',
        data: []
      },
    }
  },
  watch: {
    localValue: {
      handler(val) {
        this.updateVal(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.localValue = cloneDeep(this.value?.data || { imgUrl: '', data: [] })
  },
  methods: {
    async onSelectImage() {
      const {
        data: { url }
      } = await this.$picker.image({
        data: { url: this.value.imgUrl }
      })
      this.localValue = {
        ...this.localValue,
        imgUrl: url
      }
    },
    handleChange(zone) {
      zone.forEach(({ heightPer, widthPer, leftPer, topPer }, index) => {
        const v = cloneDeep(this.localValue.data[index])
        const obj = {
          // linkType: 0,
          // linkUrl: '',
          heightPer,
          leftPer,
          topPer,
          widthPer
        }
        Vue.set(this.localValue.data, index, {
          ...v,
          ...obj
        })
      })
    },
    handleRemove(index) {
      this.localValue.data.splice(index, 1)
    },
    onChangeLink(e, index) {
      const v = cloneDeep(this.localValue.data[index])
      Vue.set(this.localValue.data, index, {
        ...v,
        ...e
      })
    }
  }
}
</script>

<style scoped lang="scss">
.hot-content {
  margin-top: 10px;
}

.zone-item {
  margin-bottom: 16px;
}

.picker-hot-zone {
  min-height: 100px;
  padding-top: 20px;
  padding-left: 20px;
}
</style>
