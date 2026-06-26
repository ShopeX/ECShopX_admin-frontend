<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-tabs v-model="activeName" type="card">
      <div class="tip-info">
        <p>
          {{ $t('5f45d286.08f306') }}
        </p>
        <p>{{ $t('5f45d286.4f6279') }}</p>
      </div>
      <template v-for="item in pane_list">
        <el-tab-pane :key="item.name" :label="item.label" :name="item.name">
          <related-upload
            v-if="activeName == item.name"
            :file-type="getFileType()"
            :related-id="relatedId"
            :file-name="getFileName()"
            :table-height="wheight - 220"
            :extra-params="uploadExtraParams"
          />
        </el-tab-pane>
      </template>
    </el-tabs>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import RelatedUpload from '@/components/related-upload'
import { IS_SUPPLIER } from '@/utils'
import { i18n } from '@/i18n'

export default {
  components: {
    RelatedUpload
  },
  data() {
    const paneList = [
      { name: 'upload_tb_items', label: i18n.t('5f45d286.f1968b') },
      { name: 'normal_goods', label: i18n.t('5f45d286.9e6dce') }
    ]

    if (!IS_SUPPLIER()) {
      paneList.push({ name: 'employee_purchase_activity_items', label: i18n.t('5f45d286.4482b6') })
    }

    return {
      pane_list: paneList,
      activeName: '',
      relatedId: ''
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    uploadExtraParams() {
      return {
        distributor_id: this.$store.getters.shopId || 0
      }
    }
  },
  mounted() {
    const { file_type = 'normal_goods', relation_id = '' } = this.$route.query
    this.activeName = file_type
    this.relatedId = relation_id
  },
  methods: {
    getFileType() {
      return IS_SUPPLIER() && this.activeName == 'normal_goods' ? 'supplier_goods' : this.activeName
    },
    getFileName() {
      if (this.activeName == 'employee_purchase_activity_items') {
        return this.$t('5f45d286.3dd83a')
      }
      return this.$t('5f45d286.27fabd')
    }
  }
}
</script>
