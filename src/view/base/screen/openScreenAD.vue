<template>
  <SpPage>
    <SpPlatformTip h5 app alipay />
    <!-- <el-card> -->
      <div style="width: 70%">
        <el-form v-loading="loading" label-width="180px" :model="form">
          <el-form-item label="广告素材" prop="ad_pic">
            <el-radio-group v-model="form.material_type">
              <el-radio :label="1"> 图片 </el-radio>
              <!-- <el-radio :label="2">视频</el-radio>-->
            </el-radio-group>
            <!--图片组件-->
            <div v-if="form.material_type === 1">
              <p class="frm-tips">点击图片可更换，图片大小不能超过 2MB（建议尺寸：750px*1334px）</p>
              <div>
                <div class="upload-box" @click="handleImgChange">
                  <img v-if="ad_pic" :src="wximageurl + ad_pic" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </div>
              </div>
              <imgPicker
                :dialog-visible="imgDialog"
                :sc-status="isGetImage"
                @chooseImg="pickImg"
                @closeImgDialog="closeImgDialog"
              />
            </div>
            <!--视频组件-->
            <div v-if="form.material_type === 2">
              <videoPicker :data="itemVideo" @change="pickVideo" />
              <el-button v-if="itemVideo.media_id" type="text" @click="deleteVideo">
                删除
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="是否开启">
            <el-radio-group v-model="form.is_enable">
              <el-radio :label="1"> 开启 </el-radio>
              <el-radio :label="0"> 关闭 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="曝光设置">
            <el-radio-group v-model="form.show_time">
              <el-radio label="first"> 第一次启动时 </el-radio>
              <el-radio label="always"> 每次启动时 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="倒计时显示位置">
            <el-radio-group v-model="form.position">
              <el-radio label="right_top"> 右上 </el-radio>
              <el-radio label="right_bottom"> 右下 </el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="是否允许跳过">
  <el-radio-group v-model="form.is_jump">
  <el-radio :label="1">
  是
  </el-radio>
  <el-radio :label="0">
  否
  </el-radio>
  </el-radio-group>
  </el-form-item> -->

          <el-form-item label="等待时间">
            <el-input
              v-model="form.waiting_time"
              type="number"
              :min="0"
              :max="999999999"
              placeholder="请输入整数"
              @input="input_waiting_time"
            >
              <template slot="append"> 秒 </template>
            </el-input>
          </el-form-item>
          <el-form-item label="广告跳转路径">
            <!-- <el-input type="text" v-model="form.ad_url" placeholder="请输入URL" ></el-input>-->
            <div class="uploader-setting">
              <div class="goods-select">
                <div v-if="JSON.stringify(form.ad_url) !== '{}'" class="link-content">
                  <span @click="handleGoodsChange()">
                    <template v-if="form.ad_url.linkPage === 'goods'">商品：</template>
                    <template v-if="form.ad_url.linkPage === 'category'">分类：</template>
                    <template v-if="form.ad_url.linkPage === 'article'">文章：</template>
                    <template v-if="form.ad_url.linkPage === 'planting'">软文：</template>
                    <!--template v-if="form.ad_url.linkPage === 'planting'">种草：</template-->
                    <template v-if="form.ad_url.linkPage === 'link'">页面：</template>
                    <template v-if="form.ad_url.linkPage === 'marketing'">营销：</template>
                    <template v-if="form.ad_url.linkPage === 'custom_page'">自定义页：</template>
                    {{ form.ad_url.title }}
                  </span>
                  <span style="margin-left: 10px">
                    <i
                      v-if="JSON.stringify(form.ad_url) !== '{}'"
                      style="color: #f56c6c"
                      class="el-icon-delete"
                      @click="clear_ad_url"
                    />
                  </span>
                </div>
                <div v-else class="content-center" @click="handleGoodsChange()">
                  <i class="iconfont icon-link" />设置路径
                </div>
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item label="应用端">
  <el-checkbox-group v-model="is_app">
  <el-checkbox label="all" :key="0" name="crossborder_show1">全部</el-checkbox>
  <el-checkbox :key="1" label="wapp" name="crossborder_show1"> 小程序 </el-checkbox>
  <el-checkbox label="app" :key="2" name="crossborder_show1">APP</el-checkbox>
  </el-checkbox-group>
  </el-form-item> -->

          <el-form-item size="large">
            <el-button>取消</el-button>
            <el-button type="primary" @click="save"> 保存 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <linkSetter
        :links="linksArr"
        :visible="linksVisible"
        :show_article="false"
        :show_planting="false"
        :show_page="false"
        :show_marketing="false"
        :show_store="false"
        @setLink="setLink"
        @closeDialog="closeDialog"
      />
    <!-- </el-card> -->
  </SpPage>
