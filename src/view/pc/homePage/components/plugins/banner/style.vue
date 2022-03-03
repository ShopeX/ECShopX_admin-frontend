<template>
  <product-map :num="9" :respons="res"></product-map>
</template>
<script>
import ProductMap from '../../../pluginscomponents/ProductMap'
export default {
  name: 'bannerStyle',
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
