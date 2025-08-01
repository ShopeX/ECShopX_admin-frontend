<style lang="scss">
.daodianziti {
  line-height: normal;
  margin-top: 13px;
}
</style>
<template>
  <div class="daodianziti">
    <el-button type="text" @click="onSelectZiti">选择自提点</el-button>
    <SpFinder
      ref="finder"
      no-selection
      :front-paging="frontPage"
      :data="finderData"
      :url="finderUrl"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
export default {
  name: 'DaoDianZiti',
  data() {
    return {
      distributor_id: '',
      zitiList: [],
      finderData: [],
      finderUrl: '',
      frontPage: true,
      setting: createSetting({
        actions: [
          {
            name: '移除',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                if (this.distributor_id) {
                  await this.$api.pickuplocation.unbindZitiLocation({
                    id: row.id,
                    rel_distributor_id: this.distributor_id
                  })
                  this.$refs['finder'].refresh()
                } else {
                  const index = this.finderData.findIndex(item => item.id == row.id)
                  this.finderData.splice(index, 1)
                  this.zitiList = this.finderData
                  this.$nextTick(() => {
                    this.$refs['finder'].refresh()
                  })
                }
              }
            }
          }
        ],
        columns: [
          { name: '自提点名称', key: 'name' },
          {
            name: '地址',
            render: (h, { row }) =>
              h('span', {}, `${row.province}${row.city}${row.area}${row.address}`)
          },
          { name: '联系电话', key: 'contract_phone', width: '150px' }
        ]
      })
    }
  },
  created() {
    const { distributor_id } = this.$route.query
    if (distributor_id) {
      this.finderUrl = '/pickuplocation/list'
      this.finderData = undefined
      this.frontPage = false
      this.distributor_id = distributor_id
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        rel_distributor_id: this.distributor_id
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      this.zitiList = list
    },
    async onSelectZiti() {
      const { data } = await this.$picker.zitiList({
        data: this.zitiList.map(item => item.id)
      })

      if (this.distributor_id) {
        const ids = data.map(item => item.id)
        await this.$api.pickuplocation.bindZitiLocation({
          id: ids,
          rel_distributor_id: this.distributor_id
        })
        this.$refs['finder'].refresh()
      } else {
        this.finderData = data
        this.zitiList = data
        this.$nextTick(() => {
          this.$refs['finder'].refresh()
        })
      }
    }
  }
}
</script>
