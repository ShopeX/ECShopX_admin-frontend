<template>
  <div>
    <SpForm
      ref="formBase"
      v-model="formBase"
      show-message
      :form-list="formBaseList"
      :submit="false"
      @onSubmit="onGroupFormSubmit"
    />
    <div class="footer-container">
      <el-button
        @click="
          () => {
            this.$router.go(-1)
          }
        "
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="
          () => {
            this.$refs['formBase'].handleSubmit()
          }
        "
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import schema from './schema.js'

import { generatorParams } from '@/utils/schemaHelper.js'
import district from '@/common/district.json'
import api from '@/api'

import { getCascaderObj } from '@/utils'

export default {
  data() {
    return {
      formBase: {
        ...generatorParams(schema.formBaseList(this))
      },
      formBaseList: schema.formBaseList(this),
      district,
      isEdit: false
    }
  },
  mounted() {
    if (this.$route.params.itemId) {
      this.isEdit = true
      this.init(this.$route.params.itemId)
    } else {
      this.isEdit = false
    }
  },
  methods: {
    async init(id) {
      const rawData = await api.regionauth.getRegionauthInfo(id)
      this.formBase = {
        ...generatorParams(schema.formBaseList(this), rawData),
        regions: [
          rawData.regionauth_province,
          rawData.regionauth_city,
          rawData.regionauth_area
        ].filter((v) => v),
        regions_id: rawData.regions_id
      }
    },
    async onGroupFormSubmit() {
      let res = null
      if (!this.$route.params.itemId) {
        res = await api.regionauth.addRegionauth(this.formBase)
      } else {
        res = await api.regionauth.updateRegionauth(this.$route.params.itemId, this.formBase)
      }
      if (res.status === true) {
        this.$message({
          type: 'success',
          message: `${this.$route.params.itemId ? '修改' : '添加'}成功`
        })
        this.$router.go(-1)
      } else {
        this.$message({
          message: res.status.error,
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    handleRegionSearch(val) {
      var vals = getCascaderObj(val, this.district)
      this.formBase.regions_id = vals?.map((el) => el.value)
    }
  }
}
</script>

<style scoped lang="scss">
.refund-address {
  width: 300px;
}
</style>
