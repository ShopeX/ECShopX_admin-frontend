<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-form ref="form" :model="form" label-position="left" label-width="170px">
      <div class="section-body">
        <el-form-item :label="$t('ae282f25.0b2c6b')">
          <el-switch v-model="form.data.ziti_order" />
        </el-form-item>
        <!--                 <el-form-item label="推广信息：">
                    <el-switch v-model="form.data.ext_info"></el-switch>
                </el-form-item> -->
        <el-form-item v-if="!VERSION_IN_PURCHASE()" :label="$t('ae282f25.7b80b8')">
          <el-switch v-model="form.data.group" />
        </el-form-item>
        <el-form-item v-if="VERSION_STANDARD()" :label="$t('ae282f25.46843c')">
          <el-switch v-model="form.data.boost_activity" />
        </el-form-item>
        <el-form-item v-if="VERSION_STANDARD()" :label="$t('ae282f25.6dfa64')">
          <el-switch v-model="form.data.boost_order" />
        </el-form-item>
        <!-- <el-form-item label="投诉记录：">
          <el-switch v-model="form.data.complaint"></el-switch>
        </el-form-item> -->
        <el-form-item v-if="!VERSION_IN_PURCHASE()" :label="$t('ae282f25.d72e6e')">
          <el-switch v-model="form.data.activity" />
        </el-form-item>
        <!-- <el-form-item label="储值：">
                    <el-switch v-model="form.data.recharge"></el-switch>
                </el-form-item> -->
        <el-form-item v-if="!VERSION_IN_PURCHASE()" :label="$t('ae282f25.d3836b')">
          <el-switch v-model="form.data.member_code" />
        </el-form-item>
        <!--  <el-form-item label="社区团购：">
                    <el-switch v-model="form.data.community_activity"></el-switch>
                </el-form-item> -->
        <!-- <el-form-item label="团购订单：">
          <el-switch v-model="form.data.community_order"></el-switch>
        </el-form-item>
        <el-form-item label="线下订单关联：">
          <el-switch v-model="form.data.offline_order"></el-switch>
        </el-form-item> -->
        <!-- <el-form-item
          v-if="!VERSION_IN_PURCHASE()"
          label="我要分享："
        >
          <el-switch v-model="form.data.share_enable" />
        </el-form-item> -->
        <el-form-item :label="$t('ae282f25.b6b73b')">
          <el-switch v-model="form.data.memberinfo_enable" />
        </el-form-item>
        <el-form-item :label="$t('ae282f25.699828')">
          <el-switch v-model="form.data.community_group_enable" />
        </el-form-item>
      </div>
      <div class="section-footer content-center">
        <el-button v-loading="loading" type="primary" @click="saveConfig">
{{
          $t('ae282f25.be5fbb')
        }}
</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { savePageParams, getParamByTempName } from '@/api/wxa'
export default {
  data() {
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
          memberinfo_enable: true,
          community_group_enable: true
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
  mounted() {
    let filter = {
      template_name: this.template_name,
      version: 'v1.0.1',
      page_name: 'member_center_menu_setting'
    }
    getParamByTempName(filter).then((res) => {
      console.log('getParamByTempName:', res)
      if (res.data.data.list.length !== 0) {
        try {
          const {
            ziti_order,
            ext_info,
            group,
            boost_activity,
            boost_order,
            complaint,
            activity,
            recharge,
            member_code,
            community_activity,
            community_order,
            offline_order,
            share_enable,
            memberinfo_enable,
            community_group_enable
          } = res.data.data.list[0].params.data
          this.form.data = {
            ziti_order,
            ext_info,
            group,
            boost_activity,
            boost_order,
            complaint,
            activity,
            recharge,
            member_code,
            community_activity,
            community_order,
            offline_order,
            share_enable,
            memberinfo_enable,
            community_group_enable
          }
        } catch (e) {}
      }
    })
  },
  methods: {
    handleClick(tab, event) {},
    // 保存设置
    saveConfig() {
      let param = {
        template_name: this.template_name,
        config: JSON.stringify([this.form]),
        page_name: 'member_center_menu_setting'
      }
      savePageParams(param).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: this.$t('ae282f25.3b1083'),
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
