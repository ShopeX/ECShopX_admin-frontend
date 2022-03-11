<template>
  <div>
    <div class="action-container">
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        @click="handleNew"
      >
        新增规格
      </el-button>
    </div>
    <SpFilterForm
      :model="params"
      @onSearch="onSearch"
      @onReset="onSearch"
    >
      <SpFilterFormItem
        prop="attribute_name"
        label="规格名称:"
      >
        <el-input
          v-model="params.attribute_name"
          placeholder="请输入规格名称"
        />
      </SpFilterFormItem>
    </SpFilterForm>
    <div class="action-container">
      <el-button
        type="primary"
        plain
        @click="syncItemSpec"
      >
        同步规格
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      border
      :data="list"
      :height="wheight - 170"
      element-loading-text="数据加载中"
      :default-sort="{ prop: 'bind_date', order: 'descending' }"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <span
            v-for="(item, index) in props.row.attribute_values.list"
            :key="index"
            class="sku-value"
          ><img
            v-if="item.image_url"
            class="sku-img"
            :src="item.image_url"
          >{{
            item.attribute_value
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(scope)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="150"
      >
        <template slot-scope="props">
          <!-- {{ JSON.parse(props.row.is_image) ? '图片' : '文字' }} -->
          {{ props.row.is_image == '1' ? '图片' : '文字' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="attribute_name"
        label="规格名称"
        width="200"
      />
      <el-table-column
        prop="attribute_memo"
        label="规格备注"
      />
    </el-table>
    <div class="content-padded content-center">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <sideBar
      :visible.sync="show_sideBar"
      :title="'新增规格'"
    >
      <el-form>
        <el-form-item label="规格名称">
          <el-input v-model="form.attribute_name" />
        </el-form-item>
        <el-form-item label="规格备注">
          <el-input v-model="form.attribute_memo" />
        </el-form-item>
        <el-form-item label="规格类型">
          <el-radio-group v-model="form.is_image">
            <el-radio :label="false">
              文字
            </el-radio>
            <el-radio :label="true">
              图片
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格值">
          <div class="clearfix" />
          <div
            v-for="(item, index) in form.attribute_values"
            :key="index"
            class="view-flex view-flex-middle key-item"
          >
            <div
              v-if="form.is_image"
              class="upload-box"
              @click="handleImgPicker(index)"
            >
              <img
                v-if="item.image_url"
                :src="item.image_url"
                class="avatar"
              >
              <i
                v-else
                class="iconfont icon-camera avatar-uploader-icon"
              />
            </div>
            <div
              class="view-flex-item"
              :class="form.is_image ? 'content-h-padded' : 'content-padded-right'"
            >
              <el-input
                v-model="item.attribute_value"
                placeholder="规格值名称"
              />
            </div>
            <div
              class="iconfont icon-trash-alt1"
              @click="removeItem(index)"
            />
          </div>
          <el-button
            type="default"
            size="small"
            @click="addItem"
          >
            添加规格值
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="save"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import imgPicker from '@/components/imageselect'
import {
  getGoodsAttr,
  addGoodsAttr,
  updateGoodsAttr,
  deleteGoodsAttr,
  syncItemSpec
} from '../../../../api/goods'
import { pageMixin } from '@/mixins'
import sideBar from '@/components/element/sideBar'
export default {
  components: {
    sideBar,
    imgPicker
  },
  mixins: [pageMixin],
  data () {
    return {
      currentIndex: '',
      form: {
        is_image: false,
        attribute_type: 'item_spec',
        attribute_id: '',
        attribute_name: '',
        attribute_memo: '',
        attribute_values: []
      },
      params: {
        attribute_type: 'item_spec',
        attribute_name: ''
      },
      list: [],
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
    this.fetchList()
  },
  methods: {
    handleDelete (data) {
      this.$confirm('确认删除该参数？')
        .then((_) => {
          deleteGoodsAttr(data.row.attribute_id).then((res) => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
        .catch((_) => {})
    },
    handleNew () {
      this.show_sideBar = true
      this.resetData()
    },
    resetData () {
      this.form = {
        is_image: false,
        attribute_type: 'item_spec',
        attribute_id: '',
        attribute_name: '',
        attribute_memo: '',
        attribute_values: []
      }
    },
    handleEdit (data) {
      this.show_sideBar = true
      this.form = {
        is_image: JSON.parse(data.is_image),
        attribute_id: data.attribute_id,
        attribute_type: data.attribute_type,
        attribute_name: data.attribute_name,
        attribute_memo: data.attribute_memo,
        attribute_values: data.attribute_values.list
      }
    },
    addItem () {
      if (this.form.attribute_values.length > 50) {
        this.$message({ type: 'warning', message: '最多添加50项' })
        return
      }
      let item = {
        attribute_value: '',
        image_url: ''
      }
      this.form.attribute_values.push(item)
    },
    removeItem (index) {
      this.$confirm('确认删除当前值？')
        .then((_) => {
          this.form.attribute_values.splice(index, 1)
        })
        .catch((_) => {})
    },
    save () {
      let params = JSON.parse(JSON.stringify(this.form))
      params.attribute_values = JSON.stringify(params.attribute_values)
      console.log(params)
      // 如果没有id，则表示为新增
      if (!this.form.attribute_id) {
        addGoodsAttr(params).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.page.pageIndex = 1
          this.resetData()
          this.fetchList()
        })
      } else {
        updateGoodsAttr(params.attribute_id, params).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.fetchList()
        })
      }
    },
    fetchList () {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getGoodsAttr(params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    // 品牌搜索
    // onSearch() {
    //   this.page.pageIndex = 1
    //   this.fetchList()
    // },
    handleImgChange (data) {
      this.imgDialog = true
      this.isGetImage = true
      this.imgIndex = data.$index
    },
    handleImgPicker (index) {
      this.currentIndex = index
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.attribute_values[this.currentIndex].image_url = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
      this.isGetImage = false
    },
    syncItemSpec () {
      syncItemSpec().then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: '已加入执行队列'
          })
        } else {
          this.$message({
            type: 'error',
            message: '同步失败'
          })
        }
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
.sp-filter-form {
  margin-bottom: 16px;
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
  .avatar {
    width: 50px;
    height: 50px;
  }
  .avatar-uploader-icon {
    line-height: 50px;
    font-size: 20px;
  }
}
</style>
