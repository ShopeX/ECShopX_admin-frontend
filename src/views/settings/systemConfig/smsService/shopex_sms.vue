<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="shopex-sms-page">
      <div class="btn">
        <router-link v-if="!VERSION_SHUYUN()" class="link" to="/setting/datamessage">
          切换短信商
        </router-link>
      </div>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane v-if="!VERSION_SHUYUN()" label="短信账户" name="first">
          <el-alert
            type="warning"
            title="短信推送"
            show-icon
            description="短信推送即通过发送短信，给买家推送交易等提醒信息，包括付款、预约、核销等，以提升买家的到店体验，获得会员到店转化率和复购率。"
          />
          <div class="content-padded message-content">
            短信余额：<span class="message-count">{{ messageCount }}</span
            >条
            <a :href="sms_buy_url" target="_blank"
              ><el-button type="primary" size="mini">去充值</el-button></a
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="短信模板" name="second">
          <el-dialog
            title="短信模版详情"
            size="tiny"
            :visible.sync="detailDialog"
            :close-on-click-modal="false"
          >
            <div class="section-body">
              <SpFormPlus
                ref="detailForm"
                v-model="detailForm"
                :form-items="detailFormItems"
                form-type="form"
                label-width="100px"
                :show-default-actions="false"
              />
              <div class="section-footer with-border content-center" style="width: 100%">
                <el-button type="primary" @click="closeDialog"> 确定 </el-button>
              </div>
            </div>
          </el-dialog>
          <div class="message-template">
            <div v-for="(items, index) in smsTemlateList" :key="`message-template__${index}`">
              <div class="section-header with-border">
                <span v-if="index == 'promotions'">营销权益</span>
                <span v-if="index == 'member'">会员关怀</span>
                <span v-if="index == 'trade'">交易提醒</span>
                <span v-if="index == 'registration'">活动报名</span>
                <span v-if="index == 'merchant'">商户入驻</span>
                <span v-if="index == 'vcode'">验证码</span>
                <span v-if="index == 'adapay'">Adapay分账</span>
              </div>
              <div class="section-body">
                <div
                  v-for="(row, index) in items"
                  :key="`item__${index}`"
                  class="item"
                  :class="row.is_open == 'true' ? 'succ-open-sms' : 'not-open-sms'"
                  @click="toDetail(row)"
                >
                  <div class="item-title clearfix">
                    {{ row.send_time_desc.tmpl_title }} <i class="el-icon-arrow-right" />
                  </div>
                  <div class="item-content">
                    {{ row.content }}
                  </div>
                  <div class="item-footer">
                    <el-button v-if="row.is_open == 'true'" type="default" size="small">
                      启用中
                    </el-button>
                    <el-button v-else type="default" size="small"> 未启用 </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="短信签名" name="third">
          <div class="content-padded message-autograph">
            <SpFormPlus
              ref="signForm"
              v-model="signForm"
              :form-items="signFormItems"
              form-type="form"
              label-width="100px"
              :show-default-actions="false"
            />
            <el-button @click="editSmsSignAction">
              {{ messageAutographDis ? '编辑' : '取消' }}
            </el-button>
            <el-button v-if="!messageAutographDis" type="primary" @click="saveSmsSignAction">
              确定
            </el-button>
          </div>
          <div class="message-prompt">
            <div class="prompt-title">
              <span>常见问题：</span>
            </div>
            <div class="prompt-content">
              <div class="prompt-item">
                <div class="item-title">1. 签名设置规则</div>
                <div class="item-content">
                  <div>自定义签名字数限制为3-8个字，可以包含数字、英文；</div>
                  <div>建议使用你的『店铺名』或『品牌名』，使用其他签名可能短信审核不会通过！</div>
                  <div>短信签名不宜频繁修改，请谨慎设置；</div>
                  <div>若签名内容侵犯到第三方权益必须获得第三方真实授权；</div>
                  <div>
                    签名设置规范详见
                    <a
                      href="http://bbs.shopex.cn/forum.php?mod=viewthread&tid=4397&extra="
                      target="_blank"
                      >http://bbs.shopex.cn/forum.php?mod=viewthread&tid=4397&extra=</a
                    >
                  </div>
                </div>
              </div>
              <div class="prompt-item">
                <div class="item-title">2. 签名会出现在哪些短信中？</div>
                <div class="item-content">
                  <div>设置签名后，"消息推送"中列出的短信都会带上你的自定义签名，即：</div>
                  <div>交易物流提醒：订单成功、预约成功、核销；</div>
                  <div>营销关怀提醒：获得会员卡、会员卡升级；</div>
                </div>
              </div>
              <div class="prompt-item">
                <div class="item-title">3. 短信计价规则</div>
                <div class="item-content">
                  <div>单条70字，若超出70字需要分成多条时，将按照67字每条计算；</div>
                  <div>一个汉字、数字、字母、空格都算一字；</div>
                  <div>含有标签（如短信签名、商品名、链接）的短信以实际发送时字符数计算。</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        title="短信设置"
        :visible.sync="detailDialog2"
        :close-on-click-modal="false"
        class="message-dialog"
        width="75%"
      >
        <div class="section-body">
          <div class="message-tip">
            1.“通知类”短信无发送时间限制；“营销类”短信可发送时间为每天08:00-22:00，超出可发送时间提交的短信任务将在下一个可发送时间发送。<br />
            2.关于短信长度：<el-button type="text" @click="handleInquireVariable">
              变量预估长度 </el-button
            ><br />
            1）预估长度：是系统评估当前模板可能产生的计费条数和字数，可用于评估充值短信条数；预估长度=短信签名+退订文案+短信正文+变量预估长度。<br />
            2）预扣费长度：短信任务执行时，将替换已知变量后（品牌名称、活动名称、支付金额等），重新预估短信长度，完成预扣费并提交至运营商。<br />
            3）实际扣费：短信发送成功后，待运营商返回发送账单（一般为5个自然日，大促期间可能会有延迟），根据账单中的实际发送结果进行返款。<br />
            3.短信内容请输入汉字、英文、常用标点符号、数字。其他特殊字符在实际发送中会展示异常。<br />
            4.编辑“通知类”短信内容时，请慎重添加营销链接，可能会触发运营商拦截，导致短信发送失败。<br />
            5.应运营商要求，“通知类”短信不可添加退订文案；“营销类”必须添加退订文案。<br />
          </div>
          <div class="message-content">
            <div class="message-content-left">
              <SpFormPlus
                ref="templateForm"
                v-model="templateForm"
                :form-items="templateFormItems"
                form-type="form"
                label-width="100px"
                :show-default-actions="false"
              />
            </div>
            <div class="message-content-right">
              <div class="message-mobile">
                <div class="message-mobile-txt">
                  <div class="text-box">
                    【{{ messageAutograph }}】{{ templateForm.content || currentTemplate.content }}
                    <div v-if="currentTemplate.sms_type != 'notice'">拒收请回复R</div>
                  </div>
                </div>
              </div>
              <div class="message-mobile-tip">
                1、当前通道单条短信字数限制<span class="num">70</span>个字;超出70个字，均按<span
                  class="num"
                  >67</span
                >个字一条计费；
                2、上图仅为操作预览，变量无固定长度，最终字数和计费条数以实际执行时发送为准。
              </div>
            </div>
          </div>
          <div class="section-footer with-border content-center" style="width: 100%">
            <el-button type="primary" @click="closeDialog" :loading="loading"> 确定 </el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog title="短信设置" :visible.sync="inquireVariableVis" width="50%">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="name" label="短信变量" width="160" align="center" />
          <el-table-column prop="content" label="预估长度" align="center" />
        </el-table>
      </el-dialog>
    </div>
  </SpPage>
