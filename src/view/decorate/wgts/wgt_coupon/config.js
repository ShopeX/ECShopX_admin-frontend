import CouponStyle from './coupon-style'
import CouponItem from './coupon-item'

export default {
  name: 'coupon',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
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
      value: {}
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
  transformOut: (v) => {}
}
