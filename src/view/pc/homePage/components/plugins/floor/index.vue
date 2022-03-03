<template>
  <div>
    <div
      v-if="dataForm.base.title || dataForm.data.tabList.length > 0"
      class="floor-header"
    >
      <div class="floor-title">
        <slot />
      </div>
      <div class="floor-tabs">
        <el-tabs v-model="dataForm.data.activeName">
          <el-tab-pane
            v-for="(item, index) in dataForm.data.tabList"
            :key="item.id"
            :label="item.title || `标签${index}`"
            :name="index + ''"
          />
        </el-tabs>
      </div>
    </div>
    <div class="floor">
      <div class="floor-box">
        <!-- 左侧 -->
        <div class="floor-left">
          <!-- 左侧商品类型导航列表 -->
          <div
            class="floor-left__top"
            :style="{ background: dataForm.data.LeftBackgroundColor }"
          >
            <el-row :gutter="3">
              <el-col
                v-for="item in dataForm.data.leftNavList"
                :key="item.uuid"
                :span="12"
              >
                <div
                  class="goods—type__link"
                  :style="{ color: dataForm.data.LeftFontColor }"
                >
                  {{ item.titleName }}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 左侧热图区 -->
          <div class="floor-left__footer">
            <img
              :src="
                dataForm.data.leftImg.url ||
                  'https://fakeimg.pl/204x361/F8F8F8/CCC/?text=250x440&font=helvetica'
              "
            >
          </div>
        </div>
        <!-- 商品列表 -->
        <div class="floor-content">
          <el-row
            v-for="(items, index) in dataForm.data.tabList"
            :key="items.uuid"
          >
            <el-col
              v-for="item in items.children"
              v-if="index + '' === dataForm.data.activeName"
              :key="item.id"
              :span="6"
            >
              <div class="floor-content__goods">
                <el-image
                  style="width: 100%; height: 139px"
                  :src="item.pics[0]"
                  fit="cover"
                />
                <p>{{ item.item_name | titlefilter }}</p>
                <div class="content-goods__footer">
                  <div class="goods-footer__price">
                    <!-- <span>123</span> -->
                    <p>{{ item.price | price }}</p>
                  </div>
                  <div class="goods-footer__submit">
                    <el-button
                      size="mini"
                      type="danger"
                    >
                      加入购物车
                    </el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 右侧热图区 -->
        <div class="floor-right">
          <div class="floor-right__top">
            <img
              :src="
                dataForm.data.rightImg1.url ||
                  'https://fakeimg.pl/127x230/F8F8F8/CCC/?text=155x280&font=helvetica'
              "
            >
          </div>
          <div class="floor-right__footer">
            <img
              :src="
                dataForm.data.rightImg2.url ||
                  'https://fakeimg.pl/127x230/F8F8F8/CCC/?text=155x280&font=helvetica'
              "
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Floor',
  filters: {
    titlefilter (val) {
      if (val.length > 15) {
        val = val.substring(0, 15) + '...'
      }
      return val
    },
    price (value, currency = '¥', decimals = 2) {
      // console.log('filter', value)
      let digitsRE = /(\d{3})(?=\d)/g
      value = parseFloat(value) / 100
      if (!isFinite(value) || (!value && value !== 0)) return ''
      let stringified = Math.abs(value).toFixed(decimals)
      let _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
      let i = _int.length % 3
      let head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
      let _float = decimals ? stringified.slice(-1 - decimals) : ''
      let sign = value < 0 ? '-' : ''
      return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      dataForm: this.data,

      activeName: 0
    }
  },
  watch: {
    dataForm (val) {
      console.log('index-watch---')
      console.log(val)
    }
  },
  created () {},
  mounted () {
    // console.log(this.data)
  },
  methods: {
    handleClick () {}
  }
}
</script>
<style lang="scss">
.floor-header {
  .el-tabs__nav {
    margin-bottom: 0;
    margin-top: 10px;
    margin-right: 10px;
  }
}
</style>
<style lang="scss" scoped>
.floor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid #efefef;
  .floor-title {
    font-size: 18px;
    font-weight: 400;
    color: #626262;
  }
}
.floor {
  position: relative;
  box-shadow: 0 0 0 1px #efefef;
  .floor-box {
    display: flex;
    height: 460px;
    background: #ffffff;
    overflow: hidden;

    .floor-left {
      width: 164px;
      background: #ccc;
      border-right: 1px solid #efefef;
      &__top {
        height: 99px;
        padding: 5px;
        // width: 175px;
        margin: 0 auto;
        // padding-top: 55px;
        position: relative;
        z-index: 9;
        background: #fff;
        border-bottom: 1px solid #efefef;
        .goods—type__link {
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 12px;
          color: 333;
          cursor: pointer;
        }
      }

      &__footer {
        height: 361px;
        position: relative;
        z-index: 9;
        cursor: pointer;

        img {
          height: 100%;
          width: 100%;
        }
      }

      // .left-img {
      //   height: 560px;
      //   width: 250px;
      //   position: absolute;

      // }
    }

    .floor-content {
      flex: 1;

      &__goods {
        height: 230px;
        border-right: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
        padding: 10px;

        > p {
          font-size: 12px;
          height: 38px;
        }

        .content-goods__footer {
          overflow: hidden;
          height: 32px;

          .goods-footer__price {
            float: left;

            span {
              font-size: 12px;
              text-decoration: line-through;
              color: #888;
            }
            p {
              font-size: 14px;
              color: #e54e44;
              line-height: 32px;
            }
          }
          .goods-footer__submit {
            float: right;
          }
        }
      }
    }
    .floor-right {
      width: 127px;
      height: 460px;
      background: #ccc;
      border-left: 1px solid #efefef;
      .floor-right__top {
        border-bottom: 1px solid #efefef;
      }
      div {
        cursor: pointer;
        width: 127px;
        height: 230px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
