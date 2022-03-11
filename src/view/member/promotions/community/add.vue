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
      <el-form-item label="地理位置">
        <div>
          <el-col :span="4">
            <el-cascader
              v-model="form.regions_id"
              :options="regions"
              @change="handleRegionChange"
            />
          </el-col>
          <el-col :span="7">
            <el-input
              id="keyword"
              v-model="form.address"
              placeholder="请输入具体地址"
            />
          </el-col>
          <el-col
            :span="1"
            class="content-center"
          >
&nbsp;
          </el-col>
          <el-col
            :span="3"
          >
            <el-button
              type="primary"
              @click="searchKeyword()"
            >
              搜索定位
            </el-button>
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="地图定位">
        <!-- <div v-if="form.community_id">
          <img :src="form.qqmapimg">
        </div> -->
        <div>
          <el-col :span="4">
            <div id="qqmap_rslist" />
          </el-col>
          <el-col :span="12">
            <div id="qqmap_container" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item
        inline="true"
        class="demo-form-inline"
        label="社区经纬度"
      >
        <el-col
          :span="3"
        >
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
        <el-col
          :span="3"
        >
          <el-input
            v-model="form.lat"
            readonly
            placeholder="纬度"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        inline="true"
        class="demo-form-inline"
        label="社区详细地址"
      >
        <div>
          <el-col
            :span="8"
          >
            <el-input
              id="keyword"
              v-model="form.address"
              placeholder="请输入具体提货地址"
            />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="社区名称">
        <div>
          <el-col :span="8">
            <el-input v-model="form.community_name" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="团长姓名">
        <div>
          <el-col :span="8">
            <el-input v-model="form.leader_name" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="团长手机">
        <div>
          <el-col :span="8">
            <el-input v-model="form.leader_mobile" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="团长身份证">
        <div>
          <el-col :span="8">
            <el-input v-model="form.leader_id_card" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="团长昵称">
        <div>
          <el-col :span="8">
            <el-input v-model="form.leader_nickname" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="备注说明">
        <div>
          <el-col :span="8">
            <el-input v-model="form.description" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="推荐人">
        <div>
          <el-col :span="8">
            <el-input v-model="form.referrer" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="BD">
        <div>
          <el-col :span="8">
            <el-input v-model="form.bd" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="社区人数">
        <div>
          <el-col :span="8">
            <el-input v-model="form.num" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="小区商圈">
        <div>
          <el-col :span="8">
            <el-input v-model="form.business_district" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="店号">
        <div>
          <el-col :span="8">
            <el-input v-model="form.shop_number" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item label="站点号">
        <div>
          <el-col :span="8">
            <el-input v-model="form.site_number" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="large"
          @click="onSubmit"
        >
          提交
        </el-button>
        <el-button
          size="large"
          @click.native.prevent
        >
          取消
        </el-button>
      </el-form-item>
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
          导入社区地址信息
        </el-button>
      </el-col>
      <el-col>{{ poi_info.address }}</el-col>
    </div>
  </section>
</template>
<script>
import district from '../../../../common/district.json'
import { communityCreate, communityUpdate, getCommunityDetail } from '../../../../api/community'

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
  inject: ['refresh'],
  data () {
    return {
      form: {
        community_id: '',
        community_name: '',
        leader_name: '',
        leader_mobile: '',
        leader_id_card: '',
        leader_nickname: '',
        lng: '',
        lat: '',
        hour: '',
        regions_id: [],
        regions: [],
        address: '',
        referrer: '',
        num: 0,
        description: 1,
        bd: '',
        shop_number: '',
        site_number: ''
      },
      qqmap_infowin_flag: false,
      regions: district,
      searchService: [],
      markers: [],
      poi_info: [],
      qpic_url: '',
      fileList: [],
      fileList2: [],
      add_flag: 1
    }
  },
  mounted () {
    if (this.$route.params.community_id) {
      // 初始化门店数据
      //this.add_flag = 0;
      getCommunityDetail(this.$route.params.community_id)
        .then((response) => {
          this.form = response.data.data
          if (this.form.regions.length > 0) {
            this.region = this.form.regions[this.form.regions.length - 1]
          }
          // 编辑门店时初始化地图
          this.qqmapinit(this.form.lat, this.form.lng)
        })
        .catch((error) => {
          this.$router.go(-1)
        })
    } else {
      // 添加门店时初始化地图
      this.qqmapinit(39.916527, 116.397128)
    }
  },
  methods: {
    onSubmit () {
      const that = this
      this.loading = true
      if (this.form.community_id) {
        // 编辑门店数据提交
        let community_id = this.form.community_id
        communityUpdate(community_id, this.form).then((response) => {
          if (response.data.data.community_id) {
            this.loading = false
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            his.$message.error('保存失败!')
            return false
          }
        })
      } else {
        // 添加门店数据提交
        communityCreate(this.form).then((response) => {
          if (response.data.data.community_id) {
            this.loading = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            his.$message.error('保存失败!')
            return false
          }
        })
      }
    },
    handleRegionChange: function (value) {
      var vals = getCascaderObj(value, this.regions)
      this.region = vals[vals.length - 1].label
      this.form.regions_id = []
      this.form.regions = []
      for (var i = 0; i < vals.length; i++) {
        this.form.regions_id[i] = vals[i].value
        this.form.regions[i] = vals[i].label
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
          this.$message.error('搜索地址失败!')
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
      if (!this.region) {
        this.$message({
          message: '请选择地区',
          type: 'warning'
        })
        return ''
      }
      if (!this.form.address) {
        this.$message({
          message: '请输入具体地址',
          type: 'warning'
        })
        return ''
      }
      var region = this.region
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
      this.form.lng = poi_info.latLng.lng
      this.form.lat = poi_info.latLng.lat
      this.form.address = poi_info.address
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
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
