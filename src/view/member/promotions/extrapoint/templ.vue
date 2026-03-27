<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-for="item in list" :key="item.name">
      <div class="section-header with-border">
        {{ item.name }} &nbsp; <small>{{ item.desc }}</small>
      </div>
      <div class="content-padded">
        <el-row v-for="(row, index) in item.itemList" :key="index" :gutter="20">
          <el-col>
            <div class="tip">
              <div class="view-flex">
                <div class="view-flex-item">
                  <p>{{ row.name }}</p>
                  <p>{{ row.desc }}</p>
                </div>
                <el-button @click="toForm(row.form)"> {{ $t('d05d98c3.153fa6') }} </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </SpPage>
</template>

<script>
export default {
  computed: {
    list() {
      return [
        {
          name: this.$t('d05d98c3.726f05'),
          desc: this.$t('d05d98c3.136f7d'),
          itemList: [
            {
              name: this.$t('d05d98c3.64540c'),
              desc: this.$t('d05d98c3.40383f'),
              form: 'member_day'
            }
          ]
        }
      ]
    }
  },
  methods: {
    toForm(type) {
      this.$router.push({
        path: this.$route.path.replace('templ', 'editor')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tip {
  padding: 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
}
</style>
