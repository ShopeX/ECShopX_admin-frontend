<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('storelist') === -1" class="cus-details">
      <el-card>
        <el-row>
          <el-col :span="3">
            <img class="cus-details-img" src="@/assets/img/adapay/dealer.png" alt="">
          </el-col>
          <el-col :span="20">
            <div class="cus-details-flex">
              <p class="cus-details-row">
                {{ infoList.basicInfo ? infoList.basicInfo.name : '-' }}
              </p>
              <div class="cus-details-pfonts cus-margin-40">
                <i class="el-icon-location-outline cus-icon" />
                <span>{{ infoList.basicInfo ? infoList.basicInfo.area : '-' }}</span>
              </div>
            </div>
            <p class="cus-details-pfonts">
              <i class="el-icon-s-custom cus-icon" />
              <span>{{ infoList.basicInfo ? infoList.basicInfo.contact : '-' }}</span>
            </p>
            <div class="cus-details-flex">
              <div class="cus-details-pfonts">
                <i class="el-icon-phone cus-icon" />
                <span>{{
                  infoList.basicInfo ? infoList.basicInfo.tel_no + $t('9d04916c.88ab08') : '-'
                }}</span>
              </div>
              <div class="cus-details-pfonts cus-margin-50">
                <i class="el-icon-message cus-icon" />
                <span>{{
                  infoList.basicInfo ? infoList.basicInfo.email + $t('9d04916c.c15332') : '-'
                }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-tabs v-model="activeName" class="cus-details-tabs" @tab-click="tabChange">
          <el-tab-pane v-if="infoList.member_id" :label="$t('9d04916c.ac7b4c')" name="first">
            <BaseModal
              :span="7"
              :label-list="infoList.member_type === 'corp' ? enterPriseList : personInfo"
              :info="infoList"
              :title="
                infoList.member_type === 'corp' ? $t('9d04916c.54796d') : $t('9d04916c.eab129')
              "
            />
            <BaseModal
              :span="7"
              :label-list="infoList.member_type === 'corp' ? enterAccountInfo : accountList"
              :info="infoList"
              :title="$t('9d04916c.99f89b')"
            />
            <BaseModal
              :span="7"
              :label-list="
                infoList.member_type === 'corp' ? enterSplitAccountList : splitAccountList
              "
              :info="split_ledger_info"
              :title="$t('9d04916c.adb36c')"
            />
            <el-card>
              <div slot="header">{{ $t('9d04916c.febe40') }}</div>
              <div class="body">
                <el-row class="load-btn">
                  <el-col :span="4" style="text-align: right; padding-right: 10px">
                    {{ $t('9d04916c.8a9502') }}
                  </el-col>
                  <el-col v-if="infoList.member_type === 'corp'" :span="20" class="cus-btn">
                    <el-button type="text" @click="dowloadFile(infoList.attach_file)">
                      {{ $t('9d04916c.c9a6ee') }}
                    </el-button>
                  </el-col>
                  <span v-else>-</span>
                </el-row>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane v-else :label="$t('9d04916c.ac7b4c')" name="first">
            <el-row style="height: 350px" type="flex" justify="center" align="middle">
              <span style="color: #ccc">{{ $t('9d04916c.192fdd') }}</span>
            </el-row>
          </el-tab-pane>
          <el-tab-pane :label="$t('9d04916c.cf8e1f')" name="second">
            <el-timeline :reverse="false" class="cus-timeline">
              <el-timeline-item
                v-for="(item, index) in logList"
                :key="index"
                :timestamp="item.create_date"
              >
                {{ item.content }}
              </el-timeline-item>
            </el-timeline>
            <el-pagination
              layout="total, sizes, prev, pager, next"
              :current-page.sync="params.page"
              :page-sizes="[10, 20, 50]"
              :page-size="params.page_size"
              :total="total_count"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- <el-row class='cus-details-bot'>
        <router-link :to='{ path: matchRoutePath('storelist'), query: { operator_id: this.operator_id}}'>
          <el-button type='primary' size='small' plain>查看关联店铺</el-button>
        </router-link>
        <el-button @click='handleOpenOpeartion(true, '开启')' type='success' plain size='mini'>开启</el-button>
        <el-button @click='handleOpenOpeartion(true, '禁用')' type='danger' plain size='mini'>禁用</el-button>
        <el-button type='primary' size='small' plain>导出</el-button>
      </el-row> -->
      <el-dialog
        :title="$t('9d04916c.59a702')"
        :visible.sync="visibleModal"
        width="25%"
        :close-on-click-modal="false"
        @before-close="handleOpenOpeartion(false, '')"
      >
        <el-row>
          {{ modalContent }}
        </el-row>
        <el-row style="text-align: right">
          <el-button type="primary" size="small" plain @click="handleModalConfirm(false)">
            {{ $t('9d04916c.625fb2') }}
          </el-button>
          <el-button type="primary" size="small" @click="handleModalConfirm(true)">
{{
            $t('9d04916c.e83a25')
          }}
</el-button>
        </el-row>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { getDealerDetail } from '@/api/marketing'
import BaseModal from '@/view/mall/marketing/component/BaseModal'
import { getAdapayLogList } from '@/api/adapay/dealer'

export default {
  components: { BaseModal },
  data() {
    return {
      activeName: 'first',
      operator_id: 0,
      infoList: {},
      content: '',
      type: '',
      visibleModal: false,
      modalType: '',
      modalContent: '',
      split_ledger_info: {},
      logList: [],
      total_count: 0,
      params: {
        page: 1,
        page_size: 10
      },
      enterPriseList: [
        // 企业信息
        { name: this.$t('d41d8cd9.q1r2s3'), field: 'legal_person' },
        { name: this.$t('d41d8cd9.t4u5v6'), field: 'legal_cert_id' },
        { name: this.$t('d41d8cd9.w7x8y9'), field: 'legal_cert_id_expires' },
        { name: this.$t('d41d8cd9.z0a1b2'), field: 'social_credit_code' },
        { name: this.$t('d41d8cd9.c3d4e5'), field: 'social_credit_code_expires	' },
        { name: this.$t('d41d8cd9.f6g7h8'), field: 'business_scope' },
        { name: this.$t('d41d8cd9.i9j0k1'), field: 'tel_no' },
        { name: this.$t('d41d8cd9.l2m3n4'), field: 'address' },
        { name: this.$t('d41d8cd9.o5p6q7'), field: 'zip_code' }
      ],
      enterAccountInfo: [
        // 企业结算账户信息
        { name: this.$t('d41d8cd9.r8s9t0'), field: 'card_no' },
        { name: this.$t('d41d8cd9.u1v2w3'), field: 'card_name' },
        { name: this.$t('d41d8cd9.x4y5z6'), field: 'bank_name' },
        { name: this.$t('d41d8cd9.a7b8c9'), field: 'bank_acct_type', filter: this.bankFilter }
      ],
      enterSplitAccountList: [
        // 企业分帐
        {
          name: this.$t('d41d8cd9.d0e1f2'),
          field: 'headquarters_proportion',
          filter: this.headquartersFilter
        },
        { name: this.$t('d41d8cd9.g3h4i5'), field: 'dealer_proportion', filter: this.dealerFilter },
        { name: this.$t('d41d8cd9.j6k7l8'), field: 'adapay_fee_mode', filter: this.adapayFilter }
      ],
      personInfo: [
        // 个人信息
        { name: this.$t('d41d8cd9.m9n0o1'), field: 'user_name' },
        { name: this.$t('d41d8cd9.p2q3r4'), field: 'tel_no' },
        { name: this.$t('d41d8cd9.t4u5v6'), field: 'cert_id' }
      ],
      accountList: [
        // 个人结算信息
        { name: this.$t('d41d8cd9.s5t6u7'), field: 'bank_card_name' },
        { name: this.$t('d41d8cd9.v8w9x0'), field: 'bank_tel_no' },
        { name: this.$t('d41d8cd9.y1z2a3'), field: 'bank_card_id' },
        { name: this.$t('d41d8cd9.b4c5d6'), field: 'bank_cert_id' }
      ],
      splitAccountList: [
        { name: this.$t('d41d8cd9.j6k7l8'), field: 'adapay_fee_mode', filter: this.adapayFilter }
      ]
    }
  },
  mounted() {
    if (this.$route.query.operator_id) {
      this.operator_id = this.$route.query.operator_id
      this.getTabDetail(this.operator_id)
    }
  },
  methods: {
    addressFilter() {
      const { lat, lng } = this.infoList
      return lng + ' - ' + lat
    },
    getTabDetail(id) {
      getDealerDetail(id)
        .then((response) => {
          this.infoList = response.data.data
          this.split_ledger_info = response.data.data.split_ledger_info || {}
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('9d04916c.25bc43')
          })
        })
    },
    getLogList() {
      getAdapayLogList({ log_type: 'dealer', ...this.params, operator_id: this.operator_id })
        .then((response) => {
          this.logList = response.data.data.list || {}
          this.total_count = response.data.data.total_count || 0
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('9d04916c.ae6e5b')
          })
        })
    },
    handleOpenOpeartion(visivle, type) {
      this.modalContent =
        type === this.$t('d41d8cd9.e7f8g9')
          ? this.$t('9d04916c.c8fbcd')
          : this.$t('9d04916c.e6d19f')
      this.visibleModal = visivle
      this.modalType = type
    },
    handleModalConfirm(type) {
      if (!type) {
        this.visibleModal = false
        this.modalType = ''
        this.modalContent = ''
      } else {
        // getPagesTemplateList().then((res) => {
        //   this.visibleModal = false
        //   this.modalType = ''
        //   this.modalContent = ''
        //   this.$message({
        //     message: '操作成功',
        //     type: 'success'
        //   })
        // })
      }
    },
    dowloadFile(url) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
      this.$message({
        type: 'success',
        message: this.$t('9d04916c.50940e')
      })
    },
    bankFilter() {
      let { bank_acct_type } = this.infoList
      let returnValue = ''
      switch (bank_acct_type) {
        case '1':
          returnValue = this.$t('9d04916c.18ba13')
          break
        case '2':
          returnValue = this.$t('9d04916c.18ba13')
          break
      }
      return returnValue
    },
    adapayFilter() {
      let { adapay_fee_mode } = this.split_ledger_info
      let returnValue = ''
      switch (adapay_fee_mode) {
        case 'I':
          returnValue = this.$t('9d04916c.75d29a')
          break
        case 'O':
          returnValue = this.$t('9d04916c.6c1506')
          break
      }
      return returnValue
    },
    headquartersFilter() {
      // 总部分账占比过滤
      let { headquarters_proportion } = this.split_ledger_info
      let value = this.split_ledger_info.headquarters_proportion
      return value ? value + '%' : '-'
    },
    dealerFilter() {
      // 经销商分账占比过滤
      let { dealer_proportion } = this.split_ledger_info
      let value = this.split_ledger_info.dealer_proportion
      return value ? value + '%' : '-'
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getLogList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.page_size = pageSize
      this.getLogList()
    },
    tabChange(e) {
      this.activeName = e.name
      if (e.name == 'second') {
        this.params.page = 1
        this.getLogList()
      }
    }
  }
}
</script>

