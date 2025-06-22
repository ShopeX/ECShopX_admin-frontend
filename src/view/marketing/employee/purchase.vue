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
  <SpPage title="员工购买活动">
    <template slot="page-header">
      <div class="footer-container text-right">
      <el-button
        @click="
          () => {
            this.$router.go(-1)
          }
        "
      >
        取消
      </el-button>
      <el-button
        type="primary"
        :disabled="activityStatus == 'cancel' || activityStatus == 'over'"
        @click="onSubmitForm"
      >
        保存
      </el-button>
    </div>
    </template>
    <div class="marketing-employee-purchase">
      <el-card class="el-card--normal" header="基础信息">
        <SpForm
        ref="formBase"
        v-model="formBase"
        class="base-form"
        show-message
        :form-list="formBaseList"
        :submit="false"
      />
    </el-card>
    <el-card class="el-card--normal" header="活动规则">
      <SpForm
        ref="activityRule"
        v-model="activityRule"
        class="base-form"
        show-message
        :form-list="activityRuleList"
        :submit="false"
      />
    </el-card>
   
  </div>
  </SpPage>
</template>

<script>
import { isEmpty } from '@/utils'
import moment from 'moment'
export default {
  name: '',
  data() {

    const activePriceList = [
        { name: '销售价', label: 'sale_price',disabled:true },
        // { name: '市场价', label: 'market_price' },
        { name: '活动价', label: 'activity_price' }
      ]
    return {
      formBase: {
        name: '',
        title: '',
        linkHome: null,
        share_pic: '',
        pic: ''
      },
      formBaseList: [
        {
          label: '活动名称',
          className: 'activity-name',
          key: 'name',
          type: 'input',
          required: true,
          maxlength: 30,
          disabled: false,
          placeholder: '活动名称，管理活动用，不对消费者展示，最多30个字',
          message: '活动名称不能为空'
        },
        {
          label: '活动标题',
          className: 'activity-title',
          key: 'title',
          type: 'input',
          required: true,
          maxlength: 16,
          disabled: false,
          placeholder: '活动标题，再活动列表展示，最多16个字',
          message: '活动标题不能为空',
          tip: '活动标题在活动列表展示，也会作为分享小程序的卡片标题使用'
        },
        {
          label: '活动首页',
          key: 'linkHome',
          component: ({ disabled }) => (
            <div>
              <span class='link-home'>
                {this.formBase?.linkHome && this.formBase.linkHome.template_title}
              </span>
              <el-button type='text' disabled={disabled} on-click={this.onPickerTemp}>
                选择首页
              </el-button>
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (!this.formBase.linkHome) {
              callback(new Error('请选择活动首页'))
            } else {
              callback()
            }
          }
        },
        {
          label: '分享活动',
          key: 'share_pic',
          component: () => (
            <div class='activity-pic-field'>
              <div class='form-item-tip'>
                员工通过小程序卡片分享活动时展示，建议尺寸300*240，支持 png、jpg 格式，文件大小为 2M
                内
              </div>
              <SpImagePicker v-model={this.formBase.share_pic} />
            </div>
          ),
          validator: (rule, value, callback) => {
            if (isEmpty(this.formBase.share_pic)) {
              callback(new Error('请选择活动图片'))
            } else {
              callback()
            }
          }
        },
        {
          label: '活动海报',
          key: 'pic',
          component: () => <SpImagePicker v-model={this.formBase.pic} />,
          tip: '建议尺寸:（宽度640px，高度自适应）',
          validator: (rule, value, callback) => {
            if (isEmpty(this.formBase.pic)) {
              callback(new Error('请选择活动海报'))
            } else {
              callback()
            }
          }
        }
      ],
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
        items_page:['sale_price','activity_price'],
        cart_page:['sale_price','activity_price'],
        order_detail_page:['sale_price','activity_price'],
        checkout_page:['sale_price','activity_price'],
        is_discount_description_enabled:false,
        discount_description:''
      },

      activityRuleList: [
        {
          label: '参与企业',
          key: 'companyList',
          type: 'input',
          component: ({ disabled }) => (
            <div class='company-list'>
              {this.activityRule.companyList.map((item, index) => (
                <el-tag
                  closable
                  disable-transitions
                  key={item.id}
                  type={item.id}
                  on-close={this.closeCompany.bind(this, index)}
                >
                  {item.name}
                </el-tag>
              ))}
              <el-button type='text' disabled={disabled} on-click={this.onPickerCompany}>
                选择企业
              </el-button>
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (this.activityRule.companyList.length == 0) {
              callback(new Error('请选择参与企业'))
            } else {
              callback()
            }
          }
        },
        {
          label: '开始预热',
          key: 'preheatTime',
          component: ({ disabled }) => (
            <div class='preheat-time'>
              从
              <el-date-picker
                v-model={this.activityRule.preheatTime}
                disabled={disabled}
                type='datetime'
                placeholder='选择日期时间'
              ></el-date-picker>
              开始活动将展示在活动列表
            </div>
          ),
          disabled: false,
          validator: (rule, value, callback) => {
            if (this.activityRule.preheatTime.length == 0) {
              callback(new Error('请选择活动预热时间'))
            } else {
              callback()
            }
          }
        },
        {
          label: '员工',
          key: 'employee',
          component: ({ disabled: { datetime, quota } }) => (
            <div class='activity-employee-field'>
              <div class='form-item-content'>
                <div class='content-item'>
                  <label>购买时间</label>
                  <el-date-picker
                    v-model={this.activityRule.employee.datetime}
                    disabled={datetime}
                    type='daterange'
                    range-separator='至'
                    start-placeholder='开始时间'
                    end-placeholder='结束时间'
                  />
                </div>
                <div class='form-item-tip'>活动人员在该段内可购买商品</div>
              </div>
              <div class='form-item-content'>
                <div class='content-item'>
                  <label>购买额度</label>
                  <SpInput
                    v-model={this.activityRule.employee.quota}
                    width='120px'
                    disabled={quota}
                    placeholder='大于0的整数'
                    prefix='每人最多可购买额度'
                    suffix='元'
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
            if (this.activityRule.employee.datetime.length == 0) {
              callback(new Error('请选择活动购买时间'))
            } else if (!this.activityRule.employee.quota) {
              callback(new Error('请输入活动购买额度'))
            } else {
              callback()
            }
          }
        },
        {
          label: '亲友',
          key: 'relatives',
          component: ({ disabled: { join, num, datetime, type, shareLimit } }) => (
            <div class='activity-relatives-field'>
              <div class='form-item-content'>
                <div class='content-item'>
                  <el-switch v-model={this.activityRule.relatives.join} disabled={join} />
                  <span class='form-item-tip'>亲友参与活/亲友不参与活动</span>
                </div>
              </div>
              {
                this.activityRule.relatives.join ? (
                  <div>
                    <div class='form-item-content'>
                      <div class='content-item'>
                        <label>邀请亲友</label>
                        <SpInput
                          v-model={this.activityRule.relatives.num}
                          width='120px'
                          disabled={num}
                          placeholder='大于0的整数'
                          prefix='每名员工最多可邀请'
                          suffix='名亲友'
                        />
                      </div>
                    </div>
                    <div class='form-item-content'>
                      <div class='content-item'>
                        <label>购买时间</label>
                        <el-date-picker
                          v-model={this.activityRule.relatives.datetime}
                          disabled={datetime}
                          type='daterange'
                          range-separator='至'
                          start-placeholder='开始时间'
                          end-placeholder='结束时间'
                        />
                      </div>
                    </div>
                    <div class='form-item-content'>
                      <div class='content-item'>
                        <label>购买额度</label>
                        <div class='content-item-field'>
                          <div class='item-wrap'>
                            <el-radio
                              v-model={this.activityRule.relatives.type}
                              disabled={type}
                              label='1'
                              onChange={this.onRadioChange}
                            >
                              <SpInput
                                v-model={this.activityRule.relatives.shareLimit}
                                width='120px'
                                disabled={shareLimit}
                                placeholder='大于0的整数'
                                prefix='每人最多可购买额度'
                                suffix='元'
                              />
                            </el-radio>
                          </div>
                          <div class='item-wrap'>
                            <el-radio
                              v-model={this.activityRule.relatives.type}
                              disabled={type}
                              label='2'
                              onChange={this.onRadioChange}
                            >
                              共享员工额度
                            </el-radio>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ):''
              }
            </div>
          ),
          disabled: {
            join: false,
            num: false,
            datetime: false,
            type: false,
            shareLimit: false
          },
          message: '活动名称不能为空'
        },
        {
          label: '订单最低金额',
          key: 'orderMiniAmount',
          component: ({ disabled }) => (
            <SpInput
              v-model={this.activityRule.orderMiniAmount}
              disabled={disabled}
              width='120px'
              placeholder='大于0的整数'
              prefix='单笔订单不低于'
              suffix='元'
            />
          ),
          disabled: false
        },
        {
          label: '修改收货地址',
          key: 'modifyReceiveAddress',
          component: ({ disabled }) => (
            <SpInput
              v-model={this.activityRule.modifyReceiveAddress}
              disabled={disabled}
              width='140px'
              placeholder='大于等于0的整数'
              prefix='活动进行中所有买家（员工和亲友）都可以修改收货地址，活动结束后'
              suffix='小时内买家可修改收货地址，已发货订单不允许修改收货地址'
            />
          ),
          disabled: false,
          tip: '请输入大于等于0的整数，从活动结束时间开始开始计算，例如24代表活动结束后24个小时(1天)内买家都可以修改收货地址；活动进行过程中允许买家修改地址'
        },
        {
          label:'活动价格展示',
          type: 'group',
        },
        {
          label: '商品列表/商详页面',
          key: 'items_page',
          type: 'checkbox',
          options: activePriceList
        },
        {
          label: '购物车',
          key: 'cart_page',
          type: 'checkbox',
          options: activePriceList
        },
        // {
        //   label: '订单列表/订单详情',
        //   key: 'order_detail_page',
        //   type: 'checkbox',
        //   options: activePriceList
        // },
        {
          label: '结算页',
          key: 'checkout_page',
          type: 'checkbox',
          options: activePriceList
        },
        {
          label: '优惠说明',
          key: 'is_discount_description_enabled',
          type: 'switch',
          tip:'开启优惠说明展示在结算页，关闭不展示'
        },
        {
          label: '结算页价格优惠说明',
          key: 'discount_description',
          type: 'input',
          maxlength: 50,
        },

      ],
      activityStatus: ''
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      this.getActivityItemDetail(id)
    }
  },
  methods: {
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
        this.activityRuleList[2].disabled = {
          datetime: false,
          quota: true
        }
        this.activityRuleList[3]['disabled'] = {
          join: false,
          num: true,
          datetime: false,
          type: false,
          shareLimit: true
        }
      } else if (res.status == 'cancel' || res.status == 'over') {
        // 已取消、已结束
        this.formBaseList[0].disabled = true
        this.formBaseList[1].disabled = true
        this.formBaseList[2].disabled = true

        this.activityRuleList[0].disabled = true
        this.activityRuleList[1].disabled = true
        this.activityRuleList[2].disabled = {
          datetime: true,
          quota: true
        }
        this.activityRuleList[3]['disabled'] = {
          join: true,
          num: true,
          datetime: true,
          type: true,
          shareLimit: true
        }
        this.activityRuleList[4].disabled = true
        this.activityRuleList[5].disabled = true
      }
      this.activityStatus = res.status

      const { list } = await this.$api.member.getPurchaseCompanyList({
        page: 1,
        pageSize: 100,
        enterprise_id: res.enterprise_id
      })

      // res.price_display_config = {"cart_page": {"sale_price": "true", "market_price": "false", "activity_price": "false"}, "items_page": {"sale_price": "true", "market_price": "true", "activity_price": "false"}, "checkout_page": {"sale_price": "true", "market_price": "false", "activity_price": "false"}, "order_detail_page": {"sale_price": "true", "market_price": "false", "activity_price": "true"}}
      //价格展示处理
      const priceData = this.priceShowData(res.price_display_config,'detail')

      console.log('priceData',priceData)

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
        is_discount_description_enabled:res.is_discount_description_enabled == 'true',
        discount_description:res.discount_description

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
      if(this.IS_ADMIN()){
        params.distributor_id = 0
      }
      const { data } = await this.$picker.company(params)
      this.activityRule.companyList = data
    },
    closeCompany(index) {
      this.activityRule.companyList.splice(index, 1)
    },
    priceShowData(form,isDetail){
      //接口需要
      // cart_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // items_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // checkout_page: {sale_price: "true", market_price: "false", activity_price: "false"},
      // order_detail_page: {sale_price: "true", market_price: "false", activity_price: "false"}

      let keys= ['items_page','cart_page','order_detail_page','checkout_page']
      let prices = ['sale_price','market_price','activity_price']
      if(isDetail){
        //编辑获取详情数据处理
        return keys.reduce((prev,cur)=>{
          let _arr = []
          prices.forEach(item=>{
            _arr = Object.keys(form[cur]).filter(item2=>form[cur][item2] == 'true')
            console.log(Object.keys(form[cur]));

          })
          prev[cur] = _arr
          return prev
        },{})
      }
      return keys.reduce((prev,cur)=>{
        let _obj = {}
        prices.forEach(item=>{
          _obj[item] = form[cur].includes(item) + ''
        })
        prev[cur] = _obj
        return prev
      },{})
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
        this.$router.replace({ path: resUrl + id})

      } else {
        const { id: _id } = await this.$api.marketing.createPurchaseActivity(params)
        this.$router.replace({ path: resUrl + _id })
      }
    },
    onRadioChange(e) {
      if (e == '1') {
        this.activityRuleList[3]['disabled'] = {
          shareLimit: false
        }
      } else {
        this.activityRule.relatives.shareLimit = 0
        this.activityRuleList[3]['disabled'] = {
          shareLimit: true
        }
      }
    }
  }
}
</script>
