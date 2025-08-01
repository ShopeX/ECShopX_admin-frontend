<template>
  <div>
    <div class="content-bottom-padded">
      <el-tooltip effect="dark" content="最多添加100个客服" placement="bottom-start">
        <el-button type="primary" icon="plus" @click="addWechatKf"> 添加客服 </el-button>
      </el-tooltip>
      <el-button type="primary" icon="share" @click="loginWechatKf"> 登录微信客服 </el-button>
    </div>
    <el-table v-loading="loading" :data="kflist" :height="wheight - 160">
      <el-table-column label="客服头像" width="180">
        <template slot-scope="img">
          <img v-if="img.row.kf_headimgurl" :src="wximageurl + img.row.kf_headimgurl" height="40">
        </template>
      </el-table-column>
      <el-table-column prop="kf_nick" label="昵称" />
      <el-table-column label="绑定微信号">
        <template slot-scope="wx">
          <div v-if="wx.row.kf_wx">
            {{ wx.row.kf_wx }}
          </div>
          <div v-else-if="wx.row.invite_wx">
            {{ wx.row.invite_wx }}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="是否在线">
        <template slot-scope="online">
          <div v-if="online.row.is_online">
            <el-tag type="success" size="mini"> 在线 </el-tag>
          </div>
          <div v-else>
            <el-tag size="mini"> 离线 </el-tag>
          </div>
          <div v-else>
            <el-tag size="mini"> 未绑定 </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="邀请状态">
        <template slot-scope="status">
          <div v-if="status.row.invite_status === 'waiting'">
            <el-tag size="mini"> 绑定邀请待确认 </el-tag>
          </div>
          <div v-else-if="status.row.kf_wx">
            <el-tag type="success" size="mini"> 已绑定 </el-tag>
          </div>
          <div v-else>
            <el-tag size="mini"> 未绑定 </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i class="iconfont icon-edit1" @click="editWechatKf(scope.$index, scope.row)" />
            <i
              class="mark iconfont icon-trash-alt1"
              @click="deleteWechatKfAction(scope.$index, scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="微信客服" :visible.sync="addWechatKfVisible">
      <template>
        <el-form :model="wechatKfFromData" class="demo-ruleForm">
          <el-form-item label="客服昵称">
            <el-input v-model="wechatKfFromData.nick" />
            <p class="frm-tips">客服昵称，最长16个字</p>
          </el-form-item>
          <el-form-item v-if="isEdit === false" label="客服微信号">
            <p class="frm-tips">请输入需绑定的客服人员微信号</p>
            <el-input v-model="wechatKfFromData.wx_name" />
          </el-form-item>
          <el-form-item label="客服头像">
            <div class="frm-tips">只能上传jpg/png文件，且不超过2M</div>
            <el-upload
              list-type="picture"
              action=""
              class="avatar-uploader"
              :data="wechatKfFromData"
              :on-change="handleChange"
              :show-file-list="false"
              :auto-upload="false"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" width="300">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addWechatKfVisible = false"> 取消 </el-button>
        <el-button v-if="isEdit === false" type="primary" @click.native="addWechatKfAction">
          邀请
        </el-button>
        <el-button v-else type="primary" @click.native="editWechatKfAction"> 保存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { validatUploadImage } from '../../../utils/validate'
import { Message } from 'element-ui'
import {
  getWechatKfs,
  createWechatKfs,
  deleteWechatKfs,
  updateWechatKfs
} from '../../../api/wechat'
export default {
  data() {
    return {
      activeName: 'first',
      addWechatKfVisible: false,
      kflist: [],
      imageUrl: '',
      imageFile: {},
      wechatKfFromData: {
        account: '',
        wx_name: '',
        nick: ''
      },
      loading: false,
      isEdit: false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getWechatKf()
  },
  methods: {
    addWechatKf() {
      this.addWechatKfVisible = true
      this.isEdit = false
      this.wechatKfFromData.account = ''
      this.wechatKfFromData.wx_name = ''
      this.wechatKfFromData.nick = ''
      this.imageUrl = ''
    },
    handleChange(file, filelist) {
      this.imageFile = file
      this.imageUrl = file.url
    },
    loginWechatKf() {
      window.open('https://mpkf.weixin.qq.com/')
    },
    editWechatKf(index, row) {
      this.addWechatKfVisible = true
      this.isEdit = true
      this.wechatKfFromData.account = row.kf_account
      this.wechatKfFromData.nick = row.kf_nick
      if (row.kf_headimgurl) {
        this.imageUrl = this.wximageurl + row.kf_headimgurl
      } else {
        this.imageUrl = ''
      }
    },
    addWechatKfAction() {
      let file = ''
      if (this.imageFile.raw) {
        file = this.imageFile.raw
        let check = validatUploadImage(this.imageFile)
        if (check !== true) {
          this.$message({
            message: check,
            type: 'error',
            duration: 5 * 1000
          })
          return
        }
      }
      let params = {
        isUploadFile: true,
        wx_name: this.wechatKfFromData.wx_name,
        nick: this.wechatKfFromData.nick,
        avatar: file
      }
      createWechatKfs(params).then(response => {
        this.addWechatKfVisible = false
        this.getWechatKf()
        this.$message({
          message: '添加客服邀请成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    editWechatKfAction() {
      let file = ''
      if (this.imageFile.raw) {
        file = this.imageFile.raw
        let check = validatUploadImage(this.imageFile)
        if (check !== true) {
          this.$message({
            message: check,
            type: 'error',
            duration: 5 * 1000
          })
          return
        }
      }
      let params = {
        isUploadFile: true,
        account: this.wechatKfFromData.account,
        nick: this.wechatKfFromData.nick,
        avatar: file
      }
      updateWechatKfs(params).then(response => {
        this.addWechatKfVisible = false
        this.wechatKfFromData.account = ''
        this.getWechatKf()
        this.$message({
          message: '更新客服信息成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    deleteWechatKfAction(index, row) {
      this.$confirm('此操作将删除该客服, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = { account: row.kf_account }
          deleteWechatKfs(params).then(response => {
            this.kflist.splice(index, 1)
            this.$essage({
              message: '删除客服成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getWechatKf() {
      this.loading = true
      getWechatKfs().then(response => {
        this.kflist = response.data.data.list
        this.loading = false
      })
      setTimeout(() => {
        this.loading = false
      }, 3000)
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #8d8d8d;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 148px;
    height: 148px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
}
</style>
