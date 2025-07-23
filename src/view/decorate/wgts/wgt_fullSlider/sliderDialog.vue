<template>
  <div class="wgts-slider-dialog">
    <div class="wgts-slider-dialog-left" v-if="sliderForm.media_type === 'img'"
    :style="`height:${h}px;background:#f5f5f7`">
      <SpImage v-if="!sliderForm.imgUrl" :src="sliderForm.imgUrl" class="sp-image"
      fit="scale-down" />
      <hotzone v-if="sliderForm.imgUrl" class="hotzone" :image="sliderForm.imgUrl"
        :zonesInit="sliderForm.hotData" @add="handleAdd($event)" @change="handleChange($event)"
        @remove="handleRemove($event)" />
      <hotzone class="overlay" :image="sliderForm.overlay || ''" :zonesInit="sliderForm.overlayHotData"
        v-if="sliderForm.overlay" :style="overlayStyle" @add="handleAdd($event, 'overlay')"
        @change="handleChange($event, 'overlay')" @remove="handleRemove($event, 'overlay')" />
    </div>

    <div class="wgts-slider-dialog-left" v-else :style="`height:${h}px;background:#f5f5f7`">
      <SpImage v-if="!sliderForm.videoUrl" class="sp-image" fit="scale-down" />
      <!-- <video v-if="sliderForm.videoUrl" :src="sliderForm.videoUrl" class="image-item-video"
       >您的浏览器不支持 video 标签。</video> -->
      <video-player v-if="sliderForm.videoUrl" class='image-item-video' :options="{
        aspectRatio: '16:9',
        fluid: true,
        sources: [
          {
            type: 'video/mp4',
            src: sliderForm.videoUrl
          }
        ],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: false
      }" />
      <hotzone class="overlay" :image="sliderForm.overlay || ''" :zonesInit="sliderForm.overlayHotData"
        v-if="sliderForm.overlay" :style="overlayStyle" @add="handleAdd($event, 'overlay')"
        @change="handleChange($event, 'overlay')" @remove="handleRemove($event, 'overlay')" />
    </div>
    <SpForm ref='form' v-model="sliderForm" :formList='sliderFormList' :submit='false' labelWidth='100px' />
  </div>
</template>

