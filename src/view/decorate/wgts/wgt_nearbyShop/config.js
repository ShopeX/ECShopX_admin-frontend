import { pickBy } from '@/utils'
import AttrCategory from './attr-category'

export default {
  name: 'nearbyShop',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '附近商家' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    {
      label: '商家',
      key: 'seletedTags',
      component: function (h, { key }) {
        return <AttrCategory v-model={this.value[key]} />
      },
      value: []
    },
    { label: '显示优惠券', key: 'show_coupon', component: 'switch', value: false }
    // {
    //   label: '商家排序',
    //   key: 'shopSort',
    //   component: function (h, { key }) {
    //     return <div>{this.value[key]}</div>
    //   },
    //   value: 'LBS定位'
    // }
  ],
  transformIn: (v) => {
    const { name, base, seletedTags = [] } = v
    return {
      name,
      ...base,
      seletedTags
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded',
          show_coupon: 'show_coupon'
        })
      },
      seletedTags: 'seletedTags'
    })
  }
}
