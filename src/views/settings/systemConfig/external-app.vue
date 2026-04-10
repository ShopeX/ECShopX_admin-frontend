<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <SpFormPlus v-model="formData" form-type="searchForm" :form-items="formItems" @submit="onSearch" @reset="onSearch"
        :inline="true" />

      <div class="action-container mt-5">
        <el-button type="primary" icon="plus" @click="showEditModal('')">
          {{
            $t('f06fa37c.66ab5e')
          }}
        </el-button>
      </div>

      <SpFinder ref="finder" url="/wxexternalconfig/list" no-selection :setting="setting"
        :hooks="{ beforeSearch: beforeSearch }" border />

      <el-dialog class="modal" width="30%" :title="modalTitle" :visible="showModal" @close="closeModal">
        <el-form ref="editForm" label-suffix=":" label-width="120px" class="form" :rules="rules" :model="editInfo">
          <el-form-item :label="$t('f06fa37c.d34f1f')" prop="app_name">
            <el-input v-model="editInfo.app_name" />
          </el-form-item>
          <el-form-item :label="$t('f06fa37c.d70fe9')" prop="app_id">
            <el-input v-model="editInfo.app_id" />
          </el-form-item>
          <el-form-item :label="$t('f06fa37c.3bdd08')">
            <el-input v-model="editInfo.app_desc" type="textarea" :placeholder="$t('f06fa37c.d51187')" resize="none"
              maxlength="30" show-word-limit :rows="3" />
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button class="btn" @click="closeModal">{{ $t('f06fa37c.c08ab9') }}</el-button>
          <el-button class="btn" type="primary" :loading="isHttping" @click.stop="editWxConfig">
            {{ $t('f06fa37c.aa7527') }}
          </el-button>
        </div>
      </el-dialog>
    </SpRouterView>
  </SpPage>
</template>

<script>
import { createWxLinkSetting, updateWxLinkSetting, removeWxLinkSetting } from '@/api/wxa.js'
import mixin, { pageMixin } from '@/mixins'

export default {
  name: 'ExtMiniLink',
  mixins: [mixin, pageMixin],
  data() {
    return {
      formData: {
        app_name: ''
      },
      // modal title
      modalTitle: '',
      // 是否显示modal
      showModal: false,
      // 是否请求中
      isHttping: false,
      // 新增&编辑数据
      editInfo: {
        app_id: '',
        app_name: '',
        app_desc: ''
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'app_name',
          label: this.$t('f06fa37c.d34f1f'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('f06fa37c.7437cc')
          }
        }
      ]
    },
    rules() {
      return {
        app_name: [
          {
            required: true,
            message: this.$t('f06fa37c.7437cc'),
            trigger: 'blur'
          }
        ],
        app_id: [
          {
            required: true,
            message: this.$t('f06fa37c.3eb8aa'),
            trigger: 'blur'
          }
        ]
      }
    },
    setting() {
      return {
        columns: [
          {
            name: this.$t('f06fa37c.696f5a'),
            key: 'created_at',
            width: 220
          },
          {
            name: this.$t('f06fa37c.d70fe9'),
            key: 'app_id',
            minWidth: 250
          },
          {
            name: this.$t('f06fa37c.d34f1f'),
            key: 'app_name',
            minWidth: 272
          },
          {
            name: this.$t('f06fa37c.3bdd08'),
            key: 'app_desc',
            minWidth: 300
          },
          {
            name: this.$t('f06fa37c.2b6bc0'),
            key: 'actions',
            minWidth: 230,
            render: (h, { row }) => {
              return h('div', [
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    style: { marginRight: '10px' },
                    on: { click: () => this.showEditModal(row) }
                  },
                  this.$t('f06fa37c.95b351')
                ),
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    style: { marginRight: '10px' },
                    on: { click: () => this.jumpDetail(row) }
                  },
                  this.$t('f06fa37c.e3a8a6')
                ),
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: { click: () => this.removeCurrent(row) }
                  },
                  this.$t('f06fa37c.2f4aad')
                )
              ])
            }
          }
        ]
      }
    }
  },
  methods: {
    beforeSearch(params) {
      const searchParams = {
        ...params,
        app_name: this.formData.app_name //search params
      }
      return searchParams
    },

    onSearch() {
      this.$nextTick(() => {
        if (this.$refs.finder) {
          this.$refs.finder.refresh()
        }
      })
    },

    // 显示modal事件
    showEditModal(info = {}) {
      if (info && info.wx_external_config_id) {
        this.modalTitle = this.$t('f06fa37c.6a6664')
        this.editInfo = {
          app_id: info.app_id,
          app_name: info.app_name,
          app_desc: info.app_desc,
          wx_external_config_id: info.wx_external_config_id
        }
      } else {
        this.modalTitle = this.$t('f06fa37c.1880be')
        this.editInfo = {
          app_id: '',
          app_name: '',
          app_desc: ''
        }
      }
      this.showModal = true
    },

    // 关闭modal事件
    closeModal() {
      this.editInfo = {
        app_id: '',
        app_name: '',
        app_desc: ''
      }
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
      this.showModal = false
    },

    // 新增&编辑小程序配置
    async editWxConfig() {
      if (this.isHttping) return false
      this.isHttping = true

      try {
        const params = { ...this.editInfo }
        let apiAction = params.wx_external_config_id ? updateWxLinkSetting : createWxLinkSetting

        await apiAction(params)
        this.closeModal()
        if (this.$refs.finder) {
          this.$refs.finder.refresh()
        }
        this.$message({
          message: this.$t('f06fa37c.33130f'),
          type: 'success'
        })
      } catch (e) {
        console.error(e)
      }
      this.isHttping = false
    },

    // 跳转详情
    jumpDetail(info) {
      const path = this.matchRoutePath('editor')
      this.$router.push({
        path,
        query: {
          id: info.wx_external_config_id
        }
      })
    },

    // 删除当前设置
    async removeCurrent(info) {
      try {
        await this.$confirm(this.$t('f06fa37c.6d7618'), this.$t('f06fa37c.02d981'), {
          confirmButtonText: this.$t('f06fa37c.38cf16'),
          cancelButtonText: this.$t('f06fa37c.625fb2')
        })

        await removeWxLinkSetting({ id: info.wx_external_config_id })

        this.$message({
          message: this.$t('f06fa37c.0007d1'),
          type: 'success'
        })

        if (this.$refs.finder) {
          this.$refs.finder.refresh()
        }
      } catch (error) {
        // 用户取消删除
      }
    }
  }
}
</script>
