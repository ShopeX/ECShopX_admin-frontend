import { pickBy } from '@/utils'

export default {
  name: 'heading',
  setting: [
    { label: '标题', key: 'title', component: 'textarea', rows: 6, value: '标题' },
    {
      label: '文字位置',
      key: 'align',
      component: 'radio',
      options: [
        { name: '居左', label: 'left' },
        { name: '居中', label: 'center' }
      ],
      value: 'center'
    },
    {
      label: '加粗',
      key: 'weight',
      component: 'switch',
      value: false
    },
    {
      label: '斜体',
      key: 'italic',
      component: 'switch',
      value: false
    },
    {
      label: '字号',
      key: 'fontSize',
      component: 'select',
      options: [
        { label: 'h1', value: '32' },
        { label: 'h2', value: '24' },
        { label: 'h3', value: '18' },
        { label: 'h4', value: '16' },
        { label: 'h5', value: '14' },
        { label: 'h6', value: '12' }
      ],
      value: '16'
    },
    {
      label: '颜色',
      key: 'color',
      component: 'color',
      value: '#333'
    },
    {
      label: '行高',
      key: 'lineHeight',
      component: 'select',
      options: [
        { label: '1.5', value: '1.5' },
        { label: '1.75', value: '1.75' },
        { label: '2', value: '2' },
        { label: '2.25', value: '2.25' },
        { label: '2.5', value: '2.5' },
        { label: '2.75', value: '2.75' },
        { label: '3', value: '3' }
      ],
      value: '1.5'
    }
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
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded'
        })
      },
      config: (v) => {
        return pickBy(v, {
          align: 'align',
          weight: 'weight',
          italic: 'italic',
          fontSize: 'fontSize',
          color: 'color',
          lineHeight: 'lineHeight'
        })
      }
    })
  }
}
