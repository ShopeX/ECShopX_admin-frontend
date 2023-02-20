import TopicItem from './topic-item.vue'
export default {
  name: 'hotTopic',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    {
      label: '话题',
      key: 'data',
      component: function (h, { key }) {
        return <TopicItem v-model={this.value[key]} />
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
