import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'
import { debounce } from 'lodash-es'
import moment from 'moment'

import { status_map, prize_types } from './constants'

export const tableSchema = (vm) => createSetting({
    search: [
        { name: '', placeholder: '请选择选择区域', key: 'regionauth_id', type: 'select', options: vm?.areas },
        { name: '', placeholder: '请输入活动id', key: 'activity_id' },
        { name: '', placeholder: '请输入活动名称', key: 'activity_name' },
    ],
    actions: [
        {
            name: '编辑',
            key: 'config',
            type: 'button',
            buttonType: 'text',
            action: {
                handler: debounce(
                    ([row]) => {
                        vm.editConfigHandle(row)
                    },
                    2000,
                    {
                        leading: true
                    }
                )
            }
        },
        {
            name: '终止',
            key: 'stop',
            type: 'button',
            buttonType: 'text',
            action: {
                handler: debounce(
                    ([row]) => {
                        vm.stopHandle(row)
                    },
                    2000,
                    {
                        leading: true
                    }
                )
            },
            visible(row) {
                return row?.status == 'online'
            }
        },
        {
            name: '复制',
            key: 'copy',
            type: 'button',
            buttonType: 'text',
            action: {
                handler: debounce(
                    ([row]) => {
                        vm.copyHandle(row)
                    },
                    2000,
                    {
                        leading: true
                    }
                )
            }
        },
        {
            name: '统计',
            key: 'statistics',
            type: 'button',
            buttonType: 'text',
            action: {
                handler: debounce(
                    ([row]) => {
                        vm.statisticsHandle(row)
                    },
                    2000,
                    {
                        leading: true
                    }
                )
            }
        },
    ],
    columns: [
        {
            name: 'ID',
            key: 'id',
            width: '80'
        },
        { name: '活动名称', key: 'activity_name', width: '300' },
        // { name: '活动区域', key: 'regionauth_name', width: '100' },
        {
            name: '抽奖形式',
            key: 'activity_type',
            render(_, { row }) {
                return row.activity_type == 'wheel' ? '大转盘' : row.activity_type == 'slotMachine' ? '老虎机' : '九宫格'
            }
        },
        {
            name: '状态',
            key: 'status',
            render(_, { row }) {
                return status_map[row.status]
            }
        },
        {
            name: '活动时间',
            key: 'begin_time',
            render(_, { row }) {
                return `${moment(row.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss')} - ${moment(row.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
        },
        {
            name: '创建时间',
            key: 'created',
            render(_, { row }) {
                return `${moment(row.created * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
        },
        {
            name: '更新时间',
            key: 'updated',
            render(_, { row }) {
                return `${moment(row.updated * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
        }   
    ]
})


export const statisticsFormSchema = (vm) => bindThisForFormSchema([
    {
        name: "",
        key: "table",
        component() {
            return (
                <SpFinder
                    ref="finder"
                    data={vm.tableData}
                    fixed-row-action
                    row-actions-width="200px"
                    no-selection
                    setting={outputSchema}
                >
                    <div slot='tableTop'>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ccc", padding: "0 10px" }}>
                            <div>总抽奖次数:{vm?.dialogData?.total}</div>
                            <div>总抽奖人数:{vm?.dialogData?.totalGet}</div>
                            <div>中奖次数:{vm?.dialogData?.totalGetUser}</div>
                            <div>中奖人数:{vm?.dialogData?.totalUser}</div>
                            <el-button type="primary" onClick={() => vm.exportReport()}>
                                导出报表
                            </el-button>
                        </div>
                    </div>
                </SpFinder>
            )
        }
    }
], vm)

const outputSchema = {
    columns: [
        { name: 'ID', key: 'user_id', width: '60' },
        { name: '会员编码', key: 'user_card_code' },
        { name: '获得奖品', key: 'prize_value' },
        {
            name: '奖品类型', key: 'prize_type', render(_, { row }) {
                return <span>{prize_types[row.prize_type]}</span>
            }
        },
        {
            name: '中间时间', key: 'created', render(_, { row }) {
                return `${moment(row.created * 1000).format('YYYY-MM-DD HH:mm:ss')}`
            }
        },
    ]
}

