<!-- layouts/DynamicLayout.vue -->
<template>
    <component :is="currentLayout">
        <slot />
    </component>
</template>

<script>
import DefaultLayout from './layout.vue'
import EmptyLayout from './layout-empty.vue'

export default {
    components: {
        DefaultLayout,
        EmptyLayout
    },
    computed: {
        currentLayout() {
            // 根据路由元信息选择布局
            switch (this.$route.meta.layout) {
                case 'empty':
                    return 'EmptyLayout'
                default:
                    return 'DefaultLayout'
            }
        }
    }
}
</script>