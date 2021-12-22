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
          placeholder="店铺名称"
          v-model="params.name"
          clearable
          @clear="handleClear"
          style="width: 240px;"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleKeySearch"></el-button>
        </el-input>
        <el-cascader
          v-model="checkedRegions"
          placeholder="根据地区筛选"
          :options="regions"
          filterable
          clearable
          :props="{ checkStrictly: true }"
          @change="handleRegionSearch"
        ></el-cascader>
      </div>
      <div class="infinite-list-wrapper">
        <ul class="store-list" v-infinite-scroll="fetch" infinite-scroll-disabled="disabled">
          <li
            class="store-list-item"
            v-for="item in list"
            :key="item.id"
            @click="handleItemClick(item)"
            :class="
              multiple? (current && current.findIndex((cur) => cur.id === item.id) !== -1? 'active': ''): (current.id === item.id? 'active': '')
            "
          >
            <div class="store-name">{{ item.name }}</div>
            <div class="store-address">{{ item.address }}</div>
          </li>
        </ul>
        <div class="content-padded content-center" v-if="loading">
          <i class="el-icon-loading"></i> 加载中...
        </div>
        <div class="content-padded content-center muted" v-if="noMore">没有更多了</div>
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
        this.current = [this.data]
        this.fetch()
      }
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
      return val.map(function(value, index, array) {
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
        const checkedIdx = this.current.findIndex((item) => item.id === val.id)
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
    fetch() {
      this.loading = true
      this.params.page += 1
      api.marketing.getDistributorList(this.params).then((res) => {
        let list = []
        res.data.data.list.map((item) => {
          let tags = []
          item.tagList.map((tag) => {
            tags.push({
              id: tag.tag_id,
              name: tag.tag_name
            })
          })
          list.push({
            id: item.distributor_id,
            name: item.name,
            address: item.store_address,
            logo: item.logo,
            tags
          })
        })
        this.list = [...this.list, ...list]
        this.total = res.data.data.total_count
        this.loading = false
      })
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
