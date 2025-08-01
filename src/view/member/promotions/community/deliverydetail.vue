<template>
  <div class="section section-white">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基本信息" name="first">
        <el-row>
          <el-col :span="8">
            <span>批次号：</span> <span>{{ detail.delivery_bn }}</span>
          </el-col>
          <el-col :span="8"> 社区店名称：{{ detail.community_name }} </el-col>
          <el-col :span="8">
            状态:
            <el-tag v-if="detail.status === 'PENDING'" type="info"> 待发货 </el-tag>
            <el-tag v-if="detail.status === 'SHIPPED'" type="primary"> 待收货 </el-tag>
            <el-tag v-if="detail.status === 'DONE'" type="success"> 已送达 </el-tag>
            <el-tag v-if="detail.status === 'BADDONE'" type="warning"> 已送达，有报损 </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span> 店号:</span><span>{{ detail.shop_number }}</span>
          </el-col>
          <el-col :span="8">
            <span> 站点号:</span><span>{{ detail.site_number }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            创建日期：{{ detail.created_time | datetime('YYYY-MM-DD HH:mm:ss') }}
          </el-col>
          <el-col :span="8">
            发货时间：<span v-if="detail.shipped_time">
              {{ detail.shipped_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </el-col>
          <el-col :span="8">
            签收时间:
            <span v-if="detail.finish_time">{{
              detail.finish_time | datetime('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <span> 配送地址:</span><span>{{ detail.address }}</span>
          </el-col>
          <el-col :span="8">
            备注：
            <el-input
              v-model="detail.memo"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
              @blur="handleSetMemo()"
            />
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="detail.items" border :height="wheight - 270">
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column label="商品图片" min-width="50">
            <template slot-scope="scope">
              <img :src="wximageurl + scope.row.item_pic" width="50">
            </template>
          </el-table-column>
          <el-table-column prop="item_name" label="商品名称" min-width="100" />
          <el-table-column prop="num" label="商品数量" min-width="100" />
          <el-table-column prop="item_bn" label="商品编号" min-width="100" />
          <el-table-column prop="item_unit" label="单位" min-width="100" />
          <el-table-column prop="bad_item_num" label="报损数量" min-width="100" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getDeliveryOrderDetail,
  shippingDeliveryorder,
  setDeliveryorderMemo
} from '../../../../api/community'
export default {
  data() {
    return {
      activeName: 'first',
      detail: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    if (this.$route.params.delivery_id) {
      this.getDetail()
    } else {
      this.$router.go(-1)
    }
  },
  methods: {
    handleSetMemo() {
      setDeliveryorderMemo({ memo: this.detail.memo, delivery_id: this.detail.delivery_id }).then(
        res => {
          this.$message({
            type: 'success',
            message: '备注更新成功'
          })
        }
      )
    },
    // 发货确认
    shippedHandle(row) {
      this.$confirm('是否确认已发货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          shippingDeliveryorder({ delivery_id: row.delivery_id }).then(response => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getDetail() {
      this.loading = true
      getDeliveryOrderDetail(this.$route.params.delivery_id).then(response => {
        this.detail = response.data.data
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
