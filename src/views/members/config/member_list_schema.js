/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'

export const finderSetting = (vm) =>
  createSetting({
    columns: [
      { name: '平台账号', key: 'userid', width: 100, visible: vm.VERSION_SHUYUN() },
      {
        name: '手机号',
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
                    content: '修改手机号',
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
      { name: '昵称', key: 'username', width: 140 },
      {
        name: '性别',
        key: 'sex',
        width: 70,
        render: (h, { row }) => {
          if (row.sex == '2') return h('span', '女')
          if (row.sex == '1') return h('span', '男')
          if (row.sex == '0') return h('span', '未知')
          return h('span', row.sex)
        },
        visible: !vm.VERSION_IN_PURCHASE()
      },
      {
        name: '是否团长',
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
        name: '会员等级',
        key: 'grade_id',
        width: 140,
        render: (h, { row }) => {
          return h('span', vm.showGrade(row.grade_id, row.vip_grade))
        },
        visible: !vm.VERSION_IN_PURCHASE()
      },
      { name: '推荐人', key: 'inviter', width: 130, visible: !vm.VERSION_IN_PURCHASE() },
      {
        name: '是否禁用',
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
        name: '会员标签',
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
          return h('span', { class: 'muted' }, '暂无会员标签')
        }
      },
      {
        name: '注册店铺',
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.reg_distributor_name)
        }
      },
      {
        name: '注册导购',
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.reg_salesperson)
        }
      },
      {
        name: '归属店铺',
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.store_info?.store_name)
        }
      },
      {
        name: '归属导购',
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.salesperson_info?.employee_number)
        }
      },
      {
        name: '维护店铺',
        key: 'maintain_store',
        width: 130,
        render: (h, { row }) => {
          return h('span', row?.maintain_store)
        }
      },
      {
        name: '用户名',
        key: 'name',
        width: 130,
        render: (h, { row }) => {
          const children = [
            row.name ? h('span', row.name) : h('span', { class: 'muted' }, '暂无用户名')
          ]
          children.push(
            h(
              'el-tooltip',
              {
                props: {
                  content: '编辑用户名',
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
        name: '备注',
        key: 'remarks',
        width: 130,
        render: (h, { row }) => {
          const children = [
            row.remarks ? h('span', row.remarks) : h('span', { class: 'muted' }, '暂无备注')
          ]
          children.push(
            h(
              'el-tooltip',
              {
                props: {
                  content: '编辑备注',
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
        name: '详情',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => vm.getDetail(row.user_id)
        }
      },
      {
        name: '基础信息',
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
        name: '会员等级',
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
        name: '调整上级',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => vm.editSuperior(row)
        }
      }
    ]
  })
