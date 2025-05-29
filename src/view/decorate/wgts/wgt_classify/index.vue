<style lang="scss" scoped>
.wgt-classify {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .classify-item-title {
        font-weight: 500;
        font-size: 16px;
        color: #1A1A1A;
        padding-bottom: 12px;
    }

    .classify-item-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px 15px;
    }

    .classify-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;

        .classify-item-image {
            width: 100%;
            aspect-ratio: 1/1;
            background-color: #F5F5F5;
            overflow: hidden;

            .el-image {
                width: 100%;
                height: 100%;
            }
        }

        .classify-item-label {
            font-size: 12px;
            color: #1A1A1A;
        }
    }

    .classify-list-horizontal {
        display: flex;
        flex-direction: row;
        gap: 18px;
        scroll-snap-type: x mandatory;

        .classify-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            max-width: 48px;
            width: 48px;
            min-width: 48px;
            flex-shrink: 0;

            .classify-item-image {
                width: 46px;
                height: 46px;
                background: #F8F8F8;
                border-radius: 6px 6px 6px 6px;
                border: 1px solid #EBEBEB;
                overflow: hidden;

                .el-image {
                    width: 100%;
                    height: 100%;
                }
            }

            .classify-item-label {
                width: 48px;
                height: 17px;
                font-size: 12px;
                color: #666666;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>

<template>
    <div class="wgt-classify" :style="outerStyle">
        <div v-if="value?.animate == 'vertical'" class="classify-inner" :style="innerStyle">
            <div class="classify-item-title">{{ value?.data?.category_name }}</div>
            <div v-if="value?.data?.type == 'select'" class="classify-item-list">
                <div v-for="item in value?.data?.category?.children" :key="item?.category_id" class="classify-item">
                    <div class="classify-item-image">
                        <el-image :src="item?.image_url" fit="cover">
                            <div slot="error" />
                        </el-image>
                    </div>
                    <div class="classify-item-label">{{ item?.category_name }}</div>
                </div>
            </div>
            <div v-else class="classify-item-list">
                <div v-for="item in value?.data?.data" :key="item?.category_id" class="classify-item">
                    <div class="classify-item-image">
                        <el-image :src="item?.image_url" fit="cover">
                            <div slot="error" />
                        </el-image>
                    </div>
                    <div class="classify-item-label">{{ item?.current_category_name || item?.category_name }}</div>
                </div>
            </div>
        </div>
        <div v-if="value?.animate == 'horizontal'" class="classify-inner" :style="innerStyle">
            <div v-if="value?.data?.type == 'select'" class="classify-list-horizontal">
                <div v-for="item in value?.data?.category?.children" :key="item?.category_id" class="classify-item">
                    <div class="classify-item-image">
                        <el-image :src="item?.image_url" fit="cover">
                            <div slot="error" />
                        </el-image>
                    </div>
                    <div class="classify-item-label">{{ item?.category_name }}</div>
                </div>
            </div>
            <div v-else class="classify-list-horizontal">
                <div v-for="item in value?.data?.data" :key="item?.category_id" class="classify-item">
                    <div class="classify-item-image">
                        <el-image :src="item?.image_url" fit="cover">
                            <div slot="error" />
                        </el-image>
                    </div>
                    <div class="classify-item-label">{{ item?.current_category_name || item?.category_name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from './config'
export default {
    name: 'Classify',
    wgtName: '商品分类',
    wgtDesc: '',
    wgtIcon: 'wgt-classify',
    wgtType: 2,
    config: config,
    props: {
        value: [Object, Array]
    },
    watch: {
        value: {
            handler(newVal) {
                console.log(newVal, 'newVal')
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        outerStyle() {
            const { outerMargin, outerBackground } = this.value
            return {
                paddingTop: outerMargin.paddedt + 'px',
                paddingBottom: outerMargin.paddedb + 'px',
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
                backgroundImage: innerBackground?.type == 'gradient' ? `linear-gradient(${innerBackground.startColor}, ${innerBackground.endColor})` : 'none',
            }
        },
    }
}
</script>
