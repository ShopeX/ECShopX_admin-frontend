<style lang="scss" scoped>
.ziti-tip {
  border: 1px solid #7db3f2;
  border-radius: 4px;
  color: #0d4888;
  padding: 4px 6px;
  background-color: #e6f0ff;
  font-size: 12px;
}
.action-container {
  margin-bottom: 0;
  margin-top: 10px;
}
</style>
<template>
  <div class="ziti-list">
    <div class="ziti-tip">
      一个自提点仅可被一个店铺绑定使用；每个店铺可绑定多个自提点，绑定至同一店铺的自提点共享该店铺库存。
    </div>
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
          },
          {
            name: '绑定店铺',
            key: 'rel_distributor_name',
            render: (h, { row }) => {
              return (
                <div>
                  <span>{row.rel_distributor_name || ''}</span>
                  {/* {!row.rel_distributor_name && ( */}
                  <el-button
                    slot='reference'
                    type='text'
                    onClick={this.onSelectStore.bind(this, row)}
                  >
                    <i class='el-icon-edit' />
                  </el-button>
                  {/* )} */}
                </div>
              )
            }
          }
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
    },
    onShowPopover() {},
    onBindStore() {},
    async onSelectStore({ id }) {
      const { data } = await this.$picker.shop({
        data: this.value,
        multiple: false
      })
      if (data.length > 0) {
        const [distributor] = data
        const { distributor_id } = distributor
        distributor_id
        await this.$api.pickuplocation.bindZitiLocation({
          id,
          rel_distributor_id: distributor_id
        })
        this.$refs['finder'].refresh()
      }
    }
  }
}
</script>
