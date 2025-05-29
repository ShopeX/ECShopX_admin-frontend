import { isArray, pickBy } from '@/utils'

export default {
  name: 'writing',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '文本内容',
      key: 'data',
      component: 'textarea',
      rows: 20,
      value: ''
    }
  ],
  transformIn: (v) => {
    const { name, base, data } = v
    let _content = ''
    if (isArray(data)) {
      _content = data?.[0].content
    } else {
      _content = data
    }
    return {
      name,
      ...base,
      data: _content
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
      data: ({ data }) => {
        return [
          {
            content: data
          }
        ]
      }
    })
  }
}
