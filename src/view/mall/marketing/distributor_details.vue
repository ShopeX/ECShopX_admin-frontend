<template>
  <div class="cus-details">
    <template v-if="isEdit == false">
      <el-card>
        <el-row>
          <el-col :span="3">
            <img class="cus-details-img" src="@/assets/img/adapay/store.png" alt="">
          </el-col>
          <el-col :span="20">
            <div class="cus-details-flex">
              <p class="cus-details-row">{{ infoList.name }}</p>
              <div class="cus-details-pfonts cus-margin-40">
                <i class="el-icon-location-outline cus-icon" />
                <span>{{ infoList.province + infoList.city || '-' }}</span>
              </div>
            </div>
            <p class="cus-details-pfonts">
              <i class="el-icon-s-custom cus-icon" />
              <span>{{ infoList.contact || '-' }}</span>
            </p>
            <p class="cus-details-pfonts">
              <i class="el-icon-time cus-icon" />
              <span>{{ infoList.hour || '-' }}</span>
            </p>
            <div class="cus-details-flex">
              <div class="cus-details-pfonts">
                <i class="el-icon-phone cus-icon" />
                <span>{{ infoList.mobile || '-' }}</span>
                （企业电话）
              </div>
              <div class="cus-details-pfonts cus-margin-50">
                <i class="el-icon-message cus-icon" />
                <span>{{ infoList.email }}</span>
                （企业邮箱）
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-tag
            v-for="item in tagsList"
            :key="item.name"
            :type="item.type"
            size="small"
            class="cus-details-tags"
          >
            {{ item.name }}
          </el-tag>
        </el-row>
      </el-card>
      <el-card>
        <el-tabs v-model="activeName" class="cus-details-tabs" @tab-click="tabChange">
          <el-tab-pane v-if="loginType === 'admin'" label="基本信息" name="first">
            <BaseModal :span="20" :label-list="baseInfo" :info="infoList" title="地理位置" />
            <BaseModal
              v-if="is_rel_dealer"
              :span="20"
              :label-list="otherInfo"
              :info="dealerList"
              title="其他信息"
            />
          </el-tab-pane>
          <el-tab-pane v-if="is_openAccount" label="开户信息" name="second">
            <BaseModal
              :span="7"
              :label-list="member_type === 'corp' ? enterPriseList : personInfo"
              :info="accountInfo"
              :title="
                member_type === 'corp'
                  ? `企业信息 ${accountInfo.audit_desc_1 || ''}`
                  : '个人信息 ' + `${accountInfo.audit_desc_1 || ''}`
              "
            />
            <BaseModal
              :span="7"
              :label-list="member_type === 'corp' ? enterAccountInfo : accountList"
              :info="accountInfo"
              :title="'结算账户信息' + `${accountInfo.audit_desc_2 || ''}`"
            />
            <BaseModal
              v-if="loginType === 'admin'"
              :span="7"
              :label-list="
                is_rel_dealer && is_openAccount && member_type === 'corp'
                  ? enterSplitAccountList
                  : splitAccountList
              "
              :info="split_ledger_info"
              title="分账信息"
            />
            <el-card v-if="member_type === 'corp'">
              <div slot="header">其他信息</div>
              <div class="body">
                <el-row class="load-btn">
                  <el-col :span="4" style="text-align: right; padding-right: 10px"
                    >
附件信息：
</el-col
                  >
                  <el-col v-if="member_type === 'corp'" :span="20" class="cus-btn">
                    <el-button type="text" @click="dowloadFile(infoList.attach_file)"
                      >
附件
</el-button
                    >
                  </el-col>
                  <span v-else>-</span>
                </el-row>
              </div>
            </el-card>
            <div v-if="datapass_block != 1 && loginType != 'admin'" class="btn">
              <el-button v-if="accountInfo.audit_state != 'A'" type="primary" @click="editHandle"
                >
编辑
</el-button
              >
              <el-button v-if="accountInfo.audit_state == 'A'">审核中</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-if="!is_openAccount && loginType === 'distributor'"
            label="开户信息"
            name="second"
          >
            <el-row style="height: 350px" type="flex" justify="center" align="middle">
              <span style="color: #ccc">--暂无开户信息--</span>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="loginType === 'admin'" label="操作记录" name="third">
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
      <el-row v-if="is_rel_dealer && loginType === 'admin'" class="cus-details-bot">
        <el-button type="primary" size="small" plain @click="handleModalClick(true, is_openAccount)"
          >
解除关联
</el-button
        >
      </el-row>
      <RemoveShipModal
        :visible="visible"
        :info="infoList"
        :content="modalContent"
        @handleClick="handleModalClick"
      />
    </template>
    <template v-else>
      <editAccount
        :active-name="accountInfo.member_type"
        :info="accountInfo"
        @back="back"
      />
    </template>
  </div>
</template>
<script>
import { getDistributorInfo } from '@/api/marketing'
import { getAdapayLogList } from '@/api/adapay/dealer'
import BaseModal from '@/view/mall/marketing/component/BaseModal'
import RemoveShipModal from '@/view/mall/marketing/component/RemoveShipModal'
import editAccount from './component/editAccount.vue'

