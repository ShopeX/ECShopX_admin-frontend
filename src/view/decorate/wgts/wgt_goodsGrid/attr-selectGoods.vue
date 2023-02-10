<template>
  <div>
    <el-button plain size="small" @click="handleGoodsDialogShow">选择商品</el-button>
    <GoodsSelector
      :items-visible="itemVisible"
      :get-status="setItemStatus"
      :rel-items-ids="relItems"
      item-type="normal"
      :limit-count="100"
      @chooseStore="handleGoodsSubmit"
      @closeStoreDialog="handleGoodsDialogHide"
    />
  </div>
</template>

<script>
import GoodsSelector from '@/components/goodsSelect/index'

export default {
  name: 'AttrSelectGoods',
  components: {
    GoodsSelector
  },
  data() {
    return {
      itemVisible: false,
      setItemStatus: false,
      relItems: []
    }
  },
  created() {},
  methods: {
    handleGoodsDialogShow() {
      this.itemVisible = true
      this.setItemStatus = true
    },
    handleGoodsSubmit (data) {
      this.itemVisible = false
      if (data === null || data.length <= 0) return
      this.relItems = data
      let list = []
      data.forEach((item) => {
        if (!item.nospec) {
          list.push(Object.assign(item, { spec_items: [] }))
        } else {
          list.push(item)
        }
      })
      if (this.goods.length > 0) {
        list.forEach((item) => {
          let goodsItem = this.goods.find((n) => item.itemId === n.item_id)
          if (goodsItem && goodsItem.spec_items && goodsItem.spec_items.length > 0) {
            item.spec_items = goodsItem.spec_items
          }
        })
      }
      this.goods = list
    },
    handleGoodsDialogHide () {
      this.itemVisible = false
    },
  }
}
</script>
