<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-dialog
      :title="dialogTitleText"
      :before-close="handleCancelLabelsDialog"
      :visible.sync="dialogIsShow"
      width="40%"
    >
      <div class="notesinfo">
        <el-row>
          <el-col class="name" :span="4">{{ $t('ed6f1bab.034484') }}</el-col>
          <el-col class="value" :span="20">
            <pre class="info-content" v-html="commentInfo.content" />
          </el-col>
        </el-row>

        <el-row v-if="commentInfo.userInfo" class="bor-top">
          <el-col class="name" :span="4">{{ $t('bf192462.9a56bb') }}</el-col>
          <el-col class="value" :span="20">
            <div class="user-name" @click="toUserInfo(commentInfo.userInfo)">
              {{ commentInfo.userInfo.nickanme }}
            </div>
          </el-col>
        </el-row>

        <el-row v-if="commentInfo.userInfo">
          <el-col class="name" :span="4">{{ $t('6b57cb80.ce2bf3') }}</el-col>
          <el-col class="value" :span="20">
            {{ commentInfo.userInfo.mobile }}
          </el-col>
        </el-row>

        <el-row>
          <el-col class="name" :span="4">{{ $t('ed6f1bab.a666ad') }}</el-col>
          <el-col class="value" :span="20">
            {{ commentInfo.created_text }}
          </el-col>
        </el-row>

        <el-row class="bor-top">
          <el-col class="name" :span="4">{{ $t('bf192462.6bf1f3') }}</el-col>
          <el-col class="value" :span="20">
            {{ commentInfo.status_text }}
          </el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button :type="commentInfo.status == '0' ? 'primary' : 'danger'" @click="handleAudit">
          {{ commentInfo.status == '0' ? $t('e240ae54.cf13b1') : $t('bf192462.ccfd81') }}
        </el-button>
        <el-button @click="handleCancelLabelsDialog">{{ $t('09b91dec.625fb2') }}</el-button>
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
      dialogTitle: null,
      commentInfo: {}
    }
  },
  computed: {
    dialogTitleText() {
      return this.$t('23fd6eb4.f4a0f5')
    }
  },
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
        (res) => {
          var commentInfo = res.data.data.comment_info
          that.$data.commentInfo = commentInfo
          //console.log('getNotesDetail',commentInfo)
        },
        (err) => {
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
