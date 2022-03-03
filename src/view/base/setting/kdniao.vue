<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane
      v-for="(item, index) in tabList"
      :key="index"
      :label="item.name"
      :name="item.activeName"
    >
      <el-form ref="form" label-width="100px" v-if="activeName == 'kdniao'">
        <el-form-item label="EBusinessID">
          <el-input v-model="kdniao_form.config.EBusinessID" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="AppKey">
          <el-input v-model="kdniao_form.config.appkey" style="width: 300px"></el-input>
        </el-form-item>
        <!--  <el-form-item label="扣量方式选择">
          <el-input v-model="kdniao_form.config.request_type" style="width:300px"></el-input>
        </el-form-item> -->
        <el-form-item label="扣量方式选择">
          <el-radio-group v-model="kdniao_form.config.request_type">
            <el-radio label="1002">免费版</el-radio>
            <el-radio label="8001">增值版（按单）</el-radio>
            <el-radio label="8002">增值版（按次）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="kdniao_form.config.is_open"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="功能说明">
          <el-link
            type="primary"
            href="http://www.kdniao.com/product-track1"
            :underline="false"
            target="_blank"
            >快递鸟快递物流跟踪</el-link
          >
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button type="primary" v-loading="loading" @click="onSubmit">保存</el-button>
        </div>
      </el-form>
      <el-form ref="form" label-width="100px" v-if="activeName == 'kuaidi100'">
        <el-form-item label="Key">
          <el-input v-model="form.config.app_key" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="Customer">
          <el-input v-model="form.config.app_secret" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="form.config.is_open"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="功能说明">
          <el-link
            type="primary"
            href="https://api.kuaidi100.com/product/query/"
            :underline="false"
            target="_blank"
            >快递100实时快递查询</el-link
          >
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button type="primary" v-loading="loading" @click="onSubmit">保存</el-button>
        </div>
      </el-form>
      <el-form ref="form" label-width="100px" v-if="activeName == 'sfbsp'">
        <el-form-item label="接入地址">
          <el-input v-model="sfbsp_form.config.url" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="接入编码">
          <el-input v-model="sfbsp_form.config.accesscode" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="Checkword">
          <el-input v-model="sfbsp_form.config.checkword" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="sfbsp_form.config.is_open"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button type="primary" v-loading="loading" @click="onSubmit">保存</el-button>
        </div>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import {
  getKdniaoSetting,
  setKdniaoSetting,
  getSfbspSetting,
  seSfbspSetting
} from '../../../api/trade'
export default {
  data() {
    return {
      activeName: 'kdniao',
      loading: false,
      kdniao_form: {
        kuaidi_type: 'kdniao',
        config: {
          EBusinessID: '',
          appkey: '',
          is_open: false,
          request_type: '8001'
        }
      },
      form: {
        kuaidi_type: 'kuaidi100',
        config: {
          app_key: '',
          app_secret: '',
          is_open: false
        }
      },
      sfbsp_form: {
        config: {
          url: '',
          accesscode: '',
          checkword: '',
          is_open: false
        }
      },
      tabList: [
        { name: '快递鸟', activeName: 'kdniao' },
        { name: '快递100', activeName: 'kuaidi100' },
        { name: '顺丰BSP', activeName: 'sfbsp' }
      ]
    }
  },
  methods: {
    handleClick() {
      this.getConfig()
    },
    getConfig() {
      let query = {}
      if (this.activeName === 'kdniao') {
        query = { kuaidi_type: 'kdniao' }
        getKdniaoSetting(query).then((response) => {
          this.kdniao_form.config = response.data.data
          const request_type = this.kdniao_form.config.request_type
            ? this.kdniao_form.config.request_type
            : '8001'
          this.$set(this.kdniao_form.config, 'request_type', request_type)
        })
      } else if (this.activeName === 'kuaidi100') {
        query = { kuaidi_type: 'kuaidi100' }
        getKdniaoSetting(query).then((response) => {
          this.form.config = response.data.data
        })
      } else if (this.activeName === 'sfbsp') {
        getSfbspSetting(query).then((response) => {
          const data = response.data.data
          if (!Array.isArray(data)) {
            if (data.is_open == 'true') {
              data.is_open = true
            } else {
              data.is_open = false
            }
            this.sfbsp_form.config = data
          }
        })
      }
    },
    onSubmit() {
      this.loading = true
      let query = {}
      if (this.activeName === 'sfbsp') {
        query = this.sfbsp_form
        seSfbspSetting(query)
          .then((response) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
          })
      } else {
        if (this.activeName === 'kdniao') {
          query = this.kdniao_form
        } else {
          query = this.form
        }
        setKdniaoSetting(query)
          .then((response) => {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
          })
      }
    }
  },
  mounted() {
    this.getConfig()
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
