import AttrItem from './attr-item'
export default {
  name: 'hotTopic',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '分享有好礼，拼单更便宜' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    {
      label: '话题',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: []
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    return v
  },
  transformOut: (v) => {
    return v
  }
}
