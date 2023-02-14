import GoodsLink from '../wgt_goodsGridTab/goodsLink.vue'
import AttrGoods from './attr-goods'
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
      // component: function (h, { key }) {
      //   const handleSelectGoodsDialog = async () =>{
      //     const { data } = await this.$picker.goods({
      //       multiple: true
      //     })
      //     const values = []
      //     data?.length && data.forEach((item) => {
      //       if (item.itemId) {
      //         const obj = {
      //           imgUrl: item.pics[0],
      //           title: item.itemName,
      //           goodsId: item.itemId,
      //           brand: item.brand_logo,
      //           price: item.price,
      //           distributor_id: item.distributor_id,
      //           itemEnName: item.item_en_name,
      //           promotionActivity: item.promotion_activity
      //         }
      //         values.push(obj)
      //       }
      //     })
      //     this.value[key] = values
      //   }
      //   return (
      //     <el-button plain size="small" onClick={ handleSelectGoodsDialog }>选择商品</el-button>
      //   )

      // },
      value: []
    },
    {
      label: '查看更多',
      key: 'moreLink',
      component: function (h, { key }) {
        return <GoodsLink v-model={this.value[key]} />
      }
    }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      config: { brand, showPrice, style, moreLink },
      data
    } = v
    const { id: linkId, title: linkTitle, linkPage } = moreLink
    return {
      name,
      ...base,
      brand,
      showPrice,
      style,
      linkId,
      linkTitle,
      linkPage,
      data
    }
  },
  transformOut: (v) => {}
}
