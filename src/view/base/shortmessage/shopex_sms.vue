<template>
  <div class="shopex-sms-page">
    <div class="btn">
      <router-link
        class="link"
        to="/setting/datamessage"
      >
        切换短信商
      </router-link>
    </div>
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        label="短信账户"
        name="first"
      >
        <el-alert
          type="warning"
          title="短信推送"
          show-icon
          description="短信推送即通过发送短信，给买家推送交易等提醒信息，包括付款、预约、核销等，以提升买家的到店体验，获得会员到店转化率和复购率。"
        />
        <div class="content-padded message-content">
          短信余额：<span class="message-count">{{ messageCount }}</span>条
          <a
            :href="sms_buy_url"
            target="_blank"
          ><el-button
            type="primary"
            size="mini"
          >去充值</el-button></a>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="短信模板"
        name="second"
      >
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
              <div
                class="section-footer with-border content-center"
                style="width: 100%"
              >
                <el-button
                  type="primary"
                  @click="closeDialog"
                >
                  确定
                </el-button>
              </div>
            </el-form>
          </div>
        </el-dialog>
        <div class="message-template">
          <div
            v-for="(items, index) in smsTemlateList"
            :key="`message-template__${index}`"
          >
            <div class="section-header with-border">
              <span v-if="index == 'promotions'">营销权益</span>
              <span v-if="index == 'member'">会员关怀</span>
              <span v-if="index == 'trade'">交易提醒</span>
              <span v-if="index == 'registration'">活动报名</span>
              <span v-if="index == 'merchant'">商户入驻</span>
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
                  <el-button
                    v-if="row.is_open == 'true'"
                    type="default"
                    size="small"
                  >
                    启用中
                  </el-button>
                  <el-button
                    v-else
                    type="default"
                    size="small"
                  >
                    未启用
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="短信签名"
        name="third"
      >
        <div class="content-padded message-autograph">
          短信签名：
          <el-input
            v-model="messageAutograph"
            placeholder="请输入短信签名"
          />
          <el-button
            type="primary"
            @click="saveSmsSignAction"
          >
            确定
          </el-button>
        </div>
        <div class="message-prompt">
          <div class="prompt-title">
            <span>常见问题：</span>
          </div>
          <div class="prompt-content">
            <div class="prompt-item">
              <div class="item-title">
                1. 签名设置规则
              </div>
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
                  >http://bbs.shopex.cn/forum.php?mod=viewthread&tid=4397&extra=</a>
                </div>
              </div>
            </div>
            <div class="prompt-item">
              <div class="item-title">
                2. 签名会出现在哪些短信中？
              </div>
              <div class="item-content">
                <div>设置签名后，"消息推送"中列出的短信都会带上你的自定义签名，即：</div>
                <div>交易物流提醒：订单成功、预约成功、核销；</div>
                <div>营销关怀提醒：获得会员卡、会员卡升级；</div>
              </div>
            </div>
            <div class="prompt-item">
              <div class="item-title">
                3. 短信计价规则
              </div>
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
  </div>
</template>
<script>
import {
  getSmsBasic,
  getSmsTemplateList,
  updateSmsTemplate,
  getSmsSign,
  saveSmsSign
} from '../../../api/promotions'
import { VERSION_STANDARD, VERSION_PLATFORM } from '@/utils'
export default {
  data () {
    return {
      detailDialog: false,
      activeName: 'first',
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
      }
    }
  },
  mounted () {
    getSmsBasic().then((response) => {
      if (response.data.data.sms_remainder) {
        let sms_remainder = response.data.data.sms_remainder.info
        this.messageCount = sms_remainder.all_residual
      }
      this.sms_buy_url = response.data.data.sms_buy_url
    })
    getSmsTemplateList().then((res) => {
      const { list } = res.data.data
      Object.keys(list).forEach((key) => {
        if (VERSION_STANDARD) {
          if (key != 'merchant') {
            this.smsTemlateList[key] = list[key]
          }
        } else {
          this.smsTemlateList[key] = list[key]
        }
      })
      console.log(this.smsTemlateList)
    })
    getSmsSign().then((res) => {
      this.messageAutograph = res.data.data.sign
    })
  },
  methods: {
    closeDialog () {
      this.detailDialog = false
    },
    toDetail (params) {
      this.detailDialog = true
      this.currentTemplate = params
    },
    openChange (is_open) {
      let query = { template_name: this.currentTemplate.tmpl_name, is_open: is_open }
      updateSmsTemplate(query).then((res) => {
        console.log(res)
      })
    },
    saveSmsSignAction () {
      let query = { sign: this.messageAutograph }
      saveSmsSign(query).then((res) => {
        this.$message({
          type: 'success',
          message: '设置短信签名成功'
        })
      })
    }
  }
}
</script>
<style scoped type="text/css" lang="scss">
.shopex-sms-page {
  .btn {
    position: absolute;
    right: 40px;
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
</style>
