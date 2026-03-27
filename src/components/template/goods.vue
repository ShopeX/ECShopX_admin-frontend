<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, active: active }">
    <div class="current-active" />
    <div v-if="base.title" class="component-header">
      <div class="component-title">
        <div>{{ base.title }}</div>
        <div class="subtitle">
          {{ base.subtitle }}
        </div>
      </div>
      <div class="component-more">
        <div class="three-dot" />
      </div>
    </div>
    <div>
      <div class="goods-card">
        <div class="goods" :class="config.style">
          <img
            class="thumbnail"
            :src="
              data[0].img_url ||
              (config.style === 'card'
                ? 'https://fakeimg.pl/80x80/EFEFEF/CCC/?text=img&font=lobster'
                : 'https://fakeimg.pl/288x120/EFEFEF/CCC/?text=img&font=lobster')
            "
          >
          <div class="caption">
            <div class="goods-title">
              {{ data[0].item_name || $t('37035f2d.07ec01') }}
            </div>
            <template v-if="config.style === 'card'">
              <div class="tips">{{ $t('37035f2d.50cc16') }}</div>
              <div class="sales-num">
                <i class="iconfont icon-user-friends" />{{ data[0].sales || 0 }}
              </div>
            </template>
            <template v-else>
              <div class="price">{{ $t('37035f2d.f4c750') }} ¥{{ data[0].price / 100 }}</div>
            </template>
          </div>
        </div>
        <div class="card-footer">
          <div class="footer-btn">{{ $t('37035f2d.56d0b8') }}</div>
          <div class="footer-btn">{{ $t('37035f2d.2971f7') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      base: {},
      config: {},
      data: []
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  created() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss">
.goods-card {
  width: 90%;
  margin: 0 auto;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  .goods {
    .thumbnail {
      display: block;
    }
    .caption {
      .goods-title {
        display: -webkit-box;
        height: 42px;
        margin-bottom: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 2;
        box-orient: vertical;
        color: #333;
        font-size: 15px;
        line-height: 1.4;
      }
      .price {
        font-size: 14px;
        color: #cd6821;
      }
    }
    &.card {
      display: flex;
      padding: 10px;
      .thumbnail {
        width: 80px;
        height: 80px;
      }
      .caption {
        flex: 1;
        padding-left: 15px;
        .tips {
          font-size: 12px;
          color: #777;
        }
        .sales-num {
          color: #999;
          font-size: 12px;
          .iconfont {
            font-size: 12px;
            margin-right: 10px;
            color: #ccc;
          }
        }
      }
    }
    &.poster {
      .thumbnail {
        width: 100%;
        height: auto;
      }
      .caption {
        padding: 12px;
      }
    }
  }
  .card-footer {
    display: flex;
    .footer-btn {
      position: relative;
      flex: 1;
      height: 35px;
      line-height: 35px;
      text-align: center;
      font-size: 14px;
      color: #689b20;
      &:first-child {
        &::after {
          position: absolute;
          right: 0;
          top: 35%;
          bottom: 35%;
          width: 2px;
          content: '';
          background: #efefef;
        }
      }
    }
  }
}
</style>
