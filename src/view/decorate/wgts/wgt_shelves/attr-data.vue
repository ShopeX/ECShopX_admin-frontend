<template>
    <div class="attr-data">
        <el-cascader v-if="['category', 'main_category'].includes(type)" v-model="categoryId" :options="options"
            :props="props" separator="-" size="mini" @change="handleChange" />
        <el-select v-if="type === 'seckill'" v-model="localValue" @change="handleChangeLimited">
            <el-option v-for="item in options" :key="item.seckill_id" :value="item.seckill_id"
                :label="item.activity_name">
                {{ item.activity_name }}
            </el-option>
        </el-select>
        <div v-if="type === 'items'" class="attr-data-specified" @click="handleSelectGoods">
            {{ itemIds?.length > 0 ? `已经选择${itemIds?.length}商品` : '请选择商品' }}
        </div>
        <CompButton v-if="type === 'group'" :placeholder="groupInfo?.info?.act_name || '选择拼团'" :view-btn="false"
            @click="handleSelectGroup" />
        <div v-if="type === 'price'" class="price-range-container">
            <el-input-number v-model="minPrice" :min="0" :precision="0" size="mini" :max="maxPrice"
                controls-position="right" @change="handleChangePrice" />
            <span class="separator">-</span>
            <el-input-number v-model="maxPrice" :min="minPrice" :precision="0" size="mini" controls-position="right"
                @change="handleChangePrice" />
        </div>
    </div>
</template>

<script>
import api from '@/api'
import { cloneDeep, isArray } from 'lodash-es'
import CompButton from '../../comps/comp-button.vue';
export default {
    components: {
        CompButton
    },
    props:['type','value'],
    data() {
        return {
            localValue: null,
            props: {
                value: 'category_id',
                label: 'category_name',
                children: 'children',
                checkStrictly: true
            },
            options: [],
            categoryId: [],
            groupInfo: null,
            minPrice: 0,
            maxPrice: 0
        }
    },
    computed: {
        itemIds() {
            return this.localValue ? this.localValue.split(',') : []
        },
    },
    watch: {
        type: {
            handler(newVal) {
                this.getList()
            },
            immediate: true,
        },
    },
    created() {
        if (this.type === 'price') {
            const [min, max] = this.value.id.split(',')
            this.minPrice = Number(min) || 0
            this.maxPrice = Number(max) || 0
        } else if (['category', 'main_category',].includes(this.type)) {
            this.categoryId = this.value.id.split(',')
        } else if (this.type === 'group') {
            this.groupInfo = cloneDeep(this.value)
        }else {
            this.localValue = this.value.id
        }
    },
    methods: {
        async handleChange(v) {
            this.$emit('input', {id: this.categoryId.join(','), info: null})
        },
        handleChangeLimited(v) {
            this.$emit('input', {id: this.localValue, info: null})
        },

        async getList() {
            if (this.type == 'main_category') {
                const res = await api.goods.getCategory({
                    // parent_id: 0,
                    is_main_category: true,
                    regionauth_id: this.$route.query.regionauth_id
                })
                this.options = res
            }
            if (this.type == 'category') {
                const res = await api.goods.getCategory({
                    // parent_id: 0,
                    regionauth_id: this.$route.query.regionauth_id
                })
                this.options = res
            }

            if (this.type == 'seckill') {
                const res = await api.promotions.seckillActivityGetList({
                    status: 'valid',
                    seckill_type: 'limited_time_sale',
                    page: 1,
                    pageSize: 10000,
                    regionauth_id: this.$route.query.regionauth_id
                })
                this.options = res.list
            }
        },
        async handleSelectGoods() {
            const { data } = await this.$picker.goodsitem({
                data: this.itemIds.map(id => ({ itemId: id })),
                multiple: true,
                rowKey: 'itemId',
            })
            const ids = data.map(({ itemId }) => itemId)
            this.localValue = ids.join(',')
            this.$emit('input', {id: this.localValue, info: null})
        },
        async handleSelectGroup() {
            const regionauth_id = this.$route.query.regionauth_id
            console.log(this.value)
            const { data } = await this.$picker.groups({
                multiple: false,
                data: [{
                    groups_activity_id: this.value.id
                }],
                regionauth_id
            })
            this.groupInfo = {
                id: data[0].groups_activity_id,
                info: {
                    act_name: data[0].act_name
                }
            }
            this.$emit('input', this.groupInfo)
        },
        handleChangePrice() {
            const [min, max] = [this.minPrice, this.maxPrice]
            this.$emit('input', {id: `${min},${max}`, info: null})
        }
    }

}
</script>

<style lang="scss" scoped>
.attr-data {
    .attr-data-specified {
        width: 220px;
        border: 1px solid #BEBEBE;
        padding: 5px;
        font-size: 10px;
        color: #848484;
        cursor: pointer;
    }

    .price-range-container {
        display: flex;
        align-items: center;

        .separator {
            margin: 0 5px;
        }
    }
}
</style>