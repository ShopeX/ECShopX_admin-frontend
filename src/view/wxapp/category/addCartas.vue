<style scoped lang="scss">
.addCartas-view {
  width: 375px;
  height: 667px;
  padding: 10px 0 0 0;
  margin-left: 100px;
  overflow: hidden;
  background-color: #f5f5f5;

  .template {
    margin-right: -15px;
    height: 100%;
    overflow-y: overlay;
  }

  .search-box {
    display: flex;
    align-items: center;
    height: 30px;
    background: #ffffff;
    border-radius: 30px;
    margin: 0 12px;
    padding: 0 12px;
    border: 1px solid var(--themeColor);

    .search-input {
      color: #999999;
      margin-left: 8px;
      font-size: 12px;
      line-height: 12px;
    }

    img {
      width: 14px;
      height: 14px;
    }
  }


  .one-level {
    position: relative;
    display: flex;
    align-items: center;
    height: 82px;
    margin: 0 12px;
    font-size: 10px;
    overflow: hidden;

    img {
      width: 38px;
      height: 38px;
      border-radius: 50%;
    }

    &-item {
      height: 82px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      margin-right: 18px;

      &-img {
        border: 2px solid var(--themeColor);
      }

      &-imgs {
        width: 40px !important;
        height: 40px !important;
      }

      &-titles {
        margin-top: 5px;
      }

      &-title {
        margin-top: 4px;
        width: 50px;
        height: 16px;
        background: var(--themeColor);
        border-radius: 14px;
        text-align: center;
        color: #ffffff;
      }
    }

    .all {
      position: absolute;
      right: 0;
      z-index: 99;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 11px;
      color: #000000;
      line-height: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 30px;
      background-color: #f5f5f5;
      height: 100%;
      padding: 20px 0;

      img {
        margin-top: 2px;
        width: 9px;
        height: 9px;
        border-radius: inherit;
      }
    }
  }

  .level-box {
    display: flex;

    &-left {
      height: 500px;
      width: 100px;

      .two-levels {
        background-color: #ffffff;
      }

      .two-level {
        display: flex;
        align-items: center;
        text-align: center;
        line-height: 36px;

        .lone {
          width: 5px;
          height: 12px;
          background: var(--themeColor);
        }

        &-item-title {
          width: 100px;
          height: 36px;
          text-align: center;
        }

      }

    }

    &-right {
      background-color: #fff;
      flex: 1;
    }

    .three-level-list {
      margin-top: 10px;
      height: 22px;
      overflow: hidden;

      &-title {
        height: 40px;
        border-radius: 28px;
        padding: 4px 10px;
        font-size: 11px;
        margin-left: 8px;
      }

      &-titles {
        background: #FFEEED;
      }

    }

    .three-level-item {
      flex: 1;
      background: #FFFFFF;
      padding: 0 10px;

      .three-list {
        display: flex;
        width: 100%;
        height: 70px;
        margin-top: 12px;

        &-img {
          width: 70px;
          height: 70px;
          border-radius: 4px;
          margin-right: 8px;
        }

        &-title {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;

          .name {
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            font-size: 12px;
            color: #222222;
            line-height: 18px;
          }

          .price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 14px;

            .price1 {
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              font-size: 16px;
              color: var(--themeColor);
              line-height: 45px;

              .price2 {
                font-size: 12px;
              }
            }

            .price3 {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 11px;
              color: #BBBBBB;
              line-height: 30px;
              text-decoration-line: line-through;
              margin-left: 6px;
            }

            .cart {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }

  }

}
</style>

<template>
  <div class="addCartas-view">
    <!-- 搜索框 -->
    <div class="search-box">
      <img src="@/assets/imgs/search-for.png" alt="">
      <div class="search-input">|</div>
      <span class="search-input">搜索</span>
    </div>
    <div>
      <!-- 一级分类 -->
      <div class="one-level">
        <div v-for="(item, index) in oneList" :key="index" class="one-level-item" @click="oneCli(index)">
          <img :class="{ 'one-level-item-imgs': index != oneIndex, 'one-level-item-img': index == oneIndex }"
            src="https://img1.baidu.com/it/u=1344265042,937692021&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1734022800&t=81b6988ebf5fbe135bad56f38c516126"
            alt="">
          <span
            :class="{ 'one-level-item-titles': index != oneIndex, 'one-level-item-title': index == oneIndex }">一级分类</span>
        </div>
        <div class="all">
          <span>全</span><span>部</span> <img src="@/assets/imgs/classification.png" alt="">
        </div>
      </div>

      <div class="level-box">
        <!-- 二级分类 -->
        <div class="level-box-left">
          <div v-for="(item, index) in twoList" :key="index"
            :class="{ 'two-level': true, 'two-levels': twoIndex == index }" @click="twoCli(index)">
            <div v-if="twoIndex == index" class="lone" />
            <div class="two-level-item-title">二级分类</div>
          </div>
        </div>
        <!-- 三级分类 -->
        <div class="level-box-right">
          <!-- 三级分类列表 -->
          <div class="three-level-list">
            <span v-for="(item, index) in threeList" :key="index"
              :class="{ 'three-level-list-title': true, 'three-level-list-titles': index == threeIndex }"
              @click="threeCli(index)">三级分类</span>
          </div>
          <!-- 三级分类商品 -->
          <div class="three-level-item">
            <div v-for="(item, index) in goodsIndex" :key="index" class="three-list">
              <img class="three-list-img"
                src="https://img1.baidu.com/it/u=1344265042,937692021&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1734022800&t=81b6988ebf5fbe135bad56f38c516126"
                alt="">
              <div class="three-list-title">
                <span class="name">商品名称</span>
                <div class="price">
                  <div>
                    <span class="price1">19.<span class="price2">96</span></span>
                    <span class="price3">99.00</span>
                  </div>
                  <img class="cart" src="@/assets/imgs/shopping-cart.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oneList: 9,
      oneIndex: 0,
      twoList: 2,
      twoIndex: 0,
      threeList: 2,
      threeIndex: 0,
      goodsIndex: 7,
    }
  },
  methods: {
    oneCli(index) {
      this.oneIndex = index
    },
    twoCli(index) {
      this.twoIndex = index
    },
    threeCli(index) {
      this.threeIndex = index
    }
  }
}
</script>
