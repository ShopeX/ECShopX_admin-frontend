/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: oss上传
 * @FilePath: /app/src/utils/uploadUtil.js
 * @Date: 2020-03-06 10:28:22
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-16 15:42:26
 */
// 阿里云
// import Oss from 'ali-oss'
// 亚马逊
import AWS from 'aws-sdk'
// 七牛
import * as QiNiu from 'qiniu-js'
// 获取Token
import { getOssToken, AliUpload, LocalUpload } from '../api/ossStorage'

class UploadUtil {
  constructor (fileType = 'image') {
    this.client = {}
    this.fileType = fileType
  }

  // 初始化
  init (tokenRes, uploadType = 'qiniu') {
    switch (uploadType) {
      case 'oss':
        this.aliInit(tokenRes)
        break
      case 'local':
        this.local(tokenRes)
        break
      case 'aws':
        this.aws(tokenRes)
        break
      default:
        this.qiNiuInit(tokenRes)
    }
  }

  // 阿里云
  aliInit (tokenRes) {
    this.client.upload = (file) => AliUpload(tokenRes, file)
  }

  // 本地
  local (tokenRes) {
    this.client.upload = (file) => LocalUpload(tokenRes, file, this.fileType)
  }

  // 亚马逊
  aws (tokenRes) {
    const { Region, AccessKeyId, Bucket, SecretAccessKey, SessionToken } = tokenRes

    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      region: Region,
      accessKeyId: AccessKeyId,
      secretAccessKey: SecretAccessKey,
      sessionToken: SessionToken
    })
    this.client.upload = (file) => {
      return new Promise((resolve, reject) => {
        s3.upload(
          {
            Bucket: Bucket,
            Key: `${file.uid}.${file.name}`,
            ContentType: file.type,
            Body: file
          },
          (err, data) => {
            if (data) {
              resolve({
                ...data,
                key: data.Location
              })
            } else {
              reject(err)
            }
          }
        )
      })
    }
  }

  // 七牛
  qiNiuInit (tokenRes) {
    this.client.upload = (flie, key) => {
      return new Promise((resolve, reject) => {
        const observable = QiNiu.upload(flie, key, tokenRes.token)
        observable.subscribe({
          next: () => {},
          error: (err) => reject(err),
          complete: (res) => resolve(res)
        })
      })
    }
  }

  // 生成文件名
  setFileName () {
    const rx = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    const fileName = `${+new Date()}_${rx}${rx}`
    return fileName
  }

  // 上传
  async uploadImg (file) {
    // 初始化
    try {
      const tokenRes = await getOssToken({ filetype: this.fileType })
      const data = { ...tokenRes.data.data.token }
      // 初始化
      this.init(data, tokenRes.data.data.driver)
      // console.log(data)
      // 生成文件名~
      // const fileName = this.setFileName()
      const res = await this.client.upload(file, data.key).catch((e) => console.error(e))
      if (res.data || res.key) {
        if (res.data && res.data.data) {
          return {
            key: res.data.data.image_url
          }
        }
        return res
      } else {
        return {
          key: `${data.dir}`
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  // 删除图片
  async deleteImg (fileId) {
    console.log(fileId)
    const res = await this.client.deleteImg(fileId)
    return res
  }

  // 上传视频
  uploadVideo (file) {
    console.log('video')
  }
}

export default UploadUtil
