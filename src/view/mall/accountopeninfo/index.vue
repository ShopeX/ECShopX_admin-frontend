<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="cus-openaccount" v-loading="loading">
    <el-card>
      <el-row>
        <el-col :span="3">
          <img class="cus-openaccount-img" src="@/assets/img/adapay/qiye.png" alt="">
        </el-col>
        <el-col :span="20">
          <div class="cus-openaccount-flex">
            <p class="cus-openaccount-row">{{ MerchantEntry.mer_name || '-' }}</p>
            <div class="cus-openaccount-pfonts cus-margin-40">
              <i class="el-icon-location-outline cus-icon" />
              <span>{{ MerchantEntry.reg_addr || '-' }}</span>
            </div>
          </div>
          <p class="cus-openaccount-wfonts">
            <span>{{ MerchantEntry.mer_short_name || '-' }}</span>
          </p>
          <p class="cus-openaccount-pfonts">
            <i class="el-icon-s-custom cus-icon" />
            <span>{{ MerchantEntry.legal_name || '-' }}</span>
          </p>
          <div class="cus-openaccount-flex">
            <div class="cus-openaccount-pfonts">
              <i class="el-icon-phone cus-icon" />
              <span>{{ MerchantEntry.cust_tel + $t('287aad92.f9a0ae') || '-' }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" class="cus-openaccount-tabs" @tab-click="tabChange">
        <el-tab-pane :label="$t('287aad92.ac7b4c')" name="first">
          <el-card class="mycard">
            <div slot="header">{{ $t('287aad92.54796d') }}</div>
            <div class="body">
              <el-row>
                <el-col
                  v-for="(col, colIndex) in enterPriseInfo"
                  :key="colIndex"
                  :span="7"
                  :offset="1"
                >
                  <el-row class="cus-row-mb">
                    <el-col :span="9" class="cus-row-flex">{{ addSymbol(col.name) }}</el-col>
                    <el-col :span="15" class="word-warp">
                      {{
                        col.filter
                          ? col.filter(MerchantEntry[col.field]) || '-'
                          : MerchantEntry[col.field] || '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="10" class="cus-row-flex">{{ $t('287aad92.394eab') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.social_credit_code_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.social_credit_code_url"
                      :preview-src-list="[SubmitLicense.social_credit_code_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="11" :offset="2" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="12" class="cus-row-flex">{{ $t('287aad92.cc4b80') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.legal_certId_front_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.legal_certId_front_url"
                      :preview-src-list="[SubmitLicense.legal_certId_front_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="10" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="10" class="cus-row-flex">{{ $t('287aad92.0eff7d') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.store_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.store_url"
                      :preview-src-list="[SubmitLicense.store_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="11" :offset="2" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="12" class="cus-row-flex">{{ $t('287aad92.8f13dc') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.legal_cert_id_back_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.legal_cert_id_back_url"
                      :preview-src-list="[SubmitLicense.legal_cert_id_back_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="10" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="10" class="cus-row-flex">{{ $t('287aad92.642326') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.cert_front_image_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.cert_front_image_url"
                      :preview-src-list="[SubmitLicense.cert_front_image_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="11" :offset="2" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="12" class="cus-row-flex">{{ $t('287aad92.5d2637') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.cert_back_image_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.cert_back_image_url"
                      :preview-src-list="[SubmitLicense.cert_back_image_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card class="mycard">
            <div slot="header">{{ $t('287aad92.80fcdb') }}</div>
            <div class="body">
              <el-row>
                <el-col
                  v-for="(col, colIndex) in enterContractInfo"
                  :key="colIndex"
                  :span="7"
                  :offset="1"
                >
                  <el-row class="cus-row-mb">
                    <el-col :span="11" class="cus-row-flex">{{ addSymbol(col.name) }}</el-col>
                    <el-col :span="13" class="word-warp">
                      {{
                        col.filter
                          ? col.filter(MerchantEntry[col.field]) || '-'
                          : MerchantEntry[col.field] || '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card class="mycard">
            <div slot="header">{{ $t('287aad92.99f89b') }}</div>
            <div class="body">
              <el-row>
                <el-col
                  v-for="(col, colIndex) in enterAccountInfo"
                  :key="colIndex"
                  :span="7"
                  :offset="1"
                >
                  <el-row class="cus-row-mb">
                    <el-col :span="11" class="cus-row-flex">{{ addSymbol(col.name) }}</el-col>
                    <el-col :span="13" class="word-warp">
                      {{
                        col.filter
                          ? col.filter(MerchantEntry[col.field]) || '-'
                          : MerchantEntry[col.field] || '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="10" class="cus-row-flex">{{ $t('287aad92.dc9631') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.settle_account_certificate_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.settle_account_certificate_url"
                      :preview-src-list="[SubmitLicense.settle_account_certificate_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="11" :offset="2" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="12" class="cus-row-flex">
                      {{ $t('287aad92.fc242f') }}
                    </el-col>
                    <el-image
                      v-if="SubmitLicense.account_opening_permit_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.account_opening_permit_url"
                      :preview-src-list="[SubmitLicense.account_opening_permit_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card class="mycard">
            <div slot="header">{{ $t('287aad92.febe40') }}</div>
            <div class="body">
              <el-row>
                <el-col
                  v-for="(col, colIndex) in enterOtherInfo"
                  :key="colIndex"
                  :span="7"
                  :offset="1"
                >
                  <el-row class="cus-row-mb">
                    <el-col :span="11" class="cus-row-flex">{{ addSymbol(col.name) }}</el-col>
                    <el-col :span="13" class="word-warp">
                      {{
                        col.filter
                          ? col.filter(SubmitLicense[col.field]) || '-'
                          : SubmitLicense[col.field] || '-'
                      }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-row class="cus-row-dis">
                    <el-col :span="10" class="cus-row-flex">{{ $t('287aad92.c0d97e') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.web_pic_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.web_pic_url"
                      :preview-src-list="[SubmitLicense.web_pic_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="11" :offset="2">
                  <el-row class="cus-row-dis">
                    <el-col :span="12" class="cus-row-flex">{{ $t('287aad92.16ec11') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.industry_qualify_doc_license_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.industry_qualify_doc_license_url"
                      :preview-src-list="[SubmitLicense.industry_qualify_doc_license_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="10" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="10" class="cus-row-flex">{{ $t('287aad92.57fdb3') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.lease_contract_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.lease_contract_url"
                      :preview-src-list="[SubmitLicense.lease_contract_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="11" :offset="2" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="12" class="cus-row-flex">{{ $t('287aad92.d20686') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.icp_registration_license_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.icp_registration_license_url"
                      :preview-src-list="[SubmitLicense.icp_registration_license_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="10" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="10" class="cus-row-flex">{{ $t('287aad92.244e31') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.transaction_test_record_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.transaction_test_record_url"
                      :preview-src-list="[SubmitLicense.transaction_test_record_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
                <el-col :span="11" :offset="2" style="margin-top: 20px">
                  <el-row class="cus-row-dis">
                    <el-col :span="12" class="cus-row-flex">{{ $t('287aad92.d6f269') }}</el-col>
                    <el-image
                      v-if="SubmitLicense.buss_support_materials_url"
                      style="height: 100px; vertical-align: middle"
                      :src="SubmitLicense.buss_support_materials_url"
                      :preview-src-list="[SubmitLicense.buss_support_materials_url]"
                      fit="cover"
                    />
                    <span v-else>-</span>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('287aad92.cf8e1f')" name="second">
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
  </div>
</template>
<script>
import { getOpenDetail, getAdapayLogList } from '@/api/adapay/dealer'
import { i18n } from '@/i18n'
export default {
  data() {
    return {
      activeName: 'first',
      loading: true,
      MerchantEntry: {},
      SubmitLicense: {},
      enterPriseInfo: [
        // 企业信息
        { name: i18n.t('287aad92.2fe17a'), field: 'legal_name' },
        { name: i18n.t('287aad92.1415b3'), field: 'legal_idno' },
        { name: i18n.t('287aad92.a79a87'), field: 'legal_id_expires' },
        { name: i18n.t('287aad92.6cd765'), field: 'legal_mp' },
        { name: i18n.t('287aad92.b9bf38'), field: 'license_code' },
        { name: i18n.t('287aad92.1fcd91'), field: 'mer_valid_date' },
        { name: i18n.t('287aad92.0ed872'), field: 'cust_addr' },
        { name: i18n.t('287aad92.6b2390'), field: 'usr_phone' }
      ],
      enterContractInfo: [
        // 联系人信息
        { name: i18n.t('287aad92.986d36'), field: 'cont_name' },
        { name: i18n.t('287aad92.4868cf'), field: 'cont_phone' },
        { name: i18n.t('287aad92.7148d5'), field: 'customer_email' }
      ],
      enterAccountInfo: [
        // 结算账户信息
        { name: i18n.t('287aad92.88174a'), field: 'card_id_mask' },
        { name: i18n.t('287aad92.2f4116'), field: 'card_name' },
        { name: i18n.t('287aad92.0a3e82'), field: 'bank_name' },
        { name: i18n.t('287aad92.5ae594'), field: '', filter: this.areaFilter },
        { name: i18n.t('287aad92.32734c'), field: '', filter: this.bankAcctType }
      ],
      enterOtherInfo: [
        // 其他信息
        { name: i18n.t('287aad92.8283e5'), field: 'business_add' },
        { name: i18n.t('287aad92.03ce2d'), field: 'cert_name' },
        { name: i18n.t('287aad92.a5dd77'), field: 'cert_id' },
        { name: i18n.t('287aad92.4e17b1'), field: '', filter: this.docTypeFilter }
      ],
      logList: [],
      total_count: 0,
      params: {
        page: 1,
        page_size: 10
      }
    }
  },
  methods: {
    getDetail() {
      getOpenDetail()
        .then((response) => {
          const { info } = response.data.data || {}
          this.MerchantEntry = info.MerchantEntry || {}
          this.SubmitLicense = info.SubmitLicense || {}
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('287aad92.25bc43')
          })
        })
    },
    getLogList() {
      getAdapayLogList({ log_type: 'merchant', ...this.params })
        .then((response) => {
          this.logList = response.data.data.list || {}
          this.total_count = response.data.data.total_count || 0
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('287aad92.ae6e5b')
          })
        })
    },
    bankAcctType() {
      let { bank_acct_type } = this.MerchantEntry
      return (
        (bank_acct_type === '1' && this.$t('287aad92.18ba13')) ||
        (bank_acct_type === '2' && this.$t('287aad92.f0bf8a')) ||
        '-'
      )
    },
    areaFilter() {
      let { prov_code, area_code } = this.MerchantEntry
      return prov_code + '-' + area_code || '-'
    },
    docTypeFilter() {
      let { industry_qualify_doc_type } = this.SubmitLicense
      return (
        (industry_qualify_doc_type === '1' && this.$t('287aad92.ee9b1e')) ||
        (industry_qualify_doc_type === '2' && this.$t('287aad92.d52f0c')) ||
        (industry_qualify_doc_type === '3' && this.$t('287aad92.92c2c6')) ||
        (industry_qualify_doc_type === '4' && this.$t('287aad92.0d98c7')) ||
        '-'
      )
    },
    addSymbol(symbol) {
      if (symbol.indexOf('：') > -1) {
        return symbol
      }
      return `${symbol}：`
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
  },
  mounted() {
    this.getDetail()
  }
}
</script>

<style lang="scss">
.cus-openaccount {
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
  &-wfonts {
    font-size: 18px;
  }
  &-pfonts {
    margin-top: 7px;
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
  .cus-row-flex {
    text-align: right;
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
  .cus-row-mb {
    margin-bottom: 20px !important;
  }
  .cus-row-dis {
    display: flex;
  }
  .cus-btn {
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
  .cus-timeline {
    margin-top: 20px;
    padding-left: 10px;
    .el-timeline-item {
      padding-bottom: 40px;
    }
  }
}
</style>
