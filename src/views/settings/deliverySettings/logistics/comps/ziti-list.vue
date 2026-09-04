<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.ziti-tip {
  border: 1px solid #7db3f2;
  border-radius: 4px;
  color: #0d4888;
  padding: 4px 6px;
  background-color: #e6f0ff;
  font-size: 12px;
}
</style>
<template>
  <div class="ziti-list">
    <div class="ziti-tip">
      {{ $t('2c67fb39.ba3778') }}
    </div>

    <SpFormPlus
      v-model="formData"
      form-type="searchForm"
      :form-items="formItems"
      :inline="true"
      @submit="onSearch"
      @reset="onSearch"
    />

    <div class="action-container mt-5">
      <el-button type="primary" @click="createZitiAddress">{{ $t('2c67fb39.57eecc') }}</el-button>
    </div>

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
import districtOptions from '@/mixins/districtOptions'
import { createSetting } from '@shopex-ui/finder'
import { getRegionNameById, VERSION_PLATFORM, IS_ADMIN, IS_DISTRIBUTOR } from '@/utils'
export default {
  mixins: [districtOptions],
  name: 'ZitiList',
  data() {
    return {
      formData: {
        region: [],
        keywords: ''
      },
      district: []
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'region',
          label: this.$t('2c67fb39.b73851'),
          component: ({ h, value, onInput, props }) => {
            return h('el-cascader', {
              props: {
                value: value,
                filterable: true,
                clearable: true,
                placeholder: this.$t('2c67fb39.3fc1b5'),
                options: props.options || [],
                size: 'small'
              },
              on: {
                input: onInput
              }
            })
          },
          componentProps: {
            options: this.district
          }
        },
        {
          fieldName: 'keywords',
          label: this.$t('2c67fb39.6b88c4'),
          component: 'input',
          formItemClass: 'keywords-field-close',
          componentProps: {
            placeholder: this.$t('2c67fb39.e48266'),
            size: 'default'
          }
        }
      ]
    },
    setting() {
      return createSetting({
        actions: [
          {
            name: this.$t('2c67fb39.95b351'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.getLogisticsBasePath()}/editor/${row.id}`
                })
              }
            }
          },
          {
            name: this.$t('2c67fb39.2f4aad'),
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('2c67fb39.b28efa'), this.$t('2c67fb39.02d981'), {
                  confirmButtonText: this.$t('2c67fb39.38cf16'),
                  cancelButtonText: this.$t('2c67fb39.625fb2')
                })
                await this.$api.pickuplocation.deleteZitiLocation(row.id)
                this.$refs['finder'].refresh()
              }
            }
          }
        ],
        columns: [
          { name: this.$t('2c67fb39.6b88c4'), key: 'name' },
          {
            name: this.$t('2c67fb39.765048'),
            render: (h, { row }) =>
              h('span', {}, `${row.province}${row.city}${row.area}${row.address}`)
          },
          {
            name: this.$t('2c67fb39.09a1f6'),
            key: 'contract_phone'
          },
          {
            name: this.$t('2c67fb39.7318a6'),
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
      const [province, city, area] = getRegionNameById(region, this.district)
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
    getLogisticsBasePath() {
      return this.$route.path.replace(/\/editor(?:\/.*)?$/, '')
    },
    createZitiAddress() {
      this.$router.push({
        path: `${this.getLogisticsBasePath()}/editor`
      })
    },
    onShowPopover() {},
    onBindStore() {},
    async onSelectStore({ id, rel_distributor_id }) {
      let params = {
        data: [rel_distributor_id],
        multiple: false
      }
      if (VERSION_PLATFORM() && IS_ADMIN()) {
        params = {
          ...params
          // distribution_type: 0
        }
      }
      const { data } = await this.$picker.shop(params)
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
