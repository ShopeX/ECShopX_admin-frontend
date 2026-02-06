<template>
    <div class="row-goods" :style="customStyle">
        <!-- 标题区域 -->
        <div v-if="showHeader" class="row-goods-header">
            <div class="header-title">
                <img v-if="value.titleText && value.titleText.type === 'image' && value.titleText.image"
                    :src="value.titleText.image" class="header-image" alt="">
                <span v-if="value.titleText && value.titleText.type === 'text' && value.titleText.text"
                    :style="{ color: value.titleColor }" class="header-text">
                    {{ value.titleText?.text }}
                </span>
            </div>
            <div v-if="value.moreBtn && value.moreBtn.show" class="header-more" :style="{ color: value.moreBtn.color }">
                查看更多<el-icon class="el-icon-arrow-right" />
            </div>
        </div>

        <!-- 商品列表 -->
        <div class="row-goods-list">
            <div v-for="(item, index) in goodsList" :key="item.item_id || item.itemId || index" class="row-goods-item">
                <!-- 商品图片 -->
                <div class="goods-img-wrapper">
                    <img :src="item.main_img || item.pics?.[0] || ''" class="goods-image" alt="">
                    <!-- 已售罄标签 -->
                    <div v-if="isSoldOut(item)" class="sold-out-mask">
                        <span class="sold-out-text">已售罄</span>
                    </div>
                </div>

                <!-- 商品信息 -->
                <div class="goods-info">
                    <!-- 商品名称 -->
                    <div class="goods-name">
                        {{ item.item_name || item.itemName || '' }}
                    </div>

                    <!-- 标签区域 -->
                    <div class="goods-tags" v-if="getTags(item).length > 0">
                        <span v-for="(tag, tagIndex) in getTags(item)" :key="tagIndex" class="goods-tag"
                            :style="getTagStyle(tag.type)">
                            {{ tag.name }}
                        </span>
                    </div>

                    <!-- 价格区域 -->
                    <div class="goods-price-wrapper">
                        <div class="current-price">
                            <span class="price-symbol">¥</span>
                            <span class="price-value">{{ formatPrice(item.price) }}</span>
                        </div>
                        <div class="original-price" v-if="item.market_price && item.market_price > item.price">
                            {{ formatPrice(item.market_price) }}
                        </div>
                        <div class="discount-tag" v-if="getDiscount(item)">
                            {{ getDiscount(item) }}
                            <span class="discount-tag-text">折</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RowGoods',
    props: {
        value: {
            type: Object,
            default: () => ({})
        },
        goodsList: {
            type: Array,
            default: () => []
        },
        customStyle: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        showHeader() {
            console.log(this.value.titleText, this.value.moreBtn, 'rowgoods titleText, moreBtn')
            return (this.value.titleText && (this.value.titleText.text || this.value.titleText.image)) || (this.value.moreBtn && this.value.moreBtn.show)
        }
    },
    methods: {
        // 格式化价格（除以100）
        formatPrice(price) {
            if (!price) return '0.00'
            const numPrice = typeof price === 'string' ? parseFloat(price) : price
            return (numPrice / 100).toFixed(2)
        },
        // 判断是否已售罄
        isSoldOut(item) {
            return item.item_total_store === 0 || item.store === 0 || item.is_stock === 0
        },
        // 获取标签列表
        getTags(item) {
            const tags = []

            // 从 promotion_activity 获取标签
            if (item.promotion_activity && Array.isArray(item.promotion_activity)) {
                item.promotion_activity.forEach(act => {
                    if (act.tag_name) {
                        tags.push({
                            name: act.tag_name,
                            type: act.tag_type || 'default',
                        })
                    }
                })
            }

            // 从 tags 字段获取
            if (item.tags && Array.isArray(item.tags)) {
                item.tags.forEach(tag => {
                    if (tag.tag_name || tag.name) {
                        tags.push({
                            name: tag.tag_name || tag.name,
                            type: tag.tag_type || 'default',
                        })
                    }
                })
            }

            // 示例标签（实际使用时可删除）

            return tags.slice(0, 3) // 最多显示3个标签
        },

        // 获取标签样式
        getTagStyle(tag) {
            console.log(tag, 'tag')
            const colorMap = {
                'marketing': {
                    color: 'var(--primary)',
                    borderColor: 'rgba(212,0,59,0.15)',
                    background: 'rgba(212,0,59,0.1)'
                },
                'single_group': {
                    color: 'var(--primary)',
                    borderColor: 'rgba(212,0,59,0.15)',
                    background: 'rgba(212,0,59,0.1)'
                },
                'coupon': {
                    color: '#CB9800',
                    borderColor: 'rgba(203,152,0,0.15)',
                    background: 'rgba(203,152,0,0.1)'
                },
                'promotion': {
                    color: '#FF6505',
                    borderColor: 'rgba(255,101,5,0.15)',
                    background: 'rgba(255,101,5,0.1)'
                }
            }
            return colorMap[tag] || colorMap['default']
        },
        // 计算折扣
        getDiscount(item) {
            if (!item.market_price || !item.price) return ''
            const marketPrice = typeof item.market_price === 'string' ? parseFloat(item.market_price) : item.market_price
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
            if (marketPrice <= 0 || price >= marketPrice) return ''
            const discount = (price / marketPrice * 10).toFixed(1)
            return `${discount}`
        }
    }
}
</script>

