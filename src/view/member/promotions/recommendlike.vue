<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app pc alipay />
    <div class="action-container">
      <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="AddRecommendLikeItem">
        添加商品
      </el-button>
      <el-button type="primary" plain @click="DelItemData('true')"> 清除所有商品 </el-button>
    </div>

    <el-table ref="multipleItemsTable" v-loading="loading" border :data="tableList">
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="DelItemData('false', scope.row)"> 删除关联 </el-button>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column prop="itemName" label="商品图片" width="300"></el-table-column> -->
      <el-table-column prop="itemName" label="商品名称" width="300" />
      <el-table-column prop="price" label="商品价格" width="120">
        <template slot-scope="scope"> {{ scope.row.price / 100 }}元 </template>
      </el-table-column>
      <el-table-column prop="sort" label="商品排序" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sort" @change="editItemSort(scope.$index, scope.row)">
            <i slot="suffix" class="el-input__icon el-icon-edit" />
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="approve_status" label="状态" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.approve_status === 'onsale'" class="grid-content">前台可销售</div>
          <div v-else-if="scope.row.approve_status === 'offline_sale'" class="grid-content">
            前台不展示
          </div>
          <div v-else class="grid-content">不可销售</div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="page.page > page.pageSize" class="mt-4 text-right">
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

    <sideBar :visible.sync="show_sideBar" title="选择商品" width="60">
      <div v-if="editItemSortVisible">
        <el-row>
          <el-col :span="4">
            <el-button type="primary" :loading="loading" size="mini" @click="submitActivityAction">
              保存
            </el-button>
          </el-col>
        </el-row>
        <el-table v-if="form.items.length > 0" :data="form.items" style="line-height: normal">
          <el-table-column label="ID" prop="item_id" width="60" />
          <el-table-column label="名称" prop="item_name" />
          <el-table-column label="排序" width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sort" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-row>
          <el-col :span="8">
            <el-button type="primary" class="el-icon-plus" size="mini" @click="relItems">
              选择商品
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" @click.native="handleCancel"> 返回 </el-button>
            <el-button type="primary" :loading="loading" size="mini" @click="submitActivityAction">
              保存
            </el-button>
          </el-col>
        </el-row>
        <el-table v-if="form.items.length > 0" :data="form.items" style="line-height: normal">
          <el-table-column label="ID" prop="item_id" width="60" />
          <el-table-column label="名称" prop="item_name" />
          <el-table-column label="排序" width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sort" size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <i class="iconfont icon-trash-alt" @click="deleteItemRow(scope.$index, form.items)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </sideBar>
    <GoodsSelect
      :items-visible="itemVisible"
      :get-status="setItemStatus"
      :rel-items-ids="relItemsIds"
      @chooseStore="chooseItemsAction"
      @closeStoreDialog="closeItemDialogAction"
    />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import shopSelect from '@/components/shopSelect'
import {
  saveRecommendLikeItem,
  deleteRecommendLikeItem,
  updateRecommendLikeSort,
  getRecommendLikeItems
} from '@/api/promotions'
import GoodsSelect from '@/components/goodsSelect'
import sideBar from '@/components/element/sideBar'
import { pageMixin } from '@/mixins'

export default {
  components: {
    shopSelect,
    sideBar,
    GoodsSelect
  },
  mixins: [pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  props: ['isLoad'],
  data() {
    return {
      editItemSortVisible: false,
      itemVisible: false,
      itemVisible: false,
      setItemStatus: false,
      show_sideBar: false,
      relItemsIds: [],
      loading: false,
      form: {
        items: []
      },
      params: {
        distributor_id: '',
        is_warning: false,
        keywords: ''
      },
      list: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    isLoad(val) {
      if (val) {
        this.fetchList()
        //this.getDistributorItemList()
      }
    }
  },
  mounted() {
    //this.getDistributorItemList()
    this.fetchList()
  },
  methods: {
    getParams() {
      let params = {
        ...this.params
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.promotions.getRecommendLikeItemList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    AddRecommendLikeItem() {
      this.show_sideBar = true
      getRecommendLikeItems().then(res => {
        if (res.data.data.list) {
          this.relItemsIds = res.data.data.list
        }
      })
    },
    DelItemData(isAll, row) {
      this.show_sideBar = false
      let title = '将删除该商品推荐，是否继续?'
      let param = ''
      if (row) {
        param = row.id
      }
      if (isAll === 'true') {
        title = '将清除所有商品，是否继续?'
        param = 'all'
      }
      if (param) {
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteRecommendLikeItem(param).then(response => {
              this.fetchList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        this.$message({
          type: 'info',
          message: '操作数据有误'
        })
      }
    },
    relItems() {
      this.itemVisible = true
      this.setItemStatus = true
    },
    handleCancel() {
      this.show_sideBar = false
    },
    submitActivityAction() {
      saveRecommendLikeItem(this.form).then(res => {
        this.fetchList()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.show_sideBar = false
        this.itemVisible = false
        this.form.items = []
        this.relItemsIds = []
        this.setItemStatus = false
      })
    },
    chooseItemsAction(data) {
      this.itemVisible = false
      this.setItemStatus = false
      this.relItemsIds = data
      if (data === null || data.length <= 0) return
      let arr = []
      data.forEach((item, index) => {
        let newData = ''
        let isInArr = this.form.items.findIndex(n => n.item_id == item.itemId)
        if (isInArr == -1) {
          newData = {
            distributor_id: item.distributor_id,
            item_id: item.itemId,
            item_name: item.itemName,
            sort: item.sort
          }
        } else {
          newData = this.form.items[index]
        }
        arr.push(newData)
      })
      this.form.items = arr
    },
    closeItemDialogAction() {
      this.itemVisible = false
    },
    deleteItemRow(index, rows) {
      rows.splice(index, 1)
      this.form.items = rows
      this.setItemStatus = false
      this.relItemsIds.splice(index, 1)
    },
    editItemSort(index, rows) {
      let params = {
        id: rows.id,
        item_id: rows.item_id,
        sort: rows.sort
      }
      updateRecommendLikeSort(params).then(res => {
        if (res.data.data) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      })
    },
    editItemsStore(index, row) {
      if (row.is_total_store === false && (row.store == '' || row.store <= 0)) {
        this.$message({
          type: 'error',
          message: '非总部发货时，库存不能小于等于0!'
        })
        return
      }
      let form = {
        distributor_id: row.distributor_id,
        item_id: row.item_id,
        is_total_store: row.is_total_store,
        store: row.store
      }
      this.updateDistributorItem(form)
    },
    async getDistributorItemList() {
      let distributor = await this.getDefaultDistributor()
      if (distributor) {
        this.params.distributor_id = distributor.distributor_id
      }
    }
  }
}
</script>
