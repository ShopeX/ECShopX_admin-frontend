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

import AttrImgList from './attr-imgList.vue'
import { pickBy, isObject } from '@/utils'

export default {
  name: 'floorImg',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '显示背景图', key: 'openBackImg', component: 'switch', value: false },
    {
      label: '背景图片',
      key: 'backgroundImg',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.openBackImg
      }
    },
    { label: '字体颜色', key: 'WordColor', component: 'color', value: '#222' },
    {
      label: '图片列表',
      key: 'data',
      component: function (h, { key }) {
        return <AttrImgList v-model={this.value[key]} />
      },
      value: [
        {
          ImgTitle: '',
          imgUrl: ''
        },
        {
          ImgTitle: '',
          imgUrl: ''
        },
        {
          ImgTitle: '',
          imgUrl: ''
        }
      ]
    }
  ],
  transformIn: (v) => {
    const { name, base, data } = v
    return {
      id: v?.id,
      name,
      ...base,
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
          padded: 'padded',
          WordColor: 'WordColor',
          openBackImg: 'openBackImg',
          backgroundImg: 'backgroundImg'
        })
      },
      data: 'data'
    })
  }
}
