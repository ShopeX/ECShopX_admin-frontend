<template>
  <div>
    <div class="content-bottom-padded">
      <el-row>
        <el-col :span="18">
          <div style="float: left">
            <el-button-group>
              <el-button
                type="primary"
                @click="addSource"
              >
                新增来源
              </el-button>
              <el-button
                type="primary"
                @click="checkMemberTags"
              >
                选择会员标签
              </el-button>
            </el-button-group>
          </div>
          <div style="float: left">
            <el-alert
              title="批量打标签会替换所有标签，不会做合并，请慎重操作"
              type="warning"
              :closable="false"
            />
          </div>
        </el-col>
        <el-col
          :span="6"
          class="content-right"
        >
          <el-input
            v-model="searchTxt"
            placeholder="搜索"
            style="width: 260px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getSourcesLists()"
            />
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="multipleSourceTable"
      v-loading="loading"
      :data="dataList"
      :row-key="getRowKeys"
      :height="wheight - 210"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        label="全选"
      />
      <el-table-column
        prop="sourceName"
        label="来源名称"
      />
      <el-table-column
        prop="sourceName"
        label="标签"
      >
        <template slot-scope="scope">
          <template>
            <el-tag
              v-for="(item, index) in scope.row.checkTags"
              :key="index + 'checktags1'"
            >
              {{
                item.tag_name
              }}
            </el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <template>
            {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a
            href="#"
            @click="edit(scope.row)"
          >修改名称</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="content-padded view-flex view-flex-center">
      <div
        v-if="total_count > pageLimit"
        class="f_r"
      >
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total_count"
          :page-size="pageLimit"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      title="添加来源"
      :visible="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="120px"
        >
          <el-form-item
            v-if="!tagdialogVisible"
            label="来源名称"
            prop="source_name"
          >
            <el-input
              v-model="form.source_name"
              placeholder="填写来源名称"
              style="width: 80%"
            />
            <p class="frm-tips">
              建议将来源名称命名为要使用的推广渠道的名称，方便理解与跟踪，例如：微信朋友圈广告
            </p>
          </el-form-item>
          <el-form-item
            v-if="!tagdialogVisible"
            label="会员标签"
            prop="source_name"
          >
            <el-tag
              v-for="(item, index) in checktags"
              :key="index + 'checktags2'"
            >
              {{
                item.tag_name
              }}
            </el-tag>
          </el-form-item>
          <el-form-item
            v-if="tagdialogVisible"
            label="选中的来源"
            prop="source_name"
          >
            <el-tag
              v-for="(item, index) in checkSource"
              :key="index + 'checksource3'"
            >
              {{
                item.sourceName
              }}
            </el-tag>
          </el-form-item>
          <el-form-item
            label="标签列表"
            prop="source_name"
          >
            <template>
              <el-table
                ref="multipleTable"
                v-loading="loading"
                :data="taglist"
                tooltip-effect="dark"
                style="width: 100%"
                :row-key="getTagRowKeys"
                :select-on-indeterminate="false"
                @select="handleSelectChange"
                @select-all="handleSelectAll"
              >
                <el-table-column
                  type="selection"
                  :reserve-selection="true"
                  width="50"
                />
                <el-table-column
                  prop="tag_id"
                  label="id"
                  width="60"
                />
                <el-table-column
                  prop="tag_name"
                  label="标签名称"
                  width="300"
                />
              </el-table>
              <div
                v-if="tagcount > pageLimit"
                class="content-center content-top-padded"
              >
                <el-pagination
                  layout="prev, pager, next"
                  :total="tagcount"
                  :page-size="pageLimit"
                  @current-change="handleRelShopCurrentChange"
                />
              </div>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="onCancel">
          取消
        </el-button>
        <el-button
          v-if="tagdialogVisible"
          type="primary"
          @click="submitMemberTag"
        >
          确定
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="onSubmit"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSourcesList,
  getSourcesDetail,
  createSources,
  updateSources,
  deleteSources,
  saveTags
} from '../../../../api/datacube'
import { getTagList } from '@/api/member'
import util from '../../../../common/js/util'

