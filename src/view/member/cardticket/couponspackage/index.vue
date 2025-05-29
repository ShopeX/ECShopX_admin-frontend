<template>
  <div class="zyk_coupon">
    <SpRouterView>
      <SpFinder
        ref="finder"
        :split-count="4"
        :fixed-row-action="true"
        :setting="setting"
        no-selection
        row-actions-width="200px"
        row-actions-fixed-align="left"
        :hooks="{ beforeSearch: beforeSearch }"
        url="/voucher/package/list"
      >
        <template v-slot:tableTop>
          <div>
            <el-popover v-model="showCode" placement="top" width="200" trigger="manual">
              <div style="position: relative">
                <img class="page-code" :src="appCodeUrl" />
                <!-- 关闭icon -->
                <i
                  class="el-icon-close"
                  style="position: absolute; right: 0; top: 0"
                  @click="showCode = false"
                />
                <div class="page-btns">
                  <el-button type="primary" plain size="mini" @click="handleDownload()">
                    下载码
                  </el-button>
                  <el-button type="primary" plain size="mini" @click="handleCopyLink()">
                    复制链接
                  </el-button>
                </div>
              </div>
            </el-popover>
            <div class="btn">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-circle-plus"
                @click="createCoupon"
              >
                创建劵包
              </el-button>
            </div>
            <div style="height: 20px" />
          </div>
        </template>
      </SpFinder>
    </SpRouterView>
  </div>
</template>

<script>
import setting_ from './setting/pageage'
import { getPageCode } from '@/api/marketing'
import api from '@/api'

export default {
  data() {
    return {
      areas: [],
      showCode: false,
      appCodeUrl: '',
      curPageUrl: '',
      appID: ''
    }
  },
  provide() {
    return {
      refresh: this.refresh
    }
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  mounted() {
    api.regionauth.getRegionauth().then((res) => {
      this.areas = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
    })
    this.fetchWechatList()
  },
  methods: {
    refresh() {
      this.$refs.finder.refresh(true)
    },
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      list.forEach((item, i) => {
        if (item.name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    createCoupon() {
      this.$router.push({
        path: `${this.$route.path}/editor`,
        query: {
          type: 'create'
        }
      })
    },
    beforeSearch(params) {
      return {
        ...params
      }
    },
    queryCoupon() {
      this.$refs.finder.refresh(true)
    },
    handleDownload() {
      const { title } = this.editRow
      var a = document.createElement('a')
      var temp = title
      if (this.appCodeUrl) {
        a.href = this.appCodeUrl
        a.download = temp + '.png'
        a.click()
      }
    },
    handleCopyLink() {
      this.$copyText(this.curPageUrl).then(() => {
        this.$message.success('复制成功')
      })
    },
    pushCouponHandle(row) {
      const page = 'subpages/marketing/coupon-center'
      this.curPageUrl = `${page}?card_id=${row.card_id}`
      let params = {
        wxaAppId: this.appID,
        page,
        card_id: row.card_id
      }
      getPageCode(params).then((response) => {
        this.appCodeUrl = response.data.data.base64Image
        this.showCode = true
      })
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
.zyk_coupon {
  .sp-finder-bd {
    padding: 16px 0px;
  }
}

.page-code {
  width: 100%;
}
</style>
