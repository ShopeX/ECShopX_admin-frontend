/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex-ui/finder'

export const formList = (vm) =>
  bindThisForFormSchema(
    [
      {
        type: 'group',
        label: vm.$t('de51ee4c.7bc81f')
      },
      // {
      //   label: '区域',
      //   key: 'area_id',
      //   placeholder: '请选择',
      //   defaultValue: '',
      //   required: true,
      //   type: 'select',
      //   options: vm?.areas || []
      // },
      {
        label: vm.$t('de51ee4c.902a3d'),
        key: 'activity_name',
        type: 'input',
        required: true,
        placeholder: vm.$t('de51ee4c.c0e2a5'),
        defaultValue: ''
      },
      {
        label: vm.$t('de51ee4c.c799f5'),
        key: 'start_time',
        required: true,
        placeholder: vm.$t('de51ee4c.d8e0d0'),
        defaultValue: '',
        component(_) {
          return (
            <el-date-picker
              v-model={vm.form['start_time']}
              type='datetimerange'
              on-change={(val) => vm.handleDateInput(val)}
              range-separator={vm.$t('bea3f44a.981cbe')}
              start-placeholder={vm.$t('39e3acc2.592c59')}
              end-placeholder={vm.$t('39e3acc2.f78277')}
              value-format='yyyy-MM-dd HH:mm:ss'
              default-time={['00:00:00', '23:59:59']}
            />
          )
        }
      },
      {
        label: vm.$t('de51ee4c.29da05'),
        key: 'cost_type',
        type: 'input',
        required: true,
        placeholder: vm.$t('de51ee4c.d836a5'),
        defaultValue: '2',
        component(_) {
          return (
            <div>
              <el-radio-group v-model={vm.form['cost_type']}>
                <el-radio-button label='2'>{vm.$t('9f64e002.9f68a8')}</el-radio-button>
              </el-radio-group>
              <el-input
                v-model={vm.form['cost_value']}
                placeholder={vm.$t('de51ee4c.4e44e6')}
                type='number'
                style={{ width: '120px', marginLeft: '20px' }}
                onBlur={(val) => {
                  console.log(val.target.value)
                  const _val = val.target.value
                  let _num = 0
                  if (_val <= 0) {
                    _num = 0
                  } else {
                    _num = Number(_val)
                  }
                  vm.form = {
                    ...vm.form,
                    cost_value: _num
                  }
                }}
              />
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.00e557'),
        key: 'limit_total',
        type: 'input',
        placeholder: vm.$t('de51ee4c.e2e69f'),
        defaultValue: 1,
        required: true,
        component() {
          return (
            <div>
              <el-input
                v-model={vm.form['limit_total']}
                style={{ width: '120px' }}
                type='number'
                onBlur={(val) => {
                  const _val = val.target.value
                  let _num = 1
                  if (_val <= 0) {
                    _num = 1
                  } else {
                    _num = Number(_val)
                  }
                  vm.form = {
                    ...vm.form,
                    limit_total: _num
                  }
                }}
              />
              <div style={{ marginTop: '20px' }}>
                {vm.$t('de51ee4c.f4df51')} &nbsp;
                <el-input
                  v-model={vm.form['limit_day']}
                  style={{ width: '120px' }}
                  type='number'
                  onBlur={(val) => {
                    const _val = val.target.value
                    let _num = 1
                    if (_val <= 0) {
                      _num = 1
                    } else if (_val > vm.form['limit_total']) {
                      _num = vm.form['limit_total']
                    } else {
                      _num = Number(_val)
                    }
                    vm.form = {
                      ...vm.form,
                      limit_day: _num
                    }
                  }}
                />
                &nbsp; {vm.$t('de51ee4c.7229ec')}
              </div>
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.4cfbf6'),
        key: 'intro',
        type: 'richText',
        required: true,
        placeholder: vm.$t('de51ee4c.950b2a'),
        defaultValue: ''
      },
      {
        type: 'group',
        label: vm.$t('de51ee4c.51c33b'),
        defaultValue: ''
      },
      {
        label: vm.$t('de51ee4c.9f0391'),
        defaultValue: 'wheel',
        required: true,
        key: 'activity_type',
        component(_) {
          return (
            <el-radio-group v-model={vm.form['activity_type']}>
              <el-radio-button label='wheel'>{vm.$t('dd9b5a55.5fa218')}</el-radio-button>
              {/* <el-radio-button label='slotMachine'>老虎机</el-radio-button>
              <el-radio-button label='grid'>九宫格</el-radio-button> */}
            </el-radio-group>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.51c33b'),
        key: 'prize_data',
        defaultValue: [],
        required: true,
        component() {
          return (
            <SpFinder
              ref='finder'
              data={vm.form['prize_data']}
              no-selection
              setting={innerSchema(vm)}
              row-actions-width='50px'
              show-pager={false}
              class='prize_data'
            >
              <div slot='tableTop'>
                <el-button plain onClick={() => vm.addHandle()}>
                  {vm.$t('de51ee4c.d2f216')}
                </el-button>
                <span>&nbsp;{vm.$t('de51ee4c.5ef360')}</span>
                <div style={{ height: '20px' }}></div>
              </div>
            </SpFinder>
          )
        },
        validator(rule, value, callback) {
          const total = value?.reduce((acc, item) => acc + (item.prize_probability * 1 || 0), 0)
          if (total > 100 || total <= 0) {
            callback(new Error(vm.$t('de51ee4c.0649b8')))
          } else if (value?.filter((item) => item.prize_type).length <= 0) {
            callback(new Error(vm.$t('de51ee4c.e4ef0f')))
          } else {
            callback()
          }
        }
      },
      {
        label: vm.$t('de51ee4c.1dff74'),
        key: 'back',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                <span>{vm.$t('de51ee4c.2f97db')}</span>
                <span>{vm.$t('de51ee4c.543aa6')}</span>
                <span
                  style={{ marginLeft: '40px' }}
                  onClick={() => {
                    vm.form = {
                      ...vm.form,
                      background: '',
                      backgroundColor: ''
                    }
                  }}
                >
                  {vm.$t('de51ee4c.7468f3')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px' }}>
                <div>
                  <el-color-picker
                    value={vm.form['backgroundColor']}
                    onChange={(val) => {
                      console.log('🚀 ~ onChange ~ val:', val)
                      vm.form = {
                        ...vm.form,
                        backgroundColor: val
                      }
                    }}
                  />
                </div>
                <div>
                  <SpImagePicker v-model={vm.form['background']} />
                </div>
              </div>
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.ffa588'),
        key: 'hotArea',
        defaultValue: null,
        component({ key }, value) {
          return (
            <div class='inputWrap'>
              <div>{vm['hasSetHotArea'] ? vm.$t('de51ee4c.44e607') : vm.$t('de51ee4c.fe2d26')}</div>
              <div style={{ display: 'flex', fontSize: '14px' }}>
                <div onClick={() => (vm.hotAreasDialogShow = true)}>
                  {vm.$t('de51ee4c.e366cc')}&nbsp;
                </div>
                <div
                  onClick={() => {
                    vm.hotArea = {
                      backImg: '',
                      padding: 0,
                      background: '#ffffff',
                      img: ''
                    }
                    vm.hasSetHotArea = false
                  }}
                >
                  {vm.$t('de51ee4c.7468f3')}
                </div>
              </div>
            </div>
          )
        }
      },
      // {
      //   label: '抽奖规则按钮',
      //   key: 'ruleBtnStyle',
      //   defaultValue: '',
      //   component({ key }, value) {
      //     return (
      //       <div class='inputWrap'>
      //         <div>{vm['ruleFormConfig']?.img ? '已设置' : '未设置'}</div>
      //         <div style={{ display: 'flex', fontSize: '14px' }}>
      //           <div onClick={() => (vm.ruleDialogShow = true)}>设置&nbsp;</div>
      //           <div
      //             onClick={() => {
      //               vm.ruleForm = {
      //                 rule: ['#000000', '#000000'],
      //                 img: ''
      //               }
      //             }}
      //           >
      //             恢复默认
      //           </div>
      //         </div>
      //       </div>
      //     )
      //   }
      // },
      {
        label: vm.$t('de51ee4c.e3f125'),
        key: 'recordBtnStyle',
        defaultValue: '',
        component({ key }, value) {
          return (
            <div class='inputWrap'>
              <div>{vm['hasSetRecord'] ? vm.$t('de51ee4c.44e607') : vm.$t('de51ee4c.fe2d26')}</div>
              <div style={{ display: 'flex' }}>
                <div onClick={() => (vm.recordDialogShow = true)}>
                  {vm.$t('de51ee4c.e366cc')}&nbsp;
                </div>
              </div>
            </div>
          )
        }
      }
      // {
      //   label: '',
      //   key: 'lotteryMonitor',
      //   defaultValue: '',
      //   component(_) {
      //     return (
      //       <div class='lottery-editor-content'>
      //         <LuckyWheel ref='luckyWheelRef' config={vm.lotteryConfig} />
      //       </div>
      //     )
      //   }
      // }
    ],
    vm
  )

// 抽奖奖品配置
export const innerSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: vm.$t('de51ee4c.2f4aad'),
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.deleteHandle(row)
          }
        }
      }
    ],
    columns: [
      {
        name: vm.$t('de51ee4c.a927ed'),
        key: 'text',
        width: '240px',
        render(_, { row, $index }) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <el-input
                value={row['text']}
                style={{ width: '220px' }}
                maxLength={5}
                on-input={(val) => vm.handleInput(val, row, $index, 'text')}
                show-word-limit
                placeholder={vm.$t('de51ee4c.f91e51')}
              />
            </div>
          )
        }
      },
      {
        name: vm.$t('de51ee4c.df4f60'),
        key: 'prize_probability',
        width: '190px',
        render(_, { row, $index }) {
          return (
            <div>
              <el-input
                value={row['prize_probability']}
                type='number'
                placeholder={vm.$t('de51ee4c.f9f5e4')}
                on-input={(val) => {
                  if (val > 100) {
                    vm.handleInput(99, row, $index, 'prize_probability')
                  } else if (val <= 0) {
                    vm.handleInput(0, row, $index, 'prize_probability')
                  } else {
                    vm.handleInput(Number(val)?.toFixed(0), row, $index, 'prize_probability')
                  }
                }}
              />
            </div>
          )
        }
      },
      {
        name: vm.$t('de51ee4c.b47382'),
        key: 'prize_type',
        width: '300px',
        render(_, { row, $index }) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }} key={row['prize_type']}>
              <el-select
                value={row['prize_type']}
                placeholder={vm.$t('de51ee4c.708c9d')}
                style={{ width: '100px' }}
                on-change={(val) => vm.handleInput(val, row, $index, 'prize_type')}
              >
                {vm?.options?.map((item) => {
                  return (
                    <el-option label={item.label} value={item.value} key={item.value}></el-option>
                  )
                })}
              </el-select>
              {row['prize_type'] == 'coupon' && (
                <div style={{ paddingLeft: '10px' }}>
                  {row['prize_value']?.title}
                  {/* {row['prize_detail']?.title} */}
                  <span
                    style={{ color: '#ff0000', marginLeft: '4px' }}
                    onClick={() => vm.onCouponSubmit(row, $index, 'prize_value')}
                  >
                    {vm.$t('de51ee4c.153fa6')}
                  </span>
                </div>
              )}
              {row['prize_type'] == 'coupons' && (
                <div style={{ paddingLeft: '10px' }}>
                  {row['prize_value']?.title}
                  <span
                    style={{ color: '#ff0000', marginLeft: '4px' }}
                    onClick={() => vm.onCouponPackSubmit(row, $index, 'prize_value')}
                  >
                    {vm.$t('de51ee4c.153fa6')}
                  </span>
                </div>
              )}
              {row['prize_type'] == 'points' && (
                <el-input
                  value={row['prize_value']}
                  on-input={(val) => vm.handleInput(val, row, $index, 'prize_value')}
                  style={{ width: '80px', marginLeft: '4px' }}
                />
              )}
            </div>
          )
        }
      },
      {
        name: vm.$t('de51ee4c.924543'),
        key: 'stock',
        width: '160px',
        render(_, { row, $index }) {
          if (row['prize_type'] == 'coupon' || row['prize_type'] == 'coupons') {
            return (
              <div>
                <el-input
                  value={row['stock']}
                  placeholder={vm.$t('de51ee4c.eb99be')}
                  on-input={(val) => {
                    // 必须是正整数
                    if (val <= 0) {
                      vm.handleInput(0, row, $index, 'stock')
                    } else if (
                      row.prize_detail?.['quantity'] &&
                      val > row.prize_detail?.['quantity']
                    ) {
                      vm.handleInput(row.prize_detail?.['quantity'], row, $index, 'stock')
                    } else {
                      vm.handleInput(Number(val)?.toFixed(0), row, $index, 'stock')
                    }
                  }}
                  type='number'
                />
              </div>
            )
          }
        }
      },
      {
        name: vm.$t('de51ee4c.bcc437'),
        key: 'background',
        width: '80px',
        render(_, { row, $index }) {
          return (
            <div>
              <el-color-picker
                value={row['background']}
                on-change={(val) => vm.handleInput(val, row, $index, 'background')}
              />
            </div>
          )
        }
      },
      {
        name: vm.$t('de51ee4c.5bef5b'),
        key: 'img',
        width: '80px',
        render(_, { row, $index }) {
          return (
            <div class='imgWrap'>
              <SpImagePicker
                size='mini'
                value={row['img'] || ''}
                on-input={(val) => vm.handleInput(val, row, $index, 'img')}
              />
            </div>
          )
        }
      }
    ]
  })

