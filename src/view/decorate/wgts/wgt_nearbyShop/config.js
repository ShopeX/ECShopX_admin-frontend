import { pickBy } from '@/utils'
import ShopCategory from './shop-category'

export default {
  name: 'NearbyShop',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '附近商家' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    {
      label: '商家分类',
      key: 'shopClass',
      component: function (h, { key }) {
        return <ShopCategory v-model={this.value[key]} />
      },
      value: {
        tagList: [],
        shopList: []
      }
    },
    { label: '显示优惠券', key: 'showCoupon', component: 'switch', value: false },
    {
      label: '商家排序',
      key: 'shopSort',
      component: function (h, { key }) {
        return <div>{this.value[key]}</div>
      },
      value: 'LBS定位'
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, list, distributor_id } = v
    return {
      name,
      ...base,
      ...config,
      data,
      list,
      distributor_id
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
          brand: 'brand',
          showPrice: 'showPrice',
          style: 'style',
          moreLink: 'moreLink'
        })
      },
      data: 'data'
    })
  }
}
