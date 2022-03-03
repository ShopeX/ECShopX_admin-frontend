<template>
  <div>
    <div class="section section-white content-padded">
      <div class="clearfix">
        <div class="f_l member-card-box">
          <div
            class="member-card"
            :style="{
              backgroundColor: member.cardInfo.color,
              backgroundImage: 'url(' + (wximageurl + member.gradeInfo.background_pic_url) + ')',
              backgroundPosition: 'center center'
            }"
          >
            <img
              class="member-header"
              :src="member.wechatUserInfo.headimgurl"
              alt=""
            >
            <div class="mobile-txt">
              <span>{{ member.mobile }}</span><img
                v-if="member.sex == '1' || member.sex == '2'"
                :src="
                  member.sex == '1'
                    ? '@/assets/img/male_icon.png'
                    : member.sex == '2'
                      ? '@/assets/img/female_icon.png'
                      : ''
                "
                class="icon"
              >
            </div>
            <div
              v-if="member.vipgrade && member.vipgrade.is_vip"
              class="level-txt"
            >
              {{ member.vipgrade.grade_name }}
            </div>
            <div v-if="member.vipgrade && member.vipgrade.is_vip">
              截止{{ member.vipgrade.end_time }}到期
            </div>
            <div
              v-else
              class="level-txt"
            >
              {{ member.gradeInfo.grade_name }}
            </div>
          </div>
        </div>
        <div class="f_l member-info">
          <div class="info-item">
            <span class="txt">手机号</span>
            <span>{{ member.mobile }}</span>
          </div>
          <div class="info-item">
            <span class="txt">会员卡号</span>
            <span v-if="member.user_card_code">{{ member.user_card_code }}</span>
            <span v-else>--</span>
          </div>
          <div class="info-item">
            <span class="txt">出生日期</span>
            <span v-if="member.birthday">{{ member.birthday }}</span>
            <span v-else>--</span>
          </div>
          <div class="info-item">
            <span class="txt">所在城市</span>
            <span
              v-if="member.wechatUserInfo.country || member.wechatUserInfo.province"
            >{{ member.wechatUserInfo.country }}&nbsp;{{ member.wechatUserInfo.province }}</span>
            <span v-else>--</span>
          </div>
          <div class="info-item">
            <span class="txt">真实姓名</span>
            <span v-if="member.username">{{ member.username }}</span>
            <span v-else>--</span>
          </div>
          <div class="info-item">
            <span class="txt">微信昵称</span>
            <span v-if="member.wechatUserInfo.nickname">{{ member.wechatUserInfo.nickname }}</span>
            <span v-else>--</span>
          </div>
          <div class="info-item">
            <span class="txt">常用地址</span>
            <span v-if="member.address">{{ member.address }}</span>
            <span v-else>--</span>
          </div>
          <div class="info-item">
            <span class="txt">注册时间</span>
            <span v-if="member.created">{{
              member.created | datetime('YYYY-MM-DD HH:mm:ss')
            }}</span>
            <span v-else>--</span>
          </div>
        </div>
        <div class="f_r member-right">
          <div class="right-item point-box">
            <div class="item-title">
              积分
            </div>
            <div>
              <span v-if="member.point">{{ member.point }}</span><span v-else>0</span>
            </div>
            <span class="item-footer" />
          </div>
          <div class="right-item point-box">
            <div class="item-title">
              储值
            </div>
            <div>
              ¥<span v-if="member.deposit">{{ member.deposit / 100 }}</span><span v-else>0</span>
            </div>
            <span class="item-footer" />
          </div>
          <div class="right-item discount-box">
            <div class="item-title">
              折扣
            </div>
            <div>
              <span v-if="member.vipgrade && member.vipgrade.is_vip == true">{{
                (100 - member.vipgrade.discount) / 10
              }}</span>
              <span
                v-else-if="member.gradeInfo && member.gradeInfo.privileges.discount_desc != 0"
              >{{ member.gradeInfo.privileges.discount_desc }}</span>
              <span v-else>10</span>
              折
            </div>
          </div>
        </div>
      </div>
      <div class="content-center">
        <el-button
          type="primary"
          @click="goBack"
        >
          返回
        </el-button>
      </div>
    </div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="会员详情"
        name="info"
      >
        <member-info
          :user-info="member"
          :register-setting="registerSetting"
          :is-load="infoLoad"
        />
      </el-tab-pane>
      <el-tab-pane
        label="权益"
        name="right"
      >
        <quanyi-list
          :user-id="user_id"
          :user-mobile="member.mobile"
          :is-load="quanyiLoad"
        />
      </el-tab-pane>
      <el-tab-pane
        label="交易订单"
        name="order"
      >
        <order-list
          :user-id="user_id"
          :is-load="orderLoad"
        />
      </el-tab-pane>
      <el-tab-pane
        label="预存款交易"
        name="deposit"
      >
        <deposit-list
          :user-id="user_id"
          :is-load="depositLoad"
        />
      </el-tab-pane>
      <el-tab-pane
        label="权益转让"
        name="transfer"
      >
        <transfer-list
          :user-id="user_id"
          :user-mobile="member.mobile"
          :is-load="transferLoad"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="!isMicorMall"
        label="核销记录"
        name="rightslog"
      >
        <rightslog-list
          :user-id="user_id"
          :is-load="rightslogLoad"
        />
      </el-tab-pane>
      <el-tab-pane
        label="付费会员卡记录"
        name="membercard"
      >
        <membercard-list
          :user-id="user_id"
          :user-mobile="member.mobile"
          :is-load="membercardLoad"
        />
      </el-tab-pane>
      <el-tab-pane
        label="积分记录"
        name="point"
      >
        <point-list
          :user-id="user_id"
          :user-mobile="member.mobile"
          :is-load="pointLoad"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="!isMicorMall"
        label="导购员关系变更"
        name="salespersonlogs"
      >
        <salesperson-logs-list
          :user-id="user_id"
          :user-mobile="member.mobile"
          :is-load="salespersonLoad"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getMember } from '../../../api/member'
