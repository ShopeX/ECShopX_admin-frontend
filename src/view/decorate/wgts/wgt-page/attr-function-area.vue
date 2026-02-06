<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.function-area-selector {
  margin-bottom: 10px;
  .el-radio-group {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    
    .el-radio-button {
      &:first-child {
        .el-radio-button__inner {
          border-radius: 4px 0 0 4px;
          border-right: none;
        }
      }
      
      &:last-child {
        .el-radio-button__inner {
          border-radius: 0 4px 4px 0;
        }
      }
      
      .el-radio-button__inner {
        width: 100%;
        padding: 6px 12px;
        font-size: 12px;
        color: #595961;
        background-color: #fff;
        border: 1px solid #e0e0e0;
        transition: all 0.2s;
        
        &:hover {
          color: #155bd4;
          border-color: #155bd4;
        }
      }
      
      &.is-active {
        .el-radio-button__inner {
          color: #fff;
          background-color: #155bd4;
          border-color: #155bd4;
          box-shadow: none;
          font-weight: 500;
        }
      }
    }
  }
}

.function-content {
  margin-top: 10px;
}
</style>

<template>
  <div>
    <div class="function-area-selector">
      <el-radio-group v-model="functionType" size="mini" @change="handleTypeChange">
        <el-radio-button label="none">不展示</el-radio-button>
        <el-radio-button label="hotzone">热区图</el-radio-button>
        <el-radio-button label="nearby">附近门店</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="functionType === 'hotzone'" class="function-content">
      <AttrHotSetting v-model="localValue.hotzone" />
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import AttrHotSetting from './attr-hotsetting'

export default {
  name: 'AttrFunctionArea',
  components: {
    AttrHotSetting
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        type: 'none',
        hotzone: { imgUrl: '', data: [] }
      })
    }
  },
  data() {
    return {
      localValue: {
        type: 'none',
        hotzone: { imgUrl: '', data: [] }
      },
      functionType: 'none'
    }
  },
  created() {
    this.localValue = cloneDeep(this.value || { type: 'none', hotzone: { imgUrl: '', data: [] } })
    // 兼容旧数据格式：如果 value 直接是 hotzone 对象，则转换为新格式
    if (this.value && this.value.imgUrl !== undefined && !this.value.type) {
      this.localValue = {
        type: 'hotzone',
        hotzone: cloneDeep(this.value)
      }
    }
    this.functionType = this.localValue.type || 'none'
  },
  watch: {
    localValue: {
      handler(nVal) {
        this.$emit('input', nVal)
      },
      deep: true
    },
    'localValue.hotzone': {
      handler() {
        this.$emit('input', this.localValue)
      },
      deep: true
    }
  },
  methods: {
    handleTypeChange(type) {
      this.localValue.type = type
      if (type === 'hotzone' && !this.localValue.hotzone) {
        this.localValue.hotzone = { imgUrl: '', data: [] }
      }
      this.$emit('input', this.localValue)
    }
  }
}
</script>
