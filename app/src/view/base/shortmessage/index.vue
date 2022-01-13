<template>
  <div class="smsAccountPage">
    <div class="smsBox" v-if="$route.path.indexOf('shopex_sms') === -1 && $route.path.indexOf('ali_sms') === -1">
        <section class="box-card" v-for="(item, index) in sms"  :key="item.title" @click="tabClick(index)">
          <img :src="item.img" alt="" />
          <span>{{ item.title }}</span>
        </section>
        
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
const ali = require('@/assets/img/aliNote/aliyun.png')
const shopex = require('@/assets/img/aliNote/shopex.png')

export default {
  data() {
    return {
      sms: [
        {
          title: '阿里云短信',
          img: ali
        },
        {
          title: '商派短信',
          img: shopex
        }
      ],
      path:this.$route.path
    }
  },
  mounted(){

  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.$router.push({
             path: this.matchHidePage('ali_sms')
          })
          break
        default:
          this.$router.push({
            path: this.matchHidePage('shopex_sms')
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scope>
.smsBox {
  .box-card {
    max-width: 240px;
    position: relative;
    cursor: pointer;
    margin-right: 20px;
    float: left;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    &:hover {
      box-shadow: 2px 2px 10px 4px rgb(0 0 0 / 10%);
    }
    img {
      display: block;
      width: 100%;
    }
    span {
      font-size: 16px;
      font-weight: 600;
      position: absolute;
      top: 50%;
      left: 22%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>