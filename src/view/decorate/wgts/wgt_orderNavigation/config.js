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
import AttrNavItem from './attr-imagepanel'

export default {
  name: 'orderNavigation',
  setting: [
    { label: '埋点参数', key: 'track', component: 'input', value: '' },
    { label: '标题', key: 'title', component: 'input', value: '我的在线商城订单' },
    // { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '标题颜色', key: 'titleColor', component: 'color', value: '#000' },
    { label: '背景颜色', key: 'backgroundColor', component: 'color', value: '#fff' },
    {
      label: '导航图标',
      key: 'data',
      component: function (h, { key }) {
        return <AttrNavItem v-model={this.value[key]} isBusinessShow={this.value.navigation} />
      },
      value: [
        {
          content: '待付款',
          imgUrl: ''
        },
        {
          content: '待收货',
          imgUrl: ''
        },
        {
          content: '待评价',
          imgUrl: ''
        },
        {
          content: '售后',
          imgUrl: ''
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
          // subtitle: 'subtitle',
          padded: 'padded',
          titleColor: 'titleColor',
          backgroundColor: 'backgroundColor'
        })
      },
      data: 'data'
    })
  }
}
