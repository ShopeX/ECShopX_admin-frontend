<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="170px"
    >
      <div class="section-body">
        <el-form-item label="是否展示自提订单：">
          <el-switch v-model="form.data.ziti_order" />
        </el-form-item>
        <!--                 <el-form-item label="是否展示推广信息：">
                    <el-switch v-model="form.data.ext_info"></el-switch>
                </el-form-item> -->
        <el-form-item label="是否展示我的拼团：">
          <el-switch v-model="form.data.group" />
        </el-form-item>
        <!-- <el-form-item label="是否展示助力活动：">
          <el-switch v-model="form.data.boost_activity"></el-switch>
        </el-form-item>
        <el-form-item label="是否展示助力订单：">
          <el-switch v-model="form.data.boost_order"></el-switch>
        </el-form-item> -->
        <!-- <el-form-item label="是否展示投诉记录：">
          <el-switch v-model="form.data.complaint"></el-switch>
        </el-form-item> -->
        <el-form-item label="是否展示活动预约：">
          <el-switch v-model="form.data.activity" />
        </el-form-item>
        <!-- <el-form-item label="是否展示储值：">
                    <el-switch v-model="form.data.recharge"></el-switch>
                </el-form-item> -->
        <el-form-item label="是否展示会员二维码：">
          <el-switch v-model="form.data.member_code" />
        </el-form-item>
        <!--  <el-form-item label="是否展示社区团购：">
                    <el-switch v-model="form.data.community_activity"></el-switch>
                </el-form-item> -->
        <!-- <el-form-item label="是否展示团购订单：">
          <el-switch v-model="form.data.community_order"></el-switch>
        </el-form-item>
        <el-form-item label="是否展示线下订单关联：">
          <el-switch v-model="form.data.offline_order"></el-switch>
        </el-form-item> -->
        <el-form-item label="是否展示我要分享：">
          <el-switch v-model="form.data.share_enable" />
        </el-form-item>
        <el-form-item label="是否展示个人信息：">
          <el-switch v-model="form.data.memberinfo_enable" />
        </el-form-item>
      </div>
      <div class="section-footer content-center">
        <el-button
          v-loading="loading"
          type="primary"
          @click="saveConfig"
        >
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { savePageParams, getParamByTempName } from '@/api/wxa'
export default {
  data () {
    return {
      activeName: 'menuoption',
      loading: false,
      form: {
        name: 'base',
        data: {
          ziti_order: true,
          ext_info: true,
          group: true,
          boost_activity: true,
          boost_order: true,
          complaint: true,
          activity: true,
          recharge: true,
          member_code: true,
          community_activity: true,
          community_order: true,
          offline_order: true,
          share_enable: true,
          memberinfo_enable: true
        }
      },
      pic: '',
      remnant: 0,
      fileList: [],
      imgDialog: false,
      isGetImage: false,
      pickerImgType: 'no_login'
    }
  },
  computed: {
    ...mapGetters(['wheight', 'wwidth', 'template_name'])
  },
  mounted () {
    let filter = {
      template_name: this.template_name,
      version: 'v1.0.1',
      page_name: 'member_center_menu_setting'
    }
    getParamByTempName(filter).then((res) => {
      if (res.data.data.list.length !== 0) {
        this.form = res.data.data.list[0].params
      }
    })
  },
  methods: {
    handleClick (tab, event) {},
    // 保存设置
    saveConfig () {
      let param = {
        template_name: this.template_name,
        config: JSON.stringify([this.form]),
        page_name: 'member_center_menu_setting'
      }
      savePageParams(param).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
