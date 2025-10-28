<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <el-container class="container">
    <router-view />
  </el-container>
</template>

<script>
export default {
  mounted() {
    const wheight = window.innerHeight
    const wwidth = window.innerWidth
    this.$store.dispatch('setHeight', wheight)
    this.$store.dispatch('setWidth', wwidth)
    window.onresize = () => {
      const height = window.innerHeight
      const width = window.innerWidth
      this.$store.dispatch('setHeight', height)
      this.$store.dispatch('setWidth', width)
    }
  }
}
</script>

<style lang="scss">
@import '../style/common';

.container {
  height: 100vh;
  .aside {
    position: relative;
    width: 250px !important;
    background-color: #fff;
    &::after {
      position: absolute;
      width: 1px;
      top: 0;
      right: 0;
      bottom: 0;
      content: '';
      background-color: #e6e6e6;
      z-index: 20;
    }
    &.no-sub {
      width: 125px !important;
    }
  }
  .header {
    display: flex;
    position: relative;
    align-items: center;
    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: #e6e6e6;
      content: '';
    }
    .icon-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      transition: all 0.3s ease;
      cursor: pointer;
      &:hover {
        background: #f8f8f8;
      }
      .iconfont {
        font-size: 18px;
        line-height: 1.2;
      }
    }
    .user-setting {
      padding-left: 10px;
      > span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
      }
      .user-avatar {
        margin-right: 0;
      }
      .iconfont {
        transition: all 0.3s ease;
        color: $dominant_hue;
        font-size: 28px;
        cursor: pointer;
      }
      &:hover {
        .iconfont {
          opacity: 0.7;
        }
      }
    }
  }
  .brand {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 125px;
    height: 100px;
    background: $auxiliary_hue;
    z-index: 10;
    img {
      width: auto;
      height: auto;
      max-width: 70%;
      max-height: 70%;
    }
  }
}
.user-avatar {
  width: 40px;
  height: 40px;
  font-size: 30px;
  margin-right: 5px;
  border-radius: 50%;
}
.logout-popper {
  padding: 0;
}

// 图文消息样式
.card_article_add {
  position: absolute;
  bottom: 0;
  padding: 10px;
  width: 100%;
  height: 72px;
  line-height: 48px;
  -ms-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
}
.card_article_add .icon_article_add {
  position: absolute;
  text-align: center;
  cursor: pointer;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  -ms-transition: top 0.5s;
  -webkit-transition: top 0.5s;
  transition: top 0.5s;
  border: 1px dashed #d9dadc;
}
.icon42_common {
  width: 42px;
  height: 42px;
  vertical-align: middle;
  display: inline-block;
  overflow: hidden;
  color: #ccc;
  font-size: 30px;
}
.icon42_common > i {
  margin-top: -10px;
}
.icon42_common.add_gray {
}
.card_article_box {
  width: 90%;
  padding: 0 0 72px;
  position: relative;
  border: 1px solid #d9dadc;
  background-color: #fff;
}
.card_article_box .card_article_img {
  margin: 10px;
  padding: 0;
  text-align: center;
  position: relative;
  z-index: 0;
  min-height: 60px;
  background-color: #f4f5f9;
}
.btn_card_image {
  position: absolute;
  top: 20%;
  left: 45%;
  z-index: 1000;
  width: 38px;
  height: 38px;
  vertical-align: middle;
  display: inline-block;
}
.btn_card_image > i {
  display: inline-block;
  width: 100%;
  height: 100%;
  line-height: 1;
  color: #ccc;
  font-size: 40px;
}
.card_article_box .card_article_description {
  margin: 10px;
  position: relative;
}
.frm_textarea_box {
  display: inline-block;
  width: 288px;
  padding: 4px 0 4px 10px;
  font-size: 14px;
  border: 1px solid #e7e7eb;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  background-color: #fff;
}
.frm_textarea_box.with_counter {
  position: relative;
  margin-bottom: 27px;
}
.frm_textarea {
  height: 100px;
  textarea {
    height: 100%;
  }
}
.card_article_box .card_article_description .frm_textarea_box {
  width: 100%;
  padding-bottom: 24px;
  -ms-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.card_article_box .card_article_description .frm_textarea_box .frm_textarea_append {
  position: absolute;
  right: 10px;
  bottom: 0;
}
.frm_textarea_box.with_counter .frm_counter {
  color: #8d8d8d;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
}
.card_article_box .ca_preview {
  width: auto;
  padding: 10px;
}
.card_article_opr {
  text-align: right;
  margin: 10px;
}
.ca_preview {
  width: 100%;
  height: auto;
  overflow: hidden;
  padding: 10px 0;
}
.ca_preview img {
  width: 100%;
  display: block;
}
.ca_preview .ca_preview_txt {
  background-color: #f6f6f8;
  padding: 10px;
  max-height: 6em;
  height: auto;
  overflow-y: auto;
}
</style>
