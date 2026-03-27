<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div>
    <template
      v-if="
        $route.path.indexOf('detail') === -1 &&
        $route.path.indexOf('editor') === -1 &&
        $route.path.indexOf('dependents') === -1
      "
    >
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addPurchase">
          {{ $t('b8fcd182.6f0c8f') }}
        </el-button>
      </div>

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="activity_status" :label="$t('b8fcd182.1743c9')">
          <el-select
            v-model="params.activity_status"
            :placeholder="$t('b8fcd182.017a35')"
            clearable
            style="width: 100%"
          >
            <el-option :label="$t('b8fcd182.a8b0c2')" value="0" />
            <el-option :label="$t('b8fcd182.dd4e55')" value="waiting" />
            <el-option :label="$t('b8fcd182.fb852f')" value="ongoing" />
            <el-option :label="$t('b8fcd182.047fab')" value="it_has_ended" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="activity_status" :label="$t('b8fcd182.1cadc0')">
          <el-input v-model="params.purchase_name" :placeholder="$t('b8fcd182.7528b3')" />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-table
        v-loading="loading"
        border
        :data="tableList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="purchase_id" :label="$t('b8fcd182.be3322')" />
        <el-table-column prop="purchase_name" :label="$t('b8fcd182.39834b')" />
        <el-table-column prop="employee_limitfee" :label="$t('b8fcd182.358678')" />
        <el-table-column prop="dependents_limitfee" :label="$t('b8fcd182.82087c')" />
        <el-table-column prop="activity_status" :label="$t('b8fcd182.1181a5')">
          <template slot-scope="scope">
            {{ formatStatus(scope.row.activity_status) }}
          </template>
        </el-table-column>
        <el-table-column width="301" :label="$t('b8fcd182.e7adc9')">
          <template slot-scope="scope">
            {{ scope.row.begin_date }}
            <template v-if="scope.row.end_date"> ~ </template>
            {{ scope.row.end_date }}
          </template>
        </el-table-column>
        <el-table-column width="150" :label="$t('b8fcd182.2b6bc0')">
          <template slot-scope="scope">
            <div class="operating-icons">
              <el-button type="text">
                <router-link
                  :to="{
                    path: matchRoutePath('detail'),
                    query: {
                      id: scope.row.purchase_id
                    }
                  }"
                >
                  {{ $t('b8fcd182.607e7a') }}
                </router-link>
              </el-button>
              <el-button v-if="scope.row.activity_status == 'waiting'" type="text">
                <router-link
                  :to="{
                    path: matchRoutePath('editor'),
                    query: { id: scope.row.purchase_id }
                  }"
                >
                  {{ $t('b8fcd182.95b351') }}
                </router-link>
              </el-button>
              <el-button
                v-if="scope.row.activity_status != 'it_has_ended'"
                type="text"
                @click="deleteCard(scope.row.purchase_id, scope.$index)"
              >
                <span style="color: #f56c6c">{{ $t('b8fcd182.6489ff') }}</span>
              </el-button>
              <el-button type="text">
                <router-link
                  :to="{
                    path: matchRoutePath('dependents'),
                    query: {
                      id: scope.row.purchase_id
                    }
                  }"
                >
                  {{ $t('b8fcd182.0a822f') }}
                </router-link>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
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
import { endPurchase } from '@/api/purchase'
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
      activity_status: undefined,
      purchase_name: undefined
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      loadingbtn: false,
      checkedType: {},
      typeId: -1,
      multipleSelection: []
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    getParams() {
      let params = {
        ...this.params
      }
      return params
    },
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
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.purchase.getPurchaseList(params)
      if (list.length > 0) {
        this.tableList = list.map((item) => {
          item.dependents_limitfee = (item.dependents_limitfee / 100).toFixed(2)
          item.employee_limitfee = (item.employee_limitfee / 100).toFixed(2)
          return item
        })
        this.page.total = total_count
      } else {
        this.tableList = []
      }
      this.loading = false
    },
    addPurchase() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    deleteCard(id, index) {
      const that = this
      this.$confirm(this.$t('b8fcd182.726586'), this.$t('b8fcd182.02d981'), {
        cancelButtonText: this.$t('b8fcd182.625fb2'),
        confirmButtonText: this.$t('b8fcd182.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            endPurchase({ purchase_id: id })
            this.$message({
              type: 'success',
              message: this.$t('b8fcd182.dfb1d0'),
              onClose() {
                that.fetchList()
              }
            })
          }
          done()
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    formatStatus(status) {
      if (!status) return ''
      const map = {
        waiting: 'b8fcd182.dd4e55',
        ongoing: 'b8fcd182.fb852f',
        it_has_ended: 'b8fcd182.047fab'
      }
      return this.$t(map[status] || '')
    }
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
