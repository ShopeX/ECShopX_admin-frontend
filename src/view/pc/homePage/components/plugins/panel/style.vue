<template>
  <product-map :respons="res" :num="9" text="新增导航" />
</template>
<script>
import ProductMap from '../../../pluginscomponents/ProductMap'
export default {
  name: 'PanelStyle',
  components: {
    ProductMap
  },
  props: {
    res: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>
