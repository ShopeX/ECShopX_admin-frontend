<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleAddMenu">{{ $t('22d29d8e.12c072') }}</el-button>
        <el-button type="info" @click="handleUrlDisabled">{{ $t('22d29d8e.a317e5') }}</el-button>
        <el-button v-if="dragOptions.disabled" type="danger" @click="handleDraggableDisabled">
          {{ draggableDisabled }}
        </el-button>
        <el-button v-else type="success" @click="handleDraggableDisabled">
          {{ draggableDisabled }}
        </el-button>
        <el-button type="primary" @click="handleDownMenu">
          {{ $t('22d29d8e.34b9e3') }}<i class="el-icon-download el-icon--right" />
        </el-button>
        <!-- <el-button
          type="primary"
          @click="handleDownDistributorMenu"
        >
          下载平台版配置<i class="el-icon-download el-icon--right" />
        </el-button> -->
        <el-upload
          style="margin-right: 10px; float: right"
          action=""
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button type="primary"
            >
{{ $t('22d29d8e.8d9a07') }}<i class="el-icon-upload el-icon--right"
          />
</el-button>
        </el-upload>
      </div>
      <div
        class="el-table el-table--fit el-table--border el-table--enable-row-transition el-table--small"
        style="width: 100%"
      >
        <div class="el-table__header-wrapper">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
            <colgroup>
              <col name="el-table_5_column_31" width="220">
              <col name="el-table_5_column_32" width="230">
              <col name="el-table_5_column_33" width="100">
              <col name="el-table_5_column_34" width="100">
              <col name="el-table_5_column_35" width="100">
              <col name="el-table_5_column_36" width="100">
              <col name="el-table_5_column_37" width="927">
            </colgroup>
            <thead class="">
              <tr class="">
                <th colspan="1" rowspan="1" class="el-table_5_column_31 is-leaf">
                  <div style="width: 210px" class="cell">{{ $t('22d29d8e.8ee9f2') }}</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_5_column_32 is-leaf">
                  <div style="width: 220px" class="cell">{{ $t('22d29d8e.f03065') }}</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_5_column_33 is-leaf">
                  <div style="width: 80px" class="cell">{{ $t('22d29d8e.ae57b1') }}</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_5_column_34 is-leaf">
                  <div style="width: 80px" class="cell">{{ $t('22d29d8e.6367e7') }}</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_5_column_35 is-leaf">
                  <div style="width: 80px" class="cell">{{ $t('22d29d8e.27b6a5') }}</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_5_column_36 is-leaf">
                  <div style="width: 80px" class="cell">{{ $t('22d29d8e.52fe00') }}</div>
                </th>
                <th colspan="1" rowspan="1" class="el-table_5_column_37 is-leaf">
                  <div class="cell">{{ $t('22d29d8e.2b6bc0') }}</div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <draggable :options="dragOptions" @end="handleMoveEndCheck">
        <transition-group tag="div">
          <div v-for="item in tableData" :key="item.shopmenu_id" class="">
            <div
              class="el-table el-table--fit el-table--border el-table--enable-row-transition el-table--small"
              style="width: 100%"
            >
              <div class="el-table__body-wrapper">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
                  <colgroup>
                    <col name="el-table_5_column" width="220">
                    <col name="el-table_5_column" width="230">
                    <col name="el-table_5_column" width="100">
                    <col name="el-table_5_column" width="100">
                    <col name="el-table_5_column" width="100">
                    <col name="el-table_5_column" width="100">
                    <col name="el-table_5_column" width="927">
                  </colgroup>
                  <thead class="">
                    <tr class="" style="font-size: 12px; color: #606266; font-weight: 400">
                      <td colspan="1" rowspan="1" class="el-table_5_column_31">
                        <div
                          v-if="item.level == 1"
                          class="cell"
                          style="padding-left: 10px; width: 210px"
                        >
                          {{ item.name }}
                        </div>
                        <div
                          v-if="item.level == 2"
                          class="cell"
                          style="padding-left: 40px; width: 210px"
                        >
                          {{ item.name }}
                        </div>
                        <div
                          v-if="item.level == 3"
                          class="cell"
                          style="padding-left: 70px; width: 210px"
                        >
                          {{ item.name }}
                        </div>
                        <div
                          v-if="item.level == 4"
                          class="cell"
                          style="padding-left: 100px; width: 210px"
                        >
                          {{ item.name }}
                        </div>
                      </td>
                      <td colspan="1" rowspan="1" class="el-table_5_column_32 is-leaf">
                        <div style="width: 220px" class="cell">
                          {{ item.url }}
                        </div>
                      </td>
                      <td colspan="1" rowspan="1" class="el-table_5_column_33 is-leaf">
                        <div v-if="item.is_show" style="width: 80px" class="cell">
                          {{ $t('22d29d8e.4d775d') }}
                        </div>
                        <div v-else style="width: 80px" class="cell">
                          {{ $t('22d29d8e.dce537') }}
                        </div>
                      </td>
                      <td colspan="1" rowspan="1" class="el-table_5_column_34 is-leaf">
                        <div style="width: 80px" class="cell">
                          {{ item.sort }}
                        </div>
                      </td>
                      <td colspan="1" rowspan="1" class="el-table_5_column_35 is-leaf">
                        <div v-if="item.is_menu" style="width: 80px" class="cell">
                          {{ $t('22d29d8e.4ccbdc') }}
                        </div>
                        <div v-else style="width: 80px" class="cell">
                          {{ $t('22d29d8e.4f227b') }}
                        </div>
                      </td>
                      <td colspan="1" rowspan="1" class="el-table_5_column_36 is-leaf">
                        <div
                          v-for="(item_menu_type, menu_type_key) in item['menu_type']"
                          :key="menu_type_key"
                          style="width: 80px"
                          class="cell"
                        >
                          <template v-if="item_menu_type === 'b2c'">
{{
                            $t('22d29d8e.34e314')
                          }}
