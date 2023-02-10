import { pickBy } from '@/utils'
import AttrLabel from './attr-label'

export default {
  name: 'store',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    {
      label: '背景色',
      key: 'backgroundColor',
      component: 'color',
      value: '#fff'
    },
    // {
    //   label: '推荐店铺',
    //   key: 'data',
    //   component: function (h, { key }) {
    //     return <AttrHotSetting v-model={this.value[key]} />
    //   },
    //   value: { imgUrl: '', data: [] }
    // },
    {
      label: '宣传图',
      key: 'data',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: { imgUrl: '', data: [] }
    },
    {
      label: '商品标签',
      key: 'data',
      component: function (h, { key }) {
        return <AttrLabel v-model={this.value[key]} />
      },
      value: { imgUrl: '', data: [] }
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
