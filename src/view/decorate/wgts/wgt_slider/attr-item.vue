<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.attr_slider {
  width: 100%;

  .slider-item {
    display: flex;
    border-top: 1px solid #fff;
    padding-top: 10px;
    justify-content: space-between;
    width: 100%;

    .slider-item-img {
      display: flex;
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
.attr_slider {
  .drag-list {
    padding: 10px;
    border: 1px dashed #e6e6e6;
  }

  .btn-todo {
    width: 100%;
  }

  .slider-item-link {
    .zone-item-link-no {
      height: 30px;
      line-height: 30px;
      border: 1px solid #e6e6e6;
      border-radius: 2px;
      padding: 0px 5px;
      margin-top: 10px;
      width: 100%;
      text-align: center;
    }
    .zone-item {
      .zone-item-link {
        margin-top: 10px;
      }
    }
  }
}

.attr_slider_dialog {
  .el-dialog__body {
    max-height: 72vh;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
<template>
  <div class="attr_slider" v-if="refresh">
    <CompTodoList
      v-model="localValue"
      @onAddItem="handleClickAdd"
      type="text"
      btn-text="添加轮播项"
      :show-title="true"
      @move="handleMove"
    >
    <template slot="header" slot-scope="scope">
      轮播{{ scope.index + 1 }}
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
              :src="(scope.data.videoUrl && typeof scope.data.videoUrl === 'object' && scope.data.videoUrl.url) ? scope.data.videoUrl.url : (scope.data.videoUrl || '')"
              width="64"
              height="64"
              @click="onSetHotZone(scope.data, scope.index)"
            />
          </div>
          <div class="slider-item-info">
            <div class="slider-item-type">
              <div>{{ scope.data.media_type == 'video' ? '视频' : '图片' }}</div>
            </div>
            <div class="slider-item-link">
              <div
                v-if="(scope.data.hotData || []).length == 0 && (scope.data.overlayHotData || []).length == 0"
                class="zone-item-link-no"
                @click="onSetHotZone(scope.data, scope.index)"
              >
                选择路径
              </div>
              <div class="zone-item" v-if="scope.data.media_type === 'img'">
                <span
                  v-for="(item, index) in scope.data.hotData"
                  :key="`copy-zone-item__${index}`"
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
              <div class="zone-item">
                <span
                  v-for="(item, index) in scope.data.overlayHotData"
                  :key="`copy-zone-item__${index}`"
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
      </template>
    </CompTodoList>
  </div>
</template>

<script>
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
        title: `轮播项${index + 1}`,
        width: '860px',
        top: '4vh',
        class: 'attr_slider_dialog',
        sliderItem: item,
        defaultValue: this.localValue[0],
        index: index,
        component: () => import('./sliderDialog.vue'),
        actions: [
          {
            label: '关闭',
            key: 'close',
            type: 'default',
            size: 'small'
          },
          { label: '确定', key: 'save', type: 'primary', size: 'small' }
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
    }
  }
}
</script>
