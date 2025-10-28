<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
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
              <el-form label-width="100px">
                <el-form-item label="是否开启">
                  <el-switch
                    v-model="currentTemplate.is_open"
                    active-text=" "
                    active-value="true"
                    inactive-text=" "
                    active-color="#13ce66"
                    @change="openChange"
                  />
                </el-form-item>
                <el-form-item label="发送时间点">
                  {{ currentTemplate.send_time_desc.title }}
                </el-form-item>
                <el-form-item label="短信内容">
                  <el-input
                    v-model="currentTemplate.content"
                    type="textarea"
                    :rows="5"
                    :readonly="true"
                    style="width: 60%"
                  />
                </el-form-item>
                <div class="section-footer with-border content-center" style="width: 100%">
                  <el-button type="primary" @click="closeDialog"> 确定 </el-button>
                </div>
              </el-form>
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
            短信签名：
            <el-input
              v-model="messageAutograph"
              :disabled="messageAutographDis"
              placeholder="请输入短信签名"
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
            1.“通知类”短信无发送时间限制；“营销类”短信可发送时间为每天08:00-22:00，超出可发送时间提交的短信任务将在下一个可发送时间发送。<br>
            2.关于短信长度：<el-button type="text" @click="handleInquireVariable">
              变量预估长度
</el-button
            ><br>
            1）预估长度：是系统评估当前模板可能产生的计费条数和字数，可用于评估充值短信条数；预估长度=短信签名+退订文案+短信正文+变量预估长度。<br>
            2）预扣费长度：短信任务执行时，将替换已知变量后（品牌名称、活动名称、支付金额等），重新预估短信长度，完成预扣费并提交至运营商。<br>
            3）实际扣费：短信发送成功后，待运营商返回发送账单（一般为5个自然日，大促期间可能会有延迟），根据账单中的实际发送结果进行返款。<br>
            3.短信内容请输入汉字、英文、常用标点符号、数字。其他特殊字符在实际发送中会展示异常。<br>
            4.编辑“通知类”短信内容时，请慎重添加营销链接，可能会触发运营商拦截，导致短信发送失败。<br>
            5.应运营商要求，“通知类”短信不可添加退订文案；“营销类”必须添加退订文案。<br>
          </div>
          <div class="message-content">
            <el-form label-width="100px" class="message-content-left">
              <el-form-item label="是否开启：">
                <el-switch
                  v-model="currentTemplate.is_open"
                  active-text=" "
                  active-value="true"
                  inactive-text=" "
                  active-color="#13ce66"
                />
              </el-form-item>
              <el-form-item label="发送触发点：">
                {{ currentTemplate.send_time_desc.title }}
              </el-form-item>
              <el-form-item label="模板名称：">
                {{ currentTemplate.send_time_desc.tmpl_title }}
              </el-form-item>
              <el-form-item label="模板类型：">
                {{ currentTemplate.sms_type == 'notice' ? '通知类' : '营销类' }}
              </el-form-item>
              <el-form-item label="短信内容：">
                <el-input
                  v-model="currentTemplate.content"
                  type="textarea"
                  :rows="5"
                  style="width: 100%"
                />
                <div class="content-tip">
                  <i class="el-icon-warning" />短信预计{{ messageTxtNums }}个字符（{{
                    Object.keys(currentTemplate.send_time_desc.variables || {}).length
                  }}个变量），将分为{{
                    messageTxtNums > 70 ? Math.ceil(messageTxtNums / 67) : 1
                  }}条短信，以实际发送为准（可能超过默认字段）
                </div>

                <el-checkbox
                  v-if="currentTemplate.sms_type != 'notice'"
                  :value="currentTemplate.sms_type != 'notice'"
                  disabled
                >
                  拒收请回复R
                </el-checkbox>
              </el-form-item>
              <el-form-item label="短信签名：">
                <template v-if="messageAutograph">{{ messageAutograph }}</template>
                <template v-else>
                  <span class="message-sign">无法获取签名</span>
                  <el-button type="text">去设置</el-button>
                </template>
              </el-form-item>
              <el-form-item label="测试手机：">
                <el-row :gutter="18">
                  <el-col :span="16">
                    <el-input v-model="testMobile" placeholder="不同的测试手机以','隔开'" />
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" :loading="messgeLoading" @click="handleMessageTest">
                      测试发送
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
            <div class="message-content-right">
              <div class="message-mobile">
                <div class="message-mobile-txt">
                  <div class="text-box">
                    【{{ messageAutograph }}】{{ currentTemplate.content }}
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
} from '../../../api/promotions'
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
      ]
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
    }
  },
  mounted() {
    if (this.VERSION_SHUYUN()) {
      this.activeName = 'second'
    }
    getSmsBasic().then(response => {
      if (response.data.data.sms_remainder) {
        let sms_remainder = response.data.data.sms_remainder.info
        this.messageCount = sms_remainder.all_residual
      }
      this.sms_buy_url = response.data.data.sms_buy_url
    })
    getSmsTemplateList().then(res => {
      const { list } = res.data.data
      const _list = {}
      Object.keys(list).forEach(key => {
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
    getSmsSign().then(res => {
      this.messageAutograph = res.data.data.sign || ''
    })
  },
  methods: {
    closeDialog() {
      if (this.VERSION_SHUYUN()) {
        const { tmpl_name: template_name, is_open, content } = this.currentTemplate
        let query = { template_name, is_open, content }
        this.loading = true
        updateSmsTemplate(query)
          .then(res => {
            console.log(res)
            if (res.data.data.status) {
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
      if (this.VERSION_SHUYUN()) {
        this.detailDialog2 = true
      } else {
        this.detailDialog = true
      }
      this.currentTemplate = params
    },
    openChange(is_open) {
      let query = { template_name: this.currentTemplate.tmpl_name, is_open: is_open }
      updateSmsTemplate(query).then(res => {
        console.log(res)
      })
    },
    handleMessageTest() {
      const { tmpl_name, content } = this.currentTemplate
      const data = {
        tmpl_name,
        mobile: this.testMobile,
        content
      }
      console.log('测试短信参数', data)
      this.messgeLoading = true
      testMessage(data)
        .then(res => {
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
      let query = { sign: this.messageAutograph }
      saveSmsSign(query).then(res => {
        this.$message({
          type: 'success',
          message: '设置短信签名成功'
        })
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

      background: url('../../../assets/img/message-mobile.png') no-repeat;
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
