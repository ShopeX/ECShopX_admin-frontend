<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="flex flex-col h-full bg-gray-50">
    <LayoutHeader>
      <SpImage class="ml-5" :src="logo" height="26" fit="contain" />
      <div class="light flex h-full items-center text-xl ml-2 text-[#333]">
        {{ $t('16bb187d.a4d703') }}
      </div>
    </LayoutHeader>
    <div class="flex-1 w-[1000px] mx-auto pt-10">
      <SpFinder no-selection :show-pager="false" :setting="setting" :data="storeList" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { createSetting } from '@shopex-ui/finder'
import { LayoutHeader } from '@/layout/basic'
import DEFAULT_CONFIG from '@/config'
import { resolveAppPath } from '@/utils'

export default {
  components: {
    LayoutHeader
  },
  data() {
    return {
      setting: createSetting({
        columns: [
          { name: this.$t('16bb187d.0d4934'), key: 'name' },
          {
            name: this.$t('16bb187d.53c3dd'),
            key: 'name',
            width: 120,
            render: (h, { row }) => {
              return h(
                'el-tag',
                {
                  props: {
                    type: row.is_valid == 'true' ? 'success' : 'danger'
                  }
                },
                row.is_valid == 'true' ? this.$t('16bb187d.7854b5') : this.$t('16bb187d.710ad0')
              )
            }
          },
          { name: this.$t('16bb187d.9198af'), key: 'store_address' },
          {
            name: this.$t('16bb187d.eca37c'),
            key: 'created',
            width: 180,
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        ],
        actions: [
          {
            name: this.$t('16bb187d.8f822c'),
            key: 'create',
            type: 'button',
            buttonType: 'text',
            style: {
              textAlign: 'center'
            },
            action: {
              handler: async ([row]) => {
                const res = await this.$api.company.shopLoginSelectShopId({
                  set_distributor_id: row.distributor_id
                })
                if (res.status) {
                  this.$store.commit('user/setShopId', { shopId: row.distributor_id })
                  window.location.href = resolveAppPath('/shopadmin')
                } else {
                  this.$message.error(this.$t('16bb187d.4a3301'))
                }
              }
            },
            visible: (row, col) => {
              return row.is_valid == 'true'
            }
          }
        ]
      }),
      storeList: []
    }
  },
  computed: {
    logo() {
      const sysLogo = this.$store.state.system.logo
      if (sysLogo) {
        return sysLogo
      }
      return require(`@/assets/images/${DEFAULT_CONFIG.logo}`)
    }
  },
  async mounted() {
    const res = await this.$api.marketing.getDistributorList({
      page: 1,
      pageSize: 100,
      is_all: true
    })
    this.storeList = res.list
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.sp-finder-actions__wrap) {
  justify-content: center !important;
}
</style>
