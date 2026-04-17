<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('509e5e05.d877d7')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button v-if="!ruleForm.post_id" type="primary" @click="confirmHandle('ruleForm')">
          {{ $t('509e5e05.81790d') }}
        </el-button>

        <el-button v-if="ruleForm.post_id" type="primary" @click="confirmHandle('ruleForm')">
          {{ $t('509e5e05.38cf16') }}
        </el-button>
        <el-button @click="handleBack">{{ $t('509e5e05.5f4112') }}</el-button>
      </div>
    </template>
    <el-form
      ref="dataForm"
      v-loading="formLoad"
      :model="ruleForm"
      :rules="rules"
      class="ugc-form"
      label-width="120px"
    >
      <el-form-item :label="$t('509e5e05.6df5ba')" prop="p_order" class="notMBot">
        <el-row>
          <el-col :span="4">
            <el-checkbox v-model="is_top" @change="serialChanges">
              {{ $t('509e5e05.1b8e54') }}
            </el-checkbox>
          </el-col>
          <el-col :span="20">
            <span class="text text-ml">{{ $t('509e5e05.bd797f') }}</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-input
              v-model="ruleForm.p_order"
              :disabled="is_top"
              type="number"
              class="mipt"
              min="0"
              max="50"
            />
          </el-col>
          <el-col :span="20">
            <span class="text text-ml">{{ $t('509e5e05.8a10e3') }}</span>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item :label="$t('509e5e05.2b4a6a')" prop="badges" class="bottom-bor">
        <el-row>
          <el-col :span="16">
            <div v-if="ruleForm.badges" class="badgebar">
              <span class="text">{{ $t('509e5e05.374700') }}{{ relFlag.badge_name }}</span>
              <span class="el-icon el-icon-close" @click="removeFlag" />
            </div>
            <span v-else class="text">{{ $t('509e5e05.708c9d') }}</span>
          </el-col>
          <el-col :span="8" class="row-fright">
            <el-button size="small" type="primary" plain @click="flagModalHide(true)">
              {{ $t('509e5e05.9ead93') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item :label="$t('509e5e05.70dd91')" prop="title">
        <el-input v-model="ruleForm.title" maxlength="50" :show-word-limit="true" />
      </el-form-item>
      <el-form-item :label="$t('509e5e05.eea3bc')" prop="content">
        <el-input
          v-model="ruleForm.content"
          type="textarea"
          :rows="5"
          maxlength="900"
          :show-word-limit="true"
        />
      </el-form-item>

      <el-form-item :label="$t('509e5e05.051a44')" prop="topics">
        <el-row>
          <el-col :span="16">
            <span class="text"
              >{{ $t('509e5e05.e3c293')
              }}<b @click="pageTo('/marketing/ugc/ugctopic')">{{ $t('509e5e05.801fd8') }}</b
              >{{ $t('509e5e05.d72d54') }}</span
            >
          </el-col>
          <el-col :span="8" class="row-fright">
            <el-button size="small" type="primary" plain @click="topicModalHide(true)">
              {{ $t('509e5e05.6c83cc') }}
            </el-button>
          </el-col>
        </el-row>
        <el-row v-if="relTopics && relTopics.length" class="bgbar">
          <el-col v-for="(item, index) in relTopics" :key="index" class="baritem">
            <div :class="{ gray: item.status == '4' }" @click="removeTopic(index)">
              <span>{{ item.topic_name }}</span>
              <span class="el-icon el-icon-close" />
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item :label="$t('509e5e05.e0418a')" prop="video">
        <el-row>
          <el-col :span="16">
            <SpVideoPicker v-model="ruleForm.video" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item :label="$t('509e5e05.c9c99a')" prop="images">
        <SpImagePicker v-model="ruleForm.images" drag :max="9" />
      </el-form-item>

      <el-form-item :label="$t('509e5e05.479ddf')" prop="goods">
        <el-row>
          <el-col :span="16">
            <span class="text"
              >{{ $t('509e5e05.49cd1e') }} {{ goodslimit }} {{ $t('509e5e05.777ba9') }}</span
            >
          </el-col>
        </el-row>
        <SkuSelector
          ref="itemsSku"
          class="itemsSku"
          :limit="goodslimit"
          :data="relItems"
          @change="getItems"
        />
      </el-form-item>

      <el-form-item v-if="post_info ? post_info.status : false" :label="$t('509e5e05.6bf1f3')">
        <span class="text">
          {{ post_info.status_text }}
        </span>
      </el-form-item>
    </el-form>

    <flagModal
      v-if="flagModalShow"
      :dialog-is-show="flagModalShow"
      :duf-check-flag="relFlag"
      @cancelLabelsDialog="flagModalHide"
      @modalHandle="flagModalHandle"
    />

    <topicModal
      v-if="topicModalShow"
      :dialog-is-show="topicModalShow"
      :duf-check-topic="relTopics"
      @cancelLabelsDialog="topicModalHide"
      @modalHandle="topicModalHandle"
    />
  </SpPage>
</template>
<script>
import { Message } from 'element-ui'
import draggable from 'vuedraggable'
import imgPicker from '@/components/imageselect'
import videoPicker from '@/components/videoselect'
import SkuSelector from '@/components/function/skuSelector'
import UploadUtil from '@/utils/uploadUtil'
import { uploadQiniuPic } from '@/api/qiniu'
import { getNotesDetail, notesCreate } from '@/api/ugc'
import flagModal from './comps/flagModal'
import topicModal from './comps/topicModal'
export default {
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  components: {
    imgPicker,
    videoPicker,
    draggable,
    SkuSelector,
    flagModal,
    topicModal
  },
  data() {
    return {
      ruleForm: {
        p_order: 0,
        badges: null,
        topics: [],
        title: null,
        content: null,
        goods: [],
        cover: '',
        images: [],
        image_path: [],
        image_tag: [],
        video: ''
      },
      rules: {},
      post_info: {},
      is_top: false,
      formLoad: false,
      picsDialog: false,
      isGetPics: false,
      multiple: false,
      itemVideo: {},
      relItems: [],
      relImages: [],
      relTopics: [],
      relFlag: {},
      goodslimit: 9,
      topiclist: [],
      flagModalShow: false,
      topicModalShow: false,
      picdanger: false
    }
  },
  computed: {
    rules() {
      const valEmoJi = (rule, value, callback) => {
        const emoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
        if (emoji.test(value)) {
          return callback(new Error(rule.message))
        }
        callback()
      }
      const valPic = (rule, value, callback) => {
        if (!value || value.length < 1) {
          this.$data.picdanger = true
          return callback(new Error(rule.message))
        }
        callback()
      }
      return {
        title: [
          { required: true, message: this.$t('509e5e05.21ea5d'), trigger: 'blur' },
          { validator: valEmoJi, message: this.$t('509e5e05.f61920'), trigger: 'blur' }
        ],
        content: [{ required: true, message: this.$t('509e5e05.6234ee'), trigger: 'blur' }],
        images: [
          {
            required: true,
            validator: valPic,
            message: this.$t('509e5e05.260b4d'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetail()
    }
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },

    async getDetail() {
      const { id } = this.$route.query
      const { post_info } = await this.$api.ugc.getNotesDetail({
        post_id: id
      })
      if (post_info) {
        this.serializeFrom(post_info)
        this.post_info = post_info
      } else {
        await this.$confirm(this.$t('509e5e05.e030fb'), this.$t('509e5e05.02d981'), {
          confirmButtonText: this.$t('509e5e05.38cf16'),
          cancelButtonText: this.$t('509e5e05.625fb2')
        })
        this.$router.go(-1)
      }
    },

    serializeFrom(info) {
      var relItems = []
      var itemVideo = {}
      var images = []
      var ruleForm = {
        post_id: info.post_id,
        is_top: info.is_top,
        p_order: info.p_order,
        title: info.title,
        content: info.content.replace(/<br\/>/g, '\n'),
        video: info.video,
        video_ratio: info.video_ratio,
        images: JSON.parse(info.images).map((item) => item.url)
      }

      if (info.goods && info.goods.length) {
        info.goods.forEach((item) => {
          item.spec_items = []
          relItems.push(item)
        })
      }

      if (info.topics) {
        this.$data.relTopics = info.topics
      }

      if (info.badges) {
        this.$data.relFlag = info.badges[0]
        ruleForm.badges = [info.badges[0].badge_id]
      }

      this.$data.is_top = info.is_top > 0
      this.$data.relItems = relItems
      this.$data.itemVideo = itemVideo
      this.$data.ruleForm = ruleForm
    },

    pageTo(url) {
      this.$router.push({ path: url })
    },
    serialChanges() {
      const { ruleForm, is_top } = this.$data
      ruleForm.p_order = 0
    },

    handleAddItems() {
      this.$refs.itemsSku.handleGoodsDialogShow()
    },

    getItems(data) {
      let goods = []
      data.forEach((item, index) => {
        goods.push(item.goods_id)
      })
      this.ruleForm.goods = goods
      this.$forceUpdate()
    },

    flagModalHide(show) {
      this.$data.flagModalShow = show
    },

    flagModalHandle(flag) {
      //console.log('flagModalHandle',flag)
      this.ruleForm.badges = [flag.badge_id]
      this.relFlag = flag
      this.flagModalHide(false)
    },
    removeFlag() {
      this.ruleForm.badges = null
      this.relFlag = {}
    },
    topicModalHide(show) {
      this.$data.topicModalShow = show
    },
    topicModalHandle(topic) {
      this.relTopics = topic
      this.topicModalHide(false)
    },
    removeTopic(index) {
      const { relTopics } = this.$data
      relTopics.splice(index, 1)
    },

    confirmHandle() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          console.log(this.ruleForm)
          let params = JSON.parse(JSON.stringify(this.ruleForm))
          params.is_top = this.is_top ? 1 : 0
          params.cover = params.images[0]
          params.image_path = params.images
          params.content = params.content.replace(/\n/g, `<br/>`)
          params.topics = this.relTopics.map((item) => item.topic_id)
          params.images = JSON.stringify(
            params.images.map((item) => {
              return {
                url: item,
                topics: []
              }
            })
          )
          const { message } = await this.$api.ugc.notesCreate(params)
          this.$message.success(message)
          setTimeout(() => {
            this.$router.go(-1)
          }, 500)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="css">
.form-title {
  margin-bottom: 20px;
  margin-left: 24px;
  font-size: 14px;
  color: #333;
}
.ugc-form {
  width: 600px;
}
.ugc-form .text-ml {
  margin-left: 10px;
}
.ugc-form .notMBot .el-row {
  margin-bottom: 0 !important;
}
.ugc-form .text {
  line-height: 1.5;
  font-size: 12px;
  color: #999;
}
.ugc-form .text b {
  font-weight: bold;
  color: #02a7f0;
  cursor: pointer;
}
.ugc-form .text.underline {
  text-decoration: underline;
}
.ugc-form .row-fright {
  text-align: right;
}
.ugc-form .bottom-bor {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.ugc-form .bgbar {
  padding: 5px;
  background-color: #f3f3f3;
}
.ugc-form .bgbar .baritem {
  display: inline-block;
  width: auto;
  padding: 0 5px;
  margin: 5px;
  line-height: 2;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
}
.ugc-form .bgbar .baritem:hover {
  background: #ecf5ff;
  color: #409eff;
  border-color: #b3d8ff;
}
.ugc-form .bgbar .baritem .el-icon {
  margin-left: 5px;
}
.ugc-form .bgbar .baritem .gray {
  color: #ccc;
}
.videoing {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}
.badgebar {
  cursor: pointer;
}
.badgebar:hover .el-icon {
  color: #1480e3;
}
.goodspic {
  margin: 0 10px 10px 0;
  position: relative;
  float: left;
  text-align: center;
}
.goodspic .img-wrap {
  width: 86px;
  height: 86px;
  border: 1px solid #ddd;
  position: relative;
}
.goodspic .goodspic-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: none;
}
.goodspic .goodspic-mask .el-icon-delete {
  font-size: 18px;
  color: #fff;
  float: left;
  margin-top: 25px;
  margin-left: 15px;
}
.goodspic .goodspic-mask .el-icon-rank {
  font-size: 18px;
  color: #fff;
  float: left;
  margin-top: 25px;
  margin-left: 15px;
}
.goodspic .img-wrap:hover .goodspic-mask,
.ugc-form .goodspic:hover .goodspic-mask {
  display: block;
}
.ugc-form .livideo .goodspic-mask .el-icon-delete {
  margin-left: 35px;
}
.ugc-form /deep/ .el-image__inner {
  height: auto;
}
.ugc-form /deep/ .upload-box {
  margin: auto;
  width: 86px;
  height: 86px;
  line-height: 86px;
}
.ugc-form /deep/ .goodsdialogshow {
  display: none;
}
.ugc-form /deep/ .itemsSku .el-col {
  width: 50%;
}
.ugc-form /deep/ .el-form-item__label {
  padding-right: 40px;
}
.ugc-form /deep/ .video-box {
  margin: auto;
  width: 84px;
  height: 84px;
  background: #444;
}
.ugc-form /deep/ .video-box ~ .upload-box {
  display: none;
}
.ugc-form /deep/ .video-box .vjs-big-play-button {
  display: none;
}
.ugc-form /deep/ .mipt input[type='number']::-webkit-inner-spin-button {
  appearance: none;
}
</style>