</template>
<script>
import linkSetter from '@/components/template_links' // 添加导航连接
import imgPicker from '../../../components/imageselect'
import videoPicker from '@/components/videoselect'
import { mapGetters } from 'vuex'
import { getOpenScreenADSet, saveOpenScreenADSet } from '../../../api/openscreenad'

export default {
  components: {
    linkSetter,
    imgPicker,
    videoPicker
  },
  data() {
    return {
      // linksArr: ['goods', 'store', 'custom_page', 'category'],
      linksArr: [],
      linksVisible: false, // 路径设置组件
      itemVideo: {},
      imgDialog: false,
      isGetImage: false,
      loading: false,
      ad_pic: '',
      video: {
        videos: '',
        videos_url: ''
      },
      is_app: ['wapp'],
      form: {
        ad_material: '',
        material_type: 1,
        is_enable: 0,
        show_time: 'first',
        position: 'right_top',
        is_jump: 0,
        waiting_time: 0,
        ad_url: {},
        app: ''
      }
    }
  },
  mounted() {
    // 获取信息
    this.getInfo()
  },
  methods: {
    clear_ad_url() {
      this.form.ad_url = {}
    },
    input_waiting_time() {
      this.form.waiting_time = Number(this.form.waiting_time.replace(/\D+/, ''))
    },
    handleGoodsChange() {
      this.linksVisible = true
    },
    setLink(data, type) {
      let obj = Object.assign(data, { 'linkPage': type })
      this.form.ad_url = obj
    },
    closeDialog() {
      this.linksVisible = false
    },
    handleImgChange() {
      this.imgDialog = true
      this.isGetImage = true
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    pickImg(data) {
      this.ad_pic = data.url
      this.imgDialog = false
    },
    // 视频
    pickVideo(data) {
      this.video.videos = data.media_id
      this.video.videos_url = data.url
    },
    // 删除视频
    deleteVideo() {
      this.itemVideo = {}
      this.form.ad_material = ''
    },
    // 获取信息
    getInfo() {
      this.loading = true
      getOpenScreenADSet(this.params).then((res) => {
        if (res.data.data.length !== 0) {
          this.form.ad_material = res.data.data.ad_material
          this.form.is_enable = res.data.data.is_enable
          this.form.show_time = res.data.data.show_time
          this.form.position = res.data.data.position
          this.form.is_jump = 1
          this.form.material_type = res.data.data.material_type
          this.form.waiting_time = res.data.data.waiting_time
          // this.form.ad_url = res.data.data.ad_url
          // 判断是否为空
          if (!res.data.data.ad_url) {
            this.form.ad_url = {}
          } else {
            this.form.ad_url = res.data.data.ad_url
          }
          this.form.app = res.data.data.app
          this.is_app = res.data.data.app.split(',')
          if (res.data.data.material_type === 1) {
            this.ad_pic = res.data.data.ad_material
          } else if (res.data.data.material_type === 2) {
            this.video.videos = res.data.data.ad_material
            this.video.videos_url = res.data.data.ad_material

            this.itemVideo = { media_id: res.data.data.ad_material, url: res.data.data.ad_material }
          }
        }
        this.loading = false
      })
    },
    // 保存数据
    save() {
      if (this.form.material_type === 1) {
        this.form.ad_material = this.ad_pic
      } else if (this.form.material_type === 2) {
        this.form.ad_material = this.video.videos_url
      }

      // 判断秒数
      if (this.form.waiting_time <= 0 || this.form.waiting_time > 999999999) {
        this.$message({ type: 'warning', message: '等待时间区间：0-999999999秒' })
        return
      }

      // 判断广告跳转路径
      // if (!this.form.ad_url || JSON.stringify(this.form.ad_url) === '{}') {
      // this.$message({type: 'warning', message: '请选择广告跳转路径'})
      // return
      // }

      // 判断素材
      if (this.form.ad_material === '') {
        this.$message({ type: 'warning', message: '请选择素材' })
        return
      }
      // 判断应用端
      if (this.is_app.length <= 0) {
        this.$message({ type: 'warning', message: '请选择应用端' })
        return
      } else {
        this.form.app = this.is_app.join(',')
      }
      saveOpenScreenADSet(this.form).then((res) => {
        this.$message({ type: 'success', message: '操作成功' })
        this.getInfo()
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.tip {
  font-size: 12px;
  color: #909399;
}

.upload-box {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  width: 150px;
  height: 150px;

  .avatar {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
