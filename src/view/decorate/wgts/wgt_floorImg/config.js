import AttrHotSetting from './attr-hotsetting'

export default {
  name: 'floorImg',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    {
      label: '热区设置',
      key: 'data',
      component: function (h, { key }) {
        return <AttrHotSetting v-model={this.value[key]} />
      },
      value: { imgUrl: '', data: [] }
    }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      config: { imgUrl },
      data
    } = v
    return {
      name,
      ...base,
      data: {
        imgUrl,
        data
      }
    }
  },
  transformOut: (v) => {
    return v
  }
}
