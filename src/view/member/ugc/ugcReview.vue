<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-row :gutter="20" class="action-container">
      <el-col :span="18">
        <el-button type="primary" @click="auditHandle">{{ $t('cadc1ce1.9fface') }}</el-button>
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
            :placeholder="$t('cadc1ce1.708c9d')"
            @change="changeName"
          >
            <el-option :label="$t('cadc1ce1.9a56bb')" value="nickname" />
            <el-option :label="$t('cadc1ce1.18b642')" value="mobile" />
            <el-option :label="$t('cadc1ce1.e16f84')" value="content" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchData('searchkey')" />
        </el-input>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('cadc1ce1.443483')" name="first">
        <reviewlist
          ref="notestable"
          :tmp-data="reviewList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
          @viewDetails="viewDetails"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('cadc1ce1.5cb424')" name="second">
        <reviewlist
          ref="notestable"
          :tmp-data="reviewList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
          @viewDetails="viewDetails"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('cadc1ce1.ecfa64')" name="third">
        <reviewlist
          ref="notestable"
          :tmp-data="reviewList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
          @viewDetails="viewDetails"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('cadc1ce1.81233d')" name="fourth">
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
    <div class="mt-4 text-right">
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
  </SpPage>
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
      searPlace: '',
      auditdiff: false,
      auditDialogShow: false,
      dufStatus: null,
      comment_id: null,
      reviewDialogShow: false
    }
  },
  mounted() {
    this.$data.searPlace = this.researchMsg(this.$data.searchtype)
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
      var msg = this.$t('cadc1ce1.916ff9')
      if (type == 'content') {
        msg = this.$t('cadc1ce1.db91cb')
      } else if (type == 'mobile') {
        msg = this.$t('cadc1ce1.6e4f4b')
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
          message: this.$t('cadc1ce1.429f88')
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