<style lang="scss" scoped>
.row-goods {
    width: 100%;
    box-sizing: border-box;
    border-radius: 8px;

    .row-goods-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 9px;

        .header-title {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 15px;

            .header-image {
                height: 18px;
            }

            .header-text {
                font-family: PingFang SC, PingFang SC;
                font-weight: 600;
                font-size: 15px;
            }
        }

        .header-more {
            font-size: 13px;
            cursor: pointer;
        }
    }

    .row-goods-list {
        display: flex;
        flex-direction: column;
        gap: 9px;
    }

    .row-goods-item {
        display: flex;
        flex-direction: row;
        background: #FFFFFF;
        border-radius: 8px;
        overflow: hidden;
        height: 114px;
        box-sizing: border-box;

        .goods-img-wrapper {
            width: 114px;
            height: 114px;
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
            background: #F5F5F5;

            .goods-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .sold-out-mask {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;

                .sold-out-text {
                    color: #FFFFFF;
                    font-size: 14px;
                    font-weight: 500;
                }
            }
        }

        .goods-info {
            flex: 1;
            padding: 12px 8px 18px 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-width: 0;
            box-sizing: border-box;
            height: 100%;

            .goods-name {
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 13px;
                color: #1A1A1A;
                line-height: 18px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                height: 36px;
            }

            .goods-tags {
                display: flex;
                flex-wrap: nowrap;
                overflow: hidden;
                gap: 4px;
                margin-top: 6px;
                margin-bottom: 12px;

                .goods-tag {
                    display: inline-block;
                    padding: 0 4px;
                    line-height: 13px;
                    font-size: 10px;
                    border: 1px solid;
                    border-radius: 2px;
                    white-space: nowrap;
                }
            }

            .goods-price-wrapper {
                display: flex;
                align-items: baseline;
                gap: 4px;
                margin-top: auto;

                .current-price {
                    display: flex;
                    align-items: baseline;
                    color: #1A1A1A;
                    gap: 1;

                    .price-symbol {
                        font-family: D-DIN-PRO, D-DIN-PRO;
                        font-weight: 500;
                        font-size: 13px;
                        line-height: 1;
                    }

                    .price-value {
                        font-family: D-DIN-PRO, D-DIN-PRO;
                        font-weight: 600;
                        font-size: 17px;
                        line-height: 1;
                    }
                }

                .original-price {
                    font-family: D-DIN-PRO, D-DIN-PRO;
                    font-weight: 400;
                    font-size: 12px;
                    color: #BFBFBF;
                    text-decoration: line-through;
                }

                .discount-tag {
                    display: flex;
                    align-items: center;
                    font-family: D-DIN-PRO, D-DIN-PRO;
                    font-weight: 500;
                    font-size: 12px;
                    color: var(--primary);

                    .discount-tag-text {
                        font-size: 9px;
                        color: var(--primary);
                        font-family: PingFang SC, PingFang SC;
                        font-weight: 500;
                    }
                }
            }
        }
    }
}
</style>
