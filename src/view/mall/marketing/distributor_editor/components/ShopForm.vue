<style lang="scss">
.shop-location {
  .el-form-item__content {
    width: auto !important;
  }
  .el-input {
    width: 180px;
  }
  .separator {
    margin: 0 3px;
  }
  .regions {
    margin-right: 10px;
  }
  .address {
    width: 500px;
    margin-right: 10px;
  }
}
.bm-view {
  width: 100%;
  height: 300px;
}
#qqmap_rslist {
  border-right: 1px solid #e7e7eb;
}
#qqmap_container {
  float: left;
  width: 800px;
  height: 400px;
}
</style>
<template>
  <el-card class="shop-location el-card--normal">
    <div slot="header">
      <div>
        店铺位置<span class="frm-tips">
          （店铺定位后保存店铺经纬度，才可以开启自提，否则店铺不支持自提功能）
        </span>
      </div>
    </div>
    <el-form label-width="120px">
      <el-form-item class="form-item-region" label="店铺经纬度">
        <el-input v-model="content.baseForm.lng" readonly placeholder="经度" />
        <span class="separator">-</span>
        <el-input v-model="content.baseForm.lat" readonly placeholder="纬度" />
      </el-form-item>

      <el-form-item class="form-item-region" label="地理位置">
        <el-cascader v-model="content.baseForm.regions_id" class="regions" :options="regions" />
        <el-input
          v-model="content.baseForm.address"
          class="address"
          placeholder="请输入详细地址（去除省市县）"
        />
        <el-button type="primary" @click="searchKeyword()"> 搜索定位 </el-button>
      </el-form-item>

      <el-form-item>
        <div id="qqmap_container" />
      </el-form-item>

      <div v-show="qqmap_infowin_flag" id="qqmap_infowin">
        <el-col>
          <el-button type="primary" @click="importPosition(poi_info)"> 导入该位置信息 </el-button>
        </el-col>
        <el-col>{{ poi_info.name }}</el-col>
        <div class="frm-tips">
          {{ poi_info.address }}
        </div>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import district from '@/common/district.json'
import { getRegionauth } from '@/api/regionauth'
import { getDistributorInfo } from '@/api/marketing'

// 取选中地区的值
function getCascaderObj(val, opt) {
  return val.map(function (value, index, array) {
    for (var itm of opt) {
      if (itm.value === value) {
        opt = itm.children
        return itm
      }
    }
    return null
  })
}

