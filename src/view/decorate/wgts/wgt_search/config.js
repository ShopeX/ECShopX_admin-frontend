import { pickBy } from '@/utils'
export default {
  name: 'search',
  setting: [
    { label: '钉在顶部', key: 'fixTop', component: 'switch', value: false },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '占位内容', key: 'placeholder', component: 'input', value: '搜索想要的商品' }
  ],
  transformIn: (v) => {
    const { name, base, config } = v
    return {
      name,
      ...base,
      ...config
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          padded: 'padded'
        })
      },
      config: (v) => {
        return pickBy(v, {
          fixTop: 'fixTop',
          placeholder: 'placeholder'
        })
      }
    })
  }
}
