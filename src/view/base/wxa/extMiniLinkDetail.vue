<!--
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 小程序外链详情
 * @FilePath: /app/src/view/base/wxa/extMiniLinkDetail.vue
 * @Date: 2021-01-25 17:19:36
 * @LastEditors: Arvin
 * @LastEditTime: 2021-01-26 11:18:39
-->

<template>
  <div class="extMiniLinkDetail">
    <el-card class="elCard">
      <div slot="header">
        <h3>源源客会员服务</h3>
        <h5>配置外部小程序页面路径，供跳转到外部小程序使用。</h5>
      </div>
      <div class="search">
        <div class="left">
          <el-input
            class="appName"
            v-model="params.route_name"
            placeholder="请输入页面名称"
          ></el-input>
          <el-button class="button" type="primary" @click="getList">查询</el-button>
          <el-button class="button" type="default" @click="reset">重置</el-button>
        </div>
        <el-button type="primary" @click="showEditModal()">新增</el-button>
      </div>
      <el-table
        class="table"
        stripe
        border
        v-loading="tableLoading"
        :data="list"
      >
        <el-table-column
          prop="created_at"
          label="创建日期"
        >
        </el-table-column>
        <el-table-column
          prop="route_name"
          label="页面名称"
        >
        </el-table-column>
        <el-table-column
          prop="route_info"
          label="页面路径"
        >
        </el-table-column>
        <el-table-column
          prop="route_desc"
          label="描述"
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button class="actBtn" type="text" @click="showEditModal(scope.row)">编辑</el-button>
            <el-button class="actBtn" type="text" @click="removeCurrent(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="total_count > 0"
        class="pagination"
        layout="total, prev, pager, next, jumper"
        background
        @current-change="handleCurrentChange"
        :total="total_count"
        :page-size="params.page_size"
      >
        >
      </el-pagination>
    </el-card>
    <el-dialog
      class="modal"
      width="30%"
      :title="modalTitle"
      :visible="showModal"
      @close="closeModal"
    >
      <el-form
        label-suffix=":"
        label-width="120px"
        class="form"
        ref="editForm"
        :rules="rules"
        :model="editInfo"
      >
        <el-form-item label="页面名称" prop="route_name">
          <el-input v-model="editInfo.route_name" />
        </el-form-item>
        <el-form-item label="页面路径" prop="route_info">
          <el-input v-model="editInfo.route_info" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            placeholder="请输入内容（非必填）"
            resize="none"
            maxlength="30"
            show-word-limit
            :rows="3"
            v-model="editInfo.route_desc"
          />
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button class="btn" @click="closeModal">取 消</el-button>
        <el-button class="btn" type="primary" @click.stop="editWxConfig" :loading="isHttping"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWxLinkList,
  createWxLink,
  updateWxLink,
  removeWxLink
} from '../../../api/wxa.js'

export default {
  name: 'extMiniLinkDetail',
  data() {
    return {
      // 查询参数
      params: {
        page: 1,
        page_size: 10,
        route_name: '',
        wx_external_config_id: ''
      },
      // 规则
      rules: {
        route_name: [
          {
            required: true,
            message: '请输入页面名称',
            trigger: 'blur'
          }
        ],
        route_info: [
          {
            required: true,
            message: '请输入页面路径',
            trigger: 'blur'
          }
        ]
      },
      // 列表
      list: [],
      // 数据总数
      total_count: 0,
      // modal title
      modalTitle: '添加页面',
      // 是否显示modal
      showModal: false,
      // 是否请求中
      isHttping: false,
      // 表单请求中
      tableLoading: false,
      // 新增&编辑数据
      editInfo: {
        route_name: '',
        route_info: '',
        route_desc: ''
      }
    }
  },
  methods: {
    // 初始化
    init() {
      const { id } = this.$route.query
      this.params.wx_external_config_id = Number(id)
      this.getList()
    },
    // 重置搜索
    reset() {
      this.params.route_name = ''
      this.getList()
    },
    // 切换page
    handleCurrentChange(page) {
      this.params.page = page
      this.getList(false)
    },
    // 显示modal事件
    showEditModal(info = {}) {
      if (info && info.wx_external_config_id) {
        this.modalTitle = '修改页面'
        this.editInfo = {
          route_name: info.route_name,
          route_info: info.route_info,
          route_desc: info.route_desc,
          wx_external_routes_id: info.wx_external_routes_id,
          wx_external_config_id: info.wx_external_config_id
        }
      } else {
        this.editInfo.wx_external_config_id = this.params.wx_external_config_id
      }
      this.modalTitle = '添加页面'
      this.showModal = true
    },
    // 关闭modal事件
    closeModal() {
      this.editInfo = {
        route_name: '',
        route_info: '',
        route_desc: ''
      }
      this.$refs['editForm'].resetFields()
      this.showModal = false
    },
    // 删除当前页面路径
    removeCurrent(info) {
      const _self = this
      this.$confirm("删除当前页面路径？")
        .then(_ => {
          removeWxLink({id:info.wx_external_routes_id}).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              onClose() {
                if(_self.total_count % _self.params.page_size == 1 && _self.params.page > 1) { //当前页只有一条数据被删除, 删除后跳回上一页
                  _self.params.page -= 1
                  _self.getList(true)
                } else {
                  _self.getList(false)
                }
                
              }
            })
          })
        })
        .catch(_ => {});
    },
    // 新增&编辑小程序配置
    async editWxConfig() {
      if (this.isHttping) return false
      this.isHttping = true
      const params = this.editInfo
      let apiAction = createWxLink
      if (params.wx_external_routes_id) {
        apiAction = updateWxLink
      }
      try {
        await apiAction(params)
        this.closeModal()
        this.getList(false)
      } catch (e) {}
      this.isHttping = false
    },
    // 获取列表
    async getList(isInit = true) {
      this.tableLoading = true
      if (isInit) {
        this.params.page = 1
      }
      const res = await getWxLinkList(this.params)
      const { total_count, list } = res.data.data
      this.list = list
      this.total_count = total_count
      this.tableLoading = false
    },
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.extMiniLinkDetail {
  width: 100%;
  .elCard {
    width: 100%;
    .search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        .appName {
          min-width: 200px;
        }
        .button {
          margin-left: 15px !important;
        }
      }
    }
    .table {
      width: 100%;
      margin-top: 20px;
      .actBtn {
        margin-right: 15px;
      }
    }
    .pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
  .modal {
    .form {
      box-sizing: border-box;
      padding: 0 30px 0 0;
    }
    .btns {
      text-align: center;
      .btn {
        margin: 0 15px;
      }
    }
  }
}
</style>
