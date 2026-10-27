<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="tip-info">
      <p>
        {{ $t('5f45d286.08f306') }}
      </p>
      <p>{{ $t('5f45d286.4f6279') }}</p>
    </div>
    <related-upload
      :file-type="fileType"
      :related-id="relatedId"
      :file-name="$t('5f45d286.27fabd')"
      :table-height="wheight - 220"
      :extra-params="uploadExtraParams"
    />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import RelatedUpload from '@/components/related-upload'
import { IS_SUPPLIER } from '@/utils'

export default {
  components: {
    RelatedUpload
  },
  data() {
    return {
      relatedId: ''
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    fileType() {
      return IS_SUPPLIER() ? 'supplier_goods' : 'normal_goods'
    },
    uploadExtraParams() {
      return {
        distributor_id: this.$store.getters.shopId || 0
      }
    }
  },
  mounted() {
    const { relation_id = '' } = this.$route.query
    this.relatedId = relation_id
  }
}
</script>
