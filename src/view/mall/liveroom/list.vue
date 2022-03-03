<template>
  <div class="zyk_video">
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col>
          <el-select
            v-model="params.wxapp_id"
            placeholder="请选择小程序"
            style="width: 30%"
            @change="handleChangeAppId"
          >
            <el-option
              v-for="(item, index) in wxaList"
              :key="index"
              :label="item.nick_name"
              :value="item.authorizer_appid"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-card>
        <el-table
          v-loading="loading"
          :data="liveroomsList"
          element-loading-text="数据加载中"
          :default-sort="{ prop: 'bind_date', order: 'descending' }"
        >
          <el-table-column
            label="操作"
            width="150"
          >
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
          <el-table-column
            label="直播间图片"
            width="250"
          >
            <template slot-scope="scope">
              <img
                v-if="scope.row.share_img"
                :src="scope.row.share_img"
                width="display:block;width:100px"
              >
              <img
                v-else
                src="https://fakeimg.pl/50x50/EFEFEF/CCC/?text=brand&font=lobster"
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="直播间名称"
          />
          <el-table-column
            label="直播时间"
            width="300"
          >
            <template slot-scope="scope">
              {{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss') }} -
              {{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div
        v-if="total_count > params.pageSize"
        class="content-padded content-center"
      >
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page.sync="params.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLiverooms } from '@/api/promotions'
import { getWxaAuthList } from '@/api/wxa'
export default {
  data () {
    return {
      currentIndex: '',
      liveroomsList: [],
      wxaList: [],
      params: {
        wxapp_id: '',
        page: 1,
        pageSize: 10
      },
      loading: false,
      imgDialog: false,
      isGetImage: false,
      imgIndex: 0,
      brand_name: '',
      total_count: 0,
      show_sideBar: false
    }
  },
  mounted () {
    this.getWxaList()
    this.getLiveroomsList()
  },
  methods: {
    getLivereplays (row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.roomid })
    },
    getLiveroomsList () {
      if (!this.params.wxapp_id) {
        return false
      }
      getLiverooms(this.params).then((res) => {
        this.liveroomsList = res.data.data.list
        this.total_count = res.data.data.total_count
      })
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getLiveroomsList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getLiveroomsList()
    },
    getWxaList () {
      getWxaAuthList().then((response) => {
        this.wxaList = response.data.data.list
      })
    },
    handleChangeAppId (row) {
      this.getLiveroomsList()
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