// 抽奖区域
export const lotteryAreaSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: vm.$t('de51ee4c.d74849'),
        key: 'backImg',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div key='backImg'>
              <SpImagePicker v-model={vm.hotArea['backImg']} />
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.841d77'),
        key: 'padding',
        required: true,
        defaultValue: 0,
        component(_) {
          return (
            <div key='padding'>
              <el-input v-model={vm.hotArea['padding']} type='number' />
              <div>{vm.$t('de51ee4c.631eda')}</div>
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.3cccd8'),
        key: 'background',
        required: true,
        defaultValue: '#ffffff',
        component(_) {
          return (
            <div>
              <el-color-picker v-model={vm.hotArea['background']} />
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.da61d6'),
        key: 'img',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.hotArea['img']} key='img' />
              <div>{vm.$t('de51ee4c.e128c7')}</div>
            </div>
          )
        }
      }
      // {
      //   label: '中奖抽奖图片',
      //   key: 'icon',
      //   required: true,
      //   defaultValue: '',
      //   component(_) {
      //     return <div>
      //       <SpImagePicker v-model={vm.hotArea['icon']} key='icon' />
      //       <div>建议尺寸 270px * 270px 像素</div>
      //     </div>
      //   }
      // }
    ],
    vm
  )

// 抽奖规则按钮
export const ruleFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: vm.$t('de51ee4c.6ed535'),
        key: 'rule',
        required: true,
        defaultValue: ['#000000', '#000000'],
        component(_) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <el-color-picker v-model={vm.ruleForm['rule'][0]} /> &nbsp;{vm.$t('de51ee4c.149f64')}
              &nbsp;
              <el-color-picker v-model={vm.ruleForm['rule'][1]} /> &nbsp;{vm.$t('de51ee4c.89ad37')}
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.47cf22'),
        key: 'img',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.ruleForm['img']} />
              <div>{vm.$t('de51ee4c.974a1b')}</div>
            </div>
          )
        }
      }
    ],
    vm
  )

// 抽奖记录按钮
export const recordFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: vm.$t('de51ee4c.6ed535'),
        key: 'rule',
        required: true,
        defaultValue: ['#ffffff', '#000000'],
        component(_) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <el-color-picker v-model={vm.recordForm['rule'][0]} /> &nbsp;
              {vm.$t('de51ee4c.149f64')}&nbsp;
              <el-color-picker v-model={vm.recordForm['rule'][1]} /> &nbsp;
              {vm.$t('de51ee4c.89ad37')}
            </div>
          )
        }
      },
      {
        label: vm.$t('de51ee4c.47cf22'),
        key: 'img',
        required: true,
        defaultValue: '',
        component(_) {
          return (
            <div>
              <SpImagePicker v-model={vm.recordForm['img']} />
              <div>{vm.$t('de51ee4c.974a1b')}</div>
            </div>
          )
        }
      }
    ],
    vm
  )
