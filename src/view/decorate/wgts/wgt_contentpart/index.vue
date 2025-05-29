<template>
  <div :class="{ 'wgt-content-part': true }">
    <div class="content-part-header" :style="setOutHeaderStyle">
      <div class="content-part-header-item" :style="setInHeaderStyle">
        <div v-if="value.leftimgUrl" class="content-part-header-item-left">
          <SpImage mode="cover" :src="value.leftimgUrl" alt="" />
        </div>
        <div class="content-part-header-item-center" :style="setItemStyle">
          <div
            v-for="(item, index) in value.data"
            :key="index"
            class="content-part-header-item-center-item"
            @click="handleClickNavItem(index)"
            :style="setSelectItemTextStyle(item, index)"
          >
            <SpImage
              v-if="item.navitemtype == 'image'"
              mode="cover"
              :src="currentIndex == index ? item.navitemactiveimg : item.imgUrl"
              alt=""
            />
            <span
              v-else
              :style="setItemTextStyle(item, index)"
              :class="{
                'content-part-header-item-center-item-text': true,
                'content-part-header-item-center-item-text-active': index == currentIndex,
                'content-part-header-item-center-item-text-active-border': value.navitemborder && index == currentIndex
              }"
              >{{ item.navItemName }}</span
            >
          </div>
        </div>
        <div v-if="value.rightimgUrl" class="content-part-header-item-right">
          <SpImage mode="cover" :src="value.rightimgUrl" alt="" />
        </div>
      </div>
    </div>
    <div class="content-part-body">
      <div v-if="value.animate == 'horizontal'" class="content-part-body-item">
        <div v-for="(item, index) of value.data[currentIndex].children" :key="index">
          <component :is="item.name" :value="item" />
        </div>
      </div>
      <div v-else class="content-part-body-item">
        <div v-for="(data, key) of value.data" :key="key">
          <div v-for="(item, index) of data.children" :key="index">
            <component :is="item.name" :value="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Contentpart',
  wgtName: '内容分区',
  wgtDesc: '',
  wgtIcon: 'wgt-content-part',
  wgtType: 1,
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    setOutHeaderStyle() {
      const { navbg, navpadded } = this.value
      return {
        backgroundColor: navbg.color,
        backgroundImage: navbg.image ? `url(${navbg.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingLeft: navpadded.paddedl + 'px',
        paddingRight: navpadded.paddedr + 'px',
        paddingTop: navpadded.paddedt + 'px',
        paddingBottom: navpadded.paddedb + 'px'
      }
    },
    setInHeaderStyle() {
      const { navitembg, navitempadded, navitemradius, navitemheight, navitemmargin } = this.value
      return {
        backgroundColor: navitembg.color,
        backgroundImage: navitembg.image ? `url(${navitembg.image})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingLeft: navitempadded.paddedl + 'px',
        paddingRight: navitempadded.paddedr + 'px',
        paddingTop: navitempadded.paddedt + 'px',
        paddingBottom: navitempadded.paddedb + 'px',
        borderRadius: `${navitemradius}px`,
        height: `${navitemheight}px`,
      }
    },
    setItemStyle() {
      const { navitemmargin } = this.value
      return {
        gap: navitemmargin.paddedlr + 'px',
        marginLeft: navitemmargin.paddedlr + 'px',
        marginRight: navitemmargin.paddedlr + 'px'
      }
    }
  },
  methods: {
    handleClickNavItem(index) {
      this.currentIndex = index
    },
    setItemTextStyle(item, index) {
      const { navitemcolor, navitemactivecolor } = item
      return {
        color: index == this.currentIndex ? navitemactivecolor : navitemcolor
      }
    },
    setSelectItemTextStyle(item, index) {
      const { navactivebg, navactivebgimg } = item
      return {
        backgroundColor: index == this.currentIndex ? navactivebg : '',
        backgroundImage: index == this.currentIndex&&navactivebgimg ? `url(${navactivebgimg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }
    }
  }
}
</script>

<style lang="scss" scoped>
.wgt-content-part {
  .content-part-header {
    .content-part-header-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      box-sizing: border-box;

      .content-part-header-item-left {
        height: 100%;

        .el-image {
          height: 100%;
        }
      }

      .content-part-header-item-right {
        height: 100%;

        .el-image {
          height: 100%;
        }
      }

      .content-part-header-item-center {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex: 1;
        height: 100%;
        overflow: hidden;

        .content-part-header-item-center-item {
          height: 100%;
          flex-shrink: 0;
          font-weight: 400;
          font-size: 15px;

          &-text {
            font-weight: 400;
            font-size: 15px;
          }

          &-text-active {
            font-weight: 500;
          }

          &-text-active-border {
            position: relative;
            &::after {
              content: '';
              display: block;
              width: 68%;
              height: 3px;
              background: #d4003b;
              position: absolute;
              bottom: -3px;
              left: 50%;
              transform: translateX(-50%);
            }
          }

          .el-image {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
