<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
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
          { name: '页面名称', key: 'title' }
        ]
      }"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerPages',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择页面'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: ''
      },
      list: [
        { id: 'vipgrades', title: '会员开通' },
        { id: 'applyChief', title: '社区团长申请' },
        { id: 'recharge', title: '储值卡' },
        { id: 'purchase', title: '内购' },
        { id: 'pointShop', title: '积分商城' },
        { id: 'registActivity', title: '报名活动' },
        { id: 'group', title: '我的拼团' },
        { id: 'coupon_list', title: '优惠券' },
        { id: 'my_collect', title: '我的收藏' },
        { id: 'address', title: '地址管理' },
        { id: 'groups_list', title: '限时团购' },
        { id: 'hottopic', title: '种草列表' },
        { id: 'zitiOrder', title: '自提订单' },
        { id: 'customerService', title: '客服' },
        { id: 'homeSearch', title: '搜索' },
        { id: 'settings', title: '设置' }
      ],
      multiple: this.value?.multiple ?? true
    }
  },
  created() {},
  mounted() {
    if (!this.VERSION_PLATFORM() && !this.VERSION_B2C()) {
      // 平台版&b2c隐藏助力活动和助力订单
      this.list.push(
        { id: 'boost_activity', title: '助力活动' },
        { id: 'boost_order', title: '助力订单' }
      )
    }
    if (!this.VERSION_STANDARD()) {
      this.list.push({ id: 'tenants', title: '商家入驻' })
    }
    if (!this.VERSION_IN_PURCHASE()) {
      this.list.push({ id: 'community_group_enable', title: '社区团购（H5不支持）' })
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
