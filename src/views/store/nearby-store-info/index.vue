<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('5071224d.84b1aa')">
    <SpFormPlus
      ref="nearbyStoreForm"
      form-type="normalForm"
      v-model="formData"
      :form-items="formItems"
      label-width="120px"
      @submit="handleSubmit"
    />
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        background_url: ''
      },
      formItems: [
        {
          label: this.$t('5071224d.f8e0a7'),
          component: 'imagepicker',
          fieldName: 'background_url',
          rules: [
            {
              required: true,
              message: this.$t('5071224d.562662')
            }
          ]
        }
      ]
    }
  },
  async mounted() {
    try {
      const res = await this.$api.store.getNearbyStoreBackground()
      if (res && res.background_url) {
        this.formData.background_url = res.background_url
      }
    } catch (error) {
      console.error('获取附近门店背景图失败:', error)
    }
  },
  methods: {
    async handleSubmit(formData) {
      try {
        await this.$api.store.saveNearbyStoreBackground({
          background_url: formData.background_url
        })
        this.$message.success(this.$t('5071224d.3b1083'))
      } catch (error) {
        this.$message.error(this.$t('5071224d.6de920'))
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
