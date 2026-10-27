<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      v-model="params"
      form-type="searchForm"
      :form-items="filterFormItems"
      :inline="true"
      label-position="left"
      label-width="70px"
      @submit="onSearch"
      @reset="onReset"
    />

    <div class="action-container mt-5">
      <el-button type="primary" @click="addRoleLabels">{{ $t('1d952be7.596b04') }}</el-button>
    </div>

    <div v-loading="loading" class="flex gap-4 mt-4 h-[calc(100vh-200px)]">
      <div class="role-table-container flex flex-col w-[290px]">
        <el-table
          border
          :data="rolesList"
          :row-class-name="tableRowClassName"
          height="calc(100vh - 300px)"
          class="w-full cursor-pointer custom-table-header"
          @row-click="selectRole"
        >
          <el-table-column
            prop="role_name"
            :label="$t('1d952be7.10a6f1')"
            width="290px"
            class="py-1"
          >
            <template slot-scope="{ row }">
              <div class="flex justify-between items-center w-full pr-5">
                <span :class="['role-name', activeRoleId === row.role_id ? 'text-primary' : '']">
                  {{ row.role_name }}
                </span>
                <el-button
                  type="text"
                  class="hover:underline"
                  @click.stop="deleteSpecificRole(row)"
                >
                  {{ $t('1d952be7.2f4aad') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div
          class="p-0.5 text-xs border border-[#ebeef5] border-t-0 rounded-b w-full flex items-center justify-center"
        >
          <el-pagination
            layout="total, prev, pager, next"
            :current-page="page.pageIndex"
            :total="total_count"
            :page-size="20"
            :pager-count="3"
            :small="true"
            background
            class="flex items-center justify-center"
            @current-change="onCurrentChange"
          />
        </div>
      </div>

      <div class="flex flex-col flex-1">
        <div
          class="bg-[#F0F2F5] py-2 px-1.5 border border-[#ebeef5] pl-2.5 rounded-t flex justify-between items-center"
        >
          <span>{{
            activeRole ? activeRole.role_name + $t('34fa19b2.36afa2') : $t('1d952be7.86a1be')
          }}</span>
          <el-button
            type="primary"
            :loading="saveLoading"
            class="!mr-1"
            @click="savePermissions"
          >
            {{ $t('1d952be7.be5fbb') }}
          </el-button>
        </div>

        <div
          class="flex-1 overflow-y-auto border border-[#ebeef5] border-t-0 rounded-b bg-[#fafbfc]"
        >
          <div
            v-if="activeRole && menu && menu.length > 0"
            class="bg-white rounded overflow-hidden"
          >
            <table class="w-full border-collapse">
              <tbody>
                <template v-for="firstMenu in menu">
                  <template v-if="firstMenu.children && firstMenu.children.length > 0">
                    <tr
                      v-for="(secondMenu, secondIndex) in firstMenu.children"
                      :key="`${firstMenu.alias_name}-${secondMenu.alias_name}`"
                      class="hover:bg-[#f5f7fa] border-b border-[#ebeef5]"
                    >
                      <td
                        v-if="secondIndex === 0"
                        :rowspan="firstMenu.children.length"
                        class="border-r border-[#ebeef5]"
                      >
                        <div class="flex items-center py-1">
                          <el-checkbox
                            class="pl-2"
                            :value="isPermissionChecked(firstMenu.alias_name)"
                            :indeterminate="isPermissionIndeterminate(firstMenu.alias_name)"
                            @change="togglePermission(firstMenu.alias_name, $event)"
                          >
                            {{ firstMenu.name }}
                          </el-checkbox>
                        </div>
                      </td>

                      <td class="bg-[#fcfcfc] border-r border-[#ebeef5]">
                        <div class="flex items-center py-2">
                          <el-checkbox
                            class="pl-2"
                            :value="isPermissionChecked(secondMenu.alias_name)"
                            :indeterminate="isPermissionIndeterminate(secondMenu.alias_name)"
                            @change="togglePermission(secondMenu.alias_name, $event)"
                          >
                            {{ secondMenu.name }}
                          </el-checkbox>
                        </div>
                      </td>

                      <td>
                        <div
                          v-if="secondMenu.children && secondMenu.children.length > 0"
                          class="flex flex-wrap gap-3 mt-2 mb-2"
                        >
                          <div v-for="thirdMenu in secondMenu.children" :key="thirdMenu.alias_name">
                            <el-checkbox
                              class="pl-2"
                              :value="isPermissionChecked(thirdMenu.alias_name)"
                              :indeterminate="isPermissionIndeterminate(thirdMenu.alias_name)"
                              @change="togglePermission(thirdMenu.alias_name, $event)"
                            >
                              {{ thirdMenu.name }}
                            </el-checkbox>
                          </div>
                        </div>
                        <div v-else class="h-full flex items-center">
                          <span class="no-data-text" />
                        </div>
                      </td>
                    </tr>
                  </template>

                  <template v-else>
                    <tr
                      :key="firstMenu.alias_name"
                      class="hover:bg-[#f5f7fa] border-b border-[#ebeef5]"
                    >
                      <td class="border-r border-[#ebeef5]">
                        <div class="flex items-center py-2">
                          <el-checkbox
                            class="pl-2"
                            :value="isPermissionChecked(firstMenu.alias_name)"
                            @change="togglePermission(firstMenu.alias_name, $event)"
                          >
                            {{ firstMenu.name }}
                          </el-checkbox>
                        </div>
                      </td>
                      <td class="border-r border-[#ebeef5]">
                        <div class="no-data-text" />
                      </td>
                      <td>
                        <div class="no-data-text" />
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
          <div
            v-else
            class="flex items-center justify-center h-[300px] text-[#909399] text-base bg-[#fafbfc]"
          >
            <div class="empty-text">
              {{ activeRole ? $t('34fa19b2.7c1fcf') : $t('34fa19b2.5850fe') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </SpPage>
</template>

<script>
import { pageMixin } from '@/mixins'

export default {
  mixins: [pageMixin],
  data() {
    return {
      menu: [],
      form: {
        role_name: '',
        role_id: '',
        role_source: 'distributor',
        permission: {
          shopmenu_alias_name: []
        }
      },
      rolesList: [],
      loading: false,
      total_count: 0,
      params: {
        role_name: ''
      },
      activeRoleId: null,
      activeRole: null,
      activeRoleIndex: -1,
      saveLoading: false,
      originalPermissions: [],
      currentPermissions: [],
      permissionsChanged: false,
      currentDialogPermissions: []
    }
  },
  computed: {
    filterFormItems() {
      return [
        {
          formItemClass: 'w-1/3',
          label: this.$t('1d952be7.10a6f1'),
          fieldName: 'role_name',
          component: 'input',
          componentProps: {
            placeholder: this.$t('34fa19b2.2a92f5')
          }
        }
      ]
    },
    dialogFormItems() {
      return [
        {
          label: this.$t('1d952be7.10a6f1'),
          fieldName: 'role_name',
          component: 'input',
          componentProps: {
            placeholder: this.$t('1d952be7.395730'),
            style: {
              width: '300px'
            }
          }
        }
      ]
    }
  },
  watch: {
    currentPermissions: {
      handler(newPermissions) {
        const originalSet = new Set(this.originalPermissions)
        const currentSet = new Set(newPermissions)
        const sizeSame = originalSet.size === currentSet.size
        const contentSame = [...originalSet].every((perm) => currentSet.has(perm))
        this.permissionsChanged = !(sizeSame && contentSame)
      },
      deep: true
    }
  },
  mounted() {
    this.page.pageSize = 20
    this.getMenu()
    this.fetchList()
  },
  methods: {
    async getMenu() {
      try {
        const res = await this.$api.company.getPermissionList({ version: 3 })
        this.menu = Array.isArray(res) ? res : res?.list || res?.data || []
      } catch (e) {
        this.menu = []
      }
    },
    tableRowClassName({ row }) {
      if (row.role_id === this.activeRoleId) {
        return 'current-row'
      }
      return ''
    },
    findMenuItem(aliasName, menuList = null) {
      const searchList = menuList || this.menu
      for (const item of searchList) {
        if (item.alias_name === aliasName) {
          return item
        }
        if (item.children) {
          const found = this.findMenuItem(aliasName, item.children)
          if (found) return found
        }
      }
      return null
    },
    getLeafPermissions(node) {
      const permissions = []
      if (!node) return permissions

      if (!node.children || node.children.length === 0) {
        if (node.alias_name) {
          permissions.push(node.alias_name)
        }
        return permissions
      }
      node.children.forEach((child) => {
        permissions.push(...this.getLeafPermissions(child))
      })
      return permissions
    },
    isNodeChecked(aliasName, permissions) {
      const permList = permissions
      const menuItem = this.findMenuItem(aliasName)
      if (!menuItem) {
        return permList.includes(aliasName) ? 2 : 0
      }
      if (!menuItem.children || menuItem.children.length === 0) {
        return permList.includes(aliasName) ? 2 : 0
      }
      const leafPermissions = this.getLeafPermissions(menuItem)
      const selectedLeafCount = leafPermissions.filter((leaf) => permList.includes(leaf)).length

      if (selectedLeafCount === 0) {
        return 0
      } else if (selectedLeafCount === leafPermissions.length) {
        return 2
      } else {
        return 1
      }
    },
    getAllNodePermissions(node) {
      const permissions = []
      if (!node) return permissions

      if (node.alias_name) {
        permissions.push(node.alias_name)
      }

      if (node.children) {
        node.children.forEach((child) => {
          permissions.push(...this.getAllNodePermissions(child))
        })
      }
      return permissions
    },
    isPermissionChecked(aliasName) {
      const state = this.isNodeChecked(aliasName, this.currentPermissions)
      return state === 2
    },
    isPermissionIndeterminate(aliasName) {
      const state = this.isNodeChecked(aliasName, this.currentPermissions)
      return state === 1
    },
    togglePermission(aliasName, checked) {
      const menuItem = this.findMenuItem(aliasName)
      const currentState = this.isNodeChecked(aliasName, this.currentPermissions)
      if (currentState === 1) {
        checked = true
      }

      if (checked) {
        if (menuItem) {
          const allPermissions = this.getAllNodePermissions(menuItem)
          allPermissions.forEach((perm) => {
            if (!this.currentPermissions.includes(perm)) {
              this.currentPermissions.push(perm)
            }
          })
        }
      } else if (menuItem) {
        const allPermissions = this.getAllNodePermissions(menuItem)
        allPermissions.forEach((perm) => {
          const index = this.currentPermissions.indexOf(perm)
          if (index > -1) {
            this.currentPermissions.splice(index, 1)
          }
        })
      }
      this.$forceUpdate()
    },
    async selectRole(role, index) {
      if (this.activeRoleId === role.role_id) {
        return
      }

      if (this.permissionsChanged && this.activeRoleId) {
        try {
          await this.$confirm(this.$t('34fa19b2.a6dd59'), this.$t('1d952be7.02d981'), {
            confirmButtonText: this.$t('34fa19b2.1862d8'),
            cancelButtonText: this.$t('1d952be7.625fb2'),
            type: 'warning'
          })
        } catch {
          return
        }
      }

      this.activeRoleId = role.role_id
      this.activeRole = role
      this.activeRoleIndex = index

      const apiPermissions = role.permission?.shopmenu_alias_name || []
      this.originalPermissions = [...apiPermissions]
      this.currentPermissions = [...apiPermissions]
      this.permissionsChanged = false
      this.$forceUpdate()
    },
    async savePermissions() {
      if (!this.activeRole) {
        return
      }
      try {
        this.saveLoading = true
        const updateData = {
          role_name: this.activeRole.role_name,
          role_id: this.activeRole.role_id,
          role_source: 'distributor',
          permission: {
            shopmenu_alias_name: this.currentPermissions,
            version: 3
          }
        }
        await this.$api.company.updateRolesInfo(this.activeRole.role_id, updateData)
        const roleIndex = this.rolesList.findIndex((r) => r.role_id === this.activeRoleId)
        if (roleIndex !== -1) {
          this.rolesList[roleIndex].permission = updateData.permission
        }
        this.originalPermissions = [...this.currentPermissions]
        this.permissionsChanged = false

        this.$message({
          message: this.$t('34fa19b2.50e7aa'),
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        this.$message({
          message: this.$t('34fa19b2.23a961'),
          type: 'error',
          duration: 2000
        })
      } finally {
        this.saveLoading = false
      }
    },
    addRoleLabels() {
      this.form.role_name = ''
      this.form.role_id = ''
      this.form.role_source = 'distributor'
      this.form.permission = {
        shopmenu_alias_name: []
      }
      this.currentDialogPermissions = []

      this.$dialog.open({
        title: this.$t('1d952be7.d36f39'),
        size: 'mini',
        buttonConfirm: {
          text: this.$t('1d952be7.be5fbb')
        },
        content: (
          <SpFormPlus
            v-model={this.form}
            form-type='dialogForm'
            form-items={this.dialogFormItems}
            show-default-actions={false}
          />
        ),
        confirmBefore: async () => {
          const formData = {
            role_name: this.form.role_name.trim(),
            role_source: 'distributor',
            permission: {
              shopmenu_alias_name: this.currentDialogPermissions || [],
              version: 3
            }
          }
          await this.$api.company.createRoles(formData)
          this.activeRoleId = null
          this.activeRole = null
          this.activeRoleIndex = -1
          this.originalPermissions = []
          this.currentPermissions = []
          this.permissionsChanged = false
          await this.fetchList()
          this.$message.success(this.$t('34fa19b2.469266'))
        }
      })
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page

      const requestParams = {
        page,
        pageSize,
        service_type: 'timescard',
        role_source: 'distributor',
        role_name: this.params.role_name || ''
      }

      const previousActiveRoleId = this.activeRoleId

      try {
        const response = await this.$api.company.getRolesList(requestParams)
        const data = response?.list ? response : response?.data || {}
        this.rolesList = data.list || []
        this.total_count = data.total_count || 0

        this.originalPermissions = []
        this.currentPermissions = []
        this.permissionsChanged = false

        let roleToSelect = null
        let selectIndex = -1

        if (previousActiveRoleId) {
          const previousRole = this.rolesList.find((role) => role.role_id === previousActiveRoleId)
          if (previousRole) {
            roleToSelect = previousRole
            selectIndex = this.rolesList.indexOf(previousRole)
          }
        }

        if (!roleToSelect && this.rolesList.length > 0) {
          roleToSelect = this.rolesList[0]
          selectIndex = 0
        }

        if (roleToSelect) {
          await this.selectRole(roleToSelect, selectIndex)
        } else {
          this.activeRole = null
          this.activeRoleId = null
          this.activeRoleIndex = -1
        }
      } catch (error) {
        this.activeRoleId = null
        this.activeRole = null
        this.activeRoleIndex = -1
        this.originalPermissions = []
        this.currentPermissions = []
        this.permissionsChanged = false
        this.$message({
          type: 'error',
          message: this.$t('1d952be7.929b60')
        })
      } finally {
        this.loading = false
      }
    },
    async deleteSpecificRole(row) {
      try {
        await this.$confirm(this.$t('1d952be7.82cd52'), this.$t('1d952be7.02d981'), {
          confirmButtonText: this.$t('1d952be7.38cf16'),
          cancelButtonText: this.$t('1d952be7.625fb2'),
          type: 'warning'
        })
        await this.$api.company.deleteRole(row.role_id)

        const deletedIndex = this.rolesList.findIndex((r) => r.role_id === row.role_id)
        if (deletedIndex !== -1) {
          this.rolesList.splice(deletedIndex, 1)
          this.total_count--

          if (this.activeRoleId === row.role_id) {
            this.originalPermissions = []
            this.currentPermissions = []
            this.permissionsChanged = false
            this.activeRoleId = null
            this.activeRole = null
            this.activeRoleIndex = -1
          }

          if (this.rolesList.length > 0) {
            const firstRole = this.rolesList[0]
            if (firstRole && firstRole.role_id) {
              await this.selectRole(firstRole, 0)
            }
          }
        }

        this.$message({
          message: this.$t('1d952be7.0007d1'),
          type: 'success',
          duration: 5000
        })
      } catch (error) {
        if (error === 'cancel' || error === 'close') {
          this.$message({
            type: 'info',
            message: this.$t('1d952be7.2111cc')
          })
        } else {
          this.$message({
            message: this.$t('34fa19b2.89976e'),
            type: 'error',
            duration: 3000
          })
        }
      }
    },
    onSearch() {
      this.page.pageIndex = 1
      this.fetchList()
    },
    onReset() {
      this.params.role_name = ''
      this.page.pageIndex = 1
      this.activeRoleId = null
      this.activeRole = null
      this.activeRoleIndex = -1
      this.originalPermissions = []
      this.currentPermissions = []
      this.permissionsChanged = false
      this.fetchList()
    },
    onCurrentChange(val) {
      this.page.pageIndex = val
      this.fetchList()
    }
  }
}
</script>

<style scoped>
.role-table-container ::v-deep .el-table__body-wrapper {
  @apply overflow-y-auto w-full overflow-x-hidden;
}

.role-table-container ::v-deep .el-table__row:hover > td {
  @apply !bg-[color-mix(in_srgb,_white_90%,_var(--primary))];
}

.custom-table-header :deep(.el-table__header .cell) {
  @apply py-1.5;
}
</style>
