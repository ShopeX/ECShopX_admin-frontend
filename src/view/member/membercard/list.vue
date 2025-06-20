<template>
  <SpPage>
    <el-card>
      <el-table
        v-loading="loading"
        :data="vipGradeList"
        :height="wheight - 80"
      >
        <el-table-column
          prop="order_id"
          label="订单号"
          min-width="200"
        >
          <template slot-scope="scope">
            <div class="order-num">
              {{ scope.row.order_id }}
              <el-tooltip
                effect="dark"
                content="复制"
                placement="top-start"
              >
                <i
                  v-clipboard:copy="scope.row.order_id"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </div>
            <div class="order-time">
              <el-tooltip
                effect="dark"
                content="下单时间"
                placement="top-start"
              >
                <i class="el-icon-time" />
              </el-tooltip>
              {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="lv_type"
          label="等级"
          width="60"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.lv_type === 'vip' ? 'warning' : 'danger'"
              size="mini"
            >
              {{ scope.row.lv_type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="卡名称"
        />
        <el-table-column
          prop="card_type"
          label="卡类型"
        >
          <template slot-scope="scope">
            {{ scope.row.card_type.desc }}
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="会员手机号"
        >
          <template slot-scope="scope">
            <i class="el-icon-mobile" />{{ scope.row.mobile }}
            <el-tooltip
              v-if="datapass_block == 0"
              effect="dark"
              content="复制"
              placement="top-start"
            >
              <i
                v-clipboard:copy="scope.row.mobile"
                v-clipboard:success="onCopy"
                class="el-icon-document-copy"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="购买金额"
          width="100"
        >
          <template slot-scope="scope">
            <div class="mark">
              <span class="cur">{{ scope.row.fee_symbol }}</span>{{ scope.row.price / 100 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="discount"
          label="折扣值"
          width="100"
        >
          <template slot-scope="scope">
            {{ (100 - scope.row.discount) / 100 }}折
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="edit" @click="editAction(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div
        v-if="total_count > params.pageSize"
        class="content-center content-top-padded"
      >
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.page_size"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- <el-dialog title="添加、编辑标签" width="40%" :visible.sync="memberTagDialog" :before-close="handleCancelLabelsDialog">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="100px">
          <el-form-item label="预览最终结果">
            <el-tag :color="form.tag_color" size="mini" :style="'color:'+form.font_color">{{form.tag_name}}</el-tag>
          </el-form-item>
          <el-form-item class="content-left" label="标签名称" prop="tag_name" :rules="[{ required: true, message: '请输入标签名称', trigger: 'blur' }]">
            <el-input placeholder="请输入标签名称" v-model="form.tag_name"></el-input>
          </el-form-item>
          <el-form-item class="content-left" label="标签说明">
            <el-input type="textarea" :rows="3" placeholder="请输入标签说明" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item class="content-left" label="标签颜色">
            <el-color-picker v-model="form.tag_color" show-alpha :predefine="predefineColors"></el-color-picker>
          </el-form-item>
          <el-form-item class="content-left" label="字体颜色">
            <el-color-picker v-model="form.font_color" show-alpha :predefine="predefineColors"></el-color-picker>
          </el-form-item>
          <el-form-item class="content-center">
            <el-button type="primary" @click="saveTagData">确定保存</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog> -->
    </el-card>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { listVipGrade } from '../../../api/member'
export default {
  data () {
    return {
      isEdit: false,
      vipGradeList: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      form: {
        tag_id: '',
        tag_name: '',
        tag_color: '#ff1939',
        font_color: '#ffffff',
        description: ''
      },
      memberTagDialog: false,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ],
      datapass_block: 1
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    onCopy () {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    addTemplate () {
      // 添加商品
      this.memberTagDialog = true
      this.form = { tag_id: '', tag_name: '', tag_color: '#ff1939', description: '' }
    },
    editAction (index, row) {
      // 编辑商品弹框
      this.form = row
      this.memberTagDialog = true
    },
    preview (index, row) {
      // 预览弹框
      this.dialogVisible = true
      this.dataInfo = row
    },
    searchData () {
      this.params.page = 1
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      listVipGrade(this.params)
        .then((response) => {
          this.vipGradeList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.datapass_block = response.data.data.datapass_block
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取列表信息出错'
          })
        })
    },
    deleteAction (index, row) {
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTag(row.tag_id)
            .then((response) => {
              this.vipGradeList.splice(index, 1)
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
    getTaskTime (strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr (date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    handleCancelLabelsDialog () {
      this.memberTagDialog = false
    },
    saveTagData () {
      this.memberTagDialog = false
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
