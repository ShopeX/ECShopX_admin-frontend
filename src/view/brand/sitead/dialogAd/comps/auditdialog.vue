<template>
    <div>
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="审核结果" prop="audit_status">
                <el-radio-group v-model="form.audit_status">
                    <el-radio-button label="approved">通过</el-radio-button>
                    <el-radio-button label="rejected">驳回</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审核备注">
                <el-input v-model="form.audit_remark" type="textarea" :rows="4" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import api from '@/api'
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            form: {
                audit_status: '',
                audit_remark: '',
                id: ''
            },
            rules: {
                audit_status: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
            }
        }
    },
    mounted() {
        this.form.id = this.data[0].id
    },
    methods: {
        async handleAction(action) {
            if (action.key === 'save') {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        await api.wxastats.auditAd(this.form.id, this.form)
                        this.$message.success('审核成功')
                        this.$emit('close')
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>
