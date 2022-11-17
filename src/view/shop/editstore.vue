<template>
  <section class="section section-white content-padded" onload="init()">
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="是否是国内门店">
        <el-col :span="10">
          <el-radio-group
            v-if="form.wx_shop_id"
            v-model="form.is_domestic"
            @change="isDomesticChange"
          >
            <el-radio :label="1" value="1" disabled> 国内> </el-radio>
            <el-radio :label="2" value="2" disabled> 非国内> </el-radio>
          </el-radio-group>
          <el-radio-group v-else v-model="form.is_domestic" @change="isDomesticChange">
            <el-radio :label="1" value="1"> 国内> </el-radio>
            <el-radio :label="2" value="2"> 非国内> </el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="是否是直营店">
        <el-col :span="10">
          <el-radio-group v-model="form.is_direct_store">
            <el-radio :label="1" value="1"> 直营店> </el-radio>
            <el-radio :label="2" value="2"> 非直营店> </el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item v-if="form.is_domestic == 1" label="地理位置">
        <el-col :span="4">
          <el-cascader :options="regions" change-on-select @change="handleRegionChange" />
        </el-col>
        <el-col :span="7">
          <el-input id="keyword" v-model="form.address" placeholder="请输入门店名称" />
        </el-col>
        <el-col :span="1" class="content-center"> &nbsp; </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="searchKeyword()"> 搜索定位 </el-button>
        </el-col>
      </el-form-item>
      <el-form-item v-if="form.is_domestic == 1" label="地图定位">
        <el-col :span="4">
          <div id="qqmap_rslist" />
        </el-col>
        <el-col :span="12">
          <div id="qqmap_container" />
        </el-col>
      </el-form-item>
      <el-form-item label="门店名称">
        <div>
          <el-col :span="8">
            <el-input v-model="form.shopname" placeholder="请先完成上方地理位置的选择" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item v-if="form.is_domestic == '2'" label="具体地址">
        <div>
          <el-col :span="1">
            <el-input v-model="form.country" placeholder="国家" />
          </el-col>
          <el-col :span="1" class="content-center"> - </el-col>
          <el-col :span="2">
            <el-input v-model="form.city" placeholder="城市" />
          </el-col>
          <el-col :span="1" class="content-center"> - </el-col>
          <el-col :span="5">
            <el-input v-model="form.address" placeholder="详细地址" />
          </el-col>
        </div>
      </el-form-item>
      <el-form-item v-if="form.is_domestic == 2" label="经营资质名称">
        <el-col :span="8">
          <el-input v-model="form.company_name" />
        </el-col>
        <el-col>
          <p class="frm-tips">请填写营业执照名称，或组织机构代码证名称。</p>
        </el-col>
      </el-form-item>
      <el-form-item inline="true" class="demo-form-inline" label="门店经纬度">
        <el-col :span="3">
          <el-input v-model="form.lng" readonly placeholder="经度" />
        </el-col>
        <el-col :span="1" class="content-center"> - </el-col>
        <el-col :span="3">
          <el-input v-model="form.lat" readonly placeholder="纬度" />
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="门店图片">
        <el-col><p class="frm-tips">请上传门店图片如门店内、外景图、门店服务信息等，图片将展示在微信客户端的门店页。<br />最多可上传9个图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M</p></el-col>
          <el-col>
            <el-upload
              action=""
              list-type="picture-card"
              :on-preview="handlePicCardPreview"
              :auto-upload=false
              :file-list="fileList2"
              :on-remove="handleRemovePic"
              :on-change="handlePicChange">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-col>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item> -->
      <el-form-item label="门店图片">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="frm-tips">
              请上传门店图片如门店内、外景图、门店服务信息等，图片将展示在微信客户端的门店页。<br>最多可上传9个图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M
            </div>
            <div class="pics-box">
              <ul class="goodspic-wrap">
                <li
                  v-for="(item, index) in form.pic_list"
                  :key="index"
                  class="goodspic"
                  @mouseenter="picsEnter(index)"
                  @mouseleave="picsLeave"
                >
                  <img :src="wximageurl + item">
                  <div
                    class="goodspic-mask"
                    :class="picsCurrent == index ? 'on' : ''"
                    @click="removePicsImg(index)"
                  >
                    <i class="iconfont icon-trash-alt1 icon1" />
                  </div>
                </li>
              </ul>
              <div v-if="form.pic_list.length < 9" class="upload-box" @click="handlePicsChange">
                <i class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <imgPicker
              :dialog-visible="picsDialog"
              :sc-status="isGetPics"
              :is-most="true"
              @chooseImg="pickPics"
              @closeImgDialog="closePicsDialog"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="客服电话">
        <el-col :span="8">
          <el-input v-model="form.contract_phone" />
        </el-col>
        <el-col>
          <p class="frm-tips">固定电话需加区号；区号、分机号均用“-”连接</p>
        </el-col>
      </el-form-item>
      <el-form-item label="营业时间">
        <el-col :span="5">
          <el-time-picker
            v-model="opentime"
            is-range
            format="HH:mm"
            type="fixed-time"
            placeholder="营业时间"
            style="width: 100%"
            @change="selectDateChange"
          />
        </el-col>
        <el-col>
          <p class="frm-tips">24小时制，如10：00-20：30</p>
        </el-col>
      </el-form-item>
      <el-form-item v-show="add_flag === 1" v-if="form.is_domestic == '1'" label="经营资质主体">
        <el-radio-group v-model="form.add_type">
          <div style="margin-bottom: 10px">
            <el-radio :label="1">
              公众账号主体&nbsp;<span class="frm-tips">({{ principal_name }})</span>
            </el-radio>
          </div>
          <div>
            <el-radio :label="2">
              相关主体&nbsp;<span class="frm-tips"
                >(若地点的经营资质名称与帐号主体名称不一致，请选择相关主体。)</span
              >
            </el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-show="form.add_type == '2' && add_flag === 1"
        v-if="form.is_domestic == 1"
        label="经营资质名称"
      >
        <el-col :span="8">
          <el-input v-model="form.company_name" />
        </el-col>
        <el-col>
          <p class="frm-tips">请填写营业执照名称，或组织机构代码证名称。</p>
        </el-col>
      </el-form-item>
      <el-form-item v-show="add_flag === 1" v-if="form.is_domestic == 1" label="经营资质证件号">
        <el-col :span="8">
          <el-input v-model="form.credential" />
        </el-col>
        <el-col>
          <p class="frm-tips">
            请填写15位营业执照注册号或9位组织机构代码（如12345678-9）或18位或20位统一社会信用代码
          </p>
        </el-col>
      </el-form-item>
      <el-form-item
        v-show="form.add_type == '2' && add_flag === 1"
        v-if="form.is_domestic == 1"
        label="相关证明材料"
      >
        <el-col>
          <p class="frm-tips">
            提交能证明此经营资质主体与帐号主体相关的证明材料。文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M。
          </p>
        </el-col>
        <el-col>
          <el-upload
            class="avatar-uploader"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleQualificationPicChange"
          >
            <img v-if="qpic_url" :src="qpic_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="large" @click="onSubmit"> 提交 </el-button>
        <el-button size="large" @click.native.prevent> 取消 </el-button>
      </el-form-item>
    </el-form>
    <div v-show="qqmap_infowin_flag" id="qqmap_infowin">
      <el-col>
        <el-button type="primary" @click="imp_poi(poi_info)"> 导入该门店信息 </el-button>
      </el-col>
      <el-col>{{ poi_info.id }}</el-col>
      <el-col>{{ poi_info.name }},{{ poi_info.address }}</el-col>
    </div>
  </section>