<script>
import hotzone from 'vue-hotzone'
import CompPickerLink from "../../comps/comp-pickerLink";
import { cloneDeep } from 'lodash'
import { getImageAttribute, getVideoAttribute } from "./utils";
import { proportions } from '@/consts'
import SpForm from '@/components/sp-form'
export default {
  name: "sliderDialog",
  componrnts: {
  },
  components: {
    SpForm,
    hotzone,
    // CompHotPicker,
    CompPickerLink
  },
  props: {
    sliderItem: Object,
    // proportion: Number,
    defaultValue: Object,
    index: Number,
    height: Number
  },
  data() {
    return {
      sliderForm: null,
      h: '0px',
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
      setTimeout(() => {
        zone.forEach((item, index) => {
          if (item.leftPer) {
            let obj = {
              heightPer: item.heightPer,
              leftPer: item.leftPer,
              topPer: item.topPer,
              widthPer: item.widthPer
            }
            if (type == 'overlay') {
              let ele = cloneDeep(this.sliderForm.overlayHotData[index])
              Object.assign(ele, obj)
              this.sliderForm.overlayHotData.splice(index, 1, ele)
            } else {
              let ele = cloneDeep(this.sliderForm.hotData[index])
              Object.assign(ele, obj)
              this.sliderForm.hotData.splice(index, 1, ele)
            }
          }
        })
      }, 500)
    },
    handleRemove(index, type) {
      if (type == 'overlay') {
        this.sliderForm.overlayHotData.splice(index, 1)
      } else {
        this.sliderForm.hotData.splice(index, 1)
      }
    },
    onChangeLink(e, index) {
      const v = cloneDeep(this.sliderForm.hotData[index])
      this.$set(this.sliderForm.hotData, index, Object.assign(v, e))
    },
    // onChangeDataLink(e) {
    //   const v = cloneDeep(this.sliderForm.data)
    //   this.$set(this.sliderForm, 'data', Object.assign(v, e))
    // },
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
    getOptions(src) {
      console.log(src, '-------')
      return 
    },
  },
  computed: {
    sliderFormList() {
      if (!this.sliderForm) return []
      const { media_type, hotData, overlayHotData } = this.sliderForm
      return [
        {
          label: '内容类型',
          key: 'media_type',
          type: 'radio',
          options: [{
            label: 'img',
            name: '图片'
          }, {
            label: 'video',
            name: '视频'
          }],
          onChange: (e) => {
            // this.sliderForm = {
            //   media_type: e,
            //   videoUrl: null,
            //   autoplay: false,
            //   loop: false,
            //   interact: 'reset',
            //   overlay: '',
            //   overlayWidth: 100,
            //   overlaybuttom: 0,
            //   overlayLeft: 0,
            //   slidercolor: '#000000',
            //   blockColor: '#000000',
            //   imgUrl: '',
            //   mainTitle: '',
            //   hotData: [],
            //   overlayHotData: [],
            // }
          }
        },
        {
          label: media_type == "video" ? '视频' : '图片',
          key: 'videoUrl',
          component: ({ key }) => {
            return (
              <div class="video-list">
                {media_type == "video" && <SpVideoPicker v-model={this.sliderForm[key]} size='small' class="video-link" />}
                {media_type == 'img' &&
                  <div class="zone-list">
                    <SpImagePicker v-model={this.sliderForm.imgUrl} size="small" class="video-link" text={media_type == 'video' ? '封面' : '图片'} />
                    {hotData?.map((item, index) => {
                      return (
                        <div class="zone-item">
                          <p class='zone-item-label'>热区{index + 1}</p>
                          <CompPickerLink
                            isShowH5Link={false}
                            value={item}
                            wgtType="hotzone"
                            class='zone-item-picker'
                            on-change={(e) => this.onChangeLink(e, index)}
                          />
                          <el-button type="text" size="small" onClick={() => {
                            this.sliderForm.hotData.splice(index, 1)
                          }}>删除</el-button>
                        </div>
                      )
                    })}
                  </div>}
              </div>
            )
          },
        },
        {
          label: '入场自动播放',
          key: 'autoplay',
          type: 'switch',
          isShow: media_type == "video",
        },
        // {
        //   label: '循环播放',
        //   key: 'loop',
        //   type: 'switch',
        //   isShow: media_type == "video",
        // },
        {
          label: '离场视频交互',
          key: 'interact',
          type: 'radio',
          options: [{
            label: 'reset',
            name: '重置'
          }, {
            label: 'pause',
            name: '暂停'
          }],
          isShow: media_type == "video",
        },
        {
          label: media_type == "video" ? '视频叠层' : '图片叠层',
          key: 'overlay',
          component: ({ key }) => {
            return (
              <div class="overlay-list">
                <SpImagePicker v-model={this.sliderForm[key]} size="small" class="video-link" ononChange={(e) => { this.changeOverlay(e) }} />
                <div class="zone-list">
                  {overlayHotData?.map((item, index) => {
                    return (
                      <div class="zone-item">
                        <p class='zone-item-label'>热区{index + 1}</p>
                        <CompPickerLink
                          isShowH5Link={false}
                          value={item}
                          wgtType="hotzone"
                          class='zone-item-picker'
                          on-change={(e) => this.onChangeHotDataLink(e, index)}
                        />
                        <el-button type="text" size="small" onClick={() => {
                          this.sliderForm.overlayHotData.splice(index, 1)
                        }}>重置地址</el-button>
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
          placeholder: '请输入宽度',
        },
        {
          label: '叠层下边距离',
          key: 'overlaybuttom',
          isShow: this.sliderForm.overlay,
          type: 'slider',
          tip: '单位为 %',
          showInput: true,
          maxlength: 10,
          placeholder: '请输入上边距离',
        },
        {
          label: '叠层左边距离',
          key: 'overlayLeft',
          isShow: this.sliderForm.overlay,
          showInput: true,
          tip: '单位为 %',
          type: 'slider',
          maxlength: 10,
        },
        {
          label: '查看更多跳转地址',
          key: 'moreLink',
          component: ({ key }) => {
            return <div style={{display: 'flex'}}>
              <CompPickerLink v-model={this.sliderForm[key]} size="small" class="video-link" />
             {this.sliderForm.moreLink?.linkPage && <el-button type="text" size="small" onClick={() => {
                this.sliderForm = {
                  ...this.sliderForm,
                  moreLink: {
                    linkPage: '',
                    linkTitle: '',
                    linkAppid: '',
                  }
                }
              }}
              style={{
                alignSelf: 'flex-end',
                fontSize: '25px'
              }}
              ><i class="el-icon-delete"></i></el-button>}
            </div>
          }
        }
      ]
    },
    overlayStyle() {
      const { overlaybuttom, overlayLeft, overlayWidth } = this.sliderForm
      return {
        bottom: `${overlaybuttom}%`,
        left: `${overlayLeft}%`,
        width: `${overlayWidth}%`,
      }
    },
  },
  watch: {
    sliderItem: {
      handler(val) {
        this.sliderForm = cloneDeep(val)
        this.h = this.height
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
        if (this.index !== 0) return
        if (val) {
          getVideoAttribute(val, (h) => {
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

    .sp-image {}

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

    .zone-item {
      margin-bottom: 5px;
      display: flex;
      align-items: flex-start;

      .zone-item-label {
        width: 40px;
        height: 32px;
        line-height: 32px
      }

      .zone-item-picker {
        flex: 1;
      }
    }
  }

}
</style>