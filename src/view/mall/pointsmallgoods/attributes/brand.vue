<template>
  <div>
    <el-row :gutter="40">
      <el-col>
        <el-input
          v-model="params.attribute_name"
          class="input-b"
          placeholder="品牌名称"
          @change="brandSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="brandSearch"
          />
        </el-input>
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleNew"
        >
          新增品牌
        </el-button>
      </el-col>
    </el-row>
    <el-card>
      <el-table
        v-loading="loading"
        :data="list"
        :height="wheight - 170"
        element-loading-text="数据加载中"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
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
          label="品牌图片"
          width="150"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 70px; height: 70px"
              :src="scope.row.image_url"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="attribute_name"
          label="品牌名称"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.attribute_id">
              <el-input
                v-model="scope.row.attribute_name"
                placeholder="请输入品牌名称"
              />
            </div>
            <div v-else>
              {{ scope.row.attribute_name }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="content-padded content-center">
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
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <sideBar
      :visible.sync="show_sideBar"
      :title="'新增品牌'"
    >
      <el-form>
        <el-form-item label="品牌名">
          <el-input v-model="form.attribute_name" />
        </el-form-item>
        <el-form-item label="品牌logo">
          <div class="frm-tips">
            只能上传jpg/png文件，且不超过2M （建议尺寸：200px * 200px）
          </div>
          <div
            class="upload-box"
            @click="handleImgPicker"
          >
            <img
              v-if="form.image_url"
              :src="form.image_url"
              class="avatar"
            >
            <i
              v-else
              class="iconfont icon-camera avatar-uploader-icon"
            />
          </div>
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
  deleteGoodsAttr
} from '../../../../api/pointsmall'
import sideBar from '@/components/element/sideBar'
export default {
  components: {
    sideBar,
    imgPicker
  },
  data () {
    return {
      form: {
        attribute_type: 'brand',
        attribute_id: '',
        attribute_name: '',
        image_url: ''
      },
      params: {
        page: 1,
        pageSize: 10,
        attribute_type: 'brand',
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
    this.getList()
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    handleDelete (data) {
      this.$confirm('确认删除该品牌？')
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
        attribute_id: '',
        attribute_type: 'brand',
        attribute_name: '',
        image_url: ''
      }
    },
    handleEdit (data) {
      this.show_sideBar = true
      this.form = {
        attribute_id: data.attribute_id,
        attribute_type: data.attribute_type,
        attribute_name: data.attribute_name,
        image_url: data.image_url
      }
    },
    save () {
      // 如果没有id，则表示为新增
      if (!this.form.attribute_id) {
        addGoodsAttr(this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.params.page = 1
          this.resetData()
          this.getList()
        })
      } else {
        updateGoodsAttr(this.form.attribute_id, this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.getList()
        })
      }
    },
    getList () {
      this.loading = true
      getGoodsAttr(this.params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    // 品牌搜索
    brandSearch () {
      this.getList()
    },
    handleImgChange (data) {
      this.imgDialog = true
      this.isGetImage = true
      this.imgIndex = data.$index
    },
    handleImgPicker () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.image_url = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
      this.isGetImage = false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 150px;
  height: 150px;
  img {
    width: 100%;
  }
  .avatar-uploader-icon {
    line-height: 100px;
  }
}
</style>
