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
              <span>{{ MerchantEntry.cust_tel + '（商户电话）' || '-' }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" class="cus-openaccount-tabs" @tab-click="tabChange">
        <el-tab-pane label="开户信息" name="first">
          <el-card class="mycard">
            <div slot="header">企业信息</div>
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
                    <el-col :span="10" class="cus-row-flex">三证合一码：</el-col>
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
                    <el-col :span="12" class="cus-row-flex">法人/小微负责人身份证正面：</el-col>
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
                    <el-col :span="10" class="cus-row-flex">门店：</el-col>
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
                    <el-col :span="12" class="cus-row-flex">法人/小微负责人身份证反面：</el-col>
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
                    <el-col :span="10" class="cus-row-flex">股东身份证正面：</el-col>
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
                    <el-col :span="12" class="cus-row-flex">股东身份证反面：</el-col>
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
            <div slot="header">联系人信息</div>
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
            <div slot="header">结算账户信息</div>
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
                    <el-col :span="10" class="cus-row-flex">结算账号开户证明：</el-col>
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
                      开户许可证/小微负责人银行卡正面照：
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
            <div slot="header">其他信息</div>
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
                    <el-col :span="10" class="cus-row-flex">网站截图：</el-col>
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
                    <el-col :span="12" class="cus-row-flex">行业资质文件：</el-col>
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
                    <el-col :span="10" class="cus-row-flex">租赁合同：</el-col>
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
                    <el-col :span="12" class="cus-row-flex">icp备案许可证明/许可证编码：</el-col>
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
                    <el-col :span="10" class="cus-row-flex">交易测试记录：</el-col>
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
                    <el-col :span="12" class="cus-row-flex">业务场景证明材料：</el-col>
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
        <el-tab-pane label="操作记录" name="second">
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
export default {
  data() {
    return {
      activeName: 'first',
      loading: true,
      MerchantEntry: {},
      SubmitLicense: {},
      enterPriseInfo: [
        // 企业信息
        { name: '法人姓名', field: 'legal_name' },
        { name: '法人身份证号码', field: 'legal_idno' },
        { name: '法人证件有效期', field: 'legal_id_expires' },
        { name: '法人电话号码', field: 'legal_mp' },
        { name: '营业执照号', field: 'license_code' },
        { name: '商户有效日期', field: 'mer_valid_date' },
        { name: '经营地址', field: 'cust_addr' },
        { name: '注册手机号', field: 'usr_phone' }
      ],
      enterContractInfo: [
        // 联系人信息
        { name: '联系人姓名', field: 'cont_name' },
        { name: '联系人手机号码', field: 'cont_phone' },
        { name: '电子邮箱', field: 'customer_email' }
      ],
      enterAccountInfo: [
        // 结算账户信息
        { name: '结算银行卡号', field: 'card_id_mask' },
        { name: '结算银行卡开户姓名', field: 'card_name' },
        { name: '结算银行卡所属银行', field: 'bank_name' },
        { name: '结算银行卡开户省市', field: '', filter: this.areaFilter },
        { name: '结算银行账户类型', field: '', filter: this.bankAcctType }
      ],
      enterOtherInfo: [
        // 其他信息
        { name: '商城地址', field: 'business_add' },
        { name: '股东身份证姓名', field: 'cert_name' },
        { name: '股东身份证号', field: 'cert_id' },
        { name: '行业资质文件类型', field: '', filter: this.docTypeFilter }
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
        .then(response => {
          const { info } = response.data.data || {}
          this.MerchantEntry = info.MerchantEntry || {}
          this.SubmitLicense = info.SubmitLicense || {}
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取详情出错'
          })
        })
    },
    getLogList() {
      getAdapayLogList({ log_type: 'merchant', ...this.params })
        .then(response => {
          this.logList = response.data.data.list || {}
          this.total_count = response.data.data.total_count || 0
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取日志出错'
          })
        })
    },
    bankAcctType() {
      let { bank_acct_type } = this.MerchantEntry
      return (bank_acct_type === '1' && '对公') || (bank_acct_type === '2' && '对私') || '-'
    },
    areaFilter() {
      let { prov_code, area_code } = this.MerchantEntry
      return prov_code + '-' + area_code || '-'
    },
    docTypeFilter() {
      let { industry_qualify_doc_type } = this.SubmitLicense
      return (
        (industry_qualify_doc_type === '1' && '游戏类') ||
        (industry_qualify_doc_type === '2' && '直播类') ||
        (industry_qualify_doc_type === '3' && '小说图书类') ||
        (industry_qualify_doc_type === '4' && '其他') ||
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
