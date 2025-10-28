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
  name: 'headline',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    {
      label: '文字位置',
      key: 'float',
      component: 'radio',
      options: [
        { name: '居左', label: 'left' },
        { name: '居中', label: 'center' }
      ],
      value: 'center'
    }
  ],
  transformIn: (v) => {
    const { name, base } = v
    return {
      id: v?.id,
      name,
      ...base
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          float: 'float'
        })
      }
    })
  }
}
