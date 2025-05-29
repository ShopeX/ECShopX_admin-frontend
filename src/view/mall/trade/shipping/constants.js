// 包邮或者到付规则默认值
export const payForRule = {
  // 运费设置表格 - 包邮 - 重量
  free_conf_isFree: [
    {
      // area: '0',
      freetype: '1',
      inweight: '',
      upmoney: ''
    }
  ],
  // 运费设置表格 - 到付 - 重量
  free_conf_isAmount: [
    {
      // area: '0',
      freetype: '1',
      inweight: '',
      upmoney: ''
    }
  ],
  // 运费设置表格 - 包邮 - 件数
  free_number_conf_isFree: [
    {
      // area: '0',
      freetype: '1',
      upquantity: '',
      upmoney: ''
    }
  ],
  // 运费设置表格 - 到付 - 件数
  free_number_conf_isAmount: [
    {
      // area: '0',
      freetype: '1',
      upquantity: '',
      upmoney: ''
    }
  ],
  // 运费设置表格 - 体积 - 件数
  free_volume_conf_isFree: [
    {
      // area: '0',
      freetype: '1',
      upvolume: '',
      upmoney: ''
    }
  ],
  // 运费设置表格 - 体积 - 件数
  free_volume_conf_isAmount: [
    {
      // area: '0',
      freetype: '1',
      upvolume: '',
      upmoney: ''
    }
  ]
}

// 城市运费规则默认值
export const cityFeeConfig = {
  fee_conf: [
    {
      start_standard: '',
      start_fee: '',
      add_standard: '',
      add_fee: ''
    }
  ],
  fee_number_conf: [
    {
      start_standard: '',
      start_fee: '',
      add_standard: '',
      add_fee: ''
    }
  ],
  fee_volume_conf: [
    {
      start_standard: '',
      start_fee: '',
      add_standard: '',
      add_fee: ''
    }
  ]
}

// 下拉选择默认值
export const selectConfig = {
  options: [
    {
      'label': '重量',
      'value': '1'
    },
    {
      'label': '金额',
      'value': '2'
    },
    {
      'label': '重量+金额',
      'value': '3'
    }
  ],
  options_number: [
    {
      'label': '件数',
      'value': '1'
    },
    {
      'label': '金额',
      'value': '2'
    },
    {
      'label': '件数+金额',
      'value': '3'
    }
  ],
  options_volume: [
    {
      'label': '体积',
      'value': '1'
    },
    {
      'label': '金额',
      'value': '2'
    },
    {
      'label': '体积+金额',
      'value': '3'
    }
  ]
}

// 运费模式
export const feeStatuConfig = {
  numberFreeStatus: '',
  numberFreeStatus1: '',
  priceFreeStatus: '',
  priceFreeStatus1: '',
  volumeFreeStatus: '',
  volumeFreeStatus1: '',

  amountFeeStatus: {}
}

export const fee_money_conf = [
  {
    area: '0',
    rules: [
      {
        up: 0.0,
        down: '',
        basefee: ''
      }
    ]
  }
]