export default {
  components: { BaseModal, RemoveShipModal, editAccount },
  data() {
    return {
      datapass_block: null, //数据是否脱敏
      isEdit: false,
      activeName: 'first',
      distributor_id: 0,
      infoList: {},
      loginType: '',
      accountInfo: {}, // 结算账户信息
      split_ledger_info: {}, // 分帐信息
      dealerList: {}, // 经销商信息
      member_type: 'corp',
      is_openAccount: true,
      is_rel_dealer: true,
      visible: false,
      modalContent: '',
      tagsList: [],
      logList: [],
      total_count: 0,
      params: {
        page: 1,
        page_size: 10
      },
      baseInfo: [
        // 地理位置
        { name: '地理位置', field: 'store_address' },
        { name: '地图定位', field: 'qqmapimg', type: 'pic' },
        { name: '店铺经纬度', field: '', filter: this.addressFilter }
      ],
      otherInfo: [
        // 其他
        { name: '关联经销商', field: 'username' }
      ],
      enterPriseList: [
        // 企业信息
        { name: '法人姓名', field: 'legal_person' },
        { name: '法人身份证号码', field: 'legal_cert_id' },
        { name: '法人证件有效期', field: 'legal_cert_id_expires' },
        { name: '营业执照号', field: 'social_credit_code' },
        { name: '商户有效日期', field: 'social_credit_code_expires' },
        { name: '经营范围', field: 'business_scope' },
        { name: '法人电话号码', field: 'tel_no' },
        { name: '企业地址', field: 'address' },
        { name: '邮编', field: 'zip_code' }
      ],
      enterAccountInfo: [
        // 结算账户信息
        { name: '结算银行卡号', field: 'card_no' },
        { name: '结算银行卡开户姓名', field: 'card_name' },
        { name: '结算银行卡所属银行', field: 'bank_name' },
        { name: '结算银行账户类型', field: 'bank_acct_type', filter: this.bankFilter }
      ],
      enterSplitAccountList: [
        // 企业分帐
        { name: '手续费扣费方式', field: 'adapay_fee_mode', filter: this.adapayFilter },
        { name: '总部分账占比', field: 'headquarters_proportion', filter: this.headquartersFilter },
        { name: '经销商分账占比', field: 'dealer_proportion', filter: this.dealerFilter }
      ],
      personInfo: [
        // 个人信息
        { name: '用户姓名', field: 'user_name' },
        { name: '用户手机号码', field: 'tel_no' },
        { name: '法人身份证号码', field: 'cert_id' }
      ],
      accountList: [
        // 个人结算信息
        { name: '开户人姓名', field: 'bank_card_name' },
        { name: '银行预留手机号', field: 'bank_tel_no' },
        { name: '银行账号', field: 'bank_card_id' },
        { name: '开户人证件号码', field: 'bank_cert_id' }
      ],
      splitAccountList: [
        // 个人分帐
        { name: '手续费扣费方式', field: 'adapay_fee_mode', filter: this.adapayFilter },
        { name: '总部分账占比', field: 'headquarters_proportion', filter: this.headquartersFilter }
      ]
    }
  },
  mounted() {
    if (this.$route.query.distributor_id || this.$store.getters.login_type === 'distributor') {
      this.distributor_id = this.$route.query.distributor_id ? this.$route.query.distributor_id : 0
      this.loginType = this.$store.getters.login_type
      if (this.$store.getters.login_type === 'distributor' || this.is_openAccount) {
        this.activeName = 'second'
      }
      this.getTabDetail()
    }
  },
  methods: {
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
      if (e.name == 'third') {
        this.params.page = 1
        this.getLogList()
      }
    },

    editHandle() {
      this.isEdit = true
    },
    addressFilter() {
      const { lat, lng } = this.infoList
      if (lat && lng) {
        return lng + ' - ' + lat
      } else {
        return '-'
      }
    },
    getTabDetail() {
      getDistributorInfo({ distributor_id: this.distributor_id })
        .then((response) => {
          console.log(response)
          const { is_openAccount, is_rel_dealer, adapayMemberInfo, dealer, datapass_block } =
            response.data.data || {}
          const {
            basicInfo: { auto_sync_goods, is_ziti, is_delivery, company_dada_open }
          } = adapayMemberInfo || {}
          this.infoList = response.data.data
          this.datapass_block = datapass_block
          this.split_ledger_info = adapayMemberInfo.split_ledger_info || {}
          this.is_openAccount = is_openAccount
          this.is_rel_dealer = is_rel_dealer
          this.dealerList = dealer || {}
          this.accountInfo = adapayMemberInfo || {}
          this.member_type = adapayMemberInfo.member_type
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
            message: '获取详情出错'
          })
        })
    },
    getLogList() {
      getAdapayLogList({
        log_type: 'distributor',
        ...this.params,
        distributor_id: this.distributor_id
      })
        .then((response) => {
          this.logList = response.data.data.list || {}
          this.total_count = response.data.data.total_count || 0
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取日志出错'
          })
        })
    },
    handleModalClick(visible, is_openAccount) {
      const { username } = this.dealerList
      this.visible = visible
      if (visible && !is_openAccount) {
        this.modalContent = `请确认是否解除该店铺与【${username}】的关联`
      } else if (visible && is_openAccount) {
        this.infoList = { ...this.infoList, audit_state: '3' }
        this.modalContent = '如解除关联，需重新设置总部分账占比。'
      }
    },
    bankFilter() {
      let { bank_acct_type } = this.infoList
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
    adapayFilter() {
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
    dowloadFile(url) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
      this.$message({
        type: 'success',
        message: '下载成功'
      })
    },
    back() {
      this.isEdit = false
    }
  }
}
</script>
<style lang="scss" scoped>
.cus-details {
  .btn {
    background: #f5f5f5;
    padding: 10px 0;
    text-align: center;
    position: relative;
    bottom: 0;
    width: 100%;
  }
  .tips {
    margin: 10px 0;
  }
}
</style>
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
