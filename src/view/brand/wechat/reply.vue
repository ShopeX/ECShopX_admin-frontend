<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-loading="loading"
      label="被关注自动回复"
      name="subscribe"
    >
      <el-alert
        title="被关注自动回复"
        type="warning"
        description="当微信用户关注公众号时，自动发送当前配置消息给用户"
        show-icon
        :closable="false"
      />
      <el-form ref="form">
        <el-form-item>
          <MsgSender
            ref="subscribeMsg"
            v-model="subscribeData"
            :type="subscribeType"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane
      v-loading="loading"
      label="关键词自动回复"
      name="keyword"
    >
      <el-alert
        title="接收用户消息最先触发：关键词自动回复"
        type="warning"
        description="根据接收消息的关键词自动发送当前配置消息"
        show-icon
        :closable="false"
      />
      <div class="reply_add">
        <el-button
          type="primary"
          @click="addReplyAction"
        >
          <i class="el-icon-plus" />添加关键字规则
        </el-button>
      </div>

      <div class="reply_list">
        <div
          v-for="(item, index) in keywordReplyData"
          class="reply_item"
        >
          <div class="keywords_rule_hd clearfix">
            <div class="info f_l">
              <span>关键字规则: {{ item.rule_name }}</span>
            </div>
            <div class="opr f_r">
              <a
                href="javascript:;"
                @click="itemchange(item, index)"
              ><i
                :class="{
                  'el-icon-caret-top': item.isopen,
                  'el-icon-caret-bottom': !item.isopen
                }"
              /></a>
            </div>
          </div>
          <div
            v-if="item.isopen"
            class="keyword_rule_detail"
          >
            <div class="keywords">
              <div v-if="item.is_new">
                规则名：<el-input
                  v-model="item.rule_name"
                  :maxlength="60"
                  style="width: 300px"
                />&nbsp;<span class="frm-tips">{{ item.rule_name.length }}/60</span>
              </div>
              <div v-else>
                规则名：{{ item.rule_name }}
              </div>
            </div>
            <div class="keywords">
              <div>
                <el-button @click="addNewKeyword(item, index)">
                  新增关键字
                </el-button>&nbsp;
                <span class="frm-tips">开启则启用完全匹配，关闭则启用包含匹配模式</span>
              </div>
              <div
                v-for="(rule, i) in item.keywords_rule"
                class="keywords_rule_item"
              >
                关键字{{ i }}：<el-input
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
                  active-text="开启完全匹配"
                  inactive-text="开启包含匹配"
                  active-color="#ff5000"
                />
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除关键字"
                  placement="top"
                >
                  <i
                    class="el-icon-delete2"
                    @click="delNewKeyword(item, index, i)"
                  />
                </el-tooltip>
              </div>
            </div>
            <div class="keywords_tap reply">
              <div class="keywords_tap_hd">
                <span>回复</span>
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
                  <el-button
                    type="primary"
                    @click="onSubmitKeyword(item, index)"
                  >
                    保存
                  </el-button>
                  <el-button @click="delAction(item, index)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="!item.isopen"
            class="keywords_rule_bd keywords_rule_overview"
          >
            <div class="keywords_info keywords clearfix">
              <span class="keywords_info_title f_l">关键词：</span>
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
    <el-tab-pane
      label="开启多客服回复"
      name="kfreply"
    >
      <el-alert
        title="接收用户消息未触发关键词自动回复：开启多客服回复"
        type="warning"
        description="如果未触发关键字,如果开启多客服回复并且有客服在线，则客服回复消息"
        show-icon
        :closable="false"
      />
      <div v-loading="kfreplyload">
        <el-form ref="form">
          <el-form-item label="是否开启多客服回复">
            <el-switch
              v-if="isRequest"
              v-model="isOpenKfReply"
              active-text="开启"
              disabled
              inactive-text="关闭"
              active-color="#ff5000"
              inactive-color="#ccc"
              @change="openKfReplyChange"
            />
            <el-switch
              v-else
              v-model="isOpenKfReply"
              active-text="开启"
              inactive-text="关闭"
              active-color="#ff5000"
              inactive-color="#ccc"
              @change="openKfReplyChange"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane
      v-loading="loading"
      label="消息自动回复"
      name="autoreply"
    >
      <el-alert
        title="接收用户消息并且关键词和多客服都未触发：消息自动回复"
        type="warning"
        description="如果多客服回复未触发则自动回复当前配置消息"
        show-icon
        :closable="false"
      />
      <el-form ref="form">
        <el-form-item label="">
          <MsgSender
            ref="autoreplyMsg"
            v-model="autoreplyData"
            :type="autoreplyType"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
          <el-button>取消</el-button>
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
  data () {
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
  mounted () {
    this.getSubscribeSetting()
  },
  methods: {
    handleClick () {
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
    getSubscribeSetting () {
      getSubscribeReply().then((response) => {
        this.subscribeData = response.data.data.reply_content
        this.subscribeType = response.data.data.reply_type
        this.subscribeReplyloadData = true
        this.loading = false
      })
    },
    getSubmitFromParams (data, type) {
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
    onSubmit () {
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
    onSubmitKeyword (item, index) {
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
          message: '请填写回复内容'
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
    messageSuccess () {
      this.$message({
        type: 'success',
        message: '保存配置成功'
      })
    },
    // 开启客服自动回复
    openKfReplyChange (isOpen) {
      if (!this.isRequest) {
        this.isRequest = true
        let query = { isOpenKfReply: isOpen }
        setOpenKfReply(query)
          .then((response) => {
            this.isOpenKfReply = isOpen
            this.$message({
              type: 'success',
              message: '保存配置成功'
            })
            this.isRequest = false
          })
          .catch((error) => {
            this.isRequest = false
          })
      }
    },
    addNewKeyword (item, index) {
      if (item.keywords_rule.length > 9) {
        this.$message({ type: 'error', message: '最多添加10个关键字' })
        return
      }
      this.keywordReplyData[index].keywords_rule.push({ keyword: '', reply_mode: '' })
    },
    delNewKeyword (item, index, i) {
      this.keywordReplyData[index].keywords_rule.splice(i, 1)
    },
    addReplyAction () {
      this.keywordReplyData.push({
        rule_name: '',
        is_new: true,
        keywords_rule: [],
        reply_type: 'news',
        reply_content: '',
        isopen: true
      })
    },
    itemchange (item, index) {
      if (item.isopen) {
        this.keywordReplyData[index].isopen = false
      } else {
        this.keywordReplyData[index].isopen = true
      }
    },
    delAction (item, index) {
      this.$confirm('确定要删除该关键字规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
                message: '删除成功'
              })
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
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
