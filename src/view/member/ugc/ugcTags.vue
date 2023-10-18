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
            <el-option label="Tag关键字" value="tag_name" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchData('searchkey')" />
        </el-input>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="全部状态" name="first">
        <taglist
          :tmp-data="tagsList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
        />
      </el-tab-pane>
      <el-tab-pane label="待审核" name="second">
        <taglist
          :tmp-data="tagsList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
        />
      </el-tab-pane>
      <el-tab-pane label="已通过" name="third">
        <taglist
          :tmp-data="tagsList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
        />
      </el-tab-pane>
      <el-tab-pane label="已拒绝" name="fourth">
        <taglist
          :tmp-data="tagsList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
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
      audit-type="tag"
      :dialog-is-show="auditDialogShow"
      :auditdiff="auditdiff"
      :duf-status="dufStatus"
      @notesAuditHandle="auditNote"
      @cancelLabelsDialog="cancelAuditDialog"
    />
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getTags, tagVerify } from '@/api/ugc'
import taglist from './comps/taglist'
import auditNote from './comps/auditNote'
export default {
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  components: {
    taglist,
    auditNote
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
      tagsList: [],
      id_set: [],
      searchkey: '',
      searchtype: 'nickname',
      searPlace: '请输入昵称',
      auditdiff: false,
      auditDialogShow: false,
      notesDialogShow: false,
      dufStatus: null
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
      if (type == 'tag_name') {
        msg = '请输入关键字'
      } else if (type == 'mobile') {
        msg = '请输入手机号'
      }
      this.params.nickname = null
      this.params.tag_name = null
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
      var { activeName, params, searchkey, searchtype } = this.$data
      if (searchkey != '') {
        params[searchtype] = searchkey
      } else {
        params[searchtype] = null
      }
      that.$data.loading = true
      getTags(params).then(
        (res) => {
          var { list, total_count } = res.data.data
          //console.log('res',res)
          that.$data.tagsList = list
          that.$data.pagers = { total: total_count }
          that.$data.loading = false
        },
        (err) => {
          that.$data.loading = false
        }
      )
      //console.log('getDataList',params.status)
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
    clearAudioData() {
      this.$data.id_set = []
      this.$data.aloneForm = {}
      this.$data.auditdiff = false
    },
    cancelAuditDialog(show) {
      //console.log('cancelAuditDialog',aloneAudit)
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
          message: '请选择Tag'
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
      params.tag_id = id_set
      // console.log('进行审核 auditNote',params);
      tagVerify(params).then((res) => {
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
