/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy, isObject } from '@/utils'
import AttrItem from './attr-item'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'slider',
  setting: [
    // { label: '标题颜色', key: 'WordColor', component: 'color', value: '#333333' },
    {
      group: '内容样式',
      label: '轮播时间',
      key: 'interval',
      component: 'number',
      value: 3000,
      min: 1000,
      max: 50000,
      step: 1000
    },
    {
      group: '内容样式',
      label: '图片边角',
      key: 'rounded',
      component: 'radiobutton',
      value: false,
      options: [
        { name: '圆角', label: true },
        { name: '直角', label: false }
      ]
    },
    {
      group: '指示点设置',
      label: '指示点样式',
      key: 'dot',
      component: 'radiobutton',
      options: [
        { name: '点', label: true },
        { name: '数字', label: false }
      ],
      value: true
    },
    {
      group: '指示点设置',
      label: '指示点覆盖',
      key: 'dotCover',
      component: 'radiobutton',
      value: false,
      options: [
        { name: '开启', label: true },
        { name: '关闭', label: false }
      ]
    },
    {
      group: '指示点设置',
      label: '指示点位置',
      key: 'dotLocation',
      component: 'radiobutton',
      options: [
        { name: '居左', label: 'left' },
        { name: '居中', label: 'center' },
        { name: '居右', label: 'right' }
      ],
      value: 'right'
    },
    {
      group: '指示点设置',
      label: '指示点形状',
      key: 'shape',
      component: 'radiobutton',
      options: [
        { name: '圆形', label: 'circle' },
        { name: '长方型', label: 'rectangle' }
      ],
      value: 'circle'
    },
    {
      group: '指示点设置',
      label: '指示点颜色',
      key: 'dotColor',
      component: 'radiobutton',
      options: [
        { name: '深色', label: 'dark' },
        { name: '亮色', label: 'light' }
      ],
      value: 'dark'
    },
    // { label: '图片描述', key: 'content', component: 'switch', value: true },
    {
      label: '',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} uuid={this.value.uuid} />
      },
      value: [
        {
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
          overlayHotData: []
        }
      ]
    },
    {
      label: '自动切换',
      group: '内容样式',
      key: 'autoplay',
      component: 'radiobutton',
      options: [
        { name: '开启', label: true },
        { name: '关闭', label: false }
      ],
      value: true
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, track, tagsType, meber_tags, no_meber_tags } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin'])
    // 第一屏尺寸：宽固定 375，高从保存数据回显，渲染后再由 measureFirstScreenHeight 更新
    const { firstScreenWidth, firstScreenHeight } = config || {}
    return {
      id: v?.id,
      name,
      ...transformedBase,
      ...config,
      firstScreenWidth: firstScreenWidth ?? 375,
      firstScreenHeight: firstScreenHeight ?? 0,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      },
      data: (data || []).map((item) => {
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
          media_type,
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
          media_type: media_type || (url ? 'video' : 'img'),
          ...content
        }
      })
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: createTransformOutBase(['outerMargin'], ['outerMargin']),
      config: (v) => {
        return pickBy(v, {
          interval: 'interval',
          dot: 'dot',
          dotLocation: 'dotLocation',
          dotColor: 'dotColor',
          shape: 'shape',
          dotCover: 'dotCover',
          itemPadded: 'itemPadded',
          rounded: 'rounded',
          content: 'content',
          autoplay: 'autoplay',
          firstScreenWidth: 'firstScreenWidth',
          firstScreenHeight: 'firstScreenHeight'
        })
      },
      data: ({ data }) => {
        return (data || []).map((item) => {
          return pickBy(item, {
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
          })
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