</template>
<script>
import {
  getSmsBasic,
  getSmsTemplateList,
  updateSmsTemplate,
  getSmsSign,
  saveSmsSign,
  testMessage
} from '../../../../api/promotions'
import { VERSION_STANDARD, VERSION_PLATFORM } from '@/utils'
export default {
  data() {
    return {
      detailDialog: false,
      detailDialog2: false,
      activeName: this.VERSION_SHUYUN() ? 'second' : 'first',
      messageCount: 0,
      smsTemlateList: {},
      messageAutograph: '',
      sms_buy_url: '',
      currentTemplate: {
        is_open: false,
        content: '',
        send_time_desc: {
          title: ''
        }
      },
      loading: false,
      messageAutographDis: true,
      testMobile: '',
      messgeLoading: false,
      inquireVariableVis: false,
      tableData: [
        { name: '支付时间', content: '19字符' },
        { name: '支付金额', content: '默认8字符，以实际发送为准' },
        { name: '活动名称', content: '默认30字符，以实际发送为准' },
        { name: '审核结果', content: '默认9字符，以实际发送为准' }
      ],
      detailForm: {
        is_open: false,
        send_time_desc_title: '',
        content: ''
      },
      signForm: {
        messageAutograph: ''
      },
      templateForm: {
        is_open: false,
        send_time_desc_title: '',
        tmpl_title: '',
        sms_type: '',
        content: '',
        messageAutograph: '',
        testMobile: ''
      }
    }
  },
  computed: {
    messageTxtNums() {
      let variablesNum = Object.values(this.currentTemplate.send_time_desc.variables || {}).reduce(
        (pre, item) => pre + item,
        0
      )
      console.log(789, this.currentTemplate.content, this.messageAutograph)
      return (
        this.currentTemplate.content.replace(/\{\{.*?\}\}/g, '').length +
        variablesNum +
        this.messageAutograph.length +
        4 +
        (this.currentTemplate.sms_type != 'notice' ? 6 : 0)
      )
    },
    detailFormItems() {
      const vm = this
      return [
        {
          fieldName: 'is_open',
          label: '是否开启',
          component: ({ value }) => {
            return vm.$createElement('el-switch', {
              props: {
                value: value,
                'active-value': 'true',
                'inactive-value': 'false',
                'active-color': '#13ce66',
                'active-text': ' ',
                'inactive-text': ' '
              },
              on: {
                change: (val) => {
                  vm.detailForm.is_open = val
                  vm.openChange(val)
                },
                input: (val) => {
                  vm.detailForm.is_open = val
                }
              }
            })
          }
        },
        {
          fieldName: 'send_time_desc_title',
          label: '发送时间点',
          component: ({ value }) => {
            return this.$createElement('div', {}, value || '')
          }
        },
        {
          fieldName: 'content',
          label: '短信内容',
          component: 'input',
          componentProps: {
            type: 'textarea',
            rows: 5,
            readonly: true,
            style: { width: '60%' }
          }
        }
      ]
    },
    signFormItems() {
      return [
        {
          fieldName: 'messageAutograph',
          label: '短信签名',
          component: 'input',
          componentProps: {
            placeholder: '请输入短信签名',
            disabled: this.messageAutographDis,
            style: { width: '240px', marginRight: '10px' }
          }
        }
      ]
    },
    templateFormItems() {
      const vm = this
      return [
        {
          fieldName: 'is_open',
          label: '是否开启：',
          component: 'switch',
          componentProps: {
            'active-value': 'true',
            'inactive-value': 'false',
            'active-color': '#13ce66',
            'active-text': ' ',
            'inactive-text': ' '
          }
        },
        {
          fieldName: 'send_time_desc_title',
          label: '发送触发点：',
          component: ({ value }) => {
            return vm.$createElement('div', {}, value || '')
          }
        },
        {
          fieldName: 'tmpl_title',
          label: '模板名称：',
          component: ({ value }) => {
            return vm.$createElement('div', {}, value || '')
          }
        },
        {
          fieldName: 'sms_type',
          label: '模板类型：',
          component: ({ value }) => {
            return vm.$createElement('div', {}, value == 'notice' ? '通知类' : '营销类')
          }
        },
        {
          fieldName: 'content',
          label: '短信内容：',
          component: 'input',
          componentProps: {
            type: 'textarea',
            rows: 5,
            style: { width: '100%' }
          },
          tip: () => {
            // 同步 content 到 currentTemplate 以便计算 messageTxtNums
            vm.currentTemplate.content = vm.templateForm.content
            return vm.$createElement('div', { class: 'content-tip' }, [
              vm.$createElement('i', { class: 'el-icon-warning' }),
              `短信预计${vm.messageTxtNums}个字符（${
                Object.keys(vm.currentTemplate.send_time_desc.variables || {}).length
              }个变量），将分为${
                vm.messageTxtNums > 70 ? Math.ceil(vm.messageTxtNums / 67) : 1
              }条短信，以实际发送为准（可能超过默认字段）`,
              vm.currentTemplate.sms_type != 'notice'
                ? vm.$createElement('div', { style: { marginTop: '10px' } }, [
                    vm.$createElement(
                      'el-checkbox',
                      {
                        props: {
                          value: true,
                          disabled: true
                        }
                      },
                      '拒收请回复R'
                    )
                  ])
                : null
            ])
          }
        },
        {
          fieldName: 'messageAutograph',
          label: '短信签名：',
          component: ({ value }) => {
            if (vm.messageAutograph) {
              return vm.$createElement('div', {}, vm.messageAutograph)
            } else {
              return vm.$createElement('div', {}, [
                vm.$createElement('span', { class: 'message-sign' }, '无法获取签名'),
                vm.$createElement(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: {
                      click: () => {
                        // 跳转到签名设置
                      }
                    }
                  },
                  '去设置'
                )
              ])
            }
          }
        },
        {
          fieldName: 'testMobile',
          label: '测试手机：',
          component: ({ value }) => {
            return vm.$createElement('el-row', { props: { gutter: 18 } }, [
              vm.$createElement('el-col', { props: { span: 16 } }, [
                vm.$createElement('el-input', {
                  props: {
                    value: vm.testMobile,
                    placeholder: "不同的测试手机以','隔开'"
                  },
                  on: {
                    input: (val) => {
                      vm.testMobile = val
                    }
                  }
                })
              ]),
              vm.$createElement('el-col', { props: { span: 4 } }, [
                vm.$createElement(
                  'el-button',
                  {
                    props: {
                      type: 'primary',
                      loading: vm.messgeLoading
                    },
                    on: {
                      click: vm.handleMessageTest
                    }
                  },
                  '测试发送'
                )
              ])
            ])
          }
        }
      ]
    }
  },
  watch: {
    'templateForm.content'(newVal) {
      if (this.detailDialog2) {
        this.currentTemplate.content = newVal
      }
    }
  },
  mounted() {
    if (this.VERSION_SHUYUN()) {
      this.activeName = 'second'
    }
    getSmsBasic().then((response) => {
      if (response.data.data.sms_remainder) {
        let sms_remainder = response.data.data.sms_remainder.info
        this.messageCount = sms_remainder.all_residual
      }
      this.sms_buy_url = response.data.data.sms_buy_url
    })
    getSmsTemplateList().then((res) => {
      const { list } = res.data.data
      const _list = {}
      Object.keys(list).forEach((key) => {
        if (VERSION_STANDARD()) {
          if (key != 'merchant') {
            _list[key] = list[key]
          }
        } else {
          _list[key] = list[key]
        }
      })
      this.smsTemlateList = _list
      console.log(this.smsTemlateList)
    })
    getSmsSign().then((res) => {
      this.messageAutograph = res.data.data.sign || ''
    })
  },
  methods: {
    closeDialog() {
      if (this.VERSION_SHUYUN()) {
        const { tmpl_name: template_name } = this.currentTemplate
        const { is_open, content } = this.templateForm
        let query = { template_name, is_open, content }
        this.loading = true
        updateSmsTemplate(query)
          .then((res) => {
            console.log(res)
            if (res.data.data.status) {
              this.currentTemplate.is_open = is_open
              this.currentTemplate.content = content
              this.detailDialog2 = false
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.detailDialog = false
      }
    },
    toDetail(params) {
      this.currentTemplate = params
      if (this.VERSION_SHUYUN()) {
        this.detailDialog2 = true
        this.templateForm = {
          is_open: params.is_open,
          send_time_desc_title: params.send_time_desc.title,
          tmpl_title: params.send_time_desc.tmpl_title,
          sms_type: params.sms_type,
          content: params.content,
          messageAutograph: this.messageAutograph,
          testMobile: this.testMobile
        }
      } else {
        this.detailDialog = true
        this.detailForm = {
          is_open: params.is_open,
          send_time_desc_title: params.send_time_desc.title,
          content: params.content
        }
      }
    },
    openChange(is_open) {
      this.detailForm.is_open = is_open
      let query = { template_name: this.currentTemplate.tmpl_name, is_open: is_open }
      updateSmsTemplate(query).then((res) => {
        console.log(res)
      })
    },
    handleMessageTest() {
      const { tmpl_name } = this.currentTemplate
      const content = this.templateForm.content || this.currentTemplate.content
      const data = {
        tmpl_name,
        mobile: this.testMobile,
        content
      }
      console.log('测试短信参数', data)
      this.messgeLoading = true
      testMessage(data)
        .then((res) => {
          console.log(res)
          if (res.data.data.status) {
            this.$message({
              type: 'success',
              message: '发送成功'
            })
          }
        })
        .finally(() => {
          this.messgeLoading = false
        })
    },
    saveSmsSignAction() {
      let query = { sign: this.signForm.messageAutograph }
      saveSmsSign(query).then((res) => {
        this.$message({
          type: 'success',
          message: '设置短信签名成功'
        })
        this.messageAutograph = this.signForm.messageAutograph
        this.messageAutographDis = true
      })
    },
    editSmsSignAction() {
      this.messageAutographDis = !this.messageAutographDis
    },
    handleInquireVariable() {
      this.inquireVariableVis = true
    }
  }
}
</script>
<style scoped type="text/css" lang="scss">
.shopex-sms-page {
  .btn {
    position: absolute;
    right: 100px;
    text-align: right;
    z-index: 999;
    .link {
      color: #999;
      font-size: 14px;
      line-height: 40px;
      &:hover {
        color: #1480e3;
      }
    }
  }
}

.el-tab-pane {
  min-height: 700px;
}
.message-content {
  button {
    margin-left: 20px;
  }
}
.message-count {
  margin: 0 5px 0 20px;
  font-size: 24px;
  color: #ff5000;
}
.message-template {
  .item {
    display: inline-block;
    width: 220px;
    margin: 0 10px 10px 0;
    border: 1px solid #dfdfdf;
    &-title {
      padding: 10px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      i {
        float: right;
        margin-top: 4px;
      }
    }
    &-content {
      height: 140px;
      padding: 20px 10px;
      color: #333;
      font-size: 12px;
    }
    &-footer {
      // border-top: 1px solid #dfdfdf;
      padding: 10px 0;
      text-align: center;
      button {
        width: 50%;
        &:hover {
          border: 1px solid #c4c4c4;
          color: #1f2d3d;
        }
      }
    }
    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    &.not-open-sms {
      .item-title {
        background-color: #ff4949;
      }
    }
    &.succ-open-sms {
      .item-title {
        background-color: #13ce66;
      }
    }
  }
}
.message-autograph {
  .el-input {
    width: 240px;
    margin-right: 10px;
  }
  span {
    margin: 0 10px;
  }
  button {
    width: 80px;
  }
}
.message-prompt {
  margin-top: 30px;
  padding-left: 20px;
  .prompt {
    &-title {
      margin-bottom: 10px;
      font-size: 18px;
      color: #333;
      span {
        border-left: 3px solid #20a0ff;
        padding-left: 10px;
      }
    }
    &-content {
      padding-left: 8px;
      line-height: 1.6;
      color: #666;
      .item-title {
        margin-bottom: 5px;
      }
      .item-content {
        padding-left: 14px;
        margin-bottom: 10px;
      }
    }
  }
}

.message-tip {
  width: 100%;
  background: #fcf6ed;
  padding: 16px;
  box-sizing: border-box;
}
.content-tip {
  color: #fa8c15;
  font-size: 14px;
  line-height: 18px;
  margin-top: 14px;
  .el-icon-warning {
    margin-right: 10px;
  }
}
.message-sign {
  color: #ec2e3d;
  font-size: 14px;
  margin-right: 8px;
}
.message-content {
  display: flex;
  &-left {
    flex: 1;
  }
  &-right {
    width: 350px;
    margin-left: 16px;
    padding-top: 30px;
    box-sizing: border-box;
    .message-mobile {
      padding: 70px 50px 0 35px;
      box-sizing: border-box;
      width: 100%;
      height: 420px;

      background: url('~@/assets/img/message-mobile.png') no-repeat;
      &-txt {
        width: 100%;
        padding: 12px 13px;
        box-sizing: border-box;
        background: #e6e6e6;
        border-radius: 16px 16px 16px 0;
        font-weight: 400;
        font-size: 14px;
        color: #262626;
        position: relative;
        .text-box {
          max-height: 220px;
          overflow: auto;
        }
      }
      &-txt::before {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-top: 10px solid transparent;
        border-right: 20px solid #e6e6e6;
        position: absolute;
        bottom: 0;
        left: -25px;
      }
      &-tip {
        background: #ebf2fb;
        border: 1px solid #cde0fa;
        padding: 16px;
        box-sizing: border-box;
        font-weight: 400;
        font-size: 13px;
        color: #262626;
        .num {
          color: #ec2e3d;
        }
      }
    }
  }
}
</style>
