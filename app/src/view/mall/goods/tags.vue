<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <el-input class="input-b" placeholder="标签名" v-model="params.tag_name">
          <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-circle-plus" @click="addTemplate"
          >添加商品标签</el-button
        >
      </el-col>
    </el-row>
    <el-card>
      <el-table :data="tagsList" v-loading="loading" element-loading-text="数据加载中">
        <el-table-column prop="tag_id" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="editAction(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteAction(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="tag_name" label="标签名称" width="250">
          <template slot-scope="scope">
            <span
              class="tag"
              :style="{ color: scope.row.font_color, background: scope.row.tag_color }"
            >
              {{ scope.row.tag_name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="标签描述"></el-table-column>
      </el-table>
      <div class="content-padded content-center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page.sync="params.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="params.pageSize"
        >
        </el-pagination>
      </div>
    </el-card>
    <sideBar :visible.sync="show_sideBar" :title="'新增商品标签'">
      <el-form ref="form" :model="form" class="demo-ruleForm" label-width="100px">
        <el-form-item
          class="content-left"
          label="标签名称"
          prop="tag_name"
          :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]"
        >
          <el-input placeholder="请输入标签名称" v-model="form.tag_name"></el-input>
        </el-form-item>
        <el-form-item class="content-left" label="标签说明">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入标签说明"
            v-model="form.description"
          ></el-input>
        </el-form-item>
        <el-form-item class="content-left" label="标签颜色">
          <el-color-picker
            v-model="form.tag_color"
            show-alpha
            :predefine="predefineColors"
          ></el-color-picker>
        </el-form-item>
        <el-form-item class="content-left" label="字体颜色">
          <el-color-picker
            v-model="form.font_color"
            show-alpha
            :predefine="predefineColors"
          ></el-color-picker>
        </el-form-item>
        <el-form-item class="content-left" label="前台显示">
          <el-radio-group v-model="form.front_show">
            <el-radio label="1">显示</el-radio>
            <el-radio label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="saveTagData">确定保存</el-button>
      </div>
    </sideBar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { saveTag, getTagList, getTagInfo, updateTag, deleteTag } from '../../../api/goods'
import sideBar from '@/components/element/sideBar'
export default {
  data() {
    return {
      show_sideBar: false,
      isEdit: false,
      tagsList: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 10,
        tag_name: ''
      },
      form: {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: '',
        front_show: '0'
      },
      predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']
    }
  },
  components: {
    sideBar
  },
  computed: {
    ...mapGetters(['wheight'])
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
    addTemplate() {
      // 添加商品
      this.show_sideBar = true
      this.form = {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: '',
        front_show: '0'
      }
    },
    editAction(index, row) {
      // 编辑商品弹框
      this.form = row
      this.show_sideBar = true
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
    async getDataList() {
      this.loading = true
      const response = await getTagList(this.params)
      this.tagsList = response.data.data.list
      this.total_count = response.data.data.total_count
      this.loading = false
        
    },
    deleteAction(index, row) {
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTag(row.tag_id)
            .then((response) => {
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
    saveTagData() {
      if (this.form.tag_id) {
        updateTag(this.form).then((res) => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getDataList()
          }
        })
      } else {
        saveTag(this.form).then((res) => {
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
  },
  mounted() {
    this.getDataList()
  }
}
</script>
<style scoped lang="scss">
.tag {
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1;
}
</style>
