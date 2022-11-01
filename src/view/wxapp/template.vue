<template>
  <div class="section content-padded">
    <!-- <div class="type-nav">
      <div class="nav">
        <div v-for="(item, index) in type" :class="currentType===index?'nav-item active':'nav-item'" @click="switchTab(index)"><i class="material-icons">{{item.icon}}</i> {{item.name}}</div>
      </div>
    </div> -->
    <el-row
      v-if="currentType === 0"
      :gutter="20"
    >
      <el-col
        v-for="item in templateList"
        :key="item.index"
        :xs="12"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <div class="template-item">
          <div class="template-wrap">
            <div class="template-img">
              <img
                v-if="item.template_name === 'yykmendian'"
                src="@/assets/img/template_img.jpg"
                alt=""
              >
              <img
                v-if="item.template_name === 'yykmembership'"
                src="@/assets/img/template_img_01.jpg"
                alt=""
              >
              <img
                v-if="item.template_name === 'yykcutdown'"
                src="@/assets/img/template_img_02.jpg"
                alt=""
              >
              <img
                v-if="item.template_name === 'yykweishop'"
                src="@/assets/img/template_img_04.jpg"
                alt=""
              >
              <img
                v-if="item.template_name === 'appleweishop'"
                src="@/assets/img/template_img_09.jpg"
                alt=""
              >
              <img
                v-if="item.template_name === 'yykcommunity'"
                src="@/assets/img/template_img_07.jpg"
                alt=""
              >
              <img
                v-if="item.template_name === 'yykcommunitypms'"
                src="@/assets/img/template_img_06.jpg"
                alt=""
              >
              <!-- <div class="template-theme">
                <div class="theme-item">
                  <div style="background: #ff7000"></div>
                  <div style="background: #fff"></div>
                </div>
                <div class="theme-item">
                  <div style="background: #ff7000"></div>
                  <div style="background: #3a3a39"></div>
                </div>
                <div class="theme-item" style="background: #fff"></div>
              </div>
              <div class="demo-qrcode">
                <img src="@/assets/img/code.png" height="34" width="35" alt="">
              </div> -->
            </div>
            <div class="template-caption">
              <div class="template-title">
                {{ item.name }}
              </div>
            </div>
            <div class="content-padded">
              <el-button
                v-if="item.is_open"
                type="default"
                disabled
                class="template-opend-btn"
              >
                已开通
              </el-button>
              <el-button
                v-else
                class="template-opend-btn"
                type="danger"
                @click="openTemp(item.template_name)"
              >
                免费开通
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row
      v-if="currentType === 1"
      :gutter="20"
    />
    <el-row
      v-if="currentType === 2"
      :gutter="20"
    />
  </div>
</template>

<script>
import { templateList, templateOpen } from '../../api/template'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      templateList: [],
      currentType: 0,
      type: [
        {
          name: '门店',
          icon: 'business'
        },
        {
          name: '商城',
          icon: 'shopping_cart'
        },
        {
          name: '营销',
          icon: 'payment'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted () {
    templateList().then((response) => {
      this.templateList = response.data.data.list
    })
  },
  methods: {
    switchTab (index) {
      this.currentType = +index
    },
    openTemp (name) {
      var filter = { template_name: name }
      templateOpen(filter).then((response) => {
        templateList().then((response) => {
          this.templateList = response.data.data.list
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.type-nav {
  text-align: center;
  padding: 20px 0 40px 0;
  .nav {
    display: inline-block;
    border: 3px solid #efefef;
    border-radius: 60px;
    .nav-item {
      padding: 0 60px;
      line-height: 68px;
      float: left;
      font-size: 16px;
      cursor: pointer;
      i {
        vertical-align: middle;
      }
      &.active {
        color: #ff7000;
      }
    }
  }
}
.template-item {
  position: relative;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.5s ease;
  background: #fff;
  &::after {
    display: flex;
    padding-top: 140%;
    content: '';
  }
  .template-wrap {
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  &:hover {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.4);
  }
  .template-img {
    position: relative;
    height: 60%;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .demo-qrcode {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 60px;
      height: 60px;
      left: 50%;
      top: 50%;
      transition: all 0.3s ease;
      transform: translate(-50%, -50%) scale(1);
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      z-index: 30;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        transform: translate(-50%, -50%) scale(1.1);
      }
      img {
        display: block;
        width: 70%;
        height: 70%;
      }
    }
  }
  .template-title {
    font-size: 16px;
    text-align: center;
  }
  .template-theme {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 15px;
    z-index: 20;
    .theme-item {
      display: flex;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      margin: 0 5px;
      box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
      vertical-align: middle;
      & > div {
        flex: 1;
        height: 24px;
        &:first-child {
          border-radius: 24px 0 0 24px;
        }
        &:last-child {
          border-radius: 0 24px 24px 0;
        }
      }
    }
  }
  .template-caption {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 15px;
  }
  .template-app {
    display: flex;
    padding-left: 10px;
    .app {
      color: #999;
      margin-right: 5px;
      i {
        display: block;
        font-size: 28px;
      }
    }
  }
  .template-status {
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      color: #ff5000;
      display: block;
      font-size: 92px;
    }
  }
  .template-keywords {
    position: relative;
    padding-top: 5px;
    padding-left: 10px;
    color: #ccc;
    .tag {
      display: inline-block;
      font-size: 13px;
      color: #333;
      margin-right: 5px;
    }
  }
  .template-opend-btn {
    width: 100%;
  }
}
</style>
