<template>
  <product-map :data="data" :num="4" text="新增"></product-map>
</template>
<script>
import ProductMap from '../../../pluginscomponents/ProductMap'
export default {
  name: 'panelStyle',
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
