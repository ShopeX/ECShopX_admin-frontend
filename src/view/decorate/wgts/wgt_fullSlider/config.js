/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Vue from 'vue'
import { pickBy, isObject } from '@/utils'
import AttrItem from './attr-item.vue'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'fullSlider',
  setting: [
    {
      label: '',
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
      group: '指示器设置',
      key: 'indicatorColor',
      component: 'color',
      value: '#f5f5f5'
    },
    {
      label: '指示器字体大小',
      group: '指示器设置',
      key: 'indicatorFontSize',
      component: 'number',
      value: 12,
      min: 10,
      max: 100,
      step: 1,
      tip: '单位为 px'
    },
    {
      label: '指示器下边距',
      group: '指示器设置',
      key: 'dotbottom',
      component: 'number',
      value: 0,
      min: 0,
      max: 1000,
      step: 1,
      tip: '单位为 px'
    },
    {
      label: '指示器下文案',
      group: '指示器设置',
      key: 'indicatorText',
      component: 'input'
    },
    {
      label: '轮播时间',
      group: '内容样式',
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
      group: '内容样式',
      key: 'autoplay',
      component: 'switch',
      value: true,
      module: 'slidersetting'
    },
    {
      label: '',
      group: '内容样式',
      key: 'height',
      component: 'input',
      value: 667,
      isShow: function () {
        return false
      }
    }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      config: { ...otherConfig },
      data,
      track,
      tagsType,
      meber_tags,
      no_meber_tags
    } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin'])
    return {
      id: v?.id,
      name,
      ...transformedBase,
      ...otherConfig,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      },
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
      id: 'id',
      name: 'name',
      base: (v) => {
        // 使用公共函数处理 outerMargin 转换，同时保留其他字段
        const baseData = createTransformOutBase(
          ['track', 'padded', 'outerMargin'],
          ['outerMargin']
        )(v)
        return baseData
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
          indicatorText: 'indicatorText'
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
          moreLink: 'moreLink'
          // loop: 'loop',
        })
      },
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags'
    })
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
