<template>
  <div>
    <el-row
      v-if="goods.length > 0"
      :gutter="20"
    >
      <el-col
        v-for="(item, index) in goods"
        :key="index"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <div class="goods">
          <div class="goods-thumbnail">
            <img
              :src="item.pics[0]"
              alt=""
            >
          </div>
          <div class="goods-caption">
            <div class="goods-title">
              {{ item.itemName }}
            </div>
            <!-- <div class="goods-sku">
              <template v-if="!item.nospec">
                {{ item.spec_items.length > 0 ? '已选' + item.spec_items.length : '全规格' }}
                <div
                  class="goods-sku-check"
                  @click="handleSkuDialogShow(index)"
                >
                  选择规格
                </div>
              </template>
            </div> -->
          </div>
          <div
            class="goods-remove iconfont icon-trash-alt"
            @click="handleSkuRemove(index)"
          />
        </div>
      </el-col>
    </el-row>
    <div>
      <el-button
        type="primary"
        @click="handleGoodsDialogShow"
      >
        选择商品
      </el-button>
    </div>
    <!-- <el-dialog
      title="选择sku"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-table
        ref="skuTable"
        v-loading="loading"
        :data="skus"
        @selection-change="handleSkuChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column label="规格名称">
          <template slot-scope="scope">
            {{ scope.row.item_spec_desc }}
          </template>
        </el-table-column>
        <el-table-column label="价格">
          <template slot-scope="scope">
            ¥{{ scope.row.price / 100 }}
          </template>
        </el-table-column>
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSkuSubmit"
        >确 定</el-button>
      </span>
    </el-dialog> -->
    <GoodsSelector
      :single="singleData"
      :items-visible="itemVisible"
      :get-status="setItemStatus"
      :rel-items-ids="relItems"
      :item-type="item_type"
      @chooseStore="handleGoodsSubmit"
      @closeStoreDialog="handleGoodsDialogHide"
    />
  </div>
</template>

<script>
import GoodsSelector from '../goodsSelect/index'
import { getItemsList } from '../../api/goods'

export default {
  components: {
    GoodsSelector
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    limit: {
      type: Number,
      default: 0
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      goods: [],
      current: '',
      currentPage: 1,
      skuParams: {
        page: 1,
        pageSize: -1,
        item_type: 'normal',
        approve_status: 'onsale',
        is_sku: true,
        item_id: ''
      },
      skuTotal: 0,
      skus: [],
      checkedSkus: [],
      dialogVisible: false,
      itemVisible: false,
      setItemStatus: false,
      relItems: [],
      item_type: 'normal'
    }
  },
  computed: {
    singleData () {
      return this.single
    }
  },
  watch: {
    data (val) {

      // console.log("🚀🚀🚀 ~ file: goodsSelector.vue:156 ~ data ~ val:", val)

      this.goods = val
      this.relItems = JSON.parse(JSON.stringify(val))
      this.generateSku()
    }
  },
  methods: {
    handleSkuDialogShow (index) {
      const that = this
      this.loading = true
      this.current = index
      this.skuParams.item_id = this.goods[index].default_item_id
      this.dialogVisible = true
      let checked = this.goods[index].spec_items
      getItemsList(this.skuParams).then((res) => {
        this.skus = res.data.data.list
        this.$nextTick(() => {
          that.skus.forEach((item) => {
            let index = checked.findIndex((n) => item.itemId === n.itemId)
            if (index !== -1) {
              that.$refs.skuTable.toggleRowSelection(item)
            }
          })
        })
        this.loading = false
      })
    },
    handleGoodsDialogShow () {
      this.itemVisible = true
      this.setItemStatus = true
    },
    handleSkuChange (val) {
      this.checkedSkus = val
    },
    handleSkuSubmit () {
      this.dialogVisible = false
      this.goods[this.current].spec_items = this.checkedSkus
      this.generateSku()
    },
    handleGoodsSubmit (data) {
      console.log('handleGoodsSubmit data', data)
      this.itemVisible = false
      if (data === null ) return
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

      console.log('this.goods', this.goods);
      
      this.generateSku()
    },
    generateSku () {
      let noSkuItem = []
      let response = []
      let goodsList = JSON.parse(JSON.stringify(this.goods))
      // goodsList.forEach((item) => {
      //   if (!item.nospec && item.spec_items.length === 0) {
      //     noSkuItem.push(item.default_item_id)
      //   }
      // })
      // if (noSkuItem.length > 0) {
      //   let param = this.skuParams
      //   param.item_id = noSkuItem
      //   getItemsList(this.skuParams).then((res) => {
      //     goodsList.forEach((item) => {
      //       if (!item.nospec) {
      //         res.data.data.list.forEach((sku) => {
      //           if (item.item_id === sku.default_item_id) {
      //             item.spec_items.push(sku)
      //           }
      //         })
      //       }
      //     })
      //     goodsList.forEach((item) => {
      //       if (!item.nospec) {
      //         response = [...response, ...item.spec_items]
      //       } else {
      //         response = [...response, item]
      //       }
      //     })
      //     this.$emit('change', response)
      //   })
      // } else {
      //   goodsList.forEach((item) => {
      //     if (!item.nospec) {
      //       response = [...response, ...item.spec_items]
      //     } else {
      //       response = [...response, item]
      //     }
      //   })
      //   this.$emit('change', response)
      // }
      this.$emit('change', this.goods)
    },
    handleGoodsDialogHide () {
      this.itemVisible = false
    },
    handleSkuRemove (index) {
      this.goods.splice(index, 1)
      this.relItems.splice(index, 1)
      this.generateSku()
    }
  }
}
</script>

<style lang="scss" scoped>
.goods {
  display: flex;
  position: relative;
  padding: 10px;
  height: 80px;
  margin-bottom: 10px;
  transition: all 0.5s ease;
  &:hover {
    background: #f5f7fa;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  }
}
.goods-thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-right: 10px;
  background: #efefef;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
.goods-caption {
  flex: 1;
  padding-right: 30px;
}
.goods-title {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
  box-orient: vertical;
  margin-bottom: 5px;
  width: 100%;
  max-height: 34px;
  font-size: 15px;
  line-height: 1.2;
  color: #333;
}
.goods-sku {
  color: #888;
}
.goods-sku-check {
  display: inline-block;
  margin-left: 5px;
  color: #1f82e0;
  cursor: pointer;
}
.goods-remove {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    color: #ff5000;
  }
}
</style>
