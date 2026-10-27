<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section class="section section-white content-padded" onload="init()">
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item :label="$t('c9579e27.a1bb9c')">
        <el-col :span="10">
          <el-radio-group
            v-if="form.wx_shop_id"
            v-model="form.is_domestic"
            @change="isDomesticChange"
          >
            <el-radio :label="1" value="1" disabled> {{ $t('c9579e27.227dd1') }} </el-radio>
            <el-radio :label="2" value="2" disabled> {{ $t('c9579e27.cf4787') }} </el-radio>
          </el-radio-group>
          <el-radio-group v-else v-model="form.is_domestic" @change="isDomesticChange">
            <el-radio :label="1" value="1"> {{ $t('c9579e27.227dd1') }} </el-radio>
            <el-radio :label="2" value="2"> {{ $t('c9579e27.cf4787') }} </el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('c9579e27.0306b5')">
        <el-col :span="10">
          <el-radio-group v-model="form.is_direct_store">
            <el-radio :label="1" value="1"> {{ $t('aa338e9b.4b940c') }} </el-radio>
            <el-radio :label="2" value="2"> {{ $t('aa338e9b.c26325') }} </el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('c9579e27.740032')">
        <div>
          <el-col :span="8">
            <el-input v-model="form.name" :placeholder="$t('c9579e27.4b650a')" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item v-if="form.is_domestic == 1" :label="$t('c9579e27.fc82aa')">
        <el-cascader
          v-model="form.regions_id"
          :options="regions"
          style="width: 200px"
          @change="handleRegionChange"
        />
        <el-input
          id="keyword"
          v-model="form.address"
          :placeholder="$t('c9579e27.6107b3')"
          style="width: 500px"
        />
        <el-button type="primary" @click="searchKeyword()"> {{ $t('c9579e27.83546a') }} </el-button>
      </el-form-item>
      <el-form-item v-if="form.is_domestic == 1" :label="$t('c9579e27.86188c')">
        <div id="qqmap_container" />
      </el-form-item>
      <el-form-item v-if="form.is_domestic == '2'" :label="$t('c9579e27.a345de')">
        <div>
          <el-col :span="4">
            <el-input v-model="form.country" :placeholder="$t('c9579e27.ee3f55')" />
          </el-col>
          <el-col :span="1" class="content-center"> - </el-col>
          <el-col :span="4">
            <el-input v-model="form.city" :placeholder="$t('c9579e27.f7d29d')" />
          </el-col>
          <el-col :span="1" class="content-center"> - </el-col>
          <el-col :span="10">
            <el-input v-model="form.address" :placeholder="$t('c9579e27.61a0ec')" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item inline="true" class="demo-form-inline" :label="$t('c9579e27.8545dd')">
        <el-col :span="3">
          <el-input v-model="form.lng" readonly :placeholder="$t('c9579e27.3d18ca')" />
        </el-col>
        <el-col :span="1" class="content-center"> - </el-col>
        <el-col :span="3">
          <el-input v-model="form.lat" readonly :placeholder="$t('c9579e27.6acaee')" />
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('c9579e27.52409d')">
        <el-input v-model="form.contact" :placeholder="$t('c9579e27.52409d')" style="width: 55%" />
      </el-form-item>
      <el-form-item :label="$t('c9579e27.b58943')">
        <el-input v-model="form.mobile" :placeholder="$t('c9579e27.6e4f4b')" style="width: 55%" />
      </el-form-item>
      <el-form-item :label="$t('c9579e27.e84643')">
        <el-col :span="8">
          <el-input v-model="form.contract_phone" />
        </el-col>
        <el-col>
          <p class="frm-tips">{{ $t('c9579e27.7b78e9') }}</p>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('c9579e27.cc3307')">
        <el-time-select
          v-model="startTime"
          :placeholder="$t('c9579e27.26dac3')"
          :picker-options="{ start: '00:00', step: '00:30', end: '23:59' }"
        />
        <el-time-select
          v-model="endTime"
          :placeholder="$t('c9579e27.f78277')"
          :picker-options="{ start: '00:00', step: '00:30', end: '23:59', minTime: startTime }"
        />
        <p class="frm-tips">{{ $t('c9579e27.a7bd0e') }}</p>
      </el-form-item>
      <el-form-item :label="$t('c9579e27.6bf24c')">
        <div class="upload-box" @click="handleImgPicker('logo')">
          <img v-if="form.logo" :src="form.logo" class="avatar" />
          <i v-else class="el-icon-camera avatar-uploader-icon" />
        </div>
        <div class="frm-tips">{{ $t('c9579e27.3f13f6') }}</div>
      </el-form-item>
      <el-form-item v-if="VERSION_PLATFORM()" :label="$t('c9579e27.82d49d')">
        <div class="upload-box" @click="handleImgPicker('banner')">
          <img v-if="form.banner" :src="form.banner" class="avatar" />
          <i v-else class="el-icon-camera avatar-uploader-icon" />
        </div>
        <div class="frm-tips">{{ $t('c9579e27.3f13f6') }}</div>
      </el-form-item>
      <el-form-item :label="$t('c9579e27.53c3dd')">
        <el-switch
          v-model="form.is_valid"
          active-value="true"
          inactive-value="false"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <div class="section-footer with-border content-center">
        <el-button size="large" @click.native.prevent> {{ $t('c9579e27.625fb2') }} </el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitItemsActionConfirm">
          {{ submitLoading ? $t('c9579e27.7ef44a') : $t('c9579e27.be5fbb') }}
        </el-button>
      </div>
    </el-form>
    <div v-show="qqmap_infowin_flag" id="qqmap_infowin">
      <el-col>
        <el-button type="primary" @click="imp_poi(poi_info)">
          {{ $t('c9579e27.e6c071') }}
        </el-button>
      </el-col>
      <el-col>{{ poi_info.name }}</el-col>
      <div class="frm-tips">
        {{ poi_info.address }}
      </div>
    </div>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
  </section>
