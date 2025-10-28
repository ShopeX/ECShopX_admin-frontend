<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :before-close="handleCancelLabelsDialog"
      :visible.sync="dialogIsShow"
      width="40%"
      top="3vh"
    >
      <div v-if="post_info.post_id" v-loading="formLoad" class="notesinfo">
        <el-form ref="dataForm" :model="ruleForm" :rules="rules" class="notes-form">
          <el-row>
            <el-col class="name" :span="4"> 笔记排序 </el-col>
            <el-col class="value" :span="20">
              <div class="serialBar">
                <el-checkbox v-model="is_top" @change="serialChanges"> 置项 </el-checkbox>
                <span class="text-ml"> 最多置顶两篇笔记，置顶后将自动排序最优。 </span>
              </div>
              <div class="serialBar">
                <el-form-item prop="serial" class="serial-ipt">
                  <el-input
                    v-model="ruleForm.p_order"
                    :disabled="is_top"
                    type="number"
                    class="serialInp"
                    size="small"
                    min="0"
                    max="50"
                    @change="updataNotes"
                  />
                  <span class="text-ml"> 默认为0，排序数字越小优先级越高；相同优先级下 </span>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row class="flag-bar">
            <el-col class="name" :span="4"> 笔记角标 </el-col>
            <el-col class="value" :span="20">
              <div v-if="ruleForm.badges" class="badgebar">
                <span class="text"> 已选：{{ relFlag.badge_name }} </span>
                <span class="el-icon el-icon-close" @click="removeFlag" />
              </div>
              <span v-else class="text">请选择</span>

              <el-button
                size="small"
                type="primary"
                class="flagBtn"
                plain
                @click="flagModalHide(true)"
              >
                选择角标
              </el-button>
            </el-col>
          </el-row>
        </el-form>

        <el-row>
          <el-col class="name" :span="4"> 笔记标题 </el-col>
          <el-col class="value" :span="20">
            {{ post_info.title }}
          </el-col>
        </el-row>

        <el-row>
          <el-col class="name" :span="4"> 笔记描述 </el-col>
          <el-col class="value" :span="20">
            <pre class="info-content" v-html="post_info.content" />
          </el-col>
        </el-row>

        <el-row v-if="post_info.topics">
          <el-col class="name" :span="4"> 关联话题 </el-col>
          <el-col class="value" :span="20">
            <span v-for="(item, index) in post_info.topics" :key="index" class="tag">{{
              item.topic_name
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="name" :span="4"> 笔记图片 </el-col>
          <el-col class="value imgflxe" :span="20">
            <div v-if="post_info.video" class="img">
              <video id="video" class="video">
                <source :src="post_info.video" type="video/mp4">
              </video>
              <div class="upload-box" @click="magnifyImg(post_info.video, true)">
                <div class="iconfont icon-play" />
              </div>
            </div>
            <div
              v-for="(item, index) in JSON.parse(post_info.images)"
              :key="index"
              class="img"
              @click="magnifyImg(item.url)"
            >
              <img :src="item.url" alt="">
            </div>
          </el-col>
        </el-row>

        <el-row v-if="taglist.length">
          <el-col class="name" :span="4"> 图片内Tag </el-col>
          <el-col class="value" :span="20">
            <span v-for="(tag, index) in taglist" :key="index" class="tag">{{ tag.tag_name }}</span>
          </el-col>
        </el-row>

        <el-row v-if="post_info.goods">
          <el-col class="name" :span="4"> 推荐商品 </el-col>
          <el-col class="value imgflxe" :span="20">
            <div v-for="(item, index) in post_info.goods" :key="index" class="goods">
              <div class="pics">
                <img :src="item.pics" alt="">
              </div>
              <div class="text">
                {{ item.item_name }}
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row v-if="post_info.userInfo" class="bor-top">
          <el-col class="name" :span="4"> 用户昵称 </el-col>
          <el-col class="value" :span="20">
            <div class="user-name" @click="toUserInfo(post_info.userInfo)">
              {{ post_info.userInfo.nickname }}
            </div>
          </el-col>
        </el-row>

        <el-row v-if="post_info.userInfo">
          <el-col class="name" :span="4"> 手机号 </el-col>
          <el-col class="value" :span="20">
            {{ post_info.userInfo.mobile }}
          </el-col>
        </el-row>

        <el-row>
          <el-col class="name" :span="4"> 笔记时间 </el-col>
          <el-col class="value" :span="20">
            {{ post_info.created_text }}
          </el-col>
        </el-row>

        <el-row class="bor-top">
          <el-col class="name" :span="4"> 当前状态 </el-col>
          <el-col class="value" :span="20">
            {{ post_info.status_text }}
          </el-col>
        </el-row>
      </div>
      <div v-if="!post_info.post_id" class="tips">id {{ post_id }} 笔记:{{ errInfo }}</div>
      <div v-if="post_info.post_id" slot="footer">
        <el-button :type="post_info.status == '0' ? 'primary' : 'danger'" @click="handleAudit">
          {{ post_info.status == '0' ? '审核' : '重审' }}
        </el-button>
        <el-button @click="handleCancelLabelsDialog"> 取消 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :before-close="magnifyHide"
      :visible.sync="magnifyShow"
      class="pic-dialog"
      width="600px"
      top="3vh"
    >
      <div class="magnify" @click="magnifyHide">
        <video v-if="magnifyVideo" id="preview-video" class="video" controls autoplay>
          <source :src="magnifyVideo" type="video/mp4">
        </video>

        <img v-if="magnifySrc" :src="magnifySrc" alt="">
      </div>
    </el-dialog>

    <flagModal
      :dialog-is-show="flagModalShow"
      @cancelLabelsDialog="flagModalHide"
      @modalHandle="flagModalHandle"
    />
  </div>
</template>

<script>
import flagModal from './flagModal'
import { getNotesDetail, notesSimpleEdit } from '@/api/ugc'
export default {
  components: {
    flagModal
  },
  props: {
    post_id: String,
    dialogIsShow: Boolean
  },
  data() {
    const valNumer = (rule, value, callback) => {
      //console.log('valNumer',value,rule)
      if (value < 0) {
        return callback(new Error('数值不能小于0'))
      } else if (value > rule.max) {
        return callback(new Error('数值不能超过' + rule.max))
      } else {
        callback()
      }
    }
    return {
      magnifyShow: false,
      magnifySrc: null,
      magnifyVideo: null,
      errInfo: null,
      formLoad: false,
      dialogTitle: '笔记详情',
      post_info: {},
      taglist: [],
      is_top: false,
      flagModalShow: false,
      relFlag: {},
      ruleForm: {
        is_top: 0,
        p_order: 0,
        flag: null
      },
      rules: {
        p_order: [
          { required: true, message: '请填写序号', trigger: 'change' },
          { validator: valNumer, max: 5, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    post_id: {
      handler(newValue, oldValue) {
        this.fetch()
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    fetch() {
      const that = this
      const { post_id } = this.$props
      // console.log('post_id',post_id)
      this.$data.formLoad = true
      getNotesDetail({ post_id }).then(
        res => {
          var post_info = res.data.data.post_info
          var taglist = []
          var relFlag = {}
          var ruleForm = {
            p_order: post_info.p_order,
            is_top: post_info.is_top
          }
          const imageList = JSON.parse(post_info.images)
          imageList.forEach(item => {
            if (item.tags) {
              taglist = [...taglist, ...item.tags]
            }
          })

          if (post_info.badges) {
            ruleForm.badges = [post_info.badges[0].badge_id]
            relFlag = post_info.badges[0]
          }

          that.$data.post_info = post_info
          that.$data.taglist = taglist
          that.$data.ruleForm = ruleForm
          that.$data.relFlag = relFlag
          that.$data.is_top = post_info.is_top == 1
          that.$data.formLoad = false
          //console.log('getNotesDetail',ruleForm)
        },
        err => {
          //console.log('err',err);
          that.$data.post_info = {}
          that.$data.errInfo = err
          that.$data.formLoad = false
        }
      )
    },
    handleCancelLabelsDialog() {
      this.$emit('cancelLabelsDialog', false)
    },
    handleAudit() {
      const { post_info, ruleForm } = this.$data
      var params = {
        id_set: [post_info.post_id],
        auditdiff: false,
        aloneAuditType: 'pass',
        option: ruleForm
      }

      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          //  console.log('handleAudit',params)
          this.handleCancelLabelsDialog()
          this.$emit('notesAuditHandle', params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    serialChanges() {
      const { is_top } = this.$data
      this.ruleForm.p_order = 0
      if (is_top) {
        this.ruleForm.is_top = 1
      } else {
        this.ruleForm.is_top = 0
      }
      this.updataNotes()
    },
    updataNotes() {
      const that = this
      const { post_info, ruleForm } = this.$data
      ruleForm.post_id = post_info.post_id
      //console.log('ruleForm',ruleForm)
      notesSimpleEdit(ruleForm).then(
        res => {
          var msg = res.data.data.message
          //console.log('notesSimpleEdit res',res);
          this.$message({
            type: 'success',
            message: msg,
            duration: 1500,
            onClose() {
              that.$emit('modalHandle')
            }
          })
        },
        err => {
          console.log('notesSimpleEdit err', err)
        }
      )
    },
    magnifyHide() {
      this.$data.magnifyShow = false
      this.$data.magnifyVideo = null
      this.$data.magnifySrc = null
    },
    magnifyImg(src, video) {
      if (video) {
        this.$data.magnifyVideo = src
      } else {
        this.$data.magnifySrc = src
      }
      this.$data.magnifyShow = true
    },
    toUserInfo(item) {
      this.$router.push({ path: '/member/member', query: { mobile: item.mobile } })
    },
    flagModalHide(show) {
      this.$data.flagModalShow = show
    },
    flagModalHandle(flag) {
      // console.log('flagModalHandle',flag)
      this.ruleForm.badges = [flag.badge_id]
      this.$data.relFlag = flag
      this.flagModalHide(false)
      this.updataNotes()
    },
    removeFlag() {
      this.ruleForm.badges = null
      this.relFlag = {}
      this.updataNotes()
    }
  }
}
</script>
<style scoped lang="css">
.notesinfo .name {
  color: #999;
}
.notesinfo .el-row {
  margin-bottom: 20px !important;
}
.notesinfo .bor-top {
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.notesinfo .tag {
  margin: 5px;
  padding: 2px 5px;
  border: 1px solid #333;
  border-radius: 5px;
}
.notesinfo .imgflxe {
  display: flex;
  flex-wrap: wrap;
}
.notesinfo .img {
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  line-height: 0;
  cursor: pointer;
  background-color: #f3f3f3;
}
.notesinfo .img img {
  max-width: 100%;
}
.notesinfo .img .upload-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.notesinfo .img .upload-box .iconfont {
  position: relative;
  left: 35px;
  top: 40px;
  color: #fff;
}
.notesinfo .goods {
  display: flex;
  width: 33%;
  margin-bottom: 10px;
}
.notesinfo .goods .pics {
  margin-right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  overflow: hidden;
  line-height: 0;
}
.notesinfo .goods .pics img {
  max-width: 100%;
}
.notesinfo .goods .text {
  width: calc(100% - 50px);
  margin-right: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 40px;
}
.notesinfo .fright {
  text-align: right;
}
.notesinfo .user-name {
  color: #02a7f0;
  cursor: pointer;
}
.notesinfo .text-ml {
  color: #999;
}
.notesinfo .info-content {
  margin: auto;
  max-height: 200px;
  overflow: hidden;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
.notesinfo .info-content::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #fff;
}
.notesinfo .info-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #ddd;
}
.notesinfo .serialBar {
  margin-bottom: 10px;
}
.notesinfo .serialBar .el-form-item {
  margin-bottom: 0;
}
.notesinfo .serialInp {
  width: 60px;
  margin-right: 10px;
}
.notesinfo .tagbar {
  display: inline-block;
}
.notesinfo .flag-bar {
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.notesinfo .flag-bar .value {
  position: relative;
}
.notesinfo .flagBtn {
  position: absolute;
  top: -10px;
  right: 0;
}
.notesinfo .last-name {
  line-height: 40px;
}
.notesinfo .video {
  width: 100%;
}
.magnify {
  text-align: center;
}
.magnify img {
  max-width: 100%;
  max-height: 800px;
}
.magnify .video {
  width: 100%;
  max-height: 800px;
}
.badgebar {
  cursor: pointer;
}
.badgebar:hover .el-icon {
  color: #1480e3;
}
.pic-dialog /deep/ .el-dialog__body {
  padding-top: 20px;
}
.notesinfo /deep/ .serialBar .el-checkbox {
  width: 70px;
}
.notesinfo /deep/ .serialBar .el-checkbox__label {
}
.notesinfo /deep/ .serialInp input[type='number']::-webkit-inner-spin-button {
  appearance: none;
}
</style>
