<template>
  <el-card>
    <div slot="header">
      <div style="display: flex; align-items: center">
        <div>店铺位置</div>
        <div class="frm-tips">
          （店铺定位后保存店铺经纬度，才可以开启自提，否则店铺不支持自提功能）
        </div>
      </div>
    </div>
    <el-row>
      <el-col :span="10">
        <el-form-item label="所属区域">
          <div>
            <el-select v-model="form.regionauth_id" placeholder="区域" style="width: 100%">
              <el-option
                v-for="(item, index) in regionauthList"
                :key="index"
                :label="item.regionauth_name"
                :value="item.regionauth_id"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item inline="true" label="店铺经纬度">
          <el-col :span="8">
            <el-input v-model="form.lng" readonly placeholder="经度"></el-input>
          </el-col>
          <el-col :span="4" class="content-center">-</el-col>
          <el-col :span="8">
            <el-input v-model="form.lat" readonly placeholder="纬度"></el-input>
          </el-col>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-form-item label="地理位置">
        <el-cascader
          v-model="form.regions_id"
          :options="regions"
          @change="handleRegionChange"
          style="width: 200px"
        ></el-cascader>
        <el-input
          v-model="form.address"
          id="keyword"
          placeholder="请输入详细地址（去除省市县）"
          style="width: 500px"
        ></el-input>
        <el-button type="primary" @click="searchKeyword()">搜索定位</el-button>
      </el-form-item>
    </el-row>

    <el-row>
      <el-col :span="20">
        <div id="qqmap_container"></div>
      </el-col>
    </el-row>

    <div id="qqmap_infowin" v-show="qqmap_infowin_flag">
      <el-col>
        <el-button type="primary" @click="imp_poi(poi_info)">导入该位置信息</el-button>
      </el-col>
      <el-col>{{ poi_info.name }}</el-col>
      <div class="frm-tips">{{ poi_info.address }}</div>
    </div>
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
  data() {
    const { regionauth_id, lng, lat, regions_id, address } = this.externalForm
    return {
      form: {
        regionauth_id: regionauth_id,
        lng: lng,
        lat: lat,
        regions_id: regions_id,
        address: address
      },
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
  props: ['externalForm'],
  // watch: {
  //   externalForm: {
  //     handler(val) {
  //       console.log("hander", val);
  //       if (val.regionauth_id) {
  //         this.form.regionauth_id = val.regionauth_id;
  //       }
  //       if (val.lng) {
  //         this.form.lng = val.lng;
  //       }
  //       if (val.lat) {
  //         this.form.lat = val.lat;
  //       }
  //       if (val.regions_id) {
  //         this.form.regions_id = val.regions_id;
  //       }
  //       if (val.regions) {
  //         this.form.regions = val.regions;
  //       }
  //       if (val.address) {
  //         debugger
  //         this.form.address = val.address;
  //       }
  //     },
  //     deep: true,
  //   },
  // },
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
                that.form.address = pois[n].name
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
    handleRegionChange: function (value) {
      var vals = getCascaderObj(value, this.regions)
      this.form.regions_id = []
      this.form.regions = []
      for (var i = 0; i < vals.length; i++) {
        this.form.regions_id[i] = vals[i].value
        this.form.regions[i] = vals[i].label
      }

      if (
        this.form.regions[0] == '北京市' ||
        this.form.regions[0] == '天津市' ||
        this.form.regions[0] == '上海市' ||
        this.form.regions[0] == '重庆市'
      ) {
        this.searchRegion = this.form.regions[0] + this.form.regions[2]
      } else {
        this.searchRegion = this.form.regions[0] + this.form.regions[1] + this.form.regions[2]
      }
    },
    getRegionauthList() {
      getRegionauth().then((res) => {
        this.regionauthList = res.data.data.list
      })
    },
    searchKeyword: function () {
      //设置搜索的范围和关键字等属性
      if (!this.searchRegion) {
        this.$message({
          message: '请选择地区',
          type: 'warning'
        })
        return ''
      }
      if (!this.form.address) {
        this.$message({
          message: '请输入具体位置',
          type: 'warning'
        })
        return ''
      }
      var region = this.searchRegion
      var keyword = this.form.address
      var pageIndex = 0
      var pageCapacity = 5
      this.clearOverlays(this.markers)
      //根据输入的城市设置搜索范围
      console.log(region)
      const newRegion = region.slice(0, region.indexOf('市') + 1)
      console.log(newRegion)
      // let region2 = '广东省东莞市'
      this.searchService.setLocation(newRegion) //设置省市区
      //设置搜索页码
      this.searchService.setPageIndex(pageIndex)
      //设置每页的结果数
      this.searchService.setPageCapacity(pageCapacity)
      //根据输入的关键字在搜索范围内检索
      console.log(keyword)
      this.searchService.search(keyword)
    },
    imp_poi: function (poi_info) {
      console.log(poi_info)
      // this.form.name = poi_info.name
      this.form.lng = poi_info.latLng.lng
      this.form.lat = poi_info.latLng.lat
      this.form.address = poi_info.name

      this.$emit('onChangeData', 'form', {
        lng: this.form.lng,
        lat: this.form.lat
      })
    }
  },
  mounted() {
    this.getRegionauthList()
    this.distributor_id = this.$route.query.distributor_id

    this.$emit('onChangeData', 'distributor_id', this.distributor_id)

    if (this.distributor_id || this.$store.getters.login_type == 'distributor') {
      getDistributorInfo({ distributor_id: this.distributor_id }).then((res) => {
        let formData = res.data.data
        this.form = res.data.data

        this.$emit('onChangeData', 'form', formData)

        if (
          this.form.regions[0] == '北京市' ||
          this.form.regions[0] == '天津市' ||
          this.form.regions[0] == '上海市' ||
          this.form.regions[0] == '重庆市'
        ) {
          this.searchRegion = this.form.regions[0] + this.form.regions[2]
        } else {
          this.searchRegion = this.form.regions[0] + this.form.regions[1] + this.form.regions[2]
        }

        if (!this.form.lat) {
          this.qqmapinit(39.916527, 116.397128)
        } else {
          this.qqmapinit(this.form.lat, this.form.lng)
        }
        this.$emit('onChangeData', 'disabled', formData.shop_code ? true : false)
        this.$emit('initForm', formData)
      })
    } else {
      // 添加门店时初始化地图
      this.qqmapinit(39.916527, 116.397128)
    }
    let distributor_type = this.$route.query.distributor_type

    this.$emit('onChangeData', 'distributor_type', distributor_type)
    if (distributor_type) {
      this.form.distributor_self = 1
    }
  }
}
</script>

<style scoped>
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