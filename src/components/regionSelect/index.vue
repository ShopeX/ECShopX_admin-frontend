<template>
  <el-row>
    <el-cascader
      v-model="selected_values"
      placeholder="根据地区筛选"
      :options="regions"
      filterable
      :props="{ checkStrictly: true }"
      @change="RegionChangeSearch"
    />
  </el-row>
</template>
<script>
import { getAddress } from '@/api/common'
export default {
  props: {
    defaultAddress: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      regions: [],
      params: {
        province: '',
        city: '',
        area: '',
        regions_id: [],
        regions: []
      },
      total: '',
      selected_values: JSON.parse(JSON.stringify(this.defaultAddress))
    }
  },
  mounted() {
    this.getDistrict()
  },
  methods: {
    getDistrict() {
      getAddress().then(({ data }) => {
        this.regions = data.data
        this.RegionChangeSearch(this.selected_values)
      })
    },
    RegionChangeSearch(value) {
      if (this.regions.length == 0) return
      this.params.regions = []
      var vals = this.getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.params.province = vals[0].label
        this.params.city = ''
        this.params.area = ''
        this.params.regions[0] = vals[0].label
      } else if (vals.length == 2) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = ''
        this.params.regions = [vals[0].label, vals[1].label]
      } else if (vals.length == 3) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = vals[2].label
        this.params.regions = [vals[0].label, vals[1].label, vals[2].label]
      }
      this.params.page = 1
      this.params.regions_id = value
      this.$emit('change', this.params)
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
      this.selected_values = []
    }
  }
}
</script>
