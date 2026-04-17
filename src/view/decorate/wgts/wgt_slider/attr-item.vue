<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.wgt_slider_attr_item {
  width: 100%;

  .slider-item {
    display: flex;
    border-top: 1px solid #fff;
    padding-top: 10px;
    justify-content: space-between;
    width: 100%;

    .slider-item-img {
      display: flex;
      width: 70px;
      height: 70px;

      img,
      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .slider-item-info {
      flex: 1;
      margin-left: 10px;

      .slider-item-type {
        display: flex;
        align-items: center;
        margin-bottom: 6px;

        .el-radio-group {
          margin-top: 0px;
        }

        .label {
          width: 50px;
        }
      }
    }

    .slider-item-link {
      .label {
        width: 50px;
        flex-shrink: 0;
      }

      .zone-group {
        margin-top: 10px;

        &:not(:first-child) {
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px dashed #e8e8e8;
        }
      }

      .zone-group-title {
        font-size: 12px;
        color: #909399;
        margin-bottom: 6px;
      }

      .zone-item {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.wgt_slider_attr_item {
  .drag-list {
    padding: 10px;
    border: 1px dashed #e6e6e6;
  }

  .btn-todo {
    width: 100%;
  }

  .slider-item-link {
    .zone-item-link-wrap {
      width: 100%;
    }

    .zone-group-title {
      font-size: 12px;
      color: #909399;
      margin-bottom: 6px;
    }

    .zone-item {
      .zone-item-link {
        margin-top: 10px;
      }
    }
  }
}

.wgt_slider_attr_item_dialog {
  .el-dialog__body {
    max-height: 72vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
<template>
  <div class="wgt_slider_attr_item" v-if="refresh">
    <CompTodoList
      v-model="localValue"
      @onAddItem="handleClickAdd"
      type="text"
      :btn-text="i18n.t('58595357.4cd62d')"
      :show-title="true"
      @move="handleMove"
    >
      <template slot="header" slot-scope="scope">
        {{ i18n.t('58595357.a5987d') }} {{ scope.index + 1 }}
      </template>
      <template slot="body" slot-scope="scope">
        <div class="slider-item">
          <div class="slider-item-img">
            <sp-image
              v-if="scope.data.media_type == 'img'"
              :src="scope.data.imgUrl"
              width="70"
              height="70"
              @click.native="onSetHotZone(scope.data, scope.index)"
            />
            <video
              v-else
              :src="
                scope.data.videoUrl &&
                typeof scope.data.videoUrl === 'object' &&
                scope.data.videoUrl.url
                  ? scope.data.videoUrl.url
                  : scope.data.videoUrl || ''
              "
              width="70"
              height="70"
              @click="onSetHotZone(scope.data, scope.index)"
            />
          </div>
          <div class="slider-item-info">
            <div class="slider-item-type">
              <div>
                {{
                  scope.data.media_type == 'video'
                    ? i18n.t('58595357.7fcf42')
                    : i18n.t('58595357.20def7')
                }}
              </div>
            </div>
            <div class="slider-item-link">
              <!-- 选择路径（仅视频展示，使用 CompPickerLink 与热区一致） -->
              <div v-if="scope.data.media_type === 'video'" class="zone-group zone-group-path">
                <div class="zone-group-title">{{ i18n.t('58595357.e3cf91') }}</div>
                <div class="zone-item">
                  <span class="zone-item-link">
                    <CompPickerLink
                      :is-show-h5-link="false"
                      :value="scope.data.data || {}"
                      wgt-type="hotzone"
                      @change="(e) => onChangeVideoPath(e, scope.index)"
                    />
                  </span>
                </div>
              </div>
              <!-- 仅图片展示热区配置，视频不展示 -->
              <div
                v-if="scope.data.media_type !== 'video' && (scope.data.hotData || []).length > 0"
                class="zone-group"
              >
                <div class="zone-group-title">{{ i18n.t('d7d37966.50da72') }}</div>
                <div class="zone-item">
                  <span
                    v-for="(item, index) in scope.data.hotData"
                    :key="`hot-${scope.index}-${index}`"
                    class="zone-item-link"
                  >
                    <CompPickerLink
                      :is-show-h5-link="false"
                      :value="item"
                      wgt-type="hotzone"
                      @change="(e) => onChangeLocalhotDate(e, scope.index, index)"
                    />
                  </span>
                </div>
              </div>
              <!-- 仅图片展示叠层热区配置，视频不展示 -->
              <div
                v-if="
                  scope.data.media_type !== 'video' && (scope.data.overlayHotData || []).length > 0
                "
                class="zone-group"
              >
                <div class="zone-group-title">{{ i18n.t('d7d37966.5cefe9') }}</div>
                <div class="zone-item">
                  <span
                    v-for="(item, index) in scope.data.overlayHotData"
                    :key="`overlay-${scope.index}-${index}`"
                    class="zone-item-link"
                  >
                    <CompPickerLink
                      :is-show-h5-link="false"
                      :value="item"
                      wgt-type="hotzone"
                      @change="(e) => onChangeLocaloverhotDate(e, scope.index, index)"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import { cloneDeep } from 'lodash'
import CompTodoList from '../../comps/comp-todoList'
import CompPickerLink from '../../comps/comp-pickerLink'
import SliderDialog from './sliderDialog.vue'
import { useDialog } from '@shopex-ui/finder'

export default {
  name: 'AttrItem',
  components: {
    CompTodoList,
    CompPickerLink,
    SliderDialog
  },
  props: {
    value: {
      type: Array
    },
    uuid: {
      type: String
    }
  },
  data() {
    return {
      i18n,
      localValue: [],
      dialog: false,
      currentIndex: 0,
      sliderForm: null,
      refresh: true
    }
  },
  watch: {
    localValue: {
      deep: true,
      handler: function (nVal, oVal) {
        this.$emit('input', nVal)
      }
    },
    uuid: {
      handler(nVal, oVal) {
        this.localValue = cloneDeep(this.value)
      },
      deep: true
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async onSetHotZone(item, index) {
      useDialog(null, {
        title: i18n.t('58595357.3db933') + (index + 1),
        width: '860px',
        top: '4vh',
        class: 'attr_slider_dialog',
        sliderItem: item,
        defaultValue: this.localValue[0],
        index: index,
        component: () => import('./sliderDialog.vue'),
        actions: [
          {
            label: i18n.t('58595357.b15d91'),
            key: 'close',
            type: 'default',
            size: 'small'
          },
          { label: i18n.t('58595357.38cf16'), key: 'save', type: 'primary', size: 'small' }
        ]
      }).then(async (args) => {
        if (!args) return
        const { sliderForm } = args
        this.refresh = false
        this.$set(this.localValue, index, sliderForm)
        this.$nextTick(() => {
          this.refresh = true
        })
      })
    },
    async handleClickAdd() {
      this.localValue = await this.localValue.concat({
        media_type: 'img',
        videoUrl: '',
        autoplay: false,
        interact: 'reset',
        overlay: '',
        overlayWidth: 100,
        overlaybuttom: 0,
        overlayLeft: 0,
        imgUrl: '',
        mainTitle: '',
        hotData: [],
        overlayHotData: [],
        idx: this.localValue.length + 1
      })
    },
    async handleMove() {
      // 移动时不需要特殊处理
    },
    async onChangeLocalhotDate(e, pid, index) {
      let ele = cloneDeep(this.localValue[pid].hotData[index])
      Object.assign(ele, e)
      this.$set(this.localValue[pid].hotData, index, ele)
    },
    async onChangeLocaloverhotDate(e, pid, index) {
      let ele = cloneDeep(this.localValue[pid].overlayHotData[index])
      Object.assign(ele, e)
      this.$set(this.localValue[pid].overlayHotData, index, ele)
    },
    onChangeVideoPath(e, index) {
      const item = this.localValue[index]
      this.$set(this.localValue[index], 'data', { ...(item.data || {}), ...e })
    }
  }
}
</script>