</template>
<script>
import districtOptions from '@/mixins/districtOptions'
import { getDistributorList, addDistributorShop } from '@/api/marketing'
import { uploadMaterial, getAuthorizerInfo } from '@/api/wechat'
import imgPicker from '@/components/imageselect'

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
  mixins: [districtOptions],
  components: {
    imgPicker
  },
  data() {
    return {
      imgDialog: false,
      isGetImage: false,
      startTime: '08:00',
      endTime: '21:00',
      submitLoading: false,
      pickerImgType: 'logo',
      form: {
        is_valid: 'true',
        address: '',
        is_distributor: 'false',
        is_direct_store: 1,
        is_domestic: 1
      },
      distributor_id: 0,
      searchRegion: '',
      qqmap_infowin_flag: false,
      regions: [],
      searchService: [],
      markers: [],
      poi_info: []
    }
  },
  mounted() {
    this.distributor_id = this.$route.query.distributor_id
    if (this.distributor_id || this.$store.getters.login_type == 'distributor') {
      getDistributorInfo({ distributor_id: this.distributor_id }).then((res) => {
        this.form = res.data.data
        if (res.data.data.hour) {
          // 处理营业时间的格式
          var open_time = res.data.data.hour.split('-')
          this.startTime = open_time[0]
          this.endTime = open_time[1]
        }

        this.searchRegion = this.form.area
        if (!this.form.lat) {
          this.qqmapinit(39.916527, 116.397128)
        } else {
          this.qqmapinit(this.form.lat, this.form.lng)
        }
      })
    } else {
      // 添加门店时初始化地图
      this.qqmapinit(39.916527, 116.397128)
    }
  },
  methods: {
    pickImg(data) {
      if (this.pickerImgType == 'logo') {
        this.form.logo = data.url
      } else {
        this.form.banner = data.url
      }
      console.log(data)
      this.imgDialog = false
    },
    handleImgPicker(pickerImgType) {
      this.pickerImgType = pickerImgType
      this.imgDialog = true
      this.isGetImage = true
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    submitItemsActionConfirm() {
      this.submitLoading = true
      this.form.hour = this.startTime + '-' + this.endTime
      addDistributorShop(this.form)
        .then((res) => {
          this.submitLoading = false
          this.$message({ type: 'success', message: this.$t('c9579e27.dd849a') })
          if (this.$store.getters.login_type != 'distributor') {
            this.$router.go(-1)
          }
        })
        .catch((error) => {
          this.submitLoading = false
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
        this.form.regions[0] == this.$t('e67351f7.a8e562') ||
        this.form.regions[0] == this.$t('e67351f7.727286') ||
        this.form.regions[0] == this.$t('e67351f7.b67334') ||
        this.form.regions[0] == this.$t('e67351f7.9bf8cb')
      ) {
        this.searchRegion = this.form.regions[0] + this.form.regions[2]
      } else {
        this.searchRegion = this.form.regions[0] + this.form.regions[1] + this.form.regions[2]
      }
    },
    qqmapinit: function (lat, lng) {
      // var center = new qq.maps.LatLng(39.916527, 116.397128);
      var center = new qq.maps.LatLng(lat, lng)
      var map = new qq.maps.Map(document.getElementById('qqmap_container'), {
        center: center,
        zoom: 13
      })
      //创建marker
      var marker = new qq.maps.Marker({
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
              })
            })(i)
          }
          //调整地图视野
          map.fitBounds(latlngBounds)
        },
        //若服务请求失败，则运行以下函数
        error: function () {
          this.$message.error(this.$t('c9579e27.c954c4'))
        }
      })
    },
    clearOverlays: function (overlays) {
      //清除地图上的marker
      var overlay
      while ((overlay = overlays.pop())) {
        overlay.setMap(null)
      }
    },
    searchKeyword: function () {
      //设置搜索的范围和关键字等属性
      if (!this.searchRegion) {
        this.$message({
          message: this.$t('c9579e27.ad1a24'),
          type: 'warning'
        })
        return ''
      }
      if (!this.form.address) {
        this.$message({
          message: this.$t('c9579e27.ef5ed8'),
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
      this.searchService.setLocation(region)
      //设置搜索页码
      this.searchService.setPageIndex(pageIndex)
      //设置每页的结果数
      this.searchService.setPageCapacity(pageCapacity)
      //根据输入的关键字在搜索范围内检索
      this.searchService.search(keyword)
    },
    imp_poi: function (poi_info) {
      this.form.name = poi_info.name
      this.form.lng = poi_info.latLng.lng
      this.form.lat = poi_info.latLng.lat
      this.form.address = poi_info.address.substr(this.searchRegion.length + 1)
    },
    removeByValue: function (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          arr.splice(i, 1)
          break
        }
      }
      return arr
    },
    isDomesticChange(val) {
      if (val == 1) {
        this.qqmapinit(39.916527, 116.397128)
      }
    }
  }
}
</script>

<style lang="scss">
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
