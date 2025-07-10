import { pickBy } from '@/utils'
import AttrGoods from './attr-goods'
import CompPickerLink from '../../comps/comp-pickerLink'

export default {
  name: 'goodsGrid',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '爆品直邮' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '宅家买遍全法' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '直接加购', key: 'addCart', component: 'switch', value: false },
    {
      label: '样式',
      key: 'style',
      component: 'radio',
      options: [
        { name: '一行两个', label: 'grid' },
        { name: '一行三个', label: 'grids' }
      ],
      value: 'grid'
    },
    { label: '显示价格', key: 'showPrice', component: 'switch', value: false },
    { label: '显示品牌', key: 'brand', component: 'switch', value: true },
    {
      label: '商品类型',
      key: 'goodsSetting',
      component: function (h, { key }) {
        return <AttrGoods v-model={this.value[key]} type={this.value[key].type} />
      },
      value: {
        data: [
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
        ],
        pointGoods: [
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: '商品名称',
            id: '',
            price: 0,
            market_price: 0,
            point: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: '商品名称',
            id: '',
            price: 0,
            market_price: 0,
            point: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: '商品名称',
            id: '',
            price: 0,
            market_price: 0,
            point: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: '商品名称',
            id: '',
            price: 0,
            market_price: 0,
            point: 0
          }
        ],
        type: 'normal',
      }
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
    const { name, base, config, data, distributor_id } = v
    const { type = 'normal' } = config
    let list = []
    let pointGoods = []
    if (type == 'normal') {
      list = data
    } else if (type == 'point') {
      pointGoods = data
    }
    return {
      name,
      ...base,
      ...config,
      data,
      list,
      distributor_id,
      goodsSetting: {
        type: type,
        data: list,
        pointGoods,
      }
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
          moreLink: 'moreLink',
          addCart: 'addCart',
          type: 'goodsSetting.type'
        })
      },
      data: ({ goodsSetting: { type, data, pointGoods } }) => {
        if (type == 'point') {
          return pointGoods
        } else {
          return data
        }
      }
    })
  }
}
