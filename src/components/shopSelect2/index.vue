<style scoped lang="scss">
.no-shop {
  display: inline-block;
  height: 37px;
  line-height: 37px;
  box-shadow: 0 0 0 1px #dcdfe6;
  border-radius: 3px;
  cursor: no-drop;
}
</style>
<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-cascader
      v-model="selected_params.regions_value"
      :size="size"
      class="input-m"
      placeholder="根据地区筛选"
      :options="regions"
      filterable
      :props="{ checkStrictly: true }"
      @change="RegionChangeSearch"
    />
    <el-select
      v-if="exist_shop"
      v-model="selected_params.shop_id"
      v-scroll="handleScroll"
      :size="size"
      class="input-m"
      :placeholder="desc"
      filterable
      remote
      :remote-method="remoteMethod"
      clearable
      @change="() => this.$emit('performInitChange')"
    >
      <el-option
        v-for="item in list"
        v-if="wxshops"
        :key="item.wxShopId"
        :label="item.storeName"
        :value="item.wxShopId"
      />
      <el-option
        v-for="item in list"
        v-if="distributors"
        :key="item.distributor_id"
        :label="item.name"
        :value="item.distributor_id"
      />
    </el-select>
    <span v-else class="input-m content-center muted no-shop">暂无符合要求的店铺</span>
    <!-- <el-button @click="init">重置</el-button> -->
  </div>
</template>
<script>
import district from '@/common/district.json'
import { shoplistMixin } from '@/mixins/fetchShoplist'
export default {
  mixins: [shoplistMixin],
  props: {
    shopIdDefault: {
      type: String,
      default: ''
    },
    performInit: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  data() {
    return {
      list: [],
      regions: district,
      params: {
        page: 1,
        pageSize: 20,
        name: '',
        mobile: '',
        is_valid: 'true',
        province: '',
        city: '',
        area: ''
      },
      total: '',
      selected_params: {
        shop_id: this.shopIdDefault,
        regions_value: []
      },
      exist_shop: true
    }
  },

  watch: {
    'selected_params.shop_id': {
      handler(newVal, oldVal) {
        this.$emit('update', this.selected_params)
      },
      deep: true
    },
    shopIdDefault: {
      handler(newVal, oldVal) {
        this.selected_params.shop_id = newVal
      }
    },
    performInit: {
      handler(newVal, oldVal) {
        newVal && this.init()
      }
    }
  },
  mounted() {
    this.getList(true)
  },

  methods: {
    handleScroll(param) {
      let { pageSize, page } = this.params
      if (param && Math.ceil(this.total / pageSize) > page) {
        this.params.page++
        this.getList()
      }
    },

    RegionChangeSearch(value) {
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
      }
      this.params.page = 1
      this.selected_params.shop_id = ''
      this.$emit('performInitChange')
      this.getList(true)
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

    init() {
      this.params = {
        page: 1,
        pageSize: 30,
        name: '',
        mobile: '',
        is_valid: 'true',
        province: '',
        city: '',
        area: ''
      }
      this.regions = district
      this.selected_params.regions_value = []
      this.selected_params.shop_id = ''
      this.exist_shop = true
      this.getList(true)
      this.$emit('init')
    },

    remoteMethod(query) {
      this.params.name = query
      this.getList(true)
    }
  }
}
</script>
