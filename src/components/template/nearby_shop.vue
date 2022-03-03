<template>
  <div
    class="component-wrap"
    :class="{ 'component-padded': base.padded, 'active': active }"
  >
    <div class="current-active" />
    <div
      v-if="base.title"
      class="component-header"
    >
      <div class="component-title">
        <div>{{ base.title }}</div>
      </div>
      <div
        class="component-more"
        style="flex: 1; text-align: right; justify-content: end"
      >
        <div class="more">
          查看更多
        </div>
      </div>
    </div>
    <div class="nearbyBox">
      <div class="tags">
        <span
          v-for="(item, index) in seletedTags"
          :key="item.tag_id"
          :class="checkde == index ? 'checked' : ''"
        >{{ item.tag_name }}</span>
      </div>
      <div class="shopList">
        <div
          v-if="shoplist.length <= 0"
          class="noShop"
        >
          <img
            :src="img.noShopImg"
            alt=""
          >
          <p>更多商家接入中，敬请期待</p>
        </div>
        <div
          v-else
          class="content"
        >
          <div
            v-for="item in shoplist"
            :key="item.distributor_id"
            class="shop"
          >
            <div
              class="bg"
              :style="{
                backgroundImage: 'url(' + `${item.banner || img.bgImg}` + ')',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }"
            >
              <img
                class="logo"
                :src="item.logo || img.logoImg"
                alt=""
              >
            </div>
            <!-- <img class="bg" :src="img.bgImg" alt="" /> -->

            <div class="title">
              {{ item.name }}
            </div>
            <div
              v-if="base.show_coupon && item.discountCardList.length > 0"
              class="coupon"
            >
              {{ item.discountCardList[0].title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryTagShop } from '@/api/marketing.js'
const noShopImg = require('@/assets/img/platform/noShop.png')
const logoImg = require('@/assets/img/platform/shop_default_logo.png')
const bgImg = require('@/assets/img/platform/shop_default_bg.png')

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
  data () {
    return {
      img: {
        noShopImg,
        logoImg,
        bgImg
      },
      base: {},
      data: [],
      seletedTags: [], // tab
      shoplist: [],
      checkde: 0
    }
  },
  watch: {
    res: {
      deep: true,
      handler (value) {
        if (value) {
          this.setData(value)
        }
      }
    },
    seletedTags (val) {
      this.getShop(val)
    }
  },
  mounted () {
    this.setData(this.res)
  },
  methods: {
    setData (val) {
      this.base = val.base
      this.seletedTags = val.seletedTags
    },
    async getShop (val) {
      if (val.length <= 0) {
        this.shoplist = []
        return
      }
      const tag_id = val[this.checkde].tag_id

      const result = await queryTagShop({ tag_id })
      const { list } = result.data.data
      this.shoplist = list
      console.log(result)
    }
  }
}
</script>

<style lang="scss" scoped>
.component-wrap {
  .component-more {
    .more {
      font-size: 12px;
    }
  }
  .nearbyBox {
    width: 300px;
    position: relative;
    margin: 10px 10px 0;
    padding: 10px 0px 0px 0px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  .tags {
    max-width: 300px;
    overflow-x: auto;
    position: relative;
    margin: 0px 10px 0;
    white-space: nowrap;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    span {
      padding: 2px 10px;
      border: 1px solid #999;
      margin-right: 8px;
      font-size: 12px;
      border-radius: 4px;
      color: #999;
      &.checked {
        color: #ff6700;
        border: 1px solid #ff6700;
      }
    }
  }
  .shopList {
    margin: 10px;
    .noShop {
      img {
        display: block;
        width: 50%;
        margin: 10px auto;
      }
      p {
        text-align: center;
      }
    }
    .content {
      max-width: 300px;
      display: flex;
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 3px;
      // &::-webkit-scrollbar {
      //   display: none;
      // }
      .shop {
        border: 1px solid #f5f5f5;
        margin-right: 10px;
        border-radius: 4px;
        // width: 100px;
        img {
          width: 100%;
          display: block;
        }
        .bg {
          position: relative;
          width: 100px;
          height: 60px;
          .logo {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .title {
          width: 80px;

          text-align: center;
          margin: 22px auto 4px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .coupon {
          width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 20px;
          border: 1px solid #ff6700;
          border-radius: 3px;
          text-align: center;
          margin: 0px auto 10px;
          color: #ff6700;
          font-size: 10px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
