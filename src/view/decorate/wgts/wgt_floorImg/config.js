import AttrImgList from './attr-imgList.vue'
import { pickBy, isObject } from '@/utils'

export default {
  name: 'floorImg',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    { label: '字体颜色', key: 'WordColor', component: 'colorPicker', value: '' },
    { label: '显示背景图', key: 'openBackImg', component: 'switch', value: false },
    {
      label: '背景图片',
      key: 'pageBackgroundImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.openBackImg
      }
    },
    {
      label: '图片列表',
      key: 'data',
      component: function (h, { key }) {
        return <AttrImgList v-model={this.value[key]} />
      },
      value: []
    }
  ],
  transformIn: (v) => {
    const { name, base } = v
    let { pageBackgroundImage } = base || {}

    if (isObject(pageBackgroundImage)) {
      const { url } = pageBackgroundImage
      pageBackgroundImage = url
    }
    return {
      name,
      ...base,
      pageBackgroundImage
    }
  },
  transformOut: (v) => {
    return v
  }
}
