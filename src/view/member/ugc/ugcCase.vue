<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="2">
        <div class="p-title">敏感词管理</div>
      </el-col>
      <el-col :span="22">
        <div class="tips">
          设置敏感词列表，敏感词优先级高于机器审核。<br>用户未来创建的含有敏感词的笔记将显示为***。
        </div>
      </el-col>
    </el-row>
    <el-row class="margin-col">
      <el-col>
        <el-button type="primary" @click="addkey"> 新建敏感词 </el-button>
        <el-button @click="handleDelete"> 删除敏感词 </el-button>
      </el-col>
    </el-row>

    <el-card>
      <sensitivelist
        ref="keylist"
        :tmp-data="keylist"
        :loading="loading"
        @selectNotes="selectNotes"
        @updataList="getDataList"
      />
    </el-card>

    <div class="mt-4 text-right">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagers.total"
        :page-size="params.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :before-close="editFlagHide"
      :visible.sync="editFlagShow"
      title="新建/编辑敏感词"
      :show-close="false"
      width="30%"
    >
      <div class="dialog-tips">已经存在的笔记将不受影响，<br>请前往笔记列表页手动筛选。</div>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item prop="text" label="敏感词">
          <el-input
            v-model="ruleForm.text"
            placeholder="请填写敏感词"
            maxlength="10"
            :show-word-limit="true"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="updataKey"> 确认 </el-button>
        <el-button @click="editFlagHide"> 取消 </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :before-close="delFlagHide"
      :visible.sync="delFlagShow"
      title="删除敏感词"
      :show-close="false"
      width="30%"
    >
      <div class="cont">注意！删除敏感词不会自动将包含敏感词的笔记重新发布，请人工操作。</div>
      <div slot="footer">
        <el-button type="primary" @click="deleteKey"> 确认 </el-button>
        <el-button @click="delFlagHide"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getNotes } from '@/api/ugc'
import sensitivelist from './comps/sensitivelist'
export default {
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  components: {
    sensitivelist
  },
  data() {
    return {
      loading: false,
      params: {
        page: 1,
        pageSize: 10,
        status: null
      },
      pagers: {
        total: 0
      },
      keylist: [
        { id: 1, text: '官方' },
        { id: 2, text: '当季火热' },
        { id: 3, text: '当季2' },
        { id: 4, text: '当季3' }
      ],
      id_set: [],
      ruleForm: {
        text: null
      },
      rules: {
        text: [
          { required: true, message: '请输入敏感词', trigger: 'blur' },
          { max: 10, message: '长度不超过10个字符', trigger: 'blur' }
        ]
      },
      aloneKey: false,
      editFlagShow: false,
      delFlagShow: false
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
    getDataList() {
      var { activeName, params } = this.$data
      //this.loading = true
      console.log('getDataList', params.status)
    },
    selectNotes(params) {
      this.$data.id_set = params.id_set
      //console.log('selectNotes',params)
      if (params.aloneDelete) {
        this.$data.delFlagShow = true
      } else if (params.aloneEdit) {
        this.$data.editFlagShow = true
        this.$data.ruleForm = params.option
      }
    },
    clearCaseData() {
      this.$data.id_set = []
      this.$data.ruleForm = {}
    },
    editFlagHide() {
      this.$data.editFlagShow = false
    },
    updataKey() {
      const { ruleForm } = this.$data
      var message = ruleForm.id ? '更新成功' : '创建成功'
      console.log('编辑更新敏感词', this.$data.ruleForm)
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$message({
            type: 'success',
            message
          })
          this.editFlagHide()
          this.$emit('updataList')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addkey() {
      this.clearCaseData()
      this.$data.editFlagShow = true
    },
    delFlagHide() {
      this.$data.delFlagShow = false
    },
    handleDelete() {
      const { id_set } = this.$data
      console.log('点击删除 auditHandle', id_set)
      if (id_set.length) {
        this.$data.delFlagShow = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择敏感词'
        })
      }
    },
    deleteKey() {
      const { id_set } = this.$data
      console.log('删除敏感词', id_set)
      this.$message({
        type: 'success',
        message: '删除敏感词成功'
      })
      this.delFlagHide()
    }
  }
}
</script>
<style scoped lang="scss">
.p-title {
  line-height: 38px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}
.tips {
  color: #999;
  font-size: 12px;
}
.margin-col {
  margin: 15px auto 20px !important;
}
.dialog-tips {
  position: absolute;
  top: 20px;
  right: 15px;
  font-size: 12px;
  color: #999;
  text-align: right;
}
.btn-bar {
  margin-top: 20px;
  text-align: right;
}
</style>
