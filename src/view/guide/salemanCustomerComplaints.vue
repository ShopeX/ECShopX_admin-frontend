<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="filterData.user_name"
        placeholder="会员名"
        class="filterInput"
        clearable
        @clear="reset"
      />
      <el-input
        v-model="filterData.user_mobile"
        placeholder="会员手机号"
        class="filterInput"
        clearable
        @clear="reset"
      />
      <el-input
        v-model="filterData.saleman_name"
        placeholder="导购员名"
        class="filterInput"
        clearable
        @clear="reset"
      />
      <el-input
        v-model="filterData.saleman_mobile"
        placeholder="导购员手机号"
        class="filterInput"
        clearable
        @clear="reset"
      />
      <el-select
        v-model="filterData.reply_status"
        placeholder="回复状态"
        clearable
        @change="getList"
      >
        <el-option
          v-for="item in replyStatusSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        @click="getList"
      >
        查询
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-card>
      <el-table
        v-loading="tableLoading"
        :data="list"
        style="width: 100%"
      >
        <el-table-column
          prop="user_name"
          label="会员"
          width=""
        />
        <el-table-column
          prop="user_mobile"
          label="会员手机号"
          width=""
        />
        <el-table-column
          prop="saleman_name"
          label="导购员"
          width=""
        />
        <el-table-column
          prop="saleman_mobile"
          label="导购员手机号"
          width=""
        />
        <el-table-column
          prop="complaints_content"
          label="投诉内容"
        />
        <el-table-column
          prop="reply_status"
          label="回复状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.reply_status == 1">已回复</span>
            <span v-else-if="scope.row.reply_status == 0">未回复</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="handleReply(scope.row)"
            >
              回 复
            </el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="handleDetail(scope.row)"
            >
              详 情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="content-padded content-center"
        background
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 详情弹窗 -->
    <el-dialog
      title="详情"
      :visible.sync="detailVisiable"
    >
      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="会员名">
          <span>{{ detailData.user_name }}</span>
        </el-form-item>
        <el-form-item label="会员手机号">
          <span>{{ detailData.user_mobile }}</span>
        </el-form-item>
        <el-form-item label="导购员">
          <span>{{ detailData.saleman_name }}</span>
        </el-form-item>
        <el-form-item label="导购员手机号">
          <span>{{ detailData.saleman_mobile }}</span>
        </el-form-item>
        <el-form-item label="投诉内容">
          <span>{{ detailData.complaints_content }}</span>
        </el-form-item>
        <el-form-item label="投诉图片">
          <!-- val:{{ srcList }} -->
          <el-image
            v-for="(item, index) in srcList"
            :key="index"
            style="width: 100px; height: 100px"
            :src="item"
            :preview-src-list="srcList"
          />
        </el-form-item>
        <el-form-item label="回复状态">
          <span v-if="detailData.reply_status == 0">未回复</span>
          <span v-else>已回复</span>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-row
            v-for="(item, index) in detailData.reply_content_list"
            :key="index"
            class="operator-con"
            :gutter="0"
          >
            <el-col :span="12">
              操作人：{{ item.reply_operator_name }}
            </el-col>
            <el-col :span="12">
              回复时间：{{ item.reply_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
            <el-col :span="24">
              <div class="div-flex">
                <div class="w-135">
                  回复内容：
                </div>
                <div>
                  {{ item.reply_content }}
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="回复时间">
          <span>{{ detailData.reply_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </el-form-item>
        <el-form-item label="回复操作员">
          <span>{{ detailData.reply_operator_name }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 回复弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width=""
      :before-close="handleClose"
    >
      <el-form
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="导购员">
          <span>{{ dialogContent.saleman }}</span>
        </el-form-item>
        <el-form-item label="投诉内容">
          <span>{{ dialogContent.content }}</span>
        </el-form-item>
        <el-form-item label="图片">
          <el-image
            v-for="(item, index) in srcList"
            :key="index"
            style="width: 100px; height: 100px"
            :src="item"
            :preview-src-list="srcList"
          />
        </el-form-item>
        <el-form-item label="回复">
          <el-input
            v-model="replyContent"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入回复内容"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose()">取 消</el-button>
        <el-button
          type="primary"
          @click="replyCustomerComplaints"
        >回 复</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSalemanCustomerComplaints, replySalemanCustomerComplaints } from '@/api/marketing'

export default {
  data () {
    return {
      list: [],
      total: 0,
      dialogContent: {
        user_name: '',
        saleman: '',
        content: '',
        images: ''
      },
      dialogVisible: false,
      detailVisiable: false,
      dialogTitle: '回复投诉',
      replyContent: '',
      tableLoading: true,
      replyForm: {
        reply_id: 0,
        reply_content: ''
      },
      detailData: {},
      listQuery: {
        page: 1,
        pageSize: 20
      },
      filterData: {
        user_name: '',
        user_mobile: '',
        saleman_name: '',
        saleman_mobile: '',
        reply_status: ''
      },
      replyStatusSelect: [
        {
          label: '已回复',
          value: 1
        },
        {
          label: '未回复',
          value: 0
        }
      ],
      srcList: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      const queryData = Object.assign(this.listQuery, this.filterData)
      getSalemanCustomerComplaints(queryData).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total = response.data.data.total_count
        }
        this.tableLoading = false
      })
    },
    handleReply (row) {
      this.dialogVisible = true
      this.dialogTitle = '回复会员 ' + row.user_name + ' 的投诉'
      this.dialogContent.saleman = row.saleman_name
      this.dialogContent.content = row.complaints_content
      this.dialogContent.images = row.complaints_images
      this.srcList = row.complaints_images ? row.complaints_images.split(',') : []
      this.replyForm.reply_id = row.id
    },
    handleClose () {
      this.dialogVisible = false
      this.resetReplyForm()
    },
    handleDetail (row) {
      // let data = JSON.parse(JSON.stringify(row))
      // console.log('row.complaints_images',row.complaints_images, row.complaints_images.split(","))
      this.srcList = row.complaints_images ? row.complaints_images.split(',') : []
      this.detailData = Object.assign({}, row, {
        reply_content_list: JSON.parse(row.reply_content)
      })
      // console.log(1111,this.detailData)

      this.srcList = this.detailData.complaints_images
        ? this.detailData.complaints_images.split(',')
        : []

      // console.log('row.complaints_images',row.complaints_images, row.complaints_images.split(","))

      console.log('this.srcList', this.srcList)

      this.detailVisiable = true
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    resetReplyForm () {
      this.replyContent = ''
      this.replyForm = {
        reply_id: 0,
        reply_content: ''
      }
    },
    replyCustomerComplaints () {
      if (this.replyContent.trim() == '') {
        this.$message({
          message: '回复内容不能为空',
          type: 'warning'
        })
        return
      }
      this.replyForm.reply_content = this.replyContent
      replySalemanCustomerComplaints(this.replyForm).then((response) => {
        this.$message({
          message: '回复成功！',
          type: 'success'
        })
        this.dialogVisible = false
        this.getList()
        this.resetReplyForm()
      })
    },
    reset () {
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.filterInput {
  width: 150px;
}
.operator-con {
  border: 1px solid #ccc;
  padding: 10px;
  .w-135 {
    width: 135px;
  }
}
.div-flex {
  display: flex;
}
</style>