import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      tagdialogVisible: false,
      searchTxt: '',
      form: {
        source_name: '',
        source_id: ''
      },
      checkSource: [],
      checktags: [],
      allCheckTags: {},
      taglist: [],
      tagcount: 0,
      dataList: [],
      loading: false,
      page: 1,
      pageLimit: 10,
      tagPage: 1,
      total_count: 0,
      rules: {
        source_name: [{ required: true, message: '请输入来源名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getSourcesLists()
  },
  methods: {
    getRowKeys (row) {
      return row.sourceId
    },
    handleSelectionChange (rows) {
      this.checkSource = []
      if (rows) {
        rows.forEach((row) => {
          if (row) {
            this.checkSource.push(row)
          }
        })
      }
    },
    handleCurrentChange (page_num) {
      this.page = page_num
      this.getSourcesLists()
    },
    addSource () {
      this.dialogVisible = true
      this.checktags = []
      //this.$refs.multipleTable.clearSelection();
      //this.$refs.multipleSourceTable.clearSelection();
      this.getAllTagLists(1)
    },
    edit (row) {
      this.dialogVisible = true
      getSourcesDetail(row.sourceId).then((res) => {
        let detail = res.data.data
        this.form.source_name = detail.source_name
        this.form.source_id = detail.source_id
        if (detail.checkTags) {
          this.checktags = detail.checkTags
        }
        this.getAllTagLists(1)
      })
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var params = {
            source_name: this.form.source_name,
            tags_id: []
          }
          this.checktags.forEach((item) => {
            params.tags_id.push(item.tag_id)
          })

          if (this.form.source_id) {
            updateSources(this.form.source_id, params).then((response) => {
              if (response.data.data.source_id) {
                this.dialogVisible = false
                this.form.source_name = ''
                this.form.source_id = ''
                this.getSourcesLists()
              } else {
                this.$message.error('更新来源失败!')
                return false
              }
            })
          } else {
            createSources(params).then((response) => {
              if (response.data.data.source_id) {
                this.dialogVisible = false
                this.form.source_name = ''
                this.form.source_id = ''
                this.getSourcesLists()
              } else {
                this.$message.error('创建来源失败!')
                return false
              }
            })
          }
        }
      })
    },
    onCancel () {
      this.dialogVisible = false
      this.tagdialogVisible = false
      this.form.source_name = ''
      this.form.source_id = ''
      this.checktags = []
      this.checkSource = []
      this.taglist = []
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleSourceTable.clearSelection()
    },
    getSourcesLists () {
      this.loading = true
      let params = { page: this.page, pageSize: this.pageLimit }
      if (this.searchTxt != '') {
        params.page = 1
        params.source_name = this.searchTxt
      }
      // console.log(params)
      getSourcesList(params)
        .then((response) => {
          this.dataList = response.data.data.list
          // console.log(this.dataList)
          this.total_count = response.data.data.total_count
          this.AllcheckTags = response.data.data.checkTags
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取来源信息出错'
          })
        })
    },
    checkMemberTags () {
      this.tagdialogVisible = true
      this.dialogVisible = true
      // this.$refs.multipleTable.clearSelection();
      // this.$refs.multipleSourceTable.clearSelection();
      this.checktags = []
      this.getAllTagLists(1)
    },
    getAllTagLists (page) {
      let params = {
        page: page,
        page_size: this.pageLimit
      }
      getTagList(params).then((response) => {
        this.taglist = response.data.data.list

        if (this.checktags.length > 0) {
          this.checktags.forEach((item) => {
            let checked = this.taglist.find((n) => n.tag_id === item.tag_id)
            if (checked) {
              this.$refs.multipleTable.toggleRowSelection(item)
            }
          })
        }
        this.tagcount = response.data.data.total_count
      })
    },
    submitMemberTag () {
      if (this.checkSource.length == 0) {
        this.$message.error('请选择来源!')
        return false
      }
      if (this.checktags.length == 0) {
        this.$message.error('请选择标签!')
        return false
      }
      let checkSource = []
      this.checkSource.forEach((item) => {
        checkSource.push(item.sourceId)
      })
      let checktags = []
      this.checktags.forEach((item) => {
        checktags.push(item.tag_id)
      })
      let params = { source_ids: JSON.stringify(checkSource), tags_id: JSON.stringify(checktags) }
      saveTags(params).then((res) => {
        this.$message({
          type: 'success',
          message: '保存完成'
        })
        this.tagdialogVisible = false
        this.dialogVisible = false
        this.getSourcesLists()
      })
    },
    getTagRowKeys (row) {
      return row.tag_id
    },
    handleSelectAll (val) {
      if (val.length > 0) {
        this.checktags = []
        val.forEach((item) => {
          let inChecked = this.checktags.findIndex((n) => item.tag_id === n.tag_id)
          if (inChecked === -1) {
            this.checktags.push(item)
          }
        })
      } else {
        this.taglist.forEach((item, index) => {
          let inChecked = this.checktags.findIndex((n) => item.tag_id === n.tag_id)
          if (inChecked !== -1) {
            this.checktags.splice(inChecked, 1)
          }
        })
      }
    },
    handleSelectChange (val, row) {
      let inChecked = this.checktags.findIndex((item) => row.tag_id === item.tag_id)
      if (inChecked !== -1) {
        this.checktags.splice(inChecked, 1)
      } else {
        this.checktags.push(row)
      }
    },
    handleRelShopCurrentChange (page_num) {
      this.getAllTagLists(page_num)
    }
  }
}
</script>
