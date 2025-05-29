
import { createSetting } from '@shopex/finder'

// 关联券包
export const CouponPackFormSchema = [
    {
        component() {
            return (
                <div>
                    <div class='action-container'>
                        <el-button type='primary' onClick={() => this.openSelectCouponPackageDialog()}>
                            选择券包
                        </el-button>
                    </div>
                    <SpFinder
                        ref='finder'
                        data={this.packageTableData}
                        fixed-row-action
                        row-actions-width='80px'
                        no-selection
                        setting={this.couponPackTableSchema}
                        row-actions-fixed-align='left'
                    />
                </div>
            )
        }
    }
]
export const CouponPackTableSchema = (vm) =>
    createSetting({
        actions: [
            {
                name: '删除',
                key: 'delete',
                type: 'button',
                buttonType: 'text',
                action: {
                    handler: ([row]) => {
                        vm.deleteHandle(row, 'couponPackage')
                    }
                }
            }
        ],
        columns: [
            {
                name: '券包标题',
                key: 'title'
            },
            {
                name: '券包封面图',
                key: 'image',
                render(_, { row }) {
                    return <el-image src={row.cover} style={{ width: '50px', height: '50px' }} />
                }
            },
            {
                name: '券包描述',
                key: 'package_describe'
            }
        ]
    })