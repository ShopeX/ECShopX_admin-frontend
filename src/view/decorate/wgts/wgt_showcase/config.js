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
  name: 'showcase',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    // { label: '图片描述', key: 'content', component: 'switch', value: true },
    {
      label: '展示图',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: [
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' }
      ],
      tip: `建议尺寸:</br>大图（175px * 310px）小图（175px * 150px）`
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
      config: () => {
        return {
          style: 1
        }
      },
      data: 'data'
    })
  }
}
