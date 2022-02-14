<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>
    <div v-if="base.title" class="component-header">
      <div class="component-title" :class="{ 'middle': config.type !== 'goods' }">
        <div  style="max-width:80px">{{ base.title }}</div>
        <countdown
          v-if="config.type !== 'goods'"
          :endTime="time"
          :endText="'活动已结束'"
          :callback="function() {}"
        >
          <template slot-scope="scope">
            <div class="activity-timer" v-if="!scope.content">
              <div class="time-box">{{ scope.day ? scope.day : '00' }}</div>
              <div class="dot">天</div>
              <div class="time-box">{{ scope.hour ? scope.hour : '00' }}</div>
              <div class="dot">时</div>
              <div class="time-box">{{ scope.min ? scope.min : '00' }}</div>
              <div class="dot">分</div>
              <div class="time-box">{{ scope.sec ? scope.sec : '00' }}</div>
              <div class="dot">秒</div>
              <div>{{ text }}</div>
            </div>
            <div class="activity-timer" v-else>{{ scope.content }}</div>
          </template>
        </countdown>
        <div v-else class="subtitle">{{ base.subtitle }}</div>
      </div>
      <div class="component-more">
        <div class="three-dot"></div>
      </div>
    </div>
    <div class="component-body" :class="config.type !== 'goods' ? 'seckill' : 'goods'">
      <div class="scroll-goods" v-if="data.length>0 && data[0].imgUrl">
        <div v-for="(item, index) in data.slice(0,50)" :key="index" class="scroll-item">
          <div v-if="config.leaderboard" class="subscript">
            <div class="subscript-text">NO.{{ index + 1 }}</div>
            <img class="subscript-img" :src="subscriptImg" />
          </div>
          <div class="thumbnail">
            <img class="goods-img" :src="wximageurl + item.imgUrl" />
          </div>
          <div class="marketing-title">
            {{ item.title }}
          </div>
          <div class="marketing-title">
            {{ item.itemEnName }}
          </div>
          <div v-if="config.showPrice" class="caption">
            <template v-if="config.type !== 'goods'">
              <span class="cur">¥</span>{{ item.act_price ? item.act_price / 100 : '0.00' }}
              <span class="marketing-price">{{ item.price ? item.price / 100 : '0.00' }}</span>
            </template>
            <template v-else>
              <span class="cur">¥</span>{{ item.price ? item.price / 100 : '0.00' }}
            </template>
          </div>
          <div class="activity-label">
            <p v-for="(s, i) in item.promotionActivity" :key="i" :style="`color: ${colorPrimary};border: 1px solid ${colorPrimary}`">
              {{ s.tag_type == 'single_group' ? '团购' : '' }}
              {{ s.tag_type == 'full_minus' ? '满减' : '' }}
              {{ s.tag_type == 'full_discount' ? '满折' : '' }}
              {{ s.tag_type == 'full_gift' ? '满赠' : '' }}
              {{ s.tag_type == 'normal' ? '秒杀' : '' }}
              {{ s.tag_type == 'limited_time_sale' ? '限时特惠' : '' }}
            </p>
          </div>
        </div>
        <div class="scroll-item" v-if="base.backgroundImg">
          <div class="more">
            <img :src="base.backgroundImg" alt="" />
            <div>查看更多</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countDown from '@/components/countdown'
import { getSeckillItemList } from '@/api/promotions'
const subscript = require('@/assets/img/subscript.png')

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
    res: {
      handler(value) {
        if (value) {
          this.setData(value)
        }
      },
      deep: true
    },
    seckillId: {
      handler (val) {
        this.time = 0;
        if (val) {
          getSeckillItemList({
            seckill_id: val,
            page: 1,
            pageSize: 10,
            is_sku: 0,
            seckill_type:
              this.config.type === "limitTimeSale" ? "limited_time_sale" : ""
          }).then(res => {
            let data = res.data.data;
            if (data.activity.status === "in_sale") {
              this.time = data.activity.activity_end_time;
              this.text = "后结束";
            } else if (data.activity.status === "in_the_notice") {
              this.time = data.activity.activity_start_time;
              this.text = "后开始";
            } else {
              this.time = 0;
            }
       
            this.data.splice(data.length);
            this.data=this.data; 
           
            data.list.forEach((item, index) => {
              let obj = {
                imgUrl: item.item_pic,
                title: item.item_title,
                price: item.price,
                act_price: item.activity_price,
                goodsId: item.item_id,
                distributor_id:item.distributor_id
              };
              this.data.splice(index, 1, obj);
            }); 
          });
        }
      },
      deep: true
    }
  },
  data() {
    return {
      base: {},
      config: '',
      data: [],
      seckillId: '',
      text: '',
      time: 0,
      subscriptImg: subscript,
      colorPrimary: ''
    }
  },
  components: {
    countdown: countDown
  },
  methods: {
    setData(val) {
      this.base = val.base;
      this.config = val.config;
      this.data = val.data; 
      this.seckillId = val.config.seckillId; 
    }
  },
  mounted() {
    this.setData(this.res)
    this.colorPrimary = this.$store.getters.color_theme.primary
  }
}
</script>

<style scoped lang="scss">
.goods {
  position: relative;
  //height: 115px;
}
.seckill {
  position: relative;
  // height: 130px;
}
.activity-timer {
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 11px;
  .time-box {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 3px;
    background: #333;
    color: #fff;
    border-radius: 2px;
    font-size: 10px;
    font-family: sans-serif;
  }
  .dot {
    padding: 0 2px;
  }
}
.scroll-goods {
  // position: absolute;
  width: 100%;
  white-space: nowrap;
  overflow-x: scroll;
  display: flex;

  .scroll-item {
    display: inline-block;
    position: relative;
    padding: 3px 0 0 3px;
    margin-left: 5px;

    .activity-label {
      display: flex;
      flex-wrap: wrap;
      p {
        border-radius: 4px;
        padding: 0px 4px;
        font-size: 10px;
        line-height: 16px;
        margin: 0px 2px 2px 0px;
      }
    }
    &:first-child {
      margin-left: 10px;
    }
    &:last-child {
      margin-right: 10px;
    }
  }
  .subscript {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    z-index: 90;
    .subscript-img {
      width: 100%;
      height: 100%;
    }
    .subscript-text {
      position: absolute;
      top: 4px;
      transform: rotate(-45deg);
      color: #fff;
      font-size: 12px;
    }
  }
  .thumbnail {
    position: relative;
    width: 145px;
    border-radius: 6px;
    border: 1px solid #f5f5f5;
    &::after {
      display: flex;
      padding-top: 100%;
      content: '';
    }
    .goods-img {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  .marketing-title {
    // word-break: break-all;
    // word-wrap: break-word;
    white-space: normal;
    width: 120px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 30px;
    margin-top: 5px;
    line-height: 1.4;
    font-size: 12px;
    color: #6e6e6e;
  }

  .caption {
    padding-top: 3px;
    height: 30px;
    font-size: 14px;
    color: #00081c;
    font-weight: 600;
    .cur {
      font-size: 10px;
    }
    .marketing-price {
      padding-left: 5px;
      font-size: 11px;
      color: #ccc;
      text-decoration: line-through;
      font-weight: 500;
    }
  }
}
.more {
  width: 143px;
  height: 143px;
  text-align: center;
  line-height: 143px;
  background: #f4f4f4;
  position: relative;
  div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 143px;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
