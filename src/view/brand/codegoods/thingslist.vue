<template>
  <div class="">
    <div class="view-flex view-flex-middle content-bottom-padded">
      <div class="view-flex-item">当前共 {{ total_count }} 款商品</div>
      <div>
        <el-button @click="addCodeThings"> 创建商品 </el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in list" :key="index" :span="12">
        <div class="list-item view-flex">
          <div class="view-flex view-flex-item">
            <div class="thumbnail">
              <img :src="wximageurl + item.pic">
            </div>
            <div>
              <div class="item-title">
                {{ item.thing_name }}
              </div>
              <div class="item-date">
                {{ item.created | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div class="item-batch">
                共{{ item.batch_total_count }}个批次 合计{{ item.batch_total_quantity }}件
              </div>
            </div>
          </div>
          <div class="">
            <router-link
              :to="{
                path: '/brand/onecode/thingsbatchsdetail',
                query: { thing_id: item.thing_id }
              }"
            >
              <el-tooltip effect="light" content="批次信息" placement="top">
                <i class="iconfont icon-eye" />
              </el-tooltip>
            </router-link>
            <router-link
              :to="{ path: '/brand/onecode/things', query: { thing_id: item.thing_id } }"
            >
              <el-tooltip effect="light" content="物品编辑" placement="top">
                <i class="iconfont icon-pen" />
              </el-tooltip>
            </router-link>
            <router-link
              :to="{ path: '/brand/onecode/batchs', query: { thing_id: item.thing_id } }"
            >
              <el-tooltip effect="light" content="新建批次，下载码" placement="top">
                <i class="iconfont icon-download" />
              </el-tooltip>
            </router-link>
            <el-tooltip effect="light" content="删除物品" placement="top">
              <i class="iconfont icon-trash-alt1" @click="deleteThingsAction(item.thing_id)" />
            </el-tooltip>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getThingsList, getThingsDetail, deleteThings } from '../../../api/onecode'
export default {
  data() {
    return {
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      list: []
    }
  },
  mounted() {
    this.getCodeThingsList()
  },
  methods: {
    addCodeThings() {
      this.$router.push({ path: '/brand/onecode/things' })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getGoodsList()
    },
    editThingsAction(index, row) {
      // 编辑商品弹框
      this.$router.push({ path: '/brand/onecode/things/' + row.thing_id })
    },
    thingsDetail(index, row) {
      this.ItemsDetailVisible = true
      getThingsDetail(row.thing_id)
        .then(response => {
          this.itemsDetailData = response.data.data
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取物品信息出错'
          })
        })
    },
    getCodeThingsList() {
      this.loading = true
      getThingsList(this.params)
        .then(response => {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取物品列表列表信息出错'
          })
        })
    },
    deleteThingsAction(thing_id) {
      this.$confirm('此操作将删除该物品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteThings(thing_id)
            .then(response => {
              this.$message({
                message: '删除物品成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.getCodeThingsList()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除物品失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    priceformatter(row, column) {
      return '￥' + row.price / 100
    }
  }
}
</script>

<style scoped lang="scss">
.list-item {
  padding: 15px;
  background: #fff;
  margin-bottom: 15px;
  .thumbnail {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    margin-right: 15px;
    background: #f8f8f8;
    &::after {
      display: block;
      padding-top: 100%;
      content: '';
    }
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .item-title {
    margin-bottom: 6px;
    font-size: 18px;
    color: #333;
  }
  .item-date {
    font-size: 13px;
    color: #ccc;
  }
  .item-batch {
    font-size: 14px;
    color: #999;
  }
}
</style>
