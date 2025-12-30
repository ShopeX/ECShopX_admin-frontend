<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <product-map :num="9" :respons="res" />
</template>
<script>
import ProductMap from '../../../pluginscomponents/ProductMap'
export default {
  name: 'BannerStyle',
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
