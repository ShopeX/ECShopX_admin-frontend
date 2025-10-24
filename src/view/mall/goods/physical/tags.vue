<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="3">
        <el-button type="primary" icon="plus" style="width: 100%" size="mini" @click="addTemplate">
          添加标签
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-input v-model="params.tag_name" placeholder="标签名" style="width: 100%" size="mini">
          <el-button slot="append" icon="el-icon-search" @click="searchData" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="tagsList" :height="wheight - 130">
      <el-table-column prop="tag_id" label="ID" width="100" />
      <el-table-column prop="tag_name" label="标签名称" width="250">
        <template slot-scope="scope">
          <el-tag :color="scope.row.tag_color" size="mini" style="color: #ffffff">
            {{ scope.row.tag_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="标签描述" width="250" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i class="iconfont icon-edit1" @click="editAction(scope.$index, scope.row)" />
            <i
              class="mark iconfont icon-trash-alt1"
              @click="deleteAction(scope.$index, scope.row)"
            />
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
      title="添加、编辑标签"
      width="40%"
      :visible.sync="memberTagDialog"
      :before-close="handleCancelLabelsDialog"
    >
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="100px">
          <el-form-item label="预览最终结果">
            <el-tag :color="form.tag_color" size="mini" :style="'color:' + form.font_color">
              {{ form.tag_name }}
            </el-tag>
          </el-form-item>
          <el-form-item
            class="content-left"
            label="标签名称"
            prop="tag_name"
            :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]"
          >
            <el-input v-model="form.tag_name" placeholder="请输入标签名称" />
          </el-form-item>
          <el-form-item class="content-left" label="标签说明">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入标签说明"
            />
          </el-form-item>
          <el-form-item class="content-left" label="标签颜色">
            <el-color-picker v-model="form.tag_color" show-alpha :predefine="predefineColors" />
          </el-form-item>
          <el-form-item class="content-left" label="字体颜色">
            <el-color-picker v-model="form.font_color" show-alpha :predefine="predefineColors" />
          </el-form-item>
          <el-form-item class="content-center">
            <el-button type="primary" @click="saveTagData"> 确定保存 </el-button>
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
        .then(response => {
          this.tagsList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取列表信息出错'
          })
        })
    },
    deleteAction(index, row) {
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTag(row.tag_id)
            .then(response => {
              this.tagsList.splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
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
        updateTag(this.form).then(res => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getDataList()
          }
        })
      } else {
        saveTag(this.form).then(res => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '保存成功'
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
