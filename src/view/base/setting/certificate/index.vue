<template>
  <div>
    <div class="cer-box">
      <el-form :model="creInfo" label-width="150px">
        <el-row>
          <el-col :span="4" class="col-right"> Shopex通行证书 </el-col>
        </el-row>
        <el-form-item label="通行证账号：">
          <el-input v-model="creInfo.cert_id" type="text" readonly />
        </el-form-item>
        <el-row>
          <el-col :span="4" class="col-right"> Shopex证书 </el-col>
        </el-row>
        <el-form-item label="当前证书节点号：">
          <el-input v-model="creInfo.node_id" type="text" readonly />
        </el-form-item>
        <el-form-item label="当前证书节点号：">
          <el-input v-model.number="creInfo.shopex_uid" readonly />
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="4" :offset="3">
          <el-button type="primary" @click="deleteCer"> 删除证书 </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="cer-box">
      <el-row>
        <el-col :span="4" class="col-right"> 电商ERP关系绑定 </el-col>
        <el-col :span="4" :offset="1">
          <el-button type="primary" @click="bindRelation"> 申请绑定 </el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="lookRelation"> 查看绑定关系 </el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="申请绑定" :visible.sync="dialogBindVisible" fullscreen>
      <div>
        <iframe :src="bindUrl" width="1200" height="980" frameborder="0" scrolling="auto" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogBindVisible = false"> 关 闭 </el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看绑定关系" :visible.sync="dialogLookVisible" fullscreen>
      <div>
        <iframe :src="lookUrl" width="1200" height="980" frameborder="0" scrolling="auto" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogLookVisible = false"> 关 闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getCertificate, deleteCertificateInfo, bindRelation, acceptRelation } from '@/api/company'
export default {
  data() {
    return {
      creInfo: {
        cert_id: '',
        node_id: '',
        shopex_uid: ''
      },
      loading: false,
      dialogBindVisible: false,
      bindUrl: '',
      dialogLookVisible: false,
      lookUrl: ''
    }
  },
  mounted() {
    this.getCerInfo()
  },
  methods: {
    getCerInfo() {
      this.loading = true
      getCertificate().then(response => {
        this.creInfo = {
          cert_id: response.data.data.cert_id,
          node_id: response.data.data.node_id,
          shopex_uid: response.data.data.shopex_uid
        }
        this.loading = false
      })
    },
    deleteCer() {
      this.$confirm(
        '删除订单后，将无法使用“云起物流”，“天工收银”,需要重新激活系统才能使用',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteCertificateInfo().then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catche(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    bindRelation() {
      bindRelation().then(response => {
        this.bindUrl = response.data.data.url
        this.dialogBindVisible = true
      })
    },
    lookRelation() {
      acceptRelation().then(response => {
        this.lookUrl = response.data.data.url
        this.dialogLookVisible = true
      })
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.cer-box .el-input__inner {
  border: 0;
  box-shadow: none;
}
</style>
<style>
.cer-box {
  border: 1px solid #f1f1f1;
  padding: 30px;
  margin-bottom: 20px;
}
</style>
