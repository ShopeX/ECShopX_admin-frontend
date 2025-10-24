<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage>
    <div class="px-5">
      <SpIphone>
        <SpDecorate
          ref="decorateRef"
          v-model="content"
          scene="1009"
          title="导购装修"
          @change="onSaveTemplate"
        />
      </SpIphone>
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCustomSalesperson, editCustomPage } from '@/api/wxa'
import shopDecoration from '@/components/function/shopDecoration'
import imgPicker from '@/components/imageselect'
export default {
  components: {
    shopDecoration,
    imgPicker
  },
  data() {
    return {
      imgDialog: false,
      isGetImage: false,
      template_dialog: false,
      loading: false,
      params: {},
      pageForm: {
        id: ''
      },
      content: [],
      templteid: 0
    }
  },
  computed: {
    ...mapGetters(['wheight', 'template_name'])
  },
  mounted() {
    this.fetchPageData()
  },
  methods: {
    async fetchPageData() {
      this.loading = true
      Object.assign(this.params, { template_name: this.template_name })
      getCustomSalesperson(this.params).then((response) => {
        this.templteid = response.data.data.id
        this.onGetTemp(this.templteid)
        this.loading = false
      })
    },
    async onGetTemp(id) {
      const resTemplate = await this.$api.wxa.getParamByTempName({
        template_name: 'yykweishop',
        page_name: `custom_${id}`,
        version: 'v1.0.1'
      })
      console.log(resTemplate?.config)
      this.content = resTemplate?.config
    },
    async onSaveTemplate(content) {
      await this.$api.wxa.savePageParams({
        template_name: 'yykweishop',
        page_name: `custom_${this.templteid}`,
        version: 'v1.0.1',
        config: JSON.stringify(content)
      })
    }
  }
}
</script>
