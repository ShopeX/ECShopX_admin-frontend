<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss"></style>
<template>
  <SpPage>
    <el-result icon="success" :title="$t('fb0e4a6f.04a691')" :sub-title="$t('fb0e4a6f.4f50ac')">
      <template slot="extra">
        <el-button type="primary" size="medium" @click="addGoods">
          {{ $t('fb0e4a6f.fa3aee') }}
        </el-button>
        <el-button plain size="medium" @click="goActivityList">
          {{ $t('fb0e4a6f.0fdf19') }}
        </el-button>
      </template>
    </el-result>
  </SpPage>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  created() {},
  methods: {
    addGoods() {
      const { id } = this.$route.params
      const resUrl = this.$route.path.split('result')[0] + 'goods/' + id
      this.$router.push({ path: resUrl })
    },
    goActivityList() {
      this.$router.go(-1)
    }
  }
}
</script>
