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
      <!-- <div class="component-more">
        <div class="three-dot"></div>
      </div> -->
    </div>
    <div class="">
      <div
        v-for="store in data"
        :key="store.id"
        class="store-card"
        :style="{ background: base.backgroundColor }"
      >
        <template v-if="store.id">
          <div class="view-flex view-flex-middle">
            <img
              class="store-logo"
              :src="store.logo || 'https://fakeimg.pl/120x120/EFEFEF/CCC/?text=logo&font=lobster'"
              alt=""
            >
            <div class="store-name">
              <p class="name">
                {{ store.name }}
              </p>
              <p class="tags">
                <span v-for="item in seletedTags" :key="item.tag_id">{{ item.tag_name }}</span>
              </p>
            </div>
          </div>
          <div class="picture">
            <img :src="base.imgUrl" alt="">
          </div>
          <div class="store-items">
            <div v-for="item in store.items.slice(0, 4)" :key="item.goodsId" class="store-item">
              <img
                class="store-item-thumb"
                :src="item.imgUrl"
                alt=""
                :style="{ 'border-color': base.borderColor || '#000' }"
              >
              <div class="store-item-amount">
                <span class="price">¥{{ item.price / 100 }}</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="store-placeholder">
            <div class="view-flex view-flex-middle">
              <div class="logo" />
              <div>
                <div class="name" />
                <div class="desc" />
              </div>
            </div>
            <div class="view-flex">
              <div class="item">
                <div class="thumb" />
                <div class="price" />
              </div>
              <div class="item">
                <div class="thumb" />
                <div class="price" />
              </div>
              <div class="item">
                <div class="thumb" />
                <div class="price" />
              </div>
              <div class="item">
                <div class="thumb" />
                <div class="price" />
              </div>
            </div>
          </div>
        </template>
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
      data: [],
      seletedTags: []
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
      this.seletedTags = val.seletedTags
    }
  }
}
</script>

<style scoped lang="scss">
.picture {
  width: 100%;
  margin-top: 5px;
  img {
    display: block;
    width: 100%;
  }
}
.store-card {
  width: 300px;
  position: relative;
  margin: 10px 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  .store-placeholder {
    .logo {
      margin-right: 10px;
      width: 40px;
      height: 40px;
      border-radius: 100%;
      background: #efefef;
    }
    .name {
      margin-bottom: 5px;
      width: 100px;
      height: 10px;
      background: #ccc;
    }
    .desc {
      width: 150px;
      height: 10px;
      background: #efefef;
    }
    .item {
      padding-top: 5px;
      .thumb {
        margin-bottom: 5px;
        margin-right: 10px;
        width: 60px;
        height: 60px;
        background: #efefef;
        // border-width: 1px;
        // border-style:solid;
      }
      .price {
        width: 30px;
        height: 10px;
        background: #f5f5f5;
      }
    }
  }
  .store-logo {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  .store-name {
    .name {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
    .tags {
      font-size: 12px;
      margin-top: 3px;
      span {
        border: 1px solid #c3c3c3;
        padding: 2px 6px;
        border-radius: 5px;
        margin-right: 8px;
        color: #c3c3c3;
      }
    }
  }
  .store-items {
    display: flex;
    .store-item {
      padding-top: 10px;
      .store-item-thumb {
        margin-right: 10px;
        width: 60px;
        height: 60px;
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
      }
      .store-item-amount {
        height: 28px;
        line-height: 28px;
        .price {
          font-size: 14px;
          color: #ff5000;
        }
        .market-price {
          font-size: 14px;
          color: #ccc;
        }
      }
    }
  }
}
</style>
