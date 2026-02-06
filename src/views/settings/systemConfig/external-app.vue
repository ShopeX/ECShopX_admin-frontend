<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <SpFormPlus
        v-model="formData"
        form-type="searchForm"
        :form-items="formItems"
        @submit="onSearch"
        @reset="onSearch"
        :inline="true"
      />

      <div class="action-container mt-5">
        <el-button type="primary" icon="plus" @click="showEditModal('')"> 新增 </el-button>
      </div>

      <SpFinder
        ref="finder"
        url="/wxexternalconfig/list"
        no-selection
        :setting="setting"
        :hooks="{ beforeSearch: beforeSearch }"
        border
      />

      <el-dialog
        class="modal"
        width="30%"
        :title="modalTitle"
        :visible="showModal"
        @close="closeModal"
      >
        <el-form
          ref="editForm"
          label-suffix=":"
          label-width="120px"
          class="form"
          :rules="rules"
          :model="editInfo"
        >
          <el-form-item label="小程序名称" prop="app_name">
            <el-input v-model="editInfo.app_name" />
          </el-form-item>
          <el-form-item label="小程序APPID" prop="app_id">
            <el-input v-model="editInfo.app_id" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="editInfo.app_desc"
              type="textarea"
              placeholder="请输入内容（非必填）"
              resize="none"
              maxlength="30"
              show-word-limit
              :rows="3"
            />
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button class="btn" @click="closeModal"> 取 消 </el-button>
          <el-button class="btn" type="primary" :loading="isHttping" @click.stop="editWxConfig">
            确 定
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
      formItems: [
        {
          fieldName: 'app_name',
          label: '小程序名称',
          component: 'input',
          componentProps: {
            placeholder: '请输入小程序名称'
          }
        }
      ],
      // 规则
      rules: {
        app_name: [
          {
            required: true,
            message: '请输入小程序名称',
            trigger: 'blur'
          }
        ],
        app_id: [
          {
            required: true,
            message: '请输入小程序APPID',
            trigger: 'blur'
          }
        ]
      },
      // modal title
      modalTitle: '添加小程序',
      // 是否显示modal
      showModal: false,
      // 是否请求中
      isHttping: false,
      // 新增&编辑数据
      editInfo: {
        app_id: '',
        app_name: '',
        app_desc: ''
      },
      //SpFinder的配置
      setting: {
        columns: [
          {
            name: '创建日期',
            key: 'created_at',
            width: 220
          },
          {
            name: '小程序APPID',
            key: 'app_id',
            width: 250
          },
          {
            name: '小程序名称',
            key: 'app_name',
            width: 272
          },
          {
            name: '描述',
            key: 'app_desc',
            width: 300
          },
          {
            name: '操作',
            key: 'actions',
            width: 230,
            render: (h, { row }) => {
              return h('div', [
                h(
                  'el-button',
                  {
                    props: {
                      type: 'text'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => this.showEditModal(row)
                    }
                  },
                  '编辑'
                ),
                h(
                  'el-button',
                  {
                    props: {
                      type: 'text'
                    },
                    style: {
                      marginRight: '10px'
                    },
                    on: {
                      click: () => this.jumpDetail(row)
                    }
                  },
                  '页面路径'
                ),
                h(
                  'el-button',
                  {
                    props: {
                      type: 'text'
                    },
                    on: {
                      click: () => this.removeCurrent(row)
                    }
                  },
                  '删除'
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
        this.modalTitle = '修改小程序'
        this.editInfo = {
          app_id: info.app_id,
          app_name: info.app_name,
          app_desc: info.app_desc,
          wx_external_config_id: info.wx_external_config_id
        }
      } else {
        this.modalTitle = '添加小程序'
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
          message: '操作成功',
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
        await this.$confirm('确认删除当前设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })

        await removeWxLinkSetting({ id: info.wx_external_config_id })

        this.$message({
          message: '删除成功',
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
