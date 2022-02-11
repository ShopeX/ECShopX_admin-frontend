<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select
            v-model="fetchParams.activity_status"
            @change="dataSearch"
            placeholder="请选择活动状态"
            clearable
            style="width: 100%"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="未开始" value="waiting"></el-option>
            <el-option label="进行中" value="ongoing"></el-option>
            <el-option label="已结束" value="it_has_ended"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input clearable placeholder="请输入活动名称" v-model="fetchParams.purchase_name">
            <el-select
              v-model="fetchParams.purchase_name"
              clearable
              slot="prepend"
              placeholder="活动名称"
              @change="dataSearch"
              style="width: 120px"
            >
              <el-option
                v-for="item in cardList"
                :key="item.purchase_name"
                :label="item.purchase_name"
                :value="item.purchase_name"
              >
              </el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="dataSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-circle-plus" @click="addCoupon"
            >新增活动</el-button
          >
        </el-col>
      </el-row>
      <el-card>
        <el-table :data="cardList" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column prop="purchase_id" label="活动ID"></el-table-column>
          <el-table-column prop="purchase_name" label="活动名称"></el-table-column>
          <el-table-column prop="employee_limitfee" label="员工额度"> </el-table-column>
          <el-table-column prop="dependents_limitfee" label="家属额度"> </el-table-column>
          <el-table-column prop="activity_status" label="活动状态">
            <template slot-scope="scope">
              {{ scope.row.activity_status | formatStatus }}
            </template>
          </el-table-column>
          <el-table-column width="280" label="活动有效期">
            <template slot-scope="scope">
              {{ scope.row.begin_date }}
              <template v-if="scope.row.end_date">~</template>
              {{ scope.row.end_date }}
            </template>
          </el-table-column>
          <el-table-column width="120" label="操作">
            <template slot-scope="scope">
              <div class="operating-icons">
                <el-button type="text">
                  <router-link
                    :to="{
                      path: matchHidePage('detail'),
                      query: {
                        id: scope.row.purchase_id
                      }
                    }"
                    >查看</router-link
                  >
                </el-button>
                <el-button type="text" v-if="scope.row.activity_status == 'waiting'">
                  <router-link
                    :to="{
                      path: matchHidePage('editor'),
                      query: { id: scope.row.purchase_id }
                    }"
                    >编辑</router-link
                  >
                </el-button>
                <el-button
                  type="text"
                  v-if="scope.row.activity_status != 'it_has_ended'"
                  @click="deleteCard(scope.row.purchase_id, scope.$index)"
                  ><span style="color: #f56c6c">终止活动</span></el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="pagers.total"
            :page-size="pageSize"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPurchaseList, endPurchase } from '@/api/purchase'
export default {
  provide() {
    return {
      refresh: this.getPurchaseList
    }
  },
  data() {
    return {
      loading: false,
      loadingbtn: false,
      checkedType: {},
      cardList: [],
      pagers: {
        total: 0
      },
      typeId: -1,
      pageSize: 10,
      currentPage: 1,
      fetchParams: {
        activity_status: '',
        purchase_name: '',
        page: 1,
        pageSize: 10
      },
      multipleSelection: []
    }
  },
  filters: {
    formatStatus(status) {
      var str = ''
      switch (status) {
        case 'waiting':
          str = '未开始'
          break
        case 'ongoing':
          str = '进行中'
          break
        case 'it_has_ended':
          str = '已结束'
          break
      }
      return str
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchParams.page = val
      this.getPurchaseList()
    },
    handleSizeChange(val) {
      this.fetchParams.pageSize = val
      this.getPurchaseList()
    },
    handleClick(tab, event) {},
    addCoupon() {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    deleteCard(id, index) {
      const that = this
      this.$confirm('确定要终止该活动？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            endPurchase({ 'purchase_id': id })
            this.$message({
              type: 'success',
              message: '终止成功',
              onClose() {
                that.getPurchaseList()
              }
            })
          }
          done()
        }
      })
    },
    getPurchaseList() {
      this.loading = true
      var params = {
        activity_status: this.fetchParams.activity_status,
        purchase_name: this.fetchParams.purchase_name,
        page: this.fetchParams.page,
        pageSize: this.fetchParams.pageSize
      }
      getPurchaseList(params)
        .then((res) => {
          if (res.data.data.list.length > 0) {
            this.cardList = res.data.data.list.map((item) => {
              item.dependents_limitfee = (item.dependents_limitfee / 100).toFixed(2)
              item.employee_limitfee = (item.employee_limitfee / 100).toFixed(2)
              return item
            })
            this.pagers.total = res.data.data.total_count
            this.loading = false
          } else {
            this.cardList = []
            this.loading = false
          }
        })
        .catch((error) => {
          this.loading = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    dataSearch() {
      this.fetchParams.page = 1
      this.getPurchaseList(this.fetchParams)
    }
  },
  mounted() {
    this.getPurchaseList()
  }
}
</script>
<style scoped lang="scss">
.el-icon-edit {
  cursor: pointer;
}
.coupon-list {
  margin-top: 10px;
}
.coupon-item {
  position: relative;
  height: 130px;
  padding: 25px 20px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dadadd;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  width: 19%;
  float: left;
  margin: 0.5%;
  &.coupon-add {
    padding-top: 20px;
    cursor: pointer;
    i {
      font-size: 40px;
    }
    :last-child {
      margin-top: 10px;
    }
  }
  .price {
    font-size: 24px;
  }
  .color-gray {
    color: #99a9bf;
  }
  .color-gray-deep {
    color: #8492a6;
  }
  .item-code {
    display: inline-block;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span.icon-triangle {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 34px solid #20a0ff;
    border-left: 34px solid transparent;
    color: #fff;
  }
  label {
    position: absolute;
    top: -34px;
    right: 0;
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
}
.item-bg {
  position: absolute;
  left: 0;
  bottom: -101%;
  width: 100%;
  height: 100%;
  background: rgba(241, 244, 246, 0.9);
  text-align: left;
  border-radius: 5px;
  padding-top: 8px;
  transition: all 0.4s ease;
  p {
    padding: 0 10px;
  }
  .item-operate {
    position: absolute;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    padding: 4px 0;
    text-align: center;
    cursor: pointer;
    a {
      color: #fff;
    }
  }
}
.coupon-item:hover {
  .item-bg {
    bottom: 0;
  }
}
.coupon-type-item {
  position: relative;
  padding: 30px 10px;
  border: 1px solid #ff5000;
  color: #ff5000;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  &:first-child {
    font-size: 18px;
  }
  .coupon-type-desc {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: -100%;
    left: 0;
    padding: 10px 0;
    background: #ff5000;
    color: #fff;
    font-size: 18px;
    transition: all 0.4s ease;
    div:last-child {
      width: 70%;
      margin: 8px auto 0;
      font-size: 12px;
    }
  }
  &:hover {
    .coupon-type-desc {
      bottom: 0;
    }
  }
}

.coupon-type-item,
.sendout-item {
  overflow: hidden;
  .icon-checked {
    display: none;
    width: 100px;
    height: 25px;
    transform: rotate(35deg);
    position: absolute;
    font-size: 14;
    top: 5px;
    right: -25px;
    font-size: 20px;
    color: #fff;
    background: #ff5000;
    i {
      transform: rotate(-35deg);
    }
  }
  &.checked {
    .icon-checked {
      display: block;
    }
  }

  &:hover .icon-checked {
    background: #fff;
    i {
      color: #ff5000;
    }
  }
}
.store-pop {
  padding: 20px 15px;
  .store-content {
    margin-bottom: 15px;
  }
}
</style>
