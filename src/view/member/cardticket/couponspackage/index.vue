<template>
  <div class="zyk_coupon">
    <SpRouterView>
      <div class="top">
        <div class="btn">
          <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="createCoupon">
            创建劵包
          </el-button>
        </div>
        <div class="search">
          <el-input v-model="title" placeholder="请入劵包标题" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="queryCoupon" />
          </el-input>
        </div>
      </div>
      <SpFinder
        ref="finder"
        :split-count="4"
        :fixed-row-action="true"
        :setting="setting"
        no-selection
        :hooks="{ beforeSearch: beforeSearch }"
        url="/voucher/package/list"
      />
    </SpRouterView>
  </div>
</template>

<script>
import setting_ from './setting/pageage'
export default {
  data() {
    return {
      title: ''
    }
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  mounted() {},
  methods: {
    createCoupon() {
      this.$router.push({
        path: `${this.$route.path}/editor`,
        query: {
          type: 'create'
        }
      })
    },
    beforeSearch(params) {
      params.title = this.title
      return { ...params }
    },
    queryCoupon() {
      this.$refs.finder.refresh(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_coupon {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search {
      width: 500px;
    }
  }
}
</style>

<style lang="scss">
.zyk_coupon {
  .sp-finder-bd {
    padding: 16px 0px;
  }
}
</style>
