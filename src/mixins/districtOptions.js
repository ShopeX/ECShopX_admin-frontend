let cache = null
let pending = null

export function fetchDistrict(vm) {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = vm.$api.common
      .getAddress()
      .then((res) => {
        cache = Array.isArray(res) ? res : []
        return cache
      })
      .catch((err) => {
        pending = null
        throw err
      })
  }
  return pending
}

export default {
  data() {
    return {
      district: [],
      regions: []
    }
  },
  created() {
    this.loadDistrictOptions()
  },
  methods: {
    loadDistrictOptions() {
      return fetchDistrict(this).then((list) => {
        this.district = list
        this.regions = list
        if (Array.isArray(this.area)) {
          this.area = list
        }
        return list
      })
    }
  }
}
