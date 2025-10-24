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
import AttrStore from './attr-store'
import AttrGoods from './attr-goods'
import AttrLabel from './attr-label'

export default {
  name: 'store',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '背景色',
      key: 'backgroundColor',
      component: 'color',
      value: '#fff'
    },
    {
      label: '宣传图',
      key: 'imgUrl',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      tip: `建议尺寸:（宽度640px，高度自适应）`
    },
    {
      label: '推荐店铺',
      key: 'distributor',
      component: function (h, { key }) {
        return (
          <AttrStore
            v-model={this.value[key]}
            on-change={() => {
              if (this.value[key].id === '') {
                this.value['items'] = []
                this.value['tags'] = []
              }
            }}
          />
        )
      },
      value: {
        id: '',
        logo: '',
        name: ''
      }
    },
    {
      label: '店铺商品',
      key: 'items',
      component: function (h, { key }) {
        return <AttrGoods v-model={this.value[key]} distributor={this.value['distributor']} />
      },
      value: [
        {
          goodsId: '',
          title: '商品名称',
          imgUrl: '',
          price: 88
        },
        {
          goodsId: '',
          title: '商品名称',
          imgUrl: '',
          price: 88
        },
        {
          goodsId: '',
          title: '商品名称',
          imgUrl: '',
          price: 88
        },
        {
          goodsId: '',
          title: '商品名称',
          imgUrl: '',
          price: 88
        }
      ]
    },
    {
      label: '商品标签',
      key: 'tags',
      component: function (h, { key }) {
        return <AttrLabel v-model={this.value[key]} distributor={this.value['distributor']} />
      },
      value: []
    }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      seletedTags = [],
      data: [{ id, items, logo, name: distributor_name }]
    } = v
    return {
      id: v?.id,
      name,
      ...base,
      tags: seletedTags,
      distributor: {
        id,
        logo,
        name: distributor_name
      },
      items
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
          backgroundColor: 'backgroundColor',
          imgUrl: 'imgUrl'
        })
      },
      seletedTags: 'tags',
      data: ({ distributor: { id, logo, name }, items }) => {
        return [
          {
            id,
            items,
            logo,
            name
          }
        ]
      }
    })
  }
}
