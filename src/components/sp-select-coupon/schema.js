import { createSetting } from "@shopex/finder";

// 选择优惠券
export const CouponFormSchema = [
    {
        component() {
            return (
                <div>
                    <div class='action-container'>
                        <el-button type='primary' onClick={() => this.openSelectCouponDialog()}>
                            选择优惠券
                        </el-button>
                    </div>
                    <SpFinder
                        ref='finder'
                        data={this.couponTableData}
                        fixed-row-action
                        row-actions-width='80px'
                        no-selection
                        setting={this.couponTableSchema}
                        row-actions-fixed-align='left'
                    />
                </div>
            )
        }
    }
]
export const CouponTableSchema = (vm) =>
    createSetting({
        actions: [
            {
                name: '删除',
                key: 'delete',
                type: 'button',
                buttonType: 'text',
                action: {
                    handler: ([row]) => {
                        vm.deleteHandle(row, 'coupon')
                    }
                }
            }
        ],
        columns: [
            {
                name: '优惠券id',
                key: 'card_id',
                width: '100px'
            },
            {
                name: '券封面图',
                key: 'cover',
                render(_, { row }) {
                    return <el-image src={row.cover} style={{ width: '50px', height: '50px' }} />
                }
            },
            {
                name: '优惠券名称',
                key: 'title'
            },
            {
                name: '券类型',
                width: '100px',
                key: 'card_type',
                render: (h, { row }) =>
                    h(
                        'el-tag',
                        {
                            props: {
                                size: 'mini'
                            }
                        },
                        vm.cardTypeFormatter(row)
                    )
            },
            {
                name: '券规则',
                key: 'rule_text'
            },
            {
                name: '券有效期',
                formatter: (value, { takeEffect, begin_time, end_time }, col) => {
                    if (takeEffect) {
                        return takeEffect
                    } else {
                        return vm.getCardValidate(begin_time, end_time)
                    }
                }
            }
        ]
    })