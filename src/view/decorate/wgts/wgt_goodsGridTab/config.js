import GoodsClassify from './goodsClassify.vue'
import GoodsLink from './goodsLink.vue'

export default {
  name: 'goodsGridTab',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '爆品直邮' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '宅家买遍全法' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '显示价格', key: 'showPrice', component: 'switch', value: false },
    { label: '显示品牌', key: 'brand', component: 'switch', value: false },
    { label: '商品分类', key: 'list', component:  function (h, { key }) {
      return <GoodsClassify  v-model={this.value[key]} />
    }, value: false },
    {label:'查看更多',key:'moreLink', component:  function (h, { key }) {
      return <GoodsLink  v-model={this.value[key]} />
    }, value: false },
  ],
  transformIn: (v) => {
    const { name, base, config, data, list } = v
    return {
      name,
      ...base,
      ...config,
      data,
      list
    }
  },
  transformOut: (v) => {}
}
