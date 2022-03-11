<template>
  <div class="footer">
    <div class="footer-container">
      <div class="copyright">
        <div>
          <h4 class="content-c2">
            Copyright ©2017, ＊＊＊＊＊＊, Ltd. All Rights Reserved.
          </h4>
          <ul class="privacy">
            <li class="content-c1">
              <a
                class="content-c0"
                @click="open1"
              >法律声明</a>
            </li>
            <li class="content-c1">
              <a
                class="content-c0"
                @click="open2"
              >隐私条款</a>
            </li>
          </ul>
        </div>
        <div>
          <span class="content-c3">＊＊＊＊＊＊号</span>
          <span class="content-c3">＊＊＊＊＊＊＊＊＊＊号</span>
        </div>
      </div>
      <ul class="c4">
        <div>
          <li class="tel">
            <a
              class="c5"
              target="_blank"
            >123456789</a>
          </li>
          <li class="time">
            周一至周日 10:00-23:00
          </li>
        </div>

        <li class="online">
          <!-- <y-button text="在线帮助" class="button" @btnClick="open3"></y-button> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import YButton from '/components/YButton'
export default {
  components: {
    // YButton
  },
  data () {
    return {}
  },
  methods: {
    open1 () {
      this.$notify.info({
        title: '法律声明',
        message: '＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊'
      })
    },
    open2 () {
      this.$notify.info({
        title: '隐私条款',
        message: '本网站将不会严格遵守有关法律法规和本隐私政策所载明的内容收集、使用您的信息'
      })
    },
    open3 () {
      this.$notify({
        title: '离线帮助',
        message: '没人会帮助你，请自己靠自己',
        type: 'warning'
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
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
    display: flex;
    justify-content: space-between;
  }
  .siteinfo {
    height: 100px;
    padding: 50px 0 130px;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
  }

  .c0 {
    width: 149px;
    line-height: 1;
    float: left;
  }

  .c1 {
    color: #646464;
    font-size: 12px;
    padding: 0 0 14px;
  }

  .c2 {
    color: #c3c3c3;
    font-size: 12px;
    padding: 6px 0;
  }

  .c3 {
    color: #969696;
  }

  .c4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      width: 180px;
    }
  }

  .tel {
    font-size: 30px;
    line-height: 1;
    color: #646464;
    top: -2px;
    display: flex;
    justify-content: flex-end;
  }

  .c5 {
    color: #646464;
  }

  .time {
    margin-top: 5px;
    right: 0px;
    position: relative;
    clear: both;
    width: 241px;
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

  .button {
    width: 130px;
    height: 34px;
    font-size: 14px;
    color: #5079d9;
    border: 1px solid #dcdcdc;
  }

  .copyright {
    color: #434d55;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .privacy {
    float: left;
    margin: 0 0 0 12px;
  }

  .content-c0 {
    color: #5079d9;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      color: #3a5fcd;
    }
  }

  .content-c1 {
    float: left;
    line-height: 12px;
    padding: 1px 10px 0;
    border-left: 1px solid #ccc;
  }

  .content-c2 {
    float: left;
    height: 15px;
    line-height: 15px;
    color: #757575;
  }
}
</style>
