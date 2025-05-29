<style lang="scss" src="./index.scss" />

<template>
    <div class="wgt-shelves">
        <div v-if="value?.animation == 'horizontal'" class="wgt-shelves-body" :style="outerStyle">
            <div class="wgt-shelves-normal" :style="innerStyle">
                <div class="wgt-shelves-header wgt-shelves-normal-header"
                    :style="`marginBottom:${value?.innerPadding?.paddedt}px`">
                    <div class="wgt-shelves-seckill-header">
                        <div v-if="!['image'].includes(value.titleText.type)" class="wgt-shelves-header-title"
                            :style="{ color: value.titleColor }">
                            {{ value.titleText.text }}
                        </div>
                        <el-image v-if="value.titleText.type == 'image'" :src="value.titleText.image" alt="图片"
                            class="header-image" fit="cover">
                            <div slot="error" class="image-slot" />
                        </el-image>
                        <div v-if="value?.dataType == 'seckill'" class="wgt-shelves-seckill-header-time">
                            <span class="wgt-shelves-seckill-header-time-text">01</span>
                            <span class="wgt-shelves-seckill-header-time-unit">天</span>
                            <span class="wgt-shelves-seckill-header-time-text">03</span>
                            <span class="wgt-shelves-seckill-header-time-unit">:</span>
                            <span class="wgt-shelves-seckill-header-time-text">21</span>
                            <span class="wgt-shelves-seckill-header-time-unit">:</span>
                            <span class="wgt-shelves-seckill-header-time-text">43</span>
                        </div>
                    </div>

                    <div class="wgt-shelves-header-more" :style="{ color: value?.moreBtn?.color }">
                        <span class="wgt-shelves-more-text">查看更多</span>
                        <i class="el-icon-arrow-right" />
                    </div>
                </div>
                <div v-if="!['group', 'seckill'].includes(value?.dataType)" class="wgt-shelves-normal-list">
                    <div v-for="(item, index) in list" :key="index" class="wgt-shelves-normal-item">
                        <div class="wgt-shelves-normal-item-img">
                            <el-image :src="item?.pics?.[0] || ''" alt="图片" class="goods-image" fit="cover">
                                <div slot="error" class="image-slot" />
                            </el-image>
                            <div class="goods-active">{{ setActivity(item) }}</div>
                        </div>
                        <div class="goods-name">{{ item?.item_name }}</div>
                        <div class="goods-price">
                            <span class="goods-price-unit">¥</span>
                            <span class="goods-price-text">{{ (item?.activity_price || item?.price) / 100 }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="['group', 'seckill'].includes(value?.dataType)" class="wgt-shelves-seckill-list">
                    <div v-for="(item, index) in list" :key="index" class="wgt-shelves-seckill-item">
                        <div class="wgt-shelves-seckill-item-img">
                            <el-image :src="item?.pics?.[0] || ''" alt="图片" class="goods-image" fit="cover">
                                <div slot="error" class="image-slot" />
                            </el-image>
                            <div v-if="value?.dataType == 'seckill'" class="goods-active">
                                {{ setActivity(item) }}
                            </div>
                            <div v-if="value?.dataType == 'group'" class="goods-group-active">
                                3人团
                            </div>
                        </div>
                        <div class="goods-seckill-info">
                            <div class="goods-name">{{ item?.item_name }}</div>
                            <div class="goods-price">
                                <span class="goods-price-seckill">秒杀价</span>
                                <span class="goods-price-unit">¥</span>
                                <span class="goods-price-text">{{ (item?.activity_price || item?.price) / 100 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div v-if="value?.limitedTime" class="wgt-shelves-limited" :style="limitedTimeTitleStyle">
                <div class="wgt-shelves-limited-title">{{ value.limitedTimeTitle }}</div>
                <div class="wgt-shelves-limited-body">
                    <div class="wgt-shelves-limited-body-img">
                        <el-image :src="seckilldata?.pics?.[0] || ''" alt="图片" class="goods-image" fit="cover">
                            <div slot="error" class="image-slot" />
                        </el-image>
                    </div>
                    <div class="wgt-shelves-limited-body-goods-name">{{ seckilldata?.item_name }}</div>
                    <div class="wgt-shelves-limited-body-goods-price">
                        <span class="wgt-shelves-limited-body-goods-price-unit">¥</span>
                        <span class="wgt-shelves-limited-body-goods-price-text">{{ seckilldata?.market_price / 100
                            }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="value?.animation == 'vertical'" class="wgt-shelves-body" :style="outerStyle">
            <div class="wgt-shelves-vertical" :style="innerStyle">
                <div class="wgt-shelves-header" :style="`marginBottom:${value?.innerPadding?.paddedt}px`">
                    <div v-if="!['image'].includes(value.titleText.type)" class="wgt-shelves-header-title"
                        :style="{ color: value.titleColor }">
                        {{ value.titleText.text }}
                    </div>
                    <div v-if="value.titleText.type == 'image'" class="wgt-shelves-seckill-header">
                        <el-image :src="value.titleText.image" alt="图片" class="header-image" fit="cover">
                            <div slot="error" class="image-slot" />
                        </el-image>
                    </div>
                    <div class="wgt-shelves-header-more" :style="{ color: value?.moreBtn?.color }">
                        <span class="wgt-shelves-more-text">查看更多</span>
                        <i class="el-icon-arrow-right" />
                    </div>
                </div>
                <!-- 一行一个 -->
                <div v-if="value?.goodsSort == 'one'" class="wgt-shelves-vertical-one">
                    <div v-for="(item, index) in list" :key="index" class="wgt-shelves-vertical-one-item">
                        <div class="wgt-shelves-vertical-one-item-img">
                            <el-image :src="item?.pics?.[0] || ''" alt="图片" class="goods-image" fit="cover">
                                <div slot="error" class="image-slot" />
                            </el-image>
                        </div>
                        <div class="wgt-shelves-vertical-one-item-info">
                            <div class="wgt-shelves-vertical-one-item-info-name">
                                {{ item?.item_name }}
                            </div>
                            <div class="goods-tags">
                                <div class="goods-tag goods-tag-one">
                                    {{ setActivity(item) }}
                                </div>
                            </div>
                            <div class="goods-price-wrapper">
                                <div class="goods-price">
                                    <span class="goods-price-unit">¥</span>
                                    <span class="goods-price-text">{{ (item?.activity_price || item?.price) / 100
                                        }}</span>
                                </div>
                                <div class="goods-price-line">{{ item?.market_price / 100 }}</div>
                                <div class="goods-price-discount">
                                    <span>5</span>
                                    <span class="goods-price-discount-unit">折</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 一行两个 -->
                <div v-if="value?.goodsSort == 'two'" class="wgt-shelves-vertical-two">
                    <div class="grid-container">
                        <div v-for="(item, index) in limitedTimeList?.leftList" :key="index"
                            class="wgt-shelves-vertical-two-item">
                            <div class="wgt-shelves-vertical-two-item-img">
                                <el-image :src="item?.pics?.[0] || ''" alt="图片" class="goods-image" fit="cover">
                                    <div slot="error" class="image-slot" />
                                </el-image>
                            </div>
                            <div class="wgt-shelves-vertical-two-item-info">
                                <div class="wgt-shelves-vertical-two-item-info-name">
                                    {{ item?.item_name }}
                                </div>
                                <div class="goods-tags">
                                    <div class="goods-tag goods-tag-one">{{ setActivity(item) }}</div>
                                </div>
                                <div class="goods-price-wrapper">
                                    <div class="goods-price">
                                        <span class="goods-price-unit">¥</span>
                                        <span class="goods-price-text">{{ (item?.activity_price || item?.price) / 100
                                            }}</span>
                                    </div>
                                    <div class="goods-price-line">{{ item?.market_price / 100 }}</div>
                                    <div class="goods-price-discount">
                                        <span>5</span>
                                        <span class="goods-price-discount-unit">折</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid-container">
                        <div v-for="(item, index) in limitedTimeList?.rightList" :key="index"
                            class="wgt-shelves-vertical-two-item">
                            <div class="wgt-shelves-vertical-two-item-img">
                                <el-image :src="item?.pics?.[0] || ''" alt="图片" class="goods-image" fit="cover">
                                    <div slot="error" class="image-slot" />
                                </el-image>
                            </div>
                            <div class="wgt-shelves-vertical-two-item-info">
                                <div class="wgt-shelves-vertical-two-item-info-name">
                                    {{ item?.item_name }}
                                </div>
                                <div class="goods-tags">
                                    <div class="goods-tag goods-tag-one">{{ setActivity(item) }}</div>
                                </div>
                                <div class="goods-price-wrapper">
                                    <div class="goods-price">
                                        <span class="goods-price-unit">¥</span>
                                        <span class="goods-price-text">{{ (item?.activity_price || item?.price) / 100
                                            }}</span>
                                    </div>
                                    <div class="goods-price-line">{{ item?.market_price / 100 }}</div>
                                    <div class="goods-price-discount">
                                        <span>5</span>
                                        <span class="goods-price-discount-unit">折</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 一行三个 -->
                <div v-if="value?.goodsSort == 'three'" class="wgt-shelves-vertical-three">
                    <div v-for="(item, index) in list" :key="index" class="wgt-shelves-vertical-three-item">
                        <div class="wgt-shelves-vertical-three-item-img">
                            <el-image :src="item?.pics?.[0] || ''" alt="图片" class="goods-image" fit="cover">
                                <div slot="error" class="image-slot" />
                            </el-image>
                        </div>
                        <div class="wgt-shelves-vertical-three-item-info">
                            <div class="wgt-shelves-vertical-three-item-info-name"
                                :class="item?.promotion_activity?.length > 0 ? 'wgt-shelves-vertical-three-item-info-name-line' : ''">
                                {{ item?.item_name }}
                            </div>
                            <div class="goods-tags">
                                <div v-if="item?.promotion_activity?.length > 0" class="goods-tag goods-tag-one">
                                    {{ setActivity(item) }}</div>
                            </div>
                            <div class="goods-price-wrapper">
                                <div class="goods-price">
                                    <span class="goods-price-unit">¥</span>
                                    <span class="goods-price-text">{{ (item?.activity_price || item?.price) / 100
                                        }}</span>
                                </div>
                                <div class="goods-price-line">{{ item?.market_price / 100 }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { isNull } from 'lodash-es'
import config from './config'
import groupIcon from '@/assets/imgs/wgt/group.png'
import seckillIcon from '@/assets/imgs/wgt/seckill.png'
export default {
    name: 'Shelves',
    wgtName: '货架',
    wgtDesc: '',
    wgtIcon: 'wgt-store',
    wgtType: 2,
    config: config,
    props: {
        value: [Object, Array]
    },
    data() {
        return {
            list: [],
            limitedTimeList: [],
            seckilldata: null,
            groupIcon: groupIcon,
            seckillIcon
        }
    },
    computed: {
        outerStyle() {
            const { outerMargin, outerBackground } = this.value
            return {
                paddingTop: outerMargin.paddedt + 'px',
                paddingBottom: outerMargin.paddedb + 'px',
                paddingLeft: outerMargin.paddedl + 'px',
                paddingRight: outerMargin.paddedr + 'px',
                backgroundColor: outerBackground.color,
                backgroundImage: outerBackground.image ? `url(${outerBackground.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        },
        innerStyle() {
            const { innerPadding, innerBackground, } = this.value
            return {
                paddingLeft: innerPadding.paddedl + 'px',
                paddingRight: innerPadding.paddedr + 'px',
                paddingTop: innerPadding.paddedt + 'px',
                paddingBottom: innerPadding.paddedb + 'px',
                backgroundColor: innerBackground?.type == 'solid' ? innerBackground.color : 'none',
                backgroundImage: innerBackground?.type == 'gradient' ? `linear-gradient(${innerBackground.startColor}, ${innerBackground.endColor})` : innerBackground?.type == 'image' ? `url(${innerBackground.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        },
        limitedTimeTitleStyle() {
            const { limitedTimeBackground, innerPadding } = this.value
            return {
                backgroundColor: limitedTimeBackground?.type == 'solid' ? limitedTimeBackground.color : 'none',
                backgroundImage: limitedTimeBackground?.type == 'gradient' ? `linear-gradient(${limitedTimeBackground.startColor}, ${limitedTimeBackground.endColor})` : 'none',
                paddingLeft: innerPadding.paddedl + 'px',
                paddingRight: innerPadding.paddedr + 'px',
                paddingTop: innerPadding.paddedt + 'px',
                paddingBottom: innerPadding.paddedb + 'px',
            }
        },
        isShowLimited() {
            return this.value?.limitedTime
        }


    },
    watch: {
        'value.data': {
            handler(newVal) {
                if (newVal) {
                    this.getList()
                }
            },
            deep: true,
            immediate: true
        },
        'value.animation': {
            handler(newVal) {
                if (newVal) {
                    this.getList()
                }
            },
            deep: true
        },
        'value.dataType': {
            handler(newVal) {
                if (newVal) {
                    this.list = []
                    this.limitedTimeList = null
                    console.log(newVal, 'newVal')
                    if (newVal == 'sales' || newVal == 'group') {
                        this.getList()
                    }
                }
            }
        },
        'value.limitedTimeData': {
            handler(newVal) {
                if (newVal) {
                    this.getSeckilldata()
                }
            },
            immediate: true,
            deep: true
        },
        'value.goodsSort': {
            handler(newVal) {
                if (newVal) {
                    this.getList()
                }
            },
        },
    },
    methods: {
        async getList() {
            if (this.value?.dataType == 'sales' || this.value?.data?.id) {
                const query = {
                    data_type: this.value?.dataType,
                    data_value: ['items', 'price'].includes(this.value?.dataType) ? this.value?.data.id.split(',') : this.value?.data.id,
                    regionauth_id: this.$route.query.regionauth_id
                }
                const res = await this.$api.template.getShelvesGoods(query)
                console.log(res, 'res')
                if (this.value?.animation == 'vertical' && this.value?.goodsSort == 'two') {
                    const list = res
                    const resLeftList = list.filter((item, index) => {
                        if (index % 2 == 0) {
                            return item
                        }
                    })
                    const resRightList = list.filter((item, index) => {
                        if (index % 2 == 1) {
                            return item
                        }
                    })
                    this.limitedTimeList = {
                        leftList: resLeftList,
                        rightList: resRightList
                    }
                } else {
                    console.log(res, 'res')
                    this.list = res
                }
            }
        },
        async getSeckilldata() {
            if (!this.value?.limitedTime) return
            const query = {
                data_type: 'seckill',
                data_value: this.value?.limitedTimeData.id,
                regionauth_id: this.$route.query.regionauth_id
            }
            const res = await this.$api.template.getShelvesGoods(query)
            this.seckilldata = res[0] || null
        },
        setActivity(item) {
            // item?.promotion_activity[0]?.tag_name
            // return item?.promotion_activity[0]?.activity_price
            for (let i = 0; i < item?.promotion_activity?.length; i++) {
                if (item?.promotion_activity[i]?.tag_name) {
                    return item?.promotion_activity[i]?.tag_name
                }
            }
        }
    }
}
</script>
