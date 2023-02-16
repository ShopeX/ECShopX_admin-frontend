export default {
  name: 'search',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    {
      label: '文字位置',
      key: 'float',
      component: 'radio',
      options: [
        { name: '居中', label: 'center' },
        { name: '居左', label: 'left' },
      ],
      value: 'center'
    },
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    return v
  },
  transformOut: (v) => {}
}
