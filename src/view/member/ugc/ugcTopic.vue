<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-row :gutter="20" class="action-container">
      <el-col :span="18">
        <el-button type="primary" @click="editTocicShow(true)">
{{
          $t('ab1a2e0d.4fee56')
        }}
</el-button>

        <el-button @click="auditHandle">{{ $t('ab1a2e0d.6aac0d') }}</el-button>
        <!-- <el-button
          type="primary"
          plain
          @click="delTopic"
        >
          删除话题(测试用)
        </el-button> -->

        <el-button type="primary" plain @click="topicModalHide(true)">
{{
          $t('ab1a2e0d.f5816a')
        }}
</el-button>
        <span class="marbor" />
        <el-select
          v-model="params.source"
          class="searSelect"
          :placeholder="$t('ab1a2e0d.090a4c')"
          @change="searchData"
        >
          <el-option :label="$t('ab1a2e0d.090a4c')" :value="null" />
          <el-option :label="$t('ab1a2e0d.fd341c')" value="2" />
          <el-option :label="$t('ab1a2e0d.0dec71')" value="1" />
        </el-select>
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
            <el-option :label="$t('ab1a2e0d.4f377c')" value="topic_name" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchData('searchkey')" />
        </el-input>
      </el-col>
    </el-row>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('cadc1ce1.443483')" name="first">
        <topiclist
          ref="topictable"
          :tmp-data="topicList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
          @handleEdit="editTocicShow"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('cadc1ce1.5cb424')" name="second">
        <topiclist
          :tmp-data="topicList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('cadc1ce1.ecfa64')" name="third">
        <topiclist
          :tmp-data="topicList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('cadc1ce1.81233d')" name="fourth">
        <topiclist
          :tmp-data="topicList"
          :loading="loading"
          handle-type="view"
          @selectNotes="selectNotes"
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
      audit-type="topic"
      :dialog-is-show="auditDialogShow"
      :auditdiff="auditdiff"
      :duf-status="dufStatus"
      @notesAuditHandle="auditNote"
      @cancelLabelsDialog="cancelAuditDialog"
    />

    <topicModal
      v-if="topicModalShow"
      topic-type="sort"
      :dialog-is-show="topicModalShow"
      @cancelLabelsDialog="topicModalHide"
      @modalHandle="topicModalHandle"
    />

    <el-dialog
      :before-close="editTocicShow"
      :visible.sync="editShow"
      :show-close="false"
      :title="topicForm.topic_id ? $t('ab1a2e0d.d79a51') : $t('ab1a2e0d.4fee56')"
      width="30%"
    >
      <div class="dialog-tips" v-html="$t('ab1a2e0d.ace48a')" />
      <el-form ref="topicForm" :model="topicForm" :rules="topicFormRules" label-width="80px">
        <el-form-item prop="topic_name" :label="$t('ab1a2e0d.220164')">
          <el-input
            v-model="topicForm.topic_name"
            :placeholder="$t('ab1a2e0d.220164')"
            maxlength="32"
            :show-word-limit="true"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updataFalg">{{ $t('09b91dec.e83a25') }}</el-button>
          <el-button @click="editTocicShow(false)">{{ $t('09b91dec.625fb2') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </SpPage>
</template>
<script>
import { Message } from 'element-ui'
import { getTopics, createTopics, topicSettop, topicVerify, topicDelete } from '@/api/ugc'
import topiclist from './comps/topiclist'
import auditNote from './comps/auditNote'
import topicModal from './comps/topicModal'

export default {
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  components: {
    topiclist,
    auditNote,
    topicModal
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      params: {
        page: 1,
        pageSize: 10,
        status: null,
        type: null
      },
      pagers: {
        total: 0
      },
      topicList: [],
      id_set: [],
      exitsNew: false,
      searchkey: '',
      searchtype: 'nickname',
      searPlace: '',
      auditdiff: false,
      dufStatus: null,
      auditDialogShow: false,
      topicModalShow: false,
      topicForm: {
        topic_name: null
      },
      topicFormRules: {},
      editShow: false
    }
  },
  computed: {
    topicFormRules() {
      return {
        topic_name: [{ required: true, message: this.$t('ab1a2e0d.f66b17'), trigger: 'blur' }]
      }
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
    researchMsg(type) {
      var msg = this.$t('cadc1ce1.916ff9')
      if (type == 'topic_name') {
        msg = this.$t('cadc1ce1.db91cb')
      } else if (type == 'mobile') {
        msg = this.$t('cadc1ce1.6e4f4b')
      }
      this.params.nickname = null
      this.params.topic_name = null
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
    clearAudioData() {
      this.$data.id_set = []
      this.$data.topicForm = { topic_name: null }
      this.$data.auditdiff = false
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
      getTopics(params).then(
        (res) => {
          var { list, total_count } = res.data.data
          //console.log('res',params.page,res)
          that.$data.topicList = list
          that.$data.pagers = { total: total_count }
          that.$data.loading = false
        },
        (err) => {
          that.$data.loading = false
        }
      )
      //console.log('getDataList',params.status)
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
      // console.log('点击审核 auditHandle /',dufStatus,id_set);
      if (id_set.length) {
        this.cancelAuditDialog(true)
      } else {
        this.$message({
          type: 'error',
          message: this.$t('ab1a2e0d.858c49')
        })
      }
    },
    auditNote(params) {
      const { id_set, aloneForm } = this.$data
      if (aloneForm) {
        params = { ...params, ...aloneForm }
      }
      params.topic_id = id_set
      //console.log('进行审核 auditNote',params);
      topicVerify(params).then((res) => {
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
    topicModalHide(show, row) {
      if (typeof show == 'boolean') {
        this.$data.topicModalShow = show
      } else {
        this.$data.topicModalShow = false
      }
    },
    topicModalHandle(checkTopic) {
      //console.log('topicModalHandle 排序',checkTopic)
      var topic_id = []
      checkTopic.forEach((item) => {
        topic_id.push(item.topic_id)
      })

      topicSettop({ topic_id }).then((res) => {
        var { message } = res.data.data
        this.$message({
          type: 'success',
          message
        })
        this.topicModalHide(false)
        this.getDataList()
      })
    },
    editTocicShow(show, row) {
      const { topicForm } = this.$data
      if (typeof show == 'boolean') {
        this.$data.editShow = show
      } else {
        this.$data.editShow = false
      }

      //edit
      if (row) {
        this.$data.topicForm = row
      }

      if (topicForm.topic_id) {
        this.clearAudioData()
      }
      console.log('this.clearAudioData', topicForm)
    },
    updataFalg() {
      const that = this
      const { topicForm } = this.$data
      //console.log('话题',this.$data.topicForm)
      this.$refs['topicForm'].validate((valid) => {
        if (valid) {
          createTopics(topicForm).then((res) => {
            var { message } = res.data.data
            this.$message({
              type: 'success',
              duration: 1500,
              message,
              onClose() {
                that.editTocicShow()
                that.getDataList()
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delTopic() {
      const { id_set } = this.$data
      var params = { topic_id: id_set }
      if (id_set.length < 1) {
        this.$message({
          type: 'error',
          message: this.$t('ab1a2e0d.858c49')
        })
        return false
      }
      this.$confirm('此操作将永久删除该话题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        topicDelete(params).then((res) => {
          //console.log('notesDelete',res)
          var msg = res.data.data.message
          this.cancelAuditDialog(false)
          this.clearAudioData()
          this.getDataList()
          this.$message({
            type: 'success',
            message: msg
          })
        })
      })
    }
  }
}
</script>
<style scoped lang="css">
.tips {
  color: #999;
  font-size: 12px;
}
.barSelect {
  width: 120px;
}
.searSelect {
  margin-right: 5px;
  width: 120px;
}
.marbor {
  display: inline-block;
  margin: auto 15px;
  height: 30px;
  vertical-align: middle;
  border-left: 1px solid #eee;
}
.dialog-tips {
  position: absolute;
  top: 20px;
  right: 15px;
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>
