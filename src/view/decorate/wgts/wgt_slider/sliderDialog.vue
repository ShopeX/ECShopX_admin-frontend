<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="wgts-slider-dialog">
    <div
      class="wgts-slider-dialog-left"
      v-if="sliderForm.media_type === 'img'"
    >
      <SpImage
        v-if="!sliderForm.imgUrl"
        :src="sliderForm.imgUrl"
        class="sp-image"
        fit="scale-down"
      />
      <hotzone
        v-if="sliderForm.imgUrl"
        class="hotzone"
        :image="sliderForm.imgUrl"
        :zones-init="sliderForm.hotData"
        :key="`hotzone-img-${hotzoneKey}`"
        @add="handleAdd($event)"
        @change="handleChange($event)"
        @remove="handleRemove($event, 'img')"
      />
      <hotzone
        class="overlay"
        :image="sliderForm.overlay || ''"
        :zones-init="sliderForm.overlayHotData"
        v-if="sliderForm.overlay"
        :key="`overlay-img-${overlayHotzoneKey}`"
        :style="overlayStyle"
        @add="handleAdd($event, 'overlay')"
        @change="handleChange($event, 'overlay')"
        @remove="handleRemove($event, 'overlay')"
      />
    </div>

    <div class="wgts-slider-dialog-left" v-else>
      <SpImage v-if="!videoUrlStr" class="sp-image" fit="scale-down" />
      <video-player
        v-if="videoUrlStr"
        class="image-item-video"
        :options="{
          aspectRatio: '16:9',
          fluid: true,
          sources: [
            {
              type: 'video/mp4',
              src: videoUrlStr
            }
          ],
          notSupportedMessage: '此视频暂无法播放，请稍后再试',
          controlBar: false
        }"
      />
      <hotzone
        class="overlay"
        :image="sliderForm.overlay || ''"
        :zones-init="sliderForm.overlayHotData"
        v-if="sliderForm.overlay"
        :key="`overlay-video-${overlayHotzoneKey}`"
        :style="overlayStyle"
        @add="handleAdd($event, 'overlay')"
        @change="handleChange($event, 'overlay')"
        @remove="handleRemove($event, 'overlay')"
      />
    </div>
    <SpForm
      ref="form"
      class="sp-form"
      v-model="sliderForm"
      :form-list="sliderFormList"
      :submit="false"
      label-width="110px"
    />
  </div>
</template>

