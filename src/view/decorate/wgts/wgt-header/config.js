import { pickBy, isObject } from '@/utils'

export default {
  name: 'header',
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
      key: 'pageBackgroundStyle',
      component: 'radio',
      options: [
        { name: '文字', label: '1' },
        { name: '图片', label: '2' }
      ],
      value: '副标题'
    },
    {
      label: '',
      key: 'pageBackgroundColor',
      component: 'color',
      value: '#333',
      isShow: function () {
        return this.value.pageBackgroundStyle == '1'
      },
      tip: '页面标题文字请在管理后台装修-商城信息中填写。'
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
      label: '标题位置',
      key: 'titlePosition',
      component: 'radio',
      options: [
        { name: '居左', label: 'left' },
        { name: '居中', label: 'center' }
      ],
      value: 'left'
    }
  ],
  transformIn: (v) => {
    const { name, base } = v
    let { navigateBackgroundImage, titleBackgroundImage } = base || {}
    if (isObject(navigateBackgroundImage)) {
      const { url } = navigateBackgroundImage
      navigateBackgroundImage = url
    }
    if (isObject(titleBackgroundImage)) {
      const { url } = titleBackgroundImage
      titleBackgroundImage = url
    }
    return {
      name,
      ...base,
      navigateBackgroundImage,
      titleBackgroundImage
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded'
        })
      },
      config: (v) => {
        return pickBy(v, {
          interval: 'interval',
          dot: 'dot',
          dotLocation: 'dotLocation',
          dotColor: 'dotColor',
          shape: 'shape',
          dotCover: 'dotCover',
          rounded: 'rounded',
          content: 'content'
        })
      },
      data: 'data'
    })
  }
}
