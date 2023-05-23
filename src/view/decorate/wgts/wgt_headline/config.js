import { pickBy } from '@/utils'

export default {
  name: 'headline',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    {
      label: '文字位置',
      key: 'float',
      component: 'radio',
      options: [
        { name: '居左', label: 'left' },
        { name: '居中', label: 'center' }
      ],
      value: 'center'
    }
  ],
  transformIn: (v) => {
    const { name, base } = v
    return {
      name,
      ...base
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          float: 'float'
        })
      }
    })
  }
}
