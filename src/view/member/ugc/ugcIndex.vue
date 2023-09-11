<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row>
        <el-col :span="2">
          <div class="p-title">社区笔记管理</div>
        </el-col>
        <el-col :span="16">
          <div class="tips">
            用户发表的笔记会通过「机器审核」，若包含违禁内容将自动变为下架状态；官方笔记不会被审核，默认下架状态，需人工上架笔记；
            <br>若通过「机器审核」，则会为待审核，等待人工审核，此时社区内会展示笔记。
          </div>
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
      <el-row class="margin-col">
        <el-col>
          <el-button type="primary" @click="auditHandle(false)"> 状态变更 </el-button>

          <el-button type="primary" plain @click="addNote"> 新建官方笔记 </el-button>

          <!-- <el-button
            type="primary"
            plain
            @click="delNote"
          >
            删除笔记(测试用)
          </el-button> -->

          <el-button type="primary" plain @click="handleNotesFlag"> 打角标 </el-button>
          <span class="marbor" />
          <el-select
            v-model="filt_badge"
            class="searSelect"
            filterable
            placeholder="角标不限"
            @change="searchData"
          >
            <el-option label="角标不限" :value="null" />
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
            placeholder="全部笔记"
            @change="searchData"
          >
            <el-option label="全部笔记" :value="null" />
            <el-option label="官方笔记" value="2" />
            <el-option label="用户笔记" value="1" />
          </el-select>
          <span class="marbor" />

          <el-button plain @click="officialModalHide(true)"> 官方账号设置 </el-button>
          <span class="marbor" />
          <el-switch
            v-model="video_enable"
            active-color="#13ce66"
            active-text="允许会员上传视频"
            @change="setUGCSetting"
          />
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="全部状态" name="first">
          <noteslist
            ref="notestable"
            :tmp-data="noteList"
            :loading="loading"
            handle-type="view"
            @selectNotes="selectNotes"
            @viewDetails="viewDetails"
          />
        </el-tab-pane>
        <el-tab-pane label="待审核" name="second">
          <noteslist
            :tmp-data="noteList"
            :loading="loading"
            handle-type="view"
            @selectNotes="selectNotes"
            @viewDetails="viewDetails"
          />
        </el-tab-pane>
        <el-tab-pane label="已发布" name="third">
          <noteslist
            :tmp-data="noteList"
            :loading="loading"
            handle-type="view"
            @selectNotes="selectNotes"
            @viewDetails="viewDetails"
          />
        </el-tab-pane>
        <el-tab-pane label="已下架" name="fourth">
          <noteslist
            :tmp-data="noteList"
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
    </div>
    <router-view />
  </div>
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
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  components: {
    noteslist,
    auditNote,
    viewNotes,
    flagModal,
    settingOfficial
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
      searPlace: '请输入昵称',
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
    //console.log('path',path)
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
      var msg = '请输入昵称'
      if (type == 'title') {
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
      var params = { type: 'video', setting: { 'video_enable': video_enable ? '1' : '0' } }
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
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    delNote() {
      const { id_set } = this.$data
      var params = { post_id: id_set }
      if (id_set.length < 1) {
        this.$message({
          type: 'error',
          message: '请选择笔记',
          duration: 1500
        })
        return false
      }
      this.$confirm('此操作将永久删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
          message: '请选择笔记',
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
          message: '请选择笔记',
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
