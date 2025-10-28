// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import RouteAuth from './route-auth'
import RouteBase from './route-base'
import RouteCossBorder from './route-crossborder'
import RouteEntityGoods from './route-entitygoods'
import RouteTradenormalorders from './route-tradenormalorders'
import RouteMember from './route-member'
import RouteSellers from './route-sellers'
import RouteStore from './route-store'
import RouteSupply from './route-supply'
import RoutePc from './route-pc'
import RouteMarketing from './route-marketing'
import RouteGuide from './route-guide'
import RouteFinancial from './route-financial'
import RouteCompanydata from './route-companydata'
import RouteSite from './route-site'
import RouteSetting from './route-setting'
import RouteTemplate from './route-template'
import RoutePointsmal from './route-pointsmall'
import RouteDealer from './route-dealer'
import RouteApplications from './route-applications'

/* shopadmin router */
import RouteShopAdminShopList from './route-shopadmin-shoplist'
import RouteShopAdminBase from './route-shopadmin-base'
import RouteShopAdminEntity from './route-shopadmin-entity'
import RouteShopAdminOrder from './route-shopadmin-order'
import RouteShopAdminMember from './route-shopadmin-member'
import RouteShopAdminStore from './route-shopadmin-store'
import RouteShopAdminMarketing from './route-shopadmin-marketing'
import RouteShopAdminStatistics from './route-shopadmin-statistics'
import RouteShopAdminShopSetting from './route-shopadmin-shopsetting'
import RouteShopAdminApplications from './route-shopadmin-applications'

/* Merchant router */
import RouteMerchantBase from './router-merchant-base'
import RouteMerchantOrder from '../merchant/route-order'
import RouteMerchantSellers from '../merchant/route-sellers'
import RouteMerchantCompanydata from '../merchant/route-companydata'
import RouteMerchantSetting from '../merchant/route-setting'
import RouteMerchantApplications from '../merchant/route-applications'
import RouteMerchantEntityGoods from '../merchant/route-entitygoods'

// dealer
import RouteDealerInfomation from './route-dealer-infomation'
import RouteDealerShop from './route-dealer-shop'
import RouteDealerTransaction from './route-dealer-transaction'
import RouteDealerIndex from './route-dealer-index'
import RouteDealerSetting from './route-dealer-setting'

//supplier
import RouteSupplierApplications from './route-supplier-applications'
import RouteSupplierEntitygoods from './route-supplier-entitygoods'
import RouteSupplierTradenormalorders from './route-supplier-tradenormalorders'
import RouteSupplierBase from './route-supplier-base'
import RouteSupplierSetting from './route-supplier-setting'

export default {
  RouteAuth,
  RouteBase,
  RouteCossBorder,
  RouteEntityGoods,
  RouteTradenormalorders,
  RouteMember,
  RouteSellers,
  RouteStore,
  RouteSupply,
  RoutePc,
  RouteMarketing,
  RouteGuide,
  RouteFinancial,
  RouteCompanydata,
  RouteSite,
  RouteSetting,
  RouteTemplate,
  RoutePointsmal,
  RouteDealer,
  RouteApplications,
  RouteShopAdminShopList,
  RouteShopAdminBase,
  RouteShopAdminEntity,
  RouteShopAdminOrder,
  RouteShopAdminMember,
  RouteShopAdminStore,
  RouteShopAdminMarketing,
  RouteShopAdminStatistics,
  RouteShopAdminShopSetting,
  RouteShopAdminApplications,
  RouteDealerInfomation,
  RouteDealerShop,
  RouteDealerTransaction,
  RouteDealerIndex,
  RouteDealerSetting,
  RouteMerchantBase,
  RouteMerchantOrder,
  RouteMerchantSellers,
  RouteMerchantCompanydata,
  RouteMerchantSetting,
  RouteSupplierApplications,
  RouteSupplierEntitygoods,
  RouteSupplierTradenormalorders,
  RouteSupplierBase,
  RouteSupplierSetting,
  RouteMerchantApplications,
  RouteMerchantEntityGoods
}
