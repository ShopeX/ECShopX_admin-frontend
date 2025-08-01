<template>
  <div>
    <el-tabs v-model="activeName" class="section-white content-padded">
      <el-tab-pane label="评论列表" name="first">
        <el-row :gutter="20">
          <el-col :span="12">
            <shop-select wxshops @update="storeChange" @init="initChange" />
            <!--distributors wxshops 需要哪个api传哪个-->
          </el-col>
        </el-row>
        <div>
          <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%"
            element-loading-text="数据加载中"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="nickname" label="会员名称" />
            <el-table-column prop="content" label="评论内容" />
            <el-table-column label="评论照片">
              <template slot-scope="scope">
                <div class="comment-photo">
                  <template v-for="item in scope.row.pics">
                    <img width="60" height="60" :src="item">
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="评论时间">
              <template slot-scope="scope">
                <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" @click.native.prevent="hid(scope.row)">
                  <span v-if="scope.row.hid">取消隐藏</span><span v-else>隐藏</span>
                </el-button>
                <el-button size="small" @click.native.prevent="top(scope.row)">
                  <span v-if="scope.row.stuck">取消置顶</span><span v-else>置顶</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="total_count > pageSize" class="tc">
          <el-pagination
            layout="prev, pager, next"
            :total="total_count"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import shopSelect from '@/components/shopSelect'
import { getCommentList, upadteComment } from '../../../api/shop'
export default {
  components: {
    shopSelect
  },
  data() {
    return {
      activeName: 'first',
      loading: false,
      params: {},
      total_count: 0,
      pageSize: 20,
      list: [],
      currentShop: '',
      wxShopsList: []
    }
  },
  mounted() {
    this.getcomments(param)
  },
  methods: {
    shopHandle(val) {
      val && val.shop_id
      this.currentShop = val.shop_id
      this.getParams()
      this.getcomments(this.params)
    },
    handleCurrentChange(val) {
      this.params = { page: val, pageSize: this.pageSize }
      this.loading = false
      this.getcomments(this.params)
    },
    hid(row) {
      let commentId = row.comment_id
      let val = !row.hid
      this.updateComment(commentId, { is_hide: val })
    },
    top(row) {
      let commentId = row.comment_id
      let val = !row.stuck
      this.updateComment(commentId, { is_stick: val })
    },
    getParams() {
      this.params.shop_id = this.currentShop
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getcomments(filter) {
      this.loading = true
      getCommentList(filter).then(response => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    },
    updateComment($commentId, params) {
      upadteComment($commentId, params).then(res => {
        this.getcomments()
      })
    },
    tableRowClassName(row, rowIndex) {
      if (rowIndex <= 9 && row.stuck) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #8d8d8d;
  }
}
.comment-photo {
  img {
    display: inline-block;
    margin: 0 5px;
  }
}
</style>
<style type="text/css">
.el-table .warning-row {
  background: oldlace;
}
</style>
