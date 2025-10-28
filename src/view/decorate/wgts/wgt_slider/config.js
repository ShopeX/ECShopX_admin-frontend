// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import { pickBy } from '@/utils'
import AttrItem from './attr-item'

export default {
  name: 'slider',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '分享拼单' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '分享有好礼，拼单更便宜' },
    // { label: '标题颜色', key: 'WordColor', component: 'color', value: '#333333' },
    {
      label: '轮播时间',
      key: 'interval',
      component: 'number',
      value: 3000,
      min: 1000,
      max: 50000,
      step: 1000
    },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '圆角图片', key: 'rounded', component: 'switch', value: false },
    {
      label: '指示点样式',
      key: 'dot',
      component: 'radio',
      options: [
        { name: '点', label: true },
        { name: '数字', label: false }
      ],
      value: true
    },
    { label: '指示点覆盖', key: 'dotCover', component: 'switch', value: false },
    {
      label: '指示点位置',
      key: 'dotLocation',
      component: 'radio',
      options: [
        { name: '居左', label: 'left' },
        { name: '居中', label: 'center' },
        { name: '居右', label: 'right' }
      ],
      value: 'right'
    },
    {
      label: '指示点形状',
      key: 'shape',
      component: 'radio',
      options: [
        { name: '圆形', label: 'circle' },
        { name: '长方型', label: 'rectangle' }
      ],
      value: 'circle'
    },
    {
      label: '指示点颜色',
      key: 'dotColor',
      component: 'radio',
      options: [
        { name: '深色', label: 'dark' },
        { name: '亮色', label: 'light' }
      ],
      value: 'dark'
    },
    { label: '轮播项间距', key: 'itemPadded', component: 'switch', value: true },
    // { label: '图片描述', key: 'content', component: 'switch', value: true },
    {
      label: '轮播项',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: [
        {
          button: '',
          content: '',
          id: '',
          imgUrl: '',
          linkPage: '',
          mainTitle: '',
          subtitle: '',
          subtitleTow: '',
          template: ''
        }
      ]
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    return {
      id: v?.id,
      name,
      ...base,
      ...config,
      data
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded'
        })
      },
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
          content: 'content'
        })
      },
      data: 'data'
    })
  }
}
