<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="zyk_video">
    <template v-if="$route.path.indexOf('editor') === -1">
      <SpPlatformTip />
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="wxapp_id" label="针对人群:">
          <el-select v-model="params.wxapp_id" placeholder="请选择小程序">
            <el-option
              v-for="(item, index) in wxaList"
              :key="index"
              :label="item.nick_name"
              :value="item.authorizer_appid"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <el-card>
        <el-table
          v-loading="loading"
          :data="tableList"
          border
          element-loading-text="数据加载中"
          :default-sort="{ prop: 'bind_date', order: 'descending' }"
        >
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchHidePage('editor'),
                  query: { roomid: scope.row.roomid, wxapp_id: params.wxapp_id }
                }"
              >
                视频回放
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="直播间图片" width="250">
            <template slot-scope="scope">
              <img
                v-if="scope.row.share_img"
                :src="scope.row.share_img"
                width="display:block;width:100px"
              >
              <img v-else src="https://fakeimg.pl/50x50/EFEFEF/CCC/?text=brand&font=lobster">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="直播间名称" />
          <el-table-column label="直播时间" width="300">
            <template slot-scope="scope">
              {{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss') }} -
              {{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div v-if="page.total > page.pageSize" class="content-padded content-center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="page.pageIndex"
          :page-sizes="[10, 20, 50]"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
        />
      </div>
    </template>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWxaAuthList } from '@/api/wxa'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      wxapp_id: undefined
    }

    return {
      initialParams,
      params: {
        ...initialParams
      },
      wxaList: [],
      loading: false,
      imgDialog: false,
      isGetImage: false,
      imgIndex: 0,
      brand_name: '',
      show_sideBar: false,
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.getWxaList()
    this.fetchList()
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    getParams() {
      let params = {
        ...this.params
      }
      return params
    },
    async fetchList() {
      if (!this.params.wxapp_id) {
        return false
      }
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.promotions.getLiverooms(params)
      this.tableList = list
      this.page.total = Number(total_count)
      this.loading = false
    },
    getWxaList() {
      getWxaAuthList().then((response) => {
        this.wxaList = response.data.data.list
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.sku-value {
  margin-right: 10px;
}
.sku-img {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 5px;
  vertical-align: middle;
}
.key-item {
  padding-bottom: 10px;
  .iconfont {
    color: #999;
  }
}
.upload-box {
  width: 50px;
  height: 50px;
  .avatar-uploader-icon {
    line-height: 50px;
    font-size: 20px;
  }
}
.grade-setting-col {
  line-height: 40px;
}
.btn-gap {
  margin-left: 10px;
}
</style>

<style lang="scss">
.zyk_video {
  .el-table .cell img {
    display: block;
    width: 100px;
  }
}
</style>
