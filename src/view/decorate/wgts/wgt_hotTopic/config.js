import { pickBy } from '@/utils'
import AttrItem from './attr-item'

export default {
  name: 'hotTopic',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '分享有好礼，拼单更便宜' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '话题',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: [
        {
          id: '',
          topic: '话题'
        }
      ]
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    return {
      name,
      ...base,
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
      data: 'data'
    })
  }
}
