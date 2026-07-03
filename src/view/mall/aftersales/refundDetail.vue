<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('eb172bd4.3974a9')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button @click.native="handleCancel"> {{ $t('eb172bd4.5f4112') }} </el-button>
      </div>
    </template>
    <div class="section-white">
      <div class="section-body">
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.477317') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.refund_bn }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.070dce') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.order_id }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.cd1b26') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.aftersales_bn }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.36ee2b') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.trade_id }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.030517') }} </el-col>
          <el-col :span="20">
            {{ formatMoneyWithSymbol(refundDetail.refund_fee, refundCurrencySymbol) }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.bbdb6f') }} </el-col>
          <el-col :span="20">
            {{ formatMoneyWithSymbol(refundDetail.refunded_fee, refundCurrencySymbol) }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.886abd') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.refund_point }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.cd88d4') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.refunded_point }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.e1920f') }} </el-col>
          <el-col :span="20">
            <el-tag v-if="refundDetail.refund_status == 'READY'" size="mini" type="info">
              {{ $t('eb172bd4.97a81d') }}
            </el-tag>
            <el-tag
              v-else-if="refundDetail.refund_status == 'AUDIT_SUCCESS'"
              size="mini"
              type="success"
            >
              {{ $t('eb172bd4.202a8b') }}
            </el-tag>
            <el-tag v-else-if="refundDetail.refund_status == 'SUCCESS'" size="mini" type="success">
              {{ $t('eb172bd4.d58cbd') }}
            </el-tag>
            <el-tag v-else-if="refundDetail.refund_status == 'REFUSE'" size="mini" type="danger">
              {{ $t('eb172bd4.771b8b') }}
            </el-tag>
            <el-tag v-else-if="refundDetail.refund_status == 'CANCEL'" size="mini" type="info">
              {{ $t('eb172bd4.0a7dff') }}
            </el-tag>
            <el-tag
              v-else-if="refundDetail.refund_status == 'PROCESSING'"
              size="mini"
              type="success"
            >
              {{ $t('eb172bd4.cd3291') }}
            </el-tag>
            <el-tag v-else-if="refundDetail.refund_status == 'CHANGE'" size="mini" type="danger">
              {{ $t('eb172bd4.c59ead') }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.9db7af') }} </el-col>
          <el-col :span="20">
            <el-tag
              v-if="refundDetail.refund_type == '0'"
              effect="plain"
              type="warning"
              size="mini"
            >
              {{ $t('eb172bd4.59bd68') }}
            </el-tag>
            <el-tag v-else-if="refundDetail.refund_type == '1'" effect="plain" size="mini">
              {{ $t('eb172bd4.63d2ec') }}
            </el-tag>
            <el-tag
              v-else-if="refundDetail.refund_type == '2'"
              effect="plain"
              type="danger"
              size="mini"
            >
              {{ $t('eb172bd4.518ce0') }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.1ec73b') }} </el-col>
          <el-col :span="20">
            <el-tag v-if="refundDetail.freight <= 0" effect="plain" type="warning" size="mini">
              {{ $t('eb172bd4.3a58d0') }}
            </el-tag>
            <el-tag v-else-if="refundDetail.freight > 0" effect="plain" size="mini">
              {{ $t('eb172bd4.662229') }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.85df68') }} </el-col>
          <el-col :span="20">
            {{
              refundDetail.freight_type == 'cash'
                ? formatMoneyWithSymbol(refundDetail.freight, refundCurrencySymbol)
                : 0
            }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.e672db') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.freight_type == 'point' ? refundDetail.freight : 0 }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.a0c13c') }} </el-col>
          <el-col :span="20">
            <span v-if="refundDetail.pay_type == 'wxpay'">{{ $t('eb172bd4.bffe28') }}</span>
            <span v-if="refundDetail.pay_type == 'wxpayapp'">{{ $t('eb172bd4.3c2c77') }}</span>
            <span v-if="refundDetail.pay_type == 'wxpayh5'">{{ $t('eb172bd4.df7033') }}</span>
            <span v-if="refundDetail.pay_type == 'wxpaypc'">{{ $t('eb172bd4.c8a8cb') }}</span>
            <span v-if="refundDetail.pay_type == 'wxpaypos'">{{ $t('eb172bd4.67a318') }}</span>
            <span v-if="refundDetail.pay_type == 'alipayapp'">{{ $t('eb172bd4.2ac4fe') }}</span>
            <span v-if="refundDetail.pay_type == 'alipay'">{{ $t('eb172bd4.e3b206') }}</span>
            <span v-if="refundDetail.pay_type == 'alipayh5'">{{ $t('eb172bd4.5a3c52') }}</span>
            <span v-if="refundDetail.pay_type == 'alipaypos'">{{ $t('eb172bd4.bc475f') }}</span>
            <span v-if="refundDetail.pay_type == 'deposit'">{{ $t('eb172bd4.89ac23') }}</span>
            <span v-if="refundDetail.pay_type == 'ebuy'">{{ $t('eb172bd4.a2e703') }}</span>
            <span v-if="refundDetail.pay_type == 'point'">{{ $t('eb172bd4.accd19') }}</span>
            <span v-if="refundDetail.pay_type == 'pos'">{{ $t('eb172bd4.d37dec') }}</span>
            <span v-if="refundDetail.pay_type == 'doumen_intl'">斗门国际</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.2fe741') }} </el-col>
          <el-col :span="20">
            <span v-if="refundDetail.refund_channel == 'offline'"
              >{{ $t('eb172bd4.46a9a9') }}
              <el-button
                v-if="refundDetail.refund_status == 'SUCCESS'"
                type="text"
                @click="handleAccountView"
                >{{ $t('eb172bd4.ee3e27') }}</el-button
              >
            </span>
            <span v-else-if="refundDetail.refund_channel == 'original'">{{
              $t('eb172bd4.eef322')
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.55bea7') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.refunds_memo }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.518b6a') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.refund_id }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.796c1b') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.27c36a') }} </el-col>
          <el-col :span="20">
            <span v-if="refundDetail.refund_success_time">{{
              refundDetail.refund_success_time | datetime('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </el-col>
        </el-row>
        <el-row v-if="refundDetail.refuse_reason">
          <el-col :span="3" class="col-3 content-right"> {{ $t('eb172bd4.0d41e2') }} </el-col>
          <el-col :span="20">
            {{ refundDetail.refuse_reason }}
          </el-col>
        </el-row>
      </div>

      <SpDialog
        ref="refundDialogRef"
        v-model="refundDialog"
        :title="`${$t('eb172bd4.d59116')}${refundForm.order_id}${$t('eb172bd4.5942e7')}`"
        :form="refundForm"
        :form-list="refundFormList"
        :is-show-footer="false"
      />
    </div>
  </SpPage>
</template>

<style scoped lang="scss" type="text/css">
h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 150px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}
img {
  max-width: 100px;
  margin: 0 auto;
}
.agreen-info {
  margin-top: 20px;
}
.agreen-right {
  line-height: 40px;
  text-align: right;
}
</style>
<script>
import {
  getRefundsDetail,
  reviewAftersales,
  refundCheck,
  sendConfirm
} from '../../../api/aftersales'
import { i18n } from '@/i18n'
import { formatMoneyWithSymbol, getCurrencySymbol } from '@/utils'
export default {
  data() {
    return {
      isOpenErp: false,
      refund_bn: '',
      refundDetail: {},
      refundDialog: false,
      refundForm: {
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        refund_account_name: '',
        refund_account_bank: '',
        refund_account_no: '',
        pay_type: '',
        order_id: '',
        refund_fee: ''
      },
      refundFormList: [
        {
          label: i18n.t('eb172bd4.4178e0'),
          key: 'pay_type',
          type: 'radio',
          required: true,
          options: [{ label: 'offline_pay', name: i18n.t('eb172bd4.2d8019') }]
        },
        {
          label: i18n.t('eb172bd4.84fc41'),
          key: 'bank_account_name',
          type: 'input',
          required: true,
          message: i18n.t('eb172bd4.2eb695')
        },
        {
          label: i18n.t('eb172bd4.27d6ee'),
          key: 'bank_account_no',
          type: 'input',
          required: true,
          message: i18n.t('eb172bd4.f9aa7d')
        },
        {
          label: i18n.t('eb172bd4.cc5ca0'),
          key: 'bank_name',
          type: 'input',
          required: true,
          message: i18n.t('eb172bd4.46222a')
        },
        {
          label: i18n.t('eb172bd4.4de280'),
          key: 'refund_account_name',
          type: 'input',
          required: true,
          message: i18n.t('eb172bd4.93e941')
        },
        {
          label: i18n.t('eb172bd4.abfe4d'),
          key: 'refund_account_bank',
          type: 'input',
          required: true,
          message: i18n.t('eb172bd4.d459b0')
        },
        {
          label: i18n.t('eb172bd4.4968ad'),
          key: 'refund_account_no',
          type: 'input',
          required: true,
          message: i18n.t('eb172bd4.fad689')
        },
        {
          label: i18n.t('eb172bd4.a0cd4c'),
          key: 'refund_fee',
          type: 'input',
          disabled: true
        }
      ]
    }
  },
  computed: {
    refundCurrencySymbol() {
      return getCurrencySymbol(this.refundDetail)
    }
  },
  mounted() {
    if (this.$route.query.refund_bn) {
      this.refund_bn = this.$route.query.refund_bn
    }
    this.loading = true
    this.refundsInfo()
  },
  methods: {
    formatMoneyWithSymbol,
    refundsInfo() {
      getRefundsDetail(this.refund_bn).then((response) => {
        let data = response.data.data
        this.refundDetail = data
        console.log(this.refundDetail, 'refundDetail======')
        this.loading = false
      })
    },
    handleCancel: function () {
      this.$router.back(-1)
    },
    async handleAccountView() {
      const { offline_refund, pay_type } = this.refundDetail
      this.refundForm = { ...offline_refund, pay_type }
      this.refundDialog = true
    }
  }
}
</script>
