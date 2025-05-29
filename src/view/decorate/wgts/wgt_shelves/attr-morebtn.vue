<template>
    <div class="attr-morebtn">
        <div class="attr-morebtn-item">
            <div class="attr-morebtn-item-label">显示</div>
            <div class="attr-morebtn-item-value">
                <el-switch v-model="localValue.show" @change="handleChange" />
            </div>
        </div>
        <div class="attr-morebtn-item">
            <div class="attr-morebtn-item-label">颜色</div>
            <div class="attr-morebtn-item-value">
                <el-color-picker v-model="localValue.color" @change="handleChange" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            localValue: {
                show: true,
                color: '#ff6b6b',
            }
        }
    },
    methods: {
        handleChange() {
            this.$emit('input', this.localValue)
        }
    }
}
</script>

<style lang="scss" scoped>
.attr-morebtn {
    display: flex;
    gap: 10px;
    align-items: flex-start;

    &-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        &-label {
            font-size: 14px;
            color: #606266;
            margin-bottom: 5px;
        }
    }
}
</style>