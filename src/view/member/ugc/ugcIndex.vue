<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <el-row>
        <el-col :span="2">
          <div class="p-title">{{ $t('a88979f1.34696a') }}</div>
        </el-col>
        <el-col :span="16">
          <div class="tips" v-html="$t('a88979f1.428920') + '<br />' + $t('a88979f1.1cbedd')" />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="searchkey"
            :placeholder="searPlace"
            size="small"
            @keyup.enter.native="searchData('searchkey')"
          >
            <el-select
              slot="prepend"
              v-model="searchtype"
              class="barSelect"
              :placeholder="$t('a88979f1.708c9d')"
              @change="changeName"
            >
              <el-option :label="$t('a88979f1.9a56bb')" value="nickname" />
              <el-option :label="$t('a88979f1.18b642')" value="mobile" />
              <el-option :label="$t('a88979f1.e16f84')" value="content" />
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="searchData('searchkey')" />
          </el-input>
        </el-col>
      </el-row>
      <el-row class="margin-col">
        <el-col>
          <el-button type="primary" @click="auditHandle(false)">
{{
            $t('a88979f1.67cc91')
          }}
</el-button>

          <el-button type="primary" plain @click="addNote">{{ $t('a88979f1.4727b5') }}</el-button>

          <!-- <el-button
            type="primary"
            plain
            @click="delNote"
          >
            删除笔记(测试用)
          </el-button> -->

          <el-button type="primary" plain @click="handleNotesFlag">
{{
            $t('a88979f1.9ead93')
          }}
</el-button>
          <span class="marbor" />
          <el-select
            v-model="filt_badge"
            class="searSelect"
            filterable
            :placeholder="$t('a88979f1.9c999f')"
            @change="searchData"
          >
            <el-option :label="$t('a88979f1.9c999f')" :value="null" />
            <el-option
              v-for="(item, index) in flagList"
              :key="index"
              :label="item.badge_name"
              :value="item.badge_id"
            />
          </el-select>

          <el-select
            v-model="params.source"
            class="searSelect"
            filterable
            :placeholder="$t('a88979f1.1ccf4b')"
            @change="searchData"
          >
            <el-option :label="$t('a88979f1.1ccf4b')" :value="null" />
            <el-option :label="$t('a88979f1.8ba19b')" value="2" />
            <el-option :label="$t('a88979f1.900341')" value="1" />
          </el-select>
          <span class="marbor" />

          <el-button plain @click="officialModalHide(true)">{{ $t('a88979f1.1e27f5') }}</el-button>
          <span class="marbor" />
          <el-switch
            v-model="video_enable"
            active-color="#13ce66"
            :active-text="$t('a88979f1.95d8f5')"
            @change="setUGCSetting"
          />
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('a88979f1.443483')" name="first">
          <noteslist
            ref="notestable"
            :tmp-data="noteList"
            :loading="loading"
            handle-type="view"
            @selectNotes="selectNotes"
            @viewDetails="viewDetails"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('a88979f1.5cb424')" name="second">
          <noteslist
            :tmp-data="noteList"
            :loading="loading"
            handle-type="view"
            @selectNotes="selectNotes"
            @viewDetails="viewDetails"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('a88979f1.dca0c1')" name="third">
          <noteslist
            :tmp-data="noteList"
            :loading="loading"
            handle-type="view"
            @selectNotes="selectNotes"
            @viewDetails="viewDetails"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('a88979f1.ca9084')" name="fourth">
          <noteslist
            :tmp-data="noteList"
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
        audit-type="note"
        :dialog-is-show="auditDialogShow"
        :auditdiff="auditdiff"
        :duf-status="dufStatus"
        @notesAuditHandle="auditNote"
        @cancelLabelsDialog="cancelAuditDialog"
      />

      <viewNotes
        v-if="post_id"
        :dialog-is-show="notesDialogShow"
        :post_id="post_id"
        @notesAuditHandle="selectNotes"
        @cancelLabelsDialog="cancelNotesDialog"
        @modalHandle="getDataList"
      />

      <flagModal
        v-if="flagModalShow"
        :dialog-is-show="flagModalShow"
        @cancelLabelsDialog="flagModalHide"
        @modalHandle="flagModalHandle"
      />

      <settingOfficial
        v-if="settingshow"
        :dialog-is-show="settingshow"
        @cancelLabelsDialog="officialModalHide"
      />
    </SpPage>
  </SpRouterView>
