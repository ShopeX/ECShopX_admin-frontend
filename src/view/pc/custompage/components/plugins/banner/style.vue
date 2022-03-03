<template>
  <product-map :data="data"></product-map>
</template>
<script>
import ProductMap from '../../../pluginscomponents/ProductMap'
export default {
  name: 'bannerStyle',
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
