<template>
  <section
    class="section section-white content-padded"
    onload="init()"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="110px"
    >
      <el-form-item label="是否是国内门店">
        <el-col :span="10">
          <el-radio-group
            v-if="form.wx_shop_id"
            v-model="form.is_domestic"
            @change="isDomesticChange"
          >
            <el-radio
              :label="1"
              value="1"
              disabled
            >
              国内
            </el-radio>
            <el-radio
              :label="2"
              value="2"
              disabled
            >
              非国内
            </el-radio>
          </el-radio-group>
          <el-radio-group
            v-else
            v-model="form.is_domestic"
            @change="isDomesticChange"
          >
            <el-radio
              :label="1"
              value="1"
            >
              国内
            </el-radio>
            <el-radio
              :label="2"
              value="2"
            >
              非国内
            </el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="是否是直营店">
        <el-col :span="10">
          <el-radio-group v-model="form.is_direct_store">
            <el-radio
              :label="1"
              value="1"
            >
              直营店
            </el-radio>
            <el-radio
              :label="2"
              value="2"
            >
              非直营店
            </el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="门店名称">
        <div>
          <el-col :span="8">
            <el-input
              v-model="form.name"
              placeholder="请先完成下方地理位置的选择"
            />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item
        v-if="form.is_domestic == 1"
        label="地理位置"
      >
        <el-cascader
          v-model="form.regions_id"
          :options="regions"
          style="width: 200px"
          @change="handleRegionChange"
        />
        <el-input
          id="keyword"
          v-model="form.address"
          placeholder="请输入地址"
          style="width: 500px"
        />
        <el-button
          type="primary"
          @click="searchKeyword()"
        >
          搜索定位
        </el-button>
      </el-form-item>
      <el-form-item
        v-if="form.is_domestic == 1"
        label="地图定位"
      >
        <div id="qqmap_container" />
      </el-form-item>
      <el-form-item
        v-if="form.is_domestic == '2'"
        label="具体地址"
      >
        <div>
          <el-col :span="4">
            <el-input
              v-model="form.country"
              placeholder="国家"
            />
          </el-col>
          <el-col
            :span="1"
            class="content-center"
          >
            -
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="form.city"
              placeholder="城市"
            />
          </el-col>
          <el-col
            :span="1"
            class="content-center"
          >
            -
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="form.address"
              placeholder="详细地址"
            />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item
        inline="true"
        class="demo-form-inline"
        label="门店经纬度"
      >
        <el-col :span="3">
          <el-input
            v-model="form.lng"
            readonly
            placeholder="经度"
          />
        </el-col>
        <el-col
          :span="1"
          class="content-center"
        >
          -
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="form.lat"
            readonly
            placeholder="纬度"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input
          v-model="form.contact"
          placeholder="联系人"
          style="width: 55%"
        />
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input
          v-model="form.mobile"
          placeholder="请输入手机号"
          style="width: 55%"
        />
      </el-form-item>
      <el-form-item label="客服电话">
        <el-col :span="8">
          <el-input v-model="form.contract_phone" />
        </el-col>
        <el-col>
          <p class="frm-tips">
            固定电话需加区号；区号、分机号均用“-”连接
          </p>
        </el-col>
      </el-form-item>
      <el-form-item label="营业时间">
        <el-time-select
          v-model="startTime"
          placeholder="起始时间"
          :picker-options="{ start: '00:00', step: '00:30', end: '23:59' }"
        />
        <el-time-select
          v-model="endTime"
          placeholder="结束时间"
          :picker-options="{ start: '00:00', step: '00:30', end: '23:59', minTime: startTime }"
        />
        <p class="frm-tips">
          24小时制，如10：00-20：30
        </p>
      </el-form-item>
      <el-form-item label="门店LOGO">
        <div
          class="upload-box"
          @click="handleImgPicker('logo')"
        >
          <img
            v-if="form.logo"
            :src="form.logo"
            class="avatar"
          >
          <i
            v-else
            class="iconfont icon-camera avatar-uploader-icon"
          />
        </div>
        <div class="frm-tips">
          只能上传jpg/png文件，且不超过2M
        </div>
      </el-form-item>
      <el-form-item
        v-if="VERSION_PLATFORM"
        label="门店横幅广告"
      >
        <div
          class="upload-box"
          @click="handleImgPicker('banner')"
        >
          <img
            v-if="form.banner"
            :src="form.banner"
            class="avatar"
          >
          <i
            v-else
            class="iconfont icon-camera avatar-uploader-icon"
          />
        </div>
        <div class="frm-tips">
          只能上传jpg/png文件，且不超过2M
        </div>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
          v-model="form.is_valid"
          active-value="true"
          inactive-value="false"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <div class="section-footer with-border content-center">
        <el-button
          size="large"
          @click.native.prevent
        >
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitItemsActionConfirm"
        >
          {{ submitLoading ? '提交中' : '保存' }}
        </el-button>
      </div>
    </el-form>
    <div
      v-show="qqmap_infowin_flag"
      id="qqmap_infowin"
    >
      <el-col>
        <el-button
          type="primary"
          @click="imp_poi(poi_info)"
        >
          导入该位置信息
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
import district from '@/common/district.json'
import { getDistributorList, addDistributorShop } from '@/api/marketing'
import { uploadMaterial, getAuthorizerInfo } from '@/api/wechat'
import imgPicker from '@/components/imageselect'

// 取选中地区的值
function getCascaderObj (val, opt) {
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
  components: {
    imgPicker
  },
  data () {
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
      regions: district,
      searchService: [],
      markers: [],
      poi_info: []
    }
  },
  mounted () {
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
    pickImg (data) {
      if (this.pickerImgType == 'logo') {
        this.form.logo = data.url
      } else {
        this.form.banner = data.url
      }
      console.log(data)
      this.imgDialog = false
    },
    handleImgPicker (pickerImgType) {
      this.pickerImgType = pickerImgType
      this.imgDialog = true
      this.isGetImage = true
    },
    closeImgDialog () {
      this.imgDialog = false
      this.isGetImage = false
    },
    submitItemsActionConfirm () {
      this.submitLoading = true
      this.form.hour = this.startTime + '-' + this.endTime
      addDistributorShop(this.form)
        .then((res) => {
          this.submitLoading = false
          this.$message({ type: 'success', message: '保存门店成功' })
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
          this.$message.error('未查询到数据')
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
    isDomesticChange (val) {
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
