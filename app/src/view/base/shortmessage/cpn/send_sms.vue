<template>
  <div class="alisms_sendSms">
    <tips :title="tips"></tips>
    <section class="card" v-for="(item, index) in smsScenarioList"  :key="index" @click="tabClick(index)">
        <nav>
            <h4>短信场景：{{item.title}}</h4>
            <div class="type">短信类型：{{item.type}}</div>
            <div class="btn"> <el-button size='small'  type="primary">添加短信</el-button></div>
           
        </nav>
        <SpFinder
          ref="finder"
          :split-count="4"
          :search-row-count="2"
          :fixed-row-action="true"
          :setting="setting"
          noSelection
          url="/aliyunsms/scene/list"
          :hooks="{
            beforeSearch: beforeSearch,
            afterSearch: afterSearch
          }"
          :show-pager="false"
        >
        </SpFinder>
    </section>
  </div>
</template>

<script>
import tips from '@/components/tips'
import setting_ from '../finder-setting/send_sms'
export default {
  components: {
    tips
  },
computed: {
    setting() {
      return setting_(this)
    }
  },
  data() {
    return {
        tips: `<p>根据场景配置好短信，用户进入对应场景时即可触发系统发送对应给用户，支持短信验证码，订单通知，快递提醒等场景。</p>
            <p>· 一条完整的短信由「签名+模板」组成。</p>
            <p>· 每一个场景只能启用一条模板。</p>`,
        smsScenarioList:[
            {
                title:'手机号验证',
                type:'手机号验证',
                url:''
            }
        ]
    }
  },
  methods:{
    beforeSearch(params) {
      return { ...params }
    },
    afterSearch() {},
  }
}
</script>

<style lang="scss" scoped>
.alisms_sendSms {
    section{
        padding: 20px 30px;
        margin: 20px 3px 20px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        nav{
            display: flex;
            align-items: center;
             color: #000;
             font-size: 14px;
            h4{
                flex: 1;
                position: relative;
                 color: #000;

                &::before{
                    position: absolute;
                    width: 4px;
                    content:'' ;
                    background: #1480e3;
                    left: -8px;
                    top:4px;
                    bottom: 4px;

                }
            }
            .type{
                 flex: 1;
            }
            .btn{
                text-align: right;
                flex:3
            }
        }
    }
}
</style>