import { getMemberRegisterSetting } from '../../../api/member'
import quanyiList from './quanyilist.vue'
import orderList from './orderlist.vue'
import depositList from './depositlist.vue'
import transferList from './transferlist.vue'
import rightslogList from './rightsloglist.vue'
import membercardList from './membercardlist.vue'
import salespersonLogsList from './salespersonLogsList.vue'
import pointList from './pointlist.vue'
import memberInfo from './memberinfo.vue'
export default {
  components: {
    quanyiList,
    orderList,
    depositList,
    transferList,
    membercardList,
    rightslogList,
    pointList,
    salespersonLogsList,
    memberInfo
  },
  data () {
    return {
      user_id: 0,
      preMobile: '',
      orderRecords: '',
      grade_id: '',
      currentPage: 1,
      member: {
        user_id: '',
        company_id: '',
        grade_id: '',
        mobile: '',
        user_card_code: '',
        username: '',
        sex: 1,
        birthday: '',
        address: '',
        email: '',
        created: '',
        industry: '',
        income: '',
        habbit: [],
        cardInfo: {
          company_id: '1',
          brand_name: '',
          logo_url: '',
          title: '',
          color: '#ff5000',
          code_type: '',
          background_pic_url: ''
        },
        gradeInfo: {
          background_pic_url: '',
          company_id: '',
          default_grade: true,
          grade_name: '普通',
          privileges: {
            discount: '',
            discount_desc: ''
          }
        },
        wechatUserInfo: {
          company_id: '1',
          authorizer_appid: '',
          open_id: '',
          unionid: '',
          nickname: '',
          sex: 0,
          city: '',
          country: '',
          province: '',
          language: '',
          headimgurl: '',
          user_id: ''
        },
        deposit: 0
      },
      activeName: 'info',
      infoLoad: true,
      quanyiLoad: false,
      orderLoad: false,
      depositLoad: false,
      transferLoad: false,
      membercardLoad: false,
      rightslogLoad: false,
      pointLoad: false,
      salespersonLoad: false,
      registerSetting: ''
    }
  },
  computed: {
    ...mapGetters(['isMicorMall'])
  },
  mounted () {
    if (this.$route.query.resource && this.$route.query.resource == 'member') {
      this.activeName = 'order'
      this.orderLoad = true
      this.quanyiLoad = this.depositLoad = false
    } else {
      this.activeName = 'info'
      this.infoLoad = true
      this.quanyiLoad = this.orderLoad = this.depositLoad = false
    }
    if (this.$route.query.user_id) {
      this.user_id = this.$route.query.user_id
    }
    if (this.$route.query.mobile) {
      this.preMobile = this.$route.query.mobile
    }
    if (this.$route.query.grade_id) {
      this.grade_id = this.$route.query.grade_id
    }
    if (this.$route.query.orderRecords) {
      this.orderRecords = this.$route.query.orderRecords
    }
    if (this.$route.query.currentPage) {
      this.currentPage = this.$route.query.currentPage
    }
    this.getMember({ user_id: this.user_id })
    this.getRegisterSetting()
  },
  methods: {
    getMember (filter) {
      getMember(filter).then((response) => {
        this.member = response.data.data
      })
    },
    getRegisterSetting () {
      getMemberRegisterSetting().then((response) => {
        delete response.data.data.content_agreement
        this.registerSetting = response.data.data.setting
      })
    },
    handleClick () {
      switch (this.activeName) {
        case 'info':
          this.infoLoad = true
          this.salespersonLoad =
            this.quanyiLoad =
            this.pointLoad =
            this.rightslogLoad =
            this.transferLoad =
            this.membercardLoad =
            this.orderLoad =
            this.depositLoad =
              false
          break
        case 'right':
          this.quanyiLoad = true
          this.salespersonLoad =
            this.infoLoad =
            this.pointLoad =
            this.rightslogLoad =
            this.transferLoad =
            this.membercardLoad =
            this.orderLoad =
            this.depositLoad =
              false
          break
        case 'order':
          this.orderLoad = true
          this.salespersonLoad =
            this.infoLoad =
            this.pointLoad =
            this.rightslogLoad =
            this.transferLoad =
            this.membercardLoad =
            this.quanyiLoad =
            this.depositLoad =
              false
          break
        case 'deposit':
          this.depositLoad = true
          this.salespersonLoad =
            this.infoLoad =
            this.pointLoad =
            this.rightslogLoad =
            this.transferLoad =
            this.membercardLoad =
            this.quanyiLoad =
            this.orderLoad =
              false
          break
        case 'transfer':
          this.transferLoad = true
          this.salespersonLoad =
            this.infoLoad =
            this.pointLoad =
            this.rightslogLoad =
            this.depositLoad =
            this.orderLoad =
            this.membercardLoad =
            this.quanyiLoad =
              false
          break
        case 'membercard':
          this.membercardLoad = true
          this.salespersonLoad =
            this.infoLoad =
            this.pointLoad =
            this.rightslogLoad =
            this.transferLoad =
            this.depositLoad =
            this.orderLoad =
            this.quanyiLoad =
              false
          break
        case 'rightslog':
          this.rightslogLoad = true
          this.salespersonLoad =
            this.infoLoad =
            this.pointLoad =
            this.transferLoad =
            this.depositLoad =
            this.orderLoad =
            this.membercardLoad =
            this.quanyiLoad =
              false
          break
        case 'point':
          this.pointLoad = true
          this.salespersonLoad =
            this.infoLoad =
            this.rightslogLoad =
            this.transferLoad =
            this.depositLoad =
            this.orderLoad =
            this.membercardLoad =
            this.quanyiLoad =
              false
          break
        case 'salespersonlogs':
          this.salespersonLoad = true
          this.pointLoad =
            this.infoLoad =
            this.rightslogLoad =
            this.transferLoad =
            this.depositLoad =
            this.orderLoad =
            this.membercardLoad =
            this.quanyiLoad =
              false
          break
      }
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="scss">
.member-card-box {
  margin-right: 20px;
  .member-card {
    padding: 25px;
    width: 330px;
    height: 200px;
    border-radius: 5px;
    color: #fff;
    text-align: center;
    img.member-header {
      display: block;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      margin: 0 auto 10px;
      border: 2px solid #fff;
    }
    img.icon {
      width: 22px;
      height: 22px;
      vertical-align: bottom;
      margin-left: 5px;
    }
    .level-txt {
      display: inline-block;
      margin: 10px auto 0;
      background: #ff5000;
      color: #fff;
      padding: 2px 8px;
      border: 1px solid #fff;
      border-radius: 25px;
    }
  }
}
.member-info {
  .info-item {
    margin: 5px 0;
    .txt {
      display: inline-block;
      width: 80px;
    }
  }
}
.member-right {
  position: relative;
  text-align: center;
  top: -15px;
  margin-right: 5%;
  .right-item {
    position: relative;
    display: inline-block;
    text-align: center;
    width: 105px;
    color: #fff;
    margin: 0 5px;
    line-height: 2;
    padding: 50px 10px 60px;
    overflow: hidden;
    .item-title {
      font-size: 16px;
    }
    &::after {
      content: '';
      position: absolute;
      background: #fff;
      width: 120px;
      height: 80px;
      border-radius: 50%;
      left: 50%;
      bottom: -60px;
      transform: translateX(-50%);
    }
    &:nth-child(1) {
      background: #409eff;
    }
    &:nth-child(2) {
      background: #ff5000;
    }
    &:nth-child(3) {
      background: #7600ff;
    }
  }
}
</style>
