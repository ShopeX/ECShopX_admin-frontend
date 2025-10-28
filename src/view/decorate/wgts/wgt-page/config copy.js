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

import { pickBy, isObject } from '@/utils'

export default {
  name: 'page',
  setting: [
    {
      label: '导航背景',
      key: 'navigateStyle',
      component: 'radio',
      options: [
        { name: '颜色背景', label: '1' },
        { name: '图片背景', label: '2' }
      ],
      value: '1'
    },
    {
      label: '',
      key: 'navigateBackgroundColor',
      component: 'color',
      value: '#333',
      isShow: function () {
        return this.value.navigateStyle == '1'
      }
    },
    {
      label: '',
      key: 'navigateBackgroundImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.navigateStyle == '2'
      }
    },
    {
      label: '页面标题',
      key: 'titleStyle',
      component: 'radio',
      options: [
        { name: '文字', label: '1' },
        { name: '图片', label: '2' }
      ],
      value: '1'
    },
    {
      label: '',
      key: 'titleColor',
      component: 'color',
      value: '#fff',
      isShow: function () {
        return this.value.titleStyle == '1'
      },
      tip: '页面标题文字请在管理后台装修-商城信息中填写。'
    },
    {
      label: '',
      key: 'titleBackgroundImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.titleStyle == '2'
      }
    },
    {
      label: '标题位置',
      key: 'titlePosition',
      component: 'radio',
      options: [
        { name: '居左', label: 'left' },
        { name: '居中', label: 'center' }
      ],
      value: 'center'
    },
    {
      label: '页面背景',
      key: 'pageBackgroundStyle',
      component: 'radio',
      options: [
        { name: '颜色背景', label: '1' },
        { name: '图片背景', label: '2' }
      ],
      value: '1'
    },
    {
      label: '',
      key: 'pageBackgroundColor',
      component: 'color',
      value: '#f5f5f5',
      isShow: function () {
        return this.value.pageBackgroundStyle == '1'
      }
    },
    {
      label: '',
      key: 'pageBackgroundImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.pageBackgroundStyle == '2'
      }
    },
    {
      label: '开启沉浸式',
      key: 'isImmersive',
      component: 'radio',
      options: [
        { name: '是', label: 1 },
        { name: '否', label: 0 }
      ],
      value: 0
    }
  ],
  transformIn: (v) => {
    const { name, base } = v
    let {
      navigateStyle,
      navigateBackgroundColor,
      navigateBackgroundImage,
      titleStyle,
      titleColor,
      titleBackgroundImage,
      titlePosition,
      pageBackgroundStyle,
      pageBackgroundColor,
      pageBackgroundImage
    } = base || {}
    if (isObject(navigateBackgroundImage)) {
      const { url } = navigateBackgroundImage
      navigateBackgroundImage = url
    }
    if (isObject(titleBackgroundImage)) {
      const { url } = titleBackgroundImage
      titleBackgroundImage = url
    } else if (!titleBackgroundImage) {
      titleBackgroundImage = ''
    }

    if (isObject(pageBackgroundImage)) {
      const { url } = pageBackgroundImage
      pageBackgroundImage = url
    }
    return {
      name,
      ...base,
      navigateStyle,
      navigateBackgroundColor,
      navigateBackgroundImage,
      titleStyle,
      titleColor,
      titleBackgroundImage,
      titlePosition,
      pageBackgroundStyle,
      pageBackgroundColor,
      pageBackgroundImage
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          navigateStyle: 'navigateStyle',
          navigateBackgroundColor: 'navigateBackgroundColor',
          navigateBackgroundImage: 'navigateBackgroundImage',
          titleStyle: 'titleStyle',
          titleColor: 'titleColor',
          titleBackgroundImage: 'titleBackgroundImage',
          titlePosition: 'titlePosition',
          pageBackgroundStyle: 'pageBackgroundStyle',
          pageBackgroundColor: 'pageBackgroundColor',
          pageBackgroundImage: 'pageBackgroundImage',
          isImmersive: 'isImmersive'
        })
      }
    })
  }
}
