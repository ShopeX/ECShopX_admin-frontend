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
              v-if="apply_type === 'dealer'"
              class="cus-approve-img"
              src="@/assets/img/adapay/dealer.png"
              alt=""
            />
            <img
              v-if="apply_type === 'distributor'"
              class="cus-approve-img"
              src="@/assets/img/adapay/store.png"
              alt=""
            />
          </el-col>
        </el-col>
        <el-col :span="20">
          <div class="cus-approve-flex">
            <p class="cus-approve-row">
              {{ apply_type === 'distributor' ? distributor_info.name : dealer_info.username }}
            </p>
            <div class="cus-approve-pfonts cus-margin-40">
              <i class="el-icon-location-outline cus-icon" />
              <span>{{
                apply_type === 'distributor'
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
          <p v-if="apply_type === 'distributor'" class="cus-approve-pfonts">
            <i class="el-icon-time cus-icon" />
            <span>{{ distributor_info ? distributor_info.hour : '-' }}</span>
          </p>
          <div class="cus-approve-flex">
            <div class="cus-approve-pfonts">
              <i class="el-icon-phone cus-icon" />
              <span>{{
                (apply_type === 'distributor' ? distributor_info.mobile : dealer_info.mobile) +
                  $t('87c5d823.88ab08') || '-'
              }}</span>
            </div>
            <div v-if="apply_type === 'distributor'" class="cus-approve-pfonts cus-margin-50">
              <i class="el-icon-message cus-icon" />
              <span>{{ entry_info.email ? entry_info.email + $t('87c5d823.c15332') : '-' }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="apply_type === 'distributor'" style="margin-top: 10px">
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
          v-if="apply_type === 'distributor'"
          :label="$t('87c5d823.9e5ffa')"
          name="first"
        >
          <BaseModal
            :span="20"
            :label-list="baseInfo"
            :info="distributor_info"
            :title="$t('87c5d823.fc82aa')"
          />
          <el-card v-if="infoList.is_rel_dealer">
            <div slot="header">{{ $t('87c5d823.febe40') }}</div>
            <div class="body">
              <el-row>
                <el-col :span="4" style="text-align: right; padding-right: 10px">
                  {{ $t('87c5d823.89f335') }}
                </el-col>
                <el-col :span="20" class="cus-btn">
                  <span>{{ dealer_info.username }}</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane v-if="apply_type === 'dealer'" :label="$t('87c5d823.ac7b4c')" name="first">
          <el-row style="height: 350px" type="flex" justify="center" align="middle">
            <span style="color: #ccc">{{ $t('87c5d823.192fdd') }}</span>
            <!-- <el-col :span='4' style="text-align:right;padding-right:10px">关联店铺：</el-col>
            <el-col :span='20' style="color: #1480e3" class="cus-btn">
              <el-button type='text' @click="handleDialogopen(true)">查看详情</el-button>
            </el-col> -->
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- <el-drawer
      :visible.sync="visibleDrawer"
      @close='onHandleDrawer(false)'
      :wrapperClosable='false'
      width='70%'
    >
     <p class="">入户审批</p> -->
    <!-- <RegisterInfo :list="member_type === 'person' ? personInfo : enterPersonInfo" :info='entry_info' title="证件信息" />
      <RegisterInfo :list="member_type === 'person' ? accountList : enterAccountList" :info='entry_info' title="结算账户信息" />
      <AccountInfo v-if="status === 'WAIT_APPROVE'" :subTitle='subTitle' :info='infoList' @handleClose='onChange' />
      <RegisterInfo v-if="status !== 'WAIT_APPROVE'" :list='isBool ? enterSplitAccountList : splitAccountList' :info='split_ledger_info' :subTitle='subTitle' title="分账信息" />
    </el-drawer>  -->
    <drawer :visible-drawer="visibleDrawer" :title="$t('87c5d823.227727')" @close="onHandleDrawer">
      <div>
        <RegisterInfo
          :list="member_type === 'person' ? personInfo : enterPersonInfo"
          :info="entry_info"
          :title="$t('87c5d823.ae5576')"
        />
        <RegisterInfo
          :list="member_type === 'person' ? accountList : enterAccountList"
          :info="entry_info"
          :title="$t('87c5d823.99f89b')"
        />
        <AccountInfo
          v-if="status === 'WAIT_APPROVE'"
          :sub-title="subTitle"
          :info="infoList"
          @handleClose="onChange"
        />
        <RegisterInfo
          v-if="status !== 'WAIT_APPROVE'"
          :list="isBool ? enterSplitAccountList : splitAccountList"
          :info="split_ledger_info"
          :sub-title="subTitle"
          :title="$t('87c5d823.adb36c')"
        />
      </div>
    </drawer>
    <el-dialog
      :title="$t('87c5d823.5c16c5')"
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
import districtOptions from '@/mixins/districtOptions'
import { mapGetters } from 'vuex'
import { getDistributorList } from '@/api/marketing'
import { getOpenApproveDetail } from '@/api/adapay/dealer'
import BaseModal from '@/view/mall/marketing/component/BaseModal'
import RegisterInfo from './component/RegisterInfo'
import AccountInfo from './component/AccountInfo'
import StoreModal from './component/StoreModal'
import drawer from './component/drawer.vue'

export default {
  mixins: [districtOptions],
  components: { BaseModal, RegisterInfo, AccountInfo, StoreModal, drawer },
  data() {
    return {
      loading: true,
      regions: [],
      activeName: 'first',
      subTitle: '',
      isBool: false,
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
      apply_type: '',
      member_type: '',
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
      total_count: 0,
      list: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    approveStatusList() {
      return [
        { name: this.$t('87c5d823.a8b0c2'), value: '' },
        { name: this.$t('87c5d823.b0bf01'), value: this.$t('87c5d823.b0bf01') },
        { name: this.$t('87c5d823.618acb'), value: this.$t('87c5d823.618acb') },
        { name: this.$t('87c5d823.23c1f3'), value: this.$t('87c5d823.23c1f3') },
        { name: this.$t('87c5d823.dec062'), value: this.$t('87c5d823.dec062') }
      ]
    },
    baseInfo() {
      return [
        { name: this.$t('87c5d823.fc82aa'), field: 'store_address' },
        { name: this.$t('87c5d823.86188c'), field: 'qqmapimg', type: 'pic' },
        { name: this.$t('87c5d823.db4b0d'), field: '', filter: this.addressFilter }
      ]
    },
    enterPersonInfo() {
      return [
        { name: this.$t('87c5d823.f47e27'), field: 'name' },
        { name: this.$t('87c5d823.3d9d21'), field: 'telphone' },
        { name: this.$t('87c5d823.b9bf38'), field: 'social_credit_code' },
        { name: this.$t('87c5d823.1fcd91'), field: 'social_credit_code_expires' },
        { name: this.$t('87c5d823.2fe17a'), field: 'legal_person' },
        { name: this.$t('87c5d823.187a35'), field: 'tel_no' },
        { name: this.$t('87c5d823.1415b3'), field: 'legal_cert_id' },
        { name: this.$t('87c5d823.a79a87'), field: 'legal_cert_id_expires' },
        { name: this.$t('87c5d823.c63fa8'), field: 'area' },
        { name: this.$t('87c5d823.400147'), field: 'address' },
        { name: this.$t('87c5d823.04228b'), field: 'business_scope' },
        { name: this.$t('87c5d823.3bc5e6'), field: 'email' },
        { name: this.$t('87c5d823.4d8e09'), field: 'zip_code' }
      ]
    },
    enterAccountList() {
      return [
        { name: this.$t('87c5d823.88174a'), field: 'card_no' },
        { name: this.$t('87c5d823.2f4116'), field: 'card_name' },
        { name: this.$t('87c5d823.0a3e82'), field: 'bank_name' },
        { name: this.$t('87c5d823.2c76c9'), field: 'bank_acct_type', filter: this.bankFilter }
      ]
    },
    enterSplitAccountList() {
      return [
        { name: this.$t('87c5d823.6e640f'), field: 'adapay_fee_mode', filter: this.adapayFilter },
        {
          name: this.$t('87c5d823.08605d'),
          field: 'headquarters_proportion',
          filter: this.headquartersFilter
        },
        { name: this.$t('87c5d823.d352ae'), field: 'status', filter: this.statusFilter },
        { name: this.$t('87c5d823.4985b0'), field: 'comments' }
      ]
    },
    splitAccountList() {
      return [
        { name: this.$t('87c5d823.6e640f'), field: 'adapay_fee_mode', filter: this.adapayFilter },
        {
          name: this.$t('87c5d823.08605d'),
          field: 'headquarters_proportion',
          filter: this.headquartersFilter
        },
        { name: this.$t('87c5d823.b61188'), field: 'dealer_proportion', filter: this.dealerFilter },
        { name: this.$t('87c5d823.d352ae'), field: 'status', filter: this.statusFilter },
        { name: this.$t('87c5d823.4985b0'), field: 'comments' }
      ]
    },
    personInfo() {
      return [
        { name: this.$t('87c5d823.d5b5b5'), field: 'user_name' },
        { name: this.$t('87c5d823.dde968'), field: 'tel_no' },
        { name: this.$t('87c5d823.a692a6'), field: 'cert_id' }
      ]
    },
    accountList() {
      return [
        { name: this.$t('87c5d823.e3f6a6'), field: 'bank_card_name' },
        { name: this.$t('87c5d823.a0b7da'), field: 'bank_tel_no' },
        { name: this.$t('87c5d823.88174a'), field: 'bank_card_id' },
        { name: this.$t('87c5d823.c503f0'), field: 'bank_cert_id' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.id) {
      const { id } = this.$route.query || {}
      this.id = id
      this.getDetail(id)
      let params = { page: 1, pageSize: 10, is_valid: 'true' }
      this.getDistributor(params)
    }
  },
  methods: {
    getDetail(id) {
      getOpenApproveDetail(id)
        .then((response) => {
          const { is_rel_dealer, distributor_info, entry_apply_info, entry_info, dealer_info } =
            response.data.data || {}
          this.infoList = response.data.data
          this.status = entry_apply_info.status
          this.apply_type = entry_apply_info.apply_type
          this.member_type = entry_info.member_type || {}
          this.distributor_info = distributor_info || {}
          this.entry_apply_info = entry_apply_info || {}
          this.entry_info = entry_info || {}
          this.dealer_info = dealer_info || {}
          if (entry_apply_info.apply_type === 'distributor') {
            this.split_ledger_info = {
              status: entry_apply_info.status,
              comments: entry_apply_info.comments,
              ...JSON.parse(distributor_info.split_ledger_info)
            }
          } else {
            this.split_ledger_info = {
              status: entry_apply_info.status,
              comments: entry_apply_info.comments,
              ...JSON.parse(dealer_info.split_ledger_info)
            }
          }
          let isBool = entry_apply_info.apply_type === 'distributor' && !is_rel_dealer
          this.subTitle = isBool ? this.$t('87c5d823.a8662c') : this.$t('87c5d823.287081')
          this.isBool = isBool
          const { auto_sync_goods, is_ziti, is_delivery, is_local_delivery } =
            distributor_info || {}
          if (auto_sync_goods) {
            this.tagsList.push({ name: this.$t('87c5d823.d35f24'), type: 'danger' })
          }
          if (is_ziti) {
            this.tagsList.push({ name: this.$t('87c5d823.49a523'), type: '' })
          }
          if (is_delivery) {
            this.tagsList.push({ name: this.$t('87c5d823.0051b8'), type: 'success' })
          }
          if (is_local_delivery) {
            this.tagsList.push({ name: this.$t('87c5d823.583dcd'), type: 'warning' })
          }
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('87c5d823.816eba')
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
          returnValue = this.$t('87c5d823.b0bf01')
          break
        case 'APPROVED':
          returnValue = this.$t('87c5d823.871a30')
          break
        case 'REJECT':
          returnValue = this.$t('87c5d823.fe3661')
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
    adapayFilter() {
      let { adapay_fee_mode } = this.split_ledger_info
      let returnValue = ''
      switch (adapay_fee_mode) {
        case 'I':
          returnValue = this.$t('87c5d823.75d29a')
          break
        case 'O':
          returnValue = this.$t('87c5d823.6c1506')
          break
      }
      return returnValue
    },
    bankFilter() {
      let { bank_acct_type } = this.entry_info
      let returnValue = ''
      switch (bank_acct_type) {
        case '1':
          returnValue = this.$t('87c5d823.18ba13')
          break
        case '2':
          returnValue = this.$t('87c5d823.f0bf8a')
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
