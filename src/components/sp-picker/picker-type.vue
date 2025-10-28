<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<script>
import {
  PickerImage,
  PickerFilm,
  PickerCoupon,
  PickerCouponPackage,
  PickerGoods,
  PickerGoodsList,
  PickerGoodsSku,
  PickerGoodsParams,
  PickerSupplier,
  PickerShop,
  PickerSeckill,
  PickerPath,
  PickerTag,
  PickerShopTag,
  PickerVideo,
  PickerZitiList,
  PickerAfterSalesList,
  PickerTemplate,
  PickerCompany,
  PickerEditBoard,
  PickerPlanting,
  PickerPages,
  PickerGoodsItem,
  PickerWidget,
  PickerLottery,
  PickerCouponV2
} from './pickers'

function resolvePicker(type) {
  switch (type) {
    case 'pickerImage':
      return PickerImage
    case 'pickerFilm':
      return PickerFilm
    case 'pickerCoupon':
      return PickerCoupon
    case 'pickerCouponPackage':
      return PickerCouponPackage
    case 'pickerVideo':
      return PickerVideo
    case 'pickerGoods':
      return PickerGoods
    case 'pickerGoodsList':
      return PickerGoodsList
    case 'pickerGoodsSku':
      return PickerGoodsSku
    case 'pickerGoodsParams':
      return PickerGoodsParams
    case 'pickerShop':
      return PickerShop
    case 'pickerSeckill':
      return PickerSeckill
    case 'pickerPath':
      return PickerPath
    case 'pickerTag':
      return PickerTag
    case 'pickerShopTag':
      return PickerShopTag
    case 'pickerZitiList':
      return PickerZitiList
    case 'pickerAfterSalesList':
      return PickerAfterSalesList
    case 'pickerTemplate':
      return PickerTemplate
      case 'pickerSupplier':
      return PickerSupplier
    case 'pickerCompany':
      return PickerCompany
    case 'pickerEditBoard':
      return PickerEditBoard
    case 'pickerPlanting':
      return PickerPlanting
    case 'pickerPages':
      return PickerPages
    case 'pickerGoodsItem':
      return PickerGoodsItem
    case 'pickerWidget':
      return PickerWidget
    case 'pickerLottery':
      return PickerLottery
    case 'pickerCouponV2':
      return PickerCouponV2
    default:
      throw new Error(`picker: ${type} not registered`)
    // break
  }
}

export default {
  functional: true,

  render(h, ctx) {
    const type = ctx.props.type
    const data = {
      ...ctx.data,
      value: ctx.data.attrs.value
    }
    console.log(`picker type data:`, data, type)
    return h(resolvePicker(type), data, ctx.children)
  },

  resolvePickerConfig(type) {
    const Picker = resolvePicker(type)
    return Picker.config || {}
  }
}
</script>
