<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="cus-approve">
    <el-card>
      <el-row>
        <el-col :span="3">
          <el-col :span="3">
            <img
              v-if="operator_type === 'dealer'"
              class="cus-approve-img"
              src="@/assets/img/adapay/dealer.png"
              alt=""
            >
            <img
              v-if="operator_type === 'distributor'"
              class="cus-approve-img"
              src="@/assets/img/adapay/store.png"
              alt=""
            >
          </el-col>
        </el-col>
        <el-col :span="20">
          <div class="cus-approve-flex">
            <p class="cus-approve-row">
              {{ operator_type === 'distributor' ? distributor_info.name : dealer_info.username }}
            </p>
            <div class="cus-approve-pfonts cus-margin-40">
              <i class="el-icon-location-outline cus-icon" />
              <span>{{
                operator_type === 'distributor'
                  ? distributor_info.province + distributor_info.city
                  : entry_apply_info.adress || '-'
              }}</span>
            </div>
            <div class="cus-float">
              <!-- <el-button @click="onHandleDrawer(true)" type="text">入户审批</el-button> -->
            </div>
          </div>
          <p class="cus-approve-pfonts">
            <i class="el-icon-s-custom cus-icon" />
            <span>{{ entry_apply_info ? entry_apply_info.user_name : '-' }}</span>
          </p>
          <p v-if="operator_type === 'distributor'" class="cus-approve-pfonts">
            <i class="el-icon-time cus-icon" />
            <span>{{ distributor_info ? distributor_info.hour : '-' }}</span>
          </p>
          <div class="cus-approve-flex">
            <div class="cus-approve-pfonts">
              <i class="el-icon-phone cus-icon" />
              <span>{{
                (operator_type === 'distributor' ? distributor_info.mobile : dealer_info.mobile) +
                  $t('d41d8cd9.z0a1b2') || '-'
              }}</span>
            </div>
            <div v-if="operator_type === 'distributor'" class="cus-approve-pfonts cus-margin-50">
              <i class="el-icon-message cus-icon" />
              <span>{{
                entry_info.email ? `${entry_info.email}${$t('d41d8cd9.c3d4e5')}` : '-'
              }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="operator_type === 'distributor'" style="margin-top: 10px">
        <el-tag
          v-for="item in tagsList"
          :key="item.name"
          :type="item.type"
          size="small"
          class="cus-approve-tags"
        >
          {{ item.name }}
        </el-tag>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-if="operator_type === 'distributor'"
          :label="$t('f3a67ede.9e5ffa')"
          name="first"
        >
          <BaseModal
            :span="20"
            :label-list="baseInfo"
            :info="distributor_info"
            :title="$t('f3a67ede.fc82aa')"
          />
          <el-card v-if="infoList.is_rel_dealer">
            <div slot="header">{{ $t('f3a67ede.febe40') }}</div>
            <div class="body">
              <el-row>
                <el-col :span="4" style="text-align: right; padding-right: 10px">
                  {{ $t('f3a67ede.6d1c63') }}:
                </el-col>
                <el-col :span="20" class="cus-btn">
                  <span>{{ dealer_info.username }}</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane v-if="operator_type === 'dealer'" :label="$t('f3a67ede.ac7b4c')" name="first">
          <el-row style="height: 350px" type="flex" justify="center" align="middle">
            <span style="color: #ccc">--{{ $t('f3a67ede.8f8983') }}--</span>
            <!-- <el-col :span='4' style="text-align:right;padding-right:10px">关联店铺：</el-col>
            <el-col :span='20' style="color: #1480e3" class="cus-btn">
              <el-button type='text' @click="handleDialogopen(true)">查看详情</el-button>
            </el-col> -->
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <drawer :visible-drawer="visibleDrawer" :title="$t('f3a67ede.227727')" @close="onHandleDrawer">
      <div>
        <RegisterInfo
          :list="user_type === 'indv' ? personInfo : enterPersonInfo"
          :info="entry_info"
          :title="$t('f3a67ede.ae5576')"
        />
        <RegisterInfo
          v-if="user_type === 'indv'"
          :list="accountList"
          :info="entry_info"
          :title="$t('f3a67ede.99f89b')"
        />
        <RegisterInfo
          v-if="user_type === 'ent'"
          :list="card_type == '1' ? enterPrivateAccountList : enterAccountList"
          :info="entry_info"
          :title="$t('f3a67ede.99f89b')"
        />
        <AccountInfo
          v-if="status === 'WAIT_APPROVE'"
          :sub-title="subTitle"
          :info="infoList"
          @handleClose="onChange"
        />
        <RegisterInfo
          v-if="status !== 'WAIT_APPROVE' && upDistributorFlag == 'dealer'"
          :list="splitAccountList"
          :info="split_ledger_info"
          :sub-title="subTitle"
          :title="$t('3083129c.adb36c')"
        />
        <RegisterInfo
          v-if="status !== 'WAIT_APPROVE' && upDistributorFlag == 'merchant'"
          :list="merchantSplitAccountList"
          :info="split_ledger_info"
          :sub-title="subTitle"
          :title="$t('3083129c.adb36c')"
        />
        <RegisterInfo
          v-if="status !== 'WAIT_APPROVE' && upDistributorFlag == 'distributor' && isBool"
          :list="enterSplitAccountList"
          :info="split_ledger_info"
          :sub-title="subTitle"
          :title="$t('3083129c.adb36c')"
        />
      </div>
    </drawer>
    <el-dialog
      :title="$t('f3a67ede.5c16c5')"
      :visible.sync="visibleModal"
      width="60%"
      :close-on-click-modal="false"
      @before-close="handleDialogOpen(false)"
    >
      <StoreModal :info="modalData" :data="storeList" @click="getDistributor" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import district from '@/common/district.json'
import { getDistributorList } from '@/api/marketing'
// import { getOpenApproveDetail } from '@/api/adapay/dealer'
import BaseModal from '@/view/mall/marketing/component/BaseModal'
import RegisterInfo from './component/RegisterInfo'
import AccountInfo from './component/AccountInfo'
import StoreModal from './component/StoreModal'
import drawer from './component/drawer.vue'

export default {
  components: { BaseModal, RegisterInfo, AccountInfo, StoreModal, drawer },
  data() {
    return {
      loading: true,
      regions: district,
      activeName: 'first',
      subTitle: '',
      isBool: false,
      upDistributorFlag: 'distributor',
      params: {
        page: 1,
        pageSize: 20,
        name: '',
        status: '',
        date: '',
        province: '',
        city: '',
        area: ''
      },
      modalData: {
        total_count: '',
        loading: true
      },
      id: '',
      operator_type: '',
      user_type: '',
      card_type: '',
      status: '',
      infoList: {},
      visibleDrawer: true,
      visibleModal: false,
      storeList: [],
      distributor_info: {},
      entry_apply_info: {},
      entry_info: {},
      dealer_info: {},
      tagsList: [],
      regions_value: [],
      split_ledger_info: {},
      approveStatusList: [],
      total_count: 0,
      list: [],
      baseInfo: [],
      enterPersonInfo: [],
      enterAccountList: [],
      enterPrivateAccountList: [],
      enterSplitAccountList: [],
      splitAccountList: [],
      merchantSplitAccountList: [],
      adminSplitAccountList: [],
      personInfo: [],
      accountList: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    approveStatusList() {
      return [
        { name: this.$t('f3a67ede.a8b0c2'), value: '' },
        { name: this.$t('f3a67ede.b0bf01'), value: this.$t('f3a67ede.b0bf01') },
        { name: this.$t('3083129c.618acb'), value: this.$t('3083129c.618acb') },
        { name: this.$t('f3a67ede.23c1f3'), value: this.$t('f3a67ede.23c1f3') },
        { name: this.$t('f3a67ede.dec062'), value: this.$t('f3a67ede.dec062') }
      ]
    }
  },
  mounted() {
    this.initInfoLists()
    if (this.$route.query.id) {
      const { id } = this.$route.query || {}
      this.id = id
      this.getDetail(id)
      let params = { page: 1, pageSize: 10, is_valid: 'true' }
      this.getDistributor(params)
    }
  },
  methods: {
    initInfoLists() {
      this.baseInfo = [
        { name: this.$t('f3a67ede.fc82aa'), field: 'store_address' },
        { name: this.$t('f3a67ede.86188c'), field: 'qqmapimg', type: 'pic' },
        { name: this.$t('f3a67ede.db4b0d'), field: '', filter: this.addressFilter }
      ]
      this.enterPersonInfo = [
        { name: this.$t('f3a67ede.f47e27'), field: 'reg_name' },
        { name: this.$t('f3a67ede.25c0bd'), field: 'license_code' },
        { name: this.$t('f3a67ede.590847'), field: 'license_begin_date' },
        {
          name: this.$t('f3a67ede.0202dc'),
          field: 'license_validity_type',
          filter: this.legalCertTypeFilter
        },
        { name: this.$t('f3a67ede.c857f2'), field: 'license_end_date' },
        { name: this.$t('f3a67ede.e069d9'), field: 'reg_area' },
        { name: this.$t('f3a67ede.a80b29'), field: 'reg_detail' },
        { name: this.$t('f3a67ede.2fe17a'), field: 'legal_name' },
        { name: this.$t('f3a67ede.1415b3'), field: 'legal_cert_no' },
        { name: this.$t('f3a67ede.f2501c'), field: 'legal_cert_begin_date' },
        {
          name: this.$t('f3a67ede.15ed38'),
          field: 'legal_cert_validity_type',
          filter: this.legalCertTypeFilter
        },
        { name: this.$t('f3a67ede.4301ec'), field: 'legal_cert_end_date' },
        { name: this.$t('f3a67ede.187a35'), field: 'contact_mobile' },
        { name: this.$t('f3a67ede.b5a728'), field: 'ent_type_value' }
      ]
      this.enterAccountList = [
        { name: this.$t('f3a67ede.d98e9d'), field: 'card_no' },
        { name: this.$t('f3a67ede.3d9865'), field: 'card_area' },
        { name: this.$t('f3a67ede.fb4d4e'), field: 'bank_code' },
        { name: this.$t('f3a67ede.80c6d8'), field: 'branch_name' },
        { name: this.$t('f3a67ede.534a1d'), field: 'mp' }
      ]
      this.enterPrivateAccountList = [
        { name: this.$t('f3a67ede.d98e9d'), field: 'card_no' },
        { name: this.$t('f3a67ede.3d9865'), field: 'card_area' },
        { name: this.$t('f3a67ede.534a1d'), field: 'mp' }
      ]
      this.enterSplitAccountList = [
        {
          name: this.$t('f3a67ede.08605d'),
          field: 'headquarters_proportion',
          filter: this.headquartersFilter
        },
        { name: this.$t('f3a67ede.d352ae'), field: 'status', filter: this.statusFilter },
        { name: this.$t('f3a67ede.4985b0'), field: 'comments' }
      ]
      this.splitAccountList = [
        {
          name: this.$t('f3a67ede.08605d'),
          field: 'headquarters_proportion',
          filter: this.headquartersFilter
        },
        { name: this.$t('f3a67ede.b61188'), field: 'dealer_proportion', filter: this.dealerFilter },
        { name: this.$t('f3a67ede.d352ae'), field: 'status', filter: this.statusFilter },
        { name: this.$t('f3a67ede.4985b0'), field: 'comments' }
      ]
      this.merchantSplitAccountList = [
        {
          name: this.$t('f3a67ede.08605d'),
          field: 'headquarters_proportion',
          filter: this.headquartersFilter
        },
        {
          name: this.$t('f3a67ede.03698c'),
          field: 'merchant_proportion',
          filter: this.merchartFilter
        },
        { name: this.$t('f3a67ede.d352ae'), field: 'status', filter: this.statusFilter },
        { name: this.$t('f3a67ede.4985b0'), field: 'comments' }
      ]
      this.adminSplitAccountList = [
        { name: this.$t('f3a67ede.d352ae'), field: 'status', filter: this.statusFilter },
        { name: this.$t('f3a67ede.4985b0'), field: 'comments' }
      ]
      this.personInfo = [
        { name: this.$t('f3a67ede.d5b5b5'), field: 'name' },
        { name: this.$t('f3a67ede.dde968'), field: 'mobile_no' },
        { name: this.$t('f3a67ede.a692a6'), field: 'cert_no' },
        { name: this.$t('f3a67ede.a71128'), field: 'cert_begin_date' },
        {
          name: this.$t('f3a67ede.15ed38'),
          field: 'cert_validity_type',
          filter: this.certTypeFilter
        },
        { name: this.$t('f3a67ede.4301ec'), field: 'cert_end_date' }
      ]
      this.accountList = [
        { name: this.$t('f3a67ede.e3f6a6'), field: 'card_name' },
        { name: this.$t('f3a67ede.a0b7da'), field: 'mp' },
        { name: this.$t('f3a67ede.88174a'), field: 'card_no' },
        { name: this.$t('f3a67ede.c503f0'), field: 'cert_no' },
        { name: this.$t('f3a67ede.3d9865'), field: 'card_area' }
      ]
    },
    getDetail(id) {
      this.$api.bspay
        .getSubApproveDetail(id)
        .then((response) => {
          console.log(1, response)
          const {
            is_rel_dealer,
            is_rel_merchant,
            distributor_info,
            entry_apply_info,
            entry_info,
            dealer_info
          } = response || {}
          this.infoList = response
          this.status = entry_apply_info.status
          this.operator_type = entry_apply_info.operator_type
          this.user_type = entry_info.user_type || {}
          this.card_type = entry_info.card_type || {}
          console.log('11111', this.user_type, this.card_type)
          this.distributor_info = distributor_info || {}
          this.entry_apply_info = entry_apply_info || {}
          this.entry_info = entry_info || {}
          this.dealer_info = dealer_info || {}
          let upDistributorFlag = 'distributor'
          if (is_rel_dealer) {
            upDistributorFlag = 'dealer'
          } else if (is_rel_merchant) {
            upDistributorFlag = 'merchant'
          }
          this.upDistributorFlag = upDistributorFlag
          if (entry_apply_info.operator_type === 'distributor') {
            this.split_ledger_info = {
              status: entry_apply_info.status,
              comments: entry_apply_info.comments,
              ...JSON.parse(distributor_info.bspay_split_ledger_info)
            }
          }
          console.log('2222', this.split_ledger_info)
          //  else {
          //   this.split_ledger_info = {
          //     status: entry_apply_info.status,
          //     comments: entry_apply_info.comments,
          //     ...JSON.parse(dealer_info.split_ledger_info)
          //   }
          // }
          let isBool =
            entry_apply_info.operator_type === 'distributor' && !is_rel_dealer && !is_rel_merchant
          this.subTitle = isBool ? this.$t('d41d8cd9.f6g7h8') : this.$t('d41d8cd9.i9j0k1')
          this.isBool = isBool
          const { auto_sync_goods, is_ziti, is_delivery, company_dada_open } =
            distributor_info || {}
          if (auto_sync_goods) {
            this.tagsList.push({ name: this.$t('f3a67ede.d35f24'), type: 'danger' })
          }
          if (is_ziti) {
            this.tagsList.push({ name: this.$t('f3a67ede.49a523'), type: '' })
          }
          if (is_delivery) {
            this.tagsList.push({ name: this.$t('f3a67ede.0051b8'), type: 'success' })
          }
          if (company_dada_open) {
            this.tagsList.push({ name: this.$t('f3a67ede.583dcd'), type: 'warning' })
          }
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('f3a67ede.816eba')
          })
        })
    },
    onChange(type) {
      if (type === 'update') {
        this.getDetail(this.id)
      }
      this.onHandleDrawer(true)
    },
    onHandleDrawer(visible) {
      this.visibleDrawer = visible
      // this.visibleModal = false
    },
    statusFilter() {
      let returnValue = ''
      switch (this.entry_apply_info.status) {
        case 'WAIT_APPROVE':
          returnValue = this.$t('f3a67ede.b0bf01')
          break
        case 'APPROVED':
          returnValue = this.$t('f3a67ede.871a30')
          break
        case 'REJECT':
          returnValue = this.$t('f3a67ede.fe3661')
          break
        default:
          returnValue = '-'
          break
      }
      return returnValue
    },
    addressFilter() {
      const { lat, lng } = this.distributor_info || {}
      if (lat && lng) {
        return lng + ' - ' + lat
      } else {
        return '-'
      }
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
    merchartFilter() {
      // 商户分账占比过滤
      let { merchant_proportion } = this.split_ledger_info
      let value = this.split_ledger_info.merchant_proportion
      return value ? value + '%' : '-'
    },
    // adapayFilter() {
    //   let { adapay_fee_mode } = this.split_ledger_info
    //   let returnValue = ''
    //   switch (adapay_fee_mode) {
    //     case 'I':
    //       returnValue = '内扣'
    //       break
    //     case 'O':
    //       returnValue = '外扣'
    //       break
    //   }
    //   return returnValue
    // },
    bankFilter() {
      let { card_type } = this.entry_info
      let returnValue = ''
      switch (card_type) {
        case '0':
          returnValue = this.$t('f3a67ede.18ba13')
          break
        case '1':
          returnValue = this.$t('f3a67ede.7aa562')
          break
      }
      return returnValue
    },

    certTypeFilter() {
      let { cert_validity_type } = this.entry_info
      let returnValue = ''
      switch (cert_validity_type) {
        case 0:
          returnValue = this.$t('f3a67ede.4949ff')
          break
        case 1:
          returnValue = this.$t('f3a67ede.06c398')
          break
      }
      return returnValue
    },
    legalCertTypeFilter() {
      let { legal_cert_validity_type } = this.entry_info
      let returnValue = ''
      switch (legal_cert_validity_type) {
        case 0:
          returnValue = this.$t('f3a67ede.4949ff')
          break
        case 1:
          returnValue = this.$t('f3a67ede.06c398')
          break
      }
      return returnValue
    },
    handleDialogOpen(visible) {
      // 查看店铺弹框
      this.visibleModal = visible
    },
    getDistributor(parmas) {
      getDistributorList(parmas).then((response) => {
        this.storeList = response.data.data.list
        this.modalData.total_count = parseInt(response.data.data.total_count)
        this.modalData.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.cus-approve {
  &-img {
    width: 120px;
    height: 120px;
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
  .el-drawer__body {
    overflow: auto;
  }
  .el-drawer__header {
    position: absolute;
    right: 0;
    margin-bottom: 10px;
  }
  .cus-btn {
    .el-button--text {
      padding: 0px;
    }
  }
}
</style>
