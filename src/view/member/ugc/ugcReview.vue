<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-button type="primary" @click="auditHandle"> 批量审核 </el-button>
      </el-col>

      <el-col :span="6">
        <el-input
          v-model="searchkey"
          :placeholder="searPlace"
          @keyup.enter.native="searchData('searchkey')"
        >
          <el-select
            slot="prepend"
            v-model="searchtype"
            class="barSelect"
            placeholder="请选择"
            @change="changeName"
          >
            <el-option label="用户昵称" value="nickname" />
            <el-option label="用户手机号" value="mobile" />
            <el-option label="标题关键字" value="content" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchData('searchkey')" />
        </el-input>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="全部状态" name="first">
        <reviewlist
          ref="notestable"
          :tmp-data="reviewList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
          @viewDetails="viewDetails"
        />
      </el-tab-pane>
      <el-tab-pane label="待审核" name="second">
        <reviewlist
          ref="notestable"
          :tmp-data="reviewList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
          @viewDetails="viewDetails"
        />
      </el-tab-pane>
      <el-tab-pane label="已通过" name="third">
        <reviewlist
          ref="notestable"
          :tmp-data="reviewList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
          @viewDetails="viewDetails"
        />
      </el-tab-pane>
      <el-tab-pane label="已拒绝" name="fourth">
        <reviewlist
          ref="notestable"
          :tmp-data="reviewList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
          @viewDetails="viewDetails"
        />
      </el-tab-pane>
    </el-tabs>
    <div class="content-padded content-center">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagers.total"
        :page-size="params.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <auditNote
      audit-type="review"
      :dialog-is-show="auditDialogShow"
      :auditdiff="auditdiff"
      :duf-status="dufStatus"
      @notesAuditHandle="auditNote"
      @cancelLabelsDialog="cancelAuditDialog"
    />

    <viewReview
      v-if="comment_id"
      :dialog-is-show="reviewDialogShow"
      :comment_id="comment_id"
      @notesAuditHandle="selectNotes"
      @cancelLabelsDialog="cancelReviewDialog"
    />
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getComment, commentVerify } from '@/api/ugc'
import reviewlist from './comps/reviewlist'
import auditNote from './comps/auditNote'
import viewReview from './comps/viewReview'

export default {
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  components: {
    reviewlist,
    auditNote,
    viewReview
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 10,
        status: null
      },
      pagers: {
        total: 0
      },
      reviewList: [],
      id_set: [],
      searchkey: '',
      searchtype: 'nickname',
      searPlace: '请输入昵称',
      auditdiff: false,
      auditDialogShow: false,
      dufStatus: null,
      comment_id: null,
      reviewDialogShow: false
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList()
    },
    researchMsg(type) {
      var msg = '请输入昵称'
      if (type == 'content') {
        msg = '请输入关键字'
      } else if (type == 'mobile') {
        msg = '请输入手机号'
      }
      this.params.nickname = null
      this.params.content = null
      this.params.mobile = null
      return msg
    },
    searchData(type) {
      const { searchkey, searchtype } = this.$data
      //console.log('searchData',type)
      if (type == 'searchkey' && searchkey == '') {
        var message = this.researchMsg(searchtype)
        this.$message({
          type: 'error',
          message,
          duration: 1500
        })
        return false
      }
      this.$data.pagers = { total: 0 }
      this.params.page = 1
      this.clearAudioData()
      this.getDataList()
    },
    changeName() {
      const { searchtype } = this.$data
      var searPlace = this.researchMsg(searchtype)
      this.$data.searPlace = searPlace
    },
    clearAudioData() {
      this.$data.id_set = []
      this.$data.aloneForm = {}
      this.$data.auditdiff = false
    },
    getDataList() {
      const that = this
      var { activeName, params, searchtype, searchkey } = this.$data
      if (searchkey != '') {
        params[searchtype] = searchkey
      } else {
        params[searchtype] = null
      }
      that.loading = true
      getComment(params).then(
        (res) => {
          var { list, total_count } = res.data.data
          //console.log('res',res)
          that.$data.reviewList = list
          that.$data.pagers = { total: total_count }
          that.loading = false
        },
        (err) => {
          that.$data.loading = false
        }
      )
      // console.log('getDataList',params.status)
    },
    handleClick(tab, event) {
      var { activeName, params } = this.$data

      if (this.activeName === 'first') {
        params.status = null
      } else if (this.activeName === 'second') {
        params.status = '0'
      } else if (this.activeName === 'third') {
        params.status = '1'
      } else if (this.activeName === 'fourth') {
        params.status = '4'
      }
      //this.$data.params.status = tab;
      this.searchData()
    },
    viewDetails(id) {
      //console.log('viewDetails',id)
      this.$data.comment_id = id
      this.cancelReviewDialog(true)
    },
    cancelReviewDialog(show) {
      this.$data.reviewDialogShow = show
    },
    cancelAuditDialog(show) {
      this.$data.auditDialogShow = show
    },
    selectNotes(params) {
      //console.log('selectNotes',params)
      this.$data.id_set = params.id_set
      this.$data.auditdiff = params.auditdiff
      if (params.aloneAuditType) {
        this.$data.dufStatus = params.aloneAuditType
        this.auditHandle()
      } else {
        this.$data.dufStatus = 'pass'
      }
    },
    auditHandle() {
      const { id_set, dufStatus } = this.$data
      //console.log('点击审核 auditHandle',dufStatus,id_set);
      if (id_set.length) {
        this.cancelAuditDialog(true)
      } else {
        this.$message({
          type: 'error',
          message: '请选择评论'
        })
      }
    },
    auditNote(params) {
      const { id_set, aloneForm } = this.$data
      var message = '发布成功'
      if (params.notesModalType == 'refuse') {
        message = '下架成功'
      }
      if (aloneForm) {
        params = { ...params, ...aloneForm }
      }
      params.comment_id = id_set
      //console.log('进行审核 auditNote',params);
      commentVerify(params).then((res) => {
        //console.log('res',res)
        var msg = res.data.data.message
        this.cancelAuditDialog(false)
        this.clearAudioData()
        this.getDataList()
        this.$message({
          type: 'success',
          message: msg
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.tips {
  color: #999;
  font-size: 12px;
}
.barSelect {
  width: 120px;
}
</style>
