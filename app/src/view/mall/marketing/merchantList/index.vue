<template>
  <div>
    <div class="merchantList" v-if="$route.path.indexOf('editor') === -1">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>商家列表</span>
        </div>
        <SpFinder
          ref="finder"
          :split-count="3"
          :search-row-count="2"
          :fixed-row-action="true"
          :setting="setting"
          noSelection
          :hooks="{
            beforeSearch: beforeSearch,
            afterSearch: afterSearch
          }"
          url="/merchant/list"
        >
          <template v-slot:tableTop>
            <div style="text-align: right; margin-bottom: 20px">
              <el-button size="small" type="primary" plain @click="addMerchant">新增商户</el-button>
            </div>
          </template>
        </SpFinder>
      </el-card>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import setting_ from './setting/setting'
import { setCommodityAudit, setMerchantsState } from '@/api/mall/marketing.js'
export default {
  data() {
    return {
      datapass_block: 0
    } 
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  methods: {
    //  this.$refs.finder.refresh()
    fnAffirm(row) {
      const message = row.audit_goods
        ? '关闭后商户商品上架时无需审核，请确认是否关闭'
        : '开启后商户商品上架时需要审核，请确认是否开启'
      this.$confirm(message, '通知消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const result = await setCommodityAudit({ audit_goods: !row.audit_goods }, row.id)
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.$refs.finder.refresh()
        }
      })
      console.log(row)
    },
    fnMerchantsState(row, status) {
      const id = row[0].id
      const message = status
        ? '开启后且该商户及其关联店铺的账号可登录商家端以及店铺端，该商户及其关联店铺在小程序显示，请确认是否开启。'
        : '禁用后该商户及其关联店铺不在小程序显示，且该商户及其关联店铺的账号无法登录商家端以及店铺端，请确认是否禁用该商户。'
      this.$confirm(message, '通知消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const result = await setMerchantsState({ disabled: !status }, id)
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.$refs.finder.refresh()
        }
      })
    },
    addMerchant() {
      this.$router.push({ path: this.matchHidePage('editor'), query: { type: 'add' } })
    },
    beforeSearch(params) {
      return { ...params }
    },
    afterSearch({ datapass_block }) {
      this.datapass_block = datapass_block
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   const { type } = this.$route.query;
  //   console.log(to,type);
  //   if (type == 'add') {
  //     this.$confirm('确定要离开当前页面，您将丢失已编辑的数据？！', '提示', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     })
  //       .then((res) => {
  //         next()
  //       })
  //       .catch(() => {
  //         next(false)
  //       })
  //   } else {
  //     next()
  //   }
  // },
}
</script>

<style lang="scss">
.merchantList {
  .yahh {
    color: #409eff;
  }
  .el-table .cell.el-tooltip {
    text-align: center;
  }
  .sp-finder-search .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .clearfix span {
    font-weight: 700;
  }
  .search-field {
    width: 500px !important;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  .el-row {
    margin-bottom: 0px;
  }
  .el-table th {
    background: #f5f5f5;
    color: #000;
    text-align: center;
  }
  .btn {
    border: none;
  }
}
</style>

<style lang="scss" scoped>
.zyk_adapay_account {
  .group {
    margin: 30px 0;
    border: 1px solid #f5f5f5;
    .item {
      padding: 14px 0;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      .state {
        font-size: 14px;
        color: #000;
        font-weight: 300;
        margin-bottom: 20px;
      }
      .title {
        margin-bottom: 10px;
        border-right: 1px solid #000;
      }
    }
  }
  .tablelist {
    margin: 40px 0;
  }
  .pagination {
    margin: 20px 0;
    text-align: center;
  }
  .tips {
    .title {
      font-size: 15px;
    }
  }
}
</style>