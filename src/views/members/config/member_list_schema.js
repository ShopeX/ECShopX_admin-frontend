/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'

export const finderSetting = (vm) =>
  createSetting({
    columns: [
      { name: vm.$t('c30d0a27.26d82e'), key: 'userid', width: 100, visible: vm.VERSION_SHUYUN() },
      {
        name: vm.$t('c30d0a27.8098e2'),
        key: 'mobile',
        width: 160,
        render: (h, { row }) => {
          const children = [row.mobile]
          if (
            vm.$store.getters.login_type != 'distributor' &&
            vm.datapass_block == 0 &&
            !vm.VERSION_SHUYUN() &&
            !vm.dmcrmIsOpen
          ) {
            children.push(
              h(
                'el-tooltip',
                {
                  props: {
                    content: vm.$t('c30d0a27.29c9d5'),
                    placement: 'top-start',
                    effect: 'dark'
                  },
                  class: 'item'
                },
                [
                  h('el-button', {
                    class: 'el-icon-edit',
                    props: {
                      type: 'text',
                      size: 'mini'
                    },
                    on: {
                      click: () => vm.editMobile(row)
                    }
                  })
                ]
              )
            )
          }
          return h(
            'div',
            {
              class: 'flex items-center'
            },
            [h('span', children)]
          )
        }
      },
      { name: vm.$t('c30d0a27.23eb0e'), key: 'username', width: 140 },
      {
        name: vm.$t('287aad92.7148d5'),
        key: 'email',
        width: 200,
        render: (h, { row }) => {
          const v = row.email != null && row.email !== '' ? String(row.email) : ''
          return h('span', v || '—')
        }
      },
      {
        name: vm.$t('c30d0a27.787b56'),
        key: 'sex',
        width: 70,
        render: (h, { row }) => {
          if (row.sex == '2') return h('span', vm.$t('c30d0a27.87c835'))
          if (row.sex == '1') return h('span', vm.$t('c30d0a27.36a490'))
          if (row.sex == '0') return h('span', vm.$t('c30d0a27.1622dc'))
          return h('span', row.sex)
        },
        visible: !vm.VERSION_IN_PURCHASE()
      },
      {
        name: vm.$t('c30d0a27.c0db9f'),
        key: 'is_chief',
        width: 80,
        render: (h, scope) => {
          return h('el-switch', {
            props: {
              value: scope.row.is_chief,
              disabled: true,
              'active-value': '1',
              'inactive-value': '0',
              'active-color': '#ff4949',
              'inactive-color': '#ccc'
            },
            on: {
              change: () => vm.switchChief(scope.index, scope.row)
            }
          })
        },
        visible: !vm.VERSION_IN_PURCHASE()
      },
      {
        name: vm.$t('c30d0a27.6c1583'),
        key: 'grade_id',
        width: 140,
        render: (h, { row }) => {
          return h('span', vm.showGrade(row.grade_id, row.vip_grade))
        },
        visible: !vm.VERSION_IN_PURCHASE()
      },
      {
        name: vm.$t('c30d0a27.dd0925'),
        key: 'inviter',
        width: 130,
        visible: !vm.VERSION_IN_PURCHASE()
      },
      {
        name: vm.$t('c30d0a27.3d6de2'),
        key: 'disabled',
        width: 80,
        render: (h, { $index, row }) => {
          return h('el-switch', {
            props: {
              value: row.disabled,
              'active-value': '1',
              'inactive-value': '0',
              'active-color': '#ff4949',
              'inactive-color': '#ccc'
            },
            on: {
              change: () => vm.acitonDisabled($index, row)
            }
          })
        }
      },
      {
        name: vm.$t('c30d0a27.3cc026'),
        key: 'tagList',
        width: 130,
        render: (h, { row }) => {
          if (row.tagList && row.tagList.length > 0) {
            return h(
              'div',
              {
                style: {
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start'
                }
              },
              row.tagList.map((tag) =>
                h(
                  'el-tag',
                  {
                    key: tag.tag_id,
                    props: {
                      size: 'mini',
                      closable: true,
                      effect: 'plain',
                      color: tag.tag_color || ''
                    },
                    style: {
                      color: tag.font_color || '',
                      marginBottom: '2px'
                    },
                    on: {
                      close: () => vm.relTagDelEvent(tag.tag_id, row.user_id)
                    }
                  },
                  tag.tag_name
                )
              )
            )
          }
          return h('span', { class: 'muted' }, vm.$t('c30d0a27.2de895'))
        }
      },
      {
        name: vm.$t('c30d0a27.c74b7d'),
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.reg_distributor_name)
        }
      },
      {
        name: vm.$t('c30d0a27.1df342'),
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.reg_salesperson)
        }
      },
      {
        name: vm.$t('c30d0a27.002acd'),
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.store_info?.store_name)
        }
      },
      {
        name: vm.$t('c30d0a27.8d1f18'),
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.salesperson_info?.employee_number)
        }
      },
      {
        name: vm.$t('c30d0a27.d881e1'),
        key: 'maintain_store',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.maintain_store)
        }
      },
      {
        name: vm.$t('c30d0a27.819767'),
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          const children = [
            row.name ? h('span', row.name) : h('span', { class: 'muted' }, vm.$t('c30d0a27.cab655'))
          ]
          children.push(
            h(
              'el-tooltip',
              {
                props: {
                  content: vm.$t('c30d0a27.9b20a3'),
                  placement: 'top-start',
                  effect: 'dark'
                },
                class: 'item'
              },
              [
                h('el-button', {
                  class: 'el-icon-edit',
                  props: {
                    type: 'text',
                    size: 'mini'
                  },
                  on: {
                    click: () => vm.isEdit(row, 'name')
                  }
                })
              ]
            )
          )
          return h('span', children)
        }
      },
      {
        name: vm.$t('c30d0a27.2432b5'),
        key: 'remarks',
        width: 130,
        render: (h, { row }) => {
          const children = [
            row.remarks
              ? h('span', row.remarks)
              : h('span', { class: 'muted' }, vm.$t('c30d0a27.2a450f'))
          ]
          children.push(
            h(
              'el-tooltip',
              {
                props: {
                  content: vm.$t('c30d0a27.9f06dd'),
                  placement: 'top-start',
                  effect: 'dark'
                },
                class: 'item'
              },
              [
                h('el-button', {
                  class: 'el-icon-edit',
                  props: {
                    type: 'text',
                    size: 'mini'
                  },
                  on: {
                    click: () => vm.isEdit(row, 'remarks')
                  }
                })
              ]
            )
          )
          return h('span', children)
        }
      }
    ],
    actions: [
      {
        name: vm.$t('c30d0a27.f26225'),
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => vm.getDetail(row.user_id)
        }
      },
      {
        name: vm.$t('c30d0a27.6ea1fe'),
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => vm.infoUpdate(row)
        },
        visible: () =>
          vm.$store.getters.login_type != 'distributor' &&
          vm.datapass_block == 0 &&
          !vm.VERSION_SHUYUN()
      },
      {
        name: vm.$t('c30d0a27.6c1583'),
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => vm.gradeUpdate(row)
        },
        visible: () =>
          vm.$store.getters.login_type != 'distributor' &&
          !vm.VERSION_IN_PURCHASE() &&
          !vm.VERSION_SHUYUN()
      },
      {
        name: vm.$t('c30d0a27.23ced7'),
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => vm.editSuperior(row)
        }
      }
    ]
  })
