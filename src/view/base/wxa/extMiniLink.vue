<template>
  <div
    v-if="$route.path.indexOf('editor') === -1"
    class="extMiniLink"
  >
    <el-card class="elCard">
      <div slot="header">
        <h3>外部小程序设置</h3>
        <h5>外部小程序配置的页面可供店铺小程序直接调用，在模版中进行配置。</h5>
      </div>
      <div class="search">
        <div class="left">
          <el-input
            v-model="params.app_name"
            class="appName"
            placeholder="请输入小程序名称"
          />
          <el-button
            class="button"
            type="primary"
            @click="getList"
          >
            查询
          </el-button>
          <el-button
            class="button"
            type="default"
            @click="reset"
          >
            重置
          </el-button>
        </div>
        <el-button
          type="primary"
          @click="showEditModal('')"
        >
          新增
        </el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        class="table"
        stripe
        border
        :data="list"
      >
        <el-table-column
          prop="created_at"
          label="创建日期"
        />
        <el-table-column
          prop="app_id"
          label="小程序APPID"
        />
        <el-table-column
          prop="app_name"
          label="小程序名称"
        />
        <el-table-column
          prop="app_desc"
          label="描述"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              class="actBtn"
              type="text"
              @click="showEditModal(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              class="actBtn"
              type="text"
              @click="jumpDetail(scope.row)"
            >
              页面路径
            </el-button>
            <el-button
              class="actBtn"
              type="text"
              @click="removeCurrent(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="total_count > 0"
        class="pagination"
        layout="total, prev, pager, next, jumper"
        background
        :total="total_count"
        :page-size="params.page_size"
        @current-change="handleCurrentChange"
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
        ref="editForm"
        label-suffix=":"
        label-width="120px"
        class="form"
        :rules="rules"
        :model="editInfo"
      >
        <el-form-item
          label="小程序名称"
          prop="app_name"
        >
          <el-input v-model="editInfo.app_name" />
        </el-form-item>
        <el-form-item
          label="小程序APPID"
          prop="app_id"
        >
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
        <el-button
          class="btn"
          @click="closeModal"
        >
          取 消
        </el-button>
        <el-button
          class="btn"
          type="primary"
          :loading="isHttping"
          @click.stop="editWxConfig"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
  <router-view v-else />
</template>

<script>
import {
  getWxLinkListSetting,
  createWxLinkSetting,
  updateWxLinkSetting,
  removeWxLinkSetting
} from '../../../api/wxa.js'

export default {
  name: 'ExtMiniLink',
  data () {
    return {
      // 查询参数
      params: {
        page: 1,
        page_size: 10,
        app_name: ''
      },
      // 规则
      rules: {
        app_name: [
          {
            required: true,
            message: '请输入小程序id',
            trigger: 'blur'
          }
        ],
        app_id: [
          {
            required: true,
            message: '请输入小程序名称',
            trigger: 'blur'
          }
        ]
      },
      // 列表
      list: [],
      // 数据总数
      total_count: 0,
      // modal title
      modalTitle: '添加小程序',
      // 是否显示modal
      showModal: false,
      // 是否请求中
      isHttping: false,
      // 表单请求中
      tableLoading: false,
      // 新增&编辑数据
      editInfo: {
        app_id: '',
        app_name: '',
        app_desc: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      this.getList()
    },
    // 重置搜索
    reset () {
      this.params.app_name = ''
      this.getList()
    },
    // 切换page
    handleCurrentChange (page) {
      this.params.page = page
      this.getList(false)
    },
    // 显示modal事件
    showEditModal (info = {}) {
      if (info && info.wx_external_config_id) {
        this.modalTitle = '修改小程序'
        this.editInfo = {
          app_id: info.app_id,
          app_name: info.app_name,
          app_desc: info.app_desc,
          wx_external_config_id: info.wx_external_config_id
        }
      }
      this.modalTitle = '添加小程序'
      this.showModal = true
    },
    // 关闭modal事件
    closeModal () {
      this.editInfo = {
        app_id: '',
        app_name: '',
        app_desc: ''
      }
      this.$refs['editForm'].resetFields()
      this.showModal = false
    },
    // 新增&编辑小程序配置
    async editWxConfig () {
      if (this.isHttping) return false
      this.isHttping = true
      const params = this.editInfo
      let apiAction = createWxLinkSetting
      if (params.wx_external_config_id) {
        apiAction = updateWxLinkSetting
      }
      try {
        await apiAction(params)
        this.closeModal()
        this.getList(false)
      } catch (e) {}
      this.isHttping = false
    },
    // 跳转详情
    jumpDetail (info) {
      const path = this.matchHidePage('editor')
      // return false
      this.$router.push({
        path,
        query: {
          id: info.wx_external_config_id
        }
      })
    },
    // 删除当前设置
    removeCurrent (info) {
      const _self = this
      this.$confirm('确认删除当前设置？')
        .then((_) => {
          removeWxLinkSetting({ id: info.wx_external_config_id }).then((response) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              onClose () {
                if (_self.total_count % _self.params.page_size == 1 && _self.params.page > 1) {
                  //当前页只有一条数据被删除, 删除后跳回上一页
                  _self.params.page -= 1
                  _self.getList(true)
                } else {
                  _self.getList(false)
                }
              }
            })
          })
        })
        .catch((_) => {})
    },
    // 获取列表
    async getList (isInit = true) {
      this.tableLoading = true
      if (isInit) {
        this.params.page = 1
      }
      const res = await getWxLinkListSetting(this.params)
      const { total_count, list } = res.data.data
      this.list = list
      this.total_count = total_count
      this.tableLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.extMiniLink {
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
