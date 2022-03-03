<template>
  <product-map :data="data" :show_goods="false" text="添加图片"></product-map>
</template>
<script>
import ProductMap from '../../../../homePage/pluginscomponents/ProductMap'
export default {
  name: 'posterStyle',
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  components: {
    ProductMap
  }
}
</script>
