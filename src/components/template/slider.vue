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
        <div class="subtitle">
          {{ base.subtitle }}
        </div>
      </div>
      <!-- <div class="component-more">
        <div class="three-dot"></div>
      </div> -->
    </div>
    <div
      class="slider-wrap"
      :class="{ 'padded': config.padded }"
    >
      <img
        class="scale-placeholder"
        :src="
          (data[0] && data[0].imgUrl) ||
            'https://fakeimg.pl/320x240/EFEFEF/CCC/?text=image&font=lobster'
        "
      >

      <el-carousel
        class="sliderimg"
        indicator-position="none"
        arrow="never"
        :height="'100%'"
        :interval="config.interval"
        @change="change"
      >
        <el-carousel-item
          v-for="(item, index) in data"
          :key="index"
          class="slider-item"
          :class="{ 'rounded': config.rounded }"
        >
          <div class="img">
            <img
              :src="
                item.imgUrl ||
                  'https://fakeimg.pl/320x' + config.height + '/EFEFEF/CCC/?text=image&font=lobster'
              "
            >
            <!-- 图片文字配置 -->
            <div class="text-deploy">
              <!-- 模板1 -->
              <div
                v-if="item.template == 'one'"
                class="template"
                :class="config.current == index ? 'current-page' : ''"
                :style="'color:' + base.WordColor"
              >
                <div class="text1 animation1">
                  {{ data[config.current].mainTitle }}
                </div>
                <div class="text2 animation2">
                  {{ data[config.current].subtitle }}
                </div>
                <div class="text3 animation3">
                  {{ data[config.current].subtitleTow }}
                </div>
                <div
                  v-if="data[config.current].button"
                  class="text4 animation4"
                  :style="'border-color:' + base.WordColor"
                >
                  {{ data[config.current].button }}
                </div>
              </div>

              <!-- 模板2 -->
              <div
                v-if="item.template == 'two'"
                class="template"
                :class="config.current == index ? 'current-page' : ''"
                :style="'color:' + base.WordColor"
              >
                <div class="text2 animation1">
                  {{ data[config.current].mainTitle }}
                </div>
                <div class="text1 animation2">
                  {{ data[config.current].subtitle }}
                </div>
                <div class="text3 animation3">
                  {{ data[config.current].subtitleTow }}
                </div>
                <div
                  v-if="data[config.current].button"
                  class="text4 animation4"
                  :style="'border-color:' + base.WordColor"
                >
                  {{ data[config.current].button }}
                </div>
              </div>

              <!-- 模板3 -->
              <div
                v-if="item.template == 'three'"
                class="template"
                :class="config.current == index ? 'current-page' : ''"
                :style="'color:' + base.WordColor"
              >
                <div class="text2 animation1">
                  {{ data[config.current].mainTitle }}
                </div>
                <div class="text1 animation2">
                  {{ data[config.current].subtitle }}
                </div>
                <div class="text3 animation3">
                  {{ data[config.current].subtitleTow }}
                </div>
                <div
                  v-if="data[config.current].button"
                  class="text4 animation4"
                  :style="'border-color:' + base.WordColor"
                >
                  {{ data[config.current].button }}
                </div>
              </div>

              <!-- 模板4 -->
              <div
                v-if="item.template == 'four'"
                class="template_four template"
                :class="config.current == index ? 'current-page' : ''"
                :style="'color:' + base.WordColor"
              >
                <div class="text2 animation1">
                  {{ data[config.current].mainTitle }}
                </div>
                <div class="text1 animation2">
                  {{ data[config.current].subtitle }}
                </div>
                <div
                  v-if="data[config.current].button"
                  class="text4 animation3"
                  :style="'border-color:' + base.WordColor"
                >
                  {{ data[config.current].button }}
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>

      <div
        v-if="config.dot && data.length > 1"
        class="slider-dot"
        :class="[
          config.animation ? 'dot-size-switch' : '',
          config.dotLocation,
          config.dotCover ? 'cover' : 'no-cover',
          config.dotColor,
          config.shape
        ]"
      >
        <div
          v-for="(item, index) in data"
          :key="index"
          class="dot"
          :class="{ 'active': config.current == index }"
        />
      </div>
      <div
        v-if="!config.dot && data.length > 1"
        class="slider-count"
        :class="[config.dotLocation, config.shape, config.dotColor]"
      >
        {{ config.current + 1 }}/{{ data.length }}
      </div>
    </div>
    <div
      v-if="config.content && data.length > 0 && data[config.current].content"
      class="slider-caption"
    >
      {{ data[config.current].content }}
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
  data () {
    return {
      base: {},
      config: {},
      data: [],
      template: '',
      time: 4000,
      ssssssss: ''
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
    }
  },
  mounted () {
    this.setData(this.res)
  },
  methods: {
    setData (val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    change (e) {
      this.config.current = e
    }
  }
}
</script>

