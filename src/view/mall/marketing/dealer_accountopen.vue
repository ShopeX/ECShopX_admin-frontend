<template>
  <div
    v-loading="loading"
    class="cus-dealer"
  >
    <el-card>
      <el-row>
        <el-col :span="3">
          <img
            v-if="loginType === 'dealer'"
            class="cus-dealer-img"
            src="@/assets/img/adapay/dealer.png"
            alt=""
          >
          <img
            v-if="loginType === 'distributor'"
            class="cus-dealer-img"
            src="@/assets/img/adapay/store.png"
            alt=""
          >
        </el-col>
        <el-col :span="20">
          <div class="cus-dealer-flex">
            <p class="cus-dealer-row">
              {{ infoList.basicInfo ? infoList.basicInfo.name : '-' }}
            </p>
            <div class="cus-dealer-pfonts cus-margin-40">
              <i class="el-icon-location-outline cus-icon" />
              <span>{{ infoList.basicInfo ? infoList.basicInfo.area : '-' }}</span>
            </div>
          </div>
          <p class="cus-dealer-pfonts">
            <i class="el-icon-s-custom cus-icon" />
            <span>{{ infoList.basicInfo ? infoList.basicInfo.contact : '-' }}</span>
          </p>
          <p
            v-if="loginType === 'distributor'"
            class="cus-dealer-pfonts"
          >
            <i class="el-icon-time cus-icon" />
            <span>{{ infoList.basicInfo ? infoList.basicInfo.hour : '-' }}</span>
          </p>
          <div class="cus-dealer-flex">
            <div class="cus-dealer-pfonts">
              <i class="el-icon-phone cus-icon" />
              <span>{{
                infoList.basicInfo ? infoList.basicInfo.tel_no + '（企业电话）' : '-'
              }}</span>
            </div>
            <div
              v-if="loginType === 'distributor'"
              class="cus-dealer-pfonts cus-margin-50"
            >
              <i class="el-icon-message cus-icon" />
              <span>{{
                infoList.basicInfo && infoList.basicInfo.email
                  ? infoList.basicInfo.email + '（企业邮箱）'
                  : '-'
              }}</span>
            </div>
          </div>
          <div
            v-if="loginType === 'dealer'"
            class="cus-dealer-pfonts"
          >
            <i class="el-icon-message cus-icon" />
            <span>{{
              infoList.basicInfo && infoList.basicInfo.email
                ? infoList.basicInfo.email + '（企业邮箱）'
                : '-'
            }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row
        v-if="loginType === 'distributor'"
        style="margin-top: 10px"
      >
        <el-tag
          v-for="item in tagsList"
          :key="item.name"
          :type="item.type"
          size="small"
          class="cus-dealer-tags"
        >
          {{ item.name }}
        </el-tag>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs
        v-model="activeName"
        class="cus-dealer-tabs"
      >
        <el-tab-pane
          label="开户信息"
          name="first"
        >
          <BaseModal
            :title="member_type === 'corp' ? '企业信息' : '个人信息'"
            :label-list="member_type === 'corp' ? enterPriseInfo : personalInfo"
            :info="infoList"
            :span="7"
          />
          <BaseModal
            title="结算账户信息"
            :label-list="member_type === 'corp' ? enterAccountInfo : personalAccountInfo"
            :info="infoList"
            :span="7"
          />
          <!-- <BaseModal
            title="分账信息"
            :labelList="member_type === 'corp' ? enterSplitAcount : personalSplitAcount"
            :info='infoList'
            :span='7'
          /> -->
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
                  :span="20"
                  class="cus-btn"
                >
                  <el-button
                    v-if="member_type === 'corp'"
                    type="text"
                    @click="dowloadFile(infoList.attach_file)"
                  >
                    附件
                  </el-button>
                  <span v-else>-</span>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- <el-row class="cus-dealer-bot">
      <el-button type='primary' @click="handleModalClick(true, '未开户')" size='small' plain>解除关联</el-button>
    </el-row> -->
    <!-- <RemoveShipModal :visible='visible' :info='infoList' :content='modalContent' @handleClick='handleModalClick' /> -->
  </div>
</template>
<script>
import { getDealderInfo } from '@/api/adapay/dealer'
import BaseModal from '@/view/mall/marketing/component/BaseModal'
import RemoveShipModal from '@/view/mall/marketing/component/RemoveShipModal'

export default {
  components: { BaseModal, RemoveShipModal },
  data () {
    return {
      activeName: 'first',
      infoList: {},
      visible: false,
      modalContent: '',
      modalType: '',
      loginType: '',
      member_type: '',
      loading: true,
      tagsList: [],
      enterPriseInfo: [
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
        // 企业结算账户信息
        { name: '结算银行卡号', field: 'card_no' },
        { name: '结算银行卡开户姓名', field: 'bank_card_name' },
        { name: '结算银行卡所属银行', field: 'bank_name' },
        { name: '结算银行卡开户省市', field: 'area' },
        { name: '结算银行账户类型', field: 'bank_acct_type', filter: this.bankAcctType }
      ],
      enterSplitAcount: [
        // 企业分帐信息
        { name: '手续费扣费方式', field: 'div_fee_mode', filter: this.adapayFilter }
      ],
      personalInfo: [
        // 个人信息
        { name: '用户姓名', field: 'user_name' },
        { name: '用户手机号码', field: 'tel_no' },
        { name: '法人身份证号码', field: 'cert_id' }
      ],
      personalAccountInfo: [
        // 个人结算账户信息
        { name: '开户人姓名', field: 'bank_card_name' },
        { name: '银行预留手机号', field: 'bank_tel_no' },
        { name: '银行账号', field: 'bank_card_id' },
        { name: '开户人证件号码', field: 'bank_cert_id' }
      ],
      personalSplitAcount: [
        // 个人分账信息
        { name: '手续费扣费方式', field: 'div_fee_mode', filter: this.adapayFilter }
      ]
    }
  },
  mounted () {
    this.loginType = this.$store.getters.login_type
    this.getDetail()
  },
  methods: {
    addressFilter () {
      const { lat, lng } = this.infoList
      if (lat && lng) {
        return lng + ' - ' + lat
      } else {
        return '-'
      }
    },
    getDetail () {
      getDealderInfo()
        .then((response) => {
          this.loading = false
          this.infoList = response.data.data
          this.member_type = response.data.data.member_type
          const { auto_sync_goods, is_ziti, is_delivery, is_dada } = response.data.data.basicInfo
          if (auto_sync_goods) {
            this.tagsList.push({ name: '自动上架商品', type: 'danger' })
          }
          if (is_ziti) {
            this.tagsList.push({ name: '支持自提', type: '' })
          }
          if (is_delivery) {
            this.tagsList.push({ name: '支持快递', type: 'success' })
          }
          if (is_dada) {
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
    // handleModalClick (visible, type) {
    //   this.visible = visible
    //   this.modalType = type ? type : ''
    //   if (visible && type === '未开户') {
    //     this.modalContent = '请确认是否解除该店铺与【不重要的经销商】的关联'
    //   } else if (visible && type === '开户') {
    //     this.modalContent = '如解除关联，该店铺需重新设置店铺所占分帐比例。'
    //   }
    // },
    bankAcctType () {
      let { bank_acct_type } = this.infoList
      return (bank_acct_type === '1' && '对公') || (bank_acct_type === '2' && '对私') || '-'
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
    adapayFilter () {
      let { div_fee_mode } = this.infoList
      let returnValue = ''
      switch (div_fee_mode) {
        case 'I':
          returnValue = '内扣'
          break
        case 'O':
          returnValue = '外扣'
          break
      }
      return returnValue
    }
  }
}
</script>

<style lang="scss">
.cus-dealer {
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
