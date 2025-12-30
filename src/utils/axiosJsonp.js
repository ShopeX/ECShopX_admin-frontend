/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import axios from 'axios'
import jsonp from 'jsonp'

const axiosJsonpAdapter = (config) => {
  return new Promise((resolve, reject) => {
    jsonp(config.url, config.params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.result)
      }
    })
  })
}

const instance = axios.create({
  adapter: axiosJsonpAdapter
})

export default instance
