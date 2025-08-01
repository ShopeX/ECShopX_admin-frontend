// 阿里云
// import Oss from 'ali-oss'
// 亚马逊
// import AWS from 'aws-sdk'
// 七牛
import * as QiNiu from 'qiniu-js'

//腾讯云
import COS from 'cos-js-sdk-v5'
// 获取Token
import { getOssToken, AliUpload, LocalUpload } from '../api/ossStorage'

class UploadUtil {
  constructor(fileType = 'image') {
    this.client = {}
    this.fileType = fileType
  }

  // 初始化
  init(tokenRes, uploadType = 'qiniu') {
    switch (uploadType) {
      case 'oss':
        this.aliInit(tokenRes)
        break
      case 'local':
        this.local(tokenRes)
        break
      // case 'aws':
      //   this.aws(tokenRes)
      //   break
      case 'cosv5':
        this.cos(tokenRes)
        break
      default:
        this.qiNiuInit(tokenRes)
    }
  }

  // 阿里云
  aliInit(tokenRes) {
    this.client.upload = (file) => AliUpload(tokenRes, file)
  }

  // 本地
  local(tokenRes) {
    this.client.upload = (file) => LocalUpload(tokenRes, file, this.fileType)
  }

  // 亚马逊
  aws(tokenRes) {
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
  //腾讯云
  cos(tokenRes) {
    console.log(tokenRes.token)
    var cos = new COS({
      getAuthorization: function (options, callback) {
        callback({ Authorization: tokenRes.token })
      }
    })
    try {
      this.client.upload = (file) => {
        return new Promise((resolve, reject) => {
          console.log(file)
          cos.uploadFile(
            {
              Bucket: tokenRes.bucket /* 填写自己的 bucket，必须字段 */,
              Region: tokenRes.region /* 存储桶所在地域，必须字段 */,
              Key: tokenRes.url /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
              Body: file, // 上传文件对象
              SliceSize:
                1024 *
                1024 *
                20 /* 触发分块上传的阈值，超过20MB 使用分块上传，小于20MB使用简单上传。可自行设置，非必须 */
            },
            (err, data) => {
              if (data) {
                const { Location } = data
                const key = Location.split('/').slice(1).join('/')
                console.log(key)
                resolve({
                  ...data,
                  key: key
                })
              } else {
                console.log(err)
                reject(err)
              }
            }
          )
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 七牛
  qiNiuInit(tokenRes) {
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
  setFileName() {
    const rx = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    const fileName = `${+new Date()}_${rx}${rx}`
    return fileName
  }

  // 上传
  async uploadImg(file) {
    console.log(file.uid, file.name)
    // 初始化
    try {
      const tokenRes = await getOssToken({
        filetype: this.fileType,
        filename: `${file.uid}.${file.name}`
      })
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
  async deleteImg(fileId) {
    console.log(fileId)
    const res = await this.client.deleteImg(fileId)
    return res
  }

  // 上传视频
  uploadVideo(file) {
    console.log('video')
  }
}

export default UploadUtil
