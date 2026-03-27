<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="">
    <SpFinder ref="finder" url="/company/operatorlogs" no-selection :setting="setting" border />
  </SpPage>
</template>

<script>
export default {
  name: 'OperationLog',
  data() {
    return {
      setting: {
        columns: [
          {
            name: this.$t('930caa63.2f2786'),
            key: 'operator_name',
            width: 160
          },
          {
            name: this.$t('930caa63.6b0bc6'),
            key: 'username',
            width: 160
          },
          {
            name: 'IP',
            key: 'ip',
            width: 160
          },
          {
            name: this.$t('930caa63.19fcb9'),
            key: 'created',
            formatter: (value) => {
              return this.$options.filters.datetime(value, 'YYYY-MM-DD HH:mm:ss')
            }
          }
        ]
      }
    }
  },

  mounted() {
    this.getOperatorsList()
  },

  methods: {
    async getOperatorsList() {
      try {
        let params = {
          pageSize: 20,
          page: 1
        }
        await this.$api.company.getCompanysLogs(params)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
