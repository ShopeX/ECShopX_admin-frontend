<template>
  <SpPage>
    <div class="cus-authory-approve">
      <PersonInfo
        :info="approvel_info"
        title="详细信息"
        :operator-info="operator_info"
        :distributor-ids="distributorIds"
        :role-data="roleData"
      />
      <el-card v-if="approvel_info.status == '1'">
        <div class="cus-title">操作日志</div>
        <el-timeline :reverse="false" class="cus-timeline">
          <el-timeline-item
            v-for="(item, index) in logList"
            :key="index"
            :timestamp="item.custimestamp"
          >
            {{ item.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
      <el-card v-if="approvel_info.status == '2'">
        <div class="cus-title">驳回原因</div>
        <el-row>
          <el-col :span="24" style="margin-left: 20px">
            <span>{{ approvel_info.remarks || '-' }}</span>
          </el-col>
        </el-row>
      </el-card>
      <el-row class="cus-btn-box">
        <el-button
          v-if="approvel_info.status == '0'"
          type="success"
          class="btn"
          @click="handleDialogOpen(1)"
        >
          通过
        </el-button>
        <el-button
          v-if="approvel_info.status == '0'"
          type="danger"
          class="btn"
          @click="handleDialogOpen(2)"
        >
          驳回
        </el-button>
        <el-button
          v-if="approvel_info.status == '1' && approvel_info.is_closed == 0"
          :disabled="disabledBtn"
          type="primary"
          class="btn"
          @click="handleDialogOpen(3)"
        >
          关闭权限
        </el-button>
        <el-button
          v-if="approvel_info.status == '1' && approvel_info.is_closed == 1"
          :disabled="disabledBtn"
          type="primary"
          class="btn"
          @click="handleDialogOpen(4)"
        >
          打开权限
        </el-button>
      </el-row>
      <el-dialog
        title="审批弹框"
        :visible.sync="visibleModal"
        width="30%"
        :close-on-click-modal="false"
        @close="handleDialogClose"
      >
        <el-row>{{ visibleContent }}</el-row>
        <el-input
          v-if="approveType === 2"
          v-model="remarks"
          type="textarea"
          :rows="5"
          :maxlength="100"
          :show-word-limit="true"
          placeholder="请填写审批意见"
        />
        <div slot="footer" class="dialog-footer">
          <loading-btn
            ref="loadingBtn"
            size="medium"
            type="primary"
            text="确 定"
            @clickHandle="handleDialogChange('loadingBtn')"
          />
        </div>
      </el-dialog>
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  encryptDetail,
  datapassLog,
  encryptApprove,
  encryptClose,
  encryptOpen
} from '@/api/encrypt'
import PersonInfo from './component/PersonInfo'
import loadingBtn from '@/components/loading-btn'
import moment from 'moment'

export default {
  components: { PersonInfo, loadingBtn },
  data() {
    return {
      loading: true,
      activeName: 'first',
      pass_id: '',
      operator_id: '',
      approvel_info: {},
      operator_info: {},
      visibleModal: false,
      visibleContent: '',
      remarks: '',
      approveType: '',
      distributorIds: [],
      roleData: [],
      logList: [],
      disabledBtn: false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    if (this.$route.query.pass_id) {
      const { pass_id, operator_id } = this.$route.query || {}
      this.getDetail(pass_id)
      this.getLog(operator_id)
      this.pass_id = pass_id
      this.operator_id = operator_id
    }
  },
  methods: {
    getDetail(pass_id) {
      encryptDetail(pass_id)
        .then(response => {
          let data = response.data.data
          this.approvel_info = data || {}
          this.operator_info = data.operator_info || {}
          this.distributorIds = data.operator_info.distributor_ids || []
          this.roleData = data.operator_info.role_data || []
          let end_time = new Date(data.end_time + ' ' + '23:59:59').valueOf() // 结束时间
          let current_time = new Date().valueOf() // 当前时间
          if (current_time >= end_time) {
            this.disabledBtn = true
          }
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取详情出错'
          })
        })
    },
    getLog(operator_id) {
      datapassLog({ operator_id })
        .then(response => {
          let data = response.data.data.list
          data = data.map(el => {
            el.custimestamp = this.timeFilter(el.create_time)
            return el
          })
          this.logList = data || {}
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取日志出错'
          })
        })
    },
    handleDialogOpen(status) {
      // 打开审批弹框
      const { username, login_name } = this.operator_info
      this.approveType = status
      if (status === 1) {
        this.visibleContent = `请确认是否通过${login_name}的查看脱敏权限的申请`
      } else if (status === 2) {
        this.visibleContent = `请确认是否驳回${login_name}的查看脱敏数据的申请`
      } else if (status === 3) {
        this.visibleContent = `请确认是否关闭${login_name}的查看脱敏数据的权限`
      } else if (status === 4) {
        this.visibleContent = `请确认是否打开${login_name}的查看脱敏数据的权限`
      }
      this.visibleModal = true
    },
    handleDialogChange(ref) {
      // 点击审批弹框确定按钮
      let api = null
      let parmas = {}
      if (this.approveType === 1 || this.approveType === 2) {
        api = encryptApprove
        parmas = {
          status: this.approveType,
          remarks: this.remarks
        }
      } else if (this.approveType === 3) {
        api = encryptClose
        parmas = {
          is_closed: '1'
        }
      } else if (this.approveType === 4) {
        api = encryptOpen
        parmas = {
          is_closed: '0'
        }
      }
      api(this.pass_id, parmas).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getDetail(this.pass_id)
        this.getLog(this.operator_id)
        // this.$parent.fetchList()
        this.$refs[ref].closeLoading()
        this.visibleModal = false
        this.visibleContent = ''
        this.remarks = ''
      })
    },
    handleDialogClose() {
      // 关闭审批弹框
      this.visibleModal = false
      this.remarks = ''
      this.visibleContent = ''
    },
    timeFilter(time) {
      return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss">
.cus-authory-approve {
  padding-bottom: 60px;
  .cus-btn-box {
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 10px 0px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-45%);
    width: 100%;
    margin-bottom: 0px !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .cus-time {
    span:nth-child(even) {
      margin-right: 50px;
    }
  }
  .cus-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 25px;
  }
  .cus-timeline {
    margin-top: 20px;
    padding-left: 10px;
    .el-timeline-item {
      padding-bottom: 40px;
    }
  }
}
</style>
