<template>
  <div>
    <div class="form-title">编辑品牌笔记</div>
    <el-form
      ref="dataForm"
      v-loading="formLoad"
      :model="ruleForm"
      :rules="rules"
      class="ugc-form"
      label-width="120px"
    >
      <el-form-item label="笔记排序" prop="p_order" class="notMBot">
        <el-row>
          <el-col :span="4">
            <el-checkbox v-model="is_top" @change="serialChanges"> 置项 </el-checkbox>
          </el-col>
          <el-col :span="20">
            <span class="text text-ml"> 最多置顶两篇笔记，置顶后将自动排序最优。 </span>
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
            <span class="text text-ml"> 默认为0，排序数字越小优先级越高；相同优先级下 </span>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="笔记角标" prop="badges" class="bottom-bor">
        <el-row>
          <el-col :span="16">
            <div v-if="ruleForm.badges" class="badgebar">
              <span class="text"> 已选：{{ relFlag.badge_name }} </span>
              <span class="el-icon el-icon-close" @click="removeFlag" />
            </div>
            <span v-else class="text">请选择</span>
          </el-col>
          <el-col :span="8" class="row-fright">
            <el-button size="small" type="primary" plain @click="flagModalHide(true)">
              打角标
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="笔记标题" prop="title">
        <el-input v-model="ruleForm.title" maxlength="30" :show-word-limit="true" />
      </el-form-item>
      <el-form-item label="笔记描述" prop="content">
        <el-input
          v-model="ruleForm.content"
          type="textarea"
          :rows="5"
          maxlength="900"
          :show-word-limit="true"
        />
      </el-form-item>

      <el-form-item label="关联话题" prop="topics">
        <el-row>
          <el-col :span="16">
            <span class="text"
              >可多选，话题可在<b @click="pageTo('/marketing/ugc/ugctopic')">笔记话题配置</b
              >菜单中新建/修改</span
            >
          </el-col>
          <el-col :span="8" class="row-fright">
            <el-button size="small" type="primary" plain @click="topicModalHide(true)">
              选择话题
            </el-button>
          </el-col>
        </el-row>
        <el-row v-if="relTopics && relTopics.length" class="bgbar">
          <el-col v-for="(item, index) in relTopics" :key="index" class="baritem">
            <div :class="{ 'gray': item.status == '4' }" @click="removeTopic(index)">
              <span>{{ item.topic_name }}</span>
              <span class="el-icon el-icon-close" />
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="笔记视频" prop="video">
        <el-row>
          <el-col :span="16">
            <SpVideoPicker v-model="ruleForm.video" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="笔记图片" prop="images">
        <SpImagePicker v-model="ruleForm.images" drag :max="9" />
      </el-form-item>

      <el-form-item label="推荐商品" prop="goods">
        <el-row>
          <el-col :span="16">
            <span class="text">最多可选 {{ goodslimit }} 件商品</span>
          </el-col>
          <el-col :span="8" class="row-fright">
            <el-button size="small" type="primary" plain @click="handleAddItems">
              选择商品
            </el-button>
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

      <el-form-item v-if="post_info ? post_info.status : false" label="当前状态">
        <span class="text">
          {{ post_info.status_text }}
        </span>
      </el-form-item>

      <el-form-item>
        <el-button v-if="!ruleForm.post_id" type="primary" @click="confirmHandle('ruleForm')">
          创建并发布
        </el-button>

        <el-button v-if="ruleForm.post_id" type="primary" @click="confirmHandle('ruleForm')">
          确定
        </el-button>
        <el-button @click="handleBack"> 返回 </el-button>
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
  </div>
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
    const valEmoJi = (rule, value, callback) => {
      let emoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
      let isEmoji = emoji.test(value)
      // console.log('valEmoJi',rule)
      if (isEmoji) {
        return callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    const valPic = (rule, value, callback) => {
      const { ruleForm } = this.$data
      // console.log('valPic',rule, value)
      if (value.length < 1) {
        this.$data.picdanger = true
        return callback(new Error('请选择图片'))
      } else {
        callback()
      }
    }
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
      rules: {
        title: [
          { required: true, message: '请填写标题', trigger: 'blur' },
          {
            validator: valEmoJi,
            message: '标题仅支持汉字、英文、数字，不支持emoji',
            trigger: 'blur'
          }
        ],
        content: [{ required: true, message: '请填写笔记描述', trigger: 'blur' }],
        images: [{ required: true, validator: valPic, trigger: 'blur' }]
      },
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
        await this.$confirm(`笔记不存在,可能已删除`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
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
        content: info.content,
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
.goodspic .goodspic-mask .icon-trash-alt {
  font-size: 18px;
  color: #fff;
  float: left;
  margin-top: 25px;
  margin-left: 15px;
}
.goodspic .goodspic-mask .icon-arrows-alt {
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
.ugc-form .livideo .goodspic-mask .icon-trash-alt {
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
