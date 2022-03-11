<template>
  <div class="section section-white">
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="180px"
    >
      <div class="section-body">
        <el-form-item
          label="是否开启："
          prop="ad_title"
        >
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
        <el-form-item
          label="注册赠送积分："
          prop="ad_title"
        >
          <el-input-number
            v-model="form.point"
            controls-position="right"
            placeholder="注册赠送积分"
            style="width: 120px"
            :min="0"
            :max="9999999"
          />
        </el-form-item>
        <el-form-item
          label="注册返上级积分："
          prop="ad_title"
        >
          <el-input-number
            v-model="form.rebate"
            controls-position="right"
            placeholder="注册返上级积分"
            style="width: 120px"
            :min="0"
            :max="9999999"
          />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button
            type="primary"
            @click="save"
          >
            保 存
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { saveRegisterPoint, getRegisterPoint } from '../../../api/promotions'
export default {
  data () {
    return {
      activeName: 'fourth',
      form: {
        is_open: 'false',
        point: 0,
        rebate: 0,
        type: 'point'
      }
    }
  },
  watch: {
    getStatus (newVal, oldVal) {
      if (newVal) {
        this.getRegisterData()
      }
    }
  },
  mounted () {
    this.getRegisterData()
  },
  methods: {
    getRegisterData () {
      var params = { type: 'point' }
      getRegisterPoint(params).then((response) => {
        this.form = response.data.data
      })
    },
    save () {
      saveRegisterPoint(this.form).then((response) => {
        this.getRegisterData()
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss"></style>
