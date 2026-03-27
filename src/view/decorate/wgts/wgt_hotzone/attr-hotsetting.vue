<template>
  <div>
    <CompButton
      :placeholder="i18n.t('b6659c98.3d0b48')"
      :format="i18n.t('b6659c98.74e431')"
      :value="localValue.data.length"
      :view-btn="false"
      @click="onSetHotZone"
      @remove="onRemoveHotZone"
    />

    <el-dialog
      :visible="dialog"
      class="sp-dialog"
      lock-scroll
      append-to-body
      destroy-on-close
      :title="i18n.t('b6659c98.c90f57')"
      width="800px"
      top="5vh"
      @close="onCancel"
    >
      <div v-if="dialog">
        <div class="dialog-header">
          <el-button type="primary" size="small" plain @click="onSelectImage">
            {{ i18n.t('b6659c98.ba9fc4') }}
          </el-button>
          <span class="dialog-tip">{{ desc || defaultDesc }}</span>
        </div>

        <div class="hot-content">
          <div class="hot-content-inner">
            <div class="hot-content-inner-left">
              <hotzone
                class="hotzone"
                :image="localValue.imgUrl"
                :zones-init="localValue.data"
                @change="handleZoneChange"
                @remove="handleZoneRemove"
              />
              <div class="hot-content-inner-right">
                <div
                  v-for="(item, index) in localValue.data"
                  :key="getZoneKey(index)"
                  class="zone-item"
                >
                  <div class="zone-item-title">
                    <span>{{ i18n.t('b6659c98.50da72') }}{{ index + 1 }}</span>
                  </div>
                  <CompPickerLink
                    :value="item"
                    :regionauthid="regionauthid"
                    @change="(e) => handleLinkChange(e, index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">{{ i18n.t('b6659c98.c08ab9') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ i18n.t('b6659c98.aa7527') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import Vue from 'vue'
import hotzone from 'vue-hotzone'
import { cloneDeep } from 'lodash'
import CompPickerLink from '../../comps/comp-pickerLink'
import CompButton from '../../comps/comp-button'
import { isArray } from '@/utils'

// 常量定义
const DEFAULT_DESC_KEY = 'b6659c98.818403'
const DEFAULT_IMG_WIDTH = 375
const DEFAULT_VALUE = {
  imgUrl: '',
  imgWidth: 0,
  imgHeight: 0,
  data: []
}

export default {
  name: 'AttrHotSetting',
  components: {
    CompPickerLink,
    CompButton,
    hotzone
  },
  props: {
    regionauthid: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => ({ ...DEFAULT_VALUE })
    },
    desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {i18n,
      localValue: { ...DEFAULT_VALUE },
      dialog: false
    }
  },
  watch: {
    localValue: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  computed: {
    // 默认描述文本
    defaultDesc() {
      return i18n.t(DEFAULT_DESC_KEY)
    }
  },
  created() {
    // 初始化本地值，只在创建时同步一次
    this.initLocalValue(this.value)
  },
  methods: {
    // 初始化本地值
    initLocalValue(value) {
      const data = isArray(value?.data) ? value.data : []
      this.localValue = {
        imgUrl: value?.imgUrl || '',
        imgWidth: value?.imgWidth || 0,
        imgHeight: value?.imgHeight || 0,
        data: cloneDeep(data)
      }
    },

    // 获取热区唯一key
    getZoneKey(index) {
      return `zone-item__${index}`
    },

    // 打开热区设置对话框
    onSetHotZone() {
      this.dialog = true
    },

    // 移除所有热区
    onRemoveHotZone() {
      this.localValue.data = []
    },

    // 选择图片
    async onSelectImage() {
      try {
        const {
          data: { url }
        } = await this.$picker.image({
          data: { url: this.localValue.imgUrl }
        })

        const { imgWidth, imgHeight } = await this.calculateImageSize(url)

        // 确保 imgWidth 和 imgHeight 被正确设置
        this.$set(this.localValue, 'imgWidth', imgWidth)
        this.$set(this.localValue, 'imgHeight', imgHeight)
        this.$set(this.localValue, 'imgUrl', url)
      } catch (error) {
        console.error('选择图片失败:', error)
      }
    },

    // 计算图片尺寸
    calculateImageSize(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => {
          const width = img.width || 1
          const height = img.height || 1
          const imgWidth = DEFAULT_IMG_WIDTH
          const imgHeight = Math.round((height / width) * imgWidth)
          resolve({ imgWidth, imgHeight })
        }
        img.onerror = () => {
          reject(new Error('图片加载失败'))
        }
        img.src = url
      })
    },

    // 热区变化处理
    handleZoneChange(zones) {
      zones.forEach((zone, index) => {
        this.updateZoneData(index, {
          heightPer: zone.heightPer,
          widthPer: zone.widthPer,
          leftPer: zone.leftPer,
          topPer: zone.topPer
        })
      })
    },

    // 移除热区
    handleZoneRemove(index) {
      this.localValue.data.splice(index, 1)
    },

    // 链接变化处理
    handleLinkChange(linkData, index) {
      this.updateZoneData(index, linkData)
    },

    // 更新热区数据
    updateZoneData(index, newData) {
      const currentData = cloneDeep(this.localValue.data[index] || {})
      Vue.set(this.localValue.data, index, {
        ...currentData,
        ...newData
      })
    },

    // 取消操作
    onCancel() {
      this.dialog = false
      // 恢复原始值
      this.initLocalValue(this.value)
    },

    // 确认操作
    onConfirm() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.hot-content {
  margin-top: 10px;

  &-inner {
    display: flex;
    gap: 16px;

    &-left {
      width: 100%;
      position: relative;
      height: fit-content;
      overflow: hidden;
      min-height: 68vh;

      .hotzone {
        width: 49%;
        height: 100%;
      }

      .hot-content-inner-right {
        width: 49%;
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .dialog-tip {
    font-size: 12px;
    color: #888;
    margin-left: 8px;
  }
}

.zone-item {
  margin-bottom: 16px;
  border: 1px solid #8c8c8c;

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;
    background-color: rgb(194, 227, 251);
    padding: 10px;
  }

  .comp-picker-link {
    padding: 0 10px 10px;
  }
}
</style>
