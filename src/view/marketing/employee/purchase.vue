<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.marketing-employee-purchase {
  .activity-name,
  .activity-title {
    max-width: 480px;
  }
  .link-home {
    margin-right: 4px;
  }
  .company-list {
    width: 480px;
    .el-input {
      max-width: 480px;
    }
    .el-select__tags {
      max-width: 100% !important;
    }
  }
  .el-range-separator {
    width: 30px;
  }
  .activity-pic-field {
    margin-top: 10px;
    .form-item-tip {
      margin-bottom: 4px;
    }
  }
  .company-list {
    .el-tag {
      margin-right: 8px;
    }
  }
  .preheat-time {
    .el-date-editor--datetime {
      margin: 0 8px;
    }
  }
  .activity-employee-field {
    .form-item-content {
      label {
        margin-right: 10px;
        white-space: nowrap;
      }
      &:not(:last-child) {
        margin-bottom: 6px;
      }
    }
    .form-item-tip {
      margin-left: 68px;
    }
    .content-item {
      display: flex;
      align-items: center;
    }
  }
  .activity-relatives-field {
    margin-top: 10px;
    .form-item-content {
      label {
        margin-right: 10px;
        white-space: nowrap;
      }
      &:not(:last-child) {
        margin-bottom: 6px;
      }
    }
    .form-item-tip {
      margin-left: 10px;
    }
    .content-item {
      display: flex;
    }
    .item-wrap {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      .el-radio {
        margin-right: 0;
      }
      .el-radio__label {
        color: #666;
      }
    }
  }
  .activity-limit-field {
    margin-top: 10px;
    .content-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      label {
        margin-right: 10px;
      }
      .sp-input {
        flex: 1;
      }
      .item-wrap {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
<template>
  <SpPage :title="$t('39e3acc2.34213d')">
    <template slot="page-footer">
      <ActionsButton
        class="text-center"
        :disabled="activityStatus == 'cancel' || activityStatus == 'over'"
        @save="onSubmitForm"
      />
    </template>
    <div class="marketing-employee-purchase">
      <el-card class="el-card--normal" :header="$t('39e3acc2.6ea1fe')">
        <SpForm
          ref="formBase"
          v-model="formBase"
          class="base-form"
          show-message
          :form-list="formBaseList"
          :submit="false"
        />
      </el-card>
      <el-card class="el-card--normal" :header="$t('39e3acc2.02a217')">
        <SpForm
          ref="activityRule"
          v-model="activityRule"
          class="base-form"
          show-message
          :form-list="activityRuleListComputed"
          :submit="false"
        />
      </el-card>
    </div>
  </SpPage>
</template>

<script>
import { isEmpty } from '@/utils'
import moment from 'moment'
import { i18n } from '@/i18n'

const ActionsButton = {
  name: 'ActionsButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCancel() {
      this.$router.go(-1)
    }
  },
  render() {
    return (
      <div>
        <el-button onClick={this.onCancel}>{this.$t('bea3f44a.625fb2')}</el-button>
        <el-button
          type='primary'
          disabled={this.disabled}
          onClick={() => {
            this.$emit('save')
          }}
        >
          {this.$t('d8d84692.be5fbb')}
        </el-button>
      </div>
    )
  }
}

export default {
  components: {
    ActionsButton
  },
  data() {
    return {
      formBase: {
        name: '',
        title: '',
        linkHome: null,
        share_pic: '',
        pic: ''
      },
      formBaseList: [],
      activityRule: {
        companyList: [],
        preheatTime: '',
        employee: {
          datetime: [],
          quota: ''
        },
        relatives: {
          join: false,
          num: '',
          datetime: [],
          type: '1',
          shareLimit: ''
        },
        orderMiniAmount: '',
        modifyReceiveAddress: '',
        items_page: ['sale_price', 'activity_price'],
        cart_page: ['sale_price', 'activity_price'],
        order_detail_page: ['sale_price', 'activity_price'],
        checkout_page: ['sale_price', 'activity_price'],
        is_discount_description_enabled: false,
        discount_description: ''
      },

      /** 活动规则表单项列表，在 created 中赋值避免 render 阶段访问 $i18n */
      activityRuleList: [],
      /** 编辑时活动规则表单项的 disabled 覆盖，key 为索引 */
      activityRuleDisabledOverrides: {},
      activityStatus: ''
    }
  },
  computed: {
    /** 活动规则列表合并 disabled 覆盖后传给表单 */
    activityRuleListComputed() {
      const list = this.activityRuleList
      const overrides = this.activityRuleDisabledOverrides
      if (!list.length || !Object.keys(overrides).length) return list
      const result = list.slice()
      Object.keys(overrides).forEach((i) => {
        const idx = parseInt(i, 10)
        if (result[idx]) result[idx] = { ...result[idx], disabled: overrides[i] }
      })
      return result
    }
  },
  created() {
    this.formBaseList = this.buildFormBaseList()
    this.activityRuleList = this.buildActivityRuleList()
    const { id } = this.$route.params
    if (id) {
      this.getActivityItemDetail(id)
    }
  },
  methods: {
    buildFormBaseList() {
      const self = this
      const t = (key) => i18n.t(key)
      return [
        {
          label: t('39e3acc2.39834b'),
          className: 'activity-name',
          key: 'name',
          type: 'input',
          required: true,
          maxlength: 30,
          disabled: false,
          placeholder: t('39e3acc2.5d602a'),
          message: t('39e3acc2.19e116')
        },
        {
          label: t('39e3acc2.902a3d'),
          className: 'activity-title',
          key: 'title',
          type: 'input',
          required: true,
          maxlength: 16,
          disabled: false,
          placeholder: t('39e3acc2.3154a4'),
          message: t('39e3acc2.f1529d'),
          tip: t('39e3acc2.198849')
        },
        {
          label: t('39e3acc2.c4750a'),
          key: 'linkHome',
          component: ({ disabled }) => (
            <div>
              <span class='link-home'>
                {self.formBase?.linkHome && self.formBase.linkHome.template_title}
              </span>
              <el-button type='text' disabled={disabled} on-click={self.onPickerTemp}>
                {t('39e3acc2.dc38dd')}
              </el-button>
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (!self.formBase.linkHome) {
              callback(new Error(t('39e3acc2.747456')))
            } else {
              callback()
            }
          }
        },
        {
          label: t('39e3acc2.45394d'),
          key: 'share_pic',
          component: () => (
            <div class='activity-pic-field'>
              <div class='form-item-tip'>{t('39e3acc2.5925d6')}</div>
              <SpImagePicker v-model={self.formBase.share_pic} />
            </div>
          ),
          validator: (rule, value, callback) => {
            if (isEmpty(self.formBase.share_pic)) {
              callback(new Error(t('39e3acc2.9742f1')))
            } else {
              callback()
            }
          }
        },
        {
          label: t('39e3acc2.98fbb0'),
          key: 'pic',
          component: () => <SpImagePicker v-model={self.formBase.pic} />,
          tip: t('39e3acc2.818403'),
          validator: (rule, value, callback) => {
            if (isEmpty(self.formBase.pic)) {
              callback(new Error(t('39e3acc2.90a4b4')))
            } else {
              callback()
            }
          }
        }
      ]
    },
    buildActivityRuleList() {
      const self = this
      const t = (key) => i18n.t(key)
      const activePriceList = [
        { name: t('39e3acc2.e29575'), label: 'sale_price', disabled: true },
        { name: t('39e3acc2.08ee55'), label: 'activity_price' }
      ]
      return [
        {
          label: t('39e3acc2.ef7726'),
          key: 'companyList',
          type: 'input',
          component: ({ disabled }) => (
            <div class='company-list'>
              {self.activityRule.companyList.map((item, index) => (
                <el-tag
                  closable
                  disable-transitions
                  key={item.id}
                  type={item.id}
                  on-close={self.closeCompany.bind(self, index)}
                >
                  {item.name}
                </el-tag>
              ))}
              <el-button type='text' disabled={disabled} on-click={self.onPickerCompany}>
                {t('39e3acc2.0067d7')}
              </el-button>
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (self.activityRule.companyList.length == 0) {
              callback(new Error(t('39e3acc2.6004b3')))
            } else {
              callback()
            }
          }
        },
        {
          label: t('39e3acc2.cdacb4'),
          key: 'preheatTime',
          component: ({ disabled }) => (
            <div class='preheat-time'>
              {t('39e3acc2.0cc05f')}
              <el-date-picker
                v-model={self.activityRule.preheatTime}
                disabled={disabled}
                type='datetime'
                placeholder={t('39e3acc2.a42ae4')}
              ></el-date-picker>
              {t('39e3acc2.dcc47f')}
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (self.activityRule.preheatTime.length == 0) {
              callback(new Error(t('39e3acc2.257e33')))
            } else {
              callback()
            }
          }
        },
        {
          label: t('39e3acc2.2ed392'),
          key: 'employee',
          component: ({ disabled: { datetime, quota } }) => (
            <div class='activity-employee-field'>
              <div class='form-item-content'>
                <div class='content-item'>
                  <label>{t('39e3acc2.059c1e')}</label>
                  <el-date-picker
                    v-model={self.activityRule.employee.datetime}
                    disabled={datetime}
                    type='daterange'
                    range-separator={t('bea3f44a.981cbe')}
                    start-placeholder={t('39e3acc2.592c59')}
                    end-placeholder={t('39e3acc2.f78277')}
                  />
                </div>
                <div class='form-item-tip'>{t('39e3acc2.f5552d')}</div>
              </div>
              <div class='form-item-content'>
                <div class='content-item'>
                  <label>{t('39e3acc2.769491')}</label>
                  <SpInput
                    v-model={self.activityRule.employee.quota}
                    width='120px'
                    disabled={quota}
                    placeholder={t('39e3acc2.ea6c91')}
                    prefix={t('39e3acc2.4ef1d6')}
                    suffix={t('39e3acc2.c16655')}
                  />
                </div>
              </div>
            </div>
          ),
          disabled: {
            datetime: false,
            quota: false
          },
          validator: (rule, value, callback) => {
            if (self.activityRule.employee.datetime.length == 0) {
              callback(new Error(t('39e3acc2.77a141')))
            } else if (!self.activityRule.employee.quota) {
              callback(new Error(t('39e3acc2.6a99d7')))
            } else {
              callback()
            }
          }
        },
        {
          label: t('39e3acc2.4eca5b'),
          key: 'relatives',
          component: ({ disabled: { join, num, datetime, type, shareLimit } }) => (
            <div class='activity-relatives-field'>
              <div class='form-item-content'>
                <div class='content-item'>
                  <el-switch v-model={self.activityRule.relatives.join} disabled={join} />
                  <span class='form-item-tip'>{t('39e3acc2.735d97')}</span>
                </div>
              </div>
              {self.activityRule.relatives.join ? (
                <div>
                  <div class='form-item-content'>
                    <div class='content-item'>
                      <label>{t('39e3acc2.ff47b7')}</label>
                      <SpInput
                        v-model={self.activityRule.relatives.num}
                        width='120px'
                        disabled={num}
                        placeholder={t('39e3acc2.ea6c91')}
                        prefix={t('39e3acc2.4a00d0')}
                        suffix={t('39e3acc2.cc2967')}
                      />
                    </div>
                  </div>
                  <div class='form-item-content'>
                    <div class='content-item'>
                      <label>{t('39e3acc2.059c1e')}</label>
                      <el-date-picker
                        v-model={self.activityRule.relatives.datetime}
                        disabled={datetime}
                        type='daterange'
                        range-separator={t('bea3f44a.981cbe')}
                        start-placeholder={t('39e3acc2.592c59')}
                        end-placeholder={t('39e3acc2.f78277')}
                      />
                    </div>
                  </div>
                  <div class='form-item-content'>
                    <div class='content-item'>
                      <label>{t('39e3acc2.769491')}</label>
                      <div class='content-item-field'>
                        <div class='item-wrap'>
                          <el-radio
                            v-model={self.activityRule.relatives.type}
                            disabled={type}
                            label='1'
                            onChange={self.onRadioChange}
                          >
                            <SpInput
                              v-model={self.activityRule.relatives.shareLimit}
                              width='120px'
                              disabled={shareLimit}
                              placeholder={t('39e3acc2.ea6c91')}
                              prefix={t('39e3acc2.4ef1d6')}
                              suffix={t('39e3acc2.c16655')}
                            />
                          </el-radio>
                        </div>
                        <div class='item-wrap'>
                          <el-radio
                            v-model={self.activityRule.relatives.type}
                            disabled={type}
                            label='2'
                            onChange={self.onRadioChange}
                          >
                            {t('39e3acc2.3fe064')}
                          </el-radio>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          ),
          disabled: {
            join: false,
            num: false,
            datetime: false,
            type: false,
            shareLimit: false
          },
          message: t('39e3acc2.19e116')
        },
        {
          label: t('39e3acc2.ac0065'),
          key: 'orderMiniAmount',
          component: ({ disabled }) => (
            <SpInput
              v-model={self.activityRule.orderMiniAmount}
              disabled={disabled}
              width='120px'
              placeholder={t('39e3acc2.ea6c91')}
              prefix={t('39e3acc2.f780a9')}
              suffix={t('39e3acc2.c16655')}
            />
          ),
          disabled: false
        },
        {
          label: t('39e3acc2.95c4a4'),
          key: 'modifyReceiveAddress',
          component: ({ disabled }) => (
            <SpInput
              v-model={self.activityRule.modifyReceiveAddress}
              disabled={disabled}
              width='140px'
              placeholder={t('39e3acc2.977246')}
              prefix={t('39e3acc2.0ccd13')}
              suffix={t('39e3acc2.297908')}
            />
          ),
          disabled: false,
          tip: t('39e3acc2.28831c')
        },
        {
          label: t('39e3acc2.135b19'),
          type: 'group'
        },
        {
          label: t('39e3acc2.040c4d'),
          key: 'items_page',
          type: 'checkbox',
          options: activePriceList
        },
        {
          label: t('39e3acc2.c017be'),
          key: 'cart_page',
          type: 'checkbox',
          options: activePriceList
        },
        {
          label: t('39e3acc2.482b55'),
          key: 'checkout_page',
          type: 'checkbox',
          options: activePriceList
        },
        {
          label: t('39e3acc2.028f5b'),
          key: 'is_discount_description_enabled',
          type: 'switch',
          tip: t('39e3acc2.8e568f')
        },
        {
          label: t('39e3acc2.d0bea4'),
          key: 'discount_description',
          type: 'input',
          maxlength: 50
        }
      ]
    },
    async getActivityItemDetail(id) {
      const res = await this.$api.marketing.getActivityItemDetail(id)
      const linkHome = await this.$api.template.getPagesTemplateDetail({
        pages_template_id: res.pages_template_id
      })
      this.formBase = {
        name: res.name,
        title: res.title,
        linkHome,
        share_pic: res.share_pic,
        pic: res.pic
      }

      // 进行中、已暂停
      if (res.status == 'ongoing' || res.status == 'pending') {
        this.$set(this.activityRuleDisabledOverrides, 2, {
          datetime: false,
          quota: true
        })
        this.$set(this.activityRuleDisabledOverrides, 3, {
          join: false,
          num: true,
          datetime: false,
          type: false,
          shareLimit: true
        })
      } else if (res.status == 'cancel' || res.status == 'over') {
        // 已取消、已结束
        this.formBaseList[0].disabled = true
        this.formBaseList[1].disabled = true
        this.formBaseList[2].disabled = true

        this.$set(this.activityRuleDisabledOverrides, 0, true)
        this.$set(this.activityRuleDisabledOverrides, 1, true)
        this.$set(this.activityRuleDisabledOverrides, 2, {
          datetime: true,
          quota: true
        })
        this.$set(this.activityRuleDisabledOverrides, 3, {
          join: true,
          num: true,
          datetime: true,
          type: true,
          shareLimit: true
        })
        this.$set(this.activityRuleDisabledOverrides, 4, true)
        this.$set(this.activityRuleDisabledOverrides, 5, true)
      }
      this.activityStatus = res.status

      const { list } = await this.$api.member.getPurchaseCompanyList({
        page: 1,
        pageSize: 100,
        enterprise_id: res.enterprise_id
      })

      // res.price_display_config = {"cart_page": {"sale_price": "true", "market_price": "false", "activity_price": "false"}, "items_page": {"sale_price": "true", "market_price": "true", "activity_price": "false"}, "checkout_page": {"sale_price": "true", "market_price": "false", "activity_price": "false"}, "order_detail_page": {"sale_price": "true", "market_price": "false", "activity_price": "true"}}
      //价格展示处理
      const priceData = this.priceShowData(res.price_display_config, 'detail')

      console.log('priceData', priceData)

      this.activityRule = {
        companyList: list,
        preheatTime: res.display_time * 1000,
        employee: {
          datetime: [res.employee_begin_time * 1000, res.employee_end_time * 1000],
          quota: res.employee_limitfee / 100
        },
        relatives: {
          join: res.if_relative_join == 1 ? true : false,
          num: res.invite_limit,
          datetime: [
            res.relative_begin_time ? res.relative_begin_time * 1000 : '',
            res.relative_end_time ? res.relative_end_time * 1000 : ''
          ],
          type: res.if_share_limitfee ? '2' : '1',
          shareLimit: res.relative_limitfee / 100
        },
        orderMiniAmount: res.minimum_amount / 100,
        modifyReceiveAddress: res.close_modify_hours_after_activity,
        ...priceData,
        is_discount_description_enabled: res.is_discount_description_enabled == 'true',
        discount_description: res.discount_description
      }
      this.onRadioChange(res.if_share_limitfee ? '2' : '1')
    },
    async onPickerTemp() {
      const { data } = await this.$picker.template({
        data: this.formBase.linkHome?.pages_template_id || [],
        multiple: false
      })
      this.formBase.linkHome = data ? data[0] : null
    },
    async onPickerCompany() {
      const ids = this.activityRule.companyList.map((item) => item.id)
      const params = {
        data: ids
      }
      if (this.IS_ADMIN()) {
        params.distributor_id = 0
      }
      const { data } = await this.$picker.company(params)
      this.activityRule.companyList = data
    },
    closeCompany(index) {
      this.activityRule.companyList.splice(index, 1)
    },
    priceShowData(form, isDetail) {
      //接口需要
      // cart_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // items_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // checkout_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // order_detail_page: {sale_price: "true", market_price: "false", activity_price: "false"}

      let keys = ['items_page', 'cart_page', 'order_detail_page', 'checkout_page']
      let prices = ['sale_price', 'market_price', 'activity_price']
      if (isDetail) {
        //编辑获取详情数据处理
        return keys.reduce((prev, cur) => {
          let _arr = []
          prices.forEach((item) => {
            _arr = Object.keys(form[cur]).filter((item2) => form[cur][item2] == 'true')
            console.log(Object.keys(form[cur]))
          })
          prev[cur] = _arr
          return prev
        }, {})
      }
      return keys.reduce((prev, cur) => {
        let _obj = {}
        prices.forEach((item) => {
          _obj[item] = form[cur].includes(item) + ''
        })
        prev[cur] = _obj
        return prev
      }, {})
    },
    async onSubmitForm() {
      await this.$refs['formBase'].handleSubmit()
      await this.$refs['activityRule'].handleSubmit()
      const {
        name,
        title,
        linkHome: { pages_template_id },
        share_pic,
        pic
      } = this.formBase
      const {
        companyList,
        preheatTime,
        employee: { datetime: employeeDateTime, quota },
        relatives: { join, num, datetime: relativesDateTime, type, shareLimit },
        orderMiniAmount,
        modifyReceiveAddress,
        is_discount_description_enabled,
        discount_description
      } = this.activityRule
      let params = {
        name,
        title,
        pages_template_id,
        share_pic: share_pic,
        pic: pic,
        enterprise_id: companyList.map((item) => item.id),
        display_time: moment(preheatTime).unix(),
        employee_begin_time: moment(employeeDateTime[0]).unix(),
        employee_end_time: moment(employeeDateTime[1]).unix(),
        employee_limitfee: quota * 100,
        if_relative_join: join ? 1 : 0,
        invite_limit: num,
        if_share_limitfee: type == '2',
        relative_limitfee: shareLimit * 100,
        minimum_amount: orderMiniAmount * 100,
        close_modify_hours_after_activity: modifyReceiveAddress,
        price_display_config: JSON.stringify(this.priceShowData(this.activityRule)),
        is_discount_description_enabled,
        discount_description
      }
      if (relativesDateTime[0]) {
        params = {
          ...params,
          relative_begin_time: moment(relativesDateTime[0]).unix()
        }
      }
      if (relativesDateTime[1]) {
        params = {
          ...params,
          relative_end_time: moment(relativesDateTime[1]).unix()
        }
      }
      const { id } = this.$route.params
      const resUrl = this.$route.path.split('create')[0] + 'result/'
      if (id) {
        await this.$api.marketing.updatePurchaseActivity(id, params)
        this.$router.replace({ path: resUrl + id })
      } else {
        const { id: _id } = await this.$api.marketing.createPurchaseActivity(params)
        this.$router.replace({ path: resUrl + _id })
      }
    },
    onRadioChange(e) {
      const prev = this.activityRuleDisabledOverrides[3] || {}
      if (e == '1') {
        this.$set(this.activityRuleDisabledOverrides, 3, { ...prev, shareLimit: false })
      } else {
        this.activityRule.relatives.shareLimit = 0
        this.$set(this.activityRuleDisabledOverrides, 3, { ...prev, shareLimit: true })
      }
    }
  }
}
</script>
