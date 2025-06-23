<template>
  <div class="flex flex-col h-full bg-gray-50">
    <LayoutHeader>
      <SpImage class="ml-5" :src="logo" height="26" fit="contain" />
      <div class="light flex h-full items-center text-xl ml-2 text-[#333]">店铺列表</div>
    </LayoutHeader>
    <div class="flex-1 w-[1000px] mx-auto pt-10">
      <SpFinder no-selection :show-pager="false" :setting="setting" :data="storeList" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { createSetting } from '@shopex/finder'
import { LayoutHeader } from '@/layout/basic'
import DEFAULT_CONFIG from '@/config'

export default {
  components: {
    LayoutHeader
  },
  data() {
    return {
      setting: createSetting({
        columns: [
          { name: '店铺名称', key: 'name' },
          {
            name: '是否启用',
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
                row.is_valid == 'true' ? '启用' : '禁用'
              )
            }
          },
          { name: '店铺地址', key: 'store_address' },
          {
            name: '创建时间',
            key: 'created',
            width: 180,
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        ],
        actions: [
          {
            name: '进入店铺',
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
                  window.location.href = '/shopadmin'
                } else {
                  this.$message.error('进入店铺失败，请稍后重试')
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
    logo: () => {
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
