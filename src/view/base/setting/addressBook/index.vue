<!--
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 企业通讯录
 * @FilePath: /app/src/view/base/setting/addressBook/index.vue
 * @Date: 2020-06-04 10:49:50
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-11 18:38:10
-->
<template>
  <div class="addressBook">
    <div class="actButton">
      <el-button type="primary" :loading="isLoading" @click.stop="getAdressBook">
        获取企业微信通讯录
      </el-button>
      <el-button :loading="loading.syncDepart" @click.stop="syncDepartToShop">
        同步选中部门到店铺
      </el-button>
      <el-button :loading="loading.syncMember" @click.stop="syncMemberToGuide">
        同步选中成员到导购
      </el-button>
    </div>
    <div v-loading="isLoading" class="main">
      <el-tree
        ref="elTree"
        class="elTree"
        :data="list"
        :props="treeProps"
        :expand-on-click-node="false"
        node-key="id"
        default-expand-all
        check-strictly
        show-checkbox
        @check="changeChecked"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-node">
          <span>{{ node.label }}</span>
          <span>
            <el-tooltip
              class="item"
              effect="dark"
              content="切换直属下级全选状态"
              placement="top-start"
            >
              <i class="el-icon-sort" @click.stop="() => checkAllChild(data)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="切换子级全选状态" placement="top-start">
              <i class="iconfont icon-qiehuan" @click.stop="() => checkAllChild(data, true)" />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="同步当前部门到已有门店"
              placement="top-start"
            >
              <i class="iconfont icon-tongbu" @click.stop="() => syncAllCheck(node)" />
            </el-tooltip>
          </span>
        </span>
      </el-tree>
      <div v-loading="tableLoading" class="table">
        <h3 class="title">
          {{ title }}
        </h3>
        <el-table
          ref="multipleTable"
          height="800"
          :data="tableData"
          @select="selectMember"
          @select-all="selectAllMember"
        >
          <el-table-column type="selection" width="55" :selectable="isSelectable" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="mobile" label="手机号" />
        </el-table>
      </div>
    </div>
    <el-dialog title="选择门店" custom-class="dialog" :visible.sync="dialogFormVisible">
      <el-input
        v-model="param.name"
        placeholder="请输入店铺名称"
        clearable
        class="input-with-select"
        @clear="pageChange(1)"
      >
        <el-button slot="append" icon="el-icon-search" @click.stop="pageChange(1)" />
      </el-input>
      <div v-loading="loading.storeList">
        <el-table :data="storeList" size="small">
          <el-table-column prop="name" label="门店名称" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                :loading="loading.syncClub"
                type="text"
                @click.stop="syncToShop(scope.row.distributor_id)"
              >
                同步至此店铺
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="param.page"
            @current-change="pageChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWorkwechat,
  getMemberByClub,
  syncClubToStore,
  syncMemberToGuide
} from '../../../../api/addressBook'
import { getDistributorList } from '../../../../api/marketing'

