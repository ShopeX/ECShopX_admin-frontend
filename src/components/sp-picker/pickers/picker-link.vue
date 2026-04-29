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
    <!-- <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入页面名称" />
      </SpFilterFormItem>
    </SpFilterForm> -->
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
export default {
  name: 'PickerPages',
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
      list: [
        { id: 'vipgrades', title: this.$t('223cc8af.f035ca') },
        { id: 'applyChief', title: this.$t('223cc8af.38d966') },
        { id: 'recharge', title: this.$t('223cc8af.1200d5') },
        { id: 'purchase', title: this.$t('223cc8af.d0465c') },
        { id: 'pointShop', title: this.$t('223cc8af.a13364') },
        { id: 'registActivity', title: this.$t('223cc8af.7fb92b') },
        { id: 'group', title: this.$t('223cc8af.75a1d2') },
        { id: 'coupon_list', title: this.$t('223cc8af.2f3635') },
        { id: 'my_collect', title: this.$t('223cc8af.975ff6') },
        { id: 'address', title: this.$t('223cc8af.bca1ea') },
        { id: 'groups_list', title: this.$t('223cc8af.f38e72') },
        { id: 'hottopic', title: this.$t('223cc8af.26b2d6') },
        { id: 'zitiOrder', title: this.$t('223cc8af.d50361') },
        { id: 'homeSearch', title: this.$t('223cc8af.e5f71f') },
        { id: 'settings', title: this.$t('223cc8af.e366cc') },
        { id: 'kujiale', title: this.$t('223cc8af.f2d3e5') },
        { id: 'nearby_store', title: this.$t('223cc8af.3b02dd') },
        { id: 'nearby_store', title: this.$t('223cc8af.3b02dd') },
        { id: 'itemList', title: '商品列表' }
      ],
      multiple: this.value?.multiple ?? true
    }
  },
  mounted() {
    if (!this.VERSION_PLATFORM() && !this.VERSION_B2C()) {
      // 平台版&b2c隐藏助力活动和助力订单
      this.list.push(
        { id: 'boost_activity', title: this.$t('223cc8af.5c34aa') },
        { id: 'boost_order', title: this.$t('223cc8af.94b1e6') }
      )
    }
    if (!this.VERSION_STANDARD()) {
      this.list.push({ id: 'tenants', title: this.$t('223cc8af.1107a8') })
    }
    if (!this.VERSION_IN_PURCHASE()) {
      this.list.push({ id: 'community_group_enable', title: this.$t('223cc8af.d0f121') })
    }
    if (this.value.guide == 'share_page') {
      this.list = [
        { id: 'coupon_list', title: this.$t('223cc8af.9c356b') },
        { id: 'page_index', title: this.$t('223cc8af.db1c89') },
        { id: 'category', title: this.$t('223cc8af.d0771a') },
        { id: 'hottopic', title: this.$t('223cc8af.26b2d6') }
      ]
    }
    if (this.value.data) {
      const selectRows = this.list.filter((item) => this.value.data.includes(item.id))
      const { finderTable } = this.$refs.finder.$refs
      setTimeout(() => {
        finderTable.$refs.finderTable.setSelection(selectRows)
      })
    }
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
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
          // this.updateVal([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
