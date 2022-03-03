<template>
  <div>
    <div
      v-if="$route.path.indexOf('storelist') === -1"
      class="cus-details"
    >
      <el-card>
        <el-row>
          <el-col :span="3">
            <img
              class="cus-details-img"
              src="@/assets/img/adapay/dealer.png"
              alt=""
            >
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
                  infoList.basicInfo ? infoList.basicInfo.tel_no + '（企业电话）' : '-'
                }}</span>
              </div>
              <div class="cus-details-pfonts cus-margin-50">
                <i class="el-icon-message cus-icon" />
                <span>{{
                  infoList.basicInfo ? infoList.basicInfo.email + '（企业邮箱）' : '-'
                }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-tabs
          v-model="activeName"
          class="cus-details-tabs"
        >
          <el-tab-pane
            v-if="infoList.member_id"
            label="开户信息"
            name="first"
          >
            <BaseModal
              :span="7"
              :label-list="infoList.member_type === 'corp' ? enterPriseList : personInfo"
              :info="infoList"
              :title="infoList.member_type === 'corp' ? '企业信息' : '个人信息'"
            />
            <BaseModal
              :span="7"
              :label-list="infoList.member_type === 'corp' ? enterAccountInfo : accountList"
              :info="infoList"
              title="结算账户信息"
            />
            <BaseModal
              :span="7"
              :label-list="
                infoList.member_type === 'corp' ? enterSplitAccountList : splitAccountList
              "
              :info="split_ledger_info"
              title="分账信息"
            />
            <el-card>
              <div slot="header">
                其他信息
              </div>
              <div class="body">
                <el-row class="load-btn">
                  <el-col
                    :span="4"
                    style="text-align: right; padding-right: 10px"
                  >
                    附件信息：
                  </el-col>
                  <el-col
                    v-if="infoList.member_type === 'corp'"
                    :span="20"
                    class="cus-btn"
                  >
                    <el-button
                      type="text"
                      @click="dowloadFile(infoList.attach_file)"
                    >
                      附件
                    </el-button>
                  </el-col>
                  <span v-else>-</span>
                </el-row>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane
            v-else
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
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- <el-row class="cus-details-bot">
        <router-link :to="{ path: matchHidePage('storelist'), query: { operator_id: this.operator_id}}">
          <el-button type='primary' size='small' plain>查看关联店铺</el-button>
        </router-link>
        <el-button @click="handleOpenOpeartion(true, '开启')" type="success" plain size='mini'>开启</el-button>
        <el-button @click="handleOpenOpeartion(true, '禁用')" type="danger" plain size='mini'>禁用</el-button>
        <el-button type='primary' size='small' plain>导出</el-button>
      </el-row> -->
      <el-dialog
        title="通知消息"
        :visible.sync="visibleModal"
        width="25%"
        :close-on-click-modal="false"
        @before-close="handleOpenOpeartion(false, '')"
      >
        <el-row>
          {{ modalContent }}
        </el-row>
        <el-row style="text-align: right">
          <el-button
            type="primary"
            size="small"
            plain
            @click="handleModalConfirm(false)"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleModalConfirm(true)"
          >
            确认
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

export default {
  components: { BaseModal },
  data () {
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
      enterPriseList: [
        // 企业信息
        { name: '法人姓名', field: 'legal_person' },
        { name: '法人身份证号码', field: 'legal_cert_id' },
        { name: '法人证件有效期', field: 'legal_cert_id_expires' },
        { name: '营业执照号', field: 'social_credit_code' },
        { name: '商户有效日期', field: 'social_credit_code_expires	' },
        { name: '经营范围', field: 'business_scope' },
        { name: '法人电话号码', field: 'tel_no' },
        { name: '企业地址', field: 'address' },
        { name: '邮编', field: 'zip_code' }
      ],
      enterAccountInfo: [
        // 企业结算账户信息
        { name: '结算银行卡号', field: 'card_no' },
        { name: '结算银行卡开户姓名', field: 'card_name' },
        { name: '结算银行卡所属银行', field: 'bank_name' },
        { name: '结算银行账户类型', field: 'bank_acct_type', filter: this.bankFilter }
      ],
      enterSplitAccountList: [
        // 企业分帐
        { name: '总部分账占比', field: 'headquarters_proportion', filter: this.headquartersFilter },
        { name: '经销商分账占比', field: 'dealer_proportion', filter: this.dealerFilter },
        { name: '手续费扣费方式', field: 'adapay_fee_mode', filter: this.adapayFilter }
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
        { name: '手续费扣费方式', field: 'adapay_fee_mode', filter: this.adapayFilter }
      ]
    }
  },
  mounted () {
    if (this.$route.query.operator_id) {
      this.operator_id = this.$route.query.operator_id
      this.getTabDetail(this.operator_id)
    }
  },
  methods: {
    addressFilter () {
      const { lat, lng } = this.infoList
      return lng + ' - ' + lat
    },
    getTabDetail (id) {
      getDealerDetail(id)
        .then((response) => {
          this.infoList = response.data.data
          this.split_ledger_info = response.data.data.split_ledger_info || {}
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取详情出错'
          })
        })
    },
    handleOpenOpeartion (visivle, type) {
      this.modalContent =
        type === '开启'
          ? '如开启该经销商，与之关联的已入网成功的店铺也将被开启，总部将参与分账，请确认是否开启该经销商。'
          : '如禁用该经销商，与之关联的已入网成功的店铺也将被禁用，总部不在参与分账，请确认是否禁用该经销商。'
      this.visibleModal = visivle
      this.modalType = type
    },
    handleModalConfirm (type) {
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
    dowloadFile (url) {
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
    bankFilter () {
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
}
</style>
