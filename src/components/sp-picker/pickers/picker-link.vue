<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-link {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .sp-finder {
    &.no-multiple {
      .sp-finder-bd {
        .el-table__fixed-header-wrapper {
          table thead {
            tr {
              th {
                &:nth-child(1) {
                  .el-checkbox {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
      .el-table__fixed-body-wrapper {
        top: 38px !important;
      }
    }
  }
  .el-pagination {
    margin: 0;
    padding: 10px;
  }
}
</style>
<template>
  <div class="picker-link">
    <SpFinder
      ref="finder"
      :show-pager="false"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': '580px'
      }"
      :data="list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'id', width: 120 },
          { name: $t('223cc8af.b78454'), key: 'title' }
        ]
      }"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import BasePicker from './base'
import PageMixin from '../mixins/page'

const BASE_LINK_PAGES = [
  { id: 'vipgrades', titleKey: '223cc8af.f035ca' },
  { id: 'applyChief', titleKey: '223cc8af.38d966' },
  { id: 'recharge', titleKey: '223cc8af.1200d5' },
  { id: 'purchase', titleKey: '223cc8af.d0465c' },
  { id: 'pointShop', titleKey: '223cc8af.a13364' },
  { id: 'registActivity', titleKey: '223cc8af.7fb92b' },
  { id: 'group', titleKey: '223cc8af.75a1d2' },
  { id: 'coupon_list', titleKey: '223cc8af.2f3635' },
  { id: 'my_coupon', titleKey: '223cc8af.a8f3e2' },
  { id: 'my_collect', titleKey: '223cc8af.975ff6' },
  { id: 'address', titleKey: '223cc8af.bca1ea' },
  { id: 'groups_list', titleKey: '223cc8af.f38e72' },
  { id: 'hottopic', titleKey: '223cc8af.26b2d6' },
  { id: 'zitiOrder', titleKey: '223cc8af.d50361' },
  { id: 'homeSearch', titleKey: '223cc8af.e5f71f' },
  { id: 'settings', titleKey: '223cc8af.e366cc' },
  { id: 'kujiale', titleKey: '223cc8af.f2d3e5' },
  { id: 'nearby_store', titleKey: '223cc8af.3b02dd' },
  { id: 'itemList', titleKey: '223cc8af.437974' }
]

function mapPageTitles(vm, items) {
  return items.map(({ id, titleKey }) => ({
    id,
    title: vm.$t(titleKey)
  }))
}

export default {
  name: 'PickerLink',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: i18n.t('223cc8af.a4895e')
  },
  props: ['value'],
  created() {
    this.$options.config.title = this.$t('223cc8af.a4895e')
  },
  data() {
    return {
      formData: {
        keywords: ''
      },
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    list() {
      // 依赖 locale，切换语言后页面名称会重新翻译
      const locale = this.$i18n?.locale
      void locale

      if (this.value?.guide === 'share_page') {
        return mapPageTitles(this, [
          { id: 'coupon_list', titleKey: '223cc8af.9c356b' },
          { id: 'my_coupon', titleKey: '223cc8af.a8f3e2' },
          { id: 'page_index', titleKey: '223cc8af.db1c89' },
          { id: 'category', titleKey: '223cc8af.d0771a' },
          { id: 'hottopic', titleKey: '223cc8af.26b2d6' }
        ])
      }

      const items = [...BASE_LINK_PAGES]
      if (!this.VERSION_PLATFORM() && !this.VERSION_B2C()) {
        items.push(
          { id: 'boost_activity', titleKey: '223cc8af.5c34aa' },
          { id: 'boost_order', titleKey: '223cc8af.94b1e6' }
        )
      }
      if (!this.VERSION_STANDARD()) {
        items.push({ id: 'tenants', titleKey: '223cc8af.1107a8' })
      }
      if (!this.VERSION_IN_PURCHASE()) {
        items.push({ id: 'community_group_enable', titleKey: '223cc8af.d0f121' })
      }
      return mapPageTitles(this, items)
    }
  },
  mounted() {
    const raw = this.value?.data
    if (raw == null || raw === '') return
    const selectedIds = Array.isArray(raw) ? raw : [raw]
    const selectRows = this.list.filter((item) => selectedIds.map(String).includes(String(item.id)))
    if (!selectRows.length) return
    const finderTable = this.$refs.finder?.$refs?.finderTable
    if (!finderTable?.$refs?.finderTable) return
    setTimeout(() => {
      finderTable.$refs.finderTable.setSelection(selectRows)
    })
  },
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelect(selection, row) {
      if (this.multiple) {
        // this.updateVal(selection)
      } else {
        const { finderTable } = this.$refs.finder.$refs
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
