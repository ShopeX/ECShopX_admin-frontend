<template>
  <div class="alisms_baseConfig">
    <tips :title="tips"></tips>
    <el-form label-width="200px" :model="form">
      <section class="card">
        <nav>
          <el-form-item label="启用:" label-width="60px">
            <el-switch
              v-model="value"
              active-color="#13ce66"
              inactive-color="#ff4949"
              style="margin-left: 40px; margin-right: 20px"
            ></el-switch>
            <span v-if="value">已启用</span>
            <span v-else>未启用</span>
          </el-form-item>
        </nav>
        <div class="content">
          <div class="title">基础配置</div>
          <div class="info">
            <div class="left">
              <el-form-item label="AccessKey ID：">
                <span>{{ form.ID }}</span>
              </el-form-item>
              <el-form-item label="AccessKey Secret：">
                <span>{{ form.Secret }}</span>
              </el-form-item>
              <a href="">如何获取 AccessKey ID 和 AccessKey Secret。</a>
            </div>
            <div class="right">
              <el-button type="primary" class="btn" plain>编辑</el-button>
            </div>
          </div>
        </div>
      </section>
      <section class="card" v-for="item in cardData" :key="item.title">
        <div class="content">
          <div class="title">{{ item.title }}</div>
          <div class="info">
            <div class="left">
              <el-form-item v-for="itemy in item.info" :key="itemy" :label="itemy">
                <span>{{ form.ID }}</span>
              </el-form-item>
            </div>
            <div class="right">
              <el-button type="primary" class="btn" plain>{{ item.btn }}</el-button>
            </div>
          </div>
        </div>
      </section>
    </el-form>
  </div>
</template>

<script>
import tips from '@/components/tips'
export default {
  components: {
    tips
  },
  data() {
    return {
      tips: "短信服务由阿里云提供，是广大企业客户快速触达手机用户所优选使用的通信能力，国内验证短信秒级触达，到达率最高可达99%。开始使用前您需要前往 <a href='https://www.aliyun.com/product/sms?spm=a2c4g.11186623.0.0.659712cdoHMKdV'>阿里云购买服务</a>。",
      value: true,
      form: {
        ID: '',
        Secret: ''
      },
      cardData: [
        {
          title: '自动发送短信',
          info: ['自动发送短信场景 (个)：'],
          btn: '管理短信'
        },
        {
          title: '短信签名',
          info: ['已有短信签名 (个)：'],
          btn: '管理签名'
        },
        {
          title: '短信模板',
          info: ['已有短信模板 (个)：'],
          btn: '管理模板'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.alisms_baseConfig {
  padding-bottom: 50px;
  .card {
    padding: 24px;
    margin: 20px 3px 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    // box-shadow:-5px 0px 0px #333;
    nav {
      margin-bottom: 20px;
    }
    .content {
      .title {
        position: relative;
        color: #000;
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 5px;
          left: -8px;
          top: 4px;
          bottom: 4px;
          background: #1480e3;
        }
      }
      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .right {
          .btn {
            margin-right: 50px;
            padding: 8px 30px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.alisms_baseConfig {
  .el-form-item__label {
    color: #000;
  }
  .el-form-item {
    margin-bottom: 4px;
  }
}
</style>
