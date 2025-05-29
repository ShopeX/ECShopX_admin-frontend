import { bindThisForFormSchema } from "@/utils/schemaHelper"

export const categoryFormList = (vm) => bindThisForFormSchema([
    {
        label: '区域',
        key: 'regionauth_id',
        placeholder: '请选择',
        defaultValue: '',
        required: true,
        component({ key }, value) {
            return (
                <div class='refund-address'>
                    <el-select v-model={value['regionauth_id']} placeholder='请选择'>
                        {(vm.areas || [])?.map((el, index) => {
                            return <el-option key={index} label={el.label} value={el.value} />
                        })}
                    </el-select>
                </div>
            )
        }
    },
    {
        label: '分类名称',
        key: 'category_name',
        type: 'input',
        placeholder: '请输入',
        required: true,
        message: '不能为空'
    },
    {
        label: '分类排序',
        key: 'sort',
        type: 'number'
    },
    {
        label: '分类图片',
        key: 'image_url',
        component({ key }, value) { return <SpImagePicker v-model={value[key]} /> }
    },
    {
        label: '关联分类',
        key: 'main_category_ids',
        placeholder: '请选择分类',
        component({ key }, value) {
            return (
                <div class='refund-address'>
                    <el-cascader
                        v-model={value[key]}
                        class={[
                            {
                                'is-error': value[key]
                            }
                        ]}
                        clearable
                        filterable
                        attrs={{
                            props: {
                                multiple: true,
                                value: 'value',
                                children: 'children',
                                checkStrictly: true
                            }
                        }}
                        options={this.manageCategory}
                    />
                </div>
            )
        },
    },
    {
        label: '关联店铺',
        key: 'distributor_ids',
        placeholder: '请输选择',
        component({ key }, value) {
            return <SpSelectShopV2
                v-model={value['distributor_ids']}
                names={value['distributor_ids']?.length ? `已选择${value['distributor_ids']?.length}个店铺` : ''}
                multiple
                clearable
                placeholder="请选择店铺"
            />
        },
    }
], vm)


export const defaultFormValue = () => ({
    category_name: '',
    sort: 0,
    parent_name: '',
    image_url: '',
    regionauth_id: '',
    main_category_ids: [],
    distributor_ids: []
})