<script>
import hotzone from 'vue-hotzone'
import CompPickerLink from '../../comps/comp-pickerLink'
import { cloneDeep } from 'lodash'
import { getImageAttribute, getVideoAttribute } from './utils'
import SpForm from '@/components/sp-form'
export default {
  name: 'SliderDialog',
  components: {
    SpForm,
    hotzone,
    CompPickerLink
  },
  props: {
    sliderItem: Object,
    defaultValue: Object,
    index: Number,
    height: Number
  },
  data() {
    return {
      sliderForm: null,
      h: '0px',
      isRemoving: false,
      hotzoneKey: 0,
      overlayHotzoneKey: 0
    }
  },
  methods: {
    handleAdd(e, type) {
      let item = {
        linkPage: '',
        title: '',
        id: '',
        linkTitle: '',
        linkAppid: '',
        linkProgram: '1',
        card_type: '',
        goods_id: '',
        rule_id: '0',
        CopyUrl: '',
        CopyTitle: '',
        moreLink: ''
      }
      if (type === 'overlay') {
        this.sliderForm.overlayHotData.push(item)
      } else {
        this.sliderForm.hotData.push(item)
      }
    },
    handleChange(zone, type) {
      if (this.isRemoving) return
      console.log('handleChange', zone, type)
      setTimeout(() => {
        if (this.isRemoving) return
        if (!zone || !Array.isArray(zone)) return
        if (!this.sliderForm) return
        zone.forEach((item, index) => {
          if (item && item.leftPer) {
            let obj = {
              heightPer: item?.heightPer,
              leftPer: item?.leftPer,
              topPer: item?.topPer,
              widthPer: item?.widthPer
            }
            if (type == 'overlay') {
              if (
                !this.sliderForm.overlayHotData ||
                index >= this.sliderForm.overlayHotData.length ||
                !this.sliderForm.overlayHotData[index]
              )
                return
              let ele = cloneDeep(this.sliderForm.overlayHotData[index])
              Object.assign(ele, obj)
              this.sliderForm.overlayHotData.splice(index, 1, ele)
            } else {
              if (
                !this.sliderForm.hotData ||
                index >= this.sliderForm.hotData.length ||
                !this.sliderForm.hotData[index]
              )
                return
              let ele = cloneDeep(this.sliderForm.hotData[index])
              Object.assign(ele, obj)
              this.sliderForm.hotData.splice(index, 1, ele)
            }
          }
        })
      }, 500)
    },
    handleRemove(index, type) {
      if (this.isRemoving) return
      this.isRemoving = true
      if (type == 'overlay') {
        const newData = this.sliderForm.overlayHotData.filter((_, i) => i !== index)
        this.$set(this.sliderForm, 'overlayHotData', newData)
        this.overlayHotzoneKey++
      } else {
        // type 可能是 'img' 或 undefined，都处理为图片热区
        const newData = this.sliderForm.hotData.filter((_, i) => i !== index)
        this.$set(this.sliderForm, 'hotData', newData)
        this.hotzoneKey++
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.isRemoving = false
        }, 600)
      })
    },

    onChangeLink(e, index) {
      const v = cloneDeep(this.sliderForm.hotData[index])
      this.$set(this.sliderForm.hotData, index, Object.assign(v, e))
    },
    onChangeHotDataLink(e, index) {
      const v = cloneDeep(this.sliderForm.overlayHotData[index])
      this.$set(this.sliderForm.overlayHotData, index, Object.assign(v, e))
    },
    handleAction(e) {
      if (e.key === 'save') {
        this.$emit('close', {
          sliderForm: this.sliderForm,
          h: this.h
        })
      }
    },
    changeOverlay(e) {
      if (!e) {
        this.$set(this.sliderForm, 'overlay', '')
        this.$set(this.sliderForm, 'overlayHotData', [])
      }
    }
  },
  computed: {
    // 统一为字符串，避免视频选择器返回对象导致播放器报错、配置区空白
    videoUrlStr() {
      if (!this.sliderForm || !this.sliderForm.videoUrl) return ''
      const v = this.sliderForm.videoUrl
      return typeof v === 'object' && v !== null && v.url != null
        ? v.url
        : typeof v === 'string'
        ? v
        : ''
    },
    sliderFormList() {
      if (!this.sliderForm) return []
      const { media_type, hotData = [], overlayHotData = [] } = this.sliderForm
      return [
        {
          label: '内容类型',
          key: 'media_type',
          type: 'radio',
          options: [
            {
              label: 'img',
              name: '图片'
            },
            {
              label: 'video',
              name: '视频'
            }
          ]
        },
        {
          label: media_type == 'video' ? '视频' : '图片',
          key: 'videoUrl',
          component: ({ key }) => {
            return (
              <div class='video-list'>
                {media_type == 'video' && (
                  <SpVideoPicker v-model={this.sliderForm[key]} size='small' class='video-link' />
                )}
                {media_type == 'img' && (
                  <div class='zone-list'>
                    <SpImagePicker
                      v-model={this.sliderForm.imgUrl}
                      size='small'
                      class='video-link'
                      text={media_type == 'video' ? '封面' : '图片'}
                    />
                    <div>建议尺寸：（宽度640px，高度自适应）</div>
                    <div class='zone-list-hotdata'>
                      {hotData?.map((item, index) => {
                        return (
                          <div class='zone-item'>
                            <div class='zone-item-label'>
                              <span>热区{index + 1}</span>

                              <el-button
                                type='text'
                                size='small'
                                onClick={() => {
                                  this.handleRemove(index, 'img')
                                }}
                              >
                                删除
                              </el-button>
                            </div>
                            <CompPickerLink
                              isShowH5Link={false}
                              value={item}
                              wgtType='hotzone'
                              class='zone-item-picker'
                              on-change={(e) => this.onChangeLink(e, index)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          }
        },
        {
          label: '入场自动播放',
          key: 'autoplay',
          type: 'switch',
          isShow: media_type == 'video'
        },
        {
          label: '离场视频交互',
          key: 'interact',
          type: 'radio',
          options: [
            {
              label: 'reset',
              name: '重置'
            },
            {
              label: 'pause',
              name: '暂停'
            }
          ],
          isShow: media_type == 'video'
        },
        {
          label: media_type == 'video' ? '视频叠层' : '图片叠层',
          key: 'overlay',
          component: ({ key }) => {
            return (
              <div class='overlay-list'>
                <SpImagePicker
                  v-model={this.sliderForm[key]}
                  size='small'
                  class='video-link'
                  ononChange={(e) => {
                    this.changeOverlay(e)
                  }}
                />
                <div>建议尺寸：（宽度640px，高度自适应）</div>
                <div class='zone-list-overlaydata'>
                  {overlayHotData?.map((item, index) => {
                    return (
                      <div class='zone-item'>
                        <div class='zone-item-label'>
                          <span>叠层热区{index + 1}</span>
                          <el-button
                            type='text'
                            size='small'
                            onClick={() => {
                              this.handleRemove(index, 'overlay')
                            }}
                          >
                            删除
                          </el-button>
                        </div>
                        <CompPickerLink
                          isShowH5Link={false}
                          value={item}
                          wgtType='hotzone'
                          class='zone-item-picker'
                          on-change={(e) => this.onChangeHotDataLink(e, index)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }
        },
        {
          label: '叠层宽度',
          key: 'overlayWidth',
          isShow: this.sliderForm.overlay,
          tip: '单位为 %',
          type: 'slider',
          maxlength: 10,
          showInput: true,
          placeholder: '请输入宽度'
        },
        {
          label: '叠层下边距离',
          key: 'overlaybuttom',
          isShow: this.sliderForm.overlay,
          type: 'slider',
          tip: '单位为 %',
          showInput: true,
          maxlength: 10,
          placeholder: '请输入下边距离'
        },
        {
          label: '叠层左边距离',
          key: 'overlayLeft',
          isShow: this.sliderForm.overlay,
          showInput: true,
          tip: '单位为 %',
          type: 'slider',
          maxlength: 10
        }
      ]
    },
    overlayStyle() {
      const { overlaybuttom, overlayLeft, overlayWidth } = this.sliderForm
      return {
        bottom: `${overlaybuttom}%`,
        left: `${overlayLeft}%`,
        width: `${overlayWidth}%`
      }
    }
  },
  watch: {
    sliderItem: {
      handler(val) {
        if (!val) return
        this.sliderForm = cloneDeep(val)
        // 保证热区数组存在，避免后续访问 .length 或 .push 报错
        if (!Array.isArray(this.sliderForm.hotData)) this.sliderForm.hotData = []
        if (!Array.isArray(this.sliderForm.overlayHotData)) this.sliderForm.overlayHotData = []
        this.h = this.height || 375
      },
      deep: true,
      immediate: true
    },
    'sliderForm.imgUrl': {
      handler(val) {
        if (this.index !== 0) return
        if (this.sliderForm.media_type == 'video' && !!this.sliderForm.videoUrl) return
        if (val) {
          getImageAttribute(val, (h) => {
            this.h = h
          })
        }
      }
    },
    'sliderForm.videoUrl': {
      handler(val) {
        // 视频选择器可能返回对象 { url }，统一存为字符串避免配置区空白
        if (val && typeof val === 'object' && val.url != null) {
          this.$set(this.sliderForm, 'videoUrl', val.url)
          return
        }
        if (this.index !== 0) return
        const url = typeof val === 'string' ? val : ''
        if (url) {
          getVideoAttribute(url, (h) => {
            this.h = h
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.wgts-slider-dialog {
  display: flex;

  .hotzone {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
  }

  .sp-form {
    flex: 1;
    margin-left: 20px;
  }

  .wgts-slider-dialog-left {
    overflow: hidden;
    position: relative;
    width: 375px;
    min-width: 375px;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: calc(72vh - 60px)!important;

    .overlay {
      position: absolute;
      z-index: 9999;
    }
  }

  .video-list {
    display: flex;

    .video-link {
      margin-right: 10px;
    }
  }

  .image-item-video {
    width: 375px;
  }
}
</style>
<style lang="scss">
.wgts-slider-dialog {
  .sp-form .el-form-item {
    margin-bottom: 6px;
  }

  .overlay-list {
    display: flex;
    position: relative;
    flex-direction: column;

    .el-icon-circle-close {
      position: absolute;
      top: -5px;
      left: 56px;
      cursor: pointer;
    }

    .zone-list-overlaydata {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-left: -80px;
    }

    .zone-item {
      margin-bottom: 5px;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f7;
      padding: 10px;

      .zone-item-label {
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .image-item-video {
    width: 100%;
    height: 100%;

    .vjs-big-play-button {
      display: none;
    }
  }

  .zone-list {
    flex: 1;

    .zone-list-hotdata {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-left: -80px;

      .zone-item {
        margin-bottom: 5px;
        display: flex;
        flex-direction: column;
        background-color: #f5f5f7;
        padding: 10px;

        .zone-item-label {
          width: 100%;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .zone-item-picker {
          flex: 1;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.wgts-slider-dialog {
  .hz-u-img {
    object-fit: cover;
    max-height: calc(72vh - 60px) !important;
  }
}
</style>
