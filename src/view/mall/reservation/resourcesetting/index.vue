<template>
  <div>
    <el-tabs
      v-if="$route.path.indexOf('editor') === -1"
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="排班管理" name="settingMange">
        <work-shift
          :is-load="settingMangeLoad"
          :shop-list-data="shopListData"
          :resource-name="resourceName"
        />
      </el-tab-pane>
      <el-tab-pane :label="resourceName + '列表'" name="reservationModel">
        <resource-list
          ref="resource"
          :is-load="resouceLoad"
          :shop-list-data="shopListData"
          :resource-name="resourceName"
        />
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>
<script>
import resourceList from './list.vue'
import workShift from './workshift.vue'
import { getSetting } from '../../../../api/reservation'
//import { getWxShopsList } from '../../../api/shop'
export default {
  provide() {
    return {
      refresh: this.getList
    }
  },
  components: {
    resourceList,
    workShift
  },
  data() {
    return {
      activeName: 'settingMange',
      resourceName: '',
      shopListData: '',
      //shopIdData:'',
      resouceLoad: false,
      settingMangeLoad: true
    }
  },
  mounted() {
    getSetting().then(res => {
      if (res.data.data.resourceName) {
        this.resourceName = res.data.data.resourceName
      } else {
        this.resourceName = '资源位'
      }
    })

    // let params = {page: 1, pageSize: 50}
    // getWxShopsList(params).then(response => {
    //   this.shopListData = response.data.data.list
    //   if (this.shopIdData == '' && this.shopListData[0].wxShopId) {
    //     this.shopIdData = this.shopListData[0].wxShopId
    //   }
    // })
  },
  methods: {
    handleClick() {
      if (this.activeName == 'reservationModel') {
        this.resouceLoad = true
        this.settingMangeLoad = false
      } else if (this.activeName == 'settingMange') {
        this.resouceLoad = false
        this.settingMangeLoad = true
      }
    },
    getList() {
      this.$refs.getLevelList
      this.$refs.getStoreList
    }
  }
}
</script>
