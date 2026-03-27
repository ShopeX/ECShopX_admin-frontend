<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <product-map :data="data" :show_goods="false" :text="$t('9ec15717.b89fb3')" />
</template>
<script>
import ProductMap from '../../../../homePage/pluginscomponents/ProductMap'
export default {
  name: 'PosterStyle',
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
