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

import AttrHorizontal from './attr_horizontal'
import AttrVertical from './attr_vertical'
import { pickBy } from '@/utils'

export default {
  name: 'marquees',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '内容',
      key: 'direction',
      component: 'radio',
      options: [
        { name: '软文', label: 'vertical' },
        { name: '文本', label: 'horizontal' }
      ],
      value: 'vertical'
    },
    { label: '背景颜色', key: 'bgcolor', component: 'color', value: '#ffffff' },
    { label: '字体颜色', key: 'fontcolor', component: 'color', value: '#000000' },
    {
      label: '文本',
      key: 'dataText',
      isShow: function () {
        return this.value.direction == 'horizontal'
      },
      component: function (h, { key }) {
        return <AttrHorizontal v-model={this.value[key]} />
      },
      value: [{ title: '文本内容' }]
    },
    {
      label: '软文',
      key: 'dataContent',
      isShow: function () {
        return this.value.direction == 'vertical'
      },
      component: function (h, { key }) {
        return <AttrVertical v-model={this.value[key]} />
      },
      value: [{ title: '软文标题', id: '' }]
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    let res = {
      id: v?.id,
      name,
      ...base,
      ...config
    }
    if (config.direction == 'horizontal') {
      res = {
        ...res,
        dataText: data
      }
    } else {
      res = {
        ...res,
        dataContent: data
      }
    }
    return res

    // dataText: config.direction == 'horizontal' ? data : [{ title: '文本内容' }],
    //   dataContent: config.direction == 'vertical' ? data : [{ title: '软文标题', id: '' }]
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
          bgcolor: 'bgcolor',
          direction: 'direction',
          fontcolor: 'fontcolor'
        })
      },
      data: v.direction == 'horizontal' ? v.dataText : v.dataContent
    })
  }
}
