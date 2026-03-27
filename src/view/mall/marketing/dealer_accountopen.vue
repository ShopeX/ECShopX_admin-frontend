<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div v-loading="loading" class="cus-dealer">
    <template v-if="!isEdit">
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
              <p class="cus-dealer-row">{{ infoList.basicInfo ? infoList.basicInfo.name : '-' }}</p>
              <div class="cus-dealer-pfonts cus-margin-40">
                <i class="el-icon-location-outline cus-icon" />
                <span>{{ infoList.basicInfo ? infoList.basicInfo.area : '-' }}</span>
              </div>
            </div>
            <p class="cus-dealer-pfonts">
              <i class="el-icon-s-custom cus-icon" />
              <span>{{ infoList.basicInfo ? infoList.basicInfo.contact : '-' }}</span>
            </p>
            <p v-if="loginType === 'distributor'" class="cus-dealer-pfonts">
              <i class="el-icon-time cus-icon" />
              <span>{{ infoList.basicInfo ? infoList.basicInfo.hour : '-' }}</span>
            </p>
            <div class="cus-dealer-flex">
              <div class="cus-dealer-pfonts">
                <i class="el-icon-phone cus-icon" />
                <span>{{
                  infoList.basicInfo
                    ? infoList.basicInfo.tel_no + '（' + $t('52f8a5c0.3d9d21') + '）'
                    : '-'
                }}</span>
              </div>
              <div v-if="loginType === 'distributor'" class="cus-dealer-pfonts cus-margin-50">
                <i class="el-icon-message cus-icon" />
                <span>{{
                  infoList.basicInfo && infoList.basicInfo.email
                    ? infoList.basicInfo.email + '（' + $t('52f8a5c0.d7c0a1') + '）'
                    : '-'
                }}</span>
              </div>
            </div>
            <div v-if="loginType === 'dealer'" class="cus-dealer-pfonts">
              <i class="el-icon-message cus-icon" />
              <span>{{
                infoList.basicInfo && infoList.basicInfo.email
                  ? infoList.basicInfo.email + '（' + $t('52f8a5c0.d7c0a1') + '）'
                  : '-'
              }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="loginType === 'distributor'" style="margin-top: 10px">
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
        <el-tabs v-model="activeName" class="cus-dealer-tabs">
          <el-tab-pane :label="$t('52f8a5c0.ac7b4c')" name="first">
            <BaseModal
              :title="
                member_type === 'corp'
                  ? `${$t('52f8a5c0.54796d')} ${infoList.audit_desc_1 || ''} `
                  : $t('52f8a5c0.eab129') + ' ' + `${infoList.audit_desc_1 || ''} `
              "
              :label-list="member_type === 'corp' ? enterPriseInfo : personalInfo"
              :info="infoList"
              :span="7"
            />
            <BaseModal
              :title="$t('52f8a5c0.99f89b') + `${infoList.audit_desc_2 || ''} `"
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
            <el-card v-if="member_type == 'corp'">
              <div slot="header">{{ $t('52f8a5c0.febe40') }}</div>
              <div class="body">
                <el-row class="load-btn">
                  <el-col :span="4" style="text-align: right; padding-right: 10px">
                    {{ $t('52f8a5c0.8a9502') }}
                  </el-col>
                  <el-col :span="20" class="cus-btn">
                    <el-button
                      v-if="member_type === 'corp'"
                      type="text"
                      @click="dowloadFile(infoList.attach_file)"
                    >
                      {{ $t('52f8a5c0.c9a6ee') }}
                    </el-button>
                    <span v-else>-</span>
                  </el-col>
                </el-row>
              </div>
            </el-card>
            <div class="btn">
              <el-button
                v-if="infoList.audit_state != 'A'"
                type="primary"
                @click="editHandle(true)"
              >
                {{ $t('52f8a5c0.95b351') }}
              </el-button>
              <el-button v-if="infoList.audit_state == 'A'">{{ $t('52f8a5c0.b720a6') }}</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </template>
    <template v-else>
      <editAccount :active-name="infoList.member_type" :info="infoList" @back="editHandle(false)" />
    </template>
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
import editAccount from '@/view/mall/marketing/component/editAccount.vue'

export default {
  components: { BaseModal, RemoveShipModal, editAccount },
  data() {
    return {
      isEdit: false,
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
        { name: this.$t('52f8a5c0.2fe17a'), field: 'legal_person' },
        { name: this.$t('52f8a5c0.1415b3'), field: 'legal_cert_id' },
        { name: this.$t('52f8a5c0.a79a87'), field: 'legal_cert_id_expires' },
        { name: this.$t('52f8a5c0.b9bf38'), field: 'social_credit_code' },
        { name: this.$t('52f8a5c0.1fcd91'), field: 'social_credit_code_expires' },
        { name: this.$t('52f8a5c0.04228b'), field: 'business_scope' },
        { name: this.$t('52f8a5c0.6cd765'), field: 'tel_no' },
        { name: this.$t('52f8a5c0.400147'), field: 'address' },
        { name: this.$t('52f8a5c0.4d8e09'), field: 'zip_code' }
      ],
      enterAccountInfo: [
        // 企业结算账户信息
        { name: this.$t('52f8a5c0.88174a'), field: 'card_no' },
        { name: this.$t('52f8a5c0.2f4116'), field: 'bank_card_name' },
        { name: this.$t('52f8a5c0.0a3e82'), field: 'bank_name' },
        { name: this.$t('52f8a5c0.5ae594'), field: 'area' },
        { name: this.$t('52f8a5c0.32734c'), field: 'bank_acct_type', filter: this.bankAcctType }
      ],
      enterSplitAcount: [
        // 企业分帐信息
        { name: this.$t('52f8a5c0.6e640f'), field: 'div_fee_mode', filter: this.adapayFilter }
      ],
      personalInfo: [
        // 个人信息
        { name: this.$t('52f8a5c0.d5b5b5'), field: 'user_name' },
        { name: this.$t('52f8a5c0.dde968'), field: 'tel_no' },
        { name: this.$t('52f8a5c0.1415b3'), field: 'cert_id' }
      ],
      personalAccountInfo: [
        // 个人结算账户信息
        { name: this.$t('52f8a5c0.e3f6a6'), field: 'bank_card_name' },
        { name: this.$t('52f8a5c0.a0b7da'), field: 'bank_tel_no' },
        { name: this.$t('52f8a5c0.954218'), field: 'bank_card_id' },
        { name: this.$t('52f8a5c0.c503f0'), field: 'bank_cert_id' }
      ],
      personalSplitAcount: [
        // 个人分账信息
        { name: this.$t('52f8a5c0.6e640f'), field: 'div_fee_mode', filter: this.adapayFilter }
      ]
    }
  },
  mounted() {
    this.loginType = this.$store.getters.login_type
    this.getDetail()
  },
  methods: {
    addressFilter() {
      const { lat, lng } = this.infoList
      if (lat && lng) {
        return lng + ' - ' + lat
      } else {
        return '-'
      }
    },
    getDetail() {
      getDealderInfo()
        .then((response) => {
          this.loading = false
          this.infoList = response.data.data
          this.member_type = response.data.data.member_type
          const { auto_sync_goods, is_ziti, is_delivery, is_dada } = response.data.data.basicInfo
          if (auto_sync_goods) {
            this.tagsList.push({ name: this.$t('52f8a5c0.d35f24'), type: 'danger' })
          }
          if (is_ziti) {
            this.tagsList.push({ name: this.$t('52f8a5c0.49a523'), type: '' })
          }
          if (is_delivery) {
            this.tagsList.push({ name: this.$t('52f8a5c0.0051b8'), type: 'success' })
          }
          if (is_dada) {
            this.tagsList.push({ name: this.$t('52f8a5c0.583dcd'), type: 'warning' })
          }
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('52f8a5c0.25bc43')
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
    bankAcctType() {
      let { bank_acct_type } = this.infoList
      return (
        (bank_acct_type === '1' && this.$t('52f8a5c0.18ba13')) ||
        (bank_acct_type === '2' && this.$t('52f8a5c0.f0bf8a')) ||
        '-'
      )
    },
    dowloadFile(url) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
      this.$message({
        type: 'success',
        message: this.$t('52f8a5c0.50940e')
      })
    },
    editHandle(isEdit) {
      this.isEdit = isEdit
    },
    adapayFilter() {
      let { div_fee_mode } = this.infoList
      let returnValue = ''
      switch (div_fee_mode) {
        case 'I':
          returnValue = this.$t('52f8a5c0.75d29a')
          break
        case 'O':
          returnValue = this.$t('52f8a5c0.6c1506')
          break
      }
      return returnValue
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  margin: 10px 0;
}
.btn {
  background: #f5f5f5;
  padding: 10px 0;
  text-align: center;
  position: relative;
  bottom: 0;
  width: 100%;
}
</style>

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
