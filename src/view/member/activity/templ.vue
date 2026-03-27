<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="section section-white page-activity-templ">
    <div v-for="item in list" :key="item.name">
      <div class="templ-title">
        {{ $t(item.name) }} &nbsp; <small>{{ $t(item.desc) }}</small>
      </div>
      <div class="content-padded">
        <el-row v-for="(row, index) in item.itemList" :key="index" :gutter="20">
          <el-col>
            <div class="tip">
              <div class="view-flex">
                <div class="view-flex-item">
                  <p>{{ $t(row.name) }}</p>
                  <p>{{ $t(row.desc) }}</p>
                </div>
                <el-button @click="toForm(row.form)"> {{ $t('9c5a295f.153fa6') }} </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </SpPage>
</template>

<script>
import { isValidActivity } from '../../../api/promotions'
export default {
  data() {
    return {
      list: [
        {
          name: '9c5a295f.de4753',
          desc: '9c5a295f.2886f5',
          itemList: [{ name: '9c5a295f.6e189b', desc: '9c5a295f.e0caf3', form: 'member_birthday' }]
        },
        {
          name: '9c5a295f.176808',
          desc: '9c5a295f.a5855c',
          itemList: [
            { name: '9c5a295f.e1d9d7', desc: '9c5a295f.86bfa4', form: 'member_upgrade' },
            {
              name: '9c5a295f.efa363',
              desc: '9c5a295f.492bd4',
              form: 'member_vip_upgrade'
            },
            { name: '9c5a295f.482c1e', desc: '9c5a295f.9cc98d', form: 'member_anniversary' },
            { name: '9c5a295f.70bdfe', desc: '9c5a295f.43a374', form: 'member_day' }
          ]
        }
      ]
    }
  },
  methods: {
    toForm(type) {
      var param = {
        activity_type: type
      }
      isValidActivity(param).then((res) => {
        this.$router.push({
          path: this.$route.path.replace('templ', 'editor/') + type
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-activity-templ {
  .tip {
    padding: 16px;
    background-color: color-mix(in srgb, #ffffff 90%, var(--primary));
    border-radius: 4px;
    border-left: 5px solid var(--primary);
  }
  .view-flex {
    display: flex;
  }
  .view-flex-item {
    flex: 1;
  }
  .templ-title {
    padding: 10px 15px;
  }
  .content-padded {
    padding: 10px;
  }
}
.page-activity-templ ::v-deep .el-row {
  margin-bottom: 10px;
}
</style>
