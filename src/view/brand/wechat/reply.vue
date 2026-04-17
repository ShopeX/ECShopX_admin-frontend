<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane v-loading="loading" :label="$t('ff123105.f6119b')" name="subscribe">
      <el-alert
        :title="$t('ff123105.f6119b')"
        type="warning"
        :description="$t('ff123105.51e1d3')"
        show-icon
        :closable="false"
      />
      <el-form ref="form">
        <el-form-item>
          <MsgSender ref="subscribeMsg" v-model="subscribeData" :type="subscribeType" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit"> {{ $t('ff123105.be5fbb') }} </el-button>
          <el-button>{{ $t('ff123105.625fb2') }}</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane v-loading="loading" :label="$t('ff123105.98941e')" name="keyword">
      <el-alert
        :title="$t('ff123105.423f06')"
        type="warning"
        :description="$t('ff123105.547f6b')"
        show-icon
        :closable="false"
      />
      <div class="reply_add">
        <el-button type="primary" @click="addReplyAction">
          <i class="el-icon-plus" />{{ $t('ff123105.023c7d') }}
        </el-button>
      </div>

      <div class="reply_list">
        <div v-for="(item, index) in keywordReplyData" class="reply_item">
          <div class="keywords_rule_hd clearfix">
            <div class="info f_l">
              <span>{{ $t('ff123105.f5444d') }} {{ item.rule_name }}</span>
            </div>
            <div class="opr f_r">
              <a href="javascript:;" @click="itemchange(item, index)"
                ><i
                  :class="{
                    'el-icon-caret-top': item.isopen,
                    'el-icon-caret-bottom': !item.isopen
                  }"
              /></a>
            </div>
          </div>
          <div v-if="item.isopen" class="keyword_rule_detail">
            <div class="keywords">
              <div v-if="item.is_new">
                {{ $t('ff123105.b7a1e5') }}：<el-input
                  v-model="item.rule_name"
                  :maxlength="60"
                  style="width: 300px"
                />&nbsp;<span class="frm-tips">{{ item.rule_name.length }}/60</span>
              </div>
              <div v-else>{{ $t('ff123105.b7a1e5') }}：{{ item.rule_name }}</div>
            </div>
            <div class="keywords">
              <div>
                <el-button @click="addNewKeyword(item, index)">
                  {{ $t('ff123105.1c85b8') }} </el-button
                >&nbsp;
                <span class="frm-tips">{{ $t('ff123105.5677de') }}</span>
              </div>
              <div v-for="(rule, i) in item.keywords_rule" class="keywords_rule_item">
                {{ $t('ff123105.cfb5f1') }}{{ i }}：<el-input
                  v-model="rule.keyword"
                  :maxlength="30"
                  style="width: 300px"
                />&nbsp;<span class="frm-tips">{{ rule.keyword.length }}/30</span>
                <el-switch
                  v-model="rule.reply_mode"
                  :width="120"
                  active-value="equal"
                  inactive-value="contain"
                  inactive-color="#ccc"
                  :active-text="$t('ff123105.2120b4')"
                  :inactive-text="$t('ff123105.807eba')"
                  active-color="#ff5000"
                />
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('ff123105.77c811')"
                  placement="top"
                >
                  <i class="el-icon-delete2" @click="delNewKeyword(item, index, i)" />
                </el-tooltip>
              </div>
            </div>
            <div class="keywords_tap reply">
              <div class="keywords_tap_hd">
                <span>{{ $t('ff123105.1edff0') }}</span>
              </div>
              <div class="keywords_tap_bd">
                <MsgSender
                  :id="index"
                  ref="keywordsMsg"
                  v-model="item.reply_content"
                  :type="item.reply_type"
                />
              </div>
              <div class="keywords_rule_ft">
                <div class="opr tr">
                  <el-button type="primary" @click="onSubmitKeyword(item, index)">
                    {{ $t('ff123105.be5fbb') }}
                  </el-button>
                  <el-button @click="delAction(item, index)">
                    {{ $t('ff123105.2f4aad') }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!item.isopen" class="keywords_rule_bd keywords_rule_overview">
            <div class="keywords_info keywords clearfix">
              <span class="keywords_info_title f_l">{{ $t('ff123105.f5444d') }}</span>
              <div class="keywords_info_detail">
                <div v-for="keywordRule in item.keywords_rule">
                  <span v-if="keywordRule.keyword">{{ keywordRule.keyword }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane :label="$t('ff123105.0757ea')" name="kfreply">
      <el-alert
        :title="$t('ff123105.f08626')"
        type="warning"
        :description="$t('ff123105.d18025')"
        show-icon
        :closable="false"
      />
      <div v-loading="kfreplyload">
        <el-form ref="form">
          <el-form-item :label="$t('ff123105.29fc54')">
            <el-switch
              v-if="isRequest"
              v-model="isOpenKfReply"
              :active-text="$t('ff123105.cc42dd')"
              disabled
              :inactive-text="$t('ff123105.b15d91')"
              active-color="#ff5000"
              inactive-color="#ccc"
              @change="openKfReplyChange"
            />
            <el-switch
              v-else
              v-model="isOpenKfReply"
              :active-text="$t('ff123105.cc42dd')"
              :inactive-text="$t('ff123105.b15d91')"
              active-color="#ff5000"
              inactive-color="#ccc"
              @change="openKfReplyChange"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane v-loading="loading" :label="$t('ff123105.63483f')" name="autoreply">
      <el-alert
        :title="$t('ff123105.768533')"
        type="warning"
        :description="$t('ff123105.c27b88')"
        show-icon
        :closable="false"
      />
      <el-form ref="form">
        <el-form-item label="">
          <MsgSender ref="autoreplyMsg" v-model="autoreplyData" :type="autoreplyType" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit"> {{ $t('ff123105.be5fbb') }} </el-button>
          <el-button>{{ $t('ff123105.625fb2') }}</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import MsgSender from '../../../components/messagesender'
import {
  getOpenKfReply,
  setOpenKfReply,
  setSubscribeReply,
  getSubscribeReply,
  getDefaultReply,
  setDefaultReply,
  addKeywordReply,
  getKeywordReply,
  updateKeywordReply,
  deleteKeywordReply
} from '../../../api/wechat'
export default {
  components: {
    MsgSender
  },
  data() {
    return {
      loading: true,
      activeName: 'subscribe',
      isOpenKfReply: true,
      kfreplyload: false,
      kfreplyloddData: false,
      subscribeReplyloadData: false,
      keywordReplyloadData: false,
      isRequest: false,
      subscribeData: {
        content: ''
      },
      subscribeType: '',
      autoreplyData: '',
      autoreplyType: '',
      autoreplyloadData: '',
      keywordReplyData: [
        {
          rule_name: '',
          keywords_rule: [
            {
              keyword: '',
              reply_mode: 'equal'
            }
          ],
          reply_type: 'news',
          reply_content: '',
          isopen: true,
          is_new: true
        }
      ]
    }
  },
  mounted() {
    this.getSubscribeSetting()
  },
  methods: {
    handleClick() {
      // 切换到多客服回复配置
      this.loading = true
      if (this.activeName == 'kfreply' && !this.kfreplyloadData) {
        this.kfreplyload = true
        getOpenKfReply().then((response) => {
          this.isOpenKfReply = response.data.data.isOpenKfReply
          this.kfreplyloadData = true
          this.loading = false
        })
        this.kfreplyload = false
        // 切换到被关注自动回复
      } else if (this.activeName == 'kfreply' && this.kfreplyloadData) {
        this.loading = false
      }

      if (this.activeName == 'subscribe' && !this.subscribeReplyloadData) {
        this.getSubscribeSetting()
      } else if (this.activeName == 'subscribe' && this.subscribeReplyloadData) {
        this.loading = false
      }

      if (this.activeName == 'autoreply' && !this.autoreplyloadData) {
        getDefaultReply().then((response) => {
          this.autoreplyData = response.data.data.reply_content
          this.autoreplyType = response.data.data.reply_type
          this.autoreplyloadData = true
          this.loading = false
        })
      } else if (this.activeName == 'autoreply' && this.autoreplyloadData) {
        this.loading = false
      }

      if (this.activeName == 'keyword' && !this.keywordReplyloadData) {
        getKeywordReply().then((response) => {
          if (response.data.data.list.length > 0) {
            this.keywordReplyData = response.data.data.list
            this.keywordReplyloadData = true
          }
          this.loading = false
        })
      } else if (this.activeName == 'keyword' && this.keywordReplyloadData) {
        this.loading = false
      }
    },
    // 获取被关注自动回复配置
    getSubscribeSetting() {
      getSubscribeReply().then((response) => {
        this.subscribeData = response.data.data.reply_content
        this.subscribeType = response.data.data.reply_type
        this.subscribeReplyloadData = true
        this.loading = false
      })
    },
    getSubmitFromParams(data, type) {
      let params = {}
      if (type == 'news') {
        if (data.news) {
          params = { reply_type: type, reply_content: data.news.media_id }
        } else {
          params = { reply_type: type, reply_content: '' }
        }
      } else if (type == 'image') {
        params = { reply_type: type, reply_content: data.image }
      } else if (type == 'text') {
        params = { reply_type: type, reply_content: data.text }
      } else if (type == 'card') {
        params = { reply_type: type, reply_content: data.card }
      }
      return params
    },
    // 保存配置
    onSubmit() {
      let params = {}
      if (this.activeName == 'subscribe') {
        params = this.getSubmitFromParams(
          this.$refs.subscribeMsg.data,
          this.$refs.subscribeMsg.currentName
        )
        setSubscribeReply(params).then((response) => {
          this.messageSuccess()
        })
      } else if (this.activeName == 'autoreply') {
        params = this.getSubmitFromParams(
          this.$refs.autoreplyMsg.data,
          this.$refs.autoreplyMsg.currentName
        )
        setDefaultReply(params).then((response) => {
          this.messageSuccess()
        })
      }
    },
    onSubmitKeyword(item, index) {
      let params = {}
      for (let i = 0; i < this.$refs.keywordsMsg.length; i++) {
        if (this.$refs.keywordsMsg[i].$el.id == index) {
          var paramsOne = this.getSubmitFromParams(
            this.$refs.keywordsMsg[i].data,
            this.$refs.keywordsMsg[i].currentName
          )
        }
      }
      let paramsTwo = {
        rule_name: this.keywordReplyData[index].rule_name,
        keywords_rule: this.keywordReplyData[index].keywords_rule
      }
      params = Object.assign(paramsOne, paramsTwo)
      if (params.reply_content.length == 0) {
        this.$message({
          type: 'error',
          message: this.$t('ff123105.16d130')
        })
        return
      }
      if (this.keywordReplyData[index].is_new) {
        addKeywordReply(params).then((response) => {
          this.keywordReplyData[index].is_new = false
          this.messageSuccess()
        })
      } else {
        updateKeywordReply(params).then((response) => {
          this.messageSuccess()
        })
      }
    },
    messageSuccess() {
      this.$message({
        type: 'success',
        message: this.$t('ff123105.ae9a55')
      })
    },
    // 开启客服自动回复
    openKfReplyChange(isOpen) {
      if (!this.isRequest) {
        this.isRequest = true
        let query = { isOpenKfReply: isOpen }
        setOpenKfReply(query)
          .then((response) => {
            this.isOpenKfReply = isOpen
            this.$message({
              type: 'success',
              message: this.$t('ff123105.ae9a55')
            })
            this.isRequest = false
          })
          .catch((error) => {
            this.isRequest = false
          })
      }
    },
    addNewKeyword(item, index) {
      if (item.keywords_rule.length > 9) {
        this.$message({ type: 'error', message: this.$t('ff123105.81541c') })
        return
      }
      this.keywordReplyData[index].keywords_rule.push({ keyword: '', reply_mode: '' })
    },
    delNewKeyword(item, index, i) {
      this.keywordReplyData[index].keywords_rule.splice(i, 1)
    },
    addReplyAction() {
      this.keywordReplyData.push({
        rule_name: '',
        is_new: true,
        keywords_rule: [],
        reply_type: 'news',
        reply_content: '',
        isopen: true
      })
    },
    itemchange(item, index) {
      if (item.isopen) {
        this.keywordReplyData[index].isopen = false
      } else {
        this.keywordReplyData[index].isopen = true
      }
    },
    delAction(item, index) {
      this.$confirm(this.$t('ff123105.fed87e'), this.$t('ff123105.02d981'), {
        confirmButtonText: this.$t('ff123105.38cf16'),
        cancelButtonText: this.$t('ff123105.625fb2'),
        type: 'warning'
      })
        .then(() => {
          if (item.is_new) {
            this.keywordReplyData.splice(index, 1)
            if (this.keywordReplyData.length == 0) {
              this.addReplyAction()
            }
          } else {
            let params = { rule_name: item.rule_name }
            deleteKeywordReply(params).then((response) => {
              this.keywordReplyData.splice(index, 1)
              if (this.keywordReplyData.length == 0) {
                this.addReplyAction()
              }
              this.$message({
                type: 'success',
                message: this.$t('ff123105.0007d1')
              })
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('ff123105.2111cc')
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
.el-alert--warning {
  margin-bottom: 15px;
}
.reply_add {
  margin: 15px 0;
}
.reply_list {
  width: 700px;
  padding-bottom: 20px;
  .reply_item {
    border: 1px solid #e7e7eb;
    margin-bottom: 20px;
  }
}
.keywords_rule_hd {
  overflow: hidden;
  cursor: pointer;
  padding: 0 14px;
  background-color: #f4f5f9;
  border-top: 1px solid #e7e7eb;
  border-bottom: 1px solid #e7e7eb;
  line-height: 40px;
  a {
    color: #666;
  }
  i {
    cursor: pointer;
  }
}
.keywords {
  padding: 15px 14px;
}
.keywords_tap_hd,
.keywords_tap_bd {
  padding: 0 14px;
  line-height: 39px;
  border-top: 1px solid #e7e7eb;
}
.keywords_tap_bd {
  padding-top: 15px;
  padding-bottom: 15px;
}
.keywords_rule_ft {
  line-height: 50px;
  padding: 0 14px;
  background-color: #f4f5f9;
  border-top: 1px solid #e7e7eb;
}
.keywords_info {
  line-height: 28px;
}
.keywords_info_title {
  width: 75px;
  font-weight: 400;
  font-style: normal;
}
.keywords_info_detail {
  padding-left: 90px;
  span {
    display: inline-block;
    vertical-align: top;
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;
    margin-right: 10px;
    background-color: #e5e7ec;
    padding: 0 0.5em;
  }
}
.keywords_rule_item {
  margin: 15px 0;
  .item {
    font-size: 18px;
    color: #999;
    cursor: pointer;
    &:hover {
      color: #333;
    }
  }
}
</style>
