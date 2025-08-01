<template>
  <div>
    <div class="section section-white content-padded">
      <div class="clearfix">
        <div class="f_l member-info">
          <template v-for="(item, key) in setting">
            <div v-if="key == 'habbit'" :key="key" class="info-item">
              <span class="txt">{{ item.name }}</span>
              <span v-if="member.requestFields && member.requestFields.habbit">
                <span v-for="(row, index) in member.requestFields.habbit" :key="index">{{
                  row.ischecked ? row.name + ',' : ''
                }}</span>
              </span>
              <span v-else>--</span>
            </div>

            <div v-else-if="item.element_type === 'select'" :key="key" class="info-item">
              <span class="txt">{{ item.name }}</span>
              <span v-if="item.items[member[key]]">{{ item.items[member[key]] }}</span>
              <span v-else>--</span>
            </div>

            <div v-else :key="key" class="info-item">
              <span class="txt">{{ item.name }}</span>
              <span v-if="member[key]">{{ member[key] }}</span>
              <span v-else>--</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['userInfo', 'isLoad', 'registerSetting'],
  data() {
    return {
      setting: [],
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
      }
    }
  },
  watch: {
    registerSetting(newVal, oldVal) {
      console.log(newVal)
      if (this.isLoad) {
        this.setting = newVal
      }
    },
    userInfo(newVal, oldVal) {
      if (this.isLoad) {
        this.member = newVal
      }
    }
  },
  mounted() {
    this.member = this.userInfo
    this.setting = this.registerSetting
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.member-info {
  .info-item {
    margin: 5px 0;
    .txt {
      display: inline-block;
      width: 80px;
    }
  }
}
</style>
