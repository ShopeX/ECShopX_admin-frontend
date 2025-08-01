<template>
  <el-dialog
    title="选择商品"
    class="select-goods-box"
    :visible="goodsVisible"
    width="732px"
    append-to-body
    @close="closeDialog"
  >
    <StoreFilter v-if="!filter" class="store" :data="store" @change="handleStoreChange" />
    <el-form label-position="left" label-width="70px">
      <el-form-item label="商品名： ">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input
              v-model="params.keywords"
              clearable
              placeholder="请输入商品名称"
              @clear="searchByKey"
            />
          </el-col>
          <el-col :span="12">
            <el-button icon="el-icon-search" type="danger" @click="searchByKey" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0">
        <el-transfer
          v-model="selectedGoods"
          v-loading="loading"
          :titles="['商品列表', '已选中']"
          :button-texts="['移除选择', '添加选择']"
          :data="goodsList"
          @change="goodsSelector"
        >
          <div slot="left-footer" class="transfer-footer">
            <el-pagination
              v-if="total_count > params.pageSize"
              small
              layout="prev, pager, next"
              :total="total_count"
              :page-size="params.pageSize"
              @current-change="pageChange"
            />
          </div>
        </el-transfer>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="goodsComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import StoreFilter from '@/components/function/storeFilter'
import { getItemsList } from '@/api/goods'
import { getPcItemsList } from '@/api/pcgoods'

export default {
  components: {
    StoreFilter
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    usage: {
      type: String, // 'pc'（pc端装修）
      default: 'wxapp' // 小程序端
    },
    filter: [String, Object]
  },
  data() {
    return {
      goodsVisible: false,
      loading: false,
      params: {
        keywords: '',
        item_type: 'normal',
        page: 1,
        pageSize: 20
      },
      total_count: 0,
      goodsList: [],
      selectedGoods: [],
      selected: [],
      store: {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.goodsVisible = val
        this.getGoodsList()
      }
    }
  },
  mounted() {},
  methods: {
    searchByKey() {
      this.params.page = 1
      this.getGoodsList()
    },
    // 选择商品分页
    pageChange(val) {
      this.params.page = val
      this.getGoodsList()
    },
    handleStoreChange(val) {
      this.store = val
      this.goodsList = []
      this.params.distributor_id = val.id
      this.getGoodsList()
    },
    // 选择商品触发事件
    goodsSelector(value, direction, movedKeys) {
      let list = []
      this.goodsList.forEach(item => {
        this.selectedGoods.forEach(itemKey => {
          if (item.key === itemKey) {
            list.push(item)
          }
        })
      })
      this.selected = list
      if (value.length > 12) {
        this.$message({
          message: '最多选择12个商品',
          type: 'error',
          duration: 5 * 1000
        })
        this.selectedGoods.splice(12)
      }
    },
    // 选择商品确认
    goodsComfirm() {
      let values = []
      if (this.selectedGoods.length > 0) {
        this.goodsList.forEach(item => {
          this.selectedGoods.forEach(key => {
            if (item.key == key) {
              let obj = {
                imgUrl: item.imgUrl,
                title: item.label,
                goodsId: item.key,
                brand: item.brand,
                price: item.price,
                promotion_activity: item.promotion_activity,
                distributor_info: item.distributor_info
              }
              values.push(obj)
            }
          })
        })
      } else {
        this.$message({
          message: '请选择商品',
          type: 'error'
        })
        return
      }
      this.selected = []
      this.selectedGoods = []
      this.goodsVisible = false
      this.$emit('pickGoods', values)
    },
    getGoodsList() {
      this.loading = true
      if (this.usage === 'wxapp') {
        this._getItemsList()
      } else if (this.usage === 'pc') {
        this._getPcItemsList()
      }
    },
    _getItemsList() {
      getItemsList(this.params).then(response => {
        let list = []
        response.data.data.list.forEach(item => {
          list.push({
            key: item.itemId,
            label: item.itemName,
            imgUrl: item.pics[0],
            brand: item.brand_logo,
            price: item.price
          })
        })
        list = list.concat(this.selected)
        this.goodsList = list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    _getPcItemsList() {
      getPcItemsList(Object.assign({}, this.params, { item_type: 'normal' })).then(response => {
        let list = []
        response.data.data.list.forEach(item => {
          let imgUrl = ''
          if (typeof item.pics === 'string' && item.pics !== '') {
            imgUrl = JSON.parse(item.pics)[0]
          } else {
            imgUrl = item.pics[0]
          }
          list.push({
            key: item.item_id,
            label: item.item_name,
            imgUrl,
            brand: item.brand_logo,
            price: item.price,
            promotion_activity: item.promotion_activity,
            distributor_info: item.distributor_info
          })
        })

        list = list.concat(this.selected)
        this.goodsList = list
        console.log('this.goodsList', list)
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    },
    closeDialog() {
      this.goodsVisible = false
      this.$emit('closeDialog', 'goods')
    }
  }
}
</script>

<style></style>
