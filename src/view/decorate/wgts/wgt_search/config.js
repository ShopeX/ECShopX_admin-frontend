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
export default {
  name: 'search',
  setting: [
    { label: '钉在顶部', key: 'fixTop', component: 'switch', value: false },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '占位内容', key: 'placeholder', component: 'input', value: '搜索想要的商品' }
  ],
  transformIn: (v) => {
    const { name, base, config } = v
    return {
      id: v?.id,
      name,
      ...base,
      ...config
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          padded: 'padded'
        })
      },
      config: (v) => {
        return pickBy(v, {
          fixTop: 'fixTop',
          placeholder: 'placeholder'
        })
      }
    })
  }
}
