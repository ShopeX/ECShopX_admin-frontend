<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="wgts-slider-dialog">
    <div class="wgts-slider-dialog-left" v-if="sliderForm.media_type === 'img'">
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
          notSupportedMessage: i18n.t('d7d37966.01c0da'),
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
      label-position="left"
    />
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import hotzone from 'vue-hotzone'
import CompPickerLink from '../../comps/comp-pickerLink'
import { cloneDeep } from 'lodash'
import { getImageAttribute, getVideoAttribute } from './utils'
import SpForm from '@/components/sp-form'
import SpImagePicker from '@/components/sp-image-picker/index.vue'
import VideoPicker from '@/components/sp-picker-plus/VideoPicker.vue'
export default {
  name: 'SliderDialog',
  components: {
    SpForm,
    SpImagePicker,
    VideoPicker,
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
      i18n,
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
    },
    onChangeVideoLink(e) {
      this.$set(this.sliderForm, 'data', { ...(this.sliderForm.data || {}), ...e })
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
          label: i18n.t('d7d37966.701f7f'),
          key: 'media_type',
          type: 'radio',
          width: '100%',

          options: [
            {
              label: 'img',
              name: i18n.t('d7d37966.20def7')
            },
            {
              label: 'video',
              name: i18n.t('d7d37966.7fcf42')
            }
          ]
        },
        {
          label: media_type == 'video' ? i18n.t('d7d37966.7fcf42') : i18n.t('d7d37966.20def7'),
          key: 'videoUrl',

          width: '100%',
          component: ({ key }) => {
            return (
              <div class='video-list'>
                {media_type == 'video' && (
                  <VideoPicker v-model={this.sliderForm[key]} size='small' class='video-link' />
                )}
                {media_type == 'img' && (
                  <div class='zone-list'>
                    <SpImagePicker
                      v-model={this.sliderForm.imgUrl}
                      size='small'
                      class='video-link'
                      text={
                        media_type == 'video'
                          ? i18n.t('d7d37966.412310')
                          : i18n.t('d7d37966.20def7')
                      }
                    />
                    <div>{i18n.t('d7d37966.e76dee')}</div>
                    <div class='zone-list-hotdata'>
                      {hotData?.map((item, index) => {
                        return (
                          <div class='zone-item'>
                            <div class='zone-item-label'>
                              <span>
                                {i18n.t('d7d37966.50da72')}
                                {index + 1}
                              </span>

                              <el-button
                                type='text'
                                size='small'
                                onClick={() => {
                                  this.handleRemove(index, 'img')
                                }}
                              >
                                {i18n.t('d7d37966.2f4aad')}
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
          label: i18n.t('58595357.e3cf91'),
          key: 'videoLinkPage',
          component: () => (
            <CompPickerLink
              isShowH5Link={false}
              value={this.sliderForm.data || {}}
              wgtType='hotzone'
              class='zone-item-picker'
              on-change={(e) => this.onChangeVideoLink(e)}
            />
          ),
          isShow: media_type == 'video'
        },
        {
          label: i18n.t('d7d37966.641cfa'),
          key: 'imgUrl',
          width: '100%',

          component: () => (
            <SpImagePicker v-model={this.sliderForm.imgUrl} size='small' class='video-link' />
          ),
          isShow: media_type == 'video'
        },
        {
          label: i18n.t('d7d37966.b8cfcd'),
          key: 'autoplay',
          width: '100%',

          type: 'switch',
          isShow: media_type == 'video'
        },
        {
          label: i18n.t('d7d37966.b46893'),
          key: 'interact',
          width: '100%',

          type: 'radio',
          options: [
            {
              label: 'reset',
              name: i18n.t('d7d37966.4b9c32')
            },
            {
              label: 'pause',
              name: i18n.t('d7d37966.8d63ef')
            }
          ],
          isShow: media_type == 'video'
        },
        {
          label: media_type == 'video' ? i18n.t('d7d37966.17aaa3') : i18n.t('d7d37966.680a76'),
          key: 'overlay',
          width: '100%',

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
                <div>{i18n.t('d7d37966.e76dee')}</div>
                <div class='zone-list-overlaydata'>
                  {overlayHotData?.map((item, index) => {
                    return (
                      <div class='zone-item'>
                        <div class='zone-item-label'>
                          <span>
                            {i18n.t('d7d37966.5cefe9')}
                            {index + 1}
                          </span>
                          <el-button
                            type='text'
                            size='small'
                            onClick={() => {
                              this.handleRemove(index, 'overlay')
                            }}
                          >
                            {i18n.t('d7d37966.2f4aad')}
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
          label: i18n.t('d7d37966.68f333'),
          key: 'overlayWidth',
          width: '100%',

          isShow: this.sliderForm.overlay,
          tip: i18n.t('d7d37966.dddfd9'),
          type: 'slider',
          maxlength: 10,
          showInput: true,
          placeholder: i18n.t('d7d37966.8bc93d')
        },
        {
          label: i18n.t('d7d37966.7c2c35'),
          key: 'overlaybuttom',
          width: '100%',

          isShow: this.sliderForm.overlay,
          type: 'slider',
          tip: i18n.t('d7d37966.dddfd9'),
          showInput: true,
          maxlength: 10,
          placeholder: i18n.t('d7d37966.76c356')
        },
        {
          label: i18n.t('d7d37966.d1d8cd'),
          key: 'overlayLeft',
          width: '100%',

          isShow: this.sliderForm.overlay,
          showInput: true,
          tip: i18n.t('d7d37966.dddfd9'),
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
        // 视频类型保证 data（选择路径）存在
        if (this.sliderForm.media_type === 'video' && !this.sliderForm.data) {
          this.$set(this.sliderForm, 'data', { linkPage: '', title: '', id: '' })
        }
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
    max-height: calc(72vh - 60px) !important;

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