export default {
  inject: ['content'],
  data() {
    return {
      regions: district,
      typeList: [],
      regionauthList: [],
      searchService: [],
      searchRegion: '',
      markers: [],
      poi_info: [],
      qqmap_infowin_flag: false
    }
  },
  mounted() {
    this.getRegionauthList()

    // if (this.distributor_id || this.$store.getters.login_type == 'distributor') {
    //   getDistributorInfo({ distributor_id: this.distributor_id }).then((res) => {
    //     let formData = res.data.data
    //     this.form = res.data.data

    //     this.$emit('onChangeData', 'form', formData)

    //     if (
    //       this.form.regions[0] == '北京市' ||
    //       this.form.regions[0] == '天津市' ||
    //       this.form.regions[0] == '上海市' ||
    //       this.form.regions[0] == '重庆市'
    //     ) {
    //       this.searchRegion = this.form.regions[0] + this.form.regions[2]
    //     } else {
    //       this.searchRegion = this.form.regions[0] + this.form.regions[1] + this.form.regions[2]
    //     }

    //     if (!this.form.lat) {
    //       this.qqmapinit(39.916527, 116.397128)
    //     } else {
    //       this.qqmapinit(this.form.lat, this.form.lng)
    //     }
    //     this.$emit('onChangeData', 'disabled', formData.shop_code ? true : false)
    //     this.$emit('initForm', formData)
    //   })
    // } else {
    //   // 添加门店时初始化地图
    //   this.qqmapinit(39.916527, 116.397128)
    // }
    // let distributor_type = this.$route.query.distributor_type

    // this.$emit('onChangeData', 'distributor_type', distributor_type)
    // if (distributor_type) {
    //   this.form.distributor_self = 1
    // }
  },
  methods: {
    clearOverlays: function (overlays) {
      //清除地图上的marker
      var overlay
      while ((overlay = overlays.pop())) {
        overlay.setMap(null)
      }
    },
    qqmapinit: function (lat, lng) {
      console.log('lat：' + lat)
      console.log('lng：' + lng)

      // var center = new qq.maps.LatLng(39.916527, 116.397128);
      var center = new qq.maps.LatLng(lat, lng)
      var map = new qq.maps.Map(document.getElementById('qqmap_container'), {
        center: center,
        zoom: 13
      })
      //创建marker
      new qq.maps.Marker({
        position: center,
        map: map
      })
      var that = this
      //设置Poi检索服务，用于本地检索、周边检索
      this.searchService = new qq.maps.SearchService({
        panel: document.getElementById('qqmap_rslist'),
        //检索成功的回调函数
        complete: function (results) {
          //设置回调函数参数
          var pois = results.detail.pois
          var infoWin = new qq.maps.InfoWindow({
            map: map
          })
          if (!pois) {
            return that.$message.error('您输入的位置有误')
          }
          var latlngBounds = new qq.maps.LatLngBounds()
          for (var i = 0, l = pois.length; i < l; i++) {
            var poi = pois[i]
            //扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng)
            ;(function (n) {
              var marker = new qq.maps.Marker({
                map: map
              })
              marker.setPosition(pois[n].latLng)

              marker.setTitle(i + 1)
              that.markers.push(marker)
              qq.maps.event.addListener(marker, 'click', function () {
                infoWin.open()
                that.qqmap_infowin_flag = true

                that.poi_info = pois[n] //将选点位置信息存入poi_info
                infoWin.setContent(document.getElementById('qqmap_infowin'))
                infoWin.setPosition(pois[n].latLng)
                that.content.baseForm.address = pois[n].name
                console.log(pois[n])
              })
            })(i)
          }
          map.fitBounds(latlngBounds)
        },
        //若服务请求失败，则运行以下函数
        error: function () {
          this.$message({
            message: '未查询到数据',
            type: 'error'
          })
        }
      })
    },
    async getRegionauthList() {
      const { list } = await this.$api.regionauth.getRegionauth()
      this.regionauthList = list
    },
    searchKeyword: function () {
      //设置搜索的范围和关键字等属性
      const { regions_id, address } = this.content.baseForm
      if (regions_id.length == 0) {
        this.$message.error('请选择地区')
        return
      }
      if (!address) {
        this.$message.error('请输入具体位置')
        return
      }

      const provice = district.find(item => item.value == regions_id[0])
      const city = provice.children.find(item => item.value == regions_id[1])
      const country = city.children.find(item => item.value == regions_id[2])

      let region = ''
      let newRegion = ''
      // 直辖市
      if (['110000', '120000', '310000', '500000'].indexOf(provice.value) > -1) {
        region = `${provice.label}${country.label}`
        newRegion = `${provice.label}`
      } else {
        region = `${provice.label}${city.label}${country.label}`
        newRegion = `${provice.label}${city.label}`
      }

      this.clearOverlays(this.markers)
      //根据输入的城市设置搜索范围
      console.log(region)
      console.log(newRegion)
      this.searchService.setLocation(newRegion) //设置省市区
      //设置搜索页码
      this.searchService.setPageIndex(0)
      //设置每页的结果数
      this.searchService.setPageCapacity(5)
      //根据输入的关键字在搜索范围内检索
      console.log(address)
      this.searchService.search(address)
    },
    importPosition: function ({ latLng, name }) {
      console.log(latLng, name)
      this.content.baseForm.lng = latLng.lng
      this.content.baseForm.lat = latLng.lat
      this.content.baseForm.address = name
    }
  }
}
</script>
