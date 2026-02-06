<template>
    <div class="group-goods" :style="customStyle">
        <!-- 头部区域 -->
        <div class="group-header">
            <div class="group-header-left">
                <div class="header-title">
                    <img v-if="value.titleText && value.titleText.type === 'image' && value.titleText.image"
                        :src="value.titleText.image" class="header-image" alt="">
                    <span v-if="value.titleText && value.titleText.text && value.titleText.type === 'text'" class="header-text"
                        :style="{ color: value.titleColor }">
                        {{ value.titleText?.text }}
                    </span>
                </div>
            </div>
            <!-- 查看更多 -->
            <div v-if="value.moreBtn && value.moreBtn.show" class="header-more" :style="{ color: value.moreBtn.color }">
                查看更多<el-icon class="el-icon-arrow-right" />
            </div>
        </div>

        <!-- 商品列表 -->
        <div class="group-goods-list" ref="goodsListRef">
            <div v-for="(item, index) in goodsList" :key="item.item_id || item.itemId || index"
                class="group-goods-item">
                <!-- 自定义标签 -->
                <div v-if="getCustomTag(item)" class="custom-tag">
                    {{ getCustomTag(item) }}
                </div>

                <!-- 商品图片 -->
                <div class="goods-img-wrapper">
                    <img :src="item.main_img || item.pics?.[0] || ''" class="goods-image" alt="">
                </div>

                <!-- 商品信息 -->
                <div class="goods-info">
                    <div class="goods-name-wrapper">
                        <!-- 商品名称 -->
                        <div class="goods-name">
                            {{ item.item_name || item.itemNam }}
                        </div>
                    </div>

                    <!-- 拼团价 -->
                    <div class="goods-group-price">
                        <span class="price-label">拼团价</span>
                        <span class="price-symbol">¥</span>
                        <span class="price-value">{{ formatGroupPrice(item) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GroupGoods',
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
    methods: {
        // 获取自定义标签
        getCustomTag(item) {
            // 优先从 tags 数组中获取
            if (item.tags && item.tags.length > 0) {
                const tag = item.tags.find(t => t.tag_name)
                if (tag && tag.tag_name) {
                    return tag.tag_name
                }
            }
            // 从 promotion_activity 中获取 tag_name
            if (item.promotion_activity && item.promotion_activity.length > 0) {
                const groupActivity = item.promotion_activity.find(act => act.tag_type === 'single_group')
                if (groupActivity && groupActivity.tag_name) {
                    return groupActivity.tag_name
                }
            }
            return null
        },
        // 格式化拼团价格
        formatGroupPrice(item) {
            // 优先从 promotion_activity 中获取拼团价格
            if (item.promotion_activity && item.promotion_activity.length > 0) {
                const groupActivity = item.promotion_activity.find(act => act.tag_type === 'single_group')
                if (groupActivity && groupActivity.activity_price) {
                    const price = typeof groupActivity.activity_price === 'string'
                        ? parseFloat(groupActivity.activity_price)
                        : groupActivity.activity_price
                    // 价格通常以分为单位，需要除以100
                    return (price / 100).toFixed(2)
                }
            }
            // 如果没有拼团活动价格，使用 activity_price
            if (item.activity_price) {
                const price = typeof item.activity_price === 'string'
                    ? parseFloat(item.activity_price)
                    : item.activity_price
                return (price / 100).toFixed(2)
            }
            // 最后使用普通价格
            if (item.price) {
                const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
                return (price / 100).toFixed(2)
            }
            return '0.00'
        },
    }
}
</script>

<style lang="scss" scoped>
.group-goods {
    width: 100%;
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        color: #FFFFFF;
        height: 21px;

        .group-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .header-title {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 18px;

            .header-image {
                height: 18px;
                margin-right: 4px;
            }

            .header-text {
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                font-size: 15px;
                color: #FFFFFF;
            }
        }

        .header-more {
            font-size: 13px;
            cursor: pointer;
            font-weight: 500;
            white-space: nowrap;
            color: #FFFFFF;
        }
    }

    .group-goods-list {
        display: flex;
        gap: 5px;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        /* Firefox */
        -ms-overflow-style: none;
        /* IE and Edge */

        &::-webkit-scrollbar {
            display: none;
            /* Chrome, Safari, Opera */
        }
    }

    .group-goods-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 99px;
        width: 99px;
        flex-shrink: 0;
        border-radius: 6px;
        overflow: hidden;
        background-color: #fff;
        position: relative;
        box-sizing: border-box;

        .custom-tag {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: 500;
            padding: 0px 6px;
            line-height: 14px;
            height: 14px;
            background: var(--primary);
            border-radius: 6px 0px 6px 0px;
        }

        .goods-img-wrapper {
            width: 100%;
            height: 99px;
            position: relative;
            margin-bottom: 4px;
            overflow: hidden;
            background: #F5F5F5;

            .goods-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .goods-info {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0 6px 8px;

            .goods-name-wrapper {
                width: 100%;
                margin-bottom: 2px;
                display: flex;
                align-items: start;

                .goods-name {
                    width: 100%;
                    line-height: 17px;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 1;
                    line-clamp: 1;
                    -webkit-box-orient: vertical;
                    height: 17px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    font-size: 12px;
                    color: #1A1A1A;
                }
            }

            .goods-group-price {
                display: flex;
                align-items: baseline;
                width: 100%;

                .price-label {
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 400;
                    font-size: 10px;
                    color: var(--primary);
                    margin-right: 2px;
                }

                .price-symbol {
                    font-family: D-DIN-PRO, D-DIN-PRO;
                    font-weight: 500;
                    font-size: 11px;
                    color: var(--primary);
                    line-height: 1;
                    margin-right: 1px;
                }

                .price-value {
                    font-family: D-DIN-PRO, D-DIN-PRO;
                    font-weight: 600;
                    font-size: 15px;
                    color: var(--primary);
                    line-height: 1;
                }
            }
        }
    }
}
</style>
