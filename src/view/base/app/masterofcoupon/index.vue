<template>
  <div>
    <el-row class="section-white content-padded coupon-header">
      <el-col :span="6" class="coupon-img">
        <img src="@/assets/img/webchat.png" alt="图片">
      </el-col>
      <el-col :span="18" class="coupon-desc">
        <h3>派券大师<span>(2018年9月30日到期)</span></h3>
        <p>
          <span class="coupon-desc-content" :class="isHidden ? 'content-hidden' : ''"
            >如果你无法简洁的描述你的想法，那只能说明你不够了解它</span
          ><span v-if="isHidden" class="more" @click="showAll"
            >更多<i class="iconfont icon-chevron-down" /></span
          ><span v-if="!isHidden" class="more" @click="contentHidden"
            >收起<i class="iconfont icon-chevron-up"
          /></span>
        </p>
        <div class="coupon-opr">
          <el-button type="primary" size="small"> 立即选购 </el-button>
          <el-button size="small"> 查看教程 </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="section-white coupon-body content-padded">
      <div class="scene-box">
        <div class="section-header with-border">
          <h3>场景满足</h3>
        </div>
        <div class="section-body">
          <div class="scene-item">[吸引注册]：满足门店通过优惠券快速获客。</div>
          <div class="scene-item">
            [尾随交易]：通过消费者的一次交易，让消费者获得其他促销信息，进一步提升消费者粘性。
          </div>
        </div>
      </div>
      <div class="scene-box new-function-box">
        <div class="section-header with-border">
          <h3 class="clearfix">
            版本1.1.1中的新功能
            <span v-if="functionOpen" class="f_r open" @click="open"
              >展开<i class="iconfont icon-chevron-down" /></span
            ><span v-if="!functionOpen" class="f_r open" @click="close"
              >收起<i class="iconfont icon-chevron-up"
            /></span>
          </h3>
        </div>
        <div class="section-body">
          <div class="scene-item">[新增]：新增注册送礼功能</div>
          <div class="scene-item">[新增]：新增注册送礼功能</div>
        </div>
      </div>
      <div class="app-exhibition-box">
        <div class="section-header with-border">
          <h3>注册送礼小程序展示</h3>
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
