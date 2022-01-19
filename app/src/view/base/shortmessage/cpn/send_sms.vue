<template>
    <div class="alisms_sendSms">
    <tips :title="tips"></tips>
  </div>
</template>

<script>
import tips from '@/components/tips'
export default {
    components:{
        tips
    },
    data(){
        return{
            tips:`<p>根据场景配置好短信，用户进入对应场景时即可触发系统发送对应给用户，支持短信验证码，订单通知，快递提醒等场景。</p>
            <p>· 一条完整的短信由「签名+模板」组成。</p>
            <p>· 每一个场景只能启用一条模板。</p>`
        }
    }
}
</script>

<style lang="scss" scoped>
.alisms_sendSms{
    
}
</style>