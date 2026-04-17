<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="content-bottom-padded">
      <el-tooltip effect="dark" :content="$t('6c4d190a.3121ea')" placement="bottom-start">
        <el-button type="primary" icon="plus" @click="addWechatKf">
          {{ $t('6c4d190a.ece41a') }}
        </el-button>
      </el-tooltip>
      <el-button type="primary" icon="share" @click="loginWechatKf">
        {{ $t('6c4d190a.c3a6c9') }}
      </el-button>
    </div>
    <el-table v-loading="loading" :data="kflist" :height="wheight - 160">
      <el-table-column :label="$t('6c4d190a.6f0f2c')" width="180">
        <template slot-scope="img">
          <img v-if="img.row.kf_headimgurl" :src="wximageurl + img.row.kf_headimgurl" height="40" />
        </template>
      </el-table-column>
      <el-table-column prop="kf_nick" :label="$t('6c4d190a.23eb0e')" />
      <el-table-column :label="$t('6c4d190a.49047f')">
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
      <el-table-column :label="$t('6c4d190a.6b97e3')">
        <template slot-scope="online">
          <div v-if="online.row.is_online">
            <el-tag type="success" size="mini"> {{ $t('6c4d190a.68905c') }} </el-tag>
          </div>
          <div v-else>
            <el-tag size="mini"> {{ $t('6c4d190a.50d4a8') }} </el-tag>
          </div>
          <div v-else>
            <el-tag size="mini"> {{ $t('6c4d190a.906ad1') }} </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('6c4d190a.a2d8ea')">
        <template slot-scope="status">
          <div v-if="status.row.invite_status === 'waiting'">
            <el-tag size="mini"> {{ $t('6c4d190a.d4bd74') }} </el-tag>
          </div>
          <div v-else-if="status.row.kf_wx">
            <el-tag type="success" size="mini"> {{ $t('6c4d190a.aa71a6') }} </el-tag>
          </div>
          <div v-else>
            <el-tag size="mini"> {{ $t('6c4d190a.906ad1') }} </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('6c4d190a.2b6bc0')">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i class="el-icon-edit-outline" @click="editWechatKf(scope.$index, scope.row)" />
            <i
              class="mark el-icon-delete-solid"
              @click="deleteWechatKfAction(scope.$index, scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="$t('6c4d190a.fd3ed0')" :visible.sync="addWechatKfVisible">
      <template>
        <el-form :model="wechatKfFromData" class="demo-ruleForm">
          <el-form-item :label="$t('6c4d190a.ff1aa2')">
            <el-input v-model="wechatKfFromData.nick" />
            <p class="frm-tips">{{ $t('6c4d190a.65db0e') }}</p>
          </el-form-item>
          <el-form-item v-if="isEdit === false" :label="$t('6c4d190a.49047f')">
            <p class="frm-tips">{{ $t('6c4d190a.ce13c0') }}</p>
            <el-input v-model="wechatKfFromData.wx_name" />
          </el-form-item>
          <el-form-item :label="$t('6c4d190a.6f0f2c')">
            <div class="frm-tips">{{ $t('6c4d190a.3f13f6') }}</div>
            <el-upload
              list-type="picture"
              action=""
              class="avatar-uploader"
              :data="wechatKfFromData"
              :on-change="handleChange"
              :show-file-list="false"
              :auto-upload="false"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" width="300" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addWechatKfVisible = false">
          {{ $t('6c4d190a.625fb2') }}
        </el-button>
        <el-button v-if="isEdit === false" type="primary" @click.native="addWechatKfAction">
          {{ $t('6c4d190a.d05100') }}
        </el-button>
        <el-button v-else type="primary" @click.native="editWechatKfAction">
          {{ $t('6c4d190a.be5fbb') }}
        </el-button>
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
      createWechatKfs(params).then((response) => {
        this.addWechatKfVisible = false
        this.getWechatKf()
        this.$message({
          message: this.$t('6c4d190a.b21bda'),
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
      updateWechatKfs(params).then((response) => {
        this.addWechatKfVisible = false
        this.wechatKfFromData.account = ''
        this.getWechatKf()
        this.$message({
          message: this.$t('6c4d190a.46adfc'),
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    deleteWechatKfAction(index, row) {
      this.$confirm(this.$t('6c4d190a.7a9644'), this.$t('6c4d190a.02d981'), {
        confirmButtonText: this.$t('6c4d190a.38cf16'),
        cancelButtonText: this.$t('6c4d190a.625fb2'),
        type: 'warning'
      })
        .then(() => {
          let params = { account: row.kf_account }
          deleteWechatKfs(params).then((response) => {
            this.kflist.splice(index, 1)
            this.$message({
              message: this.$t('6c4d190a.4a9d46'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('6c4d190a.2111cc')
          })
        })
    },
    getWechatKf() {
      this.loading = true
      getWechatKfs().then((response) => {
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
