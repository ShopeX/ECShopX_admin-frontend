<template lang="html">
  <section class="section section-white">
    <div v-for="item in list">
      <div class="section-header with-border">
        {{ item.name }} &nbsp; <small>{{ item.desc }}</small>
      </div>
      <div class="content-padded">
        <el-row
          v-for="(row, index) in item.itemList"
          :key="index"
          :gutter="20"
        >
          <el-col>
            <div class="tip">
              <div class="view-flex">
                <div class="view-flex-item">
                  <p>{{ row.name }}</p>
                  <p>{{ row.desc }}</p>
                </div>
                <el-button @click="toForm(row.form)">
                  选择
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </section>
</template>

<script>
import { isValidActivity } from '../../../../api/promotions'
export default {
  data () {
    return {
      list: [
        {
          name: '会员特权',
          desc: '会员福利，增加用户活跃度及粘性',
          itemList: [
            {
              name: '指定日期额外积分',
              desc: '如会员日关怀，指定日期会员可获取额外积分',
              form: 'member_day'
            }
          ]
        }
      ]
    }
  },
  methods: {
    toForm (type) {
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
