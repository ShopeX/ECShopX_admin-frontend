/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 * Usage: i18n.t(errorCode[code]) or getMessage(i18n, code)
 */
const errorCode = {
  'code-1': 'b1d53680.0cbb68',
  code48005: 'b1d53680.3b2597',
  code400002: 'b1d53680.9689b0',
  code65400: 'b1d53680.a861bc',
  code65409: 'b1d53680.8817c2',
  code61007: 'b1d53680.62a2ca',
  code48001: 'b1d53680.62a2ca',
  code65404: 'b1d53680.4fafd7',
  code85038: 'b1d53680.3172e6',
  code85039: 'b1d53680.86724d',
  code85040: 'b1d53680.6ca62a',
  code85041: 'b1d53680.41822b',
  code85042: 'b1d53680.79d6e5',
  code85054: 'b1d53680.995d83',
  code85055: 'b1d53680.e96b9e',
  code85056: 'b1d53680.c78034',
  code65115: 'b1d53680.7f1376',
  code65118: 'b1d53680.58f18b',
  code85053: 'b1d53680.ebe4d0',
  code65403: 'b1d53680.4a8931',
  code65405: 'b1d53680.566837',
  code65406: 'b1d53680.a9fdd6',
  code65401: 'b1d53680.07a502',
  code65407: 'b1d53680.5c3ae1',
  code65408: 'b1d53680.e77ba9',
  code65410: 'b1d53680.6b88cf',
  code65411: 'b1d53680.52904e',
  code65412: 'b1d53680.8b3d9c',
  code89001: 'b1d53680.872583',
  code89003: 'b1d53680.6f949c',
  code89004: 'b1d53680.b8f014',
  code85009: 'b1d53680.4f352d'
}

export function getMessage(i18n, code) {
  const key = errorCode[code]
  return key ? i18n.t(key) : undefined
}

export default errorCode
