<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row class="section-white content-padded coupon-header">
      <el-col :span="6" class="coupon-img">
        <img src="@/assets/img/webchat.png" :alt="$t('88683ec4.20def7')" />
      </el-col>
      <el-col :span="18" class="coupon-desc">
        <h3>
          {{ $t('88683ec4.9c880c') }}<span>{{ $t('88683ec4.823e89') }}</span>
        </h3>
        <p>
          <span class="coupon-desc-content" :class="isHidden ? 'content-hidden' : ''">{{
            $t('88683ec4.638ca1')
          }}</span
          ><span v-if="isHidden" class="more" @click="showAll"
            >{{ $t('88683ec4.0ec9ea') }}<i class="el-icon-arrow-down" /></span
          ><span v-if="!isHidden" class="more" @click="contentHidden"
            >{{ $t('88683ec4.def9e9') }}<i class="el-icon-arrow-up"
          /></span>
        </p>
        <div class="coupon-opr">
          <el-button type="primary" size="small"> {{ $t('88683ec4.7b2567') }} </el-button>
          <el-button size="small"> {{ $t('88683ec4.f7e26a') }} </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="section-white coupon-body content-padded">
      <div class="scene-box">
        <div class="section-header with-border">
          <h3>{{ $t('88683ec4.3de9d8') }}</h3>
        </div>
        <div class="section-body">
          <div class="scene-item">{{ $t('88683ec4.1408f7') }}</div>
          <div class="scene-item">
            {{ $t('88683ec4.4fee81') }}
          </div>
        </div>
      </div>
      <div class="scene-box new-function-box">
        <div class="section-header with-border">
          <h3 class="clearfix">
            {{ $t('88683ec4.203fb8') }}
            <span v-if="functionOpen" class="f_r open" @click="open"
              >{{ $t('88683ec4.e2edde') }}<i class="el-icon-arrow-down" /></span
            ><span v-if="!functionOpen" class="f_r open" @click="close"
              >{{ $t('88683ec4.def9e9') }}<i class="el-icon-arrow-up"
            /></span>
          </h3>
        </div>
        <div class="section-body">
          <div class="scene-item">{{ $t('88683ec4.f4663a') }}</div>
          <div class="scene-item">{{ $t('88683ec4.f4663a') }}</div>
        </div>
      </div>
      <div class="app-exhibition-box">
        <div class="section-header with-border">
          <h3>{{ $t('88683ec4.9ac427') }}</h3>
        </div>
        <div class="section-body">
          <el-carousel :interval="4000" type="card" height="400px" width="800px">
            <el-carousel-item v-for="item in 6" :key="item">
              <h3 />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHidden: true,
      functionOpen: true
    }
  },
  methods: {
    showAll() {
      this.isHidden = false
    },
    contentHidden() {
      this.isHidden = true
    },
    open() {
      this.functionOpen = false
    },
    close() {
      this.functionOpen = true
    }
  }
}
</script>

<style scoped lang="scss">
.coupon {
  &-header {
    margin-bottom: 20px;
  }
  &-img {
    margin-right: 10px;
    width: 120px;
    img {
      width: 120px;
    }
  }
  &-desc {
    color: #333;
    h3 {
      font-size: 16px;
      color: #333;
      span {
        color: #ff5000;
        margin-left: 5px;
      }
    }
    p {
      max-width: 80%;
      .more {
        margin-left: 15px;
        color: #53c7db;
        cursor: pointer;
        font-size: 12px;
        i {
          font-size: 20px;
        }
      }
    }
    &-content {
      vertical-align: middle;
      &.content-hidden {
        display: inline-block;
        max-width: 85%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  &-opr {
    margin-top: 10px;
  }
}
.scene {
  &-box {
    margin-bottom: 20px;
  }
  &-item {
    margin-bottom: 10px;
  }
}
.new-function-box {
  .open {
    font-size: 14px;
    cursor: pointer;
  }
}
.app-exhibition-box {
  .el-carousel {
    padding: 30px 0;
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #ff5000;
}
</style>

<style lang="scss">
.el-carousel {
  .is-active button.el-carousel__button {
    background-color: #ff5000;
  }
}
</style>
