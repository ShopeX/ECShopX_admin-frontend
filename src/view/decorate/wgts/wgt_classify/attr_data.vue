<template>
    <div class="wgt-classify-comp-data">
        <div class="flex">
            <el-radio-group v-model="localValue.type" size="mini">
                <el-radio label="select">按选择读取子集</el-radio>
                <el-radio label="category">指定分类</el-radio>
            </el-radio-group>
            <el-cascader v-if="localValue.type === 'select'" v-model="localValue.category.category_id"
                :options="options" :props="props" separator="-" size="mini" @change="handleChange" />
            <div v-else class="category-list">
                <CompDragList v-model="localValue.data" type="text" btn-text="添加导航项" :show-title="false"
                    @onAddItem="handleAddNavItem">
                    <template slot="title" slot-scope="scope">
                        <span class="scope-item-label">{{ scope.data.category_name }}</span>
                    </template>
                    <template slot="body" slot-scope="scope">
                        <div class="scope-item-wrapper">
                            <div class="scope-item">
                                <span class="scope-item-label">自定义名</span>
                                <div class="scope-item-body">
                                    <el-input v-model="localValue.data[scope.index].current_category_name" size="mini"
                                        placeholder="分类名称" />
                                </div>
                            </div>
                            <div class="scope-item">
                                <span class="scope-item-label">圈选店铺</span>
                                <CompButton placeholder="设置店铺" format="{0}个店铺"
                                    :value="localValue.data[scope.index].store_ids.length" :view-btn="false"
                                    @click="onSelectShop(scope.index)" @remove="onRemoveShop(scope.index)" />
                            </div>
                        </div>
                    </template>
                </CompDragList>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import { getRegionauthId } from '@/utils'
import CompDragList from '../../comps/comp_dragList'
import CompButton from '../../comps/comp-button'
export default {
    components: { CompDragList, CompButton },
    props: {
        dataType: {
            type: String,
            default: 'manage'
        },
        value: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            list: [],
            props: {
                value: 'category_id',
                label: 'category_name',
                children: 'children',
                checkStrictly: true
            },
            selectValue: '',
            localValue: {
                type: "select",
                data: [],
                category: {
                    category_id: '',
                }
            }
        }
    },
    computed: {
        options() {
            return this.flattenToTwoLevels(this.list)
        }
    },
    watch: {
        dataType: {
            handler(newVal) {
                this.getList()
            },
            immediate: true
        }
    },
    mounted() {
        this.selectValue = this.value?.category_id || ''
    },
    methods: {
        flattenToTwoLevels(data) {
            // 只保留两级联动数据
            const result = [];

            if (!Array.isArray(data)) {
                return result;
            }

            // 遍历第一级数据
            data.forEach(item => {
                const firstLevel = {
                    category_id: item.category_id,
                    category_name: item.category_name,
                    children: []
                };

                // 处理第二级数据
                if (Array.isArray(item.children)) {
                    item.children.forEach(child => {
                        firstLevel.children.push({
                            category_id: child.category_id,
                            category_name: child.category_name
                        });
                    });
                }

                result.push(firstLevel);
            });

            return result;
        },

        async getList() {
            this.list = []
            if (this.dataType == 'manage') {
                const res = await api.goods.getCategory({
                    // parent_id: 0,
                    is_main_category: true,
                    regionauth_id: getRegionauthId(),
                })
                this.list = res
                console.log(this.list, 'manage')
            }
            if (this.dataType == 'sales') {
                const res = await api.goods.getCategory({
                    // parent_id: 0
                    regionauth_id: getRegionauthId(),
                })
                this.list = res
                console.log(this.list, 'sales')
            }
        },
        handleChange(value) {
            console.log(value, 'value')
            // 获取选中项的完整数据
            if (value && value.length > 0) {
                // 查找选中的分类
                const categoryId = value[value.length - 1]
                let selectedCategory = null

                // 在一级分类中查找
                for (const category of this.list) {
                    if (category.category_id === categoryId) {
                        selectedCategory = category
                        break
                    }

                    // 在二级分类中查找
                    if (category.children) {
                        for (const child of category.children) {
                            if (child.category_id === categoryId) {
                                selectedCategory = child
                                break
                            }
                        }
                        if (selectedCategory) break
                    }
                }

                console.log('选中的分类数据:', selectedCategory)
                this.$emit('input', {
                    type: this.localValue.type,
                    category: selectedCategory,
                    data: []
                })
                this.$emit('change', {
                    type: this.localValue.type,
                    category: selectedCategory,
                    data: []
                })
            }
        },
        async handleAddNavItem() {
            let res = null
            if (this.dataType === 'manage') {
                res = await this.$picker.category({
                    is_main_category: true,
                    multiple: false,
                })
            } else {
                res = await this.$picker.saleCategory({
                    is_main_category: false
                })
            }
            const category_id = res.data[0].id //分类id
            const category_name = res.data[0].title //分类名称
            const image_url = res.data[0].image_url //分类图片
            console.log(res, 'res')
            this.localValue.data.push({
                category_id,
                category_name,
                image_url,
                current_category_name: '',
                store_ids: []
            })

            this.$emit('input', {
                type: this.localValue.type,
                category: {
                    category_id: '',
                },
                data: this.localValue.data
            })
        },
        async onSelectShop(index) {
            const res = await this.$picker.shop({
                multiple: true,
                data: this.localValue.data[index].store_ids

            })
            console.log(res, 'res')
            const ids = res.data.map(item => item.distributor_id)
            this.localValue.data[index].store_ids = ids


            this.$emit('input', {
                type: this.localValue.type,
                category: {
                    category_id: '',
                },
                data: this.localValue.data
            })
        },
        onRemoveShop(index) {
            this.localValue.data[index].store_ids = []
            this.$emit('input', {
                type: this.localValue.type,
                category: {
                    category_id: '',
                },
                data: this.localValue.data
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.wgt-classify-comp-data {
    .category-list {
        padding-top: 10px;

        .scope-item-wrapper {
            padding: 10px;
        }
    }

    .scope-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .scope-item-label {
            font-size: 12px;
            color: #999;
            width: 80px;
        }
    }
}
</style>
<style lang="scss">
.wgt-classify-comp-data {
    .category-list {
        .drag-list {
            border: 1px solid #dcdcdc;
            border-radius: 4px;

            .item-hd {
                background-color: #f8f8f8;
                box-sizing: border-box;
                padding: 5px 10px;
            }
        }
    }
}
</style>