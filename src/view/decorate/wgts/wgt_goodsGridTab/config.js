import { pickBy, isObject } from '@/utils'
import AttrClass from './attr-class'
import CompPickerLink from '../../comps/comp-pickerLink'

export default {
  name: 'goodsGridTab',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '爆品直邮' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '宅家买遍全法' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '直接加购', key: 'addCart', component: 'switch', value: false },
    { label: '显示价格', key: 'showPrice', component: 'switch', value: true },
    { label: '显示品牌', key: 'brand', component: 'switch', value: true },
    {
      label: '商品分类',
      key: 'list',
      component: function (h, { key }) {
        return <AttrClass v-model={this.value[key]} />
      },
      value: [
        {
          tabTitle: '标签',
          goodsList: [
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '商品名称',
              id: '',
              price: 0,
              market_price: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '商品名称',
              id: '',
              price: 0,
              market_price: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '商品名称',
              id: '',
              price: 0,
              market_price: 0
            },
            {
              imgUrl: '',
              linkPage: '',
              content: '',
              title: '商品名称',
              id: '',
              price: 0,
              market_price: 0
            }
          ]
        }
      ]
    },
    {
      label: '查看更多',
      key: 'moreLink',
      component: function (h, { key }) {
        return <CompPickerLink v-model={this.value[key]} style='margin-top: 7px;' />
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
          moreLink: 'moreLink',
          addCart: 'addCart'
        })
      },
      list: 'list',
      data: 'data',
      distributor_id: 'distributor_id'
    })
    return obj
  }
}
