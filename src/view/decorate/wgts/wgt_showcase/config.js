import { pickBy } from '@/utils'
import AttrItem from './attr-item'

export default {
  name: 'showcase',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    // { label: '图片描述', key: 'content', component: 'switch', value: true },
    {
      label: '展示图',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: [
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' }
      ],
      tip: `建议尺寸:</br>大图（375px * 310px）小图（375px * 150px）`
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    return {
      name,
      ...base,
      ...config,
      data
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
          interval: 'interval',
          dot: 'dot',
          dotLocation: 'dotLocation',
          dotColor: 'dotColor',
          shape: 'shape',
          dotCover: 'dotCover',
          rounded: 'rounded',
          content: 'content'
        })
      },
      data: 'data'
    })
  }
}
