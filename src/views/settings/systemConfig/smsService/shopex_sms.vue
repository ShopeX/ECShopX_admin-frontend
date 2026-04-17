<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="shopex-sms-page">
      <div class="btn">
        <router-link v-if="!VERSION_SHUYUN()" class="link" to="/setting/datamessage">
          {{ $t('2bd394ad.75714b') }}
        </router-link>
      </div>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane v-if="!VERSION_SHUYUN()" :label="$t('2bd394ad.cf8df5')" name="first">
          <el-alert
            type="warning"
            :title="$t('2bd394ad.f5da95')"
            show-icon
            :description="$t('2bd394ad.96c1c9')"
          />
          <div class="content-padded message-content">
            {{ $t('2bd394ad.dd8957') }}<span class="message-count">{{ messageCount }}</span
            >{{ $t('2bd394ad.cc1bac') }}
            <a :href="sms_buy_url" target="_blank"
              ><el-button type="primary" size="mini">{{ $t('2bd394ad.e4ff95') }}</el-button></a
            >
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('2bd394ad.dbe8ba')" name="second">
          <el-dialog
            :title="$t('2bd394ad.d8a029')"
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
                <el-button type="primary" @click="closeDialog">
                  {{ $t('2bd394ad.38cf16') }}
                </el-button>
              </div>
            </div>
          </el-dialog>
          <div class="message-template">
            <div v-for="(items, index) in smsTemlateList" :key="`message-template__${index}`">
              <div class="section-header with-border">
                <span v-if="index == 'promotions'">{{ $t('2bd394ad.f9fdce') }}</span>
                <span v-if="index == 'member'">{{ $t('2bd394ad.21132b') }}</span>
                <span v-if="index == 'trade'">{{ $t('2bd394ad.e6c620') }}</span>
                <span v-if="index == 'registration'">{{ $t('2bd394ad.2bc045') }}</span>
                <span v-if="index == 'merchant'">{{ $t('2bd394ad.c31719') }}</span>
                <span v-if="index == 'vcode'">{{ $t('2bd394ad.983f59') }}</span>
                <span v-if="index == 'adapay'">{{ $t('2bd394ad.f4f827') }}</span>
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
                      {{ $t('2bd394ad.c16e2e') }}
                    </el-button>
                    <el-button v-else type="default" size="small">
                      {{ $t('2bd394ad.463776') }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('2bd394ad.f32c04')" name="third">
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
              {{ messageAutographDis ? $t('2bd394ad.95b351') : $t('2bd394ad.625fb2') }}
            </el-button>
            <el-button v-if="!messageAutographDis" type="primary" @click="saveSmsSignAction">
              {{ $t('2bd394ad.38cf16') }}
            </el-button>
          </div>
          <div class="message-prompt">
            <div class="prompt-title">
              <span>{{ $t('2bd394ad.39b713') }}</span>
            </div>
            <div class="prompt-content">
              <div class="prompt-item">
                <div class="item-title">{{ $t('2bd394ad.9d49dc') }}</div>
                <div class="item-content">
                  <div>{{ $t('2bd394ad.9670d8') }}</div>
                  <div>{{ $t('2bd394ad.79f120') }}</div>
                  <div>{{ $t('2bd394ad.584fbb') }}</div>
                  <div>{{ $t('2bd394ad.04743c') }}</div>
                  <div>
                    {{ $t('2bd394ad.102cc1') }}
                    <a
                      href="http://bbs.shopex.cn/forum.php?mod=viewthread&tid=4397&extra="
                      target="_blank"
                      >http://bbs.shopex.cn/forum.php?mod=viewthread&tid=4397&extra=</a
                    >
                  </div>
                </div>
              </div>
              <div class="prompt-item">
                <div class="item-title">{{ $t('2bd394ad.939dde') }}</div>
                <div class="item-content">
                  <div>{{ $t('2bd394ad.70b502') }}</div>
                  <div>{{ $t('2bd394ad.70fd67') }}</div>
                  <div>{{ $t('2bd394ad.571396') }}</div>
                </div>
              </div>
              <div class="prompt-item">
                <div class="item-title">{{ $t('2bd394ad.9e361f') }}</div>
                <div class="item-content">
                  <div>{{ $t('2bd394ad.afc03e') }}</div>
                  <div>{{ $t('2bd394ad.0d6151') }}</div>
                  <div>{{ $t('2bd394ad.84d8ae') }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        :title="$t('2bd394ad.dfb166')"
        :visible.sync="detailDialog2"
        :close-on-click-modal="false"
        class="message-dialog"
        width="75%"
      >
        <div class="section-body">
          <div class="message-tip">
            {{ $t('2bd394ad.357adc') }}<br />
            {{ $t('2bd394ad.8c4a87')
            }}<el-button type="text" @click="handleInquireVariable">
              {{ $t('2bd394ad.4513e2') }} </el-button
            ><br />
            {{ $t('2bd394ad.b08012') }}<br />
            {{ $t('2bd394ad.24021c') }}<br />
            {{ $t('2bd394ad.4bf9ae') }}<br />
            {{ $t('2bd394ad.1eeea8') }}<br />
            {{ $t('2bd394ad.8305ba') }}<br />
            {{ $t('2bd394ad.d0c481') }}<br />
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
                    <div v-if="currentTemplate.sms_type != 'notice'">
                      {{ $t('2bd394ad.f9fe08') }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="message-mobile-tip">
                {{ $t('2bd394ad.75d5a3') }}<span class="num">70</span>{{ $t('2bd394ad.45e55f')
                }}<span class="num">67</span>{{ $t('2bd394ad.14de50') }}
                {{ $t('2bd394ad.6220c9') }}
              </div>
            </div>
          </div>
          <div class="section-footer with-border content-center" style="width: 100%">
            <el-button type="primary" @click="closeDialog" :loading="loading">
              {{ $t('2bd394ad.38cf16') }}
            </el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog :title="$t('2bd394ad.dfb166')" :visible.sync="inquireVariableVis" width="50%">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="name" :label="$t('2bd394ad.d82b6a')" width="160" align="center" />
          <el-table-column prop="content" :label="$t('2bd394ad.4d6628')" align="center" />
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
      tableDataKeys: [
        { nameKey: '2bd394ad.05c5dc', contentKey: '2bd394ad.127e68' },
        { nameKey: '2bd394ad.f33297', contentKey: '2bd394ad.b0b4c2' },
        { nameKey: '2bd394ad.39834b', contentKey: '2bd394ad.707250' },
        { nameKey: '2bd394ad.8beefb', contentKey: '2bd394ad.43e30f' }
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
    tableData() {
      return this.tableDataKeys.map((row) => ({
        name: this.$t(row.nameKey),
        content: this.$t(row.contentKey)
      }))
    },
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
          label: this.$t('2bd394ad.780afe'),
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
          label: this.$t('2bd394ad.c325ef'),
          component: ({ value }) => {
            return this.$createElement('div', {}, value || '')
          }
        },
        {
          fieldName: 'content',
          label: this.$t('2bd394ad.4e963c'),
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
          label: this.$t('2bd394ad.f32c04'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('2bd394ad.3d620d'),
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
          label: this.$t('2bd394ad.9f0f3f'),
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
          label: this.$t('2bd394ad.556f8b'),
          component: ({ value }) => {
            return vm.$createElement('div', {}, value || '')
          }
        },
        {
          fieldName: 'tmpl_title',
          label: this.$t('2bd394ad.e1ea39'),
          component: ({ value }) => {
            return vm.$createElement('div', {}, value || '')
          }
        },
        {
          fieldName: 'sms_type',
          label: this.$t('2bd394ad.afbb18'),
          component: ({ value }) => {
            return vm.$createElement(
              'div',
              {},
              value == 'notice' ? vm.$t('2bd394ad.f77892') : vm.$t('2bd394ad.b3b9e7')
            )
          }
        },
        {
          fieldName: 'content',
          label: this.$t('2bd394ad.957f2c'),
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
              vm.$t('2bd394ad.b7392c') +
                vm.messageTxtNums +
                vm.$t('2bd394ad.27ad8f') +
                Object.keys(vm.currentTemplate.send_time_desc.variables || {}).length +
                vm.$t('2bd394ad.2e2244') +
                (vm.messageTxtNums > 70 ? Math.ceil(vm.messageTxtNums / 67) : 1) +
                vm.$t('2bd394ad.52d06f'),
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
                      vm.$t('2bd394ad.f9fe08')
                    )
                  ])
                : null
            ])
          }
        },
        {
          fieldName: 'messageAutograph',
          label: this.$t('2bd394ad.6446fc'),
          component: ({ value }) => {
            if (vm.messageAutograph) {
              return vm.$createElement('div', {}, vm.messageAutograph)
            } else {
              return vm.$createElement('div', {}, [
                vm.$createElement('span', { class: 'message-sign' }, vm.$t('2bd394ad.13981b')),
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
                  vm.$t('2bd394ad.241141')
                )
              ])
            }
          }
        },
        {
          fieldName: 'testMobile',
          label: this.$t('2bd394ad.c7410c'),
          component: ({ value }) => {
            return vm.$createElement('el-row', { props: { gutter: 18 } }, [
              vm.$createElement('el-col', { props: { span: 16 } }, [
                vm.$createElement('el-input', {
                  props: {
                    value: vm.testMobile,
                    placeholder: vm.$t('2bd394ad.95dd5b')
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
                  vm.$t('2bd394ad.e1c652')
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
              message: this.$t('2bd394ad.9db9a7')
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
          message: this.$t('2bd394ad.696dc2')
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
