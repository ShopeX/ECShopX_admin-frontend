import { pickBy } from '@/utils'
import AttrNavItem from './attr-imagepanel'

export default {
  name: 'orderNavigation',
  setting: [
    { label: '埋点参数', key: 'track', component: 'input', value: '' },
    { label: '标题', key: 'title', component: 'input', value: '我的在线商城订单' },
    // { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '标题颜色', key: 'titleColor', component: 'color', value: '#000' },
    { label: '背景颜色', key: 'backgroundColor', component: 'color', value: '#fff' },
    {
      label: '导航图标',
      key: 'data',
      component: function (h, { key }) {
        return <AttrNavItem v-model={this.value[key]} isBusinessShow={this.value.navigation} />
      },
      value: [
        {
          content: '待付款',
          imgUrl: ''
        },
        {
          content: '待收货',
          imgUrl: ''
        },
        {
          content: '待评价',
          imgUrl: ''
        },
        {
          content: '售后',
          imgUrl: ''
        }
      ]
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
          // subtitle: 'subtitle',
          padded: 'padded',
          titleColor: 'titleColor',
          backgroundColor: 'backgroundColor'
        })
      },
      data: 'data'
    })
  }
}
