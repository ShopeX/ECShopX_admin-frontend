<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="content-bottom-padded" />
    <el-row :gutter="20">
      <el-col :md="8" :lg="6">
        <el-input v-model="params.name" :placeholder="$t('0976304f.d541f8')">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col>
      <el-col :md="8" :lg="6">
        <el-input v-model="params.mobile" :placeholder="$t('0976304f.8098e2')">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col>
      <el-col :md="6" :lg="4">
        <el-select
          v-model="params.status"
          :placeholder="$t('0976304f.b6d0e9')"
          clearable
          style="width: 100%"
          @change="dataSearch"
        >
          <el-option :label="$t('0976304f.5cb424')" value="loading" />
          <el-option :label="$t('0976304f.9d5b9b')" value="open" />
          <el-option :label="$t('0976304f.81233d')" value="refuse" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="plus" @click="addServiceLabels">
          {{ $t('0976304f.cc1c5e') }}
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="communityList" :height="wheight - 270">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item :label="$t('0976304f.f0c36d')">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item :label="$t('0976304f.c2610e')">
              <span>{{ props.row.created_date }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="community_id" :label="$t('0976304f.a92866')" min-width="70" />
      <el-table-column prop="community_name" :label="$t('0976304f.d541f8')" min-width="120" />
      <el-table-column prop="leader_name" :label="$t('0976304f.07e57c')" />
      <el-table-column prop="leader_mobile" :label="$t('0976304f.6621f6')" min-width="110" />
      <el-table-column prop="status" :label="$t('0976304f.3fea7c')" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'open'">{{ $t('0976304f.e52902') }}</span>
          <span v-if="scope.row.status === 'close'">{{ $t('0976304f.8d63ef') }}</span>
          <span v-if="scope.row.status === 'loading'">{{ $t('0976304f.5cb424') }}</span>
          <span v-if="scope.row.status === 'refuse'">{{ $t('0976304f.ff88e0') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pass_date" :label="$t('0976304f.db185f')" min-width="100" />

      <el-table-column prop="status" :label="$t('0976304f.53c3dd')" min-width="80">
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
      <el-table-column min-width="140" :label="$t('0976304f.2b6bc0')">
        <template slot-scope="scope">
          <div class="operating-icons gap-2">
            <el-button
              v-if="scope.row.status === 'loading'"
              type="text"
              @click="checkAction(scope.row)"
            >
              {{ $t('0976304f.cf13b1') }}
            </el-button>
            <el-button type="text" @click="pointlist(scope.$index, scope.row)">
              {{ $t('0976304f.2076e8') }}
            </el-button>
            <el-button type="text" @click="editCommunityAction(scope.$index, scope.row)">
              {{ $t('0976304f.95b351') }}
            </el-button>
            <el-button type="text" @click="deleteCommunityAction(scope.$index, scope.row)">
              {{ $t('0976304f.2f4aad') }}
            </el-button>
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
    <el-dialog
      :title="$t('0976304f.ae48dd')"
      :visible.sync="checkVisible"
      :before-close="handleCancel"
    >
      <template>
        <el-form ref="form" :model="community" class="demo-ruleForm" label-width="90px">
          <el-form-item :label="$t('0976304f.fc82aa')">
            <el-col :span="7">
              {{ community.address }}
            </el-col>
          </el-form-item>
          <el-form-item inline="true" class="demo-form-inline" :label="$t('0976304f.4cb06f')">
            {{ community.lng }}-{{ community.lat }}
          </el-form-item>

          <el-form-item :label="$t('0976304f.d541f8')">
            {{ community.community_name }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.07e57c')">
            {{ community.leader_name }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.6621f6')">
            {{ community.leader_mobile }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.e46336')">
            {{ community.leader_id_card }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.9315dc')">
            {{ community.leader_nickname }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.8a4cf0')">
            {{ community.description }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.dd0925')">
            {{ community.referrer }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.63388b')">
            {{ community.num }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.44bf0a')">
            {{ community.business_district }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.cc3307')">
            {{ community.hour }}
          </el-form-item>
          <el-form-item :label="$t('0976304f.b6d0e9')">
            <template>
              <el-radio v-model="community.check_status" label="open">
                {{ $t('0976304f.23c1f3') }}
              </el-radio>
              <el-radio v-model="community.check_status" label="refuse">
                {{ $t('0976304f.7173f8') }}
              </el-radio>
            </template>
          </el-form-item>
          <el-form-item v-if="community.check_status == 'refuse'" :label="$t('0976304f.cc3307')">
            <el-input
              v-model="community.deny_reason"
              type="textarea"
              :rows="2"
              :placeholder="$t('0976304f.d63114')"
            />
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> {{ $t('0976304f.625fb2') }} </el-button>
        <el-button type="primary" @click="checkActionSubmit">
          {{ $t('0976304f.be5fbb') }}
        </el-button>
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
      getcommunityDetail(row.community_id).then((response) => {
        this.communityDetailData = response.data.data
      })
    },
    dataSearch() {
      this.params.page = 1
      this.getCommunitysList()
    },
    getCommunitysList() {
      this.loading = true
      getCommunityList(this.params).then((response) => {
        this.communityList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteCommunityAction(index, row) {
      this.$confirm(this.$t('0976304f.e831d8'), this.$t('0976304f.02d981'), {
        confirmButtonText: this.$t('0976304f.38cf16'),
        cancelButtonText: this.$t('0976304f.625fb2'),
        type: 'warning'
      })
        .then(() => {
          communityDelete(row.community_id).then((response) => {
            this.communityList.splice(index, 1)
            this.$message({
              message: this.$t('0976304f.5b510e'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('0976304f.2111cc')
          })
        })
    },
    updateStatusCommunity(params) {
      CommunityStatusUpdate(params).then((res) => {
        this.$message({ message: this.$t('0976304f.33130f'), type: 'success' })
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
