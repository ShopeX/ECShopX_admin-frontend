<template>
  <el-form
    ref="form"
    label-width="100px"
  >
    <el-form-item label="开启售后客服">
      <el-switch
        v-model="form.is_open"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        active-text="开启"
        inactive-text="关闭"
        active-color="#13ce66"
      />
    </el-form-item>
    <el-form-item label="企业 ID">
      <el-input
        v-model="form.enterprise_id"
        style="width: 300px"
        placeholder="请输入内容"
      />
      <div class="frm-tips">
        <a
          href="https://app.meiqia.com/setting/id-query"
          target="_blank"
        >企业ID地址</a>
      </div>
    </el-form-item>
    <el-form-item label="客服组 ID">
      <el-input
        v-model="form.group_id"
        style="width: 300px"
        placeholder="请输入内容"
      />
      <div class="frm-tips">
        <a
          href="https://app.meiqia.com/setting/id-query"
          target="_blank"
        >客服组ID地址</a>
      </div>
    </el-form-item>
    <el-form-item label="客服 ID">
      <el-input
        v-model="form.persion_ids"
        style="width: 300px"
        placeholder="请输入内容"
      />
      <div class="frm-tips">
        <a
          href="https://app.meiqia.com/setting/id-query"
          target="_blank"
        >客服ID地址</a>
      </div>
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button
        type="primary"
        @click="onSubmit"
      >
        售后客服保存
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { getMeiqiaInfo, saveMeiqia } from '../../../../api/im'

export default {
  data () {
    return {
      loading: false,
      form: {
        is_open: '',
        enterprise_id: '',
        group_id: '',
        persion_ids: '',
        type: 'backend'
      },
      query: {
        type: 'backend'
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      getMeiqiaInfo(this.query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit () {
      saveMeiqia(this.form).then((response) => {})
    }
  }
}
</script>
<style lang="scss" scoped></style>
