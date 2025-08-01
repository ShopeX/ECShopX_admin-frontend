<template>
  <el-form ref="form" label-width="100px">
    <el-form-item label="开启小票机">
      <el-switch
        v-model="form.is_open"
        :width="60"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        active-text="开启"
        inactive-text="关闭"
        active-color="#13ce66"
      />
    </el-form-item>
    <el-form-item label="隐藏收货人">
      <el-switch
        v-model="form.is_hide"
        :width="60"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        active-text="开启"
        inactive-text="关闭"
        active-color="#13ce66"
      />
    </el-form-item>
    <el-form-item label="用户ID">
      <el-input v-model="form.person_id" style="width: 300px" placeholder="用户ID" />
      <div class="frm-tips">
        <a href="http://dev.10ss.net/admin/listapp" target="_blank"
          >应用列表地址，点击进入应用，进行查询</a
        >
      </div>
    </el-form-item>
    <el-form-item label="应用ID">
      <el-input v-model="form.app_id" style="width: 300px" placeholder="用户ID" />
      <div class="frm-tips">
        <a href="http://dev.10ss.net/admin/listapp" target="_blank"
          >应用列表地址，点击进入应用，进行查询</a
        >
      </div>
    </el-form-item>
    <el-form-item label="应用密钥">
      <el-input v-model="form.app_key" style="width: 300px" placeholder="用户ID" />
      <div class="frm-tips">
        <a href="http://dev.10ss.net/admin/listapp" target="_blank"
          >应用列表地址，点击进入应用，进行查询</a
        >
      </div>
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit"> 保存 </el-button>
    </div>
  </el-form>
</template>
<script>
import { getPrinterInfo, savePrinter } from '../../../../api/printer'

export default {
  data() {
    return {
      loading: false,
      form: {
        is_open: '',
        person_id: '',
        app_id: '',
        app_key: '',
        is_hide: '',
        type: 'yilianyun'
      },
      query: {
        type: 'yilianyun'
      }
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getPrinterInfo(this.query).then(response => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      savePrinter(this.form).then(response => {
        this.$message({ message: '保存成功', type: 'success' })
        this.getInfo()
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