export default {
  name: 'AddressBook',
  data() {
    return {
      list: [],
      treeProps: {
        label: 'name',
        children: 'children'
      },
      tableData: [],
      selectNodeKey: [],
      selectMemberList: [],
      isLoading: false,
      storeList: [],
      departmentId: {},
      param: {
        page: 1,
        pageSize: 10,
        unbound: true,
        name: ''
      },
      total: 0,
      loading: {
        syncDepart: false,
        syncMember: false,
        storeList: false,
        syncClub: false
      },
      tableLoading: false,
      title: '',
      dialogFormVisible: false
    }
  },
  mounted() {
    this.getAdressBook()
  },
  methods: {
    // 获取通讯录
    getAdressBook: function () {
      this.isLoading = true
      this.selectNodeKey = []
      this.$refs.elTree.setCheckedKeys([])
      getWorkwechat().then(res => {
        this.list = res.data.data
        this.isLoading = false
        const { id, name } = this.list[0]
        this.getWorkMember(id, name)
      })
    },
    getWorkMember: function (id, name) {
      this.tableLoading = true
      this.selectMemberList = []
      getMemberByClub(id)
        .then(res => {
          this.title = name
          this.tableData = res.data.data
          this.$nextTick(() => {
            this.dealCheckable()
          })
          this.tableLoading = false
        })
        .catch(() => (this.tableLoading = false))
    },
    // 处理选中状态
    dealCheckable: function () {
      if (!this.$refs.multipleTable) return
      const data = this.tableData
      for (let i = 0; i < data.length; i++) {
        const isHave = this.selectMemberList.some(user => user.userid === data[i].userid)
        this.$refs.multipleTable.toggleRowSelection(data[i], isHave)
      }
    },
    // 同步选中部门到店铺
    syncDepartToShop: function () {
      // console.log(this.selectNodeKey)
      if (this.selectNodeKey.length <= 0) {
        this.$message({
          message: '请选择部门',
          type: 'error'
        })
        return
      }
      const param = {
        department_id: JSON.stringify(this.selectNodeKey)
      }
      syncClubToStore(param).then(res => {
        this.$message({
          message: '同步部门成功',
          type: 'success'
        })
      })
    },
    // 同步
    syncToShop: function (id) {
      const arr = JSON.stringify([this.departmentId])
      const param = {
        department_id: arr,
        distributor_id: id
      }
      // this.loading.syncClub = true
      syncClubToStore(param).then(res => {
        // this.loading.syncClub = false
        this.$message({
          message: '同步当前部门成功',
          type: 'success'
        })
      })
    },
    // 获取门店列表
    getStoreList: function () {
      this.loading.storeList = true
      getDistributorList(this.param).then(res => {
        this.storeList = res.data.data.list
        this.total = res.data.data.total_count
        this.loading.storeList = false
      })
    },
    // pagechange
    pageChange: function (val) {
      this.param.page = val
      this.getStoreList()
    },
    // 同步选中成员到导购
    syncMemberToGuide: function () {
      const list = this.selectMemberList
      if (list.length <= 0) {
        this.$message({
          message: '请选择成员',
          type: 'error'
        })
        return
      } else {
        this.loading.syncMember = true
        const ids = list.map(item => item.userid)
        const param = {
          user_ids: JSON.stringify(ids)
        }

        syncMemberToGuide(param)
          .then(res => {
            this.$message({
              message: '同步会员成功',
              type: 'success'
            })
            this.loading.syncMember = false
          })
          .catch(e => {
            this.loading.syncMember = false
          })
      }
    },
    // 点击节点
    nodeClick: function (data) {
      if (this.tableLoading) return
      const { id, name } = data
      this.getWorkMember(id, name)
    },
    // 全选子级
    checkAllChild: function (data, isChild = false) {
      const nodeKeys = this.mapChildren(data.children, isChild)
      // 处理nodekeys
      this.dealNodeKey(nodeKeys)
    },
    // 递归子集
    mapChildren: function (data, isChild) {
      console.log(data)
      const arr = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i].disabled) {
          arr.push({
            id: data[i].id,
            name: data[i].name
          })
        }
        if (data[i].children && isChild) {
          const children = this.mapChildren(data[i].children)
          arr.push(...children)
        }
      }
      return arr
    },
    dealNodeKey: function (nodeKeys) {
      let isAllHave = true
      const list = [...this.selectNodeKey]
      if (list.length > 0) {
        for (let i = 0; i < nodeKeys.length; i++) {
          const haveIndex = list.findIndex(item => item && item.id === nodeKeys[i].id)
          if (haveIndex !== -1) {
            list.splice(haveIndex, 1)
          } else {
            isAllHave = false
          }
        }
      } else {
        isAllHave = false
      }
      if (!isAllHave) list.push(...nodeKeys)
      this.selectNodeKey = list
      const ids = list.map(item => item.id)
      this.$refs.elTree.setCheckedKeys(ids)
    },
    // 处理单个变化
    changeChecked: function (data, isChecked) {
      const list = [...this.selectNodeKey]
      const haveIndex = list.findIndex(item => item && item.id === data.id)
      if (haveIndex !== -1) {
        list.splice(haveIndex, 1)
      } else {
        list.push({
          id: data.id,
          name: data.name
        })
      }
      this.selectNodeKey = list
    },
    // 递归所有选择节点
    mapChecked: function (data) {
      const arr = []
      const childNodes = data.childNodes
      if (data.checked) {
        arr.push({
          name: data.data.name,
          id: data.data.id
        })
      }
      if (childNodes && childNodes.length > 0) {
        for (let i = 0; i < childNodes.length; i++) {
          const children = this.mapChecked(childNodes[i])
          arr.push(...children)
        }
      }
      return arr
    },
    // 同步当前部门
    syncAllCheck: function (node) {
      const { data } = node
      this.departmentId = {
        id: data.id,
        name: data.name
      }
      this.dialogFormVisible = true
      this.param.page = 1
      this.param.name = ''
      this.getStoreList()
    },
    // 是否可以选择
    isSelectable: function (row) {
      return row.mobile
    },
    // 全选会员
    selectAllMember: function (data) {
      let list = this.selectMemberList
      if (data.length > 0) {
        const arr = data.filter(item => {
          const isHave = list.some(user => user.userid === item.userid)
          return !isHave
        })
        list.push(...arr)
      } else {
        const tableList = this.tableData
        const arr = list.filter(user => {
          const isHave = tableList.some(item => user.userid === item.userid)
          return !isHave
        })
        list = arr
      }
      this.selectMemberList = list
    },
    // 选择会员
    selectMember: function (data) {
      let list = this.selectMemberList
      if (data.length > 0) {
        list = list.filter(item => {
          const isHave = this.tableData.some(user => user.userid === item.userid)
          return !isHave
        })
        const arr = data.filter(item => {
          const isHave = list.some(user => user.userid === item.userid)
          return !isHave
        })
        list.push(...arr)
      } else {
        const tableList = this.tableData
        const arr = list.filter(user => {
          const isHave = tableList.some(item => user.userid === item.userid)
          return !isHave
        })
        list = arr
      }
      this.selectMemberList = list
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../style/iconfont/iconfont.css';

.addressBook {
  width: 100%;
  .actButton {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    .el-button {
      margin-right: 30px;
    }
  }
  .main {
    width: 100%;
    display: flex;
    .elTree {
      min-width: 25%;
      border-right: 1px solid #999;
      padding-right: 20px;
    }
    .custom-node {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item {
        font-size: 20px;
        &:nth-child(1) {
          color: #67c23a;
        }
        &:nth-child(2) {
          color: #e6a23c;
        }
        &:nth-child(3) {
          color: #f56c6c;
        }
      }
    }
    .table {
      flex: 1;
      margin-left: 20px;
      .title {
        text-align: center;
      }
    }
  }
  .pagination {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
