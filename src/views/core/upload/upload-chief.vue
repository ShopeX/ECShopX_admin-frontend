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
<template>
  <div>
    <div class="tip-info">
      <p>
        上传文件如果有处理失败的行数后将会生成错误文件，请及时查看错误信息修改后重新下载，错误描述文件只保留<strong>15天</strong>。
      </p>
      <p>超过<strong>15天</strong>的错误描述文件将会删除，不再提供下载查看</p>
    </div>

    <div class="action-container">
      <el-upload
        action=""
        :on-change="uploadHandleChange"
        :auto-upload="false"
        :show-file-list="false"
      >
        <el-button type="primary"> 点击上传 </el-button>
      </el-upload>
      <el-button type="primary" @click="onDownLoadTemplate()"> 下载模版 </el-button>
    </div>

    <SpFinder
      no-selection
      ref="finder"
      url="/espier/upload_files"
      row-actions-align="left"
      row-actions-fixed-align="left"
      row-actions-width="120px"
      :other-config="{
        height: 400
      }"
      :fixed-row-action="true"
      :setting="finderSetting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />
  </div>
</template>
<script>
import { createSetting } from '@shopex/finder'
import { downloadFile } from '@/utils'
import { getUploadLists, exportUploadErrorFile, exportUploadTemplate } from '../../../api/common'

export default {
  data() {
    return {
      finderSetting: createSetting({
        columns: [
          { name: '上传文件', key: 'file_name' },
          { name: '上传时间', key: 'created_date', formatterType: 'dateTime', width: 180 },
          { name: '文件大小', key: 'file_size_format', width: 100 },
          {
            name: '处理状态',
            key: 'handle_status',
            width: 120,
            formatter: (value, row, col) => {
              const HANDLE_STATUS = {
                wait: '等待处理',
                processing: '处理中',
                finish: '处理完成'
              }
              return HANDLE_STATUS[value]
            }
          },
          {
            name: '处理完成时间',
            key: 'finish_date',
            width: 180
          },
          {
            name: '处理成功',
            key: 'handle_message',
            width: 80,
            formatter: (value, row, col) => {
              return value.successLine > 0 ? `${value.successLine}行` : ''
            }
          },
          {
            name: '处理失败',
            key: 'handle_message',
            render: (h, params) => {
              return h(
                'div',
                {
                  style: {
                    color: '#f56c6c'
                  }
                },
                params.row.handle_message.errorLine > 0
                  ? [
                      h(
                        'span',
                        {
                          style: {
                            color: '#f56c6c'
                          }
                        },
                        `${params.row.handle_message.errorLine}行`
                      ),
                      h(
                        'el-button',
                        {
                          attrs: {
                            class: 'ml-2'
                          },
                          props: {
                            type: 'text'
                          },
                          on: {
                            click: async () => {
                              const res = await this.$api.common.exportUploadErrorFile(
                                params.row.id,
                                {
                                  file_type: params.row.file_type
                                }
                              )
                              if (res.file) {
                                downloadFile(res.file, res.name)
                              } else {
                                this.$message.error('没有相关数据可导出')
                              }
                            }
                          }
                        },
                        '下载错误详情'
                      )
                    ]
                  : []
              )
            }
          }
        ]
      }),
      loading: false,
      uploadList: []
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        file_type: 'community_chief'
      }
      return params
    },
    async uploadHandleChange(file, fileList) {
      const params = { isUploadFile: true, file_type: 'community_chief', file: file.raw }
      await this.$api.common.handleUploadFile(params)
      this.$message.success('上传成功，等待处理')
      this.$refs.finder.refresh(true)
    },
    async onDownLoadTemplate() {
      const res = await this.$api.common.exportUploadTemplate({
        file_type: 'community_chief',
        file_name: '上传团长信息'
      })
      if (res.file) {
        downloadFile(res.file, res.name)
      } else {
        this.$message.error('没有相关数据可导出')
      }
    },
    getUploadList() {
      this.loading = true
      let params = { file_type: this.activeName, page: this.page, pageSize: this.pageSize }
      getUploadLists(params).then(response => {
        this.uploadList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    }
  }
}
</script>
