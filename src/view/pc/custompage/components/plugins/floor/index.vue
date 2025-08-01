<template>
  <div>
    <slot />
    <div class="floor">
      <div v-if="dataForm.title || dataForm.tabList.length > 0" class="floor-header">
        <div class="floor-title">
          {{ dataForm.title }}
        </div>
        <div class="floor-tabs">
          <el-tabs v-model="dataForm.activeName" type="card">
            <el-tab-pane
              v-for="(item, index) in dataForm.tabList"
              :key="item.id"
              :label="item.title"
              :name="index + ''"
            />
          </el-tabs>
        </div>
      </div>
      <div class="floor-box">
        <!-- 左侧 -->
        <div class="floor-left">
          <!-- 左侧商品类型导航列表 -->
          <div class="floor-left__top" :style="{ background: dataForm.LeftBackgroundColor }">
            <el-row :gutter="3">
              <el-col v-for="item in dataForm.leftNavList" :key="item.uuid" :span="8">
                <div class="goods—type__link" :style="{ color: dataForm.LeftFontColor }">
                  {{ item.titleName }}
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 左侧热图区 -->
          <div class="floor-left__footer">
            <img :src="dataForm.leftImg.url">
          </div>
        </div>
        <!-- 商品列表 -->
        <div class="floor-content">
          <el-row v-for="(items, index) in dataForm.tabList" :key="items.uuid">
            <el-col
              v-for="item in items.children"
              v-if="index + '' === dataForm.activeName"
              :key="item.id"
              :span="6"
            >
              <div class="floor-content__goods">
                <el-image style="width: 100%; height: 170px" :src="item.pics[0]" fit="cover" />
                <p>{{ item.itemName | titlefilter }}</p>
                <div class="content-goods__footer">
                  <div class="goods-footer__price">
                    <!-- <span>123</span> -->
                    <p>{{ item.price | price }}</p>
                  </div>
                  <div class="goods-footer__submit">
                    <el-button size="mini" type="danger"> 加入购物车 </el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 右侧热图区 -->
        <div class="floor-right">
          <div class="floor-right__top">
            <img :src="dataForm.rightImg1.url">
          </div>
          <div class="floor-right__footer">
            <img :src="dataForm.rightImg2.url">
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
    titlefilter(val) {
      if (val.length > 15) {
        val = val.substring(0, 15) + '...'
      }
      return val
    },
    price(value, currency = '¥', decimals = 2) {
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
  data() {
    return {
      dataForm: this.data.data,

      activeName: 0
    }
  },
  watch: {
    dataForm(val) {
      console.log('index-watch---')
      console.log(val)
    }
  },
  created() {},
  mounted() {
    // console.log(this.data)
  },
  methods: {
    handleClick() {}
  }
}
</script>
<style lang="scss">
.floor {
  .el-tabs__header {
    margin: 0;
    border-bottom: 1px solid #d4d4d4;
  }
  .el-tabs__content {
    display: none;
  }
  .el-tabs__nav {
    float: right;
  }
  .el-tabs__nav {
    border: none !important;
    > div {
      margin-right: 10px;
      border: 1px solid #d4d4d4;
      border-left: 1px solid #d4d4d4 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.floor {
  position: relative;
  margin-bottom: 40px;
  box-shadow: 0 0 0 1px #efefef;
  .floor-header {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #efefef;
    .floor-title {
      font-size: 18px;
      font-weight: 400;
      color: #626262;
    }
    .floor-tabs {
      background: #ffffff;
      padding-top: 20px;
    }
  }

  .floor-box {
    display: flex;
    height: 560px;
    background: #ffffff;
    overflow: hidden;

    .floor-left {
      width: 250px;
      background: #ccc;

      &__top {
        height: 120px;
        // width: 175px;
        margin: 0 auto;
        // padding-top: 55px;
        position: relative;
        z-index: 9;
        background: #fff;

        .goods—type__link {
          height: 40px;
          line-height: 40px;
          width: 80px;
          text-align: center;
          font-size: 12px;
          color: white;
          cursor: pointer;
        }
      }

      &__footer {
        height: 440px;
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
        height: 280px;
        border-right: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
        padding: 10px;

        > p {
          font-size: 12px;
          height: 38px;
        }

        .content-goods__footer {
          overflow: hidden;
          height: 45px;

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
              line-height: 46px;
            }
          }
          .goods-footer__submit {
            float: right;
            margin-top: 9px;
          }
        }
      }
    }
    .floor-right {
      width: 155px;
      height: 560px;
      background: #ccc;
      div {
        cursor: pointer;
        width: 155px;
        height: 280px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
