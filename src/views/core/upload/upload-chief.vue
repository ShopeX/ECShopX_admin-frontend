<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="tip-info">
      <p>
        {{ $t('d69632f8.08f306') }}
      </p>
      <p>{{ $t('d69632f8.4f6279') }}</p>
    </div>

    <div class="action-container">
      <el-upload
        action=""
        :on-change="uploadHandleChange"
        :auto-upload="false"
        :show-file-list="false"
      >
        <el-button type="primary"> {{ $t('d69632f8.2c808b') }} </el-button>
      </el-upload>
      <el-button type="primary" @click="onDownLoadTemplate()">
        {{ $t('d69632f8.402a67') }}
      </el-button>
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
import { createSetting } from '@shopex-ui/finder'
import { downloadFile } from '@/utils'
import { getUploadLists, exportUploadErrorFile, exportUploadTemplate } from '../../../api/common'

export default {
  data() {
    return {
      finderSetting: null,
      loading: false,
      uploadList: []
    }
  },
  mounted() {
    this.initFinderSetting()
  },
  methods: {
    initFinderSetting() {
      const t = this.$t.bind(this)
      this.finderSetting = createSetting({
        columns: [
          { name: t('d69632f8.a6fc9e'), key: 'file_name' },
          {
            name: t('d69632f8.cae255'),
            key: 'created_date',
            formatterType: 'dateTime',
            width: 180
          },
          { name: t('d69632f8.396b7d'), key: 'file_size_format', width: 100 },
          {
            name: t('d69632f8.21b314'),
            key: 'handle_status',
            width: 120,
            formatter: (value, row, col) => {
              const HANDLE_STATUS = {
                wait: t('d69632f8.1e57c1'),
                processing: t('d69632f8.5d459d'),
                finish: t('d69632f8.7be39b')
              }
              return HANDLE_STATUS[value]
            }
          },
          {
            name: t('d69632f8.475dea'),
            key: 'finish_date',
            width: 180
          },
          {
            name: t('d69632f8.3ba621'),
            key: 'handle_message',
            width: 80,
            formatter: (value, row, col) => {
              return value.successLine > 0 ? `${value.successLine}行` : ''
            }
          },
          {
            name: t('d69632f8.1012e0'),
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
                                this.$message.error(this.$t('d69632f8.bfd8d5'))
                              }
                            }
                          }
                        },
                        t('d69632f8.3798d3')
                      )
                    ]
                  : []
              )
            }
          }
        ]
      })
    },
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
      this.$message.success(this.$t('d69632f8.7bbfaa'))
      this.$refs.finder.refresh(true)
    },
    async onDownLoadTemplate() {
      const res = await this.$api.common.exportUploadTemplate({
        file_type: 'community_chief',
        file_name: this.$t('d69632f8.733c3a')
      })
      if (res.file) {
        downloadFile(res.file, res.name)
      } else {
        this.$message.error(this.$t('d69632f8.bfd8d5'))
      }
    },
    getUploadList() {
      this.loading = true
      let params = { file_type: this.activeName, page: this.page, pageSize: this.pageSize }
      getUploadLists(params).then((response) => {
        this.uploadList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    }
  }
}
</script>
