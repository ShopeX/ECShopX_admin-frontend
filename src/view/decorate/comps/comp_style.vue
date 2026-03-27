<template>
  <div class="comps_style">
    <!-- 内边距设置 -->
    <div class="comps_style-item">
      <el-row class="im-bd">
        <template v-for="field in paddingFields">
          <el-col v-if="field.show" :key="field.key" :span="10" class="im-bd-pd">
            <p class="label">{{ field.label }}</p>
            <el-input-number
              v-model="form[field.key]"
              controls-position="right"
              size="mini"
              :min="0"
            />
          </el-col>
        </template>
      </el-row>
    </div>

    <!-- 组合内边距设置 -->
    <div class="comps_style-item">
      <el-row class="im-bd">
        <template v-for="field in combinedPaddingFields">
          <el-col v-if="field.show" :key="field.key" :span="10" class="im-bd-pd">
            <p class="label">{{ field.label }}</p>
            <el-input-number
              v-model="form[field.key]"
              controls-position="right"
              size="mini"
              :min="0"
            />
          </el-col>
        </template>
      </el-row>
    </div>

    <!-- 背景设置 -->
    <div class="comps_style-item comps_style-bg">
      <div class="im-tt">{{ $t('68f836e2.8e1b94') }}</div>
      <div class="im-bd">
        <div class="background-type-selector">
          <el-radio-group v-model="form.bgType" size="mini" @change="handleChange">
            <el-radio-button label="color">{{ $t('68f836e2.4573a7') }}</el-radio-button>
            <el-radio-button label="pic">{{ $t('68f836e2.d74849') }}</el-radio-button>
            <el-radio-button label="gradient">{{ $t('68f836e2.97fe4b') }}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="background-content">
          <div v-if="form.bgType === 'color'" class="color-section">
            <div class="color-item">
              <span class="color-label">{{ $t('68f836e2.4573a7') }}</span>
              <div class="color-controls">
                <span class="color-code">{{ displayBgColor }}</span>
                <div class="color-controls-item">
                  <el-button type="text" size="mini" class="reset-btn" @click="onResetBgColor">
{{
                    $t('68f836e2.4b9c32')
                  }}
</el-button>
                  <div class="color-swatch" :style="{ backgroundColor: displayBgColor }">
                    <el-color-picker v-model="form.bgColor" size="small" @change="handleChange" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="form.bgType === 'gradient'" class="gradient-section">
            <div class="gradient-item">
              <span class="color-label">{{ $t('68f836e2.e7d2b3') }}</span>
              <div class="color-controls">
                <span class="color-code">{{ displayStartColor }}</span>
                <div class="color-controls-item">
                  <el-button type="text" size="mini" class="reset-btn" @click="onResetStartColor">
{{
                    $t('68f836e2.4b9c32')
                  }}
</el-button>
                  <div class="color-swatch" :style="{ backgroundColor: displayStartColor }">
                    <el-color-picker
                      v-model="form.startColor"
                      size="small"
                      @change="handleChange"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="gradient-item">
              <span class="color-label">{{ $t('68f836e2.8ea65e') }}</span>
              <div class="color-controls">
                <span class="color-code">{{ displayEndColor }}</span>
                <div class="color-controls-item">
                  <el-button type="text" size="mini" class="reset-btn" @click="onResetEndColor">
{{
                    $t('68f836e2.4b9c32')
                  }}
</el-button>
                  <div class="color-swatch" :style="{ backgroundColor: displayEndColor }">
                    <el-color-picker v-model="form.endColor" size="small" @change="handleChange" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="form.bgType === 'pic'" class="image-section">
            <SpImagePicker
              v-model="form.bgPic"
              size="small"
              class="video-link"
              :text="$t('68f836e2.543aa6')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

const DEFAULT_FORM = {
  paddedt: 0,
  paddedb: 0,
  paddedl: 0,
  paddedr: 0,
  paddedtb: 0,
  paddedlr: 0,
  bgColor: '',
  bgPic: '',
  bgType: 'color',
  startColor: '',
  endColor: ''
}

