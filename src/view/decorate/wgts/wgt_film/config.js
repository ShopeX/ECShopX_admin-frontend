import { pickBy } from '@/utils'

export const proportions = [
  {
    label: 0,
    name: '16:9'
  },
  {
    label: 1,
    name: '9:16'
  },
  {
    label: 2,
    name: '4:3'
  },
  {
    label: 3,
    name: '3:4'
  },
  {
    label: 4,
    name: '1:1'
  }
]

export default {
  name: 'film',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '选择视频',
      key: 'data',
      component: function (h, { key }) {
        return <SpVideoPicker v-model={this.value[key]} size='small' />
      },
      value: {}
    },
    {
      label: '视频比例',
      key: 'proportion',
      component: 'radio',
      options: proportions,
      value: 0
    }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      data
    } = v
    let _data = data.flat()[0] || {}
    return {
      name,
      ...base,
      data: _data
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded',
          proportion: 'proportion'
        })
      },
      data: ({ data }) => {
        return [
          pickBy(data, {
            media_id: 'image_id',
            url: 'url'
          })
        ]
      }
    })
  }
}
