<template>
  <div>
    <!--搜索添加-->
    <!-- <el-row :gutter="40">
      <el-col>
        <el-input class="input-b" placeholder="国家名称" v-model="params.keywords" @change="origincountrySearch">
          <el-button slot="append" icon="el-icon-search" @click="origincountrySearch"></el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleNew">新增国家</el-button>
      </el-col>
    </el-row> -->

    <el-row
      class="filter-header"
      :gutter="20"
    >
      <el-col>
        <el-input
          v-model="params.keywords"
          class="input-b"
          placeholder="国家名称"
          @change="origincountrySearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="origincountrySearch"
          />
        </el-input>
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleNew"
        >
          新增国家
        </el-button>
      </el-col>
    </el-row>

    <el-card>
      <el-table
        v-loading="loading"
        :data="list"
        element-loading-text="数据加载中"
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
          prop="attribute_name"
          label="国家"
          width="150"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.origincountry_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="国旗">
          <template slot-scope="scope">
            <el-image
              style="width: 40px; height: 40px"
              :src="scope.row.origincountry_img_url"
              fit="cover"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分页-->
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

    <!--新增修改-->
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <sideBar
      :visible.sync="show_sideBar"
      :title="'新增产地国家'"
    >
      <el-form>
        <el-form-item label="国家名称">
          <el-input
            v-model="form.origincountry_name"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="国旗">
          <div class="frm-tips">
            只能上传jpg/png文件，且不超过2M （建议尺寸：200px * 200px）
          </div>
          <div
            class="upload-box"
            @click="handleImgPicker"
          >
            <img
              v-if="form.origincountry_img_url"
              :src="form.origincountry_img_url"
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
import sideBar from '@/components/element/sideBar'
import {
  getOrigincountry,
  addOrigincountry,
  updateOrigincountry,
  delOrigincountry
} from '../../../api/crossborder'

export default {
  components: {
    sideBar,
    imgPicker
  },

  data () {
    return {
      loading: false,
      imgDialog: false,
      isGetImage: false,
      show_sideBar: false,
      // 提交数据
      form: {
        origincountry_id: '',
        origincountry_name: '',
        origincountry_img_url: ''
      },
      // 搜索数据
      total_count: 0,
      params: {
        page: 1,
        pageSize: 10,
        keywords: ''
      },
      // 列表数据
      list: []
    }
  },
  mounted () {
    this.handleCurrentChange()
  },
  methods: {
    // 搜索
    origincountrySearch () {
      this.handleCurrentChange()
    },
    // 新增编辑
    handleNew () {
      this.show_sideBar = true
      this.resetData()
    },
    // 编辑
    handleEdit (data) {
      this.show_sideBar = true
      this.form = {
        origincountry_id: data.origincountry_id,
        origincountry_name: data.origincountry_name,
        origincountry_img_url: data.origincountry_img_url
      }
    },
    // 删除
    handleDelete (data) {
      this.$confirm('确认删除该国家么？')
        .then((_) => {
          delOrigincountry(data.row.origincountry_id, []).then((res) => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
        .catch((_) => {})
    },
    // 初始化
    resetData () {
      this.form = {
        origincountry_id: '',
        origincountry_name: '',
        origincountry_img_url: ''
      }
    },
    // 上传图片
    handleImgPicker () {
      this.imgDialog = true
      this.isGetImage = true
    },
    // 保存数据
    save () {
      if (!this.form.origincountry_name) {
        this.$message({ type: 'error', message: '请填写国家名称' })
      }

      if (!this.form.origincountry_id) {
        addOrigincountry(this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.params.page = 1
          this.resetData()
          this.getList()
        })
      } else {
        updateOrigincountry(this.form.origincountry_id, this.form).then((res) => {
          this.$message({ type: 'success', message: '操作成功' })
          this.getList()
        })
      }
    },
    // 分页
    handleCurrentChange (page_num = 1) {
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    // 获取列表
    getList () {
      console.log('获取数据')
      this.loading = true
      getOrigincountry(this.params).then((res) => {
        console.log('返回数据', res)
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    // 上传图片
    pickImg (data) {
      this.form.origincountry_img_url = data.url
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
  width: 100px;
  height: 100px;
  img {
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon {
    line-height: 100px;
  }
}
</style>
