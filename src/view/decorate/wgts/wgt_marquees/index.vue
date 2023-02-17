<style lang="scss">
.wgt-marquees {
    &.padded {
        padding: 10px 0;
    }

    .medium {
        padding: 0 20px;
        line-height: 30px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
<template>
    <div :class="{
        'wgt-marquees': true,
        'padded': value.padded
    }">
        <el-carousel height="30px" direction="vertical" :autoplay="true" indicator-position="none"
            v-if="value.data.length == 0 ? false : true">
            <el-carousel-item v-for="(item, index) in value.data" :key="index">
                <h3 :style="'color:' + value.fontcolor + ';background:' + value.bgcolor" class="medium">
                    {{ item.title }}
                </h3>
            </el-carousel-item>
        </el-carousel>
        <el-carousel height="30px" direction="vertical" :autoplay="true" v-else>
            <el-carousel-item>
                <h3 :style="'color:' + value.fontcolor + ';background:' + value.bgcolor" class="medium">
                    文字轮播
                </h3>
            </el-carousel-item>
        </el-carousel>
</div>
</template>

<script>
import config from './config'
export default {
    name: 'Marquees',
    wgtName: '文字轮播',
    wgtDesc: '',
    wgtIcon: 'wgt-marquees',
    config: config,
    props: {
        value: [Object, Array]
    },
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
    }
}
</script>
