<template>
  <product-map :data="data" />
</template>
<script>
import ProductMap from '../../../pluginscomponents/ProductMap'
export default {
  name: 'BannerStyle',
  components: {
    ProductMap
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>
