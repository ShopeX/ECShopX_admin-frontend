<style lang="scss">
.attr-class {
  .comp-todolist {
    margin-bottom: 10px;
  }

  .cate-item {
    display: flex;
  }

  .comp-button {
    min-width: 80px;
  }

  .cate-name {
    width: 120px;
    margin-right: 10px;
  }
}
</style>
<template>
  <div class="attr-class">
    <CompTodoList v-model="localValue" :max="20" @onAddItem="handleAddTabs">
      <template slot="myslot" slot-scope="scope">
        <div class="cate-item">
          <el-input v-model="scope.data.tabTitle" class="cate-name" size="small" />
          <CompButton :clearable="scope.data.goodsList.length > 0"
            @click="handleSelectGoods(scope.data.goodsList, scope.index)" @remove="onRemoveItem(scope.index)">
            {{
              scope.data.goodsList.length > 0 ? `已选: ${scope.data.goodsList.length}` : `选择商品`
            }}
          </CompButton>
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
// import classifyDialog from "./classifyDialog.vue"
import { cloneDeep } from 'lodash'
import CompButton from '../../comps/comp-button'
import CompTodoList from '../../comps/comp-todoList'
export default {
  name: 'AttrClass',
  components: { CompButton, CompTodoList },
  props: ['value'],
  data() {
    return {
      localValue: []
    }
  },
  watch: {
    localValue: {
      handler(nVal) {
        this.$emit('input', nVal)
      },
      deep: true
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    async handleSelectGoods(items, index) {
      const { data } = await this.$picker.goods({
        data: items,
        multiple: true
      })
      let values = []
      data &&
        data.forEach((item) => {
          if (item.itemId) {
            console.log(JSON.stringify(item))
            let obj = {
              imgUrl: item.pics[0],
              title: item.itemName,
              goodsId: item.itemId,
              brand: item.brand_logo,
              price: item.price,
              distributor_id: item.distributor_id,
              itemEnName: item.item_en_name,
              promotionActivity: item.promotion_activity
            }
            values.push(obj)
          }
        })
      this.localValue[index].goodsList = values
    },
    handleAddTabs() {
      this.localValue.push({ tabTitle: '标签', goodsList: [] })
    },
    onRemoveItem(index) {
      this.localValue[index].goodsList = []
    }
  }
}
</script>
