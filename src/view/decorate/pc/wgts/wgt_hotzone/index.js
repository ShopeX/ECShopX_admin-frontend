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
import AttrHotSetting from './attr-hotsetting'

export default {
  wgtName: 'imgHotzone',
  wgtIcon: 'wgt-hotzone',
  example: {
    name: 'imgHotzone',
    title: '热区图',
    subtitle: '图上随意画块块',
    padded: true,
    data: {
      imgUrl: '',
      data: []
    }
  },
  config: {
    name: 'imgHotzone',
    setting: [
      { label: '标题', key: 'title', component: 'input', value: '热区图' },
      { label: '副标题', key: 'subtitle', component: 'input', value: '图上随意画块块' },
      { label: '组件间距', key: 'padded', component: 'switch', value: true },
      {
        label: '热区设置',
        key: 'data',
        component: function (h, { key }) {
          return <AttrHotSetting v-model={this.value[key]} />
        },
        value: { imgUrl: '', data: [] }
      }
    ],
    transformIn: (v) => {
      const {
        name,
        base,
        config: { imgUrl },
        data,
        uuid
      } = v
      return {
        name,
        ...base,
        data: {
          imgUrl,
          data,
          uuid
        }
      }
    },
    transformOut: (v) => {
      return pickBy(v, {
        name: 'name',
        uuid: 'uuid',
        base: (v) => {
          return pickBy(v, {
            title: 'title',
            subtitle: 'subtitle',
            padded: 'padded'
          })
        },
        config: ({ data }) => {
          return pickBy(data, {
            imgUrl: 'imgUrl'
          })
        },
        data: 'data.data'
      })
    }
  }
}
