<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="3">
        <el-button type="primary" icon="plus" style="width: 100%" size="mini" @click="addTemplate">
          {{ $t('642aeb32.736eaa') }}
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-input
          v-model="params.tag_name"
          :placeholder="$t('642aeb32.0718bf')"
          style="width: 100%"
          size="mini"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchData" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="tagsList" :height="wheight - 130">
      <el-table-column prop="tag_id" label="ID" width="100" />
      <el-table-column prop="tag_name" :label="$t('642aeb32.341fe8')" width="250">
        <template slot-scope="scope">
          <el-tag :color="scope.row.tag_color" size="mini" style="color: #ffffff">
            {{ scope.row.tag_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" :label="$t('642aeb32.da5bf4')" width="250" />
      <el-table-column :label="$t('642aeb32.2b6bc0')">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i class="el-icon-edit-outline" @click="editAction(scope.$index, scope.row)" />
            <i class="mark el-icon-delete-solid" @click="deleteAction(scope.$index, scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.page_size" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.page_size"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="$t('642aeb32.8aa239')"
      width="40%"
      :visible.sync="memberTagDialog"
      :before-close="handleCancelLabelsDialog"
    >
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="100px">
          <el-form-item :label="$t('642aeb32.abd688')">
            <el-tag :color="form.tag_color" size="mini" :style="'color:' + form.font_color">
              {{ form.tag_name }}
            </el-tag>
          </el-form-item>
          <el-form-item
            class="content-left"
            :label="$t('642aeb32.341fe8')"
            prop="tag_name"
            :rules="[{ required: true, message: this.$t('642aeb32.6f81f3'), trigger: 'blur' }]"
          >
            <el-input v-model="form.tag_name" :placeholder="$t('642aeb32.6f81f3')" />
          </el-form-item>
          <el-form-item class="content-left" :label="$t('642aeb32.beff13')">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              :placeholder="$t('642aeb32.92f284')"
            />
          </el-form-item>
          <el-form-item class="content-left" :label="$t('642aeb32.0a6bfb')">
            <el-color-picker v-model="form.tag_color" show-alpha :predefine="predefineColors" />
          </el-form-item>
          <el-form-item class="content-left" :label="$t('642aeb32.690660')">
            <el-color-picker v-model="form.font_color" show-alpha :predefine="predefineColors" />
          </el-form-item>
          <el-form-item class="content-center">
            <el-button type="primary" @click="saveTagData"> {{ $t('642aeb32.b75381') }} </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { saveTag, getTagList, getTagInfo, updateTag, deleteTag } from '../../../api/goods'
export default {
  data() {
    return {
      isEdit: false,
      tagsList: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        page_size: 20,
        tag_name: ''
      },
      form: {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: ''
      },
      memberTagDialog: false,
      predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    addTemplate() {
      // 添加商品
      this.memberTagDialog = true
      this.form = { tag_id: '', tag_name: '', tag_color: '#ff1939', description: '' }
    },
    editAction(index, row) {
      // 编辑商品弹框
      this.form = row
      this.memberTagDialog = true
    },
    preview(index, row) {
      // 预览弹框
      this.dialogVisible = true
      this.dataInfo = row
    },
    searchData() {
      this.params.page = 1
      this.getDataList()
    },
    getDataList() {
      this.loading = true
      getTagList(this.params)
        .then((response) => {
          this.tagsList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('642aeb32.f40299')
          })
        })
    },
    deleteAction(index, row) {
      this.$confirm(this.$t('642aeb32.38c88c'), this.$t('642aeb32.02d981'), {
        confirmButtonText: this.$t('642aeb32.38cf16'),
        cancelButtonText: this.$t('642aeb32.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteTag(row.tag_id)
            .then((response) => {
              this.tagsList.splice(index, 1)
              this.$message({
                message: this.$t('642aeb32.0007d1'),
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('642aeb32.acf066')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('642aeb32.2111cc')
          })
        })
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr(date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    handleCancelLabelsDialog() {
      this.memberTagDialog = false
    },
    saveTagData() {
      this.memberTagDialog = false
      if (this.form.tag_id) {
        updateTag(this.form).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: this.$t('642aeb32.3b1083')
            })
            this.getDataList()
          }
        })
      } else {
        saveTag(this.form).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: this.$t('642aeb32.3b1083')
            })
            this.getDataList()
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 90%;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
  img {
    width: 90%;
  }
}
.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}
.service-label .el-checkbox:first-child {
  margin-left: 15px;
}
.service-label .el-input:first-child {
  margin-left: 15px;
}
.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.el-carousel {
  width: 375px;
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }
  img {
    width: 100%;
  }
}
.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
