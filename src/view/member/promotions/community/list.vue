<template>
  <div>
    <div class="content-bottom-padded" />
    <el-row :gutter="20">
      <el-col :md="8" :lg="6">
        <el-input v-model="params.name" placeholder="社区名称">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col>
      <el-col :md="8" :lg="6">
        <el-input v-model="params.mobile" placeholder="手机号">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col>
      <el-col :md="6" :lg="4">
        <el-select
          v-model="params.status"
          placeholder="审核状态"
          clearable
          style="width: 100%"
          @change="dataSearch"
        >
          <el-option label="待审核" value="loading" />
          <el-option label="已审核" value="open" />
          <el-option label="已拒绝" value="refuse" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="plus" @click="addServiceLabels"> 添加社区 </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="communityList" :height="wheight - 270">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="提货地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="入住时间">
              <span>{{ props.row.created_date }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="community_id" label="社区ID" min-width="70" />
      <el-table-column prop="community_name" label="社区名称" min-width="120" />
      <el-table-column prop="leader_name" label="团长姓名" />
      <el-table-column prop="leader_mobile" label="团长手机" min-width="110" />
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'open'">营业</span>
          <span v-if="scope.row.status === 'close'">暂停</span>
          <span v-if="scope.row.status === 'loading'">待审核</span>
          <span v-if="scope.row.status === 'refuse'">拒绝申请</span>
        </template>
      </el-table-column>
      <el-table-column prop="pass_date" label="通过时间" min-width="100" />

      <el-table-column prop="status" label="是否启用" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'open' || scope.row.status === 'close'">
            <el-switch
              v-model="scope.row.status"
              active-value="open"
              inactive-value="close"
              @change="SwitchChange(scope.row)"
            />
          </span>
          <span v-if="scope.row.status === 'loading'">
            <el-switch active-value="open" inactive-value="close" disabled />
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="140" label="操作">
        <template slot-scope="scope">
          <div class="operating-icons">
            <el-button
              v-if="scope.row.status === 'loading'"
              type="text"
              @click="checkAction(scope.row)"
            >
              审核
            </el-button>
            <el-button type="text" @click="pointlist(scope.$index, scope.row)">
              积分明细
            </el-button>
            <el-button type="text" @click="editCommunityAction(scope.$index, scope.row)">
              编辑
            </el-button>
            <i
              class="mark iconfont icon-trash-alt1"
              @click="deleteCommunityAction(scope.$index, scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="社区信息审核" :visible.sync="checkVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="community" class="demo-ruleForm" label-width="90px">
          <el-form-item label="地理位置">
            <el-col :span="7">
              {{ community.address }}
            </el-col>
          </el-form-item>
          <el-form-item inline="true" class="demo-form-inline" label="社区经纬度">
            {{ community.lng }}-{{ community.lat }}
          </el-form-item>

          <el-form-item label="社区名称">
            {{ community.community_name }}
          </el-form-item>
          <el-form-item label="团长姓名">
            {{ community.leader_name }}
          </el-form-item>
          <el-form-item label="团长手机">
            {{ community.leader_mobile }}
          </el-form-item>
          <el-form-item label="团长身份证">
            {{ community.leader_id_card }}
          </el-form-item>
          <el-form-item label="团长昵称">
            {{ community.leader_nickname }}
          </el-form-item>
          <el-form-item label="备注说明">
            {{ community.description }}
          </el-form-item>
          <el-form-item label="推荐人">
            {{ community.referrer }}
          </el-form-item>
          <el-form-item label="社区人数">
            {{ community.num }}
          </el-form-item>
          <el-form-item label="小区商圈">
            {{ community.business_district }}
          </el-form-item>
          <el-form-item label="营业时间">
            {{ community.hour }}
          </el-form-item>
          <el-form-item label="审核状态">
            <template>
              <el-radio v-model="community.check_status" label="open"> 通过 </el-radio>
              <el-radio v-model="community.check_status" label="refuse"> 拒绝 </el-radio>
            </template>
          </el-form-item>
          <el-form-item v-if="community.check_status == 'refuse'" label="营业时间">
            <el-input
              v-model="community.deny_reason"
              type="textarea"
              :rows="2"
              placeholder="请输入原因"
            />
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="checkActionSubmit"> 保存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getCommunityDetail,
  communityDelete,
  getCommunityList,
  CommunityStatusUpdate
} from '../../../../api/community'
export default {
  props: ['getStatus'],
  data() {
    return {
      form: {
        service_type: 'timescard',
        label_name: '',
        label_price: '',
        label_desc: ''
      },
      activeName: 'first',
      communityList: [],
      communityDetailVisible: false,
      communityDetailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        status: '',
        name: '',
        mobile: ''
      },
      checkVisible: false,
      community: {}
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getCommunitysList()
      }
    }
  },
  mounted() {
    this.getCommunitysList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getCommunitysList()
    },
    addServiceLabels() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    pointlist(index, row) {
      this.$router.push({
        path: this.matchRoutePath('detail'),
        query: { community_id: row.community_id, name: row.leader_name }
      })
    },
    editCommunityAction(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.community_id })
    },
    communityDetail(index, row) {
      this.communityDetailVisible = true
      getcommunityDetail(row.community_id).then(response => {
        this.communityDetailData = response.data.data
      })
    },
    dataSearch() {
      this.params.page = 1
      this.getCommunitysList()
    },
    getCommunitysList() {
      this.loading = true
      getCommunityList(this.params).then(response => {
        this.communityList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteCommunityAction(index, row) {
      this.$confirm('此操作将删除该社区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          communityDelete(row.community_id).then(response => {
            this.communityList.splice(index, 1)
            this.$message({
              message: '删除社区成功',
              type: 'success',
              duration: 5 * 1000
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
    updateStatusCommunity(params) {
      CommunityStatusUpdate(params).then(res => {
        this.$message({ message: '操作成功', type: 'success' })
        this.checkVisible = false
      })
    },
    SwitchChange(row) {
      let params = {
        community_id: row.community_id,
        status: row.status
      }
      this.updateStatusCommunity(params)
    },
    checkAction(row) {
      this.community = row
      this.check_status = 'open'
      this.community.deny_reason = ''
      this.checkVisible = true
    },
    checkActionSubmit() {
      let params = {
        community_id: this.community.community_id,
        status: this.community.check_status
      }
      if (params.status == 'close') {
        params.deny_reason = this.community.deny_reason
      }
      this.updateStatusCommunity(params)
    },
    handleCancel() {
      this.checkVisible = false
      this.community = {}
    }
  }
}
</script>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
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
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