export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    uuid: {
      type: String,
      default: ''
    },
    showTop: {
      type: Boolean,
      default: true
    },
    showBottom: {
      type: Boolean,
      default: true
    },
    showLeft: {
      type: Boolean,
      default: true
    },
    showRight: {
      type: Boolean,
      default: true
    },
    showTB: {
      type: Boolean,
      default: false
    },
    showLR: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: { ...DEFAULT_FORM }
    }
  },
  computed: {
    // 内边距字段配置
    paddingFields() {
      return [
        { key: 'paddedt', label: this.$t('68f836e2.af767b'), show: this.showTop },
        { key: 'paddedb', label: this.$t('68f836e2.3850a1'), show: this.showBottom },
        { key: 'paddedl', label: this.$t('68f836e2.d2aff1'), show: this.showLeft },
        { key: 'paddedr', label: this.$t('68f836e2.4d9c32'), show: this.showRight }
      ]
    },
    // 组合内边距字段配置
    combinedPaddingFields() {
      return [
        { key: 'paddedtb', label: this.$t('68f836e2.81f8a5'), show: this.showTB },
        { key: 'paddedlr', label: this.$t('68f836e2.bb72c5'), show: this.showLR }
      ]
    },

    // 显示背景颜色
    displayBgColor() {
      return this.form.bgColor
    },
    // 显示起始颜色
    displayStartColor() {
      return this.form.startColor
    },
    // 显示结束颜色
    displayEndColor() {
      return this.form.endColor
    }
  },
  watch: {
    uuid: {
      handler(newVal, oldVal) {
        // 只在 uuid 真正变化时重新初始化
        if (newVal !== oldVal && newVal) {
          this.initForm()
        }
      },
      immediate: false
    },
    form: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  created() {
    // 初始化表单数据，只在创建时同步一次
    this.initForm()
  },
  methods: {
    // 初始化表单数据
    initForm() {
      this.form =
        this.value && Object.keys(this.value).length > 0
          ? cloneDeep(this.value)
          : { ...DEFAULT_FORM }
    },
    // 背景类型改变处理
    handleChange() {
      if (this.form.bgType === 'color') {
        this.$set(this.form, 'bgPic', '')
        this.$set(this.form, 'startColor', '')
        this.$set(this.form, 'endColor', '')
      } else if (this.form.bgType === 'gradient') {
        this.$set(this.form, 'bgPic', '')
        this.$set(this.form, 'bgColor', '')
      } else if (this.form.bgType === 'pic') {
        this.$set(this.form, 'bgColor', '')
        this.$set(this.form, 'startColor', '')
        this.$set(this.form, 'endColor', '')
      }
    },
    // 重置背景颜色
    onResetBgColor() {
      this.form.bgColor = ''
      this.handleChange()
    },
    // 重置起始颜色
    onResetStartColor() {
      this.form.startColor = ''
      this.handleChange()
    },
    // 重置结束颜色
    onResetEndColor() {
      this.form.endColor = ''
      this.handleChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.comps_style {
  &-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .im-tt {
      width: 80px;
      font-size: 12px;
      color: #595961;
      padding-top: 10px;
      flex-shrink: 0;
    }

    .im-bd {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;

      &-pd {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-right: 10px;

        .label {
          font-size: 10px;
          padding-right: 5px;
          color: rgb(156, 156, 156);
          min-width: 28px;
          flex-shrink: 0;
        }

        .el-input-number {
          flex: 1;
          min-width: 80px;
        }
      }
    }

    .el-color-picker-wrap {
      display: flex;
      align-items: center;
    }

    &.comps_style-bg {
      flex-direction: row;
      align-items: flex-start;
      margin-left: -80px;

      .im-bd {
        width: 100%;
        flex-direction: column;

        .background-type-selector {
          margin-bottom: 10px;
          width: 100%;
          .el-radio-group {
            width: 100%;
            display: flex;
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

          .color-section,
          .gradient-section {
            .color-item,
            .gradient-item {
              display: flex;
              align-items: center;
              margin-bottom: 10px;

              &:last-child {
                margin-bottom: 0;
              }

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
          }

          .image-section {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.comps_style {
  .el-input-number.is-controls-right .el-input__inner {
    padding-right: 35px;
    padding-left: 5px;
    text-align: left;
  }

  .el-form-item__content {
    line-height: normal;
  }
}
</style>
