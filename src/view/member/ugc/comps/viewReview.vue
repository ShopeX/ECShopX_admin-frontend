<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :before-close="handleCancelLabelsDialog"
      :visible.sync="dialogIsShow"
      width="40%"
    >
      <div class="notesinfo">
        <el-row>
          <el-col class="name" :span="4"> 评论内容 </el-col>
          <el-col class="value" :span="20">
            <pre class="info-content" v-html="commentInfo.content" />
          </el-col>
        </el-row>

        <el-row v-if="commentInfo.userInfo" class="bor-top">
          <el-col class="name" :span="4"> 用户昵称 </el-col>
          <el-col class="value" :span="20">
            <div class="user-name" @click="toUserInfo(commentInfo.userInfo)">
              {{ commentInfo.userInfo.nickanme }}
            </div>
          </el-col>
        </el-row>

        <el-row v-if="commentInfo.userInfo">
          <el-col class="name" :span="4"> 手机号 </el-col>
          <el-col class="value" :span="20">
            {{ commentInfo.userInfo.mobile }}
          </el-col>
        </el-row>

        <el-row>
          <el-col class="name" :span="4"> 评论时间 </el-col>
          <el-col class="value" :span="20">
            {{ commentInfo.created_text }}
          </el-col>
        </el-row>

        <el-row class="bor-top">
          <el-col class="name" :span="4"> 当前状态 </el-col>
          <el-col class="value" :span="20">
            {{ commentInfo.status_text }}
          </el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button :type="commentInfo.status == '0' ? 'primary' : 'danger'" @click="handleAudit">
          {{ commentInfo.status == '0' ? '审核' : '重审' }}
        </el-button>
        <el-button @click="handleCancelLabelsDialog"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCommentDetail } from '@/api/ugc'
export default {
  components: {},
  props: {
    comment_id: String,
    dialogIsShow: Boolean
  },
  data() {
    return {
      dialogTitle: '评论详情',
      commentInfo: {}
    }
  },
  computed: {},
  watch: {
    comment_id: {
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
      const { comment_id } = this.$props
      //console.log('comment_id',comment_id)
      getCommentDetail({ comment_id }).then(
        res => {
          var commentInfo = res.data.data.comment_info
          that.$data.commentInfo = commentInfo
          //console.log('getNotesDetail',commentInfo)
        },
        err => {
          //console.log('err',err);
          that.$data.post_info = {}
          that.$data.errInfo = err
        }
      )
    },
    handleCancelLabelsDialog() {
      this.$emit('cancelLabelsDialog', false)
    },
    handleAudit() {
      const { commentInfo } = this.$data
      var params = {
        id_set: [commentInfo.comment_id],
        auditdiff: false,
        aloneAuditType: 'pass'
      }
      this.handleCancelLabelsDialog()
      this.$emit('notesAuditHandle', params)
    },
    toUserInfo(user) {
      //console.log('user',user)
      this.$router.push({ path: '/member/member', query: { mobile: user.mobile } })
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
.notesinfo .user-name {
  color: #02a7f0;
  cursor: pointer;
}
.notesinfo .fright {
  text-align: right;
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
</style>
