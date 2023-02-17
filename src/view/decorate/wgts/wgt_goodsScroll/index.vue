<template>
  <div :class="{'wgt-goods-scroll': true, 'padded': value.padded}">
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <countdown v-if="value.goodsSetting.type !== 'goods'" :end-time="time" :end-text="'活动已结束'" :callback="function () {}">
        <template slot-scope="scope">
          <div v-if="!scope.content" class="wgt-goods-scroll-timer">
            <div class="timer">{{ scope.day ? scope.day : '00' }} </div>
            <div class="dot">天</div>
            <div class="timer">{{ scope.hour ? scope.hour : '00' }}</div>
            <div class="dot">时</div>
            <div class="timer">{{ scope.min ? scope.min : '00' }}</div>
            <div class="dot">分</div>
            <div class="timer">{{ scope.sec ? scope.sec : '00' }}</div>
            <div class="dot"> 秒 </div>
            <div>{{ text }}</div>
          </div>
          <div v-else class="wgt-goods-scroll-timer">{{ scope.content }}</div>
        </template>
      </countdown>
      <span v-else class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd" :class="{'spaced': value.spaced}">
      <div class="goods-list">
        <div v-if="value.goodsSetting.data && value.goodsSetting.data.length > 0" class="scroll-goods">
          <div
            v-for="(item, index) in value.goodsSetting.data"
            :key="`scroll-item__${index}`"
            class="scroll-item"
          >
            <div
              v-if="value.leaderboard && value.goodsSetting.type == 'goods'"
              class="goods-leaderboard"
            >
              <div class="goods-leaderboard-text">
                NO.{{ index + 1 }}
              </div>
              <SpImage :src="subscriptImg" :width="40" :height="40" />
            </div>
            <div class="goods-imgs">
              <SpImage :src="item.imgUrl" :width="145" :height="145" />
            </div>
            <div class="goods-title">{{item.title}}</div>
            <div v-if="item.itemEnName" class="goods-title">{{item.itemEnName}}</div>
            <div v-if="value.showPrice" class="goods-caption" >
              <template v-if="value.goodsSetting.type !== 'goods'">
                <span class="cur">¥</span>{{ item.act_price ? item.act_price / 100 : '0.00' }}
                <span class="marketing-price">{{ item.price ? item.price / 100 : '0.00' }}</span>
              </template>
              <template v-else>
                <span class="cur">¥</span>{{ item.price ? item.price / 100 : '0.00' }}
              </template>
            </div>
            <div class="activity-label">
              <p
                v-for="(s, i) in item.promotionActivity"
                :key="i"
                :style="`color: ${colorPrimary};border: 1px solid ${colorPrimary}`"
              >
                {{ s.tag_type == 'single_group' ? '团购' : '' }}
                {{ s.tag_type == 'full_minus' ? '满减' : '' }}
                {{ s.tag_type == 'full_discount' ? '满折' : '' }}
                {{ s.tag_type == 'full_gift' ? '满赠' : '' }}
                {{ s.tag_type == 'normal' ? '秒杀' : '' }}
                {{ s.tag_type == 'limited_time_sale' ? '限时特惠' : '' }}
              </p>
            </div>
          </div>
          <div v-if="value.backgroundImg" class="scroll-item" >
            <div class="goods-more">
              <SpImage :src="value.backgroundImg" :width="145" :height="145" />
              <div>查看更多</div>
            </div>
          </div>
        </div>
        <div v-else class="scroll-goods">
          <div
            v-for="(item, index) in [1, 2]"
            :key="`scroll-item__${index}`"
            class="scroll-item"
          >
            <div
              v-if="value.leaderboard && value.goodsSetting.type == 'goods'"
              class="goods-leaderboard"
            >
              <div class="goods-leaderboard-text">
                NO.{{ index + 1 }}
              </div>
              <SpImage :src="subscriptImg" :width="40" :height="40" />
            </div>
            <div class="goods-imgs">
              <SpImage :width="145" :height="145" />
            </div>
            <div class="goods-title">标题</div>
            <div v-if="value.showPrice" class="goods-caption">
              <span class="cur">¥0.00</span>
            </div>
          </div>
          <!-- <div v-if="value.backgroundImg" class="scroll-item" >
            <div class="goods-more">
              <SpImage :src="value.backgroundImg" :width="145" :height="145" />
              <div>查看更多</div>
            </div>
          </div> -->
        </div>
      </div>
      {{JSON.stringify(value)}}
    </div>
  </div>
</template>

<script>
import config from './config'
import countDown from '@/components/countdown'
const subscript = require('@/assets/img/subscript.png')
import { getSeckillItemList } from '@/api/promotions'

export default {
  name: 'GoodsScroll',
  wgtName: '商品滚动',
  wgtDesc: '',
  wgtIcon: 'wgt-goods-scroll',
  config: config,
  props: {
    value: [Object, Array]
  },
  components: {
    countdown: countDown
  },
  data() {
    return {
      seckillId: '',
      text: '',
      time: 0,
      subscriptImg: subscript,
      colorPrimary: '',
      data: [],
      type: ''
    }
  },
  watch: {
    value: {
      handler (nVal) {
        this.data = nVal.goodsSetting.data
        this.seckillId = nVal.goodsSetting.seckillId
        this.type = nVal.goodsSetting.type
      },
      deep: true,
      immediate: true
    },
    type: {
      handler (nVal) {
        this.time = 0
      }
    },
    seckillId: {
      handler (nVal) {
        if (nVal) {
          this.time = 0
          getSeckillItemList({
            seckill_id: nVal,
            page: 1,
            pageSize: 10,
            is_sku: 0,
            seckill_type: this.value.goodsSetting.type === 'limitTimeSale' ? 'limited_time_sale' : ''
          }).then((res) => {
            let data = res.data.data
            if (data.activity.status === 'in_sale') {
              this.time = data.activity.activity_end_time
              this.text = '后结束'
            } else if (data.activity.status === 'in_the_notice') {
              this.time = data.activity.activity_start_time
              this.text = '后开始'
            } else {
              this.time = 0
            }

            this.data.splice(data.length)
            this.data = this.data
            console.log(this.time, 'time')

            data.list.forEach((item, index) => {
              let obj = {
                imgUrl: item.item_pic,
                title: item.item_title,
                price: item.price,
                act_price: item.activity_price,
                goodsId: item.item_id,
                distributor_id: item.distributor_id
              }
              this.data.splice(index, 1, obj)
            })
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.colorPrimary = this.$store.getters.color_theme.primary
  },
}
</script>
<style lang="scss" src="./index.scss"></style>