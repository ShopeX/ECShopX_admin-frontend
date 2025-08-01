<template>
  <section v-if="name === 'goods'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <!-- <el-form-item label="展示样式">
          <el-radio-group v-model="config.style">
            <el-radio :label="'card'">卡片</el-radio>
            <el-radio :label="'poster'">海报</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="选择商品">
          <div v-if="data[0].item_id" class="goods-card">
            <div class="goods" :class="config.style">
              <img
                class="thumbnail"
                :src="
                  data[0].img_url ||
                  (config.style === 'card'
                    ? 'https://fakeimg.pl/80x80/EFEFEF/CCC/?text=img&font=lobster'
                    : 'https://fakeimg.pl/288x120/EFEFEF/CCC/?text=img&font=lobster')
                "
              >
              <div class="caption">
                <div class="goods-title">
                  {{ data[0].item_name || '商品标题' }}
                </div>
                <div class="sales-num">
                  <i class="iconfont icon-user-friends" />{{ data[0].sales || 0 }}
                </div>
                <div class="price">价格： ¥{{ data[0].price / 100 }}</div>
              </div>
            </div>
          </div>
          <el-button type="primary" plain round @click="showGoods"> 选择商品 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <GoodsSelect
      :items-visible="itemVisible"
      :get-status="setItemStatus"
      :rel-items-ids="relItemsIds"
      :limit-num="1"
      @chooseStore="pickItem"
      @closeStoreDialog="hideGoods"
    />
  </section>
</template>

<script>
import GoodsSelect from '@/components/goodsSelect'

export default {
  components: {
    GoodsSelect
  },
  props: {
    res: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: [],
      relItemsIds: [],
      itemVisible: false,
      setItemStatus: false,
      imgDialog: false,
      isGetImage: false
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    showGoods() {
      this.itemVisible = true
      this.setItemStatus = true
    },
    pickItem(data) {
      this.itemVisible = false
      this.relItemsIds = data
      if (data === null || data.length <= 0) return
      this.data[0].item_id = data[0].itemId
      this.data[0].distributor_id = data[0].distributor_id || 0
      this.data[0].item_name = data[0].item_name
      this.data[0].sales = data[0].sales
      this.data[0].img_url = data[0].pics[0] || ''
      this.data[0].price = data[0].price
    },
    hideGoods() {
      this.itemVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.goods-card {
  width: 300px;
  margin-bottom: 20px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  line-height: 1.4;
  .goods {
    .thumbnail {
      display: block;
    }
    .caption {
      .goods-title {
        display: -webkit-box;
        height: 42px;
        margin-bottom: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 2;
        box-orient: vertical;
        color: #333;
        font-size: 15px;
        line-height: 1.4;
      }
      .price {
        font-size: 14px;
        color: #cd6821;
      }
    }
    &.card {
      display: flex;
      padding: 10px;
      .thumbnail {
        width: 80px;
        height: 80px;
      }
      .caption {
        flex: 1;
        padding-left: 15px;
        .tips {
          font-size: 12px;
          color: #777;
        }
        .sales-num {
          color: #999;
          font-size: 12px;
          .iconfont {
            font-size: 12px;
            margin-right: 10px;
            color: #ccc;
          }
        }
      }
    }
  }
}
</style>
