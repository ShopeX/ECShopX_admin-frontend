import { pickBy } from '@/utils'
import AttrMoreLink from './attr-morelink'
import AttrSelect from './attr-select'
import AttrGoods from './attr-goods'

export default {
  name: 'goodsScroll',
  setting: [
    { label: '标题', key: 'title', component: 'input', value: '当地必买' },
    { label: '副标题', key: 'subtitle', component: 'input', value: '看看大家都在买什么' },
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '显示价格', key: 'showPrice', component: 'switch', value: false },
    {
      label: '开启排行榜',
      key: 'leaderboard',
      component: 'switch',
      value: true,
      isShow: function () {
        return this.value.goodsSetting.type == 'goods'
      }
    },
    {
      label: '商品类型',
      key: 'goodsSetting',
      component: function (h, { key }) {
        console.log(this.value)
        return <AttrGoods type={this.value[key].type} v-model={this.value[key]}/>
      },
      value: { data: [], type: 'goods', seckillId: '' }
    },
    {
      label:'更多链接',
      key:'moreLink',
      component:  function (h, { key }) {
        return <AttrMoreLink v-model={this.value[key]} />
      }
    },
    {
      label: '更多图片',
      key: 'backgroundImg',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: ''
    },
  ],
  transformIn: (v) => {
    const { name, base, config, data } = v
    return {
      name,
      ...base,
      ...config,
      goodsSetting: { type: config.type, seckillId: config.seckillId, data }
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
          backgroundImg: 'backgroundImg'
        })
      },
      config: (v) => {
        return pickBy(v, {
          leaderboard: 'leaderboard',
          moreLink: 'moreLink',
          seckillId: 'goodsSetting.seckillId',
          showPrice: 'showPrice',
          type: 'goodsSetting.type'
        })
      },
      data: 'goodsSetting.data'
    })
  }
}
