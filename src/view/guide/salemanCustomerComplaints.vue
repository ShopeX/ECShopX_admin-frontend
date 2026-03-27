<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-input
        v-model="filterData.user_name"
        :placeholder="$t('0db78d42.f2b7de')"
        class="filterInput"
        clearable
        @clear="reset"
      />
      <el-input
        v-model="filterData.user_mobile"
        :placeholder="$t('0db78d42.6a52ee')"
        class="filterInput"
        clearable
        @clear="reset"
      />
      <el-input
        v-model="filterData.saleman_name"
        :placeholder="$t('0db78d42.2514d0')"
        class="filterInput"
        clearable
        @clear="reset"
      />
      <el-input
        v-model="filterData.saleman_mobile"
        :placeholder="$t('0db78d42.f1ba67')"
        class="filterInput"
        clearable
        @clear="reset"
      />
      <el-select
        v-model="filterData.reply_status"
        :placeholder="$t('0db78d42.362b3b')"
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
      <el-button type="primary" @click="getList">{{ $t('0db78d42.bee912') }}</el-button>
    </div>

    <!-- 数据表格 -->
    <el-card>
      <el-table v-loading="tableLoading" :data="list" style="width: 100%">
        <el-table-column prop="user_name" :label="$t('0db78d42.4d9dd5')" width="" />
        <el-table-column prop="user_mobile" :label="$t('0db78d42.6a52ee')" width="" />
        <el-table-column prop="saleman_name" :label="$t('0db78d42.a6d9eb')" width="" />
        <el-table-column prop="saleman_mobile" :label="$t('0db78d42.f1ba67')" width="" />
        <el-table-column prop="complaints_content" :label="$t('0db78d42.4026ef')" />
        <el-table-column prop="reply_status" :label="$t('0db78d42.362b3b')">
          <template slot-scope="scope">
            <span v-if="scope.row.reply_status == 1">{{ $t('0db78d42.4bea88') }}</span>
            <span v-else-if="scope.row.reply_status == 0">{{ $t('0db78d42.6231a2') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('0db78d42.2b6bc0')">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handleReply(scope.row)">
              {{ $t('0db78d42.1edff0') }}
            </el-button>
            <el-button type="primary" plain size="mini" @click="handleDetail(scope.row)">
              {{ $t('0db78d42.f26225') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
        <el-pagination
          background
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 详情弹窗 -->
    <el-dialog :title="$t('0db78d42.f26225')" :visible.sync="detailVisiable">
      <el-form label-position="left" label-width="100px">
        <el-form-item :label="$t('0db78d42.f2b7de')">
          <span>{{ detailData.user_name }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.6a52ee')">
          <span>{{ detailData.user_mobile }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.a6d9eb')">
          <span>{{ detailData.saleman_name }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.f1ba67')">
          <span>{{ detailData.saleman_mobile }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.4026ef')">
          <span>{{ detailData.complaints_content }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.77fcac')">
          <!-- val:{{ srcList }} -->
          <el-image
            v-for="(item, index) in srcList"
            :key="index"
            style="width: 100px; height: 100px"
            :src="item"
            :preview-src-list="srcList"
          />
        </el-form-item>
        <el-form-item :label="$t('0db78d42.362b3b')">
          <span v-if="detailData.reply_status == 0">{{ $t('0db78d42.6231a2') }}</span>
          <span v-else>{{ $t('0db78d42.4bea88') }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.fab08d')">
          <el-row
            v-for="(item, index) in detailData.reply_content_list"
            :key="index"
            class="operator-con"
            :gutter="0"
          >
            <el-col :span="12">{{ $t('0db78d42.8146bb') }}{{ item.reply_operator_name }}</el-col>
            <el-col :span="12">
              {{ $t('0db78d42.afdc52') }}{{ item.reply_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </el-col>
            <el-col :span="24">
              <div class="div-flex">
                <div class="w-135">{{ $t('0db78d42.fab08d') }}：</div>
                <div>
                  {{ item.reply_content }}
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.ba74d1')">
          <span>{{ detailData.reply_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.1d1c01')">
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
      <el-form label-position="left" label-width="80px">
        <el-form-item :label="$t('0db78d42.a6d9eb')">
          <span>{{ dialogContent.saleman }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.4026ef')">
          <span>{{ dialogContent.content }}</span>
        </el-form-item>
        <el-form-item :label="$t('0db78d42.20def7')">
          <el-image
            v-for="(item, index) in srcList"
            :key="index"
            style="width: 100px; height: 100px"
            :src="item"
            :preview-src-list="srcList"
          />
        </el-form-item>
        <el-form-item :label="$t('0db78d42.1edff0')">
          <el-input
            v-model="replyContent"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="$t('0db78d42.f9d980')"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">{{ $t('0db78d42.625fb2') }}</el-button>
        <el-button type="primary" @click="replyCustomerComplaints">{{
          $t('0db78d42.1edff0')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSalemanCustomerComplaints, replySalemanCustomerComplaints } from '@/api/marketing'

export default {
  data() {
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
      dialogTitle: this.$t('0db78d42.64a3c8'),
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
        { label: this.$t('0db78d42.4bea88'), value: 1 },
        { label: this.$t('0db78d42.6231a2'), value: 0 }
      ],
      srcList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      const queryData = Object.assign(this.listQuery, this.filterData)
      getSalemanCustomerComplaints(queryData).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total = response.data.data.total_count
        }
        this.tableLoading = false
      })
    },
    handleReply(row) {
      this.dialogVisible = true
      this.dialogTitle = this.$t('0db78d42.3da91d') + row.user_name + this.$t('0db78d42.5c0b25')
      this.dialogContent.saleman = row.saleman_name
      this.dialogContent.content = row.complaints_content
      this.dialogContent.images = row.complaints_images
      this.srcList = row.complaints_images ? row.complaints_images.split(',') : []
      this.replyForm.reply_id = row.id
    },
    handleClose() {
      this.dialogVisible = false
      this.resetReplyForm()
    },
    handleDetail(row) {
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
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetReplyForm() {
      this.replyContent = ''
      this.replyForm = {
        reply_id: 0,
        reply_content: ''
      }
    },
    replyCustomerComplaints() {
      if (this.replyContent.trim() == '') {
        this.$message({
          message: this.$t('0db78d42.81071e'),
          type: 'warning'
        })
        return
      }
      this.replyForm.reply_content = this.replyContent
      replySalemanCustomerComplaints(this.replyForm).then((response) => {
        this.$message({
          message: this.$t('0db78d42.b82287'),
          type: 'success'
        })
        this.dialogVisible = false
        this.getList()
        this.resetReplyForm()
      })
    },
    reset() {
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