<style scoped lang="scss">
.el-carousel {
  overflow: hidden;
}
.slider-wrap {
  position: relative;
  background: #ffffff;
}
.sliderimg {
  .slider-item {
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    .img {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .text-deploy {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba($color: #000000, $alpha: 0);

        .current-page {
          .animation1 {
            transform: translateX(0px);
            opacity: 1;
            transition: all 1s 0.3s ease-in;
          }
          .animation2 {
            transform: translateX(0px);
            opacity: 1;
            transition: all 1s 0.6s ease-in;
          }
          .animation3 {
            transform: translateX(0px);
            opacity: 1;
            transition: all 1s 0.9s ease-in;
          }
          .animation4 {
            transform: translateX(0px);
            opacity: 1;
            transition: all 1s 1.2s ease-in;
          }
        }
      }
      .template {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 40px;
        text-align: center;
        color: #fff;

        .text1 {
          font-size: 14px;
          transform: translateX(500px);
          opacity: 0;
        }
        .text2 {
          font-size: 25px;
          transform: translateX(500px);
          opacity: 0;
        }
        .text3 {
          font-size: 14px;
          transform: translateX(500px);
          opacity: 0;
        }
        .text4 {
          width: 130px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #fff;
          font-size: 12px;
          margin: 20px auto;
          transform: translateX(500px);
          opacity: 0;
        }
      }

      .template_four {
        bottom: 28%;
        .text4 {
          margin: 20px auto !important;
        }
      }
    }
    &.rounded {
      .img {
        border-radius: 5px;
      }
    }
  }
}
.slider-dot {
  display: flex;
  align-items: center;
  &.no-cover {
    padding: 12.5px;
  }
  &.center {
    justify-content: center;
  }
  &.right {
    justify-content: flex-end;
  }
  &.cover {
    padding: 0;
    position: absolute;
    bottom: 10px;
    z-index: 20;
  }
  &.cover.center {
    left: 50%;
    transform: translateX(-50%);
  }
  &.cover.left {
    left: 10px;
  }
  &.cover.right {
    right: 10px;
  }
  &.dark {
    .dot {
      background: rgba(0, 0, 0, 0.4);
    }
  }
  &.light {
    .dot {
      background: rgba(255, 255, 255, 0.7);
    }
  }
  &.circle {
    .dot {
      width: 7.5px;
      height: 7.5px;
      border-radius: 100%;
    }
  }
  &.rectangle {
    .dot {
      width: 10px;
      height: 4px;
    }
  }
  .dot {
    margin: 0 3px;
    &.active {
      background: rgba(241, 50, 0, 1);
    }
  }
  &.dot-size-switch {
    &.circle {
      .dot {
        border-radius: 10px;
      }
    }
    .dot {
      transition: all 0.3s ease;
      &.active {
        width: 15px;
      }
    }
  }
}
.slider-count {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  width: 25px;
  height: 25px;
  font-size: 12px;
  z-index: 20;
  &.left {
    left: 10px;
  }
  &.right {
    right: 10px;
  }
  &.dark {
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
  }
  &.light {
    background: rgba(255, 255, 255, 0.7);
    color: #555;
  }
  &.circle {
    border-radius: 100%;
  }
  &.rectangle {
    border-radius: 0;
  }
}
.slider-wrap {
  &.padded {
    .sliderimg {
      padding: 10px 0;
      .slider-item {
        padding: 0 10px;
      }
    }
    .slider-dot {
      &.no-cover {
        padding: 5px 22.5px;
      }
      &.cover {
        padding: 0;
        bottom: 20px;
      }
      &.cover.left {
        left: 20px;
      }
      &.cover.right {
        right: 20px;
      }
    }
    .slider-count {
      bottom: 20px;
      &.left {
        left: 20px;
      }
      &.right {
        right: 20px;
      }
    }
  }
  .sliderimg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .scale-placeholder {
    display: block;
    width: 100%;
    visibility: hidden;
    z-index: -1;
  }
}
.slider-caption {
  padding: 10px 15px;
  color: #999;
}
</style>
