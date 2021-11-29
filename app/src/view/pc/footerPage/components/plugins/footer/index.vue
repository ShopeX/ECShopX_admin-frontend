<template>
  <div class="footer">
    <div class="footer-container">
      <div
        v-for="item in t_data"
        :style="{ textAlign: item.position, color: item.color, fontSize: item.fontsize + 'px' }"
      >
        <a v-if="item.url" :href="item.url" :style="{ color: item.color }" target="_blank">{{
          item.content
        }}</a>
        <span v-else>{{ item.content }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['info'],
  data() {
    return {
      t_data: this.info
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  padding: 40px 0;
  border-top: 1px solid #e6e6e6;
  background: #fafafa;
  // height: 150px;
  height: 100px;
  display: flex;
  justify-content: center;
  .footer-container {
    width: 80%;
  }
  .tel {
    font-size: 16px;
    line-height: 1;
    color: #646464;
    span {
      font-size: 24px;
    }
  }
  .time {
    margin-top: 5px;
    font-size: 12px;
    line-height: 18px;
    color: #c3c3c3;
    text-align: right;
  }
  .online {
    clear: both;
    width: 241px;
    font-size: 12px;
    line-height: 18px;
    color: #c3c3c3;
    text-align: right;
  }
  .copyright {
    color: #434d55;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .content-c2 {
    margin-bottom: 15px;
    height: 15px;
    line-height: 15px;
    color: #757575;
  }
  a {
  }
}
</style>
