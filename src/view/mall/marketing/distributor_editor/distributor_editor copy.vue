/* eslint-disable */
<div style="max-width: 403px; max-height: 300px" id="container123"></div>
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
      <el-form-item label="所属区域">
        <div>
          <el-col :span="8">
            <el-select
              v-model="form.regionauth_id"
              placeholder="区域"
              style="width: 100%"
              @change=""
            >
              <el-option
                v-for="(item, index) in regionauth_list"
                :key="index"
                :label="item.regionauth_name"
                :value="item.regionauth_id"
              />
            </el-select>
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="店铺名称">
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
        label="店铺号"
        prop="shop_code"
        :rules="rules.shop_code"
      >
        <div>
          <el-col :span="8">
            <el-input
              v-model="form.shop_code"
              :maxlength="10"
              placeholder="请输入店铺号"
              :disabled="disabled"
            />
            <div class="frm-tips">
              配置的店铺号会在交易单中作为前缀，以便财务对账，最多10位, 仅支持英文数字
            </div>
          </el-col>
        </div>
      </el-form-item>
      <el-row>
        <el-col
          v-if="!distributor_type"
          :span="5"
        >
          <el-form-item label="是否启用">
            <el-radio-group v-model="form.is_valid">
              <el-radio label="true">
                启用
              </el-radio>
              <el-radio label="false">
                禁用
              </el-radio>
              <el-radio label="delete">
                废弃(相当于删除)
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col
          v-if="!distributor_type"
          :span="5"
        >
          <el-form-item label="是否快递">
            <el-switch
              v-model="form.is_delivery"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否自提">
            <el-switch
              v-if="!form.lng && !form.lat"
              v-model="form.is_ziti"
              disabled
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
            <el-switch
              v-else
              v-model="form.is_ziti"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchChange(scope.$index, scope.row)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        v-if="isOpen"
        label="是否分账"
      >
        <el-switch
          v-model="form.is_open"
          active-value="true"
          inactive-value="false"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item
        v-if="isOpen"
        label="平台服务费"
      >
        <el-input
          v-model.lazy="form.rate"
          class="first"
          type="number"
          min="0"
          max="30"
          size="mini"
          style="width: 200px"
        />
        %
        <span class="frm-tips"> 平台向商户收取的服务费率（0.00-30.00）</span>
      </el-form-item>
      <el-form-item label="地理位置">
        <div class="frm-tips">
          店铺定位后保存店铺经纬度，才可以开启自提，否则店铺不支持自提功能
        </div>
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
      <el-form-item label="地图定位">
        <div id="qqmap_container" />
      </el-form-item>
      <el-form-item
        inline="true"
        class="demo-form-inline"
        label="店铺经纬度"
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
      <el-row>
        <el-col :span="8">
          <el-form-item label="店铺LOGO">
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
        </el-col>
        <el-col :span="8">
          <el-form-item label="扫码购页面banner配置">
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
        </el-col>
      </el-row>
      <el-form-item
        v-if="
          system_mode !== 'platform' &&
            this.$store.getters.login_type != 'distributor' &&
            !distributor_type
        "
        label="自动上架商品"
      >
        <el-switch
          v-model="form.auto_sync_goods"
          inactive-color="#ff4949"
          active-color="#13ce66"
        />
        <div class="frm-tips">
          开启后，店铺自动上架总部商品; 取消自动下架后，将保留店铺已上架的商品
        </div>
      </el-form-item>
      <el-form-item
        v-if="
          this.$store.getters.login_type != 'distributor' &&
            system_mode === 'platform' &&
            !distributor_type
        "
        label="审核商品"
      >
        <el-switch
          v-model="form.is_audit_goods"
          inactive-color="#ff4949"
          active-color="#13ce66"
        />
        <div class="frm-tips">
          开启后，店铺添加的自有商品，需要平台审核通过后才可以上架
        </div>
      </el-form-item>

      <div class="section-footer with-border content-center">
        <el-button
          size="large"
          @click="cancelSubmit"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submitItemsActionConfirm"
        >
          {{
            submitLoading ? '提交中' : '保存'
          }}
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
import imgPicker from '@/components/imageselect'
import district from '../../../common/district.json'
import { saveDistributor, getDistributorInfo } from '@/api/marketing'
import { getRegionauth } from '@/api/regionauth'
import { getSetting } from '@/api/fenzhang'

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
      disabled: false,
      form: {
        is_valid: 'true',
        address: '',
        is_ziti: false,
        is_delivery: true,
        shop_code: ''
        // rate: '0.00',
        // is_open: false,
      },
      distributor_id: 0,
      distributor_type: '',
      searchRegion: '',
      qqmap_infowin_flag: false,
      regions: district,
      searchService: [],
      markers: [],
      poi_info: [],
      rules: {
        shop_code: [{ pattern: /^[A-Za-z0-9]+$/, message: '请输入正确格式的店铺号' }]
      },
      regionauth_list: [],
      isOpen: false
    }
  },
  mounted () {
    this.getRegionauthList()
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
        this.disabled = res.data.data.shop_code ? true : false
      })
    } else {
      // 添加门店时初始化地图
      this.qqmapinit(39.916527, 116.397128)
    }
    this.distributor_type = this.$route.query.distributor_type
    if (this.distributor_type) {
      this.form.distributor_self = 1
    }
    getSetting().then((res) => {
      let data = res.data.data
      this.isOpen = data.is_open == 'true'
    })
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
    cancelSubmit () {
      this.$router.go(-1)
    },
    submitItemsActionConfirm () {
      this.submitLoading = true
      if (this.form.shop_code) {
        this.form.shop_code = this.form.shop_code
      }
      this.form.hour = this.startTime + '-' + this.endTime
      saveDistributor(this.form)
        .then((res) => {
          this.submitLoading = false
          this.$message({ type: 'success', message: '保存店铺成功' })
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
      // this.form.name = poi_info.name
      this.form.lng = poi_info.latLng.lng
      this.form.lat = poi_info.latLng.lat
      this.form.address = poi_info.address
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
    getRegionauthList () {
      this.loading = true
      getRegionauth().then((res) => {
        this.regionauth_list = res.data.data.list
        this.regionauth_total = res.data.data.total_count
        this.loading = false
      })
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
