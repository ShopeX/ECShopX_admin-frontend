import { pickBy, isObject } from '@/utils'
import AttrItem from './attr-item'
import AttrHotSetting from './attr-hotsetting'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const scene = urlParams.get('scene') || '1001'

export default {
  name: 'page',
  setting: [
    {
      label: '沉浸式页头',
      key: 'isImmersive',
      component: 'switch',
      value: false
    },
    {
      label: '页头背景',
      key: 'newNavigateStyle',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: {
        color: '#fff',
        image: ''
      }
    },
    {
      label: '页头标题区',
      key: 'titleStyle',
      component: 'radiobutton',
      options: [
        { name: '名称', label: '1' },
        { name: '图片', label: '2' }
      ],
      value: '1'
    },
    {
      label: '',
      key: 'titleColor',
      component: 'color',
      value: '#000',
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
      },
      tip: '建议尺寸：340 * 70 像素'
    },
    {
      label: '页头功能区',
      key: 'pTitleHotSetting',
      component: function (h, { key }) {
        return <AttrHotSetting v-model={this.value[key]} />
      },
      value: { imgUrl: '', data: [] },
      tip: scene != '1001' ? '建议尺寸：138 * 65 像素' : '建议尺寸：174 * 64 像素'
      // isShow: function () {
      // return scene == '1001'
      // }
    },
    {
      label: '页面背景',
      key: 'newPageBackgroundStyle',
      component: 'radio',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: {
        color: '#f5f5f5',
        image: ''
      },
      tip: '背景图宽度为100%，高度自适应'
    }
    // {
    //   label: '',
    //   key: 'pageBackgroundColor',
    //   component: 'color',
    //   value: '#f5f5f5',
    //   isShow: function () {
    //     return this.value.pageBackgroundStyle == '1'
    //   }
    // },
    // {
    //   label: '',
    //   key: 'pageBackgroundImage',
    //   component: function (h, { key }) {
    //     return <SpImagePicker v-model={this.value[key]} size='small' />
    //   },
    //   value: '',
    //   isShow: function () {
    //     return this.value.pageBackgroundStyle == '2'
    //   }
    // },
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
      pageBackgroundImage,
      pTitleHotSetting = { imgUrl: '', data: [] },
      isImmersive
    } = base || {}
    if (isObject(navigateBackgroundImage)) {
      const { url } = newNavigateStyle?.image
      navigateBackgroundImage = url
    }
    if (isObject(titleBackgroundImage)) {
      const { url } = titleBackgroundImage
      titleBackgroundImage = url
    } else if (!titleBackgroundImage) {
      titleBackgroundImage = ''
    }

    if (isObject(pageBackgroundImage)) {
      const { url } = newPageBackgroundStyle?.image
      pageBackgroundImage = url
    }

    const newNavigateStyle = {
      color: navigateBackgroundColor,
      image: navigateBackgroundImage
    }
    const newPageBackgroundStyle = {
      color: pageBackgroundColor,
      image: pageBackgroundImage
    }
    return {
      name,
      ...base,
      navigateStyle, // 兼容旧版本
      titleStyle,
      titleColor,
      titleBackgroundImage,
      titlePosition, // 兼容旧版本
      pageBackgroundStyle, // 兼容旧版本
      pageBackgroundImage,
      newNavigateStyle,
      newPageBackgroundStyle,
      pTitleHotSetting,
      isImmersive
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          navigateStyle: 'navigateStyle',
          navigateBackgroundColor: 'newNavigateStyle.color',
          navigateBackgroundImage: 'newNavigateStyle.image',
          titleStyle: 'titleStyle',
          titleColor: 'titleColor',
          titleBackgroundImage: 'titleBackgroundImage',
          titlePosition: 'titlePosition',
          pageBackgroundStyle: 'pageBackgroundStyle',
          pageBackgroundColor: 'newPageBackgroundStyle.color',
          pageBackgroundImage: 'newPageBackgroundStyle.image',
          isImmersive: 'isImmersive',
          pTitleHotSetting: 'pTitleHotSetting'
        })
      }
    })
  }
}
