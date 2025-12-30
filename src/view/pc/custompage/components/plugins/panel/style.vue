<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <product-map :data="data" :num="4" text="新增" />
</template>
<script>
import ProductMap from '../../../pluginscomponents/ProductMap'
export default {
  name: 'PanelStyle',
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
