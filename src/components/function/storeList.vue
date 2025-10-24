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
<template>
  <div>
    <el-dialog
      title="选择店铺"
      :visible.sync="showModal"
      width="600px"
      append-to-body
      :before-close="handleClose"
    >
      <div class="content-bottom-padded">
        <el-input
          v-model="params.name"
          placeholder="店铺名称"
          clearable
          style="width: 240px"
          @clear="handleClear"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleKeySearch" />
        </el-input>
        <el-cascader
          v-model="checkedRegions"
          placeholder="根据地区筛选"
          :options="regions"
          filterable
          clearable
          :props="{ checkStrictly: true }"
          @change="handleRegionSearch"
        />
      </div>
      <div class="infinite-list-wrapper">
        <ul v-infinite-scroll="fetch" class="store-list" infinite-scroll-disabled="disabled">
          <li
            v-for="item in list"
            :key="item.id"
            class="store-list-item"
            :class="
              multiple
                ? current && current.findIndex(cur => cur.id === item.id) !== -1
                  ? 'active'
                  : ''
                : current.id === item.id
                ? 'active'
                : ''
            "
            @click="handleItemClick(item)"
          >
            <div class="store-name">
              {{ item.name }}
            </div>
            <div class="store-address">
              {{ item.address }}
            </div>
          </li>
        </ul>
        <div v-if="loading" class="content-padded content-center">
          <i class="el-icon-loading" /> 加载中...
        </div>
        <div v-if="noMore" class="content-padded content-center muted">没有更多了</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import district from '@/common/district.json'

export default {
  props: {
    data: [],
    multiple: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false,
      loading: false,
      params: {
        page: 0,
        pageSize: 10,
        name: '',
        province: '',
        city: '',
        area: '',
        is_valid: true
      },
      total: 0,
      list: [],
      checkedRegions: '',
      regions: district,
      current: '',
      checked: ''
    }
  },
  computed: {
    noMore() {
      return this.params.page >= Math.ceil(this.total / this.params.pageSize)
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    data(val) {
      if (val.id) {
        this.checked = val
      } else {
        this.checked = ''
      }
    },
    visible(val) {
      if (val) {
        this.showModal = val
        this.resetFilter()
        if (this.data.length > 0) {
          this.current = [this.data]
        }
        this.fetch()
      }
    }
  },
  mounted() {
    this.handleKeySearch()
  },
  methods: {
    handleKeySearch() {
      this.params.page = 0
      this.fetch()
      this.list = []
    },
    handleRegionSearch(value) {
      var vals = this.getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.params.province = vals[0].label
        this.params.city = ''
        this.params.area = ''
      } else if (vals.length == 2) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = ''
      } else if (vals.length == 3) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = vals[2].label
      } else {
        this.params.province = ''
        this.params.city = ''
        this.params.area = ''
      }
      this.params.page = 0
      this.fetch()
    },
    handleClear() {
      this.params.page = 0
      this.fetch()
    },
    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    handleItemClick(val) {
      if (this.multiple) {
        const checkedIdx = this.current.findIndex(item => item.id === val.id)
        if (checkedIdx === -1) {
          this.current.push(val)
        } else {
          this.current.splice(checkedIdx, 1)
        }
      } else {
        this.current = val
      }
    },
    handleConfirm() {
      this.$emit('change', this.current)
      this.showModal = false
    },
    handleClose() {
      this.showModal = false
      this.$emit('onClose')
    },
    async fetch() {
      this.loading = true
      this.params.page += 1
      const { list, total_count } = await api.marketing.getDistributorList(this.params)
      let _list = []
      list.map(item => {
        let tags = []
        item.tagList.map(tag => {
          tags.push({
            id: tag.tag_id,
            name: tag.tag_name
          })
        })
        _list.push({
          id: item.distributor_id,
          name: item.name,
          address: item.store_address,
          logo: item.logo,
          tags
        })
      })
      this.$emit('changeStore', _list)
      this.list = [...this.list, ..._list]
      this.total = total_count
      this.loading = false
    },
    resetFilter() {
      this.params.page = 0
      this.params.name = ''
      this.params.province = ''
      this.params.city = ''
      this.params.area = ''
      if (this.multiple) {
        this.current = []
      } else {
        this.current = ''
      }
      this.checkedRegions = []
      this.list = []
    }
  }
}
</script>

<style scoped lang="scss">
.finder {
  margin-bottom: 20px;
}
.store-picker {
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 3px;
  &:hover {
    background: #f5f7fa;
  }
  .store-info {
    padding-right: 20px;
  }
  .iconfont {
    margin-left: 10px;
  }
}
.infinite-list-wrapper {
  height: 360px;
  overflow-y: auto;
}
.store-list {
  padding: 10px;
  .store-list-item {
    padding: 10px 15px;
    margin-bottom: 5px;
    cursor: pointer;
    border-radius: 6px;
    &:hover {
      background: #f5f7fa;
    }
    &.active {
      background: #ecf5ff;
      box-shadow: 0 0 0 1px #b5dafb;
    }
  }
}
.store-name {
  @include text-overflow();
  font-size: 16px;
  color: #333;
}
.store-address {
  @include text-overflow();
  font-size: 12px;
  color: #999;
}
.content-bottom-padded {
  display: flex;
  justify-content: space-around;
}
</style>
