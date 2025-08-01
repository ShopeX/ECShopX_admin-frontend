import { pickBy } from '@/utils'
import AttrHotSetting from './attr-hotsetting'

export default {
  wgtName: 'imgHotzone',
  wgtIcon: 'wgt-hotzone',
  example: {
    name: 'imgHotzone',
    title: '热区图',
    subtitle: '图上随意画块块',
    padded: true,
    data: {
      imgUrl: '',
      data: []
    }
  },
  config: {
    name: 'imgHotzone',
    setting: [
      { label: '标题', key: 'title', component: 'input', value: '热区图' },
      { label: '副标题', key: 'subtitle', component: 'input', value: '图上随意画块块' },
      { label: '组件间距', key: 'padded', component: 'switch', value: true },
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
        data,
        uuid
      } = v
      return {
        name,
        ...base,
        data: {
          imgUrl,
          data,
          uuid
        }
      }
    },
    transformOut: (v) => {
      return pickBy(v, {
        name: 'name',
        uuid: 'uuid',
        base: (v) => {
          return pickBy(v, {
            title: 'title',
            subtitle: 'subtitle',
            padded: 'padded'
          })
        },
        config: ({ data }) => {
          return pickBy(data, {
            imgUrl: 'imgUrl'
          })
        },
        data: 'data.data'
      })
    }
  }
}
