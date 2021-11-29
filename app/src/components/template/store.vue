<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>
    <div v-if="base.title" class="component-header">
      <div class="component-title">
        <div>{{ base.title }}</div>
        <div class="subtitle">{{ base.subtitle }}</div>
      </div>
      <!-- <div class="component-more">
        <div class="three-dot"></div>
      </div> -->
    </div>
    <div class="">
      <div v-for="store in data" class="store-card">
        <template v-if="store.id">
          <div class="view-flex view-flex-middle">
            <img
              class="store-logo"
              :src="store.logo || 'https://fakeimg.pl/120x120/EFEFEF/CCC/?text=logo&font=lobster'"
              alt=""
            />
            <div class="store-name">{{ store.name }}</div>
          </div>
          <div class="store-items">
            <div v-for="(item, idx) in store.items" v-if="idx < 4" class="store-item">
              <img class="store-item-thumb" :src="item.imgUrl" alt="" />
              <div class="store-item-amount">
                <span class="price">¥{{ item.price / 100 }}</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="store-placeholder">
            <div class="view-flex view-flex-middle">
              <div class="logo"></div>
              <div>
                <div class="name"></div>
                <div class="desc"></div>
              </div>
            </div>
            <div class="view-flex">
              <div class="item">
                <div class="thumb"></div>
                <div class="price"></div>
              </div>
              <div class="item">
                <div class="thumb"></div>
                <div class="price"></div>
              </div>
              <div class="item">
                <div class="thumb"></div>
                <div class="price"></div>
              </div>
              <div class="item">
                <div class="thumb"></div>
                <div class="price"></div>
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
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  data() {
    return {
      base: {},
      config: {},
      data: []
    }
  },
  methods: {
    setData(val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  },
  mounted() {
    this.setData(this.res)
  }
}
</script>

<style scoped lang="scss">
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
      padding-top: 10px;
      .thumb {
        margin-bottom: 5px;
        margin-right: 10px;
        width: 60px;
        height: 60px;
        background: #efefef;
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
    border-radius: 100%;
  }
  .store-name {
    font-size: 14px;
    color: #333;
  }
  .store-items {
    display: flex;
    .store-item {
      padding-top: 10px;
      .store-item-thumb {
        margin-right: 10px;
        width: 60px;
        height: 60px;
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