</template>
<script>
import district from '@/common/district.json'
import { createWxShops, updateWxShops, getWxShopsDetail } from '@/api/shop'
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
  inject: ['refresh'],
  components: {
    imgPicker
  },
  data() {
    return {
      principal_name: '',
      wxShopsDetailData: {
        pic_list: {}
      },
      form: {
        wx_shop_id: '',
        contract_phone: '',
        shopname: '',
        company_name: '',
        region: '',
        lng: '',
        lat: '',
        hour: '',
        pic_list: [],
        qpic: {},
        address: '',
        category: '',
        add_type: 1,
        is_domestic: 1,
        country: '',
        city: '',
        is_direct_store: 1
      },
      opentime: '',
      qqmap_infowin_flag: false,
      regions: district,
      searchService: [],
      markers: [],
      poi_info: [],
      qpic_url: '',
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      fileList2: [],
      add_flag: 1,
      isGetPics: false,
      picsDialog: false,
      picsCurrent: -1,
      picsOldLen: 0
    }
  },
  mounted() {
    getAuthorizerInfo().then((response) => {
      this.principal_name = response.data.data.principal_name
    })

    if (this.$route.params.wxShopId) {
      // 初始化门店数据
      //this.add_flag = 0;
      getWxShopsDetail(this.$route.params.wxShopId)
        .then((response) => {
          this.wxShopsDetailData = response.data.data
          this.form.pic_list = this.wxShopsDetailData.pic_list
          this.form.contract_phone = this.wxShopsDetailData.contract_phone
          this.form.credential = this.wxShopsDetailData.credential
          this.form.shopname = this.wxShopsDetailData.store_name
          this.form.company_name = this.wxShopsDetailData.company_name
          this.form.category = this.wxShopsDetailData.category
          this.form.address = this.wxShopsDetailData.address
          this.form.lat = this.wxShopsDetailData.lat
          this.form.lng = this.wxShopsDetailData.lng
          this.form.map_poi_id = this.wxShopsDetailData.map_poi_id
          this.form.qpic = ''
          this.form.add_type = this.wxShopsDetailData.add_type
          if (!this.wxShopsDetailData.is_domestic) {
            this.form.is_domestic = 1
          } else {
            this.form.is_domestic = this.wxShopsDetailData.is_domestic
          }

          this.form.country = this.wxShopsDetailData.country
          this.form.city = this.wxShopsDetailData.city
          this.form.wx_shop_id = this.wxShopsDetailData.wx_shop_id

          if (!this.wxShopsDetailData.is_direct_store) {
            this.form.is_direct_store = 1
          } else {
            this.form.is_direct_store = this.wxShopsDetailData.is_direct_store
          }

          // 处理营业时间的格式
          var open_time = this.wxShopsDetailData.hour.split('-')
          var start_time = open_time[0].split(':')
          var end_time = open_time[1].split(':')
          this.opentime = [
            new Date('2017', '07', '13', start_time[0], start_time[1], '00'),
            new Date('2017', '07', '13', end_time[0], end_time[1], '00')
          ]
          this.form.hour = this.opentime
          // 处理图片列表
          var shopPicList = []
          for (var item in this.form.pic_list) {
            var newpic = {}
            newpic.url = this.wximageurl + this.form.pic_list[item]
            shopPicList.push(newpic)
          }
          this.fileList2 = shopPicList
          // 编辑门店时初始化地图
          this.qqmapinit(this.wxShopsDetailData.lat, this.wxShopsDetailData.lng)
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
    selectDateChange(date) {
      this.form.hour = date
    },
    onSubmit() {
      let params = {}
      this.loading = true

      if (this.form.is_domestic == 1) {
        if (!this.form.address || !this.form.lng || !this.form.lat) {
          this.$message.error('国内门店，地理位置必填! 并且请导入具体地址，用以确定经纬度')
          return false
        }
      }

      params = {
        map_poi_id: this.form.map_poi_id,
        pic_list: this.form.pic_list,
        contract_phone: this.form.contract_phone,
        hour: this.form.hour,
        store_name: this.form.shopname,
        add_type: this.form.add_type,
        company_name: this.form.company_name,
        credential: this.form.credential,
        qualification_list: this.form.qpic,
        card_id: '',
        lng: this.form.lng,
        lat: this.form.lat,
        address: this.form.address,
        category: this.form.category,
        country: this.form.country,
        city: this.form.city,
        is_domestic: this.form.is_domestic,
        is_direct_store: this.form.is_direct_store
      }
      if (this.form.is_domestic == 2) {
        params.add_type = 3
      }
      if (this.wxShopsDetailData.wx_shop_id) {
        // 编辑门店数据提交
        // console.log(params);
        updateWxShops(this.wxShopsDetailData.wx_shop_id, params).then((response) => {
          if (response.data.data.wx_shop_id) {
            this.loading = false
            this.$message.success('保存成功')
            this.refresh()
            this.$router.go(-1)
          } else {
            this.$message.error('保存失败')
            return false
          }
        })
      } else {
        // 添加门店数据提交
        createWxShops(params).then((response) => {
          if (response.data.data.wx_shop_id) {
            this.loading = false
            this.refresh()
            this.$router.go(-1)
          } else {
            this.$message.error('保存失败')
            return false
          }
        })
      }
    },
    handleRegionChange: function (value) {
      var vals = getCascaderObj(value, this.regions)
      this.form.region = vals[vals.length - 1].label
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
          this.$message.error('搜索门店失败!')
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
      if (!this.form.region) {
        this.$message({
          message: '请选择地区',
          type: 'warning'
        })
        return ''
      }
      if (!this.form.address) {
        this.$message({
          message: '请输入门店名称',
          type: 'warning'
        })
        return ''
      }
      var region = this.form.region
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
      this.form.shopname = poi_info.name
      this.form.lng = poi_info.latLng.lng
      this.form.lat = poi_info.latLng.lat
      this.form.map_poi_id = poi_info.id
      this.form.address = poi_info.address
      this.form.category = poi_info.category
    },
    // handlePicCardPreview: function(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    removeByValue: function (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          arr.splice(i, 1)
          break
        }
      }
      return arr
    },
    // handleRemovePic: function (file, fileList) {
    //   let picurl = file.url.replace(this.wximageurl, '')
    //   this.form.pic_list = this.removeByValue(this.form.pic_list, picurl)
    // },
    // handlePicChange: function(file, fileList) {
    //   let that = this
    //   if(fileList.length>9) {
    //     fileList.splice(9)
    //     that.$message.error('最多上传9张门店图片!');
    //     return false
    //   }
    //   that.logo_url = file.url
    //   if (file && file.raw) {
    //     if (file.raw.type != 'image/jpeg' && file.raw.type != 'image/png') {
    //       that.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
    //     }
    //     if (file.raw.size/1024/1024 > 5) {
    //       that.$message.error('上传图片大小不能超过 5MB!')
    //     }
    //   }

    //   let params = {isUploadFile: true, file: file.raw, type: 'image'}
    //   uploadMaterial(params).then(res => {
    //     file.url = this.wximageurl + res.data.data.url
    //     that.form.pic_list.push(res.data.data.url)
    //   })
    // },
    handleQualificationPicChange: function (file, fileList) {
      this.qpic_url = file.url
      if (file && file.raw) {
        if (file.raw.type != 'image/jpeg' && file.raw.type != 'image/png') {
          this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
        }
        if (file.raw.size / 1024 / 1024 > 5) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
      }

      let params = { isUploadFile: true, file: file.raw, type: 'image', is_temp: 'true' }
      uploadMaterial(params).then((res) => {
        this.form.qpic = res.data.data.media_id
      })
    },
    isDomesticChange(val) {
      if (val == 1) {
        this.qqmapinit(39.916527, 116.397128)
      }
    },
    //上传门店图片（9张）
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
    },
    pickPics(arr) {
      if (this.picsOldLen + arr.length >= 10) {
        this.$message.error('最多上传9张图片!')
        return false
      } else {
        if (arr.length != 0) {
          arr.forEach((data) => {
            if (data && data.url !== '') {
              this.picsDialog = false
              this.form.pic_list.push(data.url)
              this.picsOldLen = this.form.pic_list.length
            }
          })
        }
      }
    },
    closePicsDialog() {
      this.picsDialog = false
    },
    picsEnter(index) {
      this.picsCurrent = index
    },
    picsLeave() {
      this.picsCurrent = -1
    },
    removePicsImg: function (index) {
      this.form.pic_list.splice(index, 1)
      this.picsOldLen = this.form.pics.length
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
  width: 148px;
  height: 148px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
.pics-box {
  overflow: hidden;
  .goodspic-wrap {
    float: left;
    margin-right: 5px;
    overflow: hidden;
    .goodspic {
      position: relative;
      float: left;
      width: 146px;
      height: 146px;
      margin: 0 5px 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .goodspic-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        text-align: center;
        line-height: 146px;
        cursor: pointer;
        &.on {
          display: block;
        }
        .icon1 {
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  .upload-box {
    float: left;
    width: 146px;
    height: 146px;
    .avatar-uploader-icon {
      width: 100%;
      height: 100%;
      line-height: 146px;
    }
    .avatar-uploader-icon {
      font-size: 38px;
    }
  }
}
</style>
