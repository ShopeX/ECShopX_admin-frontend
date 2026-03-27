<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="8" :lg="6">
        <el-input v-model="params.order_id" :placeholder="$t('d14d01a0.1e8dc2')">
          <el-button slot="append" icon="el-icon-search" @click="getLuckyDrawTeamList" />
        </el-input>
      </el-col>
      <el-col :md="8" :lg="6">
        <el-input v-model="params.mobile" :placeholder="$t('d14d01a0.8098e2')">
          <el-button slot="append" icon="el-icon-search" @click="getLuckyDrawTeamList" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="luckyDrawTeamList" style="width: 110%" border height="580">
      <el-table-column prop="luckydraw_trade_id" :label="$t('d14d01a0.1e8dc2')" width="180" />
      <el-table-column prop="lucky_code" :label="$t('d14d01a0.e492b7')" width="120" />
      <el-table-column prop="member_info.backend_mobile" :label="$t('d14d01a0.8098e2')" width="120">
        <template slot-scope="scope">
          <router-link
            :to="{ path: '/member/manage/members/detail', query: { user_id: scope.row.user_id } }"
          >
            {{ scope.row.member_info.backend_mobile }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="member_info.username" :label="$t('d14d01a0.60d045')" width="100" />
      <el-table-column :label="$t('d14d01a0.2240cc')" width="160">
        <template slot-scope="scope">
          {{ scope.row.created | datetime }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('d14d01a0.830d03')" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.lucky_status == 'wait'"> {{ $t('d14d01a0.67d31e') }} </el-tag>
          <el-tag v-else-if="scope.row.lucky_status == 'lucky'" type="danger">
            {{ $t('d14d01a0.c809f4') }}
          </el-tag>
          <el-tag v-else-if="scope.row.lucky_status == 'unlucky'" type="info">
            {{ $t('d14d01a0.1229c3') }}
          </el-tag>
          <el-tag v-else> - </el-tag>
          <el-button
            v-if="scope.row.lucky_status == 'lucky' && !scope.row.ship_code"
            type="text"
            @click="deliveryAction(scope.row)"
          >
            {{ $t('d14d01a0.045315') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('d14d01a0.510fa2')" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payment_status == 'payed'" type="success">
            {{ $t('d14d01a0.8d02a5') }}
          </el-tag>
          <el-tag v-else-if="scope.row.payment_status == 'unpay'" type="info">
            {{ $t('d14d01a0.608afd') }}
          </el-tag>
          <el-tag v-else-if="scope.row.payment_status == 'refunded'" type="warning">
            {{ $t('d14d01a0.e85018') }}
          </el-tag>
          <el-tag v-else-if="scope.row.payment_status == 'readyrefund'">
            {{ $t('d14d01a0.12e196') }}
          </el-tag>
          <el-tag v-else> - </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('d14d01a0.7a39b1')">
        <template v-if="scope.row.luckydraw_payment == 'cash'" slot-scope="scope">
          <span>{{ scope.row.luckydraw_price / 100 }}{{ $t('d14d01a0.c16655') }}</span>
        </template>
        <template v-if="scope.row.luckydraw_payment == 'point'" slot-scope="scope">
          <span>{{ scope.row.luckydraw_point }} {{ $t('d14d01a0.9f68a8') }}</span>
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
    <!-- 发货-开始 -->
    <el-dialog
      :title="$t('d14d01a0.045315')"
      :visible.sync="deliveryVisible"
      :before-close="handleCancel"
      width="57%"
    >
      <template>
        <el-alert
          v-if="deliveryData.ship_status == 'waitaddress' || !deliveryData.ship_status"
          :title="$t('d14d01a0.8c2531')"
          type="error"
        />
        <el-form ref="deliveryForm" :model="deliveryForm" class="demo-ruleForm" label-width="100px">
          <el-form-item :label="$t('d14d01a0.886f6d')">
            <el-col :span="20">
              {{ deliveryData.luckydraw_trade_id }}
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('d14d01a0.1fd1d5')">
            <el-col :span="20">
              {{ deliveryData.item_name }}
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('d14d01a0.9f68a8')">
            <el-col :span="20">
              {{ deliveryData.luckydraw_point }}
            </el-col>
          </el-form-item>
          <el-form-item v-if="deliveryData.address_id" :label="$t('d14d01a0.748ea9')">
            <el-col :span="20">
              {{ deliveryData.address.province }}
              {{ deliveryData.address.city }}
              {{ deliveryData.address.county }}
              {{ deliveryData.address.adrdetail }}
            </el-col>
          </el-form-item>
          <el-form-item v-if="deliveryData.address_id" :label="$t('d14d01a0.6aea70')">
            <el-col :span="20">
              {{ deliveryData.address.username }}
            </el-col>
          </el-form-item>
          <el-form-item v-if="deliveryData.address_id" :label="$t('d14d01a0.8098e2')">
            <el-col :span="20">
              {{ deliveryData.address.telephone }}
            </el-col>
          </el-form-item>
          <template v-if="deliveryData.address_id">
            <el-form-item :label="$t('d14d01a0.f3af96')">
              <el-col>
                <el-select
                  v-model="deliveryForm.ship_corp"
                  filterable
                  :placeholder="$t('d14d01a0.32e586')"
                >
                  <el-option
                    v-for="item in dlycorps"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('d14d01a0.0bb075')">
              <el-col :span="14">
                <el-input
                  v-model="deliveryForm.ship_code"
                  :maxlength="20"
                  :placeholder="$t('d14d01a0.0e9f1e')"
                />
              </el-col>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> {{ $t('d14d01a0.625fb2') }} </el-button>
        <el-button type="primary" @click="submitDeliveryAction">
          {{ $t('d14d01a0.38cf16') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLuckyDrawTeamList, luckydrawDelivery } from '../../../../../api/promotions'
import hqbdlycorp from '../../../../../common/hqbdlycorp.json'

export default {
  props: ['view'],
  data() {
    return {
      loading: false,
      luckydraw_id: null,
      luckyDrawTeamList: [],
      luckyDrawActivity: {},
      total_count: 0,
      params: {
        view: 0,
        page: 1,
        pageSize: 20,
        keywords: '',
        order_id: '',
        mobile: ''
      },
      IsDisabled: false,
      deliveryVisible: false,
      deliveryData: {},
      deliveryForm: {
        luckydraw_trade_id: '',
        ship_corp: '',
        ship_code: '',
        sepInfo: {}
      },
      dlycorps: hqbdlycorp
    }
  },
  mounted() {
    this.luckydraw_id = this.$route.params.luckydraw_id
    this.params.view = this.view
    this.getLuckyDrawTeamList()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      this.getLuckyDrawTeamList()
    },
    getLuckyDrawTeamList() {
      this.loading = true
      getLuckyDrawTeamList(this.luckydraw_id, this.params)
        .then((response) => {
          this.luckyDrawTeamList = response.data.data.list
          this.luckyDrawActivity = response.data.data.luckyDrawActivity
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('d14d01a0.718f46')
          })
        })
    },
    deliveryAction(row) {
      // 编辑物料弹框
      this.deliveryVisible = true
      this.deliveryData = row
      if (this.deliveryData) {
        this.IsDisabled = true
      }
      this.deliveryForm.luckydraw_trade_id = row.luckydraw_trade_id
      this.deliveryForm.ship_code = row.ship_code
      this.deliveryForm.ship_corp = row.ship_corp
    },
    handleCancel() {
      this.deliveryVisible = false
      this.deliveryForm.luckydraw_trade_id = ''
      this.deliveryForm.ship_corp = ''
      this.deliveryForm.ship_code = ''
    },
    submitDeliveryAction() {
      // 提交物料
      console.log(this.deliveryData)
      if (!this.deliveryData.address_id) {
        this.$message.error(this.$t('d14d01a0.58f0da'))
        return false
      }
      luckydrawDelivery(this.deliveryForm).then((response) => {
        if (response.data.data) {
          this.handleCancel()
          this.$message.success(this.$t('d14d01a0.de3b52'))
          this.getLuckyDrawTeamList()
        } else {
          this.$message.error(this.$t('d14d01a0.2249c1'))
          return false
        }
      })
    }
  }
}
</script>

<style scoped></style>
