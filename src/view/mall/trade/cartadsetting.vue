<template>
  <div class="section section-white">
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <div class="section-body">
        <template>
          <el-form-item label="购物车顶部营销语:">
            <el-input
              v-model="form.ad_title"
              required
              placeholder=""
              style="width: 100px"
            />
          </el-form-item>
        </template>
      </div>
      <div class="section-footer with-border content-center">
        <el-button
          type="primary"
          @click="save"
        >
          保 存
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getCartMarketingAd, setCartMarketingAd } from '@/api/trade'
export default {
  data () {
    return {
      form: {
        ad_title: ''
      }
    }
  },
  mounted () {
    getCartMarketingAd().then((res) => {
      let setting = res.data.data
      if (setting.ad_title) {
        this.form.ad_title = setting.ad_title
      }
    })
  },
  methods: {
    save () {
      if (!this.form.ad_title) {
        this.$message({ message: '信息必填', type: 'error' })
        return
      }
      setCartMarketingAd(this.form).then((res) => {
        this.$message({ message: '保存成功', type: 'success' })
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
