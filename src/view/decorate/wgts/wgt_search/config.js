export default {
  name: 'search',
  setting: [
    { label: '钉在顶部', key: 'fixTop', component: 'switch', value: false },
    { label: '组件间距', key: 'padded', component: 'switch', value: false }
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    return v
  },
  transformOut: (v) => {}
}
