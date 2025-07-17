import Vue from "vue";
import { pickBy, isObject } from "@/utils";
import { getImageAttribute, getVideoAttribute } from "./utils";
import AttrItem from "./attr-item.vue";

export default {
  name: 'fullSlider',
  setting: [
    { label: "埋点参数", key: "track", component: "input" },
    // {
    //   label: "组件间距",
    //   key: "padded",
    //   component: "switch",
    //   value: false,
    // },
    // { label: '埋点上报参数', key: 'eventParams', component: 'input' },
    {
      label: '轮播项',
      key: 'data',
      component: function (h, { key }) {
        return (
          <AttrItem
            v-model={this.value[key]}
            uuid={this.value.uuid}
            on-changeheight={(e) => {
              this.value.height = e
            }}
            height={667}
          />
        )
      },
      value: [],
      module: 'slideritem'
    },
    {
      label: '指示器字体颜色',
      key: 'indicatorColor',
      component: 'color',
      value: '#f5f5f5',
    },
    {
      label: '指示器字体大小',
      key: 'indicatorFontSize',
      component: 'number',
      value: 12,
      min: 10,
      max: 100,
      step: 1,
      tip: '单位为 px',
    },
    {
      label: '指示器下边距',
      key: 'dotbottom',
      component: 'number',
      value: 0,
      min: 0,
      max: 1000,
      step: 1,
      tip: '单位为 px',
    },
    { label: "指示器下文案", key: "indicatorText", component: "input" },
    {
      label: '轮播时间',
      key: 'interval',
      component: 'number',
      isShow: function () {
        return this.value.autoplay
      },
      value: 3000,
      min: 1000,
      max: 50000,
      step: 1000,
      module: 'slidersetting'
    },
    {
      label: '自动切换',
      key: 'autoplay',
      component: 'switch',
      value: true,
      module: 'slidersetting'
    },
    {
      label: "",
      key: "height",
      component: "input",
      value: 667,
      isShow: function () {
        return false;
      },
    },
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      config: { ...otherConfig },
      data
    } = v
    return {
      name,
      ...base,
      ...otherConfig,
      data: data.map((item) => {
        const {
          linkPage,
          title,
          id,
          hotData = [],
          videoUrl,
          overlayHotData = [],
          autoplay,
          interact,
          overlay,
          overlayWidth,
          overlaybuttom,
          overlayLeft,
          // loop,
          ...content
        } = item
        const url = isObject(videoUrl) ? videoUrl?.url : videoUrl
        return {
          data: {
            linkPage: linkPage,
            id: id,
            title: title
          },
          hotData,
          videoUrl: url,
          autoplay,
          interact,
          overlay,
          overlayWidth,
          overlaybuttom,
          overlayLeft,
          overlayHotData,
          // loop,
          ...content
        }
      })
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          track: "track",
          padded: 'padded',
        })
      },
      config: (v) => {
        return pickBy(v, {
          interval: 'interval',
          dot: 'dot',
          dotbottom: 'dotbottom',
          content: 'content',
          autoplay: 'autoplay',
          indicatorColor: 'indicatorColor',
          indicatorFontSize: 'indicatorFontSize',
          indicatorText: 'indicatorText',
        })
      },
      data: ({ data }) => {
        return pickBy(data, {
          imgUrl: 'imgUrl',
          videoUrl: 'videoUrl',
          subtitle: 'subtitle',
          subtitleTow: 'subtitleTow',
          button: 'button',
          template: 'template',
          media_type: 'media_type',
          linkPage: 'data.linkPage',
          ctoken: 'data.ctoken',
          id: 'data.id',
          title: 'data.title',
          hotData: 'hotData',
          autoplay: 'autoplay',
          interact: 'interact',
          overlay: 'overlay',
          overlayWidth: 'overlayWidth',
          overlaybuttom: 'overlaybuttom',
          overlayLeft: 'overlayLeft',
          overlayHotData: 'overlayHotData',
          // loop: 'loop',
        })
      }
    })
  }
}