</template>
                          <template v-if="item_menu_type === 'platform'">ECX</template>
                          <template v-if="item_menu_type === 'standard'">
{{
                            $t('22d29d8e.8adeba')
                          }}
</template>
                          <template v-if="item_menu_type === 'in_purchase'">
{{
                            $t('22d29d8e.9e498b')
                          }}
</template>
                          <template v-if="item_menu_type === 'all'">
{{
                            $t('22d29d8e.aa05fd')
                          }}
</template>
                        </div>
                      </td>
                      <td colspan="1" rowspan="1" class="el-table_5_column_37 is-leaf">
                        <div class="cell">
                          <el-button
                            v-if="item.is_menu && item.level <= 3"
                            type="text"
                            size="small"
                            @click="handleAddSubMenu(item)"
                          >
                            {{ $t('22d29d8e.70fe21') }}
                          </el-button>
                          <el-button type="text" size="small" @click="handleUpdateMenu(item)">
                            {{ $t('22d29d8e.ca3472') }}
                          </el-button>
                          <el-button type="text" size="small" @click="handleSetApis(item)">
                            {{ $t('22d29d8e.2d2a9b') }}
                          </el-button>
                          <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="acitonDeleteMenu(item.shopmenu_id)"
                          >
                            {{ $t('22d29d8e.2f4aad') }}
                          </el-button>
                        </div>
                      </td>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
      <el-dialog :title="$t('22d29d8e.beacb0')" :visible.sync="editApisVisible" width="30%">
        <el-form ref="form" :model="form" label-width="100px">
          <el-alert
            :title="$t('22d29d8e.6a036e')"
            type="info"
            :close-text="$t('22d29d8e.ce2695')"
          />
          <el-input
            v-model="setApisForm.apis"
            type="textarea"
            :rows="15"
            :placeholder="$t('22d29d8e.a11cc7')"
          />
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editApisVisible = false">{{ $t('22d29d8e.c08ab9') }}</el-button>
          <el-button type="primary" @click="actionSetMenuApis">{{
            $t('22d29d8e.aa7527')
          }}</el-button>
        </span>
      </el-dialog>

      <!-- 编辑弹出框 -->
      <el-dialog :title="$t('22d29d8e.ef3e1a')" :visible.sync="editVisible" width="40%">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item :label="$t('22d29d8e.842705')">
            <span>{{ parent_name || $t('22d29d8e.d81bb2') }}</span>
          </el-form-item>
          <el-form-item :label="$t('22d29d8e.8ee9f2')">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item :label="$t('22d29d8e.52fe00')">
            <el-checkbox-group v-model="form.menu_type">
              <el-checkbox label="all">{{ $t('22d29d8e.aa05fd') }}</el-checkbox>
              <el-checkbox label="b2c">{{ $t('22d29d8e.34e314') }}</el-checkbox>
              <el-checkbox label="platform">ECX</el-checkbox>
              <el-checkbox label="standard">{{ $t('22d29d8e.8adeba') }}</el-checkbox>
              <el-checkbox label="in_purchase">{{ $t('22d29d8e.9e498b') }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('22d29d8e.dbdeef')">
            <el-input v-model="form.alias_name" />
          </el-form-item>
          <el-form-item :label="$t('22d29d8e.948304')">
            <el-input v-model="form.icon" />
          </el-form-item>
          <el-form-item :label="$t('22d29d8e.1f8541')">
            <el-input v-model="form.sort" />
          </el-form-item>
          <el-form-item :label="$t('22d29d8e.f03065')">
            <div class="view-flex">
              <div class="parent-path">
                {{ form.parentUrl }}
              </div>
              <el-input v-if="isEdit" v-model="form.url" :disabled="isDisabledUpdateUrl" />
              <el-input v-else v-model="form.url" />
            </div>
          </el-form-item>
          <el-form-item v-if="!disabledIsMenu" :label="$t('22d29d8e.27b6a5')">
            <el-switch v-model="form.is_menu" />
          </el-form-item>
          <el-form-item :label="$t('22d29d8e.ae57b1')">
            <el-switch v-model="form.is_show" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">{{ $t('22d29d8e.c08ab9') }}</el-button>
          <el-button type="primary" @click="actionSaveMenu">{{ $t('22d29d8e.aa7527') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </SpPage>
</template>

<script>
import { getShopMenu, saveMenu, deleteMenu, downMenu, uploadMenu } from '../../api/shopmenu'
import { Message } from 'element-ui'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },

  data() {
    return {
      version: 6,
      dragOptions: {
        animation: 120,
        disabled: true,
        scroll: true,
        group: 'sortlist',
        ghostClass: 'ghost-style'
      },
      isDisabledUpdateUrl: true,
      isEdit: false,
      editApisVisible: false,
      editVisible: false,
      disabledIsMenu: false,
      draggableDisabled: '',
      parent_name: '',
      colspan: 0,
      setApisForm: {
        shopmenu_id: '',
        is_menu: true,
        apis: ''
      },
      form: {},
      shopmenulist: [],
      tableData: []
    }
  },
  created() {
    this.draggableDisabled = this.$t('22d29d8e.75c270')
    this.getMenuTrees()
  },
  methods: {
    getMenuTrees() {
      let params = { version: this.version }
      getShopMenu(params).then((res) => {
        this.tableData = res.list
        this.shopmenulist = res.list
      })
    },
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file: file.raw, version: this.version }
      uploadMenu(params).then((res) => {
        this.getMenuTrees()
      })
    },
    handleDraggableDisabled() {
      if (this.dragOptions.disabled) {
        this.dragOptions.disabled = false
        this.draggableDisabled = this.$t('22d29d8e.1d75bd')
      } else {
        this.dragOptions.disabled = true
        this.draggableDisabled = this.$t('22d29d8e.75c270')
      }
    },
    handleDownMenu() {
      downMenu(this.version)
    },
    // handleDownDistributorMenu () {
    //   downMenu(this.version, 'merchant')
    // },
    handleMoveEndCheck(event) {
      if (event.newIndex == event.oldIndex) {
        return
      }
      let oldItem, newParent, childItem
      // 向下移动
      if (event.newIndex > event.oldIndex) {
        oldItem = this.shopmenulist[event.oldIndex]
        newParent = this.shopmenulist[event.newIndex]
        childItem = this.shopmenulist[event.newIndex + 1]
      } else {
        // 向上移动
        oldItem = this.shopmenulist[event.oldIndex]
        newParent = this.shopmenulist[event.newIndex - 1]
        childItem = this.shopmenulist[event.newIndex]
      }

      console.log('old', oldItem)
      console.log('new', newParent)
      console.log('new id', newParent.shopmenu_id)

      if (!oldItem.is_menu) {
        Message({
          message: this.$t('22d29d8e.41e7c2'),
          type: 'success',
          duration: 5 * 1000
        })
        this.tableData = this.shopmenulist
        return
      }

      if (!newParent && oldItem.pid == 0) {
        oldItem.sort = this.shopmenulist[event.newIndex + 1].sort - 1
      } else if (
        oldItem.level == newParent.level &&
        newParent.isChildrenMenu == oldItem.isChildrenMenu
      ) {
        oldItem.sort = newParent.sort + 1
        oldItem.pid = newParent.pid
      } else if (
        (oldItem.level == newParent.level && newParent.isChildrenMenu != oldItem.isChildrenMenu) ||
        oldItem.level - 1 == newParent.level
      ) {
        if (childItem) {
          oldItem.sort = childItem.sort - 1
        } else {
          oldItem.sort = 1
        }
        oldItem.pid = newParent.shopmenu_id
      } else {
        this.tableData = this.shopmenulist
        Message({ message: this.$t('22d29d8e.7c2a0e'), type: 'error', duration: 5 * 1000 })
        return
      }

      saveMenu(true, oldItem).then((res) => {
        this.getMenuTrees()
      })
    },
    handleUrlDisabled() {
      this.isDisabledUpdateUrl = false
      Message({ message: this.$t('22d29d8e.e1aaf8'), type: 'success', duration: 5 * 1000 })
    },
    handleCellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'level-' + row.level
      }
    },
    handleSetApis(row) {
      this.editApisVisible = true
      this.setApisForm.apis = row.apis
      this.setApisForm.shopmenu_id = row.shopmenu_id
      this.setApisForm.is_menu = row.is_menu
    },
    actionSetMenuApis() {
      saveMenu(true, this.setApisForm).then((res) => {
        this.editApisVisible = false
        this.getMenuTrees()
      })
    },
    handleUpdateMenu(row) {
      this.parent_name = row.parent_name
      this.editVisible = true
      if (row.level >= 3 || row.level == 1) {
        this.disabledIsMenu = true
      } else {
        this.disabledIsMenu = false
      }
      this.isEdit = true
      this.form = row
    },
    handleAddSubMenu(row) {
      this.isEdit = false
      this.form = {
        version: this.version,
        is_menu: true,
        is_show: true,
        pid: 0,
        name: '',
        alias_name: '',
        menu_type: row.menu_type,
        parentUrl: row.url,
        url: '',
        sort: 1
      }
      if (row.level >= 3) {
        this.form.is_menu = false
        this.disabledIsMenu = true
      } else {
        this.form.is_menu = true
        this.disabledIsMenu = false
      }
      this.editVisible = true
      this.parent_name = row.name
      this.form.pid = row.shopmenu_id
    },
    handleAddMenu() {
      this.isEdit = false
      this.form = {
        version: this.version,
        is_menu: true,
        is_show: true,
        pid: 0,
        name: '',
        alias_name: '',
        menu_type: ['all'],
        url: '',
        sort: 1
      }
      this.disabledIsMenu = true
      this.editVisible = true
    },
    acitonDeleteMenu(id) {
      this.$confirm(this.$t('22d29d8e.1440f8'), this.$t('22d29d8e.02d981'), {
        confirmButtonText: this.$t('22d29d8e.38cf16'),
        cancelButtonText: this.$t('22d29d8e.625fb2'),
        type: 'warning'
      }).then(() => {
        deleteMenu(id).then((res) => {
          this.getMenuTrees()
        })
      })
    },
    actionSaveMenu() {
      if (this.form.url && this.form.url[0] !== '/') this.form.url = `/${this.form.url}`
      if (this.form.parentUrl) this.form.url = this.form.parentUrl + this.form.url
      console.log(this.form)
      saveMenu(this.isEdit, this.form).then((res) => {
        this.editVisible = false
        this.getMenuTrees()
      })
    }
  }
}
</script>
<style>
.handle-box {
  margin-bottom: 20px;
}
.red {
  color: #ff0000;
}
.ghost-style {
  display: block;
  color: transparent;
  border-style: dashed;
}
.el-upload--text .el-icon-upload {
  font-size: 14px;
  color: #fff;
  margin: 0px 0 0px;
  line-height: 0px;
  width: 30px;
}
.el-upload--text {
  border: 0px;
  height: 45px;
  width: 90px;
}
.view-flex {
  display: flex;
}
.view-flex-item {
  flex: 1;
}
.parent-path {
  padding-right: 10px;
  color: #999;
}
</style>
