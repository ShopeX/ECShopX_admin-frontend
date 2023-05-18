<style type="text/css" lang="scss">
.right-dialog {
  .el-transfer-panel {
    width: 240px;
  }
  .el-transfer-panel__footer {
    height: 38px;
    clear: both;
  }
}
.transfer-footer {
  padding: 6px 5px;
}
.alert-txt {
  padding: 15px 0;
}
.delay-dialog {
  .el-textarea {
    width: 80%;
    vertical-align: middle;
  }
  .option-box {
    padding: 15px 0;
    .el-date-editor {
      width: 70%;
    }
  }
}
</style>

<template>
  <div>
    <el-row
      v-if="this.$store.getters.login_type != 'staff'"
      class="content-bottom-padded"
      :gutter="20"
    >
      <el-col :span="3">
        <el-button type="primary" icon="plus" @click="adjustment"> 积分调整 </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="pointList" :height="wheight - 150">
      <el-table-column prop="point_desc" label="记录" min-width="140" />
      <el-table-column label="积分变动">
        <template slot-scope="scope">
          <span v-if="scope.row.income">+{{ scope.row.income }}</span>
          <span v-if="scope.row.outcome">-{{ scope.row.outcome }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" label="订单号" min-width="90" />
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-padded content-center">
      <el-pagination
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog
      title="积分调整"
      class="right-dialog"
      :visible.sync="adjustmentDialog"
      :before-close="handleCancelLabelsDialog"
    >
      <template>
        <el-form>
          <el-form-item label-width="100px" label="调整积分">
            <el-col>
              <el-select v-model="adjustment_type" placeholder="请选择" style="width: 100px">
                <el-option
                  v-for="item in adjustmentType"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="point"
                type="number"
                :min="1"
                :max="9999999"
                class="inline-input"
                style="width: 200px"
                placeholder="请输入要调整的积分"
              />
            </el-col>
          </el-form-item>
          <el-form-item class="content-center">
            <el-button type="primary" @click="onSubmit"> 确定添加 </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getMemberPoint, adjustmentPoint } from '../../../../src/api/point'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      activeName: 'point',
      total_count: 0,
      pointList: [],
      params: {
        page: 1,
        pageSize: 20,
        user_id: ''
      },
      adjustmentDialog: false,
      adjustmentType: [
        { name: '加', value: 'plus' },
        { name: '减', value: 'reduce' }
      ],
      adjustment_type: 'plus',
      point: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getPointList()
    this.params.user_id = this.$route.query.user_id
  },
  methods: {
    handleCurrentChange() {
      this.getPointList()
    },
    getPointList() {
      this.loading = true
      getMemberPoint(this.params).then((response) => {
        this.pointList = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    },
    // 积分调整
    adjustment() {
      this.adjustmentDialog = true
    },
    handleCancelLabelsDialog() {
      this.adjustmentDialog = false
    },
    handleCurrentChange(val) {
      this.loading = false
      this.params.page = val
      this.getPointList()
    },
    onSubmit() {
      if (this.point > 9999999) {
        this.$message({ message: '可调整积分最大为9999999', type: 'error' })
        return
      }
      let query = {
        user_id: this.$route.query.user_id,
        adjustment_type: this.adjustment_type,
        point: this.point
      }
      adjustmentPoint(query).then((res) => {
        this.$message({
          type: 'success',
          message: '调整积分成功'
        })
        this.getPointList()
        this.adjustmentDialog = false
        this.adjustment_type = 'plus'
        this.point = ''
      })
    }
  }
}
</script>
