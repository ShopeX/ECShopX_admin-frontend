import AttrHorizontal from './attr_horizontal'
import AttrVertical from './attr_vertical'
import { pickBy } from '@/utils'

export default {
  name: 'marquees',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '内容',
      key: 'direction',
      component: 'radio',
      options: [
        { name: '软文', label: 'vertical' },
        { name: '文本', label: 'horizontal' }
      ],
      value: 'vertical'
    },
    { label: '背景颜色', key: 'bgcolor', component: 'color', value: '#ffffff' },
    { label: '字体颜色', key: 'fontcolor', component: 'color', value: '#000000' },
    {
      label: '文本',
      key: 'data',
      isShow: function () {
        return this.value.direction == 'horizontal'
      },
      component: function (h, { key }) {
        return <AttrHorizontal v-model={this.value[key]} />
      },
      value: [{ title: '文本内容' }]
    },
    {
      label: '软文',
      key: 'data',
      isShow: function () {
        return this.value.direction == 'vertical'
      },
      component: function (h, { key }) {
        return <AttrVertical v-model={this.value[key]} />
      },
      value: [{ title: '软文标题', id: '' }]
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    return {
      name,
      ...base,
      ...config,
      data
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
          bgcolor: 'bgcolor',
          direction: 'direction',
          fontcolor: 'fontcolor'
        })
      },
      data: 'data'
    })
  }
}
