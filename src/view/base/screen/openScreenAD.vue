<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" />
    <el-card>
      <div style="width: 70%">
        <el-form v-loading="loading" label-width="180px" :model="form">
          <el-form-item :label="$t('94b9c64d.c36afe')" prop="ad_pic">
            <el-radio-group v-model="form.material_type">
              <el-radio :label="1">{{ $t('94b9c64d.20def7') }}</el-radio>
              <!-- <el-radio :label="2">视频</el-radio>-->
            </el-radio-group>
            <!--图片组件-->
            <div v-if="form.material_type === 1">
              <p class="frm-tips">{{ $t('94b9c64d.68986c') }}</p>
              <div>
                <div class="upload-box" @click="handleImgChange">
                  <img v-if="ad_pic" :src="wximageurl + ad_pic" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </div>
              </div>
            </div>
            <!--视频组件-->
            <div v-if="form.material_type === 2">
              <videoPicker :data="itemVideo" @change="pickVideo" />
              <el-button v-if="itemVideo.media_id" type="text" @click="deleteVideo">
                {{ $t('94b9c64d.2f4aad') }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item :label="$t('94b9c64d.780afe')">
            <el-radio-group v-model="form.is_enable">
              <el-radio :label="1">{{ $t('94b9c64d.cc42dd') }}</el-radio>
              <el-radio :label="0">{{ $t('94b9c64d.b15d91') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('94b9c64d.380600')">
            <el-radio-group v-model="form.show_time">
              <el-radio label="first">{{ $t('94b9c64d.982129') }}</el-radio>
              <el-radio label="always">{{ $t('94b9c64d.5c43e1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('94b9c64d.813fe4')">
            <el-radio-group v-model="form.position">
              <el-radio label="right_top">{{ $t('94b9c64d.eafeba') }}</el-radio>
              <el-radio label="right_bottom">{{ $t('94b9c64d.9cd707') }}</el-radio>
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

          <el-form-item :label="$t('94b9c64d.f10491')">
            <el-input
              v-model="form.waiting_time"
              type="number"
              :min="0"
              :max="999999999"
              :placeholder="$t('94b9c64d.e9fb36')"
              @input="input_waiting_time"
            >
              <template slot="append">{{ $t('94b9c64d.0c1fec') }}</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('94b9c64d.bf490f')">
            <SpPathSelector v-model="adUrlSelector" />
          </el-form-item>
          <!-- <el-form-item label="应用端">
  <el-checkbox-group v-model="is_app">
  <el-checkbox label="all" :key="0" name="crossborder_show1">全部</el-checkbox>
  <el-checkbox :key="1" label="wapp" name="crossborder_show1"> 小程序 </el-checkbox>
  <el-checkbox label="app" :key="2" name="crossborder_show1">APP</el-checkbox>
  </el-checkbox-group>
  </el-form-item> -->
        </el-form>
      </div>

    </el-card>
    <template slot="page-footer">
      <div class="text-center">
        <el-button>{{ $t('94b9c64d.625fb2') }}</el-button>
        <el-button type="primary" @click="save">{{ $t('94b9c64d.be5fbb') }}</el-button>
      </div>
    </template>
  </SpPage>
</template>
<script>
import SpPathSelector from '@/components/sp-path-selector/index.vue'
import videoPicker from '@/components/videoselect'
import { mapGetters } from 'vuex'
import { getOpenScreenADSet, saveOpenScreenADSet } from '../../../api/openscreenad'

export default {
  components: {
    SpPathSelector,
    videoPicker
  },
  data() {
    return {
      itemVideo: {},
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
    input_waiting_time() {
      this.form.waiting_time = Number(this.form.waiting_time.replace(/\D+/, ''))
    },
    async handleImgChange() {
      try {
        const { data } = await this.$picker.image({
          data: this.ad_pic ? { url: this.ad_pic } : undefined
        })

        // 获取图片URL，可能是对象中的url属性，也可能是直接的字符串
        const imgUrl = (data && data.url) || data || ''

        if (imgUrl) {
          // 如果包含 wximageurl，则提取相对路径
          // ad_pic 存储的是相对路径（显示时使用 wximageurl + ad_pic）
          if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
            this.ad_pic = imgUrl.replace(this.wximageurl, '')
          } else {
            this.ad_pic = imgUrl
          }
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
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
        this.$message({ type: 'warning', message: this.$t('94b9c64d.139d73') })
        return
      }

      // 判断广告跳转路径
      // if (!this.form.ad_url || JSON.stringify(this.form.ad_url) === '{}') {
      // this.$message({type: 'warning', message: '请选择广告跳转路径'})
      // return
      // }

      // 判断素材
      if (this.form.ad_material === '') {
        this.$message({ type: 'warning', message: this.$t('94b9c64d.b4c71c') })
        return
      }
      // 判断应用端
      if (this.is_app.length <= 0) {
        this.$message({ type: 'warning', message: this.$t('94b9c64d.59f26b') })
        return
      } else {
        this.form.app = this.is_app.join(',')
      }
      saveOpenScreenADSet(this.form).then((res) => {
        this.$message({ type: 'success', message: this.$t('94b9c64d.33130f') })
        this.getInfo()
      })
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    adUrlSelector: {
      get() {
        const url = this.form.ad_url
        if (!url || typeof url !== 'object') return null
        if (!(url.linkPage || url.title || url.id)) return null
        return url
      },
      set(val) {
        this.form.ad_url = val || {}
      }
    }
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
