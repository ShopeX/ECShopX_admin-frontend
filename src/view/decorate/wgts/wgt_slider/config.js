export default {
  name: 'slider',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '标题颜色', key: 'WordColor', component: 'color', value: '#333333' },
    {
      label: '轮播时间',
      key: 'interval',
      component: 'number',
      value: 3000,
      min: 1000,
      max: 5000,
      step: 1000
    }
    // { label: '', key: 'subtitle', component: 'text', value: '' }
  ]
}
