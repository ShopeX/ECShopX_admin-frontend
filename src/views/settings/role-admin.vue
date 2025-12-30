<template>
  <SpPage>
    <SpFormPlus v-model="params" form-type="searchForm" :form-items="filterFormItems" @submit="onSearch"
      @reset="onReset" :inline="true" label-position="left" label-width="70px"/>

    <div class="action-container mt-5">
      <el-button type="primary" @click="addRoleLabels"> 添加角色 </el-button>
    </div>

    <div class="flex gap-4 mt-4 h-[calc(100vh-200px)]" v-loading="loading">
      <div class="role-table-container flex flex-col w-[290px]">
        <el-table border :data="rolesList" @row-click="selectRole" :row-class-name="tableRowClassName"
          height="calc(100vh - 300px)" class="w-full cursor-pointer custom-table-header">
          <el-table-column prop="role_name" label="角色名称" width="290px" class="py-1">
            <template #default="{ row }">
              <div class="flex justify-between items-center w-full pr-5">
                <!--角色名和删除在水平方向上均匀分布，垂直居中对齐，第一个在起点，最后一个在终点，中间等间距-->
                <span :class="['role-name', activeRoleId === row.role_id ? 'text-purple-600' : '']">
                  {{ row.role_name }}
                </span>
                <el-button type="text" @click.stop="deleteSpecificRole(row)" class="hover:underline">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="p-0.5 text-xs border border-[#ebeef5] border-t-0 rounded-b w-full flex items-center justify-center">
          <el-pagination layout="total, prev, pager, next" :current-page="page.pageIndex" :total="total_count"
            :page-size="20" :pager-count="3" :small="true" @current-change="onCurrentChange"
            class="flex items-center justify-center" background />
        </div>
      </div>

      <div class="flex flex-col flex-1">
        <div
          class="bg-[#F0F2F5] py-2 px-1.5 border border-[#ebeef5] pl-2.5 rounded-t flex justify-between items-center">
          <span>{{ activeRole ? activeRole.role_name + ' - 角色权限' : '角色权限' }}</span>
          <el-button type="primary" @click="savePermissions" :loading="saveLoading" class="!mr-1">
            保存
          </el-button>
        </div>

        <div class="flex-1 overflow-y-auto border border-[#ebeef5] border-t-0 rounded-b bg-[#fafbfc]">
          <div v-if="activeRole && menu && menu.length > 0" class="bg-white rounded overflow-hidden">
            <table class="w-full border-collapse">
              <tbody>
                <!--for loop，第一行，先从一级菜单开始遍历-->
                <template v-for="firstMenu in menu">
                  <template v-if="firstMenu.children && firstMenu.children.length > 0">
                    <tr v-for="(secondMenu, secondIndex) in firstMenu.children"
                      :key="`${firstMenu.alias_name}-${secondMenu.alias_name}`"
                      class="hover:bg-[#f5f7fa] border-b border-[#ebeef5]">
                      <!--第一列：一级菜单-->
                      <td v-if="secondIndex === 0" :rowspan="firstMenu.children.length"
                        class="border-r border-[#ebeef5]">
                        <div class="flex items-center py-1">
                          <!-- pl-2 添加左侧内边距 -->
                          <el-checkbox class="pl-2" :value="isPermissionChecked(firstMenu.alias_name)"
                            :indeterminate="isPermissionIndeterminate(firstMenu.alias_name)"
                            @change="togglePermission(firstMenu.alias_name, $event)">
                            {{ firstMenu.name }}
                          </el-checkbox>
                        </div>
                      </td>

                      <!--第二列：二级菜单-->
                      <td class="bg-[#fcfcfc] border-r border-[#ebeef5]">
                        <div class="flex items-center py-2">
                          <el-checkbox class="pl-2" :value="isPermissionChecked(secondMenu.alias_name)"
                            :indeterminate="isPermissionIndeterminate(secondMenu.alias_name)"
                            @change="togglePermission(secondMenu.alias_name, $event)">
                            {{ secondMenu.name }}
                          </el-checkbox>
                        </div>
                      </td>

                      <!--第三列：三级菜单-->
                      <td>
                        <div v-if="secondMenu.children && secondMenu.children.length > 0"
                          class="flex flex-wrap gap-3 mt-2 mb-2">
                          <div v-for="thirdMenu in secondMenu.children" :key="thirdMenu.alias_name">
                            <el-checkbox class="pl-2" :value="isPermissionChecked(thirdMenu.alias_name)"
                              :indeterminate="isPermissionIndeterminate(thirdMenu.alias_name)"
                              @change="togglePermission(thirdMenu.alias_name, $event)">
                              {{ thirdMenu.name }}
                            </el-checkbox>
                          </div>
                        </div>
                        <div v-else class="h-full flex items-center">
                          <span class="no-data-text"></span>
                        </div>
                      </td>
                    </tr>
                  </template>

                  <!--没有子菜单的一级菜单，比如概况-->
                  <template v-else>
                    <tr class="hover:bg-[#f5f7fa] border-b border-[#ebeef5]">
                      <td class="border-r border-[#ebeef5]">
                        <div class="flex items-center py-2">
                          <el-checkbox class="pl-2" :value="isPermissionChecked(firstMenu.alias_name)"
                            @change="togglePermission(firstMenu.alias_name, $event)">
                            {{ firstMenu.name }}
                          </el-checkbox>
                        </div>
                      </td>
                      <td class="border-r border-[#ebeef5] ">
                        <div class="no-data-text"></div>
                      </td>
                      <td class="third-menu-cell">
                        <div class="no-data-text"></div>
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>

            </table>
          </div>
          <div v-else class="flex items-center justify-center h-[300px] text-[#909399] text-base bg-[#fafbfc]">
            <div class="empty-text">
              {{ activeRole ? '请从左侧选择一个角色进行权限配置' : '暂无权限数据' }}
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
      editRoleVisible: false,
      editRoleTitle: '',
      form: {
        role_name: '',
        role_id: '',
        permission: {
          shopmenu_alias_name: [],
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
      currentDialogPermissions: [],

      filterFormItems: [
        {
          formItemClass: 'w-1/3',
          label: '角色名称',
          fieldName: 'role_name',
          component: 'input',
          componentProps: {
            placeholder: '请输入角色名称'
          }
        }
      ],
      dialogFormItems: [
        {
          label: '角色名称',
          fieldName: 'role_name',
          component: 'input',
          componentProps: {
            placeholder: '订单管理员、商品管理员、等等',
            style: {
              width: '300px'
            }
          }
        }
      ]
    }
  },
  mounted() {
    const menu = this.$store.state.user.accessMenus
    this.menu = menu
    this.page.pageSize = 20
    this.fetchList()
  },
  watch: {
    //监听当前权限列表的变化
    currentPermissions: {
      handler(newPermissions) {
        const originalSet = new Set(this.originalPermissions)
        const currentSet = new Set(newPermissions)
        const sizeSame = originalSet.size === currentSet.size
        const contentSame = [...originalSet].every(perm => currentSet.has(perm))
        this.permissionsChanged = !(sizeSame && contentSame)
      },
      deep: true
    }
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.role_id === this.activeRoleId) {
        return 'current-row'
      }
      return ''
    },

    findMenuItem(aliasName, menuList = null) {
      const searchList = menuList || this.menu //this.menu为整个菜单树的根们
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

      //已经是叶子节点（没孩子）
      if (!node.children || node.children.length === 0) {
        if (node.alias_name) {
          permissions.push(node.alias_name)
        }
        return permissions
      }
      //不是叶子节点（有孩子）
      node.children.forEach(child => {
        permissions.push(...this.getLeafPermissions(child)) //JS Spread Syntax
      })
      return permissions
    },

    //检查节点是否选中，就相当于判断节点是否在权限列表里
    isNodeChecked(aliasName, permissions) {
      const permList = permissions
      const menuItem = this.findMenuItem(aliasName)
      if (!menuItem) {
        return permList.includes(aliasName) ? 2 : 0
      }
      //叶子节点，检查是否在权限列表中
      if (!menuItem.children || menuItem.children.length === 0) {
        return permList.includes(aliasName) ? 2 : 0
      }
      //父节点
      const leafPermissions = this.getLeafPermissions(menuItem)
      const selectedLeafCount = leafPermissions.filter(leaf => permList.includes(leaf)).length //有多少个被选中了

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

      //添加当前节点
      if (node.alias_name) {
        permissions.push(node.alias_name)
      }

      //递归添加子节点
      if (node.children) {
        node.children.forEach(child => {
          permissions.push(...this.getAllNodePermissions(child))
        })
      }
      return permissions
    },
    isPermissionChecked(aliasName) {
      const state = this.isNodeChecked(aliasName, this.currentPermissions)
      return state === 2//只有全选才返回true
    },
    isPermissionIndeterminate(aliasName) {
      const state = this.isNodeChecked(aliasName, this.currentPermissions)
      return state === 1 // 部分选中时返回true
    },
    togglePermission(aliasName, checked) {
      const menuItem = this.findMenuItem(aliasName)
      const currentState = this.isNodeChecked(aliasName, this.currentPermissions)
      //如果当前是部分选中状态，点击应该变为全选
      if (currentState === 1) {
        checked = true
      }

      if (checked) {
        //手动选中，添加该节点及其所有子节点的所有权限
        if (menuItem) {
          const allPermissions = this.getAllNodePermissions(menuItem)
          allPermissions.forEach(perm => {
            if (!this.currentPermissions.includes(perm)) {
              this.currentPermissions.push(perm)
            }
          })
        }
      } else {
        //手动取消选中,移除该节点及其所有子节点的所有权限
        if (menuItem) {
          const allPermissions = this.getAllNodePermissions(menuItem)
          allPermissions.forEach(perm => {
            const index = this.currentPermissions.indexOf(perm)
            if (index > -1) {
              this.currentPermissions.splice(index, 1)
            }
          })
        }
      }
      this.$forceUpdate()
    },
    async selectRole(role, index) {
      if (this.activeRoleId === role.role_id) {
        return
      }

      if (this.permissionsChanged && this.activeRoleId) {
        try {
          await this.$confirm('当前角色的权限有未保存的更改，是否要放弃更改并选择其他角色？', '提示', {
            confirmButtonText: '放弃更改',
            cancelButtonText: '取消',
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
      try {
        this.saveLoading = true
        const updateData = {
          role_name: this.activeRole.role_name,
          role_id: this.activeRole.role_id,
          permission: {
            shopmenu_alias_name: this.currentPermissions
          }
        }
        await this.$api.company.updateRolesInfo(this.activeRole.role_id, updateData)
        const roleIndex = this.rolesList.findIndex(r => r.role_id === this.activeRoleId)
        if (roleIndex !== -1) { //找到了roleIndex
          this.rolesList[roleIndex].permission = updateData.permission
        }
        this.originalPermissions = [...this.currentPermissions]
        this.permissionsChanged = false

        this.$message({
          message: '权限更新成功',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        this.$message({
          message: '权限更新失败，请重试',
          type: 'error',
          duration: 2000
        })
      } finally {
        this.saveLoading = false
      }
    },
    handleCancel() {
      this.editRoleVisible = false
      this.form.role_name = ''
      this.form.role_id = ''
      this.form.permission = {
        shopmenu_alias_name: [],
      }
      this.currentDialogPermissions = []
    },

    addRoleLabels() {
      this.form.role_name = ''
      this.form.role_id = ''
      this.form.permission = {
        shopmenu_alias_name: []
      }
      this.currentDialogPermissions = []
      
      this.$dialog.open({
        title: '角色添加',
        size: 'mini',
        buttonConfirm: {
          text: '保存'
        },
        content: (
          <SpFormPlus 
            v-model={this.form}
            form-type="dialogForm" 
            form-items={this.dialogFormItems}
            show-default-actions={false}/>
        ),
        confirmBefore: async () => {
            const formData = {
              role_name: this.form.role_name.trim(),
              permission: {
                shopmenu_alias_name: this.currentDialogPermissions || []
              }
            } 
            await this.$api.company.createRoles(formData)
            //重置状态
            this.activeRoleId = null
            this.activeRole = null
            this.activeRoleIndex = -1
            this.originalPermissions = []
            this.currentPermissions = []
            this.permissionsChanged = false
            await this.fetchList() 
            this.$message.success('角色添加成功')
        }
      })
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page

      let requestParams = {
        page,
        pageSize,
        service_type: 'timescard',
        role_name: this.params.role_name || ''
      }

      const previousActiveRoleId = this.activeRoleId

      try {
        const response = await this.$api.company.getRolesList(requestParams)
        const data = response
        this.rolesList = data.list || []
        this.total_count = data.total_count
        
        // 重置权限状态
        this.originalPermissions = []
        this.currentPermissions = []
        this.permissionsChanged = false

        let roleToSelect = null
        let selectIndex = -1

        if (previousActiveRoleId) {
          const previousRole = this.rolesList.find(role => role.role_id === previousActiveRoleId)
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
          message: '页面已过期，请刷新重试'
        })
      } finally {
        this.loading = false
      }
    },

    async deleteSpecificRole(row) {
      try {
        await this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$api.company.deleteRole(row.role_id)
        
        const deletedIndex = this.rolesList.findIndex(r => r.role_id === row.role_id)
        if (deletedIndex !== -1) {
          this.rolesList.splice(deletedIndex, 1)
          this.total_count--

          // 处理删除当前选中角色时的状态清理工作
          if (this.activeRoleId === row.role_id) {
            this.originalPermissions = []
            this.currentPermissions = []
            this.permissionsChanged = false
            this.activeRoleId = null
            this.activeRole = null
            this.activeRoleIndex = -1
          }
          
          // 如果删除后还剩余其他角色，自动选中第一个
          if (this.rolesList.length > 0) {
            const firstRole = this.rolesList[0]
            if (firstRole && firstRole.role_id) {
              await this.selectRole(firstRole, 0)
            }
          }
        }
        
        this.$message({
          message: '删除成功',
          type: 'success',
          duration: 5000
        })
      } catch (error) {
        if (error === 'cancel' || error === 'close') {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        } else {
          this.$message({
            message: '删除失败，请重试',
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

.role-table-container ::v-deep .el-table__row:hover>td {
  @apply !bg-[color-mix(in_srgb,_white_90%,_var(--primary))];
}

.custom-table-header :deep(.el-table__header .cell) {
  @apply py-1.5;
}
</style>
