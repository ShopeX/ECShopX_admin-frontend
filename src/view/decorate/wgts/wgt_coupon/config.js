import { pickBy } from '@/utils'
import CouponStyle from './coupon-style'
import CouponItem from './coupon-item'

export default {
  name: 'coupon',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '到店优惠' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '游客专享福利' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '样式',
      key: 'style',
      component: function (h, { key }) {
        return <CouponStyle v-model={this.value[key]} />
      },
      value: '1'
    },
    {
      label: '优惠券',
      key: 'data',
      component: function (h, { key }) {
        return <CouponItem v-model={this.value[key]} />
      },
      value: [
        {
          amount: 8,
          desc: '优惠券描述',
          id: '',
          imgUrl: '',
          title: '优惠券名称',
          type: 'cash'
        }
      ]
    }
  ],
  transformIn: (v) => {
    const { name, base, data } = v
    return {
      name,
      ...base,
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
      data: 'data'
    })
  }
}
