<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <div class="section-white content-padded app-box">
        <div class="section-header with-border">
          <h3>{{ $t('ee9b8b66.0ecb7b') }}</h3>
        </div>
        <div class="section-body">
          <ul class="app-list clearfix">
            <li>
              <div class="app-item">
                <router-link :to="{ path: '/application/masterofcoupon/index' }">
                  <div class="app-icon">
                    <i class="iconfont icon-calendar-alt" />
                  </div>
                  <div class="app-txt">{{ $t('ee9b8b66.26ad89') }}</div>
                </router-link>
              </div>
            </li>
            <li>
              <div class="app-item">
                <router-link :to="{ path: '/application/masterofcoupon/index' }">
                  <div class="app-icon">
                    <i class="icon icon-ticket-alt" />
                  </div>
                  <div class="app-txt">{{ $t('ee9b8b66.9c880c') }}</div>
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="section-white content-padded">{{ $t('ee9b8b66.2bd998') }}</div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.app {
  &-box {
    min-height: 700px;
  }
  &-list {
    li {
      float: left;
      margin: 0 15px 20px;
    }
    li:nth-child(1) {
      .app-icon {
        background-color: #9554ff;
      }
    }
    li:nth-child(2) {
      .app-icon {
        background-color: #ff4ab7;
      }
    }
  }
  &-item {
    text-align: center;
    a {
      display: inline-block;
      color: #333;
    }
  }
  &-icon {
    width: 108px;
    height: 108px;
    line-height: 108px;
    text-align: center;
    color: #fff;
    border-radius: 10px;
    cursor: pointer;
    i {
      font-size: 58px;
    }
    &:hover {
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
    }
  }

  &-txt {
    margin-top: 10px;
  }
}
</style>
