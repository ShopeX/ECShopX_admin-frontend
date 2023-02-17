import AttrClass from './attr-class'
import AttrLink from './attr-link.vue'
import { pickBy, isObject } from '@/utils'

export default {
  name: 'goodsGridTab',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '爆品直邮' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '宅家买遍全法' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '显示价格', key: 'showPrice', component: 'switch', value: false },
    { label: '显示品牌', key: 'brand', component: 'switch', value: false },
    {
      label: '商品分类',
      key: 'list',
      component: function (h, { key }) {
        return <AttrClass v-model={this.value[key]} />
      },
      value: [{ tabTitle: '标签', goodsList: [] }]
    },
    {
      label: '查看更多',
      key: 'moreLink',
      component: function (h, { key }) {
        return <AttrLink v-model={this.value[key]} />
      }
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
    const obj = pickBy(v, {
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded',
          listIndex: 'listIndex'
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
      list: 'list',
      data: 'data',
      distributor_id: 'distributor_id'
    })
    return obj
  }
}
