<template>
  <div class="zyk_page_register_Info_contactShop">
    <div class="part1">
      <el-form
        ref="form"
        :model="form"
      >
        <div class="top">
          <div class="left">
            <el-form-item>
              <el-select v-model="selectStatus">
                <el-option
                  label="按状态筛选"
                  value="1"
                />
                <el-option
                  label="按地区筛选"
                  value="2"
                />
              </el-select>
            </el-form-item>
            <template v-if="selectStatus == '1'">
              <el-form-item>
                <el-select
                  v-model="form.is_valid"
                  placeholder="全部状态"
                  @change="getList()"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-cascader
                v-model="form.address"
                placeholder="根据地区筛选"
                :options="regions"
                filterable
                :props="{ checkStrictly: true }"
                @change="RegionChangeSearch"
              />
            </template>
          </div>
          <div class="right">
            <el-form-item>
              <el-select v-model="nameSelect">
                <el-option
                  label="店铺名称"
                  value="1"
                />
                <el-option
                  label="联系人手机号"
                  value="2"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="nameSelect == '1'">
              <el-input
                v-model="form.name"
                placeholder="请输入店铺名称"
                @change="getList()"
              >
                <el-button
                  slot="append"
                  @click="getList"
                >
                  搜索
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item v-else>
              <el-input
                v-model="form.mobile"
                placeholder="请输入联系人手机号"
                @change="getList()"
              >
                <el-button
                  slot="append"
                  @click="getList"
                >
                  搜索
                </el-button>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item style="text-align: right">
          <el-button @click="resetForm('form')">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <span>快捷操作</span>
        <el-button
          size="mini"
          @click="dialogOpen()"
        >
          关联店铺
        </el-button>
      </div>
    </div>
    <el-card
      class="box-card"
      shadow="never"
    >
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          label="店铺编号"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.distributor_id }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="店铺名/联系人/手机号"
        >
          <template slot-scope="scope">
            <div class="store-name">
              {{ scope.row.name }}
            </div>
            <div class="store-contact">
              <span v-if="scope.row.contact">
                <i class="el-icon-user" />
                {{ scope.row.contact }}
              </span>
              <span>
                <i class="el-icon-mobile" />
                {{ scope.row.mobile }}
              </span>
            </div>
            <div
              v-if="scope.row.store_address"
              class="store-address"
            >
              <i class="el-icon-place" />
              {{ scope.row.store_address }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
        />
        <el-table-column label="店铺状态">
          <template slot-scope="scope">
            <span>{{
              (scope.row.is_valid === 'true' && '启用') ||
                (scope.row.is_valid === 'false' && '禁用') ||
                (scope.row.is_valid === 'delete' && '废弃')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              :style="{ color: 'red' }"
              type="text"
              size="mini"
              @click="cancelHandle(scope.row.distributor_id)"
            >
              取消关联
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="checkHandle(scope.row.distributor_id)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="content-padded content-center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="form.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="form.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <newShopSelects
      :get-status="ShopStatus"
      :adapay-member-id="adapayMemberId"
      :store-visible="storeVisible"
      @closeStoreDialog="closeStoreDialogAction"
    />
  </div>
</template>

<script>
import district from '@/common/district.json'
import { getDistributorList, adapayMemberBind } from '@/api/marketing'
import newShopSelects from '@/components/newShopSelects'

export default {
  components: { newShopSelects },
  data () {
    return {
      selectStatus: '1',
      nameSelect: '1',
      form: {
        is_valid: '',
        name: '',
        mobile: '',
        address: '',
        page: 1,
        pageSize: 20
      },
      dialogVisible: true,
      storeVisible: false,
      ShopStatus: false,
      adapayMemberId: this.$route.query.id,
      statusList: [
        { name: '全部', value: '' },
        { name: '启用', value: 'true' },
        { name: '禁用', value: 'false' },
        { name: '废弃', value: 'delete' }
      ],

      total_count: 0,
      loading: false,

      regions: district,
      list: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    async getList () {
      this.loading = true
      if (this.selectStatus == '1') {
        delete this.form.province
        delete this.form.city
        delete this.form.area
      } else {
        delete this.form.is_valid
      }
      if (this.nameSelect == '1') {
        delete this.form.mobile
      } else {
        delete this.form.name
      }
      delete this.form.address

      try {
        const result = await getDistributorList({
          ...this.form,
          adapay_member_id: this.adapayMemberId
        })
        console.log(result)
        this.total_count = result.data.data.total_count
        this.list = result.data.data.list
        this.loading = false
      } catch (error) {
        this.loading = false
        this.$message({
          type: 'error',
          message: '获取统计信息出错'
        })
      }
    },
    RegionChangeSearch (value) {
      var vals = this.getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.form.province = vals[0].label
        this.form.city = ''
        this.form.area = ''
      } else if (vals.length == 2) {
        this.form.province = vals[0].label
        this.form.city = vals[1].label
        this.form.area = ''
      } else if (vals.length == 3) {
        this.form.province = vals[0].label
        this.form.city = vals[1].label
        this.form.area = vals[2].label
      }
      this.form.page = 1
      this.getList()
    },
    handleCurrentChange (page) {
      this.form.page = page
      this.getList()
    },
    handleSizeChange (pageSize) {
      this.form.page = 1
      this.form.pageSize = pageSize
      this.getList()
    },
    resetForm (form) {
      this.$refs.form.resetFields()
      this.form.is_valid = ''
      this.form.name = ''
      this.form.mobile = ''
      this.form.address = ''
    },
    closeStoreDialogAction () {
      this.storeVisible = false
      this.ShopStatus = false
      this.getList()
    },
    dialogOpen () {
      this.storeVisible = true
      this.ShopStatus = true
    },
    // 取消关联
    cancelHandle (id) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        id: id,
        message: h('div', { style: 'padding-top:0px' }, [
          h('i', {
            style: 'color: #ff6700;font-size: 22px;margin-right:10px ;',
            class: 'el-icon-warning-outline icon'
          }),
          h(
            'span',
            { style: 'font-size: 14px;color:#000', class: 'tips' },
            '您确定要取消所选中的店铺关联关系吗？'
          ),
          h(
            'p',
            { style: 'font-size: 12px;margin-bottom:20px ;margin-left:32px ;' },
            '取消后会影响店铺正常交易，请确保无影响的情况下再做此操作!'
          )
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          console.log(action)
          console.log(instance)

          if (action === 'confirm') {
            const result = await adapayMemberBind({
              distributor_ids: JSON.stringify(instance.id),
              adapay_member_id: 0
            })
            done()
            if (result.data.data.status) {
              instance.confirmButtonLoading = false
              this.$message.success('取消成功')
              this.getList()
              // done("取消成功");
            }
            console.log(result)
          } else {
            done()
          }
        }
      }).then((action) => {
        console.log(123)
      })
    },
    // 查看
    checkHandle (id) {
      this.$router.push({
        path: '/store/storemanager/marketingdistributor/marketingdistributor_editor',
        query: {
          distributor_id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_page_register_Info_contactShop {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
    }
    .right {
      display: flex;
    }
  }
  .bottom {
    padding: 20px 30px;
    border-top: 1px solid #ebeef5;
    span {
      margin-right: 30px;
    }
    button {
      color: #409eff;
      border: 1px solid #409eff;
    }
  }
}
</style>
<style lang="scss">
.zyk_page_register_Info_contactShop {
  .el-message-box {
    display: inline-block;
    width: 450px;
  }
  .el-message-box__wrapper {
    position: fixed;
    top: -200px !important;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>
