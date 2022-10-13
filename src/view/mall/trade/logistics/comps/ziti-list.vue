<style lang="scss" scoped>
.action-container {
  margin-bottom: 0;
}
</style>
<template>
  <div class="ziti-list">
    <div class="action-container">
      <el-button type="primary" @click="createZitiAddress"> 新增自提点 </el-button>
    </div>

    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="region" label="自提点地址:">
        <el-cascader
          ref="region"
          v-model="formData.region"
          filterable
          clearable
          placeholder="选择地区筛选"
          :options="district"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="keywords" label="自提点名称:">
        <el-input v-model="formData.keywords" placeholder="自提点名称关键词" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      url="/pickuplocation/list"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import district from '@/common/district.json'
import { getRegionNameById } from '@/utils'
export default {
  name: 'ZitiList',
  data() {
    return {
      formData: {
        region: [],
        keywords: ''
      },
      district,
      setting: createSetting({
        actions: [
          {
            name: '编辑',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.$router.push({
                  path: `/order/entitytrade/logistics/addziti/${row.id}`
                })
              }
            }
          },
          {
            name: '删除',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认删除？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                await this.$api.pickuplocation.deleteZitiLocation(row.id)
                this.$refs['finder'].refresh()
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
          {
            name: '联系电话',
            key: 'contract_phone'
          }
          // {
          //   name: '绑定店铺',
          //   key: 'created_at'
          // }
        ]
      })
    }
  },
  created() {},
  mounted() {
    this.$EventBus.$on('event.zitilist.refresh', () => {
      this.$refs['finder'].refresh()
    })
  },
  methods: {
    beforeSearch(params) {
      const { region } = this.formData
      const [province, city, area] = getRegionNameById(region, district)
      const _params = {
        ...params,
        name: this.formData.keywords,
        province: province,
        city: city,
        area: area
      }

      return _params
    },
    onSearch() {
      this.$refs['finder'].refresh()
    },
    createZitiAddress() {
      this.$router.push({
        path: '/order/entitytrade/logistics/addziti'
      })
    }
  }
}
</script>
