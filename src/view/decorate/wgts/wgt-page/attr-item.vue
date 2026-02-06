<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.wgt-page-attr-item {
  flex: 1;
  .background-type-selector {
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

  .background-content {
    margin-left: -80px;
    .color-section {
      .color-item {
        display: flex;
        align-items: center;

        .color-label {
          font-size: 12px;
          color: #595961;
          width: 80px;
          flex-shrink: 0;
        }

        .color-controls {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;

          .color-code {
            font-size: 12px;
            color: #999;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            min-width: 70px;
          }

          .color-controls-item {
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: flex-end;
            flex: 1;
          }
          .reset-btn {
            padding: 0;
            font-size: 12px;
            height: auto;
            line-height: 1.5;
          }

          .color-swatch {
            width: 56px;
            height: 28px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            flex-shrink: 0;
            transition: all 0.2s;
            overflow: hidden;

            &:hover {
              border-color: #155bd4;
              box-shadow: 0 0 0 2px rgba(21, 91, 212, 0.1);
            }

            .el-color-picker {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              opacity: 0;
              z-index: 1;

              ::v-deep .el-color-picker__trigger {
                width: 100%;
                height: 100%;
                border: none;
                padding: 0;
              }
            }
          }
        }
      }
    }

    .image-section {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="wgt-page-attr-item">
    <div class="background-type-selector">
      <el-radio-group v-model="backgroundType" size="mini" @change="handleTypeChange">
        <el-radio-button label="color">背景颜色</el-radio-button>
        <el-radio-button label="image">背景图片</el-radio-button>
      </el-radio-group>
    </div>
    <div class="background-content">
      <div v-if="backgroundType === 'color'" class="color-section">
        <div class="color-item">
          <span class="color-label">背景颜色</span>
          <div class="color-controls">
            <span class="color-code">{{ displayColor }}</span>
            <div class="color-controls-item">
              <el-button type="text" size="mini" class="reset-btn" @click="onClickReset"
                >重置</el-button
              >
              <div class="color-swatch" :style="{ backgroundColor: displayColor }">
                <el-color-picker v-model="localValue.color" size="small" @change="handleChange" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="backgroundType === 'image'" class="image-section">
        <SpImagePicker v-model="localValue.image" size="small" @onChange="handleChange" />
      </div>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import CompPickerLink from '../../comps/comp-pickerLink'
export default {
  name: 'AttrItem',
  components: {
    CompPickerLink
  },
  props: ['value'],
  data() {
    return {
      localValue: {
        color: '#fff',
        image: ''
      },
      backgroundType: 'color'
    }
  },
  computed: {
    displayColor() {
      return this.localValue.color
    }
  },
  created() {
    this.localValue = cloneDeep(this.value || { color: '#fff', image: '' })
    // 根据值判断初始类型
    if (this.localValue.image && this.localValue.image.trim() !== '') {
      this.backgroundType = 'image'
    } else if (this.localValue.color && this.localValue.color.trim() !== '') {
      this.backgroundType = 'color'
    } else {
      this.backgroundType = 'color'
    }
  },
  watch: {
    localValue: {
      handler(nVal) {
        this.$emit('input', nVal)
      },
      deep: true
    }
  },
  methods: {
    handleTypeChange(type) {
      // 类型变化时不需要清空值，只是切换显示
    },
    handleChange() {
      // 值变化时触发更新
      this.$emit('input', this.localValue)
    },
    onClickReset() {
      this.localValue.color = ''
      this.handleChange()
    }
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
