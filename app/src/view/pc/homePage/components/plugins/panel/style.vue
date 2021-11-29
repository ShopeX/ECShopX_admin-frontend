<template>
  <product-map :respons="res" :num="9" text="新增导航"></product-map>
</template>
<script>
import ProductMap from '../../../pluginscomponents/ProductMap'
export default {
  name: 'panelStyle',
  props: {
    res: {
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
