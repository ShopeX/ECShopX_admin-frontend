<template>
  <div>
    <goodsGridEditor
      :res="t_data"
      :show_price="false"
      :show_subtitle="false"
      :show_brand="false"
      :show_space="false"
      :show_style="false"
      :limit_num="limit_num"
      @bindGoods="showGoods"
    />
    <goodsPicker
      usage="pc"
      :visible="goodsVisible"
      @pickGoods="pickGoods"
      @closeDialog="closeDialog"
    />
  </div>
</template>
<script>
import goodsGridEditor from '@/components/template_editor/goods_grid'
import goodsPicker from '@/components/goods_picker'
export default {
  name: 'GoodsGridStyle',
  components: {
    goodsGridEditor,
    goodsPicker
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    usage: {
      type: String
    }
  },
  data() {
    return {
      t_data: this.data,
      goodsVisible: false
    }
  },
  computed: {
    limit_num() {
      return this.usage == 'store' ? 20 : 0
    }
  },
  watch: {
    t_data: {
      handler(newVal, oldVal) {
        this.$emit('data', newVal)
      },
      deep: true
    }
  },
  methods: {
    showGoods(index) {
      console.log('showGoods', index)
      if (index) {
        this.editorDataIndex = index
      }
      this.goodsVisible = true
    },
    pickGoods(data) {
      this.t_data.data = [...this.t_data.data, ...data]
      console.log(this.limit_num, this.t_data.data.length, this.limit_num)
      // 限制数量处理（弹框中可选的数量不确定）
      if (this.limit_num && this.t_data.data.length > this.limit_num) {
        const delNum = this.t_data.data.length - this.limit_num
        this.t_data.data.splice(this.limit_num, delNum)
      }
      console.log('pickGoods', this.t_data.data)
      this.goodsVisible = false
    },
    closeDialog() {
      this.goodsVisible = false
    }
  }
}
</script>
