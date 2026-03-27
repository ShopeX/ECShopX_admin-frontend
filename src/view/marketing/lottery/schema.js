/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex-ui/finder'
import { debounce } from 'lodash-es'
import moment from 'moment'

import { status_map, prize_types } from './constants'

export const tableSchema = (vm) =>
  createSetting({
    search: [
      { name: '', placeholder: vm.$t('dd9b5a55.6c252c'), key: 'activity_id' },
      { name: '', placeholder: vm.$t('dd9b5a55.7528b3'), key: 'activity_name' }
    ],
    actions: [
      {
        name: vm.$t('dd9b5a55.95b351'),
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
        name: vm.$t('dd9b5a55.ff6c6a'),
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
        name: vm.$t('dd9b5a55.79d3ab'),
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
        name: vm.$t('dd9b5a55.d7656a'),
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
      }
    ],
    columns: [
      {
        name: 'ID',
        key: 'id',
        width: '80'
      },
      { name: vm.$t('dd9b5a55.39834b'), key: 'activity_name', width: '300' },
      // { name: '活动区域', key: 'regionauth_name', width: '100' },
      {
        name: vm.$t('dd9b5a55.9f0391'),
        key: 'activity_type',
        render(_, { row }) {
          const t = vm.$t
          return row.activity_type == 'wheel'
            ? t('dd9b5a55.5fa218')
            : row.activity_type == 'slotMachine'
            ? t('dd9b5a55.c01fe6')
            : t('dd9b5a55.64a4df')
        }
      },
      {
        name: vm.$t('dd9b5a55.3fea7c'),
        key: 'status',
        render(_, { row }) {
          return status_map(vm.$t)[row.status]
        }
      },
      {
        name: vm.$t('dd9b5a55.c799f5'),
        key: 'begin_time',
        render(_, { row }) {
          return `${moment(row.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss')} - ${moment(
            row.end_time * 1000
          ).format('YYYY-MM-DD HH:mm:ss')}`
        }
      },
      {
        name: vm.$t('dd9b5a55.eca37c'),
        key: 'created',
        render(_, { row }) {
          return `${moment(row.created * 1000).format('YYYY-MM-DD HH:mm:ss')}`
        }
      },
      {
        name: vm.$t('dd9b5a55.a001a2'),
        key: 'updated',
        render(_, { row }) {
          return `${moment(row.updated * 1000).format('YYYY-MM-DD HH:mm:ss')}`
        }
      }
    ]
  })

export const statisticsFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        name: '',
        key: 'table',
        component() {
          if (!vm.lotteryDialogShow) return null
          return (
            <SpFinder
              ref='finder'
              url={'promotions/getturntable_log/byid?activity_id=' + vm.editRow?.id}
              fixed-row-action
              row-actions-width='200px'
              no-selection
              attrs={{
                hooks: {
                  beforeSearch: (params) => {
                    return {
                      ...params,
                      page_size: params.pageSize
                    }
                  }
                }
              }}
              setting={outputSchema(vm)}
            >
              <div slot='tableTop'>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#ccc',
                    padding: '0 10px'
                  }}
                >
                  <div>
                    {vm.$t('dd9b5a55.8eeb9a')}:{vm?.dialogData?.total}
                  </div>
                  <div>
                    {vm.$t('dd9b5a55.9d54e8')}:{vm?.dialogData?.totalGet}
                  </div>
                  <div>
                    {vm.$t('dd9b5a55.f50abf')}:{vm?.dialogData?.totalGetUser}
                  </div>
                  <div>
                    {vm.$t('dd9b5a55.0faa0f')}:{vm?.dialogData?.totalUser}
                  </div>
                  <el-button type='primary' onClick={() => vm.exportReport()}>
                    {vm.$t('dd9b5a55.4fcf74')}
                  </el-button>
                </div>
              </div>
            </SpFinder>
          )
        }
      }
    ],
    vm
  )

const outputSchema = (vm) => ({
  columns: [
    { name: 'ID', key: 'user_id', width: '60' },
    { name: vm.$t('dd9b5a55.6a52ee'), key: 'mobile' },
    { name: vm.$t('dd9b5a55.d76cc0'), key: 'prize_title' },
    {
      name: vm.$t('dd9b5a55.cb5b93'),
      key: 'prize_type',
      render(_, { row }) {
        return <span>{prize_types(vm.$t)[row.prize_type]}</span>
      }
    },
    {
      name: vm.$t('dd9b5a55.79b537'),
      key: 'created',
      render(_, { row }) {
        return `${moment(row.created * 1000).format('YYYY-MM-DD HH:mm:ss')}`
      }
    }
  ]
})
