<template>
  <SpPage>
    <!-- <el-row :gutter="20">
      <el-col :span="3">
        <el-button
          type="primary"
          icon="plus"
          style="width: 100%"
          @click="addTemplate"
        >
          添加标签
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-input
          v-model="params.tag_name"
          placeholder="标签名"
          style="width: 100%"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchData"
          />
        </el-input>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="params.tag_status"
          clearable
          filterable
          placeholder="类型"
          :loading="loading"
          @change="searchData"
        >
          <el-option label="商城公有" value="online"> </el-option>
          <el-option label="员工自定义" value="self"> </el-option>
        </el-select>
      </el-col> -->
    <!-- <el-col :span="5">
        <el-select
          v-model="params.category_id"
          clearable
          filterable
          placeholder="分类"
          :loading="loading"
          @change="searchData"
        >
          <el-option
            v-for="item in options"
            :key="item.category_id"
            :label="item.category_name"
            :value="item.category_id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row> -->

    <SpFilterForm :model="params" @onSearch="searchData" @onReset="onSearch">
      <SpFilterFormItem prop="tag_name" label="标签名:">
        <el-input v-model="params.tag_name" placeholder="标签名" style="width: 100%">
          <!-- <el-button slot="append" icon="el-icon-search" @click="searchData" /> -->
        </el-input>
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" @click="addTemplate"> 添加标签 </el-button>
    </div>

    <el-table v-loading="loading" :data="tagsList" :height="wheight - 200">
      <el-table-column prop="tag_id" label="ID" width="100" />
      <el-table-column prop="tag_name" label="标签名称" width="250">
        <template slot-scope="scope">
          <el-tag :color="scope.row.tag_color" size="mini" :style="'color:' + scope.row.font_color">
            {{ scope.row.tag_name }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="tag_name" label="分类" width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.category_id" disabled v-if="scope.row.category_id != '0'">
            <el-option
              v-for="item in options"
              :key="item.category_id"
              :label="item.category_name"
              :value="item.category_id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="tag_status" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.tag_status != 'self' && scope.row.distributor_id == '0'"
            >商城公有</el-tag
          >
          <el-tag v-if="scope.row.tag_status != 'self' && scope.row.distributor_id != '0'"
            >店铺标签</el-tag
          >
          <el-tag v-if="scope.row.tag_status == 'self'">员工自定义</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="self_tag_count" label="会员数" width="100" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i class="iconfont icon-edit1" @click="editAction(scope.$index, scope.row)" />
            <i
              class="mark iconfont icon-trash-alt1"
              @click="deleteAction(scope.$index, scope.row)"
            />
            <!-- <i class="iconfont" @click="addAction(scope.row)" v-if="scope.row.tag_status == 'self'"
              >添加到公共库</i
            > -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="total_count > params.page_size"
      class="content-center content-top-padded"
      style="text-align: right"
    >
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
          <!-- <el-form-item
            class="content-left"
            label="标签分类"
            prop="tag_name"
            :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]"
          >
            <el-select
              v-model="form.category_id"
              clearable
              filterable
              placeholder="请输入关键词"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.category_id"
                :label="item.category_name"
                :value="item.category_id"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item class="content-left" label="标签说明">
            <el-input
              v-model="form.description"
              :disabled="form.source == 'staff' ? true : false"
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
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  saveTag,
  getTagList,
  getTagInfo,
  updateTag,
  deleteTag,
  getTagCategoryList
} from '@/api/member'
export default {
  data() {
    return {
      isEdit: false,
      tagsList: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        page_size: 10,
        tag_name: '',
        // category_id: '',
        tag_status: ''
      },
      form: {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: ''
        // category_id: 0
      },
      memberTagDialog: false,
      predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']
      // options: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getDataList()
    this.getCategorylist()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    addAction(row) {
      console.log(row)
      this.form.tag_name = row.tag_name
      this.form.tag_color = row.tag_color ? row.tag_color : '#ff1939'
      this.form.font_color = row.font_color ? row.font_color : '#ffffff'
      this.form.tag_status = 'online'
      this.memberTagDialog = true
    },
    addTemplate() {
      // 添加商品
      this.memberTagDialog = true
      this.form = {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        description: ''
        // category_id: 0
      }
      this.form = {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: ''
      }
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
          // this.tagsList.forEach((item) => {
          //   item.category_id = String(item.category_id)
          // })
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
      if (this.form.tag_id) {
        updateTag(this.form).then(res => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.memberTagDialog = false
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
            this.memberTagDialog = false
            this.getDataList()
          }
        })
      }
    },
    getCategorylist(name) {
      this.loading = true
      let param = {}
      if (name) {
        param.category_name = name
      }
      getTagCategoryList(param).then(res => {
        // this.options = res.data.data.list
        this.loading = false
      })
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
