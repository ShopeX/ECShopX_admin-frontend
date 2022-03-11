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
            >
            <img
              v-if="apply_type === 'distributor'"
              class="cus-approve-img"
              src="@/assets/img/adapay/store.png"
              alt=""
            >
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
          <p
            v-if="apply_type === 'distributor'"
            class="cus-approve-pfonts"
          >
            <i class="el-icon-time cus-icon" />
            <span>{{ distributor_info ? distributor_info.hour : '-' }}</span>
          </p>
          <div class="cus-approve-flex">
            <div class="cus-approve-pfonts">
              <i class="el-icon-phone cus-icon" />
              <span>{{
                (apply_type === 'distributor' ? distributor_info.mobile : dealer_info.mobile) +
                  '（企业电话）' || '-'
              }}</span>
            </div>
            <div
              v-if="apply_type === 'distributor'"
              class="cus-approve-pfonts cus-margin-50"
            >
              <i class="el-icon-message cus-icon" />
              <span>{{ entry_info.email ? `${entry_info.email}（企业邮箱）` : '-' }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row
        v-if="apply_type === 'distributor'"
        style="margin-top: 10px"
      >
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
          label="基本信息"
          name="first"
        >
          <BaseModal
            :span="20"
            :label-list="baseInfo"
            :info="distributor_info"
            title="地理位置"
          />
          <el-card v-if="infoList.is_rel_dealer">
            <div slot="header">
              其他信息
            </div>
            <div class="body">
              <el-row>
                <el-col
                  :span="4"
                  style="text-align: right; padding-right: 10px"
                >
                  关联经销商:
                </el-col>
                <el-col
                  :span="20"
                  class="cus-btn"
                >
                  <span>{{ dealer_info.username }}</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          v-if="apply_type === 'dealer'"
          label="开户信息"
          name="first"
        >
          <el-row
            style="height: 350px"
            type="flex"
            justify="center"
            align="middle"
          >
            <span style="color: #ccc">--暂无开户信息--</span>
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
    <drawer
      :visible-drawer="visibleDrawer"
      title="入户审批"
      @close="onHandleDrawer"
    >
      <div>
        <RegisterInfo
          :list="member_type === 'person' ? personInfo : enterPersonInfo"
          :info="entry_info"
          title="证件信息"
        />
        <RegisterInfo
          :list="member_type === 'person' ? accountList : enterAccountList"
          :info="entry_info"
          title="结算账户信息"
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
          title="分账信息"
        />
      </div>
    </drawer>
    <el-dialog
      title="关联店铺"
      :visible.sync="visibleModal"
      width="60%"
      :close-on-click-modal="false"
      @before-close="handleDialogOpen(false)"
    >
      <StoreModal
        :info="modalData"
        :data="storeList"
        @click="getDistributor"
      />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import district from '@/common/district.json'
import { getDistributorList } from '@/api/marketing'
import { getOpenApproveDetail } from '@/api/adapay/dealer'
import BaseModal from '@/view/mall/marketing/component/BaseModal'
import RegisterInfo from './component/RegisterInfo'
import AccountInfo from './component/AccountInfo'
import StoreModal from './component/StoreModal'
import drawer from './component/drawer.vue'

export default {
  components: { BaseModal, RegisterInfo, AccountInfo, StoreModal, drawer },
  data () {
    return {
      loading: true,
      regions: district,
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
      approveStatusList: [
        { name: '全部', value: '' },
        { name: '待审批', value: '待审批' },
        { name: '已审批', value: '已审批' },
        { name: '通过', value: '通过' },
        { name: '不通过', value: '不通过' }
      ],
      total_count: 0,
      list: [],
      baseInfo: [
        { name: '地理位置', field: 'store_address' },
        { name: '地图定位', field: 'qqmapimg', type: 'pic' },
        { name: '店铺经纬度', field: '', filter: this.addressFilter }
      ],
      enterPersonInfo: [
        // 企业证件信息
        { name: '企业名称', field: 'name' },
        { name: '企业电话', field: 'telphone' },
        { name: '营业执照号', field: 'social_credit_code' },
        { name: '商户有效日期', field: 'social_credit_code_expires' },
        { name: '法人姓名', field: 'legal_person' },
        { name: '法人手机号码', field: 'tel_no' },
        { name: '法人身份证号码', field: 'legal_cert_id' },
        { name: '法人证件有效期', field: 'legal_cert_id_expires' },
        { name: '所在省市', field: 'area' },
        { name: '企业地址', field: 'address' },
        { name: '经营范围', field: 'business_scope' },
        { name: '邮箱', field: 'email' },
        { name: '邮编', field: 'zip_code' }
      ],
      enterAccountList: [
        // 企业结算信息
        { name: '结算银行卡号', field: 'card_no' },
        { name: '结算银行卡开户姓名', field: 'card_name' },
        { name: '结算银行卡所属银行', field: 'bank_name' },
        { name: '结算银行卡账户类型', field: 'bank_acct_type', filter: this.bankFilter }
      ],
      enterSplitAccountList: [
        // 企业分账信息
        { name: '手续费扣费方式', field: 'adapay_fee_mode', filter: this.adapayFilter },
        { name: '总部分账占比', field: 'headquarters_proportion', filter: this.headquartersFilter },
        { name: '审批状态', field: 'status', filter: this.statusFilter },
        { name: '审批备注', field: 'comments' }
      ],
      splitAccountList: [
        // 企业分账信息
        { name: '手续费扣费方式', field: 'adapay_fee_mode', filter: this.adapayFilter },
        { name: '总部分账占比', field: 'headquarters_proportion', filter: this.headquartersFilter },
        { name: '经销商分账占比', field: 'dealer_proportion', filter: this.dealerFilter },
        { name: '审批状态', field: 'status', filter: this.statusFilter },
        { name: '审批备注', field: 'comments' }
      ],
      personInfo: [
        // 个人证件信息
        { name: '用户姓名', field: 'user_name' },
        { name: '用户手机号码', field: 'tel_no' },
        { name: '用户身份证号码', field: 'cert_id' }
      ],
      accountList: [
        // 个人结算信息
        { name: '开户人姓名', field: 'bank_card_name' },
        { name: '银行预留手机号', field: 'bank_tel_no' },
        { name: '结算银行卡号', field: 'bank_card_id' },
        { name: '开户人证件号码', field: 'bank_cert_id' }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    if (this.$route.query.id) {
      const { id } = this.$route.query || {}
      this.id = id
      this.getDetail(id)
      let params = { page: 1, pageSize: 10, is_valid: 'true' }
      this.getDistributor(params)
    }
  },
  methods: {
    getDetail (id) {
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
          this.subTitle = isBool
            ? `分账金额计算公式内扣：
            总部：（交易金额-手续费）*总部分账占比；
            店铺：订单金额-手续费-总部分账金额。
            外扣：
            总部：交易金额*总部分账占比；
            店铺：订单金额-总部分账金额。`
            : ` 分账金额计算公式：
            内扣：
            总部：（交易金额-手续费）*总部分账占比；
            经销商:（交易金额-手续费）*经销商分账占比；
            店铺：订单金额-手续费-总部分账金额-经销商分账金额。
            外扣：
            总部：交易金额*总部分账占比；
            经销商:交易金额*经销商分账占比；
            店铺：订单金额-总部分账金额-经销商分账金额。`
          this.isBool = isBool
          const { auto_sync_goods, is_ziti, is_delivery, company_dada_open } =
            distributor_info || {}
          if (auto_sync_goods) {
            this.tagsList.push({ name: '自动上架商品', type: 'danger' })
          }
          if (is_ziti) {
            this.tagsList.push({ name: '支持自提', type: '' })
          }
          if (is_delivery) {
            this.tagsList.push({ name: '支持快递', type: 'success' })
          }
          if (company_dada_open) {
            this.tagsList.push({ name: '同城配', type: 'warning' })
          }
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取门店详情出错'
          })
        })
    },
    onChange (type) {
      if (type === 'update') {
        this.getDetail(this.id)
      }
      this.onHandleDrawer(true)
    },
    onHandleDrawer (visible) {
      this.visibleDrawer = visible
      // this.visibleModal = false
    },
    statusFilter () {
      let returnValue = ''
      switch (this.entry_apply_info.status) {
        case 'WAIT_APPROVE':
          returnValue = '待审批'
          break
        case 'APPROVED':
          returnValue = '审核通过'
          break
        case 'REJECT':
          returnValue = '审核失败'
          break
        default:
          returnValue = '-'
          break
      }
      return returnValue
    },
    addressFilter () {
      const { lat, lng } = this.distributor_info || {}
      if (lat && lng) {
        return lng + ' - ' + lat
      } else {
        return '-'
      }
    },
    headquartersFilter () {
      // 总部分账占比过滤
      let { headquarters_proportion } = this.split_ledger_info
      let value = this.split_ledger_info.headquarters_proportion
      return value ? value + '%' : '-'
    },
    dealerFilter () {
      // 经销商分账占比过滤
      let { dealer_proportion } = this.split_ledger_info
      let value = this.split_ledger_info.dealer_proportion
      return value ? value + '%' : '-'
    },
    adapayFilter () {
      let { adapay_fee_mode } = this.split_ledger_info
      let returnValue = ''
      switch (adapay_fee_mode) {
        case 'I':
          returnValue = '内扣'
          break
        case 'O':
          returnValue = '外扣'
          break
      }
      return returnValue
    },
    bankFilter () {
      let { bank_acct_type } = this.entry_info
      let returnValue = ''
      switch (bank_acct_type) {
        case '1':
          returnValue = '对公'
          break
        case '2':
          returnValue = '对公'
          break
      }
      return returnValue
    },
    handleDialogOpen (visible) {
      // 查看店铺弹框
      this.visibleModal = visible
    },
    getDistributor (parmas) {
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