<style lang="scss">
.cus-details {
  &-img {
    width: 90px;
    height: 90px;
  }
  &-row {
    font-size: 22px;
    font-weight: bold;
  }
  &-tags {
    margin-right: 10px;
  }
  &-pfonts {
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.6);
    :nth-child(2) {
      margin-left: 6px;
    }
    :nth-child(3) {
      color: #ccc;
      margin-left: 50px;
    }
  }
  &-flex {
    position: relative;
    display: flex;
    align-items: center;
  }
  .cus-float {
    position: absolute;
    right: 5%;
    top: 5%;
  }
  .cus-icon {
    font-size: 16px;
  }
  .cus-margin-40 {
    margin-left: 40px;
  }
  .cus-margin-50 {
    margin-left: 50px;
  }
  .cus-btn {
    justify-content: flex-start;
    .el-button--text {
      padding: 0px;
    }
  }
  &-tabs {
    padding-bottom: 20px;
  }
  &-bot {
    position: fixed;
    bottom: 0;
    padding-left: 22px;
    padding-bottom: 15px;
    margin-bottom: 0px !important;
    background: #fff;
    width: 100%;
    :nth-child(2) {
      margin-left: 20px;
    }
    :nth-child(3) {
      margin-left: 20px;
    }
    :nth-child(4) {
      margin-left: 20px;
    }
  }
  .load-btn {
    display: flex;
    align-items: baseline;
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
