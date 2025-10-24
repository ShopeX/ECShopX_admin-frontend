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
import AttrCategory from './attr-category'
import ProductLabel from './product-label'

export default {
  name: 'nearbyShop',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '附近商家' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    { label: '直接加购', key: 'addCart', component: 'switch', value: false },
    {
      label: '商家',
      key: 'seletedTags',
      component: function (h, { key }) {
        return <AttrCategory v-model={this.value[key]} />
      },
      value: []
    },
    {
      label: '商品标签',
      key: 'productLabel',
      component: function (h, { key }) {
        return <ProductLabel v-model={this.value[key]} />
      },
      value: []
    },
    {
      label: '导航展示',
      key: 'navigation_display',
      component: 'radio',
      options: [
        { name: '全部', label: 'all' },
        { name: '商家', label: 'business' },
        { name: '商品标签', label: 'productLabels' }
      ],
      value: 'all'
    },
    { label: '显示优惠券', key: 'show_coupon', component: 'switch', value: false },
    { label: '显示更多附近商家', key: 'show_nearby_merchants', component: 'switch', value: false },
    {
      label: '显示附近商家数量',
      key: 'merchantsNumber',
      component: 'number',
      value: 4,
      min: 1,
      max: 100
    },
    {
      label: '显示附近商品数量',
      key: 'quantityNumber',
      component: 'number',
      value: 4,
      min: 1,
      max: 100
    }
    // {
    //   label: '商家排序',
    //   key: 'shopSort',
    //   component: function (h, { key }) {
    //     return <div>{this.value[key]}</div>
    //   },
    //   value: 'LBS定位'
    // }
  ],
  transformIn: (v) => {
    const { name, base, seletedTags = [], productLabel = [] } = v
    return {
      id: v?.id,
      name,
      ...base,
      seletedTags,
      productLabel
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
          padded: 'padded',
          show_coupon: 'show_coupon',
          navigation_display: 'navigation_display',
          addCart: 'addCart',
          show_nearby_merchants: 'show_nearby_merchants',
          merchantsNumber: 'merchantsNumber',
          quantityNumber: 'quantityNumber'
        })
      },
      seletedTags: 'seletedTags',
      productLabel: 'productLabel'
    })
  }
}
