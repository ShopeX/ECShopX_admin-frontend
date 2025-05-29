<template>
    <div>
        <SpFinder ref="finder" :split-count="4" :fixed-row-action="true" :setting="setting" reserve-selection
            row-key="pages_template_id" :url="'/pagestemplate/lists'" :hooks="{ beforeSearch: beforeSearch }" />
        <SpDialog ref="addTemplateDialogRef" v-model="showAddTemplateDialog"
            :title="addTemplateForm.id ? '编辑店铺公共模板' : '添加店铺公共模板'" :form="addTemplateForm"
            :form-list="addTemplateFormList" @onSubmit="onAddTemplateFormSubmit" />
    </div>
</template>

<script>
import moment from 'moment'
import { createSetting } from '@shopex/finder'
export default {
    data() {
        return {
            showAddTemplateDialog: false,
            addTemplateForm: {
                regionauth_id: '',
                template_title: '',
                // page_description: '',
                // is_open: true
            },
            regionauthList: []
        }
    },
    computed: {
        setting() {
            const { regionauthList } = this
            return createSetting({
                search: [{
                    key: 'regionauth_id',
                    name: '区域',
                    type: 'select',
                    filterable: true,
                    remote: true,
                    options: regionauthList
                }, {
                    key: 'id',
                    name: '页面ID',
                    minWidth: 100
                }, {
                    key: 'template_title',
                    name: '页面名称',
                    minWidth: 260
                }],
                columns: [
                    {
                        key: 'pages_template_id',
                        name: '页面ID',
                        minWidth: 100
                    },
                    {
                        key: 'template_title',
                        name: '页面名称',
                        minWidth: 260
                    }, {
                        key: 'status',
                        name: ' 启用状态',
                        render: (h, { row }) => {
                            console.log(row, '---11-')
                            return <el-switch v-model={row.status} active-value={1} inactive-value={2} onChange={() => { this.useTemplate(row) }} />
                        },
                        minWidth: 260
                    },
                    // {
                    //     key: 'template_status_modify_time',
                    //     name: '更新时间',
                    //     render: (h, { row }) => {
                    //         return moment(row.template_status_modify_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                    //     },
                    //     minWidth: 250
                    // }
                ],
                actions: [{
                    name: '添加模板',
                    key: 'add',
                    slot: 'header',
                    type: 'button',
                    buttonType: 'primary',
                    action: {
                        handler: () => {
                            this.showAddTemplateDialog = true
                            const id = this.$refs['finder'].getSearchParams().regionauth_id
                            this.addTemplateForm.regionauth_id = id
                            this.addTemplateForm.template_title = ''
                            // this.addTemplateForm.page_description = ''
                            // this.addTemplateForm.is_open = true
                        }
                    }
                },
                {
                    name: '页面装修',
                    key: 'detail',
                    type: 'button',
                    buttonType: 'text',
                    action: {
                        handler: ([{ pages_template_id, regionauth_id }]) => {
                            this.$router.push(`/wxapp/manage/decorate?id=${pages_template_id}&scene=1003&regionauth_id=${regionauth_id}`)
                        }
                    }
                },
                {
                    name: '编辑',
                    key: 'edit',
                    type: 'button',
                    buttonType: 'text',
                    action: {
                        handler: ([row]) => {
                            this.addTemplateForm.pages_template_id = row?.pages_template_id
                            this.showAddTemplateDialog = true
                            this.addTemplateForm.regionauth_id = row?.regionauth_id
                            this.addTemplateForm.template_title = row?.template_title
                            // this.addTemplateForm.page_description = row?.page_description
                            // this.addTemplateForm.is_open = row?.is_open==1
                        }
                    }
                },
                {
                    name: '删除',
                    key: 'delete',
                    type: 'button',
                    buttonType: 'text',
                    action: {
                        handler: async ([row]) => {
                            await this.$confirm(`确认删除？`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消'
                            })
                            await this.$api.template.deletePagesTemplate(row.pages_template_id)
                            this.$refs['finder'].refresh()
                        }
                    }
                }]
            })
        },
        addTemplateFormList() {
            return [{
                label: '区域',
                key: 'regionauth_id',
                type: 'select',
                required: true,
                options: this.regionauthList,
                message: '区域不能为空'
            }, {
                label: '模板名称',
                key: 'template_title',
                type: 'input',
                maxlength: 150,
                placeholder: '请输入模板名称',
                required: true,
                message: '模板名称不能为空'
            },
                // {
                //     label: '页面描述',
                //     key: 'page_description',
                //     type: 'input',
                //     maxlength: 150,
                //     placeholder: '请输入页面描述',
                //     required: true,
                //     message: '页面描述不能为空'
                // }, {
                //     label: '是否启用',
                //     key: 'is_open',
                //     type: 'switch',
                // }
            ]
        }
    },
    created() {
        this.getRegionauth()
    },
    methods: {
        async getRegionauth() {
            const res = await this.$api.regionauth.getRegionauth()
            this.regionauthList = res.list.map(item => ({
                label: item.regionauth_name,
                value: item.regionauth_id
            }))
        },
        beforeSearch(params) {
            const _params = {
                ...params,
                weapp_pages: 'distributor_index',
                template_name: 'yykweishop'
            }
            return _params
        },
        async onAddTemplateFormSubmit() {
            try {
                if (this.addTemplateForm.pages_template_id) {
                    await this.$api.template.savePagesTemplate({ ...this.addTemplateForm, weapp_pages: 'distributor_index', template_name: 'yykweishop' })
                    this.$message.success('编辑成功')
                } else {
                    await this.$api.template.addPagesTemplate({ ...this.addTemplateForm, weapp_pages: 'distributor_index', template_name: 'yykweishop' })
                    this.$message.success('添加成功')
                }
                this.showAddTemplateDialog = false
                this.$refs.finder.refresh()
            } catch (error) {
                console.error(error)
            }
        },
        async useTemplate(row) {
            try {
                if (row.status == 1) {
                    await this.$confirm('确认立即启用当前模板？', '启用模板', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    })
                }
                await this.$api.template.modifyPagesTemplateStatus({
                    pages_template_id: row.pages_template_id,
                    regionauth_id: row.regionauth_id,
                    template_name: 'yykweishop',
                    status: row.status
                })
                this.$refs.finder.refresh()
            } catch (error) {
                row.status = row.status == 1 ? 2 : 1
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>
