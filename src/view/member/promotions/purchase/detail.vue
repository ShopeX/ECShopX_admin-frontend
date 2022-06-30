<template>
  <div class="section section-white">
    <div class="section-header with-border">
      员工内购详情
    </div>
    <div class="section-body">
      <el-form
        ref="detail"
        :model="detail"
        label-width="150px"
        label-position="right"
      >
        <el-form-item label="活动名称：">
          {{ detail.purchase_name }}
        </el-form-item>
        <el-form-item label="活动分享图片：">
          <img
            class="detail-img"
            :src="detail.ad_pic"
          >
        </el-form-item>
        <el-form-item
          label="活动有效时间："
          prop="activity_time"
        >
          {{ detail.begin_date }} ~ {{ detail.end_date }}
        </el-form-item>
        <el-form-item label="适用角色：">
          {{ roleTransform(detail.used_roles) }}
        </el-form-item>
        <el-form-item label="员工额度：">
          {{ detail.employee_limitfee }}
        </el-form-item>
        <el-form-item label="家属是否共有额度：">
          {{ detail.is_share_limitfee ? '是' : '否' }}
        </el-form-item>
        <el-form-item
          v-if="
            detail.used_roles &&
              detail.used_roles.indexOf('dependents') > -1 &&
              !detail.is_share_limitfee
          "
          label="每位家属额度："
        >
          {{ detail.dependents_limitfee }}
        </el-form-item>
        <el-form-item
          v-if="detail.used_roles && detail.used_roles.indexOf('dependents') > -1"
          label="员工邀请家属上限："
        >
          {{ detail.dependents_limit }}
        </el-form-item>
        <el-form-item :label="itemTypeTransform(detail.item_type) + '限购：'">
          <p v-if="detail.item_type == 'all'">
            每人限购{{ detail.item_limit }}件
          </p>
          <el-table
            v-else
            :data="detail.item_limit"
          >
            <el-table-column
              prop="item_id"
              label="ID"
            />
            <el-table-column
              prop="name"
              label="名称"
            />
            <el-table-column
              v-if="detail.item_type === 'item'"
              prop="item_spec_desc"
              label="商品规格描述"
            />
            <el-table-column
              prop="limit_num"
              label="每人限购"
            />
            <el-table-column
              prop="limit_fee"
              label="每人限额"
            />
          </el-table>
        </el-form-item>
        <el-form-item label="单笔订单最低金额：">
          {{ detail.dependents_limit }}
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getPurchaseInfo } from '@/api/purchase'

export default {
  data () {
    return {
      detail: {}
    }
  },
  mounted () {
    if (this.$route.query.id) {
      let filter = { purchase_id: this.$route.query.id }
      getPurchaseInfo(filter).then((res) => {
        this.detail = res.data.data
        const { dependents_limitfee, employee_limitfee, item_limit } = this.detail
        this.detail.dependents_limitfee = (dependents_limitfee / 100).toFixed(2)
        this.detail.employee_limitfee = (employee_limitfee / 100).toFixed(2)
        if (Array.isArray(item_limit) && item_limit.length > 0) {
          this.detail.item_limit = item_limit.map((item) => {
            item.limit_fee = (item.limit_fee / 100).toFixed(2)
            return item
          })
        }
      })
    }
  },
  methods: {
    roleTransform (role) {
      if (role) {
        let transRole = eval(role)
        let textArr = []
        transRole.length > 0 && transRole.indexOf('employee') > -1 && textArr.push('员工')
        transRole.length > 0 && transRole.indexOf('dependents') > -1 && textArr.push('家属')
        return textArr.toString()
      }
    },
    itemTypeTransform (type) {
      switch (type) {
        case 'all':
          return '全部商品'
        case 'item':
          return '指定商品'
        case 'tag':
          return '指定商品标签'
        case 'category':
          return '指定分类'
        case 'brand':
          return '指定品牌'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 1px;
}
.detail-img {
  width: 150px;
}
</style>