</template>
<script>
import { Message } from 'element-ui'
import {
  getNotes,
  notesVerify,
  notesSetting,
  notesDelete,
  getBadge,
  getUGCSetting,
  setUGCSetting,
  batchSetBadges
} from '@/api/ugc'
import noteslist from './comps/noteslist'
import auditNote from './comps/auditNote'
import viewNotes from './comps/viewNotes'
import flagModal from './comps/flagModal'
import settingOfficial from './comps/settingOfficial'
export default {
  components: {
    noteslist,
    auditNote,
    viewNotes,
    flagModal,
    settingOfficial
  },
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      params: {
        page: 1,
        pageSize: 10,
        status: null,
        source: null
      },
      pagers: {
        total: 0
      },
      noteList: [],
      flagList: [],
      aloneForm: {},
      post_id: null,
      id_set: [],
      filt_badge: null,
      searchkey: '',
      searchtype: 'nickname',
      searPlace: '',
      auditdiff: false,
      dufStatus: null,
      auditDialogShow: false,
      notesDialogShow: false,
      flagModalShow: false,
      video_enable: false,
      settingshow: false
    }
  },
  watch: {
    $route(to, from) {
      const { path } = this.$route
      //console.log('path',path)
      if (path.indexOf('editor') === -1) {
        this.searchData()
      }
    }
  },
  mounted() {
    const { path } = this.$route
    this.$data.searPlace = this.researchMsg(this.$data.searchtype)
    if (path.indexOf('editor') === -1) {
      this.searchData()
      this.getFlagsList()
      this.getVideoSetting()
    }
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
    viewDetails(id) {
      // console.log('viewDetails',id)
      this.$data.post_id = id
      this.cancelNotesDialog(true)
    },
    clearAudioData() {
      this.$data.id_set = []
      this.$data.aloneForm = {}
      this.$data.auditdiff = false
    },
    researchMsg(type) {
      var msg = this.$t('a88979f1.916ff9')
      if (type == 'title') {
        msg = this.$t('a88979f1.db91cb')
      } else if (type == 'mobile') {
        msg = this.$t('a88979f1.6e4f4b')
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
    getDataList() {
      const that = this
      const { activeName, params, searchkey, searchtype, filt_badge } = this.$data
      if (searchkey != '') {
        params[searchtype] = searchkey
      } else {
        params[searchtype] = null
      }

      if (filt_badge) {
        params.badges = [filt_badge]
      } else {
        params.badges = null
      }

      that.$data.loading = true
      getNotes(params).then(
        (res) => {
          var { list, total_count } = res.data.data
          //console.log('res',res)
          that.$data.noteList = list
          that.$data.pagers = { total: total_count }
          that.$data.loading = false
        },
        (err) => {
          that.$data.loading = false
        }
      )
      //this.loading = true
      //console.log('getDataList',searchtype)
    },
    getFlagsList() {
      const that = this
      getBadge({}).then((res) => {
        var { list, total_count } = res.data.data
        that.$data.flagList = list
      })
    },
    getVideoSetting() {
      getUGCSetting({ type: 'video' }).then((res) => {
        var { data } = res.data
        var video_enable = data['video_enable'] == '1'
        this.$data.video_enable = video_enable
      })
    },
    setUGCSetting() {
      const { video_enable } = this.$data
      var params = { type: 'video', setting: { video_enable: video_enable ? '1' : '0' } }
      params.setting = JSON.stringify(params.setting)
      setUGCSetting(params).then((res) => {
        var { message } = res.data.data
        this.$message({
          type: 'success',
          message
        })
      })
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
    cancelAuditDialog(show) {
      //console.log('cancelAuditDialog',aloneAudit)
      this.$data.auditDialogShow = show
    },
    cancelNotesDialog(show) {
      this.$data.notesDialogShow = show
    },
    officialModalHide(show) {
      // console.log('officialModalHide',show)
      if (typeof show == 'boolean') {
        this.$data.settingshow = show
      } else {
        this.$data.settingshow = false
      }
    },
    addNote() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    delNote() {
      const { id_set } = this.$data
      var params = { post_id: id_set }
      if (id_set.length < 1) {
        this.$message({
          type: 'error',
          message: this.$t('a88979f1.4a6206'),
          duration: 1500
        })
        return false
      }
      this.$confirm(this.$t('a88979f1.24c49a'), this.$t('4add4f82.02d981'), {
        confirmButtonText: this.$t('4add4f82.38cf16'),
        cancelButtonText: this.$t('09b91dec.625fb2'),
        type: 'warning'
      }).then(() => {
        notesDelete(params).then((res) => {
          //console.log('notesDelete',res)
          var msg = res.data.data.message
          this.clearAudioData()
          this.getDataList()
          this.$message({
            type: 'success',
            message: msg
          })
        })
      })
    },
    selectNotes(params) {
      //console.log('获取笔记 ID & 状态 selectNotes',params)
      this.$data.id_set = params.id_set
      this.$data.auditdiff = params.auditdiff
      if (params.aloneAuditType) {
        //console.log('单独审核');
        if (params.option) {
          this.$data.aloneForm = params.option
        }
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
          message: this.$t('a88979f1.4a6206'),
          duration: 1500
        })
      }
    },
    auditNote(params) {
      const { id_set, aloneForm } = this.$data
      // var message = '发布成功';
      // if(params.status=='4'){
      //   message = '下架成功';
      // }
      if (aloneForm) {
        params = { ...params, ...aloneForm }
      }
      params.post_id = id_set
      //console.log('进行审核 auditNote',params);
      notesVerify(params).then((res) => {
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
    },
    flagModalHide(show) {
      this.$data.flagModalShow = show
    },
    handleNotesFlag() {
      const { id_set } = this.$data
      //console.log('打角标 handleNotesFlag',id_set)
      if (id_set.length) {
        this.flagModalHide(true)
      } else {
        this.$message({
          type: 'error',
          message: this.$t('a88979f1.4a6206'),
          duration: 1500
        })
      }
    },
    flagModalHandle(flag) {
      const { id_set } = this.$data
      var params = { post_id: id_set, badges: [flag.badge_id] }
      //console.log('更新笔记角标flagModalHandle',flag,id_set)
      batchSetBadges(params).then((res) => {
        //console.log('res',res)
        var msg = res.data.data.message
        this.flagModalHide(false)
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
<style scoped lang="css">
.p-title {
  line-height: 38px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}
.margin-col {
  margin: 15px auto 20px !important;
}
.tips {
  width: 90%;
  color: #999;
  font-size: 12px;
}
.barSelect {
  width: 100px;
}
.marbor {
  display: inline-block;
  margin: auto 15px;
  height: 30px;
  vertical-align: middle;
  border-left: 1px solid #eee;
}
.searSelect {
  margin-right: 5px;
  width: 120px;
}
.margin-col /deep/ .el-switch__label span {
  color: #999;
}
</style>
