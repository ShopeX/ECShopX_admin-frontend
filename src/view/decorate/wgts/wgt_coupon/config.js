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
import CouponStyle from './coupon-style'
import CouponItem from './coupon-item'
import CouponPackage from './coupon-package'

export default {
  name: 'coupon',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '到店优惠' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '游客专享福利' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    // {
    //   label: '样式',
    //   key: 'style',
    //   component: function (h, { key }) {
    //     return <CouponStyle v-model={this.value[key]} />
    //   },
    //   value: '1'
    // },
    {
      label: '优惠券',
      key: 'data',
      component: function (h, { key }) {
        return <CouponItem v-model={this.value[key]} />
      },
      value: [
        {
          amount: 8,
          desc: '优惠券描述',
          id: '',
          imgUrl: '',
          title: '优惠券名称',
          type: 'cash'
        }
      ]
    },
    {
      label: '券包',
      key: 'voucher_package',
      component: function (h, { key }) {
        return <CouponPackage v-model={this.value[key]} />
      },
      value: [],
      tip: `提示: 优惠券、券包颜色跟随商城主题色变化<br />
      建议尺寸:<br />
      一张图片（宽度355px，高度90px）<br />
      二张图片（宽度172px，高度90px）<br />
      三张图片或更多（宽度138px，高度90px）`
    }
  ],
  transformIn: (v) => {
    const { name, base, data, voucher_package } = v
    return {
      id: v?.id,
      name,
      ...base,
      data,
      voucher_package
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
      data: 'data',
      voucher_package: 'voucher_package'
    })
  }
}
