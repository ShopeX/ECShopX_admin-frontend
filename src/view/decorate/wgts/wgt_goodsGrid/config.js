
import { pickBy } from '@/utils'
import AttrGoods from './attr-goods'
import AttrLink from './attr-link.vue'

export default {
  name: 'goodsGrid',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '标题' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '副标题' },
    { label: '组件间距', key: 'padded', component: 'switch', value: false },
    {
      label: '样式',
      key: 'style',
      component: 'radio',
      options: [
        { name: '一行2个', label: 'grid' },
        { name: '一行3个', label: 'grids' }
      ],
      value: 'grid'
    },
    { label: '显示价格', key: 'showPrice', component: 'switch', value: false },
    { label: '显示品牌', key: 'brand', component: 'switch', value: true },
    {
      label: '选择商品',
      key: 'data',
      component: function (h, { key }) {
        return <AttrGoods v-model={this.value[key]} />
      },
      value: [
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' }
      ]
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
