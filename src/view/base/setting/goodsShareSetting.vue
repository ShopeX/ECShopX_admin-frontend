<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="goodsShareSetting">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" />
    <el-form ref="form" label-width="180px" :rules="rules" :model="form">
      <el-form-item :label="$t('557fe6e8.549fe0')">
        <el-switch v-model="form.is_open" />
      </el-form-item>
      <template v-if="form.is_open">
        <el-form-item :label="$t('557fe6e8.b5be5a')" prop="valid_grade">
          <el-checkbox-group v-model="form.valid_grade">
            <el-checkbox v-for="grade in memberGrade" :key="grade.grade_id" :label="grade.grade_id">
              {{ grade.grade_name }}
            </el-checkbox>
            <el-checkbox
              v-for="vipdata in vipGrade"
              :key="vipdata.lv_type"
              :label="vipdata.lv_type"
            >
              {{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('557fe6e8.38f33c')" prop="msg">
          <el-input
            v-model="form.msg"
            style="width: 260px"
            type="text"
            :placeholder="$t('557fe6e8.0875c1')"
          />
        </el-form-item>
        <el-form-item :label="$t('557fe6e8.4e9fc2')" prop="page">
          <div class="path" @click="showSetLink">
            <span v-show="form.page.linkPage" class="pathTitle">{{ linkPage }}:</span>
            {{ form.page.title ? form.page.title : $t('557fe6e8.4f2c29') }}
          </div>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="save">{{ $t('557fe6e8.be5fbb') }}</el-button>
      </el-form-item>
    </el-form>

    <linkSetter :visible="linksVisible" @setLink="setLink" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import linkSetter from '@/components/template_links'
import { listVipGrade } from '../../../api/cardticket'
import { getGradeList } from '../../../api/membercard'
import { getShareSetting, saveShareSetting } from '../../../api/goods'

export default {
  name: 'GoodsShareSetting',
  components: {
    linkSetter
  },
  data() {
    return {
      // 设置路径
      linksVisible: false,
      form: {
        is_open: false,
        valid_grade: [],
        msg: '当前等级无法分享',
        page: {}
      },
      vipGrade: [],
      memberGrade: []
    }
  },
  computed: {
    rules() {
      return {
        valid_grade: [{ required: true, message: this.$t('557fe6e8.6ae643'), trigger: 'blur' }],
        msg: [{ required: true, message: this.$t('557fe6e8.0875c1'), trigger: 'blur' }],
        page: [{ required: true, message: this.$t('557fe6e8.54d9e4'), trigger: 'change' }]
      }
    },
    linkPage() {
      const { page } = this.form
      const types = {
        goods: '557fe6e8.9897d8',
        category: '557fe6e8.d0771a',
        article: '557fe6e8.c75625',
        planting: '557fe6e8.e8f87a',
        link: '557fe6e8.59ceff',
        marketing: '557fe6e8.916801',
        custom_page: '557fe6e8.cee6eb',
        other_wxapp: '557fe6e8.0ed510'
      }
      const key = types[page.linkPage]
      return key ? this.$t(key) : ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      // 获取会员列表
      const grade = await getGradeList()
      const vip_grade = await listVipGrade()
      this.vipGrade = vip_grade.data.data
      this.memberGrade = grade.data.data
      this.getShareSettingInfo()
    },
    // 获取分享配置
    async getShareSettingInfo() {
      // 获取分享配置
      const data = await getShareSetting()
      this.form = { ...data.data.data }
      if (!this.form.page || Array.isArray(this.form.page)) {
        this.$set(this.form, 'page', {})
      }
      if (!this.form.valid_grade) {
        this.$set(this.form, 'valid_grade', [])
      }
      if (!this.form.msg) {
        this.$set(this.form, 'msg', '')
      }
    },
    showSetLink() {
      this.linksVisible = true
    },
    setLink(links, type) {
      this.$set(this.form, 'page', { ...links, linkPage: type })
    },
    closeDialog() {
      this.linksVisible = false
    },
    // 保存表单
    save() {
      this.$refs['form'].validate(async (vaild) => {
        if (vaild) {
          const { form } = this
          const data = await saveShareSetting(form)
          if (data.data.data.status) {
            this.$message.success(this.$t('557fe6e8.3b1083'))
            this.getShareSettingInfo()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.goodsShareSetting {
  width: 100%;
  height: 100%;
  .pathTitle {
    margin-right: 10px;
  }
  .path {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    color: #666;
    border: 1px dashed #dfdfdf;
    display: inline-block;
    min-width: 180px;
    text-align: center;
  }
}
</style>
