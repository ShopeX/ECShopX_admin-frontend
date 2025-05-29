
import { bindThisForFormSchema } from '@/utils/schemaHelper.js'

export const createRefundOfflineFvFormList = (vm) =>
    bindThisForFormSchema(
        [
            {
                label: '打款凭证',
                key: 'offline_evidence',
                component({ key }, value) {
                    return <SpImagePicker v-model={value[key]} />
                }
            },
            {
                label: '备注',
                key: 'refunds_memo',
                type: 'textarea',
                required: true,
                message: '请输入备注'
            }
        ],
        vm
    )